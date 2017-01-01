import React,{ Component } from 'react';

class MusicControl extends Component{
	constructor(props){
		super(props);
		this.playShift = this.playShift.bind(this);
	}
	playShift(){
		this.props.playStateShift(this.refs.audio);
	}
	componentDidUpdate(preprops){                            
		if(this.props.src!==''&&this.props.src!==preprops.src){
			this.props.playStateShift(this.refs.audio);
		}
	}
	render(){
		return(
		<div className="music-box">
			<audio ref="audio" src={this.props.src}></audio>
			<div className="music-control">
				<span className="m-icon m-prev music-prev"></span>		
				<span className={`m-icon music-play ${this.props.play?'m-pause':'m-play'}`} onClick={this.playShift}></span>
				<span className="m-icon m-next music-next"></span>				
			</div>
			<span className="music-curTime">{this.props.curTime}</span>

			<span className="music-totalTime">{this.props.totalTime}</span>
			<div className="music-volume">
				<span className="m-icon"></span>
				<div className="music-volumeBar">
					<div className="music-curVolume">
					</div>
				</div>
			</div>
			<div className="music-playMode">
				<span className="m-icon .m-xunhuan"></span>		
			</div>
			<div className="music-timeline">
				<div className="music-lineContainer">
					<div className="music-playhead"></div>
				</div>
			</div>
		</div>
		);
	}
}

export default MusicControl;