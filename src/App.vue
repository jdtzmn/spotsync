<template lang="pug">
  el-container#app
    el-header#header
      div#brand
        a(href='/').name Spotsync
        span.beta BETA
      div#author
        span an app by
        a.link(href='https://github.com/jdtzmn', target='_blank') jdtzmn
    el-main#main
      router-view
</template>

<script>
export default {
  name: 'app'
}
</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Lato:700');

body, html {
  margin: 0;
  padding: 0;
  background: #5E9FA3;
  background: -webkit-linear-gradient(#5E9FA3, #018790);
  background: -o-linear-gradient(#5E9FA3, #018790);
  background: -moz-linear-gradient(#5E9FA3, #018790);
  background: linear-gradient(#5E9FA3, #018790);
}

#app {
  font-family: 'Lato', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body, html, #app {
  min-height: 100vh;
}

#header {
  position: fixed;
  width: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1;
  transition: background 0.2s;
}

#header.transparent {
  background: rgba(0, 0, 0, 0.7)
}

#brand {
  display: inline-block;
  margin: 15.5px;
}

#brand .name {
  color: white;
  font-size: 1.5em;
  text-decoration: none;
}

#brand .beta {
  color: white;
  padding: 2px;
  background: #E33258;
  border-radius: 4px;
  margin-left: 5px;
}

#main { margin-top: 60px; }

#author {
  color: rgb(240, 240, 240);
  float: right;
  margin: 20.5px;
}

#author .link {
  color: white;
  margin-left: 2px;
}

.footer-text { color: white; }

.footer-link {
  color: #4DABFF;
  margin-left: 3px;
  padding-bottom: 0;
}

/* element-ui fonts */

.el-message, .el-message-box {
  font-family: 'Lato', sans-serif;
}
</style>
