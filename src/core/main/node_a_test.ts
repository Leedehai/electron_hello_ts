// Copyright (c) 2021 Leedehai. All rights reserved.
// Use of this source code is governed under the MIT LICENSE.txt file.
// ---
// This file demonstrates a test that doesn't need browser API.
// See README.md for how to run tests.

import 'jasmine';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {WindowStateKeeper} from 'core/main/window_state';

describe('node_script_test', () => {
  it('demo a-1', () => {
    expect(true).toBe(true);
  });

  it('demo a-2', () => {
    expect(false).toBe(false);
  });
});
