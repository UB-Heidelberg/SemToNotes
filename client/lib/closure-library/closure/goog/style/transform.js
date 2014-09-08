// Copyright 2014 The Closure Library Authors. All Rights Reserved.
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
***REMOVED*** @fileoverview Utility methods to deal with CSS3 transforms programmatically.
***REMOVED***

goog.provide('goog.style.transform');

goog.require('goog.functions');
goog.require('goog.math.Coordinate');
goog.require('goog.style');
goog.require('goog.userAgent');
goog.require('goog.userAgent.product.isVersion');


***REMOVED***
***REMOVED*** Whether CSS3 transform translate() is supported. IE 9 supports 2D transforms
***REMOVED*** and IE 10 supports 3D transforms. IE 8 supports neither.
***REMOVED*** @return {boolean} Whether the current environment supports CSS3 transforms.
***REMOVED***
goog.style.transform.isSupported = goog.functions.cacheReturnValue(function() {
  return !goog.userAgent.IE || goog.userAgent.product.isVersion(9);
});


***REMOVED***
***REMOVED*** Whether CSS3 transform translate3d() is supported. If the current browser
***REMOVED*** supports this transform strategy.
***REMOVED*** @return {boolean} Whether the current environment supports CSS3 transforms.
***REMOVED***
goog.style.transform.is3dSupported =
    goog.functions.cacheReturnValue(function() {
  return goog.userAgent.WEBKIT ||
      (goog.userAgent.GECKO && goog.userAgent.product.isVersion(10)) ||
      (goog.userAgent.IE && goog.userAgent.product.isVersion(10));
});


***REMOVED***
***REMOVED*** Returns the x,y translation component of any CSS transforms applied to the
***REMOVED*** element, in pixels.
***REMOVED***
***REMOVED*** @param {!Element} element The element to get the translation of.
***REMOVED*** @return {!goog.math.Coordinate} The CSS translation of the element in px.
***REMOVED***
goog.style.transform.getTranslation = function(element) {
  var transform = goog.style.getComputedTransform(element);
  var matrixConstructor = goog.style.transform.matrixConstructor_();
  if (transform && matrixConstructor) {
    var matrix = new matrixConstructor(transform);
    if (matrix) {
      return new goog.math.Coordinate(matrix.m41, matrix.m42);
    }
  }
  return new goog.math.Coordinate(0, 0);
***REMOVED***


***REMOVED***
***REMOVED*** Translates an element's position using the CSS3 transform property.
***REMOVED*** @param {Element} element The element to translate.
***REMOVED*** @param {number} x The horizontal translation.
***REMOVED*** @param {number} y The vertical translation.
***REMOVED*** @return {boolean} Whether the CSS translation was set.
***REMOVED***
goog.style.transform.setTranslation = function(element, x, y) {
  if (!goog.style.transform.isSupported()) {
    return false;
  }
  // TODO(user): After http://crbug.com/324107 is fixed, it will be faster to
  // use something like: translation = new CSSMatrix().translate(x, y, 0);
  var translation = goog.style.transform.is3dSupported() ?
      'translate3d(' + x + 'px,' + y + 'px,' + '0px)' :
      'translate(' + x + 'px,' + y + 'px)';
  goog.style.setStyle(element, 'transform', translation);
  return true;
***REMOVED***


***REMOVED***
***REMOVED*** Gets the constructor for a CSSMatrix object.
***REMOVED*** @return {function(new:CSSMatrix, string)?} A constructor for a CSSMatrix
***REMOVED***     object (or null).
***REMOVED*** @private
***REMOVED***
goog.style.transform.matrixConstructor_ =
    goog.functions.cacheReturnValue(function() {
  // TODO(user): Unless these are accessed from the default namespace the
  // compiler will rename them. A better way is to use goog.global and prevent
  // renaming.
  if (typeof WebKitCSSMatrix !== undefined) {
    return WebKitCSSMatrix;
  }
  if (typeof MSCSSMatrix !== undefined) {
    return MSCSSMatrix;
  }
  if (typeof CSSMatrix !== undefined) {
    return CSSMatrix;
  }
  return null;
});
