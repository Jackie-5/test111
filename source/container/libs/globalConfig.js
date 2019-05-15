/**
 * Created by JackieWu on 2019/4/9.
 */

export default (() => {
  let env = process.env.PUSHLISH_ENV;
  if (!env) {
    env = 'prod';
  }
  global.envConfig = require(`../config/env/${env}`);
})();
