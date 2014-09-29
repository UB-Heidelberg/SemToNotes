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
***REMOVED*** @fileoverview Graphics utility functions for advanced coordinates.
***REMOVED***
***REMOVED*** This file assists the use of advanced coordinates in goog.graphics.  Coords
***REMOVED*** can be specified as simple numbers which will correspond to units in the
***REMOVED*** graphics element's coordinate space.  Alternately, coords can be expressed
***REMOVED*** in pixels, meaning no matter what tranformations or coordinate system changes
***REMOVED*** are present, the number of pixel changes will remain constant.  Coords can
***REMOVED*** also be expressed as percentages of their parent's size.
***REMOVED***
***REMOVED*** This file also allows for elements to have margins, expressable in any of
***REMOVED*** the ways described above.
***REMOVED***
***REMOVED*** Additional pieces of advanced coordinate functionality can (soon) be found in
***REMOVED*** element.js and groupelement.js.
***REMOVED***
***REMOVED*** @author robbyw@google.com (Robby Walker)
***REMOVED***

goog.provide('goog.graphics.ext.coordinates');

goog.require('goog.string');


***REMOVED***
***REMOVED*** Cache of boolean values.  For a given string (key), is it special? (value)
***REMOVED*** @type {Object}
***REMOVED*** @private
***REMOVED***
goog.graphics.ext.coordinates.specialCoordinateCache_ = {***REMOVED***


***REMOVED***
***REMOVED*** Determines if the given coordinate is a percent based coordinate or an
***REMOVED*** expression with a percent based component.
***REMOVED*** @param {string} coord The coordinate to test.
***REMOVED*** @return {boolean} Whether the coordinate contains the string '%'.
***REMOVED*** @private
***REMOVED***
goog.graphics.ext.coordinates.isPercent_ = function(coord) {
  return goog.string.contains(coord, '%');
***REMOVED***


***REMOVED***
***REMOVED*** Determines if the given coordinate is a pixel based coordinate or an
***REMOVED*** expression with a pixel based component.
***REMOVED*** @param {string} coord The coordinate to test.
***REMOVED*** @return {boolean} Whether the coordinate contains the string 'px'.
***REMOVED*** @private
***REMOVED***
goog.graphics.ext.coordinates.isPixels_ = function(coord) {
  return goog.string.contains(coord, 'px');
***REMOVED***


***REMOVED***
***REMOVED*** Determines if the given coordinate is special - i.e. not just a number.
***REMOVED*** @param {string|number|null} coord The coordinate to test.
***REMOVED*** @return {boolean} Whether the coordinate is special.
***REMOVED***
goog.graphics.ext.coordinates.isSpecial = function(coord) {
  var cache = goog.graphics.ext.coordinates.specialCoordinateCache_;

  if (!(coord in cache)) {
    cache[coord] = goog.isString(coord) && (
        goog.graphics.ext.coordinates.isPercent_(coord) ||
        goog.graphics.ext.coordinates.isPixels_(coord));
  }

  return cache[coord];
***REMOVED***


***REMOVED***
***REMOVED*** Returns the value of the given expression in the given context.
***REMOVED***
***REMOVED*** Should be treated as package scope.
***REMOVED***
***REMOVED*** @param {string|number} coord The coordinate to convert.
***REMOVED*** @param {number} size The size of the parent element.
***REMOVED*** @param {number} scale The ratio of pixels to units.
***REMOVED*** @return {number} The number of coordinate space units that corresponds to
***REMOVED***     this coordinate.
***REMOVED***
goog.graphics.ext.coordinates.computeValue = function(coord, size, scale) {
  var number = parseFloat(String(coord));
  if (goog.isString(coord)) {
    if (goog.graphics.ext.coordinates.isPercent_(coord)) {
      return number***REMOVED*** size / 100;
    } else if (goog.graphics.ext.coordinates.isPixels_(coord)) {
      return number / scale;
    }
  }

  return number;
***REMOVED***


***REMOVED***
***REMOVED*** Converts the given coordinate to a number value in units.
***REMOVED***
***REMOVED*** Should be treated as package scope.
***REMOVED***
***REMOVED*** @param {string|number} coord The coordinate to retrieve the value for.
***REMOVED*** @param {boolean|undefined} forMaximum Whether we are computing the largest
***REMOVED***     value this coordinate would be in a parent of no size.  The container
***REMOVED***     size in this case should be set to the size of the current element.
***REMOVED*** @param {number} containerSize The unit value of the size of the container of
***REMOVED***     this element.  Should be set to the minimum width of this element if
***REMOVED***     forMaximum is true.
***REMOVED*** @param {number} scale The ratio of pixels to units.
***REMOVED*** @param {Object=} opt_cache Optional (but highly recommend) object to store
***REMOVED***     cached computations in.  The calling class should manage clearing out
***REMOVED***     the cache when the scale or containerSize changes.
***REMOVED*** @return {number} The correct number of coordinate space units.
***REMOVED***
goog.graphics.ext.coordinates.getValue = function(coord, forMaximum,
    containerSize, scale, opt_cache) {
  if (!goog.isNumber(coord)) {
    var cacheString = opt_cache && ((forMaximum ? 'X' : '') + coord);

    if (opt_cache && cacheString in opt_cache) {
      coord = opt_cache[cacheString];
    } else {
      if (goog.graphics.ext.coordinates.isSpecial(
         ***REMOVED*****REMOVED*** @type {string}***REMOVED*** (coord))) {
        coord = goog.graphics.ext.coordinates.computeValue(coord,
            containerSize, scale);
      } else {
        // Simple coordinates just need to be converted from a string to a
        // number.
        coord = parseFloat(***REMOVED*** @type {string}***REMOVED*** (coord));
      }

      // Cache the result.
      if (opt_cache) {
        opt_cache[cacheString] = coord;
      }
    }
  }

  return coord;
***REMOVED***
