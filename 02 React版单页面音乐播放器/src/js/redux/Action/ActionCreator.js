import { PLAYORPAUSE,MUSICCHANGE } from '../Action/ActionType.js';
import { REQUESTSONG } from '../Action/ActionType.js';
import fetchJSONP from 'fetch-jsonp';
import { CONFIG } from '../../Constants/Config.js';

function requestSongInfo(song_id){
	return {
		type : REQUESTSONG,
		song_id : song_id
	}
}

function fetchSongInfo(json){
	return {
		type : MUSICCHANGE,
		musicChange : {
			song_id: json.songinfo['song_id'],
			title: json.songinfo['title'],
			author: json.songinfo['author'],
			pic_small: json.songinfo['pic_small'],
			pic_premium: json.songinfo['pic_premium'],
			song_url: json.bitrate['show_link'],
			lrclink: json.songinfo['lrclink'],
		}
	}
}

function isFetchSong(state){
	return false;
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
			dispatch(fetchSongInfo(json))
		).catch(e => 
			console.log(e)
		)
	}
}

export function MusicOperation(type) {
	// body...
	switch(type){
		case PLAYORPAUSE:
			return {type: PLAYORPAUSE};
		case MUSICCHANGE:
			return (dispatch,getState)=>{
				let curState = getState().musicState;
				if( !isFetchSong(curState) ){
					let index = 0;
					let song_id = 0;
					let listLen = curState.playList.length;
					for(let i=0;i<listLen;i++){
						if(curState.playList[i].song_id == curState.curMusic.song_id){
							index = i + 1;
							break;
						}
					} 
					index = index%listLen;
					song_id = curState.playList[index].song_id;
					return dispatch(fetchSong(song_id));
				}
			}
	
	}
}