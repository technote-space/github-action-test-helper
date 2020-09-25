/* eslint-disable no-magic-numbers */
import {spyOnExportVariable, exportVariableCalledWith} from '../src';
import {exportVariable} from '@actions/core';

describe('spyOnExportVariable, exportVariableCalledWith', () => {
  it('should spy on exportVariable', () => {
    const spy = spyOnExportVariable();

    exportVariable('test-name1', 'test-value1');
    exportVariable('test-name2', ['test-value2-1', 'test-value2-2']);

    exportVariableCalledWith(spy, [
      {name: 'test-name1', val: 'test-value1'},
      {name: 'test-name2', val: ['test-value2-1', 'test-value2-2']},
    ]);
  });
});
