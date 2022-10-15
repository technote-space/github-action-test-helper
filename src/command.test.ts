/* eslint-disable no-magic-numbers */
import { addPath, exportVariable, setOutput } from '@actions/core';
import { describe, it } from 'vitest';
import { spyOnExportVariable, exportVariableCalledWith, spyOnAddPath, addPathCalledWith, spyOnSetOutput, setOutputCalledWith } from './command.js';

describe('spyOnExportVariable, exportVariableCalledWith', () => {
  it('should spy on exportVariable', () => {
    const spy = spyOnExportVariable();

    exportVariable('test-name1', 'test-value1');
    exportVariable('test-name2', ['test-value2-1', 'test-value2-2']);

    exportVariableCalledWith(spy, [
      { name: 'test-name1', val: 'test-value1' },
      { name: 'test-name2', val: ['test-value2-1', 'test-value2-2'] },
    ]);
  });
});

describe('spyOnAddPath, addPathCalledWith', () => {
  it('should spy on exportVariable', () => {
    const spy = spyOnAddPath();

    addPath('test-path1');
    addPath('test-path2');

    addPathCalledWith(spy, ['test-path1', 'test-path2']);
  });
});

describe('spyOnSetOutput, setOutputCalledWith', () => {
  it('should spy on setOutput', () => {
    const spy = spyOnSetOutput();

    setOutput('test-name1', 'test-value1');
    setOutput('test-name2', ['test-value2-1', 'test-value2-2']);

    setOutputCalledWith(spy, [
      { name: 'test-name1', value: 'test-value1' },
      { name: 'test-name2', value: ['test-value2-1', 'test-value2-2'] },
    ]);
  });
});
