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
***REMOVED*** @fileoverview Tooltip widget implementation.
***REMOVED***
***REMOVED*** @author eae@google.com (Emil A Eklund)
***REMOVED*** @see ../demos/tooltip.html
***REMOVED***

goog.provide('goog.ui.Tooltip');
goog.provide('goog.ui.Tooltip.CursorTooltipPosition');
goog.provide('goog.ui.Tooltip.ElementTooltipPosition');
goog.provide('goog.ui.Tooltip.State');

goog.require('goog.Timer');
goog.require('goog.array');
goog.require('goog.dom');
***REMOVED***
***REMOVED***
goog.require('goog.math.Box');
goog.require('goog.math.Coordinate');
goog.require('goog.positioning');
goog.require('goog.positioning.AnchoredPosition');
goog.require('goog.positioning.Corner');
goog.require('goog.positioning.Overflow');
goog.require('goog.positioning.OverflowStatus');
goog.require('goog.positioning.ViewportPosition');
goog.require('goog.structs.Set');
goog.require('goog.style');
goog.require('goog.ui.Popup');
goog.require('goog.ui.PopupBase');



***REMOVED***
***REMOVED*** Tooltip widget. Can be attached to one or more elements and is shown, with a
***REMOVED*** slight delay, when the the cursor is over the element or the element gains
***REMOVED*** focus.
***REMOVED***
***REMOVED*** @param {Element|string=} opt_el Element to display tooltip for, either
***REMOVED***     element reference or string id.
***REMOVED*** @param {?string=} opt_str Text message to display in tooltip.
***REMOVED*** @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper.
***REMOVED***
***REMOVED*** @extends {goog.ui.Popup}
***REMOVED***
goog.ui.Tooltip = function(opt_el, opt_str, opt_domHelper) {
 ***REMOVED*****REMOVED***
  ***REMOVED*** Dom Helper
  ***REMOVED*** @type {goog.dom.DomHelper}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.dom_ = opt_domHelper || (opt_el ?
      goog.dom.getDomHelper(goog.dom.getElement(opt_el)) :
      goog.dom.getDomHelper());

  goog.ui.Popup.call(this, this.dom_.createDom(
      'div', {'style': 'position:absolute;display:none;'}));

 ***REMOVED*****REMOVED***
  ***REMOVED*** Cursor position relative to the page.
  ***REMOVED*** @type {!goog.math.Coordinate}
  ***REMOVED*** @protected
 ***REMOVED*****REMOVED***
  this.cursorPosition = new goog.math.Coordinate(1, 1);

 ***REMOVED*****REMOVED***
  ***REMOVED*** Elements this widget is attached to.
  ***REMOVED*** @type {goog.structs.Set}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.elements_ = new goog.structs.Set();

  // Attach to element, if specified
  if (opt_el) {
    this.attach(opt_el);
  }

  // Set message, if specified.
  if (opt_str != null) {
    this.setText(opt_str);
  }
***REMOVED***
goog.inherits(goog.ui.Tooltip, goog.ui.Popup);


***REMOVED***
***REMOVED*** List of active (open) tooltip widgets. Used to prevent multiple tooltips
***REMOVED*** from appearing at once.
***REMOVED***
***REMOVED*** @type {!Array.<goog.ui.Tooltip>}
***REMOVED*** @private
***REMOVED***
goog.ui.Tooltip.activeInstances_ = [];


***REMOVED***
***REMOVED*** Active element reference. Used by the delayed show functionality to keep
***REMOVED*** track of the element the mouse is over or the element with focus.
***REMOVED*** @type {Element}
***REMOVED*** @private
***REMOVED***
goog.ui.Tooltip.prototype.activeEl_ = null;


***REMOVED***
***REMOVED*** CSS class name for tooltip.
***REMOVED***
***REMOVED*** @type {string}
***REMOVED***
goog.ui.Tooltip.prototype.className = goog.getCssName('goog-tooltip');


***REMOVED***
***REMOVED*** Delay in milliseconds since the last mouseover or mousemove before the
***REMOVED*** tooltip is displayed for an element.
***REMOVED***
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.ui.Tooltip.prototype.showDelayMs_ = 500;


***REMOVED***
***REMOVED*** Timer for when to show.
***REMOVED***
***REMOVED*** @type {number|undefined}
***REMOVED*** @protected
***REMOVED***
goog.ui.Tooltip.prototype.showTimer;


***REMOVED***
***REMOVED*** Delay in milliseconds before tooltips are hidden.
***REMOVED***
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.ui.Tooltip.prototype.hideDelayMs_ = 0;


***REMOVED***
***REMOVED*** Timer for when to hide.
***REMOVED***
***REMOVED*** @type {number|undefined}
***REMOVED*** @protected
***REMOVED***
goog.ui.Tooltip.prototype.hideTimer;


***REMOVED***
***REMOVED*** Element that triggered the tooltip.  Note that if a second element triggers
***REMOVED*** this tooltip, anchor becomes that second element, even if its show is
***REMOVED*** cancelled and the original tooltip survives.
***REMOVED***
***REMOVED*** @type {Element|undefined}
***REMOVED*** @protected
***REMOVED***
goog.ui.Tooltip.prototype.anchor;


***REMOVED***
***REMOVED*** Possible states for the tooltip to be in.
***REMOVED*** @enum {number}
***REMOVED***
goog.ui.Tooltip.State = {
  INACTIVE: 0,
  WAITING_TO_SHOW: 1,
  SHOWING: 2,
  WAITING_TO_HIDE: 3,
  UPDATING: 4 // waiting to show new hovercard while old one still showing.
***REMOVED***


***REMOVED***
***REMOVED*** Popup activation types. Used to select a positioning strategy.
***REMOVED*** @enum {number}
***REMOVED***
goog.ui.Tooltip.Activation = {
  CURSOR: 0,
  FOCUS: 1
***REMOVED***


***REMOVED***
***REMOVED*** Whether the anchor has seen the cursor move or has received focus since the
***REMOVED*** tooltip was last shown. Used to ignore mouse over events triggered by view
***REMOVED*** changes and UI updates.
***REMOVED*** @type {boolean|undefined}
***REMOVED*** @private
***REMOVED***
goog.ui.Tooltip.prototype.seenInteraction_;


***REMOVED***
***REMOVED*** Whether the cursor must have moved before the tooltip will be shown.
***REMOVED*** @type {boolean|undefined}
***REMOVED*** @private
***REMOVED***
goog.ui.Tooltip.prototype.requireInteraction_;


***REMOVED***
***REMOVED*** If this tooltip's element contains another tooltip that becomes active, this
***REMOVED*** property identifies that tooltip so that we can check if this tooltip should
***REMOVED*** not be hidden because the nested tooltip is active.
***REMOVED*** @type {goog.ui.Tooltip}
***REMOVED*** @private
***REMOVED***
goog.ui.Tooltip.prototype.childTooltip_;


***REMOVED***
***REMOVED*** If this tooltip is inside another tooltip's element, then it may have
***REMOVED*** prevented that tooltip from hiding.  When this tooltip hides, we'll need
***REMOVED*** to check if the parent should be hidden as well.
***REMOVED*** @type {goog.ui.Tooltip}
***REMOVED*** @private
***REMOVED***
goog.ui.Tooltip.prototype.parentTooltip_;


***REMOVED***
***REMOVED*** Returns the dom helper that is being used on this component.
***REMOVED*** @return {goog.dom.DomHelper} The dom helper used on this component.
***REMOVED***
goog.ui.Tooltip.prototype.getDomHelper = function() {
  return this.dom_;
***REMOVED***


***REMOVED***
***REMOVED*** @return {goog.ui.Tooltip} Active tooltip in a child element, or null if none.
***REMOVED*** @protected
***REMOVED***
goog.ui.Tooltip.prototype.getChildTooltip = function() {
  return this.childTooltip_;
***REMOVED***


***REMOVED***
***REMOVED*** Attach to element. Tooltip will be displayed when the cursor is over the
***REMOVED*** element or when the element has been active for a few milliseconds.
***REMOVED***
***REMOVED*** @param {Element|string} el Element to display tooltip for, either element
***REMOVED***                            reference or string id.
***REMOVED***
goog.ui.Tooltip.prototype.attach = function(el) {
  el = goog.dom.getElement(el);

  this.elements_.add(el);
***REMOVED***el, goog.events.EventType.MOUSEOVER,
                     this.handleMouseOver, false, this);
***REMOVED***el, goog.events.EventType.MOUSEOUT,
                     this.handleMouseOutAndBlur, false, this);
***REMOVED***el, goog.events.EventType.MOUSEMOVE,
                     this.handleMouseMove, false, this);
***REMOVED***el, goog.events.EventType.FOCUS,
                     this.handleFocus, false, this);
***REMOVED***el, goog.events.EventType.BLUR,
                     this.handleMouseOutAndBlur, false, this);
***REMOVED***


***REMOVED***
***REMOVED*** Detach from element(s).
***REMOVED***
***REMOVED*** @param {Element|string=} opt_el Element to detach from, either element
***REMOVED***                                reference or string id. If no element is
***REMOVED***                                specified all are detached.
***REMOVED***
goog.ui.Tooltip.prototype.detach = function(opt_el) {
  if (opt_el) {
    var el = goog.dom.getElement(opt_el);
    this.detachElement_(el);
    this.elements_.remove(el);
  } else {
    var a = this.elements_.getValues();
    for (var el, i = 0; el = a[i]; i++) {
      this.detachElement_(el);
    }
    this.elements_.clear();
  }
***REMOVED***


***REMOVED***
***REMOVED*** Detach from element.
***REMOVED***
***REMOVED*** @param {Element} el Element to detach from.
***REMOVED*** @private
***REMOVED***
goog.ui.Tooltip.prototype.detachElement_ = function(el) {
  goog.events.unlisten(el, goog.events.EventType.MOUSEOVER,
                       this.handleMouseOver, false, this);
  goog.events.unlisten(el, goog.events.EventType.MOUSEOUT,
                       this.handleMouseOutAndBlur, false, this);
  goog.events.unlisten(el, goog.events.EventType.MOUSEMOVE,
                       this.handleMouseMove, false, this);
  goog.events.unlisten(el, goog.events.EventType.FOCUS,
                       this.handleFocus, false, this);
  goog.events.unlisten(el, goog.events.EventType.BLUR,
                       this.handleMouseOutAndBlur, false, this);
***REMOVED***


***REMOVED***
***REMOVED*** Sets delay in milliseconds before tooltip is displayed for an element.
***REMOVED***
***REMOVED*** @param {number} delay The delay in milliseconds.
***REMOVED***
goog.ui.Tooltip.prototype.setShowDelayMs = function(delay) {
  this.showDelayMs_ = delay;
***REMOVED***


***REMOVED***
***REMOVED*** @return {number} The delay in milliseconds before tooltip is displayed for an
***REMOVED***     element.
***REMOVED***
goog.ui.Tooltip.prototype.getShowDelayMs = function() {
  return this.showDelayMs_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets delay in milliseconds before tooltip is hidden once the cursor leavs
***REMOVED*** the element.
***REMOVED***
***REMOVED*** @param {number} delay The delay in milliseconds.
***REMOVED***
goog.ui.Tooltip.prototype.setHideDelayMs = function(delay) {
  this.hideDelayMs_ = delay;
***REMOVED***


***REMOVED***
***REMOVED*** @return {number} The delay in milliseconds before tooltip is hidden once the
***REMOVED***     cursor leaves the element.
***REMOVED***
goog.ui.Tooltip.prototype.getHideDelayMs = function() {
  return this.hideDelayMs_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets tooltip message as plain text.
***REMOVED***
***REMOVED*** @param {string} str Text message to display in tooltip.
***REMOVED***
goog.ui.Tooltip.prototype.setText = function(str) {
  goog.dom.setTextContent(this.getElement(), str);
***REMOVED***


***REMOVED***
***REMOVED*** Sets tooltip message as HTML markup.
***REMOVED***
***REMOVED*** @param {string} str HTML message to display in tooltip.
***REMOVED***
goog.ui.Tooltip.prototype.setHtml = function(str) {
  this.getElement().innerHTML = str;
***REMOVED***


***REMOVED***
***REMOVED*** Sets tooltip element.
***REMOVED***
***REMOVED*** @param {Element} el HTML element to use as the tooltip.
***REMOVED*** @override
***REMOVED***
goog.ui.Tooltip.prototype.setElement = function(el) {
  var oldElement = this.getElement();
  if (oldElement) {
    goog.dom.removeNode(oldElement);
  }
  goog.ui.Tooltip.superClass_.setElement.call(this, el);
  if (el) {
    var body = this.dom_.getDocument().body;
    body.insertBefore(el, body.lastChild);
  }
***REMOVED***


***REMOVED***
***REMOVED*** @return {string} The tooltip message as plain text.
***REMOVED***
goog.ui.Tooltip.prototype.getText = function() {
  return goog.dom.getTextContent(this.getElement());
***REMOVED***


***REMOVED***
***REMOVED*** @return {string} The tooltip message as HTML.
***REMOVED***
goog.ui.Tooltip.prototype.getHtml = function() {
  return this.getElement().innerHTML;
***REMOVED***


***REMOVED***
***REMOVED*** @return {goog.ui.Tooltip.State} Current state of tooltip.
***REMOVED***
goog.ui.Tooltip.prototype.getState = function() {
  return this.showTimer ?
             (this.isVisible() ? goog.ui.Tooltip.State.UPDATING :
                                 goog.ui.Tooltip.State.WAITING_TO_SHOW) :
         this.hideTimer ? goog.ui.Tooltip.State.WAITING_TO_HIDE :
         this.isVisible() ? goog.ui.Tooltip.State.SHOWING :
         goog.ui.Tooltip.State.INACTIVE;
***REMOVED***


***REMOVED***
***REMOVED*** Sets whether tooltip requires the mouse to have moved or the anchor receive
***REMOVED*** focus before the tooltip will be shown.
***REMOVED*** @param {boolean} requireInteraction Whether tooltip should require some user
***REMOVED***     interaction before showing tooltip.
***REMOVED***
goog.ui.Tooltip.prototype.setRequireInteraction = function(requireInteraction) {
  this.requireInteraction_ = requireInteraction;
***REMOVED***


***REMOVED***
***REMOVED*** Returns true if the coord is in the tooltip.
***REMOVED*** @param {goog.math.Coordinate} coord Coordinate being tested.
***REMOVED*** @return {boolean} Whether the coord is in the tooltip.
***REMOVED***
goog.ui.Tooltip.prototype.isCoordinateInTooltip = function(coord) {
  // Check if coord is inside the the tooltip
  if (!this.isVisible()) {
    return false;
  }

  var offset = goog.style.getPageOffset(this.getElement());
  var size = goog.style.getSize(this.getElement());
  return offset.x <= coord.x && coord.x <= offset.x + size.width &&
         offset.y <= coord.y && coord.y <= offset.y + size.height;
***REMOVED***


***REMOVED***
***REMOVED*** Called before the popup is shown.
***REMOVED***
***REMOVED*** @return {boolean} Whether tooltip should be shown.
***REMOVED*** @protected
***REMOVED*** @override
***REMOVED***
goog.ui.Tooltip.prototype.onBeforeShow = function() {
  if (!goog.ui.PopupBase.prototype.onBeforeShow.call(this)) {
    return false;
  }

  // Hide all open tooltips except if this tooltip is triggered by an element
  // inside another tooltip.
  if (this.anchor) {
    for (var tt, i = 0; tt = goog.ui.Tooltip.activeInstances_[i]; i++) {
      if (!goog.dom.contains(tt.getElement(), this.anchor)) {
        tt.setVisible(false);
      }
    }
  }
  goog.array.insert(goog.ui.Tooltip.activeInstances_, this);

  var element = this.getElement();
  element.className = this.className;
  this.clearHideTimer();

  // Register event handlers for tooltip. Used to prevent the tooltip from
  // closing if the cursor is over the tooltip rather then the element that
  // triggered it.
***REMOVED***element, goog.events.EventType.MOUSEOVER,
                     this.handleTooltipMouseOver, false, this);
***REMOVED***element, goog.events.EventType.MOUSEOUT,
                     this.handleTooltipMouseOut, false, this);

  this.clearShowTimer();
  return true;
***REMOVED***


***REMOVED***
***REMOVED*** Called after the popup is hidden.
***REMOVED***
***REMOVED*** @protected
***REMOVED*** @suppress {underscore}
***REMOVED*** @override
***REMOVED***
goog.ui.Tooltip.prototype.onHide_ = function() {
  goog.array.remove(goog.ui.Tooltip.activeInstances_, this);

  // Hide all open tooltips triggered by an element inside this tooltip.
  var element = this.getElement();
  for (var tt, i = 0; tt = goog.ui.Tooltip.activeInstances_[i]; i++) {
    if (tt.anchor && goog.dom.contains(element, tt.anchor)) {
      tt.setVisible(false);
    }
  }

  // If this tooltip is inside another tooltip, start hide timer for that
  // tooltip in case this tooltip was the only reason it was still showing.
  if (this.parentTooltip_) {
    this.parentTooltip_.startHideTimer();
  }

  goog.events.unlisten(element, goog.events.EventType.MOUSEOVER,
                       this.handleTooltipMouseOver, false, this);
  goog.events.unlisten(element, goog.events.EventType.MOUSEOUT,
                       this.handleTooltipMouseOut, false, this);

  this.anchor = undefined;
  // If we are still waiting to show a different hovercard, don't abort it
  // because you think you haven't seen a mouse move:
  if (this.getState() == goog.ui.Tooltip.State.INACTIVE) {
    this.seenInteraction_ = false;
  }

  goog.ui.PopupBase.prototype.onHide_.call(this);
***REMOVED***


***REMOVED***
***REMOVED*** Called by timer from mouse over handler. Shows tooltip if cursor is still
***REMOVED*** over the same element.
***REMOVED***
***REMOVED*** @param {Element} el Element to show tooltip for.
***REMOVED*** @param {goog.positioning.AbstractPosition=} opt_pos Position to display popup
***REMOVED***     at.
***REMOVED***
goog.ui.Tooltip.prototype.maybeShow = function(el, opt_pos) {
  // Assert that the mouse is still over the same element, and that we have not
  // detached from the anchor in the meantime.
  if (this.anchor == el && this.elements_.contains(this.anchor)) {
    if (this.seenInteraction_ || !this.requireInteraction_) {
      // If it is currently showing, then hide it, and abort if it doesn't hide.
      this.setVisible(false);
      if (!this.isVisible()) {
        this.positionAndShow_(el, opt_pos);
      }
    } else {
      this.anchor = undefined;
    }
  }
  this.showTimer = undefined;
***REMOVED***


***REMOVED***
***REMOVED*** @return {goog.structs.Set} Elements this widget is attached to.
***REMOVED*** @protected
***REMOVED***
goog.ui.Tooltip.prototype.getElements = function() {
  return this.elements_;
***REMOVED***


***REMOVED***
***REMOVED*** @return {Element} Active element reference.
***REMOVED***
goog.ui.Tooltip.prototype.getActiveElement = function() {
  return this.activeEl_;
***REMOVED***


***REMOVED***
***REMOVED*** @param {Element} activeEl Active element reference.
***REMOVED*** @protected
***REMOVED***
goog.ui.Tooltip.prototype.setActiveElement = function(activeEl) {
  this.activeEl_ = activeEl;
***REMOVED***


***REMOVED***
***REMOVED*** Shows tooltip for a specific element.
***REMOVED***
***REMOVED*** @param {Element} el Element to show tooltip for.
***REMOVED*** @param {goog.positioning.AbstractPosition=} opt_pos Position to display popup
***REMOVED***     at.
***REMOVED***
goog.ui.Tooltip.prototype.showForElement = function(el, opt_pos) {
  this.attach(el);
  this.activeEl_ = el;

  this.positionAndShow_(el, opt_pos);
***REMOVED***


***REMOVED***
***REMOVED*** Sets tooltip position and shows it.
***REMOVED***
***REMOVED*** @param {Element} el Element to show tooltip for.
***REMOVED*** @param {goog.positioning.AbstractPosition=} opt_pos Position to display popup
***REMOVED***     at.
***REMOVED*** @private
***REMOVED***
goog.ui.Tooltip.prototype.positionAndShow_ = function(el, opt_pos) {
  this.anchor = el;
  this.setPosition(opt_pos ||
      this.getPositioningStrategy(goog.ui.Tooltip.Activation.CURSOR));
  this.setVisible(true);
***REMOVED***


***REMOVED***
***REMOVED*** Called by timer from mouse out handler. Hides tooltip if cursor is still
***REMOVED*** outside element and tooltip, or if a child of tooltip has the focus.
***REMOVED*** @param {Element} el Tooltip's anchor when hide timer was started.
***REMOVED***
goog.ui.Tooltip.prototype.maybeHide = function(el) {
  this.hideTimer = undefined;
  if (el == this.anchor) {
    if ((this.activeEl_ == null || (this.activeEl_ != this.getElement() &&
                                   !this.elements_.contains(this.activeEl_))) &&
        !this.hasActiveChild()) {
      this.setVisible(false);
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} Whether tooltip element contains an active child tooltip,
***REMOVED***     and should thus not be hidden.  When the child tooltip is hidden, it
***REMOVED***     will check if the parent should be hidden, too.
***REMOVED*** @protected
***REMOVED***
goog.ui.Tooltip.prototype.hasActiveChild = function() {
  return !!(this.childTooltip_ && this.childTooltip_.activeEl_);
***REMOVED***


***REMOVED***
***REMOVED*** Saves the current mouse cursor position to {@code this.cursorPosition}.
***REMOVED*** @param {goog.events.BrowserEvent} event MOUSEOVER or MOUSEMOVE event.
***REMOVED*** @private
***REMOVED***
goog.ui.Tooltip.prototype.saveCursorPosition_ = function(event) {
  var scroll = this.dom_.getDocumentScroll();
  this.cursorPosition.x = event.clientX + scroll.x;
  this.cursorPosition.y = event.clientY + scroll.y;
***REMOVED***


***REMOVED***
***REMOVED*** Handler for mouse over events.
***REMOVED***
***REMOVED*** @param {goog.events.BrowserEvent} event Event object.
***REMOVED*** @protected
***REMOVED***
goog.ui.Tooltip.prototype.handleMouseOver = function(event) {
  var el = this.getAnchorFromElement(***REMOVED*** @type {Element}***REMOVED*** (event.target));
  this.activeEl_ =***REMOVED*****REMOVED*** @type {Element}***REMOVED*** (el);
  this.clearHideTimer();
  if (el != this.anchor) {
    this.anchor = el;
    this.startShowTimer(***REMOVED*** @type {Element}***REMOVED*** (el));
    this.checkForParentTooltip_();
    this.saveCursorPosition_(event);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Find anchor containing the given element, if any.
***REMOVED***
***REMOVED*** @param {Element} el Element that triggered event.
***REMOVED*** @return {Element} Element in elements_ array that contains given element,
***REMOVED***     or null if not found.
***REMOVED*** @protected
***REMOVED***
goog.ui.Tooltip.prototype.getAnchorFromElement = function(el) {
  // FireFox has a bug where mouse events relating to <input> elements are
  // sometimes duplicated (often in FF2, rarely in FF3): once for the
  // <input> element and once for a magic hidden <div> element.  Javascript
  // code does not have sufficient permissions to read properties on that
  // magic element and thus will throw an error in this call to
  // getAnchorFromElement_().  In that case we swallow the error.
  // See https://bugzilla.mozilla.org/show_bug.cgi?id=330961
  try {
    while (el && !this.elements_.contains(el)) {
      el =***REMOVED*****REMOVED*** @type {Element}***REMOVED*** (el.parentNode);
    }
    return el;
  } catch (e) {
    return null;
  }
***REMOVED***


***REMOVED***
***REMOVED*** Handler for mouse move events.
***REMOVED***
***REMOVED*** @param {goog.events.BrowserEvent} event MOUSEMOVE event.
***REMOVED*** @protected
***REMOVED***
goog.ui.Tooltip.prototype.handleMouseMove = function(event) {
  this.saveCursorPosition_(event);
  this.seenInteraction_ = true;
***REMOVED***


***REMOVED***
***REMOVED*** Handler for focus events.
***REMOVED***
***REMOVED*** @param {goog.events.BrowserEvent} event Event object.
***REMOVED*** @protected
***REMOVED***
goog.ui.Tooltip.prototype.handleFocus = function(event) {
  var el = this.getAnchorFromElement(***REMOVED*** @type {Element}***REMOVED*** (event.target));
  this.activeEl_ = el;
  this.seenInteraction_ = true;

  if (this.anchor != el) {
    this.anchor = el;
    var pos = this.getPositioningStrategy(goog.ui.Tooltip.Activation.FOCUS);
    this.clearHideTimer();
    this.startShowTimer(***REMOVED*** @type {Element}***REMOVED*** (el), pos);

    this.checkForParentTooltip_();
  }
***REMOVED***


***REMOVED***
***REMOVED*** Return a Position instance for repositioning the tooltip. Override in
***REMOVED*** subclasses to customize the way repositioning is done.
***REMOVED***
***REMOVED*** @param {goog.ui.Tooltip.Activation} activationType Information about what
***REMOVED***    kind of event caused the popup to be shown.
***REMOVED*** @return {!goog.positioning.AbstractPosition} The position object used
***REMOVED***    to position the tooltip.
***REMOVED*** @protected
***REMOVED***
goog.ui.Tooltip.prototype.getPositioningStrategy = function(activationType) {
  if (activationType == goog.ui.Tooltip.Activation.CURSOR) {
    var coord = this.cursorPosition.clone();
    return new goog.ui.Tooltip.CursorTooltipPosition(coord);
  }
  return new goog.ui.Tooltip.ElementTooltipPosition(this.activeEl_);
***REMOVED***


***REMOVED***
***REMOVED*** Looks for an active tooltip whose element contains this tooltip's anchor.
***REMOVED*** This allows us to prevent hides until they are really necessary.
***REMOVED***
***REMOVED*** @private
***REMOVED***
goog.ui.Tooltip.prototype.checkForParentTooltip_ = function() {
  if (this.anchor) {
    for (var tt, i = 0; tt = goog.ui.Tooltip.activeInstances_[i]; i++) {
      if (goog.dom.contains(tt.getElement(), this.anchor)) {
        tt.childTooltip_ = this;
        this.parentTooltip_ = tt;
      }
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** Handler for mouse out and blur events.
***REMOVED***
***REMOVED*** @param {goog.events.BrowserEvent} event Event object.
***REMOVED*** @protected
***REMOVED***
goog.ui.Tooltip.prototype.handleMouseOutAndBlur = function(event) {
  var el = this.getAnchorFromElement(***REMOVED*** @type {Element}***REMOVED*** (event.target));
  var elTo = this.getAnchorFromElement(
     ***REMOVED*****REMOVED*** @type {Element}***REMOVED*** (event.relatedTarget));
  if (el == elTo) {
    // We haven't really left the anchor, just moved from one child to
    // another.
    return;
  }

  if (el == this.activeEl_) {
    this.activeEl_ = null;
  }

  this.clearShowTimer();
  this.seenInteraction_ = false;
  if (this.isVisible() && (!event.relatedTarget ||
      !goog.dom.contains(this.getElement(), event.relatedTarget))) {
    this.startHideTimer();
  } else {
    this.anchor = undefined;
  }
***REMOVED***


***REMOVED***
***REMOVED*** Handler for mouse over events for the tooltip element.
***REMOVED***
***REMOVED*** @param {goog.events.BrowserEvent} event Event object.
***REMOVED*** @protected
***REMOVED***
goog.ui.Tooltip.prototype.handleTooltipMouseOver = function(event) {
  var element = this.getElement();
  if (this.activeEl_ != element) {
    this.clearHideTimer();
    this.activeEl_ = element;
  }
***REMOVED***


***REMOVED***
***REMOVED*** Handler for mouse out events for the tooltip element.
***REMOVED***
***REMOVED*** @param {goog.events.BrowserEvent} event Event object.
***REMOVED*** @protected
***REMOVED***
goog.ui.Tooltip.prototype.handleTooltipMouseOut = function(event) {
  var element = this.getElement();
  if (this.activeEl_ == element && (!event.relatedTarget ||
      !goog.dom.contains(element, event.relatedTarget))) {
    this.activeEl_ = null;
    this.startHideTimer();
  }
***REMOVED***


***REMOVED***
***REMOVED*** Helper method, starts timer that calls maybeShow. Parameters are passed to
***REMOVED*** the maybeShow method.
***REMOVED***
***REMOVED*** @param {Element} el Element to show tooltip for.
***REMOVED*** @param {goog.positioning.AbstractPosition=} opt_pos Position to display popup
***REMOVED***     at.
***REMOVED*** @protected
***REMOVED***
goog.ui.Tooltip.prototype.startShowTimer = function(el, opt_pos) {
  if (!this.showTimer) {
    this.showTimer = goog.Timer.callOnce(
        goog.bind(this.maybeShow, this, el, opt_pos), this.showDelayMs_);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Helper method called to clear the show timer.
***REMOVED***
***REMOVED*** @protected
***REMOVED***
goog.ui.Tooltip.prototype.clearShowTimer = function() {
  if (this.showTimer) {
    goog.Timer.clear(this.showTimer);
    this.showTimer = undefined;
  }
***REMOVED***


***REMOVED***
***REMOVED*** Helper method called to start the close timer.
***REMOVED*** @protected
***REMOVED***
goog.ui.Tooltip.prototype.startHideTimer = function() {
  if (this.getState() == goog.ui.Tooltip.State.SHOWING) {
    this.hideTimer = goog.Timer.callOnce(
        goog.bind(this.maybeHide, this, this.anchor), this.getHideDelayMs());
  }
***REMOVED***


***REMOVED***
***REMOVED*** Helper method called to clear the close timer.
***REMOVED*** @protected
***REMOVED***
goog.ui.Tooltip.prototype.clearHideTimer = function() {
  if (this.hideTimer) {
    goog.Timer.clear(this.hideTimer);
    this.hideTimer = undefined;
  }
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.ui.Tooltip.prototype.disposeInternal = function() {
  this.setVisible(false);
  this.clearShowTimer();
  this.detach();
  if (this.getElement()) {
    goog.dom.removeNode(this.getElement());
  }
  this.activeEl_ = null;
  delete this.dom_;
  goog.ui.Tooltip.superClass_.disposeInternal.call(this);
***REMOVED***



***REMOVED***
***REMOVED*** Popup position implementation that positions the popup (the tooltip in this
***REMOVED*** case) based on the cursor position. It's positioned below the cursor to the
***REMOVED*** right if there's enough room to fit all of it inside the Viewport. Otherwise
***REMOVED*** it's displayed as far right as possible either above or below the element.
***REMOVED***
***REMOVED*** Used to position tooltips triggered by the cursor.
***REMOVED***
***REMOVED*** @param {number|!goog.math.Coordinate} arg1 Left position or coordinate.
***REMOVED*** @param {number=} opt_arg2 Top position.
***REMOVED***
***REMOVED*** @extends {goog.positioning.ViewportPosition}
***REMOVED***
goog.ui.Tooltip.CursorTooltipPosition = function(arg1, opt_arg2) {
  goog.positioning.ViewportPosition.call(this, arg1, opt_arg2);
***REMOVED***
goog.inherits(goog.ui.Tooltip.CursorTooltipPosition,
              goog.positioning.ViewportPosition);


***REMOVED***
***REMOVED*** Repositions the popup based on cursor position.
***REMOVED***
***REMOVED*** @param {Element} element The DOM element of the popup.
***REMOVED*** @param {goog.positioning.Corner} popupCorner The corner of the popup element
***REMOVED***     that that should be positioned adjacent to the anchorElement.
***REMOVED*** @param {goog.math.Box=} opt_margin A margin specified in pixels.
***REMOVED*** @override
***REMOVED***
goog.ui.Tooltip.CursorTooltipPosition.prototype.reposition = function(
    element, popupCorner, opt_margin) {
  var viewportElt = goog.style.getClientViewportElement(element);
  var viewport = goog.style.getVisibleRectForElement(viewportElt);
  var margin = opt_margin ? new goog.math.Box(opt_margin.top + 10,
      opt_margin.right, opt_margin.bottom, opt_margin.left + 10) :
      new goog.math.Box(10, 0, 0, 10);

  if (goog.positioning.positionAtCoordinate(this.coordinate, element,
          goog.positioning.Corner.TOP_START, margin, viewport,
          goog.positioning.Overflow.ADJUST_X | goog.positioning.Overflow.FAIL_Y
      ) & goog.positioning.OverflowStatus.FAILED) {
    goog.positioning.positionAtCoordinate(this.coordinate, element,
        goog.positioning.Corner.TOP_START, margin, viewport,
        goog.positioning.Overflow.ADJUST_X |
            goog.positioning.Overflow.ADJUST_Y);
  }
***REMOVED***



***REMOVED***
***REMOVED*** Popup position implementation that positions the popup (the tooltip in this
***REMOVED*** case) based on the element position. It's positioned below the element to the
***REMOVED*** right if there's enough room to fit all of it inside the Viewport. Otherwise
***REMOVED*** it's displayed as far right as possible either above or below the element.
***REMOVED***
***REMOVED*** Used to position tooltips triggered by focus changes.
***REMOVED***
***REMOVED*** @param {Element} element The element to anchor the popup at.
***REMOVED***
***REMOVED*** @extends {goog.positioning.AnchoredPosition}
***REMOVED***
goog.ui.Tooltip.ElementTooltipPosition = function(element) {
  goog.positioning.AnchoredPosition.call(this, element,
      goog.positioning.Corner.BOTTOM_RIGHT);
***REMOVED***
goog.inherits(goog.ui.Tooltip.ElementTooltipPosition,
              goog.positioning.AnchoredPosition);


***REMOVED***
***REMOVED*** Repositions the popup based on element position.
***REMOVED***
***REMOVED*** @param {Element} element The DOM element of the popup.
***REMOVED*** @param {goog.positioning.Corner} popupCorner The corner of the popup element
***REMOVED***     that should be positioned adjacent to the anchorElement.
***REMOVED*** @param {goog.math.Box=} opt_margin A margin specified in pixels.
***REMOVED*** @override
***REMOVED***
goog.ui.Tooltip.ElementTooltipPosition.prototype.reposition = function(
    element, popupCorner, opt_margin) {
  var offset = new goog.math.Coordinate(10, 0);

  if (goog.positioning.positionAtAnchor(this.element, this.corner, element,
          popupCorner, offset, opt_margin,
          goog.positioning.Overflow.ADJUST_X | goog.positioning.Overflow.FAIL_Y
      ) & goog.positioning.OverflowStatus.FAILED) {
    goog.positioning.positionAtAnchor(this.element,
        goog.positioning.Corner.TOP_RIGHT, element,
        goog.positioning.Corner.BOTTOM_LEFT, offset, opt_margin,
        goog.positioning.Overflow.ADJUST_X |
            goog.positioning.Overflow.ADJUST_Y);
  }
***REMOVED***
