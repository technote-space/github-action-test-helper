import path from 'path';
import fs from 'fs';
import {load} from 'js-yaml';

export const encodeContent = (content: string): string => Buffer.from(content).toString('base64');

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getConfigFixture = (rootDir: string, fileName = 'config.yml'): { [key: string]: any } => ({
  type: 'file',
  encoding: 'base64',
  size: 5362,
  name: fileName,
  path: `.github/${fileName}`,
  content: encodeContent(fs.readFileSync(path.resolve(rootDir, fileName)).toString()),
  sha: '3d21ec53a331a6f037a91c368710b99387d012c1',
  url:
    'https://api.github.com/repos/Codertocat/Hello-World/contents/.github/release-drafter.yml',
  'git_url':
    'https://api.github.com/repos/Codertocat/Hello-World/git/blobs/3d21ec53a331a6f037a91c368710b99387d012c1',
  'html_url':
    'https://github.com/Codertocat/Hello-World/blob/master/.github/release-drafter.yml',
  'download_url':
    'https://raw.githubusercontent.com/Codertocat/Hello-World/master/.github/release-drafter.yml',
  _links: {
    git:
      'https://api.github.com/repos/Codertocat/Hello-World/git/blobs/3d21ec53a331a6f037a91c368710b99387d012c1',
    self:
      'https://api.github.com/repos/Codertocat/Hello-World/contents/.github/release-drafter.yml',
    html:
      'https://github.com/Codertocat/Hello-World/blob/master/.github/release-drafter.yml',
  },
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getApiFixture = (rootDir: string, name: string, ext = '.json'): any => {
  const content = fs.readFileSync(path.resolve(rootDir, `${name}${ext}`)).toString();
  switch (ext.toLowerCase()) {
    case '.json':
      return JSON.parse(content);
    case '.yml':
    case '.yaml':
      return load(content) || {};
    default:
      return {content};
  }
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const disableNetConnect = (nock): void => {
  beforeEach(() => {
    nock.disableNetConnect();
  });

  afterEach(() => {
    nock.cleanAll();
    nock.enableNetConnect();
  });
};
