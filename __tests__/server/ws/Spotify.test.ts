/**
 * @jest-environment node
 */

import Spotify from 'server/ws/Spotify'
import { clientId, clientSecret } from 'server/config'

describe('Spotify', () => {
  let spotify: Spotify
  beforeEach(() => {
    spotify = new Spotify(clientId, clientSecret)
  })

  it('should initialize', () => {
    expect(spotify).toBeDefined()
  })

  it('should setup and set isSetup property', () => {
    expect(spotify.isSetup).toBeFalsy()
    return spotify.setup()
      .then(() => {
        expect(spotify.isSetup).toBeTruthy()
      })
  })

  it('should return 400 on invalid track', () => {
    return spotify.getTrack('invalid_uri')
      .catch((err) => {
        expect(err.response.status).toBe(400)
      })
  })

  it('should return correct spotify track data on request', async () => {
    // Hey Brother by Avicii
    return spotify.getTrack('7tFiyTwD0nx5a1eklYtX2J')
      .then((trackData) => expect(trackData).toMatchSnapshot())
  })
})
