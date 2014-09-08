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
***REMOVED*** @fileoverview Definition of the ChannelRequest class. The ChannelRequest
***REMOVED*** object encapsulates the logic for making a single request, either for the
***REMOVED*** forward channel, back channel, or test channel, to the server. It contains
***REMOVED*** the logic for the three types of transports we use in the BrowserChannel:
***REMOVED*** XMLHTTP, Trident ActiveX (ie only), and Image request. It provides timeout
***REMOVED*** detection. This class is part of the BrowserChannel implementation and is not
***REMOVED*** for use by normal application code.
***REMOVED***
***REMOVED***


goog.provide('goog.net.ChannelRequest');
goog.provide('goog.net.ChannelRequest.Error');

goog.require('goog.Timer');
goog.require('goog.async.Throttle');
goog.require('goog.events.EventHandler');
goog.require('goog.net.ErrorCode');
goog.require('goog.net.EventType');
goog.require('goog.net.XmlHttp');
goog.require('goog.object');
goog.require('goog.userAgent');

// TODO(nnaze): This file depends on goog.net.BrowserChannel and vice versa (a
// circular dependency).  Usages of BrowserChannel are marked as
// "missingRequire" below for now.  This should be fixed through refactoring.



***REMOVED***
***REMOVED*** Creates a ChannelRequest object which encapsulates a request to the server.
***REMOVED*** A new ChannelRequest is created for each request to the server.
***REMOVED***
***REMOVED*** @param {goog.net.BrowserChannel|goog.net.BrowserTestChannel} channel
***REMOVED***     The BrowserChannel that owns this request.
***REMOVED*** @param {goog.net.ChannelDebug} channelDebug A ChannelDebug to use for
***REMOVED***     logging.
***REMOVED*** @param {string=} opt_sessionId  The session id for the channel.
***REMOVED*** @param {string|number=} opt_requestId  The request id for this request.
***REMOVED*** @param {number=} opt_retryId  The retry id for this request.
***REMOVED***
***REMOVED***
goog.net.ChannelRequest = function(channel, channelDebug, opt_sessionId,
    opt_requestId, opt_retryId) {
 ***REMOVED*****REMOVED***
  ***REMOVED*** The BrowserChannel object that owns the request.
  ***REMOVED*** @type {goog.net.BrowserChannel|goog.net.BrowserTestChannel}
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
  ***REMOVED*** The Session ID for the channel.
  ***REMOVED*** @type {string|undefined}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.sid_ = opt_sessionId;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The RID (request ID) for the request.
  ***REMOVED*** @type {string|number|undefined}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.rid_ = opt_requestId;


 ***REMOVED*****REMOVED***
  ***REMOVED*** The attempt number of the current request.
  ***REMOVED*** @type {number}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.retryId_ = opt_retryId || 1;


 ***REMOVED*****REMOVED***
  ***REMOVED*** The timeout in ms before failing the request.
  ***REMOVED*** @type {number}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.timeout_ = goog.net.ChannelRequest.TIMEOUT_MS;

 ***REMOVED*****REMOVED***
  ***REMOVED*** An object to keep track of the channel request event listeners.
  ***REMOVED*** @type {!goog.events.EventHandler.<!goog.net.ChannelRequest>}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.eventHandler_ = new goog.events.EventHandler(this);

 ***REMOVED*****REMOVED***
  ***REMOVED*** A timer for polling responseText in browsers that don't fire
  ***REMOVED*** onreadystatechange during incremental loading of responseText.
  ***REMOVED*** @type {goog.Timer}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.pollingTimer_ = new goog.Timer();

  this.pollingTimer_.setInterval(goog.net.ChannelRequest.POLLING_INTERVAL_MS);
***REMOVED***


***REMOVED***
***REMOVED*** Extra HTTP headers to add to all the requests sent to the server.
***REMOVED*** @type {Object}
***REMOVED*** @private
***REMOVED***
goog.net.ChannelRequest.prototype.extraHeaders_ = null;


***REMOVED***
***REMOVED*** Whether the request was successful. This is only set to true after the
***REMOVED*** request successfuly completes.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.net.ChannelRequest.prototype.successful_ = false;


***REMOVED***
***REMOVED*** The TimerID of the timer used to detect if the request has timed-out.
***REMOVED*** @type {?number}
***REMOVED*** @private
***REMOVED***
goog.net.ChannelRequest.prototype.watchDogTimerId_ = null;


***REMOVED***
***REMOVED*** The time in the future when the request will timeout.
***REMOVED*** @type {?number}
***REMOVED*** @private
***REMOVED***
goog.net.ChannelRequest.prototype.watchDogTimeoutTime_ = null;


***REMOVED***
***REMOVED*** The time the request started.
***REMOVED*** @type {?number}
***REMOVED*** @private
***REMOVED***
goog.net.ChannelRequest.prototype.requestStartTime_ = null;


***REMOVED***
***REMOVED*** The type of request (XMLHTTP, IMG, Trident)
***REMOVED*** @type {?number}
***REMOVED*** @private
***REMOVED***
goog.net.ChannelRequest.prototype.type_ = null;


***REMOVED***
***REMOVED*** The base Uri for the request. The includes all the parameters except the
***REMOVED*** one that indicates the retry number.
***REMOVED*** @type {goog.Uri?}
***REMOVED*** @private
***REMOVED***
goog.net.ChannelRequest.prototype.baseUri_ = null;


***REMOVED***
***REMOVED*** The request Uri that was actually used for the most recent request attempt.
***REMOVED*** @type {goog.Uri?}
***REMOVED*** @private
***REMOVED***
goog.net.ChannelRequest.prototype.requestUri_ = null;


***REMOVED***
***REMOVED*** The post data, if the request is a post.
***REMOVED*** @type {?string}
***REMOVED*** @private
***REMOVED***
goog.net.ChannelRequest.prototype.postData_ = null;


***REMOVED***
***REMOVED*** The XhrLte request if the request is using XMLHTTP
***REMOVED*** @type {goog.net.XhrIo}
***REMOVED*** @private
***REMOVED***
goog.net.ChannelRequest.prototype.xmlHttp_ = null;


***REMOVED***
***REMOVED*** The position of where the next unprocessed chunk starts in the response
***REMOVED*** text.
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.net.ChannelRequest.prototype.xmlHttpChunkStart_ = 0;


***REMOVED***
***REMOVED*** The Trident instance if the request is using Trident.
***REMOVED*** @type {ActiveXObject}
***REMOVED*** @private
***REMOVED***
goog.net.ChannelRequest.prototype.trident_ = null;


***REMOVED***
***REMOVED*** The verb (Get or Post) for the request.
***REMOVED*** @type {?string}
***REMOVED*** @private
***REMOVED***
goog.net.ChannelRequest.prototype.verb_ = null;


***REMOVED***
***REMOVED*** The last error if the request failed.
***REMOVED*** @type {?goog.net.ChannelRequest.Error}
***REMOVED*** @private
***REMOVED***
goog.net.ChannelRequest.prototype.lastError_ = null;


***REMOVED***
***REMOVED*** The last status code received.
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.net.ChannelRequest.prototype.lastStatusCode_ = -1;


***REMOVED***
***REMOVED*** Whether to send the Connection:close header as part of the request.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.net.ChannelRequest.prototype.sendClose_ = true;


***REMOVED***
***REMOVED*** Whether the request has been cancelled due to a call to cancel.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.net.ChannelRequest.prototype.cancelled_ = false;


***REMOVED***
***REMOVED*** A throttle time in ms for readystatechange events for the backchannel.
***REMOVED*** Useful for throttling when ready state is INTERACTIVE (partial data).
***REMOVED*** If set to zero no throttle is used.
***REMOVED***
***REMOVED*** @see goog.net.BrowserChannel.prototype.readyStateChangeThrottleMs_
***REMOVED***
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.net.ChannelRequest.prototype.readyStateChangeThrottleMs_ = 0;


***REMOVED***
***REMOVED*** The throttle for readystatechange events for the current request, or null
***REMOVED*** if there is none.
***REMOVED*** @type {goog.async.Throttle}
***REMOVED*** @private
***REMOVED***
goog.net.ChannelRequest.prototype.readyStateChangeThrottle_ = null;


***REMOVED***
***REMOVED*** Default timeout in MS for a request. The server must return data within this
***REMOVED*** time limit for the request to not timeout.
***REMOVED*** @type {number}
***REMOVED***
goog.net.ChannelRequest.TIMEOUT_MS = 45***REMOVED*** 1000;


***REMOVED***
***REMOVED*** How often to poll (in MS) for changes to responseText in browsers that don't
***REMOVED*** fire onreadystatechange during incremental loading of responseText.
***REMOVED*** @type {number}
***REMOVED***
goog.net.ChannelRequest.POLLING_INTERVAL_MS = 250;


***REMOVED***
***REMOVED*** Minimum version of Safari that receives a non-null responseText in ready
***REMOVED*** state interactive.
***REMOVED*** @type {string}
***REMOVED*** @private
***REMOVED***
goog.net.ChannelRequest.MIN_WEBKIT_FOR_INTERACTIVE_ = '420+';


***REMOVED***
***REMOVED*** Enum for channel requests type
***REMOVED*** @enum {number}
***REMOVED*** @private
***REMOVED***
goog.net.ChannelRequest.Type_ = {
 ***REMOVED*****REMOVED***
  ***REMOVED*** XMLHTTP requests.
 ***REMOVED*****REMOVED***
  XML_HTTP: 1,

 ***REMOVED*****REMOVED***
  ***REMOVED*** IMG requests.
 ***REMOVED*****REMOVED***
  IMG: 2,

 ***REMOVED*****REMOVED***
  ***REMOVED*** Requests that use the MSHTML ActiveX control.
 ***REMOVED*****REMOVED***
  TRIDENT: 3
***REMOVED***


***REMOVED***
***REMOVED*** Enum type for identifying a ChannelRequest error.
***REMOVED*** @enum {number}
***REMOVED***
goog.net.ChannelRequest.Error = {
 ***REMOVED*****REMOVED***
  ***REMOVED*** Errors due to a non-200 status code.
 ***REMOVED*****REMOVED***
  STATUS: 0,

 ***REMOVED*****REMOVED***
  ***REMOVED*** Errors due to no data being returned.
 ***REMOVED*****REMOVED***
  NO_DATA: 1,

 ***REMOVED*****REMOVED***
  ***REMOVED*** Errors due to a timeout.
 ***REMOVED*****REMOVED***
  TIMEOUT: 2,

 ***REMOVED*****REMOVED***
  ***REMOVED*** Errors due to the server returning an unknown.
 ***REMOVED*****REMOVED***
  UNKNOWN_SESSION_ID: 3,

 ***REMOVED*****REMOVED***
  ***REMOVED*** Errors due to bad data being received.
 ***REMOVED*****REMOVED***
  BAD_DATA: 4,

 ***REMOVED*****REMOVED***
  ***REMOVED*** Errors due to the handler throwing an exception.
 ***REMOVED*****REMOVED***
  HANDLER_EXCEPTION: 5,

 ***REMOVED*****REMOVED***
  ***REMOVED*** The browser declared itself offline during the request.
 ***REMOVED*****REMOVED***
  BROWSER_OFFLINE: 6,

 ***REMOVED*****REMOVED***
  ***REMOVED*** IE is blocking ActiveX streaming.
 ***REMOVED*****REMOVED***
  ACTIVE_X_BLOCKED: 7
***REMOVED***


***REMOVED***
***REMOVED*** Returns a useful error string for debugging based on the specified error
***REMOVED*** code.
***REMOVED*** @param {goog.net.ChannelRequest.Error} errorCode The error code.
***REMOVED*** @param {number} statusCode The HTTP status code.
***REMOVED*** @return {string} The error string for the given code combination.
***REMOVED***
goog.net.ChannelRequest.errorStringFromCode = function(errorCode, statusCode) {
  switch (errorCode) {
    case goog.net.ChannelRequest.Error.STATUS:
      return 'Non-200 return code (' + statusCode + ')';
    case goog.net.ChannelRequest.Error.NO_DATA:
      return 'XMLHTTP failure (no data)';
    case goog.net.ChannelRequest.Error.TIMEOUT:
      return 'HttpConnection timeout';
    default:
      return 'Unknown error';
  }
***REMOVED***


***REMOVED***
***REMOVED*** Sentinel value used to indicate an invalid chunk in a multi-chunk response.
***REMOVED*** @type {Object}
***REMOVED*** @private
***REMOVED***
goog.net.ChannelRequest.INVALID_CHUNK_ = {***REMOVED***


***REMOVED***
***REMOVED*** Sentinel value used to indicate an incomplete chunk in a multi-chunk
***REMOVED*** response.
***REMOVED*** @type {Object}
***REMOVED*** @private
***REMOVED***
goog.net.ChannelRequest.INCOMPLETE_CHUNK_ = {***REMOVED***


***REMOVED***
***REMOVED*** Returns whether XHR streaming is supported on this browser.
***REMOVED***
***REMOVED*** If XHR streaming is not supported, we will try to use an ActiveXObject
***REMOVED*** to create a Forever IFrame.
***REMOVED***
***REMOVED*** @return {boolean} Whether XHR streaming is supported.
***REMOVED*** @see http://code.google.com/p/closure-library/issues/detail?id=346
***REMOVED***
goog.net.ChannelRequest.supportsXhrStreaming = function() {
  return !goog.userAgent.IE || goog.userAgent.isDocumentModeOrHigher(10);
***REMOVED***


***REMOVED***
***REMOVED*** Sets extra HTTP headers to add to all the requests sent to the server.
***REMOVED***
***REMOVED*** @param {Object} extraHeaders The HTTP headers.
***REMOVED***
goog.net.ChannelRequest.prototype.setExtraHeaders = function(extraHeaders) {
  this.extraHeaders_ = extraHeaders;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the timeout for a request
***REMOVED***
***REMOVED*** @param {number} timeout   The timeout in MS for when we fail the request.
***REMOVED***
goog.net.ChannelRequest.prototype.setTimeout = function(timeout) {
  this.timeout_ = timeout;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the throttle for handling onreadystatechange events for the request.
***REMOVED***
***REMOVED*** @param {number} throttle The throttle in ms.  A value of zero indicates
***REMOVED***     no throttle.
***REMOVED***
goog.net.ChannelRequest.prototype.setReadyStateChangeThrottle = function(
    throttle) {
  this.readyStateChangeThrottleMs_ = throttle;
***REMOVED***


***REMOVED***
***REMOVED*** Uses XMLHTTP to send an HTTP POST to the server.
***REMOVED***
***REMOVED*** @param {goog.Uri} uri  The uri of the request.
***REMOVED*** @param {string} postData  The data for the post body.
***REMOVED*** @param {boolean} decodeChunks  Whether to the result is expected to be
***REMOVED***     encoded for chunking and thus requires decoding.
***REMOVED***
goog.net.ChannelRequest.prototype.xmlHttpPost = function(uri, postData,
                                                         decodeChunks) {
  this.type_ = goog.net.ChannelRequest.Type_.XML_HTTP;
  this.baseUri_ = uri.clone().makeUnique();
  this.postData_ = postData;
  this.decodeChunks_ = decodeChunks;
  this.sendXmlHttp_(null /* hostPrefix***REMOVED***);
***REMOVED***


***REMOVED***
***REMOVED*** Uses XMLHTTP to send an HTTP GET to the server.
***REMOVED***
***REMOVED*** @param {goog.Uri} uri  The uri of the request.
***REMOVED*** @param {boolean} decodeChunks  Whether to the result is expected to be
***REMOVED***     encoded for chunking and thus requires decoding.
***REMOVED*** @param {?string} hostPrefix  The host prefix, if we might be using a
***REMOVED***     secondary domain.  Note that it should also be in the URL, adding this
***REMOVED***     won't cause it to be added to the URL.
***REMOVED*** @param {boolean=} opt_noClose   Whether to request that the tcp/ip connection
***REMOVED***     should be closed.
***REMOVED***
goog.net.ChannelRequest.prototype.xmlHttpGet = function(uri, decodeChunks,
    hostPrefix, opt_noClose) {
  this.type_ = goog.net.ChannelRequest.Type_.XML_HTTP;
  this.baseUri_ = uri.clone().makeUnique();
  this.postData_ = null;
  this.decodeChunks_ = decodeChunks;
  if (opt_noClose) {
    this.sendClose_ = false;
  }
  this.sendXmlHttp_(hostPrefix);
***REMOVED***


***REMOVED***
***REMOVED*** Sends a request via XMLHTTP according to the current state of the
***REMOVED*** ChannelRequest object.
***REMOVED***
***REMOVED*** @param {?string} hostPrefix The host prefix, if we might be using a secondary
***REMOVED***     domain.
***REMOVED*** @private
***REMOVED***
goog.net.ChannelRequest.prototype.sendXmlHttp_ = function(hostPrefix) {
  this.requestStartTime_ = goog.now();
  this.ensureWatchDogTimer_();

  // clone the base URI to create the request URI. The request uri has the
  // attempt number as a parameter which helps in debugging.
  this.requestUri_ = this.baseUri_.clone();
  this.requestUri_.setParameterValues('t', this.retryId_);

  // send the request either as a POST or GET
  this.xmlHttpChunkStart_ = 0;
  var useSecondaryDomains = this.channel_.shouldUseSecondaryDomains();
  this.xmlHttp_ = this.channel_.createXhrIo(useSecondaryDomains ?
      hostPrefix : null);

  if (this.readyStateChangeThrottleMs_ > 0) {
    this.readyStateChangeThrottle_ = new goog.async.Throttle(
        goog.bind(this.xmlHttpHandler_, this, this.xmlHttp_),
        this.readyStateChangeThrottleMs_);
  }

  this.eventHandler_.listen(this.xmlHttp_,
      goog.net.EventType.READY_STATE_CHANGE,
      this.readyStateChangeHandler_);

  var headers = this.extraHeaders_ ? goog.object.clone(this.extraHeaders_) : {***REMOVED***
  if (this.postData_) {
    // todo (jonp) - use POST constant when Dan defines it
    this.verb_ = 'POST';
    headers['Content-Type'] = 'application/x-www-form-urlencoded';
    this.xmlHttp_.send(this.requestUri_, this.verb_, this.postData_, headers);
  } else {
    // todo (jonp) - use GET constant when Dan defines it
    this.verb_ = 'GET';

    // If the user agent is webkit, we cannot send the close header since it is
    // disallowed by the browser.  If we attempt to set the "Connection: close"
    // header in WEBKIT browser, it will actually causes an error message.
    if (this.sendClose_ && !goog.userAgent.WEBKIT) {
      headers['Connection'] = 'close';
    }
    this.xmlHttp_.send(this.requestUri_, this.verb_, null, headers);
  }
  this.channel_.notifyServerReachabilityEvent(
     ***REMOVED*****REMOVED*** @suppress {missingRequire}***REMOVED*** (
      goog.net.BrowserChannel.ServerReachability.REQUEST_MADE));
  this.channelDebug_.xmlHttpChannelRequest(this.verb_,
      this.requestUri_, this.rid_, this.retryId_,
      this.postData_);
***REMOVED***


***REMOVED***
***REMOVED*** Handles a readystatechange event.
***REMOVED*** @param {goog.events.Event} evt The event.
***REMOVED*** @private
***REMOVED***
goog.net.ChannelRequest.prototype.readyStateChangeHandler_ = function(evt) {
  var xhr =***REMOVED*****REMOVED*** @type {goog.net.XhrIo}***REMOVED*** (evt.target);
  var throttle = this.readyStateChangeThrottle_;
  if (throttle &&
      xhr.getReadyState() == goog.net.XmlHttp.ReadyState.INTERACTIVE) {
    // Only throttle in the partial data case.
    this.channelDebug_.debug('Throttling readystatechange.');
    throttle.fire();
  } else {
    // If we haven't throttled, just handle response directly.
    this.xmlHttpHandler_(xhr);
  }
***REMOVED***


***REMOVED***
***REMOVED*** XmlHttp handler
***REMOVED*** @param {goog.net.XhrIo} xmlhttp The XhrIo object for the current request.
***REMOVED*** @private
***REMOVED***
goog.net.ChannelRequest.prototype.xmlHttpHandler_ = function(xmlhttp) {
 ***REMOVED*****REMOVED*** @suppress {missingRequire}***REMOVED***
  goog.net.BrowserChannel.onStartExecution();

 ***REMOVED*****REMOVED*** @preserveTry***REMOVED***
  try {
    if (xmlhttp == this.xmlHttp_) {
      this.onXmlHttpReadyStateChanged_();
    } else {
      this.channelDebug_.warning('Called back with an ' +
                                     'unexpected xmlhttp');
    }
  } catch (ex) {
    this.channelDebug_.debug('Failed call to OnXmlHttpReadyStateChanged_');
    if (this.xmlHttp_ && this.xmlHttp_.getResponseText()) {
      this.channelDebug_.dumpException(ex,
          'ResponseText: ' + this.xmlHttp_.getResponseText());
    } else {
      this.channelDebug_.dumpException(ex, 'No response text');
    }
  } finally {
   ***REMOVED*****REMOVED*** @suppress {missingRequire}***REMOVED***
    goog.net.BrowserChannel.onEndExecution();
  }
***REMOVED***


***REMOVED***
***REMOVED*** Called by the readystate handler for XMLHTTP requests.
***REMOVED***
***REMOVED*** @private
***REMOVED***
goog.net.ChannelRequest.prototype.onXmlHttpReadyStateChanged_ = function() {
  var readyState = this.xmlHttp_.getReadyState();
  var errorCode = this.xmlHttp_.getLastErrorCode();
  var statusCode = this.xmlHttp_.getStatus();
  // If it is Safari less than 420+, there is a bug that causes null to be
  // in the responseText on ready state interactive so we must wait for
  // ready state complete.
  if (!goog.net.ChannelRequest.supportsXhrStreaming() ||
      (goog.userAgent.WEBKIT &&
       !goog.userAgent.isVersionOrHigher(
           goog.net.ChannelRequest.MIN_WEBKIT_FOR_INTERACTIVE_))) {
    if (readyState < goog.net.XmlHttp.ReadyState.COMPLETE) {
      // not yet ready
      return;
    }
  } else {
    // we get partial results in browsers that support ready state interactive.
    // We also make sure that getResponseText is not null in interactive mode
    // before we continue.  However, we don't do it in Opera because it only
    // fire readyState == INTERACTIVE once.  We need the following code to poll
    if (readyState < goog.net.XmlHttp.ReadyState.INTERACTIVE ||
        readyState == goog.net.XmlHttp.ReadyState.INTERACTIVE &&
        !goog.userAgent.OPERA && !this.xmlHttp_.getResponseText()) {
      // not yet ready
      return;
    }
  }

  // Dispatch any appropriate network events.
  if (!this.cancelled_ && readyState == goog.net.XmlHttp.ReadyState.COMPLETE &&
      errorCode != goog.net.ErrorCode.ABORT) {

    // Pretty conservative, these are the only known scenarios which we'd
    // consider indicative of a truly non-functional network connection.
    if (errorCode == goog.net.ErrorCode.TIMEOUT ||
        statusCode <= 0) {
      this.channel_.notifyServerReachabilityEvent(
         ***REMOVED*****REMOVED*** @suppress {missingRequire}***REMOVED***
          goog.net.BrowserChannel.ServerReachability.REQUEST_FAILED);
    } else {
      this.channel_.notifyServerReachabilityEvent(
         ***REMOVED*****REMOVED*** @suppress {missingRequire}***REMOVED***
          goog.net.BrowserChannel.ServerReachability.REQUEST_SUCCEEDED);
    }
  }

  // got some data so cancel the watchdog timer
  this.cancelWatchDogTimer_();

  var status = this.xmlHttp_.getStatus();
  this.lastStatusCode_ = status;
  var responseText = this.xmlHttp_.getResponseText();
  if (!responseText) {
    this.channelDebug_.debug('No response text for uri ' +
        this.requestUri_ + ' status ' + status);
  }
  this.successful_ = (status == 200);

  this.channelDebug_.xmlHttpChannelResponseMetaData(
     ***REMOVED*****REMOVED*** @type {string}***REMOVED*** (this.verb_),
      this.requestUri_, this.rid_, this.retryId_, readyState,
      status);

  if (!this.successful_) {
    if (status == 400 &&
        responseText.indexOf('Unknown SID') > 0) {
      // the server error string will include 'Unknown SID' which indicates the
      // server doesn't know about the session (maybe it got restarted, maybe
      // the user got moved to another server, etc.,). Handlers can special
      // case this error
      this.lastError_ = goog.net.ChannelRequest.Error.UNKNOWN_SESSION_ID;
     ***REMOVED*****REMOVED*** @suppress {missingRequire}***REMOVED***
      goog.net.BrowserChannel.notifyStatEvent(
         ***REMOVED*****REMOVED*** @suppress {missingRequire}***REMOVED***
          goog.net.BrowserChannel.Stat.REQUEST_UNKNOWN_SESSION_ID);
      this.channelDebug_.warning('XMLHTTP Unknown SID (' + this.rid_ + ')');
    } else {
      this.lastError_ = goog.net.ChannelRequest.Error.STATUS;
     ***REMOVED*****REMOVED*** @suppress {missingRequire}***REMOVED***
      goog.net.BrowserChannel.notifyStatEvent(
         ***REMOVED*****REMOVED*** @suppress {missingRequire}***REMOVED***
          goog.net.BrowserChannel.Stat.REQUEST_BAD_STATUS);
      this.channelDebug_.warning(
          'XMLHTTP Bad status ' + status + ' (' + this.rid_ + ')');
    }
    this.cleanup_();
    this.dispatchFailure_();
    return;
  }

  if (readyState == goog.net.XmlHttp.ReadyState.COMPLETE) {
    this.cleanup_();
  }

  if (this.decodeChunks_) {
    this.decodeNextChunks_(readyState, responseText);
    if (goog.userAgent.OPERA && this.successful_ &&
        readyState == goog.net.XmlHttp.ReadyState.INTERACTIVE) {
      this.startPolling_();
    }
  } else {
    this.channelDebug_.xmlHttpChannelResponseText(
        this.rid_, responseText, null);
    this.safeOnRequestData_(responseText);
  }

  if (!this.successful_) {
    return;
  }

  if (!this.cancelled_) {
    if (readyState == goog.net.XmlHttp.ReadyState.COMPLETE) {
      this.channel_.onRequestComplete(this);
    } else {
      // The default is false, the result from this callback shouldn't carry
      // over to the next callback, otherwise the request looks successful if
      // the watchdog timer gets called
      this.successful_ = false;
      this.ensureWatchDogTimer_();
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** Decodes the next set of available chunks in the response.
***REMOVED*** @param {number} readyState The value of readyState.
***REMOVED*** @param {string} responseText The value of responseText.
***REMOVED*** @private
***REMOVED***
goog.net.ChannelRequest.prototype.decodeNextChunks_ = function(readyState,
        responseText) {
  var decodeNextChunksSuccessful = true;
  while (!this.cancelled_ &&
         this.xmlHttpChunkStart_ < responseText.length) {
    var chunkText = this.getNextChunk_(responseText);
    if (chunkText == goog.net.ChannelRequest.INCOMPLETE_CHUNK_) {
      if (readyState == goog.net.XmlHttp.ReadyState.COMPLETE) {
        // should have consumed entire response when the request is done
        this.lastError_ = goog.net.ChannelRequest.Error.BAD_DATA;
       ***REMOVED*****REMOVED*** @suppress {missingRequire}***REMOVED***
        goog.net.BrowserChannel.notifyStatEvent(
           ***REMOVED*****REMOVED*** @suppress {missingRequire}***REMOVED***
            goog.net.BrowserChannel.Stat.REQUEST_INCOMPLETE_DATA);
        decodeNextChunksSuccessful = false;
      }
      this.channelDebug_.xmlHttpChannelResponseText(
          this.rid_, null, '[Incomplete Response]');
      break;
    } else if (chunkText == goog.net.ChannelRequest.INVALID_CHUNK_) {
      this.lastError_ = goog.net.ChannelRequest.Error.BAD_DATA;
     ***REMOVED*****REMOVED*** @suppress {missingRequire}***REMOVED***
      goog.net.BrowserChannel.notifyStatEvent(
         ***REMOVED*****REMOVED*** @suppress {missingRequire}***REMOVED***
          goog.net.BrowserChannel.Stat.REQUEST_BAD_DATA);
      this.channelDebug_.xmlHttpChannelResponseText(
          this.rid_, responseText, '[Invalid Chunk]');
      decodeNextChunksSuccessful = false;
      break;
    } else {
      this.channelDebug_.xmlHttpChannelResponseText(
          this.rid_,***REMOVED*****REMOVED*** @type {string}***REMOVED*** (chunkText), null);
      this.safeOnRequestData_(***REMOVED*** @type {string}***REMOVED*** (chunkText));
    }
  }
  if (readyState == goog.net.XmlHttp.ReadyState.COMPLETE &&
      responseText.length == 0) {
    // also an error if we didn't get any response
    this.lastError_ = goog.net.ChannelRequest.Error.NO_DATA;
   ***REMOVED*****REMOVED*** @suppress {missingRequire}***REMOVED***
    goog.net.BrowserChannel.notifyStatEvent(
       ***REMOVED*****REMOVED*** @suppress {missingRequire}***REMOVED***
        goog.net.BrowserChannel.Stat.REQUEST_NO_DATA);
    decodeNextChunksSuccessful = false;
  }
  this.successful_ = this.successful_ && decodeNextChunksSuccessful;
  if (!decodeNextChunksSuccessful) {
    // malformed response - we make this trigger retry logic
    this.channelDebug_.xmlHttpChannelResponseText(
        this.rid_, responseText, '[Invalid Chunked Response]');
    this.cleanup_();
    this.dispatchFailure_();
  }
***REMOVED***


***REMOVED***
***REMOVED*** Polls the response for new data.
***REMOVED*** @private
***REMOVED***
goog.net.ChannelRequest.prototype.pollResponse_ = function() {
  var readyState = this.xmlHttp_.getReadyState();
  var responseText = this.xmlHttp_.getResponseText();
  if (this.xmlHttpChunkStart_ < responseText.length) {
    this.cancelWatchDogTimer_();
    this.decodeNextChunks_(readyState, responseText);
    if (this.successful_ &&
        readyState != goog.net.XmlHttp.ReadyState.COMPLETE) {
      this.ensureWatchDogTimer_();
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** Starts a polling interval for changes to responseText of the
***REMOVED*** XMLHttpRequest, for browsers that don't fire onreadystatechange
***REMOVED*** as data comes in incrementally.  This timer is disabled in
***REMOVED*** cleanup_().
***REMOVED*** @private
***REMOVED***
goog.net.ChannelRequest.prototype.startPolling_ = function() {
  this.eventHandler_.listen(this.pollingTimer_, goog.Timer.TICK,
      this.pollResponse_);
  this.pollingTimer_.start();
***REMOVED***


***REMOVED***
***REMOVED*** Called when the browser declares itself offline at the start of a request or
***REMOVED*** during its lifetime.  Abandons that request.
***REMOVED*** @private
***REMOVED***
goog.net.ChannelRequest.prototype.cancelRequestAsBrowserIsOffline_ =
    function() {
  if (this.successful_) {
    // Should never happen.
    this.channelDebug_.severe(
        'Received browser offline event even though request completed ' +
        'successfully');
  }

  this.channelDebug_.browserOfflineResponse(this.requestUri_);
  this.cleanup_();

  // set error and dispatch failure
  this.lastError_ = goog.net.ChannelRequest.Error.BROWSER_OFFLINE;
 ***REMOVED*****REMOVED*** @suppress {missingRequire}***REMOVED***
  goog.net.BrowserChannel.notifyStatEvent(
     ***REMOVED*****REMOVED*** @suppress {missingRequire}***REMOVED***
      goog.net.BrowserChannel.Stat.BROWSER_OFFLINE);
  this.dispatchFailure_();
***REMOVED***


***REMOVED***
***REMOVED*** Returns the next chunk of a chunk-encoded response. This is not standard
***REMOVED*** HTTP chunked encoding because browsers don't expose the chunk boundaries to
***REMOVED*** the application through XMLHTTP. So we have an additional chunk encoding at
***REMOVED*** the application level that lets us tell where the beginning and end of
***REMOVED*** individual responses are so that we can only try to eval a complete JS array.
***REMOVED***
***REMOVED*** The encoding is the size of the chunk encoded as a decimal string followed
***REMOVED*** by a newline followed by the data.
***REMOVED***
***REMOVED*** @param {string} responseText The response text from the XMLHTTP response.
***REMOVED*** @return {string|Object} The next chunk string or a sentinel object
***REMOVED***                         indicating a special condition.
***REMOVED*** @private
***REMOVED***
goog.net.ChannelRequest.prototype.getNextChunk_ = function(responseText) {
  var sizeStartIndex = this.xmlHttpChunkStart_;
  var sizeEndIndex = responseText.indexOf('\n', sizeStartIndex);
  if (sizeEndIndex == -1) {
    return goog.net.ChannelRequest.INCOMPLETE_CHUNK_;
  }

  var sizeAsString = responseText.substring(sizeStartIndex, sizeEndIndex);
  var size = Number(sizeAsString);
  if (isNaN(size)) {
    return goog.net.ChannelRequest.INVALID_CHUNK_;
  }

  var chunkStartIndex = sizeEndIndex + 1;
  if (chunkStartIndex + size > responseText.length) {
    return goog.net.ChannelRequest.INCOMPLETE_CHUNK_;
  }

  var chunkText = responseText.substr(chunkStartIndex, size);
  this.xmlHttpChunkStart_ = chunkStartIndex + size;
  return chunkText;
***REMOVED***


***REMOVED***
***REMOVED*** Uses the Trident htmlfile ActiveX control to send a GET request in IE. This
***REMOVED*** is the innovation discovered that lets us get intermediate results in
***REMOVED*** Internet Explorer.  Thanks to http://go/kev
***REMOVED*** @param {goog.Uri} uri The uri to request from.
***REMOVED*** @param {boolean} usingSecondaryDomain Whether to use a secondary domain.
***REMOVED***
goog.net.ChannelRequest.prototype.tridentGet = function(uri,
    usingSecondaryDomain) {
  this.type_ = goog.net.ChannelRequest.Type_.TRIDENT;
  this.baseUri_ = uri.clone().makeUnique();
  this.tridentGet_(usingSecondaryDomain);
***REMOVED***


***REMOVED***
***REMOVED*** Starts the Trident request.
***REMOVED*** @param {boolean} usingSecondaryDomain Whether to use a secondary domain.
***REMOVED*** @private
***REMOVED***
goog.net.ChannelRequest.prototype.tridentGet_ = function(usingSecondaryDomain) {
  this.requestStartTime_ = goog.now();
  this.ensureWatchDogTimer_();

  var hostname = usingSecondaryDomain ? window.location.hostname : '';
  this.requestUri_ = this.baseUri_.clone();
  this.requestUri_.setParameterValue('DOMAIN', hostname);
  this.requestUri_.setParameterValue('t', this.retryId_);

  try {
    this.trident_ = new ActiveXObject('htmlfile');
  } catch (e) {
    this.channelDebug_.severe('ActiveX blocked');
    this.cleanup_();

    this.lastError_ = goog.net.ChannelRequest.Error.ACTIVE_X_BLOCKED;
   ***REMOVED*****REMOVED*** @suppress {missingRequire}***REMOVED***
    goog.net.BrowserChannel.notifyStatEvent(
       ***REMOVED*****REMOVED*** @suppress {missingRequire}***REMOVED***
        goog.net.BrowserChannel.Stat.ACTIVE_X_BLOCKED);
    this.dispatchFailure_();
    return;
  }

  var body = '<html><body>';
  if (usingSecondaryDomain) {
    body += '<script>document.domain="' + hostname + '"</scr' + 'ipt>';
  }
  body += '</body></html>';

  this.trident_.open();
  this.trident_.write(body);
  this.trident_.close();

  this.trident_.parentWindow['m'] = goog.bind(this.onTridentRpcMessage_, this);
  this.trident_.parentWindow['d'] = goog.bind(this.onTridentDone_, this, true);
  this.trident_.parentWindow['rpcClose'] =
      goog.bind(this.onTridentDone_, this, false);

  var div = this.trident_.createElement('div');
  this.trident_.parentWindow.document.body.appendChild(div);
  div.innerHTML = '<iframe src="' + this.requestUri_ + '"></iframe>';
  this.channelDebug_.tridentChannelRequest('GET',
      this.requestUri_, this.rid_, this.retryId_);
  this.channel_.notifyServerReachabilityEvent(
     ***REMOVED*****REMOVED*** @suppress {missingRequire}***REMOVED***
      goog.net.BrowserChannel.ServerReachability.REQUEST_MADE);
***REMOVED***


***REMOVED***
***REMOVED*** Callback from the Trident htmlfile ActiveX control for when a new message
***REMOVED*** is received.
***REMOVED***
***REMOVED*** @param {string} msg The data payload.
***REMOVED*** @private
***REMOVED***
goog.net.ChannelRequest.prototype.onTridentRpcMessage_ = function(msg) {
  // need to do async b/c this gets called off of the context of the ActiveX
 ***REMOVED*****REMOVED*** @suppress {missingRequire}***REMOVED***
  goog.net.BrowserChannel.setTimeout(
      goog.bind(this.onTridentRpcMessageAsync_, this, msg), 0);
***REMOVED***


***REMOVED***
***REMOVED*** Callback from the Trident htmlfile ActiveX control for when a new message
***REMOVED*** is received.
***REMOVED***
***REMOVED*** @param {string} msg  The data payload.
***REMOVED*** @private
***REMOVED***
goog.net.ChannelRequest.prototype.onTridentRpcMessageAsync_ = function(msg) {
  if (this.cancelled_) {
    return;
  }
  this.channelDebug_.tridentChannelResponseText(this.rid_, msg);
  this.cancelWatchDogTimer_();
  this.safeOnRequestData_(msg);
  this.ensureWatchDogTimer_();
***REMOVED***


***REMOVED***
***REMOVED*** Callback from the Trident htmlfile ActiveX control for when the request
***REMOVED*** is complete
***REMOVED***
***REMOVED*** @param {boolean} successful Whether the request successfully completed.
***REMOVED*** @private
***REMOVED***
goog.net.ChannelRequest.prototype.onTridentDone_ = function(successful) {
  // need to do async b/c this gets called off of the context of the ActiveX
 ***REMOVED*****REMOVED*** @suppress {missingRequire}***REMOVED***
  goog.net.BrowserChannel.setTimeout(
      goog.bind(this.onTridentDoneAsync_, this, successful), 0);
***REMOVED***


***REMOVED***
***REMOVED*** Callback from the Trident htmlfile ActiveX control for when the request
***REMOVED*** is complete
***REMOVED***
***REMOVED*** @param {boolean} successful Whether the request successfully completed.
***REMOVED*** @private
***REMOVED***
goog.net.ChannelRequest.prototype.onTridentDoneAsync_ = function(successful) {
  if (this.cancelled_) {
    return;
  }
  this.channelDebug_.tridentChannelResponseDone(
      this.rid_, successful);
  this.cleanup_();
  this.successful_ = successful;
  this.channel_.onRequestComplete(this);
  this.channel_.notifyServerReachabilityEvent(
     ***REMOVED*****REMOVED*** @suppress {missingRequire}***REMOVED***
      goog.net.BrowserChannel.ServerReachability.BACK_CHANNEL_ACTIVITY);
***REMOVED***


***REMOVED***
***REMOVED*** Uses an IMG tag to send an HTTP get to the server. This is only currently
***REMOVED*** used to terminate the connection, as an IMG tag is the most reliable way to
***REMOVED*** send something to the server while the page is getting torn down.
***REMOVED*** @param {goog.Uri} uri The uri to send a request to.
***REMOVED***
goog.net.ChannelRequest.prototype.sendUsingImgTag = function(uri) {
  this.type_ = goog.net.ChannelRequest.Type_.IMG;
  this.baseUri_ = uri.clone().makeUnique();
  this.imgTagGet_();
***REMOVED***


***REMOVED***
***REMOVED*** Starts the IMG request.
***REMOVED***
***REMOVED*** @private
***REMOVED***
goog.net.ChannelRequest.prototype.imgTagGet_ = function() {
  var eltImg = new Image();
  eltImg.src = this.baseUri_;
  this.requestStartTime_ = goog.now();
  this.ensureWatchDogTimer_();
***REMOVED***


***REMOVED***
***REMOVED*** Cancels the request no matter what the underlying transport is.
***REMOVED***
goog.net.ChannelRequest.prototype.cancel = function() {
  this.cancelled_ = true;
  this.cleanup_();
***REMOVED***


***REMOVED***
***REMOVED*** Ensures that there is watchdog timeout which is used to ensure that
***REMOVED*** the connection completes in time.
***REMOVED***
***REMOVED*** @private
***REMOVED***
goog.net.ChannelRequest.prototype.ensureWatchDogTimer_ = function() {
  this.watchDogTimeoutTime_ = goog.now() + this.timeout_;
  this.startWatchDogTimer_(this.timeout_);
***REMOVED***


***REMOVED***
***REMOVED*** Starts the watchdog timer which is used to ensure that the connection
***REMOVED*** completes in time.
***REMOVED*** @param {number} time The number of milliseconds to wait.
***REMOVED*** @private
***REMOVED***
goog.net.ChannelRequest.prototype.startWatchDogTimer_ = function(time) {
  if (this.watchDogTimerId_ != null) {
    // assertion
    throw Error('WatchDog timer not null');
  }
  this.watchDogTimerId_ =  ***REMOVED*****REMOVED*** @suppress {missingRequire}***REMOVED*** (
      goog.net.BrowserChannel.setTimeout(
          goog.bind(this.onWatchDogTimeout_, this), time));
***REMOVED***


***REMOVED***
***REMOVED*** Cancels the watchdog timer if it has been started.
***REMOVED***
***REMOVED*** @private
***REMOVED***
goog.net.ChannelRequest.prototype.cancelWatchDogTimer_ = function() {
  if (this.watchDogTimerId_) {
    goog.global.clearTimeout(this.watchDogTimerId_);
    this.watchDogTimerId_ = null;
  }
***REMOVED***


***REMOVED***
***REMOVED*** Called when the watchdog timer is triggered. It also handles a case where it
***REMOVED*** is called too early which we suspect may be happening sometimes
***REMOVED*** (not sure why)
***REMOVED***
***REMOVED*** @private
***REMOVED***
goog.net.ChannelRequest.prototype.onWatchDogTimeout_ = function() {
  this.watchDogTimerId_ = null;
  var now = goog.now();
  if (now - this.watchDogTimeoutTime_ >= 0) {
    this.handleTimeout_();
  } else {
    // got called too early for some reason
    this.channelDebug_.warning('WatchDog timer called too early');
    this.startWatchDogTimer_(this.watchDogTimeoutTime_ - now);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Called when the request has actually timed out. Will cleanup and notify the
***REMOVED*** channel of the failure.
***REMOVED***
***REMOVED*** @private
***REMOVED***
goog.net.ChannelRequest.prototype.handleTimeout_ = function() {
  if (this.successful_) {
    // Should never happen.
    this.channelDebug_.severe(
        'Received watchdog timeout even though request loaded successfully');
  }

  this.channelDebug_.timeoutResponse(this.requestUri_);
  // IMG requests never notice if they were successful, and always 'time out'.
  // This fact says nothing about reachability.
  if (this.type_ != goog.net.ChannelRequest.Type_.IMG) {
    this.channel_.notifyServerReachabilityEvent(
       ***REMOVED*****REMOVED*** @suppress {missingRequire}***REMOVED***
        goog.net.BrowserChannel.ServerReachability.REQUEST_FAILED);
  }
  this.cleanup_();

  // set error and dispatch failure
  this.lastError_ = goog.net.ChannelRequest.Error.TIMEOUT;
 ***REMOVED*****REMOVED*** @suppress {missingRequire}***REMOVED***
  goog.net.BrowserChannel.notifyStatEvent(
     ***REMOVED*****REMOVED*** @suppress {missingRequire}***REMOVED***
      goog.net.BrowserChannel.Stat.REQUEST_TIMEOUT);
  this.dispatchFailure_();
***REMOVED***


***REMOVED***
***REMOVED*** Notifies the channel that this request failed.
***REMOVED*** @private
***REMOVED***
goog.net.ChannelRequest.prototype.dispatchFailure_ = function() {
  if (this.channel_.isClosed() || this.cancelled_) {
    return;
  }

  this.channel_.onRequestComplete(this);
***REMOVED***


***REMOVED***
***REMOVED*** Cleans up the objects used to make the request. This function is
***REMOVED*** idempotent.
***REMOVED***
***REMOVED*** @private
***REMOVED***
goog.net.ChannelRequest.prototype.cleanup_ = function() {
  this.cancelWatchDogTimer_();

  goog.dispose(this.readyStateChangeThrottle_);
  this.readyStateChangeThrottle_ = null;

  // Stop the polling timer, if necessary.
  this.pollingTimer_.stop();

  // Unhook all event handlers.
  this.eventHandler_.removeAll();

  if (this.xmlHttp_) {
    // clear out this.xmlHttp_ before aborting so we handle getting reentered
    // inside abort
    var xmlhttp = this.xmlHttp_;
    this.xmlHttp_ = null;
    xmlhttp.abort();
    xmlhttp.dispose();
  }

  if (this.trident_) {
    this.trident_ = null;
  }
***REMOVED***


***REMOVED***
***REMOVED*** Indicates whether the request was successful. Only valid after the handler
***REMOVED*** is called to indicate completion of the request.
***REMOVED***
***REMOVED*** @return {boolean} True if the request succeeded.
***REMOVED***
goog.net.ChannelRequest.prototype.getSuccess = function() {
  return this.successful_;
***REMOVED***


***REMOVED***
***REMOVED*** If the request was not successful, returns the reason.
***REMOVED***
***REMOVED*** @return {?goog.net.ChannelRequest.Error}  The last error.
***REMOVED***
goog.net.ChannelRequest.prototype.getLastError = function() {
  return this.lastError_;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the status code of the last request.
***REMOVED*** @return {number} The status code of the last request.
***REMOVED***
goog.net.ChannelRequest.prototype.getLastStatusCode = function() {
  return this.lastStatusCode_;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the session id for this channel.
***REMOVED***
***REMOVED*** @return {string|undefined} The session ID.
***REMOVED***
goog.net.ChannelRequest.prototype.getSessionId = function() {
  return this.sid_;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the request id for this request. Each request has a unique request
***REMOVED*** id and the request IDs are a sequential increasing count.
***REMOVED***
***REMOVED*** @return {string|number|undefined} The request ID.
***REMOVED***
goog.net.ChannelRequest.prototype.getRequestId = function() {
  return this.rid_;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the data for a post, if this request is a post.
***REMOVED***
***REMOVED*** @return {?string} The POST data provided by the request initiator.
***REMOVED***
goog.net.ChannelRequest.prototype.getPostData = function() {
  return this.postData_;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the time that the request started, if it has started.
***REMOVED***
***REMOVED*** @return {?number} The time the request started, as returned by goog.now().
***REMOVED***
goog.net.ChannelRequest.prototype.getRequestStartTime = function() {
  return this.requestStartTime_;
***REMOVED***


***REMOVED***
***REMOVED*** Helper to call the callback's onRequestData, which catches any
***REMOVED*** exception and cleans up the request.
***REMOVED*** @param {string} data The request data.
***REMOVED*** @private
***REMOVED***
goog.net.ChannelRequest.prototype.safeOnRequestData_ = function(data) {
 ***REMOVED*****REMOVED*** @preserveTry***REMOVED***
  try {
    this.channel_.onRequestData(this, data);
    this.channel_.notifyServerReachabilityEvent(
       ***REMOVED*****REMOVED*** @suppress {missingRequire}***REMOVED***
        goog.net.BrowserChannel.ServerReachability.BACK_CHANNEL_ACTIVITY);
  } catch (e) {
    // Dump debug info, but keep going without closing the channel.
    this.channelDebug_.dumpException(
        e, 'Error in httprequest callback');
  }
***REMOVED***
