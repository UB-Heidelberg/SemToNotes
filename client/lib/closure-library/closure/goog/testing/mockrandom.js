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
***REMOVED*** @fileoverview MockRandom provides a mechanism for specifying a stream of
***REMOVED*** numbers to expect from calls to Math.random().
***REMOVED***
***REMOVED***

goog.provide('goog.testing.MockRandom');

goog.require('goog.Disposable');



***REMOVED***
***REMOVED*** Class for unit testing code that uses Math.random.
***REMOVED***
***REMOVED*** @param {Array.<number>} sequence The sequence of numbers to return.
***REMOVED*** @param {boolean=} opt_install Whether to install the MockRandom at
***REMOVED***     construction time.
***REMOVED*** @extends {goog.Disposable}
***REMOVED***
***REMOVED*** @final
***REMOVED***
goog.testing.MockRandom = function(sequence, opt_install) {
  goog.Disposable.call(this);

 ***REMOVED*****REMOVED***
  ***REMOVED*** The sequence of numbers to be returned by calls to random()
  ***REMOVED*** @type {Array.<number>}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.sequence_ = sequence || [];

 ***REMOVED*****REMOVED***
  ***REMOVED*** The original Math.random function.
  ***REMOVED*** @type {function(): number}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.mathRandom_ = Math.random;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Whether to throw an exception when Math.random() is called when there is
  ***REMOVED*** nothing left in the sequence.
  ***REMOVED*** @type {boolean}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.strictlyFromSequence_ = false;

  if (opt_install) {
    this.install();
  }
***REMOVED***
goog.inherits(goog.testing.MockRandom, goog.Disposable);


***REMOVED***
***REMOVED*** Whether this MockRandom has been installed.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.testing.MockRandom.prototype.installed_;


***REMOVED***
***REMOVED*** Installs this MockRandom as the system number generator.
***REMOVED***
goog.testing.MockRandom.prototype.install = function() {
  if (!this.installed_) {
    Math.random = goog.bind(this.random, this);
    this.installed_ = true;
  }
***REMOVED***


***REMOVED***
***REMOVED*** @return {number} The next number in the sequence. If there are no more values
***REMOVED***     left, this will return a random number, unless
***REMOVED***     {@code this.strictlyFromSequence_} is true, in which case an error will
***REMOVED***     be thrown.
***REMOVED***
goog.testing.MockRandom.prototype.random = function() {
  if (this.hasMoreValues()) {
    return this.sequence_.shift();
  }
  if (this.strictlyFromSequence_) {
    throw new Error('No numbers left in sequence.');
  }
  return this.mathRandom_();
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} Whether there are more numbers left in the sequence.
***REMOVED***
goog.testing.MockRandom.prototype.hasMoreValues = function() {
  return this.sequence_.length > 0;
***REMOVED***


***REMOVED***
***REMOVED*** Injects new numbers into the beginning of the sequence.
***REMOVED*** @param {Array.<number>|number} values Number or array of numbers to inject.
***REMOVED***
goog.testing.MockRandom.prototype.inject = function(values) {
  if (goog.isArray(values)) {
    this.sequence_ = values.concat(this.sequence_);
  } else {
    this.sequence_.splice(0, 0, values);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Uninstalls the MockRandom.
***REMOVED***
goog.testing.MockRandom.prototype.uninstall = function() {
  if (this.installed_) {
    Math.random = this.mathRandom_;
    this.installed_ = false;
  }
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.testing.MockRandom.prototype.disposeInternal = function() {
  this.uninstall();
  delete this.sequence_;
  delete this.mathRandom_;
  goog.testing.MockRandom.superClass_.disposeInternal.call(this);
***REMOVED***


***REMOVED***
***REMOVED*** @param {boolean} strictlyFromSequence Whether to throw an exception when
***REMOVED***     Math.random() is called when there is nothing left in the sequence.
***REMOVED***
goog.testing.MockRandom.prototype.setStrictlyFromSequence =
    function(strictlyFromSequence) {
  this.strictlyFromSequence_ = strictlyFromSequence;
***REMOVED***
