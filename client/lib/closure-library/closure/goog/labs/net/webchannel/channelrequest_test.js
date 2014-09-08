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
***REMOVED*** @fileoverview Unit tests for goog.labs.net.webChannel.ChannelRequest.
***REMOVED***
***REMOVED***


goog.provide('goog.labs.net.webChannel.channelRequestTest');

***REMOVED***
goog.require('goog.functions');
goog.require('goog.labs.net.webChannel.ChannelRequest');
goog.require('goog.labs.net.webChannel.WebChannelDebug');
goog.require('goog.labs.net.webChannel.requestStats');
goog.require('goog.labs.net.webChannel.requestStats.ServerReachability');
goog.require('goog.testing.MockClock');
goog.require('goog.testing.PropertyReplacer');
goog.require('goog.testing.jsunit');
goog.require('goog.testing.net.XhrIo');
goog.require('goog.testing.recordFunction');

goog.setTestOnly('goog.labs.net.webChannel.channelRequestTest');


var channelRequest;
var mockChannel;
var mockClock;
var stubs;
var xhrIo;
var reachabilityEvents;


***REMOVED***
***REMOVED*** Time to wait for a network request to time out, before aborting.
***REMOVED***
var WATCHDOG_TIME = 2000;


***REMOVED***
***REMOVED*** Time to throttle readystatechange events.
***REMOVED***
var THROTTLE_TIME = 500;


***REMOVED***
***REMOVED*** A really long time - used to make sure no more timeouts will fire.
***REMOVED***
var ALL_DAY_MS = 1000***REMOVED*** 60***REMOVED*** 60***REMOVED*** 24;


function setUp() {
  mockClock = new goog.testing.MockClock();
  mockClock.install();
  reachabilityEvents = {***REMOVED***
  stubs = new goog.testing.PropertyReplacer();

  // Mock out the stat notification code.
  var notifyServerReachabilityEvent = function(reachabilityType) {
    if (!reachabilityEvents[reachabilityType]) {
      reachabilityEvents[reachabilityType] = 0;
    }
    reachabilityEvents[reachabilityType]++;
 ***REMOVED*****REMOVED***
  stubs.set(goog.labs.net.webChannel.requestStats,
      'notifyServerReachabilityEvent', notifyServerReachabilityEvent);
}


function tearDown() {
  stubs.reset();
  mockClock.uninstall();
}



***REMOVED***
***REMOVED*** Constructs a duck-type WebChannelBase that tracks the completed requests.
***REMOVED***
***REMOVED*** @struct
***REMOVED*** @final
***REMOVED***
function MockWebChannelBase() {
  this.isClosed = function() {
    return false;
 ***REMOVED*****REMOVED***
  this.isActive = function() {
    return true;
 ***REMOVED*****REMOVED***
  this.shouldUseSecondaryDomains = function() {
    return false;
 ***REMOVED*****REMOVED***
  this.completedRequests = [];
  this.onRequestComplete = function(request) {
    this.completedRequests.push(request);
 ***REMOVED*****REMOVED***
  this.onRequestData = function(request, data) {***REMOVED***
}


***REMOVED***
***REMOVED*** Creates a real ChannelRequest object, with some modifications for
***REMOVED*** testability:
***REMOVED*** <ul>
***REMOVED*** <li>The channel is a mock channel.
***REMOVED*** <li>The new watchdogTimeoutCallCount property tracks onWatchDogTimeout_()
***REMOVED***     calls.
***REMOVED*** <li>The timeout is set to WATCHDOG_TIME.
***REMOVED*** </ul>
***REMOVED***
function createChannelRequest() {
  xhrIo = new goog.testing.net.XhrIo();
  xhrIo.abort = xhrIo.abort || function() {
    this.active_ = false;
 ***REMOVED*****REMOVED***

  // Install mock channel and no-op debug logger.
  mockChannel = new MockWebChannelBase();
  channelRequest = new goog.labs.net.webChannel.ChannelRequest(
      mockChannel,
      new goog.labs.net.webChannel.WebChannelDebug());

  // Install test XhrIo.
  mockChannel.createXhrIo = function() {
    return xhrIo;
 ***REMOVED*****REMOVED***

  // Install watchdogTimeoutCallCount.
  channelRequest.watchdogTimeoutCallCount = 0;
  channelRequest.originalOnWatchDogTimeout = channelRequest.onWatchDogTimeout_;
  channelRequest.onWatchDogTimeout_ = function() {
    channelRequest.watchdogTimeoutCallCount++;
    return channelRequest.originalOnWatchDogTimeout();
 ***REMOVED*****REMOVED***

  channelRequest.setTimeout(WATCHDOG_TIME);
}


***REMOVED***
***REMOVED*** Run through the lifecycle of a long lived request, checking that the right
***REMOVED*** network events are reported.
***REMOVED***
function testNetworkEvents() {
  createChannelRequest();

  channelRequest.xmlHttpPost(new goog.Uri('some_uri'), 'some_postdata', true);
  checkReachabilityEvents(1, 0, 0, 0);
  if (goog.labs.net.webChannel.ChannelRequest.supportsXhrStreaming()) {
    xhrIo.simulatePartialResponse('17\nI am a BC Message');
    checkReachabilityEvents(1, 0, 0, 1);
    xhrIo.simulatePartialResponse('23\nI am another BC Message');
    checkReachabilityEvents(1, 0, 0, 2);
    xhrIo.simulateResponse(200, '16\Final BC Message');
    checkReachabilityEvents(1, 1, 0, 2);
  } else {
    xhrIo.simulateResponse(200, '16\Final BC Message');
    checkReachabilityEvents(1, 1, 0, 0);
  }
}


***REMOVED***
***REMOVED*** Test throttling of readystatechange events.
***REMOVED***
function testNetworkEvents_throttleReadyStateChange() {
  createChannelRequest();
  channelRequest.setReadyStateChangeThrottle(THROTTLE_TIME);

  var recordedHandler =
      goog.testing.recordFunction(channelRequest.xmlHttpHandler_);
  stubs.set(channelRequest, 'xmlHttpHandler_', recordedHandler);

  channelRequest.xmlHttpPost(new goog.Uri('some_uri'), 'some_postdata', true);
  assertEquals(1, recordedHandler.getCallCount());

  checkReachabilityEvents(1, 0, 0, 0);
  if (goog.labs.net.webChannel.ChannelRequest.supportsXhrStreaming()) {
    xhrIo.simulatePartialResponse('17\nI am a BC Message');
    checkReachabilityEvents(1, 0, 0, 1);
    assertEquals(3, recordedHandler.getCallCount());

    // Second event should be throttled
    xhrIo.simulatePartialResponse('23\nI am another BC Message');
    assertEquals(3, recordedHandler.getCallCount());

    xhrIo.simulatePartialResponse('27\nI am yet another BC Message');
    assertEquals(3, recordedHandler.getCallCount());
    mockClock.tick(THROTTLE_TIME);

    checkReachabilityEvents(1, 0, 0, 3);
    // Only one more call because of throttling.
    assertEquals(4, recordedHandler.getCallCount());

    xhrIo.simulateResponse(200, '16\Final BC Message');
    checkReachabilityEvents(1, 1, 0, 3);
    assertEquals(5, recordedHandler.getCallCount());
  } else {
    xhrIo.simulateResponse(200, '16\Final BC Message');
    checkReachabilityEvents(1, 1, 0, 0);
  }
}


***REMOVED***
***REMOVED*** Make sure that the request "completes" with an error when the timeout
***REMOVED*** expires.
***REMOVED***
function testRequestTimeout() {
  createChannelRequest();

  channelRequest.xmlHttpPost(new goog.Uri('some_uri'), 'some_postdata', true);
  assertEquals(0, channelRequest.watchdogTimeoutCallCount);
  assertEquals(0, channelRequest.channel_.completedRequests.length);

  // Watchdog timeout.
  mockClock.tick(WATCHDOG_TIME);
  assertEquals(1, channelRequest.watchdogTimeoutCallCount);
  assertEquals(1, channelRequest.channel_.completedRequests.length);
  assertFalse(channelRequest.getSuccess());

  // Make sure no more timers are firing.
  mockClock.tick(ALL_DAY_MS);
  assertEquals(1, channelRequest.watchdogTimeoutCallCount);
  assertEquals(1, channelRequest.channel_.completedRequests.length);

  checkReachabilityEvents(1, 0, 1, 0);
}


function testRequestTimeoutWithUnexpectedException() {
  createChannelRequest();
  channelRequest.channel_.createXhrIo = goog.functions.error('Weird error');

  try {
    channelRequest.xmlHttpGet(new goog.Uri('some_uri'), true, null);
    fail('Expected error');
  } catch (e) {
    assertEquals('Weird error', e.message);
  }

  assertEquals(0, channelRequest.watchdogTimeoutCallCount);
  assertEquals(0, channelRequest.channel_.completedRequests.length);

  // Watchdog timeout.
  mockClock.tick(WATCHDOG_TIME);
  assertEquals(1, channelRequest.watchdogTimeoutCallCount);
  assertEquals(1, channelRequest.channel_.completedRequests.length);
  assertFalse(channelRequest.getSuccess());

  // Make sure no more timers are firing.
  mockClock.tick(ALL_DAY_MS);
  assertEquals(1, channelRequest.watchdogTimeoutCallCount);
  assertEquals(1, channelRequest.channel_.completedRequests.length);

  checkReachabilityEvents(0, 0, 1, 0);
}


function testActiveXBlocked() {
  createChannelRequest();
  stubs.set(goog.global, 'ActiveXObject',
      goog.functions.error('Active X blocked'));

  channelRequest.tridentGet(new goog.Uri('some_uri'), false);
  assertFalse(channelRequest.getSuccess());
  assertEquals(
      goog.labs.net.webChannel.ChannelRequest.Error.ACTIVE_X_BLOCKED,
      channelRequest.getLastError());

  checkReachabilityEvents(0, 0, 0, 0);
}


function checkReachabilityEvents(reqMade, reqSucceeded, reqFail, backChannel) {
  var Reachability =
      goog.labs.net.webChannel.requestStats.ServerReachability;
  assertEquals(reqMade,
      reachabilityEvents[Reachability.REQUEST_MADE] || 0);
  assertEquals(reqSucceeded,
      reachabilityEvents[Reachability.REQUEST_SUCCEEDED] || 0);
  assertEquals(reqFail,
      reachabilityEvents[Reachability.REQUEST_FAILED] || 0);
  assertEquals(backChannel,
      reachabilityEvents[Reachability.BACK_CHANNEL_ACTIVITY] || 0);
}


function testDuplicatedRandomParams() {
  createChannelRequest();
  channelRequest.xmlHttpGet(new goog.Uri('some_uri'), true, null, true,
      true /* opt_duplicateRandom***REMOVED***);
  var z = xhrIo.getLastUri().getParameterValue('zx');
  var z1 = xhrIo.getLastUri().getParameterValue('zx1');
  assertTrue(goog.isDefAndNotNull(z));
  assertTrue(goog.isDefAndNotNull(z1));
  assertEquals(z1, z);
}
