// Copyright 2011 The Closure Library Authors. All Rights Reserved.
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
***REMOVED*** @fileoverview The leaf node of a {@link goog.messaging.PortNetwork}. Callers
***REMOVED*** connect to the operator, and request connections with other contexts from it.
***REMOVED***
***REMOVED***

goog.provide('goog.messaging.PortCaller');

goog.require('goog.Disposable');
goog.require('goog.async.Deferred');
goog.require('goog.messaging.DeferredChannel');
goog.require('goog.messaging.PortChannel');
goog.require('goog.messaging.PortNetwork'); // interface
goog.require('goog.object');



***REMOVED***
***REMOVED*** The leaf node of a network.
***REMOVED***
***REMOVED*** @param {!goog.messaging.MessageChannel} operatorPort The channel for
***REMOVED***     communicating with the operator. The other side of this channel should be
***REMOVED***     passed to {@link goog.messaging.PortOperator#addPort}. Must be either a
***REMOVED***     {@link goog.messaging.PortChannel} or a decorator wrapping a PortChannel;
***REMOVED***     in particular, it must be able to send and receive {@link MessagePort}s.
***REMOVED***
***REMOVED*** @extends {goog.Disposable}
***REMOVED*** @implements {goog.messaging.PortNetwork}
***REMOVED*** @final
***REMOVED***
goog.messaging.PortCaller = function(operatorPort) {
  goog.messaging.PortCaller.base(this, 'constructor');

 ***REMOVED*****REMOVED***
  ***REMOVED*** The channel to the {@link goog.messaging.PortOperator} for this network.
  ***REMOVED***
  ***REMOVED*** @type {!goog.messaging.MessageChannel}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.operatorPort_ = operatorPort;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The collection of channels for communicating with other contexts in the
  ***REMOVED*** network. Each value can contain a {@link goog.aync.Deferred} and/or a
  ***REMOVED*** {@link goog.messaging.MessageChannel}.
  ***REMOVED***
  ***REMOVED*** If the value contains a Deferred, then the channel is a
  ***REMOVED*** {@link goog.messaging.DeferredChannel} wrapping that Deferred. The Deferred
  ***REMOVED*** will be resolved with a {@link goog.messaging.PortChannel} once we receive
  ***REMOVED*** the appropriate port from the operator. This is the situation when this
  ***REMOVED*** caller requests a connection to another context; the DeferredChannel is
  ***REMOVED*** used to queue up messages until we receive the port from the operator.
  ***REMOVED***
  ***REMOVED*** If the value does not contain a Deferred, then the channel is simply a
  ***REMOVED*** {@link goog.messaging.PortChannel} communicating with the given context.
  ***REMOVED*** This is the situation when this context received a port for the other
  ***REMOVED*** context before it was requested.
  ***REMOVED***
  ***REMOVED*** If a value exists for a given key, it must contain a channel, but it
  ***REMOVED*** doesn't necessarily contain a Deferred.
  ***REMOVED***
  ***REMOVED*** @type {!Object.<{deferred: goog.async.Deferred,
  ***REMOVED***                  channel: !goog.messaging.MessageChannel}>}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.connections_ = {***REMOVED***

  this.operatorPort_.registerService(
      goog.messaging.PortNetwork.GRANT_CONNECTION_SERVICE,
      goog.bind(this.connectionGranted_, this),
      true /* opt_json***REMOVED***);
***REMOVED***
goog.inherits(goog.messaging.PortCaller, goog.Disposable);


***REMOVED*** @override***REMOVED***
goog.messaging.PortCaller.prototype.dial = function(name) {
  if (name in this.connections_) {
    return this.connections_[name].channel;
  }

  this.operatorPort_.send(
      goog.messaging.PortNetwork.REQUEST_CONNECTION_SERVICE, name);
  var deferred = new goog.async.Deferred();
  var channel = new goog.messaging.DeferredChannel(deferred);
  this.connections_[name] = {deferred: deferred, channel: channel***REMOVED***
  return channel;
***REMOVED***


***REMOVED***
***REMOVED*** Registers a connection to another context in the network. This is called when
***REMOVED*** the operator sends us one end of a {@link MessageChannel}, either because
***REMOVED*** this caller requested a connection with another context, or because that
***REMOVED*** context requested a connection with this caller.
***REMOVED***
***REMOVED*** It's possible that the remote context and this one request each other roughly
***REMOVED*** concurrently. The operator doesn't keep track of which contexts have been
***REMOVED*** connected, so it will create two separate {@link MessageChannel}s in this
***REMOVED*** case. However, the first channel created will reach both contexts first, so
***REMOVED*** we simply ignore all connections with a given context after the first.
***REMOVED***
***REMOVED*** @param {!Object|string} message The name of the context
***REMOVED***     being connected and the port connecting the context.
***REMOVED*** @private
***REMOVED***
goog.messaging.PortCaller.prototype.connectionGranted_ = function(message) {
  var args =***REMOVED*****REMOVED*** @type {{name: string, port: MessagePort}}***REMOVED*** (message);
  var port = args['port'];
  var entry = this.connections_[args['name']];
  if (entry && (!entry.deferred || entry.deferred.hasFired())) {
    // If two PortCallers request one another at the same time, the operator may
    // send out a channel for connecting them multiple times. Since both callers
    // will receive the first channel's ports first, we can safely ignore and
    // close any future ports.
    port.close();
  } else if (!args['success']) {
    throw Error(args['message']);
  } else {
    port.start();
    var channel = new goog.messaging.PortChannel(port);
    if (entry) {
      entry.deferred.callback(channel);
    } else {
      this.connections_[args['name']] = {channel: channel, deferred: null***REMOVED***
    }
  }
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.messaging.PortCaller.prototype.disposeInternal = function() {
  goog.dispose(this.operatorPort_);
  goog.object.forEach(this.connections_, goog.dispose);
  delete this.operatorPort_;
  delete this.connections_;
  goog.messaging.PortCaller.base(this, 'disposeInternal');
***REMOVED***
