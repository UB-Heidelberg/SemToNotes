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
***REMOVED*** @fileoverview Locale independent date/time class.
***REMOVED***
***REMOVED***

goog.provide('goog.date.UtcDateTime');

goog.require('goog.date');
goog.require('goog.date.Date');
goog.require('goog.date.DateTime');
goog.require('goog.date.Interval');



***REMOVED***
***REMOVED*** Class representing a date/time in GMT+0 time zone, without daylight saving.
***REMOVED*** Defaults to current date and time if none is specified. The get... and the
***REMOVED*** getUTC... methods are equivalent.
***REMOVED***
***REMOVED*** @param {number|Object=} opt_year Four digit UTC year or a date-like object.
***REMOVED***     If not set, the created object will contain the date determined by
***REMOVED***     goog.now().
***REMOVED*** @param {number=} opt_month UTC month, 0 = Jan, 11 = Dec.
***REMOVED*** @param {number=} opt_date UTC date of month, 1 - 31.
***REMOVED*** @param {number=} opt_hours UTC hours, 0 - 23.
***REMOVED*** @param {number=} opt_minutes UTC minutes, 0 - 59.
***REMOVED*** @param {number=} opt_seconds UTC seconds, 0 - 59.
***REMOVED*** @param {number=} opt_milliseconds UTC milliseconds, 0 - 999.
***REMOVED***
***REMOVED*** @extends {goog.date.DateTime}
***REMOVED***
goog.date.UtcDateTime = function(opt_year, opt_month, opt_date, opt_hours,
                                 opt_minutes, opt_seconds, opt_milliseconds) {
  var timestamp;
  if (goog.isNumber(opt_year)) {
    timestamp = Date.UTC(opt_year, opt_month || 0, opt_date || 1,
                         opt_hours || 0, opt_minutes || 0, opt_seconds || 0,
                         opt_milliseconds || 0);
  } else {
    timestamp = opt_year ? opt_year.getTime() : goog.now();
  }
  this.date = new Date(timestamp);
***REMOVED***
goog.inherits(goog.date.UtcDateTime, goog.date.DateTime);


***REMOVED***
***REMOVED*** @param {number} timestamp Number of milliseconds since Epoch.
***REMOVED*** @return {!goog.date.UtcDateTime}
***REMOVED***
goog.date.UtcDateTime.fromTimestamp = function(timestamp) {
  var date = new goog.date.UtcDateTime();
  date.setTime(timestamp);
  return date;
***REMOVED***


***REMOVED***
***REMOVED*** Creates a DateTime from a UTC datetime string expressed in ISO 8601 format.
***REMOVED***
***REMOVED*** @param {string} formatted A date or datetime expressed in ISO 8601 format.
***REMOVED*** @return {goog.date.UtcDateTime} Parsed date or null if parse fails.
***REMOVED***
goog.date.UtcDateTime.fromIsoString = function(formatted) {
  var ret = new goog.date.UtcDateTime(2000);
  return goog.date.setIso8601DateTime(ret, formatted) ? ret : null;
***REMOVED***


***REMOVED***
***REMOVED*** Clones the UtcDateTime object.
***REMOVED***
***REMOVED*** @return {!goog.date.UtcDateTime} A clone of the datetime object.
***REMOVED*** @override
***REMOVED***
goog.date.UtcDateTime.prototype.clone = function() {
  var date = new goog.date.UtcDateTime(this.date);
  date.setFirstDayOfWeek(this.getFirstDayOfWeek());
  date.setFirstWeekCutOffDay(this.getFirstWeekCutOffDay());
  return date;
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.date.UtcDateTime.prototype.add = function(interval) {
  if (interval.years || interval.months) {
    var yearsMonths = new goog.date.Interval(interval.years, interval.months);
    goog.date.Date.prototype.add.call(this, yearsMonths);
  }
  var daysAndTimeMillis = 1000***REMOVED*** (
      interval.seconds + 60***REMOVED*** (
          interval.minutes + 60***REMOVED*** (
              interval.hours + 24***REMOVED*** interval.days)));
  this.date = new Date(this.date.getTime() + daysAndTimeMillis);
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.date.UtcDateTime.prototype.getTimezoneOffset = function() {
  return 0;
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.date.UtcDateTime.prototype.getFullYear =
    goog.date.DateTime.prototype.getUTCFullYear;


***REMOVED*** @override***REMOVED***
goog.date.UtcDateTime.prototype.getMonth =
    goog.date.DateTime.prototype.getUTCMonth;


***REMOVED*** @override***REMOVED***
goog.date.UtcDateTime.prototype.getDate =
    goog.date.DateTime.prototype.getUTCDate;


***REMOVED*** @override***REMOVED***
goog.date.UtcDateTime.prototype.getHours =
    goog.date.DateTime.prototype.getUTCHours;


***REMOVED*** @override***REMOVED***
goog.date.UtcDateTime.prototype.getMinutes =
    goog.date.DateTime.prototype.getUTCMinutes;


***REMOVED*** @override***REMOVED***
goog.date.UtcDateTime.prototype.getSeconds =
    goog.date.DateTime.prototype.getUTCSeconds;


***REMOVED*** @override***REMOVED***
goog.date.UtcDateTime.prototype.getMilliseconds =
    goog.date.DateTime.prototype.getUTCMilliseconds;


***REMOVED*** @override***REMOVED***
goog.date.UtcDateTime.prototype.getDay =
    goog.date.DateTime.prototype.getUTCDay;


***REMOVED*** @override***REMOVED***
goog.date.UtcDateTime.prototype.setFullYear =
    goog.date.DateTime.prototype.setUTCFullYear;


***REMOVED*** @override***REMOVED***
goog.date.UtcDateTime.prototype.setMonth =
    goog.date.DateTime.prototype.setUTCMonth;


***REMOVED*** @override***REMOVED***
goog.date.UtcDateTime.prototype.setDate =
    goog.date.DateTime.prototype.setUTCDate;


***REMOVED*** @override***REMOVED***
goog.date.UtcDateTime.prototype.setHours =
    goog.date.DateTime.prototype.setUTCHours;


***REMOVED*** @override***REMOVED***
goog.date.UtcDateTime.prototype.setMinutes =
    goog.date.DateTime.prototype.setUTCMinutes;


***REMOVED*** @override***REMOVED***
goog.date.UtcDateTime.prototype.setSeconds =
    goog.date.DateTime.prototype.setUTCSeconds;


***REMOVED*** @override***REMOVED***
goog.date.UtcDateTime.prototype.setMilliseconds =
    goog.date.DateTime.prototype.setUTCMilliseconds;
