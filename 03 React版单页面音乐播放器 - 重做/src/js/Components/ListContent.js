import React,{ Component } from 'react';
import CellView from '../Components/CellView';

class ListContent extends Component{
	render(){
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
							<th>时长</th>
						</tr>
					</thead>
					<CellView list={this.props.listContent} playSpecialSong={this.props.playSpecialSong} 
					addToPlayList={this.props.addToPlayList} addToLocalList={this.props.addToLocalList}/>
				</table>
			</div>
		);
	}
}

export default ListContent;