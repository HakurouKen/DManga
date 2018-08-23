import fs from 'fs';
import superagent from 'superagent';
import cheerio from 'cheerio';

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
  src: string,
  dest: string,
  options: downloadOptions = {},
): Promise<{}> {
  const { headers = {}, timeout = 30000, onProgress = () => {} } = options;

  return new Promise((resolve, reject) => {
    superagent(src)
      .set(headers)
      .timeout(timeout)
      .on('progress', onProgress)
      .on('end', () => resolve())
      .on('error', () => reject())
      .pipe(fs.createWriteStream(dest));
  });
}
