import React,{ Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import * as ItemsActions from '../redux/Action';
import { bindActionCreators } from 'redux';
import MusicPanel from '../Components/MusicPanel';
import SideBar from '../Components/SideBar';
import PlayListPanel from '../Components/PlayListPanel';

import '../../css/icon.scss';
import '../../css/font.scss';
import '../../css/app.scss';
import '../../css/curplaylist.scss';

class App extends Component{
	constructor(props){
		super(props);
		this.keywordQuery=this.keywordQuery.bind(this);
	}
	keywordQuery(){
		this.props.actions.keywordQuery(this.refs.search.value);
	}
	render(){
		return (
			<div className="react-main">
				<div className="header">
					<div className="logo">Baidu 音乐API</div>
					<div className="searchArea">
						<input ref="search" type="text" placeholder="搜索音乐，歌手，歌词" className="searchInput"/>
						<Link to="search" className="searchBtn" onClick={this.keywordQuery}></Link>
					</div>
				</div>
				<SideBar />
				<div className="rootContainer">
 					{this.props.children}
 				</div>
 				<PlayListPanel />
 				<MusicPanel />
			</div>
		);
	}
}


const mapDispatchToProps = (dispatch,ownProps) => {
	return {
		actions: bindActionCreators(ItemsActions,dispatch),
	}
}

export default connect(undefined,mapDispatchToProps)(App);