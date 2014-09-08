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
***REMOVED*** @fileoverview Implementation of a WebChannel transport using WebChannelBase.
***REMOVED***
***REMOVED*** When WebChannelBase is used as the underlying transport, the capabilities
***REMOVED*** of the WebChannel are limited to what's supported by the implementation.
***REMOVED*** Particularly, multiplexing is not possible, and only strings are
***REMOVED*** supported as message types.
***REMOVED***
***REMOVED***

goog.provide('goog.labs.net.webChannel.WebChannelBaseTransport');

goog.require('goog.asserts');
goog.require('goog.events.EventTarget');
goog.require('goog.labs.net.webChannel.WebChannelBase');
goog.require('goog.log');
goog.require('goog.net.WebChannel');
goog.require('goog.net.WebChannelTransport');
goog.require('goog.string.path');



***REMOVED***
***REMOVED*** Implementation of {@link goog.net.WebChannelTransport} with
***REMOVED*** {@link goog.labs.net.webChannel.WebChannelBase} as the underlying channel
***REMOVED*** implementation.
***REMOVED***
***REMOVED***
***REMOVED*** @struct
***REMOVED*** @implements {goog.net.WebChannelTransport}
***REMOVED*** @final
***REMOVED***
goog.labs.net.webChannel.WebChannelBaseTransport = function() {***REMOVED***


goog.scope(function() {
var WebChannelBaseTransport = goog.labs.net.webChannel.WebChannelBaseTransport;
var WebChannelBase = goog.labs.net.webChannel.WebChannelBase;


***REMOVED***
***REMOVED*** @override
***REMOVED***
WebChannelBaseTransport.prototype.createWebChannel = function(
    url, opt_options) {
  return new WebChannelBaseTransport.Channel(url, opt_options);
***REMOVED***



***REMOVED***
***REMOVED*** Implementation of the {@link goog.net.WebChannel} interface.
***REMOVED***
***REMOVED*** @param {string} url The URL path for the new WebChannel instance.
***REMOVED*** @param {!goog.net.WebChannel.Options=} opt_options Configuration for the
***REMOVED***     new WebChannel instance.
***REMOVED***
***REMOVED***
***REMOVED*** @implements {goog.net.WebChannel}
***REMOVED*** @extends {goog.events.EventTarget}
***REMOVED*** @final
***REMOVED***
WebChannelBaseTransport.Channel = function(url, opt_options) {
  WebChannelBaseTransport.Channel.base(this, 'constructor');

 ***REMOVED*****REMOVED***
  ***REMOVED*** The underlying channel object.
  ***REMOVED***
  ***REMOVED*** @private {!WebChannelBase}
 ***REMOVED*****REMOVED***
  this.channel_ = new WebChannelBase(opt_options);

 ***REMOVED*****REMOVED***
  ***REMOVED*** The URL of the target server end-point.
  ***REMOVED***
  ***REMOVED*** @private {string}
 ***REMOVED*****REMOVED***
  this.url_ = url;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The test URL of the target server end-point. This value defaults to
  ***REMOVED*** this.url_ + '/test'.
  ***REMOVED***
  ***REMOVED*** @private {string}
 ***REMOVED*****REMOVED***
  this.testUrl_ = (opt_options && opt_options.testUrl) ? opt_options.testUrl :
      goog.string.path.join(this.url_, 'test');

 ***REMOVED*****REMOVED***
  ***REMOVED*** The logger for this class.
  ***REMOVED*** @private {goog.log.Logger}
 ***REMOVED*****REMOVED***
  this.logger_ = goog.log.getLogger(
      'goog.labs.net.webChannel.WebChannelBaseTransport');


 ***REMOVED*****REMOVED***
  ***REMOVED*** @private {Object.<string, string>} messageUrlParams_ Extra URL parameters
  ***REMOVED*** to be added to each HTTP request.
 ***REMOVED*****REMOVED***
  this.messageUrlParams_ =
      (opt_options && opt_options.messageUrlParams) || null;

  var messageHeaders = (opt_options && opt_options.messageHeaders) || null;
  if (messageHeaders) {
    this.channel_.setExtraHeaders(messageHeaders);
  }

 ***REMOVED*****REMOVED***
  ***REMOVED*** @private {boolean} supportsCrossDomainXhr_ Whether to enable CORS.
 ***REMOVED*****REMOVED***
  this.supportsCrossDomainXhr_ =
      (opt_options && opt_options.supportsCrossDomainXhr) || false;
***REMOVED***
goog.inherits(WebChannelBaseTransport.Channel, goog.events.EventTarget);


***REMOVED***
***REMOVED*** The channel handler.
***REMOVED***
***REMOVED*** @type {WebChannelBase.Handler}
***REMOVED*** @private
***REMOVED***
WebChannelBaseTransport.Channel.prototype.channelHandler_ = null;


***REMOVED***
***REMOVED*** Test path is always set to "/url/test".
***REMOVED***
***REMOVED*** @override
***REMOVED***
WebChannelBaseTransport.Channel.prototype.open = function() {
  this.channel_.connect(this.testUrl_, this.url_,
                        (this.messageUrlParams_ || undefined));

  this.channelHandler_ = new WebChannelBaseTransport.Channel.Handler_(this);
  this.channel_.setHandler(this.channelHandler_);
  if (this.supportsCrossDomainXhr_) {
    this.channel_.setSupportsCrossDomainXhrs(true);
  }
***REMOVED***


***REMOVED***
***REMOVED*** @override
***REMOVED***
WebChannelBaseTransport.Channel.prototype.close = function() {
  this.channel_.disconnect();
***REMOVED***


***REMOVED***
***REMOVED*** The WebChannelBase only supports object types.
***REMOVED***
***REMOVED*** @param {!goog.net.WebChannel.MessageData} message The message to send.
***REMOVED*** @override
***REMOVED***
WebChannelBaseTransport.Channel.prototype.send = function(message) {
  goog.asserts.assert(goog.isObject(message), 'only object type expected');
  this.channel_.sendMap(message);
***REMOVED***


***REMOVED***
***REMOVED*** @override
***REMOVED***
WebChannelBaseTransport.Channel.prototype.disposeInternal = function() {
  this.channel_.setHandler(null);
  delete this.channelHandler_;
  this.channel_.disconnect();
  delete this.channel_;

  WebChannelBaseTransport.Channel.base(this, 'disposeInternal');
***REMOVED***



***REMOVED***
***REMOVED*** The message event.
***REMOVED***
***REMOVED*** @param {!Array} array The data array from the underlying channel.
***REMOVED***
***REMOVED*** @extends {goog.net.WebChannel.MessageEvent}
***REMOVED*** @final
***REMOVED***
WebChannelBaseTransport.Channel.MessageEvent = function(array) {
  WebChannelBaseTransport.Channel.MessageEvent.base(this, 'constructor');

  this.data = array;
***REMOVED***
goog.inherits(WebChannelBaseTransport.Channel.MessageEvent,
              goog.net.WebChannel.MessageEvent);



***REMOVED***
***REMOVED*** The error event.
***REMOVED***
***REMOVED*** @param {WebChannelBase.Error} error The error code.
***REMOVED***
***REMOVED*** @extends {goog.net.WebChannel.ErrorEvent}
***REMOVED*** @final
***REMOVED***
WebChannelBaseTransport.Channel.ErrorEvent = function(error) {
  WebChannelBaseTransport.Channel.ErrorEvent.base(this, 'constructor');

 ***REMOVED*****REMOVED***
  ***REMOVED*** Transport specific error code is not to be propagated with the event.
 ***REMOVED*****REMOVED***
  this.status = goog.net.WebChannel.ErrorStatus.NETWORK_ERROR;
***REMOVED***
goog.inherits(WebChannelBaseTransport.Channel.ErrorEvent,
              goog.net.WebChannel.ErrorEvent);



***REMOVED***
***REMOVED*** Implementation of {@link WebChannelBase.Handler} interface.
***REMOVED***
***REMOVED*** @param {!WebChannelBaseTransport.Channel} channel The enclosing WebChannel.
***REMOVED***
***REMOVED***
***REMOVED*** @extends {WebChannelBase.Handler}
***REMOVED*** @private
***REMOVED***
WebChannelBaseTransport.Channel.Handler_ = function(channel) {
  WebChannelBaseTransport.Channel.Handler_.base(this, 'constructor');

 ***REMOVED*****REMOVED***
  ***REMOVED*** @type {!WebChannelBaseTransport.Channel}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.channel_ = channel;
***REMOVED***
goog.inherits(WebChannelBaseTransport.Channel.Handler_, WebChannelBase.Handler);


***REMOVED***
***REMOVED*** @override
***REMOVED***
WebChannelBaseTransport.Channel.Handler_.prototype.channelOpened = function(
    channel) {
  goog.log.info(this.channel_.logger_,
      'WebChannel opened on ' + this.channel_.url_);
  this.channel_.dispatchEvent(goog.net.WebChannel.EventType.OPEN);
***REMOVED***


***REMOVED***
***REMOVED*** @override
***REMOVED***
WebChannelBaseTransport.Channel.Handler_.prototype.channelHandleArray =
    function(channel, array) {
  goog.asserts.assert(array, 'array expected to be defined');
  this.channel_.dispatchEvent(
      new WebChannelBaseTransport.Channel.MessageEvent(array));
***REMOVED***


***REMOVED***
***REMOVED*** @override
***REMOVED***
WebChannelBaseTransport.Channel.Handler_.prototype.channelError = function(
    channel, error) {
  goog.log.info(this.channel_.logger_,
      'WebChannel aborted on ' + this.channel_.url_ +
      ' due to channel error: ' + error);
  this.channel_.dispatchEvent(
      new WebChannelBaseTransport.Channel.ErrorEvent(error));
***REMOVED***


***REMOVED***
***REMOVED*** @override
***REMOVED***
WebChannelBaseTransport.Channel.Handler_.prototype.channelClosed = function(
    channel, opt_pendingMaps, opt_undeliveredMaps) {
  goog.log.info(this.channel_.logger_,
      'WebChannel closed on ' + this.channel_.url_);
  this.channel_.dispatchEvent(goog.net.WebChannel.EventType.CLOSE);
***REMOVED***


***REMOVED***
***REMOVED*** @override
***REMOVED***
WebChannelBaseTransport.Channel.prototype.getRuntimeProperties = function() {
  return new WebChannelBaseTransport.ChannelProperties(this.channel_);
***REMOVED***



***REMOVED***
***REMOVED*** Implementation of the {@link goog.net.WebChannel.RuntimeProperties}.
***REMOVED***
***REMOVED*** @param {!WebChannelBase} channel The underlying channel object.
***REMOVED***
***REMOVED***
***REMOVED*** @implements {goog.net.WebChannel.RuntimeProperties}
***REMOVED*** @final
***REMOVED***
WebChannelBaseTransport.ChannelProperties = function(channel) {
 ***REMOVED*****REMOVED***
  ***REMOVED*** The underlying channel object.
  ***REMOVED***
  ***REMOVED*** @private {!WebChannelBase}
 ***REMOVED*****REMOVED***
  this.channel_ = channel;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The flag to turn on/off server-side flow control.
  ***REMOVED***
  ***REMOVED*** @private {boolean}
 ***REMOVED*****REMOVED***
  this.serverFlowControlEnabled_ = false;

***REMOVED***


***REMOVED***
***REMOVED*** @override
***REMOVED***
WebChannelBaseTransport.ChannelProperties.prototype.getConcurrentRequestLimit =
    function() {
  return this.channel_.getForwardChannelRequestPool().getMaxSize();
***REMOVED***


***REMOVED***
***REMOVED*** @override
***REMOVED***
WebChannelBaseTransport.ChannelProperties.prototype.isSpdyEnabled =
    function() {
  return this.getConcurrentRequestLimit() > 1;
***REMOVED***


***REMOVED***
***REMOVED*** @override
***REMOVED***
WebChannelBaseTransport.ChannelProperties.prototype.setServerFlowControl =
    goog.abstractMethod;


***REMOVED***
***REMOVED*** @override
***REMOVED***
WebChannelBaseTransport.ChannelProperties.prototype.getNonAckedMessageCount =
    goog.abstractMethod;
});  // goog.scope
