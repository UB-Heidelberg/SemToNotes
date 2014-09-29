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
***REMOVED*** @fileoverview Contains the class which uses native messaging
***REMOVED*** facilities for cross domain communication.
***REMOVED***
***REMOVED***


goog.provide('goog.net.xpc.NativeMessagingTransport');

goog.require('goog.Timer');
goog.require('goog.asserts');
goog.require('goog.async.Deferred');
***REMOVED***
goog.require('goog.events.EventHandler');
goog.require('goog.net.xpc');
goog.require('goog.net.xpc.CrossPageChannelRole');
goog.require('goog.net.xpc.Transport');



***REMOVED***
***REMOVED*** The native messaging transport
***REMOVED***
***REMOVED*** Uses document.postMessage() to send messages to other documents.
***REMOVED*** Receiving is done by listening on 'message'-events on the document.
***REMOVED***
***REMOVED*** @param {goog.net.xpc.CrossPageChannel} channel The channel this
***REMOVED***     transport belongs to.
***REMOVED*** @param {string} peerHostname The hostname (protocol, domain, and port) of the
***REMOVED***     peer.
***REMOVED*** @param {goog.dom.DomHelper=} opt_domHelper The dom helper to use for
***REMOVED***     finding the correct window/document.
***REMOVED*** @param {boolean=} opt_oneSidedHandshake If this is true, only the outer
***REMOVED***     transport sends a SETUP message and expects a SETUP_ACK.  The inner
***REMOVED***     transport goes connected when it receives the SETUP.
***REMOVED*** @param {number=} opt_protocolVersion Which version of its setup protocol the
***REMOVED***     transport should use.  The default is '2'.
***REMOVED***
***REMOVED*** @extends {goog.net.xpc.Transport}
***REMOVED***
goog.net.xpc.NativeMessagingTransport = function(channel, peerHostname,
    opt_domHelper, opt_oneSidedHandshake, opt_protocolVersion) {
  goog.base(this, opt_domHelper);

 ***REMOVED*****REMOVED***
  ***REMOVED*** The channel this transport belongs to.
  ***REMOVED*** @type {goog.net.xpc.CrossPageChannel}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.channel_ = channel;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Which version of the transport's protocol should be used.
  ***REMOVED*** @type {number}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.protocolVersion_ = opt_protocolVersion || 2;
  goog.asserts.assert(this.protocolVersion_ >= 1);
  goog.asserts.assert(this.protocolVersion_ <= 2);

 ***REMOVED*****REMOVED***
  ***REMOVED*** The hostname of the peer. This parameterizes all calls to postMessage, and
  ***REMOVED*** should contain the precise protocol, domain, and port of the peer window.
  ***REMOVED*** @type {string}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.peerHostname_ = peerHostname || '*';

 ***REMOVED*****REMOVED***
  ***REMOVED*** The event handler.
  ***REMOVED*** @type {!goog.events.EventHandler}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.eventHandler_ = new goog.events.EventHandler(this);

 ***REMOVED*****REMOVED***
  ***REMOVED*** Timer for connection reattempts.
  ***REMOVED*** @type {!goog.Timer}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.maybeAttemptToConnectTimer_ = new goog.Timer(100, this.getWindow());

 ***REMOVED*****REMOVED***
  ***REMOVED*** Whether one-sided handshakes are enabled.
  ***REMOVED*** @type {boolean}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.oneSidedHandshake_ = !!opt_oneSidedHandshake;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Fires once we've received our SETUP_ACK message.
  ***REMOVED*** @type {!goog.async.Deferred}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.setupAckReceived_ = new goog.async.Deferred();

 ***REMOVED*****REMOVED***
  ***REMOVED*** Fires once we've sent our SETUP_ACK message.
  ***REMOVED*** @type {!goog.async.Deferred}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.setupAckSent_ = new goog.async.Deferred();

 ***REMOVED*****REMOVED***
  ***REMOVED*** Fires once we're marked connected.
  ***REMOVED*** @type {!goog.async.Deferred}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.connected_ = new goog.async.Deferred();

 ***REMOVED*****REMOVED***
  ***REMOVED*** The unique ID of this side of the connection. Used to determine when a peer
  ***REMOVED*** is reloaded.
  ***REMOVED*** @type {string}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.endpointId_ = goog.net.xpc.getRandomString(10);

 ***REMOVED*****REMOVED***
  ***REMOVED*** The unique ID of the peer. If we get a message from a peer with an ID we
  ***REMOVED*** don't expect, we reset the connection.
  ***REMOVED*** @type {?string}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.peerEndpointId_ = null;

  // We don't want to mark ourselves connected until we have sent whatever
  // message will cause our counterpart in the other frame to also declare
  // itself connected, if there is such a message.  Otherwise we risk a user
  // message being sent in advance of that message, and it being discarded.
  if (this.oneSidedHandshake_) {
    if (this.channel_.getRole() == goog.net.xpc.CrossPageChannelRole.INNER) {
      // One sided handshake, inner frame:
      // SETUP_ACK must be received.
      this.connected_.awaitDeferred(this.setupAckReceived_);
    } else {
      // One sided handshake, outer frame:
      // SETUP_ACK must be sent.
      this.connected_.awaitDeferred(this.setupAckSent_);
    }
  } else {
    // Two sided handshake:
    // SETUP_ACK has to have been received, and sent.
    this.connected_.awaitDeferred(this.setupAckReceived_);
    if (this.protocolVersion_ == 2) {
      this.connected_.awaitDeferred(this.setupAckSent_);
    }
  }
  this.connected_.addCallback(this.notifyConnected_, this);
  this.connected_.callback(true);

  this.eventHandler_.
      listen(this.maybeAttemptToConnectTimer_, goog.Timer.TICK,
          this.maybeAttemptToConnect_);

  goog.net.xpc.logger.info('NativeMessagingTransport created.  ' +
      'protocolVersion=' + this.protocolVersion_ + ', oneSidedHandshake=' +
      this.oneSidedHandshake_ + ', role=' + this.channel_.getRole());
***REMOVED***
goog.inherits(goog.net.xpc.NativeMessagingTransport, goog.net.xpc.Transport);


***REMOVED***
***REMOVED*** Length of the delay in milliseconds between the channel being connected and
***REMOVED*** the connection callback being called, in cases where coverage of timing flaws
***REMOVED*** is required.
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.net.xpc.NativeMessagingTransport.CONNECTION_DELAY_MS_ = 200;


***REMOVED***
***REMOVED*** Current determination of peer's protocol version, or null for unknown.
***REMOVED*** @type {?number}
***REMOVED*** @private
***REMOVED***
goog.net.xpc.NativeMessagingTransport.prototype.peerProtocolVersion_ = null;


***REMOVED***
***REMOVED*** Flag indicating if this instance of the transport has been initialized.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.net.xpc.NativeMessagingTransport.prototype.initialized_ = false;


***REMOVED***
***REMOVED*** The transport type.
***REMOVED*** @type {number}
***REMOVED*** @override
***REMOVED***
goog.net.xpc.NativeMessagingTransport.prototype.transportType =
    goog.net.xpc.TransportTypes.NATIVE_MESSAGING;


***REMOVED***
***REMOVED*** The delimiter used for transport service messages.
***REMOVED*** @type {string}
***REMOVED*** @private
***REMOVED***
goog.net.xpc.NativeMessagingTransport.MESSAGE_DELIMITER_ = ',';


***REMOVED***
***REMOVED*** Tracks the number of NativeMessagingTransport channels that have been
***REMOVED*** initialized but not disposed yet in a map keyed by the UID of the window
***REMOVED*** object.  This allows for multiple windows to be initiallized and listening
***REMOVED*** for messages.
***REMOVED*** @type {Object.<number>}
***REMOVED*** @private
***REMOVED***
goog.net.xpc.NativeMessagingTransport.activeCount_ = {***REMOVED***


***REMOVED***
***REMOVED*** Id of a timer user during postMessage sends.
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.net.xpc.NativeMessagingTransport.sendTimerId_ = 0;


***REMOVED***
***REMOVED*** Checks whether the peer transport protocol version could be as indicated.
***REMOVED*** @param {number} version The version to check for.
***REMOVED*** @return {boolean} Whether the peer transport protocol version is as
***REMOVED***     indicated, or null.
***REMOVED*** @private
***REMOVED***
goog.net.xpc.NativeMessagingTransport.prototype.couldPeerVersionBe_ =
    function(version) {
  return this.peerProtocolVersion_ == null ||
      this.peerProtocolVersion_ == version;
***REMOVED***


***REMOVED***
***REMOVED*** Initializes this transport. Registers a listener for 'message'-events
***REMOVED*** on the document.
***REMOVED*** @param {Window} listenWindow The window to listen to events on.
***REMOVED*** @private
***REMOVED***
goog.net.xpc.NativeMessagingTransport.initialize_ = function(listenWindow) {
  var uid = goog.getUid(listenWindow);
  var value = goog.net.xpc.NativeMessagingTransport.activeCount_[uid];
  if (!goog.isNumber(value)) {
    value = 0;
  }
  if (value == 0) {
    // Listen for message-events. These are fired on window in FF3 and on
    // document in Opera.
  ***REMOVED***
        listenWindow.postMessage ? listenWindow : listenWindow.document,
        'message',
        goog.net.xpc.NativeMessagingTransport.messageReceived_,
        false,
        goog.net.xpc.NativeMessagingTransport);
  }
  goog.net.xpc.NativeMessagingTransport.activeCount_[uid] = value + 1;
***REMOVED***


***REMOVED***
***REMOVED*** Processes an incoming message-event.
***REMOVED*** @param {goog.events.BrowserEvent} msgEvt The message event.
***REMOVED*** @return {boolean} True if message was successfully delivered to a channel.
***REMOVED*** @private
***REMOVED***
goog.net.xpc.NativeMessagingTransport.messageReceived_ = function(msgEvt) {
  var data = msgEvt.getBrowserEvent().data;

  if (!goog.isString(data)) {
    return false;
  }

  var headDelim = data.indexOf('|');
  var serviceDelim = data.indexOf(':');

  // make sure we got something reasonable
  if (headDelim == -1 || serviceDelim == -1) {
    return false;
  }

  var channelName = data.substring(0, headDelim);
  var service = data.substring(headDelim + 1, serviceDelim);
  var payload = data.substring(serviceDelim + 1);

  goog.net.xpc.logger.fine('messageReceived: channel=' + channelName +
                           ', service=' + service + ', payload=' + payload);

  // Attempt to deliver message to the channel. Keep in mind that it may not
  // exist for several reasons, including but not limited to:
  //  - a malformed message
  //  - the channel simply has not been created
  //  - channel was created in a different namespace
  //  - message was sent to the wrong window
  //  - channel has become stale (e.g. caching iframes and back clicks)
  var channel = goog.net.xpc.channels[channelName];
  if (channel) {
    channel.xpcDeliver(service, payload, msgEvt.getBrowserEvent().origin);
    return true;
  }

  var transportMessageType =
      goog.net.xpc.NativeMessagingTransport.parseTransportPayload_(payload)[0];

  // Check if there are any stale channel names that can be updated.
  for (var staleChannelName in goog.net.xpc.channels) {
    var staleChannel = goog.net.xpc.channels[staleChannelName];
    if (staleChannel.getRole() == goog.net.xpc.CrossPageChannelRole.INNER &&
        !staleChannel.isConnected() &&
        service == goog.net.xpc.TRANSPORT_SERVICE_ &&
        (transportMessageType == goog.net.xpc.SETUP ||
        transportMessageType == goog.net.xpc.SETUP_NTPV2)) {
      // Inner peer received SETUP message but channel names did not match.
      // Start using the channel name sent from outer peer. The channel name
      // of the inner peer can easily become out of date, as iframe's and their
      // JS state get cached in many browsers upon page reload or history
      // navigation (particularly Firefox 1.5+). We can trust the outer peer,
      // since we only accept postMessage messages from the same hostname that
      // originally setup the channel.
      goog.net.xpc.logger.fine('changing channel name to ' + channelName);
      staleChannel.name = channelName;
      // Remove old stale pointer to channel.
      delete goog.net.xpc.channels[staleChannelName];
      // Create fresh pointer to channel.
      goog.net.xpc.channels[channelName] = staleChannel;
      staleChannel.xpcDeliver(service, payload);
      return true;
    }
  }

  // Failed to find a channel to deliver this message to, so simply ignore it.
  goog.net.xpc.logger.info('channel name mismatch; message ignored"');
  return false;
***REMOVED***


***REMOVED***
***REMOVED*** Handles transport service messages.
***REMOVED*** @param {string} payload The message content.
***REMOVED*** @override
***REMOVED***
goog.net.xpc.NativeMessagingTransport.prototype.transportServiceHandler =
    function(payload) {
  var transportParts =
      goog.net.xpc.NativeMessagingTransport.parseTransportPayload_(payload);
  var transportMessageType = transportParts[0];
  var peerEndpointId = transportParts[1];
  switch (transportMessageType) {
    case goog.net.xpc.SETUP_ACK_:
      this.setPeerProtocolVersion_(1);
      if (!this.setupAckReceived_.hasFired()) {
        this.setupAckReceived_.callback(true);
      }
      break;
    case goog.net.xpc.SETUP_ACK_NTPV2:
      if (this.protocolVersion_ == 2) {
        this.setPeerProtocolVersion_(2);
        if (!this.setupAckReceived_.hasFired()) {
          this.setupAckReceived_.callback(true);
        }
      }
      break;
    case goog.net.xpc.SETUP:
      this.setPeerProtocolVersion_(1);
      this.sendSetupAckMessage_(1);
      break;
    case goog.net.xpc.SETUP_NTPV2:
      if (this.protocolVersion_ == 2) {
        var prevPeerProtocolVersion = this.peerProtocolVersion_;
        this.setPeerProtocolVersion_(2);
        this.sendSetupAckMessage_(2);
        if ((prevPeerProtocolVersion == 1 || this.peerEndpointId_ != null) &&
            this.peerEndpointId_ != peerEndpointId) {
          // Send a new SETUP message since the peer has been replaced.
          goog.net.xpc.logger.info('Sending SETUP and changing peer ID to: ' +
              peerEndpointId);
          this.sendSetupMessage_();
        }
        this.peerEndpointId_ = peerEndpointId;
      }
      break;
  }
***REMOVED***


***REMOVED***
***REMOVED*** Sends a SETUP transport service message of the correct protocol number for
***REMOVED*** our current situation.
***REMOVED*** @private
***REMOVED***
goog.net.xpc.NativeMessagingTransport.prototype.sendSetupMessage_ =
    function() {
  // 'real' (legacy) v1 transports don't know about there being v2 ones out
  // there, and we shouldn't either.
  goog.asserts.assert(!(this.protocolVersion_ == 1 &&
      this.peerProtocolVersion_ == 2));

  if (this.protocolVersion_ == 2 && this.couldPeerVersionBe_(2)) {
    var payload = goog.net.xpc.SETUP_NTPV2;
    payload += goog.net.xpc.NativeMessagingTransport.MESSAGE_DELIMITER_;
    payload += this.endpointId_;
    this.send(goog.net.xpc.TRANSPORT_SERVICE_, payload);
  }

  // For backward compatibility reasons, the V1 SETUP message can be sent by
  // both V1 and V2 transports.  Once a V2 transport has 'heard' another V2
  // transport it starts ignoring V1 messages, so the V2 message must be sent
  // first.
  if (this.couldPeerVersionBe_(1)) {
    this.send(goog.net.xpc.TRANSPORT_SERVICE_, goog.net.xpc.SETUP);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Sends a SETUP_ACK transport service message of the correct protocol number
***REMOVED*** for our current situation.
***REMOVED*** @param {number} protocolVersion The protocol version of the SETUP message
***REMOVED***     which gave rise to this ack message.
***REMOVED*** @private
***REMOVED***
goog.net.xpc.NativeMessagingTransport.prototype.sendSetupAckMessage_ =
    function(protocolVersion) {
  goog.asserts.assert(this.protocolVersion_ != 1 || protocolVersion != 2,
      'Shouldn\'t try to send a v2 setup ack in v1 mode.');
  if (this.protocolVersion_ == 2 && this.couldPeerVersionBe_(2) &&
      protocolVersion == 2) {
    this.send(goog.net.xpc.TRANSPORT_SERVICE_, goog.net.xpc.SETUP_ACK_NTPV2);
  } else if (this.couldPeerVersionBe_(1) && protocolVersion == 1) {
    this.send(goog.net.xpc.TRANSPORT_SERVICE_, goog.net.xpc.SETUP_ACK_);
  } else {
    return;
  }

  if (!this.setupAckSent_.hasFired()) {
    this.setupAckSent_.callback(true);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Attempts to set the peer protocol number.  Downgrades from 2 to 1 are not
***REMOVED*** permitted.
***REMOVED*** @param {number} version The new protocol number.
***REMOVED*** @private
***REMOVED***
goog.net.xpc.NativeMessagingTransport.prototype.setPeerProtocolVersion_ =
    function(version) {
  if (version > this.peerProtocolVersion_) {
    this.peerProtocolVersion_ = version;
  }
  if (this.peerProtocolVersion_ == 1) {
    if (!this.setupAckSent_.hasFired() && !this.oneSidedHandshake_) {
      this.setupAckSent_.callback(true);
    }
    this.peerEndpointId_ = null;
  }
***REMOVED***


***REMOVED***
***REMOVED*** Connects this transport.
***REMOVED*** @override
***REMOVED***
goog.net.xpc.NativeMessagingTransport.prototype.connect = function() {
  goog.net.xpc.NativeMessagingTransport.initialize_(this.getWindow());
  this.initialized_ = true;
  this.maybeAttemptToConnect_();
***REMOVED***


***REMOVED***
***REMOVED*** Connects to other peer. In the case of the outer peer, the setup messages are
***REMOVED*** likely sent before the inner peer is ready to receive them. Therefore, this
***REMOVED*** function will continue trying to send the SETUP message until the inner peer
***REMOVED*** responds. In the case of the inner peer, it will occasionally have its
***REMOVED*** channel name fall out of sync with the outer peer, particularly during
***REMOVED*** soft-reloads and history navigations.
***REMOVED*** @private
***REMOVED***
goog.net.xpc.NativeMessagingTransport.prototype.maybeAttemptToConnect_ =
    function() {
  // In a one-sided handshake, the outer frame does not send a SETUP message,
  // but the inner frame does.
  var outerFrame = this.channel_.getRole() ==
      goog.net.xpc.CrossPageChannelRole.OUTER;
  if ((this.oneSidedHandshake_ && outerFrame) ||
      this.channel_.isConnected() ||
      this.isDisposed()) {
    this.maybeAttemptToConnectTimer_.stop();
    return;
  }
  this.maybeAttemptToConnectTimer_.start();
  this.sendSetupMessage_();
***REMOVED***


***REMOVED***
***REMOVED*** Sends a message.
***REMOVED*** @param {string} service The name off the service the message is to be
***REMOVED*** delivered to.
***REMOVED*** @param {string} payload The message content.
***REMOVED*** @override
***REMOVED***
goog.net.xpc.NativeMessagingTransport.prototype.send = function(service,
                                                                payload) {
  var win = this.channel_.getPeerWindowObject();
  if (!win) {
    goog.net.xpc.logger.fine('send(): window not ready');
    return;
  }

  this.send = function(service, payload) {
    // In IE8 (and perhaps elsewhere), it seems like postMessage is sometimes
    // implemented as a synchronous call.  That is, calling it synchronously
    // calls whatever listeners it has, and control is not returned to the
    // calling thread until those listeners are run.  This produces different
    // ordering to all other browsers, and breaks this protocol.  This timer
    // callback is introduced to produce standard behavior across all browsers.
    var transport = this;
    var channelName = this.channel_.name;
    var sendFunctor = function() {
      transport.sendTimerId_ = 0;

      try {
        // postMessage is a method of the window object, except in some
        // versions of Opera, where it is a method of the document object.  It
        // also seems that the appearance of postMessage on the peer window
        // object can sometimes be delayed.
        var obj = win.postMessage ? win : win.document;
        if (!obj.postMessage) {
          goog.net.xpc.logger.warning('Peer window had no postMessage ' +
              'function.');
          return;
        }

        obj.postMessage(channelName + '|' + service + ':' + payload,
            transport.peerHostname_);
        goog.net.xpc.logger.fine('send(): service=' + service + ' payload=' +
            payload + ' to hostname=' + transport.peerHostname_);
      } catch (error) {
        // There is some evidence (not totally convincing) that postMessage can
        // be missing or throw errors during a narrow timing window during
        // startup.  This protects against that.
        goog.net.xpc.logger.warning('Error performing postMessage, ignoring.',
            error);
      }
   ***REMOVED*****REMOVED***
    this.sendTimerId_ = goog.Timer.callOnce(sendFunctor, 0);
 ***REMOVED*****REMOVED***
  this.send(service, payload);
***REMOVED***


***REMOVED***
***REMOVED*** Notify the channel that this transport is connected.  If either transport is
***REMOVED*** protocol v1, a short delay is required to paper over timing vulnerabilities
***REMOVED*** in that protocol version.
***REMOVED*** @private
***REMOVED***
goog.net.xpc.NativeMessagingTransport.prototype.notifyConnected_ =
    function() {
  var delay = (this.protocolVersion_ == 1 || this.peerProtocolVersion_ == 1) ?
      goog.net.xpc.NativeMessagingTransport.CONNECTION_DELAY_MS_ : undefined;
  this.channel_.notifyConnected(delay);
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.net.xpc.NativeMessagingTransport.prototype.disposeInternal = function() {
  if (this.initialized_) {
    var listenWindow = this.getWindow();
    var uid = goog.getUid(listenWindow);
    var value = goog.net.xpc.NativeMessagingTransport.activeCount_[uid];
    goog.net.xpc.NativeMessagingTransport.activeCount_[uid] = value - 1;
    if (value == 1) {
      goog.events.unlisten(
          listenWindow.postMessage ? listenWindow : listenWindow.document,
          'message',
          goog.net.xpc.NativeMessagingTransport.messageReceived_,
          false,
          goog.net.xpc.NativeMessagingTransport);
    }
  }

  if (this.sendTimerId_) {
    goog.Timer.clear(this.sendTimerId_);
    this.sendTimerId_ = 0;
  }

  goog.dispose(this.eventHandler_);
  delete this.eventHandler_;

  goog.dispose(this.maybeAttemptToConnectTimer_);
  delete this.maybeAttemptToConnectTimer_;

  this.setupAckReceived_.cancel();
  delete this.setupAckReceived_;
  this.setupAckSent_.cancel();
  delete this.setupAckSent_;
  this.connected_.cancel();
  delete this.connected_;

  // Cleaning up this.send as it is an instance method, created in
  // goog.net.xpc.NativeMessagingTransport.prototype.send and has a closure over
  // this.channel_.peerWindowObject_.
  delete this.send;

  goog.base(this, 'disposeInternal');
***REMOVED***


***REMOVED***
***REMOVED*** Parse a transport service payload message.  For v1, it is simply expected to
***REMOVED*** be 'SETUP' or 'SETUP_ACK'.  For v2, an example setup message is
***REMOVED*** 'SETUP_NTPV2,abc123', where the second part is the endpoint id.  The v2 setup
***REMOVED*** ack message is simply 'SETUP_ACK_NTPV2'.
***REMOVED*** @param {string} payload The payload.
***REMOVED*** @return {!Array.<?string>} An array with the message type as the first member
***REMOVED***     and the endpoint id as the second, if one was sent, or null otherwise.
***REMOVED*** @private
***REMOVED***
goog.net.xpc.NativeMessagingTransport.parseTransportPayload_ =
    function(payload) {
  var transportParts =***REMOVED*****REMOVED*** @type {!Array.<?string>}***REMOVED*** (payload.split(
      goog.net.xpc.NativeMessagingTransport.MESSAGE_DELIMITER_));
  transportParts[1] = transportParts[1] || null;
  return transportParts;
***REMOVED***
