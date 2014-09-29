// Copyright 2006 The Closure Library Authors. All Rights Reserved.
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
***REMOVED*** @fileoverview Wrapper class for handling XmlHttpRequests.
***REMOVED***
***REMOVED*** One off requests can be sent through goog.net.XhrIo.send() or an
***REMOVED*** instance can be created to send multiple requests.  Each request uses its
***REMOVED*** own XmlHttpRequest object and handles clearing of the event callback to
***REMOVED*** ensure no leaks.
***REMOVED***
***REMOVED*** XhrIo is event based, it dispatches events when a request finishes, fails or
***REMOVED*** succeeds or when the ready-state changes. The ready-state or timeout event
***REMOVED*** fires first, followed by a generic completed event. Then the abort, error,
***REMOVED*** or success event is fired as appropriate. Lastly, the ready event will fire
***REMOVED*** to indicate that the object may be used to make another request.
***REMOVED***
***REMOVED*** The error event may also be called before completed and
***REMOVED*** ready-state-change if the XmlHttpRequest.open() or .send() methods throw.
***REMOVED***
***REMOVED*** This class does not support multiple requests, queuing, or prioritization.
***REMOVED***
***REMOVED*** Tested = IE6, FF1.5, Safari, Opera 8.5
***REMOVED***
***REMOVED*** TODO(user): Error cases aren't playing nicely in Safari.
***REMOVED***
***REMOVED***


goog.provide('goog.net.XhrIo');
goog.provide('goog.net.XhrIo.ResponseType');

goog.require('goog.Timer');
goog.require('goog.array');
goog.require('goog.debug.Logger');
goog.require('goog.debug.entryPointRegistry');
***REMOVED***
goog.require('goog.events.EventTarget');
goog.require('goog.json');
goog.require('goog.net.ErrorCode');
goog.require('goog.net.EventType');
goog.require('goog.net.HttpStatus');
goog.require('goog.net.XmlHttp');
goog.require('goog.object');
goog.require('goog.structs');
goog.require('goog.structs.Map');
goog.require('goog.uri.utils');



***REMOVED***
***REMOVED*** Basic class for handling XMLHttpRequests.
***REMOVED*** @param {goog.net.XmlHttpFactory=} opt_xmlHttpFactory Factory to use when
***REMOVED***     creating XMLHttpRequest objects.
***REMOVED***
***REMOVED*** @extends {goog.events.EventTarget}
***REMOVED***
goog.net.XhrIo = function(opt_xmlHttpFactory) {
  goog.events.EventTarget.call(this);

 ***REMOVED*****REMOVED***
  ***REMOVED*** Map of default headers to add to every request, use:
  ***REMOVED*** XhrIo.headers.set(name, value)
  ***REMOVED*** @type {goog.structs.Map}
 ***REMOVED*****REMOVED***
  this.headers = new goog.structs.Map();

 ***REMOVED*****REMOVED***
  ***REMOVED*** Optional XmlHttpFactory
  ***REMOVED*** @type {goog.net.XmlHttpFactory}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.xmlHttpFactory_ = opt_xmlHttpFactory || null;
***REMOVED***
goog.inherits(goog.net.XhrIo, goog.events.EventTarget);


***REMOVED***
***REMOVED*** Response types that may be requested for XMLHttpRequests.
***REMOVED*** @enum {string}
***REMOVED*** @see http://www.w3.org/TR/XMLHttpRequest/#the-responsetype-attribute
***REMOVED***
goog.net.XhrIo.ResponseType = {
  DEFAULT: '',
  TEXT: 'text',
  DOCUMENT: 'document',
  // Not supported as of Chrome 10.0.612.1 dev
  BLOB: 'blob',
  ARRAY_BUFFER: 'arraybuffer'
***REMOVED***


***REMOVED***
***REMOVED*** A reference to the XhrIo logger
***REMOVED*** @type {goog.debug.Logger}
***REMOVED*** @private
***REMOVED***
goog.net.XhrIo.prototype.logger_ =
    goog.debug.Logger.getLogger('goog.net.XhrIo');


***REMOVED***
***REMOVED*** The Content-Type HTTP header name
***REMOVED*** @type {string}
***REMOVED***
goog.net.XhrIo.CONTENT_TYPE_HEADER = 'Content-Type';


***REMOVED***
***REMOVED*** The pattern matching the 'http' and 'https' URI schemes
***REMOVED*** @type {!RegExp}
***REMOVED***
goog.net.XhrIo.HTTP_SCHEME_PATTERN = /^https?$/i;


***REMOVED***
***REMOVED*** The Content-Type HTTP header value for a url-encoded form
***REMOVED*** @type {string}
***REMOVED***
goog.net.XhrIo.FORM_CONTENT_TYPE =
    'application/x-www-form-urlencoded;charset=utf-8';


***REMOVED***
***REMOVED*** All non-disposed instances of goog.net.XhrIo created
***REMOVED*** by {@link goog.net.XhrIo.send} are in this Array.
***REMOVED*** @see goog.net.XhrIo.cleanup
***REMOVED*** @type {Array.<goog.net.XhrIo>}
***REMOVED*** @private
***REMOVED***
goog.net.XhrIo.sendInstances_ = [];


***REMOVED***
***REMOVED*** Static send that creates a short lived instance of XhrIo to send the
***REMOVED*** request.
***REMOVED*** @see goog.net.XhrIo.cleanup
***REMOVED*** @param {string|goog.Uri} url Uri to make request to.
***REMOVED*** @param {Function=} opt_callback Callback function for when request is
***REMOVED***     complete.
***REMOVED*** @param {string=} opt_method Send method, default: GET.
***REMOVED*** @param {ArrayBuffer|Blob|Document|FormData|GearsBlob|string=} opt_content
***REMOVED***     Post data. This can be a Gears blob if the underlying HTTP request object
***REMOVED***     is a Gears HTTP request.
***REMOVED*** @param {Object|goog.structs.Map=} opt_headers Map of headers to add to the
***REMOVED***     request.
***REMOVED*** @param {number=} opt_timeoutInterval Number of milliseconds after which an
***REMOVED***     incomplete request will be aborted; 0 means no timeout is set.
***REMOVED*** @param {boolean=} opt_withCredentials Whether to send credentials with the
***REMOVED***     request. Default to false. See {@link goog.net.XhrIo#setWithCredentials}.
***REMOVED***
goog.net.XhrIo.send = function(url, opt_callback, opt_method, opt_content,
                               opt_headers, opt_timeoutInterval,
                               opt_withCredentials) {
  var x = new goog.net.XhrIo();
  goog.net.XhrIo.sendInstances_.push(x);
  if (opt_callback) {
  ***REMOVED***x, goog.net.EventType.COMPLETE, opt_callback);
  }
***REMOVED***x,
                     goog.net.EventType.READY,
                     goog.partial(goog.net.XhrIo.cleanupSend_, x));
  if (opt_timeoutInterval) {
    x.setTimeoutInterval(opt_timeoutInterval);
  }
  if (opt_withCredentials) {
    x.setWithCredentials(opt_withCredentials);
  }
  x.send(url, opt_method, opt_content, opt_headers);
***REMOVED***


***REMOVED***
***REMOVED*** Disposes all non-disposed instances of goog.net.XhrIo created by
***REMOVED*** {@link goog.net.XhrIo.send}.
***REMOVED*** {@link goog.net.XhrIo.send} cleans up the goog.net.XhrIo instance
***REMOVED*** it creates when the request completes or fails.  However, if
***REMOVED*** the request never completes, then the goog.net.XhrIo is not disposed.
***REMOVED*** This can occur if the window is unloaded before the request completes.
***REMOVED*** We could have {@link goog.net.XhrIo.send} return the goog.net.XhrIo
***REMOVED*** it creates and make the client of {@link goog.net.XhrIo.send} be
***REMOVED*** responsible for disposing it in this case.  However, this makes things
***REMOVED*** significantly more complicated for the client, and the whole point
***REMOVED*** of {@link goog.net.XhrIo.send} is that it's simple and easy to use.
***REMOVED*** Clients of {@link goog.net.XhrIo.send} should call
***REMOVED*** {@link goog.net.XhrIo.cleanup} when doing final
***REMOVED*** cleanup on window unload.
***REMOVED***
goog.net.XhrIo.cleanup = function() {
  var instances = goog.net.XhrIo.sendInstances_;
  while (instances.length) {
    instances.pop().dispose();
  }
***REMOVED***


***REMOVED***
***REMOVED*** Installs exception protection for all entry point introduced by
***REMOVED*** goog.net.XhrIo instances which are not protected by
***REMOVED*** {@link goog.debug.ErrorHandler#protectWindowSetTimeout},
***REMOVED*** {@link goog.debug.ErrorHandler#protectWindowSetInterval}, or
***REMOVED*** {@link goog.events.protectBrowserEventEntryPoint}.
***REMOVED***
***REMOVED*** @param {goog.debug.ErrorHandler} errorHandler Error handler with which to
***REMOVED***     protect the entry point(s).
***REMOVED***
goog.net.XhrIo.protectEntryPoints = function(errorHandler) {
  goog.net.XhrIo.prototype.onReadyStateChangeEntryPoint_ =
      errorHandler.protectEntryPoint(
          goog.net.XhrIo.prototype.onReadyStateChangeEntryPoint_);
***REMOVED***


***REMOVED***
***REMOVED*** Disposes of the specified goog.net.XhrIo created by
***REMOVED*** {@link goog.net.XhrIo.send} and removes it from
***REMOVED*** {@link goog.net.XhrIo.pendingStaticSendInstances_}.
***REMOVED*** @param {goog.net.XhrIo} XhrIo An XhrIo created by
***REMOVED***     {@link goog.net.XhrIo.send}.
***REMOVED*** @private
***REMOVED***
goog.net.XhrIo.cleanupSend_ = function(XhrIo) {
  XhrIo.dispose();
  goog.array.remove(goog.net.XhrIo.sendInstances_, XhrIo);
***REMOVED***


***REMOVED***
***REMOVED*** Whether XMLHttpRequest is active.  A request is active from the time send()
***REMOVED*** is called until onReadyStateChange() is complete, or error() or abort()
***REMOVED*** is called.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.net.XhrIo.prototype.active_ = false;


***REMOVED***
***REMOVED*** Reference to an XMLHttpRequest object that is being used for the transfer.
***REMOVED*** @type {XMLHttpRequest|GearsHttpRequest}
***REMOVED*** @private
***REMOVED***
goog.net.XhrIo.prototype.xhr_ = null;


***REMOVED***
***REMOVED*** The options to use with the current XMLHttpRequest object.
***REMOVED*** @type {Object}
***REMOVED*** @private
***REMOVED***
goog.net.XhrIo.prototype.xhrOptions_ = null;


***REMOVED***
***REMOVED*** Last URL that was requested.
***REMOVED*** @type {string|goog.Uri}
***REMOVED*** @private
***REMOVED***
goog.net.XhrIo.prototype.lastUri_ = '';


***REMOVED***
***REMOVED*** Method for the last request.
***REMOVED*** @type {string}
***REMOVED*** @private
***REMOVED***
goog.net.XhrIo.prototype.lastMethod_ = '';


***REMOVED***
***REMOVED*** Last error code.
***REMOVED*** @type {goog.net.ErrorCode}
***REMOVED*** @private
***REMOVED***
goog.net.XhrIo.prototype.lastErrorCode_ = goog.net.ErrorCode.NO_ERROR;


***REMOVED***
***REMOVED*** Last error message.
***REMOVED*** @type {Error|string}
***REMOVED*** @private
***REMOVED***
goog.net.XhrIo.prototype.lastError_ = '';


***REMOVED***
***REMOVED*** This is used to ensure that we don't dispatch an multiple ERROR events. This
***REMOVED*** can happen in IE when it does a synchronous load and one error is handled in
***REMOVED*** the ready statte change and one is handled due to send() throwing an
***REMOVED*** exception.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.net.XhrIo.prototype.errorDispatched_ = false;


***REMOVED***
***REMOVED*** Used to make sure we don't fire the complete event from inside a send call.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.net.XhrIo.prototype.inSend_ = false;


***REMOVED***
***REMOVED*** Used in determining if a call to {@link #onReadyStateChange_} is from within
***REMOVED*** a call to this.xhr_.open.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.net.XhrIo.prototype.inOpen_ = false;


***REMOVED***
***REMOVED*** Used in determining if a call to {@link #onReadyStateChange_} is from within
***REMOVED*** a call to this.xhr_.abort.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.net.XhrIo.prototype.inAbort_ = false;


***REMOVED***
***REMOVED*** Number of milliseconds after which an incomplete request will be aborted and
***REMOVED*** a {@link goog.net.EventType.TIMEOUT} event raised; 0 means no timeout is set.
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.net.XhrIo.prototype.timeoutInterval_ = 0;


***REMOVED***
***REMOVED*** Window timeout ID used to cancel the timeout event handler if the request
***REMOVED*** completes successfully.
***REMOVED*** @type {Object}
***REMOVED*** @private
***REMOVED***
goog.net.XhrIo.prototype.timeoutId_ = null;


***REMOVED***
***REMOVED*** The requested type for the response. The empty string means use the default
***REMOVED*** XHR behavior.
***REMOVED*** @type {goog.net.XhrIo.ResponseType}
***REMOVED*** @private
***REMOVED***
goog.net.XhrIo.prototype.responseType_ = goog.net.XhrIo.ResponseType.DEFAULT;


***REMOVED***
***REMOVED*** Whether a "credentialed" request is to be sent (one that is aware of cookies
***REMOVED*** and authentication) . This is applicable only for cross-domain requests and
***REMOVED*** more recent browsers that support this part of the HTTP Access Control
***REMOVED*** standard.
***REMOVED***
***REMOVED*** @see http://www.w3.org/TR/XMLHttpRequest/#the-withcredentials-attribute
***REMOVED***
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.net.XhrIo.prototype.withCredentials_ = false;


***REMOVED***
***REMOVED*** Returns the number of milliseconds after which an incomplete request will be
***REMOVED*** aborted, or 0 if no timeout is set.
***REMOVED*** @return {number} Timeout interval in milliseconds.
***REMOVED***
goog.net.XhrIo.prototype.getTimeoutInterval = function() {
  return this.timeoutInterval_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the number of milliseconds after which an incomplete request will be
***REMOVED*** aborted and a {@link goog.net.EventType.TIMEOUT} event raised; 0 means no
***REMOVED*** timeout is set.
***REMOVED*** @param {number} ms Timeout interval in milliseconds; 0 means none.
***REMOVED***
goog.net.XhrIo.prototype.setTimeoutInterval = function(ms) {
  this.timeoutInterval_ = Math.max(0, ms);
***REMOVED***


***REMOVED***
***REMOVED*** Sets the desired type for the response. At time of writing, this is only
***REMOVED*** supported in very recent versions of WebKit (10.0.612.1 dev and later).
***REMOVED***
***REMOVED*** If this is used, the response may only be accessed via {@link #getResponse}.
***REMOVED***
***REMOVED*** @param {goog.net.XhrIo.ResponseType} type The desired type for the response.
***REMOVED***
goog.net.XhrIo.prototype.setResponseType = function(type) {
  this.responseType_ = type;
***REMOVED***


***REMOVED***
***REMOVED*** Gets the desired type for the response.
***REMOVED*** @return {goog.net.XhrIo.ResponseType} The desired type for the response.
***REMOVED***
goog.net.XhrIo.prototype.getResponseType = function() {
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
goog.net.XhrIo.prototype.setWithCredentials = function(withCredentials) {
  this.withCredentials_ = withCredentials;
***REMOVED***


***REMOVED***
***REMOVED*** Gets whether a "credentialed" request is to be sent.
***REMOVED*** @return {boolean} The desired type for the response.
***REMOVED***
goog.net.XhrIo.prototype.getWithCredentials = function() {
  return this.withCredentials_;
***REMOVED***


***REMOVED***
***REMOVED*** Instance send that actually uses XMLHttpRequest to make a server call.
***REMOVED*** @param {string|goog.Uri} url Uri to make request to.
***REMOVED*** @param {string=} opt_method Send method, default: GET.
***REMOVED*** @param {ArrayBuffer|Blob|Document|FormData|GearsBlob|string=} opt_content
***REMOVED***     Post data. This can be a Gears blob if the underlying HTTP request object
***REMOVED***     is a Gears HTTP request.
***REMOVED*** @param {Object|goog.structs.Map=} opt_headers Map of headers to add to the
***REMOVED***     request.
***REMOVED***
goog.net.XhrIo.prototype.send = function(url, opt_method, opt_content,
                                         opt_headers) {
  if (this.xhr_) {
    throw Error('[goog.net.XhrIo] Object is active with another request=' +
        this.lastUri_ + '; newUri=' + url);
  }

  var method = opt_method ? opt_method.toUpperCase() : 'GET';

  this.lastUri_ = url;
  this.lastError_ = '';
  this.lastErrorCode_ = goog.net.ErrorCode.NO_ERROR;
  this.lastMethod_ = method;
  this.errorDispatched_ = false;
  this.active_ = true;

  // Use the factory to create the XHR object and options
  this.xhr_ = this.createXhr();
  this.xhrOptions_ = this.xmlHttpFactory_ ?
      this.xmlHttpFactory_.getOptions() : goog.net.XmlHttp.getOptions();

  // Set up the onreadystatechange callback
  this.xhr_.onreadystatechange = goog.bind(this.onReadyStateChange_, this);

 ***REMOVED*****REMOVED***
  ***REMOVED*** Try to open the XMLHttpRequest (always async), if an error occurs here it
  ***REMOVED*** is generally permission denied
  ***REMOVED*** @preserveTry
 ***REMOVED*****REMOVED***
  try {
    this.logger_.fine(this.formatMsg_('Opening Xhr'));
    this.inOpen_ = true;
    this.xhr_.open(method, url, true);  // Always async!
    this.inOpen_ = false;
  } catch (err) {
    this.logger_.fine(this.formatMsg_('Error opening Xhr: ' + err.message));
    this.error_(goog.net.ErrorCode.EXCEPTION, err);
    return;
  }

  // We can't use null since this won't allow POSTs to have a content length
  // specified which will cause some proxies to return a 411 error.
  var content = opt_content || '';

  var headers = this.headers.clone();

  // Add headers specific to this request
  if (opt_headers) {
    goog.structs.forEach(opt_headers, function(value, key) {
      headers.set(key, value);
    });
  }

  var contentIsFormData = (goog.global['FormData'] &&
      (content instanceof goog.global['FormData']));
  if (method == 'POST' &&
      !headers.containsKey(goog.net.XhrIo.CONTENT_TYPE_HEADER) &&
      !contentIsFormData) {
    // For POST requests, default to the url-encoded form content type
    // unless this is a FormData request.  For FormData, the browser will
    // automatically add a multipart/form-data content type with an appropriate
    // multipart boundary.
    headers.set(goog.net.XhrIo.CONTENT_TYPE_HEADER,
                goog.net.XhrIo.FORM_CONTENT_TYPE);
  }

  // Add the headers to the Xhr object
  goog.structs.forEach(headers, function(value, key) {
    this.xhr_.setRequestHeader(key, value);
  }, this);

  if (this.responseType_) {
    this.xhr_.responseType = this.responseType_;
  }

  if (goog.object.containsKey(this.xhr_, 'withCredentials')) {
    this.xhr_.withCredentials = this.withCredentials_;
  }

 ***REMOVED*****REMOVED***
  ***REMOVED*** Try to send the request, or other wise report an error (404 not found).
  ***REMOVED*** @preserveTry
 ***REMOVED*****REMOVED***
  try {
    if (this.timeoutId_) {
      // This should never happen, since the if (this.active_) above shouldn't
      // let execution reach this point if there is a request in progress...
      goog.Timer.defaultTimerObject.clearTimeout(this.timeoutId_);
      this.timeoutId_ = null;
    }
    if (this.timeoutInterval_ > 0) {
      this.logger_.fine(this.formatMsg_('Will abort after ' +
          this.timeoutInterval_ + 'ms if incomplete'));
      this.timeoutId_ = goog.Timer.defaultTimerObject.setTimeout(
          goog.bind(this.timeout_, this), this.timeoutInterval_);
    }
    this.logger_.fine(this.formatMsg_('Sending request'));
    this.inSend_ = true;
    this.xhr_.send(content);
    this.inSend_ = false;

  } catch (err) {
    this.logger_.fine(this.formatMsg_('Send error: ' + err.message));
    this.error_(goog.net.ErrorCode.EXCEPTION, err);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Creates a new XHR object.
***REMOVED*** @return {XMLHttpRequest|GearsHttpRequest} The newly created XHR object.
***REMOVED*** @protected
***REMOVED***
goog.net.XhrIo.prototype.createXhr = function() {
  return this.xmlHttpFactory_ ?
      this.xmlHttpFactory_.createInstance() : goog.net.XmlHttp();
***REMOVED***


***REMOVED***
***REMOVED*** The request didn't complete after {@link goog.net.XhrIo#timeoutInterval_}
***REMOVED*** milliseconds; raises a {@link goog.net.EventType.TIMEOUT} event and aborts
***REMOVED*** the request.
***REMOVED*** @private
***REMOVED***
goog.net.XhrIo.prototype.timeout_ = function() {
  if (typeof goog == 'undefined') {
    // If goog is undefined then the callback has occurred as the application
    // is unloading and will error.  Thus we let it silently fail.
  } else if (this.xhr_) {
    this.lastError_ = 'Timed out after ' + this.timeoutInterval_ +
                      'ms, aborting';
    this.lastErrorCode_ = goog.net.ErrorCode.TIMEOUT;
    this.logger_.fine(this.formatMsg_(this.lastError_));
    this.dispatchEvent(goog.net.EventType.TIMEOUT);
    this.abort(goog.net.ErrorCode.TIMEOUT);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Something errorred, so inactivate, fire error callback and clean up
***REMOVED*** @param {goog.net.ErrorCode} errorCode The error code.
***REMOVED*** @param {Error} err The error object.
***REMOVED*** @private
***REMOVED***
goog.net.XhrIo.prototype.error_ = function(errorCode, err) {
  this.active_ = false;
  if (this.xhr_) {
    this.inAbort_ = true;
    this.xhr_.abort();  // Ensures XHR isn't hung (FF)
    this.inAbort_ = false;
  }
  this.lastError_ = err;
  this.lastErrorCode_ = errorCode;
  this.dispatchErrors_();
  this.cleanUpXhr_();
***REMOVED***


***REMOVED***
***REMOVED*** Dispatches COMPLETE and ERROR in case of an error. This ensures that we do
***REMOVED*** not dispatch multiple error events.
***REMOVED*** @private
***REMOVED***
goog.net.XhrIo.prototype.dispatchErrors_ = function() {
  if (!this.errorDispatched_) {
    this.errorDispatched_ = true;
    this.dispatchEvent(goog.net.EventType.COMPLETE);
    this.dispatchEvent(goog.net.EventType.ERROR);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Abort the current XMLHttpRequest
***REMOVED*** @param {goog.net.ErrorCode=} opt_failureCode Optional error code to use -
***REMOVED***     defaults to ABORT.
***REMOVED***
goog.net.XhrIo.prototype.abort = function(opt_failureCode) {
  if (this.xhr_ && this.active_) {
    this.logger_.fine(this.formatMsg_('Aborting'));
    this.active_ = false;
    this.inAbort_ = true;
    this.xhr_.abort();
    this.inAbort_ = false;
    this.lastErrorCode_ = opt_failureCode || goog.net.ErrorCode.ABORT;
    this.dispatchEvent(goog.net.EventType.COMPLETE);
    this.dispatchEvent(goog.net.EventType.ABORT);
    this.cleanUpXhr_();
  }
***REMOVED***


***REMOVED***
***REMOVED*** Nullifies all callbacks to reduce risks of leaks.
***REMOVED*** @override
***REMOVED*** @protected
***REMOVED***
goog.net.XhrIo.prototype.disposeInternal = function() {
  if (this.xhr_) {
    // We explicitly do not call xhr_.abort() unless active_ is still true.
    // This is to avoid unnecessarily aborting a successful request when
    // dispose() is called in a callback triggered by a complete response, but
    // in which browser cleanup has not yet finished.
    // (See http://b/issue?id=1684217.)
    if (this.active_) {
      this.active_ = false;
      this.inAbort_ = true;
      this.xhr_.abort();
      this.inAbort_ = false;
    }
    this.cleanUpXhr_(true);
  }

  goog.net.XhrIo.superClass_.disposeInternal.call(this);
***REMOVED***


***REMOVED***
***REMOVED*** Internal handler for the XHR object's readystatechange event.  This method
***REMOVED*** checks the status and the readystate and fires the correct callbacks.
***REMOVED*** If the request has ended, the handlers are cleaned up and the XHR object is
***REMOVED*** nullified.
***REMOVED*** @private
***REMOVED***
goog.net.XhrIo.prototype.onReadyStateChange_ = function() {
  if (!this.inOpen_ && !this.inSend_ && !this.inAbort_) {
    // Were not being called from within a call to this.xhr_.send
    // this.xhr_.abort, or this.xhr_.open, so this is an entry point
    this.onReadyStateChangeEntryPoint_();
  } else {
    this.onReadyStateChangeHelper_();
  }
***REMOVED***


***REMOVED***
***REMOVED*** Used to protect the onreadystatechange handler entry point.  Necessary
***REMOVED*** as {#onReadyStateChange_} maybe called from within send or abort, this
***REMOVED*** method is only called when {#onReadyStateChange_} is called as an
***REMOVED*** entry point.
***REMOVED*** {@see #protectEntryPoints}
***REMOVED*** @private
***REMOVED***
goog.net.XhrIo.prototype.onReadyStateChangeEntryPoint_ = function() {
  this.onReadyStateChangeHelper_();
***REMOVED***


***REMOVED***
***REMOVED*** Helper for {@link #onReadyStateChange_}.  This is used so that
***REMOVED*** entry point calls to {@link #onReadyStateChange_} can be routed through
***REMOVED*** {@link #onReadyStateChangeEntryPoint_}.
***REMOVED*** @private
***REMOVED***
goog.net.XhrIo.prototype.onReadyStateChangeHelper_ = function() {
  if (!this.active_) {
    // can get called inside abort call
    return;
  }

  if (typeof goog == 'undefined') {
    // NOTE(user): If goog is undefined then the callback has occurred as the
    // application is unloading and will error.  Thus we let it silently fail.

  } else if (
      this.xhrOptions_[goog.net.XmlHttp.OptionType.LOCAL_REQUEST_ERROR] &&
      this.getReadyState() == goog.net.XmlHttp.ReadyState.COMPLETE &&
      this.getStatus() == 2) {
    // NOTE(user): In IE if send() errors on a***REMOVED***local* request the readystate
    // is still changed to COMPLETE.  We need to ignore it and allow the
    // try/catch around send() to pick up the error.
    this.logger_.fine(this.formatMsg_(
        'Local request error detected and ignored'));

  } else {

    // In IE when the response has been cached we sometimes get the callback
    // from inside the send call and this usually breaks code that assumes that
    // XhrIo is asynchronous.  If that is the case we delay the callback
    // using a timer.
    if (this.inSend_ &&
        this.getReadyState() == goog.net.XmlHttp.ReadyState.COMPLETE) {
      goog.Timer.defaultTimerObject.setTimeout(
          goog.bind(this.onReadyStateChange_, this), 0);
      return;
    }

    this.dispatchEvent(goog.net.EventType.READY_STATE_CHANGE);

    // readyState indicates the transfer has finished
    if (this.isComplete()) {
      this.logger_.fine(this.formatMsg_('Request complete'));

      this.active_ = false;

      try {
        // Call the specific callbacks for success or failure. Only call the
        // success if the status is 200 (HTTP_OK) or 304 (HTTP_CACHED)
        if (this.isSuccess()) {
          this.dispatchEvent(goog.net.EventType.COMPLETE);
          this.dispatchEvent(goog.net.EventType.SUCCESS);
        } else {
          this.lastErrorCode_ = goog.net.ErrorCode.HTTP_ERROR;
          this.lastError_ =
              this.getStatusText() + ' [' + this.getStatus() + ']';
          this.dispatchErrors_();
        }
      } finally {
        this.cleanUpXhr_();
      }
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** Remove the listener to protect against leaks, and nullify the XMLHttpRequest
***REMOVED*** object.
***REMOVED*** @param {boolean=} opt_fromDispose If this is from the dispose (don't want to
***REMOVED***     fire any events).
***REMOVED*** @private
***REMOVED***
goog.net.XhrIo.prototype.cleanUpXhr_ = function(opt_fromDispose) {
  if (this.xhr_) {
    // Save reference so we can mark it as closed after the READY event.  The
    // READY event may trigger another request, thus we must nullify this.xhr_
    var xhr = this.xhr_;
    var clearedOnReadyStateChange =
        this.xhrOptions_[goog.net.XmlHttp.OptionType.USE_NULL_FUNCTION] ?
            goog.nullFunction : null;
    this.xhr_ = null;
    this.xhrOptions_ = null;

    if (this.timeoutId_) {
      // Cancel any pending timeout event handler.
      goog.Timer.defaultTimerObject.clearTimeout(this.timeoutId_);
      this.timeoutId_ = null;
    }

    if (!opt_fromDispose) {
      this.dispatchEvent(goog.net.EventType.READY);
    }

    try {
      // NOTE(user): Not nullifying in FireFox can still leak if the callbacks
      // are defined in the same scope as the instance of XhrIo. But, IE doesn't
      // allow you to set the onreadystatechange to NULL so nullFunction is
      // used.
      xhr.onreadystatechange = clearedOnReadyStateChange;
    } catch (e) {
      // This seems to occur with a Gears HTTP request. Delayed the setting of
      // this onreadystatechange until after READY is sent out and catching the
      // error to see if we can track down the problem.
      this.logger_.severe('Problem encountered resetting onreadystatechange: ' +
                          e.message);
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} Whether there is an active request.
***REMOVED***
goog.net.XhrIo.prototype.isActive = function() {
  return !!this.xhr_;
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} Whether the request has completed.
***REMOVED***
goog.net.XhrIo.prototype.isComplete = function() {
  return this.getReadyState() == goog.net.XmlHttp.ReadyState.COMPLETE;
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} Whether the request completed with a success.
***REMOVED***
goog.net.XhrIo.prototype.isSuccess = function() {
  var status = this.getStatus();
  // A zero status code is considered successful for local files.
  return goog.net.HttpStatus.isSuccess(status) ||
      status === 0 && !this.isLastUriEffectiveSchemeHttp_();
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} whether the effective scheme of the last URI that was
***REMOVED***     fetched was 'http' or 'https'.
***REMOVED*** @private
***REMOVED***
goog.net.XhrIo.prototype.isLastUriEffectiveSchemeHttp_ = function() {
  var scheme = goog.uri.utils.getEffectiveScheme(String(this.lastUri_));
  return goog.net.XhrIo.HTTP_SCHEME_PATTERN.test(scheme);
***REMOVED***


***REMOVED***
***REMOVED*** Get the readystate from the Xhr object
***REMOVED*** Will only return correct result when called from the context of a callback
***REMOVED*** @return {goog.net.XmlHttp.ReadyState} goog.net.XmlHttp.ReadyState.*.
***REMOVED***
goog.net.XhrIo.prototype.getReadyState = function() {
  return this.xhr_ ?
     ***REMOVED*****REMOVED*** @type {goog.net.XmlHttp.ReadyState}***REMOVED*** (this.xhr_.readyState) :
      goog.net.XmlHttp.ReadyState.UNINITIALIZED;
***REMOVED***


***REMOVED***
***REMOVED*** Get the status from the Xhr object
***REMOVED*** Will only return correct result when called from the context of a callback
***REMOVED*** @return {number} Http status.
***REMOVED***
goog.net.XhrIo.prototype.getStatus = function() {
 ***REMOVED*****REMOVED***
  ***REMOVED*** IE doesn't like you checking status until the readystate is greater than 2
  ***REMOVED*** (i.e. it is recieving or complete).  The try/catch is used for when the
  ***REMOVED*** page is unloading and an ERROR_NOT_AVAILABLE may occur when accessing xhr_.
  ***REMOVED*** @preserveTry
 ***REMOVED*****REMOVED***
  try {
    return this.getReadyState() > goog.net.XmlHttp.ReadyState.LOADED ?
        this.xhr_.status : -1;
  } catch (e) {
    this.logger_.warning('Can not get status: ' + e.message);
    return -1;
  }
***REMOVED***


***REMOVED***
***REMOVED*** Get the status text from the Xhr object
***REMOVED*** Will only return correct result when called from the context of a callback
***REMOVED*** @return {string} Status text.
***REMOVED***
goog.net.XhrIo.prototype.getStatusText = function() {
 ***REMOVED*****REMOVED***
  ***REMOVED*** IE doesn't like you checking status until the readystate is greater than 2
  ***REMOVED*** (i.e. it is recieving or complete).  The try/catch is used for when the
  ***REMOVED*** page is unloading and an ERROR_NOT_AVAILABLE may occur when accessing xhr_.
  ***REMOVED*** @preserveTry
 ***REMOVED*****REMOVED***
  try {
    return this.getReadyState() > goog.net.XmlHttp.ReadyState.LOADED ?
        this.xhr_.statusText : '';
  } catch (e) {
    this.logger_.fine('Can not get status: ' + e.message);
    return '';
  }
***REMOVED***


***REMOVED***
***REMOVED*** Get the last Uri that was requested
***REMOVED*** @return {string} Last Uri.
***REMOVED***
goog.net.XhrIo.prototype.getLastUri = function() {
  return String(this.lastUri_);
***REMOVED***


***REMOVED***
***REMOVED*** Get the response text from the Xhr object
***REMOVED*** Will only return correct result when called from the context of a callback.
***REMOVED*** @return {string} Result from the server, or '' if no result available.
***REMOVED***
goog.net.XhrIo.prototype.getResponseText = function() {
 ***REMOVED*****REMOVED*** @preserveTry***REMOVED***
  try {
    return this.xhr_ ? this.xhr_.responseText : '';
  } catch (e) {
    // http://www.w3.org/TR/XMLHttpRequest/#the-responsetext-attribute
    // states that responseText should return '' (and responseXML null)
    // when the state is not LOADING or DONE. Instead, IE and Gears can
    // throw unexpected exceptions, for example when a request is aborted
    // or no data is available yet.
    this.logger_.fine('Can not get responseText: ' + e.message);
    return '';
  }
***REMOVED***


***REMOVED***
***REMOVED*** Get the response body from the Xhr object. This property is only available
***REMOVED*** in IE since version 7 according to MSDN:
***REMOVED*** http://msdn.microsoft.com/en-us/library/ie/ms534368(v=vs.85).aspx
***REMOVED*** Will only return correct result when called from the context of a callback.
***REMOVED***
***REMOVED*** One option is to construct a VBArray from the returned object and convert
***REMOVED*** it to a JavaScript array using the toArray method:
***REMOVED*** {@code (new window['VBArray'](xhrIo.getResponseBody())).toArray()}
***REMOVED*** This will result in an array of numbers in the range of [0..255]
***REMOVED***
***REMOVED*** Another option is to use the VBScript CStr method to convert it into a
***REMOVED*** string as outlined in http://stackoverflow.com/questions/1919972
***REMOVED***
***REMOVED*** @return {Object} Binary result from the server or null if not available.
***REMOVED***
goog.net.XhrIo.prototype.getResponseBody = function() {
 ***REMOVED*****REMOVED*** @preserveTry***REMOVED***
  try {
    if (this.xhr_ && 'responseBody' in this.xhr_) {
      return this.xhr_['responseBody'];
    }
  } catch (e) {
    // IE can throw unexpected exceptions, for example when a request is aborted
    // or no data is yet available.
    this.logger_.fine('Can not get responseBody: ' + e.message);
  }
  return null;
***REMOVED***


***REMOVED***
***REMOVED*** Get the response XML from the Xhr object
***REMOVED*** Will only return correct result when called from the context of a callback.
***REMOVED*** @return {Document} The DOM Document representing the XML file, or null
***REMOVED*** if no result available.
***REMOVED***
goog.net.XhrIo.prototype.getResponseXml = function() {
 ***REMOVED*****REMOVED*** @preserveTry***REMOVED***
  try {
    return this.xhr_ ? this.xhr_.responseXML : null;
  } catch (e) {
    this.logger_.fine('Can not get responseXML: ' + e.message);
    return null;
  }
***REMOVED***


***REMOVED***
***REMOVED*** Get the response and evaluates it as JSON from the Xhr object
***REMOVED*** Will only return correct result when called from the context of a callback
***REMOVED*** @param {string=} opt_xssiPrefix Optional XSSI prefix string to use for
***REMOVED***     stripping of the response before parsing. This needs to be set only if
***REMOVED***     your backend server prepends the same prefix string to the JSON response.
***REMOVED*** @return {Object|undefined} JavaScript object.
***REMOVED***
goog.net.XhrIo.prototype.getResponseJson = function(opt_xssiPrefix) {
  if (!this.xhr_) {
    return undefined;
  }

  var responseText = this.xhr_.responseText;
  if (opt_xssiPrefix && responseText.indexOf(opt_xssiPrefix) == 0) {
    responseText = responseText.substring(opt_xssiPrefix.length);
  }

  return goog.json.parse(responseText);
***REMOVED***


***REMOVED***
***REMOVED*** Get the response as the type specificed by {@link #setResponseType}. At time
***REMOVED*** of writing, this is only directly supported in very recent versions of WebKit
***REMOVED*** (10.0.612.1 dev and later). If the field is not supported directly, we will
***REMOVED*** try to emulate it.
***REMOVED***
***REMOVED*** Emulating the response means following the rules laid out at
***REMOVED*** http://www.w3.org/TR/XMLHttpRequest/#the-response-attribute
***REMOVED***
***REMOVED*** On browsers with no support for this (Chrome < 10, Firefox < 4, etc), only
***REMOVED*** response types of DEFAULT or TEXT may be used, and the response returned will
***REMOVED*** be the text response.
***REMOVED***
***REMOVED*** On browsers with Mozilla's draft support for array buffers (Firefox 4, 5),
***REMOVED*** only response types of DEFAULT, TEXT, and ARRAY_BUFFER may be used, and the
***REMOVED*** response returned will be either the text response or the Mozilla
***REMOVED*** implementation of the array buffer response.
***REMOVED***
***REMOVED*** On browsers will full support, any valid response type supported by the
***REMOVED*** browser may be used, and the response provided by the browser will be
***REMOVED*** returned.
***REMOVED***
***REMOVED*** @return {*} The response.
***REMOVED***
goog.net.XhrIo.prototype.getResponse = function() {
 ***REMOVED*****REMOVED*** @preserveTry***REMOVED***
  try {
    if (!this.xhr_) {
      return null;
    }
    if ('response' in this.xhr_) {
      return this.xhr_.response;
    }
    switch (this.responseType_) {
      case goog.net.XhrIo.ResponseType.DEFAULT:
      case goog.net.XhrIo.ResponseType.TEXT:
        return this.xhr_.responseText;
        // DOCUMENT and BLOB don't need to be handled here because they are
        // introduced in the same spec that adds the .response field, and would
        // have been caught above.
        // ARRAY_BUFFER needs an implementation for Firefox 4, where it was
        // implemented using a draft spec rather than the final spec.
      case goog.net.XhrIo.ResponseType.ARRAY_BUFFER:
        if ('mozResponseArrayBuffer' in this.xhr_) {
          return this.xhr_.mozResponseArrayBuffer;
        }
    }
    // Fell through to a response type that is not supported on this browser.
    this.logger_.severe('Response type ' + this.responseType_ + ' is not ' +
                        'supported on this browser');
    return null;
  } catch (e) {
    this.logger_.fine('Can not get response: ' + e.message);
    return null;
  }
***REMOVED***


***REMOVED***
***REMOVED*** Get the value of the response-header with the given name from the Xhr object
***REMOVED*** Will only return correct result when called from the context of a callback
***REMOVED*** and the request has completed
***REMOVED*** @param {string} key The name of the response-header to retrieve.
***REMOVED*** @return {string|undefined} The value of the response-header named key.
***REMOVED***
goog.net.XhrIo.prototype.getResponseHeader = function(key) {
  return this.xhr_ && this.isComplete() ?
      this.xhr_.getResponseHeader(key) : undefined;
***REMOVED***


***REMOVED***
***REMOVED*** Gets the text of all the headers in the response.
***REMOVED*** Will only return correct result when called from the context of a callback
***REMOVED*** and the request has completed.
***REMOVED*** @return {string} The value of the response headers or empty string.
***REMOVED***
goog.net.XhrIo.prototype.getAllResponseHeaders = function() {
  return this.xhr_ && this.isComplete() ?
      this.xhr_.getAllResponseHeaders() : '';
***REMOVED***


***REMOVED***
***REMOVED*** Get the last error message
***REMOVED*** @return {goog.net.ErrorCode} Last error code.
***REMOVED***
goog.net.XhrIo.prototype.getLastErrorCode = function() {
  return this.lastErrorCode_;
***REMOVED***


***REMOVED***
***REMOVED*** Get the last error message
***REMOVED*** @return {string} Last error message.
***REMOVED***
goog.net.XhrIo.prototype.getLastError = function() {
  return goog.isString(this.lastError_) ? this.lastError_ :
      String(this.lastError_);
***REMOVED***


***REMOVED***
***REMOVED*** Adds the last method, status and URI to the message.  This is used to add
***REMOVED*** this information to the logging calls.
***REMOVED*** @param {string} msg The message text that we want to add the extra text to.
***REMOVED*** @return {string} The message with the extra text appended.
***REMOVED*** @private
***REMOVED***
goog.net.XhrIo.prototype.formatMsg_ = function(msg) {
  return msg + ' [' + this.lastMethod_ + ' ' + this.lastUri_ + ' ' +
      this.getStatus() + ']';
***REMOVED***


// Register the xhr handler as an entry point, so that
// it can be monitored for exception handling, etc.
goog.debug.entryPointRegistry.register(
   ***REMOVED*****REMOVED***
    ***REMOVED*** @param {function(!Function): !Function} transformer The transforming
    ***REMOVED***     function.
   ***REMOVED*****REMOVED***
    function(transformer) {
      goog.net.XhrIo.prototype.onReadyStateChangeEntryPoint_ =
          transformer(goog.net.XhrIo.prototype.onReadyStateChangeEntryPoint_);
    });
