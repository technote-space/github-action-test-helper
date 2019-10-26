/* eslint-disable no-magic-numbers */
import { getContext, generateContext, createResponse } from '../src';

describe('getContext', () => {
	it('should get context', () => {
		const context = getContext({});
		expect(context.eventName).toBe('');
		expect(context.action).toBe('');
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
		expect(context.action).toBe('');
		expect(context.payload.action).toBe('opened');
		expect(context.sha).toBe('');
	});
});

describe('generateContext', () => {
	it('should generate context 1', () => {
		const context = generateContext({});
		expect(context.eventName).toBe('');
		expect(context.action).toBe('');
		expect(context.payload.action).toBe('');
		expect(context.ref).toBe('');
		expect(context.sha).toBe('');
		expect(context.issue.owner).toBe('');
		expect(context.repo.owner).toBe('');
		expect(context.issue.repo).toBe('');
		expect(context.repo.repo).toBe('');
	});

	it('should generate context 2', () => {
		const context = generateContext({
			event: 'test-event',
			action: 'test-action',
			ref: 'test-ref',
			sha: 'test-sha',
			owner: 'test-owner',
			repo: 'test-repo',
		});
		expect(context.eventName).toBe('test-event');
		expect(context.action).toBe('test-action');
		expect(context.payload.action).toBe('test-action');
		expect(context.ref).toBe('refs/test-ref');
		expect(context.sha).toBe('test-sha');
		expect(context.issue.owner).toBe('test-owner');
		expect(context.repo.owner).toBe('test-owner');
		expect(context.issue.repo).toBe('test-repo');
		expect(context.repo.repo).toBe('test-repo');
	});

	it('should override', () => {
		const context = generateContext({
			event: 'test-event',
			action: 'test-action',
			ref: 'test-ref',
			sha: 'test-sha',
			owner: 'test-owner',
			repo: 'test-repo',
		}, {
			eventName: 'override-event',
			ref: 'override-ref',
			sha: 'override-sha',
			repo: {
				owner: 'override-owner',
				repo: 'override-repo',
			},
			payload: {
				release: {
					'tag_name': 'test-tag',
				},
			},
		});
		expect(context.eventName).toBe('override-event');
		expect(context.action).toBe('test-action');
		expect(context.payload.action).toBe('test-action');
		expect(context.ref).toBe('override-ref');
		expect(context.sha).toBe('override-sha');
		expect(context.issue.owner).toBe('test-owner');
		expect(context.repo.owner).toBe('override-owner');
		expect(context.issue.repo).toBe('test-repo');
		expect(context.repo.repo).toBe('override-repo');
		expect(context.payload.release.tag_name).toBe('test-tag');
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
