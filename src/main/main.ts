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
import { writeFile, readFile } from 'fs';
import { app, BrowserWindow, shell, ipcMain, globalShortcut } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';
import fs from 'fs';

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
    const width = 400; // Get current width
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

const getBackupFileName = () => {
  const date = new Date();

  // Pad single digits with leading zeros
  const pad = (num) => num.toString().padStart(2, '0');

  // Extract components using local time
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1); // getMonth() is zero-indexed
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());

  // Format date and time strings
  const dateString = `${year}-${month}-${day}`; // YYYY-MM-DD
  const timeString = `${hours}-${minutes}-${seconds}`; // HH-MM-SS

  // Return the formatted backup file name
  return `backup-${dateString}-${timeString}.json`;
};

const shouldBackup = (backupDir, callback) => {
  fs.readdir(backupDir, (err, files) => {
    if (err) {
      console.error('Failed to list backup directory', err);
      fs.mkdir(backupDir, (err) => {
        if (err) {
          console.error('Failed to create backup directory', err);
          return callback(false);
        }
        console.log('Backup directory created');
      });
    }

    const backupFiles = files
      .filter((file) => file.startsWith('backup-') && file.endsWith('.json'))
      .sort();
    if (backupFiles.length === 0) {
      return callback(true); // No backups yet, proceed
    }

    const latestBackupFile = backupFiles[backupFiles.length - 1];

    const datePart = latestBackupFile.substring(7, 17);
    const timePart = latestBackupFile.substring(18, 26);
    const formattedTimePart = timePart.replace(/-/g, ':');

    const isoDateString = `${datePart}T${formattedTimePart}`;

    const latestBackupDate = new Date(isoDateString);

    const latestBackupDateTimestamp = latestBackupDate.getTime();

    const now = Date.now();

    // Check if the latest backup is at least 5 minute old
    if (now - latestBackupDateTimestamp > 600000) {
      return callback(true);
    }
    return callback(false);
  });
};

const maintainBackups = (backupDir: string) => {
  fs.readdir(backupDir, (err, files) => {
    if (err) {
      console.error('Failed to list backup directory:', err);
      fs.mkdir(backupDir, (err) => {
        if (err) {
          console.error('Failed to create backup directory:', err);
          return;
        }
        console.log('Backup directory created');
      });
    }

    // Filter for backup files and sort them so the oldest is first
    const backupFiles = files
      .filter((file) => file.startsWith('backup-') && file.endsWith('.json'))
      .sort();

    // If there are more than 10 backups, delete the oldest ones
    while (backupFiles.length > 10) {
      const fileToDelete = backupFiles.shift(); // Removes the oldest item from the array
      fs.unlink(path.join(backupDir, fileToDelete), (err) => {
        if (err) {
          console.error('Failed to delete old backup', fileToDelete, err);
        } else {
          console.log(`Deleted old backup: ${fileToDelete}`);
        }
      });
    }
  });
};
ipcMain.on('backup-data', (event, data) => {
  const backupDir = path.join(app.getPath('userData'), 'backUps');

  shouldBackup(backupDir, (proceed: boolean) => {
    if (!proceed) return;

    maintainBackups(backupDir); // Clean up before creating a new backup

    const backupFileName = getBackupFileName();
    const filePath = path.join(backupDir, backupFileName);
    fs.writeFile(filePath, data, (err) => {
      if (err) {
        console.error('Failed to save backup', err);
        return;
      }
      console.log(`Backup saved: ${backupFileName}`);
    });
  });
});
