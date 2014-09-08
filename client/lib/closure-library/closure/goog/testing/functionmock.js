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
***REMOVED*** @fileoverview Enable mocking of functions not attached to objects
***REMOVED*** whether they be global / top-level or anonymous methods / closures.
***REMOVED***
***REMOVED*** See the unit tests for usage.
***REMOVED***
***REMOVED***

goog.provide('goog.testing');
goog.provide('goog.testing.FunctionMock');
goog.provide('goog.testing.GlobalFunctionMock');
goog.provide('goog.testing.MethodMock');

goog.require('goog.object');
goog.require('goog.testing.LooseMock');
goog.require('goog.testing.Mock');
goog.require('goog.testing.MockInterface');
goog.require('goog.testing.PropertyReplacer');
goog.require('goog.testing.StrictMock');


***REMOVED***
***REMOVED*** Class used to mock a function. Useful for mocking closures and anonymous
***REMOVED*** callbacks etc. Creates a function object that extends goog.testing.Mock.
***REMOVED*** @param {string=} opt_functionName The optional name of the function to mock.
***REMOVED***     Set to '[anonymous mocked function]' if not passed in.
***REMOVED*** @param {number=} opt_strictness One of goog.testing.Mock.LOOSE or
***REMOVED***     goog.testing.Mock.STRICT. The default is STRICT.
***REMOVED*** @return {goog.testing.MockInterface} The mocked function.
***REMOVED*** @suppress {missingProperties} Mocks do not fit in the type system well.
***REMOVED***
goog.testing.FunctionMock = function(opt_functionName, opt_strictness) {
  var fn = function() {
    var args = Array.prototype.slice.call(arguments);
    args.splice(0, 0, opt_functionName || '[anonymous mocked function]');
    return fn.$mockMethod.apply(fn, args);
 ***REMOVED*****REMOVED***
  var base = opt_strictness === goog.testing.Mock.LOOSE ?
      goog.testing.LooseMock : goog.testing.StrictMock;
  goog.object.extend(fn, new base({}));

  return***REMOVED*****REMOVED*** @type {goog.testing.MockInterface}***REMOVED*** (fn);
***REMOVED***


***REMOVED***
***REMOVED*** Mocks an existing function. Creates a goog.testing.FunctionMock
***REMOVED*** and registers it in the given scope with the name specified by functionName.
***REMOVED*** @param {Object} scope The scope of the method to be mocked out.
***REMOVED*** @param {string} functionName The name of the function we're going to mock.
***REMOVED*** @param {number=} opt_strictness One of goog.testing.Mock.LOOSE or
***REMOVED***     goog.testing.Mock.STRICT. The default is STRICT.
***REMOVED*** @return {!goog.testing.MockInterface} The mocked method.
***REMOVED***
goog.testing.MethodMock = function(scope, functionName, opt_strictness) {
  if (!(functionName in scope)) {
    throw Error(functionName + ' is not a property of the given scope.');
  }

  var fn = goog.testing.FunctionMock(functionName, opt_strictness);

  fn.$propertyReplacer_ = new goog.testing.PropertyReplacer();
  fn.$propertyReplacer_.set(scope, functionName, fn);
  fn.$tearDown = goog.testing.MethodMock.$tearDown;

  return fn;
***REMOVED***


***REMOVED***
***REMOVED*** Resets the global function that we mocked back to its original state.
***REMOVED*** @this {goog.testing.MockInterface}
***REMOVED***
goog.testing.MethodMock.$tearDown = function() {
  this.$propertyReplacer_.reset();
***REMOVED***


***REMOVED***
***REMOVED*** Mocks a global / top-level function. Creates a goog.testing.MethodMock
***REMOVED*** in the global scope with the name specified by functionName.
***REMOVED*** @param {string} functionName The name of the function we're going to mock.
***REMOVED*** @param {number=} opt_strictness One of goog.testing.Mock.LOOSE or
***REMOVED***     goog.testing.Mock.STRICT. The default is STRICT.
***REMOVED*** @return {!goog.testing.MockInterface} The mocked global function.
***REMOVED***
goog.testing.GlobalFunctionMock = function(functionName, opt_strictness) {
  return goog.testing.MethodMock(goog.global, functionName, opt_strictness);
***REMOVED***


***REMOVED***
***REMOVED*** Convenience method for creating a mock for a function.
***REMOVED*** @param {string=} opt_functionName The optional name of the function to mock
***REMOVED***     set to '[anonymous mocked function]' if not passed in.
***REMOVED*** @param {number=} opt_strictness One of goog.testing.Mock.LOOSE or
***REMOVED***     goog.testing.Mock.STRICT. The default is STRICT.
***REMOVED*** @return {goog.testing.MockInterface} The mocked function.
***REMOVED***
goog.testing.createFunctionMock = function(opt_functionName, opt_strictness) {
  return goog.testing.FunctionMock(opt_functionName, opt_strictness);
***REMOVED***


***REMOVED***
***REMOVED*** Convenience method for creating a mock for a method.
***REMOVED*** @param {Object} scope The scope of the method to be mocked out.
***REMOVED*** @param {string} functionName The name of the function we're going to mock.
***REMOVED*** @param {number=} opt_strictness One of goog.testing.Mock.LOOSE or
***REMOVED***     goog.testing.Mock.STRICT. The default is STRICT.
***REMOVED*** @return {!goog.testing.MockInterface} The mocked global function.
***REMOVED***
goog.testing.createMethodMock = function(scope, functionName, opt_strictness) {
  return goog.testing.MethodMock(scope, functionName, opt_strictness);
***REMOVED***


***REMOVED***
***REMOVED*** Convenience method for creating a mock for a constructor. Copies class
***REMOVED*** members to the mock.
***REMOVED***
***REMOVED*** <p>When mocking a constructor to return a mocked instance, remember to create
***REMOVED*** the instance mock before mocking the constructor. If you mock the constructor
***REMOVED*** first, then the mock framework will be unable to examine the prototype chain
***REMOVED*** when creating the mock instance.
***REMOVED*** @param {Object} scope The scope of the constructor to be mocked out.
***REMOVED*** @param {string} constructorName The name of the constructor we're going to
***REMOVED***     mock.
***REMOVED*** @param {number=} opt_strictness One of goog.testing.Mock.LOOSE or
***REMOVED***     goog.testing.Mock.STRICT. The default is STRICT.
***REMOVED*** @return {!goog.testing.MockInterface} The mocked constructor.
***REMOVED***
goog.testing.createConstructorMock = function(scope, constructorName,
                                              opt_strictness) {
  var realConstructor = scope[constructorName];
  var constructorMock = goog.testing.MethodMock(scope, constructorName,
                                                opt_strictness);

  // Copy class members from the real constructor to the mock. Do not copy
  // the closure superClass_ property (see goog.inherits), the built-in
  // prototype property, or properties added to Function.prototype
  // (see goog.MODIFY_FUNCTION_PROTOTYPES in closure/base.js).
  for (var property in realConstructor) {
    if (property != 'superClass_' &&
        property != 'prototype' &&
        realConstructor.hasOwnProperty(property)) {
      constructorMock[property] = realConstructor[property];
    }
  }
  return constructorMock;
***REMOVED***


***REMOVED***
***REMOVED*** Convenience method for creating a mocks for a global / top-level function.
***REMOVED*** @param {string} functionName The name of the function we're going to mock.
***REMOVED*** @param {number=} opt_strictness One of goog.testing.Mock.LOOSE or
***REMOVED***     goog.testing.Mock.STRICT. The default is STRICT.
***REMOVED*** @return {goog.testing.MockInterface} The mocked global function.
***REMOVED***
goog.testing.createGlobalFunctionMock = function(functionName, opt_strictness) {
  return goog.testing.GlobalFunctionMock(functionName, opt_strictness);
***REMOVED***
