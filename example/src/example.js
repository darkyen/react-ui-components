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

import DataSource from '../../src/lib/DataSource.js';
import classNames from 'classnames';
import 'whatwg-fetch';
import _ from 'lodash';
import Promise from 'bluebird';

class ContactsManager{
	constructor(){
		this._changeListeners = [];
		if( !localStorage.contacts ){
			this._contacts = []		
			this._promise = fetch('http://api.randomuser.me/?results=100&key=09DJ-YG4T-OX1K-9LI5')
						.then(response => response.json())
						.then(contacts => this.updateContacts(contacts.results))
						.catch((ex) => console.error(ex));
			this._max = 0;	
			return;
		}
		this._hasContacts = true;
		this._contacts = JSON.parse(localStorage.contacts)
		this._contacts.sort((a, b) => { return a.name === b.name ? 0 :  a.name > b.name  ?  1 : - 1; });
		this._max = this._contacts.length;	
	}
	
	updateContacts(contacts){
		console.log("Got results");
		try{
			let usableContacts = contacts.map( (contact, idx) => {
				let fullName = contact.user.name.first + ' ' + contact.user.name.last;
				return {
					id: idx,
					name: fullName,
					phone: contact.user.cell,
					photo: contact.user.picture.thumbnail,
					times: ~~(100 * Math.random())
				};
			})
			localStorage.contacts = JSON.stringify(usableContacts);
			this._hasContacts = true;
			this._contacts = usableContacts;
			this._max = this._contacts.length;
		}catch(e){
			console.error(e);
		}
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


class UIHeaderView extends React.Component{
	render(){
		return  <div className='HeaderView mdl-layout'>
					<Layout horizontal={true} alignItems={'center'}>
						<FixedCell>{this.props.primaryButton}</FixedCell>
						<FlexCell>
							<h2 className="mdl-typography--title">{this.props.title}</h2>
						</FlexCell>
						<FixedCell>{this.props.secondaryButtons}</FixedCell>
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
							<h2 className="mdl-text mdl-typography--title">{info.name}</h2>
							<h4 className="mdl-text mdl-typography--body-1">{'+1 ' + info.phone }</h4>
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

class AppWidePaymentOverlay extends React.Component{
	constructor(man){
		super(man);
		this.state = {};
	}

	componentDidMount(){
		/* run the class after it this way */
		setTimeout(t => this.setState({
			opened: true
		}), 10);
	}

	render(){
		let cname = classNames('App__Overlay', {
			'App__Overlay--open': this.state.opened
		});
		let data = {
			requestedBy: 'Microsoft',
			amount: '$52.20',
			reason: 'Azure Monthy Bill',
		};
		let stxt = <span>{data.requestedBy} is trying to charge you {data.amount} for {data.reason}</span>;
		let actions = [<UIButtonView>Accept</UIButtonView>]
		return 	<div className={cname}>
					<UICard 
						titleText={'Payment Request'} 	
						supportingText={stxt}
						actions={actions}
					></UICard>
				</div>
	}
}

class App extends React.Component{
	constructor(p){
		super(p);
		this.state = {
			navOpen: false
		};
	}
	toggleDrawer(){
		this.setState({
			navOpen: !this.state.navOpen
		});
	}
	render () {
		let primaryButton = <UIButtonView onClick={e => this.toggleDrawer(e)}><i className="material-icons header-icon">menu</i></UIButtonView>;
		let links = [{
			name: 'Pay',
			link: "/pay/",
		},{
			name: 'Request',
			link: '/charge/'
		},{
			name: 'Accounts',
			link: '/accounts/'
		},{
			name: 'Track',
			link: '/'
		}];

		let header = <div className='AppUser-Header'>
						<Layout horizontal={true} alignItems={'center'}>
							<FixedCell>
								<img className='AppUser__UserImage' src={'https://randomuser.me/api/portraits/med/men/55.jpg'} />
							</FixedCell>
							<FlexCell>
								<h2 className="mdl-text mdl-typography--title">Ruben Jennings</h2>
								<h4 className="mdl-text mdl-typography--body-1">+1-(227)-939-2910</h4>
							</FlexCell>
						</Layout>
					 </div>;
		return <AppWidePaymentOverlay></AppWidePaymentOverlay>;			 
		// return  <UIDrawerView navOpen={this.state.navOpen} links={links} header={header}>
		// 			<Layout vertical={true}>
		// 				<FixedCell>
		// 					<UIHeaderView 
		// 						primaryButton={primaryButton}
		// 						title="Who to pay"
		// 					/>
		// 				</FixedCell>
		// 				<FlexCell fillFix={true}>
		// 					<UIPickerView />
		// 				</FlexCell>
		// 			</Layout>
		// 		</UIDrawerView>;
	}
}

React.render(<App />, document.getElementById('container'));
