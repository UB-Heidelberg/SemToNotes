// Copyright 2012 The Closure Library Authors. All Rights Reserved.
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
***REMOVED*** @fileoverview Provides main functionality of assertThat. assertThat calls the
***REMOVED*** matcher's matches method to test if a matcher matches assertThat's arguments.
***REMOVED***


goog.provide('goog.labs.testing.MatcherError');
goog.provide('goog.labs.testing.assertThat');

goog.require('goog.asserts');
goog.require('goog.debug.Error');
goog.require('goog.labs.testing.Matcher');


***REMOVED***
***REMOVED*** Asserts that the actual value evaluated by the matcher is true.
***REMOVED***
***REMOVED*** @param {*} actual The object to assert by the matcher.
***REMOVED*** @param {!goog.labs.testing.Matcher} matcher A matcher to verify values.
***REMOVED*** @param {string=} opt_reason Description of what is asserted.
***REMOVED***
***REMOVED***
goog.labs.testing.assertThat = function(actual, matcher, opt_reason) {
  if (!matcher.matches(actual)) {
    // Prefix the error description with a reason from the assert ?
    var prefix = opt_reason ? opt_reason + ': ' : '';
    var desc = prefix + matcher.describe(actual);

    // some sort of failure here
    throw new goog.labs.testing.MatcherError(desc);
  }
***REMOVED***



***REMOVED***
***REMOVED*** Error thrown when a Matcher fails to match the input value.
***REMOVED*** @param {string=} opt_message The error message.
***REMOVED***
***REMOVED*** @extends {goog.debug.Error}
***REMOVED***
goog.labs.testing.MatcherError = function(opt_message) {
  goog.base(this, opt_message);
***REMOVED***
goog.inherits(goog.labs.testing.MatcherError, goog.debug.Error);
