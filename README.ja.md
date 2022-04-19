# GitHub Actions Test Helper

[![npm version](https://badge.fury.io/js/%40technote-space%2Fgithub-action-test-helper.svg)](https://badge.fury.io/js/%40technote-space%2Fgithub-action-test-helper)
[![CI Status](https://github.com/technote-space/github-action-test-helper/workflows/CI/badge.svg)](https://github.com/technote-space/github-action-test-helper/actions)
[![codecov](https://codecov.io/gh/technote-space/github-action-test-helper/branch/master/graph/badge.svg)](https://codecov.io/gh/technote-space/github-action-test-helper)
[![CodeFactor](https://www.codefactor.io/repository/github/technote-space/github-action-test-helper/badge)](https://www.codefactor.io/repository/github/technote-space/github-action-test-helper)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/technote-space/github-action-test-helper/blob/master/LICENSE)

GitHub Actions 用テストヘルパー

*Read this in other languages: [English](README.md), [日本語](README.ja.md).*

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<details>
<summary>Details</summary>

- [使用方法](#%E4%BD%BF%E7%94%A8%E6%96%B9%E6%B3%95)
- [Author](#author)

</details>
<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## 使用方法
1. インストール  
`npm i @technote-space/github-action-test-helper`
2. Vitest の設定
```js
/// <reference types="vitest" />
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  test: {
    setupFiles: './src/setup.ts',
    clearMocks: true,
    mockReset: true,
    restoreMocks: true,
    coverage: {
      reporter: ['html', 'lcov'],
    },
    deps: {
      // 以下の設定が必要
      inline: [/github-action-test-helper/]
    },
  },
});
```
3. 使用
```js
import {
	getContext,
	generateContext,
	encodeContent,
	getConfigFixture,
	getApiFixture,
	disableNetConnect,
	testEnv,
	testChildProcess,
	setChildProcessParams,
	testFs,
	spyOnStdout,
	stdoutCalledWith,
	stdoutContains,
	stdoutNotContains,
	spyOnExec,
	execCalledWith,
	execContains,
	execNotContains,
	testProperties,
	setupGlobal,
	getOctokit,
} from '@technote-space/github-action-test-helper';
import nock from 'nock';

getContext({});
generateContext({});
encodeContent('content');
getConfigFixture('rootDir', 'fileName');
getApiFixture('rootDir', 'name');
disableNetConnect(nock);
testEnv();
testChildProcess();
setChildProcessParams({stdout: 'test-stdout', stderr: 'test-stderr', error: new Error('test-error')});
testFs();
const stdoutSpy = spyOnStdout();
stdoutCalledWith(stdoutSpy, []);
stdoutContains(stdoutSpy, []);
stdoutNotContains(stdoutSpy, []);
const execSpy = spyOnExec();
execCalledWith(execSpy, []);
execContains(execSpy, []);
execNotContains(execSpy, []);
testProperties({}, {});
setupGlobal();
getOctokit();
```

## Author
[GitHub (Technote)](https://github.com/technote-space)  
[Blog](https://technote.space)
