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
***REMOVED*** @fileoverview A pool of forward channel requests to enable real-time
***REMOVED*** messaging from the client to server.
***REMOVED***
***REMOVED*** @visibility {:internal}
***REMOVED***


goog.provide('goog.labs.net.webChannel.ForwardChannelRequestPool');

goog.require('goog.array');
goog.require('goog.string');
goog.require('goog.structs.Set');

goog.scope(function() {
// type checking only (no require)
var ChannelRequest = goog.labs.net.webChannel.ChannelRequest;



***REMOVED***
***REMOVED*** This class represents the state of all forward channel requests.
***REMOVED***
***REMOVED*** @param {number=} opt_maxPoolSize The maximum pool size.
***REMOVED***
***REMOVED***
***REMOVED*** @final
***REMOVED***
goog.labs.net.webChannel.ForwardChannelRequestPool = function(opt_maxPoolSize) {
 ***REMOVED*****REMOVED***
  ***REMOVED*** THe max pool size as configured.
  ***REMOVED***
  ***REMOVED*** @private {number}
 ***REMOVED*****REMOVED***
  this.maxPoolSizeConfigured_ = opt_maxPoolSize ||
          goog.labs.net.webChannel.ForwardChannelRequestPool.MAX_POOL_SIZE_;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The current size limit of the request pool. This limit is meant to be
  ***REMOVED*** read-only after the channel is fully opened.
  ***REMOVED***
  ***REMOVED*** If SPDY is enabled, set it to the max pool size, which is also
  ***REMOVED*** configurable.
  ***REMOVED***
  ***REMOVED*** @private {number}
 ***REMOVED*****REMOVED***
  this.maxSize_ = ForwardChannelRequestPool.isSpdyEnabled_() ?
      this.maxPoolSizeConfigured_ : 1;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The container for all the pending request objects.
  ***REMOVED***
  ***REMOVED*** @private {goog.structs.Set.<ChannelRequest>}
 ***REMOVED*****REMOVED***
  this.requestPool_ = null;

  if (this.maxSize_ > 1) {
    this.requestPool_ = new goog.structs.Set();
  }

 ***REMOVED*****REMOVED***
  ***REMOVED*** The single request object when the pool size is limited to one.
  ***REMOVED***
  ***REMOVED*** @private {ChannelRequest}
 ***REMOVED*****REMOVED***
  this.request_ = null;
***REMOVED***

var ForwardChannelRequestPool =
    goog.labs.net.webChannel.ForwardChannelRequestPool;


***REMOVED***
***REMOVED*** The default size limit of the request pool.
***REMOVED***
***REMOVED*** @private {number}
***REMOVED***
ForwardChannelRequestPool.MAX_POOL_SIZE_ = 10;


***REMOVED***
***REMOVED*** @return {boolean} True if SPDY is enabled for the current page using
***REMOVED***     chrome specific APIs.
***REMOVED*** @private
***REMOVED***
ForwardChannelRequestPool.isSpdyEnabled_ = function() {
  return !!(window.chrome && window.chrome.loadTimes &&
      window.chrome.loadTimes() && window.chrome.loadTimes().wasFetchedViaSpdy);
***REMOVED***


***REMOVED***
***REMOVED*** Once we know the client protocol (from the handshake), check if we need
***REMOVED*** enable the request pool accordingly. This is more robust than using
***REMOVED*** browser-internal APIs (specific to Chrome).
***REMOVED***
***REMOVED*** @param {string} clientProtocol The client protocol
***REMOVED***
ForwardChannelRequestPool.prototype.applyClientProtocol = function(
    clientProtocol) {
  if (this.requestPool_) {
    return;
  }

  if (goog.string.contains(clientProtocol, 'spdy') ||
      goog.string.contains(clientProtocol, 'quic')) {
    this.maxSize_ = this.maxPoolSizeConfigured_;
    this.requestPool_ = new goog.structs.Set();
    if (this.request_) {
      this.addRequest(this.request_);
      this.request_ = null;
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} True if the pool is full.
***REMOVED***
ForwardChannelRequestPool.prototype.isFull = function() {
  if (this.request_) {
    return true;
  }

  if (this.requestPool_) {
    return this.requestPool_.getCount() >= this.maxSize_;
  }

  return false;
***REMOVED***


***REMOVED***
***REMOVED*** @return {number} The current size limit.
***REMOVED***
ForwardChannelRequestPool.prototype.getMaxSize = function() {
  return this.maxSize_;
***REMOVED***


***REMOVED***
***REMOVED*** @return {number} The number of pending requests in the pool.
***REMOVED***
ForwardChannelRequestPool.prototype.getRequestCount = function() {
  if (this.request_) {
    return 1;
  }

  if (this.requestPool_) {
    return this.requestPool_.getCount();
  }

  return 0;
***REMOVED***


***REMOVED***
***REMOVED*** @param {ChannelRequest} req The channel request.
***REMOVED*** @return {boolean} True if the request is a included inside the pool.
***REMOVED***
ForwardChannelRequestPool.prototype.hasRequest = function(req) {
  if (this.request_) {
    return this.request_ == req;
  }

  if (this.requestPool_) {
    return this.requestPool_.contains(req);
  }

  return false;
***REMOVED***


***REMOVED***
***REMOVED*** Adds a new request to the pool.
***REMOVED***
***REMOVED*** @param {!ChannelRequest} req The new channel request.
***REMOVED***
ForwardChannelRequestPool.prototype.addRequest = function(req) {
  if (this.requestPool_) {
    this.requestPool_.add(req);
  } else {
    this.request_ = req;
  }
***REMOVED***


***REMOVED***
***REMOVED*** Removes the given request from the pool.
***REMOVED***
***REMOVED*** @param {ChannelRequest} req The channel request.
***REMOVED*** @return {boolean} Whether the request has been removed from the pool.
***REMOVED***
ForwardChannelRequestPool.prototype.removeRequest = function(req) {
  if (this.request_ && this.request_ == req) {
    this.request_ = null;
    return true;
  }

  if (this.requestPool_ && this.requestPool_.contains(req)) {
    this.requestPool_.remove(req);
    return true;
  }

  return false;
***REMOVED***


***REMOVED***
***REMOVED*** Clears the pool and cancel all the pending requests.
***REMOVED***
ForwardChannelRequestPool.prototype.cancel = function() {
  if (this.request_) {
    this.request_.cancel();
    this.request_ = null;
    return;
  }

  if (this.requestPool_ && !this.requestPool_.isEmpty()) {
    goog.array.forEach(this.requestPool_.getValues(), function(val) {
      val.cancel();
    });
    this.requestPool_.clear();
  }
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} Whether there are any pending requests.
***REMOVED***
ForwardChannelRequestPool.prototype.hasPendingRequest = function() {
  return (this.request_ != null) ||
      (this.requestPool_ != null && !this.requestPool_.isEmpty());
***REMOVED***


***REMOVED***
***REMOVED*** Cancels all pending requests and force the completion of channel requests.
***REMOVED***
***REMOVED*** Need go through the standard onRequestComplete logic to expose the max-retry
***REMOVED*** failure in the standard way.
***REMOVED***
***REMOVED*** @param {!function(!ChannelRequest)} onComplete The completion callback.
***REMOVED*** @return {boolean} true if any request has been forced to complete.
***REMOVED***
ForwardChannelRequestPool.prototype.forceComplete = function(onComplete) {
  if (this.request_ != null) {
    this.request_.cancel();
    onComplete(this.request_);
    return true;
  }

  if (this.requestPool_ && !this.requestPool_.isEmpty()) {
    goog.array.forEach(this.requestPool_.getValues(),
        function(val) {
          val.cancel();
          onComplete(val);
        });
    return true;
  }

  return false;
***REMOVED***
});  // goog.scope
