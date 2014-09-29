// Copyright 2010 The Closure Library Authors. All Rights Reserved.
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
***REMOVED*** @fileoverview An interface for asynchronous message-passing channels.
***REMOVED***
***REMOVED*** This interface is useful for writing code in a message-passing style that's
***REMOVED*** independent of the underlying communication medium. It's also useful for
***REMOVED*** adding decorators that wrap message channels and add extra functionality on
***REMOVED*** top. For example, {@link goog.messaging.BufferedChannel} enqueues messages
***REMOVED*** until communication is established, while {@link goog.messaging.MultiChannel}
***REMOVED*** splits a single underlying channel into multiple virtual ones.
***REMOVED***
***REMOVED*** Decorators should be passed their underlying channel(s) in the constructor,
***REMOVED*** and should assume that those channels are already connected. Decorators are
***REMOVED*** responsible for disposing of the channels they wrap when the decorators
***REMOVED*** themselves are disposed. Decorators should also follow the APIs of the
***REMOVED*** individual methods listed below.
***REMOVED***
***REMOVED***


goog.provide('goog.messaging.MessageChannel');



***REMOVED***
***REMOVED*** @interface
***REMOVED***
goog.messaging.MessageChannel = function() {***REMOVED***


***REMOVED***
***REMOVED*** Initiates the channel connection. When this method is called, all the
***REMOVED*** information needed to connect the channel has to be available.
***REMOVED***
***REMOVED*** Implementers should only require this method to be called if the channel
***REMOVED*** needs to be configured in some way between when it's created and when it
***REMOVED*** becomes active. Otherwise, the channel should be immediately active and this
***REMOVED*** method should do nothing but immediately call opt_connectCb.
***REMOVED***
***REMOVED*** @param {Function=} opt_connectCb Called when the channel has been connected
***REMOVED***     and is ready to use.
***REMOVED***
goog.messaging.MessageChannel.prototype.connect = function(opt_connectCb) {***REMOVED***


***REMOVED***
***REMOVED*** Gets whether the channel is connected.
***REMOVED***
***REMOVED*** If {@link #connect} is not required for this class, this should always return
***REMOVED*** true. Otherwise, this should return true by the time the callback passed to
***REMOVED*** {@link #connect} has been called and always after that.
***REMOVED***
***REMOVED*** @return {boolean} Whether the channel is connected.
***REMOVED***
goog.messaging.MessageChannel.prototype.isConnected = function() {***REMOVED***


***REMOVED***
***REMOVED*** Registers a service to be called when a message is received.
***REMOVED***
***REMOVED*** Implementers shouldn't impose any restrictions on the service names that may
***REMOVED*** be registered. If some services are needed as control codes,
***REMOVED*** {@link goog.messaging.MultiMessageChannel} can be used to safely split the
***REMOVED*** channel into "public" and "control" virtual channels.
***REMOVED***
***REMOVED*** @param {string} serviceName The name of the service.
***REMOVED*** @param {function((string|!Object))} callback The callback to process the
***REMOVED***     incoming messages. Passed the payload. If opt_objectPayload is set, the
***REMOVED***     payload is decoded and passed as an object.
***REMOVED*** @param {boolean=} opt_objectPayload If true, incoming messages for this
***REMOVED***     service are expected to contain an object, and will be deserialized from
***REMOVED***     a string automatically if necessary. It's the responsibility of
***REMOVED***     implementors of this class to perform the deserialization.
***REMOVED***
goog.messaging.MessageChannel.prototype.registerService =
    function(serviceName, callback, opt_objectPayload) {***REMOVED***


***REMOVED***
***REMOVED*** Registers a service to be called when a message is received that doesn't
***REMOVED*** match any other services.
***REMOVED***
***REMOVED*** @param {function(string, (string|!Object))} callback The callback to process
***REMOVED***     the incoming messages. Passed the service name and the payload. Since
***REMOVED***     some channels can pass objects natively, the payload may be either an
***REMOVED***     object or a string.
***REMOVED***
goog.messaging.MessageChannel.prototype.registerDefaultService =
    function(callback) {***REMOVED***


***REMOVED***
***REMOVED*** Sends a message over the channel.
***REMOVED***
***REMOVED*** @param {string} serviceName The name of the service this message should be
***REMOVED***     delivered to.
***REMOVED*** @param {string|!Object} payload The value of the message. If this is an
***REMOVED***     Object, it is serialized to a string before sending if necessary. It's
***REMOVED***     the responsibility of implementors of this class to perform the
***REMOVED***     serialization.
***REMOVED***
goog.messaging.MessageChannel.prototype.send =
    function(serviceName, payload) {***REMOVED***
