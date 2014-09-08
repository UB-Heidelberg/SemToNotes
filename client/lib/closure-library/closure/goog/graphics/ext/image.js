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
***REMOVED*** @fileoverview A thick wrapper around images.
***REMOVED*** @author robbyw@google.com (Robby Walker)
***REMOVED***


goog.provide('goog.graphics.ext.Image');

goog.require('goog.graphics.ext.Element');



***REMOVED***
***REMOVED*** Wrapper for a graphics image element.
***REMOVED*** @param {goog.graphics.ext.Group} group Parent for this element.
***REMOVED*** @param {string} src The path to the image to display.
***REMOVED***
***REMOVED*** @extends {goog.graphics.ext.Element}
***REMOVED*** @final
***REMOVED***
goog.graphics.ext.Image = function(group, src) {
  // Initialize with some stock values.
  var wrapper = group.getGraphicsImplementation().drawImage(0, 0, 1, 1, src,
      group.getWrapper());
  goog.graphics.ext.Element.call(this, group, wrapper);
***REMOVED***
goog.inherits(goog.graphics.ext.Image, goog.graphics.ext.Element);


***REMOVED***
***REMOVED*** Redraw the image.  Called when the coordinate system is changed.
***REMOVED*** @protected
***REMOVED*** @override
***REMOVED***
goog.graphics.ext.Image.prototype.redraw = function() {
  goog.graphics.ext.Image.superClass_.redraw.call(this);

  // Our position is already handled bu transform_.
  this.getWrapper().setSize(this.getWidth(), this.getHeight());
***REMOVED***


***REMOVED***
***REMOVED*** Update the source of the image.
***REMOVED*** @param {string} src  Source of the image.
***REMOVED***
goog.graphics.ext.Image.prototype.setSource = function(src) {
  this.getWrapper().setSource(src);
***REMOVED***
