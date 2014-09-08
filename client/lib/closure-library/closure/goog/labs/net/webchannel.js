// Copyright 2013 The Closure Library Authors. All Rights Reserved.
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
***REMOVED*** @fileoverview The API spec for the WebChannel messaging library.
***REMOVED***
***REMOVED*** Similar to HTML5 WebSocket and Closure BrowserChannel, WebChannel
***REMOVED*** offers an abstraction for point-to-point socket-like communication between
***REMOVED*** a browser client and a remote origin.
***REMOVED***
***REMOVED*** WebChannels are created via <code>WebChannel</code>. Multiple WebChannels
***REMOVED*** may be multiplexed over the same WebChannelTransport, which represents
***REMOVED*** the underlying physical connectivity over standard wire protocols
***REMOVED*** such as HTTP and SPDY.
***REMOVED***
***REMOVED*** A WebChannels in turn represents a logical communication channel between
***REMOVED*** the client and server end point. A WebChannel remains open for
***REMOVED*** as long as the client or server end-point allows.
***REMOVED***
***REMOVED*** Messages may be delivered in-order or out-of-order, reliably or unreliably
***REMOVED*** over the same WebChannel. Message delivery guarantees of a WebChannel is
***REMOVED*** to be specified by the application code; and the choice of the
***REMOVED*** underlying wire protocols is completely transparent to the API users.
***REMOVED***
***REMOVED*** Client-to-client messaging via WebRTC based transport may also be support
***REMOVED*** via the same WebChannel API in future.
***REMOVED***
***REMOVED***

goog.provide('goog.net.WebChannel');

***REMOVED***
goog.require('goog.events.Event');



***REMOVED***
***REMOVED*** A WebChannel represents a logical bi-directional channel over which the
***REMOVED*** client communicates with a remote server that holds the other endpoint
***REMOVED*** of the channel. A WebChannel is always created in the context of a shared
***REMOVED*** {@link WebChannelTransport} instance. It is up to the underlying client-side
***REMOVED*** and server-side implementations to decide how or when multiplexing is
***REMOVED*** to be enabled.
***REMOVED***
***REMOVED*** @interface
***REMOVED*** @extends {EventTarget}
***REMOVED***
goog.net.WebChannel = function() {***REMOVED***


***REMOVED***
***REMOVED*** Configuration spec for newly created WebChannel instances.
***REMOVED***
***REMOVED*** WebChannels are configured in the context of the containing
***REMOVED*** {@link WebChannelTransport}. The configuration parameters are specified
***REMOVED*** when a new instance of WebChannel is created via {@link WebChannelTransport}.
***REMOVED***
***REMOVED*** messageHeaders: custom headers to be added to every message sent to the
***REMOVED*** server.
***REMOVED***
***REMOVED*** messageUrlParams: custom url query parameters to be added to every message
***REMOVED*** sent to the server.
***REMOVED***
***REMOVED*** concurrentRequestLimit: the maximum number of in-flight HTTP requests allowed
***REMOVED*** when SPDY is enabled. Currently we only detect SPDY in Chrome.
***REMOVED*** This parameter defaults to 10. When SPDY is not enabled, this parameter
***REMOVED*** will have no effect.
***REMOVED***
***REMOVED*** supportsCrossDomainXhr: setting this to true to allow the use of sub-domains
***REMOVED*** (as configured by the server) to send XHRs with the CORS withCredentials
***REMOVED*** bit set to true.
***REMOVED***
***REMOVED*** testUrl: the test URL for detecting connectivity during the initial
***REMOVED*** handshake. This parameter defaults to "/<channel_url>/test".
***REMOVED***
***REMOVED***
***REMOVED*** @typedef {{
***REMOVED***   messageHeaders: (!Object.<string, string>|undefined),
***REMOVED***   messageUrlParams: (!Object.<string, string>|undefined),
***REMOVED***   concurrentRequestLimit: (number|undefined),
***REMOVED***   supportsCrossDomainXhr: (boolean|undefined),
***REMOVED***   testUrl: (string|undefined)
***REMOVED*** }}
***REMOVED***
goog.net.WebChannel.Options;


***REMOVED***
***REMOVED*** Types that are allowed as message data.
***REMOVED***
***REMOVED*** @typedef {(ArrayBuffer|Blob|Object.<string, string>|Array)}
***REMOVED***
goog.net.WebChannel.MessageData;


***REMOVED***
***REMOVED*** Open the WebChannel against the URI specified in the constructor.
***REMOVED***
goog.net.WebChannel.prototype.open = goog.abstractMethod;


***REMOVED***
***REMOVED*** Close the WebChannel.
***REMOVED***
goog.net.WebChannel.prototype.close = goog.abstractMethod;


***REMOVED***
***REMOVED*** Sends a message to the server that maintains the other end point of
***REMOVED*** the WebChannel.
***REMOVED***
***REMOVED*** @param {!goog.net.WebChannel.MessageData} message The message to send.
***REMOVED***
goog.net.WebChannel.prototype.send = goog.abstractMethod;


***REMOVED***
***REMOVED*** Common events fired by WebChannels.
***REMOVED*** @enum {string}
***REMOVED***
goog.net.WebChannel.EventType = {
 ***REMOVED*****REMOVED*** Dispatched when the channel is opened.***REMOVED***
  OPEN: goog.events.getUniqueId('open'),

 ***REMOVED*****REMOVED*** Dispatched when the channel is closed.***REMOVED***
  CLOSE: goog.events.getUniqueId('close'),

 ***REMOVED*****REMOVED*** Dispatched when the channel is aborted due to errors.***REMOVED***
  ERROR: goog.events.getUniqueId('error'),

 ***REMOVED*****REMOVED*** Dispatched when the channel has received a new message.***REMOVED***
  MESSAGE: goog.events.getUniqueId('message')
***REMOVED***



***REMOVED***
***REMOVED*** The event interface for the MESSAGE event.
***REMOVED***
***REMOVED***
***REMOVED*** @extends {goog.events.Event}
***REMOVED***
goog.net.WebChannel.MessageEvent = function() {
  goog.net.WebChannel.MessageEvent.base(
      this, 'constructor', goog.net.WebChannel.EventType.MESSAGE);
***REMOVED***
goog.inherits(goog.net.WebChannel.MessageEvent, goog.events.Event);


***REMOVED***
***REMOVED*** The content of the message received from the server.
***REMOVED***
***REMOVED*** @type {!goog.net.WebChannel.MessageData}
***REMOVED***
goog.net.WebChannel.MessageEvent.prototype.data;


***REMOVED***
***REMOVED*** WebChannel level error conditions.
***REMOVED*** @enum {number}
***REMOVED***
goog.net.WebChannel.ErrorStatus = {
 ***REMOVED*****REMOVED*** No error has occurred.***REMOVED***
  OK: 0,

 ***REMOVED*****REMOVED*** Communication to the server has failed.***REMOVED***
  NETWORK_ERROR: 1,

 ***REMOVED*****REMOVED*** The server fails to accept the WebChannel.***REMOVED***
  SERVER_ERROR: 2
***REMOVED***



***REMOVED***
***REMOVED*** The event interface for the ERROR event.
***REMOVED***
***REMOVED***
***REMOVED*** @extends {goog.events.Event}
***REMOVED***
goog.net.WebChannel.ErrorEvent = function() {
  goog.net.WebChannel.ErrorEvent.base(
      this, 'constructor', goog.net.WebChannel.EventType.ERROR);
***REMOVED***
goog.inherits(goog.net.WebChannel.ErrorEvent, goog.events.Event);


***REMOVED***
***REMOVED*** The error status.
***REMOVED***
***REMOVED*** @type {!goog.net.WebChannel.ErrorStatus}
***REMOVED***
goog.net.WebChannel.ErrorEvent.prototype.status;


***REMOVED***
***REMOVED*** @return {!goog.net.WebChannel.RuntimeProperties} The runtime properties
***REMOVED*** of the WebChannel instance.
***REMOVED***
goog.net.WebChannel.prototype.getRuntimeProperties = goog.abstractMethod;



***REMOVED***
***REMOVED*** The readonly runtime properties of the WebChannel instance.
***REMOVED***
***REMOVED*** This class is defined for debugging and monitoring purposes, and for
***REMOVED*** optimization functions that the application may choose to manage by itself.
***REMOVED***
***REMOVED*** @interface
***REMOVED***
goog.net.WebChannel.RuntimeProperties = function() {***REMOVED***


***REMOVED***
***REMOVED*** @return {number} The effective limit for the number of concurrent HTTP
***REMOVED*** requests that are allowed to be made for sending messages from the client
***REMOVED*** to the server. When SPDY is not enabled, this limit will be one.
***REMOVED***
goog.net.WebChannel.RuntimeProperties.prototype.getConcurrentRequestLimit =
    goog.abstractMethod;


***REMOVED***
***REMOVED*** For applications that need support multiple channels (e.g. from
***REMOVED*** different tabs) to the same origin, use this method to decide if SPDY is
***REMOVED*** enabled and therefore it is safe to open multiple channels.
***REMOVED***
***REMOVED*** If SPDY is disabled, the application may choose to limit the number of active
***REMOVED*** channels to one or use other means such as sub-domains to work around
***REMOVED*** the browser connection limit.
***REMOVED***
***REMOVED*** @return {boolean} Whether SPDY is enabled for the origin against which
***REMOVED*** the channel is created.
***REMOVED***
goog.net.WebChannel.RuntimeProperties.prototype.isSpdyEnabled =
    goog.abstractMethod;


***REMOVED***
***REMOVED*** This method may be used by the application to stop ack of received messages
***REMOVED*** as a means of enabling or disabling flow-control on the server-side.
***REMOVED***
***REMOVED*** @param {boolean} enabled If true, enable flow-control behavior on the
***REMOVED*** server side. Setting it to false will cancel ay previous enabling action.
***REMOVED***
goog.net.WebChannel.RuntimeProperties.prototype.setServerFlowControl =
    goog.abstractMethod;


***REMOVED***
***REMOVED*** This method may be used by the application to throttle the rate of outgoing
***REMOVED*** messages, as a means of sender initiated flow-control.
***REMOVED***
***REMOVED*** @return {number} The total number of messages that have not received
***REMOVED*** ack from the server and therefore remain in the buffer.
***REMOVED***
goog.net.WebChannel.RuntimeProperties.prototype.getNonAckedMessageCount =
    goog.abstractMethod;
