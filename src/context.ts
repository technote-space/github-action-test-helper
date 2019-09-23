import { Context } from '@actions/github/lib/context';
import { Response } from '@octokit/rest';

export const getContext = (override: object): Context => Object.assign({
	payload: {
		action: '',
	},
	eventName: '',
	sha: '',
	ref: '',
	workflow: '',
	action: '',
	actor: '',
	issue: {
		owner: '',
		repo: '',
		number: 1,
	},
	repo: {
		owner: '',
		repo: '',
	},
}, override);

type CreateResponseFunctionType = <T>(data: T, override?: object) => Response<T>;
export const createResponse: CreateResponseFunctionType = (data, override = {}) => Object.assign({
	data,
	status: 0,
	headers: {
		date: '',
		'x-ratelimit-limit': '',
		'x-ratelimit-remaining': '',
		'x-ratelimit-reset': '',
		'x-Octokit-request-id': '',
		'x-Octokit-media-type': '',
		link: '',
		'last-modified': '',
		etag: '',
		status: '',
	},
	[Symbol.iterator](): Iterator<boolean> {
		return {
			next(): IteratorResult<boolean> {
				return {
					done: true,
					value: true,
				};
			},
		};
	},
}, override);
