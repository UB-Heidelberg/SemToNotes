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
***REMOVED*** @fileoverview The default renderer for {@link goog.ui.DatePicker}.
***REMOVED***
***REMOVED*** @see ../demos/datepicker.html
***REMOVED***

goog.provide('goog.ui.DefaultDatePickerRenderer');

goog.require('goog.dom');
goog.require('goog.dom.TagName');
***REMOVED*** @suppress {extraRequire} Interface.***REMOVED***
goog.require('goog.ui.DatePickerRenderer');



***REMOVED***
***REMOVED*** Default renderer for {@link goog.ui.DatePicker}. Renders the date picker's
***REMOVED*** navigation header and footer.
***REMOVED***
***REMOVED*** @param {string} baseCssClass Name of base CSS class of the date picker.
***REMOVED*** @param {goog.dom.DomHelper=} opt_domHelper DOM helper.
***REMOVED***
***REMOVED*** @implements {goog.ui.DatePickerRenderer}
***REMOVED***
goog.ui.DefaultDatePickerRenderer = function(baseCssClass, opt_domHelper) {
 ***REMOVED*****REMOVED***
  ***REMOVED*** Name of base CSS class of datepicker
  ***REMOVED*** @type {string}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.baseCssClass_ = baseCssClass;

 ***REMOVED*****REMOVED***
  ***REMOVED*** @type {!goog.dom.DomHelper}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.dom_ = opt_domHelper || goog.dom.getDomHelper();
***REMOVED***


***REMOVED***
***REMOVED*** Returns the dom helper that is being used on this component.
***REMOVED*** @return {!goog.dom.DomHelper} The dom helper used on this component.
***REMOVED***
goog.ui.DefaultDatePickerRenderer.prototype.getDomHelper = function() {
  return this.dom_;
***REMOVED***


***REMOVED***
***REMOVED*** Returns base CSS class. This getter is used to get base CSS class part.
***REMOVED*** All CSS class names in component are created as:
***REMOVED***   goog.getCssName(this.getBaseCssClass(), 'CLASS_NAME')
***REMOVED*** @return {string} Base CSS class.
***REMOVED***
goog.ui.DefaultDatePickerRenderer.prototype.getBaseCssClass = function() {
  return this.baseCssClass_;
***REMOVED***


***REMOVED***
***REMOVED*** Render the navigation row (navigating months and maybe years).
***REMOVED***
***REMOVED*** @param {!Element} row The parent element to render the component into.
***REMOVED*** @param {boolean} simpleNavigation Whether the picker should render a simple
***REMOVED***     navigation menu that only contains controls for navigating to the next
***REMOVED***     and previous month. The default navigation menu contains controls for
***REMOVED***     navigating to the next/previous month, next/previous year, and menus for
***REMOVED***     jumping to specific months and years.
***REMOVED*** @param {boolean} showWeekNum Whether week numbers should be shown.
***REMOVED*** @param {string} fullDateFormat The full date format.
***REMOVED***     {@see goog.i18n.DateTimeSymbols}.
***REMOVED*** @override
***REMOVED***
goog.ui.DefaultDatePickerRenderer.prototype.renderNavigationRow =
    function(row, simpleNavigation, showWeekNum, fullDateFormat) {
  // Populate the navigation row according to the configured navigation mode.
  var cell, monthCell, yearCell;

  if (simpleNavigation) {
    cell = this.getDomHelper().createElement(goog.dom.TagName.TD);
    cell.colSpan = showWeekNum ? 1 : 2;
    this.createButton_(cell, '\u00AB',
        goog.getCssName(this.getBaseCssClass(), 'previousMonth'));  // <<
    row.appendChild(cell);

    cell = this.getDomHelper().createElement(goog.dom.TagName.TD);
    cell.colSpan = showWeekNum ? 6 : 5;
    cell.className = goog.getCssName(this.getBaseCssClass(), 'monthyear');
    row.appendChild(cell);

    cell = this.getDomHelper().createElement(goog.dom.TagName.TD);
    this.createButton_(cell, '\u00BB',
        goog.getCssName(this.getBaseCssClass(), 'nextMonth'));  // >>
    row.appendChild(cell);

  } else {
    monthCell = this.getDomHelper().createElement(goog.dom.TagName.TD);
    monthCell.colSpan = 5;
    this.createButton_(monthCell, '\u00AB',
        goog.getCssName(this.getBaseCssClass(), 'previousMonth'));  // <<
    this.createButton_(monthCell, '',
        goog.getCssName(this.getBaseCssClass(), 'month'));
    this.createButton_(monthCell, '\u00BB',
        goog.getCssName(this.getBaseCssClass(), 'nextMonth'));  // >>

    yearCell = this.getDomHelper().createElement(goog.dom.TagName.TD);
    yearCell.colSpan = 3;
    this.createButton_(yearCell, '\u00AB',
        goog.getCssName(this.getBaseCssClass(), 'previousYear'));  // <<
    this.createButton_(yearCell, '',
        goog.getCssName(this.getBaseCssClass(), 'year'));
    this.createButton_(yearCell, '\u00BB',
        goog.getCssName(this.getBaseCssClass(), 'nextYear'));  // <<

    // If the date format has year ('y') appearing first before month ('m'),
    // show the year on the left hand side of the datepicker popup.  Otherwise,
    // show the month on the left side.  This check assumes the data to be
    // valid, and that all date formats contain month and year.
    if (fullDateFormat.indexOf('y') < fullDateFormat.indexOf('m')) {
      row.appendChild(yearCell);
      row.appendChild(monthCell);
    } else {
      row.appendChild(monthCell);
      row.appendChild(yearCell);
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** Render the footer row (with select buttons).
***REMOVED***
***REMOVED*** @param {!Element} row The parent element to render the component into.
***REMOVED*** @param {boolean} showWeekNum Whether week numbers should be shown.
***REMOVED*** @override
***REMOVED***
goog.ui.DefaultDatePickerRenderer.prototype.renderFooterRow =
    function(row, showWeekNum) {
  // Populate the footer row with buttons for Today and None.
  var cell = this.getDomHelper().createElement(goog.dom.TagName.TD);
  cell.colSpan = showWeekNum ? 2 : 3;
  cell.className = goog.getCssName(this.getBaseCssClass(), 'today-cont');

 ***REMOVED*****REMOVED*** @desc Label for button that selects the current date.***REMOVED***
  var MSG_DATEPICKER_TODAY_BUTTON_LABEL = goog.getMsg('Today');
  this.createButton_(cell, MSG_DATEPICKER_TODAY_BUTTON_LABEL,
      goog.getCssName(this.getBaseCssClass(), 'today-btn'));
  row.appendChild(cell);

  cell = this.getDomHelper().createElement(goog.dom.TagName.TD);
  cell.colSpan = showWeekNum ? 4 : 3;
  row.appendChild(cell);

  cell = this.getDomHelper().createElement(goog.dom.TagName.TD);
  cell.colSpan = 2;
  cell.className = goog.getCssName(this.getBaseCssClass(), 'none-cont');

 ***REMOVED*****REMOVED*** @desc Label for button that clears the selection.***REMOVED***
  var MSG_DATEPICKER_NONE = goog.getMsg('None');
  this.createButton_(cell, MSG_DATEPICKER_NONE,
      goog.getCssName(this.getBaseCssClass(), 'none-btn'));
  row.appendChild(cell);
***REMOVED***


***REMOVED***
***REMOVED*** Support function for button creation.
***REMOVED***
***REMOVED*** @param {Element} parentNode Container the button should be added to.
***REMOVED*** @param {string} label Button label.
***REMOVED*** @param {string=} opt_className Class name for button, which will be used
***REMOVED***    in addition to "goog-date-picker-btn".
***REMOVED*** @private
***REMOVED*** @return {!Element} The created button element.
***REMOVED***
goog.ui.DefaultDatePickerRenderer.prototype.createButton_ =
    function(parentNode, label, opt_className) {
  var classes = [goog.getCssName(this.getBaseCssClass(), 'btn')];
  if (opt_className) {
    classes.push(opt_className);
  }
  var el = this.getDomHelper().createElement(goog.dom.TagName.BUTTON);
  el.className = classes.join(' ');
  el.appendChild(this.getDomHelper().createTextNode(label));
  parentNode.appendChild(el);
  return el;
***REMOVED***
