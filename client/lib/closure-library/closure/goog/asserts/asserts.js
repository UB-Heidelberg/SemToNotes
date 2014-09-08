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
***REMOVED*** @fileoverview Utilities to check the preconditions, postconditions and
***REMOVED*** invariants runtime.
***REMOVED***
***REMOVED*** Methods in this package should be given special treatment by the compiler
***REMOVED*** for type-inference. For example, <code>goog.asserts.assert(foo)</code>
***REMOVED*** will restrict <code>foo</code> to a truthy value.
***REMOVED***
***REMOVED*** The compiler has an option to disable asserts. So code like:
***REMOVED*** <code>
***REMOVED*** var x = goog.asserts.assert(foo()); goog.asserts.assert(bar());
***REMOVED*** </code>
***REMOVED*** will be transformed into:
***REMOVED*** <code>
***REMOVED*** var x = foo();
***REMOVED*** </code>
***REMOVED*** The compiler will leave in foo() (because its return value is used),
***REMOVED*** but it will remove bar() because it assumes it does not have side-effects.
***REMOVED***
***REMOVED***

goog.provide('goog.asserts');
goog.provide('goog.asserts.AssertionError');

goog.require('goog.debug.Error');
goog.require('goog.dom.NodeType');
goog.require('goog.string');


***REMOVED***
***REMOVED*** @define {boolean} Whether to strip out asserts or to leave them in.
***REMOVED***
goog.define('goog.asserts.ENABLE_ASSERTS', goog.DEBUG);



***REMOVED***
***REMOVED*** Error object for failed assertions.
***REMOVED*** @param {string} messagePattern The pattern that was used to form message.
***REMOVED*** @param {!Array.<*>} messageArgs The items to substitute into the pattern.
***REMOVED***
***REMOVED*** @extends {goog.debug.Error}
***REMOVED*** @final
***REMOVED***
goog.asserts.AssertionError = function(messagePattern, messageArgs) {
  messageArgs.unshift(messagePattern);
  goog.debug.Error.call(this, goog.string.subs.apply(null, messageArgs));
  // Remove the messagePattern afterwards to avoid permenantly modifying the
  // passed in array.
  messageArgs.shift();

 ***REMOVED*****REMOVED***
  ***REMOVED*** The message pattern used to format the error message. Error handlers can
  ***REMOVED*** use this to uniquely identify the assertion.
  ***REMOVED*** @type {string}
 ***REMOVED*****REMOVED***
  this.messagePattern = messagePattern;
***REMOVED***
goog.inherits(goog.asserts.AssertionError, goog.debug.Error);


***REMOVED*** @override***REMOVED***
goog.asserts.AssertionError.prototype.name = 'AssertionError';


***REMOVED***
***REMOVED*** Throws an exception with the given message and "Assertion failed" prefixed
***REMOVED*** onto it.
***REMOVED*** @param {string} defaultMessage The message to use if givenMessage is empty.
***REMOVED*** @param {Array.<*>} defaultArgs The substitution arguments for defaultMessage.
***REMOVED*** @param {string|undefined} givenMessage Message supplied by the caller.
***REMOVED*** @param {Array.<*>} givenArgs The substitution arguments for givenMessage.
***REMOVED*** @throws {goog.asserts.AssertionError} When the value is not a number.
***REMOVED*** @private
***REMOVED***
goog.asserts.doAssertFailure_ =
    function(defaultMessage, defaultArgs, givenMessage, givenArgs) {
  var message = 'Assertion failed';
  if (givenMessage) {
    message += ': ' + givenMessage;
    var args = givenArgs;
  } else if (defaultMessage) {
    message += ': ' + defaultMessage;
    args = defaultArgs;
  }
  // The '' + works around an Opera 10 bug in the unit tests. Without it,
  // a stack trace is added to var message above. With this, a stack trace is
  // not added until this line (it causes the extra garbage to be added after
  // the assertion message instead of in the middle of it).
  throw new goog.asserts.AssertionError('' + message, args || []);
***REMOVED***


***REMOVED***
***REMOVED*** Checks if the condition evaluates to true if goog.asserts.ENABLE_ASSERTS is
***REMOVED*** true.
***REMOVED*** @template T
***REMOVED*** @param {T} condition The condition to check.
***REMOVED*** @param {string=} opt_message Error message in case of failure.
***REMOVED*** @param {...*} var_args The items to substitute into the failure message.
***REMOVED*** @return {T} The value of the condition.
***REMOVED*** @throws {goog.asserts.AssertionError} When the condition evaluates to false.
***REMOVED***
goog.asserts.assert = function(condition, opt_message, var_args) {
  if (goog.asserts.ENABLE_ASSERTS && !condition) {
    goog.asserts.doAssertFailure_('', null, opt_message,
        Array.prototype.slice.call(arguments, 2));
  }
  return condition;
***REMOVED***


***REMOVED***
***REMOVED*** Fails if goog.asserts.ENABLE_ASSERTS is true. This function is useful in case
***REMOVED*** when we want to add a check in the unreachable area like switch-case
***REMOVED*** statement:
***REMOVED***
***REMOVED*** <pre>
***REMOVED***  switch(type) {
***REMOVED***    case FOO: doSomething(); break;
***REMOVED***    case BAR: doSomethingElse(); break;
***REMOVED***    default: goog.assert.fail('Unrecognized type: ' + type);
***REMOVED***      // We have only 2 types - "default:" section is unreachable code.
***REMOVED***  }
***REMOVED*** </pre>
***REMOVED***
***REMOVED*** @param {string=} opt_message Error message in case of failure.
***REMOVED*** @param {...*} var_args The items to substitute into the failure message.
***REMOVED*** @throws {goog.asserts.AssertionError} Failure.
***REMOVED***
goog.asserts.fail = function(opt_message, var_args) {
  if (goog.asserts.ENABLE_ASSERTS) {
    throw new goog.asserts.AssertionError(
        'Failure' + (opt_message ? ': ' + opt_message : ''),
        Array.prototype.slice.call(arguments, 1));
  }
***REMOVED***


***REMOVED***
***REMOVED*** Checks if the value is a number if goog.asserts.ENABLE_ASSERTS is true.
***REMOVED*** @param {*} value The value to check.
***REMOVED*** @param {string=} opt_message Error message in case of failure.
***REMOVED*** @param {...*} var_args The items to substitute into the failure message.
***REMOVED*** @return {number} The value, guaranteed to be a number when asserts enabled.
***REMOVED*** @throws {goog.asserts.AssertionError} When the value is not a number.
***REMOVED***
goog.asserts.assertNumber = function(value, opt_message, var_args) {
  if (goog.asserts.ENABLE_ASSERTS && !goog.isNumber(value)) {
    goog.asserts.doAssertFailure_('Expected number but got %s: %s.',
        [goog.typeOf(value), value], opt_message,
        Array.prototype.slice.call(arguments, 2));
  }
  return***REMOVED*****REMOVED*** @type {number}***REMOVED*** (value);
***REMOVED***


***REMOVED***
***REMOVED*** Checks if the value is a string if goog.asserts.ENABLE_ASSERTS is true.
***REMOVED*** @param {*} value The value to check.
***REMOVED*** @param {string=} opt_message Error message in case of failure.
***REMOVED*** @param {...*} var_args The items to substitute into the failure message.
***REMOVED*** @return {string} The value, guaranteed to be a string when asserts enabled.
***REMOVED*** @throws {goog.asserts.AssertionError} When the value is not a string.
***REMOVED***
goog.asserts.assertString = function(value, opt_message, var_args) {
  if (goog.asserts.ENABLE_ASSERTS && !goog.isString(value)) {
    goog.asserts.doAssertFailure_('Expected string but got %s: %s.',
        [goog.typeOf(value), value], opt_message,
        Array.prototype.slice.call(arguments, 2));
  }
  return***REMOVED*****REMOVED*** @type {string}***REMOVED*** (value);
***REMOVED***


***REMOVED***
***REMOVED*** Checks if the value is a function if goog.asserts.ENABLE_ASSERTS is true.
***REMOVED*** @param {*} value The value to check.
***REMOVED*** @param {string=} opt_message Error message in case of failure.
***REMOVED*** @param {...*} var_args The items to substitute into the failure message.
***REMOVED*** @return {!Function} The value, guaranteed to be a function when asserts
***REMOVED***     enabled.
***REMOVED*** @throws {goog.asserts.AssertionError} When the value is not a function.
***REMOVED***
goog.asserts.assertFunction = function(value, opt_message, var_args) {
  if (goog.asserts.ENABLE_ASSERTS && !goog.isFunction(value)) {
    goog.asserts.doAssertFailure_('Expected function but got %s: %s.',
        [goog.typeOf(value), value], opt_message,
        Array.prototype.slice.call(arguments, 2));
  }
  return***REMOVED*****REMOVED*** @type {!Function}***REMOVED*** (value);
***REMOVED***


***REMOVED***
***REMOVED*** Checks if the value is an Object if goog.asserts.ENABLE_ASSERTS is true.
***REMOVED*** @param {*} value The value to check.
***REMOVED*** @param {string=} opt_message Error message in case of failure.
***REMOVED*** @param {...*} var_args The items to substitute into the failure message.
***REMOVED*** @return {!Object} The value, guaranteed to be a non-null object.
***REMOVED*** @throws {goog.asserts.AssertionError} When the value is not an object.
***REMOVED***
goog.asserts.assertObject = function(value, opt_message, var_args) {
  if (goog.asserts.ENABLE_ASSERTS && !goog.isObject(value)) {
    goog.asserts.doAssertFailure_('Expected object but got %s: %s.',
        [goog.typeOf(value), value],
        opt_message, Array.prototype.slice.call(arguments, 2));
  }
  return***REMOVED*****REMOVED*** @type {!Object}***REMOVED*** (value);
***REMOVED***


***REMOVED***
***REMOVED*** Checks if the value is an Array if goog.asserts.ENABLE_ASSERTS is true.
***REMOVED*** @param {*} value The value to check.
***REMOVED*** @param {string=} opt_message Error message in case of failure.
***REMOVED*** @param {...*} var_args The items to substitute into the failure message.
***REMOVED*** @return {!Array} The value, guaranteed to be a non-null array.
***REMOVED*** @throws {goog.asserts.AssertionError} When the value is not an array.
***REMOVED***
goog.asserts.assertArray = function(value, opt_message, var_args) {
  if (goog.asserts.ENABLE_ASSERTS && !goog.isArray(value)) {
    goog.asserts.doAssertFailure_('Expected array but got %s: %s.',
        [goog.typeOf(value), value], opt_message,
        Array.prototype.slice.call(arguments, 2));
  }
  return***REMOVED*****REMOVED*** @type {!Array}***REMOVED*** (value);
***REMOVED***


***REMOVED***
***REMOVED*** Checks if the value is a boolean if goog.asserts.ENABLE_ASSERTS is true.
***REMOVED*** @param {*} value The value to check.
***REMOVED*** @param {string=} opt_message Error message in case of failure.
***REMOVED*** @param {...*} var_args The items to substitute into the failure message.
***REMOVED*** @return {boolean} The value, guaranteed to be a boolean when asserts are
***REMOVED***     enabled.
***REMOVED*** @throws {goog.asserts.AssertionError} When the value is not a boolean.
***REMOVED***
goog.asserts.assertBoolean = function(value, opt_message, var_args) {
  if (goog.asserts.ENABLE_ASSERTS && !goog.isBoolean(value)) {
    goog.asserts.doAssertFailure_('Expected boolean but got %s: %s.',
        [goog.typeOf(value), value], opt_message,
        Array.prototype.slice.call(arguments, 2));
  }
  return***REMOVED*****REMOVED*** @type {boolean}***REMOVED*** (value);
***REMOVED***


***REMOVED***
***REMOVED*** Checks if the value is a DOM Element if goog.asserts.ENABLE_ASSERTS is true.
***REMOVED*** @param {*} value The value to check.
***REMOVED*** @param {string=} opt_message Error message in case of failure.
***REMOVED*** @param {...*} var_args The items to substitute into the failure message.
***REMOVED*** @return {!Element} The value, likely to be a DOM Element when asserts are
***REMOVED***     enabled.
***REMOVED*** @throws {goog.asserts.AssertionError} When the value is not a boolean.
***REMOVED***
goog.asserts.assertElement = function(value, opt_message, var_args) {
  if (goog.asserts.ENABLE_ASSERTS && (!goog.isObject(value) ||
      value.nodeType != goog.dom.NodeType.ELEMENT)) {
    goog.asserts.doAssertFailure_('Expected Element but got %s: %s.',
        [goog.typeOf(value), value], opt_message,
        Array.prototype.slice.call(arguments, 2));
  }
  return***REMOVED*****REMOVED*** @type {!Element}***REMOVED*** (value);
***REMOVED***


***REMOVED***
***REMOVED*** Checks if the value is an instance of the user-defined type if
***REMOVED*** goog.asserts.ENABLE_ASSERTS is true.
***REMOVED***
***REMOVED*** The compiler may tighten the type returned by this function.
***REMOVED***
***REMOVED*** @param {*} value The value to check.
***REMOVED*** @param {function(new: T, ...)} type A user-defined constructor.
***REMOVED*** @param {string=} opt_message Error message in case of failure.
***REMOVED*** @param {...*} var_args The items to substitute into the failure message.
***REMOVED*** @throws {goog.asserts.AssertionError} When the value is not an instance of
***REMOVED***     type.
***REMOVED*** @return {!T}
***REMOVED*** @template T
***REMOVED***
goog.asserts.assertInstanceof = function(value, type, opt_message, var_args) {
  if (goog.asserts.ENABLE_ASSERTS && !(value instanceof type)) {
    goog.asserts.doAssertFailure_('instanceof check failed.', null,
        opt_message, Array.prototype.slice.call(arguments, 3));
  }
  return value;
***REMOVED***


***REMOVED***
***REMOVED*** Checks that no enumerable keys are present in Object.prototype. Such keys
***REMOVED*** would break most code that use {@code for (var ... in ...)} loops.
***REMOVED***
goog.asserts.assertObjectPrototypeIsIntact = function() {
  for (var key in Object.prototype) {
    goog.asserts.fail(key + ' should not be enumerable in Object.prototype.');
  }
***REMOVED***
