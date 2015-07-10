require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (process,global){
/*!
 * @overview es6-promise - a tiny implementation of Promises/A+.
 * @copyright Copyright (c) 2014 Yehuda Katz, Tom Dale, Stefan Penner and contributors (Conversion to ES6 API by Jake Archibald)
 * @license   Licensed under MIT license
 *            See https://raw.githubusercontent.com/jakearchibald/es6-promise/master/LICENSE
 * @version   2.3.0
 */

(function() {
    "use strict";
    function lib$es6$promise$utils$$objectOrFunction(x) {
      return typeof x === 'function' || (typeof x === 'object' && x !== null);
    }

    function lib$es6$promise$utils$$isFunction(x) {
      return typeof x === 'function';
    }

    function lib$es6$promise$utils$$isMaybeThenable(x) {
      return typeof x === 'object' && x !== null;
    }

    var lib$es6$promise$utils$$_isArray;
    if (!Array.isArray) {
      lib$es6$promise$utils$$_isArray = function (x) {
        return Object.prototype.toString.call(x) === '[object Array]';
      };
    } else {
      lib$es6$promise$utils$$_isArray = Array.isArray;
    }

    var lib$es6$promise$utils$$isArray = lib$es6$promise$utils$$_isArray;
    var lib$es6$promise$asap$$len = 0;
    var lib$es6$promise$asap$$toString = {}.toString;
    var lib$es6$promise$asap$$vertxNext;
    var lib$es6$promise$asap$$customSchedulerFn;

    var lib$es6$promise$asap$$asap = function asap(callback, arg) {
      lib$es6$promise$asap$$queue[lib$es6$promise$asap$$len] = callback;
      lib$es6$promise$asap$$queue[lib$es6$promise$asap$$len + 1] = arg;
      lib$es6$promise$asap$$len += 2;
      if (lib$es6$promise$asap$$len === 2) {
        // If len is 2, that means that we need to schedule an async flush.
        // If additional callbacks are queued before the queue is flushed, they
        // will be processed by this flush that we are scheduling.
        if (lib$es6$promise$asap$$customSchedulerFn) {
          lib$es6$promise$asap$$customSchedulerFn(lib$es6$promise$asap$$flush);
        } else {
          lib$es6$promise$asap$$scheduleFlush();
        }
      }
    }

    function lib$es6$promise$asap$$setScheduler(scheduleFn) {
      lib$es6$promise$asap$$customSchedulerFn = scheduleFn;
    }

    function lib$es6$promise$asap$$setAsap(asapFn) {
      lib$es6$promise$asap$$asap = asapFn;
    }

    var lib$es6$promise$asap$$browserWindow = (typeof window !== 'undefined') ? window : undefined;
    var lib$es6$promise$asap$$browserGlobal = lib$es6$promise$asap$$browserWindow || {};
    var lib$es6$promise$asap$$BrowserMutationObserver = lib$es6$promise$asap$$browserGlobal.MutationObserver || lib$es6$promise$asap$$browserGlobal.WebKitMutationObserver;
    var lib$es6$promise$asap$$isNode = typeof process !== 'undefined' && {}.toString.call(process) === '[object process]';

    // test for web worker but not in IE10
    var lib$es6$promise$asap$$isWorker = typeof Uint8ClampedArray !== 'undefined' &&
      typeof importScripts !== 'undefined' &&
      typeof MessageChannel !== 'undefined';

    // node
    function lib$es6$promise$asap$$useNextTick() {
      var nextTick = process.nextTick;
      // node version 0.10.x displays a deprecation warning when nextTick is used recursively
      // setImmediate should be used instead instead
      var version = process.versions.node.match(/^(?:(\d+)\.)?(?:(\d+)\.)?(\*|\d+)$/);
      if (Array.isArray(version) && version[1] === '0' && version[2] === '10') {
        nextTick = setImmediate;
      }
      return function() {
        nextTick(lib$es6$promise$asap$$flush);
      };
    }

    // vertx
    function lib$es6$promise$asap$$useVertxTimer() {
      return function() {
        lib$es6$promise$asap$$vertxNext(lib$es6$promise$asap$$flush);
      };
    }

    function lib$es6$promise$asap$$useMutationObserver() {
      var iterations = 0;
      var observer = new lib$es6$promise$asap$$BrowserMutationObserver(lib$es6$promise$asap$$flush);
      var node = document.createTextNode('');
      observer.observe(node, { characterData: true });

      return function() {
        node.data = (iterations = ++iterations % 2);
      };
    }

    // web worker
    function lib$es6$promise$asap$$useMessageChannel() {
      var channel = new MessageChannel();
      channel.port1.onmessage = lib$es6$promise$asap$$flush;
      return function () {
        channel.port2.postMessage(0);
      };
    }

    function lib$es6$promise$asap$$useSetTimeout() {
      return function() {
        setTimeout(lib$es6$promise$asap$$flush, 1);
      };
    }

    var lib$es6$promise$asap$$queue = new Array(1000);
    function lib$es6$promise$asap$$flush() {
      for (var i = 0; i < lib$es6$promise$asap$$len; i+=2) {
        var callback = lib$es6$promise$asap$$queue[i];
        var arg = lib$es6$promise$asap$$queue[i+1];

        callback(arg);

        lib$es6$promise$asap$$queue[i] = undefined;
        lib$es6$promise$asap$$queue[i+1] = undefined;
      }

      lib$es6$promise$asap$$len = 0;
    }

    function lib$es6$promise$asap$$attemptVertex() {
      try {
        var r = require;
        var vertx = r('vertx');
        lib$es6$promise$asap$$vertxNext = vertx.runOnLoop || vertx.runOnContext;
        return lib$es6$promise$asap$$useVertxTimer();
      } catch(e) {
        return lib$es6$promise$asap$$useSetTimeout();
      }
    }

    var lib$es6$promise$asap$$scheduleFlush;
    // Decide what async method to use to triggering processing of queued callbacks:
    if (lib$es6$promise$asap$$isNode) {
      lib$es6$promise$asap$$scheduleFlush = lib$es6$promise$asap$$useNextTick();
    } else if (lib$es6$promise$asap$$BrowserMutationObserver) {
      lib$es6$promise$asap$$scheduleFlush = lib$es6$promise$asap$$useMutationObserver();
    } else if (lib$es6$promise$asap$$isWorker) {
      lib$es6$promise$asap$$scheduleFlush = lib$es6$promise$asap$$useMessageChannel();
    } else if (lib$es6$promise$asap$$browserWindow === undefined && typeof require === 'function') {
      lib$es6$promise$asap$$scheduleFlush = lib$es6$promise$asap$$attemptVertex();
    } else {
      lib$es6$promise$asap$$scheduleFlush = lib$es6$promise$asap$$useSetTimeout();
    }

    function lib$es6$promise$$internal$$noop() {}

    var lib$es6$promise$$internal$$PENDING   = void 0;
    var lib$es6$promise$$internal$$FULFILLED = 1;
    var lib$es6$promise$$internal$$REJECTED  = 2;

    var lib$es6$promise$$internal$$GET_THEN_ERROR = new lib$es6$promise$$internal$$ErrorObject();

    function lib$es6$promise$$internal$$selfFullfillment() {
      return new TypeError("You cannot resolve a promise with itself");
    }

    function lib$es6$promise$$internal$$cannotReturnOwn() {
      return new TypeError('A promises callback cannot return that same promise.');
    }

    function lib$es6$promise$$internal$$getThen(promise) {
      try {
        return promise.then;
      } catch(error) {
        lib$es6$promise$$internal$$GET_THEN_ERROR.error = error;
        return lib$es6$promise$$internal$$GET_THEN_ERROR;
      }
    }

    function lib$es6$promise$$internal$$tryThen(then, value, fulfillmentHandler, rejectionHandler) {
      try {
        then.call(value, fulfillmentHandler, rejectionHandler);
      } catch(e) {
        return e;
      }
    }

    function lib$es6$promise$$internal$$handleForeignThenable(promise, thenable, then) {
       lib$es6$promise$asap$$asap(function(promise) {
        var sealed = false;
        var error = lib$es6$promise$$internal$$tryThen(then, thenable, function(value) {
          if (sealed) { return; }
          sealed = true;
          if (thenable !== value) {
            lib$es6$promise$$internal$$resolve(promise, value);
          } else {
            lib$es6$promise$$internal$$fulfill(promise, value);
          }
        }, function(reason) {
          if (sealed) { return; }
          sealed = true;

          lib$es6$promise$$internal$$reject(promise, reason);
        }, 'Settle: ' + (promise._label || ' unknown promise'));

        if (!sealed && error) {
          sealed = true;
          lib$es6$promise$$internal$$reject(promise, error);
        }
      }, promise);
    }

    function lib$es6$promise$$internal$$handleOwnThenable(promise, thenable) {
      if (thenable._state === lib$es6$promise$$internal$$FULFILLED) {
        lib$es6$promise$$internal$$fulfill(promise, thenable._result);
      } else if (thenable._state === lib$es6$promise$$internal$$REJECTED) {
        lib$es6$promise$$internal$$reject(promise, thenable._result);
      } else {
        lib$es6$promise$$internal$$subscribe(thenable, undefined, function(value) {
          lib$es6$promise$$internal$$resolve(promise, value);
        }, function(reason) {
          lib$es6$promise$$internal$$reject(promise, reason);
        });
      }
    }

    function lib$es6$promise$$internal$$handleMaybeThenable(promise, maybeThenable) {
      if (maybeThenable.constructor === promise.constructor) {
        lib$es6$promise$$internal$$handleOwnThenable(promise, maybeThenable);
      } else {
        var then = lib$es6$promise$$internal$$getThen(maybeThenable);

        if (then === lib$es6$promise$$internal$$GET_THEN_ERROR) {
          lib$es6$promise$$internal$$reject(promise, lib$es6$promise$$internal$$GET_THEN_ERROR.error);
        } else if (then === undefined) {
          lib$es6$promise$$internal$$fulfill(promise, maybeThenable);
        } else if (lib$es6$promise$utils$$isFunction(then)) {
          lib$es6$promise$$internal$$handleForeignThenable(promise, maybeThenable, then);
        } else {
          lib$es6$promise$$internal$$fulfill(promise, maybeThenable);
        }
      }
    }

    function lib$es6$promise$$internal$$resolve(promise, value) {
      if (promise === value) {
        lib$es6$promise$$internal$$reject(promise, lib$es6$promise$$internal$$selfFullfillment());
      } else if (lib$es6$promise$utils$$objectOrFunction(value)) {
        lib$es6$promise$$internal$$handleMaybeThenable(promise, value);
      } else {
        lib$es6$promise$$internal$$fulfill(promise, value);
      }
    }

    function lib$es6$promise$$internal$$publishRejection(promise) {
      if (promise._onerror) {
        promise._onerror(promise._result);
      }

      lib$es6$promise$$internal$$publish(promise);
    }

    function lib$es6$promise$$internal$$fulfill(promise, value) {
      if (promise._state !== lib$es6$promise$$internal$$PENDING) { return; }

      promise._result = value;
      promise._state = lib$es6$promise$$internal$$FULFILLED;

      if (promise._subscribers.length !== 0) {
        lib$es6$promise$asap$$asap(lib$es6$promise$$internal$$publish, promise);
      }
    }

    function lib$es6$promise$$internal$$reject(promise, reason) {
      if (promise._state !== lib$es6$promise$$internal$$PENDING) { return; }
      promise._state = lib$es6$promise$$internal$$REJECTED;
      promise._result = reason;

      lib$es6$promise$asap$$asap(lib$es6$promise$$internal$$publishRejection, promise);
    }

    function lib$es6$promise$$internal$$subscribe(parent, child, onFulfillment, onRejection) {
      var subscribers = parent._subscribers;
      var length = subscribers.length;

      parent._onerror = null;

      subscribers[length] = child;
      subscribers[length + lib$es6$promise$$internal$$FULFILLED] = onFulfillment;
      subscribers[length + lib$es6$promise$$internal$$REJECTED]  = onRejection;

      if (length === 0 && parent._state) {
        lib$es6$promise$asap$$asap(lib$es6$promise$$internal$$publish, parent);
      }
    }

    function lib$es6$promise$$internal$$publish(promise) {
      var subscribers = promise._subscribers;
      var settled = promise._state;

      if (subscribers.length === 0) { return; }

      var child, callback, detail = promise._result;

      for (var i = 0; i < subscribers.length; i += 3) {
        child = subscribers[i];
        callback = subscribers[i + settled];

        if (child) {
          lib$es6$promise$$internal$$invokeCallback(settled, child, callback, detail);
        } else {
          callback(detail);
        }
      }

      promise._subscribers.length = 0;
    }

    function lib$es6$promise$$internal$$ErrorObject() {
      this.error = null;
    }

    var lib$es6$promise$$internal$$TRY_CATCH_ERROR = new lib$es6$promise$$internal$$ErrorObject();

    function lib$es6$promise$$internal$$tryCatch(callback, detail) {
      try {
        return callback(detail);
      } catch(e) {
        lib$es6$promise$$internal$$TRY_CATCH_ERROR.error = e;
        return lib$es6$promise$$internal$$TRY_CATCH_ERROR;
      }
    }

    function lib$es6$promise$$internal$$invokeCallback(settled, promise, callback, detail) {
      var hasCallback = lib$es6$promise$utils$$isFunction(callback),
          value, error, succeeded, failed;

      if (hasCallback) {
        value = lib$es6$promise$$internal$$tryCatch(callback, detail);

        if (value === lib$es6$promise$$internal$$TRY_CATCH_ERROR) {
          failed = true;
          error = value.error;
          value = null;
        } else {
          succeeded = true;
        }

        if (promise === value) {
          lib$es6$promise$$internal$$reject(promise, lib$es6$promise$$internal$$cannotReturnOwn());
          return;
        }

      } else {
        value = detail;
        succeeded = true;
      }

      if (promise._state !== lib$es6$promise$$internal$$PENDING) {
        // noop
      } else if (hasCallback && succeeded) {
        lib$es6$promise$$internal$$resolve(promise, value);
      } else if (failed) {
        lib$es6$promise$$internal$$reject(promise, error);
      } else if (settled === lib$es6$promise$$internal$$FULFILLED) {
        lib$es6$promise$$internal$$fulfill(promise, value);
      } else if (settled === lib$es6$promise$$internal$$REJECTED) {
        lib$es6$promise$$internal$$reject(promise, value);
      }
    }

    function lib$es6$promise$$internal$$initializePromise(promise, resolver) {
      try {
        resolver(function resolvePromise(value){
          lib$es6$promise$$internal$$resolve(promise, value);
        }, function rejectPromise(reason) {
          lib$es6$promise$$internal$$reject(promise, reason);
        });
      } catch(e) {
        lib$es6$promise$$internal$$reject(promise, e);
      }
    }

    function lib$es6$promise$enumerator$$Enumerator(Constructor, input) {
      var enumerator = this;

      enumerator._instanceConstructor = Constructor;
      enumerator.promise = new Constructor(lib$es6$promise$$internal$$noop);

      if (enumerator._validateInput(input)) {
        enumerator._input     = input;
        enumerator.length     = input.length;
        enumerator._remaining = input.length;

        enumerator._init();

        if (enumerator.length === 0) {
          lib$es6$promise$$internal$$fulfill(enumerator.promise, enumerator._result);
        } else {
          enumerator.length = enumerator.length || 0;
          enumerator._enumerate();
          if (enumerator._remaining === 0) {
            lib$es6$promise$$internal$$fulfill(enumerator.promise, enumerator._result);
          }
        }
      } else {
        lib$es6$promise$$internal$$reject(enumerator.promise, enumerator._validationError());
      }
    }

    lib$es6$promise$enumerator$$Enumerator.prototype._validateInput = function(input) {
      return lib$es6$promise$utils$$isArray(input);
    };

    lib$es6$promise$enumerator$$Enumerator.prototype._validationError = function() {
      return new Error('Array Methods must be provided an Array');
    };

    lib$es6$promise$enumerator$$Enumerator.prototype._init = function() {
      this._result = new Array(this.length);
    };

    var lib$es6$promise$enumerator$$default = lib$es6$promise$enumerator$$Enumerator;

    lib$es6$promise$enumerator$$Enumerator.prototype._enumerate = function() {
      var enumerator = this;

      var length  = enumerator.length;
      var promise = enumerator.promise;
      var input   = enumerator._input;

      for (var i = 0; promise._state === lib$es6$promise$$internal$$PENDING && i < length; i++) {
        enumerator._eachEntry(input[i], i);
      }
    };

    lib$es6$promise$enumerator$$Enumerator.prototype._eachEntry = function(entry, i) {
      var enumerator = this;
      var c = enumerator._instanceConstructor;

      if (lib$es6$promise$utils$$isMaybeThenable(entry)) {
        if (entry.constructor === c && entry._state !== lib$es6$promise$$internal$$PENDING) {
          entry._onerror = null;
          enumerator._settledAt(entry._state, i, entry._result);
        } else {
          enumerator._willSettleAt(c.resolve(entry), i);
        }
      } else {
        enumerator._remaining--;
        enumerator._result[i] = entry;
      }
    };

    lib$es6$promise$enumerator$$Enumerator.prototype._settledAt = function(state, i, value) {
      var enumerator = this;
      var promise = enumerator.promise;

      if (promise._state === lib$es6$promise$$internal$$PENDING) {
        enumerator._remaining--;

        if (state === lib$es6$promise$$internal$$REJECTED) {
          lib$es6$promise$$internal$$reject(promise, value);
        } else {
          enumerator._result[i] = value;
        }
      }

      if (enumerator._remaining === 0) {
        lib$es6$promise$$internal$$fulfill(promise, enumerator._result);
      }
    };

    lib$es6$promise$enumerator$$Enumerator.prototype._willSettleAt = function(promise, i) {
      var enumerator = this;

      lib$es6$promise$$internal$$subscribe(promise, undefined, function(value) {
        enumerator._settledAt(lib$es6$promise$$internal$$FULFILLED, i, value);
      }, function(reason) {
        enumerator._settledAt(lib$es6$promise$$internal$$REJECTED, i, reason);
      });
    };
    function lib$es6$promise$promise$all$$all(entries) {
      return new lib$es6$promise$enumerator$$default(this, entries).promise;
    }
    var lib$es6$promise$promise$all$$default = lib$es6$promise$promise$all$$all;
    function lib$es6$promise$promise$race$$race(entries) {
      /*jshint validthis:true */
      var Constructor = this;

      var promise = new Constructor(lib$es6$promise$$internal$$noop);

      if (!lib$es6$promise$utils$$isArray(entries)) {
        lib$es6$promise$$internal$$reject(promise, new TypeError('You must pass an array to race.'));
        return promise;
      }

      var length = entries.length;

      function onFulfillment(value) {
        lib$es6$promise$$internal$$resolve(promise, value);
      }

      function onRejection(reason) {
        lib$es6$promise$$internal$$reject(promise, reason);
      }

      for (var i = 0; promise._state === lib$es6$promise$$internal$$PENDING && i < length; i++) {
        lib$es6$promise$$internal$$subscribe(Constructor.resolve(entries[i]), undefined, onFulfillment, onRejection);
      }

      return promise;
    }
    var lib$es6$promise$promise$race$$default = lib$es6$promise$promise$race$$race;
    function lib$es6$promise$promise$resolve$$resolve(object) {
      /*jshint validthis:true */
      var Constructor = this;

      if (object && typeof object === 'object' && object.constructor === Constructor) {
        return object;
      }

      var promise = new Constructor(lib$es6$promise$$internal$$noop);
      lib$es6$promise$$internal$$resolve(promise, object);
      return promise;
    }
    var lib$es6$promise$promise$resolve$$default = lib$es6$promise$promise$resolve$$resolve;
    function lib$es6$promise$promise$reject$$reject(reason) {
      /*jshint validthis:true */
      var Constructor = this;
      var promise = new Constructor(lib$es6$promise$$internal$$noop);
      lib$es6$promise$$internal$$reject(promise, reason);
      return promise;
    }
    var lib$es6$promise$promise$reject$$default = lib$es6$promise$promise$reject$$reject;

    var lib$es6$promise$promise$$counter = 0;

    function lib$es6$promise$promise$$needsResolver() {
      throw new TypeError('You must pass a resolver function as the first argument to the promise constructor');
    }

    function lib$es6$promise$promise$$needsNew() {
      throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");
    }

    var lib$es6$promise$promise$$default = lib$es6$promise$promise$$Promise;
    /**
      Promise objects represent the eventual result of an asynchronous operation. The
      primary way of interacting with a promise is through its `then` method, which
      registers callbacks to receive either a promise's eventual value or the reason
      why the promise cannot be fulfilled.

      Terminology
      -----------

      - `promise` is an object or function with a `then` method whose behavior conforms to this specification.
      - `thenable` is an object or function that defines a `then` method.
      - `value` is any legal JavaScript value (including undefined, a thenable, or a promise).
      - `exception` is a value that is thrown using the throw statement.
      - `reason` is a value that indicates why a promise was rejected.
      - `settled` the final resting state of a promise, fulfilled or rejected.

      A promise can be in one of three states: pending, fulfilled, or rejected.

      Promises that are fulfilled have a fulfillment value and are in the fulfilled
      state.  Promises that are rejected have a rejection reason and are in the
      rejected state.  A fulfillment value is never a thenable.

      Promises can also be said to *resolve* a value.  If this value is also a
      promise, then the original promise's settled state will match the value's
      settled state.  So a promise that *resolves* a promise that rejects will
      itself reject, and a promise that *resolves* a promise that fulfills will
      itself fulfill.


      Basic Usage:
      ------------

      ```js
      var promise = new Promise(function(resolve, reject) {
        // on success
        resolve(value);

        // on failure
        reject(reason);
      });

      promise.then(function(value) {
        // on fulfillment
      }, function(reason) {
        // on rejection
      });
      ```

      Advanced Usage:
      ---------------

      Promises shine when abstracting away asynchronous interactions such as
      `XMLHttpRequest`s.

      ```js
      function getJSON(url) {
        return new Promise(function(resolve, reject){
          var xhr = new XMLHttpRequest();

          xhr.open('GET', url);
          xhr.onreadystatechange = handler;
          xhr.responseType = 'json';
          xhr.setRequestHeader('Accept', 'application/json');
          xhr.send();

          function handler() {
            if (this.readyState === this.DONE) {
              if (this.status === 200) {
                resolve(this.response);
              } else {
                reject(new Error('getJSON: `' + url + '` failed with status: [' + this.status + ']'));
              }
            }
          };
        });
      }

      getJSON('/posts.json').then(function(json) {
        // on fulfillment
      }, function(reason) {
        // on rejection
      });
      ```

      Unlike callbacks, promises are great composable primitives.

      ```js
      Promise.all([
        getJSON('/posts'),
        getJSON('/comments')
      ]).then(function(values){
        values[0] // => postsJSON
        values[1] // => commentsJSON

        return values;
      });
      ```

      @class Promise
      @param {function} resolver
      Useful for tooling.
      @constructor
    */
    function lib$es6$promise$promise$$Promise(resolver) {
      this._id = lib$es6$promise$promise$$counter++;
      this._state = undefined;
      this._result = undefined;
      this._subscribers = [];

      if (lib$es6$promise$$internal$$noop !== resolver) {
        if (!lib$es6$promise$utils$$isFunction(resolver)) {
          lib$es6$promise$promise$$needsResolver();
        }

        if (!(this instanceof lib$es6$promise$promise$$Promise)) {
          lib$es6$promise$promise$$needsNew();
        }

        lib$es6$promise$$internal$$initializePromise(this, resolver);
      }
    }

    lib$es6$promise$promise$$Promise.all = lib$es6$promise$promise$all$$default;
    lib$es6$promise$promise$$Promise.race = lib$es6$promise$promise$race$$default;
    lib$es6$promise$promise$$Promise.resolve = lib$es6$promise$promise$resolve$$default;
    lib$es6$promise$promise$$Promise.reject = lib$es6$promise$promise$reject$$default;
    lib$es6$promise$promise$$Promise._setScheduler = lib$es6$promise$asap$$setScheduler;
    lib$es6$promise$promise$$Promise._setAsap = lib$es6$promise$asap$$setAsap;
    lib$es6$promise$promise$$Promise._asap = lib$es6$promise$asap$$asap;

    lib$es6$promise$promise$$Promise.prototype = {
      constructor: lib$es6$promise$promise$$Promise,

    /**
      The primary way of interacting with a promise is through its `then` method,
      which registers callbacks to receive either a promise's eventual value or the
      reason why the promise cannot be fulfilled.

      ```js
      findUser().then(function(user){
        // user is available
      }, function(reason){
        // user is unavailable, and you are given the reason why
      });
      ```

      Chaining
      --------

      The return value of `then` is itself a promise.  This second, 'downstream'
      promise is resolved with the return value of the first promise's fulfillment
      or rejection handler, or rejected if the handler throws an exception.

      ```js
      findUser().then(function (user) {
        return user.name;
      }, function (reason) {
        return 'default name';
      }).then(function (userName) {
        // If `findUser` fulfilled, `userName` will be the user's name, otherwise it
        // will be `'default name'`
      });

      findUser().then(function (user) {
        throw new Error('Found user, but still unhappy');
      }, function (reason) {
        throw new Error('`findUser` rejected and we're unhappy');
      }).then(function (value) {
        // never reached
      }, function (reason) {
        // if `findUser` fulfilled, `reason` will be 'Found user, but still unhappy'.
        // If `findUser` rejected, `reason` will be '`findUser` rejected and we're unhappy'.
      });
      ```
      If the downstream promise does not specify a rejection handler, rejection reasons will be propagated further downstream.

      ```js
      findUser().then(function (user) {
        throw new PedagogicalException('Upstream error');
      }).then(function (value) {
        // never reached
      }).then(function (value) {
        // never reached
      }, function (reason) {
        // The `PedgagocialException` is propagated all the way down to here
      });
      ```

      Assimilation
      ------------

      Sometimes the value you want to propagate to a downstream promise can only be
      retrieved asynchronously. This can be achieved by returning a promise in the
      fulfillment or rejection handler. The downstream promise will then be pending
      until the returned promise is settled. This is called *assimilation*.

      ```js
      findUser().then(function (user) {
        return findCommentsByAuthor(user);
      }).then(function (comments) {
        // The user's comments are now available
      });
      ```

      If the assimliated promise rejects, then the downstream promise will also reject.

      ```js
      findUser().then(function (user) {
        return findCommentsByAuthor(user);
      }).then(function (comments) {
        // If `findCommentsByAuthor` fulfills, we'll have the value here
      }, function (reason) {
        // If `findCommentsByAuthor` rejects, we'll have the reason here
      });
      ```

      Simple Example
      --------------

      Synchronous Example

      ```javascript
      var result;

      try {
        result = findResult();
        // success
      } catch(reason) {
        // failure
      }
      ```

      Errback Example

      ```js
      findResult(function(result, err){
        if (err) {
          // failure
        } else {
          // success
        }
      });
      ```

      Promise Example;

      ```javascript
      findResult().then(function(result){
        // success
      }, function(reason){
        // failure
      });
      ```

      Advanced Example
      --------------

      Synchronous Example

      ```javascript
      var author, books;

      try {
        author = findAuthor();
        books  = findBooksByAuthor(author);
        // success
      } catch(reason) {
        // failure
      }
      ```

      Errback Example

      ```js

      function foundBooks(books) {

      }

      function failure(reason) {

      }

      findAuthor(function(author, err){
        if (err) {
          failure(err);
          // failure
        } else {
          try {
            findBoooksByAuthor(author, function(books, err) {
              if (err) {
                failure(err);
              } else {
                try {
                  foundBooks(books);
                } catch(reason) {
                  failure(reason);
                }
              }
            });
          } catch(error) {
            failure(err);
          }
          // success
        }
      });
      ```

      Promise Example;

      ```javascript
      findAuthor().
        then(findBooksByAuthor).
        then(function(books){
          // found books
      }).catch(function(reason){
        // something went wrong
      });
      ```

      @method then
      @param {Function} onFulfilled
      @param {Function} onRejected
      Useful for tooling.
      @return {Promise}
    */
      then: function(onFulfillment, onRejection) {
        var parent = this;
        var state = parent._state;

        if (state === lib$es6$promise$$internal$$FULFILLED && !onFulfillment || state === lib$es6$promise$$internal$$REJECTED && !onRejection) {
          return this;
        }

        var child = new this.constructor(lib$es6$promise$$internal$$noop);
        var result = parent._result;

        if (state) {
          var callback = arguments[state - 1];
          lib$es6$promise$asap$$asap(function(){
            lib$es6$promise$$internal$$invokeCallback(state, child, callback, result);
          });
        } else {
          lib$es6$promise$$internal$$subscribe(parent, child, onFulfillment, onRejection);
        }

        return child;
      },

    /**
      `catch` is simply sugar for `then(undefined, onRejection)` which makes it the same
      as the catch block of a try/catch statement.

      ```js
      function findAuthor(){
        throw new Error('couldn't find that author');
      }

      // synchronous
      try {
        findAuthor();
      } catch(reason) {
        // something went wrong
      }

      // async with promises
      findAuthor().catch(function(reason){
        // something went wrong
      });
      ```

      @method catch
      @param {Function} onRejection
      Useful for tooling.
      @return {Promise}
    */
      'catch': function(onRejection) {
        return this.then(null, onRejection);
      }
    };
    function lib$es6$promise$polyfill$$polyfill() {
      var local;

      if (typeof global !== 'undefined') {
          local = global;
      } else if (typeof self !== 'undefined') {
          local = self;
      } else {
          try {
              local = Function('return this')();
          } catch (e) {
              throw new Error('polyfill failed because global object is unavailable in this environment');
          }
      }

      var P = local.Promise;

      if (P && Object.prototype.toString.call(P.resolve()) === '[object Promise]' && !P.cast) {
        return;
      }

      local.Promise = lib$es6$promise$promise$$default;
    }
    var lib$es6$promise$polyfill$$default = lib$es6$promise$polyfill$$polyfill;

    var lib$es6$promise$umd$$ES6Promise = {
      'Promise': lib$es6$promise$promise$$default,
      'polyfill': lib$es6$promise$polyfill$$default
    };

    /* global define:true module:true window: true */
    if (typeof define === 'function' && define['amd']) {
      define(function() { return lib$es6$promise$umd$$ES6Promise; });
    } else if (typeof module !== 'undefined' && module['exports']) {
      module['exports'] = lib$es6$promise$umd$$ES6Promise;
    } else if (typeof this !== 'undefined') {
      this['ES6Promise'] = lib$es6$promise$umd$$ES6Promise;
    }

    lib$es6$promise$polyfill$$default();
}).call(this);


}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"_process":2}],2:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = setTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            currentQueue[queueIndex].run();
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    clearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        setTimeout(drainQueue, 0);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

if (!Object.assign) {
    Object.defineProperty(Object, 'assign', {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function value(target) {
            'use strict';
            if (target === undefined || target === null) {
                throw new TypeError('Cannot convert first argument to object');
            }

            var to = Object(target);
            for (var i = 1; i < arguments.length; i++) {
                var nextSource = arguments[i];
                if (nextSource === undefined || nextSource === null) {
                    continue;
                }
                nextSource = Object(nextSource);

                var keysArray = Object.keys(Object(nextSource));
                for (var nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex++) {
                    var nextKey = keysArray[nextIndex];
                    var desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
                    if (desc !== undefined && desc.enumerable) {
                        to[nextKey] = nextSource[nextKey];
                    }
                }
            }
            return to;
        }
    });
}

// Use inline-style completely

var DrawerView = (function (_React$Component) {
    function DrawerView(props) {
        _classCallCheck(this, DrawerView);

        _get(Object.getPrototypeOf(DrawerView.prototype), 'constructor', this).call(this, props);
    }

    _inherits(DrawerView, _React$Component);

    _createClass(DrawerView, [{
        key: 'render',
        value: function render() {
            return _react2['default'].createElement(
                'div',
                { className: 'DrawerView ' + (this.props.navOpen ? 'DrawerView--drawer-open' : '') },
                _react2['default'].createElement(
                    'div',
                    { className: 'DrawerView--Nav' },
                    _react2['default'].createElement(
                        'div',
                        { className: 'DrawerView--NavMast' },
                        this.props.header
                    ),
                    _react2['default'].createElement(
                        'ul',
                        { className: 'DrawerView--NavLinks' },
                        this.props.links.map(function (link) {
                            return _react2['default'].createElement(
                                'li',
                                { className: 'DrawerView--NavLink' },
                                _react2['default'].createElement(
                                    'a',
                                    { href: link.href },
                                    link.name
                                )
                            );
                        })
                    )
                ),
                _react2['default'].createElement(
                    'div',
                    { className: 'DrawerView--Contents' },
                    this.props.children
                )
            );
        }
    }]);

    return DrawerView;
})(_react2['default'].Component);

DrawerView.defaultProps = {
    links: []
};

DrawerView.propTypes = {
    links: _react2['default'].PropTypes.array,
    header: _react2['default'].PropTypes.element
};
exports['default'] = DrawerView;
module.exports = exports['default'];

},{"react":undefined}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var Layout = (function (_React$Component) {
	function Layout() {
		_classCallCheck(this, Layout);

		_get(Object.getPrototypeOf(Layout.prototype), 'constructor', this).apply(this, arguments);
	}

	_inherits(Layout, _React$Component);

	_createClass(Layout, [{
		key: 'render',
		value: function render() {
			var cname = (0, _classnames2['default'])({ 'Vertical-Layout': this.props.vertical }, { 'Horizontal-Layout': this.props.horizontal });

			var styles = this.props;

			return _react2['default'].createElement(
				'div',
				{ className: cname, style: styles },
				this.props.children
			);
		}
	}]);

	return Layout;
})(_react2['default'].Component);

var FlexCell = (function (_React$Component2) {
	function FlexCell() {
		_classCallCheck(this, FlexCell);

		_get(Object.getPrototypeOf(FlexCell.prototype), 'constructor', this).apply(this, arguments);
	}

	_inherits(FlexCell, _React$Component2);

	_createClass(FlexCell, [{
		key: 'render',
		value: function render() {
			if (this.props.fillFix === true) {
				return _react2['default'].createElement(
					'div',
					{ className: 'Cell-Flex' },
					_react2['default'].createElement(
						'div',
						{ className: 'flex-fill-fix' },
						this.props.children
					)
				);
			}
			return _react2['default'].createElement(
				'div',
				{ className: 'Cell-Flex' },
				this.props.children
			);
		}
	}]);

	return FlexCell;
})(_react2['default'].Component);

var FixedCell = (function (_React$Component3) {
	function FixedCell() {
		_classCallCheck(this, FixedCell);

		_get(Object.getPrototypeOf(FixedCell.prototype), 'constructor', this).apply(this, arguments);
	}

	_inherits(FixedCell, _React$Component3);

	_createClass(FixedCell, [{
		key: 'render',
		value: function render() {
			return _react2['default'].createElement(
				'div',
				{ className: 'Cell-Fixed' },
				this.props.children
			);
		}
	}]);

	return FixedCell;
})(_react2['default'].Component);

exports['default'] = { Layout: Layout, FixedCell: FixedCell, FlexCell: FlexCell };
module.exports = exports['default'];

},{"classnames":undefined,"react":undefined}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _libRing = require('./lib/Ring');

var _libRing2 = _interopRequireDefault(_libRing);

var _es6Promise = require('es6-promise');

var _libSmartScroll = require('./lib/SmartScroll');

var _libSmartScroll2 = _interopRequireDefault(_libSmartScroll);

// @Internal
// @Example
// <UIScrollViewElement renderer data height order/>

var UIScrollViewElement = (function (_React$Component) {
	function UIScrollViewElement(props) {
		var _this = this;

		_classCallCheck(this, UIScrollViewElement);

		_get(Object.getPrototypeOf(UIScrollViewElement.prototype), 'constructor', this).call(this, props);
		this.state = {};

		if (props.element instanceof _es6Promise.Promise) {
			this.state.isPromised = true;
			props.data.then(function (data) {
				return _this.setState({ data: data });
			});
			return;
		}
		this.state.data = this.props.data;
	}

	_inherits(UIScrollViewElement, _React$Component);

	_createClass(UIScrollViewElement, [{
		key: 'render',
		value: function render() {
			var styling = {
				height: this.props.height,
				order: this.props.order
			};

			return _react2['default'].createElement(
				'div',
				{ className: 'ListView--Element', style: styling },
				_react2['default'].createElement(this.props.renderer, { data: this.props.data })
			);
		}
	}]);

	return UIScrollViewElement;
})(_react2['default'].Component);

/* @Component
	 @name: UIScrollView
	 
	 @attributes
		 
		 @attribute 
			@name: elementRenderer
			@type: React.Component
			@desc: Reference to the class to render components.
		 
		 @attribute
			@name: backDrop
			@optional: true
			@type: React.Component
			@desc: In case the data is to be queried online this will
						 render a loading state, defaults to DefaultBackProp
			
		 @attribute
			@name: dataSource
			@type: ListView.DataSource
			@desc: A datasource from which items will be generated
						 in case the data is to be queried a promise may 
						 be returned, the listview will wait this can be
						 a use case for querying items dynamically like
						 UITableView
						 
		 @attribute: 
			@name: elementHeight
			@type: integer
			@desc: Height of individual element to be rendered,
						 this will be passed on to the containers.
		
		 @attribute: 
			@NOT_IMPLEMENTED
			@name: layout
			@type: ItemRendererClass
 */

var UIScrollView = (function (_React$Component2) {
	function UIScrollView(props) {
		_classCallCheck(this, UIScrollView);

		_get(Object.getPrototypeOf(UIScrollView.prototype), 'constructor', this).call(this, props);
		this.state = {
			range: {
				startPoint: -1,
				endPoint: -1,
				inViewPort: 0,
				totalElements: 0,
				elements: []
			}
		};
	}

	_inherits(UIScrollView, _React$Component2);

	_createClass(UIScrollView, [{
		key: 'shouldSkipRender',
		value: function shouldSkipRender(r1, r2) {
			return r1.totalElements === r2.totalElements && r1.startPoint === r2.startPoint && r1.endPoint === r2.endPoint;
		}
	}, {
		key: 'isDiffLen',
		value: function isDiffLen(range1, range2) {
			return range1.totalElements != range2.totalElements;
		}
	}, {
		key: 'isReusable',
		value: function isReusable(range1, range2) {
			//why ? because fuck redability thats why
			return range1.startPoint > range2.startPoint ? range1.startPoint < range2.endPoint : range1.endPoint > range2.startPoint;
		}
	}, {
		key: 'getRangeOfElements',
		value: function getRangeOfElements(scrollTop, viewPortHeight, elementHeight) {
			var inViewPort = Math.ceil(viewPortHeight / elementHeight);
			var outOfViewPort = inViewPort;
			var startPoint = Math.max(Math.floor(scrollTop / elementHeight) - outOfViewPort, 0);
			var totalElements = inViewPort + outOfViewPort + outOfViewPort;
			var endPoint = startPoint + totalElements;
			var length = this.props.dataSource.length;
			if (endPoint >= length) {
				startPoint -= outOfViewPort;
				endPoint = length - 1;
			}
			// run updates via batching.
			return { startPoint: startPoint, endPoint: endPoint, inViewPort: inViewPort, totalElements: totalElements, scrollTop: scrollTop };
		}
	}, {
		key: 'computeBoundsAndUpdateRange',

		// index of node
		// order of node

		value: function computeBoundsAndUpdateRange(scrollLeft, scrollTop) {
			// maybe cache this ?
			var viewPortHeight = this.viewPortHeight;
			var _props = this.props;
			var elementHeight = _props.elementHeight;
			var elementRenderer = _props.elementRenderer;
			var dataSource = _props.dataSource;

			var newRange = this.getRangeOfElements(scrollTop, viewPortHeight, elementHeight);
			var currentRange = this.state.range;
			var elements = undefined;
			if (this.shouldSkipRender(newRange, currentRange)) {
				return;
				// elements = currentRange.elements;
			} else {
				if (!this.isDiffLen(newRange, currentRange) && this.isReusable(newRange, currentRange)) {
					(function () {
						elements = currentRange.elements;
						var offset = newRange.startPoint - currentRange.startPoint;
						var goingUp = offset < 0;
						var startPoint = goingUp ? newRange.startPoint : newRange.endPoint;
						var length = dataSource.length;
						var noop = function noop(s) {};

						var mapData = function mapData(element, index) {
							var itemIndex = goingUp ? startPoint + index : startPoint - index;
							if (length < itemIndex) {
								return element.node = '';
							};
							element.node = _react2['default'].createElement(UIScrollViewElement, {
								key: element.i, order: itemIndex,
								data: dataSource.getItemAtIndex(itemIndex),
								height: elementHeight, renderer: elementRenderer
							});
						};

						if (goingUp) {
							elements.turnAntiClockwise(-offset, mapData);
						} else {
							elements.turnClockwise(offset, mapData);
						}
					})();
				} else {

					elements = new _libRing2['default']();
					var node = null;
					for (var i = newRange.startPoint; i <= newRange.endPoint; i++) {
						node = _react2['default'].createElement(UIScrollViewElement, {
							key: i, order: i, data: dataSource.getItemAtIndex(i),
							height: elementHeight, renderer: elementRenderer
						});
						elements.push({ node: node, i: i });
					}
				}
			}

			newRange.elements = elements;
			this.setState({
				isReady: true,
				range: newRange
			});
		}
	}, {
		key: 'componentDidMount',
		value: function componentDidMount() {
			var _this2 = this;

			// give browser time to sync ui
			var scrollWrapper = _react2['default'].findDOMNode(this);
			var elementHeight = this.props.elementHeight;
			var len = this.props.dataSource.length;
			this.viewPortHeight = scrollWrapper.offsetHeight;
			this.viewPortWidth = scrollWrapper.offsetWidth;

			// scrollWrapper.addEventListener('mousewheel', this.channelScroll.bind(this));
			// if( 'ontouchstart' in window ){
			// 	scrollWrapper.addEventListener('touchstart', this.channelTouchStart.bind(this));
			// 	scrollWrapper.addEventListener('touchmove', this.channelTouchMove.bind(this));
			// 	scrollWrapper.addEventListener('touchend', this.channelTouchEnd.bind(this));	
			// }else{
			this.scroller = new _libSmartScroll2['default'](scrollWrapper, {
				raf: false,
				eventPerSecond: 10
			});

			this.scroller.on('scroll.move', function (e) {
				return _this2.channelNativeScroll(e);
			});
			// }

			// this.scroller.setDimensions(this.viewPortWidth, this.viewPortHeight, this.viewPortWidth, len * elementHeight);
			this.computeBoundsAndUpdateRange(0, 0);
		}
	}, {
		key: 'prepareRenderedArray',
		value: function prepareRenderedArray() {
			var range = this.state.range;

			return range.elements.mapClockwise(function (item) {
				return item.node;
			});
		}
	}, {
		key: 'handleScroll',
		value: function handleScroll(left, top, zoom) {
			this.computeBoundsAndUpdateRange(left, top);
		}
	}, {
		key: 'channelNativeScroll',

		// channelTouchStart(e){
		// 	console.log(e.touches);
		// 	this.scroller.doTouchStart(e.touches, e.timeStamp);
		// }

		// channelTouchMove(e){
		// 	this.scroller.doTouchMove(e.touches, e.timeStamp);
		// }

		// channelTouchEnd(e){
		// 	this.scroller.doTouchEnd(e.timeStamp);
		// }

		value: function channelNativeScroll(e) {
			this.handleScroll(e.scrollLeft, e.scrollTop, 1);
		}
	}, {
		key: 'render',
		value: function render() {
			// @todo: find better method.
			if (!this.state.isReady) {
				return _react2['default'].createElement(
					'div',
					{ className: 'ListView' },
					_react2['default'].createElement('div', { className: 'ListView--Inner' })
				);
			}

			var styling = { height: this.state.range.startPoint * this.props.elementHeight };
			var contentH = { minHeight: this.props.dataSource.length * this.props.elementHeight };
			return _react2['default'].createElement(
				'div',
				{ className: 'ListView' },
				_react2['default'].createElement(
					'div',
					{ className: 'ListView--Inner', style: contentH },
					_react2['default'].createElement('div', { className: 'ListView--Padder', style: styling }),
					this.prepareRenderedArray()
				)
			);
		}
	}]);

	return UIScrollView;
})(_react2['default'].Component);

;

exports['default'] = { UIScrollView: UIScrollView, UIScrollViewElement: UIScrollViewElement };
module.exports = exports['default'];

},{"./lib/Ring":8,"./lib/SmartScroll":9,"es6-promise":1,"react":undefined}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _libSmartScrollJs = require('./lib/SmartScroll.js');

var _libSmartScrollJs2 = _interopRequireDefault(_libSmartScrollJs);

var _libRingJs = require('./lib/Ring.js');

var _libRingJs2 = _interopRequireDefault(_libRingJs);

var _UILayoutJs = require('./UILayout.js');

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

// shall we use UIScrollView ?
// maybe but not now.

var UITabsView = (function (_React$Component) {
	/*  
 	This will do a lot more than we think,
 	first off how to get those nifty transitions in windows phone everywhere.
 */

	function UITabsView(props) {
		_classCallCheck(this, UITabsView);

		_get(Object.getPrototypeOf(UITabsView.prototype), 'constructor', this).call(this, props);
		this.state = {
			selectedTab: 0
		};
	}

	_inherits(UITabsView, _React$Component);

	_createClass(UITabsView, [{
		key: 'componentDidMount',
		value: function componentDidMount() {
			var _this = this;

			var domNode = _react2['default'].findDOMNode(this);
			var scrollerNode = _react2['default'].findDOMNode(this.refs.foo);
			this.scroller = new _libSmartScrollJs2['default'](scrollerNode, {
				raf: false,
				eventPerSecond: 10
			});
			this.viewPortWidth = domNode.offsetWidth;
			window.x = scrollerNode;
			this.scroller.on('scroll.end', function (e) {
				return _this._handleScrollEnd(e);
			});
			this.setState({
				mounted: true
			});
		}
	}, {
		key: '_handleScrollEnd',
		value: function _handleScrollEnd(e) {
			console.log(e);
			var viewPortWidth = this.viewPortWidth;
			var scrollX = e.scrollLeft + this.viewPortWidth / 2;
			this.setState({
				selectedTab: Math.floor(scrollX / viewPortWidth)
			});
		}
	}, {
		key: 'render',

		// Tabs must support swipe gesture if enabled
		// @todo: use width via css.

		value: function render() {
			var _this2 = this;

			var containerWidth = this.viewPortWidth * _react2['default'].Children.count(this.props.children);
			var contentWidth = this.viewPortWidth;
			console.log(this.viewPortWidth);
			return _react2['default'].createElement(
				'div',
				{ className: 'TabView' },
				_react2['default'].createElement(
					_UILayoutJs.Layout,
					{ vertical: true },
					_react2['default'].createElement(
						_UILayoutJs.FixedCell,
						null,
						_react2['default'].createElement(
							'ul',
							{ className: 'TabView--Headers' },
							_react2['default'].Children.map(this.props.children, function (element, index) {
								var className = (0, _classnames2['default'])('TabView--TabHeader', {
									'TabView--TabHeader-active': index === _this2.state.selectedTab
								});
								return _react2['default'].createElement(
									'li',
									{ className: className },
									element.props.title
								);
							})
						)
					),
					_react2['default'].createElement(
						_UILayoutJs.FlexCell,
						{ fillFix: true },
						_react2['default'].createElement(
							'div',
							{ className: 'TabView--ScrollContainer', ref: 'foo' },
							_react2['default'].createElement(
								'div',
								{ className: 'TabView--TabsContainer', style: { width: containerWidth } },
								_react2['default'].Children.map(this.props.children, function (element) {
									return _react2['default'].createElement(
										'div',
										{ className: 'TabView--TabWrapper', style: { width: contentWidth } },
										element
									);
								})
							)
						)
					)
				)
			);
		}
	}]);

	return UITabsView;
})(_react2['default'].Component);

exports['default'] = UITabsView;
module.exports = exports['default'];

},{"./UILayout.js":4,"./lib/Ring.js":8,"./lib/SmartScroll.js":9,"classnames":undefined,"react":undefined}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var EventEmitter = (function () {
    function EventEmitter() {
        _classCallCheck(this, EventEmitter);

        this._events = {};
        return this;
    }

    _createClass(EventEmitter, [{
        key: "on",
        value: function on(ev, handler) {
            var events = this._events;
            (events[ev] || (events[ev] = [])).push(handler);
        }
    }, {
        key: "removeListener",
        value: function removeListener(ev, handler) {
            var array = this._events[ev];

            array && array.splice(array.indexOf(handler), 1);
        }
    }, {
        key: "emit",
        value: function emit(ev) {
            var args = [].slice.call(arguments, 1),
                array = this._events[ev] || [];

            for (var i = 0, len = array.length; i < len; i++) {
                array[i].apply(this, args);
            }
        }
    }, {
        key: "once",
        value: function once(ev, handler) {
            this.on(ev, remover);

            function remover() {
                handler.apply(this, arguments);
                this.removeListener(ev, remover);
            }
        }
    }]);

    return EventEmitter;
})();

exports["default"] = EventEmitter;
module.exports = exports["default"];

},{}],8:[function(require,module,exports){
/* 
    @class : Ring
     @desc  : A circular linked list like data structure
                        only implemented as per our needs no need to
                        implement all methods. you must not play 
                        with this._elements treat it as pure immutable 
                        datastructure.
*/
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Ring = (function () {
    function Ring(length) {
        _classCallCheck(this, Ring);

        // For link list
        // now the problem is how to make the
        // constructor work faster better stronger
        this._start = null;
        this._originalStart = null;
        this._originalEnd = null;
        this._end = null;
    }

    _createClass(Ring, [{
        key: "_wrap",
        value: function _wrap(data, next, prev) {
            return { data: data, next: next, prev: prev };
        }
    }, {
        key: "push",
        value: function push(data) {
            var el = this._wrap(data, this._start, this._end);

            if (this._end) {
                this._end.next = el;
            }
            this._originalEnd = this._end = el;

            if (!this._start) {
                this._originalStart = this._start = this._end;
            }
            this._adjust();
        }
    }, {
        key: "_adjust",
        value: function _adjust() {
            this._end.next = this._start;
            this._start.prev = this._end;
        }
    }, {
        key: "pop",
        value: function pop() {
            this._end = this._end.prev;
            this._adjust();
        }
    }, {
        key: "shift",
        value: function shift() {
            this._start = this._start.next;
            this._adjust();
        }
    }, {
        key: "unshift",

        // just for the lulz
        value: function unshift(data) {
            var el = this._wrap(data, this._start, this._end);
            if (this._start) {
                this._start.prev = el;
            }
            this._start = el;
            if (!this._end) {
                this._end = this._start;
            }
            this._adjust();
        }
    }, {
        key: "turnAntiClockwise",
        value: function turnAntiClockwise(times, visitFn) {
            var el = null;
            for (var i = 0; i < times; i++) {
                el = this._end;
                this._start = el;
                this._end = el.prev;
                visitFn && visitFn(el.data, i);
            }
        }
    }, {
        key: "turnClockwise",
        value: function turnClockwise(times, visitFn) {
            var el = null;
            for (var i = 0; i < times; i++) {
                el = this._start;
                this._end = el;
                this._start = el.next;
                visitFn && visitFn(el.data, i);
            }
        }
    }, {
        key: "travelClockwise",

        // travellers work irrespective
        // of teh alignment
        value: function travelClockwise(visitor) {
            var el = this._originalStart;
            var i = 0;
            do {
                visitor(el, i++);
                el = el.next;
            } while (el !== this._originalStart);
        }
    }, {
        key: "travelAnticlockwise",
        value: function travelAnticlockwise(visitor) {
            var el = this._originalEnd;
            var i = 0;
            do {
                visitor(el, i);
                el = el.prev;
            } while (el !== this._originalEnd);
        }
    }, {
        key: "mapClockwise",
        value: function mapClockwise(visitor) {
            var el = this._originalStart,
                i = 0,
                arr = [];
            do {
                arr.push(visitor(el.data, i++));
                el = el.next;
            } while (el !== this._originalStart);
            return arr;
        }
    }, {
        key: "mapAntiClockwise",
        value: function mapAntiClockwise(visitor) {
            var el = this._originalEnd,
                i = 0,
                arr = [];
            do {
                arr.push(visitor(el.data, i++));
                el = el.prev;
            } while (el !== this._originalEnd);
            return arr;
        }
    }]);

    return Ring;
})();

;

exports["default"] = Ring;
module.exports = exports["default"];

},{}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _EventEmitter2 = require('./EventEmitter');

var _EventEmitter3 = _interopRequireDefault(_EventEmitter2);

var SmartScroll = (function (_EventEmitter) {
	function SmartScroll(element, options) {
		_classCallCheck(this, SmartScroll);

		// figure out how will we fix this on le-ios
		_get(Object.getPrototypeOf(SmartScroll.prototype), 'constructor', this).call(this);
		this._element = element;
		element.addEventListener('scroll', options.raf ? this._handleNativeRAF.bind(this) : this._handleNativeTimeout.bind(this));
		if ('ontouchstart' in window) {
			element.addEventListener('touchstart', this._handleTouchStart);
			element.addEventListener('touchend', this._handleTouchEnd);
		} else {
			element.addEventListener('mousedown', this._handleTouchStart);
			element.addEventListener('mouseup', this._handleTouchEnd);
		}
		if (!this.raf) {
			this._throttleBy = 1000 / (options.eventPerSecond || 60);
		}
		this._isScrolling = false;
		this._lastEventAt = 0;
		this._lastTop = 0;
		this._lastLeft = 0;
	}

	_inherits(SmartScroll, _EventEmitter);

	_createClass(SmartScroll, [{
		key: '_handleTouchStart',
		value: function _handleTouchStart(e) {
			console.log('TouchStart');
		}
	}, {
		key: '_handleTouchEnd',
		value: function _handleTouchEnd(e) {
			console.log('Touch End');
		}
	}, {
		key: '_sendStopped',
		value: function _sendStopped(t) {
			console.log('Stopped');
			this.emit('scroll.end', {
				scrollTop: this._lastTop,
				scrollLeft: this._lastLeft
			});
		}
	}, {
		key: '_throttledScroll',
		value: function _throttledScroll(e) {
			var _this = this;

			var last = this._lastEventAt;
			var now = e.timeStamp;
			var scrollTop = this._element.scrollTop;
			var scrollLeft = this._element.scrollLeft;

			if (!this._isScrolling) {
				this._isScrolling = true;
				last = now;
				this.emit('scroll.start', {
					scrollTop: scrollTop,
					scrollLeft: scrollLeft
				});
			}

			this.emit('scroll.move', {
				scrollTop: scrollTop,
				scrollLeft: scrollLeft
			});

			this._lastTop = scrollTop;
			this._lastLeft = scrollLeft;
			clearTimeout(this._interval);
			this._interval = setTimeout(function (tx) {
				return _this._sendStopped(tx);
			}, this._throttleBy);
			this._lastEventAt = now;
		}
	}, {
		key: '_handleNativeRAF',
		value: function _handleNativeRAF(e) {
			var _this2 = this;

			requestAnimationFrame(function (t) {
				return _this2._throttledScroll(e);
			});
		}
	}, {
		key: '_handleNativeTimeout',
		value: function _handleNativeTimeout(e) {
			var _this3 = this;

			setTimeout(function (t) {
				return _this3._throttledScroll(e);
			}, this._throttleBy);
		}
	}]);

	return SmartScroll;
})(_EventEmitter3['default']);

exports['default'] = SmartScroll;
module.exports = exports['default'];

},{"./EventEmitter":7}],"react-ui-components":[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _UIScrollView = require('./UIScrollView');

var _UIDrawerView = require('./UIDrawerView');

var _UIDrawerView2 = _interopRequireDefault(_UIDrawerView);

var _UITabsViewJs = require('./UITabsView.js');

var _UITabsViewJs2 = _interopRequireDefault(_UITabsViewJs);

var _UILayoutJs = require('./UILayout.js');

exports['default'] = {
	UIDrawerView: _UIDrawerView2['default'],
	UIScrollView: _UIScrollView.UIScrollView,
	UIScrollViewElement: _UIScrollView.UIScrollViewElement,
	UITabsView: _UITabsViewJs2['default'],
	Layout: _UILayoutJs.Layout,
	FixedCell: _UILayoutJs.FixedCell,
	FlexCell: _UILayoutJs.FlexCell
};
module.exports = exports['default'];

},{"./UIDrawerView":3,"./UILayout.js":4,"./UIScrollView":5,"./UITabsView.js":6}]},{},[]);
