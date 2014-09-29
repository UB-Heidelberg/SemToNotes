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
***REMOVED*** @fileoverview Mock of XhrLite for unit testing.
***REMOVED***
***REMOVED***

goog.provide('goog.net.MockXhrLite');

goog.require('goog.testing.net.XhrIo');



***REMOVED***
***REMOVED*** Mock implementation of goog.net.XhrLite. This doesn't provide a mock
***REMOVED*** implementation for all cases, but it's not too hard to add them as needed.
***REMOVED*** @param {goog.testing.TestQueue=} opt_testQueue Test queue for inserting test
***REMOVED***     events.
***REMOVED*** @deprecated Use goog.testing.net.XhrIo.
***REMOVED***
***REMOVED***
goog.net.MockXhrLite = goog.testing.net.XhrIo;
