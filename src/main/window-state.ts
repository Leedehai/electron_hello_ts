// Copyright (c) 2021 Leedehai. All rights reserved.
// Use of this source code is governed under the MIT LICENSE.txt file.
// Copyright (c) 2015 Jakub Szwacz
// Copyright (c) Marcel Wiehle <marcel@wiehle.me> (http://marcel.wiehle.me)
// -----
// A utility to save and restore window state data to a file.
// This is a TypeScript refactor (with functionality altered) of package
// electron-window-state:
// https://github.com/mawie81/electron-window-state/blob/v5.0.3/index.js
//
// Example:
// const windowStateKeeper = new WindowStateKeeper({
//   defaultWidth: 800,
//   defaultHeight: 600,
// });
// const win = new BrowserWindow({
//   x: windowStateKeeper.x,
//   y: windowStateKeeper.y,
//   width: windowStateKeeper.width,
//   height: windowStateKeeper.height,
//   ...
// });
// if (windowStateKeeper.maximized) {
//   win.maximize();
// }
//
// // After this call, the window state file will be updated on window closing.
// windowStateKeeper.trackWindowStateOf(win);

import {app, BrowserWindow} from 'electron';
import fs from 'graceful-fs';
import jsonfile from 'jsonfile';
import path from 'path';
import {debounce} from 'throttle-debounce';

/**
 * The data structure used to initialize WindowStateKeeper.
 */
type WindowStateKeeperOptions = {
  fileDirectory?: string,
  fileBaseName?: string,
  // Default state if there is no previous state loaded from file.
  defaultMaximize?: boolean,
  defaultWidth?: number,
  defaultHeight?: number,
  defaultX?: number,
  defaultY?: number,
};

/**
 * The data structure stored to file.
 */
type WindowStateData = {
  maxmized: boolean,
  width: number,
  height: number,
  x: number,
  y: number,
};

/**
 * A utility to save and restore window state data to a file.
 */
export class WindowStateKeeper {
  maximized: boolean;
  width: number;
  height: number;
  x: number;
  y: number;

  private win: BrowserWindow|null;
  private readonly stateFile: string;
  private readonly debouncedUpdateState =
      debounce(100, this.updateState.bind(this));
  // Store the results of these bind expressions as members so that
  // removeEventListener is able to locate and remove the listeners.
  private readonly boundHandleStateChange = this.handleStateChange.bind(this);
  private readonly boundHandleClose = this.handleClose.bind(this);

  constructor(options: WindowStateKeeperOptions) {
    this.win = null;  // Call trackWindow() to set the window.

    this.stateFile = path.join(
        options.fileDirectory ?? app.getPath('userData'),
        options.fileBaseName ?? 'window-state.json');

    let previousStateData: WindowStateData|null = null;
    try {
      // Try loading a previous window state file, which might be absent.
      previousStateData = jsonfile.readFileSync(this.stateFile);
    } catch (_) {
    }

    this.maximized =
        previousStateData?.maxmized ?? options.defaultMaximize ?? false;
    this.width = previousStateData?.width ?? options.defaultWidth ?? 800;
    this.height = previousStateData?.height ?? options.defaultHeight ?? 600;
    this.x = previousStateData?.x ?? options.defaultX ?? 0;
    this.y = previousStateData?.y ?? options.defaultY ?? 0;
  }

  private addEventListeners() {
    if (!this.win) {
      return;
    }
    this.win.on('move', this.boundHandleStateChange);
    this.win.on('resize', this.boundHandleStateChange);
    this.win.on('close', this.boundHandleClose);
    this.win.on('closed', this.boundHandleClose);
  }

  private removeEventListeners() {
    if (!this.win) {
      return;
    }
    this.win.removeListener('move', this.boundHandleStateChange);
    this.win.removeListener('resize', this.boundHandleStateChange);
    this.win.removeListener('close', this.boundHandleClose);
    this.win.removeListener('closed', this.boundHandleClose);
  }

  trackWindowStateOf(window: BrowserWindow): void {
    this.win = window;
    this.addEventListeners();
  }

  isNormal(): boolean {
    if (!this.win) {
      return false;
    }

    return !this.win.isMaximized() && !this.win.isMinimized() &&
        !this.win.isFullScreen();
  }

  handleStateChange(): void {
    this.debouncedUpdateState();
  }

  handleClose(): void {
    if (!this.win) {
      return;
    }

    this.removeEventListeners();
    this.win = null;

    this.saveStateToDisk();
  }

  updateState(): void {
    if (!this.win) {
      return;
    }

    // Don't throw an error when window was closed.
    try {
      const winBounds = this.win.getBounds();
      if (this.isNormal()) {
        this.width = winBounds.width;
        this.height = winBounds.height;
        this.x = winBounds.x;
        this.y = winBounds.y;
      }
      this.maximized = this.win.isMaximized();
    } catch (_) {
    }
  }

  saveStateToDisk(): void {
    try {
      fs.mkdirSync(path.dirname(this.stateFile), {recursive: true});
      jsonfile.writeFileSync(this.stateFile, <WindowStateData>({
                               maxmized: this.maximized,
                               width: this.width,
                               height: this.height,
                               x: this.x,
                               y: this.y,
                             }));
    } catch (err) {
      // Don't care
    }
  }
}
