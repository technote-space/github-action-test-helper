/* eslint-disable no-magic-numbers */
import { EOL } from 'os';
import { exec } from 'child_process';
import fs from 'fs';
import {
	testEnv,
	testChildProcess,
	setChildProcessParams,
	testFs,
	spyOnStdout,
	stdoutCalledWith,
	spyOnExec,
	execCalledWith,
	testProperties,
} from '../src';
import global from '../src/global';

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

describe('testChildProcess, setChildProcessParams', () => {
	testChildProcess();

	it('should set mock params', () => {
		expect(global.mockChildProcess.stdout).toBe('stdout');
		expect(global.mockChildProcess.stderr).toBe('');
		expect(global.mockChildProcess.error).toBe(null);
		expect(global.mockChildProcess.error).toBeFalsy();

		setChildProcessParams({stdout: 'test-stdout', stderr: 'test-stderr', error: new Error('test-error')});

		expect(global.mockChildProcess.stdout).toBe('test-stdout');
		expect(global.mockChildProcess.stderr).toBe('test-stderr');
		expect(global.mockChildProcess.error).not.toBeFalsy();
	});

	it('should be reset env', () => {
		expect(global.mockChildProcess.stdout).toBe('stdout');
		expect(global.mockChildProcess.stderr).toBe('');
		expect(global.mockChildProcess.error).toBe(null);
	});

	it('should not set mock params', () => {
		expect(global.mockChildProcess.stdout).toBe('stdout');
		expect(global.mockChildProcess.stderr).toBe('');
		expect(global.mockChildProcess.error).toBe(null);

		setChildProcessParams({});

		expect(global.mockChildProcess.stdout).toBe('stdout');
		expect(global.mockChildProcess.stderr).toBe('');
		expect(global.mockChildProcess.error).toBe(null);
	});
});

describe('testFs', () => {
	const func = testFs();

	it('should return false 1', () => {
		expect(fs.existsSync('')).toBeFalsy();
	});

	it('should return true', () => {
		func(true);
		expect(fs.existsSync('')).toBeTruthy();
	});

	it('should return false 2', () => {
		expect(fs.existsSync('')).toBeFalsy();
	});
});

describe('spyOnStdout, stdoutCalledWith', () => {
	it('should spy on stdout', () => {
		const spy = spyOnStdout();

		process.stdout.write('test1' + EOL);
		process.stdout.write('test2' + EOL);

		stdoutCalledWith(spy, [
			'test1',
			'test2',
		]);
	});
});

describe('spyOnExec, execCalledWith', () => {
	it('should spy on stdout', () => {
		const spy = spyOnExec();
		const callback = jest.fn();

		exec('test1', callback);
		exec('test2', {}, callback);
		exec('test3', {cwd: '.work'}, callback);

		execCalledWith(spy, [
			'test1',
			'test2',
			['test3', {cwd: '.work'}],
		]);
	});
});

describe('testProperties', () => {
	it('should test properties', () => {
		testProperties({
			test1: 1,
			test2: 'test2',
			test3: [1, 2, 3],
			test4: {a: 'b'},
			test5: 1,
			test6: 'test2',
			test7: [1, 2, 3],
			test8: {a: 'b'},
		}, {
			test1: 1,
			test2: 'test2',
			test3: [1, 2, 3],
			test4: {a: 'b'},
		});
	});

	it('should throw error', () => {
		expect(() => {
			testProperties({
				test1: 1,
				test2: 'test2',
				test3: [1, 2, 3],
				test4: {a: 'b'},
				test5: 1,
				test6: 'test2',
				test7: [1, 2, 3],
				test8: {a: 'b'},
			}, {
				test1: 1,
				test2: 'test2',
				test3: [1, 2, 3],
				test4: {a: 'c'},
			});
		}).toThrow();
	});
});
