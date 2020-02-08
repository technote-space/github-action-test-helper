/* eslint-disable no-magic-numbers */
import path from 'path';
import { getConfigFixture, getApiFixture, disableNetConnect, encodeContent } from '../src';

describe('getConfigFixture', () => {
	it('should get config fixture', () => {
		const config = getConfigFixture(path.resolve(__dirname, 'fixtures'));
		expect(config).toHaveProperty('name');
		expect(config).toHaveProperty('path');
		expect(config).toHaveProperty('content');
		expect(config['name']).toBe('config.yml');
		expect(config['path']).toBe('.github/config.yml');
		expect(config['content']).toBe(encodeContent(
			`Backlog:
  test1:
    - 'Status: test1'
  test2:
    - 'Status: test2-1'
    - 'Status: test2-2'
`,
		));
	});
});

describe('getApiFixture', () => {
	it('should get api fixture', () => {
		const data = getApiFixture(path.resolve(__dirname, 'fixtures'), 'api.test');
		expect(data).toHaveProperty('test');
		expect(data['test']).toBe(123);
	});

	it('should get api fixture (yaml)', () => {
		const data = getApiFixture(path.resolve(__dirname, 'fixtures'), 'api.test', '.yml');
		expect(data).toHaveProperty('test');
		expect(data['test']).toBe(123);
	});

	it('should get api fixture (invalid yaml)', () => {
		const data = getApiFixture(path.resolve(__dirname, 'fixtures'), 'empty.test', '.yml');
		expect(data).not.toHaveProperty('test');
	});

	it('should get api fixture (others)', () => {
		const data = getApiFixture(path.resolve(__dirname, 'fixtures'), 'api.test', '.txt');
		expect(data).toHaveProperty('content');
	});
});

describe('disableNetConnect', () => {
	const fn1 = jest.fn();
	const fn2 = jest.fn();
	const fn3 = jest.fn();
	disableNetConnect({
		disableNetConnect: fn1,
		cleanAll: fn2,
		enableNetConnect: fn3,
	});

	it('should disable net connect', () => {
		expect(fn1).toBeCalledTimes(1);
		expect(fn2).toBeCalledTimes(0);
		expect(fn3).toBeCalledTimes(0);
	});
});
