import React from 'react';
import DataSource from './lib/DataSource';
// Flipview is a selectable
// uses snap points if available
// only keeps 3 elements in memory 
// at at time and uses scroller 

class UIFlipView extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			selected: this.props.initallySelected,
			incomingDelta: 0
		}
	}
	
	componentDidMount(){
		let flipView = React.findDOMNode(this);
		flipView.addEventListener('touchstart', this._handleTouchStart);
		flipView.addEventListener('touchmove', this._handleTouchMove);
		flipView.addEventListener('touchend', this._handleTouchEnd);
	}

	componentWillReceiveProps(newProps){
		this.setState({
			selected: newProps
		});
	}
	_handleTouchStart(e){
		this.lastX = e.touches[0].pageX;
	}

	_handleTouchMove(e){
		let currX = e.touches[0].pageX;
		let dx = currX - this.lastX;

		if( !this.isDragging && dx > 50 ){			
			this.isDragging = true;
			this.state.fingerMovement = 0;
			this.state.opacity = 100;
		}

		if( this.isDragging == true ){
			this.lastX = currX;
			this.setState({
				fingerMovement: this.state.fingerMovement + dx,
				opacity: this.state.opacity - (dx / 10)
			});		
		}		
	}

	_handleTouchEnd(e){
		this.isDragging = false;
	}

	render(){

		let currentItem = this.props.dataSource.getItemAtIndex(this.state.selected);
		let incomingItem;

		let currentElement = <this.props.elementRenderer item={currentItem}/>;
		let incomingElement = '';

		let currentElementStyle = {
			'WebkitTransform': 'translateX(' + this.state.fingerMovement + ')',
			'msTransform': 'translateX(' + this.state.fingerMovement + ')',
			'transform': 'translateX(' + this.state.fingerMovement + ')',
			'opacity': this.state.opacity
		};

		if( this.state.incomingDelta !== 0 ){
			incomingItem  = this.props.dataSource.getItemAtIndex(this.state.selected + this.state.incomingDelta);
			incomingElement   = <this.props.elementRenderer item={incomingItem} />
		}

		return  <div className='FlipView'>
					<div className='FlipView--Selected' style={currentElementStyle}>{currentElement}</div>
					<div className='FlipView--Incoming'>{incomingElement}</div>
			    </div>;
	}
}

UIFlipView.propTypes = {
	dataSource: React.PropTypes.instanceOf(DataSource),
	elementRenderer: React.PropTypes.element,
	initiallySelected: React.PropTypes.number
};

export default UIFlipView;