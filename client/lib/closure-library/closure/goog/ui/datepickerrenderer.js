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
***REMOVED*** @fileoverview The renderer interface for {@link goog.ui.DatePicker}.
***REMOVED***
***REMOVED*** @see ../demos/datepicker.html
***REMOVED***

goog.provide('goog.ui.DatePickerRenderer');



***REMOVED***
***REMOVED*** The renderer for {@link goog.ui.DatePicker}. Renders the date picker's
***REMOVED*** navigation header and footer.
***REMOVED*** @interface
***REMOVED***
goog.ui.DatePickerRenderer = function() {***REMOVED***


***REMOVED***
***REMOVED*** Render the navigation row.
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
***REMOVED***
goog.ui.DatePickerRenderer.prototype.renderNavigationRow = goog.abstractMethod;


***REMOVED***
***REMOVED*** Render the footer row.
***REMOVED***
***REMOVED*** @param {!Element} row The parent element to render the component into.
***REMOVED*** @param {boolean} showWeekNum Whether week numbers should be shown.
***REMOVED***
goog.ui.DatePickerRenderer.prototype.renderFooterRow = goog.abstractMethod;
