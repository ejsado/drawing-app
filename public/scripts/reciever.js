
var Reciever = {
	
	//socket: io('/demo/draw'),
	
	ClearHTML: function() {
		// clear default html
		$("#score-container").html("");
		$("#room-small").html("");
		$("#display-players-header").html("");
	},
	
	GenerateRoom: function(num) {
		var text = "";
		var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
		for (var i=0; i < num; i++) {
			text += possible.charAt(Math.floor(Math.random() * possible.length));
		}
		return text;
	},
	
	UpdateRoomCode: function(roomCode) {
		$("#room-small").html(roomCode);
		$("#display-players-header").html('Room Code: <span id="room-big">' + roomCode + '</span>');
	},
	
	UpdatePlayerScores: function(playerScores) {
		$("#score-container").html("");
		for (i = 0; i < playerScores.length; i++) {
			$("#score-container").append("<p>" + playerScores[i].player + "<span>" + playerScores[i].score + "</span></p>");
		}
	},
	
	ProcessState: function(data) {
		switch (data.state) {
			case 'playerAdded':
				Shared.AddPlayer(data.playerName);
				Reciever.UpdatePlayerScores(Shared.playerList);
				break;
		}
	},
	
	Init: function() {
		Reciever.ClearHTML();
		// create and display room code
		var roomCode = Reciever.GenerateRoom(4);
		Shared.socket.emit('recieverCreateRoom', roomCode);
		Reciever.UpdateRoomCode(roomCode);
	}
};


var init = function() {

	Reciever.Init();
	
	Shared.socket.on('emitState', function(stateData) {
		Reciever.ProcessState(stateData);
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
