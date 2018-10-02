import { getConfig, setConfig } from '../utils/cli';
import { t } from '../locales';

export default function config(value: string, options: { set?: string; get?: string } = {}) {
  if (options.get) {
    console.log(getConfig(options.get));
    return;
  }

  if (options.set && !value) {
    console.error(t('config.valueIsUndefined', { key: options.set }));
    return;
  }

  if (options.set && value) {
    setConfig(options.set, value);
    return;
  }

  console.log(JSON.stringify(getConfig(), null, 2));
}
