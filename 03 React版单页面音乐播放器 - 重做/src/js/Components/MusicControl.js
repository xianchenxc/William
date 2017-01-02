import React,{ Component } from 'react';

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
		return(
		<div className="music-box">
			<audio ref="audio" src={this.props.src} onEnded={this.props.nextSong} onTimeUpdate={this.props.songTimeUpdate}></audio>
			<div className="music-control">
				<span className="m-icon m-prev music-prev" onClick={this.props.preSong}></span>		
				<span className={`m-icon music-play ${this.props.play?'m-pause':'m-play'}`} onClick={this.playShift}></span>
				<span className="m-icon m-next music-next" onClick={this.props.nextSong}></span>				
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
			<div className="music-playMode">
				<span className={`m-icon ${this.props.playMode==1?'m-radom':'m-xunhuan'}`}></span>		
			</div>
			<div className="music-listicon">
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

export default MusicControl;