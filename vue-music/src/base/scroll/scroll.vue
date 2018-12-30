<template>
  <div class="classwrapper" ref="scrollrapper">
    <slot></slot>
  </div>
</template>
<script type="text/ecmascript-6">
  import BScroll from 'better-scroll';
  export default {
    props: {
      probeType: {
        type: Number,
        default: 1
      },
      click: {
        type: Boolean,
        default: true
      },
      data: {
        type: Array,
        default: []
      },
      listenScroll: {
        type: Boolean,
        default: false
      }
    },
    mounted() {
      setTimeout(() => {
        this._initscroll();
      }, 20);
    },
    methods: {
      _initscroll() {
        if (!this.$refs.scrollrapper) {
          return;
        }

        this.scroll = new BScroll(this.$refs.scrollrapper, {
          probeType: this.probeType,
          listenScroll: this.listenScroll,
          click: this.click
        });
        // 监听滚动事件
        if (this.listenScroll) {
          let me = this;
          this.scroll.on('scroll', (pos) => {
            me.$emit('scroll', pos);
          });
        }
      },
      enable() {
        this.scroll && this.scroll.enable();
      },
      disable() {
        this.scroll && this.scroll.disable();
      },
      refresh() {
        this.scroll && this.scroll.refresh();
      },
      scrollTo() {
        this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments);
      },
      scrollToElement() {
        this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments);
      }
    },
    watch: {
      data() {
        setTimeout(() => {
          this.refresh();
        }, 20);
      }
    }
  };
</script>


<style lang="stylus" rel="stylesheet/stylus">

</style>
