import React,{ Component } from 'react';

class LyricInfo extends Component{
	render(){
		return (
			<div className="lyric-info">
				<h3>{this.props.title}</h3>
				专辑：<span>{this.props.album_title}</span>
				歌手：<span>{this.props.author}</span>
			</div>
		);
	}
}

export default LyricInfo;