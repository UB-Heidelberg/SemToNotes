// Copyright 2008 The Closure Library Authors. All Rights Reserved.
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
***REMOVED*** @fileoverview Contains the NIX (Native IE XDC) method transport for
***REMOVED*** cross-domain communication. It exploits the fact that Internet Explorer
***REMOVED*** allows a window that is the parent of an iframe to set said iframe window's
***REMOVED*** opener property to an object. This object can be a function that in turn
***REMOVED*** can be used to send a message despite same-origin constraints. Note that
***REMOVED*** this function, if a pure JavaScript object, opens up the possibilitiy of
***REMOVED*** gaining a hold of the context of the other window and in turn, attacking
***REMOVED*** it. This implementation therefore wraps the JavaScript objects used inside
***REMOVED*** a VBScript class. Since VBScript objects are passed in JavaScript as a COM
***REMOVED*** wrapper (like DOM objects), they are thus opaque to JavaScript
***REMOVED*** (except for the interface they expose). This therefore provides a safe
***REMOVED*** method of transport.
***REMOVED***
***REMOVED***
***REMOVED*** Initially based on FrameElementTransport which shares some similarities
***REMOVED*** to this method.
***REMOVED***

goog.provide('goog.net.xpc.NixTransport');

goog.require('goog.log');
goog.require('goog.net.xpc');
goog.require('goog.net.xpc.CfgFields');
goog.require('goog.net.xpc.CrossPageChannelRole');
goog.require('goog.net.xpc.Transport');
goog.require('goog.net.xpc.TransportTypes');
goog.require('goog.reflect');



***REMOVED***
***REMOVED*** NIX method transport.
***REMOVED***
***REMOVED*** NOTE(user): NIX method tested in all IE versions starting from 6.0.
***REMOVED***
***REMOVED*** @param {goog.net.xpc.CrossPageChannel} channel The channel this transport
***REMOVED***     belongs to.
***REMOVED*** @param {goog.dom.DomHelper=} opt_domHelper The dom helper to use for finding
***REMOVED***     the correct window.
***REMOVED***
***REMOVED*** @extends {goog.net.xpc.Transport}
***REMOVED*** @final
***REMOVED***
goog.net.xpc.NixTransport = function(channel, opt_domHelper) {
  goog.net.xpc.NixTransport.base(this, 'constructor', opt_domHelper);

 ***REMOVED*****REMOVED***
  ***REMOVED*** The channel this transport belongs to.
  ***REMOVED*** @type {goog.net.xpc.CrossPageChannel}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.channel_ = channel;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The authorization token, if any, used by this transport.
  ***REMOVED*** @type {?string}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.authToken_ = channel[goog.net.xpc.CfgFields.AUTH_TOKEN] || '';

 ***REMOVED*****REMOVED***
  ***REMOVED*** The authorization token, if any, that must be sent by the other party
  ***REMOVED*** for setup to occur.
  ***REMOVED*** @type {?string}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.remoteAuthToken_ =
      channel[goog.net.xpc.CfgFields.REMOTE_AUTH_TOKEN] || '';

  // Conduct the setup work for NIX in general, if need be.
  goog.net.xpc.NixTransport.conductGlobalSetup_(this.getWindow());

  // Setup aliases so that VBScript can call these methods
  // on the transport class, even if they are renamed during
  // compression.
  this[goog.net.xpc.NixTransport.NIX_HANDLE_MESSAGE] = this.handleMessage_;
  this[goog.net.xpc.NixTransport.NIX_CREATE_CHANNEL] = this.createChannel_;
***REMOVED***
goog.inherits(goog.net.xpc.NixTransport, goog.net.xpc.Transport);


// Consts for NIX. VBScript doesn't allow items to start with _ for some
// reason, so we need to make these names quite unique, as they will go into
// the global namespace.


***REMOVED***
***REMOVED*** Global name of the Wrapper VBScript class.
***REMOVED*** Note that this class will be stored in the***REMOVED***global*
***REMOVED*** namespace (i.e. window in browsers).
***REMOVED*** @type {string}
***REMOVED***
goog.net.xpc.NixTransport.NIX_WRAPPER = 'GCXPC____NIXVBS_wrapper';


***REMOVED***
***REMOVED*** Global name of the GetWrapper VBScript function. This
***REMOVED*** constant is used by JavaScript to call this function.
***REMOVED*** Note that this function will be stored in the***REMOVED***global*
***REMOVED*** namespace (i.e. window in browsers).
***REMOVED*** @type {string}
***REMOVED***
goog.net.xpc.NixTransport.NIX_GET_WRAPPER = 'GCXPC____NIXVBS_get_wrapper';


***REMOVED***
***REMOVED*** The name of the handle message method used by the wrapper class
***REMOVED*** when calling the transport.
***REMOVED*** @type {string}
***REMOVED***
goog.net.xpc.NixTransport.NIX_HANDLE_MESSAGE = 'GCXPC____NIXJS_handle_message';


***REMOVED***
***REMOVED*** The name of the create channel method used by the wrapper class
***REMOVED*** when calling the transport.
***REMOVED*** @type {string}
***REMOVED***
goog.net.xpc.NixTransport.NIX_CREATE_CHANNEL = 'GCXPC____NIXJS_create_channel';


***REMOVED***
***REMOVED*** A "unique" identifier that is stored in the wrapper
***REMOVED*** class so that the wrapper can be distinguished from
***REMOVED*** other objects easily.
***REMOVED*** @type {string}
***REMOVED***
goog.net.xpc.NixTransport.NIX_ID_FIELD = 'GCXPC____NIXVBS_container';


***REMOVED***
***REMOVED*** Determines if the installed version of IE supports accessing window.opener
***REMOVED*** after it has been set to a non-Window/null value. NIX relies on this being
***REMOVED*** possible.
***REMOVED*** @return {boolean} Whether window.opener behavior is compatible with NIX.
***REMOVED***
goog.net.xpc.NixTransport.isNixSupported = function() {
  var isSupported = false;
  try {
    var oldOpener = window.opener;
    // The compiler complains (as it should!) if we set window.opener to
    // something other than a window or null.
    window.opener =***REMOVED*****REMOVED*** @type {Window}***REMOVED*** ({});
    isSupported = goog.reflect.canAccessProperty(window, 'opener');
    window.opener = oldOpener;
  } catch (e) { }
  return isSupported;
***REMOVED***


***REMOVED***
***REMOVED*** Conducts the global setup work for the NIX transport method.
***REMOVED*** This function creates and then injects into the page the
***REMOVED*** VBScript code necessary to create the NIX wrapper class.
***REMOVED*** Note that this method can be called multiple times, as
***REMOVED*** it internally checks whether the work is necessary before
***REMOVED*** proceeding.
***REMOVED*** @param {Window} listenWindow The window containing the affected page.
***REMOVED*** @private
***REMOVED***
goog.net.xpc.NixTransport.conductGlobalSetup_ = function(listenWindow) {
  if (listenWindow['nix_setup_complete']) {
    return;
  }

  // Inject the VBScript code needed.
  var vbscript =
      // We create a class to act as a wrapper for
      // a Javascript call, to prevent a break in of
      // the context.
      'Class ' + goog.net.xpc.NixTransport.NIX_WRAPPER + '\n ' +

      // An internal member for keeping track of the
      // transport for which this wrapper exists.
      'Private m_Transport\n' +

      // An internal member for keeping track of the
      // auth token associated with the context that
      // created this wrapper. Used for validation
      // purposes.
      'Private m_Auth\n' +

      // Method for internally setting the value
      // of the m_Transport property. We have the
      // isEmpty check to prevent the transport
      // from being overridden with an illicit
      // object by a malicious party.
      'Public Sub SetTransport(transport)\n' +
      'If isEmpty(m_Transport) Then\n' +
      'Set m_Transport = transport\n' +
      'End If\n' +
      'End Sub\n' +

      // Method for internally setting the value
      // of the m_Auth property. We have the
      // isEmpty check to prevent the transport
      // from being overridden with an illicit
      // object by a malicious party.
      'Public Sub SetAuth(auth)\n' +
      'If isEmpty(m_Auth) Then\n' +
      'm_Auth = auth\n' +
      'End If\n' +
      'End Sub\n' +

      // Returns the auth token to the gadget, so it can
      // confirm a match before initiating the connection
      'Public Function GetAuthToken()\n ' +
      'GetAuthToken = m_Auth\n' +
      'End Function\n' +

      // A wrapper method which causes a
      // message to be sent to the other context.
      'Public Sub SendMessage(service, payload)\n ' +
      'Call m_Transport.' +
      goog.net.xpc.NixTransport.NIX_HANDLE_MESSAGE + '(service, payload)\n' +
      'End Sub\n' +

      // Method for setting up the inner->outer
      // channel.
      'Public Sub CreateChannel(channel)\n ' +
      'Call m_Transport.' +
      goog.net.xpc.NixTransport.NIX_CREATE_CHANNEL + '(channel)\n' +
      'End Sub\n' +

      // An empty field with a unique identifier to
      // prevent the code from confusing this wrapper
      // with a run-of-the-mill value found in window.opener.
      'Public Sub ' + goog.net.xpc.NixTransport.NIX_ID_FIELD + '()\n ' +
      'End Sub\n' +
      'End Class\n ' +

      // Function to get a reference to the wrapper.
      'Function ' +
      goog.net.xpc.NixTransport.NIX_GET_WRAPPER + '(transport, auth)\n' +
      'Dim wrap\n' +
      'Set wrap = New ' + goog.net.xpc.NixTransport.NIX_WRAPPER + '\n' +
      'wrap.SetTransport transport\n' +
      'wrap.SetAuth auth\n' +
      'Set ' + goog.net.xpc.NixTransport.NIX_GET_WRAPPER + ' = wrap\n' +
      'End Function';

  try {
    listenWindow.execScript(vbscript, 'vbscript');
    listenWindow['nix_setup_complete'] = true;
  }
  catch (e) {
    goog.log.error(goog.net.xpc.logger,
        'exception caught while attempting global setup: ' + e);
  }
***REMOVED***


***REMOVED***
***REMOVED*** The transport type.
***REMOVED*** @type {number}
***REMOVED*** @protected
***REMOVED*** @override
***REMOVED***
goog.net.xpc.NixTransport.prototype.transportType =
    goog.net.xpc.TransportTypes.NIX;


***REMOVED***
***REMOVED*** Keeps track of whether the local setup has completed (i.e.
***REMOVED*** the initial work towards setting the channel up has been
***REMOVED*** completed for this end).
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.net.xpc.NixTransport.prototype.localSetupCompleted_ = false;


***REMOVED***
***REMOVED*** The NIX channel used to talk to the other page. This
***REMOVED*** object is in fact a reference to a VBScript class
***REMOVED*** (see above) and as such, is in fact a COM wrapper.
***REMOVED*** When using this object, make sure to not access methods
***REMOVED*** without calling them, otherwise a COM error will be thrown.
***REMOVED*** @type {Object}
***REMOVED*** @private
***REMOVED***
goog.net.xpc.NixTransport.prototype.nixChannel_ = null;


***REMOVED***
***REMOVED*** Connect this transport.
***REMOVED*** @override
***REMOVED***
goog.net.xpc.NixTransport.prototype.connect = function() {
  if (this.channel_.getRole() == goog.net.xpc.CrossPageChannelRole.OUTER) {
    this.attemptOuterSetup_();
  } else {
    this.attemptInnerSetup_();
  }
***REMOVED***


***REMOVED***
***REMOVED*** Attempts to setup the channel from the perspective
***REMOVED*** of the outer (read: container) page. This method
***REMOVED*** will attempt to create a NIX wrapper for this transport
***REMOVED*** and place it into the "opener" property of the inner
***REMOVED*** page's window object. If it fails, it will continue
***REMOVED*** to loop until it does so.
***REMOVED***
***REMOVED*** @private
***REMOVED***
goog.net.xpc.NixTransport.prototype.attemptOuterSetup_ = function() {
  if (this.localSetupCompleted_) {
    return;
  }

  // Get shortcut to iframe-element that contains the inner
  // page.
  var innerFrame = this.channel_.getIframeElement();

  try {
    // Attempt to place the NIX wrapper object into the inner
    // frame's opener property.
    var theWindow = this.getWindow();
    var getWrapper = theWindow[goog.net.xpc.NixTransport.NIX_GET_WRAPPER];
    innerFrame.contentWindow.opener = getWrapper(this, this.authToken_);
    this.localSetupCompleted_ = true;
  }
  catch (e) {
    goog.log.error(goog.net.xpc.logger,
        'exception caught while attempting setup: ' + e);
  }

  // If the retry is necessary, reattempt this setup.
  if (!this.localSetupCompleted_) {
    this.getWindow().setTimeout(goog.bind(this.attemptOuterSetup_, this), 100);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Attempts to setup the channel from the perspective
***REMOVED*** of the inner (read: iframe) page. This method
***REMOVED*** will attempt to***REMOVED***read* the opener object from the
***REMOVED*** page's opener property. If it succeeds, this object
***REMOVED*** is saved into nixChannel_ and the channel is confirmed
***REMOVED*** with the container by calling CreateChannel with an instance
***REMOVED*** of a wrapper for***REMOVED***this* page. Note that if this method
***REMOVED*** fails, it will continue to loop until it succeeds.
***REMOVED***
***REMOVED*** @private
***REMOVED***
goog.net.xpc.NixTransport.prototype.attemptInnerSetup_ = function() {
  if (this.localSetupCompleted_) {
    return;
  }

  try {
    var opener = this.getWindow().opener;

    // Ensure that the object contained inside the opener
    // property is in fact a NIX wrapper.
    if (opener && goog.net.xpc.NixTransport.NIX_ID_FIELD in opener) {
      this.nixChannel_ = opener;

      // Ensure that the NIX channel given to use is valid.
      var remoteAuthToken = this.nixChannel_['GetAuthToken']();

      if (remoteAuthToken != this.remoteAuthToken_) {
        goog.log.error(goog.net.xpc.logger,
            'Invalid auth token from other party');
        return;
      }

      // Complete the construction of the channel by sending our own
      // wrapper to the container via the channel they gave us.
      var theWindow = this.getWindow();
      var getWrapper = theWindow[goog.net.xpc.NixTransport.NIX_GET_WRAPPER];
      this.nixChannel_['CreateChannel'](getWrapper(this, this.authToken_));

      this.localSetupCompleted_ = true;

      // Notify channel that the transport is ready.
      this.channel_.notifyConnected();
    }
  }
  catch (e) {
    goog.log.error(goog.net.xpc.logger,
        'exception caught while attempting setup: ' + e);
    return;
  }

  // If the retry is necessary, reattempt this setup.
  if (!this.localSetupCompleted_) {
    this.getWindow().setTimeout(goog.bind(this.attemptInnerSetup_, this), 100);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Internal method called by the inner page, via the
***REMOVED*** NIX wrapper, to complete the setup of the channel.
***REMOVED***
***REMOVED*** @param {Object} channel The NIX wrapper of the
***REMOVED***  inner page.
***REMOVED*** @private
***REMOVED***
goog.net.xpc.NixTransport.prototype.createChannel_ = function(channel) {
  // Verify that the channel is in fact a NIX wrapper.
  if (typeof channel != 'unknown' ||
      !(goog.net.xpc.NixTransport.NIX_ID_FIELD in channel)) {
    goog.log.error(goog.net.xpc.logger,
        'Invalid NIX channel given to createChannel_');
  }

  this.nixChannel_ = channel;

  // Ensure that the NIX channel given to use is valid.
  var remoteAuthToken = this.nixChannel_['GetAuthToken']();

  if (remoteAuthToken != this.remoteAuthToken_) {
    goog.log.error(goog.net.xpc.logger, 'Invalid auth token from other party');
    return;
  }

  // Indicate to the CrossPageChannel that the channel is setup
  // and ready to use.
  this.channel_.notifyConnected();
***REMOVED***


***REMOVED***
***REMOVED*** Internal method called by the other page, via the NIX wrapper,
***REMOVED*** to deliver a message.
***REMOVED*** @param {string} serviceName The name of the service the message is to be
***REMOVED***   delivered to.
***REMOVED*** @param {string} payload The message to process.
***REMOVED*** @private
***REMOVED***
goog.net.xpc.NixTransport.prototype.handleMessage_ =
    function(serviceName, payload) {
 ***REMOVED*****REMOVED*** @this {goog.net.xpc.NixTransport}***REMOVED***
  var deliveryHandler = function() {
    this.channel_.xpcDeliver(serviceName, payload);
 ***REMOVED*****REMOVED***
  this.getWindow().setTimeout(goog.bind(deliveryHandler, this), 1);
***REMOVED***


***REMOVED***
***REMOVED*** Sends a message.
***REMOVED*** @param {string} service The name of the service the message is to be
***REMOVED***   delivered to.
***REMOVED*** @param {string} payload The message content.
***REMOVED*** @override
***REMOVED***
goog.net.xpc.NixTransport.prototype.send = function(service, payload) {
  // Verify that the NIX channel we have is valid.
  if (typeof(this.nixChannel_) !== 'unknown') {
    goog.log.error(goog.net.xpc.logger, 'NIX channel not connected');
  }

  // Send the message via the NIX wrapper object.
  this.nixChannel_['SendMessage'](service, payload);
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.net.xpc.NixTransport.prototype.disposeInternal = function() {
  goog.net.xpc.NixTransport.base(this, 'disposeInternal');
  this.nixChannel_ = null;
***REMOVED***
