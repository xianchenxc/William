import { PLAYERSTEATESHIFT,REQUESTSONG,RECEIVESONG,SONGTIMEUPDATE,VOLUMEUPDATE } from '../Constants/ActionType.js';
import { REQUESTCHANNELLIST,RECEIVECHANNELLIST } from '../Constants/ActionType.js';
import { UPDATEPLAYLIST,UPDATEPLAYLISTINDEX } from '../Constants/ActionType.js';
import { UPDATELOCALLIST } from '../Constants/ActionType.js';
import { KEYWORDCHANGE,REQUESTKEYWORDQUERY } from '../Constants/ActionType.js';
import objectAssign from 'object-assign';
import { StorageGetter } from '../util/tool.js';

const initMusicState=StorageGetter('musicState')||{
	playFlag: false,          
	volume: 0.3,
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
const initLocalPlayList = StorageGetter('localPlayList')||{
	length: 0,
	date: '2017-01-01',
	name: '我喜欢的音乐',
	comment: '',
	avator_url: '',
	song_list: []
};

const initCurPlayList = StorageGetter('curPlayList')||{
	length: 0,
	mode: 0,                //0-循环，1-随机，2-单曲(缺少字体)
	curIndex: 0,
	song_list: []
}
const initChannelPlayList = {
	isFetching: false,
}
const initKeywordSearchList = {
	keyword: '',
	isFetching: false,
	length: 0,
	result: []
}

//播放器Reducer;musicState
export const musicState = (preState = initMusicState,action) => {
	switch(action.type){
		case PLAYERSTEATESHIFT:
			return objectAssign({},preState,{
				playFlag: action.playFlag
			});
		case VOLUMEUPDATE:{
			return objectAssign({},preState,{
				volume: action.volume
			});
		}
		case SONGTIMEUPDATE:{
			return objectAssign({},preState,{
				currentTime: action.currentTime
			});
		}
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
		case UPDATELOCALLIST:

			return objectAssign({},preState,{
					length: ++preState.length,
					song_list: preState.song_list.concat([action.item])           
				});
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
export const curPlayList = (preState = initCurPlayList,action) => {
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
					//这里不能用preState.song_list.push.apply(,action.items).因为push操作，只修改原数组，返回length。
					//而我们这里需要返回一个新的数组，所以用 concat
					song_list: preState.song_list.concat(action.items)           
				});
			}
		case UPDATEPLAYLISTINDEX:
			return objectAssign({},preState,{
				curIndex: action.curIndex
			});
		default:
			return preState;
	}
};

export const KeywordSearchList = (preState=initKeywordSearchList,action) => {
	switch(action.type){
		case KEYWORDCHANGE:
			return objectAssign({},preState,{
				keyword: action.keyword
			});
		case REQUESTKEYWORDQUERY:
			return objectAssign({},preState,{
				isFetching: action.isFetching
			});
		default:
			return preState;
	}
};