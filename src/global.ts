import type { ExecException } from 'child_process';
import type { SpyInstanceFn } from 'vitest';

declare global {
  interface Global {
    mockStdout: {
      write: SpyInstanceFn;
    };
    mockChildProcess: {
      exec: SpyInstanceFn;
      spawn: SpyInstanceFn;
      stdout: string | ((command: string) => string);
      stderr: string | ((command: string) => string);
      error: ExecException | null | ((command: string) => ExecException | null);
      code: number | ((command: string) => number);
    };
  }
}

declare const global: Global;
export default global;
