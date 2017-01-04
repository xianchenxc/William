import { PLAYERSTEATESHIFT,REQUESTSONG,RECEIVESONG,SONGTIMEUPDATE,VOLUMEUPDATE,CHANGEPLAYMODE } from '../../Constants/ActionType.js';
import { REQUESTLYRIC,RECEIVELYRIC,FAILLYRIC } from '../../Constants/ActionType.js';
import { REQUESTCHANNELLIST,RECEIVECHANNELLIST,SHOWCHANNELLIST,FAILQUERYCHANNELLIST } from '../../Constants/ActionType.js';
import { UPDATEPLAYLIST,UPDATEPLAYLISTINDEX,CLEARALLPLAYLIST,SHOWPLAYLIST } from '../../Constants/ActionType.js';
import { UPDATELOCALLIST,DELETEFROMLOCALLIST } from '../../Constants/ActionType.js';
import { KEYWORDCHANGE,REQUESTKEYWORDQUERY,RECEIVEKEYWORDQUERY,KEYWORDQUERYFAIL } from '../../Constants/ActionType.js';
import fetchJSONP from 'fetch-jsonp';
import fetch from 'isomorphic-fetch';
import { CONFIG } from '../../Constants/Config.js';
import { offsetLeft,trim,formatLrc,filter,getIndex } from '../../util/tool.js';

function requestChannelList(channel_type){
	return {
		isFetching: true,
		type: REQUESTCHANNELLIST,
		channel_type: channel_type
	};
}

function receiveChannelList(channel_type,json){
	var post = {
		type: RECEIVECHANNELLIST,
		channel_type: channel_type,
		list: {
			length: json.billboard.billboard_songnum,
			date: json.billboard.update_date,
			name: json.billboard.name,
			comment: json.billboard.comment,
			avator_url: json.billboard.pic_s210,
			song_list: json.song_list
		}
	}
	return {
		isFetching: false,
		type: RECEIVECHANNELLIST,
		items: post
	};
}

function updatePlayList(song_list,oper){
	return {
		type: UPDATEPLAYLIST,
		operation: oper,
		items: song_list
	}
}

function updateCurPlayIndex(index){
	return {
		type: UPDATEPLAYLISTINDEX,
		curIndex: index
	}
}

function updateLocalList(song_info){
	let items = (song_info instanceof Array)? song_info: [song_info];
	return {
		type: UPDATELOCALLIST,
		items: items
	}
}

function deletefromLocalList(song_info,index){
	return {
		type: DELETEFROMLOCALLIST,
		index: index 
	}
}

function requestSongInfo(songid){
	return {
		type: REQUESTSONG,
		isFetching: true,
		fetchSongId: songid
	}
}

function receiveSongInfo(json){
	return {
		type: RECEIVESONG,
		isFetching: false,
		fetchSongId: json.songinfo.song_id,
		item: json
	}	
}

function fetchSong(songid){
	return dispatch =>{
		dispatch(requestSongInfo(songid));
		let url = `${CONFIG.base_url}?method=${CONFIG.song_method}&songid=${songid}`;
		return fetchJSONP(url,{
			timeout: 20000,
			jsonpCallback: "callback"
		})
		.then(response=> response.json())
		.then(json => 
			dispatch(receiveSongInfo(json))
		).catch(e => 
			console.log(e)
		)
	}
}

function requestLyric(songid){
	return {
		type: REQUESTLYRIC,
		isFetchingLyric: true,
		fetchSongId: songid
	}	
}

function receiveLyric(songid,json){
	return {
		type: RECEIVELYRIC,
		isFetchingLyric: false,
		fetchSongId: songid,
		lrcContent: formatLrc(json.lrcContent)
	}	
}

function receiveKeywordQuery(keyword,json){
	let result = json.song_list;
	return {
		type: RECEIVEKEYWORDQUERY,
		length: json.pages.rn_num,
		keyword: keyword,
		result: result
	};
}

export function playStateShift(audio) {
	return (dispatch,getState)=> {
		let curState = getState().musicState;
		if(curState.song_id===-1){
			dispatch({ type:PLAYERSTEATESHIFT,playFlag:curState.playFlag});
		}else{                 
			curState.playFlag ? audio.pause() : audio.play();
			dispatch({ type:PLAYERSTEATESHIFT,playFlag:!curState.playFlag});
		}
	}
}

export function fetchChannelList(type,flag){
	return (dispatch,getState) =>{
		let offset = 0;
		if(getState().channelPlayList[type]&&flag){
			offset = getState().channelPlayList.type.length;
		}
		if(getState().channelPlayList[type]&&!flag){
			return dispatch({type: SHOWCHANNELLIST});
		}
		dispatch(requestChannelList(type));
		let url = `${CONFIG.base_url}?method=${CONFIG.channel_method}&type=${type}&offset=${offset}`;
		return fetchJSONP(url,{
			timeout: 30000,
			jsonpCallback: "callback"
		})
		.then(response=> response.json())
		.then(json => 
			dispatch(receiveChannelList(type,json))
		).catch(e => {
			console.log(e);
			return dispatch({
				type: FAILQUERYCHANNELLIST,
				channel_type: type,
				isFetching: false,
				success: false
			})
		})
	};
}

export function playAll(song_list){
	return (dispatch,getState) => {
		dispatch(updatePlayList(song_list,'REPLACE'));
		let curSong = song_list[0];
		return dispatch(fetchSong(curSong.song_id));
	};
}

export function playSpecialSong(song_id,song_info){
	return (dispatch,getState) => {
		let songLists = getState().curPlayList.song_list;
		let songs = filter('song_id',song_info,songLists);
		if(songs.length){
			dispatch(updatePlayList(songs,'ADD'));
		}
		return dispatch(fetchSong(song_id));
	};
}

export function addToPlayList(song_info,e){
	return (dispatch,getState) => {
		let songLists = getState().curPlayList.song_list;
		let songs = filter('song_id',song_info,songLists);
		if(songs.length===0){
			return null;
		}
		return dispatch(updatePlayList(songs,'ADD'));
	};	
}

export function addToLocalList(song_info,index){
	return (dispatch,getState) => {
		if(index!=-1){                    //存在，则删除
			return dispatch(deletefromLocalList(song_info,index));
		}
		return dispatch(updateLocalList(song_info));
	};	
}

export function nextSong(){                           //播放下一首
	return (dispatch,getState) => {
		let curState = getState().curPlayList;
		if(curState.length===0){
			return null;
		}
		let nextIndex = curState.curIndex;
		if(curState.mode===0){
			nextIndex = (curState.curIndex+1)%(curState.length);
		}else if (curState.mode===1){
			while(nextIndex===curState.curIndex&&curState.length>1){
				nextIndex = Math.floor(curState.length*Math.random());
			}
		}
		let nextSong = curState.song_list[nextIndex];
		dispatch(updateCurPlayIndex(nextIndex));
		return dispatch(fetchSong(nextSong.song_id));
	};	
}

export function preSong(){                           //播放下一首
	return (dispatch,getState) => {
		let curState = getState().curPlayList;
		if(curState.length===0){
			return null;
		}
		let nextIndex = curState.curIndex;
		if(curState.mode===0){
			nextIndex = nextIndex-1 <0 ? (nextIndex-1+curState.length): nextIndex-1;
		}else if(curState.mode===1){
			while(nextIndex===curState.curIndex&&curState.length>1){
				nextIndex = Math.floor(curState.length*Math.random());
			}
		}
		let nextSong = curState.song_list[nextIndex];
		dispatch(updateCurPlayIndex(nextIndex));
		return dispatch(fetchSong(nextSong.song_id));
	};	
}

export function songTimeUpdate(e){
	let { currentTime,duration } = e.target;
	currentTime = currentTime>=duration?duration:currentTime;
	return {
			type: SONGTIMEUPDATE,
			currentTime: parseInt(currentTime)
		};	
}

export function changeVol(e,audio){
	let offset = e.pageX-offsetLeft(e.currentTarget);
	// 这里之前是想做一个pannel层，设置z-index：9999。这样每次点击的target就是pannel层。
	// 但是 在chrome中测试，未通过，每次target还是最子层的，导致每次target.clientWidth不一样
	let volume = offset/e.currentTarget.clientWidth;     
	audio.volume = volume;
	return {
		type: VOLUMEUPDATE,
		volume: volume
	}
}

export function changeProgress(e,audio){
	let offset = e.pageX-offsetLeft(e.currentTarget);
	let referTime = 0;
	if(audio.duration){
		referTime = parseInt(offset/e.currentTarget.clientWidth*audio.duration);
		audio.currentTime = referTime;
	}
	return {
		type: SONGTIMEUPDATE,
		currentTime: referTime
	};
}

// export function keywordChange(e){
// 	let value = e.target.value;
// 	return {
// 		type: KEYWORDCHANGE,
// 		keyword: value
// 	};
// }

export function keywordQuery(keyword){
	return (dispatch,getState) => {
		keyword = trim(keyword);
		if(trim(keyword)===''){
			return null;
		}
		let curState = getState().keywordSearchList;
		if(curState.keyword===keyword&&(curState.success||curState.isFetching)){
			return null;
		}
		dispatch({
			type: REQUESTKEYWORDQUERY,
			isFetching: true,
			keyword: keyword,
		});
		let url = `${CONFIG.base_url}?method=${CONFIG.query_method}&query=${keyword}&page_no=&page_size=200`;
		return fetchJSONP(url,{
			timeout: 30000,
			jsonpCallback: "callback"
		})
		.then(response=> response.json())
		.then(json => 
			dispatch(receiveKeywordQuery(keyword,json))
		).catch(e => {
			console.log(e);
			return dispatch({
				type: KEYWORDQUERYFAIL,
				isFetching: false,
				success: false,
				keyword: keyword
			});
		});
	};
}

export function fetchLyric(songid){
	return (dispatch,getState) => {
		if(songid===-1){
			return null;
		}
		dispatch(requestLyric(songid));
		let url = `${CONFIG.base_url}?method=${CONFIG.lyric_method}&songid=${songid}`;
		return fetchJSONP(url,{
			timeout: 30000,
			jsonpCallback: "callback"
		})
		.then( response => response.json())
		.then( json =>
			dispatch(receiveLyric(songid,json))
		).catch(e => {
			console.log(e);
		});
	}
}

export function changeMode(){
	return {
		type: CHANGEPLAYMODE
	}
}

export function playListSong(songid,nextIndex){
	return (dispatch,getState) => {
		dispatch(updateCurPlayIndex(nextIndex));
		return dispatch(fetchSong(songid));
	};	
}

export function clearAllPlayList(){
	return {
		type: CLEARALLPLAYLIST
	}
}
export function loveAllPlayList(){
	return (dispatch,getState) => {
		let addSongs = getState().curPlayList.song_list;
		let songLists = getState().localPlayList.song_list;
		let songs = filter('song_id',addSongs,songLists);
		if(songs.length===0){
			return null;
		}
		return dispatch(updateLocalList(songs));
	};	
}

export function showPlayList(){
	return {
		type: SHOWPLAYLIST
	}
}

// export function recordLocalList(){
// 	return (dispatch,getState) => {
// 		StorageSetter('localPlayList',getState().localPlayList);
// 		StorageSetter('musicState',getState().musicState);
// 		StorageSetter('curPlayList',getState().curPlayList);
// 		StorageSetter('date',new Date());
// 		return dispatch({
// 			type: UNMOUNTSAVE
// 		});
// 	}
// }
// 
