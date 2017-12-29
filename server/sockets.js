const socketIO = require('socket.io')
const RateLimit = require('./socket-rate-limit.js')
const cookieParser = require('cookie-parser')
const request = require('request')

module.exports = (server, cookieSecret) => {
  // --------- START SERVER ---------
  const io = socketIO(server)

  // --------- AUTHORIZATION --------
  io.use((socket, next) => cookieParser(cookieSecret)(socket.handshake, null, next))
  io.use((socket, next) => {
    const accessToken = socket.handshake.signedCookies.access_token

    request.get('https://api.spotify.com/v1/browse/categories', (err, response, body) => {
      if (!err && response.statusCode === 200) {
        next()
      } else {
        next(new Error('Unauthorized'))
      }
    }).auth(null, null, true, accessToken)
  })

  // --------------------------------
  // ---------- RATE LIMIT ----------
  // --------------------------------
  const limiter = RateLimit({
    windowMs: 12e4, // 2 minutes
    max: 50, // 50 requests, then stop receiving events
    disconnectAfter: 70, // disconnect socket after 70 requests
    emit: true // emit a 429 event
  })

  io.use(limiter)

  // ---------- CONNECTION ----------
  io.on('connection', (socket) => {
    // --------------------------------
    // --------- START STREAM ---------
    // --------------------------------

    socket.on('stream', (room, cb) => {
      const roomObj = io.sockets.adapter.rooms[room]
      const socketsInRoom = roomObj ? Object.keys(roomObj.sockets) : []
      const roomInUse = socketsInRoom.find(socket => io.sockets.connected[socket].room)

      // test to see if room exists and formatted correctly
      if (roomInUse || room.length === 0 || room.indexOf(' ') !== -1) {
        delete socket.room
        if (cb) cb(false)
      } else {
        // leave previous rooms
        const socketRooms = Object.keys(socket.rooms).slice(1)
        socketRooms.forEach(room => socket.leave(room))

        // join new room
        socket.join(room)
        socket.room = room
        if (cb) cb(true)
      }
    })

    // --------------------------------
    // --------- UPDATE STREAM --------
    // --------------------------------

    socket.on('update', status => io.sockets.in(socket.room).emit('update', status))

    // --------------------------------
    // ------- REQUEST AN UPDATE ------
    // --------------------------------

    socket.on('request', (cb) => {
      // rate limit requests to 4 requests per 7 seconds
      if (socket.lastRequest && Date.now() - socket.lastRequest < 7000) {
        if (socket.requestCount && socket.requestCount++ > 4) {
          cb(true)
        } else {
          io.sockets.in(Object.keys(socket.rooms)[1]).emit('request')
        }
      } else {
        io.sockets.in(Object.keys(socket.rooms)[1]).emit('request')
        socket.requestCount = 0
      }

      socket.lastRequest = Date.now()
    })

    // --------------------------------
    // ------ LISTEN TO A STREAM ------
    // --------------------------------

    socket.on('listen', (room, cb) => {
      const rooms = Object.keys(io.sockets.adapter.rooms)
      // leave previous rooms
      const socketRooms = Object.keys(socket.rooms).slice(1)
      socketRooms.forEach(room => socket.leave(room))

      // make sure room exists
      if (rooms.includes(room)) {
        // join new room
        socket.join(room)
        io.sockets.in(room).emit('request')

        // callback successful
        if (cb) cb(true)
      } else {
        // callback unsuccessful
        if (cb) cb(false)
      }
    })
  })
}
