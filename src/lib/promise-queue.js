(function (root, factory) {
  'use strict';
  // UMD modules
  if (typeof module === 'object' && module.exports && typeof require === 'function') {
    module.exports = factory();
  } else if (typeof define === 'function' && typeof define.amd === 'object') {
    define(factory);
  } else {
    root.PromiseQueue = factory();
  }
})(this, function () {

  'use strict';

  let _Promise = typeof Promise === 'function' ? Promise : function () {
    throw new Error('Promise is not supported.');
  };

  /*
   * Promise.prototype.always polyfill
   * execute whenever resolve or reject.
   *
   * ```
   * if( !_Promise.prototype.always ){
   *     _Promise.prototype.always = function(fn){
   *         return this.then(fn,fn);
   *     }
   * }
   * ```
   * But the method above will invade the global Promise
   * so just use a independent function instead.
   *
   * @param  {_Promise} p
   * @param  {Function} fn callback method
   * @return {[type]}      promise chain
   */
  let always = function (p, fn) {
    if (!(p instanceof _Promise)) {
      throw new TypeError('The first parameter must be a Promise object.');
    }
    return p.then(fn, fn);
  };

  /**
   * get the internal [[Class]]
   * @param  {Object} o
   * @return {String}   Object's type string
   */
  let type = function (o) {
    return Object.prototype.toString.call(o).slice(8, -1).toLowerCase();
  };

  /**
   *  check whether the object has `then` method or not
   *  the object which has `then` method will be treated as a Promise object.
   *
   * @param  {Object} o
   * @return {Boolean}   whether the object is chainable or not.
   */
  let isthenable = function (o) {
    return type(o && o.then) === 'function';
  };

  /**
   * resolve Promise or value
   * @param  {Promise/Object} ret
   * @return {Promise}     chainable object.
   */
  let resolve = function (ret) {
    return isthenable(ret) ? ret : _Promise.resolve(ret);
  };

  /**
   * Class Queue define a promise queue.
   *
   * @param {Number} [thread=5] max number of promises in process
   * @param {Number} [maxQuery=Infinity]  max number of promises in queue
   * @constructor
   */
  class Queue {
    constructor(thread, maxQuery) {
      this._finishedQueue = 0;
      this._queue = [];
      this._pending = 0;
      this.thread = thread || 5;
      this.maxQuery = maxQuery || Infinity;
      this._onclear = function () { };
    }

    /**
     * Internal to add a promiseGenerator to queue.
     * @param {String} addMethod        A enum string in ['push','unshift']
     * @param {Function} promiseGenerator Function to generate promise.
     * @return {Promise}
     */
    _add(addMethod, promiseGenerator) {
      // only support push and unshift method
      if (!(addMethod in ['push', 'unshift'])) {
        throw new Error('method unsupport');
      }

      return new _Promise((resolve, reject) => {
        if (this._queue.length >= this.maxQuery) {
          reject(new Error('Maximum queue size exceeded'));
          return;
        }

        this._queue[addMethod]({
          resolver: resolve,
          rejector: reject,
          promiseGenerator: promiseGenerator
        });

        this._process();
      });
    }

    /**
     * append a promiseGenerator to the queue.
     * @param  {Function} promiseGenerator is a function that return a Promise.
     * @return {Promise}
     */
    push(promiseGenerator) {
      return this._add('push', promiseGenerator);
    }

    /**
     * unshift a promiseGenerator to the queue.
     * @param  {Function} promiseGenerator is a function that return a Promise.
     * @return {Promise}
     */
    unshift(promiseGenerator) {
      return this._add('unshift', promiseGenerator);
    }

    /**
     * Internal method to recursive solve the queue.
     */
    _process() {
      if (this._pending >= this.thread) {
        return;
      }

      let processor = this._queue.shift();
      if (!processor) {
        return;
      }

      let generator = processor.promiseGenerator;

      this._pending++;
      let chain = resolve(generator())
        .then(processor.resolver, processor.rejector);

      return always(chain, (ret) => {
        try {
          this._pending--;
          if (this._pending === 0) {
            this._onclear.call(this, null);
          }
          this._finished++;
          this._process();
          return ret;
        } catch (e) {
          return Promise.reject(e);
        }
      });
    }

    /**
     * Get the length of queue.
     * @return {Number} length of queue
     */
    getQueueLength() {
      return this._queue.length;
    }

    /**
     * Define the callback when tasks are all cleared.
     * @param {Function} callback
     * @return {Function} callback itself.
     */
    onClear(callback) {
      if (typeof callback !== 'function') {
        throw TypeError('Callback must be a function.');
      }
      this._onclear = callback;
      return callback
    }
  }

  Queue.setup = function (Promise) {
    _Promise = Promise;
  }

  return Queue;

});
