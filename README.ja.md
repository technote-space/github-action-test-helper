# GitHub Action Test Helper

[![npm version](https://badge.fury.io/js/%40technote-space%2Fgithub-action-test-helper.svg)](https://badge.fury.io/js/%40technote-space%2Fgithub-action-test-helper)
[![Build Status](https://github.com/technote-space/github-action-test-helper/workflows/Build/badge.svg)](https://github.com/technote-space/github-action-test-helper/actions)
[![Coverage Status](https://coveralls.io/repos/github/technote-space/github-action-test-helper/badge.svg?branch=master)](https://coveralls.io/github/technote-space/github-action-test-helper?branch=master)
[![CodeFactor](https://www.codefactor.io/repository/github/technote-space/github-action-test-helper/badge)](https://www.codefactor.io/repository/github/technote-space/github-action-test-helper)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/technote-space/github-action-test-helper/blob/master/LICENSE)

GitHub Action 用テストヘルパー

*Read this in other languages: [English](README.md), [日本語](README.ja.md).*

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**

- [Setup](#setup)
  - [yarn](#yarn)
  - [npm](#npm)
- [Author](#author)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## 使用方法
1. インストール  
`npm i @technote-space/github-action-test-helper`
1. 使用
```js
import { getContext, encodeContent, getConfigFixture, getApiFixture, disableNetConnect, testEnv } from '@technote-space/github-action-test-helper';
import nock from 'nock';

getContext({});
encodeContent('content');
getConfigFixture('rootDir', 'fileName');
getApiFixture('rootDir', 'name');
disableNetConnect(nock);
testEnv();
```

## Author
[GitHub (Technote)](https://github.com/technote-space)  
[Blog](https://technote.space)
