// Copyright 2009 The Closure Library Authors. All Rights Reserved.
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
***REMOVED*** @fileoverview Defines test classes for tests that can wait for conditions.
***REMOVED***
***REMOVED*** Normal unit tests must complete their test logic within a single function
***REMOVED*** execution. This is ideal for most tests, but makes it difficult to test
***REMOVED*** routines that require real time to complete. The tests and TestCase in this
***REMOVED*** file allow for tests that can wait until a condition is true before
***REMOVED*** continuing execution.
***REMOVED***
***REMOVED*** Each test has the typical three phases of execution: setUp, the test itself,
***REMOVED*** and tearDown. During each phase, the test function may add wait conditions,
***REMOVED*** which result in new test steps being added for that phase. All steps in a
***REMOVED*** given phase must complete before moving on to the next phase. An error in
***REMOVED*** any phase will stop that test and report the error to the test runner.
***REMOVED***
***REMOVED*** This class should not be used where adequate mocks exist. Time-based routines
***REMOVED*** should use the MockClock, which runs much faster and provides equivalent
***REMOVED*** results. Continuation tests should be used for testing code that depends on
***REMOVED*** browser behaviors that are difficult to mock. For example, testing code that
***REMOVED*** relies on Iframe load events, event or layout code that requires a setTimeout
***REMOVED*** to become valid, and other browser-dependent native object interactions for
***REMOVED*** which mocks are insufficient.
***REMOVED***
***REMOVED*** Sample usage:
***REMOVED***
***REMOVED*** <pre>
***REMOVED*** var testCase = new goog.testing.ContinuationTestCase();
***REMOVED*** testCase.autoDiscoverTests();
***REMOVED***
***REMOVED*** if (typeof G_testRunner != 'undefined') {
***REMOVED***   G_testRunner.initialize(testCase);
***REMOVED*** }
***REMOVED***
***REMOVED*** function testWaiting() {
***REMOVED***   var someVar = true;
***REMOVED***   waitForTimeout(function() {
***REMOVED***     assertTrue(someVar)
***REMOVED***   }, 500);
***REMOVED*** }
***REMOVED***
***REMOVED*** function testWaitForEvent() {
***REMOVED***   var et = goog.events.EventTarget();
***REMOVED***   waitForEvent(et, 'test', function() {
***REMOVED***     // Test step runs after the event fires.
***REMOVED***   })
***REMOVED***   et.dispatchEvent(et, 'test');
***REMOVED*** }
***REMOVED***
***REMOVED*** function testWaitForCondition() {
***REMOVED***   var counter = 0;
***REMOVED***
***REMOVED***   waitForCondition(function() {
***REMOVED***     // This function is evaluated periodically until it returns true, or it
***REMOVED***     // times out.
***REMOVED***     return ++counter >= 3;
***REMOVED***   }, function() {
***REMOVED***     // This test step is run once the condition becomes true.
***REMOVED***     assertEquals(3, counter);
***REMOVED***   });
***REMOVED*** }
***REMOVED*** </pre>
***REMOVED***
***REMOVED*** @author brenneman@google.com (Shawn Brenneman)
***REMOVED***


goog.provide('goog.testing.ContinuationTestCase');
goog.provide('goog.testing.ContinuationTestCase.Step');
goog.provide('goog.testing.ContinuationTestCase.Test');

goog.require('goog.array');
goog.require('goog.events.EventHandler');
goog.require('goog.testing.TestCase');
goog.require('goog.testing.TestCase.Test');
goog.require('goog.testing.asserts');



***REMOVED***
***REMOVED*** Constructs a test case that supports tests with continuations. Test functions
***REMOVED*** may issue "wait" commands that suspend the test temporarily and continue once
***REMOVED*** the wait condition is met.
***REMOVED***
***REMOVED*** @param {string=} opt_name Optional name for the test case.
***REMOVED***
***REMOVED*** @extends {goog.testing.TestCase}
***REMOVED***
goog.testing.ContinuationTestCase = function(opt_name) {
  goog.testing.TestCase.call(this, opt_name);

 ***REMOVED*****REMOVED***
  ***REMOVED*** An event handler for waiting on Closure or browser events during tests.
  ***REMOVED*** @type {goog.events.EventHandler}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.handler_ = new goog.events.EventHandler(this);
***REMOVED***
goog.inherits(goog.testing.ContinuationTestCase, goog.testing.TestCase);


***REMOVED***
***REMOVED*** The default maximum time to wait for a single test step in milliseconds.
***REMOVED*** @type {number}
***REMOVED***
goog.testing.ContinuationTestCase.MAX_TIMEOUT = 1000;


***REMOVED***
***REMOVED*** Lock used to prevent multiple test steps from running recursively.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.testing.ContinuationTestCase.locked_ = false;


***REMOVED***
***REMOVED*** The current test being run.
***REMOVED*** @type {goog.testing.ContinuationTestCase.Test}
***REMOVED*** @private
***REMOVED***
goog.testing.ContinuationTestCase.prototype.currentTest_ = null;


***REMOVED***
***REMOVED*** Enables or disables the wait functions in the global scope.
***REMOVED*** @param {boolean} enable Whether the wait functions should be exported.
***REMOVED*** @private
***REMOVED***
goog.testing.ContinuationTestCase.prototype.enableWaitFunctions_ =
    function(enable) {
  if (enable) {
    goog.exportSymbol('waitForCondition',
                      goog.bind(this.waitForCondition, this));
    goog.exportSymbol('waitForEvent', goog.bind(this.waitForEvent, this));
    goog.exportSymbol('waitForTimeout', goog.bind(this.waitForTimeout, this));
  } else {
    // Internet Explorer doesn't allow deletion of properties on the window.
    goog.global['waitForCondition'] = undefined;
    goog.global['waitForEvent'] = undefined;
    goog.global['waitForTimeout'] = undefined;
  }
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.testing.ContinuationTestCase.prototype.runTests = function() {
  this.enableWaitFunctions_(true);
  goog.testing.ContinuationTestCase.superClass_.runTests.call(this);
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.testing.ContinuationTestCase.prototype.finalize = function() {
  this.enableWaitFunctions_(false);
  goog.testing.ContinuationTestCase.superClass_.finalize.call(this);
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.testing.ContinuationTestCase.prototype.cycleTests = function() {
  // Get the next test in the queue.
  if (!this.currentTest_) {
    this.currentTest_ = this.createNextTest_();
  }

  // Run the next step of the current test, or exit if all tests are complete.
  if (this.currentTest_) {
    this.runNextStep_();
  } else {
    this.finalize();
  }
***REMOVED***


***REMOVED***
***REMOVED*** Creates the next test in the queue.
***REMOVED*** @return {goog.testing.ContinuationTestCase.Test} The next test to execute, or
***REMOVED***     null if no pending tests remain.
***REMOVED*** @private
***REMOVED***
goog.testing.ContinuationTestCase.prototype.createNextTest_ = function() {
  var test = this.next();
  if (!test) {
    return null;
  }


  var name = test.name;
  goog.testing.TestCase.currentTestName = name;
  this.result_.runCount++;
  this.log('Running test: ' + name);

  return new goog.testing.ContinuationTestCase.Test(
      new goog.testing.TestCase.Test(name, this.setUp, this),
      test,
      new goog.testing.TestCase.Test(name, this.tearDown, this));
***REMOVED***


***REMOVED***
***REMOVED*** Cleans up a finished test and cycles to the next test.
***REMOVED*** @private
***REMOVED***
goog.testing.ContinuationTestCase.prototype.finishTest_ = function() {
  var err = this.currentTest_.getError();
  if (err) {
    this.doError(this.currentTest_, err);
  } else {
    this.doSuccess(this.currentTest_);
  }

  goog.testing.TestCase.currentTestName = null;
  this.currentTest_ = null;
  this.locked_ = false;
  this.handler_.removeAll();

  this.timeout(goog.bind(this.cycleTests, this), 0);
***REMOVED***


***REMOVED***
***REMOVED*** Executes the next step in the current phase, advancing through each phase as
***REMOVED*** all steps are completed.
***REMOVED*** @private
***REMOVED***
goog.testing.ContinuationTestCase.prototype.runNextStep_ = function() {
  if (this.locked_) {
    // Attempting to run a step before the previous step has finished. Try again
    // after that step has released the lock.
    return;
  }

  var phase = this.currentTest_.getCurrentPhase();

  if (!phase || !phase.length) {
    // No more steps for this test.
    this.finishTest_();
    return;
  }

  // Find the next step that is not in a wait state.
  var stepIndex = goog.array.findIndex(phase, function(step) {
    return !step.waiting;
  });

  if (stepIndex < 0) {
    // All active steps are currently waiting. Return until one wakes up.
    return;
  }

  this.locked_ = true;
  var step = phase[stepIndex];

  try {
    step.execute();
    // Remove the successfully completed step. If an error is thrown, all steps
    // will be removed for this phase.
    goog.array.removeAt(phase, stepIndex);

  } catch (e) {
    this.currentTest_.setError(e);

    // An assertion has failed, or an exception was raised. Clear the current
    // phase, whether it is setUp, test, or tearDown.
    this.currentTest_.cancelCurrentPhase();

    // Cancel the setUp and test phase no matter where the error occurred. The
    // tearDown phase will still run if it has pending steps.
    this.currentTest_.cancelTestPhase();
  }

  this.locked_ = false;
  this.runNextStep_();
***REMOVED***


***REMOVED***
***REMOVED*** Creates a new test step that will run after a user-specified
***REMOVED*** timeout.  No guarantee is made on the execution order of the
***REMOVED*** continuation, except for those provided by each browser's
***REMOVED*** window.setTimeout. In particular, if two continuations are
***REMOVED*** registered at the same time with very small delta for their
***REMOVED*** durations, this class can not guarantee that the continuation with
***REMOVED*** the smaller duration will be executed first.
***REMOVED*** @param {Function} continuation The test function to invoke after the timeout.
***REMOVED*** @param {number=} opt_duration The length of the timeout in milliseconds.
***REMOVED***
goog.testing.ContinuationTestCase.prototype.waitForTimeout =
    function(continuation, opt_duration) {
  var step = this.addStep_(continuation);
  step.setTimeout(goog.bind(this.handleComplete_, this, step),
                  opt_duration || 0);
***REMOVED***


***REMOVED***
***REMOVED*** Creates a new test step that will run after an event has fired. If the event
***REMOVED*** does not fire within a reasonable timeout, the test will fail.
***REMOVED*** @param {goog.events.EventTarget|EventTarget} eventTarget The target that will
***REMOVED***     fire the event.
***REMOVED*** @param {string} eventType The type of event to listen for.
***REMOVED*** @param {Function} continuation The test function to invoke after the event
***REMOVED***     fires.
***REMOVED***
goog.testing.ContinuationTestCase.prototype.waitForEvent = function(
    eventTarget,
    eventType,
    continuation) {

  var step = this.addStep_(continuation);

  var duration = goog.testing.ContinuationTestCase.MAX_TIMEOUT;
  step.setTimeout(goog.bind(this.handleTimeout_, this, step, duration),
                  duration);

  this.handler_.listenOnce(eventTarget,
                           eventType,
                           goog.bind(this.handleComplete_, this, step));
***REMOVED***


***REMOVED***
***REMOVED*** Creates a new test step which will run once a condition becomes true. The
***REMOVED*** condition will be polled at a user-specified interval until it becomes true,
***REMOVED*** or until a maximum timeout is reached.
***REMOVED*** @param {Function} condition The condition to poll.
***REMOVED*** @param {Function} continuation The test code to evaluate once the condition
***REMOVED***     becomes true.
***REMOVED*** @param {number=} opt_interval The polling interval in milliseconds.
***REMOVED*** @param {number=} opt_maxTimeout The maximum amount of time to wait for the
***REMOVED***     condition in milliseconds (defaults to 1000).
***REMOVED***
goog.testing.ContinuationTestCase.prototype.waitForCondition = function(
    condition,
    continuation,
    opt_interval,
    opt_maxTimeout) {

  var interval = opt_interval || 100;
  var timeout = opt_maxTimeout || goog.testing.ContinuationTestCase.MAX_TIMEOUT;

  var step = this.addStep_(continuation);
  this.testCondition_(step, condition, goog.now(), interval, timeout);
***REMOVED***


***REMOVED***
***REMOVED*** Creates a new asynchronous test step which will be added to the current test
***REMOVED*** phase.
***REMOVED*** @param {Function} func The test function that will be executed for this step.
***REMOVED*** @return {goog.testing.ContinuationTestCase.Step} A new test step.
***REMOVED*** @private
***REMOVED***
goog.testing.ContinuationTestCase.prototype.addStep_ = function(func) {
  if (!this.currentTest_) {
    throw Error('Cannot add test steps outside of a running test.');
  }

  var step = new goog.testing.ContinuationTestCase.Step(
      this.currentTest_.name,
      func,
      this.currentTest_.scope);
  this.currentTest_.addStep(step);
  return step;
***REMOVED***


***REMOVED***
***REMOVED*** Handles completion of a step's wait condition. Advances the test, allowing
***REMOVED*** the step's test method to run.
***REMOVED*** @param {goog.testing.ContinuationTestCase.Step} step The step that has
***REMOVED***     finished waiting.
***REMOVED*** @private
***REMOVED***
goog.testing.ContinuationTestCase.prototype.handleComplete_ = function(step) {
  step.clearTimeout();
  step.waiting = false;
  this.runNextStep_();
***REMOVED***


***REMOVED***
***REMOVED*** Handles the timeout event for a step that has exceeded the maximum time. This
***REMOVED*** causes the current test to fail.
***REMOVED*** @param {goog.testing.ContinuationTestCase.Step} step The timed-out step.
***REMOVED*** @param {number} duration The length of the timeout in milliseconds.
***REMOVED*** @private
***REMOVED***
goog.testing.ContinuationTestCase.prototype.handleTimeout_ =
    function(step, duration) {
  step.ref = function() {
    fail('Continuation timed out after ' + duration + 'ms.');
 ***REMOVED*****REMOVED***

  // Since the test is failing, cancel any other pending event listeners.
  this.handler_.removeAll();
  this.handleComplete_(step);
***REMOVED***


***REMOVED***
***REMOVED*** Tests a wait condition and executes the associated test step once the
***REMOVED*** condition is true.
***REMOVED***
***REMOVED*** If the condition does not become true before the maximum duration, the
***REMOVED*** interval will stop and the test step will fail in the kill timer.
***REMOVED***
***REMOVED*** @param {goog.testing.ContinuationTestCase.Step} step The waiting test step.
***REMOVED*** @param {Function} condition The test condition.
***REMOVED*** @param {number} startTime Time when the test step began waiting.
***REMOVED*** @param {number} interval The duration in milliseconds to wait between tests.
***REMOVED*** @param {number} timeout The maximum amount of time to wait for the condition
***REMOVED***     to become true. Measured from the startTime in milliseconds.
***REMOVED*** @private
***REMOVED***
goog.testing.ContinuationTestCase.prototype.testCondition_ = function(
    step,
    condition,
    startTime,
    interval,
    timeout) {

  var duration = goog.now() - startTime;

  if (condition()) {
    this.handleComplete_(step);
  } else if (duration < timeout) {
    step.setTimeout(goog.bind(this.testCondition_,
                              this,
                              step,
                              condition,
                              startTime,
                              interval,
                              timeout),
                    interval);
  } else {
    this.handleTimeout_(step, duration);
  }
***REMOVED***



***REMOVED***
***REMOVED*** Creates a continuation test case, which consists of multiple test steps that
***REMOVED*** occur in several phases.
***REMOVED***
***REMOVED*** The steps are distributed between setUp, test, and tearDown phases. During
***REMOVED*** the execution of each step, 0 or more steps may be added to the current
***REMOVED*** phase. Once all steps in a phase have completed, the next phase will be
***REMOVED*** executed.
***REMOVED***
***REMOVED*** If any errors occur (such as an assertion failure), the setUp and Test phases
***REMOVED*** will be cancelled immediately. The tearDown phase will always start, but may
***REMOVED*** be cancelled as well if it raises an error.
***REMOVED***
***REMOVED*** @param {goog.testing.TestCase.Test} setUp A setUp test method to run before
***REMOVED***     the main test phase.
***REMOVED*** @param {goog.testing.TestCase.Test} test A test method to run.
***REMOVED*** @param {goog.testing.TestCase.Test} tearDown A tearDown test method to run
***REMOVED***     after the test method completes or fails.
***REMOVED***
***REMOVED*** @extends {goog.testing.TestCase.Test}
***REMOVED***
goog.testing.ContinuationTestCase.Test = function(setUp, test, tearDown) {
  // This test container has a name, but no evaluation function or scope.
  goog.testing.TestCase.Test.call(this, test.name, null, null);

 ***REMOVED*****REMOVED***
  ***REMOVED*** The list of test steps to run during setUp.
  ***REMOVED*** @type {Array.<goog.testing.TestCase.Test>}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.setUp_ = [setUp];

 ***REMOVED*****REMOVED***
  ***REMOVED*** The list of test steps to run for the actual test.
  ***REMOVED*** @type {Array.<goog.testing.TestCase.Test>}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.test_ = [test];

 ***REMOVED*****REMOVED***
  ***REMOVED*** The list of test steps to run during the tearDown phase.
  ***REMOVED*** @type {Array.<goog.testing.TestCase.Test>}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.tearDown_ = [tearDown];
***REMOVED***
goog.inherits(goog.testing.ContinuationTestCase.Test,
              goog.testing.TestCase.Test);


***REMOVED***
***REMOVED*** The first error encountered during the test run, if any.
***REMOVED*** @type {Error}
***REMOVED*** @private
***REMOVED***
goog.testing.ContinuationTestCase.Test.prototype.error_ = null;


***REMOVED***
***REMOVED*** @return {Error} The first error to be raised during the test run or null if
***REMOVED***     no errors occurred.
***REMOVED***
goog.testing.ContinuationTestCase.Test.prototype.getError = function() {
  return this.error_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets an error for the test so it can be reported. Only the first error set
***REMOVED*** during a test will be reported. Additional errors that occur in later test
***REMOVED*** phases will be discarded.
***REMOVED*** @param {Error} e An error.
***REMOVED***
goog.testing.ContinuationTestCase.Test.prototype.setError = function(e) {
  this.error_ = this.error_ || e;
***REMOVED***


***REMOVED***
***REMOVED*** @return {Array.<goog.testing.TestCase.Test>} The current phase of steps
***REMOVED***    being processed. Returns null if all steps have been completed.
***REMOVED***
goog.testing.ContinuationTestCase.Test.prototype.getCurrentPhase = function() {
  if (this.setUp_.length) {
    return this.setUp_;
  }

  if (this.test_.length) {
    return this.test_;
  }

  if (this.tearDown_.length) {
    return this.tearDown_;
  }

  return null;
***REMOVED***


***REMOVED***
***REMOVED*** Adds a new test step to the end of the current phase. The new step will wait
***REMOVED*** for a condition to be met before running, or will fail after a timeout.
***REMOVED*** @param {goog.testing.ContinuationTestCase.Step} step The test step to add.
***REMOVED***
goog.testing.ContinuationTestCase.Test.prototype.addStep = function(step) {
  var phase = this.getCurrentPhase();
  if (phase) {
    phase.push(step);
  } else {
    throw Error('Attempted to add a step to a completed test.');
  }
***REMOVED***


***REMOVED***
***REMOVED*** Cancels all remaining steps in the current phase. Called after an error in
***REMOVED*** any phase occurs.
***REMOVED***
goog.testing.ContinuationTestCase.Test.prototype.cancelCurrentPhase =
    function() {
  this.cancelPhase_(this.getCurrentPhase());
***REMOVED***


***REMOVED***
***REMOVED*** Skips the rest of the setUp and test phases, but leaves the tearDown phase to
***REMOVED*** clean up.
***REMOVED***
goog.testing.ContinuationTestCase.Test.prototype.cancelTestPhase = function() {
  this.cancelPhase_(this.setUp_);
  this.cancelPhase_(this.test_);
***REMOVED***


***REMOVED***
***REMOVED*** Clears a test phase and cancels any pending steps found.
***REMOVED*** @param {Array.<goog.testing.TestCase.Test>} phase A list of test steps.
***REMOVED*** @private
***REMOVED***
goog.testing.ContinuationTestCase.Test.prototype.cancelPhase_ =
    function(phase) {
  while (phase && phase.length) {
    var step = phase.pop();
    if (step instanceof goog.testing.ContinuationTestCase.Step) {
      step.clearTimeout();
    }
  }
***REMOVED***



***REMOVED***
***REMOVED*** Constructs a single step in a larger continuation test. Each step is similar
***REMOVED*** to a typical TestCase test, except it may wait for an event or timeout to
***REMOVED*** occur before running the test function.
***REMOVED***
***REMOVED*** @param {string} name The test name.
***REMOVED*** @param {Function} ref The test function to run.
***REMOVED*** @param {Object=} opt_scope The object context to run the test in.
***REMOVED***
***REMOVED*** @extends {goog.testing.TestCase.Test}
***REMOVED***
goog.testing.ContinuationTestCase.Step = function(name, ref, opt_scope) {
  goog.testing.TestCase.Test.call(this, name, ref, opt_scope);
***REMOVED***
goog.inherits(goog.testing.ContinuationTestCase.Step,
              goog.testing.TestCase.Test);


***REMOVED***
***REMOVED*** Whether the step is currently waiting for a condition to continue. All new
***REMOVED*** steps begin in wait state.
***REMOVED*** @type {boolean}
***REMOVED***
goog.testing.ContinuationTestCase.Step.prototype.waiting = true;


***REMOVED***
***REMOVED*** A saved reference to window.clearTimeout so that MockClock or other overrides
***REMOVED*** don't affect continuation timeouts.
***REMOVED*** @type {Function}
***REMOVED*** @private
***REMOVED***
goog.testing.ContinuationTestCase.Step.protectedClearTimeout_ =
    window.clearTimeout;


***REMOVED***
***REMOVED*** A saved reference to window.setTimeout so that MockClock or other overrides
***REMOVED*** don't affect continuation timeouts.
***REMOVED*** @type {Function}
***REMOVED*** @private
***REMOVED***
goog.testing.ContinuationTestCase.Step.protectedSetTimeout_ = window.setTimeout;


***REMOVED***
***REMOVED*** Key to this step's timeout. If the step is waiting for an event, the timeout
***REMOVED*** will be used as a kill timer. If the step is waiting
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.testing.ContinuationTestCase.Step.prototype.timeout_;


***REMOVED***
***REMOVED*** Starts a timeout for this step. Each step may have only one timeout active at
***REMOVED*** a time.
***REMOVED*** @param {Function} func The function to call after the timeout.
***REMOVED*** @param {number} duration The number of milliseconds to wait before invoking
***REMOVED***     the function.
***REMOVED***
goog.testing.ContinuationTestCase.Step.prototype.setTimeout =
    function(func, duration) {

  this.clearTimeout();

  var setTimeout = goog.testing.ContinuationTestCase.Step.protectedSetTimeout_;
  this.timeout_ = setTimeout(func, duration);
***REMOVED***


***REMOVED***
***REMOVED*** Clears the current timeout if it is active.
***REMOVED***
goog.testing.ContinuationTestCase.Step.prototype.clearTimeout = function() {
  if (this.timeout_) {
    var clear = goog.testing.ContinuationTestCase.Step.protectedClearTimeout_;

    clear(this.timeout_);
    delete this.timeout_;
  }
***REMOVED***
