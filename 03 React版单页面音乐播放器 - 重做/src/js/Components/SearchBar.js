import React,{ Component } from 'react';

class SearchBar extends Component{
	constructor(props){
		super(props);
		this.search = this.search.bind(this);
	}
	search(){
		var val = this.refs.keyInput.value;
		this.props.searchSong(val);
	}
	render(){
		return (
			<div className="searchBar">
				<input className='font-hei' ref="keyInput" type="text" placeholder="输入关键字" onChange={this.props.searchInput}/>
				<button className='font-hei' type="button" onClick={this.search}>搜索</button>
			</div>
		);	
	}
}

export default SearchBar;