// Copyright 2012 The Closure Library Authors. All Rights Reserved.
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

goog.provide('goog.testing.events.OnlineHandlerTest');
goog.setTestOnly('goog.testing.events.OnlineHandlerTest');

***REMOVED***
goog.require('goog.net.NetworkStatusMonitor');
goog.require('goog.testing.events.EventObserver');
goog.require('goog.testing.events.OnlineHandler');
goog.require('goog.testing.jsunit');

var handler;

var observer;

function tearDown() {
  handler = null;
  observer = null;
}

function testInitialValue() {
  createHandler(true);
  assertEquals(true, handler.isOnline());
  createHandler(false);
  assertEquals(false, handler.isOnline());
}

function testStateChange() {
  createHandler(true);
  assertEventCounts(0 /* expectedOnlineEvents***REMOVED***,
      0 /* expectedOfflineEvents***REMOVED***);

  // Expect no events.
  handler.setOnline(true);
  assertEquals(true, handler.isOnline());
  assertEventCounts(0 /* expectedOnlineEvents***REMOVED***,
      0 /* expectedOfflineEvents***REMOVED***);

  // Expect one offline event.
  handler.setOnline(false);
  assertEquals(false, handler.isOnline());
  assertEventCounts(0 /* expectedOnlineEvents***REMOVED***,
      1 /* expectedOfflineEvents***REMOVED***);

  // Expect no events.
  handler.setOnline(false);
  assertEquals(false, handler.isOnline());
  assertEventCounts(0 /* expectedOnlineEvents***REMOVED***,
      1 /* expectedOfflineEvents***REMOVED***);

  // Expect one online event.
  handler.setOnline(true);
  assertEquals(true, handler.isOnline());
  assertEventCounts(1 /* expectedOnlineEvents***REMOVED***,
      1 /* expectedOfflineEvents***REMOVED***);
}

function createHandler(initialValue) {
  handler = new goog.testing.events.OnlineHandler(initialValue);
  observer = new goog.testing.events.EventObserver();
***REMOVED***handler,
      [goog.net.NetworkStatusMonitor.EventType.ONLINE,
       goog.net.NetworkStatusMonitor.EventType.OFFLINE],
      observer);
}

function assertEventCounts(expectedOnlineEvents, expectedOfflineEvents) {
  assertEquals(expectedOnlineEvents, observer.getEvents(
      goog.net.NetworkStatusMonitor.EventType.ONLINE).length);
  assertEquals(expectedOfflineEvents, observer.getEvents(
      goog.net.NetworkStatusMonitor.EventType.OFFLINE).length);
}
