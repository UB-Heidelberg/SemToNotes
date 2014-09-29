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
***REMOVED*** @fileoverview Advanced tooltip widget implementation.
***REMOVED***
***REMOVED*** @author eae@google.com (Emil A Eklund)
***REMOVED*** @see ../demos/advancedtooltip.html
***REMOVED***

goog.provide('goog.ui.AdvancedTooltip');

***REMOVED***
goog.require('goog.math.Coordinate');
goog.require('goog.ui.Tooltip');
goog.require('goog.userAgent');



***REMOVED***
***REMOVED*** Advanced tooltip widget with cursor tracking abilities. Works like a regular
***REMOVED*** tooltip but can track the cursor position and direction to determine if the
***REMOVED*** tooltip should be dismissed or remain open.
***REMOVED***
***REMOVED*** @param {Element|string=} opt_el Element to display tooltip for, either
***REMOVED***     element reference or string id.
***REMOVED*** @param {?string=} opt_str Text message to display in tooltip.
***REMOVED*** @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper.
***REMOVED***
***REMOVED*** @extends {goog.ui.Tooltip}
***REMOVED***
goog.ui.AdvancedTooltip = function(opt_el, opt_str, opt_domHelper) {
  goog.ui.Tooltip.call(this, opt_el, opt_str, opt_domHelper);
***REMOVED***
goog.inherits(goog.ui.AdvancedTooltip, goog.ui.Tooltip);


***REMOVED***
***REMOVED*** Whether to track the cursor and thereby close the tooltip if it moves away
***REMOVED*** from the tooltip and keep it open if it moves towards it.
***REMOVED***
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.ui.AdvancedTooltip.prototype.cursorTracking_ = false;


***REMOVED***
***REMOVED*** Delay in milliseconds before tooltips are hidden if cursor tracking is
***REMOVED*** enabled and the cursor is moving away from the tooltip.
***REMOVED***
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.ui.AdvancedTooltip.prototype.cursorTrackingHideDelayMs_ = 100;


***REMOVED***
***REMOVED*** Box object representing a margin around the tooltip where the cursor is
***REMOVED*** allowed without dismissing the tooltip.
***REMOVED***
***REMOVED*** @type {goog.math.Box}
***REMOVED*** @private
***REMOVED***
goog.ui.AdvancedTooltip.prototype.hotSpotPadding_;


***REMOVED***
***REMOVED*** Bounding box.
***REMOVED***
***REMOVED*** @type {goog.math.Box}
***REMOVED*** @private
***REMOVED***
goog.ui.AdvancedTooltip.prototype.boundingBox_;


***REMOVED***
***REMOVED*** Anchor bounding box.
***REMOVED***
***REMOVED*** @type {goog.math.Box}
***REMOVED*** @private
***REMOVED***
goog.ui.AdvancedTooltip.prototype.anchorBox_;


***REMOVED***
***REMOVED*** Whether the cursor tracking is active.
***REMOVED***
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.ui.AdvancedTooltip.prototype.tracking_ = false;


***REMOVED***
***REMOVED*** Sets margin around the tooltip where the cursor is allowed without dismissing
***REMOVED*** the tooltip.
***REMOVED***
***REMOVED*** @param {goog.math.Box=} opt_box The margin around the tooltip.
***REMOVED***
goog.ui.AdvancedTooltip.prototype.setHotSpotPadding = function(opt_box) {
  this.hotSpotPadding_ = opt_box || null;
***REMOVED***


***REMOVED***
***REMOVED*** @return {goog.math.Box} box The margin around the tooltip where the cursor is
***REMOVED***     allowed without dismissing the tooltip.
***REMOVED***
goog.ui.AdvancedTooltip.prototype.getHotSpotPadding = function() {
  return this.hotSpotPadding_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets whether to track the cursor and thereby close the tooltip if it moves
***REMOVED*** away from the tooltip and keep it open if it moves towards it.
***REMOVED***
***REMOVED*** @param {boolean} b Whether to track the cursor.
***REMOVED***
goog.ui.AdvancedTooltip.prototype.setCursorTracking = function(b) {
  this.cursorTracking_ = b;
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} Whether to track the cursor and thereby close the tooltip
***REMOVED***     if it moves away from the tooltip and keep it open if it moves towards
***REMOVED***     it.
***REMOVED***
goog.ui.AdvancedTooltip.prototype.getCursorTracking = function() {
  return this.cursorTracking_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets delay in milliseconds before tooltips are hidden if cursor tracking is
***REMOVED*** enabled and the cursor is moving away from the tooltip.
***REMOVED***
***REMOVED*** @param {number} delay The delay in milliseconds.
***REMOVED***
goog.ui.AdvancedTooltip.prototype.setCursorTrackingHideDelayMs =
    function(delay) {
  this.cursorTrackingHideDelayMs_ = delay;
***REMOVED***


***REMOVED***
***REMOVED*** @return {number} The delay in milliseconds before tooltips are hidden if
***REMOVED***     cursor tracking is enabled and the cursor is moving away from the
***REMOVED***     tooltip.
***REMOVED***
goog.ui.AdvancedTooltip.prototype.getCursorTrackingHideDelayMs = function() {
  return this.cursorTrackingHideDelayMs_;
***REMOVED***


***REMOVED***
***REMOVED*** Called after the popup is shown.
***REMOVED*** @protected
***REMOVED*** @suppress {underscore}
***REMOVED*** @override
***REMOVED***
goog.ui.AdvancedTooltip.prototype.onShow_ = function() {
  goog.ui.AdvancedTooltip.superClass_.onShow_.call(this);

  this.boundingBox_ = goog.style.getBounds(this.getElement()).toBox();
  if (this.anchor) {
    this.anchorBox_ = goog.style.getBounds(this.anchor).toBox();
  }

  this.tracking_ = this.cursorTracking_;
***REMOVED***this.getDomHelper().getDocument(),
                     goog.events.EventType.MOUSEMOVE,
                     this.handleMouseMove, false, this);
***REMOVED***


***REMOVED***
***REMOVED*** Called after the popup is hidden.
***REMOVED*** @protected
***REMOVED*** @suppress {underscore}
***REMOVED*** @override
***REMOVED***
goog.ui.AdvancedTooltip.prototype.onHide_ = function() {
  goog.events.unlisten(this.getDomHelper().getDocument(),
                       goog.events.EventType.MOUSEMOVE,
                       this.handleMouseMove, false, this);

  this.boundingBox_ = null;
  this.anchorBox_ = null;
  this.tracking_ = false;

  goog.ui.AdvancedTooltip.superClass_.onHide_.call(this);
***REMOVED***


***REMOVED***
***REMOVED*** Returns true if the mouse is in the tooltip.
***REMOVED*** @return {boolean} True if the mouse is in the tooltip.
***REMOVED***
goog.ui.AdvancedTooltip.prototype.isMouseInTooltip = function() {
  return this.isCoordinateInTooltip(this.cursorPosition);
***REMOVED***


***REMOVED***
***REMOVED*** Checks whether the supplied coordinate is inside the tooltip, including
***REMOVED*** padding if any.
***REMOVED*** @param {goog.math.Coordinate} coord Coordinate being tested.
***REMOVED*** @return {boolean} Whether the coord is in the tooltip.
***REMOVED*** @override
***REMOVED***
goog.ui.AdvancedTooltip.prototype.isCoordinateInTooltip = function(coord) {
  // Check if coord is inside the bounding box of the tooltip
  if (this.hotSpotPadding_) {
    var offset = goog.style.getPageOffset(this.getElement());
    var size = goog.style.getSize(this.getElement());
    return offset.x - this.hotSpotPadding_.left <= coord.x &&
        coord.x <= offset.x + size.width + this.hotSpotPadding_.right &&
        offset.y - this.hotSpotPadding_.top <= coord.y &&
        coord.y <= offset.y + size.height + this.hotSpotPadding_.bottom;
  }

  return goog.ui.AdvancedTooltip.superClass_.isCoordinateInTooltip.call(this,
                                                                        coord);
***REMOVED***


***REMOVED***
***REMOVED*** Checks if supplied coordinate is in the tooltip, its triggering anchor, or
***REMOVED*** a tooltip that has been triggered by a child of this tooltip.
***REMOVED*** Called from handleMouseMove to determine if hide timer should be started,
***REMOVED*** and from maybeHide to determine if tooltip should be hidden.
***REMOVED*** @param {goog.math.Coordinate} coord Coordinate being tested.
***REMOVED*** @return {boolean} Whether coordinate is in the anchor, the tooltip, or any
***REMOVED***     tooltip whose anchor is a child of this tooltip.
***REMOVED*** @private
***REMOVED***
goog.ui.AdvancedTooltip.prototype.isCoordinateActive_ = function(coord) {
  if ((this.anchorBox_ && this.anchorBox_.contains(coord)) ||
      this.isCoordinateInTooltip(coord)) {
    return true;
  }

  // Check if mouse might be in active child element.
  var childTooltip = this.getChildTooltip();
  return !!childTooltip && childTooltip.isCoordinateInTooltip(coord);
***REMOVED***


***REMOVED***
***REMOVED*** Called by timer from mouse out handler. Hides tooltip if cursor is still
***REMOVED*** outside element and tooltip.
***REMOVED*** @param {Element} el Anchor when hide timer was started.
***REMOVED*** @override
***REMOVED***
goog.ui.AdvancedTooltip.prototype.maybeHide = function(el) {
  this.hideTimer = undefined;
  if (el == this.anchor) {
    // Check if cursor is inside the bounding box of the tooltip or the element
    // that triggered it, or if tooltip is active (possibly due to receiving
    // the focus), or if there is a nested tooltip being shown.
    if (!this.isCoordinateActive_(this.cursorPosition) &&
        !this.getActiveElement() &&
        !this.hasActiveChild()) {
      // Under certain circumstances gecko fires ghost mouse events with the
      // coordinates 0, 0 regardless of the cursors position.
      if (goog.userAgent.GECKO && this.cursorPosition.x == 0 &&
          this.cursorPosition.y == 0) {
        return;
      }
      this.setVisible(false);
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** Handler for mouse move events.
***REMOVED***
***REMOVED*** @param {goog.events.BrowserEvent} event Event object.
***REMOVED*** @protected
***REMOVED*** @override
***REMOVED***
goog.ui.AdvancedTooltip.prototype.handleMouseMove = function(event) {
  var startTimer = this.isVisible();
  if (this.boundingBox_) {
    var scroll = this.getDomHelper().getDocumentScroll();
    var c = new goog.math.Coordinate(event.clientX + scroll.x,
        event.clientY + scroll.y);
    if (this.isCoordinateActive_(c)) {
      startTimer = false;
    } else if (this.tracking_) {
      var prevDist = goog.math.Box.distance(this.boundingBox_,
          this.cursorPosition);
      var currDist = goog.math.Box.distance(this.boundingBox_, c);
      startTimer = currDist >= prevDist;
    }
  }

  if (startTimer) {
    this.startHideTimer();

    // Even though the mouse coordinate is not on the tooltip (or nested child),
    // they may have an active element because of a focus event.  Don't let
    // that prevent us from taking down the tooltip(s) on this mouse move.
    this.setActiveElement(null);
    var childTooltip = this.getChildTooltip();
    if (childTooltip) {
      childTooltip.setActiveElement(null);
    }
  } else if (this.getState() == goog.ui.Tooltip.State.WAITING_TO_HIDE) {
    this.clearHideTimer();
  }

  goog.ui.AdvancedTooltip.superClass_.handleMouseMove.call(this, event);
***REMOVED***


***REMOVED***
***REMOVED*** Handler for mouse over events for the tooltip element.
***REMOVED***
***REMOVED*** @param {goog.events.BrowserEvent} event Event object.
***REMOVED*** @protected
***REMOVED*** @override
***REMOVED***
goog.ui.AdvancedTooltip.prototype.handleTooltipMouseOver = function(event) {
  if (this.getActiveElement() != this.getElement()) {
    this.tracking_ = false;
    this.setActiveElement(this.getElement());
  }
***REMOVED***


***REMOVED***
***REMOVED*** Override hide delay with cursor tracking hide delay while tracking.
***REMOVED*** @return {number} Hide delay to use.
***REMOVED*** @override
***REMOVED***
goog.ui.AdvancedTooltip.prototype.getHideDelayMs = function() {
  return this.tracking_ ? this.cursorTrackingHideDelayMs_ :
      goog.base(this, 'getHideDelayMs');
***REMOVED***


***REMOVED***
***REMOVED*** Forces the recalculation of the hotspot on the next mouse over event.
***REMOVED*** @deprecated Not ever necessary to call this function. Hot spot is calculated
***REMOVED***     as neccessary.
***REMOVED***
goog.ui.AdvancedTooltip.prototype.resetHotSpot = goog.nullFunction;
