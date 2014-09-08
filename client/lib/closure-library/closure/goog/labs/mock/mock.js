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
goog.provide('goog.labs.mock.VerificationError');

goog.require('goog.array');
goog.require('goog.asserts');
goog.require('goog.debug');
goog.require('goog.debug.Error');
goog.require('goog.functions');
goog.require('goog.object');


***REMOVED***
***REMOVED*** Mocks a given object or class.
***REMOVED***
***REMOVED*** @param {!Object} objectOrClass An instance or a constructor of a class to be
***REMOVED***     mocked.
***REMOVED*** @return {!Object} The mocked object.
***REMOVED***
goog.labs.mock.mock = function(objectOrClass) {
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
goog.labs.mock.mockFunction = function(func) {
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
***REMOVED*** Returns a name to identify a function. Named functions return their names,
***REMOVED*** unnamed functions return a string of the form '#anonymous{ID}' where ID is
***REMOVED*** a unique identifier for each anonymous function.
***REMOVED*** @private
***REMOVED*** @param {!Function} func The function.
***REMOVED*** @return {string} The function name.
***REMOVED***
goog.labs.mock.getFunctionName_ = function(func) {
  var funcName = goog.debug.getFunctionName(func);
  if (funcName == '' || funcName == '[Anonymous]') {
    funcName = '#anonymous' + goog.labs.mock.getUid(func);
  }
  return funcName;
***REMOVED***


***REMOVED***
***REMOVED*** Returns a nicely formatted, readble representation of a method call.
***REMOVED*** @private
***REMOVED*** @param {string} methodName The name of the method.
***REMOVED*** @param {Array=} opt_args The method arguments.
***REMOVED*** @return {string} The string representation of the method call.
***REMOVED***
goog.labs.mock.formatMethodCall_ = function(methodName, opt_args) {
  opt_args = opt_args || [];
  opt_args = goog.array.map(opt_args, function(arg) {
    if (goog.isFunction(arg)) {
      var funcName = goog.labs.mock.getFunctionName_(arg);
      return '<function ' + funcName + '>';
    } else {
      var isObjectWithClass = goog.isObject(arg) &&
          !goog.isFunction(arg) && !goog.isArray(arg) &&
          arg.constructor != Object;

      if (isObjectWithClass) {
        return arg.toString();
      }

      return goog.labs.mock.formatValue_(arg);
    }
  });
  return methodName + '(' + opt_args.join(', ') + ')';
***REMOVED***


***REMOVED***
***REMOVED*** An array to store objects for unique id generation.
***REMOVED*** @private
***REMOVED*** @type {!Array.<!Object>}
***REMOVED***
goog.labs.mock.uid_ = [];


***REMOVED***
***REMOVED*** A unique Id generator that does not modify the object.
***REMOVED*** @param {Object!} obj The object whose unique ID we want to generate.
***REMOVED*** @return {number} an unique id for the object.
***REMOVED***
goog.labs.mock.getUid = function(obj) {
  var index = goog.array.indexOf(goog.labs.mock.uid_, obj);
  if (index == -1) {
    index = goog.labs.mock.uid_.length;
    goog.labs.mock.uid_.push(obj);
  }
  return index;
***REMOVED***


***REMOVED***
***REMOVED*** This is just another implementation of goog.debug.deepExpose with a more
***REMOVED*** compact format.
***REMOVED*** @private
***REMOVED*** @param {*} obj The object whose string representation will be returned.
***REMOVED*** @param {boolean=} opt_id Whether to include the id of objects or not.
***REMOVED***     Defaults to true.
***REMOVED*** @return {string} The string representation of the object.
***REMOVED***
goog.labs.mock.formatValue_ = function(obj, opt_id) {
  var id = goog.isDef(opt_id) ? opt_id : true;
  var previous = [];
  var output = [];

  var helper = function(obj) {
    var indentMultiline = function(output) {
      return output.replace(/\n/g, '\n');
   ***REMOVED*****REMOVED***

   ***REMOVED*****REMOVED*** @preserveTry***REMOVED***
    try {
      if (!goog.isDef(obj)) {
        output.push('undefined');
      } else if (goog.isNull(obj)) {
        output.push('NULL');
      } else if (goog.isString(obj)) {
        output.push('"' + indentMultiline(obj) + '"');
      } else if (goog.isFunction(obj)) {
        var funcName = goog.labs.mock.getFunctionName_(obj);
        output.push('<function ' + funcName + '>');
      } else if (goog.isObject(obj)) {
        if (goog.array.contains(previous, obj)) {
          if (id) {
            output.push('<recursive/dupe obj_' +
                goog.labs.mock.getUid(obj) + '>');
          } else {
            output.push('<recursive/dupe>');
          }
        } else {
          previous.push(obj);
          output.push('{');
          var inner_obj = [];
          for (var x in obj) {
            output.push(' ');
            output.push('"' + x + '"' + ':');
            helper(obj[x]);
          }
          if (id) {
            output.push(' _id:' + goog.labs.mock.getUid(obj));
          }
          output.push('}');
        }
      } else {
        output.push(obj);
      }
    } catch (e) {
      output.push('*** ' + e + '***REMOVED*****');
    }
 ***REMOVED*****REMOVED***

  helper(obj);
  return output.join('').replace(/"closure_uid_\d+"/g, '_id')
      .replace(/{ /g, '{');

***REMOVED***



***REMOVED***
***REMOVED*** Error thrown when verification failed.
***REMOVED***
***REMOVED*** @param {Array} recordedCalls The recorded calls that didn't match the
***REMOVED***     expectation.
***REMOVED*** @param {!string} methodName The expected method call.
***REMOVED*** @param {!Array} args The expected arguments.
***REMOVED***
***REMOVED*** @extends {goog.debug.Error}
***REMOVED*** @final
***REMOVED***
goog.labs.mock.VerificationError = function(recordedCalls, methodName, args) {
  var msg = goog.labs.mock.VerificationError.getVerificationErrorMsg_(
      recordedCalls, methodName, args);
  goog.labs.mock.VerificationError.base(this, 'constructor', msg);
***REMOVED***
goog.inherits(goog.labs.mock.VerificationError, goog.debug.Error);


***REMOVED*** @override***REMOVED***
goog.labs.mock.VerificationError.prototype.name = 'VerificationError';


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
***REMOVED*** Constructs a descriptive error message for an expected method call.
***REMOVED*** @private
***REMOVED*** @param {Array} recordedCalls The recorded calls that didn't match the
***REMOVED***     expectation.
***REMOVED*** @param {!string} methodName The expected method call.
***REMOVED*** @param {!Array} args The expected arguments.
***REMOVED*** @return {string} The error message.
***REMOVED***
goog.labs.mock.VerificationError.getVerificationErrorMsg_ =
    function(recordedCalls, methodName, args) {

  recordedCalls = goog.array.filter(recordedCalls, function(binding) {
    return binding.getMethodName() == methodName;
  });

  var expected = goog.labs.mock.formatMethodCall_(methodName, args);

  var msg = '\nExpected: ' + expected.toString();
  msg += '\nRecorded: ';

  if (recordedCalls.length > 0) {
    msg += recordedCalls.join(',\n          ');
  } else {
    msg += 'No recorded calls';
  }

  return msg;
***REMOVED***



***REMOVED***
***REMOVED*** Base class that provides basic functionality for creating, adding and
***REMOVED*** finding bindings, offering an executor method that is called when a call to
***REMOVED*** the stub is made, an array to hold the bindings and the mocked item, among
***REMOVED*** other things.
***REMOVED***
***REMOVED***
***REMOVED*** @struct
***REMOVED*** @private
***REMOVED***
goog.labs.mock.MockManager_ = function() {
 ***REMOVED*****REMOVED***
  ***REMOVED*** Proxies the methods for the mocked object or class to execute the stubs.
  ***REMOVED*** @type {!Object}
  ***REMOVED*** @protected
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
***REMOVED*** @protected
***REMOVED***
goog.labs.mock.MockManager_.prototype.verifyInvocation =
    function(methodName, var_args) {
  var args = goog.array.slice(arguments, 1);
  var binding = goog.array.find(this.callRecords_, function(binding) {
    return binding.matches(methodName, args, true /* isVerification***REMOVED***);
  });

  if (!binding) {
    throw new goog.labs.mock.VerificationError(
        this.callRecords_, methodName, args);
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
***REMOVED*** @struct
***REMOVED*** @extends {goog.labs.mock.MockManager_}
***REMOVED*** @private
***REMOVED***
goog.labs.mock.MockObjectManager_ = function(objOrClass) {
  goog.labs.mock.MockObjectManager_.base(this, 'constructor');

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
   ***REMOVED*****REMOVED***
***REMOVED***
***REMOVED*** @final
***REMOVED***
    var tempCtor = function() {***REMOVED***
    goog.inherits(tempCtor, objOrClass);
    obj = new tempCtor();
  } else {
    obj = objOrClass;
  }

  // Put the object being mocked in the prototype chain of the mock so that
  // it has all the correct properties and instanceof works.
 ***REMOVED*****REMOVED***
***REMOVED***
***REMOVED*** @final
***REMOVED***
  var mockedItemCtor = function() {***REMOVED***
  mockedItemCtor.prototype = obj;
  this.mockedItem = new mockedItemCtor();

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
***REMOVED*** @struct
***REMOVED*** @extends {goog.labs.mock.MockObjectManager_}
***REMOVED*** @private
***REMOVED***
goog.labs.mock.MockSpyManager_ = function(obj) {
  goog.labs.mock.MockSpyManager_.base(this, 'constructor', obj);
***REMOVED***
goog.inherits(goog.labs.mock.MockSpyManager_,
              goog.labs.mock.MockObjectManager_);


***REMOVED***
***REMOVED*** Return a stub, if defined, for the method and arguments passed in. If we lack
***REMOVED*** a stub, instead look for a call record that matches the method and arguments.
***REMOVED***
***REMOVED*** @return {!Function} The stub or the invocation logger, if defined.
***REMOVED*** @override
***REMOVED***
goog.labs.mock.MockSpyManager_.prototype.findBinding =
    function(methodName, args) {
  var stub = goog.labs.mock.MockSpyManager_.base(
      this, 'findBinding', methodName, args);

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
***REMOVED*** @struct
***REMOVED*** @extends {goog.labs.mock.MockManager_}
***REMOVED*** @private
***REMOVED***
goog.labs.mock.MockFunctionManager_ = function(func) {
  goog.labs.mock.MockFunctionManager_.base(this, 'constructor');

  this.func_ = func;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The stub binder used to create bindings.
  ***REMOVED*** Sets the first argument of handleMockCall_ to the function name.
  ***REMOVED*** @type {!Function}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.functionStubBinder_ = this.useMockedFunctionName_(this.handleMockCall_);

  this.mockedItem = this.useMockedFunctionName_(this.executeStub);
  this.mockedItem.$stubBinder = this.functionStubBinder_;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The call verifier is used to verify function invocations.
  ***REMOVED*** Sets the first argument of verifyInvocation to the function name.
  ***REMOVED*** @type {!Function}
 ***REMOVED*****REMOVED***
  this.mockedItem.$callVerifier =
      this.useMockedFunctionName_(this.verifyInvocation);
***REMOVED***
goog.inherits(goog.labs.mock.MockFunctionManager_,
              goog.labs.mock.MockManager_);


***REMOVED***
***REMOVED*** Given a method, returns a new function that calls the first one setting
***REMOVED*** the first argument to the mocked function name.
***REMOVED*** This is used to dynamically override the stub binders and call verifiers.
***REMOVED*** @private
***REMOVED*** @param {Function} nextFunc The function to override.
***REMOVED*** @return {!Function} The overloaded function.
***REMOVED***
goog.labs.mock.MockFunctionManager_.prototype.useMockedFunctionName_ =
    function(nextFunc) {
  return goog.bind(function(var_args) {
    var args = goog.array.slice(arguments, 0);
    var name =
        '#mockFor<' + goog.labs.mock.getFunctionName_(this.func_) + '>';
    goog.array.insertAt(args, name, 0);
    return nextFunc.apply(this, args);
  }, this);
***REMOVED***



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
***REMOVED*** @struct
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
***REMOVED*** var mockObj = goog.labs.mock.mock(objectBeingMocked);
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
***REMOVED*** @struct
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
***REMOVED*** @override
***REMOVED*** @return {string} A readable string representation of the binding
***REMOVED***  as a method call.
***REMOVED***
goog.labs.mock.MethodBinding_.prototype.toString = function() {
  return goog.labs.mock.formatMethodCall_(this.methodName_ || '', this.args_);
***REMOVED***


***REMOVED***
***REMOVED*** @return {string} The method name for this binding.
***REMOVED***
goog.labs.mock.MethodBinding_.prototype.getMethodName = function() {
  return this.methodName_ || '';
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
