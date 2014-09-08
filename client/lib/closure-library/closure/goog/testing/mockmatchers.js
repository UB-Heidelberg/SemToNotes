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
***REMOVED*** @fileoverview Matchers to be used with the mock utilities.  They allow for
***REMOVED*** flexible matching by type.  Custom matchers can be created by passing a
***REMOVED*** matcher function into an ArgumentMatcher instance.
***REMOVED***
***REMOVED*** For examples, please see the unit test.
***REMOVED***
***REMOVED***


goog.provide('goog.testing.mockmatchers');
goog.provide('goog.testing.mockmatchers.ArgumentMatcher');
goog.provide('goog.testing.mockmatchers.IgnoreArgument');
goog.provide('goog.testing.mockmatchers.InstanceOf');
goog.provide('goog.testing.mockmatchers.ObjectEquals');
goog.provide('goog.testing.mockmatchers.RegexpMatch');
goog.provide('goog.testing.mockmatchers.SaveArgument');
goog.provide('goog.testing.mockmatchers.TypeOf');

goog.require('goog.array');
goog.require('goog.dom');
goog.require('goog.testing.asserts');



***REMOVED***
***REMOVED*** A simple interface for executing argument matching.  A match in this case is
***REMOVED*** testing to see if a supplied object fits a given criteria.  True is returned
***REMOVED*** if the given criteria is met.
***REMOVED*** @param {Function=} opt_matchFn A function that evaluates a given argument
***REMOVED***     and returns true if it meets a given criteria.
***REMOVED*** @param {?string=} opt_matchName The name expressing intent as part of
***REMOVED***      an error message for when a match fails.
***REMOVED***
***REMOVED***
goog.testing.mockmatchers.ArgumentMatcher =
    function(opt_matchFn, opt_matchName) {
 ***REMOVED*****REMOVED***
  ***REMOVED*** A function that evaluates a given argument and returns true if it meets a
  ***REMOVED*** given criteria.
  ***REMOVED*** @type {Function}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.matchFn_ = opt_matchFn || null;

 ***REMOVED*****REMOVED***
  ***REMOVED*** A string indicating the match intent (e.g. isBoolean or isString).
  ***REMOVED*** @type {?string}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.matchName_ = opt_matchName || null;
***REMOVED***


***REMOVED***
***REMOVED*** A function that takes a match argument and an optional MockExpectation
***REMOVED*** which (if provided) will get error information and returns whether or
***REMOVED*** not it matches.
***REMOVED*** @param {*} toVerify The argument that should be verified.
***REMOVED*** @param {goog.testing.MockExpectation?=} opt_expectation The expectation
***REMOVED***     for this match.
***REMOVED*** @return {boolean} Whether or not a given argument passes verification.
***REMOVED***
goog.testing.mockmatchers.ArgumentMatcher.prototype.matches =
    function(toVerify, opt_expectation) {
  if (this.matchFn_) {
    var isamatch = this.matchFn_(toVerify);
    if (!isamatch && opt_expectation) {
      if (this.matchName_) {
        opt_expectation.addErrorMessage('Expected: ' +
            this.matchName_ + ' but was: ' + _displayStringForValue(toVerify));
      } else {
        opt_expectation.addErrorMessage('Expected: missing mockmatcher' +
            ' description but was: ' +
            _displayStringForValue(toVerify));
      }
    }
    return isamatch;
  } else {
    throw Error('No match function defined for this mock matcher');
  }
***REMOVED***



***REMOVED***
***REMOVED*** A matcher that verifies that an argument is an instance of a given class.
***REMOVED*** @param {Function} ctor The class that will be used for verification.
***REMOVED***
***REMOVED*** @extends {goog.testing.mockmatchers.ArgumentMatcher}
***REMOVED*** @final
***REMOVED***
goog.testing.mockmatchers.InstanceOf = function(ctor) {
  goog.testing.mockmatchers.ArgumentMatcher.call(this,
      function(obj) {
        return obj instanceof ctor;
        // NOTE: Browser differences on ctor.toString() output
        // make using that here problematic. So for now, just let
        // people know the instanceOf() failed without providing
        // browser specific details...
      }, 'instanceOf()');
***REMOVED***
goog.inherits(goog.testing.mockmatchers.InstanceOf,
    goog.testing.mockmatchers.ArgumentMatcher);



***REMOVED***
***REMOVED*** A matcher that verifies that an argument is of a given type (e.g. "object").
***REMOVED*** @param {string} type The type that a given argument must have.
***REMOVED***
***REMOVED*** @extends {goog.testing.mockmatchers.ArgumentMatcher}
***REMOVED*** @final
***REMOVED***
goog.testing.mockmatchers.TypeOf = function(type) {
  goog.testing.mockmatchers.ArgumentMatcher.call(this,
      function(obj) {
        return goog.typeOf(obj) == type;
      }, 'typeOf(' + type + ')');
***REMOVED***
goog.inherits(goog.testing.mockmatchers.TypeOf,
    goog.testing.mockmatchers.ArgumentMatcher);



***REMOVED***
***REMOVED*** A matcher that verifies that an argument matches a given RegExp.
***REMOVED*** @param {RegExp} regexp The regular expression that the argument must match.
***REMOVED***
***REMOVED*** @extends {goog.testing.mockmatchers.ArgumentMatcher}
***REMOVED*** @final
***REMOVED***
goog.testing.mockmatchers.RegexpMatch = function(regexp) {
  goog.testing.mockmatchers.ArgumentMatcher.call(this,
      function(str) {
        return regexp.test(str);
      }, 'match(' + regexp + ')');
***REMOVED***
goog.inherits(goog.testing.mockmatchers.RegexpMatch,
    goog.testing.mockmatchers.ArgumentMatcher);



***REMOVED***
***REMOVED*** A matcher that always returns true. It is useful when the user does not care
***REMOVED*** for some arguments.
***REMOVED*** For example: mockFunction('username', 'password', IgnoreArgument);
***REMOVED***
***REMOVED*** @extends {goog.testing.mockmatchers.ArgumentMatcher}
***REMOVED*** @final
***REMOVED***
goog.testing.mockmatchers.IgnoreArgument = function() {
  goog.testing.mockmatchers.ArgumentMatcher.call(this,
      function() {
        return true;
      }, 'true');
***REMOVED***
goog.inherits(goog.testing.mockmatchers.IgnoreArgument,
    goog.testing.mockmatchers.ArgumentMatcher);



***REMOVED***
***REMOVED*** A matcher that verifies that the argument is an object that equals the given
***REMOVED*** expected object, using a deep comparison.
***REMOVED*** @param {Object} expectedObject An object to match against when
***REMOVED***     verifying the argument.
***REMOVED***
***REMOVED*** @extends {goog.testing.mockmatchers.ArgumentMatcher}
***REMOVED***
goog.testing.mockmatchers.ObjectEquals = function(expectedObject) {
  goog.testing.mockmatchers.ArgumentMatcher.call(this,
      function(matchObject) {
        assertObjectEquals('Expected equal objects', expectedObject,
            matchObject);
        return true;
      }, 'objectEquals(' + expectedObject + ')');
***REMOVED***
goog.inherits(goog.testing.mockmatchers.ObjectEquals,
    goog.testing.mockmatchers.ArgumentMatcher);


***REMOVED*** @override***REMOVED***
goog.testing.mockmatchers.ObjectEquals.prototype.matches =
    function(toVerify, opt_expectation) {
  // Override the default matches implementation to capture the exception thrown
  // by assertObjectEquals (if any) and add that message to the expectation.
  try {
    return goog.testing.mockmatchers.ObjectEquals.superClass_.matches.call(
        this, toVerify, opt_expectation);
  } catch (e) {
    if (opt_expectation) {
      opt_expectation.addErrorMessage(e.message);
    }
    return false;
  }
***REMOVED***



***REMOVED***
***REMOVED*** A matcher that saves the argument that it is verifying so that your unit test
***REMOVED*** can perform extra tests with this argument later.  For example, if the
***REMOVED*** argument is a callback method, the unit test can then later call this
***REMOVED*** callback to test the asynchronous portion of the call.
***REMOVED*** @param {goog.testing.mockmatchers.ArgumentMatcher|Function=} opt_matcher
***REMOVED***     Argument matcher or matching function that will be used to validate the
***REMOVED***     argument.  By default, argument will always be valid.
***REMOVED*** @param {?string=} opt_matchName The name expressing intent as part of
***REMOVED***      an error message for when a match fails.
***REMOVED***
***REMOVED*** @extends {goog.testing.mockmatchers.ArgumentMatcher}
***REMOVED*** @final
***REMOVED***
goog.testing.mockmatchers.SaveArgument = function(opt_matcher, opt_matchName) {
  goog.testing.mockmatchers.ArgumentMatcher.call(
      this,***REMOVED*****REMOVED*** @type {Function}***REMOVED*** (opt_matcher), opt_matchName);

  if (opt_matcher instanceof goog.testing.mockmatchers.ArgumentMatcher) {
   ***REMOVED*****REMOVED***
    ***REMOVED*** Delegate match requests to this matcher.
    ***REMOVED*** @type {goog.testing.mockmatchers.ArgumentMatcher}
    ***REMOVED*** @private
   ***REMOVED*****REMOVED***
    this.delegateMatcher_ = opt_matcher;
  } else if (!opt_matcher) {
    this.delegateMatcher_ = goog.testing.mockmatchers.ignoreArgument;
  }
***REMOVED***
goog.inherits(goog.testing.mockmatchers.SaveArgument,
    goog.testing.mockmatchers.ArgumentMatcher);


***REMOVED*** @override***REMOVED***
goog.testing.mockmatchers.SaveArgument.prototype.matches = function(
    toVerify, opt_expectation) {
  this.arg = toVerify;
  if (this.delegateMatcher_) {
    return this.delegateMatcher_.matches(toVerify, opt_expectation);
  }
  return goog.testing.mockmatchers.SaveArgument.superClass_.matches.call(
      this, toVerify, opt_expectation);
***REMOVED***


***REMOVED***
***REMOVED*** Saved argument that was verified.
***REMOVED*** @type {*}
***REMOVED***
goog.testing.mockmatchers.SaveArgument.prototype.arg;


***REMOVED***
***REMOVED*** An instance of the IgnoreArgument matcher. Returns true for all matches.
***REMOVED*** @type {goog.testing.mockmatchers.IgnoreArgument}
***REMOVED***
goog.testing.mockmatchers.ignoreArgument =
    new goog.testing.mockmatchers.IgnoreArgument();


***REMOVED***
***REMOVED*** A matcher that verifies that an argument is an array.
***REMOVED*** @type {goog.testing.mockmatchers.ArgumentMatcher}
***REMOVED***
goog.testing.mockmatchers.isArray =
    new goog.testing.mockmatchers.ArgumentMatcher(goog.isArray,
        'isArray');


***REMOVED***
***REMOVED*** A matcher that verifies that an argument is a array-like.  A NodeList is an
***REMOVED*** example of a collection that is very close to an array.
***REMOVED*** @type {goog.testing.mockmatchers.ArgumentMatcher}
***REMOVED***
goog.testing.mockmatchers.isArrayLike =
    new goog.testing.mockmatchers.ArgumentMatcher(goog.isArrayLike,
        'isArrayLike');


***REMOVED***
***REMOVED*** A matcher that verifies that an argument is a date-like.
***REMOVED*** @type {goog.testing.mockmatchers.ArgumentMatcher}
***REMOVED***
goog.testing.mockmatchers.isDateLike =
    new goog.testing.mockmatchers.ArgumentMatcher(goog.isDateLike,
        'isDateLike');


***REMOVED***
***REMOVED*** A matcher that verifies that an argument is a string.
***REMOVED*** @type {goog.testing.mockmatchers.ArgumentMatcher}
***REMOVED***
goog.testing.mockmatchers.isString =
    new goog.testing.mockmatchers.ArgumentMatcher(goog.isString,
        'isString');


***REMOVED***
***REMOVED*** A matcher that verifies that an argument is a boolean.
***REMOVED*** @type {goog.testing.mockmatchers.ArgumentMatcher}
***REMOVED***
goog.testing.mockmatchers.isBoolean =
    new goog.testing.mockmatchers.ArgumentMatcher(goog.isBoolean,
        'isBoolean');


***REMOVED***
***REMOVED*** A matcher that verifies that an argument is a number.
***REMOVED*** @type {goog.testing.mockmatchers.ArgumentMatcher}
***REMOVED***
goog.testing.mockmatchers.isNumber =
    new goog.testing.mockmatchers.ArgumentMatcher(goog.isNumber,
        'isNumber');


***REMOVED***
***REMOVED*** A matcher that verifies that an argument is a function.
***REMOVED*** @type {goog.testing.mockmatchers.ArgumentMatcher}
***REMOVED***
goog.testing.mockmatchers.isFunction =
    new goog.testing.mockmatchers.ArgumentMatcher(goog.isFunction,
        'isFunction');


***REMOVED***
***REMOVED*** A matcher that verifies that an argument is an object.
***REMOVED*** @type {goog.testing.mockmatchers.ArgumentMatcher}
***REMOVED***
goog.testing.mockmatchers.isObject =
    new goog.testing.mockmatchers.ArgumentMatcher(goog.isObject,
        'isObject');


***REMOVED***
***REMOVED*** A matcher that verifies that an argument is like a DOM node.
***REMOVED*** @type {goog.testing.mockmatchers.ArgumentMatcher}
***REMOVED***
goog.testing.mockmatchers.isNodeLike =
    new goog.testing.mockmatchers.ArgumentMatcher(goog.dom.isNodeLike,
        'isNodeLike');


***REMOVED***
***REMOVED*** A function that checks to see if an array matches a given set of
***REMOVED*** expectations.  The expectations array can be a mix of ArgumentMatcher
***REMOVED*** implementations and values.  True will be returned if values are identical or
***REMOVED*** if a matcher returns a positive result.
***REMOVED*** @param {Array} expectedArr An array of expectations which can be either
***REMOVED***     values to check for equality or ArgumentMatchers.
***REMOVED*** @param {Array} arr The array to match.
***REMOVED*** @param {goog.testing.MockExpectation?=} opt_expectation The expectation
***REMOVED***     for this match.
***REMOVED*** @return {boolean} Whether or not the given array matches the expectations.
***REMOVED***
goog.testing.mockmatchers.flexibleArrayMatcher =
    function(expectedArr, arr, opt_expectation) {
  return goog.array.equals(expectedArr, arr, function(a, b) {
    var errCount = 0;
    if (opt_expectation) {
      errCount = opt_expectation.getErrorMessageCount();
    }
    var isamatch = a === b ||
        a instanceof goog.testing.mockmatchers.ArgumentMatcher &&
        a.matches(b, opt_expectation);
    var failureMessage = null;
    if (!isamatch) {
      failureMessage = goog.testing.asserts.findDifferences(a, b);
      isamatch = !failureMessage;
    }
    if (!isamatch && opt_expectation) {
      // If the error count changed, the match sent out an error
      // message. If the error count has not changed, then
      // we need to send out an error message...
      if (errCount == opt_expectation.getErrorMessageCount()) {
        // Use the _displayStringForValue() from assert.js
        // for consistency...
        if (!failureMessage) {
          failureMessage = 'Expected: ' + _displayStringForValue(a) +
              ' but was: ' + _displayStringForValue(b);
        }
        opt_expectation.addErrorMessage(failureMessage);
      }
    }
    return isamatch;
  });
***REMOVED***
