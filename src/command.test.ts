/* eslint-disable no-magic-numbers */
import { addPath, exportVariable } from '@actions/core';
import { describe, it } from 'vitest';
import { spyOnExportVariable, exportVariableCalledWith, spyOnAddPath, addPathCalledWith } from '../src';

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
