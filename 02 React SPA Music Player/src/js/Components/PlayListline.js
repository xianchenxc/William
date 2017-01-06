import React,{ Component } from 'react';
import { connect } from 'react-redux';
import { playListSong } from '../redux/Action/';
import { timeFormat,formatText } from '../util/tool.js';

class Listline extends Component{
	render(){
		let { title,author,file_duration,curIndex,seq,playFlag,play } = this.props;
		let iconClass = `m-icon${curIndex!==seq?'':playFlag?' m-play':' m-pause'}`;
		return (
			<tr className="cell" onDoubleClick ={play}>
				<td>
					<span className={iconClass}></span>
					{formatText(title)}
				</td>
				<td>{formatText(author)}</td>
				<td>{timeFormat(file_duration)}</td>
			</tr>
		);
	}
}

const mapStateToProps = state => {
	let { curIndex } = state.curPlayList;
	let { playFlag } = state.musicState;
	return {
		curIndex,
		playFlag
	};
}

const mapDispatchToProps = (dispatch,ownProps) => {
	return {
		play: () => dispatch(playListSong(ownProps.song_id,ownProps.seq))
	}
}


export default connect(mapStateToProps,mapDispatchToProps)(Listline);