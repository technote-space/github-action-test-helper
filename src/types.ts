import {GitHub} from '@actions/github/lib/utils';
import {RestEndpointMethods} from '@octokit/plugin-rest-endpoint-methods/dist-types/generated/method-types';

export type Octokit = InstanceType<typeof GitHub> & {
  rest: RestEndpointMethods;
};
