import React, { PropTypes } from 'react';
import classNames from 'classnames';
import _ from 'lodash';
import componentHandler from 'material-design-lite';

class Textfield extends React.Component {
	constructor(man){
		super(man);
	}

	componentDidMount(){
		let el = React.findDOMNode(this);
		componentHandler.upgradeElement(el);
	}

	componentWillUnmount(){
		let el = React.findDOMNode(this);
		componentHandler.downgradeElements(el);
	}

	// shouldComponentUpdate(){
	// 	// return false;
	// }

    render() {
        let id = 'textfield-' + this.props.label.replace(/\s+/g, '-');
        let {floating, expandable, key, multiline, className, ...props} = this.props;
        let cname = classNames("mdl-textfield", "mdl-js-textfield", {
        	 'mdl-textfield--floating-label': floating
        }, className);


		return	<div className={cname}>
					<input className="mdl-textfield__input" type="text" id={id} {...props} />
					<label className="mdl-textfield__label" htmlFor={id}>{this.props.label}</label>
				</div>;        
    }
}

export default Textfield;