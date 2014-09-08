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
***REMOVED*** @fileoverview Utilities related to alpha/transparent colors and alpha color
***REMOVED*** conversion.
***REMOVED***

goog.provide('goog.color.alpha');

goog.require('goog.color');


***REMOVED***
***REMOVED*** Parses an alpha color out of a string.
***REMOVED*** @param {string} str Color in some format.
***REMOVED*** @return {{hex: string, type: string}} 'hex' is a string containing
***REMOVED***     a hex representation of the color, and 'type' is a string
***REMOVED***     containing the type of color format passed in ('hex', 'rgb', 'named').
***REMOVED***
goog.color.alpha.parse = function(str) {
  var result = {***REMOVED***
  str = String(str);

  var maybeHex = goog.color.prependHashIfNecessaryHelper(str);
  if (goog.color.alpha.isValidAlphaHexColor_(maybeHex)) {
    result.hex = goog.color.alpha.normalizeAlphaHex_(maybeHex);
    result.type = 'hex';
    return result;
  } else {
    var rgba = goog.color.alpha.isValidRgbaColor_(str);
    if (rgba.length) {
      result.hex = goog.color.alpha.rgbaArrayToHex(rgba);
      result.type = 'rgba';
      return result;
    } else {
      var hsla = goog.color.alpha.isValidHslaColor_(str);
      if (hsla.length) {
        result.hex = goog.color.alpha.hslaArrayToHex(hsla);
        result.type = 'hsla';
        return result;
      }
    }
  }
  throw Error(str + ' is not a valid color string');
***REMOVED***


***REMOVED***
***REMOVED*** Converts a hex representation of a color to RGBA.
***REMOVED*** @param {string} hexColor Color to convert.
***REMOVED*** @return {string} string of the form 'rgba(R,G,B,A)' which can be used in
***REMOVED***    styles.
***REMOVED***
goog.color.alpha.hexToRgbaStyle = function(hexColor) {
  return goog.color.alpha.rgbaStyle_(goog.color.alpha.hexToRgba(hexColor));
***REMOVED***


***REMOVED***
***REMOVED*** Gets the hex color part of an alpha hex color. For example, from '#abcdef55'
***REMOVED*** return '#abcdef'.
***REMOVED*** @param {string} colorWithAlpha The alpha hex color to get the hex color from.
***REMOVED*** @return {string} The hex color where the alpha part has been stripped off.
***REMOVED***
goog.color.alpha.extractHexColor = function(colorWithAlpha) {
  if (goog.color.alpha.isValidAlphaHexColor_(colorWithAlpha)) {
    var fullColor = goog.color.prependHashIfNecessaryHelper(colorWithAlpha);
    var normalizedColor = goog.color.alpha.normalizeAlphaHex_(fullColor);
    return normalizedColor.substring(0, 7);
  } else {
    throw Error(colorWithAlpha + ' is not a valid 8-hex color string');
  }
***REMOVED***


***REMOVED***
***REMOVED*** Gets the alpha color part of an alpha hex color. For example, from
***REMOVED*** '#abcdef55' return '55'. The result is guaranteed to be two characters long.
***REMOVED*** @param {string} colorWithAlpha The alpha hex color to get the hex color from.
***REMOVED*** @return {string} The hex color where the alpha part has been stripped off.
***REMOVED***
goog.color.alpha.extractAlpha = function(colorWithAlpha) {
  if (goog.color.alpha.isValidAlphaHexColor_(colorWithAlpha)) {
    var fullColor = goog.color.prependHashIfNecessaryHelper(colorWithAlpha);
    var normalizedColor = goog.color.alpha.normalizeAlphaHex_(fullColor);
    return normalizedColor.substring(7, 9);
  } else {
    throw Error(colorWithAlpha + ' is not a valid 8-hex color string');
  }
***REMOVED***


***REMOVED***
***REMOVED*** Regular expression for extracting the digits in a hex color quadruplet.
***REMOVED*** @type {RegExp}
***REMOVED*** @private
***REMOVED***
goog.color.alpha.hexQuadrupletRe_ = /#(.)(.)(.)(.)/;


***REMOVED***
***REMOVED*** Normalize a hex representation of an alpha color.
***REMOVED*** @param {string} hexColor an alpha hex color string.
***REMOVED*** @return {string} hex color in the format '#rrggbbaa' with all lowercase
***REMOVED***     literals.
***REMOVED*** @private
***REMOVED***
goog.color.alpha.normalizeAlphaHex_ = function(hexColor) {
  if (!goog.color.alpha.isValidAlphaHexColor_(hexColor)) {
    throw Error("'" + hexColor + "' is not a valid alpha hex color");
  }
  if (hexColor.length == 5) { // of the form #RGBA
    hexColor = hexColor.replace(goog.color.alpha.hexQuadrupletRe_,
        '#$1$1$2$2$3$3$4$4');
  }
  return hexColor.toLowerCase();
***REMOVED***


***REMOVED***
***REMOVED*** Converts an 8-hex representation of a color to RGBA.
***REMOVED*** @param {string} hexColor Color to convert.
***REMOVED*** @return {!Array} array containing [r, g, b, a]. r, g, b are ints between 0
***REMOVED***     and 255, and a is a value between 0 and 1.
***REMOVED***
goog.color.alpha.hexToRgba = function(hexColor) {
  // TODO(user): Enhance code sharing with goog.color, for example by
  //     adding a goog.color.genericHexToRgb method.
  hexColor = goog.color.alpha.normalizeAlphaHex_(hexColor);
  var r = parseInt(hexColor.substr(1, 2), 16);
  var g = parseInt(hexColor.substr(3, 2), 16);
  var b = parseInt(hexColor.substr(5, 2), 16);
  var a = parseInt(hexColor.substr(7, 2), 16);

  return [r, g, b, a / 255];
***REMOVED***


***REMOVED***
***REMOVED*** Converts a color from RGBA to hex representation.
***REMOVED*** @param {number} r Amount of red, int between 0 and 255.
***REMOVED*** @param {number} g Amount of green, int between 0 and 255.
***REMOVED*** @param {number} b Amount of blue, int between 0 and 255.
***REMOVED*** @param {number} a Amount of alpha, float between 0 and 1.
***REMOVED*** @return {string} hex representation of the color.
***REMOVED***
goog.color.alpha.rgbaToHex = function(r, g, b, a) {
  var intAlpha = Math.floor(a***REMOVED*** 255);
  if (isNaN(intAlpha) || intAlpha < 0 || intAlpha > 255) {
    // TODO(user): The CSS spec says the value should be clamped.
    throw Error('"(' + r + ',' + g + ',' + b + ',' + a +
        '") is not a valid RGBA color');
  }
  var hexA = goog.color.prependZeroIfNecessaryHelper(intAlpha.toString(16));
  return goog.color.rgbToHex(r, g, b) + hexA;
***REMOVED***


***REMOVED***
***REMOVED*** Converts a color from HSLA to hex representation.
***REMOVED*** @param {number} h Amount of hue, int between 0 and 360.
***REMOVED*** @param {number} s Amount of saturation, int between 0 and 100.
***REMOVED*** @param {number} l Amount of lightness, int between 0 and 100.
***REMOVED*** @param {number} a Amount of alpha, float between 0 and 1.
***REMOVED*** @return {string} hex representation of the color.
***REMOVED***
goog.color.alpha.hslaToHex = function(h, s, l, a) {
  var intAlpha = Math.floor(a***REMOVED*** 255);
  if (isNaN(intAlpha) || intAlpha < 0 || intAlpha > 255) {
    // TODO(user): The CSS spec says the value should be clamped.
    throw Error('"(' + h + ',' + s + ',' + l + ',' + a +
        '") is not a valid HSLA color');
  }
  var hexA = goog.color.prependZeroIfNecessaryHelper(intAlpha.toString(16));
  return goog.color.hslToHex(h, s / 100, l / 100) + hexA;
***REMOVED***


***REMOVED***
***REMOVED*** Converts a color from RGBA to hex representation.
***REMOVED*** @param {Array.<number>} rgba Array of [r, g, b, a], with r, g, b in [0, 255]
***REMOVED***     and a in [0, 1].
***REMOVED*** @return {string} hex representation of the color.
***REMOVED***
goog.color.alpha.rgbaArrayToHex = function(rgba) {
  return goog.color.alpha.rgbaToHex(rgba[0], rgba[1], rgba[2], rgba[3]);
***REMOVED***


***REMOVED***
***REMOVED*** Converts a color from RGBA to an RGBA style string.
***REMOVED*** @param {number} r Value of red, in [0, 255].
***REMOVED*** @param {number} g Value of green, in [0, 255].
***REMOVED*** @param {number} b Value of blue, in [0, 255].
***REMOVED*** @param {number} a Value of alpha, in [0, 1].
***REMOVED*** @return {string} An 'rgba(r,g,b,a)' string ready for use in a CSS rule.
***REMOVED***
goog.color.alpha.rgbaToRgbaStyle = function(r, g, b, a) {
  if (isNaN(r) || r < 0 || r > 255 ||
      isNaN(g) || g < 0 || g > 255 ||
      isNaN(b) || b < 0 || b > 255 ||
      isNaN(a) || a < 0 || a > 1) {
    throw Error('"(' + r + ',' + g + ',' + b + ',' + a +
        ')" is not a valid RGBA color');
  }
  return goog.color.alpha.rgbaStyle_([r, g, b, a]);
***REMOVED***


***REMOVED***
***REMOVED*** Converts a color from RGBA to an RGBA style string.
***REMOVED*** @param {(Array.<number>|Float32Array)} rgba Array of [r, g, b, a],
***REMOVED***     with r, g, b in [0, 255] and a in [0, 1].
***REMOVED*** @return {string} An 'rgba(r,g,b,a)' string ready for use in a CSS rule.
***REMOVED***
goog.color.alpha.rgbaArrayToRgbaStyle = function(rgba) {
  return goog.color.alpha.rgbaToRgbaStyle(rgba[0], rgba[1], rgba[2], rgba[3]);
***REMOVED***


***REMOVED***
***REMOVED*** Converts a color from HSLA to hex representation.
***REMOVED*** @param {Array.<number>} hsla Array of [h, s, l, a], where h is an integer in
***REMOVED***     [0, 360], s and l are integers in [0, 100], and a is in [0, 1].
***REMOVED*** @return {string} hex representation of the color, such as '#af457eff'.
***REMOVED***
goog.color.alpha.hslaArrayToHex = function(hsla) {
  return goog.color.alpha.hslaToHex(hsla[0], hsla[1], hsla[2], hsla[3]);
***REMOVED***


***REMOVED***
***REMOVED*** Converts a color from HSLA to an RGBA style string.
***REMOVED*** @param {Array.<number>} hsla Array of [h, s, l, a], where h is and integer in
***REMOVED***     [0, 360], s and l are integers in [0, 100], and a is in [0, 1].
***REMOVED*** @return {string} An 'rgba(r,g,b,a)' string ready for use in a CSS rule.
***REMOVED***
goog.color.alpha.hslaArrayToRgbaStyle = function(hsla) {
  return goog.color.alpha.hslaToRgbaStyle(hsla[0], hsla[1], hsla[2], hsla[3]);
***REMOVED***


***REMOVED***
***REMOVED*** Converts a color from HSLA to an RGBA style string.
***REMOVED*** @param {number} h Amount of hue, int between 0 and 360.
***REMOVED*** @param {number} s Amount of saturation, int between 0 and 100.
***REMOVED*** @param {number} l Amount of lightness, int between 0 and 100.
***REMOVED*** @param {number} a Amount of alpha, float between 0 and 1.
***REMOVED*** @return {string} An 'rgba(r,g,b,a)' string ready for use in a CSS rule.
***REMOVED***     styles.
***REMOVED***
goog.color.alpha.hslaToRgbaStyle = function(h, s, l, a) {
  return goog.color.alpha.rgbaStyle_(goog.color.alpha.hslaToRgba(h, s, l, a));
***REMOVED***


***REMOVED***
***REMOVED*** Converts a color from HSLA color space to RGBA color space.
***REMOVED*** @param {number} h Amount of hue, int between 0 and 360.
***REMOVED*** @param {number} s Amount of saturation, int between 0 and 100.
***REMOVED*** @param {number} l Amount of lightness, int between 0 and 100.
***REMOVED*** @param {number} a Amount of alpha, float between 0 and 1.
***REMOVED*** @return {!Array.<number>} [r, g, b, a] values for the color, where r, g, b
***REMOVED***     are integers in [0, 255] and a is a float in [0, 1].
***REMOVED***
goog.color.alpha.hslaToRgba = function(h, s, l, a) {
  return goog.color.hslToRgb(h, s / 100, l / 100).concat(a);
***REMOVED***


***REMOVED***
***REMOVED*** Converts a color from RGBA color space to HSLA color space.
***REMOVED*** Modified from {@link http://en.wikipedia.org/wiki/HLS_color_space}.
***REMOVED*** @param {number} r Value of red, in [0, 255].
***REMOVED*** @param {number} g Value of green, in [0, 255].
***REMOVED*** @param {number} b Value of blue, in [0, 255].
***REMOVED*** @param {number} a Value of alpha, in [0, 255].
***REMOVED*** @return {!Array.<number>} [h, s, l, a] values for the color, with h an int in
***REMOVED***     [0, 360] and s, l and a in [0, 1].
***REMOVED***
goog.color.alpha.rgbaToHsla = function(r, g, b, a) {
  return goog.color.rgbToHsl(r, g, b).concat(a);
***REMOVED***


***REMOVED***
***REMOVED*** Converts a color from RGBA color space to HSLA color space.
***REMOVED*** @param {Array.<number>} rgba [r, g, b, a] values for the color, each in
***REMOVED***     [0, 255].
***REMOVED*** @return {!Array.<number>} [h, s, l, a] values for the color, with h in
***REMOVED***     [0, 360] and s, l and a in [0, 1].
***REMOVED***
goog.color.alpha.rgbaArrayToHsla = function(rgba) {
  return goog.color.alpha.rgbaToHsla(rgba[0], rgba[1], rgba[2], rgba[3]);
***REMOVED***


***REMOVED***
***REMOVED*** Helper for isValidAlphaHexColor_.
***REMOVED*** @type {RegExp}
***REMOVED*** @private
***REMOVED***
goog.color.alpha.validAlphaHexColorRe_ = /^#(?:[0-9a-f]{4}){1,2}$/i;


***REMOVED***
***REMOVED*** Checks if a string is a valid alpha hex color.  We expect strings of the
***REMOVED*** format #RRGGBBAA (ex: #1b3d5f5b) or #RGBA (ex: #3CAF == #33CCAAFF).
***REMOVED*** @param {string} str String to check.
***REMOVED*** @return {boolean} Whether the string is a valid alpha hex color.
***REMOVED*** @private
***REMOVED***
// TODO(user): Support percentages when goog.color also supports them.
goog.color.alpha.isValidAlphaHexColor_ = function(str) {
  return goog.color.alpha.validAlphaHexColorRe_.test(str);
***REMOVED***


***REMOVED***
***REMOVED*** Helper for isNormalizedAlphaHexColor_.
***REMOVED*** @type {RegExp}
***REMOVED*** @private
***REMOVED***
goog.color.alpha.normalizedAlphaHexColorRe_ = /^#[0-9a-f]{8}$/;


***REMOVED***
***REMOVED*** Checks if a string is a normalized alpha hex color.
***REMOVED*** We expect strings of the format #RRGGBBAA (ex: #1b3d5f5b)
***REMOVED*** using only lowercase letters.
***REMOVED*** @param {string} str String to check.
***REMOVED*** @return {boolean} Whether the string is a normalized hex color.
***REMOVED*** @private
***REMOVED***
goog.color.alpha.isNormalizedAlphaHexColor_ = function(str) {
  return goog.color.alpha.normalizedAlphaHexColorRe_.test(str);
***REMOVED***


***REMOVED***
***REMOVED*** Regular expression for matching and capturing RGBA style strings. Helper for
***REMOVED*** isValidRgbaColor_.
***REMOVED*** @type {RegExp}
***REMOVED*** @private
***REMOVED***
goog.color.alpha.rgbaColorRe_ =
    /^(?:rgba)?\((0|[1-9]\d{0,2}),\s?(0|[1-9]\d{0,2}),\s?(0|[1-9]\d{0,2}),\s?(0|1|0\.\d{0,10})\)$/i;


***REMOVED***
***REMOVED*** Regular expression for matching and capturing HSLA style strings. Helper for
***REMOVED*** isValidHslaColor_.
***REMOVED*** @type {RegExp}
***REMOVED*** @private
***REMOVED***
goog.color.alpha.hslaColorRe_ =
    /^(?:hsla)\((0|[1-9]\d{0,2}),\s?(0|[1-9]\d{0,2})\%,\s?(0|[1-9]\d{0,2})\%,\s?(0|1|0\.\d{0,10})\)$/i;


***REMOVED***
***REMOVED*** Checks if a string is a valid rgba color.  We expect strings of the format
***REMOVED*** '(r, g, b, a)', or 'rgba(r, g, b, a)', where r, g, b are ints in [0, 255]
***REMOVED***     and a is a float in [0, 1].
***REMOVED*** @param {string} str String to check.
***REMOVED*** @return {!Array.<number>} the integers [r, g, b, a] for valid colors or the
***REMOVED***     empty array for invalid colors.
***REMOVED*** @private
***REMOVED***
goog.color.alpha.isValidRgbaColor_ = function(str) {
  // Each component is separate (rather than using a repeater) so we can
  // capture the match. Also, we explicitly set each component to be either 0,
  // or start with a non-zero, to prevent octal numbers from slipping through.
  var regExpResultArray = str.match(goog.color.alpha.rgbaColorRe_);
  if (regExpResultArray) {
    var r = Number(regExpResultArray[1]);
    var g = Number(regExpResultArray[2]);
    var b = Number(regExpResultArray[3]);
    var a = Number(regExpResultArray[4]);
    if (r >= 0 && r <= 255 &&
        g >= 0 && g <= 255 &&
        b >= 0 && b <= 255 &&
        a >= 0 && a <= 1) {
      return [r, g, b, a];
    }
  }
  return [];
***REMOVED***


***REMOVED***
***REMOVED*** Checks if a string is a valid hsla color.  We expect strings of the format
***REMOVED*** 'hsla(h, s, l, a)', where s in an int in [0, 360], s and l are percentages
***REMOVED***     between 0 and 100 such as '50%' or '70%', and a is a float in [0, 1].
***REMOVED*** @param {string} str String to check.
***REMOVED*** @return {!Array.<number>} the integers [h, s, l, a] for valid colors or the
***REMOVED***     empty array for invalid colors.
***REMOVED*** @private
***REMOVED***
goog.color.alpha.isValidHslaColor_ = function(str) {
  // Each component is separate (rather than using a repeater) so we can
  // capture the match. Also, we explicitly set each component to be either 0,
  // or start with a non-zero, to prevent octal numbers from slipping through.
  var regExpResultArray = str.match(goog.color.alpha.hslaColorRe_);
  if (regExpResultArray) {
    var h = Number(regExpResultArray[1]);
    var s = Number(regExpResultArray[2]);
    var l = Number(regExpResultArray[3]);
    var a = Number(regExpResultArray[4]);
    if (h >= 0 && h <= 360 &&
        s >= 0 && s <= 100 &&
        l >= 0 && l <= 100 &&
        a >= 0 && a <= 1) {
      return [h, s, l, a];
    }
  }
  return [];
***REMOVED***


***REMOVED***
***REMOVED*** Takes an array of [r, g, b, a] and converts it into a string appropriate for
***REMOVED*** CSS styles. The alpha channel value is rounded to 3 decimal places to make
***REMOVED*** sure the produced string is not too long.
***REMOVED*** @param {Array.<number>} rgba [r, g, b, a] with r, g, b in [0, 255] and a
***REMOVED***     in [0, 1].
***REMOVED*** @return {string} string of the form 'rgba(r,g,b,a)'.
***REMOVED*** @private
***REMOVED***
goog.color.alpha.rgbaStyle_ = function(rgba) {
  var roundedRgba = rgba.slice(0);
  roundedRgba[3] = Math.round(rgba[3]***REMOVED*** 1000) / 1000;
  return 'rgba(' + roundedRgba.join(',') + ')';
***REMOVED***


***REMOVED***
***REMOVED*** Converts from h,s,v,a values to a hex string
***REMOVED*** @param {number} h Hue, in [0, 1].
***REMOVED*** @param {number} s Saturation, in [0, 1].
***REMOVED*** @param {number} v Value, in [0, 255].
***REMOVED*** @param {number} a Alpha, in [0, 1].
***REMOVED*** @return {string} hex representation of the color.
***REMOVED***
goog.color.alpha.hsvaToHex = function(h, s, v, a) {
  var alpha = Math.floor(a***REMOVED*** 255);
  return goog.color.hsvArrayToHex([h, s, v]) +
         goog.color.prependZeroIfNecessaryHelper(alpha.toString(16));
***REMOVED***


***REMOVED***
***REMOVED*** Converts from an HSVA array to a hex string
***REMOVED*** @param {Array} hsva Array of [h, s, v, a] in
***REMOVED***     [[0, 1], [0, 1], [0, 255], [0, 1]].
***REMOVED*** @return {string} hex representation of the color.
***REMOVED***
goog.color.alpha.hsvaArrayToHex = function(hsva) {
  return goog.color.alpha.hsvaToHex(hsva[0], hsva[1], hsva[2], hsva[3]);
***REMOVED***
