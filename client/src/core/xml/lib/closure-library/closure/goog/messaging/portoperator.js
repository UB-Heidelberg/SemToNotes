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
***REMOVED*** @fileoverview The central node of a {@link goog.messaging.PortNetwork}. The
***REMOVED*** operator is responsible for providing the two-way communication channels (via
***REMOVED*** {@link MessageChannel}s) between each pair of nodes in the network that need
***REMOVED*** to communicate with one another. Each network should have one and only one
***REMOVED*** operator.
***REMOVED***
***REMOVED***

goog.provide('goog.messaging.PortOperator');

goog.require('goog.Disposable');
goog.require('goog.asserts');
goog.require('goog.debug.Logger');
goog.require('goog.messaging.PortChannel');
goog.require('goog.messaging.PortNetwork'); // interface
goog.require('goog.object');



***REMOVED***
***REMOVED*** The central node of a PortNetwork.
***REMOVED***
***REMOVED*** @param {string} name The name of this node.
***REMOVED***
***REMOVED*** @extends {goog.Disposable}
***REMOVED*** @implements {goog.messaging.PortNetwork}
***REMOVED***
goog.messaging.PortOperator = function(name) {
  goog.base(this);

 ***REMOVED*****REMOVED***
  ***REMOVED*** The collection of channels for communicating with other contexts in the
  ***REMOVED*** network. These are the channels that are returned to the user, as opposed
  ***REMOVED*** to the channels used for internal network communication. This is lazily
  ***REMOVED*** populated as the user requests communication with other contexts, or other
  ***REMOVED*** contexts request communication with the operator.
  ***REMOVED***
  ***REMOVED*** @type {!Object.<!goog.messaging.PortChannel>}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.connections_ = {***REMOVED***

 ***REMOVED*****REMOVED***
  ***REMOVED*** The collection of channels for internal network communication with other
  ***REMOVED*** contexts. This is not lazily populated, and always contains entries for
  ***REMOVED*** each member of the network.
  ***REMOVED***
  ***REMOVED*** @type {!Object.<!goog.messaging.MessageChannel>}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.switchboard_ = {***REMOVED***

 ***REMOVED*****REMOVED***
  ***REMOVED*** The name of the operator context.
  ***REMOVED***
  ***REMOVED*** @type {string}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.name_ = name;
***REMOVED***
goog.inherits(goog.messaging.PortOperator, goog.Disposable);


***REMOVED***
***REMOVED*** The logger for PortOperator.
***REMOVED*** @type {goog.debug.Logger}
***REMOVED*** @private
***REMOVED***
goog.messaging.PortOperator.prototype.logger_ =
    goog.debug.Logger.getLogger('goog.messaging.PortOperator');


***REMOVED*** @override***REMOVED***
goog.messaging.PortOperator.prototype.dial = function(name) {
  this.connectSelfToPort_(name);
  return this.connections_[name];
***REMOVED***


***REMOVED***
***REMOVED*** Adds a caller to the network with the given name. This port should have no
***REMOVED*** services registered on it. It will be disposed along with the PortOperator.
***REMOVED***
***REMOVED*** @param {string} name The name of the port to add.
***REMOVED*** @param {!goog.messaging.MessageChannel} port The port to add. Must be either
***REMOVED***     a {@link goog.messaging.PortChannel} or a decorator wrapping a
***REMOVED***     PortChannel; in particular, it must be able to send and receive
***REMOVED***     {@link MessagePort}s.
***REMOVED***
goog.messaging.PortOperator.prototype.addPort = function(name, port) {
  this.switchboard_[name] = port;
  port.registerService(goog.messaging.PortNetwork.REQUEST_CONNECTION_SERVICE,
                       goog.bind(this.requestConnection_, this, name));
***REMOVED***


***REMOVED***
***REMOVED*** Connects two contexts by creating a {@link MessageChannel} and sending one
***REMOVED*** end to one context and the other end to the other. Called when we receive a
***REMOVED*** request from a caller to connect it to another context (including potentially
***REMOVED*** the operator).
***REMOVED***
***REMOVED*** @param {string} sourceName The name of the context requesting the connection.
***REMOVED*** @param {!Object|string} message The name of the context to which
***REMOVED***     the connection is requested.
***REMOVED*** @private
***REMOVED***
goog.messaging.PortOperator.prototype.requestConnection_ = function(
    sourceName, message) {
  var requestedName =***REMOVED*****REMOVED*** @type {string}***REMOVED*** (message);
  if (requestedName == this.name_) {
    this.connectSelfToPort_(sourceName);
    return;
  }

  var sourceChannel = this.switchboard_[sourceName];
  var requestedChannel = this.switchboard_[requestedName];

  goog.asserts.assert(goog.isDefAndNotNull(sourceChannel));
  if (!requestedChannel) {
    var err = 'Port "' + sourceName + '" requested a connection to port "' +
        requestedName + '", which doesn\'t exist';
    this.logger_.warning(err);
    sourceChannel.send(goog.messaging.PortNetwork.GRANT_CONNECTION_SERVICE,
                       {'success': false, 'message': err});
    return;
  }

  var messageChannel = new MessageChannel();
  sourceChannel.send(goog.messaging.PortNetwork.GRANT_CONNECTION_SERVICE, {
    'success': true,
    'name': requestedName,
    'port': messageChannel.port1
  });
  requestedChannel.send(goog.messaging.PortNetwork.GRANT_CONNECTION_SERVICE, {
    'success': true,
    'name': sourceName,
    'port': messageChannel.port2
  });
***REMOVED***


***REMOVED***
***REMOVED*** Connects together the operator and a caller by creating a
***REMOVED*** {@link MessageChannel} and sending one end to the remote context.
***REMOVED***
***REMOVED*** @param {string} contextName The name of the context to which to connect the
***REMOVED***     operator.
***REMOVED*** @private
***REMOVED***
goog.messaging.PortOperator.prototype.connectSelfToPort_ = function(
    contextName) {
  if (contextName in this.connections_) {
    // We've already established a connection with this port.
    return;
  }

  var contextChannel = this.switchboard_[contextName];
  if (!contextChannel) {
    throw Error('Port "' + contextName + '" doesn\'t exist');
  }

  var messageChannel = new MessageChannel();
  contextChannel.send(goog.messaging.PortNetwork.GRANT_CONNECTION_SERVICE, {
    'success': true,
    'name': this.name_,
    'port': messageChannel.port1
  });
  messageChannel.port2.start();
  this.connections_[contextName] =
      new goog.messaging.PortChannel(messageChannel.port2);
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.messaging.PortOperator.prototype.disposeInternal = function() {
  goog.object.forEach(this.switchboard_, goog.dispose);
  goog.object.forEach(this.connections_, goog.dispose);
  delete this.switchboard_;
  delete this.connections_;
  goog.base(this, 'disposeInternal');
***REMOVED***
