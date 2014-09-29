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
***REMOVED*** @fileoverview Utility for running multiple test files that utilize the same
***REMOVED*** interface as goog.testing.TestRunner.  Each test is run in series and their
***REMOVED*** results aggregated.  The main usecase for the MultiTestRunner is to allow
***REMOVED*** the testing of all tests in a project locally.
***REMOVED***
***REMOVED***

goog.provide('goog.testing.MultiTestRunner');
goog.provide('goog.testing.MultiTestRunner.TestFrame');

goog.require('goog.Timer');
goog.require('goog.array');
goog.require('goog.dom');
goog.require('goog.dom.classes');
goog.require('goog.events.EventHandler');
goog.require('goog.functions');
goog.require('goog.string');
goog.require('goog.ui.Component');
goog.require('goog.ui.ServerChart');
goog.require('goog.ui.ServerChart.ChartType');
goog.require('goog.ui.TableSorter');



***REMOVED***
***REMOVED*** A component for running multiple tests within the browser.
***REMOVED*** @param {goog.dom.DomHelper=} opt_domHelper A DOM helper.
***REMOVED*** @extends {goog.ui.Component}
***REMOVED***
***REMOVED***
goog.testing.MultiTestRunner = function(opt_domHelper) {
  goog.ui.Component.call(this, opt_domHelper);

 ***REMOVED*****REMOVED***
  ***REMOVED*** Array of tests to execute, when combined with the base path this should be
  ***REMOVED*** a relative path to the test from the page containing the multi testrunner.
  ***REMOVED*** @type {Array.<string>}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.allTests_ = [];

 ***REMOVED*****REMOVED***
  ***REMOVED*** Tests that match the filter function.
  ***REMOVED*** @type {Array.<string>}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.activeTests_ = [];

 ***REMOVED*****REMOVED***
  ***REMOVED*** An event handler for handling events.
  ***REMOVED*** @type {goog.events.EventHandler}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.eh_ = new goog.events.EventHandler(this);

 ***REMOVED*****REMOVED***
  ***REMOVED*** A table sorter for the stats.
  ***REMOVED*** @type {goog.ui.TableSorter}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.tableSorter_ = new goog.ui.TableSorter(this.dom_);
***REMOVED***
goog.inherits(goog.testing.MultiTestRunner, goog.ui.Component);


***REMOVED***
***REMOVED*** Default maximimum amount of time to spend at each stage of the test.
***REMOVED*** @type {number}
***REMOVED***
goog.testing.MultiTestRunner.DEFAULT_TIMEOUT_MS = 45***REMOVED*** 1000;


***REMOVED***
***REMOVED*** Messages corresponding to the numeric states.
***REMOVED*** @type {Array.<string>}
***REMOVED***
goog.testing.MultiTestRunner.STATES = [
  'waiting for test runner',
  'initializing tests',
  'waiting for tests to finish'
];


***REMOVED***
***REMOVED*** The test suite's name.
***REMOVED*** @type {string} name
***REMOVED*** @private
***REMOVED***
goog.testing.MultiTestRunner.prototype.name_ = '';


***REMOVED***
***REMOVED*** The base path used to resolve files within the allTests_ array.
***REMOVED*** @type {string}
***REMOVED*** @private
***REMOVED***
goog.testing.MultiTestRunner.prototype.basePath_ = '';


***REMOVED***
***REMOVED*** A set of tests that have finished.  All extant keys map to true.
***REMOVED*** @type {Object.<boolean>}
***REMOVED*** @private
***REMOVED***
goog.testing.MultiTestRunner.prototype.finished_ = null;


***REMOVED***
***REMOVED*** Whether the report should contain verbose information about the passes.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.testing.MultiTestRunner.prototype.verbosePasses_ = false;


***REMOVED***
***REMOVED*** Whether to hide passing tests completely in the report, makes verbosePasses_
***REMOVED*** obsolete.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.testing.MultiTestRunner.prototype.hidePasses_ = false;


***REMOVED***
***REMOVED*** Flag used to tell the test runner to stop after the current test.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.testing.MultiTestRunner.prototype.stopped_ = false;


***REMOVED***
***REMOVED*** Flag indicating whether the test runner is active.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.testing.MultiTestRunner.prototype.active_ = false;


***REMOVED***
***REMOVED*** Index of the next test to run.
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.testing.MultiTestRunner.prototype.startedCount_ = 0;


***REMOVED***
***REMOVED*** Count of the results received so far.
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.testing.MultiTestRunner.prototype.resultCount_ = 0;


***REMOVED***
***REMOVED*** Number of passes so far.
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.testing.MultiTestRunner.prototype.passes_ = 0;


***REMOVED***
***REMOVED*** Timestamp for the current start time.
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.testing.MultiTestRunner.prototype.startTime_ = 0;


***REMOVED***
***REMOVED*** Only tests whose paths patch this filter function will be
***REMOVED*** executed.
***REMOVED*** @type {function(string): boolean}
***REMOVED*** @private
***REMOVED***
goog.testing.MultiTestRunner.prototype.filterFn_ = goog.functions.TRUE;


***REMOVED***
***REMOVED*** Number of milliseconds to wait for loading and initialization steps.
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.testing.MultiTestRunner.prototype.timeoutMs_ =
    goog.testing.MultiTestRunner.DEFAULT_TIMEOUT_MS;


***REMOVED***
***REMOVED*** An array of objects containing stats about the tests.
***REMOVED*** @type {Array.<Object>?}
***REMOVED*** @private
***REMOVED***
goog.testing.MultiTestRunner.prototype.stats_ = null;


***REMOVED***
***REMOVED*** Reference to the start button element.
***REMOVED*** @type {Element}
***REMOVED*** @private
***REMOVED***
goog.testing.MultiTestRunner.prototype.startButtonEl_ = null;


***REMOVED***
***REMOVED*** Reference to the stop button element.
***REMOVED*** @type {Element}
***REMOVED*** @private
***REMOVED***
goog.testing.MultiTestRunner.prototype.stopButtonEl_ = null;


***REMOVED***
***REMOVED*** Reference to the log element.
***REMOVED*** @type {Element}
***REMOVED*** @private
***REMOVED***
goog.testing.MultiTestRunner.prototype.logEl_ = null;


***REMOVED***
***REMOVED*** Reference to the report element.
***REMOVED*** @type {Element}
***REMOVED*** @private
***REMOVED***
goog.testing.MultiTestRunner.prototype.reportEl_ = null;


***REMOVED***
***REMOVED*** Reference to the stats element.
***REMOVED*** @type {Element}
***REMOVED*** @private
***REMOVED***
goog.testing.MultiTestRunner.prototype.statsEl_ = null;


***REMOVED***
***REMOVED*** Reference to the progress bar's element.
***REMOVED*** @type {Element}
***REMOVED*** @private
***REMOVED***
goog.testing.MultiTestRunner.prototype.progressEl_ = null;


***REMOVED***
***REMOVED*** Reference to the progress bar's inner row element.
***REMOVED*** @type {Element}
***REMOVED*** @private
***REMOVED***
goog.testing.MultiTestRunner.prototype.progressRow_ = null;


***REMOVED***
***REMOVED*** Reference to the log tab.
***REMOVED*** @type {Element}
***REMOVED*** @private
***REMOVED***
goog.testing.MultiTestRunner.prototype.logTabEl_ = null;


***REMOVED***
***REMOVED*** Reference to the report tab.
***REMOVED*** @type {Element}
***REMOVED*** @private
***REMOVED***
goog.testing.MultiTestRunner.prototype.reportTabEl_ = null;


***REMOVED***
***REMOVED*** Reference to the stats tab.
***REMOVED*** @type {Element}
***REMOVED*** @private
***REMOVED***
goog.testing.MultiTestRunner.prototype.statsTabEl_ = null;


***REMOVED***
***REMOVED*** The number of tests to run at a time.
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.testing.MultiTestRunner.prototype.poolSize_ = 1;


***REMOVED***
***REMOVED*** The size of the stats bucket for the number of files loaded histogram.
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.testing.MultiTestRunner.prototype.numFilesStatsBucketSize_ = 20;


***REMOVED***
***REMOVED*** The size of the stats bucket in ms for the run time histogram.
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.testing.MultiTestRunner.prototype.runTimeStatsBucketSize_ = 500;


***REMOVED***
***REMOVED*** Sets the name for the test suite.
***REMOVED*** @param {string} name The suite's name.
***REMOVED*** @return {goog.testing.MultiTestRunner} Instance for chaining.
***REMOVED***
goog.testing.MultiTestRunner.prototype.setName = function(name) {
  this.name_ = name;
  return this;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the name for the test suite.
***REMOVED*** @return {string} The name for the test suite.
***REMOVED***
goog.testing.MultiTestRunner.prototype.getName = function() {
  return this.name_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the basepath that tests added using addTests are resolved with.
***REMOVED*** @param {string} path The relative basepath.
***REMOVED*** @return {goog.testing.MultiTestRunner} Instance for chaining.
***REMOVED***
goog.testing.MultiTestRunner.prototype.setBasePath = function(path) {
  this.basePath_ = path;
  return this;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the basepath that tests added using addTests are resolved with.
***REMOVED*** @return {string} The basepath that tests added using addTests are resolved
***REMOVED***     with.
***REMOVED***
goog.testing.MultiTestRunner.prototype.getBasePath = function() {
  return this.basePath_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets whether the report should contain verbose information for tests that
***REMOVED*** pass.
***REMOVED*** @param {boolean} verbose Whether report should be verbose.
***REMOVED*** @return {goog.testing.MultiTestRunner} Instance for chaining.
***REMOVED***
goog.testing.MultiTestRunner.prototype.setVerbosePasses = function(verbose) {
  this.verbosePasses_ = verbose;
  return this;
***REMOVED***


***REMOVED***
***REMOVED*** Returns whether the report should contain verbose information for tests that
***REMOVED*** pass.
***REMOVED*** @return {boolean} Whether the report should contain verbose information for
***REMOVED***     tests that pass.
***REMOVED***
goog.testing.MultiTestRunner.prototype.getVerbosePasses = function() {
  return this.verbosePasses_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets whether the report should contain passing tests at all, makes
***REMOVED*** setVerbosePasses obsolete.
***REMOVED*** @param {boolean} hide Whether report should not contain passing tests.
***REMOVED*** @return {goog.testing.MultiTestRunner} Instance for chaining.
***REMOVED***
goog.testing.MultiTestRunner.prototype.setHidePasses = function(hide) {
  this.hidePasses_ = hide;
  return this;
***REMOVED***


***REMOVED***
***REMOVED*** Returns whether the report should contain passing tests at all, makes
***REMOVED*** setVerbosePasses obsolete.
***REMOVED*** @return {boolean} Whether the report should contain passing tests at all,
***REMOVED***     makes setVerbosePasses obsolete.
***REMOVED***
goog.testing.MultiTestRunner.prototype.getHidePasses = function() {
  return this.hidePasses_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the bucket sizes for the histograms.
***REMOVED*** @param {number} f Bucket size for num files loaded histogram.
***REMOVED*** @param {number} t Bucket size for run time histogram.
***REMOVED*** @return {goog.testing.MultiTestRunner} Instance for chaining.
***REMOVED***
goog.testing.MultiTestRunner.prototype.setStatsBucketSizes = function(f, t) {
  this.numFilesStatsBucketSize_ = f;
  this.runTimeStatsBucketSize_ = t;
  return this;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the number of milliseconds to wait for the page to load, initialize and
***REMOVED*** run the tests.
***REMOVED*** @param {number} timeout Time in milliseconds.
***REMOVED*** @return {goog.testing.MultiTestRunner} Instance for chaining.
***REMOVED***
goog.testing.MultiTestRunner.prototype.setTimeout = function(timeout) {
  this.timeoutMs_ = timeout;
  return this;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the number of milliseconds to wait for the page to load, initialize
***REMOVED*** and run the tests.
***REMOVED*** @return {number} The number of milliseconds to wait for the page to load,
***REMOVED***     initialize and run the tests.
***REMOVED***
goog.testing.MultiTestRunner.prototype.getTimeout = function() {
  return this.timeoutMs_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the number of tests that can be run at the same time. This only improves
***REMOVED*** performance due to the amount of time spent loading the tests.
***REMOVED*** @param {number} size The number of tests to run at a time.
***REMOVED*** @return {goog.testing.MultiTestRunner} Instance for chaining.
***REMOVED***
goog.testing.MultiTestRunner.prototype.setPoolSize = function(size) {
  this.poolSize_ = size;
  return this;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the number of tests that can be run at the same time. This only
***REMOVED*** improves performance due to the amount of time spent loading the tests.
***REMOVED*** @return {number} The number of tests that can be run at the same time. This
***REMOVED***     only improves performance due to the amount of time spent loading the
***REMOVED***     tests.
***REMOVED***
goog.testing.MultiTestRunner.prototype.getPoolSize = function() {
  return this.poolSize_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets a filter function. Only test paths that match the filter function
***REMOVED*** will be executed.
***REMOVED*** @param {function(string): boolean} filterFn Filters test paths.
***REMOVED*** @return {goog.testing.MultiTestRunner} Instance for chaining.
***REMOVED***
goog.testing.MultiTestRunner.prototype.setFilterFunction = function(filterFn) {
  this.filterFn_ = filterFn;
  return this;
***REMOVED***


***REMOVED***
***REMOVED*** Returns a filter function. Only test paths that match the filter function
***REMOVED*** will be executed.
***REMOVED*** @return {function(string): boolean} A filter function. Only test paths that
***REMOVED***     match the filter function will be executed.

***REMOVED***
goog.testing.MultiTestRunner.prototype.getFilterFunction = function() {
  return this.filterFn_;
***REMOVED***


***REMOVED***
***REMOVED*** Adds an array of tests to the tests that the test runner should execute.
***REMOVED*** @param {Array.<string>} tests Adds tests to the test runner.
***REMOVED*** @return {goog.testing.MultiTestRunner} Instance for chaining.
***REMOVED***
goog.testing.MultiTestRunner.prototype.addTests = function(tests) {
  goog.array.extend(this.allTests_, tests);
  return this;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the list of all tests added to the runner.
***REMOVED*** @return {Array.<string>} The list of all tests added to the runner.
***REMOVED***
goog.testing.MultiTestRunner.prototype.getAllTests = function() {
  return this.allTests_;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the list of tests that will be run when start() is called.
***REMOVED*** @return {Array.<string>} The list of tests that will be run when start() is
***REMOVED***     called.
***REMOVED***
goog.testing.MultiTestRunner.prototype.getTestsToRun = function() {
  return goog.array.filter(this.allTests_, this.filterFn_);
***REMOVED***


***REMOVED***
***REMOVED*** Returns a list of tests from runner that have been marked as failed.
***REMOVED*** @return {Array.<string>} A list of tests from runner that have been marked as
***REMOVED***     failed.
***REMOVED***
goog.testing.MultiTestRunner.prototype.getTestsThatFailed = function() {
  var stats = this.stats_;
  var failedTests = [];
  if (stats) {
    for (var i = 0, stat; stat = stats[i]; i++) {
      if (!stat.success) {
        failedTests.push(stat.testFile);
      }
    }
  }
  return failedTests;
***REMOVED***


***REMOVED***
***REMOVED*** Deletes and re-creates the progress table inside the progess element.
***REMOVED*** @private
***REMOVED***
goog.testing.MultiTestRunner.prototype.resetProgressDom_ = function() {
  goog.dom.removeChildren(this.progressEl_);
  var progressTable = this.dom_.createDom('table');
  var progressTBody = this.dom_.createDom('tbody');
  this.progressRow_ = this.dom_.createDom('tr');
  for (var i = 0; i < this.activeTests_.length; i++) {
    var progressCell = this.dom_.createDom('td');
    this.progressRow_.appendChild(progressCell);
  }
  progressTBody.appendChild(this.progressRow_);
  progressTable.appendChild(progressTBody);
  this.progressEl_.appendChild(progressTable);
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.testing.MultiTestRunner.prototype.createDom = function() {
  goog.testing.MultiTestRunner.superClass_.createDom.call(this);
  var el = this.getElement();
  el.className = goog.getCssName('goog-testrunner');

  this.progressEl_ = this.dom_.createDom('div');
  this.progressEl_.className = goog.getCssName('goog-testrunner-progress');
  el.appendChild(this.progressEl_);

  var buttons = this.dom_.createDom('div');
  buttons.className = goog.getCssName('goog-testrunner-buttons');
  this.startButtonEl_ = this.dom_.createDom('button', null, 'Start');
  this.stopButtonEl_ =
      this.dom_.createDom('button', {'disabled': true}, 'Stop');
  buttons.appendChild(this.startButtonEl_);
  buttons.appendChild(this.stopButtonEl_);
  el.appendChild(buttons);

  this.eh_.listen(this.startButtonEl_, 'click',
      this.onStartClicked_);
  this.eh_.listen(this.stopButtonEl_, 'click',
      this.onStopClicked_);

  this.logEl_ = this.dom_.createElement('div');
  this.logEl_.className = goog.getCssName('goog-testrunner-log');
  el.appendChild(this.logEl_);

  this.reportEl_ = this.dom_.createElement('div');
  this.reportEl_.className = goog.getCssName('goog-testrunner-report');
  this.reportEl_.style.display = 'none';
  el.appendChild(this.reportEl_);

  this.statsEl_ = this.dom_.createElement('div');
  this.statsEl_.className = goog.getCssName('goog-testrunner-stats');
  this.statsEl_.style.display = 'none';
  el.appendChild(this.statsEl_);

  this.logTabEl_ = this.dom_.createDom('div', null, 'Log');
  this.logTabEl_.className = goog.getCssName('goog-testrunner-logtab') + ' ' +
      goog.getCssName('goog-testrunner-activetab');
  el.appendChild(this.logTabEl_);

  this.reportTabEl_ = this.dom_.createDom('div', null, 'Report');
  this.reportTabEl_.className = goog.getCssName('goog-testrunner-reporttab');
  el.appendChild(this.reportTabEl_);

  this.statsTabEl_ = this.dom_.createDom('div', null, 'Stats');
  this.statsTabEl_.className = goog.getCssName('goog-testrunner-statstab');
  el.appendChild(this.statsTabEl_);

  this.eh_.listen(this.logTabEl_, 'click', this.onLogTabClicked_);
  this.eh_.listen(this.reportTabEl_, 'click', this.onReportTabClicked_);
  this.eh_.listen(this.statsTabEl_, 'click', this.onStatsTabClicked_);

***REMOVED***


***REMOVED*** @override***REMOVED***
goog.testing.MultiTestRunner.prototype.disposeInternal = function() {
  goog.testing.MultiTestRunner.superClass_.disposeInternal.call(this);
  this.tableSorter_.dispose();
  this.eh_.dispose();
  this.startButtonEl_ = null;
  this.stopButtonEl_ = null;
  this.logEl_ = null;
  this.reportEl_ = null;
  this.progressEl_ = null;
  this.logTabEl_ = null;
  this.reportTabEl_ = null;
  this.statsTabEl_ = null;
  this.statsEl_ = null;
***REMOVED***


***REMOVED***
***REMOVED*** Starts executing the tests.
***REMOVED***
goog.testing.MultiTestRunner.prototype.start = function() {
  this.startButtonEl_.disabled = true;
  this.stopButtonEl_.disabled = false;
  this.stopped_ = false;
  this.active_ = true;
  this.finished_ = {***REMOVED***
  this.activeTests_ = this.getTestsToRun();
  this.startedCount_ = 0;
  this.resultCount_ = 0;
  this.passes_ = 0;
  this.stats_ = [];
  this.startTime_ = goog.now();

  this.resetProgressDom_();
  goog.dom.removeChildren(this.logEl_);

  this.resetReport_();
  this.clearStats_();
  this.showTab_(0);

  // Ensure the pool isn't too big.
  while (this.getChildCount() > this.poolSize_) {
    this.removeChildAt(0, true).dispose();
  }

  // Start a test in each runner.
  for (var i = 0; i < this.poolSize_; i++) {
    if (i >= this.getChildCount()) {
      var testFrame = new goog.testing.MultiTestRunner.TestFrame(
          this.basePath_, this.timeoutMs_, this.verbosePasses_, this.dom_);
      this.addChild(testFrame, true);
    }
    this.runNextTest_(
       ***REMOVED*****REMOVED*** @type {goog.testing.MultiTestRunner.TestFrame}***REMOVED***
        (this.getChildAt(i)));
  }
***REMOVED***


***REMOVED***
***REMOVED*** Logs a message to the log window.
***REMOVED*** @param {string} msg A message to log.
***REMOVED***
goog.testing.MultiTestRunner.prototype.log = function(msg) {
  if (msg != '.') {
    msg = this.getTimeStamp_() + ' : ' + msg;
  }

  this.logEl_.appendChild(this.dom_.createDom('div', null, msg));

  // Autoscroll if we're near the bottom.
  var top = this.logEl_.scrollTop;
  var height = this.logEl_.scrollHeight - this.logEl_.offsetHeight;
  if (top == 0 || top > height - 50) {
    this.logEl_.scrollTop = height;
  }
***REMOVED***


***REMOVED***
***REMOVED*** Processes a result returned from a TestFrame.  If there are tests remaining
***REMOVED*** it will trigger the next one to be run, otherwise if there are no tests and
***REMOVED*** all results have been recieved then it will call finish.
***REMOVED*** @param {goog.testing.MultiTestRunner.TestFrame} frame The frame that just
***REMOVED***     finished.
***REMOVED***
goog.testing.MultiTestRunner.prototype.processResult = function(frame) {
  var success = frame.isSuccess();
  var report = frame.getReport();
  var test = frame.getTestFile();

  this.stats_.push(frame.getStats());
  this.finished_[test] = true;

  var prefix = success ? '' : '*** FAILURE***REMOVED***** ';
  this.log(prefix +
      this.trimFileName_(test) + ' : ' + (success ? 'Passed' : 'Failed'));

  this.resultCount_++;

  if (success) {
    this.passes_++;
  }

  this.drawProgressSegment_(test, success);
  this.writeCurrentSummary_();
  if (!(success && this.hidePasses_)) {
    this.drawTestResult_(test, success, report);
  }

  if (!this.stopped_ && this.startedCount_ < this.activeTests_.length) {
    this.runNextTest_(frame);
  } else if (this.resultCount_ == this.activeTests_.length) {
    this.finish_();
  }
***REMOVED***


***REMOVED***
***REMOVED*** Runs the next available test, if there are any left.
***REMOVED*** @param {goog.testing.MultiTestRunner.TestFrame} frame Where to run the test.
***REMOVED*** @private
***REMOVED***
goog.testing.MultiTestRunner.prototype.runNextTest_ = function(frame) {
  if (this.startedCount_ < this.activeTests_.length) {
    var nextTest = this.activeTests_[this.startedCount_++];
    this.log(this.trimFileName_(nextTest) + ' : Loading');
    frame.runTest(nextTest);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Handles the test finishing, processing the results and rendering the report.
***REMOVED*** @private
***REMOVED***
goog.testing.MultiTestRunner.prototype.finish_ = function() {
  if (this.stopped_) {
    this.log('Stopped');
  } else {
    this.log('Finished');
  }

  this.startButtonEl_.disabled = false;
  this.stopButtonEl_.disabled = true;
  this.active_ = false;

  this.showTab_(1);
  this.drawStats_();

  // Remove all the test frames
  while (this.getChildCount() > 0) {
    this.removeChildAt(0, true).dispose();
  }

  // Compute tests that did not finish before the stop button was hit.
  var unfinished = [];
  for (var i = 0; i < this.activeTests_.length; i++) {
    var test = this.activeTests_[i];
    if (!this.finished_[test]) {
      unfinished.push(test);
    }
  }

  if (unfinished.length) {
    this.reportEl_.appendChild(goog.dom.createDom('pre', undefined,
        'Theses tests did not finish:\n' + unfinished.join('\n')));
  }
***REMOVED***


***REMOVED***
***REMOVED*** Resets the report, clearing out all children and drawing the initial summary.
***REMOVED*** @private
***REMOVED***
goog.testing.MultiTestRunner.prototype.resetReport_ = function() {
  goog.dom.removeChildren(this.reportEl_);
  var summary = this.dom_.createDom('div');
  summary.className = goog.getCssName('goog-testrunner-progress-summary');
  this.reportEl_.appendChild(summary);
  this.writeCurrentSummary_();
***REMOVED***


***REMOVED***
***REMOVED*** Draws the stats for the test run.
***REMOVED*** @private
***REMOVED***
goog.testing.MultiTestRunner.prototype.drawStats_ = function() {
  this.drawFilesHistogram_();

  // Only show time stats if pool size is 1, otherwise times are wrong.
  if (this.poolSize_ == 1) {
    this.drawRunTimePie_();
    this.drawTimeHistogram_();
  }

  this.drawWorstTestsTable_();
***REMOVED***


***REMOVED***
***REMOVED*** Draws the histogram showing number of files loaded.
***REMOVED*** @private
***REMOVED***
goog.testing.MultiTestRunner.prototype.drawFilesHistogram_ = function() {
  this.drawStatsHistogram_(
      'numFilesLoaded',
      this.numFilesStatsBucketSize_,
      goog.functions.identity,
      500,
      'Histogram showing distribution of\nnumber of files loaded per test');
***REMOVED***


***REMOVED***
***REMOVED*** Draws the histogram showing how long each test took to complete.
***REMOVED*** @private
***REMOVED***
goog.testing.MultiTestRunner.prototype.drawTimeHistogram_ = function() {
  this.drawStatsHistogram_(
      'totalTime',
      this.runTimeStatsBucketSize_,
      function(x) { return x / 1000; },
      500,
      'Histogram showing distribution of\ntime spent running tests in s');
***REMOVED***


***REMOVED***
***REMOVED*** Draws a stats histogram.
***REMOVED*** @param {string} statsField Field of the stats object to graph.
***REMOVED*** @param {number} bucketSize The size for the histogram's buckets.
***REMOVED*** @param {function(number, ...[*]):***REMOVED***} valueTransformFn Function for
***REMOVED***     transforming the x-labels value for display.
***REMOVED*** @param {number} width The width in pixels of the graph.
***REMOVED*** @param {string} title The graph's title.
***REMOVED*** @private
***REMOVED***
goog.testing.MultiTestRunner.prototype.drawStatsHistogram_ = function(
    statsField, bucketSize, valueTransformFn, width, title) {

  var hist = {}, data = [], xlabels = [], ylabels = [];
  var max = 0;
  for (var i = 0; i < this.stats_.length; i++) {
    var num = this.stats_[i][statsField];
    var bucket = Math.floor(num / bucketSize)***REMOVED*** bucketSize;
    if (bucket > max) {
      max = bucket;
    }
    if (!hist[bucket]) {
      hist[bucket] = 1;
    } else {
      hist[bucket]++;
    }
  }
  var maxBucketSize = 0;
  for (var i = 0; i <= max; i += bucketSize) {
    xlabels.push(valueTransformFn(i));
    var count = hist[i] || 0;
    if (count > maxBucketSize) {
      maxBucketSize = count;
    }
    data.push(count);
  }
  var diff = Math.max(1, Math.ceil(maxBucketSize / 10));
  for (var i = 0; i <= maxBucketSize; i += diff) {
    ylabels.push(i);
  }
  var chart = new goog.ui.ServerChart(
      goog.ui.ServerChart.ChartType.VERTICAL_STACKED_BAR, width, 250);
  chart.setTitle(title);
  chart.addDataSet(data, 'ff9900');
  chart.setLeftLabels(ylabels);
  chart.setGridY(ylabels.length - 1);
  chart.setXLabels(xlabels);
  chart.render(this.statsEl_);
***REMOVED***


***REMOVED***
***REMOVED*** Draws a pie chart showing the percentage of time spent running the tests
***REMOVED*** compared to loading them etc.
***REMOVED*** @private
***REMOVED***
goog.testing.MultiTestRunner.prototype.drawRunTimePie_ = function() {
  var totalTime = 0, runTime = 0;
  for (var i = 0; i < this.stats_.length; i++) {
    var stat = this.stats_[i];
    totalTime += stat.totalTime;
    runTime += stat.runTime;
  }
  var loadTime = totalTime - runTime;
  var pie = new goog.ui.ServerChart(
      goog.ui.ServerChart.ChartType.PIE, 500, 250);
  pie.setMinValue(0);
  pie.setMaxValue(totalTime);
  pie.addDataSet([runTime, loadTime], 'ff9900');
  pie.setXLabels([
      'Test execution (' + runTime + 'ms)',
      'Loading (' + loadTime + 'ms)']);
  pie.render(this.statsEl_);
***REMOVED***


***REMOVED***
***REMOVED*** Draws a pie chart showing the percentage of time spent running the tests
***REMOVED*** compared to loading them etc.
***REMOVED*** @private
***REMOVED***
goog.testing.MultiTestRunner.prototype.drawWorstTestsTable_ = function() {
  this.stats_.sort(function(a, b) {
    return b['numFilesLoaded'] - a['numFilesLoaded'];
  });

  var tbody = goog.bind(this.dom_.createDom, this.dom_, 'tbody');
  var thead = goog.bind(this.dom_.createDom, this.dom_, 'thead');
  var tr = goog.bind(this.dom_.createDom, this.dom_, 'tr');
  var th = goog.bind(this.dom_.createDom, this.dom_, 'th');
  var td = goog.bind(this.dom_.createDom, this.dom_, 'td');
  var a = goog.bind(this.dom_.createDom, this.dom_, 'a');

  var head = thead({'style': 'cursor: pointer'},
      tr(null,
          th(null, ' '),
          th(null, 'Test file'),
          th('center', 'Num files loaded'),
          th('center', 'Run time (ms)'),
          th('center', 'Total time (ms)')));
  var body = tbody();
  var table = this.dom_.createDom('table', null, head, body);

  for (var i = 0; i < this.stats_.length; i++) {
    var stat = this.stats_[i];
    body.appendChild(tr(null,
        td('center', String(i + 1)),
        td(null, a(
            {'href': this.basePath_ + stat['testFile'], 'target': '_blank'},
            stat['testFile'])),
        td('center', String(stat['numFilesLoaded'])),
        td('center', String(stat['runTime'])),
        td('center', String(stat['totalTime']))));
  }

  this.statsEl_.appendChild(table);

  this.tableSorter_.setDefaultSortFunction(goog.ui.TableSorter.numericSort);
  this.tableSorter_.setSortFunction(
      1 /* test file name***REMOVED***, goog.ui.TableSorter.alphaSort);
  this.tableSorter_.decorate(table);
***REMOVED***


***REMOVED***
***REMOVED*** Clears the stats page.
***REMOVED*** @private
***REMOVED***
goog.testing.MultiTestRunner.prototype.clearStats_ = function() {
  goog.dom.removeChildren(this.statsEl_);
***REMOVED***


***REMOVED***
***REMOVED*** Updates the report's summary.
***REMOVED*** @private
***REMOVED***
goog.testing.MultiTestRunner.prototype.writeCurrentSummary_ = function() {
  var total = this.activeTests_.length;
  var executed = this.resultCount_;
  var passes = this.passes_;
  var duration = Math.round((goog.now() - this.startTime_) / 1000);
  var text = executed + ' of ' + total + ' tests executed.<br>' +
      passes + ' passed, ' + (executed - passes) + ' failed.<br>' +
      'Duration: ' + duration + 's.';
  this.reportEl_.firstChild.innerHTML = text;
***REMOVED***


***REMOVED***
***REMOVED*** Adds a segment to the progress bar.
***REMOVED*** @param {string} title Title for the segment.
***REMOVED*** @param {*} success Whether the segment should indicate a success.
***REMOVED*** @private
***REMOVED***
goog.testing.MultiTestRunner.prototype.drawProgressSegment_ =
      function(title, success) {
  var part = this.progressRow_.cells[this.resultCount_ - 1];
  part.title = title + ' : ' + (success ? 'SUCCESS' : 'FAILURE');
  part.style.backgroundColor = success ? '#090' : '#900';
***REMOVED***


***REMOVED***
***REMOVED*** Draws a test result in the report pane.
***REMOVED*** @param {string} test Test name.
***REMOVED*** @param {*} success Whether the test succeeded.
***REMOVED*** @param {string} report The report.
***REMOVED*** @private
***REMOVED***
goog.testing.MultiTestRunner.prototype.drawTestResult_ = function(
    test, success, report) {
  var text = goog.string.isEmpty(report) ?
      'No report for ' + test + '\n' : report;
  var el = this.dom_.createDom('div');
  text = goog.string.htmlEscape(text).replace(/\n/g, '<br>');
  if (success) {
    el.className = goog.getCssName('goog-testrunner-report-success');
  } else {
    text += '<a href="' + this.basePath_ + test +
        '">Run individually &raquo;</a><br>&nbsp;';
    el.className = goog.getCssName('goog-testrunner-report-failure');
  }
  el.innerHTML = text;
  this.reportEl_.appendChild(el);
***REMOVED***


***REMOVED***
***REMOVED*** Returns the current timestamp.
***REMOVED*** @return {string} HH:MM:SS.
***REMOVED*** @private
***REMOVED***
goog.testing.MultiTestRunner.prototype.getTimeStamp_ = function() {
  var d = new Date;
  return goog.string.padNumber(d.getHours(), 2) + ':' +
      goog.string.padNumber(d.getMinutes(), 2) + ':' +
      goog.string.padNumber(d.getSeconds(), 2);
***REMOVED***


***REMOVED***
***REMOVED*** Trims a filename to be less than 35-characters, ensuring that we do not break
***REMOVED*** a path part.
***REMOVED*** @param {string} name The file name.
***REMOVED*** @return {string} The shortened name.
***REMOVED*** @private
***REMOVED***
goog.testing.MultiTestRunner.prototype.trimFileName_ = function(name) {
  if (name.length < 35) {
    return name;
  }
  var parts = name.split('/');
  var result = '';
  while (result.length < 35 && parts.length > 0) {
    result = '/' + parts.pop() + result;
  }
  return '...' + result;
***REMOVED***


***REMOVED***
***REMOVED*** Shows the report and hides the log if the argument is true.
***REMOVED*** @param {number} tab Which tab to show.
***REMOVED*** @private
***REMOVED***
goog.testing.MultiTestRunner.prototype.showTab_ = function(tab) {
  var activeTabCssClass = goog.getCssName('goog-testrunner-activetab');
  if (tab == 0) {
    this.logEl_.style.display = '';
    goog.dom.classes.add(this.logTabEl_, activeTabCssClass);
  } else {
    this.logEl_.style.display = 'none';
    goog.dom.classes.remove(this.logTabEl_, activeTabCssClass);
  }

  if (tab == 1) {
    this.reportEl_.style.display = '';
    goog.dom.classes.add(this.reportTabEl_, activeTabCssClass);
  } else {
    this.reportEl_.style.display = 'none';
    goog.dom.classes.remove(this.reportTabEl_, activeTabCssClass);
  }

  if (tab == 2) {
    this.statsEl_.style.display = '';
    goog.dom.classes.add(this.statsTabEl_, activeTabCssClass);
  } else {
    this.statsEl_.style.display = 'none';
    goog.dom.classes.remove(this.statsTabEl_, activeTabCssClass);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Handles the start button being clicked.
***REMOVED*** @param {goog.events.BrowserEvent} e The click event.
***REMOVED*** @private
***REMOVED***
goog.testing.MultiTestRunner.prototype.onStartClicked_ = function(e) {
  this.start();
***REMOVED***


***REMOVED***
***REMOVED*** Handles the stop button being clicked.
***REMOVED*** @param {goog.events.BrowserEvent} e The click event.
***REMOVED*** @private
***REMOVED***
goog.testing.MultiTestRunner.prototype.onStopClicked_ = function(e) {
  this.stopped_ = true;
  this.finish_();
***REMOVED***


***REMOVED***
***REMOVED*** Handles the log tab being clicked.
***REMOVED*** @param {goog.events.BrowserEvent} e The click event.
***REMOVED*** @private
***REMOVED***
goog.testing.MultiTestRunner.prototype.onLogTabClicked_ = function(e) {
  this.showTab_(0);
***REMOVED***


***REMOVED***
***REMOVED*** Handles the log tab being clicked.
***REMOVED*** @param {goog.events.BrowserEvent} e The click event.
***REMOVED*** @private
***REMOVED***
goog.testing.MultiTestRunner.prototype.onReportTabClicked_ = function(e) {
  this.showTab_(1);
***REMOVED***


***REMOVED***
***REMOVED*** Handles the stats tab being clicked.
***REMOVED*** @param {goog.events.BrowserEvent} e The click event.
***REMOVED*** @private
***REMOVED***
goog.testing.MultiTestRunner.prototype.onStatsTabClicked_ = function(e) {
  this.showTab_(2);
***REMOVED***



***REMOVED***
***REMOVED*** Class used to manage the interaction with a single iframe.
***REMOVED*** @param {string} basePath The base path for tests.
***REMOVED*** @param {number} timeoutMs The time to wait for the test to load and run.
***REMOVED*** @param {boolean} verbosePasses Whether to show results for passes.
***REMOVED*** @param {goog.dom.DomHelper=} opt_domHelper Optional dom helper.
***REMOVED***
***REMOVED*** @extends {goog.ui.Component}
***REMOVED***
goog.testing.MultiTestRunner.TestFrame = function(
    basePath, timeoutMs, verbosePasses, opt_domHelper) {
  goog.ui.Component.call(this, opt_domHelper);

 ***REMOVED*****REMOVED***
  ***REMOVED*** Base path where tests should be resolved from.
  ***REMOVED*** @type {string}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.basePath_ = basePath;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The timeout for the test.
  ***REMOVED*** @type {number}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.timeoutMs_ = timeoutMs;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Whether to show a summary for passing tests.
  ***REMOVED*** @type {boolean}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.verbosePasses_ = verbosePasses;

 ***REMOVED*****REMOVED***
  ***REMOVED*** An event handler for handling events.
  ***REMOVED*** @type {goog.events.EventHandler}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.eh_ = new goog.events.EventHandler(this);

***REMOVED***
goog.inherits(goog.testing.MultiTestRunner.TestFrame, goog.ui.Component);


***REMOVED***
***REMOVED*** Reference to the iframe.
***REMOVED*** @type {HTMLIFrameElement}
***REMOVED*** @private
***REMOVED***
goog.testing.MultiTestRunner.TestFrame.prototype.iframeEl_ = null;


***REMOVED***
***REMOVED*** Whether the iframe for the current test has loaded.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.testing.MultiTestRunner.TestFrame.prototype.iframeLoaded_ = false;


***REMOVED***
***REMOVED*** The test file being run.
***REMOVED*** @type {string}
***REMOVED*** @private
***REMOVED***
goog.testing.MultiTestRunner.TestFrame.prototype.testFile_ = '';


***REMOVED***
***REMOVED*** The report returned from the test.
***REMOVED*** @type {string}
***REMOVED*** @private
***REMOVED***
goog.testing.MultiTestRunner.TestFrame.prototype.report_ = '';


***REMOVED***
***REMOVED*** The total time loading and running the test in milliseconds.
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.testing.MultiTestRunner.TestFrame.prototype.totalTime_ = 0;


***REMOVED***
***REMOVED*** The actual runtime of the test in milliseconds.
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.testing.MultiTestRunner.TestFrame.prototype.runTime_ = 0;


***REMOVED***
***REMOVED*** The number of files loaded by the test.
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.testing.MultiTestRunner.TestFrame.prototype.numFilesLoaded_ = 0;


***REMOVED***
***REMOVED*** Whether the test was successful, null if no result has been returned yet.
***REMOVED*** @type {?boolean}
***REMOVED*** @private
***REMOVED***
goog.testing.MultiTestRunner.TestFrame.prototype.isSuccess_ = null;


***REMOVED***
***REMOVED*** Timestamp for the when the test was started.
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.testing.MultiTestRunner.TestFrame.prototype.startTime_ = 0;


***REMOVED***
***REMOVED*** Timestamp for the last state, used to determine timeouts.
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.testing.MultiTestRunner.TestFrame.prototype.lastStateTime_ = 0;


***REMOVED***
***REMOVED*** The state of the active test.
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.testing.MultiTestRunner.TestFrame.prototype.currentState_ = 0;


***REMOVED*** @override***REMOVED***
goog.testing.MultiTestRunner.TestFrame.prototype.disposeInternal = function() {
  goog.testing.MultiTestRunner.TestFrame.superClass_.disposeInternal.call(this);
  this.dom_.removeNode(this.iframeEl_);
  this.eh_.dispose();
  this.iframeEl_ = null;
***REMOVED***


***REMOVED***
***REMOVED*** Runs a test file in this test frame.
***REMOVED*** @param {string} testFile The test to run.
***REMOVED***
goog.testing.MultiTestRunner.TestFrame.prototype.runTest = function(testFile) {
  this.lastStateTime_ = this.startTime_ = goog.now();

  if (!this.iframeEl_) {
    this.createIframe_();
  }

  this.iframeLoaded_ = false;
  this.currentState_ = 0;
  this.isSuccess_ = null;
  this.report_ = '';
  this.testFile_ = testFile;

  try {
    this.iframeEl_.src = this.basePath_ + testFile;
  } catch (e) {
    // Failures will trigger a JS exception on the local file system.
    this.report_ = this.testFile_ + ' failed to load : ' + e.message;
    this.isSuccess_ = false;
    this.finish_();
    return;
  }

  this.checkForCompletion_();
***REMOVED***


***REMOVED***
***REMOVED*** @return {string} The test file the TestFrame is running.
***REMOVED***
goog.testing.MultiTestRunner.TestFrame.prototype.getTestFile = function() {
  return this.testFile_;
***REMOVED***


***REMOVED***
***REMOVED*** @return {Object} Stats about the test run.
***REMOVED***
goog.testing.MultiTestRunner.TestFrame.prototype.getStats = function() {
  return {
    'testFile': this.testFile_,
    'success': this.isSuccess_,
    'runTime': this.runTime_,
    'totalTime': this.totalTime_,
    'numFilesLoaded': this.numFilesLoaded_
 ***REMOVED*****REMOVED***
***REMOVED***


***REMOVED***
***REMOVED*** @return {string} The report for the test run.
***REMOVED***
goog.testing.MultiTestRunner.TestFrame.prototype.getReport = function() {
  return this.report_;
***REMOVED***


***REMOVED***
***REMOVED*** @return {?boolean} Whether the test frame had a success.
***REMOVED***
goog.testing.MultiTestRunner.TestFrame.prototype.isSuccess = function() {
  return this.isSuccess_;
***REMOVED***


***REMOVED***
***REMOVED*** Handles the TestFrame finishing a single test.
***REMOVED*** @private
***REMOVED***
goog.testing.MultiTestRunner.TestFrame.prototype.finish_ = function() {
  this.totalTime_ = goog.now() - this.startTime_;
  // TODO(user): Fire an event instead?
  if (this.getParent() && this.getParent().processResult) {
    this.getParent().processResult(this);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Creates an iframe to run the tests in.  For overriding in unit tests.
***REMOVED*** @private
***REMOVED***
goog.testing.MultiTestRunner.TestFrame.prototype.createIframe_ = function() {
  this.iframeEl_ =
     ***REMOVED*****REMOVED*** @type {HTMLIFrameElement}***REMOVED*** (this.dom_.createDom('iframe'));
  this.getElement().appendChild(this.iframeEl_);
  this.eh_.listen(this.iframeEl_, 'load', this.onIframeLoaded_);
***REMOVED***


***REMOVED***
***REMOVED*** Handles the iframe loading.
***REMOVED*** @param {goog.events.BrowserEvent} e The load event.
***REMOVED*** @private
***REMOVED***
goog.testing.MultiTestRunner.TestFrame.prototype.onIframeLoaded_ = function(e) {
  this.iframeLoaded_ = true;
***REMOVED***


***REMOVED***
***REMOVED*** Checks the active test for completion, keeping track of the tests' various
***REMOVED*** execution stages.
***REMOVED*** @private
***REMOVED***
goog.testing.MultiTestRunner.TestFrame.prototype.checkForCompletion_ =
    function() {
  var js = goog.dom.getFrameContentWindow(this.iframeEl_);
  switch (this.currentState_) {
    case 0:
      if (this.iframeLoaded_ && js['G_testRunner']) {
        this.lastStateTime_ = goog.now();
        this.currentState_++;
      }
      break;
    case 1:
      if (js['G_testRunner']['isInitialized']()) {
        this.lastStateTime_ = goog.now();
        this.currentState_++;
      }
      break;
    case 2:
      if (js['G_testRunner']['isFinished']()) {
        var tr = js['G_testRunner'];
        this.isSuccess_ = tr['isSuccess']();
        this.report_ = tr['getReport'](this.verbosePasses_);
        this.runTime_ = tr['getRunTime']();
        this.numFilesLoaded_ = tr['getNumFilesLoaded']();
        this.finish_();
        return;
      }
  }

  // Check to see if the test has timed out.
  if (goog.now() - this.lastStateTime_ > this.timeoutMs_) {
    this.report_ = this.testFile_ + ' timed out  ' +
        goog.testing.MultiTestRunner.STATES[this.currentState_];
    this.isSuccess_ = false;
    this.finish_();
    return;
  }

  // Check again in 100ms.
  goog.Timer.callOnce(this.checkForCompletion_, 100, this);
***REMOVED***
