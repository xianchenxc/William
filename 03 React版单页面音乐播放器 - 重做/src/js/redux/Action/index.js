import { PLAYERSTEATESHIFT,REQUESTSONG,RECEIVESONG } from '../../Constants/ActionType.js';
import { REQUESTCHANNELLIST,RECEIVECHANNELLIST,SHOWCHANNELLIST } from '../../Constants/ActionType.js';
import { UPDATEPLAYLIST } from '../../Constants/ActionType.js';
import fetchJSONP from 'fetch-jsonp';
import fetch from 'isomorphic-fetch';
import { CONFIG } from '../../Constants/Config.js';
import NProgress from 'nprogress';

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

function requestSongInfo(songid){
	return {
		type: REQUESTSONG,
		isFetching: true,
		fetchSongId: songid
	}
}

function receiveSongInfo(json){
	console.log(json);
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

