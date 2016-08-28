'use strict';

import fs from 'fs';
import request from 'request';
import Promise from 'Bluebird';
import assert from 'assert';

import { capitalize } from 'lib/utils'

class Picture {
    constructor(url,referer=null,host=null){
        assert.ok(url,'Url required.');
        this.url = url;
        this.referer = referer;
        this.host = host;
        let headers = this.headers = {};
        ['referer','host'].forEach((key) => {
            if (this[key]) {
                headers[capitalize(key)] = this[key];
            }
        });
    }

    download(filepath){
        let self = this;
        let pathDisplayed = filepath.split('/').slice(-3).join('/');
        return new Promise((resolve,reject)=>{
            console.log(`Downloading ${pathDisplayed}...`);
            request({
                headers: this.headers,
                timeout: Picture.TIMEOUT,
                url: this.url
            },function(error, resp, body){
                if (error) reject(error);
                return body;
            }).pipe(fs.createWriteStream(filepath))
            .on('error',function(err){
                reject(err);
            })
            .on('finish',function(){
                resolve(self.url);
            });
        });
    }
}

Picture.TIMEOUT = 15000;

export default Picture;
