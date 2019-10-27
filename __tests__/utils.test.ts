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
	stdoutCalledAtLeastOnce,
	spyOnExec,
	execCalledWith,
	execCalledAtLeastOnce,
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
	describe('without default', () => {
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

		it('should return different each time', () => {
			func([true, false, true]);
			expect(fs.existsSync('')).toBeTruthy();
			expect(fs.existsSync('')).toBeFalsy();
			expect(fs.existsSync('')).toBeTruthy();
			expect(fs.existsSync('')).toBeTruthy();
		});

		it('should return result depends on file name', () => {
			func((filepath: string): boolean => filepath.includes('test'));
			expect(fs.existsSync('/tmp/test.txt')).toBeTruthy();
			expect(fs.existsSync('/tmp/abc.txt')).toBeFalsy();
		});
	});

	describe('with default true', () => {
		const func = testFs(true);

		it('should return true 1', () => {
			expect(fs.existsSync('')).toBeTruthy();
		});

		it('should return false', () => {
			func(false);
			expect(fs.existsSync('')).toBeFalsy();
		});

		it('should return true 2', () => {
			expect(fs.existsSync('')).toBeTruthy();
		});
	});
});

describe('spyOnStdout, stdoutCalledWith, stdoutCalledAtLeastOnce', () => {
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
			'{\n\t"test3": "test3",\n\t"test4": "test4"\n}',
			'__info__{\n\t"test5": "test5",\n\t"test6": "test6"\n}',
			'__error__{\n\t"test7": "test7",\n\t"test8": "test8"\n}',
			'__warning__{\n\t"test9": "test9",\n\t"test10": "test10"\n}',
		]);

		stdoutCalledAtLeastOnce(spy, [
			'test2',
			'__error__{\n\t"test7": "test7",\n\t"test8": "test8"\n}',
		]);
	});
});

describe('spyOnExec, execCalledWith, execCalledAtLeastOnce', () => {
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

		execCalledAtLeastOnce(spy, [
			'test2',
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
