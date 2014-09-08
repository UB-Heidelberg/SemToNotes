// Copyright 2009 The Closure Library Authors. All Rights Reserved.
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
***REMOVED*** @fileoverview Utility methods for Protocol Buffer 2 implementation.
***REMOVED***

goog.provide('goog.proto2.Util');

goog.require('goog.asserts');


***REMOVED***
***REMOVED*** @define {boolean} Defines a PBCHECK constant that can be turned off by
***REMOVED*** clients of PB2. This for is clients that do not want assertion/checking
***REMOVED*** running even in non-COMPILED builds.
***REMOVED***
goog.define('goog.proto2.Util.PBCHECK', !COMPILED);


***REMOVED***
***REMOVED*** Asserts that the given condition is true, if and only if the PBCHECK
***REMOVED*** flag is on.
***REMOVED***
***REMOVED*** @param {*} condition The condition to check.
***REMOVED*** @param {string=} opt_message Error message in case of failure.
***REMOVED*** @throws {Error} Assertion failed, the condition evaluates to false.
***REMOVED***
goog.proto2.Util.assert = function(condition, opt_message) {
  if (goog.proto2.Util.PBCHECK) {
    goog.asserts.assert(condition, opt_message);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Returns true if debug assertions (checks) are on.
***REMOVED***
***REMOVED*** @return {boolean} The value of the PBCHECK constant.
***REMOVED***
goog.proto2.Util.conductChecks = function() {
  return goog.proto2.Util.PBCHECK;
***REMOVED***
