import React,{ Component } from 'react';
import Cell from '../Components/Cell';

class CellView extends Component{
	render(){
		if(!this.props.list){
			return null;
		}
		return (
			<tbody>
				{this.props.list.map((item,index)=>
					<Cell {...item} seq={index+1} info={item} key={index} playSpecialSong={this.props.playSpecialSong}
					addToPlayList={this.props.addToPlayList} addToLocalList={this.props.addToLocalList}/>
				)}
			</tbody>
		);
	}
}

export default CellView;