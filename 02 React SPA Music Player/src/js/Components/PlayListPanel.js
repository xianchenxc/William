import React,{ Component } from 'react';
import { connect } from 'react-redux';
import PlayListline from '../Components/PlayListline';
import { clearAllPlayList,loveAllPlayList } from '../redux/Action';

class CurListPanel extends Component{

	render(){
		const { length,song_list,curIndex,isDisplay,clearAll,loveAll } = this.props;
		let trs = song_list.map((item,index) =>
				<PlayListline {...item} seq={index} key={index} />
			);
		return (
			<div className="playlist" style={{display:`${isDisplay?'block':'none'}`}}>
				<div className="playlist-type">播放列表</div>
				<div className="playlist-info">
					<span className="playlist-cnt">总{length}首</span>
					<span className="playlist-clearall" onClick={clearAll}>清空</span>
					<span className="playlist-separator">|</span>
					<span className="playlist-loveall" onClick={loveAll} >收藏全部</span>
				</div>
				<div className="playlist-content">
					<table>
						<tbody>
							{trs}
						</tbody>
					</table>
				</div>
			</div>
		);
	}
}

const mapStateToProps = (state,ownProps) => {
	let {
		isDisplay,
		length,
		song_list,
		curIndex
	} = state.curPlayList;
	return {
		isDisplay,
		length,
		song_list,
		curIndex
	}
};

const mapDispatchToProps = (dispatch) => {
	return {
		clearAll: () => dispatch(clearAllPlayList()),
		loveAll: () => dispatch(loveAllPlayList())
	}
};

export default connect(mapStateToProps,mapDispatchToProps)(CurListPanel);