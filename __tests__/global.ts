import { ExecException } from 'child_process';

interface Global extends NodeJS.Global {
	mockChildProcess: {
		exec: jest.Mock;
		stdout: string;
		stderr: string;
		error: ExecException | null;
	};
}

declare const global: Global;
export default global;
