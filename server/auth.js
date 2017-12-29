const { URL } = require('url')
const request = require('request')
const express = require('express')
const auth = express.Router()

module.exports = (clientId, clientSecret) => {
  // --------------------------------
  // ------------- LOGIN ------------
  // --------------------------------

  auth.get('/login', (req, res) => {
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
      signed: true,
      httpOnly: true
    })
    authURL.searchParams.append('state', state)

    // set origin cookie
    let origin = req.query.origin
    res.cookie('origin', origin, { httpOnly: true })

    // redirect the request
    res.redirect(authURL.toString())
  })

  // --------------------------------
  // ------- ACCEPT CALLBACK --------
  // --------------------------------
  auth.get('/callback', (req, res) => {
    const responseURL = new URL(req.protocol + '://' + req.get('host'))
    const origin = req.cookies ? req.cookies['origin'] : null
    res.clearCookie('origin')
    responseURL.pathname = decodeURIComponent(origin) || '/'

    const code = req.query.code
    const state = req.query.state
    const cookieState = req.signedCookies ? req.signedCookies['spotify_state'] : null

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
            signed: true,
            httpOnly: true
          })

          const accessToken = body.access_token

          // set access token to expire in an hour
          res.cookie('access_token', accessToken, {
            expires: new Date(Date.now() + 36e5),
            signed: true,
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

  auth.post('/token', (req, res) => {
    if (req.signedCookies && req.signedCookies['access_token']) {
      res.send(req.signedCookies['access_token'])
    } else if (req.signedCookies && req.signedCookies['refresh_token']) {
      const config = {
        url: 'https://accounts.spotify.com/api/token',
        form: {
          grant_type: 'refresh_token',
          refresh_token: req.signedCookies['refresh_token']
        },
        headers: {
          Authorization: 'Basic ' + (new Buffer(clientId + ':' + clientSecret).toString('base64'))
        },
        json: true
      }

      request.post(config, (err, response, body) => {
        if (err || response.statusCode !== 200) {
          res.sendStatus(404)
        } else {
          const accessToken = body.access_token

          // set access token to expire in an hour
          res.cookie('access_token', accessToken, {
            expires: new Date(Date.now() + 36e5),
            signed: true,
            httpOnly: true
          })
          res.send(accessToken)
        }
      })
    } else {
      res.sendStatus(404)
    }
  })

  // --------------------------------
  // ------------- LOGOUT -----------
  // --------------------------------

  auth.get('/logout', (req, res) => res.clearCookie('access_token').clearCookie('refresh_token').redirect('/'))

  // -------- RETURN ROUTER ---------
  return auth
}
