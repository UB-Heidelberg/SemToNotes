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
***REMOVED*** @fileoverview A fake PortNetwork implementation that simply produces
***REMOVED*** MockMessageChannels for all ports.
***REMOVED***
***REMOVED***

goog.provide('goog.testing.messaging.MockPortNetwork');

goog.require('goog.messaging.PortNetwork'); // interface
goog.require('goog.testing.messaging.MockMessageChannel');



***REMOVED***
***REMOVED*** The fake PortNetwork.
***REMOVED***
***REMOVED*** @param {!goog.testing.MockControl} mockControl The mock control for creating
***REMOVED***     the mock message channels.
***REMOVED***
***REMOVED*** @implements {goog.messaging.PortNetwork}
***REMOVED*** @final
***REMOVED***
goog.testing.messaging.MockPortNetwork = function(mockControl) {
 ***REMOVED*****REMOVED***
  ***REMOVED*** The mock control for creating mock message channels.
  ***REMOVED*** @type {!goog.testing.MockControl}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.mockControl_ = mockControl;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The mock ports that have been created.
  ***REMOVED*** @type {!Object.<!goog.testing.messaging.MockMessageChannel>}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.ports_ = {***REMOVED***
***REMOVED***


***REMOVED***
***REMOVED*** Get the mock port with the given name.
***REMOVED*** @param {string} name The name of the port to get.
***REMOVED*** @return {!goog.testing.messaging.MockMessageChannel} The mock port.
***REMOVED*** @override
***REMOVED***
goog.testing.messaging.MockPortNetwork.prototype.dial = function(name) {
  if (!(name in this.ports_)) {
    this.ports_[name] =
        new goog.testing.messaging.MockMessageChannel(this.mockControl_);
  }
  return this.ports_[name];
***REMOVED***
