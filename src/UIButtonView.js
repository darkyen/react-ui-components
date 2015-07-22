import React from 'react';
import componentHandler from 'material-design-lite';

class UIButtonView extends React.Component{
	constructor(man){
		super(man);
	}

	componentDidMount(){
		let el = React.findDOMNode(this);
		componentHandler.upgradeElement(el);
	}

	componentWillUnmount(){
		let el = React.findDOMnode(this);
		componentHandler.downgradeElements(el);
	}

	render(){
		return 	<button {...this.props} className="mdl-button mdl-js-button">{this.props.children}</button>;
	}
}

export default UIButtonView;