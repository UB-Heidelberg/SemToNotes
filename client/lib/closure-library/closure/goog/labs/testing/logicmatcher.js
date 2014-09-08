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
***REMOVED*** @fileoverview Provides the built-in logic matchers: anyOf, allOf, and isNot.
***REMOVED***
***REMOVED***


goog.provide('goog.labs.testing.AllOfMatcher');
goog.provide('goog.labs.testing.AnyOfMatcher');
goog.provide('goog.labs.testing.IsNotMatcher');


goog.require('goog.array');
goog.require('goog.labs.testing.Matcher');



***REMOVED***
***REMOVED*** The AllOf matcher.
***REMOVED***
***REMOVED*** @param {!Array.<!goog.labs.testing.Matcher>} matchers Input matchers.
***REMOVED***
***REMOVED***
***REMOVED*** @struct
***REMOVED*** @implements {goog.labs.testing.Matcher}
***REMOVED*** @final
***REMOVED***
goog.labs.testing.AllOfMatcher = function(matchers) {
 ***REMOVED*****REMOVED***
  ***REMOVED*** @type {!Array.<!goog.labs.testing.Matcher>}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.matchers_ = matchers;
***REMOVED***


***REMOVED***
***REMOVED*** Determines if all of the matchers match the input value.
***REMOVED***
***REMOVED*** @override
***REMOVED***
goog.labs.testing.AllOfMatcher.prototype.matches = function(actualValue) {
  return goog.array.every(this.matchers_, function(matcher) {
    return matcher.matches(actualValue);
  });
***REMOVED***


***REMOVED***
***REMOVED*** Describes why the matcher failed. The returned string is a concatenation of
***REMOVED*** all the failed matchers' error strings.
***REMOVED***
***REMOVED*** @override
***REMOVED***
goog.labs.testing.AllOfMatcher.prototype.describe =
    function(actualValue) {
  // TODO(user) : Optimize this to remove duplication with matches ?
  var errorString = '';
  goog.array.forEach(this.matchers_, function(matcher) {
    if (!matcher.matches(actualValue)) {
      errorString += matcher.describe(actualValue) + '\n';
    }
  });
  return errorString;
***REMOVED***



***REMOVED***
***REMOVED*** The AnyOf matcher.
***REMOVED***
***REMOVED*** @param {!Array.<!goog.labs.testing.Matcher>} matchers Input matchers.
***REMOVED***
***REMOVED***
***REMOVED*** @struct
***REMOVED*** @implements {goog.labs.testing.Matcher}
***REMOVED*** @final
***REMOVED***
goog.labs.testing.AnyOfMatcher = function(matchers) {
 ***REMOVED*****REMOVED***
  ***REMOVED*** @type {!Array.<!goog.labs.testing.Matcher>}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.matchers_ = matchers;
***REMOVED***


***REMOVED***
***REMOVED*** Determines if any of the matchers matches the input value.
***REMOVED***
***REMOVED*** @override
***REMOVED***
goog.labs.testing.AnyOfMatcher.prototype.matches = function(actualValue) {
  return goog.array.some(this.matchers_, function(matcher) {
    return matcher.matches(actualValue);
  });
***REMOVED***


***REMOVED***
***REMOVED*** Describes why the matcher failed.
***REMOVED***
***REMOVED*** @override
***REMOVED***
goog.labs.testing.AnyOfMatcher.prototype.describe =
    function(actualValue) {
  // TODO(user) : Optimize this to remove duplication with matches ?
  var errorString = '';
  goog.array.forEach(this.matchers_, function(matcher) {
    if (!matcher.matches(actualValue)) {
      errorString += matcher.describe(actualValue) + '\n';
    }
  });
  return errorString;
***REMOVED***



***REMOVED***
***REMOVED*** The IsNot matcher.
***REMOVED***
***REMOVED*** @param {!goog.labs.testing.Matcher} matcher The matcher to negate.
***REMOVED***
***REMOVED***
***REMOVED*** @struct
***REMOVED*** @implements {goog.labs.testing.Matcher}
***REMOVED*** @final
***REMOVED***
goog.labs.testing.IsNotMatcher = function(matcher) {
 ***REMOVED*****REMOVED***
  ***REMOVED*** @type {!goog.labs.testing.Matcher}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.matcher_ = matcher;
***REMOVED***


***REMOVED***
***REMOVED*** Determines if the input value doesn't satisfy a matcher.
***REMOVED***
***REMOVED*** @override
***REMOVED***
goog.labs.testing.IsNotMatcher.prototype.matches = function(actualValue) {
  return !this.matcher_.matches(actualValue);
***REMOVED***


***REMOVED***
***REMOVED*** Describes why the matcher failed.
***REMOVED***
***REMOVED*** @override
***REMOVED***
goog.labs.testing.IsNotMatcher.prototype.describe =
    function(actualValue) {
  return 'The following is false: ' + this.matcher_.describe(actualValue);
***REMOVED***


***REMOVED***
***REMOVED*** Creates a matcher that will succeed only if all of the given matchers
***REMOVED*** succeed.
***REMOVED***
***REMOVED*** @param {...goog.labs.testing.Matcher} var_args The matchers to test
***REMOVED***     against.
***REMOVED***
***REMOVED*** @return {!goog.labs.testing.AllOfMatcher} The AllOf matcher.
***REMOVED***
function allOf(var_args) {
  var matchers = goog.array.toArray(arguments);
  return new goog.labs.testing.AllOfMatcher(matchers);
}


***REMOVED***
***REMOVED*** Accepts a set of matchers and returns a matcher which matches
***REMOVED*** values which satisfy the constraints of any of the given matchers.
***REMOVED***
***REMOVED*** @param {...goog.labs.testing.Matcher} var_args The matchers to test
***REMOVED***     against.
***REMOVED***
***REMOVED*** @return {!goog.labs.testing.AnyOfMatcher} The AnyOf matcher.
***REMOVED***
function anyOf(var_args) {
  var matchers = goog.array.toArray(arguments);
  return new goog.labs.testing.AnyOfMatcher(matchers);
}


***REMOVED***
***REMOVED*** Returns a matcher that negates the input matcher. The returned
***REMOVED*** matcher matches the values not matched by the input matcher and vice-versa.
***REMOVED***
***REMOVED*** @param {!goog.labs.testing.Matcher} matcher The matcher to test against.
***REMOVED***
***REMOVED*** @return {!goog.labs.testing.IsNotMatcher} The IsNot matcher.
***REMOVED***
function isNot(matcher) {
  return new goog.labs.testing.IsNotMatcher(matcher);
}
