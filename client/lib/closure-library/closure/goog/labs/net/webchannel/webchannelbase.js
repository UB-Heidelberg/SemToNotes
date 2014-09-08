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
***REMOVED*** @fileoverview Base WebChannel implementation.
***REMOVED***
***REMOVED***


goog.provide('goog.labs.net.webChannel.WebChannelBase');

***REMOVED***
goog.require('goog.array');
goog.require('goog.asserts');
goog.require('goog.debug.TextFormatter');
goog.require('goog.json');
goog.require('goog.labs.net.webChannel.BaseTestChannel');
goog.require('goog.labs.net.webChannel.Channel');
goog.require('goog.labs.net.webChannel.ChannelRequest');
goog.require('goog.labs.net.webChannel.ConnectionState');
goog.require('goog.labs.net.webChannel.ForwardChannelRequestPool');
goog.require('goog.labs.net.webChannel.WebChannelDebug');
goog.require('goog.labs.net.webChannel.Wire');
goog.require('goog.labs.net.webChannel.WireV8');
goog.require('goog.labs.net.webChannel.netUtils');
goog.require('goog.labs.net.webChannel.requestStats');
goog.require('goog.labs.net.webChannel.requestStats.Stat');
goog.require('goog.log');
***REMOVED***
goog.require('goog.object');
goog.require('goog.string');
goog.require('goog.structs');
goog.require('goog.structs.CircularBuffer');

goog.scope(function() {
var BaseTestChannel = goog.labs.net.webChannel.BaseTestChannel;
var ChannelRequest = goog.labs.net.webChannel.ChannelRequest;
var ConnectionState = goog.labs.net.webChannel.ConnectionState;
var ForwardChannelRequestPool =
    goog.labs.net.webChannel.ForwardChannelRequestPool;
var WebChannelDebug = goog.labs.net.webChannel.WebChannelDebug;
var Wire = goog.labs.net.webChannel.Wire;
var WireV8 = goog.labs.net.webChannel.WireV8;
var netUtils = goog.labs.net.webChannel.netUtils;
var requestStats = goog.labs.net.webChannel.requestStats;



***REMOVED***
***REMOVED*** This WebChannel implementation is branched off goog.net.BrowserChannel
***REMOVED*** for now. Ongoing changes to goog.net.BrowserChannel will be back
***REMOVED*** ported to this implementation as needed.
***REMOVED***
***REMOVED*** @param {!goog.net.WebChannel.Options=} opt_options Configuration for the
***REMOVED***        WebChannel instance.
***REMOVED*** @param {string=} opt_clientVersion An application-specific version number
***REMOVED***        that is sent to the server when connected.
***REMOVED*** @param {!ConnectionState=} opt_conn Previously determined connection
***REMOVED***        conditions.
***REMOVED***
***REMOVED*** @struct
***REMOVED*** @implements {goog.labs.net.webChannel.Channel}
***REMOVED***
goog.labs.net.webChannel.WebChannelBase = function(opt_options,
    opt_clientVersion, opt_conn) {
 ***REMOVED*****REMOVED***
  ***REMOVED*** The application specific version that is passed to the server.
  ***REMOVED*** @private {?string}
 ***REMOVED*****REMOVED***
  this.clientVersion_ = opt_clientVersion || null;

 ***REMOVED*****REMOVED***
  ***REMOVED*** An array of queued maps that need to be sent to the server.
  ***REMOVED*** @private {!Array.<Wire.QueuedMap>}
 ***REMOVED*****REMOVED***
  this.outgoingMaps_ = [];

 ***REMOVED*****REMOVED***
  ***REMOVED*** An array of dequeued maps that we have either received a non-successful
  ***REMOVED*** response for, or no response at all, and which therefore may or may not
  ***REMOVED*** have been received by the server.
  ***REMOVED*** @private {!Array.<Wire.QueuedMap>}
 ***REMOVED*****REMOVED***
  this.pendingMaps_ = [];

 ***REMOVED*****REMOVED***
  ***REMOVED*** The channel debug used for logging
  ***REMOVED*** @private {!WebChannelDebug}
 ***REMOVED*****REMOVED***
  this.channelDebug_ = new WebChannelDebug();

 ***REMOVED*****REMOVED***
  ***REMOVED*** Previous connectivity test results.
  ***REMOVED*** @private {!ConnectionState}
 ***REMOVED*****REMOVED***
  this.ConnState_ = opt_conn || new ConnectionState();

 ***REMOVED*****REMOVED***
  ***REMOVED*** Extra HTTP headers to add to all the requests sent to the server.
  ***REMOVED*** @private {Object}
 ***REMOVED*****REMOVED***
  this.extraHeaders_ = null;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Extra parameters to add to all the requests sent to the server.
  ***REMOVED*** @private {Object}
 ***REMOVED*****REMOVED***
  this.extraParams_ = null;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The ChannelRequest object for the backchannel.
  ***REMOVED*** @private {ChannelRequest}
 ***REMOVED*****REMOVED***
  this.backChannelRequest_ = null;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The relative path (in the context of the the page hosting the browser
  ***REMOVED*** channel) for making requests to the server.
  ***REMOVED*** @private {?string}
 ***REMOVED*****REMOVED***
  this.path_ = null;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The absolute URI for the forwardchannel request.
  ***REMOVED*** @private {goog.Uri}
 ***REMOVED*****REMOVED***
  this.forwardChannelUri_ = null;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The absolute URI for the backchannel request.
  ***REMOVED*** @private {goog.Uri}
 ***REMOVED*****REMOVED***
  this.backChannelUri_ = null;

 ***REMOVED*****REMOVED***
  ***REMOVED*** A subdomain prefix for using a subdomain in IE for the backchannel
  ***REMOVED*** requests.
  ***REMOVED*** @private {?string}
 ***REMOVED*****REMOVED***
  this.hostPrefix_ = null;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Whether we allow the use of a subdomain in IE for the backchannel requests.
  ***REMOVED*** @private {boolean}
 ***REMOVED*****REMOVED***
  this.allowHostPrefix_ = true;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The next id to use for the RID (request identifier) parameter. This
  ***REMOVED*** identifier uniquely identifies the forward channel request.
  ***REMOVED*** @private {number}
 ***REMOVED*****REMOVED***
  this.nextRid_ = 0;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The id to use for the next outgoing map. This identifier uniquely
  ***REMOVED*** identifies a sent map.
  ***REMOVED*** @private {number}
 ***REMOVED*****REMOVED***
  this.nextMapId_ = 0;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Whether to fail forward-channel requests after one try or a few tries.
  ***REMOVED*** @private {boolean}
 ***REMOVED*****REMOVED***
  this.failFast_ = false;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The handler that receive callbacks for state changes and data.
  ***REMOVED*** @private {goog.labs.net.webChannel.WebChannelBase.Handler}
 ***REMOVED*****REMOVED***
  this.handler_ = null;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Timer identifier for asynchronously making a forward channel request.
  ***REMOVED*** @private {?number}
 ***REMOVED*****REMOVED***
  this.forwardChannelTimerId_ = null;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Timer identifier for asynchronously making a back channel request.
  ***REMOVED*** @private {?number}
 ***REMOVED*****REMOVED***
  this.backChannelTimerId_ = null;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Timer identifier for the timer that waits for us to retry the backchannel
  ***REMOVED*** in the case where it is dead and no longer receiving data.
  ***REMOVED*** @private {?number}
 ***REMOVED*****REMOVED***
  this.deadBackChannelTimerId_ = null;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The TestChannel object which encapsulates the logic for determining
  ***REMOVED*** interesting network conditions about the client.
  ***REMOVED*** @private {BaseTestChannel}
 ***REMOVED*****REMOVED***
  this.connectionTest_ = null;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Whether the client's network conditions can support chunked responses.
  ***REMOVED*** @private {?boolean}
 ***REMOVED*****REMOVED***
  this.useChunked_ = null;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Whether chunked mode is allowed. In certain debugging situations, it's
  ***REMOVED*** useful to disable this.
  ***REMOVED*** @private {boolean}
 ***REMOVED*****REMOVED***
  this.allowChunkedMode_ = true;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The array identifier of the last array received from the server for the
  ***REMOVED*** backchannel request.
  ***REMOVED*** @private {number}
 ***REMOVED*****REMOVED***
  this.lastArrayId_ = -1;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The array id of the last array sent by the server that we know about.
  ***REMOVED*** @private {number}
 ***REMOVED*****REMOVED***
  this.lastPostResponseArrayId_ = -1;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The last status code received.
  ***REMOVED*** @private {number}
 ***REMOVED*****REMOVED***
  this.lastStatusCode_ = -1;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Number of times we have retried the current forward channel request.
  ***REMOVED*** @private {number}
 ***REMOVED*****REMOVED***
  this.forwardChannelRetryCount_ = 0;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Number of times in a row that we have retried the current back channel
  ***REMOVED*** request and received no data.
  ***REMOVED*** @private {number}
 ***REMOVED*****REMOVED***
  this.backChannelRetryCount_ = 0;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The attempt id for the current back channel request. Starts at 1 and
  ***REMOVED*** increments for each reconnect. The server uses this to log if our
  ***REMOVED*** connection is flaky or not.
  ***REMOVED*** @private {number}
 ***REMOVED*****REMOVED***
  this.backChannelAttemptId_ = 0;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The base part of the time before firing next retry request. Default is 5
  ***REMOVED*** seconds. Note that a random delay is added (see {@link retryDelaySeedMs_})
  ***REMOVED*** for all retries, and linear backoff is applied to the sum for subsequent
  ***REMOVED*** retries.
  ***REMOVED*** @private {number}
 ***REMOVED*****REMOVED***
  this.baseRetryDelayMs_ = 5***REMOVED*** 1000;

 ***REMOVED*****REMOVED***
  ***REMOVED*** A random time between 0 and this number of MS is added to the
  ***REMOVED*** {@link baseRetryDelayMs_}. Default is 10 seconds.
  ***REMOVED*** @private {number}
 ***REMOVED*****REMOVED***
  this.retryDelaySeedMs_ = 10***REMOVED*** 1000;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Maximum number of attempts to connect to the server for forward channel
  ***REMOVED*** requests. Defaults to 2.
  ***REMOVED*** @private {number}
 ***REMOVED*****REMOVED***
  this.forwardChannelMaxRetries_ = 2;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The timeout in milliseconds for a forward channel request. Defaults to 20
  ***REMOVED*** seconds. Note that part of this timeout can be randomized.
  ***REMOVED*** @private {number}
 ***REMOVED*****REMOVED***
  this.forwardChannelRequestTimeoutMs_ = 20***REMOVED*** 1000;

 ***REMOVED*****REMOVED***
  ***REMOVED*** A throttle time in ms for readystatechange events for the backchannel.
  ***REMOVED*** Useful for throttling when ready state is INTERACTIVE (partial data).
  ***REMOVED***
  ***REMOVED*** This throttle is useful if the server sends large data chunks down the
  ***REMOVED*** backchannel.  It prevents examining XHR partial data on every readystate
  ***REMOVED*** change event.  This is useful because large chunks can trigger hundreds
  ***REMOVED*** of readystatechange events, each of which takes ~5ms or so to handle,
  ***REMOVED*** in turn making the UI unresponsive for a significant period.
  ***REMOVED***
  ***REMOVED*** If set to zero no throttle is used.
  ***REMOVED*** @private {number}
 ***REMOVED*****REMOVED***
  this.readyStateChangeThrottleMs_ = 0;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Whether cross origin requests are supported for the channel.
  ***REMOVED***
  ***REMOVED*** See {@link goog.net.XhrIo#setWithCredentials}.
  ***REMOVED*** @private {boolean}
 ***REMOVED*****REMOVED***
  this.supportsCrossDomainXhrs_ = false;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The current session id.
  ***REMOVED*** @private {string}
 ***REMOVED*****REMOVED***
  this.sid_ = '';

 ***REMOVED*****REMOVED***
  ***REMOVED*** The current ChannelRequest pool for the forward channel.
  ***REMOVED*** @private {!ForwardChannelRequestPool}
 ***REMOVED*****REMOVED***
  this.forwardChannelRequestPool_ = new ForwardChannelRequestPool(
      opt_options && opt_options.concurrentRequestLimit);

 ***REMOVED*****REMOVED***
  ***REMOVED*** The V8 codec.
  ***REMOVED*** @private {!WireV8}
 ***REMOVED*****REMOVED***
  this.wireCodec_ = new WireV8();
***REMOVED***

var WebChannelBase = goog.labs.net.webChannel.WebChannelBase;


***REMOVED***
***REMOVED*** The channel version that we negotiated with the server for this session.
***REMOVED*** Starts out as the version we request, and then is changed to the negotiated
***REMOVED*** version after the initial open.
***REMOVED*** @private {number}
***REMOVED***
WebChannelBase.prototype.channelVersion_ = Wire.LATEST_CHANNEL_VERSION;


***REMOVED***
***REMOVED*** Enum type for the channel state machine.
***REMOVED*** @enum {number}
***REMOVED***
WebChannelBase.State = {
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
***REMOVED*** The current state of the WebChannel.
***REMOVED*** @private {!WebChannelBase.State}
***REMOVED***
WebChannelBase.prototype.state_ = WebChannelBase.State.INIT;


***REMOVED***
***REMOVED*** The timeout in milliseconds for a forward channel request.
***REMOVED*** @type {number}
***REMOVED***
WebChannelBase.FORWARD_CHANNEL_RETRY_TIMEOUT = 20***REMOVED*** 1000;


***REMOVED***
***REMOVED*** Maximum number of attempts to connect to the server for back channel
***REMOVED*** requests.
***REMOVED*** @type {number}
***REMOVED***
WebChannelBase.BACK_CHANNEL_MAX_RETRIES = 3;


***REMOVED***
***REMOVED*** A number in MS of how long we guess the maxmium amount of time a round trip
***REMOVED*** to the server should take. In the future this could be substituted with a
***REMOVED*** real measurement of the RTT.
***REMOVED*** @type {number}
***REMOVED***
WebChannelBase.RTT_ESTIMATE = 3***REMOVED*** 1000;


***REMOVED***
***REMOVED*** When retrying for an inactive channel, we will multiply the total delay by
***REMOVED*** this number.
***REMOVED*** @type {number}
***REMOVED***
WebChannelBase.INACTIVE_CHANNEL_RETRY_FACTOR = 2;


***REMOVED***
***REMOVED*** Enum type for identifying an error.
***REMOVED*** @enum {number}
***REMOVED***
WebChannelBase.Error = {
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

 ***REMOVED*****REMOVED*** An error due to bad data being returned from the server.***REMOVED***
  BAD_DATA: 10,

 ***REMOVED*****REMOVED*** An error due to a response that is not parsable.***REMOVED***
  BAD_RESPONSE: 11,

 ***REMOVED*****REMOVED*** ActiveX is blocked by the machine's admin settings.***REMOVED***
  ACTIVE_X_BLOCKED: 12
***REMOVED***


***REMOVED***
***REMOVED*** Internal enum type for the two channel types.
***REMOVED*** @enum {number}
***REMOVED*** @private
***REMOVED***
WebChannelBase.ChannelType_ = {
  FORWARD_CHANNEL: 1,

  BACK_CHANNEL: 2
***REMOVED***


***REMOVED***
***REMOVED*** The maximum number of maps that can be sent in one POST. Should match
***REMOVED*** MAX_MAPS_PER_REQUEST on the server code.
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
WebChannelBase.MAX_MAPS_PER_REQUEST_ = 1000;


***REMOVED***
***REMOVED*** A guess at a cutoff at which to no longer assume the backchannel is dead
***REMOVED*** when we are slow to receive data. Number in bytes.
***REMOVED***
***REMOVED*** Assumption: The worst bandwidth we work on is 50 kilobits/sec
***REMOVED*** 50kbits/sec***REMOVED*** (1 byte / 8 bits)***REMOVED*** 6 sec dead backchannel timeout
***REMOVED*** @type {number}
***REMOVED***
WebChannelBase.OUTSTANDING_DATA_BACKCHANNEL_RETRY_CUTOFF = 37500;


***REMOVED***
***REMOVED*** @return {!ForwardChannelRequestPool} The forward channel request pool.
***REMOVED***
WebChannelBase.prototype.getForwardChannelRequestPool = function() {
  return this.forwardChannelRequestPool_;
***REMOVED***


***REMOVED***
***REMOVED*** @return {!Object} The codec object, to be used for the test channel.
***REMOVED***
WebChannelBase.prototype.getWireCodec = function() {
  return this.wireCodec_;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the logger.
***REMOVED***
***REMOVED*** @return {!WebChannelDebug} The channel debug object.
***REMOVED***
WebChannelBase.prototype.getChannelDebug = function() {
  return this.channelDebug_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the logger.
***REMOVED***
***REMOVED*** @param {!WebChannelDebug} channelDebug The channel debug object.
***REMOVED***
WebChannelBase.prototype.setChannelDebug = function(channelDebug) {
  this.channelDebug_ = channelDebug;
***REMOVED***


***REMOVED***
***REMOVED*** Starts the channel. This initiates connections to the server.
***REMOVED***
***REMOVED*** @param {string} testPath  The path for the test connection.
***REMOVED*** @param {string} channelPath  The path for the channel connection.
***REMOVED*** @param {!Object=} opt_extraParams Extra parameter keys and values to add to
***REMOVED***     the requests.
***REMOVED*** @param {string=} opt_oldSessionId  Session ID from a previous session.
***REMOVED*** @param {number=} opt_oldArrayId  The last array ID from a previous session.
***REMOVED***
WebChannelBase.prototype.connect = function(testPath, channelPath,
    opt_extraParams, opt_oldSessionId, opt_oldArrayId) {
  this.channelDebug_.debug('connect()');

  requestStats.notifyStatEvent(requestStats.Stat.CONNECT_ATTEMPT);

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
WebChannelBase.prototype.disconnect = function() {
  this.channelDebug_.debug('disconnect()');

  this.cancelRequests_();

  if (this.state_ == WebChannelBase.State.OPENED) {
    var rid = this.nextRid_++;
    var uri = this.forwardChannelUri_.clone();
    uri.setParameterValue('SID', this.sid_);
    uri.setParameterValue('RID', rid);
    uri.setParameterValue('TYPE', 'terminate');

    // Add the reconnect parameters.
    this.addAdditionalParams_(uri);

    var request = ChannelRequest.createChannelRequest(
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
WebChannelBase.prototype.getSessionId = function() {
  return this.sid_;
***REMOVED***


***REMOVED***
***REMOVED*** Starts the test channel to determine network conditions.
***REMOVED***
***REMOVED*** @param {string} testPath  The relative PATH for the test connection.
***REMOVED*** @private
***REMOVED***
WebChannelBase.prototype.connectTest_ = function(testPath) {
  this.channelDebug_.debug('connectTest_()');
  if (!this.okToMakeRequest_()) {
    return; // channel is cancelled
  }
  this.connectionTest_ = new BaseTestChannel(this, this.channelDebug_);
  this.connectionTest_.setExtraHeaders(this.extraHeaders_);
  this.connectionTest_.connect(testPath);
***REMOVED***


***REMOVED***
***REMOVED*** Starts the regular channel which is run after the test channel is complete.
***REMOVED*** @private
***REMOVED***
WebChannelBase.prototype.connectChannel_ = function() {
  this.channelDebug_.debug('connectChannel_()');
  this.ensureInState_(WebChannelBase.State.INIT, WebChannelBase.State.CLOSED);
  this.forwardChannelUri_ =
      this.getForwardChannelUri(***REMOVED*** @type {string}***REMOVED*** (this.path_));
  this.ensureForwardChannel_();
***REMOVED***


***REMOVED***
***REMOVED*** Cancels all outstanding requests.
***REMOVED*** @private
***REMOVED***
WebChannelBase.prototype.cancelRequests_ = function() {
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

  this.forwardChannelRequestPool_.cancel();

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
WebChannelBase.prototype.getExtraHeaders = function() {
  return this.extraHeaders_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets extra HTTP headers to add to all the requests sent to the server.
***REMOVED***
***REMOVED*** @param {Object} extraHeaders The HTTP headers, or null.
***REMOVED***
WebChannelBase.prototype.setExtraHeaders = function(extraHeaders) {
  this.extraHeaders_ = extraHeaders;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the throttle for handling onreadystatechange events for the request.
***REMOVED***
***REMOVED*** @param {number} throttle The throttle in ms.  A value of zero indicates
***REMOVED***     no throttle.
***REMOVED***
WebChannelBase.prototype.setReadyStateChangeThrottle = function(throttle) {
  this.readyStateChangeThrottleMs_ = throttle;
***REMOVED***


***REMOVED***
***REMOVED*** Sets whether cross origin requests are supported for the channel.
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
WebChannelBase.prototype.setSupportsCrossDomainXhrs =
    function(supportCrossDomain) {
  this.supportsCrossDomainXhrs_ = supportCrossDomain;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the handler used for channel callback events.
***REMOVED***
***REMOVED*** @return {WebChannelBase.Handler} The handler.
***REMOVED***
WebChannelBase.prototype.getHandler = function() {
  return this.handler_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the handler used for channel callback events.
***REMOVED*** @param {WebChannelBase.Handler} handler The handler to set.
***REMOVED***
WebChannelBase.prototype.setHandler = function(handler) {
  this.handler_ = handler;
***REMOVED***


***REMOVED***
***REMOVED*** Returns whether the channel allows the use of a subdomain. There may be
***REMOVED*** cases where this isn't allowed.
***REMOVED*** @return {boolean} Whether a host prefix is allowed.
***REMOVED***
WebChannelBase.prototype.getAllowHostPrefix = function() {
  return this.allowHostPrefix_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets whether the channel allows the use of a subdomain. There may be cases
***REMOVED*** where this isn't allowed, for example, logging in with troutboard where
***REMOVED*** using a subdomain causes Apache to force the user to authenticate twice.
***REMOVED*** @param {boolean} allowHostPrefix Whether a host prefix is allowed.
***REMOVED***
WebChannelBase.prototype.setAllowHostPrefix = function(allowHostPrefix) {
  this.allowHostPrefix_ = allowHostPrefix;
***REMOVED***


***REMOVED***
***REMOVED*** Returns whether the channel is buffered or not. This state is valid for
***REMOVED*** querying only after the test connection has completed. This may be
***REMOVED*** queried in the WebChannelBase.okToMakeRequest() callback.
***REMOVED*** A channel may be buffered if the test connection determines that
***REMOVED*** a chunked response could not be sent down within a suitable time.
***REMOVED*** @return {boolean} Whether the channel is buffered.
***REMOVED***
WebChannelBase.prototype.isBuffered = function() {
  return !this.useChunked_;
***REMOVED***


***REMOVED***
***REMOVED*** Returns whether chunked mode is allowed. In certain debugging situations,
***REMOVED*** it's useful for the application to have a way to disable chunked mode for a
***REMOVED*** user.

***REMOVED*** @return {boolean} Whether chunked mode is allowed.
***REMOVED***
WebChannelBase.prototype.getAllowChunkedMode = function() {
  return this.allowChunkedMode_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets whether chunked mode is allowed. In certain debugging situations, it's
***REMOVED*** useful for the application to have a way to disable chunked mode for a user.
***REMOVED*** @param {boolean} allowChunkedMode  Whether chunked mode is allowed.
***REMOVED***
WebChannelBase.prototype.setAllowChunkedMode = function(allowChunkedMode) {
  this.allowChunkedMode_ = allowChunkedMode;
***REMOVED***


***REMOVED***
***REMOVED*** Sends a request to the server. The format of the request is a Map data
***REMOVED*** structure of key/value pairs. These maps are then encoded in a format
***REMOVED*** suitable for the wire and then reconstituted as a Map data structure that
***REMOVED*** the server can process.
***REMOVED*** @param {!Object|!goog.structs.Map} map The map to send.
***REMOVED*** @param {!Object=} opt_context The context associated with the map.
***REMOVED***
WebChannelBase.prototype.sendMap = function(map, opt_context) {
  goog.asserts.assert(this.state_ != WebChannelBase.State.CLOSED,
      'Invalid operation: sending map when state is closed');

  // We can only send 1000 maps per POST, but typically we should never have
  // that much to send, so warn if we exceed that (we still send all the maps).
  if (this.outgoingMaps_.length == WebChannelBase.MAX_MAPS_PER_REQUEST_) {
    // severe() is temporary so that we get these uploaded and can figure out
    // what's causing them. Afterwards can change to warning().
    this.channelDebug_.severe(
        'Already have ' + WebChannelBase.MAX_MAPS_PER_REQUEST_ +
        ' queued maps upon queueing ' + goog.json.serialize(map));
  }

  this.outgoingMaps_.push(
      new Wire.QueuedMap(this.nextMapId_++, map, opt_context));
  if (this.state_ == WebChannelBase.State.OPENING ||
      this.state_ == WebChannelBase.State.OPENED) {
    this.ensureForwardChannel_();
  }
***REMOVED***


***REMOVED***
***REMOVED*** When set to true, this changes the behavior of the forward channel so it
***REMOVED*** will not retry requests; it will fail after one network failure, and if
***REMOVED*** there was already one network failure, the request will fail immediately.
***REMOVED*** @param {boolean} failFast  Whether or not to fail fast.
***REMOVED***
WebChannelBase.prototype.setFailFast = function(failFast) {
  this.failFast_ = failFast;
  this.channelDebug_.info('setFailFast: ' + failFast);
  if ((this.forwardChannelRequestPool_.hasPendingRequest() ||
       this.forwardChannelTimerId_) &&
      this.forwardChannelRetryCount_ > this.getForwardChannelMaxRetries()) {
    this.channelDebug_.info(
        'Retry count ' + this.forwardChannelRetryCount_ +
        ' > new maxRetries ' + this.getForwardChannelMaxRetries() +
        '. Fail immediately!');

    if (!this.forwardChannelRequestPool_.forceComplete(
        goog.bind(this.onRequestComplete, this))) {
      // i.e., this.forwardChannelTimerId_
      goog.global.clearTimeout(this.forwardChannelTimerId_);
      this.forwardChannelTimerId_ = null;
      // The error code from the last failed request is gone, so just use a
      // generic one.
      this.signalError_(WebChannelBase.Error.REQUEST_FAILED);
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** @return {number} The max number of forward-channel retries, which will be 0
***REMOVED*** in fail-fast mode.
***REMOVED***
WebChannelBase.prototype.getForwardChannelMaxRetries = function() {
  return this.failFast_ ? 0 : this.forwardChannelMaxRetries_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the maximum number of attempts to connect to the server for forward
***REMOVED*** channel requests.
***REMOVED*** @param {number} retries The maximum number of attempts.
***REMOVED***
WebChannelBase.prototype.setForwardChannelMaxRetries = function(retries) {
  this.forwardChannelMaxRetries_ = retries;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the timeout for a forward channel request.
***REMOVED*** @param {number} timeoutMs The timeout in milliseconds.
***REMOVED***
WebChannelBase.prototype.setForwardChannelRequestTimeout = function(timeoutMs) {
  this.forwardChannelRequestTimeoutMs_ = timeoutMs;
***REMOVED***


***REMOVED***
***REMOVED*** @return {number} The max number of back-channel retries, which is a constant.
***REMOVED***
WebChannelBase.prototype.getBackChannelMaxRetries = function() {
  // Back-channel retries is a constant.
  return WebChannelBase.BACK_CHANNEL_MAX_RETRIES;
***REMOVED***


***REMOVED***
***REMOVED*** @override
***REMOVED***
WebChannelBase.prototype.isClosed = function() {
  return this.state_ == WebChannelBase.State.CLOSED;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the channel state.
***REMOVED*** @return {WebChannelBase.State} The current state of the channel.
***REMOVED***
WebChannelBase.prototype.getState = function() {
  return this.state_;
***REMOVED***


***REMOVED***
***REMOVED*** Return the last status code received for a request.
***REMOVED*** @return {number} The last status code received for a request.
***REMOVED***
WebChannelBase.prototype.getLastStatusCode = function() {
  return this.lastStatusCode_;
***REMOVED***


***REMOVED***
***REMOVED*** @return {number} The last array id received.
***REMOVED***
WebChannelBase.prototype.getLastArrayId = function() {
  return this.lastArrayId_;
***REMOVED***


***REMOVED***
***REMOVED*** Returns whether there are outstanding requests servicing the channel.
***REMOVED*** @return {boolean} true if there are outstanding requests.
***REMOVED***
WebChannelBase.prototype.hasOutstandingRequests = function() {
  return this.getOutstandingRequests_() != 0;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the number of outstanding requests.
***REMOVED*** @return {number} The number of outstanding requests to the server.
***REMOVED*** @private
***REMOVED***
WebChannelBase.prototype.getOutstandingRequests_ = function() {
  var count = 0;
  if (this.backChannelRequest_) {
    count++;
  }
  count += this.forwardChannelRequestPool_.getRequestCount();
  return count;
***REMOVED***


***REMOVED***
***REMOVED*** Ensures that a forward channel request is scheduled.
***REMOVED*** @private
***REMOVED***
WebChannelBase.prototype.ensureForwardChannel_ = function() {
  if (this.forwardChannelRequestPool_.isFull()) {
    // enough connection in process - no need to start a new request
    return;
  }

  if (this.forwardChannelTimerId_) {
    // no need to start a new request - one is already scheduled
    return;
  }

  this.forwardChannelTimerId_ = requestStats.setTimeout(
      goog.bind(this.onStartForwardChannelTimer_, this), 0);
  this.forwardChannelRetryCount_ = 0;
***REMOVED***


***REMOVED***
***REMOVED*** Schedules a forward-channel retry for the specified request, unless the max
***REMOVED*** retries has been reached.
***REMOVED*** @param {ChannelRequest} request The failed request to retry.
***REMOVED*** @return {boolean} true iff a retry was scheduled.
***REMOVED*** @private
***REMOVED***
WebChannelBase.prototype.maybeRetryForwardChannel_ =
    function(request) {
  if (this.forwardChannelRequestPool_.isFull() || this.forwardChannelTimerId_) {
    // Should be impossible to be called in this state.
    this.channelDebug_.severe('Request already in progress');
    return false;
  }

  if (this.state_ == WebChannelBase.State.INIT ||  // no retry open_()
      (this.forwardChannelRetryCount_ >= this.getForwardChannelMaxRetries())) {
    return false;
  }

  this.channelDebug_.debug('Going to retry POST');

  this.forwardChannelTimerId_ = requestStats.setTimeout(
      goog.bind(this.onStartForwardChannelTimer_, this, request),
      this.getRetryTime_(this.forwardChannelRetryCount_));
  this.forwardChannelRetryCount_++;
  return true;
***REMOVED***


***REMOVED***
***REMOVED*** Timer callback for ensureForwardChannel
***REMOVED*** @param {ChannelRequest=} opt_retryRequest A failed request
***REMOVED*** to retry.
***REMOVED*** @private
***REMOVED***
WebChannelBase.prototype.onStartForwardChannelTimer_ = function(
    opt_retryRequest) {
  this.forwardChannelTimerId_ = null;
  this.startForwardChannel_(opt_retryRequest);
***REMOVED***


***REMOVED***
***REMOVED*** Begins a new forward channel operation to the server.
***REMOVED*** @param {ChannelRequest=} opt_retryRequest A failed request to retry.
***REMOVED*** @private
***REMOVED***
WebChannelBase.prototype.startForwardChannel_ = function(
    opt_retryRequest) {
  this.channelDebug_.debug('startForwardChannel_');
  if (!this.okToMakeRequest_()) {
    return; // channel is cancelled
  } else if (this.state_ == WebChannelBase.State.INIT) {
    if (opt_retryRequest) {
      this.channelDebug_.severe('Not supposed to retry the open');
      return;
    }
    this.open_();
    this.state_ = WebChannelBase.State.OPENING;
  } else if (this.state_ == WebChannelBase.State.OPENED) {
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

    if (this.forwardChannelRequestPool_.isFull()) {
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
WebChannelBase.prototype.open_ = function() {
  this.channelDebug_.debug('open_()');
  this.nextRid_ = Math.floor(Math.random()***REMOVED*** 100000);

  var rid = this.nextRid_++;
  var request = ChannelRequest.createChannelRequest(
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

  this.forwardChannelRequestPool_.addRequest(request);
  request.xmlHttpPost(uri, requestText, true);
***REMOVED***


***REMOVED***
***REMOVED*** Makes a forward channel request using XMLHTTP.
***REMOVED*** @param {!ChannelRequest=} opt_retryRequest A failed request to retry.
***REMOVED*** @private
***REMOVED***
WebChannelBase.prototype.makeForwardChannelRequest_ =
    function(opt_retryRequest) {
  var rid;
  var requestText;
  if (opt_retryRequest) {
    this.requeuePendingMaps_();
    rid = this.nextRid_ - 1;  // Must use last RID
    requestText = this.dequeueOutgoingMaps_();
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

  var request = ChannelRequest.createChannelRequest(this, this.channelDebug_,
      this.sid_, rid, this.forwardChannelRetryCount_ + 1);
  request.setExtraHeaders(this.extraHeaders_);

  // Randomize from 50%-100% of the forward channel timeout to avoid
  // a big hit if servers happen to die at once.
  request.setTimeout(
      Math.round(this.forwardChannelRequestTimeoutMs_***REMOVED*** 0.50) +
      Math.round(this.forwardChannelRequestTimeoutMs_***REMOVED*** 0.50***REMOVED*** Math.random()));
  this.forwardChannelRequestPool_.addRequest(request);
  request.xmlHttpPost(uri, requestText, true);
***REMOVED***


***REMOVED***
***REMOVED*** Adds the additional parameters from the handler to the given URI.
***REMOVED*** @param {!goog.Uri} uri The URI to add the parameters to.
***REMOVED*** @private
***REMOVED***
WebChannelBase.prototype.addAdditionalParams_ = function(uri) {
  // Add the additional reconnect parameters as needed.
  if (this.handler_) {
    var params = this.handler_.getAdditionalParams(this);
    if (params) {
      goog.structs.forEach(params, function(value, key, coll) {
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
WebChannelBase.prototype.dequeueOutgoingMaps_ = function() {
  var count = Math.min(this.outgoingMaps_.length,
                       WebChannelBase.MAX_MAPS_PER_REQUEST_);
  var badMapHandler = this.handler_ ?
      goog.bind(this.handler_.badMapError, this.handler_, this) : null;
  var result = this.wireCodec_.encodeMessageQueue(
      this.outgoingMaps_, count, badMapHandler);
  this.pendingMaps_ = this.pendingMaps_.concat(
      this.outgoingMaps_.splice(0, count));
  return result;
***REMOVED***


***REMOVED***
***REMOVED*** Requeues unacknowledged sent arrays for retransmission in the next forward
***REMOVED*** channel request.
***REMOVED*** @private
***REMOVED***
WebChannelBase.prototype.requeuePendingMaps_ = function() {
  this.outgoingMaps_ = this.pendingMaps_.concat(this.outgoingMaps_);
  this.pendingMaps_.length = 0;
***REMOVED***


***REMOVED***
***REMOVED*** Ensures there is a backchannel request for receiving data from the server.
***REMOVED*** @private
***REMOVED***
WebChannelBase.prototype.ensureBackChannel_ = function() {
  if (this.backChannelRequest_) {
    // already have one
    return;
  }

  if (this.backChannelTimerId_) {
    // no need to start a new request - one is already scheduled
    return;
  }

  this.backChannelAttemptId_ = 1;
  this.backChannelTimerId_ = requestStats.setTimeout(
      goog.bind(this.onStartBackChannelTimer_, this), 0);
  this.backChannelRetryCount_ = 0;
***REMOVED***


***REMOVED***
***REMOVED*** Schedules a back-channel retry, unless the max retries has been reached.
***REMOVED*** @return {boolean} true iff a retry was scheduled.
***REMOVED*** @private
***REMOVED***
WebChannelBase.prototype.maybeRetryBackChannel_ = function() {
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
  this.backChannelTimerId_ = requestStats.setTimeout(
      goog.bind(this.onStartBackChannelTimer_, this),
      this.getRetryTime_(this.backChannelRetryCount_));
  this.backChannelRetryCount_++;
  return true;
***REMOVED***


***REMOVED***
***REMOVED*** Timer callback for ensureBackChannel_.
***REMOVED*** @private
***REMOVED***
WebChannelBase.prototype.onStartBackChannelTimer_ = function() {
  this.backChannelTimerId_ = null;
  this.startBackChannel_();
***REMOVED***


***REMOVED***
***REMOVED*** Begins a new back channel operation to the server.
***REMOVED*** @private
***REMOVED***
WebChannelBase.prototype.startBackChannel_ = function() {
  if (!this.okToMakeRequest_()) {
    // channel is cancelled
    return;
  }

  this.channelDebug_.debug('Creating new HttpRequest');
  this.backChannelRequest_ = ChannelRequest.createChannelRequest(this,
      this.channelDebug_, this.sid_, 'rpc', this.backChannelAttemptId_);
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

  if (!ChannelRequest.supportsXhrStreaming()) {
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
WebChannelBase.prototype.okToMakeRequest_ = function() {
  if (this.handler_) {
    var result = this.handler_.okToMakeRequest(this);
    if (result != WebChannelBase.Error.OK) {
      this.channelDebug_.debug(
          'Handler returned error code from okToMakeRequest');
      this.signalError_(result);
      return false;
    }
  }
  return true;
***REMOVED***


***REMOVED***
***REMOVED*** @override
***REMOVED***
WebChannelBase.prototype.testConnectionFinished =
    function(testChannel, useChunked) {
  this.channelDebug_.debug('Test Connection Finished');

  // Forward channel will not be used prior to this method is called
  var clientProtocol = testChannel.getClientProtocol();
  if (clientProtocol) {
    this.forwardChannelRequestPool_.applyClientProtocol(clientProtocol);
  }

  this.useChunked_ = this.allowChunkedMode_ && useChunked;
  this.lastStatusCode_ = testChannel.getLastStatusCode();

  this.connectChannel_();
***REMOVED***


***REMOVED***
***REMOVED*** @override
***REMOVED***
WebChannelBase.prototype.testConnectionFailure =
    function(testChannel, errorCode) {
  this.channelDebug_.debug('Test Connection Failed');
  this.lastStatusCode_ = testChannel.getLastStatusCode();
  this.signalError_(WebChannelBase.Error.REQUEST_FAILED);
***REMOVED***


***REMOVED***
***REMOVED*** @override
***REMOVED***
WebChannelBase.prototype.onRequestData = function(request, responseText) {
  if (this.state_ == WebChannelBase.State.CLOSED ||
      (this.backChannelRequest_ != request &&
       !this.forwardChannelRequestPool_.hasRequest(request))) {
    // either CLOSED or a request we don't know about (perhaps an old request)
    return;
  }
  this.lastStatusCode_ = request.getLastStatusCode();

  if (this.forwardChannelRequestPool_.hasRequest(request) &&
      this.state_ == WebChannelBase.State.OPENED) {
    var response;
    try {
      response = this.wireCodec_.decodeMessage(responseText);
    } catch (ex) {
      response = null;
    }
    if (goog.isArray(response) && response.length == 3) {
      this.handlePostResponse_(***REMOVED*** @type {!Array}***REMOVED*** (response), request);
    } else {
      this.channelDebug_.debug('Bad POST response data returned');
      this.signalError_(WebChannelBase.Error.BAD_RESPONSE);
    }
  } else {
    if (this.backChannelRequest_ == request) {
      this.clearDeadBackchannelTimer_();
    }
    if (!goog.string.isEmpty(responseText)) {
      var response = this.wireCodec_.decodeMessage(responseText);
      this.onInput_(***REMOVED*** @type {!Array}***REMOVED*** (response));
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** Handles a POST response from the server.
***REMOVED*** @param {Array} responseValues The key value pairs in the POST response.
***REMOVED*** @param {!ChannelRequest} forwardReq The forward channel request that
***REMOVED*** triggers this function call.
***REMOVED*** @private
***REMOVED***
WebChannelBase.prototype.handlePostResponse_ = function(
    responseValues, forwardReq) {
  // The first response value is set to 0 if server is missing backchannel.
  if (responseValues[0] == 0) {
    this.handleBackchannelMissing_(forwardReq);
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
      this.deadBackChannelTimerId_ = requestStats.setTimeout(
          goog.bind(this.onBackChannelDead_, this),
          2***REMOVED*** WebChannelBase.RTT_ESTIMATE);
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** Handles a POST response from the server telling us that it has detected that
***REMOVED*** we have no hanging GET connection.
***REMOVED*** @param {!ChannelRequest} forwardReq The forward channel request that
***REMOVED*** triggers this function call.
***REMOVED*** @private
***REMOVED***
WebChannelBase.prototype.handleBackchannelMissing_ = function(forwardReq) {
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
      WebChannelBase.RTT_ESTIMATE < forwardReq.getRequestStartTime()) {
    this.clearDeadBackchannelTimer_();
    this.backChannelRequest_.cancel();
    this.backChannelRequest_ = null;
  } else {
    return;
  }
  this.maybeRetryBackChannel_();
  requestStats.notifyStatEvent(requestStats.Stat.BACKCHANNEL_MISSING);
***REMOVED***


***REMOVED***
***REMOVED*** Determines whether we should start the process of retrying a possibly
***REMOVED*** dead backchannel.
***REMOVED*** @param {number} outstandingBytes The number of bytes for which the server has
***REMOVED***     not yet received acknowledgement.
***REMOVED*** @return {boolean} Whether to start the backchannel retry timer.
***REMOVED*** @private
***REMOVED***
WebChannelBase.prototype.shouldRetryBackChannel_ = function(
    outstandingBytes) {
  // Not too many outstanding bytes, not buffered and not after a retry.
  return outstandingBytes <
      WebChannelBase.OUTSTANDING_DATA_BACKCHANNEL_RETRY_CUTOFF &&
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
***REMOVED*** @override
***REMOVED***
WebChannelBase.prototype.correctHostPrefix = function(serverHostPrefix) {
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
WebChannelBase.prototype.onBackChannelDead_ = function() {
  if (goog.isDefAndNotNull(this.deadBackChannelTimerId_)) {
    this.deadBackChannelTimerId_ = null;
    this.backChannelRequest_.cancel();
    this.backChannelRequest_ = null;
    this.maybeRetryBackChannel_();
    requestStats.notifyStatEvent(requestStats.Stat.BACKCHANNEL_DEAD);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Clears the timer that indicates that our backchannel is no longer able to
***REMOVED*** successfully receive data from the server.
***REMOVED*** @private
***REMOVED***
WebChannelBase.prototype.clearDeadBackchannelTimer_ = function() {
  if (goog.isDefAndNotNull(this.deadBackChannelTimerId_)) {
    goog.global.clearTimeout(this.deadBackChannelTimerId_);
    this.deadBackChannelTimerId_ = null;
  }
***REMOVED***


***REMOVED***
***REMOVED*** Returns whether or not the given error/status combination is fatal or not.
***REMOVED*** On fatal errors we immediately close the session rather than retrying the
***REMOVED*** failed request.
***REMOVED*** @param {?ChannelRequest.Error} error The error code for the
***REMOVED*** failed request.
***REMOVED*** @param {number} statusCode The last HTTP status code.
***REMOVED*** @return {boolean} Whether or not the error is fatal.
***REMOVED*** @private
***REMOVED***
WebChannelBase.isFatalError_ = function(error, statusCode) {
  return error == ChannelRequest.Error.UNKNOWN_SESSION_ID ||
      error == ChannelRequest.Error.ACTIVE_X_BLOCKED ||
      (error == ChannelRequest.Error.STATUS &&
       statusCode > 0);
***REMOVED***


***REMOVED***
***REMOVED*** @override
***REMOVED***
WebChannelBase.prototype.onRequestComplete = function(request) {
  this.channelDebug_.debug('Request complete');
  var type;
  if (this.backChannelRequest_ == request) {
    this.clearDeadBackchannelTimer_();
    this.backChannelRequest_ = null;
    type = WebChannelBase.ChannelType_.BACK_CHANNEL;
  } else if (this.forwardChannelRequestPool_.hasRequest(request)) {
    this.forwardChannelRequestPool_.removeRequest(request);
    type = WebChannelBase.ChannelType_.FORWARD_CHANNEL;
  } else {
    // return if it was an old request from a previous session
    return;
  }

  this.lastStatusCode_ = request.getLastStatusCode();

  if (this.state_ == WebChannelBase.State.CLOSED) {
    return;
  }

  if (request.getSuccess()) {
    // Yay!
    if (type == WebChannelBase.ChannelType_.FORWARD_CHANNEL) {
      var size = request.getPostData() ? request.getPostData().length : 0;
      requestStats.notifyTimingEvent(size,
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
  if (!WebChannelBase.isFatalError_(lastError, this.lastStatusCode_)) {
    // Maybe retry.
    this.channelDebug_.debug('Maybe retrying, last error: ' +
        ChannelRequest.errorStringFromCode(lastError, this.lastStatusCode_));
    if (type == WebChannelBase.ChannelType_.FORWARD_CHANNEL) {
      if (this.maybeRetryForwardChannel_(request)) {
        return;
      }
    }
    if (type == WebChannelBase.ChannelType_.BACK_CHANNEL) {
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
    case ChannelRequest.Error.NO_DATA:
      this.signalError_(WebChannelBase.Error.NO_DATA);
      break;
    case ChannelRequest.Error.BAD_DATA:
      this.signalError_(WebChannelBase.Error.BAD_DATA);
      break;
    case ChannelRequest.Error.UNKNOWN_SESSION_ID:
      this.signalError_(WebChannelBase.Error.UNKNOWN_SESSION_ID);
      break;
    case ChannelRequest.Error.ACTIVE_X_BLOCKED:
      this.signalError_(WebChannelBase.Error.ACTIVE_X_BLOCKED);
      break;
    default:
      this.signalError_(WebChannelBase.Error.REQUEST_FAILED);
      break;
  }
***REMOVED***


***REMOVED***
***REMOVED*** @param {number} retryCount Number of retries so far.
***REMOVED*** @return {number} Time in ms before firing next retry request.
***REMOVED*** @private
***REMOVED***
WebChannelBase.prototype.getRetryTime_ = function(retryCount) {
  var retryTime = this.baseRetryDelayMs_ +
      Math.floor(Math.random()***REMOVED*** this.retryDelaySeedMs_);
  if (!this.isActive()) {
    this.channelDebug_.debug('Inactive channel');
    retryTime =
        retryTime***REMOVED*** WebChannelBase.INACTIVE_CHANNEL_RETRY_FACTOR;
  }
  // Backoff for subsequent retries
  retryTime***REMOVED***= retryCount;
  return retryTime;
***REMOVED***


***REMOVED***
***REMOVED*** @param {number} baseDelayMs The base part of the retry delay, in ms.
***REMOVED*** @param {number} delaySeedMs A random delay between 0 and this is added to
***REMOVED***     the base part.
***REMOVED***
WebChannelBase.prototype.setRetryDelay = function(baseDelayMs, delaySeedMs) {
  this.baseRetryDelayMs_ = baseDelayMs;
  this.retryDelaySeedMs_ = delaySeedMs;
***REMOVED***


***REMOVED***
***REMOVED*** Processes the data returned by the server.
***REMOVED*** @param {!Array.<!Array>} respArray The response array returned by the server.
***REMOVED*** @private
***REMOVED***
WebChannelBase.prototype.onInput_ = function(respArray) {
  var batch = this.handler_ && this.handler_.channelHandleMultipleArrays ?
      [] : null;
  for (var i = 0; i < respArray.length; i++) {
    var nextArray = respArray[i];
    this.lastArrayId_ = nextArray[0];
    nextArray = nextArray[1];
    if (this.state_ == WebChannelBase.State.OPENING) {
      if (nextArray[0] == 'c') {
        this.sid_ = nextArray[1];
        this.hostPrefix_ = this.correctHostPrefix(nextArray[2]);
        var negotiatedVersion = nextArray[3];
        if (goog.isDefAndNotNull(negotiatedVersion)) {
          this.channelVersion_ = negotiatedVersion;
        }
        this.state_ = WebChannelBase.State.OPENED;
        if (this.handler_) {
          this.handler_.channelOpened(this);
        }
        this.backChannelUri_ = this.getBackChannelUri(
            this.hostPrefix_,***REMOVED*****REMOVED*** @type {string}***REMOVED*** (this.path_));
        // Open connection to receive data
        this.ensureBackChannel_();
      } else if (nextArray[0] == 'stop') {
        this.signalError_(WebChannelBase.Error.STOP);
      }
    } else if (this.state_ == WebChannelBase.State.OPENED) {
      if (nextArray[0] == 'stop') {
        if (batch && !goog.array.isEmpty(batch)) {
          this.handler_.channelHandleMultipleArrays(this, batch);
          batch.length = 0;
        }
        this.signalError_(WebChannelBase.Error.STOP);
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
***REMOVED*** Helper to ensure the channel is in the expected state.
***REMOVED*** @param {...number} var_args The channel must be in one of the indicated
***REMOVED***     states.
***REMOVED*** @private
***REMOVED***
WebChannelBase.prototype.ensureInState_ = function(var_args) {
  goog.asserts.assert(goog.array.contains(arguments, this.state_),
      'Unexpected channel state: %s', this.state_);
***REMOVED***


***REMOVED***
***REMOVED*** Signals an error has occurred.
***REMOVED*** @param {WebChannelBase.Error} error The error code for the failure.
***REMOVED*** @private
***REMOVED***
WebChannelBase.prototype.signalError_ = function(error) {
  this.channelDebug_.info('Error code ' + error);
  if (error == WebChannelBase.Error.REQUEST_FAILED) {
    // Create a separate Internet connection to check
    // if it's a server error or user's network error.
    var imageUri = null;
    if (this.handler_) {
      imageUri = this.handler_.getNetworkTestImageUri(this);
    }
    netUtils.testNetwork(goog.bind(this.testNetworkCallback_, this), imageUri);
  } else {
    requestStats.notifyStatEvent(requestStats.Stat.ERROR_OTHER);
  }
  this.onError_(error);
***REMOVED***


***REMOVED***
***REMOVED*** Callback for netUtils.testNetwork during error handling.
***REMOVED*** @param {boolean} networkUp Whether the network is up.
***REMOVED*** @private
***REMOVED***
WebChannelBase.prototype.testNetworkCallback_ = function(networkUp) {
  if (networkUp) {
    this.channelDebug_.info('Successfully pinged google.com');
    requestStats.notifyStatEvent(requestStats.Stat.ERROR_OTHER);
  } else {
    this.channelDebug_.info('Failed to ping google.com');
    requestStats.notifyStatEvent(requestStats.Stat.ERROR_NETWORK);
    // We call onError_ here instead of signalError_ because the latter just
    // calls notifyStatEvent, and we don't want to have another stat event.
    this.onError_(WebChannelBase.Error.NETWORK);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Called when messages have been successfully sent from the queue.
***REMOVED*** @private
***REMOVED***
WebChannelBase.prototype.onSuccess_ = function() {
  // TODO(user): optimize for request pool (>1)
  if (this.handler_) {
    this.handler_.channelSuccess(this, this.pendingMaps_);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Called when we've determined the final error for a channel. It closes the
***REMOVED*** notifiers the handler of the error and closes the channel.
***REMOVED*** @param {WebChannelBase.Error} error  The error code for the failure.
***REMOVED*** @private
***REMOVED***
WebChannelBase.prototype.onError_ = function(error) {
  this.channelDebug_.debug('HttpChannel: error - ' + error);
  this.state_ = WebChannelBase.State.CLOSED;
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
WebChannelBase.prototype.onClose_ = function() {
  this.state_ = WebChannelBase.State.CLOSED;
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

      this.handler_.channelClosed(this, copyOfPendingMaps,
          copyOfUndeliveredMaps);
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** @override
***REMOVED***
WebChannelBase.prototype.getForwardChannelUri = function(path) {
  var uri = this.createDataUri(null, path);
  this.channelDebug_.debug('GetForwardChannelUri: ' + uri);
  return uri;
***REMOVED***


***REMOVED***
***REMOVED*** @override
***REMOVED***
WebChannelBase.prototype.getConnectionState = function() {
  return this.ConnState_;
***REMOVED***


***REMOVED***
***REMOVED*** @override
***REMOVED***
WebChannelBase.prototype.getBackChannelUri = function(hostPrefix, path) {
  var uri = this.createDataUri(this.shouldUseSecondaryDomains() ?
      hostPrefix : null, path);
  this.channelDebug_.debug('GetBackChannelUri: ' + uri);
  return uri;
***REMOVED***


***REMOVED***
***REMOVED*** @override
***REMOVED***
WebChannelBase.prototype.createDataUri =
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
***REMOVED*** @override
***REMOVED***
WebChannelBase.prototype.createXhrIo = function(hostPrefix) {
  if (hostPrefix && !this.supportsCrossDomainXhrs_) {
    throw Error('Can\'t create secondary domain capable XhrIo object.');
  }
***REMOVED***
  xhr.setWithCredentials(this.supportsCrossDomainXhrs_);
  return xhr;
***REMOVED***


***REMOVED***
***REMOVED*** @override
***REMOVED***
WebChannelBase.prototype.isActive = function() {
  return !!this.handler_ && this.handler_.isActive(this);
***REMOVED***


***REMOVED***
***REMOVED*** @override
***REMOVED***
WebChannelBase.prototype.shouldUseSecondaryDomains = function() {
  return this.supportsCrossDomainXhrs_ ||
      !ChannelRequest.supportsXhrStreaming();
***REMOVED***


***REMOVED***
***REMOVED*** A LogSaver that can be used to accumulate all the debug logs so they
***REMOVED*** can be sent to the server when a problem is detected.
***REMOVED***
WebChannelBase.LogSaver = {***REMOVED***


***REMOVED***
***REMOVED*** Buffer for accumulating the debug log
***REMOVED*** @type {goog.structs.CircularBuffer}
***REMOVED*** @private
***REMOVED***
WebChannelBase.LogSaver.buffer_ = new goog.structs.CircularBuffer(1000);


***REMOVED***
***REMOVED*** Whether we're currently accumulating the debug log.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
WebChannelBase.LogSaver.enabled_ = false;


***REMOVED***
***REMOVED*** Formatter for saving logs.
***REMOVED*** @type {goog.debug.Formatter}
***REMOVED*** @private
***REMOVED***
WebChannelBase.LogSaver.formatter_ = new goog.debug.TextFormatter();


***REMOVED***
***REMOVED*** Returns whether the LogSaver is enabled.
***REMOVED*** @return {boolean} Whether saving is enabled or disabled.
***REMOVED***
WebChannelBase.LogSaver.isEnabled = function() {
  return WebChannelBase.LogSaver.enabled_;
***REMOVED***


***REMOVED***
***REMOVED*** Enables of disables the LogSaver.
***REMOVED*** @param {boolean} enable Whether to enable or disable saving.
***REMOVED***
WebChannelBase.LogSaver.setEnabled = function(enable) {
  if (enable == WebChannelBase.LogSaver.enabled_) {
    return;
  }

  var fn = WebChannelBase.LogSaver.addLogRecord;
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
WebChannelBase.LogSaver.addLogRecord = function(logRecord) {
  WebChannelBase.LogSaver.buffer_.add(
      WebChannelBase.LogSaver.formatter_.formatRecord(logRecord));
***REMOVED***


***REMOVED***
***REMOVED*** Returns the log as a single string.
***REMOVED*** @return {string} The log as a single string.
***REMOVED***
WebChannelBase.LogSaver.getBuffer = function() {
  return WebChannelBase.LogSaver.buffer_.getValues().join('');
***REMOVED***


***REMOVED***
***REMOVED*** Clears the buffer
***REMOVED***
WebChannelBase.LogSaver.clearBuffer = function() {
  WebChannelBase.LogSaver.buffer_.clear();
***REMOVED***



***REMOVED***
***REMOVED*** Abstract base class for the channel handler
***REMOVED***
***REMOVED*** @struct
***REMOVED***
WebChannelBase.Handler = function() {***REMOVED***


***REMOVED***
***REMOVED*** Callback handler for when a batch of response arrays is received from the
***REMOVED*** server. When null, batched dispatching is disabled.
***REMOVED*** @type {?function(!WebChannelBase, !Array.<!Array>)}
***REMOVED***
WebChannelBase.Handler.prototype.channelHandleMultipleArrays = null;


***REMOVED***
***REMOVED*** Whether it's okay to make a request to the server. A handler can return
***REMOVED*** false if the channel should fail. For example, if the user has logged out,
***REMOVED*** the handler may want all requests to fail immediately.
***REMOVED*** @param {WebChannelBase} channel The channel.
***REMOVED*** @return {WebChannelBase.Error} An error code. The code should
***REMOVED*** return WebChannelBase.Error.OK to indicate it's okay. Any other
***REMOVED*** error code will cause a failure.
***REMOVED***
WebChannelBase.Handler.prototype.okToMakeRequest = function(channel) {
  return WebChannelBase.Error.OK;
***REMOVED***


***REMOVED***
***REMOVED*** Indicates the WebChannel has successfully negotiated with the server
***REMOVED*** and can now send and receive data.
***REMOVED*** @param {WebChannelBase} channel The channel.
***REMOVED***
WebChannelBase.Handler.prototype.channelOpened = function(channel) {
***REMOVED***


***REMOVED***
***REMOVED*** New input is available for the application to process.
***REMOVED***
***REMOVED*** @param {WebChannelBase} channel The channel.
***REMOVED*** @param {Array} array The data array.
***REMOVED***
WebChannelBase.Handler.prototype.channelHandleArray = function(channel, array) {
***REMOVED***


***REMOVED***
***REMOVED*** Indicates maps were successfully sent on the channel.
***REMOVED***
***REMOVED*** @param {WebChannelBase} channel The channel.
***REMOVED*** @param {Array.<Wire.QueuedMap>} deliveredMaps The
***REMOVED***     array of maps that have been delivered to the server. This is a direct
***REMOVED***     reference to the internal array, so a copy should be made
***REMOVED***     if the caller desires a reference to the data.
***REMOVED***
WebChannelBase.Handler.prototype.channelSuccess =
    function(channel, deliveredMaps) {
***REMOVED***


***REMOVED***
***REMOVED*** Indicates an error occurred on the WebChannel.
***REMOVED***
***REMOVED*** @param {WebChannelBase} channel The channel.
***REMOVED*** @param {WebChannelBase.Error} error The error code.
***REMOVED***
WebChannelBase.Handler.prototype.channelError = function(channel, error) {
***REMOVED***


***REMOVED***
***REMOVED*** Indicates the WebChannel is closed. Also notifies about which maps,
***REMOVED*** if any, that may not have been delivered to the server.
***REMOVED*** @param {WebChannelBase} channel The channel.
***REMOVED*** @param {Array.<Wire.QueuedMap>=} opt_pendingMaps The
***REMOVED***     array of pending maps, which may or may not have been delivered to the
***REMOVED***     server.
***REMOVED*** @param {Array.<Wire.QueuedMap>=} opt_undeliveredMaps
***REMOVED***     The array of undelivered maps, which have definitely not been delivered
***REMOVED***     to the server.
***REMOVED***
WebChannelBase.Handler.prototype.channelClosed =
    function(channel, opt_pendingMaps, opt_undeliveredMaps) {
***REMOVED***


***REMOVED***
***REMOVED*** Gets any parameters that should be added at the time another connection is
***REMOVED*** made to the server.
***REMOVED*** @param {WebChannelBase} channel The channel.
***REMOVED*** @return {!Object} Extra parameter keys and values to add to the
***REMOVED***                  requests.
***REMOVED***
WebChannelBase.Handler.prototype.getAdditionalParams = function(channel) {
  return {***REMOVED***
***REMOVED***


***REMOVED***
***REMOVED*** Gets the URI of an image that can be used to test network connectivity.
***REMOVED*** @param {WebChannelBase} channel The channel.
***REMOVED*** @return {goog.Uri?} A custom URI to load for the network test.
***REMOVED***
WebChannelBase.Handler.prototype.getNetworkTestImageUri = function(channel) {
  return null;
***REMOVED***


***REMOVED***
***REMOVED*** Gets whether this channel is currently active. This is used to determine the
***REMOVED*** length of time to wait before retrying.
***REMOVED*** @param {WebChannelBase} channel The channel.
***REMOVED*** @return {boolean} Whether the channel is currently active.
***REMOVED***
WebChannelBase.Handler.prototype.isActive = function(channel) {
  return true;
***REMOVED***


***REMOVED***
***REMOVED*** Called by the channel if enumeration of the map throws an exception.
***REMOVED*** @param {WebChannelBase} channel The channel.
***REMOVED*** @param {Object} map The map that can't be enumerated.
***REMOVED***
WebChannelBase.Handler.prototype.badMapError = function(channel, map) {
***REMOVED***


***REMOVED***
***REMOVED*** Allows the handler to override a host prefix provided by the server. Will
***REMOVED*** be called whenever the channel has received such a prefix and is considering
***REMOVED*** its use.
***REMOVED*** @param {?string} serverHostPrefix The host prefix provided by the server.
***REMOVED*** @return {?string} The host prefix the client should use.
***REMOVED***
WebChannelBase.Handler.prototype.correctHostPrefix =
    function(serverHostPrefix) {
  return serverHostPrefix;
***REMOVED***
});  // goog.scope
