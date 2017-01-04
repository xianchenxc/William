import React,{ Component } from 'react';
import MusicInfo from '../Components/MusicInfo';
import MusicControl from '../Components/MusicControl';


class MusicPanel extends Component{
	render(){
		return (
			<div className="player-panel">
				<MusicInfo />
				<MusicControl />
			</div>
		);
	}

}

export default MusicPanel;