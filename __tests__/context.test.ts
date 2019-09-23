/* eslint-disable no-magic-numbers */
import { getContext, createResponse } from '../src';

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

describe('createResponse', () => {
	it('should create response', () => {
		const response = createResponse<number>(123);
		expect(response).toHaveProperty('data');
		expect(response.data).toBe(123);
	});

	it('should override', () => {
		const response = createResponse<number>(123, {data: 234});
		expect(response).toHaveProperty('data');
		expect(response.data).toBe(234);

		const iterator = response[Symbol.iterator]();
		expect(iterator).toHaveProperty('next');
		expect(iterator.next()).toEqual({done: true, value: true});
	});
});
