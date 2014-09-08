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
***REMOVED*** @fileoverview Mock of XhrIo for unit testing.
***REMOVED***

goog.provide('goog.testing.net.XhrIo');

goog.require('goog.array');
goog.require('goog.dom.xml');
***REMOVED***
goog.require('goog.events.EventTarget');
goog.require('goog.json');
goog.require('goog.net.ErrorCode');
goog.require('goog.net.EventType');
goog.require('goog.net.HttpStatus');
***REMOVED***
goog.require('goog.net.XmlHttp');
goog.require('goog.object');
goog.require('goog.structs.Map');



***REMOVED***
***REMOVED*** Mock implementation of goog.net.XhrIo. This doesn't provide a mock
***REMOVED*** implementation for all cases, but it's not too hard to add them as needed.
***REMOVED*** @param {goog.testing.TestQueue=} opt_testQueue Test queue for inserting test
***REMOVED***     events.
***REMOVED***
***REMOVED*** @extends {goog.events.EventTarget}
***REMOVED***
goog.testing.net.XhrIo = function(opt_testQueue) {
  goog.events.EventTarget.call(this);

 ***REMOVED*****REMOVED***
  ***REMOVED*** Map of default headers to add to every request, use:
  ***REMOVED*** XhrIo.headers.set(name, value)
  ***REMOVED*** @type {goog.structs.Map}
 ***REMOVED*****REMOVED***
  this.headers = new goog.structs.Map();

 ***REMOVED*****REMOVED***
  ***REMOVED*** Queue of events write to.
  ***REMOVED*** @type {goog.testing.TestQueue?}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.testQueue_ = opt_testQueue || null;
***REMOVED***
goog.inherits(goog.testing.net.XhrIo, goog.events.EventTarget);


***REMOVED***
***REMOVED*** Alias this enum here to make mocking of goog.net.XhrIo easier.
***REMOVED*** @enum {string}
***REMOVED***
goog.testing.net.XhrIo.ResponseType = goog.net.XhrIo.ResponseType;


***REMOVED***
***REMOVED*** All non-disposed instances of goog.testing.net.XhrIo created
***REMOVED*** by {@link goog.testing.net.XhrIo.send} are in this Array.
***REMOVED*** @see goog.testing.net.XhrIo.cleanup
***REMOVED*** @type {Array.<goog.testing.net.XhrIo>}
***REMOVED*** @private
***REMOVED***
goog.testing.net.XhrIo.sendInstances_ = [];


***REMOVED***
***REMOVED*** Returns an Array containing all non-disposed instances of
***REMOVED*** goog.testing.net.XhrIo created by {@link goog.testing.net.XhrIo.send}.
***REMOVED*** @return {Array} Array of goog.testing.net.XhrIo instances.
***REMOVED***
goog.testing.net.XhrIo.getSendInstances = function() {
  return goog.testing.net.XhrIo.sendInstances_;
***REMOVED***


***REMOVED***
***REMOVED*** Disposes all non-disposed instances of goog.testing.net.XhrIo created by
***REMOVED*** {@link goog.testing.net.XhrIo.send}.
***REMOVED*** @see goog.net.XhrIo.cleanup
***REMOVED***
goog.testing.net.XhrIo.cleanup = function() {
  var instances = goog.testing.net.XhrIo.sendInstances_;
  while (instances.length) {
    instances.pop().dispose();
  }
***REMOVED***


***REMOVED***
***REMOVED*** Simulates the static XhrIo send method.
***REMOVED*** @param {string} url Uri to make request to.
***REMOVED*** @param {Function=} opt_callback Callback function for when request is
***REMOVED***     complete.
***REMOVED*** @param {string=} opt_method Send method, default: GET.
***REMOVED*** @param {string=} opt_content Post data.
***REMOVED*** @param {Object|goog.structs.Map=} opt_headers Map of headers to add to the
***REMOVED***     request.
***REMOVED*** @param {number=} opt_timeoutInterval Number of milliseconds after which an
***REMOVED***     incomplete request will be aborted; 0 means no timeout is set.
***REMOVED***
goog.testing.net.XhrIo.send = function(url, opt_callback, opt_method,
                                       opt_content, opt_headers,
                                       opt_timeoutInterval) {
  var x = new goog.testing.net.XhrIo();
  goog.testing.net.XhrIo.sendInstances_.push(x);
  if (opt_callback) {
  ***REMOVED***x, goog.net.EventType.COMPLETE, opt_callback);
  }
***REMOVED***x,
                     goog.net.EventType.READY,
                     goog.partial(goog.testing.net.XhrIo.cleanupSend_, x));
  if (opt_timeoutInterval) {
    x.setTimeoutInterval(opt_timeoutInterval);
  }
  x.send(url, opt_method, opt_content, opt_headers);
***REMOVED***


***REMOVED***
***REMOVED*** Disposes of the specified goog.testing.net.XhrIo created by
***REMOVED*** {@link goog.testing.net.XhrIo.send} and removes it from
***REMOVED*** {@link goog.testing.net.XhrIo.pendingStaticSendInstances_}.
***REMOVED*** @param {goog.testing.net.XhrIo} XhrIo An XhrIo created by
***REMOVED***     {@link goog.testing.net.XhrIo.send}.
***REMOVED*** @private
***REMOVED***
goog.testing.net.XhrIo.cleanupSend_ = function(XhrIo) {
  XhrIo.dispose();
  goog.array.remove(goog.testing.net.XhrIo.sendInstances_, XhrIo);
***REMOVED***


***REMOVED***
***REMOVED*** Stores the simulated response headers for the requests which are sent through
***REMOVED*** this XhrIo.
***REMOVED*** @type {Object}
***REMOVED*** @private
***REMOVED***
goog.testing.net.XhrIo.prototype.responseHeaders_;


***REMOVED***
***REMOVED*** Whether MockXhrIo is active.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.testing.net.XhrIo.prototype.active_ = false;


***REMOVED***
***REMOVED*** Last URI that was requested.
***REMOVED*** @type {string}
***REMOVED*** @private
***REMOVED***
goog.testing.net.XhrIo.prototype.lastUri_ = '';


***REMOVED***
***REMOVED*** Last HTTP method that was requested.
***REMOVED*** @type {string|undefined}
***REMOVED*** @private
***REMOVED***
goog.testing.net.XhrIo.prototype.lastMethod_;


***REMOVED***
***REMOVED*** Last POST content that was requested.
***REMOVED*** @type {string|undefined}
***REMOVED*** @private
***REMOVED***
goog.testing.net.XhrIo.prototype.lastContent_;


***REMOVED***
***REMOVED*** Additional headers that were requested in the last query.
***REMOVED*** @type {Object|goog.structs.Map|undefined}
***REMOVED*** @private
***REMOVED***
goog.testing.net.XhrIo.prototype.lastHeaders_;


***REMOVED***
***REMOVED*** Last error code.
***REMOVED*** @type {goog.net.ErrorCode}
***REMOVED*** @private
***REMOVED***
goog.testing.net.XhrIo.prototype.lastErrorCode_ =
    goog.net.ErrorCode.NO_ERROR;


***REMOVED***
***REMOVED*** Last error message.
***REMOVED*** @type {string}
***REMOVED*** @private
***REMOVED***
goog.testing.net.XhrIo.prototype.lastError_ = '';


***REMOVED***
***REMOVED*** The response object.
***REMOVED*** @type {string|Document}
***REMOVED*** @private
***REMOVED***
goog.testing.net.XhrIo.prototype.response_ = '';


***REMOVED***
***REMOVED*** Mock ready state.
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.testing.net.XhrIo.prototype.readyState_ =
    goog.net.XmlHttp.ReadyState.UNINITIALIZED;


***REMOVED***
***REMOVED*** Number of milliseconds after which an incomplete request will be aborted and
***REMOVED*** a {@link goog.net.EventType.TIMEOUT} event raised; 0 means no timeout is set.
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.testing.net.XhrIo.prototype.timeoutInterval_ = 0;


***REMOVED***
***REMOVED*** Window timeout ID used to cancel the timeout event handler if the request
***REMOVED*** completes successfully.
***REMOVED*** @type {Object}
***REMOVED*** @private
***REMOVED***
goog.testing.net.XhrIo.prototype.timeoutId_ = null;


***REMOVED***
***REMOVED*** The requested type for the response. The empty string means use the default
***REMOVED*** XHR behavior.
***REMOVED*** @type {goog.net.XhrIo.ResponseType}
***REMOVED*** @private
***REMOVED***
goog.testing.net.XhrIo.prototype.responseType_ =
    goog.net.XhrIo.ResponseType.DEFAULT;


***REMOVED***
***REMOVED*** Whether a "credentialed" request is to be sent (one that is aware of cookies
***REMOVED*** and authentication) . This is applicable only for cross-domain requests and
***REMOVED*** more recent browsers that support this part of the HTTP Access Control
***REMOVED*** standard.
***REMOVED***
***REMOVED*** @see http://dev.w3.org/2006/webapi/XMLHttpRequest-2/#withcredentials
***REMOVED***
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.testing.net.XhrIo.prototype.withCredentials_ = false;


***REMOVED***
***REMOVED*** Whether there's currently an underlying XHR object.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.testing.net.XhrIo.prototype.xhr_ = false;


***REMOVED***
***REMOVED*** Returns the number of milliseconds after which an incomplete request will be
***REMOVED*** aborted, or 0 if no timeout is set.
***REMOVED*** @return {number} Timeout interval in milliseconds.
***REMOVED***
goog.testing.net.XhrIo.prototype.getTimeoutInterval = function() {
  return this.timeoutInterval_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the number of milliseconds after which an incomplete request will be
***REMOVED*** aborted and a {@link goog.net.EventType.TIMEOUT} event raised; 0 means no
***REMOVED*** timeout is set.
***REMOVED*** @param {number} ms Timeout interval in milliseconds; 0 means none.
***REMOVED***
goog.testing.net.XhrIo.prototype.setTimeoutInterval = function(ms) {
  this.timeoutInterval_ = Math.max(0, ms);
***REMOVED***


***REMOVED***
***REMOVED*** Causes timeout events to be fired.
***REMOVED***
goog.testing.net.XhrIo.prototype.simulateTimeout = function() {
  this.lastErrorCode_ = goog.net.ErrorCode.TIMEOUT;
  this.dispatchEvent(goog.net.EventType.TIMEOUT);
  this.abort(goog.net.ErrorCode.TIMEOUT);
***REMOVED***


***REMOVED***
***REMOVED*** Sets the desired type for the response. At time of writing, this is only
***REMOVED*** supported in very recent versions of WebKit (10.0.612.1 dev and later).
***REMOVED***
***REMOVED*** If this is used, the response may only be accessed via {@link #getResponse}.
***REMOVED***
***REMOVED*** @param {goog.net.XhrIo.ResponseType} type The desired type for the response.
***REMOVED***
goog.testing.net.XhrIo.prototype.setResponseType = function(type) {
  this.responseType_ = type;
***REMOVED***


***REMOVED***
***REMOVED*** Gets the desired type for the response.
***REMOVED*** @return {goog.net.XhrIo.ResponseType} The desired type for the response.
***REMOVED***
goog.testing.net.XhrIo.prototype.getResponseType = function() {
  return this.responseType_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets whether a "credentialed" request that is aware of cookie and
***REMOVED*** authentication information should be made. This option is only supported by
***REMOVED*** browsers that support HTTP Access Control. As of this writing, this option
***REMOVED*** is not supported in IE.
***REMOVED***
***REMOVED*** @param {boolean} withCredentials Whether this should be a "credentialed"
***REMOVED***     request.
***REMOVED***
goog.testing.net.XhrIo.prototype.setWithCredentials =
    function(withCredentials) {
  this.withCredentials_ = withCredentials;
***REMOVED***


***REMOVED***
***REMOVED*** Gets whether a "credentialed" request is to be sent.
***REMOVED*** @return {boolean} The desired type for the response.
***REMOVED***
goog.testing.net.XhrIo.prototype.getWithCredentials = function() {
  return this.withCredentials_;
***REMOVED***


***REMOVED***
***REMOVED*** Abort the current XMLHttpRequest
***REMOVED*** @param {goog.net.ErrorCode=} opt_failureCode Optional error code to use -
***REMOVED***     defaults to ABORT.
***REMOVED***
goog.testing.net.XhrIo.prototype.abort = function(opt_failureCode) {
  if (this.active_) {
    try {
      this.active_ = false;
      this.lastErrorCode_ = opt_failureCode || goog.net.ErrorCode.ABORT;
      this.dispatchEvent(goog.net.EventType.COMPLETE);
      this.dispatchEvent(goog.net.EventType.ABORT);
    } finally {
      this.simulateReady();
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** Simulates the XhrIo send.
***REMOVED*** @param {string} url Uri to make request too.
***REMOVED*** @param {string=} opt_method Send method, default: GET.
***REMOVED*** @param {string=} opt_content Post data.
***REMOVED*** @param {Object|goog.structs.Map=} opt_headers Map of headers to add to the
***REMOVED***     request.
***REMOVED***
goog.testing.net.XhrIo.prototype.send = function(url, opt_method, opt_content,
                                                 opt_headers) {
  if (this.xhr_) {
    throw Error('[goog.net.XhrIo] Object is active with another request');
  }

  this.lastUri_ = url;
  this.lastMethod_ = opt_method || 'GET';
  this.lastContent_ = opt_content;
  this.lastHeaders_ = opt_headers;

  if (this.testQueue_) {
    this.testQueue_.enqueue(['s', url, opt_method, opt_content, opt_headers]);
  }
  this.xhr_ = true;
  this.active_ = true;
  this.readyState_ = goog.net.XmlHttp.ReadyState.UNINITIALIZED;
  this.simulateReadyStateChange(goog.net.XmlHttp.ReadyState.LOADING);
***REMOVED***


***REMOVED***
***REMOVED*** Creates a new XHR object.
***REMOVED*** @return {goog.net.XhrLike.OrNative} The newly created XHR
***REMOVED***     object.
***REMOVED*** @protected
***REMOVED***
goog.testing.net.XhrIo.prototype.createXhr = function() {
  return goog.net.XmlHttp();
***REMOVED***


***REMOVED***
***REMOVED*** Simulates changing to the new ready state.
***REMOVED*** @param {number} readyState Ready state to change to.
***REMOVED***
goog.testing.net.XhrIo.prototype.simulateReadyStateChange =
    function(readyState) {
  if (readyState < this.readyState_) {
    throw Error('Readystate cannot go backwards');
  }

  // INTERACTIVE can be dispatched repeatedly as more data is reported.
  if (readyState == goog.net.XmlHttp.ReadyState.INTERACTIVE &&
      readyState == this.readyState_) {
    this.dispatchEvent(goog.net.EventType.READY_STATE_CHANGE);
    return;
  }

  while (this.readyState_ < readyState) {
    this.readyState_++;
    this.dispatchEvent(goog.net.EventType.READY_STATE_CHANGE);

    if (this.readyState_ == goog.net.XmlHttp.ReadyState.COMPLETE) {
      this.active_ = false;
      this.dispatchEvent(goog.net.EventType.COMPLETE);
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** Simulate receiving some bytes but the request not fully completing, and
***REMOVED*** the XHR entering the 'INTERACTIVE' state.
***REMOVED*** @param {string} partialResponse A string to append to the response text.
***REMOVED*** @param {Object=} opt_headers Simulated response headers.
***REMOVED***
goog.testing.net.XhrIo.prototype.simulatePartialResponse =
    function(partialResponse, opt_headers) {
  this.response_ += partialResponse;
  this.responseHeaders_ = opt_headers || {***REMOVED***
  this.statusCode_ = 200;
  this.simulateReadyStateChange(goog.net.XmlHttp.ReadyState.INTERACTIVE);
***REMOVED***


***REMOVED***
***REMOVED*** Simulates receiving a response.
***REMOVED*** @param {number} statusCode Simulated status code.
***REMOVED*** @param {string|Document|null} response Simulated response.
***REMOVED*** @param {Object=} opt_headers Simulated response headers.
***REMOVED***
goog.testing.net.XhrIo.prototype.simulateResponse = function(statusCode,
    response, opt_headers) {
  this.statusCode_ = statusCode;
  this.response_ = response || '';
  this.responseHeaders_ = opt_headers || {***REMOVED***

  try {
    if (this.isSuccess()) {
      this.simulateReadyStateChange(goog.net.XmlHttp.ReadyState.COMPLETE);
      this.dispatchEvent(goog.net.EventType.SUCCESS);
    } else {
      this.lastErrorCode_ = goog.net.ErrorCode.HTTP_ERROR;
      this.lastError_ = this.getStatusText() + ' [' + this.getStatus() + ']';
      this.simulateReadyStateChange(goog.net.XmlHttp.ReadyState.COMPLETE);
      this.dispatchEvent(goog.net.EventType.ERROR);
    }
  } finally {
    this.simulateReady();
  }
***REMOVED***


***REMOVED***
***REMOVED*** Simulates the Xhr is ready for the next request.
***REMOVED***
goog.testing.net.XhrIo.prototype.simulateReady = function() {
  this.active_ = false;
  this.xhr_ = false;
  this.dispatchEvent(goog.net.EventType.READY);
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} Whether there is an active request.
***REMOVED***
goog.testing.net.XhrIo.prototype.isActive = function() {
  return !!this.xhr_;
***REMOVED***


***REMOVED***
***REMOVED*** Has the request completed.
***REMOVED*** @return {boolean} Whether the request has completed.
***REMOVED***
goog.testing.net.XhrIo.prototype.isComplete = function() {
  return this.readyState_ == goog.net.XmlHttp.ReadyState.COMPLETE;
***REMOVED***


***REMOVED***
***REMOVED*** Has the request compeleted with a success.
***REMOVED*** @return {boolean} Whether the request compeleted successfully.
***REMOVED***
goog.testing.net.XhrIo.prototype.isSuccess = function() {
  switch (this.getStatus()) {
    case goog.net.HttpStatus.OK:
    case goog.net.HttpStatus.NO_CONTENT:
    case goog.net.HttpStatus.NOT_MODIFIED:
      return true;

    default:
      return false;
  }
***REMOVED***


***REMOVED***
***REMOVED*** Returns the readystate.
***REMOVED*** @return {number} goog.net.XmlHttp.ReadyState.*.
***REMOVED***
goog.testing.net.XhrIo.prototype.getReadyState = function() {
  return this.readyState_;
***REMOVED***


***REMOVED***
***REMOVED*** Get the status from the Xhr object.  Will only return correct result when
***REMOVED*** called from the context of a callback.
***REMOVED*** @return {number} Http status.
***REMOVED***
goog.testing.net.XhrIo.prototype.getStatus = function() {
  return this.statusCode_;
***REMOVED***


***REMOVED***
***REMOVED*** Get the status text from the Xhr object.  Will only return correct result
***REMOVED*** when called from the context of a callback.
***REMOVED*** @return {string} Status text.
***REMOVED***
goog.testing.net.XhrIo.prototype.getStatusText = function() {
  return '';
***REMOVED***


***REMOVED***
***REMOVED*** Gets the last error message.
***REMOVED*** @return {goog.net.ErrorCode} Last error code.
***REMOVED***
goog.testing.net.XhrIo.prototype.getLastErrorCode = function() {
  return this.lastErrorCode_;
***REMOVED***


***REMOVED***
***REMOVED*** Gets the last error message.
***REMOVED*** @return {string} Last error message.
***REMOVED***
goog.testing.net.XhrIo.prototype.getLastError = function() {
  return this.lastError_;
***REMOVED***


***REMOVED***
***REMOVED*** Gets the last URI that was requested.
***REMOVED*** @return {string} Last URI.
***REMOVED***
goog.testing.net.XhrIo.prototype.getLastUri = function() {
  return this.lastUri_;
***REMOVED***


***REMOVED***
***REMOVED*** Gets the last HTTP method that was requested.
***REMOVED*** @return {string|undefined} Last HTTP method used by send.
***REMOVED***
goog.testing.net.XhrIo.prototype.getLastMethod = function() {
  return this.lastMethod_;
***REMOVED***


***REMOVED***
***REMOVED*** Gets the last POST content that was requested.
***REMOVED*** @return {string|undefined} Last POST content or undefined if last request was
***REMOVED***      a GET.
***REMOVED***
goog.testing.net.XhrIo.prototype.getLastContent = function() {
  return this.lastContent_;
***REMOVED***


***REMOVED***
***REMOVED*** Gets the headers of the last request.
***REMOVED*** @return {Object|goog.structs.Map|undefined} Last headers manually set in send
***REMOVED***      call or undefined if no additional headers were specified.
***REMOVED***
goog.testing.net.XhrIo.prototype.getLastRequestHeaders = function() {
  return this.lastHeaders_;
***REMOVED***


***REMOVED***
***REMOVED*** Gets the response text from the Xhr object.  Will only return correct result
***REMOVED*** when called from the context of a callback.
***REMOVED*** @return {string} Result from the server.
***REMOVED***
goog.testing.net.XhrIo.prototype.getResponseText = function() {
  return goog.isString(this.response_) ? this.response_ :
         goog.dom.xml.serialize(this.response_);
***REMOVED***


***REMOVED***
***REMOVED*** Gets the response body from the Xhr object. Will only return correct result
***REMOVED*** when called from the context of a callback.
***REMOVED*** @return {Object} Binary result from the server or null.
***REMOVED***
goog.testing.net.XhrIo.prototype.getResponseBody = function() {
  return null;
***REMOVED***


***REMOVED***
***REMOVED*** Gets the response and evaluates it as JSON from the Xhr object.  Will only
***REMOVED*** return correct result when called from the context of a callback.
***REMOVED*** @param {string=} opt_xssiPrefix Optional XSSI prefix string to use for
***REMOVED***     stripping of the response before parsing. This needs to be set only if
***REMOVED***     your backend server prepends the same prefix string to the JSON response.
***REMOVED*** @return {Object} JavaScript object.
***REMOVED***
goog.testing.net.XhrIo.prototype.getResponseJson = function(opt_xssiPrefix) {
  var responseText = this.getResponseText();
  if (opt_xssiPrefix && responseText.indexOf(opt_xssiPrefix) == 0) {
    responseText = responseText.substring(opt_xssiPrefix.length);
  }

  return goog.json.parse(responseText);
***REMOVED***


***REMOVED***
***REMOVED*** Gets the response XML from the Xhr object.  Will only return correct result
***REMOVED*** when called from the context of a callback.
***REMOVED*** @return {Document} Result from the server if it was XML.
***REMOVED***
goog.testing.net.XhrIo.prototype.getResponseXml = function() {
  // NOTE(user): I haven't found out how to check in Internet Explorer
  // whether the response is XML document, so I do it the other way around.
  return goog.isString(this.response_) ? null : this.response_;
***REMOVED***


***REMOVED***
***REMOVED*** Get the response as the type specificed by {@link #setResponseType}. At time
***REMOVED*** of writing, this is only supported in very recent versions of WebKit
***REMOVED*** (10.0.612.1 dev and later).
***REMOVED***
***REMOVED*** @return {*} The response.
***REMOVED***
goog.testing.net.XhrIo.prototype.getResponse = function() {
  return this.response_;
***REMOVED***


***REMOVED***
***REMOVED*** Get the value of the response-header with the given name from the Xhr object
***REMOVED*** Will only return correct result when called from the context of a callback
***REMOVED*** and the request has completed
***REMOVED*** @param {string} key The name of the response-header to retrieve.
***REMOVED*** @return {string|undefined} The value of the response-header named key.
***REMOVED***
goog.testing.net.XhrIo.prototype.getResponseHeader = function(key) {
  return this.isComplete() ? this.responseHeaders_[key] : undefined;
***REMOVED***


***REMOVED***
***REMOVED*** Gets the text of all the headers in the response.
***REMOVED*** Will only return correct result when called from the context of a callback
***REMOVED*** and the request has completed
***REMOVED*** @return {string} The string containing all the response headers.
***REMOVED***
goog.testing.net.XhrIo.prototype.getAllResponseHeaders = function() {
  if (!this.isComplete()) {
    return '';
  }

  var headers = [];
  goog.object.forEach(this.responseHeaders_, function(value, name) {
    headers.push(name + ': ' + value);
  });

  return headers.join('\r\n');
***REMOVED***


***REMOVED***
***REMOVED*** Returns all response headers as a key-value map.
***REMOVED*** Multiple values for the same header key can be combined into one,
***REMOVED*** separated by a comma and a space.
***REMOVED*** Note that the native getResponseHeader method for retrieving a single header
***REMOVED*** does a case insensitive match on the header name. This method does not
***REMOVED*** include any case normalization logic, it will just return a key-value
***REMOVED*** representation of the headers.
***REMOVED*** See: http://www.w3.org/TR/XMLHttpRequest/#the-getresponseheader()-method
***REMOVED*** @return {!Object.<string, string>} An object with the header keys as keys
***REMOVED***     and header values as values.
***REMOVED***
goog.testing.net.XhrIo.prototype.getResponseHeaders = function() {
  var headersObject = {***REMOVED***
  goog.object.forEach(this.responseHeaders_, function(value, key) {
    if (headersObject[key]) {
      headersObject[key] += ', ' + value;
    } else {
      headersObject[key] = value;
    }
  });
  return headersObject;
***REMOVED***
