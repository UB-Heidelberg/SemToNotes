// Copyright 2011 The Closure Library Authors. All Rights Reserved.
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
***REMOVED*** @fileoverview Offered as an alternative to XhrIo as a way for making requests
***REMOVED*** via XMLHttpRequest.  Instead of mirroring the XHR interface and exposing
***REMOVED*** events, results are used as a way to pass a "promise" of the response to
***REMOVED*** interested parties.
***REMOVED***
***REMOVED***

goog.provide('goog.labs.net.xhr');
goog.provide('goog.labs.net.xhr.Error');
goog.provide('goog.labs.net.xhr.HttpError');
goog.provide('goog.labs.net.xhr.TimeoutError');

goog.require('goog.debug.Error');
goog.require('goog.json');
goog.require('goog.net.HttpStatus');
goog.require('goog.net.XmlHttp');
goog.require('goog.result');
goog.require('goog.result.SimpleResult');
goog.require('goog.string');
goog.require('goog.uri.utils');



goog.scope(function() {
var _ = goog.labs.net.xhr;
var Result = goog.result.Result;
var SimpleResult = goog.result.SimpleResult;
var Wait = goog.result.wait;
var HttpStatus = goog.net.HttpStatus;


***REMOVED***
***REMOVED*** Configuration options for an XMLHttpRequest.
***REMOVED*** - headers: map of header key/value pairs.
***REMOVED*** - timeoutMs: number of milliseconds after which the request will be timed
***REMOVED***      out by the client. Default is to allow the browser to handle timeouts.
***REMOVED*** - withCredentials: whether user credentials are to be included in a
***REMOVED***      cross-origin request.  See:
***REMOVED***      http://dev.w3.org/2006/webapi/XMLHttpRequest-2/#the-withcredentials-attribute
***REMOVED*** - mimeType: allows the caller to override the content-type and charset for
***REMOVED***      the request, which is useful when requesting binary data.  See:
***REMOVED***      http://dev.w3.org/2006/webapi/XMLHttpRequest-2/#dom-xmlhttprequest-overridemimetype
***REMOVED*** - xssiPrefix: Prefix used for protecting against XSSI attacks, which should
***REMOVED***      be removed before parsing the response as JSON.
***REMOVED***
***REMOVED*** @typedef {{
***REMOVED***   headers: (Object.<string>|undefined),
***REMOVED***   timeoutMs: (number|undefined),
***REMOVED***   withCredentials: (boolean|undefined),
***REMOVED***   mimeType: (string|undefined),
***REMOVED***   xssiPrefix: (string|undefined)
***REMOVED*** }}
***REMOVED***
_.Options;


***REMOVED***
***REMOVED*** Defines the types that are allowed as post data.
***REMOVED*** @typedef {(ArrayBuffer|Blob|Document|FormData|null|string|undefined)}
***REMOVED***
_.PostData;


***REMOVED***
***REMOVED*** The Content-Type HTTP header name.
***REMOVED*** @type {string}
***REMOVED***
_.CONTENT_TYPE_HEADER = 'Content-Type';


***REMOVED***
***REMOVED*** The Content-Type HTTP header value for a url-encoded form.
***REMOVED*** @type {string}
***REMOVED***
_.FORM_CONTENT_TYPE = 'application/x-www-form-urlencoded;charset=utf-8';


***REMOVED***
***REMOVED*** Sends a get request, returning a transformed result which will be resolved
***REMOVED*** with the response text once the request completes.
***REMOVED***
***REMOVED*** @param {string} url The URL to request.
***REMOVED*** @param {_.Options=} opt_options Configuration options for the request.
***REMOVED*** @return {!Result} A result object that will be resolved
***REMOVED***     with the response text once the request finishes.
***REMOVED***
_.get = function(url, opt_options) {
  var result = _.send('GET', url, null, opt_options);
  var transformedResult = goog.result.transform(result,
                                                _.getResponseText_);
  return transformedResult;
***REMOVED***


***REMOVED***
***REMOVED*** Sends a post request, returning a transformed result which will be resolved
***REMOVED*** with the response text once the request completes.
***REMOVED***
***REMOVED*** @param {string} url The URL to request.
***REMOVED*** @param {_.PostData} data The body of the post request.
***REMOVED*** @param {_.Options=} opt_options Configuration options for the request.
***REMOVED*** @return {!Result} A result object that will be resolved
***REMOVED***     with the response text once the request finishes.
***REMOVED***
_.post = function(url, data, opt_options) {
  var result = _.send('POST', url, data, opt_options);
  var transformedResult = goog.result.transform(result,
                                                _.getResponseText_);
  return transformedResult;
***REMOVED***


***REMOVED***
***REMOVED*** Sends a get request, returning a result which will be resolved with
***REMOVED*** the parsed response text once the request completes.
***REMOVED***
***REMOVED*** @param {string} url The URL to request.
***REMOVED*** @param {_.Options=} opt_options Configuration options for the request.
***REMOVED*** @return {!Result} A result object that will be resolved
***REMOVED***     with the response JSON once the request finishes.
***REMOVED***
_.getJson = function(url, opt_options) {
  var result = _.send('GET', url, null, opt_options);
  var transformedResult = _.addJsonParsingCallbacks_(result, opt_options);
  return transformedResult;
***REMOVED***


***REMOVED***
***REMOVED*** Sends a post request, returning a result which will be resolved with
***REMOVED*** the parsed response text once the request completes.
***REMOVED***
***REMOVED*** @param {string} url The URL to request.
***REMOVED*** @param {_.PostData} data The body of the post request.
***REMOVED*** @param {_.Options=} opt_options Configuration options for the request.
***REMOVED*** @return {!Result} A result object that will be resolved
***REMOVED***     with the response JSON once the request finishes.
***REMOVED***
_.postJson = function(url, data, opt_options) {
  var result = _.send('POST', url, data, opt_options);
  var transformedResult = _.addJsonParsingCallbacks_(result, opt_options);
  return transformedResult;
***REMOVED***


***REMOVED***
***REMOVED*** Sends a request using XMLHttpRequest and returns a result.
***REMOVED***
***REMOVED*** @param {string} method The HTTP method for the request.
***REMOVED*** @param {string} url The URL to request.
***REMOVED*** @param {_.PostData} data The body of the post request.
***REMOVED*** @param {_.Options=} opt_options Configuration options for the request.
***REMOVED*** @return {!Result} A result object that will be resolved
***REMOVED***     with the XHR object as it's value when the request finishes.
***REMOVED***
_.send = function(method, url, data, opt_options) {

  var result = new SimpleResult();

  // When the deferred is cancelled, we abort the XHR.  We want to make sure
  // the readystatechange event still fires, so it can do the timeout
  // cleanup, however we don't want the callback or errback to be called
  // again.  Thus the slight ugliness here.  If results were pushed into
  // makeRequest, this could become a lot cleaner but we want an option for
  // people not to include goog.result.Result.
  goog.result.waitOnError(result, function(result) {
    if (result.isCanceled()) {
      xhr.abort();
      xhr.onreadystatechange = goog.nullFunction;
    }
  });

  function callback(data) {
    result.setValue(data);
  }

  function errback(err) {
    result.setError(err);
  }

  var xhr = _.makeRequest(method, url, data, opt_options, callback, errback);

  return result;
***REMOVED***


***REMOVED***
***REMOVED*** Creates a new XMLHttpRequest and initiates a request.
***REMOVED***
***REMOVED*** @param {string} method The HTTP method for the request.
***REMOVED*** @param {string} url The URL to request.
***REMOVED*** @param {_.PostData} data The body of the post request, unless the content
***REMOVED***    type is explicitly set in the Options, then it will default to form
***REMOVED***    urlencoded.
***REMOVED*** @param {_.Options=} opt_options Configuration options for the request.
***REMOVED*** @param {function(XMLHttpRequest)=} opt_callback Optional callback to call
***REMOVED***     when the request completes.
***REMOVED*** @param {function(Error)=} opt_errback Optional callback to call
***REMOVED***     when there is an error.
***REMOVED*** @return {!XMLHttpRequest} The new XMLHttpRequest.
***REMOVED***
_.makeRequest = function(
    method, url, data, opt_options, opt_callback, opt_errback) {
  var options = opt_options || {***REMOVED***
  var callback = opt_callback || goog.nullFunction;
  var errback = opt_errback || goog.nullFunction;
  var timer;

  var xhr =***REMOVED*****REMOVED*** @type {!XMLHttpRequest}***REMOVED*** (goog.net.XmlHttp());
  try {
    xhr.open(method, url, true);
  } catch (e) {
    // XMLHttpRequest.open may throw when 'open' is called, for example, IE7
    // throws "Access Denied" for cross-origin requests.
    errback(new _.Error('Error opening XHR: ' + e.message, url, xhr));
    return xhr;
  }

  // So sad that IE doesn't support onload and onerror.
  xhr.onreadystatechange = function() {
    if (xhr.readyState == goog.net.XmlHttp.ReadyState.COMPLETE) {
      window.clearTimeout(timer);
      // Note: When developing locally, XHRs to file:// schemes return a status
      // code of 0. We mark that case as a success too.
      if (HttpStatus.isSuccess(xhr.status) ||
          xhr.status === 0 && !_.isEffectiveSchemeHttp_(url)) {
        callback(xhr);
      } else {
        errback(new _.HttpError(xhr.status, url, xhr));
      }
    }
 ***REMOVED*****REMOVED***

  // Set the headers.
  var contentTypeIsSet = false;
  if (options.headers) {
    for (var key in options.headers) {
      xhr.setRequestHeader(key, options.headers[key]);
    }
    contentTypeIsSet = _.CONTENT_TYPE_HEADER in options.headers;
  }

  // If a content type hasn't been set, default to form-urlencoded/UTF8 for
  // POSTs.  This is because some proxies have been known to reject posts
  // without a content-type.
  if (method == 'POST' && !contentTypeIsSet) {
    xhr.setRequestHeader(_.CONTENT_TYPE_HEADER, _.FORM_CONTENT_TYPE);
  }

  // Set whether to pass cookies on cross-domain requests (if applicable).
  // @see http://dev.w3.org/2006/webapi/XMLHttpRequest-2/#the-withcredentials-attribute
  if (options.withCredentials) {
    xhr.withCredentials = options.withCredentials;
  }

  // Allow the request to override the mime type, useful for getting binary
  // data from the server.  e.g. 'text/plain; charset=x-user-defined'.
  // @see http://dev.w3.org/2006/webapi/XMLHttpRequest-2/#dom-xmlhttprequest-overridemimetype
  if (options.mimeType) {
    xhr.overrideMimeType(options.mimeType);
  }

  // Handle timeouts, if requested.
  if (options.timeoutMs > 0) {
    timer = window.setTimeout(function() {
      // Clear event listener before aborting so the errback will not be
      // called twice.
      xhr.onreadystatechange = goog.nullFunction;
      xhr.abort();
      errback(new _.TimeoutError(url, xhr));
    }, options.timeoutMs);
  }

  // Trigger the send.
  try {
    xhr.send(data);
  } catch (e) {
    // XMLHttpRequest.send is known to throw on some versions of FF, for example
    // if a cross-origin request is disallowed.
    xhr.onreadystatechange = goog.nullFunction;
    window.clearTimeout(timer);
    errback(new _.Error('Error sending XHR: ' + e.message, url, xhr));
  }

  return xhr;
***REMOVED***


***REMOVED***
***REMOVED*** @param {string} url The URL to test.
***REMOVED*** @return {boolean} Whether the effective scheme is HTTP or HTTPs.
***REMOVED*** @private
***REMOVED***
_.isEffectiveSchemeHttp_ = function(url) {
  var scheme = goog.uri.utils.getEffectiveScheme(url);
  // NOTE(user): Empty-string is for the case under FF3.5 when the location
  // is not defined inside a web worker.
  return scheme == 'http' || scheme == 'https' || scheme == '';
***REMOVED***


***REMOVED***
***REMOVED*** Returns the response text of an XHR object.  Intended to be called when
***REMOVED*** the result resolves.
***REMOVED***
***REMOVED*** @param {!XMLHttpRequest} xhr The XHR object.
***REMOVED*** @return {string} The response text.
***REMOVED*** @private
***REMOVED***
_.getResponseText_ = function(xhr) {
  return xhr.responseText;
***REMOVED***


***REMOVED***
***REMOVED*** Transforms a result, parsing the JSON in the original result value's
***REMOVED*** responseText. The transformed result's value is a javascript object.
***REMOVED*** Parse errors resolve the transformed result in an error.
***REMOVED***
***REMOVED*** @param {!Result} result The result to wait on.
***REMOVED*** @param {_.Options|undefined} options The options object.
***REMOVED***
***REMOVED*** @return {!Result} The transformed result.
***REMOVED*** @private
***REMOVED***
_.addJsonParsingCallbacks_ = function(result, options) {
  var resultWithResponseText = goog.result.transform(result,
                                                     _.getResponseText_);
  var prefixStrippedResult = resultWithResponseText;
  if (options && options.xssiPrefix) {
    prefixStrippedResult = goog.result.transform(resultWithResponseText,
        goog.partial(_.stripXssiPrefix_, options.xssiPrefix));
  }

  var jsonParsedResult = goog.result.transform(prefixStrippedResult,
                                               goog.json.parse);
  return jsonParsedResult;
***REMOVED***


***REMOVED***
***REMOVED*** Strips the XSSI prefix from the input string.
***REMOVED***
***REMOVED*** @param {string} prefix The XSSI prefix.
***REMOVED*** @param {string} string The string to strip the prefix from.
***REMOVED*** @return {string} The input string without the prefix.
***REMOVED*** @private
***REMOVED***
_.stripXssiPrefix_ = function(prefix, string) {
  if (goog.string.startsWith(string, prefix)) {
    string = string.substring(prefix.length);
  }
  return string;
***REMOVED***



***REMOVED***
***REMOVED*** Generic error that may occur during a request.
***REMOVED***
***REMOVED*** @param {string} message The error message.
***REMOVED*** @param {string} url The URL that was being requested.
***REMOVED*** @param {!XMLHttpRequest} xhr The XMLHttpRequest that failed.
***REMOVED*** @extends {goog.debug.Error}
***REMOVED***
***REMOVED***
_.Error = function(message, url, xhr) {
  goog.base(this, message + ', url=' + url);

 ***REMOVED*****REMOVED***
  ***REMOVED*** The URL that was requested.
  ***REMOVED*** @type {string}
 ***REMOVED*****REMOVED***
  this.url = url;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The XMLHttpRequest corresponding with the failed request.
  ***REMOVED*** @type {!XMLHttpRequest}
 ***REMOVED*****REMOVED***
  this.xhr = xhr;
***REMOVED***
goog.inherits(_.Error, goog.debug.Error);


***REMOVED*** @override***REMOVED***
_.Error.prototype.name = 'XhrError';



***REMOVED***
***REMOVED*** Class for HTTP errors.
***REMOVED***
***REMOVED*** @param {number} status The HTTP status code of the response.
***REMOVED*** @param {string} url The URL that was being requested.
***REMOVED*** @param {!XMLHttpRequest} xhr The XMLHttpRequest that failed.
***REMOVED*** @extends {_.Error}
***REMOVED***
***REMOVED***
_.HttpError = function(status, url, xhr) {
  goog.base(this, 'Request Failed, status=' + status, url, xhr);

 ***REMOVED*****REMOVED***
  ***REMOVED*** The HTTP status code for the error.
  ***REMOVED*** @type {number}
 ***REMOVED*****REMOVED***
  this.status = status;
***REMOVED***
goog.inherits(_.HttpError, _.Error);


***REMOVED*** @override***REMOVED***
_.HttpError.prototype.name = 'XhrHttpError';



***REMOVED***
***REMOVED*** Class for Timeout errors.
***REMOVED***
***REMOVED*** @param {string} url The URL that timed out.
***REMOVED*** @param {!XMLHttpRequest} xhr The XMLHttpRequest that failed.
***REMOVED*** @extends {_.Error}
***REMOVED***
***REMOVED***
_.TimeoutError = function(url, xhr) {
  goog.base(this, 'Request timed out', url, xhr);
***REMOVED***
goog.inherits(_.TimeoutError, _.Error);


***REMOVED*** @override***REMOVED***
_.TimeoutError.prototype.name = 'XhrTimeoutError';

});  // goog.scope
