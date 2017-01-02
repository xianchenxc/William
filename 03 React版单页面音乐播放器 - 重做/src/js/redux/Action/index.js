import { PLAYERSTEATESHIFT,REQUESTSONG,RECEIVESONG,SONGTIMEUPDATE,VOLUMEUPDATE } from '../../Constants/ActionType.js';
import { REQUESTCHANNELLIST,RECEIVECHANNELLIST,SHOWCHANNELLIST } from '../../Constants/ActionType.js';
import { UPDATEPLAYLIST,UPDATEPLAYLISTINDEX } from '../../Constants/ActionType.js';
import { UPDATELOCALLIST } from '../../Constants/ActionType.js';
import { KEYWORDCHANGE,REQUESTKEYWORDQUERY } from '../../Constants/ActionType.js';
import fetchJSONP from 'fetch-jsonp';
import fetch from 'isomorphic-fetch';
import { CONFIG } from '../../Constants/Config.js';
import NProgress from 'nprogress';
import { offsetLeft,StorageSetter } from '../../util/tool.js';

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
	return {
		type: UPDATELOCALLIST,
		item: song_info
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
		NProgress.start();
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
			timeout: 20000,
			jsonpCallback: "callback"
		})
		.then(response=> response.json())
		.then(json => 
			dispatch(receiveChannelList(type,json))
		).catch(e => 
			console.log(e)
		)
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
		let song_list = [];
		song_list.push(song_info);
		dispatch(updatePlayList(song_list,'ADD'));
		return dispatch(fetchSong(song_id));
	};
}

export function addToPlayList(song_info){
	return (dispatch,getState) => {
		let song_list = [];
		song_list.push(song_info);
		return dispatch(updatePlayList(song_list,'ADD'));
	};	
}

export function addToLocalList(song_info){
	return (dispatch,getState) => {
		return dispatch(updateLocalList(song_info));
	};	
}

export function nextSong(){                           //播放下一首
	return (dispatch,getState) => {
		let curState = getState().curPlayList;
		let nextIndex = (curState.curIndex+1)%(curState.length);
		let nextSong = curState.song_list[nextIndex];
		dispatch(updateCurPlayIndex(nextIndex));
		return dispatch(fetchSong(nextSong.song_id));
	};	
}

export function preSong(){                           //播放下一首
	return (dispatch,getState) => {
		let curState = getState().curPlayList;
		let nextIndex = (curState.curIndex-1)
		nextIndex = nextIndex<0 ? (nextIndex+curState.length):nextIndex;
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

export function keywordChange(e){
	let value = e.target.value;
	return {
		type: KEYWORDCHANGE,
		keyword: value
	};
}

export function keywordQuery(keyword){
	return (dispatch,getState) => {
		dispatch({
			type: REQUESTKEYWORDQUERY,
			isFetching: true
		})
	};
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
