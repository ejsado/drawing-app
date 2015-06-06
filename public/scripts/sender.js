
var Sender = {
	
	name: 'user',
	
	ClearHTML: function() {
		// clear default html
		$("#join-info").html("");
	},
	
	UpdateJoinInfo: function(message) {
		$("#join-info").html(message);
	},
	
	UpdatePlayerList: function(playerList) {
		
	},
	
	SendLoginInfo: function() {
		rc = $("#room-code").val();
		nm = $("#username").val();
		Shared.socket.emit('senderAddPlayer', {"room": rc, "name": nm});
		console.log('login function fired');
	},
	
	ProcessState: function(data) {
		switch (data.state) {
			case 'playerAdded':
				Shared.AddPlayer(data.playerName);
				Sender.UpdatePlayerList(data.playerList);
				break;
		}
	},
	
	Init: function() {
		Sender.ClearHTML();
		// set login function
		$('#form-login').submit(function(e) {
			e.preventDefault();
			// add name validation here
			Sender.SendLoginInfo();
		});
	}
};


var init = function() {

	Sender.Init();
	
	Shared.socket.on('emitState', function(stateData) {
		Sender.ProcessState(stateData);
	});
	
};

$(document).ready(init);

