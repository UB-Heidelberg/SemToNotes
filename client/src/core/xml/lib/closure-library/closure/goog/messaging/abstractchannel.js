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
***REMOVED*** @fileoverview An abstract superclass for message channels that handles the
***REMOVED*** repetitive details of registering and dispatching to services. This is more
***REMOVED*** useful for full-fledged channels than for decorators, since decorators
***REMOVED*** generally delegate service registering anyway.
***REMOVED***
***REMOVED***


goog.provide('goog.messaging.AbstractChannel');

goog.require('goog.Disposable');
goog.require('goog.debug');
goog.require('goog.debug.Logger');
goog.require('goog.json');
goog.require('goog.messaging.MessageChannel'); // interface



***REMOVED***
***REMOVED*** Creates an abstract message channel.
***REMOVED***
***REMOVED***
***REMOVED*** @extends {goog.Disposable}
***REMOVED*** @implements {goog.messaging.MessageChannel}
***REMOVED***
goog.messaging.AbstractChannel = function() {
  goog.base(this);

 ***REMOVED*****REMOVED***
  ***REMOVED*** The services registered for this channel.
  ***REMOVED*** @type {Object.<string, {callback: function((string|!Object)),
                             objectPayload: boolean}>}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.services_ = {***REMOVED***
***REMOVED***
goog.inherits(goog.messaging.AbstractChannel, goog.Disposable);


***REMOVED***
***REMOVED*** The default service to be run when no other services match.
***REMOVED***
***REMOVED*** @type {?function(string, (string|!Object))}
***REMOVED*** @private
***REMOVED***
goog.messaging.AbstractChannel.prototype.defaultService_;


***REMOVED***
***REMOVED*** Logger for this class.
***REMOVED*** @type {goog.debug.Logger}
***REMOVED*** @protected
***REMOVED***
goog.messaging.AbstractChannel.prototype.logger =
    goog.debug.Logger.getLogger('goog.messaging.AbstractChannel');


***REMOVED***
***REMOVED*** Immediately calls opt_connectCb if given, and is otherwise a no-op. If
***REMOVED*** subclasses have configuration that needs to happen before the channel is
***REMOVED*** connected, they should override this and {@link #isConnected}.
***REMOVED*** @override
***REMOVED***
goog.messaging.AbstractChannel.prototype.connect = function(opt_connectCb) {
  if (opt_connectCb) {
    opt_connectCb();
  }
***REMOVED***


***REMOVED***
***REMOVED*** Always returns true. If subclasses have configuration that needs to happen
***REMOVED*** before the channel is connected, they should override this and
***REMOVED*** {@link #connect}.
***REMOVED*** @override
***REMOVED***
goog.messaging.AbstractChannel.prototype.isConnected = function() {
  return true;
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.messaging.AbstractChannel.prototype.registerService =
    function(serviceName, callback, opt_objectPayload) {
  this.services_[serviceName] = {
    callback: callback,
    objectPayload: !!opt_objectPayload
 ***REMOVED*****REMOVED***
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.messaging.AbstractChannel.prototype.registerDefaultService =
    function(callback) {
  this.defaultService_ = callback;
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.messaging.AbstractChannel.prototype.send = goog.abstractMethod;


***REMOVED***
***REMOVED*** Delivers a message to the appropriate service. This is meant to be called by
***REMOVED*** subclasses when they receive messages.
***REMOVED***
***REMOVED*** This method takes into account both explicitly-registered and default
***REMOVED*** services, as well as making sure that JSON payloads are decoded when
***REMOVED*** necessary. If the subclass is capable of passing objects as payloads, those
***REMOVED*** objects can be passed in to this method directly. Otherwise, the (potentially
***REMOVED*** JSON-encoded) strings should be passed in.
***REMOVED***
***REMOVED*** @param {string} serviceName The name of the service receiving the message.
***REMOVED*** @param {string|!Object} payload The contents of the message.
***REMOVED*** @protected
***REMOVED***
goog.messaging.AbstractChannel.prototype.deliver = function(
    serviceName, payload) {
  var service = this.getService(serviceName, payload);
  if (!service) {
    return;
  }

  var decodedPayload =
      this.decodePayload(serviceName, payload, service.objectPayload);
  if (goog.isDefAndNotNull(decodedPayload)) {
    service.callback(decodedPayload);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Find the service object for a given service name. If there's no service
***REMOVED*** explicitly registered, but there is a default service, a service object is
***REMOVED*** constructed for it.
***REMOVED***
***REMOVED*** @param {string} serviceName The name of the service receiving the message.
***REMOVED*** @param {string|!Object} payload The contents of the message.
***REMOVED*** @return {?{callback: function((string|!Object)), objectPayload: boolean}} The
***REMOVED***     service object for the given service, or null if none was found.
***REMOVED*** @protected
***REMOVED***
goog.messaging.AbstractChannel.prototype.getService = function(
    serviceName, payload) {
  var service = this.services_[serviceName];
  if (service) {
    return service;
  } else if (this.defaultService_) {
    var callback = goog.partial(this.defaultService_, serviceName);
    var objectPayload = goog.isObject(payload);
    return {callback: callback, objectPayload: objectPayload***REMOVED***
  }

  this.logger.warning('Unknown service name "' + serviceName + '"');
  return null;
***REMOVED***


***REMOVED***
***REMOVED*** Converts the message payload into the format expected by the registered
***REMOVED*** service (either JSON or string).
***REMOVED***
***REMOVED*** @param {string} serviceName The name of the service receiving the message.
***REMOVED*** @param {string|!Object} payload The contents of the message.
***REMOVED*** @param {boolean} objectPayload Whether the service expects an object or a
***REMOVED***     plain string.
***REMOVED*** @return {string|Object} The payload in the format expected by the service, or
***REMOVED***     null if something went wrong.
***REMOVED*** @protected
***REMOVED***
goog.messaging.AbstractChannel.prototype.decodePayload = function(
    serviceName, payload, objectPayload) {
  if (objectPayload && goog.isString(payload)) {
    try {
      return goog.json.parse(payload);
    } catch (err) {
      this.logger.warning('Expected JSON payload for ' + serviceName +
                          ', was "' + payload + '"');
      return null;
    }
  } else if (!objectPayload && !goog.isString(payload)) {
    return goog.json.serialize(payload);
  }
  return payload;
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.messaging.AbstractChannel.prototype.disposeInternal = function() {
  goog.base(this, 'disposeInternal');
  delete this.logger;
  delete this.services_;
  delete this.defaultService_;
***REMOVED***
