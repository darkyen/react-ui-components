import React from 'react';
import SmartScroll from './lib/SmartScroll.js';
import Ring from './lib/Ring.js';
import {Layout, FlexCell, FixedCell} from './UILayout.js';

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
			selected: 0,
		};
	}

	componentDidMount(){
		let domNode = React.findDOMNode(this);
		this.scroller = new SmartScroll(domNode, {
			raf: false,
			eventPerSecond: 10
		});

		this.viewPortWidth = domNode.offsetWidth;
		this.scroller.on('scroll.end', this._handleScrollEnd.bind(this));
	}
	
	_handleScrollEnd(){
		// handleth the scroll
		// smoothet it if possibru.
	}

	// Tabs must support swipe gesture if enabled.ntrn
	render(){
		return <div className='TabView'>
					<Layout vertical={true}>
						<FixedCell>
							<ul className='TabView--Headers'>
								{React.Children.map(this.props.children, element => {
									console.log(element.props);
									return <li className="TabView--TabHeader">{element.props.title}</li>
								})}
							</ul>
						</FixedCell>
						<FlexCell fillFix={true}>
							<div className='TabView--TabsContainer'>
								{React.Children.map(this.props.children, element => {
									return <div className='TabView--TabWrapper'>
												{element}
										   </div>
								})}
							</div>
						</FlexCell>
					</Layout>
			   </div>
	}
}

export default UITabsView;