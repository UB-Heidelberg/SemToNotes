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
goog.provide('goog.iter.Iterable');
goog.provide('goog.iter.Iterator');
goog.provide('goog.iter.StopIteration');

goog.require('goog.array');
goog.require('goog.asserts');
goog.require('goog.functions');
goog.require('goog.math');


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
***REMOVED*** @template VALUE
***REMOVED***
goog.iter.Iterator = function() {***REMOVED***


***REMOVED***
***REMOVED*** Returns the next value of the iteration.  This will throw the object
***REMOVED*** {@see goog.iter#StopIteration} when the iteration passes the end.
***REMOVED*** @return {VALUE} Any object or value.
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
***REMOVED*** @return {!goog.iter.Iterator.<VALUE>} The object itself.
***REMOVED***
goog.iter.Iterator.prototype.__iterator__ = function(opt_keys) {
  return this;
***REMOVED***


***REMOVED***
***REMOVED*** Returns an iterator that knows how to iterate over the values in the object.
***REMOVED*** @param {goog.iter.Iterator.<VALUE>|goog.iter.Iterable} iterable  If the
***REMOVED***     object is an iterator it will be returned as is.  If the object has an
***REMOVED***     {@code __iterator__} method that will be called to get the value
***REMOVED***     iterator.  If the object is an array-like object we create an iterator
***REMOVED***     for that.
***REMOVED*** @return {!goog.iter.Iterator.<VALUE>} An iterator that knows how to iterate
***REMOVED***     over the values in {@code iterable}.
***REMOVED*** @template VALUE
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
***REMOVED*** @param {goog.iter.Iterator.<VALUE>|goog.iter.Iterable} iterable  The iterator
***REMOVED***     to iterate over. If the iterable is an object {@code toIterator} will be
***REMOVED***     called on it.
***REMOVED*** @param {function(this:THIS,VALUE,undefined,goog.iter.Iterator.<VALUE>)|
***REMOVED***         function(this:THIS,number,undefined,goog.iter.Iterator.<VALUE>)} f
***REMOVED***     The function to call for every element.  This function takes 3 arguments
***REMOVED***     (the element, undefined, and the iterator) and the return value is
***REMOVED***     irrelevant.  The reason for passing undefined as the second argument is
***REMOVED***     so that the same function can be used in {@see goog.array#forEach} as
***REMOVED***     well as others.
***REMOVED*** @param {THIS=} opt_obj  The object to be used as the value of 'this' within
***REMOVED***     {@code f}.
***REMOVED*** @template THIS, VALUE
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
***REMOVED*** @param {goog.iter.Iterator.<VALUE>|goog.iter.Iterable} iterable The iterator
***REMOVED***     to iterate over.
***REMOVED*** @param {
***REMOVED***     function(this:THIS,VALUE,undefined,goog.iter.Iterator.<VALUE>):boolean} f
***REMOVED***     The function to call for every element. This function takes 3 arguments
***REMOVED***     (the element, undefined, and the iterator) and should return a boolean.
***REMOVED***     If the return value is true the element will be included in the returned
***REMOVED***     iterator.  If it is false the element is not included.
***REMOVED*** @param {THIS=} opt_obj The object to be used as the value of 'this' within
***REMOVED***     {@code f}.
***REMOVED*** @return {!goog.iter.Iterator.<VALUE>} A new iterator in which only elements
***REMOVED***     that passed the test are present.
***REMOVED*** @template THIS, VALUE
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
***REMOVED*** Calls a function for every element in the iterator, and if the function
***REMOVED*** returns false adds the element to a new iterator.
***REMOVED***
***REMOVED*** @param {goog.iter.Iterator.<VALUE>|goog.iter.Iterable} iterable The iterator
***REMOVED***     to iterate over.
***REMOVED*** @param {
***REMOVED***     function(this:THIS,VALUE,undefined,goog.iter.Iterator.<VALUE>):boolean} f
***REMOVED***     The function to call for every element. This function takes 3 arguments
***REMOVED***     (the element, undefined, and the iterator) and should return a boolean.
***REMOVED***     If the return value is false the element will be included in the returned
***REMOVED***     iterator.  If it is true the element is not included.
***REMOVED*** @param {THIS=} opt_obj The object to be used as the value of 'this' within
***REMOVED***     {@code f}.
***REMOVED*** @return {!goog.iter.Iterator.<VALUE>} A new iterator in which only elements
***REMOVED***     that did not pass the test are present.
***REMOVED*** @template THIS, VALUE
***REMOVED***
goog.iter.filterFalse = function(iterable, f, opt_obj) {
  return goog.iter.filter(iterable, goog.functions.not(f), opt_obj);
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
***REMOVED*** @return {!goog.iter.Iterator.<number>} A new iterator that returns the values
***REMOVED***     in the range.
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
***REMOVED*** @param {goog.iter.Iterator.<VALUE>|goog.iter.Iterable} iterable The iterator
***REMOVED***     to get the values from.
***REMOVED*** @param {string} deliminator  The text to put between the values.
***REMOVED*** @return {string} The joined value string.
***REMOVED*** @template VALUE
***REMOVED***
goog.iter.join = function(iterable, deliminator) {
  return goog.iter.toArray(iterable).join(deliminator);
***REMOVED***


***REMOVED***
***REMOVED*** For every element in the iterator call a function and return a new iterator
***REMOVED*** with that value.
***REMOVED***
***REMOVED*** @param {!goog.iter.Iterator.<VALUE>|!goog.iter.Iterable} iterable The
***REMOVED***     iterator to iterate over.
***REMOVED*** @param {
***REMOVED***     function(this:THIS,VALUE,undefined,!goog.iter.Iterator.<VALUE>):RESULT} f
***REMOVED***     The function to call for every element.  This function takes 3 arguments
***REMOVED***     (the element, undefined, and the iterator) and should return a new value.
***REMOVED*** @param {THIS=} opt_obj The object to be used as the value of 'this' within
***REMOVED***     {@code f}.
***REMOVED*** @return {!goog.iter.Iterator.<RESULT>} A new iterator that returns the
***REMOVED***     results of applying the function to each element in the original
***REMOVED***     iterator.
***REMOVED*** @template THIS, VALUE, RESULT
***REMOVED***
goog.iter.map = function(iterable, f, opt_obj) {
  var iterator = goog.iter.toIterator(iterable);
  var newIter = new goog.iter.Iterator;
  newIter.next = function() {
    var val = iterator.next();
    return f.call(opt_obj, val, undefined, iterator);
 ***REMOVED*****REMOVED***
  return newIter;
***REMOVED***


***REMOVED***
***REMOVED*** Passes every element of an iterator into a function and accumulates the
***REMOVED*** result.
***REMOVED***
***REMOVED*** @param {goog.iter.Iterator.<VALUE>|goog.iter.Iterable} iterable The iterator
***REMOVED***     to iterate over.
***REMOVED*** @param {function(this:THIS,VALUE,VALUE):VALUE} f The function to call for
***REMOVED***     every element. This function takes 2 arguments (the function's previous
***REMOVED***     result or the initial value, and the value of the current element).
***REMOVED***     function(previousValue, currentElement) : newValue.
***REMOVED*** @param {VALUE} val The initial value to pass into the function on the first
***REMOVED***     call.
***REMOVED*** @param {THIS=} opt_obj  The object to be used as the value of 'this' within
***REMOVED***     f.
***REMOVED*** @return {VALUE} Result of evaluating f repeatedly across the values of
***REMOVED***     the iterator.
***REMOVED*** @template THIS, VALUE
***REMOVED***
goog.iter.reduce = function(iterable, f, val, opt_obj) {
  var rval = val;
  goog.iter.forEach(iterable, function(val) {
    rval = f.call(opt_obj, rval, val);
  });
  return rval;
***REMOVED***


***REMOVED***
***REMOVED*** Goes through the values in the iterator. Calls f for each of these, and if
***REMOVED*** any of them returns true, this returns true (without checking the rest). If
***REMOVED*** all return false this will return false.
***REMOVED***
***REMOVED*** @param {goog.iter.Iterator.<VALUE>|goog.iter.Iterable} iterable The iterator
***REMOVED***     object.
***REMOVED*** @param {
***REMOVED***     function(this:THIS,VALUE,undefined,goog.iter.Iterator.<VALUE>):boolean} f
***REMOVED***     The function to call for every value. This function takes 3 arguments
***REMOVED***     (the value, undefined, and the iterator) and should return a boolean.
***REMOVED*** @param {THIS=} opt_obj The object to be used as the value of 'this' within
***REMOVED***     {@code f}.
***REMOVED*** @return {boolean} true if any value passes the test.
***REMOVED*** @template THIS, VALUE
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
***REMOVED*** Goes through the values in the iterator. Calls f for each of these and if any
***REMOVED*** of them returns false this returns false (without checking the rest). If all
***REMOVED*** return true this will return true.
***REMOVED***
***REMOVED*** @param {goog.iter.Iterator.<VALUE>|goog.iter.Iterable} iterable The iterator
***REMOVED***     object.
***REMOVED*** @param {
***REMOVED***     function(this:THIS,VALUE,undefined,goog.iter.Iterator.<VALUE>):boolean} f
***REMOVED***     The function to call for every value. This function takes 3 arguments
***REMOVED***     (the value, undefined, and the iterator) and should return a boolean.
***REMOVED*** @param {THIS=} opt_obj The object to be used as the value of 'this' within
***REMOVED***     {@code f}.
***REMOVED*** @return {boolean} true if every value passes the test.
***REMOVED*** @template THIS, VALUE
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
***REMOVED*** Takes zero or more iterables and returns one iterator that will iterate over
***REMOVED*** them in the order chained.
***REMOVED*** @param {...!goog.iter.Iterator.<VALUE>|!goog.iter.Iterable} var_args Any
***REMOVED***     number of iterable objects.
***REMOVED*** @return {!goog.iter.Iterator.<VALUE>} Returns a new iterator that will
***REMOVED***     iterate over all the given iterables' contents.
***REMOVED*** @template VALUE
***REMOVED***
goog.iter.chain = function(var_args) {
  var iterator = goog.iter.toIterator(arguments);
  var iter = new goog.iter.Iterator();
  var current = null;

  iter.next = function() {
    while (true) {
      if (current == null) {
        var it = iterator.next();
        current = goog.iter.toIterator(it);
      }
      try {
        return current.next();
      } catch (ex) {
        if (ex !== goog.iter.StopIteration) {
          throw ex;
        }
        current = null;
      }
    }
 ***REMOVED*****REMOVED***

  return iter;
***REMOVED***


***REMOVED***
***REMOVED*** Takes a single iterable containing zero or more iterables and returns one
***REMOVED*** iterator that will iterate over each one in the order given.
***REMOVED*** @see http://docs.python.org/2/library/itertools.html#itertools.chain.from_iterable
***REMOVED*** @param {goog.iter.Iterable} iterable The iterable of iterables to chain.
***REMOVED*** @return {!goog.iter.Iterator.<VALUE>} Returns a new iterator that will
***REMOVED***     iterate over all the contents of the iterables contained within
***REMOVED***     {@code iterable}.
***REMOVED*** @template VALUE
***REMOVED***
goog.iter.chainFromIterable = function(iterable) {
  return goog.iter.chain.apply(undefined, iterable);
***REMOVED***


***REMOVED***
***REMOVED*** Builds a new iterator that iterates over the original, but skips elements as
***REMOVED*** long as a supplied function returns true.
***REMOVED*** @param {goog.iter.Iterator.<VALUE>|goog.iter.Iterable} iterable The iterator
***REMOVED***     object.
***REMOVED*** @param {
***REMOVED***     function(this:THIS,VALUE,undefined,goog.iter.Iterator.<VALUE>):boolean} f
***REMOVED***     The function to call for every value. This function takes 3 arguments
***REMOVED***     (the value, undefined, and the iterator) and should return a boolean.
***REMOVED*** @param {THIS=} opt_obj The object to be used as the value of 'this' within
***REMOVED***     {@code f}.
***REMOVED*** @return {!goog.iter.Iterator.<VALUE>} A new iterator that drops elements from
***REMOVED***     the original iterator as long as {@code f} is true.
***REMOVED*** @template THIS, VALUE
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
***REMOVED*** @param {goog.iter.Iterator.<VALUE>|goog.iter.Iterable} iterable The iterator
***REMOVED***     object.
***REMOVED*** @param {
***REMOVED***     function(this:THIS,VALUE,undefined,goog.iter.Iterator.<VALUE>):boolean} f
***REMOVED***     The function to call for every value. This function takes 3 arguments
***REMOVED***     (the value, undefined, and the iterator) and should return a boolean.
***REMOVED*** @param {THIS=} opt_obj This is used as the 'this' object in f when called.
***REMOVED*** @return {!goog.iter.Iterator.<VALUE>} A new iterator that keeps elements in
***REMOVED***     the original iterator as long as the function is true.
***REMOVED*** @template THIS, VALUE
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
***REMOVED*** @param {goog.iter.Iterator.<VALUE>|goog.iter.Iterable} iterable The iterator
***REMOVED***     to convert to an array.
***REMOVED*** @return {!Array.<VALUE>} An array of the elements the iterator iterates over.
***REMOVED*** @template VALUE
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
***REMOVED*** Iterates over two iterables and returns true if they contain the same
***REMOVED*** sequence of elements and have the same length.
***REMOVED*** @param {!goog.iter.Iterator.<VALUE>|!goog.iter.Iterable} iterable1 The first
***REMOVED***     iterable object.
***REMOVED*** @param {!goog.iter.Iterator.<VALUE>|!goog.iter.Iterable} iterable2 The second
***REMOVED***     iterable object.
***REMOVED*** @return {boolean} true if the iterables contain the same sequence of elements
***REMOVED***     and have the same length.
***REMOVED*** @template VALUE
***REMOVED***
goog.iter.equals = function(iterable1, iterable2) {
  var fillValue = {***REMOVED***
  var pairs = goog.iter.zipLongest(fillValue, iterable1, iterable2);
  return goog.iter.every(pairs, function(pair) {
    return pair[0] == pair[1];
  });
***REMOVED***


***REMOVED***
***REMOVED*** Advances the iterator to the next position, returning the given default value
***REMOVED*** instead of throwing an exception if the iterator has no more entries.
***REMOVED*** @param {goog.iter.Iterator.<VALUE>|goog.iter.Iterable} iterable The iterable
***REMOVED***     object.
***REMOVED*** @param {VALUE} defaultValue The value to return if the iterator is empty.
***REMOVED*** @return {VALUE} The next item in the iteration, or defaultValue if the
***REMOVED***     iterator was empty.
***REMOVED*** @template VALUE
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
***REMOVED*** @param {...!goog.array.ArrayLike.<VALUE>} var_args Zero or more sets, as
***REMOVED***     arrays.
***REMOVED*** @return {!goog.iter.Iterator.<!Array.<VALUE>>} An iterator that gives each
***REMOVED***     n-tuple (as an array).
***REMOVED*** @template VALUE
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

  // The first indices are [0, 0, ...]
  var indicies = goog.array.repeat(0, arrays.length);

  iter.next = function() {

    if (indicies) {
      var retVal = goog.array.map(indicies, function(valueIndex, arrayIndex) {
        return arrays[arrayIndex][valueIndex];
      });

      // Generate the next-largest indices for the next call.
      // Increase the rightmost index. If it goes over, increase the next
      // rightmost (like carry-over addition).
      for (var i = indicies.length - 1; i >= 0; i--) {
        // Assertion prevents compiler warning below.
        goog.asserts.assert(indicies);
        if (indicies[i] < arrays[i].length - 1) {
          indicies[i]++;
          break;
        }

        // We're at the last indices (the last element of every array), so
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
***REMOVED*** @param {!goog.iter.Iterator.<VALUE>|!goog.iter.Iterable} iterable The
***REMOVED***     iterable object.
***REMOVED*** @return {!goog.iter.Iterator.<VALUE>} An iterator that iterates indefinitely
***REMOVED***     over the values in {@code iterable}.
***REMOVED*** @template VALUE
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


***REMOVED***
***REMOVED*** Creates an iterator that counts indefinitely from a starting value.
***REMOVED*** @see http://docs.python.org/2/library/itertools.html#itertools.count
***REMOVED*** @param {number=} opt_start The starting value. Default is 0.
***REMOVED*** @param {number=} opt_step The number to increment with between each call to
***REMOVED***     next. Negative and floating point numbers are allowed. Default is 1.
***REMOVED*** @return {!goog.iter.Iterator.<number>} A new iterator that returns the values
***REMOVED***     in the series.
***REMOVED***
goog.iter.count = function(opt_start, opt_step) {
  var counter = opt_start || 0;
  var step = goog.isDef(opt_step) ? opt_step : 1;
  var iter = new goog.iter.Iterator();

  iter.next = function() {
    var returnValue = counter;
    counter += step;
    return returnValue;
 ***REMOVED*****REMOVED***

  return iter;
***REMOVED***


***REMOVED***
***REMOVED*** Creates an iterator that returns the same object or value repeatedly.
***REMOVED*** @param {VALUE} value Any object or value to repeat.
***REMOVED*** @return {!goog.iter.Iterator.<VALUE>} A new iterator that returns the
***REMOVED***     repeated value.
***REMOVED*** @template VALUE
***REMOVED***
goog.iter.repeat = function(value) {
  var iter = new goog.iter.Iterator();

  iter.next = goog.functions.constant(value);

  return iter;
***REMOVED***


***REMOVED***
***REMOVED*** Creates an iterator that returns running totals from the numbers in
***REMOVED*** {@code iterable}. For example, the array {@code [1, 2, 3, 4, 5]} yields
***REMOVED*** {@code 1 -> 3 -> 6 -> 10 -> 15}.
***REMOVED*** @see http://docs.python.org/3.2/library/itertools.html#itertools.accumulate
***REMOVED*** @param {!goog.iter.Iterable.<number>} iterable The iterable of numbers to
***REMOVED***     accumulate.
***REMOVED*** @return {!goog.iter.Iterator.<number>} A new iterator that returns the
***REMOVED***     numbers in the series.
***REMOVED***
goog.iter.accumulate = function(iterable) {
  var iterator = goog.iter.toIterator(iterable);
  var total = 0;
  var iter = new goog.iter.Iterator();

  iter.next = function() {
    total += iterator.next();
    return total;
 ***REMOVED*****REMOVED***

  return iter;
***REMOVED***


***REMOVED***
***REMOVED*** Creates an iterator that returns arrays containing the ith elements from the
***REMOVED*** provided iterables. The returned arrays will be the same size as the number
***REMOVED*** of iterables given in {@code var_args}. Once the shortest iterable is
***REMOVED*** exhausted, subsequent calls to {@code next()} will throw
***REMOVED*** {@code goog.iter.StopIteration}.
***REMOVED*** @see http://docs.python.org/2/library/itertools.html#itertools.izip
***REMOVED*** @param {...!goog.iter.Iterator.<VALUE>|!goog.iter.Iterable} var_args Any
***REMOVED***     number of iterable objects.
***REMOVED*** @return {!goog.iter.Iterator.<!Array.<VALUE>>} A new iterator that returns
***REMOVED***     arrays of elements from the provided iterables.
***REMOVED*** @template VALUE
***REMOVED***
goog.iter.zip = function(var_args) {
  var args = arguments;
  var iter = new goog.iter.Iterator();

  if (args.length > 0) {
    var iterators = goog.array.map(args, goog.iter.toIterator);
    iter.next = function() {
      var arr = goog.array.map(iterators, function(it) {
        return it.next();
      });
      return arr;
   ***REMOVED*****REMOVED***
  }

  return iter;
***REMOVED***


***REMOVED***
***REMOVED*** Creates an iterator that returns arrays containing the ith elements from the
***REMOVED*** provided iterables. The returned arrays will be the same size as the number
***REMOVED*** of iterables given in {@code var_args}. Shorter iterables will be extended
***REMOVED*** with {@code fillValue}. Once the longest iterable is exhausted, subsequent
***REMOVED*** calls to {@code next()} will throw {@code goog.iter.StopIteration}.
***REMOVED*** @see http://docs.python.org/2/library/itertools.html#itertools.izip_longest
***REMOVED*** @param {VALUE} fillValue The object or value used to fill shorter iterables.
***REMOVED*** @param {...!goog.iter.Iterator.<VALUE>|!goog.iter.Iterable} var_args Any
***REMOVED***     number of iterable objects.
***REMOVED*** @return {!goog.iter.Iterator.<!Array.<VALUE>>} A new iterator that returns
***REMOVED***     arrays of elements from the provided iterables.
***REMOVED*** @template VALUE
***REMOVED***
goog.iter.zipLongest = function(fillValue, var_args) {
  var args = goog.array.slice(arguments, 1);
  var iter = new goog.iter.Iterator();

  if (args.length > 0) {
    var iterators = goog.array.map(args, goog.iter.toIterator);

    iter.next = function() {
      var iteratorsHaveValues = false;  // false when all iterators are empty.
      var arr = goog.array.map(iterators, function(it) {
        var returnValue;
        try {
          returnValue = it.next();
          // Iterator had a value, so we've not exhausted the iterators.
          // Set flag accordingly.
          iteratorsHaveValues = true;
        } catch (ex) {
          if (ex !== goog.iter.StopIteration) {
            throw ex;
          }
          returnValue = fillValue;
        }
        return returnValue;
      });

      if (!iteratorsHaveValues) {
        throw goog.iter.StopIteration;
      }
      return arr;
   ***REMOVED*****REMOVED***
  }

  return iter;
***REMOVED***


***REMOVED***
***REMOVED*** Creates an iterator that filters {@code iterable} based on a series of
***REMOVED*** {@code selectors}. On each call to {@code next()}, one item is taken from
***REMOVED*** both the {@code iterable} and {@code selectors} iterators. If the item from
***REMOVED*** {@code selectors} evaluates to true, the item from {@code iterable} is given.
***REMOVED*** Otherwise, it is skipped. Once either {@code iterable} or {@code selectors}
***REMOVED*** is exhausted, subsequent calls to {@code next()} will throw
***REMOVED*** {@code goog.iter.StopIteration}.
***REMOVED*** @see http://docs.python.org/2/library/itertools.html#itertools.compress
***REMOVED*** @param {!goog.iter.Iterator.<VALUE>|!goog.iter.Iterable} iterable The
***REMOVED***     iterable to filter.
***REMOVED*** @param {!goog.iter.Iterator.<VALUE>|!goog.iter.Iterable} selectors An
***REMOVED***     iterable of items to be evaluated in a boolean context to determine if
***REMOVED***     the corresponding element in {@code iterable} should be included in the
***REMOVED***     result.
***REMOVED*** @return {!goog.iter.Iterator.<VALUE>} A new iterator that returns the
***REMOVED***     filtered values.
***REMOVED*** @template VALUE
***REMOVED***
goog.iter.compress = function(iterable, selectors) {
  var selectorIterator = goog.iter.toIterator(selectors);

  return goog.iter.filter(iterable, function() {
    return !!selectorIterator.next();
  });
***REMOVED***



***REMOVED***
***REMOVED*** Implements the {@code goog.iter.groupBy} iterator.
***REMOVED*** @param {!goog.iter.Iterator.<VALUE>|!goog.iter.Iterable} iterable The
***REMOVED***     iterable to group.
***REMOVED*** @param {function(...[VALUE]): KEY=} opt_keyFunc  Optional function for
***REMOVED***     determining the key value for each group in the {@code iterable}. Default
***REMOVED***     is the identity function.
***REMOVED***
***REMOVED*** @extends {goog.iter.Iterator.<!Array>}
***REMOVED*** @template KEY, VALUE
***REMOVED*** @private
***REMOVED***
goog.iter.GroupByIterator_ = function(iterable, opt_keyFunc) {

 ***REMOVED*****REMOVED***
  ***REMOVED*** The iterable to group, coerced to an iterator.
  ***REMOVED*** @type {!goog.iter.Iterator}
 ***REMOVED*****REMOVED***
  this.iterator = goog.iter.toIterator(iterable);

 ***REMOVED*****REMOVED***
  ***REMOVED*** A function for determining the key value for each element in the iterable.
  ***REMOVED*** If no function is provided, the identity function is used and returns the
  ***REMOVED*** element unchanged.
  ***REMOVED*** @type {function(...[VALUE]): KEY}
 ***REMOVED*****REMOVED***
  this.keyFunc = opt_keyFunc || goog.functions.identity;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The target key for determining the start of a group.
  ***REMOVED*** @type {KEY}
 ***REMOVED*****REMOVED***
  this.targetKey;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The current key visited during iteration.
  ***REMOVED*** @type {KEY}
 ***REMOVED*****REMOVED***
  this.currentKey;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The current value being added to the group.
  ***REMOVED*** @type {VALUE}
 ***REMOVED*****REMOVED***
  this.currentValue;
***REMOVED***
goog.inherits(goog.iter.GroupByIterator_, goog.iter.Iterator);


***REMOVED*** @override***REMOVED***
goog.iter.GroupByIterator_.prototype.next = function() {
  while (this.currentKey == this.targetKey) {
    this.currentValue = this.iterator.next();  // Exits on StopIteration
    this.currentKey = this.keyFunc(this.currentValue);
  }
  this.targetKey = this.currentKey;
  return [this.currentKey, this.groupItems_(this.targetKey)];
***REMOVED***


***REMOVED***
***REMOVED*** Performs the grouping of objects using the given key.
***REMOVED*** @param {KEY} targetKey  The target key object for the group.
***REMOVED*** @return {!Array.<VALUE>} An array of grouped objects.
***REMOVED*** @private
***REMOVED***
goog.iter.GroupByIterator_.prototype.groupItems_ = function(targetKey) {
  var arr = [];
  while (this.currentKey == targetKey) {
    arr.push(this.currentValue);
    try {
      this.currentValue = this.iterator.next();
    } catch (ex) {
      if (ex !== goog.iter.StopIteration) {
        throw ex;
      }
      break;
    }
    this.currentKey = this.keyFunc(this.currentValue);
  }
  return arr;
***REMOVED***


***REMOVED***
***REMOVED*** Creates an iterator that returns arrays containing elements from the
***REMOVED*** {@code iterable} grouped by a key value. For iterables with repeated
***REMOVED*** elements (i.e. sorted according to a particular key function), this function
***REMOVED*** has a {@code uniq}-like effect. For example, grouping the array:
***REMOVED*** {@code [A, B, B, C, C, A]} produces
***REMOVED*** {@code [A, [A]], [B, [B, B]], [C, [C, C]], [A, [A]]}.
***REMOVED*** @see http://docs.python.org/2/library/itertools.html#itertools.groupby
***REMOVED*** @param {!goog.iter.Iterator.<VALUE>|!goog.iter.Iterable} iterable The
***REMOVED***     iterable to group.
***REMOVED*** @param {function(...[VALUE]): KEY=} opt_keyFunc  Optional function for
***REMOVED***     determining the key value for each group in the {@code iterable}. Default
***REMOVED***     is the identity function.
***REMOVED*** @return {!goog.iter.Iterator.<!Array>} A new iterator that returns arrays of
***REMOVED***     consecutive key and groups.
***REMOVED*** @template KEY, VALUE
***REMOVED***
goog.iter.groupBy = function(iterable, opt_keyFunc) {
  return new goog.iter.GroupByIterator_(iterable, opt_keyFunc);
***REMOVED***


***REMOVED***
***REMOVED*** Gives an iterator that gives the result of calling the given function
***REMOVED*** <code>f</code> with the arguments taken from the next element from
***REMOVED*** <code>iterable</code> (the elements are expected to also be iterables).
***REMOVED***
***REMOVED*** Similar to {@see goog.iter#map} but allows the function to accept multiple
***REMOVED*** arguments from the iterable.
***REMOVED***
***REMOVED*** @param {!goog.iter.Iterable.<!goog.iter.Iterable>} iterable The iterable of
***REMOVED***     iterables to iterate over.
***REMOVED*** @param {function(this:THIS,...[*]):RESULT} f The function to call for every
***REMOVED***     element.  This function takes N+2 arguments, where N represents the
***REMOVED***     number of items from the next element of the iterable. The two
***REMOVED***     additional arguments passed to the function are undefined and the
***REMOVED***     iterator itself. The function should return a new value.
***REMOVED*** @param {THIS=} opt_obj The object to be used as the value of 'this' within
***REMOVED***     {@code f}.
***REMOVED*** @return {!goog.iter.Iterator.<RESULT>} A new iterator that returns the
***REMOVED***     results of applying the function to each element in the original
***REMOVED***     iterator.
***REMOVED*** @template THIS, RESULT
***REMOVED***
goog.iter.starMap = function(iterable, f, opt_obj) {
  var iterator = goog.iter.toIterator(iterable);
  var iter = new goog.iter.Iterator();

  iter.next = function() {
    var args = goog.iter.toArray(iterator.next());
    return f.apply(opt_obj, goog.array.concat(args, undefined, iterator));
 ***REMOVED*****REMOVED***

  return iter;
***REMOVED***


***REMOVED***
***REMOVED*** Returns an array of iterators each of which can iterate over the values in
***REMOVED*** {@code iterable} without advancing the others.
***REMOVED*** @see http://docs.python.org/2/library/itertools.html#itertools.tee
***REMOVED*** @param {!goog.iter.Iterator.<VALUE>|!goog.iter.Iterable} iterable The
***REMOVED***     iterable to tee.
***REMOVED*** @param {number=} opt_num  The number of iterators to create. Default is 2.
***REMOVED*** @return {!Array.<goog.iter.Iterator.<VALUE>>} An array of iterators.
***REMOVED*** @template VALUE
***REMOVED***
goog.iter.tee = function(iterable, opt_num) {
  var iterator = goog.iter.toIterator(iterable);
  var num = goog.isNumber(opt_num) ? opt_num : 2;
  var buffers = goog.array.map(goog.array.range(num), function() {
    return [];
  });

  var addNextIteratorValueToBuffers = function() {
    var val = iterator.next();
    goog.array.forEach(buffers, function(buffer) {
      buffer.push(val);
    });
 ***REMOVED*****REMOVED***

  var createIterator = function(buffer) {
    // Each tee'd iterator has an associated buffer (initially empty). When a
    // tee'd iterator's buffer is empty, it calls
    // addNextIteratorValueToBuffers(), adding the next value to all tee'd
    // iterators' buffers, and then returns that value. This allows each
    // iterator to be advanced independently.
    var iter = new goog.iter.Iterator();

    iter.next = function() {
      if (goog.array.isEmpty(buffer)) {
        addNextIteratorValueToBuffers();
      }
      goog.asserts.assert(!goog.array.isEmpty(buffer));
      return buffer.shift();
   ***REMOVED*****REMOVED***

    return iter;
 ***REMOVED*****REMOVED***

  return goog.array.map(buffers, createIterator);
***REMOVED***


***REMOVED***
***REMOVED*** Creates an iterator that returns arrays containing a count and an element
***REMOVED*** obtained from the given {@code iterable}.
***REMOVED*** @see http://docs.python.org/2/library/functions.html#enumerate
***REMOVED*** @param {!goog.iter.Iterator.<VALUE>|!goog.iter.Iterable} iterable The
***REMOVED***     iterable to enumerate.
***REMOVED*** @param {number=} opt_start  Optional starting value. Default is 0.
***REMOVED*** @return {!goog.iter.Iterator.<!Array>} A new iterator containing count/item
***REMOVED***     pairs.
***REMOVED*** @template VALUE
***REMOVED***
goog.iter.enumerate = function(iterable, opt_start) {
  return goog.iter.zip(goog.iter.count(opt_start), iterable);
***REMOVED***


***REMOVED***
***REMOVED*** Creates an iterator that returns the first {@code limitSize} elements from an
***REMOVED*** iterable. If this number is greater than the number of elements in the
***REMOVED*** iterable, all the elements are returned.
***REMOVED*** @see http://goo.gl/V0sihp Inspired by the limit iterator in Guava.
***REMOVED*** @param {!goog.iter.Iterator.<VALUE>|!goog.iter.Iterable} iterable The
***REMOVED***     iterable to limit.
***REMOVED*** @param {number} limitSize  The maximum number of elements to return.
***REMOVED*** @return {!goog.iter.Iterator.<VALUE>} A new iterator containing
***REMOVED***     {@code limitSize} elements.
***REMOVED*** @template VALUE
***REMOVED***
goog.iter.limit = function(iterable, limitSize) {
  goog.asserts.assert(goog.math.isInt(limitSize) && limitSize >= 0);

  var iterator = goog.iter.toIterator(iterable);

  var iter = new goog.iter.Iterator();
  var remaining = limitSize;

  iter.next = function() {
    if (remaining-- > 0) {
      return iterator.next();
    }
    throw goog.iter.StopIteration;
 ***REMOVED*****REMOVED***

  return iter;
***REMOVED***


***REMOVED***
***REMOVED*** Creates an iterator that is advanced {@code count} steps ahead. Consumed
***REMOVED*** values are silently discarded. If {@code count} is greater than the number
***REMOVED*** of elements in {@code iterable}, an empty iterator is returned. Subsequent
***REMOVED*** calls to {@code next()} will throw {@code goog.iter.StopIteration}.
***REMOVED*** @param {!goog.iter.Iterator.<VALUE>|!goog.iter.Iterable} iterable The
***REMOVED***     iterable to consume.
***REMOVED*** @param {number} count  The number of elements to consume from the iterator.
***REMOVED*** @return {!goog.iter.Iterator.<VALUE>} An iterator advanced zero or more steps
***REMOVED***     ahead.
***REMOVED*** @template VALUE
***REMOVED***
goog.iter.consume = function(iterable, count) {
  goog.asserts.assert(goog.math.isInt(count) && count >= 0);

  var iterator = goog.iter.toIterator(iterable);

  while (count-- > 0) {
    goog.iter.nextOrValue(iterator, null);
  }

  return iterator;
***REMOVED***


***REMOVED***
***REMOVED*** Creates an iterator that returns a range of elements from an iterable.
***REMOVED*** Similar to {@see goog.array#slice} but does not support negative indexes.
***REMOVED*** @param {!goog.iter.Iterator.<VALUE>|!goog.iter.Iterable} iterable The
***REMOVED***     iterable to slice.
***REMOVED*** @param {number} start  The index of the first element to return.
***REMOVED*** @param {number=} opt_end  The index after the last element to return. If
***REMOVED***     defined, must be greater than or equal to {@code start}.
***REMOVED*** @return {!goog.iter.Iterator.<VALUE>} A new iterator containing a slice of
***REMOVED***     the original.
***REMOVED*** @template VALUE
***REMOVED***
goog.iter.slice = function(iterable, start, opt_end) {
  goog.asserts.assert(goog.math.isInt(start) && start >= 0);

  var iterator = goog.iter.consume(iterable, start);

  if (goog.isNumber(opt_end)) {
    goog.asserts.assert(
        goog.math.isInt(***REMOVED*** @type {number}***REMOVED*** (opt_end)) && opt_end >= start);
    iterator = goog.iter.limit(iterator, opt_end - start /* limitSize***REMOVED***);
  }

  return iterator;
***REMOVED***


***REMOVED***
***REMOVED*** Checks an array for duplicate elements.
***REMOVED*** @param {Array.<VALUE>|goog.array.ArrayLike} arr The array to check for
***REMOVED***     duplicates.
***REMOVED*** @return {boolean} True, if the array contains duplicates, false otherwise.
***REMOVED*** @private
***REMOVED*** @template VALUE
***REMOVED***
// TODO(user): Consider moving this into goog.array as a public function.
goog.iter.hasDuplicates_ = function(arr) {
  var deduped = [];
  goog.array.removeDuplicates(arr, deduped);
  return arr.length != deduped.length;
***REMOVED***


***REMOVED***
***REMOVED*** Creates an iterator that returns permutations of elements in
***REMOVED*** {@code iterable}.
***REMOVED***
***REMOVED*** Permutations are obtained by taking the Cartesian product of
***REMOVED*** {@code opt_length} iterables and filtering out those with repeated
***REMOVED*** elements. For example, the permutations of {@code [1,2,3]} are
***REMOVED*** {@code [[1,2,3], [1,3,2], [2,1,3], [2,3,1], [3,1,2], [3,2,1]]}.
***REMOVED*** @see http://docs.python.org/2/library/itertools.html#itertools.permutations
***REMOVED*** @param {!goog.iter.Iterator.<VALUE>|!goog.iter.Iterable} iterable The
***REMOVED***     iterable from which to generate permutations.
***REMOVED*** @param {number=} opt_length Length of each permutation. If omitted, defaults
***REMOVED***     to the length of {@code iterable}.
***REMOVED*** @return {!goog.iter.Iterator.<!Array.<VALUE>>} A new iterator containing the
***REMOVED***     permutations of {@code iterable}.
***REMOVED*** @template VALUE
***REMOVED***
goog.iter.permutations = function(iterable, opt_length) {
  var elements = goog.iter.toArray(iterable);
  var length = goog.isNumber(opt_length) ? opt_length : elements.length;

  var sets = goog.array.repeat(elements, length);
  var product = goog.iter.product.apply(undefined, sets);

  return goog.iter.filter(product, function(arr) {
    return !goog.iter.hasDuplicates_(arr);
  });
***REMOVED***


***REMOVED***
***REMOVED*** Creates an iterator that returns combinations of elements from
***REMOVED*** {@code iterable}.
***REMOVED***
***REMOVED*** Combinations are obtained by taking the {@see goog.iter#permutations} of
***REMOVED*** {@code iterable} and filtering those whose elements appear in the order they
***REMOVED*** are encountered in {@code iterable}. For example, the 3-length combinations
***REMOVED*** of {@code [0,1,2,3]} are {@code [[0,1,2], [0,1,3], [0,2,3], [1,2,3]]}.
***REMOVED*** @see http://docs.python.org/2/library/itertools.html#itertools.combinations
***REMOVED*** @param {!goog.iter.Iterator.<VALUE>|!goog.iter.Iterable} iterable The
***REMOVED***     iterable from which to generate combinations.
***REMOVED*** @param {number} length The length of each combination.
***REMOVED*** @return {!goog.iter.Iterator.<!Array.<VALUE>>} A new iterator containing
***REMOVED***     combinations from the {@code iterable}.
***REMOVED*** @template VALUE
***REMOVED***
goog.iter.combinations = function(iterable, length) {
  var elements = goog.iter.toArray(iterable);
  var indexes = goog.iter.range(elements.length);
  var indexIterator = goog.iter.permutations(indexes, length);
  // sortedIndexIterator will now give arrays of with the given length that
  // indicate what indexes into "elements" should be returned on each iteration.
  var sortedIndexIterator = goog.iter.filter(indexIterator, function(arr) {
    return goog.array.isSorted(arr);
  });

  var iter = new goog.iter.Iterator();

  function getIndexFromElements(index) {
    return elements[index];
  }

  iter.next = function() {
    return goog.array.map(
       ***REMOVED*****REMOVED*** @type {!Array.<number>}***REMOVED***
        (sortedIndexIterator.next()), getIndexFromElements);
 ***REMOVED*****REMOVED***

  return iter;
***REMOVED***


***REMOVED***
***REMOVED*** Creates an iterator that returns combinations of elements from
***REMOVED*** {@code iterable}, with repeated elements possible.
***REMOVED***
***REMOVED*** Combinations are obtained by taking the Cartesian product of {@code length}
***REMOVED*** iterables and filtering those whose elements appear in the order they are
***REMOVED*** encountered in {@code iterable}. For example, the 2-length combinations of
***REMOVED*** {@code [1,2,3]} are {@code [[1,1], [1,2], [1,3], [2,2], [2,3], [3,3]]}.
***REMOVED*** @see http://docs.python.org/2/library/itertools.html#itertools.combinations_with_replacement
***REMOVED*** @see http://en.wikipedia.org/wiki/Combination#Number_of_combinations_with_repetition
***REMOVED*** @param {!goog.iter.Iterator.<VALUE>|!goog.iter.Iterable} iterable The
***REMOVED***     iterable to combine.
***REMOVED*** @param {number} length The length of each combination.
***REMOVED*** @return {!goog.iter.Iterator.<!Array.<VALUE>>} A new iterator containing
***REMOVED***     combinations from the {@code iterable}.
***REMOVED*** @template VALUE
***REMOVED***
goog.iter.combinationsWithReplacement = function(iterable, length) {
  var elements = goog.iter.toArray(iterable);
  var indexes = goog.array.range(elements.length);
  var sets = goog.array.repeat(indexes, length);
  var indexIterator = goog.iter.product.apply(undefined, sets);
  // sortedIndexIterator will now give arrays of with the given length that
  // indicate what indexes into "elements" should be returned on each iteration.
  var sortedIndexIterator = goog.iter.filter(indexIterator, function(arr) {
    return goog.array.isSorted(arr);
  });

  var iter = new goog.iter.Iterator();

  function getIndexFromElements(index) {
    return elements[index];
  }

  iter.next = function() {
    return goog.array.map(
       ***REMOVED*****REMOVED*** @type {!Array.<number>}***REMOVED***
        (sortedIndexIterator.next()), getIndexFromElements);
 ***REMOVED*****REMOVED***

  return iter;
***REMOVED***
