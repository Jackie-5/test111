import fetch from './fetch';
import config from './apis-config';

const ajaxUrls = {};
config.forEach((item) => {
  ajaxUrls[item.name] = item;
});


export default (apiName, params, options) => {
  const currentAjax = ajaxUrls[apiName];
  if (!currentAjax) {
    console.error('请传入正确的apiName');
    return;
  }
  let path = currentAjax.hostUrl + currentAjax.path;
  if (options) {
    path = options.path ? options.path : path;
  }

  return fetch(
    path,
    params,
    Object.assign(
      {},
      { method: currentAjax.method },
      options || {},
    ),
  );
};
