import React from 'react';
import {
	UIScrollView, 
	UIDrawerView, 
	UITabsView,
	Layout,
	FixedCell,
	FlexCell,
	UITextField,
	UIButtonView,
	UILoader,
	UICard
} from 'react-ui-components';
import {Router, Route, Navigation} from 'react-router';
import {history} from 'react-router/lib/HashHistory';
import DataSource from '../../src/lib/DataSource.js';
import classNames from 'classnames';
import 'whatwg-fetch';
import _ from 'lodash';
import Promise from 'bluebird';
import Swiper from 'swiper';

class ContactsManager{
	constructor(){
		this._changeListeners = [];

		if( !localStorage.contacts ){
			localStorage.contacts = '[{"id":0,"name":"sylvia barnett","phone":"(163)-509-6398","photo":"http://api.randomuser.me/portraits/thumb/women/59.jpg","times":10},{"id":1,"name":"tim black","phone":"(373)-585-2825","photo":"http://api.randomuser.me/portraits/thumb/men/62.jpg","times":92},{"id":2,"name":"brianna perry","phone":"(444)-777-9715","photo":"http://api.randomuser.me/portraits/thumb/women/20.jpg","times":87},{"id":3,"name":"michael willis","phone":"(361)-904-5049","photo":"http://api.randomuser.me/portraits/thumb/men/24.jpg","times":73},{"id":4,"name":"peggy stephens","phone":"(691)-828-7527","photo":"http://api.randomuser.me/portraits/thumb/women/1.jpg","times":47},{"id":5,"name":"kathy mills","phone":"(970)-611-1940","photo":"http://api.randomuser.me/portraits/thumb/women/8.jpg","times":30},{"id":6,"name":"bruce richardson","phone":"(987)-234-9928","photo":"http://api.randomuser.me/portraits/thumb/men/30.jpg","times":13},{"id":7,"name":"cody henry","phone":"(241)-390-8504","photo":"http://api.randomuser.me/portraits/thumb/men/73.jpg","times":57},{"id":8,"name":"laurie olson","phone":"(526)-589-6465","photo":"http://api.randomuser.me/portraits/thumb/women/6.jpg","times":64},{"id":9,"name":"theresa black","phone":"(445)-422-4467","photo":"http://api.randomuser.me/portraits/thumb/women/62.jpg","times":98},{"id":10,"name":"amelia stephens","phone":"(941)-379-9646","photo":"http://api.randomuser.me/portraits/thumb/women/71.jpg","times":0},{"id":11,"name":"cecil hunter","phone":"(392)-461-7702","photo":"http://api.randomuser.me/portraits/thumb/men/6.jpg","times":65},{"id":12,"name":"susan owens","phone":"(464)-670-9766","photo":"http://api.randomuser.me/portraits/thumb/women/88.jpg","times":40},{"id":13,"name":"anne marshall","phone":"(619)-294-5791","photo":"http://api.randomuser.me/portraits/thumb/women/65.jpg","times":21},{"id":14,"name":"arnold marshall","phone":"(176)-479-7933","photo":"http://api.randomuser.me/portraits/thumb/men/91.jpg","times":94},{"id":15,"name":"joanne hawkins","phone":"(182)-481-4731","photo":"http://api.randomuser.me/portraits/thumb/women/62.jpg","times":82},{"id":16,"name":"sylvia fuller","phone":"(142)-611-1809","photo":"http://api.randomuser.me/portraits/thumb/women/76.jpg","times":28},{"id":17,"name":"marcia curtis","phone":"(448)-753-8353","photo":"http://api.randomuser.me/portraits/thumb/women/5.jpg","times":36},{"id":18,"name":"sonia mendoza","phone":"(591)-951-3588","photo":"http://api.randomuser.me/portraits/thumb/women/21.jpg","times":41},{"id":19,"name":"landon hill","phone":"(501)-191-7706","photo":"http://api.randomuser.me/portraits/thumb/men/37.jpg","times":32},{"id":20,"name":"jimmy stevens","phone":"(884)-870-5557","photo":"http://api.randomuser.me/portraits/thumb/men/50.jpg","times":98},{"id":21,"name":"kathryn morris","phone":"(727)-563-7877","photo":"http://api.randomuser.me/portraits/thumb/women/28.jpg","times":25},{"id":22,"name":"vicki rodriguez","phone":"(414)-704-2026","photo":"http://api.randomuser.me/portraits/thumb/women/77.jpg","times":44},{"id":23,"name":"caroline bell","phone":"(988)-407-8463","photo":"http://api.randomuser.me/portraits/thumb/women/13.jpg","times":88},{"id":24,"name":"juanita miller","phone":"(248)-981-1622","photo":"http://api.randomuser.me/portraits/thumb/women/38.jpg","times":81},{"id":25,"name":"denise graves","phone":"(827)-199-2792","photo":"http://api.randomuser.me/portraits/thumb/women/78.jpg","times":51},{"id":26,"name":"delores watkins","phone":"(321)-446-4484","photo":"http://api.randomuser.me/portraits/thumb/women/76.jpg","times":65},{"id":27,"name":"cherly long","phone":"(101)-445-5092","photo":"http://api.randomuser.me/portraits/thumb/women/74.jpg","times":28},{"id":28,"name":"misty miles","phone":"(276)-541-8224","photo":"http://api.randomuser.me/portraits/thumb/women/65.jpg","times":15},{"id":29,"name":"gabriel stone","phone":"(809)-740-9786","photo":"http://api.randomuser.me/portraits/thumb/men/89.jpg","times":76},{"id":30,"name":"jeremiah rodriguez","phone":"(272)-405-2358","photo":"http://api.randomuser.me/portraits/thumb/men/94.jpg","times":50},{"id":31,"name":"clara jackson","phone":"(815)-895-9269","photo":"http://api.randomuser.me/portraits/thumb/women/13.jpg","times":3},{"id":32,"name":"craig howard","phone":"(337)-439-2079","photo":"http://api.randomuser.me/portraits/thumb/men/2.jpg","times":74},{"id":33,"name":"kent bell","phone":"(901)-642-2055","photo":"http://api.randomuser.me/portraits/thumb/men/77.jpg","times":65},{"id":34,"name":"erika steeves","phone":"(378)-370-2464","photo":"http://api.randomuser.me/portraits/thumb/women/7.jpg","times":20},{"id":35,"name":"philip west","phone":"(797)-807-8777","photo":"http://api.randomuser.me/portraits/thumb/men/85.jpg","times":27},{"id":36,"name":"rene harvey","phone":"(210)-204-9359","photo":"http://api.randomuser.me/portraits/thumb/men/17.jpg","times":64},{"id":37,"name":"veronica anderson","phone":"(691)-244-7930","photo":"http://api.randomuser.me/portraits/thumb/women/24.jpg","times":5},{"id":38,"name":"seth watson","phone":"(141)-270-4418","photo":"http://api.randomuser.me/portraits/thumb/men/81.jpg","times":63},{"id":39,"name":"billie prescott","phone":"(633)-170-1635","photo":"http://api.randomuser.me/portraits/thumb/women/4.jpg","times":10},{"id":40,"name":"dora coleman","phone":"(226)-964-6113","photo":"http://api.randomuser.me/portraits/thumb/women/64.jpg","times":69},{"id":41,"name":"bobby smith","phone":"(677)-375-1726","photo":"http://api.randomuser.me/portraits/thumb/men/5.jpg","times":60},{"id":42,"name":"lori beck","phone":"(328)-395-5650","photo":"http://api.randomuser.me/portraits/thumb/women/83.jpg","times":5},{"id":43,"name":"julia byrd","phone":"(694)-796-3378","photo":"http://api.randomuser.me/portraits/thumb/women/1.jpg","times":48},{"id":44,"name":"javier holmes","phone":"(173)-406-5313","photo":"http://api.randomuser.me/portraits/thumb/men/53.jpg","times":27},{"id":45,"name":"tom hill","phone":"(266)-945-3686","photo":"http://api.randomuser.me/portraits/thumb/men/9.jpg","times":37},{"id":46,"name":"jordan williamson","phone":"(309)-717-2915","photo":"http://api.randomuser.me/portraits/thumb/men/31.jpg","times":22},{"id":47,"name":"ellen hopkins","phone":"(362)-479-6457","photo":"http://api.randomuser.me/portraits/thumb/women/17.jpg","times":62},{"id":48,"name":"hunter douglas","phone":"(361)-615-2848","photo":"http://api.randomuser.me/portraits/thumb/men/62.jpg","times":76},{"id":49,"name":"billy steward","phone":"(656)-478-2160","photo":"http://api.randomuser.me/portraits/thumb/men/60.jpg","times":37},{"id":50,"name":"melissa wright","phone":"(796)-501-1945","photo":"http://api.randomuser.me/portraits/thumb/women/37.jpg","times":87},{"id":51,"name":"allan obrien","phone":"(171)-227-9764","photo":"http://api.randomuser.me/portraits/thumb/men/66.jpg","times":73},{"id":52,"name":"judith clark","phone":"(940)-357-6264","photo":"http://api.randomuser.me/portraits/thumb/women/65.jpg","times":86},{"id":53,"name":"russell neal","phone":"(578)-652-7059","photo":"http://api.randomuser.me/portraits/thumb/men/7.jpg","times":38},{"id":54,"name":"marilyn wright","phone":"(356)-960-4788","photo":"http://api.randomuser.me/portraits/thumb/women/71.jpg","times":36},{"id":55,"name":"alyssa cole","phone":"(473)-226-3276","photo":"http://api.randomuser.me/portraits/thumb/women/64.jpg","times":75},{"id":56,"name":"reginald wade","phone":"(422)-739-1161","photo":"http://api.randomuser.me/portraits/thumb/men/17.jpg","times":58},{"id":57,"name":"heather bates","phone":"(677)-417-7817","photo":"http://api.randomuser.me/portraits/thumb/women/20.jpg","times":64},{"id":58,"name":"soham daniels","phone":"(722)-943-2920","photo":"http://api.randomuser.me/portraits/thumb/men/46.jpg","times":32},{"id":59,"name":"lonnie riley","phone":"(723)-605-8570","photo":"http://api.randomuser.me/portraits/thumb/men/2.jpg","times":50},{"id":60,"name":"ellen sutton","phone":"(467)-439-8369","photo":"http://api.randomuser.me/portraits/thumb/women/36.jpg","times":73},{"id":61,"name":"stacy cox","phone":"(792)-320-4288","photo":"http://api.randomuser.me/portraits/thumb/women/22.jpg","times":38},{"id":62,"name":"samuel campbell","phone":"(448)-670-9379","photo":"http://api.randomuser.me/portraits/thumb/men/13.jpg","times":99},{"id":63,"name":"crystal terry","phone":"(636)-457-5143","photo":"http://api.randomuser.me/portraits/thumb/women/20.jpg","times":93},{"id":64,"name":"mildred fields","phone":"(513)-702-1994","photo":"http://api.randomuser.me/portraits/thumb/women/45.jpg","times":75},{"id":65,"name":"edwin webb","phone":"(614)-829-3261","photo":"http://api.randomuser.me/portraits/thumb/men/85.jpg","times":32},{"id":66,"name":"jackson shaw","phone":"(214)-145-4974","photo":"http://api.randomuser.me/portraits/thumb/men/97.jpg","times":19},{"id":67,"name":"bonnie jenkins","phone":"(114)-920-1199","photo":"http://api.randomuser.me/portraits/thumb/women/77.jpg","times":26},{"id":68,"name":"louella chambers","phone":"(870)-717-7094","photo":"http://api.randomuser.me/portraits/thumb/women/20.jpg","times":80},{"id":69,"name":"ben carter","phone":"(204)-161-1339","photo":"http://api.randomuser.me/portraits/thumb/men/78.jpg","times":83},{"id":70,"name":"crystal stanley","phone":"(625)-838-4390","photo":"http://api.randomuser.me/portraits/thumb/women/9.jpg","times":28},{"id":71,"name":"erika vasquez","phone":"(871)-449-6243","photo":"http://api.randomuser.me/portraits/thumb/women/22.jpg","times":90},{"id":72,"name":"heidi young","phone":"(328)-439-2170","photo":"http://api.randomuser.me/portraits/thumb/women/12.jpg","times":52},{"id":73,"name":"harry mendoza","phone":"(783)-474-7222","photo":"http://api.randomuser.me/portraits/thumb/men/46.jpg","times":95},{"id":74,"name":"joann lambert","phone":"(611)-979-2265","photo":"http://api.randomuser.me/portraits/thumb/women/69.jpg","times":81},{"id":75,"name":"leta curtis","phone":"(352)-213-2335","photo":"http://api.randomuser.me/portraits/thumb/women/93.jpg","times":19},{"id":76,"name":"elijah wallace","phone":"(266)-987-6322","photo":"http://api.randomuser.me/portraits/thumb/men/49.jpg","times":50},{"id":77,"name":"ramon stanley","phone":"(368)-608-6028","photo":"http://api.randomuser.me/portraits/thumb/men/61.jpg","times":65},{"id":78,"name":"gail ross","phone":"(410)-819-9188","photo":"http://api.randomuser.me/portraits/thumb/women/7.jpg","times":24},{"id":79,"name":"frederick fowler","phone":"(235)-103-3754","photo":"http://api.randomuser.me/portraits/thumb/men/19.jpg","times":46},{"id":80,"name":"regina harvey","phone":"(766)-376-1623","photo":"http://api.randomuser.me/portraits/thumb/women/15.jpg","times":1},{"id":81,"name":"jerome young","phone":"(803)-944-5174","photo":"http://api.randomuser.me/portraits/thumb/men/35.jpg","times":35},{"id":82,"name":"elizabeth holmes","phone":"(649)-493-7286","photo":"http://api.randomuser.me/portraits/thumb/women/15.jpg","times":61},{"id":83,"name":"ellen newman","phone":"(538)-296-2379","photo":"http://api.randomuser.me/portraits/thumb/women/82.jpg","times":6},{"id":84,"name":"gertrude hale","phone":"(150)-318-9140","photo":"http://api.randomuser.me/portraits/thumb/women/29.jpg","times":51},{"id":85,"name":"julio ward","phone":"(467)-117-1335","photo":"http://api.randomuser.me/portraits/thumb/men/98.jpg","times":15},{"id":86,"name":"darryl payne","phone":"(362)-781-3004","photo":"http://api.randomuser.me/portraits/thumb/men/87.jpg","times":80},{"id":87,"name":"chloe wheeler","phone":"(566)-495-5967","photo":"http://api.randomuser.me/portraits/thumb/women/44.jpg","times":24},{"id":88,"name":"maxine washington","phone":"(333)-449-5918","photo":"http://api.randomuser.me/portraits/thumb/women/93.jpg","times":67},{"id":89,"name":"victor patterson","phone":"(762)-679-1769","photo":"http://api.randomuser.me/portraits/thumb/men/43.jpg","times":40},{"id":90,"name":"sergio bishop","phone":"(198)-567-3479","photo":"http://api.randomuser.me/portraits/thumb/men/38.jpg","times":58},{"id":91,"name":"jessie kuhn","phone":"(870)-637-4024","photo":"http://api.randomuser.me/portraits/thumb/women/34.jpg","times":19},{"id":92,"name":"lawrence welch","phone":"(225)-134-2427","photo":"http://api.randomuser.me/portraits/thumb/men/46.jpg","times":92},{"id":93,"name":"derrick washington","phone":"(501)-336-8670","photo":"http://api.randomuser.me/portraits/thumb/men/54.jpg","times":83},{"id":94,"name":"jessie rice","phone":"(578)-132-7487","photo":"http://api.randomuser.me/portraits/thumb/men/76.jpg","times":75},{"id":95,"name":"larry berry","phone":"(734)-237-8701","photo":"http://api.randomuser.me/portraits/thumb/men/54.jpg","times":85},{"id":96,"name":"grace stanley","phone":"(149)-796-1047","photo":"http://api.randomuser.me/portraits/thumb/women/6.jpg","times":14},{"id":97,"name":"sara cole","phone":"(322)-988-1552","photo":"http://api.randomuser.me/portraits/thumb/women/5.jpg","times":55},{"id":98,"name":"tamara carroll","phone":"(862)-627-4451","photo":"http://api.randomuser.me/portraits/thumb/women/46.jpg","times":60},{"id":99,"name":"genesis lane","phone":"(159)-249-3500","photo":"http://api.randomuser.me/portraits/thumb/women/71.jpg","times":71}]';
		}

		this._contacts = JSON.parse(localStorage.contacts)
		this._contacts.sort((a, b) => { return a.name === b.name ? 0 :  a.name > b.name  ?  1 : - 1; });
		this._max = this._contacts.length;	
	}
	
	getAll(){
		let that = this;
		return {
			byIndex(index){
				return that._contacts[index];
			}, 
			length(){
				return that._max;
			}
		}
	}

	getRecent(howMany){
		let getRecentInternal = contacts => contacts.slice(0).sort((a, b) => { return b.times - a.times }).slice(0, howMany);
		let meta = { contacts: getRecentInternal(this._contacts) };
		
		this._changeListeners.push( change => {
			meta.contacts = getRecentInternal(this._contacts);
		});

		return {
			byIndex(index){
				return meta.contacts[index];
			},
			length(){
				return howMany;
			}
		}
	}

	updateContact(idx, data){
		let n = _.assign(this._list[idx], data);
		this._changeListeners.forEach( fn => fn(n) );
	}
}

let cm = new ContactsManager();

class Transactions extends DataSource{
	constructor(props, list){
		super(props);
		console.log("Building");
	
		if( !list && !localStorage.transactions ){
			localStorage.transactions = '[{"type":"debit","amount":461.86710172332823,"otherParty":{"id":96,"name":"grace stanley","phone":"(149)-796-1047","photo":"http://api.randomuser.me/portraits/thumb/women/6.jpg","times":14},"date":1437605285609.6768},{"type":"debit","amount":129.49005723930895,"otherParty":{"id":80,"name":"regina harvey","phone":"(766)-376-1623","photo":"http://api.randomuser.me/portraits/thumb/women/15.jpg","times":1},"date":1437605011293.2256},{"type":"debit","amount":941.0061126109213,"otherParty":{"id":99,"name":"genesis lane","phone":"(159)-249-3500","photo":"http://api.randomuser.me/portraits/thumb/women/71.jpg","times":71},"date":1437604693786.6177},{"type":"credit","amount":835.8593205921352,"otherParty":{"id":84,"name":"gertrude hale","phone":"(150)-318-9140","photo":"http://api.randomuser.me/portraits/thumb/women/29.jpg","times":51},"date":1437604497226.1711},{"type":"debit","amount":903.6051542498171,"otherParty":{"id":10,"name":"amelia stephens","phone":"(941)-379-9646","photo":"http://api.randomuser.me/portraits/thumb/women/71.jpg","times":0},"date":1437604159173.9873},{"type":"credit","amount":976.9100451376289,"otherParty":{"id":24,"name":"juanita miller","phone":"(248)-981-1622","photo":"http://api.randomuser.me/portraits/thumb/women/38.jpg","times":81},"date":1437603830394.213},{"type":"credit","amount":578.8237643428147,"otherParty":{"id":22,"name":"vicki rodriguez","phone":"(414)-704-2026","photo":"http://api.randomuser.me/portraits/thumb/women/77.jpg","times":44},"date":1437603770872.0662},{"type":"credit","amount":637.3056101147085,"otherParty":{"id":74,"name":"joann lambert","phone":"(611)-979-2265","photo":"http://api.randomuser.me/portraits/thumb/women/69.jpg","times":81},"date":1437603428685.7708},{"type":"credit","amount":216.3495139684528,"otherParty":{"id":54,"name":"marilyn wright","phone":"(356)-960-4788","photo":"http://api.randomuser.me/portraits/thumb/women/71.jpg","times":36},"date":1437603250373.03},{"type":"debit","amount":354.93542277254164,"otherParty":{"id":88,"name":"maxine washington","phone":"(333)-449-5918","photo":"http://api.randomuser.me/portraits/thumb/women/93.jpg","times":67},"date":1437603125222.4243},{"type":"credit","amount":866.9181764125824,"otherParty":{"id":15,"name":"joanne hawkins","phone":"(182)-481-4731","photo":"http://api.randomuser.me/portraits/thumb/women/62.jpg","times":82},"date":1437602912331.5881},{"type":"credit","amount":909.8146038595587,"otherParty":{"id":62,"name":"samuel campbell","phone":"(448)-670-9379","photo":"http://api.randomuser.me/portraits/thumb/men/13.jpg","times":99},"date":1437602891543.3796},{"type":"debit","amount":819.2366370931268,"otherParty":{"id":0,"name":"sylvia barnett","phone":"(163)-509-6398","photo":"http://api.randomuser.me/portraits/thumb/women/59.jpg","times":10},"date":1437602591292.311},{"type":"credit","amount":357.34879365190864,"otherParty":{"id":14,"name":"arnold marshall","phone":"(176)-479-7933","photo":"http://api.randomuser.me/portraits/thumb/men/91.jpg","times":94},"date":1437602351666.477},{"type":"debit","amount":252.89428723044693,"otherParty":{"id":3,"name":"michael willis","phone":"(361)-904-5049","photo":"http://api.randomuser.me/portraits/thumb/men/24.jpg","times":73},"date":1437602169888.5754},{"type":"credit","amount":253.29603953287005,"otherParty":{"id":69,"name":"ben carter","phone":"(204)-161-1339","photo":"http://api.randomuser.me/portraits/thumb/men/78.jpg","times":83},"date":1437601963743.619},{"type":"credit","amount":612.6538210082799,"otherParty":{"id":51,"name":"allan obrien","phone":"(171)-227-9764","photo":"http://api.randomuser.me/portraits/thumb/men/66.jpg","times":73},"date":1437601899640.646},{"type":"debit","amount":742.7546645049006,"otherParty":{"id":49,"name":"billy steward","phone":"(656)-478-2160","photo":"http://api.randomuser.me/portraits/thumb/men/60.jpg","times":37},"date":1437601801123.2522},{"type":"debit","amount":84.47643439285457,"otherParty":{"id":32,"name":"craig howard","phone":"(337)-439-2079","photo":"http://api.randomuser.me/portraits/thumb/men/2.jpg","times":74},"date":1437601484321.332},{"type":"debit","amount":666.8707912322134,"otherParty":{"id":58,"name":"soham daniels","phone":"(722)-943-2920","photo":"http://api.randomuser.me/portraits/thumb/men/46.jpg","times":32},"date":1437601365025.2737},{"type":"credit","amount":306.2956784851849,"otherParty":{"id":94,"name":"jessie rice","phone":"(578)-132-7487","photo":"http://api.randomuser.me/portraits/thumb/men/76.jpg","times":75},"date":1437601008117.826},{"type":"debit","amount":58.044189820066094,"otherParty":{"id":20,"name":"jimmy stevens","phone":"(884)-870-5557","photo":"http://api.randomuser.me/portraits/thumb/men/50.jpg","times":98},"date":1437600737413.267},{"type":"credit","amount":728.337103035301,"otherParty":{"id":58,"name":"soham daniels","phone":"(722)-943-2920","photo":"http://api.randomuser.me/portraits/thumb/men/46.jpg","times":32},"date":1437600640411.4468},{"type":"credit","amount":10.843419469892979,"otherParty":{"id":29,"name":"gabriel stone","phone":"(809)-740-9786","photo":"http://api.randomuser.me/portraits/thumb/men/89.jpg","times":76},"date":1437600385917.8804},{"type":"credit","amount":440.2645779773593,"otherParty":{"id":9,"name":"theresa black","phone":"(445)-422-4467","photo":"http://api.randomuser.me/portraits/thumb/women/62.jpg","times":98},"date":1437600030565.8142},{"type":"debit","amount":853.4978309180588,"otherParty":{"id":20,"name":"jimmy stevens","phone":"(884)-870-5557","photo":"http://api.randomuser.me/portraits/thumb/men/50.jpg","times":98},"date":1437599777817.126},{"type":"debit","amount":922.4825156852603,"otherParty":{"id":79,"name":"frederick fowler","phone":"(235)-103-3754","photo":"http://api.randomuser.me/portraits/thumb/men/19.jpg","times":46},"date":1437599692166.071},{"type":"debit","amount":851.1212901212275,"otherParty":{"id":61,"name":"stacy cox","phone":"(792)-320-4288","photo":"http://api.randomuser.me/portraits/thumb/women/22.jpg","times":38},"date":1437599503603.6067},{"type":"credit","amount":859.8041143268347,"otherParty":{"id":47,"name":"ellen hopkins","phone":"(362)-479-6457","photo":"http://api.randomuser.me/portraits/thumb/women/17.jpg","times":62},"date":1437599370460.5447},{"type":"credit","amount":277.67331805080175,"otherParty":{"id":83,"name":"ellen newman","phone":"(538)-296-2379","photo":"http://api.randomuser.me/portraits/thumb/women/82.jpg","times":6},"date":1437599207629.329},{"type":"debit","amount":395.27168800123036,"otherParty":{"id":97,"name":"sara cole","phone":"(322)-988-1552","photo":"http://api.randomuser.me/portraits/thumb/women/5.jpg","times":55},"date":1437598914381.6199},{"type":"debit","amount":839.2991169821471,"otherParty":{"id":54,"name":"marilyn wright","phone":"(356)-960-4788","photo":"http://api.randomuser.me/portraits/thumb/women/71.jpg","times":36},"date":1437598895440.198},{"type":"debit","amount":979.7775207553059,"otherParty":{"id":78,"name":"gail ross","phone":"(410)-819-9188","photo":"http://api.randomuser.me/portraits/thumb/women/7.jpg","times":24},"date":1437598568372.3032},{"type":"debit","amount":292.40330099128187,"otherParty":{"id":14,"name":"arnold marshall","phone":"(176)-479-7933","photo":"http://api.randomuser.me/portraits/thumb/men/91.jpg","times":94},"date":1437598248366.388},{"type":"credit","amount":549.9195540323853,"otherParty":{"id":55,"name":"alyssa cole","phone":"(473)-226-3276","photo":"http://api.randomuser.me/portraits/thumb/women/64.jpg","times":75},"date":1437598222139.2961},{"type":"debit","amount":874.0450751502067,"otherParty":{"id":41,"name":"bobby smith","phone":"(677)-375-1726","photo":"http://api.randomuser.me/portraits/thumb/men/5.jpg","times":60},"date":1437598170989.9458},{"type":"debit","amount":949.0999355912209,"otherParty":{"id":66,"name":"jackson shaw","phone":"(214)-145-4974","photo":"http://api.randomuser.me/portraits/thumb/men/97.jpg","times":19},"date":1437598111587.4202},{"type":"credit","amount":529.9695588182658,"otherParty":{"id":72,"name":"heidi young","phone":"(328)-439-2170","photo":"http://api.randomuser.me/portraits/thumb/women/12.jpg","times":52},"date":1437597989822.8438},{"type":"credit","amount":89.04353436082602,"otherParty":{"id":34,"name":"erika steeves","phone":"(378)-370-2464","photo":"http://api.randomuser.me/portraits/thumb/women/7.jpg","times":20},"date":1437597897912.1812},{"type":"credit","amount":849.2108890786767,"otherParty":{"id":2,"name":"brianna perry","phone":"(444)-777-9715","photo":"http://api.randomuser.me/portraits/thumb/women/20.jpg","times":87},"date":1437597560446.863}]';
		}

		this._list = list || JSON.parse(localStorage.transactions);
		this._list.sort(function(a, b){
			return b.date - a.date;
		});
		this._max = this._list.length;
	
	}
	
	getItemAtIndex(index){
		return this._list[index];
	}
	
	get length(){
		return this._max;
	}

	createFiltered(fn){
		let list = this._list.filter(fn);
		return new Transactions({}, list);
	}
}
let Accounts = {
	sharedSources: [{
		type: 'bank',
		brand: 'CITI Bank',
		number: '**** ******* 9489',
		name: 'Felicia Jennings'
	},{
		type: 'cc',
		brand: 'MasterCard',
		number: '**** **** **** 6999',
		name: 'Ruben K. Jennings',		
	}],
	banks: [{
		type: 'bank',
		brand: 'HSBC',
		number: '**** ******* 6664',
		name: 'Ruben K. Jennings'
	},{
		type: 'bank',
		brand: 'CITI Bank',
		number: '**** ******* 4666',
		name: 'Ruben K. Jennings'		
	}],
	cards: [{
		type: 'cc',
		brand: 'Visa',
		number: '**** **** **** 2835',
		name: 'Ruben K. Jennings',
	},{
		type: 'cc',
		brand: 'MasterCard',
		number: '**** **** **** 6999',
		name: 'Ruben K. Jennings',
	},{
		type: 'cc',
		brand: 'MasterCard',
		number: '**** **** **** 5139',
		name: 'Ruben K. Jennings'
	}],
	familySharingOn: true,
	family: [{
		role: 'admin',
		meta: {
			name: 'Felicia Jennings',
			phone: '(125)-544-2926',
			photo: 'https://randomuser.me/api/portraits/med/women/3.jpg'
		},
		qouta: null,
		spent: 300.00
	},{
		role: 'peer',
		meta: {
			name: 'Cathy Jennings',
			photo: 'https://randomuser.me/api/portraits/women/93.jpg',
			phone: '(791)-583-2149'
		},
		qouta: 140.00,
		spent: 40.23
	},{
		role: 'peer',
		meta: {
			name: 'Harry Jennings',
			photo: 'https://randomuser.me/api/portraits/lego/5.jpg',
			phone: '(586)-322-4012'
		},
		qouta: 40.00,
		spent: 10.00
	}]
};
class Recents extends DataSource{
	constructor(props){
		super(props);
		this._list = cm.getRecent(20);
		this._max = this._list.length();	
	}


  
	getItemAtIndex(index){
		console.log(index);
		if( index < 0 || index > this._max - 1 ){
	    	return DataSource.IndexOutOfBound;
		}
		return this._list.byIndex(index);
	}
	  
	get length(){
		return this._max;
	}
}

class Contacts extends DataSource{
	constructor(props){
		super(props);
		this._list = cm.getAll();
		this._max = this._list.length();	
	}


  
	getItemAtIndex(index){
		console.log(index);
		if( index < 0 || index > this._max - 1 ){
	    	return DataSource.IndexOutOfBound;
		}
		return this._list.byIndex(index);
	}
	  
	get length(){
		return this._max;
	}
}



class UIBaseHeaderView extends React.Component{
	render(){
		return  <div className='HeaderView mdl-layout'>
					<Layout horizontal={true} alignItems={'center'}>
						<FixedCell className="header-button">{this.props.primaryButton}</FixedCell>
						<FlexCell>
							{this.props.children}
						</FlexCell>
						<FixedCell className="header-button">{this.props.secondaryButtons}</FixedCell>
					</Layout>
				</div>;		
	}
}

class UIHeaderView extends React.Component{
	render(){
		return  <UIBaseHeaderView primaryButton={this.props.primaryButton} secondaryButtons={this.props.secondaryButtons}>
					<h2 className="mdl-typography--subhead">{this.props.title}</h2>
				</UIBaseHeaderView>;
	}
}


class UITransaction extends React.Component{
	render(){
		let info = this.props.data;
		let k = classNames("mdl-text mdl-typography--headline", {
			'credit': info.type === 'credit',
			'debit' : info.type === 'debit'
		});

		return  <div className='AppTransaction--List'>
					<Layout horizontal={true} alignItems={'center'}>
						<FlexCell>
							<h2 className="mdl-text mdl-typography--subhead">{info.otherParty.name}</h2>
							<h2 className={k}>$ {info.amount.toFixed(2)}</h2>
						</FlexCell>
						<FixedCell className="mdl-transaction__date">
							<div className="mdl-text mdl-typography--caption">{(new Date(info.date)).toString().substring(4, 10)}</div>
						</FixedCell>
					</Layout>
				 </div>;
	}
}

class UIContact extends React.Component{
	render(){
		let info = this.props.data;
		return  <div className='AppUser-List'>
					<Layout horizontal={true} alignItems={'center'}>
						<FixedCell>
							<img className='AppUser__UserImage' src={info.photo} />
						</FixedCell>
						<FlexCell>
							<h2 className="mdl-text mdl-typography--subhead">{info.name}</h2>
							<h4 className="mdl-text mdl-typography--caption-color-contrast">{'+1 ' + info.phone }</h4>
						</FlexCell>
					</Layout>
				 </div>;
	}
}

class UIPickerView extends React.Component{
	
	constructor(man){
		super(man);
		this.all = new Contacts();
		this.recents = new Recents();
	}

	render(){

		return  <UITabsView options={{
					slidesPerView: 1								
				}}>
					<UIScrollView 
					  title={'Recents'}
		              dataSource={this.recents} 
		              elementRenderer={UIContact}
		              elementHeight={80}
					/>
					<UIScrollView 
					  title={'Contacts'}
		              dataSource={this.all} 
		              elementRenderer={UIContact}
		              elementHeight={80}
					/>
					<div title={"Nearby"}>
						<div className="mdl-padded">
							<div className="ui-point">
							</div>
							<h3 className="mdl-typography--subhead mdl-typography--text-center">Awaiting other device</h3>
							<p className="mdl-typography--text-center fill">While in this view a merchant device or other people can request payment from you. Simply tap your devices for initiating the handshake</p>
						</div>
					</div>
				</UITabsView>
	}
}

class UIAccount extends React.Component{
	render(){
		let info = this.props.data;
		return 	<div className='card-account'>
					<h6 className="mdl-typography--caption-color-contrast clean-margins">{info.brand}</h6>
					<h4 className="mdl-typography--subhead clean-margins">{info.number}</h4>
					<h4 className="mdl-typography--subhead clean-margins">{info.name}</h4>
				</div>
	}
}

class CardSwiper extends React.Component{
	constructor(man){
		super(man);
	}
	componentDidMount(){
		let el = React.findDOMNode(this.refs.swiper);
		this._scroller = new Swiper(el,{
			slidesPerView: 1,
			spaceBetween: 60								
		});
	}

	render(){
		return 	<div className="card-swiper">
					<div ref="swiper" className='swiper-container'>
						<div className='swiper-wrapper'>
							{_cards.map( card => {
								return 	<div className='swiper-slide'>
											<Card data={card} />
										</div>;
							})}
						</div>
					</div>
				</div>
	}
}

class AppWidePaymentOverlay extends React.Component{
	constructor(man){
		super(man);
		this.state = {};
	}

	componentDidMount(){
		/* run the class after it this way */
		// setTimeout(t => this.setState({
		// 	opened: true
		// }), 5000);
	}

	render(){
		let cname = classNames('App__Overlay', {
			'App__Overlay--open': this.state.opened
		});
		let data = {
			requestedBy: 'Hal Jordan',
			amount: '$ 	22.20',
			reason: 'Subway Due'
		};
		let stxt = 	<div>
						<h3 className="mdl-typography--headline clean-margins">{data.requestedBy}</h3>
						<h6 className="mdl-typography--caption clean-margins">{data.reason}</h6>
						<h1 className="mdl-typography--light-heading">{data.amount}</h1>
						<p className="mdl-typography--text-justify">Hey, you owe me money for the subway yesterday, I expect full cash back !</p>
					</div>;

		let menuButtons = [
			<UIButtonView key="menu_card" ripple={true} icon={true}><i className="material-icons">credit_card</i></UIButtonView>,
			<UIButtonView key="menu_more" ripple={true} icon={true}><i className="material-icons">more_vert</i></UIButtonView>
		]
		let actions = [	<UIButtonView key="button_accept" ripple={true}>Pay Now</UIButtonView>, 
						<UIButtonView key="button_reject" ripple={true}>Remind Later</UIButtonView>]
		return 	<div className={cname}>
					<UICard 
						menuButtons={menuButtons}
						supportingText={stxt}
						actions={actions}
					></UICard>
				</div>
	}
}

class TransactionHistoryView extends React.Component{

	constructor(man){
		super(man);
		this._history = new Transactions();
		this._historyDebits = this._history.createFiltered(function(tr){
			return tr.type === 'debit';
		});

		this._historyCredits = this._history.createFiltered(function(tr){
			return tr.type === 'credit';
		});
		this.state = {
			isFabContainerOpen: false
		};
	}
	componentDidMount(){
		this.setState({
			hasMounted: true
		});
	}
	componentWillUnmount(){
		this.setState({
			hasMounted: false
		});		
	}

	openPayView(e){
		setTimeout(
			t => {
				window.location.hash = '/pay/who';
			}, 200
		);
	}

	openChargeView(e){
		setTimeout(
			t => {
				window.location.hash = '/charge/who';
			}, 200
		);
	}

	toggleFabContainer(e){
		this.setState({
			isFabContainerOpen: ! this.state.isFabContainerOpen
		});
	}

	render(){
		let cnamefab = classNames("fab-container home-fab", {
			'fab-container--open': this.state.isFabContainerOpen,
			'fab-container--ready': this.state.hasMounted
		});
		
		return  <div className="full--height">
					<UITabsView className="App__Transactions">
						<UIScrollView 
						  title={'All'}
			              dataSource={this._history} 
			              elementRenderer={UITransaction}
			              elementHeight={80}
						/>
						<UIScrollView 
						  title={'Debits'}
			              dataSource={this._historyDebits} 
			              elementRenderer={UITransaction}
			              elementHeight={80}
						/>
						<UIScrollView 
						  title={'Credits'}
			              dataSource={this._historyCredits} 
			              elementRenderer={UITransaction}
			              elementHeight={80}
						/>
					</UITabsView>
					<div className={cnamefab}>
						<UIButtonView
							className="secondary-fab--2"
							fab={true} raised={true} mini={true} onClick={ e => this.openPayView(e) }
						><i className="material-icons">call_made</i></UIButtonView>
						<UIButtonView
							className="secondary-fab--1"
							fab={true} raised={true} mini={true} onClick={ e => this.openChargeView(e) }
						><i className="material-icons">call_received</i></UIButtonView>
						<UIButtonView 
							onClick={ e => this.toggleFabContainer(e) }
							fab={true} 
							raised={true}
							colored={true}
							ripple={true} 
						className="primary-fab"><i className="material-icons">close</i></UIButtonView>
					</div>
				</div>
	}
}

class UIAccountsView extends React.Component{
	render(){
		return 	<div className="accounts">
				</div>;
	}
}

let AppActions = {
	_toggleListeners: [],
	toggleDrawer(){
		AppActions._toggleListeners.forEach(fn => fn());
	},
	registerToggleListener(fn){
		AppActions._toggleListeners.push(fn);
	}
};

const App = React.createClass({
	getInitialState(){
		return {
			navOpen: false
		};
	},

	componentDidMount(){
		AppActions.registerToggleListener(() => this.toggleDrawer());
	},

	componentWillReceiveProps(){
		if( this.state.navOpen ){
			this.toggleDrawer();
		}
	},

	toggleDrawer(){
		this.setState({
			navOpen: !this.state.navOpen
		});
	},
	
	render () {
		let links = [{
			name: 'Home',
			path: '/home'
		},{
			name: 'Scout',
			path: '/scout'
		},{
			name: 'Invoices',
			path: '/invoices',
			badge: 5,
		},{
			name: 'Accounts',
			path: '/accounts'
		},{
			name: 'Sharing',
			path: '/sharing'
		},{
			name: 'Invite',
			path: '/invite'
		}];

		let header = <div className='AppUser-Header'>
						<Layout horizontal={true} alignItems={'center'}>
							<FixedCell>
								<img className='AppUser__UserImage' src={'https://randomuser.me/api/portraits/med/men/55.jpg'} />
							</FixedCell>
							<FlexCell>
								<h2 className="mdl-text mdl-typography--title foo">Ruben Jennings</h2>
								<h4 className="mdl-text mdl-typography--body-1">+1-(227)-939-2910</h4>
							</FlexCell>
						</Layout>
					 </div>;
		

		return 	<UIDrawerView navOpen={this.state.navOpen} links={links} header={header}>
					{this.props.children}
					<AppWidePaymentOverlay></AppWidePaymentOverlay>
				</UIDrawerView>
				
	}
});

class TransactionsRoute extends React.Component{
	render(){
		let primaryButton = <UIButtonView icon={true} onClick={AppActions.toggleDrawer}><i className="material-icons header-icon">menu</i></UIButtonView>;
		return 	<Layout vertical={true}>
					<FixedCell className="header">
						<UIHeaderView 
							primaryButton={primaryButton}
							title="Home"
						/>
					</FixedCell>
					<FlexCell fillFix={true}>
						<TransactionHistoryView />
					</FlexCell>
				</Layout>;
	}
}

let PaymentsRoute =  React.createClass({
	mixins: [Navigation],
	render(){
		let primaryButton = <UIButtonView 
								icon={true} 
								onClick={back => this.goBack()}
							><i className="material-icons header-icon">arrow_back</i></UIButtonView>;
		return 	<Layout vertical={true}>
					<FixedCell className="header">
						<UIHeaderView 
							primaryButton={primaryButton}
							title="Who to pay ?"
						/>
					</FixedCell>
					<FlexCell fillFix={true}>
						{this.props.children}
					</FlexCell>
				</Layout>;
	}	
});

let ChargeRoute = React.createClass({
	mixins: [Navigation],
	render(){
		let primaryButton = <UIButtonView 
								icon={true} 
								onClick={back => this.goBack()}
							><i className="material-icons header-icon">arrow_back</i></UIButtonView>;
		return 	<Layout vertical={true}>
					<FixedCell className="header">
						<UIHeaderView 
							primaryButton={primaryButton}
							title="Who to Charge ?"
						/>
					</FixedCell>
					<FlexCell fillFix={true}>
						{this.props.children}
					</FlexCell>
				</Layout>;
	}	
});

let ScoutRoute = React.createClass({
	mixins: [Navigation],
	render(){

		let primaryButton = <UIButtonView icon={true} onClick={AppActions.toggleDrawer}><i className="material-icons header-icon">menu</i></UIButtonView>;
		let searchButton = <UIButtonView icon={true} onClick={AppActions.toggleDrawer}><i className="material-icons header-icon">search</i></UIButtonView>;
		let moreButton = <UIButtonView icon={true} onClick={AppActions.toggleDrawer}><i className="material-icons header-icon">more_vert</i></UIButtonView>;
		let secondaryButtons = [searchButton, moreButton];

		return 	<Layout vertical={true}>
					<FixedCell className="header">
						<UIHeaderView
							title="Scout"
							primaryButton={primaryButton}
							secondaryButtons={secondaryButtons}
						>Scout</UIHeaderView>
					</FixedCell>
					<FlexCell fillFix={true}>
						{this.props.children}
					</FlexCell>
				</Layout>;
	}	
});

let InvoiceRoute = React.createClass({
	render(){
		let primaryButton = <UIButtonView 
								icon={true} 
								onClick={AppActions.toggleDrawer}
							><i className="material-icons header-icon">menu</i></UIButtonView>;
		return 	<Layout vertical={true}>
					<FixedCell className="header">
						<UIHeaderView 
							primaryButton={primaryButton}
							title="Invoices"
						/>
					</FixedCell>
					<FlexCell fillFix={true}>
						{this.props.children}
					</FlexCell>
				</Layout>;		
	}
});

class UIFamilyContact extends React.Component{
	render(){
		let data = this.props.data;
		let info = data.meta;

		return  <div className='AppUser-List'>
					<Layout horizontal={true} alignItems={'center'}>
						<FixedCell>
							<img className='AppUser__UserImage' src={info.photo} />
						</FixedCell>
						<FlexCell>
							<h2 className="mdl-text mdl-typography--subhead">{info.name}</h2>
							<h2 className="mdl-text mdl-typography--title">${data.spent.toFixed(2)}</h2>
						</FlexCell>
					</Layout>
				 </div>;
	}
}

let SharingRoute = React.createClass({
	getInitialState(){
		return {
			hasMounted: true
		}
	},
	componentDidMount(){
		this.setState({
			hasMounted: true
		});
	},

	render(){
		let primaryButton = <UIButtonView 
						icon={true} 
						onClick={AppActions.toggleDrawer}
					><i className="material-icons header-icon">menu</i></UIButtonView>;


		let cnamefab = classNames("fab-container", {
			'fab-container--ready': this.state.hasMounted
		});

		let accounts =	<div title={"Accounts"} className="scroll-container">
						<div className="scroll-wrapper">
							{Accounts.sharedSources.map( sharedSource => {
								return <UIAccount data={sharedSource}/>
							})}
						</div>
					</div>;

		let fam  =  <div title={"People"} className="scroll-container">
						<div className="scroll-wrapper">
							{Accounts.family.map( familyMem => {
								return <UIFamilyContact data={familyMem}/>
							})}
						</div>
					</div>;

		return <Layout vertical={true}>
					<FixedCell className="header">
						<UIHeaderView 
							primaryButton={primaryButton}
							title="Family & Sharing"
						/>
					</FixedCell>
					<FlexCell fillFix={true}>
						<UITabsView options={{
							slidesPerView: 1
						}}>
							{fam}
							{accounts}
						</UITabsView>
						<div className={cnamefab}>
							<UIButtonView 
								fab={true} 
								raised={true}
								colored={true}
								ripple={true} 
							className="primary-fab"><i className="material-icons">playlist_add</i></UIButtonView>
						</div>
					</FlexCell>
				</Layout>;	
	}
});

let AccountsRoute = React.createClass({
	getInitialState(){
		return {
			hasMounted: false
		};
	},

	componentDidMount(){
		this.setState({
			hasMounted: true
		});
	},

	render(){
		let primaryButton = <UIButtonView 
								icon={true} 
								onClick={AppActions.toggleDrawer}
							><i className="material-icons header-icon">menu</i></UIButtonView>;
		let cards = 	<div title={'Cards'} className="scroll-container">
							<div className="scroll-wrapper">
								{Accounts.cards.map( cardData => {
									return <UIAccount data={cardData}/>
								})}
							</div>
						</div>;
								// <h3 className="mdl-typography--caption-color-contrast micro-labels clean-margins">Shared Accounts</h3>
								// {Accounts.sharedSources.map( sharedSource => {
								// 	return <UIAccount data={sharedSource}/>
								// })}

		let banks =	<div title={"Banks"} className="scroll-container">
						<div className="scroll-wrapper">
							{Accounts.banks.map( cardData => {
								return <UIAccount data={cardData}/>
							})}
						</div>
					</div>;
		let cnamefab = classNames("fab-container", {
			'fab-container--ready': this.state.hasMounted
		});

		return 	<Layout vertical={true}>
					<FixedCell className="header">
						<UIHeaderView 
							primaryButton={primaryButton}
							title="Accounts"
						/>
					</FixedCell>
					<FlexCell fillFix={true}>
						<UITabsView options={{
							slidesPerView: 1
						}}>
							{cards}
							{banks}
						</UITabsView>
						<div className={cnamefab}>
							<UIButtonView 
								fab={true} 
								raised={true}
								colored={true}
								ripple={true} 
							className="primary-fab"><i className="material-icons">playlist_add</i></UIButtonView>
						</div>
					</FlexCell>
				</Layout>;		
	}
});


let routes = 	<Router history={history}>
					<Route path="/" component={App}>
						<Route path="home" components={TransactionsRoute} />
						<Route path="pay" component={PaymentsRoute}>
							<Route path="who" component={UIPickerView} />
						</Route>
						<Route path="charge" component={ChargeRoute}>
							<Route path="who" component={UIPickerView} />
						</Route>
						<Route path="scout" component={ScoutRoute}>
						</Route>
						<Route path="invoices" component={InvoiceRoute} />
						<Route path="accounts" component={AccountsRoute} />
						<Route path="sharing" component={SharingRoute} />
					</Route>
			 	</Router>

React.render(routes, document.getElementById('container'));
