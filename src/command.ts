import * as core from '@actions/core' ;
import SpyInstance = jest.SpyInstance;

export const spyOnExportVariable      = (): SpyInstance => jest.spyOn(core, 'exportVariable').mockReturnValue();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const exportVariableCalledWith = (spyOnMock: SpyInstance, pairs: { name: string, val: any }[]): void => {
  expect(spyOnMock).toBeCalledTimes(pairs.length);
  pairs.forEach(({name, val}, index) => {
    expect(spyOnMock.mock.calls[index][0]).toBe(name);
    expect(spyOnMock.mock.calls[index][1]).toEqual(val);
  });
};
