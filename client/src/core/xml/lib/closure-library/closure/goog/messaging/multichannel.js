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
***REMOVED*** @fileoverview Definition of goog.messaging.MultiChannel, which uses a
***REMOVED*** single underlying MessageChannel to carry several independent virtual message
***REMOVED*** channels.
***REMOVED***
***REMOVED***


goog.provide('goog.messaging.MultiChannel');
goog.provide('goog.messaging.MultiChannel.VirtualChannel');

goog.require('goog.Disposable');
goog.require('goog.debug.Logger');
goog.require('goog.events.EventHandler');
goog.require('goog.messaging.MessageChannel'); // interface
goog.require('goog.object');



***REMOVED***
***REMOVED*** Creates a new MultiChannel wrapping a single MessageChannel. The
***REMOVED*** underlying channel shouldn't have any other listeners registered, but it
***REMOVED*** should be connected.
***REMOVED***
***REMOVED*** Note that the other side of the channel should also be connected to a
***REMOVED*** MultiChannel with the same number of virtual channels.
***REMOVED***
***REMOVED*** @param {goog.messaging.MessageChannel} underlyingChannel The underlying
***REMOVED***     channel to use as transport for the virtual channels.
***REMOVED***
***REMOVED*** @extends {goog.Disposable}
***REMOVED***
goog.messaging.MultiChannel = function(underlyingChannel) {
  goog.base(this);

 ***REMOVED*****REMOVED***
  ***REMOVED*** The underlying channel across which all requests are sent.
  ***REMOVED*** @type {goog.messaging.MessageChannel}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.underlyingChannel_ = underlyingChannel;

 ***REMOVED*****REMOVED***
  ***REMOVED*** All the virtual channels that are registered for this MultiChannel.
  ***REMOVED*** These are null if they've been disposed.
  ***REMOVED*** @type {Object.<?goog.messaging.MultiChannel.VirtualChannel>}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.virtualChannels_ = {***REMOVED***

  this.underlyingChannel_.registerDefaultService(
      goog.bind(this.handleDefault_, this));
***REMOVED***
goog.inherits(goog.messaging.MultiChannel, goog.Disposable);


***REMOVED***
***REMOVED*** Logger object for goog.messaging.MultiChannel.
***REMOVED*** @type {goog.debug.Logger}
***REMOVED*** @private
***REMOVED***
goog.messaging.MultiChannel.prototype.logger_ =
    goog.debug.Logger.getLogger('goog.messaging.MultiChannel');


***REMOVED***
***REMOVED*** Creates a new virtual channel that will communicate across the underlying
***REMOVED*** channel.
***REMOVED*** @param {string} name The name of the virtual channel. Must be unique for this
***REMOVED***     MultiChannel. Cannot contain colons.
***REMOVED*** @return {!goog.messaging.MultiChannel.VirtualChannel} The new virtual
***REMOVED***     channel.
***REMOVED***
goog.messaging.MultiChannel.prototype.createVirtualChannel = function(name) {
  if (name.indexOf(':') != -1) {
    throw Error(
        'Virtual channel name "' + name + '" should not contain colons');
  }

  if (name in this.virtualChannels_) {
    throw Error('Virtual channel "' + name + '" was already created for ' +
                'this multichannel.');
  }

  var channel =
      new goog.messaging.MultiChannel.VirtualChannel(this, name);
  this.virtualChannels_[name] = channel;
  return channel;
***REMOVED***


***REMOVED***
***REMOVED*** Handles the default service for the underlying channel. This dispatches any
***REMOVED*** unrecognized services to the appropriate virtual channel.
***REMOVED***
***REMOVED*** @param {string} serviceName The name of the service being called.
***REMOVED*** @param {string|!Object} payload The message payload.
***REMOVED*** @private
***REMOVED***
goog.messaging.MultiChannel.prototype.handleDefault_ = function(
    serviceName, payload) {
  var match = serviceName.match(/^([^:]*):(.*)/);
  if (!match) {
    this.logger_.warning('Invalid service name "' + serviceName + '": no ' +
                         'virtual channel specified');
    return;
  }

  var channelName = match[1];
  serviceName = match[2];
  if (!(channelName in this.virtualChannels_)) {
    this.logger_.warning('Virtual channel "' + channelName + ' does not ' +
                         'exist, but a message was received for it: "' +
                         serviceName + '"');
    return;
  }

  var virtualChannel = this.virtualChannels_[channelName];
  if (!virtualChannel) {
    this.logger_.warning('Virtual channel "' + channelName + ' has been ' +
                         'disposed, but a message was received for it: "' +
                         serviceName + '"');
    return;
  }

  if (!virtualChannel.defaultService_) {
    this.logger_.warning('Service "' + serviceName + '" is not registered ' +
                         'on virtual channel "' + channelName + '"');
    return;
  }

  virtualChannel.defaultService_(serviceName, payload);
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.messaging.MultiChannel.prototype.disposeInternal = function() {
  goog.object.forEach(this.virtualChannels_, function(channel) {
    goog.dispose(channel);
  });
  goog.dispose(this.underlyingChannel_);
  delete this.virtualChannels_;
  delete this.underlyingChannel_;
***REMOVED***



***REMOVED***
***REMOVED*** A message channel that proxies its messages over another underlying channel.
***REMOVED***
***REMOVED*** @param {goog.messaging.MultiChannel} parent The MultiChannel
***REMOVED***     which created this channel, and which contains the underlying
***REMOVED***     MessageChannel that's used as the transport.
***REMOVED*** @param {string} name The name of this virtual channel. Unique among the
***REMOVED***     virtual channels in parent.
***REMOVED***
***REMOVED*** @implements {goog.messaging.MessageChannel}
***REMOVED*** @extends {goog.Disposable}
***REMOVED***
goog.messaging.MultiChannel.VirtualChannel = function(parent, name) {
  goog.base(this);

 ***REMOVED*****REMOVED***
  ***REMOVED*** The MultiChannel containing the underlying transport channel.
  ***REMOVED*** @type {goog.messaging.MultiChannel}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.parent_ = parent;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The name of this virtual channel.
  ***REMOVED*** @type {string}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.name_ = name;
***REMOVED***
goog.inherits(goog.messaging.MultiChannel.VirtualChannel,
              goog.Disposable);


***REMOVED***
***REMOVED*** The default service to run if no other services match.
***REMOVED*** @type {?function(string, (string|!Object))}
***REMOVED*** @private
***REMOVED***
goog.messaging.MultiChannel.VirtualChannel.prototype.defaultService_;


***REMOVED***
***REMOVED*** Logger object for goog.messaging.MultiChannel.VirtualChannel.
***REMOVED*** @type {goog.debug.Logger}
***REMOVED*** @private
***REMOVED***
goog.messaging.MultiChannel.VirtualChannel.prototype.logger_ =
    goog.debug.Logger.getLogger(
        'goog.messaging.MultiChannel.VirtualChannel');


***REMOVED***
***REMOVED*** This is a no-op, since the underlying channel is expected to already be
***REMOVED*** initialized when it's passed in.
***REMOVED***
***REMOVED*** @override
***REMOVED***
goog.messaging.MultiChannel.VirtualChannel.prototype.connect =
    function(opt_connectCb) {
  if (opt_connectCb) {
    opt_connectCb();
  }
***REMOVED***


***REMOVED***
***REMOVED*** This always returns true, since the underlying channel is expected to already
***REMOVED*** be initialized when it's passed in.
***REMOVED***
***REMOVED*** @override
***REMOVED***
goog.messaging.MultiChannel.VirtualChannel.prototype.isConnected =
    function() {
  return true;
***REMOVED***


***REMOVED***
***REMOVED*** @override
***REMOVED***
goog.messaging.MultiChannel.VirtualChannel.prototype.registerService =
    function(serviceName, callback, opt_objectPayload) {
  this.parent_.underlyingChannel_.registerService(
      this.name_ + ':' + serviceName,
      goog.bind(this.doCallback_, this, callback),
      opt_objectPayload);
***REMOVED***


***REMOVED***
***REMOVED*** @override
***REMOVED***
goog.messaging.MultiChannel.VirtualChannel.prototype.
    registerDefaultService = function(callback) {
  this.defaultService_ = goog.bind(this.doCallback_, this, callback);
***REMOVED***


***REMOVED***
***REMOVED*** @override
***REMOVED***
goog.messaging.MultiChannel.VirtualChannel.prototype.send =
    function(serviceName, payload) {
  if (this.isDisposed()) {
    throw Error('#send called for disposed VirtualChannel.');
  }

  this.parent_.underlyingChannel_.send(this.name_ + ':' + serviceName,
                                       payload);
***REMOVED***


***REMOVED***
***REMOVED*** Wraps a callback with a function that will log a warning and abort if it's
***REMOVED*** called when this channel is disposed.
***REMOVED***
***REMOVED*** @param {function()} callback The callback to wrap.
***REMOVED*** @param {...*} var_args Other arguments, passed to the callback.
***REMOVED*** @private
***REMOVED***
goog.messaging.MultiChannel.VirtualChannel.prototype.doCallback_ =
    function(callback, var_args) {
  if (this.isDisposed()) {
    this.logger_.warning('Virtual channel "' + this.name_ + '" received ' +
                         ' a message after being disposed.');
    return;
  }

  callback.apply({}, Array.prototype.slice.call(arguments, 1));
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.messaging.MultiChannel.VirtualChannel.prototype.disposeInternal =
    function() {
  this.parent_.virtualChannels_[this.name_] = null;
  this.parent_ = null;
***REMOVED***
