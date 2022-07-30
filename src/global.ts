import type { ExecException } from 'child_process';
import type { Mock } from 'vitest';

declare global {
  interface Global {
    mockStdout: {
      write: Mock;
    };
    mockChildProcess: {
      exec: Mock;
      spawn: Mock;
      stdout: string | ((command: string) => string);
      stderr: string | ((command: string) => string);
      error: ExecException | null | ((command: string) => ExecException | null);
      code: number | ((command: string) => number);
    };
  }
}

declare const global: Global;
export default global;
