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
***REMOVED*** @fileoverview Transport support for WebChannel.
***REMOVED***
***REMOVED*** The <code>WebChannelTransport</code> implementation serves as the factory
***REMOVED*** for <code>WebChannel</code>, which offers an abstraction for
***REMOVED*** point-to-point socket-like communication similar to what BrowserChannel
***REMOVED*** or HTML5 WebSocket offers.
***REMOVED***
***REMOVED***

goog.provide('goog.net.WebChannelTransport');



***REMOVED***
***REMOVED*** A WebChannelTransport instance represents a shared context of logical
***REMOVED*** connectivity between a browser client and a remote origin.
***REMOVED***
***REMOVED*** Over a single WebChannelTransport instance, multiple WebChannels may be
***REMOVED*** created against different URLs, which may all share the same
***REMOVED*** underlying connectivity (i.e. TCP connection) whenever possible.
***REMOVED***
***REMOVED*** When multi-domains are supported, such as CORS, multiple origins may be
***REMOVED*** supported over a single WebChannelTransport instance at the same time.
***REMOVED***
***REMOVED*** Sharing between different window contexts such as tabs is not addressed
***REMOVED*** by WebChannelTransport. Applications may choose HTML5 shared workers
***REMOVED*** or other techniques to access the same transport instance
***REMOVED*** across different window contexts.
***REMOVED***
***REMOVED*** @interface
***REMOVED***
goog.net.WebChannelTransport = function() {***REMOVED***


***REMOVED***
***REMOVED*** The latest protocol version. The protocol version is requested
***REMOVED*** from the server which is responsible for terminating the underlying
***REMOVED*** wire protocols.
***REMOVED***
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.net.WebChannelTransport.LATEST_VERSION_ = 0;


***REMOVED***
***REMOVED*** Create a new WebChannel instance.
***REMOVED***
***REMOVED*** The new WebChannel is to be opened against the server-side resource
***REMOVED*** as specified by the given URL. See {@link goog.net.WebChannel} for detailed
***REMOVED*** semantics.
***REMOVED***
***REMOVED*** @param {string} url The URL path for the new WebChannel instance.
***REMOVED*** @param {!goog.net.WebChannel.Options=} opt_options Configuration for the
***REMOVED***     new WebChannel instance. The configuration object is reusable after
***REMOVED***     the new channel instance is created.
***REMOVED*** @return {!goog.net.WebChannel} the newly created WebChannel instance.
***REMOVED***
goog.net.WebChannelTransport.prototype.createWebChannel = goog.abstractMethod;
