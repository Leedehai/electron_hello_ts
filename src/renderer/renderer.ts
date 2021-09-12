// Copyright (c) 2021 Leedehai. All rights reserved.
// Use of this source code is governed under the MIT LICENSE.txt file.
// -----
// "Client-side" script requested from index.html.

import 'styles/styles.css';

document.addEventListener('DOMContentLoaded', () => {
  const elementWindowId = document.querySelector<HTMLElement>('#window-id');
  if (elementWindowId) {
    elementWindowId.innerHTML = window.windowId;
  }

  const elementThemeSource =
      document.querySelector<HTMLElement>('#theme-source');

  const elementToggleDarkMode =
      document.querySelector<HTMLElement>('#toggle-dark-mode');

  if (elementToggleDarkMode) {
    elementToggleDarkMode.addEventListener('click', async () => {
      const isDarkMode = await window.darkMode.set('toggle');
      if (elementThemeSource) {
        elementThemeSource.innerHTML = isDarkMode ? 'Dark' : 'Light';
      }
    });
  }

  const elementResetThemeToSystem =
      document.querySelector<HTMLElement>('#reset-to-system');
  if (elementResetThemeToSystem) {
    elementResetThemeToSystem.addEventListener('click', async () => {
      await window.darkMode?.set('system');
      if (elementThemeSource) {
        elementThemeSource.innerHTML = 'System';
      }
    });
  }
});
