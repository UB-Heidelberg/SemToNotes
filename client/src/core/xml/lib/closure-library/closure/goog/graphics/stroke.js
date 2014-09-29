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
***REMOVED*** @fileoverview Represents a stroke object for goog.graphics.
***REMOVED*** @author arv@google.com (Erik Arvidsson)
***REMOVED***


goog.provide('goog.graphics.Stroke');



***REMOVED***
***REMOVED*** Creates an immutable stroke object.
***REMOVED***
***REMOVED*** @param {number|string} width The width of the stroke.
***REMOVED*** @param {string} color The color of the stroke.
***REMOVED***
***REMOVED***
goog.graphics.Stroke = function(width, color) {
 ***REMOVED*****REMOVED***
  ***REMOVED*** The width of the stroke.
  ***REMOVED*** @type {number|string}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.width_ = width;


 ***REMOVED*****REMOVED***
  ***REMOVED*** The color with which to fill.
  ***REMOVED*** @type {string}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.color_ = color;
***REMOVED***


***REMOVED***
***REMOVED*** @return {number|string} The width of this stroke.
***REMOVED***
goog.graphics.Stroke.prototype.getWidth = function() {
  return this.width_;
***REMOVED***


***REMOVED***
***REMOVED*** @return {string} The color of this stroke.
***REMOVED***
goog.graphics.Stroke.prototype.getColor = function() {
  return this.color_;
***REMOVED***
