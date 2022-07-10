
# Note

> **Note:** You do not have to read this note.
> For yor your information, I wrote necessary information in repository's [README.md](../README.md).
> Some sentence is written in Japanese.



## Related documents and Issues

### Reference

1. Jest [ECMAScript Modules](https://jestjs.io/docs/ecmascript-modules), about jest's ECMAScript Modules (ESM) support
2. Node.js v18.4.0 [Modules: ECMAScript modules](https://nodejs.org/api/esm.htm)
3. Node.js v18.4.0 [Modules: CommonJS modules](https://nodejs.org/api/modules.html)
4. Node.js v18.4.0 [Modules: node:module API](https://nodejs.org/api/module.html)
5. Node.js v18.4.0 [Modules: Packages](https://nodejs.org/api/packages.html#determining-module-system)
  - [Determining module system](https://nodejs.org/api/packages.html#determining-module-system)
6. Node.js v18.4.0 [File system](https://nodejs.org/api/fs.html)
7. Node.js v18.4.0 [Path](https://nodejs.org/api/path.html)
8. [Axel Rauschmayer's book: "Exploring JS: Modules"](https://exploringjs.com/es6/ch_modules.html)
  - [16.5 The ECMAScript 6 module loader API](https://exploringjs.com/es6/ch_modules.html#sec_design-goals-es6-modules)

> ### 16.7 Details: imports as views on exports 
> The code in this section is available on GitHub.
> 
> Imports work differently in CommonJS and ES6:
> 
> - In CommonJS, imports are copies of exported values.
> - In ES6, imports are live read-only views on exported values.


### Jest Issues

1. [Meta: Native support for ES Modules #9430](https://github.com/facebook/jest/issues/9430)
  - [the comment](https://github.com/facebook/jest/issues/9430#issuecomment-616232029)
2. [jest.mock does not mock an ES module without Babel #10025](https://github.com/facebook/jest/issues/10025)



## How to initialize this example

1. download the project from [Jest examples/manual-mocks](https://github.com/facebook/jest/tree/main/examples/manual-mocks)
2. initialize npm and jest environment:

```bash
$ npm init
$ npm install jest --save-dev
$ npx jest --init
Typescript? no
Choose ... (node/jsdom)? node
Coverrage reports? yes
Provider for coverage (v8/babel)? v8
Automatically clear mock calls, instances, contexts and results before every test? yes
$ rm __mocks__/lodash.js __tests__/lodashMocking.test
```

3. modify the following configurations:

- *jest.config.js*

```js
// module.exports = {
export default {
  // 
  transform: {},
}
```

- *packages.json*

```json
  "type": "module",
  "scripts": {
    "test": "node --experimental-vm-modules node_modules/jest/bin/jest.js --silent",
    "dev:test": "node --experimental-vm-modules node_modules/jest/bin/jest.js --silent=false --verbose",
  },
```

- *__tests__/file_summarizer.test.js* and *__tests__/userMocked.test.js*

```js
import {jest} from '@jest/globals';
```



## Issues

1. *jest.config.js* include `transform: {}` line causes `ReferenceError: jest is not defined`.
2. *jest.config.js* dose not include `transform: {}` line causes `ReferenceError: require is not defined`.
3. *jest.config.js* include `transform: {}` and *file_summarizer.test.js* include `import {jest} from '@jest/globals';` causes the following error:
```js
 FAIL  __tests__/file_summarizer.test.js
  listFilesInDirectorySync
    × includes all files in the directory in the summary (1 ms)

  ● listFilesInDirectorySync › includes all files in the directory in the summary

    ReferenceError: require is not defined

      14 |   beforeEach(() => {
      15 |     // Set up some mocked out file info before each test
    > 16 |     require('fs').__setMockFiles(MOCK_FILE_INFO);
         |     ^
      17 |   });
      18 |
      19 |   it('includes all files in the directory in the summary', () => {

      at Object.<anonymous> (__tests__/file_summarizer.test.js:16:5)

 FAIL  __tests__/userMocked.test.js
  × if user model is mocked (6 ms)

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

       7 |
       8 | test('if user model is mocked', () => {
    >  9 |   expect(user.getAuthenticated()).toEqual({age: 622, name: 'Mock name'});
         |                                   ^
      10 | });
      11 |

      at Object.<anonymous> (__tests__/userMocked.test.js:9:35)
```



-----

## Note

### 1. solution advice in Jest community

- [fix: ESM mocks issue #1](https://github.com/neophyt3/jest-esm-demo/pull/1)

> See [facebook/jest#10025 (comment)](https://github.com/facebook/jest/issues/10025#issuecomment-716789840).
> 
> ESM modules always evaluate all import statements first. In your code, `jest.unstable_mockModule()` was called after modules are evaluate. Hence Jest can mock them.
> 
> The change is simple: first call `jest.unstable_mockModule()` and afterwards `use await import()` to load all mocked modules (including the ones which depend on the mocked ones).

- [facebook/jest#10025 (comment)](https://github.com/facebook/jest/issues/10025#issuecomment-716789840)

> One thing to note is that it will be impossible to mock import statements as they are evaluated before any code is executed - which means it's not possible to setup any mocks before we load the dependency. So you'll need to do something like this using import expressions.
> 
> ```js
> import { jest } from '@jest/globals';
> 
> jest.mockModule('someModule', async () => ({ foo: 'bar' }));
> 
> let someModule;
> 
> beforeAll(async () => {
>   someModule = await import('someModule');
> });
> 
> test('some test', () => {
>   expect(someModule.foo).toBe('bar');
> });
> ```
> 
> It will be a bit cleaner with top-level await
> 
> ```js
> import { jest } from '@jest/globals';
> 
> jest.mockModule('someModule', async () => ({ foo: 'bar' }));
> 
> const someModule = await import('someModule');
> 
> test('some test', () => {
>   expect(someModule.foo).toBe('bar');
> });
> ```
> 
> Any modules loaded by someModule via import statements would work though as we'd have time to setup our mocks before that code is evaluated.



### 2. vm importModuleDynamically parameter

- ref. [jest.mock does not mock an ES module without Babel #10025](https://github.com/facebook/jest/issues/10025#issuecomment-1159029161)

> if you want to test something fresh check out the new nodejs vm api it allows shiming ESModules
> 
> most of the vm. got now a importModuleDynamically parameter that allows you to set a callback for import()
> 
> hope that helps
> 
> ### Background
> 
> the vm module in nodejs got build to implement custom userland module systems :)
> 
> https://nodejs.org/api/vm.html#vmrunincontextcode-contextifiedobject-options
> 
> is what your looking for may god be with you

vm のほとんどに `importModuleDynamically` パラメータが追加され、`import()` のコールバックを設定できるようになりました。



### 3. test with `jest.createMockFromModule(moduleName)`, etc.

- [jest.createMockFromModule(moduleName)](https://jestjs.io/ja/docs/jest-object#jestcreatemockfrommodulemodulename)

のサンプルに従って、userMocked.test.js を下記のコードに変えるとエラーが発生する。

```js
const user = jest.createMockFromModule('../models/user.mjs').default;

test('implementation created by jest.createMockFromModule', () => {
  const expected = {
    age: 622,
    name: 'Mock name',
  }
  expect(user.getAuthenticated.mock).toBe(expected);
});
```

```js
Must use import to load ES Module: G:\Docs.repo\jest-manual-mocks-example\models\user.mjs

       6 | // syncBuiltinESMExports();
       7 |
    >  8 | const user = jest.createMockFromModule('../models/user.mjs').default;
         |                   ^
```


- [`jest.enableAutomock()`](https://jestjs.io/ja/docs/jest-object#jestenableautomock)

のサンプルに従って、userMocked.test.js を下記のコードに変えるとエラーが発生する。

```js
jest.enableAutomock();

import user from '../models/user.mjs';

test('original implementation', () => {
  const expected = {
    age: 622,
    name: 'Mock name',
  }
  expect(user.getAuthenticated._isMockFunction).toBe(expected);
});
```

```js
    expect(received).toBe(expected) // Object.is equality

    Expected: {"age": 622, "name": "Mock name"}
    Received: undefined

      15 |     name: 'Mock name',
      16 |   }
    > 17 |   expect(user.getAuthenticated._isMockFunction).toBe(expected);
         |                                                 ^
```


- [`jest.disableAutomock()`](https://jestjs.io/ja/docs/jest-object#jestdisableautomock)

のサンプルに従って、userMocked.test.js を下記のコードに変えるとエラーが発生する。

```js
import user from '../models/user.mjs';

jest.disableAutomock();

test('original implementation', () => {
  const expected = {
    age: 622,
    name: 'Mock name',
  }
  expect(user.getAuthenticated()).toBe(expected);
});
```

これは、user.test.js と同じ結果になる。つまり、models/user.mjs の 下記のオブジェクトを返す。

```js
{
  age: 622,
  name: 'Mock name',
}
```



### 4. Jest Issue #9430 (Japanese translation)

- Jest Issue, [Meta: Native support for ES Modules #9430](https://github.com/facebook/jest/issues/9430)

なお、Jest は [vm API](https://nodejs.org/api/vm.html) を利用しますが、
この API の ESM 部分にはまだフラグ (`--experimental-vm-modules`) が立っています (node v13.6 v16.10 )。

ですから、ESM がフラグ無しというのは、今のところちょっと語弊があります。
しかし、私たちは実験を始め、モジュール WG にフィードバックを提供する可能性があると思います。


- Jest Issue, [overlookmotel commented on 13 May](https://github.com/facebook/jest/issues/9430#issuecomment-1125906973)

CommonJS と ESM の違いの1つは、CommonJSのファイルには、各ファイルに変数を注入するラッパーがあることです。
これらの変数（`require` など）はグローバルであるように見えますが、実はそうではありません。
ラッパーで注入されるので、あるファイルの `require` の値は、別のファイルの `require` とは異なります。

CommonJS では、jest 変数も同じようにファイル単位で注入されていました。

ESM では、CommonJS のラッパーは存在しないので、これは不可能です。

`jest.fn` のすべての発生を `import.meta.jest.fn` に変更するのではなく、各テストファイルの先頭に `const {jest} = import.meta;` を追加すればよいでしょう。

もしあなたが本当にテストコードに変更を加えたくないのであれば、あなたのためにこれを行うために Babel プラグインを書くことができます。
しかし、おそらく手作業で行う方が簡単でしょう。


- [LinusU commented on 14 May](https://github.com/facebook/jest/issues/9430#issuecomment-1126190933)

また、グローバル変数に頼らず、直接 jest をインポートすることも可能です。

```js
import { jest } from '@jest/globals'.
```

- [segevfiner commented 5 days ago](https://github.com/facebook/jest/issues/9430#issuecomment-1173166494)

もう一つ、`jest.createMockFromModule` を追加するとよいでしょう。
ESM で動作することを確認し、また、モックされたモジュールの一部だけをオーバーライドするために、手動モック/モックファクトリーのコールバックで使用しようとするときに簡単に使用できるようにするためです。

ESM では、`module.exports = mod` や、TypeScript 特有の `export = mod` のように、オブジェクトをモジュールとして簡単に再エクスポートできないことが問題で、このようなシナリオではこの関数をそのまま使うのは非常に面倒で不可能なことなのです。



### 5. Node.js Module object

#### [`The Module object`](https://nodejs.org/api/module.html)

Provides general utility methods when interacting with instances of `Module`, 
the [module](https://nodejs.org/api/modules.html#the-module-object) variable often seen in CommonJS modules. 
Accessed via `import 'node:module'` or `require('node:module')`.


#### [`module.createRequire(filename)`](https://nodejs.org/api/module.html#modulecreaterequirefilename)

`filename` <string> | <URL> - Filename to be used to construct the require function. Must be a file URL object, file URL string, or absolute path string.
Returns: <require> Require function

```js
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);

// sibling-module.js is a CommonJS module.
const siblingModule = require('./sibling-module');
```


#### [`module.syncBuiltinESMExports()`](https://nodejs.org/api/module.html#modulecreaterequirefilename)

> The `module.syncBuiltinESMExports()` method updates all the live bindings for builtin ES Modules to match the properties of the CommonJS exports. 

`module.syncBuiltinESMExports()` メソッドは、組み込みの ES モジュールのすべてのライブバインディングを CommonJS exports のプロパティに一致するように更新します。

```js
const fs = require('node:fs');
const assert = require('node:assert');
const { syncBuiltinESMExports } = require('node:module');

fs.readFile = newAPI;

delete fs.readFileSync;

function newAPI() {
  // ...
}

fs.newAPI = newAPI;

syncBuiltinESMExports();

import('node:fs').then((esmFS) => {
  // It syncs the existing readFile property with the new value
  assert.strictEqual(esmFS.readFile, newAPI);
  // readFileSync has been deleted from the required fs
  assert.strictEqual('readFileSync' in fs, false);
  // syncBuiltinESMExports() does not remove readFileSync from esmFS
  assert.strictEqual('readFileSync' in esmFS, true);
  // syncBuiltinESMExports() does not add names
  assert.strictEqual(esmFS.newAPI, undefined);
});
```


### 6. Node.js Builtin modules

#### [Builtin modules](https://nodejs.org/api/esm.html#importmeta)

> [Core modules](https://nodejs.org/api/modules.html#core-modules) provide named exports of their public API. A default export is also provided which is the value of the CommonJS exports. The default export can be used for, among other things, modifying the named exports. Named exports of builtin modules are updated only by calling [module.syncBuiltinESMExports()](https://nodejs.org/api/module.html#modulesyncbuiltinesmexports).

[コアモジュール](https://nodejs.org/api/modules.html#core-modules) は、その公開 API の名前付きエクスポートを提供します。 また、CommonJS のエクスポートの値であるデフォルトのエクスポートも提供されます。 デフォルトエクスポートは、特に、名前付きエクスポートを修正するために使用することができます。 組み込みモジュールの名前付きエクスポートは、[module.syncBuiltinESMExports()](https://nodejs.org/api/module.html#modulesyncbuiltinesmexports) を呼び出すことによってのみ更新されます。

```js
import EventEmitter from 'node:events';
const e = new EventEmitter();
```

```js
import { readFile } from 'node:fs';
readFile('./foo.txt', (err, source) => {
  if (err) {
    console.error(err);
  } else {
    console.log(source);
  }
});
```

```js
import fs, { readFileSync } from 'node:fs';
import { syncBuiltinESMExports } from 'node:module';
import { Buffer } from 'node:buffer';

fs.readFileSync = () => Buffer.from('Hello, ESM');
syncBuiltinESMExports();

fs.readFileSync === readFileSync;
```


#### [module.syncBuiltinESMExports()](https://nodejs.org/api/module.html#modulesyncbuiltinesmexports)

> The `module.syncBuiltinESMExports()` method updates all the live bindings for builtin [ES Modules](https://nodejs.org/api/esm.html) to match the properties of the [CommonJS](https://nodejs.org/api/modules.html) exports. It does not add or remove exported names from the [ES Modules](https://nodejs.org/api/esm.html).

`module.syncBuiltinESMExports()` メソッドは、組み込みの [ES Modules](https://nodejs.org/api/esm.html) のすべてのライブバインディングを [CommonJS](https://nodejs.org/api/modules.html) のエクスポートのプロパティに一致するように更新します。 このメソッドは、[ES モジュール](https://nodejs.org/api/esm.html) からエクスポートされた名前を追加したり削除したりするものではありません。

```js
const fs = require('node:fs');
const assert = require('node:assert');
const { syncBuiltinESMExports } = require('node:module');

fs.readFile = newAPI;

delete fs.readFileSync;

function newAPI() {
  // ...
}

fs.newAPI = newAPI;

syncBuiltinESMExports();

import('node:fs').then((esmFS) => {
  // It syncs the existing readFile property with the new value
  // 既存の readFile プロパティを新しい値で同期させます
  assert.strictEqual(esmFS.readFile, newAPI);
  // readFileSync has been deleted from the required fs
  // readFileSync が require された fs から削除されました
  assert.strictEqual('readFileSync' in fs, false);
  // syncBuiltinESMExports() does not remove readFileSync from esmFS
  // syncBuiltinESMExports() は esmFS から readFileSync を削除しません
  assert.strictEqual('readFileSync' in esmFS, true);
  // syncBuiltinESMExports() does not add names
  // syncBuiltinESMExports() は名前を追加しません
  assert.strictEqual(esmFS.newAPI, undefined);
});
```


### 7. Node.js CommonJS and ES Module specification

#### [Interoperability with CommonJS](https://nodejs.org/api/esm.html#import-assertions)

- `import` statements

`import` 文は ES モジュールまたは CommonJS モジュールを参照することができます。
`import` 文は ES モジュールでのみ許可されていますが、CommonJS では ES モジュールをロードするための動的 `import()` 式がサポートされています。

CommonJS モジュールをインポートする場合、`module.exports` オブジェクトは、デフォルトのエクスポートとして提供されます。
名前付きエクスポートは、より良いエコシステムの互換性のための利便性として、静的解析によって提供され、利用可能な場合があります。

- `require`

CommonJS モジュールの require は、参照するファイルを常に CommonJS として扱います。

ES モジュールは非同期実行なので、ES モジュールをロードするために `require` を使用することはサポートされていません。
代わりに、`import()` を使用して、CommonJS モジュールからESモジュールをロードします。


#### [Differences between ES modules and CommonJS](https://nodejs.org/api/esm.html#import-assertions)

- No `require`, `exports`, or `module.exports`

ほとんどの場合、CommonJS モジュールをロードするために、ES モジュール `import` を使用することができます。

必要であれば、[`module.createRequire()`](https://nodejs.org/api/module.html#modulecreaterequirefilename) を使用して、
ES モジュール内で `require` 関数を構築することができます。

- No `__filename` or `__dirname`

これらの CommonJS 変数は、ESモジュールでは使用できません。

`__filename` と `__dirname` のユースケースは [import.meta.url](https://nodejs.org/api/esm.html#importmetaurl) で再現することができます。

- No Native Module Loading

ネイティブモジュールは、現在 ES モジュール `import` でサポートされていません。

代わりに [module.createRequire()](https://nodejs.org/api/module.html#modulecreaterequirefilename) や [process.dlopen](https://nodejs.org/api/process.html#processdlopenmodule-filename-flags) を使って読み込むことができます。

- No `require.resolve`

相対的な解決は、`new URL('./local', import.meta.url)` を介して処理することができます。

`require.resolve` の完全な置き換えのために、フラグ付きの実験的な [import.meta.resolve](https://nodejs.org/api/esm.html#importmetaresolvespecifier-parent) API があります。

また、`module.createRequire()` を使用することもできます。

- No `NODE_PATH`

`NODE_PATH` は `import` 指定子を解決する一部ではありません。この動作が必要な場合は、シンボリックリンクを使用してください。

- No `require.extensions`

`require.extensions` は `import` では使用されません。将来的には loader hooks がこのワークフローを提供できるようになることが期待されています。

- No `require.cache`

`require.cache` は、ES モジュールローダーが独自にキャッシュを持つため、`import` では使用されません。


#### Node.js v18.5.0 [The `.mjs` extension](https://nodejs.org/api/modules.html#the-mjs-extension)

> Due to the synchronous nature of `require()`, it is not possible to use it to load ECMAScript module files. Attempting to do so will throw a [ERR_REQUIRE_ESM](https://nodejs.org/api/errors.html#err_require_esm) error. Use [import()](https://wiki.developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import#Dynamic_Imports) instead.
>
> The .mjs extension is reserved for [ECMAScript Modules](https://nodejs.org/api/esm.html) which cannot be loaded via `require()`. See [Determining module system](https://nodejs.org/api/packages.html#determining-module-system) section for more info regarding which files are parsed as ECMAScript modules.


#### Node.js v18.5.0 [Determining module system](https://nodejs.org/api/packages.html#determining-module-system)

> ES Module: `.mjs`, `.js` with `"type": "module"` in package.json, `--input-type=module`.
> CommonJS:  `.cjs`, `.js` with `"type": "commonjs"` in package.json, `--input-type=commonjs`.
> 
> **Module loaders**:
> 1. CommonJS module loader:  `require`, support [folders as modules](https://nodejs.org/api/modules.html#folders-as-modules), `.js/.json/.node`
>   - It cannot be used to load ECMAScript modules (although it is possible to load ECMASCript modules from CommonJS modules). When used to load a JavaScript text file that is not an ECMAScript module, it loads it as a CommonJS module.
CommonJS module loader は、ECMAScript モジュールのロードには使用できません（CommonJS モジュールから ECMASCript モジュールをロードすることは可能です）。 ECMAScript モジュールでない JavaScript テキストファイルのロードに使用した場合、CommonJS モジュールとしてロードします。
> 2. ECMAScript module loader:  `import`, customized using [loader hooks](https://nodejs.org/api/esm.html#loaders), `.js/.mjs/.cjs`
>   - It can be used to load JavaScript CommonJS modules. Such modules are passed through the es-module-lexer to try to identify named exports, which are available if they can be determined through static analysis. Imported CommonJS modules have their URLs converted to absolute paths and are then loaded via the CommonJS module loader.
ECMAScript module loader は、JavaScript CommonJS モジュールをロードするために使用することができます。このようなモジュールは、es-module-lexer を通して名前付きエクスポートの特定を試み、静的解析で判断できる場合は利用可能です。インポートされた CommonJS モジュールは、その URL が絶対パスに変換され、CommonJS モジュールローダーを介してロードされます。




### 8. Understanding the Jest source code

- *packages/jest-runtime/src/index.ts*

```ts
  async unstable_importModule() {
    // 'You need to run with a version of node that supports ES Modules in the VM API. 
    // See https://jestjs.io/docs/ecmascript-modules',
    const module = await this.loadEsmModule(modulePath, query);
  }

  private loadCjsAsEsm() {
  }

  private getExportsOfCjs(modulePath: string) {
  }

  requireModule<T = unknown>() : T {
    if (this.unstable_shouldLoadAsEsm(modulePath)) {
      // Node includes more info in the message
      const error: NodeJS.ErrnoException = new Error(
        `Must use import to load ES Module: ${modulePath}`,
      );
    }
  }

  requireActual<T = unknown>(from: string, moduleName: string): T {
    return this.requireModule<T>(from, moduleName, undefined, true);
  }

  requireMock<T = unknown>(from: string, moduleName: string): T {
    if (isManualMock) {
      this._loadModule(
        localModule,
        from,
        moduleName,
        modulePath,
        undefined,
        mockRegistry,
      );
      mockRegistry.set(moduleID, localModule.exports);
    } else {
     // Look for a real module to generate an automock from
      mockRegistry.set(moduleID, this._generateMock(from, moduleName));
    }
  }

  // 
  private _loadModule(
    localModule: InitialModule,
    from: string,
    moduleName: string | undefined,
    modulePath: string,
    options: InternalModuleOptions | undefined,
    moduleRegistry: ModuleRegistry,
  ) {
    if (path.extname(modulePath) === '.json') {
    } else if (path.extname(modulePath) === '.node') {
      localModule.exports = require(modulePath);
    } else {
      // Only include the fromPath if a moduleName is given. Else treat as root.
      const fromPath = moduleName ? from : null;
      this._execModule(localModule, options, moduleRegistry, fromPath);
    }
  }

  // `jest.createMockFromModule()`
  private _generateMock(from: string, moduleName: string) {
    {
      const mockMetadata = this._moduleMocker.getMetadata(moduleExports);
      if (mockMetadata == null) {
        throw new Error(
          `Failed to get mock metadata: ${modulePath}\n\n` +
            'See: https://jestjs.io/docs/manual-mocks#content',
        );
      }
      this._mockMetaDataCache.set(modulePath, mockMetadata);
    }
    // class ModuleMocker の _generateMock() メソッドにより Mock<T> 型を返す
    return this._moduleMocker.generateFromMetadata(
      // added above if missing
      this._mockMetaDataCache.get(modulePath)!,
    );
  }

    const jestObject: Jest = {
      // `jest.createMockFromModule()`
      createMockFromModule: (moduleName: string) =>
        this._generateMock(from, moduleName),
      doMock: mock,
      dontMock: unmock,
      enableAutomock,
      fn,
      genMockFromModule: (moduleName: string) =>
        this._generateMock(from, moduleName),
      mock,
      mocked,
    };

  const jestObject = this._createJestObjectFor(filename);

  private _createJestObjectFor(from: string): Jest {
    // `jest.mock()`
    const mock: Jest['mock'] = (moduleName, mockFactory, options) => {
      if (mockFactory !== undefined) {
        return setMockFactory(moduleName, mockFactory, options);
      }
      const moduleID = this._resolver.getModuleID(
        this._virtualMocks,
        from,
        moduleName,
        {conditions: this.cjsConditions},
      );
      this._explicitShouldMock.set(moduleID, true);
      return jestObject;
    };
    const setMockFactory = (
      moduleName: string,
      mockFactory: () => unknown,
      options?: {virtual?: boolean},
    ) => {
      this.setMock(from, moduleName, mockFactory, options);
      return jestObject;
    };
  }
```

- *packages/jest-environment/src/index.ts*

```ts
export interface Jest {
  createMockFromModule(moduleName: string): unknown;
  doMock(
    moduleName: string,
    moduleFactory?: () => unknown,
    options?: {virtual?: boolean},
  ): Jest;
  mock(
    moduleName: string,
    moduleFactory?: () => unknown,
    options?: {virtual?: boolean},
  ): Jest;
}
```



### 9. deleted code snippet from example file

- [MDN Web Docs - import - デフォルトをインポートする](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Statements/import#importing_defaults)

*__tests__/userMicked.test.js*

```js
(async () => {
  if (true) {
    const { default: user } = await import('../models/user.mjs');
  }
})();
```

上記のコードでは正常に動作しなかった。

- [Using with ES module imports](https://jestjs.io/docs/manual-mocks#using-with-es-module-imports)

> If you're using ES module imports then you'll normally be inclined to put your import statements at the top of the test file. But often you need to instruct Jest to use a mock before modules use it. For this reason, Jest will automatically hoist jest.mock calls to the top of the module (before any imports). To learn more about this and see it in action, see [this repo](https://github.com/kentcdodds/how-jest-mocking-works).

ES モジュールの import を使用している場合、通常 import 文はテストファイルの先頭に置くことになるでしょう。
しかし、モジュールがモックを使用する前に、Jest にモックを使用するように指示する必要があることがよくあります。
このため、Jest は jest.mock の呼び出しを自動的にモジュールの先頭（import の前）に持ってくるようにします。
これについての詳細や実際の動作は、[こちらのレポ](https://github.com/kentcdodds/how-jest-mocking-works) をご覧ください。




### 10. Conditional exports

- [Modules: Packages - Conditional exports](https://nodejs.org/api/packages.html#conditionalexports)

> Conditional exports provide a way to map to different paths depending on certain conditions. They are supported for both CommonJS and ES module imports.
>
> For example, a package that wants to provide different ES module exports for `require()` and `import` can be written:

条件付きエクスポートは、特定の条件に応じて異なるパスにマッピングする方法を提供します。これらは、CommonJS と ES module のインポートの両方でサポートされています。

例えば、`require()` と `import` で異なる ES module のエクスポートを提供したいパッケージは、以下のように記述することができます。

```json
// package.json
{
  "exports": {
    "import": "./index-module.js",
    "require": "./index-require.cjs"
  },
  "type": "module"
}
```
