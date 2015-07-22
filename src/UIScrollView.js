import React from 'react';
import Ring from './lib/Ring';
import {Promise} from 'es6-promise';
import SmartScroll from './lib/SmartScroll';

// @Internal
// @Example
// <UIScrollViewElement renderer data height order/>

class UIScrollViewElement extends React.Component{
	constructor(props){
		super(props);
		this.state = {};
		if( props.data instanceof Promise ){
			this.state.isPromised = true;
			props.data.then(data => this.setState({data}));
			return;
		}
		this.state.data = this.props.data;
	}
	
	render(){
		let styling = {
			height: this.props.height,
			order : this.props.order,
			WebkitOrder: this.props.order
		};
		
		if( this.state.isPromised && !this.state.data ){
			return <div className="ListView--Element" style={styling} />
		}		

		return 	<div className="ListView--Element" style={styling}>
					<this.props.renderer data={this.props.data} />
				</div>;
	}
}

/* @Component
	 @name: UIScrollView
	 
	 @attributes
		 
		 @attribute 
			@name: elementRenderer
			@type: React.Component
			@desc: Reference to the class to render components.
		 
		 @attribute
			@name: backDrop
			@optional: true
			@type: React.Component
			@desc: In case the data is to be queried online this will
						 render a loading state, defaults to DefaultBackProp
			
		 @attribute
			@name: dataSource
			@type: ListView.DataSource
			@desc: A datasource from which items will be generated
						 in case the data is to be queried a promise may 
						 be returned, the listview will wait this can be
						 a use case for querying items dynamically like
						 UITableView
						 
		 @attribute: 
			@name: elementHeight
			@type: integer
			@desc: Height of individual element to be rendered,
						 this will be passed on to the containers.
		
		 @attribute: 
			@NOT_IMPLEMENTED
			@name: layout
			@type: ItemRendererClass
 */


class UIScrollView extends React.Component{
	constructor(props){
		super(props);
		this.state = { 
			range: {
				 startPoint: -1,
				 endPoint  : -1,
				 inViewPort:  0,
				 totalElements: 0,
				 elements  : []
			}
		};
	}
	
	shouldSkipRender(r1,r2){
		return r1.totalElements === r2.totalElements && r1.startPoint === r2.startPoint && r1.endPoint === r2.endPoint; 
	}
	
	isDiffLen(range1, range2){
		return range1.totalElements != range2.totalElements;
	}
	
	isReusable(range1, range2){
		//why ? because fuck redability thats why
		return  range1.startPoint > range2.startPoint ? range1.startPoint < range2.endPoint : range1.endPoint > range2.startPoint;
	}

	getRangeOfElements(scrollTop, viewPortHeight, elementHeight){
		let inViewPort    = Math.ceil(viewPortHeight/elementHeight);
		let outOfViewPort = inViewPort;
		let startPoint    = Math.max(Math.floor(scrollTop / elementHeight) - outOfViewPort, 0);
		let length  = this.props.dataSource.length;

		let totalElements = inViewPort + outOfViewPort + outOfViewPort;
		
		if( totalElements >= length ){
			totalElements = length - 1;	
		}

		let endPoint      = startPoint + totalElements;
		
		if( endPoint >= length ){
			endPoint = length - 1;
			startPoint  =  endPoint - totalElements;
		}
		// run updates via batching.
		console.log(startPoint, endPoint, inViewPort, totalElements, scrollTop);
		return {startPoint, endPoint, inViewPort, totalElements, scrollTop};
	}
	
// index of node
// order of node

	computeBoundsAndUpdateRange(scrollLeft, scrollTop){
		// maybe cache this ?
		let viewPortHeight = this.viewPortHeight;
		let {elementHeight, elementRenderer, dataSource} = this.props;
		let newRange = this.getRangeOfElements(scrollTop, viewPortHeight, elementHeight);
		let currentRange = this.state.range;
		let elements;
		if( this.shouldSkipRender(newRange, currentRange)){
			return;
			// elements = currentRange.elements;
		}else{
			if( !this.isDiffLen(newRange, currentRange) && this.isReusable(newRange, currentRange) ){
				elements = currentRange.elements;
				let offset   = newRange.startPoint - currentRange.startPoint;
				let goingUp  = offset < 0;
				let startPoint = goingUp ? newRange.startPoint : newRange.endPoint;
				let length = dataSource.length;
				let noop = (s) => {};
				let mapData = (element, index) => {
						let itemIndex = goingUp ? startPoint + index : startPoint - index;
						if( itemIndex > newRange.endPoint ){ console.error("OUT OF BOUND") };
						element.node =  <UIScrollViewElement 
											key={element.i} order={itemIndex} 
											data={dataSource.getItemAtIndex(itemIndex)} 
											height={elementHeight} renderer={elementRenderer} 
										/>;
				}
				
				if( goingUp ){
					elements.turnAntiClockwise(-offset, mapData);
				}else{
					elements.turnClockwise(offset, mapData);
				}            

			}else{

				elements = new Ring();
				let node = null;
				for( let i = newRange.startPoint ; i <= newRange.endPoint ; i++ ){
					node =  <UIScrollViewElement 
								key={i} order={i} data={dataSource.getItemAtIndex(i)} 
								height={elementHeight} renderer={elementRenderer} 
							/>;
					elements.push({node, i});
				}
			}
		}		
		
		newRange.elements = elements;
		this.setState({
			isReady: true,
			range: newRange
		});
	}
	
	componentDidMount(){
		// give browser time to sync ui
		let scrollWrapper = React.findDOMNode(this),
			{elementHeight} = this.props,
			len = this.props.dataSource.length;
		this.viewPortHeight = scrollWrapper.offsetHeight;
		this.viewPortWidth  = scrollWrapper.offsetWidth;

		// scrollWrapper.addEventListener('mousewheel', this.channelScroll.bind(this));
		// if( 'ontouchstart' in window ){
		// 	scrollWrapper.addEventListener('touchstart', this.channelTouchStart.bind(this));
		// 	scrollWrapper.addEventListener('touchmove', this.channelTouchMove.bind(this));
		// 	scrollWrapper.addEventListener('touchend', this.channelTouchEnd.bind(this));	
		// }else{
		this.scroller = new SmartScroll(scrollWrapper, {
			raf: false,
			eventPerSecond: 10
		});

		this.scroller.on('scroll.move',  e => this.channelNativeScroll(e));
		// }

		// this.scroller.setDimensions(this.viewPortWidth, this.viewPortHeight, this.viewPortWidth, len * elementHeight);
		this.computeBoundsAndUpdateRange(0, 0);
	}
	
	prepareRenderedArray(){
		let range = this.state.range;

		return range.elements.mapClockwise( (item) => {
			return item.node;
		});
	}           

	handleScroll(left, top, zoom){
		this.computeBoundsAndUpdateRange(left, top);
	}
	
	// channelTouchStart(e){
	// 	console.log(e.touches);
	// 	this.scroller.doTouchStart(e.touches, e.timeStamp);
	// }

	// channelTouchMove(e){
	// 	this.scroller.doTouchMove(e.touches, e.timeStamp);
	// }

	// channelTouchEnd(e){
	// 	this.scroller.doTouchEnd(e.timeStamp);
	// }
	
	channelNativeScroll(e){
		this.handleScroll(e.scrollLeft, e.scrollTop, 1);
	}

	render(){
		// @todo: find better method.
		if( !this.state.isReady ){
			return <div className="ListView"><div className="ListView--Inner"></div></div>;
		}

		let styling = { height: this.state.range.startPoint * this.props.elementHeight };
		let contentH = { minHeight: this.props.dataSource.length * this.props.elementHeight };
		return  <div className="ListView">
					<div className="ListView--Inner" style={contentH}>
						<div className="ListView--Padder" style={styling} />
						{this.prepareRenderedArray()}
					</div>
				</div>;
	}
};

export default {UIScrollView, UIScrollViewElement};
