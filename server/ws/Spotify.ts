import axios, { AxiosInstance, AxiosError, AxiosPromise } from 'axios'
import { stringify as urlEncode } from 'querystring'

export default class Spotify {
  private readonly clientId: string
  private readonly clientSecret: string
  private instance: AxiosInstance = null

  get isSetup () {
    return this.instance !== null
  }

  constructor(clientId: string, clientSecret: string) {
    this.clientId = clientId
    this.clientSecret = clientSecret
  }

  public setup () {
    return this.requestAccessToken()
      .then((accessToken) => {
        this.instance = axios.create({
          baseURL: 'https://api.spotify.com/v1/',
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        })
      })
  }

  public getTrack (uri: string) {
    const request = () => this.instance.get(`/tracks/${uri}`)
    return this.wrapRequest(request)
  }

  private requestAccessToken () {
    const body = { grant_type: 'client_credentials' }
    const authorization = `Basic ${Buffer.from(this.clientId + ':' + this.clientSecret).toString('base64')}`
    return axios.post('https://accounts.spotify.com/api/token', urlEncode(body), {
      headers: {
        Authorization: authorization
      }
    }).then((response) => response.data.access_token)
  }

  private async setupIfNotAlready () {
    if (!this.isSetup) await this.setup()
  }

  private async wrapRequest (request: () => AxiosPromise) {
    await this.setupIfNotAlready()

    try {
      const { data } = await request()
      return data
    } catch (error) {
      const { response: { status } } = error as AxiosError

      if (status === 401) {
        await this.setup()
        return this.wrapRequest(request)
      } else {
        throw error
      }
    }
  }
}
