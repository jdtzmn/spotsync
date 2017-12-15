<template lang="pug">
  div.card
    h1.header To continue... please login with Spotify
    a.link(href='/auth/login')
      el-button(type='success').login
        icon.icon(name='spotify', scale='1.2')
        span.text Login with Spotify
</template>

<script>
export default {
  name: 'Login'
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .card {
    padding-top: 30vh;
  }

  .header {
    text-align: center;
    color: white;
  }

  .link {
    text-decoration: none;
  }

  .login {
    display: block;
    margin: 0 auto;
    position: relative;
  }

  .icon {
    position: relative;
    top: 2px;
  }

  .text {
    font-size: 20px;
    margin-left: 5px;
  }
</style>
