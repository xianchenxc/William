import React,{ Component } from 'react';
import { Link } from 'react-router';

class SideBar extends Component{
	render(){
		return (
			<dl className="sidebar">
				<dt>频道</dt>
				<dd><Link to="channel/1" activeStyle={{color:"#000"}}>新歌榜</Link></dd>
				<dd><Link to="channel/2" activeStyle={{color:"#000"}}>热歌榜</Link></dd>
				<dd><Link to="channel/11" activeStyle={{color:"#000"}}>摇滚榜</Link></dd>
				<dd><Link to="channel/12" activeStyle={{color:"#000"}}>爵士</Link></dd>
				<dd><Link to="channel/16" activeStyle={{color:"#000"}}>流行</Link></dd>
				<dd><Link to="channel/21" activeStyle={{color:"#000"}}>欧美金曲榜</Link></dd>
				<dd><Link to="channel/22" activeStyle={{color:"#000"}}>经典老歌榜</Link></dd>
				<dd><Link to="channel/23" activeStyle={{color:"#000"}}>情歌对唱榜</Link></dd>
				<dd><Link to="channel/24" activeStyle={{color:"#000"}}>影视金曲榜</Link></dd>
				<dt>创建的歌单</dt>
				<dd><span className="m-icon m-heart"></span><Link to="locallist" activeStyle={{color:"#000"}}>我喜欢的音乐</Link></dd>
			</dl>

		);
	}
}

export default SideBar;
