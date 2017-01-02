import React,{ Component } from 'react';
import { timeFormat } from '../util/tool.js';

class Cell extends Component{
	constructor(props){
		super(props);
		this.play = this.play.bind(this);
		this.addToPlayList = this.addToPlayList.bind(this);
		this.addToLocalList = this.addToLocalList.bind(this);
	}
	play(){
		this.props.playSpecialSong(this.props.song_id,this.props.info);
	}
	addToPlayList(){
		this.props.addToPlayList(this.props.info);
	}
	addToLocalList(){
		this.props.addToLocalList(this.props.info);
	}
	render(){
		return (
			<tr className="cell" onDoubleClick ={this.play}>
				<td style={{textAlign:"right"}}>{this.props.seq<=9?'0'+this.props.seq:this.props.seq}</td>
				<td>
					<span className="m-icon m-heart" style={{color: "#cdd2d7"}} onClick={this.addToLocalList}></span>
					<span className="cell-add" onClick={this.addToPlayList}>+</span>
				</td>
				<td>{this.props.title}</td>
				<td>{this.props.author}</td>
				<td>{this.props.album_title}</td>
				<td>{timeFormat(this.props.file_duration)}</td>
			</tr>
		);
	}
};

export default Cell;