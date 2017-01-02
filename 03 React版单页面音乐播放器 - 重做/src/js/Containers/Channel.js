import React,{ Component } from 'react';
import { bindActionCreators } from 'redux';
import * as ItemsActions from '../redux/Action';
import { connect } from 'react-redux';
import NProgress from 'nprogress';
import ListHeader from '../Components/ListHeader';
import ListContent from '../Components/ListContent';

import "../../css/nprogress.scss";

class Channel extends Component{
	constructor(props){
		super(props);
		this.playAll = this.playAll.bind(this);
	}

	componentDidMount(){
		this.props.actions.fetchChannelList(this.props.params.id,false);
	}

	componentWillReceiveProps(nextprops){
		if(nextprops.params.id!=this.props.params.id){
			this.props.actions.fetchChannelList(nextprops.params.id,false);
		}
		if(this.props.isFetching === false){
			NProgress.done();
		}		
	}

	playAll(){
		this.props.actions.playAll(this.props[this.props.params.id].song_list);
	}

	render(){
		if(this.props[this.props.params.id]===undefined){
			return null;
		}
		let actions = this.props.actions;
		let bg = {};
		if(this.props[this.props.params.id].avator_url!==''){
			bg ={
				backgroundImage:'url('+this.props[this.props.params.id].avator_url+')'
			}
		}
		return (
			<div>
				<ListHeader url={bg} listName={this.props[this.props.params.id].name} listcnt={this.props[this.props.params.id].length} 
					date={this.props[this.props.params.id].date} comment={this.props[this.props.params.id].comment}
					playAll={this.playAll}/>
				<ListContent listContent={this.props[this.props.params.id].song_list} playSpecialSong={actions.playSpecialSong}
				addToPlayList={actions.addToPlayList} addToLocalList={actions.addToLocalList}/>
			</div>
		);
	}
}

const mapStateToProps= (state) => {
	let {
		channelPlayList
	} = state;
	return {
		isFetching: channelPlayList.isFetching,
		1: channelPlayList[1],
		2: channelPlayList[2],
		11: channelPlayList[11],
		12: channelPlayList[12],
		16: channelPlayList[16],
		21: channelPlayList[21],
		22: channelPlayList[22],
		23: channelPlayList[23],
		24: channelPlayList[24],
	};
}
const mapDispatchToProps = (dispatch,ownProps) => {
	return {
		actions: bindActionCreators(ItemsActions,dispatch)
	};
}

export default connect(mapStateToProps,mapDispatchToProps)(Channel);