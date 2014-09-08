// Copyright 2005 The Closure Library Authors. All Rights Reserved.
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
***REMOVED*** @fileoverview Bubble component - handles display, hiding, etc. of the
***REMOVED*** actual bubble UI.
***REMOVED***
***REMOVED*** This is used exclusively by code within the editor package, and should not
***REMOVED*** be used directly.
***REMOVED***
***REMOVED*** @author robbyw@google.com (Robby Walker)
***REMOVED*** @author tildahl@google.com (Michael Tildahl)
***REMOVED***

goog.provide('goog.ui.editor.Bubble');

goog.require('goog.asserts');
goog.require('goog.dom');
goog.require('goog.dom.TagName');
goog.require('goog.dom.ViewportSizeMonitor');
goog.require('goog.dom.classlist');
goog.require('goog.editor.style');
goog.require('goog.events.EventHandler');
goog.require('goog.events.EventTarget');
***REMOVED***
goog.require('goog.functions');
goog.require('goog.log');
goog.require('goog.math.Box');
goog.require('goog.object');
goog.require('goog.positioning');
goog.require('goog.positioning.Corner');
goog.require('goog.positioning.Overflow');
goog.require('goog.positioning.OverflowStatus');
goog.require('goog.string');
goog.require('goog.style');
goog.require('goog.ui.Component');
goog.require('goog.ui.PopupBase');
goog.require('goog.userAgent');



***REMOVED***
***REMOVED*** Property bubble UI element.
***REMOVED*** @param {Element} parent The parent element for this bubble.
***REMOVED*** @param {number} zIndex The z index to draw the bubble at.
***REMOVED***
***REMOVED*** @extends {goog.events.EventTarget}
***REMOVED***
goog.ui.editor.Bubble = function(parent, zIndex) {
  goog.ui.editor.Bubble.base(this, 'constructor');

 ***REMOVED*****REMOVED***
  ***REMOVED*** Dom helper for the document the bubble should be shown in.
  ***REMOVED*** @type {!goog.dom.DomHelper}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.dom_ = goog.dom.getDomHelper(parent);

 ***REMOVED*****REMOVED***
  ***REMOVED*** Event handler for this bubble.
  ***REMOVED*** @type {goog.events.EventHandler.<!goog.ui.editor.Bubble>}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.eventHandler_ = new goog.events.EventHandler(this);

 ***REMOVED*****REMOVED***
  ***REMOVED*** Object that monitors the application window for size changes.
  ***REMOVED*** @type {goog.dom.ViewportSizeMonitor}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.viewPortSizeMonitor_ = new goog.dom.ViewportSizeMonitor(
      this.dom_.getWindow());

 ***REMOVED*****REMOVED***
  ***REMOVED*** Maps panel ids to panels.
  ***REMOVED*** @type {Object.<goog.ui.editor.Bubble.Panel_>}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.panels_ = {***REMOVED***

 ***REMOVED*****REMOVED***
  ***REMOVED*** Container element for the entire bubble.  This may contain elements related
  ***REMOVED*** to look and feel or styling of the bubble.
  ***REMOVED*** @type {Element}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.bubbleContainer_ =
      this.dom_.createDom(goog.dom.TagName.DIV,
          {'className': goog.ui.editor.Bubble.BUBBLE_CLASSNAME});

  goog.style.setElementShown(this.bubbleContainer_, false);
  goog.dom.appendChild(parent, this.bubbleContainer_);
  goog.style.setStyle(this.bubbleContainer_, 'zIndex', zIndex);

 ***REMOVED*****REMOVED***
  ***REMOVED*** Container element for the bubble panels - this should be some inner element
  ***REMOVED*** within (or equal to) bubbleContainer.
  ***REMOVED*** @type {Element}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.bubbleContents_ = this.createBubbleDom(this.dom_, this.bubbleContainer_);

 ***REMOVED*****REMOVED***
  ***REMOVED*** Element showing the close box.
  ***REMOVED*** @type {!Element}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.closeBox_ = this.dom_.createDom(goog.dom.TagName.DIV, {
    'className': goog.getCssName('tr_bubble_closebox'),
    'innerHTML': '&nbsp;'
  });
  this.bubbleContents_.appendChild(this.closeBox_);

  // We make bubbles unselectable so that clicking on them does not steal focus
  // or move the cursor away from the element the bubble is attached to.
  goog.editor.style.makeUnselectable(this.bubbleContainer_, this.eventHandler_);

 ***REMOVED*****REMOVED***
  ***REMOVED*** Popup that controls showing and hiding the bubble at the appropriate
  ***REMOVED*** position.
  ***REMOVED*** @type {goog.ui.PopupBase}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.popup_ = new goog.ui.PopupBase(this.bubbleContainer_);
***REMOVED***
goog.inherits(goog.ui.editor.Bubble, goog.events.EventTarget);


***REMOVED***
***REMOVED*** The css class name of the bubble container element.
***REMOVED*** @type {string}
***REMOVED***
goog.ui.editor.Bubble.BUBBLE_CLASSNAME = goog.getCssName('tr_bubble');


***REMOVED***
***REMOVED*** Creates and adds DOM for the bubble UI to the given container.  This default
***REMOVED*** implementation just returns the container itself.
***REMOVED*** @param {!goog.dom.DomHelper} dom DOM helper to use.
***REMOVED*** @param {!Element} container Element to add the new elements to.
***REMOVED*** @return {!Element} The element where bubble content should be added.
***REMOVED*** @protected
***REMOVED***
goog.ui.editor.Bubble.prototype.createBubbleDom = function(dom, container) {
  return container;
***REMOVED***


***REMOVED***
***REMOVED*** A logger for goog.ui.editor.Bubble.
***REMOVED*** @type {goog.log.Logger}
***REMOVED*** @protected
***REMOVED***
goog.ui.editor.Bubble.prototype.logger =
    goog.log.getLogger('goog.ui.editor.Bubble');


***REMOVED*** @override***REMOVED***
goog.ui.editor.Bubble.prototype.disposeInternal = function() {
  goog.ui.editor.Bubble.base(this, 'disposeInternal');

  goog.dom.removeNode(this.bubbleContainer_);
  this.bubbleContainer_ = null;

  this.eventHandler_.dispose();
  this.eventHandler_ = null;

  this.viewPortSizeMonitor_.dispose();
  this.viewPortSizeMonitor_ = null;
***REMOVED***


***REMOVED***
***REMOVED*** @return {Element} The element that where the bubble's contents go.
***REMOVED***
goog.ui.editor.Bubble.prototype.getContentElement = function() {
  return this.bubbleContents_;
***REMOVED***


***REMOVED***
***REMOVED*** @return {Element} The element that contains the bubble.
***REMOVED*** @protected
***REMOVED***
goog.ui.editor.Bubble.prototype.getContainerElement = function() {
  return this.bubbleContainer_;
***REMOVED***


***REMOVED***
***REMOVED*** @return {goog.events.EventHandler.<T>} The event handler.
***REMOVED*** @protected
***REMOVED*** @this T
***REMOVED*** @template T
***REMOVED***
goog.ui.editor.Bubble.prototype.getEventHandler = function() {
  return this.eventHandler_;
***REMOVED***


***REMOVED***
***REMOVED*** Handles user resizing of window.
***REMOVED*** @private
***REMOVED***
goog.ui.editor.Bubble.prototype.handleWindowResize_ = function() {
  if (this.isVisible()) {
    this.reposition();
  }
***REMOVED***


***REMOVED***
***REMOVED*** Sets whether the bubble dismisses itself when the user clicks outside of it.
***REMOVED*** @param {boolean} autoHide Whether to autohide on an external click.
***REMOVED***
goog.ui.editor.Bubble.prototype.setAutoHide = function(autoHide) {
  this.popup_.setAutoHide(autoHide);
***REMOVED***


***REMOVED***
***REMOVED*** Returns whether there is already a panel of the given type.
***REMOVED*** @param {string} type Type of panel to check.
***REMOVED*** @return {boolean} Whether there is already a panel of the given type.
***REMOVED***
goog.ui.editor.Bubble.prototype.hasPanelOfType = function(type) {
  return goog.object.some(this.panels_, function(panel) {
    return panel.type == type;
  });
***REMOVED***


***REMOVED***
***REMOVED*** Adds a panel to the bubble.
***REMOVED*** @param {string} type The type of bubble panel this is.  Should usually be
***REMOVED***     the same as the tagName of the targetElement.  This ensures multiple
***REMOVED***     bubble panels don't appear for the same element.
***REMOVED*** @param {string} title The title of the panel.
***REMOVED*** @param {Element} targetElement The target element of the bubble.
***REMOVED*** @param {function(Element): void} contentFn Function that when called with
***REMOVED***     a container element, will add relevant panel content to it.
***REMOVED*** @param {boolean=} opt_preferTopPosition Whether to prefer placing the bubble
***REMOVED***     above the element instead of below it.  Defaults to preferring below.
***REMOVED***     If any panel prefers the top position, the top position is used.
***REMOVED*** @return {string} The id of the panel.
***REMOVED***
goog.ui.editor.Bubble.prototype.addPanel = function(type, title, targetElement,
    contentFn, opt_preferTopPosition) {
  var id = goog.string.createUniqueString();
  var panel = new goog.ui.editor.Bubble.Panel_(this.dom_, id, type, title,
      targetElement, !opt_preferTopPosition);
  this.panels_[id] = panel;

  // Insert the panel in string order of type.  Technically we could use binary
  // search here but n is really small (probably 0 - 2) so it's not worth it.
  // The last child of bubbleContents_ is the close box so we take care not
  // to treat it as a panel element, and we also ensure it stays as the last
  // element.  The intention here is not to create any artificial order, but
  // just to ensure that it is always consistent.
  var nextElement;
  for (var i = 0, len = this.bubbleContents_.childNodes.length - 1; i < len;
       i++) {
    var otherChild = this.bubbleContents_.childNodes[i];
    var otherPanel = this.panels_[otherChild.id];
    if (otherPanel.type > type) {
      nextElement = otherChild;
      break;
    }
  }
  goog.dom.insertSiblingBefore(panel.element,
      nextElement || this.bubbleContents_.lastChild);

  contentFn(panel.getContentElement());
  goog.editor.style.makeUnselectable(panel.element, this.eventHandler_);

  var numPanels = goog.object.getCount(this.panels_);
  if (numPanels == 1) {
    this.openBubble_();
  } else if (numPanels == 2) {
    goog.dom.classlist.add(
        goog.asserts.assert(this.bubbleContainer_),
        goog.getCssName('tr_multi_bubble'));
  }
  this.reposition();

  return id;
***REMOVED***


***REMOVED***
***REMOVED*** Removes the panel with the given id.
***REMOVED*** @param {string} id The id of the panel.
***REMOVED***
goog.ui.editor.Bubble.prototype.removePanel = function(id) {
  var panel = this.panels_[id];
  goog.dom.removeNode(panel.element);
  delete this.panels_[id];

  var numPanels = goog.object.getCount(this.panels_);
  if (numPanels <= 1) {
    goog.dom.classlist.remove(
        goog.asserts.assert(this.bubbleContainer_),
        goog.getCssName('tr_multi_bubble'));
  }

  if (numPanels == 0) {
    this.closeBubble_();
  } else {
    this.reposition();
  }
***REMOVED***


***REMOVED***
***REMOVED*** Opens the bubble.
***REMOVED*** @private
***REMOVED***
goog.ui.editor.Bubble.prototype.openBubble_ = function() {
  this.eventHandler_.
      listen(this.closeBox_, goog.events.EventType.CLICK,
          this.closeBubble_).
      listen(this.viewPortSizeMonitor_,
          goog.events.EventType.RESIZE, this.handleWindowResize_).
      listen(this.popup_, goog.ui.PopupBase.EventType.HIDE,
          this.handlePopupHide);

  this.popup_.setVisible(true);
  this.reposition();
***REMOVED***


***REMOVED***
***REMOVED*** Closes the bubble.
***REMOVED*** @private
***REMOVED***
goog.ui.editor.Bubble.prototype.closeBubble_ = function() {
  this.popup_.setVisible(false);
***REMOVED***


***REMOVED***
***REMOVED*** Handles the popup's hide event by removing all panels and dispatching a
***REMOVED*** HIDE event.
***REMOVED*** @protected
***REMOVED***
goog.ui.editor.Bubble.prototype.handlePopupHide = function() {
  // Remove the panel elements.
  for (var panelId in this.panels_) {
    goog.dom.removeNode(this.panels_[panelId].element);
  }

  // Update the state to reflect no panels.
  this.panels_ = {***REMOVED***
  goog.dom.classlist.remove(
      goog.asserts.assert(this.bubbleContainer_),
      goog.getCssName('tr_multi_bubble'));

  this.eventHandler_.removeAll();
  this.dispatchEvent(goog.ui.Component.EventType.HIDE);
***REMOVED***


***REMOVED***
***REMOVED*** Returns the visibility of the bubble.
***REMOVED*** @return {boolean} True if visible false if not.
***REMOVED***
goog.ui.editor.Bubble.prototype.isVisible = function() {
  return this.popup_.isVisible();
***REMOVED***


***REMOVED***
***REMOVED*** The vertical clearance in pixels between the bottom of the targetElement
***REMOVED*** and the edge of the bubble.
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.ui.editor.Bubble.VERTICAL_CLEARANCE_ = goog.userAgent.IE ? 4 : 2;


***REMOVED***
***REMOVED*** Bubble's margin box to be passed to goog.positioning.
***REMOVED*** @type {goog.math.Box}
***REMOVED*** @private
***REMOVED***
goog.ui.editor.Bubble.MARGIN_BOX_ = new goog.math.Box(
    goog.ui.editor.Bubble.VERTICAL_CLEARANCE_, 0,
    goog.ui.editor.Bubble.VERTICAL_CLEARANCE_, 0);


***REMOVED***
***REMOVED*** Returns the margin box.
***REMOVED*** @return {goog.math.Box}
***REMOVED*** @protected
***REMOVED***
goog.ui.editor.Bubble.prototype.getMarginBox = function() {
  return goog.ui.editor.Bubble.MARGIN_BOX_;
***REMOVED***


***REMOVED***
***REMOVED*** Positions and displays this bubble below its targetElement. Assumes that
***REMOVED*** the bubbleContainer is already contained in the document object it applies
***REMOVED*** to.
***REMOVED***
goog.ui.editor.Bubble.prototype.reposition = function() {
  var targetElement = null;
  var preferBottomPosition = true;
  for (var panelId in this.panels_) {
    var panel = this.panels_[panelId];
    // We don't care which targetElement we get, so we just take the last one.
    targetElement = panel.targetElement;
    preferBottomPosition = preferBottomPosition && panel.preferBottomPosition;
  }
  var status = goog.positioning.OverflowStatus.FAILED;

  // Fix for bug when bubbleContainer and targetElement have
  // opposite directionality, the bubble should anchor to the END of
  // the targetElement instead of START.
  var reverseLayout = (goog.style.isRightToLeft(this.bubbleContainer_) !=
      goog.style.isRightToLeft(targetElement));

  // Try to put the bubble at the bottom of the target unless the plugin has
  // requested otherwise.
  if (preferBottomPosition) {
    status = this.positionAtAnchor_(reverseLayout ?
        goog.positioning.Corner.BOTTOM_END :
        goog.positioning.Corner.BOTTOM_START,
        goog.positioning.Corner.TOP_START,
        goog.positioning.Overflow.ADJUST_X | goog.positioning.Overflow.FAIL_Y);
  }

  if (status & goog.positioning.OverflowStatus.FAILED) {
    // Try to put it at the top of the target if there is not enough
    // space at the bottom.
    status = this.positionAtAnchor_(reverseLayout ?
        goog.positioning.Corner.TOP_END : goog.positioning.Corner.TOP_START,
        goog.positioning.Corner.BOTTOM_START,
        goog.positioning.Overflow.ADJUST_X | goog.positioning.Overflow.FAIL_Y);
  }

  if (status & goog.positioning.OverflowStatus.FAILED) {
    // Put it at the bottom again with adjustment if there is no
    // enough space at the top.
    status = this.positionAtAnchor_(reverseLayout ?
        goog.positioning.Corner.BOTTOM_END :
        goog.positioning.Corner.BOTTOM_START,
        goog.positioning.Corner.TOP_START,
        goog.positioning.Overflow.ADJUST_X |
        goog.positioning.Overflow.ADJUST_Y);
    if (status & goog.positioning.OverflowStatus.FAILED) {
      goog.log.warning(this.logger,
          'reposition(): positionAtAnchor() failed with ' + status);
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** A helper for reposition() - positions the bubble in regards to the position
***REMOVED*** of the elements the bubble is attached to.
***REMOVED*** @param {goog.positioning.Corner} targetCorner The corner of
***REMOVED***     the target element.
***REMOVED*** @param {goog.positioning.Corner} bubbleCorner The corner of the bubble.
***REMOVED*** @param {number} overflow Overflow handling mode bitmap,
***REMOVED***     {@see goog.positioning.Overflow}.
***REMOVED*** @return {number} Status bitmap, {@see goog.positioning.OverflowStatus}.
***REMOVED*** @private
***REMOVED***
goog.ui.editor.Bubble.prototype.positionAtAnchor_ = function(
    targetCorner, bubbleCorner, overflow) {
  var targetElement = null;
  for (var panelId in this.panels_) {
    // For now, we use the outermost element.  This assumes the multiple
    // elements this panel is showing for contain each other - in the event
    // that is not generally the case this may need to be updated to pick
    // the lowest or highest element depending on targetCorner.
    var candidate = this.panels_[panelId].targetElement;
    if (!targetElement || goog.dom.contains(candidate, targetElement)) {
      targetElement = this.panels_[panelId].targetElement;
    }
  }
  return goog.positioning.positionAtAnchor(
      targetElement, targetCorner, this.bubbleContainer_,
      bubbleCorner, null, this.getMarginBox(), overflow,
      null, this.getViewportBox());
***REMOVED***


***REMOVED***
***REMOVED*** Returns the viewport box to use when positioning the bubble.
***REMOVED*** @return {goog.math.Box}
***REMOVED*** @protected
***REMOVED***
goog.ui.editor.Bubble.prototype.getViewportBox = goog.functions.NULL;



***REMOVED***
***REMOVED*** Private class used to describe a bubble panel.
***REMOVED*** @param {goog.dom.DomHelper} dom DOM helper used to create the panel.
***REMOVED*** @param {string} id ID of the panel.
***REMOVED*** @param {string} type Type of the panel.
***REMOVED*** @param {string} title Title of the panel.
***REMOVED*** @param {Element} targetElement Element the panel is showing for.
***REMOVED*** @param {boolean} preferBottomPosition Whether this panel prefers to show
***REMOVED***     below the target element.
***REMOVED***
***REMOVED*** @private
***REMOVED***
goog.ui.editor.Bubble.Panel_ = function(dom, id, type, title, targetElement,
    preferBottomPosition) {
 ***REMOVED*****REMOVED***
  ***REMOVED*** The type of bubble panel.
  ***REMOVED*** @type {string}
 ***REMOVED*****REMOVED***
  this.type = type;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The target element of this bubble panel.
  ***REMOVED*** @type {Element}
 ***REMOVED*****REMOVED***
  this.targetElement = targetElement;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Whether the panel prefers to be placed below the target element.
  ***REMOVED*** @type {boolean}
 ***REMOVED*****REMOVED***
  this.preferBottomPosition = preferBottomPosition;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The element containing this panel.
 ***REMOVED*****REMOVED***
  this.element = dom.createDom(goog.dom.TagName.DIV,
      {className: goog.getCssName('tr_bubble_panel'), id: id},
      dom.createDom(goog.dom.TagName.DIV,
          {className: goog.getCssName('tr_bubble_panel_title')},
          title ? title + ':' : ''), // TODO(robbyw): Does this work in bidi?
      dom.createDom(goog.dom.TagName.DIV,
          {className: goog.getCssName('tr_bubble_panel_content')}));
***REMOVED***


***REMOVED***
***REMOVED*** @return {Element} The element in the panel where content should go.
***REMOVED***
goog.ui.editor.Bubble.Panel_.prototype.getContentElement = function() {
  return***REMOVED*****REMOVED*** @type {Element}***REMOVED*** (this.element.lastChild);
***REMOVED***
