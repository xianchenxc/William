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
					<div className="searchArea">
						<input type="text" placeholder="搜索音乐，歌手，歌词" className="searchInput" onChange={actions.keywordChange}/>
						<Link to="searchBar" className="searchBtn"></Link>
					</div>
				</div>
				<SideBar />
				<div className="rootContainer">
 					{this.props.children}
 				</div>
 				<MusicPanel {...musicState} playList={this.props.curPlayList} 
 				playStateShift={actions.playStateShift} nextSong={actions.nextSong}
 				preSong={actions.preSong} songTimeUpdate={actions.songTimeUpdate}
 				changeVol={actions.changeVol} changeProgress={actions.changeProgress}/>
			</div>
		);
	}
}

const mapStateToProps = state => {
	let {
		musicState,
		curPlayList
	} = state;
	return {
		musicState,
		curPlayList
	};
}

const mapDispatchToProps = (dispatch,ownProps) => {
	return {
		actions: bindActionCreators(ItemsActions,dispatch),
	}
}

export default connect(mapStateToProps,mapDispatchToProps)(App);