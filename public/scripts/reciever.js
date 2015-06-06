
var Reciever = {
	
	socket: io('/demo/draw'),
	
	playerList: [],
	
	minPlayers: 3,
	
	currentPlayer: '',
	
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
	
	UpdatePlayerScores: function() {
		$("#score-container").html("");
		for (i = 0; i < Reciever.playerList.length; i++) {
			$("#score-container").append("<p>" + Reciever.playerList[i].player + "<span>" + Reciever.playerList[i].score + "</span></p>");
		}
	},
	
	ValidateName: function(checkName) {
		// currently, form validation is done in the HTML
		// only check for duplicates here
		for (i = 0; i < Reciever.playerList.length; i++) {
			if (Reciever.playerList[i].player == checkName) {
				return false;
			}
		}
		return true;
	},
	
	AddPlayer: function(playerName) {
		var len = Reciever.playerList.length;
		var nextPlayer = '';
		if (len >= 1) {
			nextPlayer = Reciever.playerList[0].player;
		}
		Reciever.playerList.push({
			player: playerName,
			next:  nextPlayer,
			score: 0
		});
		len = Reciever.playerList.length;
		if (len == 1) {
			Reciever.currentPlayer = playerName;
		}
		if (len > 1) {
			Reciever.playerList[len - 2].next = playerName;
		}
	},
	
	RemovePlayer: function(playerName) {
		var len = Reciever.playerList.length;
		for (i = 0; i < len; i++) {
			if (Reciever.playerList[i].player == playerName) {
				if (Reciever.currentPlayer == playerName) {
					Reciever.currentPlayer = Reciever.playerList[i].next;
				}
				if (i > 0) {
					Reciever.playerList[i - 1].next = Reciever.playerList[i].next;
				}
				Reciever.playerList.splice(i, 1);
			}
		}
		if (len == 0) {
			Reciever.currentPlayer = '';
		}
	},
	
	EnoughPlayers: function() {
		if (Reciever.playerList.length >= Reciever.minPlayers) {
			return true;
		}
		return false;
	},
	
	NextTurn: function() {
		for (i = 0; i < Reciever.playerList.length; i++) {
			if (Reciever.playerList[i].player == Reciever.currentPlayer) {
				Reciever.currentPlayer = Reciever.playerList[i].next;
				return;
			}
		}
	},
	
	PlayerListChanged: function(playerAdded, data) {
		if (playerAdded) {
			Reciever.AddPlayer(data.updatedPlayer);
		} else {
			Reciever.RemovePlayer(data.updatedPlayer);
		}
		Reciever.UpdatePlayerScores();
		Reciever.socket.emit('sendState', {
			state: 'updatePlayerList',
			playerList: Reciever.playerList,
			add: playerAdded,
			updatedPlayer: data.updatedPlayer,
			enoughPlayers: Reciever.EnoughPlayers(),
			currentPlayer: Reciever.currentPlayer
		});
	},
	
	ProcessState: function(data) {
		switch (data.state) {
			case 'tryAddPlayer':
				if (Reciever.ValidateName(data.updatedPlayer)) {
					Reciever.PlayerListChanged(true, data);
				} else {
					Reciever.socket.emit('sendState', {
						state: 'playerDuplicate',
						updatedPlayer: data.updatedPlayer
					});
				}
				break;
			case 'playerRemoved':
				Reciever.PlayerListChanged(false, data);
		}
	},
	
	Init: function() {
		Reciever.ClearHTML();
		// create and display room code
		var roomCode = Reciever.GenerateRoom(4);
		Reciever.socket.emit('recieverCreateRoom', roomCode);
		Reciever.UpdateRoomCode(roomCode);
	}
};


var init = function() {

	Reciever.Init();
	
	Reciever.socket.on('emitState', function(stateData) {
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
