// Copyright 2010 The Closure Library Authors. All Rights Reserved.
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
// All Rights Reserved.

***REMOVED***
***REMOVED*** @fileoverview A class representing a set of test functions that use
***REMOVED*** asynchronous functions that cannot be meaningfully mocked.
***REMOVED***
***REMOVED*** To create a Google-compatable JsUnit test using this test case, put the
***REMOVED*** following snippet in your test:
***REMOVED***
***REMOVED***   var asyncTestCase = goog.testing.AsyncTestCase.createAndInstall();
***REMOVED***
***REMOVED*** To make the test runner wait for your asynchronous behaviour, use:
***REMOVED***
***REMOVED***   asyncTestCase.waitForAsync('Waiting for xhr to respond');
***REMOVED***
***REMOVED*** The next test will not start until the following call is made, or a
***REMOVED*** timeout occurs:
***REMOVED***
***REMOVED***   asyncTestCase.continueTesting();
***REMOVED***
***REMOVED*** There does NOT need to be a 1:1 mapping of waitForAsync calls and
***REMOVED*** continueTesting calls. The next test will be run after a single call to
***REMOVED*** continueTesting is made, as long as there is no subsequent call to
***REMOVED*** waitForAsync in the same thread.
***REMOVED***
***REMOVED*** Example:
***REMOVED***   // Returning here would cause the next test to be run.
***REMOVED***   asyncTestCase.waitForAsync('description 1');
***REMOVED***   // Returning here would***REMOVED***not* cause the next test to be run.
***REMOVED***   // Only effect of additional waitForAsync() calls is an updated
***REMOVED***   // description in the case of a timeout.
***REMOVED***   asyncTestCase.waitForAsync('updated description');
***REMOVED***   asyncTestCase.continueTesting();
***REMOVED***   // Returning here would cause the next test to be run.
***REMOVED***   asyncTestCase.waitForAsync('just kidding, still running.');
***REMOVED***   // Returning here would***REMOVED***not* cause the next test to be run.
***REMOVED***
***REMOVED*** The test runner can also be made to wait for more than one asynchronous
***REMOVED*** event with:
***REMOVED***
***REMOVED***   asyncTestCase.waitForSignals(n);
***REMOVED***
***REMOVED*** The next test will not start until asyncTestCase.signal() is called n times,
***REMOVED*** or the test step timeout is exceeded.
***REMOVED***
***REMOVED*** This class supports asynchronous behaviour in all test functions except for
***REMOVED*** tearDownPage. If such support is needed, it can be added.
***REMOVED***
***REMOVED*** Example Usage:
***REMOVED***
***REMOVED***   var asyncTestCase = goog.testing.AsyncTestCase.createAndInstall();
***REMOVED***   // Optionally, set a longer-than-normal step timeout.
***REMOVED***   asyncTestCase.stepTimeout = 30***REMOVED*** 1000;
***REMOVED***
***REMOVED***   function testSetTimeout() {
***REMOVED***     var step = 0;
***REMOVED***     function stepCallback() {
***REMOVED***       step++;
***REMOVED***       switch (step) {
***REMOVED***         case 1:
***REMOVED***           var startTime = goog.now();
***REMOVED***           asyncTestCase.waitForAsync('step 1');
***REMOVED***           window.setTimeout(stepCallback, 100);
***REMOVED***           break;
***REMOVED***         case 2:
***REMOVED***           assertTrue('Timeout fired too soon',
***REMOVED***               goog.now() - startTime >= 100);
***REMOVED***           asyncTestCase.waitForAsync('step 2');
***REMOVED***           window.setTimeout(stepCallback, 100);
***REMOVED***           break;
***REMOVED***         case 3:
***REMOVED***           assertTrue('Timeout fired too soon',
***REMOVED***               goog.now() - startTime >= 200);
***REMOVED***           asyncTestCase.continueTesting();
***REMOVED***           break;
***REMOVED***         default:
***REMOVED***           fail('Unexpected call to stepCallback');
***REMOVED***       }
***REMOVED***     }
***REMOVED***     stepCallback();
***REMOVED***   }
***REMOVED***
***REMOVED*** Known Issues:
***REMOVED***   IE7 Exceptions:
***REMOVED***     As the failingtest.html will show, it appears as though ie7 does not
***REMOVED***     propagate an exception past a function called using the func.call()
***REMOVED***     syntax. This causes case 3 of the failing tests (exceptions) to show up
***REMOVED***     as timeouts in IE.
***REMOVED***   window.onerror:
***REMOVED***     This seems to catch errors only in ff2/ff3. It does not work in Safari or
***REMOVED***     IE7. The consequence of this is that exceptions that would have been
***REMOVED***     caught by window.onerror show up as timeouts.
***REMOVED***
***REMOVED*** @author agrieve@google.com (Andrew Grieve)
***REMOVED***

goog.provide('goog.testing.AsyncTestCase');
goog.provide('goog.testing.AsyncTestCase.ControlBreakingException');

goog.require('goog.testing.TestCase');
goog.require('goog.testing.TestCase.Test');
goog.require('goog.testing.asserts');



***REMOVED***
***REMOVED*** A test case that is capable of running tests the contain asynchronous logic.
***REMOVED*** @param {string=} opt_name A descriptive name for the test case.
***REMOVED*** @extends {goog.testing.TestCase}
***REMOVED***
***REMOVED***
goog.testing.AsyncTestCase = function(opt_name) {
  goog.testing.TestCase.call(this, opt_name);
***REMOVED***
goog.inherits(goog.testing.AsyncTestCase, goog.testing.TestCase);


***REMOVED***
***REMOVED*** Represents result of top stack function call.
***REMOVED*** @typedef {{controlBreakingExceptionThrown: boolean, message: string}}
***REMOVED*** @private
***REMOVED***
goog.testing.AsyncTestCase.TopStackFuncResult_;



***REMOVED***
***REMOVED*** An exception class used solely for control flow.
***REMOVED*** @param {string=} opt_message Error message.
***REMOVED***
***REMOVED*** @final
***REMOVED***
goog.testing.AsyncTestCase.ControlBreakingException = function(opt_message) {
 ***REMOVED*****REMOVED***
  ***REMOVED*** The exception message.
  ***REMOVED*** @type {string}
 ***REMOVED*****REMOVED***
  this.message = opt_message || '';
***REMOVED***


***REMOVED***
***REMOVED*** Return value for .toString().
***REMOVED*** @type {string}
***REMOVED***
goog.testing.AsyncTestCase.ControlBreakingException.TO_STRING =
    '[AsyncTestCase.ControlBreakingException]';


***REMOVED***
***REMOVED*** Marks this object as a ControlBreakingException
***REMOVED*** @type {boolean}
***REMOVED***
goog.testing.AsyncTestCase.ControlBreakingException.prototype.
    isControlBreakingException = true;


***REMOVED*** @override***REMOVED***
goog.testing.AsyncTestCase.ControlBreakingException.prototype.toString =
    function() {
  // This shows up in the console when the exception is not caught.
  return goog.testing.AsyncTestCase.ControlBreakingException.TO_STRING;
***REMOVED***


***REMOVED***
***REMOVED*** How long to wait for a single step of a test to complete in milliseconds.
***REMOVED*** A step starts when a call to waitForAsync() is made.
***REMOVED*** @type {number}
***REMOVED***
goog.testing.AsyncTestCase.prototype.stepTimeout = 1000;


***REMOVED***
***REMOVED*** How long to wait after a failed test before moving onto the next one.
***REMOVED*** The purpose of this is to allow any pending async callbacks from the failing
***REMOVED*** test to finish up and not cause the next test to fail.
***REMOVED*** @type {number}
***REMOVED***
goog.testing.AsyncTestCase.prototype.timeToSleepAfterFailure = 500;


***REMOVED***
***REMOVED*** Turn on extra logging to help debug failing async. tests.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.testing.AsyncTestCase.prototype.enableDebugLogs_ = false;


***REMOVED***
***REMOVED*** A reference to the original asserts.js assert_() function.
***REMOVED*** @private
***REMOVED***
goog.testing.AsyncTestCase.prototype.origAssert_;


***REMOVED***
***REMOVED*** A reference to the original asserts.js fail() function.
***REMOVED*** @private
***REMOVED***
goog.testing.AsyncTestCase.prototype.origFail_;


***REMOVED***
***REMOVED*** A reference to the original window.onerror function.
***REMOVED*** @type {Function|undefined}
***REMOVED*** @private
***REMOVED***
goog.testing.AsyncTestCase.prototype.origOnError_;


***REMOVED***
***REMOVED*** The stage of the test we are currently on.
***REMOVED*** @type {Function|undefined}}
***REMOVED*** @private
***REMOVED***
goog.testing.AsyncTestCase.prototype.curStepFunc_;


***REMOVED***
***REMOVED*** The name of the stage of the test we are currently on.
***REMOVED*** @type {string}
***REMOVED*** @private
***REMOVED***
goog.testing.AsyncTestCase.prototype.curStepName_ = '';


***REMOVED***
***REMOVED*** The stage of the test we should run next.
***REMOVED*** @type {Function|undefined}
***REMOVED*** @private
***REMOVED***
goog.testing.AsyncTestCase.prototype.nextStepFunc;


***REMOVED***
***REMOVED*** The name of the stage of the test we should run next.
***REMOVED*** @type {string}
***REMOVED*** @private
***REMOVED***
goog.testing.AsyncTestCase.prototype.nextStepName_ = '';


***REMOVED***
***REMOVED*** The handle to the current setTimeout timer.
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.testing.AsyncTestCase.prototype.timeoutHandle_ = 0;


***REMOVED***
***REMOVED*** Marks if the cleanUp() function has been called for the currently running
***REMOVED*** test.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.testing.AsyncTestCase.prototype.cleanedUp_ = false;


***REMOVED***
***REMOVED*** The currently active test.
***REMOVED*** @type {goog.testing.TestCase.Test|undefined}
***REMOVED*** @protected
***REMOVED***
goog.testing.AsyncTestCase.prototype.activeTest;


***REMOVED***
***REMOVED*** A flag to prevent recursive exception handling.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.testing.AsyncTestCase.prototype.inException_ = false;


***REMOVED***
***REMOVED*** Flag used to determine if we can move to the next step in the testing loop.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.testing.AsyncTestCase.prototype.isReady_ = true;


***REMOVED***
***REMOVED*** Number of signals to wait for before continuing testing when waitForSignals
***REMOVED*** is used.
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.testing.AsyncTestCase.prototype.expectedSignalCount_ = 0;


***REMOVED***
***REMOVED*** Number of signals received.
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.testing.AsyncTestCase.prototype.receivedSignalCount_ = 0;


***REMOVED***
***REMOVED*** Flag that tells us if there is a function in the call stack that will make
***REMOVED*** a call to pump_().
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.testing.AsyncTestCase.prototype.returnWillPump_ = false;


***REMOVED***
***REMOVED*** The number of times we have thrown a ControlBreakingException so that we
***REMOVED*** know not to complain in our window.onerror handler. In Webkit, window.onerror
***REMOVED*** is not supported, and so this counter will keep going up but we won't care
***REMOVED*** about it.
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.testing.AsyncTestCase.prototype.numControlExceptionsExpected_ = 0;


***REMOVED***
***REMOVED*** The current step name.
***REMOVED*** @return {!string} Step name.
***REMOVED*** @protected
***REMOVED***
goog.testing.AsyncTestCase.prototype.getCurrentStepName = function() {
  return this.curStepName_;
***REMOVED***


***REMOVED***
***REMOVED*** Preferred way of creating an AsyncTestCase. Creates one and initializes it
***REMOVED*** with the G_testRunner.
***REMOVED*** @param {string=} opt_name A descriptive name for the test case.
***REMOVED*** @return {!goog.testing.AsyncTestCase} The created AsyncTestCase.
***REMOVED***
goog.testing.AsyncTestCase.createAndInstall = function(opt_name) {
  var asyncTestCase = new goog.testing.AsyncTestCase(opt_name);
  goog.testing.TestCase.initializeTestRunner(asyncTestCase);
  return asyncTestCase;
***REMOVED***


***REMOVED***
***REMOVED*** Informs the testcase not to continue to the next step in the test cycle
***REMOVED*** until continueTesting is called.
***REMOVED*** @param {string=} opt_name A description of what we are waiting for.
***REMOVED***
goog.testing.AsyncTestCase.prototype.waitForAsync = function(opt_name) {
  this.isReady_ = false;
  this.curStepName_ = opt_name || this.curStepName_;

  // Reset the timer that tracks if the async test takes too long.
  this.stopTimeoutTimer_();
  this.startTimeoutTimer_();
***REMOVED***


***REMOVED***
***REMOVED*** Continue with the next step in the test cycle.
***REMOVED***
goog.testing.AsyncTestCase.prototype.continueTesting = function() {
  if (this.receivedSignalCount_ < this.expectedSignalCount_) {
    var remaining = this.expectedSignalCount_ - this.receivedSignalCount_;
    throw Error('Still waiting for ' + remaining + ' signals.');
  }
  this.endCurrentStep_();
***REMOVED***


***REMOVED***
***REMOVED*** Ends the current test step and queues the next test step to run.
***REMOVED*** @private
***REMOVED***
goog.testing.AsyncTestCase.prototype.endCurrentStep_ = function() {
  if (!this.isReady_) {
    // We are a potential entry point, so we pump.
    this.isReady_ = true;
    this.stopTimeoutTimer_();
    // Run this in a setTimeout so that the caller has a chance to call
    // waitForAsync() again before we continue.
    this.timeout(goog.bind(this.pump_, this, null), 0);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Informs the testcase not to continue to the next step in the test cycle
***REMOVED*** until signal is called the specified number of times. Within a test, this
***REMOVED*** function behaves additively if called multiple times; the number of signals
***REMOVED*** to wait for will be the sum of all expected number of signals this function
***REMOVED*** was called with.
***REMOVED*** @param {number} times The number of signals to receive before
***REMOVED***    continuing testing.
***REMOVED*** @param {string=} opt_name A description of what we are waiting for.
***REMOVED***
goog.testing.AsyncTestCase.prototype.waitForSignals =
    function(times, opt_name) {
  this.expectedSignalCount_ += times;
  if (this.receivedSignalCount_ < this.expectedSignalCount_) {
    this.waitForAsync(opt_name);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Signals once to continue with the test. If this is the last signal that the
***REMOVED*** test was waiting on, call continueTesting.
***REMOVED***
goog.testing.AsyncTestCase.prototype.signal = function() {
  if (++this.receivedSignalCount_ === this.expectedSignalCount_ &&
      this.expectedSignalCount_ > 0) {
    this.endCurrentStep_();
  }
***REMOVED***


***REMOVED***
***REMOVED*** Handles an exception thrown by a test.
***REMOVED*** @param {*=} opt_e The exception object associated with the failure
***REMOVED***     or a string.
***REMOVED*** @throws Always throws a ControlBreakingException.
***REMOVED***
goog.testing.AsyncTestCase.prototype.doAsyncError = function(opt_e) {
  // If we've caught an exception that we threw, then just pass it along. This
  // can happen if doAsyncError() was called from a call to assert and then
  // again by pump_().
  if (opt_e && opt_e.isControlBreakingException) {
    throw opt_e;
  }

  // Prevent another timeout error from triggering for this test step.
  this.stopTimeoutTimer_();

  // doError() uses test.name. Here, we create a dummy test and give it a more
  // helpful name based on the step we're currently on.
  var fakeTestObj = new goog.testing.TestCase.Test(this.curStepName_,
                                                   goog.nullFunction);
  if (this.activeTest) {
    fakeTestObj.name = this.activeTest.name + ' [' + fakeTestObj.name + ']';
  }

  if (this.activeTest) {
    // Note: if the test has an error, and then tearDown has an error, they will
    // both be reported.
    this.doError(fakeTestObj, opt_e);
  } else {
    this.exceptionBeforeTest = opt_e;
  }

  // This is a potential entry point, so we pump. We also add in a bit of a
  // delay to try and prevent any async behavior from the failed test from
  // causing the next test to fail.
  this.timeout(goog.bind(this.pump_, this, this.doAsyncErrorTearDown_),
      this.timeToSleepAfterFailure);

  // We just caught an exception, so we do not want the code above us on the
  // stack to continue executing. If pump_ is in our call-stack, then it will
  // batch together multiple errors, so we only increment the count if pump_ is
  // not in the stack and let pump_ increment the count when it batches them.
  if (!this.returnWillPump_) {
    this.numControlExceptionsExpected_ += 1;
    this.dbgLog_('doAsynError: numControlExceptionsExpected_ = ' +
        this.numControlExceptionsExpected_ + ' and throwing exception.');
  }

  // Copy the error message to ControlBreakingException.
  var message = '';
  if (typeof opt_e == 'string') {
    message = opt_e;
  } else if (opt_e && opt_e.message) {
    message = opt_e.message;
  }
  throw new goog.testing.AsyncTestCase.ControlBreakingException(message);
***REMOVED***


***REMOVED***
***REMOVED*** Sets up the test page and then waits until the test case has been marked
***REMOVED*** as ready before executing the tests.
***REMOVED*** @override
***REMOVED***
goog.testing.AsyncTestCase.prototype.runTests = function() {
  this.hookAssert_();
  this.hookOnError_();

  this.setNextStep_(this.doSetUpPage_, 'setUpPage');
  // We are an entry point, so we pump.
  this.pump_();
***REMOVED***


***REMOVED***
***REMOVED*** Starts the tests.
***REMOVED*** @override
***REMOVED***
goog.testing.AsyncTestCase.prototype.cycleTests = function() {
  // We are an entry point, so we pump.
  this.saveMessage('Start');
  this.setNextStep_(this.doIteration_, 'doIteration');
  this.pump_();
***REMOVED***


***REMOVED***
***REMOVED*** Finalizes the test case, called when the tests have finished executing.
***REMOVED*** @override
***REMOVED***
goog.testing.AsyncTestCase.prototype.finalize = function() {
  this.unhookAll_();
  this.setNextStep_(null, 'finalized');
  goog.testing.AsyncTestCase.superClass_.finalize.call(this);
***REMOVED***


***REMOVED***
***REMOVED*** Enables verbose logging of what is happening inside of the AsyncTestCase.
***REMOVED***
goog.testing.AsyncTestCase.prototype.enableDebugLogging = function() {
  this.enableDebugLogs_ = true;
***REMOVED***


***REMOVED***
***REMOVED*** Logs the given debug message to the console (when enabled).
***REMOVED*** @param {string} message The message to log.
***REMOVED*** @private
***REMOVED***
goog.testing.AsyncTestCase.prototype.dbgLog_ = function(message) {
  if (this.enableDebugLogs_) {
    this.log('AsyncTestCase - ' + message);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Wraps doAsyncError() for when we are sure that the test runner has no user
***REMOVED*** code above it in the stack.
***REMOVED*** @param {string|Error=} opt_e The exception object associated with the
***REMOVED***     failure or a string.
***REMOVED*** @private
***REMOVED***
goog.testing.AsyncTestCase.prototype.doTopOfStackAsyncError_ =
    function(opt_e) {
 ***REMOVED*****REMOVED*** @preserveTry***REMOVED***
  try {
    this.doAsyncError(opt_e);
  } catch (e) {
    // We know that we are on the top of the stack, so there is no need to
    // throw this exception in this case.
    if (e.isControlBreakingException) {
      this.numControlExceptionsExpected_ -= 1;
      this.dbgLog_('doTopOfStackAsyncError_: numControlExceptionsExpected_ = ' +
          this.numControlExceptionsExpected_ + ' and catching exception.');
    } else {
      throw e;
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** Calls the tearDown function, catching any errors, and then moves on to
***REMOVED*** the next step in the testing cycle.
***REMOVED*** @private
***REMOVED***
goog.testing.AsyncTestCase.prototype.doAsyncErrorTearDown_ = function() {
  if (this.inException_) {
    // We get here if tearDown is throwing the error.
    // Upon calling continueTesting, the inline function 'doAsyncError' (set
    // below) is run.
    this.endCurrentStep_();
  } else {
    this.inException_ = true;
    this.isReady_ = true;

    // The continue point is different depending on if the error happened in
    // setUpPage() or in setUp()/test*()/tearDown().
    var stepFuncAfterError = this.nextStepFunc_;
    var stepNameAfterError = 'TestCase.execute (after error)';
    if (this.activeTest) {
      stepFuncAfterError = this.doIteration_;
      stepNameAfterError = 'doIteration (after error)';
    }

    // We must set the next step before calling tearDown.
    this.setNextStep_(function() {
      this.inException_ = false;
      // This is null when an error happens in setUpPage.
      this.setNextStep_(stepFuncAfterError, stepNameAfterError);
    }, 'doAsyncError');

    // Call the test's tearDown().
    if (!this.cleanedUp_) {
      this.cleanedUp_ = true;
      this.tearDown();
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** Replaces the asserts.js assert_() and fail() functions with a wrappers to
***REMOVED*** catch the exceptions.
***REMOVED*** @private
***REMOVED***
goog.testing.AsyncTestCase.prototype.hookAssert_ = function() {
  if (!this.origAssert_) {
    this.origAssert_ = _assert;
    this.origFail_ = fail;
  ***REMOVED***
    _assert = function() {
     ***REMOVED*****REMOVED*** @preserveTry***REMOVED***
      try {
        self.origAssert_.apply(this, arguments);
      } catch (e) {
        self.dbgLog_('Wrapping failed assert()');
        self.doAsyncError(e);
      }
   ***REMOVED*****REMOVED***
    fail = function() {
     ***REMOVED*****REMOVED*** @preserveTry***REMOVED***
      try {
        self.origFail_.apply(this, arguments);
      } catch (e) {
        self.dbgLog_('Wrapping fail()');
        self.doAsyncError(e);
      }
   ***REMOVED*****REMOVED***
  }
***REMOVED***


***REMOVED***
***REMOVED*** Sets a window.onerror handler for catching exceptions that happen in async
***REMOVED*** callbacks. Note that as of Safari 3.1, Safari does not support this.
***REMOVED*** @private
***REMOVED***
goog.testing.AsyncTestCase.prototype.hookOnError_ = function() {
  if (!this.origOnError_) {
    this.origOnError_ = window.onerror;
  ***REMOVED***
    window.onerror = function(error, url, line) {
      // Ignore exceptions that we threw on purpose.
      var cbe =
          goog.testing.AsyncTestCase.ControlBreakingException.TO_STRING;
      if (String(error).indexOf(cbe) != -1 &&
          self.numControlExceptionsExpected_) {
        self.numControlExceptionsExpected_ -= 1;
        self.dbgLog_('window.onerror: numControlExceptionsExpected_ = ' +
            self.numControlExceptionsExpected_ + ' and ignoring exception. ' +
            error);
        // Tell the browser not to compain about the error.
        return true;
      } else {
        self.dbgLog_('window.onerror caught exception.');
        var message = error + '\nURL: ' + url + '\nLine: ' + line;
        self.doTopOfStackAsyncError_(message);
        // Tell the browser to complain about the error.
        return false;
      }
   ***REMOVED*****REMOVED***
  }
***REMOVED***


***REMOVED***
***REMOVED*** Unhooks window.onerror and _assert.
***REMOVED*** @private
***REMOVED***
goog.testing.AsyncTestCase.prototype.unhookAll_ = function() {
  if (this.origOnError_) {
    window.onerror = this.origOnError_;
    this.origOnError_ = null;
    _assert = this.origAssert_;
    this.origAssert_ = null;
    fail = this.origFail_;
    this.origFail_ = null;
  }
***REMOVED***


***REMOVED***
***REMOVED*** Enables the timeout timer. This timer fires unless continueTesting is
***REMOVED*** called.
***REMOVED*** @private
***REMOVED***
goog.testing.AsyncTestCase.prototype.startTimeoutTimer_ = function() {
  if (!this.timeoutHandle_ && this.stepTimeout > 0) {
    this.timeoutHandle_ = this.timeout(goog.bind(function() {
      this.dbgLog_('Timeout timer fired with id ' + this.timeoutHandle_);
      this.timeoutHandle_ = 0;

      this.doTopOfStackAsyncError_('Timed out while waiting for ' +
          'continueTesting() to be called.');
    }, this, null), this.stepTimeout);
    this.dbgLog_('Started timeout timer with id ' + this.timeoutHandle_);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Disables the timeout timer.
***REMOVED*** @private
***REMOVED***
goog.testing.AsyncTestCase.prototype.stopTimeoutTimer_ = function() {
  if (this.timeoutHandle_) {
    this.dbgLog_('Clearing timeout timer with id ' + this.timeoutHandle_);
    this.clearTimeout(this.timeoutHandle_);
    this.timeoutHandle_ = 0;
  }
***REMOVED***


***REMOVED***
***REMOVED*** Sets the next function to call in our sequence of async callbacks.
***REMOVED*** @param {Function} func The function that executes the next step.
***REMOVED*** @param {string} name A description of the next step.
***REMOVED*** @private
***REMOVED***
goog.testing.AsyncTestCase.prototype.setNextStep_ = function(func, name) {
  this.nextStepFunc_ = func && goog.bind(func, this);
  this.nextStepName_ = name;
***REMOVED***


***REMOVED***
***REMOVED*** Calls the given function, redirecting any exceptions to doAsyncError.
***REMOVED*** @param {Function} func The function to call.
***REMOVED*** @return {!goog.testing.AsyncTestCase.TopStackFuncResult_} Returns a
***REMOVED*** TopStackFuncResult_.
***REMOVED*** @private
***REMOVED***
goog.testing.AsyncTestCase.prototype.callTopOfStackFunc_ = function(func) {
 ***REMOVED*****REMOVED*** @preserveTry***REMOVED***
  try {
    func.call(this);
    return {controlBreakingExceptionThrown: false, message: ''***REMOVED***
  } catch (e) {
    this.dbgLog_('Caught exception in callTopOfStackFunc_');
   ***REMOVED*****REMOVED*** @preserveTry***REMOVED***
    try {
      this.doAsyncError(e);
      return {controlBreakingExceptionThrown: false, message: ''***REMOVED***
    } catch (e2) {
      if (!e2.isControlBreakingException) {
        throw e2;
      }
      return {controlBreakingExceptionThrown: true, message: e2.message***REMOVED***
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** Calls the next callback when the isReady_ flag is true.
***REMOVED*** @param {Function=} opt_doFirst A function to call before pumping.
***REMOVED*** @private
***REMOVED*** @throws Throws a ControlBreakingException if there were any failing steps.
***REMOVED***
goog.testing.AsyncTestCase.prototype.pump_ = function(opt_doFirst) {
  // If this function is already above us in the call-stack, then we should
  // return rather than pumping in order to minimize call-stack depth.
  if (!this.returnWillPump_) {
    this.setBatchTime(this.now());
    this.returnWillPump_ = true;
    var topFuncResult = {***REMOVED***

    if (opt_doFirst) {
      topFuncResult = this.callTopOfStackFunc_(opt_doFirst);
    }
    // Note: we don't check for this.running here because it is not set to true
    // while executing setUpPage and tearDownPage.
    // Also, if isReady_ is false, then one of two things will happen:
    // 1. Our timeout callback will be called.
    // 2. The tests will call continueTesting(), which will call pump_() again.
    while (this.isReady_ && this.nextStepFunc_ &&
        !topFuncResult.controlBreakingExceptionThrown) {
      this.curStepFunc_ = this.nextStepFunc_;
      this.curStepName_ = this.nextStepName_;
      this.nextStepFunc_ = null;
      this.nextStepName_ = '';

      this.dbgLog_('Performing step: ' + this.curStepName_);
      topFuncResult =
          this.callTopOfStackFunc_(***REMOVED*** @type {Function}***REMOVED***(this.curStepFunc_));

      // If the max run time is exceeded call this function again async so as
      // not to block the browser.
      var delta = this.now() - this.getBatchTime();
      if (delta > goog.testing.TestCase.maxRunTime &&
          !topFuncResult.controlBreakingExceptionThrown) {
        this.saveMessage('Breaking async');
      ***REMOVED***
        this.timeout(function() { self.pump_(); }, 100);
        break;
      }
    }
    this.returnWillPump_ = false;
  } else if (opt_doFirst) {
    opt_doFirst.call(this);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Sets up the test page and then waits untill the test case has been marked
***REMOVED*** as ready before executing the tests.
***REMOVED*** @private
***REMOVED***
goog.testing.AsyncTestCase.prototype.doSetUpPage_ = function() {
  this.setNextStep_(this.execute, 'TestCase.execute');
  this.setUpPage();
***REMOVED***


***REMOVED***
***REMOVED*** Step 1: Move to the next test.
***REMOVED*** @private
***REMOVED***
goog.testing.AsyncTestCase.prototype.doIteration_ = function() {
  this.expectedSignalCount_ = 0;
  this.receivedSignalCount_ = 0;
  this.activeTest = this.next();
  if (this.activeTest && this.running) {
    this.result_.runCount++;
    // If this test should be marked as having failed, doIteration will go
    // straight to the next test.
    if (this.maybeFailTestEarly(this.activeTest)) {
      this.setNextStep_(this.doIteration_, 'doIteration');
    } else {
      this.setNextStep_(this.doSetUp_, 'setUp');
    }
  } else {
    // All tests done.
    this.finalize();
  }
***REMOVED***


***REMOVED***
***REMOVED*** Step 2: Call setUp().
***REMOVED*** @private
***REMOVED***
goog.testing.AsyncTestCase.prototype.doSetUp_ = function() {
  this.log('Running test: ' + this.activeTest.name);
  this.cleanedUp_ = false;
  this.setNextStep_(this.doExecute_, this.activeTest.name);
  this.setUp();
***REMOVED***


***REMOVED***
***REMOVED*** Step 3: Call test.execute().
***REMOVED*** @private
***REMOVED***
goog.testing.AsyncTestCase.prototype.doExecute_ = function() {
  this.setNextStep_(this.doTearDown_, 'tearDown');
  this.activeTest.execute();
***REMOVED***


***REMOVED***
***REMOVED*** Step 4: Call tearDown().
***REMOVED*** @private
***REMOVED***
goog.testing.AsyncTestCase.prototype.doTearDown_ = function() {
  this.cleanedUp_ = true;
  this.setNextStep_(this.doNext_, 'doNext');
  this.tearDown();
***REMOVED***


***REMOVED***
***REMOVED*** Step 5: Call doSuccess()
***REMOVED*** @private
***REMOVED***
goog.testing.AsyncTestCase.prototype.doNext_ = function() {
  this.setNextStep_(this.doIteration_, 'doIteration');
  this.doSuccess(***REMOVED*** @type {goog.testing.TestCase.Test}***REMOVED***(this.activeTest));
***REMOVED***
