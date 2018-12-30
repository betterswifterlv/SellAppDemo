<template>
  <div class="recommend" ref="recommend">
    <m-scroll ref="scroll" class="recommend-content" :data="discList">
      <div>
        <div v-if="recommendsliders.length" class="slider-wrapper">

          <m-slider>
            <div v-for="item in recommendsliders">
              <a :href="item.linkUrl">
                <img @load="loadImage" class="needsclick" :src="item.picUrl">
              </a>
            </div>
          </m-slider>


        </div>
        <div class="recommend-list">
          <h1 class="list-title">热门推荐</h1>
          <ul>
            <li class="itemstyle" v-for="item in discList" @click="selectItem(item)">
              <div class="icon">
                <img width="60px" height="60px" v-lazy="item.imgurl">
              </div>
              <div class="text">
                <h2 class="name" v-html="item.creator.name"></h2>
                <p class="desc" v-html="item.dissname"></p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="loading-container" v-show="!recommendsliders.length">
        <m-loading></m-loading>
      </div>
    </m-scroll>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
  import {getRecommend, getDiscList} from 'api/recommend';
  import {ERR_OK} from 'api/config';
  import Slider from 'base/slider/slider';
  import Scroll from 'base/scroll/scroll';
  import Loadind from 'base/loading/loading';
  import {playlistMixin} from 'common/js/mixin';
  import {mapMutations} from 'vuex';
  export default {
    mixins: [playlistMixin],
    data() {
      return {
        recommendsliders: [],
        discList: []
      };
    },
    created() {
      this._getrecommend();
      this._getdisclist();
    },
    methods: {
      handlePlaylist(playlist) {
        const bottom = playlist.length > 0 ? '60px' : '';

        this.$refs.recommend.style.bottom = bottom;
        this.$refs.scroll.refresh();
      },
      _getrecommend() {
        getRecommend().then((res) => {
          if (res.code === ERR_OK) {
            this.recommendsliders = res.data.slider;
          }
        });
      },
      _getdisclist() {
        getDiscList().then((res) => {
          if (res.code === ERR_OK) {
            this.discList = res.data.list;
          }
        });
      },
      loadImage() {
        if (!this.checkloaded) {
          this.checkloaded = true;
          this.$refs.scroll.refresh();
        }
      },
      selectItem(item) {
        this.$router.push({
          path: `/recommend/${item.dissid}`
        });
        this.setDisc(item);
      },
      ...mapMutations({
        setDisc: 'SET_DISC'
      })
    },
    components: {
      'm-slider': Slider,
      'm-scroll': Scroll,
      'm-loading': Loadind
    }
  };
</script>


<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/variable.styl"
  .recommend
    position fixed
    width 100%
    top: 88px
    bottom 0
    .recommend-content
      height 100%
      overflow hidden
      .slider-wrapper
        position relative
        width 100%
        overflow hidden
      .recommend-list
        .list-title
          height 65px
          line-height 65px
          text-align center
          font-size $font-size-medium
          color $color-theme
        .itemstyle
          display: flex
          box-sizing: border-box
          align-items: center
          padding: 0 20px 20px 20px
          .icon
            flex 0 0 60px
            width: 60px
            padding-right: 20px
          .text
            display: flex
            flex-direction: column
            justify-content: center
            flex: 1
            line-height: 20px
            overflow: hidden
            font-size: $font-size-medium
            .name
              margin-bottom: 10px
              color: $color-text
            .desc
              color: $color-text-d

      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>

