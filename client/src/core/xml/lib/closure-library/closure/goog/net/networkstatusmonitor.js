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
***REMOVED*** @fileoverview Base class for objects monitoring and exposing runtime
***REMOVED*** network status information.
***REMOVED***

goog.provide('goog.net.NetworkStatusMonitor');

goog.require('goog.events.EventTarget');



***REMOVED***
***REMOVED*** Base class for network status information providers.
***REMOVED***
***REMOVED*** @extends {goog.events.EventTarget}
***REMOVED***
goog.net.NetworkStatusMonitor = function() {
  goog.base(this);
***REMOVED***
goog.inherits(goog.net.NetworkStatusMonitor, goog.events.EventTarget);


***REMOVED***
***REMOVED*** Enum for the events dispatched by the OnlineHandler.
***REMOVED*** @enum {string}
***REMOVED***
goog.net.NetworkStatusMonitor.EventType = {
  ONLINE: 'online',
  OFFLINE: 'offline'
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} Whether the system is online or otherwise.
***REMOVED***
goog.net.NetworkStatusMonitor.prototype.isOnline = goog.abstractMethod;
