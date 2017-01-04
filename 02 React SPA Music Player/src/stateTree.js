//播放器状态
musicState = {
	play: true,           //播放器是处于播放还是暂停状态
	volume:,
	currentTime: 0,       //当前播放器播放的时长
	song_id: ,
	title: ,
	author: ,
	file_duration: ,
	pic_small: ,
	song_url: ,
	lrclink: ,
}

//播放列表
playList = {
	index:0,
	mode: ,
	length: ,
	song_list: []
}

//本地列表，歌曲收藏
PlayList = {
	length: ,
	date: ,
	name: ,
	comment: ,
	avator_url: ,
	song_list: []
}

/*ActionType*/
actions = {
	PLAYPAUSESHIFT: 'PLAYPAUSESHIFT',          //播放、暂停切换
	MUSICSHIFT    : 'MUSICSHIFT',
	TIMEUPDATE    : 'TIMEUPDATE',
	QUERYKEYWORD  : 'QUERYKEYWORD',
	REQUESTSONG   : 'REQUESTSONG',
	REQUESTLYRIC  : 'REQUESTLYRIC',
	REQUESTKEYWORD: 'REQUESTKEYWORD'
}