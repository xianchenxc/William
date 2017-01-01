import React,{ Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import * as ItemsActions from '../redux/Action';
import { bindActionCreators } from 'redux';
import MusicPanel from '../Components/MusicPanel';
import SideBar from '../Components/SideBar';

import '../../css/icon.scss';
import '../../css/font.scss';
import '../../css/app.scss';

class App extends Component{
	render(){
		const actions = this.props.actions;
		let musicState = this.props.musicState;
		return (
			<div>
				<div className="header">
					<div className="logo">Baidu 音乐API</div>
				</div>
				<SideBar />
				<div className="rootContainer">
 					{this.props.children}
 				</div>
 				<MusicPanel {...musicState} playList={this.props.playList} 
 				playStateShift={actions.playStateShift}/>
			</div>
		);
	}
}

const mapStateToProps = state => {
	let {
		musicState,
		playList
	} = state;
	return {
		musicState,
		playList
	};
}

const mapDispatchToProps = (dispatch,ownProps) => {
	return {
		actions: bindActionCreators(ItemsActions,dispatch),
	}
}

export default connect(mapStateToProps,mapDispatchToProps)(App);