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
***REMOVED*** @fileoverview A thin wrapper around the DOM element for graphics groups.
***REMOVED*** @author arv@google.com (Erik Arvidsson)
***REMOVED*** @author yoah@google.com (Yoah Bar-David)
***REMOVED***


goog.provide('goog.graphics.GroupElement');

goog.require('goog.graphics.Element');



***REMOVED***
***REMOVED*** Interface for a graphics group element.
***REMOVED*** You should not construct objects from this constructor. The graphics
***REMOVED*** will return the object for you.
***REMOVED*** @param {Element} element The DOM element to wrap.
***REMOVED*** @param {goog.graphics.AbstractGraphics} graphics The graphics creating
***REMOVED***     this element.
***REMOVED***
***REMOVED*** @extends {goog.graphics.Element}
***REMOVED*** @deprecated goog.graphics is deprecated. It existed to abstract over browser
***REMOVED***     differences before the canvas tag was widely supported.  See
***REMOVED***     http://en.wikipedia.org/wiki/Canvas_element for details.
***REMOVED***
goog.graphics.GroupElement = function(element, graphics) {
  goog.graphics.Element.call(this, element, graphics);
***REMOVED***
goog.inherits(goog.graphics.GroupElement, goog.graphics.Element);


***REMOVED***
***REMOVED*** Remove all drawing elements from the group.
***REMOVED***
goog.graphics.GroupElement.prototype.clear = goog.abstractMethod;


***REMOVED***
***REMOVED*** Set the size of the group element.
***REMOVED*** @param {number|string} width The width of the group element.
***REMOVED*** @param {number|string} height The height of the group element.
***REMOVED***
goog.graphics.GroupElement.prototype.setSize = goog.abstractMethod;
