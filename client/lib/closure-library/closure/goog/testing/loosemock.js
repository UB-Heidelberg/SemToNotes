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
***REMOVED*** @fileoverview This file defines a loose mock implementation.
***REMOVED***

goog.provide('goog.testing.LooseExpectationCollection');
goog.provide('goog.testing.LooseMock');

goog.require('goog.array');
goog.require('goog.structs.Map');
goog.require('goog.testing.Mock');



***REMOVED***
***REMOVED*** This class is an ordered collection of expectations for one method. Since
***REMOVED*** the loose mock does most of its verification at the time of $verify, this
***REMOVED*** class is necessary to manage the return/throw behavior when the mock is
***REMOVED*** being called.
***REMOVED***
***REMOVED*** @final
***REMOVED***
goog.testing.LooseExpectationCollection = function() {
 ***REMOVED*****REMOVED***
  ***REMOVED*** The list of expectations. All of these should have the same name.
  ***REMOVED*** @type {Array.<goog.testing.MockExpectation>}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.expectations_ = [];
***REMOVED***


***REMOVED***
***REMOVED*** Adds an expectation to this collection.
***REMOVED*** @param {goog.testing.MockExpectation} expectation The expectation to add.
***REMOVED***
goog.testing.LooseExpectationCollection.prototype.addExpectation =
    function(expectation) {
  this.expectations_.push(expectation);
***REMOVED***


***REMOVED***
***REMOVED*** Gets the list of expectations in this collection.
***REMOVED*** @return {Array.<goog.testing.MockExpectation>} The array of expectations.
***REMOVED***
goog.testing.LooseExpectationCollection.prototype.getExpectations = function() {
  return this.expectations_;
***REMOVED***



***REMOVED***
***REMOVED*** This is a mock that does not care about the order of method calls. As a
***REMOVED*** result, it won't throw exceptions until verify() is called. The only
***REMOVED*** exception is that if a method is called that has no expectations, then an
***REMOVED*** exception will be thrown.
***REMOVED*** @param {Object|Function} objectToMock The object that should be mocked, or
***REMOVED***    the constructor of an object to mock.
***REMOVED*** @param {boolean=} opt_ignoreUnexpectedCalls Whether to ignore unexpected
***REMOVED***     calls.
***REMOVED*** @param {boolean=} opt_mockStaticMethods An optional argument denoting that
***REMOVED***     a mock should be constructed from the static functions of a class.
***REMOVED*** @param {boolean=} opt_createProxy An optional argument denoting that
***REMOVED***     a proxy for the target mock should be created.
***REMOVED***
***REMOVED*** @extends {goog.testing.Mock}
***REMOVED***
goog.testing.LooseMock = function(objectToMock, opt_ignoreUnexpectedCalls,
    opt_mockStaticMethods, opt_createProxy) {
  goog.testing.Mock.call(this, objectToMock, opt_mockStaticMethods,
      opt_createProxy);

 ***REMOVED*****REMOVED***
  ***REMOVED*** A map of method names to a LooseExpectationCollection for that method.
  ***REMOVED*** @type {goog.structs.Map}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.$expectations_ = new goog.structs.Map();

 ***REMOVED*****REMOVED***
  ***REMOVED*** The calls that have been made; we cache them to verify at the end. Each
  ***REMOVED*** element is an array where the first element is the name, and the second
  ***REMOVED*** element is the arguments.
  ***REMOVED*** @type {Array.<Array.<*>>}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.$calls_ = [];

 ***REMOVED*****REMOVED***
  ***REMOVED*** Whether to ignore unexpected calls.
  ***REMOVED*** @type {boolean}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.$ignoreUnexpectedCalls_ = !!opt_ignoreUnexpectedCalls;
***REMOVED***
goog.inherits(goog.testing.LooseMock, goog.testing.Mock);


***REMOVED***
***REMOVED*** A setter for the ignoreUnexpectedCalls field.
***REMOVED*** @param {boolean} ignoreUnexpectedCalls Whether to ignore unexpected calls.
***REMOVED*** @return {!goog.testing.LooseMock} This mock object.
***REMOVED***
goog.testing.LooseMock.prototype.$setIgnoreUnexpectedCalls = function(
    ignoreUnexpectedCalls) {
  this.$ignoreUnexpectedCalls_ = ignoreUnexpectedCalls;
  return this;
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.testing.LooseMock.prototype.$recordExpectation = function() {
  if (!this.$expectations_.containsKey(this.$pendingExpectation.name)) {
    this.$expectations_.set(this.$pendingExpectation.name,
        new goog.testing.LooseExpectationCollection());
  }

  var collection = this.$expectations_.get(this.$pendingExpectation.name);
  collection.addExpectation(this.$pendingExpectation);
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.testing.LooseMock.prototype.$recordCall = function(name, args) {
  if (!this.$expectations_.containsKey(name)) {
    if (this.$ignoreUnexpectedCalls_) {
      return;
    }
    this.$throwCallException(name, args);
  }

  // Start from the beginning of the expectations for this name,
  // and iterate over them until we find an expectation that matches
  // and also has calls remaining.
  var collection = this.$expectations_.get(name);
  var matchingExpectation = null;
  var expectations = collection.getExpectations();
  for (var i = 0; i < expectations.length; i++) {
    var expectation = expectations[i];
    if (this.$verifyCall(expectation, name, args)) {
      matchingExpectation = expectation;
      if (expectation.actualCalls < expectation.maxCalls) {
        break;
      } // else continue and see if we can find something that does match
    }
  }
  if (matchingExpectation == null) {
    this.$throwCallException(name, args, expectation);
  }

  matchingExpectation.actualCalls++;
  if (matchingExpectation.actualCalls > matchingExpectation.maxCalls) {
    this.$throwException('Too many calls to ' + matchingExpectation.name +
            '\nExpected: ' + matchingExpectation.maxCalls + ' but was: ' +
            matchingExpectation.actualCalls);
  }

  this.$calls_.push([name, args]);
  return this.$do(matchingExpectation, args);
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.testing.LooseMock.prototype.$reset = function() {
  goog.testing.LooseMock.superClass_.$reset.call(this);

  this.$expectations_ = new goog.structs.Map();
  this.$calls_ = [];
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.testing.LooseMock.prototype.$replay = function() {
  goog.testing.LooseMock.superClass_.$replay.call(this);

  // Verify that there are no expectations that can never be reached.
  // This can't catch every situation, but it is a decent sanity check
  // and it's similar to the behavior of EasyMock in java.
  var collections = this.$expectations_.getValues();
  for (var i = 0; i < collections.length; i++) {
    var expectations = collections[i].getExpectations();
    for (var j = 0; j < expectations.length; j++) {
      var expectation = expectations[j];
      // If this expectation can be called infinite times, then
      // check if any subsequent expectation has the exact same
      // argument list.
      if (!isFinite(expectation.maxCalls)) {
        for (var k = j + 1; k < expectations.length; k++) {
          var laterExpectation = expectations[k];
          if (laterExpectation.minCalls > 0 &&
              goog.array.equals(expectation.argumentList,
                  laterExpectation.argumentList)) {
            var name = expectation.name;
            var argsString = this.$argumentsAsString(expectation.argumentList);
            this.$throwException([
              'Expected call to ', name, ' with arguments ', argsString,
              ' has an infinite max number of calls; can\'t expect an',
              ' identical call later with a positive min number of calls'
            ].join(''));
          }
        }
      }
    }
  }
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.testing.LooseMock.prototype.$verify = function() {
  goog.testing.LooseMock.superClass_.$verify.call(this);
  var collections = this.$expectations_.getValues();

  for (var i = 0; i < collections.length; i++) {
    var expectations = collections[i].getExpectations();
    for (var j = 0; j < expectations.length; j++) {
      var expectation = expectations[j];
      if (expectation.actualCalls > expectation.maxCalls) {
        this.$throwException('Too many calls to ' + expectation.name +
            '\nExpected: ' + expectation.maxCalls + ' but was: ' +
            expectation.actualCalls);
      } else if (expectation.actualCalls < expectation.minCalls) {
        this.$throwException('Not enough calls to ' + expectation.name +
            '\nExpected: ' + expectation.minCalls + ' but was: ' +
            expectation.actualCalls);
      }
    }
  }
***REMOVED***
