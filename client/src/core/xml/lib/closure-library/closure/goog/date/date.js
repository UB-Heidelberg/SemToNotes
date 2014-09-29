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
***REMOVED*** @fileoverview Functions and objects for date representation and manipulation.
***REMOVED***
***REMOVED*** @author eae@google.com (Emil A Eklund)
***REMOVED*** @author pallosp@google.com (Peter Pallos)
***REMOVED***

goog.provide('goog.date');
goog.provide('goog.date.Date');
goog.provide('goog.date.DateTime');
goog.provide('goog.date.Interval');
goog.provide('goog.date.month');
goog.provide('goog.date.weekDay');

goog.require('goog.asserts');
goog.require('goog.date.DateLike');
goog.require('goog.i18n.DateTimeSymbols');
goog.require('goog.string');


***REMOVED***
***REMOVED*** Constants for weekdays.
***REMOVED*** @enum {number}
***REMOVED***
goog.date.weekDay = {
  MON: 0,
  TUE: 1,
  WED: 2,
  THU: 3,
  FRI: 4,
  SAT: 5,
  SUN: 6
***REMOVED***


***REMOVED***
***REMOVED*** Constants for months.
***REMOVED*** @enum {number}
***REMOVED***
goog.date.month = {
  JAN: 0,
  FEB: 1,
  MAR: 2,
  APR: 3,
  MAY: 4,
  JUN: 5,
  JUL: 6,
  AUG: 7,
  SEP: 8,
  OCT: 9,
  NOV: 10,
  DEC: 11
***REMOVED***


***REMOVED***
***REMOVED*** Formats a month/year string.
***REMOVED*** Example: "January 2008"
***REMOVED***
***REMOVED*** @param {string} monthName The month name to use in the result.
***REMOVED*** @param {number} yearNum The numeric year to use in the result.
***REMOVED*** @return {string} A formatted month/year string.
***REMOVED***
goog.date.formatMonthAndYear = function(monthName, yearNum) {
 ***REMOVED*****REMOVED*** @desc Month/year format given the month name and the numeric year.***REMOVED***
  var MSG_MONTH_AND_YEAR = goog.getMsg(
      '{$monthName} {$yearNum}',
      { 'monthName' : monthName, 'yearNum' : yearNum });
  return MSG_MONTH_AND_YEAR;
***REMOVED***


***REMOVED***
***REMOVED*** Regular expression for splitting date parts from ISO 8601 styled string.
***REMOVED*** Examples: '20060210' or '2005-02-22' or '20050222' or '2005-08'
***REMOVED*** or '2005-W22' or '2005W22' or '2005-W22-4', etc.
***REMOVED*** For explanation and more examples, see:
***REMOVED*** {@link http://en.wikipedia.org/wiki/ISO_8601}
***REMOVED***
***REMOVED*** @type {RegExp}
***REMOVED*** @private
***REMOVED***
goog.date.splitDateStringRegex_ = new RegExp(
    '^(\\d{4})(?:(?:-?(\\d{2})(?:-?(\\d{2}))?)|' +
    '(?:-?(\\d{3}))|(?:-?W(\\d{2})(?:-?([1-7]))?))?$');


***REMOVED***
***REMOVED*** Regular expression for splitting time parts from ISO 8601 styled string.
***REMOVED*** Examples: '18:46:39.994' or '184639.994'
***REMOVED***
***REMOVED*** @type {RegExp}
***REMOVED*** @private
***REMOVED***
goog.date.splitTimeStringRegex_ =
    /^(\d{2})(?::?(\d{2})(?::?(\d{2})(\.\d+)?)?)?$/;


***REMOVED***
***REMOVED*** Regular expression for splitting timezone parts from ISO 8601 styled string.
***REMOVED*** Example: The part after the '+' in '18:46:39+07:00'.  Or '09:30Z' (UTC).
***REMOVED***
***REMOVED*** @type {RegExp}
***REMOVED*** @private
***REMOVED***
goog.date.splitTimezoneStringRegex_ = /Z|(?:([-+])(\d{2})(?::?(\d{2}))?)$/;


***REMOVED***
***REMOVED*** Regular expression for splitting duration parts from ISO 8601 styled string.
***REMOVED*** Example: '-P1Y2M3DT4H5M6.7S'
***REMOVED***
***REMOVED*** @type {RegExp}
***REMOVED*** @private
***REMOVED***
goog.date.splitDurationRegex_ = new RegExp(
    '^(-)?P(?:(\\d+)Y)?(?:(\\d+)M)?(?:(\\d+)D)?' +
    '(T(?:(\\d+)H)?(?:(\\d+)M)?(?:(\\d+(?:\\.\\d+)?)S)?)?$');


***REMOVED***
***REMOVED*** Returns whether the given year is a leap year.
***REMOVED***
***REMOVED*** @param {number} year Year part of date.
***REMOVED*** @return {boolean} Whether the given year is a leap year.
***REMOVED***
goog.date.isLeapYear = function(year) {
  // Leap year logic; the 4-100-400 rule
  return year % 4 == 0 && (year % 100 != 0 || year % 400 == 0);
***REMOVED***


***REMOVED***
***REMOVED*** Returns whether the given year is a long ISO year.
***REMOVED*** See {@link http://www.phys.uu.nl/~vgent/calendar/isocalendar_text3.htm}.
***REMOVED***
***REMOVED*** @param {number} year Full year part of date.
***REMOVED*** @return {boolean} Whether the given year is a long ISO year.
***REMOVED***
goog.date.isLongIsoYear = function(year) {
  var n = 5***REMOVED*** year + 12 - 4***REMOVED*** (Math.floor(year / 100) - Math.floor(year / 400));
  n += Math.floor((year - 100) / 400) - Math.floor((year - 102) / 400);
  n += Math.floor((year - 200) / 400) - Math.floor((year - 199) / 400);

  return n % 28 < 5;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the number of days for a given month.
***REMOVED***
***REMOVED*** @param {number} year Year part of date.
***REMOVED*** @param {number} month Month part of date.
***REMOVED*** @return {number} The number of days for the given month.
***REMOVED***
goog.date.getNumberOfDaysInMonth = function(year, month) {
  switch (month) {
    case goog.date.month.FEB:
      return goog.date.isLeapYear(year) ? 29 : 28;
    case goog.date.month.JUN:
    case goog.date.month.SEP:
    case goog.date.month.NOV:
    case goog.date.month.APR:
      return 30;
  }
  return 31;
***REMOVED***


***REMOVED***
***REMOVED*** Returns true if the 2 dates are in the same day.
***REMOVED*** @param {goog.date.DateLike} date The time to check.
***REMOVED*** @param {goog.date.DateLike=} opt_now The current time.
***REMOVED*** @return {boolean} Whether the dates are on the same day.
***REMOVED***
goog.date.isSameDay = function(date, opt_now) {
  var now = opt_now || new Date(goog.now());
  return date.getDate() == now.getDate() &&
      goog.date.isSameMonth(date, now);
***REMOVED***


***REMOVED***
***REMOVED*** Returns true if the 2 dates are in the same month.
***REMOVED*** @param {goog.date.DateLike} date The time to check.
***REMOVED*** @param {goog.date.DateLike=} opt_now The current time.
***REMOVED*** @return {boolean} Whether the dates are in the same calendar month.
***REMOVED***
goog.date.isSameMonth = function(date, opt_now) {
  var now = opt_now || new Date(goog.now());
  return date.getMonth() == now.getMonth() &&
      goog.date.isSameYear(date, now);
***REMOVED***


***REMOVED***
***REMOVED*** Returns true if the 2 dates are in the same year.
***REMOVED*** @param {goog.date.DateLike} date The time to check.
***REMOVED*** @param {goog.date.DateLike=} opt_now The current time.
***REMOVED*** @return {boolean} Whether the dates are in the same calendar year.
***REMOVED***
goog.date.isSameYear = function(date, opt_now) {
  var now = opt_now || new Date(goog.now());
  return date.getFullYear() == now.getFullYear();
***REMOVED***


***REMOVED***
***REMOVED*** Static function for week number calculation. ISO 8601 implementation.
***REMOVED***
***REMOVED*** @param {number} year Year part of date.
***REMOVED*** @param {number} month Month part of date (0-11).
***REMOVED*** @param {number} date Day part of date (1-31).
***REMOVED*** @param {number=} opt_weekDay Cut off weekday, defaults to Thursday.
***REMOVED*** @param {number=} opt_firstDayOfWeek First day of the week, defaults to
***REMOVED***     Monday.
***REMOVED***     Monday=0, Sunday=6.
***REMOVED*** @return {number} The week number (1-53).
***REMOVED***
goog.date.getWeekNumber = function(year, month, date, opt_weekDay,
    opt_firstDayOfWeek) {
  var d = new Date(year, month, date);

  // Default to Thursday for cut off as per ISO 8601.
  var cutoff = opt_weekDay || goog.date.weekDay.THU;

  // Default to Monday for first day of the week as per ISO 8601.
  var firstday = opt_firstDayOfWeek || goog.date.weekDay.MON;

  // 1 day in milliseconds.
  var ONE_DAY = 24***REMOVED*** 60***REMOVED*** 60***REMOVED*** 1000;

  // The d.getDay() has to be converted first to ISO weekday (Monday=0).
  var isoday = (d.getDay() + 6) % 7;

  // Position of given day in the picker grid w.r.t. first day of week
  var daypos = (isoday - firstday + 7) % 7;

  // Position of cut off day in the picker grid w.r.t. first day of week
  var cutoffpos = (cutoff - firstday + 7) % 7;

  // Unix timestamp of the midnight of the cutoff day in the week of 'd'.
  // There might be +-1 hour shift in the result due to the daylight saving,
  // but it doesn't affect the year.
  var cutoffSameWeek = d.valueOf() + (cutoffpos - daypos)***REMOVED*** ONE_DAY;

  // Unix timestamp of January 1 in the year of 'cutoffSameWeek'.
  var jan1 = new Date(new Date(cutoffSameWeek).getFullYear(), 0, 1).valueOf();

  // Number of week. The round() eliminates the effect of daylight saving.
  return Math.floor(Math.round((cutoffSameWeek - jan1) / ONE_DAY) / 7) + 1;
***REMOVED***


***REMOVED***
***REMOVED*** Creates a DateTime from a datetime string expressed in ISO 8601 format.
***REMOVED***
***REMOVED*** @param {string} formatted A date or datetime expressed in ISO 8601 format.
***REMOVED*** @return {goog.date.DateTime} Parsed date or null if parse fails.
***REMOVED***
goog.date.fromIsoString = function(formatted) {
  var ret = new goog.date.DateTime(2000);
  return goog.date.setIso8601DateTime(ret, formatted) ? ret : null;
***REMOVED***


***REMOVED***
***REMOVED*** Parses a datetime string expressed in ISO 8601 format. Overwrites the date
***REMOVED*** and optionally the time part of the given object with the parsed values.
***REMOVED***
***REMOVED*** @param {!goog.date.DateTime} dateTime Object whose fields will be set.
***REMOVED*** @param {string} formatted A date or datetime expressed in ISO 8601 format.
***REMOVED*** @return {boolean} Whether the parsing succeeded.
***REMOVED***
goog.date.setIso8601DateTime = function(dateTime, formatted) {
  formatted = goog.string.trim(formatted);
  var delim = formatted.indexOf('T') == -1 ? ' ' : 'T';
  var parts = formatted.split(delim);
  return goog.date.setIso8601DateOnly_(dateTime, parts[0]) &&
      (parts.length < 2 || goog.date.setIso8601TimeOnly_(dateTime, parts[1]));
***REMOVED***


***REMOVED***
***REMOVED*** Sets date fields based on an ISO 8601 format string.
***REMOVED***
***REMOVED*** @param {!goog.date.DateTime} d Object whose fields will be set.
***REMOVED*** @param {string} formatted A date expressed in ISO 8601 format.
***REMOVED*** @return {boolean} Whether the parsing succeeded.
***REMOVED*** @private
***REMOVED***
goog.date.setIso8601DateOnly_ = function(d, formatted) {
  // split the formatted ISO date string into its date fields
  var parts = formatted.match(goog.date.splitDateStringRegex_);
  if (!parts) {
    return false;
  }

  var year = Number(parts[1]);
  var month = Number(parts[2]);
  var date = Number(parts[3]);
  var dayOfYear = Number(parts[4]);
  var week = Number(parts[5]);
  // ISO weekdays start with 1, native getDay() values start with 0
  var dayOfWeek = Number(parts[6]) || 1;

  d.setFullYear(year);

  if (dayOfYear) {
    d.setDate(1);
    d.setMonth(0);
    var offset = dayOfYear - 1; // offset, so 1-indexed, i.e., skip day 1
    d.add(new goog.date.Interval(goog.date.Interval.DAYS, offset));
  } else if (week) {
    goog.date.setDateFromIso8601Week_(d, week, dayOfWeek);
  } else {
    if (month) {
      d.setDate(1);
      d.setMonth(month - 1);
    }
    if (date) {
      d.setDate(date);
    }
  }

  return true;
***REMOVED***


***REMOVED***
***REMOVED*** Sets date fields based on an ISO 8601 week string.
***REMOVED*** See {@link http://en.wikipedia.org/wiki/ISO_week_date}, "Relation with the
***REMOVED*** Gregorian Calendar".  The first week of a new ISO year is the week with the
***REMOVED*** majority of its days in the new Gregorian year.  I.e., ISO Week 1's Thursday
***REMOVED*** is in that year.  ISO weeks always start on Monday. So ISO Week 1 can
***REMOVED*** contain a few days from the previous Gregorian year.  And ISO weeks always
***REMOVED*** end on Sunday, so the last ISO week (Week 52 or 53) can have a few days from
***REMOVED*** the following Gregorian year.
***REMOVED*** Example: '1997-W01' lasts from 1996-12-30 to 1997-01-05.  January 1, 1997 is
***REMOVED*** a Wednesday. So W01's Monday is Dec.30, 1996, and Sunday is January 5, 1997.
***REMOVED***
***REMOVED*** @param {goog.date.DateTime} d Object whose fields will be set.
***REMOVED*** @param {number} week ISO week number.
***REMOVED*** @param {number} dayOfWeek ISO day of week.
***REMOVED*** @private
***REMOVED***
goog.date.setDateFromIso8601Week_ = function(d, week, dayOfWeek) {
  // calculate offset for first week
  d.setMonth(0);
  d.setDate(1);
  var jsDay = d.getDay();
  // switch Sunday (0) to index 7; ISO days are 1-indexed
  var jan1WeekDay = jsDay || 7;

  var THURSDAY = 4;
  if (jan1WeekDay <= THURSDAY) {
    // was extended back to Monday
    var startDelta = 1 - jan1WeekDay; // e.g., Thu(4) ==> -3
  } else {
    // was extended forward to Monday
    startDelta = 8 - jan1WeekDay; // e.g., Fri(5) ==> +3
  }

  // find the absolute number of days to offset from the start of year
  // to arrive close to the Gregorian equivalent (pending adjustments above)
  // Note: decrement week multiplier by one because 1st week is
  // represented by dayOfWeek value
  var absoluteDays = Number(dayOfWeek) + (7***REMOVED*** (Number(week) - 1));

  // convert from ISO weekday format to Gregorian calendar date
  // note: subtract 1 because 1-indexed; offset should not include 1st of month
  var delta = startDelta + absoluteDays - 1;
  var interval = new goog.date.Interval(goog.date.Interval.DAYS, delta);
  d.add(interval);
***REMOVED***


***REMOVED***
***REMOVED*** Sets time fields based on an ISO 8601 format string.
***REMOVED*** Note: only time fields, not date fields.
***REMOVED***
***REMOVED*** @param {!goog.date.DateTime} d Object whose fields will be set.
***REMOVED*** @param {string} formatted A time expressed in ISO 8601 format.
***REMOVED*** @return {boolean} Whether the parsing succeeded.
***REMOVED*** @private
***REMOVED***
goog.date.setIso8601TimeOnly_ = function(d, formatted) {
  // first strip timezone info from the end
  var parts = formatted.match(goog.date.splitTimezoneStringRegex_);

  var offset = 0; // local time if no timezone info
  if (parts) {
    if (parts[0] != 'Z') {
      offset = parts[2]***REMOVED*** 60 + Number(parts[3]);
      offset***REMOVED***= parts[1] == '-' ? 1 : -1;
    }
    offset -= d.getTimezoneOffset();
    formatted = formatted.substr(0, formatted.length - parts[0].length);
  }

  // then work out the time
  parts = formatted.match(goog.date.splitTimeStringRegex_);
  if (!parts) {
    return false;
  }

  d.setHours(Number(parts[1]));
  d.setMinutes(Number(parts[2]) || 0);
  d.setSeconds(Number(parts[3]) || 0);
  d.setMilliseconds(parts[4] ? parts[4]***REMOVED*** 1000 : 0);

  if (offset != 0) {
    // adjust the date and time according to the specified timezone
    d.setTime(d.getTime() + offset***REMOVED*** 60000);
  }

  return true;
***REMOVED***



***REMOVED***
***REMOVED*** Class representing a date/time interval. Used for date calculations.
***REMOVED*** <pre>
***REMOVED*** new goog.date.Interval(0, 1) // One month
***REMOVED*** new goog.date.Interval(0, 0, 3, 1) // Three days and one hour
***REMOVED*** new goog.date.Interval(goog.date.Interval.DAYS, 1) // One day
***REMOVED*** </pre>
***REMOVED***
***REMOVED*** @param {number|string=} opt_years Years or string representing date part.
***REMOVED*** @param {number=} opt_months Months or number of whatever date part specified
***REMOVED***     by first parameter.
***REMOVED*** @param {number=} opt_days Days.
***REMOVED*** @param {number=} opt_hours Hours.
***REMOVED*** @param {number=} opt_minutes Minutes.
***REMOVED*** @param {number=} opt_seconds Seconds.
***REMOVED***
***REMOVED***
goog.date.Interval = function(opt_years, opt_months, opt_days, opt_hours,
                              opt_minutes, opt_seconds) {
  if (goog.isString(opt_years)) {
    var type = opt_years;
    var interval =***REMOVED*****REMOVED*** @type {number}***REMOVED*** (opt_months);
    this.years = type == goog.date.Interval.YEARS ? interval : 0;
    this.months = type == goog.date.Interval.MONTHS ? interval : 0;
    this.days = type == goog.date.Interval.DAYS ? interval : 0;
    this.hours = type == goog.date.Interval.HOURS ? interval : 0;
    this.minutes = type == goog.date.Interval.MINUTES ? interval : 0;
    this.seconds = type == goog.date.Interval.SECONDS ? interval : 0;
  } else {
    this.years =***REMOVED*****REMOVED*** @type {number}***REMOVED*** (opt_years) || 0;
    this.months = opt_months || 0;
    this.days = opt_days || 0;
    this.hours = opt_hours || 0;
    this.minutes = opt_minutes || 0;
    this.seconds = opt_seconds || 0;
  }
***REMOVED***


***REMOVED***
***REMOVED*** Parses an XML Schema duration (ISO 8601 extended).
***REMOVED*** @see http://www.w3.org/TR/xmlschema-2/#duration
***REMOVED***
***REMOVED*** @param  {string} duration An XML schema duration in textual format.
***REMOVED***     Recurring durations and weeks are not supported.
***REMOVED*** @return {goog.date.Interval} The duration as a goog.date.Interval or null
***REMOVED***     if the parse fails.
***REMOVED***
goog.date.Interval.fromIsoString = function(duration) {
  var parts = duration.match(goog.date.splitDurationRegex_);
  if (!parts) {
    return null;
  }

  var timeEmpty = !(parts[6] || parts[7] || parts[8]);
  var dateTimeEmpty = timeEmpty && !(parts[2] || parts[3] || parts[4]);
  if (dateTimeEmpty || timeEmpty && parts[5]) {
    return null;
  }

  var negative = parts[1];
  var years = parseInt(parts[2], 10) || 0;
  var months = parseInt(parts[3], 10) || 0;
  var days = parseInt(parts[4], 10) || 0;
  var hours = parseInt(parts[6], 10) || 0;
  var minutes = parseInt(parts[7], 10) || 0;
  var seconds = parseFloat(parts[8]) || 0;
  return negative ? new goog.date.Interval(-years, -months, -days,
                                           -hours, -minutes, -seconds) :
                    new goog.date.Interval(years, months, days,
                                           hours, minutes, seconds);
***REMOVED***


***REMOVED***
***REMOVED*** Serializes goog.date.Interval into XML Schema duration (ISO 8601 extended).
***REMOVED*** @see http://www.w3.org/TR/xmlschema-2/#duration
***REMOVED***
***REMOVED*** @param {boolean=} opt_verbose Include zero fields in the duration string.
***REMOVED*** @return {?string} An XML schema duration in ISO 8601 extended format,
***REMOVED***     or null if the interval contains both positive and negative fields.
***REMOVED***
goog.date.Interval.prototype.toIsoString = function(opt_verbose) {
  var minField = Math.min(this.years, this.months, this.days,
                          this.hours, this.minutes, this.seconds);
  var maxField = Math.max(this.years, this.months, this.days,
                          this.hours, this.minutes, this.seconds);
  if (minField < 0 && maxField > 0) {
    return null;
  }

  // Return 0 seconds if all fields are zero.
  if (!opt_verbose && minField == 0 && maxField == 0) {
    return 'PT0S';
  }

  var res = [];

  // Add sign and 'P' prefix.
  if (minField < 0) {
    res.push('-');
  }
  res.push('P');

  // Add date.
  if (this.years || opt_verbose) {
    res.push(Math.abs(this.years) + 'Y');
  }
  if (this.months || opt_verbose) {
    res.push(Math.abs(this.months) + 'M');
  }
  if (this.days || opt_verbose) {
    res.push(Math.abs(this.days) + 'D');
  }

  // Add time.
  if (this.hours || this.minutes || this.seconds || opt_verbose) {
    res.push('T');
    if (this.hours || opt_verbose) {
      res.push(Math.abs(this.hours) + 'H');
    }
    if (this.minutes || opt_verbose) {
      res.push(Math.abs(this.minutes) + 'M');
    }
    if (this.seconds || opt_verbose) {
      res.push(Math.abs(this.seconds) + 'S');
    }
  }

  return res.join('');
***REMOVED***


***REMOVED***
***REMOVED*** Tests whether the given interval is equal to this interval.
***REMOVED*** Note, this is a simple field-by-field comparison, it doesn't
***REMOVED*** account for comparisons like "12 months == 1 year".
***REMOVED***
***REMOVED*** @param {goog.date.Interval} other The interval to test.
***REMOVED*** @return {boolean} Whether the intervals are equal.
***REMOVED***
goog.date.Interval.prototype.equals = function(other) {
  return other.years == this.years &&
         other.months == this.months &&
         other.days == this.days &&
         other.hours == this.hours &&
         other.minutes == this.minutes &&
         other.seconds == this.seconds;
***REMOVED***


***REMOVED***
***REMOVED*** @return {!goog.date.Interval} A clone of the interval object.
***REMOVED***
goog.date.Interval.prototype.clone = function() {
  return new goog.date.Interval(
      this.years, this.months, this.days,
      this.hours, this.minutes, this.seconds);
***REMOVED***


***REMOVED***
***REMOVED*** Years constant for the date parts.
***REMOVED*** @type {string}
***REMOVED***
goog.date.Interval.YEARS = 'y';


***REMOVED***
***REMOVED*** Months constant for the date parts.
***REMOVED*** @type {string}
***REMOVED***
goog.date.Interval.MONTHS = 'm';


***REMOVED***
***REMOVED*** Days constant for the date parts.
***REMOVED*** @type {string}
***REMOVED***
goog.date.Interval.DAYS = 'd';


***REMOVED***
***REMOVED*** Hours constant for the date parts.
***REMOVED*** @type {string}
***REMOVED***
goog.date.Interval.HOURS = 'h';


***REMOVED***
***REMOVED*** Minutes constant for the date parts.
***REMOVED*** @type {string}
***REMOVED***
goog.date.Interval.MINUTES = 'n';


***REMOVED***
***REMOVED*** Seconds constant for the date parts.
***REMOVED*** @type {string}
***REMOVED***
goog.date.Interval.SECONDS = 's';


***REMOVED***
***REMOVED*** @return {boolean} Whether all fields of the interval are zero.
***REMOVED***
goog.date.Interval.prototype.isZero = function() {
  return this.years == 0 &&
         this.months == 0 &&
         this.days == 0 &&
         this.hours == 0 &&
         this.minutes == 0 &&
         this.seconds == 0;
***REMOVED***


***REMOVED***
***REMOVED*** @return {!goog.date.Interval} Negative of this interval.
***REMOVED***
goog.date.Interval.prototype.getInverse = function() {
  return this.times(-1);
***REMOVED***


***REMOVED***
***REMOVED*** Calculates n***REMOVED*** (this interval) by memberwise multiplication.
***REMOVED*** @param {number} n An integer.
***REMOVED*** @return {!goog.date.Interval} n***REMOVED*** this.
***REMOVED***
goog.date.Interval.prototype.times = function(n) {
  return new goog.date.Interval(this.years***REMOVED*** n,
                                this.months***REMOVED*** n,
                                this.days***REMOVED*** n,
                                this.hours***REMOVED*** n,
                                this.minutes***REMOVED*** n,
                                this.seconds***REMOVED*** n);
***REMOVED***


***REMOVED***
***REMOVED*** Gets the total number of seconds in the time interval. Assumes that months
***REMOVED*** and years are empty.
***REMOVED*** @return {number} Total number of seconds in the interval.
***REMOVED***
goog.date.Interval.prototype.getTotalSeconds = function() {
  goog.asserts.assert(this.years == 0 && this.months == 0);
  return ((this.days***REMOVED*** 24 + this.hours)***REMOVED*** 60 + this.minutes)***REMOVED*** 60 +
      this.seconds;
***REMOVED***


***REMOVED***
***REMOVED*** Adds the Interval in the argument to this Interval field by field.
***REMOVED***
***REMOVED*** @param {goog.date.Interval} interval The Interval to add.
***REMOVED***
goog.date.Interval.prototype.add = function(interval) {
  this.years += interval.years;
  this.months += interval.months;
  this.days += interval.days;
  this.hours += interval.hours;
  this.minutes += interval.minutes;
  this.seconds += interval.seconds;
***REMOVED***



***REMOVED***
***REMOVED*** Class representing a date. Defaults to current date if none is specified.
***REMOVED***
***REMOVED*** Implements most methods of the native js Date object (except the time related
***REMOVED*** ones, {@see goog.date.DateTime}) and can be used interchangeably with it just
***REMOVED*** as if goog.date.Date was a synonym of Date. To make this more transparent,
***REMOVED*** Closure APIs should accept goog.date.DateLike instead of the real Date
***REMOVED*** object.
***REMOVED***
***REMOVED*** To allow goog.date.Date objects to be passed as arguments to methods
***REMOVED*** expecting Date objects this class is marked as extending the built in Date
***REMOVED*** object even though that's not strictly true.
***REMOVED***
***REMOVED*** @param {number|Object=} opt_year Four digit year or a date-like object. If
***REMOVED***     not set, the created object will contain the date determined by
***REMOVED***     goog.now().
***REMOVED*** @param {number=} opt_month Month, 0 = Jan, 11 = Dec.
***REMOVED*** @param {number=} opt_date Date of month, 1 - 31.
***REMOVED***
***REMOVED*** @see goog.date.DateTime
***REMOVED***
goog.date.Date = function(opt_year, opt_month, opt_date) {
  // goog.date.DateTime assumes that only this.date_ is added in this ctor.
  if (goog.isNumber(opt_year)) {
    this.date_ = new Date(opt_year, opt_month || 0, opt_date || 1);
    this.maybeFixDst_(opt_date || 1);
  } else if (goog.isObject(opt_year)) {
    this.date_ = new Date(opt_year.getFullYear(), opt_year.getMonth(),
                          opt_year.getDate());
    this.maybeFixDst_(opt_year.getDate());
  } else {
    this.date_ = new Date(goog.now());
    this.date_.setHours(0);
    this.date_.setMinutes(0);
    this.date_.setSeconds(0);
    this.date_.setMilliseconds(0);
  }
***REMOVED***


***REMOVED***
***REMOVED*** First day of week. 0 = Mon, 6 = Sun.
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.date.Date.prototype.firstDayOfWeek_ =
    goog.i18n.DateTimeSymbols.FIRSTDAYOFWEEK;


***REMOVED***
***REMOVED*** The cut off weekday used for week number calculations. 0 = Mon, 6 = Sun.
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.date.Date.prototype.firstWeekCutOffDay_ =
    goog.i18n.DateTimeSymbols.FIRSTWEEKCUTOFFDAY;


***REMOVED***
***REMOVED*** @return {!goog.date.Date} A clone of the date object.
***REMOVED***
goog.date.Date.prototype.clone = function() {
  var date = new goog.date.Date(this.date_);
  date.firstDayOfWeek_ = this.firstDayOfWeek_;
  date.firstWeekCutOffDay_ = this.firstWeekCutOffDay_;

  return date;
***REMOVED***


***REMOVED***
***REMOVED*** @return {number} The four digit year of date.
***REMOVED***
goog.date.Date.prototype.getFullYear = function() {
  return this.date_.getFullYear();
***REMOVED***


***REMOVED***
***REMOVED*** Alias for getFullYear.
***REMOVED***
***REMOVED*** @return {number} The four digit year of date.
***REMOVED*** @see #getFullyear
***REMOVED***
goog.date.Date.prototype.getYear = function() {
  return this.getFullYear();
***REMOVED***


***REMOVED***
***REMOVED*** @return {goog.date.month} The month of date, 0 = Jan, 11 = Dec.
***REMOVED***
goog.date.Date.prototype.getMonth = function() {
  return***REMOVED*****REMOVED*** @type {goog.date.month}***REMOVED*** (this.date_.getMonth());
***REMOVED***


***REMOVED***
***REMOVED*** @return {number} The date of month.
***REMOVED***
goog.date.Date.prototype.getDate = function() {
  return this.date_.getDate();
***REMOVED***


***REMOVED***
***REMOVED*** Returns the number of milliseconds since 1 January 1970 00:00:00.
***REMOVED***
***REMOVED*** @return {number} The number of milliseconds since 1 January 1970 00:00:00.
***REMOVED***
goog.date.Date.prototype.getTime = function() {
  return this.date_.getTime();
***REMOVED***


***REMOVED***
***REMOVED*** @return {goog.date.weekDay} The day of week, US style. 0 = Sun, 6 = Sat.
***REMOVED***
goog.date.Date.prototype.getDay = function() {
  return***REMOVED*****REMOVED*** @type {goog.date.weekDay}***REMOVED*** (this.date_.getDay());
***REMOVED***


***REMOVED***
***REMOVED*** @return {number} The day of week, ISO style. 0 = Mon, 6 = Sun.
***REMOVED***
goog.date.Date.prototype.getIsoWeekday = function() {
  return (this.getDay() + 6) % 7;
***REMOVED***


***REMOVED***
***REMOVED*** @return {number} The day of week according to firstDayOfWeek setting.
***REMOVED***
goog.date.Date.prototype.getWeekday = function() {
  return (this.getIsoWeekday() - this.firstDayOfWeek_ + 7) % 7;
***REMOVED***


***REMOVED***
***REMOVED*** @return {number} The four digit year of date according to universal time.
***REMOVED***
goog.date.Date.prototype.getUTCFullYear = function() {
  return this.date_.getUTCFullYear();
***REMOVED***


***REMOVED***
***REMOVED*** @return {goog.date.month} The month of date according to universal time,
***REMOVED***     0 = Jan, 11 = Dec.
***REMOVED***
goog.date.Date.prototype.getUTCMonth = function() {
  return***REMOVED*****REMOVED*** @type {goog.date.month}***REMOVED*** (this.date_.getUTCMonth());
***REMOVED***


***REMOVED***
***REMOVED*** @return {number} The date of month according to universal time.
***REMOVED***
goog.date.Date.prototype.getUTCDate = function() {
  return this.date_.getUTCDate();
***REMOVED***


***REMOVED***
***REMOVED*** @return {goog.date.weekDay} The day of week according to universal time,
***REMOVED***     US style. 0 = Sun, 1 = Mon, 6 = Sat.
***REMOVED***
goog.date.Date.prototype.getUTCDay = function() {
  return***REMOVED*****REMOVED*** @type {goog.date.weekDay}***REMOVED*** (this.date_.getDay());
***REMOVED***


***REMOVED***
***REMOVED*** @return {number} The hours value according to universal time.
***REMOVED***
goog.date.Date.prototype.getUTCHours = function() {
  return this.date_.getUTCHours();
***REMOVED***


***REMOVED***
***REMOVED*** @return {number} The hours value according to universal time.
***REMOVED***
goog.date.Date.prototype.getUTCMinutes = function() {
  return this.date_.getUTCMinutes();
***REMOVED***


***REMOVED***
***REMOVED*** @return {number} The day of week according to universal time, ISO style.
***REMOVED***     0 = Mon, 6 = Sun.
***REMOVED***
goog.date.Date.prototype.getUTCIsoWeekday = function() {
  return (this.date_.getUTCDay() + 6) % 7;
***REMOVED***


***REMOVED***
***REMOVED*** @return {number} The day of week according to universal time and
***REMOVED***     firstDayOfWeek setting.
***REMOVED***
goog.date.Date.prototype.getUTCWeekday = function() {
  return (this.getUTCIsoWeekday() - this.firstDayOfWeek_ + 7) % 7;
***REMOVED***


***REMOVED***
***REMOVED*** @return {number} The first day of the week. 0 = Mon, 6 = Sun.
***REMOVED***
goog.date.Date.prototype.getFirstDayOfWeek = function() {
  return this.firstDayOfWeek_;
***REMOVED***


***REMOVED***
***REMOVED*** @return {number} The cut off weekday used for week number calculations.
***REMOVED***     0 = Mon, 6 = Sun.
***REMOVED***
goog.date.Date.prototype.getFirstWeekCutOffDay = function() {
  return this.firstWeekCutOffDay_;
***REMOVED***


***REMOVED***
***REMOVED*** @return {number} The number of days for the selected month.
***REMOVED***
goog.date.Date.prototype.getNumberOfDaysInMonth = function() {
  return goog.date.getNumberOfDaysInMonth(this.getFullYear(), this.getMonth());
***REMOVED***


***REMOVED***
***REMOVED*** @return {number} The week number.
***REMOVED***
goog.date.Date.prototype.getWeekNumber = function() {
  return goog.date.getWeekNumber(
      this.getFullYear(), this.getMonth(), this.getDate(),
      this.firstWeekCutOffDay_, this.firstDayOfWeek_);
***REMOVED***


***REMOVED***
***REMOVED*** @return {number} The day of year.
***REMOVED***
goog.date.Date.prototype.getDayOfYear = function() {
  var dayOfYear = this.getDate();
  var year = this.getFullYear();
  for (var m = this.getMonth() - 1; m >= 0; m--) {
    dayOfYear += goog.date.getNumberOfDaysInMonth(year, m);
  }

  return dayOfYear;
***REMOVED***


***REMOVED***
***REMOVED*** Returns timezone offset. The timezone offset is the delta in minutes between
***REMOVED*** UTC and your local time. E.g., UTC+10 returns -600. Daylight savings time
***REMOVED*** prevents this value from being constant.
***REMOVED***
***REMOVED*** @return {number} The timezone offset.
***REMOVED***
goog.date.Date.prototype.getTimezoneOffset = function() {
  return this.date_.getTimezoneOffset();
***REMOVED***


***REMOVED***
***REMOVED*** Returns timezone offset as a string. Returns offset in [+-]HH:mm format or Z
***REMOVED*** for UTC.
***REMOVED***
***REMOVED*** @return {string} The timezone offset as a string.
***REMOVED***
goog.date.Date.prototype.getTimezoneOffsetString = function() {
  var tz;
  var offset = this.getTimezoneOffset();

  if (offset == 0) {
    tz = 'Z';
  } else {
    var n = Math.abs(offset) / 60;
    var h = Math.floor(n);
    var m = (n - h)***REMOVED*** 60;
    tz = (offset > 0 ? '-' : '+') +
        goog.string.padNumber(h, 2) + ':' +
        goog.string.padNumber(m, 2);
  }

  return tz;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the date.
***REMOVED***
***REMOVED*** @param {goog.date.Date} date Date object to set date from.
***REMOVED***
goog.date.Date.prototype.set = function(date) {
  this.date_ = new Date(date.getFullYear(), date.getMonth(), date.getDate());
***REMOVED***


***REMOVED***
***REMOVED*** Sets the year part of the date.
***REMOVED***
***REMOVED*** @param {number} year Four digit year.
***REMOVED***
goog.date.Date.prototype.setFullYear = function(year) {
  this.date_.setFullYear(year);
***REMOVED***


***REMOVED***
***REMOVED*** Alias for setFullYear.
***REMOVED***
***REMOVED*** @param {number} year Four digit year.
***REMOVED*** @see #setFullYear
***REMOVED***
goog.date.Date.prototype.setYear = function(year) {
  this.setFullYear(year);
***REMOVED***


***REMOVED***
***REMOVED*** Sets the month part of the date.
***REMOVED***
***REMOVED*** TODO(nnaze): Update type to goog.date.month.
***REMOVED***
***REMOVED*** @param {number} month The month, where 0 = Jan, 11 = Dec.
***REMOVED***
goog.date.Date.prototype.setMonth = function(month) {
  this.date_.setMonth(month);
***REMOVED***


***REMOVED***
***REMOVED*** Sets the day part of the date.
***REMOVED***
***REMOVED*** @param {number} date The day part.
***REMOVED***
goog.date.Date.prototype.setDate = function(date) {
  this.date_.setDate(date);
***REMOVED***


***REMOVED***
***REMOVED*** Sets the value of the date object as expressed in the number of milliseconds
***REMOVED*** since 1 January 1970 00:00:00.
***REMOVED***
***REMOVED*** @param {number} ms Number of milliseconds since 1 Jan 1970.
***REMOVED***
goog.date.Date.prototype.setTime = function(ms) {
  this.date_.setTime(ms);
***REMOVED***


***REMOVED***
***REMOVED*** Sets the year part of the date according to universal time.
***REMOVED***
***REMOVED*** @param {number} year Four digit year.
***REMOVED***
goog.date.Date.prototype.setUTCFullYear = function(year) {
  this.date_.setUTCFullYear(year);
***REMOVED***


***REMOVED***
***REMOVED*** Sets the month part of the date according to universal time.
***REMOVED***
***REMOVED*** @param {number} month The month, where 0 = Jan, 11 = Dec.
***REMOVED***
goog.date.Date.prototype.setUTCMonth = function(month) {
  this.date_.setUTCMonth(month);
***REMOVED***


***REMOVED***
***REMOVED*** Sets the day part of the date according to universal time.
***REMOVED***
***REMOVED*** @param {number} date The UTC date.
***REMOVED***
goog.date.Date.prototype.setUTCDate = function(date) {
  this.date_.setUTCDate(date);
***REMOVED***


***REMOVED***
***REMOVED*** Sets the first day of week.
***REMOVED***
***REMOVED*** @param {number} day 0 = Mon, 6 = Sun.
***REMOVED***
goog.date.Date.prototype.setFirstDayOfWeek = function(day) {
  this.firstDayOfWeek_ = day;
***REMOVED***


***REMOVED***
***REMOVED*** Sets cut off weekday used for week number calculations. 0 = Mon, 6 = Sun.
***REMOVED***
***REMOVED*** @param {number} day The cut off weekday.
***REMOVED***
goog.date.Date.prototype.setFirstWeekCutOffDay = function(day) {
  this.firstWeekCutOffDay_ = day;
***REMOVED***


***REMOVED***
***REMOVED*** Performs date calculation by adding the supplied interval to the date.
***REMOVED***
***REMOVED*** @param {goog.date.Interval} interval Date interval to add.
***REMOVED***
goog.date.Date.prototype.add = function(interval) {
  if (interval.years || interval.months) {
    // As months have different number of days adding a month to Jan 31 by just
    // setting the month would result in a date in early March rather than Feb
    // 28 or 29. Doing it this way overcomes that problem.

    // adjust year and month, accounting for both directions
    var month = this.getMonth() + interval.months + interval.years***REMOVED*** 12;
    var year = this.getYear() + Math.floor(month / 12);
    month %= 12;
    if (month < 0) {
      month += 12;
    }

    var daysInTargetMonth = goog.date.getNumberOfDaysInMonth(year, month);
    var date = Math.min(daysInTargetMonth, this.getDate());

    // avoid inadvertently causing rollovers to adjacent months
    this.setDate(1);

    this.setFullYear(year);
    this.setMonth(month);
    this.setDate(date);
  }

  if (interval.days) {
    // Convert the days to milliseconds and add it to the UNIX timestamp.
    // Taking noon helps to avoid 1 day error due to the daylight saving.
    var noon = new Date(this.getYear(), this.getMonth(), this.getDate(), 12);
    var result = new Date(noon.getTime() + interval.days***REMOVED*** 86400000);

    // Set date to 1 to prevent rollover caused by setting the year or month.
    this.setDate(1);
    this.setFullYear(result.getFullYear());
    this.setMonth(result.getMonth());
    this.setDate(result.getDate());

    this.maybeFixDst_(result.getDate());
  }
***REMOVED***


***REMOVED***
***REMOVED*** Returns ISO 8601 string representation of date.
***REMOVED***
***REMOVED*** @param {boolean=} opt_verbose Whether the verbose format should be used
***REMOVED***     instead of the default compact one.
***REMOVED*** @param {boolean=} opt_tz Whether the timezone offset should be included
***REMOVED***     in the string.
***REMOVED*** @return {string} ISO 8601 string representation of date.
***REMOVED***
goog.date.Date.prototype.toIsoString = function(opt_verbose, opt_tz) {
  var str = [
    this.getFullYear(),
    goog.string.padNumber(this.getMonth() + 1, 2),
    goog.string.padNumber(this.getDate(), 2)
  ];

  return str.join((opt_verbose) ? '-' : '') +
         (opt_tz ? this.getTimezoneOffsetString() : '');
***REMOVED***


***REMOVED***
***REMOVED*** Returns ISO 8601 string representation of date according to universal time.
***REMOVED***
***REMOVED*** @param {boolean=} opt_verbose Whether the verbose format should be used
***REMOVED***     instead of the default compact one.
***REMOVED*** @param {boolean=} opt_tz Whether the timezone offset should be included in
***REMOVED***     the string.
***REMOVED*** @return {string} ISO 8601 string representation of date according to
***REMOVED***     universal time.
***REMOVED***
goog.date.Date.prototype.toUTCIsoString = function(opt_verbose, opt_tz) {
  var str = [
    this.getUTCFullYear(),
    goog.string.padNumber(this.getUTCMonth() + 1, 2),
    goog.string.padNumber(this.getUTCDate(), 2)
  ];

  return str.join((opt_verbose) ? '-' : '') + (opt_tz ? 'Z' : '');
***REMOVED***


***REMOVED***
***REMOVED*** Tests whether given date is equal to this Date.
***REMOVED*** Note: This ignores units more precise than days (hours and below)
***REMOVED*** and also ignores timezone considerations.
***REMOVED***
***REMOVED*** @param {goog.date.Date} other The date to compare.
***REMOVED*** @return {boolean} Whether the given date is equal to this one.
***REMOVED***
goog.date.Date.prototype.equals = function(other) {
  return this.getYear() == other.getYear() &&
         this.getMonth() == other.getMonth() &&
         this.getDate() == other.getDate();
***REMOVED***


***REMOVED***
***REMOVED*** Overloaded toString method for object.
***REMOVED*** @return {string} ISO 8601 string representation of date.
***REMOVED*** @override
***REMOVED***
goog.date.Date.prototype.toString = function() {
  return this.toIsoString();
***REMOVED***


***REMOVED***
***REMOVED*** Fixes date to account for daylight savings time in browsers that fail to do
***REMOVED*** so automatically.
***REMOVED*** @param {number} expected Expected date.
***REMOVED*** @private
***REMOVED***
goog.date.Date.prototype.maybeFixDst_ = function(expected) {
  if (this.getDate() != expected) {
    var dir = this.getDate() < expected ? 1 : -1;
    this.date_.setUTCHours(this.date_.getUTCHours() + dir);
  }
***REMOVED***


***REMOVED***
***REMOVED*** @return {number} Value of wrapped date.
***REMOVED*** @override
***REMOVED***
goog.date.Date.prototype.valueOf = function() {
  return this.date_.valueOf();
***REMOVED***


***REMOVED***
***REMOVED*** Compares two dates.  May be used as a sorting function.
***REMOVED*** @see goog.array.sort
***REMOVED*** @param {!goog.date.DateLike} date1 Date to compare.
***REMOVED*** @param {!goog.date.DateLike} date2 Date to compare.
***REMOVED*** @return {number} Comparison result. 0 if dates are the same, less than 0 if
***REMOVED***     date1 is earlier than date2, greater than 0 if date1 is later than date2.
***REMOVED***
goog.date.Date.compare = function(date1, date2) {
  return date1.getTime() - date2.getTime();
***REMOVED***



***REMOVED***
***REMOVED*** Class representing a date and time. Defaults to current date and time if none
***REMOVED*** is specified.
***REMOVED***
***REMOVED*** Implements most methods of the native js Date object and can be used
***REMOVED*** interchangeably with it just as if goog.date.DateTime was a subclass of Date.
***REMOVED***
***REMOVED*** @param {number|Object=} opt_year Four digit year or a date-like object. If
***REMOVED***     not set, the created object will contain the date determined by
***REMOVED***     goog.now().
***REMOVED*** @param {number=} opt_month Month, 0 = Jan, 11 = Dec.
***REMOVED*** @param {number=} opt_date Date of month, 1 - 31.
***REMOVED*** @param {number=} opt_hours Hours, 0 - 24.
***REMOVED*** @param {number=} opt_minutes Minutes, 0 - 59.
***REMOVED*** @param {number=} opt_seconds Seconds, 0 - 61.
***REMOVED*** @param {number=} opt_milliseconds Milliseconds, 0 - 999.
***REMOVED***
***REMOVED*** @extends {goog.date.Date}
***REMOVED***
goog.date.DateTime = function(opt_year, opt_month, opt_date, opt_hours,
                              opt_minutes, opt_seconds, opt_milliseconds) {
  if (goog.isNumber(opt_year)) {
    this.date_ = new Date(opt_year, opt_month || 0, opt_date || 1,
                          opt_hours || 0, opt_minutes || 0, opt_seconds || 0,
                          opt_milliseconds || 0);
  } else {
    this.date_ = new Date(opt_year ? opt_year.getTime() : goog.now());
  }
***REMOVED***
goog.inherits(goog.date.DateTime, goog.date.Date);


***REMOVED***
***REMOVED*** Creates a DateTime from a datetime string expressed in RFC 822 format.
***REMOVED***
***REMOVED*** @param {string} formatted A date or datetime expressed in RFC 822 format.
***REMOVED*** @return {goog.date.DateTime} Parsed date or null if parse fails.
***REMOVED***
goog.date.DateTime.fromRfc822String = function(formatted) {
  var date = new Date(formatted);
  return !isNaN(date.getTime()) ? new goog.date.DateTime(date) : null;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the hours part of the datetime.
***REMOVED***
***REMOVED*** @return {number} An integer between 0 and 23, representing the hour.
***REMOVED***
goog.date.DateTime.prototype.getHours = function() {
  return this.date_.getHours();
***REMOVED***


***REMOVED***
***REMOVED*** Returns the minutes part of the datetime.
***REMOVED***
***REMOVED*** @return {number} An integer between 0 and 59, representing the minutes.
***REMOVED***
goog.date.DateTime.prototype.getMinutes = function() {
  return this.date_.getMinutes();
***REMOVED***


***REMOVED***
***REMOVED*** Returns the seconds part of the datetime.
***REMOVED***
***REMOVED*** @return {number} An integer between 0 and 59, representing the seconds.
***REMOVED***
goog.date.DateTime.prototype.getSeconds = function() {
  return this.date_.getSeconds();
***REMOVED***


***REMOVED***
***REMOVED*** Returns the milliseconds part of the datetime.
***REMOVED***
***REMOVED*** @return {number} An integer between 0 and 999, representing the milliseconds.
***REMOVED***
goog.date.DateTime.prototype.getMilliseconds = function() {
  return this.date_.getMilliseconds();
***REMOVED***


***REMOVED***
***REMOVED*** Returns the day of week according to universal time, US style.
***REMOVED***
***REMOVED*** @return {goog.date.weekDay} Day of week, 0 = Sun, 1 = Mon, 6 = Sat.
***REMOVED*** @override
***REMOVED***
goog.date.DateTime.prototype.getUTCDay = function() {
  return***REMOVED*****REMOVED*** @type {goog.date.weekDay}***REMOVED*** (this.date_.getUTCDay());
***REMOVED***


***REMOVED***
***REMOVED*** Returns the hours part of the datetime according to universal time.
***REMOVED***
***REMOVED*** @return {number} An integer between 0 and 23, representing the hour.
***REMOVED*** @override
***REMOVED***
goog.date.DateTime.prototype.getUTCHours = function() {
  return this.date_.getUTCHours();
***REMOVED***


***REMOVED***
***REMOVED*** Returns the minutes part of the datetime according to universal time.
***REMOVED***
***REMOVED*** @return {number} An integer between 0 and 59, representing the minutes.
***REMOVED*** @override
***REMOVED***
goog.date.DateTime.prototype.getUTCMinutes = function() {
  return this.date_.getUTCMinutes();
***REMOVED***


***REMOVED***
***REMOVED*** Returns the seconds part of the datetime according to universal time.
***REMOVED***
***REMOVED*** @return {number} An integer between 0 and 59, representing the seconds.
***REMOVED***
goog.date.DateTime.prototype.getUTCSeconds = function() {
  return this.date_.getUTCSeconds();
***REMOVED***


***REMOVED***
***REMOVED*** Returns the milliseconds part of the datetime according to universal time.
***REMOVED***
***REMOVED*** @return {number} An integer between 0 and 999, representing the milliseconds.
***REMOVED***
goog.date.DateTime.prototype.getUTCMilliseconds = function() {
  return this.date_.getUTCMilliseconds();
***REMOVED***


***REMOVED***
***REMOVED*** Sets the hours part of the datetime.
***REMOVED***
***REMOVED*** @param {number} hours An integer between 0 and 23, representing the hour.
***REMOVED***
goog.date.DateTime.prototype.setHours = function(hours) {
  this.date_.setHours(hours);
***REMOVED***


***REMOVED***
***REMOVED*** Sets the minutes part of the datetime.
***REMOVED***
***REMOVED*** @param {number} minutes Integer between 0 and 59, representing the minutes.
***REMOVED***
goog.date.DateTime.prototype.setMinutes = function(minutes) {
  this.date_.setMinutes(minutes);
***REMOVED***


***REMOVED***
***REMOVED*** Sets the seconds part of the datetime.
***REMOVED***
***REMOVED*** @param {number} seconds Integer between 0 and 59, representing the seconds.
***REMOVED***
goog.date.DateTime.prototype.setSeconds = function(seconds) {
  this.date_.setSeconds(seconds);
***REMOVED***


***REMOVED***
***REMOVED*** Sets the seconds part of the datetime.
***REMOVED***
***REMOVED*** @param {number} ms Integer between 0 and 999, representing the milliseconds.
***REMOVED***
goog.date.DateTime.prototype.setMilliseconds = function(ms) {
  this.date_.setMilliseconds(ms);
***REMOVED***


***REMOVED***
***REMOVED*** Sets the hours part of the datetime according to universal time.
***REMOVED***
***REMOVED*** @param {number} hours An integer between 0 and 23, representing the hour.
***REMOVED***
goog.date.DateTime.prototype.setUTCHours = function(hours) {
  this.date_.setUTCHours(hours);
***REMOVED***


***REMOVED***
***REMOVED*** Sets the minutes part of the datetime according to universal time.
***REMOVED***
***REMOVED*** @param {number} minutes Integer between 0 and 59, representing the minutes.
***REMOVED***
goog.date.DateTime.prototype.setUTCMinutes = function(minutes) {
  this.date_.setUTCMinutes(minutes);
***REMOVED***


***REMOVED***
***REMOVED*** Sets the seconds part of the datetime according to universal time.
***REMOVED***
***REMOVED*** @param {number} seconds Integer between 0 and 59, representing the seconds.
***REMOVED***
goog.date.DateTime.prototype.setUTCSeconds = function(seconds) {
  this.date_.setUTCSeconds(seconds);
***REMOVED***


***REMOVED***
***REMOVED*** Sets the seconds part of the datetime according to universal time.
***REMOVED***
***REMOVED*** @param {number} ms Integer between 0 and 999, representing the milliseconds.
***REMOVED***
goog.date.DateTime.prototype.setUTCMilliseconds = function(ms) {
  this.date_.setUTCMilliseconds(ms);
***REMOVED***


***REMOVED***
***REMOVED*** Performs date calculation by adding the supplied interval to the date.
***REMOVED***
***REMOVED*** @param {goog.date.Interval} interval Date interval to add.
***REMOVED*** @override
***REMOVED***
goog.date.DateTime.prototype.add = function(interval) {
  goog.date.Date.prototype.add.call(this, interval);

  if (interval.hours) {
    this.setHours(this.date_.getHours() + interval.hours);
  }
  if (interval.minutes) {
    this.setMinutes(this.date_.getMinutes() + interval.minutes);
  }
  if (interval.seconds) {
    this.setSeconds(this.date_.getSeconds() + interval.seconds);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Returns ISO 8601 string representation of date/time.
***REMOVED***
***REMOVED*** @param {boolean=} opt_verbose Whether the verbose format should be used
***REMOVED***     instead of the default compact one.
***REMOVED*** @param {boolean=} opt_tz Whether the timezone offset should be included
***REMOVED***     in the string.
***REMOVED*** @return {string} ISO 8601 string representation of date/time.
***REMOVED*** @override
***REMOVED***
goog.date.DateTime.prototype.toIsoString = function(opt_verbose, opt_tz) {
  var dateString = goog.date.Date.prototype.toIsoString.call(this, opt_verbose);

  if (opt_verbose) {
    return dateString + ' ' +
        goog.string.padNumber(this.getHours(), 2) + ':' +
        goog.string.padNumber(this.getMinutes(), 2) + ':' +
        goog.string.padNumber(this.getSeconds(), 2) +
        (opt_tz ? this.getTimezoneOffsetString() : '');
  }

  return dateString + 'T' +
      goog.string.padNumber(this.getHours(), 2) +
      goog.string.padNumber(this.getMinutes(), 2) +
      goog.string.padNumber(this.getSeconds(), 2) +
      (opt_tz ? this.getTimezoneOffsetString() : '');
***REMOVED***


***REMOVED***
***REMOVED*** Returns XML Schema 2 string representation of date/time.
***REMOVED*** The return value is also ISO 8601 compliant.
***REMOVED***
***REMOVED*** @param {boolean=} opt_timezone Should the timezone offset be included in the
***REMOVED***     string?.
***REMOVED*** @return {string} XML Schema 2 string representation of date/time.
***REMOVED***
goog.date.DateTime.prototype.toXmlDateTime = function(opt_timezone) {
  return goog.date.Date.prototype.toIsoString.call(this, true) + 'T' +
      goog.string.padNumber(this.getHours(), 2) + ':' +
      goog.string.padNumber(this.getMinutes(), 2) + ':' +
      goog.string.padNumber(this.getSeconds(), 2) +
      (opt_timezone ? this.getTimezoneOffsetString() : '');
***REMOVED***


***REMOVED***
***REMOVED*** Returns ISO 8601 string representation of date/time according to universal
***REMOVED*** time.
***REMOVED***
***REMOVED*** @param {boolean=} opt_verbose Whether the opt_verbose format should be
***REMOVED***     returned instead of the default compact one.
***REMOVED*** @param {boolean=} opt_tz Whether the the timezone offset should be included
***REMOVED***     in the string.
***REMOVED*** @return {string} ISO 8601 string representation of date/time according to
***REMOVED***     universal time.
***REMOVED*** @override
***REMOVED***
goog.date.DateTime.prototype.toUTCIsoString = function(opt_verbose, opt_tz) {
  var dateStr = goog.date.Date.prototype.toUTCIsoString.call(this, opt_verbose);

  if (opt_verbose) {
    return dateStr + ' ' +
        goog.string.padNumber(this.getUTCHours(), 2) + ':' +
        goog.string.padNumber(this.getUTCMinutes(), 2) + ':' +
        goog.string.padNumber(this.getUTCSeconds(), 2) +
        (opt_tz ? 'Z' : '');
  }

  return dateStr + 'T' +
      goog.string.padNumber(this.getUTCHours(), 2) +
      goog.string.padNumber(this.getUTCMinutes(), 2) +
      goog.string.padNumber(this.getUTCSeconds(), 2) +
      (opt_tz ? 'Z' : '');
***REMOVED***


***REMOVED***
***REMOVED*** Tests whether given datetime is exactly equal to this DateTime.
***REMOVED***
***REMOVED*** @param {goog.date.Date} other The datetime to compare.
***REMOVED*** @return {boolean} Whether the given datetime is exactly equal to this one.
***REMOVED*** @override
***REMOVED***
goog.date.DateTime.prototype.equals = function(other) {
  return this.getTime() == other.getTime();
***REMOVED***


***REMOVED***
***REMOVED*** Overloaded toString method for object.
***REMOVED*** @return {string} ISO 8601 string representation of date/time.
***REMOVED*** @override
***REMOVED***
goog.date.DateTime.prototype.toString = function() {
  return this.toIsoString();
***REMOVED***


***REMOVED***
***REMOVED*** Generates time label for the datetime, e.g., '5:30am'.
***REMOVED*** By default this does not pad hours (e.g., to '05:30') and it does add
***REMOVED*** an am/pm suffix.
***REMOVED*** TODO(user): i18n -- hardcoding time format like this is bad.  E.g., in CJK
***REMOVED***               locales, need Chinese characters for hour and minute units.
***REMOVED*** @param {boolean=} opt_padHours Whether to pad hours, e.g., '05:30' vs '5:30'.
***REMOVED*** @param {boolean=} opt_showAmPm Whether to show the 'am' and 'pm' suffix.
***REMOVED*** @param {boolean=} opt_omitZeroMinutes E.g., '5:00pm' becomes '5pm',
***REMOVED***                                      but '5:01pm' remains '5:01pm'.
***REMOVED*** @return {string} The time label.
***REMOVED***
goog.date.DateTime.prototype.toUsTimeString = function(opt_padHours,
                                                       opt_showAmPm,
                                                       opt_omitZeroMinutes) {
  var hours = this.getHours();

  // show am/pm marker by default
  if (!goog.isDef(opt_showAmPm)) {
    opt_showAmPm = true;
  }

  // 12pm
  var isPM = hours == 12;

  // change from 1-24 to 1-12 basis
  if (hours > 12) {
    hours -= 12;
    isPM = true;
  }

  // midnight is expressed as "12am", but if am/pm marker omitted, keep as '0'
  if (hours == 0 && opt_showAmPm) {
    hours = 12;
  }

  var label = opt_padHours ? goog.string.padNumber(hours, 2) : String(hours);
  var minutes = this.getMinutes();
  if (!opt_omitZeroMinutes || minutes > 0) {
    label += ':' + goog.string.padNumber(minutes, 2);
  }

  // by default, show am/pm suffix
  if (opt_showAmPm) {
   ***REMOVED*****REMOVED***
    ***REMOVED*** @desc Suffix for morning times.
   ***REMOVED*****REMOVED***
    var MSG_TIME_AM = goog.getMsg('am');

   ***REMOVED*****REMOVED***
    ***REMOVED*** @desc Suffix for afternoon times.
   ***REMOVED*****REMOVED***
    var MSG_TIME_PM = goog.getMsg('pm');

    label += isPM ? MSG_TIME_PM : MSG_TIME_AM;
  }
  return label;
***REMOVED***


***REMOVED***
***REMOVED*** Generates time label for the datetime in standard ISO 24-hour time format.
***REMOVED*** E.g., '06:00:00' or '23:30:15'.
***REMOVED*** @param {boolean=} opt_showSeconds Whether to shows seconds. Defaults to TRUE.
***REMOVED*** @return {string} The time label.
***REMOVED***
goog.date.DateTime.prototype.toIsoTimeString = function(opt_showSeconds) {
  var hours = this.getHours();
  var label = goog.string.padNumber(hours, 2) +
              ':' +
              goog.string.padNumber(this.getMinutes(), 2);
  if (!goog.isDef(opt_showSeconds) || opt_showSeconds) {
    label += ':' + goog.string.padNumber(this.getSeconds(), 2);
  }
  return label;
***REMOVED***


***REMOVED***
***REMOVED*** @return {!goog.date.DateTime} A clone of the datetime object.
***REMOVED*** @override
***REMOVED***
goog.date.DateTime.prototype.clone = function() {
  var date = new goog.date.DateTime(this.date_);
  date.setFirstDayOfWeek(this.getFirstDayOfWeek());
  date.setFirstWeekCutOffDay(this.getFirstWeekCutOffDay());
  return date;
***REMOVED***
