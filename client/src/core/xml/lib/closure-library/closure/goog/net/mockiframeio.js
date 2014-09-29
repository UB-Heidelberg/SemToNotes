// Copyright 2007 The Closure Library Authors. All Rights Reserved.
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

***REMOVED***
***REMOVED*** @fileoverview Mock of IframeIo for unit testing.
***REMOVED***

goog.provide('goog.net.MockIFrameIo');
goog.require('goog.events.EventTarget');
goog.require('goog.net.ErrorCode');
goog.require('goog.net.IframeIo');
goog.require('goog.net.IframeIo.IncrementalDataEvent');



***REMOVED***
***REMOVED*** Mock implenetation of goog.net.IframeIo. This doesn't provide a mock
***REMOVED*** implementation for all cases, but it's not too hard to add them as needed.
***REMOVED*** @param {goog.testing.TestQueue} testQueue Test queue for inserting test
***REMOVED***     events.
***REMOVED***
***REMOVED*** @extends {goog.events.EventTarget}
***REMOVED***
goog.net.MockIFrameIo = function(testQueue) {
  goog.events.EventTarget.call(this);

 ***REMOVED*****REMOVED***
  ***REMOVED*** Queue of events write to
  ***REMOVED*** @type {goog.testing.TestQueue}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.testQueue_ = testQueue;

***REMOVED***
goog.inherits(goog.net.MockIFrameIo, goog.events.EventTarget);


***REMOVED***
***REMOVED*** Whether MockIFrameIo is active.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.net.MockIFrameIo.prototype.active_ = false;


***REMOVED***
***REMOVED*** Last content.
***REMOVED*** @type {string}
***REMOVED*** @private
***REMOVED***
goog.net.MockIFrameIo.prototype.lastContent_ = '';


***REMOVED***
***REMOVED*** Last error code.
***REMOVED*** @type {goog.net.ErrorCode}
***REMOVED*** @private
***REMOVED***
goog.net.MockIFrameIo.prototype.lastErrorCode_ = goog.net.ErrorCode.NO_ERROR;


***REMOVED***
***REMOVED*** Last error message.
***REMOVED*** @type {string}
***REMOVED*** @private
***REMOVED***
goog.net.MockIFrameIo.prototype.lastError_ = '';


***REMOVED***
***REMOVED*** Last custom error.
***REMOVED*** @type {Object}
***REMOVED*** @private
***REMOVED***
goog.net.MockIFrameIo.prototype.lastCustomError_ = null;


***REMOVED***
***REMOVED*** Last URI.
***REMOVED*** @type {goog.Uri}
***REMOVED*** @private
***REMOVED***
goog.net.MockIFrameIo.prototype.lastUri_ = null;


***REMOVED***
***REMOVED*** Simulates the iframe send.
***REMOVED***
***REMOVED*** @param {goog.Uri|string} uri Uri of the request.
***REMOVED*** @param {string=} opt_method Default is GET, POST uses a form to submit the
***REMOVED***     request.
***REMOVED*** @param {boolean=} opt_noCache Append a timestamp to the request to avoid
***REMOVED***     caching.
***REMOVED*** @param {Object|goog.structs.Map=} opt_data Map of key-value pairs.
***REMOVED***
goog.net.MockIFrameIo.prototype.send = function(uri, opt_method, opt_noCache,
                                                opt_data) {
  if (this.active_) {
    throw Error('[goog.net.IframeIo] Unable to send, already active.');
  }

  this.testQueue_.enqueue(['s', uri, opt_method, opt_noCache, opt_data]);
  this.complete_ = false;
  this.active_ = true;
***REMOVED***


***REMOVED***
***REMOVED*** Simulates the iframe send from a form.
***REMOVED*** @param {Element} form Form element used to send the request to the server.
***REMOVED*** @param {string=} opt_uri Uri to set for the destination of the request, by
***REMOVED***     default the uri will come from the form.
***REMOVED*** @param {boolean=} opt_noCache Append a timestamp to the request to avoid
***REMOVED***     caching.
***REMOVED***
goog.net.MockIFrameIo.prototype.sendFromForm = function(form, opt_uri,
     opt_noCache) {
  if (this.active_) {
    throw Error('[goog.net.IframeIo] Unable to send, already active.');
  }

  this.testQueue_.enqueue(['s', form, opt_uri, opt_noCache]);
  this.complete_ = false;
  this.active_ = true;
***REMOVED***


***REMOVED***
***REMOVED*** Simulates aborting the current Iframe request.
***REMOVED*** @param {goog.net.ErrorCode=} opt_failureCode Optional error code to use -
***REMOVED***     defaults to ABORT.
***REMOVED***
goog.net.MockIFrameIo.prototype.abort = function(opt_failureCode) {
  if (this.active_) {
    this.testQueue_.enqueue(['a', opt_failureCode]);
    this.complete_ = false;
    this.active_ = false;
    this.success_ = false;
    this.lastErrorCode_ = opt_failureCode || goog.net.ErrorCode.ABORT;
    this.dispatchEvent(goog.net.EventType.ABORT);
    this.simulateReady();
  }
***REMOVED***


***REMOVED***
***REMOVED*** Simulates receive of incremental data.
***REMOVED*** @param {Object} data Data.
***REMOVED***
goog.net.MockIFrameIo.prototype.simulateIncrementalData = function(data) {
  this.dispatchEvent(new goog.net.IframeIo.IncrementalDataEvent(data));
***REMOVED***


***REMOVED***
***REMOVED*** Simulates the iframe is done.
***REMOVED*** @param {goog.net.ErrorCode} errorCode The error code for any error that
***REMOVED***     should be simulated.
***REMOVED***
goog.net.MockIFrameIo.prototype.simulateDone = function(errorCode) {
  if (errorCode) {
    this.success_ = false;
    this.lastErrorCode_ = goog.net.ErrorCode.HTTP_ERROR;
    this.lastError_ = this.getLastError();
    this.dispatchEvent(goog.net.EventType.ERROR);
  } else {
    this.success_ = true;
    this.lastErrorCode_ = goog.net.ErrorCode.NO_ERROR;
    this.dispatchEvent(goog.net.EventType.SUCCESS);
  }
  this.complete_ = true;
  this.dispatchEvent(goog.net.EventType.COMPLETE);
***REMOVED***


***REMOVED***
***REMOVED*** Simulates the IFrame is ready for the next request.
***REMOVED***
goog.net.MockIFrameIo.prototype.simulateReady = function() {
  this.dispatchEvent(goog.net.EventType.READY);
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} True if transfer is complete.
***REMOVED***
goog.net.MockIFrameIo.prototype.isComplete = function() {
  return this.complete_;
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} True if transfer was successful.
***REMOVED***
goog.net.MockIFrameIo.prototype.isSuccess = function() {
  return this.success_;
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} True if a transfer is in progress.
***REMOVED***
goog.net.MockIFrameIo.prototype.isActive = function() {
  return this.active_;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the last response text (i.e. the text content of the iframe).
***REMOVED*** Assumes plain text!
***REMOVED*** @return {string} Result from the server.
***REMOVED***
goog.net.MockIFrameIo.prototype.getResponseText = function() {
  return this.lastContent_;
***REMOVED***


***REMOVED***
***REMOVED*** Parses the content as JSON. This is a safe parse and may throw an error
***REMOVED*** if the response is malformed.
***REMOVED*** @return {Object} The parsed content.
***REMOVED***
goog.net.MockIFrameIo.prototype.getResponseJson = function() {
  return goog.json.parse(this.lastContent_);
***REMOVED***


***REMOVED***
***REMOVED*** Get the uri of the last request.
***REMOVED*** @return {goog.Uri} Uri of last request.
***REMOVED***
goog.net.MockIFrameIo.prototype.getLastUri = function() {
  return this.lastUri_;
***REMOVED***


***REMOVED***
***REMOVED*** Gets the last error code.
***REMOVED*** @return {goog.net.ErrorCode} Last error code.
***REMOVED***
goog.net.MockIFrameIo.prototype.getLastErrorCode = function() {
  return this.lastErrorCode_;
***REMOVED***


***REMOVED***
***REMOVED*** Gets the last error message.
***REMOVED*** @return {string} Last error message.
***REMOVED***
goog.net.MockIFrameIo.prototype.getLastError = function() {
  return goog.net.ErrorCode.getDebugMessage(this.lastErrorCode_);
***REMOVED***


***REMOVED***
***REMOVED*** Gets the last custom error.
***REMOVED*** @return {Object} Last custom error.
***REMOVED***
goog.net.MockIFrameIo.prototype.getLastCustomError = function() {
  return this.lastCustomError_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the callback function used to check if a loaded IFrame is in an error
***REMOVED*** state.
***REMOVED*** @param {Function} fn Callback that expects a document object as it's single
***REMOVED***     argument.
***REMOVED***
goog.net.MockIFrameIo.prototype.setErrorChecker = function(fn) {
  this.errorChecker_ = fn;
***REMOVED***


***REMOVED***
***REMOVED*** Gets the callback function used to check if a loaded IFrame is in an error
***REMOVED*** state.
***REMOVED*** @return {Function} A callback that expects a document object as it's single
***REMOVED***     argument.
***REMOVED***
goog.net.MockIFrameIo.prototype.getErrorChecker = function() {
  return this.errorChecker_;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the number of milliseconds after which an incomplete request will be
***REMOVED*** aborted, or 0 if no timeout is set.
***REMOVED*** @return {number} Timeout interval in milliseconds.
***REMOVED***
goog.net.MockIFrameIo.prototype.getTimeoutInterval = function() {
  return this.timeoutInterval_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the number of milliseconds after which an incomplete request will be
***REMOVED*** aborted and a {@link goog.net.EventType.TIMEOUT} event raised; 0 means no
***REMOVED*** timeout is set.
***REMOVED*** @param {number} ms Timeout interval in milliseconds; 0 means none.
***REMOVED***
goog.net.MockIFrameIo.prototype.setTimeoutInterval = function(ms) {
  // TODO (pupius) - never used - doesn't look like timeouts were implemented
  this.timeoutInterval_ = Math.max(0, ms);
***REMOVED***


