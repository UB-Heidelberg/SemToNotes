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
***REMOVED*** @fileoverview Provides the built-in number matchers like lessThan,
***REMOVED*** greaterThan, etc.
***REMOVED***


goog.provide('goog.labs.testing.CloseToMatcher');
goog.provide('goog.labs.testing.EqualToMatcher');
goog.provide('goog.labs.testing.GreaterThanEqualToMatcher');
goog.provide('goog.labs.testing.GreaterThanMatcher');
goog.provide('goog.labs.testing.LessThanEqualToMatcher');
goog.provide('goog.labs.testing.LessThanMatcher');


goog.require('goog.asserts');
goog.require('goog.labs.testing.Matcher');



***REMOVED***
***REMOVED*** The GreaterThan matcher.
***REMOVED***
***REMOVED*** @param {number} value The value to compare.
***REMOVED***
***REMOVED***
***REMOVED*** @implements {goog.labs.testing.Matcher}
***REMOVED***
goog.labs.testing.GreaterThanMatcher = function(value) {
 ***REMOVED*****REMOVED***
  ***REMOVED*** @type {number}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.value_ = value;
***REMOVED***


***REMOVED***
***REMOVED*** Determines if input value is greater than the expected value.
***REMOVED***
***REMOVED*** @override
***REMOVED***
goog.labs.testing.GreaterThanMatcher.prototype.matches = function(actualValue) {
  goog.asserts.assertNumber(actualValue);
  return actualValue > this.value_;
***REMOVED***


***REMOVED***
***REMOVED*** @override
***REMOVED***
goog.labs.testing.GreaterThanMatcher.prototype.describe =
    function(actualValue) {
  goog.asserts.assertNumber(actualValue);
  return actualValue + ' is not greater than ' + this.value_;
***REMOVED***



***REMOVED***
***REMOVED*** The lessThan matcher.
***REMOVED***
***REMOVED*** @param {number} value The value to compare.
***REMOVED***
***REMOVED***
***REMOVED*** @implements {goog.labs.testing.Matcher}
***REMOVED***
goog.labs.testing.LessThanMatcher = function(value) {
 ***REMOVED*****REMOVED***
  ***REMOVED*** @type {number}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.value_ = value;
***REMOVED***


***REMOVED***
***REMOVED*** Determines if the input value is less than the expected value.
***REMOVED***
***REMOVED*** @override
***REMOVED***
goog.labs.testing.LessThanMatcher.prototype.matches = function(actualValue) {
  goog.asserts.assertNumber(actualValue);
  return actualValue < this.value_;
***REMOVED***


***REMOVED***
***REMOVED*** @override
***REMOVED***
goog.labs.testing.LessThanMatcher.prototype.describe =
    function(actualValue) {
  goog.asserts.assertNumber(actualValue);
  return actualValue + ' is not less than ' + this.value_;
***REMOVED***



***REMOVED***
***REMOVED*** The GreaterThanEqualTo matcher.
***REMOVED***
***REMOVED*** @param {number} value The value to compare.
***REMOVED***
***REMOVED***
***REMOVED*** @implements {goog.labs.testing.Matcher}
***REMOVED***
goog.labs.testing.GreaterThanEqualToMatcher = function(value) {
 ***REMOVED*****REMOVED***
  ***REMOVED*** @type {number}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.value_ = value;
***REMOVED***


***REMOVED***
***REMOVED*** Determines if the input value is greater than equal to the expected value.
***REMOVED***
***REMOVED*** @override
***REMOVED***
goog.labs.testing.GreaterThanEqualToMatcher.prototype.matches =
    function(actualValue) {
  goog.asserts.assertNumber(actualValue);
  return actualValue >= this.value_;
***REMOVED***


***REMOVED***
***REMOVED*** @override
***REMOVED***
goog.labs.testing.GreaterThanEqualToMatcher.prototype.describe =
    function(actualValue) {
  goog.asserts.assertNumber(actualValue);
  return actualValue + ' is not greater than equal to ' + this.value_;
***REMOVED***



***REMOVED***
***REMOVED*** The LessThanEqualTo matcher.
***REMOVED***
***REMOVED*** @param {number} value The value to compare.
***REMOVED***
***REMOVED***
***REMOVED*** @implements {goog.labs.testing.Matcher}
***REMOVED***
goog.labs.testing.LessThanEqualToMatcher = function(value) {
 ***REMOVED*****REMOVED***
  ***REMOVED*** @type {number}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.value_ = value;
***REMOVED***


***REMOVED***
***REMOVED*** Determines if the input value is less than or equal to the expected value.
***REMOVED***
***REMOVED*** @override
***REMOVED***
goog.labs.testing.LessThanEqualToMatcher.prototype.matches =
    function(actualValue) {
  goog.asserts.assertNumber(actualValue);
  return actualValue <= this.value_;
***REMOVED***


***REMOVED***
***REMOVED*** @override
***REMOVED***
goog.labs.testing.LessThanEqualToMatcher.prototype.describe =
    function(actualValue) {
  goog.asserts.assertNumber(actualValue);
  return actualValue + ' is not less than equal to ' + this.value_;
***REMOVED***



***REMOVED***
***REMOVED*** The EqualTo matcher.
***REMOVED***
***REMOVED*** @param {number} value The value to compare.
***REMOVED***
***REMOVED***
***REMOVED*** @implements {goog.labs.testing.Matcher}
***REMOVED***
goog.labs.testing.EqualToMatcher = function(value) {
 ***REMOVED*****REMOVED***
  ***REMOVED*** @type {number}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.value_ = value;
***REMOVED***


***REMOVED***
***REMOVED*** Determines if the input value is equal to the expected value.
***REMOVED***
***REMOVED*** @override
***REMOVED***
goog.labs.testing.EqualToMatcher.prototype.matches = function(actualValue) {
  goog.asserts.assertNumber(actualValue);
  return actualValue === this.value_;
***REMOVED***


***REMOVED***
***REMOVED*** @override
***REMOVED***
goog.labs.testing.EqualToMatcher.prototype.describe =
    function(actualValue) {
  goog.asserts.assertNumber(actualValue);
  return actualValue + ' is not equal to ' + this.value_;
***REMOVED***



***REMOVED***
***REMOVED*** The CloseTo matcher.
***REMOVED***
***REMOVED*** @param {number} value The value to compare.
***REMOVED*** @param {number} range The range to check within.
***REMOVED***
***REMOVED***
***REMOVED*** @implements {goog.labs.testing.Matcher}
***REMOVED***
goog.labs.testing.CloseToMatcher = function(value, range) {
 ***REMOVED*****REMOVED***
  ***REMOVED*** @type {number}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.value_ = value;
 ***REMOVED*****REMOVED***
  ***REMOVED*** @type {number}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.range_ = range;
***REMOVED***


***REMOVED***
***REMOVED*** Determines if input value is within a certain range of the expected value.
***REMOVED***
***REMOVED*** @override
***REMOVED***
goog.labs.testing.CloseToMatcher.prototype.matches = function(actualValue) {
  goog.asserts.assertNumber(actualValue);
  return Math.abs(this.value_ - actualValue) < this.range_;
***REMOVED***


***REMOVED***
***REMOVED*** @override
***REMOVED***
goog.labs.testing.CloseToMatcher.prototype.describe =
    function(actualValue) {
  goog.asserts.assertNumber(actualValue);
  return actualValue + ' is not close to(' + this.range_ + ') ' + this.value_;
***REMOVED***


***REMOVED***
***REMOVED*** @param {number} value The expected value.
***REMOVED***
***REMOVED*** @return {!goog.labs.testing.GreaterThanMatcher} A GreaterThanMatcher.
***REMOVED***
function greaterThan(value) {
  return new goog.labs.testing.GreaterThanMatcher(value);
}


***REMOVED***
***REMOVED*** @param {number} value The expected value.
***REMOVED***
***REMOVED*** @return {!goog.labs.testing.GreaterThanEqualToMatcher} A
***REMOVED***     GreaterThanEqualToMatcher.
***REMOVED***
function greaterThanEqualTo(value) {
  return new goog.labs.testing.GreaterThanEqualToMatcher(value);
}


***REMOVED***
***REMOVED*** @param {number} value The expected value.
***REMOVED***
***REMOVED*** @return {!goog.labs.testing.LessThanMatcher} A LessThanMatcher.
***REMOVED***
function lessThan(value) {
  return new goog.labs.testing.LessThanMatcher(value);
}


***REMOVED***
***REMOVED*** @param {number} value The expected value.
***REMOVED***
***REMOVED*** @return {!goog.labs.testing.LessThanEqualToMatcher} A LessThanEqualToMatcher.
***REMOVED***
function lessThanEqualTo(value) {
  return new goog.labs.testing.LessThanEqualToMatcher(value);
}


***REMOVED***
***REMOVED*** @param {number} value The expected value.
***REMOVED***
***REMOVED*** @return {!goog.labs.testing.EqualToMatcher} An EqualToMatcher.
***REMOVED***
function equalTo(value) {
  return new goog.labs.testing.EqualToMatcher(value);
}


***REMOVED***
***REMOVED*** @param {number} value The expected value.
***REMOVED*** @param {number} range The maximum allowed difference from the expected value.
***REMOVED***
***REMOVED*** @return {!goog.labs.testing.CloseToMatcher} A CloseToMatcher.
***REMOVED***
function closeTo(value, range) {
  return new goog.labs.testing.CloseToMatcher(value, range);
}
