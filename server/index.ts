import express from 'express'
import { Server } from 'http'
import next from 'next'
import bodyParser from 'body-parser'

import authRoutes from './auth'
import handleSockets from './ws'

const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'
const nextApp = next({ dev })
const handle = nextApp.getRequestHandler()

nextApp.prepare()
  .then(() => {
    const app = express()
    const server = new Server(app)

    /* ==================== */
    /* ====== SOCKETS ===== */
    /* ==================== */

    const io = require('socket.io')(server)
    handleSockets(io)

    /* ==================== */
    /* ====== ROUTES ====== */
    /* ==================== */

    app.use(bodyParser.json())

    app.use('/auth', authRoutes)

    app.get('*', (req, res) => {
      return handle(req, res)
    })

    server.listen(port, (err) => {
      if (err) throw err
      // tslint:disable no-console
      console.log(`> Ready on http://localhost:${port}`)
      // tslint:enable no-console
    })
  })
