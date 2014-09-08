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
***REMOVED*** @fileoverview Provides a utility for tracing and debugging WebChannel
***REMOVED***     requests.
***REMOVED***
***REMOVED*** @visibility {:internal}
***REMOVED***


goog.provide('goog.labs.net.webChannel.WebChannelDebug');

goog.require('goog.json');
goog.require('goog.log');



***REMOVED***
***REMOVED*** Logs and keeps a buffer of debugging info for the Channel.
***REMOVED***
***REMOVED***
***REMOVED*** @struct
***REMOVED*** @final
***REMOVED***
goog.labs.net.webChannel.WebChannelDebug = function() {
 ***REMOVED*****REMOVED***
  ***REMOVED*** The logger instance.
  ***REMOVED*** @const
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.logger_ = goog.log.getLogger('goog.labs.net.webChannel.WebChannelDebug');
***REMOVED***


goog.scope(function() {
var WebChannelDebug = goog.labs.net.webChannel.WebChannelDebug;


***REMOVED***
***REMOVED*** Gets the logger used by this ChannelDebug.
***REMOVED*** @return {goog.debug.Logger} The logger used by this WebChannelDebug.
***REMOVED***
WebChannelDebug.prototype.getLogger = function() {
  return this.logger_;
***REMOVED***


***REMOVED***
***REMOVED*** Logs that the browser went offline during the lifetime of a request.
***REMOVED*** @param {goog.Uri} url The URL being requested.
***REMOVED***
WebChannelDebug.prototype.browserOfflineResponse = function(url) {
  this.info('BROWSER_OFFLINE: ' + url);
***REMOVED***


***REMOVED***
***REMOVED*** Logs an XmlHttp request..
***REMOVED*** @param {string} verb The request type (GET/POST).
***REMOVED*** @param {goog.Uri} uri The request destination.
***REMOVED*** @param {string|number|undefined} id The request id.
***REMOVED*** @param {number} attempt Which attempt # the request was.
***REMOVED*** @param {?string} postData The data posted in the request.
***REMOVED***
WebChannelDebug.prototype.xmlHttpChannelRequest =
    function(verb, uri, id, attempt, postData) {
  this.info(
      'XMLHTTP REQ (' + id + ') [attempt ' + attempt + ']: ' +
      verb + '\n' + uri + '\n' +
      this.maybeRedactPostData_(postData));
***REMOVED***


***REMOVED***
***REMOVED*** Logs the meta data received from an XmlHttp request.
***REMOVED*** @param {string} verb The request type (GET/POST).
***REMOVED*** @param {goog.Uri} uri The request destination.
***REMOVED*** @param {string|number|undefined} id The request id.
***REMOVED*** @param {number} attempt Which attempt # the request was.
***REMOVED*** @param {goog.net.XmlHttp.ReadyState} readyState The ready state.
***REMOVED*** @param {number} statusCode The HTTP status code.
***REMOVED***
WebChannelDebug.prototype.xmlHttpChannelResponseMetaData =
    function(verb, uri, id, attempt, readyState, statusCode)  {
  this.info(
      'XMLHTTP RESP (' + id + ') [ attempt ' + attempt + ']: ' +
      verb + '\n' + uri + '\n' + readyState + ' ' + statusCode);
***REMOVED***


***REMOVED***
***REMOVED*** Logs the response data received from an XmlHttp request.
***REMOVED*** @param {string|number|undefined} id The request id.
***REMOVED*** @param {?string} responseText The response text.
***REMOVED*** @param {?string=} opt_desc Optional request description.
***REMOVED***
WebChannelDebug.prototype.xmlHttpChannelResponseText =
    function(id, responseText, opt_desc) {
  this.info(
      'XMLHTTP TEXT (' + id + '): ' +
      this.redactResponse_(responseText) +
      (opt_desc ? ' ' + opt_desc : ''));
***REMOVED***


***REMOVED***
***REMOVED*** Logs a Trident ActiveX request.
***REMOVED*** @param {string} verb The request type (GET/POST).
***REMOVED*** @param {goog.Uri} uri The request destination.
***REMOVED*** @param {string|number|undefined} id The request id.
***REMOVED*** @param {number} attempt Which attempt # the request was.
***REMOVED***
WebChannelDebug.prototype.tridentChannelRequest =
    function(verb, uri, id, attempt) {
  this.info(
      'TRIDENT REQ (' + id + ') [ attempt ' + attempt + ']: ' +
      verb + '\n' + uri);
***REMOVED***


***REMOVED***
***REMOVED*** Logs the response text received from a Trident ActiveX request.
***REMOVED*** @param {string|number|undefined} id The request id.
***REMOVED*** @param {string} responseText The response text.
***REMOVED***
WebChannelDebug.prototype.tridentChannelResponseText =
    function(id, responseText) {
  this.info(
      'TRIDENT TEXT (' + id + '): ' +
      this.redactResponse_(responseText));
***REMOVED***


***REMOVED***
***REMOVED*** Logs the done response received from a Trident ActiveX request.
***REMOVED*** @param {string|number|undefined} id The request id.
***REMOVED*** @param {boolean} successful Whether the request was successful.
***REMOVED***
WebChannelDebug.prototype.tridentChannelResponseDone =
    function(id, successful) {
  this.info(
      'TRIDENT TEXT (' + id + '): ' + successful ? 'success' : 'failure');
***REMOVED***


***REMOVED***
***REMOVED*** Logs a request timeout.
***REMOVED*** @param {goog.Uri} uri The uri that timed out.
***REMOVED***
WebChannelDebug.prototype.timeoutResponse = function(uri) {
  this.info('TIMEOUT: ' + uri);
***REMOVED***


***REMOVED***
***REMOVED*** Logs a debug message.
***REMOVED*** @param {string} text The message.
***REMOVED***
WebChannelDebug.prototype.debug = function(text) {
  this.info(text);
***REMOVED***


***REMOVED***
***REMOVED*** Logs an exception
***REMOVED*** @param {Error} e The error or error event.
***REMOVED*** @param {string=} opt_msg The optional message, defaults to 'Exception'.
***REMOVED***
WebChannelDebug.prototype.dumpException = function(e, opt_msg) {
  this.severe((opt_msg || 'Exception') + e);
***REMOVED***


***REMOVED***
***REMOVED*** Logs an info message.
***REMOVED*** @param {string} text The message.
***REMOVED***
WebChannelDebug.prototype.info = function(text) {
  goog.log.info(this.logger_, text);
***REMOVED***


***REMOVED***
***REMOVED*** Logs a warning message.
***REMOVED*** @param {string} text The message.
***REMOVED***
WebChannelDebug.prototype.warning = function(text) {
  goog.log.warning(this.logger_, text);
***REMOVED***


***REMOVED***
***REMOVED*** Logs a severe message.
***REMOVED*** @param {string} text The message.
***REMOVED***
WebChannelDebug.prototype.severe = function(text) {
  goog.log.error(this.logger_, text);
***REMOVED***


***REMOVED***
***REMOVED*** Removes potentially private data from a response so that we don't
***REMOVED*** accidentally save private and personal data to the server logs.
***REMOVED*** @param {?string} responseText A JSON response to clean.
***REMOVED*** @return {?string} The cleaned response.
***REMOVED*** @private
***REMOVED***
WebChannelDebug.prototype.redactResponse_ = function(responseText) {
  if (!responseText) {
    return null;
  }
 ***REMOVED*****REMOVED*** @preserveTry***REMOVED***
  try {
    var responseArray = goog.json.unsafeParse(responseText);
    if (responseArray) {
      for (var i = 0; i < responseArray.length; i++) {
        if (goog.isArray(responseArray[i])) {
          this.maybeRedactArray_(responseArray[i]);
        }
      }
    }

    return goog.json.serialize(responseArray);
  } catch (e) {
    this.debug('Exception parsing expected JS array - probably was not JS');
    return responseText;
  }
***REMOVED***


***REMOVED***
***REMOVED*** Removes data from a response array that may be sensitive.
***REMOVED*** @param {!Array} array The array to clean.
***REMOVED*** @private
***REMOVED***
WebChannelDebug.prototype.maybeRedactArray_ = function(array) {
  if (array.length < 2) {
    return;
  }
  var dataPart = array[1];
  if (!goog.isArray(dataPart)) {
    return;
  }
  if (dataPart.length < 1) {
    return;
  }

  var type = dataPart[0];
  if (type != 'noop' && type != 'stop') {
    // redact all fields in the array
    for (var i = 1; i < dataPart.length; i++) {
      dataPart[i] = '';
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** Removes potentially private data from a request POST body so that we don't
***REMOVED*** accidentally save private and personal data to the server logs.
***REMOVED*** @param {?string} data The data string to clean.
***REMOVED*** @return {?string} The data string with sensitive data replaced by 'redacted'.
***REMOVED*** @private
***REMOVED***
WebChannelDebug.prototype.maybeRedactPostData_ = function(data) {
  if (!data) {
    return null;
  }
  var out = '';
  var params = data.split('&');
  for (var i = 0; i < params.length; i++) {
    var param = params[i];
    var keyValue = param.split('=');
    if (keyValue.length > 1) {
      var key = keyValue[0];
      var value = keyValue[1];

      var keyParts = key.split('_');
      if (keyParts.length >= 2 && keyParts[1] == 'type') {
        out += key + '=' + value + '&';
      } else {
        out += key + '=' + 'redacted' + '&';
      }
    }
  }
  return out;
***REMOVED***
});  // goog.scope
