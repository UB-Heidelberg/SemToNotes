// Copyright 2007 The Closure Library Authors. All Rights Reserved.
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
***REMOVED*** @fileoverview A class representing a set of test functions to be run.
***REMOVED***
***REMOVED*** Testing code should not have dependencies outside of goog.testing so as to
***REMOVED*** reduce the chance of masking missing dependencies.
***REMOVED***
***REMOVED*** This file does not compile correctly with --collapse_properties. Use
***REMOVED*** --property_renaming=ALL_UNQUOTED instead.
***REMOVED***
***REMOVED***

goog.provide('goog.testing.TestCase');
goog.provide('goog.testing.TestCase.Error');
goog.provide('goog.testing.TestCase.Order');
goog.provide('goog.testing.TestCase.Result');
goog.provide('goog.testing.TestCase.Test');

goog.require('goog.object');
goog.require('goog.testing.asserts');
goog.require('goog.testing.stacktrace');



***REMOVED***
***REMOVED*** A class representing a JsUnit test case.  A TestCase is made up of a number
***REMOVED*** of test functions which can be run.  Individual test cases can override the
***REMOVED*** following functions to set up their test environment:
***REMOVED***   - runTests - completely override the test's runner
***REMOVED***   - setUpPage - called before any of the test functions are run
***REMOVED***   - tearDownPage - called after all tests are finished
***REMOVED***   - setUp - called before each of the test functions
***REMOVED***   - tearDown - called after each of the test functions
***REMOVED***   - shouldRunTests - called before a test run, all tests are skipped if it
***REMOVED***                      returns false.  Can be used to disable tests on browsers
***REMOVED***                      where they aren't expected to pass.
***REMOVED***
***REMOVED*** Use {@link #autoDiscoverTests}
***REMOVED***
***REMOVED*** @param {string=} opt_name The name of the test case, defaults to
***REMOVED***     'Untitled Test Case'.
***REMOVED***
***REMOVED***
goog.testing.TestCase = function(opt_name) {
 ***REMOVED*****REMOVED***
  ***REMOVED*** A name for the test case.
  ***REMOVED*** @type {string}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.name_ = opt_name || 'Untitled Test Case';

 ***REMOVED*****REMOVED***
  ***REMOVED*** Array of test functions that can be executed.
  ***REMOVED*** @type {Array.<goog.testing.TestCase.Test>}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.tests_ = [];

 ***REMOVED*****REMOVED***
  ***REMOVED*** Set of test names and/or indices to execute, or null if all tests should
  ***REMOVED*** be executed.
  ***REMOVED***
  ***REMOVED*** Indices are included to allow automation tools to run a subset of the
  ***REMOVED*** tests without knowing the exact contents of the test file.
  ***REMOVED***
  ***REMOVED*** Indices should only be used with SORTED ordering.
  ***REMOVED***
  ***REMOVED*** Example valid values:
  ***REMOVED*** <ul>
  ***REMOVED*** <li>[testName]
  ***REMOVED*** <li>[testName1, testName2]
  ***REMOVED*** <li>[2] - will run the 3rd test in the order specified
  ***REMOVED*** <li>[1,3,5]
  ***REMOVED*** <li>[testName1, testName2, 3, 5] - will work
  ***REMOVED*** <ul>
  ***REMOVED*** @type {Object}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.testsToRun_ = null;

  var search = '';
  if (goog.global.location) {
    search = goog.global.location.search;
  }

  // Parse the 'runTests' query parameter into a set of test names and/or
  // test indices.
  var runTestsMatch = search.match(/(?:\?|&)runTests=([^?&]+)/i);
  if (runTestsMatch) {
    this.testsToRun_ = {***REMOVED***
    var arr = runTestsMatch[1].split(',');
    for (var i = 0, len = arr.length; i < len; i++) {
      this.testsToRun_[arr[i]] = 1;
    }
  }

  // Checks the URL for a valid order param.
  var orderMatch = search.match(/(?:\?|&)order=(natural|random|sorted)/i);
  if (orderMatch) {
    this.order = orderMatch[1];
  }

 ***REMOVED*****REMOVED***
  ***REMOVED*** Object used to encapsulate the test results.
  ***REMOVED*** @type {goog.testing.TestCase.Result}
  ***REMOVED*** @protected
  ***REMOVED*** @suppress {underscore}
 ***REMOVED*****REMOVED***
  this.result_ = new goog.testing.TestCase.Result(this);

  // This silences a compiler warning from the legacy property check, which
  // is deprecated. It idly writes to testRunner properties that are used
  // in this file.
  var testRunnerMethods = {isFinished: true, hasErrors: true***REMOVED***
***REMOVED***


***REMOVED***
***REMOVED*** The order to run the auto-discovered tests.
***REMOVED*** @enum {string}
***REMOVED***
goog.testing.TestCase.Order = {
 ***REMOVED*****REMOVED***
  ***REMOVED*** This is browser dependent and known to be different in FF and Safari
  ***REMOVED*** compared to others.
 ***REMOVED*****REMOVED***
  NATURAL: 'natural',

 ***REMOVED*****REMOVED*** Random order.***REMOVED***
  RANDOM: 'random',

 ***REMOVED*****REMOVED*** Sorted based on the name.***REMOVED***
  SORTED: 'sorted'
***REMOVED***


***REMOVED***
***REMOVED*** The maximum amount of time that the test can run before we force it to be
***REMOVED*** async.  This prevents the test runner from blocking the browser and
***REMOVED*** potentially hurting the Selenium test harness.
***REMOVED*** @type {number}
***REMOVED***
goog.testing.TestCase.MAX_RUN_TIME = 200;


***REMOVED***
***REMOVED*** The order to run the auto-discovered tests in.
***REMOVED*** @type {string}
***REMOVED***
goog.testing.TestCase.prototype.order = goog.testing.TestCase.Order.SORTED;


***REMOVED***
***REMOVED*** Save a reference to {@code window.setTimeout}, so any code that overrides the
***REMOVED*** default behavior (the MockClock, for example) doesn't affect our runner.
***REMOVED*** @type {function((Function|string), number,***REMOVED***=): number}
***REMOVED*** @private
***REMOVED***
goog.testing.TestCase.protectedSetTimeout_ = goog.global.setTimeout;


***REMOVED***
***REMOVED*** Save a reference to {@code window.clearTimeout}, so any code that overrides
***REMOVED*** the default behavior (e.g. MockClock) doesn't affect our runner.
***REMOVED*** @type {function((null|number|undefined)): void}
***REMOVED*** @private
***REMOVED***
goog.testing.TestCase.protectedClearTimeout_ = goog.global.clearTimeout;


***REMOVED***
***REMOVED*** Saved string referencing goog.global.setTimeout's string serialization.  IE
***REMOVED*** sometimes fails to uphold equality for setTimeout, but the string version
***REMOVED*** stays the same.
***REMOVED*** @type {string}
***REMOVED*** @private
***REMOVED***
goog.testing.TestCase.setTimeoutAsString_ = String(goog.global.setTimeout);


***REMOVED***
***REMOVED*** TODO(user) replace this with prototype.currentTest.
***REMOVED*** Name of the current test that is running, or null if none is running.
***REMOVED*** @type {?string}
***REMOVED***
goog.testing.TestCase.currentTestName = null;


***REMOVED***
***REMOVED*** Avoid a dependency on goog.userAgent and keep our own reference of whether
***REMOVED*** the browser is IE.
***REMOVED*** @type {boolean}
***REMOVED***
goog.testing.TestCase.IS_IE = typeof opera == 'undefined' &&
    !!goog.global.navigator &&
    goog.global.navigator.userAgent.indexOf('MSIE') != -1;


***REMOVED***
***REMOVED*** Exception object that was detected before a test runs.
***REMOVED*** @type {*}
***REMOVED*** @protected
***REMOVED***
goog.testing.TestCase.prototype.exceptionBeforeTest;


***REMOVED***
***REMOVED*** Whether the test case has ever tried to execute.
***REMOVED*** @type {boolean}
***REMOVED***
goog.testing.TestCase.prototype.started = false;


***REMOVED***
***REMOVED*** Whether the test case is running.
***REMOVED*** @type {boolean}
***REMOVED***
goog.testing.TestCase.prototype.running = false;


***REMOVED***
***REMOVED*** Timestamp for when the test was started.
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.testing.TestCase.prototype.startTime_ = 0;


***REMOVED***
***REMOVED*** Time since the last batch of tests was started, if batchTime exceeds
***REMOVED*** {@link #MAX_RUN_TIME} a timeout will be used to stop the tests blocking the
***REMOVED*** browser and a new batch will be started.
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.testing.TestCase.prototype.batchTime_ = 0;


***REMOVED***
***REMOVED*** Pointer to the current test.
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.testing.TestCase.prototype.currentTestPointer_ = 0;


***REMOVED***
***REMOVED*** Optional callback that will be executed when the test has finalized.
***REMOVED*** @type {Function}
***REMOVED*** @private
***REMOVED***
goog.testing.TestCase.prototype.onCompleteCallback_ = null;


***REMOVED***
***REMOVED*** The test runner that is running this case.
***REMOVED*** @type {goog.testing.TestRunner?}
***REMOVED*** @private
***REMOVED***
goog.testing.TestCase.prototype.testRunner_ = null;


***REMOVED***
***REMOVED*** Adds a new test to the test case.
***REMOVED*** @param {goog.testing.TestCase.Test} test The test to add.
***REMOVED***
goog.testing.TestCase.prototype.add = function(test) {
  this.tests_.push(test);
***REMOVED***


***REMOVED***
***REMOVED*** Sets the tests.
***REMOVED*** @param {Array.<goog.testing.TestCase.Test>} tests A new test array.
***REMOVED*** @protected
***REMOVED***
goog.testing.TestCase.prototype.setTests = function(tests) {
  this.tests_ = tests;
***REMOVED***


***REMOVED***
***REMOVED*** Gets the tests.
***REMOVED*** @return {Array.<goog.testing.TestCase.Test>} The test array.
***REMOVED*** @protected
***REMOVED***
goog.testing.TestCase.prototype.getTests = function() {
  return this.tests_;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the number of tests contained in the test case.
***REMOVED*** @return {number} The number of tests.
***REMOVED***
goog.testing.TestCase.prototype.getCount = function() {
  return this.tests_.length;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the number of tests actually run in the test case, i.e. subtracting
***REMOVED*** any which are skipped.
***REMOVED*** @return {number} The number of un-ignored tests.
***REMOVED***
goog.testing.TestCase.prototype.getActuallyRunCount = function() {
  return this.testsToRun_ ? goog.object.getCount(this.testsToRun_) : 0;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the current test and increments the pointer.
***REMOVED*** @return {goog.testing.TestCase.Test?} The current test case.
***REMOVED***
goog.testing.TestCase.prototype.next = function() {
  var test;
  while ((test = this.tests_[this.currentTestPointer_++])) {
    if (!this.testsToRun_ || this.testsToRun_[test.name] ||
        this.testsToRun_[this.currentTestPointer_ - 1]) {
      return test;
    }
  }
  return null;
***REMOVED***


***REMOVED***
***REMOVED*** Resets the test case pointer, so that next returns the first test.
***REMOVED***
goog.testing.TestCase.prototype.reset = function() {
  this.currentTestPointer_ = 0;
  this.result_ = new goog.testing.TestCase.Result(this);
***REMOVED***


***REMOVED***
***REMOVED*** Sets the callback function that should be executed when the tests have
***REMOVED*** completed.
***REMOVED*** @param {Function} fn The callback function.
***REMOVED***
goog.testing.TestCase.prototype.setCompletedCallback = function(fn) {
  this.onCompleteCallback_ = fn;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the test runner that is running this test case.
***REMOVED*** @param {goog.testing.TestRunner} tr The test runner.
***REMOVED***
goog.testing.TestCase.prototype.setTestRunner = function(tr) {
  this.testRunner_ = tr;
***REMOVED***


***REMOVED***
***REMOVED*** Can be overridden in test classes to indicate whether the tests in a case
***REMOVED*** should be run in that particular situation.  For example, this could be used
***REMOVED*** to stop tests running in a particular browser, where browser support for
***REMOVED*** the class under test was absent.
***REMOVED*** @return {boolean} Whether any of the tests in the case should be run.
***REMOVED***
goog.testing.TestCase.prototype.shouldRunTests = function() {
  return true;
***REMOVED***


***REMOVED***
***REMOVED*** Executes each of the tests.
***REMOVED***
goog.testing.TestCase.prototype.execute = function() {
  this.started = true;
  this.reset();
  this.startTime_ = this.now();
  this.running = true;
  this.result_.totalCount = this.getCount();

  if (!this.shouldRunTests()) {
    this.log('shouldRunTests() returned false, skipping these tests.');
    this.result_.testSuppressed = true;
    this.finalize();
    return;
  }

  this.log('Starting tests: ' + this.name_);
  this.cycleTests();
***REMOVED***


***REMOVED***
***REMOVED*** Finalizes the test case, called when the tests have finished executing.
***REMOVED***
goog.testing.TestCase.prototype.finalize = function() {
  this.saveMessage('Done');

  this.tearDownPage();

  var restoredSetTimeout =
      goog.testing.TestCase.protectedSetTimeout_ == goog.global.setTimeout &&
      goog.testing.TestCase.protectedClearTimeout_ == goog.global.clearTimeout;
  if (!restoredSetTimeout && goog.testing.TestCase.IS_IE &&
      String(goog.global.setTimeout) ==
          goog.testing.TestCase.setTimeoutAsString_) {
    // In strange cases, IE's value of setTimeout***REMOVED***appears* to change, but
    // the string representation stays stable.
    restoredSetTimeout = true;
  }

  if (!restoredSetTimeout) {
    var message = 'ERROR: Test did not restore setTimeout and clearTimeout';
    this.saveMessage(message);
    var err = new goog.testing.TestCase.Error(this.name_, message);
    this.result_.errors.push(err);
  }
  goog.global.clearTimeout = goog.testing.TestCase.protectedClearTimeout_;
  goog.global.setTimeout = goog.testing.TestCase.protectedSetTimeout_;
  this.endTime_ = this.now();
  this.running = false;
  this.result_.runTime = this.endTime_ - this.startTime_;
  this.result_.numFilesLoaded = this.countNumFilesLoaded_();

  this.log(this.result_.getSummary());

  if (this.result_.isSuccess()) {
    this.log('Tests complete');
  } else {
    this.log('Tests Failed');
  }
  if (this.onCompleteCallback_) {
    var fn = this.onCompleteCallback_;
    // Execute's the completed callback in the context of the global object.
    fn();
    this.onCompleteCallback_ = null;
  }
***REMOVED***


***REMOVED***
***REMOVED*** Saves a message to the result set.
***REMOVED*** @param {string} message The message to save.
***REMOVED***
goog.testing.TestCase.prototype.saveMessage = function(message) {
  this.result_.messages.push(this.getTimeStamp_() + '  ' + message);
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} Whether the test case is running inside the multi test
***REMOVED***     runner.
***REMOVED***
goog.testing.TestCase.prototype.isInsideMultiTestRunner = function() {
  var top = goog.global['top'];
  return top && typeof top['_allTests'] != 'undefined';
***REMOVED***


***REMOVED***
***REMOVED*** Logs an object to the console, if available.
***REMOVED*** @param {*} val The value to log. Will be ToString'd.
***REMOVED***
goog.testing.TestCase.prototype.log = function(val) {
  if (!this.isInsideMultiTestRunner() && goog.global.console) {
    if (typeof val == 'string') {
      val = this.getTimeStamp_() + ' : ' + val;
    }
    if (val instanceof Error && val.stack) {
      // Chrome does console.log asynchronously in a different process
      // (http://code.google.com/p/chromium/issues/detail?id=50316).
      // This is an acute problem for Errors, which almost never survive.
      // Grab references to the immutable strings so they survive.
      goog.global.console.log(val, val.message, val.stack);
      // TODO(gboyer): Consider for Chrome cloning any object if we can ensure
      // there are no circular references.
    } else {
      goog.global.console.log(val);
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} Whether the test was a success.
***REMOVED***
goog.testing.TestCase.prototype.isSuccess = function() {
  return !!this.result_ && this.result_.isSuccess();
***REMOVED***


***REMOVED***
***REMOVED*** Returns a string detailing the results from the test.
***REMOVED*** @param {boolean=} opt_verbose If true results will include data about all
***REMOVED***     tests, not just what failed.
***REMOVED*** @return {string} The results from the test.
***REMOVED***
goog.testing.TestCase.prototype.getReport = function(opt_verbose) {
  var rv = [];
  if (this.testRunner_ && !this.testRunner_.isFinished()) {
    rv.push(this.name_ + ' [RUNNING]');
  } else {
    var success = this.result_.isSuccess() && !this.testRunner_.hasErrors();
    rv.push(this.name_ + ' [' + (success ? 'PASSED' : 'FAILED') + ']');
  }
  if (goog.global.location) {
    rv.push(this.trimPath_(goog.global.location.href));
  }
  rv.push(this.result_.getSummary());
  if (opt_verbose) {
    rv.push('.', this.result_.messages.join('\n'));
  } else if (!this.result_.isSuccess()) {
    rv.push(this.result_.errors.join('\n'));
  }
  rv.push(' ');
  return rv.join('\n');
***REMOVED***


***REMOVED***
***REMOVED*** Returns the amount of time it took for the test to run.
***REMOVED*** @return {number} The run time, in milliseconds.
***REMOVED***
goog.testing.TestCase.prototype.getRunTime = function() {
  return this.result_.runTime;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the number of script files that were loaded in order to run the test.
***REMOVED*** @return {number} The number of script files.
***REMOVED***
goog.testing.TestCase.prototype.getNumFilesLoaded = function() {
  return this.result_.numFilesLoaded;
***REMOVED***


***REMOVED***
***REMOVED*** Executes each of the tests.
***REMOVED*** Overridable by the individual test case.  This allows test cases to defer
***REMOVED*** when the test is actually started.  If overridden, finalize must be called
***REMOVED*** by the test to indicate it has finished.
***REMOVED***
goog.testing.TestCase.prototype.runTests = function() {
  try {
    this.setUpPage();
  } catch (e) {
    this.exceptionBeforeTest = e;
  }
  this.execute();
***REMOVED***


***REMOVED***
***REMOVED*** Reorders the tests depending on the {@code order} field.
***REMOVED*** @param {Array.<goog.testing.TestCase.Test>} tests An array of tests to
***REMOVED***     reorder.
***REMOVED*** @private
***REMOVED***
goog.testing.TestCase.prototype.orderTests_ = function(tests) {
  switch (this.order) {
    case goog.testing.TestCase.Order.RANDOM:
      // Fisher-Yates shuffle
      var i = tests.length;
      while (i > 1) {
        // goog.math.randomInt is inlined to reduce dependencies.
        var j = Math.floor(Math.random()***REMOVED*** i); // exclusive
        i--;
        var tmp = tests[i];
        tests[i] = tests[j];
        tests[j] = tmp;
      }
      break;

    case goog.testing.TestCase.Order.SORTED:
      tests.sort(function(t1, t2) {
        if (t1.name == t2.name) {
          return 0;
        }
        return t1.name < t2.name ? -1 : 1;
      });
      break;

      // Do nothing for NATURAL.
  }
***REMOVED***


***REMOVED***
***REMOVED*** Gets the object with all globals.
***REMOVED*** @param {string=} opt_prefix An optional prefix. If specified, only get things
***REMOVED***     under this prefix. Note that the prefix is only honored in IE, since it
***REMOVED***     supports the RuntimeObject:
***REMOVED***     http://msdn.microsoft.com/en-us/library/ff521039%28VS.85%29.aspx
***REMOVED***     TODO: Fix this method to honor the prefix in all browsers.
***REMOVED*** @return {Object} An object with all globals starting with the prefix.
***REMOVED***
goog.testing.TestCase.prototype.getGlobals = function(opt_prefix) {
  return goog.testing.TestCase.getGlobals(opt_prefix);
***REMOVED***


***REMOVED***
***REMOVED*** Gets the object with all globals.
***REMOVED*** @param {string=} opt_prefix An optional prefix. If specified, only get things
***REMOVED***     under this prefix. Note that the prefix is only honored in IE, since it
***REMOVED***     supports the RuntimeObject:
***REMOVED***     http://msdn.microsoft.com/en-us/library/ff521039%28VS.85%29.aspx
***REMOVED***     TODO: Fix this method to honor the prefix in all browsers.
***REMOVED*** @return {Object} An object with all globals starting with the prefix.
***REMOVED***
goog.testing.TestCase.getGlobals = function(opt_prefix) {
  // Look in the global scope for most browsers, on IE we use the little known
  // RuntimeObject which holds references to all globals. We reference this
  // via goog.global so that there isn't an aliasing that throws an exception
  // in Firefox.
  return typeof goog.global['RuntimeObject'] != 'undefined' ?
      goog.global['RuntimeObject']((opt_prefix || '') + '*') : goog.global;
***REMOVED***


***REMOVED***
***REMOVED*** Gets called before any tests are executed.  Can be overridden to set up the
***REMOVED*** environment for the whole test case.
***REMOVED***
goog.testing.TestCase.prototype.setUpPage = function() {***REMOVED***


***REMOVED***
***REMOVED*** Gets called after all tests have been executed.  Can be overridden to tear
***REMOVED*** down the entire test case.
***REMOVED***
goog.testing.TestCase.prototype.tearDownPage = function() {***REMOVED***


***REMOVED***
***REMOVED*** Gets called before every goog.testing.TestCase.Test is been executed. Can be
***REMOVED*** overridden to add set up functionality to each test.
***REMOVED***
goog.testing.TestCase.prototype.setUp = function() {***REMOVED***


***REMOVED***
***REMOVED*** Gets called after every goog.testing.TestCase.Test has been executed. Can be
***REMOVED*** overriden to add tear down functionality to each test.
***REMOVED***
goog.testing.TestCase.prototype.tearDown = function() {***REMOVED***


***REMOVED***
***REMOVED*** @return {string} The function name prefix used to auto-discover tests.
***REMOVED*** @protected
***REMOVED***
goog.testing.TestCase.prototype.getAutoDiscoveryPrefix = function() {
  return 'test';
***REMOVED***


***REMOVED***
***REMOVED*** @return {number} Time since the last batch of tests was started.
***REMOVED*** @protected
***REMOVED***
goog.testing.TestCase.prototype.getBatchTime = function() {
  return this.batchTime_;
***REMOVED***


***REMOVED***
***REMOVED*** @param {number} batchTime Time since the last batch of tests was started.
***REMOVED*** @protected
***REMOVED***
goog.testing.TestCase.prototype.setBatchTime = function(batchTime) {
  this.batchTime_ = batchTime;
***REMOVED***


***REMOVED***
***REMOVED*** Creates a {@code goog.testing.TestCase.Test} from an auto-discovered
***REMOVED***     function.
***REMOVED*** @param {string} name The name of the function.
***REMOVED*** @param {function() : void} ref The auto-discovered function.
***REMOVED*** @return {goog.testing.TestCase.Test} The newly created test.
***REMOVED*** @protected
***REMOVED***
goog.testing.TestCase.prototype.createTestFromAutoDiscoveredFunction =
    function(name, ref) {
  return new goog.testing.TestCase.Test(name, ref, goog.global);
***REMOVED***


***REMOVED***
***REMOVED*** Adds any functions defined in the global scope that are prefixed with "test"
***REMOVED*** to the test case.  Also overrides setUp, tearDown, setUpPage, tearDownPage
***REMOVED*** and runTests if they are defined.
***REMOVED***
goog.testing.TestCase.prototype.autoDiscoverTests = function() {
  var prefix = this.getAutoDiscoveryPrefix();
  var testSource = this.getGlobals(prefix);

  var foundTests = [];

  for (var name in testSource) {

    try {
      var ref = testSource[name];
    } catch (ex) {
      // NOTE(brenneman): When running tests from a file:// URL on Firefox 3.5
      // for Windows, any reference to goog.global.sessionStorage raises
      // an "Operation is not supported" exception. Ignore any exceptions raised
      // by simply accessing global properties.
    }

    if ((new RegExp('^' + prefix)).test(name) && goog.isFunction(ref)) {
      foundTests.push(this.createTestFromAutoDiscoveredFunction(name, ref));
    }
  }

  this.orderTests_(foundTests);

  for (var i = 0; i < foundTests.length; i++) {
    this.add(foundTests[i]);
  }

  this.log(this.getCount() + ' tests auto-discovered');

  if (goog.global['setUp']) {
    this.setUp = goog.bind(goog.global['setUp'], goog.global);
  }
  if (goog.global['tearDown']) {
    this.tearDown = goog.bind(goog.global['tearDown'], goog.global);
  }
  if (goog.global['setUpPage']) {
    this.setUpPage = goog.bind(goog.global['setUpPage'], goog.global);
  }
  if (goog.global['tearDownPage']) {
    this.tearDownPage = goog.bind(goog.global['tearDownPage'], goog.global);
  }
  if (goog.global['runTests']) {
    this.runTests = goog.bind(goog.global['runTests'], goog.global);
  }
  if (goog.global['shouldRunTests']) {
    this.shouldRunTests = goog.bind(goog.global['shouldRunTests'], goog.global);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Checks to see if the test should be marked as failed before it is run.
***REMOVED***
***REMOVED*** If there was an error in setUpPage, we treat that as a failure for all tests
***REMOVED*** and mark them all as having failed.
***REMOVED***
***REMOVED*** @param {goog.testing.TestCase.Test} testCase The current test case.
***REMOVED*** @return {boolean} Whether the test was marked as failed.
***REMOVED*** @protected
***REMOVED***
goog.testing.TestCase.prototype.maybeFailTestEarly = function(testCase) {
  if (this.exceptionBeforeTest) {
    // We just use the first error to report an error on a failed test.
    testCase.name = 'setUpPage for ' + testCase.name;
    this.doError(testCase, this.exceptionBeforeTest);
    return true;
  }
  return false;
***REMOVED***


***REMOVED***
***REMOVED*** Cycles through the tests, breaking out using a setTimeout if the execution
***REMOVED*** time has execeeded {@link #MAX_RUN_TIME}.
***REMOVED***
goog.testing.TestCase.prototype.cycleTests = function() {
  this.saveMessage('Start');
  this.batchTime_ = this.now();
  var nextTest;
  while ((nextTest = this.next()) && this.running) {
    this.result_.runCount++;
    // Execute the test and handle the error, we execute all tests rather than
    // stopping after a single error.
    var cleanedUp = false;

    try {
      this.log('Running test: ' + nextTest.name);

      if (this.maybeFailTestEarly(nextTest)) {
        cleanedUp = true;
      } else {
        goog.testing.TestCase.currentTestName = nextTest.name;
        this.setUp();
        nextTest.execute();
        this.tearDown();
        goog.testing.TestCase.currentTestName = null;

        cleanedUp = true;

        this.doSuccess(nextTest);
      }
    } catch (e) {
      this.doError(nextTest, e);

      if (!cleanedUp) {
        try {
          this.tearDown();
        } catch (e2) {} // Fail silently if tearDown is throwing the errors.
      }
    }

    // If the max run time is exceeded call this function again async so as not
    // to block the browser.
    if (this.currentTestPointer_ < this.tests_.length &&
        this.now() - this.batchTime_ > goog.testing.TestCase.MAX_RUN_TIME) {
      this.saveMessage('Breaking async');
      this.timeout(goog.bind(this.cycleTests, this), 100);
      return;
    }
  }
  // Tests are done.
  this.finalize();
***REMOVED***


***REMOVED***
***REMOVED*** Counts the number of files that were loaded for dependencies that are
***REMOVED*** required to run the test.
***REMOVED*** @return {number} The number of files loaded.
***REMOVED*** @private
***REMOVED***
goog.testing.TestCase.prototype.countNumFilesLoaded_ = function() {
  var scripts = document.getElementsByTagName('script');
  var count = 0;
  for (var i = 0, n = scripts.length; i < n; i++) {
    if (scripts[i].src) {
      count++;
    }
  }
  return count;
***REMOVED***


***REMOVED***
***REMOVED*** Calls a function after a delay, using the protected timeout.
***REMOVED*** @param {Function} fn The function to call.
***REMOVED*** @param {number} time Delay in milliseconds.
***REMOVED*** @return {number} The timeout id.
***REMOVED*** @protected
***REMOVED***
goog.testing.TestCase.prototype.timeout = function(fn, time) {
  // NOTE: invoking protectedSetTimeout_ as a member of goog.testing.TestCase
  // would result in an Illegal Invocation error. The method must be executed
  // with the global context.
  var protectedSetTimeout = goog.testing.TestCase.protectedSetTimeout_;
  return protectedSetTimeout(fn, time);
***REMOVED***


***REMOVED***
***REMOVED*** Clears a timeout created by {@code this.timeout()}.
***REMOVED*** @param {number} id A timeout id.
***REMOVED*** @protected
***REMOVED***
goog.testing.TestCase.prototype.clearTimeout = function(id) {
  // NOTE: see execution note for protectedSetTimeout above.
  var protectedClearTimeout = goog.testing.TestCase.protectedClearTimeout_;
  protectedClearTimeout(id);
***REMOVED***


***REMOVED***
***REMOVED*** @return {number} The current time in milliseconds, don't use goog.now as some
***REMOVED***     tests override it.
***REMOVED*** @protected
***REMOVED***
goog.testing.TestCase.prototype.now = function() {
  return new Date().getTime();
***REMOVED***


***REMOVED***
***REMOVED*** Returns the current time.
***REMOVED*** @return {string} HH:MM:SS.
***REMOVED*** @private
***REMOVED***
goog.testing.TestCase.prototype.getTimeStamp_ = function() {
  var d = new Date;

  // Ensure millis are always 3-digits
  var millis = '00' + d.getMilliseconds();
  millis = millis.substr(millis.length - 3);

  return this.pad_(d.getHours()) + ':' + this.pad_(d.getMinutes()) + ':' +
         this.pad_(d.getSeconds()) + '.' + millis;
***REMOVED***


***REMOVED***
***REMOVED*** Pads a number to make it have a leading zero if it's less than 10.
***REMOVED*** @param {number} number The number to pad.
***REMOVED*** @return {string} The resulting string.
***REMOVED*** @private
***REMOVED***
goog.testing.TestCase.prototype.pad_ = function(number) {
  return number < 10 ? '0' + number : String(number);
***REMOVED***


***REMOVED***
***REMOVED*** Trims a path to be only that after google3.
***REMOVED*** @param {string} path The path to trim.
***REMOVED*** @return {string} The resulting string.
***REMOVED*** @private
***REMOVED***
goog.testing.TestCase.prototype.trimPath_ = function(path) {
  return path.substring(path.indexOf('google3') + 8);
***REMOVED***


***REMOVED***
***REMOVED*** Handles a test that passed.
***REMOVED*** @param {goog.testing.TestCase.Test} test The test that passed.
***REMOVED*** @protected
***REMOVED***
goog.testing.TestCase.prototype.doSuccess = function(test) {
  this.result_.successCount++;
  var message = test.name + ' : PASSED';
  this.saveMessage(message);
  this.log(message);
***REMOVED***


***REMOVED***
***REMOVED*** Handles a test that failed.
***REMOVED*** @param {goog.testing.TestCase.Test} test The test that failed.
***REMOVED*** @param {*=} opt_e The exception object associated with the
***REMOVED***     failure or a string.
***REMOVED*** @protected
***REMOVED***
goog.testing.TestCase.prototype.doError = function(test, opt_e) {
  var message = test.name + ' : FAILED';
  this.log(message);
  this.saveMessage(message);
  var err = this.logError(test.name, opt_e);
  this.result_.errors.push(err);
***REMOVED***


***REMOVED***
***REMOVED*** @param {string} name Failed test name.
***REMOVED*** @param {*=} opt_e The exception object associated with the
***REMOVED***     failure or a string.
***REMOVED*** @return {goog.testing.TestCase.Error} Error object.
***REMOVED***
goog.testing.TestCase.prototype.logError = function(name, opt_e) {
  var errMsg = null;
  var stack = null;
  if (opt_e) {
    this.log(opt_e);
    if (goog.isString(opt_e)) {
      errMsg = opt_e;
    } else {
      errMsg = opt_e.message || opt_e.description || opt_e.toString();
      stack = opt_e.stack ? goog.testing.stacktrace.canonicalize(opt_e.stack) :
          opt_e['stackTrace'];
    }
  } else {
    errMsg = 'An unknown error occurred';
  }
  var err = new goog.testing.TestCase.Error(name, errMsg, stack);

  // Avoid double logging.
  if (!opt_e || !opt_e['isJsUnitException'] ||
      !opt_e['loggedJsUnitException']) {
    this.saveMessage(err.toString());
  }
  if (opt_e && opt_e['isJsUnitException']) {
    opt_e['loggedJsUnitException'] = true;
  }

  return err;
***REMOVED***



***REMOVED***
***REMOVED*** A class representing a single test function.
***REMOVED*** @param {string} name The test name.
***REMOVED*** @param {Function} ref Reference to the test function.
***REMOVED*** @param {Object=} opt_scope Optional scope that the test function should be
***REMOVED***     called in.
***REMOVED***
***REMOVED***
goog.testing.TestCase.Test = function(name, ref, opt_scope) {
 ***REMOVED*****REMOVED***
  ***REMOVED*** The name of the test.
  ***REMOVED*** @type {string}
 ***REMOVED*****REMOVED***
  this.name = name;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Reference to the test function.
  ***REMOVED*** @type {Function}
 ***REMOVED*****REMOVED***
  this.ref = ref;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Scope that the test function should be called in.
  ***REMOVED*** @type {Object}
 ***REMOVED*****REMOVED***
  this.scope = opt_scope || null;
***REMOVED***


***REMOVED***
***REMOVED*** Executes the test function.
***REMOVED***
goog.testing.TestCase.Test.prototype.execute = function() {
  this.ref.call(this.scope);
***REMOVED***



***REMOVED***
***REMOVED*** A class for representing test results.  A bag of public properties.
***REMOVED*** @param {goog.testing.TestCase} testCase The test case that owns this result.
***REMOVED***
***REMOVED***
goog.testing.TestCase.Result = function(testCase) {

 ***REMOVED*****REMOVED***
  ***REMOVED*** The test case that owns this result.
  ***REMOVED*** @type {goog.testing.TestCase}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.testCase_ = testCase;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Total number of tests that should have been run.
  ***REMOVED*** @type {number}
 ***REMOVED*****REMOVED***
  this.totalCount = 0;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Total number of tests that were actually run.
  ***REMOVED*** @type {number}
 ***REMOVED*****REMOVED***
  this.runCount = 0;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Number of successful tests.
  ***REMOVED*** @type {number}
 ***REMOVED*****REMOVED***
  this.successCount = 0;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The amount of time the tests took to run.
  ***REMOVED*** @type {number}
 ***REMOVED*****REMOVED***
  this.runTime = 0;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The number of files loaded to run this test.
  ***REMOVED*** @type {number}
 ***REMOVED*****REMOVED***
  this.numFilesLoaded = 0;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Whether this test case was suppressed by shouldRunTests() returning false.
  ***REMOVED*** @type {boolean}
 ***REMOVED*****REMOVED***
  this.testSuppressed = false;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Errors encountered while running the test.
  ***REMOVED*** @type {Array.<goog.testing.TestCase.Error>}
 ***REMOVED*****REMOVED***
  this.errors = [];

 ***REMOVED*****REMOVED***
  ***REMOVED*** Messages to show the user after running the test.
  ***REMOVED*** @type {Array.<string>}
 ***REMOVED*****REMOVED***
  this.messages = [];
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} Whether the test was successful.
***REMOVED***
goog.testing.TestCase.Result.prototype.isSuccess = function() {
  var noErrors = this.runCount == this.successCount && this.errors.length == 0;
  if (noErrors && !this.testSuppressed && this.isStrict()) {
    return this.runCount > 0;
  }
  return noErrors;
***REMOVED***


***REMOVED***
***REMOVED*** @return {string} A summary of the tests, including total number of tests that
***REMOVED***     passed, failed, and the time taken.
***REMOVED***
goog.testing.TestCase.Result.prototype.getSummary = function() {
  var summary = this.runCount + ' of ' + this.totalCount + ' tests run in ' +
      this.runTime + 'ms.\n';
  if (this.testSuppressed) {
    summary += 'Tests not run because shouldRunTests() returned false.';
  } else if (this.runCount == 0) {
    summary += 'No tests found.  ';
    if (this.isStrict()) {
      summary +=
          'Call G_testRunner.setStrict(false) if this is expected behavior.  ';
    }
  } else {
    var failures = this.totalCount - this.successCount;
    var suppressionMessage = '';

    var countOfRunTests = this.testCase_.getActuallyRunCount();
    if (countOfRunTests) {
      failures = countOfRunTests - this.successCount;
      suppressionMessage = ', ' +
          (this.totalCount - countOfRunTests) + ' suppressed by querystring';
    }
    summary += this.successCount + ' passed, ' +
        failures + ' failed' + suppressionMessage + '.\n' +
        Math.round(this.runTime / this.runCount) + ' ms/test. ' +
        this.numFilesLoaded + ' files loaded.';
  }

  return summary;
***REMOVED***


***REMOVED***
***REMOVED*** Initializes the given test case with the global test runner 'G_testRunner'.
***REMOVED*** @param {goog.testing.TestCase} testCase The test case to install.
***REMOVED***
goog.testing.TestCase.initializeTestRunner = function(testCase) {
  testCase.autoDiscoverTests();
  var gTestRunner = goog.global['G_testRunner'];
  if (gTestRunner) {
    gTestRunner['initialize'](testCase);
  } else {
    throw Error('G_testRunner is undefined. Please ensure goog.testing.jsunit' +
        ' is included.');
  }
***REMOVED***


***REMOVED***
***REMOVED*** Determines whether the test result should report failure if no tests are run.
***REMOVED*** @return {boolean} Whether this is strict.
***REMOVED***
goog.testing.TestCase.Result.prototype.isStrict = function() {
  return this.testCase_.testRunner_.isStrict();
***REMOVED***



***REMOVED***
***REMOVED*** A class representing an error thrown by the test
***REMOVED*** @param {string} source The name of the test which threw the error.
***REMOVED*** @param {string} message The error message.
***REMOVED*** @param {string=} opt_stack A string showing the execution stack.
***REMOVED***
***REMOVED***
goog.testing.TestCase.Error = function(source, message, opt_stack) {
 ***REMOVED*****REMOVED***
  ***REMOVED*** The name of the test which threw the error.
  ***REMOVED*** @type {string}
 ***REMOVED*****REMOVED***
  this.source = source;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Reference to the test function.
  ***REMOVED*** @type {string}
 ***REMOVED*****REMOVED***
  this.message = message;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Scope that the test function should be called in.
  ***REMOVED*** @type {?string}
 ***REMOVED*****REMOVED***
  this.stack = opt_stack || null;
***REMOVED***


***REMOVED***
***REMOVED*** Returns a string representing the error object.
***REMOVED*** @return {string} A string representation of the error.
***REMOVED*** @override
***REMOVED***
goog.testing.TestCase.Error.prototype.toString = function() {
  return 'ERROR in ' + this.source + '\n' +
      this.message + (this.stack ? '\n' + this.stack : '');
***REMOVED***
