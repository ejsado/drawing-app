
var Shared = {
	
	socket: io('/demo/draw'),
	
	playerList: [],
	
	AddPlayer: function(playerName) {
		Shared.playerList.push({player: playerName, score: 0});
		return true;
	}
	
};














/*

// initialize variables
var socket = io('/demo/draw');
var prevX = 0,
	currX = 0,
	prevY = 0,
	currY = 0;
var drawFlag = false,
	dotFlag = false;
var senderCanvas = document.getElementById("sender-canvas");
var senderCtx = senderCanvas.getContext("2d");
var receiverCanvas = document.getElementById("reciever-canvas");
var receiverCtx = receiverCanvas.getContext("2d");
var wRatio = senderCanvas.width / receiverCanvas.width;
var hRatio = senderCanvas.height / receiverCanvas.height;

var recJSON = {
	"type": "init",
	"prevX": 0,
	"currX": 0,
	"prevY": 0,
	"currY": 0
};

function setRecJSON(typ, pX, pY, cX, cY) {
	recJSON.type = typ;
	recJSON.prevX = pX;
	recJSON.prevY = pY;
	recJSON.currX = cX;
	recJSON.currY = cY;
}

// event listeners for mouse movement
senderCanvas.addEventListener("mousemove", function(e) {
	findxy("move", e)
}, false);
senderCanvas.addEventListener("mousedown", function(e) {
	findxy("down", e)
}, false);
senderCanvas.addEventListener("mouseup", function(e) {
	findxy("up", e)
}, false);
senderCanvas.addEventListener("mouseout", function(e) {
	findxy("out", e)
}, false);

// draw a segment of a line with these properties
function drawLine(ctx, pX, pY, cX, cY) {
	ctx.beginPath();
	ctx.moveTo(pX, pY);
	ctx.lineTo(cX, cY);
	ctx.strokeStyle = "black";
	ctx.lineWidth = 3;
	ctx.lineJoin = "round";
	ctx.lineCap = "round";
	ctx.stroke();
	ctx.closePath();
}

// draw a small dot
function drawDot(ctx, cX, cY) {
	ctx.beginPath();
	ctx.fillStyle = "black";
	ctx.fillRect(cX, cY, 2, 2);
	ctx.closePath();
}

// get the JSON type
// scale the JSON line
// draw the scaled line
function triggerJSON(drawJSON) {
	//document.getElementById("debug").innerHTML = drawJSON.type;
	var jType = drawJSON.type;
	var scaledCurrX = drawJSON.currX / wRatio;
	var scaledCurrY = drawJSON.currY / hRatio;
	var scaledPrevX = drawJSON.prevX / wRatio;
	var scaledPrevY = drawJSON.prevY / hRatio;
	if (jType == "down") {
		drawDot(receiverCtx, scaledCurrX, scaledCurrY);
	}
	if (jType == "move") {
		drawLine(receiverCtx, scaledPrevX, scaledPrevY, scaledCurrX, scaledCurrY);
	}
}

// detect mouse position in senderCanvas if mouse is down
// draw line
// write mouse position to recJSON
function findxy(res, e) {
	if (res == "down") {
		prevX = currX;
		prevY = currY;
		currX = e.clientX - senderCanvas.offsetLeft;
		currY = e.clientY - senderCanvas.offsetTop;
		setRecJSON("down", prevX, prevY, currX, currY);
		
		//triggerJSON(recJSON);
		socket.emit('draw', recJSON);
		drawFlag = true;
		dotFlag = true;
		if (dotFlag) {
			drawDot(senderCtx, currX, currY);
			dotFlag = false;
		}
	}
	if (res == "up" || res == "out") {
		drawFlag = false;
	}
	if (res == "move") {
		if (drawFlag) {
			prevX = currX;
			prevY = currY;
			currX = e.clientX - senderCanvas.offsetLeft;
			currY = e.clientY - senderCanvas.offsetTop;
			drawLine(senderCtx, prevX, prevY, currX, currY);
			setRecJSON("move", prevX, prevY, currX, currY);
			//triggerJSON(recJSON);
			socket.emit('draw', recJSON);
		}
	}
}
socket.on('draw', function(data) {
	triggerJSON(data);
});



*/
