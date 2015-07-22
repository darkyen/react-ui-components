import React from 'react';
import classNames from 'classnames';
import componentHandler from 'material-design-lite';

class UILoader extends React.Component{
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
		let cn = classNames("mdl-spinner mdl-js-spinner is-active", this.props.className);
		return <div className={cn}></div>
	}
}

export default UILoader;