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
***REMOVED*** @fileoverview A wrapper for asynchronous message-passing channels that buffer
***REMOVED*** their output until both ends of the channel are connected.
***REMOVED***
***REMOVED***

goog.provide('goog.messaging.BufferedChannel');

goog.require('goog.Timer');
***REMOVED***
goog.require('goog.debug.Error');
goog.require('goog.debug.Logger');
***REMOVED***
goog.require('goog.messaging.MessageChannel');
goog.require('goog.messaging.MultiChannel');



***REMOVED***
***REMOVED*** Creates a new BufferedChannel, which operates like its underlying channel
***REMOVED*** except that it buffers calls to send until it receives a message from its
***REMOVED*** peer claiming that the peer is ready to receive.  The peer is also expected
***REMOVED*** to be a BufferedChannel, though this is not enforced.
***REMOVED***
***REMOVED*** @param {!goog.messaging.MessageChannel} messageChannel The MessageChannel
***REMOVED***     we're wrapping.
***REMOVED*** @param {number=} opt_interval Polling interval for sending ready
***REMOVED***     notifications to peer, in ms.  Default is 50.
***REMOVED***
***REMOVED*** @extends {goog.Disposable}
***REMOVED*** @implements {goog.messaging.MessageChannel***REMOVED***
***REMOVED***
goog.messaging.BufferedChannel = function(messageChannel, opt_interval) {
  goog.Disposable.call(this);

 ***REMOVED*****REMOVED***
  ***REMOVED*** Buffer of messages to be sent when the channel's peer is ready.
  ***REMOVED***
  ***REMOVED*** @type {Array.<Object>}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.buffer_ = [];

 ***REMOVED*****REMOVED***
  ***REMOVED*** Channel dispatcher wrapping the underlying delegate channel.
  ***REMOVED***
  ***REMOVED*** @type {!goog.messaging.MultiChannel}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.multiChannel_ = new goog.messaging.MultiChannel(messageChannel);

 ***REMOVED*****REMOVED***
  ***REMOVED*** Virtual channel for carrying the user's messages.
  ***REMOVED***
  ***REMOVED*** @type {!goog.messaging.MessageChannel}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.userChannel_ = this.multiChannel_.createVirtualChannel(
      goog.messaging.BufferedChannel.USER_CHANNEL_NAME_);

 ***REMOVED*****REMOVED***
  ***REMOVED*** Virtual channel for carrying control messages for BufferedChannel.
  ***REMOVED***
  ***REMOVED*** @type {!goog.messaging.MessageChannel}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.controlChannel_ = this.multiChannel_.createVirtualChannel(
      goog.messaging.BufferedChannel.CONTROL_CHANNEL_NAME_);

 ***REMOVED*****REMOVED***
  ***REMOVED*** Timer for the peer ready ping loop.
  ***REMOVED***
  ***REMOVED*** @type {goog.Timer}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.timer_ = new goog.Timer(
      opt_interval || goog.messaging.BufferedChannel.DEFAULT_INTERVAL_MILLIS_);

  this.timer_.start();
***REMOVED***
      this.timer_, goog.Timer.TICK, this.sendReadyPing_, false, this);

  this.controlChannel_.registerService(
      goog.messaging.BufferedChannel.PEER_READY_SERVICE_NAME_,
      goog.bind(this.setPeerReady_, this));
***REMOVED***
goog.inherits(goog.messaging.BufferedChannel, goog.Disposable);


***REMOVED***
***REMOVED*** Default polling interval (in ms) for setPeerReady_ notifications.
***REMOVED***
***REMOVED*** @type {number}
***REMOVED*** @const
***REMOVED*** @private
***REMOVED***
goog.messaging.BufferedChannel.DEFAULT_INTERVAL_MILLIS_ = 50;


***REMOVED***
***REMOVED*** The name of the private service which handles peer ready pings.  The
***REMOVED*** service registered with this name is bound to this.setPeerReady_, an internal
***REMOVED*** part of BufferedChannel's implementation that clients should not send to
***REMOVED*** directly.
***REMOVED***
***REMOVED*** @type {string}
***REMOVED*** @const
***REMOVED*** @private
***REMOVED***
goog.messaging.BufferedChannel.PEER_READY_SERVICE_NAME_ = 'setPeerReady_';


***REMOVED***
***REMOVED*** The name of the virtual channel along which user messages are sent.
***REMOVED***
***REMOVED*** @type {string}
***REMOVED*** @const
***REMOVED*** @private
***REMOVED***
goog.messaging.BufferedChannel.USER_CHANNEL_NAME_ = 'user';


***REMOVED***
***REMOVED*** The name of the virtual channel along which internal control messages are
***REMOVED*** sent.
***REMOVED***
***REMOVED*** @type {string}
***REMOVED*** @const
***REMOVED*** @private
***REMOVED***
goog.messaging.BufferedChannel.CONTROL_CHANNEL_NAME_ = 'control';


***REMOVED*** @override***REMOVED***
goog.messaging.BufferedChannel.prototype.connect = function(opt_connectCb) {
  if (opt_connectCb) {
    opt_connectCb();
  }
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.messaging.BufferedChannel.prototype.isConnected = function() {
  return true;
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} Whether the channel's peer is ready.
***REMOVED***
goog.messaging.BufferedChannel.prototype.isPeerReady = function() {
  return this.peerReady_;
***REMOVED***


***REMOVED***
***REMOVED*** Logger.
***REMOVED***
***REMOVED*** @type {goog.debug.Logger}
***REMOVED*** @const
***REMOVED*** @private
***REMOVED***
goog.messaging.BufferedChannel.prototype.logger_ = goog.debug.Logger.getLogger(
    'goog.messaging.bufferedchannel');


***REMOVED***
***REMOVED*** Handles one tick of our peer ready notification loop.  This entails sending a
***REMOVED*** ready ping to the peer and shutting down the loop if we've received a ping
***REMOVED*** ourselves.
***REMOVED***
***REMOVED*** @private
***REMOVED***
goog.messaging.BufferedChannel.prototype.sendReadyPing_ = function() {
  try {
    this.controlChannel_.send(
        goog.messaging.BufferedChannel.PEER_READY_SERVICE_NAME_,
        /* payload***REMOVED*** this.isPeerReady() ? '1' : '');
  } catch (e) {
    this.timer_.stop();  // So we don't keep calling send and re-throwing.
    throw e;
  }
***REMOVED***


***REMOVED***
 ***REMOVED*** Whether or not the peer channel is ready to receive messages.
 ***REMOVED***
 ***REMOVED*** @type {boolean}
 ***REMOVED*** @private
***REMOVED*****REMOVED***
goog.messaging.BufferedChannel.prototype.peerReady_;


***REMOVED*** @override***REMOVED***
goog.messaging.BufferedChannel.prototype.registerService = function(
    serviceName, callback, opt_objectPayload) {
  this.userChannel_.registerService(serviceName, callback, opt_objectPayload);
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.messaging.BufferedChannel.prototype.registerDefaultService = function(
    callback) {
  this.userChannel_.registerDefaultService(callback);
***REMOVED***


***REMOVED***
***REMOVED*** Send a message over the channel.  If the peer is not ready, the message will
***REMOVED*** be buffered and sent once we've received a ready message from our peer.
***REMOVED***
***REMOVED*** @param {string} serviceName The name of the service this message should be
***REMOVED***     delivered to.
***REMOVED*** @param {string|!Object} payload The value of the message. If this is an
***REMOVED***     Object, it is serialized to JSON before sending.  It's the responsibility
***REMOVED***     of implementors of this class to perform the serialization.
***REMOVED*** @see goog.net.xpc.BufferedChannel.send
***REMOVED*** @override
***REMOVED***
goog.messaging.BufferedChannel.prototype.send = function(serviceName, payload) {
  if (this.isPeerReady()) {
    this.userChannel_.send(serviceName, payload);
  } else {
    goog.messaging.BufferedChannel.prototype.logger_.fine(
        'buffering message ' + serviceName);
    this.buffer_.push({serviceName: serviceName, payload: payload});
  }
***REMOVED***


***REMOVED***
***REMOVED*** Marks the channel's peer as ready, then sends buffered messages and nulls the
***REMOVED*** buffer.  Subsequent calls to setPeerReady_ have no effect.
***REMOVED***
***REMOVED*** @param {(!Object|string)} peerKnowsWeKnowItsReady Passed by the peer to
***REMOVED***     indicate whether it knows that we've received its ping and that it's
***REMOVED***     ready.  Non-empty if true, empty if false.
***REMOVED*** @private
***REMOVED***
goog.messaging.BufferedChannel.prototype.setPeerReady_ = function(
    peerKnowsWeKnowItsReady) {
  if (peerKnowsWeKnowItsReady) {
    this.timer_.stop();
  } else {
    // Our peer doesn't know we're ready, so restart (or continue) pinging.
    // Restarting may be needed if the peer iframe was reloaded after the
    // connection was first established.
    this.timer_.start();
  }

  if (this.peerReady_) {
    return;
  }
  this.peerReady_ = true;
  // Send one last ping so that the peer knows we know it's ready.
  this.sendReadyPing_();
  for (var i = 0; i < this.buffer_.length; i++) {
    var message = this.buffer_[i];
    goog.messaging.BufferedChannel.prototype.logger_.fine(
        'sending buffered message ' + message.serviceName);
    this.userChannel_.send(message.serviceName, message.payload);
  }
  this.buffer_ = null;
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.messaging.BufferedChannel.prototype.disposeInternal = function() {
  goog.dispose(this.multiChannel_);
  goog.dispose(this.timer_);
  goog.base(this, 'disposeInternal');
***REMOVED***
