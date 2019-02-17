import { randomBytes } from 'crypto'
import { stringify } from 'querystring'
import { URL } from 'url'
import express from 'express'
import cookieParser from 'cookie-parser'
import { celebrate, Joi, errors } from 'celebrate'
import axios from 'axios'

/* ==================== */
/* ======= SETUP ====== */
/* ==================== */

// Config
import { cookieSecret, scopes, clientId, clientSecret, redirectUri } from '../config'
const authorizationUrl = 'https://accounts.spotify.com/api/token'
const basicAuthorization = `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`

// Router
const router = express.Router()
router.use(errors())
router.use(cookieParser(cookieSecret))

/* ==================== */
/* ====== HELPERS ===== */
/* ==================== */

// Generate secure state token
const generateState = () => randomBytes(6).toString('hex')

// Request authorization_code and refresh_token
const requestTokens = (code: string, type: string = 'authorization_code') => {
  const data = {
    grant_type: type,
    redirect_uri: redirectUri,
    code: undefined,
    refresh_token: undefined
  }

  switch (type) {
    case 'refresh_token':
      data.refresh_token = code
      break
    default:
      data.code = code
  }

  const urlEncodedData = stringify(data)

  return axios.post(authorizationUrl, urlEncodedData, {
    headers: {
      Authorization: basicAuthorization
    }
  }).then(((response) => response.data))
}

const constructResponseUrl = (req: any, origin?: string) => {
  // Redirect to origin or app url
  const responseURL = new URL(`${req.protocol}://${req.get('host')}/find`)
  if (origin) {
    responseURL.pathname = decodeURIComponent(origin)
  }

  return responseURL
}

// Handle initial login request (when there is no request token stored)
const handleLogin = (req, res) => {
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
}

// Handle a refresh of the access token using a stored refresh token
const refreshToken = async (req, res, token: string) => {
  // Define origin to redirect back to once the token is refreshed
  const { origin } = req.query

  let accessToken
  try {
    const data = await requestTokens(token, 'refresh_token')
    accessToken = data.access_token
  } catch (err) {
    return res.sendStatus(400)
  }

  // Set access token to expire in an hour
  res.cookie('access_token', accessToken, {
    expires: new Date(Date.now() + 36e5),
    signed: true,
    httpOnly: true
  })

  // Redirect to origin or app url
  const responseURL = constructResponseUrl(req, origin)
  res.redirect(responseURL)
}

/* ==================== */
/* ====== ROUTES ====== */
/* ==================== */

router.get('/login', celebrate({
  signedCookies: Joi.object({
    access_token: Joi.string(),
    refresh_token: Joi.string()
  }).unknown()
}), (req, res) => {
  const { signedCookies: { access_token, refresh_token } } = req

  // Go to the response url if both access_token and refresh_token exist
  if (access_token && refresh_token) {
    const { origin } = req.query
    const responseURL = constructResponseUrl(req, origin)
    res.redirect(responseURL)
  // If there is a refresh_token, but not an access_token, refresh the token
  } else if (refresh_token) {
    return refreshToken(req, res, refresh_token)
  } else {
  // Otherwise handle an initial login
    return handleLogin(req, res)
  }
})

router.get('/redirect', celebrate({
  query: {
    code: Joi.string().required(),
    state: Joi.string().required()
  },
  cookies: Joi.object({
    origin: Joi.string(),
  }).unknown(),
  signedCookies: Joi.object({
    spotify_state: Joi.string().required()
  }).unknown()
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
  const origin = req.cookies && req.cookies.origin
  const responseURL = constructResponseUrl(req, origin)

  // Clear the origin cookie
  if (origin) res.clearCookie('origin')

  // Redirect to the response URL
  res.redirect(responseURL)
})

router.get('/logout', (_, res) => {
  // clear user data
  res.clearCookie('access_token')
  res.clearCookie('refresh_token')

  res.redirect('/')
})

export default router
