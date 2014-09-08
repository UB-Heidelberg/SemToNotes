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
***REMOVED*** @fileoverview A MockControl holds a set of mocks for a particular test.
***REMOVED*** It consolidates calls to $replay, $verify, and $tearDown, which simplifies
***REMOVED*** the test and helps avoid omissions.
***REMOVED***
***REMOVED*** You can create and control a mock:
***REMOVED***   var mockFoo = mockControl.addMock(new MyMock(Foo));
***REMOVED***
***REMOVED*** MockControl also exposes some convenience functions that create
***REMOVED*** controlled mocks for common mocks: StrictMock, LooseMock,
***REMOVED*** FunctionMock, MethodMock, and GlobalFunctionMock.
***REMOVED***
***REMOVED***


goog.provide('goog.testing.MockControl');

goog.require('goog.array');
goog.require('goog.testing');
goog.require('goog.testing.LooseMock');
goog.require('goog.testing.StrictMock');



***REMOVED***
***REMOVED*** Controls a set of mocks.  Controlled mocks are replayed, verified, and
***REMOVED*** cleaned-up at the same time.
***REMOVED***
***REMOVED***
goog.testing.MockControl = function() {
 ***REMOVED*****REMOVED***
  ***REMOVED*** The list of mocks being controlled.
  ***REMOVED*** @type {Array.<goog.testing.MockInterface>}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.mocks_ = [];
***REMOVED***


***REMOVED***
***REMOVED*** Takes control of this mock.
***REMOVED*** @param {goog.testing.MockInterface} mock Mock to be controlled.
***REMOVED*** @return {goog.testing.MockInterface} The same mock passed in,
***REMOVED***     for convenience.
***REMOVED***
goog.testing.MockControl.prototype.addMock = function(mock) {
  this.mocks_.push(mock);
  return mock;
***REMOVED***


***REMOVED***
***REMOVED*** Calls replay on each controlled mock.
***REMOVED***
goog.testing.MockControl.prototype.$replayAll = function() {
  goog.array.forEach(this.mocks_, function(m) {
    m.$replay();
  });
***REMOVED***


***REMOVED***
***REMOVED*** Calls reset on each controlled mock.
***REMOVED***
goog.testing.MockControl.prototype.$resetAll = function() {
  goog.array.forEach(this.mocks_, function(m) {
    m.$reset();
  });
***REMOVED***


***REMOVED***
***REMOVED*** Calls verify on each controlled mock.
***REMOVED***
goog.testing.MockControl.prototype.$verifyAll = function() {
  goog.array.forEach(this.mocks_, function(m) {
    m.$verify();
  });
***REMOVED***


***REMOVED***
***REMOVED*** Calls tearDown on each controlled mock, if necesssary.
***REMOVED***
goog.testing.MockControl.prototype.$tearDown = function() {
  goog.array.forEach(this.mocks_, function(m) {
    // $tearDown if defined.
    if (m.$tearDown) {
      m.$tearDown();
    }
    // TODO(user): Somehow determine if verifyAll should have been called
    // but was not.
  });
***REMOVED***


***REMOVED***
***REMOVED*** Creates a controlled StrictMock.  Passes its arguments through to the
***REMOVED*** StrictMock constructor.
***REMOVED*** @param {Object|Function} objectToMock The object that should be mocked, or
***REMOVED***    the constructor of an object to mock.
***REMOVED*** @param {boolean=} opt_mockStaticMethods An optional argument denoting that
***REMOVED***     a mock should be constructed from the static functions of a class.
***REMOVED*** @param {boolean=} opt_createProxy An optional argument denoting that
***REMOVED***     a proxy for the target mock should be created.
***REMOVED*** @return {!goog.testing.StrictMock} The mock object.
***REMOVED***
goog.testing.MockControl.prototype.createStrictMock = function(
    objectToMock, opt_mockStaticMethods, opt_createProxy) {
  var m = new goog.testing.StrictMock(objectToMock, opt_mockStaticMethods,
                                      opt_createProxy);
  this.addMock(m);
  return m;
***REMOVED***


***REMOVED***
***REMOVED*** Creates a controlled LooseMock.  Passes its arguments through to the
***REMOVED*** LooseMock constructor.
***REMOVED*** @param {Object|Function} objectToMock The object that should be mocked, or
***REMOVED***    the constructor of an object to mock.
***REMOVED*** @param {boolean=} opt_ignoreUnexpectedCalls Whether to ignore unexpected
***REMOVED***     calls.
***REMOVED*** @param {boolean=} opt_mockStaticMethods An optional argument denoting that
***REMOVED***     a mock should be constructed from the static functions of a class.
***REMOVED*** @param {boolean=} opt_createProxy An optional argument denoting that
***REMOVED***     a proxy for the target mock should be created.
***REMOVED*** @return {!goog.testing.LooseMock} The mock object.
***REMOVED***
goog.testing.MockControl.prototype.createLooseMock = function(
    objectToMock, opt_ignoreUnexpectedCalls,
    opt_mockStaticMethods, opt_createProxy) {
  var m = new goog.testing.LooseMock(objectToMock, opt_ignoreUnexpectedCalls,
                                     opt_mockStaticMethods, opt_createProxy);
  this.addMock(m);
  return m;
***REMOVED***


***REMOVED***
***REMOVED*** Creates a controlled FunctionMock.  Passes its arguments through to the
***REMOVED*** FunctionMock constructor.
***REMOVED*** @param {string=} opt_functionName The optional name of the function to mock
***REMOVED***     set to '[anonymous mocked function]' if not passed in.
***REMOVED*** @param {number=} opt_strictness One of goog.testing.Mock.LOOSE or
***REMOVED***     goog.testing.Mock.STRICT. The default is STRICT.
***REMOVED*** @return {goog.testing.MockInterface} The mocked function.
***REMOVED***
goog.testing.MockControl.prototype.createFunctionMock = function(
    opt_functionName, opt_strictness) {
  var m = goog.testing.createFunctionMock(opt_functionName, opt_strictness);
  this.addMock(m);
  return m;
***REMOVED***


***REMOVED***
***REMOVED*** Creates a controlled MethodMock.  Passes its arguments through to the
***REMOVED*** MethodMock constructor.
***REMOVED*** @param {Object} scope The scope of the method to be mocked out.
***REMOVED*** @param {string} functionName The name of the function we're going to mock.
***REMOVED*** @param {number=} opt_strictness One of goog.testing.Mock.LOOSE or
***REMOVED***     goog.testing.Mock.STRICT. The default is STRICT.
***REMOVED*** @return {!goog.testing.MockInterface} The mocked method.
***REMOVED***
goog.testing.MockControl.prototype.createMethodMock = function(
    scope, functionName, opt_strictness) {
  var m = goog.testing.createMethodMock(scope, functionName, opt_strictness);
  this.addMock(m);
  return m;
***REMOVED***


***REMOVED***
***REMOVED*** Creates a controlled MethodMock for a constructor.  Passes its arguments
***REMOVED*** through to the MethodMock constructor. See
***REMOVED*** {@link goog.testing.createConstructorMock} for details.
***REMOVED*** @param {Object} scope The scope of the constructor to be mocked out.
***REMOVED*** @param {string} constructorName The name of the function we're going to mock.
***REMOVED*** @param {number=} opt_strictness One of goog.testing.Mock.LOOSE or
***REMOVED***     goog.testing.Mock.STRICT. The default is STRICT.
***REMOVED*** @return {!goog.testing.MockInterface} The mocked method.
***REMOVED***
goog.testing.MockControl.prototype.createConstructorMock = function(
    scope, constructorName, opt_strictness) {
  var m = goog.testing.createConstructorMock(scope, constructorName,
                                             opt_strictness);
  this.addMock(m);
  return m;
***REMOVED***


***REMOVED***
***REMOVED*** Creates a controlled GlobalFunctionMock.  Passes its arguments through to the
***REMOVED*** GlobalFunctionMock constructor.
***REMOVED*** @param {string} functionName The name of the function we're going to mock.
***REMOVED*** @param {number=} opt_strictness One of goog.testing.Mock.LOOSE or
***REMOVED***     goog.testing.Mock.STRICT. The default is STRICT.
***REMOVED*** @return {goog.testing.MockInterface} The mocked function.
***REMOVED***
goog.testing.MockControl.prototype.createGlobalFunctionMock = function(
    functionName, opt_strictness) {
  var m = goog.testing.createGlobalFunctionMock(functionName, opt_strictness);
  this.addMock(m);
  return m;
***REMOVED***
