## electron-xunke

### 环境要求

> node 11.X npm 6.X 

### 项目启动

> `yarn install`

> `yarn dev`

> 如果yarn 下载过慢 可以用 cnpm 淘宝的镜像来下载。 `yarn global add ncpm && ncpm install`

### 打包方式

> mac 必须需要 mac电脑来打包 方法 `yarn package-mac`

> windows `yarn package-win:64 yarn package-win:32`

> linux `package-linux`

### 项目测试

> 分四种环境 dev、alpha、beta、prod 这四种环境分别对应 source/container/config/env 下的对应配置 环境变量拿全局的 PUSHLISH_ENV。

### 目录结构


```
├── .babelrc                                
├── .editorconfig
├── .eslintignore
├── .eslintrc
├── .gitattributes
├── .gitignore
├── .npmrc
├── .prettierrc
├── .stylelintrc
├── .testcafe-electron-rc
├── .travis.yml
├── CHANGELOG.md
├── LICENSE
├── README.md
├── appveyor.yml
├── babel.config.js
├── icons                           // 存放electron的icon 桌面图标
│   ├── icon.icns
│   ├── icon.ico
│   ├── icon.png
│   └── icons
├── package.json
├── source                         
│   ├── container                   // electron react源文件
│   │   ├── components              // 所有的组件
│   │   │   ├── 404                 // 404错误页面组件
│   │   │   │   └── index.js
│   │   │   ├── BasisRoot           // 入口的组件
│   │   │   │   └── Root.js
│   │   │   └── Layout              // 整体布局的组件
│   │   │       ├── config.js
│   │   │       ├── index.js
│   │   │       └── index.less
│   │   ├── config                  // 配置文件 会根据 process.env.PUSHLISH_ENV 来查找对应的配置文件
│   │   │   ├── env
│   │   │   │   ├── alpha.js
│   │   │   │   ├── beta.js
│   │   │   │   ├── dev.js
│   │   │   │   └── prod.js
│   │   │   ├── router.js           // router的入口
│   │   │   └── routers             // router配置文件，按照功能页面来配置
│   │   │       ├── index.js
│   │   │       ├── login.js
│   │   │       ├── platform.js
│   │   │       └── system.js
│   │   ├── fetch                   // 包装后的请求方法直接引用 
│   │   │   ├── apis-config.js
│   │   │   ├── config
│   │   │   │   ├── login.js
│   │   │   │   ├── permission.js
│   │   │   │   └── system.js
│   │   │   ├── fetch.js
│   │   │   └── index.js
│   │   ├── index.js                // electron 唯一入口文件
│   │   ├── less                    // less文件，所有less都要在 index.global.less 引用
│   │   │   ├── common.less
│   │   │   └── index.global.less
│   │   ├── libs                    // 自己封装的插件库
│   │   │   ├── AsyncComponent.js
│   │   │   ├── RouterLink.js
│   │   │   ├── getAllMenu.js
│   │   │   ├── getUserInfo.js
│   │   │   ├── globalConfig.js
│   │   │   └── waterMark.js
│   │   ├── theme.js                // antd的主题模板
│   │   └── views                   // 所有业务的页面组件
│   │       ├── Home
│   │       │   └── index.js
│   │       ├── Login
│   │       │   ├── index.js
│   │       │   └── login.less
│   │       ├── System
│   │       │   └── dict
│   │       │       └── kv
│   │       │           ├── config.js
│   │       │           ├── index.js
│   │       │           ├── index.less
│   │       │           └── newKv.js
│   │       └── Test
│   │           └── index.js
│   ├── electron                  // 这里放入electron的工具
│   │   └── menu.js
│   ├── index.html               // electron会拉取此HTML做为模板
│   └── main.js
├── webpack                       // webpack对electron 和 react 进行打包的文件
│   ├── base.config.js
│   ├── electron.prod.js
│   ├── react.dev.js
│   └── react.pord.js

```

### router配置方式

> 在 source/container/config/routers 下每一个文件都是一个object 里面可以配置N层结构 如：

```
// AsyncComponent 这个文件必须引用，拆包的作用
import AsyncComponent from '../../libs/AsyncComponent';

export default {
  title: '首页',
  path: '/login',
  icon: 'iconshouye',   // 会拿这个icon渲染在menu里 
  component: AsyncComponent(() => import('../../views/Login')),
  routes: [],           // 里面的结构完全跟demo结构一样
  notLayout: true,      //  是否需要全局 布局
  notShow: true,        // 是否展示在菜单上
  cache: false,         // 是否需要缓存 关于缓存往下看
};

```

### router缓存机制

> 如果你熟悉vue的 keep-alive 那么这个应该会很简单 如果不熟悉有兴趣的话 请参考

> [react-keep-alive](https://github.com/StructureBuilder/react-keep-alive/blob/master/README.zh-CN.md)

> [keep-alive  vue](https://vuejs.org/v2/guide/components-dynamic-async.html)

### 注意事项

> 因为是桌面应用，所以需要至少两个端来测试 mac 和 windows 

> 不可以用cookie来做页面的永久储存。这边用到一个库 store 具体可以参考 [electron-store](https://github.com/sindresorhus/electron-store)
 

### 引用的包与参考文件

> [永久储存的 store 来代替 cookie。 electron-store](https://github.com/sindresorhus/electron-store)

> [此项目的原始参考 electron-react-boilerplate](https://github.com/electron-react-boilerplate/electron-react-boilerplate)

> [拖拽组件 react-beautiful-dnd](https://github.com/atlassian/react-beautiful-dnd)

> [electron API](https://electronjs.org)

