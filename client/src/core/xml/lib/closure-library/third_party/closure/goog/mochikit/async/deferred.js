// Copyright 2007 Bob Ippolito. All Rights Reserved.
// Modifications Copyright 2009 The Closure Library Authors. All Rights
// Reserved.

***REMOVED***
***REMOVED*** @license Portions of this code are from MochiKit, received by
***REMOVED*** The Closure Authors under the MIT license. All other code is Copyright
***REMOVED*** 2005-2009 The Closure Authors. All Rights Reserved.
***REMOVED***

***REMOVED***
***REMOVED*** @fileoverview Classes for tracking asynchronous operations and handling the
***REMOVED*** results. The Deferred object here is patterned after the Deferred object in
***REMOVED*** the Twisted python networking framework.
***REMOVED***
***REMOVED*** See: http://twistedmatrix.com/projects/core/documentation/howto/defer.html
***REMOVED***
***REMOVED*** Based on the Dojo code which in turn is based on the MochiKit code.
***REMOVED***
***REMOVED***

goog.provide('goog.async.Deferred');
goog.provide('goog.async.Deferred.AlreadyCalledError');
goog.provide('goog.async.Deferred.CancelledError');

goog.require('goog.array');
goog.require('goog.asserts');
goog.require('goog.debug.Error');



***REMOVED***
***REMOVED*** A Deferred represents the result of an asynchronous operation. A Deferred
***REMOVED*** instance has no result when it is created, and is "fired" (given an initial
***REMOVED*** result) by calling {@code callback} or {@code errback}.
***REMOVED***
***REMOVED*** Once fired, the result is passed through a sequence of callback functions
***REMOVED*** registered with {@code addCallback} or {@code addErrback}. The functions may
***REMOVED*** mutate the result before it is passed to the next function in the sequence.
***REMOVED***
***REMOVED*** Callbacks and errbacks may be added at any time, including after the Deferred
***REMOVED*** has been "fired". If there are no pending actions in the execution sequence
***REMOVED*** of a fired Deferred, any new callback functions will be called with the last
***REMOVED*** computed result. Adding a callback function is the only way to access the
***REMOVED*** result of the Deferred.
***REMOVED***
***REMOVED*** If a Deferred operation is cancelled, an optional user-provided cancellation
***REMOVED*** function is invoked which may perform any special cleanup, followed by firing
***REMOVED*** the Deferred's errback sequence with a {@code CancelledError}. If the
***REMOVED*** Deferred has already fired, cancellation is ignored.
***REMOVED***
***REMOVED*** @param {Function=} opt_onCancelFunction A function that will be called if the
***REMOVED***     Deferred is cancelled. If provided, this function runs before the
***REMOVED***     Deferred is fired with a {@code CancelledError}.
***REMOVED*** @param {Object=} opt_defaultScope The default object context to call
***REMOVED***     callbacks and errbacks in.
***REMOVED***
***REMOVED***
goog.async.Deferred = function(opt_onCancelFunction, opt_defaultScope) {
 ***REMOVED*****REMOVED***
  ***REMOVED*** Entries in the sequence are arrays containing a callback, an errback, and
  ***REMOVED*** an optional scope. The callback or errback in an entry may be null.
  ***REMOVED*** @type {!Array.<!Array>}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.sequence_ = [];

 ***REMOVED*****REMOVED***
  ***REMOVED*** Optional function that will be called if the Deferred is cancelled.
  ***REMOVED*** @type {Function|undefined}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.onCancelFunction_ = opt_onCancelFunction;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The default scope to execute callbacks and errbacks in.
  ***REMOVED*** @type {Object}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.defaultScope_ = opt_defaultScope || null;
***REMOVED***


***REMOVED***
***REMOVED*** Whether the Deferred has been fired.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.async.Deferred.prototype.fired_ = false;


***REMOVED***
***REMOVED*** Whether the last result in the execution sequence was an error.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.async.Deferred.prototype.hadError_ = false;


***REMOVED***
***REMOVED*** The current Deferred result, updated as callbacks and errbacks are executed.
***REMOVED*** @type {*}
***REMOVED*** @private
***REMOVED***
goog.async.Deferred.prototype.result_;


***REMOVED***
***REMOVED*** Whether the Deferred is blocked waiting on another Deferred to fire. If a
***REMOVED*** callback or errback returns a Deferred as a result, the execution sequence is
***REMOVED*** blocked until that Deferred result becomes available.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.async.Deferred.prototype.blocked_ = false;


***REMOVED***
***REMOVED*** Whether this Deferred is blocking execution of another Deferred. If this
***REMOVED*** instance was returned as a result in another Deferred's execution sequence,
***REMOVED*** that other Deferred becomes blocked until this instance's execution sequence
***REMOVED*** completes. No additional callbacks may be added to a Deferred once it
***REMOVED*** is blocking another instance.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.async.Deferred.prototype.blocking_ = false;


***REMOVED***
***REMOVED*** Whether the Deferred has been cancelled without having a custom cancel
***REMOVED*** function.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.async.Deferred.prototype.silentlyCancelled_ = false;


***REMOVED***
***REMOVED*** If an error is thrown during Deferred execution with no errback to catch it,
***REMOVED*** the error is rethrown after a timeout. Reporting the error after a timeout
***REMOVED*** allows execution to continue in the calling context.
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.async.Deferred.prototype.unhandledExceptionTimeoutId_;


***REMOVED***
***REMOVED*** If this Deferred was created by branch(), this will be the "parent" Deferred.
***REMOVED*** @type {goog.async.Deferred}
***REMOVED*** @private
***REMOVED***
goog.async.Deferred.prototype.parent_;


***REMOVED***
***REMOVED*** The number of Deferred objects that have been branched off this one. This
***REMOVED*** will be decremented whenever a branch is fired or cancelled.
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.async.Deferred.prototype.branches_ = 0;


***REMOVED***
***REMOVED*** Cancels a Deferred that has not yet been fired, or is blocked on another
***REMOVED*** deferred operation. If this Deferred is waiting for a blocking Deferred to
***REMOVED*** fire, the blocking Deferred will also be cancelled.
***REMOVED***
***REMOVED*** If this Deferred was created by calling branch() on a parent Deferred with
***REMOVED*** opt_propagateCancel set to true, the parent may also be cancelled. If
***REMOVED*** opt_deepCancel is set, cancel() will be called on the parent (as well as any
***REMOVED*** other ancestors if the parent is also a branch). If one or more branches were
***REMOVED*** created with opt_propagateCancel set to true, the parent will be cancelled if
***REMOVED*** cancel() is called on all of those branches.
***REMOVED***
***REMOVED*** @param {boolean=} opt_deepCancel If true, cancels this Deferred's parent even
***REMOVED***     if cancel() hasn't been called on some of the parent's branches. Has no
***REMOVED***     effect on a branch without opt_propagateCancel set to true.
***REMOVED***
goog.async.Deferred.prototype.cancel = function(opt_deepCancel) {
  if (!this.hasFired()) {
    if (this.parent_) {
      // Get rid of the parent reference before potentially running the parent's
      // canceller function to ensure that this cancellation isn't
      // double-counted.
      var parent = this.parent_;
      delete this.parent_;
      if (opt_deepCancel) {
        parent.cancel(opt_deepCancel);
      } else {
        parent.branchCancel_();
      }
    }

    if (this.onCancelFunction_) {
      // Call in user-specified scope.
      this.onCancelFunction_.call(this.defaultScope_, this);
    } else {
      this.silentlyCancelled_ = true;
    }
    if (!this.hasFired()) {
      this.errback(new goog.async.Deferred.CancelledError(this));
    }
  } else if (this.result_ instanceof goog.async.Deferred) {
    this.result_.cancel();
  }
***REMOVED***


***REMOVED***
***REMOVED*** Handle a single branch being cancelled. Once all branches are cancelled, this
***REMOVED*** Deferred will be cancelled as well.
***REMOVED***
***REMOVED*** @private
***REMOVED***
goog.async.Deferred.prototype.branchCancel_ = function() {
  this.branches_--;
  if (this.branches_ <= 0) {
    this.cancel();
  }
***REMOVED***


***REMOVED***
***REMOVED*** Called after a blocking Deferred fires. Unblocks this Deferred and resumes
***REMOVED*** its execution sequence.
***REMOVED***
***REMOVED*** @param {boolean} isSuccess Whether the result is a success or an error.
***REMOVED*** @param {*} res The result of the blocking Deferred.
***REMOVED*** @private
***REMOVED***
goog.async.Deferred.prototype.continue_ = function(isSuccess, res) {
  this.blocked_ = false;
  this.updateResult_(isSuccess, res);
***REMOVED***


***REMOVED***
***REMOVED*** Updates the current result based on the success or failure of the last action
***REMOVED*** in the execution sequence.
***REMOVED***
***REMOVED*** @param {boolean} isSuccess Whether the new result is a success or an error.
***REMOVED*** @param {*} res The result.
***REMOVED*** @private
***REMOVED***
goog.async.Deferred.prototype.updateResult_ = function(isSuccess, res) {
  this.fired_ = true;
  this.result_ = res;
  this.hadError_ = !isSuccess;
  this.fire_();
***REMOVED***


***REMOVED***
***REMOVED*** Verifies that the Deferred has not yet been fired.
***REMOVED***
***REMOVED*** @private
***REMOVED*** @throws {Error} If this has already been fired.
***REMOVED***
goog.async.Deferred.prototype.check_ = function() {
  if (this.hasFired()) {
    if (!this.silentlyCancelled_) {
      throw new goog.async.Deferred.AlreadyCalledError(this);
    }
    this.silentlyCancelled_ = false;
  }
***REMOVED***


***REMOVED***
***REMOVED*** Fire the execution sequence for this Deferred by passing the starting result
***REMOVED*** to the first registered callback.
***REMOVED*** @param {*=} opt_result The starting result.
***REMOVED***
goog.async.Deferred.prototype.callback = function(opt_result) {
  this.check_();
  this.assertNotDeferred_(opt_result);
  this.updateResult_(true /* isSuccess***REMOVED***, opt_result);
***REMOVED***


***REMOVED***
***REMOVED*** Fire the execution sequence for this Deferred by passing the starting error
***REMOVED*** result to the first registered errback.
***REMOVED*** @param {*=} opt_result The starting error.
***REMOVED***
goog.async.Deferred.prototype.errback = function(opt_result) {
  this.check_();
  this.assertNotDeferred_(opt_result);
  this.updateResult_(false /* isSuccess***REMOVED***, opt_result);
***REMOVED***


***REMOVED***
***REMOVED*** Asserts that an object is not a Deferred.
***REMOVED*** @param {*} obj The object to test.
***REMOVED*** @throws {Error} Throws an exception if the object is a Deferred.
***REMOVED*** @private
***REMOVED***
goog.async.Deferred.prototype.assertNotDeferred_ = function(obj) {
  goog.asserts.assert(
      !(obj instanceof goog.async.Deferred),
      'An execution sequence may not be initiated with a blocking Deferred.');
***REMOVED***


***REMOVED***
***REMOVED*** Register a callback function to be called with a successful result. If no
***REMOVED*** value is returned by the callback function, the result value is unchanged. If
***REMOVED*** a new value is returned, it becomes the Deferred result and will be passed to
***REMOVED*** the next callback in the execution sequence.
***REMOVED***
***REMOVED*** If the function throws an error, the error becomes the new result and will be
***REMOVED*** passed to the next errback in the execution chain.
***REMOVED***
***REMOVED*** If the function returns a Deferred, the execution sequence will be blocked
***REMOVED*** until that Deferred fires. Its result will be passed to the next callback (or
***REMOVED*** errback if it is an error result) in this Deferred's execution sequence.
***REMOVED***
***REMOVED*** @param {!function(this:T,?):?} cb The function to be called with a successful
***REMOVED***     result.
***REMOVED*** @param {T=} opt_scope An optional scope to call the callback in.
***REMOVED*** @return {!goog.async.Deferred} This Deferred.
***REMOVED*** @template T
***REMOVED***
goog.async.Deferred.prototype.addCallback = function(cb, opt_scope) {
  return this.addCallbacks(cb, null, opt_scope);
***REMOVED***


***REMOVED***
***REMOVED*** Register a callback function to be called with an error result. If no value
***REMOVED*** is returned by the function, the error result is unchanged. If a new error
***REMOVED*** value is returned or thrown, that error becomes the Deferred result and will
***REMOVED*** be passed to the next errback in the execution sequence.
***REMOVED***
***REMOVED*** If the errback function handles the error by returning a non-error value,
***REMOVED*** that result will be passed to the next normal callback in the sequence.
***REMOVED***
***REMOVED*** If the function returns a Deferred, the execution sequence will be blocked
***REMOVED*** until that Deferred fires. Its result will be passed to the next callback (or
***REMOVED*** errback if it is an error result) in this Deferred's execution sequence.
***REMOVED***
***REMOVED*** @param {!function(this:T,?):?} eb The function to be called on an
***REMOVED***     unsuccessful result.
***REMOVED*** @param {T=} opt_scope An optional scope to call the errback in.
***REMOVED*** @return {!goog.async.Deferred} This Deferred.
***REMOVED*** @template T
***REMOVED***
goog.async.Deferred.prototype.addErrback = function(eb, opt_scope) {
  return this.addCallbacks(null, eb, opt_scope);
***REMOVED***


***REMOVED***
***REMOVED*** Registers one function as both a callback and errback.
***REMOVED***
***REMOVED*** @param {!function(this:T,?):?} f The function to be called on any result.
***REMOVED*** @param {T=} opt_scope An optional scope to call the function in.
***REMOVED*** @return {!goog.async.Deferred} This Deferred.
***REMOVED*** @template T
***REMOVED***
goog.async.Deferred.prototype.addBoth = function(f, opt_scope) {
  return this.addCallbacks(f, f, opt_scope);
***REMOVED***


***REMOVED***
***REMOVED*** Registers a callback function and an errback function at the same position
***REMOVED*** in the execution sequence. Only one of these functions will execute,
***REMOVED*** depending on the error state during the execution sequence.
***REMOVED***
***REMOVED*** NOTE: This is not equivalent to {@code def.addCallback().addErrback()}! If
***REMOVED*** the callback is invoked, the errback will be skipped, and vice versa.
***REMOVED***
***REMOVED*** @param {(function(this:T,?):?)|null} cb The function to be called on a
***REMOVED***     successful result.
***REMOVED*** @param {(function(this:T,?):?)|null} eb The function to be called on an
***REMOVED***     unsuccessful result.
***REMOVED*** @param {T=} opt_scope An optional scope to call the functions in.
***REMOVED*** @return {!goog.async.Deferred} This Deferred.
***REMOVED*** @template T
***REMOVED***
goog.async.Deferred.prototype.addCallbacks = function(cb, eb, opt_scope) {
  goog.asserts.assert(!this.blocking_, 'Blocking Deferreds can not be re-used');
  this.sequence_.push([cb, eb, opt_scope]);
  if (this.hasFired()) {
    this.fire_();
  }
  return this;
***REMOVED***


***REMOVED***
***REMOVED*** Links another Deferred to the end of this Deferred's execution sequence. The
***REMOVED*** result of this execution sequence will be passed as the starting result for
***REMOVED*** the chained Deferred, invoking either its first callback or errback.
***REMOVED***
***REMOVED*** @param {!goog.async.Deferred} otherDeferred The Deferred to chain.
***REMOVED*** @return {!goog.async.Deferred} This Deferred.
***REMOVED***
goog.async.Deferred.prototype.chainDeferred = function(otherDeferred) {
  this.addCallbacks(
      otherDeferred.callback, otherDeferred.errback, otherDeferred);
  return this;
***REMOVED***


***REMOVED***
***REMOVED*** Makes this Deferred wait for another Deferred's execution sequence to
***REMOVED*** complete before continuing.
***REMOVED***
***REMOVED*** This is equivalent to adding a callback that returns {@code otherDeferred},
***REMOVED*** but doesn't prevent additional callbacks from being added to
***REMOVED*** {@code otherDeferred}.
***REMOVED***
***REMOVED*** @param {!goog.async.Deferred} otherDeferred The Deferred to wait for.
***REMOVED*** @return {!goog.async.Deferred} This Deferred.
***REMOVED***
goog.async.Deferred.prototype.awaitDeferred = function(otherDeferred) {
  return this.addCallback(goog.bind(otherDeferred.branch, otherDeferred));
***REMOVED***


***REMOVED***
***REMOVED*** Creates a branch off this Deferred's execution sequence, and returns it as a
***REMOVED*** new Deferred. The branched Deferred's starting result will be shared with the
***REMOVED*** parent at the point of the branch, even if further callbacks are added to the
***REMOVED*** parent.
***REMOVED***
***REMOVED*** All branches at the same stage in the execution sequence will receive the
***REMOVED*** same starting value.
***REMOVED***
***REMOVED*** @param {boolean=} opt_propagateCancel If cancel() is called on every child
***REMOVED***     branch created with opt_propagateCancel, the parent will be cancelled as
***REMOVED***     well.
***REMOVED*** @return {!goog.async.Deferred} A Deferred that will be started with the
***REMOVED***     computed result from this stage in the execution sequence.
***REMOVED***
goog.async.Deferred.prototype.branch = function(opt_propagateCancel) {
  var d = new goog.async.Deferred();
  this.chainDeferred(d);
  if (opt_propagateCancel) {
    d.parent_ = this;
    this.branches_++;
  }
  return d;
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} Whether the execution sequence has been started on this
***REMOVED***     Deferred by invoking {@code callback} or {@code errback}.
***REMOVED***
goog.async.Deferred.prototype.hasFired = function() {
  return this.fired_;
***REMOVED***


***REMOVED***
***REMOVED*** @param {*} res The latest result in the execution sequence.
***REMOVED*** @return {boolean} Whether the current result is an error that should cause
***REMOVED***     the next errback to fire. May be overridden by subclasses to handle
***REMOVED***     special error types.
***REMOVED*** @protected
***REMOVED***
goog.async.Deferred.prototype.isError = function(res) {
  return res instanceof Error;
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} Whether an errback exists in the remaining sequence.
***REMOVED*** @private
***REMOVED***
goog.async.Deferred.prototype.hasErrback_ = function() {
  return goog.array.some(this.sequence_, function(sequenceRow) {
    // The errback is the second element in the array.
    return goog.isFunction(sequenceRow[1]);
  });
***REMOVED***


***REMOVED***
***REMOVED*** Exhausts the execution sequence while a result is available. The result may
***REMOVED*** be modified by callbacks or errbacks, and execution will block if the
***REMOVED*** returned result is an incomplete Deferred.
***REMOVED***
***REMOVED*** @private
***REMOVED***
goog.async.Deferred.prototype.fire_ = function() {
  if (this.unhandledExceptionTimeoutId_ && this.hasFired() &&
      this.hasErrback_()) {
    // It is possible to add errbacks after the Deferred has fired. If a new
    // errback is added immediately after the Deferred encountered an unhandled
    // error, but before that error is rethrown, cancel the rethrow.
    goog.global.clearTimeout(this.unhandledExceptionTimeoutId_);
    delete this.unhandledExceptionTimeoutId_;
  }

  if (this.parent_) {
    this.parent_.branches_--;
    delete this.parent_;
  }

  var res = this.result_;
  var unhandledException = false;
  var isNewlyBlocked = false;

  while (this.sequence_.length && !this.blocked_) {
    var sequenceEntry = this.sequence_.shift();

    var callback = sequenceEntry[0];
    var errback = sequenceEntry[1];
    var scope = sequenceEntry[2];

    var f = this.hadError_ ? errback : callback;
    if (f) {
     ***REMOVED*****REMOVED*** @preserveTry***REMOVED***
      try {
        var ret = f.call(scope || this.defaultScope_, res);

        // If no result, then use previous result.
        if (goog.isDef(ret)) {
          // Bubble up the error as long as the return value hasn't changed.
          this.hadError_ = this.hadError_ && (ret == res || this.isError(ret));
          this.result_ = res = ret;
        }

        if (res instanceof goog.async.Deferred) {
          isNewlyBlocked = true;
          this.blocked_ = true;
        }

      } catch (ex) {
        res = ex;
        this.hadError_ = true;

        if (!this.hasErrback_()) {
          // If an error is thrown with no additional errbacks in the queue,
          // prepare to rethrow the error.
          unhandledException = true;
        }
      }
    }
  }

  this.result_ = res;

  if (isNewlyBlocked) {
    res.addCallbacks(
        goog.bind(this.continue_, this, true /* isSuccess***REMOVED***),
        goog.bind(this.continue_, this, false /* isSuccess***REMOVED***));
    res.blocking_ = true;
  }

  if (unhandledException) {
    // Rethrow the unhandled error after a timeout. Execution will continue, but
    // the error will be seen by global handlers and the user. The throw will
    // be canceled if another errback is appended before the timeout executes.
    // The error's original stack trace is preserved where available.
    this.unhandledExceptionTimeoutId_ = goog.global.setTimeout(function() {
      throw res;
    }, 0);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Creates a Deferred that has an initial result.
***REMOVED***
***REMOVED*** @param {*=} opt_result The result.
***REMOVED*** @return {!goog.async.Deferred} The new Deferred.
***REMOVED***
goog.async.Deferred.succeed = function(opt_result) {
  var d = new goog.async.Deferred();
  d.callback(opt_result);
  return d;
***REMOVED***


***REMOVED***
***REMOVED*** Creates a Deferred that has an initial error result.
***REMOVED***
***REMOVED*** @param {*} res The error result.
***REMOVED*** @return {!goog.async.Deferred} The new Deferred.
***REMOVED***
goog.async.Deferred.fail = function(res) {
  var d = new goog.async.Deferred();
  d.errback(res);
  return d;
***REMOVED***


***REMOVED***
***REMOVED*** Creates a Deferred that has already been cancelled.
***REMOVED***
***REMOVED*** @return {!goog.async.Deferred} The new Deferred.
***REMOVED***
goog.async.Deferred.cancelled = function() {
  var d = new goog.async.Deferred();
  d.cancel();
  return d;
***REMOVED***


***REMOVED***
***REMOVED*** Normalizes values that may or may not be Deferreds.
***REMOVED***
***REMOVED*** If the input value is a Deferred, the Deferred is branched (so the original
***REMOVED*** execution sequence is not modified) and the input callback added to the new
***REMOVED*** branch. The branch is returned to the caller.
***REMOVED***
***REMOVED*** If the input value is not a Deferred, the callback will be executed
***REMOVED*** immediately and an already firing Deferred will be returned to the caller.
***REMOVED***
***REMOVED*** In the following (contrived) example, if <code>isImmediate</code> is true
***REMOVED*** then 3 is alerted immediately, otherwise 6 is alerted after a 2-second delay.
***REMOVED***
***REMOVED*** <pre>
***REMOVED*** var value;
***REMOVED*** if (isImmediate) {
***REMOVED***   value = 3;
***REMOVED*** } else {
***REMOVED***   value = new goog.async.Deferred();
***REMOVED***   setTimeout(function() { value.callback(6); }, 2000);
***REMOVED*** }
***REMOVED***
***REMOVED*** var d = goog.async.Deferred.when(value, alert);
***REMOVED*** </pre>
***REMOVED***
***REMOVED*** @param {*} value Deferred or normal value to pass to the callback.
***REMOVED*** @param {!function(this:T, ?):?} callback The callback to execute.
***REMOVED*** @param {T=} opt_scope An optional scope to call the callback in.
***REMOVED*** @return {!goog.async.Deferred} A new Deferred that will call the input
***REMOVED***     callback with the input value.
***REMOVED*** @template T
***REMOVED***
goog.async.Deferred.when = function(value, callback, opt_scope) {
  if (value instanceof goog.async.Deferred) {
    return value.branch(true).addCallback(callback, opt_scope);
  } else {
    return goog.async.Deferred.succeed(value).addCallback(callback, opt_scope);
  }
***REMOVED***



***REMOVED***
***REMOVED*** An error sub class that is used when a Deferred has already been called.
***REMOVED*** @param {!goog.async.Deferred} deferred The Deferred.
***REMOVED***
***REMOVED***
***REMOVED*** @extends {goog.debug.Error}
***REMOVED***
goog.async.Deferred.AlreadyCalledError = function(deferred) {
  goog.debug.Error.call(this);

 ***REMOVED*****REMOVED***
  ***REMOVED*** The Deferred that raised this error.
  ***REMOVED*** @type {goog.async.Deferred}
 ***REMOVED*****REMOVED***
  this.deferred = deferred;
***REMOVED***
goog.inherits(goog.async.Deferred.AlreadyCalledError, goog.debug.Error);


***REMOVED*** @override***REMOVED***
goog.async.Deferred.AlreadyCalledError.prototype.message =
    'Deferred has already fired';


***REMOVED*** @override***REMOVED***
goog.async.Deferred.AlreadyCalledError.prototype.name = 'AlreadyCalledError';



***REMOVED***
***REMOVED*** An error sub class that is used when a Deferred is cancelled.
***REMOVED*** TODO(brenneman): Cancelled -> American English Canceled.
***REMOVED***
***REMOVED*** @param {!goog.async.Deferred} deferred The Deferred object.
***REMOVED***
***REMOVED*** @extends {goog.debug.Error}
***REMOVED***
goog.async.Deferred.CancelledError = function(deferred) {
  goog.debug.Error.call(this);

 ***REMOVED*****REMOVED***
  ***REMOVED*** The Deferred that raised this error.
  ***REMOVED*** @type {goog.async.Deferred}
 ***REMOVED*****REMOVED***
  this.deferred = deferred;
***REMOVED***
goog.inherits(goog.async.Deferred.CancelledError, goog.debug.Error);


***REMOVED*** @override***REMOVED***
goog.async.Deferred.CancelledError.prototype.message = 'Deferred was cancelled';


***REMOVED*** @override***REMOVED***
goog.async.Deferred.CancelledError.prototype.name = 'CancelledError';
