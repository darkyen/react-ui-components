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
  //  // return false;
  // }

    render() {
        let {key, className, titleText, actions, supportingText, menuButtons, ...props} = this.props;
      
        let title = {};
        let menu  = {};
        let supportingComp = {};
        let actionsComp = {};
        let cname = classNames("mdl-card mdl-shadow--2dp demo-card-wide", className);
        if( titleText ){
          title = <div className="mdl-card__title">
                    <h2 className="mdl-card__title-text">{titleText}</h2>
                  </div>;
        }

        if( actions ){
          actions = !Array.isArray(actions)?[actions]:actions;
          actionsComp = <div className="mdl-card__actions mdl-card--border">{actions}</div>
        }

        if( supportingText ){
          supportingComp = <div className="mdl-card__supporting-text">{supportingText}</div>;
        }

        if( menuButtons ){
          menuButtons = !Array.isArray(menuButtons)?[menuButtons]:menuButtons;
          menu = <div className="mdl-card__menu">{menuButtons}</div> 
        }


        return  <div className={cname} {...props}>
                  {title}
                  {supportingComp}
                  {actionsComp}
                  {menu} 
                </div>;
        
    }
}

export default Textfield;