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
***REMOVED*** @fileoverview Useful compiler idioms.
***REMOVED***
***REMOVED***

goog.provide('goog.reflect');


***REMOVED***
***REMOVED*** Syntax for object literal casts.
***REMOVED*** @see http://go/jscompiler-renaming
***REMOVED*** @see http://code.google.com/p/closure-compiler/wiki/
***REMOVED***      ExperimentalTypeBasedPropertyRenaming
***REMOVED***
***REMOVED*** Use this if you have an object literal whose keys need to have the same names
***REMOVED*** as the properties of some class even after they are renamed by the compiler.
***REMOVED***
***REMOVED*** @param {!Function} type Type to cast to.
***REMOVED*** @param {Object} object Object literal to cast.
***REMOVED*** @return {Object} The object literal.
***REMOVED***
goog.reflect.object = function(type, object) {
  return object;
***REMOVED***


***REMOVED***
***REMOVED*** To assert to the compiler that an operation is needed when it would
***REMOVED*** otherwise be stripped. For example:
***REMOVED*** <code>
***REMOVED***     // Force a layout
***REMOVED***     goog.reflect.sinkValue(dialog.offsetHeight);
***REMOVED*** </code>
***REMOVED*** @type {!Function}
***REMOVED***
goog.reflect.sinkValue = function(x) {
  goog.reflect.sinkValue[' '](x);
  return x;
***REMOVED***


***REMOVED***
***REMOVED*** The compiler should optimize this function away iff no one ever uses
***REMOVED*** goog.reflect.sinkValue.
***REMOVED***
goog.reflect.sinkValue[' '] = goog.nullFunction;


***REMOVED***
***REMOVED*** Check if a property can be accessed without throwing an exception.
***REMOVED*** @param {Object} obj The owner of the property.
***REMOVED*** @param {string} prop The property name.
***REMOVED*** @return {boolean} Whether the property is accessible. Will also return true
***REMOVED***     if obj is null.
***REMOVED***
goog.reflect.canAccessProperty = function(obj, prop) {
 ***REMOVED*****REMOVED*** @preserveTry***REMOVED***
  try {
    goog.reflect.sinkValue(obj[prop]);
    return true;
  } catch (e) {}
  return false;
***REMOVED***
