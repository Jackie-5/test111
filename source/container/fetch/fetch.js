import axios from 'axios';
import { message, Modal } from 'antd';
import { getToken } from '../libs/getUserInfo';
import { ipcRenderer } from 'electron';
/**
 * 处理method
 * @param {AxiosRequestConfigMethod} config 包含method的config属性
 * @param {object} [params] 参数
 */
function handleMethodPlugin(config, params,) {
  const configs = config;
  switch (configs.method.toLowerCase()) {
    case 'get': {
      configs.params = params;
      break;
    }
    case 'post':
    case 'put':
    case 'patch': {
      configs.data = params;
      if (config.headers['Content-Type'] === 'application/x-www-form-urlencoded') {
        // config.data = qs.stringify(params);
      }
      break;
    }
    default: {
      configs.params = params;
    }
  }
}
/**
 * 接口请求
 * @param {string} urlParams 接口url
 * @param {object} [params] 接口参数
 * @param {AxiosRequestConfig} [options] 接口配置参数
 * @returns
 */
function fetch(urlParams, params, options) {
  const config = Object.assign({
    url: urlParams,
    method: 'get',
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  }, options);
  handleMethodPlugin(config, params);
  return axios(config).then((response) => {
    if (+response.data.code === 403) {
      if (process.env.PUSHLISH_ENV !== 'dev') {
        Modal.error({
          title: '登录信息',
          content: response.data.message,
          okText: '重新登录',
          centered: true,
          onOk: () => {
            ipcRenderer.send('closeMain');
            ipcRenderer.send('openLogin');
          }
        });
      }
    }
    return response.data;
  }).catch((error) => {
    message.error(error.message);
  });
}

export default fetch;
