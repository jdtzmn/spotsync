const path = require('path')
const express = require('express')
const app = express()
const server = require('http').Server(app)
const cookieParser = require('cookie-parser')

// security middleware
const RateLimit = require('express-rate-limit')
const helmet = require('helmet')
const csrf = require('csurf')

// ================================
// ------------ TOKENS ------------
// ================================
let tokens = {}
try {
  tokens = require('./secrets.js')
} catch (e) {
  const {
    SPOTIFY_CLIENT_ID,
    SPOTIFY_CLIENT_SECRET,
    COOKIES_SECRET
  } = process.env

  if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET || !COOKIES_SECRET) {
    throw new Error('client_id, client_secret, and cookies_secret are required')
  }
}

const clientId = process.env.SPOTIFY_CLIENT_ID || tokens.client_id
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET || tokens.client_secret
const cookieSecret = process.env.COOKIES_SECRET || tokens.cookies

// ================================
// ---------- MIDDLEWARE ----------
// ================================
app.use(helmet({
  frameguard: { action: 'deny' }
}))
app.use(cookieParser(cookieSecret))
app.use(express.static(path.join(__dirname, '../dist')))
// enable csrf protection if in production
if (process.env.NODE_ENV === 'production') {
  app.use(csrf({ cookie: true }))
}

// --------------------------------
// -------- RATE LIMITING  --------
// --------------------------------

// enable reverse proxy if in production
if (process.env.NODE_ENV === 'production') {
  app.enable('trust proxy')
}

const limiter = new RateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100,
  delayMs: 0
})

app.use(limiter)

// ================================
// ------------ ROUTES ------------
// ================================

  // --------------------------------
  // -------- AUTHENTICATION  -------
  // --------------------------------
const authRoutes = require('./auth.js')(clientId, clientSecret)
app.use('/auth', authRoutes)

  // --------------------------------
  // ------- SERVE BUILT FILES ------
  // --------------------------------

app.get('*', (req, res) => {
  if (req.csrfToken) {
    res.cookie('XSRF-TOKEN', req.csrfToken())
  }
  res.sendFile(path.join(__dirname, '../dist/index.html'))
})

// ================================
// ---------- WEB SOCKETS ---------
// ================================

require('./sockets.js')(server, cookieSecret)

// --------------------------------
// ------------ LISTEN  -----------
// --------------------------------
server.listen(process.env.PORT || 3000, () => {
  console.log('Listening on port:', server.address().port)
})
