import React,{ Component } from 'react';
import { bindActionCreators } from 'redux';
import * as ItemsActions from '../redux/Action';
import { connect } from 'react-redux';
import ListHeader from '../Components/ListHeader';
import ListContent from '../Components/ListContent';

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
	}

	playAll(){
		this.props.actions.playAll(this.props.song_list);
	}

	render(){
		let { isFetching,success,bg,name,length,date,comment,song_list,actions } = this.props;
		let info = isFetching||!name?'Loading...':!success?'查询超时，请重试':false;
		if(info){
			return (
				<div>
					<div>{info}</div>
				</div>
			);
		}
		return (
			<div>
				<ListHeader url={bg} listName={name} listcnt={length} date={date} comment={comment}
					playAll={this.playAll}/>
				<ListContent listContent={song_list} playSpecialSong={actions.playSpecialSong}
				addToPlayList={actions.addToPlayList} addToLocalList={actions.addToLocalList}/>
			</div>
		);
	}
}

const mapStateToProps= (state,ownProps) => {
	let {
		isFetching,
		success
	} = state.channelPlayList;
	let items = state.channelPlayList[ownProps.params.id];
	let bg = items&&items.avator_url!==''?{backgroundImage:`url("${items.avator_url}")`}:{};
	return {
		isFetching,
		success,
		bg, 
		name: items&&items.name,
		length: items&&items.length,
		date: items&&items.date,
		comment: items&&items.comment,
		song_list: items&&items.song_list,
	};
}
const mapDispatchToProps = (dispatch,ownProps) => {
	return {
		actions: bindActionCreators(ItemsActions,dispatch)
	};
}

export default connect(mapStateToProps,mapDispatchToProps)(Channel);