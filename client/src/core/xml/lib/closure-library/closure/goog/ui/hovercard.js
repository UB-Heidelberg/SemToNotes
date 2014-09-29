// Copyright 2008 The Closure Library Authors. All Rights Reserved.
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
***REMOVED*** @fileoverview Show hovercards with a delay after the mouse moves over an
***REMOVED*** element of a specified type and with a specific attribute.
***REMOVED***
***REMOVED*** @see ../demos/hovercard.html
***REMOVED***

goog.provide('goog.ui.HoverCard');
goog.provide('goog.ui.HoverCard.EventType');
goog.provide('goog.ui.HoverCard.TriggerEvent');

goog.require('goog.dom');
***REMOVED***
***REMOVED***
goog.require('goog.ui.AdvancedTooltip');



***REMOVED***
***REMOVED*** Create a hover card object.  Hover cards extend tooltips in that they don't
***REMOVED*** have to be manually attached to each element that can cause them to display.
***REMOVED*** Instead, you can create a function that gets called when the mouse goes over
***REMOVED*** any element on your page, and returns whether or not the hovercard should be
***REMOVED*** shown for that element.
***REMOVED***
***REMOVED*** Alternatively, you can define a map of tag names to the attribute name each
***REMOVED*** tag should have for that tag to trigger the hover card.  See example below.
***REMOVED***
***REMOVED*** Hovercards can also be triggered manually by calling
***REMOVED*** {@code triggerForElement}, shown without a delay by calling
***REMOVED*** {@code showForElement}, or triggered over other elements by calling
***REMOVED*** {@code attach}.  For the latter two cases, the application is responsible
***REMOVED*** for calling {@code detach} when finished.
***REMOVED***
***REMOVED*** HoverCard objects fire a TRIGGER event when the mouse moves over an element
***REMOVED*** that can trigger a hovercard, and BEFORE_SHOW when the hovercard is
***REMOVED*** about to be shown.  Clients can respond to these events and can prevent the
***REMOVED*** hovercard from being triggered or shown.
***REMOVED***
***REMOVED*** @param {Function|Object} isAnchor Function that returns true if a given
***REMOVED***     element should trigger the hovercard.  Alternatively, it can be a map of
***REMOVED***     tag names to the attribute that the tag should have in order to trigger
***REMOVED***     the hovercard, e.g., {A: 'href'} for all links.  Tag names must be all
***REMOVED***     upper case; attribute names are case insensitive.
***REMOVED*** @param {boolean=} opt_checkDescendants Use false for a performance gain if
***REMOVED***     you are sure that none of your triggering elements have child elements.
***REMOVED***     Default is true.
***REMOVED*** @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper to use for
***REMOVED***     creating and rendering the hovercard element.
***REMOVED*** @param {Document=} opt_triggeringDocument Optional document to use in place
***REMOVED***     of the one included in the DomHelper for finding triggering elements.
***REMOVED***     Defaults to the document included in the DomHelper.
***REMOVED***
***REMOVED*** @extends {goog.ui.AdvancedTooltip}
***REMOVED***
goog.ui.HoverCard = function(isAnchor, opt_checkDescendants, opt_domHelper,
    opt_triggeringDocument) {
  goog.ui.AdvancedTooltip.call(this, null, null, opt_domHelper);

  if (goog.isFunction(isAnchor)) {
    // Override default implementation of {@code isAnchor_}.
    this.isAnchor_ = isAnchor;
  } else {

   ***REMOVED*****REMOVED***
    ***REMOVED*** Map of tag names to attribute names that will trigger a hovercard.
    ***REMOVED*** @type {Object}
    ***REMOVED*** @private
   ***REMOVED*****REMOVED***
    this.anchors_ = isAnchor;
  }

 ***REMOVED*****REMOVED***
  ***REMOVED*** Whether anchors may have child elements.  If true, then we need to check
  ***REMOVED*** the parent chain of any mouse over event to see if any of those elements
  ***REMOVED*** could be anchors.  Default is true.
  ***REMOVED*** @type {boolean}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.checkDescendants_ = opt_checkDescendants != false;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Array of anchor elements that should be detached when we are no longer
  ***REMOVED*** associated with them.
  ***REMOVED*** @type {!Array.<Element>}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.tempAttachedAnchors_ = [];

 ***REMOVED*****REMOVED***
  ***REMOVED*** Document containing the triggering elements, to which we listen for
  ***REMOVED*** mouseover events.
  ***REMOVED*** @type {Document}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.document_ = opt_triggeringDocument || (opt_domHelper ?
      opt_domHelper.getDocument() : goog.dom.getDocument());

***REMOVED***this.document_, goog.events.EventType.MOUSEOVER,
                     this.handleTriggerMouseOver_, false, this);
***REMOVED***
goog.inherits(goog.ui.HoverCard, goog.ui.AdvancedTooltip);


***REMOVED***
***REMOVED*** Enum for event type fired by HoverCard.
***REMOVED*** @enum {string}
***REMOVED***
goog.ui.HoverCard.EventType = {
  TRIGGER: 'trigger',
  CANCEL_TRIGGER: 'canceltrigger',
  BEFORE_SHOW: goog.ui.PopupBase.EventType.BEFORE_SHOW,
  SHOW: goog.ui.PopupBase.EventType.SHOW,
  BEFORE_HIDE: goog.ui.PopupBase.EventType.BEFORE_HIDE,
  HIDE: goog.ui.PopupBase.EventType.HIDE
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.ui.HoverCard.prototype.disposeInternal = function() {
  goog.ui.HoverCard.superClass_.disposeInternal.call(this);

  goog.events.unlisten(this.document_, goog.events.EventType.MOUSEOVER,
                       this.handleTriggerMouseOver_, false, this);
***REMOVED***


***REMOVED***
***REMOVED*** Anchor of hovercard currently being shown.  This may be different from
***REMOVED*** {@code anchor} property if a second hovercard is triggered, when
***REMOVED*** {@code anchor} becomes the second hovercard while {@code currentAnchor_}
***REMOVED*** is still the old (but currently displayed) anchor.
***REMOVED*** @type {Element}
***REMOVED*** @private
***REMOVED***
goog.ui.HoverCard.prototype.currentAnchor_;


***REMOVED***
***REMOVED*** Maximum number of levels to search up the dom when checking descendants.
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.ui.HoverCard.prototype.maxSearchSteps_;


***REMOVED***
***REMOVED*** This function can be overridden by passing a function as the first parameter
***REMOVED*** to the constructor.
***REMOVED*** @param {Node} node Node to test.
***REMOVED*** @return {boolean} Whether or not hovercard should be shown.
***REMOVED*** @private
***REMOVED***
goog.ui.HoverCard.prototype.isAnchor_ = function(node) {
  return node.tagName in this.anchors_ &&
      !!node.getAttribute(this.anchors_[node.tagName]);
***REMOVED***


***REMOVED***
***REMOVED*** If the user mouses over an element with the correct tag and attribute, then
***REMOVED*** trigger the hovercard for that element.  If anchors could have children, then
***REMOVED*** we also need to check the parent chain of the given element.
***REMOVED*** @param {goog.events.Event} e Mouse over event.
***REMOVED*** @private
***REMOVED***
goog.ui.HoverCard.prototype.handleTriggerMouseOver_ = function(e) {
  var target =***REMOVED*****REMOVED*** @type {Element}***REMOVED*** (e.target);
  // Target might be null when hovering over disabled input textboxes in IE.
  if (!target) {
    return;
  }
  if (this.isAnchor_(target)) {
    this.setPosition(null);
    this.triggerForElement(target);
  } else if (this.checkDescendants_) {
    var trigger = goog.dom.getAncestor(target,
                                       goog.bind(this.isAnchor_, this),
                                       false,
                                       this.maxSearchSteps_);
    if (trigger) {
      this.setPosition(null);
      this.triggerForElement(***REMOVED*** @type {Element}***REMOVED*** (trigger));
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** Triggers the hovercard to show after a delay.
***REMOVED*** @param {Element} anchorElement Element that is triggering the hovercard.
***REMOVED*** @param {goog.positioning.AbstractPosition=} opt_pos Position to display
***REMOVED***     hovercard.
***REMOVED*** @param {Object=} opt_data Data to pass to the onTrigger event.
***REMOVED***
goog.ui.HoverCard.prototype.triggerForElement = function(anchorElement,
                                                         opt_pos, opt_data) {
  if (anchorElement == this.currentAnchor_) {
    // Element is already showing, just make sure it doesn't hide.
    this.clearHideTimer();
    return;
  }
  if (anchorElement == this.anchor) {
    // Hovercard is pending, no need to retrigger.
    return;
  }

  // If a previous hovercard was being triggered, cancel it.
  this.maybeCancelTrigger_();

  // Create a new event for this trigger
  var triggerEvent = new goog.ui.HoverCard.TriggerEvent(
      goog.ui.HoverCard.EventType.TRIGGER, this, anchorElement, opt_data);

  if (!this.getElements().contains(anchorElement)) {
    this.attach(anchorElement);
    this.tempAttachedAnchors_.push(anchorElement);
  }
  this.anchor = anchorElement;
  if (!this.onTrigger(triggerEvent)) {
    this.onCancelTrigger();
    return;
  }
  var pos = opt_pos || this.position_;
  this.startShowTimer(anchorElement,
     ***REMOVED*****REMOVED*** @type {goog.positioning.AbstractPosition}***REMOVED*** (pos));
***REMOVED***


***REMOVED***
***REMOVED*** Sets the current anchor element at the time that the hovercard is shown.
***REMOVED*** @param {Element} anchor New current anchor element, or null if there is
***REMOVED***     no current anchor.
***REMOVED*** @private
***REMOVED***
goog.ui.HoverCard.prototype.setCurrentAnchor_ = function(anchor) {
  if (anchor != this.currentAnchor_) {
    this.detachTempAnchor_(this.currentAnchor_);
  }
  this.currentAnchor_ = anchor;
***REMOVED***


***REMOVED***
***REMOVED*** If given anchor is in the list of temporarily attached anchors, then
***REMOVED*** detach and remove from the list.
***REMOVED*** @param {Element|undefined} anchor Anchor element that we may want to detach
***REMOVED***     from.
***REMOVED*** @private
***REMOVED***
goog.ui.HoverCard.prototype.detachTempAnchor_ = function(anchor) {
  var pos = goog.array.indexOf(this.tempAttachedAnchors_, anchor);
  if (pos != -1) {
    this.detach(anchor);
    this.tempAttachedAnchors_.splice(pos, 1);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Called when an element triggers the hovercard.  This will return false
***REMOVED*** if an event handler sets preventDefault to true, which will prevent
***REMOVED*** the hovercard from being shown.
***REMOVED*** @param {!goog.ui.HoverCard.TriggerEvent} triggerEvent Event object to use
***REMOVED***     for trigger event.
***REMOVED*** @return {boolean} Whether hovercard should be shown or cancelled.
***REMOVED*** @protected
***REMOVED***
goog.ui.HoverCard.prototype.onTrigger = function(triggerEvent) {
  return this.dispatchEvent(triggerEvent);
***REMOVED***


***REMOVED***
***REMOVED*** Abort pending hovercard showing, if any.
***REMOVED***
goog.ui.HoverCard.prototype.cancelTrigger = function() {
  this.clearShowTimer();
  this.onCancelTrigger();
***REMOVED***


***REMOVED***
***REMOVED*** If hovercard is in the process of being triggered, then cancel it.
***REMOVED*** @private
***REMOVED***
goog.ui.HoverCard.prototype.maybeCancelTrigger_ = function() {
  if (this.getState() == goog.ui.Tooltip.State.WAITING_TO_SHOW ||
      this.getState() == goog.ui.Tooltip.State.UPDATING) {
    this.cancelTrigger();
  }
***REMOVED***


***REMOVED***
***REMOVED*** This method gets called when we detect that a trigger event will not lead
***REMOVED*** to the hovercard being shown.
***REMOVED*** @protected
***REMOVED***
goog.ui.HoverCard.prototype.onCancelTrigger = function() {
  var event = new goog.ui.HoverCard.TriggerEvent(
      goog.ui.HoverCard.EventType.CANCEL_TRIGGER, this, this.anchor || null);
  this.dispatchEvent(event);
  this.detachTempAnchor_(this.anchor);
  delete this.anchor;
***REMOVED***


***REMOVED***
***REMOVED*** Gets the DOM element that triggered the current hovercard.  Note that in
***REMOVED*** the TRIGGER or CANCEL_TRIGGER events, the current hovercard's anchor may not
***REMOVED*** be the one that caused the event, so use the event's anchor property instead.
***REMOVED*** @return {Element} Object that caused the currently displayed hovercard (or
***REMOVED***     pending hovercard if none is displayed) to be triggered.
***REMOVED***
goog.ui.HoverCard.prototype.getAnchorElement = function() {
  // this.currentAnchor_ is only set if the hovercard is showing.  If it isn't
  // showing yet, then use this.anchor as the pending anchor.
  return***REMOVED*****REMOVED*** @type {Element}***REMOVED*** (this.currentAnchor_ || this.anchor);
***REMOVED***


***REMOVED***
***REMOVED*** Make sure we detach from temp anchor when we are done displaying hovercard.
***REMOVED*** @protected
***REMOVED*** @suppress {underscore}
***REMOVED*** @override
***REMOVED***
goog.ui.HoverCard.prototype.onHide_ = function() {
  goog.ui.HoverCard.superClass_.onHide_.call(this);
  this.setCurrentAnchor_(null);
***REMOVED***


***REMOVED***
***REMOVED*** This mouse over event is only received if the anchor is already attached.
***REMOVED*** If it was attached manually, then it may need to be triggered.
***REMOVED*** @param {goog.events.BrowserEvent} event Mouse over event.
***REMOVED*** @override
***REMOVED***
goog.ui.HoverCard.prototype.handleMouseOver = function(event) {
  // If this is a child of a triggering element, find the triggering element.
  var trigger = this.getAnchorFromElement(
     ***REMOVED*****REMOVED*** @type {Element}***REMOVED*** (event.target));

  // If we moused over an element different from the one currently being
  // triggered (if any), then trigger this new element.
  if (trigger && trigger != this.anchor) {
    this.triggerForElement(trigger);
    return;
  }

  goog.ui.HoverCard.superClass_.handleMouseOver.call(this, event);
***REMOVED***


***REMOVED***
***REMOVED*** If the mouse moves out of the trigger while we're being triggered, then
***REMOVED*** cancel it.
***REMOVED*** @param {goog.events.BrowserEvent} event Mouse out or blur event.
***REMOVED*** @override
***REMOVED***
goog.ui.HoverCard.prototype.handleMouseOutAndBlur = function(event) {
  // Get ready to see if a trigger should be cancelled.
  var anchor = this.anchor;
  var state = this.getState();
  goog.ui.HoverCard.superClass_.handleMouseOutAndBlur.call(this, event);
  if (state != this.getState() &&
      (state == goog.ui.Tooltip.State.WAITING_TO_SHOW ||
       state == goog.ui.Tooltip.State.UPDATING)) {
    // Tooltip's handleMouseOutAndBlur method sets anchor to null.  Reset
    // so that the cancel trigger event will have the right data, and so that
    // it will be properly detached.
    this.anchor = anchor;
    this.onCancelTrigger();  // This will remove and detach the anchor.
  }
***REMOVED***


***REMOVED***
***REMOVED*** Called by timer from mouse over handler. If this is called and the hovercard
***REMOVED*** is not shown for whatever reason, then send a cancel trigger event.
***REMOVED*** @param {Element} el Element to show tooltip for.
***REMOVED*** @param {goog.positioning.AbstractPosition=} opt_pos Position to display popup
***REMOVED***     at.
***REMOVED*** @override
***REMOVED***
goog.ui.HoverCard.prototype.maybeShow = function(el, opt_pos) {
  goog.ui.HoverCard.superClass_.maybeShow.call(this, el, opt_pos);

  if (!this.isVisible()) {
    this.cancelTrigger();
  } else {
    this.setCurrentAnchor_(el);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Sets the max number of levels to search up the dom if checking descendants.
***REMOVED*** @param {number} maxSearchSteps Maximum number of levels to search up the
***REMOVED***     dom if checking descendants.
***REMOVED***
goog.ui.HoverCard.prototype.setMaxSearchSteps = function(maxSearchSteps) {
  if (!maxSearchSteps) {
    this.checkDescendants_ = false;
  } else if (this.checkDescendants_) {
    this.maxSearchSteps_ = maxSearchSteps;
  }
***REMOVED***



***REMOVED***
***REMOVED*** Create a trigger event for specified anchor and optional data.
***REMOVED*** @param {goog.ui.HoverCard.EventType} type Event type.
***REMOVED*** @param {goog.ui.HoverCard} target Hovercard that is triggering the event.
***REMOVED*** @param {Element} anchor Element that triggered event.
***REMOVED*** @param {Object=} opt_data Optional data to be available in the TRIGGER event.
***REMOVED***
***REMOVED*** @extends {goog.events.Event}
***REMOVED***
goog.ui.HoverCard.TriggerEvent = function(type, target, anchor, opt_data) {
  goog.events.Event.call(this, type, target);

 ***REMOVED*****REMOVED***
  ***REMOVED*** Element that triggered the hovercard event.
  ***REMOVED*** @type {Element}
 ***REMOVED*****REMOVED***
  this.anchor = anchor;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Optional data to be passed to the listener.
  ***REMOVED*** @type {Object|undefined}
 ***REMOVED*****REMOVED***
  this.data = opt_data;
***REMOVED***
goog.inherits(goog.ui.HoverCard.TriggerEvent, goog.events.Event);
