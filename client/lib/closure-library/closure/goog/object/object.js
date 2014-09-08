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
***REMOVED*** @fileoverview Utilities for manipulating objects/maps/hashes.
***REMOVED***

goog.provide('goog.object');


***REMOVED***
***REMOVED*** Calls a function for each element in an object/map/hash.
***REMOVED***
***REMOVED*** @param {Object.<K,V>} obj The object over which to iterate.
***REMOVED*** @param {function(this:T,V,?,Object.<K,V>):?} f The function to call
***REMOVED***     for every element. This function takes 3 arguments (the element, the
***REMOVED***     index and the object) and the return value is ignored.
***REMOVED*** @param {T=} opt_obj This is used as the 'this' object within f.
***REMOVED*** @template T,K,V
***REMOVED***
goog.object.forEach = function(obj, f, opt_obj) {
  for (var key in obj) {
    f.call(opt_obj, obj[key], key, obj);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Calls a function for each element in an object/map/hash. If that call returns
***REMOVED*** true, adds the element to a new object.
***REMOVED***
***REMOVED*** @param {Object.<K,V>} obj The object over which to iterate.
***REMOVED*** @param {function(this:T,V,?,Object.<K,V>):boolean} f The function to call
***REMOVED***     for every element. This
***REMOVED***     function takes 3 arguments (the element, the index and the object)
***REMOVED***     and should return a boolean. If the return value is true the
***REMOVED***     element is added to the result object. If it is false the
***REMOVED***     element is not included.
***REMOVED*** @param {T=} opt_obj This is used as the 'this' object within f.
***REMOVED*** @return {!Object.<K,V>} a new object in which only elements that passed the
***REMOVED***     test are present.
***REMOVED*** @template T,K,V
***REMOVED***
goog.object.filter = function(obj, f, opt_obj) {
  var res = {***REMOVED***
  for (var key in obj) {
    if (f.call(opt_obj, obj[key], key, obj)) {
      res[key] = obj[key];
    }
  }
  return res;
***REMOVED***


***REMOVED***
***REMOVED*** For every element in an object/map/hash calls a function and inserts the
***REMOVED*** result into a new object.
***REMOVED***
***REMOVED*** @param {Object.<K,V>} obj The object over which to iterate.
***REMOVED*** @param {function(this:T,V,?,Object.<K,V>):R} f The function to call
***REMOVED***     for every element. This function
***REMOVED***     takes 3 arguments (the element, the index and the object)
***REMOVED***     and should return something. The result will be inserted
***REMOVED***     into a new object.
***REMOVED*** @param {T=} opt_obj This is used as the 'this' object within f.
***REMOVED*** @return {!Object.<K,R>} a new object with the results from f.
***REMOVED*** @template T,K,V,R
***REMOVED***
goog.object.map = function(obj, f, opt_obj) {
  var res = {***REMOVED***
  for (var key in obj) {
    res[key] = f.call(opt_obj, obj[key], key, obj);
  }
  return res;
***REMOVED***


***REMOVED***
***REMOVED*** Calls a function for each element in an object/map/hash. If any
***REMOVED*** call returns true, returns true (without checking the rest). If
***REMOVED*** all calls return false, returns false.
***REMOVED***
***REMOVED*** @param {Object.<K,V>} obj The object to check.
***REMOVED*** @param {function(this:T,V,?,Object.<K,V>):boolean} f The function to
***REMOVED***     call for every element. This function
***REMOVED***     takes 3 arguments (the element, the index and the object) and should
***REMOVED***     return a boolean.
***REMOVED*** @param {T=} opt_obj This is used as the 'this' object within f.
***REMOVED*** @return {boolean} true if any element passes the test.
***REMOVED*** @template T,K,V
***REMOVED***
goog.object.some = function(obj, f, opt_obj) {
  for (var key in obj) {
    if (f.call(opt_obj, obj[key], key, obj)) {
      return true;
    }
  }
  return false;
***REMOVED***


***REMOVED***
***REMOVED*** Calls a function for each element in an object/map/hash. If
***REMOVED*** all calls return true, returns true. If any call returns false, returns
***REMOVED*** false at this point and does not continue to check the remaining elements.
***REMOVED***
***REMOVED*** @param {Object.<K,V>} obj The object to check.
***REMOVED*** @param {?function(this:T,V,?,Object.<K,V>):boolean} f The function to
***REMOVED***     call for every element. This function
***REMOVED***     takes 3 arguments (the element, the index and the object) and should
***REMOVED***     return a boolean.
***REMOVED*** @param {T=} opt_obj This is used as the 'this' object within f.
***REMOVED*** @return {boolean} false if any element fails the test.
***REMOVED*** @template T,K,V
***REMOVED***
goog.object.every = function(obj, f, opt_obj) {
  for (var key in obj) {
    if (!f.call(opt_obj, obj[key], key, obj)) {
      return false;
    }
  }
  return true;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the number of key-value pairs in the object map.
***REMOVED***
***REMOVED*** @param {Object} obj The object for which to get the number of key-value
***REMOVED***     pairs.
***REMOVED*** @return {number} The number of key-value pairs in the object map.
***REMOVED***
goog.object.getCount = function(obj) {
  // JS1.5 has __count__ but it has been deprecated so it raises a warning...
  // in other words do not use. Also __count__ only includes the fields on the
  // actual object and not in the prototype chain.
  var rv = 0;
  for (var key in obj) {
    rv++;
  }
  return rv;
***REMOVED***


***REMOVED***
***REMOVED*** Returns one key from the object map, if any exists.
***REMOVED*** For map literals the returned key will be the first one in most of the
***REMOVED*** browsers (a know exception is Konqueror).
***REMOVED***
***REMOVED*** @param {Object} obj The object to pick a key from.
***REMOVED*** @return {string|undefined} The key or undefined if the object is empty.
***REMOVED***
goog.object.getAnyKey = function(obj) {
  for (var key in obj) {
    return key;
  }
***REMOVED***


***REMOVED***
***REMOVED*** Returns one value from the object map, if any exists.
***REMOVED*** For map literals the returned value will be the first one in most of the
***REMOVED*** browsers (a know exception is Konqueror).
***REMOVED***
***REMOVED*** @param {Object.<K,V>} obj The object to pick a value from.
***REMOVED*** @return {V|undefined} The value or undefined if the object is empty.
***REMOVED*** @template K,V
***REMOVED***
goog.object.getAnyValue = function(obj) {
  for (var key in obj) {
    return obj[key];
  }
***REMOVED***


***REMOVED***
***REMOVED*** Whether the object/hash/map contains the given object as a value.
***REMOVED*** An alias for goog.object.containsValue(obj, val).
***REMOVED***
***REMOVED*** @param {Object.<K,V>} obj The object in which to look for val.
***REMOVED*** @param {V} val The object for which to check.
***REMOVED*** @return {boolean} true if val is present.
***REMOVED*** @template K,V
***REMOVED***
goog.object.contains = function(obj, val) {
  return goog.object.containsValue(obj, val);
***REMOVED***


***REMOVED***
***REMOVED*** Returns the values of the object/map/hash.
***REMOVED***
***REMOVED*** @param {Object.<K,V>} obj The object from which to get the values.
***REMOVED*** @return {!Array.<V>} The values in the object/map/hash.
***REMOVED*** @template K,V
***REMOVED***
goog.object.getValues = function(obj) {
  var res = [];
  var i = 0;
  for (var key in obj) {
    res[i++] = obj[key];
  }
  return res;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the keys of the object/map/hash.
***REMOVED***
***REMOVED*** @param {Object} obj The object from which to get the keys.
***REMOVED*** @return {!Array.<string>} Array of property keys.
***REMOVED***
goog.object.getKeys = function(obj) {
  var res = [];
  var i = 0;
  for (var key in obj) {
    res[i++] = key;
  }
  return res;
***REMOVED***


***REMOVED***
***REMOVED*** Get a value from an object multiple levels deep.  This is useful for
***REMOVED*** pulling values from deeply nested objects, such as JSON responses.
***REMOVED*** Example usage: getValueByKeys(jsonObj, 'foo', 'entries', 3)
***REMOVED***
***REMOVED*** @param {!Object} obj An object to get the value from.  Can be array-like.
***REMOVED*** @param {...(string|number|!Array.<number|string>)} var_args A number of keys
***REMOVED***     (as strings, or numbers, for array-like objects).  Can also be
***REMOVED***     specified as a single array of keys.
***REMOVED*** @return {*} The resulting value.  If, at any point, the value for a key
***REMOVED***     is undefined, returns undefined.
***REMOVED***
goog.object.getValueByKeys = function(obj, var_args) {
  var isArrayLike = goog.isArrayLike(var_args);
  var keys = isArrayLike ? var_args : arguments;

  // Start with the 2nd parameter for the variable parameters syntax.
  for (var i = isArrayLike ? 0 : 1; i < keys.length; i++) {
    obj = obj[keys[i]];
    if (!goog.isDef(obj)) {
      break;
    }
  }

  return obj;
***REMOVED***


***REMOVED***
***REMOVED*** Whether the object/map/hash contains the given key.
***REMOVED***
***REMOVED*** @param {Object} obj The object in which to look for key.
***REMOVED*** @param {*} key The key for which to check.
***REMOVED*** @return {boolean} true If the map contains the key.
***REMOVED***
goog.object.containsKey = function(obj, key) {
  return key in obj;
***REMOVED***


***REMOVED***
***REMOVED*** Whether the object/map/hash contains the given value. This is O(n).
***REMOVED***
***REMOVED*** @param {Object.<K,V>} obj The object in which to look for val.
***REMOVED*** @param {V} val The value for which to check.
***REMOVED*** @return {boolean} true If the map contains the value.
***REMOVED*** @template K,V
***REMOVED***
goog.object.containsValue = function(obj, val) {
  for (var key in obj) {
    if (obj[key] == val) {
      return true;
    }
  }
  return false;
***REMOVED***


***REMOVED***
***REMOVED*** Searches an object for an element that satisfies the given condition and
***REMOVED*** returns its key.
***REMOVED*** @param {Object.<K,V>} obj The object to search in.
***REMOVED*** @param {function(this:T,V,string,Object.<K,V>):boolean} f The
***REMOVED***      function to call for every element. Takes 3 arguments (the value,
***REMOVED***     the key and the object) and should return a boolean.
***REMOVED*** @param {T=} opt_this An optional "this" context for the function.
***REMOVED*** @return {string|undefined} The key of an element for which the function
***REMOVED***     returns true or undefined if no such element is found.
***REMOVED*** @template T,K,V
***REMOVED***
goog.object.findKey = function(obj, f, opt_this) {
  for (var key in obj) {
    if (f.call(opt_this, obj[key], key, obj)) {
      return key;
    }
  }
  return undefined;
***REMOVED***


***REMOVED***
***REMOVED*** Searches an object for an element that satisfies the given condition and
***REMOVED*** returns its value.
***REMOVED*** @param {Object.<K,V>} obj The object to search in.
***REMOVED*** @param {function(this:T,V,string,Object.<K,V>):boolean} f The function
***REMOVED***     to call for every element. Takes 3 arguments (the value, the key
***REMOVED***     and the object) and should return a boolean.
***REMOVED*** @param {T=} opt_this An optional "this" context for the function.
***REMOVED*** @return {V} The value of an element for which the function returns true or
***REMOVED***     undefined if no such element is found.
***REMOVED*** @template T,K,V
***REMOVED***
goog.object.findValue = function(obj, f, opt_this) {
  var key = goog.object.findKey(obj, f, opt_this);
  return key && obj[key];
***REMOVED***


***REMOVED***
***REMOVED*** Whether the object/map/hash is empty.
***REMOVED***
***REMOVED*** @param {Object} obj The object to test.
***REMOVED*** @return {boolean} true if obj is empty.
***REMOVED***
goog.object.isEmpty = function(obj) {
  for (var key in obj) {
    return false;
  }
  return true;
***REMOVED***


***REMOVED***
***REMOVED*** Removes all key value pairs from the object/map/hash.
***REMOVED***
***REMOVED*** @param {Object} obj The object to clear.
***REMOVED***
goog.object.clear = function(obj) {
  for (var i in obj) {
    delete obj[i];
  }
***REMOVED***


***REMOVED***
***REMOVED*** Removes a key-value pair based on the key.
***REMOVED***
***REMOVED*** @param {Object} obj The object from which to remove the key.
***REMOVED*** @param {*} key The key to remove.
***REMOVED*** @return {boolean} Whether an element was removed.
***REMOVED***
goog.object.remove = function(obj, key) {
  var rv;
  if ((rv = key in obj)) {
    delete obj[key];
  }
  return rv;
***REMOVED***


***REMOVED***
***REMOVED*** Adds a key-value pair to the object. Throws an exception if the key is
***REMOVED*** already in use. Use set if you want to change an existing pair.
***REMOVED***
***REMOVED*** @param {Object.<K,V>} obj The object to which to add the key-value pair.
***REMOVED*** @param {string} key The key to add.
***REMOVED*** @param {V} val The value to add.
***REMOVED*** @template K,V
***REMOVED***
goog.object.add = function(obj, key, val) {
  if (key in obj) {
    throw Error('The object already contains the key "' + key + '"');
  }
  goog.object.set(obj, key, val);
***REMOVED***


***REMOVED***
***REMOVED*** Returns the value for the given key.
***REMOVED***
***REMOVED*** @param {Object.<K,V>} obj The object from which to get the value.
***REMOVED*** @param {string} key The key for which to get the value.
***REMOVED*** @param {R=} opt_val The value to return if no item is found for the given
***REMOVED***     key (default is undefined).
***REMOVED*** @return {V|R|undefined} The value for the given key.
***REMOVED*** @template K,V,R
***REMOVED***
goog.object.get = function(obj, key, opt_val) {
  if (key in obj) {
    return obj[key];
  }
  return opt_val;
***REMOVED***


***REMOVED***
***REMOVED*** Adds a key-value pair to the object/map/hash.
***REMOVED***
***REMOVED*** @param {Object.<K,V>} obj The object to which to add the key-value pair.
***REMOVED*** @param {string} key The key to add.
***REMOVED*** @param {V} value The value to add.
***REMOVED*** @template K,V
***REMOVED***
goog.object.set = function(obj, key, value) {
  obj[key] = value;
***REMOVED***


***REMOVED***
***REMOVED*** Adds a key-value pair to the object/map/hash if it doesn't exist yet.
***REMOVED***
***REMOVED*** @param {Object.<K,V>} obj The object to which to add the key-value pair.
***REMOVED*** @param {string} key The key to add.
***REMOVED*** @param {V} value The value to add if the key wasn't present.
***REMOVED*** @return {V} The value of the entry at the end of the function.
***REMOVED*** @template K,V
***REMOVED***
goog.object.setIfUndefined = function(obj, key, value) {
  return key in obj ? obj[key] : (obj[key] = value);
***REMOVED***


***REMOVED***
***REMOVED*** Does a flat clone of the object.
***REMOVED***
***REMOVED*** @param {Object.<K,V>} obj Object to clone.
***REMOVED*** @return {!Object.<K,V>} Clone of the input object.
***REMOVED*** @template K,V
***REMOVED***
goog.object.clone = function(obj) {
  // We cannot use the prototype trick because a lot of methods depend on where
  // the actual key is set.

  var res = {***REMOVED***
  for (var key in obj) {
    res[key] = obj[key];
  }
  return res;
  // We could also use goog.mixin but I wanted this to be independent from that.
***REMOVED***


***REMOVED***
***REMOVED*** Clones a value. The input may be an Object, Array, or basic type. Objects and
***REMOVED*** arrays will be cloned recursively.
***REMOVED***
***REMOVED*** WARNINGS:
***REMOVED*** <code>goog.object.unsafeClone</code> does not detect reference loops. Objects
***REMOVED*** that refer to themselves will cause infinite recursion.
***REMOVED***
***REMOVED*** <code>goog.object.unsafeClone</code> is unaware of unique identifiers, and
***REMOVED*** copies UIDs created by <code>getUid</code> into cloned results.
***REMOVED***
***REMOVED*** @param {*} obj The value to clone.
***REMOVED*** @return {*} A clone of the input value.
***REMOVED***
goog.object.unsafeClone = function(obj) {
  var type = goog.typeOf(obj);
  if (type == 'object' || type == 'array') {
    if (obj.clone) {
      return obj.clone();
    }
    var clone = type == 'array' ? [] : {***REMOVED***
    for (var key in obj) {
      clone[key] = goog.object.unsafeClone(obj[key]);
    }
    return clone;
  }

  return obj;
***REMOVED***


***REMOVED***
***REMOVED*** Returns a new object in which all the keys and values are interchanged
***REMOVED*** (keys become values and values become keys). If multiple keys map to the
***REMOVED*** same value, the chosen transposed value is implementation-dependent.
***REMOVED***
***REMOVED*** @param {Object} obj The object to transpose.
***REMOVED*** @return {!Object} The transposed object.
***REMOVED***
goog.object.transpose = function(obj) {
  var transposed = {***REMOVED***
  for (var key in obj) {
    transposed[obj[key]] = key;
  }
  return transposed;
***REMOVED***


***REMOVED***
***REMOVED*** The names of the fields that are defined on Object.prototype.
***REMOVED*** @type {Array.<string>}
***REMOVED*** @private
***REMOVED***
goog.object.PROTOTYPE_FIELDS_ = [
  'constructor',
  'hasOwnProperty',
  'isPrototypeOf',
  'propertyIsEnumerable',
  'toLocaleString',
  'toString',
  'valueOf'
];


***REMOVED***
***REMOVED*** Extends an object with another object.
***REMOVED*** This operates 'in-place'; it does not create a new Object.
***REMOVED***
***REMOVED*** Example:
***REMOVED*** var o = {***REMOVED***
***REMOVED*** goog.object.extend(o, {a: 0, b: 1});
***REMOVED*** o; // {a: 0, b: 1}
***REMOVED*** goog.object.extend(o, {b: 2, c: 3});
***REMOVED*** o; // {a: 0, b: 2, c: 3}
***REMOVED***
***REMOVED*** @param {Object} target The object to modify. Existing properties will be
***REMOVED***     overwritten if they are also present in one of the objects in
***REMOVED***     {@code var_args}.
***REMOVED*** @param {...Object} var_args The objects from which values will be copied.
***REMOVED***
goog.object.extend = function(target, var_args) {
  var key, source;
  for (var i = 1; i < arguments.length; i++) {
    source = arguments[i];
    for (key in source) {
      target[key] = source[key];
    }

    // For IE the for-in-loop does not contain any properties that are not
    // enumerable on the prototype object (for example isPrototypeOf from
    // Object.prototype) and it will also not include 'replace' on objects that
    // extend String and change 'replace' (not that it is common for anyone to
    // extend anything except Object).

    for (var j = 0; j < goog.object.PROTOTYPE_FIELDS_.length; j++) {
      key = goog.object.PROTOTYPE_FIELDS_[j];
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** Creates a new object built from the key-value pairs provided as arguments.
***REMOVED*** @param {...*} var_args If only one argument is provided and it is an array
***REMOVED***     then this is used as the arguments,  otherwise even arguments are used as
***REMOVED***     the property names and odd arguments are used as the property values.
***REMOVED*** @return {!Object} The new object.
***REMOVED*** @throws {Error} If there are uneven number of arguments or there is only one
***REMOVED***     non array argument.
***REMOVED***
goog.object.create = function(var_args) {
  var argLength = arguments.length;
  if (argLength == 1 && goog.isArray(arguments[0])) {
    return goog.object.create.apply(null, arguments[0]);
  }

  if (argLength % 2) {
    throw Error('Uneven number of arguments');
  }

  var rv = {***REMOVED***
  for (var i = 0; i < argLength; i += 2) {
    rv[arguments[i]] = arguments[i + 1];
  }
  return rv;
***REMOVED***


***REMOVED***
***REMOVED*** Creates a new object where the property names come from the arguments but
***REMOVED*** the value is always set to true
***REMOVED*** @param {...*} var_args If only one argument is provided and it is an array
***REMOVED***     then this is used as the arguments,  otherwise the arguments are used
***REMOVED***     as the property names.
***REMOVED*** @return {!Object} The new object.
***REMOVED***
goog.object.createSet = function(var_args) {
  var argLength = arguments.length;
  if (argLength == 1 && goog.isArray(arguments[0])) {
    return goog.object.createSet.apply(null, arguments[0]);
  }

  var rv = {***REMOVED***
  for (var i = 0; i < argLength; i++) {
    rv[arguments[i]] = true;
  }
  return rv;
***REMOVED***


***REMOVED***
***REMOVED*** Creates an immutable view of the underlying object, if the browser
***REMOVED*** supports immutable objects.
***REMOVED***
***REMOVED*** In default mode, writes to this view will fail silently. In strict mode,
***REMOVED*** they will throw an error.
***REMOVED***
***REMOVED*** @param {!Object.<K,V>} obj An object.
***REMOVED*** @return {!Object.<K,V>} An immutable view of that object, or the
***REMOVED***     original object if this browser does not support immutables.
***REMOVED*** @template K,V
***REMOVED***
goog.object.createImmutableView = function(obj) {
  var result = obj;
  if (Object.isFrozen && !Object.isFrozen(obj)) {
    result = Object.create(obj);
    Object.freeze(result);
  }
  return result;
***REMOVED***


***REMOVED***
***REMOVED*** @param {!Object} obj An object.
***REMOVED*** @return {boolean} Whether this is an immutable view of the object.
***REMOVED***
goog.object.isImmutableView = function(obj) {
  return !!Object.isFrozen && Object.isFrozen(obj);
***REMOVED***
