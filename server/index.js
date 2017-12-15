const app = require('express')()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const cookieParser = require('cookie-parser')
const { URL } = require('url')
const request = require('request')

// define middlewares
app.use(cookieParser())

// spotify id and secret
const clientId = process.env.SPOTIFY_CLIENT_ID
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET

// --------------------------------
// ------------- LOGIN ------------
// --------------------------------

app.get('/auth/login', (req, res) => {
  const authURL = new URL('https://accounts.spotify.com/authorize')
  authURL.searchParams.append('client_id', clientId)
  authURL.searchParams.append('response_type', 'code')

  // generate scopes
  const scopes = ['streaming', 'user-read-birthdate', 'user-read-email', 'user-read-private', 'user-read-playback-state', 'user-modify-playback-state']
  authURL.searchParams.append('scope', scopes.join(' '))

  // generate redirect_uri
  let redirectURL = new URL(req.protocol + '://' + req.get('host'))
  redirectURL.pathname = '/auth/callback'
  authURL.searchParams.append('redirect_uri', redirectURL.toString())

  // generate and set state token
  let state = (Math.random().toString(36) + '00000000000000000').slice(2, 12)
  res.cookie('spotify_state', state, {
    expires: new Date(Date.now() + 1e4),
    httpOnly: true
  })
  authURL.searchParams.append('state', state)

  // redirect the request
  res.redirect(authURL.toString())
})

// --------------------------------
// ------- ACCEPT CALLBACK --------
// --------------------------------
app.get('/auth/callback', (req, res) => {
  const responseURL = new URL(req.protocol + '://' + req.get('host'))
  responseURL.pathname = '/'

  const code = req.query.code
  const state = req.query.state
  const cookieState = req.cookies ? req.cookies['spotify_state'] : null

  if (state && state === cookieState) {
    const redirectURL = new URL(req.protocol + '://' + req.get('host'))
    redirectURL.pathname = '/auth/callback'
    const redirectURI = redirectURL.toString()

    const config = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: redirectURI
      },
      headers: {
        Authorization: 'Basic ' + (new Buffer(clientId + ':' + clientSecret).toString('base64'))
      },
      json: true
    }

    request.post(config, (err, response, body) => {
      if (err || response.statusCode !== 200) {
        responseURL.searchParams.append('error', 'invalid_token')
        res.redirect(responseURL.toString())
      } else {
        // set refresh token to expire in 2 weeks
        const refreshToken = body.refresh_token
        res.cookie('refresh_token', refreshToken, {
          expires: new Date(Date.now() + 12096e5),
          httpOnly: true
        })

        const accessToken = body.access_token

        res.cookie('access_token', accessToken, {
          expires: new Date(Date.now() + 36e5),
          httpOnly: true
        })
        res.redirect(responseURL.toString())
      }
    })
  } else {
    responseURL.searchParams.append('error', 'state_mismatch')
    res.redirect(responseURL.toString())
  }
})

// --------------------------------
// ---------- SEND TOKEN ----------
// --------------------------------

app.get('/auth/token', (req, res) => {
  if (req.cookies && req.cookies['access_token']) {
    res.send(req.cookies['access_token'])
  } else {
    res.sendStatus(404)
  }
})

// --------------------------------
// --------- REFRESH TOKEN --------
// --------------------------------

app.get('/auth/refresh', (req, res) => {
  const config = {
    url: 'https://accounts.spotify.com/api/token',
    form: {
      grant_type: 'refresh_token',
      refresh_token: req.query.token
    },
    headers: {
      Authorization: 'Basic ' + (new Buffer(clientId + ':' + clientSecret).toString('base64'))
    },
    json: true
  }

  const responseURL = new URL(req.protocol + '://' + req.get('host'))
  responseURL.pathname = '/login'

  request.post(config, (err, response, body) => {
    if (err || response.statusCode !== 200) {
      responseURL.searchParams.append('error', 'invalid_token')
      res.redirect(responseURL.toString())
    } else {
      const accessToken = body.access_token

      res.cookie('access_token', accessToken, { httpOnly: true })
      res.redirect(responseURL.toString())
    }
  })
})

// --------------------------------
// ------------- LOGOUT -----------
// --------------------------------

app.get('/auth/logout', (req, res) => res.clearCookie('access_token').clearCookie('refresh_token').redirect('/'))

// ================================
// ---------- WEB SOCKETS ---------
// ================================

io.on('connection', (socket) => {
  socket.on('stream', (room, cb) => {
    const rooms = Object.keys(io.sockets.adapter.rooms)

    // test to see if room exists and formatted correctly
    if (rooms.includes(room) || room.length === 0 || room.indexOf(' ') !== -1) {
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

  socket.on('update', status => io.sockets.in(socket.room).emit('update', status))

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

server.listen(3000)
