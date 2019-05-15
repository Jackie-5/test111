/**
 * Created by JackieWu on 2019/4/9.
 */

import AsyncComponent from '../../libs/AsyncComponent';

export default {
  title: '网站',
  path: '/sites',
  icon: 'iconguanfangwangzhan',
  redirect: '/sites/business/xinfang',
  routes: [
    {
      title: '新房',
      path: '/sites/business/xinfang',
      viewPath: '',
      component: AsyncComponent(() => import('../../views/Test')),
      cache: false,
      blank: true,
    },
    {
      title: '二手房',
      path: '/sites/business/ershoufang',
      viewPath: '',
      component: AsyncComponent(() => import('../../views/Test')),
      cache: false,
      routes: [
        {
          title: '新房',
          path: '/sites/business/xinfang1',
          viewPath: '',
          component: AsyncComponent(() => import('../../views/Test')),
          cache: false,
        },
        {
          title: '二手房',
          path: '/sites/business/xinfang2',
          viewPath: '',
          component: AsyncComponent(() => import('../../views/Test')),
          cache: false,
        }
      ]
    }
  ]
};

