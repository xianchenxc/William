import React,{ Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { MusicOperation } from '../redux/Action/ActionCreator.js'

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
		this.refs['audio'].onended = this.props.nextMusic;
	}
	componentDidUpdate(){         
		this.playOrPause(this.props);
		this.refs['audio'].onended = this.props.nextMusic;
	}
	playOrPause(props){
		if(props.isPlay){
			this.refs['audio'].play();
		}else{
			this.refs['audio'].pause();
		}
	}
	render(){
		let imgURL = `url(${this.props.curMusic['pic_small']})`;
		let audioURL = this.props.curMusic['song_url'];
		let title = this.props.curMusic.title;
		let author =this.props.curMusic.author
		return (
			<div>
				<div className="header">
					<Link to="/" className="">频道</Link>
					<Link to="search" className="">搜索</Link>
					<Link to="musicList" className="">列表</Link>
				</div>
				<div className="player-panel">
					<audio ref="audio" src={audioURL}></audio>
					<Link to="lyric" className="music-img" style={{backgroundImage:imgURL}}></Link>
					<div className="music-baseInfo">
						<h6 className="music-name">{title}</h6>
						<p className="music-artist">{author}</p>
					</div>
					<div className="music-control">
						<span className={`m-icon music-play ${this.props.isPlay?'m-pause':'m-play'}`} onClick={this.props.playOrPause}></span>
						<span className="m-icon m-next music-next" onClick={this.props.nextMusic}></span>
					</div>
					<div className="progress">
					</div>
				</div>
			</div>
		);
	}
}

const mapStateToProps = state => {
	const {
		isPlay,
		curMusic
	} = state.musicState || {
		isPlay: false,
		curMusic: {url:'#',title:'Not Know',author:'Not Know'} 
	};
	return {
		isPlay,
		curMusic
	};
}
const mapDispatchToProps = (dispatch,ownProps) => {
	return {
		playOrPause: () => dispatch(MusicOperation('PLAYORPAUSE')),
		nextMusic: () => dispatch(MusicOperation('MUSICCHANGE'))
	}
}

export default connect(mapStateToProps,mapDispatchToProps)(App);