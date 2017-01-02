$(function(){
var Dom= {
	audio  : $('audio')[0],
	audioj : $('audio'),
	bg     : $('.background'),
	lyricPanel  :$('.music-lyric'),
	baseBar: $('.base-bar'),
	progressBar: $('.progress-bar'),
	play   : $('.music-play'),
	prev   : $('.music-prev'),
	next   : $('.music-next'),
	title  : $('.music-title'),
	artist : $('.music-artist'),
	album  : $('.music-album'),
	lyricBtn: $('.lyriced'),
	star   : $('.m-star'),
	channelBtn: $('.music-change'),
	channelDis: $('.channel-name')
};
var Util = (function(){
	var prefix = 'html5_onlineMusic_';
	var StorageGetter = function(key){
		return localStorage.getItem(prefix + key);
	};
	var StorageSetter = function(key,value){
		return localStorage.setItem(prefix + key, value);
	};
	return {
		StorageGetter: StorageGetter,
		StorageSetter: StorageSetter
	}
})();
//type = 1-新歌榜,2-热歌榜,11-摇滚榜,12-爵士,16-流行,21-欧美金曲榜,22-经典老歌榜,23-情歌对唱榜,24-影视金曲榜,25-网络歌曲榜
var channel = [1,2,11,12,16,21,22,23,24,25];
var channelObj = {'1':'新歌榜','2':'热歌榜','11':'摇滚榜','12':'爵士','16':'流行','21':'欧美金曲榜','22':'经典老歌榜','23':'情歌对唱榜','24':'影视金曲榜','25':'网络歌曲榜'};
var curChannel = channel[Math.floor(Math.random()*channel.length)];
var baseUrl = 'http://tingapi.ting.baidu.com/v1/restserver/ting';
var songArr = [];
var curIndex = 0;
var myFavorite = [];  //通过split函数将字符串转换为数组
if(Util.StorageGetter('myFavorite')){
	myFavorite = Util.StorageGetter('myFavorite').split(',')
}
var timer = 0;
var timerLyric = 0;
var lyricArr = [];

//事件处理句柄
function EventHanlder(){
//todo 交互事件绑定
	//点击播放暂停按钮
	Dom.play.click(function(){
		if(Dom.audio.paused){
			play();
		}else{
			pause();
		}
	});
	Dom.next.click(function(){
		next();
	});
	Dom.prev.click(function(){
		prev();
	});
	// 播放完成自动播放下一首
	Dom.audio.onEnded = function(){
		next();
	};
	// 歌词显示或者隐藏切换
	Dom.lyricBtn.click(function(){
		if(Dom.lyricPanel.css('display')=='none'){
			Dom.lyricPanel.css('display','block');
			Dom.lyricBtn.css('color','#cdd2d7');
		}else{
			Dom.lyricPanel.css('display','none');
			Dom.lyricBtn.css('color','#000');			
		}
	});
	// 喜欢按钮，将song_id写入localStorage,并且点亮星形按钮
	Dom.star.click(function(){
		if(Dom.star.hasClass('stared')){
			Dom.star.removeClass('stared');
			var index = myFavorite.indexOf(Dom.audioj.attr('sid'));
			myFavorite.splice(index);
		}else{
			Dom.star.addClass('stared');
			myFavorite.push(Dom.audioj.attr('sid'));
		}
		Util.StorageSetter('myFavorite',myFavorite);
	});

	//切换频道
	Dom.channelBtn.click(function(){
		songArr.length = 0;          //切开播放列表
		var index = channel.indexOf(curChannel);
		curChannel = channel[(index+1)%10];
		fetchMusicList(curChannel);
	});

	//点击进度条，改变播放时间
	$('.click-bar').click(function(e){
		var total = $('.click-bar').outerWidth();
		var clickPos = e.pageX - $('.click-bar').offset().left;
		Dom.audio.currentTime = parseInt(clickPos/total*Dom.audio.duration);
		changeProgress();
		showLyric();
	});
}

function play(){
	Dom.play.removeClass('m-play').addClass('m-pause');
	clearInterval(timer);
	timer = setInterval(function(){
		if(!Dom.audio.paused){
			changeProgress();
		}
	},2000);
	Dom.audio.play();
}
function pause(){
	Dom.audio.pause();
	Dom.play.removeClass('m-pause').addClass('m-play');
	clearInterval(timer);
}
function next(){
	curIndex += 1 ;
	if(curIndex > songArr.length-1){
		curIndex = curIndex - songArr.length;
	}
	fetchMusic(songArr[curIndex]);
}
function prev(){
	curIndex -= 1;
	if(curIndex < 0 ){
		curIndex = curIndex + songArr.length;
	}
	fetchMusic(songArr[curIndex]);
}

function changeProgress(){
	var progressBar = Math.floor(Dom.audio.currentTime/Dom.audio.duration*parseInt(Dom.baseBar.css('width')));
	Dom.progressBar.css('width',progressBar+'px');
}

function fetchMusicList(type,size,offset){
	//var url = baseUrl + '?method=baidu.ting.billboard.billList'
	$.ajax({
		url     : baseUrl,
		dataType: 'jsonp',
		jsonp   : 'callback',
		data:{
			'method': 'baidu.ting.billboard.billList',
			'type'  : type || channel[Math.floor(Math.random()*channel.length)],
			'size'  : size || 50,
			'offset': offset || 0
		},
		success: function(res){
			$.each(res['song_list'],function(index,item){
				songArr.push(item['song_id']);
			});
			songArr = songArr.concat(myFavorite);    //默认把收藏的歌曲加到列表末尾
			Dom.channelDis.text(channelObj[curChannel]);
			$('.count').text(songArr.length+'首');
			fetchMusic(songArr[curIndex]);
		}
	});

}

function fetchLyric(url){
	$('.music-lyric .lyric').empty();
	$.ajax({
		url     : url,
		dataType: 'text',
		success : function(res){
			var line = res.split('\n');
			var timeReg = /\[(\d{2}):(\d{2}).(\d{2})\]/gi;
			var result = [];
			$.each(line,function(index,item){
				if(item.trim()!=''){
					var test = timeReg.exec(item);
					if(test&&test.length>1){
						var time = parseInt(test[1])*60 + parseInt(test[2]);
						var lyricText = item.replace(timeReg,'');
						result.push([time,lyricText]);
					}
				}
			});
			lyricArr = result; 
			renderLyric();
		}
	});
}

function renderLyric(){
	var lyrLi = '';
	$.each(lyricArr,function(index,item){
		lyrLi += "<li data-time="+item[0]+'>'+item[1]+'</li>';
	});
	$('.lyric').append(lyrLi);
	$('.music-lyric .lyric').css('top',0);
	clearInterval(timerLyric);
	timerLyric = setInterval(showLyric,500);
}

function showLyric(){
	var liH = 0;
	curTime = Dom.audio.currentTime;
	$('.lyric li').each(function(index,item){
		var curT = $('.lyric li').eq(index).attr('data-time');
		var nextT = $('.lyric li').eq(index+1).attr('data-time');
		if((curTime > curT) && (curTime < nextT) &&!$('.lyric li').eq(index).hasClass('active')){
			$(".lyric li").removeClass('active');
			$('.lyric li').eq(index).addClass('active');
			if(liH > 108 || $('.music-lyric .lyric').css('top') < -108 ){
				$('.music-lyric .lyric').css('top',-liH+108);
			}
		}
		liH += $('.lyric li').eq(index).outerHeight();
	});
}

function fetchMusic(songid){
	var xhrReq = $.ajax({
		url     : baseUrl,
		timeout : 30000,
		dataType: 'jsonp',
		jsonp   : 'callback',
		data:{
			'method': 'baidu.ting.song.play',
			'songid': songid
		},
		success: function(res){
			var url = res.bitrate['show_link'],
                bgPig = res.songinfo['pic_radio'],
                title = res.songinfo['title'],
                artist = res.songinfo['author'],
                album = res.songinfo['album_title'];
                lyric = res.songinfo['lrclink'];
            Dom.title.text(title);
            Dom.title.attr('title',title);
            Dom.artist.text(artist);
            Dom.artist.attr('title',artist);
            Dom.album.text(album);
            Dom.album.attr('title',album);
            Dom.audioj.attr('sid',songid);
            Dom.bg.css('background','url('+bgPig+') no-repeat center top');
            Dom.audioj.attr('src',url);
            if(myFavorite.indexOf(songid)!='-1'){
            	Dom.star.addClass('stared');
            }else{
            	Dom.star.removeClass('stared');
            }
            fetchLyric(lyric);
            play();
		},
		complete: function(xhr,status){
			if(status == 'timeout'){
				xhrReq.abort();
				$('.lyric').append('<li style="color:red">网络超时</li>');
			}
		}
	});	
}
	EventHanlder();
	fetchMusicList(curChannel);
});