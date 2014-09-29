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
***REMOVED*** @fileoverview The decompressor for Base88 compressed character lists.
***REMOVED***
***REMOVED*** The compression is by base 88 encoding the delta between two adjacent
***REMOVED*** characters in ths list. The deltas can be positive or negative. Also, there
***REMOVED*** would be character ranges. These three types of values
***REMOVED*** are given enum values 0, 1 and 2 respectively. Initial 3 bits are used for
***REMOVED*** encoding the type and total length of the encoded value. Length enums 0, 1
***REMOVED*** and 2 represents lengths 1, 2 and 4. So (value***REMOVED*** 8 + type***REMOVED*** 3 + length enum)
***REMOVED*** is encoded in base 88 by following characters for numbers from 0 to 87:
***REMOVED*** 0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ (continued in next line)
***REMOVED*** abcdefghijklmnopqrstuvwxyz!#$%()*+,-.:;<=>?@[]^_`{|}~
***REMOVED***
***REMOVED*** Value uses 0 based counting. That is value for the range [a, b] is 0 and
***REMOVED*** that of [a, c] is 1. Simillarly, the delta of "ab" is 0.
***REMOVED***
***REMOVED*** Following python script can be used to compress character lists taken
***REMOVED*** standard input: http://go/charlistcompressor.py
***REMOVED***
***REMOVED***

goog.provide('goog.i18n.CharListDecompressor');

goog.require('goog.array');
goog.require('goog.i18n.uChar');



***REMOVED***
***REMOVED*** Class to decompress base88 compressed character list.
***REMOVED***
***REMOVED***
goog.i18n.CharListDecompressor = function() {
  this.buildCharMap_('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqr' +
      'stuvwxyz!#$%()*+,-.:;<=>?@[]^_`{|}~');
***REMOVED***


***REMOVED***
***REMOVED*** 1-1 mapping from ascii characters used in encoding to an integer in the
***REMOVED*** range 0 to 87.
***REMOVED*** @type {Object}
***REMOVED*** @private
***REMOVED***
goog.i18n.CharListDecompressor.prototype.charMap_ = null;


***REMOVED***
***REMOVED*** Builds the map from ascii characters used for the base88 scheme to number
***REMOVED*** each character represents.
***REMOVED*** @param {string} str The string of characters used in base88 scheme.
***REMOVED*** @private
***REMOVED***
goog.i18n.CharListDecompressor.prototype.buildCharMap_ = function(str) {
  if (!this.charMap_) {
    this.charMap_ = {***REMOVED***
    for (var i = 0; i < str.length; i++) {
      this.charMap_[str.charAt(i)] = i;
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** Gets the number encoded in base88 scheme by a substring of given length
***REMOVED*** and placed at the a given position of the string.
***REMOVED*** @param {string} str String containing sequence of characters encoding a
***REMOVED***     number in base 88 scheme.
***REMOVED*** @param {number} start Starting position of substring encoding the number.
***REMOVED*** @param {number} leng Length of the substring encoding the number.
***REMOVED*** @return {number} The encoded number.
***REMOVED*** @private
***REMOVED***
goog.i18n.CharListDecompressor.prototype.getCodeAt_ = function(str, start,
    leng) {
  var result = 0;
  for (var i = 0; i < leng; i++) {
    var c = this.charMap_[str.charAt(start + i)];
    result += c***REMOVED*** Math.pow(88, i);
  }
  return result;
***REMOVED***


***REMOVED***
***REMOVED*** Add character(s) specified by the value and type to given list and return
***REMOVED*** the next character in the sequence.
***REMOVED*** @param {Array.<string>} list The list of characters to which the specified
***REMOVED***     characters are appended.
***REMOVED*** @param {number} lastcode The last codepoint that was added to the list.
***REMOVED*** @param {number} value The value component that representing the delta or
***REMOVED***      range.
***REMOVED*** @param {number} type The type component that representing whether the value
***REMOVED***      is a positive or negative delta or range.
***REMOVED*** @return {number} Last codepoint that is added to the list.
***REMOVED*** @private
***REMOVED***
goog.i18n.CharListDecompressor.prototype.addChars_ = function(list, lastcode,
    value, type) {
   if (type == 0) {
     lastcode += value + 1;
     goog.array.extend(list, goog.i18n.uChar.fromCharCode(lastcode));
   } else if (type == 1) {
     lastcode -= value + 1;
     goog.array.extend(list, goog.i18n.uChar.fromCharCode(lastcode));
   } else if (type == 2) {
     for (var i = 0; i <= value; i++) {
       lastcode++;
       goog.array.extend(list, goog.i18n.uChar.fromCharCode(lastcode));
     }
   }
  return lastcode;
***REMOVED***


***REMOVED***
***REMOVED*** Gets the list of characters specified in the given string by base 88 scheme.
***REMOVED*** @param {string} str The string encoding character list.
***REMOVED*** @return {Array.<string>} The list of characters specified by the given string
***REMOVED***     in base 88 scheme.
***REMOVED***
goog.i18n.CharListDecompressor.prototype.toCharList = function(str) {
  var metasize = 8;
  var result = [];
  var lastcode = 0;
  var i = 0;
  while (i < str.length) {
    var c = this.charMap_[str.charAt(i)];
    var meta = c % metasize;
    var type = Math.floor(meta / 3);
    var leng = (meta % 3) + 1;
    if (leng == 3) {
      leng++;
    }
    var code = this.getCodeAt_(str, i, leng);
    var value = Math.floor(code / metasize);
    lastcode = this.addChars_(result, lastcode, value, type);

    i += leng;
  }
  return result;
***REMOVED***

