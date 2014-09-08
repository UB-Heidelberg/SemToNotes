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
***REMOVED*** @fileoverview Date range data structure. Based loosely on
***REMOVED*** com.google.common.util.DateRange.
***REMOVED***
***REMOVED***

goog.provide('goog.date.DateRange');
goog.provide('goog.date.DateRange.Iterator');
goog.provide('goog.date.DateRange.StandardDateRangeKeys');

goog.require('goog.date.Date');
goog.require('goog.date.Interval');
goog.require('goog.iter.Iterator');
goog.require('goog.iter.StopIteration');



***REMOVED***
***REMOVED*** Constructs a date range.
***REMOVED***
***REMOVED*** @param {goog.date.Date} startDate The first date in the range.
***REMOVED*** @param {goog.date.Date} endDate The last date in the range.
***REMOVED*** @final
***REMOVED***
goog.date.DateRange = function(startDate, endDate) {
 ***REMOVED*****REMOVED***
  ***REMOVED*** The first date in the range.
  ***REMOVED*** @type {goog.date.Date}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.startDate_ = startDate;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The last date in the range.
  ***REMOVED*** @type {goog.date.Date}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.endDate_ = endDate;
***REMOVED***


***REMOVED***
***REMOVED*** The first possible day, as far as this class is concerned.
***REMOVED*** @type {goog.date.Date}
***REMOVED***
goog.date.DateRange.MINIMUM_DATE = new goog.date.Date(0, 0, 1);


***REMOVED***
***REMOVED*** The last possible day, as far as this class is concerned.
***REMOVED*** @type {goog.date.Date}
***REMOVED***
goog.date.DateRange.MAXIMUM_DATE = new goog.date.Date(9999, 11, 31);


***REMOVED***
***REMOVED*** @return {goog.date.Date} The first date in the range.
***REMOVED***
goog.date.DateRange.prototype.getStartDate = function() {
  return this.startDate_;
***REMOVED***


***REMOVED***
***REMOVED*** @return {goog.date.Date} The last date in the range.
***REMOVED***
goog.date.DateRange.prototype.getEndDate = function() {
  return this.endDate_;
***REMOVED***


***REMOVED***
***REMOVED*** Tests if a date falls within this range.
***REMOVED***
***REMOVED*** @param {goog.date.Date} date The date to test.
***REMOVED*** @return {boolean} Whether the date is in the range.
***REMOVED***
goog.date.DateRange.prototype.contains = function(date) {
  return date.valueOf() >= this.startDate_.valueOf() &&
      date.valueOf() <= this.endDate_.valueOf();
***REMOVED***


***REMOVED***
***REMOVED*** @return {!goog.iter.Iterator} An iterator over the date range.
***REMOVED***
goog.date.DateRange.prototype.iterator = function() {
  return new goog.date.DateRange.Iterator(this);
***REMOVED***


***REMOVED***
***REMOVED*** Tests two {@link goog.date.DateRange} objects for equality.
***REMOVED*** @param {goog.date.DateRange} a A date range.
***REMOVED*** @param {goog.date.DateRange} b A date range.
***REMOVED*** @return {boolean} Whether |a| is the same range as |b|.
***REMOVED***
goog.date.DateRange.equals = function(a, b) {
  // Test for same object reference; type conversion is irrelevant.
  if (a === b) {
    return true;
  }

  if (a == null || b == null) {
    return false;
  }

  return a.startDate_.equals(b.startDate_) && a.endDate_.equals(b.endDate_);
***REMOVED***


***REMOVED***
***REMOVED*** Calculates a date that is a number of days after a date. Does not modify its
***REMOVED*** input.
***REMOVED*** @param {goog.date.Date} date The input date.
***REMOVED*** @param {number} offset Number of days.
***REMOVED*** @return {!goog.date.Date} The date that is |offset| days after |date|.
***REMOVED*** @private
***REMOVED***
goog.date.DateRange.offsetInDays_ = function(date, offset) {
  var newDate = date.clone();
  newDate.add(new goog.date.Interval(goog.date.Interval.DAYS, offset));
  return newDate;
***REMOVED***


***REMOVED***
***REMOVED*** Calculates the Monday before a date. If the input is a Monday, returns the
***REMOVED*** input. Does not modify its input.
***REMOVED*** @param {goog.date.Date} date The input date.
***REMOVED*** @return {!goog.date.Date} If |date| is a Monday, return |date|; otherwise
***REMOVED***     return the Monday before |date|.
***REMOVED*** @private
***REMOVED***
goog.date.DateRange.currentOrLastMonday_ = function(date) {
  var newDate = date.clone();
  newDate.add(new goog.date.Interval(goog.date.Interval.DAYS,
      -newDate.getIsoWeekday()));
  return newDate;
***REMOVED***


***REMOVED***
***REMOVED*** Calculates a date that is a number of months after the first day in the
***REMOVED*** month that contains its input. Does not modify its input.
***REMOVED*** @param {goog.date.Date} date The input date.
***REMOVED*** @param {number} offset Number of months.
***REMOVED*** @return {!goog.date.Date} The date that is |offset| months after the first
***REMOVED***     day in the month that contains |date|.
***REMOVED*** @private
***REMOVED***
goog.date.DateRange.offsetInMonths_ = function(date, offset) {
  var newDate = date.clone();
  newDate.setDate(1);
  newDate.add(new goog.date.Interval(goog.date.Interval.MONTHS, offset));
  return newDate;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the range from yesterday to yesterday.
***REMOVED*** @param {goog.date.Date=} opt_today The date to consider today.
***REMOVED***     Defaults to today.
***REMOVED*** @return {!goog.date.DateRange} The range that includes only yesterday.
***REMOVED***
goog.date.DateRange.yesterday = function(opt_today) {
  var today = goog.date.DateRange.cloneOrCreate_(opt_today);
  var yesterday = goog.date.DateRange.offsetInDays_(today, -1);
  return new goog.date.DateRange(yesterday, yesterday);
***REMOVED***


***REMOVED***
***REMOVED*** Returns the range from today to today.
***REMOVED*** @param {goog.date.Date=} opt_today The date to consider today.
***REMOVED***     Defaults to today.
***REMOVED*** @return {!goog.date.DateRange} The range that includes only today.
***REMOVED***
goog.date.DateRange.today = function(opt_today) {
  var today = goog.date.DateRange.cloneOrCreate_(opt_today);
  return new goog.date.DateRange(today, today);
***REMOVED***


***REMOVED***
***REMOVED*** Returns the range that includes the seven days that end yesterday.
***REMOVED*** @param {goog.date.Date=} opt_today The date to consider today.
***REMOVED***     Defaults to today.
***REMOVED*** @return {!goog.date.DateRange} The range that includes the seven days that
***REMOVED***     end yesterday.
***REMOVED***
goog.date.DateRange.last7Days = function(opt_today) {
  var today = goog.date.DateRange.cloneOrCreate_(opt_today);
  var yesterday = goog.date.DateRange.offsetInDays_(today, -1);
  return new goog.date.DateRange(goog.date.DateRange.offsetInDays_(today, -7),
      yesterday);
***REMOVED***


***REMOVED***
***REMOVED*** Returns the range that starts the first of this month and ends the last day
***REMOVED*** of this month.
***REMOVED*** @param {goog.date.Date=} opt_today The date to consider today.
***REMOVED***     Defaults to today.
***REMOVED*** @return {!goog.date.DateRange} The range that starts the first of this month
***REMOVED***     and ends the last day of this month.
***REMOVED***
goog.date.DateRange.thisMonth = function(opt_today) {
  var today = goog.date.DateRange.cloneOrCreate_(opt_today);
  return new goog.date.DateRange(
      goog.date.DateRange.offsetInMonths_(today, 0),
      goog.date.DateRange.offsetInDays_(
          goog.date.DateRange.offsetInMonths_(today, 1),
          -1));
***REMOVED***


***REMOVED***
***REMOVED*** Returns the range that starts the first of last month and ends the last day
***REMOVED*** of last month.
***REMOVED*** @param {goog.date.Date=} opt_today The date to consider today.
***REMOVED***     Defaults to today.
***REMOVED*** @return {!goog.date.DateRange} The range that starts the first of last month
***REMOVED***     and ends the last day of last month.
***REMOVED***
goog.date.DateRange.lastMonth = function(opt_today) {
  var today = goog.date.DateRange.cloneOrCreate_(opt_today);
  return new goog.date.DateRange(
      goog.date.DateRange.offsetInMonths_(today, -1),
      goog.date.DateRange.offsetInDays_(
          goog.date.DateRange.offsetInMonths_(today, 0),
          -1));
***REMOVED***


***REMOVED***
***REMOVED*** Returns the seven-day range that starts on the first day of the week
***REMOVED*** (see {@link goog.i18n.DateTimeSymbols.FIRSTDAYOFWEEK}) on or before today.
***REMOVED*** @param {goog.date.Date=} opt_today The date to consider today.
***REMOVED***     Defaults to today.
***REMOVED*** @return {!goog.date.DateRange} The range that starts the Monday on or before
***REMOVED***     today and ends the Sunday on or after today.
***REMOVED***
goog.date.DateRange.thisWeek = function(opt_today) {
  var today = goog.date.DateRange.cloneOrCreate_(opt_today);
  var iso = today.getIsoWeekday();
  var firstDay = today.getFirstDayOfWeek();
  var i18nFirstDay = (iso >= firstDay) ? iso - firstDay : iso + (7 - firstDay);
  var start = goog.date.DateRange.offsetInDays_(today, -i18nFirstDay);
  var end = goog.date.DateRange.offsetInDays_(start, 6);
  return new goog.date.DateRange(start, end);
***REMOVED***


***REMOVED***
***REMOVED*** Returns the seven-day range that ends the day before the first day of
***REMOVED*** the week (see {@link goog.i18n.DateTimeSymbols.FIRSTDAYOFWEEK}) that
***REMOVED*** contains today.
***REMOVED*** @param {goog.date.Date=} opt_today The date to consider today.
***REMOVED***     Defaults to today.
***REMOVED*** @return {!goog.date.DateRange} The range that starts seven days before the
***REMOVED***     Monday on or before today and ends the Sunday on or before yesterday.
***REMOVED***
goog.date.DateRange.lastWeek = function(opt_today) {
  var thisWeek = goog.date.DateRange.thisWeek(opt_today);
  var start = goog.date.DateRange.offsetInDays_(thisWeek.getStartDate(), -7);
  var end = goog.date.DateRange.offsetInDays_(thisWeek.getEndDate(), -7);
  return new goog.date.DateRange(start, end);
***REMOVED***


***REMOVED***
***REMOVED*** Returns the range that starts seven days before the Monday on or before
***REMOVED*** today and ends the Friday before today.
***REMOVED*** @param {goog.date.Date=} opt_today The date to consider today.
***REMOVED***     Defaults to today.
***REMOVED*** @return {!goog.date.DateRange} The range that starts seven days before the
***REMOVED***     Monday on or before today and ends the Friday before today.
***REMOVED***
goog.date.DateRange.lastBusinessWeek = function(opt_today) {
  // TODO(user): should be i18nized.
  var today = goog.date.DateRange.cloneOrCreate_(opt_today);
  var start = goog.date.DateRange.offsetInDays_(today,
      - 7 - today.getIsoWeekday());
  var end = goog.date.DateRange.offsetInDays_(start, 4);
  return new goog.date.DateRange(start, end);
***REMOVED***


***REMOVED***
***REMOVED*** Returns the range that includes all days between January 1, 1900 and
***REMOVED*** December 31, 9999.
***REMOVED*** @param {goog.date.Date=} opt_today The date to consider today.
***REMOVED***     Defaults to today.
***REMOVED*** @return {!goog.date.DateRange} The range that includes all days between
***REMOVED***     January 1, 1900 and December 31, 9999.
***REMOVED***
goog.date.DateRange.allTime = function(opt_today) {
  return new goog.date.DateRange(
      goog.date.DateRange.MINIMUM_DATE,
      goog.date.DateRange.MAXIMUM_DATE);
***REMOVED***


***REMOVED***
***REMOVED*** Standard date range keys. Equivalent to the enum IDs in
***REMOVED*** DateRange.java http://go/datarange.java
***REMOVED***
***REMOVED*** @enum {string}
***REMOVED***
goog.date.DateRange.StandardDateRangeKeys = {
  YESTERDAY: 'yesterday',
  TODAY: 'today',
  LAST_7_DAYS: 'last7days',
  THIS_MONTH: 'thismonth',
  LAST_MONTH: 'lastmonth',
  THIS_WEEK: 'thisweek',
  LAST_WEEK: 'lastweek',
  LAST_BUSINESS_WEEK: 'lastbusinessweek',
  ALL_TIME: 'alltime'
***REMOVED***


***REMOVED***
***REMOVED*** @param {string} dateRangeKey A standard date range key.
***REMOVED*** @param {goog.date.Date=} opt_today The date to consider today.
***REMOVED***     Defaults to today.
***REMOVED*** @return {!goog.date.DateRange} The date range that corresponds to that key.
***REMOVED*** @throws {Error} If no standard date range with that key exists.
***REMOVED***
goog.date.DateRange.standardDateRange = function(dateRangeKey, opt_today) {
  switch (dateRangeKey) {
    case goog.date.DateRange.StandardDateRangeKeys.YESTERDAY:
      return goog.date.DateRange.yesterday(opt_today);

    case goog.date.DateRange.StandardDateRangeKeys.TODAY:
      return goog.date.DateRange.today(opt_today);

    case goog.date.DateRange.StandardDateRangeKeys.LAST_7_DAYS:
      return goog.date.DateRange.last7Days(opt_today);

    case goog.date.DateRange.StandardDateRangeKeys.THIS_MONTH:
      return goog.date.DateRange.thisMonth(opt_today);

    case goog.date.DateRange.StandardDateRangeKeys.LAST_MONTH:
      return goog.date.DateRange.lastMonth(opt_today);

    case goog.date.DateRange.StandardDateRangeKeys.THIS_WEEK:
      return goog.date.DateRange.thisWeek(opt_today);

    case goog.date.DateRange.StandardDateRangeKeys.LAST_WEEK:
      return goog.date.DateRange.lastWeek(opt_today);

    case goog.date.DateRange.StandardDateRangeKeys.LAST_BUSINESS_WEEK:
      return goog.date.DateRange.lastBusinessWeek(opt_today);

    case goog.date.DateRange.StandardDateRangeKeys.ALL_TIME:
      return goog.date.DateRange.allTime(opt_today);

    default:
      throw Error('no such date range key: ' + dateRangeKey);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Clones or creates new.
***REMOVED*** @param {goog.date.Date=} opt_today The date to consider today.
***REMOVED***     Defaults to today.
***REMOVED*** @return {!goog.date.Date} cloned or new.
***REMOVED*** @private
***REMOVED***
goog.date.DateRange.cloneOrCreate_ = function(opt_today) {
  return opt_today ? opt_today.clone() : new goog.date.Date();
***REMOVED***



***REMOVED***
***REMOVED*** Creates an iterator over the dates in a {@link goog.date.DateRange}.
***REMOVED***
***REMOVED*** @extends {goog.iter.Iterator}
***REMOVED*** @param {goog.date.DateRange} dateRange The date range to iterate.
***REMOVED*** @final
***REMOVED***
goog.date.DateRange.Iterator = function(dateRange) {
 ***REMOVED*****REMOVED***
  ***REMOVED*** The next date.
  ***REMOVED*** @type {goog.date.Date}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.nextDate_ = dateRange.getStartDate().clone();

 ***REMOVED*****REMOVED***
  ***REMOVED*** The end date, expressed as an integer: YYYYMMDD.
  ***REMOVED*** @type {number}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.endDate_ = Number(dateRange.getEndDate().toIsoString());
***REMOVED***
goog.inherits(goog.date.DateRange.Iterator, goog.iter.Iterator);


***REMOVED*** @override***REMOVED***
goog.date.DateRange.Iterator.prototype.next = function() {
  if (Number(this.nextDate_.toIsoString()) > this.endDate_) {
    throw goog.iter.StopIteration;
  }

  var rv = this.nextDate_.clone();
  this.nextDate_.add(new goog.date.Interval(goog.date.Interval.DAYS, 1));
  return rv;
***REMOVED***
