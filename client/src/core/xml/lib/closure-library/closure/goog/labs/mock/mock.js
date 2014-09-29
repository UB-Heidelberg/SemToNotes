// Copyright 2012 The Closure Library Authors. All Rights Reserved.
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
***REMOVED*** @fileoverview Provides a mocking framework in Closure to make unit tests easy
***REMOVED*** to write and understand. The methods provided here can be used to replace
***REMOVED*** implementations of existing objects with 'mock' objects to abstract out
***REMOVED*** external services and dependencies thereby isolating the code under test.
***REMOVED*** Apart from mocking, methods are also provided to just monitor calls to an
***REMOVED*** object (spying) and returning specific values for some or all the inputs to
***REMOVED*** methods (stubbing).
***REMOVED***
***REMOVED*** Design doc : http://go/closuremock
***REMOVED***
***REMOVED***


goog.provide('goog.labs.mock');

goog.require('goog.array');
goog.require('goog.debug.Error');
goog.require('goog.functions');


***REMOVED***
***REMOVED*** Mocks a given object or class.
***REMOVED***
***REMOVED*** @param {!Object} objectOrClass An instance or a constructor of a class to be
***REMOVED***     mocked.
***REMOVED*** @return {!Object} The mocked object.
***REMOVED***
goog.labs.mock = function(objectOrClass) {
  // Go over properties of 'objectOrClass' and create a MockManager to
  // be used for stubbing out calls to methods.
  var mockObjectManager = new goog.labs.mock.MockObjectManager_(objectOrClass);
  var mockedObject = mockObjectManager.getMockedItem();
  goog.asserts.assertObject(mockedObject);
  return***REMOVED*****REMOVED*** @type {!Object}***REMOVED*** (mockedObject);
***REMOVED***


***REMOVED***
***REMOVED*** Mocks a given function.
***REMOVED***
***REMOVED*** @param {!Function} func A function to be mocked.
***REMOVED*** @return {!Function} The mocked function.
***REMOVED***
goog.labs.mockFunction = function(func) {
  var mockFuncManager = new goog.labs.mock.MockFunctionManager_(func);
  var mockedFunction = mockFuncManager.getMockedItem();
  goog.asserts.assertFunction(mockedFunction);
  return***REMOVED*****REMOVED*** @type {!Function}***REMOVED*** (mockedFunction);
***REMOVED***


***REMOVED***
***REMOVED*** Spies on a given object.
***REMOVED***
***REMOVED*** @param {!Object} obj The object to be spied on.
***REMOVED*** @return {!Object} The spy object.
***REMOVED***
goog.labs.mock.spy = function(obj) {
  // Go over properties of 'obj' and create a MockSpyManager_ to
  // be used for spying on calls to methods.
  var mockSpyManager = new goog.labs.mock.MockSpyManager_(obj);
  var spyObject = mockSpyManager.getMockedItem();
  goog.asserts.assert(spyObject);
  return spyObject;
***REMOVED***


***REMOVED***
***REMOVED*** Returns an object that can be used to verify calls to specific methods of a
***REMOVED*** given mock.
***REMOVED***
***REMOVED*** @param {!Object} obj The mocked object.
***REMOVED*** @return {!Object} The verifier.
***REMOVED***
goog.labs.mock.verify = function(obj) {
  return obj.$callVerifier;
***REMOVED***



***REMOVED***
***REMOVED*** Error thrown when verification failed.
***REMOVED***
***REMOVED***
***REMOVED*** @extends {goog.debug.Error}
***REMOVED***
goog.labs.mock.VerificationError = function() {
  goog.base(this, 'Verification failed!');
***REMOVED***
goog.inherits(goog.labs.mock.VerificationError, goog.debug.Error);


***REMOVED***
***REMOVED*** This array contains the name of the functions that are part of the base
***REMOVED*** Object prototype.
***REMOVED*** Basically a copy of goog.object.PROTOTYPE_FIELDS_.
***REMOVED*** @const
***REMOVED*** @type {!Array.<string>}
***REMOVED*** @private
***REMOVED***
goog.labs.mock.PROTOTYPE_FIELDS_ = [
  'constructor',
  'hasOwnProperty',
  'isPrototypeOf',
  'propertyIsEnumerable',
  'toLocaleString',
  'toString',
  'valueOf'
];



***REMOVED***
***REMOVED*** Base class that provides basic functionality for creating, adding and
***REMOVED*** finding bindings, offering an executor method that is called when a call to
***REMOVED*** the stub is made, an array to hold the bindings and the mocked item, among
***REMOVED*** other things.
***REMOVED***
***REMOVED***
***REMOVED*** @private
***REMOVED***
goog.labs.mock.MockManager_ = function() {
 ***REMOVED*****REMOVED***
  ***REMOVED*** Proxies the methods for the mocked object or class to execute the stubs.
  ***REMOVED*** @type {!Object}
  ***REMOVED*** @protected
  ***REMOVED*** TODO(user): make instanceof work.
 ***REMOVED*****REMOVED***
  this.mockedItem = {***REMOVED***

 ***REMOVED*****REMOVED***
  ***REMOVED*** A reference to the object or function being mocked.
  ***REMOVED*** @type {Object|Function}
  ***REMOVED*** @protected
 ***REMOVED*****REMOVED***
  this.mockee = null;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Holds the stub bindings established so far.
  ***REMOVED*** @protected
 ***REMOVED*****REMOVED***
  this.methodBindings = [];

 ***REMOVED*****REMOVED***
  ***REMOVED*** Holds a reference to the binder used to define stubs.
  ***REMOVED*** @protected
 ***REMOVED*****REMOVED***
  this.$stubBinder = null;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Record method calls with no stub definitions.
  ***REMOVED*** @type {!Array.<!goog.labs.mock.MethodBinding_>}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.callRecords_ = [];
***REMOVED***


***REMOVED***
***REMOVED*** Handles the first step in creating a stub, returning a stub-binder that
***REMOVED*** is later used to bind a stub for a method.
***REMOVED***
***REMOVED*** @param {string} methodName The name of the method being bound.
***REMOVED*** @param {...} var_args The arguments to the method.
***REMOVED*** @return {!goog.labs.mock.StubBinder_} The stub binder.
***REMOVED*** @private
***REMOVED***
goog.labs.mock.MockManager_.prototype.handleMockCall_ =
    function(methodName, var_args) {
  var args = goog.array.slice(arguments, 1);
  return new goog.labs.mock.StubBinder_(this, methodName, args);
***REMOVED***


***REMOVED***
***REMOVED*** Returns the mock object. This should have a stubbed method for each method
***REMOVED*** on the object being mocked.
***REMOVED***
***REMOVED*** @return {!Object|!Function} The mock object.
***REMOVED***
goog.labs.mock.MockManager_.prototype.getMockedItem = function() {
  return this.mockedItem;
***REMOVED***


***REMOVED***
***REMOVED*** Adds a binding for the method name and arguments to be stubbed.
***REMOVED***
***REMOVED*** @param {?string} methodName The name of the stubbed method.
***REMOVED*** @param {!Array} args The arguments passed to the method.
***REMOVED*** @param {!Function} func The stub function.
***REMOVED***
***REMOVED***
goog.labs.mock.MockManager_.prototype.addBinding =
    function(methodName, args, func) {
  var binding = new goog.labs.mock.MethodBinding_(methodName, args, func);
  this.methodBindings.push(binding);
***REMOVED***


***REMOVED***
***REMOVED*** Returns a stub, if defined, for the method name and arguments passed in.
***REMOVED***
***REMOVED*** @param {string} methodName The name of the stubbed method.
***REMOVED*** @param {!Array} args The arguments passed to the method.
***REMOVED*** @return {Function} The stub function or undefined.
***REMOVED*** @protected
***REMOVED***
goog.labs.mock.MockManager_.prototype.findBinding =
    function(methodName, args) {
  var stub = goog.array.find(this.methodBindings, function(binding) {
    return binding.matches(methodName, args, false /* isVerification***REMOVED***);
  });
  return stub && stub.getStub();
***REMOVED***


***REMOVED***
***REMOVED*** Returns a stub, if defined, for the method name and arguments passed in as
***REMOVED*** parameters.
***REMOVED***
***REMOVED*** @param {string} methodName The name of the stubbed method.
***REMOVED*** @param {!Array} args The arguments passed to the method.
***REMOVED*** @return {Function} The stub function or undefined.
***REMOVED*** @protected
***REMOVED***
goog.labs.mock.MockManager_.prototype.getExecutor = function(methodName, args) {
  return this.findBinding(methodName, args);
***REMOVED***


***REMOVED***
***REMOVED*** Looks up the list of stubs defined on the mock object and executes the
***REMOVED*** function associated with that stub.
***REMOVED***
***REMOVED*** @param {string} methodName The name of the method to execute.
***REMOVED*** @param {...} var_args The arguments passed to the method.
***REMOVED*** @return {*} Value returned by the stub function.
***REMOVED*** @protected
***REMOVED***
goog.labs.mock.MockManager_.prototype.executeStub =
    function(methodName, var_args) {
  var args = goog.array.slice(arguments, 1);

  // Record this call
  this.recordCall_(methodName, args);

  var func = this.getExecutor(methodName, args);
  if (func) {
    return func.apply(null, args);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Records a call to 'methodName' with arguments 'args'.
***REMOVED***
***REMOVED*** @param {string} methodName The name of the called method.
***REMOVED*** @param {!Array} args The array of arguments.
***REMOVED*** @private
***REMOVED***
goog.labs.mock.MockManager_.prototype.recordCall_ =
    function(methodName, args) {
  var callRecord = new goog.labs.mock.MethodBinding_(methodName, args,
      goog.nullFunction);

  this.callRecords_.push(callRecord);
***REMOVED***


***REMOVED***
***REMOVED*** Verify invocation of a method with specific arguments.
***REMOVED***
***REMOVED*** @param {string} methodName The name of the method.
***REMOVED*** @param {...} var_args The arguments passed.
***REMOVED*** @return {!Function} The stub, if defined, or the spy method.
***REMOVED*** @protected
***REMOVED***
goog.labs.mock.MockManager_.prototype.verifyInvocation =
    function(methodName, var_args) {
  var args = goog.array.slice(arguments, 1);
  var binding = goog.array.find(this.callRecords_, function(binding) {
    return binding.matches(methodName, args, true /* isVerification***REMOVED***);
  });

  if (!binding) {
    throw new goog.labs.mock.VerificationError();
  }
***REMOVED***



***REMOVED***
***REMOVED*** Sets up mock for the given object (or class), stubbing out all the defined
***REMOVED*** methods. By default, all stubs return {@code undefined}, though stubs can be
***REMOVED*** later defined using {@code goog.labs.mock.when}.
***REMOVED***
***REMOVED*** @param {!Object|!Function} objOrClass The object or class to set up the mock
***REMOVED***     for. A class is a constructor function.
***REMOVED***
***REMOVED***
***REMOVED*** @extends {goog.labs.mock.MockManager_}
***REMOVED*** @private
***REMOVED***
goog.labs.mock.MockObjectManager_ = function(objOrClass) {
  goog.base(this);

 ***REMOVED*****REMOVED***
  ***REMOVED*** Proxies the calls to establish the first step of the stub bindings (object
  ***REMOVED*** and method name)
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.objectStubBinder_ = {***REMOVED***

  this.mockee = objOrClass;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The call verifier is used to verify the calls. It maps property names to
  ***REMOVED*** the method that does call verification.
  ***REMOVED*** @type {!Object.<string, function(string, ...)>}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.objectCallVerifier_ = {***REMOVED***

  var obj;
  if (goog.isFunction(objOrClass)) {
    // Create a temporary subclass with a no-op constructor so that we can
    // create an instance and determine what methods it has.
   ***REMOVED*****REMOVED*** @constructor***REMOVED***
    var tempCtor = function() {***REMOVED***
    goog.inherits(tempCtor, objOrClass);
    obj = new tempCtor();
  } else {
    obj = objOrClass;
  }

  var enumerableProperties = goog.object.getKeys(obj);
  // The non enumerable properties are added due to the fact that IE8 does not
  // enumerate any of the prototype Object functions even when overriden and
  // mocking these is sometimes needed.
  for (var i = 0; i < goog.labs.mock.PROTOTYPE_FIELDS_.length; i++) {
    var prop = goog.labs.mock.PROTOTYPE_FIELDS_[i];
    if (!goog.array.contains(enumerableProperties, prop)) {
      enumerableProperties.push(prop);
    }
  }

  // Adds the properties to the mock, creating a proxy stub for each method on
  // the instance.
  for (var i = 0; i < enumerableProperties.length; i++) {
    var prop = enumerableProperties[i];
    if (goog.isFunction(obj[prop])) {
      this.mockedItem[prop] = goog.bind(this.executeStub, this, prop);
      // The stub binder used to create bindings.
      this.objectStubBinder_[prop] =
          goog.bind(this.handleMockCall_, this, prop);
      // The verifier verifies the calls.
      this.objectCallVerifier_[prop] =
          goog.bind(this.verifyInvocation, this, prop);
    }
  }
  // The alias for stub binder exposed to the world.
  this.mockedItem.$stubBinder = this.objectStubBinder_;

  // The alias for verifier for the world.
  this.mockedItem.$callVerifier = this.objectCallVerifier_;
***REMOVED***
goog.inherits(goog.labs.mock.MockObjectManager_,
              goog.labs.mock.MockManager_);



***REMOVED***
***REMOVED*** Sets up the spying behavior for the given object.
***REMOVED***
***REMOVED*** @param {!Object} obj The object to be spied on.
***REMOVED***
***REMOVED***
***REMOVED*** @extends {goog.labs.mock.MockObjectManager_}
***REMOVED*** @private
***REMOVED***
goog.labs.mock.MockSpyManager_ = function(obj) {
  goog.base(this, obj);
***REMOVED***
goog.inherits(goog.labs.mock.MockSpyManager_,
              goog.labs.mock.MockObjectManager_);


***REMOVED***
***REMOVED*** Return a stub, if defined, for the method and arguments passed in. If we lack
***REMOVED*** a stub, instead look for a call record that matches the method and arguments.
***REMOVED***
***REMOVED*** @return {Function} The stub or the invocation logger, if defined.
***REMOVED*** @override
***REMOVED***
goog.labs.mock.MockSpyManager_.prototype.findBinding =
    function(methodName, args) {
  var stub = goog.base(this, 'findBinding', methodName, args);

  if (!stub) {
    stub = goog.bind(this.mockee[methodName], this.mockee);
  }

  return stub;
***REMOVED***



***REMOVED***
***REMOVED*** Sets up mock for the given function, stubbing out. By default, all stubs
***REMOVED*** return {@code undefined}, though stubs can be later defined using
***REMOVED*** {@code goog.labs.mock.when}.
***REMOVED***
***REMOVED*** @param {!Function} func The function to set up the mock for.
***REMOVED***
***REMOVED***
***REMOVED*** @extends {goog.labs.mock.MockManager_}
***REMOVED*** @private
***REMOVED***
goog.labs.mock.MockFunctionManager_ = function(func) {
  goog.base(this);

 ***REMOVED*****REMOVED***
  ***REMOVED*** The stub binder used to create bindings.
  ***REMOVED*** @type {!Function}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.functionStubBinder_ = goog.bind(this.handleMockCall_, this, null);

  this.mockedItem = goog.bind(this.executeStub, this, null);
  this.mockedItem.$stubBinder = this.functionStubBinder_;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The call verifier is used to verify function invocations.
  ***REMOVED*** @type {!Function}
 ***REMOVED*****REMOVED***
  this.mockedItem.$callVerifier = goog.bind(this.verifyInvocation, this, null);
***REMOVED***
goog.inherits(goog.labs.mock.MockFunctionManager_,
              goog.labs.mock.MockManager_);



***REMOVED***
***REMOVED*** The stub binder is the object that helps define the stubs by binding
***REMOVED*** method name to the stub method.
***REMOVED***
***REMOVED*** @param {!goog.labs.mock.MockManager_}
***REMOVED***   mockManager The mock manager.
***REMOVED*** @param {?string} name The method name.
***REMOVED*** @param {!Array} args The other arguments to the method.
***REMOVED***
***REMOVED***
***REMOVED*** @private
***REMOVED***
goog.labs.mock.StubBinder_ = function(mockManager, name, args) {
 ***REMOVED*****REMOVED***
  ***REMOVED*** The mock manager instance.
  ***REMOVED*** @type {!goog.labs.mock.MockManager_}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.mockManager_ = mockManager;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Holds the name of the method to be bound.
  ***REMOVED*** @type {?string}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.name_ = name;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Holds the arguments for the method.
  ***REMOVED*** @type {!Array}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.args_ = args;
***REMOVED***


***REMOVED***
***REMOVED*** Defines the stub to be called for the method name and arguments bound
***REMOVED*** earlier.
***REMOVED*** TODO(user): Add support for the 'Answer' interface.
***REMOVED***
***REMOVED*** @param {!Function} func The stub.
***REMOVED***
goog.labs.mock.StubBinder_.prototype.then = function(func) {
  this.mockManager_.addBinding(this.name_, this.args_, func);
***REMOVED***


***REMOVED***
***REMOVED*** Defines the stub to return a specific value for a method name and arguments.
***REMOVED***
***REMOVED*** @param {*} value The value to return.
***REMOVED***
goog.labs.mock.StubBinder_.prototype.thenReturn = function(value) {
  this.mockManager_.addBinding(this.name_, this.args_,
                               goog.functions.constant(value));
***REMOVED***


***REMOVED***
***REMOVED*** Facilitates (and is the first step in) setting up stubs. Obtains an object
***REMOVED*** on which, the method to be mocked is called to create a stub. Sample usage:
***REMOVED***
***REMOVED*** var mockObj = goog.labs.mock(objectBeingMocked);
***REMOVED*** goog.labs.mock.when(mockObj).getFoo(3).thenReturn(4);
***REMOVED***
***REMOVED*** @param {!Object} mockObject The mocked object.
***REMOVED*** @return {!goog.labs.mock.StubBinder_} The property binder.
***REMOVED***
goog.labs.mock.when = function(mockObject) {
  goog.asserts.assert(mockObject.$stubBinder, 'Stub binder cannot be null!');
  return mockObject.$stubBinder;
***REMOVED***



***REMOVED***
***REMOVED*** Represents a binding between a method name, args and a stub.
***REMOVED***
***REMOVED*** @param {?string} methodName The name of the method being stubbed.
***REMOVED*** @param {!Array} args The arguments passed to the method.
***REMOVED*** @param {!Function} stub The stub function to be called for the given method.
***REMOVED***
***REMOVED*** @private
***REMOVED***
goog.labs.mock.MethodBinding_ = function(methodName, args, stub) {
 ***REMOVED*****REMOVED***
  ***REMOVED*** The name of the method being stubbed.
  ***REMOVED*** @type {?string}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.methodName_ = methodName;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The arguments for the method being stubbed.
  ***REMOVED*** @type {!Array}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.args_ = args;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The stub function.
  ***REMOVED*** @type {!Function}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.stub_ = stub;
***REMOVED***


***REMOVED***
***REMOVED*** @return {!Function} The stub to be executed.
***REMOVED***
goog.labs.mock.MethodBinding_.prototype.getStub = function() {
  return this.stub_;
***REMOVED***


***REMOVED***
***REMOVED*** Determines whether the given args match the stored args_. Used to determine
***REMOVED*** which stub to invoke for a method.
***REMOVED***
***REMOVED*** @param {string} methodName The name of the method being stubbed.
***REMOVED*** @param {!Array} args An array of arguments.
***REMOVED*** @param {boolean} isVerification Whether this is a function verification call
***REMOVED***     or not.
***REMOVED*** @return {boolean} If it matches the stored arguments.
***REMOVED***
goog.labs.mock.MethodBinding_.prototype.matches = function(
    methodName, args, isVerification) {
  var specs = isVerification ? args : this.args_;
  var calls = isVerification ? this.args_ : args;

  //TODO(user): More elaborate argument matching. Think about matching
  //    objects.
  return this.methodName_ == methodName &&
      goog.array.equals(calls, specs, function(arg, spec) {
        // Duck-type to see if this is an object that implements the
        // goog.labs.testing.Matcher interface.
        if (goog.isFunction(spec.matches)) {
          return spec.matches(arg);
        } else {
          return goog.array.defaultCompareEquality(spec, arg);
        }
      });
***REMOVED***
