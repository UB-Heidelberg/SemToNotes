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
***REMOVED*** @fileoverview Provides an implementation of a transport that can call methods
***REMOVED*** directly on a frame. Useful if you want to use XPC for crossdomain messaging
***REMOVED*** (using another transport), or same domain messaging (using this transport).
***REMOVED***


goog.provide('goog.net.xpc.DirectTransport');

goog.require('goog.Timer');
goog.require('goog.async.Deferred');
goog.require('goog.events.EventHandler');
goog.require('goog.log');
goog.require('goog.net.xpc');
goog.require('goog.net.xpc.CfgFields');
goog.require('goog.net.xpc.CrossPageChannelRole');
goog.require('goog.net.xpc.Transport');
goog.require('goog.net.xpc.TransportTypes');
goog.require('goog.object');


goog.scope(function() {
var CfgFields = goog.net.xpc.CfgFields;
var CrossPageChannelRole = goog.net.xpc.CrossPageChannelRole;
var Deferred = goog.async.Deferred;
var EventHandler = goog.events.EventHandler;
var Timer = goog.Timer;
var Transport = goog.net.xpc.Transport;



***REMOVED***
***REMOVED*** A direct window to window method transport.
***REMOVED***
***REMOVED*** If the windows are in the same security context, this transport calls
***REMOVED*** directly into the other window without using any additional mechanism. This
***REMOVED*** is mainly used in scenarios where you want to optionally use a cross domain
***REMOVED*** transport in cross security context situations, or optionally use a direct
***REMOVED*** transport in same security context situations.
***REMOVED***
***REMOVED*** Note: Global properties are exported by using this transport. One to
***REMOVED*** communicate with the other window by, currently crosswindowmessaging.channel,
***REMOVED*** and by using goog.getUid on window, currently closure_uid_[0-9]+.
***REMOVED***
***REMOVED*** @param {!goog.net.xpc.CrossPageChannel} channel The channel this
***REMOVED***     transport belongs to.
***REMOVED*** @param {goog.dom.DomHelper=} opt_domHelper The dom helper to use for
***REMOVED***     finding the correct window/document. If omitted, uses the current
***REMOVED***     document.
***REMOVED***
***REMOVED*** @extends {Transport}
***REMOVED***
goog.net.xpc.DirectTransport = function(channel, opt_domHelper) {
  goog.net.xpc.DirectTransport.base(this, 'constructor', opt_domHelper);

 ***REMOVED*****REMOVED***
  ***REMOVED*** The channel this transport belongs to.
  ***REMOVED*** @private {!goog.net.xpc.CrossPageChannel}
 ***REMOVED*****REMOVED***
  this.channel_ = channel;

 ***REMOVED*****REMOVED*** @private {!EventHandler.<!goog.net.xpc.DirectTransport>}***REMOVED***
  this.eventHandler_ = new EventHandler(this);
  this.registerDisposable(this.eventHandler_);

 ***REMOVED*****REMOVED***
  ***REMOVED*** Timer for connection reattempts.
  ***REMOVED*** @private {!Timer}
 ***REMOVED*****REMOVED***
  this.maybeAttemptToConnectTimer_ = new Timer(
      DirectTransport.CONNECTION_ATTEMPT_INTERVAL_MS_,
      this.getWindow());
  this.registerDisposable(this.maybeAttemptToConnectTimer_);

 ***REMOVED*****REMOVED***
  ***REMOVED*** Fires once we've received our SETUP_ACK message.
  ***REMOVED*** @private {!Deferred}
 ***REMOVED*****REMOVED***
  this.setupAckReceived_ = new Deferred();

 ***REMOVED*****REMOVED***
  ***REMOVED*** Fires once we've sent our SETUP_ACK message.
  ***REMOVED*** @private {!Deferred}
 ***REMOVED*****REMOVED***
  this.setupAckSent_ = new Deferred();

 ***REMOVED*****REMOVED***
  ***REMOVED*** Fires once we're marked connected.
  ***REMOVED*** @private {!Deferred}
 ***REMOVED*****REMOVED***
  this.connected_ = new Deferred();

 ***REMOVED*****REMOVED***
  ***REMOVED*** The unique ID of this side of the connection. Used to determine when a peer
  ***REMOVED*** is reloaded.
  ***REMOVED*** @private {string}
 ***REMOVED*****REMOVED***
  this.endpointId_ = goog.net.xpc.getRandomString(10);

 ***REMOVED*****REMOVED***
  ***REMOVED*** The unique ID of the peer. If we get a message from a peer with an ID we
  ***REMOVED*** don't expect, we reset the connection.
  ***REMOVED*** @private {?string}
 ***REMOVED*****REMOVED***
  this.peerEndpointId_ = null;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The map of sending messages.
  ***REMOVED*** @private {Object}
 ***REMOVED*****REMOVED***
  this.asyncSendsMap_ = {***REMOVED***

 ***REMOVED*****REMOVED***
  ***REMOVED*** The original channel name.
  ***REMOVED*** @private {string}
 ***REMOVED*****REMOVED***
  this.originalChannelName_ = this.channel_.name;

  // We reconfigure the channel name to include the role so that we can
  // communicate in the same window between the different roles on the
  // same channel.
  this.channel_.updateChannelNameAndCatalog(
      DirectTransport.getRoledChannelName_(this.channel_.name,
                                           this.channel_.getRole()));

 ***REMOVED*****REMOVED***
  ***REMOVED*** Flag indicating if this instance of the transport has been initialized.
  ***REMOVED*** @private {boolean}
 ***REMOVED*****REMOVED***
  this.initialized_ = false;

  // We don't want to mark ourselves connected until we have sent whatever
  // message will cause our counterpart in the other frame to also declare
  // itself connected, if there is such a message.  Otherwise we risk a user
  // message being sent in advance of that message, and it being discarded.

  // Two sided handshake:
  // SETUP_ACK has to have been received, and sent.
  this.connected_.awaitDeferred(this.setupAckReceived_);
  this.connected_.awaitDeferred(this.setupAckSent_);

  this.connected_.addCallback(this.notifyConnected_, this);
  this.connected_.callback(true);

  this.eventHandler_.
      listen(this.maybeAttemptToConnectTimer_, Timer.TICK,
          this.maybeAttemptToConnect_);

  goog.log.info(
      goog.net.xpc.logger,
      'DirectTransport created. role=' + this.channel_.getRole());
***REMOVED***
goog.inherits(goog.net.xpc.DirectTransport, Transport);
var DirectTransport = goog.net.xpc.DirectTransport;


***REMOVED***
***REMOVED*** @private {number}
***REMOVED*** @const
***REMOVED***
DirectTransport.CONNECTION_ATTEMPT_INTERVAL_MS_ = 100;


***REMOVED***
***REMOVED*** The delay to notify the xpc of a successful connection. This is used
***REMOVED*** to allow both parties to be connected if one party's connection callback
***REMOVED*** invokes an immediate send.
***REMOVED*** @private {number}
***REMOVED*** @const
***REMOVED***
DirectTransport.CONNECTION_DELAY_INTERVAL_MS_ = 0;


***REMOVED***
***REMOVED*** @param {!Window} peerWindow The peer window to check if DirectTranport is
***REMOVED***     supported on.
***REMOVED*** @return {boolean} Whether this transport is supported.
***REMOVED***
DirectTransport.isSupported = function(peerWindow) {
 ***REMOVED*****REMOVED*** @preserveTry***REMOVED***
  try {
    return window.document.domain == peerWindow.document.domain;
  } catch (e) {
    return false;
  }
***REMOVED***


***REMOVED***
***REMOVED*** Tracks the number of DirectTransport channels that have been
***REMOVED*** initialized but not disposed yet in a map keyed by the UID of the window
***REMOVED*** object.  This allows for multiple windows to be initiallized and listening
***REMOVED*** for messages.
***REMOVED*** @private {!Object.<number>}
***REMOVED***
DirectTransport.activeCount_ = {***REMOVED***


***REMOVED***
***REMOVED*** Path of global message proxy.
***REMOVED*** @private {string}
***REMOVED*** @const
***REMOVED***
// TODO(user): Make this configurable using the CfgFields.
DirectTransport.GLOBAL_TRANPORT_PATH_ = 'crosswindowmessaging.channel';


***REMOVED***
***REMOVED*** The delimiter used for transport service messages.
***REMOVED*** @private {string}
***REMOVED*** @const
***REMOVED***
DirectTransport.MESSAGE_DELIMITER_ = ',';


***REMOVED***
***REMOVED*** Initializes this transport. Registers a method for 'message'-events in the
***REMOVED*** global scope.
***REMOVED*** @param {!Window} listenWindow The window to listen to events on.
***REMOVED*** @private
***REMOVED***
DirectTransport.initialize_ = function(listenWindow) {
  var uid = goog.getUid(listenWindow);
  var value = DirectTransport.activeCount_[uid] || 0;
  if (value == 0) {
    // Set up a handler on the window to proxy messages to class.
    var globalProxy = goog.getObjectByName(
        DirectTransport.GLOBAL_TRANPORT_PATH_,
        listenWindow);
    if (globalProxy == null) {
      goog.exportSymbol(
          DirectTransport.GLOBAL_TRANPORT_PATH_,
          DirectTransport.messageReceivedHandler_,
          listenWindow);
    }
  }
  DirectTransport.activeCount_[uid]++;
***REMOVED***


***REMOVED***
***REMOVED*** @param {string} channelName The channel name.
***REMOVED*** @param {string|number} role The role.
***REMOVED*** @return {string} The formatted channel name including role.
***REMOVED*** @private
***REMOVED***
DirectTransport.getRoledChannelName_ = function(channelName, role) {
  return channelName + '_' + role;
***REMOVED***


***REMOVED***
***REMOVED*** @param {!Object} literal The literal unrenamed message.
***REMOVED*** @return {boolean} Whether the message was successfully delivered to a
***REMOVED***     channel.
***REMOVED*** @private
***REMOVED***
DirectTransport.messageReceivedHandler_ = function(literal) {
  var msg = DirectTransport.Message_.fromLiteral(literal);

  var channelName = msg.channelName;
  var service = msg.service;
  var payload = msg.payload;

  goog.log.fine(goog.net.xpc.logger,
      'messageReceived: channel=' + channelName +
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
    channel.xpcDeliver(service, payload);
    return true;
  }

  var transportMessageType = DirectTransport.parseTransportPayload_(payload)[0];

  // Check if there are any stale channel names that can be updated.
  for (var staleChannelName in goog.net.xpc.channels) {
    var staleChannel = goog.net.xpc.channels[staleChannelName];
    if (staleChannel.getRole() == CrossPageChannelRole.INNER &&
        !staleChannel.isConnected() &&
        service == goog.net.xpc.TRANSPORT_SERVICE_ &&
        transportMessageType == goog.net.xpc.SETUP) {
      // Inner peer received SETUP message but channel names did not match.
      // Start using the channel name sent from outer peer. The channel name
      // of the inner peer can easily become out of date, as iframe's and their
      // JS state get cached in many browsers upon page reload or history
      // navigation (particularly Firefox 1.5+).
      staleChannel.updateChannelNameAndCatalog(channelName);
      staleChannel.xpcDeliver(service, payload);
      return true;
    }
  }

  // Failed to find a channel to deliver this message to, so simply ignore it.
  goog.log.info(goog.net.xpc.logger, 'channel name mismatch; message ignored.');
  return false;
***REMOVED***


***REMOVED***
***REMOVED*** The transport type.
***REMOVED*** @type {number}
***REMOVED*** @override
***REMOVED***
DirectTransport.prototype.transportType = goog.net.xpc.TransportTypes.DIRECT;


***REMOVED***
***REMOVED*** Handles transport service messages.
***REMOVED*** @param {string} payload The message content.
***REMOVED*** @override
***REMOVED***
DirectTransport.prototype.transportServiceHandler = function(payload) {
  var transportParts = DirectTransport.parseTransportPayload_(payload);
  var transportMessageType = transportParts[0];
  var peerEndpointId = transportParts[1];
  switch (transportMessageType) {
    case goog.net.xpc.SETUP_ACK_:
      if (!this.setupAckReceived_.hasFired()) {
        this.setupAckReceived_.callback(true);
      }
      break;
    case goog.net.xpc.SETUP:
      this.sendSetupAckMessage_();
      if ((this.peerEndpointId_ != null) &&
          (this.peerEndpointId_ != peerEndpointId)) {
        // Send a new SETUP message since the peer has been replaced.
        goog.log.info(goog.net.xpc.logger,
            'Sending SETUP and changing peer ID to: ' + peerEndpointId);
        this.sendSetupMessage_();
      }
      this.peerEndpointId_ = peerEndpointId;
      break;
  }
***REMOVED***


***REMOVED***
***REMOVED*** Sends a SETUP transport service message.
***REMOVED*** @private
***REMOVED***
DirectTransport.prototype.sendSetupMessage_ = function() {
  // Although we could send real objects, since some other transports are
  // limited to strings we also keep this requirement.
  var payload = goog.net.xpc.SETUP;
  payload += DirectTransport.MESSAGE_DELIMITER_;
  payload += this.endpointId_;
  this.send(goog.net.xpc.TRANSPORT_SERVICE_, payload);
***REMOVED***


***REMOVED***
***REMOVED*** Sends a SETUP_ACK transport service message.
***REMOVED*** @private
***REMOVED***
DirectTransport.prototype.sendSetupAckMessage_ = function() {
  this.send(goog.net.xpc.TRANSPORT_SERVICE_, goog.net.xpc.SETUP_ACK_);
  if (!this.setupAckSent_.hasFired()) {
    this.setupAckSent_.callback(true);
  }
***REMOVED***


***REMOVED*** @override***REMOVED***
DirectTransport.prototype.connect = function() {
  var win = this.getWindow();
  if (win) {
    DirectTransport.initialize_(win);
    this.initialized_ = true;
    this.maybeAttemptToConnect_();
  } else {
    goog.log.fine(goog.net.xpc.logger, 'connect(): no window to initialize.');
  }
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
DirectTransport.prototype.maybeAttemptToConnect_ = function() {
  var outerRole = this.channel_.getRole() == CrossPageChannelRole.OUTER;
  if (this.channel_.isConnected()) {
    this.maybeAttemptToConnectTimer_.stop();
    return;
  }
  this.maybeAttemptToConnectTimer_.start();
  this.sendSetupMessage_();
***REMOVED***


***REMOVED***
***REMOVED*** Prepares to send a message.
***REMOVED*** @param {string} service The name of the service the message is to be
***REMOVED***     delivered to.
***REMOVED*** @param {string} payload The message content.
***REMOVED*** @override
***REMOVED***
DirectTransport.prototype.send = function(service, payload) {
  if (!this.channel_.getPeerWindowObject()) {
    goog.log.fine(goog.net.xpc.logger, 'send(): window not ready');
    return;
  }
  var channelName = DirectTransport.getRoledChannelName_(
      this.originalChannelName_,
      this.getPeerRole_());

  var message = new DirectTransport.Message_(
      channelName,
      service,
      payload);

  if (this.channel_.getConfig()[CfgFields.DIRECT_TRANSPORT_SYNC_MODE]) {
    this.executeScheduledSend_(message);
  } else {
    // Note: goog.async.nextTick doesn't support cancelling or disposal so
    // leaving as 0ms timer, though this may have performance implications.
    this.asyncSendsMap_[goog.getUid(message)] =
        Timer.callOnce(goog.bind(this.executeScheduledSend_, this, message), 0);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Sends the message.
***REMOVED*** @param {!DirectTransport.Message_} message The message to send.
***REMOVED*** @private
***REMOVED***
DirectTransport.prototype.executeScheduledSend_ = function(message) {
  var messageId = goog.getUid(message);
  if (this.asyncSendsMap_[messageId]) {
    delete this.asyncSendsMap_[messageId];
  }

 ***REMOVED*****REMOVED*** @preserveTry***REMOVED***
  try {
    var peerProxy = goog.getObjectByName(
        DirectTransport.GLOBAL_TRANPORT_PATH_,
        this.channel_.getPeerWindowObject());
  } catch (error) {
    goog.log.warning(
        goog.net.xpc.logger,
        'Can\'t access other window, ignoring.',
        error);
    return;
  }

  if (goog.isNull(peerProxy)) {
    goog.log.warning(
        goog.net.xpc.logger,
        'Peer window had no global function.');
    return;
  }

 ***REMOVED*****REMOVED*** @preserveTry***REMOVED***
  try {
    peerProxy(message.toLiteral());
    goog.log.info(
        goog.net.xpc.logger,
        'send(): channelName=' + message.channelName +
        ' service=' + message.service +
        ' payload=' + message.payload);
  } catch (error) {
    goog.log.warning(
        goog.net.xpc.logger,
        'Error performing call, ignoring.',
        error);
  }
***REMOVED***


***REMOVED***
***REMOVED*** @return {goog.net.xpc.CrossPageChannelRole} The role of peer channel (either
***REMOVED***     inner or outer).
***REMOVED*** @private
***REMOVED***
DirectTransport.prototype.getPeerRole_ = function() {
  var role = this.channel_.getRole();
  return role == goog.net.xpc.CrossPageChannelRole.OUTER ?
      goog.net.xpc.CrossPageChannelRole.INNER :
      goog.net.xpc.CrossPageChannelRole.OUTER;
***REMOVED***


***REMOVED***
***REMOVED*** Notifies the channel that this transport is connected.
***REMOVED*** @private
***REMOVED***
DirectTransport.prototype.notifyConnected_ = function() {
  // Add a delay as the connection callback will break if this transport is
  // synchronous and the callback invokes send() immediately.
  this.channel_.notifyConnected(
      this.channel_.getConfig()[CfgFields.DIRECT_TRANSPORT_SYNC_MODE] ?
      DirectTransport.CONNECTION_DELAY_INTERVAL_MS_ : 0);
***REMOVED***


***REMOVED*** @override***REMOVED***
DirectTransport.prototype.disposeInternal = function() {
  if (this.initialized_) {
    var listenWindow = this.getWindow();
    var uid = goog.getUid(listenWindow);
    var value = --DirectTransport.activeCount_[uid];
    if (value == 1) {
      goog.exportSymbol(
          DirectTransport.GLOBAL_TRANPORT_PATH_,
          null,
          listenWindow);
    }
  }

  if (this.asyncSendsMap_) {
    goog.object.forEach(this.asyncSendsMap_, function(timerId) {
      Timer.clear(timerId);
    });
    this.asyncSendsMap_ = null;
  }

  // Deferred's aren't disposables.
  if (this.setupAckReceived_) {
    this.setupAckReceived_.cancel();
    delete this.setupAckReceived_;
  }
  if (this.setupAckSent_) {
    this.setupAckSent_.cancel();
    delete this.setupAckSent_;
  }
  if (this.connected_) {
    this.connected_.cancel();
    delete this.connected_;
  }

  DirectTransport.base(this, 'disposeInternal');
***REMOVED***


***REMOVED***
***REMOVED*** Parses a transport service payload message.
***REMOVED*** @param {string} payload The payload.
***REMOVED*** @return {!Array.<?string>} An array with the message type as the first member
***REMOVED***     and the endpoint id as the second, if one was sent, or null otherwise.
***REMOVED*** @private
***REMOVED***
DirectTransport.parseTransportPayload_ = function(payload) {
  var transportParts =***REMOVED*****REMOVED*** @type {!Array.<?string>}***REMOVED*** (payload.split(
      DirectTransport.MESSAGE_DELIMITER_));
  transportParts[1] = transportParts[1] || null; // Usually endpointId.
  return transportParts;
***REMOVED***



***REMOVED***
***REMOVED*** Message container that gets passed back and forth between windows.
***REMOVED*** @param {string} channelName The channel name to tranport messages on.
***REMOVED*** @param {string} service The service to send the payload to.
***REMOVED*** @param {string} payload The payload to send.
***REMOVED***
***REMOVED*** @struct
***REMOVED*** @private
***REMOVED***
DirectTransport.Message_ = function(channelName, service, payload) {
 ***REMOVED*****REMOVED***
  ***REMOVED*** The name of the channel.
  ***REMOVED*** @type {string}
 ***REMOVED*****REMOVED***
  this.channelName = channelName;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The service on the channel.
  ***REMOVED*** @type {string}
 ***REMOVED*****REMOVED***
  this.service = service;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The payload.
  ***REMOVED*** @type {string}
 ***REMOVED*****REMOVED***
  this.payload = payload;
***REMOVED***


***REMOVED***
***REMOVED*** Converts a message to a literal object.
***REMOVED*** @return {!Object} The message as a literal object.
***REMOVED***
DirectTransport.Message_.prototype.toLiteral = function() {
  return {
    'channelName': this.channelName,
    'service': this.service,
    'payload': this.payload
 ***REMOVED*****REMOVED***
***REMOVED***


***REMOVED***
***REMOVED*** Creates a Message_ from a literal object.
***REMOVED*** @param {!Object} literal The literal to convert to Message.
***REMOVED*** @return {!DirectTransport.Message_} The Message.
***REMOVED***
DirectTransport.Message_.fromLiteral = function(literal) {
  return new DirectTransport.Message_(
      literal['channelName'],
      literal['service'],
      literal['payload']);
***REMOVED***

});  // goog.scope
