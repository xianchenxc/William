import React,{ Component } from 'react';
import MusicInfo from '../Components/MusicInfo';
import MusicControl from '../Components/MusicControl';
import { timeFormat } from '../util/tool.js';

class MusicPanel extends Component{
	render(){
		let timeWidth = `${this.props.currentTime*100/this.props.file_duration}%`;
		return (
			<div className="player-panel">
				<MusicInfo title={this.props.title} author={this.props.author} url={this.props.pic_small} />
				<MusicControl play={this.props.playFlag} curTime={timeFormat(this.props.currentTime)} totalTime={timeFormat(this.props.file_duration)} volume={this.props.volume}
					src={this.props.song_url} timeWidth={timeWidth} playMode={this.props.playList.mode}  listcnt={this.props.playList.length}
					playStateShift={this.props.playStateShift} nextSong={this.props.nextSong} preSong={this.props.preSong} songTimeUpdate={this.props.songTimeUpdate}
					changeVol={this.props.changeVol} changeProgress={this.props.changeProgress}/>
			</div>
		);
	}

}

export default MusicPanel;