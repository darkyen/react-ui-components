import React from 'react';
import SmartScroll from './lib/SmartScroll.js';
import Ring from './lib/Ring.js';
import {Layout, FlexCell, FixedCell} from './UILayout.js';
import classnames from 'classnames';
import Swiper from 'swiper';
import componentHandler from 'material-design-lite';
// shall we use UIScrollView ?
// maybe but not now.

class MDLSwiperTabsView extends React.Component{
	constructor(props){
		super(props);
		this.props.options = this.props.options || {};
		this.swiper = {
			activeIndex: 0
		};
	}
	
	componentDidMount(){
		let element = React.findDOMNode(this.refs.swipeContainer);
		let tabs    = React.findDOMNode(this);

		this.swiper = new Swiper(element, this.props.options);
		this.swiper.on('slideChangeEnd',  (e) => this.updateMagicLinePosition(e));
		this.swiper.on('sliderMove', (e) => this.slideMove(e));
		this.updateMagicLinePosition(this.swiper);
	}

	componentWillUnmount(){
		let element = React.findDOMNode(this.refs.swipeContainer);
		this.swiper.destroy();
	}
	
	updateMagicLinePosition(e){
		let activeIndex = e.activeIndex;
		let tabHeaders = React.findDOMNode(this.refs.tabHeaders);
		let magicHandle = React.findDOMNode(this.refs.magicHandle);

		let activeHeader = tabHeaders.children[activeIndex];
		let newWidth = activeHeader.offsetWidth;
		let newLeft = activeHeader.offsetLeft;

		magicHandle.style.width =  newWidth + 'px';
		magicHandle.style.left = newLeft + 'px';
	}

	slideMove(e){
		console.log(-e.translate);
	}
	
	openTab(index){
		this.swiper.slideTo(index, 300);
	}

	render(){
		return 	<div className="mdl-tabs mdl-js-tabs mdl-js-ripple-effect mdl-swipe-tabs">
					<ul className="mdl-tabs__tab-bar" ref="tabHeaders">
						{React.Children.map(this.props.children, (element, index) => {
							let className = classnames('mdl-tabs__tab');
							return <li 
										onClick={e => this.openTab(index)} 
										className={className}
									>{element.props.title}</li>
						})}
					</ul>
					
					<div className="mdl-tabs__custom-line">
						<div ref="magicHandle" className="mdl-tabs__custom-line__drag"></div>
					</div>

					<div ref="swipeContainer" className="swiper-container">
						<div className="swiper-wrapper flex-fill-fix">
							{React.Children.map(this.props.children, (element, index) => {
								return 	<div key={index} className='swiper-slide'>
											{element}
									   	</div>
							})}
						</div>
					</div>
				</div>
	}
}

class UITabsView extends React.Component{
	/*  
		This will do a lot more than we think,
		first off how to get those nifty transitions in windows phone everywhere.
	*/
	constructor(props){
		super(props);
		this.state = {
			selectedTab: 0,
			fingerPosition: 0
		};
	}

	componentDidMount(){
		let scrollerNode = React.findDOMNode(this.refs.foo);
		this._scroller = new SmartScroll(scrollerNode,{
			eventPerSecond: 10,
			// snapEvents: true,
			raf: false
		});

		this._scroller.on('scroll.end', this._handleScrollEnd.bind(this));
	}
	
	_handleScrollEnd(e){
		console.log(e);
		let scrollerNode = React.findDOMNode(this.refs.foo);
		let viewPortWidth = scrollerNode.offsetWidth;
		let scrollX = e.scrollLeft + (viewPortWidth/2);
		let index = Math.floor(scrollX/viewPortWidth);
		scrollerNode.scrollLeft = index * viewPortWidth;
		// this.setState({
		// 	selectedTab: index
		// });
	}


	openTab(index){
		let scroller = React.findDOMNode(this.refs.foo);
		scroller.scrollLeft = this.viewPortWidth * index;
	}

	// Tabs must support swipe gesture if enabled
	// @todo: use width via css.

	render(){
		let containerStyle = {
			transform: 'translateX(' + this.state.fingerPosition + 'px)'
		};
		// console.log(this.viewPortWidth); 
		return <div className='TabView' 
				>
					<Layout vertical={true}>
						<FixedCell>
							<ul className='TabView--Headers'>
								{React.Children.map(this.props.children, (element, index) => {
									let className = classnames('TabView--TabHeader', {
										'TabView--TabHeader-active': index === this.state.selectedTab
									});
									return <li onClick={e => this.openTab(index)} className={className}>{element.props.title}</li>
								})}
							</ul>
						</FixedCell>
						<FlexCell fillFix={true}>
							<div className='TabView--ScrollContainer' ref="foo" style={containerStyle}>
								{React.Children.map(this.props.children, (element, index) => {
									return 	<div key={index} className='TabView--TabWrapper' style={{ left: ''  + 100 * (index - this.state.selectedTab) + '%', }}>
												{element}
										   	</div>
								})}
							</div>
						</FlexCell>
					</Layout>
			   </div>
	}
}

export default MDLSwiperTabsView;