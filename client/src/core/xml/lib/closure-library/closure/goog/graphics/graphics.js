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
***REMOVED*** @fileoverview Graphics utility functions and factory methods.
***REMOVED*** @author arv@google.com (Erik Arvidsson)
***REMOVED*** @see ../demos/graphics/advancedcoordinates.html
***REMOVED*** @see ../demos/graphics/advancedcoordinates2.html
***REMOVED*** @see ../demos/graphics/basicelements.html
***REMOVED*** @see ../demos/graphics/events.html
***REMOVED*** @see ../demos/graphics/modifyelements.html
***REMOVED*** @see ../demos/graphics/tiger.html
***REMOVED***


goog.provide('goog.graphics');

goog.require('goog.graphics.CanvasGraphics');
goog.require('goog.graphics.SvgGraphics');
goog.require('goog.graphics.VmlGraphics');
goog.require('goog.userAgent');


***REMOVED***
***REMOVED*** Returns an instance of goog.graphics.AbstractGraphics that knows how to draw
***REMOVED*** for the current platform (A factory for the proper Graphics implementation)
***REMOVED*** @param {string|number} width The width in pixels.  Strings
***REMOVED***     expressing percentages of parent with (e.g. '80%') are also accepted.
***REMOVED*** @param {string|number} height The height in pixels.  Strings
***REMOVED***     expressing percentages of parent with (e.g. '80%') are also accepted.
***REMOVED*** @param {?number=} opt_coordWidth The optional coordinate width - if
***REMOVED***     omitted or null, defaults to same as width.
***REMOVED*** @param {?number=} opt_coordHeight The optional coordinate height - if
***REMOVED***     omitted or null, defaults to same as height.
***REMOVED*** @param {goog.dom.DomHelper=} opt_domHelper The DOM helper object for the
***REMOVED***     document we want to render in.
***REMOVED*** @return {goog.graphics.AbstractGraphics} The created instance.
***REMOVED***
goog.graphics.createGraphics = function(width, height, opt_coordWidth,
    opt_coordHeight, opt_domHelper) {
  var graphics;
  if (goog.userAgent.IE && !goog.userAgent.isVersion('9')) {
    graphics = new goog.graphics.VmlGraphics(width, height,
        opt_coordWidth, opt_coordHeight, opt_domHelper);
  } else if (goog.userAgent.WEBKIT && (!goog.userAgent.isVersion('420') ||
      goog.userAgent.MOBILE)) {
    graphics = new goog.graphics.CanvasGraphics(width, height,
        opt_coordWidth, opt_coordHeight, opt_domHelper);
  } else {
    graphics = new goog.graphics.SvgGraphics(width, height,
        opt_coordWidth, opt_coordHeight, opt_domHelper);
  }

  // Create the dom now, because all drawing methods require that the
  // main dom element (the canvas) has been already created.
  graphics.createDom();

  return graphics;
***REMOVED***


***REMOVED***
***REMOVED*** Returns an instance of goog.graphics.AbstractGraphics that knows how to draw
***REMOVED*** for the current platform (A factory for the proper Graphics implementation)
***REMOVED*** @param {string|number} width The width in pixels.  Strings
***REMOVED***     expressing percentages of parent with (e.g. '80%') are also accepted.
***REMOVED*** @param {string|number} height The height in pixels.   Strings
***REMOVED***     expressing percentages of parent with (e.g. '80%') are also accepted.
***REMOVED*** @param {?number=} opt_coordWidth The optional coordinate width, defaults to
***REMOVED***     same as width.
***REMOVED*** @param {?number=} opt_coordHeight The optional coordinate height, defaults to
***REMOVED***     same as height.
***REMOVED*** @param {goog.dom.DomHelper=} opt_domHelper The DOM helper object for the
***REMOVED***     document we want to render in.
***REMOVED*** @return {goog.graphics.AbstractGraphics} The created instance.
***REMOVED***
goog.graphics.createSimpleGraphics = function(width, height,
    opt_coordWidth, opt_coordHeight, opt_domHelper) {
  if (goog.userAgent.MAC && goog.userAgent.GECKO &&
      !goog.userAgent.isVersion('1.9a')) {
    // Canvas is 6x faster than SVG on Mac FF 2.0
    var graphics = new goog.graphics.CanvasGraphics(
        width, height, opt_coordWidth, opt_coordHeight,
        opt_domHelper);
    graphics.createDom();
    return graphics;
  }

  // Otherwise, defer to normal graphics object creation.
  return goog.graphics.createGraphics(width, height, opt_coordWidth,
      opt_coordHeight, opt_domHelper);
***REMOVED***


***REMOVED***
***REMOVED*** Static function to check if the current browser has Graphics support.
***REMOVED*** @return {boolean} True if the current browser has Graphics support.
***REMOVED***
goog.graphics.isBrowserSupported = function() {
  if (goog.userAgent.IE) {
    return goog.userAgent.isVersion('5.5');
  }
  if (goog.userAgent.GECKO) {
    return goog.userAgent.isVersion('1.8');
  }
  if (goog.userAgent.OPERA) {
    return goog.userAgent.isVersion('9.0');
  }
  if (goog.userAgent.WEBKIT) {
    return goog.userAgent.isVersion('412');
  }
  return false;
***REMOVED***
