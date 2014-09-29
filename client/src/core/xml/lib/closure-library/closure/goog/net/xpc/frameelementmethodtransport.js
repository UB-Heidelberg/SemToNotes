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
***REMOVED*** @fileoverview Contains the frame element method transport for cross-domain
***REMOVED*** communication. It exploits the fact that FF lets a page in an
***REMOVED*** iframe call a method on the iframe-element it is contained in, even if the
***REMOVED*** containing page is from a different domain.
***REMOVED***
***REMOVED***


goog.provide('goog.net.xpc.FrameElementMethodTransport');

goog.require('goog.net.xpc');
goog.require('goog.net.xpc.CrossPageChannelRole');
goog.require('goog.net.xpc.Transport');



***REMOVED***
***REMOVED*** Frame-element method transport.
***REMOVED***
***REMOVED*** Firefox allows a document within an iframe to call methods on the
***REMOVED*** iframe-element added by the containing document.
***REMOVED*** NOTE(user): Tested in all FF versions starting from 1.0
***REMOVED***
***REMOVED*** @param {goog.net.xpc.CrossPageChannel} channel The channel this transport
***REMOVED***     belongs to.
***REMOVED*** @param {goog.dom.DomHelper=} opt_domHelper The dom helper to use for finding
***REMOVED***     the correct window.
***REMOVED***
***REMOVED*** @extends {goog.net.xpc.Transport}
***REMOVED***
goog.net.xpc.FrameElementMethodTransport = function(channel, opt_domHelper) {
  goog.base(this, opt_domHelper);

 ***REMOVED*****REMOVED***
  ***REMOVED*** The channel this transport belongs to.
  ***REMOVED*** @type {goog.net.xpc.CrossPageChannel}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.channel_ = channel;

  // To transfer messages, this transport basically uses normal function calls,
  // which are synchronous. To avoid endless recursion, the delivery has to
  // be artificially made asynchronous.

 ***REMOVED*****REMOVED***
  ***REMOVED*** Array for queued messages.
  ***REMOVED*** @type {Array}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.queue_ = [];

 ***REMOVED*****REMOVED***
  ***REMOVED*** Callback function which wraps deliverQueued_.
  ***REMOVED*** @type {Function}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.deliverQueuedCb_ = goog.bind(this.deliverQueued_, this);
***REMOVED***
goog.inherits(goog.net.xpc.FrameElementMethodTransport, goog.net.xpc.Transport);


***REMOVED***
***REMOVED*** The transport type.
***REMOVED*** @type {number}
***REMOVED*** @protected
***REMOVED*** @override
***REMOVED***
goog.net.xpc.FrameElementMethodTransport.prototype.transportType =
    goog.net.xpc.TransportTypes.FRAME_ELEMENT_METHOD;


***REMOVED***
***REMOVED*** Flag used to enforce asynchronous messaging semantics.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.net.xpc.FrameElementMethodTransport.prototype.recursive_ = false;


***REMOVED***
***REMOVED*** Timer used to enforce asynchronous message delivery.
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.net.xpc.FrameElementMethodTransport.prototype.timer_ = 0;


***REMOVED***
***REMOVED*** Holds the function to send messages to the peer
***REMOVED*** (once it becomes available).
***REMOVED*** @type {Function}
***REMOVED*** @private
***REMOVED***
goog.net.xpc.FrameElementMethodTransport.outgoing_ = null;


***REMOVED***
***REMOVED*** Connect this transport.
***REMOVED*** @override
***REMOVED***
goog.net.xpc.FrameElementMethodTransport.prototype.connect = function() {
  if (this.channel_.getRole() == goog.net.xpc.CrossPageChannelRole.OUTER) {
    // get shortcut to iframe-element
    this.iframeElm_ = this.channel_.getIframeElement();

    // add the gateway function to the iframe-element
    // (to be called by the peer)
    this.iframeElm_['XPC_toOuter'] = goog.bind(this.incoming_, this);

    // at this point we just have to wait for a notification from the peer...

  } else {
    this.attemptSetup_();
  }
***REMOVED***


***REMOVED***
***REMOVED*** Only used from within an iframe. Attempts to attach the method
***REMOVED*** to be used for sending messages by the containing document. Has to
***REMOVED*** wait until the containing document has finished. Therefore calls
***REMOVED*** itself in a timeout if not successful.
***REMOVED*** @private
***REMOVED***
goog.net.xpc.FrameElementMethodTransport.prototype.attemptSetup_ = function() {
  var retry = true;
 ***REMOVED*****REMOVED*** @preserveTry***REMOVED***
  try {
    if (!this.iframeElm_) {
      // throws security exception when called too early
      this.iframeElm_ = this.getWindow().frameElement;
    }
    // check if iframe-element and the gateway-function to the
    // outer-frame are present
    // TODO(user) Make sure the following code doesn't throw any exceptions
    if (this.iframeElm_ && this.iframeElm_['XPC_toOuter']) {
      // get a reference to the gateway function
      this.outgoing_ = this.iframeElm_['XPC_toOuter'];
      // attach the gateway function the other document will use
      this.iframeElm_['XPC_toOuter']['XPC_toInner'] =
          goog.bind(this.incoming_, this);
      // stop retrying
      retry = false;
      // notify outer frame
      this.send(goog.net.xpc.TRANSPORT_SERVICE_, goog.net.xpc.SETUP_ACK_);
      // notify channel that the transport is ready
      this.channel_.notifyConnected();
    }
  }
  catch (e) {
    goog.net.xpc.logger.severe(
        'exception caught while attempting setup: ' + e);
  }
  // retry necessary?
  if (retry) {
    if (!this.attemptSetupCb_) {
      this.attemptSetupCb_ = goog.bind(this.attemptSetup_, this);
    }
    this.getWindow().setTimeout(this.attemptSetupCb_, 100);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Handles transport service messages.
***REMOVED*** @param {string} payload The message content.
***REMOVED*** @override
***REMOVED***
goog.net.xpc.FrameElementMethodTransport.prototype.transportServiceHandler =
    function(payload) {
  if (this.channel_.getRole() == goog.net.xpc.CrossPageChannelRole.OUTER &&
      !this.channel_.isConnected() && payload == goog.net.xpc.SETUP_ACK_) {
    // get a reference to the gateway function
    this.outgoing_ = this.iframeElm_['XPC_toOuter']['XPC_toInner'];
    // notify the channel we're ready
    this.channel_.notifyConnected();
  } else {
    throw Error('Got unexpected transport message.');
  }
***REMOVED***


***REMOVED***
***REMOVED*** Process incoming message.
***REMOVED*** @param {string} serviceName The name of the service the message is to be
***REMOVED*** delivered to.
***REMOVED*** @param {string} payload The message to process.
***REMOVED*** @private
***REMOVED***
goog.net.xpc.FrameElementMethodTransport.prototype.incoming_ =
    function(serviceName, payload) {
  if (!this.recursive_ && this.queue_.length == 0) {
    this.channel_.xpcDeliver(serviceName, payload);
  }
  else {
    this.queue_.push({serviceName: serviceName, payload: payload});
    if (this.queue_.length == 1) {
      this.timer_ = this.getWindow().setTimeout(this.deliverQueuedCb_, 1);
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** Delivers queued messages.
***REMOVED*** @private
***REMOVED***
goog.net.xpc.FrameElementMethodTransport.prototype.deliverQueued_ =
    function() {
  while (this.queue_.length) {
    var msg = this.queue_.shift();
    this.channel_.xpcDeliver(msg.serviceName, msg.payload);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Send a message
***REMOVED*** @param {string} service The name off the service the message is to be
***REMOVED*** delivered to.
***REMOVED*** @param {string} payload The message content.
***REMOVED*** @override
***REMOVED***
goog.net.xpc.FrameElementMethodTransport.prototype.send =
    function(service, payload) {
  this.recursive_ = true;
  this.outgoing_(service, payload);
  this.recursive_ = false;
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.net.xpc.FrameElementMethodTransport.prototype.disposeInternal =
    function() {
  goog.net.xpc.FrameElementMethodTransport.superClass_.disposeInternal.call(
      this);
  this.outgoing_ = null;
  this.iframeElm_ = null;
***REMOVED***
