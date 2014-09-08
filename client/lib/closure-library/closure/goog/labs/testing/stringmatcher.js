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
***REMOVED*** @fileoverview Provides the built-in string matchers like containsString,
***REMOVED***     startsWith, endsWith, etc.
***REMOVED***


goog.provide('goog.labs.testing.ContainsStringMatcher');
goog.provide('goog.labs.testing.EndsWithMatcher');
goog.provide('goog.labs.testing.EqualToIgnoringCaseMatcher');
goog.provide('goog.labs.testing.EqualToIgnoringWhitespaceMatcher');
goog.provide('goog.labs.testing.EqualsMatcher');
goog.provide('goog.labs.testing.RegexMatcher');
goog.provide('goog.labs.testing.StartsWithMatcher');
goog.provide('goog.labs.testing.StringContainsInOrderMatcher');


goog.require('goog.asserts');
goog.require('goog.labs.testing.Matcher');
goog.require('goog.string');



***REMOVED***
***REMOVED*** The ContainsString matcher.
***REMOVED***
***REMOVED*** @param {string} value The expected string.
***REMOVED***
***REMOVED***
***REMOVED*** @struct
***REMOVED*** @implements {goog.labs.testing.Matcher}
***REMOVED*** @final
***REMOVED***
goog.labs.testing.ContainsStringMatcher = function(value) {
 ***REMOVED*****REMOVED***
  ***REMOVED*** @type {string}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.value_ = value;
***REMOVED***


***REMOVED***
***REMOVED*** Determines if input string contains the expected string.
***REMOVED***
***REMOVED*** @override
***REMOVED***
goog.labs.testing.ContainsStringMatcher.prototype.matches =
    function(actualValue) {
  goog.asserts.assertString(actualValue);
  return goog.string.contains(actualValue, this.value_);
***REMOVED***


***REMOVED***
***REMOVED*** @override
***REMOVED***
goog.labs.testing.ContainsStringMatcher.prototype.describe =
    function(actualValue) {
  return actualValue + ' does not contain ' + this.value_;
***REMOVED***



***REMOVED***
***REMOVED*** The EndsWith matcher.
***REMOVED***
***REMOVED*** @param {string} value The expected string.
***REMOVED***
***REMOVED***
***REMOVED*** @struct
***REMOVED*** @implements {goog.labs.testing.Matcher}
***REMOVED*** @final
***REMOVED***
goog.labs.testing.EndsWithMatcher = function(value) {
 ***REMOVED*****REMOVED***
  ***REMOVED*** @type {string}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.value_ = value;
***REMOVED***


***REMOVED***
***REMOVED*** Determines if input string ends with the expected string.
***REMOVED***
***REMOVED*** @override
***REMOVED***
goog.labs.testing.EndsWithMatcher.prototype.matches = function(actualValue) {
  goog.asserts.assertString(actualValue);
  return goog.string.endsWith(actualValue, this.value_);
***REMOVED***


***REMOVED***
***REMOVED*** @override
***REMOVED***
goog.labs.testing.EndsWithMatcher.prototype.describe =
    function(actualValue) {
  return actualValue + ' does not end with ' + this.value_;
***REMOVED***



***REMOVED***
***REMOVED*** The EqualToIgnoringWhitespace matcher.
***REMOVED***
***REMOVED*** @param {string} value The expected string.
***REMOVED***
***REMOVED***
***REMOVED*** @struct
***REMOVED*** @implements {goog.labs.testing.Matcher}
***REMOVED*** @final
***REMOVED***
goog.labs.testing.EqualToIgnoringWhitespaceMatcher = function(value) {
 ***REMOVED*****REMOVED***
  ***REMOVED*** @type {string}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.value_ = value;
***REMOVED***


***REMOVED***
***REMOVED*** Determines if input string contains the expected string.
***REMOVED***
***REMOVED*** @override
***REMOVED***
goog.labs.testing.EqualToIgnoringWhitespaceMatcher.prototype.matches =
    function(actualValue) {
  goog.asserts.assertString(actualValue);
  var string1 = goog.string.collapseWhitespace(actualValue);

  return goog.string.caseInsensitiveCompare(this.value_, string1) === 0;
***REMOVED***


***REMOVED***
***REMOVED*** @override
***REMOVED***
goog.labs.testing.EqualToIgnoringWhitespaceMatcher.prototype.describe =
    function(actualValue) {
  return actualValue + ' is not equal(ignoring whitespace) to ' + this.value_;
***REMOVED***



***REMOVED***
***REMOVED*** The Equals matcher.
***REMOVED***
***REMOVED*** @param {string} value The expected string.
***REMOVED***
***REMOVED***
***REMOVED*** @struct
***REMOVED*** @implements {goog.labs.testing.Matcher}
***REMOVED*** @final
***REMOVED***
goog.labs.testing.EqualsMatcher = function(value) {
 ***REMOVED*****REMOVED***
  ***REMOVED*** @type {string}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.value_ = value;
***REMOVED***


***REMOVED***
***REMOVED*** Determines if input string is equal to the expected string.
***REMOVED***
***REMOVED*** @override
***REMOVED***
goog.labs.testing.EqualsMatcher.prototype.matches = function(actualValue) {
  goog.asserts.assertString(actualValue);
  return this.value_ === actualValue;
***REMOVED***


***REMOVED***
***REMOVED*** @override
***REMOVED***
goog.labs.testing.EqualsMatcher.prototype.describe =
    function(actualValue) {
  return actualValue + ' is not equal to ' + this.value_;
***REMOVED***



***REMOVED***
***REMOVED*** The MatchesRegex matcher.
***REMOVED***
***REMOVED*** @param {!RegExp} regex The expected regex.
***REMOVED***
***REMOVED***
***REMOVED*** @struct
***REMOVED*** @implements {goog.labs.testing.Matcher}
***REMOVED*** @final
***REMOVED***
goog.labs.testing.RegexMatcher = function(regex) {
 ***REMOVED*****REMOVED***
  ***REMOVED*** @type {!RegExp}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.regex_ = regex;
***REMOVED***


***REMOVED***
***REMOVED*** Determines if input string is equal to the expected string.
***REMOVED***
***REMOVED*** @override
***REMOVED***
goog.labs.testing.RegexMatcher.prototype.matches = function(
    actualValue) {
  goog.asserts.assertString(actualValue);
  return this.regex_.test(actualValue);
***REMOVED***


***REMOVED***
***REMOVED*** @override
***REMOVED***
goog.labs.testing.RegexMatcher.prototype.describe =
    function(actualValue) {
  return actualValue + ' does not match ' + this.regex_;
***REMOVED***



***REMOVED***
***REMOVED*** The StartsWith matcher.
***REMOVED***
***REMOVED*** @param {string} value The expected string.
***REMOVED***
***REMOVED***
***REMOVED*** @struct
***REMOVED*** @implements {goog.labs.testing.Matcher}
***REMOVED*** @final
***REMOVED***
goog.labs.testing.StartsWithMatcher = function(value) {
 ***REMOVED*****REMOVED***
  ***REMOVED*** @type {string}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.value_ = value;
***REMOVED***


***REMOVED***
***REMOVED*** Determines if input string starts with the expected string.
***REMOVED***
***REMOVED*** @override
***REMOVED***
goog.labs.testing.StartsWithMatcher.prototype.matches = function(actualValue) {
  goog.asserts.assertString(actualValue);
  return goog.string.startsWith(actualValue, this.value_);
***REMOVED***


***REMOVED***
***REMOVED*** @override
***REMOVED***
goog.labs.testing.StartsWithMatcher.prototype.describe =
    function(actualValue) {
  return actualValue + ' does not start with ' + this.value_;
***REMOVED***



***REMOVED***
***REMOVED*** The StringContainsInOrdermatcher.
***REMOVED***
***REMOVED*** @param {Array.<string>} values The expected string values.
***REMOVED***
***REMOVED***
***REMOVED*** @struct
***REMOVED*** @implements {goog.labs.testing.Matcher}
***REMOVED*** @final
***REMOVED***
goog.labs.testing.StringContainsInOrderMatcher = function(values) {
 ***REMOVED*****REMOVED***
  ***REMOVED*** @type {Array.<string>}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.values_ = values;
***REMOVED***


***REMOVED***
***REMOVED*** Determines if input string contains, in order, the expected array of strings.
***REMOVED***
***REMOVED*** @override
***REMOVED***
goog.labs.testing.StringContainsInOrderMatcher.prototype.matches =
    function(actualValue) {
  goog.asserts.assertString(actualValue);
  var currentIndex, previousIndex = 0;
  for (var i = 0; i < this.values_.length; i++) {
    currentIndex = goog.string.contains(actualValue, this.values_[i]);
    if (currentIndex < 0 || currentIndex < previousIndex) {
      return false;
    }
    previousIndex = currentIndex;
  }
  return true;
***REMOVED***


***REMOVED***
***REMOVED*** @override
***REMOVED***
goog.labs.testing.StringContainsInOrderMatcher.prototype.describe =
    function(actualValue) {
  return actualValue + ' does not contain the expected values in order.';
***REMOVED***


***REMOVED***
***REMOVED*** Matches a string containing the given string.
***REMOVED***
***REMOVED*** @param {string} value The expected value.
***REMOVED***
***REMOVED*** @return {!goog.labs.testing.ContainsStringMatcher} A
***REMOVED***     ContainsStringMatcher.
***REMOVED***
function containsString(value) {
  return new goog.labs.testing.ContainsStringMatcher(value);
}


***REMOVED***
***REMOVED*** Matches a string that ends with the given string.
***REMOVED***
***REMOVED*** @param {string} value The expected value.
***REMOVED***
***REMOVED*** @return {!goog.labs.testing.EndsWithMatcher} A
***REMOVED***     EndsWithMatcher.
***REMOVED***
function endsWith(value) {
  return new goog.labs.testing.EndsWithMatcher(value);
}


***REMOVED***
***REMOVED*** Matches a string that equals (ignoring whitespace) the given string.
***REMOVED***
***REMOVED*** @param {string} value The expected value.
***REMOVED***
***REMOVED*** @return {!goog.labs.testing.EqualToIgnoringWhitespaceMatcher} A
***REMOVED***     EqualToIgnoringWhitespaceMatcher.
***REMOVED***
function equalToIgnoringWhitespace(value) {
  return new goog.labs.testing.EqualToIgnoringWhitespaceMatcher(value);
}


***REMOVED***
***REMOVED*** Matches a string that equals the given string.
***REMOVED***
***REMOVED*** @param {string} value The expected value.
***REMOVED***
***REMOVED*** @return {!goog.labs.testing.EqualsMatcher} A EqualsMatcher.
***REMOVED***
function equals(value) {
  return new goog.labs.testing.EqualsMatcher(value);
}


***REMOVED***
***REMOVED*** Matches a string against a regular expression.
***REMOVED***
***REMOVED*** @param {!RegExp} regex The expected regex.
***REMOVED***
***REMOVED*** @return {!goog.labs.testing.RegexMatcher} A RegexMatcher.
***REMOVED***
function matchesRegex(regex) {
  return new goog.labs.testing.RegexMatcher(regex);
}


***REMOVED***
***REMOVED*** Matches a string that starts with the given string.
***REMOVED***
***REMOVED*** @param {string} value The expected value.
***REMOVED***
***REMOVED*** @return {!goog.labs.testing.StartsWithMatcher} A
***REMOVED***     StartsWithMatcher.
***REMOVED***
function startsWith(value) {
  return new goog.labs.testing.StartsWithMatcher(value);
}


***REMOVED***
***REMOVED*** Matches a string that contains the given strings in order.
***REMOVED***
***REMOVED*** @param {Array.<string>} values The expected value.
***REMOVED***
***REMOVED*** @return {!goog.labs.testing.StringContainsInOrderMatcher} A
***REMOVED***     StringContainsInOrderMatcher.
***REMOVED***
function stringContainsInOrder(values) {
  return new goog.labs.testing.StringContainsInOrderMatcher(values);
}
