import React,{ Component } from 'react';

class Cell extends Component{
	constructor(props){
		super(props);
		this.play = this.play.bind(this);
	}
	play(){
		this.props.instPlay(this.props.songid);
	}
	render(){
		return (
			<li ref="cell" className="cell" onClick={this.play}>
				<h6>{this.props.songname}</h6>
				<span>{this.props.artistname}</span>
			</li>
		);
	}
};

export default Cell;