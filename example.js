require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactUiComponents = require('react-ui-components');

var _srcLibDataSourceJs = require('../../src/lib/DataSource.js');

var _srcLibDataSourceJs2 = _interopRequireDefault(_srcLibDataSourceJs);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var Feed = (function (_DataSource) {
	function Feed(length) {
		_classCallCheck(this, Feed);

		_get(Object.getPrototypeOf(Feed.prototype), 'constructor', this).call(this);
		this._max = length;
	}

	_inherits(Feed, _DataSource);

	_createClass(Feed, [{
		key: 'getItemAtIndex',
		value: function getItemAtIndex(index) {
			if (index < 0 || index > this._max) {
				return _srcLibDataSourceJs2['default'].IndexOutOfBound;
			}
			return {
				title: 'Title #' + index,
				image: 'http://lorempixel.com/443/400/?t=' + index + '.' + Math.random(),
				descp: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla paria.'
			};
		}
	}, {
		key: 'length',
		get: function get() {
			return this._max;
		}
	}]);

	return Feed;
})(_srcLibDataSourceJs2['default']);

var Random = (function (_React$Component) {
	function Random() {
		_classCallCheck(this, Random);

		_get(Object.getPrototypeOf(Random.prototype), 'constructor', this).apply(this, arguments);
	}

	_inherits(Random, _React$Component);

	_createClass(Random, [{
		key: 'render',
		value: function render() {
			var random = this.props.data;
			return _react2['default'].createElement(
				'div',
				{ className: 'Random' },
				_react2['default'].createElement('img', { className: 'Random--Image', src: random.image }),
				_react2['default'].createElement(
					'div',
					{ className: 'Random--Details' },
					_react2['default'].createElement(
						'h2',
						{ className: 'Random--Title' },
						random.title
					),
					_react2['default'].createElement(
						'p',
						{ className: 'Random--Content' },
						random.descp
					)
				)
			);
		}
	}]);

	return Random;
})(_react2['default'].Component);

;

var UIHeaderView = (function (_React$Component2) {
	function UIHeaderView() {
		_classCallCheck(this, UIHeaderView);

		_get(Object.getPrototypeOf(UIHeaderView.prototype), 'constructor', this).apply(this, arguments);
	}

	_inherits(UIHeaderView, _React$Component2);

	_createClass(UIHeaderView, [{
		key: 'render',
		value: function render() {
			return _react2['default'].createElement(
				'div',
				{ className: 'HeaderView' },
				_react2['default'].createElement(
					Layout,
					{ horizontal: true, alignItems: 'center' },
					_react2['default'].createElement(
						FixedCell,
						null,
						this.props.primaryButton
					),
					_react2['default'].createElement(
						FlexCell,
						null,
						_react2['default'].createElement(
							'h1',
							null,
							this.props.title
						)
					),
					_react2['default'].createElement(
						FixedCell,
						null,
						this.props.secondaryButtons
					)
				)
			);
		}
	}]);

	return UIHeaderView;
})(_react2['default'].Component);

var Layout = (function (_React$Component3) {
	function Layout() {
		_classCallCheck(this, Layout);

		_get(Object.getPrototypeOf(Layout.prototype), 'constructor', this).apply(this, arguments);
	}

	_inherits(Layout, _React$Component3);

	_createClass(Layout, [{
		key: 'render',
		value: function render() {
			var cname = (0, _classnames2['default'])({ 'Vertical-Layout': this.props.vertical }, { 'Horizontal-Layout': this.props.horizontal });

			var styles = {
				alignItems: this.props.alignItems
			};

			return _react2['default'].createElement(
				'div',
				{ className: cname, style: styles },
				this.props.children
			);
		}
	}]);

	return Layout;
})(_react2['default'].Component);

var FlexCell = (function (_React$Component4) {
	function FlexCell() {
		_classCallCheck(this, FlexCell);

		_get(Object.getPrototypeOf(FlexCell.prototype), 'constructor', this).apply(this, arguments);
	}

	_inherits(FlexCell, _React$Component4);

	_createClass(FlexCell, [{
		key: 'render',
		value: function render() {
			if (this.props.fillFix === true) {
				return _react2['default'].createElement(
					'div',
					{ className: 'Cell-Flex' },
					_react2['default'].createElement(
						'div',
						{ className: 'flex-fill-fix' },
						this.props.children
					)
				);
			}
			return _react2['default'].createElement(
				'div',
				{ className: 'Cell-Flex' },
				this.props.children
			);
		}
	}]);

	return FlexCell;
})(_react2['default'].Component);

var FixedCell = (function (_React$Component5) {
	function FixedCell() {
		_classCallCheck(this, FixedCell);

		_get(Object.getPrototypeOf(FixedCell.prototype), 'constructor', this).apply(this, arguments);
	}

	_inherits(FixedCell, _React$Component5);

	_createClass(FixedCell, [{
		key: 'render',
		value: function render() {
			return _react2['default'].createElement(
				'div',
				{ className: 'Cell-Fixed' },
				this.props.children
			);
		}
	}]);

	return FixedCell;
})(_react2['default'].Component);

var App = (function (_React$Component6) {
	function App(p) {
		_classCallCheck(this, App);

		_get(Object.getPrototypeOf(App.prototype), 'constructor', this).call(this, p);
		this.dataSource = new Feed(5000);
		this.state = {
			navOpen: false
		};
	}

	_inherits(App, _React$Component6);

	_createClass(App, [{
		key: 'toggleDrawer',
		value: function toggleDrawer() {
			this.setState({
				navOpen: !this.state.navOpen
			});
		}
	}, {
		key: 'render',
		value: function render() {
			var _this = this;

			// return				<UIScrollView
			// 		              dataSource={this.dataSource}
			// 		              elementRenderer={Random}
			// 		              elementHeight={540}
			// 					/>
			var primaryButton = _react2['default'].createElement(
				'button',
				{ onClick: function (e) {
						return _this.toggleDrawer(e);
					} },
				's'
			);
			var links = [{
				name: 'Home',
				link: '/'
			}, {
				name: 'Promise',
				link: '/tatti/'
			}, {
				name: 'Promise',
				link: '/tatti/'
			}, {
				name: 'Promise',
				link: '/tatti/'
			}, {
				name: 'Promise',
				link: '/tatti/'
			}, {
				name: 'Promise',
				link: '/tatti/'
			}, {
				name: 'Promise',
				link: '/tatti/'
			}, {
				name: 'Promise',
				link: '/tatti/'
			}];
			var header = _react2['default'].createElement(
				'h2',
				null,
				'App'
			);

			return _react2['default'].createElement(
				_reactUiComponents.UIDrawerView,
				{ navOpen: this.state.navOpen, links: links, header: header },
				_react2['default'].createElement(
					Layout,
					{ vertical: true },
					_react2['default'].createElement(
						FixedCell,
						null,
						_react2['default'].createElement(UIHeaderView, {
							primaryButton: primaryButton,
							title: 'Demo'
						})
					),
					_react2['default'].createElement(
						FlexCell,
						{ fillFix: true },
						_react2['default'].createElement(_reactUiComponents.UIScrollView, {
							dataSource: this.dataSource,
							elementRenderer: Random,
							elementHeight: 540
						})
					)
				)
			);
		}
	}]);

	return App;
})(_react2['default'].Component);

_react2['default'].render(_react2['default'].createElement(App, null), document.getElementById('container'));

},{"../../src/lib/DataSource.js":2,"classnames":undefined,"react":undefined,"react-ui-components":undefined}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _DataSourceElementErrorsJs = require('./DataSourceElementErrors.js');

var _DataSourceElementErrorsJs2 = _interopRequireDefault(_DataSourceElementErrorsJs);

var __unImpl = function __unImpl(methodName) {
  throw new Error('Unimplemented method' + methodName);
};

var DataSource = (function () {
  function DataSource() {
    _classCallCheck(this, DataSource);

    if (this.constructor === DataSource.prototype.constructor) {
      throw new Error('Abstract class, don\'t create object of this');
    }
  }

  _createClass(DataSource, [{
    key: 'getItemAtIndex',
    value: function getItemAtIndex(index) {
      __unImpl('Promise getItemAtIndex(index)');
    }
  }]);

  return DataSource;
})();

exports['default'] = DataSource;
module.exports = exports['default'];

},{"./DataSourceElementErrors.js":3}],3:[function(require,module,exports){
// This is most likely an overkill.
// and will make benjamin sad.
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var DataSourceElementError = (function () {
  function DataSourceElementError(type, message) {
    _classCallCheck(this, DataSourceElementError);

    this._type = type;
  }

  _createClass(DataSourceElementError, [{
    key: 'type',
    get: function get() {
      return this._type;
    }
  }]);

  return DataSourceElementError;
})();

;

var DataSourceElementErrors = {
  IndexOutOfBound: new DataSourceElementError('IndexOutOfBound')
};

exports['default'] = DataSourceElementErrors;
module.exports = exports['default'];

},{}]},{},[1]);
