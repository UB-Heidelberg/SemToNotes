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
***REMOVED*** @fileoverview Represents a gradient to be used with a Graphics implementor.
***REMOVED*** @author arv@google.com (Erik Arvidsson)
***REMOVED***


goog.provide('goog.graphics.LinearGradient');


goog.require('goog.asserts');
goog.require('goog.graphics.Fill');



***REMOVED***
***REMOVED*** Creates an immutable linear gradient fill object.
***REMOVED***
***REMOVED*** @param {number} x1 Start X position of the gradient.
***REMOVED*** @param {number} y1 Start Y position of the gradient.
***REMOVED*** @param {number} x2 End X position of the gradient.
***REMOVED*** @param {number} y2 End Y position of the gradient.
***REMOVED*** @param {string} color1 Start color of the gradient.
***REMOVED*** @param {string} color2 End color of the gradient.
***REMOVED*** @param {?number=} opt_opacity1 Start opacity of the gradient, both or neither
***REMOVED***     of opt_opacity1 and opt_opacity2 have to be set.
***REMOVED*** @param {?number=} opt_opacity2 End opacity of the gradient.
***REMOVED***
***REMOVED*** @extends {goog.graphics.Fill}
***REMOVED***
goog.graphics.LinearGradient =
    function(x1, y1, x2, y2, color1, color2, opt_opacity1, opt_opacity2) {
 ***REMOVED*****REMOVED***
  ***REMOVED*** Start X position of the gradient.
  ***REMOVED*** @type {number}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.x1_ = x1;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Start Y position of the gradient.
  ***REMOVED*** @type {number}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.y1_ = y1;

 ***REMOVED*****REMOVED***
  ***REMOVED*** End X position of the gradient.
  ***REMOVED*** @type {number}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.x2_ = x2;

 ***REMOVED*****REMOVED***
  ***REMOVED*** End Y position of the gradient.
  ***REMOVED*** @type {number}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.y2_ = y2;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Start color of the gradient.
  ***REMOVED*** @type {string}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.color1_ = color1;

 ***REMOVED*****REMOVED***
  ***REMOVED*** End color of the gradient.
  ***REMOVED*** @type {string}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.color2_ = color2;

  goog.asserts.assert(
      goog.isNumber(opt_opacity1) == goog.isNumber(opt_opacity2),
      'Both or neither of opt_opacity1 and opt_opacity2 have to be set.');

 ***REMOVED*****REMOVED***
  ***REMOVED*** Start opacity of the gradient.
  ***REMOVED*** @type {?number}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.opacity1_ = goog.isDef(opt_opacity1) ? opt_opacity1 : null;

 ***REMOVED*****REMOVED***
  ***REMOVED*** End opacity of the gradient.
  ***REMOVED*** @type {?number}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.opacity2_ = goog.isDef(opt_opacity2) ? opt_opacity2 : null;
***REMOVED***
goog.inherits(goog.graphics.LinearGradient, goog.graphics.Fill);


***REMOVED***
***REMOVED*** @return {number} The start X position of the gradient.
***REMOVED***
goog.graphics.LinearGradient.prototype.getX1 = function() {
  return this.x1_;
***REMOVED***


***REMOVED***
***REMOVED*** @return {number} The start Y position of the gradient.
***REMOVED***
goog.graphics.LinearGradient.prototype.getY1 = function() {
  return this.y1_;
***REMOVED***


***REMOVED***
***REMOVED*** @return {number} The end X position of the gradient.
***REMOVED***
goog.graphics.LinearGradient.prototype.getX2 = function() {
  return this.x2_;
***REMOVED***


***REMOVED***
***REMOVED*** @return {number} The end Y position of the gradient.
***REMOVED***
goog.graphics.LinearGradient.prototype.getY2 = function() {
  return this.y2_;
***REMOVED***


***REMOVED***
***REMOVED*** @return {string} The start color of the gradient.
***REMOVED***
goog.graphics.LinearGradient.prototype.getColor1 = function() {
  return this.color1_;
***REMOVED***


***REMOVED***
***REMOVED*** @return {string} The end color of the gradient.
***REMOVED***
goog.graphics.LinearGradient.prototype.getColor2 = function() {
  return this.color2_;
***REMOVED***


***REMOVED***
***REMOVED*** @return {?number} The start opacity of the gradient.
***REMOVED***
goog.graphics.LinearGradient.prototype.getOpacity1 = function() {
  return this.opacity1_;
***REMOVED***


***REMOVED***
***REMOVED*** @return {?number} The end opacity of the gradient.
***REMOVED***
goog.graphics.LinearGradient.prototype.getOpacity2 = function() {
  return this.opacity2_;
***REMOVED***
