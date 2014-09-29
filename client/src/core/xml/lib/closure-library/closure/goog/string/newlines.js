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
***REMOVED*** @fileoverview Utilities for string newlines.
***REMOVED*** @author nnaze@google.com (Nathan Naze)
***REMOVED***


***REMOVED***
***REMOVED*** Namespace for string utilities
***REMOVED***
goog.provide('goog.string.newlines');

goog.require('goog.array');


***REMOVED***
***REMOVED*** Splits a string into lines, properly handling universal newlines.
***REMOVED*** @param {string} str String to split.
***REMOVED*** @param {boolean=} opt_keepNewlines Whether to keep the newlines in the
***REMOVED***     resulting strings. Defaults to false.
***REMOVED*** @return {!Array.<string>} String split into lines.
***REMOVED***
goog.string.newlines.splitLines = function(str, opt_keepNewlines) {
  var lines = goog.string.newlines.getLines(str);
  return goog.array.map(lines, function(line) {
    return opt_keepNewlines ? line.getFullLine() : line.getContent();
  });
***REMOVED***



***REMOVED***
***REMOVED*** Line metadata class that records the start/end indicies of lines
***REMOVED*** in a string.  Can be used to implement common newline use cases such as
***REMOVED*** splitLines() or determining line/column of an index in a string.
***REMOVED*** Also implements methods to get line contents.
***REMOVED***
***REMOVED*** Indexes are expressed as string indicies into string.substring(), inclusive
***REMOVED*** at the start, exclusive at the end.
***REMOVED***
***REMOVED*** Create an array of these with goog.string.newlines.getLines().
***REMOVED*** @param {string} string The original string.
***REMOVED*** @param {number} startLineIndex The index of the start of the line.
***REMOVED*** @param {number} endContentIndex The index of the end of the line, excluding
***REMOVED***     newlines.
***REMOVED*** @param {number} endLineIndex The index of the end of the line, index
***REMOVED***     newlines.
***REMOVED***
***REMOVED*** @struct
***REMOVED***
goog.string.newlines.Line = function(string, startLineIndex,
                                     endContentIndex, endLineIndex) {
 ***REMOVED*****REMOVED***
  ***REMOVED*** The original string.
  ***REMOVED*** @type {string}
 ***REMOVED*****REMOVED***
  this.string = string;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Index of the start of the line.
  ***REMOVED*** @type {number}
 ***REMOVED*****REMOVED***
  this.startLineIndex = startLineIndex;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Index of the end of the line, excluding any newline characters.
  ***REMOVED*** Index is the first character after the line, suitable for
  ***REMOVED*** String.substring().
  ***REMOVED*** @type {number}
 ***REMOVED*****REMOVED***
  this.endContentIndex = endContentIndex;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Index of the end of the line, excluding any newline characters.
  ***REMOVED*** Index is the first character after the line, suitable for
  ***REMOVED*** String.substring().
  ***REMOVED*** @type {number}
 ***REMOVED*****REMOVED***

  this.endLineIndex = endLineIndex;
***REMOVED***


***REMOVED***
***REMOVED*** @return {string} The content of the line, excluding any newline characters.
***REMOVED***
goog.string.newlines.Line.prototype.getContent = function() {
  return this.string.substring(this.startLineIndex, this.endContentIndex);
***REMOVED***


***REMOVED***
***REMOVED*** @return {string} The full line, including any newline characters.
***REMOVED***
goog.string.newlines.Line.prototype.getFullLine = function() {
  return this.string.substring(this.startLineIndex, this.endLineIndex);
***REMOVED***


***REMOVED***
***REMOVED*** @return {string} The newline characters, if any ('\n', \r', '\r\n', '', etc).
***REMOVED***
goog.string.newlines.Line.prototype.getNewline = function() {
  return this.string.substring(this.endContentIndex, this.endLineIndex);
***REMOVED***


***REMOVED***
***REMOVED*** Splits a string into an array of line metadata.
***REMOVED*** @param {string} str String to split.
***REMOVED*** @return {!Array.<!goog.string.newlines.Line>} Array of line metadata.
***REMOVED***
goog.string.newlines.getLines = function(str) {
  // We use the constructor because literals are evaluated only once in
  // < ES 3.1.
  // See http://www.mail-archive.com/es-discuss@mozilla.org/msg01796.html
  var re = RegExp('\r\n|\r|\n', 'g');
  var sliceIndex = 0;
  var result;
  var lines = [];

  while (result = re.exec(str)) {
    var line = new goog.string.newlines.Line(
        str, sliceIndex, result.index, result.index + result[0].length);
    lines.push(line);

    // remember where to start the slice from
    sliceIndex = re.lastIndex;
  }

  // If the string does not end with a newline, add the last line.
  if (sliceIndex < str.length) {
    var line = new goog.string.newlines.Line(
        str, sliceIndex, str.length, str.length);
    lines.push(line);
  }

  return lines;
***REMOVED***
