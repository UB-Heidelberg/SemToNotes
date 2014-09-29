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
***REMOVED*** @fileoverview A table for showing the results of performance testing.
***REMOVED***
***REMOVED*** {@see goog.testing.benchmark} for an easy way to use this functionality.
***REMOVED***
***REMOVED*** @author attila@google.com (Attila Bodis)
***REMOVED*** @author nicksantos@google.com (Nick Santos)
***REMOVED***

goog.provide('goog.testing.PerformanceTable');

goog.require('goog.dom');
goog.require('goog.testing.PerformanceTimer');



***REMOVED***
***REMOVED*** A UI widget that runs performance tests and displays the results.
***REMOVED*** @param {Element} root The element where the table should be attached.
***REMOVED*** @param {goog.testing.PerformanceTimer=} opt_timer A timer to use for
***REMOVED***     executing functions and profiling them.
***REMOVED*** @param {number=} opt_precision Number of digits of precision to include in
***REMOVED***     results.  Defaults to 0.
***REMOVED***
***REMOVED***
goog.testing.PerformanceTable = function(root, opt_timer, opt_precision) {
 ***REMOVED*****REMOVED***
  ***REMOVED*** Where the table should be attached.
  ***REMOVED*** @type {Element}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.root_ = root;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Number of digits of precision to include in results.
  ***REMOVED*** Defaults to 0.
  ***REMOVED*** @type {number}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.precision_ = opt_precision || 0;

  var timer = opt_timer;
  if (!timer) {
    timer = new goog.testing.PerformanceTimer();
    timer.setNumSamples(5);
    timer.setDiscardOutliers(true);
  }

 ***REMOVED*****REMOVED***
  ***REMOVED*** A timer for running the tests.
  ***REMOVED*** @type {goog.testing.PerformanceTimer}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.timer_ = timer;

  this.initRoot_();
***REMOVED***


***REMOVED***
***REMOVED*** @return {goog.testing.PerformanceTimer} The timer being used.
***REMOVED***
goog.testing.PerformanceTable.prototype.getTimer = function() {
  return this.timer_;
***REMOVED***


***REMOVED***
***REMOVED*** Render the initial table.
***REMOVED*** @private
***REMOVED***
goog.testing.PerformanceTable.prototype.initRoot_ = function() {
  this.root_.innerHTML =
      '<table class="test-results" cellspacing="1">' +
      '  <thead>' +
      '    <tr>' +
      '      <th rowspan="2">Test Description</th>' +
      '      <th rowspan="2">Runs</th>' +
      '      <th colspan="4">Results (ms)</th>' +
      '    </tr>' +
      '    <tr>' +
      '      <th>Average</th>' +
      '      <th>Std Dev</th>' +
      '      <th>Minimum</th>' +
      '      <th>Maximum</th>' +
      '    </tr>' +
      '  </thead>' +
      '  <tbody>' +
      '  </tbody>' +
      '</table>';
***REMOVED***


***REMOVED***
***REMOVED*** @return {Element} The body of the table.
***REMOVED*** @private
***REMOVED***
goog.testing.PerformanceTable.prototype.getTableBody_ = function() {
  return this.root_.getElementsByTagName(goog.dom.TagName.TBODY)[0];
***REMOVED***


***REMOVED***
***REMOVED*** Round to the specified precision.
***REMOVED*** @param {number} num The number to round.
***REMOVED*** @return {string} The rounded number, as a string.
***REMOVED*** @private
***REMOVED***
goog.testing.PerformanceTable.prototype.round_ = function(num) {
  var factor = Math.pow(10, this.precision_);
  return String(Math.round(num***REMOVED*** factor) / factor);
***REMOVED***


***REMOVED***
***REMOVED*** Run the given function with the performance timer, and show the results.
***REMOVED*** @param {Function} fn The function to run.
***REMOVED*** @param {string=} opt_desc A description to associate with this run.
***REMOVED***
goog.testing.PerformanceTable.prototype.run = function(fn, opt_desc) {
  this.runTask(
      new goog.testing.PerformanceTimer.Task(***REMOVED*** @type {function()}***REMOVED*** (fn)),
      opt_desc);
***REMOVED***


***REMOVED***
***REMOVED*** Run the given task with the performance timer, and show the results.
***REMOVED*** @param {goog.testing.PerformanceTimer.Task} task The performance timer task
***REMOVED***     to run.
***REMOVED*** @param {string=} opt_desc A description to associate with this run.
***REMOVED***
goog.testing.PerformanceTable.prototype.runTask = function(task, opt_desc) {
  var results = this.timer_.runTask(task);
  this.recordResults(results, opt_desc);
***REMOVED***


***REMOVED***
***REMOVED*** Record a performance timer results object to the performance table. See
***REMOVED*** {@code goog.testing.PerformanceTimer} for details of the format of this
***REMOVED*** object.
***REMOVED*** @param {Object} results The performance timer results object.
***REMOVED*** @param {string=} opt_desc A description to associate with these results.
***REMOVED***
goog.testing.PerformanceTable.prototype.recordResults = function(
    results, opt_desc) {
  var average = results['average'];
  var standardDeviation = results['standardDeviation'];
  var isSuspicious = average < 0 || standardDeviation > average***REMOVED*** .5;
  var resultsRow = goog.dom.createDom('tr', null,
      goog.dom.createDom('td', 'test-description',
          opt_desc || 'No description'),
      goog.dom.createDom('td', 'test-count', String(results['count'])),
      goog.dom.createDom('td', 'test-average', this.round_(average)),
      goog.dom.createDom('td', 'test-standard-deviation',
          this.round_(standardDeviation)),
      goog.dom.createDom('td', 'test-minimum', String(results['minimum'])),
      goog.dom.createDom('td', 'test-maximum', String(results['maximum'])));
  if (isSuspicious) {
    resultsRow.className = 'test-suspicious';
  }
  this.getTableBody_().appendChild(resultsRow);
***REMOVED***


***REMOVED***
***REMOVED*** Report an error in the table.
***REMOVED*** @param {*} reason The reason for the error.
***REMOVED***
goog.testing.PerformanceTable.prototype.reportError = function(reason) {
  this.getTableBody_().appendChild(
      goog.dom.createDom('tr', null,
          goog.dom.createDom('td', {'class': 'test-error', 'colSpan': 5},
              String(reason))));
***REMOVED***
