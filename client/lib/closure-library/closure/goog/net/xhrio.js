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
goog.require('goog.debug.entryPointRegistry');
goog.require('goog.events.EventTarget');
goog.require('goog.json');
goog.require('goog.log');
goog.require('goog.net.ErrorCode');
goog.require('goog.net.EventType');
goog.require('goog.net.HttpStatus');
goog.require('goog.net.XmlHttp');
goog.require('goog.object');
goog.require('goog.string');
goog.require('goog.structs');
goog.require('goog.structs.Map');
goog.require('goog.uri.utils');
goog.require('goog.userAgent');



***REMOVED***
***REMOVED*** Basic class for handling XMLHttpRequests.
***REMOVED*** @param {goog.net.XmlHttpFactory=} opt_xmlHttpFactory Factory to use when
***REMOVED***     creating XMLHttpRequest objects.
***REMOVED***
***REMOVED*** @extends {goog.events.EventTarget}
***REMOVED***
goog.net.XhrIo = function(opt_xmlHttpFactory) {
  goog.net.XhrIo.base(this, 'constructor');

 ***REMOVED*****REMOVED***
  ***REMOVED*** Map of default headers to add to every request, use:
  ***REMOVED*** XhrIo.headers.set(name, value)
  ***REMOVED*** @type {!goog.structs.Map}
 ***REMOVED*****REMOVED***
  this.headers = new goog.structs.Map();

 ***REMOVED*****REMOVED***
  ***REMOVED*** Optional XmlHttpFactory
  ***REMOVED*** @private {goog.net.XmlHttpFactory}
 ***REMOVED*****REMOVED***
  this.xmlHttpFactory_ = opt_xmlHttpFactory || null;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Whether XMLHttpRequest is active.  A request is active from the time send()
  ***REMOVED*** is called until onReadyStateChange() is complete, or error() or abort()
  ***REMOVED*** is called.
  ***REMOVED*** @private {boolean}
 ***REMOVED*****REMOVED***
  this.active_ = false;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The XMLHttpRequest object that is being used for the transfer.
  ***REMOVED*** @private {?goog.net.XhrLike.OrNative}
 ***REMOVED*****REMOVED***
  this.xhr_ = null;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The options to use with the current XMLHttpRequest object.
  ***REMOVED*** @private {Object}
 ***REMOVED*****REMOVED***
  this.xhrOptions_ = null;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Last URL that was requested.
  ***REMOVED*** @private {string|goog.Uri}
 ***REMOVED*****REMOVED***
  this.lastUri_ = '';

 ***REMOVED*****REMOVED***
  ***REMOVED*** Method for the last request.
  ***REMOVED*** @private {string}
 ***REMOVED*****REMOVED***
  this.lastMethod_ = '';

 ***REMOVED*****REMOVED***
  ***REMOVED*** Last error code.
  ***REMOVED*** @private {!goog.net.ErrorCode}
 ***REMOVED*****REMOVED***
  this.lastErrorCode_ = goog.net.ErrorCode.NO_ERROR;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Last error message.
  ***REMOVED*** @private {Error|string}
 ***REMOVED*****REMOVED***
  this.lastError_ = '';

 ***REMOVED*****REMOVED***
  ***REMOVED*** Used to ensure that we don't dispatch an multiple ERROR events. This can
  ***REMOVED*** happen in IE when it does a synchronous load and one error is handled in
  ***REMOVED*** the ready statte change and one is handled due to send() throwing an
  ***REMOVED*** exception.
  ***REMOVED*** @private {boolean}
 ***REMOVED*****REMOVED***
  this.errorDispatched_ = false;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Used to make sure we don't fire the complete event from inside a send call.
  ***REMOVED*** @private {boolean}
 ***REMOVED*****REMOVED***
  this.inSend_ = false;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Used in determining if a call to {@link #onReadyStateChange_} is from
  ***REMOVED*** within a call to this.xhr_.open.
  ***REMOVED*** @private {boolean}
 ***REMOVED*****REMOVED***
  this.inOpen_ = false;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Used in determining if a call to {@link #onReadyStateChange_} is from
  ***REMOVED*** within a call to this.xhr_.abort.
  ***REMOVED*** @private {boolean}
 ***REMOVED*****REMOVED***
  this.inAbort_ = false;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Number of milliseconds after which an incomplete request will be aborted
  ***REMOVED*** and a {@link goog.net.EventType.TIMEOUT} event raised; 0 means no timeout
  ***REMOVED*** is set.
  ***REMOVED*** @private {number}
 ***REMOVED*****REMOVED***
  this.timeoutInterval_ = 0;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Timer to track request timeout.
  ***REMOVED*** @private {?number}
 ***REMOVED*****REMOVED***
  this.timeoutId_ = null;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The requested type for the response. The empty string means use the default
  ***REMOVED*** XHR behavior.
  ***REMOVED*** @private {goog.net.XhrIo.ResponseType}
 ***REMOVED*****REMOVED***
  this.responseType_ = goog.net.XhrIo.ResponseType.DEFAULT;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Whether a "credentialed" request is to be sent (one that is aware of
  ***REMOVED*** cookies and authentication). This is applicable only for cross-domain
  ***REMOVED*** requests and more recent browsers that support this part of the HTTP Access
  ***REMOVED*** Control standard.
  ***REMOVED***
  ***REMOVED*** @see http://www.w3.org/TR/XMLHttpRequest/#the-withcredentials-attribute
  ***REMOVED***
  ***REMOVED*** @private {boolean}
 ***REMOVED*****REMOVED***
  this.withCredentials_ = false;

 ***REMOVED*****REMOVED***
  ***REMOVED*** True if we can use XMLHttpRequest's timeout directly.
  ***REMOVED*** @private {boolean}
 ***REMOVED*****REMOVED***
  this.useXhr2Timeout_ = false;
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
***REMOVED*** @private {goog.debug.Logger}
***REMOVED*** @const
***REMOVED***
goog.net.XhrIo.prototype.logger_ =
    goog.log.getLogger('goog.net.XhrIo');


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
***REMOVED*** The methods that typically come along with form data.  We set different
***REMOVED*** headers depending on whether the HTTP action is one of these.
***REMOVED***
goog.net.XhrIo.METHODS_WITH_FORM_DATA = ['POST', 'PUT'];


***REMOVED***
***REMOVED*** The Content-Type HTTP header value for a url-encoded form
***REMOVED*** @type {string}
***REMOVED***
goog.net.XhrIo.FORM_CONTENT_TYPE =
    'application/x-www-form-urlencoded;charset=utf-8';


***REMOVED***
***REMOVED*** The XMLHttpRequest Level two timeout delay ms property name.
***REMOVED***
***REMOVED*** @see http://www.w3.org/TR/XMLHttpRequest/#the-timeout-attribute
***REMOVED***
***REMOVED*** @private {string}
***REMOVED*** @const
***REMOVED***
goog.net.XhrIo.XHR2_TIMEOUT_ = 'timeout';


***REMOVED***
***REMOVED*** The XMLHttpRequest Level two ontimeout handler property name.
***REMOVED***
***REMOVED*** @see http://www.w3.org/TR/XMLHttpRequest/#the-timeout-attribute
***REMOVED***
***REMOVED*** @private {string}
***REMOVED*** @const
***REMOVED***
goog.net.XhrIo.XHR2_ON_TIMEOUT_ = 'ontimeout';


***REMOVED***
***REMOVED*** All non-disposed instances of goog.net.XhrIo created
***REMOVED*** by {@link goog.net.XhrIo.send} are in this Array.
***REMOVED*** @see goog.net.XhrIo.cleanup
***REMOVED*** @private {!Array.<!goog.net.XhrIo>}
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
***REMOVED*** @param {ArrayBuffer|ArrayBufferView|Blob|Document|FormData|string=}
***REMOVED***     opt_content Body data.
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
    x.listen(goog.net.EventType.COMPLETE, opt_callback);
  }
  x.listenOnce(goog.net.EventType.READY, x.cleanupSend_);
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
***REMOVED*** @private
***REMOVED***
goog.net.XhrIo.prototype.cleanupSend_ = function() {
  this.dispose();
  goog.array.remove(goog.net.XhrIo.sendInstances_, this);
***REMOVED***


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
***REMOVED*** @param {ArrayBuffer|ArrayBufferView|Blob|Document|FormData|string=}
***REMOVED***     opt_content Body data.
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
    goog.log.fine(this.logger_, this.formatMsg_('Opening Xhr'));
    this.inOpen_ = true;
    this.xhr_.open(method, String(url), true);  // Always async!
    this.inOpen_ = false;
  } catch (err) {
    goog.log.fine(this.logger_,
        this.formatMsg_('Error opening Xhr: ' + err.message));
    this.error_(goog.net.ErrorCode.EXCEPTION, err);
    return;
  }

  // We can't use null since this won't allow requests with form data to have a
  // content length specified which will cause some proxies to return a 411
  // error.
  var content = opt_content || '';

  var headers = this.headers.clone();

  // Add headers specific to this request
  if (opt_headers) {
    goog.structs.forEach(opt_headers, function(value, key) {
      headers.set(key, value);
    });
  }

  // Find whether a content type header is set, ignoring case.
  // HTTP header names are case-insensitive.  See:
  // http://www.w3.org/Protocols/rfc2616/rfc2616-sec4.html#sec4.2
  var contentTypeKey = goog.array.find(headers.getKeys(),
      goog.net.XhrIo.isContentTypeHeader_);

  var contentIsFormData = (goog.global['FormData'] &&
      (content instanceof goog.global['FormData']));
  if (goog.array.contains(goog.net.XhrIo.METHODS_WITH_FORM_DATA, method) &&
      !contentTypeKey && !contentIsFormData) {
    // For requests typically with form data, default to the url-encoded form
    // content type unless this is a FormData request.  For FormData,
    // the browser will automatically add a multipart/form-data content type
    // with an appropriate multipart boundary.
    headers.set(goog.net.XhrIo.CONTENT_TYPE_HEADER,
                goog.net.XhrIo.FORM_CONTENT_TYPE);
  }

  // Add the headers to the Xhr object
  headers.forEach(function(value, key) {
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
    this.cleanUpTimeoutTimer_(); // Paranoid, should never be running.
    if (this.timeoutInterval_ > 0) {
      this.useXhr2Timeout_ = goog.net.XhrIo.shouldUseXhr2Timeout_(this.xhr_);
      goog.log.fine(this.logger_, this.formatMsg_('Will abort after ' +
          this.timeoutInterval_ + 'ms if incomplete, xhr2 ' +
          this.useXhr2Timeout_));
      if (this.useXhr2Timeout_) {
        this.xhr_[goog.net.XhrIo.XHR2_TIMEOUT_] = this.timeoutInterval_;
        this.xhr_[goog.net.XhrIo.XHR2_ON_TIMEOUT_] =
            goog.bind(this.timeout_, this);
      } else {
        this.timeoutId_ = goog.Timer.callOnce(this.timeout_,
            this.timeoutInterval_, this);
      }
    }
    goog.log.fine(this.logger_, this.formatMsg_('Sending request'));
    this.inSend_ = true;
    this.xhr_.send(content);
    this.inSend_ = false;

  } catch (err) {
    goog.log.fine(this.logger_, this.formatMsg_('Send error: ' + err.message));
    this.error_(goog.net.ErrorCode.EXCEPTION, err);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Determines if the argument is an XMLHttpRequest that supports the level 2
***REMOVED*** timeout value and event.
***REMOVED***
***REMOVED*** Currently, FF 21.0 OS X has the fields but won't actually call the timeout
***REMOVED*** handler.  Perhaps the confusion in the bug referenced below hasn't
***REMOVED*** entirely been resolved.
***REMOVED***
***REMOVED*** @see http://www.w3.org/TR/XMLHttpRequest/#the-timeout-attribute
***REMOVED*** @see https://bugzilla.mozilla.org/show_bug.cgi?id=525816
***REMOVED***
***REMOVED*** @param {!goog.net.XhrLike.OrNative} xhr The request.
***REMOVED*** @return {boolean} True if the request supports level 2 timeout.
***REMOVED*** @private
***REMOVED***
goog.net.XhrIo.shouldUseXhr2Timeout_ = function(xhr) {
  return goog.userAgent.IE &&
      goog.userAgent.isVersionOrHigher(9) &&
      goog.isNumber(xhr[goog.net.XhrIo.XHR2_TIMEOUT_]) &&
      goog.isDef(xhr[goog.net.XhrIo.XHR2_ON_TIMEOUT_]);
***REMOVED***


***REMOVED***
***REMOVED*** @param {string} header An HTTP header key.
***REMOVED*** @return {boolean} Whether the key is a content type header (ignoring
***REMOVED***     case.
***REMOVED*** @private
***REMOVED***
goog.net.XhrIo.isContentTypeHeader_ = function(header) {
  return goog.string.caseInsensitiveEquals(
      goog.net.XhrIo.CONTENT_TYPE_HEADER, header);
***REMOVED***


***REMOVED***
***REMOVED*** Creates a new XHR object.
***REMOVED*** @return {!goog.net.XhrLike.OrNative} The newly created XHR object.
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
    goog.log.fine(this.logger_, this.formatMsg_(this.lastError_));
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
    goog.log.fine(this.logger_, this.formatMsg_('Aborting'));
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

  goog.net.XhrIo.base(this, 'disposeInternal');
***REMOVED***


***REMOVED***
***REMOVED*** Internal handler for the XHR object's readystatechange event.  This method
***REMOVED*** checks the status and the readystate and fires the correct callbacks.
***REMOVED*** If the request has ended, the handlers are cleaned up and the XHR object is
***REMOVED*** nullified.
***REMOVED*** @private
***REMOVED***
goog.net.XhrIo.prototype.onReadyStateChange_ = function() {
  if (this.isDisposed()) {
    // This method is the target of an untracked goog.Timer.callOnce().
    return;
  }
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
    goog.log.fine(this.logger_, this.formatMsg_(
        'Local request error detected and ignored'));

  } else {

    // In IE when the response has been cached we sometimes get the callback
    // from inside the send call and this usually breaks code that assumes that
    // XhrIo is asynchronous.  If that is the case we delay the callback
    // using a timer.
    if (this.inSend_ &&
        this.getReadyState() == goog.net.XmlHttp.ReadyState.COMPLETE) {
      goog.Timer.callOnce(this.onReadyStateChange_, 0, this);
      return;
    }

    this.dispatchEvent(goog.net.EventType.READY_STATE_CHANGE);

    // readyState indicates the transfer has finished
    if (this.isComplete()) {
      goog.log.fine(this.logger_, this.formatMsg_('Request complete'));

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
    // Cancel any pending timeout event handler.
    this.cleanUpTimeoutTimer_();

    // Save reference so we can mark it as closed after the READY event.  The
    // READY event may trigger another request, thus we must nullify this.xhr_
    var xhr = this.xhr_;
    var clearedOnReadyStateChange =
        this.xhrOptions_[goog.net.XmlHttp.OptionType.USE_NULL_FUNCTION] ?
            goog.nullFunction : null;
    this.xhr_ = null;
    this.xhrOptions_ = null;

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
      goog.log.error(this.logger_,
          'Problem encountered resetting onreadystatechange: ' + e.message);
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** Make sure the timeout timer isn't running.
***REMOVED*** @private
***REMOVED***
goog.net.XhrIo.prototype.cleanUpTimeoutTimer_ = function() {
  if (this.xhr_ && this.useXhr2Timeout_) {
    this.xhr_[goog.net.XhrIo.XHR2_ON_TIMEOUT_] = null;
  }
  if (goog.isNumber(this.timeoutId_)) {
    goog.Timer.clear(this.timeoutId_);
    this.timeoutId_ = null;
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
  ***REMOVED*** (i.e. it is receiving or complete).  The try/catch is used for when the
  ***REMOVED*** page is unloading and an ERROR_NOT_AVAILABLE may occur when accessing xhr_.
  ***REMOVED*** @preserveTry
 ***REMOVED*****REMOVED***
  try {
    return this.getReadyState() > goog.net.XmlHttp.ReadyState.LOADED ?
        this.xhr_.status : -1;
  } catch (e) {
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
    goog.log.fine(this.logger_, 'Can not get status: ' + e.message);
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
    // when the state is not LOADING or DONE. Instead, IE can
    // throw unexpected exceptions, for example when a request is aborted
    // or no data is available yet.
    goog.log.fine(this.logger_, 'Can not get responseText: ' + e.message);
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
    goog.log.fine(this.logger_, 'Can not get responseBody: ' + e.message);
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
    goog.log.fine(this.logger_, 'Can not get responseXML: ' + e.message);
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
    goog.log.error(this.logger_,
        'Response type ' + this.responseType_ + ' is not ' +
        'supported on this browser');
    return null;
  } catch (e) {
    goog.log.fine(this.logger_, 'Can not get response: ' + e.message);
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
goog.net.XhrIo.prototype.getResponseHeaders = function() {
  var headersObject = {***REMOVED***
  var headersArray = this.getAllResponseHeaders().split('\r\n');
  for (var i = 0; i < headersArray.length; i++) {
    if (goog.string.isEmpty(headersArray[i])) {
      continue;
    }
    var keyValue = goog.string.splitLimit(headersArray[i], ': ', 2);
    if (headersObject[keyValue[0]]) {
      headersObject[keyValue[0]] += ', ' + keyValue[1];
    } else {
      headersObject[keyValue[0]] = keyValue[1];
    }
  }
  return headersObject;
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
