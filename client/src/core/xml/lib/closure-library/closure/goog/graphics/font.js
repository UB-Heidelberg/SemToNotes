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
***REMOVED*** @fileoverview Represents a font to be used with a Renderer.
***REMOVED*** @author arv@google.com (Erik Arvidsson)
***REMOVED*** @see ../demos/graphics/basicelements.html
***REMOVED***


goog.provide('goog.graphics.Font');



***REMOVED***
***REMOVED*** This class represents a font to be used with a renderer.
***REMOVED*** @param {number} size  The font size.
***REMOVED*** @param {string} family  The font family.
***REMOVED***
***REMOVED***
goog.graphics.Font = function(size, family) {
 ***REMOVED*****REMOVED***
  ***REMOVED*** Font size.
  ***REMOVED*** @type {number}
 ***REMOVED*****REMOVED***
  this.size = size;
  // TODO(arv): Is this in pixels or drawing units based on the coord size?

 ***REMOVED*****REMOVED***
  ***REMOVED*** The name of the font family to use, can be a comma separated string.
  ***REMOVED*** @type {string}
 ***REMOVED*****REMOVED***
  this.family = family;
***REMOVED***


***REMOVED***
***REMOVED*** Indication if text should be bolded
***REMOVED*** @type {boolean}
***REMOVED***
goog.graphics.Font.prototype.bold = false;


***REMOVED***
***REMOVED*** Indication if text should be in italics
***REMOVED*** @type {boolean}
***REMOVED***
goog.graphics.Font.prototype.italic = false;
