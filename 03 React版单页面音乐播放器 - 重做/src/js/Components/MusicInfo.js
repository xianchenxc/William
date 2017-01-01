import React,{ Component } from 'react';

export default class MusicInfo extends Component{
	render(){
		let bg = {};
		if(this.props.url!==''){
			bg = {
				backgroundImage: 'url("'+this.props.url+'")'
			};
		}
		return (
		<div className="music-info">
			<div className="music-img" style={bg}>
			</div>
			<div className="music-baseInfo">
				<h6>{this.props.title}</h6>
				<p>{this.props.author}</p>
			</div>
		</div>
		);
	}
}