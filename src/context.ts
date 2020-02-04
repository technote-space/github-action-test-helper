import { Context } from '@actions/github/lib/context';
import { Octokit } from '@octokit/rest';

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

export const generateContext = (settings: { event?: string; action?: string; ref?: string; sha?: string; owner?: string; repo?: string }, override?: object): Context => {
	const overrideObj = override || {};

	return getContext(
		Object.assign({}, {
			eventName: settings.event ? settings.event : '',
			ref: settings.ref ? `refs/${settings.ref}` : '',
			sha: settings.sha ? settings.sha : '',
			action: settings.owner ? (settings.owner + '-generator') : '',
		}, overrideObj, {
			payload: Object.assign({
				action: settings.action ? settings.action : '',
			}, overrideObj['payload'] || {}),
			issue: Object.assign({
				owner: settings.owner ? settings.owner : '',
				repo: settings.repo ? settings.repo : '',
			}, overrideObj['issue'] || {}),
			repo: Object.assign({
				owner: settings.owner ? settings.owner : '',
				repo: settings.repo ? settings.repo : '',
			}, overrideObj['repo'] || {}),
		}),
	);
};

type CreateResponseFunctionType = <T>(data: T, override?: object) => Octokit.Response<T>;
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
