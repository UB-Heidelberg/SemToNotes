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
***REMOVED*** @fileoverview Definition of the Popup class.
***REMOVED***
***REMOVED*** @see ../demos/popup.html
***REMOVED***

goog.provide('goog.ui.Popup');
goog.provide('goog.ui.Popup.AbsolutePosition');
goog.provide('goog.ui.Popup.AnchoredPosition');
goog.provide('goog.ui.Popup.AnchoredViewPortPosition');
goog.provide('goog.ui.Popup.ClientPosition');
goog.provide('goog.ui.Popup.Corner');
goog.provide('goog.ui.Popup.Overflow');
goog.provide('goog.ui.Popup.ViewPortClientPosition');
goog.provide('goog.ui.Popup.ViewPortPosition');

goog.require('goog.math.Box');
goog.require('goog.positioning.AbsolutePosition');
goog.require('goog.positioning.AnchoredPosition');
goog.require('goog.positioning.AnchoredViewportPosition');
goog.require('goog.positioning.ClientPosition');
goog.require('goog.positioning.Corner');
goog.require('goog.positioning.Overflow');
goog.require('goog.positioning.ViewportClientPosition');
goog.require('goog.positioning.ViewportPosition');
goog.require('goog.style');
goog.require('goog.ui.PopupBase');



***REMOVED***
***REMOVED*** The Popup class provides functionality for displaying an absolutely
***REMOVED*** positioned element at a particular location in the window. It's designed to
***REMOVED*** be used as the foundation for building controls like a menu or tooltip. The
***REMOVED*** Popup class includes functionality for displaying a Popup near adjacent to
***REMOVED*** an anchor element.
***REMOVED***
***REMOVED*** This works cross browser and thus does not use IE's createPopup feature
***REMOVED*** which supports extending outside the edge of the brower window.
***REMOVED***
***REMOVED*** @param {Element=} opt_element A DOM element for the popup.
***REMOVED*** @param {goog.positioning.AbstractPosition=} opt_position A positioning helper
***REMOVED***     object.
***REMOVED***
***REMOVED*** @extends {goog.ui.PopupBase}
***REMOVED***
goog.ui.Popup = function(opt_element, opt_position) {
 ***REMOVED*****REMOVED***
  ***REMOVED*** Corner of the popup to used in the positioning algorithm.
  ***REMOVED***
  ***REMOVED*** @type {goog.positioning.Corner}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.popupCorner_ = goog.positioning.Corner.TOP_START;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Positioning helper object.
  ***REMOVED***
  ***REMOVED*** @type {goog.positioning.AbstractPosition|undefined}
  ***REMOVED*** @protected
  ***REMOVED*** @suppress {underscore|visibility}
 ***REMOVED*****REMOVED***
  this.position_ = opt_position || undefined;
  goog.ui.PopupBase.call(this, opt_element);
***REMOVED***
goog.inherits(goog.ui.Popup, goog.ui.PopupBase);


***REMOVED***
***REMOVED*** Enum for representing an element corner for positioning the popup.
***REMOVED***
***REMOVED*** @enum {number}
***REMOVED***
***REMOVED*** @deprecated Use {@link goog.positioning.Corner} instead, this alias will be
***REMOVED***     removed at the end of Q1 2009.
***REMOVED***
goog.ui.Popup.Corner = goog.positioning.Corner;


***REMOVED***
***REMOVED*** Enum for representing position handling in cases where the element would be
***REMOVED*** positioned outside the viewport.
***REMOVED***
***REMOVED*** @enum {number}
***REMOVED***
***REMOVED*** @deprecated Use {@link goog.positioning.Overflow} instead, this alias will be
***REMOVED***     removed at the end of Q1 2009.
***REMOVED***
goog.ui.Popup.Overflow = goog.positioning.Overflow;


***REMOVED***
***REMOVED*** Margin for the popup used in positioning algorithms.
***REMOVED***
***REMOVED*** @type {goog.math.Box|undefined}
***REMOVED*** @private
***REMOVED***
goog.ui.Popup.prototype.margin_;


***REMOVED***
***REMOVED*** Returns the corner of the popup to used in the positioning algorithm.
***REMOVED***
***REMOVED*** @return {goog.positioning.Corner} The popup corner used for positioning.
***REMOVED***
goog.ui.Popup.prototype.getPinnedCorner = function() {
  return this.popupCorner_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the corner of the popup to used in the positioning algorithm.
***REMOVED***
***REMOVED*** @param {goog.positioning.Corner} corner The popup corner used for
***REMOVED***     positioning.
***REMOVED***
goog.ui.Popup.prototype.setPinnedCorner = function(corner) {
  this.popupCorner_ = corner;
  if (this.isVisible()) {
    this.reposition();
  }
***REMOVED***


***REMOVED***
***REMOVED*** @return {goog.positioning.AbstractPosition} The position helper object
***REMOVED***     associated with the popup.
***REMOVED***
goog.ui.Popup.prototype.getPosition = function() {
  return this.position_ || null;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the position helper object associated with the popup.
***REMOVED***
***REMOVED*** @param {goog.positioning.AbstractPosition} position A position helper object.
***REMOVED***
goog.ui.Popup.prototype.setPosition = function(position) {
  this.position_ = position || undefined;
  if (this.isVisible()) {
    this.reposition();
  }
***REMOVED***


***REMOVED***
***REMOVED*** Returns the margin to place around the popup.
***REMOVED***
***REMOVED*** @return {goog.math.Box?} The margin.
***REMOVED***
goog.ui.Popup.prototype.getMargin = function() {
  return this.margin_ || null;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the margin to place around the popup.
***REMOVED***
***REMOVED*** @param {goog.math.Box|number|null} arg1 Top value or Box.
***REMOVED*** @param {number=} opt_arg2 Right value.
***REMOVED*** @param {number=} opt_arg3 Bottom value.
***REMOVED*** @param {number=} opt_arg4 Left value.
***REMOVED***
goog.ui.Popup.prototype.setMargin = function(arg1, opt_arg2, opt_arg3,
                                             opt_arg4) {
  if (arg1 == null || arg1 instanceof goog.math.Box) {
    this.margin_ = arg1;
  } else {
    this.margin_ = new goog.math.Box(arg1,
       ***REMOVED*****REMOVED*** @type {number}***REMOVED*** (opt_arg2),
       ***REMOVED*****REMOVED*** @type {number}***REMOVED*** (opt_arg3),
       ***REMOVED*****REMOVED*** @type {number}***REMOVED*** (opt_arg4));
  }
  if (this.isVisible()) {
    this.reposition();
  }
***REMOVED***


***REMOVED***
***REMOVED*** Repositions the popup according to the current state.
***REMOVED*** @override
***REMOVED***
goog.ui.Popup.prototype.reposition = function() {
  if (!this.position_) {
    return;
  }

  var hideForPositioning = !this.isVisible() &&
      this.getType() != goog.ui.PopupBase.Type.MOVE_OFFSCREEN;
  var el = this.getElement();
  if (hideForPositioning) {
    el.style.visibility = 'hidden';
    goog.style.setElementShown(el, true);
  }

  this.position_.reposition(el, this.popupCorner_, this.margin_);

  if (hideForPositioning) {
    // NOTE(eae): The visibility property is reset to 'visible' by the show_
    // method in PopupBase. Resetting it here causes flickering in some
    // situations, even if set to visible after the display property has been
    // set to none by the call below.
    goog.style.setElementShown(el, false);
  }
***REMOVED***



***REMOVED***
***REMOVED*** Encapsulates a popup position where the popup is anchored at a corner of
***REMOVED*** an element.
***REMOVED***
***REMOVED*** When using AnchoredPosition, it is recommended that the popup element
***REMOVED*** specified in the Popup constructor or Popup.setElement be absolutely
***REMOVED*** positioned.
***REMOVED***
***REMOVED*** @param {Element} element The element to anchor the popup at.
***REMOVED*** @param {goog.positioning.Corner} corner The corner of the element to anchor
***REMOVED***     the popup at.
***REMOVED***
***REMOVED*** @extends {goog.positioning.AbstractPosition}
***REMOVED***
***REMOVED*** @deprecated Use {@link goog.positioning.AnchoredPosition} instead, this
***REMOVED***     alias will be removed at the end of Q1 2009.
***REMOVED*** @final
***REMOVED***
goog.ui.Popup.AnchoredPosition = goog.positioning.AnchoredPosition;



***REMOVED***
***REMOVED*** Encapsulates a popup position where the popup is anchored at a corner of
***REMOVED*** an element. The corners are swapped if dictated by the viewport. For instance
***REMOVED*** if a popup is anchored with its top left corner to the bottom left corner of
***REMOVED*** the anchor the popup is either displayed below the anchor (as specified) or
***REMOVED*** above it if there's not enough room to display it below.
***REMOVED***
***REMOVED*** When using AnchoredPosition, it is recommended that the popup element
***REMOVED*** specified in the Popup constructor or Popup.setElement be absolutely
***REMOVED*** positioned.
***REMOVED***
***REMOVED*** @param {Element} element The element to anchor the popup at.
***REMOVED*** @param {goog.positioning.Corner} corner The corner of the element to anchor
***REMOVED***    the popup at.
***REMOVED*** @param {boolean=} opt_adjust Whether the positioning should be adjusted until
***REMOVED***    the element fits inside the viewport even if that means that the anchored
***REMOVED***    corners are ignored.
***REMOVED***
***REMOVED*** @extends {goog.ui.Popup.AnchoredPosition}
***REMOVED***
***REMOVED*** @deprecated Use {@link goog.positioning.AnchoredViewportPosition} instead,
***REMOVED***     this alias will be removed at the end of Q1 2009.
***REMOVED***
goog.ui.Popup.AnchoredViewPortPosition =
    goog.positioning.AnchoredViewportPosition;



***REMOVED***
***REMOVED*** Encapsulates a popup position where the popup absolutely positioned by
***REMOVED*** setting the left/top style elements directly to the specified values.
***REMOVED*** The position is generally relative to the element's offsetParent. Normally,
***REMOVED*** this is the document body, but can be another element if the popup element
***REMOVED*** is scoped by an element with relative position.
***REMOVED***
***REMOVED*** @param {number|!goog.math.Coordinate} arg1 Left position or coordinate.
***REMOVED*** @param {number=} opt_arg2 Top position.
***REMOVED***
***REMOVED*** @extends {goog.positioning.AbstractPosition}
***REMOVED***
***REMOVED*** @deprecated Use {@link goog.positioning.AbsolutePosition} instead, this alias
***REMOVED***     will be removed at the end of Q1 2009.
***REMOVED*** @final
***REMOVED***
goog.ui.Popup.AbsolutePosition = goog.positioning.AbsolutePosition;



***REMOVED***
***REMOVED*** Encapsulates a popup position where the popup is positioned according to
***REMOVED*** coordinates relative to the  element's view port (page). This calculates the
***REMOVED*** correct position to use even if the element is relatively positioned to some
***REMOVED*** other element.
***REMOVED***
***REMOVED*** @param {number|!goog.math.Coordinate} arg1 Left position or coordinate.
***REMOVED*** @param {number=} opt_arg2 Top position.
***REMOVED***
***REMOVED*** @extends {goog.ui.Popup.AbsolutePosition}
***REMOVED***
***REMOVED*** @deprecated Use {@link goog.positioning.ViewPortPosition} instead, this alias
***REMOVED***     will be removed at the end of Q1 2009.
***REMOVED***
goog.ui.Popup.ViewPortPosition = goog.positioning.ViewportPosition;



***REMOVED***
***REMOVED*** Encapsulates a popup position where the popup is positioned relative to the
***REMOVED*** window (client) coordinates. This calculates the correct position to
***REMOVED*** use even if the element is relatively positioned to some other element. This
***REMOVED*** is for trying to position an element at the spot of the mouse cursor in
***REMOVED*** a MOUSEMOVE event. Just use the event.clientX and event.clientY as the
***REMOVED*** parameters.
***REMOVED***
***REMOVED*** @param {number|!goog.math.Coordinate} arg1 Left position or coordinate.
***REMOVED*** @param {number=} opt_arg2 Top position.
***REMOVED***
***REMOVED*** @extends {goog.ui.Popup.AbsolutePosition}
***REMOVED***
***REMOVED*** @deprecated Use {@link goog.positioning.ClientPosition} instead, this alias
***REMOVED***     will be removed at the end of Q1 2009.
***REMOVED*** @final
***REMOVED***
goog.ui.Popup.ClientPosition = goog.positioning.ClientPosition;



***REMOVED***
***REMOVED*** Encapsulates a popup position where the popup is positioned relative to the
***REMOVED*** window (client) coordinates, and made to stay within the viewport.
***REMOVED***
***REMOVED*** @param {number|!goog.math.Coordinate} arg1 Left position or coordinate.
***REMOVED*** @param {number=} opt_arg2 Top position if arg1 is a number representing the
***REMOVED***     left position, ignored otherwise.
***REMOVED***
***REMOVED*** @extends {goog.ui.Popup.ClientPosition}
***REMOVED***
***REMOVED*** @deprecated Use {@link goog.positioning.ViewPortClientPosition} instead, this
***REMOVED***     alias will be removed at the end of Q1 2009.
***REMOVED***
goog.ui.Popup.ViewPortClientPosition = goog.positioning.ViewportClientPosition;
