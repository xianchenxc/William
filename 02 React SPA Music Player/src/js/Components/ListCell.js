import React,{ Component } from 'react';
import { connect } from 'react-redux';
import { playSpecialSong,addToPlayList,addToLocalList } from '../redux/Action/';
import { timeFormat,formatText,getIndex } from '../util/tool.js';
import objectAssign from 'object-assign';


class Cell extends Component{

	render(){
		const { indexInLL,seq,title,author,album_title,duration,duractionStyle,play,addToPlayList,addToLocalList } = this.props;
		return (
			<tr className="cell" onDoubleClick ={play}>
				<td style={{textAlign:"right"}}>{seq}</td>
				<td>
					<span className="m-icon m-heart" style={{color: this.props.heartColor}} onClick={addToLocalList.bind(this,indexInLL)}></span>
					<span className="cell-add" onClick={addToPlayList}>+</span>
				</td>
				<td>{title}</td>
				<td>{author}</td>
				<td>{album_title}</td>
				<td style={duractionStyle}>{duration}</td>
			</tr>
		);
	}
};

const mapStateToProps = (state,ownsProps) =>{
	let { song_list } = state.localPlayList;
	let indexInLL = getIndex('song_id',ownsProps,song_list);
	let heartColor = `${indexInLL===-1?'#cdd2d7':'#EB363F'}`;
	let duractionStyle = ownsProps.durationShow ? {} : { display: "none" };
	let duration = ownsProps.durationShow ? timeFormat(ownsProps.file_duration) : 0;
	let seq = ownsProps.seq<=9?'0'+ownsProps.seq:ownsProps.seq;
	let title = formatText(ownsProps.title);
	let author = formatText(ownsProps.author);
	let album_title = formatText(ownsProps.album_title);
	return {
		seq,
		title,
		author,
		album_title,
		duration,
		indexInLL,
		heartColor,
		duractionStyle,
	};
};

const mapDispatchToProps = (dispatch,ownProps) => {
	return {
		play: () => dispatch(playSpecialSong(ownProps.song_id,ownProps.info)),
		addToPlayList: () => dispatch(addToPlayList(ownProps.info)),
		addToLocalList: (index) => dispatch(addToLocalList(ownProps.info,index)),
	}
};

export default connect(mapStateToProps,mapDispatchToProps)(Cell);