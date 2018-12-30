<template>
  <m-scroll @scroll="scroll"
            class="listview"
            :data="data"
            :listen-scroll="listenScroll"
            :probe-type="probeType"
            ref="reflistview">
    <ul>
      <li v-for="group in data" class="list-group" ref="reflistgroup">
        <h2 class="list-group-title">{{group.title}}</h2>
        <ul>
          <li @click="selectItem(item)" class="list-group-item" v-for="item in group.items">
            <img class="list-item-avatar" v-lazy="item.avatar">
            <span class="list-item-name">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div class="shortcut">
      <ul>
        <li v-for="(item,index) in shortcutList" class="item" :class="{'active':currentIndex===index}"
            :data-index="index"
            @touchstart.stop.prevent="onShortcutTouchStart" @touchmove.stop.prevent="onShortcutTouchMove"
            @touchend.stop>{{item}}
        </li>
      </ul>
    </div>

    <div class="list-fixed" ref="fixed" v-show="fixedTitle">
      <div class="fixed-title">{{fixedTitle}}</div>
    </div>
    <div class="loading-container" v-show="!data.length">
      <m-loading></m-loading>
    </div>
  </m-scroll>
</template>
<script type="text/ecmascript-6">
  import Scroll from 'base/scroll/scroll';
  import {getData} from 'common/js/dom';
  import Loading from 'base/loading/loading';
  const TITLE_HEIGHT = 30;
  const ANCHOR_HEIGHT = 18;
  export default {
    props: {
      data: {
        type: Array,
        default: []
      }
    },
    data() {
      return {
        scrollY: -1,
        currentIndex: 0,
        diff: -1
      };
    },
    created() {
      this.probeType = 3;
      this.listenScroll = true;
      this.touch = {};
      this.listHeight = [];
    },
    computed: {
      shortcutList() {
        return this.data.map((group) => {
          return group.title.substr(0, 1);
        });
      },
      fixedTitle() {
        if (this.scrollY > 0) {
          return '';
        }
        return this.data[this.currentIndex] ? this.data[this.currentIndex].title : '';
      }
    },
    methods: {
      selectItem(item) {
        this.$emit('select', item);
      },
      onShortcutTouchStart(e) {
        let anchorIndex = getData(e.target, 'index');
        let firstTouch = e.touches[0];
        this.touch.y1 = firstTouch.pageY;
        this.touch.anchorIndex = anchorIndex;
        this._scrollTo(anchorIndex);
      },
      onShortcutTouchMove(e) {
        let firstTouch = e.touches[0];
        this.touch.y2 = firstTouch.pageY;
        let delta = (this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT | 0;
        let anchorIndex = parseInt(this.touch.anchorIndex) + delta;
        this._scrollTo(anchorIndex);
      },
      scroll(pos) {
        this.scrollY = pos.y;
      },
      refresh() {
        this.$refs.reflistview.refresh();
      },
      _calculateHeight() {
        this.listHeight = [];
        const list = this.$refs.reflistgroup;
        let height = 0;
        this.listHeight.push(height);
        for (let i = 0; i < list.length; i++) {
          let item = list[i];
          height += item.clientHeight;
          this.listHeight.push(height);
        }
      },
      _scrollTo(index) {
        if (!index && index !== 0) {
          return;
        }
        if (index < 0) {
          index = 0;
        } else if (index > this.listHeight.length - 2) {
          index = this.listHeight.length - 2;
        }
        console.log(index);
        this.scrollY = -this.listHeight[index];
        this.$refs.reflistview.scrollToElement(this.$refs.reflistgroup[index], 0);
      }
    },
    watch: {
      data() {
        setTimeout(() => {
          this._calculateHeight();
        }, 20);
      },
      scrollY(newY) {
        const listHeight = this.listHeight;
        // 当滚动到顶部，newY>0
        if (newY > 0) {
          this.currentIndex = 0;
          return;
        }
        // 在中间部分滚动
        for (let i = 0; i < listHeight.length - 1; i++) {
          let height1 = listHeight[i];
          let height2 = listHeight[i + 1];
          if (-newY >= height1 && -newY < height2) {
            this.currentIndex = i;
            this.diff = height2 + newY;
            return;
          }
        }
        // 当滚动到底部，且-newY大于最后一个元素的上限
        this.currentIndex = listHeight.length - 2;
      },
      diff(newVal) {
        let fixedTop = (newVal > 0 && newVal < TITLE_HEIGHT) ? newVal - TITLE_HEIGHT : 0;
        if (this.fixedTop === fixedTop) {
          return;
        }
        this.fixedTop = fixedTop;
        this.$refs.fixed.style.transform = `translate3d(0,${fixedTop}px,0)`;
      }
    },
    components: {
      'm-scroll': Scroll,
      'm-loading': Loading
    }
  };
</script>


<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/variable.styl"

  .listview
    position relative
    width 100%
    height 100%
    overflow hidden
    background-color $color-background
    .list-group
      padding-bottom 30px
      .list-group-title
        line-height 30px
        height 30px
        padding-left 20px
        font-size $font-size-small
        color $color-text-l
        background-color $color-highlight-background
      .list-group-item
        display flex
        align-items center
        padding: 20px 0 0 30px
        .list-item-avatar
          flex 0 0 50px
          height 50px
          border-radius 50%
        .list-item-name
          margin-left 20px
          color $color-text-l
          font-size $font-size-medium

    .shortcut
      position absolute
      z-index 30
      right 0
      top 50%
      transform: translateY(-50%)
      width: 20px
      padding: 20px 0
      border-radius: 10px
      text-align: center
      background: $color-background-d
      font-family: Helvetica
      .item
        padding: 3px
        line-height: 1
        color: $color-text-l
        font-size: $font-size-small
        &.active
          color $color-theme

    .list-fixed
      position absolute
      top 0
      left 0
      width 100%
      .fixed-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background

    .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>
