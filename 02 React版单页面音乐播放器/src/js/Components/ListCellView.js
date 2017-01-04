import React,{ Component } from 'react';
import ListCell from '../Components/ListCell';

class CellView extends Component{
	render(){
		if(!this.props.list){
			return null;
		}
		return (
			<tbody>
				{this.props.list.map((item,index)=>
					<ListCell {...item} seq={index+1} info={item} key={index} durationShow={this.props.durationShow} />
				)}
			</tbody>
		);
	}
}

export default CellView;