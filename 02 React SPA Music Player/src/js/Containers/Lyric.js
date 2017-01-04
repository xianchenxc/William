import React,{ Component } from 'react';
import { bindActionCreators } from 'redux';
import * as ItemsActions from '../redux/Action';
import { connect } from 'react-redux';
import LyricInfo from '../Components/LyricInfo';
import LyricContent from '../Components/LyricContent';

import "../../css/lyric.scss";

class Lyric extends Component{
	componentDidMount(){
		this.props.actions.fetchLyric(this.props.musicState.song_id);
	}
	componentWillUpdate(nextProps){
		if(nextProps.musicState.song_id!==this.props.musicState.song_id){
			nextProps.actions.fetchLyric(nextProps.musicState.song_id);
		}
	}
	render(){
		let musicState = this.props.musicState;
		let bg = {};
		if(musicState.pic_big!==''){
			bg = {
				backgroundImage: 'url("'+musicState.pic_big+'")'
			};
		}
		return (
			<div className="lyric">
				<div className="lyric-operation">
					<div className="lyric-outer">
						<div className="lyric-inner">
							<div className="lyric-img" style={bg}></div>
						</div>
					</div>
				</div>
				<div className="lyric-container">
					<LyricInfo {...musicState}/>
					<LyricContent {...musicState}/>
				</div>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	let {
		musicState,
	} = state;
	return {
		musicState,
	};
};

const mapDispatchToProps = (dispatch,ownProps) => {
	return {
		actions: bindActionCreators(ItemsActions,dispatch)
	};
};

export default connect(mapStateToProps,mapDispatchToProps)(Lyric);