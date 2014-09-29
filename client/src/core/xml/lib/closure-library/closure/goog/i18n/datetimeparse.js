// Copyright 2006 The Closure Library Authors. All Rights Reserved.
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
***REMOVED*** @fileoverview Date/Time parsing library with locale support.
***REMOVED***


***REMOVED***
***REMOVED*** Namespace for locale date/time parsing functions
***REMOVED***
goog.provide('goog.i18n.DateTimeParse');

goog.require('goog.date.DateLike');
goog.require('goog.i18n.DateTimeFormat');
goog.require('goog.i18n.DateTimeSymbols');


***REMOVED***
***REMOVED*** DateTimeParse is for parsing date in a locale-sensitive manner. It allows
***REMOVED*** user to use any customized patterns to parse date-time string under certain
***REMOVED*** locale. Things varies across locales like month name, weekname, field
***REMOVED*** order, etc.
***REMOVED***
***REMOVED*** This module is the counter-part of DateTimeFormat. They use the same
***REMOVED*** date/time pattern specification, which is borrowed from ICU/JDK.
***REMOVED***
***REMOVED*** This implementation could parse partial date/time.
***REMOVED***
***REMOVED*** Time Format Syntax: To specify the time format use a time pattern string.
***REMOVED*** In this pattern, following letters are reserved as pattern letters, which
***REMOVED*** are defined as the following:
***REMOVED***
***REMOVED*** <pre>
***REMOVED*** Symbol   Meaning                 Presentation        Example
***REMOVED*** ------   -------                 ------------        -------
***REMOVED*** G        era designator          (Text)              AD
***REMOVED*** y#       year                    (Number)            1996
***REMOVED*** M        month in year           (Text & Number)     July & 07
***REMOVED*** d        day in month            (Number)            10
***REMOVED*** h        hour in am/pm (1~12)    (Number)            12
***REMOVED*** H        hour in day (0~23)      (Number)            0
***REMOVED*** m        minute in hour          (Number)            30
***REMOVED*** s        second in minute        (Number)            55
***REMOVED*** S        fractional second       (Number)            978
***REMOVED*** E        day of week             (Text)              Tuesday
***REMOVED*** D        day in year             (Number)            189
***REMOVED*** a        am/pm marker            (Text)              PM
***REMOVED*** k        hour in day (1~24)      (Number)            24
***REMOVED*** K        hour in am/pm (0~11)    (Number)            0
***REMOVED*** z        time zone               (Text)              Pacific Standard Time
***REMOVED*** Z        time zone (RFC 822)     (Number)            -0800
***REMOVED*** v        time zone (generic)     (Text)              Pacific Time
***REMOVED*** '        escape for text         (Delimiter)         'Date='
***REMOVED*** ''       single quote            (Literal)           'o''clock'
***REMOVED*** </pre>
***REMOVED***
***REMOVED*** The count of pattern letters determine the format. <p>
***REMOVED*** (Text): 4 or more pattern letters--use full form,
***REMOVED***         less than 4--use short or abbreviated form if one exists.
***REMOVED***         In parsing, we will always try long format, then short. <p>
***REMOVED*** (Number): the minimum number of digits. <p>
***REMOVED*** (Text & Number): 3 or over, use text, otherwise use number. <p>
***REMOVED*** Any characters that not in the pattern will be treated as quoted text. For
***REMOVED*** instance, characters like ':', '.', ' ', '#' and '@' will appear in the
***REMOVED*** resulting time text even they are not embraced within single quotes. In our
***REMOVED*** current pattern usage, we didn't use up all letters. But those unused
***REMOVED*** letters are strongly discouraged to be used as quoted text without quote.
***REMOVED*** That's because we may use other letter for pattern in future. <p>
***REMOVED***
***REMOVED*** Examples Using the US Locale:
***REMOVED***
***REMOVED*** Format Pattern                         Result
***REMOVED*** --------------                         -------
***REMOVED*** "yyyy.MM.dd G 'at' HH:mm:ss vvvv" ->>  1996.07.10 AD at 15:08:56 Pacific Time
***REMOVED*** "EEE, MMM d, ''yy"                ->>  Wed, July 10, '96
***REMOVED*** "h:mm a"                          ->>  12:08 PM
***REMOVED*** "hh 'o''clock' a, zzzz"           ->>  12 o'clock PM, Pacific Daylight Time
***REMOVED*** "K:mm a, vvv"                     ->>  0:00 PM, PT
***REMOVED*** "yyyyy.MMMMM.dd GGG hh:mm aaa"    ->>  01996.July.10 AD 12:08 PM
***REMOVED***
***REMOVED*** <p> When parsing a date string using the abbreviated year pattern ("yy"),
***REMOVED*** DateTimeParse must interpret the abbreviated year relative to some
***REMOVED*** century. It does this by adjusting dates to be within 80 years before and 20
***REMOVED*** years after the time the parse function is called. For example, using a
***REMOVED*** pattern of "MM/dd/yy" and a DateTimeParse instance created on Jan 1, 1997,
***REMOVED*** the string "01/11/12" would be interpreted as Jan 11, 2012 while the string
***REMOVED*** "05/04/64" would be interpreted as May 4, 1964. During parsing, only
***REMOVED*** strings consisting of exactly two digits, as defined by {@link
***REMOVED*** java.lang.Character#isDigit(char)}, will be parsed into the default
***REMOVED*** century. Any other numeric string, such as a one digit string, a three or
***REMOVED*** more digit string will be interpreted as its face value.
***REMOVED***
***REMOVED*** <p> If the year pattern does not have exactly two 'y' characters, the year is
***REMOVED*** interpreted literally, regardless of the number of digits. So using the
***REMOVED*** pattern "MM/dd/yyyy", "01/11/12" parses to Jan 11, 12 A.D.
***REMOVED***
***REMOVED*** <p> When numeric fields abut one another directly, with no intervening
***REMOVED*** delimiter characters, they constitute a run of abutting numeric fields. Such
***REMOVED*** runs are parsed specially. For example, the format "HHmmss" parses the input
***REMOVED*** text "123456" to 12:34:56, parses the input text "12345" to 1:23:45, and
***REMOVED*** fails to parse "1234". In other words, the leftmost field of the run is
***REMOVED*** flexible, while the others keep a fixed width. If the parse fails anywhere in
***REMOVED*** the run, then the leftmost field is shortened by one character, and the
***REMOVED*** entire run is parsed again. This is repeated until either the parse succeeds
***REMOVED*** or the leftmost field is one character in length. If the parse still fails at
***REMOVED*** that point, the parse of the run fails.
***REMOVED***
***REMOVED*** <p> Now timezone parsing only support GMT:hhmm, GMT:+hhmm, GMT:-hhmm
***REMOVED***



***REMOVED***
***REMOVED*** Construct a DateTimeParse based on current locale.
***REMOVED*** @param {string|number} pattern pattern specification or pattern type.
***REMOVED***
***REMOVED***
goog.i18n.DateTimeParse = function(pattern) {
  this.patternParts_ = [];
  if (typeof pattern == 'number') {
    this.applyStandardPattern_(pattern);
  } else {
    this.applyPattern_(pattern);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Number of years prior to now that the century used to
***REMOVED*** disambiguate two digit years will begin
***REMOVED***
***REMOVED*** @type {number}
***REMOVED***
goog.i18n.DateTimeParse.ambiguousYearCenturyStart = 80;


***REMOVED***
***REMOVED*** Apply a pattern to this Parser. The pattern string will be parsed and saved
***REMOVED*** in "compiled" form.
***REMOVED*** Note: this method is somewhat similar to the pattern parsing methold in
***REMOVED***       datetimeformat. If you see something wrong here, you might want
***REMOVED***       to check the other.
***REMOVED*** @param {string} pattern It describes the format of date string that need to
***REMOVED***     be parsed.
***REMOVED*** @private
***REMOVED***
goog.i18n.DateTimeParse.prototype.applyPattern_ = function(pattern) {
  var inQuote = false;
  var buf = '';

  for (var i = 0; i < pattern.length; i++) {
    var ch = pattern.charAt(i);

    // handle space, add literal part (if exist), and add space part
    if (ch == ' ') {
      if (buf.length > 0) {
        this.patternParts_.push({text: buf, count: 0, abutStart: false});
        buf = '';
      }
      this.patternParts_.push({text: ' ', count: 0, abutStart: false});
      while (i < pattern.length - 1 && pattern.charAt(i + 1) == ' ') {
        i++;
      }
    } else if (inQuote) {
      // inside quote, except '', just copy or exit
      if (ch == '\'') {
        if (i + 1 < pattern.length && pattern.charAt(i + 1) == '\'') {
          // quote appeared twice continuously, interpret as one quote.
          buf += '\'';
          i++;
        } else {
          // exit quote
          inQuote = false;
        }
      } else {
        // literal
        buf += ch;
      }
    } else if (goog.i18n.DateTimeParse.PATTERN_CHARS_.indexOf(ch) >= 0) {
      // outside quote, it is a pattern char
      if (buf.length > 0) {
        this.patternParts_.push({text: buf, count: 0, abutStart: false});
        buf = '';
      }
      var count = this.getNextCharCount_(pattern, i);
      this.patternParts_.push({text: ch, count: count, abutStart: false});
      i += count - 1;
    } else if (ch == '\'') {
      // Two consecutive quotes is a quote literal, inside or outside of quotes.
      if (i + 1 < pattern.length && pattern.charAt(i + 1) == '\'') {
        buf += '\'';
        i++;
      } else {
        inQuote = true;
      }
    } else {
      buf += ch;
    }
  }

  if (buf.length > 0) {
    this.patternParts_.push({text: buf, count: 0, abutStart: false});
  }

  this.markAbutStart_();
***REMOVED***


***REMOVED***
***REMOVED*** Apply a predefined pattern to this Parser.
***REMOVED*** @param {number} formatType A constant used to identified the predefined
***REMOVED***     pattern string stored in locale repository.
***REMOVED*** @private
***REMOVED***
goog.i18n.DateTimeParse.prototype.applyStandardPattern_ = function(formatType) {
  var pattern;
  // formatType constants are in consecutive numbers. So it can be used to
  // index array in following way.

  // if type is out of range, default to medium date/time format.
  if (formatType > goog.i18n.DateTimeFormat.Format.SHORT_DATETIME) {
    formatType = goog.i18n.DateTimeFormat.Format.MEDIUM_DATETIME;
  }

  if (formatType < 4) {
    pattern = goog.i18n.DateTimeSymbols.DATEFORMATS[formatType];
  } else if (formatType < 8) {
    pattern = goog.i18n.DateTimeSymbols.TIMEFORMATS[formatType - 4];
  } else {
    pattern = goog.i18n.DateTimeSymbols.DATEFORMATS[formatType - 8] +
              ' ' + goog.i18n.DateTimeSymbols.TIMEFORMATS[formatType - 8];
  }
  this.applyPattern_(pattern);
***REMOVED***


***REMOVED***
***REMOVED*** Parse the given string and fill info into date object. This version does
***REMOVED*** not validate the input.
***REMOVED*** @param {string} text The string being parsed.
***REMOVED*** @param {goog.date.DateLike} date The Date object to hold the parsed date.
***REMOVED*** @param {number=} opt_start The position from where parse should begin.
***REMOVED*** @return {number} How many characters parser advanced.
***REMOVED***
goog.i18n.DateTimeParse.prototype.parse = function(text, date, opt_start) {
  var start = opt_start || 0;
  return this.internalParse_(text, date, start, false/*validation*/);
***REMOVED***


***REMOVED***
***REMOVED*** Parse the given string and fill info into date object. This version will
***REMOVED*** validate the input and make sure it is a validate date/time.
***REMOVED*** @param {string} text The string being parsed.
***REMOVED*** @param {goog.date.DateLike} date The Date object to hold the parsed date.
***REMOVED*** @param {number=} opt_start The position from where parse should begin.
***REMOVED*** @return {number} How many characters parser advanced.
***REMOVED***
goog.i18n.DateTimeParse.prototype.strictParse =
    function(text, date, opt_start) {
  var start = opt_start || 0;
  return this.internalParse_(text, date, start, true/*validation*/);
***REMOVED***


***REMOVED***
***REMOVED*** Parse the given string and fill info into date object.
***REMOVED*** @param {string} text The string being parsed.
***REMOVED*** @param {goog.date.DateLike} date The Date object to hold the parsed date.
***REMOVED*** @param {number} start The position from where parse should begin.
***REMOVED*** @param {boolean} validation If true, input string need to be a valid
***REMOVED***     date/time string.
***REMOVED*** @return {number} How many characters parser advanced.
***REMOVED*** @private
***REMOVED***
goog.i18n.DateTimeParse.prototype.internalParse_ =
    function(text, date, start, validation) {
  var cal = new goog.i18n.DateTimeParse.MyDate_();
  var parsePos = [start];

  // For parsing abutting numeric fields. 'abutPat' is the
  // offset into 'pattern' of the first of 2 or more abutting
  // numeric fields. 'abutStart' is the offset into 'text'
  // where parsing the fields begins. 'abutPass' starts off as 0
  // and increments each time we try to parse the fields.
  var abutPat = -1; // If >=0, we are in a run of abutting numeric fields
  var abutStart = 0;
  var abutPass = 0;

  for (var i = 0; i < this.patternParts_.length; i++) {
    if (this.patternParts_[i].count > 0) {
      if (abutPat < 0 && this.patternParts_[i].abutStart) {
        abutPat = i;
        abutStart = start;
        abutPass = 0;
      }

      // Handle fields within a run of abutting numeric fields. Take
      // the pattern "HHmmss" as an example. We will try to parse
      // 2/2/2 characters of the input text, then if that fails,
      // 1/2/2. We only adjust the width of the leftmost field; the
      // others remain fixed. This allows "123456" => 12:34:56, but
      // "12345" => 1:23:45. Likewise, for the pattern "yyyyMMdd" we
      // try 4/2/2, 3/2/2, 2/2/2, and finally 1/2/2.
      if (abutPat >= 0) {
        // If we are at the start of a run of abutting fields, then
        // shorten this field in each pass. If we can't shorten
        // this field any more, then the parse of this set of
        // abutting numeric fields has failed.
        var count = this.patternParts_[i].count;
        if (i == abutPat) {
          count -= abutPass;
          abutPass++;
          if (count == 0) {
            // tried all possible width, fail now
            return 0;
          }
        }

        if (!this.subParse_(text, parsePos, this.patternParts_[i], count,
                            cal)) {
          // If the parse fails anywhere in the run, back up to the
          // start of the run and retry.
          i = abutPat - 1;
          parsePos[0] = abutStart;
          continue;
        }
      }

      // Handle non-numeric fields and non-abutting numeric fields.
      else {
        abutPat = -1;
        if (!this.subParse_(text, parsePos, this.patternParts_[i], 0, cal)) {
          return 0;
        }
      }
    } else {
      // Handle literal pattern characters. These are any
      // quoted characters and non-alphabetic unquoted
      // characters.
      abutPat = -1;
      // A run of white space in the pattern matches a run
      // of white space in the input text.
      if (this.patternParts_[i].text.charAt(0) == ' ') {
        // Advance over run in input text
        var s = parsePos[0];
        this.skipSpace_(text, parsePos);

        // Must see at least one white space char in input
        if (parsePos[0] > s) {
          continue;
        }
      } else if (text.indexOf(this.patternParts_[i].text, parsePos[0]) ==
                 parsePos[0]) {
        parsePos[0] += this.patternParts_[i].text.length;
        continue;
      }
      // We fall through to this point if the match fails
      return 0;
    }
  }

  // return progress
  return cal.calcDate_(date, validation) ? parsePos[0] - start : 0;
***REMOVED***


***REMOVED***
***REMOVED*** Calculate character repeat count in pattern.
***REMOVED***
***REMOVED*** @param {string} pattern It describes the format of date string that need to
***REMOVED***     be parsed.
***REMOVED*** @param {number} start The position of pattern character.
***REMOVED***
***REMOVED*** @return {number} Repeat count.
***REMOVED*** @private
***REMOVED***
goog.i18n.DateTimeParse.prototype.getNextCharCount_ =
    function(pattern, start) {
  var ch = pattern.charAt(start);
  var next = start + 1;
  while (next < pattern.length && pattern.charAt(next) == ch) {
    next++;
  }
  return next - start;
***REMOVED***


***REMOVED***
***REMOVED*** All acceptable pattern characters.
***REMOVED*** @private
***REMOVED***
goog.i18n.DateTimeParse.PATTERN_CHARS_ = 'GyMdkHmsSEDahKzZvQ';


***REMOVED***
***REMOVED*** Pattern characters that specify numerical field.
***REMOVED*** @private
***REMOVED***
goog.i18n.DateTimeParse.NUMERIC_FORMAT_CHARS_ = 'MydhHmsSDkK';


***REMOVED***
***REMOVED*** Check if the pattern part is a numeric field.
***REMOVED***
***REMOVED*** @param {Object} part pattern part to be examined.
***REMOVED***
***REMOVED*** @return {boolean} true if the pattern part is numberic field.
***REMOVED*** @private
***REMOVED***
goog.i18n.DateTimeParse.prototype.isNumericField_ = function(part) {
  if (part.count <= 0) {
    return false;
  }
  var i = goog.i18n.DateTimeParse.NUMERIC_FORMAT_CHARS_.indexOf(
      part.text.charAt(0));
  return i > 0 || i == 0 && part.count < 3;
***REMOVED***


***REMOVED***
***REMOVED*** Identify the start of an abutting numeric fields' run. Taking pattern
***REMOVED*** "HHmmss" as an example. It will try to parse 2/2/2 characters of the input
***REMOVED*** text, then if that fails, 1/2/2. We only adjust the width of the leftmost
***REMOVED*** field; the others remain fixed. This allows "123456" => 12:34:56, but
***REMOVED*** "12345" => 1:23:45. Likewise, for the pattern "yyyyMMdd" we try 4/2/2,
***REMOVED*** 3/2/2, 2/2/2, and finally 1/2/2. The first field of connected numeric
***REMOVED*** fields will be marked as abutStart, its width can be reduced to accomodate
***REMOVED*** others.
***REMOVED***
***REMOVED*** @private
***REMOVED***
goog.i18n.DateTimeParse.prototype.markAbutStart_ = function() {
  // abut parts are continuous numeric parts. abutStart is the switch
  // point from non-abut to abut
  var abut = false;

  for (var i = 0; i < this.patternParts_.length; i++) {
    if (this.isNumericField_(this.patternParts_[i])) {
      // if next part is not following abut sequence, and isNumericField_
      if (!abut && i + 1 < this.patternParts_.length &&
          this.isNumericField_(this.patternParts_[i + 1])) {
        abut = true;
        this.patternParts_[i].abutStart = true;
      }
    } else {
      abut = false;
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** Skip space in the string.
***REMOVED***
***REMOVED*** @param {string} text input string.
***REMOVED*** @param {Array.<number>} pos where skip start, and return back where the skip
***REMOVED***     stops.
***REMOVED*** @private
***REMOVED***
goog.i18n.DateTimeParse.prototype.skipSpace_ = function(text, pos) {
  var m = text.substring(pos[0]).match(/^\s+/);
  if (m) {
    pos[0] += m[0].length;
  }
***REMOVED***


***REMOVED***
***REMOVED*** Protected method that converts one field of the input string into a
***REMOVED*** numeric field value.
***REMOVED***
***REMOVED*** @param {string} text the time text to be parsed.
***REMOVED*** @param {Array.<number>} pos Parse position.
***REMOVED*** @param {Object} part the pattern part for this field.
***REMOVED*** @param {number} digitCount when > 0, numeric parsing must obey the count.
***REMOVED*** @param {goog.i18n.DateTimeParse.MyDate_} cal object that holds parsed value.
***REMOVED***
***REMOVED*** @return {boolean} True if it parses successfully.
***REMOVED*** @private
***REMOVED***
goog.i18n.DateTimeParse.prototype.subParse_ =
    function(text, pos, part, digitCount, cal) {
  this.skipSpace_(text, pos);

  var start = pos[0];
  var ch = part.text.charAt(0);

  // parse integer value if it is a numeric field
  var value = -1;
  if (this.isNumericField_(part)) {
    if (digitCount > 0) {
      if ((start + digitCount) > text.length) {
        return false;
      }
      value = this.parseInt_(
          text.substring(0, start + digitCount), pos);
    } else {
      value = this.parseInt_(text, pos);
    }
  }

  switch (ch) {
    case 'G': // ERA
      cal.era = this.matchString_(text, pos, goog.i18n.DateTimeSymbols.ERAS);
      return true;
    case 'M': // MONTH
      return this.subParseMonth_(text, pos, cal, value);
    case 'E':
      return this.subParseDayOfWeek_(text, pos, cal);
    case 'a': // AM_PM
      cal.ampm = this.matchString_(text, pos, goog.i18n.DateTimeSymbols.AMPMS);
      return true;
    case 'y': // YEAR
      return this.subParseYear_(text, pos, start, value, part, cal);
    case 'Q': // QUARTER
      return this.subParseQuarter_(text, pos, cal, value);
    case 'd': // DATE
      cal.day = value;
      return true;
    case 'S': // FRACTIONAL_SECOND
      return this.subParseFractionalSeconds_(value, pos, start, cal);
    case 'h': // HOUR (1..12)
      if (value == 12) {
        value = 0;
      }
    case 'K': // HOUR (0..11)
    case 'H': // HOUR_OF_DAY (0..23)
    case 'k': // HOUR_OF_DAY (1..24)
      cal.hours = value;
      return true;
    case 'm': // MINUTE
      cal.minutes = value;
      return true;
    case 's': // SECOND
      cal.seconds = value;
      return true;

    case 'z': // ZONE_OFFSET
    case 'Z': // TIMEZONE_RFC
    case 'v': // TIMEZONE_GENERIC
      return this.subparseTimeZoneInGMT_(text, pos, cal);
    default:
      return false;
  }
***REMOVED***


***REMOVED***
***REMOVED*** Parse year field. Year field is special because
***REMOVED*** 1) two digit year need to be resolved.
***REMOVED*** 2) we allow year to take a sign.
***REMOVED*** 3) year field participate in abut processing.
***REMOVED***
***REMOVED*** @param {string} text the time text to be parsed.
***REMOVED*** @param {Array.<number>} pos Parse position.
***REMOVED*** @param {number} start where this field start.
***REMOVED*** @param {number} value integer value of year.
***REMOVED*** @param {Object} part the pattern part for this field.
***REMOVED*** @param {goog.i18n.DateTimeParse.MyDate_} cal object to hold parsed value.
***REMOVED***
***REMOVED*** @return {boolean} True if successful.
***REMOVED*** @private
***REMOVED***
goog.i18n.DateTimeParse.prototype.subParseYear_ =
    function(text, pos, start, value, part, cal) {
  var ch;
  if (value < 0) {
    //possible sign
    ch = text.charAt(pos[0]);
    if (ch != '+' && ch != '-') {
      return false;
    }
    pos[0]++;
    value = this.parseInt_(text, pos);
    if (value < 0) {
      return false;
    }
    if (ch == '-') {
      value = -value;
    }
  }

  // only if 2 digit was actually parsed, and pattern say it has 2 digit.
  if (!ch && pos[0] - start == 2 && part.count == 2) {
    cal.setTwoDigitYear_(value);
  } else {
    cal.year = value;
  }
  return true;
***REMOVED***


***REMOVED***
***REMOVED*** Parse Month field.
***REMOVED***
***REMOVED*** @param {string} text the time text to be parsed.
***REMOVED*** @param {Array.<number>} pos Parse position.
***REMOVED*** @param {goog.i18n.DateTimeParse.MyDate_} cal object to hold parsed value.
***REMOVED*** @param {number} value numeric value if this field is expressed using
***REMOVED***      numeric pattern, or -1 if not.
***REMOVED***
***REMOVED*** @return {boolean} True if parsing successful.
***REMOVED*** @private
***REMOVED***
goog.i18n.DateTimeParse.prototype.subParseMonth_ =
    function(text, pos, cal, value) {
  // when month is symbols, i.e., MMM or MMMM, value will be -1
  if (value < 0) {
    // Want to be able to parse both short and long forms.
    // Try count == 4 first:
    value = this.matchString_(text, pos, goog.i18n.DateTimeSymbols.MONTHS);
    if (value < 0) { // count == 4 failed, now try count == 3
      value = this.matchString_(text, pos,
                                goog.i18n.DateTimeSymbols.SHORTMONTHS);
    }
    if (value < 0) {
      return false;
    }
    cal.month = value;
    return true;
  } else {
    cal.month = value - 1;
    return true;
  }
***REMOVED***


***REMOVED***
***REMOVED*** Parse Quarter field.
***REMOVED***
***REMOVED*** @param {string} text the time text to be parsed.
***REMOVED*** @param {Array.<number>} pos Parse position.
***REMOVED*** @param {goog.i18n.DateTimeParse.MyDate_} cal object to hold parsed value.
***REMOVED*** @param {number} value numeric value if this field is expressed using
***REMOVED***      numeric pattern, or -1 if not.
***REMOVED***
***REMOVED*** @return {boolean} True if parsing successful.
***REMOVED*** @private
***REMOVED***
goog.i18n.DateTimeParse.prototype.subParseQuarter_ =
    function(text, pos, cal, value) {
  // value should be -1, since this is a non-numeric field.
  if (value < 0) {
    // Want to be able to parse both short and long forms.
    // Try count == 4 first:
    value = this.matchString_(text, pos, goog.i18n.DateTimeSymbols.QUARTERS);
    if (value < 0) { // count == 4 failed, now try count == 3
      value = this.matchString_(text, pos,
                                goog.i18n.DateTimeSymbols.SHORTQUARTERS);
    }
    if (value < 0) {
      return false;
    }
    cal.month = value***REMOVED*** 3;  // First month of quarter.
    cal.day = 1;
    return true;
  }
  return false;
***REMOVED***


***REMOVED***
***REMOVED*** Parse Day of week field.
***REMOVED*** @param {string} text the time text to be parsed.
***REMOVED*** @param {Array.<number>} pos Parse position.
***REMOVED*** @param {goog.i18n.DateTimeParse.MyDate_} cal object to hold parsed value.
***REMOVED***
***REMOVED*** @return {boolean} True if successful.
***REMOVED*** @private
***REMOVED***
goog.i18n.DateTimeParse.prototype.subParseDayOfWeek_ =
    function(text, pos, cal) {
  // Handle both short and long forms.
  // Try count == 4 (DDDD) first:
  var value = this.matchString_(text, pos, goog.i18n.DateTimeSymbols.WEEKDAYS);
  if (value < 0) {
    value = this.matchString_(text, pos,
                              goog.i18n.DateTimeSymbols.SHORTWEEKDAYS);
  }
  if (value < 0) {
    return false;
  }
  cal.dayOfWeek = value;
  return true;
***REMOVED***


***REMOVED***
***REMOVED*** Parse fractional seconds field.
***REMOVED***
***REMOVED*** @param {number} value parsed numberic value.
***REMOVED*** @param {Array.<number>} pos current parse position.
***REMOVED*** @param {number} start where this field start.
***REMOVED*** @param {goog.i18n.DateTimeParse.MyDate_} cal object to hold parsed value.
***REMOVED***
***REMOVED*** @return {boolean} True if successful.
***REMOVED*** @private
***REMOVED***
goog.i18n.DateTimeParse.prototype.subParseFractionalSeconds_ =
    function(value, pos, start, cal) {
  // Fractional seconds left-justify
  var len = pos[0] - start;
  cal.milliseconds = len < 3 ? value***REMOVED*** Math.pow(10, 3 - len) :
                               Math.round(value / Math.pow(10, len - 3));
  return true;
***REMOVED***


***REMOVED***
***REMOVED*** Parse GMT type timezone.
***REMOVED***
***REMOVED*** @param {string} text the time text to be parsed.
***REMOVED*** @param {Array.<number>} pos Parse position.
***REMOVED*** @param {goog.i18n.DateTimeParse.MyDate_} cal object to hold parsed value.
***REMOVED***
***REMOVED*** @return {boolean} True if successful.
***REMOVED*** @private
***REMOVED***
goog.i18n.DateTimeParse.prototype.subparseTimeZoneInGMT_ =
    function(text, pos, cal) {
  // First try to parse generic forms such as GMT-07:00. Do this first
  // in case localized DateFormatZoneData contains the string "GMT"
  // for a zone; in that case, we don't want to match the first three
  // characters of GMT+/-HH:MM etc.

  // For time zones that have no known names, look for strings
  // of the form:
  //    GMT[+-]hours:minutes or
  //    GMT[+-]hhmm or
  //    GMT.
  if (text.indexOf('GMT', pos[0]) == pos[0]) {
    pos[0] += 3;  // 3 is the length of GMT
    return this.parseTimeZoneOffset_(text, pos, cal);
  }

  // TODO(user): check for named time zones by looking through the locale
  // data from the DateFormatZoneData strings. should parse both short and long
  // forms.
  // subParseZoneString(text, start, cal);

  // As a last resort, look for numeric timezones of the form
  // [+-]hhmm as specified by RFC 822.  This code is actually
  // a little more permissive than RFC 822.  It will try to do
  // its best with numbers that aren't strictly 4 digits long.
  return this.parseTimeZoneOffset_(text, pos, cal);
***REMOVED***


***REMOVED***
***REMOVED*** Parse time zone offset.
***REMOVED***
***REMOVED*** @param {string} text the time text to be parsed.
***REMOVED*** @param {Array.<number>} pos Parse position.
***REMOVED*** @param {goog.i18n.DateTimeParse.MyDate_} cal object to hold parsed value.
***REMOVED***
***REMOVED*** @return {boolean} True if successful.
***REMOVED*** @private
***REMOVED***
goog.i18n.DateTimeParse.prototype.parseTimeZoneOffset_ =
    function(text, pos, cal) {
  if (pos[0] >= text.length) {
    cal.tzOffset = 0;
    return true;
  }

  var sign = 1;
  switch (text.charAt(pos[0])) {
    case '-': sign = -1;  // fall through
    case '+': pos[0]++;
  }

  // Look for hours:minutes or hhmm.
  var st = pos[0];
  var value = this.parseInt_(text, pos);
  if (value == 0 && pos[0] == st) {
    return false;
  }

  var offset;
  if (pos[0] < text.length && text.charAt(pos[0]) == ':') {
    // This is the hours:minutes case
    offset = value***REMOVED*** 60;
    pos[0]++;
    st = pos[0];
    value = this.parseInt_(text, pos);
    if (value == 0 && pos[0] == st) {
      return false;
    }
    offset += value;
  } else {
    // This is the hhmm case.
    offset = value;
    // Assume "-23".."+23" refers to hours.
    if (offset < 24 && (pos[0] - st) <= 2) {
      offset***REMOVED***= 60;
    } else {
      // todo: this looks questionable, should have more error checking
      offset = offset % 100 + offset / 100***REMOVED*** 60;
    }
  }

  offset***REMOVED***= sign;
  cal.tzOffset = -offset;
  return true;
***REMOVED***


***REMOVED***
***REMOVED*** Parse a integer string and return integer value.
***REMOVED***
***REMOVED*** @param {string} text string being parsed.
***REMOVED*** @param {Array.<number>} pos parse position.
***REMOVED***
***REMOVED*** @return {number} Converted integer value.
***REMOVED*** @private
***REMOVED***
goog.i18n.DateTimeParse.prototype.parseInt_ = function(text, pos) {
  var m = text.substring(pos[0]).match(/^\d+/);
  if (!m) {
    return -1;
  }
  pos[0] += m[0].length;
  return parseInt(m[0], 10);
***REMOVED***


***REMOVED***
***REMOVED*** Attempt to match the text at a given position against an array of strings.
***REMOVED*** Since multiple strings in the array may match (for example, if the array
***REMOVED*** contains "a", "ab", and "abc", all will match the input string "abcd") the
***REMOVED*** longest match is returned.
***REMOVED***
***REMOVED*** @param {string} text The string to match to.
***REMOVED*** @param {Array.<number>} pos parsing position.
***REMOVED*** @param {Array.<string>} data The string array of matching patterns.
***REMOVED***
***REMOVED*** @return {number} the new start position if matching succeeded; a negative
***REMOVED***     number indicating matching failure.
***REMOVED*** @private
***REMOVED***
goog.i18n.DateTimeParse.prototype.matchString_ = function(text, pos, data) {
  // There may be multiple strings in the data[] array which begin with
  // the same prefix (e.g., Cerven and Cervenec (June and July) in Czech).
  // We keep track of the longest match, and return that. Note that this
  // unfortunately requires us to test all array elements.
  var bestMatchLength = 0;
  var bestMatch = -1;
  var lower_text = text.substring(pos[0]).toLowerCase();
  for (var i = 0; i < data.length; i++) {
    var len = data[i].length;
    // Always compare if we have no match yet; otherwise only compare
    // against potentially better matches (longer strings).
    if (len > bestMatchLength &&
        lower_text.indexOf(data[i].toLowerCase()) == 0) {
      bestMatch = i;
      bestMatchLength = len;
    }
  }
  if (bestMatch >= 0) {
    pos[0] += bestMatchLength;
  }
  return bestMatch;
***REMOVED***



***REMOVED***
***REMOVED*** This class hold the intermediate parsing result. After all fields are
***REMOVED*** consumed, final result will be resolved from this class.
***REMOVED***
***REMOVED*** @private
***REMOVED***
goog.i18n.DateTimeParse.MyDate_ = function() {***REMOVED***


***REMOVED***
***REMOVED*** The date's era.
***REMOVED*** @type {?number}
***REMOVED***
goog.i18n.DateTimeParse.MyDate_.prototype.era;


***REMOVED***
***REMOVED*** The date's year.
***REMOVED*** @type {?number}
***REMOVED***
goog.i18n.DateTimeParse.MyDate_.prototype.year;


***REMOVED***
***REMOVED*** The date's month.
***REMOVED*** @type {?number}
***REMOVED***
goog.i18n.DateTimeParse.MyDate_.prototype.month;


***REMOVED***
***REMOVED*** The date's day of month.
***REMOVED*** @type {?number}
***REMOVED***
goog.i18n.DateTimeParse.MyDate_.prototype.day;


***REMOVED***
***REMOVED*** The date's hour.
***REMOVED*** @type {?number}
***REMOVED***
goog.i18n.DateTimeParse.MyDate_.prototype.hours;


***REMOVED***
***REMOVED*** The date's before/afternoon denominator.
***REMOVED*** @type {?number}
***REMOVED***
goog.i18n.DateTimeParse.MyDate_.prototype.ampm;


***REMOVED***
***REMOVED*** The date's minutes.
***REMOVED*** @type {?number}
***REMOVED***
goog.i18n.DateTimeParse.MyDate_.prototype.minutes;


***REMOVED***
***REMOVED*** The date's seconds.
***REMOVED*** @type {?number}
***REMOVED***
goog.i18n.DateTimeParse.MyDate_.prototype.seconds;


***REMOVED***
***REMOVED*** The date's milliseconds.
***REMOVED*** @type {?number}
***REMOVED***
goog.i18n.DateTimeParse.MyDate_.prototype.milliseconds;


***REMOVED***
***REMOVED*** The date's timezone offset.
***REMOVED*** @type {?number}
***REMOVED***
goog.i18n.DateTimeParse.MyDate_.prototype.tzOffset;


***REMOVED***
***REMOVED*** The date's day of week. Sunday is 0, Saturday is 6.
***REMOVED*** @type {?number}
***REMOVED***
goog.i18n.DateTimeParse.MyDate_.prototype.dayOfWeek;


***REMOVED***
***REMOVED*** 2 digit year special handling. Assuming for example that the
***REMOVED*** defaultCenturyStart is 6/18/1903. This means that two-digit years will be
***REMOVED*** forced into the range 6/18/1903 to 6/17/2003. As a result, years 00, 01, and
***REMOVED*** 02 correspond to 2000, 2001, and 2002. Years 04, 05, etc. correspond
***REMOVED*** to 1904, 1905, etc. If the year is 03, then it is 2003 if the
***REMOVED*** other fields specify a date before 6/18, or 1903 if they specify a
***REMOVED*** date afterwards. As a result, 03 is an ambiguous year. All other
***REMOVED*** two-digit years are unambiguous.
***REMOVED***
***REMOVED*** @param {number} year 2 digit year value before adjustment.
***REMOVED*** @return {number} disambiguated year.
***REMOVED*** @private
***REMOVED***
goog.i18n.DateTimeParse.MyDate_.prototype.setTwoDigitYear_ = function(year) {
  var now = new Date();
  var defaultCenturyStartYear =
      now.getFullYear() - goog.i18n.DateTimeParse.ambiguousYearCenturyStart;
  var ambiguousTwoDigitYear = defaultCenturyStartYear % 100;
  this.ambiguousYear = (year == ambiguousTwoDigitYear);
  year += Math.floor(defaultCenturyStartYear / 100)***REMOVED*** 100 +
      (year < ambiguousTwoDigitYear ? 100 : 0);
  return this.year = year;
***REMOVED***


***REMOVED***
***REMOVED*** Based on the fields set, fill a Date object. For those fields that not
***REMOVED*** set, use the passed in date object's value.
***REMOVED***
***REMOVED*** @param {goog.date.DateLike} date Date object to be filled.
***REMOVED*** @param {boolean} validation If true, input string will be checked to make
***REMOVED***     sure it is valid.
***REMOVED***
***REMOVED*** @return {boolean} false if fields specify a invalid date.
***REMOVED*** @private
***REMOVED***
goog.i18n.DateTimeParse.MyDate_.prototype.calcDate_ =
    function(date, validation) {
  // year 0 is 1 BC, and so on.
  if (this.era != undefined && this.year != undefined &&
      this.era == 0 && this.year > 0) {
    this.year = -(this.year - 1);
  }

  if (this.year != undefined) {
    date.setFullYear(this.year);
  }

  // The setMonth and setDate logic is a little tricky. We need to make sure
  // day of month is smaller enough so that it won't cause a month switch when
  // setting month. For example, if data in date is Nov 30, when month is set
  // to Feb, because there is no Feb 30, JS adjust it to Mar 2. So Feb 12 will
  // become  Mar 12.
  var orgDate = date.getDate();

  // Every month has a 1st day, this can actually be anything less than 29.
  date.setDate(1);

  if (this.month != undefined) {
    date.setMonth(this.month);
  }

  if (this.day != undefined) {
    date.setDate(this.day);
  } else {
    date.setDate(orgDate);
  }

  if (goog.isFunction(date.setHours)) {
    if (this.hours == undefined) {
      this.hours = date.getHours();
    }
    // adjust ampm
    if (this.ampm != undefined && this.ampm > 0 && this.hours < 12) {
      this.hours += 12;
    }
    date.setHours(this.hours);
  }

  if (goog.isFunction(date.setMinutes) && this.minutes != undefined) {
    date.setMinutes(this.minutes);
  }

  if (goog.isFunction(date.setSeconds) && this.seconds != undefined) {
    date.setSeconds(this.seconds);
  }

  if (goog.isFunction(date.setMilliseconds) &&
      this.milliseconds != undefined) {
    date.setMilliseconds(this.milliseconds);
  }

  // If validation is needed, verify that the uncalculated date fields
  // match the calculated date fields.  We do this before we set the
  // timezone offset, which will skew all of the dates.
  //
  // Don't need to check the day of week as it is guaranteed to be
  // correct or return false below.
  if (validation &&
      (this.year != undefined && this.year != date.getFullYear() ||
       this.month != undefined && this.month != date.getMonth() ||
       this.day != undefined && this.day != date.getDate() ||
       this.hours >= 24 || this.minutes >= 60 || this.seconds >= 60 ||
       this.milliseconds >= 1000)) {
    return false;
  }

  // adjust time zone
  if (this.tzOffset != undefined) {
    var offset = date.getTimezoneOffset();
    date.setTime(date.getTime() + (this.tzOffset - offset)***REMOVED*** 60***REMOVED*** 1000);
  }

  // resolve ambiguous year if needed
  if (this.ambiguousYear) { // the two-digit year == the default start year
    var defaultCenturyStart = new Date();
    defaultCenturyStart.setFullYear(
        defaultCenturyStart.getFullYear() -
        goog.i18n.DateTimeParse.ambiguousYearCenturyStart);
    if (date.getTime() < defaultCenturyStart.getTime()) {
      date.setFullYear(defaultCenturyStart.getFullYear() + 100);
    }
  }

  // dayOfWeek, validation only
  if (this.dayOfWeek != undefined) {
    if (this.day == undefined) {
      // adjust to the nearest day of the week
      var adjustment = (7 + this.dayOfWeek - date.getDay()) % 7;
      if (adjustment > 3) {
        adjustment -= 7;
      }
      var orgMonth = date.getMonth();
      date.setDate(date.getDate() + adjustment);

      // don't let it switch month
      if (date.getMonth() != orgMonth) {
        date.setDate(date.getDate() + (adjustment > 0 ? -7 : 7));
      }
    } else if (this.dayOfWeek != date.getDay()) {
      return false;
    }
  }
  return true;
***REMOVED***
