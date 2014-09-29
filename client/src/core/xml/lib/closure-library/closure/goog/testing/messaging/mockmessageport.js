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
***REMOVED*** @fileoverview A simple dummy class for representing message ports in tests.
***REMOVED***
***REMOVED***

goog.provide('goog.testing.messaging.MockMessagePort');

goog.require('goog.events.EventTarget');



***REMOVED***
***REMOVED*** Class for unit-testing code that uses MessagePorts.
***REMOVED*** @param {*} id An opaque identifier, used because message ports otherwise have
***REMOVED***     no distinguishing characteristics.
***REMOVED*** @param {goog.testing.MockControl} mockControl The mock control used to create
***REMOVED***     the method mock for #postMessage.
***REMOVED***
***REMOVED*** @extends {goog.events.EventTarget}
***REMOVED***
goog.testing.messaging.MockMessagePort = function(id, mockControl) {
  goog.base(this);

 ***REMOVED*****REMOVED***
  ***REMOVED*** An opaque identifier, used because message ports otherwise have no
  ***REMOVED*** distinguishing characteristics.
  ***REMOVED*** @type {*}
 ***REMOVED*****REMOVED***
  this.id = id;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Whether or not the port has been started.
  ***REMOVED*** @type {boolean}
 ***REMOVED*****REMOVED***
  this.started = false;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Whether or not the port has been closed.
  ***REMOVED*** @type {boolean}
 ***REMOVED*****REMOVED***
  this.closed = false;

  mockControl.createMethodMock(this, 'postMessage');
***REMOVED***
goog.inherits(goog.testing.messaging.MockMessagePort, goog.events.EventTarget);


***REMOVED***
***REMOVED*** A mock postMessage funciton. Actually an instance of
***REMOVED*** {@link goog.testing.FunctionMock}.
***REMOVED*** @param {*} message The message to send.
***REMOVED*** @param {Array.<MessagePort>=} opt_ports Ports to send with the message.
***REMOVED***
goog.testing.messaging.MockMessagePort.prototype.postMessage = function(
    message, opt_ports) {***REMOVED***


***REMOVED***
***REMOVED*** Starts the port.
***REMOVED***
goog.testing.messaging.MockMessagePort.prototype.start = function() {
  this.started = true;
***REMOVED***


***REMOVED***
***REMOVED*** Closes the port.
***REMOVED***
goog.testing.messaging.MockMessagePort.prototype.close = function() {
  this.closed = true;
***REMOVED***
