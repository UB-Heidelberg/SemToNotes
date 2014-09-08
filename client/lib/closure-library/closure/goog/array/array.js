// Copyright 2006 The Closure Library Authors. All Rights Reserved.
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
***REMOVED*** @fileoverview Utilities for manipulating arrays.
***REMOVED***
***REMOVED***


goog.provide('goog.array');
goog.provide('goog.array.ArrayLike');

goog.require('goog.asserts');


***REMOVED***
***REMOVED*** @define {boolean} NATIVE_ARRAY_PROTOTYPES indicates whether the code should
***REMOVED*** rely on Array.prototype functions, if available.
***REMOVED***
***REMOVED*** The Array.prototype functions can be defined by external libraries like
***REMOVED*** Prototype and setting this flag to false forces closure to use its own
***REMOVED*** goog.array implementation.
***REMOVED***
***REMOVED*** If your javascript can be loaded by a third party site and you are wary about
***REMOVED*** relying on the prototype functions, specify
***REMOVED*** "--define goog.NATIVE_ARRAY_PROTOTYPES=false" to the JSCompiler.
***REMOVED***
***REMOVED*** Setting goog.TRUSTED_SITE to false will automatically set
***REMOVED*** NATIVE_ARRAY_PROTOTYPES to false.
***REMOVED***
goog.define('goog.NATIVE_ARRAY_PROTOTYPES', goog.TRUSTED_SITE);


***REMOVED***
***REMOVED*** @define {boolean} If true, JSCompiler will use the native implementation of
***REMOVED*** array functions where appropriate (e.g., {@code Array#filter}) and remove the
***REMOVED*** unused pure JS implementation.
***REMOVED***
goog.define('goog.array.ASSUME_NATIVE_FUNCTIONS', false);


***REMOVED***
***REMOVED*** @typedef {Array|NodeList|Arguments|{length: number}}
***REMOVED***
goog.array.ArrayLike;


***REMOVED***
***REMOVED*** Returns the last element in an array without removing it.
***REMOVED*** Same as goog.array.last.
***REMOVED*** @param {Array.<T>|goog.array.ArrayLike} array The array.
***REMOVED*** @return {T} Last item in array.
***REMOVED*** @template T
***REMOVED***
goog.array.peek = function(array) {
  return array[array.length - 1];
***REMOVED***


***REMOVED***
***REMOVED*** Returns the last element in an array without removing it.
***REMOVED*** Same as goog.array.peek.
***REMOVED*** @param {Array.<T>|goog.array.ArrayLike} array The array.
***REMOVED*** @return {T} Last item in array.
***REMOVED*** @template T
***REMOVED***
goog.array.last = goog.array.peek;


***REMOVED***
***REMOVED*** Reference to the original {@code Array.prototype}.
***REMOVED*** @private
***REMOVED***
goog.array.ARRAY_PROTOTYPE_ = Array.prototype;


// NOTE(arv): Since most of the array functions are generic it allows you to
// pass an array-like object. Strings have a length and are considered array-
// like. However, the 'in' operator does not work on strings so we cannot just
// use the array path even if the browser supports indexing into strings. We
// therefore end up splitting the string.


***REMOVED***
***REMOVED*** Returns the index of the first element of an array with a specified value, or
***REMOVED*** -1 if the element is not present in the array.
***REMOVED***
***REMOVED*** See {@link http://tinyurl.com/developer-mozilla-org-array-indexof}
***REMOVED***
***REMOVED*** @param {Array.<T>|goog.array.ArrayLike} arr The array to be searched.
***REMOVED*** @param {T} obj The object for which we are searching.
***REMOVED*** @param {number=} opt_fromIndex The index at which to start the search. If
***REMOVED***     omitted the search starts at index 0.
***REMOVED*** @return {number} The index of the first matching array element.
***REMOVED*** @template T
***REMOVED***
goog.array.indexOf = goog.NATIVE_ARRAY_PROTOTYPES &&
                     (goog.array.ASSUME_NATIVE_FUNCTIONS ||
                      goog.array.ARRAY_PROTOTYPE_.indexOf) ?
    function(arr, obj, opt_fromIndex) {
      goog.asserts.assert(arr.length != null);

      return goog.array.ARRAY_PROTOTYPE_.indexOf.call(arr, obj, opt_fromIndex);
    } :
    function(arr, obj, opt_fromIndex) {
      var fromIndex = opt_fromIndex == null ?
          0 : (opt_fromIndex < 0 ?
               Math.max(0, arr.length + opt_fromIndex) : opt_fromIndex);

      if (goog.isString(arr)) {
        // Array.prototype.indexOf uses === so only strings should be found.
        if (!goog.isString(obj) || obj.length != 1) {
          return -1;
        }
        return arr.indexOf(obj, fromIndex);
      }

      for (var i = fromIndex; i < arr.length; i++) {
        if (i in arr && arr[i] === obj)
          return i;
      }
      return -1;
   ***REMOVED*****REMOVED***


***REMOVED***
***REMOVED*** Returns the index of the last element of an array with a specified value, or
***REMOVED*** -1 if the element is not present in the array.
***REMOVED***
***REMOVED*** See {@link http://tinyurl.com/developer-mozilla-org-array-lastindexof}
***REMOVED***
***REMOVED*** @param {!Array.<T>|!goog.array.ArrayLike} arr The array to be searched.
***REMOVED*** @param {T} obj The object for which we are searching.
***REMOVED*** @param {?number=} opt_fromIndex The index at which to start the search. If
***REMOVED***     omitted the search starts at the end of the array.
***REMOVED*** @return {number} The index of the last matching array element.
***REMOVED*** @template T
***REMOVED***
goog.array.lastIndexOf = goog.NATIVE_ARRAY_PROTOTYPES &&
                         (goog.array.ASSUME_NATIVE_FUNCTIONS ||
                          goog.array.ARRAY_PROTOTYPE_.lastIndexOf) ?
    function(arr, obj, opt_fromIndex) {
      goog.asserts.assert(arr.length != null);

      // Firefox treats undefined and null as 0 in the fromIndex argument which
      // leads it to always return -1
      var fromIndex = opt_fromIndex == null ? arr.length - 1 : opt_fromIndex;
      return goog.array.ARRAY_PROTOTYPE_.lastIndexOf.call(arr, obj, fromIndex);
    } :
    function(arr, obj, opt_fromIndex) {
      var fromIndex = opt_fromIndex == null ? arr.length - 1 : opt_fromIndex;

      if (fromIndex < 0) {
        fromIndex = Math.max(0, arr.length + fromIndex);
      }

      if (goog.isString(arr)) {
        // Array.prototype.lastIndexOf uses === so only strings should be found.
        if (!goog.isString(obj) || obj.length != 1) {
          return -1;
        }
        return arr.lastIndexOf(obj, fromIndex);
      }

      for (var i = fromIndex; i >= 0; i--) {
        if (i in arr && arr[i] === obj)
          return i;
      }
      return -1;
   ***REMOVED*****REMOVED***


***REMOVED***
***REMOVED*** Calls a function for each element in an array. Skips holes in the array.
***REMOVED*** See {@link http://tinyurl.com/developer-mozilla-org-array-foreach}
***REMOVED***
***REMOVED*** @param {Array.<T>|goog.array.ArrayLike} arr Array or array like object over
***REMOVED***     which to iterate.
***REMOVED*** @param {?function(this: S, T, number, ?): ?} f The function to call for every
***REMOVED***     element. This function takes 3 arguments (the element, the index and the
***REMOVED***     array). The return value is ignored.
***REMOVED*** @param {S=} opt_obj The object to be used as the value of 'this' within f.
***REMOVED*** @template T,S
***REMOVED***
goog.array.forEach = goog.NATIVE_ARRAY_PROTOTYPES &&
                     (goog.array.ASSUME_NATIVE_FUNCTIONS ||
                      goog.array.ARRAY_PROTOTYPE_.forEach) ?
    function(arr, f, opt_obj) {
      goog.asserts.assert(arr.length != null);

      goog.array.ARRAY_PROTOTYPE_.forEach.call(arr, f, opt_obj);
    } :
    function(arr, f, opt_obj) {
      var l = arr.length;  // must be fixed during loop... see docs
      var arr2 = goog.isString(arr) ? arr.split('') : arr;
      for (var i = 0; i < l; i++) {
        if (i in arr2) {
          f.call(opt_obj, arr2[i], i, arr);
        }
      }
   ***REMOVED*****REMOVED***


***REMOVED***
***REMOVED*** Calls a function for each element in an array, starting from the last
***REMOVED*** element rather than the first.
***REMOVED***
***REMOVED*** @param {Array.<T>|goog.array.ArrayLike} arr Array or array
***REMOVED***     like object over which to iterate.
***REMOVED*** @param {?function(this: S, T, number, ?): ?} f The function to call for every
***REMOVED***     element. This function
***REMOVED***     takes 3 arguments (the element, the index and the array). The return
***REMOVED***     value is ignored.
***REMOVED*** @param {S=} opt_obj The object to be used as the value of 'this'
***REMOVED***     within f.
***REMOVED*** @template T,S
***REMOVED***
goog.array.forEachRight = function(arr, f, opt_obj) {
  var l = arr.length;  // must be fixed during loop... see docs
  var arr2 = goog.isString(arr) ? arr.split('') : arr;
  for (var i = l - 1; i >= 0; --i) {
    if (i in arr2) {
      f.call(opt_obj, arr2[i], i, arr);
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** Calls a function for each element in an array, and if the function returns
***REMOVED*** true adds the element to a new array.
***REMOVED***
***REMOVED*** See {@link http://tinyurl.com/developer-mozilla-org-array-filter}
***REMOVED***
***REMOVED*** @param {Array.<T>|goog.array.ArrayLike} arr Array or array
***REMOVED***     like object over which to iterate.
***REMOVED*** @param {?function(this:S, T, number, ?):boolean} f The function to call for
***REMOVED***     every element. This function
***REMOVED***     takes 3 arguments (the element, the index and the array) and must
***REMOVED***     return a Boolean. If the return value is true the element is added to the
***REMOVED***     result array. If it is false the element is not included.
***REMOVED*** @param {S=} opt_obj The object to be used as the value of 'this'
***REMOVED***     within f.
***REMOVED*** @return {!Array.<T>} a new array in which only elements that passed the test
***REMOVED***     are present.
***REMOVED*** @template T,S
***REMOVED***
goog.array.filter = goog.NATIVE_ARRAY_PROTOTYPES &&
                    (goog.array.ASSUME_NATIVE_FUNCTIONS ||
                     goog.array.ARRAY_PROTOTYPE_.filter) ?
    function(arr, f, opt_obj) {
      goog.asserts.assert(arr.length != null);

      return goog.array.ARRAY_PROTOTYPE_.filter.call(arr, f, opt_obj);
    } :
    function(arr, f, opt_obj) {
      var l = arr.length;  // must be fixed during loop... see docs
      var res = [];
      var resLength = 0;
      var arr2 = goog.isString(arr) ? arr.split('') : arr;
      for (var i = 0; i < l; i++) {
        if (i in arr2) {
          var val = arr2[i];  // in case f mutates arr2
          if (f.call(opt_obj, val, i, arr)) {
            res[resLength++] = val;
          }
        }
      }
      return res;
   ***REMOVED*****REMOVED***


***REMOVED***
***REMOVED*** Calls a function for each element in an array and inserts the result into a
***REMOVED*** new array.
***REMOVED***
***REMOVED*** See {@link http://tinyurl.com/developer-mozilla-org-array-map}
***REMOVED***
***REMOVED*** @param {Array.<VALUE>|goog.array.ArrayLike} arr Array or array like object
***REMOVED***     over which to iterate.
***REMOVED*** @param {function(this:THIS, VALUE, number, ?): RESULT} f The function to call
***REMOVED***     for every element. This function takes 3 arguments (the element,
***REMOVED***     the index and the array) and should return something. The result will be
***REMOVED***     inserted into a new array.
***REMOVED*** @param {THIS=} opt_obj The object to be used as the value of 'this' within f.
***REMOVED*** @return {!Array.<RESULT>} a new array with the results from f.
***REMOVED*** @template THIS, VALUE, RESULT
***REMOVED***
goog.array.map = goog.NATIVE_ARRAY_PROTOTYPES &&
                 (goog.array.ASSUME_NATIVE_FUNCTIONS ||
                  goog.array.ARRAY_PROTOTYPE_.map) ?
    function(arr, f, opt_obj) {
      goog.asserts.assert(arr.length != null);

      return goog.array.ARRAY_PROTOTYPE_.map.call(arr, f, opt_obj);
    } :
    function(arr, f, opt_obj) {
      var l = arr.length;  // must be fixed during loop... see docs
      var res = new Array(l);
      var arr2 = goog.isString(arr) ? arr.split('') : arr;
      for (var i = 0; i < l; i++) {
        if (i in arr2) {
          res[i] = f.call(opt_obj, arr2[i], i, arr);
        }
      }
      return res;
   ***REMOVED*****REMOVED***


***REMOVED***
***REMOVED*** Passes every element of an array into a function and accumulates the result.
***REMOVED***
***REMOVED*** See {@link http://tinyurl.com/developer-mozilla-org-array-reduce}
***REMOVED***
***REMOVED*** For example:
***REMOVED*** var a = [1, 2, 3, 4];
***REMOVED*** goog.array.reduce(a, function(r, v, i, arr) {return r + v;}, 0);
***REMOVED*** returns 10
***REMOVED***
***REMOVED*** @param {Array.<T>|goog.array.ArrayLike} arr Array or array
***REMOVED***     like object over which to iterate.
***REMOVED*** @param {?function(this:S, R, T, number, ?) : R} f The function to call for
***REMOVED***     every element. This function
***REMOVED***     takes 4 arguments (the function's previous result or the initial value,
***REMOVED***     the value of the current array element, the current array index, and the
***REMOVED***     array itself)
***REMOVED***     function(previousValue, currentValue, index, array).
***REMOVED*** @param {?} val The initial value to pass into the function on the first call.
***REMOVED*** @param {S=} opt_obj  The object to be used as the value of 'this'
***REMOVED***     within f.
***REMOVED*** @return {R} Result of evaluating f repeatedly across the values of the array.
***REMOVED*** @template T,S,R
***REMOVED***
goog.array.reduce = goog.NATIVE_ARRAY_PROTOTYPES &&
                    (goog.array.ASSUME_NATIVE_FUNCTIONS ||
                     goog.array.ARRAY_PROTOTYPE_.reduce) ?
    function(arr, f, val, opt_obj) {
      goog.asserts.assert(arr.length != null);
      if (opt_obj) {
        f = goog.bind(f, opt_obj);
      }
      return goog.array.ARRAY_PROTOTYPE_.reduce.call(arr, f, val);
    } :
    function(arr, f, val, opt_obj) {
      var rval = val;
      goog.array.forEach(arr, function(val, index) {
        rval = f.call(opt_obj, rval, val, index, arr);
      });
      return rval;
   ***REMOVED*****REMOVED***


***REMOVED***
***REMOVED*** Passes every element of an array into a function and accumulates the result,
***REMOVED*** starting from the last element and working towards the first.
***REMOVED***
***REMOVED*** See {@link http://tinyurl.com/developer-mozilla-org-array-reduceright}
***REMOVED***
***REMOVED*** For example:
***REMOVED*** var a = ['a', 'b', 'c'];
***REMOVED*** goog.array.reduceRight(a, function(r, v, i, arr) {return r + v;}, '');
***REMOVED*** returns 'cba'
***REMOVED***
***REMOVED*** @param {Array.<T>|goog.array.ArrayLike} arr Array or array
***REMOVED***     like object over which to iterate.
***REMOVED*** @param {?function(this:S, R, T, number, ?) : R} f The function to call for
***REMOVED***     every element. This function
***REMOVED***     takes 4 arguments (the function's previous result or the initial value,
***REMOVED***     the value of the current array element, the current array index, and the
***REMOVED***     array itself)
***REMOVED***     function(previousValue, currentValue, index, array).
***REMOVED*** @param {?} val The initial value to pass into the function on the first call.
***REMOVED*** @param {S=} opt_obj The object to be used as the value of 'this'
***REMOVED***     within f.
***REMOVED*** @return {R} Object returned as a result of evaluating f repeatedly across the
***REMOVED***     values of the array.
***REMOVED*** @template T,S,R
***REMOVED***
goog.array.reduceRight = goog.NATIVE_ARRAY_PROTOTYPES &&
                         (goog.array.ASSUME_NATIVE_FUNCTIONS ||
                          goog.array.ARRAY_PROTOTYPE_.reduceRight) ?
    function(arr, f, val, opt_obj) {
      goog.asserts.assert(arr.length != null);
      if (opt_obj) {
        f = goog.bind(f, opt_obj);
      }
      return goog.array.ARRAY_PROTOTYPE_.reduceRight.call(arr, f, val);
    } :
    function(arr, f, val, opt_obj) {
      var rval = val;
      goog.array.forEachRight(arr, function(val, index) {
        rval = f.call(opt_obj, rval, val, index, arr);
      });
      return rval;
   ***REMOVED*****REMOVED***


***REMOVED***
***REMOVED*** Calls f for each element of an array. If any call returns true, some()
***REMOVED*** returns true (without checking the remaining elements). If all calls
***REMOVED*** return false, some() returns false.
***REMOVED***
***REMOVED*** See {@link http://tinyurl.com/developer-mozilla-org-array-some}
***REMOVED***
***REMOVED*** @param {Array.<T>|goog.array.ArrayLike} arr Array or array
***REMOVED***     like object over which to iterate.
***REMOVED*** @param {?function(this:S, T, number, ?) : boolean} f The function to call for
***REMOVED***     for every element. This function takes 3 arguments (the element, the
***REMOVED***     index and the array) and should return a boolean.
***REMOVED*** @param {S=} opt_obj  The object to be used as the value of 'this'
***REMOVED***     within f.
***REMOVED*** @return {boolean} true if any element passes the test.
***REMOVED*** @template T,S
***REMOVED***
goog.array.some = goog.NATIVE_ARRAY_PROTOTYPES &&
                  (goog.array.ASSUME_NATIVE_FUNCTIONS ||
                   goog.array.ARRAY_PROTOTYPE_.some) ?
    function(arr, f, opt_obj) {
      goog.asserts.assert(arr.length != null);

      return goog.array.ARRAY_PROTOTYPE_.some.call(arr, f, opt_obj);
    } :
    function(arr, f, opt_obj) {
      var l = arr.length;  // must be fixed during loop... see docs
      var arr2 = goog.isString(arr) ? arr.split('') : arr;
      for (var i = 0; i < l; i++) {
        if (i in arr2 && f.call(opt_obj, arr2[i], i, arr)) {
          return true;
        }
      }
      return false;
   ***REMOVED*****REMOVED***


***REMOVED***
***REMOVED*** Call f for each element of an array. If all calls return true, every()
***REMOVED*** returns true. If any call returns false, every() returns false and
***REMOVED*** does not continue to check the remaining elements.
***REMOVED***
***REMOVED*** See {@link http://tinyurl.com/developer-mozilla-org-array-every}
***REMOVED***
***REMOVED*** @param {Array.<T>|goog.array.ArrayLike} arr Array or array
***REMOVED***     like object over which to iterate.
***REMOVED*** @param {?function(this:S, T, number, ?) : boolean} f The function to call for
***REMOVED***     for every element. This function takes 3 arguments (the element, the
***REMOVED***     index and the array) and should return a boolean.
***REMOVED*** @param {S=} opt_obj The object to be used as the value of 'this'
***REMOVED***     within f.
***REMOVED*** @return {boolean} false if any element fails the test.
***REMOVED*** @template T,S
***REMOVED***
goog.array.every = goog.NATIVE_ARRAY_PROTOTYPES &&
                   (goog.array.ASSUME_NATIVE_FUNCTIONS ||
                    goog.array.ARRAY_PROTOTYPE_.every) ?
    function(arr, f, opt_obj) {
      goog.asserts.assert(arr.length != null);

      return goog.array.ARRAY_PROTOTYPE_.every.call(arr, f, opt_obj);
    } :
    function(arr, f, opt_obj) {
      var l = arr.length;  // must be fixed during loop... see docs
      var arr2 = goog.isString(arr) ? arr.split('') : arr;
      for (var i = 0; i < l; i++) {
        if (i in arr2 && !f.call(opt_obj, arr2[i], i, arr)) {
          return false;
        }
      }
      return true;
   ***REMOVED*****REMOVED***


***REMOVED***
***REMOVED*** Counts the array elements that fulfill the predicate, i.e. for which the
***REMOVED*** callback function returns true. Skips holes in the array.
***REMOVED***
***REMOVED*** @param {!(Array.<T>|goog.array.ArrayLike)} arr Array or array like object
***REMOVED***     over which to iterate.
***REMOVED*** @param {function(this: S, T, number, ?): boolean} f The function to call for
***REMOVED***     every element. Takes 3 arguments (the element, the index and the array).
***REMOVED*** @param {S=} opt_obj The object to be used as the value of 'this' within f.
***REMOVED*** @return {number} The number of the matching elements.
***REMOVED*** @template T,S
***REMOVED***
goog.array.count = function(arr, f, opt_obj) {
  var count = 0;
  goog.array.forEach(arr, function(element, index, arr) {
    if (f.call(opt_obj, element, index, arr)) {
      ++count;
    }
  }, opt_obj);
  return count;
***REMOVED***


***REMOVED***
***REMOVED*** Search an array for the first element that satisfies a given condition and
***REMOVED*** return that element.
***REMOVED*** @param {Array.<T>|goog.array.ArrayLike} arr Array or array
***REMOVED***     like object over which to iterate.
***REMOVED*** @param {?function(this:S, T, number, ?) : boolean} f The function to call
***REMOVED***     for every element. This function takes 3 arguments (the element, the
***REMOVED***     index and the array) and should return a boolean.
***REMOVED*** @param {S=} opt_obj An optional "this" context for the function.
***REMOVED*** @return {?T} The first array element that passes the test, or null if no
***REMOVED***     element is found.
***REMOVED*** @template T,S
***REMOVED***
goog.array.find = function(arr, f, opt_obj) {
  var i = goog.array.findIndex(arr, f, opt_obj);
  return i < 0 ? null : goog.isString(arr) ? arr.charAt(i) : arr[i];
***REMOVED***


***REMOVED***
***REMOVED*** Search an array for the first element that satisfies a given condition and
***REMOVED*** return its index.
***REMOVED*** @param {Array.<T>|goog.array.ArrayLike} arr Array or array
***REMOVED***     like object over which to iterate.
***REMOVED*** @param {?function(this:S, T, number, ?) : boolean} f The function to call for
***REMOVED***     every element. This function
***REMOVED***     takes 3 arguments (the element, the index and the array) and should
***REMOVED***     return a boolean.
***REMOVED*** @param {S=} opt_obj An optional "this" context for the function.
***REMOVED*** @return {number} The index of the first array element that passes the test,
***REMOVED***     or -1 if no element is found.
***REMOVED*** @template T,S
***REMOVED***
goog.array.findIndex = function(arr, f, opt_obj) {
  var l = arr.length;  // must be fixed during loop... see docs
  var arr2 = goog.isString(arr) ? arr.split('') : arr;
  for (var i = 0; i < l; i++) {
    if (i in arr2 && f.call(opt_obj, arr2[i], i, arr)) {
      return i;
    }
  }
  return -1;
***REMOVED***


***REMOVED***
***REMOVED*** Search an array (in reverse order) for the last element that satisfies a
***REMOVED*** given condition and return that element.
***REMOVED*** @param {Array.<T>|goog.array.ArrayLike} arr Array or array
***REMOVED***     like object over which to iterate.
***REMOVED*** @param {?function(this:S, T, number, ?) : boolean} f The function to call
***REMOVED***     for every element. This function
***REMOVED***     takes 3 arguments (the element, the index and the array) and should
***REMOVED***     return a boolean.
***REMOVED*** @param {S=} opt_obj An optional "this" context for the function.
***REMOVED*** @return {?T} The last array element that passes the test, or null if no
***REMOVED***     element is found.
***REMOVED*** @template T,S
***REMOVED***
goog.array.findRight = function(arr, f, opt_obj) {
  var i = goog.array.findIndexRight(arr, f, opt_obj);
  return i < 0 ? null : goog.isString(arr) ? arr.charAt(i) : arr[i];
***REMOVED***


***REMOVED***
***REMOVED*** Search an array (in reverse order) for the last element that satisfies a
***REMOVED*** given condition and return its index.
***REMOVED*** @param {Array.<T>|goog.array.ArrayLike} arr Array or array
***REMOVED***     like object over which to iterate.
***REMOVED*** @param {?function(this:S, T, number, ?) : boolean} f The function to call
***REMOVED***     for every element. This function
***REMOVED***     takes 3 arguments (the element, the index and the array) and should
***REMOVED***     return a boolean.
***REMOVED*** @param {Object=} opt_obj An optional "this" context for the function.
***REMOVED*** @return {number} The index of the last array element that passes the test,
***REMOVED***     or -1 if no element is found.
***REMOVED*** @template T,S
***REMOVED***
goog.array.findIndexRight = function(arr, f, opt_obj) {
  var l = arr.length;  // must be fixed during loop... see docs
  var arr2 = goog.isString(arr) ? arr.split('') : arr;
  for (var i = l - 1; i >= 0; i--) {
    if (i in arr2 && f.call(opt_obj, arr2[i], i, arr)) {
      return i;
    }
  }
  return -1;
***REMOVED***


***REMOVED***
***REMOVED*** Whether the array contains the given object.
***REMOVED*** @param {goog.array.ArrayLike} arr The array to test for the presence of the
***REMOVED***     element.
***REMOVED*** @param {*} obj The object for which to test.
***REMOVED*** @return {boolean} true if obj is present.
***REMOVED***
goog.array.contains = function(arr, obj) {
  return goog.array.indexOf(arr, obj) >= 0;
***REMOVED***


***REMOVED***
***REMOVED*** Whether the array is empty.
***REMOVED*** @param {goog.array.ArrayLike} arr The array to test.
***REMOVED*** @return {boolean} true if empty.
***REMOVED***
goog.array.isEmpty = function(arr) {
  return arr.length == 0;
***REMOVED***


***REMOVED***
***REMOVED*** Clears the array.
***REMOVED*** @param {goog.array.ArrayLike} arr Array or array like object to clear.
***REMOVED***
goog.array.clear = function(arr) {
  // For non real arrays we don't have the magic length so we delete the
  // indices.
  if (!goog.isArray(arr)) {
    for (var i = arr.length - 1; i >= 0; i--) {
      delete arr[i];
    }
  }
  arr.length = 0;
***REMOVED***


***REMOVED***
***REMOVED*** Pushes an item into an array, if it's not already in the array.
***REMOVED*** @param {Array.<T>} arr Array into which to insert the item.
***REMOVED*** @param {T} obj Value to add.
***REMOVED*** @template T
***REMOVED***
goog.array.insert = function(arr, obj) {
  if (!goog.array.contains(arr, obj)) {
    arr.push(obj);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Inserts an object at the given index of the array.
***REMOVED*** @param {goog.array.ArrayLike} arr The array to modify.
***REMOVED*** @param {*} obj The object to insert.
***REMOVED*** @param {number=} opt_i The index at which to insert the object. If omitted,
***REMOVED***      treated as 0. A negative index is counted from the end of the array.
***REMOVED***
goog.array.insertAt = function(arr, obj, opt_i) {
  goog.array.splice(arr, opt_i, 0, obj);
***REMOVED***


***REMOVED***
***REMOVED*** Inserts at the given index of the array, all elements of another array.
***REMOVED*** @param {goog.array.ArrayLike} arr The array to modify.
***REMOVED*** @param {goog.array.ArrayLike} elementsToAdd The array of elements to add.
***REMOVED*** @param {number=} opt_i The index at which to insert the object. If omitted,
***REMOVED***      treated as 0. A negative index is counted from the end of the array.
***REMOVED***
goog.array.insertArrayAt = function(arr, elementsToAdd, opt_i) {
  goog.partial(goog.array.splice, arr, opt_i, 0).apply(null, elementsToAdd);
***REMOVED***


***REMOVED***
***REMOVED*** Inserts an object into an array before a specified object.
***REMOVED*** @param {Array.<T>} arr The array to modify.
***REMOVED*** @param {T} obj The object to insert.
***REMOVED*** @param {T=} opt_obj2 The object before which obj should be inserted. If obj2
***REMOVED***     is omitted or not found, obj is inserted at the end of the array.
***REMOVED*** @template T
***REMOVED***
goog.array.insertBefore = function(arr, obj, opt_obj2) {
  var i;
  if (arguments.length == 2 || (i = goog.array.indexOf(arr, opt_obj2)) < 0) {
    arr.push(obj);
  } else {
    goog.array.insertAt(arr, obj, i);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Removes the first occurrence of a particular value from an array.
***REMOVED*** @param {Array.<T>|goog.array.ArrayLike} arr Array from which to remove
***REMOVED***     value.
***REMOVED*** @param {T} obj Object to remove.
***REMOVED*** @return {boolean} True if an element was removed.
***REMOVED*** @template T
***REMOVED***
goog.array.remove = function(arr, obj) {
  var i = goog.array.indexOf(arr, obj);
  var rv;
  if ((rv = i >= 0)) {
    goog.array.removeAt(arr, i);
  }
  return rv;
***REMOVED***


***REMOVED***
***REMOVED*** Removes from an array the element at index i
***REMOVED*** @param {goog.array.ArrayLike} arr Array or array like object from which to
***REMOVED***     remove value.
***REMOVED*** @param {number} i The index to remove.
***REMOVED*** @return {boolean} True if an element was removed.
***REMOVED***
goog.array.removeAt = function(arr, i) {
  goog.asserts.assert(arr.length != null);

  // use generic form of splice
  // splice returns the removed items and if successful the length of that
  // will be 1
  return goog.array.ARRAY_PROTOTYPE_.splice.call(arr, i, 1).length == 1;
***REMOVED***


***REMOVED***
***REMOVED*** Removes the first value that satisfies the given condition.
***REMOVED*** @param {Array.<T>|goog.array.ArrayLike} arr Array or array
***REMOVED***     like object over which to iterate.
***REMOVED*** @param {?function(this:S, T, number, ?) : boolean} f The function to call
***REMOVED***     for every element. This function
***REMOVED***     takes 3 arguments (the element, the index and the array) and should
***REMOVED***     return a boolean.
***REMOVED*** @param {S=} opt_obj An optional "this" context for the function.
***REMOVED*** @return {boolean} True if an element was removed.
***REMOVED*** @template T,S
***REMOVED***
goog.array.removeIf = function(arr, f, opt_obj) {
  var i = goog.array.findIndex(arr, f, opt_obj);
  if (i >= 0) {
    goog.array.removeAt(arr, i);
    return true;
  }
  return false;
***REMOVED***


***REMOVED***
***REMOVED*** Returns a new array that is the result of joining the arguments.  If arrays
***REMOVED*** are passed then their items are added, however, if non-arrays are passed they
***REMOVED*** will be added to the return array as is.
***REMOVED***
***REMOVED*** Note that ArrayLike objects will be added as is, rather than having their
***REMOVED*** items added.
***REMOVED***
***REMOVED*** goog.array.concat([1, 2], [3, 4]) -> [1, 2, 3, 4]
***REMOVED*** goog.array.concat(0, [1, 2]) -> [0, 1, 2]
***REMOVED*** goog.array.concat([1, 2], null) -> [1, 2, null]
***REMOVED***
***REMOVED*** There is bug in all current versions of IE (6, 7 and 8) where arrays created
***REMOVED*** in an iframe become corrupted soon (not immediately) after the iframe is
***REMOVED*** destroyed. This is common if loading data via goog.net.IframeIo, for example.
***REMOVED*** This corruption only affects the concat method which will start throwing
***REMOVED*** Catastrophic Errors (#-2147418113).
***REMOVED***
***REMOVED*** See http://endoflow.com/scratch/corrupted-arrays.html for a test case.
***REMOVED***
***REMOVED*** Internally goog.array should use this, so that all methods will continue to
***REMOVED*** work on these broken array objects.
***REMOVED***
***REMOVED*** @param {...*} var_args Items to concatenate.  Arrays will have each item
***REMOVED***     added, while primitives and objects will be added as is.
***REMOVED*** @return {!Array} The new resultant array.
***REMOVED***
goog.array.concat = function(var_args) {
  return goog.array.ARRAY_PROTOTYPE_.concat.apply(
      goog.array.ARRAY_PROTOTYPE_, arguments);
***REMOVED***


***REMOVED***
***REMOVED*** Returns a new array that contains the contents of all the arrays passed.
***REMOVED*** @param {...!Array.<T>} var_args
***REMOVED*** @return {!Array.<T>}
***REMOVED*** @template T
***REMOVED***
goog.array.join = function(var_args) {
  return goog.array.ARRAY_PROTOTYPE_.concat.apply(
      goog.array.ARRAY_PROTOTYPE_, arguments);
***REMOVED***


***REMOVED***
***REMOVED*** Converts an object to an array.
***REMOVED*** @param {Array.<T>|goog.array.ArrayLike} object  The object to convert to an
***REMOVED***     array.
***REMOVED*** @return {!Array.<T>} The object converted into an array. If object has a
***REMOVED***     length property, every property indexed with a non-negative number
***REMOVED***     less than length will be included in the result. If object does not
***REMOVED***     have a length property, an empty array will be returned.
***REMOVED*** @template T
***REMOVED***
goog.array.toArray = function(object) {
  var length = object.length;

  // If length is not a number the following it false. This case is kept for
  // backwards compatibility since there are callers that pass objects that are
  // not array like.
  if (length > 0) {
    var rv = new Array(length);
    for (var i = 0; i < length; i++) {
      rv[i] = object[i];
    }
    return rv;
  }
  return [];
***REMOVED***


***REMOVED***
***REMOVED*** Does a shallow copy of an array.
***REMOVED*** @param {Array.<T>|goog.array.ArrayLike} arr  Array or array-like object to
***REMOVED***     clone.
***REMOVED*** @return {!Array.<T>} Clone of the input array.
***REMOVED*** @template T
***REMOVED***
goog.array.clone = goog.array.toArray;


***REMOVED***
***REMOVED*** Extends an array with another array, element, or "array like" object.
***REMOVED*** This function operates 'in-place', it does not create a new Array.
***REMOVED***
***REMOVED*** Example:
***REMOVED*** var a = [];
***REMOVED*** goog.array.extend(a, [0, 1]);
***REMOVED*** a; // [0, 1]
***REMOVED*** goog.array.extend(a, 2);
***REMOVED*** a; // [0, 1, 2]
***REMOVED***
***REMOVED*** @param {Array.<VALUE>} arr1  The array to modify.
***REMOVED*** @param {...(Array.<VALUE>|VALUE)} var_args The elements or arrays of elements
***REMOVED***     to add to arr1.
***REMOVED*** @template VALUE
***REMOVED***
goog.array.extend = function(arr1, var_args) {
  for (var i = 1; i < arguments.length; i++) {
    var arr2 = arguments[i];
    // If we have an Array or an Arguments object we can just call push
    // directly.
    var isArrayLike;
    if (goog.isArray(arr2) ||
        // Detect Arguments. ES5 says that the [[Class]] of an Arguments object
        // is "Arguments" but only V8 and JSC/Safari gets this right. We instead
        // detect Arguments by checking for array like and presence of "callee".
        (isArrayLike = goog.isArrayLike(arr2)) &&
            // The getter for callee throws an exception in strict mode
            // according to section 10.6 in ES5 so check for presence instead.
            Object.prototype.hasOwnProperty.call(arr2, 'callee')) {
      arr1.push.apply(arr1, arr2);
    } else if (isArrayLike) {
      // Otherwise loop over arr2 to prevent copying the object.
      var len1 = arr1.length;
      var len2 = arr2.length;
      for (var j = 0; j < len2; j++) {
        arr1[len1 + j] = arr2[j];
      }
    } else {
      arr1.push(arr2);
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** Adds or removes elements from an array. This is a generic version of Array
***REMOVED*** splice. This means that it might work on other objects similar to arrays,
***REMOVED*** such as the arguments object.
***REMOVED***
***REMOVED*** @param {Array.<T>|goog.array.ArrayLike} arr The array to modify.
***REMOVED*** @param {number|undefined} index The index at which to start changing the
***REMOVED***     array. If not defined, treated as 0.
***REMOVED*** @param {number} howMany How many elements to remove (0 means no removal. A
***REMOVED***     value below 0 is treated as zero and so is any other non number. Numbers
***REMOVED***     are floored).
***REMOVED*** @param {...T} var_args Optional, additional elements to insert into the
***REMOVED***     array.
***REMOVED*** @return {!Array.<T>} the removed elements.
***REMOVED*** @template T
***REMOVED***
goog.array.splice = function(arr, index, howMany, var_args) {
  goog.asserts.assert(arr.length != null);

  return goog.array.ARRAY_PROTOTYPE_.splice.apply(
      arr, goog.array.slice(arguments, 1));
***REMOVED***


***REMOVED***
***REMOVED*** Returns a new array from a segment of an array. This is a generic version of
***REMOVED*** Array slice. This means that it might work on other objects similar to
***REMOVED*** arrays, such as the arguments object.
***REMOVED***
***REMOVED*** @param {Array.<T>|goog.array.ArrayLike} arr The array from
***REMOVED*** which to copy a segment.
***REMOVED*** @param {number} start The index of the first element to copy.
***REMOVED*** @param {number=} opt_end The index after the last element to copy.
***REMOVED*** @return {!Array.<T>} A new array containing the specified segment of the
***REMOVED***     original array.
***REMOVED*** @template T
***REMOVED***
goog.array.slice = function(arr, start, opt_end) {
  goog.asserts.assert(arr.length != null);

  // passing 1 arg to slice is not the same as passing 2 where the second is
  // null or undefined (in that case the second argument is treated as 0).
  // we could use slice on the arguments object and then use apply instead of
  // testing the length
  if (arguments.length <= 2) {
    return goog.array.ARRAY_PROTOTYPE_.slice.call(arr, start);
  } else {
    return goog.array.ARRAY_PROTOTYPE_.slice.call(arr, start, opt_end);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Removes all duplicates from an array (retaining only the first
***REMOVED*** occurrence of each array element).  This function modifies the
***REMOVED*** array in place and doesn't change the order of the non-duplicate items.
***REMOVED***
***REMOVED*** For objects, duplicates are identified as having the same unique ID as
***REMOVED*** defined by {@link goog.getUid}.
***REMOVED***
***REMOVED*** Alternatively you can specify a custom hash function that returns a unique
***REMOVED*** value for each item in the array it should consider unique.
***REMOVED***
***REMOVED*** Runtime: N,
***REMOVED*** Worstcase space: 2N (no dupes)
***REMOVED***
***REMOVED*** @param {Array.<T>|goog.array.ArrayLike} arr The array from which to remove
***REMOVED***     duplicates.
***REMOVED*** @param {Array=} opt_rv An optional array in which to return the results,
***REMOVED***     instead of performing the removal inplace.  If specified, the original
***REMOVED***     array will remain unchanged.
***REMOVED*** @param {function(T):string=} opt_hashFn An optional function to use to
***REMOVED***     apply to every item in the array. This function should return a unique
***REMOVED***     value for each item in the array it should consider unique.
***REMOVED*** @template T
***REMOVED***
goog.array.removeDuplicates = function(arr, opt_rv, opt_hashFn) {
  var returnArray = opt_rv || arr;
  var defaultHashFn = function(item) {
    // Prefix each type with a single character representing the type to
    // prevent conflicting keys (e.g. true and 'true').
    return goog.isObject(current) ? 'o' + goog.getUid(current) :
        (typeof current).charAt(0) + current;
 ***REMOVED*****REMOVED***
  var hashFn = opt_hashFn || defaultHashFn;

  var seen = {}, cursorInsert = 0, cursorRead = 0;
  while (cursorRead < arr.length) {
    var current = arr[cursorRead++];
    var key = hashFn(current);
    if (!Object.prototype.hasOwnProperty.call(seen, key)) {
      seen[key] = true;
      returnArray[cursorInsert++] = current;
    }
  }
  returnArray.length = cursorInsert;
***REMOVED***


***REMOVED***
***REMOVED*** Searches the specified array for the specified target using the binary
***REMOVED*** search algorithm.  If no opt_compareFn is specified, elements are compared
***REMOVED*** using <code>goog.array.defaultCompare</code>, which compares the elements
***REMOVED*** using the built in < and > operators.  This will produce the expected
***REMOVED*** behavior for homogeneous arrays of String(s) and Number(s). The array
***REMOVED*** specified <b>must</b> be sorted in ascending order (as defined by the
***REMOVED*** comparison function).  If the array is not sorted, results are undefined.
***REMOVED*** If the array contains multiple instances of the specified target value, any
***REMOVED*** of these instances may be found.
***REMOVED***
***REMOVED*** Runtime: O(log n)
***REMOVED***
***REMOVED*** @param {Array.<VALUE>|goog.array.ArrayLike} arr The array to be searched.
***REMOVED*** @param {TARGET} target The sought value.
***REMOVED*** @param {function(TARGET, VALUE): number=} opt_compareFn Optional comparison
***REMOVED***     function by which the array is ordered. Should take 2 arguments to
***REMOVED***     compare, and return a negative number, zero, or a positive number
***REMOVED***     depending on whether the first argument is less than, equal to, or
***REMOVED***     greater than the second.
***REMOVED*** @return {number} Lowest index of the target value if found, otherwise
***REMOVED***     (-(insertion point) - 1). The insertion point is where the value should
***REMOVED***     be inserted into arr to preserve the sorted property.  Return value >= 0
***REMOVED***     iff target is found.
***REMOVED*** @template TARGET, VALUE
***REMOVED***
goog.array.binarySearch = function(arr, target, opt_compareFn) {
  return goog.array.binarySearch_(arr,
      opt_compareFn || goog.array.defaultCompare, false /* isEvaluator***REMOVED***,
      target);
***REMOVED***


***REMOVED***
***REMOVED*** Selects an index in the specified array using the binary search algorithm.
***REMOVED*** The evaluator receives an element and determines whether the desired index
***REMOVED*** is before, at, or after it.  The evaluator must be consistent (formally,
***REMOVED*** goog.array.map(goog.array.map(arr, evaluator, opt_obj), goog.math.sign)
***REMOVED*** must be monotonically non-increasing).
***REMOVED***
***REMOVED*** Runtime: O(log n)
***REMOVED***
***REMOVED*** @param {Array.<VALUE>|goog.array.ArrayLike} arr The array to be searched.
***REMOVED*** @param {function(this:THIS, VALUE, number, ?): number} evaluator
***REMOVED***     Evaluator function that receives 3 arguments (the element, the index and
***REMOVED***     the array). Should return a negative number, zero, or a positive number
***REMOVED***     depending on whether the desired index is before, at, or after the
***REMOVED***     element passed to it.
***REMOVED*** @param {THIS=} opt_obj The object to be used as the value of 'this'
***REMOVED***     within evaluator.
***REMOVED*** @return {number} Index of the leftmost element matched by the evaluator, if
***REMOVED***     such exists; otherwise (-(insertion point) - 1). The insertion point is
***REMOVED***     the index of the first element for which the evaluator returns negative,
***REMOVED***     or arr.length if no such element exists. The return value is non-negative
***REMOVED***     iff a match is found.
***REMOVED*** @template THIS, VALUE
***REMOVED***
goog.array.binarySelect = function(arr, evaluator, opt_obj) {
  return goog.array.binarySearch_(arr, evaluator, true /* isEvaluator***REMOVED***,
      undefined /* opt_target***REMOVED***, opt_obj);
***REMOVED***


***REMOVED***
***REMOVED*** Implementation of a binary search algorithm which knows how to use both
***REMOVED*** comparison functions and evaluators. If an evaluator is provided, will call
***REMOVED*** the evaluator with the given optional data object, conforming to the
***REMOVED*** interface defined in binarySelect. Otherwise, if a comparison function is
***REMOVED*** provided, will call the comparison function against the given data object.
***REMOVED***
***REMOVED*** This implementation purposefully does not use goog.bind or goog.partial for
***REMOVED*** performance reasons.
***REMOVED***
***REMOVED*** Runtime: O(log n)
***REMOVED***
***REMOVED*** @param {Array.<VALUE>|goog.array.ArrayLike} arr The array to be searched.
***REMOVED*** @param {function(TARGET, VALUE): number|
***REMOVED***         function(this:THIS, VALUE, number, ?): number} compareFn Either an
***REMOVED***     evaluator or a comparison function, as defined by binarySearch
***REMOVED***     and binarySelect above.
***REMOVED*** @param {boolean} isEvaluator Whether the function is an evaluator or a
***REMOVED***     comparison function.
***REMOVED*** @param {TARGET=} opt_target If the function is a comparison function, then
***REMOVED***     this is the target to binary search for.
***REMOVED*** @param {THIS=} opt_selfObj If the function is an evaluator, this is an
 ***REMOVED***    optional this object for the evaluator.
***REMOVED*** @return {number} Lowest index of the target value if found, otherwise
***REMOVED***     (-(insertion point) - 1). The insertion point is where the value should
***REMOVED***     be inserted into arr to preserve the sorted property.  Return value >= 0
***REMOVED***     iff target is found.
***REMOVED*** @template THIS, VALUE, TARGET
***REMOVED*** @private
***REMOVED***
goog.array.binarySearch_ = function(arr, compareFn, isEvaluator, opt_target,
    opt_selfObj) {
  var left = 0;  // inclusive
  var right = arr.length;  // exclusive
  var found;
  while (left < right) {
    var middle = (left + right) >> 1;
    var compareResult;
    if (isEvaluator) {
      compareResult = compareFn.call(opt_selfObj, arr[middle], middle, arr);
    } else {
      compareResult = compareFn(opt_target, arr[middle]);
    }
    if (compareResult > 0) {
      left = middle + 1;
    } else {
      right = middle;
      // We are looking for the lowest index so we can't return immediately.
      found = !compareResult;
    }
  }
  // left is the index if found, or the insertion point otherwise.
  // ~left is a shorthand for -left - 1.
  return found ? left : ~left;
***REMOVED***


***REMOVED***
***REMOVED*** Sorts the specified array into ascending order.  If no opt_compareFn is
***REMOVED*** specified, elements are compared using
***REMOVED*** <code>goog.array.defaultCompare</code>, which compares the elements using
***REMOVED*** the built in < and > operators.  This will produce the expected behavior
***REMOVED*** for homogeneous arrays of String(s) and Number(s), unlike the native sort,
***REMOVED*** but will give unpredictable results for heterogenous lists of strings and
***REMOVED*** numbers with different numbers of digits.
***REMOVED***
***REMOVED*** This sort is not guaranteed to be stable.
***REMOVED***
***REMOVED*** Runtime: Same as <code>Array.prototype.sort</code>
***REMOVED***
***REMOVED*** @param {Array.<T>} arr The array to be sorted.
***REMOVED*** @param {?function(T,T):number=} opt_compareFn Optional comparison
***REMOVED***     function by which the
***REMOVED***     array is to be ordered. Should take 2 arguments to compare, and return a
***REMOVED***     negative number, zero, or a positive number depending on whether the
***REMOVED***     first argument is less than, equal to, or greater than the second.
***REMOVED*** @template T
***REMOVED***
goog.array.sort = function(arr, opt_compareFn) {
  // TODO(arv): Update type annotation since null is not accepted.
  arr.sort(opt_compareFn || goog.array.defaultCompare);
***REMOVED***


***REMOVED***
***REMOVED*** Sorts the specified array into ascending order in a stable way.  If no
***REMOVED*** opt_compareFn is specified, elements are compared using
***REMOVED*** <code>goog.array.defaultCompare</code>, which compares the elements using
***REMOVED*** the built in < and > operators.  This will produce the expected behavior
***REMOVED*** for homogeneous arrays of String(s) and Number(s).
***REMOVED***
***REMOVED*** Runtime: Same as <code>Array.prototype.sort</code>, plus an additional
***REMOVED*** O(n) overhead of copying the array twice.
***REMOVED***
***REMOVED*** @param {Array.<T>} arr The array to be sorted.
***REMOVED*** @param {?function(T, T): number=} opt_compareFn Optional comparison function
***REMOVED***     by which the array is to be ordered. Should take 2 arguments to compare,
***REMOVED***     and return a negative number, zero, or a positive number depending on
***REMOVED***     whether the first argument is less than, equal to, or greater than the
***REMOVED***     second.
***REMOVED*** @template T
***REMOVED***
goog.array.stableSort = function(arr, opt_compareFn) {
  for (var i = 0; i < arr.length; i++) {
    arr[i] = {index: i, value: arr[i]***REMOVED***
  }
  var valueCompareFn = opt_compareFn || goog.array.defaultCompare;
  function stableCompareFn(obj1, obj2) {
    return valueCompareFn(obj1.value, obj2.value) || obj1.index - obj2.index;
 ***REMOVED*****REMOVED***
  goog.array.sort(arr, stableCompareFn);
  for (var i = 0; i < arr.length; i++) {
    arr[i] = arr[i].value;
  }
***REMOVED***


***REMOVED***
***REMOVED*** Sorts an array of objects by the specified object key and compare
***REMOVED*** function. If no compare function is provided, the key values are
***REMOVED*** compared in ascending order using <code>goog.array.defaultCompare</code>.
***REMOVED*** This won't work for keys that get renamed by the compiler. So use
***REMOVED*** {'foo': 1, 'bar': 2} rather than {foo: 1, bar: 2}.
***REMOVED*** @param {Array.<Object>} arr An array of objects to sort.
***REMOVED*** @param {string} key The object key to sort by.
***REMOVED*** @param {Function=} opt_compareFn The function to use to compare key
***REMOVED***     values.
***REMOVED***
goog.array.sortObjectsByKey = function(arr, key, opt_compareFn) {
  var compare = opt_compareFn || goog.array.defaultCompare;
  goog.array.sort(arr, function(a, b) {
    return compare(a[key], b[key]);
  });
***REMOVED***


***REMOVED***
***REMOVED*** Tells if the array is sorted.
***REMOVED*** @param {!Array.<T>} arr The array.
***REMOVED*** @param {?function(T,T):number=} opt_compareFn Function to compare the
***REMOVED***     array elements.
***REMOVED***     Should take 2 arguments to compare, and return a negative number, zero,
***REMOVED***     or a positive number depending on whether the first argument is less
***REMOVED***     than, equal to, or greater than the second.
***REMOVED*** @param {boolean=} opt_strict If true no equal elements are allowed.
***REMOVED*** @return {boolean} Whether the array is sorted.
***REMOVED*** @template T
***REMOVED***
goog.array.isSorted = function(arr, opt_compareFn, opt_strict) {
  var compare = opt_compareFn || goog.array.defaultCompare;
  for (var i = 1; i < arr.length; i++) {
    var compareResult = compare(arr[i - 1], arr[i]);
    if (compareResult > 0 || compareResult == 0 && opt_strict) {
      return false;
    }
  }
  return true;
***REMOVED***


***REMOVED***
***REMOVED*** Compares two arrays for equality. Two arrays are considered equal if they
***REMOVED*** have the same length and their corresponding elements are equal according to
***REMOVED*** the comparison function.
***REMOVED***
***REMOVED*** @param {goog.array.ArrayLike} arr1 The first array to compare.
***REMOVED*** @param {goog.array.ArrayLike} arr2 The second array to compare.
***REMOVED*** @param {Function=} opt_equalsFn Optional comparison function.
***REMOVED***     Should take 2 arguments to compare, and return true if the arguments
***REMOVED***     are equal. Defaults to {@link goog.array.defaultCompareEquality} which
***REMOVED***     compares the elements using the built-in '===' operator.
***REMOVED*** @return {boolean} Whether the two arrays are equal.
***REMOVED***
goog.array.equals = function(arr1, arr2, opt_equalsFn) {
  if (!goog.isArrayLike(arr1) || !goog.isArrayLike(arr2) ||
      arr1.length != arr2.length) {
    return false;
  }
  var l = arr1.length;
  var equalsFn = opt_equalsFn || goog.array.defaultCompareEquality;
  for (var i = 0; i < l; i++) {
    if (!equalsFn(arr1[i], arr2[i])) {
      return false;
    }
  }
  return true;
***REMOVED***


***REMOVED***
***REMOVED*** 3-way array compare function.
***REMOVED*** @param {!Array.<VALUE>|!goog.array.ArrayLike} arr1 The first array to
***REMOVED***     compare.
***REMOVED*** @param {!Array.<VALUE>|!goog.array.ArrayLike} arr2 The second array to
***REMOVED***     compare.
***REMOVED*** @param {function(VALUE, VALUE): number=} opt_compareFn Optional comparison
***REMOVED***     function by which the array is to be ordered. Should take 2 arguments to
***REMOVED***     compare, and return a negative number, zero, or a positive number
***REMOVED***     depending on whether the first argument is less than, equal to, or
***REMOVED***     greater than the second.
***REMOVED*** @return {number} Negative number, zero, or a positive number depending on
***REMOVED***     whether the first argument is less than, equal to, or greater than the
***REMOVED***     second.
***REMOVED*** @template VALUE
***REMOVED***
goog.array.compare3 = function(arr1, arr2, opt_compareFn) {
  var compare = opt_compareFn || goog.array.defaultCompare;
  var l = Math.min(arr1.length, arr2.length);
  for (var i = 0; i < l; i++) {
    var result = compare(arr1[i], arr2[i]);
    if (result != 0) {
      return result;
    }
  }
  return goog.array.defaultCompare(arr1.length, arr2.length);
***REMOVED***


***REMOVED***
***REMOVED*** Compares its two arguments for order, using the built in < and >
***REMOVED*** operators.
***REMOVED*** @param {VALUE} a The first object to be compared.
***REMOVED*** @param {VALUE} b The second object to be compared.
***REMOVED*** @return {number} A negative number, zero, or a positive number as the first
***REMOVED***     argument is less than, equal to, or greater than the second.
***REMOVED*** @template VALUE
***REMOVED***
goog.array.defaultCompare = function(a, b) {
  return a > b ? 1 : a < b ? -1 : 0;
***REMOVED***


***REMOVED***
***REMOVED*** Compares its two arguments for equality, using the built in === operator.
***REMOVED*** @param {*} a The first object to compare.
***REMOVED*** @param {*} b The second object to compare.
***REMOVED*** @return {boolean} True if the two arguments are equal, false otherwise.
***REMOVED***
goog.array.defaultCompareEquality = function(a, b) {
  return a === b;
***REMOVED***


***REMOVED***
***REMOVED*** Inserts a value into a sorted array. The array is not modified if the
***REMOVED*** value is already present.
***REMOVED*** @param {Array.<VALUE>|goog.array.ArrayLike} array The array to modify.
***REMOVED*** @param {VALUE} value The object to insert.
***REMOVED*** @param {function(VALUE, VALUE): number=} opt_compareFn Optional comparison
***REMOVED***     function by which the array is ordered. Should take 2 arguments to
***REMOVED***     compare, and return a negative number, zero, or a positive number
***REMOVED***     depending on whether the first argument is less than, equal to, or
***REMOVED***     greater than the second.
***REMOVED*** @return {boolean} True if an element was inserted.
***REMOVED*** @template VALUE
***REMOVED***
goog.array.binaryInsert = function(array, value, opt_compareFn) {
  var index = goog.array.binarySearch(array, value, opt_compareFn);
  if (index < 0) {
    goog.array.insertAt(array, value, -(index + 1));
    return true;
  }
  return false;
***REMOVED***


***REMOVED***
***REMOVED*** Removes a value from a sorted array.
***REMOVED*** @param {!Array.<VALUE>|!goog.array.ArrayLike} array The array to modify.
***REMOVED*** @param {VALUE} value The object to remove.
***REMOVED*** @param {function(VALUE, VALUE): number=} opt_compareFn Optional comparison
***REMOVED***     function by which the array is ordered. Should take 2 arguments to
***REMOVED***     compare, and return a negative number, zero, or a positive number
***REMOVED***     depending on whether the first argument is less than, equal to, or
***REMOVED***     greater than the second.
***REMOVED*** @return {boolean} True if an element was removed.
***REMOVED*** @template VALUE
***REMOVED***
goog.array.binaryRemove = function(array, value, opt_compareFn) {
  var index = goog.array.binarySearch(array, value, opt_compareFn);
  return (index >= 0) ? goog.array.removeAt(array, index) : false;
***REMOVED***


***REMOVED***
***REMOVED*** Splits an array into disjoint buckets according to a splitting function.
***REMOVED*** @param {Array.<T>} array The array.
***REMOVED*** @param {function(this:S, T,number,Array.<T>):?} sorter Function to call for
***REMOVED***     every element.  This takes 3 arguments (the element, the index and the
***REMOVED***     array) and must return a valid object key (a string, number, etc), or
***REMOVED***     undefined, if that object should not be placed in a bucket.
***REMOVED*** @param {S=} opt_obj The object to be used as the value of 'this' within
***REMOVED***     sorter.
***REMOVED*** @return {!Object} An object, with keys being all of the unique return values
***REMOVED***     of sorter, and values being arrays containing the items for
***REMOVED***     which the splitter returned that key.
***REMOVED*** @template T,S
***REMOVED***
goog.array.bucket = function(array, sorter, opt_obj) {
  var buckets = {***REMOVED***

  for (var i = 0; i < array.length; i++) {
    var value = array[i];
    var key = sorter.call(opt_obj, value, i, array);
    if (goog.isDef(key)) {
      // Push the value to the right bucket, creating it if necessary.
      var bucket = buckets[key] || (buckets[key] = []);
      bucket.push(value);
    }
  }

  return buckets;
***REMOVED***


***REMOVED***
***REMOVED*** Creates a new object built from the provided array and the key-generation
***REMOVED*** function.
***REMOVED*** @param {Array.<T>|goog.array.ArrayLike} arr Array or array like object over
***REMOVED***     which to iterate whose elements will be the values in the new object.
***REMOVED*** @param {?function(this:S, T, number, ?) : string} keyFunc The function to
***REMOVED***     call for every element. This function takes 3 arguments (the element, the
***REMOVED***     index and the array) and should return a string that will be used as the
***REMOVED***     key for the element in the new object. If the function returns the same
***REMOVED***     key for more than one element, the value for that key is
***REMOVED***     implementation-defined.
***REMOVED*** @param {S=} opt_obj The object to be used as the value of 'this'
***REMOVED***     within keyFunc.
***REMOVED*** @return {!Object.<T>} The new object.
***REMOVED*** @template T,S
***REMOVED***
goog.array.toObject = function(arr, keyFunc, opt_obj) {
  var ret = {***REMOVED***
  goog.array.forEach(arr, function(element, index) {
    ret[keyFunc.call(opt_obj, element, index, arr)] = element;
  });
  return ret;
***REMOVED***


***REMOVED***
***REMOVED*** Creates a range of numbers in an arithmetic progression.
***REMOVED***
***REMOVED*** Range takes 1, 2, or 3 arguments:
***REMOVED*** <pre>
***REMOVED*** range(5) is the same as range(0, 5, 1) and produces [0, 1, 2, 3, 4]
***REMOVED*** range(2, 5) is the same as range(2, 5, 1) and produces [2, 3, 4]
***REMOVED*** range(-2, -5, -1) produces [-2, -3, -4]
***REMOVED*** range(-2, -5, 1) produces [], since stepping by 1 wouldn't ever reach -5.
***REMOVED*** </pre>
***REMOVED***
***REMOVED*** @param {number} startOrEnd The starting value of the range if an end argument
***REMOVED***     is provided. Otherwise, the start value is 0, and this is the end value.
***REMOVED*** @param {number=} opt_end The optional end value of the range.
***REMOVED*** @param {number=} opt_step The step size between range values. Defaults to 1
***REMOVED***     if opt_step is undefined or 0.
***REMOVED*** @return {!Array.<number>} An array of numbers for the requested range. May be
***REMOVED***     an empty array if adding the step would not converge toward the end
***REMOVED***     value.
***REMOVED***
goog.array.range = function(startOrEnd, opt_end, opt_step) {
  var array = [];
  var start = 0;
  var end = startOrEnd;
  var step = opt_step || 1;
  if (opt_end !== undefined) {
    start = startOrEnd;
    end = opt_end;
  }

  if (step***REMOVED*** (end - start) < 0) {
    // Sign mismatch: start + step will never reach the end value.
    return [];
  }

  if (step > 0) {
    for (var i = start; i < end; i += step) {
      array.push(i);
    }
  } else {
    for (var i = start; i > end; i += step) {
      array.push(i);
    }
  }
  return array;
***REMOVED***


***REMOVED***
***REMOVED*** Returns an array consisting of the given value repeated N times.
***REMOVED***
***REMOVED*** @param {VALUE} value The value to repeat.
***REMOVED*** @param {number} n The repeat count.
***REMOVED*** @return {!Array.<VALUE>} An array with the repeated value.
***REMOVED*** @template VALUE
***REMOVED***
goog.array.repeat = function(value, n) {
  var array = [];
  for (var i = 0; i < n; i++) {
    array[i] = value;
  }
  return array;
***REMOVED***


***REMOVED***
***REMOVED*** Returns an array consisting of every argument with all arrays
***REMOVED*** expanded in-place recursively.
***REMOVED***
***REMOVED*** @param {...*} var_args The values to flatten.
***REMOVED*** @return {!Array} An array containing the flattened values.
***REMOVED***
goog.array.flatten = function(var_args) {
  var result = [];
  for (var i = 0; i < arguments.length; i++) {
    var element = arguments[i];
    if (goog.isArray(element)) {
      result.push.apply(result, goog.array.flatten.apply(null, element));
    } else {
      result.push(element);
    }
  }
  return result;
***REMOVED***


***REMOVED***
***REMOVED*** Rotates an array in-place. After calling this method, the element at
***REMOVED*** index i will be the element previously at index (i - n) %
***REMOVED*** array.length, for all values of i between 0 and array.length - 1,
***REMOVED*** inclusive.
***REMOVED***
***REMOVED*** For example, suppose list comprises [t, a, n, k, s]. After invoking
***REMOVED*** rotate(array, 1) (or rotate(array, -4)), array will comprise [s, t, a, n, k].
***REMOVED***
***REMOVED*** @param {!Array.<T>} array The array to rotate.
***REMOVED*** @param {number} n The amount to rotate.
***REMOVED*** @return {!Array.<T>} The array.
***REMOVED*** @template T
***REMOVED***
goog.array.rotate = function(array, n) {
  goog.asserts.assert(array.length != null);

  if (array.length) {
    n %= array.length;
    if (n > 0) {
      goog.array.ARRAY_PROTOTYPE_.unshift.apply(array, array.splice(-n, n));
    } else if (n < 0) {
      goog.array.ARRAY_PROTOTYPE_.push.apply(array, array.splice(0, -n));
    }
  }
  return array;
***REMOVED***


***REMOVED***
***REMOVED*** Moves one item of an array to a new position keeping the order of the rest
***REMOVED*** of the items. Example use case: keeping a list of JavaScript objects
***REMOVED*** synchronized with the corresponding list of DOM elements after one of the
***REMOVED*** elements has been dragged to a new position.
***REMOVED*** @param {!(Array|Arguments|{length:number})} arr The array to modify.
***REMOVED*** @param {number} fromIndex Index of the item to move between 0 and
***REMOVED***     {@code arr.length - 1}.
***REMOVED*** @param {number} toIndex Target index between 0 and {@code arr.length - 1}.
***REMOVED***
goog.array.moveItem = function(arr, fromIndex, toIndex) {
  goog.asserts.assert(fromIndex >= 0 && fromIndex < arr.length);
  goog.asserts.assert(toIndex >= 0 && toIndex < arr.length);
  // Remove 1 item at fromIndex.
  var removedItems = goog.array.ARRAY_PROTOTYPE_.splice.call(arr, fromIndex, 1);
  // Insert the removed item at toIndex.
  goog.array.ARRAY_PROTOTYPE_.splice.call(arr, toIndex, 0, removedItems[0]);
  // We don't use goog.array.insertAt and goog.array.removeAt, because they're
  // significantly slower than splice.
***REMOVED***


***REMOVED***
***REMOVED*** Creates a new array for which the element at position i is an array of the
***REMOVED*** ith element of the provided arrays.  The returned array will only be as long
***REMOVED*** as the shortest array provided; additional values are ignored.  For example,
***REMOVED*** the result of zipping [1, 2] and [3, 4, 5] is [[1,3], [2, 4]].
***REMOVED***
***REMOVED*** This is similar to the zip() function in Python.  See {@link
***REMOVED*** http://docs.python.org/library/functions.html#zip}
***REMOVED***
***REMOVED*** @param {...!goog.array.ArrayLike} var_args Arrays to be combined.
***REMOVED*** @return {!Array.<!Array>} A new array of arrays created from provided arrays.
***REMOVED***
goog.array.zip = function(var_args) {
  if (!arguments.length) {
    return [];
  }
  var result = [];
  for (var i = 0; true; i++) {
    var value = [];
    for (var j = 0; j < arguments.length; j++) {
      var arr = arguments[j];
      // If i is larger than the array length, this is the shortest array.
      if (i >= arr.length) {
        return result;
      }
      value.push(arr[i]);
    }
    result.push(value);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Shuffles the values in the specified array using the Fisher-Yates in-place
***REMOVED*** shuffle (also known as the Knuth Shuffle). By default, calls Math.random()
***REMOVED*** and so resets the state of that random number generator. Similarly, may reset
***REMOVED*** the state of the any other specified random number generator.
***REMOVED***
***REMOVED*** Runtime: O(n)
***REMOVED***
***REMOVED*** @param {!Array} arr The array to be shuffled.
***REMOVED*** @param {function():number=} opt_randFn Optional random function to use for
***REMOVED***     shuffling.
***REMOVED***     Takes no arguments, and returns a random number on the interval [0, 1).
***REMOVED***     Defaults to Math.random() using JavaScript's built-in Math library.
***REMOVED***
goog.array.shuffle = function(arr, opt_randFn) {
  var randFn = opt_randFn || Math.random;

  for (var i = arr.length - 1; i > 0; i--) {
    // Choose a random array index in [0, i] (inclusive with i).
    var j = Math.floor(randFn()***REMOVED*** (i + 1));

    var tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
  }
***REMOVED***
