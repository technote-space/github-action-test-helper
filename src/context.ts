import type { Context } from '@actions/github/lib/context';
import type { OctokitResponse } from '@octokit/types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getContext = (override: { [key: string]: any }): Context => Object.assign({
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
  job: '',
  runNumber: 1,
  runId: 1,
  apiUrl: 'https://api.github.com',
  serverUrl: 'https://github.com',
  graphqlUrl: 'https://api.github.com/graphql',
}, override);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const generateContext = (settings: { event?: string; action?: string; ref?: string; sha?: string; owner?: string; repo?: string }, override?: { [key: string]: any }): Context => {
  const overrideObj = override || {};

  return getContext(
    Object.assign({}, {
      eventName: settings.event ? settings.event : '',
      ref: settings.ref ? settings.ref : '',
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type CreateResponseFunctionType = <T>(data: T, override?: { [key: string]: any }) => OctokitResponse<T>;
export const createResponse: CreateResponseFunctionType = (data, override = {}) => Object.assign({
  data,
  status: 0,
  url: 'https://example.com',
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
