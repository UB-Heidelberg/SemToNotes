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
***REMOVED*** @fileoverview Unit tests for goog.labs.net.webChannel.WebChannelBase.
***REMOVED*** @suppress {accessControls} Private methods are accessed for test purposes.
***REMOVED***
***REMOVED***


goog.provide('goog.labs.net.webChannel.webChannelBaseTransportTest');

***REMOVED***
goog.require('goog.labs.net.webChannel.WebChannelBaseTransport');
goog.require('goog.net.WebChannel');
goog.require('goog.testing.jsunit');

goog.setTestOnly('goog.labs.net.webChannel.webChannelBaseTransportTest');


var webChannel;
var channelUrl = 'http://127.0.0.1:8080/channel';


function setUp() {
}

function tearDown() {
  goog.dispose(webChannel);
}

function testOpenWithUrl() {
  var webChannelTransport =
      new goog.labs.net.webChannel.WebChannelBaseTransport();
  webChannel = webChannelTransport.createWebChannel(channelUrl);

  var eventFired = false;
***REMOVED***webChannel, goog.net.WebChannel.EventType.OPEN,
      function(e) {
        eventFired = true;
      });

  webChannel.open();
  assertFalse(eventFired);

  var channel = webChannel.channel_;
  assertNotNull(channel);

  simulateOpenEvent(channel);
  assertTrue(eventFired);
}

function testOpenWithTestUrl() {
  var webChannelTransport =
      new goog.labs.net.webChannel.WebChannelBaseTransport();
  var options = {'testUrl': channelUrl + '/footest'***REMOVED***
  webChannel = webChannelTransport.createWebChannel(channelUrl, options);
  webChannel.open();

  var testPath = webChannel.channel_.connectionTest_.path_;
  assertNotNullNorUndefined(testPath);
}

function testOpenWithCustomHeaders() {
  var webChannelTransport =
      new goog.labs.net.webChannel.WebChannelBaseTransport();
  var options = {'messageHeaders': {'foo-key': 'foo-value'}***REMOVED***
  webChannel = webChannelTransport.createWebChannel(channelUrl, options);
  webChannel.open();

  var extraHeaders_ = webChannel.channel_.extraHeaders_;
  assertNotNullNorUndefined(extraHeaders_);
}

function testOpenWithCustomParams() {
  var webChannelTransport =
      new goog.labs.net.webChannel.WebChannelBaseTransport();
  var options = {'messageUrlParams': {'foo-key': 'foo-value'}***REMOVED***
  webChannel = webChannelTransport.createWebChannel(channelUrl, options);
  webChannel.open();

  var extraParams = webChannel.channel_.extraParams_;
  assertNotNullNorUndefined(extraParams);
}

function testOpenWithCorsEnabled() {
  var webChannelTransport =
      new goog.labs.net.webChannel.WebChannelBaseTransport();
  var options = {'supportsCrossDomainXhr': true***REMOVED***
  webChannel = webChannelTransport.createWebChannel(channelUrl, options);
  webChannel.open();

  assertTrue(webChannel.channel_.supportsCrossDomainXhrs_);
}

function testOpenThenCloseChannel() {
  var webChannelTransport =
      new goog.labs.net.webChannel.WebChannelBaseTransport();
  webChannel = webChannelTransport.createWebChannel(channelUrl);

  var eventFired = false;
***REMOVED***webChannel, goog.net.WebChannel.EventType.CLOSE,
      function(e) {
        eventFired = true;
      });

  webChannel.open();
  assertFalse(eventFired);

  var channel = webChannel.channel_;
  assertNotNull(channel);

  simulateCloseEvent(channel);
  assertTrue(eventFired);
}


function testChannelError() {
  var webChannelTransport =
      new goog.labs.net.webChannel.WebChannelBaseTransport();
  webChannel = webChannelTransport.createWebChannel(channelUrl);

  var eventFired = false;
***REMOVED***webChannel, goog.net.WebChannel.EventType.ERROR,
      function(e) {
        eventFired = true;
        assertEquals(goog.net.WebChannel.ErrorStatus.NETWORK_ERROR, e.status);
      });

  webChannel.open();
  assertFalse(eventFired);

  var channel = webChannel.channel_;
  assertNotNull(channel);

  simulateErrorEvent(channel);
  assertTrue(eventFired);
}


function testChannelMessage() {
  var webChannelTransport =
      new goog.labs.net.webChannel.WebChannelBaseTransport();
  webChannel = webChannelTransport.createWebChannel(channelUrl);

  var eventFired = false;
  var data = 'foo';
***REMOVED***webChannel, goog.net.WebChannel.EventType.MESSAGE,
      function(e) {
        eventFired = true;
        assertEquals(e.data, data);
      });

  webChannel.open();
  assertFalse(eventFired);

  var channel = webChannel.channel_;
  assertNotNull(channel);

  simulateMessageEvent(channel, data);
  assertTrue(eventFired);
}


***REMOVED***
***REMOVED*** Simulates the WebChannelBase firing the open event for the given channel.
***REMOVED*** @param {!goog.labs.net.webChannel.WebChannelBase} channel The WebChannelBase.
***REMOVED***
function simulateOpenEvent(channel) {
  assertNotNull(channel.getHandler());
  channel.getHandler().channelOpened();
}


***REMOVED***
***REMOVED*** Simulates the WebChannelBase firing the close event for the given channel.
***REMOVED*** @param {!goog.labs.net.webChannel.WebChannelBase} channel The WebChannelBase.
***REMOVED***
function simulateCloseEvent(channel) {
  assertNotNull(channel.getHandler());
  channel.getHandler().channelClosed();
}


***REMOVED***
***REMOVED*** Simulates the WebChannelBase firing the error event for the given channel.
***REMOVED*** @param {!goog.labs.net.webChannel.WebChannelBase} channel The WebChannelBase.
***REMOVED***
function simulateErrorEvent(channel) {
  assertNotNull(channel.getHandler());
  channel.getHandler().channelError();
}


***REMOVED***
***REMOVED*** Simulates the WebChannelBase firing the message event for the given channel.
***REMOVED*** @param {!goog.labs.net.webChannel.WebChannelBase} channel The WebChannelBase.
***REMOVED*** @param {String} data The message data.
***REMOVED***
function simulateMessageEvent(channel, data) {
  assertNotNull(channel.getHandler());
  channel.getHandler().channelHandleArray(channel, data);
}
