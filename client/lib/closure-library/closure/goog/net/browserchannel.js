// Copyright 2006 The Closure Library Authors. All Rights Reserved.
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
***REMOVED*** @fileoverview Definition of the BrowserChannel class.  A BrowserChannel
***REMOVED*** simulates a bidirectional socket over HTTP. It is the basis of the
***REMOVED*** Gmail Chat IM connections to the server.
***REMOVED***
***REMOVED*** Typical usage will look like
***REMOVED***  var handler = [handler object];
***REMOVED***  var channel = new BrowserChannel(clientVersion);
***REMOVED***  channel.setHandler(handler);
***REMOVED***  channel.connect('channel/test', 'channel/bind');
***REMOVED***
***REMOVED*** See goog.net.BrowserChannel.Handler for the handler interface.
***REMOVED***
***REMOVED***


goog.provide('goog.net.BrowserChannel');
goog.provide('goog.net.BrowserChannel.Error');
goog.provide('goog.net.BrowserChannel.Event');
goog.provide('goog.net.BrowserChannel.Handler');
goog.provide('goog.net.BrowserChannel.LogSaver');
goog.provide('goog.net.BrowserChannel.QueuedMap');
goog.provide('goog.net.BrowserChannel.ServerReachability');
goog.provide('goog.net.BrowserChannel.ServerReachabilityEvent');
goog.provide('goog.net.BrowserChannel.Stat');
goog.provide('goog.net.BrowserChannel.StatEvent');
goog.provide('goog.net.BrowserChannel.State');
goog.provide('goog.net.BrowserChannel.TimingEvent');

***REMOVED***
goog.require('goog.array');
goog.require('goog.asserts');
goog.require('goog.debug.TextFormatter');
goog.require('goog.events.Event');
goog.require('goog.events.EventTarget');
goog.require('goog.json');
goog.require('goog.json.EvalJsonProcessor');
goog.require('goog.log');
goog.require('goog.net.BrowserTestChannel');
goog.require('goog.net.ChannelDebug');
goog.require('goog.net.ChannelRequest');
***REMOVED***
goog.require('goog.net.tmpnetwork');
goog.require('goog.object');
goog.require('goog.string');
goog.require('goog.structs');
goog.require('goog.structs.CircularBuffer');



***REMOVED***
***REMOVED*** Encapsulates the logic for a single BrowserChannel.
***REMOVED***
***REMOVED*** @param {string=} opt_clientVersion An application-specific version number
***REMOVED***        that is sent to the server when connected.
***REMOVED*** @param {Array.<string>=} opt_firstTestResults Previously determined results
***REMOVED***        of the first browser channel test.
***REMOVED*** @param {boolean=} opt_secondTestResults Previously determined results
***REMOVED***        of the second browser channel test.
***REMOVED***
***REMOVED***
goog.net.BrowserChannel = function(opt_clientVersion, opt_firstTestResults,
    opt_secondTestResults) {
 ***REMOVED*****REMOVED***
  ***REMOVED*** The application specific version that is passed to the server.
  ***REMOVED*** @type {?string}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.clientVersion_ = opt_clientVersion || null;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The current state of the BrowserChannel. It should be one of the
  ***REMOVED*** goog.net.BrowserChannel.State constants.
  ***REMOVED*** @type {!goog.net.BrowserChannel.State}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.state_ = goog.net.BrowserChannel.State.INIT;

 ***REMOVED*****REMOVED***
  ***REMOVED*** An array of queued maps that need to be sent to the server.
  ***REMOVED*** @type {Array.<goog.net.BrowserChannel.QueuedMap>}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.outgoingMaps_ = [];

 ***REMOVED*****REMOVED***
  ***REMOVED*** An array of dequeued maps that we have either received a non-successful
  ***REMOVED*** response for, or no response at all, and which therefore may or may not
  ***REMOVED*** have been received by the server.
  ***REMOVED*** @type {Array.<goog.net.BrowserChannel.QueuedMap>}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.pendingMaps_ = [];

 ***REMOVED*****REMOVED***
  ***REMOVED*** The channel debug used for browserchannel logging
  ***REMOVED*** @type {!goog.net.ChannelDebug}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.channelDebug_ = new goog.net.ChannelDebug();

 ***REMOVED*****REMOVED***
  ***REMOVED*** Parser for a response payload. Defaults to use
  ***REMOVED*** {@code goog.json.unsafeParse}. The parser should return an array.
  ***REMOVED*** @type {!goog.string.Parser}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.parser_ = new goog.json.EvalJsonProcessor(null, true);

 ***REMOVED*****REMOVED***
  ***REMOVED*** An array of results for the first browser channel test call.
  ***REMOVED*** @type {Array.<string>}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.firstTestResults_ = opt_firstTestResults || null;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The results of the second browser channel test. True implies the
  ***REMOVED*** connection is buffered, False means unbuffered, null means that
  ***REMOVED*** the results are not available.
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.secondTestResults_ = goog.isDefAndNotNull(opt_secondTestResults) ?
      opt_secondTestResults : null;
***REMOVED***



***REMOVED***
***REMOVED*** Simple container class for a (mapId, map) pair.
***REMOVED*** @param {number} mapId The id for this map.
***REMOVED*** @param {Object|goog.structs.Map} map The map itself.
***REMOVED*** @param {Object=} opt_context The context associated with the map.
***REMOVED***
***REMOVED*** @final
***REMOVED***
goog.net.BrowserChannel.QueuedMap = function(mapId, map, opt_context) {
 ***REMOVED*****REMOVED***
  ***REMOVED*** The id for this map.
  ***REMOVED*** @type {number}
 ***REMOVED*****REMOVED***
  this.mapId = mapId;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The map itself.
  ***REMOVED*** @type {Object|goog.structs.Map}
 ***REMOVED*****REMOVED***
  this.map = map;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The context for the map.
  ***REMOVED*** @type {Object}
 ***REMOVED*****REMOVED***
  this.context = opt_context || null;
***REMOVED***


***REMOVED***
***REMOVED*** Extra HTTP headers to add to all the requests sent to the server.
***REMOVED*** @type {Object}
***REMOVED*** @private
***REMOVED***
goog.net.BrowserChannel.prototype.extraHeaders_ = null;


***REMOVED***
***REMOVED*** Extra parameters to add to all the requests sent to the server.
***REMOVED*** @type {Object}
***REMOVED*** @private
***REMOVED***
goog.net.BrowserChannel.prototype.extraParams_ = null;


***REMOVED***
***REMOVED*** The current ChannelRequest object for the forwardchannel.
***REMOVED*** @type {goog.net.ChannelRequest?}
***REMOVED*** @private
***REMOVED***
goog.net.BrowserChannel.prototype.forwardChannelRequest_ = null;


***REMOVED***
***REMOVED*** The ChannelRequest object for the backchannel.
***REMOVED*** @type {goog.net.ChannelRequest?}
***REMOVED*** @private
***REMOVED***
goog.net.BrowserChannel.prototype.backChannelRequest_ = null;


***REMOVED***
***REMOVED*** The relative path (in the context of the the page hosting the browser
***REMOVED*** channel) for making requests to the server.
***REMOVED*** @type {?string}
***REMOVED*** @private
***REMOVED***
goog.net.BrowserChannel.prototype.path_ = null;


***REMOVED***
***REMOVED*** The absolute URI for the forwardchannel request.
***REMOVED*** @type {goog.Uri}
***REMOVED*** @private
***REMOVED***
goog.net.BrowserChannel.prototype.forwardChannelUri_ = null;


***REMOVED***
***REMOVED*** The absolute URI for the backchannel request.
***REMOVED*** @type {goog.Uri}
***REMOVED*** @private
***REMOVED***
goog.net.BrowserChannel.prototype.backChannelUri_ = null;


***REMOVED***
***REMOVED*** A subdomain prefix for using a subdomain in IE for the backchannel
***REMOVED*** requests.
***REMOVED*** @type {?string}
***REMOVED*** @private
***REMOVED***
goog.net.BrowserChannel.prototype.hostPrefix_ = null;


***REMOVED***
***REMOVED*** Whether we allow the use of a subdomain in IE for the backchannel requests.
***REMOVED*** @private
***REMOVED***
goog.net.BrowserChannel.prototype.allowHostPrefix_ = true;


***REMOVED***
***REMOVED*** The next id to use for the RID (request identifier) parameter. This
***REMOVED*** identifier uniquely identifies the forward channel request.
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.net.BrowserChannel.prototype.nextRid_ = 0;


***REMOVED***
***REMOVED*** The id to use for the next outgoing map. This identifier uniquely
***REMOVED*** identifies a sent map.
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.net.BrowserChannel.prototype.nextMapId_ = 0;


***REMOVED***
***REMOVED*** Whether to fail forward-channel requests after one try, or after a few tries.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.net.BrowserChannel.prototype.failFast_ = false;


***REMOVED***
***REMOVED*** The handler that receive callbacks for state changes and data.
***REMOVED*** @type {goog.net.BrowserChannel.Handler}
***REMOVED*** @private
***REMOVED***
goog.net.BrowserChannel.prototype.handler_ = null;


***REMOVED***
***REMOVED*** Timer identifier for asynchronously making a forward channel request.
***REMOVED*** @type {?number}
***REMOVED*** @private
***REMOVED***
goog.net.BrowserChannel.prototype.forwardChannelTimerId_ = null;


***REMOVED***
***REMOVED*** Timer identifier for asynchronously making a back channel request.
***REMOVED*** @type {?number}
***REMOVED*** @private
***REMOVED***
goog.net.BrowserChannel.prototype.backChannelTimerId_ = null;


***REMOVED***
***REMOVED*** Timer identifier for the timer that waits for us to retry the backchannel in
***REMOVED*** the case where it is dead and no longer receiving data.
***REMOVED*** @type {?number}
***REMOVED*** @private
***REMOVED***
goog.net.BrowserChannel.prototype.deadBackChannelTimerId_ = null;


***REMOVED***
***REMOVED*** The BrowserTestChannel object which encapsulates the logic for determining
***REMOVED*** interesting network conditions about the client.
***REMOVED*** @type {goog.net.BrowserTestChannel?}
***REMOVED*** @private
***REMOVED***
goog.net.BrowserChannel.prototype.connectionTest_ = null;


***REMOVED***
***REMOVED*** Whether the client's network conditions can support chunked responses.
***REMOVED*** @type {?boolean}
***REMOVED*** @private
***REMOVED***
goog.net.BrowserChannel.prototype.useChunked_ = null;


***REMOVED***
***REMOVED*** Whether chunked mode is allowed. In certain debugging situations, it's
***REMOVED*** useful to disable this.
***REMOVED*** @private
***REMOVED***
goog.net.BrowserChannel.prototype.allowChunkedMode_ = true;


***REMOVED***
***REMOVED*** The array identifier of the last array received from the server for the
***REMOVED*** backchannel request.
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.net.BrowserChannel.prototype.lastArrayId_ = -1;


***REMOVED***
***REMOVED*** The array identifier of the last array sent by the server that we know about.
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.net.BrowserChannel.prototype.lastPostResponseArrayId_ = -1;


***REMOVED***
***REMOVED*** The last status code received.
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.net.BrowserChannel.prototype.lastStatusCode_ = -1;


***REMOVED***
***REMOVED*** Number of times we have retried the current forward channel request.
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.net.BrowserChannel.prototype.forwardChannelRetryCount_ = 0;


***REMOVED***
***REMOVED*** Number of times it a row that we have retried the current back channel
***REMOVED*** request and received no data.
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.net.BrowserChannel.prototype.backChannelRetryCount_ = 0;


***REMOVED***
***REMOVED*** The attempt id for the current back channel request. Starts at 1 and
***REMOVED*** increments for each reconnect. The server uses this to log if our connection
***REMOVED*** is flaky or not.
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.net.BrowserChannel.prototype.backChannelAttemptId_;


***REMOVED***
***REMOVED*** The base part of the time before firing next retry request. Default is 5
***REMOVED*** seconds. Note that a random delay is added (see {@link retryDelaySeedMs_})
***REMOVED*** for all retries, and linear backoff is applied to the sum for subsequent
***REMOVED*** retries.
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.net.BrowserChannel.prototype.baseRetryDelayMs_ = 5***REMOVED*** 1000;


***REMOVED***
***REMOVED*** A random time between 0 and this number of MS is added to the
***REMOVED*** {@link baseRetryDelayMs_}. Default is 10 seconds.
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.net.BrowserChannel.prototype.retryDelaySeedMs_ = 10***REMOVED*** 1000;


***REMOVED***
***REMOVED*** Maximum number of attempts to connect to the server for forward channel
***REMOVED*** requests. Defaults to 2.
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.net.BrowserChannel.prototype.forwardChannelMaxRetries_ = 2;


***REMOVED***
***REMOVED*** The timeout in milliseconds for a forward channel request. Defaults to 20
***REMOVED*** seconds. Note that part of this timeout can be randomized.
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.net.BrowserChannel.prototype.forwardChannelRequestTimeoutMs_ = 20***REMOVED*** 1000;


***REMOVED***
***REMOVED*** A throttle time in ms for readystatechange events for the backchannel.
***REMOVED*** Useful for throttling when ready state is INTERACTIVE (partial data).
***REMOVED***
***REMOVED*** This throttle is useful if the server sends large data chunks down the
***REMOVED*** backchannel.  It prevents examining XHR partial data on every
***REMOVED*** readystate change event.  This is useful because large chunks can
***REMOVED*** trigger hundreds of readystatechange events, each of which takes ~5ms
***REMOVED*** or so to handle, in turn making the UI unresponsive for a significant period.
***REMOVED***
***REMOVED*** If set to zero no throttle is used.
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.net.BrowserChannel.prototype.readyStateChangeThrottleMs_ = 0;


***REMOVED***
***REMOVED*** Whether cross origin requests are supported for the browser channel.
***REMOVED***
***REMOVED*** See {@link goog.net.XhrIo#setWithCredentials}.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.net.BrowserChannel.prototype.supportsCrossDomainXhrs_ = false;


***REMOVED***
***REMOVED*** The latest protocol version that this class supports. We request this version
***REMOVED*** from the server when opening the connection. Should match
***REMOVED*** com.google.net.browserchannel.BrowserChannel.LATEST_CHANNEL_VERSION.
***REMOVED*** @type {number}
***REMOVED***
goog.net.BrowserChannel.LATEST_CHANNEL_VERSION = 8;


***REMOVED***
***REMOVED*** The channel version that we negotiated with the server for this session.
***REMOVED*** Starts out as the version we request, and then is changed to the negotiated
***REMOVED*** version after the initial open.
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.net.BrowserChannel.prototype.channelVersion_ =
    goog.net.BrowserChannel.LATEST_CHANNEL_VERSION;


***REMOVED***
***REMOVED*** Enum type for the browser channel state machine.
***REMOVED*** @enum {number}
***REMOVED***
goog.net.BrowserChannel.State = {
 ***REMOVED*****REMOVED*** The channel is closed.***REMOVED***
  CLOSED: 0,

 ***REMOVED*****REMOVED*** The channel has been initialized but hasn't yet initiated a connection.***REMOVED***
  INIT: 1,

 ***REMOVED*****REMOVED*** The channel is in the process of opening a connection to the server.***REMOVED***
  OPENING: 2,

 ***REMOVED*****REMOVED*** The channel is open.***REMOVED***
  OPENED: 3
***REMOVED***


***REMOVED***
***REMOVED*** The timeout in milliseconds for a forward channel request.
***REMOVED*** @type {number}
***REMOVED***
goog.net.BrowserChannel.FORWARD_CHANNEL_RETRY_TIMEOUT = 20***REMOVED*** 1000;


***REMOVED***
***REMOVED*** Maximum number of attempts to connect to the server for back channel
***REMOVED*** requests.
***REMOVED*** @type {number}
***REMOVED***
goog.net.BrowserChannel.BACK_CHANNEL_MAX_RETRIES = 3;


***REMOVED***
***REMOVED*** A number in MS of how long we guess the maxmium amount of time a round trip
***REMOVED*** to the server should take. In the future this could be substituted with a
***REMOVED*** real measurement of the RTT.
***REMOVED*** @type {number}
***REMOVED***
goog.net.BrowserChannel.RTT_ESTIMATE = 3***REMOVED*** 1000;


***REMOVED***
***REMOVED*** When retrying for an inactive channel, we will multiply the total delay by
***REMOVED*** this number.
***REMOVED*** @type {number}
***REMOVED***
goog.net.BrowserChannel.INACTIVE_CHANNEL_RETRY_FACTOR = 2;


***REMOVED***
***REMOVED*** Enum type for identifying a BrowserChannel error.
***REMOVED*** @enum {number}
***REMOVED***
goog.net.BrowserChannel.Error = {
 ***REMOVED*****REMOVED*** Value that indicates no error has occurred.***REMOVED***
  OK: 0,

 ***REMOVED*****REMOVED*** An error due to a request failing.***REMOVED***
  REQUEST_FAILED: 2,

 ***REMOVED*****REMOVED*** An error due to the user being logged out.***REMOVED***
  LOGGED_OUT: 4,

 ***REMOVED*****REMOVED*** An error due to server response which contains no data.***REMOVED***
  NO_DATA: 5,

 ***REMOVED*****REMOVED*** An error due to a server response indicating an unknown session id***REMOVED***
  UNKNOWN_SESSION_ID: 6,

 ***REMOVED*****REMOVED*** An error due to a server response requesting to stop the channel.***REMOVED***
  STOP: 7,

 ***REMOVED*****REMOVED*** A general network error.***REMOVED***
  NETWORK: 8,

 ***REMOVED*****REMOVED*** An error due to the channel being blocked by a network administrator.***REMOVED***
  BLOCKED: 9,

 ***REMOVED*****REMOVED*** An error due to bad data being returned from the server.***REMOVED***
  BAD_DATA: 10,

 ***REMOVED*****REMOVED*** An error due to a response that doesn't start with the magic cookie.***REMOVED***
  BAD_RESPONSE: 11,

 ***REMOVED*****REMOVED*** ActiveX is blocked by the machine's admin settings.***REMOVED***
  ACTIVE_X_BLOCKED: 12
***REMOVED***


***REMOVED***
***REMOVED*** Internal enum type for the two browser channel channel types.
***REMOVED*** @enum {number}
***REMOVED*** @private
***REMOVED***
goog.net.BrowserChannel.ChannelType_ = {
  FORWARD_CHANNEL: 1,

  BACK_CHANNEL: 2
***REMOVED***


***REMOVED***
***REMOVED*** The maximum number of maps that can be sent in one POST. Should match
***REMOVED*** com.google.net.browserchannel.BrowserChannel.MAX_MAPS_PER_REQUEST.
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.net.BrowserChannel.MAX_MAPS_PER_REQUEST_ = 1000;


***REMOVED***
***REMOVED*** Singleton event target for firing stat events
***REMOVED*** @type {goog.events.EventTarget}
***REMOVED*** @private
***REMOVED***
goog.net.BrowserChannel.statEventTarget_ = new goog.events.EventTarget();


***REMOVED***
***REMOVED*** Events fired by BrowserChannel and associated objects
***REMOVED*** @type {Object}
***REMOVED***
goog.net.BrowserChannel.Event = {***REMOVED***


***REMOVED***
***REMOVED*** Stat Event that fires when things of interest happen that may be useful for
***REMOVED*** applications to know about for stats or debugging purposes. This event fires
***REMOVED*** on the EventTarget returned by getStatEventTarget.
***REMOVED***
goog.net.BrowserChannel.Event.STAT_EVENT = 'statevent';



***REMOVED***
***REMOVED*** Event class for goog.net.BrowserChannel.Event.STAT_EVENT
***REMOVED***
***REMOVED*** @param {goog.events.EventTarget} eventTarget The stat event target for
       the browser channel.
***REMOVED*** @param {goog.net.BrowserChannel.Stat} stat The stat.
***REMOVED***
***REMOVED*** @extends {goog.events.Event}
***REMOVED*** @final
***REMOVED***
goog.net.BrowserChannel.StatEvent = function(eventTarget, stat) {
  goog.events.Event.call(this, goog.net.BrowserChannel.Event.STAT_EVENT,
      eventTarget);

 ***REMOVED*****REMOVED***
  ***REMOVED*** The stat
  ***REMOVED*** @type {goog.net.BrowserChannel.Stat}
 ***REMOVED*****REMOVED***
  this.stat = stat;

***REMOVED***
goog.inherits(goog.net.BrowserChannel.StatEvent, goog.events.Event);


***REMOVED***
***REMOVED*** An event that fires when POST requests complete successfully, indicating
***REMOVED*** the size of the POST and the round trip time.
***REMOVED*** This event fires on the EventTarget returned by getStatEventTarget.
***REMOVED***
goog.net.BrowserChannel.Event.TIMING_EVENT = 'timingevent';



***REMOVED***
***REMOVED*** Event class for goog.net.BrowserChannel.Event.TIMING_EVENT
***REMOVED***
***REMOVED*** @param {goog.events.EventTarget} target The stat event target for
       the browser channel.
***REMOVED*** @param {number} size The number of characters in the POST data.
***REMOVED*** @param {number} rtt The total round trip time from POST to response in MS.
***REMOVED*** @param {number} retries The number of times the POST had to be retried.
***REMOVED***
***REMOVED*** @extends {goog.events.Event}
***REMOVED*** @final
***REMOVED***
goog.net.BrowserChannel.TimingEvent = function(target, size, rtt, retries) {
  goog.events.Event.call(this, goog.net.BrowserChannel.Event.TIMING_EVENT,
      target);

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
goog.inherits(goog.net.BrowserChannel.TimingEvent, goog.events.Event);


***REMOVED***
***REMOVED*** The type of event that occurs every time some information about how reachable
***REMOVED*** the server is is discovered.
***REMOVED***
goog.net.BrowserChannel.Event.SERVER_REACHABILITY_EVENT =
    'serverreachability';


***REMOVED***
***REMOVED*** Types of events which reveal information about the reachability of the
***REMOVED*** server.
***REMOVED*** @enum {number}
***REMOVED***
goog.net.BrowserChannel.ServerReachability = {
  REQUEST_MADE: 1,
  REQUEST_SUCCEEDED: 2,
  REQUEST_FAILED: 3,
  BACK_CHANNEL_ACTIVITY: 4
***REMOVED***



***REMOVED***
***REMOVED*** Event class for goog.net.BrowserChannel.Event.SERVER_REACHABILITY_EVENT.
***REMOVED***
***REMOVED*** @param {goog.events.EventTarget} target The stat event target for
       the browser channel.
***REMOVED*** @param {goog.net.BrowserChannel.ServerReachability} reachabilityType The
***REMOVED***     reachability event type.
***REMOVED***
***REMOVED*** @extends {goog.events.Event}
***REMOVED*** @final
***REMOVED***
goog.net.BrowserChannel.ServerReachabilityEvent = function(target,
    reachabilityType) {
  goog.events.Event.call(this,
      goog.net.BrowserChannel.Event.SERVER_REACHABILITY_EVENT, target);

 ***REMOVED*****REMOVED***
  ***REMOVED*** @type {goog.net.BrowserChannel.ServerReachability}
 ***REMOVED*****REMOVED***
  this.reachabilityType = reachabilityType;
***REMOVED***
goog.inherits(goog.net.BrowserChannel.ServerReachabilityEvent,
    goog.events.Event);


***REMOVED***
***REMOVED*** Enum that identifies events for statistics that are interesting to track.
***REMOVED*** TODO(user) - Change name not to use Event or use EventTarget
***REMOVED*** @enum {number}
***REMOVED***
goog.net.BrowserChannel.Stat = {
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


 ***REMOVED*****REMOVED*** Event indicating the channel is blocked by a network administrator.***REMOVED***
  CHANNEL_BLOCKED: 4,

 ***REMOVED*****REMOVED*** Event indicating the start of test stage two.***REMOVED***
  TEST_STAGE_TWO_START: 5,

 ***REMOVED*****REMOVED*** Event indicating the first piece of test data was received.***REMOVED***
  TEST_STAGE_TWO_DATA_ONE: 6,

 ***REMOVED*****REMOVED***
  ***REMOVED*** Event indicating that the second piece of test data was received and it was
  ***REMOVED*** recieved separately from the first.
 ***REMOVED*****REMOVED***
  TEST_STAGE_TWO_DATA_TWO: 7,

 ***REMOVED*****REMOVED*** Event indicating both pieces of test data were received simultaneously.***REMOVED***
  TEST_STAGE_TWO_DATA_BOTH: 8,

 ***REMOVED*****REMOVED*** Event indicating stage one of the test request failed.***REMOVED***
  TEST_STAGE_ONE_FAILED: 9,

 ***REMOVED*****REMOVED*** Event indicating stage two of the test request failed.***REMOVED***
  TEST_STAGE_TWO_FAILED: 10,

 ***REMOVED*****REMOVED***
  ***REMOVED*** Event indicating that a buffering proxy is likely between the client and
  ***REMOVED*** the server.
 ***REMOVED*****REMOVED***
  PROXY: 11,

 ***REMOVED*****REMOVED***
  ***REMOVED*** Event indicating that no buffering proxy is likely between the client and
  ***REMOVED*** the server.
 ***REMOVED*****REMOVED***
  NOPROXY: 12,

 ***REMOVED*****REMOVED*** Event indicating an unknown SID error.***REMOVED***
  REQUEST_UNKNOWN_SESSION_ID: 13,

 ***REMOVED*****REMOVED*** Event indicating a bad status code was received.***REMOVED***
  REQUEST_BAD_STATUS: 14,

 ***REMOVED*****REMOVED*** Event indicating incomplete data was received***REMOVED***
  REQUEST_INCOMPLETE_DATA: 15,

 ***REMOVED*****REMOVED*** Event indicating bad data was received***REMOVED***
  REQUEST_BAD_DATA: 16,

 ***REMOVED*****REMOVED*** Event indicating no data was received when data was expected.***REMOVED***
  REQUEST_NO_DATA: 17,

 ***REMOVED*****REMOVED*** Event indicating a request timeout.***REMOVED***
  REQUEST_TIMEOUT: 18,

 ***REMOVED*****REMOVED***
  ***REMOVED*** Event indicating that the server never received our hanging GET and so it
  ***REMOVED*** is being retried.
 ***REMOVED*****REMOVED***
  BACKCHANNEL_MISSING: 19,

 ***REMOVED*****REMOVED***
  ***REMOVED*** Event indicating that we have determined that our hanging GET is not
  ***REMOVED*** receiving data when it should be. Thus it is dead dead and will be retried.
 ***REMOVED*****REMOVED***
  BACKCHANNEL_DEAD: 20,

 ***REMOVED*****REMOVED***
  ***REMOVED*** The browser declared itself offline during the lifetime of a request, or
  ***REMOVED*** was offline when a request was initially made.
 ***REMOVED*****REMOVED***
  BROWSER_OFFLINE: 21,

 ***REMOVED*****REMOVED*** ActiveX is blocked by the machine's admin settings.***REMOVED***
  ACTIVE_X_BLOCKED: 22
***REMOVED***


***REMOVED***
***REMOVED*** The normal response for forward channel requests.
***REMOVED*** Used only before version 8 of the protocol.
***REMOVED*** @type {string}
***REMOVED***
goog.net.BrowserChannel.MAGIC_RESPONSE_COOKIE = 'y2f%';


***REMOVED***
***REMOVED*** A guess at a cutoff at which to no longer assume the backchannel is dead
***REMOVED*** when we are slow to receive data. Number in bytes.
***REMOVED***
***REMOVED*** Assumption: The worst bandwidth we work on is 50 kilobits/sec
***REMOVED*** 50kbits/sec***REMOVED*** (1 byte / 8 bits)***REMOVED*** 6 sec dead backchannel timeout
***REMOVED*** @type {number}
***REMOVED***
goog.net.BrowserChannel.OUTSTANDING_DATA_BACKCHANNEL_RETRY_CUTOFF = 37500;


***REMOVED***
***REMOVED*** Returns the browserchannel logger.
***REMOVED***
***REMOVED*** @return {!goog.net.ChannelDebug} The channel debug object.
***REMOVED***
goog.net.BrowserChannel.prototype.getChannelDebug = function() {
  return this.channelDebug_;
***REMOVED***


***REMOVED***
***REMOVED*** Set the browserchannel logger.
***REMOVED*** TODO(user): Add interface for channel loggers or remove this function.
***REMOVED***
***REMOVED*** @param {goog.net.ChannelDebug} channelDebug The channel debug object.
***REMOVED***
goog.net.BrowserChannel.prototype.setChannelDebug = function(
    channelDebug) {
  if (goog.isDefAndNotNull(channelDebug)) {
    this.channelDebug_ = channelDebug;
  }
***REMOVED***


***REMOVED***
***REMOVED*** Allows the application to set an execution hooks for when BrowserChannel
***REMOVED*** starts processing requests. This is useful to track timing or logging
***REMOVED*** special information. The function takes no parameters and return void.
***REMOVED*** @param {Function} startHook  The function for the start hook.
***REMOVED***
goog.net.BrowserChannel.setStartThreadExecutionHook = function(startHook) {
  goog.net.BrowserChannel.startExecutionHook_ = startHook;
***REMOVED***


***REMOVED***
***REMOVED*** Allows the application to set an execution hooks for when BrowserChannel
***REMOVED*** stops processing requests. This is useful to track timing or logging
***REMOVED*** special information. The function takes no parameters and return void.
***REMOVED*** @param {Function} endHook  The function for the end hook.
***REMOVED***
goog.net.BrowserChannel.setEndThreadExecutionHook = function(endHook) {
  goog.net.BrowserChannel.endExecutionHook_ = endHook;
***REMOVED***


***REMOVED***
***REMOVED*** Application provided execution hook for the start hook.
***REMOVED***
***REMOVED*** @type {Function}
***REMOVED*** @private
***REMOVED***
goog.net.BrowserChannel.startExecutionHook_ = function() {***REMOVED*****REMOVED***


***REMOVED***
***REMOVED*** Application provided execution hook for the end hook.
***REMOVED***
***REMOVED*** @type {Function}
***REMOVED*** @private
***REMOVED***
goog.net.BrowserChannel.endExecutionHook_ = function() {***REMOVED*****REMOVED***


***REMOVED***
***REMOVED*** Instantiates a ChannelRequest with the given parameters. Overidden in tests.
***REMOVED***
***REMOVED*** @param {goog.net.BrowserChannel|goog.net.BrowserTestChannel} channel
***REMOVED***     The BrowserChannel that owns this request.
***REMOVED*** @param {goog.net.ChannelDebug} channelDebug A ChannelDebug to use for
***REMOVED***     logging.
***REMOVED*** @param {string=} opt_sessionId  The session id for the channel.
***REMOVED*** @param {string|number=} opt_requestId  The request id for this request.
***REMOVED*** @param {number=} opt_retryId  The retry id for this request.
***REMOVED*** @return {!goog.net.ChannelRequest} The created channel request.
***REMOVED***
goog.net.BrowserChannel.createChannelRequest = function(channel, channelDebug,
    opt_sessionId, opt_requestId, opt_retryId) {
  return new goog.net.ChannelRequest(
      channel,
      channelDebug,
      opt_sessionId,
      opt_requestId,
      opt_retryId);
***REMOVED***


***REMOVED***
***REMOVED*** Starts the channel. This initiates connections to the server.
***REMOVED***
***REMOVED*** @param {string} testPath  The path for the test connection.
***REMOVED*** @param {string} channelPath  The path for the channel connection.
***REMOVED*** @param {Object=} opt_extraParams  Extra parameter keys and values to add to
***REMOVED***     the requests.
***REMOVED*** @param {string=} opt_oldSessionId  Session ID from a previous session.
***REMOVED*** @param {number=} opt_oldArrayId  The last array ID from a previous session.
***REMOVED***
goog.net.BrowserChannel.prototype.connect = function(testPath, channelPath,
    opt_extraParams, opt_oldSessionId, opt_oldArrayId) {
  this.channelDebug_.debug('connect()');

  goog.net.BrowserChannel.notifyStatEvent(
      goog.net.BrowserChannel.Stat.CONNECT_ATTEMPT);

  this.path_ = channelPath;
  this.extraParams_ = opt_extraParams || {***REMOVED***

  // Attach parameters about the previous session if reconnecting.
  if (opt_oldSessionId && goog.isDef(opt_oldArrayId)) {
    this.extraParams_['OSID'] = opt_oldSessionId;
    this.extraParams_['OAID'] = opt_oldArrayId;
  }

  this.connectTest_(testPath);
***REMOVED***


***REMOVED***
***REMOVED*** Disconnects and closes the channel.
***REMOVED***
goog.net.BrowserChannel.prototype.disconnect = function() {
  this.channelDebug_.debug('disconnect()');

  this.cancelRequests_();

  if (this.state_ == goog.net.BrowserChannel.State.OPENED) {
    var rid = this.nextRid_++;
    var uri = this.forwardChannelUri_.clone();
    uri.setParameterValue('SID', this.sid_);
    uri.setParameterValue('RID', rid);
    uri.setParameterValue('TYPE', 'terminate');

    // Add the reconnect parameters.
    this.addAdditionalParams_(uri);

    var request = goog.net.BrowserChannel.createChannelRequest(
        this, this.channelDebug_, this.sid_, rid);
    request.sendUsingImgTag(uri);
  }

  this.onClose_();
***REMOVED***


***REMOVED***
***REMOVED*** Returns the session id of the channel. Only available after the
***REMOVED*** channel has been opened.
***REMOVED*** @return {string} Session ID.
***REMOVED***
goog.net.BrowserChannel.prototype.getSessionId = function() {
  return this.sid_;
***REMOVED***


***REMOVED***
***REMOVED*** Starts the test channel to determine network conditions.
***REMOVED***
***REMOVED*** @param {string} testPath  The relative PATH for the test connection.
***REMOVED*** @private
***REMOVED***
goog.net.BrowserChannel.prototype.connectTest_ = function(testPath) {
  this.channelDebug_.debug('connectTest_()');
  if (!this.okToMakeRequest_()) {
    return; // channel is cancelled
  }
  this.connectionTest_ = new goog.net.BrowserTestChannel(
      this, this.channelDebug_);
  this.connectionTest_.setExtraHeaders(this.extraHeaders_);
  this.connectionTest_.setParser(this.parser_);
  this.connectionTest_.connect(testPath);
***REMOVED***


***REMOVED***
***REMOVED*** Starts the regular channel which is run after the test channel is complete.
***REMOVED*** @private
***REMOVED***
goog.net.BrowserChannel.prototype.connectChannel_ = function() {
  this.channelDebug_.debug('connectChannel_()');
  this.ensureInState_(goog.net.BrowserChannel.State.INIT,
      goog.net.BrowserChannel.State.CLOSED);
  this.forwardChannelUri_ =
      this.getForwardChannelUri(***REMOVED*** @type {string}***REMOVED*** (this.path_));
  this.ensureForwardChannel_();
***REMOVED***


***REMOVED***
***REMOVED*** Cancels all outstanding requests.
***REMOVED*** @private
***REMOVED***
goog.net.BrowserChannel.prototype.cancelRequests_ = function() {
  if (this.connectionTest_) {
    this.connectionTest_.abort();
    this.connectionTest_ = null;
  }

  if (this.backChannelRequest_) {
    this.backChannelRequest_.cancel();
    this.backChannelRequest_ = null;
  }

  if (this.backChannelTimerId_) {
    goog.global.clearTimeout(this.backChannelTimerId_);
    this.backChannelTimerId_ = null;
  }

  this.clearDeadBackchannelTimer_();

  if (this.forwardChannelRequest_) {
    this.forwardChannelRequest_.cancel();
    this.forwardChannelRequest_ = null;
  }

  if (this.forwardChannelTimerId_) {
    goog.global.clearTimeout(this.forwardChannelTimerId_);
    this.forwardChannelTimerId_ = null;
  }
***REMOVED***


***REMOVED***
***REMOVED*** Returns the extra HTTP headers to add to all the requests sent to the server.
***REMOVED***
***REMOVED*** @return {Object} The HTTP headers, or null.
***REMOVED***
goog.net.BrowserChannel.prototype.getExtraHeaders = function() {
  return this.extraHeaders_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets extra HTTP headers to add to all the requests sent to the server.
***REMOVED***
***REMOVED*** @param {Object} extraHeaders The HTTP headers, or null.
***REMOVED***
goog.net.BrowserChannel.prototype.setExtraHeaders = function(extraHeaders) {
  this.extraHeaders_ = extraHeaders;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the throttle for handling onreadystatechange events for the request.
***REMOVED***
***REMOVED*** @param {number} throttle The throttle in ms.  A value of zero indicates
***REMOVED***     no throttle.
***REMOVED***
goog.net.BrowserChannel.prototype.setReadyStateChangeThrottle = function(
    throttle) {
  this.readyStateChangeThrottleMs_ = throttle;
***REMOVED***


***REMOVED***
***REMOVED*** Sets whether cross origin requests are supported for the browser channel.
***REMOVED***
***REMOVED*** Setting this allows the creation of requests to secondary domains and
***REMOVED*** sends XHRs with the CORS withCredentials bit set to true.
***REMOVED***
***REMOVED*** In order for cross-origin requests to work, the server will also need to set
***REMOVED*** CORS response headers as per:
***REMOVED*** https://developer.mozilla.org/en-US/docs/HTTP_access_control
***REMOVED***
***REMOVED*** See {@link goog.net.XhrIo#setWithCredentials}.
***REMOVED*** @param {boolean} supportCrossDomain Whether cross domain XHRs are supported.
***REMOVED***
goog.net.BrowserChannel.prototype.setSupportsCrossDomainXhrs = function(
    supportCrossDomain) {
  this.supportsCrossDomainXhrs_ = supportCrossDomain;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the handler used for channel callback events.
***REMOVED***
***REMOVED*** @return {goog.net.BrowserChannel.Handler} The handler.
***REMOVED***
goog.net.BrowserChannel.prototype.getHandler = function() {
  return this.handler_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the handler used for channel callback events.
***REMOVED*** @param {goog.net.BrowserChannel.Handler} handler The handler to set.
***REMOVED***
goog.net.BrowserChannel.prototype.setHandler = function(handler) {
  this.handler_ = handler;
***REMOVED***


***REMOVED***
***REMOVED*** Returns whether the channel allows the use of a subdomain. There may be
***REMOVED*** cases where this isn't allowed.
***REMOVED*** @return {boolean} Whether a host prefix is allowed.
***REMOVED***
goog.net.BrowserChannel.prototype.getAllowHostPrefix = function() {
  return this.allowHostPrefix_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets whether the channel allows the use of a subdomain. There may be cases
***REMOVED*** where this isn't allowed, for example, logging in with troutboard where
***REMOVED*** using a subdomain causes Apache to force the user to authenticate twice.
***REMOVED*** @param {boolean} allowHostPrefix Whether a host prefix is allowed.
***REMOVED***
goog.net.BrowserChannel.prototype.setAllowHostPrefix =
    function(allowHostPrefix) {
  this.allowHostPrefix_ = allowHostPrefix;
***REMOVED***


***REMOVED***
***REMOVED*** Returns whether the channel is buffered or not. This state is valid for
***REMOVED*** querying only after the test connection has completed. This may be
***REMOVED*** queried in the goog.net.BrowserChannel.okToMakeRequest() callback.
***REMOVED*** A channel may be buffered if the test connection determines that
***REMOVED*** a chunked response could not be sent down within a suitable time.
***REMOVED*** @return {boolean} Whether the channel is buffered.
***REMOVED***
goog.net.BrowserChannel.prototype.isBuffered = function() {
  return !this.useChunked_;
***REMOVED***


***REMOVED***
***REMOVED*** Returns whether chunked mode is allowed. In certain debugging situations,
***REMOVED*** it's useful for the application to have a way to disable chunked mode for a
***REMOVED*** user.

***REMOVED*** @return {boolean} Whether chunked mode is allowed.
***REMOVED***
goog.net.BrowserChannel.prototype.getAllowChunkedMode =
    function() {
  return this.allowChunkedMode_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets whether chunked mode is allowed. In certain debugging situations, it's
***REMOVED*** useful for the application to have a way to disable chunked mode for a user.
***REMOVED*** @param {boolean} allowChunkedMode  Whether chunked mode is allowed.
***REMOVED***
goog.net.BrowserChannel.prototype.setAllowChunkedMode =
    function(allowChunkedMode) {
  this.allowChunkedMode_ = allowChunkedMode;
***REMOVED***


***REMOVED***
***REMOVED*** Sends a request to the server. The format of the request is a Map data
***REMOVED*** structure of key/value pairs. These maps are then encoded in a format
***REMOVED*** suitable for the wire and then reconstituted as a Map data structure that
***REMOVED*** the server can process.
***REMOVED*** @param {Object|goog.structs.Map} map  The map to send.
***REMOVED*** @param {?Object=} opt_context The context associated with the map.
***REMOVED***
goog.net.BrowserChannel.prototype.sendMap = function(map, opt_context) {
  if (this.state_ == goog.net.BrowserChannel.State.CLOSED) {
    throw Error('Invalid operation: sending map when state is closed');
  }

  // We can only send 1000 maps per POST, but typically we should never have
  // that much to send, so warn if we exceed that (we still send all the maps).
  if (this.outgoingMaps_.length ==
      goog.net.BrowserChannel.MAX_MAPS_PER_REQUEST_) {
    // severe() is temporary so that we get these uploaded and can figure out
    // what's causing them. Afterwards can change to warning().
    this.channelDebug_.severe(
        'Already have ' + goog.net.BrowserChannel.MAX_MAPS_PER_REQUEST_ +
        ' queued maps upon queueing ' + goog.json.serialize(map));
  }

  this.outgoingMaps_.push(
      new goog.net.BrowserChannel.QueuedMap(this.nextMapId_++, map,
                                            opt_context));
  if (this.state_ == goog.net.BrowserChannel.State.OPENING ||
      this.state_ == goog.net.BrowserChannel.State.OPENED) {
    this.ensureForwardChannel_();
  }
***REMOVED***


***REMOVED***
***REMOVED*** When set to true, this changes the behavior of the forward channel so it
***REMOVED*** will not retry requests; it will fail after one network failure, and if
***REMOVED*** there was already one network failure, the request will fail immediately.
***REMOVED*** @param {boolean} failFast  Whether or not to fail fast.
***REMOVED***
goog.net.BrowserChannel.prototype.setFailFast = function(failFast) {
  this.failFast_ = failFast;
  this.channelDebug_.info('setFailFast: ' + failFast);
  if ((this.forwardChannelRequest_ || this.forwardChannelTimerId_) &&
      this.forwardChannelRetryCount_ > this.getForwardChannelMaxRetries()) {
    this.channelDebug_.info(
        'Retry count ' + this.forwardChannelRetryCount_ +
        ' > new maxRetries ' + this.getForwardChannelMaxRetries() +
        '. Fail immediately!');
    if (this.forwardChannelRequest_) {
      this.forwardChannelRequest_.cancel();
      // Go through the standard onRequestComplete logic to expose the max-retry
      // failure in the standard way.
      this.onRequestComplete(this.forwardChannelRequest_);
    } else {  // i.e., this.forwardChannelTimerId_
      goog.global.clearTimeout(this.forwardChannelTimerId_);
      this.forwardChannelTimerId_ = null;
      // The error code from the last failed request is gone, so just use a
      // generic one.
      this.signalError_(goog.net.BrowserChannel.Error.REQUEST_FAILED);
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** @return {number} The max number of forward-channel retries, which will be 0
***REMOVED*** in fail-fast mode.
***REMOVED***
goog.net.BrowserChannel.prototype.getForwardChannelMaxRetries = function() {
  return this.failFast_ ? 0 : this.forwardChannelMaxRetries_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the maximum number of attempts to connect to the server for forward
***REMOVED*** channel requests.
***REMOVED*** @param {number} retries The maximum number of attempts.
***REMOVED***
goog.net.BrowserChannel.prototype.setForwardChannelMaxRetries =
    function(retries) {
  this.forwardChannelMaxRetries_ = retries;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the timeout for a forward channel request.
***REMOVED*** @param {number} timeoutMs The timeout in milliseconds.
***REMOVED***
goog.net.BrowserChannel.prototype.setForwardChannelRequestTimeout =
    function(timeoutMs) {
  this.forwardChannelRequestTimeoutMs_ = timeoutMs;
***REMOVED***


***REMOVED***
***REMOVED*** @return {number} The max number of back-channel retries, which is a constant.
***REMOVED***
goog.net.BrowserChannel.prototype.getBackChannelMaxRetries = function() {
  // Back-channel retries is a constant.
  return goog.net.BrowserChannel.BACK_CHANNEL_MAX_RETRIES;
***REMOVED***


***REMOVED***
***REMOVED*** Returns whether the channel is closed
***REMOVED*** @return {boolean} true if the channel is closed.
***REMOVED***
goog.net.BrowserChannel.prototype.isClosed = function() {
  return this.state_ == goog.net.BrowserChannel.State.CLOSED;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the browser channel state.
***REMOVED*** @return {goog.net.BrowserChannel.State} The current state of the browser
***REMOVED*** channel.
***REMOVED***
goog.net.BrowserChannel.prototype.getState = function() {
  return this.state_;
***REMOVED***


***REMOVED***
***REMOVED*** Return the last status code received for a request.
***REMOVED*** @return {number} The last status code received for a request.
***REMOVED***
goog.net.BrowserChannel.prototype.getLastStatusCode = function() {
  return this.lastStatusCode_;
***REMOVED***


***REMOVED***
***REMOVED*** @return {number} The last array id received.
***REMOVED***
goog.net.BrowserChannel.prototype.getLastArrayId = function() {
  return this.lastArrayId_;
***REMOVED***


***REMOVED***
***REMOVED*** Returns whether there are outstanding requests servicing the channel.
***REMOVED*** @return {boolean} true if there are outstanding requests.
***REMOVED***
goog.net.BrowserChannel.prototype.hasOutstandingRequests = function() {
  return this.outstandingRequests_() != 0;
***REMOVED***


***REMOVED***
***REMOVED*** Sets a new parser for the response payload. A custom parser may be set to
***REMOVED*** avoid using eval(), for example. By default, the parser uses
***REMOVED*** {@code goog.json.unsafeParse}.
***REMOVED*** @param {!goog.string.Parser} parser Parser.
***REMOVED***
goog.net.BrowserChannel.prototype.setParser = function(parser) {
  this.parser_ = parser;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the number of outstanding requests.
***REMOVED*** @return {number} The number of outstanding requests to the server.
***REMOVED*** @private
***REMOVED***
goog.net.BrowserChannel.prototype.outstandingRequests_ = function() {
  var count = 0;
  if (this.backChannelRequest_) {
    count++;
  }
  if (this.forwardChannelRequest_) {
    count++;
  }
  return count;
***REMOVED***


***REMOVED***
***REMOVED*** Ensures that a forward channel request is scheduled.
***REMOVED*** @private
***REMOVED***
goog.net.BrowserChannel.prototype.ensureForwardChannel_ = function() {
  if (this.forwardChannelRequest_) {
    // connection in process - no need to start a new request
    return;
  }

  if (this.forwardChannelTimerId_) {
    // no need to start a new request - one is already scheduled
    return;
  }

  this.forwardChannelTimerId_ = goog.net.BrowserChannel.setTimeout(
      goog.bind(this.onStartForwardChannelTimer_, this), 0);
  this.forwardChannelRetryCount_ = 0;
***REMOVED***


***REMOVED***
***REMOVED*** Schedules a forward-channel retry for the specified request, unless the max
***REMOVED*** retries has been reached.
***REMOVED*** @param {goog.net.ChannelRequest} request The failed request to retry.
***REMOVED*** @return {boolean} true iff a retry was scheduled.
***REMOVED*** @private
***REMOVED***
goog.net.BrowserChannel.prototype.maybeRetryForwardChannel_ =
    function(request) {
  if (this.forwardChannelRequest_ || this.forwardChannelTimerId_) {
    // Should be impossible to be called in this state.
    this.channelDebug_.severe('Request already in progress');
    return false;
  }

  if (this.state_ == goog.net.BrowserChannel.State.INIT ||  // no retry open_()
      (this.forwardChannelRetryCount_ >= this.getForwardChannelMaxRetries())) {
    return false;
  }

  this.channelDebug_.debug('Going to retry POST');

  this.forwardChannelTimerId_ = goog.net.BrowserChannel.setTimeout(
      goog.bind(this.onStartForwardChannelTimer_, this, request),
      this.getRetryTime_(this.forwardChannelRetryCount_));
  this.forwardChannelRetryCount_++;
  return true;
***REMOVED***


***REMOVED***
***REMOVED*** Timer callback for ensureForwardChannel
***REMOVED*** @param {goog.net.ChannelRequest=} opt_retryRequest A failed request to retry.
***REMOVED*** @private
***REMOVED***
goog.net.BrowserChannel.prototype.onStartForwardChannelTimer_ = function(
    opt_retryRequest) {
  this.forwardChannelTimerId_ = null;
  this.startForwardChannel_(opt_retryRequest);
***REMOVED***


***REMOVED***
***REMOVED*** Begins a new forward channel operation to the server.
***REMOVED*** @param {goog.net.ChannelRequest=} opt_retryRequest A failed request to retry.
***REMOVED*** @private
***REMOVED***
goog.net.BrowserChannel.prototype.startForwardChannel_ = function(
    opt_retryRequest) {
  this.channelDebug_.debug('startForwardChannel_');
  if (!this.okToMakeRequest_()) {
    return; // channel is cancelled
  } else if (this.state_ == goog.net.BrowserChannel.State.INIT) {
    if (opt_retryRequest) {
      this.channelDebug_.severe('Not supposed to retry the open');
      return;
    }
    this.open_();
    this.state_ = goog.net.BrowserChannel.State.OPENING;
  } else if (this.state_ == goog.net.BrowserChannel.State.OPENED) {
    if (opt_retryRequest) {
      this.makeForwardChannelRequest_(opt_retryRequest);
      return;
    }

    if (this.outgoingMaps_.length == 0) {
      this.channelDebug_.debug('startForwardChannel_ returned: ' +
                                   'nothing to send');
      // no need to start a new forward channel request
      return;
    }

    if (this.forwardChannelRequest_) {
      // Should be impossible to be called in this state.
      this.channelDebug_.severe('startForwardChannel_ returned: ' +
                                    'connection already in progress');
      return;
    }

    this.makeForwardChannelRequest_();
    this.channelDebug_.debug('startForwardChannel_ finished, sent request');
  }
***REMOVED***


***REMOVED***
***REMOVED*** Establishes a new channel session with the the server.
***REMOVED*** @private
***REMOVED***
goog.net.BrowserChannel.prototype.open_ = function() {
  this.channelDebug_.debug('open_()');
  this.nextRid_ = Math.floor(Math.random()***REMOVED*** 100000);

  var rid = this.nextRid_++;
  var request = goog.net.BrowserChannel.createChannelRequest(
      this, this.channelDebug_, '', rid);
  request.setExtraHeaders(this.extraHeaders_);
  var requestText = this.dequeueOutgoingMaps_();
  var uri = this.forwardChannelUri_.clone();
  uri.setParameterValue('RID', rid);
  if (this.clientVersion_) {
    uri.setParameterValue('CVER', this.clientVersion_);
  }

  // Add the reconnect parameters.
  this.addAdditionalParams_(uri);

  request.xmlHttpPost(uri, requestText, true);
  this.forwardChannelRequest_ = request;
***REMOVED***


***REMOVED***
***REMOVED*** Makes a forward channel request using XMLHTTP.
***REMOVED*** @param {goog.net.ChannelRequest=} opt_retryRequest A failed request to retry.
***REMOVED*** @private
***REMOVED***
goog.net.BrowserChannel.prototype.makeForwardChannelRequest_ =
    function(opt_retryRequest) {
  var rid;
  var requestText;
  if (opt_retryRequest) {
    if (this.channelVersion_ > 6) {
      // In version 7 and up we can tack on new arrays to a retry.
      this.requeuePendingMaps_();
      rid = this.nextRid_ - 1;  // Must use last RID
      requestText = this.dequeueOutgoingMaps_();
    } else {
      // TODO(user): Remove this code and the opt_retryRequest passing
      // once server-side support for ver 7 is ubiquitous.
      rid = opt_retryRequest.getRequestId();
      requestText =***REMOVED*****REMOVED*** @type {string}***REMOVED*** (opt_retryRequest.getPostData());
    }
  } else {
    rid = this.nextRid_++;
    requestText = this.dequeueOutgoingMaps_();
  }

  var uri = this.forwardChannelUri_.clone();
  uri.setParameterValue('SID', this.sid_);
  uri.setParameterValue('RID', rid);
  uri.setParameterValue('AID', this.lastArrayId_);
  // Add the additional reconnect parameters.
  this.addAdditionalParams_(uri);

  var request = goog.net.BrowserChannel.createChannelRequest(
      this,
      this.channelDebug_,
      this.sid_,
      rid,
      this.forwardChannelRetryCount_ + 1);
  request.setExtraHeaders(this.extraHeaders_);

  // randomize from 50%-100% of the forward channel timeout to avoid
  // a big hit if servers happen to die at once.
  request.setTimeout(
      Math.round(this.forwardChannelRequestTimeoutMs_***REMOVED*** 0.50) +
      Math.round(this.forwardChannelRequestTimeoutMs_***REMOVED*** 0.50***REMOVED*** Math.random()));
  this.forwardChannelRequest_ = request;
  request.xmlHttpPost(uri, requestText, true);
***REMOVED***


***REMOVED***
***REMOVED*** Adds the additional parameters from the handler to the given URI.
***REMOVED*** @param {goog.Uri} uri The URI to add the parameters to.
***REMOVED*** @private
***REMOVED***
goog.net.BrowserChannel.prototype.addAdditionalParams_ = function(uri) {
  // Add the additional reconnect parameters as needed.
  if (this.handler_) {
    var params = this.handler_.getAdditionalParams(this);
    if (params) {
      goog.object.forEach(params, function(value, key) {
        uri.setParameterValue(key, value);
      });
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** Returns the request text from the outgoing maps and resets it.
***REMOVED*** @return {string} The encoded request text created from all the currently
***REMOVED***                  queued outgoing maps.
***REMOVED*** @private
***REMOVED***
goog.net.BrowserChannel.prototype.dequeueOutgoingMaps_ = function() {
  var count = Math.min(this.outgoingMaps_.length,
                       goog.net.BrowserChannel.MAX_MAPS_PER_REQUEST_);
  var sb = ['count=' + count];
  var offset;
  if (this.channelVersion_ > 6 && count > 0) {
    // To save a bit of bandwidth, specify the base mapId and the rest as
    // offsets from it.
    offset = this.outgoingMaps_[0].mapId;
    sb.push('ofs=' + offset);
  } else {
    offset = 0;
  }
  for (var i = 0; i < count; i++) {
    var mapId = this.outgoingMaps_[i].mapId;
    var map = this.outgoingMaps_[i].map;
    if (this.channelVersion_ <= 6) {
      // Map IDs were not used in ver 6 and before, just indexes in the request.
      mapId = i;
    } else {
      mapId -= offset;
    }
    try {
      goog.structs.forEach(map, function(value, key, coll) {
        sb.push('req' + mapId + '_' + key + '=' + encodeURIComponent(value));
      });
    } catch (ex) {
      // We send a map here because lots of the retry logic relies on map IDs,
      // so we have to send something.
      sb.push('req' + mapId + '_' + 'type' + '=' +
              encodeURIComponent('_badmap'));
      if (this.handler_) {
        this.handler_.badMapError(this, map);
      }
    }
  }
  this.pendingMaps_ = this.pendingMaps_.concat(
      this.outgoingMaps_.splice(0, count));
  return sb.join('&');
***REMOVED***


***REMOVED***
***REMOVED*** Requeues unacknowledged sent arrays for retransmission in the next forward
***REMOVED*** channel request.
***REMOVED*** @private
***REMOVED***
goog.net.BrowserChannel.prototype.requeuePendingMaps_ = function() {
  this.outgoingMaps_ = this.pendingMaps_.concat(this.outgoingMaps_);
  this.pendingMaps_.length = 0;
***REMOVED***


***REMOVED***
***REMOVED*** Ensures there is a backchannel request for receiving data from the server.
***REMOVED*** @private
***REMOVED***
goog.net.BrowserChannel.prototype.ensureBackChannel_ = function() {
  if (this.backChannelRequest_) {
    // already have one
    return;
  }

  if (this.backChannelTimerId_) {
    // no need to start a new request - one is already scheduled
    return;
  }

  this.backChannelAttemptId_ = 1;
  this.backChannelTimerId_ = goog.net.BrowserChannel.setTimeout(
      goog.bind(this.onStartBackChannelTimer_, this), 0);
  this.backChannelRetryCount_ = 0;
***REMOVED***


***REMOVED***
***REMOVED*** Schedules a back-channel retry, unless the max retries has been reached.
***REMOVED*** @return {boolean} true iff a retry was scheduled.
***REMOVED*** @private
***REMOVED***
goog.net.BrowserChannel.prototype.maybeRetryBackChannel_ = function() {
  if (this.backChannelRequest_ || this.backChannelTimerId_) {
    // Should be impossible to be called in this state.
    this.channelDebug_.severe('Request already in progress');
    return false;
  }

  if (this.backChannelRetryCount_ >= this.getBackChannelMaxRetries()) {
    return false;
  }

  this.channelDebug_.debug('Going to retry GET');

  this.backChannelAttemptId_++;
  this.backChannelTimerId_ = goog.net.BrowserChannel.setTimeout(
      goog.bind(this.onStartBackChannelTimer_, this),
      this.getRetryTime_(this.backChannelRetryCount_));
  this.backChannelRetryCount_++;
  return true;
***REMOVED***


***REMOVED***
***REMOVED*** Timer callback for ensureBackChannel_.
***REMOVED*** @private
***REMOVED***
goog.net.BrowserChannel.prototype.onStartBackChannelTimer_ = function() {
  this.backChannelTimerId_ = null;
  this.startBackChannel_();
***REMOVED***


***REMOVED***
***REMOVED*** Begins a new back channel operation to the server.
***REMOVED*** @private
***REMOVED***
goog.net.BrowserChannel.prototype.startBackChannel_ = function() {
  if (!this.okToMakeRequest_()) {
    // channel is cancelled
    return;
  }

  this.channelDebug_.debug('Creating new HttpRequest');
  this.backChannelRequest_ = goog.net.BrowserChannel.createChannelRequest(
      this,
      this.channelDebug_,
      this.sid_,
      'rpc',
      this.backChannelAttemptId_);
  this.backChannelRequest_.setExtraHeaders(this.extraHeaders_);
  this.backChannelRequest_.setReadyStateChangeThrottle(
      this.readyStateChangeThrottleMs_);
  var uri = this.backChannelUri_.clone();
  uri.setParameterValue('RID', 'rpc');
  uri.setParameterValue('SID', this.sid_);
  uri.setParameterValue('CI', this.useChunked_ ? '0' : '1');
  uri.setParameterValue('AID', this.lastArrayId_);

  // Add the reconnect parameters.
  this.addAdditionalParams_(uri);

  if (!goog.net.ChannelRequest.supportsXhrStreaming()) {
    uri.setParameterValue('TYPE', 'html');
    this.backChannelRequest_.tridentGet(uri, Boolean(this.hostPrefix_));
  } else {
    uri.setParameterValue('TYPE', 'xmlhttp');
    this.backChannelRequest_.xmlHttpGet(uri, true /* decodeChunks***REMOVED***,
        this.hostPrefix_, false /* opt_noClose***REMOVED***);
  }
  this.channelDebug_.debug('New Request created');
***REMOVED***


***REMOVED***
***REMOVED*** Gives the handler a chance to return an error code and stop channel
***REMOVED*** execution. A handler might want to do this to check that the user is still
***REMOVED*** logged in, for example.
***REMOVED*** @private
***REMOVED*** @return {boolean} If it's OK to make a request.
***REMOVED***
goog.net.BrowserChannel.prototype.okToMakeRequest_ = function() {
  if (this.handler_) {
    var result = this.handler_.okToMakeRequest(this);
    if (result != goog.net.BrowserChannel.Error.OK) {
      this.channelDebug_.debug('Handler returned error code from ' +
                                   'okToMakeRequest');
      this.signalError_(result);
      return false;
    }
  }
  return true;
***REMOVED***


***REMOVED***
***REMOVED*** Callback from BrowserTestChannel for when the channel is finished.
***REMOVED*** @param {goog.net.BrowserTestChannel} testChannel The BrowserTestChannel.
***REMOVED*** @param {boolean} useChunked  Whether we can chunk responses.
***REMOVED***
goog.net.BrowserChannel.prototype.testConnectionFinished =
    function(testChannel, useChunked) {
  this.channelDebug_.debug('Test Connection Finished');

  this.useChunked_ = this.allowChunkedMode_ && useChunked;
  this.lastStatusCode_ = testChannel.getLastStatusCode();
  this.connectChannel_();
***REMOVED***


***REMOVED***
***REMOVED*** Callback from BrowserTestChannel for when the channel has an error.
***REMOVED*** @param {goog.net.BrowserTestChannel} testChannel The BrowserTestChannel.
***REMOVED*** @param {goog.net.ChannelRequest.Error} errorCode  The error code of the
       failure.
***REMOVED***
goog.net.BrowserChannel.prototype.testConnectionFailure =
    function(testChannel, errorCode) {
  this.channelDebug_.debug('Test Connection Failed');
  this.lastStatusCode_ = testChannel.getLastStatusCode();
  this.signalError_(goog.net.BrowserChannel.Error.REQUEST_FAILED);
***REMOVED***


***REMOVED***
***REMOVED*** Callback from BrowserTestChannel for when the channel is blocked.
***REMOVED*** @param {goog.net.BrowserTestChannel} testChannel The BrowserTestChannel.
***REMOVED***
goog.net.BrowserChannel.prototype.testConnectionBlocked =
    function(testChannel) {
  this.channelDebug_.debug('Test Connection Blocked');
  this.lastStatusCode_ = this.connectionTest_.getLastStatusCode();
  this.signalError_(goog.net.BrowserChannel.Error.BLOCKED);
***REMOVED***


***REMOVED***
***REMOVED*** Callback from ChannelRequest for when new data is received
***REMOVED*** @param {goog.net.ChannelRequest} request  The request object.
***REMOVED*** @param {string} responseText The text of the response.
***REMOVED***
goog.net.BrowserChannel.prototype.onRequestData =
    function(request, responseText) {
  if (this.state_ == goog.net.BrowserChannel.State.CLOSED ||
      (this.backChannelRequest_ != request &&
       this.forwardChannelRequest_ != request)) {
    // either CLOSED or a request we don't know about (perhaps an old request)
    return;
  }
  this.lastStatusCode_ = request.getLastStatusCode();

  if (this.forwardChannelRequest_ == request &&
      this.state_ == goog.net.BrowserChannel.State.OPENED) {
    if (this.channelVersion_ > 7) {
      var response;
      try {
        response = this.parser_.parse(responseText);
      } catch (ex) {
        response = null;
      }
      if (goog.isArray(response) && response.length == 3) {
        this.handlePostResponse_(***REMOVED*** @type {Array}***REMOVED*** (response));
      } else {
        this.channelDebug_.debug('Bad POST response data returned');
        this.signalError_(goog.net.BrowserChannel.Error.BAD_RESPONSE);
      }
    } else if (responseText != goog.net.BrowserChannel.MAGIC_RESPONSE_COOKIE) {
      this.channelDebug_.debug('Bad data returned - missing/invald ' +
                                   'magic cookie');
      this.signalError_(goog.net.BrowserChannel.Error.BAD_RESPONSE);
    }
  } else {
    if (this.backChannelRequest_ == request) {
      this.clearDeadBackchannelTimer_();
    }
    if (!goog.string.isEmpty(responseText)) {
      var response = this.parser_.parse(responseText);
      goog.asserts.assert(goog.isArray(response));
      this.onInput_(***REMOVED*** @type {!Array}***REMOVED*** (response));
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** Handles a POST response from the server.
***REMOVED*** @param {Array} responseValues The key value pairs in the POST response.
***REMOVED*** @private
***REMOVED***
goog.net.BrowserChannel.prototype.handlePostResponse_ = function(
    responseValues) {
  // The first response value is set to 0 if server is missing backchannel.
  if (responseValues[0] == 0) {
    this.handleBackchannelMissing_();
    return;
  }
  this.lastPostResponseArrayId_ = responseValues[1];
  var outstandingArrays = this.lastPostResponseArrayId_ - this.lastArrayId_;
  if (0 < outstandingArrays) {
    var numOutstandingBackchannelBytes = responseValues[2];
    this.channelDebug_.debug(numOutstandingBackchannelBytes + ' bytes (in ' +
        outstandingArrays + ' arrays) are outstanding on the BackChannel');
    if (!this.shouldRetryBackChannel_(numOutstandingBackchannelBytes)) {
      return;
    }
    if (!this.deadBackChannelTimerId_) {
      // We expect to receive data within 2 RTTs or we retry the backchannel.
      this.deadBackChannelTimerId_ = goog.net.BrowserChannel.setTimeout(
          goog.bind(this.onBackChannelDead_, this),
          2***REMOVED*** goog.net.BrowserChannel.RTT_ESTIMATE);
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** Handles a POST response from the server telling us that it has detected that
***REMOVED*** we have no hanging GET connection.
***REMOVED*** @private
***REMOVED***
goog.net.BrowserChannel.prototype.handleBackchannelMissing_ = function() {
  // As long as the back channel was started before the POST was sent,
  // we should retry the backchannel. We give a slight buffer of RTT_ESTIMATE
  // so as not to excessively retry the backchannel
  this.channelDebug_.debug('Server claims our backchannel is missing.');
  if (this.backChannelTimerId_) {
    this.channelDebug_.debug('But we are currently starting the request.');
    return;
  } else if (!this.backChannelRequest_) {
    this.channelDebug_.warning(
        'We do not have a BackChannel established');
  } else if (this.backChannelRequest_.getRequestStartTime() +
      goog.net.BrowserChannel.RTT_ESTIMATE <
      this.forwardChannelRequest_.getRequestStartTime()) {
    this.clearDeadBackchannelTimer_();
    this.backChannelRequest_.cancel();
    this.backChannelRequest_ = null;
  } else {
    return;
  }
  this.maybeRetryBackChannel_();
  goog.net.BrowserChannel.notifyStatEvent(
      goog.net.BrowserChannel.Stat.BACKCHANNEL_MISSING);
***REMOVED***


***REMOVED***
***REMOVED*** Determines whether we should start the process of retrying a possibly
***REMOVED*** dead backchannel.
***REMOVED*** @param {number} outstandingBytes The number of bytes for which the server has
***REMOVED***     not yet received acknowledgement.
***REMOVED*** @return {boolean} Whether to start the backchannel retry timer.
***REMOVED*** @private
***REMOVED***
goog.net.BrowserChannel.prototype.shouldRetryBackChannel_ = function(
    outstandingBytes) {
  // Not too many outstanding bytes, not buffered and not after a retry.
  return outstandingBytes <
      goog.net.BrowserChannel.OUTSTANDING_DATA_BACKCHANNEL_RETRY_CUTOFF &&
      !this.isBuffered() &&
      this.backChannelRetryCount_ == 0;
***REMOVED***


***REMOVED***
***REMOVED*** Decides which host prefix should be used, if any.  If there is a handler,
***REMOVED*** allows the handler to validate a host prefix provided by the server, and
***REMOVED*** optionally override it.
***REMOVED*** @param {?string} serverHostPrefix The host prefix provided by the server.
***REMOVED*** @return {?string} The host prefix to actually use, if any. Will return null
***REMOVED***     if the use of host prefixes was disabled via setAllowHostPrefix().
***REMOVED***
goog.net.BrowserChannel.prototype.correctHostPrefix = function(
    serverHostPrefix) {
  if (this.allowHostPrefix_) {
    if (this.handler_) {
      return this.handler_.correctHostPrefix(serverHostPrefix);
    }
    return serverHostPrefix;
  }
  return null;
***REMOVED***


***REMOVED***
***REMOVED*** Handles the timer that indicates that our backchannel is no longer able to
***REMOVED*** successfully receive data from the server.
***REMOVED*** @private
***REMOVED***
goog.net.BrowserChannel.prototype.onBackChannelDead_ = function() {
  if (goog.isDefAndNotNull(this.deadBackChannelTimerId_)) {
    this.deadBackChannelTimerId_ = null;
    this.backChannelRequest_.cancel();
    this.backChannelRequest_ = null;
    this.maybeRetryBackChannel_();
    goog.net.BrowserChannel.notifyStatEvent(
        goog.net.BrowserChannel.Stat.BACKCHANNEL_DEAD);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Clears the timer that indicates that our backchannel is no longer able to
***REMOVED*** successfully receive data from the server.
***REMOVED*** @private
***REMOVED***
goog.net.BrowserChannel.prototype.clearDeadBackchannelTimer_ = function() {
  if (goog.isDefAndNotNull(this.deadBackChannelTimerId_)) {
    goog.global.clearTimeout(this.deadBackChannelTimerId_);
    this.deadBackChannelTimerId_ = null;
  }
***REMOVED***


***REMOVED***
***REMOVED*** Returns whether or not the given error/status combination is fatal or not.
***REMOVED*** On fatal errors we immediately close the session rather than retrying the
***REMOVED*** failed request.
***REMOVED*** @param {goog.net.ChannelRequest.Error?} error The error code for the failed
***REMOVED*** request.
***REMOVED*** @param {number} statusCode The last HTTP status code.
***REMOVED*** @return {boolean} Whether or not the error is fatal.
***REMOVED*** @private
***REMOVED***
goog.net.BrowserChannel.isFatalError_ =
    function(error, statusCode) {
  return error == goog.net.ChannelRequest.Error.UNKNOWN_SESSION_ID ||
      error == goog.net.ChannelRequest.Error.ACTIVE_X_BLOCKED ||
      (error == goog.net.ChannelRequest.Error.STATUS &&
       statusCode > 0);
***REMOVED***


***REMOVED***
***REMOVED*** Callback from ChannelRequest that indicates a request has completed.
***REMOVED*** @param {goog.net.ChannelRequest} request  The request object.
***REMOVED***
goog.net.BrowserChannel.prototype.onRequestComplete =
    function(request) {
  this.channelDebug_.debug('Request complete');
  var type;
  if (this.backChannelRequest_ == request) {
    this.clearDeadBackchannelTimer_();
    this.backChannelRequest_ = null;
    type = goog.net.BrowserChannel.ChannelType_.BACK_CHANNEL;
  } else if (this.forwardChannelRequest_ == request) {
    this.forwardChannelRequest_ = null;
    type = goog.net.BrowserChannel.ChannelType_.FORWARD_CHANNEL;
  } else {
    // return if it was an old request from a previous session
    return;
  }

  this.lastStatusCode_ = request.getLastStatusCode();

  if (this.state_ == goog.net.BrowserChannel.State.CLOSED) {
    return;
  }

  if (request.getSuccess()) {
    // Yay!
    if (type == goog.net.BrowserChannel.ChannelType_.FORWARD_CHANNEL) {
      var size = request.getPostData() ? request.getPostData().length : 0;
      goog.net.BrowserChannel.notifyTimingEvent(size,
          goog.now() - request.getRequestStartTime(),
          this.forwardChannelRetryCount_);
      this.ensureForwardChannel_();
      this.onSuccess_();
      this.pendingMaps_.length = 0;
    } else {  // i.e., back-channel
      this.ensureBackChannel_();
    }
    return;
  }
  // Else unsuccessful. Fall through.

  var lastError = request.getLastError();
  if (!goog.net.BrowserChannel.isFatalError_(lastError,
                                             this.lastStatusCode_)) {
    // Maybe retry.
    this.channelDebug_.debug('Maybe retrying, last error: ' +
        goog.net.ChannelRequest.errorStringFromCode(
           ***REMOVED*****REMOVED*** @type {goog.net.ChannelRequest.Error}***REMOVED*** (lastError),
            this.lastStatusCode_));
    if (type == goog.net.BrowserChannel.ChannelType_.FORWARD_CHANNEL) {
      if (this.maybeRetryForwardChannel_(request)) {
        return;
      }
    }
    if (type == goog.net.BrowserChannel.ChannelType_.BACK_CHANNEL) {
      if (this.maybeRetryBackChannel_()) {
        return;
      }
    }
    // Else exceeded max retries. Fall through.
    this.channelDebug_.debug('Exceeded max number of retries');
  } else {
    // Else fatal error. Fall through and mark the pending maps as failed.
    this.channelDebug_.debug('Not retrying due to error type');
  }


  // Can't save this session. :(
  this.channelDebug_.debug('Error: HTTP request failed');
  switch (lastError) {
    case goog.net.ChannelRequest.Error.NO_DATA:
      this.signalError_(goog.net.BrowserChannel.Error.NO_DATA);
      break;
    case goog.net.ChannelRequest.Error.BAD_DATA:
      this.signalError_(goog.net.BrowserChannel.Error.BAD_DATA);
      break;
    case goog.net.ChannelRequest.Error.UNKNOWN_SESSION_ID:
      this.signalError_(goog.net.BrowserChannel.Error.UNKNOWN_SESSION_ID);
      break;
    case goog.net.ChannelRequest.Error.ACTIVE_X_BLOCKED:
      this.signalError_(goog.net.BrowserChannel.Error.ACTIVE_X_BLOCKED);
      break;
    default:
      this.signalError_(goog.net.BrowserChannel.Error.REQUEST_FAILED);
      break;
  }
***REMOVED***


***REMOVED***
***REMOVED*** @param {number} retryCount Number of retries so far.
***REMOVED*** @return {number} Time in ms before firing next retry request.
***REMOVED*** @private
***REMOVED***
goog.net.BrowserChannel.prototype.getRetryTime_ = function(retryCount) {
  var retryTime = this.baseRetryDelayMs_ +
      Math.floor(Math.random()***REMOVED*** this.retryDelaySeedMs_);
  if (!this.isActive()) {
    this.channelDebug_.debug('Inactive channel');
    retryTime =
        retryTime***REMOVED*** goog.net.BrowserChannel.INACTIVE_CHANNEL_RETRY_FACTOR;
  }
  // Backoff for subsequent retries
  retryTime = retryTime***REMOVED*** retryCount;
  return retryTime;
***REMOVED***


***REMOVED***
***REMOVED*** @param {number} baseDelayMs The base part of the retry delay, in ms.
***REMOVED*** @param {number} delaySeedMs A random delay between 0 and this is added to
***REMOVED***     the base part.
***REMOVED***
goog.net.BrowserChannel.prototype.setRetryDelay = function(baseDelayMs,
    delaySeedMs) {
  this.baseRetryDelayMs_ = baseDelayMs;
  this.retryDelaySeedMs_ = delaySeedMs;
***REMOVED***


***REMOVED***
***REMOVED*** Processes the data returned by the server.
***REMOVED*** @param {!Array.<!Array>} respArray The response array returned by the server.
***REMOVED*** @private
***REMOVED***
goog.net.BrowserChannel.prototype.onInput_ = function(respArray) {
  var batch = this.handler_ && this.handler_.channelHandleMultipleArrays ?
      [] : null;
  for (var i = 0; i < respArray.length; i++) {
    var nextArray = respArray[i];
    this.lastArrayId_ = nextArray[0];
    nextArray = nextArray[1];
    if (this.state_ == goog.net.BrowserChannel.State.OPENING) {
      if (nextArray[0] == 'c') {
        this.sid_ = nextArray[1];
        this.hostPrefix_ = this.correctHostPrefix(nextArray[2]);
        var negotiatedVersion = nextArray[3];
        if (goog.isDefAndNotNull(negotiatedVersion)) {
          this.channelVersion_ = negotiatedVersion;
        } else {
          // Servers prior to version 7 did not send this, so assume version 6.
          this.channelVersion_ = 6;
        }
        this.state_ = goog.net.BrowserChannel.State.OPENED;
        if (this.handler_) {
          this.handler_.channelOpened(this);
        }
        this.backChannelUri_ = this.getBackChannelUri(
            this.hostPrefix_,***REMOVED*****REMOVED*** @type {string}***REMOVED*** (this.path_));
        // Open connection to receive data
        this.ensureBackChannel_();
      } else if (nextArray[0] == 'stop') {
        this.signalError_(goog.net.BrowserChannel.Error.STOP);
      }
    } else if (this.state_ == goog.net.BrowserChannel.State.OPENED) {
      if (nextArray[0] == 'stop') {
        if (batch && !goog.array.isEmpty(batch)) {
          this.handler_.channelHandleMultipleArrays(this, batch);
          batch.length = 0;
        }
        this.signalError_(goog.net.BrowserChannel.Error.STOP);
      } else if (nextArray[0] == 'noop') {
        // ignore - noop to keep connection happy
      } else {
        if (batch) {
          batch.push(nextArray);
        } else if (this.handler_) {
          this.handler_.channelHandleArray(this, nextArray);
        }
      }
      // We have received useful data on the back-channel, so clear its retry
      // count. We do this because back-channels by design do not complete
      // quickly, so on a flaky connection we could have many fail to complete
      // fully but still deliver a lot of data before they fail. We don't want
      // to count such failures towards the retry limit, because we don't want
      // to give up on a session if we can still receive data.
      this.backChannelRetryCount_ = 0;
    }
  }
  if (batch && !goog.array.isEmpty(batch)) {
    this.handler_.channelHandleMultipleArrays(this, batch);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Helper to ensure the BrowserChannel is in the expected state.
***REMOVED*** @param {...number} var_args The channel must be in one of the indicated
***REMOVED***     states.
***REMOVED*** @private
***REMOVED***
goog.net.BrowserChannel.prototype.ensureInState_ = function(var_args) {
  if (!goog.array.contains(arguments, this.state_)) {
    throw Error('Unexpected channel state: ' + this.state_);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Signals an error has occurred.
***REMOVED*** @param {goog.net.BrowserChannel.Error} error  The error code for the failure.
***REMOVED*** @private
***REMOVED***
goog.net.BrowserChannel.prototype.signalError_ = function(error) {
  this.channelDebug_.info('Error code ' + error);
  if (error == goog.net.BrowserChannel.Error.REQUEST_FAILED ||
      error == goog.net.BrowserChannel.Error.BLOCKED) {
    // Ping google to check if it's a server error or user's network error.
    var imageUri = null;
    if (this.handler_) {
      imageUri = this.handler_.getNetworkTestImageUri(this);
    }
    goog.net.tmpnetwork.testGoogleCom(
        goog.bind(this.testGoogleComCallback_, this), imageUri);
  } else {
    goog.net.BrowserChannel.notifyStatEvent(
        goog.net.BrowserChannel.Stat.ERROR_OTHER);
  }
  this.onError_(error);
***REMOVED***


***REMOVED***
***REMOVED*** Callback for testGoogleCom during error handling.
***REMOVED*** @param {boolean} networkUp Whether the network is up.
***REMOVED*** @private
***REMOVED***
goog.net.BrowserChannel.prototype.testGoogleComCallback_ = function(networkUp) {
  if (networkUp) {
    this.channelDebug_.info('Successfully pinged google.com');
    goog.net.BrowserChannel.notifyStatEvent(
        goog.net.BrowserChannel.Stat.ERROR_OTHER);
  } else {
    this.channelDebug_.info('Failed to ping google.com');
    goog.net.BrowserChannel.notifyStatEvent(
        goog.net.BrowserChannel.Stat.ERROR_NETWORK);
    // We cann onError_ here instead of signalError_ because the latter just
    // calls notifyStatEvent, and we don't want to have another stat event.
    this.onError_(goog.net.BrowserChannel.Error.NETWORK);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Called when messages have been successfully sent from the queue.
***REMOVED*** @private
***REMOVED***
goog.net.BrowserChannel.prototype.onSuccess_ = function() {
  if (this.handler_) {
    this.handler_.channelSuccess(this, this.pendingMaps_);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Called when we've determined the final error for a channel. It closes the
***REMOVED*** notifiers the handler of the error and closes the channel.
***REMOVED*** @param {goog.net.BrowserChannel.Error} error  The error code for the failure.
***REMOVED*** @private
***REMOVED***
goog.net.BrowserChannel.prototype.onError_ = function(error) {
  this.channelDebug_.debug('HttpChannel: error - ' + error);
  this.state_ = goog.net.BrowserChannel.State.CLOSED;
  if (this.handler_) {
    this.handler_.channelError(this, error);
  }
  this.onClose_();
  this.cancelRequests_();
***REMOVED***


***REMOVED***
***REMOVED*** Called when the channel has been closed. It notifiers the handler of the
***REMOVED*** event, and reports any pending or undelivered maps.
***REMOVED*** @private
***REMOVED***
goog.net.BrowserChannel.prototype.onClose_ = function() {
  this.state_ = goog.net.BrowserChannel.State.CLOSED;
  this.lastStatusCode_ = -1;
  if (this.handler_) {
    if (this.pendingMaps_.length == 0 && this.outgoingMaps_.length == 0) {
      this.handler_.channelClosed(this);
    } else {
      this.channelDebug_.debug('Number of undelivered maps' +
          ', pending: ' + this.pendingMaps_.length +
          ', outgoing: ' + this.outgoingMaps_.length);

      var copyOfPendingMaps = goog.array.clone(this.pendingMaps_);
      var copyOfUndeliveredMaps = goog.array.clone(this.outgoingMaps_);
      this.pendingMaps_.length = 0;
      this.outgoingMaps_.length = 0;

      this.handler_.channelClosed(this,
          copyOfPendingMaps,
          copyOfUndeliveredMaps);
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** Gets the Uri used for the connection that sends data to the server.
***REMOVED*** @param {string} path The path on the host.
***REMOVED*** @return {!goog.Uri} The forward channel URI.
***REMOVED***
goog.net.BrowserChannel.prototype.getForwardChannelUri =
    function(path) {
  var uri = this.createDataUri(null, path);
  this.channelDebug_.debug('GetForwardChannelUri: ' + uri);
  return uri;
***REMOVED***


***REMOVED***
***REMOVED*** Gets the results for the first browser channel test
***REMOVED*** @return {Array.<string>} The results.
***REMOVED***
goog.net.BrowserChannel.prototype.getFirstTestResults =
    function() {
  return this.firstTestResults_;
***REMOVED***


***REMOVED***
***REMOVED*** Gets the results for the second browser channel test
***REMOVED*** @return {?boolean} The results. True -> buffered connection,
***REMOVED***      False -> unbuffered, null -> unknown.
***REMOVED***
goog.net.BrowserChannel.prototype.getSecondTestResults = function() {
  return this.secondTestResults_;
***REMOVED***


***REMOVED***
***REMOVED*** Gets the Uri used for the connection that receives data from the server.
***REMOVED*** @param {?string} hostPrefix The host prefix.
***REMOVED*** @param {string} path The path on the host.
***REMOVED*** @return {!goog.Uri} The back channel URI.
***REMOVED***
goog.net.BrowserChannel.prototype.getBackChannelUri =
    function(hostPrefix, path) {
  var uri = this.createDataUri(this.shouldUseSecondaryDomains() ?
      hostPrefix : null, path);
  this.channelDebug_.debug('GetBackChannelUri: ' + uri);
  return uri;
***REMOVED***


***REMOVED***
***REMOVED*** Creates a data Uri applying logic for secondary hostprefix, port
***REMOVED*** overrides, and versioning.
***REMOVED*** @param {?string} hostPrefix The host prefix.
***REMOVED*** @param {string} path The path on the host (may be absolute or relative).
***REMOVED*** @param {number=} opt_overridePort Optional override port.
***REMOVED*** @return {!goog.Uri} The data URI.
***REMOVED***
goog.net.BrowserChannel.prototype.createDataUri =
    function(hostPrefix, path, opt_overridePort) {
  var uri = goog.Uri.parse(path);
  var uriAbsolute = (uri.getDomain() != '');
  if (uriAbsolute) {
    if (hostPrefix) {
      uri.setDomain(hostPrefix + '.' + uri.getDomain());
    }

    uri.setPort(opt_overridePort || uri.getPort());
  } else {
    var locationPage = window.location;
    var hostName;
    if (hostPrefix) {
      hostName = hostPrefix + '.' + locationPage.hostname;
    } else {
      hostName = locationPage.hostname;
    }

    var port = opt_overridePort || locationPage.port;

    uri = goog.Uri.create(locationPage.protocol, null, hostName, port, path);
  }

  if (this.extraParams_) {
    goog.object.forEach(this.extraParams_, function(value, key) {
      uri.setParameterValue(key, value);
    });
  }

  // Add the protocol version to the URI.
  uri.setParameterValue('VER', this.channelVersion_);

  // Add the reconnect parameters.
  this.addAdditionalParams_(uri);

  return uri;
***REMOVED***


***REMOVED***
***REMOVED*** Called when BC needs to create an XhrIo object.  Override in a subclass if
***REMOVED*** you need to customize the behavior, for example to enable the creation of
***REMOVED*** XHR's capable of calling a secondary domain. Will also allow calling
***REMOVED*** a secondary domain if withCredentials (CORS) is enabled.
***REMOVED*** @param {?string} hostPrefix The host prefix, if we need an XhrIo object
***REMOVED***     capable of calling a secondary domain.
***REMOVED*** @return {!goog.net.XhrIo} A new XhrIo object.
***REMOVED***
goog.net.BrowserChannel.prototype.createXhrIo = function(hostPrefix) {
  if (hostPrefix && !this.supportsCrossDomainXhrs_) {
    throw Error('Can\'t create secondary domain capable XhrIo object.');
  }
***REMOVED***
  xhr.setWithCredentials(this.supportsCrossDomainXhrs_);
  return xhr;
***REMOVED***


***REMOVED***
***REMOVED*** Gets whether this channel is currently active. This is used to determine the
***REMOVED*** length of time to wait before retrying. This call delegates to the handler.
***REMOVED*** @return {boolean} Whether the channel is currently active.
***REMOVED***
goog.net.BrowserChannel.prototype.isActive = function() {
  return !!this.handler_ && this.handler_.isActive(this);
***REMOVED***


***REMOVED***
***REMOVED*** Wrapper around SafeTimeout which calls the start and end execution hooks
***REMOVED*** with a try...finally block.
***REMOVED*** @param {Function} fn The callback function.
***REMOVED*** @param {number} ms The time in MS for the timer.
***REMOVED*** @return {number} The ID of the timer.
***REMOVED***
goog.net.BrowserChannel.setTimeout = function(fn, ms) {
  if (!goog.isFunction(fn)) {
    throw Error('Fn must not be null and must be a function');
  }
  return goog.global.setTimeout(function() {
    goog.net.BrowserChannel.onStartExecution();
    try {
      fn();
    } finally {
      goog.net.BrowserChannel.onEndExecution();
    }
  }, ms);
***REMOVED***


***REMOVED***
***REMOVED*** Helper function to call the start hook
***REMOVED***
goog.net.BrowserChannel.onStartExecution = function() {
  goog.net.BrowserChannel.startExecutionHook_();
***REMOVED***


***REMOVED***
***REMOVED*** Helper function to call the end hook
***REMOVED***
goog.net.BrowserChannel.onEndExecution = function() {
  goog.net.BrowserChannel.endExecutionHook_();
***REMOVED***


***REMOVED***
***REMOVED*** Returns the singleton event target for stat events.
***REMOVED*** @return {goog.events.EventTarget} The event target for stat events.
***REMOVED***
goog.net.BrowserChannel.getStatEventTarget = function() {
  return goog.net.BrowserChannel.statEventTarget_;
***REMOVED***


***REMOVED***
***REMOVED*** Notify the channel that a particular fine grained network event has occurred.
***REMOVED*** Should be considered package-private.
***REMOVED*** @param {goog.net.BrowserChannel.ServerReachability} reachabilityType The
***REMOVED***     reachability event type.
***REMOVED***
goog.net.BrowserChannel.prototype.notifyServerReachabilityEvent = function(
    reachabilityType) {
  var target = goog.net.BrowserChannel.statEventTarget_;
  target.dispatchEvent(new goog.net.BrowserChannel.ServerReachabilityEvent(
      target, reachabilityType));
***REMOVED***


***REMOVED***
***REMOVED*** Helper function to call the stat event callback.
***REMOVED*** @param {goog.net.BrowserChannel.Stat} stat The stat.
***REMOVED***
goog.net.BrowserChannel.notifyStatEvent = function(stat) {
  var target = goog.net.BrowserChannel.statEventTarget_;
  target.dispatchEvent(
      new goog.net.BrowserChannel.StatEvent(target, stat));
***REMOVED***


***REMOVED***
***REMOVED*** Helper function to notify listeners about POST request performance.
***REMOVED***
***REMOVED*** @param {number} size Number of characters in the POST data.
***REMOVED*** @param {number} rtt The amount of time from POST start to response.
***REMOVED*** @param {number} retries The number of times the POST had to be retried.
***REMOVED***
goog.net.BrowserChannel.notifyTimingEvent = function(size, rtt, retries) {
  var target = goog.net.BrowserChannel.statEventTarget_;
  target.dispatchEvent(
      new goog.net.BrowserChannel.TimingEvent(target, size, rtt, retries));
***REMOVED***


***REMOVED***
***REMOVED*** Determines whether to use a secondary domain when the server gives us
***REMOVED*** a host prefix. This allows us to work around browser per-domain
***REMOVED*** connection limits.
***REMOVED***
***REMOVED*** Currently, we  use secondary domains when using Trident's ActiveXObject,
***REMOVED*** because it supports cross-domain requests out of the box.  Note that in IE10
***REMOVED*** we no longer use ActiveX since it's not supported in Metro mode and IE10
***REMOVED*** supports XHR streaming.
***REMOVED***
***REMOVED*** If you need to use secondary domains on other browsers and IE10,
***REMOVED*** you have two choices:
***REMOVED***     1) If you only care about browsers that support CORS
***REMOVED***        (https://developer.mozilla.org/en-US/docs/HTTP_access_control), you
***REMOVED***        can use {@link #setSupportsCrossDomainXhrs} and set the appropriate
***REMOVED***        CORS response headers on the server.
***REMOVED***     2) Or, override this method in a subclass, and make sure that those
***REMOVED***        browsers use some messaging mechanism that works cross-domain (e.g
***REMOVED***        iframes and window.postMessage).
***REMOVED***
***REMOVED*** @return {boolean} Whether to use secondary domains.
***REMOVED*** @see http://code.google.com/p/closure-library/issues/detail?id=339
***REMOVED***
goog.net.BrowserChannel.prototype.shouldUseSecondaryDomains = function() {
  return this.supportsCrossDomainXhrs_ ||
      !goog.net.ChannelRequest.supportsXhrStreaming();
***REMOVED***


***REMOVED***
***REMOVED*** A LogSaver that can be used to accumulate all the debug logs for
***REMOVED*** BrowserChannels so they can be sent to the server when a problem is
***REMOVED*** detected.
***REMOVED***
goog.net.BrowserChannel.LogSaver = {***REMOVED***


***REMOVED***
***REMOVED*** Buffer for accumulating the debug log
***REMOVED*** @type {goog.structs.CircularBuffer}
***REMOVED*** @private
***REMOVED***
goog.net.BrowserChannel.LogSaver.buffer_ =
    new goog.structs.CircularBuffer(1000);


***REMOVED***
***REMOVED*** Whether we're currently accumulating the debug log.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.net.BrowserChannel.LogSaver.enabled_ = false;


***REMOVED***
***REMOVED*** Formatter for saving logs.
***REMOVED*** @type {goog.debug.Formatter}
***REMOVED*** @private
***REMOVED***
goog.net.BrowserChannel.LogSaver.formatter_ = new goog.debug.TextFormatter();


***REMOVED***
***REMOVED*** Returns whether the LogSaver is enabled.
***REMOVED*** @return {boolean} Whether saving is enabled or disabled.
***REMOVED***
goog.net.BrowserChannel.LogSaver.isEnabled = function() {
  return goog.net.BrowserChannel.LogSaver.enabled_;
***REMOVED***


***REMOVED***
***REMOVED*** Enables of disables the LogSaver.
***REMOVED*** @param {boolean} enable Whether to enable or disable saving.
***REMOVED***
goog.net.BrowserChannel.LogSaver.setEnabled = function(enable) {
  if (enable == goog.net.BrowserChannel.LogSaver.enabled_) {
    return;
  }

  var fn = goog.net.BrowserChannel.LogSaver.addLogRecord;
  var logger = goog.log.getLogger('goog.net');
  if (enable) {
    goog.log.addHandler(logger, fn);
  } else {
    goog.log.removeHandler(logger, fn);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Adds a log record.
***REMOVED*** @param {goog.log.LogRecord} logRecord the LogRecord.
***REMOVED***
goog.net.BrowserChannel.LogSaver.addLogRecord = function(logRecord) {
  goog.net.BrowserChannel.LogSaver.buffer_.add(
      goog.net.BrowserChannel.LogSaver.formatter_.formatRecord(logRecord));
***REMOVED***


***REMOVED***
***REMOVED*** Returns the log as a single string.
***REMOVED*** @return {string} The log as a single string.
***REMOVED***
goog.net.BrowserChannel.LogSaver.getBuffer = function() {
  return goog.net.BrowserChannel.LogSaver.buffer_.getValues().join('');
***REMOVED***


***REMOVED***
***REMOVED*** Clears the buffer
***REMOVED***
goog.net.BrowserChannel.LogSaver.clearBuffer = function() {
  goog.net.BrowserChannel.LogSaver.buffer_.clear();
***REMOVED***



***REMOVED***
***REMOVED*** Abstract base class for the browser channel handler
***REMOVED***
***REMOVED***
goog.net.BrowserChannel.Handler = function() {
***REMOVED***


***REMOVED***
***REMOVED*** Callback handler for when a batch of response arrays is received from the
***REMOVED*** server.
***REMOVED*** @type {?function(!goog.net.BrowserChannel, !Array.<!Array>)}
***REMOVED***
goog.net.BrowserChannel.Handler.prototype.channelHandleMultipleArrays = null;


***REMOVED***
***REMOVED*** Whether it's okay to make a request to the server. A handler can return
***REMOVED*** false if the channel should fail. For example, if the user has logged out,
***REMOVED*** the handler may want all requests to fail immediately.
***REMOVED*** @param {goog.net.BrowserChannel} browserChannel The browser channel.
***REMOVED*** @return {goog.net.BrowserChannel.Error} An error code. The code should
***REMOVED*** return goog.net.BrowserChannel.Error.OK to indicate it's okay. Any other
***REMOVED*** error code will cause a failure.
***REMOVED***
goog.net.BrowserChannel.Handler.prototype.okToMakeRequest =
    function(browserChannel) {
  return goog.net.BrowserChannel.Error.OK;
***REMOVED***


***REMOVED***
***REMOVED*** Indicates the BrowserChannel has successfully negotiated with the server
***REMOVED*** and can now send and receive data.
***REMOVED*** @param {goog.net.BrowserChannel} browserChannel The browser channel.
***REMOVED***
goog.net.BrowserChannel.Handler.prototype.channelOpened =
    function(browserChannel) {
***REMOVED***


***REMOVED***
***REMOVED*** New input is available for the application to process.
***REMOVED***
***REMOVED*** @param {goog.net.BrowserChannel} browserChannel The browser channel.
***REMOVED*** @param {Array} array The data array.
***REMOVED***
goog.net.BrowserChannel.Handler.prototype.channelHandleArray =
    function(browserChannel, array) {
***REMOVED***


***REMOVED***
***REMOVED*** Indicates maps were successfully sent on the BrowserChannel.
***REMOVED***
***REMOVED*** @param {goog.net.BrowserChannel} browserChannel The browser channel.
***REMOVED*** @param {Array.<goog.net.BrowserChannel.QueuedMap>} deliveredMaps The
***REMOVED***     array of maps that have been delivered to the server. This is a direct
***REMOVED***     reference to the internal BrowserChannel array, so a copy should be made
***REMOVED***     if the caller desires a reference to the data.
***REMOVED***
goog.net.BrowserChannel.Handler.prototype.channelSuccess =
    function(browserChannel, deliveredMaps) {
***REMOVED***


***REMOVED***
***REMOVED*** Indicates an error occurred on the BrowserChannel.
***REMOVED***
***REMOVED*** @param {goog.net.BrowserChannel} browserChannel The browser channel.
***REMOVED*** @param {goog.net.BrowserChannel.Error} error The error code.
***REMOVED***
goog.net.BrowserChannel.Handler.prototype.channelError =
    function(browserChannel, error) {
***REMOVED***


***REMOVED***
***REMOVED*** Indicates the BrowserChannel is closed. Also notifies about which maps,
***REMOVED*** if any, that may not have been delivered to the server.
***REMOVED*** @param {goog.net.BrowserChannel} browserChannel The browser channel.
***REMOVED*** @param {Array.<goog.net.BrowserChannel.QueuedMap>=} opt_pendingMaps The
***REMOVED***     array of pending maps, which may or may not have been delivered to the
***REMOVED***     server.
***REMOVED*** @param {Array.<goog.net.BrowserChannel.QueuedMap>=} opt_undeliveredMaps
***REMOVED***     The array of undelivered maps, which have definitely not been delivered
***REMOVED***     to the server.
***REMOVED***
goog.net.BrowserChannel.Handler.prototype.channelClosed =
    function(browserChannel, opt_pendingMaps, opt_undeliveredMaps) {
***REMOVED***


***REMOVED***
***REMOVED*** Gets any parameters that should be added at the time another connection is
***REMOVED*** made to the server.
***REMOVED*** @param {goog.net.BrowserChannel} browserChannel The browser channel.
***REMOVED*** @return {Object} Extra parameter keys and values to add to the
***REMOVED***                  requests.
***REMOVED***
goog.net.BrowserChannel.Handler.prototype.getAdditionalParams =
    function(browserChannel) {
  return {***REMOVED***
***REMOVED***


***REMOVED***
***REMOVED*** Gets the URI of an image that can be used to test network connectivity.
***REMOVED*** @param {goog.net.BrowserChannel} browserChannel The browser channel.
***REMOVED*** @return {goog.Uri?} A custom URI to load for the network test.
***REMOVED***
goog.net.BrowserChannel.Handler.prototype.getNetworkTestImageUri =
    function(browserChannel) {
  return null;
***REMOVED***


***REMOVED***
***REMOVED*** Gets whether this channel is currently active. This is used to determine the
***REMOVED*** length of time to wait before retrying.
***REMOVED*** @param {goog.net.BrowserChannel} browserChannel The browser channel.
***REMOVED*** @return {boolean} Whether the channel is currently active.
***REMOVED***
goog.net.BrowserChannel.Handler.prototype.isActive = function(browserChannel) {
  return true;
***REMOVED***


***REMOVED***
***REMOVED*** Called by the channel if enumeration of the map throws an exception.
***REMOVED*** @param {goog.net.BrowserChannel} browserChannel The browser channel.
***REMOVED*** @param {Object} map The map that can't be enumerated.
***REMOVED***
goog.net.BrowserChannel.Handler.prototype.badMapError =
    function(browserChannel, map) {
  return;
***REMOVED***


***REMOVED***
***REMOVED*** Allows the handler to override a host prefix provided by the server.  Will
***REMOVED*** be called whenever the channel has received such a prefix and is considering
***REMOVED*** its use.
***REMOVED*** @param {?string} serverHostPrefix The host prefix provided by the server.
***REMOVED*** @return {?string} The host prefix the client should use.
***REMOVED***
goog.net.BrowserChannel.Handler.prototype.correctHostPrefix =
    function(serverHostPrefix) {
  return serverHostPrefix;
***REMOVED***
