import React from 'react';

if (!Object.assign) {
  Object.defineProperty(Object, 'assign', {
    enumerable: false,
    configurable: true,
    writable: true,
    value: function(target) {
      'use strict';
      if (target === undefined || target === null) {
        throw new TypeError('Cannot convert first argument to object');
      }

      var to = Object(target);
      for (var i = 1; i < arguments.length; i++) {
        var nextSource = arguments[i];
        if (nextSource === undefined || nextSource === null) {
          continue;
        }
        nextSource = Object(nextSource);

        var keysArray = Object.keys(Object(nextSource));
        for (var nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex++) {
          var nextKey = keysArray[nextIndex];
          var desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
          if (desc !== undefined && desc.enumerable) {
            to[nextKey] = nextSource[nextKey];
          }
        }
      }
      return to;
    }
  });
}

// Use inline-style completely
class DrawerView extends React.Component{
	constructor(props){
		super(props);
	}

	render(){
		return <div className={'DrawerView ' + (this.props.navOpen?'DrawerView--drawer-open':'')}>
					<div className='DrawerView--Nav'>
						<div className='DrawerView--NavMast'>
							{this.props.header}
						</div>
						<ul className='DrawerView--NavLinks'>
							{this.props.links.map(link => {
								return <li className="DrawerView--NavLink"><a href={link.href}>{link.name}</a></li>
							})}
						</ul>
					</div>
					<div className='DrawerView--Contents'>
						{this.props.children}
					</div>
			   </div>;
	}
}

DrawerView.defaultProps = {
	links: []
};

DrawerView.propTypes = {
	links: React.PropTypes.array,
	header: React.PropTypes.element
};
export default DrawerView;