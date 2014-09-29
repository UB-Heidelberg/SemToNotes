// Copyright 2005 Bob Ippolito. All Rights Reserved.
// Modifications Copyright 2009 The Closure Library Authors.
// All Rights Reserved.

***REMOVED***
***REMOVED*** Portions of this code are from MochiKit, received by The Closure
***REMOVED*** Library Authors under the MIT license. All other code is Copyright
***REMOVED*** 2005-2009 The Closure Library Authors. All Rights Reserved.
***REMOVED***

***REMOVED***
***REMOVED*** @fileoverview Class for tracking multiple asynchronous operations and
***REMOVED*** handling the results. The DeferredList object here is patterned after the
***REMOVED*** DeferredList object in the Twisted python networking framework.
***REMOVED***
***REMOVED*** Based on the MochiKit code.
***REMOVED***
***REMOVED*** See: http://twistedmatrix.com/projects/core/documentation/howto/defer.html
***REMOVED***
***REMOVED*** @author brenneman@google.com (Shawn Brenneman)
***REMOVED***

goog.provide('goog.async.DeferredList');

goog.require('goog.array');
goog.require('goog.async.Deferred');



***REMOVED***
***REMOVED*** Constructs an object that waits on the results of multiple asynchronous
***REMOVED*** operations and marshals the results. It is itself a <code>Deferred</code>,
***REMOVED*** and sends results to its registered callback chain. Each instance is single
***REMOVED*** use and may only fire once.
***REMOVED***
***REMOVED*** Unless overridden by one of the options below, the <code>DeferredList</code>
***REMOVED*** will wait for a result from every input <code>Deferred</code>. The results
***REMOVED*** are stored in a list of two-element arrays as <code>[success, result]</code>,
***REMOVED*** where <code>success</code> is whether that result was from a callback or
***REMOVED*** errback. Once all results are available, the <code>DeferredList</code>'s
***REMOVED*** callback chain is invoked with the full result list.
***REMOVED***
***REMOVED*** @param {!Array.<!goog.async.Deferred>} list An array of deferred objects to
***REMOVED***     wait for.
***REMOVED*** @param {boolean=} opt_fireOnOneCallback Whether to stop waiting as soon as
***REMOVED***     one input completes successfully. In this case, the
***REMOVED***     <code>DeferredList</code>'s callback chain will be called with a two
***REMOVED***     element array, <code>[index, result]</code>, where <code>index</code>
***REMOVED***     identifies which input <code>Deferred</code> produced the
***REMOVED***     <code>result</code>.
***REMOVED*** @param {boolean=} opt_fireOnOneErrback Whether to stop waiting as soon as one
***REMOVED***     input reports an error. The error result is passed to the
***REMOVED***     <code>DeferredList</code>'s error callback chain.
***REMOVED*** @param {boolean=} opt_consumeErrors When true, will stop propagation of the
***REMOVED***     error callback chain for input deferred objects. If the failing deferred
***REMOVED***     has a registered callback after this <code>DeferredList</code>, it will
***REMOVED***     be called with null instead of an <code>Error</code>.
***REMOVED*** @param {Function=} opt_canceller A function that will be called if the
***REMOVED***     deferred list is canceled.
***REMOVED*** @param {Object=} opt_defaultScope The default scope to call callbacks with.
***REMOVED***
***REMOVED*** @extends {goog.async.Deferred}
***REMOVED***
goog.async.DeferredList = function(list,
                                   opt_fireOnOneCallback,
                                   opt_fireOnOneErrback,
                                   opt_consumeErrors,
                                   opt_canceller,
                                   opt_defaultScope) {
  goog.async.Deferred.call(this, opt_canceller, opt_defaultScope);

 ***REMOVED*****REMOVED***
  ***REMOVED*** The list of Deferred objects to wait for.
  ***REMOVED*** @type {!Array.<!goog.async.Deferred>}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.list_ = list;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The stored return values of the Deferred objects.
  ***REMOVED*** @type {!Array}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.deferredResults_ = [];

 ***REMOVED*****REMOVED***
  ***REMOVED*** Whether to fire on the first successful callback instead of waiting for
  ***REMOVED*** every Deferred to complete.
  ***REMOVED*** @type {boolean}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.fireOnOneCallback_ = !!opt_fireOnOneCallback;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Whether to fire on the first error result received instead of waiting for
  ***REMOVED*** every Deferred to complete.
  ***REMOVED*** @type {boolean}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.fireOnOneErrback_ = !!opt_fireOnOneErrback;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Whether to stop error propagation on the input Deferred objects. If the
  ***REMOVED*** DeferredList sees an error from one of the Deferred inputs, the error will
  ***REMOVED*** be captured, and the Deferred will be returned to success state with a null
  ***REMOVED*** return value.
  ***REMOVED*** @type {boolean}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.consumeErrors_ = !!opt_consumeErrors;

  for (var i = 0; i < list.length; i++) {
    var d = list[i];
    d.addCallbacks(goog.bind(this.handleCallback_, this, i, true),
                   goog.bind(this.handleCallback_, this, i, false));
  }

  if (list.length == 0 && !this.fireOnOneCallback_) {
    this.callback(this.deferredResults_);
  }
***REMOVED***
goog.inherits(goog.async.DeferredList, goog.async.Deferred);


***REMOVED***
***REMOVED*** The number of input deferred objects that have fired.
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.async.DeferredList.prototype.numFinished_ = 0;


***REMOVED***
***REMOVED*** Registers the result from an input deferred callback or errback. The result
***REMOVED*** is returned and may be passed to additional handlers in the callback chain.
***REMOVED***
***REMOVED*** @param {number} index The index of the firing deferred object in the input
***REMOVED***     list.
***REMOVED*** @param {boolean} success Whether the result is from a callback or errback.
***REMOVED*** @param {*} result The result of the callback or errback.
***REMOVED*** @return {*} The result, to be handled by the next handler in the deferred's
***REMOVED***     callback chain (if any). If consumeErrors is set, an error result is
***REMOVED***     replaced with null.
***REMOVED*** @private
***REMOVED***
goog.async.DeferredList.prototype.handleCallback_ = function(index,
                                                             success,
                                                             result) {
  this.numFinished_++;
  this.deferredResults_[index] = [success, result];

  if (!this.hasFired()) {
    if (this.fireOnOneCallback_ && success) {
      this.callback([index, result]);
    } else if (this.fireOnOneErrback_ && !success) {
      this.errback(result);
    } else if (this.numFinished_ == this.list_.length) {
      this.callback(this.deferredResults_);
    }
  }

  if (this.consumeErrors_ && !success) {
    result = null;
  }

  return result;
***REMOVED***


***REMOVED*** @inheritDoc***REMOVED***
goog.async.DeferredList.prototype.errback = function(res) {
  goog.async.DeferredList.superClass_.errback.call(this, res);
  // On error, cancel any pending requests.
  goog.array.forEach(this.list_, function(item) {
    item.cancel();
  });
***REMOVED***


***REMOVED***
***REMOVED*** Creates a <code>DeferredList</code> that gathers results from multiple
***REMOVED*** <code>Deferred</code> inputs. If all inputs succeed, the callback is fired
***REMOVED*** with the list of results as a flat array. If any input fails, the errback is
***REMOVED*** fired with the error.
***REMOVED***
***REMOVED*** @param {!Array.<!goog.async.Deferred>} list The list of deferred objects to
***REMOVED***     wait for.
***REMOVED*** @return {!goog.async.DeferredList} A new deferred list.
***REMOVED***
goog.async.DeferredList.gatherResults = function(list) {
  var d = new goog.async.DeferredList(list, false, true);

  d.addCallback(function(results) {
    return goog.array.map(results, function(res) {
      return res[1];
    });
  });

  return d;
***REMOVED***
