// Copyright 2011 The Closure Library Authors. All Rights Reserved.
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
***REMOVED*** @fileoverview Utilities for inspecting page layout. This is a port of
***REMOVED***     http://go/layoutbot.java
***REMOVED***     See {@link http://go/layouttesting}.
***REMOVED***

goog.provide('goog.testing.style');

goog.require('goog.dom');
goog.require('goog.math.Rect');
goog.require('goog.style');


***REMOVED***
***REMOVED*** Determines whether the bounding rectangles of the given elements intersect.
***REMOVED*** @param {Element} element The first element.
***REMOVED*** @param {Element} otherElement The second element.
***REMOVED*** @return {boolean} Whether the bounding rectangles of the given elements
***REMOVED***     intersect.
***REMOVED***
goog.testing.style.intersects = function(element, otherElement) {
  var elementRect = goog.style.getBounds(element);
  var otherElementRect = goog.style.getBounds(otherElement);
  return goog.math.Rect.intersects(elementRect, otherElementRect);
***REMOVED***


***REMOVED***
***REMOVED*** Determines whether the element has visible dimensions, i.e. x > 0 && y > 0.
***REMOVED*** @param {Element} element The element to check.
***REMOVED*** @return {boolean} Whether the element has visible dimensions.
***REMOVED***
goog.testing.style.hasVisibleDimensions = function(element) {
  var elSize = goog.style.getSize(element);
  var shortest = elSize.getShortest();
  if (shortest <= 0) {
    return false;
  }

  return true;
***REMOVED***


***REMOVED***
***REMOVED*** Determines whether the CSS style of the element renders it visible.
***REMOVED*** @param {!Element} element The element to check.
***REMOVED*** @return {boolean} Whether the CSS style of the element renders it visible.
***REMOVED***
goog.testing.style.isVisible = function(element) {
  var visibilityStyle =
      goog.testing.style.getAvailableStyle_(element, 'visibility');
  var displayStyle =
      goog.testing.style.getAvailableStyle_(element, 'display');

  return (visibilityStyle != 'hidden' && displayStyle != 'none');
***REMOVED***

***REMOVED***
***REMOVED*** Test whether the given element is on screen.
***REMOVED*** @param {!Element} el The element to test.
***REMOVED*** @return {boolean} Whether the element is on the screen.
***REMOVED***
goog.testing.style.isOnScreen = function(el) {
  var doc = goog.dom.getDomHelper(el).getDocument();
  var viewport = goog.style.getVisibleRectForElement(doc.body);
  var viewportRect = goog.math.Rect.createFromBox(viewport);
  return goog.dom.contains(doc, el) &&
      goog.style.getBounds(el).intersects(viewportRect);
***REMOVED***


***REMOVED***
***REMOVED*** This is essentially goog.style.getStyle_. goog.style.getStyle_ is private
***REMOVED*** and is not a recommended way for general purpose style extractor. For the
***REMOVED*** purposes of layout testing, we only use this function for retrieving
***REMOVED*** 'visiblity' and 'display' style.
***REMOVED*** @param {!Element} element The element to retrieve the style from.
***REMOVED*** @param {string} style Style property name.
***REMOVED*** @return {string} Style value.
***REMOVED*** @private
***REMOVED***
goog.testing.style.getAvailableStyle_ = function(element, style) {
  return goog.style.getComputedStyle(element, style) ||
      goog.style.getCascadedStyle(element, style) ||
      goog.style.getStyle(element, style);
***REMOVED***
