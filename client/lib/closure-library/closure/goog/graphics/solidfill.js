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
***REMOVED*** @fileoverview Represents a solid color fill goog.graphics.
***REMOVED*** @author arv@google.com (Erik Arvidsson)
***REMOVED***


goog.provide('goog.graphics.SolidFill');


goog.require('goog.graphics.Fill');



***REMOVED***
***REMOVED*** Creates an immutable solid color fill object.
***REMOVED***
***REMOVED*** @param {string} color The color of the background.
***REMOVED*** @param {number=} opt_opacity The opacity of the background fill. The value
***REMOVED***    must be greater than or equal to zero (transparent) and less than or
***REMOVED***    equal to 1 (opaque).
***REMOVED***
***REMOVED*** @extends {goog.graphics.Fill}
***REMOVED*** @deprecated goog.graphics is deprecated. It existed to abstract over browser
***REMOVED***     differences before the canvas tag was widely supported.  See
***REMOVED***     http://en.wikipedia.org/wiki/Canvas_element for details.
***REMOVED***
goog.graphics.SolidFill = function(color, opt_opacity) {
 ***REMOVED*****REMOVED***
  ***REMOVED*** The color with which to fill.
  ***REMOVED*** @type {string}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.color_ = color;


 ***REMOVED*****REMOVED***
  ***REMOVED*** The opacity of the fill.
  ***REMOVED*** @type {number}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.opacity_ = opt_opacity == null ? 1.0 : opt_opacity;
***REMOVED***
goog.inherits(goog.graphics.SolidFill, goog.graphics.Fill);


***REMOVED***
***REMOVED*** @return {string} The color of this fill.
***REMOVED***
goog.graphics.SolidFill.prototype.getColor = function() {
  return this.color_;
***REMOVED***


***REMOVED***
***REMOVED*** @return {number} The opacity of this fill.
***REMOVED***
goog.graphics.SolidFill.prototype.getOpacity = function() {
  return this.opacity_;
***REMOVED***
