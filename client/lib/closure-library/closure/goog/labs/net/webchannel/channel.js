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
***REMOVED*** @fileoverview A shared interface for WebChannelBase and BaseTestChannel.
***REMOVED***
***REMOVED*** @visibility {:internal}
***REMOVED***


goog.provide('goog.labs.net.webChannel.Channel');



***REMOVED***
***REMOVED*** Shared interface between Channel and TestChannel to support callbacks
***REMOVED*** between WebChannelBase and BaseTestChannel and between Channel and
***REMOVED*** ChannelRequest.
***REMOVED***
***REMOVED*** @interface
***REMOVED***
goog.labs.net.webChannel.Channel = function() {***REMOVED***


goog.scope(function() {
var Channel = goog.labs.net.webChannel.Channel;


***REMOVED***
***REMOVED*** Determines whether to use a secondary domain when the server gives us
***REMOVED*** a host prefix. This allows us to work around browser per-domain
***REMOVED*** connection limits.
***REMOVED***
***REMOVED*** Currently, we  use secondary domains when using Trident's ActiveXObject,
***REMOVED*** because it supports cross-domain requests out of the box.  Note that in IE10
***REMOVED*** we no longer use ActiveX since it's not supported in Metro mode and IE10
***REMOVED*** supports XHR streaming.
***REMOVED***
***REMOVED*** If you need to use secondary domains on other browsers and IE10,
***REMOVED*** you have two choices:
***REMOVED***     1) If you only care about browsers that support CORS
***REMOVED***        (https://developer.mozilla.org/en-US/docs/HTTP_access_control), you
***REMOVED***        can use {@link #setSupportsCrossDomainXhrs} and set the appropriate
***REMOVED***        CORS response headers on the server.
***REMOVED***     2) Or, override this method in a subclass, and make sure that those
***REMOVED***        browsers use some messaging mechanism that works cross-domain (e.g
***REMOVED***        iframes and window.postMessage).
***REMOVED***
***REMOVED*** @return {boolean} Whether to use secondary domains.
***REMOVED*** @see http://code.google.com/p/closure-library/issues/detail?id=339
***REMOVED***
Channel.prototype.shouldUseSecondaryDomains = goog.abstractMethod;


***REMOVED***
***REMOVED*** Called when creating an XhrIo object.  Override in a subclass if
***REMOVED*** you need to customize the behavior, for example to enable the creation of
***REMOVED*** XHR's capable of calling a secondary domain. Will also allow calling
***REMOVED*** a secondary domain if withCredentials (CORS) is enabled.
***REMOVED*** @param {?string} hostPrefix The host prefix, if we need an XhrIo object
***REMOVED***     capable of calling a secondary domain.
***REMOVED*** @return {!goog.net.XhrIo} A new XhrIo object.
***REMOVED***
Channel.prototype.createXhrIo = goog.abstractMethod;


***REMOVED***
***REMOVED*** Callback from ChannelRequest that indicates a request has completed.
***REMOVED*** @param {!goog.labs.net.webChannel.ChannelRequest} request
***REMOVED***     The request object.
***REMOVED***
Channel.prototype.onRequestComplete = goog.abstractMethod;


***REMOVED***
***REMOVED*** Returns whether the channel is closed
***REMOVED*** @return {boolean} true if the channel is closed.
***REMOVED***
Channel.prototype.isClosed = goog.abstractMethod;


***REMOVED***
***REMOVED*** Callback from ChannelRequest for when new data is received
***REMOVED*** @param {goog.labs.net.webChannel.ChannelRequest} request
***REMOVED***     The request object.
***REMOVED*** @param {string} responseText The text of the response.
***REMOVED***
Channel.prototype.onRequestData = goog.abstractMethod;


***REMOVED***
***REMOVED*** Gets whether this channel is currently active. This is used to determine the
***REMOVED*** length of time to wait before retrying. This call delegates to the handler.
***REMOVED*** @return {boolean} Whether the channel is currently active.
***REMOVED***
Channel.prototype.isActive = goog.abstractMethod;


***REMOVED***
***REMOVED*** Not needed for testchannel.
***REMOVED***
***REMOVED*** Gets the Uri used for the connection that sends data to the server.
***REMOVED*** @param {string} path The path on the host.
***REMOVED*** @return {goog.Uri} The forward channel URI.
***REMOVED***
Channel.prototype.getForwardChannelUri = goog.abstractMethod;


***REMOVED***
***REMOVED*** Not needed for testchannel.
***REMOVED***
***REMOVED*** Gets the Uri used for the connection that receives data from the server.
***REMOVED*** @param {?string} hostPrefix The host prefix.
***REMOVED*** @param {string} path The path on the host.
***REMOVED*** @return {goog.Uri} The back channel URI.
***REMOVED***
Channel.prototype.getBackChannelUri = goog.abstractMethod;


***REMOVED***
***REMOVED*** Not needed for testchannel.
***REMOVED***
***REMOVED*** Allows the handler to override a host prefix provided by the server.  Will
***REMOVED*** be called whenever the channel has received such a prefix and is considering
***REMOVED*** its use.
***REMOVED*** @param {?string} serverHostPrefix The host prefix provided by the server.
***REMOVED*** @return {?string} The host prefix the client should use.
***REMOVED***
Channel.prototype.correctHostPrefix = goog.abstractMethod;


***REMOVED***
***REMOVED*** Not needed for testchannel.
***REMOVED***
***REMOVED*** Creates a data Uri applying logic for secondary hostprefix, port
***REMOVED*** overrides, and versioning.
***REMOVED*** @param {?string} hostPrefix The host prefix.
***REMOVED*** @param {string} path The path on the host (may be absolute or relative).
***REMOVED*** @param {number=} opt_overridePort Optional override port.
***REMOVED*** @return {goog.Uri} The data URI.
***REMOVED***
Channel.prototype.createDataUri = goog.abstractMethod;


***REMOVED***
***REMOVED*** Not needed for testchannel.
***REMOVED***
***REMOVED*** Callback from TestChannel for when the channel is finished.
***REMOVED*** @param {goog.labs.net.webChannel.BaseTestChannel} testChannel
***REMOVED***     The TestChannel.
***REMOVED*** @param {boolean} useChunked  Whether we can chunk responses.
***REMOVED***
Channel.prototype.testConnectionFinished = goog.abstractMethod;


***REMOVED***
***REMOVED*** Not needed for testchannel.
***REMOVED***
***REMOVED*** Callback from TestChannel for when the channel has an error.
***REMOVED*** @param {goog.labs.net.webChannel.BaseTestChannel} testChannel
***REMOVED***     The TestChannel.
***REMOVED*** @param {goog.labs.net.webChannel.ChannelRequest.Error} errorCode
***REMOVED***     The error code of the failure.
***REMOVED***
Channel.prototype.testConnectionFailure = goog.abstractMethod;


***REMOVED***
***REMOVED*** Not needed for testchannel.
***REMOVED*** Gets the result of previous connectivity tests.
***REMOVED***
***REMOVED*** @return {!goog.labs.net.webChannel.ConnectionState} The connectivity state.
***REMOVED***
Channel.prototype.getConnectionState = goog.abstractMethod;
});  // goog.scope
