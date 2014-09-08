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
***REMOVED*** @fileoverview Provides a parser that turns a string of well-formed CSV data
***REMOVED*** into an array of objects or an array of arrays. All values are returned as
***REMOVED*** strings; the user has to convert data into numbers or Dates as required.
***REMOVED*** Empty fields (adjacent commas) are returned as empty strings.
***REMOVED***
***REMOVED*** This parser uses http://tools.ietf.org/html/rfc4180 as the definition of CSV.
***REMOVED***
***REMOVED***
goog.provide('goog.labs.format.csv');
goog.provide('goog.labs.format.csv.ParseError');
goog.provide('goog.labs.format.csv.Token');

goog.require('goog.array');
goog.require('goog.asserts');
goog.require('goog.debug.Error');
goog.require('goog.object');
goog.require('goog.string');
goog.require('goog.string.newlines');


***REMOVED***
***REMOVED*** @define {boolean} Enable verbose debugging. This is a flag so it can be
***REMOVED*** enabled in production if necessary post-compilation.  Otherwise, debug
***REMOVED*** information will be stripped to minimize final code size.
***REMOVED***
goog.labs.format.csv.ENABLE_VERBOSE_DEBUGGING = goog.DEBUG;



***REMOVED***
***REMOVED*** Error thrown when parsing fails.
***REMOVED***
***REMOVED*** @param {string} text The CSV source text being parsed.
***REMOVED*** @param {number} index The index, in the string, of the position of the
***REMOVED***      error.
***REMOVED*** @param {string=} opt_message A description of the violated parse expectation.
***REMOVED***
***REMOVED*** @extends {goog.debug.Error}
***REMOVED*** @final
***REMOVED***
goog.labs.format.csv.ParseError = function(text, index, opt_message) {

  var message;

 ***REMOVED*****REMOVED***
  ***REMOVED*** @type {?{line: number, column: number}} The line and column of the parse
  ***REMOVED***     error.
 ***REMOVED*****REMOVED***
  this.position = null;

  if (goog.labs.format.csv.ENABLE_VERBOSE_DEBUGGING) {
    message = opt_message || '';

    var info = goog.labs.format.csv.ParseError.findLineInfo_(text, index);
    if (info) {
      var lineNumber = info.lineIndex + 1;
      var columnNumber = index - info.line.startLineIndex + 1;

      this.position = {
        line: lineNumber,
        column: columnNumber
     ***REMOVED*****REMOVED***

      message += goog.string.subs(' at line %s column %s',
                                  lineNumber, columnNumber);
      message += '\n' + goog.labs.format.csv.ParseError.getLineDebugString_(
          info.line.getContent(), columnNumber);
    }
  }

  goog.labs.format.csv.ParseError.base(this, 'constructor', message);
***REMOVED***
goog.inherits(goog.labs.format.csv.ParseError, goog.debug.Error);


***REMOVED*** @inheritDoc***REMOVED***
goog.labs.format.csv.ParseError.prototype.name = 'ParseError';


***REMOVED***
***REMOVED*** Calculate the line and column for an index in a string.
***REMOVED*** TODO(nnaze): Consider moving to goog.string.newlines.
***REMOVED*** @param {string} str A string.
***REMOVED*** @param {number} index An index into the string.
***REMOVED*** @return {?{line: !goog.string.newlines.Line, lineIndex: number}} The line
***REMOVED***     and index of the line.
***REMOVED*** @private
***REMOVED***
goog.labs.format.csv.ParseError.findLineInfo_ = function(str, index) {
  var lines = goog.string.newlines.getLines(str);
  var lineIndex = goog.array.findIndex(lines, function(line) {
    return line.startLineIndex <= index && line.endLineIndex > index;
  });

  if (goog.isNumber(lineIndex)) {
    var line = lines[lineIndex];
    return {
      line: line,
      lineIndex: lineIndex
   ***REMOVED*****REMOVED***
  }

  return null;
***REMOVED***


***REMOVED***
***REMOVED*** Get a debug string of a line and a pointing caret beneath it.
***REMOVED*** @param {string} str The string.
***REMOVED*** @param {number} column The column to point at (1-indexed).
***REMOVED*** @return {string} The debug line.
***REMOVED*** @private
***REMOVED***
goog.labs.format.csv.ParseError.getLineDebugString_ = function(str, column) {
  var returnString = str + '\n';
  returnString += goog.string.repeat(' ', column - 1) + '^';
  return returnString;
***REMOVED***


***REMOVED***
***REMOVED*** A token -- a single-character string or a sentinel.
***REMOVED*** @typedef {string|!goog.labs.format.csv.Sentinels_}
***REMOVED***
goog.labs.format.csv.Token;


***REMOVED***
***REMOVED*** Parses a CSV string to create a two-dimensional array.
***REMOVED***
***REMOVED*** This function does not process header lines, etc -- such transformations can
***REMOVED*** be made on the resulting array.
***REMOVED***
***REMOVED*** @param {string} text The entire CSV text to be parsed.
***REMOVED*** @param {boolean=} opt_ignoreErrors Whether to ignore parsing errors and
***REMOVED***      instead try to recover and keep going.
***REMOVED*** @return {!Array.<!Array.<string>>} The parsed CSV.
***REMOVED***
goog.labs.format.csv.parse = function(text, opt_ignoreErrors) {

  var index = 0;  // current char offset being considered


  var EOF = goog.labs.format.csv.Sentinels_.EOF;
  var EOR = goog.labs.format.csv.Sentinels_.EOR;
  var NEWLINE = goog.labs.format.csv.Sentinels_.NEWLINE;   // \r?\n
  var EMPTY = goog.labs.format.csv.Sentinels_.EMPTY;

  var pushBackToken = null;   // A single-token pushback.
  var sawComma = false; // Special case for terminal comma.

 ***REMOVED*****REMOVED***
  ***REMOVED*** Push a single token into the push-back variable.
  ***REMOVED*** @param {goog.labs.format.csv.Token} t Single token.
 ***REMOVED*****REMOVED***
  function pushBack(t) {
    goog.labs.format.csv.assertToken_(t);
    goog.asserts.assert(goog.isNull(pushBackToken));
    pushBackToken = t;
  }

 ***REMOVED*****REMOVED***
  ***REMOVED*** @return {goog.labs.format.csv.Token} The next token in the stream.
 ***REMOVED*****REMOVED***
  function nextToken() {

    // Give the push back token if present.
    if (pushBackToken != null) {
      var c = pushBackToken;
      pushBackToken = null;
      return c;
    }

    // We're done. EOF.
    if (index >= text.length) {
      return EOF;
    }

    // Give the next charater.
    var chr = text.charAt(index++);
    goog.labs.format.csv.assertToken_(chr);

    // Check if this is a newline.  If so, give the new line sentinel.
    var isNewline = false;
    if (chr == '\n') {
      isNewline = true;
    } else if (chr == '\r') {

      // This is a '\r\n' newline. Treat as single token, go
      // forward two indicies.
      if (index < text.length && text.charAt(index) == '\n') {
        index++;
      }

      isNewline = true;
    }

    if (isNewline) {
      return NEWLINE;
    }

    return chr;
  }

 ***REMOVED*****REMOVED***
  ***REMOVED*** Read a quoted field from input.
  ***REMOVED*** @return {string} The field, as a string.
 ***REMOVED*****REMOVED***
  function readQuotedField() {
    // We've already consumed the first quote by the time we get here.
    var start = index;
    var end = null;

    for (var token = nextToken(); token != EOF; token = nextToken()) {
      if (token == '"') {
        end = index - 1;
        token = nextToken();

        // Two double quotes in a row.  Keep scanning.
        if (token == '"') {
          end = null;
          continue;
        }

        // End of field.  Break out.
        if (token == ',' || token == EOF || token == NEWLINE) {
          if (token == NEWLINE) {
            pushBack(token);
          }
          break;
        }

        if (!opt_ignoreErrors) {
          // Ignoring errors here means keep going in current field after
          // closing quote. E.g. "ab"c,d splits into abc,d
          throw new goog.labs.format.csv.ParseError(
              text, index - 1,
              'Unexpected character "' + token + '" after quote mark');
        } else {
          // Fall back to reading the rest of this field as unquoted.
          // Note: the rest is guaranteed not start with ", as that case is
          // eliminated above.
          var prefix = '"' + text.substring(start, index);
          var suffix = readField();
          if (suffix == EOR) {
            pushBack(NEWLINE);
            return prefix;
          } else {
            return prefix + suffix;
          }
        }
      }
    }

    if (goog.isNull(end)) {
      if (!opt_ignoreErrors) {
        throw new goog.labs.format.csv.ParseError(
            text, text.length - 1,
            'Unexpected end of text after open quote');
      } else {
        end = text.length;
      }
    }

    // Take substring, combine double quotes.
    return text.substring(start, end).replace(/""/g, '"');
  }

 ***REMOVED*****REMOVED***
  ***REMOVED*** Read a field from input.
  ***REMOVED*** @return {string|!goog.labs.format.csv.Sentinels_} The field, as a string,
  ***REMOVED***     or a sentinel (if applicable).
 ***REMOVED*****REMOVED***
  function readField() {
    var start = index;
    var didSeeComma = sawComma;
    sawComma = false;
    var token = nextToken();
    if (token == EMPTY) {
      return EOR;
    }
    if (token == EOF || token == NEWLINE) {
      if (didSeeComma) {
        pushBack(EMPTY);
        return '';
      }
      return EOR;
    }

    // This is the beginning of a quoted field.
    if (token == '"') {
      return readQuotedField();
    }

    while (true) {

      // This is the end of line or file.
      if (token == EOF || token == NEWLINE) {
        pushBack(token);
        break;
      }

      // This is the end of record.
      if (token == ',') {
        sawComma = true;
        break;
      }

      if (token == '"' && !opt_ignoreErrors) {
        throw new goog.labs.format.csv.ParseError(text, index - 1,
                                                  'Unexpected quote mark');
      }

      token = nextToken();
    }


    var returnString = (token == EOF) ?
        text.substring(start) :  // Return to end of file.
        text.substring(start, index - 1);

    return returnString.replace(/[\r\n]+/g, ''); // Squash any CRLFs.
  }

 ***REMOVED*****REMOVED***
  ***REMOVED*** Read the next record.
  ***REMOVED*** @return {!Array.<string>|!goog.labs.format.csv.Sentinels_} A single record
  ***REMOVED***     with multiple fields.
 ***REMOVED*****REMOVED***
  function readRecord() {
    if (index >= text.length) {
      return EOF;
    }
    var record = [];
    for (var field = readField(); field != EOR; field = readField()) {
      record.push(field);
    }
    return record;
  }

  // Read all records and return.
  var records = [];
  for (var record = readRecord(); record != EOF; record = readRecord()) {
    records.push(record);
  }
  return records;
***REMOVED***


***REMOVED***
***REMOVED*** Sentinel tracking objects.
***REMOVED*** @enum {Object}
***REMOVED*** @private
***REMOVED***
goog.labs.format.csv.Sentinels_ = {
 ***REMOVED*****REMOVED*** Empty field***REMOVED***
  EMPTY: {},

 ***REMOVED*****REMOVED*** End of file***REMOVED***
  EOF: {},

 ***REMOVED*****REMOVED*** End of record***REMOVED***
  EOR: {},

 ***REMOVED*****REMOVED*** Newline. \r?\n***REMOVED***
  NEWLINE: {}
***REMOVED***


***REMOVED***
***REMOVED*** @param {string} str A string.
***REMOVED*** @return {boolean} Whether the string is a single character.
***REMOVED*** @private
***REMOVED***
goog.labs.format.csv.isCharacterString_ = function(str) {
  return goog.isString(str) && str.length == 1;
***REMOVED***


***REMOVED***
***REMOVED*** Assert the parameter is a token.
***REMOVED*** @param {*} o What should be a token.
***REMOVED*** @throws {goog.asserts.AssertionError} If {@ code} is not a token.
***REMOVED*** @private
***REMOVED***
goog.labs.format.csv.assertToken_ = function(o) {
  if (goog.isString(o)) {
    goog.asserts.assertString(o);
    goog.asserts.assert(goog.labs.format.csv.isCharacterString_(o),
        'Should be a string of length 1 or a sentinel.');
  } else {
    goog.asserts.assert(
        goog.object.containsValue(goog.labs.format.csv.Sentinels_, o),
        'Should be a string of length 1 or a sentinel.');
  }
***REMOVED***



