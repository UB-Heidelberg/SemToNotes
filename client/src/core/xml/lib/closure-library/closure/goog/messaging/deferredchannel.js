// Copyright 2010 The Closure Library Authors. All Rights Reserved.
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
***REMOVED*** @fileoverview A MessageChannel decorator that wraps a deferred MessageChannel
***REMOVED*** and enqueues messages and service registrations until that channel exists.
***REMOVED***
***REMOVED***

goog.provide('goog.messaging.DeferredChannel');

goog.require('goog.Disposable');
goog.require('goog.async.Deferred');
goog.require('goog.messaging.MessageChannel'); // interface



***REMOVED***
***REMOVED*** Creates a new DeferredChannel, which wraps a deferred MessageChannel and
***REMOVED*** enqueues messages to be sent once the wrapped channel is resolved.
***REMOVED***
***REMOVED*** @param {!goog.async.Deferred} deferredChannel The underlying deferred
***REMOVED***     MessageChannel.
***REMOVED***
***REMOVED*** @extends {goog.Disposable}
***REMOVED*** @implements {goog.messaging.MessageChannel}
***REMOVED***
goog.messaging.DeferredChannel = function(deferredChannel) {
  goog.base(this);
  this.deferred_ = deferredChannel;
***REMOVED***
goog.inherits(goog.messaging.DeferredChannel, goog.Disposable);


***REMOVED***
***REMOVED*** Cancels the wrapped Deferred.
***REMOVED***
goog.messaging.DeferredChannel.prototype.cancel = function() {
  this.deferred_.cancel();
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.messaging.DeferredChannel.prototype.connect = function(opt_connectCb) {
  if (opt_connectCb) {
    opt_connectCb();
  }
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.messaging.DeferredChannel.prototype.isConnected = function() {
  return true;
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.messaging.DeferredChannel.prototype.registerService = function(
    serviceName, callback, opt_objectPayload) {
  this.deferred_.addCallback(function(resolved) {
    resolved.registerService(serviceName, callback, opt_objectPayload);
  });
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.messaging.DeferredChannel.prototype.registerDefaultService =
    function(callback) {
  this.deferred_.addCallback(function(resolved) {
    resolved.registerDefaultService(callback);
  });
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.messaging.DeferredChannel.prototype.send = function(serviceName, payload) {
  this.deferred_.addCallback(function(resolved) {
    resolved.send(serviceName, payload);
  });
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.messaging.DeferredChannel.prototype.disposeInternal = function() {
  this.cancel();
  goog.base(this, 'disposeInternal');
***REMOVED***
