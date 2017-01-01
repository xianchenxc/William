
export function timeFormat(seconds){
	if(typeof seconds!=='number'){
		seconds = parseInt(seconds)
	}
	let sec = seconds%60;
	let min = parseInt(seconds/60);
	let res = '';
	return `${min>=10?min:'0'+min}:${sec>=10?sec:'0'+sec}`;
}