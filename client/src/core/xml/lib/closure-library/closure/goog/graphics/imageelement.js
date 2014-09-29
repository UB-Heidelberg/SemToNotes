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
***REMOVED*** @fileoverview A thin wrapper around the DOM element for images.
***REMOVED***


goog.provide('goog.graphics.ImageElement');

goog.require('goog.graphics.Element');



***REMOVED***
***REMOVED*** Interface for a graphics image element.
***REMOVED*** You should not construct objects from this constructor. Instead,
***REMOVED*** you should use {@code goog.graphics.Graphics.drawImage} and it
***REMOVED*** will return an implementation of this interface for you.
***REMOVED***
***REMOVED*** @param {Element} element The DOM element to wrap.
***REMOVED*** @param {goog.graphics.AbstractGraphics} graphics The graphics creating
***REMOVED***     this element.
***REMOVED***
***REMOVED*** @extends {goog.graphics.Element}
***REMOVED***
goog.graphics.ImageElement = function(element, graphics) {
  goog.graphics.Element.call(this, element, graphics);
***REMOVED***
goog.inherits(goog.graphics.ImageElement, goog.graphics.Element);


***REMOVED***
***REMOVED*** Update the position of the image.
***REMOVED***
***REMOVED*** @param {number} x X coordinate (left).
***REMOVED*** @param {number} y Y coordinate (top).
***REMOVED***
goog.graphics.ImageElement.prototype.setPosition = goog.abstractMethod;


***REMOVED***
***REMOVED*** Update the size of the image.
***REMOVED***
***REMOVED*** @param {number} width Width of image.
***REMOVED*** @param {number} height Height of image.
***REMOVED***
goog.graphics.ImageElement.prototype.setSize = goog.abstractMethod;


***REMOVED***
***REMOVED*** Update the source of the image.
***REMOVED*** @param {string} src Source of the image.
***REMOVED***
goog.graphics.ImageElement.prototype.setSource = goog.abstractMethod;
