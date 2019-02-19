import express from 'express'
import { Server } from 'http'
import next from 'next'
import bodyParser from 'body-parser'
import socket from 'socket.io'

import routes from './routes'
import authRoutes from './auth'
import handleSockets from './ws'

const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'
const nextApp = next({ dev })
const routeHandler = routes.getRequestHandler(nextApp)

nextApp.prepare()
  .then(() => {
    const app = express()
    const server = new Server(app)

    /* ==================== */
    /* ====== SOCKETS ===== */
    /* ==================== */

    const io = socket(server)
    handleSockets(io)

    /* ==================== */
    /* ====== ROUTES ====== */
    /* ==================== */

    app.use(bodyParser.json())
    app.use('/auth', authRoutes)
    app.use(routeHandler)

    server.listen(port, (err) => {
      if (err) throw err
      // tslint:disable no-console
      console.log(`> Ready on http://localhost:${port}`)
      // tslint:enable no-console
    })
  })
