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
***REMOVED*** @fileoverview List format and gender decision library with locale support.
***REMOVED***
***REMOVED*** ListFormat takes an array or a var_arg of objects and generates a user
***REMOVED*** friendly list in a locale-sensitive way (i.e. "red, green, and blue").
***REMOVED***
***REMOVED*** GenderInfo can be used to determine the gender of a list of items,
***REMOVED*** depending on the gender of all items in the list.
***REMOVED***
***REMOVED*** In English, lists of items don't really have gender, and in fact few things
***REMOVED*** have gender. But the idea is this:
***REMOVED***  - for a list of "male items" (think "John, Steve") you use "they"
***REMOVED***  - for "Marry, Ann" (all female) you might have a "feminine" form of "they"
***REMOVED***  - and yet another form for mixed lists ("John, Marry") or undetermined
***REMOVED***    (when you don't know the gender of the items, or when they are neuter)
***REMOVED***
***REMOVED*** For example in Greek "they" will be translated as "αυτοί" for masculin,
***REMOVED*** "αυτές" for feminin, and "αυτά" for neutral/undetermined.
***REMOVED*** (it is in fact more complicated than that, as weak/strong forms and case
***REMOVED*** also matter, see http://en.wiktionary.org/wiki/Appendix:Greek_pronouns)
***REMOVED***
***REMOVED***

goog.provide('goog.labs.i18n.GenderInfo');
goog.provide('goog.labs.i18n.GenderInfo.Gender');
goog.provide('goog.labs.i18n.ListFormat');

goog.require('goog.asserts');
goog.require('goog.labs.i18n.ListFormatSymbols');



***REMOVED***
***REMOVED*** ListFormat provides a method to format a list/array of objects to a string,
***REMOVED*** in a user friendly way and in a locale sensitive manner.
***REMOVED*** If the objects are not strings, toString is called to convert them.
***REMOVED*** The constructor initializes the object based on the locale data from
***REMOVED*** the current goog.labs.i18n.ListFormatSymbols.
***REMOVED***
***REMOVED*** Similar to the ICU4J class com.ibm.icu.text.ListFormatter:
***REMOVED***   http://icu-project.org/apiref/icu4j/com/ibm/icu/text/ListFormatter.html
***REMOVED***
***REMOVED*** @final
***REMOVED***
goog.labs.i18n.ListFormat = function() {
 ***REMOVED*****REMOVED***
  ***REMOVED*** String for lists of exactly two items, containing {0} for the first,
  ***REMOVED*** and {1} for the second.
  ***REMOVED*** For instance '{0} and {1}' will give 'black and white'.
  ***REMOVED*** @private {string}
  ***REMOVED***
  ***REMOVED*** Example: for "black and white" the pattern is "{0} and {1}"
  ***REMOVED*** While for a longer list we have "cyan, magenta, yellow, and black"
  ***REMOVED*** Think "{0} start {1} middle {2} middle {3} end {4}"
  ***REMOVED*** The last pattern is "{0}, and {1}." Note the comma before "and".
  ***REMOVED*** So the "Two" pattern can be different than Start/Middle/End ones.
 ***REMOVED*****REMOVED***
  this.listTwoPattern_ = goog.labs.i18n.ListFormatSymbols.LIST_TWO;

 ***REMOVED*****REMOVED***
  ***REMOVED*** String for the start of a list items, containing {0} for the first,
  ***REMOVED*** and {1} for the rest.
  ***REMOVED*** @private {string}
 ***REMOVED*****REMOVED***
  this.listStartPattern_ = goog.labs.i18n.ListFormatSymbols.LIST_START;

 ***REMOVED*****REMOVED***
  ***REMOVED*** String for the start of a list items, containing {0} for the first part
  ***REMOVED*** of the list, and {1} for the rest of the list.
  ***REMOVED*** @private {string}
 ***REMOVED*****REMOVED***
  this.listMiddlePattern_ = goog.labs.i18n.ListFormatSymbols.LIST_MIDDLE;

 ***REMOVED*****REMOVED***
  ***REMOVED*** String for the end of a list items, containing {0} for the first part
  ***REMOVED*** of the list, and {1} for the last item.
  ***REMOVED***
  ***REMOVED*** This is how start/middle/end come together:
  ***REMOVED***   start = '{0}, {1}'  middle = '{0}, {1}',  end = '{0}, and {1}'
  ***REMOVED*** will result in the typical English list: 'one, two, three, and four'
  ***REMOVED*** There are languages where the patterns are more complex than
  ***REMOVED*** '{1} someText {1}' and the start pattern is different than the middle one.
  ***REMOVED***
  ***REMOVED*** @private {string}
 ***REMOVED*****REMOVED***
  this.listEndPattern_ = goog.labs.i18n.ListFormatSymbols.LIST_END;
***REMOVED***


***REMOVED***
***REMOVED*** Replaces the {0} and {1} placeholders in a pattern with the first and
***REMOVED*** the second parameter respectively, and returns the result.
***REMOVED*** It is a helper function for goog.labs.i18n.ListFormat.format.
***REMOVED***
***REMOVED*** @param {string} pattern used for formatting.
***REMOVED*** @param {string} first object to add to list.
***REMOVED*** @param {string} second object to add to list.
***REMOVED*** @return {string} The formatted list string.
***REMOVED*** @private
***REMOVED***
goog.labs.i18n.ListFormat.prototype.patternBasedJoinTwoStrings_ =
    function(pattern, first, second) {
  return pattern.replace('{0}', first).replace('{1}', second);
***REMOVED***


***REMOVED***
***REMOVED*** Formats an array of strings into a string.
***REMOVED*** It is a user facing, locale-aware list (i.e. 'red, green, and blue').
***REMOVED***
***REMOVED*** @param {!Array.<string|number>} items Items to format.
***REMOVED*** @return {string} The items formatted into a string, as a list.
***REMOVED***
goog.labs.i18n.ListFormat.prototype.format = function(items) {
  var count = items.length;
  switch (count) {
    case 0:
      return '';
    case 1:
      return String(items[0]);
    case 2:
      return this.patternBasedJoinTwoStrings_(this.listTwoPattern_,
          String(items[0]), String(items[1]));
  }

  var result = this.patternBasedJoinTwoStrings_(this.listStartPattern_,
      String(items[0]), String(items[1]));

  for (var i = 2; i < count - 1; ++i) {
    result = this.patternBasedJoinTwoStrings_(this.listMiddlePattern_,
        result, String(items[i]));
  }

  return this.patternBasedJoinTwoStrings_(this.listEndPattern_,
      result, String(items[count - 1]));
***REMOVED***



***REMOVED***
***REMOVED*** GenderInfo provides a method to determine the gender of a list/array
***REMOVED*** of objects when one knows the gender of each item of the list.
***REMOVED*** It does this in a locale sensitive manner.
***REMOVED*** The constructor initializes the object based on the locale data from
***REMOVED*** the current goog.labs.i18n.ListFormatSymbols.
***REMOVED***
***REMOVED*** Similar to the ICU4J class com.icu.util.GenderInfo:
***REMOVED***   http://icu-project.org/apiref/icu4j/com/ibm/icu/util/GenderInfo.html
***REMOVED***
***REMOVED*** @final
***REMOVED***
goog.labs.i18n.GenderInfo = function() {
 ***REMOVED*****REMOVED***
  ***REMOVED*** Stores the language-aware mode of determining the gender of a list.
  ***REMOVED*** @private {goog.labs.i18n.GenderInfo.ListGenderStyle_}
 ***REMOVED*****REMOVED***
  this.listGenderStyle_ = goog.labs.i18n.ListFormatSymbols.GENDER_STYLE;
***REMOVED***


***REMOVED***
***REMOVED*** Enumeration for the possible ways to generate list genders.
***REMOVED*** Indicates the category for the locale.
***REMOVED*** This only affects gender for lists more than one. For lists of 1 item,
***REMOVED*** the gender of the list always equals the gender of that sole item.
***REMOVED*** This is for internal use, matching ICU.
***REMOVED*** @enum {number}
***REMOVED*** @private
***REMOVED***
goog.labs.i18n.GenderInfo.ListGenderStyle_ = {
  NEUTRAL: 0,
  MIXED_NEUTRAL: 1,
  MALE_TAINTS: 2
***REMOVED***


***REMOVED***
***REMOVED*** Enumeration for the possible gender values.
***REMOVED*** Gender: OTHER means either the information is unavailable,
***REMOVED*** or the person has declined to state MALE or FEMALE.
***REMOVED*** @enum {number}
***REMOVED***
goog.labs.i18n.GenderInfo.Gender = {
  MALE: 0,
  FEMALE: 1,
  OTHER: 2
***REMOVED***


***REMOVED***
***REMOVED*** Determines the overal gender of a list based on the gender of all the list
***REMOVED*** items, in a locale-aware way.
***REMOVED*** @param {!Array.<!goog.labs.i18n.GenderInfo.Gender>} genders An array of
***REMOVED***        genders, will give the gender of the list.
***REMOVED*** @return {goog.labs.i18n.GenderInfo.Gender} Get the gender of the list.
*/
goog.labs.i18n.GenderInfo.prototype.getListGender = function(genders) {
  var Gender = goog.labs.i18n.GenderInfo.Gender;

  var count = genders.length;
  if (count == 0) {
    return Gender.OTHER; // degenerate case
  }
  if (count == 1) {
    return genders[0]; // degenerate case
  }

  switch (this.listGenderStyle_) {
    case goog.labs.i18n.GenderInfo.ListGenderStyle_.NEUTRAL:
      return Gender.OTHER;
    case goog.labs.i18n.GenderInfo.ListGenderStyle_.MIXED_NEUTRAL:
      var hasFemale = false;
      var hasMale = false;
      for (var i = 0; i < count; ++i) {
        switch (genders[i]) {
          case Gender.FEMALE:
            if (hasMale) {
              return Gender.OTHER;
            }
            hasFemale = true;
            break;
          case Gender.MALE:
            if (hasFemale) {
              return Gender.OTHER;
            }
            hasMale = true;
            break;
          case Gender.OTHER:
            return Gender.OTHER;
          default: // Should never happen, but just in case
            goog.asserts.assert(false,
                'Invalid genders[' + i + '] = ' + genders[i]);
            return Gender.OTHER;
        }
      }
      return hasMale ? Gender.MALE : Gender.FEMALE;
    case goog.labs.i18n.GenderInfo.ListGenderStyle_.MALE_TAINTS:
      for (var i = 0; i < count; ++i) {
        if (genders[i] != Gender.FEMALE) {
          return Gender.MALE;
        }
      }
      return Gender.FEMALE;
    default:
      return Gender.OTHER;
  }
***REMOVED***
