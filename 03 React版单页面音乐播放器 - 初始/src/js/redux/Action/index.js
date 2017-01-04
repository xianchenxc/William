import { PLAYORPAUSE,MUSICCHANGE,TIMEUPDATE } from '../../Constants/ActionType.js';
import { REQUESTLYRIC,REQUESTSONG,RECEIVELYRIC } from '../../Constants/ActionType.js';
import { SEARCHINPUT,QUERYSONG } from '../../Constants/ActionType.js';
import fetchJSONP from 'fetch-jsonp';
import fetch from 'isomorphic-fetch';
import { CONFIG } from '../../Constants/Config.js';


function requestSongInfo(songid,lrclink){
	return {
		type : REQUESTSONG,
		song_id: songid,
		lrclink: lrclink
	}
}

function fetchSongInfo(json){
	return {
		type : MUSICCHANGE,
		musicChange : {
			song_id: json.songinfo['song_id'],
			title: json.songinfo['title'],
			author: json.songinfo['author'],
			file_duration: json.bitrate['file_duration'],
			pic_small: json.songinfo['pic_small'],
			pic_premium: json.songinfo['pic_premium'],
			song_url: json.bitrate['show_link'],
			lrclink: json.songinfo['lrclink'],
		}
	}
}

function receiveQuery(json){
	return {
		type: QUERYSONG,
		queryRes: json.song
	};
}

function isFetchSong(state){
	return false;
}

function fetchSong(songid,lrclink){
	return dispatch =>{
		dispatch(requestSongInfo(songid,lrclink));
		let url = `${CONFIG.base_url}?method=${CONFIG.song_method}&songid=${songid}`;
		return fetchJSONP(url,{
			timeout: 20000,
			jsonpCallback: "callback"
		})
		.then(response=> response.json())
		.then(json => 
			dispatch(fetchSongInfo(json))
		).catch(e => 
			console.log(e)
		)
	}
}

function fetchLyric(url,song_id){
	return dispatch =>{
		dispatch({
			type: REQUESTLYRIC,
			song_id: song_id
		});
		return fetch(url)
			.then(response=> response.text())
			.then(text=>{
				var line = text.split('\n');
				var timeReg = /\[(\d{2}):(\d{2}).(\d{2})\]/gi;
				var result = [];
				line.forEach(function(item,index){
					if(item.replace(/(^\s*)|(\s*$)/g,'')!=''){
						var test = timeReg.exec(item);
						if(test&&test.length>1){
							var time = parseInt(test[1])*60 + parseInt(test[2]);
							var lyricText = item.replace(timeReg,'');
							result.push([time,lyricText]);
						}
					}
				});
				return dispatch({
					type: RECEIVELYRIC,
					lyric: result
				});
			})
			.catch(e=>
				console.log(e)
			);
	};
}

function fetchQuerySong(keyWord){
	return dispatch => {
			let url = `${CONFIG.base_url}?method=${CONFIG.query_method}&query=${keyWord}`;
			console.log(url);
			return fetchJSONP(url,{
				timeout: 20000,
				jsonpCallback: "callback"
			}).then(response => response.json())
			.then(json => 
				dispatch(receiveQuery(json))
			)
			.catch(e =>
				console.log(e)
			);
		};
}

export function playOrPause(item){
	return {type: PLAYORPAUSE};
}

export function nextMusic(item){
	return (dispatch,getState)=>{
				let curState = getState().musicState;
				if( !isFetchSong(curState) ){
					let index = 0;
					let song_id = 0;
					let lrclink = '';
					let listLen = curState.playList.length;
					for(let i=0;i<listLen;i++){
						if(curState.playList[i].song_id == curState.curMusic.song_id){
							index = i + 1;
							break;
						}
					} 
					index = index%listLen;
					song_id = curState.playList[index].song_id;
					lrclink = curState.playList[index].lrclink;
					return dispatch(fetchSong(song_id,lrclink));
				}
			}
}

export function ontimeupdate(item){
	let { currentTime,duration } = item.target;
	currentTime = currentTime>=duration?duration:currentTime;
	return {
			type: TIMEUPDATE,
			currentTime
		};
}

export function getLyric(){	
	return (dispatch,getState)=>{
		let url = getState().musicState.lrclink;
		let song_id = getState().musicState.song_id;
		return dispatch(fetchLyric(url,song_id));
	};
}

export function searchSong(keyWord){
	console.log(keyWord);
	return (dispatch,getState) =>{
		dispatch(fetchQuerySong(keyWord));
	};
}

export function searchInput(item){
	return {
		type: SEARCHINPUT,
		keyWord: item.target.value,
	}
}

export function instPlay(songid){
	return (dispatch,getState)=>
		dispatch(fetchSong(songid));
}