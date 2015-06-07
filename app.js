// Server Setup

// must run as root when on port 80
// cannot share port with apache

var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var nsp = io.of('/demo/draw');

app.use('/demo/draw/static', express.static('public'));

app.get('/demo/draw', function(req, res) {
	res.sendFile(__dirname + '/views/sender.html');
});

app.get('/demo/draw/tv', function(req, res) {
	res.sendFile(__dirname + '/views/reciever.html');
});

// Server Logic

var GameRoom = function (pl, cp, mp) {
	
	this.playerList = pl || [];
	
	this.currentPlayer = cp || '';
	
	this.minPlayers = mp || 3;
	
};

GameRoom.prototype.validateName = function(checkName) {
	for (i = 0; i < this.playerList.length; i++) {
		if (this.playerList[i].player == checkName) {
			console.log(checkName + ' is a duplicate name');
			return false;
		}
	}
	console.log(checkName + ' is a valid name');
	return true;
};

GameRoom.prototype.addPlayer = function(playerName) {
	var nextPlayer = '';
	if (this.playerList.length >= 1) {
		nextPlayer = this.playerList[0].player;
	}
	this.playerList.push({
		player: playerName,
		next:  nextPlayer,
		score: 0
	});
	var len = this.playerList.length;
	if ( len == 1) {
		this.currentPlayer = playerName;
	}
	if (len > 1) {
		this.playerList[len - 2].next = playerName;
	}
	console.log(playerName + ' added');
};

GameRoom.prototype.removePlayer = function(playerName) {
	for (i = 0; i < this.playerList.length; i++) {
		if (this.playerList[i].player == playerName) {
			if (this.currentPlayer == playerName) {
				this.currentPlayer = this.playerList[i].next;
			}
			if (i > 0) {
				this.playerList[i - 1].next = this.playerList[i].next;
			}
			this.playerList.splice(i, 1);
			break;
		}
	}
	if (this.playerList.length == 0) {
		this.currentPlayer = '';
	}
};

GameRoom.prototype.enoughPlayers = function() {
	if (this.playerList.length >= this.minPlayers) {
		return true;
	}
	return false;
};

GameRoom.prototype.nextTurn = function() {
	for (i = 0; i < this.playerList.length; i++) {
		if (this.playerList[i].player == this.currentPlayer) {
			this.currentPlayer = this.playerList[i].next;
			return;
		}
	}
};

var storedRooms = {};

// Socket Logic

nsp.on('connection', function(socket) {
	
	var socketName = 'someone';
	
	var socketRoom = 'default';
	
	var isHost = false;
	
	var joinRoom = function(rm) {
		socket.join(rm);
		socketRoom = rm;
		console.log(socketName + ' joined ' + rm);
	};
	
	var roomExists = function(rm, existsFunction, joiningFlag) {
		var game = storedRooms[rm];
		if (game) {
			existsFunction(game);
		} else {
			console.log('room ' + rm + ' does not exist');
			if (joiningFlag) {
				nsp.to(rm).emit('emptyRoom', rm);
			} else {
				nsp.to(rm).emit('closedRoom', rm);
			}
		}
	};
	
	var playerListChanged = function(eventName, pList, currPlayer, enoughPlayers) {
		nsp.to(socketRoom).emit(eventName, {
			playerName: socketName,
			playerList: pList,
			currentPlayer: currPlayer,
			enoughPlayers: enoughPlayers
		});
	};
	
	console.log(socketName + ' connected');
	
	socket.on('createGame', function(rm) {
		socketName = 'TV';
		isHost = true;
		joinRoom(rm);
		storedRooms[rm] = new GameRoom();
	});
	
	socket.on('joinGame', function(data) {
		joinRoom(data.roomCode);
		socketName = data.playerName;
		roomExists(socketRoom, function(game) {
			if (game.validateName(socketName)) {
				game.addPlayer(socketName);
				playerListChanged('playerAdded', game.playerList, game.currentPlayer, game.enoughPlayers());
			} else {
				nsp.to(socketRoom).emit('invalidName', data);
			}
		}, true);
	});
	
	socket.on('disconnect', function() {
		if (isHost) {
			storedRooms[socketRoom] = null;
		} else {
			roomExists(socketRoom, function(game) {
				game.removePlayer(socketName);
				playerListChanged('playerRemoved', game.playerList, game.currentPlayer, game.enoughPlayers());
			});
		}
		console.log(socketName + ' in ' + socketRoom + ' disconnected');
	});
});

http.listen(80, function() {
	console.log('listening on *:80');
});

