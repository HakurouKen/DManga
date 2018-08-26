import fs from 'fs';
import path from 'path';
import querystring from 'querystring';

import fsExtra from 'fs-extra';
import superagent from 'superagent';
import cheerio from 'cheerio';
import PQueue from 'p-queue';
import template from 'string-template';
import { numLeftPad, noop } from './misc';

/**
 * Get the cheerio DOM-Object of the given URL.
 * @param url URL of webpage
 * @returns $dom
 */
export async function fetchDocument(url: string): Promise<CheerioStatic> {
  const response = await superagent(url);
  if (!response.ok) {
    throw response;
  }

  return cheerio.load(response.text);
}

/**
 * Just like `jQuery.getJSON`
 * @param url API url
 * @returns formated JSON
 */
export async function fetchJson(url: string): Promise<{}> {
  const response = await superagent(url);
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
  originalName: string;
  suffix: string;
  autoIndex: string;
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
    const suffix = path.extname(source);
    const originalName = querystring.unescape(path.basename(source));
    const autoIndex = numLeftPad(index + 1, sources.length);
    const data = {
      index: index + 1,
      originalName,
      suffix,
      autoIndex,
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
