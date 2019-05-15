/**
 * Created by JackieWu on 2019/4/11.
 */

export default [
  {
    name: 'queryAdminDictionaryToBForShow',
    method: 'post',
    path: '/queryAdminDictionaryToBForShow',
    mock: false,
  }, {
    name: 'getAdminDictionaryWithListToB',
    method: 'post',
    path: 'getAdminDictionaryWithListToB',
    mock: false,
  }, {
    // name: 'fetchCity',
    name: 'getDataGroupByCodeToB',
    method: 'post',
    // path: '/system/dict/fetchCity',
    path: '/getDataGroupByCodeToB',
    mock: false,
    // mockUrl: LOCAL_MOCK_PATH,
  }, {
    name: 'addAdminDictionaryToB',
    method: 'post',
    path: '/addAdminDictionaryToB',
    mock: false,
  }, {
    name: 'modifyAdminDictionaryToB',
    method: 'post',
    path: '/modifyAdminDictionaryToB',
    mock: false,
  }, {
    name: 'queryDataDictToBForShow',
    method: 'post',
    path: '/queryDataDictToBForShow',
    mock: false,
  }, {
    name: 'deleteDataDictToB',
    method: 'get',
    path: '/deleteDataDictToB',
    mock: false,
  }, {
    name: 'addDataDictToB',
    method: 'post',
    path: '/addDataDictToB',
    mock: false,
  },
];

