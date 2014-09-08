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
***REMOVED*** @fileoverview Abstract base class for positioning implementations.
***REMOVED***
***REMOVED*** @author eae@google.com (Emil A Eklund)
***REMOVED***

goog.provide('goog.positioning.AbstractPosition');

goog.require('goog.math.Box');
goog.require('goog.math.Size');
goog.require('goog.positioning.Corner');



***REMOVED***
***REMOVED*** Abstract position object. Encapsulates position and overflow handling.
***REMOVED***
***REMOVED***
***REMOVED***
goog.positioning.AbstractPosition = function() {***REMOVED***


***REMOVED***
***REMOVED*** Repositions the element. Abstract method, should be overloaded.
***REMOVED***
***REMOVED*** @param {Element} movableElement Element to position.
***REMOVED*** @param {goog.positioning.Corner} corner Corner of the movable element that
***REMOVED***     should be positioned adjacent to the anchored element.
***REMOVED*** @param {goog.math.Box=} opt_margin A margin specified in pixels.
***REMOVED*** @param {goog.math.Size=} opt_preferredSize PreferredSize of the
***REMOVED***     movableElement.
***REMOVED***
goog.positioning.AbstractPosition.prototype.reposition =
    function(movableElement, corner, opt_margin, opt_preferredSize) {***REMOVED*****REMOVED***
