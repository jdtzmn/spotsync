<template lang="pug">
  el-row(v-loading.fullscreen.lock='!this.device_id')
    el-col(:md='{ span: 10, offset: 7 }', :sm='{ span: 12, offset: 6 }', :xs='{ span: 22, offset: 1 }').main
      h1.header Currently listening to
      el-row(:gutter='20')
        el-col(:span='6')
          img(:src='track.image', width='100%').img
        el-col(:span='18')
          .name {{ track.name }}
          .artist {{ track.artists }}
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
        artists: 'Artist'
      },
      device_id: null,
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
    },
    createSpotifyInstance (accessToken) {
      this.accessToken = accessToken
      this.spotify = this.$axios.create({
        baseURL: 'https://api.spotify.com/v1/',
        headers: {
          Authorization: 'Bearer ' + accessToken
        }
      })
    }
  },
  sockets: {
    update (status) {
      let playingSong = this.track.uri === status.track_window.current_track.uri

      this.track.name = status.track_window.current_track.name
      this.track.artists = status.track_window.current_track.artists.map(obj => obj.name).join(', ')
      this.track.image = status.track_window.current_track.album.images[0].url
      this.track.uri = status.track_window.current_track.uri
      console.log(status)

      if (playingSong) {
        this.spotify.put('/me/player/seek?device_id=' + this.device_id + '&position_ms=' + status.position)
      } else {
        this.spotify.put('/me/player/play?device_id=' + this.device_id, { uris: [ this.track.uri ] })
          .then(() => {
            this.spotify.put('/me/player/seek?device_id=' + this.device_id + '&position_ms=' + status.position)
          })
      }
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
</style>
