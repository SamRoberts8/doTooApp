/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import { app, BrowserWindow, shell, ipcMain, globalShortcut } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

ipcMain.on('ipc-example', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  console.log(msgTemplate(arg));
  event.reply('ipc-example', msgTemplate('pong'));
});

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload,
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 400,
    height: 450,
    minWidth: 400,
    minHeight: 50,
    frame: false,
    resizable: true,
    transparent: true,
    // hasShadow: false,
    icon: getAssetPath('icon.png'),
    vibrancy: 'hud',
    visualEffectState: 'active',
    titleBarStyle: 'hiddenInset',

    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));
  mainWindow.setAlwaysOnTop(true, 'status');

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
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

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);

app.on('ready', () => {
  ipcMain.on('resize-window-focus', (event, height) => {
    if (height === 0) {
      return;
    }
    const { width } = mainWindow!.getBounds(); // Get current width
    const windowFrameHeight = 0; // Adjust based on your OS and window decoration
    mainWindow?.setSize(width, height + windowFrameHeight); // Set new height
    mainWindow!.setWindowButtonVisibility(false);
  });

  ipcMain.on('resize-window-minimode', () => {
    mainWindow!.setWindowButtonVisibility(false);
  });

  ipcMain.on('resize-window-normalmode', () => {
    mainWindow!.setWindowButtonVisibility(true);
  });
  // Register a 'Command + Option + M' global shortcut listener for macOS.
  const ret = globalShortcut.register('CommandOrControl+Alt+M', () => {
    console.log('Command + Option + M is pressed');

    if (mainWindow && mainWindow?.getSize()[1] < 200) {
      mainWindow?.setSize(400, 450);
    }

    mainWindow?.webContents.send('global-shortcut', 'Command + Option + M');

    mainWindow?.show();
  });

  if (!ret) {
    console.log('Registration failed');
  }
  // Check whether the shortcut is registered.
  console.log(globalShortcut.isRegistered('CommandOrControl+Alt+M'));

  const retf = globalShortcut.register('CommandOrControl+Alt+F', () => {
    console.log('Command + Option + F is pressed');
    mainWindow?.webContents.send('trigger-resize-focus');
  });

  if (!retf) {
    console.log('Registration failed');
  }

  const retg = globalShortcut.register('CommandOrControl+Alt+G', () => {
    console.log('Command + Option + G is pressed');
    mainWindow?.setSize(400, 450);
    // Your action goes here. For example, opening a specific app window or executing a particular function.

    // Send a message to the renderer process
  });

  if (!retg) {
    console.log('Registration failed');
  }
});
