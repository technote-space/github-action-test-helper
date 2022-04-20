import type { SpyInstance } from 'vitest';
import * as core from '@actions/core';
import { expect, vi } from 'vitest';

vi.mock('@actions/core');

export const spyOnExportVariable      = (): SpyInstance => vi.spyOn(core, 'exportVariable').mockReturnValue();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const exportVariableCalledWith = (spyOnMock: SpyInstance, pairs: { name: string, val: any }[]): void => {
  expect(spyOnMock).toBeCalledTimes(pairs.length);
  pairs.forEach(({ name, val }, index) => {
    expect(spyOnMock.mock.calls[index]![0]).toBe(name);
    expect(spyOnMock.mock.calls[index]![1]).toEqual(val);
  });
};

export const spyOnAddPath      = (): SpyInstance => vi.spyOn(core, 'addPath').mockReturnValue();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const addPathCalledWith = (spyOnMock: SpyInstance, paths: string[]): void => {
  expect(spyOnMock).toBeCalledTimes(paths.length);
  paths.forEach((path, index) => {
    expect(spyOnMock.mock.calls[index]![0]).toBe(path);
  });
};
