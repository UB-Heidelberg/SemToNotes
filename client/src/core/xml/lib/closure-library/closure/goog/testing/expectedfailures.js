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
***REMOVED*** @fileoverview Helper class to allow for expected unit test failures.
***REMOVED***
***REMOVED*** @author robbyw@google.com (Robby Walker)
***REMOVED***

goog.provide('goog.testing.ExpectedFailures');

goog.require('goog.debug.DivConsole');
goog.require('goog.debug.Logger');
goog.require('goog.dom');
goog.require('goog.dom.TagName');
***REMOVED***
***REMOVED***
goog.require('goog.style');
goog.require('goog.testing.JsUnitException');
goog.require('goog.testing.TestCase');
goog.require('goog.testing.asserts');



***REMOVED***
***REMOVED*** Helper class for allowing some unit tests to fail, particularly designed to
***REMOVED*** mark tests that should be fixed on a given browser.
***REMOVED***
***REMOVED*** <pre>
***REMOVED*** var expectedFailures = new goog.testing.ExpectedFailures();
***REMOVED***
***REMOVED*** function tearDown() {
***REMOVED***   expectedFailures.handleTearDown();
***REMOVED*** }
***REMOVED***
***REMOVED*** function testSomethingThatBreaksInWebKit() {
***REMOVED***   expectedFailures.expectFailureFor(goog.userAgent.WEBKIT);
***REMOVED***
***REMOVED***   try {
***REMOVED***     ...
***REMOVED***     assert(somethingThatFailsInWebKit);
***REMOVED***     ...
***REMOVED***   } catch (e) {
***REMOVED***     expectedFailures.handleException(e);
***REMOVED***   }
***REMOVED*** }
***REMOVED*** </pre>
***REMOVED***
***REMOVED***
***REMOVED***
goog.testing.ExpectedFailures = function() {
  goog.testing.ExpectedFailures.setUpConsole_();
  this.reset_();
***REMOVED***


***REMOVED***
***REMOVED*** The lazily created debugging console.
***REMOVED*** @type {goog.debug.DivConsole?}
***REMOVED*** @private
***REMOVED***
goog.testing.ExpectedFailures.console_ = null;


***REMOVED***
***REMOVED*** Logger for the expected failures.
***REMOVED*** @type {goog.debug.Logger}
***REMOVED*** @private
***REMOVED***
goog.testing.ExpectedFailures.prototype.logger_ =
    goog.debug.Logger.getLogger('goog.testing.ExpectedFailures');


***REMOVED***
***REMOVED*** Whether or not we are expecting failure.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.testing.ExpectedFailures.prototype.expectingFailure_;


***REMOVED***
***REMOVED*** The string to emit upon an expected failure.
***REMOVED*** @type {string}
***REMOVED*** @private
***REMOVED***
goog.testing.ExpectedFailures.prototype.failureMessage_;


***REMOVED***
***REMOVED*** An array of suppressed failures.
***REMOVED*** @type {Array}
***REMOVED*** @private
***REMOVED***
goog.testing.ExpectedFailures.prototype.suppressedFailures_;


***REMOVED***
***REMOVED*** Sets up the debug console, if it isn't already set up.
***REMOVED*** @private
***REMOVED***
goog.testing.ExpectedFailures.setUpConsole_ = function() {
  if (!goog.testing.ExpectedFailures.console_) {
    var xButton = goog.dom.createDom(goog.dom.TagName.DIV, {
        'style': 'position: absolute; border-left:1px solid #333;' +
                 'border-bottom:1px solid #333; right: 0; top: 0; width: 1em;' +
                 'height: 1em; cursor: pointer; background-color: #cde;' +
                 'text-align: center; color: black'
    }, 'X');
    var div = goog.dom.createDom(goog.dom.TagName.DIV, {
      'style': 'position: absolute; border: 1px solid #333; right: 10px;' +
               'top : 10px; width: 400px; display: none'
    }, xButton);
    document.body.appendChild(div);
  ***REMOVED***xButton, goog.events.EventType.CLICK, function() {
      goog.style.showElement(div, false);
    });

    goog.testing.ExpectedFailures.console_ = new goog.debug.DivConsole(div);
    goog.testing.ExpectedFailures.prototype.logger_.addHandler(
        goog.bind(goog.style.showElement, null, div, true));
    goog.testing.ExpectedFailures.prototype.logger_.addHandler(
        goog.bind(goog.testing.ExpectedFailures.console_.addLogRecord,
            goog.testing.ExpectedFailures.console_));
  }
***REMOVED***


***REMOVED***
***REMOVED*** Register to expect failure for the given condition.  Multiple calls to this
***REMOVED*** function act as a boolean OR.  The first applicable message will be used.
***REMOVED*** @param {boolean} condition Whether to expect failure.
***REMOVED*** @param {string=} opt_message Descriptive message of this expected failure.
***REMOVED***
goog.testing.ExpectedFailures.prototype.expectFailureFor = function(
    condition, opt_message) {
  this.expectingFailure_ = this.expectingFailure_ || condition;
  if (condition) {
    this.failureMessage_ = this.failureMessage_ || opt_message || '';
  }
***REMOVED***


***REMOVED***
***REMOVED*** Determines if the given exception was expected.
***REMOVED*** @param {Object} ex The exception to check.
***REMOVED*** @return {boolean} Whether the exception was expected.
***REMOVED***
goog.testing.ExpectedFailures.prototype.isExceptionExpected = function(ex) {
  return this.expectingFailure_ && ex instanceof goog.testing.JsUnitException;
***REMOVED***


***REMOVED***
***REMOVED*** Handle an exception, suppressing it if it is a unit test failure that we
***REMOVED*** expected.
***REMOVED*** @param {Error} ex The exception to handle.
***REMOVED***
goog.testing.ExpectedFailures.prototype.handleException = function(ex) {
  if (this.isExceptionExpected(ex)) {
    this.logger_.info('Suppressing test failure in ' +
        goog.testing.TestCase.currentTestName + ':' +
        (this.failureMessage_ ? '\n(' + this.failureMessage_ + ')' : ''),
        ex);
    this.suppressedFailures_.push(ex);
    return;
  }

  // Rethrow the exception if we weren't expecting it or if it is a normal
  // exception.
  throw ex;
***REMOVED***


***REMOVED***
***REMOVED*** Run the given function, catching any expected failures.
***REMOVED*** @param {Function} func The function to run.
***REMOVED*** @param {boolean=} opt_lenient Whether to ignore if the expected failures
***REMOVED***     didn't occur.  In this case a warning will be logged in handleTearDown.
***REMOVED***
goog.testing.ExpectedFailures.prototype.run = function(func, opt_lenient) {
  try {
    func();
  } catch (ex) {
    this.handleException(ex);
  }

  if (!opt_lenient && this.expectingFailure_ &&
      !this.suppressedFailures_.length) {
    fail(this.getExpectationMessage_());
  }
***REMOVED***


***REMOVED***
***REMOVED*** @return {string} A warning describing an expected failure that didn't occur.
***REMOVED*** @private
***REMOVED***
goog.testing.ExpectedFailures.prototype.getExpectationMessage_ = function() {
  return 'Expected a test failure in \'' +
         goog.testing.TestCase.currentTestName + '\' but the test passed.';
***REMOVED***


***REMOVED***
***REMOVED*** Handle the tearDown phase of a test, alerting the user if an expected test
***REMOVED*** was not suppressed.
***REMOVED***
goog.testing.ExpectedFailures.prototype.handleTearDown = function() {
  if (this.expectingFailure_ && !this.suppressedFailures_.length) {
    this.logger_.warning(this.getExpectationMessage_());
  }
  this.reset_();
***REMOVED***


***REMOVED***
***REMOVED*** Reset internal state.
***REMOVED*** @private
***REMOVED***
goog.testing.ExpectedFailures.prototype.reset_ = function() {
  this.expectingFailure_ = false;
  this.failureMessage_ = '';
  this.suppressedFailures_ = [];
***REMOVED***
