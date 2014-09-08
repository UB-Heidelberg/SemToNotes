// Copyright 2012 The Closure Library Authors. All Rights Reserved.
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
***REMOVED*** @fileoverview NetworkStatusMonitor test double.
***REMOVED*** @author dbk@google.com (David Barrett-Kahn)
***REMOVED***

goog.provide('goog.testing.events.OnlineHandler');

goog.require('goog.events.EventTarget');
goog.require('goog.net.NetworkStatusMonitor');



***REMOVED***
***REMOVED*** NetworkStatusMonitor test double.
***REMOVED*** @param {boolean} initialState The initial online state of the mock.
***REMOVED***
***REMOVED*** @extends {goog.events.EventTarget}
***REMOVED*** @implements {goog.net.NetworkStatusMonitor}
***REMOVED*** @final
***REMOVED***
goog.testing.events.OnlineHandler = function(initialState) {
  goog.testing.events.OnlineHandler.base(this, 'constructor');

 ***REMOVED*****REMOVED***
  ***REMOVED*** Whether the mock is online.
  ***REMOVED*** @private {boolean}
 ***REMOVED*****REMOVED***
  this.online_ = initialState;
***REMOVED***
goog.inherits(goog.testing.events.OnlineHandler, goog.events.EventTarget);


***REMOVED*** @override***REMOVED***
goog.testing.events.OnlineHandler.prototype.isOnline = function() {
  return this.online_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the online state.
***REMOVED*** @param {boolean} newOnlineState The new online state.
***REMOVED***
goog.testing.events.OnlineHandler.prototype.setOnline =
    function(newOnlineState) {
  if (newOnlineState != this.online_) {
    this.online_ = newOnlineState;
    this.dispatchEvent(newOnlineState ?
        goog.net.NetworkStatusMonitor.EventType.ONLINE :
        goog.net.NetworkStatusMonitor.EventType.OFFLINE);
  }
***REMOVED***
