import React,{ Component } from 'react';

class LyricContent extends Component{
	
	render(){
		let lines = this.props.lrcContent.map((item,index) =>
			<li key={index}>{item[1]}</li>
		);
		return (
			<div className="lyric-content">
				<ul>
					{lines}
				</ul>
			</div>
		);
	}
}

export default LyricContent;