// Copyright 2007 The Closure Library Authors. All Rights Reserved.
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
***REMOVED*** @fileoverview Numeric base conversion library.  Works for arbitrary bases and
***REMOVED*** arbitrary length numbers.
***REMOVED***
***REMOVED*** For base-64 conversion use base64.js because it is optimized for the specific
***REMOVED*** conversion to base-64 while this module is generic.  Base-64 is defined here
***REMOVED*** mostly for demonstration purpose.
***REMOVED***
***REMOVED*** TODO: Make base64 and baseN classes that have common interface.  (Perhaps...)
***REMOVED***
***REMOVED***

goog.provide('goog.crypt.baseN');


***REMOVED***
***REMOVED*** Base-2, i.e. '01'.
***REMOVED*** @type {string}
***REMOVED***
goog.crypt.baseN.BASE_BINARY = '01';


***REMOVED***
***REMOVED*** Base-8, i.e. '01234567'.
***REMOVED*** @type {string}
***REMOVED***
goog.crypt.baseN.BASE_OCTAL = '01234567';


***REMOVED***
***REMOVED*** Base-10, i.e. '0123456789'.
***REMOVED*** @type {string}
***REMOVED***
goog.crypt.baseN.BASE_DECIMAL = '0123456789';


***REMOVED***
***REMOVED*** Base-16 using lower case, i.e. '0123456789abcdef'.
***REMOVED*** @type {string}
***REMOVED***
goog.crypt.baseN.BASE_LOWERCASE_HEXADECIMAL = '0123456789abcdef';


***REMOVED***
***REMOVED*** Base-16 using upper case, i.e. '0123456789ABCDEF'.
***REMOVED*** @type {string}
***REMOVED***
goog.crypt.baseN.BASE_UPPERCASE_HEXADECIMAL = '0123456789ABCDEF';


***REMOVED***
***REMOVED*** The more-known version of the BASE-64 encoding.  Uses + and / characters.
***REMOVED*** @type {string}
***REMOVED***
goog.crypt.baseN.BASE_64 =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';


***REMOVED***
***REMOVED*** URL-safe version of the BASE-64 encoding.
***REMOVED*** @type {string}
***REMOVED***
goog.crypt.baseN.BASE_64_URL_SAFE =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';


***REMOVED***
***REMOVED*** Converts a number from one numeric base to another.
***REMOVED***
***REMOVED*** The bases are represented as strings, which list allowed digits.  Each digit
***REMOVED*** should be unique.  The bases can either be user defined, or any of
***REMOVED*** goog.crypt.baseN.BASE_xxx.
***REMOVED***
***REMOVED*** The number is in human-readable format, most significant digit first, and is
***REMOVED*** a non-negative integer.  Base designators such as $, 0x, d, b or h (at end)
***REMOVED*** will be interpreted as digits, so avoid them.  Leading zeros will be trimmed.
***REMOVED***
***REMOVED*** Note: for huge bases the result may be inaccurate because of overflowing
***REMOVED*** 64-bit doubles used by JavaScript for integer calculus.  This may happen
***REMOVED*** if the product of the number of digits in the input and output bases comes
***REMOVED*** close to 10^16, which is VERY unlikely (100M digits in each base), but
***REMOVED*** may be possible in the future unicode world.  (Unicode 3.2 has less than 100K
***REMOVED*** characters.  However, it reserves some more, close to 1M.)
***REMOVED***
***REMOVED*** @param {string} number The number to convert.
***REMOVED*** @param {string} inputBase The numeric base the number is in (all digits).
***REMOVED*** @param {string} outputBase Requested numeric base.
***REMOVED*** @return {string} The converted number.
***REMOVED***
goog.crypt.baseN.recodeString = function(number, inputBase, outputBase) {
  if (outputBase == '') {
    throw Error('Empty output base');
  }

  // Check if number is 0 (special case when we don't want to return '').
  var isZero = true;
  for (var i = 0, n = number.length; i < n; i++) {
    if (number.charAt(i) != inputBase.charAt(0)) {
      isZero = false;
      break;
    }
  }
  if (isZero) {
    return outputBase.charAt(0);
  }

  var numberDigits = goog.crypt.baseN.stringToArray_(number, inputBase);

  var inputBaseSize = inputBase.length;
  var outputBaseSize = outputBase.length;

  // result = 0.
  var result = [];

  // For all digits of number, starting with the most significant ...
  for (var i = numberDigits.length - 1; i >= 0; i--) {

    // result***REMOVED***= number.base.
    var carry = 0;
    for (var j = 0, n = result.length; j < n; j++) {
      var digit = result[j];
      // This may overflow for huge bases.  See function comment.
      digit = digit***REMOVED*** inputBaseSize + carry;
      if (digit >= outputBaseSize) {
        var remainder = digit % outputBaseSize;
        carry = (digit - remainder) / outputBaseSize;
        digit = remainder;
      } else {
        carry = 0;
      }
      result[j] = digit;
    }
    while (carry) {
      var remainder = carry % outputBaseSize;
      result.push(remainder);
      carry = (carry - remainder) / outputBaseSize;
    }

    // result += number[i].
    carry = numberDigits[i];
    var j = 0;
    while (carry) {
      if (j >= result.length) {
        // Extend result with a leading zero which will be overwritten below.
        result.push(0);
      }
      var digit = result[j];
      digit += carry;
      if (digit >= outputBaseSize) {
        var remainder = digit % outputBaseSize;
        carry = (digit - remainder) / outputBaseSize;
        digit = remainder;
      } else {
        carry = 0;
      }
      result[j] = digit;
      j++;
    }
  }

  return goog.crypt.baseN.arrayToString_(result, outputBase);
***REMOVED***


***REMOVED***
***REMOVED*** Converts a string representation of a number to an array of digit values.
***REMOVED***
***REMOVED*** More precisely, the digit values are indices into the number base, which
***REMOVED*** is represented as a string, which can either be user defined or one of the
***REMOVED*** BASE_xxx constants.
***REMOVED***
***REMOVED*** Throws an Error if the number contains a digit not found in the base.
***REMOVED***
***REMOVED*** @param {string} number The string to convert, most significant digit first.
***REMOVED*** @param {string} base Digits in the base.
***REMOVED*** @return {!Array.<number>} Array of digit values, least significant digit
***REMOVED***     first.
***REMOVED*** @private
***REMOVED***
goog.crypt.baseN.stringToArray_ = function(number, base) {
  var index = {***REMOVED***
  for (var i = 0, n = base.length; i < n; i++) {
    index[base.charAt(i)] = i;
  }
  var result = [];
  for (var i = number.length - 1; i >= 0; i--) {
    var character = number.charAt(i);
    var digit = index[character];
    if (typeof digit == 'undefined') {
      throw Error('Number ' + number +
                  ' contains a character not found in base ' +
                  base + ', which is ' + character);
    }
    result.push(digit);
  }
  return result;
***REMOVED***


***REMOVED***
***REMOVED*** Converts an array representation of a number to a string.
***REMOVED***
***REMOVED*** More precisely, the elements of the input array are indices into the base,
***REMOVED*** which is represented as a string, which can either be user defined or one of
***REMOVED*** the BASE_xxx constants.
***REMOVED***
***REMOVED*** Throws an Error if the number contains a digit which is outside the range
***REMOVED*** 0 ... base.length - 1.
***REMOVED***
***REMOVED*** @param {Array.<number>} number Array of digit values, least significant
***REMOVED***     first.
***REMOVED*** @param {string} base Digits in the base.
***REMOVED*** @return {string} Number as a string, most significant digit first.
***REMOVED*** @private
***REMOVED***
goog.crypt.baseN.arrayToString_ = function(number, base) {
  var n = number.length;
  var chars = [];
  var baseSize = base.length;
  for (var i = n - 1; i >= 0; i--) {
    var digit = number[i];
    if (digit >= baseSize || digit < 0) {
      throw Error('Number ' + number + ' contains an invalid digit: ' + digit);
    }
    chars.push(base.charAt(digit));
  }
  return chars.join('');
***REMOVED***
