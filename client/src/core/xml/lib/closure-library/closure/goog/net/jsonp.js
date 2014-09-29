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

// The original file lives here: http://go/cross_domain_channel.js

***REMOVED***
***REMOVED*** @fileoverview Implements a cross-domain communication channel. A
***REMOVED*** typical web page is prevented by browser security from sending
***REMOVED*** request, such as a XMLHttpRequest, to other servers than the ones
***REMOVED*** from which it came. The Jsonp class provides a workound, by
***REMOVED*** using dynamically generated script tags. Typical usage:.
***REMOVED***
***REMOVED*** var jsonp = new goog.net.Jsonp(new goog.Uri('http://my.host.com/servlet'));
***REMOVED*** var payload = { 'foo': 1, 'bar': true***REMOVED*****REMOVED***
***REMOVED*** jsonp.send(payload, function(reply) { alert(reply) });
***REMOVED***
***REMOVED*** This script works in all browsers that are currently supported by
***REMOVED*** the Google Maps API, which is IE 6.0+, Firefox 0.8+, Safari 1.2.4+,
***REMOVED*** Netscape 7.1+, Mozilla 1.4+, Opera 8.02+.
***REMOVED***
***REMOVED***

goog.provide('goog.net.Jsonp');

***REMOVED***
goog.require('goog.dom');
goog.require('goog.net.jsloader');

// WARNING WARNING WARNING WARNING WARNING WARNING WARNING WARNING WARNING
//
// This class allows us (Google) to send data from non-Google and thus
// UNTRUSTED pages to our servers. Under NO CIRCUMSTANCES return
// anything sensitive, such as session or cookie specific data. Return
// only data that you want parties external to Google to have. Also
// NEVER use this method to send data from web pages to untrusted
// servers, or redirects to unknown servers (www.google.com/cache,
// /q=xx&btnl, /url, www.googlepages.com, etc.)
//
// WARNING WARNING WARNING WARNING WARNING WARNING WARNING WARNING WARNING



***REMOVED***
***REMOVED*** Creates a new cross domain channel that sends data to the specified
***REMOVED*** host URL. By default, if no reply arrives within 5s, the channel
***REMOVED*** assumes the call failed to complete successfully.
***REMOVED***
***REMOVED*** @param {goog.Uri|string} uri The Uri of the server side code that receives
***REMOVED***     data posted through this channel (e.g.,
***REMOVED***     "http://maps.google.com/maps/geo").
***REMOVED***
***REMOVED*** @param {string=} opt_callbackParamName The parameter name that is used to
***REMOVED***     specify the callback. Defaults to "callback".
***REMOVED***
***REMOVED***
***REMOVED***
goog.net.Jsonp = function(uri, opt_callbackParamName) {
 ***REMOVED*****REMOVED***
  ***REMOVED*** The uri_ object will be used to encode the payload that is sent to the
  ***REMOVED*** server.
  ***REMOVED*** @type {goog.Uri}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.uri_ = new goog.Uri(uri);

 ***REMOVED*****REMOVED***
  ***REMOVED*** This is the callback parameter name that is added to the uri.
  ***REMOVED*** @type {string}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.callbackParamName_ = opt_callbackParamName ?
      opt_callbackParamName : 'callback';

 ***REMOVED*****REMOVED***
  ***REMOVED*** The length of time, in milliseconds, this channel is prepared
  ***REMOVED*** to wait for for a request to complete. The default value is 5 seconds.
  ***REMOVED*** @type {number}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.timeout_ = 5000;
***REMOVED***


***REMOVED***
***REMOVED*** The name of the property of goog.global under which the callback is
***REMOVED*** stored.
***REMOVED***
goog.net.Jsonp.CALLBACKS = '_callbacks_';


***REMOVED***
***REMOVED*** Used to generate unique callback IDs. The counter must be global because
***REMOVED*** all channels share a common callback object.
***REMOVED*** @private
***REMOVED***
goog.net.Jsonp.scriptCounter_ = 0;


***REMOVED***
***REMOVED*** Sets the length of time, in milliseconds, this channel is prepared
***REMOVED*** to wait for for a request to complete. If the call is not competed
***REMOVED*** within the set time span, it is assumed to have failed. To wait
***REMOVED*** indefinitely for a request to complete set the timout to a negative
***REMOVED*** number.
***REMOVED***
***REMOVED*** @param {number} timeout The length of time before calls are
***REMOVED*** interrupted.
***REMOVED***
goog.net.Jsonp.prototype.setRequestTimeout = function(timeout) {
  this.timeout_ = timeout;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the current timeout value, in milliseconds.
***REMOVED***
***REMOVED*** @return {number} The timeout value.
***REMOVED***
goog.net.Jsonp.prototype.getRequestTimeout = function() {
  return this.timeout_;
***REMOVED***


***REMOVED***
***REMOVED*** Sends the given payload to the URL specified at the construction
***REMOVED*** time. The reply is delivered to the given replyCallback. If the
***REMOVED*** errorCallback is specified and the reply does not arrive within the
***REMOVED*** timeout period set on this channel, the errorCallback is invoked
***REMOVED*** with the original payload.
***REMOVED***
***REMOVED*** If no reply callback is specified, then the response is expected to
***REMOVED*** consist of calls to globally registered functions. No &callback=
***REMOVED*** URL parameter will be sent in the request, and the script element
***REMOVED*** will be cleaned up after the timeout.
***REMOVED***
***REMOVED*** @param {Object=} opt_payload Name-value pairs.  If given, these will be
***REMOVED***     added as parameters to the supplied URI as GET parameters to the
***REMOVED***     given server URI.
***REMOVED***
***REMOVED*** @param {Function=} opt_replyCallback A function expecting one
***REMOVED***     argument, called when the reply arrives, with the response data.
***REMOVED***
***REMOVED*** @param {Function=} opt_errorCallback A function expecting one
***REMOVED***     argument, called on timeout, with the payload (if given), otherwise
***REMOVED***     null.
***REMOVED***
***REMOVED*** @param {string=} opt_callbackParamValue Value to be used as the
***REMOVED***     parameter value for the callback parameter (callbackParamName).
***REMOVED***     To be used when the value needs to be fixed by the client for a
***REMOVED***     particular request, to make use of the cached responses for the request.
***REMOVED***     NOTE: If multiple requests are made with the same
***REMOVED***     opt_callbackParamValue, only the last call will work whenever the
***REMOVED***     response comes back.
***REMOVED***
***REMOVED*** @return {Object} A request descriptor that may be used to cancel this
***REMOVED***     transmission, or null, if the message may not be cancelled.
***REMOVED***
goog.net.Jsonp.prototype.send = function(opt_payload,
                                         opt_replyCallback,
                                         opt_errorCallback,
                                         opt_callbackParamValue) {

  var payload = opt_payload || null;

  var id = opt_callbackParamValue ||
      '_' + (goog.net.Jsonp.scriptCounter_++).toString(36) +
      goog.now().toString(36);

  if (!goog.global[goog.net.Jsonp.CALLBACKS]) {
    goog.global[goog.net.Jsonp.CALLBACKS] = {***REMOVED***
  }

  // Create a new Uri object onto which this payload will be added
  var uri = this.uri_.clone();
  if (payload) {
    goog.net.Jsonp.addPayloadToUri_(payload, uri);
  }

  if (opt_replyCallback) {
    var reply = goog.net.Jsonp.newReplyHandler_(id, opt_replyCallback);
    goog.global[goog.net.Jsonp.CALLBACKS][id] = reply;

    uri.setParameterValues(this.callbackParamName_,
                           goog.net.Jsonp.CALLBACKS + '.' + id);
  }

  var deferred = goog.net.jsloader.load(uri.toString(),
      {timeout: this.timeout_, cleanupWhenDone: true});
  var error = goog.net.Jsonp.newErrorHandler_(id, payload, opt_errorCallback);
  deferred.addErrback(error);

  return {id_: id, deferred_: deferred***REMOVED***
***REMOVED***


***REMOVED***
***REMOVED*** Cancels a given request. The request must be exactly the object returned by
***REMOVED*** the send method.
***REMOVED***
***REMOVED*** @param {Object} request The request object returned by the send method.
***REMOVED***
goog.net.Jsonp.prototype.cancel = function(request) {
  if (request) {
    if (request.deferred_) {
      request.deferred_.cancel();
    }
    if (request.id_) {
      goog.net.Jsonp.cleanup_(request.id_, false);
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** Creates a timeout callback that calls the given timeoutCallback with the
***REMOVED*** original payload.
***REMOVED***
***REMOVED*** @param {string} id The id of the script node.
***REMOVED*** @param {Object} payload The payload that was sent to the server.
***REMOVED*** @param {Function=} opt_errorCallback The function called on timeout.
***REMOVED*** @return {!Function} A zero argument function that handles callback duties.
***REMOVED*** @private
***REMOVED***
goog.net.Jsonp.newErrorHandler_ = function(id,
                                           payload,
                                           opt_errorCallback) {
 ***REMOVED*****REMOVED***
  ***REMOVED*** When we call across domains with a request, this function is the
  ***REMOVED*** timeout handler. Once it's done executing the user-specified
  ***REMOVED*** error-handler, it removes the script node and original function.
 ***REMOVED*****REMOVED***
  return function() {
    goog.net.Jsonp.cleanup_(id, false);
    if (opt_errorCallback) {
      opt_errorCallback(payload);
    }
 ***REMOVED*****REMOVED***
***REMOVED***


***REMOVED***
***REMOVED*** Creates a reply callback that calls the given replyCallback with data
***REMOVED*** returned by the server.
***REMOVED***
***REMOVED*** @param {string} id The id of the script node.
***REMOVED*** @param {Function} replyCallback The function called on reply.
***REMOVED*** @return {Function} A reply callback function.
***REMOVED*** @private
***REMOVED***
goog.net.Jsonp.newReplyHandler_ = function(id, replyCallback) {
 ***REMOVED*****REMOVED***
  ***REMOVED*** This function is the handler for the all-is-well response. It
  ***REMOVED*** clears the error timeout handler, calls the user's handler, then
  ***REMOVED*** removes the script node and itself.
  ***REMOVED***
  ***REMOVED*** @param {...Object} var_args The response data sent from the server.
 ***REMOVED*****REMOVED***
  return function(var_args) {
    goog.net.Jsonp.cleanup_(id, true);
    replyCallback.apply(undefined, arguments);
 ***REMOVED*****REMOVED***
***REMOVED***


***REMOVED***
***REMOVED*** Removes the script node and reply handler with the given id.
***REMOVED***
***REMOVED*** @param {string} id The id of the script node to be removed.
***REMOVED*** @param {boolean} deleteReplyHandler If true, delete the reply handler
***REMOVED***     instead of setting it to nullFunction (if we know the callback could
***REMOVED***     never be called again).
***REMOVED*** @private
***REMOVED***
goog.net.Jsonp.cleanup_ = function(id, deleteReplyHandler) {
  if (goog.global[goog.net.Jsonp.CALLBACKS][id]) {
    if (deleteReplyHandler) {
      delete goog.global[goog.net.Jsonp.CALLBACKS][id];
    } else {
      // Removing the script tag doesn't necessarily prevent the script
      // from firing, so we make the callback a noop.
      goog.global[goog.net.Jsonp.CALLBACKS][id] = goog.nullFunction;
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** Returns URL encoded payload. The payload should be a map of name-value
***REMOVED*** pairs, in the form {"foo": 1, "bar": true, ...}.  If the map is empty,
***REMOVED*** the URI will be unchanged.
***REMOVED***
***REMOVED*** <p>The method uses hasOwnProperty() to assure the properties are on the
***REMOVED*** object, not on its prototype.
***REMOVED***
***REMOVED*** @param {!Object} payload A map of value name pairs to be encoded.
***REMOVED***     A value may be specified as an array, in which case a query parameter
***REMOVED***     will be created for each value, e.g.:
***REMOVED***     {"foo": [1,2]} will encode to "foo=1&foo=2".
***REMOVED***
***REMOVED*** @param {!goog.Uri} uri A Uri object onto which the payload key value pairs
***REMOVED***     will be encoded.
***REMOVED***
***REMOVED*** @return {!goog.Uri} A reference to the Uri sent as a parameter.
***REMOVED*** @private
***REMOVED***
goog.net.Jsonp.addPayloadToUri_ = function(payload, uri) {
  for (var name in payload) {
    // NOTE(user): Safari/1.3 doesn't have hasOwnProperty(). In that
    // case, we iterate over all properties as a very lame workaround.
    if (!payload.hasOwnProperty || payload.hasOwnProperty(name)) {
      uri.setParameterValues(name, payload[name]);
    }
  }
  return uri;
***REMOVED***


// WARNING WARNING WARNING WARNING WARNING WARNING WARNING WARNING WARNING
//
// This class allows us (Google) to send data from non-Google and thus
// UNTRUSTED pages to our servers. Under NO CIRCUMSTANCES return
// anything sensitive, such as session or cookie specific data. Return
// only data that you want parties external to Google to have. Also
// NEVER use this method to send data from web pages to untrusted
// servers, or redirects to unknown servers (www.google.com/cache,
// /q=xx&btnl, /url, www.googlepages.com, etc.)
//
// WARNING WARNING WARNING WARNING WARNING WARNING WARNING WARNING WARNING
