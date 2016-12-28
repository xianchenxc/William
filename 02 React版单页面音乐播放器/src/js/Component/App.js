import React,{ Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import * as ItemsActions from '../redux/Action';
import { bindActionCreators } from 'redux';

import '../../css/icon.scss';
import '../../css/font.scss';
import '../../css/app.scss';

class App extends Component{
	constructor(props){
		super(props);
		this.playOrPause = this.playOrPause.bind(this);
	}
	componentDidMount(){
		this.playOrPause(this.props);
	}
	componentDidUpdate(){         
		this.playOrPause(this.props);
	}
	playOrPause(props){
		if(props.isPlay&&this.refs['audio'].paused){
			console.log('播放啦',this.refs['audio'].paused);
			this.refs['audio'].play();
		}else if(!props.isPlay&&!this.refs['audio'].paused){
			console.log('暂停啦',this.refs['audio'].paused);
			this.refs['audio'].pause();
		}
	}
	render(){
		const actions = this.props.actions;
		let timeWidth = `${this.props.currentTime*100/this.props.curMusic['file_duration']}%`;

		return (
			<div>
				<div className="header">
					<Link to="/" className="nav" activeStyle={{color:'#fff'}}>频道</Link>
					<Link to="search" className="nav" activeStyle={{color:'#fff'}}>搜索</Link>
					<Link to="musicList" className="nav" activeStyle={{color:'#fff'}}>列表</Link>
				</div>
				<div>
 					{this.props.children}
 				</div>
				<div className="player-panel">
					<audio ref="audio" src={this.props.curMusic['song_url']} onEnded={actions.nextMusic} onTimeUpdate={actions.ontimeupdate}></audio>
					<Link to="/lyric" className="music-img" style={{backgroundImage:`url(${this.props.curMusic['pic_small']})`}}></Link>
					<div className="music-baseInfo">
						<h6 className="music-name">{this.props.curMusic.title}</h6>
						<p className="music-artist">{this.props.curMusic.author}</p>
					</div>
					<div className="music-control">
						<span className={`m-icon music-play ${this.props.isPlay?'m-pause':'m-play'}`} onClick={actions.playOrPause}></span>
						<span className="m-icon m-next music-next" onClick={actions.nextMusic}></span>
					</div>
					<div ref="timeline" className="timeline">
						<div ref="playhead" className="playhead" style={{width:timeWidth}}></div>
					</div>
				</div>
			</div>
		);
	}
}

const mapStateToProps = state => {
	const {
		isPlay,
		currentTime,
		curMusic
	} = state.musicState || {
		isPlay: false,
		currentTime: 0,
		curMusic: {url:'#',title:'Not Know',author:'Not Know'} 
	};
	return {
		isPlay,
		currentTime,
		curMusic
	};
}
const mapDispatchToProps = (dispatch,ownProps) => {
	return {
		actions: bindActionCreators(ItemsActions,dispatch),
		//playOrPause: () => dispatch(MusicOperation('PLAYORPAUSE')),
		//nextMusic: () => dispatch(MusicOperation('MUSICCHANGE')),
		//timeUpdate: () => dispatch(MusicOperation('TIMEUPDATE'))
	}
}

export default connect(mapStateToProps,mapDispatchToProps)(App);