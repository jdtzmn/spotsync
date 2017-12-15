<template>
  <div id="app">
    <router-view/>
  </div>
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
  width: 100%;
  height: 100%;
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

/* element-ui fonts */

.el-message {
  font-family: 'Lato', sans-serif;
}
</style>
