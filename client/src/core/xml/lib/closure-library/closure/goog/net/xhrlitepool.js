// Copyright 2006 The Closure Library Authors. All Rights Reserved.
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
***REMOVED*** @fileoverview Creates a pool of XhrLite objects to use. This allows multiple
***REMOVED*** XhrLite objects to be grouped together and requests will use next available
***REMOVED*** XhrLite object.
***REMOVED***
***REMOVED***

goog.provide('goog.net.XhrLitePool');

goog.require('goog.net.XhrIoPool');



***REMOVED***
***REMOVED*** A pool of XhrLite objects.
***REMOVED*** @param {goog.structs.Map=} opt_headers Map of default headers to add to every
***REMOVED***     request.
***REMOVED*** @param {number=} opt_minCount Min. number of objects (Default: 1).
***REMOVED*** @param {number=} opt_maxCount Max. number of objects (Default: 10).
***REMOVED*** @deprecated Use goog.net.XhrIoPool.
***REMOVED***
***REMOVED***
goog.net.XhrLitePool = goog.net.XhrIoPool;
