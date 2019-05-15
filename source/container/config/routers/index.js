/**
 * Created by JackieWu on 2019/4/9.
 */
import AsyncComponent from '../../libs/AsyncComponent';

export default {
  title: '首页',
  path: '/',
  icon: 'iconshouye',
  component: AsyncComponent(() => import('../../views/Home')),
  cache: false,
  routes: [],
}
