<template lang="pug">
  el-row(v-loading.fullscreen.lock='!this.device_id')
    el-col(:md='{ span: 10, offset: 7 }', :sm='{ span: 18, offset: 6 }', :xs='{ span: 22, offset: 1 }').main
      h1.header Currently listening to
      el-row(:gutter='20')
        el-col(:sm='6', :xs='8')
          img(:src='track.image', width='100%').img
        el-col(:sm='18', :xs='16')
          .name {{ track.name }}
          .artist {{ track.artists }}
      el-button(
        v-if='track.uri',
        type='warning',
        plain,
        round,
        @click='resync'
      ).resync Out of sync? Click here.
</template>

<script>
export default {
  name: 'Listen',
  data () {
    return {
      track: {
        name: 'Track Name',
        uri: '',
        image: '',
        artists: 'Artist',
        position: 0,
        paused: false,
        timestamp: Date.now()
      },
      offset: {
        list: [],
        amount: null
      },
      timeout: null,
      device_id: null,
      player: null,
      spotify: null
    }
  },
  created () {
    let spotifyPlayer = document.createElement('script')
    spotifyPlayer.setAttribute('src', '//sdk.scdn.co/spotify-player.js')
    document.head.appendChild(spotifyPlayer)

    window.onSpotifyPlayerAPIReady = this.playerReady
  },
  methods: {
    playerReady () {
      const player = new window.Spotify.Player({
        name: 'Spotsync',
        getOAuthToken: cb => {
          this.$axios.post('/auth/token')
            .then(res => {
              this.createSpotifyInstance(res.data)
              cb(res.data)
            })
            .catch(err => {
              if (err.response.status === 404) {
                this.$router.push({ path: '/login', query: { origin: window.location.pathname } })
              }
            })
        }
      })

      // Error handling
      player.on('initialization_error', e => this.$message.error(e.message))
      player.on('authentication_error', e => {
        if (e.message === 'Authentication failed') {
          window.location.replace('/auth/login?origin=' + window.location.pathname)
        } else {
          this.$message.error(e.message)
        }
      })
      player.on('account_error', e => {
        this.$alert('Spotify requires users to have premium.', 'Premium Required', {
          type: 'error',
          showClose: false,
          showConfirmButton: false,
          closeOnClickModal: false,
          closeOnPressEscape: false
        })
      })
      player.on('playback_error', e => this.$message.error(e.message))

      // Ready
      player.on('ready', data => {
        console.log('Ready with Device ID', data.device_id)
        this.device_id = data.device_id

        // start listening
        this.$socket.emit('listen', this.$route.params.room, success => {
          if (!success) this.$router.push('/notfound')
        })
      })

      // Connect to the player
      player.connect()
      this.player = player
    },
    createSpotifyInstance (accessToken) {
      this.accessToken = accessToken
      this.spotify = this.$axios.create({
        baseURL: 'https://api.spotify.com/v1/',
        headers: {
          Authorization: 'Bearer ' + accessToken
        }
      })
    },
    sync () {
      if (!this.offset.amount) {
        this.calculateOffset()
      } else {
        this.player.seek(this.track.position + Date.now() - this.track.timestamp + this.offset.amount)
          .then(() => this.player.getCurrentState()
            .then(state => {
              if (state) {
                let shouldBeAt = this.track.position + Date.now() - this.track.timestamp
                let isCurrentlyAt = state.position
                let offset = isCurrentlyAt - shouldBeAt
                this.player.seek(state.position - offset + this.offset.amount)
              } else {
                this.sync()
              }
            })
          )
      }
    },
    calculateOffset () {
      let previousOffset = this.offset.list[this.offset.list.length - 1] || 0
      this.player.seek(this.track.position + Date.now() - this.track.timestamp)
        .then(() => this.player.getCurrentState()
          .then(state => {
            if (state) {
              let shouldBeAt = this.track.position + Date.now() - this.track.timestamp
              let isCurrentlyAt = state.position
              let offset = isCurrentlyAt - shouldBeAt
              this.offset.list.push(-offset)
              if (Math.abs(offset) < Math.abs(previousOffset) / 3) {
                this.offset.list = [ -offset ]
              }
              if (this.offset.list.length === 4) {
                this.offset.amount = this.offset.list.reduce((a, c) => a + c) / 4
              }
              console.log(this.offset.amount)
              console.log(this.offset.list)
              setTimeout(this.resync, Math.max(Math.min(Math.abs(previousOffset), 1500), 100))
            } else {
              this.calculateOffset()
            }
          })
        )
    },
    resync () {
      this.$socket.emit('request', (tooMany) => {
        if (tooMany) {
          this.$message.error('Too many requests. You will be synced in 7 seconds automatically.')
          if (!this.timeout) this.timeout = setTimeout(this.resync, 7000)
        } else if (this.timeout) {
          this.timeout = null
        }
      })
    }
  },
  sockets: {
    update (status) {
      if (status.paused) {
        this.player.pause()
        this.track.paused = true
      } else {
        let playingSong = this.track.uri === status.track_window.current_track.uri

        // set track data
        this.track.name = status.track_window.current_track.name
        this.track.artists = status.track_window.current_track.artists.map(obj => obj.name).join(', ')
        this.track.image = status.track_window.current_track.album.images[0].url
        this.track.uri = status.track_window.current_track.uri
        this.track.position = status.position
        this.track.timestamp = Date.now()

        // resume playing if paused
        if (this.track.paused) {
          this.player.resume()
          this.track.paused = false
        }

        // seek if playing song, otherwise start playing the song
        if (playingSong) {
          this.sync()
        } else {
          this.spotify.put('/me/player/play?device_id=' + this.device_id, { uris: [ this.track.uri ] })
            .then(this.sync)
        }
      }
    },
    toomanyrequests () {
      this.$message.error('Too many requests. Please try again later.')
    },
    disconnect () {
      this.$alert('You are temporarily suspended', 'Too many requests', {
        type: 'error',
        showClose: false,
        showConfirmButton: false,
        closeOnClickModal: false,
        closeOnPressEscape: false
      })
    }
  }
}
</script>

<style scoped>
.main {
  margin-top: 10vh;
}

.header { color: rgb(240, 240, 240); }

.img {
  border-radius: 10px;
  box-shadow: 0px 0.5px 0.5px;
}

.name {
  font-size: 40px;
  margin-top: 10px;
  margin-bottom: 10px;
}

.artist {
  color: rgb(40, 40, 40);
  font-size: 20px;
}

.resync {
  min-width: 50%;
  margin-top: 20px;
  margin-bottom: 20px;
}
</style>
