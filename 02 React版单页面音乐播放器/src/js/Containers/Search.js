import React,{ Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as ItemsActions from '../redux/Action';
import SearchBar from '../Components/SearchBar';
import Content from '../Components/Content';

import '../../css/search.scss';

class Search extends Component{
	constructor(props){
		super(props);
	}
	render(){
		const actions = this.props.actions;
		return (
			<div className="searchPanel">
				<SearchBar searchInput={actions.searchInput} searchSong={actions.searchSong}/>
				<Content items={this.props.queryRes} instPlay={actions.instPlay}/>
			</div>
		);
	}
}

export default connect(state => ({ 
	queryRes: state.queryState.queryRes
}),dispatch => ({
	actions: bindActionCreators(ItemsActions,dispatch)
}))(Search);