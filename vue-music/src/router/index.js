import Vue from 'vue';
import Router from 'vue-router';
import UserCenter from 'components/user-center/user-center';
import Rank from 'components/rank/rank';
import Recommend from 'components/recommend/recommend';
import Search from 'components/search/search';
import Singer from 'components/Singer/Singer';
import SingerDetail from 'components/singerdetail/singerdetail';
import Disc from 'components/disc/disc';
import TopList from 'components/top-list/top-list';
Vue.use(Router);
// const UserCenter = (resolve) => {
//   import('components/user-center/user-center').then((module) => {
//     resolve(module);
//   });
// };
export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/recommend'
    },
    {
      path: '/user',
      component: UserCenter
    },
    {
      path: '/rank',
      component: Rank,
      children: [
        {
          path: ':id',
          component: TopList
        }
      ]
    },
    {
      path: '/recommend',
      component: Recommend,
      children: [
        {
          path: ':id',
          component: Disc
        }
      ]
    },
    {
      path: '/search',
      component: Search
    },
    {
      path: '/singer',
      component: Singer,
      children: [
        {
          path: ':id',
          component: SingerDetail
        }
      ]
    }
  ]
});
