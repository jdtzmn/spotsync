<template lang="pug">
  el-row(v-loading.fullscreen.lock='!this.device_id')
    el-col(:lg='{ span: 10, offset: 7 }', :sm='{ span: 14, offset: 5 }', :xs='{ span: 22, offset: 1 }')
      h1.header Start streaming
      el-card.card
        div(slot='header') Open Spotify
        el-button(type='success', @click='openSpotify').open
          icon.icon(name='spotify', scale='1.2')
          span.text Open Spotify
      el-card.card
        div(slot='header') Start playing a song
        el-button(type='primary', plain, @click='playDemo')
          icon.icon(name='music', scale='1.2')
          span.text Play a demo song
      el-card.card
        div(slot='header')
          span Spread the love
          el-button.copy(
            type='text',
            v-clipboard:copy='url + room',
            v-clipboard:success='copySuccess'
          ) Copy to clipboard
        span Share this link with friends so they can listen
        el-input(v-model='room', :id='roomInUse ? "invalid" : undefined').link
          template(slot='prepend') {{ url }}
</template>

<script>
export default {
  name: 'Home',
  data () {
    return {
      room: Math.random().toString(36).substr(2, 5).toUpperCase(),
      url: window.location.origin + '/listen/',
      roomInUse: false,
      accessToken: null,
      device_id: null,
      spotify: null,
      state: null
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
          this.$axios.get('/auth/token')
            .then(res => {
              this.createSpotifyInstance(res.data)
              cb(res.data)
            })
            .catch(err => {
              if (err.response.status === 404) {
                this.$router.push('/login')
              }
            })
        }
      })

      // Error handling
      player.on('initialization_error', e => console.error(e))
      player.on('authentication_error', e => console.error(e))
      player.on('account_error', e => console.error(e))
      player.on('playback_error', e => console.error(e))

      // Playback status updates
      player.on('player_state_changed', state => {
        state.timestamp = Date.now()
        this.state = state
        this.emitState()
      })

      // Ready
      player.on('ready', data => {
        console.log('Ready with Device ID', data.device_id)
        this.device_id = data.device_id
        this.switchToPlayer()
      })

      // Connect to the player
      player.connect()
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
    setupStream () {
      this.$socket.emit('stream', this.room, (success) => {
        this.roomInUse = !success
      })
    },
    switchToPlayer () {
      let data = {
        device_ids: [ this.device_id ]
      }

      this.spotify.put('/me/player', data)
        .then()
        .catch((err) => {
          if (err.response.status === 500) {
            setTimeout(this.switchToPlayer, 3000)
          }
        })
    },
    openSpotify () {
      window.location.replace('spotify:')
    },
    playDemo () {
      this.spotify.put('/me/player/play?device_id=' + this.device_id, { uris: ['spotify:track:4RXpgGM7A4Hg7cFBoH5KyF'] })
    },
    copySuccess () {
      this.$message.success('Link copied to clipboard')
    },
    emitState () {
      let state = this.state

      let sharedState = {
        context: state.context,
        // add difference to position
        position: state.position + (Date.now() - state.timestamp),
        track_window: state.track_window
      }

      console.log(sharedState)
      this.$socket.emit('update', sharedState)
    }
  },
  watch: {
    room () {
      this.setupStream()
    }
  },
  sockets: {
    connect () {
      this.setupStream()
    },
    request () {
      this.emitState()
    }
  }
}
</script>

<style scoped>
.header {
  color: white;
  margin-top: 30px;
}

.card {
  margin-top: 20px;
}

.icon {
  position: relative;
  top: 2px;
}

.text {
  font-size: 20px;
  margin-left: 5px;
}

.copy {
  float: right;
  padding: 3px 0;
}

.link {
  margin-top: 20px;
  margin-bottom: 20px;
}
</style>

<style>
  input#invalid {
    border-color: #f56c6c;
  }
</style>
