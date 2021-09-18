// Copyright (c) 2021 Leedehai. All rights reserved.
// Use of this source code is governed under the MIT LICENSE.txt file.
// -----
// The entry point file (configured in package.json's 'main' field) controls the
// Electron app's *main process*. Note it cannot manage DOMs; renderer processes
// do: https://www.electronjs.org/docs/latest/tutorial/process-model.
//
// Command 'npm start' runs this app (configured in package.json's 'scripts'
// field), or simply command 'electron .'.

import {WindowStateKeeper} from 'core/main/window_state';
import {app, BrowserWindow, ipcMain, IpcMainInvokeEvent, nativeTheme} from 'electron';
import path from 'path';

function createWindow() {
  // Try loading a previous window state stored on file.
  const mainWindowState = new WindowStateKeeper({
    defaultWidth: 800,
    defaultHeight: 600,
    // app.getPath('userData') default locations:
    // Linux: ~/.config/<Your App Name in package.json>
    // macOS: ~/Library/Application Support/<Your App Name in package.json>
    // Windows: C:\Users\<you>\AppData\Local\<Your App Name in package.json>
    fileDirectory: app.getPath('userData'),
    fileBaseName: 'window-state.json',
  });

  // TODO Figure out a way to use BrowserWindow.id instead of this.
  const windowId = Math.random().toString(16).substr(2);

  const mainWin = new BrowserWindow({
    show: false,  // Don't show initially; give the splash screen a moment.
    x: mainWindowState.x,
    y: mainWindowState.y,
    width: mainWindowState.width,
    height: mainWindowState.height,
    // The 'icon' property doesn't work on macOS, which needs electron-packager.
    icon: path.join(__dirname, '..', '..', 'assets', 'icon_3.png'),
    webPreferences: {
      preload: path.join(__dirname, '..', 'renderer', 'preload.bundled.js'),
      additionalArguments: [
        // Args passed to the renderer preload script.
        '--windowId',
        windowId,
      ],

      nativeWindowOpen: true,

      // Below are best practices for security: renderer may run untrusted code.
      sandbox: true,
      nodeIntegration: false,
      contextIsolation: true,
    }
  });

  // Create a splash screen with a dedicated window.
  const splashWin = new BrowserWindow({
    width: 600,
    height: 400,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    webPreferences: {
      nativeWindowOpen: true,
      // Below are best practices for security: renderer may run untrusted code.
      nodeIntegration: false,
      contextIsolation: true,
    }
  });
  splashWin.setIgnoreMouseEvents(true);
  splashWin.loadFile(path.join(__dirname, '..', 'renderer', 'splash.html'));

  if (mainWindowState.maximized) {
    mainWin.maximize();
  }

  mainWindowState.trackWindowStateOf(mainWin);
  mainWin.loadFile(path.join(__dirname, '..', 'renderer', 'index.html'));
  mainWin.on('ready-to-show', () => {
    setTimeout(() => {
      splashWin.destroy();
      mainWin.show();
      mainWin.focus();
    }, 1000);
  });

  ipcMain.handle('dark-mode', (_: IpcMainInvokeEvent, action: string) => {
    if (action === 'toggle') {
      nativeTheme.themeSource =
          nativeTheme.shouldUseDarkColors ? 'light' : 'dark';
      return nativeTheme.shouldUseDarkColors;
    } else if (action === 'system') {
      nativeTheme.themeSource = 'system';
    }
  });

  // win.webContents.openDevTools();
}

// Browser windows can only be created after `app`'s 'ready' event is fired, at
// which point whenReady() resolves its promise.
app.whenReady().then(() => {
  createWindow();

  // This section is to make the app run like a native on macOS. In other words,
  // if there is no window present but the app is still running (a situation
  // unique to macOS), and an `activate` event comes, create a window.
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// On Windows and Linux, exiting all windows quits an application entirely. On
// macOS, however, the native behavior is apps should continue running even
// without any windows open.
app.on('window-all-closed', function() {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
