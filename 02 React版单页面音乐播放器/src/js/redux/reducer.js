import { PLAYORPAUSE,MUSICCHANGE,TIMEUPDATE,REQUESTLYRIC,REQUESTSONG,RECEIVELYRIC } from '../Constants/ActionType.js';

let initialState = {
	isPlay: false,           //标识播放器是暂停还是播放
	currentTime: 0,
	song_id: 265035807,
	lrclink: 'http://musicdata.baidu.com/data2/lrc/3f7f26454ca8481b085d31eb81f591c5/265206193/265206193.lrc',
	curMusic: {              //正在播放音乐的信息
			song_id: 265035807,
			title: '下雨了',
			author: '薛之谦',
			file_duration: 305,
			pic_small: 'http://musicdata.baidu.com/data2/pic/265035417/265035417.jpg@s_0,w_90',
			pic_premium: 'http://musicdata.baidu.com/data2/pic/265035417/265035417.jpg@s_0,w_500',
			song_url: 'http://zhangmenshiting.baidu.com/data2/music/3581301d1a5ee9d0e304347f20ac8853/265037388/265037388.mp3?xcode=221914f073a260529614b4474386abae',
			lrclink: 'http://musicdata.baidu.com/data2/lrc/3f7f26454ca8481b085d31eb81f591c5/265206193/265206193.lrc',
		},
	playList: [              //播放列表
			{
				song_id: 265035807,
				title: '下雨了',
				author: '薛之谦',
				file_duration: 305,
				lrclink:'http://musicdata.baidu.com/data2/lrc/3f7f26454ca8481b085d31eb81f591c5/265206193/265206193.lrc',
				pic_small: 'http://musicdata.baidu.com/data2/pic/265035417/265035417.jpg@s_0,w_90'
			},
			{
				song_id: 541244,
				title: 'Heart And Soul',
				author: 'Kenny G',
				file_duration: 275,
				lrclink:'http://musicdata.baidu.com/data2/lrc/90520824de6603bc7ba49aa698f7af0f/268143367/268143367.lrc',
				pic_small: 'http://musicdata.baidu.com/data2/pic/36947212/36947212.jpg@s_0,w_90'
			}
		]
};

export const musicState = (preState = initialState,action) => {
	switch(action.type){
		case PLAYORPAUSE:
			if(preState.isPlay){
				return Object.assign({},preState,{
					isPlay : false
				});
			}else{
				return Object.assign({},preState,{
					isPlay : true
				});
			}
		case MUSICCHANGE:
			return Object.assign({},preState,{
				isPlay: true,                         //切换默认播放
				currentTime: 0,
				curMusic: action.musicChange
			});
		case TIMEUPDATE:
			return Object.assign({},preState,{
				currentTime: action.currentTime,
			});
		case REQUESTSONG:
			return Object.assign({},preState,{
				isPlay: false,
				song_id: action.song_id,
				lrclink: action.lrclink,
			});
		default:
			return preState;
	}
};

export const lyricState = (preState=initialState,action)=>{
	switch (action.type){
		case RECEIVELYRIC:
			console.log('查到歌词啦！');
			return Object.assign({},preState,{
				lyric: action.lyric
			});
		case REQUESTLYRIC:
			return Object.assign({},preState,{
				lyricsong_id: action.song_id
			});			
		default: 
			return preState;
	}
};