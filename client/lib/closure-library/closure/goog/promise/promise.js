// Copyright 2013 The Closure Library Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

goog.provide('goog.Promise');

goog.require('goog.Thenable');
goog.require('goog.asserts');
goog.require('goog.async.run');
goog.require('goog.async.throwException');
goog.require('goog.debug.Error');
goog.require('goog.promise.Resolver');



***REMOVED***
***REMOVED*** Promises provide a result that may be resolved asynchronously. A Promise may
***REMOVED*** be resolved by being fulfilled or rejected with a value, which will be known
***REMOVED*** as the fulfillment value or the rejection reason. Whether fulfilled or
***REMOVED*** rejected, the Promise result is immutable once it is set.
***REMOVED***
***REMOVED*** Promises may represent results of any type, including undefined. Rejection
***REMOVED*** reasons are typically Errors, but may also be of any type. Closure Promises
***REMOVED*** allow for optional type annotations that enforce that fulfillment values are
***REMOVED*** of the appropriate types at compile time.
***REMOVED***
***REMOVED*** The result of a Promise is accessible by calling {@code then} and registering
***REMOVED*** {@code onFulfilled} and {@code onRejected} callbacks. Once the Promise
***REMOVED*** resolves, the relevant callbacks are invoked with the fulfillment value or
***REMOVED*** rejection reason as argument. Callbacks are always invoked in the order they
***REMOVED*** were registered, even when additional {@code then} calls are made from inside
***REMOVED*** another callback. A callback is always run asynchronously sometime after the
***REMOVED*** scope containing the registering {@code then} invocation has returned.
***REMOVED***
***REMOVED*** If a Promise is resolved with another Promise, the first Promise will block
***REMOVED*** until the second is resolved, and then assumes the same result as the second
***REMOVED*** Promise. This allows Promises to depend on the results of other Promises,
***REMOVED*** linking together multiple asynchronous operations.
***REMOVED***
***REMOVED*** This implementation is compatible with the Promises/A+ specification and
***REMOVED*** passes that specification's conformance test suite. A Closure Promise may be
***REMOVED*** resolved with a Promise instance (or sufficiently compatible Promise-like
***REMOVED*** object) created by other Promise implementations. From the specification,
***REMOVED*** Promise-like objects are known as "Thenables".
***REMOVED***
***REMOVED*** @see http://promisesaplus.com/
***REMOVED***
***REMOVED*** @param {function(
***REMOVED***             this:RESOLVER_CONTEXT,
***REMOVED***             function((TYPE|IThenable.<TYPE>|Thenable)=),
***REMOVED***             function(*)): void} resolver
***REMOVED***     Initialization function that is invoked immediately with {@code resolve}
***REMOVED***     and {@code reject} functions as arguments. The Promise is resolved or
***REMOVED***     rejected with the first argument passed to either function.
***REMOVED*** @param {RESOLVER_CONTEXT=} opt_context An optional context for executing the
***REMOVED***     resolver function. If unspecified, the resolver function will be executed
***REMOVED***     in the default scope.
***REMOVED***
***REMOVED*** @struct
***REMOVED*** @final
***REMOVED*** @implements {goog.Thenable.<TYPE>}
***REMOVED*** @template TYPE,RESOLVER_CONTEXT
***REMOVED***
goog.Promise = function(resolver, opt_context) {
 ***REMOVED*****REMOVED***
  ***REMOVED*** The internal state of this Promise. Either PENDING, FULFILLED, REJECTED, or
  ***REMOVED*** BLOCKED.
  ***REMOVED*** @private {goog.Promise.State_}
 ***REMOVED*****REMOVED***
  this.state_ = goog.Promise.State_.PENDING;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The resolved result of the Promise. Immutable once set with either a
  ***REMOVED*** fulfillment value or rejection reason.
  ***REMOVED*** @private {*}
 ***REMOVED*****REMOVED***
  this.result_ = undefined;

 ***REMOVED*****REMOVED***
  ***REMOVED*** For Promises created by calling {@code then()}, the originating parent.
  ***REMOVED*** @private {goog.Promise}
 ***REMOVED*****REMOVED***
  this.parent_ = null;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The list of {@code onFulfilled} and {@code onRejected} callbacks added to
  ***REMOVED*** this Promise by calls to {@code then()}.
  ***REMOVED*** @private {Array.<goog.Promise.CallbackEntry_>}
 ***REMOVED*****REMOVED***
  this.callbackEntries_ = null;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Whether the Promise is in the queue of Promises to execute.
  ***REMOVED*** @private {boolean}
 ***REMOVED*****REMOVED***
  this.executing_ = false;

  if (goog.Promise.UNHANDLED_REJECTION_DELAY > 0) {
   ***REMOVED*****REMOVED***
    ***REMOVED*** A timeout ID used when the {@code UNHANDLED_REJECTION_DELAY} is greater
    ***REMOVED*** than 0 milliseconds. The ID is set when the Promise is rejected, and
    ***REMOVED*** cleared only if an {@code onRejected} callback is invoked for the
    ***REMOVED*** Promise (or one of its descendants) before the delay is exceeded.
    ***REMOVED***
    ***REMOVED*** If the rejection is not handled before the timeout completes, the
    ***REMOVED*** rejection reason is passed to the unhandled rejection handler.
    ***REMOVED*** @private {number}
   ***REMOVED*****REMOVED***
    this.unhandledRejectionId_ = 0;
  } else if (goog.Promise.UNHANDLED_REJECTION_DELAY == 0) {
   ***REMOVED*****REMOVED***
    ***REMOVED*** When the {@code UNHANDLED_REJECTION_DELAY} is set to 0 milliseconds, a
    ***REMOVED*** boolean that is set if the Promise is rejected, and reset to false if an
    ***REMOVED*** {@code onRejected} callback is invoked for the Promise (or one of its
    ***REMOVED*** descendants). If the rejection is not handled before the next timestep,
    ***REMOVED*** the rejection reason is passed to the unhandled rejection handler.
    ***REMOVED*** @private {boolean}
   ***REMOVED*****REMOVED***
    this.hadUnhandledRejection_ = false;
  }

  if (goog.Promise.LONG_STACK_TRACES) {
   ***REMOVED*****REMOVED***
    ***REMOVED*** A list of stack trace frames pointing to the locations where this Promise
    ***REMOVED*** was created or had callbacks added to it. Saved to add additional context
    ***REMOVED*** to stack traces when an exception is thrown.
    ***REMOVED*** @private {!Array.<string>}
   ***REMOVED*****REMOVED***
    this.stack_ = [];
    this.addStackTrace_(new Error('created'));

   ***REMOVED*****REMOVED***
    ***REMOVED*** Index of the most recently executed stack frame entry.
    ***REMOVED*** @private {number}
   ***REMOVED*****REMOVED***
    this.currentStep_ = 0;
  }

  try {
  ***REMOVED***
    resolver.call(
        opt_context,
        function(value) {
          self.resolve_(goog.Promise.State_.FULFILLED, value);
        },
        function(reason) {
          self.resolve_(goog.Promise.State_.REJECTED, reason);
        });
  } catch (e) {
    this.resolve_(goog.Promise.State_.REJECTED, e);
  }
***REMOVED***


***REMOVED***
***REMOVED*** @define {boolean} Whether traces of {@code then} calls should be included in
***REMOVED*** exceptions thrown
***REMOVED***
goog.define('goog.Promise.LONG_STACK_TRACES', goog.DEBUG);


***REMOVED***
***REMOVED*** @define {number} The delay in milliseconds before a rejected Promise's reason
***REMOVED*** is passed to the rejection handler. By default, the rejection handler
***REMOVED*** rethrows the rejection reason so that it appears in the developer console or
***REMOVED*** {@code window.onerror} handler.
***REMOVED***
***REMOVED*** Rejections are rethrown as quickly as possible by default. A negative value
***REMOVED*** disables rejection handling entirely.
***REMOVED***
goog.define('goog.Promise.UNHANDLED_REJECTION_DELAY', 0);


***REMOVED***
***REMOVED*** The possible internal states for a Promise. These states are not directly
***REMOVED*** observable to external callers.
***REMOVED*** @enum {number}
***REMOVED*** @private
***REMOVED***
goog.Promise.State_ = {
 ***REMOVED*****REMOVED*** The Promise is waiting for resolution.***REMOVED***
  PENDING: 0,

 ***REMOVED*****REMOVED*** The Promise is blocked waiting for the result of another Thenable.***REMOVED***
  BLOCKED: 1,

 ***REMOVED*****REMOVED*** The Promise has been resolved with a fulfillment value.***REMOVED***
  FULFILLED: 2,

 ***REMOVED*****REMOVED*** The Promise has been resolved with a rejection reason.***REMOVED***
  REJECTED: 3
***REMOVED***


***REMOVED***
***REMOVED*** Typedef for entries in the callback chain. Each call to {@code then},
***REMOVED*** {@code thenCatch}, or {@code thenAlways} creates an entry containing the
***REMOVED*** functions that may be invoked once the Promise is resolved.
***REMOVED***
***REMOVED*** @typedef {{
***REMOVED***   child: goog.Promise,
***REMOVED***   onFulfilled: function(*),
***REMOVED***   onRejected: function(*)
***REMOVED*** }}
***REMOVED*** @private
***REMOVED***
goog.Promise.CallbackEntry_;


***REMOVED***
***REMOVED*** @param {(TYPE|goog.Thenable.<TYPE>|Thenable)=} opt_value
***REMOVED*** @return {!goog.Promise.<TYPE>} A new Promise that is immediately resolved
***REMOVED***     with the given value.
***REMOVED*** @template TYPE
***REMOVED***
goog.Promise.resolve = function(opt_value) {
  return new goog.Promise(function(resolve, reject) {
    resolve(opt_value);
  });
***REMOVED***


***REMOVED***
***REMOVED*** @param {*=} opt_reason
***REMOVED*** @return {!goog.Promise} A new Promise that is immediately rejected with the
***REMOVED***     given reason.
***REMOVED***
goog.Promise.reject = function(opt_reason) {
  return new goog.Promise(function(resolve, reject) {
    reject(opt_reason);
  });
***REMOVED***


***REMOVED***
***REMOVED*** @param {!Array.<!(goog.Thenable.<TYPE>|Thenable)>} promises
***REMOVED*** @return {!goog.Promise.<TYPE>} A Promise that receives the result of the
***REMOVED***     first Promise (or Promise-like) input to complete.
***REMOVED*** @template TYPE
***REMOVED***
goog.Promise.race = function(promises) {
  return new goog.Promise(function(resolve, reject) {
    if (!promises.length) {
      resolve(undefined);
    }
    for (var i = 0, promise; promise = promises[i]; i++) {
      promise.then(resolve, reject);
    }
  });
***REMOVED***


***REMOVED***
***REMOVED*** @param {!Array.<!(goog.Thenable.<TYPE>|Thenable)>} promises
***REMOVED*** @return {!goog.Promise.<!Array.<TYPE>>} A Promise that receives a list of
***REMOVED***     every fulfilled value once every input Promise (or Promise-like) is
***REMOVED***     successfully fulfilled, or is rejected by the first rejection result.
***REMOVED*** @template TYPE
***REMOVED***
goog.Promise.all = function(promises) {
  return new goog.Promise(function(resolve, reject) {
    var toFulfill = promises.length;
    var values = [];

    if (!toFulfill) {
      resolve(values);
      return;
    }

    var onFulfill = function(index, value) {
      toFulfill--;
      values[index] = value;
      if (toFulfill == 0) {
        resolve(values);
      }
   ***REMOVED*****REMOVED***

    var onReject = function(reason) {
      reject(reason);
   ***REMOVED*****REMOVED***

    for (var i = 0, promise; promise = promises[i]; i++) {
      promise.then(goog.partial(onFulfill, i), onReject);
    }
  });
***REMOVED***


***REMOVED***
***REMOVED*** @param {!Array.<!(goog.Thenable.<TYPE>|Thenable)>} promises
***REMOVED*** @return {!goog.Promise.<TYPE>} A Promise that receives the value of the first
***REMOVED***     input to be fulfilled, or is rejected with a list of every rejection
***REMOVED***     reason if all inputs are rejected.
***REMOVED*** @template TYPE
***REMOVED***
goog.Promise.firstFulfilled = function(promises) {
  return new goog.Promise(function(resolve, reject) {
    var toReject = promises.length;
    var reasons = [];

    if (!toReject) {
      resolve(undefined);
      return;
    }

    var onFulfill = function(value) {
      resolve(value);
   ***REMOVED*****REMOVED***

    var onReject = function(index, reason) {
      toReject--;
      reasons[index] = reason;
      if (toReject == 0) {
        reject(reasons);
      }
   ***REMOVED*****REMOVED***

    for (var i = 0, promise; promise = promises[i]; i++) {
      promise.then(onFulfill, goog.partial(onReject, i));
    }
  });
***REMOVED***


***REMOVED***
***REMOVED*** @return {!goog.promise.Resolver.<TYPE>} Resolver wrapping the promise and its
***REMOVED***     resolve / reject functions. Resolving or rejecting the resolver
***REMOVED***     resolves or rejects the promise.
***REMOVED*** @template TYPE
***REMOVED***
goog.Promise.withResolver = function() {
  var resolve, reject;
  var promise = new goog.Promise(function(rs, rj) {
    resolve = rs;
    reject = rj;
  });
  return new goog.Promise.Resolver_(promise, resolve, reject);
***REMOVED***


***REMOVED***
***REMOVED*** Adds callbacks that will operate on the result of the Promise, returning a
***REMOVED*** new child Promise.
***REMOVED***
***REMOVED*** If the Promise is fulfilled, the {@code onFulfilled} callback will be invoked
***REMOVED*** with the fulfillment value as argument, and the child Promise will be
***REMOVED*** fulfilled with the return value of the callback. If the callback throws an
***REMOVED*** exception, the child Promise will be rejected with the thrown value instead.
***REMOVED***
***REMOVED*** If the Promise is rejected, the {@code onRejected} callback will be invoked
***REMOVED*** with the rejection reason as argument, and the child Promise will be resolved
***REMOVED*** with the return value or rejected with the thrown value of the callback.
***REMOVED***
***REMOVED*** @override
***REMOVED***
goog.Promise.prototype.then = function(
    opt_onFulfilled, opt_onRejected, opt_context) {

  if (opt_onFulfilled != null) {
    goog.asserts.assertFunction(opt_onFulfilled,
        'opt_onFulfilled should be a function.');
  }
  if (opt_onRejected != null) {
    goog.asserts.assertFunction(opt_onRejected,
        'opt_onRejected should be a function. Did you pass opt_context ' +
        'as the second argument instead of the third?');
  }

  if (goog.Promise.LONG_STACK_TRACES) {
    this.addStackTrace_(new Error('then'));
  }

  return this.addChildPromise_(
      goog.isFunction(opt_onFulfilled) ? opt_onFulfilled : null,
      goog.isFunction(opt_onRejected) ? opt_onRejected : null,
      opt_context);
***REMOVED***
goog.Thenable.addImplementation(goog.Promise);


***REMOVED***
***REMOVED*** Adds a callback that will be invoked whether the Promise is fulfilled or
***REMOVED*** rejected. The callback receives no argument, and no new child Promise is
***REMOVED*** created. This is useful for ensuring that cleanup takes place after certain
***REMOVED*** asynchronous operations. Callbacks added with {@code thenAlways} will be
***REMOVED*** executed in the same order with other calls to {@code then},
***REMOVED*** {@code thenAlways}, or {@code thenCatch}.
***REMOVED***
***REMOVED*** Since it does not produce a new child Promise, cancellation propagation is
***REMOVED*** not prevented by adding callbacks with {@code thenAlways}. A Promise that has
***REMOVED*** a cleanup handler added with {@code thenAlways} will be canceled if all of
***REMOVED*** its children created by {@code then} (or {@code thenCatch}) are canceled.
***REMOVED***
***REMOVED*** @param {function(this:THIS): void} onResolved A function that will be invoked
***REMOVED***     when the Promise is resolved.
***REMOVED*** @param {THIS=} opt_context An optional context object that will be the
***REMOVED***     execution context for the callbacks. By default, functions are executed
***REMOVED***     in the global scope.
***REMOVED*** @return {!goog.Promise.<TYPE>} This Promise, for chaining additional calls.
***REMOVED*** @template THIS
***REMOVED***
goog.Promise.prototype.thenAlways = function(onResolved, opt_context) {
  if (goog.Promise.LONG_STACK_TRACES) {
    this.addStackTrace_(new Error('thenAlways'));
  }

  var callback = function() {
    try {
      // Ensure that no arguments are passed to onResolved.
      onResolved.call(opt_context);
    } catch (err) {
      goog.Promise.handleRejection_.call(null, err);
    }
 ***REMOVED*****REMOVED***

  this.addCallbackEntry_({
    child: null,
    onRejected: callback,
    onFulfilled: callback
  });
  return this;
***REMOVED***


***REMOVED***
***REMOVED*** Adds a callback that will be invoked only if the Promise is rejected. This
***REMOVED*** is equivalent to {@code then(null, onRejected)}.
***REMOVED***
***REMOVED*** @param {!function(this:THIS,***REMOVED***):***REMOVED***} onRejected A function that will be
***REMOVED***     invoked with the rejection reason if the Promise is rejected.
***REMOVED*** @param {THIS=} opt_context An optional context object that will be the
***REMOVED***     execution context for the callbacks. By default, functions are executed
***REMOVED***     in the global scope.
***REMOVED*** @return {!goog.Promise} A new Promise that will receive the result of the
***REMOVED***     callback.
***REMOVED*** @template THIS
***REMOVED***
goog.Promise.prototype.thenCatch = function(onRejected, opt_context) {
  if (goog.Promise.LONG_STACK_TRACES) {
    this.addStackTrace_(new Error('thenCatch'));
  }
  return this.addChildPromise_(null, onRejected, opt_context);
***REMOVED***


***REMOVED***
***REMOVED*** Cancels the Promise if it is still pending by rejecting it with a cancel
***REMOVED*** Error. No action is performed if the Promise is already resolved.
***REMOVED***
***REMOVED*** All child Promises of the canceled Promise will be rejected with the same
***REMOVED*** cancel error, as with normal Promise rejection. If the Promise to be canceled
***REMOVED*** is the only child of a pending Promise, the parent Promise will also be
***REMOVED*** canceled. Cancellation may propagate upward through multiple generations.
***REMOVED***
***REMOVED*** @param {string=} opt_message An optional debugging message for describing the
***REMOVED***     cancellation reason.
***REMOVED***
goog.Promise.prototype.cancel = function(opt_message) {
  if (this.state_ == goog.Promise.State_.PENDING) {
    goog.async.run(function() {
      var err = new goog.Promise.CancellationError(opt_message);
      this.cancelInternal_(err);
    }, this);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Cancels this Promise with the given error.
***REMOVED***
***REMOVED*** @param {!Error} err The cancellation error.
***REMOVED*** @private
***REMOVED***
goog.Promise.prototype.cancelInternal_ = function(err) {
  if (this.state_ == goog.Promise.State_.PENDING) {
    if (this.parent_) {
      // Cancel the Promise and remove it from the parent's child list.
      this.parent_.cancelChild_(this, err);
    } else {
      this.resolve_(goog.Promise.State_.REJECTED, err);
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** Cancels a child Promise from the list of callback entries. If the Promise has
***REMOVED*** not already been resolved, reject it with a cancel error. If there are no
***REMOVED*** other children in the list of callback entries, propagate the cancellation
***REMOVED*** by canceling this Promise as well.
***REMOVED***
***REMOVED*** @param {!goog.Promise} childPromise The Promise to cancel.
***REMOVED*** @param {!Error} err The cancel error to use for rejecting the Promise.
***REMOVED*** @private
***REMOVED***
goog.Promise.prototype.cancelChild_ = function(childPromise, err) {
  if (!this.callbackEntries_) {
    return;
  }
  var childCount = 0;
  var childIndex = -1;

  // Find the callback entry for the childPromise, and count whether there are
  // additional child Promises.
  for (var i = 0, entry; entry = this.callbackEntries_[i]; i++) {
    var child = entry.child;
    if (child) {
      childCount++;
      if (child == childPromise) {
        childIndex = i;
      }
      if (childIndex >= 0 && childCount > 1) {
        break;
      }
    }
  }

  // If the child Promise was the only child, cancel this Promise as well.
  // Otherwise, reject only the child Promise with the cancel error.
  if (childIndex >= 0) {
    if (this.state_ == goog.Promise.State_.PENDING && childCount == 1) {
      this.cancelInternal_(err);
    } else {
      var callbackEntry = this.callbackEntries_.splice(childIndex, 1)[0];
      this.executeCallback_(
          callbackEntry, goog.Promise.State_.REJECTED, err);
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** Adds a callback entry to the current Promise, and schedules callback
***REMOVED*** execution if the Promise has already been resolved.
***REMOVED***
***REMOVED*** @param {goog.Promise.CallbackEntry_} callbackEntry Record containing
***REMOVED***     {@code onFulfilled} and {@code onRejected} callbacks to execute after
***REMOVED***     the Promise is resolved.
***REMOVED*** @private
***REMOVED***
goog.Promise.prototype.addCallbackEntry_ = function(callbackEntry) {
  if ((!this.callbackEntries_ || !this.callbackEntries_.length) &&
      (this.state_ == goog.Promise.State_.FULFILLED ||
       this.state_ == goog.Promise.State_.REJECTED)) {
    this.scheduleCallbacks_();
  }
  if (!this.callbackEntries_) {
    this.callbackEntries_ = [];
  }
  this.callbackEntries_.push(callbackEntry);
***REMOVED***


***REMOVED***
***REMOVED*** Creates a child Promise and adds it to the callback entry list. The result of
***REMOVED*** the child Promise is determined by the state of the parent Promise and the
***REMOVED*** result of the {@code onFulfilled} or {@code onRejected} callbacks as
***REMOVED*** specified in the Promise resolution procedure.
***REMOVED***
***REMOVED*** @see http://promisesaplus.com/#the__method
***REMOVED***
***REMOVED*** @param {?function(this:THIS, TYPE):
***REMOVED***          (RESULT|goog.Promise.<RESULT>|Thenable)} onFulfilled A callback that
***REMOVED***     will be invoked if the Promise is fullfilled, or null.
***REMOVED*** @param {?function(this:THIS,***REMOVED***):***REMOVED***} onRejected A callback that will be
***REMOVED***     invoked if the Promise is rejected, or null.
***REMOVED*** @param {THIS=} opt_context An optional execution context for the callbacks.
***REMOVED***     in the default calling context.
***REMOVED*** @return {!goog.Promise} The child Promise.
***REMOVED*** @template RESULT,THIS
***REMOVED*** @private
***REMOVED***
goog.Promise.prototype.addChildPromise_ = function(
    onFulfilled, onRejected, opt_context) {

  var callbackEntry = {
    child: null,
    onFulfilled: null,
    onRejected: null
 ***REMOVED*****REMOVED***

  callbackEntry.child = new goog.Promise(function(resolve, reject) {
    // Invoke onFulfilled, or resolve with the parent's value if absent.
    callbackEntry.onFulfilled = onFulfilled ? function(value) {
      try {
        var result = onFulfilled.call(opt_context, value);
        resolve(result);
      } catch (err) {
        reject(err);
      }
    } : resolve;

    // Invoke onRejected, or reject with the parent's reason if absent.
    callbackEntry.onRejected = onRejected ? function(reason) {
      try {
        var result = onRejected.call(opt_context, reason);
        if (!goog.isDef(result) &&
            reason instanceof goog.Promise.CancellationError) {
          // Propagate cancellation to children if no other result is returned.
          reject(reason);
        } else {
          resolve(result);
        }
      } catch (err) {
        reject(err);
      }
    } : reject;
  });

  callbackEntry.child.parent_ = this;
  this.addCallbackEntry_(
     ***REMOVED*****REMOVED*** @type {goog.Promise.CallbackEntry_}***REMOVED*** (callbackEntry));
  return callbackEntry.child;
***REMOVED***


***REMOVED***
***REMOVED*** Unblocks the Promise and fulfills it with the given value.
***REMOVED***
***REMOVED*** @param {TYPE} value
***REMOVED*** @private
***REMOVED***
goog.Promise.prototype.unblockAndFulfill_ = function(value) {
  goog.asserts.assert(this.state_ == goog.Promise.State_.BLOCKED);
  this.state_ = goog.Promise.State_.PENDING;
  this.resolve_(goog.Promise.State_.FULFILLED, value);
***REMOVED***


***REMOVED***
***REMOVED*** Unblocks the Promise and rejects it with the given rejection reason.
***REMOVED***
***REMOVED*** @param {*} reason
***REMOVED*** @private
***REMOVED***
goog.Promise.prototype.unblockAndReject_ = function(reason) {
  goog.asserts.assert(this.state_ == goog.Promise.State_.BLOCKED);
  this.state_ = goog.Promise.State_.PENDING;
  this.resolve_(goog.Promise.State_.REJECTED, reason);
***REMOVED***


***REMOVED***
***REMOVED*** Attempts to resolve a Promise with a given resolution state and value. This
***REMOVED*** is a no-op if the given Promise has already been resolved.
***REMOVED***
***REMOVED*** If the given result is a Thenable (such as another Promise), the Promise will
***REMOVED*** be resolved with the same state and result as the Thenable once it is itself
***REMOVED*** resolved.
***REMOVED***
***REMOVED*** If the given result is not a Thenable, the Promise will be fulfilled or
***REMOVED*** rejected with that result based on the given state.
***REMOVED***
***REMOVED*** @see http://promisesaplus.com/#the_promise_resolution_procedure
***REMOVED***
***REMOVED*** @param {goog.Promise.State_} state
***REMOVED*** @param {*} x The result to apply to the Promise.
***REMOVED*** @private
***REMOVED***
goog.Promise.prototype.resolve_ = function(state, x) {
  if (this.state_ != goog.Promise.State_.PENDING) {
    return;
  }

  if (this == x) {
    state = goog.Promise.State_.REJECTED;
    x = new TypeError('Promise cannot resolve to itself');

  } else if (goog.Thenable.isImplementedBy(x)) {
    x =***REMOVED*****REMOVED*** @type {!goog.Thenable}***REMOVED*** (x);
    this.state_ = goog.Promise.State_.BLOCKED;
    x.then(this.unblockAndFulfill_, this.unblockAndReject_, this);
    return;

  } else if (goog.isObject(x)) {
    try {
      var then = x['then'];
      if (goog.isFunction(then)) {
        this.tryThen_(x, then);
        return;
      }
    } catch (e) {
      state = goog.Promise.State_.REJECTED;
      x = e;
    }
  }

  this.result_ = x;
  this.state_ = state;
  this.scheduleCallbacks_();

  if (state == goog.Promise.State_.REJECTED &&
      !(x instanceof goog.Promise.CancellationError)) {
    goog.Promise.addUnhandledRejection_(this, x);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Attempts to call the {@code then} method on an object in the hopes that it is
***REMOVED*** a Promise-compatible instance. This allows interoperation between different
***REMOVED*** Promise implementations, however a non-compliant object may cause a Promise
***REMOVED*** to hang indefinitely. If the {@code then} method throws an exception, the
***REMOVED*** dependent Promise will be rejected with the thrown value.
***REMOVED***
***REMOVED*** @see http://promisesaplus.com/#point-70
***REMOVED***
***REMOVED*** @param {Thenable} thenable An object with a {@code then} method that may be
***REMOVED***     compatible with the Promise/A+ specification.
***REMOVED*** @param {!Function} then The {@code then} method of the Thenable object.
***REMOVED*** @private
***REMOVED***
goog.Promise.prototype.tryThen_ = function(thenable, then) {
  this.state_ = goog.Promise.State_.BLOCKED;
  var promise = this;
  var called = false;

  var resolve = function(value) {
    if (!called) {
      called = true;
      promise.unblockAndFulfill_(value);
    }
 ***REMOVED*****REMOVED***

  var reject = function(reason) {
    if (!called) {
      called = true;
      promise.unblockAndReject_(reason);
    }
 ***REMOVED*****REMOVED***

  try {
    then.call(thenable, resolve, reject);
  } catch (e) {
    reject(e);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Executes the pending callbacks of a resolved Promise after a timeout.
***REMOVED***
***REMOVED*** Section 2.2.4 of the Promises/A+ specification requires that Promise
***REMOVED*** callbacks must only be invoked from a call stack that only contains Promise
***REMOVED*** implementation code, which we accomplish by invoking callback execution after
***REMOVED*** a timeout. If {@code startExecution_} is called multiple times for the same
***REMOVED*** Promise, the callback chain will be evaluated only once. Additional callbacks
***REMOVED*** may be added during the evaluation phase, and will be executed in the same
***REMOVED*** event loop.
***REMOVED***
***REMOVED*** All Promises added to the waiting list during the same browser event loop
***REMOVED*** will be executed in one batch to avoid using a separate timeout per Promise.
***REMOVED***
***REMOVED*** @private
***REMOVED***
goog.Promise.prototype.scheduleCallbacks_ = function() {
  if (!this.executing_) {
    this.executing_ = true;
    goog.async.run(this.executeCallbacks_, this);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Executes all pending callbacks for this Promise.
***REMOVED***
***REMOVED*** @private
***REMOVED***
goog.Promise.prototype.executeCallbacks_ = function() {
  while (this.callbackEntries_ && this.callbackEntries_.length) {
    var entries = this.callbackEntries_;
    this.callbackEntries_ = [];

    for (var i = 0; i < entries.length; i++) {
      if (goog.Promise.LONG_STACK_TRACES) {
        this.currentStep_++;
      }
      this.executeCallback_(entries[i], this.state_, this.result_);
    }
  }
  this.executing_ = false;
***REMOVED***


***REMOVED***
***REMOVED*** Executes a pending callback for this Promise. Invokes an {@code onFulfilled}
***REMOVED*** or {@code onRejected} callback based on the resolved state of the Promise.
***REMOVED***
***REMOVED*** @param {!goog.Promise.CallbackEntry_} callbackEntry An entry containing the
***REMOVED***     onFulfilled and/or onRejected callbacks for this step.
***REMOVED*** @param {goog.Promise.State_} state The resolution status of the Promise,
***REMOVED***     either FULFILLED or REJECTED.
***REMOVED*** @param {*} result The resolved result of the Promise.
***REMOVED*** @private
***REMOVED***
goog.Promise.prototype.executeCallback_ = function(
    callbackEntry, state, result) {
  if (state == goog.Promise.State_.FULFILLED) {
    callbackEntry.onFulfilled(result);
  } else {
    this.removeUnhandledRejection_();
    callbackEntry.onRejected(result);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Records a stack trace entry for functions that call {@code then} or the
***REMOVED*** Promise constructor. May be disabled by unsetting {@code LONG_STACK_TRACES}.
***REMOVED***
***REMOVED*** @param {!Error} err An Error object created by the calling function for
***REMOVED***     providing a stack trace.
***REMOVED*** @private
***REMOVED***
goog.Promise.prototype.addStackTrace_ = function(err) {
  if (goog.Promise.LONG_STACK_TRACES && goog.isString(err.stack)) {
    // Extract the third line of the stack trace, which is the entry for the
    // user function that called into Promise code.
    var trace = err.stack.split('\n', 4)[3];
    var message = err.message;

    // Pad the message to align the traces.
    message += Array(11 - message.length).join(' ');
    this.stack_.push(message + trace);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Adds extra stack trace information to an exception for the list of
***REMOVED*** asynchronous {@code then} calls that have been run for this Promise. Stack
***REMOVED*** trace information is recorded in {@see #addStackTrace_}, and appended to
***REMOVED*** rethrown errors when {@code LONG_STACK_TRACES} is enabled.
***REMOVED***
***REMOVED*** @param {*} err An unhandled exception captured during callback execution.
***REMOVED*** @private
***REMOVED***
goog.Promise.prototype.appendLongStack_ = function(err) {
  if (goog.Promise.LONG_STACK_TRACES &&
      err && goog.isString(err.stack) && this.stack_.length) {
    var longTrace = ['Promise trace:'];

    for (var promise = this; promise; promise = promise.parent_) {
      for (var i = this.currentStep_; i >= 0; i--) {
        longTrace.push(promise.stack_[i]);
      }
      longTrace.push('Value: ' +
          '[' + (promise.state_ == goog.Promise.State_.REJECTED ?
              'REJECTED' : 'FULFILLED') + '] ' +
          '<' + String(promise.result_) + '>');
    }
    err.stack += '\n\n' + longTrace.join('\n');
  }
***REMOVED***


***REMOVED***
***REMOVED*** Marks this rejected Promise as having being handled. Also marks any parent
***REMOVED*** Promises in the rejected state as handled. The rejection handler will no
***REMOVED*** longer be invoked for this Promise (if it has not been called already).
***REMOVED***
***REMOVED*** @private
***REMOVED***
goog.Promise.prototype.removeUnhandledRejection_ = function() {
  if (goog.Promise.UNHANDLED_REJECTION_DELAY > 0) {
    for (var p = this; p && p.unhandledRejectionId_; p = p.parent_) {
      goog.global.clearTimeout(p.unhandledRejectionId_);
      p.unhandledRejectionId_ = 0;
    }
  } else if (goog.Promise.UNHANDLED_REJECTION_DELAY == 0) {
    for (var p = this; p && p.hadUnhandledRejection_; p = p.parent_) {
      p.hadUnhandledRejection_ = false;
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** Marks this rejected Promise as unhandled. If no {@code onRejected} callback
***REMOVED*** is called for this Promise before the {@code UNHANDLED_REJECTION_DELAY}
***REMOVED*** expires, the reason will be passed to the unhandled rejection handler. The
***REMOVED*** handler typically rethrows the rejection reason so that it becomes visible in
***REMOVED*** the developer console.
***REMOVED***
***REMOVED*** @param {!goog.Promise} promise The rejected Promise.
***REMOVED*** @param {*} reason The Promise rejection reason.
***REMOVED*** @private
***REMOVED***
goog.Promise.addUnhandledRejection_ = function(promise, reason) {
  if (goog.Promise.UNHANDLED_REJECTION_DELAY > 0) {
    promise.unhandledRejectionId_ = goog.global.setTimeout(function() {
      promise.appendLongStack_(reason);
      goog.Promise.handleRejection_.call(null, reason);
    }, goog.Promise.UNHANDLED_REJECTION_DELAY);

  } else if (goog.Promise.UNHANDLED_REJECTION_DELAY == 0) {
    promise.hadUnhandledRejection_ = true;
    goog.async.run(function() {
      if (promise.hadUnhandledRejection_) {
        promise.appendLongStack_(reason);
        goog.Promise.handleRejection_.call(null, reason);
      }
    });
  }
***REMOVED***


***REMOVED***
***REMOVED*** A method that is invoked with the rejection reasons for Promises that are
***REMOVED*** rejected but have no {@code onRejected} callbacks registered yet.
***REMOVED*** @type {function(*)}
***REMOVED*** @private
***REMOVED***
goog.Promise.handleRejection_ = goog.async.throwException;


***REMOVED***
***REMOVED*** Sets a handler that will be called with reasons from unhandled rejected
***REMOVED*** Promises. If the rejected Promise (or one of its descendants) has an
***REMOVED*** {@code onRejected} callback registered, the rejection will be considered
***REMOVED*** handled, and the rejection handler will not be called.
***REMOVED***
***REMOVED*** By default, unhandled rejections are rethrown so that the error may be
***REMOVED*** captured by the developer console or a {@code window.onerror} handler.
***REMOVED***
***REMOVED*** @param {function(*)} handler A function that will be called with reasons from
***REMOVED***     rejected Promises. Defaults to {@code goog.async.throwException}.
***REMOVED***
goog.Promise.setUnhandledRejectionHandler = function(handler) {
  goog.Promise.handleRejection_ = handler;
***REMOVED***



***REMOVED***
***REMOVED*** Error used as a rejection reason for canceled Promises.
***REMOVED***
***REMOVED*** @param {string=} opt_message
***REMOVED***
***REMOVED*** @extends {goog.debug.Error}
***REMOVED*** @final
***REMOVED***
goog.Promise.CancellationError = function(opt_message) {
  goog.Promise.CancellationError.base(this, 'constructor', opt_message);
***REMOVED***
goog.inherits(goog.Promise.CancellationError, goog.debug.Error);


***REMOVED*** @override***REMOVED***
goog.Promise.CancellationError.prototype.name = 'cancel';



***REMOVED***
***REMOVED*** Internal implementation of the resolver interface.
***REMOVED***
***REMOVED*** @param {!goog.Promise.<TYPE>} promise
***REMOVED*** @param {function((TYPE|goog.Promise.<TYPE>|Thenable))} resolve
***REMOVED*** @param {function(*): void} reject
***REMOVED*** @implements {goog.promise.Resolver.<TYPE>}
***REMOVED*** @final @struct
***REMOVED***
***REMOVED*** @private
***REMOVED*** @template TYPE
***REMOVED***
goog.Promise.Resolver_ = function(promise, resolve, reject) {
 ***REMOVED*****REMOVED*** @const***REMOVED***
  this.promise = promise;

 ***REMOVED*****REMOVED*** @const***REMOVED***
  this.resolve = resolve;

 ***REMOVED*****REMOVED*** @const***REMOVED***
  this.reject = reject;
***REMOVED***
