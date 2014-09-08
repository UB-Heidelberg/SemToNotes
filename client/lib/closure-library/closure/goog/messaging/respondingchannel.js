// Copyright 2012 The Closure Library Authors. All Rights Reserved.
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
***REMOVED*** @fileoverview Definition of goog.messaging.RespondingChannel, which wraps a
***REMOVED*** MessageChannel and allows the user to get the response from the services.
***REMOVED***
***REMOVED***


goog.provide('goog.messaging.RespondingChannel');

goog.require('goog.Disposable');
goog.require('goog.log');
goog.require('goog.messaging.MessageChannel'); // interface
goog.require('goog.messaging.MultiChannel');
goog.require('goog.messaging.MultiChannel.VirtualChannel');



***REMOVED***
***REMOVED*** Creates a new RespondingChannel wrapping a single MessageChannel.
***REMOVED*** @param {goog.messaging.MessageChannel} messageChannel The messageChannel to
***REMOVED***     to wrap and allow for responses. This channel must not have any existing
***REMOVED***     services registered. All service registration must be done through the
***REMOVED***     {@link RespondingChannel#registerService} api instead. The other end of
***REMOVED***     channel must also be a RespondingChannel.
***REMOVED***
***REMOVED*** @extends {goog.Disposable}
***REMOVED***
goog.messaging.RespondingChannel = function(messageChannel) {
  goog.messaging.RespondingChannel.base(this, 'constructor');

 ***REMOVED*****REMOVED***
  ***REMOVED*** The message channel wrapped in a MultiChannel so we can send private and
  ***REMOVED*** public messages on it.
  ***REMOVED*** @type {goog.messaging.MultiChannel}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.messageChannel_ = new goog.messaging.MultiChannel(messageChannel);

 ***REMOVED*****REMOVED***
  ***REMOVED*** Map of invocation signatures to function callbacks. These are used to keep
  ***REMOVED*** track of the asyncronous service invocations so the result of a service
  ***REMOVED*** call can be passed back to a callback in the calling frame.
  ***REMOVED*** @type {Object.<number, function(Object)>}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.sigCallbackMap_ = {***REMOVED***

 ***REMOVED*****REMOVED***
  ***REMOVED*** The virtual channel to send private messages on.
  ***REMOVED*** @type {goog.messaging.MultiChannel.VirtualChannel}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.privateChannel_ = this.messageChannel_.createVirtualChannel(
      goog.messaging.RespondingChannel.PRIVATE_CHANNEL_);

 ***REMOVED*****REMOVED***
  ***REMOVED*** The virtual channel to send public messages on.
  ***REMOVED*** @type {goog.messaging.MultiChannel.VirtualChannel}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.publicChannel_ = this.messageChannel_.createVirtualChannel(
      goog.messaging.RespondingChannel.PUBLIC_CHANNEL_);

  this.privateChannel_.registerService(
      goog.messaging.RespondingChannel.CALLBACK_SERVICE_,
      goog.bind(this.callbackServiceHandler_, this),
      true);
***REMOVED***
goog.inherits(goog.messaging.RespondingChannel, goog.Disposable);


***REMOVED***
***REMOVED*** The name of the method invocation callback service (used internally).
***REMOVED*** @type {string}
***REMOVED*** @const
***REMOVED*** @private
***REMOVED***
goog.messaging.RespondingChannel.CALLBACK_SERVICE_ = 'mics';


***REMOVED***
***REMOVED*** The name of the channel to send private control messages on.
***REMOVED*** @type {string}
***REMOVED*** @const
***REMOVED*** @private
***REMOVED***
goog.messaging.RespondingChannel.PRIVATE_CHANNEL_ = 'private';


***REMOVED***
***REMOVED*** The name of the channel to send public messages on.
***REMOVED*** @type {string}
***REMOVED*** @const
***REMOVED*** @private
***REMOVED***
goog.messaging.RespondingChannel.PUBLIC_CHANNEL_ = 'public';


***REMOVED***
***REMOVED*** The next signature index to save the callback against.
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.messaging.RespondingChannel.prototype.nextSignatureIndex_ = 0;


***REMOVED***
***REMOVED*** Logger object for goog.messaging.RespondingChannel.
***REMOVED*** @type {goog.log.Logger}
***REMOVED*** @private
***REMOVED***
goog.messaging.RespondingChannel.prototype.logger_ =
    goog.log.getLogger('goog.messaging.RespondingChannel');


***REMOVED***
***REMOVED*** Gets a random number to use for method invocation results.
***REMOVED*** @return {number} A unique random signature.
***REMOVED*** @private
***REMOVED***
goog.messaging.RespondingChannel.prototype.getNextSignature_ = function() {
  return this.nextSignatureIndex_++;
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.messaging.RespondingChannel.prototype.disposeInternal = function() {
  goog.dispose(this.messageChannel_);
  delete this.messageChannel_;
  // Note: this.publicChannel_ and this.privateChannel_ get disposed by
  //     this.messageChannel_
  delete this.publicChannel_;
  delete this.privateChannel_;
***REMOVED***


***REMOVED***
***REMOVED*** Sends a message over the channel.
***REMOVED*** @param {string} serviceName The name of the service this message should be
***REMOVED***     delivered to.
***REMOVED*** @param {string|!Object} payload The value of the message. If this is an
***REMOVED***     Object, it is serialized to a string before sending if necessary.
***REMOVED*** @param {function(?Object)} callback The callback invoked with
***REMOVED***     the result of the service call.
***REMOVED***
goog.messaging.RespondingChannel.prototype.send = function(
    serviceName,
    payload,
    callback) {

  var signature = this.getNextSignature_();
  this.sigCallbackMap_[signature] = callback;

  var message = {***REMOVED***
  message['signature'] = signature;
  message['data'] = payload;

  this.publicChannel_.send(serviceName, message);
***REMOVED***


***REMOVED***
***REMOVED*** Receives the results of the peer's service results.
***REMOVED*** @param {!Object|string} message The results from the remote service
***REMOVED***     invocation.
***REMOVED*** @private
***REMOVED***
goog.messaging.RespondingChannel.prototype.callbackServiceHandler_ = function(
    message) {

  var signature = message['signature'];
  var result = message['data'];

  if (signature in this.sigCallbackMap_) {
    var callback =***REMOVED*****REMOVED*** @type {function(Object)}***REMOVED*** (this.sigCallbackMap_[
        signature]);
    callback(result);
    delete this.sigCallbackMap_[signature];
  } else {
    goog.log.warning(this.logger_, 'Received signature is invalid');
  }
***REMOVED***


***REMOVED***
***REMOVED*** Registers a service to be called when a message is received.
***REMOVED*** @param {string} serviceName The name of the service.
***REMOVED*** @param {function(!Object)} callback The callback to process the
***REMOVED***     incoming messages. Passed the payload.
***REMOVED***
goog.messaging.RespondingChannel.prototype.registerService = function(
    serviceName, callback) {
  this.publicChannel_.registerService(
      serviceName,
      goog.bind(this.callbackProxy_, this, callback),
      true);
***REMOVED***


***REMOVED***
***REMOVED*** A intermediary proxy for service callbacks to be invoked and return their
***REMOVED*** their results to the remote caller's callback.
***REMOVED*** @param {function((string|!Object))} callback The callback to process the
***REMOVED***     incoming messages. Passed the payload.
***REMOVED*** @param {!Object|string} message The message containing the signature and
***REMOVED***     the data to invoke the service callback with.
***REMOVED*** @private
***REMOVED***
goog.messaging.RespondingChannel.prototype.callbackProxy_ = function(
    callback, message) {

  var resultMessage = {***REMOVED***
  resultMessage['data'] = callback(message['data']);
  resultMessage['signature'] = message['signature'];
  // The callback invoked above may have disposed the channel so check if it
  // exists.
  if (this.privateChannel_) {
    this.privateChannel_.send(
        goog.messaging.RespondingChannel.CALLBACK_SERVICE_,
        resultMessage);
  }
***REMOVED***
