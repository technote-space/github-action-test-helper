import type { GitHub } from '@actions/github/lib/utils.js';

export type Octokit = InstanceType<typeof GitHub>;
