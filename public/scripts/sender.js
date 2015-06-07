
var Sender = {
	
	socket: io('/demo/draw'),
	
	playerName: 'user',
	
	playerRoom: 'empty room',
	
	ClearHTML: function() {
		// clear default html
		$("#join-info").html("");
	},
	
	DisableJoinButton: function(disable) {
		if (disable) {
			$('#join').prop("disabled", true);
		} else {
			$('#join').prop("disabled", false);
		}
	},
	
	DisplayLoading: function(display) {
		if (display) {
			$("#user-loading").show();
		} else {
			$("#user-loading").hide();
		}
	},
	
	DisplayInfo: function(display, message1, message2) {
		message1 = message1 || '';
		message2 = message2 || '';
		if (display) {
			$("#user-info").show();
			$("#info-1").html(message1);
			$("#info-2").html(message2);
		} else {
			$("#user-info").hide();
		}
	},
	
	DisplayReady: function(display) {
		if (display) {
			$("#user-ready").show();
			$('#start-turn').prop("disabled", false);
		} else {
			$("#user-ready").hide();
			$('#start-turn').prop("disabled", true);
		}
	},
	
	DisplayLogin: function(display) {
		if (display) {
			$("#user-login").show();
		} else {
			$("#user-login").hide();
		}
	},
	
	UpdateJoinInfo: function(message) {
		$("#join-info").html(message);
	},
	
	UpdatePlayerList: function(playerList) {
		
	},
	
	playerListChanged: function(data) {
		Sender.UpdatePlayerList(data.playerList);
		if (!data.enoughPlayers) {
			Sender.DisplayInfo(true, "You need more players!", "Go make friends, quick!");
		} else if (data.currentPlayer == Sender.playerName) {
			Sender.DisplayInfo(false);
			Sender.DisplayReady(true);
		} else {
			Sender.DisplayInfo(true, "It's not your turn.", "Hint: look at the screen and say phrases.");
		}
	},
	
	SendLoginInfo: function(name, room) {
		Sender.socket.emit('joinGame', {
			roomCode: room,
			playerName: name
		});
		console.log('login function fired');
	},
	
	Init: function() {
		Sender.ClearHTML();
		// set login function
		$('#form-login').submit(function(e) {
			e.preventDefault();
			Sender.playerName = $("#username").val();
			Sender.playerRoom = $("#room-code").val().toUpperCase();
			console.log('user attemped to join as ' + Sender.playerName);
			// username validation happens on the server
			Sender.SendLoginInfo(Sender.playerName, Sender.playerRoom);
			Sender.DisableJoinButton(true);
		});
	}
};


var init = function() {

	Sender.Init();
	
	var playerListChanged = function(data) {
		
	}
	
	Sender.socket.on('playerAdded', function(data) {
		if (data.playerName == Sender.playerName) {
			 Sender.DisplayLogin(false);
			 console.log('you joined as ' + Sender.playerName);
		} else {
			console.log(data.playerName + ' joined');
		}
		Sender.playerListChanged(data);
	});
	
	Sender.socket.on('playerRemoved', function(data) {
		console.log(data.playerName + ' left');
		Sender.playerListChanged(data);
	});
	
	Sender.socket.on('invalidName', function(data) {
		if (data.playerName == Sender.playerName) {
			Sender.UpdateJoinInfo('The name ' + data.playerName + ' already exists.');
			Sender.DisableJoinButton(false);
		}
		console.log(data.playerName + ' is invalid');
	});
	
	Sender.socket.on('emptyRoom', function(rm) {
		Sender.UpdateJoinInfo('The room ' + rm + ' is empty. Try again.');
		console.log('you are in an empty room');
	});
	
	Sender.socket.on('closedRoom', function(rm) {
		var hostname = $(location).attr('hostname');
		Sender.DisplayInfo(true, "This room was closed.", "Go to " + hostname + "/demo/draw/tv on your TV to start a new game.");
		console.log('you are in a closed room');
	});
	
};

$(document).ready(init);

