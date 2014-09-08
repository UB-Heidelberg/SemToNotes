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
***REMOVED*** @fileoverview A labs location for functions destined for Closure's
***REMOVED*** {@code goog.object} namespace.
***REMOVED***

goog.provide('goog.labs.object');


***REMOVED***
***REMOVED*** Whether two values are not observably distinguishable. This
***REMOVED*** correctly detects that 0 is not the same as -0 and two NaNs are
***REMOVED*** practically equivalent.
***REMOVED***
***REMOVED*** The implementation is as suggested by harmony:egal proposal.
***REMOVED***
***REMOVED*** @param {*} v The first value to compare.
***REMOVED*** @param {*} v2 The second value to compare.
***REMOVED*** @return {boolean} Whether two values are not observably distinguishable.
***REMOVED*** @see http://wiki.ecmascript.org/doku.php?id=harmony:egal
***REMOVED***
goog.labs.object.is = function(v, v2) {
  if (v === v2) {
    // 0 === -0, but they are not identical.
    // We need the cast because the compiler requires that v2 is a
    // number (although 1/v2 works with non-number). We cast to ? to
    // stop the compiler from type-checking this statement.
    return v !== 0 || 1 / v === 1 ***REMOVED****REMOVED*****REMOVED*** @type {?}***REMOVED*** (v2);
  }

  // NaN is non-reflexive: NaN !== NaN, although they are identical.
  return v !== v && v2 !== v2;
***REMOVED***
