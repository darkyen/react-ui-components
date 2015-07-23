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
import {Locations, Location} from 'react-router-component';
import DataSource from '../../src/lib/DataSource.js';
import classNames from 'classnames';
import 'whatwg-fetch';
import _ from 'lodash';
import Promise from 'bluebird';
import Swiper from 'swiper';

let _cards = [{
	type: 'cc',
	brand: 'Diners Club',
	number: '**** - ****** - 1480',
	name: 'Abhishek Hingnikar',
},{
	type: 'dc',
	brand: 'MasterCard',
	number: '**** - **** - **** - 5491',
	name: 'Abhishek Hingnikar',
},{
	type: 'fs',
	brand: 'Family Sharing',
	number: '+91 9425 45 3046',
	name: 'Pramod Hingnikar'
}];

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

class Transactions extends DataSource{
	constructor(props, list){
		super(props);
		console.log("Building");
		if( !list && !localStorage.transactions ){
			let transactions = [];
			let all = cm.getAll();
			let len = all.length();
			let now = Date.now()
			for( var i = 0; i < 40; i++ ){
				now -= Math.random() * 360000;
				transactions.push({
					type: (Math.random() * 2) > 1 ? 'debit': 'credit',
					amount: Math.random() * 1000,
					otherParty: all.byIndex( ~~(Math.random() * len) ),
					date: now
				});
			}
			localStorage.transactions = JSON.stringify(transactions);
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
						<FixedCell className="header-button">{this.props.primaryButton}</FixedCell>
						<FlexCell>
							<h2 className="mdl-typography--title">{this.props.title}</h2>
						</FlexCell>
						<FixedCell>{this.props.secondaryButtons}</FixedCell>
					</Layout>
				</div>;
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

class Card extends React.Component{
	render(){
		let info = this.props.data;
		return 	<div className='card-account mdl-shadow--2dp'>
					<h6 className="mdl-typography--caption clean-margins">{info.brand}</h6>
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
		// }), 10000);
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
						<CardSwiper />
					</div>;
/*						<h1 className="mdl-typography--light-heading">{data.amount}</h1>
						<p className="mdl-typography--text-justify">Hey, you owe me money for the subway yesterday, I expect full cash back !</p>
*/
		let menuButtons = [
			<UIButtonView ripple={true} icon={true}><i className="material-icons">credit_card</i></UIButtonView>,
			<UIButtonView ripple={true} icon={true}><i className="material-icons">more_vert</i></UIButtonView>
		]
		let actions = [<UIButtonView ripple={true}>Pay Now</UIButtonView>, <UIButtonView ripple={true}>Remind Later</UIButtonView>]
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
	}

	render(){
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
					<UIButtonView 
						fab={true} 
						raised={true}
						colored={true}
						ripple={true} 
					className="primary-fab"><i className="material-icons">add</i></UIButtonView>
				</div>
	}
}

class UIAccountsView extends React.Component{
	render(){
		return 	<div className="accounts">
				</div>;
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
		let primaryButton = <UIButtonView icon={true} onClick={e => this.toggleDrawer(e)}><i className="material-icons header-icon">menu</i></UIButtonView>;
		let links = [{
			name: 'Home',
			link: '/#/'
		},{
			name: 'Bills',
			link: '/#/bills/'
		},{
			name: 'Accounts',
			link: '/#/accounts/'
		},{
			name: 'Requests',
			link: '/#/requests/'
		},{
			name: 'Invite',
			link: '/#/invite/'			
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

		return 	<UIDrawerView navOpen={this.state.navOpen} links={links} header={header}>
					<Layout vertical={true}>
						<FixedCell className="header">
							<UIHeaderView 
								primaryButton={primaryButton}
								title="Home"
							/>
						</FixedCell>
						<FlexCell fillFix={true}>
							<Locations hash>
								<Location path="/" handler={TransactionHistoryView}></Location>
								<Location path="/pay/" handler={UIPickerView}></Location>
								<Location path="/charge/" handler={UIPickerView}></Location>
								<Location path="/accounts/" handler={UIAccountsView}></Location>
							</Locations>
						</FlexCell>
					</Layout>
					<AppWidePaymentOverlay></AppWidePaymentOverlay>
				</UIDrawerView>;

		// return <AppWidePaymentOverlay></AppWidePaymentOverlay>;			 
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
