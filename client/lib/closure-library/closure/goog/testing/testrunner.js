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
***REMOVED*** @fileoverview The test runner is a singleton object that is used to execute
***REMOVED*** a goog.testing.TestCases, display the results, and expose the results to
***REMOVED*** Selenium for automation.  If a TestCase hasn't been registered with the
***REMOVED*** runner by the time window.onload occurs, the testRunner will try to auto-
***REMOVED*** discover JsUnit style test pages.
***REMOVED***
***REMOVED*** The hooks for selenium are (see http://go/selenium-hook-setup):-
***REMOVED***  - Boolean G_testRunner.isFinished()
***REMOVED***  - Boolean G_testRunner.isSuccess()
***REMOVED***  - String G_testRunner.getReport()
***REMOVED***  - number G_testRunner.getRunTime()
***REMOVED***  - Object.<string, Array.<string>> G_testRunner.getTestResults()
***REMOVED***
***REMOVED*** Testing code should not have dependencies outside of goog.testing so as to
***REMOVED*** reduce the chance of masking missing dependencies.
***REMOVED***
***REMOVED***

goog.provide('goog.testing.TestRunner');

goog.require('goog.testing.TestCase');



***REMOVED***
***REMOVED*** Construct a test runner.
***REMOVED***
***REMOVED*** NOTE(user): This is currently pretty weird, I'm essentially trying to
***REMOVED*** create a wrapper that the Selenium test can hook into to query the state of
***REMOVED*** the running test case, while making goog.testing.TestCase general.
***REMOVED***
***REMOVED***
***REMOVED***
goog.testing.TestRunner = function() {
 ***REMOVED*****REMOVED***
  ***REMOVED*** Errors that occurred in the window.
  ***REMOVED*** @type {Array.<string>}
 ***REMOVED*****REMOVED***
  this.errors = [];
***REMOVED***


***REMOVED***
***REMOVED*** Reference to the active test case.
***REMOVED*** @type {goog.testing.TestCase?}
***REMOVED***
goog.testing.TestRunner.prototype.testCase = null;


***REMOVED***
***REMOVED*** Whether the test runner has been initialized yet.
***REMOVED*** @type {boolean}
***REMOVED***
goog.testing.TestRunner.prototype.initialized = false;


***REMOVED***
***REMOVED*** Element created in the document to add test results to.
***REMOVED*** @type {Element}
***REMOVED*** @private
***REMOVED***
goog.testing.TestRunner.prototype.logEl_ = null;


***REMOVED***
***REMOVED*** Function to use when filtering errors.
***REMOVED*** @type {(function(string))?}
***REMOVED*** @private
***REMOVED***
goog.testing.TestRunner.prototype.errorFilter_ = null;


***REMOVED***
***REMOVED*** Whether an empty test case counts as an error.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.testing.TestRunner.prototype.strict_ = true;


***REMOVED***
***REMOVED*** Initializes the test runner.
***REMOVED*** @param {goog.testing.TestCase} testCase The test case to initialize with.
***REMOVED***
goog.testing.TestRunner.prototype.initialize = function(testCase) {
  if (this.testCase && this.testCase.running) {
    throw Error('The test runner is already waiting for a test to complete');
  }
  this.testCase = testCase;
  this.initialized = true;
***REMOVED***


***REMOVED***
***REMOVED*** By default, the test runner is strict, and fails if it runs an empty
***REMOVED*** test case.
***REMOVED*** @param {boolean} strict Whether the test runner should fail on an empty
***REMOVED***     test case.
***REMOVED***
goog.testing.TestRunner.prototype.setStrict = function(strict) {
  this.strict_ = strict;
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} Whether the test runner should fail on an empty
***REMOVED***     test case.
***REMOVED***
goog.testing.TestRunner.prototype.isStrict = function() {
  return this.strict_;
***REMOVED***


***REMOVED***
***REMOVED*** Returns true if the test runner is initialized.
***REMOVED*** Used by Selenium Hooks.
***REMOVED*** @return {boolean} Whether the test runner is active.
***REMOVED***
goog.testing.TestRunner.prototype.isInitialized = function() {
  return this.initialized;
***REMOVED***


***REMOVED***
***REMOVED*** Returns true if the test runner is finished.
***REMOVED*** Used by Selenium Hooks.
***REMOVED*** @return {boolean} Whether the test runner is active.
***REMOVED***
goog.testing.TestRunner.prototype.isFinished = function() {
  return this.errors.length > 0 ||
      this.initialized && !!this.testCase && this.testCase.started &&
      !this.testCase.running;
***REMOVED***


***REMOVED***
***REMOVED*** Returns true if the test case didn't fail.
***REMOVED*** Used by Selenium Hooks.
***REMOVED*** @return {boolean} Whether the current test returned successfully.
***REMOVED***
goog.testing.TestRunner.prototype.isSuccess = function() {
  return !this.hasErrors() && !!this.testCase && this.testCase.isSuccess();
***REMOVED***


***REMOVED***
***REMOVED*** Returns true if the test case runner has errors that were caught outside of
***REMOVED*** the test case.
***REMOVED*** @return {boolean} Whether there were JS errors.
***REMOVED***
goog.testing.TestRunner.prototype.hasErrors = function() {
  return this.errors.length > 0;
***REMOVED***


***REMOVED***
***REMOVED*** Logs an error that occurred.  Used in the case of environment setting up
***REMOVED*** an onerror handler.
***REMOVED*** @param {string} msg Error message.
***REMOVED***
goog.testing.TestRunner.prototype.logError = function(msg) {
  if (!this.errorFilter_ || this.errorFilter_.call(null, msg)) {
    this.errors.push(msg);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Log failure in current running test.
***REMOVED*** @param {Error} ex Exception.
***REMOVED***
goog.testing.TestRunner.prototype.logTestFailure = function(ex) {
  var testName =***REMOVED*****REMOVED*** @type {string}***REMOVED*** (goog.testing.TestCase.currentTestName);
  if (this.testCase) {
    this.testCase.logError(testName, ex);
  } else {
    // NOTE: Do not forget to log the original exception raised.
    throw new Error('Test runner not initialized with a test case. Original ' +
                    'exception: ' + ex.message);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Sets a function to use as a filter for errors.
***REMOVED*** @param {function(string)} fn Filter function.
***REMOVED***
goog.testing.TestRunner.prototype.setErrorFilter = function(fn) {
  this.errorFilter_ = fn;
***REMOVED***


***REMOVED***
***REMOVED*** Returns a report of the test case that ran.
***REMOVED*** Used by Selenium Hooks.
***REMOVED*** @param {boolean=} opt_verbose If true results will include data about all
***REMOVED***     tests, not just what failed.
***REMOVED*** @return {string} A report summary of the test.
***REMOVED***
goog.testing.TestRunner.prototype.getReport = function(opt_verbose) {
  var report = [];
  if (this.testCase) {
    report.push(this.testCase.getReport(opt_verbose));
  }
  if (this.errors.length > 0) {
    report.push('JavaScript errors detected by test runner:');
    report.push.apply(report, this.errors);
    report.push('\n');
  }
  return report.join('\n');
***REMOVED***


***REMOVED***
***REMOVED*** Returns the amount of time it took for the test to run.
***REMOVED*** Used by Selenium Hooks.
***REMOVED*** @return {number} The run time, in milliseconds.
***REMOVED***
goog.testing.TestRunner.prototype.getRunTime = function() {
  return this.testCase ? this.testCase.getRunTime() : 0;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the number of script files that were loaded in order to run the test.
***REMOVED*** @return {number} The number of script files.
***REMOVED***
goog.testing.TestRunner.prototype.getNumFilesLoaded = function() {
  return this.testCase ? this.testCase.getNumFilesLoaded() : 0;
***REMOVED***


***REMOVED***
***REMOVED*** Executes a test case and prints the results to the window.
***REMOVED***
goog.testing.TestRunner.prototype.execute = function() {
  if (!this.testCase) {
    throw Error('The test runner must be initialized with a test case ' +
                'before execute can be called.');
  }

  if (this.strict_ && this.testCase.getCount() == 0) {
    throw Error(
        'No tests found in given test case: ' +
        this.testCase.getName() + ' ' +
        'By default, the test runner fails if a test case has no tests. ' +
        'To modify this behavior, see goog.testing.TestRunner\'s ' +
        'setStrict() method, or G_testRunner.setStrict()');
  }

  this.testCase.setCompletedCallback(goog.bind(this.onComplete_, this));
  this.testCase.runTests();
***REMOVED***


***REMOVED***
***REMOVED*** Writes the results to the document when the test case completes.
***REMOVED*** @private
***REMOVED***
goog.testing.TestRunner.prototype.onComplete_ = function() {
  var log = this.testCase.getReport(true);
  if (this.errors.length > 0) {
    log += '\n' + this.errors.join('\n');
  }

  if (!this.logEl_) {
    var el = document.getElementById('closureTestRunnerLog');
    if (el == null) {
      el = document.createElement('div');
      document.body.appendChild(el);
    }
    this.logEl_ = el;
  }

  // Highlight the page to indicate the overall outcome.
  this.writeLog(log);

  // TODO(user): Make this work with multiple test cases (b/8603638).
  var runAgainLink = document.createElement('a');
  runAgainLink.style.display = 'block';
  runAgainLink.style.fontSize = 'small';
  runAgainLink.href = '';
  runAgainLink.onclick = goog.bind(function() {
    this.execute();
    return false;
  }, this);
  runAgainLink.innerHTML = 'Run again without reloading';
  this.logEl_.appendChild(runAgainLink);
***REMOVED***


***REMOVED***
***REMOVED*** Writes a nicely formatted log out to the document.
***REMOVED*** @param {string} log The string to write.
***REMOVED***
goog.testing.TestRunner.prototype.writeLog = function(log) {
  var lines = log.split('\n');
  for (var i = 0; i < lines.length; i++) {
    var line = lines[i];
    var color;
    var isFailOrError = /FAILED/.test(line) || /ERROR/.test(line);
    if (/PASSED/.test(line)) {
      color = 'darkgreen';
    } else if (isFailOrError) {
      color = 'darkred';
    } else {
      color = '#333';
    }
    var div = document.createElement('div');
    if (line.substr(0, 2) == '> ') {
      // The stack trace may contain links so it has to be interpreted as HTML.
      div.innerHTML = line;
    } else {
      div.appendChild(document.createTextNode(line));
    }

    if (isFailOrError) {
      var testNameMatch = /(\S+) (\[[^\]]*] )?: (FAILED|ERROR)/.exec(line);
      if (testNameMatch) {
        // Build a URL to run the test individually.  If this test was already
        // part of another subset test, we need to overwrite the old runTests
        // query parameter.  We also need to do this without bringing in any
        // extra dependencies, otherwise we could mask missing dependency bugs.
        var newSearch = 'runTests=' + testNameMatch[1];
        var search = window.location.search;
        if (search) {
          var oldTests = /runTests=([^&]*)/.exec(search);
          if (oldTests) {
            newSearch = search.substr(0, oldTests.index) +
                        newSearch +
                        search.substr(oldTests.index + oldTests[0].length);
          } else {
            newSearch = search + '&' + newSearch;
          }
        } else {
          newSearch = '?' + newSearch;
        }
        var href = window.location.href;
        var hash = window.location.hash;
        if (hash && hash.charAt(0) != '#') {
          hash = '#' + hash;
        }
        href = href.split('#')[0].split('?')[0] + newSearch + hash;

        // Add the link.
        var a = document.createElement('A');
        a.innerHTML = '(run individually)';
        a.style.fontSize = '0.8em';
        a.href = href;
        div.appendChild(document.createTextNode(' '));
        div.appendChild(a);
      }
    }

    div.style.color = color;
    div.style.font = 'normal 100% monospace';
    if (i == 0) {
      // Highlight the first line as a header that indicates the test outcome.
      div.style.padding = '20px';
      div.style.marginBottom = '10px';
      if (isFailOrError) {
        div.style.border = '5px solid ' + color;
        div.style.backgroundColor = '#ffeeee';
      } else {
        div.style.border = '1px solid black';
        div.style.backgroundColor = '#eeffee';
      }
    }

    try {
      div.style.whiteSpace = 'pre-wrap';
    } catch (e) {
      // NOTE(brenneman): IE raises an exception when assigning to pre-wrap.
      // Thankfully, it doesn't collapse whitespace when using monospace fonts,
      // so it will display correctly if we ignore the exception.
    }

    if (i < 2) {
      div.style.fontWeight = 'bold';
    }
    this.logEl_.appendChild(div);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Logs a message to the current test case.
***REMOVED*** @param {string} s The text to output to the log.
***REMOVED***
goog.testing.TestRunner.prototype.log = function(s) {
  if (this.testCase) {
    this.testCase.log(s);
  }
***REMOVED***


// TODO(nnaze): Properly handle serving test results when multiple test cases
// are run.
***REMOVED***
***REMOVED*** @return {Object.<string, !Array.<string>>} A map of test names to a list of
***REMOVED*** test failures (if any) to provide formatted data for the test runner.
***REMOVED***
goog.testing.TestRunner.prototype.getTestResults = function() {
  if (this.testCase) {
    return this.testCase.getTestResults();
  }
  return null;
***REMOVED***
