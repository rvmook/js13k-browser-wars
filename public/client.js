const MAX_DISTANCE = 100;

var socket = io(),
	playerId,
	width,
	height,
	halfWidth,
	halfHeight,
	newRadians,
	newSpeed,
	currentRadians,
	currentSpeed,
	win = window,
	doc = document,
	ctx = c.getContext('2d'),
	currentKey = '',
	isMobile = win.matchMedia('(max-width:440px)').matches,
	isChrome = !!win.chrome && !!win.chrome.webstore,
	isFirefox = typeof InstallTrigger !== 'undefined';

socket.on(CONNECTION_GRANTED,onConnectionGranted);

// fix bug in safari: http://qfox.nl/weblog/218
document.body.clientWidth;
// auto resize (original) canvas. call `onresize(w,h) to limit the size of the canvas
win.onresize = function(){

	c.style.width = (c.width = width = innerWidth) + 'px';
	c.style.height = (c.height = height = innerHeight) + 'px';
	halfWidth = width/2;
	halfHeight = height/2;
};

win.onresize();
redraw();

if(!isMobile) {

	var key = KEY_OTHER;

	if(isChrome) {

		key = KEY_CHROME;

	} else if(isFirefox) {

		key = KEY_FIREFOX;
	}

	connectTo(key);
}



function connectTo(key) {

	socket.off(PLANET_UPDATE+currentKey);

	currentKey = key;
	socket.on(PLANET_UPDATE+currentKey, onUpdate);
	socket.emit(REQUEST_DISCONNECTION, 0);
	socket.emit(REQUEST_CONNECTION, currentKey, isMobile);
}

function onConnectionGranted(newPlayerId) {

	playerId = newPlayerId;
	console.log('playerId', playerId);
}

function onUpdate(updated) {

	console.log('isMobile', isMobile, 'updated', updated);
win.addEventListener('touchend',()=>{newSpeed = 0});
win.addEventListener('touchmove', win.onmousemove = (e)=>{

	if(e.touches) {

		e = e.touches[0];
	}

	let x = e.clientX,
		y = e.clientY;

	newRadians = Math.atan2(halfHeight-y, halfWidth-x);
	newSpeed = Math.max(0, Math.min(1, distance(x, y, halfWidth, halfHeight) / MAX_DISTANCE));
});

function distance(x1, y1, x2, y2) {

	var a = x1 - x2;
	var b = y1 - y2;

	return Math.sqrt( a*a + b*b );
}

setInterval(()=>{
	if(newRadians !== currentRadians || newSpeed !== currentSpeed) {

		currentRadians = newRadians;
		currentSpeed = newSpeed;

		socket.emit(PLAYER_UPDATE, playerId, currentRadians, currentSpeed);
	}
}, 1000/30);

function redraw() {

	ctx.clearRect(0, 0, width, height);

	drawShip(0, 0, currentRadians, currentSpeed);


	requestAnimationFrame(redraw);
}

function drawShip(x = 0, y = 0, radians = 0, speed = 0) {

	ctx.save();

	ctx.beginPath();

	ctx.translate(halfWidth + x, halfHeight + y);

	ctx.rotate(radians);

	ctx.moveTo(-20, 0);
	ctx.lineTo(10, -10);
	ctx.lineTo(0, 0);
	ctx.lineTo(10, 10);
	ctx.closePath();
	ctx.fillStyle = 'yellow';
	ctx.fill();

	ctx.restore();

}