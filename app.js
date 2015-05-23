// must run as root on port 80
// cannot share port with apache

var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use('/demo/draw', express.static('public'));

app.get('/demo/draw', function(req, res){
	res.sendFile(__dirname + '/views/sender.html');
});

io.on('connection', function(socket){
	console.log('a user connected');
	socket.on('chat message', function(msg){
		io.emit('chat message', msg);
		console.log('message: ' + msg);
	});
	socket.on('disconnect', function(){
		console.log('user disconnected');
	});
});

http.listen(80, function(){
	console.log('listening on *:80');
});
