
import React from 'react';
import classNames from 'classnames';

class Layout extends React.Component{
	render(){
		let cname = classNames(
			{'Vertical-Layout': this.props.vertical},
			{'Horizontal-Layout': this.props.horizontal}
		);
		
		let styles = this.props;

		return  <div className={cname} style={styles}>
					{this.props.children}
				</div>;
	}
}

class FlexCell extends React.Component{
	render(){
		if( this.props.fillFix === true ){
			return <div className='Cell-Flex'><div className="flex-fill-fix">{this.props.children}</div></div>
		}
		return <div className='Cell-Flex'>{this.props.children}</div>
	}
}

class FixedCell extends React.Component{
	render(){
		return <div className={'Cell-Fixed ' + this.props.className}>{this.props.children}</div>
	}
}

export default {Layout, FixedCell, FlexCell};