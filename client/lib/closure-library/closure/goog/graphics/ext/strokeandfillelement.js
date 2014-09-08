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
***REMOVED*** @fileoverview A thick wrapper around elements with stroke and fill.
***REMOVED*** @author robbyw@google.com (Robby Walker)
***REMOVED***


goog.provide('goog.graphics.ext.StrokeAndFillElement');

goog.require('goog.graphics.ext.Element');



***REMOVED***
***REMOVED*** Interface for a graphics element that has a stroke and fill.
***REMOVED*** This is the base interface for ellipse, rectangle and other
***REMOVED*** shape interfaces.
***REMOVED*** You should not construct objects from this constructor. Use a subclass.
***REMOVED*** @param {goog.graphics.ext.Group} group Parent for this element.
***REMOVED*** @param {goog.graphics.StrokeAndFillElement} wrapper The thin wrapper to wrap.
***REMOVED***
***REMOVED*** @extends {goog.graphics.ext.Element}
***REMOVED***
goog.graphics.ext.StrokeAndFillElement = function(group, wrapper) {
  goog.graphics.ext.Element.call(this, group, wrapper);
***REMOVED***
goog.inherits(goog.graphics.ext.StrokeAndFillElement,
    goog.graphics.ext.Element);


***REMOVED***
***REMOVED*** Sets the fill for this element.
***REMOVED*** @param {goog.graphics.Fill?} fill The fill object.
***REMOVED***
goog.graphics.ext.StrokeAndFillElement.prototype.setFill = function(fill) {
  this.getWrapper().setFill(fill);
***REMOVED***


***REMOVED***
***REMOVED*** Sets the stroke for this element.
***REMOVED*** @param {goog.graphics.Stroke?} stroke The stroke object.
***REMOVED***
goog.graphics.ext.StrokeAndFillElement.prototype.setStroke = function(stroke) {
  this.getWrapper().setStroke(stroke);
***REMOVED***


***REMOVED***
***REMOVED*** Redraw the rectangle.  Called when the coordinate system is changed.
***REMOVED*** @protected
***REMOVED*** @override
***REMOVED***
goog.graphics.ext.StrokeAndFillElement.prototype.redraw = function() {
  this.getWrapper().reapplyStroke();
***REMOVED***
