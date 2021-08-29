import global from './global';
import {EOL} from 'os';
import path from 'path';
import fs, {PathLike} from 'fs';
import {getOctokit as getOctokitInstance} from '@actions/github';
import {load} from 'js-yaml';
import SpyInstance = jest.SpyInstance;
import {Octokit} from './types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const setActionEnv = (rootDir: string): { [key: string]: any } => {
  const actionSetting = load(fs.readFileSync(path.resolve(rootDir, 'action.yml'), 'utf8')) as never || {};
  const inputs        = typeof actionSetting === 'object' && typeof actionSetting['inputs'] === 'object' ? actionSetting['inputs'] : {};
  const envs          = Object.keys(inputs).filter(key => 'default' in inputs[key]).map(key => ({
    key: `INPUT_${key.replace(/ /g, '_').toUpperCase()}`,
    value: `${inputs[key].default}`,
  }));
  envs.forEach(env => {
    process.env[env.key] = env.value;
  });
  return envs;
};

export const testEnv = (rootDir?: string): void => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = {...OLD_ENV};
    delete process.env.NODE_ENV;
    if (rootDir) {
      setActionEnv(rootDir);
    }
  });

  afterEach(() => {
    process.env = OLD_ENV;
  });
};

export const testChildProcess = (): void => {
  afterEach(() => {
    global.mockChildProcess.stdout = 'stdout';
    global.mockChildProcess.stderr = '';
    global.mockChildProcess.error  = null;
    global.mockChildProcess.code   = 0;
  });
};

export const setChildProcessParams = (params: {
  stdout?: string | ((command: string) => string);
  stderr?: string | ((command: string) => string);
  error?: Error | ((command: string) => Error | null);
  code?: number | ((command: string) => number);
}): void => {
  if (typeof params.stdout === 'string' || typeof params.stdout === 'function') {
    global.mockChildProcess.stdout = params.stdout;
  }
  if (typeof params.stderr === 'string' || typeof params.stderr === 'function') {
    global.mockChildProcess.stderr = params.stderr;
  }
  if (params.error instanceof Error || typeof params.error === 'function') {
    global.mockChildProcess.error = params.error;
  }
  if (typeof params.code === 'number' || typeof params.code === 'function') {
    global.mockChildProcess.code = params.code;
  }
};

export const testFs = (defaultExists = false): (boolean) => void => {
  let existsData: boolean[]                         = [defaultExists];
  let callback: ((PathLike) => boolean) | undefined = undefined;
  let count                                         = 0;
  let stop                                          = false;
  const spy: SpyInstance[]                          = [];

  const setupMock = (): void => {
    if (stop) {
      return;
    }
    spy.push(jest.spyOn(fs, 'writeFileSync').mockImplementation(jest.fn()));
    spy.push(jest.spyOn(fs, 'mkdirSync').mockImplementation(jest.fn()));
    spy.push(jest.spyOn(fs, 'existsSync').mockImplementation((path: PathLike): boolean => {
      if (typeof callback === 'function') {
        return callback(path);
      }

      // eslint-disable-next-line no-magic-numbers
      const result = count < existsData.length ? existsData[count] : existsData[existsData.length - 1];
      count++;
      return result;
    }));
  };
  const clearMock = (): void => {
    spy.forEach(spy => spy.mockRestore());
    spy.length = 0;
    callback   = undefined;
    existsData = [defaultExists];
    // eslint-disable-next-line no-magic-numbers
    count      = 0;
  };

  beforeEach(setupMock);

  afterEach(clearMock);

  return (flag: boolean | boolean[] | ((PathLike) => boolean) | undefined): void => {
    callback = undefined;
    stop     = false;
    if (undefined === flag) {
      stop = true;
      clearMock();
    } else if (typeof flag === 'function') {
      callback = flag;
    } else if (typeof flag === 'boolean') {
      existsData = [flag];
    } else {
      existsData = flag;
    }
  };
};

export const spyOnStdout       = (): SpyInstance => jest.spyOn(global.mockStdout, 'write');
export const stdoutCalledWith  = (spyOnMock: SpyInstance, messages: string[]): void => {
  expect(spyOnMock).toBeCalledTimes(messages.length);
  messages.forEach((message, index) => {
    expect(spyOnMock.mock.calls[index][0]).toBe(message + EOL);
  });
};
export const stdoutContains    = (spyOnMock: SpyInstance, messages: string[]): void => {
  expect(spyOnMock.mock.calls.map(value => value[0].trim())).toEqual(expect.arrayContaining(messages));
};
export const stdoutNotContains = (spyOnMock: SpyInstance, messages: string[]): void => {
  expect(spyOnMock.mock.calls.map(value => value[0].trim())).toEqual(expect.not.arrayContaining(messages));
};

export const spyOnExec       = (): SpyInstance => jest.spyOn(global.mockChildProcess, 'exec');
export const spyOnSpawn      = (): SpyInstance => jest.spyOn(global.mockChildProcess, 'spawn');
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const execCalledWith  = (spyOnMock: SpyInstance, messages: (string | any[])[]): void => {
  expect(spyOnMock).toBeCalledTimes(messages.length);
  messages.forEach((message, index) => {
    if (typeof message === 'string') {
      expect(spyOnMock.mock.calls[index][0]).toBe(message);
    } else {
      message.forEach((message, index2) => {
        if (typeof spyOnMock.mock.calls[index][index2] === 'object') {
          expect(spyOnMock.mock.calls[index][index2]).toEqual(message);
        } else {
          expect(spyOnMock.mock.calls[index][index2]).toBe(message);
        }
      });
    }
  });
};
export const execContains    = (spyOnMock: SpyInstance, messages: string[]): void => {
  expect(spyOnMock.mock.calls.map(value => value[0])).toEqual(expect.arrayContaining(messages));
};
export const execNotContains = (spyOnMock: SpyInstance, messages: string[]): void => {
  expect(spyOnMock.mock.calls.map(value => value[0])).toEqual(expect.not.arrayContaining(messages));
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/explicit-module-boundary-types
export const getLogStdout = (value: any, prefix = ''): string => prefix + JSON.stringify(value, null, '\t');

// eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/explicit-module-boundary-types
export const testProperties = (object: any, checks: { [key: string]: any }): void => {
  expect(typeof object).toBe('object');
  Object.keys(checks).forEach(key => {
    expect(object).toHaveProperty(key);
    if (typeof checks[key] === 'object') {
      expect(object[key]).toEqual(checks[key]);
    } else {
      expect(object[key]).toBe(checks[key]);
    }
  });
};

export const getOctokit = (token?: string): Octokit => getOctokitInstance(token ?? 'test-token') as Octokit;
