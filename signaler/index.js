const io = require('socket.io')()
io.on('connection', function (socket) {
    socket.on('handshake', function(data) {
        socket.broadcast.emit('handshake', data)
    })
    socket.on('icecandidate', function(data){
        socket.broadcast.emit('icecandidate', data)
    })
})
io.listen(3000)
