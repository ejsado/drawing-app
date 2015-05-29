// must run as root when on port 80
// cannot share port with apache

var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use('/demo/draw/static', express.static('public'));

app.get('/demo/draw', function(req, res){
	res.sendFile(__dirname + '/views/sender.html');
});

app.get('/demo/draw/tv', function(req, res){
	res.sendFile(__dirname + '/views/reciever.html');
});

io.on('connection', function(socket){
	console.log('a user connected');
	socket.on('draw', function(data){
		io.emit('draw', data);
		//console.log('draw: ' + data);
	});
	socket.on('disconnect', function(){
		console.log('user disconnected');
	});
});

http.listen(80, function(){
	console.log('listening on *:80');
});
