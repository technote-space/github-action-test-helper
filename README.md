# GitHub Actions Test Helper

[![npm version](https://badge.fury.io/js/%40technote-space%2Fgithub-action-test-helper.svg)](https://badge.fury.io/js/%40technote-space%2Fgithub-action-test-helper)
[![CI Status](https://github.com/technote-space/github-action-test-helper/workflows/CI/badge.svg)](https://github.com/technote-space/github-action-test-helper/actions)
[![codecov](https://codecov.io/gh/technote-space/github-action-test-helper/branch/master/graph/badge.svg)](https://codecov.io/gh/technote-space/github-action-test-helper)
[![CodeFactor](https://www.codefactor.io/repository/github/technote-space/github-action-test-helper/badge)](https://www.codefactor.io/repository/github/technote-space/github-action-test-helper)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/technote-space/github-action-test-helper/blob/master/LICENSE)

Test helper for GitHub Actions.

*Read this in other languages: [English](README.md), [日本語](README.ja.md).*

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<details>
<summary>Details</summary>

- [Usage](#usage)
- [Author](#author)

</details>
<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Usage
1. Install  
`npm i @technote-space/github-action-test-helper`
1. Use
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
	spyOnExec,
	execCalledWith,
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
const execSpy = spyOnExec();
execCalledWith(execSpy, []);
testProperties({}, {});
setupGlobal();
getOctokit();
```

## Author
[GitHub (Technote)](https://github.com/technote-space)  
[Blog](https://technote.space)
