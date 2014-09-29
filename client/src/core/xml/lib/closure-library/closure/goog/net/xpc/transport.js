// Copyright 2007 The Closure Library Authors. All Rights Reserved.
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
***REMOVED*** @fileoverview Contains the base class for transports.
***REMOVED***
***REMOVED***


goog.provide('goog.net.xpc.Transport');

goog.require('goog.Disposable');
goog.require('goog.dom');
goog.require('goog.net.xpc');



***REMOVED***
***REMOVED*** The base class for transports.
***REMOVED*** @param {goog.dom.DomHelper=} opt_domHelper The dom helper to use for
***REMOVED***     finding the window objects.
***REMOVED***
***REMOVED*** @extends {goog.Disposable***REMOVED***
***REMOVED***
goog.net.xpc.Transport = function(opt_domHelper) {
  goog.Disposable.call(this);

 ***REMOVED*****REMOVED***
  ***REMOVED*** The dom helper to use for finding the window objects to reference.
  ***REMOVED*** @type {goog.dom.DomHelper}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.domHelper_ = opt_domHelper || goog.dom.getDomHelper();
***REMOVED***
goog.inherits(goog.net.xpc.Transport, goog.Disposable);


***REMOVED***
***REMOVED*** The transport type.
***REMOVED*** @type {number}
***REMOVED*** @protected
***REMOVED***
goog.net.xpc.Transport.prototype.transportType = 0;


***REMOVED***
***REMOVED*** @return {number} The transport type identifier.
***REMOVED***
goog.net.xpc.Transport.prototype.getType = function() {
  return this.transportType;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the window associated with this transport instance.
***REMOVED*** @return {Window} The window to use.
***REMOVED***
goog.net.xpc.Transport.prototype.getWindow = function() {
  return this.domHelper_.getWindow();
***REMOVED***


***REMOVED***
***REMOVED*** Return the transport name.
***REMOVED*** @return {string} the transport name.
***REMOVED***
goog.net.xpc.Transport.prototype.getName = function() {
  return goog.net.xpc.TransportNames[this.transportType] || '';
***REMOVED***


***REMOVED***
***REMOVED*** Handles transport service messages (internal signalling).
***REMOVED*** @param {string} payload The message content.
***REMOVED***
goog.net.xpc.Transport.prototype.transportServiceHandler = goog.abstractMethod;


***REMOVED***
***REMOVED*** Connects this transport.
***REMOVED*** The transport implementation is expected to call
***REMOVED*** CrossPageChannel.prototype.notifyConnected when the channel is ready
***REMOVED*** to be used.
***REMOVED***
goog.net.xpc.Transport.prototype.connect = goog.abstractMethod;


***REMOVED***
***REMOVED*** Sends a message.
***REMOVED*** @param {string} service The name off the service the message is to be
***REMOVED*** delivered to.
***REMOVED*** @param {string} payload The message content.
***REMOVED***
goog.net.xpc.Transport.prototype.send = goog.abstractMethod;
