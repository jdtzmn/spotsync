import { randomBytes } from 'crypto'
import { stringify } from 'querystring'
import { URL } from 'url'
import express from 'express'
import cookieParser from 'cookie-parser'
import { celebrate, Joi, errors } from 'celebrate'
import axios from 'axios'

import { cookieSecret, scopes, clientId, clientSecret, redirectUri } from '../config'
const authorizationUrl = 'https://accounts.spotify.com/api/token'
const basicAuthorization = `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`

const router = express.Router()
router.use(cookieParser(cookieSecret))
router.use(errors())

/* ==================== */
/* ====== HELPERS ===== */
/* ==================== */

// Generate secure state token
const generateState = () => randomBytes(6).toString('hex')

// Request authorization_code and refresh_token

const requestTokens = (code: string) => {
  const data = stringify({
    grant_type: 'authorization_code',
    code,
    redirect_uri: redirectUri
  })

  return axios.post(authorizationUrl, data, {
    headers: {
      Authorization: basicAuthorization
    }
  }).then(((response) => response.data))
}

/* ==================== */
/* ====== ROUTES ====== */
/* ==================== */

router.get('/login', (req, res) => {
  // Set origin cookie to redirect back to once the authorization flow is complete
  const { origin } = req.query
  if (origin) {
    res.cookie('origin', origin, { httpOnly: true })
  }

  // Generate state and set in cookie
  const state = generateState()
  res.cookie('spotify_state', state, {
    expires: new Date(Date.now() + 6e4), // a minute
    signed: true,
    httpOnly: true
  })

  // Send Spotify authorization request
  res.redirect('https://accounts.spotify.com/authorize' +
    '?response_type=code' +
    `&client_id=${clientId}` +
    `&scope=${encodeURIComponent(scopes)}` +
    `&state=${state}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}`
  )
})

router.get('/redirect', celebrate({
  query: {
    code: Joi.string().required(),
    state: Joi.string().required()
  },
  cookies: {
    origin: Joi.string(),
  },
  signedCookies: {
    spotify_state: Joi.string().required(),
    access_token: Joi.string(),
    refresh_token: Joi.string()
  }
}), async (req, res) => {
  // Verify that the states match
  if (req.query.state !== req.signedCookies.spotify_state) {
    return res.status(400).send('states do not match')
  }
  res.clearCookie('spotify_state')

  // Request authorization code and refresh token
  let tokens

  try {
    tokens = await requestTokens(req.query.code)
  } catch (err) {
    return res.status(400)
  }

  // Store tokens in cookies
  const { access_token, refresh_token } = tokens

  // set access token to expire in an hour
  res.cookie('access_token', access_token, {
    expires: new Date(Date.now() + 36e5),
    signed: true,
    httpOnly: true
  })

  // set refresh token to expire in 2 weeks
  res.cookie('refresh_token', refresh_token, {
    expires: new Date(Date.now() + 12096e5),
    signed: true,
    httpOnly: true
  })

  // Redirect to origin or app url
  const responseURL = new URL(`${req.protocol}://${req.get('host')}/find`)

  if (req.cookies && req.cookies.origin) {
    responseURL.pathname = decodeURIComponent(req.cookies.origin)
    res.clearCookie('origin')
  }

  res.redirect(responseURL)
})

export default router
