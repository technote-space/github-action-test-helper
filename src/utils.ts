import global from './global';
import { EOL } from 'os';
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
