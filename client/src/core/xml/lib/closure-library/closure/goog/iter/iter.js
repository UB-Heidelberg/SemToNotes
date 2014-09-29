// Copyright 2007 The Closure Library Authors. All Rights Reserved.
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
***REMOVED*** @fileoverview Python style iteration utilities.
***REMOVED*** @author arv@google.com (Erik Arvidsson)
***REMOVED***


goog.provide('goog.iter');
goog.provide('goog.iter.Iterator');
goog.provide('goog.iter.StopIteration');

goog.require('goog.array');
goog.require('goog.asserts');


// TODO(nnaze): Add more functions from Python's itertools.
// http://docs.python.org/library/itertools.html


***REMOVED***
***REMOVED*** @typedef {goog.iter.Iterator|{length:number}|{__iterator__}}
***REMOVED***
goog.iter.Iterable;


// For script engines that already support iterators.
if ('StopIteration' in goog.global) {
 ***REMOVED*****REMOVED***
  ***REMOVED*** Singleton Error object that is used to terminate iterations.
  ***REMOVED*** @type {Error}
 ***REMOVED*****REMOVED***
  goog.iter.StopIteration = goog.global['StopIteration'];
} else {
 ***REMOVED*****REMOVED***
  ***REMOVED*** Singleton Error object that is used to terminate iterations.
  ***REMOVED*** @type {Error}
  ***REMOVED*** @suppress {duplicate}
 ***REMOVED*****REMOVED***
  goog.iter.StopIteration = Error('StopIteration');
}



***REMOVED***
***REMOVED*** Class/interface for iterators.  An iterator needs to implement a {@code next}
***REMOVED*** method and it needs to throw a {@code goog.iter.StopIteration} when the
***REMOVED*** iteration passes beyond the end.  Iterators have no {@code hasNext} method.
***REMOVED*** It is recommended to always use the helper functions to iterate over the
***REMOVED*** iterator or in case you are only targeting JavaScript 1.7 for in loops.
***REMOVED***
***REMOVED***
goog.iter.Iterator = function() {***REMOVED***


***REMOVED***
***REMOVED*** Returns the next value of the iteration.  This will throw the object
***REMOVED*** {@see goog.iter#StopIteration} when the iteration passes the end.
***REMOVED*** @return {*} Any object or value.
***REMOVED***
goog.iter.Iterator.prototype.next = function() {
  throw goog.iter.StopIteration;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the {@code Iterator} object itself.  This is used to implement
***REMOVED*** the iterator protocol in JavaScript 1.7
***REMOVED*** @param {boolean=} opt_keys  Whether to return the keys or values. Default is
***REMOVED***     to only return the values.  This is being used by the for-in loop (true)
***REMOVED***     and the for-each-in loop (false).  Even though the param gives a hint
***REMOVED***     about what the iterator will return there is no guarantee that it will
***REMOVED***     return the keys when true is passed.
***REMOVED*** @return {!goog.iter.Iterator} The object itself.
***REMOVED***
goog.iter.Iterator.prototype.__iterator__ = function(opt_keys) {
  return this;
***REMOVED***


***REMOVED***
***REMOVED*** Returns an iterator that knows how to iterate over the values in the object.
***REMOVED*** @param {goog.iter.Iterable} iterable  If the object is an iterator it
***REMOVED***     will be returned as is.  If the object has a {@code __iterator__} method
***REMOVED***     that will be called to get the value iterator.  If the object is an
***REMOVED***     array-like object we create an iterator for that.
***REMOVED*** @return {!goog.iter.Iterator} An iterator that knows how to iterate over the
***REMOVED***     values in {@code iterable}.
***REMOVED***
goog.iter.toIterator = function(iterable) {
  if (iterable instanceof goog.iter.Iterator) {
    return iterable;
  }
  if (typeof iterable.__iterator__ == 'function') {
    return iterable.__iterator__(false);
  }
  if (goog.isArrayLike(iterable)) {
    var i = 0;
    var newIter = new goog.iter.Iterator;
    newIter.next = function() {
      while (true) {
        if (i >= iterable.length) {
          throw goog.iter.StopIteration;
        }
        // Don't include deleted elements.
        if (!(i in iterable)) {
          i++;
          continue;
        }
        return iterable[i++];
      }
   ***REMOVED*****REMOVED***
    return newIter;
  }


  // TODO(arv): Should we fall back on goog.structs.getValues()?
  throw Error('Not implemented');
***REMOVED***


***REMOVED***
***REMOVED*** Calls a function for each element in the iterator with the element of the
***REMOVED*** iterator passed as argument.
***REMOVED***
***REMOVED*** @param {goog.iter.Iterable} iterable  The iterator to iterate
***REMOVED***     over.  If the iterable is an object {@code toIterator} will be called on
***REMOVED***     it.
* @param {function(this:T,?,?,?):?} f  The function to call for every
***REMOVED***     element.  This function
***REMOVED***     takes 3 arguments (the element, undefined, and the iterator) and the
***REMOVED***     return value is irrelevant.  The reason for passing undefined as the
***REMOVED***     second argument is so that the same function can be used in
***REMOVED***     {@see goog.array#forEach} as well as others.
***REMOVED*** @param {T=} opt_obj  The object to be used as the value of 'this' within
***REMOVED***     {@code f}.
***REMOVED*** @template T
***REMOVED***
goog.iter.forEach = function(iterable, f, opt_obj) {
  if (goog.isArrayLike(iterable)) {
   ***REMOVED*****REMOVED*** @preserveTry***REMOVED***
    try {
      // NOTES: this passes the index number to the second parameter
      // of the callback contrary to the documentation above.
      goog.array.forEach(***REMOVED*** @type {goog.array.ArrayLike}***REMOVED***(iterable), f,
                         opt_obj);
    } catch (ex) {
      if (ex !== goog.iter.StopIteration) {
        throw ex;
      }
    }
  } else {
    iterable = goog.iter.toIterator(iterable);
   ***REMOVED*****REMOVED*** @preserveTry***REMOVED***
    try {
      while (true) {
        f.call(opt_obj, iterable.next(), undefined, iterable);
      }
    } catch (ex) {
      if (ex !== goog.iter.StopIteration) {
        throw ex;
      }
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** Calls a function for every element in the iterator, and if the function
***REMOVED*** returns true adds the element to a new iterator.
***REMOVED***
***REMOVED*** @param {goog.iter.Iterable} iterable The iterator to iterate over.
***REMOVED*** @param {function(this:T,?,undefined,?):boolean} f The function to call for
***REMOVED***     every element. This function
***REMOVED***     takes 3 arguments (the element, undefined, and the iterator) and should
***REMOVED***     return a boolean.  If the return value is true the element will be
***REMOVED***     included  in the returned iteror.  If it is false the element is not
***REMOVED***     included.
***REMOVED*** @param {T=} opt_obj The object to be used as the value of 'this' within
***REMOVED***     {@code f}.
***REMOVED*** @return {!goog.iter.Iterator} A new iterator in which only elements that
***REMOVED***     passed the test are present.
***REMOVED*** @template T
***REMOVED***
goog.iter.filter = function(iterable, f, opt_obj) {
  var iterator = goog.iter.toIterator(iterable);
  var newIter = new goog.iter.Iterator;
  newIter.next = function() {
    while (true) {
      var val = iterator.next();
      if (f.call(opt_obj, val, undefined, iterator)) {
        return val;
      }
    }
 ***REMOVED*****REMOVED***
  return newIter;
***REMOVED***


***REMOVED***
***REMOVED*** Creates a new iterator that returns the values in a range.  This function
***REMOVED*** can take 1, 2 or 3 arguments:
***REMOVED*** <pre>
***REMOVED*** range(5) same as range(0, 5, 1)
***REMOVED*** range(2, 5) same as range(2, 5, 1)
***REMOVED*** </pre>
***REMOVED***
***REMOVED*** @param {number} startOrStop  The stop value if only one argument is provided.
***REMOVED***     The start value if 2 or more arguments are provided.  If only one
***REMOVED***     argument is used the start value is 0.
***REMOVED*** @param {number=} opt_stop  The stop value.  If left out then the first
***REMOVED***     argument is used as the stop value.
***REMOVED*** @param {number=} opt_step  The number to increment with between each call to
***REMOVED***     next.  This can be negative.
***REMOVED*** @return {!goog.iter.Iterator} A new iterator that returns the values in the
***REMOVED***     range.
***REMOVED***
goog.iter.range = function(startOrStop, opt_stop, opt_step) {
  var start = 0;
  var stop = startOrStop;
  var step = opt_step || 1;
  if (arguments.length > 1) {
    start = startOrStop;
    stop = opt_stop;
  }
  if (step == 0) {
    throw Error('Range step argument must not be zero');
  }

  var newIter = new goog.iter.Iterator;
  newIter.next = function() {
    if (step > 0 && start >= stop || step < 0 && start <= stop) {
      throw goog.iter.StopIteration;
    }
    var rv = start;
    start += step;
    return rv;
 ***REMOVED*****REMOVED***
  return newIter;
***REMOVED***


***REMOVED***
***REMOVED*** Joins the values in a iterator with a delimiter.
***REMOVED*** @param {goog.iter.Iterable} iterable  The iterator to get the values from.
***REMOVED*** @param {string} deliminator  The text to put between the values.
***REMOVED*** @return {string} The joined value string.
***REMOVED***
goog.iter.join = function(iterable, deliminator) {
  return goog.iter.toArray(iterable).join(deliminator);
***REMOVED***


***REMOVED***
***REMOVED*** For every element in the iterator call a function and return a new iterator
***REMOVED*** with that value.
***REMOVED***
***REMOVED*** @param {goog.iter.Iterable} iterable The iterator to iterate over.
***REMOVED*** @param {function(this:T,?,undefined,?):?} f The function to call for every
***REMOVED***     element.  This function
***REMOVED***     takes 3 arguments (the element, undefined, and the iterator) and should
***REMOVED***     return a new value.
***REMOVED*** @param {T=} opt_obj The object to be used as the value of 'this' within
***REMOVED***     {@code f}.
***REMOVED*** @return {!goog.iter.Iterator} A new iterator that returns the results of
***REMOVED***     applying the function to each element in the original iterator.
***REMOVED*** @template T
***REMOVED***
goog.iter.map = function(iterable, f, opt_obj) {
  var iterator = goog.iter.toIterator(iterable);
  var newIter = new goog.iter.Iterator;
  newIter.next = function() {
    while (true) {
      var val = iterator.next();
      return f.call(opt_obj, val, undefined, iterator);
    }
 ***REMOVED*****REMOVED***
  return newIter;
***REMOVED***


***REMOVED***
***REMOVED*** Passes every element of an iterator into a function and accumulates the
***REMOVED*** result.
***REMOVED***
***REMOVED*** @param {goog.iter.Iterable} iterable The iterator to iterate over.
***REMOVED*** @param {function(this:T,V,?):V} f The function to call for every
***REMOVED***     element. This function takes 2 arguments (the function's previous result
***REMOVED***     or the initial value, and the value of the current element).
***REMOVED***     function(previousValue, currentElement) : newValue.
***REMOVED*** @param {V} val The initial value to pass into the function on the first call.
***REMOVED*** @param {T=} opt_obj  The object to be used as the value of 'this'
***REMOVED***     within f.
***REMOVED*** @return {V} Result of evaluating f repeatedly across the values of
***REMOVED***     the iterator.
***REMOVED*** @template T,V
***REMOVED***
goog.iter.reduce = function(iterable, f, val, opt_obj) {
  var rval = val;
  goog.iter.forEach(iterable, function(val) {
    rval = f.call(opt_obj, rval, val);
  });
  return rval;
***REMOVED***


***REMOVED***
***REMOVED*** Goes through the values in the iterator. Calls f for each these and if any of
***REMOVED*** them returns true, this returns true (without checking the rest). If all
***REMOVED*** return false this will return false.
***REMOVED***
***REMOVED*** @param {goog.iter.Iterable} iterable  The iterator object.
***REMOVED*** @param {function(this:T,?,undefined,?):boolean} f  The function to call for
***REMOVED***     every value. This function
***REMOVED***     takes 3 arguments (the value, undefined, and the iterator) and should
***REMOVED***     return a boolean.
***REMOVED*** @param {T=} opt_obj The object to be used as the value of 'this' within
***REMOVED***     {@code f}.
***REMOVED*** @return {boolean} true if any value passes the test.
***REMOVED*** @template T
***REMOVED***
goog.iter.some = function(iterable, f, opt_obj) {
  iterable = goog.iter.toIterator(iterable);
 ***REMOVED*****REMOVED*** @preserveTry***REMOVED***
  try {
    while (true) {
      if (f.call(opt_obj, iterable.next(), undefined, iterable)) {
        return true;
      }
    }
  } catch (ex) {
    if (ex !== goog.iter.StopIteration) {
      throw ex;
    }
  }
  return false;
***REMOVED***


***REMOVED***
***REMOVED*** Goes through the values in the iterator. Calls f for each these and if any of
***REMOVED*** them returns false this returns false (without checking the rest). If all
***REMOVED*** return true this will return true.
***REMOVED***
***REMOVED*** @param {goog.iter.Iterable} iterable  The iterator object.
***REMOVED*** @param {function(this:T,?,undefined,?):boolean} f  The function to call for
***REMOVED***     every value. This function
***REMOVED***     takes 3 arguments (the value, undefined, and the iterator) and should
***REMOVED***     return a boolean.
***REMOVED*** @param {T=} opt_obj The object to be used as the value of 'this' within
***REMOVED***     {@code f}.
***REMOVED*** @return {boolean} true if every value passes the test.
***REMOVED*** @template T
***REMOVED***
goog.iter.every = function(iterable, f, opt_obj) {
  iterable = goog.iter.toIterator(iterable);
 ***REMOVED*****REMOVED*** @preserveTry***REMOVED***
  try {
    while (true) {
      if (!f.call(opt_obj, iterable.next(), undefined, iterable)) {
        return false;
      }
    }
  } catch (ex) {
    if (ex !== goog.iter.StopIteration) {
      throw ex;
    }
  }
  return true;
***REMOVED***


***REMOVED***
***REMOVED*** Takes zero or more iterators and returns one iterator that will iterate over
***REMOVED*** them in the order chained.
***REMOVED*** @param {...goog.iter.Iterator} var_args  Any number of iterator objects.
***REMOVED*** @return {!goog.iter.Iterator} Returns a new iterator that will iterate over
***REMOVED***     all the given iterators' contents.
***REMOVED***
goog.iter.chain = function(var_args) {
  var args = arguments;
  var length = args.length;
  var i = 0;
  var newIter = new goog.iter.Iterator;

 ***REMOVED*****REMOVED***
  ***REMOVED*** @return {*} The next item in the iteration.
  ***REMOVED*** @this {goog.iter.Iterator}
 ***REMOVED*****REMOVED***
  newIter.next = function() {
   ***REMOVED*****REMOVED*** @preserveTry***REMOVED***
    try {
      if (i >= length) {
        throw goog.iter.StopIteration;
      }
      var current = goog.iter.toIterator(args[i]);
      return current.next();
    } catch (ex) {
      if (ex !== goog.iter.StopIteration || i >= length) {
        throw ex;
      } else {
        // In case we got a StopIteration increment counter and try again.
        i++;
        return this.next();
      }
    }
 ***REMOVED*****REMOVED***

  return newIter;
***REMOVED***


***REMOVED***
***REMOVED*** Builds a new iterator that iterates over the original, but skips elements as
***REMOVED*** long as a supplied function returns true.
***REMOVED*** @param {goog.iter.Iterable} iterable  The iterator object.
***REMOVED*** @param {function(this:T,?,undefined,?):boolean} f  The function to call for
***REMOVED***     every value. This function
***REMOVED***     takes 3 arguments (the value, undefined, and the iterator) and should
***REMOVED***     return a boolean.
***REMOVED*** @param {T=} opt_obj The object to be used as the value of 'this' within
***REMOVED***     {@code f}.
***REMOVED*** @return {!goog.iter.Iterator} A new iterator that drops elements from the
***REMOVED***     original iterator as long as {@code f} is true.
***REMOVED*** @template T
***REMOVED***
goog.iter.dropWhile = function(iterable, f, opt_obj) {
  var iterator = goog.iter.toIterator(iterable);
  var newIter = new goog.iter.Iterator;
  var dropping = true;
  newIter.next = function() {
    while (true) {
      var val = iterator.next();
      if (dropping && f.call(opt_obj, val, undefined, iterator)) {
        continue;
      } else {
        dropping = false;
      }
      return val;
    }
 ***REMOVED*****REMOVED***
  return newIter;
***REMOVED***


***REMOVED***
***REMOVED*** Builds a new iterator that iterates over the original, but only as long as a
***REMOVED*** supplied function returns true.
***REMOVED*** @param {goog.iter.Iterable} iterable  The iterator object.
***REMOVED*** @param {function(this:T,?,undefined,?):boolean} f  The function to call for
***REMOVED***     every value. This function
***REMOVED***     takes 3 arguments (the value, undefined, and the iterator) and should
***REMOVED***     return a boolean.
***REMOVED*** @param {T=} opt_obj This is used as the 'this' object in f when called.
***REMOVED*** @return {!goog.iter.Iterator} A new iterator that keeps elements in the
***REMOVED***     original iterator as long as the function is true.
***REMOVED*** @template T
***REMOVED***
goog.iter.takeWhile = function(iterable, f, opt_obj) {
  var iterator = goog.iter.toIterator(iterable);
  var newIter = new goog.iter.Iterator;
  var taking = true;
  newIter.next = function() {
    while (true) {
      if (taking) {
        var val = iterator.next();
        if (f.call(opt_obj, val, undefined, iterator)) {
          return val;
        } else {
          taking = false;
        }
      } else {
        throw goog.iter.StopIteration;
      }
    }
 ***REMOVED*****REMOVED***
  return newIter;
***REMOVED***


***REMOVED***
***REMOVED*** Converts the iterator to an array
***REMOVED*** @param {goog.iter.Iterable} iterable  The iterator to convert to an array.
***REMOVED*** @return {!Array} An array of the elements the iterator iterates over.
***REMOVED***
goog.iter.toArray = function(iterable) {
  // Fast path for array-like.
  if (goog.isArrayLike(iterable)) {
    return goog.array.toArray(***REMOVED*** @type {!goog.array.ArrayLike}***REMOVED***(iterable));
  }
  iterable = goog.iter.toIterator(iterable);
  var array = [];
  goog.iter.forEach(iterable, function(val) {
    array.push(val);
  });
  return array;
***REMOVED***


***REMOVED***
***REMOVED*** Iterates over 2 iterators and returns true if they contain the same sequence
***REMOVED*** of elements and have the same length.
***REMOVED*** @param {goog.iter.Iterable} iterable1  The first iterable object.
***REMOVED*** @param {goog.iter.Iterable} iterable2  The second iterable object.
***REMOVED*** @return {boolean} true if the iterators contain the same sequence of
***REMOVED***     elements and have the same length.
***REMOVED***
goog.iter.equals = function(iterable1, iterable2) {
  iterable1 = goog.iter.toIterator(iterable1);
  iterable2 = goog.iter.toIterator(iterable2);
  var b1, b2;
 ***REMOVED*****REMOVED*** @preserveTry***REMOVED***
  try {
    while (true) {
      b1 = b2 = false;
      var val1 = iterable1.next();
      b1 = true;
      var val2 = iterable2.next();
      b2 = true;
      if (val1 != val2) {
        return false;
      }
    }
  } catch (ex) {
    if (ex !== goog.iter.StopIteration) {
      throw ex;
    } else {
      if (b1 && !b2) {
        // iterable1 done but iterable2 is not done.
        return false;
      }
      if (!b2) {
       ***REMOVED*****REMOVED*** @preserveTry***REMOVED***
        try {
          // iterable2 not done?
          val2 = iterable2.next();
          // iterable2 not done but iterable1 is done
          return false;
        } catch (ex1) {
          if (ex1 !== goog.iter.StopIteration) {
            throw ex1;
          }
          // iterable2 done as well... They are equal
          return true;
        }
      }
    }
  }
  return false;
***REMOVED***


***REMOVED***
***REMOVED*** Advances the iterator to the next position, returning the given default value
***REMOVED*** instead of throwing an exception if the iterator has no more entries.
***REMOVED*** @param {goog.iter.Iterable} iterable The iterable object.
***REMOVED*** @param {*} defaultValue The value to return if the iterator is empty.
***REMOVED*** @return {*} The next item in the iteration, or defaultValue if the iterator
***REMOVED***     was empty.
***REMOVED***
goog.iter.nextOrValue = function(iterable, defaultValue) {
  try {
    return goog.iter.toIterator(iterable).next();
  } catch (e) {
    if (e != goog.iter.StopIteration) {
      throw e;
    }
    return defaultValue;
  }
***REMOVED***


***REMOVED***
***REMOVED*** Cartesian product of zero or more sets.  Gives an iterator that gives every
***REMOVED*** combination of one element chosen from each set.  For example,
***REMOVED*** ([1, 2], [3, 4]) gives ([1, 3], [1, 4], [2, 3], [2, 4]).
***REMOVED*** @see http://docs.python.org/library/itertools.html#itertools.product
***REMOVED*** @param {...!goog.array.ArrayLike.<*>} var_args Zero or more sets, as arrays.
***REMOVED*** @return {!goog.iter.Iterator} An iterator that gives each n-tuple (as an
***REMOVED***     array).
***REMOVED***
goog.iter.product = function(var_args) {
  var someArrayEmpty = goog.array.some(arguments, function(arr) {
    return !arr.length;
  });

  // An empty set in a cartesian product gives an empty set.
  if (someArrayEmpty || !arguments.length) {
    return new goog.iter.Iterator();
  }

  var iter = new goog.iter.Iterator();
  var arrays = arguments;

  // The first indicies are [0, 0, ...]
  var indicies = goog.array.repeat(0, arrays.length);

  iter.next = function() {

    if (indicies) {
      var retVal = goog.array.map(indicies, function(valueIndex, arrayIndex) {
        return arrays[arrayIndex][valueIndex];
      });

      // Generate the next-largest indicies for the next call.
      // Increase the rightmost index. If it goes over, increase the next
      // rightmost (like carry-over addition).
      for (var i = indicies.length - 1; i >= 0; i--) {
        // Assertion prevents compiler warning below.
        goog.asserts.assert(indicies);
        if (indicies[i] < arrays[i].length - 1) {
          indicies[i]++;
          break;
        }

        // We're at the last indicies (the last element of every array), so
        // the iteration is over on the next call.
        if (i == 0) {
          indicies = null;
          break;
        }
        // Reset the index in this column and loop back to increment the
        // next one.
        indicies[i] = 0;
      }
      return retVal;
    }

    throw goog.iter.StopIteration;
 ***REMOVED*****REMOVED***

  return iter;
***REMOVED***


***REMOVED***
***REMOVED*** Create an iterator to cycle over the iterable's elements indefinitely.
***REMOVED*** For example, ([1, 2, 3]) would return : 1, 2, 3, 1, 2, 3, ...
***REMOVED*** @see: http://docs.python.org/library/itertools.html#itertools.cycle.
***REMOVED*** @param {!goog.iter.Iterable} iterable The iterable object.
***REMOVED*** @return {!goog.iter.Iterator} An iterator that iterates indefinitely over
***REMOVED*** the values in {@code iterable}.
***REMOVED***
goog.iter.cycle = function(iterable) {

  var baseIterator = goog.iter.toIterator(iterable);

  // We maintain a cache to store the iterable elements as we iterate
  // over them. The cache is used to return elements once we have
  // iterated over the iterable once.
  var cache = [];
  var cacheIndex = 0;

  var iter = new goog.iter.Iterator();

  // This flag is set after the iterable is iterated over once
  var useCache = false;

  iter.next = function() {
    var returnElement = null;

    // Pull elements off the original iterator if not using cache
    if (!useCache) {
      try {
        // Return the element from the iterable
        returnElement = baseIterator.next();
        cache.push(returnElement);
        return returnElement;
      } catch (e) {
        // If an exception other than StopIteration is thrown
        // or if there are no elements to iterate over (the iterable was empty)
        // throw an exception
        if (e != goog.iter.StopIteration || goog.array.isEmpty(cache)) {
          throw e;
        }
        // set useCache to true after we know that a 'StopIteration' exception
        // was thrown and the cache is not empty (to handle the 'empty iterable'
        // use case)
        useCache = true;
      }
    }

    returnElement = cache[cacheIndex];
    cacheIndex = (cacheIndex + 1) % cache.length;

    return returnElement;
 ***REMOVED*****REMOVED***

  return iter;
***REMOVED***
