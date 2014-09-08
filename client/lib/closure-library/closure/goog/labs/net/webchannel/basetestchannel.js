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
***REMOVED*** @fileoverview Base TestChannel implementation.
***REMOVED***
***REMOVED***


goog.provide('goog.labs.net.webChannel.BaseTestChannel');

goog.require('goog.labs.net.webChannel.Channel');
goog.require('goog.labs.net.webChannel.ChannelRequest');
goog.require('goog.labs.net.webChannel.requestStats');
goog.require('goog.labs.net.webChannel.requestStats.Stat');



***REMOVED***
***REMOVED*** A TestChannel is used during the first part of channel negotiation
***REMOVED*** with the server to create the channel. It helps us determine whether we're
***REMOVED*** behind a buffering proxy.
***REMOVED***
***REMOVED***
***REMOVED*** @struct
***REMOVED*** @param {!goog.labs.net.webChannel.Channel} channel The channel
***REMOVED***     that owns this test channel.
***REMOVED*** @param {!goog.labs.net.webChannel.WebChannelDebug} channelDebug A
***REMOVED***     WebChannelDebug instance to use for logging.
***REMOVED*** @implements {goog.labs.net.webChannel.Channel}
***REMOVED***
goog.labs.net.webChannel.BaseTestChannel = function(channel, channelDebug) {
 ***REMOVED*****REMOVED***
  ***REMOVED*** The channel that owns this test channel
  ***REMOVED*** @private {!goog.labs.net.webChannel.Channel}
 ***REMOVED*****REMOVED***
  this.channel_ = channel;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The channel debug to use for logging
  ***REMOVED*** @private {!goog.labs.net.webChannel.WebChannelDebug}
 ***REMOVED*****REMOVED***
  this.channelDebug_ = channelDebug;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Extra HTTP headers to add to all the requests sent to the server.
  ***REMOVED*** @private {Object}
 ***REMOVED*****REMOVED***
  this.extraHeaders_ = null;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The test request.
  ***REMOVED*** @private {goog.labs.net.webChannel.ChannelRequest}
 ***REMOVED*****REMOVED***
  this.request_ = null;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Whether we have received the first result as an intermediate result. This
  ***REMOVED*** helps us determine whether we're behind a buffering proxy.
  ***REMOVED*** @private {boolean}
 ***REMOVED*****REMOVED***
  this.receivedIntermediateResult_ = false;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The time when the test request was started. We use timing in IE as
  ***REMOVED*** a heuristic for whether we're behind a buffering proxy.
  ***REMOVED*** @private {?number}
 ***REMOVED*****REMOVED***
  this.startTime_ = null;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The time for of the first result part. We use timing in IE as a
  ***REMOVED*** heuristic for whether we're behind a buffering proxy.
  ***REMOVED*** @private {?number}
 ***REMOVED*****REMOVED***
  this.firstTime_ = null;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The time for of the last result part. We use timing in IE as a
  ***REMOVED*** heuristic for whether we're behind a buffering proxy.
  ***REMOVED*** @private {?number}
 ***REMOVED*****REMOVED***
  this.lastTime_ = null;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The relative path for test requests.
  ***REMOVED*** @private {?string}
 ***REMOVED*****REMOVED***
  this.path_ = null;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The last status code received.
  ***REMOVED*** @private {number}
 ***REMOVED*****REMOVED***
  this.lastStatusCode_ = -1;

 ***REMOVED*****REMOVED***
  ***REMOVED*** A subdomain prefix for using a subdomain in IE for the backchannel
  ***REMOVED*** requests.
  ***REMOVED*** @private {?string}
 ***REMOVED*****REMOVED***
  this.hostPrefix_ = null;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The effective client protocol as indicated by the initial handshake
  ***REMOVED*** response via the x-client-wire-protocol header.
  ***REMOVED***
  ***REMOVED*** @private {?string}
 ***REMOVED*****REMOVED***
  this.clientProtocol_ = null;
***REMOVED***


goog.scope(function() {
var BaseTestChannel = goog.labs.net.webChannel.BaseTestChannel;
var WebChannelDebug = goog.labs.net.webChannel.WebChannelDebug;
var ChannelRequest = goog.labs.net.webChannel.ChannelRequest;
var requestStats = goog.labs.net.webChannel.requestStats;
var Channel = goog.labs.net.webChannel.Channel;


***REMOVED***
***REMOVED*** Enum type for the test channel state machine
***REMOVED*** @enum {number}
***REMOVED*** @private
***REMOVED***
BaseTestChannel.State_ = {
 ***REMOVED*****REMOVED***
  ***REMOVED*** The state for the TestChannel state machine where we making the
  ***REMOVED*** initial call to get the server configured parameters.
 ***REMOVED*****REMOVED***
  INIT: 0,

 ***REMOVED*****REMOVED***
  ***REMOVED*** The  state for the TestChannel state machine where we're checking to
  ***REMOVED*** se if we're behind a buffering proxy.
 ***REMOVED*****REMOVED***
  CONNECTION_TESTING: 1
***REMOVED***


***REMOVED***
***REMOVED*** The state of the state machine for this object.
***REMOVED***
***REMOVED*** @private {?BaseTestChannel.State_}
***REMOVED***
BaseTestChannel.prototype.state_ = null;


***REMOVED***
***REMOVED*** Time between chunks in the test connection that indicates that we
***REMOVED*** are not behind a buffering proxy. This value should be less than or
***REMOVED*** equals to the time between chunks sent from the server.
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
BaseTestChannel.MIN_TIME_EXPECTED_BETWEEN_DATA_ = 500;


***REMOVED***
***REMOVED*** Sets extra HTTP headers to add to all the requests sent to the server.
***REMOVED***
***REMOVED*** @param {Object} extraHeaders The HTTP headers.
***REMOVED***
BaseTestChannel.prototype.setExtraHeaders = function(extraHeaders) {
  this.extraHeaders_ = extraHeaders;
***REMOVED***


***REMOVED***
***REMOVED*** Starts the test channel. This initiates connections to the server.
***REMOVED***
***REMOVED*** @param {string} path The relative uri for the test connection.
***REMOVED***
BaseTestChannel.prototype.connect = function(path) {
  this.path_ = path;
  var sendDataUri = this.channel_.getForwardChannelUri(this.path_);

  requestStats.notifyStatEvent(requestStats.Stat.TEST_STAGE_ONE_START);
  this.startTime_ = goog.now();

  // If the channel already has the result of the handshake, then skip it.
  var handshakeResult = this.channel_.getConnectionState().handshakeResult;
  if (goog.isDefAndNotNull(handshakeResult)) {
    this.hostPrefix_ = this.channel_.correctHostPrefix(handshakeResult[0]);
    this.state_ = BaseTestChannel.State_.CONNECTION_TESTING;
    this.checkBufferingProxy_();
    return;
  }

  // the first request returns server specific parameters
  sendDataUri.setParameterValues('MODE', 'init');
  this.request_ = ChannelRequest.createChannelRequest(this, this.channelDebug_);
  this.request_.setExtraHeaders(this.extraHeaders_);
  this.request_.xmlHttpGet(sendDataUri, false /* decodeChunks***REMOVED***,
      null /* hostPrefix***REMOVED***, true /* opt_noClose***REMOVED***);
  this.state_ = BaseTestChannel.State_.INIT;
***REMOVED***


***REMOVED***
***REMOVED*** Begins the second stage of the test channel where we test to see if we're
***REMOVED*** behind a buffering proxy. The server sends back a multi-chunked response
***REMOVED*** with the first chunk containing the content '1' and then two seconds later
***REMOVED*** sending the second chunk containing the content '2'. Depending on how we
***REMOVED*** receive the content, we can tell if we're behind a buffering proxy.
***REMOVED*** @private
***REMOVED***
BaseTestChannel.prototype.checkBufferingProxy_ = function() {
  this.channelDebug_.debug('TestConnection: starting stage 2');

  // If the test result is already available, skip its execution.
  var bufferingProxyResult =
      this.channel_.getConnectionState().bufferingProxyResult;
  if (goog.isDefAndNotNull(bufferingProxyResult)) {
    this.channelDebug_.debug(
        'TestConnection: skipping stage 2, precomputed result is ' +
        bufferingProxyResult ? 'Buffered' : 'Unbuffered');
    requestStats.notifyStatEvent(requestStats.Stat.TEST_STAGE_TWO_START);
    if (bufferingProxyResult) { // Buffered/Proxy connection
      requestStats.notifyStatEvent(requestStats.Stat.PROXY);
      this.channel_.testConnectionFinished(this, false);
    } else { // Unbuffered/NoProxy connection
      requestStats.notifyStatEvent(requestStats.Stat.NOPROXY);
      this.channel_.testConnectionFinished(this, true);
    }
    return; // Skip the test
  }
  this.request_ = ChannelRequest.createChannelRequest(this, this.channelDebug_);
  this.request_.setExtraHeaders(this.extraHeaders_);
  var recvDataUri = this.channel_.getBackChannelUri(this.hostPrefix_,
     ***REMOVED*****REMOVED*** @type {string}***REMOVED*** (this.path_));

  requestStats.notifyStatEvent(requestStats.Stat.TEST_STAGE_TWO_START);
  if (!ChannelRequest.supportsXhrStreaming()) {
    recvDataUri.setParameterValues('TYPE', 'html');
    this.request_.tridentGet(recvDataUri, Boolean(this.hostPrefix_));
  } else {
    recvDataUri.setParameterValues('TYPE', 'xmlhttp');
    this.request_.xmlHttpGet(recvDataUri, false***REMOVED*****REMOVED*** decodeChunks***REMOVED***,
        this.hostPrefix_, false***REMOVED*****REMOVED*** opt_noClose***REMOVED***);
  }
***REMOVED***


***REMOVED***
***REMOVED*** @override
***REMOVED***
BaseTestChannel.prototype.createXhrIo = function(hostPrefix) {
  return this.channel_.createXhrIo(hostPrefix);
***REMOVED***


***REMOVED***
***REMOVED*** Aborts the test channel.
***REMOVED***
BaseTestChannel.prototype.abort = function() {
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
***REMOVED*** @override
***REMOVED***
BaseTestChannel.prototype.isClosed = function() {
  return false;
***REMOVED***


***REMOVED***
***REMOVED*** Callback from ChannelRequest for when new data is received
***REMOVED***
***REMOVED*** @param {ChannelRequest} req The request object.
***REMOVED*** @param {string} responseText The text of the response.
***REMOVED*** @override
***REMOVED***
BaseTestChannel.prototype.onRequestData = function(req, responseText) {
  this.lastStatusCode_ = req.getLastStatusCode();
  if (this.state_ == BaseTestChannel.State_.INIT) {
    this.channelDebug_.debug('TestConnection: Got data for stage 1');
    if (!responseText) {
      this.channelDebug_.debug('TestConnection: Null responseText');
      // The server should always send text; something is wrong here
      this.channel_.testConnectionFailure(this, ChannelRequest.Error.BAD_DATA);
      return;
    }
   ***REMOVED*****REMOVED*** @preserveTry***REMOVED***
    try {
      var respArray = this.channel_.getWireCodec().decodeMessage(responseText);
    } catch (e) {
      this.channelDebug_.dumpException(e);
      this.channel_.testConnectionFailure(this, ChannelRequest.Error.BAD_DATA);
      return;
    }
    this.hostPrefix_ = this.channel_.correctHostPrefix(respArray[0]);
  } else if (this.state_ == BaseTestChannel.State_.CONNECTION_TESTING) {
    if (this.receivedIntermediateResult_) {
      requestStats.notifyStatEvent(requestStats.Stat.TEST_STAGE_TWO_DATA_TWO);
      this.lastTime_ = goog.now();
    } else {
      // '11111' is used instead of '1' to prevent a small amount of buffering
      // by Safari.
      if (responseText == '11111') {
        requestStats.notifyStatEvent(requestStats.Stat.TEST_STAGE_TWO_DATA_ONE);
        this.receivedIntermediateResult_ = true;
        this.firstTime_ = goog.now();
        if (this.checkForEarlyNonBuffered_()) {
          // If early chunk detection is on, and we passed the tests,
          // assume HTTP_OK, cancel the test and turn on noproxy mode.
          this.lastStatusCode_ = 200;
          this.request_.cancel();
          this.channelDebug_.debug(
              'Test connection succeeded; using streaming connection');
          requestStats.notifyStatEvent(requestStats.Stat.NOPROXY);
          this.channel_.testConnectionFinished(this, true);
        }
      } else {
        requestStats.notifyStatEvent(
            requestStats.Stat.TEST_STAGE_TWO_DATA_BOTH);
        this.firstTime_ = this.lastTime_ = goog.now();
        this.receivedIntermediateResult_ = false;
      }
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** Callback from ChannelRequest that indicates a request has completed.
***REMOVED***
***REMOVED*** @param {!ChannelRequest} req The request object.
***REMOVED*** @override
***REMOVED***
BaseTestChannel.prototype.onRequestComplete = function(req) {
  this.lastStatusCode_ = this.request_.getLastStatusCode();
  if (!this.request_.getSuccess()) {
    this.channelDebug_.debug(
        'TestConnection: request failed, in state ' + this.state_);
    if (this.state_ == BaseTestChannel.State_.INIT) {
      requestStats.notifyStatEvent(requestStats.Stat.TEST_STAGE_ONE_FAILED);
    } else if (this.state_ == BaseTestChannel.State_.CONNECTION_TESTING) {
      requestStats.notifyStatEvent(requestStats.Stat.TEST_STAGE_TWO_FAILED);
    }
    this.channel_.testConnectionFailure(this,
       ***REMOVED*****REMOVED*** @type {ChannelRequest.Error}***REMOVED***
        (this.request_.getLastError()));
    return;
  }

  if (this.state_ == BaseTestChannel.State_.INIT) {
    this.recordClientProtocol_(req);
    this.state_ = BaseTestChannel.State_.CONNECTION_TESTING;

    this.channelDebug_.debug(
        'TestConnection: request complete for initial check');

    this.checkBufferingProxy_();
  } else if (this.state_ == BaseTestChannel.State_.CONNECTION_TESTING) {
    this.channelDebug_.debug('TestConnection: request complete for stage 2');
    var goodConn = false;

    if (!ChannelRequest.supportsXhrStreaming()) {
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
      requestStats.notifyStatEvent(requestStats.Stat.NOPROXY);
      this.channel_.testConnectionFinished(this, true);
    } else {
      this.channelDebug_.debug(
          'Test connection failed; not using streaming');
      requestStats.notifyStatEvent(requestStats.Stat.PROXY);
      this.channel_.testConnectionFinished(this, false);
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** Record the client protocol header from the initial handshake response.
***REMOVED***
***REMOVED*** @param {!ChannelRequest} req The request object.
***REMOVED*** @private
***REMOVED***
BaseTestChannel.prototype.recordClientProtocol_ = function(req) {
  var xmlHttp = req.getXhr();
  if (xmlHttp) {
    var protocolHeader = xmlHttp.getResponseHeader('x-client-wire-protocol');
    this.clientProtocol_ = protocolHeader ? protocolHeader : null;
  }
***REMOVED***


***REMOVED***
***REMOVED*** @return {?string} The client protocol as recorded with the init handshake
***REMOVED***     request.
***REMOVED***
BaseTestChannel.prototype.getClientProtocol = function() {
  return this.clientProtocol_;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the last status code received for a request.
***REMOVED*** @return {number} The last status code received for a request.
***REMOVED***
BaseTestChannel.prototype.getLastStatusCode = function() {
  return this.lastStatusCode_;
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} Whether we should be using secondary domains when the
***REMOVED***     server instructs us to do so.
***REMOVED*** @override
***REMOVED***
BaseTestChannel.prototype.shouldUseSecondaryDomains = function() {
  return this.channel_.shouldUseSecondaryDomains();
***REMOVED***


***REMOVED***
***REMOVED*** @override
***REMOVED***
BaseTestChannel.prototype.isActive = function() {
  return this.channel_.isActive();
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} True if test stage 2 detected a non-buffered
***REMOVED***     channel early and early no buffering detection is enabled.
***REMOVED*** @private
***REMOVED***
BaseTestChannel.prototype.checkForEarlyNonBuffered_ = function() {
  var ms = this.firstTime_ - this.startTime_;

  // we always get Trident responses in separate calls to
  // onRequestData, so we have to check the time that the first came in
  // and verify that the data arrived before the second portion could
  // have been sent. For all other browser's we skip the timing test.
  return ChannelRequest.supportsXhrStreaming() ||
      ms < BaseTestChannel.MIN_TIME_EXPECTED_BETWEEN_DATA_;
***REMOVED***


***REMOVED***
***REMOVED*** @override
***REMOVED***
BaseTestChannel.prototype.getForwardChannelUri = goog.abstractMethod;


***REMOVED***
***REMOVED*** @override
***REMOVED***
BaseTestChannel.prototype.getBackChannelUri = goog.abstractMethod;


***REMOVED***
***REMOVED*** @override
***REMOVED***
BaseTestChannel.prototype.correctHostPrefix = goog.abstractMethod;


***REMOVED***
***REMOVED*** @override
***REMOVED***
BaseTestChannel.prototype.createDataUri = goog.abstractMethod;


***REMOVED***
***REMOVED*** @override
***REMOVED***
BaseTestChannel.prototype.testConnectionFinished = goog.abstractMethod;


***REMOVED***
***REMOVED*** @override
***REMOVED***
BaseTestChannel.prototype.testConnectionFailure = goog.abstractMethod;


***REMOVED***
***REMOVED*** @override
***REMOVED***
BaseTestChannel.prototype.getConnectionState = goog.abstractMethod;
});  // goog.scope
