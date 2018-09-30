import fs from 'fs';
import url from 'url';
import path from 'path';
import querystring from 'querystring';

import fsExtra from 'fs-extra';
import superagent from 'superagent';
import superagentCharset from 'superagent-charset';
import iconv from 'iconv-lite';
import cheerio from 'cheerio';
import PQueue from 'p-queue';
import { template } from 'lodash';

import { numLeftPad, noop } from './misc';

const superagentWithCharset = superagentCharset(superagent);

/**
 * URL encode with charset.
 * @param str string to be encoded.
 * @param charset charset, use utf8 as default(fallback to encodeURIComponent)
 */
export function URLEncode(str: string, charset = 'utf8') {
  if (charset === 'utf8') {
    return encodeURIComponent(str);
  }
  const buf = iconv.encode(str, charset);
  let encodeStr = '';
  let ch = '';
  for (let i = 0; i < buf.length; i++) {
    ch = buf[i].toString(16);
    if (ch.length === 1) {
      ch = `0${ch}`;
    }
    encodeStr += `%${ch}`;
  }
  return encodeStr.toUpperCase();
}

/**
 * A basic superagent (with superagent-charset) wrapper.
 * @param requestUrl request URL
 * @param method HTTP request methods
 */
export function request(requestUrl: string, method: string = 'GET') {
  return superagentWithCharset(method, requestUrl);
}

/**
 * Fetch the original text of url given.
 * @param source source URL
 * @param headers extra http headers
 */
export async function fetchText(source: string, headers: object = {}): Promise<string> {
  const response = await request(source)
    .set(headers)
    .charset();
  if (!response.ok) {
    throw response;
  }
  return response.text;
}

/**
 * Get the cheerio DOM-Object of the given URL.
 * @param source URL of webpage
 * @param headers extra http headers
 * @returns $dom
 */
export async function fetchDocument(source: string, headers: object = {}): Promise<CheerioStatic> {
  const response = await fetchText(source, headers);
  return cheerio.load(response);
}

/**
 * Just like `jQuery.getJSON`
 * @param source API url
 * @param headers extra http headers
 * @returns formated JSON
 */
export async function fetchJson(source: string, headers: object = {}): Promise<any> {
  const response = await superagent(source).set(headers);
  const { text } = response;
  // For the compatibility of irregular Content-Type (eg: `text/html`)
  // Manually parse the `response.text` here, instead of use `response.body`
  try {
    return JSON.parse(text);
  } catch (e) {
    return {};
  }
}

interface downloadOptions {
  headers?: object;
  timeout?: number | { response?: number; deadline?: number };
  onProgress?: (evt: {}) => void;
}

/**
 * Download image.
 * @param src source URL
 * @param dest destination path
 * @param options download options
 * @returns None
 */
export async function download(
  source: string,
  dest: string,
  options: downloadOptions = {},
): Promise<{}> {
  const { headers = {}, timeout = 30000, onProgress = () => {} } = options;

  return new Promise((resolve, reject) => {
    superagent(source)
      .set(headers)
      .timeout(timeout)
      .on('progress', onProgress)
      .on('end', () => resolve())
      .on('error', err => reject(err))
      .pipe(fs.createWriteStream(dest));
  });
}

let downloadQueue: PQueue;
function getDownloadQueue() {
  if (!downloadQueue) {
    downloadQueue = new PQueue({ concurrency: 5 });
  }
  return downloadQueue;
}

export interface destData {
  index: number;
  // prettier-ignore
  'name': string;
  suffix: string;
  autoIndex: string;
  path: string;
}

interface batchDownloadOptions extends downloadOptions {
  onTaskStart?: (dest: string) => void;
  onTaskFinished?: (err: Error | null, dest: string) => void;
}

/**
 * Batch download images.
 * @param sources source URLs
 * @param destTemplate file path tempalate string(or template function)
 * @param options batchDownloadOptions
 * @param options.onTaskStart callback on each task start
 * @param options.onTaskEnd callback on each task end
 * @param options... downloadOptions
 */
export async function batchDownload(
  sources: string[],
  destTemplate: string | ((data: destData) => string),
  options: batchDownloadOptions = {},
): Promise<{}> {
  const { onTaskStart = noop, onTaskFinished = noop, ...downloadOptions } = options;
  const queue = getDownloadQueue();

  const fns = sources.map((source, index) => async () => {
    const { pathname = '' } = url.parse(source);
    const suffix = path.extname(pathname);
    const name = querystring.unescape(path.basename(pathname));
    const autoIndex = numLeftPad(index + 1, Math.max(sources.length.toFixed(0).length, 2));
    const data = {
      index: index + 1,
      name,
      suffix,
      autoIndex,
      path: pathname,
    };
    const dest = typeof destTemplate === 'string'
      ? template(destTemplate, { interpolate: /{([\s\S]+?)}/g })(data)
      : destTemplate(data);

    try {
      onTaskStart(dest);
      // needs to be checked each time, because the base-dir may not be the same
      await fsExtra.ensureDir(path.dirname(dest));
      await download(source, dest, downloadOptions);
      onTaskFinished(null, dest);
      return dest;
    } catch (err) {
      onTaskFinished(err, dest);
      // Stop throw errors.
      // throw err;
      return dest;
    }
  });
  return queue.addAll(fns);
}
