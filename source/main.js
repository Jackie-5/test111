import { app, BrowserWindow, ipcMain } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import MenuBuilder from './electron/menu';
import axios from 'axios';
import Store from 'electron-store';
import { getToken } from './container/libs/getUserInfo';

const envConfig = require(`./container/config/env/${process.env.PUSHLISH_ENV}`);
const store = new Store();

let loginWindow = null;
let mainWindow = null;


const mainView = () => {
  mainWindow = new BrowserWindow({
    show: false,
    width: 1200,
    height: 768,
    frame: false,
  });

  mainWindow.loadURL(`file://${__dirname}/index.html#/`);

  mainWindow.webContents.on('did-finish-load', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    mainWindow.maximize();
    mainWindow.show();
    mainWindow.focus();

  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();
};

const loginView = () => {
  loginWindow = new BrowserWindow({
    show: false,
    width: 750,
    height: 460,
    transparent: true,
    frame: false,
    resizable: false,
    titleBarStyle: 'hidden',
    fullscreenable: false,
    simpleFullscreen: false,
  });

  loginWindow.loadURL(`file://${__dirname}/index.html#/login`);

  loginWindow.webContents.on('did-finish-load', () => {
    if (!loginWindow) {
      throw new Error('"loginWindow" is not defined');
    }
    loginWindow.minimize();
    loginWindow.show();
    loginWindow.focus();

  });

  loginWindow.on('closed', () => {
    loginWindow = null;
  });

  if (process.env.NODE_ENV === 'development') {
    const menuBuilder = new MenuBuilder(loginWindow);
    menuBuilder.buildMenu();
  }

};


ipcMain.on('closeLogin', () => {
  loginWindow.close();
});


ipcMain.on('openLogin', () => {
  loginView();
});


ipcMain.on('closeMain', () => {
  mainWindow.close();
});

ipcMain.on('openMain', () => {
  mainView();
});


ipcMain.on('minMain', () => {
  mainWindow.minimize();
});


ipcMain.on('maxMain', () => {
  mainWindow.maximize();
});

export default class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}



if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

if (
  process.env.NODE_ENV === 'development' ||
  process.env.DEBUG_PROD === 'true'
) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return Promise.all(
    extensions.map(name => installer.default(installer[name], forceDownload))
  ).catch(console.log);
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});


app.on('ready', async () => {
  if (
    process.env.NODE_ENV === 'development' ||
    process.env.DEBUG_PROD === 'true'
  ) {
    await installExtensions();
  }

  if (getToken()) {
    axios({
      // url:`${envConfig.backendHost}/token/getUserInfo`,
      url:`https://easy-mock.com/mock/5cb8321f2cbf0f41c66e99ee/backend/token/getUserInfo`,
      method: 'POST',
      headers: {
        Authorization: `Bearer ${getToken()}`,
      }
    }).then((res) => {
        const data = res.data;
        if (data.code.toString() === '403') {
          loginView();
        } else {
          store.set('userInfo', data.data.userInfo);
          store.set('token', data.data.token);
          store.set('permissions', data.data.permissions);
          mainView();
        }
      })
      .catch((err) => {
        console.log(err.message);
        loginView();
      });
  } else {
    loginView();
  }

  new AppUpdater();
});
