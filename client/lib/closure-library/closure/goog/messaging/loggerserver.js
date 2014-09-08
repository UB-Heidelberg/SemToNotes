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
***REMOVED*** @fileoverview This class listens on a message channel for logger commands and
***REMOVED*** logs them on the local page. This is useful when dealing with message
***REMOVED*** channels to contexts that don't have access to their own logging facilities.
***REMOVED***
***REMOVED***

goog.provide('goog.messaging.LoggerServer');

goog.require('goog.Disposable');
goog.require('goog.log');



***REMOVED***
***REMOVED*** Creates a logger server that logs messages on behalf of the remote end of a
***REMOVED*** message channel. The remote end of the channel should use a
***REMOVED*** {goog.messaging.LoggerClient} with the same service name.
***REMOVED***
***REMOVED*** @param {!goog.messaging.MessageChannel} channel The channel that is sending
***REMOVED***     the log messages.
***REMOVED*** @param {string} serviceName The name of the logging service to listen for.
***REMOVED*** @param {string=} opt_channelName The name of this channel. Used to help
***REMOVED***     distinguish this client's messages.
***REMOVED***
***REMOVED*** @extends {goog.Disposable}
***REMOVED*** @final
***REMOVED***
goog.messaging.LoggerServer = function(channel, serviceName, opt_channelName) {
  goog.messaging.LoggerServer.base(this, 'constructor');

 ***REMOVED*****REMOVED***
  ***REMOVED*** The channel that is sending the log messages.
  ***REMOVED*** @type {!goog.messaging.MessageChannel}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.channel_ = channel;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The name of the logging service to listen for.
  ***REMOVED*** @type {string}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.serviceName_ = serviceName;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The name of the channel.
  ***REMOVED*** @type {string}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.channelName_ = opt_channelName || 'remote logger';

  this.channel_.registerService(
      this.serviceName_, goog.bind(this.log_, this), true /* opt_json***REMOVED***);
***REMOVED***
goog.inherits(goog.messaging.LoggerServer, goog.Disposable);


***REMOVED***
***REMOVED*** Handles logging messages from the client.
***REMOVED*** @param {!Object|string} message
***REMOVED***     The logging information from the client.
***REMOVED*** @private
***REMOVED***
goog.messaging.LoggerServer.prototype.log_ = function(message) {
  var args =
     ***REMOVED*****REMOVED***
      ***REMOVED*** @type {!{level: number, message: string,
      ***REMOVED***           name: string, exception: Object}}
     ***REMOVED*****REMOVED*** (message);
  var level = goog.log.Level.getPredefinedLevelByValue(args['level']);
  if (level) {
    var msg = '[' + this.channelName_ + '] ' + args['message'];
    goog.log.getLogger(args['name'])
        .log(level, msg, args['exception']);
  }
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.messaging.LoggerServer.prototype.disposeInternal = function() {
  goog.messaging.LoggerServer.base(this, 'disposeInternal');
  this.channel_.registerService(this.serviceName_, goog.nullFunction, true);
  delete this.channel_;
***REMOVED***
