// Copyright 2013 The Closure Library Authors. All Rights Reserved.
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
***REMOVED*** @fileoverview Assert functions that account for locale data changes.
***REMOVED***
***REMOVED*** The locale data gets updated from CLDR (http://cldr.unicode.org/),
***REMOVED*** and CLDR gets an update about twice per year.
***REMOVED*** So the locale data are expected to change.
***REMOVED*** This can make unit tests quite fragile:
***REMOVED***   assertEquals("Dec 31, 2013, 1:23pm", format);
***REMOVED*** Now imagine that the decision is made to add a dot after abbreviations,
***REMOVED*** and a comma between date and time.
***REMOVED*** The previous assert will fail, because the string is now
***REMOVED***   "Dec. 31 2013, 1:23pm"
***REMOVED***
***REMOVED*** One option is to not unit test the results of the formatters client side,
***REMOVED*** and just trust that CLDR and closure/i18n takes care of that.
***REMOVED*** The other option is to be a more flexible when testing.
***REMOVED*** This is the role of assertI18nEquals, to centralize all the small
***REMOVED*** differences between hard-coded values in unit tests and the current result.
***REMOVED*** It allows some decupling, so that the closure/i18n can be updated without
***REMOVED*** breaking all the clients using it.
***REMOVED*** For the example above, this will succeed:
***REMOVED***   assertI18nEquals("Dec 31, 2013, 1:23pm", "Dec. 31, 2013 1:23pm");
***REMOVED*** It does this by white-listing, no "guessing" involved.
***REMOVED***
***REMOVED*** But I would say that the best practice is the first option: trust the
***REMOVED*** library, stop unit-testing it.
***REMOVED***

goog.provide('goog.testing.i18n.asserts');
goog.setTestOnly('goog.testing.i18n.asserts');

goog.require('goog.testing.jsunit');


***REMOVED***
***REMOVED*** A map of known tests where locale data changed, but the old values are
***REMOVED*** still tested for by various clients.
***REMOVED*** @const {!Object.<string, string>}
***REMOVED*** @private
***REMOVED***
goog.testing.i18n.asserts.EXPECTED_VALUE_MAP_ = {
  // Data to test the assert itself, old string as key, new string as value
***REMOVED***


***REMOVED***
***REMOVED*** Asserts that the two values are "almost equal" from i18n perspective
***REMOVED*** (based on a manually maintained and validated whitelist).
***REMOVED*** @param {string} expected The expected value.
***REMOVED*** @param {string} actual The actual value.
***REMOVED***
goog.testing.i18n.asserts.assertI18nEquals = function(expected, actual) {
  if (expected == actual) {
    return;
  }

  var newExpected = goog.testing.i18n.asserts.EXPECTED_VALUE_MAP_[expected];
  if (newExpected == actual) {
    return;
  }

  assertEquals(expected, actual);
***REMOVED***
