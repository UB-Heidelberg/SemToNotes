// Copyright 2011 The Closure Library Authors. All Rights Reserved.
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
***REMOVED*** @fileoverview PseudoRandom provides a mechanism for generating deterministic
***REMOVED*** psuedo random numbers based on a seed. Based on the Park-Miller algorithm.
***REMOVED*** See http://dx.doi.org/10.1145%2F63039.63042 for details.
***REMOVED***
***REMOVED***

goog.provide('goog.testing.PseudoRandom');

goog.require('goog.Disposable');



***REMOVED***
***REMOVED*** Class for unit testing code that uses Math.random. Generates deterministic
***REMOVED*** random numbers.
***REMOVED***
***REMOVED*** @param {number=} opt_seed The seed to use.
***REMOVED*** @param {boolean=} opt_install Whether to install the PseudoRandom at
***REMOVED***     construction time.
***REMOVED*** @extends {goog.Disposable}
***REMOVED***
***REMOVED***
goog.testing.PseudoRandom = function(opt_seed, opt_install) {
  goog.Disposable.call(this);

  if (!goog.isDef(opt_seed)) {
    opt_seed = goog.testing.PseudoRandom.seedUniquifier_++ + goog.now();
  }
  this.seed(opt_seed);

  if (opt_install) {
    this.install();
  }
***REMOVED***
goog.inherits(goog.testing.PseudoRandom, goog.Disposable);


***REMOVED***
***REMOVED*** Helps create a unique seed.
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.testing.PseudoRandom.seedUniquifier_ = 0;


***REMOVED***
***REMOVED*** Constant used as part of the algorithm.
***REMOVED*** @type {number}
***REMOVED***
goog.testing.PseudoRandom.A = 48271;


***REMOVED***
***REMOVED*** Constant used as part of the algorithm. 2^31 - 1.
***REMOVED*** @type {number}
***REMOVED***
goog.testing.PseudoRandom.M = 2147483647;


***REMOVED***
***REMOVED*** Constant used as part of the algorithm. It is equal to M / A.
***REMOVED*** @type {number}
***REMOVED***
goog.testing.PseudoRandom.Q = 44488;


***REMOVED***
***REMOVED*** Constant used as part of the algorithm. It is equal to M % A.
***REMOVED*** @type {number}
***REMOVED***
goog.testing.PseudoRandom.R = 3399;


***REMOVED***
***REMOVED*** Constant used as part of the algorithm to get values from range [0, 1).
***REMOVED*** @type {number}
***REMOVED***
goog.testing.PseudoRandom.ONE_OVER_M_MINUS_ONE =
    1.0 / (goog.testing.PseudoRandom.M - 1);


***REMOVED***
***REMOVED*** The seed of the random sequence and also the next returned value (before
***REMOVED*** normalization). Must be between 1 and M - 1 (inclusive).
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.testing.PseudoRandom.prototype.seed_ = 1;


***REMOVED***
***REMOVED*** Whether this PseudoRandom has been installed.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.testing.PseudoRandom.prototype.installed_;


***REMOVED***
***REMOVED*** The original Math.random function.
***REMOVED*** @type {function(): number}
***REMOVED*** @private
***REMOVED***
goog.testing.PseudoRandom.prototype.mathRandom_;


***REMOVED***
***REMOVED*** Installs this PseudoRandom as the system number generator.
***REMOVED***
goog.testing.PseudoRandom.prototype.install = function() {
  if (!this.installed_) {
    this.mathRandom_ = Math.random;
    Math.random = goog.bind(this.random, this);
    this.installed_ = true;
  }
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.testing.PseudoRandom.prototype.disposeInternal = function() {
  goog.testing.PseudoRandom.superClass_.disposeInternal.call(this);
  this.uninstall();
***REMOVED***


***REMOVED***
***REMOVED*** Uninstalls the PseudoRandom.
***REMOVED***
goog.testing.PseudoRandom.prototype.uninstall = function() {
  if (this.installed_) {
    Math.random = this.mathRandom_;
    this.installed_ = false;
  }
***REMOVED***


***REMOVED***
***REMOVED*** Seed the generator.
***REMOVED***
***REMOVED*** @param {number=} seed The seed to use.
***REMOVED***
goog.testing.PseudoRandom.prototype.seed = function(seed) {
  this.seed_ = seed % (goog.testing.PseudoRandom.M - 1);
  if (this.seed_ <= 0) {
    this.seed_ += goog.testing.PseudoRandom.M - 1;
  }
***REMOVED***


***REMOVED***
***REMOVED*** @return {number} The next number in the sequence.
***REMOVED***
goog.testing.PseudoRandom.prototype.random = function() {
  var hi = Math.floor(this.seed_ / goog.testing.PseudoRandom.Q);
  var lo = this.seed_ % goog.testing.PseudoRandom.Q;
  var test = goog.testing.PseudoRandom.A***REMOVED*** lo -
             goog.testing.PseudoRandom.R***REMOVED*** hi;
  if (test > 0) {
    this.seed_ = test;
  } else {
    this.seed_ = test + goog.testing.PseudoRandom.M;
  }
  return (this.seed_ - 1)***REMOVED*** goog.testing.PseudoRandom.ONE_OVER_M_MINUS_ONE;
***REMOVED***
