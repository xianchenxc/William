import React,{ Component } from 'react';
import { bindActionCreators } from 'redux';
import * as ItemsActions from '../redux/Action';
import { connect } from 'react-redux';
import ListHeader from '../Components/ListHeader';
import ListContent from '../Components/ListContent';

import "../../css/playlist.scss";
import "../../css/icon.scss";

class LocalList extends Component{
	render(){
		let actions = this.props.actions;
		let bg = {};
		if(this.props.avator_url!==''){
			bg ={
				backgroundImage:'url('+this.props.avator_url+')'
			}
		}
		return (
			<div>
				<ListHeader url={bg} listName={this.props.name} listcnt={this.props.length} 
					date={this.props.date} comment={this.props.comment}/>
				<ListContent listContent={this.props.song_list} />
			</div>
		);
	}
}

const mapStateToProps = state =>{
	let {
		localPlayList
	} = state;
	console.log(localPlayList);
	return localPlayList;
};

const mapDispatchToProps = (dispatch,ownProps) => {
	return {
		actions: bindActionCreators(ItemsActions,dispatch),
	};
}

export default connect(mapStateToProps,mapDispatchToProps)(LocalList);