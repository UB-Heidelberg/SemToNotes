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
***REMOVED*** @fileoverview Definition of the BrowserTestChannel class.  A
***REMOVED*** BrowserTestChannel is used during the first part of channel negotiation
***REMOVED*** with the server to create the channel. It helps us determine whether we're
***REMOVED*** behind a buffering proxy. It also runs the logic to see if the channel
***REMOVED*** has been blocked by a network administrator. This class is part of the
***REMOVED*** BrowserChannel implementation and is not for use by normal application code.
***REMOVED***
***REMOVED***



goog.provide('goog.net.BrowserTestChannel');

goog.require('goog.json.EvalJsonProcessor');
goog.require('goog.net.ChannelRequest');
goog.require('goog.net.ChannelRequest.Error');
goog.require('goog.net.tmpnetwork');
goog.require('goog.string.Parser');
goog.require('goog.userAgent');



***REMOVED***
***REMOVED*** Encapsulates the logic for a single BrowserTestChannel.
***REMOVED***
***REMOVED***
***REMOVED*** @param {goog.net.BrowserChannel} channel  The BrowserChannel that owns this
***REMOVED***     test channel.
***REMOVED*** @param {goog.net.ChannelDebug} channelDebug A ChannelDebug to use for
***REMOVED***     logging.
***REMOVED***
goog.net.BrowserTestChannel = function(channel, channelDebug) {
 ***REMOVED*****REMOVED***
  ***REMOVED*** The BrowserChannel that owns this test channel
  ***REMOVED*** @type {goog.net.BrowserChannel}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.channel_ = channel;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The channel debug to use for logging
  ***REMOVED*** @type {goog.net.ChannelDebug}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.channelDebug_ = channelDebug;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Parser for a response payload. Defaults to use
  ***REMOVED*** {@code goog.json.unsafeParse}. The parser should return an array.
  ***REMOVED*** @type {goog.string.Parser}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.parser_ = new goog.json.EvalJsonProcessor(null, true);
***REMOVED***


***REMOVED***
***REMOVED*** Extra HTTP headers to add to all the requests sent to the server.
***REMOVED*** @type {Object}
***REMOVED*** @private
***REMOVED***
goog.net.BrowserTestChannel.prototype.extraHeaders_ = null;


***REMOVED***
***REMOVED*** The test request.
***REMOVED*** @type {goog.net.ChannelRequest}
***REMOVED*** @private
***REMOVED***
goog.net.BrowserTestChannel.prototype.request_ = null;


***REMOVED***
***REMOVED*** Whether we have received the first result as an intermediate result. This
***REMOVED*** helps us determine whether we're behind a buffering proxy.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.net.BrowserTestChannel.prototype.receivedIntermediateResult_ = false;


***REMOVED***
***REMOVED*** The time when the test request was started. We use timing in IE as
***REMOVED*** a heuristic for whether we're behind a buffering proxy.
***REMOVED*** @type {?number}
***REMOVED*** @private
***REMOVED***
goog.net.BrowserTestChannel.prototype.startTime_ = null;


***REMOVED***
***REMOVED*** The time for of the first result part. We use timing in IE as a
***REMOVED*** heuristic for whether we're behind a buffering proxy.
***REMOVED*** @type {?number}
***REMOVED*** @private
***REMOVED***
goog.net.BrowserTestChannel.prototype.firstTime_ = null;


***REMOVED***
***REMOVED*** The time for of the last result part. We use timing in IE as a
***REMOVED*** heuristic for whether we're behind a buffering proxy.
***REMOVED*** @type {?number}
***REMOVED*** @private
***REMOVED***
goog.net.BrowserTestChannel.prototype.lastTime_ = null;


***REMOVED***
***REMOVED*** The relative path for test requests.
***REMOVED*** @type {?string}
***REMOVED*** @private
***REMOVED***
goog.net.BrowserTestChannel.prototype.path_ = null;


***REMOVED***
***REMOVED*** The state of the state machine for this object.
***REMOVED***
***REMOVED*** @type {?number}
***REMOVED*** @private
***REMOVED***
goog.net.BrowserTestChannel.prototype.state_ = null;


***REMOVED***
***REMOVED*** The last status code received.
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.net.BrowserTestChannel.prototype.lastStatusCode_ = -1;


***REMOVED***
***REMOVED*** A subdomain prefix for using a subdomain in IE for the backchannel
***REMOVED*** requests.
***REMOVED*** @type {?string}
***REMOVED*** @private
***REMOVED***
goog.net.BrowserTestChannel.prototype.hostPrefix_ = null;


***REMOVED***
***REMOVED*** A subdomain prefix for testing whether the channel was disabled by
***REMOVED*** a network administrator;
***REMOVED*** @type {?string}
***REMOVED*** @private
***REMOVED***
goog.net.BrowserTestChannel.prototype.blockedPrefix_ = null;


***REMOVED***
***REMOVED*** Enum type for the browser test channel state machine
***REMOVED*** @enum {number}
***REMOVED*** @private
***REMOVED***
goog.net.BrowserTestChannel.State_ = {
 ***REMOVED*****REMOVED***
  ***REMOVED*** The state for the BrowserTestChannel state machine where we making the
  ***REMOVED*** initial call to get the server configured parameters.
 ***REMOVED*****REMOVED***
  INIT: 0,

 ***REMOVED*****REMOVED***
  ***REMOVED*** The state for the BrowserTestChannel state machine where we're checking to
  ***REMOVED*** see if the channel has been blocked.
 ***REMOVED*****REMOVED***
  CHECKING_BLOCKED: 1,

 ***REMOVED*****REMOVED***
  ***REMOVED*** The  state for the BrowserTestChannel state machine where we're checking to
  ***REMOVED*** se if we're behind a buffering proxy.
 ***REMOVED*****REMOVED***
  CONNECTION_TESTING: 2
***REMOVED***


***REMOVED***
***REMOVED*** Time in MS for waiting for the request to see if the channel is blocked.
***REMOVED*** If the response takes longer than this many ms, we assume the request has
***REMOVED*** failed.
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.net.BrowserTestChannel.BLOCKED_TIMEOUT_ = 5000;


***REMOVED***
***REMOVED*** Number of attempts to try to see if the check to see if we're blocked
***REMOVED*** succeeds. Sometimes the request can fail because of flaky network conditions
***REMOVED*** and checking multiple times reduces false positives.
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.net.BrowserTestChannel.BLOCKED_RETRIES_ = 3;


***REMOVED***
***REMOVED*** Time in ms between retries of the blocked request
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.net.BrowserTestChannel.BLOCKED_PAUSE_BETWEEN_RETRIES_ = 2000;


***REMOVED***
***REMOVED*** Time between chunks in the test connection that indicates that we
***REMOVED*** are not behind a buffering proxy. This value should be less than or
***REMOVED*** equals to the time between chunks sent from the server.
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.net.BrowserTestChannel.MIN_TIME_EXPECTED_BETWEEN_DATA_ = 500;


***REMOVED***
***REMOVED*** Sets extra HTTP headers to add to all the requests sent to the server.
***REMOVED***
***REMOVED*** @param {Object} extraHeaders The HTTP headers.
***REMOVED***
goog.net.BrowserTestChannel.prototype.setExtraHeaders = function(extraHeaders) {
  this.extraHeaders_ = extraHeaders;
***REMOVED***


***REMOVED***
***REMOVED*** Sets a new parser for the response payload. A custom parser may be set to
***REMOVED*** avoid using eval(), for example.
***REMOVED*** By default, the parser uses {@code goog.json.unsafeParse}.
***REMOVED*** @param {!goog.string.Parser} parser Parser.
***REMOVED***
goog.net.BrowserTestChannel.prototype.setParser = function(parser) {
  this.parser_ = parser;
***REMOVED***


***REMOVED***
***REMOVED*** Starts the test channel. This initiates connections to the server.
***REMOVED***
***REMOVED*** @param {string} path The relative uri for the test connection.
***REMOVED***
goog.net.BrowserTestChannel.prototype.connect = function(path) {
  this.path_ = path;
  var sendDataUri = this.channel_.getForwardChannelUri(this.path_);

  goog.net.BrowserChannel.notifyStatEvent(
      goog.net.BrowserChannel.Stat.TEST_STAGE_ONE_START);
  this.startTime_ = goog.now();

  // If the channel already has the result of the first test, then skip it.
  var firstTestResults = this.channel_.getFirstTestResults();
  if (goog.isDefAndNotNull(firstTestResults)) {
    this.hostPrefix_ = this.channel_.correctHostPrefix(firstTestResults[0]);
    this.blockedPrefix_ = firstTestResults[1];
    if (this.blockedPrefix_) {
      this.state_ = goog.net.BrowserTestChannel.State_.CHECKING_BLOCKED;
      this.checkBlocked_();
    } else {
      this.state_ = goog.net.BrowserTestChannel.State_.CONNECTION_TESTING;
      this.connectStage2_();
    }
    return;
  }

  // the first request returns server specific parameters
  sendDataUri.setParameterValues('MODE', 'init');
  this.request_ = goog.net.BrowserChannel.createChannelRequest(
      this, this.channelDebug_);
  this.request_.setExtraHeaders(this.extraHeaders_);
  this.request_.xmlHttpGet(sendDataUri, false /* decodeChunks***REMOVED***,
      null /* hostPrefix***REMOVED***, true /* opt_noClose***REMOVED***);
  this.state_ = goog.net.BrowserTestChannel.State_.INIT;
***REMOVED***


***REMOVED***
***REMOVED*** Checks to see whether the channel is blocked. This is for implementing the
***REMOVED*** feature that allows network administrators to block Gmail Chat. The
***REMOVED*** strategy to determine if we're blocked is to try to load an image off a
***REMOVED*** special subdomain that network administrators will block access to if they
***REMOVED*** are trying to block chat. For Gmail Chat, the subdomain is
***REMOVED*** chatenabled.mail.google.com.
***REMOVED*** @private
***REMOVED***
goog.net.BrowserTestChannel.prototype.checkBlocked_ = function() {
  var uri = this.channel_.createDataUri(this.blockedPrefix_,
      '/mail/images/cleardot.gif');
  uri.makeUnique();
  goog.net.tmpnetwork.testLoadImageWithRetries(uri.toString(),
      goog.net.BrowserTestChannel.BLOCKED_TIMEOUT_,
      goog.bind(this.checkBlockedCallback_, this),
      goog.net.BrowserTestChannel.BLOCKED_RETRIES_,
      goog.net.BrowserTestChannel.BLOCKED_PAUSE_BETWEEN_RETRIES_);
  this.notifyServerReachabilityEvent(
      goog.net.BrowserChannel.ServerReachability.REQUEST_MADE);
***REMOVED***


***REMOVED***
***REMOVED*** Callback for testLoadImageWithRetries to check if browser channel is
***REMOVED*** blocked.
***REMOVED*** @param {boolean} succeeded Whether the request succeeded.
***REMOVED*** @private
***REMOVED***
goog.net.BrowserTestChannel.prototype.checkBlockedCallback_ = function(
    succeeded) {
  if (succeeded) {
    this.state_ = goog.net.BrowserTestChannel.State_.CONNECTION_TESTING;
    this.connectStage2_();
  } else {
    goog.net.BrowserChannel.notifyStatEvent(
        goog.net.BrowserChannel.Stat.CHANNEL_BLOCKED);
    this.channel_.testConnectionBlocked(this);
  }

  // We don't dispatch a REQUEST_FAILED server reachability event when the
  // block request fails, as such a failure is not a good signal that the
  // server has actually become unreachable.
  if (succeeded) {
    this.notifyServerReachabilityEvent(
        goog.net.BrowserChannel.ServerReachability.REQUEST_SUCCEEDED);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Begins the second stage of the test channel where we test to see if we're
***REMOVED*** behind a buffering proxy. The server sends back a multi-chunked response
***REMOVED*** with the first chunk containing the content '1' and then two seconds later
***REMOVED*** sending the second chunk containing the content '2'. Depending on how we
***REMOVED*** receive the content, we can tell if we're behind a buffering proxy.
***REMOVED*** @private
***REMOVED***
goog.net.BrowserTestChannel.prototype.connectStage2_ = function() {
  this.channelDebug_.debug('TestConnection: starting stage 2');
  this.request_ = goog.net.BrowserChannel.createChannelRequest(
      this, this.channelDebug_);
  this.request_.setExtraHeaders(this.extraHeaders_);
  var recvDataUri = this.channel_.getBackChannelUri(this.hostPrefix_,
     ***REMOVED*****REMOVED*** @type {string}***REMOVED*** (this.path_));

  goog.net.BrowserChannel.notifyStatEvent(
      goog.net.BrowserChannel.Stat.TEST_STAGE_TWO_START);
  if (!goog.net.ChannelRequest.supportsXhrStreaming()) {
    recvDataUri.setParameterValues('TYPE', 'html');
    this.request_.tridentGet(recvDataUri, Boolean(this.hostPrefix_));
  } else {
    recvDataUri.setParameterValues('TYPE', 'xmlhttp');
    this.request_.xmlHttpGet(recvDataUri, false***REMOVED*****REMOVED*** decodeChunks***REMOVED***,
        this.hostPrefix_, false***REMOVED*****REMOVED*** opt_noClose***REMOVED***);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Factory method for XhrIo objects.
***REMOVED*** @param {?string} hostPrefix The host prefix, if we need an XhrIo object
***REMOVED***     capable of calling a secondary domain.
***REMOVED*** @return {!goog.net.XhrIo} New XhrIo object.
***REMOVED***
goog.net.BrowserTestChannel.prototype.createXhrIo = function(hostPrefix) {
  return this.channel_.createXhrIo(hostPrefix);
***REMOVED***


***REMOVED***
***REMOVED*** Aborts the test channel.
***REMOVED***
goog.net.BrowserTestChannel.prototype.abort = function() {
  if (this.request_) {
    this.request_.cancel();
    this.request_ = null;
  }
  this.lastStatusCode_ = -1;
***REMOVED***


***REMOVED***
***REMOVED*** Returns whether the test channel is closed. The ChannelRequest object expects
***REMOVED*** this method to be implemented on its handler.
***REMOVED***
***REMOVED*** @return {boolean} Whether the channel is closed.
***REMOVED***
goog.net.BrowserTestChannel.prototype.isClosed = function() {
  return false;
***REMOVED***


***REMOVED***
***REMOVED*** Callback from ChannelRequest for when new data is received
***REMOVED***
***REMOVED*** @param {goog.net.ChannelRequest} req  The request object.
***REMOVED*** @param {string} responseText The text of the response.
***REMOVED***
goog.net.BrowserTestChannel.prototype.onRequestData =
    function(req, responseText) {
  this.lastStatusCode_ = req.getLastStatusCode();
  if (this.state_ == goog.net.BrowserTestChannel.State_.INIT) {
    this.channelDebug_.debug('TestConnection: Got data for stage 1');
    if (!responseText) {
      this.channelDebug_.debug('TestConnection: Null responseText');
      // The server should always send text; something is wrong here
      this.channel_.testConnectionFailure(this,
          goog.net.ChannelRequest.Error.BAD_DATA);
      return;
    }
   ***REMOVED*****REMOVED*** @preserveTry***REMOVED***
    try {
      var respArray = this.parser_.parse(responseText);
    } catch (e) {
      this.channelDebug_.dumpException(e);
      this.channel_.testConnectionFailure(this,
          goog.net.ChannelRequest.Error.BAD_DATA);
      return;
    }
    this.hostPrefix_ = this.channel_.correctHostPrefix(respArray[0]);
    this.blockedPrefix_ = respArray[1];
  } else if (this.state_ ==
             goog.net.BrowserTestChannel.State_.CONNECTION_TESTING) {
    if (this.receivedIntermediateResult_) {
      goog.net.BrowserChannel.notifyStatEvent(
          goog.net.BrowserChannel.Stat.TEST_STAGE_TWO_DATA_TWO);
      this.lastTime_ = goog.now();
    } else {
      // '11111' is used instead of '1' to prevent a small amount of buffering
      // by Safari.
      if (responseText == '11111') {
        goog.net.BrowserChannel.notifyStatEvent(
            goog.net.BrowserChannel.Stat.TEST_STAGE_TWO_DATA_ONE);
        this.receivedIntermediateResult_ = true;
        this.firstTime_ = goog.now();
        if (this.checkForEarlyNonBuffered_()) {
          // If early chunk detection is on, and we passed the tests,
          // assume HTTP_OK, cancel the test and turn on noproxy mode.
          this.lastStatusCode_ = 200;
          this.request_.cancel();
          this.channelDebug_.debug(
              'Test connection succeeded; using streaming connection');
          goog.net.BrowserChannel.notifyStatEvent(
              goog.net.BrowserChannel.Stat.NOPROXY);
          this.channel_.testConnectionFinished(this, true);
        }
      } else {
        goog.net.BrowserChannel.notifyStatEvent(
            goog.net.BrowserChannel.Stat.TEST_STAGE_TWO_DATA_BOTH);
        this.firstTime_ = this.lastTime_ = goog.now();
        this.receivedIntermediateResult_ = false;
      }
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** Callback from ChannelRequest that indicates a request has completed.
***REMOVED***
***REMOVED*** @param {goog.net.ChannelRequest} req  The request object.
***REMOVED***
goog.net.BrowserTestChannel.prototype.onRequestComplete =
    function(req) {
  this.lastStatusCode_ = this.request_.getLastStatusCode();
  if (!this.request_.getSuccess()) {
    this.channelDebug_.debug(
        'TestConnection: request failed, in state ' + this.state_);
    if (this.state_ == goog.net.BrowserTestChannel.State_.INIT) {
      goog.net.BrowserChannel.notifyStatEvent(
          goog.net.BrowserChannel.Stat.TEST_STAGE_ONE_FAILED);
    } else if (this.state_ ==
               goog.net.BrowserTestChannel.State_.CONNECTION_TESTING) {
      goog.net.BrowserChannel.notifyStatEvent(
          goog.net.BrowserChannel.Stat.TEST_STAGE_TWO_FAILED);
    }
    this.channel_.testConnectionFailure(this,
       ***REMOVED*****REMOVED*** @type {goog.net.ChannelRequest.Error}***REMOVED***
        (this.request_.getLastError()));
    return;
  }

  if (this.state_ == goog.net.BrowserTestChannel.State_.INIT) {
    this.channelDebug_.debug(
        'TestConnection: request complete for initial check');
    if (this.blockedPrefix_) {
      this.state_ = goog.net.BrowserTestChannel.State_.CHECKING_BLOCKED;
      this.checkBlocked_();
    } else {
      this.state_ = goog.net.BrowserTestChannel.State_.CONNECTION_TESTING;
      this.connectStage2_();
    }
  } else if (this.state_ ==
             goog.net.BrowserTestChannel.State_.CONNECTION_TESTING) {
    this.channelDebug_.debug('TestConnection: request complete for stage 2');
    var goodConn = false;

    if (!goog.net.ChannelRequest.supportsXhrStreaming()) {
      // we always get Trident responses in separate calls to
      // onRequestData, so we have to check the time they came
      var ms = this.lastTime_ - this.firstTime_;
      if (ms < 200) {
        // TODO: need to empirically verify that this number is OK
        // for slow computers
        goodConn = false;
      } else {
        goodConn = true;
      }
    } else {
      goodConn = this.receivedIntermediateResult_;
    }

    if (goodConn) {
      this.channelDebug_.debug(
          'Test connection succeeded; using streaming connection');
      goog.net.BrowserChannel.notifyStatEvent(
          goog.net.BrowserChannel.Stat.NOPROXY);
      this.channel_.testConnectionFinished(this, true);
    } else {
      this.channelDebug_.debug(
          'Test connection failed; not using streaming');
      goog.net.BrowserChannel.notifyStatEvent(
          goog.net.BrowserChannel.Stat.PROXY);
      this.channel_.testConnectionFinished(this, false);
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** Returns the last status code received for a request.
***REMOVED*** @return {number} The last status code received for a request.
***REMOVED***
goog.net.BrowserTestChannel.prototype.getLastStatusCode = function() {
  return this.lastStatusCode_;
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} Whether we should be using secondary domains when the
***REMOVED***     server instructs us to do so.
***REMOVED***
goog.net.BrowserTestChannel.prototype.shouldUseSecondaryDomains = function() {
  return this.channel_.shouldUseSecondaryDomains();
***REMOVED***


***REMOVED***
***REMOVED*** Gets whether this channel is currently active. This is used to determine the
***REMOVED*** length of time to wait before retrying.
***REMOVED***
***REMOVED*** @param {goog.net.BrowserChannel} browserChannel The browser channel.
***REMOVED*** @return {boolean} Whether the channel is currently active.
***REMOVED***
goog.net.BrowserTestChannel.prototype.isActive =
    function(browserChannel) {
  return this.channel_.isActive();
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} True if test stage 2 detected a non-buffered
***REMOVED***     channel early and early no buffering detection is enabled.
***REMOVED*** @private
***REMOVED***
goog.net.BrowserTestChannel.prototype.checkForEarlyNonBuffered_ =
    function() {
  var ms = this.firstTime_ - this.startTime_;

  // we always get Trident responses in separate calls to
  // onRequestData, so we have to check the time that the first came in
  // and verify that the data arrived before the second portion could
  // have been sent. For all other browser's we skip the timing test.
  return goog.net.ChannelRequest.supportsXhrStreaming() ||
      ms < goog.net.BrowserTestChannel.MIN_TIME_EXPECTED_BETWEEN_DATA_;
***REMOVED***


***REMOVED***
***REMOVED*** Notifies the channel of a fine grained network event.
***REMOVED*** @param {goog.net.BrowserChannel.ServerReachability} reachabilityType The
***REMOVED***     reachability event type.
***REMOVED***
goog.net.BrowserTestChannel.prototype.notifyServerReachabilityEvent =
    function(reachabilityType) {
  this.channel_.notifyServerReachabilityEvent(reachabilityType);
***REMOVED***
