import React,{ Component } from 'react';
import { connect } from 'react-redux';
import { getLyric } from '../redux/Action/index.js';

import '../../css/lyric.scss';

class Lyric extends Component{
	constructor(props){
		super(props);
	}
	componentDidMount(){
		const { dispatch } = this.props;
		dispatch(getLyric());
	}
	componentWillReceiveProps(nextProps){
		const { dispatch } = this.props;
		console.log(nextProps.song_id,nextProps.lyricsong_id);
		if(nextProps.song_id!==nextProps.lyricsong_id){
			dispatch(getLyric());
		}
	}
	render (){
		var lyricList = this.props.lyric.map(function(item,index){
			return <li data-time={item[0]} key={index}>{item[1]}</li>;
		});
		return (
			<ul className="lyricList">
				{lyricList}
			</ul>
		);
	}
}

function mapStateToProps(state){
	let {
		lyricsong_id = state.musicState.song_id,
		lyric=[[0,'Loading...']]
	} = state.lyricState;
	let song_id = state.musicState.song_id;
	return {
		song_id,
		lyricsong_id,
		lyric
  	};
}

export default connect(mapStateToProps)(Lyric);