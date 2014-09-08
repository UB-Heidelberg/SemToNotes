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
***REMOVED*** @fileoverview Contains application code for the XPC demo.
***REMOVED*** This script is used in both the container page and the iframe.
***REMOVED***
***REMOVED***

***REMOVED***
goog.require('goog.dom');
***REMOVED***
***REMOVED***
goog.require('goog.json');
goog.require('goog.log');
goog.require('goog.net.xpc.CfgFields');
goog.require('goog.net.xpc.CrossPageChannel');



***REMOVED***
***REMOVED*** Namespace for the demo. We don't use goog.provide here because it's not a
***REMOVED*** real module (cannot be required).
***REMOVED***
var xpcdemo = {***REMOVED***


***REMOVED***
***REMOVED*** Global function to kick off initialization in the containing document.
***REMOVED***
goog.global.initOuter = function() {
***REMOVED***window, 'load', function() { xpcdemo.initOuter(); });
***REMOVED***


***REMOVED***
***REMOVED*** Global function to kick off initialization in the iframe.
***REMOVED***
goog.global.initInner = function() {
***REMOVED***window, 'load', function() { xpcdemo.initInner(); });
***REMOVED***


***REMOVED***
***REMOVED*** Initializes XPC in the containing page.
***REMOVED***
xpcdemo.initOuter = function() {
  // Build the configuration object.
  var cfg = {***REMOVED***

  var ownUri = new goog.Uri(window.location.href);
  var relayUri = ownUri.resolve(new goog.Uri('relay.html'));
  var pollUri = ownUri.resolve(new goog.Uri('blank.html'));

  // Determine the peer domain. Uses the value of the URI-parameter
  // 'peerdomain'. If that parameter is not present, it falls back to
  // the own domain so that the demo will work out of the box (but
  // communication will of course not cross domain-boundaries).  For
  // real cross-domain communication, the easiest way is to point two
  // different host-names to the same webserver and then hit the
  // following URI:
  // http://host1.com/path/to/closure/demos/xpc/index.html?peerdomain=host2.com
  var peerDomain = ownUri.getParameterValue('peerdomain') || ownUri.getDomain();

  cfg[goog.net.xpc.CfgFields.LOCAL_RELAY_URI] = relayUri.toString();
  cfg[goog.net.xpc.CfgFields.PEER_RELAY_URI] =
      relayUri.setDomain(peerDomain).toString();

  cfg[goog.net.xpc.CfgFields.LOCAL_POLL_URI] = pollUri.toString();
  cfg[goog.net.xpc.CfgFields.PEER_POLL_URI] =
      pollUri.setDomain(peerDomain).toString();


  // Force transport to be used if tp-parameter is set.
  var tp = ownUri.getParameterValue('tp');
  if (tp) {
    cfg[goog.net.xpc.CfgFields.TRANSPORT] = parseInt(tp, 10);
  }


  // Construct the URI of the peer page.

  var peerUri = ownUri.resolve(
      new goog.Uri('inner.html')).setDomain(peerDomain);
  // Passthrough of verbose and compiled flags.
  if (goog.isDef(ownUri.getParameterValue('verbose'))) {
    peerUri.setParameterValue('verbose', '');
  }
  if (goog.isDef(ownUri.getParameterValue('compiled'))) {
    peerUri.setParameterValue('compiled', '');
  }

  cfg[goog.net.xpc.CfgFields.PEER_URI] = peerUri;

  // Instantiate the channel.
  xpcdemo.channel = new goog.net.xpc.CrossPageChannel(cfg);

  // Create the peer iframe.
  xpcdemo.peerIframe = xpcdemo.channel.createPeerIframe(
      goog.dom.getElement('iframeContainer'));

  xpcdemo.initCommon_();

  goog.dom.getElement('inactive').style.display = 'none';
  goog.dom.getElement('active').style.display = '';
***REMOVED***


***REMOVED***
***REMOVED*** Initialization in the iframe.
***REMOVED***
xpcdemo.initInner = function() {
  // Get the channel configuration passed by the containing document.
  var cfg = goog.json.parse(
      (new goog.Uri(window.location.href)).getParameterValue('xpc'));

  xpcdemo.channel = new goog.net.xpc.CrossPageChannel(cfg);

  xpcdemo.initCommon_();
***REMOVED***


***REMOVED***
***REMOVED*** Initializes the demo.
***REMOVED*** Registers service-handlers and connects the channel.
***REMOVED*** @private
***REMOVED***
xpcdemo.initCommon_ = function() {
  var xpcLogger = goog.log.getLogger('goog.net.xpc');
  goog.log.addHandler(xpcLogger, function(logRecord) {
    xpcdemo.log('[XPC] ' + logRecord.getMessage());
  });
  xpcLogger.setLevel(window.location.href.match(/verbose/) ?
      goog.log.Level.ALL : goog.log.Level.INFO);

  // Register services.
  xpcdemo.channel.registerService('log', xpcdemo.log);
  xpcdemo.channel.registerService('ping', xpcdemo.pingHandler_);
  xpcdemo.channel.registerService('events', xpcdemo.eventsMsgHandler_);

  // Connect the channel.
  xpcdemo.channel.connect(function() {
    xpcdemo.channel.send('log', 'Hi from ' + window.location.host);
  ***REMOVED***goog.dom.getElement('clickfwd'),
                       'click', xpcdemo.mouseEventHandler_);
  });
***REMOVED***


***REMOVED***
***REMOVED*** Kills the peer iframe and the disposes the channel.
***REMOVED***
xpcdemo.teardown = function() {
  goog.events.unlisten(goog.dom.getElement('clickfwd'),
                       goog.events.EventType.CLICK, xpcdemo.mouseEventHandler_);

  xpcdemo.channel.dispose();
  delete xpcdemo.channel;

  goog.dom.removeNode(xpcdemo.peerIframe);
  xpcdemo.peerIframe = null;

  goog.dom.getElement('inactive').style.display = '';
  goog.dom.getElement('active').style.display = 'none';
***REMOVED***


***REMOVED***
***REMOVED*** Logging function. Inserts log-message into element with it id 'console'.
***REMOVED*** @param {string} msgString The log-message.
***REMOVED***
xpcdemo.log = function(msgString) {
  xpcdemo.consoleElm || (xpcdemo.consoleElm = goog.dom.getElement('console'));
  var msgElm = goog.dom.createDom('div');
  msgElm.innerHTML = msgString;
  xpcdemo.consoleElm.insertBefore(msgElm, xpcdemo.consoleElm.firstChild);
***REMOVED***


***REMOVED***
***REMOVED*** Sends a ping request to the peer.
***REMOVED***
xpcdemo.ping = function() {
  // send current time
  xpcdemo.channel.send('ping', goog.now() + '');
***REMOVED***


***REMOVED***
***REMOVED*** The handler function for incoming pings (messages sent to the service
***REMOVED*** called 'ping');
***REMOVED*** @param {string} payload The message payload.
***REMOVED*** @private
***REMOVED***
xpcdemo.pingHandler_ = function(payload) {
  // is the incoming message a response to a ping we sent?
  if (payload.charAt(0) == '#') {
    // calculate roundtrip time and log
    var dt = goog.now() - parseInt(payload.substring(1), 10);
    xpcdemo.log('roundtrip: ' + dt + 'ms');
  } else {
    // incoming message is a ping initiated from peer
    // -> prepend with '#' and send back
    xpcdemo.channel.send('ping', '#' + payload);
    xpcdemo.log('ping reply sent');
  }
***REMOVED***


***REMOVED***
***REMOVED*** Counter for mousemove events.
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
xpcdemo.mmCount_ = 0;


***REMOVED***
***REMOVED*** Holds timestamp when the last mousemove rate has been logged.
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
xpcdemo.mmLastRateOutput_ = 0;


***REMOVED***
***REMOVED*** Start mousemove event forwarding. Registers a listener on the document which
***REMOVED*** sends them over the channel.
***REMOVED***
xpcdemo.startMousemoveForwarding = function() {
***REMOVED***document, goog.events.EventType.MOUSEMOVE,
                     xpcdemo.mouseEventHandler_);
  xpcdemo.mmLastRateOutput_ = goog.now();
***REMOVED***


***REMOVED***
***REMOVED*** Stop mousemove event forwarding.
***REMOVED***
xpcdemo.stopMousemoveForwarding = function() {
  goog.events.unlisten(document, goog.events.EventType.MOUSEMOVE,
                       xpcdemo.mouseEventHandler_);
***REMOVED***


***REMOVED***
***REMOVED*** Function to be used as handler for mouse-events.
***REMOVED*** @param {goog.events.BrowserEvent} e The mouse event.
***REMOVED*** @private
***REMOVED***
xpcdemo.mouseEventHandler_ = function(e) {
  xpcdemo.channel.send('events',
      [e.type, e.clientX, e.clientY, goog.now()].join(','));
***REMOVED***


***REMOVED***
***REMOVED*** Handler for the 'events' service.
***REMOVED*** @param {string} payload The string returned from the xpcdemo.
***REMOVED*** @private
***REMOVED***
xpcdemo.eventsMsgHandler_ = function(payload) {
  var now = goog.now();
  var args = payload.split(',');
  var type = args[0];
  var pageX = args[1];
  var pageY = args[2];
  var time = parseInt(args[3], 10);

  var msg = type + ': (' + pageX + ',' + pageY + '), latency: ' + (now - time);
  xpcdemo.log(msg);

  if (type == goog.events.EventType.MOUSEMOVE) {
    xpcdemo.mmCount_++;
    var dt = now - xpcdemo.mmLastRateOutput_;
    if (dt > 1000) {
      msg = 'RATE (mousemove/s): ' + (1000***REMOVED*** xpcdemo.mmCount_ / dt);
      xpcdemo.log(msg);
      xpcdemo.mmLastRateOutput_ = now;
      xpcdemo.mmCount_ = 0;
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** Send multiple messages.
***REMOVED*** @param {number} n The number of messages to send.
***REMOVED***
xpcdemo.sendN = function(n) {
  xpcdemo.count_ || (xpcdemo.count_ = 1);

  for (var i = 0; i < n; i++) {
    xpcdemo.channel.send('log', '' + xpcdemo.count_++);
  }
***REMOVED***
