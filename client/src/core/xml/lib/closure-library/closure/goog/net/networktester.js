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
***REMOVED*** @fileoverview Definition of goog.net.NetworkTester.
***REMOVED***

goog.provide('goog.net.NetworkTester');
goog.require('goog.Timer');
***REMOVED***
goog.require('goog.debug.Logger');



***REMOVED***
***REMOVED*** Creates an instance of goog.net.NetworkTester which can be used to test
***REMOVED*** for internet connectivity by seeing if an image can be loaded from
***REMOVED*** google.com. It can also be tested with other URLs.
***REMOVED*** @param {Function} callback Callback that is called when the test completes.
***REMOVED***     The callback takes a single boolean parameter. True indicates the URL
***REMOVED***     was reachable, false indicates it wasn't.
***REMOVED*** @param {Object=} opt_handler Handler object for the callback.
***REMOVED*** @param {goog.Uri=} opt_uri URI to use for testing.
***REMOVED***
***REMOVED***
goog.net.NetworkTester = function(callback, opt_handler, opt_uri) {
 ***REMOVED*****REMOVED***
  ***REMOVED*** Callback that is called when the test completes.
  ***REMOVED*** The callback takes a single boolean parameter. True indicates the URL was
  ***REMOVED*** reachable, false indicates it wasn't.
  ***REMOVED*** @type {Function}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.callback_ = callback;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Handler object for the callback.
  ***REMOVED*** @type {Object|undefined}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.handler_ = opt_handler;

  if (!opt_uri) {
    // set the default URI to be based on the cleardot image at google.com
    // We need to add a 'rand' to make sure the response is not fulfilled
    // by browser cache. Use protocol-relative URLs to avoid insecure content
    // warnings in IE.
    opt_uri = new goog.Uri('//www.google.com/images/cleardot.gif');
    opt_uri.makeUnique();
  }

 ***REMOVED*****REMOVED***
  ***REMOVED*** Uri to use for test. Defaults to using an image off of google.com
  ***REMOVED*** @type {goog.Uri}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.uri_ = opt_uri;
***REMOVED***


***REMOVED***
***REMOVED*** Default timeout
***REMOVED*** @type {number}
***REMOVED***
goog.net.NetworkTester.DEFAULT_TIMEOUT_MS = 10000;


***REMOVED***
***REMOVED*** Logger object
***REMOVED*** @type {goog.debug.Logger}
***REMOVED*** @private
***REMOVED***
goog.net.NetworkTester.prototype.logger_ =
    goog.debug.Logger.getLogger('goog.net.NetworkTester');


***REMOVED***
***REMOVED*** Timeout for test
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.net.NetworkTester.prototype.timeoutMs_ =
    goog.net.NetworkTester.DEFAULT_TIMEOUT_MS;


***REMOVED***
***REMOVED*** Whether we've already started running.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.net.NetworkTester.prototype.running_ = false;


***REMOVED***
***REMOVED*** Number of retries to attempt
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.net.NetworkTester.prototype.retries_ = 0;


***REMOVED***
***REMOVED*** Attempt number we're on
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.net.NetworkTester.prototype.attempt_ = 0;


***REMOVED***
***REMOVED*** Pause between retries in milliseconds.
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.net.NetworkTester.prototype.pauseBetweenRetriesMs_ = 0;


***REMOVED***
***REMOVED*** Timer for timeouts.
***REMOVED*** @type {?number}
***REMOVED*** @private
***REMOVED***
goog.net.NetworkTester.prototype.timeoutTimer_ = null;


***REMOVED***
***REMOVED*** Timer for pauses between retries.
***REMOVED*** @type {?number}
***REMOVED*** @private
***REMOVED***
goog.net.NetworkTester.prototype.pauseTimer_ = null;


***REMOVED***
***REMOVED*** Returns the timeout in milliseconds.
***REMOVED*** @return {number} Timeout in milliseconds.
***REMOVED***
goog.net.NetworkTester.prototype.getTimeout = function() {
  return this.timeoutMs_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the timeout in milliseconds.
***REMOVED*** @param {number} timeoutMs Timeout in milliseconds.
***REMOVED***
goog.net.NetworkTester.prototype.setTimeout = function(timeoutMs) {
  this.timeoutMs_ = timeoutMs;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the numer of retries to attempt.
***REMOVED*** @return {number} Number of retries to attempt.
***REMOVED***
goog.net.NetworkTester.prototype.getNumRetries = function() {
  return this.retries_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the timeout in milliseconds.
***REMOVED*** @param {number} retries Number of retries to attempt.
***REMOVED***
goog.net.NetworkTester.prototype.setNumRetries = function(retries) {
  this.retries_ = retries;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the pause between retries in milliseconds.
***REMOVED*** @return {number} Pause between retries in milliseconds.
***REMOVED***
goog.net.NetworkTester.prototype.getPauseBetweenRetries = function() {
  return this.pauseBetweenRetriesMs_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the pause between retries in milliseconds.
***REMOVED*** @param {number} pauseMs Pause between retries in milliseconds.
***REMOVED***
goog.net.NetworkTester.prototype.setPauseBetweenRetries = function(pauseMs) {
  this.pauseBetweenRetriesMs_ = pauseMs;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the uri to use for the test.
***REMOVED*** @return {goog.Uri} The uri for the test.
***REMOVED***
goog.net.NetworkTester.prototype.getUri = function() {
  return this.uri_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the uri to use for the test.
***REMOVED*** @param {goog.Uri} uri The uri for the test.
***REMOVED***
goog.net.NetworkTester.prototype.setUri = function(uri) {
  this.uri_ = uri;
***REMOVED***


***REMOVED***
***REMOVED*** Returns whether the tester is currently running.
***REMOVED*** @return {boolean} True if it's running, false if it's not running.
***REMOVED***
goog.net.NetworkTester.prototype.isRunning = function() {
  return this.running_;
***REMOVED***


***REMOVED***
***REMOVED*** Starts the process of testing the network.
***REMOVED***
goog.net.NetworkTester.prototype.start = function() {
  if (this.running_) {
    throw Error('NetworkTester.start called when already running');
  }
  this.running_ = true;

  this.logger_.info('Starting');
  this.attempt_ = 0;
  this.startNextAttempt_();
***REMOVED***


***REMOVED***
***REMOVED*** Stops the testing of the network. This is a noop if not running.
***REMOVED***
goog.net.NetworkTester.prototype.stop = function() {
  this.cleanupCallbacks_();
  this.running_ = false;
***REMOVED***


***REMOVED***
***REMOVED*** Starts the next attempt to load an image.
***REMOVED*** @private
***REMOVED***
goog.net.NetworkTester.prototype.startNextAttempt_ = function() {
  this.attempt_++;

  if (goog.net.NetworkTester.getNavigatorOffline_()) {
    this.logger_.info('Browser is set to work offline.');
    // Call in a timeout to make async like the rest.
    goog.Timer.callOnce(goog.bind(this.onResult, this, false), 0);
  } else {
    this.logger_.info('Loading image (attempt ' + this.attempt_ +
                      ') at ' + this.uri_);
    this.image_ = new Image();
    this.image_.onload = goog.bind(this.onImageLoad_, this);
    this.image_.onerror = goog.bind(this.onImageError_, this);
    this.image_.onabort = goog.bind(this.onImageAbort_, this);

    this.timeoutTimer_ = goog.Timer.callOnce(this.onImageTimeout_,
        this.timeoutMs_, this);
    this.image_.src = String(this.uri_);
  }
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} Whether navigator.onLine returns false.
***REMOVED*** @private
***REMOVED***
goog.net.NetworkTester.getNavigatorOffline_ = function() {
  return 'onLine' in navigator && !navigator.onLine;
***REMOVED***


***REMOVED***
***REMOVED*** Callback for the image successfully loading.
***REMOVED*** @private
***REMOVED***
goog.net.NetworkTester.prototype.onImageLoad_ = function() {
  this.logger_.info('Image loaded');
  this.onResult(true);
***REMOVED***


***REMOVED***
***REMOVED*** Callback for the image failing to load.
***REMOVED*** @private
***REMOVED***
goog.net.NetworkTester.prototype.onImageError_ = function() {
  this.logger_.info('Image load error');
  this.onResult(false);
***REMOVED***


***REMOVED***
***REMOVED*** Callback for the image load being aborted.
***REMOVED*** @private
***REMOVED***
goog.net.NetworkTester.prototype.onImageAbort_ = function() {
  this.logger_.info('Image load aborted');
  this.onResult(false);
***REMOVED***


***REMOVED***
***REMOVED*** Callback for the image load timing out.
***REMOVED*** @private
***REMOVED***
goog.net.NetworkTester.prototype.onImageTimeout_ = function() {
  this.logger_.info('Image load timed out');
  this.onResult(false);
***REMOVED***


***REMOVED***
***REMOVED*** Handles a successful or failed result.
***REMOVED*** @param {boolean} succeeded Whether the image load succeeded.
***REMOVED***
goog.net.NetworkTester.prototype.onResult = function(succeeded) {
  this.cleanupCallbacks_();

  if (succeeded) {
    this.running_ = false;
    this.callback_.call(this.handler_, true);
  } else {
    if (this.attempt_ <= this.retries_) {
      if (this.pauseBetweenRetriesMs_) {
        this.pauseTimer_ = goog.Timer.callOnce(this.onPauseFinished_,
            this.pauseBetweenRetriesMs_, this);
      } else {
        this.startNextAttempt_();
      }
    } else {
      this.running_ = false;
      this.callback_.call(this.handler_, false);
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** Callback for the pause between retry timer.
***REMOVED*** @private
***REMOVED***
goog.net.NetworkTester.prototype.onPauseFinished_ = function() {
  this.pauseTimer_ = null;
  this.startNextAttempt_();
***REMOVED***


***REMOVED***
***REMOVED*** Cleans up the handlers and timer associated with the image.
***REMOVED*** @private
***REMOVED***
goog.net.NetworkTester.prototype.cleanupCallbacks_ = function() {
  // clear handlers to avoid memory leaks
  // NOTE(user): Nullified individually to avoid compiler warnings
  // (BUG 658126)
  if (this.image_) {
    this.image_.onload = null;
    this.image_.onerror = null;
    this.image_.onabort = null;
    this.image_ = null;
  }
  if (this.timeoutTimer_) {
    goog.Timer.clear(this.timeoutTimer_);
    this.timeoutTimer_ = null;
  }
  if (this.pauseTimer_) {
    goog.Timer.clear(this.pauseTimer_);
    this.pauseTimer_ = null;
  }
***REMOVED***
