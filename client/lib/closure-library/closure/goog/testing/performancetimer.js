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
***REMOVED*** @fileoverview Performance timer.
***REMOVED***
***REMOVED*** {@see goog.testing.benchmark} for an easy way to use this functionality.
***REMOVED***
***REMOVED*** @author attila@google.com (Attila Bodis)
***REMOVED***

goog.provide('goog.testing.PerformanceTimer');
goog.provide('goog.testing.PerformanceTimer.Task');

goog.require('goog.array');
goog.require('goog.async.Deferred');
goog.require('goog.math');



***REMOVED***
***REMOVED*** Creates a performance timer that runs test functions a number of times to
***REMOVED*** generate timing samples, and provides performance statistics (minimum,
***REMOVED*** maximum, average, and standard deviation).
***REMOVED*** @param {number=} opt_numSamples Number of times to run the test function;
***REMOVED***     defaults to 10.
***REMOVED*** @param {number=} opt_timeoutInterval Number of milliseconds after which the
***REMOVED***     test is to be aborted; defaults to 5 seconds (5,000ms).
***REMOVED***
***REMOVED***
goog.testing.PerformanceTimer = function(opt_numSamples, opt_timeoutInterval) {
 ***REMOVED*****REMOVED***
  ***REMOVED*** Number of times the test function is to be run; defaults to 10.
  ***REMOVED*** @type {number}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.numSamples_ = opt_numSamples || 10;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Number of milliseconds after which the test is to be aborted; defaults to
  ***REMOVED*** 5,000ms.
  ***REMOVED*** @type {number}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.timeoutInterval_ = opt_timeoutInterval || 5000;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Whether to discard outliers (i.e. the smallest and the largest values)
  ***REMOVED*** from the sample set before computing statistics.  Defaults to false.
  ***REMOVED*** @type {boolean}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.discardOutliers_ = false;
***REMOVED***


***REMOVED***
***REMOVED*** @return {number} The number of times the test function will be run.
***REMOVED***
goog.testing.PerformanceTimer.prototype.getNumSamples = function() {
  return this.numSamples_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the number of times the test function will be run.
***REMOVED*** @param {number} numSamples Number of times to run the test function.
***REMOVED***
goog.testing.PerformanceTimer.prototype.setNumSamples = function(numSamples) {
  this.numSamples_ = numSamples;
***REMOVED***


***REMOVED***
***REMOVED*** @return {number} The number of milliseconds after which the test times out.
***REMOVED***
goog.testing.PerformanceTimer.prototype.getTimeoutInterval = function() {
  return this.timeoutInterval_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the number of milliseconds after which the test times out.
***REMOVED*** @param {number} timeoutInterval Timeout interval in ms.
***REMOVED***
goog.testing.PerformanceTimer.prototype.setTimeoutInterval = function(
    timeoutInterval) {
  this.timeoutInterval_ = timeoutInterval;
***REMOVED***


***REMOVED***
***REMOVED*** Sets whether to ignore the smallest and the largest values when computing
***REMOVED*** stats.
***REMOVED*** @param {boolean} discard Whether to discard outlier values.
***REMOVED***
goog.testing.PerformanceTimer.prototype.setDiscardOutliers = function(discard) {
  this.discardOutliers_ = discard;
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} Whether outlier values are discarded prior to computing
***REMOVED***     stats.
***REMOVED***
goog.testing.PerformanceTimer.prototype.isDiscardOutliers = function() {
  return this.discardOutliers_;
***REMOVED***


***REMOVED***
***REMOVED*** Executes the test function the required number of times (or until the
***REMOVED*** test run exceeds the timeout interval, whichever comes first).  Returns
***REMOVED*** an object containing the following:
***REMOVED*** <pre>
***REMOVED***   {
***REMOVED***     'average': average execution time (ms)
***REMOVED***     'count': number of executions (may be fewer than expected due to timeout)
***REMOVED***     'maximum': longest execution time (ms)
***REMOVED***     'minimum': shortest execution time (ms)
***REMOVED***     'standardDeviation': sample standard deviation (ms)
***REMOVED***     'total': total execution time (ms)
***REMOVED***   }
***REMOVED*** </pre>
***REMOVED***
***REMOVED*** @param {Function} testFn Test function whose performance is to
***REMOVED***     be measured.
***REMOVED*** @return {!Object} Object containing performance stats.
***REMOVED***
goog.testing.PerformanceTimer.prototype.run = function(testFn) {
  return this.runTask(new goog.testing.PerformanceTimer.Task(
     ***REMOVED*****REMOVED*** @type {goog.testing.PerformanceTimer.TestFunction}***REMOVED*** (testFn)));
***REMOVED***


***REMOVED***
***REMOVED*** Executes the test function of the specified task as described in
***REMOVED*** {@code run}. In addition, if specified, the set up and tear down functions of
***REMOVED*** the task are invoked before and after each invocation of the test function.
***REMOVED*** @see goog.testing.PerformanceTimer#run
***REMOVED*** @param {goog.testing.PerformanceTimer.Task} task A task describing the test
***REMOVED***     function to invoke.
***REMOVED*** @return {!Object} Object containing performance stats.
***REMOVED***
goog.testing.PerformanceTimer.prototype.runTask = function(task) {
  var samples = [];
  var testStart = goog.now();
  var totalRunTime = 0;

  var testFn = task.getTest();
  var setUpFn = task.getSetUp();
  var tearDownFn = task.getTearDown();

  for (var i = 0; i < this.numSamples_ && totalRunTime <= this.timeoutInterval_;
       i++) {
    setUpFn();
    var sampleStart = goog.now();
    testFn();
    var sampleEnd = goog.now();
    tearDownFn();
    samples[i] = sampleEnd - sampleStart;
    totalRunTime = sampleEnd - testStart;
  }

  return this.finishTask_(samples);
***REMOVED***


***REMOVED***
***REMOVED*** Finishes the run of a task by creating a result object from samples, in the
***REMOVED*** format described in {@code run}.
***REMOVED*** @see goog.testing.PerformanceTimer#run
***REMOVED*** @return {!Object} Object containing performance stats.
***REMOVED*** @private
***REMOVED***
goog.testing.PerformanceTimer.prototype.finishTask_ = function(samples) {
  if (this.discardOutliers_ && samples.length > 2) {
    goog.array.remove(samples, Math.min.apply(null, samples));
    goog.array.remove(samples, Math.max.apply(null, samples));
  }

  return goog.testing.PerformanceTimer.createResults(samples);
***REMOVED***


***REMOVED***
***REMOVED*** Executes the test function of the specified task asynchronously. The test
***REMOVED*** function is expected to take a callback as input and has to call it to signal
***REMOVED*** that it's done. In addition, if specified, the setUp and tearDown functions
***REMOVED*** of the task are invoked before and after each invocation of the test
***REMOVED*** function. Note that setUp/tearDown functions take a callback as input and
***REMOVED*** must call this callback when they are done.
***REMOVED*** @see goog.testing.PerformanceTimer#run
***REMOVED*** @param {goog.testing.PerformanceTimer.Task} task A task describing the test
***REMOVED***     function to invoke.
***REMOVED*** @return {!goog.async.Deferred} The deferred result, eventually an object
***REMOVED***     containing performance stats.
***REMOVED***
goog.testing.PerformanceTimer.prototype.runAsyncTask = function(task) {
  var samples = [];
  var testStart = goog.now();

  var testFn = task.getTest();
  var setUpFn = task.getSetUp();
  var tearDownFn = task.getTearDown();

  // Note that this uses a separate code path from runTask() because
  // implementing runTask() in terms of runAsyncTask() could easily cause
  // a stack overflow if there are many iterations.
  var result = new goog.async.Deferred();
  this.runAsyncTaskSample_(testFn, setUpFn, tearDownFn, result, samples,
      testStart);
  return result;
***REMOVED***


***REMOVED***
***REMOVED*** Runs a task once, waits for the test function to complete asynchronously
***REMOVED*** and starts another run if not enough samples have been collected. Otherwise
***REMOVED*** finishes this task.
***REMOVED*** @param {goog.testing.PerformanceTimer.TestFunction} testFn The test function.
***REMOVED*** @param {goog.testing.PerformanceTimer.TestFunction} setUpFn The set up
***REMOVED***     function that will be called once before the test function is run.
***REMOVED*** @param {goog.testing.PerformanceTimer.TestFunction} tearDownFn The set up
***REMOVED***     function that will be called once after the test function completed.
***REMOVED*** @param {!goog.async.Deferred} result The deferred result, eventually an
***REMOVED***     object containing performance stats.
***REMOVED*** @param {!Array.<number>} samples The time samples from all runs of the test
***REMOVED***     function so far.
***REMOVED*** @param {number} testStart The timestamp when the first sample was started.
***REMOVED*** @private
***REMOVED***
goog.testing.PerformanceTimer.prototype.runAsyncTaskSample_ = function(testFn,
    setUpFn, tearDownFn, result, samples, testStart) {
  var timer = this;
  timer.handleOptionalDeferred_(setUpFn, function() {
    var sampleStart = goog.now();
    timer.handleOptionalDeferred_(testFn, function() {
      var sampleEnd = goog.now();
      timer.handleOptionalDeferred_(tearDownFn, function() {
        samples.push(sampleEnd - sampleStart);
        var totalRunTime = sampleEnd - testStart;
        if (samples.length < timer.numSamples_ &&
            totalRunTime <= timer.timeoutInterval_) {
          timer.runAsyncTaskSample_(testFn, setUpFn, tearDownFn, result,
              samples, testStart);
        } else {
          result.callback(timer.finishTask_(samples));
        }
      });
    });
  });
***REMOVED***


***REMOVED***
***REMOVED*** Execute a function that optionally returns a deferred object and continue
***REMOVED*** with the given continuation function only once the deferred object has a
***REMOVED*** result.
***REMOVED*** @param {goog.testing.PerformanceTimer.TestFunction} deferredFactory The
***REMOVED***     function that optionally returns a deferred object.
***REMOVED*** @param {function()} continuationFunction The function that should be called
***REMOVED***     after the optional deferred has a result.
***REMOVED*** @private
***REMOVED***
goog.testing.PerformanceTimer.prototype.handleOptionalDeferred_ = function(
    deferredFactory, continuationFunction) {
  var deferred = deferredFactory();
  if (deferred) {
    deferred.addCallback(continuationFunction);
  } else {
    continuationFunction();
  }
***REMOVED***


***REMOVED***
***REMOVED*** Creates a performance timer results object by analyzing a given array of
***REMOVED*** sample timings.
***REMOVED*** @param {Array.<number>} samples The samples to analyze.
***REMOVED*** @return {!Object} Object containing performance stats.
***REMOVED***
goog.testing.PerformanceTimer.createResults = function(samples) {
  return {
    'average': goog.math.average.apply(null, samples),
    'count': samples.length,
    'maximum': Math.max.apply(null, samples),
    'minimum': Math.min.apply(null, samples),
    'standardDeviation': goog.math.standardDeviation.apply(null, samples),
    'total': goog.math.sum.apply(null, samples)
 ***REMOVED*****REMOVED***
***REMOVED***


***REMOVED***
***REMOVED*** A test function whose performance should be measured or a setUp/tearDown
***REMOVED*** function. It may optionally return a deferred object. If it does so, the
***REMOVED*** test harness will assume the function is asynchronous and it must signal
***REMOVED*** that it's done by setting an (empty) result on the deferred object. If the
***REMOVED*** function doesn't return anything, the test harness will assume it's
***REMOVED*** synchronous.
***REMOVED*** @typedef {function():(goog.async.Deferred|undefined)}
***REMOVED***
goog.testing.PerformanceTimer.TestFunction;



***REMOVED***
***REMOVED*** A task for the performance timer to measure. Callers can specify optional
***REMOVED*** setUp and tearDown methods to control state before and after each run of the
***REMOVED*** test function.
***REMOVED*** @param {goog.testing.PerformanceTimer.TestFunction} test Test function whose
***REMOVED***     performance is to be measured.
***REMOVED***
***REMOVED*** @final
***REMOVED***
goog.testing.PerformanceTimer.Task = function(test) {
 ***REMOVED*****REMOVED***
  ***REMOVED*** The test function to time.
  ***REMOVED*** @type {goog.testing.PerformanceTimer.TestFunction}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.test_ = test;
***REMOVED***


***REMOVED***
***REMOVED*** An optional set up function to run before each invocation of the test
***REMOVED*** function.
***REMOVED*** @type {goog.testing.PerformanceTimer.TestFunction}
***REMOVED*** @private
***REMOVED***
goog.testing.PerformanceTimer.Task.prototype.setUp_ = goog.nullFunction;


***REMOVED***
***REMOVED*** An optional tear down function to run after each invocation of the test
***REMOVED*** function.
***REMOVED*** @type {goog.testing.PerformanceTimer.TestFunction}
***REMOVED*** @private
***REMOVED***
goog.testing.PerformanceTimer.Task.prototype.tearDown_ = goog.nullFunction;


***REMOVED***
***REMOVED*** @return {goog.testing.PerformanceTimer.TestFunction} The test function to
***REMOVED***     time.
***REMOVED***
goog.testing.PerformanceTimer.Task.prototype.getTest = function() {
  return this.test_;
***REMOVED***


***REMOVED***
***REMOVED*** Specifies a set up function to be invoked before each invocation of the test
***REMOVED*** function.
***REMOVED*** @param {goog.testing.PerformanceTimer.TestFunction} setUp The set up
***REMOVED***     function.
***REMOVED*** @return {!goog.testing.PerformanceTimer.Task} This task.
***REMOVED***
goog.testing.PerformanceTimer.Task.prototype.withSetUp = function(setUp) {
  this.setUp_ = setUp;
  return this;
***REMOVED***


***REMOVED***
***REMOVED*** @return {goog.testing.PerformanceTimer.TestFunction} The set up function or
***REMOVED***     the default no-op function if none was specified.
***REMOVED***
goog.testing.PerformanceTimer.Task.prototype.getSetUp = function() {
  return this.setUp_;
***REMOVED***


***REMOVED***
***REMOVED*** Specifies a tear down function to be invoked after each invocation of the
***REMOVED*** test function.
***REMOVED*** @param {goog.testing.PerformanceTimer.TestFunction} tearDown The tear down
***REMOVED***     function.
***REMOVED*** @return {!goog.testing.PerformanceTimer.Task} This task.
***REMOVED***
goog.testing.PerformanceTimer.Task.prototype.withTearDown = function(tearDown) {
  this.tearDown_ = tearDown;
  return this;
***REMOVED***


***REMOVED***
***REMOVED*** @return {goog.testing.PerformanceTimer.TestFunction} The tear down function
***REMOVED***     or the default no-op function if none was specified.
***REMOVED***
goog.testing.PerformanceTimer.Task.prototype.getTearDown = function() {
  return this.tearDown_;
***REMOVED***
