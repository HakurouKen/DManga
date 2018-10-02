import path from 'path';
import os from 'os';
import fsExtra from 'fs-extra';
import { get, set } from 'lodash';

const configFilePath = path.resolve(os.homedir(), '.dmangarc.json');

export function getConfig(key?: string) {
  const config = fsExtra.readJSONSync(configFilePath, { throws: false }) || {};
  return key ? get(config, key) : config;
}

export function setConfig(key: string, value: string) {
  const config = getConfig();
  set(config, key, value);
  fsExtra.writeFileSync(configFilePath, JSON.stringify(config, null, 2), 'utf8');
}
