import React from 'react';
import SmartScroll from './lib/SmartScroll.js';
import Ring from './lib/Ring.js';
import {Layout, FlexCell, FixedCell} from './UILayout.js';
import classnames from 'classnames';
// shall we use UIScrollView ?
// maybe but not now.
class UITabsView extends React.Component{
	/*  
		This will do a lot more than we think,
		first off how to get those nifty transitions in windows phone everywhere.
	*/
	constructor(props){
		super(props);
		this.state = {
			selectedTab: 0,
		};
	}

	componentDidMount(){
		let domNode = React.findDOMNode(this);
		let scrollerNode = React.findDOMNode(this.refs.foo);
		this.scroller = new SmartScroll(scrollerNode, {
			raf: false,
			eventPerSecond: 10
		});
		this.viewPortWidth = domNode.offsetWidth;
		window.x = scrollerNode;
		this.scroller.on('scroll.end', e => this._handleScrollEnd(e));
		this.setState({
			mounted: true
		});
	}
	
	_handleScrollEnd(e){
		console.log(e);
		let viewPortWidth = this.viewPortWidth;
		let scrollX = e.scrollLeft + (this.viewPortWidth/2);
		this.setState({
			selectedTab: Math.floor(scrollX/viewPortWidth)
		});
	}

	// Tabs must support swipe gesture if enabled
	// @todo: use width via css.

	render(){
		let containerWidth = this.viewPortWidth * React.Children.count(this.props.children);
		let contentWidth   = this.viewPortWidth;
		console.log(this.viewPortWidth); 
		return <div className='TabView'>
					<Layout vertical={true}>
						<FixedCell>
							<ul className='TabView--Headers'>
								{React.Children.map(this.props.children, (element, index) => {
									let className = classnames('TabView--TabHeader', {
										'TabView--TabHeader-active': index === this.state.selectedTab
									});
									return <li className={className}>{element.props.title}</li>
								})}
							</ul>
						</FixedCell>
						<FlexCell fillFix={true}>
							<div className='TabView--ScrollContainer' ref="foo">
								<div className='TabView--TabsContainer' style={{ width: containerWidth }}>
									{React.Children.map(this.props.children, element => {
										return <div className='TabView--TabWrapper' style={{ width: contentWidth }}>
													{element}
											   </div>
									})}
								</div>
							</div>
						</FlexCell>
					</Layout>
			   </div>
	}
}

export default UITabsView;