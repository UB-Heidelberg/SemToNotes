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
***REMOVED*** @fileoverview Provides the class CrossPageChannel, the main class in
***REMOVED*** goog.net.xpc.
***REMOVED***
***REMOVED*** @see ../../demos/xpc/index.html
***REMOVED***

goog.provide('goog.net.xpc.CrossPageChannel');

***REMOVED***
goog.require('goog.async.Deferred');
goog.require('goog.async.Delay');
goog.require('goog.dispose');
goog.require('goog.dom');
***REMOVED***
goog.require('goog.events.EventHandler');
***REMOVED***
goog.require('goog.json');
goog.require('goog.log');
goog.require('goog.messaging.AbstractChannel');
goog.require('goog.net.xpc');
goog.require('goog.net.xpc.CfgFields');
goog.require('goog.net.xpc.ChannelStates');
goog.require('goog.net.xpc.CrossPageChannelRole');
goog.require('goog.net.xpc.DirectTransport');
goog.require('goog.net.xpc.FrameElementMethodTransport');
goog.require('goog.net.xpc.IframePollingTransport');
goog.require('goog.net.xpc.IframeRelayTransport');
goog.require('goog.net.xpc.NativeMessagingTransport');
goog.require('goog.net.xpc.NixTransport');
goog.require('goog.net.xpc.TransportTypes');
goog.require('goog.net.xpc.UriCfgFields');
goog.require('goog.string');
goog.require('goog.uri.utils');
goog.require('goog.userAgent');



***REMOVED***
***REMOVED*** A communication channel between two documents from different domains.
***REMOVED*** Provides asynchronous messaging.
***REMOVED***
***REMOVED*** @param {Object} cfg Channel configuration object.
***REMOVED*** @param {goog.dom.DomHelper=} opt_domHelper The optional dom helper to
***REMOVED***     use for looking up elements in the dom.
***REMOVED***
***REMOVED*** @extends {goog.messaging.AbstractChannel}
***REMOVED***
goog.net.xpc.CrossPageChannel = function(cfg, opt_domHelper) {
  goog.net.xpc.CrossPageChannel.base(this, 'constructor');

  for (var i = 0, uriField; uriField = goog.net.xpc.UriCfgFields[i]; i++) {
    if (uriField in cfg && !/^https?:\/\//.test(cfg[uriField])) {
      throw Error('URI ' + cfg[uriField] + ' is invalid for field ' + uriField);
    }
  }

 ***REMOVED*****REMOVED***
  ***REMOVED*** The configuration for this channel.
  ***REMOVED*** @type {Object}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.cfg_ = cfg;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The name of the channel. Please use
  ***REMOVED*** <code>updateChannelNameAndCatalog</code> to change this from the transports
  ***REMOVED*** vs changing the property directly.
  ***REMOVED*** @type {string}
 ***REMOVED*****REMOVED***
  this.name = this.cfg_[goog.net.xpc.CfgFields.CHANNEL_NAME] ||
      goog.net.xpc.getRandomString(10);

 ***REMOVED*****REMOVED***
  ***REMOVED*** The dom helper to use for accessing the dom.
  ***REMOVED*** @type {goog.dom.DomHelper}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.domHelper_ = opt_domHelper || goog.dom.getDomHelper();

 ***REMOVED*****REMOVED***
  ***REMOVED*** Collects deferred function calls which will be made once the connection
  ***REMOVED*** has been fully set up.
  ***REMOVED*** @type {!Array.<function()>}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.deferredDeliveries_ = [];

 ***REMOVED*****REMOVED***
  ***REMOVED*** An event handler used to listen for load events on peer iframes.
  ***REMOVED*** @type {!goog.events.EventHandler.<!goog.net.xpc.CrossPageChannel>}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.peerLoadHandler_ = new goog.events.EventHandler(this);

  // If LOCAL_POLL_URI or PEER_POLL_URI is not available, try using
  // robots.txt from that host.
  cfg[goog.net.xpc.CfgFields.LOCAL_POLL_URI] =
      cfg[goog.net.xpc.CfgFields.LOCAL_POLL_URI] ||
      goog.uri.utils.getHost(this.domHelper_.getWindow().location.href) +
          '/robots.txt';
  // PEER_URI is sometimes undefined in tests.
  cfg[goog.net.xpc.CfgFields.PEER_POLL_URI] =
      cfg[goog.net.xpc.CfgFields.PEER_POLL_URI] ||
      goog.uri.utils.getHost(cfg[goog.net.xpc.CfgFields.PEER_URI] || '') +
          '/robots.txt';

  goog.net.xpc.channels[this.name] = this;

  if (!goog.events.getListener(window, goog.events.EventType.UNLOAD,
      goog.net.xpc.CrossPageChannel.disposeAll_)) {
    // Set listener to dispose all registered channels on page unload.
    goog.events.listenOnce(window, goog.events.EventType.UNLOAD,
        goog.net.xpc.CrossPageChannel.disposeAll_);
  }

  goog.log.info(goog.net.xpc.logger, 'CrossPageChannel created: ' + this.name);
***REMOVED***
goog.inherits(goog.net.xpc.CrossPageChannel, goog.messaging.AbstractChannel);


***REMOVED***
***REMOVED*** Regexp for escaping service names.
***REMOVED*** @type {RegExp}
***REMOVED*** @private
***REMOVED***
goog.net.xpc.CrossPageChannel.TRANSPORT_SERVICE_ESCAPE_RE_ =
    new RegExp('^%*' + goog.net.xpc.TRANSPORT_SERVICE_ + '$');


***REMOVED***
***REMOVED*** Regexp for unescaping service names.
***REMOVED*** @type {RegExp}
***REMOVED*** @private
***REMOVED***
goog.net.xpc.CrossPageChannel.TRANSPORT_SERVICE_UNESCAPE_RE_ =
    new RegExp('^%+' + goog.net.xpc.TRANSPORT_SERVICE_ + '$');


***REMOVED***
***REMOVED*** A delay between the transport reporting as connected and the calling of the
***REMOVED*** connection callback.  Sometimes used to paper over timing vulnerabilities.
***REMOVED*** @type {goog.async.Delay}
***REMOVED*** @private
***REMOVED***
goog.net.xpc.CrossPageChannel.prototype.connectionDelay_ = null;


***REMOVED***
***REMOVED*** A deferred which is set to non-null while a peer iframe is being created
***REMOVED*** but has not yet thrown its load event, and which fires when that load event
***REMOVED*** arrives.
***REMOVED*** @type {goog.async.Deferred}
***REMOVED*** @private
***REMOVED***
goog.net.xpc.CrossPageChannel.prototype.peerWindowDeferred_ = null;


***REMOVED***
***REMOVED*** The transport.
***REMOVED*** @type {goog.net.xpc.Transport?}
***REMOVED*** @private
***REMOVED***
goog.net.xpc.CrossPageChannel.prototype.transport_ = null;


***REMOVED***
***REMOVED*** The channel state.
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.net.xpc.CrossPageChannel.prototype.state_ =
    goog.net.xpc.ChannelStates.NOT_CONNECTED;


***REMOVED***
***REMOVED*** @override
***REMOVED*** @return {boolean} Whether the channel is connected.
***REMOVED***
goog.net.xpc.CrossPageChannel.prototype.isConnected = function() {
  return this.state_ == goog.net.xpc.ChannelStates.CONNECTED;
***REMOVED***


***REMOVED***
***REMOVED*** Reference to the window-object of the peer page.
***REMOVED*** @type {Object}
***REMOVED*** @private
***REMOVED***
goog.net.xpc.CrossPageChannel.prototype.peerWindowObject_ = null;


***REMOVED***
***REMOVED*** Reference to the iframe-element.
***REMOVED*** @type {Object}
***REMOVED*** @private
***REMOVED***
goog.net.xpc.CrossPageChannel.prototype.iframeElement_ = null;


***REMOVED***
***REMOVED*** Returns the configuration object for this channel.
***REMOVED*** Package private. Do not call from outside goog.net.xpc.
***REMOVED***
***REMOVED*** @return {Object} The configuration object for this channel.
***REMOVED***
goog.net.xpc.CrossPageChannel.prototype.getConfig = function() {
  return this.cfg_;
***REMOVED***


***REMOVED***
***REMOVED*** Returns a reference to the iframe-element.
***REMOVED*** Package private. Do not call from outside goog.net.xpc.
***REMOVED***
***REMOVED*** @return {Object} A reference to the iframe-element.
***REMOVED***
goog.net.xpc.CrossPageChannel.prototype.getIframeElement = function() {
  return this.iframeElement_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the window object the foreign document resides in.
***REMOVED***
***REMOVED*** @param {Object} peerWindowObject The window object of the peer.
***REMOVED***
goog.net.xpc.CrossPageChannel.prototype.setPeerWindowObject =
    function(peerWindowObject) {
  this.peerWindowObject_ = peerWindowObject;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the window object the foreign document resides in.
***REMOVED*** Package private. Do not call from outside goog.net.xpc.
***REMOVED***
***REMOVED*** @return {Object} The window object of the peer.
***REMOVED***
goog.net.xpc.CrossPageChannel.prototype.getPeerWindowObject = function() {
  return this.peerWindowObject_;
***REMOVED***


***REMOVED***
***REMOVED*** Determines whether the peer window is available (e.g. not closed).
***REMOVED*** Package private. Do not call from outside goog.net.xpc.
***REMOVED***
***REMOVED*** @return {boolean} Whether the peer window is available.
***REMOVED***
goog.net.xpc.CrossPageChannel.prototype.isPeerAvailable = function() {
  // NOTE(user): This check is not reliable in IE, where a document in an
  // iframe does not get unloaded when removing the iframe element from the DOM.
  // TODO(user): Find something that works in IE as well.
  // NOTE(user): "!this.peerWindowObject_.closed" evaluates to 'false' in IE9
  // sometimes even though typeof(this.peerWindowObject_.closed) is boolean and
  // this.peerWindowObject_.closed evaluates to 'false'. Casting it to a Boolean
  // results in sane evaluation. When this happens, it's in the inner iframe
  // when querying its parent's 'closed' status. Note that this is a different
  // case than mibuerge@'s note above.
  try {
    return !!this.peerWindowObject_ && !Boolean(this.peerWindowObject_.closed);
  } catch (e) {
    // If the window is closing, an error may be thrown.
    return false;
  }
***REMOVED***


***REMOVED***
***REMOVED*** Determine which transport type to use for this channel / useragent.
***REMOVED*** @return {goog.net.xpc.TransportTypes|undefined} The best transport type.
***REMOVED*** @private
***REMOVED***
goog.net.xpc.CrossPageChannel.prototype.determineTransportType_ = function() {
  var transportType;
  if (goog.isFunction(document.postMessage) ||
      goog.isFunction(window.postMessage) ||
      // IE8 supports window.postMessage, but
      // typeof window.postMessage returns "object"
      (goog.userAgent.IE && window.postMessage)) {
    transportType = goog.net.xpc.TransportTypes.NATIVE_MESSAGING;
  } else if (goog.userAgent.GECKO) {
    transportType = goog.net.xpc.TransportTypes.FRAME_ELEMENT_METHOD;
  } else if (goog.userAgent.IE &&
             this.cfg_[goog.net.xpc.CfgFields.PEER_RELAY_URI]) {
    transportType = goog.net.xpc.TransportTypes.IFRAME_RELAY;
  } else if (goog.userAgent.IE && goog.net.xpc.NixTransport.isNixSupported()) {
    transportType = goog.net.xpc.TransportTypes.NIX;
  } else {
    transportType = goog.net.xpc.TransportTypes.IFRAME_POLLING;
  }
  return transportType;
***REMOVED***


***REMOVED***
***REMOVED*** Creates the transport for this channel. Chooses from the available
***REMOVED*** transport based on the user agent and the configuration.
***REMOVED*** @private
***REMOVED***
goog.net.xpc.CrossPageChannel.prototype.createTransport_ = function() {
  // return, if the transport has already been created
  if (this.transport_) {
    return;
  }

  // TODO(user): Use goog.scope.
  var CfgFields = goog.net.xpc.CfgFields;

  if (!this.cfg_[CfgFields.TRANSPORT]) {
    this.cfg_[CfgFields.TRANSPORT] =
        this.determineTransportType_();
  }

  switch (this.cfg_[CfgFields.TRANSPORT]) {
    case goog.net.xpc.TransportTypes.NATIVE_MESSAGING:
      var protocolVersion = this.cfg_[
          CfgFields.NATIVE_TRANSPORT_PROTOCOL_VERSION] || 2;
      this.transport_ = new goog.net.xpc.NativeMessagingTransport(
          this,
          this.cfg_[CfgFields.PEER_HOSTNAME],
          this.domHelper_,
          !!this.cfg_[CfgFields.ONE_SIDED_HANDSHAKE],
          protocolVersion);
      break;
    case goog.net.xpc.TransportTypes.NIX:
      this.transport_ = new goog.net.xpc.NixTransport(this, this.domHelper_);
      break;
    case goog.net.xpc.TransportTypes.FRAME_ELEMENT_METHOD:
      this.transport_ =
          new goog.net.xpc.FrameElementMethodTransport(this, this.domHelper_);
      break;
    case goog.net.xpc.TransportTypes.IFRAME_RELAY:
      this.transport_ =
          new goog.net.xpc.IframeRelayTransport(this, this.domHelper_);
      break;
    case goog.net.xpc.TransportTypes.IFRAME_POLLING:
      this.transport_ =
          new goog.net.xpc.IframePollingTransport(this, this.domHelper_);
      break;
    case goog.net.xpc.TransportTypes.DIRECT:
      if (this.peerWindowObject_ &&
          goog.net.xpc.DirectTransport.isSupported(***REMOVED*** @type {!Window}***REMOVED*** (
              this.peerWindowObject_))) {
        this.transport_ =
            new goog.net.xpc.DirectTransport(this, this.domHelper_);
      } else {
        goog.log.info(
            goog.net.xpc.logger,
            'DirectTransport not supported for this window, peer window in' +
            ' different security context or not set yet.');
      }
      break;
  }

  if (this.transport_) {
    goog.log.info(goog.net.xpc.logger,
        'Transport created: ' + this.transport_.getName());
  } else {
    throw Error('CrossPageChannel: No suitable transport found!');
  }
***REMOVED***


***REMOVED***
***REMOVED*** Returns the transport type in use for this channel.
***REMOVED*** @return {number} Transport-type identifier.
***REMOVED***
goog.net.xpc.CrossPageChannel.prototype.getTransportType = function() {
  return this.transport_.getType();
***REMOVED***


***REMOVED***
***REMOVED*** Returns the tranport name in use for this channel.
***REMOVED*** @return {string} The transport name.
***REMOVED***
goog.net.xpc.CrossPageChannel.prototype.getTransportName = function() {
  return this.transport_.getName();
***REMOVED***


***REMOVED***
***REMOVED*** @return {!Object} Configuration-object to be used by the peer to
***REMOVED***     initialize the channel.
***REMOVED***
goog.net.xpc.CrossPageChannel.prototype.getPeerConfiguration = function() {
  var peerCfg = {***REMOVED***
  peerCfg[goog.net.xpc.CfgFields.CHANNEL_NAME] = this.name;
  peerCfg[goog.net.xpc.CfgFields.TRANSPORT] =
      this.cfg_[goog.net.xpc.CfgFields.TRANSPORT];
  peerCfg[goog.net.xpc.CfgFields.ONE_SIDED_HANDSHAKE] =
      this.cfg_[goog.net.xpc.CfgFields.ONE_SIDED_HANDSHAKE];

  if (this.cfg_[goog.net.xpc.CfgFields.LOCAL_RELAY_URI]) {
    peerCfg[goog.net.xpc.CfgFields.PEER_RELAY_URI] =
        this.cfg_[goog.net.xpc.CfgFields.LOCAL_RELAY_URI];
  }
  if (this.cfg_[goog.net.xpc.CfgFields.LOCAL_POLL_URI]) {
    peerCfg[goog.net.xpc.CfgFields.PEER_POLL_URI] =
        this.cfg_[goog.net.xpc.CfgFields.LOCAL_POLL_URI];
  }
  if (this.cfg_[goog.net.xpc.CfgFields.PEER_POLL_URI]) {
    peerCfg[goog.net.xpc.CfgFields.LOCAL_POLL_URI] =
        this.cfg_[goog.net.xpc.CfgFields.PEER_POLL_URI];
  }
  var role = this.cfg_[goog.net.xpc.CfgFields.ROLE];
  if (role) {
    peerCfg[goog.net.xpc.CfgFields.ROLE] =
        role == goog.net.xpc.CrossPageChannelRole.INNER ?
            goog.net.xpc.CrossPageChannelRole.OUTER :
            goog.net.xpc.CrossPageChannelRole.INNER;
  }

  return peerCfg;
***REMOVED***


***REMOVED***
***REMOVED*** Creates the iframe containing the peer page in a specified parent element.
***REMOVED*** This method does not connect the channel, connect() still has to be called
***REMOVED*** separately.
***REMOVED***
***REMOVED*** @param {!Element} parentElm The container element the iframe is appended to.
***REMOVED*** @param {Function=} opt_configureIframeCb If present, this function gets
***REMOVED***     called with the iframe element as parameter to allow setting properties
***REMOVED***     on it before it gets added to the DOM. If absent, the iframe's width and
***REMOVED***     height are set to '100%'.
***REMOVED*** @param {boolean=} opt_addCfgParam Whether to add the peer configuration as
***REMOVED***     URL parameter (default: true).
***REMOVED*** @return {!HTMLIFrameElement} The iframe element.
***REMOVED***
goog.net.xpc.CrossPageChannel.prototype.createPeerIframe = function(
    parentElm, opt_configureIframeCb, opt_addCfgParam) {
  goog.log.info(goog.net.xpc.logger, 'createPeerIframe()');

  var iframeId = this.cfg_[goog.net.xpc.CfgFields.IFRAME_ID];
  if (!iframeId) {
    // Create a randomized ID for the iframe element to avoid
    // bfcache-related issues.
    iframeId = this.cfg_[goog.net.xpc.CfgFields.IFRAME_ID] =
        'xpcpeer' + goog.net.xpc.getRandomString(4);
  }

  // TODO(user) Opera creates a history-entry when creating an iframe
  // programmatically as follows. Find a way which avoids this.

  var iframeElm = goog.dom.getDomHelper(parentElm).createElement('IFRAME');
  iframeElm.id = iframeElm.name = iframeId;
  if (opt_configureIframeCb) {
    opt_configureIframeCb(iframeElm);
  } else {
    iframeElm.style.width = iframeElm.style.height = '100%';
  }

  this.cleanUpIncompleteConnection_();
  this.peerWindowDeferred_ =
      new goog.async.Deferred(undefined, this);
  var peerUri = this.getPeerUri(opt_addCfgParam);
  this.peerLoadHandler_.listenOnceWithScope(iframeElm, 'load',
      this.peerWindowDeferred_.callback, false, this.peerWindowDeferred_);

  if (goog.userAgent.GECKO || goog.userAgent.WEBKIT) {
    // Appending the iframe in a timeout to avoid a weird fastback issue, which
    // is present in Safari and Gecko.
    window.setTimeout(
        goog.bind(function() {
          parentElm.appendChild(iframeElm);
          iframeElm.src = peerUri.toString();
          goog.log.info(goog.net.xpc.logger,
              'peer iframe created (' + iframeId + ')');
        }, this), 1);
  } else {
    iframeElm.src = peerUri.toString();
    parentElm.appendChild(iframeElm);
    goog.log.info(goog.net.xpc.logger,
        'peer iframe created (' + iframeId + ')');
  }

  return***REMOVED*****REMOVED*** @type {!HTMLIFrameElement}***REMOVED*** (iframeElm);
***REMOVED***


***REMOVED***
***REMOVED*** Clean up after any incomplete attempt to establish and connect to a peer
***REMOVED*** iframe.
***REMOVED*** @private
***REMOVED***
goog.net.xpc.CrossPageChannel.prototype.cleanUpIncompleteConnection_ =
    function() {
  if (this.peerWindowDeferred_) {
    this.peerWindowDeferred_.cancel();
    this.peerWindowDeferred_ = null;
  }
  this.deferredDeliveries_.length = 0;
  this.peerLoadHandler_.removeAll();
***REMOVED***


***REMOVED***
***REMOVED*** Returns the peer URI, with an optional URL parameter for configuring the peer
***REMOVED*** window.
***REMOVED***
***REMOVED*** @param {boolean=} opt_addCfgParam Whether to add the peer configuration as
***REMOVED***     URL parameter (default: true).
***REMOVED*** @return {!goog.Uri} The peer URI.
***REMOVED***
goog.net.xpc.CrossPageChannel.prototype.getPeerUri = function(opt_addCfgParam) {
  var peerUri = this.cfg_[goog.net.xpc.CfgFields.PEER_URI];
  if (goog.isString(peerUri)) {
    peerUri = this.cfg_[goog.net.xpc.CfgFields.PEER_URI] =
        new goog.Uri(peerUri);
  }

  // Add the channel configuration used by the peer as URL parameter.
  if (opt_addCfgParam !== false) {
    peerUri.setParameterValue('xpc',
                              goog.json.serialize(
                                  this.getPeerConfiguration()));
  }

  return peerUri;
***REMOVED***


***REMOVED***
***REMOVED*** Initiates connecting the channel. When this method is called, all the
***REMOVED*** information needed to connect the channel has to be available.
***REMOVED***
***REMOVED*** @override
***REMOVED*** @param {Function=} opt_connectCb The function to be called when the
***REMOVED*** channel has been connected and is ready to be used.
***REMOVED***
goog.net.xpc.CrossPageChannel.prototype.connect = function(opt_connectCb) {
  this.connectCb_ = opt_connectCb || goog.nullFunction;

  // If we know of a peer window whose creation has been requested but is not
  // complete, peerWindowDeferred_ will be non-null, and we should block on it.
  if (this.peerWindowDeferred_) {
    this.peerWindowDeferred_.addCallback(this.continueConnection_);
  } else {
    this.continueConnection_();
  }
***REMOVED***


***REMOVED***
***REMOVED*** Continues the connection process once we're as sure as we can be that the
***REMOVED*** peer iframe has been created.
***REMOVED*** @private
***REMOVED***
goog.net.xpc.CrossPageChannel.prototype.continueConnection_ = function() {
  goog.log.info(goog.net.xpc.logger, 'continueConnection_()');
  this.peerWindowDeferred_ = null;
  if (this.cfg_[goog.net.xpc.CfgFields.IFRAME_ID]) {
    this.iframeElement_ = this.domHelper_.getElement(
        this.cfg_[goog.net.xpc.CfgFields.IFRAME_ID]);
  }
  if (this.iframeElement_) {
    var winObj = this.iframeElement_.contentWindow;
    // accessing the window using contentWindow doesn't work in safari
    if (!winObj) {
      winObj = window.frames[this.cfg_[goog.net.xpc.CfgFields.IFRAME_ID]];
    }
    this.setPeerWindowObject(winObj);
  }

  // if the peer window object has not been set at this point, we assume
  // being in an iframe and the channel is meant to be to the containing page
  if (!this.peerWindowObject_) {
    // throw an error if we are in the top window (== not in an iframe)
    if (window == window.top) {
      throw Error(
          "CrossPageChannel: Can't connect, peer window-object not set.");
    } else {
      this.setPeerWindowObject(window.parent);
    }
  }

  this.createTransport_();

  this.transport_.connect();

  // Now we run any deferred deliveries collected while connection was deferred.
  while (this.deferredDeliveries_.length > 0) {
    this.deferredDeliveries_.shift()();
  }
***REMOVED***


***REMOVED***
***REMOVED*** Closes the channel.
***REMOVED***
goog.net.xpc.CrossPageChannel.prototype.close = function() {
  this.cleanUpIncompleteConnection_();
  this.state_ = goog.net.xpc.ChannelStates.CLOSED;
  goog.dispose(this.transport_);
  this.transport_ = null;
  this.connectCb_ = null;
  goog.dispose(this.connectionDelay_);
  this.connectionDelay_ = null;
  goog.log.info(goog.net.xpc.logger, 'Channel "' + this.name + '" closed');
***REMOVED***


***REMOVED***
***REMOVED*** Package-private.
***REMOVED*** Called by the transport when the channel is connected.
***REMOVED*** @param {number=} opt_delay Delay this number of milliseconds before calling
***REMOVED***     the connection callback. Usage is discouraged, but can be used to paper
***REMOVED***     over timing vulnerabilities when there is no alternative.
***REMOVED***
goog.net.xpc.CrossPageChannel.prototype.notifyConnected = function(opt_delay) {
  if (this.isConnected() ||
      (this.connectionDelay_ && this.connectionDelay_.isActive())) {
    return;
  }
  this.state_ = goog.net.xpc.ChannelStates.CONNECTED;
  goog.log.info(goog.net.xpc.logger, 'Channel "' + this.name + '" connected');
  goog.dispose(this.connectionDelay_);
  if (goog.isDef(opt_delay)) {
    this.connectionDelay_ =
        new goog.async.Delay(this.connectCb_, opt_delay);
    this.connectionDelay_.start();
  } else {
    this.connectionDelay_ = null;
    this.connectCb_();
  }
***REMOVED***


***REMOVED***
***REMOVED*** Alias for notifyConected, for backward compatibility reasons.
***REMOVED*** @private
***REMOVED***
goog.net.xpc.CrossPageChannel.prototype.notifyConnected_ =
    goog.net.xpc.CrossPageChannel.prototype.notifyConnected;


***REMOVED***
***REMOVED*** Called by the transport in case of an unrecoverable failure.
***REMOVED*** Package private. Do not call from outside goog.net.xpc.
***REMOVED***
goog.net.xpc.CrossPageChannel.prototype.notifyTransportError = function() {
  goog.log.info(goog.net.xpc.logger, 'Transport Error');
  this.close();
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.net.xpc.CrossPageChannel.prototype.send = function(serviceName, payload) {
  if (!this.isConnected()) {
    goog.log.error(goog.net.xpc.logger, 'Can\'t send. Channel not connected.');
    return;
  }
  // Check if the peer is still around.
  if (!this.isPeerAvailable()) {
    goog.log.error(goog.net.xpc.logger, 'Peer has disappeared.');
    this.close();
    return;
  }
  if (goog.isObject(payload)) {
    payload = goog.json.serialize(payload);
  }

  // Partially URL-encode the service name because some characters (: and |) are
  // used as delimiters for some transports, and we want to allow those
  // characters in service names.
  this.transport_.send(this.escapeServiceName_(serviceName), payload);
***REMOVED***


***REMOVED***
***REMOVED*** Delivers messages to the appropriate service-handler. Named xpcDeliver to
***REMOVED*** avoid name conflict with {@code deliver} function in superclass
***REMOVED*** goog.messaging.AbstractChannel.
***REMOVED***
***REMOVED*** Package private. Do not call from outside goog.net.xpc.
***REMOVED***
***REMOVED*** @param {string} serviceName The name of the port.
***REMOVED*** @param {string} payload The payload.
***REMOVED*** @param {string=} opt_origin An optional origin for the message, where the
***REMOVED***     underlying transport makes that available.  If this is specified, and
***REMOVED***     the PEER_HOSTNAME parameter was provided, they must match or the message
***REMOVED***     will be rejected.
***REMOVED***
goog.net.xpc.CrossPageChannel.prototype.xpcDeliver = function(
    serviceName, payload, opt_origin) {

  // This check covers the very rare (but producable) case where the inner frame
  // becomes ready and sends its setup message while the outer frame is
  // deferring its connect method waiting for the inner frame to be ready. The
  // resulting deferral ensures the message will not be processed until the
  // channel is fully configured.
  if (this.peerWindowDeferred_) {
    this.deferredDeliveries_.push(
        goog.bind(this.xpcDeliver, this, serviceName, payload, opt_origin));
    return;
  }

  // Check whether the origin of the message is as expected.
  if (!this.isMessageOriginAcceptable_(opt_origin)) {
    goog.log.warning(goog.net.xpc.logger,
        'Message received from unapproved origin "' +
        opt_origin + '" - rejected.');
    return;
  }

  if (this.isDisposed()) {
    goog.log.warning(goog.net.xpc.logger,
        'CrossPageChannel::xpcDeliver(): Disposed.');
  } else if (!serviceName ||
      serviceName == goog.net.xpc.TRANSPORT_SERVICE_) {
    this.transport_.transportServiceHandler(payload);
  } else {
    // only deliver messages if connected
    if (this.isConnected()) {
      this.deliver(this.unescapeServiceName_(serviceName), payload);
    } else {
      goog.log.info(goog.net.xpc.logger,
          'CrossPageChannel::xpcDeliver(): Not connected.');
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** Escape the user-provided service name for sending across the channel. This
***REMOVED*** URL-encodes certain special characters so they don't conflict with delimiters
***REMOVED*** used by some of the transports, and adds a special prefix if the name
***REMOVED*** conflicts with the reserved transport service name.
***REMOVED***
***REMOVED*** This is the opposite of {@link #unescapeServiceName_}.
***REMOVED***
***REMOVED*** @param {string} name The name of the service to escape.
***REMOVED*** @return {string} The escaped service name.
***REMOVED*** @private
***REMOVED***
goog.net.xpc.CrossPageChannel.prototype.escapeServiceName_ = function(name) {
  if (goog.net.xpc.CrossPageChannel.TRANSPORT_SERVICE_ESCAPE_RE_.test(name)) {
    name = '%' + name;
  }
  return name.replace(/[%:|]/g, encodeURIComponent);
***REMOVED***


***REMOVED***
***REMOVED*** Unescape the escaped service name that was sent across the channel. This is
***REMOVED*** the opposite of {@link #escapeServiceName_}.
***REMOVED***
***REMOVED*** @param {string} name The name of the service to unescape.
***REMOVED*** @return {string} The unescaped service name.
***REMOVED*** @private
***REMOVED***
goog.net.xpc.CrossPageChannel.prototype.unescapeServiceName_ = function(name) {
  name = name.replace(/%[0-9a-f]{2}/gi, decodeURIComponent);
  if (goog.net.xpc.CrossPageChannel.TRANSPORT_SERVICE_UNESCAPE_RE_.test(name)) {
    return name.substring(1);
  } else {
    return name;
  }
***REMOVED***


***REMOVED***
***REMOVED*** Returns the role of this channel (either inner or outer).
***REMOVED*** @return {number} The role of this channel.
***REMOVED***
goog.net.xpc.CrossPageChannel.prototype.getRole = function() {
  var role = this.cfg_[goog.net.xpc.CfgFields.ROLE];
  if (goog.isNumber(role)) {
    return role;
  } else {
    return window.parent == this.peerWindowObject_ ?
        goog.net.xpc.CrossPageChannelRole.INNER :
        goog.net.xpc.CrossPageChannelRole.OUTER;
  }
***REMOVED***


***REMOVED***
***REMOVED*** Sets the channel name. Note, this doesn't establish a unique channel to
***REMOVED*** communicate on.
***REMOVED*** @param {string} name The new channel name.
***REMOVED***
goog.net.xpc.CrossPageChannel.prototype.updateChannelNameAndCatalog = function(
    name) {
  goog.log.fine(goog.net.xpc.logger, 'changing channel name to ' + name);
  delete goog.net.xpc.channels[this.name];
  this.name = name;
  goog.net.xpc.channels[name] = this;
***REMOVED***


***REMOVED***
***REMOVED*** Returns whether an incoming message with the given origin is acceptable.
***REMOVED*** If an incoming request comes with a specified (non-empty) origin, and the
***REMOVED*** PEER_HOSTNAME config parameter has also been provided, the two must match,
***REMOVED*** or the message is unacceptable.
***REMOVED*** @param {string=} opt_origin The origin associated with the incoming message.
***REMOVED*** @return {boolean} Whether the message is acceptable.
***REMOVED*** @private
***REMOVED***
goog.net.xpc.CrossPageChannel.prototype.isMessageOriginAcceptable_ = function(
    opt_origin) {
  var peerHostname = this.cfg_[goog.net.xpc.CfgFields.PEER_HOSTNAME];
  return goog.string.isEmptySafe(opt_origin) ||
      goog.string.isEmptySafe(peerHostname) ||
      opt_origin == this.cfg_[goog.net.xpc.CfgFields.PEER_HOSTNAME];
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.net.xpc.CrossPageChannel.prototype.disposeInternal = function() {
  this.close();

  this.peerWindowObject_ = null;
  this.iframeElement_ = null;
  delete goog.net.xpc.channels[this.name];
  goog.dispose(this.peerLoadHandler_);
  delete this.peerLoadHandler_;
  goog.net.xpc.CrossPageChannel.base(this, 'disposeInternal');
***REMOVED***


***REMOVED***
***REMOVED*** Disposes all channels.
***REMOVED*** @private
***REMOVED***
goog.net.xpc.CrossPageChannel.disposeAll_ = function() {
  for (var name in goog.net.xpc.channels) {
    goog.dispose(goog.net.xpc.channels[name]);
  }
***REMOVED***
