/**
 * Created by JackieWu on 2019/4/25.
 */
import menuList from '../config/router';

export default () => {
  const menuKeys = [];
  const recursive = (menusList) => {
    for (const i in menusList) {
      const item = menusList[i];
      if (item.cache) {
        menuKeys.push(item.path);
      }
      if ( item.routes && item.routes.length > 0 ) {
        recursive(item.routes);
      }
    }
  };

  menuList.forEach((item) => {
    if (item.cache) {
      menuKeys.push(item.path);
    }
    if (item.routes && item.routes.length > 0) {
      recursive(item.routes);
    }
  });

  return {
    menuKeys
  };
}
