import React,{ Component } from 'react';
import { bindActionCreators } from 'redux';
import * as ItemsActions from '../redux/Action';
import { connect } from 'react-redux';
import ListContent from '../Components/ListContent';


class Search extends Component{
	componentDidMount(){
		this.props.actions.keywordQuery(this.props.keyword);
	}
	render(){
		let actions = this.props.actions;
		return (
			<div>
				<div className="search-header">
					搜索&quot;<span style={{color:"#0C73C2"}}>{this.props.keyword}</span>&quot;,找到{this.props.length}首单曲
				</div>
				<ListContent listContent={this.props.list} playSpecialSong={actions.playSpecialSong}
				addToPlayList={actions.addToPlayList} addToLocalList={actions.addToLocalList}/>
			</div>
		);
	}
}

const mapStateToProps = state => {
	let {
		searchList
	} = state;
	return {
		length: searchList.length,
		keyword: searchList.keyword,
		list: searchList.result
	};
};

const mapDispatchToProps = (dispatch,ownProps) => {
	return bindActionCreators(ItemsActions,dispatch);
};

export default connect(mapStateToProps,mapDispatchToProps)(Search);