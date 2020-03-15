/* eslint-disable no-magic-numbers */
import { EOL } from 'os';
import global from './global';

export const setupGlobal = (): void => {
	global.mockStdout    = {
		write: jest.fn(),
	};
	process.stdout.write = global.mockStdout.write;

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	type converterType = (value: any) => boolean;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const converter = (prefix = ''): converterType => (value: any): boolean => process.stdout.write(prefix + JSON.stringify(value, null, '\t') + EOL);
	console.log     = jest.fn(converter());
	console.info    = jest.fn(converter('__info__'));
	console.error   = jest.fn(converter('__error__'));
	console.warn    = jest.fn(converter('__warning__'));

	global.mockChildProcess = {
		stdout: 'stdout',
		stderr: '',
		error: null,
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		exec: jest.fn((...args: any[]) => {
			const callback = args.length === 2 ? args[1] : args[2];
			callback(
				typeof global.mockChildProcess.error === 'function' ? global.mockChildProcess.error(args[0]) : global.mockChildProcess.error,
				typeof global.mockChildProcess.stdout === 'function' ? global.mockChildProcess.stdout(args[0]) : global.mockChildProcess.stdout,
				typeof global.mockChildProcess.stderr === 'function' ? global.mockChildProcess.stderr(args[0]) : global.mockChildProcess.stderr,
			);
		}),
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		spawn: jest.fn((...args: any[]) => ({
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
					callback();
				}
			},
		})),
	};
	jest.mock('child_process', () => ({
		...jest.requireActual('child_process'),
		exec: global.mockChildProcess.exec,
		spawn: global.mockChildProcess.spawn,
	}));

	process.env.GITHUB_ACTOR = 'octocat';
};
