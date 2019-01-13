
const init = socket => {
  console.log('connection id = ', socket.io)

  socket.on('public', data => {
    socket.broadcast.emit('public', data)
  })

  socket.on('disconnect', socket => {
    console.log('disconnect id = ', socket.io);
  })
}

module.exports.init = socketio => {
  const io = socketio
  io.on('connection', socket => {
    init(socket)
  })
}