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
***REMOVED*** @fileoverview Utility for sharding tests.
***REMOVED***
***REMOVED*** Usage instructions:
***REMOVED*** <ol>
***REMOVED***   <li>Instead of writing your large test in foo_test.html, write it in
***REMOVED*** foo_test_template.html</li>
***REMOVED***   <li>Add a call to {@code goog.testing.ShardingTestCase.shardByFileName()}
***REMOVED*** near the top of your test, before any test cases or setup methods.</li>
***REMOVED***   <li>Symlink foo_test_template.html into different sharded test files
***REMOVED*** named foo_1of4_test.html, foo_2of4_test.html, etc, using `ln -s`.</li>
***REMOVED***   <li>Add the symlinks as foo_1of4_test.html.
***REMOVED***       In perforce, run the command `g4 add foo_1of4_test.html` followed
***REMOVED*** by `g4 reopen -t symlink foo_1of4_test.html` so that perforce treats the file
***REMOVED*** as a symlink
***REMOVED***   </li>
***REMOVED*** </ol>
***REMOVED***
***REMOVED***

goog.provide('goog.testing.ShardingTestCase');

goog.require('goog.asserts');
goog.require('goog.testing.TestCase');



***REMOVED***
***REMOVED*** A test case that runs tests in per-file shards.
***REMOVED*** @param {number} shardIndex Shard index for this page,
***REMOVED***     <strong>1-indexed</strong>.
***REMOVED*** @param {number} numShards Number of shards to split up test cases into.
***REMOVED*** @extends {goog.testing.TestCase}
***REMOVED***
***REMOVED*** @final
***REMOVED***
goog.testing.ShardingTestCase = function(shardIndex, numShards, opt_name) {
  goog.testing.ShardingTestCase.base(this, 'constructor', opt_name);

  goog.asserts.assert(shardIndex > 0, 'Shard index should be positive');
  goog.asserts.assert(numShards > 0, 'Number of shards should be positive');
  goog.asserts.assert(shardIndex <= numShards,
      'Shard index out of bounds');

 ***REMOVED*****REMOVED***
  ***REMOVED*** @type {number}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.shardIndex_ = shardIndex;

 ***REMOVED*****REMOVED***
  ***REMOVED*** @type {number}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.numShards_ = numShards;
***REMOVED***
goog.inherits(goog.testing.ShardingTestCase, goog.testing.TestCase);


***REMOVED***
***REMOVED*** Whether we've actually partitioned the tests yet. We may execute twice
***REMOVED*** ('Run again without reloading') without failing.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.testing.ShardingTestCase.prototype.sharded_ = false;


***REMOVED***
***REMOVED*** Installs a runTests global function that goog.testing.JsUnit will use to
***REMOVED*** run tests, which will run a single shard of the tests present on the page.
***REMOVED*** @override
***REMOVED***
goog.testing.ShardingTestCase.prototype.runTests = function() {
  if (!this.sharded_) {
    var numTests = this.getCount();
    goog.asserts.assert(numTests >= this.numShards_,
        'Must have at least as many tests as shards!');
    var shardSize = Math.ceil(numTests / this.numShards_);
    var startIndex = (this.shardIndex_ - 1)***REMOVED*** shardSize;
    var endIndex = startIndex + shardSize;
    goog.asserts.assert(this.order == goog.testing.TestCase.Order.SORTED,
        'Only SORTED order is allowed for sharded tests');
    this.setTests(this.getTests().slice(startIndex, endIndex));
    this.sharded_ = true;
  }

  // Call original runTests method to execute the tests.
  goog.testing.ShardingTestCase.base(this, 'runTests');
***REMOVED***


***REMOVED***
***REMOVED*** Shards tests based on the test filename. Assumes that the filename is
***REMOVED*** formatted like 'foo_1of5_test.html'.
***REMOVED*** @param {string=} opt_name A descriptive name for the test case.
***REMOVED***
goog.testing.ShardingTestCase.shardByFileName = function(opt_name) {
  var path = window.location.pathname;
  var shardMatch = path.match(/_(\d+)of(\d+)_test\.html/);
  goog.asserts.assert(shardMatch,
      'Filename must be of the form "foo_1of5_test.html"');
  var shardIndex = parseInt(shardMatch[1], 10);
  var numShards = parseInt(shardMatch[2], 10);

  var testCase = new goog.testing.ShardingTestCase(
      shardIndex, numShards, opt_name);
  goog.testing.TestCase.initializeTestRunner(testCase);
***REMOVED***
