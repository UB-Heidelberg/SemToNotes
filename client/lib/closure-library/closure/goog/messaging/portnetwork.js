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
***REMOVED*** @fileoverview An interface for classes that connect a collection of HTML5
***REMOVED*** message-passing entities ({@link MessagePort}s, {@link Worker}s, and
***REMOVED*** {@link Window}s) and allow them to seamlessly communicate with one another.
***REMOVED***
***REMOVED*** Conceptually, a PortNetwork is a collection of JS contexts, such as pages (in
***REMOVED*** or outside of iframes) or web workers. Each context has a unique name, and
***REMOVED*** each one can communicate with any of the others in the same network. This
***REMOVED*** communication takes place through a {@link goog.messaging.PortChannel} that
***REMOVED*** is retrieved via {#link goog.messaging.PortNetwork#dial}.
***REMOVED***
***REMOVED*** One context (usually the main page) has a
***REMOVED*** {@link goog.messaging.PortOperator}, which is in charge of connecting each
***REMOVED*** context to each other context. All other contexts have
***REMOVED*** {@link goog.messaging.PortCaller}s which connect to the operator.
***REMOVED***
***REMOVED***

goog.provide('goog.messaging.PortNetwork');



***REMOVED***
***REMOVED*** @interface
***REMOVED***
goog.messaging.PortNetwork = function() {***REMOVED***


***REMOVED***
***REMOVED*** Returns a message channel that communicates with the named context. If no
***REMOVED*** such port exists, an error will either be thrown immediately or after a round
***REMOVED*** trip with the operator, depending on whether this pool is the operator or a
***REMOVED*** caller.
***REMOVED***
***REMOVED*** If context A calls dial('B') and context B calls dial('A'), the two
***REMOVED*** ports returned will be connected to one another.
***REMOVED***
***REMOVED*** @param {string} name The name of the context to get.
***REMOVED*** @return {goog.messaging.MessageChannel} The channel communicating with the
***REMOVED***     given context. This is either a {@link goog.messaging.PortChannel} or a
***REMOVED***     decorator around a PortChannel, so it's safe to send {@link MessagePorts}
***REMOVED***     across it. This will be disposed along with the PortNetwork.
***REMOVED***
goog.messaging.PortNetwork.prototype.dial = function(name) {***REMOVED***


***REMOVED***
***REMOVED*** The name of the service exported by the operator for creating a connection
***REMOVED*** between two callers.
***REMOVED***
***REMOVED*** @type {string}
***REMOVED*** @const
***REMOVED***
goog.messaging.PortNetwork.REQUEST_CONNECTION_SERVICE = 'requestConnection';


***REMOVED***
***REMOVED*** The name of the service exported by the callers for adding a connection to
***REMOVED*** another context.
***REMOVED***
***REMOVED*** @type {string}
***REMOVED*** @const
***REMOVED***
goog.messaging.PortNetwork.GRANT_CONNECTION_SERVICE = 'grantConnection';
