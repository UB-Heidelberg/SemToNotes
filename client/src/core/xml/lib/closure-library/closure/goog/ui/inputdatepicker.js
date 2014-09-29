// Copyright 2007 The Closure Library Authors. All Rights Reserved.
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
***REMOVED*** @fileoverview Input Date Picker implementation.  Pairs a
***REMOVED*** goog.ui.PopupDatePicker with an input element and handles the input from
***REMOVED*** either.
***REMOVED***
***REMOVED*** @see ../demos/inputdatepicker.html
***REMOVED***

goog.provide('goog.ui.InputDatePicker');

goog.require('goog.date.DateTime');
goog.require('goog.dom');
goog.require('goog.string');
goog.require('goog.ui.Component');
goog.require('goog.ui.DatePicker');
goog.require('goog.ui.PopupBase');
goog.require('goog.ui.PopupDatePicker');



***REMOVED***
***REMOVED*** Input date picker widget.
***REMOVED***
***REMOVED*** @param {goog.i18n.DateTimeFormat} dateTimeFormatter A formatter instance
***REMOVED***     used to format the date picker's date for display in the input element.
***REMOVED*** @param {goog.i18n.DateTimeParse} dateTimeParser A parser instance used to
***REMOVED***     parse the input element's string as a date to set the picker.
***REMOVED*** @param {goog.ui.DatePicker=} opt_datePicker Optional DatePicker.  This
***REMOVED***     enables the use of a custom date-picker instance.
***REMOVED*** @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper.
***REMOVED*** @extends {goog.ui.Component}
***REMOVED***
***REMOVED***
goog.ui.InputDatePicker = function(
    dateTimeFormatter, dateTimeParser, opt_datePicker, opt_domHelper) {
  goog.ui.Component.call(this, opt_domHelper);

  this.dateTimeFormatter_ = dateTimeFormatter;
  this.dateTimeParser_ = dateTimeParser;

  this.popupDatePicker_ = new goog.ui.PopupDatePicker(
      opt_datePicker, opt_domHelper);
  this.addChild(this.popupDatePicker_);
  this.popupDatePicker_.setAllowAutoFocus(false);
***REMOVED***
goog.inherits(goog.ui.InputDatePicker, goog.ui.Component);


***REMOVED***
***REMOVED*** Used to format the date picker's date for display in the input element.
***REMOVED*** @type {goog.i18n.DateTimeFormat}
***REMOVED*** @private
***REMOVED***
goog.ui.InputDatePicker.prototype.dateTimeFormatter_ = null;


***REMOVED***
***REMOVED*** Used to parse the input element's string as a date to set the picker.
***REMOVED*** @type {goog.i18n.DateTimeParse}
***REMOVED*** @private
***REMOVED***
goog.ui.InputDatePicker.prototype.dateTimeParser_ = null;


***REMOVED***
***REMOVED*** The instance of goog.ui.PopupDatePicker used to pop up and select the date.
***REMOVED*** @type {goog.ui.PopupDatePicker}
***REMOVED*** @private
***REMOVED***
goog.ui.InputDatePicker.prototype.popupDatePicker_ = null;


***REMOVED***
***REMOVED*** The element that the PopupDatePicker should be parented to. Defaults to the
***REMOVED*** body element of the page.
***REMOVED*** @type {Element}
***REMOVED*** @private
***REMOVED***
goog.ui.InputDatePicker.prototype.popupParentElement_ = null;


***REMOVED***
***REMOVED*** Returns the PopupDatePicker's internal DatePicker instance.  This can be
***REMOVED*** used to customize the date picker's styling.
***REMOVED***
***REMOVED*** @return {goog.ui.DatePicker} The internal DatePicker instance.
***REMOVED***
goog.ui.InputDatePicker.prototype.getDatePicker = function() {
  return this.popupDatePicker_.getDatePicker();
***REMOVED***


***REMOVED***
***REMOVED*** Returns the selected date, if any.  Compares the dates from the date picker
***REMOVED*** and the input field, causing them to be synced if different.
***REMOVED*** @return {goog.date.Date?} The selected date, if any.
***REMOVED***
goog.ui.InputDatePicker.prototype.getDate = function() {

  // The user expectation is that the date be whatever the input shows.
  // This method biases towards the input value to conform to that expectation.

  var inputDate = this.getInputValueAsDate_();
  var pickerDate = this.popupDatePicker_.getDate();

  if (inputDate && pickerDate) {
    if (!inputDate.equals(pickerDate)) {
      this.popupDatePicker_.setDate(inputDate);
    }
  } else {
    this.popupDatePicker_.setDate(null);
  }

  return inputDate;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the selected date.  See goog.ui.PopupDatePicker.setDate().
***REMOVED*** @param {goog.date.Date?} date The date to set.
***REMOVED***
goog.ui.InputDatePicker.prototype.setDate = function(date) {
  this.popupDatePicker_.setDate(date);
***REMOVED***


***REMOVED***
***REMOVED*** Sets the value of the input element.  This can be overridden to support
***REMOVED*** alternative types of input setting.
***REMOVED***
***REMOVED*** @param {string} value The value to set.
***REMOVED***
goog.ui.InputDatePicker.prototype.setInputValue = function(value) {
  var el = this.getElement();
  if (el.labelInput_) {
    var labelInput =***REMOVED*****REMOVED*** @type {goog.ui.LabelInput}***REMOVED*** (el.labelInput_);
    labelInput.setValue(value);
  } else {
    el.value = value;
  }
***REMOVED***


***REMOVED***
***REMOVED*** Returns the value of the input element.  This can be overridden to support
***REMOVED*** alternative types of input getting.
***REMOVED***
***REMOVED*** @return {string} The input value.
***REMOVED***
goog.ui.InputDatePicker.prototype.getInputValue = function() {
  var el = this.getElement();
  if (el.labelInput_) {
    var labelInput =***REMOVED*****REMOVED*** @type {goog.ui.LabelInput}***REMOVED*** (el.labelInput_);
    return labelInput.getValue();
  } else {
    return el.value;
  }
***REMOVED***


***REMOVED***
***REMOVED*** Gets the input element value and attempts to parse it as a date.
***REMOVED***
***REMOVED*** @return {goog.date.Date?} The date object is returned if the parse
***REMOVED***      is successful, null is returned on failure.
***REMOVED*** @private
***REMOVED***
goog.ui.InputDatePicker.prototype.getInputValueAsDate_ = function() {
  var value = goog.string.trim(this.getInputValue());
  if (value) {
    var date = new goog.date.DateTime();
    // DateTime needed as parse assumes it can call getHours(), getMinutes(),
    // etc, on the date if hours and minutes aren't defined.
    if (this.dateTimeParser_.strictParse(value, date) > 0) {
      return date;
    }
  }

  return null;
***REMOVED***


***REMOVED***
***REMOVED*** Creates an input element for use with the popup date picker.
***REMOVED*** @override
***REMOVED***
goog.ui.InputDatePicker.prototype.createDom = function() {
  this.setElementInternal(
      this.getDomHelper().createDom('input', {'type': 'text'}));
  this.popupDatePicker_.createDom();
***REMOVED***


***REMOVED***
***REMOVED*** Sets the element that the PopupDatePicker should be parented to. If not set,
***REMOVED*** defaults to the body element of the page.
***REMOVED*** @param {Element} el The element that the PopupDatePicker should be parented
***REMOVED***     to.
***REMOVED***
goog.ui.InputDatePicker.prototype.setPopupParentElement = function(el) {
  this.popupParentElement_ = el;
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.ui.InputDatePicker.prototype.enterDocument = function() {
  goog.ui.InputDatePicker.superClass_.enterDocument.call(this);
  var el = this.getElement();

  (this.popupParentElement_ || this.getDomHelper().getDocument().body).
      appendChild(this.popupDatePicker_.getElement());
  this.popupDatePicker_.enterDocument();
  this.popupDatePicker_.attach(el);

  // Set the date picker to have the input's initial value, if any.
  this.popupDatePicker_.setDate(this.getInputValueAsDate_());

  var handler = this.getHandler();
  handler.listen(this.popupDatePicker_, goog.ui.DatePicker.Events.CHANGE,
                 this.onDateChanged_);
  handler.listen(this.popupDatePicker_, goog.ui.PopupBase.EventType.SHOW,
                 this.onPopup_);
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.ui.InputDatePicker.prototype.exitDocument = function() {
  goog.ui.InputDatePicker.superClass_.exitDocument.call(this);
  var el = this.getElement();

  this.popupDatePicker_.detach(el);
  this.popupDatePicker_.exitDocument();
  goog.dom.removeNode(this.popupDatePicker_.getElement());
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.ui.InputDatePicker.prototype.decorateInternal = function(element) {
  goog.ui.InputDatePicker.superClass_.decorateInternal.call(this, element);

  this.popupDatePicker_.createDom();
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.ui.InputDatePicker.prototype.disposeInternal = function() {
  goog.ui.InputDatePicker.superClass_.disposeInternal.call(this);
  this.popupDatePicker_.dispose();
  this.popupDatePicker_ = null;
  this.popupParentElement_ = null;
***REMOVED***


***REMOVED***
***REMOVED*** See goog.ui.PopupDatePicker.showPopup().
***REMOVED*** @param {Element} element Reference element for displaying the popup -- popup
***REMOVED***     will appear at the bottom-left corner of this element.
***REMOVED***
goog.ui.InputDatePicker.prototype.showForElement = function(element) {
  this.popupDatePicker_.showPopup(element);
***REMOVED***


***REMOVED***
***REMOVED*** See goog.ui.PopupDatePicker.hidePopup().
***REMOVED***
goog.ui.InputDatePicker.prototype.hidePopup = function() {
  this.popupDatePicker_.hidePopup();
***REMOVED***


***REMOVED***
***REMOVED*** Event handler for popup date picker popup events.
***REMOVED***
***REMOVED*** @param {goog.events.Event} e popup event.
***REMOVED*** @private
***REMOVED***
goog.ui.InputDatePicker.prototype.onPopup_ = function(e) {
  this.setDate(this.getInputValueAsDate_());
***REMOVED***


***REMOVED***
***REMOVED*** Event handler for date change events.  Called when the date changes.
***REMOVED***
***REMOVED*** @param {goog.ui.DatePickerEvent} e Date change event.
***REMOVED*** @private
***REMOVED***
goog.ui.InputDatePicker.prototype.onDateChanged_ = function(e) {
  this.setInputValue(e.date ? this.dateTimeFormatter_.format(e.date) : '');
***REMOVED***
