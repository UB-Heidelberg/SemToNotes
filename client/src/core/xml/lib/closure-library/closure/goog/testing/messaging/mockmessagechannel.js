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
***REMOVED*** @fileoverview Mock MessageChannel implementation that can receive fake
***REMOVED*** messages and test that the right messages are sent.
***REMOVED***
***REMOVED***


goog.provide('goog.testing.messaging.MockMessageChannel');

goog.require('goog.messaging.AbstractChannel');
goog.require('goog.testing.asserts');



***REMOVED***
***REMOVED*** Class for unit-testing code that communicates over a MessageChannel.
***REMOVED*** @param {goog.testing.MockControl} mockControl The mock control used to create
***REMOVED***   the method mock for #send.
***REMOVED*** @extends {goog.messaging.AbstractChannel}
***REMOVED***
***REMOVED***
goog.testing.messaging.MockMessageChannel = function(mockControl) {
  goog.base(this);

 ***REMOVED*****REMOVED***
  ***REMOVED*** Whether the channel has been disposed.
  ***REMOVED*** @type {boolean}
 ***REMOVED*****REMOVED***
  this.disposed = false;

  mockControl.createMethodMock(this, 'send');
***REMOVED***
goog.inherits(goog.testing.messaging.MockMessageChannel,
              goog.messaging.AbstractChannel);


***REMOVED***
***REMOVED*** A mock send function. Actually an instance of
***REMOVED*** {@link goog.testing.FunctionMock}.
***REMOVED*** @param {string} serviceName The name of the remote service to run.
***REMOVED*** @param {string|!Object} payload The payload to send to the remote page.
***REMOVED*** @override
***REMOVED***
goog.testing.messaging.MockMessageChannel.prototype.send = function(
    serviceName, payload) {***REMOVED***


***REMOVED***
***REMOVED*** Sets a flag indicating that this is disposed.
***REMOVED*** @override
***REMOVED***
goog.testing.messaging.MockMessageChannel.prototype.dispose = function() {
  this.disposed = true;
***REMOVED***


***REMOVED***
***REMOVED*** Mocks the receipt of a message. Passes the payload the appropriate service.
***REMOVED*** @param {string} serviceName The service to run.
***REMOVED*** @param {string|!Object} payload The argument to pass to the service.
***REMOVED***
goog.testing.messaging.MockMessageChannel.prototype.receive = function(
    serviceName, payload) {
  this.deliver(serviceName, payload);
***REMOVED***
