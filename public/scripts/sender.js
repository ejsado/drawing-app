
var Sender = {
	
	socket: io('/demo/draw'),
	
	name: 'user',
	
	room: 'empty room',
	
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
	
	SendLoginInfo: function(userName, roomCode) {
		Sender.socket.emit('senderJoinGame', {
			room: roomCode,
			name: userName
		});
		console.log('login function fired');
	},
	
	ProcessState: function(data) {
		switch (data.state) {
			case 'updatePlayerList':
				Sender.UpdatePlayerList(data.playerList);
				//Sender.DisplayLoading(false);
				if (data.add) {
					Sender.UpdateJoinInfo(data.updatedPlayer + ' joined the game!');
					if (data.updatedPlayer == Sender.name) {
						 Sender.DisplayLogin(false);
					}
					if (!data.enoughPlayers) {
						Sender.DisplayInfo(true, "Find some more friends!");
					} else if (data.currentPlayer == Sender.name) {
						Sender.DisplayInfo(false);
						Sender.DisplayReady(true);
					} else {
						Sender.DisplayInfo(true, "Wait your turn.");
					}
				} else if (!data.add) {
					Sender.UpdateJoinInfo(data.updatedPlayer + ' left the game :(');
				}
				break;
			case 'playerDuplicate':
				Sender.UpdateJoinInfo('The name ' + data.updatedPlayer + ' already exists.');
				Sender.DisableJoinButton(false);
				break;
		}
	},
	
	Init: function() {
		Sender.ClearHTML();
		// set login function
		$('#form-login').submit(function(e) {
			e.preventDefault();
			Sender.name = $("#username").val();
			Sender.room = $("#room-code").val().toUpperCase();
			console.log('user attemped to join as ' + Sender.name);
			// username validation happens in the reciever
			Sender.SendLoginInfo(Sender.name, Sender.room);
			Sender.DisableJoinButton(true);
		});
	}
};


var init = function() {

	Sender.Init();
	
	Sender.socket.on('emitState', function(stateData) {
		Sender.ProcessState(stateData);
	});
	
};

$(document).ready(init);

