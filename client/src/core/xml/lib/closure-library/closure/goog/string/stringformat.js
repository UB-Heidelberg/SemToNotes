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
***REMOVED*** @fileoverview Implementation of sprintf-like, python-%-operator-like,
***REMOVED*** .NET-String.Format-like functionality. Uses JS string's replace method to
***REMOVED*** extract format specifiers and sends those specifiers to a handler function,
***REMOVED*** which then, based on conversion type part of the specifier, calls the
***REMOVED*** appropriate function to handle the specific conversion.
***REMOVED*** For specific functionality implemented, look at formatRe below, or look
***REMOVED*** at the tests.
***REMOVED***

goog.provide('goog.string.format');

goog.require('goog.string');


***REMOVED***
***REMOVED*** Performs sprintf-like conversion, ie. puts the values in a template.
***REMOVED*** DO NOT use it instead of built-in conversions in simple cases such as
***REMOVED*** 'Cost: %.2f' as it would introduce unneccessary latency oposed to
***REMOVED*** 'Cost: ' + cost.toFixed(2).
***REMOVED*** @param {string} formatString Template string containing % specifiers.
***REMOVED*** @param {...string|number} var_args Values formatString is to be filled with.
***REMOVED*** @return {string} Formatted string.
***REMOVED***
goog.string.format = function(formatString, var_args) {

  // Convert the arguments to an array (MDC recommended way).
  var args = Array.prototype.slice.call(arguments);

  // Try to get the template.
  var template = args.shift();
  if (typeof template == 'undefined') {
    throw Error('[goog.string.format] Template required');
  }

  // This re is used for matching, it also defines what is supported.
  var formatRe = /%([0\-\ \+]*)(\d+)?(\.(\d+))?([%sfdiu])/g;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Chooses which conversion function to call based on type conversion
  ***REMOVED*** specifier.
  ***REMOVED*** @param {string} match Contains the re matched string.
  ***REMOVED*** @param {string} flags Formatting flags.
  ***REMOVED*** @param {string} width Replacement string minimum width.
  ***REMOVED*** @param {string} dotp Matched precision including a dot.
  ***REMOVED*** @param {string} precision Specifies floating point precision.
  ***REMOVED*** @param {string} type Type conversion specifier.
  ***REMOVED*** @param {string} offset Matching location in the original string.
  ***REMOVED*** @param {string} wholeString Has the actualString being searched.
  ***REMOVED*** @return {string} Formatted parameter.
 ***REMOVED*****REMOVED***
  function replacerDemuxer(match,
                           flags,
                           width,
                           dotp,
                           precision,
                           type,
                           offset,
                           wholeString) {

    // The % is too simple and doesn't take an argument.
    if (type == '%') {
      return '%';
    }

    // Try to get the actual value from parent function.
    var value = args.shift();

    // If we didn't get any arguments, fail.
    if (typeof value == 'undefined') {
      throw Error('[goog.string.format] Not enough arguments');
    }

    // Patch the value argument to the beginning of our type specific call.
    arguments[0] = value;

    return goog.string.format.demuxes_[type].apply(null, arguments);

  }

  return template.replace(formatRe, replacerDemuxer);
***REMOVED***


***REMOVED***
***REMOVED*** Contains various conversion functions (to be filled in later on).
***REMOVED*** @type {Object}
***REMOVED*** @private
***REMOVED***
goog.string.format.demuxes_ = {***REMOVED***


***REMOVED***
***REMOVED*** Processes %s conversion specifier.
***REMOVED*** @param {string} value Contains the formatRe matched string.
***REMOVED*** @param {string} flags Formatting flags.
***REMOVED*** @param {string} width Replacement string minimum width.
***REMOVED*** @param {string} dotp Matched precision including a dot.
***REMOVED*** @param {string} precision Specifies floating point precision.
***REMOVED*** @param {string} type Type conversion specifier.
***REMOVED*** @param {string} offset Matching location in the original string.
***REMOVED*** @param {string} wholeString Has the actualString being searched.
***REMOVED*** @return {string} Replacement string.
***REMOVED***
goog.string.format.demuxes_['s'] = function(value,
                                            flags,
                                            width,
                                            dotp,
                                            precision,
                                            type,
                                            offset,
                                            wholeString) {
  var replacement = value;
  // If no padding is necessary we're done.
  // The check for '' is necessary because Firefox incorrectly provides the
  // empty string instead of undefined for non-participating capture groups,
  // and isNaN('') == false.
  if (isNaN(width) || width == '' || replacement.length >= width) {
    return replacement;
  }

  // Otherwise we should find out where to put spaces.
  if (flags.indexOf('-', 0) > -1) {
    replacement =
        replacement + goog.string.repeat(' ', width - replacement.length);
  } else {
    replacement =
        goog.string.repeat(' ', width - replacement.length) + replacement;
  }
  return replacement;
***REMOVED***


***REMOVED***
***REMOVED*** Processes %f conversion specifier.
***REMOVED*** @param {number} value Contains the formatRe matched string.
***REMOVED*** @param {string} flags Formatting flags.
***REMOVED*** @param {string} width Replacement string minimum width.
***REMOVED*** @param {string} dotp Matched precision including a dot.
***REMOVED*** @param {string} precision Specifies floating point precision.
***REMOVED*** @param {string} type Type conversion specifier.
***REMOVED*** @param {string} offset Matching location in the original string.
***REMOVED*** @param {string} wholeString Has the actualString being searched.
***REMOVED*** @return {string} Replacement string.
***REMOVED***
goog.string.format.demuxes_['f'] = function(value,
                                            flags,
                                            width,
                                            dotp,
                                            precision,
                                            type,
                                            offset,
                                            wholeString) {

  var replacement = value.toString();

  // The check for '' is necessary because Firefox incorrectly provides the
  // empty string instead of undefined for non-participating capture groups,
  // and isNaN('') == false.
  if (!(isNaN(precision) || precision == '')) {
    replacement = value.toFixed(precision);
  }

  // Generates sign string that will be attached to the replacement.
  var sign;
  if (value < 0) {
    sign = '-';
  } else if (flags.indexOf('+') >= 0) {
    sign = '+';
  } else if (flags.indexOf(' ') >= 0) {
    sign = ' ';
  } else {
    sign = '';
  }

  if (value >= 0) {
    replacement = sign + replacement;
  }

  // If no padding is neccessary we're done.
  if (isNaN(width) || replacement.length >= width) {
    return replacement;
  }

  // We need a clean signless replacement to start with
  replacement = isNaN(precision) ?
      Math.abs(value).toString() :
      Math.abs(value).toFixed(precision);

  var padCount = width - replacement.length - sign.length;

  // Find out which side to pad, and if it's left side, then which character to
  // pad, and set the sign on the left and padding in the middle.
  if (flags.indexOf('-', 0) >= 0) {
    replacement = sign + replacement + goog.string.repeat(' ', padCount);
  } else {
    // Decides which character to pad.
    var paddingChar = (flags.indexOf('0', 0) >= 0) ? '0' : ' ';
    replacement =
        sign + goog.string.repeat(paddingChar, padCount) + replacement;
  }

  return replacement;
***REMOVED***


***REMOVED***
***REMOVED*** Processes %d conversion specifier.
***REMOVED*** @param {string} value Contains the formatRe matched string.
***REMOVED*** @param {string} flags Formatting flags.
***REMOVED*** @param {string} width Replacement string minimum width.
***REMOVED*** @param {string} dotp Matched precision including a dot.
***REMOVED*** @param {string} precision Specifies floating point precision.
***REMOVED*** @param {string} type Type conversion specifier.
***REMOVED*** @param {string} offset Matching location in the original string.
***REMOVED*** @param {string} wholeString Has the actualString being searched.
***REMOVED*** @return {string} Replacement string.
***REMOVED***
goog.string.format.demuxes_['d'] = function(value,
                                            flags,
                                            width,
                                            dotp,
                                            precision,
                                            type,
                                            offset,
                                            wholeString) {
  return goog.string.format.demuxes_['f'](
      parseInt(value, 10) /* value***REMOVED***,
      flags, width, dotp, 0 /* precision***REMOVED***,
      type, offset, wholeString);
***REMOVED***


// These are additional aliases, for integer conversion.
goog.string.format.demuxes_['i'] = goog.string.format.demuxes_['d'];
goog.string.format.demuxes_['u'] = goog.string.format.demuxes_['d'];

