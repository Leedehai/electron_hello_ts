// Copyright (c) 2021 Leedehai. All rights reserved.
// Use of this source code is governed under the MIT LICENSE.txt file.
// -----
// A preload scripts runs in a renderer process before its web content begins
// loading. Though running within the renderer context, preload scripts are
// granted more privileges by having access to Node.js APIs, while still having
// access to both renderer globals (e.g. `window` and `document`).
//
// The app knows of this script's existence because it is passed to the
// BrowserWindow constructor in main.js.

import {contextBridge, ipcRenderer} from 'electron';

import minimist from 'minimist';

// ID of the main window.
const windowId = minimist(process.argv).windowId;

console.log('preload ' + windowId);

// Use contextBridge to provide renderer processes with functionalities offered
// by libraries from node_modules. We need this because for security purposes
// the renderer processes can't access node_modules.
contextBridge.exposeInMainWorld('darkMode', {
  set: (action: string) => ipcRenderer.invoke('dark-mode', action),
});

contextBridge.exposeInMainWorld('windowId', windowId);

window.addEventListener('DOMContentLoaded', () => {
  const replaceTextAtSelector = (selector: string, text: string) => {
    const element = document.getElementById(selector);
    if (element) {
      element.innerText = text;
    }
  };

  for (const dep of ['chrome', 'node', 'electron']) {
    replaceTextAtSelector(`${dep}-version`, process.versions[dep] as string);
  }
});
