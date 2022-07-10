
# Comment for Issue 10025

- [jest.mock does not mock an ES module without Babel #10025](https://github.com/facebook/jest/issues/10025)

## 2022/07/09

I am trying to find workaround for Jest ESM support without Babel.

Based on the [Jest examples/manual-mocks](https://github.com/facebook/jest/tree/main/examples/manual-mocks),
I modified the source and configuration files, and found the follows:

1. I fix some bugs for test userMocked.test.js, but test fails due to the result is not match to the mock's object.
2. I fix some bugs for test file_summarizer.test.js, and test pass.

I can not find how to use jest.mock for ES Modules import.

My example project is [juggernautjp/jest-manual-mocks-example](https://github.com/juggernautjp/jest-manual-mocks-example),
so you can modify and verify by downloading from my repository.

If someone has any idea to fix my bugs, will you please let me know?


## 2022/07/10

My previous post is not good enough to understand, so I rewrite and post about it again.

As you know, the Jest example of [manual-mocks](https://github.com/facebook/jest/tree/main/examples/manual-mocks) work correctly with Babel.
I have tried modifying to work that example without Babel, and I found the follows:

1. `jest.mock()` works: when ES Module require CommonJS module with Node.js [`module.createRequire(filename)`](https://nodejs.org/api/module.html#modulecreaterequirefilename) method
  - e.g., FileSummarizer.cjs `require` Manual mock CommonJS module of fs.cjs.
2. `jest.mock()` dose **not** work: when MS Module `import` ES Module.
  - e.g., when userMocked.test.js `import` Manual mock ES Module of models/user.mjs, `user.getAuthenticated()` return value of model/user.mjs instead of that of model/__mocks__/user.mjs.

After the above the 2nd problem would be fixed, I could use `jest.mock` with Manual Mocks of `import('node:fs/promise')`.

For further information, see [my repository](https://github.com/juggernautjp/jest-manual-mocks-example).
