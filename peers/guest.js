// create remote peer instance
const remoteConnection = new RTCPeerConnection()
let receiveChannel = null;

// setup listener
remoteConnection.ondatachannel = receiveChannelCallback

function receiveChannelCallback(event) {
	receiveChannel = event.channel
	receiveChannel.onmessage = e => console.log("[receiveChannel data]:" + e.data)
	receiveChannel.onopen = _e => console.log("[receiveChannel status]: " + receiveChannel.readyState)
	receiveChannel.onclose = _e => console.log("[receiveChannel status]: " + receiveChannel.readyState)
}

remoteConnection.onicecandidate = e => {
	if(!e.candidate) return
	socket.emit("icecandidate", e.candidate)
}

var socket = io.connect('http://localhost:3000')

socket.on('handshake', async function (data) {
	if(data.type === "offer"){
		await remoteConnection.setRemoteDescription(data)
		const answer = await remoteConnection.createAnswer()
		await remoteConnection.setLocalDescription(answer)
		socket.emit("handshake", answer)
	}
})

socket.on('icecandidate', function(data) {
	if(data.candidate){
		remoteConnection.addIceCandidate(data).catch(handleAddCandidateError)
	}
})

function handleAddCandidateError() {
	console.log("onicecandidate failed")
}