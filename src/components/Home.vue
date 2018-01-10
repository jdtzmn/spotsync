<template lang="pug">
  el-row(v-loading.fullscreen.lock='!this.device_id')
    el-col(:lg='{ span: 10, offset: 7 }', :sm='{ span: 14, offset: 5 }', :xs='{ span: 24 }')
      h1.header Start streaming
      el-card.card
        div(slot='header')
          span Open Spotify
          el-button.copy(
            type='text',
            @click="openSpotify('web')"
          ) Open Web App
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
        span Share this link with friends so they can listen with you
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
      lastChanged: Date.now(),
      roomInUse: false,
      accessToken: null,
      device_id: null,
      player: null,
      switchedToPlayer: false,
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
          this.$axios.post('/auth/token')
            .then(res => {
              this.createSpotifyInstance(res.data)
              cb(res.data)
            })
            .catch(err => {
              if (err.response.status === 404 || err.response.status === 403) {
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

      // Playback status updates
      player.on('player_state_changed', state => {
        // emit the change
        state.timestamp = Date.now()
        this.emitState(state)
        this.state = state
      })

      // Ready
      player.on('ready', data => {
        console.log('Ready with Device ID', data.device_id)
        this.device_id = data.device_id
        this.switchToPlayer()
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
    setupStream () {
      this.$socket.emit('stream', this.room, (success) => {
        this.roomInUse = !success
      })
    },
    switchToPlayer () {
      let data = {
        device_ids: [ this.device_id ],
        play: true
      }

      this.spotify.put('/me/player', data)
    },
    openSpotify (type) {
      if (type === 'web') {
        window.open('https://open.spotify.com')
      } else {
        window.location.replace('spotify:')
      }
    },
    playDemo () {
      this.spotify.put('/me/player/play?device_id=' + this.device_id, { uris: ['spotify:track:4RXpgGM7A4Hg7cFBoH5KyF'] })
    },
    copySuccess () {
      this.$message.success('Link copied to clipboard')
    },
    emitState (state) {
      // update state if given
      state ? this.state = state : state = this.state

      // define state to be shared with listeners
      let sharedState = {
        context: state.context,
        paused: state.paused,
        // add difference to position
        position: state.position + (Date.now() - state.timestamp),
        timestamp: Date.now(),
        track_window: state.track_window
      }

      // send shared state
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
      const startTime = Date.now()
      this.player.getCurrentState().then((state) => {
        state.position += Date.now() - startTime
        setTimeout(() => this.player.seek(state.position + 1000), 1000)
      })
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
.header {
  color: white;
}

.card {
  margin-top: 10px;
  margin-bottom: 10px;
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
