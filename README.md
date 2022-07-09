
# Jest Manual Mocks example (jest-manual-mocks-example)

This example is explained in Jest Docs's [Manual Mocks](https://jestjs.io/docs/manual-mocks) section,
and the source files are downloaded from [Jest examples/manual-mocks](https://github.com/facebook/jest/tree/main/examples/manual-mocks).


## Purpose of this example

As mentioned in the [ECMAScript Modules](https://jestjs.io/docs/ecmascript-modules), jest's ECMAScript Modules (ESM) support is experimental.

This example is to find the workaround for Jest ES Module support without Babel, and is related to the following issues:

1. [Meta: Native support for ES Modules #9430](https://github.com/facebook/jest/issues/9430)
  - [the comment](https://github.com/facebook/jest/issues/9430#issuecomment-616232029)
2. [jest.mock does not mock an ES module without Babel #10025](https://github.com/facebook/jest/issues/10025)


## ESM and CommonJS interoperability

| file to import (require)  | file to be imported (required)  | Static Import | Dynamic Import | require |
|:----------------------------|:------------------------------|:-------------|:---------------|:-------|
| ESM  | ESM  | <span style='color:yellow'>OK</span>  | <span style='color:yellow'>OK</span>  | NG  |
| CJS  | CJS  | NG  | NG  | <span style='color:yellow'>OK</span>  |
| ESM  | CJS  | <span style='color:yellow'>OK</span>  | NG  | NG [^4]  |
| CJS  | ESM  | NG  | <span style='color:yellow'>OK</span>  | NG  |

> ESM (ES Modules), CJS (CommonJS), NG (No Good)

The above table is from the Blog post [TypeScript 4.7 と Native Node.js ESM](https://quramy.medium.com/typescript-4-7-%E3%81%A8-native-node-js-esm-189753a19ba8).



## How to initialize this example

```bash
$ git clone <this repository>
$ npm install
# jest --verbose
$ npm run dev:test
# or jest --silent
$ npm test
```


## My Test Environment

```yaml
OS: Windows11
Node: v16.15.1
Jest: v28.1.2
```


## Test and Result

| test file (__tests__/)   | file to be imported (required)    | Mock         | PASS/FAIL      |
|:-------------------------|:----------------------------------|:-------------|:---------------|
| file_summarizer.test.js  | FileSummarizer.cjs  | node/fs CommonJS Mock (ESM require CommonJS) | PASS [^1] |
| FileSummarizer.test.js   | FileSummarizer.js   | No Mock (ESM import node/fs module) | PASS |
| FileSummarizerCJS.test.js  | FileSummarizer.cjs  | No Mock (ESM require CommonJS) | PASS |
| FileSummarizerESM.test.js  | FileSummarizer.mjs  | No Mock (ESM require ESM)  | <span style='color:yellow'>FAIL</span> [^2] |
| user.test.js             | models/user.mjs     | No Mock (ESM import ESM)     | PASS |
| userMocked.test.js       | models/user.mjs     | ESM Mock (ESM import ESM)    | <span style='color:yellow'>FAIL</span> [^3] |


### Workaround

Babel based [Jest examples/manual-mocks](https://github.com/facebook/jest/tree/main/examples/manual-mocks) example is executable without Babel, 
after "FileSummarizer.js" is renamed to "FileSummarizer.cjs" and the following modification of "file_summarize.test.js":

```js
// 'use strict';
import { jest } from '@jest/globals';

// Node.js - `module.createRequire(filename)`
// https://nodejs.org/api/module.html#modulecreaterequirefilename
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);

jest.mock('fs');
```


### Issue 2

```js
 FAIL  __tests__/file_summarizerESM.test.js
  listFilesInDirectorySync
    × includes all files in the directory in the summary (1 ms)

  ● listFilesInDirectorySync › includes all files in the directory in the summary

    TypeError: fs.setMockFiles is not a function

      16 |     // Set up some mocked out file info before each test
      17 |     const fs = await import('node:fs');
    > 18 |     fs.setMockFiles(MOCK_FILE_INFO);
         |        ^
```


### Issue 3

`import('../models/user.mjs')` dose not import from 'models/__mocks__/user.mjs', but import 'models/user.mjs'.

```js
 FAIL  __tests__/userMocked.test.js
  × if user model is mocked (8 ms)

  ● if user model is mocked

    expect(received).toEqual(expected) // deep equality

    - Expected  - 2
    + Received  + 2

      Object {
    -   "age": 622,
    -   "name": "Mock name",
    +   "age": 26,
    +   "name": "Real name",
      }

      20 |   const user = await import('../models/user.mjs');
      21 |   const expected = { age: 622, name: 'Mock name' };
    > 22 |   expect(user.default.getAuthenticated()).toEqual(expected);
         |                                           ^
```


### syncBuiltinESMExports.cjs

syncBuiltinESMExports.cjs is from [Node.js - Modules: node:module API - `module.syncBuiltinESMExports()`](https://nodejs.org/api/module.html#modulesyncbuiltinesmexports)

To execute `node syncBuiltinESMExports.cjs` outputs nothing.



## Footnote

[^1]: explained below "Workaround" section
[^2]: explained below "Issue 1" section
[^3]: explained below "Issue 2" section
[^4]: The table marks "NG", but [`module.createRequire(filename)`](https://nodejs.org/api/module.html#modulecreaterequirefilename) enable ESM to require CJS.



## License

[MIT licensed](./LICENSE)

Facebook has the Copyright of the source code.
