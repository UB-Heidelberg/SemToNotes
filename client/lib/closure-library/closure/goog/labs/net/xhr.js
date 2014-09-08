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
goog.provide('goog.labs.net.xhr.Options');
goog.provide('goog.labs.net.xhr.PostData');
goog.provide('goog.labs.net.xhr.TimeoutError');

goog.require('goog.Promise');
goog.require('goog.debug.Error');
goog.require('goog.json');
goog.require('goog.net.HttpStatus');
goog.require('goog.net.XmlHttp');
goog.require('goog.string');
goog.require('goog.uri.utils');



goog.scope(function() {
var _ = goog.labs.net.xhr;
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
***REMOVED*** Sends a get request, returning a promise that will be resolved
***REMOVED*** with the response text once the request completes.
***REMOVED***
***REMOVED*** @param {string} url The URL to request.
***REMOVED*** @param {_.Options=} opt_options Configuration options for the request.
***REMOVED*** @return {!goog.Promise.<string>} A promise that will be resolved with the
***REMOVED***     response text once the request completes.
***REMOVED***
_.get = function(url, opt_options) {
  return _.send('GET', url, null, opt_options).then(function(xhr) {
    return xhr.responseText;
  });
***REMOVED***


***REMOVED***
***REMOVED*** Sends a post request, returning a promise that will be resolved
***REMOVED*** with the response text once the request completes.
***REMOVED***
***REMOVED*** @param {string} url The URL to request.
***REMOVED*** @param {_.PostData} data The body of the post request.
***REMOVED*** @param {_.Options=} opt_options Configuration options for the request.
***REMOVED*** @return {!goog.Promise.<string>} A promise that will be resolved with the
***REMOVED***     response text once the request completes.
***REMOVED***
_.post = function(url, data, opt_options) {
  return _.send('POST', url, data, opt_options).then(function(xhr) {
    return xhr.responseText;
  });
***REMOVED***


***REMOVED***
***REMOVED*** Sends a get request, returning a promise that will be resolved with
***REMOVED*** the parsed response text once the request completes.
***REMOVED***
***REMOVED*** @param {string} url The URL to request.
***REMOVED*** @param {_.Options=} opt_options Configuration options for the request.
***REMOVED*** @return {!goog.Promise.<Object>} A promise that will be resolved with the
***REMOVED***     response JSON once the request completes.
***REMOVED***
_.getJson = function(url, opt_options) {
  return _.send('GET', url, null, opt_options).then(function(xhr) {
    return _.parseJson_(xhr.responseText, opt_options);
  });
***REMOVED***


***REMOVED***
***REMOVED*** Sends a post request, returning a promise that will be resolved with
***REMOVED*** the parsed response text once the request completes.
***REMOVED***
***REMOVED*** @param {string} url The URL to request.
***REMOVED*** @param {_.PostData} data The body of the post request.
***REMOVED*** @param {_.Options=} opt_options Configuration options for the request.
***REMOVED*** @return {!goog.Promise.<Object>} A promise that will be resolved with the
***REMOVED***     response JSON once the request completes.
***REMOVED***
_.postJson = function(url, data, opt_options) {
  return _.send('POST', url, data, opt_options).then(function(xhr) {
    return _.parseJson_(xhr.responseText, opt_options);
  });
***REMOVED***


***REMOVED***
***REMOVED*** Sends a request, returning a promise that will be resolved
***REMOVED*** with the XHR object once the request completes.
***REMOVED***
***REMOVED*** @param {string} method The HTTP method for the request.
***REMOVED*** @param {string} url The URL to request.
***REMOVED*** @param {_.PostData} data The body of the post request.
***REMOVED*** @param {_.Options=} opt_options Configuration options for the request.
***REMOVED*** @return {!goog.Promise.<!goog.net.XhrLike.OrNative>} A promise that will be
***REMOVED***     resolved with the XHR object once the request completes.
***REMOVED***
_.send = function(method, url, data, opt_options) {
  return new goog.Promise(function(resolve, reject) {
    var options = opt_options || {***REMOVED***
    var timer;

    var xhr = goog.net.XmlHttp();
    try {
      xhr.open(method, url, true);
    } catch (e) {
      // XMLHttpRequest.open may throw when 'open' is called, for example, IE7
      // throws "Access Denied" for cross-origin requests.
      reject(new _.Error('Error opening XHR: ' + e.message, url, xhr));
    }

    // So sad that IE doesn't support onload and onerror.
    xhr.onreadystatechange = function() {
      if (xhr.readyState == goog.net.XmlHttp.ReadyState.COMPLETE) {
        goog.global.clearTimeout(timer);
        // Note: When developing locally, XHRs to file:// schemes return
        // a status code of 0. We mark that case as a success too.
        if (HttpStatus.isSuccess(xhr.status) ||
            xhr.status === 0 && !_.isEffectiveSchemeHttp_(url)) {
          resolve(xhr);
        } else {
          reject(new _.HttpError(xhr.status, url, xhr));
        }
      }
   ***REMOVED*****REMOVED***
    xhr.onerror = function() {
      reject(new _.Error('Network error', url, xhr));
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
      timer = goog.global.setTimeout(function() {
        // Clear event listener before aborting so the errback will not be
        // called twice.
        xhr.onreadystatechange = goog.nullFunction;
        xhr.abort();
        reject(new _.TimeoutError(url, xhr));
      }, options.timeoutMs);
    }

    // Trigger the send.
    try {
      xhr.send(data);
    } catch (e) {
      // XMLHttpRequest.send is known to throw on some versions of FF,
      // for example if a cross-origin request is disallowed.
      xhr.onreadystatechange = goog.nullFunction;
      goog.global.clearTimeout(timer);
      reject(new _.Error('Error sending XHR: ' + e.message, url, xhr));
    }
  });
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
***REMOVED*** JSON-parses the given response text, returning an Object.
***REMOVED***
***REMOVED*** @param {string} responseText Response text.
***REMOVED*** @param {_.Options|undefined} options The options object.
***REMOVED*** @return {Object} The JSON-parsed value of the original responseText.
***REMOVED*** @private
***REMOVED***
_.parseJson_ = function(responseText, options) {
  var prefixStrippedResult = responseText;
  if (options && options.xssiPrefix) {
    prefixStrippedResult = _.stripXssiPrefix_(
        options.xssiPrefix, prefixStrippedResult);
  }
  return goog.json.parse(prefixStrippedResult);
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
***REMOVED*** @param {!goog.net.XhrLike.OrNative} xhr The XHR that failed.
***REMOVED*** @extends {goog.debug.Error}
***REMOVED***
***REMOVED***
_.Error = function(message, url, xhr) {
  _.Error.base(this, 'constructor', message + ', url=' + url);

 ***REMOVED*****REMOVED***
  ***REMOVED*** The URL that was requested.
  ***REMOVED*** @type {string}
 ***REMOVED*****REMOVED***
  this.url = url;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The XMLHttpRequest corresponding with the failed request.
  ***REMOVED*** @type {!goog.net.XhrLike.OrNative}
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
***REMOVED*** @param {!goog.net.XhrLike.OrNative} xhr The XHR that failed.
***REMOVED*** @extends {_.Error}
***REMOVED***
***REMOVED*** @final
***REMOVED***
_.HttpError = function(status, url, xhr) {
  _.HttpError.base(
      this, 'constructor', 'Request Failed, status=' + status, url, xhr);

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
***REMOVED*** @param {!goog.net.XhrLike.OrNative} xhr The XHR that failed.
***REMOVED*** @extends {_.Error}
***REMOVED***
***REMOVED*** @final
***REMOVED***
_.TimeoutError = function(url, xhr) {
  _.TimeoutError.base(this, 'constructor', 'Request timed out', url, xhr);
***REMOVED***
goog.inherits(_.TimeoutError, _.Error);


***REMOVED*** @override***REMOVED***
_.TimeoutError.prototype.name = 'XhrTimeoutError';

});  // goog.scope
