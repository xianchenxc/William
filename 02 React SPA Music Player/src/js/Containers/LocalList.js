import React,{ Component } from 'react';
import { bindActionCreators } from 'redux';
import * as ItemsActions from '../redux/Action';
import { connect } from 'react-redux';
import ListHeader from '../Components/ListHeader';
import ListContent from '../Components/ListContent';
import { StorageSetter } from '../util/tool.js';

import "../../css/playlist.scss";
import "../../css/icon.scss";

class LocalList extends Component{
	render(){
		let { name,bg,length,date,comment,song_list,actions } = this.props;
		let durationShow= true;
		return (
			<div>
				<ListHeader url={bg} listName={name} listcnt={length} 
					date={date} comment={comment}/>
				<ListContent listContent={song_list} durationShow={durationShow} playSpecialSong={actions.playSpecialSong}
				addToPlayList={actions.addToPlayList}/>
			</div>
		);
	}
}

const mapStateToProps = state =>{
	let {
		name,
		avator_url,
		length,
		date,
		comment,
		song_list
	} = state.localPlayList;
	let bg = avator_url===''?{}:{backgroundImage:`url("${avator_url}")`};
	return {
		name,
		bg,
		length,
		date,
		comment,
		song_list
	};
};

const mapDispatchToProps = (dispatch,ownProps) => {
	return {
		actions: bindActionCreators(ItemsActions,dispatch),
	};
}

export default connect(mapStateToProps,mapDispatchToProps)(LocalList);