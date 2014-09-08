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
***REMOVED*** @fileoverview Provides the base Matcher interface. User code should use the
***REMOVED*** matchers through assertThat statements and not directly.
***REMOVED***


goog.provide('goog.labs.testing.Matcher');



***REMOVED***
***REMOVED*** A matcher object to be used in assertThat statements.
***REMOVED*** @interface
***REMOVED***
goog.labs.testing.Matcher = function() {***REMOVED***


***REMOVED***
***REMOVED*** Determines whether a value matches the constraints of the match.
***REMOVED***
***REMOVED*** @param {*} value The object to match.
***REMOVED*** @return {boolean} Whether the input value matches this matcher.
***REMOVED***
goog.labs.testing.Matcher.prototype.matches = function(value) {***REMOVED***


***REMOVED***
***REMOVED*** Describes why the matcher failed.
***REMOVED***
***REMOVED*** @param {*} value The value that didn't match.
***REMOVED*** @param {string=} opt_description A partial description to which the reason
***REMOVED***     will be appended.
***REMOVED***
***REMOVED*** @return {string} Description of why the matcher failed.
***REMOVED***
goog.labs.testing.Matcher.prototype.describe =
    function(value, opt_description) {***REMOVED***


***REMOVED***
***REMOVED*** Generates a Matcher from the ‘matches’ and ‘describe’ functions passed in.
***REMOVED***
***REMOVED*** @param {!Function} matchesFunction The ‘matches’ function.
***REMOVED*** @param {Function=} opt_describeFunction The ‘describe’ function.
***REMOVED*** @return {!Function} The custom matcher.
***REMOVED***
goog.labs.testing.Matcher.makeMatcher =
    function(matchesFunction, opt_describeFunction) {

 ***REMOVED*****REMOVED***
 ***REMOVED*****REMOVED***
  ***REMOVED*** @implements {goog.labs.testing.Matcher}
  ***REMOVED*** @final
 ***REMOVED*****REMOVED***
  var matcherConstructor = function() {***REMOVED***

 ***REMOVED*****REMOVED*** @override***REMOVED***
  matcherConstructor.prototype.matches = matchesFunction;

  if (opt_describeFunction) {
   ***REMOVED*****REMOVED*** @override***REMOVED***
    matcherConstructor.prototype.describe = opt_describeFunction;
  }

  return matcherConstructor;
***REMOVED***
