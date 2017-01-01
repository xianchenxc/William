import React,{ Component } from 'react';
import MusicInfo from '../Components/MusicInfo';
import MusicControl from '../Components/MusicControl';
import { timeFormat } from '../util/tool.js';

class MusicPanel extends Component{
	render(){
		return (
			<div className="player-panel">
				<MusicInfo title={this.props.title} author={this.props.author} url={this.props.pic_small} />
				<MusicControl play={this.props.playFlag} curTime={timeFormat(this.props.currentTime)} totalTime={timeFormat(this.props.file_duration)} volume={this.props.file_duration}
					src={this.props.song_url} playStateShift={this.props.playStateShift} />
			</div>
		);
	}

}

export default MusicPanel;