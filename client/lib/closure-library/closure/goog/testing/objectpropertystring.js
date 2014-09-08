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
***REMOVED*** @fileoverview Helper for passing property names as string literals in
***REMOVED*** compiled test code.
***REMOVED***
***REMOVED***

goog.provide('goog.testing.ObjectPropertyString');



***REMOVED***
***REMOVED*** Object to pass a property name as a string literal and its containing object
***REMOVED*** when the JSCompiler is rewriting these names. This should only be used in
***REMOVED*** test code.
***REMOVED***
***REMOVED*** @param {Object} object The containing object.
***REMOVED*** @param {Object|string} propertyString Property name as a string literal.
***REMOVED***
***REMOVED*** @final
***REMOVED***
goog.testing.ObjectPropertyString = function(object, propertyString) {
  this.object_ = object;
  this.propertyString_ =***REMOVED*****REMOVED*** @type {string}***REMOVED*** (propertyString);
***REMOVED***


***REMOVED***
***REMOVED*** @type {Object}
***REMOVED*** @private
***REMOVED***
goog.testing.ObjectPropertyString.prototype.object_;


***REMOVED***
***REMOVED*** @type {string}
***REMOVED*** @private
***REMOVED***
goog.testing.ObjectPropertyString.prototype.propertyString_;


***REMOVED***
***REMOVED*** @return {Object} The object.
***REMOVED***
goog.testing.ObjectPropertyString.prototype.getObject = function() {
  return this.object_;
***REMOVED***


***REMOVED***
***REMOVED*** @return {string} The property string.
***REMOVED***
goog.testing.ObjectPropertyString.prototype.getPropertyString = function() {
  return this.propertyString_;
***REMOVED***
