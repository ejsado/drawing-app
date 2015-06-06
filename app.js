
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

nsp.on('connection', function(socket) {
	
	var GameNode = {
		
		room: 'default',
		
		name: 'someone',
		
		JoinRoom: function(rm) {
			//console.log('current room: ' + GameNode.room);
			GameNode.room = rm;
			socket.join(GameNode.room);
			console.log(GameNode.name + ' joined ' + GameNode.room);
		}
		
	};
	
	console.log(GameNode.name + ' connected');
	
	socket.on('recieverCreateRoom', function(room) {
		GameNode.name = 'TV';
		GameNode.JoinRoom(room);
	});
	
	socket.on('senderAddPlayer', function(nameAndRoom) {
		// validate name on sender form
		GameNode.name = nameAndRoom.name;
		GameNode.JoinRoom(nameAndRoom.room);
		// emit player to all users in room
		nsp.to(nameAndRoom.room).emit('emitState', {
			state: 'playerAdded',
			playerName: GameNode.name
		});
	});
	
	socket.on('disconnect', function() {
		console.log(GameNode.name + ' in ' + GameNode.room + ' disconnected');
		nsp.to(GameNode.room).emit('emitState', {
			state: 'playerRemoved',
			playerToRemove: GameNode.name
		});
	});
});

http.listen(80, function() {
	console.log('listening on *:80');
});

