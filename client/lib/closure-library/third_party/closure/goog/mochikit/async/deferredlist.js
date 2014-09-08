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

goog.require('goog.async.Deferred');



***REMOVED***
***REMOVED*** Constructs an object that waits on the results of multiple asynchronous
***REMOVED*** operations and marshals the results. It is itself a <code>Deferred</code>,
***REMOVED*** and may have an execution sequence of callback functions added to it. Each
***REMOVED*** <code>DeferredList</code> instance is single use and may be fired only once.
***REMOVED***
***REMOVED*** The default behavior of a <code>DeferredList</code> is to wait for a success
***REMOVED*** or error result from every <code>Deferred</code> in its input list. Once
***REMOVED*** every result is available, the <code>DeferredList</code>'s execution sequence
***REMOVED*** is fired with a list of <code>[success, result]</code> array pairs, where
***REMOVED*** <code>success</code> is a boolean indicating whether <code>result</code> was
***REMOVED*** the product of a callback or errback. The list's completion criteria and
***REMOVED*** result list may be modified by setting one or more of the boolean options
***REMOVED*** documented below.
***REMOVED***
***REMOVED*** <code>Deferred</code> instances passed into a <code>DeferredList</code> are
***REMOVED*** independent, and may have additional callbacks and errbacks added to their
***REMOVED*** execution sequences after they are passed as inputs to the list.
***REMOVED***
***REMOVED*** @param {!Array.<!goog.async.Deferred>} list An array of deferred results to
***REMOVED***     wait for.
***REMOVED*** @param {boolean=} opt_fireOnOneCallback Whether to stop waiting as soon as
***REMOVED***     one input completes successfully. In this case, the
***REMOVED***     <code>DeferredList</code>'s callback chain will be called with a two
***REMOVED***     element array, <code>[index, result]</code>, where <code>index</code>
***REMOVED***     identifies which input <code>Deferred</code> produced the successful
***REMOVED***     <code>result</code>.
***REMOVED*** @param {boolean=} opt_fireOnOneErrback Whether to stop waiting as soon as one
***REMOVED***     input reports an error. The failing result is passed to the
***REMOVED***     <code>DeferredList</code>'s errback sequence.
***REMOVED*** @param {boolean=} opt_consumeErrors When true, any errors fired by a
***REMOVED***     <code>Deferred</code> in the input list will be captured and replaced
***REMOVED***     with a succeeding null result. Any callbacks added to the
***REMOVED***     <code>Deferred</code> after its use in the <code>DeferredList</code> will
***REMOVED***     receive null instead of the error.
***REMOVED*** @param {Function=} opt_canceler A function that will be called if the
***REMOVED***     <code>DeferredList</code> is canceled. @see goog.async.Deferred#cancel
***REMOVED*** @param {Object=} opt_defaultScope The default scope to invoke callbacks or
***REMOVED***     errbacks in.
***REMOVED***
***REMOVED*** @extends {goog.async.Deferred}
***REMOVED***
goog.async.DeferredList = function(
    list, opt_fireOnOneCallback, opt_fireOnOneErrback, opt_consumeErrors,
    opt_canceler, opt_defaultScope) {

  goog.async.DeferredList.base(this, 'constructor',
      opt_canceler, opt_defaultScope);

 ***REMOVED*****REMOVED***
  ***REMOVED*** The list of Deferred objects to wait for.
  ***REMOVED*** @const {!Array.<!goog.async.Deferred>}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.list_ = list;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The stored return values of the Deferred objects.
  ***REMOVED*** @const {!Array}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.deferredResults_ = [];

 ***REMOVED*****REMOVED***
  ***REMOVED*** Whether to fire on the first successful callback instead of waiting for
  ***REMOVED*** every Deferred to complete.
  ***REMOVED*** @const {boolean}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.fireOnOneCallback_ = !!opt_fireOnOneCallback;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Whether to fire on the first error result received instead of waiting for
  ***REMOVED*** every Deferred to complete.
  ***REMOVED*** @const {boolean}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.fireOnOneErrback_ = !!opt_fireOnOneErrback;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Whether to stop error propagation on the input Deferred objects. If the
  ***REMOVED*** DeferredList sees an error from one of the Deferred inputs, the error will
  ***REMOVED*** be captured, and the Deferred will be returned to success state with a null
  ***REMOVED*** return value.
  ***REMOVED*** @const {boolean}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.consumeErrors_ = !!opt_consumeErrors;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The number of input deferred objects that have fired.
  ***REMOVED*** @private {number}
 ***REMOVED*****REMOVED***
  this.numFinished_ = 0;

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
goog.async.DeferredList.prototype.handleCallback_ = function(
    index, success, result) {

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


***REMOVED*** @override***REMOVED***
goog.async.DeferredList.prototype.errback = function(res) {
  goog.async.DeferredList.base(this, 'errback', res);

  // On error, cancel any pending requests.
  for (var i = 0; i < this.list_.length; i++) {
    this.list_[i].cancel();
  }
***REMOVED***


***REMOVED***
***REMOVED*** Creates a <code>DeferredList</code> that gathers results from multiple
***REMOVED*** <code>Deferred</code> inputs. If all inputs succeed, the callback is fired
***REMOVED*** with the list of results as a flat array. If any input fails, the list's
***REMOVED*** errback is fired immediately with the offending error, and all other pending
***REMOVED*** inputs are canceled.
***REMOVED***
***REMOVED*** @param {!Array.<!goog.async.Deferred>} list The list of <code>Deferred</code>
***REMOVED***     inputs to wait for.
***REMOVED*** @return {!goog.async.Deferred} The deferred list of results from the inputs
***REMOVED***     if they all succeed, or the error result of the first input to fail.
***REMOVED***
goog.async.DeferredList.gatherResults = function(list) {
  return new goog.async.DeferredList(list, false, true).
      addCallback(function(results) {
        var output = [];
        for (var i = 0; i < results.length; i++) {
          output[i] = results[i][1];
        }
        return output;
      });
***REMOVED***
