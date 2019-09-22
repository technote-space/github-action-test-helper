/* eslint-disable no-magic-numbers */
import path from 'path';
import { getContext, getConfigFixture, getApiFixture, disableNetConnect, encodeContent, testEnv } from '../src';

beforeAll(() => {
	process.env.TEST_ENV = 'test';
});

afterAll(() => {
	delete process.env.TEST_ENV;
});

describe('getContext', () => {
	it('should get context', () => {
		const context = getContext({});
		expect(context.eventName).toBe('');
		expect(context.payload.action).toBe('');
		expect(context.sha).toBe('');
	});

	it('should override', () => {
		const context = getContext({
			payload: {
				action: 'opened',
			},
			eventName: 'issue',
		});
		expect(context.eventName).toBe('issue');
		expect(context.payload.action).toBe('opened');
		expect(context.sha).toBe('');
	});
});

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
