
export function timeFormat(seconds){
	if(seconds === undefined){
		return '未知';
	}
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

export function formatText(str){              //去除文本中html标签
	if(typeof str!=="string"){ 
		return str;
	}
	return str.replace(/<[^>]+>/g,'');
}

export function formatLrc(str){
	let arr = str.split('\n');
	let timeReg = /\[(\d{2}):(\d{2})\.(\d{2})\]/g;
	let result = [];
	for(let i=0;i<arr.length;i++){
		if(trim(arr[i])!==""){
			let test = timeReg.exec(arr[i]);
			if(test&&test.length>1){
				let time = parseInt(test[1])*60 + parseInt(test[2]);
				let text = arr[i].replace(timeReg,'');
				result.push([time,text]);
			}
		}
	}
	return result;
}

export function getIndex(name,obj,arr){
	let arrI = arr.map( item => item[name] );
	return arrI.indexOf(obj[name]);
}

export function filter(name,arr,arrRefer=[]){
	if(!(arr instanceof Array)){
		arr = [arr];
	}
	if(arrRefer.length===0){
		return arr;
	}
	let arrReferI = arrRefer.map( item => item[name] );
	let result = arr.filter( item => arrReferI.indexOf(item[name])===-1 );
	return result;
}

export function StorageGetter(key){
	var value = localStorage.getItem('ReactMusic_'+key);
	return JSON.parse(value);
}

export function StorageSetter(key,value){
	var json = JSON.stringify(value);
	localStorage.setItem('ReactMusic_'+key,json);
}