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
***REMOVED*** @fileoverview A class representing menu items that open a submenu.
***REMOVED*** @see goog.ui.Menu
***REMOVED***
***REMOVED*** @see ../demos/submenus.html
***REMOVED*** @see ../demos/submenus2.html
***REMOVED***

goog.provide('goog.ui.SubMenu');

goog.require('goog.Timer');
goog.require('goog.asserts');
goog.require('goog.dom');
goog.require('goog.dom.classlist');
goog.require('goog.events.KeyCodes');
goog.require('goog.positioning.AnchoredViewportPosition');
goog.require('goog.positioning.Corner');
goog.require('goog.style');
goog.require('goog.ui.Component');
goog.require('goog.ui.Menu');
goog.require('goog.ui.MenuItem');
goog.require('goog.ui.SubMenuRenderer');
goog.require('goog.ui.registry');



***REMOVED***
***REMOVED*** Class representing a submenu that can be added as an item to other menus.
***REMOVED***
***REMOVED*** @param {goog.ui.ControlContent} content Text caption or DOM structure to
***REMOVED***     display as the content of the submenu (use to add icons or styling to
***REMOVED***     menus).
***REMOVED*** @param {*=} opt_model Data/model associated with the menu item.
***REMOVED*** @param {goog.dom.DomHelper=} opt_domHelper Optional dom helper used for dom
***REMOVED***     interactions.
***REMOVED*** @param {goog.ui.MenuItemRenderer=} opt_renderer Renderer used to render or
***REMOVED***     decorate the component; defaults to {@link goog.ui.SubMenuRenderer}.
***REMOVED***
***REMOVED*** @extends {goog.ui.MenuItem}
***REMOVED***
goog.ui.SubMenu = function(content, opt_model, opt_domHelper, opt_renderer) {
  goog.ui.MenuItem.call(this, content, opt_model, opt_domHelper,
                        opt_renderer || goog.ui.SubMenuRenderer.getInstance());
***REMOVED***
goog.inherits(goog.ui.SubMenu, goog.ui.MenuItem);


***REMOVED***
***REMOVED*** The delay before opening the sub menu in milliseconds.
***REMOVED*** @type {number}
***REMOVED***
goog.ui.SubMenu.MENU_DELAY_MS = 218;


***REMOVED***
***REMOVED*** Timer used to dismiss the submenu when the item becomes unhighlighted.
***REMOVED*** @type {?number}
***REMOVED*** @private
***REMOVED***
goog.ui.SubMenu.prototype.dismissTimer_ = null;


***REMOVED***
***REMOVED*** Timer used to show the submenu on mouseover.
***REMOVED*** @type {?number}
***REMOVED*** @private
***REMOVED***
goog.ui.SubMenu.prototype.showTimer_ = null;


***REMOVED***
***REMOVED*** Whether the submenu believes the menu is visible.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.ui.SubMenu.prototype.menuIsVisible_ = false;


***REMOVED***
***REMOVED*** The lazily created sub menu.
***REMOVED*** @type {goog.ui.Menu?}
***REMOVED*** @private
***REMOVED***
goog.ui.SubMenu.prototype.subMenu_ = null;


***REMOVED***
***REMOVED*** Whether or not the sub-menu was set explicitly.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.ui.SubMenu.prototype.externalSubMenu_ = false;


***REMOVED***
***REMOVED*** Whether or not to align the submenu at the end of the parent menu.
***REMOVED*** If true, the menu expands to the right in LTR languages and to the left
***REMOVED*** in RTL langauges.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.ui.SubMenu.prototype.alignToEnd_ = true;


***REMOVED***
***REMOVED*** Whether the position of this submenu may be adjusted to fit
***REMOVED*** the visible area, as in {@link goog.ui.Popup.positionAtCoordinate}.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.ui.SubMenu.prototype.isPositionAdjustable_ = false;


***REMOVED*** @override***REMOVED***
goog.ui.SubMenu.prototype.enterDocument = function() {
  goog.ui.SubMenu.superClass_.enterDocument.call(this);

  this.getHandler().listen(this.getParent(), goog.ui.Component.EventType.HIDE,
      this.onParentHidden_);

  if (this.subMenu_) {
    this.setMenuListenersEnabled_(this.subMenu_, true);
  }
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.ui.SubMenu.prototype.exitDocument = function() {
  this.getHandler().unlisten(this.getParent(), goog.ui.Component.EventType.HIDE,
      this.onParentHidden_);

  if (this.subMenu_) {
    this.setMenuListenersEnabled_(this.subMenu_, false);
    if (!this.externalSubMenu_) {
      this.subMenu_.exitDocument();
      goog.dom.removeNode(this.subMenu_.getElement());
    }
  }

  goog.ui.SubMenu.superClass_.exitDocument.call(this);
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.ui.SubMenu.prototype.disposeInternal = function() {
  if (this.subMenu_ && !this.externalSubMenu_) {
    this.subMenu_.dispose();
  }
  this.subMenu_ = null;
  goog.ui.SubMenu.superClass_.disposeInternal.call(this);
***REMOVED***


***REMOVED***
***REMOVED*** @override
***REMOVED*** Dismisses the submenu on a delay, with the result that the user needs less
***REMOVED*** accuracy when moving to submenus.  Alternate implementations could use
***REMOVED*** geometry instead of a timer.
***REMOVED*** @param {boolean} highlight Whether item should be highlighted.
***REMOVED*** @param {boolean=} opt_btnPressed Whether the mouse button is held down.
***REMOVED***
goog.ui.SubMenu.prototype.setHighlighted = function(highlight,
                                                    opt_btnPressed) {
  goog.ui.SubMenu.superClass_.setHighlighted.call(this, highlight);

  if (opt_btnPressed) {
    this.getMenu().setMouseButtonPressed(true);
  }

  if (!highlight) {
    if (this.dismissTimer_) {
      goog.Timer.clear(this.dismissTimer_);
    }
    this.dismissTimer_ = goog.Timer.callOnce(
        this.dismissSubMenu, goog.ui.SubMenu.MENU_DELAY_MS, this);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Show the submenu and ensure that all siblings are hidden.
***REMOVED***
goog.ui.SubMenu.prototype.showSubMenu = function() {
  // Only show the menu if this item is still selected. This is called on a
  // timeout, so make sure our parent still exists.
  var parent = this.getParent();
  if (parent && parent.getHighlighted() == this) {
    this.setSubMenuVisible_(true);
    this.dismissSiblings_();
    this.keyboardSetFocus_ = false;
  }
***REMOVED***


***REMOVED***
***REMOVED*** Dismisses the menu and all further submenus.
***REMOVED***
goog.ui.SubMenu.prototype.dismissSubMenu = function() {
  // Because setHighlighted calls this function on a timeout, we need to make
  // sure that the sub menu hasn't been disposed when we come back.
  var subMenu = this.subMenu_;
  if (subMenu && subMenu.getParent() == this) {
    this.setSubMenuVisible_(false);
    subMenu.forEachChild(function(child) {
      if (typeof child.dismissSubMenu == 'function') {
        child.dismissSubMenu();
      }
    });
  }
***REMOVED***


***REMOVED***
***REMOVED*** Clears the show and hide timers for the sub menu.
***REMOVED***
goog.ui.SubMenu.prototype.clearTimers = function() {
  if (this.dismissTimer_) {
    goog.Timer.clear(this.dismissTimer_);
  }
  if (this.showTimer_) {
    goog.Timer.clear(this.showTimer_);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Sets the menu item to be visible or invisible.
***REMOVED*** @param {boolean} visible Whether to show or hide the component.
***REMOVED*** @param {boolean=} opt_force If true, doesn't check whether the component
***REMOVED***     already has the requested visibility, and doesn't dispatch any events.
***REMOVED*** @return {boolean} Whether the visibility was changed.
***REMOVED*** @override
***REMOVED***
goog.ui.SubMenu.prototype.setVisible = function(visible, opt_force) {
  var visibilityChanged = goog.ui.SubMenu.superClass_.setVisible.call(this,
      visible, opt_force);
  // For menus that allow menu items to be hidden (i.e. ComboBox) ensure that
  // the submenu is hidden.
  if (visibilityChanged && !this.isVisible()) {
    this.dismissSubMenu();
  }
  return visibilityChanged;
***REMOVED***


***REMOVED***
***REMOVED*** Dismiss all the sub menus of sibling menu items.
***REMOVED*** @private
***REMOVED***
goog.ui.SubMenu.prototype.dismissSiblings_ = function() {
  this.getParent().forEachChild(function(child) {
    if (child != this && typeof child.dismissSubMenu == 'function') {
      child.dismissSubMenu();
      child.clearTimers();
    }
  }, this);
***REMOVED***


***REMOVED***
***REMOVED*** Handles a key event that is passed to the menu item from its parent because
***REMOVED*** it is highlighted.  If the right key is pressed the sub menu takes control
***REMOVED*** and delegates further key events to its menu until it is dismissed OR the
***REMOVED*** left key is pressed.
***REMOVED*** @param {goog.events.KeyEvent} e A key event.
***REMOVED*** @return {boolean} Whether the event was handled.
***REMOVED*** @override
***REMOVED***
goog.ui.SubMenu.prototype.handleKeyEvent = function(e) {
  var keyCode = e.keyCode;
  var openKeyCode = this.isRightToLeft() ? goog.events.KeyCodes.LEFT :
      goog.events.KeyCodes.RIGHT;
  var closeKeyCode = this.isRightToLeft() ? goog.events.KeyCodes.RIGHT :
      goog.events.KeyCodes.LEFT;

  if (!this.menuIsVisible_) {
    // Menu item doesn't have keyboard control and the right key was pressed.
    // So open take keyboard control and open the sub menu.
    if (this.isEnabled() &&
        (keyCode == openKeyCode || keyCode == this.getMnemonic())) {
      this.showSubMenu();
      this.getMenu().highlightFirst();
      this.clearTimers();

    // The menu item doesn't currently care about the key events so let the
    // parent menu handle them accordingly .
    } else {
      return false;
    }

  // Menu item has control, so let its menu try to handle the keys (this may
  // in turn be handled by sub-sub menus).
  } else if (this.getMenu().handleKeyEvent(e)) {
    // Nothing to do

  // The menu has control and the key hasn't yet been handled, on left arrow
  // we turn off key control.
  } else if (keyCode == closeKeyCode) {
    this.dismissSubMenu();

  } else {
    // Submenu didn't handle the key so let the parent decide what to do.
    return false;
  }

  e.preventDefault();
  return true;
***REMOVED***


***REMOVED***
***REMOVED*** Listens to the sub menus items and ensures that this menu item is selected
***REMOVED*** while dismissing the others.  This handles the case when the user mouses
***REMOVED*** over other items on their way to the sub menu.
***REMOVED*** @param {goog.events.Event} e Enter event to handle.
***REMOVED*** @private
***REMOVED***
goog.ui.SubMenu.prototype.onChildEnter_ = function(e) {
  if (this.subMenu_.getParent() == this) {
    this.clearTimers();
    this.getParentEventTarget().setHighlighted(this);
    this.dismissSiblings_();
  }
***REMOVED***


***REMOVED***
***REMOVED*** Listens to the parent menu's hide event and ensures that all submenus are
***REMOVED*** hidden at the same time.
***REMOVED*** @param {goog.events.Event} e The event.
***REMOVED*** @private
***REMOVED***
goog.ui.SubMenu.prototype.onParentHidden_ = function(e) {
  // Ignore propagated events
  if (e.target == this.getParentEventTarget()) {
    // TODO(user): Using an event for this is expensive.  Consider having a
    // generalized interface that the parent menu calls on its children when
    // it is hidden.
    this.dismissSubMenu();
    this.clearTimers();
  }
***REMOVED***


***REMOVED***
***REMOVED*** @override
***REMOVED*** Sets a timer to show the submenu and then dispatches an ENTER event to the
***REMOVED*** parent menu.
***REMOVED*** @param {goog.events.BrowserEvent} e Mouse event to handle.
***REMOVED*** @protected
***REMOVED***
goog.ui.SubMenu.prototype.handleMouseOver = function(e) {
  if (this.isEnabled()) {
    this.clearTimers();
    this.showTimer_ = goog.Timer.callOnce(
        this.showSubMenu, goog.ui.SubMenu.MENU_DELAY_MS, this);
  }
  goog.ui.SubMenu.superClass_.handleMouseOver.call(this, e);
***REMOVED***


***REMOVED***
***REMOVED*** Overrides the default mouseup event handler, so that the ACTION isn't
***REMOVED*** dispatched for the submenu itself, instead the submenu is shown instantly.
***REMOVED*** @param {goog.events.Event} e The browser event.
***REMOVED*** @return {boolean} True if the action was allowed to proceed, false otherwise.
***REMOVED*** @override
***REMOVED***
goog.ui.SubMenu.prototype.performActionInternal = function(e) {
  this.clearTimers();
  var shouldHandleClick = this.isSupportedState(
      goog.ui.Component.State.SELECTED);
  if (shouldHandleClick) {
    return goog.ui.SubMenu.superClass_.performActionInternal.call(this, e);
  } else {
    this.showSubMenu();
    return true;
  }
***REMOVED***


***REMOVED***
***REMOVED*** Sets the visiblility of the sub menu.
***REMOVED*** @param {boolean} visible Whether to show menu.
***REMOVED*** @private
***REMOVED***
goog.ui.SubMenu.prototype.setSubMenuVisible_ = function(visible) {
  // Dispatch OPEN event before calling getMenu(), so we can create the menu
  // lazily on first access.
  this.dispatchEvent(goog.ui.Component.getStateTransitionEvent(
      goog.ui.Component.State.OPENED, visible));
  var subMenu = this.getMenu();
  if (visible != this.menuIsVisible_) {
    goog.dom.classlist.enable(
        goog.asserts.assert(this.getElement()),
        goog.getCssName('goog-submenu-open'), visible);
  }
  if (visible != subMenu.isVisible()) {
    if (visible) {
      // Lazy-render menu when first shown, if needed.
      if (!subMenu.isInDocument()) {
        subMenu.render();
      }
      subMenu.setHighlightedIndex(-1);
    }
    subMenu.setVisible(visible);
    // We must position after the menu is visible, otherwise positioning logic
    // breaks in RTL.
    if (visible) {
      this.positionSubMenu();
    }
  }
  this.menuIsVisible_ = visible;
***REMOVED***


***REMOVED***
***REMOVED*** Attaches or detaches menu event listeners to/from the given menu.  Called
***REMOVED*** each time a menu is attached to or detached from the submenu.
***REMOVED*** @param {goog.ui.Menu} menu Menu on which to listen for events.
***REMOVED*** @param {boolean} attach Whether to attach or detach event listeners.
***REMOVED*** @private
***REMOVED***
goog.ui.SubMenu.prototype.setMenuListenersEnabled_ = function(menu, attach) {
  var handler = this.getHandler();
  var method = attach ? handler.listen : handler.unlisten;
  method.call(handler, menu, goog.ui.Component.EventType.ENTER,
      this.onChildEnter_);
***REMOVED***


***REMOVED***
***REMOVED*** Sets whether the submenu is aligned at the end of the parent menu.
***REMOVED*** @param {boolean} alignToEnd True to align to end, false to align to start.
***REMOVED***
goog.ui.SubMenu.prototype.setAlignToEnd = function(alignToEnd) {
  if (alignToEnd != this.alignToEnd_) {
    this.alignToEnd_ = alignToEnd;
    if (this.isInDocument()) {
      // Completely re-render the widget.
      var oldElement = this.getElement();
      this.exitDocument();

      if (oldElement.nextSibling) {
        this.renderBefore(***REMOVED*** @type {!Element}***REMOVED*** (oldElement.nextSibling));
      } else {
        this.render(***REMOVED*** @type {Element}***REMOVED*** (oldElement.parentNode));
      }
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** Determines whether the submenu is aligned at the end of the parent menu.
***REMOVED*** @return {boolean} True if aligned to the end (the default), false if
***REMOVED***     aligned to the start.
***REMOVED***
goog.ui.SubMenu.prototype.isAlignedToEnd = function() {
  return this.alignToEnd_;
***REMOVED***


***REMOVED***
***REMOVED*** Positions the submenu. This method should be called if the sub menu is
***REMOVED*** opened and the menu element's size changes (e.g., when adding/removing items
***REMOVED*** to an opened sub menu).
***REMOVED***
goog.ui.SubMenu.prototype.positionSubMenu = function() {
  var position = new goog.positioning.AnchoredViewportPosition(
      this.getElement(), this.isAlignedToEnd() ?
      goog.positioning.Corner.TOP_END : goog.positioning.Corner.TOP_START,
      this.isPositionAdjustable_);

  // TODO(user): Clean up popup code and have this be a one line call
  var subMenu = this.getMenu();
  var el = subMenu.getElement();
  if (!subMenu.isVisible()) {
    el.style.visibility = 'hidden';
    goog.style.setElementShown(el, true);
  }

  position.reposition(
      el, this.isAlignedToEnd() ?
      goog.positioning.Corner.TOP_START : goog.positioning.Corner.TOP_END);

  if (!subMenu.isVisible()) {
    goog.style.setElementShown(el, false);
    el.style.visibility = 'visible';
  }
***REMOVED***


// Methods delegated to sub-menu but accessible here for convinience


***REMOVED***
***REMOVED*** Adds a new menu item at the end of the menu.
***REMOVED*** @param {goog.ui.MenuHeader|goog.ui.MenuItem|goog.ui.MenuSeparator} item Menu
***REMOVED***     item to add to the menu.
***REMOVED***
goog.ui.SubMenu.prototype.addItem = function(item) {
  this.getMenu().addChild(item, true);
***REMOVED***


***REMOVED***
***REMOVED*** Adds a new menu item at a specific index in the menu.
***REMOVED*** @param {goog.ui.MenuHeader|goog.ui.MenuItem|goog.ui.MenuSeparator} item Menu
***REMOVED***     item to add to the menu.
***REMOVED*** @param {number} n Index at which to insert the menu item.
***REMOVED***
goog.ui.SubMenu.prototype.addItemAt = function(item, n) {
  this.getMenu().addChildAt(item, n, true);
***REMOVED***


***REMOVED***
***REMOVED*** Removes an item from the menu and disposes it.
***REMOVED*** @param {goog.ui.MenuItem} item The menu item to remove.
***REMOVED***
goog.ui.SubMenu.prototype.removeItem = function(item) {
  var child = this.getMenu().removeChild(item, true);
  if (child) {
    child.dispose();
  }
***REMOVED***


***REMOVED***
***REMOVED*** Removes a menu item at a given index in the menu and disposes it.
***REMOVED*** @param {number} n Index of item.
***REMOVED***
goog.ui.SubMenu.prototype.removeItemAt = function(n) {
  var child = this.getMenu().removeChildAt(n, true);
  if (child) {
    child.dispose();
  }
***REMOVED***


***REMOVED***
***REMOVED*** Returns a reference to the menu item at a given index.
***REMOVED*** @param {number} n Index of menu item.
***REMOVED*** @return {goog.ui.Component} Reference to the menu item.
***REMOVED***
goog.ui.SubMenu.prototype.getItemAt = function(n) {
  return this.getMenu().getChildAt(n);
***REMOVED***


***REMOVED***
***REMOVED*** Returns the number of items in the sub menu (including separators).
***REMOVED*** @return {number} The number of items in the menu.
***REMOVED***
goog.ui.SubMenu.prototype.getItemCount = function() {
  return this.getMenu().getChildCount();
***REMOVED***


***REMOVED***
***REMOVED*** Returns the menu items contained in the sub menu.
***REMOVED*** @return {!Array.<!goog.ui.MenuItem>} An array of menu items.
***REMOVED*** @deprecated Use getItemAt/getItemCount instead.
***REMOVED***
goog.ui.SubMenu.prototype.getItems = function() {
  return this.getMenu().getItems();
***REMOVED***


***REMOVED***
***REMOVED*** Gets a reference to the submenu's actual menu.
***REMOVED*** @return {!goog.ui.Menu} Reference to the object representing the sub menu.
***REMOVED***
goog.ui.SubMenu.prototype.getMenu = function() {
  if (!this.subMenu_) {
    this.setMenu(
        new goog.ui.Menu(this.getDomHelper()), /* opt_internal***REMOVED*** true);
  } else if (this.externalSubMenu_ && this.subMenu_.getParent() != this) {
    // Since it is possible for the same popup menu to be attached to multiple
    // submenus, we need to ensure that it has the correct parent event target.
    this.subMenu_.setParent(this);
  }
  // Always create the menu DOM, for backward compatibility.
  if (!this.subMenu_.getElement()) {
    this.subMenu_.createDom();
  }
  return this.subMenu_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the submenu to a specific menu.
***REMOVED*** @param {goog.ui.Menu} menu The menu to show when this item is selected.
***REMOVED*** @param {boolean=} opt_internal Whether this menu is an "internal" menu, and
***REMOVED***     should be disposed of when this object is disposed of.
***REMOVED***
goog.ui.SubMenu.prototype.setMenu = function(menu, opt_internal) {
  var oldMenu = this.subMenu_;
  if (menu != oldMenu) {
    if (oldMenu) {
      this.dismissSubMenu();
      if (this.isInDocument()) {
        this.setMenuListenersEnabled_(oldMenu, false);
      }
    }

    this.subMenu_ = menu;
    this.externalSubMenu_ = !opt_internal;

    if (menu) {
      menu.setParent(this);
      // There's no need to dispatch a HIDE event during submenu construction.
      menu.setVisible(false, /* opt_force***REMOVED*** true);
      menu.setAllowAutoFocus(false);
      menu.setFocusable(false);
      if (this.isInDocument()) {
        this.setMenuListenersEnabled_(menu, true);
      }
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** Returns true if the provided element is to be considered inside the menu for
***REMOVED*** purposes such as dismissing the menu on an event.  This is so submenus can
***REMOVED*** make use of elements outside their own DOM.
***REMOVED*** @param {Element} element The element to test for.
***REMOVED*** @return {boolean} Whether or not the provided element is contained.
***REMOVED***
goog.ui.SubMenu.prototype.containsElement = function(element) {
  return this.getMenu().containsElement(element);
***REMOVED***


***REMOVED***
***REMOVED*** @param {boolean} isAdjustable Whether this submenu is adjustable.
***REMOVED***
goog.ui.SubMenu.prototype.setPositionAdjustable = function(isAdjustable) {
  this.isPositionAdjustable_ = !!isAdjustable;
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} Whether this submenu is adjustable.
***REMOVED***
goog.ui.SubMenu.prototype.isPositionAdjustable = function() {
  return this.isPositionAdjustable_;
***REMOVED***


// Register a decorator factory function for goog.ui.SubMenus.
goog.ui.registry.setDecoratorByClassName(goog.getCssName('goog-submenu'),
    function() {
      return new goog.ui.SubMenu(null);
    });
