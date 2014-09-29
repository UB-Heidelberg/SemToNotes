// Copyright 2008 The Closure Library Authors. All Rights Reserved.
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
***REMOVED*** @fileoverview Utilities for creating functions. Loosely inspired by the
***REMOVED*** java classes: http://go/functions.java and http://go/predicate.java.
***REMOVED***
***REMOVED*** @author nicksantos@google.com (Nick Santos)
***REMOVED***


goog.provide('goog.functions');


***REMOVED***
***REMOVED*** Creates a function that always returns the same value.
***REMOVED*** @param {T} retValue The value to return.
***REMOVED*** @return {function():T} The new function.
***REMOVED*** @template T
***REMOVED***
goog.functions.constant = function(retValue) {
  return function() {
    return retValue;
 ***REMOVED*****REMOVED***
***REMOVED***


***REMOVED***
***REMOVED*** Always returns false.
***REMOVED*** @type {function(...): boolean}
***REMOVED***
goog.functions.FALSE = goog.functions.constant(false);


***REMOVED***
***REMOVED*** Always returns true.
***REMOVED*** @type {function(...): boolean}
***REMOVED***
goog.functions.TRUE = goog.functions.constant(true);


***REMOVED***
***REMOVED*** Always returns NULL.
***REMOVED*** @type {function(...): null}
***REMOVED***
goog.functions.NULL = goog.functions.constant(null);


***REMOVED***
***REMOVED*** A simple function that returns the first argument of whatever is passed
***REMOVED*** into it.
***REMOVED*** @param {T=} opt_returnValue The single value that will be returned.
***REMOVED*** @param {...*} var_args Optional trailing arguments. These are ignored.
***REMOVED*** @return {T} The first argument passed in, or undefined if nothing was passed.
***REMOVED*** @template T
***REMOVED***
goog.functions.identity = function(opt_returnValue, var_args) {
  return opt_returnValue;
***REMOVED***


***REMOVED***
***REMOVED*** Creates a function that always throws an error with the given message.
***REMOVED*** @param {string} message The error message.
***REMOVED*** @return {!Function} The error-throwing function.
***REMOVED***
goog.functions.error = function(message) {
  return function() {
    throw Error(message);
 ***REMOVED*****REMOVED***
***REMOVED***


***REMOVED***
***REMOVED*** Given a function, create a function that keeps opt_numArgs arguments and
***REMOVED*** silently discards all additional arguments.
***REMOVED*** @param {Function} f The original function.
***REMOVED*** @param {number=} opt_numArgs The number of arguments to keep. Defaults to 0.
***REMOVED*** @return {!Function} A version of f that only keeps the first opt_numArgs
***REMOVED***     arguments.
***REMOVED***
goog.functions.lock = function(f, opt_numArgs) {
  opt_numArgs = opt_numArgs || 0;
  return function() {
    return f.apply(this, Array.prototype.slice.call(arguments, 0, opt_numArgs));
 ***REMOVED*****REMOVED***
***REMOVED***


***REMOVED***
***REMOVED*** Given a function, create a new function that swallows its return value
***REMOVED*** and replaces it with a new one.
***REMOVED*** @param {Function} f A function.
***REMOVED*** @param {T} retValue A new return value.
***REMOVED*** @return {function(...[?]):T} A new function.
***REMOVED*** @template T
***REMOVED***
goog.functions.withReturnValue = function(f, retValue) {
  return goog.functions.sequence(f, goog.functions.constant(retValue));
***REMOVED***


***REMOVED***
***REMOVED*** Creates the composition of the functions passed in.
***REMOVED*** For example, (goog.functions.compose(f, g))(a) is equivalent to f(g(a)).
***REMOVED*** @param {function(...[?]):T} fn The final function.
***REMOVED*** @param {...Function} var_args A list of functions.
***REMOVED*** @return {function(...[?]):T} The composition of all inputs.
***REMOVED*** @template T
***REMOVED***
goog.functions.compose = function(fn, var_args) {
  var functions = arguments;
  var length = functions.length;
  return function() {
    var result;
    if (length) {
      result = functions[length - 1].apply(this, arguments);
    }

    for (var i = length - 2; i >= 0; i--) {
      result = functions[i].call(this, result);
    }
    return result;
 ***REMOVED*****REMOVED***
***REMOVED***


***REMOVED***
***REMOVED*** Creates a function that calls the functions passed in in sequence, and
***REMOVED*** returns the value of the last function. For example,
***REMOVED*** (goog.functions.sequence(f, g))(x) is equivalent to f(x),g(x).
***REMOVED*** @param {...Function} var_args A list of functions.
***REMOVED*** @return {!Function} A function that calls all inputs in sequence.
***REMOVED***
goog.functions.sequence = function(var_args) {
  var functions = arguments;
  var length = functions.length;
  return function() {
    var result;
    for (var i = 0; i < length; i++) {
      result = functions[i].apply(this, arguments);
    }
    return result;
 ***REMOVED*****REMOVED***
***REMOVED***


***REMOVED***
***REMOVED*** Creates a function that returns true if each of its components evaluates
***REMOVED*** to true. The components are evaluated in order, and the evaluation will be
***REMOVED*** short-circuited as soon as a function returns false.
***REMOVED*** For example, (goog.functions.and(f, g))(x) is equivalent to f(x) && g(x).
***REMOVED*** @param {...Function} var_args A list of functions.
***REMOVED*** @return {function(...[?]):boolean} A function that ANDs its component
***REMOVED***      functions.
***REMOVED***
goog.functions.and = function(var_args) {
  var functions = arguments;
  var length = functions.length;
  return function() {
    for (var i = 0; i < length; i++) {
      if (!functions[i].apply(this, arguments)) {
        return false;
      }
    }
    return true;
 ***REMOVED*****REMOVED***
***REMOVED***


***REMOVED***
***REMOVED*** Creates a function that returns true if any of its components evaluates
***REMOVED*** to true. The components are evaluated in order, and the evaluation will be
***REMOVED*** short-circuited as soon as a function returns true.
***REMOVED*** For example, (goog.functions.or(f, g))(x) is equivalent to f(x) || g(x).
***REMOVED*** @param {...Function} var_args A list of functions.
***REMOVED*** @return {function(...[?]):boolean} A function that ORs its component
***REMOVED***    functions.
***REMOVED***
goog.functions.or = function(var_args) {
  var functions = arguments;
  var length = functions.length;
  return function() {
    for (var i = 0; i < length; i++) {
      if (functions[i].apply(this, arguments)) {
        return true;
      }
    }
    return false;
 ***REMOVED*****REMOVED***
***REMOVED***


***REMOVED***
***REMOVED*** Creates a function that returns the Boolean opposite of a provided function.
***REMOVED*** For example, (goog.functions.not(f))(x) is equivalent to !f(x).
***REMOVED*** @param {!Function} f The original function.
***REMOVED*** @return {function(...[?]):boolean} A function that delegates to f and returns
***REMOVED*** opposite.
***REMOVED***
goog.functions.not = function(f) {
  return function() {
    return !f.apply(this, arguments);
 ***REMOVED*****REMOVED***
***REMOVED***


***REMOVED***
***REMOVED*** Generic factory function to construct an object given the constructor
***REMOVED*** and the arguments. Intended to be bound to create object factories.
***REMOVED***
***REMOVED*** Callers should cast the result to the appropriate type for proper type
***REMOVED*** checking by the compiler.
***REMOVED*** @param {!Function} constructor The constructor for the Object.
***REMOVED*** @param {...*} var_args The arguments to be passed to the constructor.
***REMOVED*** @return {!Object} A new instance of the class given in {@code constructor}.
***REMOVED***
goog.functions.create = function(constructor, var_args) {
 ***REMOVED*****REMOVED*** @constructor***REMOVED***
  var temp = function() {***REMOVED***
  temp.prototype = constructor.prototype;

  // obj will have constructor's prototype in its chain and
  // 'obj instanceof constructor' will be true.
  var obj = new temp();

  // obj is initialized by constructor.
  // arguments is only array-like so lacks shift(), but can be used with
  // the Array prototype function.
  constructor.apply(obj, Array.prototype.slice.call(arguments, 1));
  return obj;
***REMOVED***
