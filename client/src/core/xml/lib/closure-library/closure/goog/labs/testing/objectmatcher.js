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
***REMOVED*** @fileoverview Provides the built-in object matchers like equalsObject,
***REMOVED***     hasProperty, instanceOf, etc.
***REMOVED***



goog.provide('goog.labs.testing.HasPropertyMatcher');
goog.provide('goog.labs.testing.InstanceOfMatcher');
goog.provide('goog.labs.testing.IsNullMatcher');
goog.provide('goog.labs.testing.IsNullOrUndefinedMatcher');
goog.provide('goog.labs.testing.IsUndefinedMatcher');
goog.provide('goog.labs.testing.ObjectEqualsMatcher');


goog.require('goog.labs.testing.Matcher');
goog.require('goog.string');



***REMOVED***
***REMOVED*** The Equals matcher.
***REMOVED***
***REMOVED*** @param {!Object} expectedObject The expected object.
***REMOVED***
***REMOVED***
***REMOVED*** @implements {goog.labs.testing.Matcher}
***REMOVED***
goog.labs.testing.ObjectEqualsMatcher = function(expectedObject) {
 ***REMOVED*****REMOVED***
  ***REMOVED*** @type {!Object}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.object_ = expectedObject;
***REMOVED***


***REMOVED***
***REMOVED*** Determines if two objects are the same.
***REMOVED***
***REMOVED*** @override
***REMOVED***
goog.labs.testing.ObjectEqualsMatcher.prototype.matches =
    function(actualObject) {
  return actualObject === this.object_;
***REMOVED***


***REMOVED***
***REMOVED*** @override
***REMOVED***
goog.labs.testing.ObjectEqualsMatcher.prototype.describe =
    function(actualObject) {
  return 'Input object is not the same as the expected object.';
***REMOVED***



***REMOVED***
***REMOVED*** The HasProperty matcher.
***REMOVED***
***REMOVED*** @param {string} property Name of the property to test.
***REMOVED***
***REMOVED***
***REMOVED*** @implements {goog.labs.testing.Matcher}
***REMOVED***
goog.labs.testing.HasPropertyMatcher = function(property) {
 ***REMOVED*****REMOVED***
  ***REMOVED*** @type {string}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.property_ = property;
***REMOVED***


***REMOVED***
***REMOVED*** Determines if an object has a property.
***REMOVED***
***REMOVED*** @override
***REMOVED***
goog.labs.testing.HasPropertyMatcher.prototype.matches =
    function(actualObject) {
  return this.property_ in actualObject;
***REMOVED***


***REMOVED***
***REMOVED*** @override
***REMOVED***
goog.labs.testing.HasPropertyMatcher.prototype.describe =
    function(actualObject) {
  return 'Object does not have property: ' + this.property_;
***REMOVED***



***REMOVED***
***REMOVED*** The InstanceOf matcher.
***REMOVED***
***REMOVED*** @param {!Object} object The expected class object.
***REMOVED***
***REMOVED***
***REMOVED*** @implements {goog.labs.testing.Matcher}
***REMOVED***
goog.labs.testing.InstanceOfMatcher = function(object) {
 ***REMOVED*****REMOVED***
  ***REMOVED*** @type {!Object}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.object_ = object;
***REMOVED***


***REMOVED***
***REMOVED*** Determines if an object is an instance of another object.
***REMOVED***
***REMOVED*** @override
***REMOVED***
goog.labs.testing.InstanceOfMatcher.prototype.matches =
    function(actualObject) {
  return actualObject instanceof this.object_;
***REMOVED***


***REMOVED***
***REMOVED*** @override
***REMOVED***
goog.labs.testing.InstanceOfMatcher.prototype.describe =
    function(actualObject) {
  return 'Input object is not an instance of the expected object';
***REMOVED***



***REMOVED***
***REMOVED*** The IsNullOrUndefined matcher.
***REMOVED***
***REMOVED***
***REMOVED*** @implements {goog.labs.testing.Matcher}
***REMOVED***
goog.labs.testing.IsNullOrUndefinedMatcher = function() {***REMOVED***


***REMOVED***
***REMOVED*** Determines if input value is null or undefined.
***REMOVED***
***REMOVED*** @override
***REMOVED***
goog.labs.testing.IsNullOrUndefinedMatcher.prototype.matches =
    function(actualValue) {
  return !goog.isDefAndNotNull(actualValue);
***REMOVED***


***REMOVED***
***REMOVED*** @override
***REMOVED***
goog.labs.testing.IsNullOrUndefinedMatcher.prototype.describe =
    function(actualValue) {
  return actualValue + ' is not null or undefined.';
***REMOVED***



***REMOVED***
***REMOVED*** The IsNull matcher.
***REMOVED***
***REMOVED***
***REMOVED*** @implements {goog.labs.testing.Matcher}
***REMOVED***
goog.labs.testing.IsNullMatcher = function() {***REMOVED***


***REMOVED***
***REMOVED*** Determines if input value is null.
***REMOVED***
***REMOVED*** @override
***REMOVED***
goog.labs.testing.IsNullMatcher.prototype.matches =
    function(actualValue) {
  return goog.isNull(actualValue);
***REMOVED***


***REMOVED***
***REMOVED*** @override
***REMOVED***
goog.labs.testing.IsNullMatcher.prototype.describe =
    function(actualValue) {
  return actualValue + ' is not null.';
***REMOVED***



***REMOVED***
***REMOVED*** The IsUndefined matcher.
***REMOVED***
***REMOVED***
***REMOVED*** @implements {goog.labs.testing.Matcher}
***REMOVED***
goog.labs.testing.IsUndefinedMatcher = function() {***REMOVED***


***REMOVED***
***REMOVED*** Determines if input value is undefined.
***REMOVED***
***REMOVED*** @override
***REMOVED***
goog.labs.testing.IsUndefinedMatcher.prototype.matches =
    function(actualValue) {
  return !goog.isDef(actualValue);
***REMOVED***


***REMOVED***
***REMOVED*** @override
***REMOVED***
goog.labs.testing.IsUndefinedMatcher.prototype.describe =
    function(actualValue) {
  return actualValue + ' is not undefined.';
***REMOVED***


***REMOVED***
***REMOVED*** Returns a matcher that matches objects that are equal to the input object.
***REMOVED*** Equality in this case means the two objects are references to the same
***REMOVED*** object.
***REMOVED***
***REMOVED*** @param {!Object} object The expected object.
***REMOVED***
***REMOVED*** @return {!goog.labs.testing.ObjectEqualsMatcher} A
***REMOVED***     ObjectEqualsMatcher.
***REMOVED***
function equalsObject(object) {
  return new goog.labs.testing.ObjectEqualsMatcher(object);
}


***REMOVED***
***REMOVED*** Returns a matcher that matches objects that contain the input property.
***REMOVED***
***REMOVED*** @param {string} property The property name to check.
***REMOVED***
***REMOVED*** @return {!goog.labs.testing.HasPropertyMatcher} A HasPropertyMatcher.
***REMOVED***
function hasProperty(property) {
  return new goog.labs.testing.HasPropertyMatcher(property);
}


***REMOVED***
***REMOVED*** Returns a matcher that matches instances of the input class.
***REMOVED***
***REMOVED*** @param {!Object} object The class object.
***REMOVED***
***REMOVED*** @return {!goog.labs.testing.InstanceOfMatcher} A
***REMOVED***     InstanceOfMatcher.
***REMOVED***
function instanceOfClass(object) {
  return new goog.labs.testing.InstanceOfMatcher(object);
}


***REMOVED***
***REMOVED*** Returns a matcher that matches all null values.
***REMOVED***
***REMOVED*** @return {!goog.labs.testing.IsNullMatcher} A IsNullMatcher.
***REMOVED***
function isNull() {
  return new goog.labs.testing.IsNullMatcher();
}


***REMOVED***
***REMOVED*** Returns a matcher that matches all null and undefined values.
***REMOVED***
***REMOVED*** @return {!goog.labs.testing.IsNullOrUndefinedMatcher} A
***REMOVED***     IsNullOrUndefinedMatcher.
***REMOVED***
function isNullOrUndefined() {
  return new goog.labs.testing.IsNullOrUndefinedMatcher();
}


***REMOVED***
***REMOVED*** Returns a matcher that matches undefined values.
***REMOVED***
***REMOVED*** @return {!goog.labs.testing.IsUndefinedMatcher} A IsUndefinedMatcher.
***REMOVED***
function isUndefined() {
  return new goog.labs.testing.IsUndefinedMatcher();
}
