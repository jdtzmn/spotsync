// Register environment variables
import { config } from 'dotenv'
config()

export const cookieSecret = process.env.COOKIE_SECRET
export const scopes = 'user-modify-playback-state user-read-currently-playing user-read-playback-state'
export const clientId = process.env.SPOTIFY_CLIENT_ID
export const clientSecret = process.env.SPOTIFY_CLIENT_SECRET
export const redirectUri = process.env.SPOTIFY_REDIRECT_URI || 'http://localhost:3000/auth/redirect'
