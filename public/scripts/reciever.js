
var Reciever = {
	
	socket: io('/demo/draw'),
	
	clearHTML: function() {
		// clear default html
		$("#score-container").html("");
		$("#room-small").html("");
		$("#display-players-header").html("");
	},
	
	generateRoom: function(num) {
		var text = "";
		var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
		for (var i=0; i < num; i++) {
			text += possible.charAt(Math.floor(Math.random() * possible.length));
		}
		return text;
	},
	
	updateRoomCode: function(roomCode) {
		$("#room-small").html(roomCode);
		//$("#display-players-header").html('Room Code: <span id="room-big">' + roomCode + '</span>');
		var hostname = $(location).attr('hostname');
		$("#display-players-header").html(hostname + '/demo/draw');
	},
	
	updatePlayerScores: function(playerList) {
		$("#score-container").html("");
		for (i = 0; i < playerList.length; i++) {
			$("#score-container").append("<p>" + playerList[i].player + "<span>" + playerList[i].score + "</span></p>");
		}
	},
	
	init: function() {
		Reciever.clearHTML();
		// create and display room code
		var roomCode = Reciever.generateRoom(4);
		Reciever.socket.emit('createGame', roomCode);
		Reciever.updateRoomCode(roomCode);
	}
};


var init = function() {

	Reciever.init();
	
	Reciever.socket.on('playerAdded', function(data) {
		Reciever.updatePlayerScores(data.playerList);
	});
	
	Reciever.socket.on('playerRemoved', function(data) {
		Reciever.updatePlayerScores(data.playerList);
	});
	
};

$(document).ready(init);







	/*
	socket.on('tryAddPlayer', function(playerAndRoom) {
		for (i = 0; i < playerList.length; i++) {
			if (playerAndRoom.name == playerList[i].player) {
				socket.to(playerAndRoom.room).emit('playerExists', playerList[i].player);
				return;
			}
		}
		playerList.push({player:playerAndRoom.name, score:0});
		socket.emit('playerAdded', playerAndRoom);
		writePlayerScores();
	});

	socket.on('removePlayer', function(playerName) {
		for (i = 0; i < playerList.length; i++) {
			if (playerList[i].player == playerName) {
				playerList.splice(i, 1);
			}
		}
		writePlayerScores();
	});
	*/
