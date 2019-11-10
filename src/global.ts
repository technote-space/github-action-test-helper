import { ExecException } from 'child_process';

interface Global extends NodeJS.Global {
	mockStdout: {
		write: jest.Mock;
	};
	mockChildProcess: {
		exec: jest.Mock;
		stdout: string | ((command: string) => string);
		stderr: string | ((command: string) => string);
		error: ExecException | null | ((command: string) => ExecException);
	};
}

declare const global: Global;
export default global;
