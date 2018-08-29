import fs from 'fs';
import url from 'url';
import path from 'path';
import querystring from 'querystring';

import fsExtra from 'fs-extra';
import superagent from 'superagent';
import cheerio from 'cheerio';
import PQueue from 'p-queue';
import template from 'string-template';
import { numLeftPad, noop } from './misc';

/**
 * Fetch the original text of url given.
 * @param source source URL
 * @param headers extra http headers
 */
export async function fetchText(source: string, headers: object = {}): Promise<string> {
  const response = await superagent(source).set(headers);
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
  return response.body;
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
      .on('error', () => reject())
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

interface destData {
  index: number;
  'name': string;
  suffix: string;
  autoIndex: string;
  path: string;
}

interface batchDownloadOptions extends downloadOptions {
  onTaskStart?: (dest: string) => void;
  onTaskFinished?: (err: Error | null, dest: string) => void;
}

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
    const autoIndex = numLeftPad(index + 1, sources.length);
    const data = {
      index: index + 1,
      name,
      suffix,
      autoIndex,
      path: pathname,
    };
    const dest = typeof destTemplate === 'string' ? template(destTemplate, data) : destTemplate(data);

    try {
      onTaskStart(dest);
      // needs to be checked each time, because the base-dir may not be the same
      await fsExtra.ensureDir(path.dirname(dest));
      await download(source, dest, downloadOptions);
      onTaskFinished(null, dest);
      return dest;
    } catch (err) {
      onTaskFinished(err, dest);
      throw err;
    }
  });
  return queue.addAll(fns);
}
