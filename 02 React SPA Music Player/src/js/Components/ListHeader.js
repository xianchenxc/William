import React,{ Component } from 'react';

class ListHeader extends Component{

	render(){
		return (
			<div className="list-header">
				<div className="list-avatar" style={this.props.url}>
				</div>
				<div className="list-info">
					<div className="list-title">
						<div>
							<span className="list-logo">歌单</span>
							<span className="list-name">{this.props.listName}</span>
						</div>
						<p>{this.props.date}创建</p>
					</div>
					<div className="list-btn">
						<div className="list-playAll">
							<span className="list-text" onClick={this.props.playAll}><i className="m-icon m-play"></i>播放全部</span>
							<span className="list-add">+</span>
						</div>
					</div>
					<div className="list-comment">
					    <span>简介：</span> {this.props.comment}
					</div>
				</div>
				<div className="list-count">
					{this.props.listcnt}
				</div>
			</div>
		);
	}
}

export default ListHeader;