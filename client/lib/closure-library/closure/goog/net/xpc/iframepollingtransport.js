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
***REMOVED*** @fileoverview Contains the iframe polling transport.
***REMOVED***


goog.provide('goog.net.xpc.IframePollingTransport');
goog.provide('goog.net.xpc.IframePollingTransport.Receiver');
goog.provide('goog.net.xpc.IframePollingTransport.Sender');

goog.require('goog.array');
goog.require('goog.dom');
goog.require('goog.log');
goog.require('goog.log.Level');
goog.require('goog.net.xpc');
goog.require('goog.net.xpc.CfgFields');
goog.require('goog.net.xpc.CrossPageChannelRole');
goog.require('goog.net.xpc.Transport');
goog.require('goog.net.xpc.TransportTypes');
goog.require('goog.userAgent');



***REMOVED***
***REMOVED*** Iframe polling transport. Uses hidden iframes to transfer data
***REMOVED*** in the fragment identifier of the URL. The peer polls the iframe's location
***REMOVED*** for changes.
***REMOVED*** Unfortunately, in Safari this screws up the history, because Safari doesn't
***REMOVED*** allow to call location.replace() on a window containing a document from a
***REMOVED*** different domain (last version tested: 2.0.4).
***REMOVED***
***REMOVED*** @param {goog.net.xpc.CrossPageChannel} channel The channel this
***REMOVED***     transport belongs to.
***REMOVED*** @param {goog.dom.DomHelper=} opt_domHelper The dom helper to use for finding
***REMOVED***     the correct window.
***REMOVED***
***REMOVED*** @extends {goog.net.xpc.Transport}
***REMOVED*** @final
***REMOVED***
goog.net.xpc.IframePollingTransport = function(channel, opt_domHelper) {
  goog.net.xpc.IframePollingTransport.base(this, 'constructor', opt_domHelper);

 ***REMOVED*****REMOVED***
  ***REMOVED*** The channel this transport belongs to.
  ***REMOVED*** @type {goog.net.xpc.CrossPageChannel}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.channel_ = channel;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The URI used to send messages.
  ***REMOVED*** @type {string}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.sendUri_ =
      this.channel_.getConfig()[goog.net.xpc.CfgFields.PEER_POLL_URI];

 ***REMOVED*****REMOVED***
  ***REMOVED*** The URI which is polled for incoming messages.
  ***REMOVED*** @type {string}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.rcvUri_ =
      this.channel_.getConfig()[goog.net.xpc.CfgFields.LOCAL_POLL_URI];

 ***REMOVED*****REMOVED***
  ***REMOVED*** The queue to hold messages which can't be sent immediately.
  ***REMOVED*** @type {Array}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.sendQueue_ = [];
***REMOVED***
goog.inherits(goog.net.xpc.IframePollingTransport, goog.net.xpc.Transport);


***REMOVED***
***REMOVED*** The number of times the inner frame will check for evidence of the outer
***REMOVED*** frame before it tries its reconnection sequence.  These occur at 100ms
***REMOVED*** intervals, making this an effective max waiting period of 500ms.
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.net.xpc.IframePollingTransport.prototype.pollsBeforeReconnect_ = 5;


***REMOVED***
***REMOVED*** The transport type.
***REMOVED*** @type {number}
***REMOVED*** @protected
***REMOVED*** @override
***REMOVED***
goog.net.xpc.IframePollingTransport.prototype.transportType =
    goog.net.xpc.TransportTypes.IFRAME_POLLING;


***REMOVED***
***REMOVED*** Sequence counter.
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.net.xpc.IframePollingTransport.prototype.sequence_ = 0;


***REMOVED***
***REMOVED*** Flag indicating whether we are waiting for an acknoledgement.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.net.xpc.IframePollingTransport.prototype.waitForAck_ = false;


***REMOVED***
***REMOVED*** Flag indicating if channel has been initialized.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.net.xpc.IframePollingTransport.prototype.initialized_ = false;


***REMOVED***
***REMOVED*** Reconnection iframe created by inner peer.
***REMOVED*** @type {Element}
***REMOVED*** @private
***REMOVED***
goog.net.xpc.IframePollingTransport.prototype.reconnectFrame_ = null;


***REMOVED***
***REMOVED*** The string used to prefix all iframe names and IDs.
***REMOVED*** @type {string}
***REMOVED***
goog.net.xpc.IframePollingTransport.IFRAME_PREFIX = 'googlexpc';


***REMOVED***
***REMOVED*** Returns the name/ID of the message frame.
***REMOVED*** @return {string} Name of message frame.
***REMOVED*** @private
***REMOVED***
goog.net.xpc.IframePollingTransport.prototype.getMsgFrameName_ = function() {
  return goog.net.xpc.IframePollingTransport.IFRAME_PREFIX + '_' +
      this.channel_.name + '_msg';
***REMOVED***


***REMOVED***
***REMOVED*** Returns the name/ID of the ack frame.
***REMOVED*** @return {string} Name of ack frame.
***REMOVED*** @private
***REMOVED***
goog.net.xpc.IframePollingTransport.prototype.getAckFrameName_ = function() {
  return goog.net.xpc.IframePollingTransport.IFRAME_PREFIX + '_' +
      this.channel_.name + '_ack';
***REMOVED***


***REMOVED***
***REMOVED*** Determines whether the channel is still available. The channel is
***REMOVED*** unavailable if the transport was disposed or the peer is no longer
***REMOVED*** available.
***REMOVED*** @return {boolean} Whether the channel is available.
***REMOVED***
goog.net.xpc.IframePollingTransport.prototype.isChannelAvailable = function() {
  return !this.isDisposed() && this.channel_.isPeerAvailable();
***REMOVED***


***REMOVED***
***REMOVED*** Safely retrieves the frames from the peer window. If an error is thrown
***REMOVED*** (e.g. the window is closing) an empty frame object is returned.
***REMOVED*** @return {!Object.<!Window>} The frames from the peer window.
***REMOVED*** @private
***REMOVED***
goog.net.xpc.IframePollingTransport.prototype.getPeerFrames_ = function() {
  try {
    if (this.isChannelAvailable()) {
      return this.channel_.getPeerWindowObject().frames || {***REMOVED***
    }
  } catch (e) {
    // An error may be thrown if the window is closing.
    goog.log.fine(goog.net.xpc.logger, 'error retrieving peer frames');
  }
  return {***REMOVED***
***REMOVED***


***REMOVED***
***REMOVED*** Safely retrieves the peer frame with the specified name.
***REMOVED*** @param {string} frameName The name of the peer frame to retrieve.
***REMOVED*** @return {!Window} The peer frame with the specified name.
***REMOVED*** @private
***REMOVED***
goog.net.xpc.IframePollingTransport.prototype.getPeerFrame_ = function(
    frameName) {
  return this.getPeerFrames_()[frameName];
***REMOVED***


***REMOVED***
***REMOVED*** Connects this transport.
***REMOVED*** @override
***REMOVED***
goog.net.xpc.IframePollingTransport.prototype.connect = function() {
  if (!this.isChannelAvailable()) {
    // When the channel is unavailable there is no peer to poll so stop trying
    // to connect.
    return;
  }

  goog.log.fine(goog.net.xpc.logger, 'transport connect called');
  if (!this.initialized_) {
    goog.log.fine(goog.net.xpc.logger, 'initializing...');
    this.constructSenderFrames_();
    this.initialized_ = true;
  }
  this.checkForeignFramesReady_();
***REMOVED***


***REMOVED***
***REMOVED*** Creates the iframes which are used to send messages (and acknowledgements)
***REMOVED*** to the peer. Sender iframes contain a document from a different origin and
***REMOVED*** therefore their content can't be accessed.
***REMOVED*** @private
***REMOVED***
goog.net.xpc.IframePollingTransport.prototype.constructSenderFrames_ =
    function() {
  var name = this.getMsgFrameName_();
  this.msgIframeElm_ = this.constructSenderFrame_(name);
  this.msgWinObj_ = this.getWindow().frames[name];

  name = this.getAckFrameName_();
  this.ackIframeElm_ = this.constructSenderFrame_(name);
  this.ackWinObj_ = this.getWindow().frames[name];
***REMOVED***


***REMOVED***
***REMOVED*** Constructs a sending frame the the given id.
***REMOVED*** @param {string} id The id.
***REMOVED*** @return {!Element} The constructed frame.
***REMOVED*** @private
***REMOVED***
goog.net.xpc.IframePollingTransport.prototype.constructSenderFrame_ =
    function(id) {
  goog.log.log(goog.net.xpc.logger, goog.log.Level.FINEST,
      'constructing sender frame: ' + id);
  var ifr = goog.dom.createElement('iframe');
  var s = ifr.style;
  s.position = 'absolute';
  s.top = '-10px'; s.left = '10px'; s.width = '1px'; s.height = '1px';
  ifr.id = ifr.name = id;
  ifr.src = this.sendUri_ + '#INITIAL';
  this.getWindow().document.body.appendChild(ifr);
  return ifr;
***REMOVED***


***REMOVED***
***REMOVED*** The protocol for reconnecting is for the inner frame to change channel
***REMOVED*** names, and then communicate the new channel name to the outer peer.
***REMOVED*** The outer peer looks in a predefined location for the channel name
***REMOVED*** upate. It is important to use a completely new channel name, as this
***REMOVED*** will ensure that all messaging iframes are not in the bfcache.
***REMOVED*** Otherwise, Safari may pollute the history when modifying the location
***REMOVED*** of bfcached iframes.
***REMOVED*** @private
***REMOVED***
goog.net.xpc.IframePollingTransport.prototype.maybeInnerPeerReconnect_ =
    function() {
  // Reconnection has been found to not function on some browsers (eg IE7), so
  // it's important that the mechanism only be triggered as a last resort.  As
  // such, we poll a number of times to find the outer iframe before triggering
  // it.
  if (this.reconnectFrame_ || this.pollsBeforeReconnect_-- > 0) {
    return;
  }

  goog.log.log(goog.net.xpc.logger, goog.log.Level.FINEST,
      'Inner peer reconnect triggered.');
  this.channel_.updateChannelNameAndCatalog(goog.net.xpc.getRandomString(10));
  goog.log.log(goog.net.xpc.logger, goog.log.Level.FINEST,
      'switching channels: ' + this.channel_.name);
  this.deconstructSenderFrames_();
  this.initialized_ = false;
  // Communicate new channel name to outer peer.
  this.reconnectFrame_ = this.constructSenderFrame_(
      goog.net.xpc.IframePollingTransport.IFRAME_PREFIX +
          '_reconnect_' + this.channel_.name);
***REMOVED***


***REMOVED***
***REMOVED*** Scans inner peer for a reconnect message, which will be used to update
***REMOVED*** the outer peer's channel name. If a reconnect message is found, the
***REMOVED*** sender frames will be cleaned up to make way for the new sender frames.
***REMOVED*** Only called by the outer peer.
***REMOVED*** @private
***REMOVED***
goog.net.xpc.IframePollingTransport.prototype.outerPeerReconnect_ = function() {
  goog.log.log(goog.net.xpc.logger, goog.log.Level.FINEST,
      'outerPeerReconnect called');
  var frames = this.getPeerFrames_();
  var length = frames.length;
  for (var i = 0; i < length; i++) {
    var frameName;
    try {
      if (frames[i] && frames[i].name) {
        frameName = frames[i].name;
      }
    } catch (e) {
      // Do nothing.
    }
    if (!frameName) {
      continue;
    }
    var message = frameName.split('_');
    if (message.length == 3 &&
        message[0] == goog.net.xpc.IframePollingTransport.IFRAME_PREFIX &&
        message[1] == 'reconnect') {
      // This is a legitimate reconnect message from the peer. Start using
      // the peer provided channel name, and start a connection over from
      // scratch.
      this.channel_.name = message[2];
      this.deconstructSenderFrames_();
      this.initialized_ = false;
      break;
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** Cleans up the existing sender frames owned by this peer. Only called by
***REMOVED*** the outer peer.
***REMOVED*** @private
***REMOVED***
goog.net.xpc.IframePollingTransport.prototype.deconstructSenderFrames_ =
    function() {
  goog.log.log(goog.net.xpc.logger, goog.log.Level.FINEST,
      'deconstructSenderFrames called');
  if (this.msgIframeElm_) {
    this.msgIframeElm_.parentNode.removeChild(this.msgIframeElm_);
    this.msgIframeElm_ = null;
    this.msgWinObj_ = null;
  }
  if (this.ackIframeElm_) {
    this.ackIframeElm_.parentNode.removeChild(this.ackIframeElm_);
    this.ackIframeElm_ = null;
    this.ackWinObj_ = null;
  }
***REMOVED***


***REMOVED***
***REMOVED*** Checks if the frames in the peer's page are ready. These contain a
***REMOVED*** document from the own domain and are the ones messages are received through.
***REMOVED*** @private
***REMOVED***
goog.net.xpc.IframePollingTransport.prototype.checkForeignFramesReady_ =
    function() {
  // check if the connected iframe ready
  if (!(this.isRcvFrameReady_(this.getMsgFrameName_()) &&
        this.isRcvFrameReady_(this.getAckFrameName_()))) {
    goog.log.log(goog.net.xpc.logger, goog.log.Level.FINEST,
        'foreign frames not (yet) present');

    if (this.channel_.getRole() == goog.net.xpc.CrossPageChannelRole.INNER) {
      // The outer peer might need a short time to get its frames ready, as
      // CrossPageChannel prevents them from getting created until the inner
      // peer's frame has thrown its loaded event.  This method is a noop for
      // the first few times it's called, and then allows the reconnection
      // sequence to begin.
      this.maybeInnerPeerReconnect_();
    } else if (this.channel_.getRole() ==
               goog.net.xpc.CrossPageChannelRole.OUTER) {
      // The inner peer is either not loaded yet, or the receiving
      // frames are simply missing. Since we cannot discern the two cases, we
      // should scan for a reconnect message from the inner peer.
      this.outerPeerReconnect_();
    }

    // start a timer to check again
    this.getWindow().setTimeout(goog.bind(this.connect, this), 100);
  } else {
    goog.log.fine(goog.net.xpc.logger, 'foreign frames present');

    // Create receivers.
    this.msgReceiver_ = new goog.net.xpc.IframePollingTransport.Receiver(
        this,
        this.getPeerFrame_(this.getMsgFrameName_()),
        goog.bind(this.processIncomingMsg, this));
    this.ackReceiver_ = new goog.net.xpc.IframePollingTransport.Receiver(
        this,
        this.getPeerFrame_(this.getAckFrameName_()),
        goog.bind(this.processIncomingAck, this));

    this.checkLocalFramesPresent_();
  }
***REMOVED***


***REMOVED***
***REMOVED*** Checks if the receiving frame is ready.
***REMOVED*** @param {string} frameName Which receiving frame to check.
***REMOVED*** @return {boolean} Whether the receiving frame is ready.
***REMOVED*** @private
***REMOVED***
goog.net.xpc.IframePollingTransport.prototype.isRcvFrameReady_ =
    function(frameName) {
  goog.log.log(goog.net.xpc.logger, goog.log.Level.FINEST,
      'checking for receive frame: ' + frameName);
 ***REMOVED*****REMOVED*** @preserveTry***REMOVED***
  try {
    var winObj = this.getPeerFrame_(frameName);
    if (!winObj || winObj.location.href.indexOf(this.rcvUri_) != 0) {
      return false;
    }
  } catch (e) {
    return false;
  }
  return true;
***REMOVED***


***REMOVED***
***REMOVED*** Checks if the iframes created in the own document are ready.
***REMOVED*** @private
***REMOVED***
goog.net.xpc.IframePollingTransport.prototype.checkLocalFramesPresent_ =
    function() {

  // Are the sender frames ready?
  // These contain a document from the peer's domain, therefore we can only
  // check if the frame itself is present.
  var frames = this.getPeerFrames_();
  if (!(frames[this.getAckFrameName_()] &&
        frames[this.getMsgFrameName_()])) {
    // start a timer to check again
    if (!this.checkLocalFramesPresentCb_) {
      this.checkLocalFramesPresentCb_ = goog.bind(
          this.checkLocalFramesPresent_, this);
    }
    this.getWindow().setTimeout(this.checkLocalFramesPresentCb_, 100);
    goog.log.fine(goog.net.xpc.logger, 'local frames not (yet) present');
  } else {
    // Create senders.
    this.msgSender_ = new goog.net.xpc.IframePollingTransport.Sender(
        this.sendUri_, this.msgWinObj_);
    this.ackSender_ = new goog.net.xpc.IframePollingTransport.Sender(
        this.sendUri_, this.ackWinObj_);

    goog.log.fine(goog.net.xpc.logger, 'local frames ready');

    this.getWindow().setTimeout(goog.bind(function() {
      this.msgSender_.send(goog.net.xpc.SETUP);
      this.sentConnectionSetup_ = true;
      this.waitForAck_ = true;
      goog.log.fine(goog.net.xpc.logger, 'SETUP sent');
    }, this), 100);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Check if connection is ready.
***REMOVED*** @private
***REMOVED***
goog.net.xpc.IframePollingTransport.prototype.checkIfConnected_ = function() {
  if (this.sentConnectionSetupAck_ && this.rcvdConnectionSetupAck_) {
    this.channel_.notifyConnected();

    if (this.deliveryQueue_) {
      goog.log.fine(goog.net.xpc.logger, 'delivering queued messages ' +
          '(' + this.deliveryQueue_.length + ')');

      for (var i = 0, m; i < this.deliveryQueue_.length; i++) {
        m = this.deliveryQueue_[i];
        this.channel_.xpcDeliver(m.service, m.payload);
      }
      delete this.deliveryQueue_;
    }
  } else {
    goog.log.log(goog.net.xpc.logger, goog.log.Level.FINEST,
        'checking if connected: ' +
        'ack sent:' + this.sentConnectionSetupAck_ +
        ', ack rcvd: ' + this.rcvdConnectionSetupAck_);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Processes an incoming message.
***REMOVED*** @param {string} raw The complete received string.
***REMOVED***
goog.net.xpc.IframePollingTransport.prototype.processIncomingMsg =
    function(raw) {
  goog.log.log(goog.net.xpc.logger, goog.log.Level.FINEST,
      'msg received: ' + raw);

  if (raw == goog.net.xpc.SETUP) {
    if (!this.ackSender_) {
      // Got SETUP msg, but we can't send an ack.
      return;
    }

    this.ackSender_.send(goog.net.xpc.SETUP_ACK_);
    goog.log.log(goog.net.xpc.logger, goog.log.Level.FINEST, 'SETUP_ACK sent');

    this.sentConnectionSetupAck_ = true;
    this.checkIfConnected_();

  } else if (this.channel_.isConnected() || this.sentConnectionSetupAck_) {

    var pos = raw.indexOf('|');
    var head = raw.substring(0, pos);
    var frame = raw.substring(pos + 1);

    // check if it is a framed message
    pos = head.indexOf(',');
    if (pos == -1) {
      var seq = head;
      // send acknowledgement
      this.ackSender_.send('ACK:' + seq);
      this.deliverPayload_(frame);
    } else {
      var seq = head.substring(0, pos);
      // send acknowledgement
      this.ackSender_.send('ACK:' + seq);

      var partInfo = head.substring(pos + 1).split('/');
      var part0 = parseInt(partInfo[0], 10);
      var part1 = parseInt(partInfo[1], 10);
      // create an array to accumulate the parts if this is the
      // first frame of a message
      if (part0 == 1) {
        this.parts_ = [];
      }
      this.parts_.push(frame);
      // deliver the message if this was the last frame of a message
      if (part0 == part1) {
        this.deliverPayload_(this.parts_.join(''));
        delete this.parts_;
      }
    }
  } else {
    goog.log.warning(goog.net.xpc.logger,
        'received msg, but channel is not connected');
  }
***REMOVED***


***REMOVED***
***REMOVED*** Process an incoming acknowdedgement.
***REMOVED*** @param {string} msgStr The incoming ack string to process.
***REMOVED***
goog.net.xpc.IframePollingTransport.prototype.processIncomingAck =
    function(msgStr) {
  goog.log.log(goog.net.xpc.logger, goog.log.Level.FINEST,
      'ack received: ' + msgStr);

  if (msgStr == goog.net.xpc.SETUP_ACK_) {
    this.waitForAck_ = false;
    this.rcvdConnectionSetupAck_ = true;
    // send the next frame
    this.checkIfConnected_();

  } else if (this.channel_.isConnected()) {
    if (!this.waitForAck_) {
      goog.log.warning(goog.net.xpc.logger, 'got unexpected ack');
      return;
    }

    var seq = parseInt(msgStr.split(':')[1], 10);
    if (seq == this.sequence_) {
      this.waitForAck_ = false;
      this.sendNextFrame_();
    } else {
      goog.log.warning(goog.net.xpc.logger, 'got ack with wrong sequence');
    }
  } else {
    goog.log.warning(goog.net.xpc.logger,
        'received ack, but channel not connected');
  }
***REMOVED***


***REMOVED***
***REMOVED*** Sends a frame (message part).
***REMOVED*** @private
***REMOVED***
goog.net.xpc.IframePollingTransport.prototype.sendNextFrame_ = function() {
  // do nothing if we are waiting for an acknowledgement or the
  // queue is emtpy
  if (this.waitForAck_ || !this.sendQueue_.length) {
    return;
  }

  var s = this.sendQueue_.shift();
  ++this.sequence_;
  this.msgSender_.send(this.sequence_ + s);
  goog.log.log(goog.net.xpc.logger, goog.log.Level.FINEST,
      'msg sent: ' + this.sequence_ + s);


  this.waitForAck_ = true;
***REMOVED***


***REMOVED***
***REMOVED*** Delivers a message.
***REMOVED*** @param {string} s The complete message string ("<service_name>:<payload>").
***REMOVED*** @private
***REMOVED***
goog.net.xpc.IframePollingTransport.prototype.deliverPayload_ = function(s) {
  // determine the service name and the payload
  var pos = s.indexOf(':');
  var service = s.substr(0, pos);
  var payload = s.substring(pos + 1);

  // deliver the message
  if (!this.channel_.isConnected()) {
    // as valid messages can come in before a SETUP_ACK has
    // been received (because subchannels for msgs and acks are independent),
    // delay delivery of early messages until after 'connect'-event
    (this.deliveryQueue_ || (this.deliveryQueue_ = [])).
        push({service: service, payload: payload});
    goog.log.log(goog.net.xpc.logger, goog.log.Level.FINEST,
        'queued delivery');
  } else {
    this.channel_.xpcDeliver(service, payload);
  }
***REMOVED***


// ---- send message ----


***REMOVED***
***REMOVED*** Maximal frame length.
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.net.xpc.IframePollingTransport.prototype.MAX_FRAME_LENGTH_ = 3800;


***REMOVED***
***REMOVED*** Sends a message. Splits it in multiple frames if too long (exceeds IE's
***REMOVED*** URL-length maximum.
***REMOVED*** Wireformat: <seq>[,<frame_no>/<#frames>]|<frame_content>
***REMOVED***
***REMOVED*** @param {string} service Name of service this the message has to be delivered.
***REMOVED*** @param {string} payload The message content.
***REMOVED*** @override
***REMOVED***
goog.net.xpc.IframePollingTransport.prototype.send =
    function(service, payload) {
  var frame = service + ':' + payload;
  // put in queue
  if (!goog.userAgent.IE || payload.length <= this.MAX_FRAME_LENGTH_) {
    this.sendQueue_.push('|' + frame);
  }
  else {
    var l = payload.length;
    var num = Math.ceil(l / this.MAX_FRAME_LENGTH_); // number of frames
    var pos = 0;
    var i = 1;
    while (pos < l) {
      this.sendQueue_.push(',' + i + '/' + num + '|' +
                           frame.substr(pos, this.MAX_FRAME_LENGTH_));
      i++;
      pos += this.MAX_FRAME_LENGTH_;
    }
  }
  this.sendNextFrame_();
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.net.xpc.IframePollingTransport.prototype.disposeInternal = function() {
  goog.net.xpc.IframePollingTransport.base(this, 'disposeInternal');

  var receivers = goog.net.xpc.IframePollingTransport.receivers_;
  goog.array.remove(receivers, this.msgReceiver_);
  goog.array.remove(receivers, this.ackReceiver_);
  this.msgReceiver_ = this.ackReceiver_ = null;

  goog.dom.removeNode(this.msgIframeElm_);
  goog.dom.removeNode(this.ackIframeElm_);
  this.msgIframeElm_ = this.ackIframeElm_ = null;
  this.msgWinObj_ = this.ackWinObj_ = null;
***REMOVED***


***REMOVED***
***REMOVED*** Array holding all Receiver-instances.
***REMOVED*** @type {Array.<goog.net.xpc.IframePollingTransport.Receiver>}
***REMOVED*** @private
***REMOVED***
goog.net.xpc.IframePollingTransport.receivers_ = [];


***REMOVED***
***REMOVED*** Short polling interval.
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.net.xpc.IframePollingTransport.TIME_POLL_SHORT_ = 10;


***REMOVED***
***REMOVED*** Long polling interval.
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.net.xpc.IframePollingTransport.TIME_POLL_LONG_ = 100;


***REMOVED***
***REMOVED*** Period how long to use TIME_POLL_SHORT_ before raising polling-interval
***REMOVED*** to TIME_POLL_LONG_ after an activity.
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.net.xpc.IframePollingTransport.TIME_SHORT_POLL_AFTER_ACTIVITY_ =
    1000;


***REMOVED***
***REMOVED*** Polls all receivers.
***REMOVED*** @private
***REMOVED***
goog.net.xpc.IframePollingTransport.receive_ = function() {
  var receivers = goog.net.xpc.IframePollingTransport.receivers_;
  var receiver;
  var rcvd = false;

 ***REMOVED*****REMOVED*** @preserveTry***REMOVED***
  try {
    for (var i = 0; receiver = receivers[i]; i++) {
      rcvd = rcvd || receiver.receive();
    }
  } catch (e) {
    goog.log.info(goog.net.xpc.logger, 'receive_() failed: ' + e);

    // Notify the channel that the transport had an error.
    receiver.transport_.channel_.notifyTransportError();

    // notifyTransportError() closes the channel and disposes the transport.
    // If there are no other channels present, this.receivers_ will now be empty
    // and there is no need to keep polling.
    if (!receivers.length) {
      return;
    }
  }

  var now = goog.now();
  if (rcvd) {
    goog.net.xpc.IframePollingTransport.lastActivity_ = now;
  }

  // Schedule next check.
  var t = now - goog.net.xpc.IframePollingTransport.lastActivity_ <
      goog.net.xpc.IframePollingTransport.TIME_SHORT_POLL_AFTER_ACTIVITY_ ?
      goog.net.xpc.IframePollingTransport.TIME_POLL_SHORT_ :
      goog.net.xpc.IframePollingTransport.TIME_POLL_LONG_;
  goog.net.xpc.IframePollingTransport.rcvTimer_ = window.setTimeout(
      goog.net.xpc.IframePollingTransport.receiveCb_, t);
***REMOVED***


***REMOVED***
***REMOVED*** Callback that wraps receive_ to be used in timers.
***REMOVED*** @type {Function}
***REMOVED*** @private
***REMOVED***
goog.net.xpc.IframePollingTransport.receiveCb_ = goog.bind(
    goog.net.xpc.IframePollingTransport.receive_,
    goog.net.xpc.IframePollingTransport);


***REMOVED***
***REMOVED*** Starts the polling loop.
***REMOVED*** @private
***REMOVED***
goog.net.xpc.IframePollingTransport.startRcvTimer_ = function() {
  goog.log.fine(goog.net.xpc.logger, 'starting receive-timer');
  goog.net.xpc.IframePollingTransport.lastActivity_ = goog.now();
  if (goog.net.xpc.IframePollingTransport.rcvTimer_) {
    window.clearTimeout(goog.net.xpc.IframePollingTransport.rcvTimer_);
  }
  goog.net.xpc.IframePollingTransport.rcvTimer_ = window.setTimeout(
      goog.net.xpc.IframePollingTransport.receiveCb_,
      goog.net.xpc.IframePollingTransport.TIME_POLL_SHORT_);
***REMOVED***



***REMOVED***
***REMOVED*** goog.net.xpc.IframePollingTransport.Sender
***REMOVED***
***REMOVED*** Utility class to send message-parts to a document from a different origin.
***REMOVED***
***REMOVED***
***REMOVED*** @param {string} url The url the other document will use for polling.
***REMOVED*** @param {Object} windowObj The frame used for sending information to.
***REMOVED*** @final
***REMOVED***
goog.net.xpc.IframePollingTransport.Sender = function(url, windowObj) {
 ***REMOVED*****REMOVED***
  ***REMOVED*** The URI used to sending messages.
  ***REMOVED*** @type {string}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.sendUri_ = url;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The window object of the iframe used to send messages.
  ***REMOVED*** The script instantiating the Sender won't have access to
  ***REMOVED*** the content of sendFrame_.
  ***REMOVED*** @type {Object}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.sendFrame_ = windowObj;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Cycle counter (used to make sure that sending two identical messages sent
  ***REMOVED*** in direct succession can be recognized as such by the receiver).
  ***REMOVED*** @type {number}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.cycle_ = 0;
***REMOVED***


***REMOVED***
***REMOVED*** Sends a message-part (frame) to the peer.
***REMOVED*** The message-part is encoded and put in the fragment identifier
***REMOVED*** of the URL used for sending (and belongs to the origin/domain of the peer).
***REMOVED*** @param {string} payload The message to send.
***REMOVED***
goog.net.xpc.IframePollingTransport.Sender.prototype.send = function(payload) {
  this.cycle_ = ++this.cycle_ % 2;

  var url = this.sendUri_ + '#' + this.cycle_ + encodeURIComponent(payload);

  // TODO(user) Find out if try/catch is still needed
 ***REMOVED*****REMOVED*** @preserveTry***REMOVED***
  try {
    // safari doesn't allow to call location.replace()
    if (goog.userAgent.WEBKIT) {
      this.sendFrame_.location.href = url;
    } else {
      this.sendFrame_.location.replace(url);
    }
  } catch (e) {
    goog.log.error(goog.net.xpc.logger, 'sending failed', e);
  }

  // Restart receiver timer on short polling interval, to support use-cases
  // where we need to capture responses quickly.
  goog.net.xpc.IframePollingTransport.startRcvTimer_();
***REMOVED***



***REMOVED***
***REMOVED*** goog.net.xpc.IframePollingTransport.Receiver
***REMOVED***
***REMOVED***
***REMOVED*** @param {goog.net.xpc.IframePollingTransport} transport The transport to
***REMOVED***     receive from.
***REMOVED*** @param {Object} windowObj The window-object to poll for location-changes.
***REMOVED*** @param {Function} callback The callback-function to be called when
***REMOVED***     location has changed.
***REMOVED*** @final
***REMOVED***
goog.net.xpc.IframePollingTransport.Receiver = function(transport,
                                                        windowObj,
                                                        callback) {
 ***REMOVED*****REMOVED***
  ***REMOVED*** The transport to receive from.
  ***REMOVED*** @type {goog.net.xpc.IframePollingTransport}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.transport_ = transport;
  this.rcvFrame_ = windowObj;

  this.cb_ = callback;
  this.currentLoc_ = this.rcvFrame_.location.href.split('#')[0] + '#INITIAL';

  goog.net.xpc.IframePollingTransport.receivers_.push(this);
  goog.net.xpc.IframePollingTransport.startRcvTimer_();
***REMOVED***


***REMOVED***
***REMOVED*** Polls the location of the receiver-frame for changes.
***REMOVED*** @return {boolean} Whether a change has been detected.
***REMOVED***
goog.net.xpc.IframePollingTransport.Receiver.prototype.receive = function() {
  var loc = this.rcvFrame_.location.href;

  if (loc != this.currentLoc_) {
    this.currentLoc_ = loc;
    var payload = loc.split('#')[1];
    if (payload) {
      payload = payload.substr(1); // discard first character (cycle)
      this.cb_(decodeURIComponent(payload));
    }
    return true;
  } else {
    return false;
  }
***REMOVED***
