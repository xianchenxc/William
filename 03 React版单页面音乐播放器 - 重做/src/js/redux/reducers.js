import { PLAYERSTEATESHIFT,REQUESTSONG,RECEIVESONG } from '../Constants/ActionType.js';
import { REQUESTCHANNELLIST,RECEIVECHANNELLIST } from '../Constants/ActionType.js';
import { UPDATEPLAYLIST } from '../Constants/ActionType.js';
import objectAssign from 'object-assign';

const initMusicState={
	playFlag: false,          
	volume: 0,
	isFetching: false,
	currentTime: 0,      
	song_id: -1,
	title: "",
	author: "",
	file_duration: 0,
	pic_small: "",
	song_url: "",
	lrclink: "" ,
};
const initLocalPlayList = {
	length: 2,
	date: '2017-01-01',
	name: '我喜欢的音乐',
	comment: '',
	avator_url: '',
	song_list: [
		{
			title: "我要我们在一起",
			author: "范晓萱",
			album_title: "我要我们在一起",
			file_duration: 266
		},
		{
			title: "迷宫",
			author: "王若琳",
			album_title: "Start From Here",
			file_duration: 217
		}
	]
};
const initChannelPlayList = {
	isFetching: false,
}
const initCurPlayList = {
	length: 0,
	curIndex: 0,
	song_list: []
}

//播放器Reducer;musicState
export const musicState = (preState = initMusicState,action) => {
	switch(action.type){
		case PLAYERSTEATESHIFT:
			return objectAssign({},preState,{
				playFlag: action.playFlag
			});
		case REQUESTSONG:
			return objectAssign({},preState,{
				playFlag: false,
				isFetching: action.isFetching,
				song_id: action.fetchSongId
			});
		case RECEIVESONG:
			if(preState.song_id!==action.fetchSongId){
				return preState;
			}
			console.log(action);
			return objectAssign({},preState,{
				isFetching: action.isFetching,
				song_id: action.fetchSongId,
				currentTime: 0,
				title: action.item.songinfo.title,
				author: action.item.songinfo.author,
				file_duration: action.item.bitrate.file_duration,
				pic_small: action.item.songinfo.pic_small,
				song_url: action.item.bitrate.show_link,
				lrclink: action.item.songinfo.lrclink,				
			});
		default:
			return preState;
	}
};

//本地列表Reducer;localPlayList
export const localPlayList = (preState = initLocalPlayList,action) => {
	switch(action.type){
		
		default:
			return preState;
	}
};

//频道列表Reducer;channelPlayList
export const channelPlayList = (preState=initChannelPlayList,action) => {
	switch(action.type){
		case REQUESTCHANNELLIST:
			return objectAssign({},preState,{
				isFetching: true,
				fetchingChannel: action.channel_type
			});
		case RECEIVECHANNELLIST:
			let state = preState;
			state.isFetching = false;
			let post = action.items;
			let channel_type = post.channel_type;
			if(state[channel_type]){
				state[channel_type].song_list.push.apply(state[channel_type].song_list,post.list.song_list);
			}else{
				state[channel_type] = post.list;
			}
			state[channel_type].length = state[channel_type].song_list.length;
			return objectAssign({},preState,state);
		default:
			return preState;
	}
};

//播放列表Reducer;curPlayList
export const curPlayList = (preState = initLocalPlayList,action) => {
	switch(action.type){
		case UPDATEPLAYLIST:
			if(action.operation==='REPLACE'){
				return objectAssign({},preState,{
					length: action.items.length,
					curIndex: 0,
					song_list: action.items					
				});
			}else if(action.operation==='ADD'){
				return objectAssign({},preState,{
					length: preState.length+action.items.length,
					song_list: preState.song_list.push.apply(preState.song_list,action.items)					
				});
			}
		default:
			return preState;
	}
};