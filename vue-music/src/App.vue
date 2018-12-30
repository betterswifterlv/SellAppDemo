<template>
  <div id="app" @touchmove.prevent>
    <m-header></m-header>
    <m-tab></m-tab>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    <player></player>
  </div>
</template>

<script>
  import Mheader from './components/m-header/m-header.vue';
  import Tab from 'components/tab/tab.vue';
  import Player from 'components/player/player';
  export default {
    components: {
     'm-header': Mheader,
      'm-tab': Tab,
      Player
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import './common/stylus/mixin.styl'
  @import "./common/stylus/variable.styl"
  @import './common/stylus/index.styl'
  #app {

  }
</style>
