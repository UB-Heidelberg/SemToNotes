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
***REMOVED*** @fileoverview A utility class for making layout assertions. This is a port
***REMOVED*** of http://go/layoutbot.java
***REMOVED*** See {@link http://go/layouttesting}.
***REMOVED***

goog.provide('goog.testing.style.layoutasserts');

goog.require('goog.style');
goog.require('goog.testing.asserts');
goog.require('goog.testing.style');


***REMOVED***
***REMOVED*** Asserts that an element has:
***REMOVED***   1 - a CSS rendering the makes the element visible.
***REMOVED***   2 - a non-zero width and height.
***REMOVED*** @param {Element|string} a The element or optionally the comment string.
***REMOVED*** @param {Element=} opt_b The element when a comment string is present.
***REMOVED***
var assertIsVisible = function(a, opt_b) {
  _validateArguments(1, arguments);
  var element = nonCommentArg(1, 1, arguments);

  _assert(commentArg(1, arguments),
      goog.testing.style.isVisible(element) &&
      goog.testing.style.hasVisibleDimensions(element),
      'Specified element should be visible.');
***REMOVED***


***REMOVED***
***REMOVED*** The counter assertion of assertIsVisible().
***REMOVED*** @param {Element|string} a The element or optionally the comment string.
***REMOVED*** @param {Element=} opt_b The element when a comment string is present.
***REMOVED***
var assertNotVisible = function(a, opt_b) {
  _validateArguments(1, arguments);
  var element = nonCommentArg(1, 1, arguments);
  if (!element) {
    return;
  }

  _assert(commentArg(1, arguments),
      !goog.testing.style.isVisible(element) ||
      !goog.testing.style.hasVisibleDimensions(element),
      'Specified element should not be visible.');
***REMOVED***


***REMOVED***
***REMOVED*** Asserts that the two specified elements intersect.
***REMOVED*** @param {Element|string} a The first element or optionally the comment string.
***REMOVED*** @param {Element} b The second element or the first element if comment string
***REMOVED***     is present.
***REMOVED*** @param {Element=} opt_c The second element if comment string is present.
***REMOVED***
var assertIntersect = function(a, b, opt_c) {
  _validateArguments(2, arguments);
  var element = nonCommentArg(1, 2, arguments);
  var otherElement = nonCommentArg(2, 2, arguments);

  _assert(commentArg(1, arguments),
      goog.testing.style.intersects(element, otherElement),
      'Elements should intersect.');
***REMOVED***


***REMOVED***
***REMOVED*** Asserts that the two specified elements do not intersect.
***REMOVED*** @param {Element|string} a The first element or optionally the comment string.
***REMOVED*** @param {Element} b The second element or the first element if comment string
***REMOVED***     is present.
***REMOVED*** @param {Element=} opt_c The second element if comment string is present.
***REMOVED***
var assertNoIntersect = function(a, b, opt_c) {
  _validateArguments(2, arguments);
  var element = nonCommentArg(1, 2, arguments);
  var otherElement = nonCommentArg(2, 2, arguments);

  _assert(commentArg(1, arguments),
      !goog.testing.style.intersects(element, otherElement),
      'Elements should not intersect.');
***REMOVED***


***REMOVED***
***REMOVED*** Asserts that the element must have the specified width.
***REMOVED*** @param {Element|string} a The first element or optionally the comment string.
***REMOVED*** @param {Element} b The second element or the first element if comment string
***REMOVED***     is present.
***REMOVED*** @param {Element=} opt_c The second element if comment string is present.
***REMOVED***
var assertWidth = function(a, b, opt_c) {
  _validateArguments(2, arguments);
  var element = nonCommentArg(1, 2, arguments);
  var width = nonCommentArg(2, 2, arguments);
  var size = goog.style.getSize(element);
  var elementWidth = size.width;

  _assert(commentArg(1, arguments),
      goog.testing.style.layoutasserts.isWithinThreshold_(
          width, elementWidth, 0 /* tolerance***REMOVED***),
      'Element should have width ' + width + ' but was ' + elementWidth + '.');
***REMOVED***


***REMOVED***
***REMOVED*** Asserts that the element must have the specified width within the specified
***REMOVED*** tolerance.
***REMOVED*** @param {Element|string} a The element or optionally the comment string.
***REMOVED*** @param {number|Element} b The height or the element if comment string is
***REMOVED***     present.
***REMOVED*** @param {number} c The tolerance or the height if comment string is
***REMOVED***     present.
***REMOVED*** @param {number=} opt_d The tolerance if comment string is present.
***REMOVED***
var assertWidthWithinTolerance = function(a, b, c, opt_d) {
  _validateArguments(3, arguments);
  var element = nonCommentArg(1, 3, arguments);
  var width = nonCommentArg(2, 3, arguments);
  var tolerance = nonCommentArg(3, 3, arguments);
  var size = goog.style.getSize(element);
  var elementWidth = size.width;

  _assert(commentArg(1, arguments),
      goog.testing.style.layoutasserts.isWithinThreshold_(
          width, elementWidth, tolerance),
      'Element width(' + elementWidth + ') should be within given width(' +
      width + ') with tolerance value of ' + tolerance + '.');
***REMOVED***


***REMOVED***
***REMOVED*** Asserts that the element must have the specified height.
***REMOVED*** @param {Element|string} a The first element or optionally the comment string.
***REMOVED*** @param {Element} b The second element or the first element if comment string
***REMOVED***     is present.
***REMOVED*** @param {Element=} opt_c The second element if comment string is present.
***REMOVED***
var assertHeight = function(a, b, opt_c) {
  _validateArguments(2, arguments);
  var element = nonCommentArg(1, 2, arguments);
  var height = nonCommentArg(2, 2, arguments);
  var size = goog.style.getSize(element);
  var elementHeight = size.height;

  _assert(commentArg(1, arguments),
      goog.testing.style.layoutasserts.isWithinThreshold_(
          height, elementHeight, 0 /* tolerance***REMOVED***),
      'Element should have height ' + height + '.');
***REMOVED***


***REMOVED***
***REMOVED*** Asserts that the element must have the specified height within the specified
***REMOVED*** tolerance.
***REMOVED*** @param {Element|string} a The element or optionally the comment string.
***REMOVED*** @param {number|Element} b The height or the element if comment string is
***REMOVED***     present.
***REMOVED*** @param {number} c The tolerance or the height if comment string is
***REMOVED***     present.
***REMOVED*** @param {number=} opt_d The tolerance if comment string is present.
***REMOVED***
var assertHeightWithinTolerance = function(a, b, c, opt_d) {
  _validateArguments(3, arguments);
  var element = nonCommentArg(1, 3, arguments);
  var height = nonCommentArg(2, 3, arguments);
  var tolerance = nonCommentArg(3, 3, arguments);
  var size = goog.style.getSize(element);
  var elementHeight = size.height;

  _assert(commentArg(1, arguments),
      goog.testing.style.layoutasserts.isWithinThreshold_(
          height, elementHeight, tolerance),
      'Element width(' + elementHeight + ') should be within given width(' +
      height + ') with tolerance value of ' + tolerance + '.');
***REMOVED***


***REMOVED***
***REMOVED*** Asserts that the first element is to the left of the second element.
***REMOVED*** @param {Element|string} a The first element or optionally the comment string.
***REMOVED*** @param {Element} b The second element or the first element if comment string
***REMOVED***     is present.
***REMOVED*** @param {Element=} opt_c The second element if comment string is present.
***REMOVED***
var assertIsLeftOf = function(a, b, opt_c) {
  _validateArguments(2, arguments);
  var element = nonCommentArg(1, 2, arguments);
  var otherElement = nonCommentArg(2, 2, arguments);
  var elementRect = goog.style.getBounds(element);
  var otherElementRect = goog.style.getBounds(otherElement);

  _assert(commentArg(1, arguments),
      elementRect.left < otherElementRect.left,
      'Elements should be left to right.');
***REMOVED***


***REMOVED***
***REMOVED*** Asserts that the first element is strictly left of the second element.
***REMOVED*** @param {Element|string} a The first element or optionally the comment string.
***REMOVED*** @param {Element} b The second element or the first element if comment string
***REMOVED***     is present.
***REMOVED*** @param {Element=} opt_c The second element if comment string is present.
***REMOVED***
var assertIsStrictlyLeftOf = function(a, b, opt_c) {
  _validateArguments(2, arguments);
  var element = nonCommentArg(1, 2, arguments);
  var otherElement = nonCommentArg(2, 2, arguments);
  var elementRect = goog.style.getBounds(element);
  var otherElementRect = goog.style.getBounds(otherElement);

  _assert(commentArg(1, arguments),
      elementRect.left + elementRect.width < otherElementRect.left,
      'Elements should be strictly left to right.');
***REMOVED***


***REMOVED***
***REMOVED*** Asserts that the first element is higher than the second element.
***REMOVED*** @param {Element|string} a The first element or optionally the comment string.
***REMOVED*** @param {Element} b The second element or the first element if comment string
***REMOVED***     is present.
***REMOVED*** @param {Element=} opt_c The second element if comment string is present.
***REMOVED***
var assertIsAbove = function(a, b, opt_c) {
  _validateArguments(2, arguments);
  var element = nonCommentArg(1, 2, arguments);
  var otherElement = nonCommentArg(2, 2, arguments);
  var elementRect = goog.style.getBounds(element);
  var otherElementRect = goog.style.getBounds(otherElement);

  _assert(commentArg(1, arguments),
      elementRect.top < otherElementRect.top,
      'Elements should be top to bottom.');
***REMOVED***


***REMOVED***
***REMOVED*** Asserts that the first element is strictly higher than the second element.
***REMOVED*** @param {Element|string} a The first element or optionally the comment string.
***REMOVED*** @param {Element} b The second element or the first element if comment string
***REMOVED***     is present.
***REMOVED*** @param {Element=} opt_c The second element if comment string is present.
***REMOVED***
var assertIsStrictlyAbove = function(a, b, opt_c) {
  _validateArguments(2, arguments);
  var element = nonCommentArg(1, 2, arguments);
  var otherElement = nonCommentArg(2, 2, arguments);
  var elementRect = goog.style.getBounds(element);
  var otherElementRect = goog.style.getBounds(otherElement);

  _assert(commentArg(1, arguments),
      elementRect.top + elementRect.height < otherElementRect.top,
      'Elements should be strictly top to bottom.');
***REMOVED***


***REMOVED***
***REMOVED*** Asserts that the first element's bounds contain the bounds of the second
***REMOVED*** element.
***REMOVED*** @param {Element|string} a The first element or optionally the comment string.
***REMOVED*** @param {Element} b The second element or the first element if comment string
***REMOVED***     is present.
***REMOVED*** @param {Element=} opt_c The second element if comment string is present.
***REMOVED***
var assertContained = function(a, b, opt_c) {
  _validateArguments(2, arguments);
  var element = nonCommentArg(1, 2, arguments);
  var otherElement = nonCommentArg(2, 2, arguments);
  var elementRect = goog.style.getBounds(element);
  var otherElementRect = goog.style.getBounds(otherElement);

  _assert(commentArg(1, arguments),
      elementRect.contains(otherElementRect),
      'Element should be contained within the other element.');
***REMOVED***


***REMOVED***
***REMOVED*** Returns true if the difference between val1 and val2 is less than or equal to
***REMOVED*** the threashold.
***REMOVED*** @param {number} val1 The first value.
***REMOVED*** @param {number} val2 The second value.
***REMOVED*** @param {number} threshold The threshold value.
***REMOVED*** @return {boolean} Whether or not the the values are within the threshold.
***REMOVED*** @private
***REMOVED***
goog.testing.style.layoutasserts.isWithinThreshold_ = function(
    val1, val2, threshold) {
  return Math.abs(val1 - val2) <= threshold;
***REMOVED***


