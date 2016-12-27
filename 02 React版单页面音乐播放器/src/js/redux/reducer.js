import { PLAYORPAUSE,MUSICCHANGE } from './Action/ActionType.js';

let initialState = {
	isPlay: false,           //标识播放器是暂停还是播放
	curMusic: {              //正在播放音乐的信息
			song_id: 265035807,
			title: '下雨了',
			author: '薛之谦',
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
				pic_small: 'http://musicdata.baidu.com/data2/pic/265035417/265035417.jpg@s_0,w_90'
			},
			{
				song_id: 541244,
				title: 'Heart And Soul',
				author: 'Kenny G',
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
				console.log('暂停');
				return Object.assign({},preState,{
					isPlay : true
				});
			}
		case MUSICCHANGE:
			return Object.assign({},preState,{
				isPlay: true,                         //切换默认播放
				curMusic: action.musicChange
			});
		default:
			return preState;
	}
};
