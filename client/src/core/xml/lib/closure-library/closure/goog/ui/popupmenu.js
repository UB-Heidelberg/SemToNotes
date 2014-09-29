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
***REMOVED*** @fileoverview A menu class for showing popups.  A single popup can be
***REMOVED*** attached to multiple anchor points.  The menu will try to reposition itself
***REMOVED*** if it goes outside the viewport.
***REMOVED***
***REMOVED*** Decoration is the same as goog.ui.Menu except that the outer DIV can have a
***REMOVED*** 'for' property, which is the ID of the element which triggers the popup.
***REMOVED***
***REMOVED*** Decorate Example:
***REMOVED*** <button id="dButton">Decorated Popup</button>
***REMOVED*** <div id="dMenu" for="dButton" class="goog-menu">
***REMOVED***   <div class="goog-menuitem">A a</div>
***REMOVED***   <div class="goog-menuitem">B b</div>
***REMOVED***   <div class="goog-menuitem">C c</div>
***REMOVED***   <div class="goog-menuitem">D d</div>
***REMOVED***   <div class="goog-menuitem">E e</div>
***REMOVED***   <div class="goog-menuitem">F f</div>
***REMOVED*** </div>
***REMOVED***
***REMOVED*** TESTED=FireFox 2.0, IE6, Opera 9, Chrome.
***REMOVED*** TODO(user): Key handling is flakey in Opera and Chrome
***REMOVED***
***REMOVED*** @see ../demos/popupmenu.html
***REMOVED***

goog.provide('goog.ui.PopupMenu');

***REMOVED***
goog.require('goog.positioning.AnchoredViewportPosition');
goog.require('goog.positioning.Corner');
goog.require('goog.positioning.MenuAnchoredPosition');
goog.require('goog.positioning.ViewportClientPosition');
goog.require('goog.structs');
goog.require('goog.structs.Map');
goog.require('goog.style');
goog.require('goog.ui.Component.EventType');
goog.require('goog.ui.Menu');
goog.require('goog.ui.PopupBase');
goog.require('goog.userAgent');



***REMOVED***
***REMOVED*** A basic menu class.
***REMOVED*** @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper.
***REMOVED*** @param {goog.ui.MenuRenderer=} opt_renderer Renderer used to render or
***REMOVED***     decorate the container; defaults to {@link goog.ui.MenuRenderer}.
***REMOVED*** @extends {goog.ui.Menu}
***REMOVED***
***REMOVED***
goog.ui.PopupMenu = function(opt_domHelper, opt_renderer) {
  goog.ui.Menu.call(this, opt_domHelper, opt_renderer);

  this.setAllowAutoFocus(true);

  // Popup menus are hidden by default.
  this.setVisible(false, true);

 ***REMOVED*****REMOVED***
  ***REMOVED*** Map of attachment points for the menu.  Key -> Object
  ***REMOVED*** @type {!goog.structs.Map}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.targets_ = new goog.structs.Map();
***REMOVED***
goog.inherits(goog.ui.PopupMenu, goog.ui.Menu);


***REMOVED***
***REMOVED*** If true, then if the menu will toggle off if it is already visible.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.ui.PopupMenu.prototype.toggleMode_ = false;


***REMOVED***
***REMOVED*** Time that the menu was last shown.
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.ui.PopupMenu.prototype.lastHide_ = 0;


***REMOVED***
***REMOVED*** Current element where the popup menu is anchored.
***REMOVED*** @type {Element}
***REMOVED*** @private
***REMOVED***
goog.ui.PopupMenu.prototype.currentAnchor_ = null;


***REMOVED***
***REMOVED*** Decorate an existing HTML structure with the menu. Menu items will be
***REMOVED*** constructed from elements with classname 'goog-menuitem', separators will be
***REMOVED*** made from HR elements.
***REMOVED*** @param {Element} element Element to decorate.
***REMOVED*** @override
***REMOVED***
goog.ui.PopupMenu.prototype.decorateInternal = function(element) {
  goog.ui.PopupMenu.superClass_.decorateInternal.call(this, element);
  // 'for' is a custom attribute for attaching the menu to a click target
  var htmlFor = element.getAttribute('for') || element.htmlFor;
  if (htmlFor) {
    this.attach(
        this.getDomHelper().getElement(htmlFor),
        goog.positioning.Corner.BOTTOM_LEFT);
  }
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.ui.PopupMenu.prototype.enterDocument = function() {
  goog.ui.PopupMenu.superClass_.enterDocument.call(this);

  goog.structs.forEach(this.targets_, this.attachEvent_, this);

  var handler = this.getHandler();
  handler.listen(
      this, goog.ui.Component.EventType.ACTION, this.onAction_);
  handler.listen(this.getDomHelper().getDocument(),
      goog.events.EventType.MOUSEDOWN, this.onDocClick, true);

  // Webkit doesn't fire a mousedown event when opening the context menu,
  // but we need one to update menu visibility properly. So in Safari handle
  // contextmenu mouse events like mousedown.
  // {@link http://bugs.webkit.org/show_bug.cgi?id=6595}
  if (goog.userAgent.WEBKIT) {
    handler.listen(this.getDomHelper().getDocument(),
        goog.events.EventType.CONTEXTMENU, this.onDocClick, true);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Attaches the menu to a new popup position and anchor element.  A menu can
***REMOVED*** only be attached to an element once, since attaching the same menu for
***REMOVED*** multiple positions doesn't make sense.
***REMOVED***
***REMOVED*** @param {Element} element Element whose click event should trigger the menu.
***REMOVED*** @param {goog.positioning.Corner=} opt_targetCorner Corner of the target that
***REMOVED***     the menu should be anchored to.
***REMOVED*** @param {goog.positioning.Corner=} opt_menuCorner Corner of the menu that
***REMOVED***     should be anchored.
***REMOVED*** @param {boolean=} opt_contextMenu Whether the menu should show on
***REMOVED***     {@link goog.events.EventType.CONTEXTMENU} events, false if it should
***REMOVED***     show on {@link goog.events.EventType.MOUSEDOWN} events. Default is
***REMOVED***     MOUSEDOWN.
***REMOVED*** @param {goog.math.Box=} opt_margin Margin for the popup used in positioning
***REMOVED***     algorithms.
***REMOVED***
goog.ui.PopupMenu.prototype.attach = function(
    element, opt_targetCorner, opt_menuCorner, opt_contextMenu, opt_margin) {

  if (this.isAttachTarget(element)) {
    // Already in the popup, so just return.
    return;
  }

  var target = this.createAttachTarget(element, opt_targetCorner,
      opt_menuCorner, opt_contextMenu, opt_margin);

  if (this.isInDocument()) {
    this.attachEvent_(target);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Creates an object describing how the popup menu should be attached to the
***REMOVED*** anchoring element based on the given parameters. The created object is
***REMOVED*** stored, keyed by {@code element} and is retrievable later by invoking
***REMOVED*** {@link #getAttachTarget(element)} at a later point.
***REMOVED***
***REMOVED*** Subclass may add more properties to the returned object, as needed.
***REMOVED***
***REMOVED*** @param {Element} element Element whose click event should trigger the menu.
***REMOVED*** @param {goog.positioning.Corner=} opt_targetCorner Corner of the target that
***REMOVED***     the menu should be anchored to.
***REMOVED*** @param {goog.positioning.Corner=} opt_menuCorner Corner of the menu that
***REMOVED***     should be anchored.
***REMOVED*** @param {boolean=} opt_contextMenu Whether the menu should show on
***REMOVED***     {@link goog.events.EventType.CONTEXTMENU} events, false if it should
***REMOVED***     show on {@link goog.events.EventType.MOUSEDOWN} events. Default is
***REMOVED***     MOUSEDOWN.
***REMOVED*** @param {goog.math.Box=} opt_margin Margin for the popup used in positioning
***REMOVED***     algorithms.
***REMOVED***
***REMOVED*** @return {Object} An object that describes how the popup menu should be
***REMOVED***     attached to the anchoring element.
***REMOVED***
***REMOVED*** @protected
***REMOVED***
goog.ui.PopupMenu.prototype.createAttachTarget = function(
    element, opt_targetCorner, opt_menuCorner, opt_contextMenu, opt_margin) {
  if (!element) {
    return null;
  }

  var target = {
    element_: element,
    targetCorner_: opt_targetCorner,
    menuCorner_: opt_menuCorner,
    eventType_: opt_contextMenu ? goog.events.EventType.CONTEXTMENU :
        goog.events.EventType.MOUSEDOWN,
    margin_: opt_margin
 ***REMOVED*****REMOVED***

  this.targets_.set(goog.getUid(element), target);

  return target;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the object describing how the popup menu should be attach to given
***REMOVED*** element or {@code null}. The object is created and the association is formed
***REMOVED*** when {@link #attach} is invoked.
***REMOVED***
***REMOVED*** @param {Element} element DOM element.
***REMOVED*** @return {Object} The object created when {@link attach} is invoked on
***REMOVED***     {@code element}. Returns {@code null} if the element does not trigger
***REMOVED***     the menu (i.e. {@link attach} has never been invoked on
***REMOVED***     {@code element}).
***REMOVED*** @protected
***REMOVED***
goog.ui.PopupMenu.prototype.getAttachTarget = function(element) {
  return element ?
     ***REMOVED*****REMOVED*** @type {Object}***REMOVED***(this.targets_.get(goog.getUid(element))) :
      null;
***REMOVED***


***REMOVED***
***REMOVED*** @param {Element} element Any DOM element.
***REMOVED*** @return {boolean} Whether clicking on the given element will trigger the
***REMOVED***     menu.
***REMOVED***
***REMOVED*** @protected
***REMOVED***
goog.ui.PopupMenu.prototype.isAttachTarget = function(element) {
  return element ? this.targets_.containsKey(goog.getUid(element)) : false;
***REMOVED***


***REMOVED***
***REMOVED*** @return {Element} The current element where the popup is anchored, if it's
***REMOVED***     visible.
***REMOVED***
goog.ui.PopupMenu.prototype.getAttachedElement = function() {
  return this.currentAnchor_;
***REMOVED***


***REMOVED***
***REMOVED*** Attaches an event listener to a target
***REMOVED*** @param {Object} target The target to attach an event to.
***REMOVED*** @private
***REMOVED***
goog.ui.PopupMenu.prototype.attachEvent_ = function(target) {
  this.getHandler().listen(
      target.element_, target.eventType_, this.onTargetClick_);
***REMOVED***


***REMOVED***
***REMOVED*** Detaches all listeners
***REMOVED***
goog.ui.PopupMenu.prototype.detachAll = function() {
  if (this.isInDocument()) {
    var keys = this.targets_.getKeys();
    for (var i = 0; i < keys.length; i++) {
      this.detachEvent_(***REMOVED*** @type {Object}***REMOVED*** (this.targets_.get(keys[i])));
    }
  }

  this.targets_.clear();
***REMOVED***


***REMOVED***
***REMOVED*** Detaches a menu from a given element.
***REMOVED*** @param {Element} element Element whose click event should trigger the menu.
***REMOVED***
goog.ui.PopupMenu.prototype.detach = function(element) {
  if (!this.isAttachTarget(element)) {
    throw Error('Menu not attached to provided element, unable to detach.');
  }

  var key = goog.getUid(element);
  if (this.isInDocument()) {
    this.detachEvent_(***REMOVED*** @type {Object}***REMOVED*** (this.targets_.get(key)));
  }

  this.targets_.remove(key);
***REMOVED***


***REMOVED***
***REMOVED*** Detaches an event listener to a target
***REMOVED*** @param {Object} target The target to detach events from.
***REMOVED*** @private
***REMOVED***
goog.ui.PopupMenu.prototype.detachEvent_ = function(target) {
  this.getHandler().unlisten(
      target.element_, target.eventType_, this.onTargetClick_);
***REMOVED***


***REMOVED***
***REMOVED*** Sets whether the menu should toggle if it is already open.  For context
***REMOVED*** menus this should be false, for toolbar menus it makes more sense to be true.
***REMOVED*** @param {boolean} toggle The new toggle mode.
***REMOVED***
goog.ui.PopupMenu.prototype.setToggleMode = function(toggle) {
  this.toggleMode_ = toggle;
***REMOVED***


***REMOVED***
***REMOVED*** Gets whether the menu is in toggle mode
***REMOVED*** @return {boolean} toggle.
***REMOVED***
goog.ui.PopupMenu.prototype.getToggleMode = function() {
  return this.toggleMode_;
***REMOVED***


***REMOVED***
***REMOVED*** Show the menu using given positioning object.
***REMOVED*** @param {goog.positioning.AbstractPosition} position The positioning instance.
***REMOVED*** @param {goog.positioning.Corner=} opt_menuCorner The corner of the menu to be
***REMOVED***     positioned.
***REMOVED*** @param {goog.math.Box=} opt_margin A margin specified in pixels.
***REMOVED*** @param {Element=} opt_anchor The element which acts as visual anchor for this
***REMOVED***     menu.
***REMOVED***
goog.ui.PopupMenu.prototype.showWithPosition = function(position,
    opt_menuCorner, opt_margin, opt_anchor) {
  var isVisible = this.isVisible();
  if (this.isOrWasRecentlyVisible() && this.toggleMode_) {
    this.hide();
    return;
  }

  // Set current anchor before dispatching BEFORE_SHOW. This is typically useful
  // when we would need to make modifications based on the current anchor to the
  // menu just before displaying it.
  this.currentAnchor_ = opt_anchor || null;

  // Notify event handlers that the menu is about to be shown.
  if (!this.dispatchEvent(goog.ui.Component.EventType.BEFORE_SHOW)) {
    return;
  }

  var menuCorner = typeof opt_menuCorner != 'undefined' ?
                   opt_menuCorner :
                   goog.positioning.Corner.TOP_START;

  // This is a little hacky so that we can position the menu with minimal
  // flicker.

  if (!isVisible) {
    // On IE, setting visibility = 'hidden' on a visible menu
    // will cause a blur, forcing the menu to close immediately.
    this.getElement().style.visibility = 'hidden';
  }

  goog.style.showElement(this.getElement(), true);
  position.reposition(this.getElement(), menuCorner, opt_margin);

  if (!isVisible) {
    this.getElement().style.visibility = 'visible';
  }

  this.setHighlightedIndex(-1);

  // setVisible dispatches a goog.ui.Component.EventType.SHOW event, which may
  // be canceled to prevent the menu from being shown.
  this.setVisible(true);
***REMOVED***


***REMOVED***
***REMOVED*** Show the menu at a given attached target.
***REMOVED*** @param {Object} target Popup target.
***REMOVED*** @param {number} x The client-X associated with the show event.
***REMOVED*** @param {number} y The client-Y associated with the show event.
***REMOVED*** @protected
***REMOVED***
goog.ui.PopupMenu.prototype.showMenu = function(target, x, y) {
  var position = goog.isDef(target.targetCorner_) ?
      new goog.positioning.AnchoredViewportPosition(target.element_,
          target.targetCorner_, true) :
      new goog.positioning.ViewportClientPosition(x, y);
  if (position.setLastResortOverflow) {
    // This is a ViewportClientPosition, so we can set the overflow policy.
    // Allow the menu to slide from the corner rather than clipping if it is
    // completely impossible to fit it otherwise.
    position.setLastResortOverflow(goog.positioning.Overflow.ADJUST_X |
                                   goog.positioning.Overflow.ADJUST_Y);
  }
  this.showWithPosition(position, target.menuCorner_, target.margin_,
                        target.element_);
***REMOVED***


***REMOVED***
***REMOVED*** Shows the menu immediately at the given client coordinates.
***REMOVED*** @param {number} x The client-X associated with the show event.
***REMOVED*** @param {number} y The client-Y associated with the show event.
***REMOVED*** @param {goog.positioning.Corner=} opt_menuCorner Corner of the menu that
***REMOVED***     should be anchored.
***REMOVED***
goog.ui.PopupMenu.prototype.showAt = function(x, y, opt_menuCorner) {
  this.showWithPosition(
      new goog.positioning.ViewportClientPosition(x, y), opt_menuCorner);
***REMOVED***


***REMOVED***
***REMOVED*** Shows the menu immediately attached to the given element
***REMOVED*** @param {Element} element The element to show at.
***REMOVED*** @param {goog.positioning.Corner} targetCorner The corner of the target to
***REMOVED***     anchor to.
***REMOVED*** @param {goog.positioning.Corner=} opt_menuCorner Corner of the menu that
***REMOVED***     should be anchored.
***REMOVED***
goog.ui.PopupMenu.prototype.showAtElement = function(element, targetCorner,
    opt_menuCorner) {
  this.showWithPosition(
      new goog.positioning.MenuAnchoredPosition(element, targetCorner, true),
      opt_menuCorner, null, element);
***REMOVED***


***REMOVED***
***REMOVED*** Hides the menu.
***REMOVED***
goog.ui.PopupMenu.prototype.hide = function() {
  if (!this.isVisible()) {
    return;
  }

  // setVisible dispatches a goog.ui.Component.EventType.HIDE event, which may
  // be canceled to prevent the menu from being hidden.
  this.setVisible(false);
  if (!this.isVisible()) {
    // HIDE event wasn't canceled; the menu is now hidden.
    this.lastHide_ = goog.now();
    this.currentAnchor_ = null;
  }
***REMOVED***


***REMOVED***
***REMOVED*** Returns whether the menu is currently visible or was visible within about
***REMOVED*** 150 ms ago.  This stops the menu toggling back on if the toggleMode == false.
***REMOVED*** @return {boolean} Whether the popup is currently visible or was visible
***REMOVED***     within about 150 ms ago.
***REMOVED***
goog.ui.PopupMenu.prototype.isOrWasRecentlyVisible = function() {
  return this.isVisible() || this.wasRecentlyHidden();
***REMOVED***


***REMOVED***
***REMOVED*** Used to stop the menu toggling back on if the toggleMode == false.
***REMOVED*** @return {boolean} Whether the menu was recently hidden.
***REMOVED*** @protected
***REMOVED***
goog.ui.PopupMenu.prototype.wasRecentlyHidden = function() {
  return goog.now() - this.lastHide_ < goog.ui.PopupBase.DEBOUNCE_DELAY_MS;
***REMOVED***


***REMOVED***
***REMOVED*** Dismiss the popup menu when an action fires.
***REMOVED*** @param {goog.events.Event=} opt_e The optional event.
***REMOVED*** @private
***REMOVED***
goog.ui.PopupMenu.prototype.onAction_ = function(opt_e) {
  this.hide();
***REMOVED***


***REMOVED***
***REMOVED*** Handles a browser event on one of the popup targets
***REMOVED*** @param {goog.events.BrowserEvent} e The browser event.
***REMOVED*** @private
***REMOVED***
goog.ui.PopupMenu.prototype.onTargetClick_ = function(e) {
  var keys = this.targets_.getKeys();
  for (var i = 0; i < keys.length; i++) {
    var target =***REMOVED*****REMOVED*** @type {Object}***REMOVED***(this.targets_.get(keys[i]));
    if (target.element_ == e.currentTarget) {
      this.showMenu(target,
                   ***REMOVED*****REMOVED*** @type {number}***REMOVED*** (e.clientX),
                   ***REMOVED*****REMOVED*** @type {number}***REMOVED*** (e.clientY));
      e.preventDefault();
      e.stopPropagation();
      return;
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** Handles click events that propagate to the document.
***REMOVED*** @param {goog.events.BrowserEvent} e The browser event.
***REMOVED*** @protected
***REMOVED***
goog.ui.PopupMenu.prototype.onDocClick = function(e) {
  if (this.isVisible() &&
      !this.containsElement(***REMOVED*** @type {Element}***REMOVED*** (e.target))) {
    this.hide();
  }
***REMOVED***


***REMOVED***
***REMOVED*** Handles the key event target loosing focus.
***REMOVED*** @param {goog.events.BrowserEvent} e The browser event.
***REMOVED*** @protected
***REMOVED*** @override
***REMOVED***
goog.ui.PopupMenu.prototype.handleBlur = function(e) {
  goog.ui.PopupMenu.superClass_.handleBlur.call(this, e);
  this.hide();
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.ui.PopupMenu.prototype.disposeInternal = function() {
  // Always call the superclass' disposeInternal() first (Bug 715885).
  goog.ui.PopupMenu.superClass_.disposeInternal.call(this);

  // Disposes of the attachment target map.
  if (this.targets_) {
    this.targets_.clear();
    delete this.targets_;
  }
***REMOVED***
