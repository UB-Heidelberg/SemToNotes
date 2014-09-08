// Copyright 2010 The Closure Library Authors. All Rights Reserved.
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
***REMOVED*** @fileoverview Displays and edits the value of a cookie.
***REMOVED*** Intended only for debugging.
***REMOVED***
goog.provide('goog.ui.CookieEditor');

goog.require('goog.asserts');
goog.require('goog.dom');
goog.require('goog.dom.TagName');
***REMOVED***
goog.require('goog.net.cookies');
goog.require('goog.string');
goog.require('goog.style');
goog.require('goog.ui.Component');



***REMOVED***
***REMOVED*** Displays and edits the value of a cookie.
***REMOVED*** @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper.
***REMOVED***
***REMOVED*** @extends {goog.ui.Component}
***REMOVED*** @final
***REMOVED***
goog.ui.CookieEditor = function(opt_domHelper) {
  goog.ui.CookieEditor.base(this, 'constructor', opt_domHelper);
***REMOVED***
goog.inherits(goog.ui.CookieEditor, goog.ui.Component);


***REMOVED***
***REMOVED*** Cookie key.
***REMOVED*** @type {?string}
***REMOVED*** @private
***REMOVED***
goog.ui.CookieEditor.prototype.cookieKey_;


***REMOVED***
***REMOVED*** Text area.
***REMOVED*** @type {HTMLTextAreaElement}
***REMOVED*** @private
***REMOVED***
goog.ui.CookieEditor.prototype.textAreaElem_;


***REMOVED***
***REMOVED*** Clear button.
***REMOVED*** @type {HTMLButtonElement}
***REMOVED*** @private
***REMOVED***
goog.ui.CookieEditor.prototype.clearButtonElem_;


***REMOVED***
***REMOVED*** Invalid value warning text.
***REMOVED*** @type {HTMLSpanElement}
***REMOVED*** @private
***REMOVED***
goog.ui.CookieEditor.prototype.valueWarningElem_;


***REMOVED***
***REMOVED*** Update button.
***REMOVED*** @type {HTMLButtonElement}
***REMOVED*** @private
***REMOVED***
goog.ui.CookieEditor.prototype.updateButtonElem_;


// TODO(user): add combobox for user to select different cookies
***REMOVED***
***REMOVED*** Sets the cookie which this component will edit.
***REMOVED*** @param {string} cookieKey Cookie key.
***REMOVED***
goog.ui.CookieEditor.prototype.selectCookie = function(cookieKey) {
  goog.asserts.assert(goog.net.cookies.isValidName(cookieKey));
  this.cookieKey_ = cookieKey;
  if (this.textAreaElem_) {
    this.textAreaElem_.value = goog.net.cookies.get(cookieKey) || '';
  }
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.ui.CookieEditor.prototype.canDecorate = function() {
  return false;
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.ui.CookieEditor.prototype.createDom = function() {
  // Debug-only, so we don't need i18n.
  this.clearButtonElem_ =***REMOVED*****REMOVED*** @type {HTMLButtonElement}***REMOVED*** (goog.dom.createDom(
      goog.dom.TagName.BUTTON, /* attributes***REMOVED*** null, 'Clear'));
  this.updateButtonElem_ =***REMOVED*****REMOVED*** @type {HTMLButtonElement}***REMOVED*** (goog.dom.createDom(
      goog.dom.TagName.BUTTON, /* attributes***REMOVED*** null, 'Update'));
  var value = this.cookieKey_ && goog.net.cookies.get(this.cookieKey_);
  this.textAreaElem_ =***REMOVED*****REMOVED*** @type {HTMLTextAreaElement}***REMOVED*** (goog.dom.createDom(
      goog.dom.TagName.TEXTAREA, /* attibutes***REMOVED*** null, value || ''));
  this.valueWarningElem_ =***REMOVED*****REMOVED*** @type {HTMLSpanElement}***REMOVED*** (goog.dom.createDom(
      goog.dom.TagName.SPAN, /* attibutes***REMOVED*** {
        'style': 'display:none;color:red'
      }, 'Invalid cookie value.'));
  this.setElementInternal(goog.dom.createDom(goog.dom.TagName.DIV,
      /* attibutes***REMOVED*** null,
      this.valueWarningElem_,
      goog.dom.createDom(goog.dom.TagName.BR),
      this.textAreaElem_,
      goog.dom.createDom(goog.dom.TagName.BR),
      this.clearButtonElem_,
      this.updateButtonElem_));
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.ui.CookieEditor.prototype.enterDocument = function() {
  goog.ui.CookieEditor.base(this, 'enterDocument');
  this.getHandler().listen(this.clearButtonElem_,
      goog.events.EventType.CLICK,
      this.handleClear_);
  this.getHandler().listen(this.updateButtonElem_,
      goog.events.EventType.CLICK,
      this.handleUpdate_);
***REMOVED***


***REMOVED***
***REMOVED*** Handles user clicking clear button.
***REMOVED*** @param {!goog.events.Event} e The click event.
***REMOVED*** @private
***REMOVED***
goog.ui.CookieEditor.prototype.handleClear_ = function(e) {
  if (this.cookieKey_) {
    goog.net.cookies.remove(this.cookieKey_);
  }
  this.textAreaElem_.value = '';
***REMOVED***


***REMOVED***
***REMOVED*** Handles user clicking update button.
***REMOVED*** @param {!goog.events.Event} e The click event.
***REMOVED*** @private
***REMOVED***
goog.ui.CookieEditor.prototype.handleUpdate_ = function(e) {
  if (this.cookieKey_) {
    var value = this.textAreaElem_.value;
    if (value) {
      // Strip line breaks.
      value = goog.string.stripNewlines(value);
    }
    if (goog.net.cookies.isValidValue(value)) {
      goog.net.cookies.set(this.cookieKey_, value);
      goog.style.setElementShown(this.valueWarningElem_, false);
    } else {
      goog.style.setElementShown(this.valueWarningElem_, true);
    }
  }
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.ui.CookieEditor.prototype.disposeInternal = function() {
  this.clearButtonElem_ = null;
  this.cookieKey_ = null;
  this.textAreaElem_ = null;
  this.updateButtonElem_ = null;
  this.valueWarningElem_ = null;
***REMOVED***
