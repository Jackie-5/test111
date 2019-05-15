/**
 * Created by JackieWu on 2019/4/11.
 */
import permission from './config/permission';
import login from './config/login';
import system from './config/system';

// 此值为true时，开发环境强行不使用mock接口，即使在接口配置项中配置了mock为true(仅限开发环境)
const GLOBAL_IS_NOT_MOCK_WHEN_DEV = false;

const configList = [
  ...permission,
  ...login,
  ...system,
];
// 根据当前环境切换hostUrl
configList.forEach((apiConfig) => {
  const config = apiConfig;
  config.hostUrl = global.envConfig.backendHost;
  // 开发环境
  if (process.env.NODE_ENV === 'development') {
    // 要求强行开启非mock接口
    if (GLOBAL_IS_NOT_MOCK_WHEN_DEV) {
      return;
    }
  }
  if (apiConfig.mock) {
    config.hostUrl = global.envConfig.mockHost;
  }
});

export default configList;
