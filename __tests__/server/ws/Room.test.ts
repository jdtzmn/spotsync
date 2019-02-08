/**
 * @jest-environment node
 */

import Room from 'server/ws/Room'
import Spotify from 'server/ws/Spotify'
import { randomBytes } from 'crypto'
import { clientId, clientSecret } from 'server/config'

describe('Room', () => {
  let spotify
  beforeAll(() => {
    spotify = new Spotify(clientId, clientSecret)
    return spotify.setup()
  })

  let room: Room
  beforeEach(() => {
    const token = randomBytes(2).toString('hex')
    room = new Room(token, spotify)
  })

  it('should initialize with a token and an api parameter', () => {
    const token = randomBytes(2).toString('hex')
    const testRoom = new Room(token, spotify)
    expect(testRoom).toBeDefined()
  })

  it('should be able to add songs to queue', () => {
    // Bohemian Rhapsody by Queen
    const song = '7tFiyTwD0nx5a1eklYtX2J'
    return room.addToQueue(song)
      .then(() => {
        expect(room.queue.filter((track) => track.id === song)).toHaveLength(1)
      })
  })

  it('should throw an error when a song does not exist', () => {
    const song = 'badinput'
    return room.addToQueue(song)
      .catch((err) => {
        expect(err.response.data.error.status).toBe(400)
      })
  })

  it('should get the status when there are no songs in the queue', async () => {
    expect(room.status.currentTrack).toBeNull()
    expect(room.status.positionMs).toBe(0)
    expect(room.status.queue).toHaveLength(0)
  })

  it('should get the status with songs in the queue', async () => {
    // Mock Date.now()
    const now = Date.now()
    Date.now = jest.fn().mockReturnValue(now)

    // Add some sample songs
    const songs = ['7tFiyTwD0nx5a1eklYtX2J', '4RXpgGM7A4Hg7cFBoH5KyF']
    for (const song of songs) {
      await room.addToQueue(song)
    }

    // At 0 ms after adding to the queue, make sure the status is correct
    let { status } = room
    expect(status.currentTrack.id).toBe('7tFiyTwD0nx5a1eklYtX2J')
    expect(status.positionMs).toBeLessThan(10)
    expect(status.queue).toHaveLength(1)
    expect(status.queue).toMatchSnapshot()

    // Update mock
    Date.now = jest.fn().mockReturnValue(now + 36e4) // 6 minutes

    // At 6 minutes, make sure the status is correct
    status = room.status
    expect(status.currentTrack.id).toBe('4RXpgGM7A4Hg7cFBoH5KyF')
    expect(status.positionMs).toBe(5680)
    expect(status.queue).toHaveLength(0)
    expect(status.queue).toMatchSnapshot()

    // Update mock
    Date.now = jest.fn().mockReturnValue(now + 72e4) // 12 minutes

    // At 12 minutes, make sure the status is correct
    status = room.status
    expect(status.positionMs).toBe(0)
    expect(status.currentTrack).toBeNull()
    expect(status.queue).toHaveLength(0)
  })
})
