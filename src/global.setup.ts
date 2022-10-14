/* eslint-disable no-magic-numbers */
import type childProcess from 'child_process';
import { EOL } from 'os';
import { vi } from 'vitest';
import global from './global.js';

export const setupGlobal = (): void => {
  global.mockStdout    = {
    write: vi.fn(),
  };
  process.stdout.write = global.mockStdout.write;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  type converterType = (value: any) => boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const converter = (prefix = ''): converterType => (value: any): boolean => process.stdout.write(prefix + JSON.stringify(value, null, '\t') + EOL);
  console.log     = vi.fn(converter());
  console.info    = vi.fn(converter('__info__'));
  console.error   = vi.fn(converter('__error__'));
  console.warn    = vi.fn(converter('__warning__'));

  global.mockChildProcess = {
    stdout: 'stdout',
    stderr: '',
    error: null,
    code: 0,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    exec: vi.fn((...args: any[]) => {
      const callback = args.length === 2 ? args[1] : args[2];
      callback(
        typeof global.mockChildProcess.error === 'function' ? global.mockChildProcess.error(args[0]) : global.mockChildProcess.error,
        typeof global.mockChildProcess.stdout === 'function' ? global.mockChildProcess.stdout(args[0]) : global.mockChildProcess.stdout,
        typeof global.mockChildProcess.stderr === 'function' ? global.mockChildProcess.stderr(args[0]) : global.mockChildProcess.stderr,
      );
    }),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spawn: vi.fn((...args: any[]) => ({
      stdout: {
        on: (event, callback): void => {
          if (event === 'data') {
            callback(typeof global.mockChildProcess.stdout === 'function' ? global.mockChildProcess.stdout(args[0]) : global.mockChildProcess.stdout);
          }
        },
      },
      stderr: {
        on: (event, callback): void => {
          if (event === 'data') {
            callback(typeof global.mockChildProcess.stderr === 'function' ? global.mockChildProcess.stderr(args[0]) : global.mockChildProcess.stderr);
          }
        },
      },
      on: (event, callback): void => {
        if (event === 'error') {
          const error = typeof global.mockChildProcess.error === 'function' ? global.mockChildProcess.error(args[0]) : global.mockChildProcess.error;
          if (error) {
            callback(error);
          }
        } else if (event === 'close') {
          callback(typeof global.mockChildProcess.code === 'function' ? global.mockChildProcess.code(args[0]) : global.mockChildProcess.code);
        }
      },
    })),
  };
  vi.mock('child_process', async() => ({
    ...await vi.importActual<typeof childProcess>('child_process'),
    exec: global.mockChildProcess.exec,
    spawn: global.mockChildProcess.spawn,
  }));

  process.env.GITHUB_ACTOR        = 'octocat';
  process.env.GITHUB_PATH         = '/home/runner/work/_temp/_runner_file_commands/add_path_aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee';
  process.env.GITHUB_ENV          = '/home/runner/work/_temp/_runner_file_commands/set_env_aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee';
  process.env.GITHUB_STEP_SUMMARY = '/home/runner/work/_temp/_runner_file_commands/step_summary_aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee';
  process.env.GITHUB_STATE        = '/home/runner/work/_temp/_runner_file_commands/save_state_aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee';
  process.env.GITHUB_OUTPUT       = '/home/runner/work/_temp/_runner_file_commands/set_output_aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee';
};
