/**
 * Created by JackieWu on 2019/4/11.
 */

export default [
  {
    name: 'permissionCompanyCategory',
    method: 'get',
    path: '/permission/company/category',
    mock: true,
  },
  {
    name: 'getPermission',
    method: 'get',
    path: '/permission',
    mock: true,
  },
  {
    name: 'getAllPermission',
    method: 'get',
    path: '/permission',
    mock: true,
  },
  {
    name: 'getEmployeeList',
    method: 'get',
    path: '/employee/forPermission',
    mock: false,
  },
  {
    name: 'getEmployeeDetail',
    method: 'get',
    path: '/permission/employee',
    mock: true,
  },
  {
    name: 'permission/employee/category',
    method: 'get',
    path: '/permission/employee/category',
    mock: false,
  },
];

