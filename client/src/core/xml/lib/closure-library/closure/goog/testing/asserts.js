// Copyright 2010 The Closure Library Authors. All Rights Reserved.
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
goog.provide('goog.testing.JsUnitException');
goog.provide('goog.testing.asserts');

goog.require('goog.testing.stacktrace');

// TODO(user): Copied from JsUnit with some small modifications, we should
// reimplement the asserters.


***REMOVED***
***REMOVED*** @typedef {Array|NodeList|Arguments|{length: number}}
***REMOVED***
goog.testing.asserts.ArrayLike;

var DOUBLE_EQUALITY_PREDICATE = function(var1, var2) {
  return var1 == var2;
***REMOVED***
var JSUNIT_UNDEFINED_VALUE;
var TO_STRING_EQUALITY_PREDICATE = function(var1, var2) {
  return var1.toString() === var2.toString();
***REMOVED***

var PRIMITIVE_EQUALITY_PREDICATES = {
  'String': DOUBLE_EQUALITY_PREDICATE,
  'Number': DOUBLE_EQUALITY_PREDICATE,
  'Boolean': DOUBLE_EQUALITY_PREDICATE,
  'Date': function(date1, date2) {
    return date1.getTime() == date2.getTime();
  },
  'RegExp': TO_STRING_EQUALITY_PREDICATE,
  'Function': TO_STRING_EQUALITY_PREDICATE
***REMOVED***


***REMOVED***
***REMOVED*** Compares equality of two numbers, allowing them to differ up to a given
***REMOVED*** tolerance.
***REMOVED*** @param {number} var1 A number.
***REMOVED*** @param {number} var2 A number.
***REMOVED*** @param {number} tolerance the maximum allowed difference.
***REMOVED*** @return {boolean} Whether the two variables are sufficiently close.
***REMOVED*** @private
***REMOVED***
goog.testing.asserts.numberRoughEqualityPredicate_ = function(
    var1, var2, tolerance) {
  return Math.abs(var1 - var2) <= tolerance;
***REMOVED***


***REMOVED***
***REMOVED*** @type {Object.<string, function(*,***REMOVED***, number): boolean>}
***REMOVED*** @private
***REMOVED***
goog.testing.asserts.primitiveRoughEqualityPredicates_ = {
  'Number': goog.testing.asserts.numberRoughEqualityPredicate_
***REMOVED***


var _trueTypeOf = function(something) {
  var result = typeof something;
  try {
    switch (result) {
      case 'string':
        break;
      case 'boolean':
        break;
      case 'number':
        break;
      case 'object':
        if (something == null) {
          result = 'null';
          break;
        }
      case 'function':
        switch (something.constructor) {
          case new String('').constructor:
            result = 'String';
            break;
          case new Boolean(true).constructor:
            result = 'Boolean';
            break;
          case new Number(0).constructor:
            result = 'Number';
            break;
          case new Array().constructor:
            result = 'Array';
            break;
          case new RegExp().constructor:
            result = 'RegExp';
            break;
          case new Date().constructor:
            result = 'Date';
            break;
          case Function:
            result = 'Function';
            break;
          default:
            var m = something.constructor.toString().match(
                /function\s*([^( ]+)\(/);
            if (m) {
              result = m[1];
            } else {
              break;
            }
        }
        break;
    }
  } catch (e) {

  } finally {
    result = result.substr(0, 1).toUpperCase() + result.substr(1);
  }
  return result;
***REMOVED***

var _displayStringForValue = function(aVar) {
  var result;
  try {
    result = '<' + String(aVar) + '>';
  } catch (ex) {
    result = '<toString failed: ' + ex.message + '>';
    // toString does not work on this object :-(
  }
  if (!(aVar === null || aVar === JSUNIT_UNDEFINED_VALUE)) {
    result += ' (' + _trueTypeOf(aVar) + ')';
  }
  return result;
***REMOVED***

var fail = function(failureMessage) {
  goog.testing.asserts.raiseException('Call to fail()', failureMessage);
***REMOVED***

var argumentsIncludeComments = function(expectedNumberOfNonCommentArgs, args) {
  return args.length == expectedNumberOfNonCommentArgs + 1;
***REMOVED***

var commentArg = function(expectedNumberOfNonCommentArgs, args) {
  if (argumentsIncludeComments(expectedNumberOfNonCommentArgs, args)) {
    return args[0];
  }

  return null;
***REMOVED***

var nonCommentArg = function(desiredNonCommentArgIndex,
    expectedNumberOfNonCommentArgs, args) {
  return argumentsIncludeComments(expectedNumberOfNonCommentArgs, args) ?
      args[desiredNonCommentArgIndex] :
      args[desiredNonCommentArgIndex - 1];
***REMOVED***

var _validateArguments = function(expectedNumberOfNonCommentArgs, args) {
  var valid = args.length == expectedNumberOfNonCommentArgs ||
      args.length == expectedNumberOfNonCommentArgs + 1 &&
      goog.isString(args[0]);
  _assert(null, valid, 'Incorrect arguments passed to assert function');
***REMOVED***

var _assert = function(comment, booleanValue, failureMessage) {
  if (!booleanValue) {
    goog.testing.asserts.raiseException(comment, failureMessage);
  }
***REMOVED***


***REMOVED***
***REMOVED*** @param {*} expected The expected value.
***REMOVED*** @param {*} actual The actual value.
***REMOVED*** @return {string} A failure message of the values don't match.
***REMOVED*** @private
***REMOVED***
goog.testing.asserts.getDefaultErrorMsg_ = function(expected, actual) {
  var msg = 'Expected ' + _displayStringForValue(expected) + ' but was ' +
      _displayStringForValue(actual);
  if ((typeof expected == 'string') && (typeof actual == 'string')) {
    // Try to find a human-readable difference.
    var limit = Math.min(expected.length, actual.length);
    var commonPrefix = 0;
    while (commonPrefix < limit &&
        expected.charAt(commonPrefix) == actual.charAt(commonPrefix)) {
      commonPrefix++;
    }

    var commonSuffix = 0;
    while (commonSuffix < limit &&
        expected.charAt(expected.length - commonSuffix - 1) ==
            actual.charAt(actual.length - commonSuffix - 1)) {
      commonSuffix++;
    }

    if (commonPrefix + commonSuffix > limit) {
      commonSuffix = 0;
    }

    if (commonPrefix > 2 || commonSuffix > 2) {
      var printString = function(str) {
        var startIndex = Math.max(0, commonPrefix - 2);
        var endIndex = Math.min(str.length, str.length - (commonSuffix - 2));
        return (startIndex > 0 ? '...' : '') +
            str.substring(startIndex, endIndex) +
            (endIndex < str.length ? '...' : '');
     ***REMOVED*****REMOVED***

      msg += '\nDifference was at position ' + commonPrefix +
          '. Expected [' + printString(expected) +
          '] vs. actual [' + printString(actual) + ']';
    }
  }
  return msg;
***REMOVED***


***REMOVED***
***REMOVED*** @param {*} a The value to assert (1 arg) or debug message (2 args).
***REMOVED*** @param {*=} opt_b The value to assert (2 args only).
***REMOVED***
var assert = function(a, opt_b) {
  _validateArguments(1, arguments);
  var comment = commentArg(1, arguments);
  var booleanValue = nonCommentArg(1, 1, arguments);

  _assert(comment, goog.isBoolean(booleanValue),
      'Bad argument to assert(boolean)');
  _assert(comment, booleanValue, 'Call to assert(boolean) with false');
***REMOVED***


***REMOVED***
***REMOVED*** Asserts that the function throws an error.
***REMOVED***
***REMOVED*** @param {!(string|Function)} a The assertion comment or the function to call.
***REMOVED*** @param {!Function=} opt_b The function to call (if the first argument of
***REMOVED***     {@code assertThrows} was the comment).
***REMOVED*** @return {*} The error thrown by the function.
***REMOVED*** @throws {goog.testing.JsUnitException} If the assertion failed.
***REMOVED***
var assertThrows = function(a, opt_b) {
  _validateArguments(1, arguments);
  var func = nonCommentArg(1, 1, arguments);
  var comment = commentArg(1, arguments);
  _assert(comment, typeof func == 'function',
      'Argument passed to assertThrows is not a function');

  try {
    func();
  } catch (e) {
    if (e && goog.isString(e['stacktrace']) && goog.isString(e['message'])) {
      // Remove the stack trace appended to the error message by Opera 10.0
      var startIndex = e['message'].length - e['stacktrace'].length;
      if (e['message'].indexOf(e['stacktrace'], startIndex) == startIndex) {
        e['message'] = e['message'].substr(0, startIndex - 14);
      }
    }
    return e;
  }
  goog.testing.asserts.raiseException(comment,
      'No exception thrown from function passed to assertThrows');
***REMOVED***


***REMOVED***
***REMOVED*** Asserts that the function does not throw an error.
***REMOVED***
***REMOVED*** @param {!(string|Function)} a The assertion comment or the function to call.
***REMOVED*** @param {!Function=} opt_b The function to call (if the first argument of
***REMOVED***     {@code assertNotThrows} was the comment).
***REMOVED*** @return {*} The return value of the function.
***REMOVED*** @throws {goog.testing.JsUnitException} If the assertion failed.
***REMOVED***
var assertNotThrows = function(a, opt_b) {
  _validateArguments(1, arguments);
  var comment = commentArg(1, arguments);
  var func = nonCommentArg(1, 1, arguments);
  _assert(comment, typeof func == 'function',
      'Argument passed to assertNotThrows is not a function');

  try {
    return func();
  } catch (e) {
    comment = comment ? (comment + '\n') : '';
    comment += 'A non expected exception was thrown from function passed to ' +
               'assertNotThrows';
    // Some browsers don't have a stack trace so at least have the error
    // description.
    var stackTrace = e['stack'] || e['stacktrace'] || e.toString();
    goog.testing.asserts.raiseException(comment, stackTrace);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Asserts that the given callback function results in a JsUnitException when
***REMOVED*** called, and that the resulting failure message matches the given expected
***REMOVED*** message.
***REMOVED*** @param {function() : void} callback Function to be run expected to result
***REMOVED***     in a JsUnitException (usually contains a call to an assert).
***REMOVED*** @param {string=} opt_expectedMessage Failure message expected to be given
***REMOVED***     with the exception.
***REMOVED***
var assertThrowsJsUnitException = function(callback, opt_expectedMessage) {
  var failed = false;
  try {
    goog.testing.asserts.callWithoutLogging(callback);
  } catch (ex) {
    if (!ex.isJsUnitException) {
      fail('Expected a JsUnitException');
    }
    if (typeof opt_expectedMessage != 'undefined' &&
        ex.message != opt_expectedMessage) {
      fail('Expected message [' + opt_expectedMessage + '] but got [' +
          ex.message + ']');
    }
    failed = true;
  }
  if (!failed) {
    fail('Expected a failure: ' + opt_expectedMessage);
  }
***REMOVED***


***REMOVED***
***REMOVED*** @param {*} a The value to assert (1 arg) or debug message (2 args).
***REMOVED*** @param {*=} opt_b The value to assert (2 args only).
***REMOVED***
var assertTrue = function(a, opt_b) {
  _validateArguments(1, arguments);
  var comment = commentArg(1, arguments);
  var booleanValue = nonCommentArg(1, 1, arguments);

  _assert(comment, goog.isBoolean(booleanValue),
      'Bad argument to assertTrue(boolean)');
  _assert(comment, booleanValue, 'Call to assertTrue(boolean) with false');
***REMOVED***


***REMOVED***
***REMOVED*** @param {*} a The value to assert (1 arg) or debug message (2 args).
***REMOVED*** @param {*=} opt_b The value to assert (2 args only).
***REMOVED***
var assertFalse = function(a, opt_b) {
  _validateArguments(1, arguments);
  var comment = commentArg(1, arguments);
  var booleanValue = nonCommentArg(1, 1, arguments);

  _assert(comment, goog.isBoolean(booleanValue),
      'Bad argument to assertFalse(boolean)');
  _assert(comment, !booleanValue, 'Call to assertFalse(boolean) with true');
***REMOVED***


***REMOVED***
***REMOVED*** @param {*} a The expected value (2 args) or the debug message (3 args).
***REMOVED*** @param {*} b The actual value (2 args) or the expected value (3 args).
***REMOVED*** @param {*=} opt_c The actual value (3 args only).
***REMOVED***
var assertEquals = function(a, b, opt_c) {
  _validateArguments(2, arguments);
  var var1 = nonCommentArg(1, 2, arguments);
  var var2 = nonCommentArg(2, 2, arguments);
  _assert(commentArg(2, arguments), var1 === var2,
          goog.testing.asserts.getDefaultErrorMsg_(var1, var2));
***REMOVED***


***REMOVED***
***REMOVED*** @param {*} a The expected value (2 args) or the debug message (3 args).
***REMOVED*** @param {*} b The actual value (2 args) or the expected value (3 args).
***REMOVED*** @param {*=} opt_c The actual value (3 args only).
***REMOVED***
var assertNotEquals = function(a, b, opt_c) {
  _validateArguments(2, arguments);
  var var1 = nonCommentArg(1, 2, arguments);
  var var2 = nonCommentArg(2, 2, arguments);
  _assert(commentArg(2, arguments), var1 !== var2,
      'Expected not to be ' + _displayStringForValue(var2));
***REMOVED***


***REMOVED***
***REMOVED*** @param {*} a The value to assert (1 arg) or debug message (2 args).
***REMOVED*** @param {*=} opt_b The value to assert (2 args only).
***REMOVED***
var assertNull = function(a, opt_b) {
  _validateArguments(1, arguments);
  var aVar = nonCommentArg(1, 1, arguments);
  _assert(commentArg(1, arguments), aVar === null,
      goog.testing.asserts.getDefaultErrorMsg_(null, aVar));
***REMOVED***


***REMOVED***
***REMOVED*** @param {*} a The value to assert (1 arg) or debug message (2 args).
***REMOVED*** @param {*=} opt_b The value to assert (2 args only).
***REMOVED***
var assertNotNull = function(a, opt_b) {
  _validateArguments(1, arguments);
  var aVar = nonCommentArg(1, 1, arguments);
  _assert(commentArg(1, arguments), aVar !== null,
      'Expected not to be ' + _displayStringForValue(null));
***REMOVED***


***REMOVED***
***REMOVED*** @param {*} a The value to assert (1 arg) or debug message (2 args).
***REMOVED*** @param {*=} opt_b The value to assert (2 args only).
***REMOVED***
var assertUndefined = function(a, opt_b) {
  _validateArguments(1, arguments);
  var aVar = nonCommentArg(1, 1, arguments);
  _assert(commentArg(1, arguments), aVar === JSUNIT_UNDEFINED_VALUE,
      goog.testing.asserts.getDefaultErrorMsg_(JSUNIT_UNDEFINED_VALUE, aVar));
***REMOVED***


***REMOVED***
***REMOVED*** @param {*} a The value to assert (1 arg) or debug message (2 args).
***REMOVED*** @param {*=} opt_b The value to assert (2 args only).
***REMOVED***
var assertNotUndefined = function(a, opt_b) {
  _validateArguments(1, arguments);
  var aVar = nonCommentArg(1, 1, arguments);
  _assert(commentArg(1, arguments), aVar !== JSUNIT_UNDEFINED_VALUE,
      'Expected not to be ' + _displayStringForValue(JSUNIT_UNDEFINED_VALUE));
***REMOVED***


***REMOVED***
***REMOVED*** @param {*} a The value to assert (1 arg) or debug message (2 args).
***REMOVED*** @param {*=} opt_b The value to assert (2 args only).
***REMOVED***
var assertNotNullNorUndefined = function(a, opt_b) {
  _validateArguments(1, arguments);
  assertNotNull.apply(null, arguments);
  assertNotUndefined.apply(null, arguments);
***REMOVED***


***REMOVED***
***REMOVED*** @param {*} a The value to assert (1 arg) or debug message (2 args).
***REMOVED*** @param {*=} opt_b The value to assert (2 args only).
***REMOVED***
var assertNonEmptyString = function(a, opt_b) {
  _validateArguments(1, arguments);
  var aVar = nonCommentArg(1, 1, arguments);
  _assert(commentArg(1, arguments),
      aVar !== JSUNIT_UNDEFINED_VALUE && aVar !== null &&
      typeof aVar == 'string' && aVar !== '',
      'Expected non-empty string but was ' + _displayStringForValue(aVar));
***REMOVED***


***REMOVED***
***REMOVED*** @param {*} a The value to assert (1 arg) or debug message (2 args).
***REMOVED*** @param {*=} opt_b The value to assert (2 args only).
***REMOVED***
var assertNaN = function(a, opt_b) {
  _validateArguments(1, arguments);
  var aVar = nonCommentArg(1, 1, arguments);
  _assert(commentArg(1, arguments), isNaN(aVar), 'Expected NaN');
***REMOVED***


***REMOVED***
***REMOVED*** @param {*} a The value to assert (1 arg) or debug message (2 args).
***REMOVED*** @param {*=} opt_b The value to assert (2 args only).
***REMOVED***
var assertNotNaN = function(a, opt_b) {
  _validateArguments(1, arguments);
  var aVar = nonCommentArg(1, 1, arguments);
  _assert(commentArg(1, arguments), !isNaN(aVar), 'Expected not NaN');
***REMOVED***


***REMOVED***
***REMOVED*** Runs a function in an environment where test failures are not logged. This is
***REMOVED*** useful for testing test code, where failures can be a normal part of a test.
***REMOVED*** @param {function() : void} fn Function to run without logging failures.
***REMOVED***
goog.testing.asserts.callWithoutLogging = function(fn) {
  var testRunner = goog.global['G_testRunner'];
  var oldLogTestFailure = testRunner['logTestFailure'];
  try {
    // Any failures in the callback shouldn't be recorded.
    testRunner['logTestFailure'] = undefined;
    fn();
  } finally {
    testRunner['logTestFailure'] = oldLogTestFailure;
  }
***REMOVED***


***REMOVED***
***REMOVED*** The return value of the equality predicate passed to findDifferences below,
***REMOVED*** in cases where the predicate can't test the input variables for equality.
***REMOVED*** @type {?string}
***REMOVED***
goog.testing.asserts.EQUALITY_PREDICATE_CANT_PROCESS = null;


***REMOVED***
***REMOVED*** The return value of the equality predicate passed to findDifferences below,
***REMOVED*** in cases where the input vriables are equal.
***REMOVED*** @type {?string}
***REMOVED***
goog.testing.asserts.EQUALITY_PREDICATE_VARS_ARE_EQUAL = '';


***REMOVED***
***REMOVED*** Determines if two items of any type match, and formulates an error message
***REMOVED*** if not.
***REMOVED*** @param {*} expected Expected argument to match.
***REMOVED*** @param {*} actual Argument as a result of performing the test.
***REMOVED*** @param {(function(string,***REMOVED***,***REMOVED***): ?string)=} opt_equalityPredicate An optional
***REMOVED***     function that can be used to check equality of variables. It accepts 3
***REMOVED***     arguments: type-of-variables, var1, var2 (in that order) and returns an
***REMOVED***     error message if the variables are not equal,
***REMOVED***     goog.testing.asserts.EQUALITY_PREDICATE_VARS_ARE_EQUAL if the variables
***REMOVED***     are equal, or
***REMOVED***     goog.testing.asserts.EQUALITY_PREDICATE_CANT_PROCESS if the predicate
***REMOVED***     couldn't check the input variables. The function will be called only if
***REMOVED***     the types of var1 and var2 are identical.
***REMOVED*** @return {?string} Null on success, error message on failure.
***REMOVED***
goog.testing.asserts.findDifferences = function(expected, actual,
    opt_equalityPredicate) {
  var failures = [];
  var seen1 = [];
  var seen2 = [];

  // To avoid infinite recursion when the two parameters are self-referential
  // along the same path of properties, keep track of the object pairs already
  // seen in this call subtree, and abort when a cycle is detected.
  // TODO(gboyer,user): The algorithm still does not terminate in cases
  // with exponential recursion, e.g. a binary tree with leaf->root links.
  // Investigate ways to solve this without significant performance loss
  // for the common case.
  function innerAssert(var1, var2, path) {
    var depth = seen1.length;
    if (depth % 2) {
      // Compare with midpoint of seen ("Tortoise and hare" loop detection).
      // http://en.wikipedia.org/wiki/Cycle_detection#Tortoise_and_hare
      // TODO(gboyer,user): For cases with complex cycles the algorithm
      // can take a long time to terminate, look into ways to terminate sooner
      // without adding more than constant-time work in non-cycle cases.
      var mid = depth >> 1;
      // Use === to avoid cases like ['x'] == 'x', which is true.
      var match1 = seen1[mid] === var1;
      var match2 = seen2[mid] === var2;
      if (match1 || match2) {
        if (!match1 || !match2) {
          // Asymmetric cycles, so the objects have different structure.
          failures.push('Asymmetric cycle detected at ' + path);
        }
        return;
      }
    }
    seen1.push(var1);
    seen2.push(var2);
    innerAssert_(var1, var2, path);
    seen1.pop();
    seen2.pop();
  }

  var equalityPredicate = opt_equalityPredicate || function(type, var1, var2) {
    var typedPredicate = PRIMITIVE_EQUALITY_PREDICATES[type];
    if (!typedPredicate) {
      return goog.testing.asserts.EQUALITY_PREDICATE_CANT_PROCESS;
    }
    var equal = typedPredicate(var1, var2);
    return equal ? goog.testing.asserts.EQUALITY_PREDICATE_VARS_ARE_EQUAL :
        goog.testing.asserts.getDefaultErrorMsg_(var1, var2);
 ***REMOVED*****REMOVED***

 ***REMOVED*****REMOVED***
  ***REMOVED*** @param {*} var1 An item in the expected object.
  ***REMOVED*** @param {*} var2 The corresponding item in the actual object.
  ***REMOVED*** @param {string} path Their path in the objects.
  ***REMOVED*** @suppress {missingProperties} The map_ property is unknown to the compiler
  ***REMOVED***     unless goog.structs.Map is loaded.
 ***REMOVED*****REMOVED***
  function innerAssert_(var1, var2, path) {
    if (var1 === var2) {
      return;
    }

    var typeOfVar1 = _trueTypeOf(var1);
    var typeOfVar2 = _trueTypeOf(var2);

    if (typeOfVar1 == typeOfVar2) {
      var isArray = typeOfVar1 == 'Array';
      var errorMessage = equalityPredicate(typeOfVar1, var1, var2);
      if (errorMessage !=
          goog.testing.asserts.EQUALITY_PREDICATE_CANT_PROCESS) {
        if (errorMessage !=
            goog.testing.asserts.EQUALITY_PREDICATE_VARS_ARE_EQUAL) {
          failures.push(path + ': ' + errorMessage);
        }
      } else if (isArray && var1.length != var2.length) {
        failures.push(path + ': Expected ' + var1.length + '-element array ' +
                      'but got a ' + var2.length + '-element array');
      } else {
        var childPath = path + (isArray ? '[%s]' : (path ? '.%s' : '%s'));

        // if an object has an __iterator__ property, we have no way of
        // actually inspecting its raw properties, and JS 1.7 doesn't
        // overload [] to make it possible for someone to generically
        // use what the iterator returns to compare the object-managed
        // properties. This gets us into deep poo with things like
        // goog.structs.Map, at least on systems that support iteration.
        if (!var1['__iterator__']) {
          for (var prop in var1) {
            if (isArray && goog.testing.asserts.isArrayIndexProp_(prop)) {
              // Skip array indices for now. We'll handle them later.
              continue;
            }

            if (prop in var2) {
              innerAssert(var1[prop], var2[prop],
                          childPath.replace('%s', prop));
            } else {
              failures.push('property ' + prop +
                            ' not present in actual ' + (path || typeOfVar2));
            }
          }
          // make sure there aren't properties in var2 that are missing
          // from var1. if there are, then by definition they don't
          // match.
          for (var prop in var2) {
            if (isArray && goog.testing.asserts.isArrayIndexProp_(prop)) {
              // Skip array indices for now. We'll handle them later.
              continue;
            }

            if (!(prop in var1)) {
              failures.push('property ' + prop +
                            ' not present in expected ' +
                            (path || typeOfVar1));
            }
          }

          // Handle array indices by iterating from 0 to arr.length.
          //
          // Although all browsers allow holes in arrays, browsers
          // are inconsistent in what they consider a hole. For example,
          // "[0,undefined,2]" has a hole on IE but not on Firefox.
          //
          // Because our style guide bans for...in iteration over arrays,
          // we assume that most users don't care about holes in arrays,
          // and that it is ok to say that a hole is equivalent to a slot
          // populated with 'undefined'.
          if (isArray) {
            for (prop = 0; prop < var1.length; prop++) {
              innerAssert(var1[prop], var2[prop],
                          childPath.replace('%s', String(prop)));
            }
          }
        } else {
          // special-case for closure objects that have iterators
          if (goog.isFunction(var1.equals)) {
            // use the object's own equals function, assuming it accepts an
            // object and returns a boolean
            if (!var1.equals(var2)) {
              failures.push('equals() returned false for ' +
                            (path || typeOfVar1));
            }
          } else if (var1.map_) {
            // assume goog.structs.Map or goog.structs.Set, where comparing
            // their private map_ field is sufficient
            innerAssert(var1.map_, var2.map_, childPath.replace('%s', 'map_'));
          } else {
            // else die, so user knows we can't do anything
            failures.push('unable to check ' + (path || typeOfVar1) +
                          ' for equality: it has an iterator we do not ' +
                          'know how to handle. please add an equals method');
          }
        }
      }
    } else {
      failures.push(path + ' ' +
          goog.testing.asserts.getDefaultErrorMsg_(var1, var2));
    }
  }

  innerAssert(expected, actual, '');
  return failures.length == 0 ? null :
      goog.testing.asserts.getDefaultErrorMsg_(expected, actual) +
          '\n   ' + failures.join('\n   ');
***REMOVED***


***REMOVED***
***REMOVED*** Notes:
***REMOVED*** Object equality has some nasty browser quirks, and this implementation is
***REMOVED*** not 100% correct. For example,
***REMOVED***
***REMOVED*** <code>
***REMOVED*** var a = [0, 1, 2];
***REMOVED*** var b = [0, 1, 2];
***REMOVED*** delete a[1];
***REMOVED*** b[1] = undefined;
***REMOVED*** assertObjectEquals(a, b); // should fail, but currently passes
***REMOVED*** </code>
***REMOVED***
***REMOVED*** See asserts_test.html for more interesting edge cases.
***REMOVED***
***REMOVED*** The first comparison object provided is the expected value, the second is
***REMOVED*** the actual.
***REMOVED***
***REMOVED*** @param {*} a Assertion message or comparison object.
***REMOVED*** @param {*} b Comparison object.
***REMOVED*** @param {*=} opt_c Comparison object, if an assertion message was provided.
***REMOVED***
var assertObjectEquals = function(a, b, opt_c) {
  _validateArguments(2, arguments);
  var v1 = nonCommentArg(1, 2, arguments);
  var v2 = nonCommentArg(2, 2, arguments);
  var failureMessage = commentArg(2, arguments) ? commentArg(2, arguments) : '';
  var differences = goog.testing.asserts.findDifferences(v1, v2);

  _assert(failureMessage, !differences, differences);
***REMOVED***


***REMOVED***
***REMOVED*** Similar to assertObjectEquals above, but accepts a tolerance margin.
***REMOVED***
***REMOVED*** @param {*} a Assertion message or comparison object.
***REMOVED*** @param {*} b Comparison object.
***REMOVED*** @param {*} c Comparison object or tolerance.
***REMOVED*** @param {*=} opt_d Tolerance, if an assertion message was provided.
***REMOVED***
var assertObjectRoughlyEquals = function(a, b, c, opt_d) {
  _validateArguments(3, arguments);
  var v1 = nonCommentArg(1, 3, arguments);
  var v2 = nonCommentArg(2, 3, arguments);
  var tolerance = nonCommentArg(3, 3, arguments);
  var failureMessage = commentArg(3, arguments) ? commentArg(3, arguments) : '';
  var equalityPredicate = function(type, var1, var2) {
    var typedPredicate =
        goog.testing.asserts.primitiveRoughEqualityPredicates_[type];
    if (!typedPredicate) {
      return goog.testing.asserts.EQUALITY_PREDICATE_CANT_PROCESS;
    }
    var equal = typedPredicate(var1, var2, tolerance);
    return equal ? goog.testing.asserts.EQUALITY_PREDICATE_VARS_ARE_EQUAL :
        goog.testing.asserts.getDefaultErrorMsg_(var1, var2) +
        ' which was more than ' + tolerance + ' away';
 ***REMOVED*****REMOVED***
  var differences = goog.testing.asserts.findDifferences(
      v1, v2, equalityPredicate);

  _assert(failureMessage, !differences, differences);
***REMOVED***


***REMOVED***
***REMOVED*** Compares two arbitrary objects for non-equalness.
***REMOVED***
***REMOVED*** All the same caveats as for assertObjectEquals apply here:
***REMOVED*** Undefined values may be confused for missing values, or vice versa.
***REMOVED***
***REMOVED*** @param {*} a Assertion message or comparison object.
***REMOVED*** @param {*} b Comparison object.
***REMOVED*** @param {*=} opt_c Comparison object, if an assertion message was provided.
***REMOVED***
var assertObjectNotEquals = function(a, b, opt_c) {
  _validateArguments(2, arguments);
  var v1 = nonCommentArg(1, 2, arguments);
  var v2 = nonCommentArg(2, 2, arguments);
  var failureMessage = commentArg(2, arguments) ? commentArg(2, arguments) : '';
  var differences = goog.testing.asserts.findDifferences(v1, v2);

  _assert(failureMessage, differences, 'Objects should not be equal');
***REMOVED***


***REMOVED***
***REMOVED*** Compares two arrays ignoring negative indexes and extra properties on the
***REMOVED*** array objects. Use case: Internet Explorer adds the index, lastIndex and
***REMOVED*** input enumerable fields to the result of string.match(/regexp/g), which makes
***REMOVED*** assertObjectEquals fail.
***REMOVED*** @param {*} a The expected array (2 args) or the debug message (3 args).
***REMOVED*** @param {*} b The actual array (2 args) or the expected array (3 args).
***REMOVED*** @param {*=} opt_c The actual array (3 args only).
***REMOVED***
var assertArrayEquals = function(a, b, opt_c) {
  _validateArguments(2, arguments);
  var v1 = nonCommentArg(1, 2, arguments);
  var v2 = nonCommentArg(2, 2, arguments);
  var failureMessage = commentArg(2, arguments) ? commentArg(2, arguments) : '';

  var typeOfVar1 = _trueTypeOf(v1);
  _assert(failureMessage,
          typeOfVar1 == 'Array',
          'Expected an array for assertArrayEquals but found a ' + typeOfVar1);

  var typeOfVar2 = _trueTypeOf(v2);
  _assert(failureMessage,
          typeOfVar2 == 'Array',
          'Expected an array for assertArrayEquals but found a ' + typeOfVar2);

  assertObjectEquals(failureMessage,
      Array.prototype.concat.call(v1), Array.prototype.concat.call(v2));
***REMOVED***


***REMOVED***
***REMOVED*** Compares two objects that can be accessed like an array and assert that
***REMOVED*** each element is equal.
***REMOVED*** @param {string|Object} a Failure message (3 arguments)
***REMOVED***     or object #1 (2 arguments).
***REMOVED*** @param {Object} b Object #1 (2 arguments) or object #2 (3 arguments).
***REMOVED*** @param {Object=} c Object #2 (3 arguments).
***REMOVED***
var assertElementsEquals = function(a, b, c) {
  _validateArguments(2, arguments);

  var v1 = nonCommentArg(1, 2, arguments);
  var v2 = nonCommentArg(2, 2, arguments);
  var failureMessage = commentArg(2, arguments) ? commentArg(2, arguments) : '';

  if (!v1) {
    assert(failureMessage, !v2);
  } else {
    assertEquals('length mismatch: ' + failureMessage, v1.length, v2.length);
    for (var i = 0; i < v1.length; ++i) {
      assertEquals(
          'mismatch at index ' + i + ': ' + failureMessage, v1[i], v2[i]);
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** Compares two objects that can be accessed like an array and assert that
***REMOVED*** each element is roughly equal.
***REMOVED*** @param {string|Object} a Failure message (4 arguments)
***REMOVED***     or object #1 (3 arguments).
***REMOVED*** @param {Object} b Object #1 (4 arguments) or object #2 (3 arguments).
***REMOVED*** @param {Object|number} c Object #2 (4 arguments) or tolerance (3 arguments).
***REMOVED*** @param {number=} opt_d tolerance (4 arguments).
***REMOVED***
var assertElementsRoughlyEqual = function(a, b, c, opt_d) {
  _validateArguments(3, arguments);

  var v1 = nonCommentArg(1, 3, arguments);
  var v2 = nonCommentArg(2, 3, arguments);
  var tolerance = nonCommentArg(3, 3, arguments);
  var failureMessage = commentArg(3, arguments) ? commentArg(3, arguments) : '';

  if (!v1) {
    assert(failureMessage, !v2);
  } else {
    assertEquals('length mismatch: ' + failureMessage, v1.length, v2.length);
    for (var i = 0; i < v1.length; ++i) {
      assertRoughlyEquals(failureMessage, v1[i], v2[i], tolerance);
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** Compares two array-like objects without taking their order into account.
***REMOVED*** @param {string|goog.testing.asserts.ArrayLike} a Assertion message or the
***REMOVED***     expected elements.
***REMOVED*** @param {goog.testing.asserts.ArrayLike} b Expected elements or the actual
***REMOVED***     elements.
***REMOVED*** @param {goog.testing.asserts.ArrayLike=} opt_c Actual elements.
***REMOVED***
var assertSameElements = function(a, b, opt_c) {
  _validateArguments(2, arguments);
  var expected = nonCommentArg(1, 2, arguments);
  var actual = nonCommentArg(2, 2, arguments);
  var message = commentArg(2, arguments);

  assertTrue('Bad arguments to assertSameElements(opt_message, expected: ' +
      'ArrayLike, actual: ArrayLike)',
      goog.isArrayLike(expected) && goog.isArrayLike(actual));

  // Clones expected and actual and converts them to real arrays.
  expected = goog.testing.asserts.toArray_(expected);
  actual = goog.testing.asserts.toArray_(actual);
  // TODO(user): It would be great to show only the difference
  // between the expected and actual elements.
  _assert(message, expected.length == actual.length,
      'Expected ' + expected.length + ' elements: [' + expected + '], ' +
      'got ' + actual.length + ' elements: [' + actual + ']');

  var toFind = goog.testing.asserts.toArray_(expected);
  for (var i = 0; i < actual.length; i++) {
    var index = goog.testing.asserts.indexOf_(toFind, actual[i]);
    _assert(message, index != -1, 'Expected [' + expected + '], got [' +
        actual + ']');
    toFind.splice(index, 1);
  }
***REMOVED***


***REMOVED***
***REMOVED*** @param {*} a The value to assert (1 arg) or debug message (2 args).
***REMOVED*** @param {*=} opt_b The value to assert (2 args only).
***REMOVED***
var assertEvaluatesToTrue = function(a, opt_b) {
  _validateArguments(1, arguments);
  var value = nonCommentArg(1, 1, arguments);
  if (!value) {
    _assert(commentArg(1, arguments), false, 'Expected to evaluate to true');
  }
***REMOVED***


***REMOVED***
***REMOVED*** @param {*} a The value to assert (1 arg) or debug message (2 args).
***REMOVED*** @param {*=} opt_b The value to assert (2 args only).
***REMOVED***
var assertEvaluatesToFalse = function(a, opt_b) {
  _validateArguments(1, arguments);
  var value = nonCommentArg(1, 1, arguments);
  if (value) {
    _assert(commentArg(1, arguments), false, 'Expected to evaluate to false');
  }
***REMOVED***


***REMOVED***
***REMOVED*** Compares two HTML snippets.
***REMOVED***
***REMOVED*** Take extra care if attributes are involved. {@code assertHTMLEquals}'s
***REMOVED*** implementation isn't prepared for complex cases. For example, the following
***REMOVED*** comparisons erroneously fail:
***REMOVED*** <pre>
***REMOVED*** assertHTMLEquals('<a href="x" target="y">', '<a target="y" href="x">');
***REMOVED*** assertHTMLEquals('<div classname="a b">', '<div classname="b a">');
***REMOVED*** assertHTMLEquals('<input disabled>', '<input disabled="disabled">');
***REMOVED*** </pre>
***REMOVED***
***REMOVED*** When in doubt, use {@code goog.testing.dom.assertHtmlMatches}.
***REMOVED***
***REMOVED*** @param {*} a The expected value (2 args) or the debug message (3 args).
***REMOVED*** @param {*} b The actual value (2 args) or the expected value (3 args).
***REMOVED*** @param {*=} opt_c The actual value (3 args only).
***REMOVED***
var assertHTMLEquals = function(a, b, opt_c) {
  _validateArguments(2, arguments);
  var var1 = nonCommentArg(1, 2, arguments);
  var var2 = nonCommentArg(2, 2, arguments);
  var var1Standardized = standardizeHTML(var1);
  var var2Standardized = standardizeHTML(var2);

  _assert(commentArg(2, arguments), var1Standardized === var2Standardized,
          goog.testing.asserts.getDefaultErrorMsg_(
              var1Standardized, var2Standardized));
***REMOVED***


***REMOVED***
***REMOVED*** Compares two CSS property values to make sure that they represent the same
***REMOVED*** things. This will normalize values in the browser. For example, in Firefox,
***REMOVED*** this assertion will consider "rgb(0, 0, 255)" and "#0000ff" to be identical
***REMOVED*** values for the "color" property. This function won't normalize everything --
***REMOVED*** for example, in most browsers, "blue" will not match "#0000ff". It is
***REMOVED*** intended only to compensate for unexpected normalizations performed by
***REMOVED*** the browser that should also affect your expected value.
***REMOVED*** @param {string} a Assertion message, or the CSS property name.
***REMOVED*** @param {string} b CSS property name, or the expected value.
***REMOVED*** @param {string} c The expected value, or the actual value.
***REMOVED*** @param {string=} opt_d The actual value.
***REMOVED***
var assertCSSValueEquals = function(a, b, c, opt_d) {
  _validateArguments(3, arguments);
  var propertyName = nonCommentArg(1, 3, arguments);
  var expectedValue = nonCommentArg(2, 3, arguments);
  var actualValue = nonCommentArg(3, 3, arguments);
  var expectedValueStandardized =
      standardizeCSSValue(propertyName, expectedValue);
  var actualValueStandardized =
      standardizeCSSValue(propertyName, actualValue);

  _assert(commentArg(3, arguments),
          expectedValueStandardized == actualValueStandardized,
          goog.testing.asserts.getDefaultErrorMsg_(
              expectedValueStandardized, actualValueStandardized));
***REMOVED***


***REMOVED***
***REMOVED*** @param {*} a The expected value (2 args) or the debug message (3 args).
***REMOVED*** @param {*} b The actual value (2 args) or the expected value (3 args).
***REMOVED*** @param {*=} opt_c The actual value (3 args only).
***REMOVED***
var assertHashEquals = function(a, b, opt_c) {
  _validateArguments(2, arguments);
  var var1 = nonCommentArg(1, 2, arguments);
  var var2 = nonCommentArg(2, 2, arguments);
  var message = commentArg(2, arguments);
  for (var key in var1) {
    _assert(message,
        key in var2, 'Expected hash had key ' + key + ' that was not found');
    _assert(message, var1[key] == var2[key], 'Value for key ' + key +
        ' mismatch - expected = ' + var1[key] + ', actual = ' + var2[key]);
  }

  for (var key in var2) {
    _assert(message, key in var1, 'Actual hash had key ' + key +
        ' that was not expected');
  }
***REMOVED***


***REMOVED***
***REMOVED*** @param {*} a The expected value (3 args) or the debug message (4 args).
***REMOVED*** @param {*} b The actual value (3 args) or the expected value (4 args).
***REMOVED*** @param {*} c The tolerance (3 args) or the actual value (4 args).
***REMOVED*** @param {*=} opt_d The tolerance (4 args only).
***REMOVED***
var assertRoughlyEquals = function(a, b, c, opt_d) {
  _validateArguments(3, arguments);
  var expected = nonCommentArg(1, 3, arguments);
  var actual = nonCommentArg(2, 3, arguments);
  var tolerance = nonCommentArg(3, 3, arguments);
  _assert(commentArg(3, arguments),
      goog.testing.asserts.numberRoughEqualityPredicate_(
          expected, actual, tolerance),
      'Expected ' + expected + ', but got ' + actual +
      ' which was more than ' + tolerance + ' away');
***REMOVED***


***REMOVED***
***REMOVED*** Checks if the given element is the member of the given container.
***REMOVED*** @param {*} a Failure message (3 arguments) or the contained element
***REMOVED***     (2 arguments).
***REMOVED*** @param {*} b The contained element (3 arguments) or the container
***REMOVED***     (2 arguments).
***REMOVED*** @param {*=} opt_c The container.
***REMOVED***
var assertContains = function(a, b, opt_c) {
  _validateArguments(2, arguments);
  var contained = nonCommentArg(1, 2, arguments);
  var container = nonCommentArg(2, 2, arguments);
  _assert(commentArg(2, arguments),
      goog.testing.asserts.contains_(container, contained),
      'Expected \'' + container + '\' to contain \'' + contained + '\'');
***REMOVED***


***REMOVED***
***REMOVED*** Checks if the given element is not the member of the given container.
***REMOVED*** @param {*} a Failure message (3 arguments) or the contained element
***REMOVED***     (2 arguments).
***REMOVED*** @param {*} b The contained element (3 arguments) or the container
***REMOVED***     (2 arguments).
***REMOVED*** @param {*=} opt_c The container.
***REMOVED***
var assertNotContains = function(a, b, opt_c) {
  _validateArguments(2, arguments);
  var contained = nonCommentArg(1, 2, arguments);
  var container = nonCommentArg(2, 2, arguments);
  _assert(commentArg(2, arguments),
      !goog.testing.asserts.contains_(container, contained),
      'Expected \'' + container + '\' not to contain \'' + contained + '\'');
***REMOVED***


***REMOVED***
***REMOVED*** Converts an array like object to array or clones it if it's already array.
***REMOVED*** @param {goog.testing.asserts.ArrayLike} arrayLike The collection.
***REMOVED*** @return {!Array} Copy of the collection as array.
***REMOVED*** @private
***REMOVED***
goog.testing.asserts.toArray_ = function(arrayLike) {
  var ret = [];
  for (var i = 0; i < arrayLike.length; i++) {
    ret[i] = arrayLike[i];
  }
  return ret;
***REMOVED***


***REMOVED***
***REMOVED*** Finds the position of the first occurrence of an element in a container.
***REMOVED*** @param {goog.testing.asserts.ArrayLike} container
***REMOVED***     The array to find the element in.
***REMOVED*** @param {*} contained Element to find.
***REMOVED*** @return {number} Index of the first occurrence or -1 if not found.
***REMOVED*** @private
***REMOVED***
goog.testing.asserts.indexOf_ = function(container, contained) {
  if (container.indexOf) {
    return container.indexOf(contained);
  } else {
    // IE6/7 do not have indexOf so do a search.
    for (var i = 0; i < container.length; i++) {
      if (container[i] === contained) {
        return i;
      }
    }
    return -1;
  }
***REMOVED***


***REMOVED***
***REMOVED*** Tells whether the array contains the given element.
***REMOVED*** @param {goog.testing.asserts.ArrayLike} container The array to
***REMOVED***     find the element in.
***REMOVED*** @param {*} contained Element to find.
***REMOVED*** @return {boolean} Whether the element is in the array.
***REMOVED*** @private
***REMOVED***
goog.testing.asserts.contains_ = function(container, contained) {
  // TODO(user): Can we check for container.contains as well?
  // That would give us support for most goog.structs (though weird results
  // with anything else with a contains method, like goog.math.Range). Falling
  // back with container.some would catch all iterables, too.
  return goog.testing.asserts.indexOf_(container, contained) != -1;
***REMOVED***

var standardizeHTML = function(html) {
  var translator = document.createElement('DIV');
  translator.innerHTML = html;

  // Trim whitespace from result (without relying on goog.string)
  return translator.innerHTML.replace(/^\s+|\s+$/g, '');
***REMOVED***


***REMOVED***
***REMOVED*** Standardizes a CSS value for a given property by applying it to an element
***REMOVED*** and then reading it back.
***REMOVED*** @param {string} propertyName CSS property name.
***REMOVED*** @param {string} value CSS value.
***REMOVED*** @return {string} Normalized CSS value.
***REMOVED***
var standardizeCSSValue = function(propertyName, value) {
  var styleDeclaration = document.createElement('DIV').style;
  styleDeclaration[propertyName] = value;
  return styleDeclaration[propertyName];
***REMOVED***


***REMOVED***
***REMOVED*** Raises a JsUnit exception with the given comment.
***REMOVED*** @param {string} comment A summary for the exception.
***REMOVED*** @param {string=} opt_message A description of the exception.
***REMOVED***
goog.testing.asserts.raiseException = function(comment, opt_message) {
  if (goog.global['CLOSURE_INSPECTOR___'] &&
      goog.global['CLOSURE_INSPECTOR___']['supportsJSUnit']) {
    goog.global['CLOSURE_INSPECTOR___']['jsUnitFailure'](comment, opt_message);
  }

  throw new goog.testing.JsUnitException(comment, opt_message);
***REMOVED***


***REMOVED***
***REMOVED*** Helper function for assertObjectEquals.
***REMOVED*** @param {string} prop A property name.
***REMOVED*** @return {boolean} If the property name is an array index.
***REMOVED*** @private
***REMOVED***
goog.testing.asserts.isArrayIndexProp_ = function(prop) {
  return (prop | 0) == prop;
***REMOVED***



***REMOVED***
***REMOVED*** @param {string} comment A summary for the exception.
***REMOVED*** @param {?string=} opt_message A description of the exception.
***REMOVED***
***REMOVED***
goog.testing.JsUnitException = function(comment, opt_message) {
  this.isJsUnitException = true;
  this.message = (comment ? comment : '') +
                 (comment && opt_message ? '\n' : '') +
                 (opt_message ? opt_message : '');
  this.stackTrace = goog.testing.stacktrace.get();
  // These fields are for compatibility with jsUnitTestManager.
  this.comment = comment || null;
  this.jsUnitMessage = opt_message || '';
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.testing.JsUnitException.prototype.toString = function() {
  return this.message;
***REMOVED***


goog.exportSymbol('fail', fail);
goog.exportSymbol('assert', assert);
goog.exportSymbol('assertThrows', assertThrows);
goog.exportSymbol('assertNotThrows', assertNotThrows);
goog.exportSymbol('assertTrue', assertTrue);
goog.exportSymbol('assertFalse', assertFalse);
goog.exportSymbol('assertEquals', assertEquals);
goog.exportSymbol('assertNotEquals', assertNotEquals);
goog.exportSymbol('assertNull', assertNull);
goog.exportSymbol('assertNotNull', assertNotNull);
goog.exportSymbol('assertUndefined', assertUndefined);
goog.exportSymbol('assertNotUndefined', assertNotUndefined);
goog.exportSymbol('assertNotNullNorUndefined', assertNotNullNorUndefined);
goog.exportSymbol('assertNonEmptyString', assertNonEmptyString);
goog.exportSymbol('assertNaN', assertNaN);
goog.exportSymbol('assertNotNaN', assertNotNaN);
goog.exportSymbol('assertObjectEquals', assertObjectEquals);
goog.exportSymbol('assertObjectRoughlyEquals', assertObjectRoughlyEquals);
goog.exportSymbol('assertObjectNotEquals', assertObjectNotEquals);
goog.exportSymbol('assertArrayEquals', assertArrayEquals);
goog.exportSymbol('assertElementsEquals', assertElementsEquals);
goog.exportSymbol('assertElementsRoughlyEqual', assertElementsRoughlyEqual);
goog.exportSymbol('assertSameElements', assertSameElements);
goog.exportSymbol('assertEvaluatesToTrue', assertEvaluatesToTrue);
goog.exportSymbol('assertEvaluatesToFalse', assertEvaluatesToFalse);
goog.exportSymbol('assertHTMLEquals', assertHTMLEquals);
goog.exportSymbol('assertHashEquals', assertHashEquals);
goog.exportSymbol('assertRoughlyEquals', assertRoughlyEquals);
goog.exportSymbol('assertContains', assertContains);
goog.exportSymbol('assertNotContains', assertNotContains);
