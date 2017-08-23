"use strict";

var planets = {},
	playerCounter = 1;
planets[KEY_CHROME] = {id:KEY_CHROME,health:100,players:[],bullets:[],particles:[]};
planets[KEY_FIREFOX] = {id:KEY_FIREFOX,health:100,players:[],bullets:[],particles:[]};
planets[KEY_OTHER] = {id:KEY_OTHER,health:100,players:[],bullets:[],particles:[]};

module.exports = function (socket) {

	let intervalId,
		currentPlanet,
		playerId;

	intervalId = setInterval(function() {

		if(currentPlanet) {

			socket.emit(PLANET_UPDATE+currentPlanet.id,currentPlanet);
		}

	}, 1000);

	socket.on('disconnect', disconnected);
	socket.on(REQUEST_DISCONNECTION, disconnected);

	function disconnected(clearId = intervalId){

		console.log('disconnected - playerId: ' + playerId);
		if(currentPlanet && playerId) {


			currentPlanet.players = currentPlanet.players.filter((player)=>{
				console.log('player.id: ' + player.id +', playerId: ' + playerId);
				return player.id !== playerId;
			});
		}

		clearInterval(clearId);
	}

	socket.on(REQUEST_CONNECTION, function(browser, isMobile){
		console.log('REQUEST_CONNECTION - browser: ' + browser);
		if(planets[browser]) {

			currentPlanet = planets[browser];

			if(isMobile) {

				if(!playerId) {
					playerId = playerCounter++;
				}
				socket.emit(CONNECTION_GRANTED, playerId);
				currentPlanet.players.push({x:0,y:0,id: playerId});
			}
		}
	});
};