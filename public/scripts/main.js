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

function draw() {
	senderCtx.beginPath();
	senderCtx.moveTo(prevX, prevY);
	senderCtx.lineTo(currX, currY);
	senderCtx.strokeStyle = "black";
	senderCtx.lineWidth = 3;
	senderCtx.lineJoin = "round";
	senderCtx.lineCap = "round";
	senderCtx.stroke();
	senderCtx.closePath();
}

function triggerJSON(drawJSON) {
	//document.getElementById("debug").innerHTML = drawJSON.type;
	var jType = drawJSON.type;
	var scaledCurrX = drawJSON.currX / wRatio;
	var scaledCurrY = drawJSON.currY / hRatio;
	var scaledPrevX = drawJSON.prevX / wRatio;
	var scaledPrevY = drawJSON.prevY / hRatio;
	if (jType == "down") {
		receiverCtx.beginPath();
		receiverCtx.fillStyle = "black";
		receiverCtx.fillRect(scaledCurrX, scaledCurrY, 2, 2);
		receiverCtx.closePath();
	}
	if (jType == "move") {
		receiverCtx.beginPath();
		receiverCtx.moveTo(scaledPrevX, scaledPrevY);
		receiverCtx.lineTo(scaledCurrX, scaledCurrY);
		receiverCtx.strokeStyle = "black";
		receiverCtx.lineWidth = 3;
		receiverCtx.lineJoin = "round";
		receiverCtx.lineCap = "round";
		receiverCtx.stroke();
		receiverCtx.closePath();
	}
}

function findxy(res, e) {
	if (res == "down") {
		prevX = currX;
		prevY = currY;
		currX = e.clientX - senderCanvas.offsetLeft;
		currY = e.clientY - senderCanvas.offsetTop;
		recJSON.type = "down";
		recJSON.prevX = prevX;
		recJSON.prevY = prevY;
		recJSON.currX = currX;
		recJSON.currY = currY;
		triggerJSON(recJSON);
		drawFlag = true;
		dotFlag = true;
		if (dotFlag) {
			senderCtx.beginPath();
			senderCtx.fillStyle = "black";
			senderCtx.fillRect(currX, currY, 2, 2);
			senderCtx.closePath();
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
			draw();
			recJSON.type = "move";
			recJSON.prevX = prevX;
			recJSON.prevY = prevY;
			recJSON.currX = currX;
			recJSON.currY = currY;
			triggerJSON(recJSON);
		}
}
}
