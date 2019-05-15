/**
 * Created by JackieWu on 2019/4/18.
 */

import Store from 'electron-store';

const store = new Store();


export const getUserInfo = () => store.get('userInfo');

export const getToken = () => store.get('token');

export const getPermissions = () => store.get('permissions');

export const getRemember = () => store.get('remember');

export const getLoginInfo = () => store.get('loginInfo');
