/**
 * Created by JackieWu on 2019/4/9.
 */
import AsyncComponent from '../../libs/AsyncComponent';

export default {
  title: '系统',
  path: '/system',
  icon: 'iconxitongshezhi',
  redirect: '/system/dict/kv',
  cache: false,
  routes: [
    {
      title: '数据字典',
      path: '/system/dict',
      icon: 'iconshuju',
      redirect: '/system/dict/kv',
      cache: false,
      routes: [
        {
          title: 'KV字典',
          path: '/system/dict/kv',
          icon: 'iconzidianguanli',
          component: AsyncComponent(() => import('../../views/System/dict/kv/index')),
          cache: false,
        },
      ],
    },
  ],
  notLayout: true
};
