
var Sender = {
	
	socket: io('/demo/draw'),
	
	name: 'user',
	
	room: 'empty room',
	
	ClearHTML: function() {
		// clear default html
		$("#join-info").html("");
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
				if (data.add) {
					Sender.UpdateJoinInfo(data.playerName + ' joined the game!');
				} else if (!data.add) {
					Sender.UpdateJoinInfo(data.playerName + ' left the game :(');
				}
				break;
			case 'playerDuplicate':
				Sender.UpdateJoinInfo('The name ' + data.playerName + ' already exists.');
				break;
		}
	},
	
	Init: function() {
		Sender.ClearHTML();
		// set login function
		$('#form-login').submit(function(e) {
			e.preventDefault();
			Sender.name = $("#username").val();
			Sender.room = $("#room-code").val();
			console.log('user attemped to join as ' + Sender.name);
			// username validation happens in the reciever
			Sender.SendLoginInfo(Sender.name, Sender.room);			
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

