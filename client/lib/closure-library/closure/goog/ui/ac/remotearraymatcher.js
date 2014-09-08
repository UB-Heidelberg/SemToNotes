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
***REMOVED*** @fileoverview Class that retrieves autocomplete matches via an ajax call.
***REMOVED***
***REMOVED***

goog.provide('goog.ui.ac.RemoteArrayMatcher');

goog.require('goog.Disposable');
***REMOVED***
***REMOVED***
goog.require('goog.json');
goog.require('goog.net.EventType');
***REMOVED***



***REMOVED***
***REMOVED*** An array matcher that requests matches via ajax.
***REMOVED*** @param {string} url The Uri which generates the auto complete matches.  The
***REMOVED***     search term is passed to the server as the 'token' query param.
***REMOVED*** @param {boolean=} opt_noSimilar If true, request that the server does not do
***REMOVED***     similarity matches for the input token against the dictionary.
***REMOVED***     The value is sent to the server as the 'use_similar' query param which is
***REMOVED***     either "1" (opt_noSimilar==false) or "0" (opt_noSimilar==true).
***REMOVED***
***REMOVED*** @extends {goog.Disposable}
***REMOVED***
goog.ui.ac.RemoteArrayMatcher = function(url, opt_noSimilar) {
  goog.Disposable.call(this);

 ***REMOVED*****REMOVED***
  ***REMOVED*** The base URL for the ajax call.  The token and max_matches are added as
  ***REMOVED*** query params.
  ***REMOVED*** @type {string}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.url_ = url;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Whether similar matches should be found as well.  This is sent as a hint
  ***REMOVED*** to the server only.
  ***REMOVED*** @type {boolean}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.useSimilar_ = !opt_noSimilar;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The XhrIo object used for making remote requests.  When a new request
  ***REMOVED*** is made, the current one is aborted and the new one sent.
  ***REMOVED*** @type {goog.net.XhrIo}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.xhr_ = new goog.net.XhrIo();
***REMOVED***
goog.inherits(goog.ui.ac.RemoteArrayMatcher, goog.Disposable);


***REMOVED***
***REMOVED*** The HTTP send method (GET, POST) to use when making the ajax call.
***REMOVED*** @type {string}
***REMOVED*** @private
***REMOVED***
goog.ui.ac.RemoteArrayMatcher.prototype.method_ = 'GET';


***REMOVED***
***REMOVED*** Data to submit during a POST.
***REMOVED*** @type {string|undefined}
***REMOVED*** @private
***REMOVED***
goog.ui.ac.RemoteArrayMatcher.prototype.content_ = undefined;


***REMOVED***
***REMOVED*** Headers to send with every HTTP request.
***REMOVED*** @type {Object|goog.structs.Map}
***REMOVED*** @private
***REMOVED***
goog.ui.ac.RemoteArrayMatcher.prototype.headers_ = null;


***REMOVED***
***REMOVED*** Key to the listener on XHR. Used to clear previous listeners.
***REMOVED*** @type {goog.events.Key}
***REMOVED*** @private
***REMOVED***
goog.ui.ac.RemoteArrayMatcher.prototype.lastListenerKey_ = null;


***REMOVED***
***REMOVED*** Set the send method ("GET", "POST").
***REMOVED*** @param {string} method The send method; default: GET.
***REMOVED***
goog.ui.ac.RemoteArrayMatcher.prototype.setMethod = function(method) {
  this.method_ = method;
***REMOVED***


***REMOVED***
***REMOVED*** Set the post data.
***REMOVED*** @param {string} content Post data.
***REMOVED***
goog.ui.ac.RemoteArrayMatcher.prototype.setContent = function(content) {
  this.content_ = content;
***REMOVED***


***REMOVED***
***REMOVED*** Set the HTTP headers.
***REMOVED*** @param {Object|goog.structs.Map} headers Map of headers to add to the
***REMOVED***     request.
***REMOVED***
goog.ui.ac.RemoteArrayMatcher.prototype.setHeaders = function(headers) {
  this.headers_ = headers;
***REMOVED***


***REMOVED***
***REMOVED*** Set the timeout interval.
***REMOVED*** @param {number} interval Number of milliseconds after which an
***REMOVED***     incomplete request will be aborted; 0 means no timeout is set.
***REMOVED***
goog.ui.ac.RemoteArrayMatcher.prototype.setTimeoutInterval =
    function(interval) {
  this.xhr_.setTimeoutInterval(interval);
***REMOVED***


***REMOVED***
***REMOVED*** Builds a complete GET-style URL, given the base URI and autocomplete related
***REMOVED*** parameter values.
***REMOVED*** <b>Override this to build any customized lookup URLs.</b>
***REMOVED*** <b>Can be used to change request method and any post content as well.</b>
***REMOVED*** @param {string} uri The base URI of the request target.
***REMOVED*** @param {string} token Current token in autocomplete.
***REMOVED*** @param {number} maxMatches Maximum number of matches required.
***REMOVED*** @param {boolean} useSimilar A hint to the server.
***REMOVED*** @param {string=} opt_fullString Complete text in the input element.
***REMOVED*** @return {?string} The complete url. Return null if no request should be sent.
***REMOVED*** @protected
***REMOVED***
goog.ui.ac.RemoteArrayMatcher.prototype.buildUrl = function(uri,
    token, maxMatches, useSimilar, opt_fullString) {
  var url = new goog.Uri(uri);
  url.setParameterValue('token', token);
  url.setParameterValue('max_matches', String(maxMatches));
  url.setParameterValue('use_similar', String(Number(useSimilar)));
  return url.toString();
***REMOVED***


***REMOVED***
***REMOVED*** Returns whether the suggestions should be updated?
***REMOVED*** <b>Override this to prevent updates eg - when token is empty.</b>
***REMOVED*** @param {string} uri The base URI of the request target.
***REMOVED*** @param {string} token Current token in autocomplete.
***REMOVED*** @param {number} maxMatches Maximum number of matches required.
***REMOVED*** @param {boolean} useSimilar A hint to the server.
***REMOVED*** @param {string=} opt_fullString Complete text in the input element.
***REMOVED*** @return {boolean} Whether new matches be requested.
***REMOVED*** @protected
***REMOVED***
goog.ui.ac.RemoteArrayMatcher.prototype.shouldRequestMatches =
    function(uri, token, maxMatches, useSimilar, opt_fullString) {
  return true;
***REMOVED***


***REMOVED***
***REMOVED*** Parses and retrieves the array of suggestions from XHR response.
***REMOVED*** <b>Override this if the response is not a simple JSON array.</b>
***REMOVED*** @param {string} responseText The XHR response text.
***REMOVED*** @return {Array.<string>} The array of suggestions.
***REMOVED*** @protected
***REMOVED***
goog.ui.ac.RemoteArrayMatcher.prototype.parseResponseText = function(
    responseText) {

  var matches = [];
  // If there is no response text, unsafeParse will throw a syntax error.
  if (responseText) {
   ***REMOVED*****REMOVED*** @preserveTry***REMOVED***
    try {
      matches = goog.json.unsafeParse(responseText);
    } catch (exception) {
    }
  }
  return***REMOVED*****REMOVED*** @type {Array.<string>}***REMOVED*** (matches);
***REMOVED***


***REMOVED***
***REMOVED*** Handles the XHR response.
***REMOVED*** @param {string} token The XHR autocomplete token.
***REMOVED*** @param {Function} matchHandler The AutoComplete match handler.
***REMOVED*** @param {goog.events.Event} event The XHR success event.
***REMOVED***
goog.ui.ac.RemoteArrayMatcher.prototype.xhrCallback = function(token,
    matchHandler, event) {
  var text = event.target.getResponseText();
  matchHandler(token, this.parseResponseText(text));
***REMOVED***


***REMOVED***
***REMOVED*** Retrieve a set of matching rows from the server via ajax.
***REMOVED*** @param {string} token The text that should be matched; passed to the server
***REMOVED***     as the 'token' query param.
***REMOVED*** @param {number} maxMatches The maximum number of matches requested from the
***REMOVED***     server; passed as the 'max_matches' query param.  The server is
***REMOVED***     responsible for limiting the number of matches that are returned.
***REMOVED*** @param {Function} matchHandler Callback to execute on the result after
***REMOVED***     matching.
***REMOVED*** @param {string=} opt_fullString The full string from the input box.
***REMOVED***
goog.ui.ac.RemoteArrayMatcher.prototype.requestMatchingRows =
    function(token, maxMatches, matchHandler, opt_fullString) {

  if (!this.shouldRequestMatches(this.url_, token, maxMatches, this.useSimilar_,
      opt_fullString)) {
    return;
  }
  // Set the query params on the URL.
  var url = this.buildUrl(this.url_, token, maxMatches, this.useSimilar_,
      opt_fullString);
  if (!url) {
    // Do nothing if there is no URL.
    return;
  }

  // The callback evals the server response and calls the match handler on
  // the array of matches.
  var callback = goog.bind(this.xhrCallback, this, token, matchHandler);

  // Abort the current request and issue the new one; prevent requests from
  // being queued up by the browser with a slow server
  if (this.xhr_.isActive()) {
    this.xhr_.abort();
  }
  // This ensures if previous XHR is aborted or ends with error, the
  // corresponding success-callbacks are cleared.
  if (this.lastListenerKey_) {
    goog.events.unlistenByKey(this.lastListenerKey_);
  }
  // Listen once ensures successful callback gets cleared by itself.
  this.lastListenerKey_ = goog.events.listenOnce(this.xhr_,
  ***REMOVED*** callback);
  this.xhr_.send(url, this.method_, this.content_, this.headers_);
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.ui.ac.RemoteArrayMatcher.prototype.disposeInternal = function() {
  this.xhr_.dispose();
  goog.ui.ac.RemoteArrayMatcher.superClass_.disposeInternal.call(
      this);
***REMOVED***
