// create local peer instance
const localConnection = new RTCPeerConnection()

// create data channel and setup listener
const sendChannel = localConnection.createDataChannel("sendChannel")
sendChannel.onmessage = handleOnMessage
sendChannel.onopen = handleSendChannelStatusChange
sendChannel.onclose = handleSendChannelStatusChange

function handleOnMessage(event) {
	console.log("[receiveChannel data]:" + event.data)
}

function handleSendChannelStatusChange(event) {
	const sendChannel = event.target
	console.log("[sendChannel status]: " + sendChannel.readyState)
}

localConnection.onicecandidate = e => {
	if(!e.candidate) return
	socket.emit("icecandidate", e.candidate)
}

// send offer as initiator
localConnection.createOffer()
	.then(offer => {
		localConnection.setLocalDescription(offer)
		socket.emit("handshake", offer)
	})
	.catch(handleCreateDescriptionError)

function handleCreateDescriptionError(error) {
	console.log(error);
}

// setup signaler connection
var socket = io.connect('http://localhost:3000')
socket.on('handshake', function (data) {
	if(data.type === "answer") {
		localConnection.setRemoteDescription(data)
	}
})

socket.on('icecandidate', function(data){
	if(data.candidate){
		localConnection.addIceCandidate(data).catch(handleAddCandidateError)	
	}
})

function handleAddCandidateError() {
	console.log("onicecandidate failed")
}

// emit sample data periodically
setInterval(emit, 1000)

function emit() {
	sendChannel.send(Date.now())
}