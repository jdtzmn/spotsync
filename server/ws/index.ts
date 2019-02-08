import Spotify from './Spotify'
import Room from './Room'
import { clientId, clientSecret } from '../config'

// create a new spotify instance
const spotify = new Spotify(clientId, clientSecret)
const rooms: {
  [id: string]: Room
} = {}

const handleIO = (io) => {
  // Room middleware
  io.use((socket, next) => {
    const { query } = socket.handshake
    const { room: roomString } = query

    if (!roomString) return next(new Error('invalid room'))

    // Check that there is a match
    const matches = roomString.match(/[a-z,A-Z]{6}/g)

    if (matches && matches.length === 1) {
      const roomId = matches[0]

      // create the room
      rooms[roomId] = new Room(roomId, spotify)

      // have the socket join the room
      socket.join(roomId)
      socket.room = roomId

      next()
    } else {
      next(new Error('invalid room'))
    }
  })

  io.on('connection', (socket) => {
    // Add to queue event
    socket.on('queue', async (songUri: string) => {
      const room = rooms[socket.room]

      await room.addToQueue(songUri)
      socket.to(socket.room).emit('queue', songUri)
    })

    socket.on('status', () => {
      const room = rooms[socket.room]
      socket.emit('status', room.status)
    })
  })
}

export default handleIO
