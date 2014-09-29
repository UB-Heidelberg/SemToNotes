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
***REMOVED*** @fileoverview Functions for dealing with date/time formatting.
***REMOVED***


***REMOVED***
***REMOVED*** Namespace for i18n date/time formatting functions
***REMOVED***
goog.provide('goog.i18n.DateTimeFormat');
goog.provide('goog.i18n.DateTimeFormat.Format');

goog.require('goog.asserts');
goog.require('goog.date.DateLike');
goog.require('goog.i18n.DateTimeSymbols');
goog.require('goog.i18n.TimeZone');
goog.require('goog.string');


***REMOVED***
***REMOVED*** Datetime formatting functions following the pattern specification as defined
***REMOVED*** in JDK, ICU and CLDR, with minor modification for typical usage in JS.
***REMOVED*** Pattern specification: (Refer to JDK/ICU/CLDR)
***REMOVED*** <pre>
***REMOVED*** Symbol Meaning Presentation        Example
***REMOVED*** ------   -------                 ------------        -------
***REMOVED*** G        era designator          (Text)              AD
***REMOVED*** y#       year                    (Number)            1996
***REMOVED*** Y*       year (week of year)     (Number)            1997
***REMOVED*** u*       extended year           (Number)            4601
***REMOVED*** M        month in year           (Text & Number)     July & 07
***REMOVED*** d        day in month            (Number)            10
***REMOVED*** h        hour in am/pm (1~12)    (Number)            12
***REMOVED*** H        hour in day (0~23)      (Number)            0
***REMOVED*** m        minute in hour          (Number)            30
***REMOVED*** s        second in minute        (Number)            55
***REMOVED*** S        fractional second       (Number)            978
***REMOVED*** E        day of week             (Text)              Tuesday
***REMOVED*** e*       day of week (local 1~7) (Number)            2
***REMOVED*** D*       day in year             (Number)            189
***REMOVED*** F*       day of week in month    (Number)            2 (2nd Wed in July)
***REMOVED*** w*       week in year            (Number)            27
***REMOVED*** W*       week in month           (Number)            2
***REMOVED*** a        am/pm marker            (Text)              PM
***REMOVED*** k        hour in day (1~24)      (Number)            24
***REMOVED*** K        hour in am/pm (0~11)    (Number)            0
***REMOVED*** z        time zone               (Text)              Pacific Standard Time
***REMOVED*** Z        time zone (RFC 822)     (Number)            -0800
***REMOVED*** v        time zone (generic)     (Text)              Pacific Time
***REMOVED*** g*       Julian day              (Number)            2451334
***REMOVED*** A*       milliseconds in day     (Number)            69540000
***REMOVED*** '        escape for text         (Delimiter)         'Date='
***REMOVED*** ''       single quote            (Literal)           'o''clock'
***REMOVED***
***REMOVED*** Item marked with '*' are not supported yet.
***REMOVED*** Item marked with '#' works different than java
***REMOVED***
***REMOVED*** The count of pattern letters determine the format.
***REMOVED*** (Text): 4 or more, use full form, <4, use short or abbreviated form if it
***REMOVED*** exists. (e.g., "EEEE" produces "Monday", "EEE" produces "Mon")
***REMOVED***
***REMOVED*** (Number): the minimum number of digits. Shorter numbers are zero-padded to
***REMOVED*** this amount (e.g. if "m" produces "6", "mm" produces "06"). Year is handled
***REMOVED*** specially; that is, if the count of 'y' is 2, the Year will be truncated to
***REMOVED*** 2 digits. (e.g., if "yyyy" produces "1997", "yy" produces "97".) Unlike other
***REMOVED*** fields, fractional seconds are padded on the right with zero.
***REMOVED***
***REMOVED*** (Text & Number): 3 or over, use text, otherwise use number. (e.g., "M"
***REMOVED*** produces "1", "MM" produces "01", "MMM" produces "Jan", and "MMMM" produces
***REMOVED*** "January".)
***REMOVED***
***REMOVED*** Any characters in the pattern that are not in the ranges of ['a'..'z'] and
***REMOVED*** ['A'..'Z'] will be treated as quoted text. For instance, characters like ':',
***REMOVED*** '.', ' ', '#' and '@' will appear in the resulting time text even they are
***REMOVED*** not embraced within single quotes.
***REMOVED*** </pre>
***REMOVED***



***REMOVED***
***REMOVED*** Construct a DateTimeFormat object based on current locale.
***REMOVED***
***REMOVED*** @param {string|number} pattern pattern specification or pattern type.
***REMOVED***
goog.i18n.DateTimeFormat = function(pattern) {
  goog.asserts.assert(goog.isDef(pattern), 'Pattern must be defined');
  this.patternParts_ = [];
  if (typeof pattern == 'number') {
    this.applyStandardPattern_(pattern);
  } else {
    this.applyPattern_(pattern);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Enum to identify predefined Date/Time format pattern.
***REMOVED*** @enum {number}
***REMOVED***
goog.i18n.DateTimeFormat.Format = {
  FULL_DATE: 0,
  LONG_DATE: 1,
  MEDIUM_DATE: 2,
  SHORT_DATE: 3,
  FULL_TIME: 4,
  LONG_TIME: 5,
  MEDIUM_TIME: 6,
  SHORT_TIME: 7,
  FULL_DATETIME: 8,
  LONG_DATETIME: 9,
  MEDIUM_DATETIME: 10,
  SHORT_DATETIME: 11
***REMOVED***


***REMOVED***
***REMOVED*** regular expression pattern for parsing pattern string
***REMOVED*** @type {Array.<RegExp>}
***REMOVED*** @private
***REMOVED***
goog.i18n.DateTimeFormat.TOKENS_ = [
  //quote string
  /^\'(?:[^\']|\'\')*\'/,
  // pattern chars
  /^(?:G+|y+|M+|k+|S+|E+|a+|h+|K+|H+|c+|L+|Q+|d+|m+|s+|v+|z+|Z+)/,
  // and all the other chars
  /^[^\'GyMkSEahKHcLQdmsvzZ]+/  // and all the other chars
];


***REMOVED***
***REMOVED*** These are token types, corresponding to above token definitions.
***REMOVED*** @enum {number}
***REMOVED*** @private
***REMOVED***
goog.i18n.DateTimeFormat.PartTypes_ = {
  QUOTED_STRING: 0,
  FIELD: 1,
  LITERAL: 2
***REMOVED***


***REMOVED***
***REMOVED*** Apply specified pattern to this formatter object.
***REMOVED*** @param {string} pattern String specifying how the date should be formatted.
***REMOVED*** @private
***REMOVED***
goog.i18n.DateTimeFormat.prototype.applyPattern_ = function(pattern) {
  // lex the pattern, once for all uses
  while (pattern) {
    for (var i = 0; i < goog.i18n.DateTimeFormat.TOKENS_.length; ++i) {
      var m = pattern.match(goog.i18n.DateTimeFormat.TOKENS_[i]);
      if (m) {
        var part = m[0];
        pattern = pattern.substring(part.length);
        if (i == goog.i18n.DateTimeFormat.PartTypes_.QUOTED_STRING) {
          if (part == "''") {
            part = "'";  // '' -> '
          } else {
            part = part.substring(1, part.length - 1); // strip quotes
            part = part.replace(/\'\'/, "'");
          }
        }
        this.patternParts_.push({ text: part, type: i });
        break;
      }
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** Format the given date object according to preset pattern and current lcoale.
***REMOVED*** @param {goog.date.DateLike} date The Date object that is being formatted.
***REMOVED*** @param {goog.i18n.TimeZone=} opt_timeZone optional, if specified, time
***REMOVED***    related fields will be formatted based on its setting. When this field
***REMOVED***    is not specified, "undefined" will be pass around and those function
***REMOVED***    that really need time zone service will create a default one.
***REMOVED*** @return {string} Formatted string for the given date.
***REMOVED***
goog.i18n.DateTimeFormat.prototype.format = function(date, opt_timeZone) {
  // We don't want to write code to calculate each date field because we
  // want to maximize performance and minimize code size.
  // JavaScript only provide API to render local time.
  // Suppose target date is: 16:00 GMT-0400
  // OS local time is:       12:00 GMT-0800
  // We want to create a Local Date Object : 16:00 GMT-0800, and fix the
  // time zone display ourselves.
  // Thing get a little bit tricky when daylight time transition happens. For
  // example, suppose OS timeZone is America/Los_Angeles, it is impossible to
  // represent "2006/4/2 02:30" even for those timeZone that has no transition
  // at this time. Because 2:00 to 3:00 on that day does not exising in
  // America/Los_Angeles time zone. To avoid calculating date field through
  // our own code, we uses 3 Date object instead, one for "Year, month, day",
  // one for time within that day, and one for timeZone object since it need
  // the real time to figure out actual time zone offset.
  var diff = opt_timeZone ?
      (date.getTimezoneOffset() - opt_timeZone.getOffset(date))***REMOVED*** 60000 : 0;
  var dateForDate = diff ? new Date(date.getTime() + diff) : date;
  var dateForTime = dateForDate;
  // in daylight time switch on/off hour, diff adjustment could alter time
  // because of timeZone offset change, move 1 day forward or backward.
  if (opt_timeZone &&
      dateForDate.getTimezoneOffset() != date.getTimezoneOffset()) {
    diff += diff > 0 ? -24***REMOVED*** 60***REMOVED*** 60000 : 24***REMOVED*** 60***REMOVED*** 60000;
    dateForTime = new Date(date.getTime() + diff);
  }

  var out = [];
  for (var i = 0; i < this.patternParts_.length; ++i) {
    var text = this.patternParts_[i].text;
    if (goog.i18n.DateTimeFormat.PartTypes_.FIELD ==
        this.patternParts_[i].type) {
      out.push(this.formatField_(text, date, dateForDate, dateForTime,
                                 opt_timeZone));
    } else {
      out.push(text);
    }
  }
  return out.join('');
***REMOVED***


***REMOVED***
***REMOVED*** Apply a predefined pattern as identified by formatType, which is stored in
***REMOVED*** locale specific repository.
***REMOVED*** @param {number} formatType A number that identified the predefined pattern.
***REMOVED*** @private
***REMOVED***
goog.i18n.DateTimeFormat.prototype.applyStandardPattern_ =
    function(formatType) {
  var pattern;
  if (formatType < 4) {
    pattern = goog.i18n.DateTimeSymbols.DATEFORMATS[formatType];
  } else if (formatType < 8) {
    pattern = goog.i18n.DateTimeSymbols.TIMEFORMATS[formatType - 4];
  } else if (formatType < 12) {
    pattern = goog.i18n.DateTimeSymbols.DATEFORMATS[formatType - 8] +
              ' ' + goog.i18n.DateTimeSymbols.TIMEFORMATS[formatType - 8];
  } else {
    this.applyStandardPattern_(goog.i18n.DateTimeFormat.Format.MEDIUM_DATETIME);
    return;
  }
  this.applyPattern_(pattern);
***REMOVED***


***REMOVED***
***REMOVED*** Localizes a string potentially containing numbers, replacing ASCII digits
***REMOVED*** with native digits if specified so by the locale. Leaves other characters.
***REMOVED***
***REMOVED*** @param {string} input the string to be localized, using ASCII digits.
***REMOVED*** @return {string} localized string, potentially using native digits.
***REMOVED*** @private
***REMOVED***
goog.i18n.DateTimeFormat.prototype.localizeNumbers_ = function(input) {
  if (goog.i18n.DateTimeSymbols.ZERODIGIT === undefined) {
    return input;
  }

  var parts = [];
  for (var i = 0; i < input.length; i++) {
    var c = input.charCodeAt(i);
    parts.push((0x30 <= c && c <= 0x39) ? // '0' <= c <= '9'
        String.fromCharCode(goog.i18n.DateTimeSymbols.ZERODIGIT + c - 0x30) :
        input.charAt(i));
  }
  return parts.join('');
***REMOVED***


***REMOVED***
***REMOVED*** Formats Era field according to pattern specified.
***REMOVED***
***REMOVED*** @param {number} count Number of time pattern char repeats, it controls
***REMOVED***     how a field should be formatted.
***REMOVED*** @param {goog.date.DateLike} date It holds the date object to be formatted.
***REMOVED*** @return {string} Formatted string that represent this field.
***REMOVED*** @private
***REMOVED***
goog.i18n.DateTimeFormat.prototype.formatEra_ = function(count, date) {
  var value = date.getFullYear() > 0 ? 1 : 0;
  return count >= 4 ? goog.i18n.DateTimeSymbols.ERANAMES[value] :
                      goog.i18n.DateTimeSymbols.ERAS[value];
***REMOVED***


***REMOVED***
***REMOVED*** Formats Year field according to pattern specified
***REMOVED***   Javascript Date object seems incapable handling 1BC and
***REMOVED***   year before. It can show you year 0 which does not exists.
***REMOVED***   following we just keep consistent with javascript's
***REMOVED***   toString method. But keep in mind those things should be
***REMOVED***   unsupported.
***REMOVED*** @param {number} count Number of time pattern char repeats, it controls
***REMOVED***     how a field should be formatted.
***REMOVED*** @param {goog.date.DateLike} date It holds the date object to be formatted.
***REMOVED*** @return {string} Formatted string that represent this field.
***REMOVED*** @private
***REMOVED***
goog.i18n.DateTimeFormat.prototype.formatYear_ = function(count, date) {
  var value = date.getFullYear();
  if (value < 0) {
    value = -value;
  }
  return this.localizeNumbers_(count == 2 ?
      goog.string.padNumber(value % 100, 2) :
      String(value));
***REMOVED***


***REMOVED***
***REMOVED*** Formats Month field according to pattern specified
***REMOVED***
***REMOVED*** @param {number} count Number of time pattern char repeats, it controls
***REMOVED***     how a field should be formatted.
***REMOVED*** @param {goog.date.DateLike} date It holds the date object to be formatted.
***REMOVED*** @return {string} Formatted string that represent this field.
***REMOVED*** @private
***REMOVED***
goog.i18n.DateTimeFormat.prototype.formatMonth_ = function(count, date) {
  var value = date.getMonth();
  switch (count) {
    case 5: return goog.i18n.DateTimeSymbols.NARROWMONTHS[value];
    case 4: return goog.i18n.DateTimeSymbols.MONTHS[value];
    case 3: return goog.i18n.DateTimeSymbols.SHORTMONTHS[value];
    default:
      return this.localizeNumbers_(goog.string.padNumber(value + 1, count));
  }
***REMOVED***


***REMOVED***
***REMOVED*** Formats (1..24) Hours field according to pattern specified
***REMOVED***
***REMOVED*** @param {number} count Number of time pattern char repeats. This controls
***REMOVED***     how a field should be formatted.
***REMOVED*** @param {goog.date.DateLike} date It holds the date object to be formatted.
***REMOVED*** @return {string} Formatted string that represent this field.
***REMOVED*** @private
***REMOVED***
goog.i18n.DateTimeFormat.prototype.format24Hours_ =
    function(count, date) {
  return this.localizeNumbers_(
      goog.string.padNumber(date.getHours() || 24, count));
***REMOVED***


***REMOVED***
***REMOVED*** Formats Fractional seconds field according to pattern
***REMOVED*** specified
***REMOVED***
***REMOVED*** @param {number} count Number of time pattern char repeats, it controls
***REMOVED***     how a field should be formatted.
***REMOVED*** @param {goog.date.DateLike} date It holds the date object to be formatted.
***REMOVED***
***REMOVED*** @return {string} Formatted string that represent this field.
***REMOVED*** @private
***REMOVED***
goog.i18n.DateTimeFormat.prototype.formatFractionalSeconds_ =
    function(count, date) {
  // Fractional seconds left-justify, append 0 for precision beyond 3
  var value = date.getTime() % 1000 / 1000;
  return this.localizeNumbers_(
      value.toFixed(Math.min(3, count)).substr(2) +
      (count > 3 ? goog.string.padNumber(0, count - 3) : ''));
***REMOVED***


***REMOVED***
***REMOVED*** Formats Day of week field according to pattern specified
***REMOVED***
***REMOVED*** @param {number} count Number of time pattern char repeats, it controls
***REMOVED***     how a field should be formatted.
***REMOVED*** @param {goog.date.DateLike} date It holds the date object to be formatted.
***REMOVED*** @return {string} Formatted string that represent this field.
***REMOVED*** @private
***REMOVED***
goog.i18n.DateTimeFormat.prototype.formatDayOfWeek_ =
    function(count, date) {
  var value = date.getDay();
  return count >= 4 ? goog.i18n.DateTimeSymbols.WEEKDAYS[value] :
                      goog.i18n.DateTimeSymbols.SHORTWEEKDAYS[value];
***REMOVED***


***REMOVED***
***REMOVED*** Formats Am/Pm field according to pattern specified
***REMOVED***
***REMOVED*** @param {number} count Number of time pattern char repeats, it controls
***REMOVED***     how a field should be formatted.
***REMOVED*** @param {goog.date.DateLike} date It holds the date object to be formatted.
***REMOVED*** @return {string} Formatted string that represent this field.
***REMOVED*** @private
***REMOVED***
goog.i18n.DateTimeFormat.prototype.formatAmPm_ = function(count, date) {
  var hours = date.getHours();
  return goog.i18n.DateTimeSymbols.AMPMS[hours >= 12 && hours < 24 ? 1 : 0];
***REMOVED***


***REMOVED***
***REMOVED*** Formats (1..12) Hours field according to pattern specified
***REMOVED***
***REMOVED*** @param {number} count Number of time pattern char repeats, it controls
***REMOVED***     how a field should be formatted.
***REMOVED*** @param {goog.date.DateLike} date It holds the date object to be formatted.
***REMOVED*** @return {string} formatted string that represent this field.
***REMOVED*** @private
***REMOVED***
goog.i18n.DateTimeFormat.prototype.format1To12Hours_ =
    function(count, date) {
  return this.localizeNumbers_(
      goog.string.padNumber(date.getHours() % 12 || 12, count));
***REMOVED***


***REMOVED***
***REMOVED*** Formats (0..11) Hours field according to pattern specified
***REMOVED***
***REMOVED*** @param {number} count Number of time pattern char repeats, it controls
***REMOVED***     how a field should be formatted.
***REMOVED*** @param {goog.date.DateLike} date It holds the date object to be formatted.
***REMOVED*** @return {string} formatted string that represent this field.
***REMOVED*** @private
***REMOVED***
goog.i18n.DateTimeFormat.prototype.format0To11Hours_ =
    function(count, date) {
  return this.localizeNumbers_(
      goog.string.padNumber(date.getHours() % 12, count));
***REMOVED***


***REMOVED***
***REMOVED*** Formats (0..23) Hours field according to pattern specified
***REMOVED***
***REMOVED*** @param {number} count Number of time pattern char repeats, it controls
***REMOVED***     how a field should be formatted.
***REMOVED*** @param {goog.date.DateLike} date It holds the date object to be formatted.
***REMOVED*** @return {string} formatted string that represent this field.
***REMOVED*** @private
***REMOVED***
goog.i18n.DateTimeFormat.prototype.format0To23Hours_ =
    function(count, date) {
  return this.localizeNumbers_(goog.string.padNumber(date.getHours(), count));
***REMOVED***


***REMOVED***
***REMOVED*** Formats Standalone weekday field according to pattern specified
***REMOVED***
***REMOVED*** @param {number} count Number of time pattern char repeats, it controls
***REMOVED***     how a field should be formatted.
***REMOVED*** @param {goog.date.DateLike} date It holds the date object to be formatted.
***REMOVED*** @return {string} formatted string that represent this field.
***REMOVED*** @private
***REMOVED***
goog.i18n.DateTimeFormat.prototype.formatStandaloneDay_ =
    function(count, date) {
  var value = date.getDay();
  switch (count) {
    case 5:
      return goog.i18n.DateTimeSymbols.STANDALONENARROWWEEKDAYS[value];
    case 4:
      return goog.i18n.DateTimeSymbols.STANDALONEWEEKDAYS[value];
    case 3:
      return goog.i18n.DateTimeSymbols.STANDALONESHORTWEEKDAYS[value];
    default:
      return this.localizeNumbers_(goog.string.padNumber(value, 1));
  }
***REMOVED***


***REMOVED***
***REMOVED*** Formats Standalone Month field according to pattern specified
***REMOVED***
***REMOVED*** @param {number} count Number of time pattern char repeats, it controls
***REMOVED***     how a field should be formatted.
***REMOVED*** @param {goog.date.DateLike} date It holds the date object to be formatted.
***REMOVED*** @return {string} formatted string that represent this field.
***REMOVED*** @private
***REMOVED***
goog.i18n.DateTimeFormat.prototype.formatStandaloneMonth_ =
    function(count, date) {
  var value = date.getMonth();
  switch (count) {
    case 5:
      return goog.i18n.DateTimeSymbols.STANDALONENARROWMONTHS[value];
    case 4:
      return goog.i18n.DateTimeSymbols.STANDALONEMONTHS[value];
    case 3:
      return goog.i18n.DateTimeSymbols.STANDALONESHORTMONTHS[value];
    default:
      return this.localizeNumbers_(goog.string.padNumber(value + 1, count));
  }
***REMOVED***


***REMOVED***
***REMOVED*** Formats Quarter field according to pattern specified
***REMOVED***
***REMOVED*** @param {number} count Number of time pattern char repeats, it controls
***REMOVED***     how a field should be formatted.
***REMOVED*** @param {goog.date.DateLike} date It holds the date object to be formatted.
***REMOVED*** @return {string} Formatted string that represent this field.
***REMOVED*** @private
***REMOVED***
goog.i18n.DateTimeFormat.prototype.formatQuarter_ =
    function(count, date) {
  var value = Math.floor(date.getMonth() / 3);
  return count < 4 ? goog.i18n.DateTimeSymbols.SHORTQUARTERS[value] :
                     goog.i18n.DateTimeSymbols.QUARTERS[value];
***REMOVED***


***REMOVED***
***REMOVED*** Formats Date field according to pattern specified
***REMOVED***
***REMOVED*** @param {number} count Number of time pattern char repeats, it controls
***REMOVED***     how a field should be formatted.
***REMOVED*** @param {goog.date.DateLike} date It holds the date object to be formatted.
***REMOVED*** @return {string} Formatted string that represent this field.
***REMOVED*** @private
***REMOVED***
goog.i18n.DateTimeFormat.prototype.formatDate_ = function(count, date) {
  return this.localizeNumbers_(goog.string.padNumber(date.getDate(), count));
***REMOVED***


***REMOVED***
***REMOVED*** Formats Minutes field according to pattern specified
***REMOVED***
***REMOVED*** @param {number} count Number of time pattern char repeats, it controls
***REMOVED***     how a field should be formatted.
***REMOVED*** @param {goog.date.DateLike} date It holds the date object to be formatted.
***REMOVED*** @return {string} Formatted string that represent this field.
***REMOVED*** @private
***REMOVED***
goog.i18n.DateTimeFormat.prototype.formatMinutes_ =
    function(count, date) {
  return this.localizeNumbers_(goog.string.padNumber(date.getMinutes(), count));
***REMOVED***


***REMOVED***
***REMOVED*** Formats Seconds field according to pattern specified
***REMOVED***
***REMOVED*** @param {number} count Number of time pattern char repeats, it controls
***REMOVED***     how a field should be formatted.
***REMOVED*** @param {goog.date.DateLike} date It holds the date object to be formatted.
***REMOVED*** @return {string} Formatted string that represent this field.
***REMOVED*** @private
***REMOVED***
goog.i18n.DateTimeFormat.prototype.formatSeconds_ =
    function(count, date) {
  return this.localizeNumbers_(goog.string.padNumber(date.getSeconds(), count));
***REMOVED***


***REMOVED***
***REMOVED*** Formats TimeZone field following RFC
***REMOVED***
***REMOVED*** @param {number} count Number of time pattern char repeats, it controls
***REMOVED***     how a field should be formatted.
***REMOVED*** @param {goog.date.DateLike} date It holds the date object to be formatted.
***REMOVED*** @param {goog.i18n.TimeZone=} opt_timeZone This holds current time zone info.
***REMOVED*** @return {string} Formatted string that represent this field.
***REMOVED*** @private
***REMOVED***
goog.i18n.DateTimeFormat.prototype.formatTimeZoneRFC_ =
    function(count, date, opt_timeZone) {
  opt_timeZone = opt_timeZone ||
      goog.i18n.TimeZone.createTimeZone(date.getTimezoneOffset());

  // RFC 822 formats should be kept in ASCII, but localized GMT formats may need
  // to use native digits.
  return count < 4 ? opt_timeZone.getRFCTimeZoneString(date) :
                     this.localizeNumbers_(opt_timeZone.getGMTString(date));
***REMOVED***


***REMOVED***
***REMOVED*** Generate GMT timeZone string for given date
***REMOVED*** @param {number} count Number of time pattern char repeats, it controls
***REMOVED***     how a field should be formatted.
***REMOVED*** @param {goog.date.DateLike} date Whose value being evaluated.
***REMOVED*** @param {goog.i18n.TimeZone=} opt_timeZone This holds current time zone info.
***REMOVED*** @return {string} GMT timeZone string.
***REMOVED*** @private
***REMOVED***
goog.i18n.DateTimeFormat.prototype.formatTimeZone_ =
    function(count, date, opt_timeZone) {
  opt_timeZone = opt_timeZone ||
      goog.i18n.TimeZone.createTimeZone(date.getTimezoneOffset());
  return count < 4 ? opt_timeZone.getShortName(date) :
             opt_timeZone.getLongName(date);
***REMOVED***


***REMOVED***
***REMOVED*** Generate GMT timeZone string for given date
***REMOVED*** @param {goog.date.DateLike} date Whose value being evaluated.
***REMOVED*** @param {goog.i18n.TimeZone=} opt_timeZone This holds current time zone info.
***REMOVED*** @return {string} GMT timeZone string.
***REMOVED*** @private
***REMOVED***
goog.i18n.DateTimeFormat.prototype.formatTimeZoneId_ =
    function(date, opt_timeZone) {
  opt_timeZone = opt_timeZone ||
      goog.i18n.TimeZone.createTimeZone(date.getTimezoneOffset());
  return opt_timeZone.getTimeZoneId();
***REMOVED***


***REMOVED***
***REMOVED*** Formatting one date field.
***REMOVED*** @param {string} patternStr The pattern string for the field being formatted.
***REMOVED*** @param {goog.date.DateLike} date represents the real date to be formatted.
***REMOVED*** @param {goog.date.DateLike} dateForDate used to resolve date fields
***REMOVED***     for formatting.
***REMOVED*** @param {goog.date.DateLike} dateForTime used to resolve time fields
***REMOVED***     for formatting.
***REMOVED*** @param {goog.i18n.TimeZone=} opt_timeZone This holds current time zone info.
***REMOVED*** @return {string} string representation for the given field.
***REMOVED*** @private
***REMOVED***
goog.i18n.DateTimeFormat.prototype.formatField_ =
    function(patternStr, date, dateForDate, dateForTime, opt_timeZone) {
  var count = patternStr.length;
  switch (patternStr.charAt(0)) {
    case 'G': return this.formatEra_(count, dateForDate);
    case 'y': return this.formatYear_(count, dateForDate);
    case 'M': return this.formatMonth_(count, dateForDate);
    case 'k': return this.format24Hours_(count, dateForTime);
    case 'S': return this.formatFractionalSeconds_(count, dateForTime);
    case 'E': return this.formatDayOfWeek_(count, dateForDate);
    case 'a': return this.formatAmPm_(count, dateForTime);
    case 'h': return this.format1To12Hours_(count, dateForTime);
    case 'K': return this.format0To11Hours_(count, dateForTime);
    case 'H': return this.format0To23Hours_(count, dateForTime);
    case 'c': return this.formatStandaloneDay_(count, dateForDate);
    case 'L': return this.formatStandaloneMonth_(count, dateForDate);
    case 'Q': return this.formatQuarter_(count, dateForDate);
    case 'd': return this.formatDate_(count, dateForDate);
    case 'm': return this.formatMinutes_(count, dateForTime);
    case 's': return this.formatSeconds_(count, dateForTime);
    case 'v': return this.formatTimeZoneId_(date, opt_timeZone);
    case 'z': return this.formatTimeZone_(count, date, opt_timeZone);
    case 'Z': return this.formatTimeZoneRFC_(count, date, opt_timeZone);
    default: return '';
  }
***REMOVED***

