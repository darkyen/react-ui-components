import React from 'react';
import componentHandler from 'material-design-lite';
import classNames from 'classnames';

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
		let {className, ripple, raised, colored, icon, mini, fab, ...props} = this.props
		let cname = classNames("mdl-button mdl-js-button",{
			'mdl-js-ripple-effect': ripple,
			'mdl-button--mini-fab': mini,
			'mdl-button--raised': raised,
			'mdl-button--icon': icon,
			'mdl-button--fab': fab,
			'mdl-button--colored': colored
		}, className);
		return 	<button {...props} className={cname}>{this.props.children}</button>;
	}
}

export default UIButtonView;