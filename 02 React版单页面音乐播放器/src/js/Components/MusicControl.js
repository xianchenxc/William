import React,{ Component } from 'react';
import { connect } from 'react-redux';
import { nextSong,showPlayList,preSong,songTimeUpdate,changeVol,changeProgress,playStateShift} from '../redux/Action';
import { timeFormat } from '../util/tool.js';

class MusicControl extends Component{
	constructor(props){
		super(props);
		this.playShift = this.playShift.bind(this);
		this.changeVol = this.changeVol.bind(this);
		this.changeProgress = this.changeProgress.bind(this);
	}
	playShift(){
		this.props.playStateShift(this.refs.audio);
	}
	changeVol(e){
		this.props.changeVol(e,this.refs.audio);
	}
	changeProgress(e){
		this.props.changeProgress(e,this.refs.audio);
	}
	componentDidMount(){
		this.refs.audio.volume = this.props.volume;
	}
	componentDidUpdate(preprops){                            
		if(this.props.src!==''&&this.props.src!==preprops.src){
			this.props.playStateShift(this.refs.audio);
		}
	}
	render(){
		let { play,src,playMode,nextSong,preSong,showPlayList,songTimeUpdate } = this.props;
		return(
		<div className="music-box">
			<audio ref="audio" src={src} onEnded={nextSong} onTimeUpdate={songTimeUpdate}></audio>
			<div className="music-control">
				<span className="m-icon m-prev music-prev" onClick={preSong}></span>		
				<span className={`m-icon music-play ${play}`} onClick={this.playShift}></span>
				<span className="m-icon m-next music-next" onClick={nextSong}></span>				
			</div>
			<span className="music-curTime">{this.props.curTime}</span>
			<span className="music-totalTime">{this.props.totalTime}</span>
			<div className="music-volume">
				<span className="icon-volume"></span>
				<div className="music-volumeBar" onClick={this.changeVol}>
					<div className="music-curVolume" style={{width:`${this.props.volume*100}%`}}>
					</div>
				</div>
			</div>
			<div className="music-playMode" onClick={this.props.changeMode}>
				<span className={`m-icon ${playMode}`}></span>		
			</div>
			<div className="music-listicon" onClick={showPlayList}>
				<div className="music-listcnt">{this.props.listcnt}</div>
			</div>
			<div className="music-timeline">
				<div className="music-lineContainer" onClick={this.changeProgress}>
					<div className="music-playhead" style={{width:this.props.timeWidth}}></div>
				</div>
			</div>
		</div>
		);
	}
}

const mapStateToProps = state => {
	let { song_url,playFlag,currentTime,file_duration,volume } = state.musicState;
	let { mode,length } = state.curPlayList;
	let timeWidth = `${currentTime*100/file_duration}%`;
	return {
		src : song_url,
		play: `${playFlag ?'m-pause':'m-play'}`,
		curTime: timeFormat(currentTime),
		totalTime: timeFormat(file_duration),
		volume: volume,
		timeWidth: timeWidth,
		playMode: `${mode == 1 ? 'm-radom':'m-xunhuan'}`,
		listcnt: length
	}
}

const mapDispatchToProps = (dispatch,ownProps) => {
	return {
		showPlayList: () => dispatch(showPlayList()),
		nextSong: () => dispatch(nextSong()),
		preSong: () => dispatch(preSong()),
		songTimeUpdate: (e)=> dispatch(songTimeUpdate(e)),
		changeVol: (e,audio)=> dispatch(changeVol(e,audio)),
		changeProgress: (e,audio) => dispatch(changeProgress(e,audio)),
		playStateShift: (audio) => dispatch(playStateShift(audio)),
	};
};

export default connect(mapStateToProps,mapDispatchToProps)(MusicControl);