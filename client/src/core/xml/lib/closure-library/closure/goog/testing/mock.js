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
***REMOVED*** @fileoverview This file defines base classes used for creating mocks in
***REMOVED*** JavaScript. The API was inspired by EasyMock.
***REMOVED***
***REMOVED*** The basic API is:
***REMOVED*** <ul>
***REMOVED***   <li>Create an object to be mocked
***REMOVED***   <li>Create a mock object, passing in the above object to the constructor
***REMOVED***   <li>Set expectations by calling methods on the mock object
***REMOVED***   <li>Call $replay() on the mock object
***REMOVED***   <li>Pass the mock to code that will make real calls on it
***REMOVED***   <li>Call $verify() to make sure that expectations were met
***REMOVED*** </ul>
***REMOVED***
***REMOVED*** For examples, please see the unit tests for LooseMock and StrictMock.
***REMOVED***
***REMOVED*** Still TODO
***REMOVED***   implement better (and pluggable) argument matching
***REMOVED***   Have the exceptions for LooseMock show the number of expected/actual calls
***REMOVED***   loose and strict mocks share a lot of code - move it to the base class
***REMOVED***
***REMOVED***

goog.provide('goog.testing.Mock');
goog.provide('goog.testing.MockExpectation');

goog.require('goog.array');
goog.require('goog.object');
goog.require('goog.testing.JsUnitException');
goog.require('goog.testing.MockInterface');
goog.require('goog.testing.mockmatchers');



***REMOVED***
***REMOVED*** This is a class that represents an expectation.
***REMOVED*** @param {string} name The name of the method for this expectation.
***REMOVED***
***REMOVED***
goog.testing.MockExpectation = function(name) {
 ***REMOVED*****REMOVED***
  ***REMOVED*** The name of the method that is expected to be called.
  ***REMOVED*** @type {string}
 ***REMOVED*****REMOVED***
  this.name = name;

 ***REMOVED*****REMOVED***
  ***REMOVED*** An array of error messages for expectations not met.
  ***REMOVED*** @type {Array}
 ***REMOVED*****REMOVED***
  this.errorMessages = [];
***REMOVED***


***REMOVED***
***REMOVED*** The minimum number of times this method should be called.
***REMOVED*** @type {number}
***REMOVED***
goog.testing.MockExpectation.prototype.minCalls = 1;


***REMOVED***
 ***REMOVED*** The maximum number of times this method should be called.
 ***REMOVED*** @type {number}
***REMOVED*****REMOVED***
goog.testing.MockExpectation.prototype.maxCalls = 1;


***REMOVED***
***REMOVED*** The value that this method should return.
***REMOVED*** @type {*}
***REMOVED***
goog.testing.MockExpectation.prototype.returnValue;


***REMOVED***
***REMOVED*** The value that will be thrown when the method is called
***REMOVED*** @type {*}
***REMOVED***
goog.testing.MockExpectation.prototype.exceptionToThrow;


***REMOVED***
***REMOVED*** The arguments that are expected to be passed to this function
***REMOVED*** @type {Array.<*>}
***REMOVED***
goog.testing.MockExpectation.prototype.argumentList;


***REMOVED***
***REMOVED*** The number of times this method is called by real code.
***REMOVED*** @type {number}
***REMOVED***
goog.testing.MockExpectation.prototype.actualCalls = 0;


***REMOVED***
***REMOVED*** The number of times this method is called during the verification phase.
***REMOVED*** @type {number}
***REMOVED***
goog.testing.MockExpectation.prototype.verificationCalls = 0;


***REMOVED***
***REMOVED*** The function which will be executed when this method is called.
***REMOVED*** Method arguments will be passed to this function, and return value
***REMOVED*** of this function will be returned by the method.
***REMOVED*** @type {Function}
***REMOVED***
goog.testing.MockExpectation.prototype.toDo;


***REMOVED***
***REMOVED*** Allow expectation failures to include messages.
***REMOVED*** @param {string} message The failure message.
***REMOVED***
goog.testing.MockExpectation.prototype.addErrorMessage = function(message) {
  this.errorMessages.push(message);
***REMOVED***


***REMOVED***
***REMOVED*** Get the error messages seen so far.
***REMOVED*** @return {string} Error messages separated by \n.
***REMOVED***
goog.testing.MockExpectation.prototype.getErrorMessage = function() {
  return this.errorMessages.join('\n');
***REMOVED***


***REMOVED***
***REMOVED*** Get how many error messages have been seen so far.
***REMOVED*** @return {number} Count of error messages.
***REMOVED***
goog.testing.MockExpectation.prototype.getErrorMessageCount = function() {
  return this.errorMessages.length;
***REMOVED***



***REMOVED***
***REMOVED*** The base class for a mock object.
***REMOVED*** @param {Object|Function} objectToMock The object that should be mocked, or
***REMOVED***    the constructor of an object to mock.
***REMOVED*** @param {boolean=} opt_mockStaticMethods An optional argument denoting that
***REMOVED***     a mock should be constructed from the static functions of a class.
***REMOVED*** @param {boolean=} opt_createProxy An optional argument denoting that
***REMOVED***     a proxy for the target mock should be created.
***REMOVED***
***REMOVED*** @implements {goog.testing.MockInterface}
***REMOVED***
goog.testing.Mock = function(objectToMock, opt_mockStaticMethods,
    opt_createProxy) {
  if (!goog.isObject(objectToMock) && !goog.isFunction(objectToMock)) {
    throw new Error('objectToMock must be an object or constructor.');
  }
  if (opt_createProxy && !opt_mockStaticMethods &&
      goog.isFunction(objectToMock)) {
   ***REMOVED*****REMOVED*** @constructor***REMOVED***
    var tempCtor = function () {***REMOVED***
    goog.inherits(tempCtor, objectToMock);
    this.$proxy = new tempCtor();
  } else if (opt_createProxy && opt_mockStaticMethods &&
      goog.isFunction(objectToMock)) {
    throw Error('Cannot create a proxy when opt_mockStaticMethods is true');
  } else if (opt_createProxy && !goog.isFunction(objectToMock)) {
    throw Error('Must have a constructor to create a proxy');
  }

  if (goog.isFunction(objectToMock) && !opt_mockStaticMethods) {
    this.$initializeFunctions_(objectToMock.prototype);
  } else {
    this.$initializeFunctions_(objectToMock);
  }
  this.$argumentListVerifiers_ = {***REMOVED***
***REMOVED***


***REMOVED***
***REMOVED*** Option that may be passed when constructing function, method, and
***REMOVED*** constructor mocks. Indicates that the expected calls should be accepted in
***REMOVED*** any order.
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.testing.Mock.LOOSE = 1;


***REMOVED***
***REMOVED*** Option that may be passed when constructing function, method, and
***REMOVED*** constructor mocks. Indicates that the expected calls should be accepted in
***REMOVED*** the recorded order only.
***REMOVED*** @const
***REMOVED*** @type {number}
***REMOVED***
goog.testing.Mock.STRICT = 0;


***REMOVED***
***REMOVED*** This array contains the name of the functions that are part of the base
***REMOVED*** Object prototype.
***REMOVED*** Basically a copy of goog.object.PROTOTYPE_FIELDS_.
***REMOVED*** @const
***REMOVED*** @type {!Array.<string>}
***REMOVED*** @private
***REMOVED***
goog.testing.Mock.PROTOTYPE_FIELDS_ = [
  'constructor',
  'hasOwnProperty',
  'isPrototypeOf',
  'propertyIsEnumerable',
  'toLocaleString',
  'toString',
  'valueOf'
];


***REMOVED***
***REMOVED*** A proxy for the mock.  This can be used for dependency injection in lieu of
***REMOVED*** the mock if the test requires a strict instanceof check.
***REMOVED*** @type {Object}
***REMOVED***
goog.testing.Mock.prototype.$proxy = null;


***REMOVED***
***REMOVED*** Map of argument name to optional argument list verifier function.
***REMOVED*** @type {Object}
***REMOVED***
goog.testing.Mock.prototype.$argumentListVerifiers_;


***REMOVED***
***REMOVED*** Whether or not we are in recording mode.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.testing.Mock.prototype.$recording_ = true;


***REMOVED***
***REMOVED*** The expectation currently being created. All methods that modify the
***REMOVED*** current expectation return the Mock object for easy chaining, so this is
***REMOVED*** where we keep track of the expectation that's currently being modified.
***REMOVED*** @type {goog.testing.MockExpectation}
***REMOVED*** @protected
***REMOVED***
goog.testing.Mock.prototype.$pendingExpectation;


***REMOVED***
***REMOVED*** First exception thrown by this mock; used in $verify.
***REMOVED*** @type {Object}
***REMOVED*** @private
***REMOVED***
goog.testing.Mock.prototype.$threwException_ = null;


***REMOVED***
***REMOVED*** Initializes the functions on the mock object.
***REMOVED*** @param {Object} objectToMock The object being mocked.
***REMOVED*** @private
***REMOVED***
goog.testing.Mock.prototype.$initializeFunctions_ = function(objectToMock) {
  // Gets the object properties.
  var enumerableProperties = goog.object.getKeys(objectToMock);

  // The non enumerable properties are added if they override the ones in the
  // Object prototype. This is due to the fact that IE8 does not enumerate any
  // of the prototype Object functions even when overriden and mocking these is
  // sometimes needed.
  for (var i = 0; i < goog.testing.Mock.PROTOTYPE_FIELDS_.length; i++) {
    var prop = goog.testing.Mock.PROTOTYPE_FIELDS_[i];
    // Look at b/6758711 if you're considering adding ALL properties to ALL
    // mocks.
    if (objectToMock[prop] !== Object.prototype[prop]) {
      enumerableProperties.push(prop);
    }
  }

  // Adds the properties to the mock.
  for (var i = 0; i < enumerableProperties.length; i++) {
    var prop = enumerableProperties[i];
    if (typeof objectToMock[prop] == 'function') {
      this[prop] = goog.bind(this.$mockMethod, this, prop);
      if (this.$proxy) {
        this.$proxy[prop] = goog.bind(this.$mockMethod, this, prop);
      }
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** Registers a verfifier function to use when verifying method argument lists.
***REMOVED*** @param {string} methodName The name of the method for which the verifierFn
***REMOVED***     should be used.
***REMOVED*** @param {Function} fn Argument list verifier function.  Should take 2 argument
***REMOVED***     arrays as arguments, and return true if they are considered equivalent.
***REMOVED*** @return {goog.testing.Mock} This mock object.
***REMOVED***
goog.testing.Mock.prototype.$registerArgumentListVerifier = function(methodName,
                                                                     fn) {
  this.$argumentListVerifiers_[methodName] = fn;
  return this;
***REMOVED***


***REMOVED***
***REMOVED*** The function that replaces all methods on the mock object.
***REMOVED*** @param {string} name The name of the method being mocked.
***REMOVED*** @return {*} In record mode, returns the mock object. In replay mode, returns
***REMOVED***    whatever the creator of the mock set as the return value.
***REMOVED***
goog.testing.Mock.prototype.$mockMethod = function(name) {
  try {
    // Shift off the name argument so that args contains the arguments to
    // the mocked method.
    var args = goog.array.slice(arguments, 1);
    if (this.$recording_) {
      this.$pendingExpectation = new goog.testing.MockExpectation(name);
      this.$pendingExpectation.argumentList = args;
      this.$recordExpectation();
      return this;
    } else {
      return this.$recordCall(name, args);
    }
  } catch (ex) {
    this.$recordAndThrow(ex);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Records the currently pending expectation, intended to be overridden by a
***REMOVED*** subclass.
***REMOVED*** @protected
***REMOVED***
goog.testing.Mock.prototype.$recordExpectation = function() {***REMOVED***


***REMOVED***
***REMOVED*** Records an actual method call, intended to be overridden by a
***REMOVED*** subclass. The subclass must find the pending expectation and return the
***REMOVED*** correct value.
***REMOVED*** @param {string} name The name of the method being called.
***REMOVED*** @param {Array} args The arguments to the method.
***REMOVED*** @return {*} The return expected by the mock.
***REMOVED*** @protected
***REMOVED***
goog.testing.Mock.prototype.$recordCall = function(name, args) {
  return undefined;
***REMOVED***


***REMOVED***
***REMOVED*** If the expectation expects to throw, this method will throw.
***REMOVED*** @param {goog.testing.MockExpectation} expectation The expectation.
***REMOVED***
goog.testing.Mock.prototype.$maybeThrow = function(expectation) {
  if (typeof expectation.exceptionToThrow != 'undefined') {
    throw expectation.exceptionToThrow;
  }
***REMOVED***


***REMOVED***
***REMOVED*** If this expectation defines a function to be called,
***REMOVED*** it will be called and its result will be returned.
***REMOVED*** Otherwise, if the expectation expects to throw, it will throw.
***REMOVED*** Otherwise, this method will return defined value.
***REMOVED*** @param {goog.testing.MockExpectation} expectation The expectation.
***REMOVED*** @param {Array} args The arguments to the method.
***REMOVED*** @return {*} The return value expected by the mock.
***REMOVED***
goog.testing.Mock.prototype.$do = function(expectation, args) {
  if (typeof expectation.toDo == 'undefined') {
    this.$maybeThrow(expectation);
    return expectation.returnValue;
  } else {
    return expectation.toDo.apply(this, args);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Specifies a return value for the currently pending expectation.
***REMOVED*** @param {*} val The return value.
***REMOVED*** @return {goog.testing.Mock} This mock object.
***REMOVED***
goog.testing.Mock.prototype.$returns = function(val) {
  this.$pendingExpectation.returnValue = val;
  return this;
***REMOVED***


***REMOVED***
***REMOVED*** Specifies a value for the currently pending expectation to throw.
***REMOVED*** @param {*} val The value to throw.
***REMOVED*** @return {goog.testing.Mock} This mock object.
***REMOVED***
goog.testing.Mock.prototype.$throws = function(val) {
  this.$pendingExpectation.exceptionToThrow = val;
  return this;
***REMOVED***


***REMOVED***
***REMOVED*** Specifies a function to call for currently pending expectation.
***REMOVED*** Note, that using this method overrides declarations made
***REMOVED*** using $returns() and $throws() methods.
***REMOVED*** @param {Function} func The function to call.
***REMOVED*** @return {goog.testing.Mock} This mock object.
***REMOVED***
goog.testing.Mock.prototype.$does = function(func) {
  this.$pendingExpectation.toDo = func;
  return this;
***REMOVED***


***REMOVED***
***REMOVED*** Allows the expectation to be called 0 or 1 times.
***REMOVED*** @return {goog.testing.Mock} This mock object.
***REMOVED***
goog.testing.Mock.prototype.$atMostOnce = function() {
  this.$pendingExpectation.minCalls = 0;
  this.$pendingExpectation.maxCalls = 1;
  return this;
***REMOVED***


***REMOVED***
***REMOVED*** Allows the expectation to be called any number of times, as long as it's
***REMOVED*** called once.
***REMOVED*** @return {goog.testing.Mock} This mock object.
***REMOVED***
goog.testing.Mock.prototype.$atLeastOnce = function() {
  this.$pendingExpectation.maxCalls = Infinity;
  return this;
***REMOVED***


***REMOVED***
***REMOVED*** Allows the expectation to be called any number of times.
***REMOVED*** @return {goog.testing.Mock} This mock object.
***REMOVED***
goog.testing.Mock.prototype.$anyTimes = function() {
  this.$pendingExpectation.minCalls = 0;
  this.$pendingExpectation.maxCalls = Infinity;
  return this;
***REMOVED***


***REMOVED***
***REMOVED*** Specifies the number of times the expectation should be called.
***REMOVED*** @param {number} times The number of times this method will be called.
***REMOVED*** @return {goog.testing.Mock} This mock object.
***REMOVED***
goog.testing.Mock.prototype.$times = function(times) {
  this.$pendingExpectation.minCalls = times;
  this.$pendingExpectation.maxCalls = times;
  return this;
***REMOVED***


***REMOVED***
***REMOVED*** Switches from recording to replay mode.
***REMOVED*** @override
***REMOVED***
goog.testing.Mock.prototype.$replay = function() {
  this.$recording_ = false;
***REMOVED***


***REMOVED***
***REMOVED*** Resets the state of this mock object. This clears all pending expectations
***REMOVED*** without verifying, and puts the mock in recording mode.
***REMOVED*** @override
***REMOVED***
goog.testing.Mock.prototype.$reset = function() {
  this.$recording_ = true;
  this.$threwException_ = null;
  delete this.$pendingExpectation;
***REMOVED***


***REMOVED***
***REMOVED*** Throws an exception and records that an exception was thrown.
***REMOVED*** @param {string} comment A short comment about the exception.
***REMOVED*** @param {?string=} opt_message A longer message about the exception.
***REMOVED*** @throws {Object} JsUnitException object.
***REMOVED*** @protected
***REMOVED***
goog.testing.Mock.prototype.$throwException = function(comment, opt_message) {
  this.$recordAndThrow(new goog.testing.JsUnitException(comment, opt_message));
***REMOVED***


***REMOVED***
***REMOVED*** Throws an exception and records that an exception was thrown.
***REMOVED*** @param {Object} ex Exception.
***REMOVED*** @throws {Object} #ex.
***REMOVED*** @protected
***REMOVED***
goog.testing.Mock.prototype.$recordAndThrow = function(ex) {
  // If it's an assert exception, record it.
  if (ex['isJsUnitException']) {
    var testRunner = goog.global['G_testRunner'];
    if (testRunner) {
      var logTestFailureFunction = testRunner['logTestFailure'];
      if (logTestFailureFunction) {
        logTestFailureFunction.call(testRunner, ex);
      }
    }

    if (!this.$threwException_) {
      // Only remember first exception thrown.
      this.$threwException_ = ex;
    }
  }
  throw ex;
***REMOVED***


***REMOVED***
***REMOVED*** Verify that all of the expectations were met. Should be overridden by
***REMOVED*** subclasses.
***REMOVED*** @override
***REMOVED***
goog.testing.Mock.prototype.$verify = function() {
  if (this.$threwException_) {
    throw this.$threwException_;
  }
***REMOVED***


***REMOVED***
***REMOVED*** Verifies that a method call matches an expectation.
***REMOVED*** @param {goog.testing.MockExpectation} expectation The expectation to check.
***REMOVED*** @param {string} name The name of the called method.
***REMOVED*** @param {Array.<*>?} args The arguments passed to the mock.
***REMOVED*** @return {boolean} Whether the call matches the expectation.
***REMOVED***
goog.testing.Mock.prototype.$verifyCall = function(expectation, name, args) {
  if (expectation.name != name) {
    return false;
  }
  var verifierFn =
      this.$argumentListVerifiers_.hasOwnProperty(expectation.name) ?
      this.$argumentListVerifiers_[expectation.name] :
      goog.testing.mockmatchers.flexibleArrayMatcher;

  return verifierFn(expectation.argumentList, args, expectation);
***REMOVED***


***REMOVED***
***REMOVED*** Render the provided argument array to a string to help
***REMOVED*** clients with debugging tests.
***REMOVED*** @param {Array.<*>?} args The arguments passed to the mock.
***REMOVED*** @return {string} Human-readable string.
***REMOVED***
goog.testing.Mock.prototype.$argumentsAsString = function(args) {
  var retVal = [];
  for (var i = 0; i < args.length; i++) {
    try {
      retVal.push(goog.typeOf(args[i]));
    } catch (e) {
      retVal.push('[unknown]');
    }
  }
  return '(' + retVal.join(', ') + ')';
***REMOVED***


***REMOVED***
***REMOVED*** Throw an exception based on an incorrect method call.
***REMOVED*** @param {string} name Name of method called.
***REMOVED*** @param {Array.<*>?} args Arguments passed to the mock.
***REMOVED*** @param {goog.testing.MockExpectation=} opt_expectation Expected next call,
***REMOVED***     if any.
***REMOVED***
goog.testing.Mock.prototype.$throwCallException = function(name, args,
                                                           opt_expectation) {
  var errorStringBuffer = [];
  var actualArgsString = this.$argumentsAsString(args);
  var expectedArgsString = opt_expectation ?
      this.$argumentsAsString(opt_expectation.argumentList) : '';

  if (opt_expectation && opt_expectation.name == name) {
    errorStringBuffer.push('Bad arguments to ', name, '().\n',
                           'Actual: ', actualArgsString, '\n',
                           'Expected: ', expectedArgsString, '\n',
                           opt_expectation.getErrorMessage());
  } else {
    errorStringBuffer.push('Unexpected call to ', name,
                           actualArgsString, '.');
    if (opt_expectation) {
      errorStringBuffer.push('\nNext expected call was to ',
                             opt_expectation.name,
                             expectedArgsString);
    }
  }
  this.$throwException(errorStringBuffer.join(''));
***REMOVED***
