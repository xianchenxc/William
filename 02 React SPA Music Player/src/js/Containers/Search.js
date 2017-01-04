import React,{ Component } from 'react';
import { bindActionCreators } from 'redux';
import * as ItemsActions from '../redux/Action';
import { connect } from 'react-redux';
import ListContent from '../Components/ListContent';

import "../../css/search.scss";

class Search extends Component{
	render(){
		let { displaykeyword,length,info,list,actions } = this.props;
		let durationShow = false;
		return (
			<div>
				<div className="search-header">
					搜索 <span>&quot;{displaykeyword}&quot;</span>，找到 {length} 首单曲
					<div className="info">{info}</div>
				</div>
				<ListContent listContent={list} playSpecialSong={actions.playSpecialSong}
				addToPlayList={actions.addToPlayList} addToLocalList={actions.addToLocalList} durationShow={durationShow}/>
			</div>
		);
	}
}

const mapStateToProps = state => {
	let {
		success,
		isFetching,
		length,
		displaykeyword,
		keyword,
		result,
	} = state.keywordSearchList;
	let info = `${isFetching?'Loading...':success?'':'搜索 '+keyword+' 超时'}`
	return {
		displaykeyword,
		length,
		info,
		list: result
	};
};

const mapDispatchToProps = (dispatch,ownProps) => {
	return {
		actions: bindActionCreators(ItemsActions,dispatch)
	}
};

export default connect(mapStateToProps,mapDispatchToProps)(Search);