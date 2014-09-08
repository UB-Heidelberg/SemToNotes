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
***REMOVED*** @fileoverview Date picker implementation.
***REMOVED***
***REMOVED*** @author eae@google.com (Emil A Eklund)
***REMOVED*** @see ../demos/datepicker.html
***REMOVED***

goog.provide('goog.ui.DatePicker');
goog.provide('goog.ui.DatePicker.Events');
goog.provide('goog.ui.DatePickerEvent');

goog.require('goog.a11y.aria');
goog.require('goog.asserts');
goog.require('goog.date.Date');
goog.require('goog.date.DateRange');
goog.require('goog.date.Interval');
goog.require('goog.dom');
goog.require('goog.dom.NodeType');
goog.require('goog.dom.classlist');
goog.require('goog.events.Event');
***REMOVED***
goog.require('goog.events.KeyHandler');
goog.require('goog.i18n.DateTimeFormat');
goog.require('goog.i18n.DateTimePatterns');
goog.require('goog.i18n.DateTimeSymbols');
goog.require('goog.style');
goog.require('goog.ui.Component');
goog.require('goog.ui.DefaultDatePickerRenderer');
goog.require('goog.ui.IdGenerator');



***REMOVED***
***REMOVED*** DatePicker widget. Allows a single date to be selected from a calendar like
***REMOVED*** view.
***REMOVED***
***REMOVED*** @param {goog.date.Date|Date=} opt_date Date to initialize the date picker
***REMOVED***     with, defaults to the current date.
***REMOVED*** @param {Object=} opt_dateTimeSymbols Date and time symbols to use.
***REMOVED***     Defaults to goog.i18n.DateTimeSymbols if not set.
***REMOVED*** @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper.
***REMOVED*** @param {goog.ui.DatePickerRenderer=} opt_renderer Optional Date picker
***REMOVED***     renderer.
***REMOVED***
***REMOVED*** @extends {goog.ui.Component}
***REMOVED***
goog.ui.DatePicker = function(opt_date, opt_dateTimeSymbols, opt_domHelper,
    opt_renderer) {
  goog.ui.Component.call(this, opt_domHelper);

 ***REMOVED*****REMOVED***
  ***REMOVED*** Date and time symbols to use.
  ***REMOVED*** @type {Object}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.symbols_ = opt_dateTimeSymbols || goog.i18n.DateTimeSymbols;

  this.wdayNames_ = this.symbols_.STANDALONESHORTWEEKDAYS;

  // The DateTimeFormat object uses the global goog.i18n.DateTimeSymbols
  // for initialization. So we save the original value, the global object,
  // create the formatters, then restore the original value.
  var tempSymbols = goog.i18n.DateTimeSymbols;  // save
  goog.i18n.DateTimeSymbols = this.symbols_;

  // Formatters for the various areas of the picker
  this.i18nDateFormatterDay_ = new goog.i18n.DateTimeFormat('d');
  this.i18nDateFormatterDay2_ = new goog.i18n.DateTimeFormat('dd');
  this.i18nDateFormatterWeek_ = new goog.i18n.DateTimeFormat('w');

  // Previous implementation did not use goog.i18n.DateTimePatterns,
  // so it is likely most developers did not set it.
  // This is why the fallback to a hard-coded string (just in case).
  var patYear = goog.i18n.DateTimePatterns.YEAR_FULL || 'y';
  this.i18nDateFormatterYear_ = new goog.i18n.DateTimeFormat(patYear);
  var patMMMMy = goog.i18n.DateTimePatterns.YEAR_MONTH_FULL || 'MMMM y';
  this.i18nDateFormatterMonthYear_ = new goog.i18n.DateTimeFormat(patMMMMy);

  goog.i18n.DateTimeSymbols = tempSymbols;  // restore

 ***REMOVED*****REMOVED***
  ***REMOVED*** @type {!goog.ui.DatePickerRenderer}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.renderer_ = opt_renderer || new goog.ui.DefaultDatePickerRenderer(
      this.getBaseCssClass(), this.getDomHelper());

 ***REMOVED*****REMOVED***
  ***REMOVED*** Selected date.
  ***REMOVED*** @type {goog.date.Date}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.date_ = new goog.date.Date(opt_date);
  this.date_.setFirstWeekCutOffDay(this.symbols_.FIRSTWEEKCUTOFFDAY);
  this.date_.setFirstDayOfWeek(this.symbols_.FIRSTDAYOFWEEK);

 ***REMOVED*****REMOVED***
  ***REMOVED*** Active month.
  ***REMOVED*** @type {goog.date.Date}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.activeMonth_ = this.date_.clone();
  this.activeMonth_.setDate(1);

 ***REMOVED*****REMOVED***
  ***REMOVED*** Class names to apply to the weekday columns.
  ***REMOVED*** @type {Array.<string>}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.wdayStyles_ = ['', '', '', '', '', '', ''];
  this.wdayStyles_[this.symbols_.WEEKENDRANGE[0]] =
      goog.getCssName(this.getBaseCssClass(), 'wkend-start');
  this.wdayStyles_[this.symbols_.WEEKENDRANGE[1]] =
      goog.getCssName(this.getBaseCssClass(), 'wkend-end');

 ***REMOVED*****REMOVED***
  ***REMOVED*** Object that is being used to cache key handlers.
  ***REMOVED*** @type {Object}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.keyHandlers_ = {***REMOVED***
***REMOVED***
goog.inherits(goog.ui.DatePicker, goog.ui.Component);


***REMOVED***
***REMOVED*** Flag indicating if the number of weeks shown should be fixed.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.ui.DatePicker.prototype.showFixedNumWeeks_ = true;


***REMOVED***
***REMOVED*** Flag indicating if days from other months should be shown.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.ui.DatePicker.prototype.showOtherMonths_ = true;


***REMOVED***
***REMOVED*** Range of dates which are selectable by the user.
***REMOVED*** @type {goog.date.DateRange}
***REMOVED*** @private
***REMOVED***
goog.ui.DatePicker.prototype.userSelectableDateRange_ =
    goog.date.DateRange.allTime();


***REMOVED***
***REMOVED*** Flag indicating if extra week(s) always should be added at the end. If not
***REMOVED*** set the extra week is added at the beginning if the number of days shown
***REMOVED*** from the previous month is less then the number from the next month.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.ui.DatePicker.prototype.extraWeekAtEnd_ = true;


***REMOVED***
***REMOVED*** Flag indicating if week numbers should be shown.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.ui.DatePicker.prototype.showWeekNum_ = true;


***REMOVED***
***REMOVED*** Flag indicating if weekday names should be shown.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.ui.DatePicker.prototype.showWeekdays_ = true;


***REMOVED***
***REMOVED*** Flag indicating if none is a valid selection. Also controls if the none
***REMOVED*** button should be shown or not.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.ui.DatePicker.prototype.allowNone_ = true;


***REMOVED***
***REMOVED*** Flag indicating if the today button should be shown.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.ui.DatePicker.prototype.showToday_ = true;


***REMOVED***
***REMOVED*** Flag indicating if the picker should use a simple navigation menu that only
***REMOVED*** contains controls for navigating to the next and previous month. The default
***REMOVED*** navigation menu contains controls for navigating to the next/previous month,
***REMOVED*** next/previous year, and menus for jumping to specific months and years.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.ui.DatePicker.prototype.simpleNavigation_ = false;


***REMOVED***
***REMOVED*** Custom decorator function. Takes a goog.date.Date object, returns a String
***REMOVED*** representing a CSS class or null if no special styling applies
***REMOVED*** @type {Function}
***REMOVED*** @private
***REMOVED***
goog.ui.DatePicker.prototype.decoratorFunction_ = null;


***REMOVED***
***REMOVED*** Flag indicating if the dates should be printed as a two charater date.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.ui.DatePicker.prototype.longDateFormat_ = false;


***REMOVED***
***REMOVED*** Element for navigation row on a datepicker.
***REMOVED*** @type {Element}
***REMOVED*** @private
***REMOVED***
goog.ui.DatePicker.prototype.elNavRow_ = null;


***REMOVED***
***REMOVED*** Element for the month/year in the navigation row.
***REMOVED*** @type {Element}
***REMOVED*** @private
***REMOVED***
goog.ui.DatePicker.prototype.elMonthYear_ = null;


***REMOVED***
***REMOVED*** Element for footer row on a datepicker.
***REMOVED*** @type {Element}
***REMOVED*** @private
***REMOVED***
goog.ui.DatePicker.prototype.elFootRow_ = null;


***REMOVED***
***REMOVED*** Generator for unique table cell IDs.
***REMOVED*** @type {goog.ui.IdGenerator}
***REMOVED*** @private
***REMOVED***
goog.ui.DatePicker.prototype.cellIdGenerator_ =
    goog.ui.IdGenerator.getInstance();


***REMOVED***
***REMOVED*** Name of base CSS class of datepicker.
***REMOVED*** @type {string}
***REMOVED*** @private
***REMOVED***
goog.ui.DatePicker.BASE_CSS_CLASS_ = goog.getCssName('goog-date-picker');


***REMOVED***
***REMOVED*** The numbers of years to show before and after the current one in the
***REMOVED*** year pull-down menu. A total of YEAR_MENU_RANGE***REMOVED*** 2 + 1 will be shown.
***REMOVED*** Example: for range = 2 and year 2013 => [2011, 2012, 2013, 2014, 2015]
***REMOVED*** @const {number}
***REMOVED*** @private
***REMOVED***
goog.ui.DatePicker.YEAR_MENU_RANGE_ = 5;


***REMOVED***
***REMOVED*** Constants for event names
***REMOVED***
***REMOVED*** @type {Object}
***REMOVED***
goog.ui.DatePicker.Events = {
  CHANGE: 'change',
  CHANGE_ACTIVE_MONTH: 'changeActiveMonth',
  SELECT: 'select'
***REMOVED***


***REMOVED***
***REMOVED*** @deprecated Use isInDocument.
***REMOVED***
goog.ui.DatePicker.prototype.isCreated =
    goog.ui.DatePicker.prototype.isInDocument;


***REMOVED***
***REMOVED*** @return {number} The first day of week, 0 = Monday, 6 = Sunday.
***REMOVED***
goog.ui.DatePicker.prototype.getFirstWeekday = function() {
  return this.activeMonth_.getFirstDayOfWeek();
***REMOVED***


***REMOVED***
***REMOVED*** Returns the class name associated with specified weekday.
***REMOVED*** @param {number} wday The week day number to get the class name for.
***REMOVED*** @return {string} The class name associated with specified weekday.
***REMOVED***
goog.ui.DatePicker.prototype.getWeekdayClass = function(wday) {
  return this.wdayStyles_[wday];
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} Whether a fixed number of weeks should be showed. If not
***REMOVED***     only weeks for the current month will be shown.
***REMOVED***
goog.ui.DatePicker.prototype.getShowFixedNumWeeks = function() {
  return this.showFixedNumWeeks_;
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} Whether a days from the previous and/or next month should
***REMOVED***     be shown.
***REMOVED***
goog.ui.DatePicker.prototype.getShowOtherMonths = function() {
  return this.showOtherMonths_;
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} Whether a the extra week(s) added always should be at the
***REMOVED***     end. Only applicable if a fixed number of weeks are shown.
***REMOVED***
goog.ui.DatePicker.prototype.getExtraWeekAtEnd = function() {
  return this.extraWeekAtEnd_;
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} Whether week numbers should be shown.
***REMOVED***
goog.ui.DatePicker.prototype.getShowWeekNum = function() {
  return this.showWeekNum_;
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} Whether weekday names should be shown.
***REMOVED***
goog.ui.DatePicker.prototype.getShowWeekdayNames = function() {
  return this.showWeekdays_;
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} Whether none is a valid selection.
***REMOVED***
goog.ui.DatePicker.prototype.getAllowNone = function() {
  return this.allowNone_;
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} Whether the today button should be shown.
***REMOVED***
goog.ui.DatePicker.prototype.getShowToday = function() {
  return this.showToday_;
***REMOVED***


***REMOVED***
***REMOVED*** Returns base CSS class. This getter is used to get base CSS class part.
***REMOVED*** All CSS class names in component are created as:
***REMOVED***   goog.getCssName(this.getBaseCssClass(), 'CLASS_NAME')
***REMOVED*** @return {string} Base CSS class.
***REMOVED***
goog.ui.DatePicker.prototype.getBaseCssClass = function() {
  return goog.ui.DatePicker.BASE_CSS_CLASS_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the first day of week
***REMOVED***
***REMOVED*** @param {number} wday Week day, 0 = Monday, 6 = Sunday.
***REMOVED***
goog.ui.DatePicker.prototype.setFirstWeekday = function(wday) {
  this.activeMonth_.setFirstDayOfWeek(wday);
  this.updateCalendarGrid_();
  this.redrawWeekdays_();
***REMOVED***


***REMOVED***
***REMOVED*** Sets class name associated with specified weekday.
***REMOVED***
***REMOVED*** @param {number} wday Week day, 0 = Monday, 6 = Sunday.
***REMOVED*** @param {string} className Class name.
***REMOVED***
goog.ui.DatePicker.prototype.setWeekdayClass = function(wday, className) {
  this.wdayStyles_[wday] = className;
  this.redrawCalendarGrid_();
***REMOVED***


***REMOVED***
***REMOVED*** Sets whether a fixed number of weeks should be showed. If not only weeks
***REMOVED*** for the current month will be showed.
***REMOVED***
***REMOVED*** @param {boolean} b Whether a fixed number of weeks should be showed.
***REMOVED***
goog.ui.DatePicker.prototype.setShowFixedNumWeeks = function(b) {
  this.showFixedNumWeeks_ = b;
  this.updateCalendarGrid_();
***REMOVED***


***REMOVED***
***REMOVED*** Sets whether a days from the previous and/or next month should be shown.
***REMOVED***
***REMOVED*** @param {boolean} b Whether a days from the previous and/or next month should
***REMOVED***     be shown.
***REMOVED***
goog.ui.DatePicker.prototype.setShowOtherMonths = function(b) {
  this.showOtherMonths_ = b;
  this.redrawCalendarGrid_();
***REMOVED***


***REMOVED***
***REMOVED*** Sets the range of dates which may be selected by the user.
***REMOVED***
***REMOVED*** @param {goog.date.DateRange} dateRange The range of selectable dates.
***REMOVED***
goog.ui.DatePicker.prototype.setUserSelectableDateRange =
    function(dateRange) {
  this.userSelectableDateRange_ = dateRange;
***REMOVED***


***REMOVED***
***REMOVED*** Determine if a date may be selected by the user.
***REMOVED***
***REMOVED*** @param {goog.date.Date} date The date to be tested.
***REMOVED*** @return {boolean} Whether the user may select this date.
***REMOVED*** @private
***REMOVED***
goog.ui.DatePicker.prototype.isUserSelectableDate_ = function(date) {
  return this.userSelectableDateRange_.contains(date);
***REMOVED***


***REMOVED***
***REMOVED*** Sets whether the picker should use a simple navigation menu that only
***REMOVED*** contains controls for navigating to the next and previous month. The default
***REMOVED*** navigation menu contains controls for navigating to the next/previous month,
***REMOVED*** next/previous year, and menus for jumping to specific months and years.
***REMOVED***
***REMOVED*** @param {boolean} b Whether to use a simple navigation menu.
***REMOVED***
goog.ui.DatePicker.prototype.setUseSimpleNavigationMenu = function(b) {
  this.simpleNavigation_ = b;
  this.updateNavigationRow_();
  this.updateCalendarGrid_();
***REMOVED***


***REMOVED***
***REMOVED*** Sets whether a the extra week(s) added always should be at the end. Only
***REMOVED*** applicable if a fixed number of weeks are shown.
***REMOVED***
***REMOVED*** @param {boolean} b Whether a the extra week(s) added always should be at the
***REMOVED***     end.
***REMOVED***
goog.ui.DatePicker.prototype.setExtraWeekAtEnd = function(b) {
  this.extraWeekAtEnd_ = b;
  this.updateCalendarGrid_();
***REMOVED***


***REMOVED***
***REMOVED*** Sets whether week numbers should be shown.
***REMOVED***
***REMOVED*** @param {boolean} b Whether week numbers should be shown.
***REMOVED***
goog.ui.DatePicker.prototype.setShowWeekNum = function(b) {
  this.showWeekNum_ = b;
  // The navigation and footer rows may rely on the number of visible columns,
  // so we update them when adding/removing the weeknum column.
  this.updateNavigationRow_();
  this.updateFooterRow_();
  this.updateCalendarGrid_();
***REMOVED***


***REMOVED***
***REMOVED*** Sets whether weekday names should be shown.
***REMOVED***
***REMOVED*** @param {boolean} b Whether weekday names should be shown.
***REMOVED***
goog.ui.DatePicker.prototype.setShowWeekdayNames = function(b) {
  this.showWeekdays_ = b;
  this.redrawWeekdays_();
  this.redrawCalendarGrid_();
***REMOVED***


***REMOVED***
***REMOVED*** Sets whether the picker uses narrow weekday names ('M', 'T', 'W', ...).
***REMOVED***
***REMOVED*** The default behavior is to use short names ('Mon', 'Tue', 'Wed', ...).
***REMOVED***
***REMOVED*** @param {boolean} b Whether to use narrow weekday names.
***REMOVED***
goog.ui.DatePicker.prototype.setUseNarrowWeekdayNames = function(b) {
  this.wdayNames_ = b ? this.symbols_.STANDALONENARROWWEEKDAYS :
      this.symbols_.STANDALONESHORTWEEKDAYS;
  this.redrawWeekdays_();
***REMOVED***


***REMOVED***
***REMOVED*** Sets whether none is a valid selection.
***REMOVED***
***REMOVED*** @param {boolean} b Whether none is a valid selection.
***REMOVED***
goog.ui.DatePicker.prototype.setAllowNone = function(b) {
  this.allowNone_ = b;
  if (this.elNone_) {
    this.updateTodayAndNone_();
  }
***REMOVED***


***REMOVED***
***REMOVED*** Sets whether the today button should be shown.
***REMOVED***
***REMOVED*** @param {boolean} b Whether the today button should be shown.
***REMOVED***
goog.ui.DatePicker.prototype.setShowToday = function(b) {
  this.showToday_ = b;
  if (this.elToday_) {
    this.updateTodayAndNone_();
  }
***REMOVED***


***REMOVED***
***REMOVED*** Updates the display style of the None and Today buttons as well as hides the
***REMOVED*** table foot if both are hidden.
***REMOVED*** @private
***REMOVED***
goog.ui.DatePicker.prototype.updateTodayAndNone_ = function() {
  goog.style.setElementShown(this.elToday_, this.showToday_);
  goog.style.setElementShown(this.elNone_, this.allowNone_);
  goog.style.setElementShown(this.tableFoot_,
                             this.showToday_ || this.allowNone_);
***REMOVED***


***REMOVED***
***REMOVED*** Sets the decorator function. The function should have the interface of
***REMOVED***   {string} f({goog.date.Date});
***REMOVED*** and return a String representing a CSS class to decorate the cell
***REMOVED*** corresponding to the date specified.
***REMOVED***
***REMOVED*** @param {Function} f The decorator function.
***REMOVED***
goog.ui.DatePicker.prototype.setDecorator = function(f) {
  this.decoratorFunction_ = f;
***REMOVED***


***REMOVED***
***REMOVED*** Sets whether the date will be printed in long format. In long format, dates
***REMOVED*** such as '1' will be printed as '01'.
***REMOVED***
***REMOVED*** @param {boolean} b Whethere dates should be printed in long format.
***REMOVED***
goog.ui.DatePicker.prototype.setLongDateFormat = function(b) {
  this.longDateFormat_ = b;
  this.redrawCalendarGrid_();
***REMOVED***


***REMOVED***
***REMOVED*** Changes the active month to the previous one.
***REMOVED***
goog.ui.DatePicker.prototype.previousMonth = function() {
  this.activeMonth_.add(new goog.date.Interval(goog.date.Interval.MONTHS, -1));
  this.updateCalendarGrid_();
  this.fireChangeActiveMonthEvent_();
***REMOVED***


***REMOVED***
***REMOVED*** Changes the active month to the next one.
***REMOVED***
goog.ui.DatePicker.prototype.nextMonth = function() {
  this.activeMonth_.add(new goog.date.Interval(goog.date.Interval.MONTHS, 1));
  this.updateCalendarGrid_();
  this.fireChangeActiveMonthEvent_();
***REMOVED***


***REMOVED***
***REMOVED*** Changes the active year to the previous one.
***REMOVED***
goog.ui.DatePicker.prototype.previousYear = function() {
  this.activeMonth_.add(new goog.date.Interval(goog.date.Interval.YEARS, -1));
  this.updateCalendarGrid_();
  this.fireChangeActiveMonthEvent_();
***REMOVED***


***REMOVED***
***REMOVED*** Changes the active year to the next one.
***REMOVED***
goog.ui.DatePicker.prototype.nextYear = function() {
  this.activeMonth_.add(new goog.date.Interval(goog.date.Interval.YEARS, 1));
  this.updateCalendarGrid_();
  this.fireChangeActiveMonthEvent_();
***REMOVED***


***REMOVED***
***REMOVED*** Selects the current date.
***REMOVED***
goog.ui.DatePicker.prototype.selectToday = function() {
  this.setDate(new goog.date.Date());
***REMOVED***


***REMOVED***
***REMOVED*** Clears the selection.
***REMOVED***
goog.ui.DatePicker.prototype.selectNone = function() {
  if (this.allowNone_) {
    this.setDate(null);
  }
***REMOVED***


***REMOVED***
***REMOVED*** @return {!goog.date.Date} The active month displayed.
***REMOVED***
goog.ui.DatePicker.prototype.getActiveMonth = function() {
  return this.activeMonth_.clone();
***REMOVED***


***REMOVED***
***REMOVED*** @return {goog.date.Date} The selected date or null if nothing is selected.
***REMOVED***
goog.ui.DatePicker.prototype.getDate = function() {
  return this.date_ && this.date_.clone();
***REMOVED***


***REMOVED***
***REMOVED*** Sets the selected date.
***REMOVED***
***REMOVED*** @param {goog.date.Date|Date} date Date to select or null to select nothing.
***REMOVED***
goog.ui.DatePicker.prototype.setDate = function(date) {
  // Check if the month has been changed.
  var sameMonth = date == this.date_ || date && this.date_ &&
      date.getFullYear() == this.date_.getFullYear() &&
      date.getMonth() == this.date_.getMonth();

  // Check if the date has been changed.
  var sameDate = date == this.date_ || sameMonth &&
      date.getDate() == this.date_.getDate();

  // Set current date to clone of supplied goog.date.Date or Date.
  this.date_ = date && new goog.date.Date(date);

  // Set current month
  if (date) {
    this.activeMonth_.set(this.date_);
    this.activeMonth_.setDate(1);
  }

  // Update calendar grid even if the date has not changed as even if today is
  // selected another month can be displayed.
  this.updateCalendarGrid_();

  // TODO(eae): Standardize selection and change events with other components.
  // Fire select event.
  var selectEvent = new goog.ui.DatePickerEvent(
      goog.ui.DatePicker.Events.SELECT, this, this.date_);
  this.dispatchEvent(selectEvent);

  // Fire change event.
  if (!sameDate) {
    var changeEvent = new goog.ui.DatePickerEvent(
        goog.ui.DatePicker.Events.CHANGE, this, this.date_);
    this.dispatchEvent(changeEvent);
  }

  // Fire change active month event.
  if (!sameMonth) {
    this.fireChangeActiveMonthEvent_();
  }
***REMOVED***


***REMOVED***
***REMOVED*** Updates the navigation row (navigating months and maybe years) in the navRow_
***REMOVED*** element of a created picker.
***REMOVED*** @private
***REMOVED***
goog.ui.DatePicker.prototype.updateNavigationRow_ = function() {
  if (!this.elNavRow_) {
    return;
  }
  var row = this.elNavRow_;

  // Clear the navigation row.
  while (row.firstChild) {
    row.removeChild(row.firstChild);
  }

  var fullDateFormat = this.symbols_.DATEFORMATS[
      goog.i18n.DateTimeFormat.Format.FULL_DATE].toLowerCase();
  this.renderer_.renderNavigationRow(
      row, this.simpleNavigation_, this.showWeekNum_, fullDateFormat);

  if (this.simpleNavigation_) {
    this.addPreventDefaultClickHandler_(row,
        goog.getCssName(this.getBaseCssClass(), 'previousMonth'),
        this.previousMonth);
    this.addPreventDefaultClickHandler_(row,
        goog.getCssName(this.getBaseCssClass(), 'nextMonth'),
        this.nextMonth);

    this.elMonthYear_ = goog.dom.getElementByClass(
        goog.getCssName(this.getBaseCssClass(), 'monthyear'),
        row);
  } else {
    this.addPreventDefaultClickHandler_(row,
        goog.getCssName(this.getBaseCssClass(), 'previousMonth'),
        this.previousMonth);
    this.addPreventDefaultClickHandler_(row,
        goog.getCssName(this.getBaseCssClass(), 'nextMonth'),
        this.nextMonth);
    this.addPreventDefaultClickHandler_(row,
        goog.getCssName(this.getBaseCssClass(), 'month'),
        this.showMonthMenu_);

    this.addPreventDefaultClickHandler_(row,
        goog.getCssName(this.getBaseCssClass(), 'previousYear'),
        this.previousYear);
    this.addPreventDefaultClickHandler_(row,
        goog.getCssName(this.getBaseCssClass(), 'nextYear'),
        this.nextYear);
    this.addPreventDefaultClickHandler_(row,
        goog.getCssName(this.getBaseCssClass(), 'year'),
        this.showYearMenu_);

    this.elMonth_ = goog.dom.getElementByClass(
        goog.getCssName(this.getBaseCssClass(), 'month'), row);
    this.elYear_ = goog.dom.getDomHelper().getElementByClass(
        goog.getCssName(this.getBaseCssClass(), 'year'), row);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Setup click handler with prevent default.
***REMOVED***
***REMOVED*** @param {!Element} parentElement The parent element of the element. This is
***REMOVED***     needed because the element in question might not be in the dom yet.
***REMOVED*** @param {string} cssName The CSS class name of the element to attach a click
***REMOVED***     handler.
***REMOVED*** @param {Function} handlerFunction The click handler function.
***REMOVED*** @private
***REMOVED***
goog.ui.DatePicker.prototype.addPreventDefaultClickHandler_ =
    function(parentElement, cssName, handlerFunction) {
  var element = goog.dom.getElementByClass(cssName, parentElement);
  this.getHandler().listen(element,
      goog.events.EventType.CLICK,
      function(e) {
        e.preventDefault();
        handlerFunction.call(this, e);
      });
***REMOVED***


***REMOVED***
***REMOVED*** Updates the footer row (with select buttons) in the footRow_ element of a
***REMOVED*** created picker.
***REMOVED*** @private
***REMOVED***
goog.ui.DatePicker.prototype.updateFooterRow_ = function() {
  if (!this.elFootRow_) {
    return;
  }

  var row = this.elFootRow_;

  // Clear the footer row.
  goog.dom.removeChildren(row);

  this.renderer_.renderFooterRow(row, this.showWeekNum_);

  this.addPreventDefaultClickHandler_(row,
      goog.getCssName(this.getBaseCssClass(), 'today-btn'),
      this.selectToday);
  this.addPreventDefaultClickHandler_(row,
      goog.getCssName(this.getBaseCssClass(), 'none-btn'),
      this.selectNone);

  this.elToday_ = goog.dom.getElementByClass(
      goog.getCssName(this.getBaseCssClass(), 'today-btn'), row);
  this.elNone_ = goog.dom.getElementByClass(
      goog.getCssName(this.getBaseCssClass(), 'none-btn'), row);

  this.updateTodayAndNone_();
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.ui.DatePicker.prototype.decorateInternal = function(el) {
  goog.ui.DatePicker.superClass_.decorateInternal.call(this, el);
  goog.asserts.assert(el);
  goog.dom.classlist.add(el, this.getBaseCssClass());

  var table = this.dom_.createElement('table');
  var thead = this.dom_.createElement('thead');
  var tbody = this.dom_.createElement('tbody');
  var tfoot = this.dom_.createElement('tfoot');

  goog.a11y.aria.setRole(tbody, 'grid');
  tbody.tabIndex = '0';

  // As per comment in colorpicker: table.tBodies and table.tFoot should not be
  // used because of a bug in Safari, hence using an instance variable
  this.tableBody_ = tbody;
  this.tableFoot_ = tfoot;

  var row = this.dom_.createElement('tr');
  row.className = goog.getCssName(this.getBaseCssClass(), 'head');
  this.elNavRow_ = row;
  this.updateNavigationRow_();

  thead.appendChild(row);

  var cell;
  this.elTable_ = [];
  for (var i = 0; i < 7; i++) {
    row = this.dom_.createElement('tr');
    this.elTable_[i] = [];
    for (var j = 0; j < 8; j++) {
      cell = this.dom_.createElement(j == 0 || i == 0 ? 'th' : 'td');
      if ((j == 0 || i == 0) && j != i) {
        cell.className = (j == 0) ?
            goog.getCssName(this.getBaseCssClass(), 'week') :
            goog.getCssName(this.getBaseCssClass(), 'wday');
        goog.a11y.aria.setRole(cell, j == 0 ? 'rowheader' : 'columnheader');
      }
      row.appendChild(cell);
      this.elTable_[i][j] = cell;
    }
    tbody.appendChild(row);
  }

  row = this.dom_.createElement('tr');
  row.className = goog.getCssName(this.getBaseCssClass(), 'foot');
  this.elFootRow_ = row;
  this.updateFooterRow_();
  tfoot.appendChild(row);


  table.cellSpacing = '0';
  table.cellPadding = '0';
  table.appendChild(thead);
  table.appendChild(tbody);
  table.appendChild(tfoot);
  el.appendChild(table);

  this.redrawWeekdays_();
  this.updateCalendarGrid_();

  el.tabIndex = 0;
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.ui.DatePicker.prototype.createDom = function() {
  goog.ui.DatePicker.superClass_.createDom.call(this);
  this.decorateInternal(this.getElement());
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.ui.DatePicker.prototype.enterDocument = function() {
  goog.ui.DatePicker.superClass_.enterDocument.call(this);

  var eh = this.getHandler();
  eh.listen(this.tableBody_, goog.events.EventType.CLICK,
      this.handleGridClick_);
  eh.listen(this.getKeyHandlerForElement_(this.getElement()),
      goog.events.KeyHandler.EventType.KEY, this.handleGridKeyPress_);
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.ui.DatePicker.prototype.exitDocument = function() {
  goog.ui.DatePicker.superClass_.exitDocument.call(this);
  this.destroyMenu_();
  for (var uid in this.keyHandlers_) {
    this.keyHandlers_[uid].dispose();
  }
  this.keyHandlers_ = {***REMOVED***
***REMOVED***


***REMOVED***
***REMOVED*** @deprecated Use decorate instead.
***REMOVED***
goog.ui.DatePicker.prototype.create =
    goog.ui.DatePicker.prototype.decorate;


***REMOVED*** @override***REMOVED***
goog.ui.DatePicker.prototype.disposeInternal = function() {
  goog.ui.DatePicker.superClass_.disposeInternal.call(this);

  this.elTable_ = null;
  this.tableBody_ = null;
  this.tableFoot_ = null;
  this.elNavRow_ = null;
  this.elFootRow_ = null;
  this.elMonth_ = null;
  this.elMonthYear_ = null;
  this.elYear_ = null;
  this.elToday_ = null;
  this.elNone_ = null;
***REMOVED***


***REMOVED***
***REMOVED*** Click handler for date grid.
***REMOVED***
***REMOVED*** @param {goog.events.BrowserEvent} event Click event.
***REMOVED*** @private
***REMOVED***
goog.ui.DatePicker.prototype.handleGridClick_ = function(event) {
  if (event.target.tagName == 'TD') {
    // colIndex/rowIndex is broken in Safari, find position by looping
    var el, x = -2, y = -2; // first col/row is for weekday/weeknum
    for (el = event.target; el; el = el.previousSibling, x++) {}
    for (el = event.target.parentNode; el; el = el.previousSibling, y++) {}
    var obj = this.grid_[y][x];
    if (this.isUserSelectableDate_(obj)) {
      this.setDate(obj.clone());
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** Keypress handler for date grid.
***REMOVED***
***REMOVED*** @param {goog.events.BrowserEvent} event Keypress event.
***REMOVED*** @private
***REMOVED***
goog.ui.DatePicker.prototype.handleGridKeyPress_ = function(event) {
  var months, days;
  switch (event.keyCode) {
    case 33: // Page up
      event.preventDefault();
      months = -1;
      break;
    case 34: // Page down
      event.preventDefault();
      months = 1;
      break;
    case 37: // Left
      event.preventDefault();
      days = -1;
      break;
    case 39: // Right
      event.preventDefault();
      days = 1;
      break;
    case 38: // Down
      event.preventDefault();
      days = -7;
      break;
    case 40: // Up
      event.preventDefault();
      days = 7;
      break;
    case 36: // Home
      event.preventDefault();
      this.selectToday();
    case 46: // Delete
      event.preventDefault();
      this.selectNone();
    default:
      return;
  }
  var date;
  if (this.date_) {
    date = this.date_.clone();
    date.add(new goog.date.Interval(0, months, days));
  } else {
    date = this.activeMonth_.clone();
    date.setDate(1);
  }
  if (this.isUserSelectableDate_(date)) {
    this.setDate(date);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Click handler for month button. Opens month selection menu.
***REMOVED***
***REMOVED*** @param {goog.events.BrowserEvent} event Click event.
***REMOVED*** @private
***REMOVED***
goog.ui.DatePicker.prototype.showMonthMenu_ = function(event) {
  event.stopPropagation();

  var list = [];
  for (var i = 0; i < 12; i++) {
    list.push(this.symbols_.STANDALONEMONTHS[i]);
  }
  this.createMenu_(this.elMonth_, list, this.handleMonthMenuClick_,
      this.symbols_.STANDALONEMONTHS[this.activeMonth_.getMonth()]);
***REMOVED***


***REMOVED***
***REMOVED*** Click handler for year button. Opens year selection menu.
***REMOVED***
***REMOVED*** @param {goog.events.BrowserEvent} event Click event.
***REMOVED*** @private
***REMOVED***
goog.ui.DatePicker.prototype.showYearMenu_ = function(event) {
  event.stopPropagation();

  var list = [];
  var year = this.activeMonth_.getFullYear();
  var loopDate = this.activeMonth_.clone();
  for (var i = -goog.ui.DatePicker.YEAR_MENU_RANGE_;
      i <= goog.ui.DatePicker.YEAR_MENU_RANGE_; i++) {
    loopDate.setFullYear(year + i);
    list.push(this.i18nDateFormatterYear_.format(loopDate));
  }
  this.createMenu_(this.elYear_, list, this.handleYearMenuClick_,
      this.i18nDateFormatterYear_.format(this.activeMonth_));
***REMOVED***


***REMOVED***
***REMOVED*** Call back function for month menu.
***REMOVED***
***REMOVED*** @param {Element} target Selected item.
***REMOVED*** @private
***REMOVED***
goog.ui.DatePicker.prototype.handleMonthMenuClick_ = function(target) {
  var itemIndex = Number(target.getAttribute('itemIndex'));
  this.activeMonth_.setMonth(itemIndex);
  this.updateCalendarGrid_();

  if (this.elMonth_.focus) {
    this.elMonth_.focus();
  }
***REMOVED***


***REMOVED***
***REMOVED*** Call back function for year menu.
***REMOVED***
***REMOVED*** @param {Element} target Selected item.
***REMOVED*** @private
***REMOVED***
goog.ui.DatePicker.prototype.handleYearMenuClick_ = function(target) {
  if (target.firstChild.nodeType == goog.dom.NodeType.TEXT) {
    // We use the same technique used for months to get the position of the
    // item in the menu, as the year is not necessarily numeric.
    var itemIndex = Number(target.getAttribute('itemIndex'));
    var year = this.activeMonth_.getFullYear();
    this.activeMonth_.setFullYear(year + itemIndex -
        goog.ui.DatePicker.YEAR_MENU_RANGE_);
    this.updateCalendarGrid_();
  }

  this.elYear_.focus();
***REMOVED***


***REMOVED***
***REMOVED*** Support function for menu creation.
***REMOVED***
***REMOVED*** @param {Element} srcEl Button to create menu for.
***REMOVED*** @param {Array.<string>} items List of items to populate menu with.
***REMOVED*** @param {Function} method Call back method.
***REMOVED*** @param {string} selected Item to mark as selected in menu.
***REMOVED*** @private
***REMOVED***
goog.ui.DatePicker.prototype.createMenu_ = function(srcEl, items, method,
                                                    selected) {
  this.destroyMenu_();

  var el = this.dom_.createElement('div');
  el.className = goog.getCssName(this.getBaseCssClass(), 'menu');

  this.menuSelected_ = null;

  var ul = this.dom_.createElement('ul');
  for (var i = 0; i < items.length; i++) {
    var li = this.dom_.createDom('li', null, items[i]);
    li.setAttribute('itemIndex', i);
    if (items[i] == selected) {
      this.menuSelected_ = li;
    }
    ul.appendChild(li);
  }
  el.appendChild(ul);
  el.style.left = srcEl.offsetLeft + srcEl.parentNode.offsetLeft + 'px';
  el.style.top = srcEl.offsetTop + 'px';
  el.style.width = srcEl.clientWidth + 'px';
  this.elMonth_.parentNode.appendChild(el);

  this.menu_ = el;
  if (!this.menuSelected_) {
    this.menuSelected_ = ul.firstChild;
  }
  this.menuSelected_.className =
      goog.getCssName(this.getBaseCssClass(), 'menu-selected');
  this.menuCallback_ = method;

  var eh = this.getHandler();
  eh.listen(this.menu_, goog.events.EventType.CLICK, this.handleMenuClick_);
  eh.listen(this.getKeyHandlerForElement_(this.menu_),
      goog.events.KeyHandler.EventType.KEY, this.handleMenuKeyPress_);
  eh.listen(this.dom_.getDocument(), goog.events.EventType.CLICK,
      this.destroyMenu_);
  el.tabIndex = 0;
  el.focus();
***REMOVED***


***REMOVED***
***REMOVED*** Click handler for menu.
***REMOVED***
***REMOVED*** @param {goog.events.BrowserEvent} event Click event.
***REMOVED*** @private
***REMOVED***
goog.ui.DatePicker.prototype.handleMenuClick_ = function(event) {
  event.stopPropagation();

  this.destroyMenu_();
  if (this.menuCallback_) {
    this.menuCallback_(event.target);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Keypress handler for menu.
***REMOVED***
***REMOVED*** @param {goog.events.BrowserEvent} event Keypress event.
***REMOVED*** @private
***REMOVED***
goog.ui.DatePicker.prototype.handleMenuKeyPress_ = function(event) {
  // Prevent the grid keypress handler from catching the keypress event.
  event.stopPropagation();

  var el;
  var menuSelected = this.menuSelected_;
  switch (event.keyCode) {
    case 35: // End
      event.preventDefault();
      el = menuSelected.parentNode.lastChild;
      break;
    case 36: // Home
      event.preventDefault();
      el = menuSelected.parentNode.firstChild;
      break;
    case 38: // Up
      event.preventDefault();
      el = menuSelected.previousSibling;
      break;
    case 40: // Down
      event.preventDefault();
      el = menuSelected.nextSibling;
      break;
    case 13: // Enter
    case 9: // Tab
    case 0: // Space
      event.preventDefault();
      this.destroyMenu_();
      this.menuCallback_(menuSelected);
      break;
  }
  if (el && el != menuSelected) {
    menuSelected.className = '';
    el.className = goog.getCssName(this.getBaseCssClass(), 'menu-selected');
    this.menuSelected_ = el;
  }
***REMOVED***


***REMOVED***
***REMOVED*** Support function for menu destruction.
***REMOVED*** @private
***REMOVED***
goog.ui.DatePicker.prototype.destroyMenu_ = function() {
  if (this.menu_) {
    var eh = this.getHandler();
    eh.unlisten(this.menu_, goog.events.EventType.CLICK, this.handleMenuClick_);
    eh.unlisten(this.getKeyHandlerForElement_(this.menu_),
        goog.events.KeyHandler.EventType.KEY, this.handleMenuKeyPress_);
    eh.unlisten(this.dom_.getDocument(), goog.events.EventType.CLICK,
        this.destroyMenu_);
    goog.dom.removeNode(this.menu_);
    delete this.menu_;
  }
***REMOVED***


***REMOVED***
***REMOVED*** Determines the dates/weekdays for the current month and builds an in memory
***REMOVED*** representation of the calendar.
***REMOVED***
***REMOVED*** @private
***REMOVED***
goog.ui.DatePicker.prototype.updateCalendarGrid_ = function() {
  if (!this.getElement()) {
    return;
  }

  var date = this.activeMonth_.clone();
  date.setDate(1);

  // Show year name of select month
  if (this.elMonthYear_) {
    goog.dom.setTextContent(this.elMonthYear_,
        this.i18nDateFormatterMonthYear_.format(date));
  }
  if (this.elMonth_) {
    goog.dom.setTextContent(this.elMonth_,
        this.symbols_.STANDALONEMONTHS[date.getMonth()]);
  }
  if (this.elYear_) {
    goog.dom.setTextContent(this.elYear_,
        this.i18nDateFormatterYear_.format(date));
  }

  var wday = date.getWeekday();
  var days = date.getNumberOfDaysInMonth();

  // Determine how many days to show for previous month
  date.add(new goog.date.Interval(goog.date.Interval.MONTHS, -1));
  date.setDate(date.getNumberOfDaysInMonth() - (wday - 1));

  if (this.showFixedNumWeeks_ && !this.extraWeekAtEnd_ && days + wday < 33) {
    date.add(new goog.date.Interval(goog.date.Interval.DAYS, -7));
  }

  // Create weekday/day grid
  var dayInterval = new goog.date.Interval(goog.date.Interval.DAYS, 1);
  this.grid_ = [];
  for (var y = 0; y < 6; y++) { // Weeks
    this.grid_[y] = [];
    for (var x = 0; x < 7; x++) { // Weekdays
      this.grid_[y][x] = date.clone();
      date.add(dayInterval);
    }
  }

  this.redrawCalendarGrid_();
***REMOVED***


***REMOVED***
***REMOVED*** Draws calendar view from in memory representation and applies class names
***REMOVED*** depending on the selection, weekday and whatever the day belongs to the
***REMOVED*** active month or not.
***REMOVED*** @private
***REMOVED***
goog.ui.DatePicker.prototype.redrawCalendarGrid_ = function() {
  if (!this.getElement()) {
    return;
  }

  var month = this.activeMonth_.getMonth();
  var today = new goog.date.Date();
  var todayYear = today.getFullYear();
  var todayMonth = today.getMonth();
  var todayDate = today.getDate();

  // Draw calendar week by week, a worst case month has six weeks.
  for (var y = 0; y < 6; y++) {

    // Draw week number, if enabled
    if (this.showWeekNum_) {
      goog.dom.setTextContent(this.elTable_[y + 1][0],
          this.i18nDateFormatterWeek_.format(this.grid_[y][0]));
      goog.dom.classlist.set(this.elTable_[y + 1][0],
          goog.getCssName(this.getBaseCssClass(), 'week'));
    } else {
      goog.dom.setTextContent(this.elTable_[y + 1][0], '');
      goog.dom.classlist.set(this.elTable_[y + 1][0], '');
    }

    for (var x = 0; x < 7; x++) {
      var o = this.grid_[y][x];
      var el = this.elTable_[y + 1][x + 1];

      // Assign a unique element id (required for setting the active descendant
      // ARIA role) unless already set.
      if (!el.id) {
        el.id = this.cellIdGenerator_.getNextUniqueId();
      }
      goog.asserts.assert(el, 'The table DOM element cannot be null.');
      goog.a11y.aria.setRole(el, 'gridcell');
      var classes = [goog.getCssName(this.getBaseCssClass(), 'date')];
      if (!this.isUserSelectableDate_(o)) {
        classes.push(goog.getCssName(this.getBaseCssClass(),
            'unavailable-date'));
      }
      if (this.showOtherMonths_ || o.getMonth() == month) {
        // Date belongs to previous or next month
        if (o.getMonth() != month) {
          classes.push(goog.getCssName(this.getBaseCssClass(), 'other-month'));
        }

        // Apply styles set by setWeekdayClass
        var wday = (x + this.activeMonth_.getFirstDayOfWeek() + 7) % 7;
        if (this.wdayStyles_[wday]) {
          classes.push(this.wdayStyles_[wday]);
        }

        // Current date
        if (o.getDate() == todayDate && o.getMonth() == todayMonth &&
            o.getFullYear() == todayYear) {
          classes.push(goog.getCssName(this.getBaseCssClass(), 'today'));
        }

        // Selected date
        if (this.date_ && o.getDate() == this.date_.getDate() &&
            o.getMonth() == this.date_.getMonth() &&
            o.getFullYear() == this.date_.getFullYear()) {
          classes.push(goog.getCssName(this.getBaseCssClass(), 'selected'));
          goog.asserts.assert(this.tableBody_,
              'The table body DOM element cannot be null');
          goog.a11y.aria.setState(this.tableBody_, 'activedescendant', el.id);
        }

        // Custom decorator
        if (this.decoratorFunction_) {
          var customClass = this.decoratorFunction_(o);
          if (customClass) {
            classes.push(customClass);
          }
        }

        // Set cell text to the date and apply classes.
        var formatedDate = this.longDateFormat_ ?
            this.i18nDateFormatterDay2_.format(o) :
            this.i18nDateFormatterDay_.format(o);
        goog.dom.setTextContent(el, formatedDate);
        // Date belongs to previous or next month and showOtherMonths is false,
        // clear text and classes.
      } else {
        goog.dom.setTextContent(el, '');
      }
      goog.dom.classlist.set(el, classes.join(' '));
    }

    // Hide the either the last one or last two weeks if they contain no days
    // from the active month and the showFixedNumWeeks is false. The first four
    // weeks are always shown as no month has less than 28 days).
    if (y >= 4) {
      goog.style.setElementShown(this.elTable_[y + 1][0].parentNode,
          this.grid_[y][0].getMonth() == month || this.showFixedNumWeeks_);
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** Fires the CHANGE_ACTIVE_MONTH event.
***REMOVED*** @private
***REMOVED***
goog.ui.DatePicker.prototype.fireChangeActiveMonthEvent_ = function() {
  var changeMonthEvent = new goog.ui.DatePickerEvent(
      goog.ui.DatePicker.Events.CHANGE_ACTIVE_MONTH,
      this,
      this.getActiveMonth());
  this.dispatchEvent(changeMonthEvent);
***REMOVED***


***REMOVED***
***REMOVED*** Draw weekday names, if enabled. Start with whatever day has been set as the
***REMOVED*** first day of week.
***REMOVED*** @private
***REMOVED***
goog.ui.DatePicker.prototype.redrawWeekdays_ = function() {
  if (!this.getElement()) {
    return;
  }
  if (this.showWeekdays_) {
    for (var x = 0; x < 7; x++) {
      var el = this.elTable_[0][x + 1];
      var wday = (x + this.activeMonth_.getFirstDayOfWeek() + 7) % 7;
      goog.dom.setTextContent(el, this.wdayNames_[(wday + 1) % 7]);
    }
  }
  goog.style.setElementShown(this.elTable_[0][0].parentNode,
                             this.showWeekdays_);
***REMOVED***


***REMOVED***
***REMOVED*** Returns the key handler for an element and caches it so that it can be
***REMOVED*** retrieved at a later point.
***REMOVED*** @param {Element} el The element to get the key handler for.
***REMOVED*** @return {goog.events.KeyHandler} The key handler for the element.
***REMOVED*** @private
***REMOVED***
goog.ui.DatePicker.prototype.getKeyHandlerForElement_ = function(el) {
  var uid = goog.getUid(el);
  if (!(uid in this.keyHandlers_)) {
    this.keyHandlers_[uid] = new goog.events.KeyHandler(el);
  }
  return this.keyHandlers_[uid];
***REMOVED***



***REMOVED***
***REMOVED*** Object representing a date picker event.
***REMOVED***
***REMOVED*** @param {string} type Event type.
***REMOVED*** @param {goog.ui.DatePicker} target Date picker initiating event.
***REMOVED*** @param {goog.date.Date} date Selected date.
***REMOVED***
***REMOVED*** @extends {goog.events.Event}
***REMOVED*** @final
***REMOVED***
goog.ui.DatePickerEvent = function(type, target, date) {
  goog.events.Event.call(this, type, target);

 ***REMOVED*****REMOVED***
  ***REMOVED*** The selected date
  ***REMOVED*** @type {goog.date.Date}
 ***REMOVED*****REMOVED***
  this.date = date;
***REMOVED***
goog.inherits(goog.ui.DatePickerEvent, goog.events.Event);
