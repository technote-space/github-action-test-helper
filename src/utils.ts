import global from './global';
import { EOL } from 'os';
import fs from 'fs';
import SpyInstance = jest.SpyInstance;

export const testEnv = (): void => {
	const OLD_ENV = process.env;

	beforeEach(() => {
		jest.resetModules();
		process.env = {...OLD_ENV};
		delete process.env.NODE_ENV;
	});

	afterEach(() => {
		process.env = OLD_ENV;
	});
};

export const testChildProcess = (): void => {
	afterEach(() => {
		global.mockChildProcess.stdout = 'stdout';
		global.mockChildProcess.stderr = '';
		global.mockChildProcess.error = null;
	});
};

export const setChildProcessParams = (params: { stdout?: string; stderr?: string; error?: Error }): void => {
	if ('string' === typeof params.stdout) {
		global.mockChildProcess.stdout = params.stdout;
	}
	if ('string' === typeof params.stderr) {
		global.mockChildProcess.stderr = params.stderr;
	}
	if (params.error instanceof Error) {
		global.mockChildProcess.error = params.error;
	}
};

export const testFs = (defaultExists = false): (boolean) => void => {
	let exists = defaultExists;
	const spy: SpyInstance[] = [];
	beforeEach(() => {
		spy.push(jest.spyOn(fs, 'writeFileSync').mockImplementation(jest.fn()));
		spy.push(jest.spyOn(fs, 'mkdirSync').mockImplementation(jest.fn()));
		spy.push(jest.spyOn(fs, 'existsSync').mockImplementation(() => exists));
	});

	afterEach(() => {
		spy.forEach(spy => spy.mockRestore());
		spy.length = 0;
		exists = defaultExists;
	});

	return (flag: boolean): void => {
		exists = flag;
	};
};

export const spyOnStdout = (): SpyInstance => jest.spyOn(global.mockStdout, 'write');
export const stdoutCalledWith = (spyOnMock: SpyInstance, messages: string[]): void => {
	expect(spyOnMock).toBeCalledTimes(messages.length);
	messages.forEach((message, index) => {
		expect(spyOnMock.mock.calls[index][0]).toBe(message + EOL);
	});
};

export const spyOnExec = (): SpyInstance => jest.spyOn(global.mockChildProcess, 'exec');
export const execCalledWith = (spyOnMock: SpyInstance, messages: string[]): void => {
	expect(spyOnMock).toBeCalledTimes(messages.length);
	messages.forEach((message, index) => {
		expect(spyOnMock.mock.calls[index][0]).toBe(message);
	});
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
