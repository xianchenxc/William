import React,{ Component } from 'react';
import ListCellView from '../Components/ListCellView';

class ListContent extends Component{
	render(){
		let duractionStyle = {};
		if(this.props.durationShow===false){
			duractionStyle = { display: 'none' };
		}
		return (
			<div className="list-content">
				<table>
					<thead>
						<tr>
							<th>序号</th>
							<th>操作</th>
							<th>音乐标题</th>
							<th>歌手</th>
							<th>专辑</th>
							<th style={duractionStyle}>时长</th>
						</tr>
					</thead>
					<ListCellView list={this.props.listContent} durationShow={this.props.durationShow}/>
				</table>
			</div>
		);
	}
}

export default ListContent;