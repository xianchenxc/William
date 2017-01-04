import React,{ Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

class MusicInfo extends Component{
	render(){
		const { title,author,bg } = this.props;
		return (
		<div className="music-info">
			<Link to="lyric" className="music-img" style={bg}>
			</Link>
			<div className="music-baseInfo">
				<h6>{title}</h6>
				<p>{author}</p>
			</div>
		</div>
		);
	}
}

const mapStateToProps = state => {
	let { title,author,pic_small } = state.musicState;
	let bg = pic_small!==''?{backgroundImage: 'url("'+pic_small+'")'}:{};
	return {
		title,
		author,
		bg
	}
}

export default connect(mapStateToProps)(MusicInfo);