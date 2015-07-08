import React from 'react'	;
import {UIScrollView, UIDrawerView} from 'react-ui-components';
import DataSource from '../../src/lib/DataSource.js';
import classNames from 'classnames';

class Feed extends DataSource{
  constructor(length){
    super();
    this._max = length;
  }
  
  getItemAtIndex(index){
    if( index < 0 || index > this._max ){
       return DataSource.IndexOutOfBound;
    }
    return {
      title: 'Title #' + index,
      image: 'http://lorempixel.com/443/400/?t=' + index + '.' + Math.random(),
      descp: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla paria.'
    }
  }
  
  get length(){
    return this._max;
  }
}

class Random extends React.Component{
  render(){
    let random = this.props.data;
    return <div className="Random">


              <img className="Random--Image" src={random.image} />
              <div className="Random--Details">
                 <h2 className="Random--Title">{random.title}</h2>
                 <p className="Random--Content">{random.descp}</p>
              </div>
           </div>
  }
};

class UIHeaderView extends React.Component{
	render(){
		return  <div className='HeaderView'>
					<Layout horizontal={true} alignItems={'center'}>
						<FixedCell>{this.props.primaryButton}</FixedCell>
						<FlexCell>
							<h1>{this.props.title}</h1>
						</FlexCell>
						<FixedCell>{this.props.secondaryButtons}</FixedCell>
					</Layout>
				</div>;
	}
}

class Layout extends React.Component{
	render(){
		let cname = classNames(
			{'Vertical-Layout': this.props.vertical},
			{'Horizontal-Layout': this.props.horizontal}
		);
		
		let styles = {
			alignItems: this.props.alignItems
		};

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
		return <div className='Cell-Fixed'>{this.props.children}</div>
	}
}

class App extends React.Component{
	constructor(p){
		super(p);
		this.dataSource = new Feed(5000);
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
		// return				<UIScrollView 
		// 		              dataSource={this.dataSource} 
		// 		              elementRenderer={Random}
		// 		              elementHeight={540}
		// 					/>
		let primaryButton = <button onClick={e => this.toggleDrawer(e)}>s</button>
		let links = [{
			name: 'Home',
			link: "/"
		},{
			name: 'Promise',
			link: '/tatti/'
		},{
			name: 'Promise',
			link: '/tatti/'
		},{
			name: 'Promise',
			link: '/tatti/'
		},{
			name: 'Promise',
			link: '/tatti/'
		},{
			name: 'Promise',
			link: '/tatti/'
		},{
			name: 'Promise',
			link: '/tatti/'
		},{
			name: 'Promise',
			link: '/tatti/'
		}];
		let header = <h2>App</h2>;

		return  <UIDrawerView navOpen={this.state.navOpen} links={links} header={header}>
					<Layout vertical={true}>
						<FixedCell>
							<UIHeaderView 
								primaryButton={primaryButton}
								title="Demo"
							/>
						</FixedCell>
						<FlexCell fillFix={true}>
							<UIScrollView 
				              dataSource={this.dataSource} 
				              elementRenderer={Random}
				              elementHeight={540}
							/>
						</FlexCell>
					</Layout>
				</UIDrawerView>;
	}
}

React.render(<App />, document.getElementById('container'));
