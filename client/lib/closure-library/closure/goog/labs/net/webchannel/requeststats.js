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
***REMOVED*** @fileoverview Static utilities for collecting stats associated with
***REMOVED*** ChannelRequest.
***REMOVED***
***REMOVED*** @visibility {:internal}
***REMOVED***


goog.provide('goog.labs.net.webChannel.requestStats');
goog.provide('goog.labs.net.webChannel.requestStats.Event');
goog.provide('goog.labs.net.webChannel.requestStats.ServerReachability');
goog.provide('goog.labs.net.webChannel.requestStats.ServerReachabilityEvent');
goog.provide('goog.labs.net.webChannel.requestStats.Stat');
goog.provide('goog.labs.net.webChannel.requestStats.StatEvent');
goog.provide('goog.labs.net.webChannel.requestStats.TimingEvent');

goog.require('goog.events.Event');
goog.require('goog.events.EventTarget');


goog.scope(function() {
var requestStats = goog.labs.net.webChannel.requestStats;


***REMOVED***
***REMOVED*** Events fired.
***REMOVED*** @type {Object}
***REMOVED***
requestStats.Event = {***REMOVED***


***REMOVED***
***REMOVED*** Singleton event target for firing stat events
***REMOVED*** @type {goog.events.EventTarget}
***REMOVED*** @private
***REMOVED***
requestStats.statEventTarget_ = new goog.events.EventTarget();


***REMOVED***
***REMOVED*** The type of event that occurs every time some information about how reachable
***REMOVED*** the server is is discovered.
***REMOVED***
requestStats.Event.SERVER_REACHABILITY_EVENT = 'serverreachability';


***REMOVED***
***REMOVED*** Types of events which reveal information about the reachability of the
***REMOVED*** server.
***REMOVED*** @enum {number}
***REMOVED***
requestStats.ServerReachability = {
  REQUEST_MADE: 1,
  REQUEST_SUCCEEDED: 2,
  REQUEST_FAILED: 3,
  BACK_CHANNEL_ACTIVITY: 4
***REMOVED***



***REMOVED***
***REMOVED*** Event class for SERVER_REACHABILITY_EVENT.
***REMOVED***
***REMOVED*** @param {goog.events.EventTarget} target The stat event target for
       the channel.
***REMOVED*** @param {requestStats.ServerReachability} reachabilityType
***REMOVED***     The reachability event type.
***REMOVED***
***REMOVED*** @extends {goog.events.Event}
***REMOVED***
requestStats.ServerReachabilityEvent = function(target, reachabilityType) {
  goog.events.Event.call(this,
      requestStats.Event.SERVER_REACHABILITY_EVENT, target);

 ***REMOVED*****REMOVED***
  ***REMOVED*** @type {requestStats.ServerReachability}
 ***REMOVED*****REMOVED***
  this.reachabilityType = reachabilityType;
***REMOVED***
goog.inherits(requestStats.ServerReachabilityEvent, goog.events.Event);


***REMOVED***
***REMOVED*** Notify the channel that a particular fine grained network event has occurred.
***REMOVED*** Should be considered package-private.
***REMOVED*** @param {requestStats.ServerReachability} reachabilityType
***REMOVED***     The reachability event type.
***REMOVED***
requestStats.notifyServerReachabilityEvent = function(reachabilityType) {
  var target = requestStats.statEventTarget_;
  target.dispatchEvent(
      new requestStats.ServerReachabilityEvent(target, reachabilityType));
***REMOVED***


***REMOVED***
***REMOVED*** Stat Event that fires when things of interest happen that may be useful for
***REMOVED*** applications to know about for stats or debugging purposes.
***REMOVED***
requestStats.Event.STAT_EVENT = 'statevent';


***REMOVED***
***REMOVED*** Enum that identifies events for statistics that are interesting to track.
***REMOVED*** @enum {number}
***REMOVED***
requestStats.Stat = {
 ***REMOVED*****REMOVED*** Event indicating a new connection attempt.***REMOVED***
  CONNECT_ATTEMPT: 0,

 ***REMOVED*****REMOVED*** Event indicating a connection error due to a general network problem.***REMOVED***
  ERROR_NETWORK: 1,

 ***REMOVED*****REMOVED***
  ***REMOVED*** Event indicating a connection error that isn't due to a general network
  ***REMOVED*** problem.
 ***REMOVED*****REMOVED***
  ERROR_OTHER: 2,

 ***REMOVED*****REMOVED*** Event indicating the start of test stage one.***REMOVED***
  TEST_STAGE_ONE_START: 3,

 ***REMOVED*****REMOVED*** Event indicating the start of test stage two.***REMOVED***
  TEST_STAGE_TWO_START: 4,

 ***REMOVED*****REMOVED*** Event indicating the first piece of test data was received.***REMOVED***
  TEST_STAGE_TWO_DATA_ONE: 5,

 ***REMOVED*****REMOVED***
  ***REMOVED*** Event indicating that the second piece of test data was received and it was
  ***REMOVED*** recieved separately from the first.
 ***REMOVED*****REMOVED***
  TEST_STAGE_TWO_DATA_TWO: 6,

 ***REMOVED*****REMOVED*** Event indicating both pieces of test data were received simultaneously.***REMOVED***
  TEST_STAGE_TWO_DATA_BOTH: 7,

 ***REMOVED*****REMOVED*** Event indicating stage one of the test request failed.***REMOVED***
  TEST_STAGE_ONE_FAILED: 8,

 ***REMOVED*****REMOVED*** Event indicating stage two of the test request failed.***REMOVED***
  TEST_STAGE_TWO_FAILED: 9,

 ***REMOVED*****REMOVED***
  ***REMOVED*** Event indicating that a buffering proxy is likely between the client and
  ***REMOVED*** the server.
 ***REMOVED*****REMOVED***
  PROXY: 10,

 ***REMOVED*****REMOVED***
  ***REMOVED*** Event indicating that no buffering proxy is likely between the client and
  ***REMOVED*** the server.
 ***REMOVED*****REMOVED***
  NOPROXY: 11,

 ***REMOVED*****REMOVED*** Event indicating an unknown SID error.***REMOVED***
  REQUEST_UNKNOWN_SESSION_ID: 12,

 ***REMOVED*****REMOVED*** Event indicating a bad status code was received.***REMOVED***
  REQUEST_BAD_STATUS: 13,

 ***REMOVED*****REMOVED*** Event indicating incomplete data was received***REMOVED***
  REQUEST_INCOMPLETE_DATA: 14,

 ***REMOVED*****REMOVED*** Event indicating bad data was received***REMOVED***
  REQUEST_BAD_DATA: 15,

 ***REMOVED*****REMOVED*** Event indicating no data was received when data was expected.***REMOVED***
  REQUEST_NO_DATA: 16,

 ***REMOVED*****REMOVED*** Event indicating a request timeout.***REMOVED***
  REQUEST_TIMEOUT: 17,

 ***REMOVED*****REMOVED***
  ***REMOVED*** Event indicating that the server never received our hanging GET and so it
  ***REMOVED*** is being retried.
 ***REMOVED*****REMOVED***
  BACKCHANNEL_MISSING: 18,

 ***REMOVED*****REMOVED***
  ***REMOVED*** Event indicating that we have determined that our hanging GET is not
  ***REMOVED*** receiving data when it should be. Thus it is dead dead and will be retried.
 ***REMOVED*****REMOVED***
  BACKCHANNEL_DEAD: 19,

 ***REMOVED*****REMOVED***
  ***REMOVED*** The browser declared itself offline during the lifetime of a request, or
  ***REMOVED*** was offline when a request was initially made.
 ***REMOVED*****REMOVED***
  BROWSER_OFFLINE: 20,

 ***REMOVED*****REMOVED*** ActiveX is blocked by the machine's admin settings.***REMOVED***
  ACTIVE_X_BLOCKED: 21
***REMOVED***



***REMOVED***
***REMOVED*** Event class for STAT_EVENT.
***REMOVED***
***REMOVED*** @param {goog.events.EventTarget} eventTarget The stat event target for
       the channel.
***REMOVED*** @param {requestStats.Stat} stat The stat.
***REMOVED***
***REMOVED*** @extends {goog.events.Event}
***REMOVED***
requestStats.StatEvent = function(eventTarget, stat) {
  goog.events.Event.call(this, requestStats.Event.STAT_EVENT, eventTarget);

 ***REMOVED*****REMOVED***
  ***REMOVED*** The stat
  ***REMOVED*** @type {requestStats.Stat}
 ***REMOVED*****REMOVED***
  this.stat = stat;

***REMOVED***
goog.inherits(requestStats.StatEvent, goog.events.Event);


***REMOVED***
***REMOVED*** Returns the singleton event target for stat events.
***REMOVED*** @return {goog.events.EventTarget} The event target for stat events.
***REMOVED***
requestStats.getStatEventTarget = function() {
  return requestStats.statEventTarget_;
***REMOVED***


***REMOVED***
***REMOVED*** Helper function to call the stat event callback.
***REMOVED*** @param {requestStats.Stat} stat The stat.
***REMOVED***
requestStats.notifyStatEvent = function(stat) {
  var target = requestStats.statEventTarget_;
  target.dispatchEvent(new requestStats.StatEvent(target, stat));
***REMOVED***


***REMOVED***
***REMOVED*** An event that fires when POST requests complete successfully, indicating
***REMOVED*** the size of the POST and the round trip time.
***REMOVED***
requestStats.Event.TIMING_EVENT = 'timingevent';



***REMOVED***
***REMOVED*** Event class for requestStats.Event.TIMING_EVENT
***REMOVED***
***REMOVED*** @param {goog.events.EventTarget} target The stat event target for
       the channel.
***REMOVED*** @param {number} size The number of characters in the POST data.
***REMOVED*** @param {number} rtt The total round trip time from POST to response in MS.
***REMOVED*** @param {number} retries The number of times the POST had to be retried.
***REMOVED***
***REMOVED*** @extends {goog.events.Event}
***REMOVED***
requestStats.TimingEvent = function(target, size, rtt, retries) {
  goog.events.Event.call(this,
      requestStats.Event.TIMING_EVENT, target);

 ***REMOVED*****REMOVED***
  ***REMOVED*** @type {number}
 ***REMOVED*****REMOVED***
  this.size = size;

 ***REMOVED*****REMOVED***
  ***REMOVED*** @type {number}
 ***REMOVED*****REMOVED***
  this.rtt = rtt;

 ***REMOVED*****REMOVED***
  ***REMOVED*** @type {number}
 ***REMOVED*****REMOVED***
  this.retries = retries;

***REMOVED***
goog.inherits(requestStats.TimingEvent, goog.events.Event);


***REMOVED***
***REMOVED*** Helper function to notify listeners about POST request performance.
***REMOVED***
***REMOVED*** @param {number} size Number of characters in the POST data.
***REMOVED*** @param {number} rtt The amount of time from POST start to response.
***REMOVED*** @param {number} retries The number of times the POST had to be retried.
***REMOVED***
requestStats.notifyTimingEvent = function(size, rtt, retries) {
  var target = requestStats.statEventTarget_;
  target.dispatchEvent(
      new requestStats.TimingEvent(
          target, size, rtt, retries));
***REMOVED***


***REMOVED***
***REMOVED*** Allows the application to set an execution hooks for when a channel
***REMOVED*** starts processing requests. This is useful to track timing or logging
***REMOVED*** special information. The function takes no parameters and return void.
***REMOVED*** @param {Function} startHook  The function for the start hook.
***REMOVED***
requestStats.setStartThreadExecutionHook = function(startHook) {
  requestStats.startExecutionHook_ = startHook;
***REMOVED***


***REMOVED***
***REMOVED*** Allows the application to set an execution hooks for when a channel
***REMOVED*** stops processing requests. This is useful to track timing or logging
***REMOVED*** special information. The function takes no parameters and return void.
***REMOVED*** @param {Function} endHook  The function for the end hook.
***REMOVED***
requestStats.setEndThreadExecutionHook = function(endHook) {
  requestStats.endExecutionHook_ = endHook;
***REMOVED***


***REMOVED***
***REMOVED*** Application provided execution hook for the start hook.
***REMOVED***
***REMOVED*** @type {Function}
***REMOVED*** @private
***REMOVED***
requestStats.startExecutionHook_ = function() {***REMOVED*****REMOVED***


***REMOVED***
***REMOVED*** Application provided execution hook for the end hook.
***REMOVED***
***REMOVED*** @type {Function}
***REMOVED*** @private
***REMOVED***
requestStats.endExecutionHook_ = function() {***REMOVED*****REMOVED***


***REMOVED***
***REMOVED*** Helper function to call the start hook
***REMOVED***
requestStats.onStartExecution = function() {
  requestStats.startExecutionHook_();
***REMOVED***


***REMOVED***
***REMOVED*** Helper function to call the end hook
***REMOVED***
requestStats.onEndExecution = function() {
  requestStats.endExecutionHook_();
***REMOVED***


***REMOVED***
***REMOVED*** Wrapper around SafeTimeout which calls the start and end execution hooks
***REMOVED*** with a try...finally block.
***REMOVED*** @param {Function} fn The callback function.
***REMOVED*** @param {number} ms The time in MS for the timer.
***REMOVED*** @return {number} The ID of the timer.
***REMOVED***
requestStats.setTimeout = function(fn, ms) {
  if (!goog.isFunction(fn)) {
    throw Error('Fn must not be null and must be a function');
  }
  return goog.global.setTimeout(function() {
    requestStats.onStartExecution();
    try {
      fn();
    } finally {
      requestStats.onEndExecution();
    }
  }, ms);
***REMOVED***
});  // goog.scope
