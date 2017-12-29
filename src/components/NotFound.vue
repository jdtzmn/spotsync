<template lang="pug">
  el-row
    el-col(:md='{ span: 10, offset: 7 }', :sm='{ span: 12, offset: 6 }', :xs='{ span: 22, offset: 1 }').main
      el-row(:gutter='20')
        el-col(:span='6')
          icon(label='No Music', scale='4').icon-stack
            icon(name='volume-up').icon-headphones
            icon(name='ban', scale='2').icon-ban
        el-col(:span='18')
          h1.title Can't hear anything?
          p.subtitle We think you may have entered the link incorrectly...
</template>

<script>
export default {
  name: 'NotFound'
}
</script>

<style scoped>
.main { margin-top: 20vh; }

.icon-stack { width: 100%; }

.icon-headphones { color: rgb(30, 30, 30); }

.icon-ban { color: red; }

.title, .subtitle { color: white; }

.title { font-size: 40px; }

.subtitle { font-size: 20px; }
</style>
