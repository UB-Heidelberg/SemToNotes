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
***REMOVED*** @fileoverview Utilities related to color and color conversion.
***REMOVED***

goog.provide('goog.color');
goog.provide('goog.color.Hsl');
goog.provide('goog.color.Hsv');
goog.provide('goog.color.Rgb');

goog.require('goog.color.names');
goog.require('goog.math');


***REMOVED***
***REMOVED*** RGB color representation. An array containing three elements [r, g, b],
***REMOVED*** each an integer in [0, 255], representing the red, green, and blue components
***REMOVED*** of the color respectively.
***REMOVED*** @typedef {Array.<number>}
***REMOVED***
goog.color.Rgb;


***REMOVED***
***REMOVED*** HSV color representation. An array containing three elements [h, s, v]:
***REMOVED*** h (hue) must be an integer in [0, 360], cyclic.
***REMOVED*** s (saturation) must be a number in [0, 1].
***REMOVED*** v (value/brightness) must be an integer in [0, 255].
***REMOVED*** @typedef {Array.<number>}
***REMOVED***
goog.color.Hsv;


***REMOVED***
***REMOVED*** HSL color representation. An array containing three elements [h, s, l]:
***REMOVED*** h (hue) must be an integer in [0, 360], cyclic.
***REMOVED*** s (saturation) must be a number in [0, 1].
***REMOVED*** l (lightness) must be a number in [0, 1].
***REMOVED*** @typedef {Array.<number>}
***REMOVED***
goog.color.Hsl;


***REMOVED***
***REMOVED*** Parses a color out of a string.
***REMOVED*** @param {string} str Color in some format.
***REMOVED*** @return {{hex: string, type: string}} 'hex' is a string containing a hex
***REMOVED***     representation of the color, 'type' is a string containing the type
***REMOVED***     of color format passed in ('hex', 'rgb', 'named').
***REMOVED***
goog.color.parse = function(str) {
  var result = {***REMOVED***
  str = String(str);

  var maybeHex = goog.color.prependHashIfNecessaryHelper(str);
  if (goog.color.isValidHexColor_(maybeHex)) {
    result.hex = goog.color.normalizeHex(maybeHex);
    result.type = 'hex';
    return result;
  } else {
    var rgb = goog.color.isValidRgbColor_(str);
    if (rgb.length) {
      result.hex = goog.color.rgbArrayToHex(rgb);
      result.type = 'rgb';
      return result;
    } else if (goog.color.names) {
      var hex = goog.color.names[str.toLowerCase()];
      if (hex) {
        result.hex = hex;
        result.type = 'named';
        return result;
      }
    }
  }
  throw Error(str + ' is not a valid color string');
***REMOVED***


***REMOVED***
***REMOVED*** Determines if the given string can be parsed as a color.
***REMOVED***     {@see goog.color.parse}.
***REMOVED*** @param {string} str Potential color string.
***REMOVED*** @return {boolean} True if str is in a format that can be parsed to a color.
***REMOVED***
goog.color.isValidColor = function(str) {
  var maybeHex = goog.color.prependHashIfNecessaryHelper(str);
  return !!(goog.color.isValidHexColor_(maybeHex) ||
            goog.color.isValidRgbColor_(str).length ||
            goog.color.names && goog.color.names[str.toLowerCase()]);
***REMOVED***


***REMOVED***
***REMOVED*** Parses red, green, blue components out of a valid rgb color string.
***REMOVED*** Throws Error if the color string is invalid.
***REMOVED*** @param {string} str RGB representation of a color.
***REMOVED***    {@see goog.color.isValidRgbColor_}.
***REMOVED*** @return {!goog.color.Rgb} rgb representation of the color.
***REMOVED***
goog.color.parseRgb = function(str) {
  var rgb = goog.color.isValidRgbColor_(str);
  if (!rgb.length) {
    throw Error(str + ' is not a valid RGB color');
  }
  return rgb;
***REMOVED***


***REMOVED***
***REMOVED*** Converts a hex representation of a color to RGB.
***REMOVED*** @param {string} hexColor Color to convert.
***REMOVED*** @return {string} string of the form 'rgb(R,G,B)' which can be used in
***REMOVED***    styles.
***REMOVED***
goog.color.hexToRgbStyle = function(hexColor) {
  return goog.color.rgbStyle_(goog.color.hexToRgb(hexColor));
***REMOVED***


***REMOVED***
***REMOVED*** Regular expression for extracting the digits in a hex color triplet.
***REMOVED*** @type {RegExp}
***REMOVED*** @private
***REMOVED***
goog.color.hexTripletRe_ = /#(.)(.)(.)/;


***REMOVED***
***REMOVED*** Normalize an hex representation of a color
***REMOVED*** @param {string} hexColor an hex color string.
***REMOVED*** @return {string} hex color in the format '#rrggbb' with all lowercase
***REMOVED***     literals.
***REMOVED***
goog.color.normalizeHex = function(hexColor) {
  if (!goog.color.isValidHexColor_(hexColor)) {
    throw Error("'" + hexColor + "' is not a valid hex color");
  }
  if (hexColor.length == 4) { // of the form #RGB
    hexColor = hexColor.replace(goog.color.hexTripletRe_, '#$1$1$2$2$3$3');
  }
  return hexColor.toLowerCase();
***REMOVED***


***REMOVED***
***REMOVED*** Converts a hex representation of a color to RGB.
***REMOVED*** @param {string} hexColor Color to convert.
***REMOVED*** @return {!goog.color.Rgb} rgb representation of the color.
***REMOVED***
goog.color.hexToRgb = function(hexColor) {
  hexColor = goog.color.normalizeHex(hexColor);
  var r = parseInt(hexColor.substr(1, 2), 16);
  var g = parseInt(hexColor.substr(3, 2), 16);
  var b = parseInt(hexColor.substr(5, 2), 16);

  return [r, g, b];
***REMOVED***


***REMOVED***
***REMOVED*** Converts a color from RGB to hex representation.
***REMOVED*** @param {number} r Amount of red, int between 0 and 255.
***REMOVED*** @param {number} g Amount of green, int between 0 and 255.
***REMOVED*** @param {number} b Amount of blue, int between 0 and 255.
***REMOVED*** @return {string} hex representation of the color.
***REMOVED***
goog.color.rgbToHex = function(r, g, b) {
  r = Number(r);
  g = Number(g);
  b = Number(b);
  if (isNaN(r) || r < 0 || r > 255 ||
      isNaN(g) || g < 0 || g > 255 ||
      isNaN(b) || b < 0 || b > 255) {
    throw Error('"(' + r + ',' + g + ',' + b + '") is not a valid RGB color');
  }
  var hexR = goog.color.prependZeroIfNecessaryHelper(r.toString(16));
  var hexG = goog.color.prependZeroIfNecessaryHelper(g.toString(16));
  var hexB = goog.color.prependZeroIfNecessaryHelper(b.toString(16));
  return '#' + hexR + hexG + hexB;
***REMOVED***


***REMOVED***
***REMOVED*** Converts a color from RGB to hex representation.
***REMOVED*** @param {goog.color.Rgb} rgb rgb representation of the color.
***REMOVED*** @return {string} hex representation of the color.
***REMOVED***
goog.color.rgbArrayToHex = function(rgb) {
  return goog.color.rgbToHex(rgb[0], rgb[1], rgb[2]);
***REMOVED***


***REMOVED***
***REMOVED*** Converts a color from RGB color space to HSL color space.
***REMOVED*** Modified from {@link http://en.wikipedia.org/wiki/HLS_color_space}.
***REMOVED*** @param {number} r Value of red, in [0, 255].
***REMOVED*** @param {number} g Value of green, in [0, 255].
***REMOVED*** @param {number} b Value of blue, in [0, 255].
***REMOVED*** @return {!goog.color.Hsl} hsl representation of the color.
***REMOVED***
goog.color.rgbToHsl = function(r, g, b) {
  // First must normalize r, g, b to be between 0 and 1.
  var normR = r / 255;
  var normG = g / 255;
  var normB = b / 255;
  var max = Math.max(normR, normG, normB);
  var min = Math.min(normR, normG, normB);
  var h = 0;
  var s = 0;

  // Luminosity is the average of the max and min rgb color intensities.
  var l = 0.5***REMOVED*** (max + min);

  // The hue and saturation are dependent on which color intensity is the max.
  // If max and min are equal, the color is gray and h and s should be 0.
  if (max != min) {
    if (max == normR) {
      h = 60***REMOVED*** (normG - normB) / (max - min);
    } else if (max == normG) {
      h = 60***REMOVED*** (normB - normR) / (max - min) + 120;
    } else if (max == normB) {
      h = 60***REMOVED*** (normR - normG) / (max - min) + 240;
    }

    if (0 < l && l <= 0.5) {
      s = (max - min) / (2***REMOVED*** l);
    } else {
      s = (max - min) / (2 - 2***REMOVED*** l);
    }
  }

  // Make sure the hue falls between 0 and 360.
  return [Math.round(h + 360) % 360, s, l];
***REMOVED***


***REMOVED***
***REMOVED*** Converts a color from RGB color space to HSL color space.
***REMOVED*** @param {goog.color.Rgb} rgb rgb representation of the color.
***REMOVED*** @return {!goog.color.Hsl} hsl representation of the color.
***REMOVED***
goog.color.rgbArrayToHsl = function(rgb) {
  return goog.color.rgbToHsl(rgb[0], rgb[1], rgb[2]);
***REMOVED***


***REMOVED***
***REMOVED*** Helper for hslToRgb.
***REMOVED*** @param {number} v1 Helper variable 1.
***REMOVED*** @param {number} v2 Helper variable 2.
***REMOVED*** @param {number} vH Helper variable 3.
***REMOVED*** @return {number} Appropriate RGB value, given the above.
***REMOVED*** @private
***REMOVED***
goog.color.hueToRgb_ = function(v1, v2, vH) {
  if (vH < 0) {
    vH += 1;
  } else if (vH > 1) {
    vH -= 1;
  }
  if ((6***REMOVED*** vH) < 1) {
    return (v1 + (v2 - v1)***REMOVED*** 6***REMOVED*** vH);
  } else if (2***REMOVED*** vH < 1) {
    return v2;
  } else if (3***REMOVED*** vH < 2) {
    return (v1 + (v2 - v1)***REMOVED*** ((2 / 3) - vH)***REMOVED*** 6);
  }
  return v1;
***REMOVED***


***REMOVED***
***REMOVED*** Converts a color from HSL color space to RGB color space.
***REMOVED*** Modified from {@link http://www.easyrgb.com/math.html}
***REMOVED*** @param {number} h Hue, in [0, 360].
***REMOVED*** @param {number} s Saturation, in [0, 1].
***REMOVED*** @param {number} l Luminosity, in [0, 1].
***REMOVED*** @return {!goog.color.Rgb} rgb representation of the color.
***REMOVED***
goog.color.hslToRgb = function(h, s, l) {
  var r = 0;
  var g = 0;
  var b = 0;
  var normH = h / 360; // normalize h to fall in [0, 1]

  if (s == 0) {
    r = g = b = l***REMOVED*** 255;
  } else {
    var temp1 = 0;
    var temp2 = 0;
    if (l < 0.5) {
      temp2 = l***REMOVED*** (1 + s);
    } else {
      temp2 = l + s - (s***REMOVED*** l);
    }
    temp1 = 2***REMOVED*** l - temp2;
    r = 255***REMOVED*** goog.color.hueToRgb_(temp1, temp2, normH + (1 / 3));
    g = 255***REMOVED*** goog.color.hueToRgb_(temp1, temp2, normH);
    b = 255***REMOVED*** goog.color.hueToRgb_(temp1, temp2, normH - (1 / 3));
  }

  return [Math.round(r), Math.round(g), Math.round(b)];
***REMOVED***


***REMOVED***
***REMOVED*** Converts a color from HSL color space to RGB color space.
***REMOVED*** @param {goog.color.Hsl} hsl hsl representation of the color.
***REMOVED*** @return {!goog.color.Rgb} rgb representation of the color.
***REMOVED***
goog.color.hslArrayToRgb = function(hsl) {
  return goog.color.hslToRgb(hsl[0], hsl[1], hsl[2]);
***REMOVED***


***REMOVED***
***REMOVED*** Helper for isValidHexColor_.
***REMOVED*** @type {RegExp}
***REMOVED*** @private
***REMOVED***
goog.color.validHexColorRe_ = /^#(?:[0-9a-f]{3}){1,2}$/i;


***REMOVED***
***REMOVED*** Checks if a string is a valid hex color.  We expect strings of the format
***REMOVED*** #RRGGBB (ex: #1b3d5f) or #RGB (ex: #3CA == #33CCAA).
***REMOVED*** @param {string} str String to check.
***REMOVED*** @return {boolean} Whether the string is a valid hex color.
***REMOVED*** @private
***REMOVED***
goog.color.isValidHexColor_ = function(str) {
  return goog.color.validHexColorRe_.test(str);
***REMOVED***


***REMOVED***
***REMOVED*** Helper for isNormalizedHexColor_.
***REMOVED*** @type {RegExp}
***REMOVED*** @private
***REMOVED***
goog.color.normalizedHexColorRe_ = /^#[0-9a-f]{6}$/;


***REMOVED***
***REMOVED*** Checks if a string is a normalized hex color.
***REMOVED*** We expect strings of the format #RRGGBB (ex: #1b3d5f)
***REMOVED*** using only lowercase letters.
***REMOVED*** @param {string} str String to check.
***REMOVED*** @return {boolean} Whether the string is a normalized hex color.
***REMOVED*** @private
***REMOVED***
goog.color.isNormalizedHexColor_ = function(str) {
  return goog.color.normalizedHexColorRe_.test(str);
***REMOVED***


***REMOVED***
***REMOVED*** Regular expression for matching and capturing RGB style strings. Helper for
***REMOVED*** isValidRgbColor_.
***REMOVED*** @type {RegExp}
***REMOVED*** @private
***REMOVED***
goog.color.rgbColorRe_ =
    /^(?:rgb)?\((0|[1-9]\d{0,2}),\s?(0|[1-9]\d{0,2}),\s?(0|[1-9]\d{0,2})\)$/i;


***REMOVED***
***REMOVED*** Checks if a string is a valid rgb color.  We expect strings of the format
***REMOVED*** '(r, g, b)', or 'rgb(r, g, b)', where each color component is an int in
***REMOVED*** [0, 255].
***REMOVED*** @param {string} str String to check.
***REMOVED*** @return {!goog.color.Rgb} the rgb representation of the color if it is
***REMOVED***     a valid color, or the empty array otherwise.
***REMOVED*** @private
***REMOVED***
goog.color.isValidRgbColor_ = function(str) {
  // Each component is separate (rather than using a repeater) so we can
  // capture the match. Also, we explicitly set each component to be either 0,
  // or start with a non-zero, to prevent octal numbers from slipping through.
  var regExpResultArray = str.match(goog.color.rgbColorRe_);
  if (regExpResultArray) {
    var r = Number(regExpResultArray[1]);
    var g = Number(regExpResultArray[2]);
    var b = Number(regExpResultArray[3]);
    if (r >= 0 && r <= 255 &&
        g >= 0 && g <= 255 &&
        b >= 0 && b <= 255) {
      return [r, g, b];
    }
  }
  return [];
***REMOVED***


***REMOVED***
***REMOVED*** Takes a hex value and prepends a zero if it's a single digit.
***REMOVED*** Small helper method for use by goog.color and friends.
***REMOVED*** @param {string} hex Hex value to prepend if single digit.
***REMOVED*** @return {string} hex value prepended with zero if it was single digit,
***REMOVED***     otherwise the same value that was passed in.
***REMOVED***
goog.color.prependZeroIfNecessaryHelper = function(hex) {
  return hex.length == 1 ? '0' + hex : hex;
***REMOVED***


***REMOVED***
***REMOVED*** Takes a string a prepends a '#' sign if one doesn't exist.
***REMOVED*** Small helper method for use by goog.color and friends.
***REMOVED*** @param {string} str String to check.
***REMOVED*** @return {string} The value passed in, prepended with a '#' if it didn't
***REMOVED***     already have one.
***REMOVED***
goog.color.prependHashIfNecessaryHelper = function(str) {
  return str.charAt(0) == '#' ? str : '#' + str;
***REMOVED***


***REMOVED***
***REMOVED*** Takes an array of [r, g, b] and converts it into a string appropriate for
***REMOVED*** CSS styles.
***REMOVED*** @param {goog.color.Rgb} rgb rgb representation of the color.
***REMOVED*** @return {string} string of the form 'rgb(r,g,b)'.
***REMOVED*** @private
***REMOVED***
goog.color.rgbStyle_ = function(rgb) {
  return 'rgb(' + rgb.join(',') + ')';
***REMOVED***


***REMOVED***
***REMOVED*** Converts an HSV triplet to an RGB array.  V is brightness because b is
***REMOVED***   reserved for blue in RGB.
***REMOVED*** @param {number} h Hue value in [0, 360].
***REMOVED*** @param {number} s Saturation value in [0, 1].
***REMOVED*** @param {number} brightness brightness in [0, 255].
***REMOVED*** @return {!goog.color.Rgb} rgb representation of the color.
***REMOVED***
goog.color.hsvToRgb = function(h, s, brightness) {
  var red = 0;
  var green = 0;
  var blue = 0;
  if (s == 0) {
    red = brightness;
    green = brightness;
    blue = brightness;
  } else {
    var sextant = Math.floor(h / 60);
    var remainder = (h / 60) - sextant;
    var val1 = brightness***REMOVED*** (1 - s);
    var val2 = brightness***REMOVED*** (1 - (s***REMOVED*** remainder));
    var val3 = brightness***REMOVED*** (1 - (s***REMOVED*** (1 - remainder)));
    switch (sextant) {
      case 1:
        red = val2;
        green = brightness;
        blue = val1;
        break;
      case 2:
        red = val1;
        green = brightness;
        blue = val3;
        break;
      case 3:
        red = val1;
        green = val2;
        blue = brightness;
        break;
      case 4:
        red = val3;
        green = val1;
        blue = brightness;
        break;
      case 5:
        red = brightness;
        green = val1;
        blue = val2;
        break;
      case 6:
      case 0:
        red = brightness;
        green = val3;
        blue = val1;
        break;
    }
  }

  return [Math.floor(red), Math.floor(green), Math.floor(blue)];
***REMOVED***


***REMOVED***
***REMOVED*** Converts from RGB values to an array of HSV values.
***REMOVED*** @param {number} red Red value in [0, 255].
***REMOVED*** @param {number} green Green value in [0, 255].
***REMOVED*** @param {number} blue Blue value in [0, 255].
***REMOVED*** @return {!goog.color.Hsv} hsv representation of the color.
***REMOVED***
goog.color.rgbToHsv = function(red, green, blue) {

  var max = Math.max(Math.max(red, green), blue);
  var min = Math.min(Math.min(red, green), blue);
  var hue;
  var saturation;
  var value = max;
  if (min == max) {
    hue = 0;
    saturation = 0;
  } else {
    var delta = (max - min);
    saturation = delta / max;

    if (red == max) {
      hue = (green - blue) / delta;
    } else if (green == max) {
      hue = 2 + ((blue - red) / delta);
    } else {
      hue = 4 + ((red - green) / delta);
    }
    hue***REMOVED***= 60;
    if (hue < 0) {
      hue += 360;
    }
    if (hue > 360) {
      hue -= 360;
    }
  }

  return [hue, saturation, value];
***REMOVED***


***REMOVED***
***REMOVED*** Converts from an array of RGB values to an array of HSV values.
***REMOVED*** @param {goog.color.Rgb} rgb rgb representation of the color.
***REMOVED*** @return {!goog.color.Hsv} hsv representation of the color.
***REMOVED***
goog.color.rgbArrayToHsv = function(rgb) {
  return goog.color.rgbToHsv(rgb[0], rgb[1], rgb[2]);
***REMOVED***


***REMOVED***
***REMOVED*** Converts an HSV triplet to an RGB array.
***REMOVED*** @param {goog.color.Hsv} hsv hsv representation of the color.
***REMOVED*** @return {!goog.color.Rgb} rgb representation of the color.
***REMOVED***
goog.color.hsvArrayToRgb = function(hsv) {
  return goog.color.hsvToRgb(hsv[0], hsv[1], hsv[2]);
***REMOVED***


***REMOVED***
***REMOVED*** Converts a hex representation of a color to HSL.
***REMOVED*** @param {string} hex Color to convert.
***REMOVED*** @return {!goog.color.Hsv} hsv representation of the color.
***REMOVED***
goog.color.hexToHsl = function(hex) {
  var rgb = goog.color.hexToRgb(hex);
  return goog.color.rgbToHsl(rgb[0], rgb[1], rgb[2]);
***REMOVED***


***REMOVED***
***REMOVED*** Converts from h,s,l values to a hex string
***REMOVED*** @param {number} h Hue, in [0, 360].
***REMOVED*** @param {number} s Saturation, in [0, 1].
***REMOVED*** @param {number} l Luminosity, in [0, 1].
***REMOVED*** @return {string} hex representation of the color.
***REMOVED***
goog.color.hslToHex = function(h, s, l) {
  return goog.color.rgbArrayToHex(goog.color.hslToRgb(h, s, l));
***REMOVED***


***REMOVED***
***REMOVED*** Converts from an hsl array to a hex string
***REMOVED*** @param {goog.color.Hsl} hsl hsl representation of the color.
***REMOVED*** @return {string} hex representation of the color.
***REMOVED***
goog.color.hslArrayToHex = function(hsl) {
  return goog.color.rgbArrayToHex(goog.color.hslToRgb(hsl[0], hsl[1], hsl[2]));
***REMOVED***


***REMOVED***
***REMOVED*** Converts a hex representation of a color to HSV
***REMOVED*** @param {string} hex Color to convert.
***REMOVED*** @return {!goog.color.Hsv} hsv representation of the color.
***REMOVED***
goog.color.hexToHsv = function(hex) {
  return goog.color.rgbArrayToHsv(goog.color.hexToRgb(hex));
***REMOVED***


***REMOVED***
***REMOVED*** Converts from h,s,v values to a hex string
***REMOVED*** @param {number} h Hue, in [0, 360].
***REMOVED*** @param {number} s Saturation, in [0, 1].
***REMOVED*** @param {number} v Value, in [0, 255].
***REMOVED*** @return {string} hex representation of the color.
***REMOVED***
goog.color.hsvToHex = function(h, s, v) {
  return goog.color.rgbArrayToHex(goog.color.hsvToRgb(h, s, v));
***REMOVED***


***REMOVED***
***REMOVED*** Converts from an HSV array to a hex string
***REMOVED*** @param {goog.color.Hsv} hsv hsv representation of the color.
***REMOVED*** @return {string} hex representation of the color.
***REMOVED***
goog.color.hsvArrayToHex = function(hsv) {
  return goog.color.hsvToHex(hsv[0], hsv[1], hsv[2]);
***REMOVED***


***REMOVED***
***REMOVED*** Calculates the Euclidean distance between two color vectors on an HSL sphere.
***REMOVED*** A demo of the sphere can be found at:
***REMOVED*** http://en.wikipedia.org/wiki/HSL_color_space
***REMOVED*** In short, a vector for color (H, S, L) in this system can be expressed as
***REMOVED*** (S*L'*cos(2*PI*H), S*L'*sin(2*PI*H), L), where L' = abs(L - 0.5), and we
***REMOVED*** simply calculate the 1-2 distance using these coordinates
***REMOVED*** @param {goog.color.Hsl} hsl1 First color in hsl representation.
***REMOVED*** @param {goog.color.Hsl} hsl2 Second color in hsl representation.
***REMOVED*** @return {number} Distance between the two colors, in the range [0, 1].
***REMOVED***
goog.color.hslDistance = function(hsl1, hsl2) {
  var sl1, sl2;
  if (hsl1[2] <= 0.5) {
    sl1 = hsl1[1]***REMOVED*** hsl1[2];
  } else {
    sl1 = hsl1[1]***REMOVED*** (1.0 - hsl1[2]);
  }

  if (hsl2[2] <= 0.5) {
    sl2 = hsl2[1]***REMOVED*** hsl2[2];
  } else {
    sl2 = hsl2[1]***REMOVED*** (1.0 - hsl2[2]);
  }

  var h1 = hsl1[0] / 360.0;
  var h2 = hsl2[0] / 360.0;
  var dh = (h1 - h2)***REMOVED*** 2.0***REMOVED*** Math.PI;
  return (hsl1[2] - hsl2[2])***REMOVED*** (hsl1[2] - hsl2[2]) +
      sl1***REMOVED*** sl1 + sl2***REMOVED*** sl2 - 2***REMOVED*** sl1***REMOVED*** sl2***REMOVED*** Math.cos(dh);
***REMOVED***


***REMOVED***
***REMOVED*** Blend two colors together, using the specified factor to indicate the weight
***REMOVED*** given to the first color
***REMOVED*** @param {goog.color.Rgb} rgb1 First color represented in rgb.
***REMOVED*** @param {goog.color.Rgb} rgb2 Second color represented in rgb.
***REMOVED*** @param {number} factor The weight to be given to rgb1 over rgb2. Values
***REMOVED***     should be in the range [0, 1]. If less than 0, factor will be set to 0.
***REMOVED***     If greater than 1, factor will be set to 1.
***REMOVED*** @return {!goog.color.Rgb} Combined color represented in rgb.
***REMOVED***
goog.color.blend = function(rgb1, rgb2, factor) {
  factor = goog.math.clamp(factor, 0, 1);

  return [
    Math.round(factor***REMOVED*** rgb1[0] + (1.0 - factor)***REMOVED*** rgb2[0]),
    Math.round(factor***REMOVED*** rgb1[1] + (1.0 - factor)***REMOVED*** rgb2[1]),
    Math.round(factor***REMOVED*** rgb1[2] + (1.0 - factor)***REMOVED*** rgb2[2])
  ];
***REMOVED***


***REMOVED***
***REMOVED*** Adds black to the specified color, darkening it
***REMOVED*** @param {goog.color.Rgb} rgb rgb representation of the color.
***REMOVED*** @param {number} factor Number in the range [0, 1]. 0 will do nothing, while
***REMOVED***     1 will return black. If less than 0, factor will be set to 0. If greater
***REMOVED***     than 1, factor will be set to 1.
***REMOVED*** @return {!goog.color.Rgb} Combined rgb color.
***REMOVED***
goog.color.darken = function(rgb, factor) {
  var black = [0, 0, 0];
  return goog.color.blend(black, rgb, factor);
***REMOVED***


***REMOVED***
***REMOVED*** Adds white to the specified color, lightening it
***REMOVED*** @param {goog.color.Rgb} rgb rgb representation of the color.
***REMOVED*** @param {number} factor Number in the range [0, 1].  0 will do nothing, while
***REMOVED***     1 will return white. If less than 0, factor will be set to 0. If greater
***REMOVED***     than 1, factor will be set to 1.
***REMOVED*** @return {!goog.color.Rgb} Combined rgb color.
***REMOVED***
goog.color.lighten = function(rgb, factor) {
  var white = [255, 255, 255];
  return goog.color.blend(white, rgb, factor);
***REMOVED***


***REMOVED***
***REMOVED*** Find the "best" (highest-contrast) of the suggested colors for the prime
***REMOVED*** color. Uses W3C formula for judging readability and visual accessibility:
***REMOVED*** http://www.w3.org/TR/AERT#color-contrast
***REMOVED*** @param {goog.color.Rgb} prime Color represented as a rgb array.
***REMOVED*** @param {Array.<goog.color.Rgb>} suggestions Array of colors,
***REMOVED***     each representing a rgb array.
***REMOVED*** @return {!goog.color.Rgb} Highest-contrast color represented by an array..
***REMOVED***
goog.color.highContrast = function(prime, suggestions) {
  var suggestionsWithDiff = [];
  for (var i = 0; i < suggestions.length; i++) {
    suggestionsWithDiff.push({
      color: suggestions[i],
      diff: goog.color.yiqBrightnessDiff_(suggestions[i], prime) +
          goog.color.colorDiff_(suggestions[i], prime)
    });
  }
  suggestionsWithDiff.sort(function(a, b) {
    return b.diff - a.diff;
  });
  return suggestionsWithDiff[0].color;
***REMOVED***


***REMOVED***
***REMOVED*** Calculate brightness of a color according to YIQ formula (brightness is Y).
***REMOVED*** More info on YIQ here: http://en.wikipedia.org/wiki/YIQ. Helper method for
***REMOVED*** goog.color.highContrast()
***REMOVED*** @param {goog.color.Rgb} rgb Color represented by a rgb array.
***REMOVED*** @return {number} brightness (Y).
***REMOVED*** @private
***REMOVED***
goog.color.yiqBrightness_ = function(rgb) {
  return Math.round((rgb[0]***REMOVED*** 299 + rgb[1]***REMOVED*** 587 + rgb[2]***REMOVED*** 114) / 1000);
***REMOVED***


***REMOVED***
***REMOVED*** Calculate difference in brightness of two colors. Helper method for
***REMOVED*** goog.color.highContrast()
***REMOVED*** @param {goog.color.Rgb} rgb1 Color represented by a rgb array.
***REMOVED*** @param {goog.color.Rgb} rgb2 Color represented by a rgb array.
***REMOVED*** @return {number} Brightness difference.
***REMOVED*** @private
***REMOVED***
goog.color.yiqBrightnessDiff_ = function(rgb1, rgb2) {
  return Math.abs(goog.color.yiqBrightness_(rgb1) -
                  goog.color.yiqBrightness_(rgb2));
***REMOVED***


***REMOVED***
***REMOVED*** Calculate color difference between two colors. Helper method for
***REMOVED*** goog.color.highContrast()
***REMOVED*** @param {goog.color.Rgb} rgb1 Color represented by a rgb array.
***REMOVED*** @param {goog.color.Rgb} rgb2 Color represented by a rgb array.
***REMOVED*** @return {number} Color difference.
***REMOVED*** @private
***REMOVED***
goog.color.colorDiff_ = function(rgb1, rgb2) {
  return Math.abs(rgb1[0] - rgb2[0]) + Math.abs(rgb1[1] - rgb2[1]) +
      Math.abs(rgb1[2] - rgb2[2]);
***REMOVED***
