import React,{ Component } from 'react';
import Cell from '../Components/Cell';

class SearchBar extends Component{
	render(){
		if(!this.props.items){
			return null;
		}
		return (
			<div>
				<ul className="cellView">
					{this.props.items.map((item,index)=>
						<Cell {...item} key={index} instPlay={this.props.instPlay}/>
					)}
				</ul>
			</div>
		);
	}
}

export default SearchBar;