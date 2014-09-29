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
***REMOVED*** @fileoverview Functions for formatting relative dates.  Such as "3 days ago"
***REMOVED*** "3 hours ago", "14 minutes ago", "12 days ago", "Today", "Yesterday".
***REMOVED***
***REMOVED***

goog.provide('goog.date.relative');

goog.require('goog.i18n.DateTimeFormat');


***REMOVED***
***REMOVED*** Number of milliseconds in a minute.
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.date.relative.MINUTE_MS_ = 60000;


***REMOVED***
***REMOVED*** Number of milliseconds in a day.
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.date.relative.DAY_MS_ = 86400000;


***REMOVED***
***REMOVED*** Enumeration used to identify time units internally.
***REMOVED*** @enum {number}
***REMOVED*** @private
***REMOVED***
goog.date.relative.Unit_ = {
  MINUTES: 0,
  HOURS: 1,
  DAYS: 2
***REMOVED***


***REMOVED***
***REMOVED*** Full date formatter.
***REMOVED*** @type {goog.i18n.DateTimeFormat}
***REMOVED*** @private
***REMOVED***
goog.date.relative.fullDateFormatter_;


***REMOVED***
***REMOVED*** Short time formatter.
***REMOVED*** @type {goog.i18n.DateTimeFormat}
***REMOVED*** @private
***REMOVED***
goog.date.relative.shortTimeFormatter_;


***REMOVED***
***REMOVED*** Month-date formatter.
***REMOVED*** @type {goog.i18n.DateTimeFormat}
***REMOVED*** @private
***REMOVED***
goog.date.relative.monthDateFormatter_;


***REMOVED***
***REMOVED*** Returns a date in month format, e.g. Mar 15.
***REMOVED*** @param {Date} date The date object.
***REMOVED*** @return {string} The formatted string.
***REMOVED*** @private
***REMOVED***
goog.date.relative.formatMonth_ = function(date) {
  if (!goog.date.relative.monthDateFormatter_) {
    goog.date.relative.monthDateFormatter_ =
        new goog.i18n.DateTimeFormat('MMM dd');
  }
  return goog.date.relative.monthDateFormatter_.format(date);
***REMOVED***


***REMOVED***
***REMOVED*** Returns a date in short-time format, e.g. 2:50 PM.
***REMOVED*** @param {Date|goog.date.DateTime} date The date object.
***REMOVED*** @return {string} The formatted string.
***REMOVED*** @private
***REMOVED***
goog.date.relative.formatShortTime_ = function(date) {
  if (!goog.date.relative.shortTimeFormatter_) {
    goog.date.relative.shortTimeFormatter_ = new goog.i18n.DateTimeFormat(
        goog.i18n.DateTimeFormat.Format.SHORT_TIME);
  }
  return goog.date.relative.shortTimeFormatter_.format(date);
***REMOVED***


***REMOVED***
***REMOVED*** Returns a date in full date format, e.g. Tuesday, March 24, 2009.
***REMOVED*** @param {Date|goog.date.DateTime} date The date object.
***REMOVED*** @return {string} The formatted string.
***REMOVED*** @private
***REMOVED***
goog.date.relative.formatFullDate_ = function(date) {
  if (!goog.date.relative.fullDateFormatter_) {
    goog.date.relative.fullDateFormatter_ = new goog.i18n.DateTimeFormat(
        goog.i18n.DateTimeFormat.Format.FULL_DATE);
  }
  return goog.date.relative.fullDateFormatter_.format(date);
***REMOVED***


***REMOVED***
***REMOVED*** Accepts a timestamp in milliseconds and outputs a relative time in the form
***REMOVED*** of "1 hour ago", "1 day ago", "in 1 hour", "in 2 days" etc.  If the date
***REMOVED*** delta is over 2 weeks, then the output string will be empty.
***REMOVED*** @param {number} dateMs Date in milliseconds.
***REMOVED*** @return {string} The formatted date.
***REMOVED***
goog.date.relative.format = function(dateMs) {

  var now = goog.now();
  var delta = Math.floor((now - dateMs) / goog.date.relative.MINUTE_MS_);

  var future = false;

  if (delta < 0) {
    future = true;
    delta***REMOVED***= -1;
  }

  if (delta < 60) { // Minutes.
    return goog.date.relative.getMessage_(
        delta, future, goog.date.relative.Unit_.MINUTES);

  } else {
    delta = Math.floor(delta / 60);
    if (delta < 24) { // Hours.
      return goog.date.relative.getMessage_(
          delta, future, goog.date.relative.Unit_.HOURS);

    } else {
      // We can be more than 24 hours apart but still only 1 day apart, so we
      // compare the closest time from today against the target time to find
      // the number of days in the delta.
      var midnight = new Date(goog.now());
      midnight.setHours(0);
      midnight.setMinutes(0);
      midnight.setSeconds(0);
      midnight.setMilliseconds(0);

      // Convert to days ago.
      delta = Math.ceil(
          (midnight.getTime() - dateMs) / goog.date.relative.DAY_MS_);

      if (future) {
        delta***REMOVED***= -1;
      }

      // Uses days for less than 2-weeks.
      if (delta < 14) {
        return goog.date.relative.getMessage_(
            delta, future, goog.date.relative.Unit_.DAYS);

      } else {
        // For messages older than 2 weeks do not show anything.  The client
        // should decide the date format to show.
        return '';
      }
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** Accepts a timestamp in milliseconds and outputs a relative time in the form
***REMOVED*** of "1 hour ago", "1 day ago".  All future times will be returned as 0 minutes
***REMOVED*** ago.
***REMOVED***
***REMOVED*** This is provided for compatibility with users of the previous incarnation of
***REMOVED*** the above {@see #format} method who relied on it protecting against
***REMOVED*** future dates.
***REMOVED***
***REMOVED*** @param {number} dateMs Date in milliseconds.
***REMOVED*** @return {string} The formatted date.
***REMOVED***
goog.date.relative.formatPast = function(dateMs) {
  var now = goog.now();
  if (now < dateMs) {
    dateMs = now;
  }
  return goog.date.relative.format(dateMs);
***REMOVED***


***REMOVED***
***REMOVED*** Accepts a timestamp in milliseconds and outputs a relative day. i.e. "Today",
***REMOVED*** "Yesterday" or "Sept 15".
***REMOVED***
***REMOVED*** @param {number} dateMs Date in milliseconds.
***REMOVED*** @param {!function(!Date):string=} opt_formatter Formatter for the date.
***REMOVED***     Defaults to form 'MMM dd'.
***REMOVED*** @return {string} The formatted date.
***REMOVED***
goog.date.relative.formatDay = function(dateMs, opt_formatter) {
  var message;
  var today = new Date(goog.now());

  today.setHours(0);
  today.setMinutes(0);
  today.setSeconds(0);
  today.setMilliseconds(0);

  var yesterday = new Date(today.getTime() - goog.date.relative.DAY_MS_);
  if (today.getTime() < dateMs) {
   ***REMOVED*****REMOVED*** @desc Today.***REMOVED***
    var MSG_TODAY = goog.getMsg('Today');
    message = MSG_TODAY;
  } else if (yesterday.getTime() < dateMs) {
   ***REMOVED*****REMOVED*** @desc Yesterday.***REMOVED***
    var MSG_YESTERDAY = goog.getMsg('Yesterday');
    message = MSG_YESTERDAY;
  } else {
    var formatFunction = opt_formatter || goog.date.relative.formatMonth_;
    message = formatFunction(new Date(dateMs));
  }
  return message;
***REMOVED***


***REMOVED***
***REMOVED*** Formats a date, adding the relative date in parenthesis.  If the date is less
***REMOVED*** than 24 hours then the time will be printed, otherwise the full-date will be
***REMOVED*** used.  Examples:
***REMOVED***   2:20 PM (1 minute ago)
***REMOVED***   Monday, February 27, 2009 (4 days ago)
***REMOVED***   Tuesday, March 20, 2005    // Too long ago for a relative date.
***REMOVED***
***REMOVED*** @param {Date|goog.date.DateTime} date A date object.
***REMOVED*** @param {string=} opt_shortTimeMsg An optional short time message can be
***REMOVED***     provided if available, so that it's not recalculated in this function.
***REMOVED*** @param {string=} opt_fullDateMsg An optional date message can be
***REMOVED***     provided if available, so that it's not recalculated in this function.
***REMOVED*** @return {string} The date string in the above form.
***REMOVED***
goog.date.relative.getDateString = function(
    date, opt_shortTimeMsg, opt_fullDateMsg) {
  return goog.date.relative.getDateString_(
      date, goog.date.relative.format, opt_shortTimeMsg, opt_fullDateMsg);
***REMOVED***


***REMOVED***
***REMOVED*** Formats a date, adding the relative date in parenthesis.   Functions the same
***REMOVED*** as #getDateString but ensures that the date is always seen to be in the past.
***REMOVED*** If the date is in the future, it will be shown as 0 minutes ago.
***REMOVED***
***REMOVED*** This is provided for compatibility with users of the previous incarnation of
***REMOVED*** the above {@see #getDateString} method who relied on it protecting against
***REMOVED*** future dates.
***REMOVED***
***REMOVED*** @param {Date|goog.date.DateTime} date A date object.
***REMOVED*** @param {string=} opt_shortTimeMsg An optional short time message can be
***REMOVED***     provided if available, so that it's not recalculated in this function.
***REMOVED*** @param {string=} opt_fullDateMsg An optional date message can be
***REMOVED***     provided if available, so that it's not recalculated in this function.
***REMOVED*** @return {string} The date string in the above form.
***REMOVED***
goog.date.relative.getPastDateString = function(
    date, opt_shortTimeMsg, opt_fullDateMsg) {
  return goog.date.relative.getDateString_(
      date, goog.date.relative.formatPast, opt_shortTimeMsg, opt_fullDateMsg);
***REMOVED***


***REMOVED***
***REMOVED*** Formats a date, adding the relative date in parenthesis.  If the date is less
***REMOVED*** than 24 hours then the time will be printed, otherwise the full-date will be
***REMOVED*** used.  Examples:
***REMOVED***   2:20 PM (1 minute ago)
***REMOVED***   Monday, February 27, 2009 (4 days ago)
***REMOVED***   Tuesday, March 20, 2005    // Too long ago for a relative date.
***REMOVED***
***REMOVED*** @param {Date|goog.date.DateTime} date A date object.
***REMOVED*** @param {function(number) : string} relativeFormatter Function to use when
***REMOVED***     formatting the relative date.
***REMOVED*** @param {string=} opt_shortTimeMsg An optional short time message can be
***REMOVED***     provided if available, so that it's not recalculated in this function.
***REMOVED*** @param {string=} opt_fullDateMsg An optional date message can be
***REMOVED***     provided if available, so that it's not recalculated in this function.
***REMOVED*** @return {string} The date string in the above form.
***REMOVED*** @private
***REMOVED***
goog.date.relative.getDateString_ = function(
    date, relativeFormatter, opt_shortTimeMsg, opt_fullDateMsg) {
  var dateMs = date.getTime();

  var relativeDate = relativeFormatter(dateMs);

  if (relativeDate) {
    relativeDate = ' (' + relativeDate + ')';
  }

  var delta = Math.floor((goog.now() - dateMs) / goog.date.relative.MINUTE_MS_);
  if (delta < 60***REMOVED*** 24) {
    // TODO(user): this call raises an exception if date is a goog.date.Date.
    return (opt_shortTimeMsg || goog.date.relative.formatShortTime_(date)) +
        relativeDate;
  } else {
    return (opt_fullDateMsg || goog.date.relative.formatFullDate_(date)) +
        relativeDate;
  }
***REMOVED***


***REMOVED***
***REMOVED*** Gets a localized relative date string for a given delta and unit.
***REMOVED*** @param {number} delta Number of minutes/hours/days.
***REMOVED*** @param {boolean} future Whether the delta is in the future.
***REMOVED*** @param {goog.date.relative.Unit_} unit The units the delta is in.
***REMOVED*** @return {string} The message.
***REMOVED*** @private
***REMOVED***
goog.date.relative.getMessage_ = function(delta, future, unit) {
  if (!future && unit == goog.date.relative.Unit_.MINUTES) {
   ***REMOVED*****REMOVED***
    ***REMOVED*** @desc Relative date indicating how many minutes ago something happened
    ***REMOVED*** (singular).
   ***REMOVED*****REMOVED***
    var MSG_MINUTES_AGO_SINGULAR =
        goog.getMsg('{$num} minute ago', {'num' : delta});

   ***REMOVED*****REMOVED***
    ***REMOVED*** @desc Relative date indicating how many minutes ago something happened
    ***REMOVED*** (plural).
   ***REMOVED*****REMOVED***
    var MSG_MINUTES_AGO_PLURAL =
        goog.getMsg('{$num} minutes ago', {'num' : delta});

    return delta == 1 ? MSG_MINUTES_AGO_SINGULAR : MSG_MINUTES_AGO_PLURAL;

  } else if (future && unit == goog.date.relative.Unit_.MINUTES) {
   ***REMOVED*****REMOVED***
    ***REMOVED*** @desc Relative date indicating in how many minutes something happens
    ***REMOVED*** (singular).
   ***REMOVED*****REMOVED***
    var MSG_IN_MINUTES_SINGULAR =
        goog.getMsg('in {$num} minute', {'num' : delta});

   ***REMOVED*****REMOVED***
    ***REMOVED*** @desc Relative date indicating in how many minutes something happens
    ***REMOVED*** (plural).
   ***REMOVED*****REMOVED***
    var MSG_IN_MINUTES_PLURAL =
        goog.getMsg('in {$num} minutes', {'num' : delta});

    return delta == 1 ? MSG_IN_MINUTES_SINGULAR : MSG_IN_MINUTES_PLURAL;

  } else if (!future && unit == goog.date.relative.Unit_.HOURS) {
   ***REMOVED*****REMOVED***
    ***REMOVED*** @desc Relative date indicating how many hours ago something happened
    ***REMOVED*** (singular).
   ***REMOVED*****REMOVED***
    var MSG_HOURS_AGO_SINGULAR =
        goog.getMsg('{$num} hour ago', {'num' : delta});

   ***REMOVED*****REMOVED***
    ***REMOVED*** @desc Relative date indicating how many hours ago something happened
    ***REMOVED*** (plural).
   ***REMOVED*****REMOVED***
    var MSG_HOURS_AGO_PLURAL = goog.getMsg('{$num} hours ago', {'num' : delta});

    return delta == 1 ? MSG_HOURS_AGO_SINGULAR : MSG_HOURS_AGO_PLURAL;

  } else if (future && unit == goog.date.relative.Unit_.HOURS) {
   ***REMOVED*****REMOVED***
    ***REMOVED*** @desc Relative date indicating in how many hours something happens
    ***REMOVED*** (singular).
   ***REMOVED*****REMOVED***
    var MSG_IN_HOURS_SINGULAR = goog.getMsg('in {$num} hour', {'num' : delta});

   ***REMOVED*****REMOVED***
    ***REMOVED*** @desc Relative date indicating in how many hours something happens
    ***REMOVED*** (plural).
   ***REMOVED*****REMOVED***
    var MSG_IN_HOURS_PLURAL = goog.getMsg('in {$num} hours', {'num' : delta});

    return delta == 1 ? MSG_IN_HOURS_SINGULAR : MSG_IN_HOURS_PLURAL;

  } else if (!future && unit == goog.date.relative.Unit_.DAYS) {
   ***REMOVED*****REMOVED***
    ***REMOVED*** @desc Relative date indicating how many days ago something happened
    ***REMOVED*** (singular).
   ***REMOVED*****REMOVED***
    var MSG_DAYS_AGO_SINGULAR = goog.getMsg('{$num} day ago', {'num' : delta});

   ***REMOVED*****REMOVED***
    ***REMOVED*** @desc Relative date indicating how many days ago something happened
    ***REMOVED*** (plural).
   ***REMOVED*****REMOVED***
    var MSG_DAYS_AGO_PLURAL = goog.getMsg('{$num} days ago', {'num' : delta});

    return delta == 1 ? MSG_DAYS_AGO_SINGULAR : MSG_DAYS_AGO_PLURAL;

  } else if (future && unit == goog.date.relative.Unit_.DAYS) {
   ***REMOVED*****REMOVED***
    ***REMOVED*** @desc Relative date indicating in how many days something happens
    ***REMOVED*** (singular).
   ***REMOVED*****REMOVED***
    var MSG_IN_DAYS_SINGULAR = goog.getMsg('in {$num} day', {'num' : delta});

   ***REMOVED*****REMOVED***
    ***REMOVED*** @desc Relative date indicating in how many days something happens
    ***REMOVED*** (plural).
   ***REMOVED*****REMOVED***
    var MSG_IN_DAYS_PLURAL = goog.getMsg('in {$num} days', {'num' : delta});

    return delta == 1 ? MSG_IN_DAYS_SINGULAR : MSG_IN_DAYS_PLURAL;

  } else {
    return '';
  }
***REMOVED***
