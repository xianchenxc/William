
export function timeFormat(seconds){
	if(typeof seconds!=='number'){
		seconds = parseInt(seconds)
	}
	let sec = seconds%60;
	let min = parseInt(seconds/60);
	let res = '';
	return `${min>=10?min:'0'+min}:${sec>=10?sec:'0'+sec}`;
}

export function offsetLeft(ele){
	let left = ele.offsetLeft;
	let parent = ele.offsetParent;
	while(parent){
		left += parent.offsetLeft;
		parent = parent.offsetParent;
	}
	return left;
}

export function trim(str){
	return str.replace(/(^\s*)|(\s*$)/g,'');
}

export function StorageGetter(key){
	var value = localStorage.getItem('ReactMusic_'+key);
	return JSON.parse(value);
}

export function StorageSetter(key,value){
	var json = JSON.stringify(value);
	localStorage.setItem('ReactMusic_'+key,json);
}