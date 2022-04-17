/* eslint-disable no-magic-numbers */
import { EOL } from 'os';
import { exec, spawn } from 'child_process';
import path from 'path';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import {
  testEnv,
  testChildProcess,
  setChildProcessParams,
  testFs,
  spyOnStdout,
  stdoutCalledWith,
  stdoutContains,
  stdoutNotContains,
  spyOnExec,
  spyOnSpawn,
  execCalledWith,
  execContains,
  execNotContains,
  testProperties,
  setActionEnv,
  getOctokit,
  getLogStdout,
} from '../src';
import global from '../src/global';
import fs from 'fs';

beforeAll(() => {
  process.env.TEST_ENV = 'test';
});

afterAll(() => {
  delete process.env.TEST_ENV;
});

describe('testEnv', () => {
  testEnv();

  it('should set env', () => {
    expect(process.env.TEST_ENV).toBe('test');
    process.env.TEST_ENV = 'change';
    expect(process.env.TEST_ENV).toBe('change');
  });

  it('should be reset env', () => {
    expect(process.env.TEST_ENV).toBe('test');
  });
});

describe('testEnv', () => {
  testEnv(path.resolve(__dirname, 'fixtures/test1'));

  it('should set action env', () => {
    expect(process.env).toHaveProperty('INPUT_TEST_ENV1');
    expect(process.env.INPUT_TEST_ENV1).toBe('test1');
    expect(process.env).toHaveProperty('INPUT_TEST_ENV2');
    expect(process.env.INPUT_TEST_ENV2).toBe('test2');
    expect(process.env).toHaveProperty('INPUT_TEST_ENV3');
    expect(process.env.INPUT_TEST_ENV3).toBe('test3');
    expect(process.env).not.toHaveProperty('INPUT_TEST_ENV4');
  });
});

describe('testChildProcess, setChildProcessParams', () => {
  testChildProcess();

  it('should set mock params', () => {
    expect(global.mockChildProcess.stdout).toBe('stdout');
    expect(global.mockChildProcess.stderr).toBe('');
    expect(global.mockChildProcess.error).toBe(null);
    expect(global.mockChildProcess.code).toBe(0);

    setChildProcessParams({
      stdout: 'test-stdout',
      stderr: 'test-stderr',
      error: new Error('test-error'),
      code: 123,
    });

    expect(global.mockChildProcess.stdout).toBe('test-stdout');
    expect(global.mockChildProcess.stderr).toBe('test-stderr');
    expect(global.mockChildProcess.error).not.toBe(false);
    expect(global.mockChildProcess.code).toBe(123);
  });

  it('should be reset env', () => {
    expect(global.mockChildProcess.stdout).toBe('stdout');
    expect(global.mockChildProcess.stderr).toBe('');
    expect(global.mockChildProcess.error).toBe(null);
    expect(global.mockChildProcess.code).toBe(0);
  });

  it('should not set mock params', () => {
    expect(global.mockChildProcess.stdout).toBe('stdout');
    expect(global.mockChildProcess.stderr).toBe('');
    expect(global.mockChildProcess.error).toBe(null);
    expect(global.mockChildProcess.code).toBe(0);

    setChildProcessParams({});

    expect(global.mockChildProcess.stdout).toBe('stdout');
    expect(global.mockChildProcess.stderr).toBe('');
    expect(global.mockChildProcess.error).toBe(null);
    expect(global.mockChildProcess.code).toBe(0);
  });

  it('should set mock params function 1', () => {
    const spy      = spyOnExec();
    const callback = vi.fn();
    expect(global.mockChildProcess.stdout).toBe('stdout');
    expect(global.mockChildProcess.stderr).toBe('');
    expect(global.mockChildProcess.error).toBe(null);
    expect(global.mockChildProcess.code).toBe(0);

    setChildProcessParams({
      stdout: (command: string): string => command === 'test1' ? 'stdout1' : 'stdout2',
      stderr: (command: string): string => command === 'test1' ? 'stderr1' : 'stderr2',
      error: (command: string): Error => command === 'test1' ? new Error('err1') : new Error('err2'),
    });

    exec('test1', callback);
    exec('test2', callback);

    execCalledWith(spy, [
      'test1',
      'test2',
    ]);
    expect(callback).toBeCalledTimes(2);
    expect(callback.mock.calls[0]).toHaveLength(3);
    expect(callback.mock.calls[0][0]).toEqual(new Error('err1'));
    expect(callback.mock.calls[0][1]).toBe('stdout1');
    expect(callback.mock.calls[0][2]).toBe('stderr1');
    expect(callback.mock.calls[1]).toHaveLength(3);
    expect(callback.mock.calls[1][0]).toEqual(new Error('err2'));
    expect(callback.mock.calls[1][1]).toBe('stdout2');
    expect(callback.mock.calls[1][2]).toBe('stderr2');
  });

  it('should set mock params function 2', async() => {
    const spy         = spyOnSpawn();
    const execCommand = (command: string, cwd?: string): Promise<{ stdout: string; stderr: string }> => {
      return new Promise((resolve, reject) => {
        const process = spawn(command, [], { shell: true, cwd });
        let stdout    = '';
        let stderr    = '';
        process.stdout.on('data', (data) => {
          console.log(data.toString());
          stdout += data.toString();
        });

        process.stderr.on('data', (data) => {
          console.error(data.toString());
          stderr += data.toString();
        });

        process.on('error', (err) => {
          reject(err);
        });
        process.on('close', (code) => {
          if (code) {
            reject(new Error(`process exited with code ${ code }`));
          }

          resolve({ stdout, stderr });
        });
      });
    };

    setChildProcessParams({
      stdout: (command: string): string => command === 'test1' ? 'stdout1' : 'stdout2',
      stderr: (command: string): string => command === 'test1' ? 'stderr1' : 'stderr2',
      error: (command: string): Error | null => command === 'test2' ? new Error('err2') : null,
      code: (command: string): number => command === 'test3' ? 1 : 0,
    });

    const { stdout, stderr } = await execCommand('test1');
    expect(stdout).toBe('stdout1');
    expect(stderr).toBe('stderr1');

    await expect(execCommand('test2')).rejects.toThrow('err2');
    await expect(execCommand('test3')).rejects.toThrow('process exited with code 1');

    execCalledWith(spy, [
      'test1',
      'test2',
      'test3',
    ]);
  });
});

describe('testFs', () => {
  describe('without default', () => {
    const func = testFs();

    it('should return false 1', () => {
      expect(fs.existsSync('')).toBe(false);
    });

    it('should return true', () => {
      func(true);
      expect(fs.existsSync('')).toBe(true);
    });

    it('should return false 2', () => {
      expect(fs.existsSync('')).toBe(false);
    });

    it('should return different each time', () => {
      func([true, false, true]);
      expect(fs.existsSync('')).toBe(true);
      expect(fs.existsSync('')).toBe(false);
      expect(fs.existsSync('')).toBe(true);
      expect(fs.existsSync('')).toBe(true);
    });

    it('should return result depends on file name', () => {
      func((filepath: string): boolean => filepath.includes('test'));
      expect(fs.existsSync('/tmp/test.txt')).toBe(true);
      expect(fs.existsSync('/tmp/abc.txt')).toBe(false);
    });
  });

  describe('with default true', () => {
    const func = testFs(true);

    it('should return true 1', () => {
      expect(fs.existsSync('')).toBe(true);
    });

    it('should return false', () => {
      func(false);
      expect(fs.existsSync('')).toBe(false);
    });

    it('should return true 2', () => {
      expect(fs.existsSync('')).toBe(true);
    });
  });

  describe('stop mock', () => {
    const func = testFs();

    it('should return false 1', () => {
      expect(fs.existsSync(path.resolve(__dirname, 'fixtures', 'config.yml'))).toBe(false);
    });

    it('should return true 1', () => {
      func(undefined);
      expect(fs.existsSync(path.resolve(__dirname, 'fixtures', 'config.yml'))).toBe(true);
    });

    it('should return true 2', () => {
      expect(fs.existsSync(path.resolve(__dirname, 'fixtures', 'config.yml'))).toBe(true);
    });

    it('should return false 2', () => {
      expect(fs.existsSync(path.resolve(__dirname, 'fixtures', 'config-test.yml'))).toBe(false);
    });
  });
});

describe('spyOnStdout, stdoutCalledWith, stdoutContains, stdoutNotContains, getLogStdout', () => {
  it('should spy on stdout', () => {
    const spy = spyOnStdout();

    process.stdout.write('test1' + EOL);
    process.stdout.write('test2' + EOL);
    console.log({
      test3: 'test3',
      test4: 'test4',
    });
    console.info({
      test5: 'test5',
      test6: 'test6',
    });
    console.error({
      test7: 'test7',
      test8: 'test8',
    });
    console.warn({
      test9: 'test9',
      test10: 'test10',
    });

    stdoutCalledWith(spy, [
      'test1',
      'test2',
      getLogStdout({
        test3: 'test3',
        test4: 'test4',
      }),
      getLogStdout({
        test5: 'test5',
        test6: 'test6',
      }, '__info__'),
      getLogStdout({
        test7: 'test7',
        test8: 'test8',
      }, '__error__'),
      getLogStdout({
        test9: 'test9',
        test10: 'test10',
      }, '__warning__'),
    ]);

    stdoutContains(spy, [
      'test2',
      getLogStdout({
        test7: 'test7',
        test8: 'test8',
      }, '__error__'),
    ]);

    expect(() => stdoutContains(spy, [
      'test3',
    ])).toThrow();

    stdoutNotContains(spy, [
      'test3',
    ]);

    expect(() => stdoutNotContains(spy, [
      'test1',
      'test2',
    ])).toThrow();
  });
});

describe('spyOnExec, spyOnSpawn, execCalledWith, execContains, execNotContains', () => {
  it('should spy on stdout 1', () => {
    const spy      = spyOnExec();
    const callback = vi.fn();

    exec('test1', callback);
    exec('test2', {}, callback);
    exec('test3', { cwd: '.work' }, callback);

    execCalledWith(spy, [
      'test1',
      'test2',
      ['test3', { cwd: '.work' }],
    ]);

    execContains(spy, [
      'test2',
      'test3',
    ]);

    expect(() => execContains(spy, [
      'test4',
    ])).toThrow();

    execNotContains(spy, [
      'test4',
    ]);

    expect(() => execNotContains(spy, [
      'test2',
      'test3',
    ])).toThrow();
  });

  it('should spy on stdout 2', async() => {
    const spy         = spyOnSpawn();
    const execCommand = (command: string, cwd?: string): Promise<{ stdout: string; stderr: string }> => {
      return new Promise((resolve, reject) => {
        const process = spawn(command, [], { shell: true, cwd });
        let stdout    = '';
        let stderr    = '';
        process.stdout.on('data', (data) => {
          console.log(data.toString());
          stdout += data.toString();
        });
        process.stdout.on('pause', () => {
          //
        });

        process.stderr.on('data', (data) => {
          console.error(data.toString());
          stderr += data.toString();
        });
        process.stderr.on('end', () => {
          //
        });

        process.on('error', (err) => {
          reject(err);
        });
        process.on('close', () => {
          resolve({ stdout, stderr });
        });
        process.on('exit', () => {
          //
        });
      });
    };

    await execCommand('test1');
    await execCommand('test2', '.work');

    execCalledWith(spy, [
      'test1',
      ['test2', [], { shell: true, cwd: '.work' }],
    ]);

    execContains(spy, [
      'test2',
      'test2',
    ]);

    expect(() => execContains(spy, [
      'test3',
    ])).toThrow();

    execNotContains(spy, [
      'test3',
    ]);

    expect(() => execNotContains(spy, [
      'test1',
      'test2',
    ])).toThrow();
  });
});

describe('testProperties', () => {
  it('should test properties', () => {
    testProperties({
      test1: 1,
      test2: 'test2',
      test3: [1, 2, 3],
      test4: { a: 'b' },
      test5: 1,
      test6: 'test2',
      test7: [1, 2, 3],
      test8: { a: 'b' },
    }, {
      test1: 1,
      test2: 'test2',
      test3: [1, 2, 3],
      test4: { a: 'b' },
    });
  });

  it('should throw error', () => {
    expect(() => {
      testProperties({
        test1: 1,
        test2: 'test2',
        test3: [1, 2, 3],
        test4: { a: 'b' },
        test5: 1,
        test6: 'test2',
        test7: [1, 2, 3],
        test8: { a: 'b' },
      }, {
        test1: 1,
        test2: 'test2',
        test3: [1, 2, 3],
        test4: { a: 'c' },
      });
    }).toThrow();
  });
});

describe('setActionEnv', () => {
  testEnv();

  it('should set action env', () => {
    expect(process.env).not.toHaveProperty('INPUT_TEST_ENV1');
    expect(process.env).not.toHaveProperty('INPUT_TEST_ENV2');
    expect(process.env).not.toHaveProperty('INPUT_TEST_ENV3');
    expect(process.env).not.toHaveProperty('INPUT_TEST-ENV5');

    expect(setActionEnv(path.resolve(__dirname, 'fixtures/test1'))).toEqual([
      {
        key: 'INPUT_TEST_ENV1',
        value: 'test1',
      },
      {
        key: 'INPUT_TEST_ENV2',
        value: 'test2',
      },
      {
        key: 'INPUT_TEST_ENV3',
        value: 'test3',
      },
      {
        key: 'INPUT_TEST-ENV5',
        value: 'test5',
      },
    ]);

    expect(process.env).toHaveProperty('INPUT_TEST_ENV1');
    expect(process.env.INPUT_TEST_ENV1).toBe('test1');
    expect(process.env).toHaveProperty('INPUT_TEST_ENV2');
    expect(process.env.INPUT_TEST_ENV2).toBe('test2');
    expect(process.env).toHaveProperty('INPUT_TEST_ENV3');
    expect(process.env.INPUT_TEST_ENV3).toBe('test3');
    expect(process.env).not.toHaveProperty('INPUT_TEST_ENV4');
    expect(process.env).toHaveProperty('INPUT_TEST-ENV5');
    expect(process.env['INPUT_TEST-ENV5']).toBe('test5');
  });

  it('should not set action env', () => {
    expect(setActionEnv(path.resolve(__dirname, 'fixtures/test2'))).toEqual([]);
  });
});

describe('getOctokit', () => {
  it('should return octokit', () => {
    expect(() => getOctokit()).not.toThrow();
    expect(() => getOctokit('token')).not.toThrow();
  });
});
