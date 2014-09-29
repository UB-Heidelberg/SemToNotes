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
***REMOVED*** @fileoverview Provides the built-in decorators: is, describedAs, anything.
***REMOVED***



goog.provide('goog.labs.testing.AnythingMatcher');


goog.require('goog.labs.testing.Matcher');



***REMOVED***
***REMOVED*** The Anything matcher. Matches all possible inputs.
***REMOVED***
***REMOVED***
***REMOVED*** @implements {goog.labs.testing.Matcher}
***REMOVED***
goog.labs.testing.AnythingMatcher = function() {***REMOVED***


***REMOVED***
***REMOVED*** Matches anything. Useful if one doesn't care what the object under test is.
***REMOVED***
***REMOVED*** @override
***REMOVED***
goog.labs.testing.AnythingMatcher.prototype.matches =
    function(actualObject) {
  return true;
***REMOVED***


***REMOVED***
***REMOVED*** This method is never called but is needed so AnythingMatcher implements the
***REMOVED*** Matcher interface.
***REMOVED***
***REMOVED*** @override
***REMOVED***
goog.labs.testing.AnythingMatcher.prototype.describe =
    function(actualObject) {
  throw Error('AnythingMatcher should never fail!');
***REMOVED***


***REMOVED***
***REMOVED*** Returns a matcher that matches anything.
***REMOVED***
***REMOVED*** @return {!goog.labs.testing.AnythingMatcher} A AnythingMatcher.
***REMOVED***
function anything() {
  return new goog.labs.testing.AnythingMatcher();
}


***REMOVED***
***REMOVED*** Returnes any matcher that is passed to it (aids readability).
***REMOVED***
***REMOVED*** @param {!goog.labs.testing.Matcher} matcher A matcher.
***REMOVED*** @return {!goog.labs.testing.Matcher} The wrapped matcher.
***REMOVED***
function is(matcher) {
  return matcher;
}


***REMOVED***
***REMOVED*** Returns a matcher with a customized description for the given matcher.
***REMOVED***
***REMOVED*** @param {string} description The custom description for the matcher.
***REMOVED*** @param {!goog.labs.testing.Matcher} matcher The matcher.
***REMOVED***
***REMOVED*** @return {!goog.labs.testing.Matcher} The matcher with custom description.
***REMOVED***
function describedAs(description, matcher) {
  matcher.describe = function(value) {
    return description;
 ***REMOVED*****REMOVED***
  return matcher;
}
