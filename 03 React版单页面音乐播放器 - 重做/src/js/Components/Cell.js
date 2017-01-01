import React,{ Component } from 'react';
import { timeFormat } from '../util/tool.js';

class Cell extends Component{
	constructor(props){
		super(props);
	}
	render(){
		return (
			<tr className="cell">
				<td style={{textAlign:"right"}}>{this.props.seq<=9?'0'+this.props.seq:this.props.seq}</td>
				<td className="m-icon m-heart" style={{color: "#C52F30"}}></td>
				<td>{this.props.title}</td>
				<td>{this.props.author}</td>
				<td>{this.props.album_title}</td>
				<td>{timeFormat(this.props.file_duration)}</td>
			</tr>
		);
	}
};

export default Cell;