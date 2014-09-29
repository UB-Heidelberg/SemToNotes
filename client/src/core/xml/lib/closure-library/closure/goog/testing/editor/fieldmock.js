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
***REMOVED*** @fileoverview Mock of goog.editor.field.
***REMOVED***
***REMOVED*** @author robbyw@google.com (Robby Walker)
***REMOVED***

goog.provide('goog.testing.editor.FieldMock');

goog.require('goog.dom');
goog.require('goog.dom.Range');
goog.require('goog.editor.Field');
goog.require('goog.testing.LooseMock');
goog.require('goog.testing.mockmatchers');



***REMOVED***
***REMOVED*** Mock of goog.editor.Field.
***REMOVED*** @param {Window=} opt_window Window the field would edit.  Defaults to
***REMOVED***     {@code window}.
***REMOVED*** @param {Window=} opt_appWindow "AppWindow" of the field, which can be
***REMOVED***     different from {@code opt_window} when mocking a field that uses an
***REMOVED***     iframe. Defaults to {@code opt_window}.
***REMOVED*** @param {goog.dom.AbstractRange=} opt_range An object (mock or real) to be
***REMOVED***     returned by getRange(). If ommitted, a new goog.dom.Range is created
***REMOVED***     from the window every time getRange() is called.
***REMOVED***
***REMOVED*** @extends {goog.testing.LooseMock}
***REMOVED*** @suppress {missingProperties} Mocks do not fit in the type system well.
***REMOVED***
goog.testing.editor.FieldMock =
    function(opt_window, opt_appWindow, opt_range) {
  goog.testing.LooseMock.call(this, goog.editor.Field);
  opt_window = opt_window || window;
  opt_appWindow = opt_appWindow || opt_window;

  this.getAppWindow();
  this.$anyTimes();
  this.$returns(opt_appWindow);

  this.getRange();
  this.$anyTimes();
  this.$does(function() {
    return opt_range || goog.dom.Range.createFromWindow(opt_window);
  });

  this.getEditableDomHelper();
  this.$anyTimes();
  this.$returns(goog.dom.getDomHelper(opt_window.document));

  this.usesIframe();
  this.$anyTimes();

  this.getBaseZindex();
  this.$anyTimes();
  this.$returns(0);

  this.restoreSavedRange(goog.testing.mockmatchers.ignoreArgument);
  this.$anyTimes();
  this.$does(function(range) {
    if (range) {
      range.restore();
    }
    this.focus();
  });

  // These methods cannot be set on the prototype, because the prototype
  // gets stepped on by the mock framework.
  var inModalMode = false;

 ***REMOVED*****REMOVED***
  ***REMOVED*** @return {boolean} Whether we're in modal interaction mode.
 ***REMOVED*****REMOVED***
  this.inModalMode = function() {
    return inModalMode;
 ***REMOVED*****REMOVED***

 ***REMOVED*****REMOVED***
  ***REMOVED*** @param {boolean} mode Sets whether we're in modal interaction mode.
 ***REMOVED*****REMOVED***
  this.setModalMode = function(mode) {
    inModalMode = mode;
 ***REMOVED*****REMOVED***
***REMOVED***
goog.inherits(goog.testing.editor.FieldMock, goog.testing.LooseMock);
