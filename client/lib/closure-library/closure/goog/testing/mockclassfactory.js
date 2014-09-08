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
***REMOVED*** @fileoverview This file defines a factory that can be used to mock and
***REMOVED*** replace an entire class.  This allows for mocks to be used effectively with
***REMOVED*** "new" instead of having to inject all instances.  Essentially, a given class
***REMOVED*** is replaced with a proxy to either a loose or strict mock.  Proxies locate
***REMOVED*** the appropriate mock based on constructor arguments.
***REMOVED***
***REMOVED*** The usage is:
***REMOVED*** <ul>
***REMOVED***   <li>Create a mock with one of the provided methods with a specifc set of
***REMOVED***       constructor arguments
***REMOVED***   <li>Set expectations by calling methods on the mock object
***REMOVED***   <li>Call $replay() on the mock object
***REMOVED***   <li>Instantiate the object as normal
***REMOVED***   <li>Call $verify() to make sure that expectations were met
***REMOVED***   <li>Call reset on the factory to revert all classes back to their original
***REMOVED***       state
***REMOVED*** </ul>
***REMOVED***
***REMOVED*** For examples, please see the unit test.
***REMOVED***
***REMOVED***


goog.provide('goog.testing.MockClassFactory');
goog.provide('goog.testing.MockClassRecord');

goog.require('goog.array');
goog.require('goog.object');
goog.require('goog.testing.LooseMock');
goog.require('goog.testing.StrictMock');
goog.require('goog.testing.TestCase');
goog.require('goog.testing.mockmatchers');



***REMOVED***
***REMOVED*** A record that represents all the data associated with a mock replacement of
***REMOVED*** a given class.
***REMOVED*** @param {Object} namespace The namespace in which the mocked class resides.
***REMOVED*** @param {string} className The name of the class within the namespace.
***REMOVED*** @param {Function} originalClass The original class implementation before it
***REMOVED***     was replaced by a proxy.
***REMOVED*** @param {Function} proxy The proxy that replaced the original class.
***REMOVED***
***REMOVED*** @final
***REMOVED***
goog.testing.MockClassRecord = function(namespace, className, originalClass,
    proxy) {
 ***REMOVED*****REMOVED***
  ***REMOVED*** A standard closure namespace (e.g. goog.foo.bar) that contains the mock
  ***REMOVED*** class referenced by this MockClassRecord.
  ***REMOVED*** @type {Object}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.namespace_ = namespace;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The name of the class within the provided namespace.
  ***REMOVED*** @type {string}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.className_ = className;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The original class implementation.
  ***REMOVED*** @type {Function}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.originalClass_ = originalClass;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The proxy being used as a replacement for the original class.
  ***REMOVED*** @type {Function}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.proxy_ = proxy;

 ***REMOVED*****REMOVED***
  ***REMOVED*** A mocks that will be constructed by their argument list.  The entries are
  ***REMOVED*** objects with the format {'args': args, 'mock': mock}.
  ***REMOVED*** @type {Array.<Object>}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.instancesByArgs_ = [];
***REMOVED***


***REMOVED***
***REMOVED*** A mock associated with the static functions for a given class.
***REMOVED*** @type {goog.testing.StrictMock|goog.testing.LooseMock|null}
***REMOVED*** @private
***REMOVED***
goog.testing.MockClassRecord.prototype.staticMock_ = null;


***REMOVED***
***REMOVED*** A getter for this record's namespace.
***REMOVED*** @return {Object} The namespace.
***REMOVED***
goog.testing.MockClassRecord.prototype.getNamespace = function() {
  return this.namespace_;
***REMOVED***


***REMOVED***
***REMOVED*** A getter for this record's class name.
***REMOVED*** @return {string} The name of the class referenced by this record.
***REMOVED***
goog.testing.MockClassRecord.prototype.getClassName = function() {
  return this.className_;
***REMOVED***


***REMOVED***
***REMOVED*** A getter for the original class.
***REMOVED*** @return {Function} The original class implementation before mocking.
***REMOVED***
goog.testing.MockClassRecord.prototype.getOriginalClass = function() {
  return this.originalClass_;
***REMOVED***


***REMOVED***
***REMOVED*** A getter for the proxy being used as a replacement for the original class.
***REMOVED*** @return {Function} The proxy.
***REMOVED***
goog.testing.MockClassRecord.prototype.getProxy = function() {
  return this.proxy_;
***REMOVED***


***REMOVED***
***REMOVED*** A getter for the static mock.
***REMOVED*** @return {goog.testing.StrictMock|goog.testing.LooseMock|null} The static
***REMOVED***     mock associated with this record.
***REMOVED***
goog.testing.MockClassRecord.prototype.getStaticMock = function() {
  return this.staticMock_;
***REMOVED***


***REMOVED***
***REMOVED*** A setter for the static mock.
***REMOVED*** @param {goog.testing.StrictMock|goog.testing.LooseMock} staticMock A mock to
***REMOVED***     associate with the static functions for the referenced class.
***REMOVED***
goog.testing.MockClassRecord.prototype.setStaticMock = function(staticMock) {
  this.staticMock_ = staticMock;
***REMOVED***


***REMOVED***
***REMOVED*** Adds a new mock instance mapping.  The mapping connects a set of function
***REMOVED*** arguments to a specific mock instance.
***REMOVED*** @param {Array} args An array of function arguments.
***REMOVED*** @param {goog.testing.StrictMock|goog.testing.LooseMock} mock A mock
***REMOVED***     associated with the supplied arguments.
***REMOVED***
goog.testing.MockClassRecord.prototype.addMockInstance = function(args, mock) {
  this.instancesByArgs_.push({args: args, mock: mock});
***REMOVED***


***REMOVED***
***REMOVED*** Finds the mock corresponding to a given argument set.  Throws an error if
***REMOVED*** there is no appropriate match found.
***REMOVED*** @param {Array} args An array of function arguments.
***REMOVED*** @return {goog.testing.StrictMock|goog.testing.LooseMock|null} The mock
***REMOVED***     corresponding to a given argument set.
***REMOVED***
goog.testing.MockClassRecord.prototype.findMockInstance = function(args) {
  for (var i = 0; i < this.instancesByArgs_.length; i++) {
    var instanceArgs = this.instancesByArgs_[i].args;
    if (goog.testing.mockmatchers.flexibleArrayMatcher(instanceArgs, args)) {
      return this.instancesByArgs_[i].mock;
    }
  }

  return null;
***REMOVED***


***REMOVED***
***REMOVED*** Resets this record by reverting all the mocked classes back to the original
***REMOVED*** implementation and clearing out the mock instance list.
***REMOVED***
goog.testing.MockClassRecord.prototype.reset = function() {
  this.namespace_[this.className_] = this.originalClass_;
  this.instancesByArgs_ = [];
***REMOVED***



***REMOVED***
***REMOVED*** A factory used to create new mock class instances.  It is able to generate
***REMOVED*** both static and loose mocks.  The MockClassFactory is a singleton since it
***REMOVED*** tracks the classes that have been mocked internally.
***REMOVED***
***REMOVED*** @final
***REMOVED***
goog.testing.MockClassFactory = function() {
  if (goog.testing.MockClassFactory.instance_) {
    return goog.testing.MockClassFactory.instance_;
  }

 ***REMOVED*****REMOVED***
  ***REMOVED*** A map from class name -> goog.testing.MockClassRecord.
  ***REMOVED*** @type {Object}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.mockClassRecords_ = {***REMOVED***

  goog.testing.MockClassFactory.instance_ = this;
***REMOVED***


***REMOVED***
***REMOVED*** A singleton instance of the MockClassFactory.
***REMOVED*** @type {goog.testing.MockClassFactory?}
***REMOVED*** @private
***REMOVED***
goog.testing.MockClassFactory.instance_ = null;


***REMOVED***
***REMOVED*** The names of the fields that are defined on Object.prototype.
***REMOVED*** @type {Array.<string>}
***REMOVED*** @private
***REMOVED***
goog.testing.MockClassFactory.PROTOTYPE_FIELDS_ = [
  'constructor',
  'hasOwnProperty',
  'isPrototypeOf',
  'propertyIsEnumerable',
  'toLocaleString',
  'toString',
  'valueOf'
];


***REMOVED***
***REMOVED*** Iterates through a namespace to find the name of a given class.  This is done
***REMOVED*** solely to support compilation since string identifiers would break down.
***REMOVED*** Tests usually aren't compiled, but the functionality is supported.
***REMOVED*** @param {Object} namespace A javascript namespace (e.g. goog.testing).
***REMOVED*** @param {Function} classToMock The class whose name should be returned.
***REMOVED*** @return {string} The name of the class.
***REMOVED*** @private
***REMOVED***
goog.testing.MockClassFactory.prototype.getClassName_ = function(namespace,
    classToMock) {
  if (namespace === goog.global) {
    namespace = goog.testing.TestCase.getGlobals();
  }
  for (var prop in namespace) {
    if (namespace[prop] === classToMock) {
      return prop;
    }
  }

  throw Error('Class is not a part of the given namespace');
***REMOVED***


***REMOVED***
***REMOVED*** Returns whether or not a given class has been mocked.
***REMOVED*** @param {string} className The name of the class.
***REMOVED*** @return {boolean} Whether or not the given class name has a MockClassRecord.
***REMOVED*** @private
***REMOVED***
goog.testing.MockClassFactory.prototype.classHasMock_ = function(className) {
  return !!this.mockClassRecords_[className];
***REMOVED***


***REMOVED***
***REMOVED*** Returns a proxy constructor closure.  Since this is a constructor, "this"
***REMOVED*** refers to the local scope of the constructed object thus bind cannot be
***REMOVED*** used.
***REMOVED*** @param {string} className The name of the class.
***REMOVED*** @param {Function} mockFinder A bound function that returns the mock
***REMOVED***     associated with a class given the constructor's argument list.
***REMOVED*** @return {!Function} A proxy constructor.
***REMOVED*** @private
***REMOVED***
goog.testing.MockClassFactory.prototype.getProxyCtor_ = function(className,
    mockFinder) {
  return function() {
    this.$mock_ = mockFinder(className, arguments);
    if (!this.$mock_) {
      // The "arguments" variable is not a proper Array so it must be converted.
      var args = Array.prototype.slice.call(arguments, 0);
      throw Error('No mock found for ' + className + ' with arguments ' +
          args.join(', '));
    }
 ***REMOVED*****REMOVED***
***REMOVED***


***REMOVED***
***REMOVED*** Returns a proxy function for a mock class instance.  This function cannot
***REMOVED*** be used with bind since "this" must refer to the scope of the proxy
***REMOVED*** constructor.
***REMOVED*** @param {string} fnName The name of the function that should be proxied.
***REMOVED*** @return {!Function} A proxy function.
***REMOVED*** @private
***REMOVED***
goog.testing.MockClassFactory.prototype.getProxyFunction_ = function(fnName) {
  return function() {
    return this.$mock_[fnName].apply(this.$mock_, arguments);
 ***REMOVED*****REMOVED***
***REMOVED***


***REMOVED***
***REMOVED*** Find a mock instance for a given class name and argument list.
***REMOVED*** @param {string} className The name of the class.
***REMOVED*** @param {Array} args The argument list to match.
***REMOVED*** @return {goog.testing.StrictMock|goog.testing.LooseMock} The mock found for
***REMOVED***     the given argument list.
***REMOVED*** @private
***REMOVED***
goog.testing.MockClassFactory.prototype.findMockInstance_ = function(className,
    args) {
  return this.mockClassRecords_[className].findMockInstance(args);
***REMOVED***


***REMOVED***
***REMOVED*** Create a proxy class.  A proxy will pass functions to the mock for a class.
***REMOVED*** The proxy class only covers prototype methods.  A static mock is not build
***REMOVED*** simultaneously since it might be strict or loose.  The proxy class inherits
***REMOVED*** from the target class in order to preserve instanceof checks.
***REMOVED*** @param {Object} namespace A javascript namespace (e.g. goog.testing).
***REMOVED*** @param {Function} classToMock The class that will be proxied.
***REMOVED*** @param {string} className The name of the class.
***REMOVED*** @return {!Function} The proxy for provided class.
***REMOVED*** @private
***REMOVED***
goog.testing.MockClassFactory.prototype.createProxy_ = function(namespace,
    classToMock, className) {
  var proxy = this.getProxyCtor_(className,
      goog.bind(this.findMockInstance_, this));
  var protoToProxy = classToMock.prototype;
  goog.inherits(proxy, classToMock);

  for (var prop in protoToProxy) {
    if (goog.isFunction(protoToProxy[prop])) {
      proxy.prototype[prop] = this.getProxyFunction_(prop);
    }
  }

  // For IE the for-in-loop does not contain any properties that are not
  // enumerable on the prototype object (for example isPrototypeOf from
  // Object.prototype) and it will also not include 'replace' on objects that
  // extend String and change 'replace' (not that it is common for anyone to
  // extend anything except Object).
  // TODO (arv): Implement goog.object.getIterator and replace this loop.

  goog.array.forEach(goog.testing.MockClassFactory.PROTOTYPE_FIELDS_,
      function(field) {
        if (Object.prototype.hasOwnProperty.call(protoToProxy, field)) {
          proxy.prototype[field] = this.getProxyFunction_(field);
        }
      }, this);

  this.mockClassRecords_[className] = new goog.testing.MockClassRecord(
      namespace, className, classToMock, proxy);
  namespace[className] = proxy;
  return proxy;
***REMOVED***


***REMOVED***
***REMOVED*** Gets either a loose or strict mock for a given class based on a set of
***REMOVED*** arguments.
***REMOVED*** @param {Object} namespace A javascript namespace (e.g. goog.testing).
***REMOVED*** @param {Function} classToMock The class that will be mocked.
***REMOVED*** @param {boolean} isStrict Whether or not the mock should be strict.
***REMOVED*** @param {goog.array.ArrayLike} ctorArgs The arguments associated with this
***REMOVED***     instance's constructor.
***REMOVED*** @return {!goog.testing.StrictMock|!goog.testing.LooseMock} The mock created
***REMOVED***     for the provided class.
***REMOVED*** @private
***REMOVED***
goog.testing.MockClassFactory.prototype.getMockClass_ =
    function(namespace, classToMock, isStrict, ctorArgs) {
  var className = this.getClassName_(namespace, classToMock);

  // The namespace and classToMock variables should be removed from the
  // passed in argument stack.
  ctorArgs = goog.array.slice(ctorArgs, 2);

  if (goog.isFunction(classToMock)) {
    var mock = isStrict ? new goog.testing.StrictMock(classToMock) :
        new goog.testing.LooseMock(classToMock);

    if (!this.classHasMock_(className)) {
      this.createProxy_(namespace, classToMock, className);
    } else {
      var instance = this.findMockInstance_(className, ctorArgs);
      if (instance) {
        throw Error('Mock instance already created for ' + className +
            ' with arguments ' + ctorArgs.join(', '));
      }
    }
    this.mockClassRecords_[className].addMockInstance(ctorArgs, mock);

    return mock;
  } else {
    throw Error('Cannot create a mock class for ' + className +
        ' of type ' + typeof classToMock);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Gets a strict mock for a given class.
***REMOVED*** @param {Object} namespace A javascript namespace (e.g. goog.testing).
***REMOVED*** @param {Function} classToMock The class that will be mocked.
***REMOVED*** @param {...*} var_args The arguments associated with this instance's
***REMOVED***     constructor.
***REMOVED*** @return {goog.testing.StrictMock} The mock created for the provided class.
***REMOVED***
goog.testing.MockClassFactory.prototype.getStrictMockClass =
    function(namespace, classToMock, var_args) {
  return***REMOVED*****REMOVED*** @type {goog.testing.StrictMock}***REMOVED*** (this.getMockClass_(namespace,
      classToMock, true, arguments));
***REMOVED***


***REMOVED***
***REMOVED*** Gets a loose mock for a given class.
***REMOVED*** @param {Object} namespace A javascript namespace (e.g. goog.testing).
***REMOVED*** @param {Function} classToMock The class that will be mocked.
***REMOVED*** @param {...*} var_args The arguments associated with this instance's
***REMOVED***     constructor.
***REMOVED*** @return {goog.testing.LooseMock} The mock created for the provided class.
***REMOVED***
goog.testing.MockClassFactory.prototype.getLooseMockClass =
    function(namespace, classToMock, var_args) {
  return***REMOVED*****REMOVED*** @type {goog.testing.LooseMock}***REMOVED*** (this.getMockClass_(namespace,
      classToMock, false, arguments));
***REMOVED***


***REMOVED***
***REMOVED*** Creates either a loose or strict mock for the static functions of a given
***REMOVED*** class.
***REMOVED*** @param {Function} classToMock The class whose static functions will be
***REMOVED***     mocked.  This should be the original class and not the proxy.
***REMOVED*** @param {string} className The name of the class.
***REMOVED*** @param {Function} proxy The proxy that will replace the original class.
***REMOVED*** @param {boolean} isStrict Whether or not the mock should be strict.
***REMOVED*** @return {!goog.testing.StrictMock|!goog.testing.LooseMock} The mock created
***REMOVED***     for the static functions of the provided class.
***REMOVED*** @private
***REMOVED***
goog.testing.MockClassFactory.prototype.createStaticMock_ =
    function(classToMock, className, proxy, isStrict) {
  var mock = isStrict ? new goog.testing.StrictMock(classToMock, true) :
      new goog.testing.LooseMock(classToMock, false, true);

  for (var prop in classToMock) {
    if (goog.isFunction(classToMock[prop])) {
      proxy[prop] = goog.bind(mock.$mockMethod, mock, prop);
    } else if (classToMock[prop] !== classToMock.prototype) {
      proxy[prop] = classToMock[prop];
    }
  }

  this.mockClassRecords_[className].setStaticMock(mock);
  return mock;
***REMOVED***


***REMOVED***
***REMOVED*** Gets either a loose or strict mock for the static functions of a given class.
***REMOVED*** @param {Object} namespace A javascript namespace (e.g. goog.testing).
***REMOVED*** @param {Function} classToMock The class whose static functions will be
***REMOVED***     mocked.  This should be the original class and not the proxy.
***REMOVED*** @param {boolean} isStrict Whether or not the mock should be strict.
***REMOVED*** @return {goog.testing.StrictMock|goog.testing.LooseMock} The mock created
***REMOVED***     for the static functions of the provided class.
***REMOVED*** @private
***REMOVED***
goog.testing.MockClassFactory.prototype.getStaticMock_ = function(namespace,
    classToMock, isStrict) {
  var className = this.getClassName_(namespace, classToMock);

  if (goog.isFunction(classToMock)) {
    if (!this.classHasMock_(className)) {
      var proxy = this.createProxy_(namespace, classToMock, className);
      var mock = this.createStaticMock_(classToMock, className, proxy,
          isStrict);
      return mock;
    }

    if (!this.mockClassRecords_[className].getStaticMock()) {
      var proxy = this.mockClassRecords_[className].getProxy();
      var originalClass = this.mockClassRecords_[className].getOriginalClass();
      var mock = this.createStaticMock_(originalClass, className, proxy,
          isStrict);
      return mock;
    } else {
      var mock = this.mockClassRecords_[className].getStaticMock();
      var mockIsStrict = mock instanceof goog.testing.StrictMock;

      if (mockIsStrict != isStrict) {
        var mockType = mock instanceof goog.testing.StrictMock ? 'strict' :
            'loose';
        var requestedType = isStrict ? 'strict' : 'loose';
        throw Error('Requested a ' + requestedType + ' static mock, but a ' +
            mockType + ' mock already exists.');
      }

      return mock;
    }
  } else {
    throw Error('Cannot create a mock for the static functions of ' +
        className + ' of type ' + typeof classToMock);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Gets a strict mock for the static functions of a given class.
***REMOVED*** @param {Object} namespace A javascript namespace (e.g. goog.testing).
***REMOVED*** @param {Function} classToMock The class whose static functions will be
***REMOVED***     mocked.  This should be the original class and not the proxy.
***REMOVED*** @return {goog.testing.StrictMock} The mock created for the static functions
***REMOVED***     of the provided class.
***REMOVED***
goog.testing.MockClassFactory.prototype.getStrictStaticMock =
    function(namespace, classToMock) {
  return***REMOVED*****REMOVED*** @type {goog.testing.StrictMock}***REMOVED*** (this.getStaticMock_(namespace,
      classToMock, true));
***REMOVED***


***REMOVED***
***REMOVED*** Gets a loose mock for the static functions of a given class.
***REMOVED*** @param {Object} namespace A javascript namespace (e.g. goog.testing).
***REMOVED*** @param {Function} classToMock The class whose static functions will be
***REMOVED***     mocked.  This should be the original class and not the proxy.
***REMOVED*** @return {goog.testing.LooseMock} The mock created for the static functions
***REMOVED***     of the provided class.
***REMOVED***
goog.testing.MockClassFactory.prototype.getLooseStaticMock =
    function(namespace, classToMock) {
  return***REMOVED*****REMOVED*** @type {goog.testing.LooseMock}***REMOVED*** (this.getStaticMock_(namespace,
      classToMock, false));
***REMOVED***


***REMOVED***
***REMOVED*** Resests the factory by reverting all mocked classes to their original
***REMOVED*** implementations and removing all MockClassRecords.
***REMOVED***
goog.testing.MockClassFactory.prototype.reset = function() {
  goog.object.forEach(this.mockClassRecords_, function(record) {
    record.reset();
  });
  this.mockClassRecords_ = {***REMOVED***
***REMOVED***
