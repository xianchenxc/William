import { PLAYERSTEATESHIFT,REQUESTSONG,RECEIVESONG,SONGTIMEUPDATE,VOLUMEUPDATE,CHANGEPLAYMODE } from '../Constants/ActionType.js';
import { REQUESTLYRIC,RECEIVELYRIC,FAILLYRIC } from '../Constants/ActionType.js';
import { REQUESTCHANNELLIST,RECEIVECHANNELLIST,FAILQUERYCHANNELLIST} from '../Constants/ActionType.js';
import { UPDATEPLAYLIST,UPDATEPLAYLISTINDEX,CLEARALLPLAYLIST,SHOWPLAYLIST } from '../Constants/ActionType.js';
import { UPDATELOCALLIST,DELETEFROMLOCALLIST } from '../Constants/ActionType.js';
import { KEYWORDCHANGE,REQUESTKEYWORDQUERY,RECEIVEKEYWORDQUERY,KEYWORDQUERYFAIL } from '../Constants/ActionType.js';
import objectAssign from 'object-assign';
import { StorageGetter,StorageSetter} from '../util/tool.js';

const initMusicState=StorageGetter('musicState')||{
	playFlag: false,          
	volume: 0.3,
	isFetching: false,
	currentTime: 0,      
	song_id: -1,
	title: "",
	author: "",
	album_title: "",
	file_duration: 0,
	pic_small: "",
	pic_big: "",
	song_url: "",
	isFetchingLyric: false,
	lrcContent: [['00:00','选择一首歌欣赏下']] ,
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
	isDisplay: false,
	length: 0,
	mode: 0,                //0-循环，1-随机，2-单曲(缺少字体)
	curIndex: -1,
	song_list: []
};

const initChannelPlayList = {
	isFetching: false,
	success: true,
}
const initKeywordSearchList = {
	keyword: '',
	isFetching: false,
	length: 0,
	success: true,
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
				album_title: action.item.songinfo.album_title,
				file_duration: action.item.bitrate.file_duration,
				pic_small: action.item.songinfo.pic_small,
				pic_big: action.item.songinfo.pic_big,
				song_url: action.item.bitrate.show_link,
				lrclink: action.item.songinfo.lrclink,				
			});
		case REQUESTLYRIC:
			return objectAssign({},preState,{
				isFetchingLyric: action.isFetchingLyric,
			});
		case RECEIVELYRIC:
			if(preState.song_id!==action.fetchSongId){
				return preState;
			}
			return objectAssign({},preState,{
				isFetchingLyric: action.isFetchingLyric,
				lrcContent: action.lrcContent
			});
		default:
			return preState;
	}
};

//本地列表Reducer;localPlayList
export const localPlayList = (preState = initLocalPlayList,action) => {
	switch(action.type){
		case UPDATELOCALLIST:
			var nextState = objectAssign({},preState,{
					length: preState.length + action.items.length,
					song_list: preState.song_list.concat(action.items)           
				});
			StorageSetter('localPlayList',nextState);
			return nextState;
		case DELETEFROMLOCALLIST:
			var preSongList = preState.song_list;
			preSongList.splice(action.index,1);
			var nextState = objectAssign({},preState,{
					length: preSongList.length,
					song_list: preSongList          
				});
			StorageSetter('localPlayList',nextState);
			return nextState;
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
		case FAILQUERYCHANNELLIST:
			if(preState.fetchingChannel === action.channel_type){
				return objectAssign({},preState,{
					isFetching: action.isFetching,
					success: action.success
				});
			}else{
				return preState;
			}
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
		case CHANGEPLAYMODE:
			return objectAssign({},preState,{
				mode: (preState.mode+1)%2
			});
		case CLEARALLPLAYLIST:
			return objectAssign({},preState,{
					length: 0,
					curIndex: -1,
					song_list: []
				});
		case SHOWPLAYLIST:{
			return objectAssign({},preState,{
					isDisplay: !preState.isDisplay
				});
		}
		default:
			return preState;
	}
};

export const keywordSearchList = (preState=initKeywordSearchList,action) => {
	switch(action.type){
		case KEYWORDCHANGE:                           //暂时没有使用，后续看是否需要提醒
			return objectAssign({},preState,{
				keyword: action.keyword
			});
		case REQUESTKEYWORDQUERY:
			return objectAssign({},preState,{
				isFetching: action.isFetching,
				keyword: action.keyword
			});
		case RECEIVEKEYWORDQUERY:
			if(preState.keyword === action.keyword){
				return objectAssign({},preState,{
					length: action.length,
					isFetching: action.isFetching,
					displaykeyword: action.keyword,
					result: action.result,
					success: true
				});
			}else{
				return preState;
			}
		case KEYWORDQUERYFAIL:
			if(preState.keyword === action.keyword){
				return objectAssign({},preState,{
					isFetching: action.isFetching,
					success: action.success
				})
			}
		default:
			return preState;
	}
};