var socket = io(),
	win = window,
	doc = document,
	currentKey = '',
	isMobile = win.matchMedia('(max-width:440px)').matches,
	isChrome = !!win.chrome && !!win.chrome.webstore,
	isFirefox = typeof InstallTrigger !== 'undefined';

socket.on(CONNECTION_GRANTED,onConnectionGranted);
console.log('isMobile', isMobile);

if(!isMobile) {

	var key = KEY_OTHER;

	if(isChrome) {

		key = KEY_CHROME;

	} else if(isFirefox) {

		key = KEY_FIREFOX;
	}

	connectTo(key);
}

doc.querySelectorAll('li').forEach((el)=>{

	el.addEventListener('click', ()=>{connectTo(el.innerHTML)});
});


function connectTo(key) {

	socket.off(PLANET_UPDATE+currentKey);

	currentKey = key;
	socket.on(PLANET_UPDATE+currentKey, onUpdate);
	socket.emit(REQUEST_DISCONNECTION, 0);
	socket.emit(REQUEST_CONNECTION, currentKey, isMobile);
}

function onConnectionGranted(playerId) {
	console.log('playerId', playerId);
}

function onUpdate(updated) {

	console.log('isMobile', isMobile, 'updated', updated);
}