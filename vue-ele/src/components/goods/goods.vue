<template>
  <div class="goods">

    <div class="menu-wrapper menuwrapper" ref="menuref">
      <ul>
        <li v-for="(item,index) in goods" class="menuItem" :class="{'current':currentIndex===index}"
            @click="selectmenu(index,$event)">


          <span class="text border-1x">
             <span class="icon " :class="classMap[item.type]" v-show="item.type > 0"></span>
            {{item.name}}
          </span>
        </li>
      </ul>

    </div>

    <div class="foods-wrapper foodswrapper" ref="foodsref">
      <ul>
        <li  v-for="item in goods" class="food-list food-list-hook">
          <h1 class="title">{{item.name}}</h1>
          <ul>
            <li @click="selectFood(food,$event)" v-for="food in item.foods" class="food-item border-1px">

              <div class="icon">
                <img :src="food.icon" width="57px" height="57px">
              </div>
              <div class="content">
                <h2 class="food-name">{{food.name}}</h2>
                <p class="food-desc">{{food.description}}</p>
                <div class="extra">
                  <span class="count ">月销售量{{food.sellCount}}</span><span>好评率{{food.rating}}</span>

                </div>
                <div class="price">
                  <span class="nowprice">￥{{food.price}}</span><span class="oldprice" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
                </div>
                <div class="cart-controller-wrapper">
                  <v-cartcontroller @add="addFood" :food="food"></v-cartcontroller>
                </div>
              </div>

            </li>
          </ul>
        </li>
      </ul>

    </div>

    <v-shopcart ref="shopcart" :deliverPrice="seller.deliveryPrice" :minPrice="seller.minPrice"
                :selsetFoods="selectfoods"></v-shopcart>

    <v-food @add="addFood" :food="selectfood" ref="foodref"></v-food>
  </div>

</template>


<script type="text/ecmascript-6">
  import BScroll from 'better-scroll';
  import shopcart from '../shopcart/shopcart.vue';
  import cartcontroller from '../cartcontroller/cartcontroller.vue';
  import food from '../food/food.vue';
  const ERR_OK = 0;
  export default {
    props: {
      seller: {
        type: Object
      }
    },
    data() {
      return {
        goods: [],
        listHeight: [],
        scrollY: 0,
        selectfood: {}
      };
    },
    created() {
      this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
      this.$http.get('/api/goods').then(response => {
        if (response.body.errno === ERR_OK) {
          this.goods = response.body.data;
          this.$nextTick(() => {
            this._initScroll();
            this._calculateHeight();
          });
        }
      }, response => {
        console.log(response);
      });
    },
    computed: {
      currentIndex() {
        for (let i = 0; i < this.listHeight.length; i++) {
          let height1 = this.listHeight[i];
          let height2 = this.listHeight[i + 1];
          if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
            return i;
          }
        }
        return 0;
      },
      selectfoods() {
        let foods = [];
        this.goods.forEach((good) => {
          good.foods.forEach((food) => {
            if (food.count) {
              foods.push(food);
            }
          });
        });
        return foods;
      }
    },
    methods: {
      _initScroll() {
        this.menuScroll = new BScroll('.menuwrapper', {
          click: true
        });
        this.foodsScroll = new BScroll('.foodswrapper', {
          click: true,
          probeType: 3
        });
        this.foodsScroll.on('scroll', (pos) => {
          this.scrollY = Math.abs(Math.round(pos.y));
        });
      },
      _calculateHeight() {
        let foodlist = this.$refs.foodsref.getElementsByClassName('food-list-hook');
        let height = 0;
        this.listHeight.push(height);
        for (let i = 0; i < foodlist.length; i++) {
          let item = foodlist[i];
          height += item.clientHeight;
          this.listHeight.push(height);
        }
      },
      selectmenu(index, event) {
//          if (!event._constructed) {
//           return;
//          }
        let foodlist = this.$refs.foodsref.getElementsByClassName('food-list-hook');
        let el = foodlist[index];
        this.foodsScroll.scrollToElement(el, 300);
      },
      addFood(target) {
        console.log(target);
        this._drop(target);
      },
      _drop(target) {
        // 体验优化,异步执行下落动画
        this.$nextTick(() => {
          this.$refs.shopcart.drop(target);
        });
      },
      selectFood(food, event) {
          console.log(food);
        this.selectfood = food;
        this.$refs.foodref.show();
      }
    },
    components: {
      'v-shopcart': shopcart,
      'v-cartcontroller': cartcontroller,
      'v-food': food
    }
  };
</script>


<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl";
  .goods
    display: flex
    position: absolute
    overflow: hidden
    top: 170px
    bottom: 46px
    width: 100%
    .menu-wrapper
      background-color: #f3f5f7
      flex: 0 0 80px
      width: 80px
      .menuItem
        display: table
        height: 54px
        width: 56px
        padding: 0 12px
        line-height: 14px
        .text
          display: table-cell
          width: 56px
          vertical-align: middle
          font-size: 12px
          border-1px(rgba(7, 17, 27, 0.1))
          .icon
            display: inline-block
            vertical-align: top
            width: 12px
            height: 12px
            background-size: 12px 12px
            background-repeat: no-repeat
            margin-right: 2px
            &.decrease
              bg-image('decrease_3')
            &.discount
              bg-image('discount_3')
            &.guarantee
              bg-image('guarantee_3')
            &.invoice
              bg-image('invoice_3')
            &.special
              bg-image('special_3')
      .current
        position: relative
        background-color: white
        font-weight: 700
        margin-top: -1px
        z-index: 10
        .text
          border-none()
    .foods-wrapper
      flex: 1
      .title
        height: 26px
        padding-left: 14px
        line-height: 26px
        border-left: 2px solid #d9dde1
        font-size: 12px
        color: rgb(147, 153, 159)
        background-color: #f3f5f7
      .food-item
        display: flex
        margin: 18px
        padding-bottom: 18px
        border-1px(rgba(7, 17, 27, 0.1))
        &:last-child
          border-none()
          margin-bottom: 0px
        .icon
          flex: 0 0 57px
          margin-right: 10px
        .content
          flex: 1
          .food-name
            margin: 2px 0 8px 0
            height: 14px
            line-height: 14px
            font-size: 14px
            color: rgb(7, 17, 27)
          .food-desc
            margin-bottom: 8px
            line-height: 14px
            font-size: 10px
            color: rgb(147, 153, 159)
          .extra
            line-height: 10px
            font-size: 10px
            color: rgb(147, 153, 159)
            .count
              margin-right: 10px
          .price
            font-weight: 700
            line-height: 24px
            .nowprice
              margin-right: 10px
              font-size: 14px
              color: rgb(240, 20, 20)
            .oldprice
              text-decoration: line-through
              font-size: 10px
              color: rgb(147, 153, 159)

          .cart-controller-wrapper
            position: absolute
            right 0
            bottom 12px
</style>

