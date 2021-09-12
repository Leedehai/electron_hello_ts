// Copyright (c) 2021 Leedehai. All rights reserved.
// Use of this source code is governed under the MIT LICENSE.txt file.

// Ensure this file is treated by the TypeScript compiler as an ES6 module: if
// there's no other import or export, an empty export suffices.
export {};

declare global {
  interface Window {
    windowId: string;
    darkMode: {
      set: (action: string) => Promise<boolean>,
    };
  }
}
