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
***REMOVED*** @fileoverview A menu button control.
***REMOVED***
***REMOVED*** @author attila@google.com (Attila Bodis)
***REMOVED*** @see ../demos/menubutton.html
***REMOVED***

goog.provide('goog.ui.MenuButton');

goog.require('goog.Timer');
goog.require('goog.a11y.aria');
goog.require('goog.a11y.aria.State');
goog.require('goog.asserts');
goog.require('goog.dom');
***REMOVED***
goog.require('goog.events.KeyCodes');
goog.require('goog.events.KeyHandler.EventType');
goog.require('goog.math.Box');
goog.require('goog.math.Rect');
goog.require('goog.positioning');
goog.require('goog.positioning.Corner');
goog.require('goog.positioning.MenuAnchoredPosition');
goog.require('goog.style');
goog.require('goog.ui.Button');
goog.require('goog.ui.Component.EventType');
goog.require('goog.ui.Component.State');
goog.require('goog.ui.Menu');
goog.require('goog.ui.MenuButtonRenderer');
goog.require('goog.ui.registry');
goog.require('goog.userAgent');
goog.require('goog.userAgent.product');



***REMOVED***
***REMOVED*** A menu button control.  Extends {@link goog.ui.Button} by composing a button
***REMOVED*** with a dropdown arrow and a popup menu.
***REMOVED***
***REMOVED*** @param {goog.ui.ControlContent} content Text caption or existing DOM
***REMOVED***     structure to display as the button's caption (if any).
***REMOVED*** @param {goog.ui.Menu=} opt_menu Menu to render under the button when clicked.
***REMOVED*** @param {goog.ui.ButtonRenderer=} opt_renderer Renderer used to render or
***REMOVED***     decorate the menu button; defaults to {@link goog.ui.MenuButtonRenderer}.
***REMOVED*** @param {goog.dom.DomHelper=} opt_domHelper Optional DOM hepler, used for
***REMOVED***     document interaction.
***REMOVED***
***REMOVED*** @extends {goog.ui.Button}
***REMOVED***
goog.ui.MenuButton = function(content, opt_menu, opt_renderer, opt_domHelper) {
  goog.ui.Button.call(this, content, opt_renderer ||
      goog.ui.MenuButtonRenderer.getInstance(), opt_domHelper);

  // Menu buttons support the OPENED state.
  this.setSupportedState(goog.ui.Component.State.OPENED, true);

 ***REMOVED*****REMOVED***
  ***REMOVED*** The menu position on this button.
  ***REMOVED*** @type {!goog.positioning.AnchoredPosition}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.menuPosition_ = new goog.positioning.MenuAnchoredPosition(
      null, goog.positioning.Corner.BOTTOM_START);

  if (opt_menu) {
    this.setMenu(opt_menu);
  }
  this.menuMargin_ = null;
  this.timer_ = new goog.Timer(500);  // 0.5 sec

  // Phones running iOS prior to version 4.2.
  if ((goog.userAgent.product.IPHONE || goog.userAgent.product.IPAD) &&
      // Check the webkit version against the version for iOS 4.2.1.
      !goog.userAgent.isVersion('533.17.9')) {
    // @bug 4322060 This is required so that the menu works correctly on
    // iOS prior to version 4.2. Otherwise, the blur action closes the menu
    // before the menu button click can be processed.
    this.setFocusablePopupMenu(true);
  }
***REMOVED***
goog.inherits(goog.ui.MenuButton, goog.ui.Button);


***REMOVED***
***REMOVED*** The menu.
***REMOVED*** @type {goog.ui.Menu|undefined}
***REMOVED*** @private
***REMOVED***
goog.ui.MenuButton.prototype.menu_;


***REMOVED***
***REMOVED*** The position element.  If set, use positionElement_ to position the
***REMOVED*** popup menu instead of the default which is to use the menu button element.
***REMOVED*** @type {Element|undefined}
***REMOVED*** @private
***REMOVED***
goog.ui.MenuButton.prototype.positionElement_;


***REMOVED***
***REMOVED*** The margin to apply to the menu's position when it is shown.  If null, no
***REMOVED*** margin will be applied.
***REMOVED*** @type {goog.math.Box}
***REMOVED*** @private
***REMOVED***
goog.ui.MenuButton.prototype.menuMargin_;


***REMOVED***
***REMOVED*** Whether the attached popup menu is focusable or not (defaults to false).
***REMOVED*** Popup menus attached to menu buttons usually don't need to be focusable,
***REMOVED*** i.e. the button retains keyboard focus, and forwards key events to the
***REMOVED*** menu for processing.  However, menus like {@link goog.ui.FilteredMenu}
***REMOVED*** need to be focusable.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.ui.MenuButton.prototype.isFocusablePopupMenu_ = false;


***REMOVED***
***REMOVED*** A Timer to correct menu position.
***REMOVED*** @type {goog.Timer}
***REMOVED*** @private
***REMOVED***
goog.ui.MenuButton.prototype.timer_;


***REMOVED***
***REMOVED*** The bounding rectangle of the button element.
***REMOVED*** @type {goog.math.Rect}
***REMOVED*** @private
***REMOVED***
goog.ui.MenuButton.prototype.buttonRect_;


***REMOVED***
***REMOVED*** The viewport rectangle.
***REMOVED*** @type {goog.math.Box}
***REMOVED*** @private
***REMOVED***
goog.ui.MenuButton.prototype.viewportBox_;


***REMOVED***
***REMOVED*** The original size.
***REMOVED*** @type {goog.math.Size|undefined}
***REMOVED*** @private
***REMOVED***
goog.ui.MenuButton.prototype.originalSize_;


***REMOVED***
***REMOVED*** Do we render the drop down menu as a sibling to the label, or at the end
***REMOVED*** of the current dom?
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.ui.MenuButton.prototype.renderMenuAsSibling_ = false;


***REMOVED***
***REMOVED*** Sets up event handlers specific to menu buttons.
***REMOVED*** @override
***REMOVED***
goog.ui.MenuButton.prototype.enterDocument = function() {
  goog.ui.MenuButton.superClass_.enterDocument.call(this);
  if (this.menu_) {
    this.attachMenuEventListeners_(this.menu_, true);
  }
  var element = this.getElement();
  goog.asserts.assert(element, 'The menu button DOM element cannot be null.');
  goog.a11y.aria.setState(element, goog.a11y.aria.State.HASPOPUP, 'true');
***REMOVED***


***REMOVED***
***REMOVED*** Removes event handlers specific to menu buttons, and ensures that the
***REMOVED*** attached menu also exits the document.
***REMOVED*** @override
***REMOVED***
goog.ui.MenuButton.prototype.exitDocument = function() {
  goog.ui.MenuButton.superClass_.exitDocument.call(this);
  if (this.menu_) {
    this.setOpen(false);
    this.menu_.exitDocument();
    this.attachMenuEventListeners_(this.menu_, false);

    var menuElement = this.menu_.getElement();
    if (menuElement) {
      goog.dom.removeNode(menuElement);
    }
  }
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.ui.MenuButton.prototype.disposeInternal = function() {
  goog.ui.MenuButton.superClass_.disposeInternal.call(this);
  if (this.menu_) {
    this.menu_.dispose();
    delete this.menu_;
  }
  delete this.positionElement_;
  this.timer_.dispose();
***REMOVED***


***REMOVED***
***REMOVED*** Handles mousedown events.  Invokes the superclass implementation to dispatch
***REMOVED*** an ACTIVATE event and activate the button.  Also toggles the visibility of
***REMOVED*** the attached menu.
***REMOVED*** @param {goog.events.Event} e Mouse event to handle.
***REMOVED*** @override
***REMOVED*** @protected
***REMOVED***
goog.ui.MenuButton.prototype.handleMouseDown = function(e) {
  goog.ui.MenuButton.superClass_.handleMouseDown.call(this, e);
  if (this.isActive()) {
    // The component was allowed to activate; toggle menu visibility.
    this.setOpen(!this.isOpen(), e);
    if (this.menu_) {
      this.menu_.setMouseButtonPressed(this.isOpen());
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** Handles mouseup events.  Invokes the superclass implementation to dispatch
***REMOVED*** an ACTION event and deactivate the button.
***REMOVED*** @param {goog.events.Event} e Mouse event to handle.
***REMOVED*** @override
***REMOVED*** @protected
***REMOVED***
goog.ui.MenuButton.prototype.handleMouseUp = function(e) {
  goog.ui.MenuButton.superClass_.handleMouseUp.call(this, e);
  if (this.menu_ && !this.isActive()) {
    this.menu_.setMouseButtonPressed(false);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Performs the appropriate action when the menu button is activated by the
***REMOVED*** user.  Overrides the superclass implementation by not dispatching an {@code
***REMOVED*** ACTION} event, because menu buttons exist only to reveal menus, not to
***REMOVED*** perform actions themselves.  Calls {@link #setActive} to deactivate the
***REMOVED*** button.
***REMOVED*** @param {goog.events.Event} e Mouse or key event that triggered the action.
***REMOVED*** @return {boolean} Whether the action was allowed to proceed.
***REMOVED*** @override
***REMOVED*** @protected
***REMOVED***
goog.ui.MenuButton.prototype.performActionInternal = function(e) {
  this.setActive(false);
  return true;
***REMOVED***


***REMOVED***
***REMOVED*** Handles mousedown events over the document.  If the mousedown happens over
***REMOVED*** an element unrelated to the component, hides the menu.
***REMOVED*** TODO(attila): Reconcile this with goog.ui.Popup (and handle frames/windows).
***REMOVED*** @param {goog.events.BrowserEvent} e Mouse event to handle.
***REMOVED*** @protected
***REMOVED***
goog.ui.MenuButton.prototype.handleDocumentMouseDown = function(e) {
  if (this.menu_ &&
      this.menu_.isVisible() &&
      !this.containsElement(***REMOVED*** @type {Element}***REMOVED*** (e.target))) {
    // User clicked somewhere else in the document while the menu was visible;
    // dismiss menu.
    this.setOpen(false);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Returns true if the given element is to be considered part of the component,
***REMOVED*** even if it isn't a DOM descendant of the component's root element.
***REMOVED*** @param {Element} element Element to test (if any).
***REMOVED*** @return {boolean} Whether the element is considered part of the component.
***REMOVED*** @protected
***REMOVED***
goog.ui.MenuButton.prototype.containsElement = function(element) {
  return element && goog.dom.contains(this.getElement(), element) ||
      this.menu_ && this.menu_.containsElement(element) || false;
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.ui.MenuButton.prototype.handleKeyEventInternal = function(e) {
  // Handle SPACE on keyup and all other keys on keypress.
  if (e.keyCode == goog.events.KeyCodes.SPACE) {
    // Prevent page scrolling in Chrome.
    e.preventDefault();
    if (e.type != goog.events.EventType.KEYUP) {
      // Ignore events because KeyCodes.SPACE is handled further down.
      return true;
    }
  } else if (e.type != goog.events.KeyHandler.EventType.KEY) {
    return false;
  }

  if (this.menu_ && this.menu_.isVisible()) {
    // Menu is open.
    var handledByMenu = this.menu_.handleKeyEvent(e);
    if (e.keyCode == goog.events.KeyCodes.ESC) {
      // Dismiss the menu.
      this.setOpen(false);
      return true;
    }
    return handledByMenu;
  }

  if (e.keyCode == goog.events.KeyCodes.DOWN ||
      e.keyCode == goog.events.KeyCodes.UP ||
      e.keyCode == goog.events.KeyCodes.SPACE ||
      e.keyCode == goog.events.KeyCodes.ENTER) {
    // Menu is closed, and the user hit the down/up/space/enter key; open menu.
    this.setOpen(true);
    return true;
  }

  // Key event wasn't handled by the component.
  return false;
***REMOVED***


***REMOVED***
***REMOVED*** Handles {@code ACTION} events dispatched by an activated menu item.
***REMOVED*** @param {goog.events.Event} e Action event to handle.
***REMOVED*** @protected
***REMOVED***
goog.ui.MenuButton.prototype.handleMenuAction = function(e) {
  // Close the menu on click.
  this.setOpen(false);
***REMOVED***


***REMOVED***
***REMOVED*** Handles {@code BLUR} events dispatched by the popup menu by closing it.
***REMOVED*** Only registered if the menu is focusable.
***REMOVED*** @param {goog.events.Event} e Blur event dispatched by a focusable menu.
***REMOVED***
goog.ui.MenuButton.prototype.handleMenuBlur = function(e) {
  // Close the menu when it reports that it lost focus, unless the button is
  // pressed (active).
  if (!this.isActive()) {
    this.setOpen(false);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Handles blur events dispatched by the button's key event target when it
***REMOVED*** loses keyboard focus by closing the popup menu (unless it is focusable).
***REMOVED*** Only registered if the button is focusable.
***REMOVED*** @param {goog.events.Event} e Blur event dispatched by the menu button.
***REMOVED*** @override
***REMOVED*** @protected
***REMOVED***
goog.ui.MenuButton.prototype.handleBlur = function(e) {
  if (!this.isFocusablePopupMenu()) {
    this.setOpen(false);
  }
  goog.ui.MenuButton.superClass_.handleBlur.call(this, e);
***REMOVED***


***REMOVED***
***REMOVED*** Returns the menu attached to the button.  If no menu is attached, creates a
***REMOVED*** new empty menu.
***REMOVED*** @return {goog.ui.Menu} Popup menu attached to the menu button.
***REMOVED***
goog.ui.MenuButton.prototype.getMenu = function() {
  if (!this.menu_) {
    this.setMenu(new goog.ui.Menu(this.getDomHelper()));
  }
  return this.menu_ || null;
***REMOVED***


***REMOVED***
***REMOVED*** Replaces the menu attached to the button with the argument, and returns the
***REMOVED*** previous menu (if any).
***REMOVED*** @param {goog.ui.Menu?} menu New menu to be attached to the menu button (null
***REMOVED***     to remove the menu).
***REMOVED*** @return {goog.ui.Menu|undefined} Previous menu (undefined if none).
***REMOVED***
goog.ui.MenuButton.prototype.setMenu = function(menu) {
  var oldMenu = this.menu_;

  // Do nothing unless the new menu is different from the current one.
  if (menu != oldMenu) {
    if (oldMenu) {
      this.setOpen(false);
      if (this.isInDocument()) {
        this.attachMenuEventListeners_(oldMenu, false);
      }
      delete this.menu_;
    }
    if (menu) {
      this.menu_ = menu;
      menu.setParent(this);
      menu.setVisible(false);
      menu.setAllowAutoFocus(this.isFocusablePopupMenu());
      if (this.isInDocument()) {
        this.attachMenuEventListeners_(menu, true);
      }
    }
  }

  return oldMenu;
***REMOVED***


***REMOVED***
***REMOVED*** Specify which positioning algorithm to use.
***REMOVED***
***REMOVED*** This method is preferred over the fine-grained positioning methods like
***REMOVED*** setPositionElement, setAlignMenuToStart, and setScrollOnOverflow. Calling
***REMOVED*** this method will override settings by those methods.
***REMOVED***
***REMOVED*** @param {goog.positioning.AnchoredPosition} position The position of the
***REMOVED***     Menu the button. If the position has a null anchor, we will use the
***REMOVED***     menubutton element as the anchor.
***REMOVED***
goog.ui.MenuButton.prototype.setMenuPosition = function(position) {
  if (position) {
    this.menuPosition_ = position;
    this.positionElement_ = position.element;
  }
***REMOVED***


***REMOVED***
***REMOVED*** Sets an element for anchoring the menu.
***REMOVED*** @param {Element} positionElement New element to use for
***REMOVED***     positioning the dropdown menu.  Null to use the default behavior
***REMOVED***     of positioning to this menu button.
***REMOVED***
goog.ui.MenuButton.prototype.setPositionElement = function(
    positionElement) {
  this.positionElement_ = positionElement;
  this.positionMenu();
***REMOVED***


***REMOVED***
***REMOVED*** Sets a margin that will be applied to the menu's position when it is shown.
***REMOVED*** If null, no margin will be applied.
***REMOVED*** @param {goog.math.Box} margin Margin to apply.
***REMOVED***
goog.ui.MenuButton.prototype.setMenuMargin = function(margin) {
  this.menuMargin_ = margin;
***REMOVED***


***REMOVED***
***REMOVED*** Adds a new menu item at the end of the menu.
***REMOVED*** @param {goog.ui.MenuItem|goog.ui.MenuSeparator|goog.ui.Control} item Menu
***REMOVED***     item to add to the menu.
***REMOVED***
goog.ui.MenuButton.prototype.addItem = function(item) {
  this.getMenu().addChild(item, true);
***REMOVED***


***REMOVED***
***REMOVED*** Adds a new menu item at the specific index in the menu.
***REMOVED*** @param {goog.ui.MenuItem|goog.ui.MenuSeparator} item Menu item to add to the
***REMOVED***     menu.
***REMOVED*** @param {number} index Index at which to insert the menu item.
***REMOVED***
goog.ui.MenuButton.prototype.addItemAt = function(item, index) {
  this.getMenu().addChildAt(item, index, true);
***REMOVED***


***REMOVED***
***REMOVED*** Removes the item from the menu and disposes of it.
***REMOVED*** @param {goog.ui.MenuItem|goog.ui.MenuSeparator} item The menu item to remove.
***REMOVED***
goog.ui.MenuButton.prototype.removeItem = function(item) {
  var child = this.getMenu().removeChild(item, true);
  if (child) {
    child.dispose();
  }
***REMOVED***


***REMOVED***
***REMOVED*** Removes the menu item at a given index in the menu and disposes of it.
***REMOVED*** @param {number} index Index of item.
***REMOVED***
goog.ui.MenuButton.prototype.removeItemAt = function(index) {
  var child = this.getMenu().removeChildAt(index, true);
  if (child) {
    child.dispose();
  }
***REMOVED***


***REMOVED***
***REMOVED*** Returns the menu item at a given index.
***REMOVED*** @param {number} index Index of menu item.
***REMOVED*** @return {goog.ui.MenuItem?} Menu item (null if not found).
***REMOVED***
goog.ui.MenuButton.prototype.getItemAt = function(index) {
  return this.menu_ ?
     ***REMOVED*****REMOVED*** @type {goog.ui.MenuItem}***REMOVED*** (this.menu_.getChildAt(index)) : null;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the number of items in the menu (including separators).
***REMOVED*** @return {number} The number of items in the menu.
***REMOVED***
goog.ui.MenuButton.prototype.getItemCount = function() {
  return this.menu_ ? this.menu_.getChildCount() : 0;
***REMOVED***


***REMOVED***
***REMOVED*** Shows/hides the menu button based on the value of the argument.  Also hides
***REMOVED*** the popup menu if the button is being hidden.
***REMOVED*** @param {boolean} visible Whether to show or hide the button.
***REMOVED*** @param {boolean=} opt_force If true, doesn't check whether the component
***REMOVED***     already has the requested visibility, and doesn't dispatch any events.
***REMOVED*** @return {boolean} Whether the visibility was changed.
***REMOVED*** @override
***REMOVED***
goog.ui.MenuButton.prototype.setVisible = function(visible, opt_force) {
  var visibilityChanged = goog.ui.MenuButton.superClass_.setVisible.call(this,
      visible, opt_force);
  if (visibilityChanged && !this.isVisible()) {
    this.setOpen(false);
  }
  return visibilityChanged;
***REMOVED***


***REMOVED***
***REMOVED*** Enables/disables the menu button based on the value of the argument, and
***REMOVED*** updates its CSS styling.  Also hides the popup menu if the button is being
***REMOVED*** disabled.
***REMOVED*** @param {boolean} enable Whether to enable or disable the button.
***REMOVED*** @override
***REMOVED***
goog.ui.MenuButton.prototype.setEnabled = function(enable) {
  goog.ui.MenuButton.superClass_.setEnabled.call(this, enable);
  if (!this.isEnabled()) {
    this.setOpen(false);
  }
***REMOVED***


// TODO(nicksantos): AlignMenuToStart and ScrollOnOverflow and PositionElement
// should all be deprecated, in favor of people setting their own
// AnchoredPosition with the parameters they need. Right now, we try
// to be backwards-compatible as possible, but this is incomplete because
// the APIs are non-orthogonal.


***REMOVED***
***REMOVED*** @return {boolean} Whether the menu is aligned to the start of the button
***REMOVED***     (left if the render direction is left-to-right, right if the render
***REMOVED***     direction is right-to-left).
***REMOVED***
goog.ui.MenuButton.prototype.isAlignMenuToStart = function() {
  var corner = this.menuPosition_.corner;
  return corner == goog.positioning.Corner.BOTTOM_START ||
      corner == goog.positioning.Corner.TOP_START;
***REMOVED***


***REMOVED***
***REMOVED*** Sets whether the menu is aligned to the start or the end of the button.
***REMOVED*** @param {boolean} alignToStart Whether the menu is to be aligned to the start
***REMOVED***     of the button (left if the render direction is left-to-right, right if
***REMOVED***     the render direction is right-to-left).
***REMOVED***
goog.ui.MenuButton.prototype.setAlignMenuToStart = function(alignToStart) {
  this.menuPosition_.corner = alignToStart ?
      goog.positioning.Corner.BOTTOM_START :
      goog.positioning.Corner.BOTTOM_END;
***REMOVED***


***REMOVED***
***REMOVED*** Sets whether the menu should scroll when it's too big to fix vertically on
***REMOVED*** the screen.  The css of the menu element should have overflow set to auto.
***REMOVED*** Note: Adding or removing items while the menu is open will not work correctly
***REMOVED*** if scrollOnOverflow is on.
***REMOVED*** @param {boolean} scrollOnOverflow Whether the menu should scroll when too big
***REMOVED***     to fit on the screen.  If false, adjust logic will be used to try and
***REMOVED***     reposition the menu to fit.
***REMOVED***
goog.ui.MenuButton.prototype.setScrollOnOverflow = function(scrollOnOverflow) {
  if (this.menuPosition_.setLastResortOverflow) {
    var overflowX = goog.positioning.Overflow.ADJUST_X;
    var overflowY = scrollOnOverflow ?
        goog.positioning.Overflow.RESIZE_HEIGHT :
        goog.positioning.Overflow.ADJUST_Y;
    this.menuPosition_.setLastResortOverflow(overflowX | overflowY);
  }
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} Wether the menu will scroll when it's to big to fit
***REMOVED***     vertically on the screen.
***REMOVED***
goog.ui.MenuButton.prototype.isScrollOnOverflow = function() {
  return this.menuPosition_.getLastResortOverflow &&
      !!(this.menuPosition_.getLastResortOverflow() &
         goog.positioning.Overflow.RESIZE_HEIGHT);
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} Whether the attached menu is focusable.
***REMOVED***
goog.ui.MenuButton.prototype.isFocusablePopupMenu = function() {
  return this.isFocusablePopupMenu_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets whether the attached popup menu is focusable.  If the popup menu is
***REMOVED*** focusable, it may steal keyboard focus from the menu button, so the button
***REMOVED*** will not hide the menu on blur.
***REMOVED*** @param {boolean} focusable Whether the attached menu is focusable.
***REMOVED***
goog.ui.MenuButton.prototype.setFocusablePopupMenu = function(focusable) {
  // TODO(attila):  The menu itself should advertise whether it is focusable.
  this.isFocusablePopupMenu_ = focusable;
***REMOVED***


***REMOVED***
***REMOVED*** Sets whether to render the menu as a sibling element of the button.
***REMOVED*** Normally, the menu is a child of document.body.  This option is useful if
***REMOVED*** you need the menu to inherit styles from a common parent element, or if you
***REMOVED*** otherwise need it to share a parent element for desired event handling.  One
***REMOVED*** example of the latter is if the parent is in a goog.ui.Popup, to ensure that
***REMOVED*** clicks on the menu are considered being within the popup.
***REMOVED*** @param {boolean} renderMenuAsSibling Whether we render the menu at the end
***REMOVED***     of the dom or as a sibling to the button/label that renders the drop
***REMOVED***     down.
***REMOVED***
goog.ui.MenuButton.prototype.setRenderMenuAsSibling = function(
    renderMenuAsSibling) {
  this.renderMenuAsSibling_ = renderMenuAsSibling;
***REMOVED***


***REMOVED***
***REMOVED*** Reveals the menu and hooks up menu-specific event handling.
***REMOVED*** @deprecated Use {@link #setOpen} instead.
***REMOVED***
goog.ui.MenuButton.prototype.showMenu = function() {
  this.setOpen(true);
***REMOVED***


***REMOVED***
***REMOVED*** Hides the menu and cleans up menu-specific event handling.
***REMOVED*** @deprecated Use {@link #setOpen} instead.
***REMOVED***
goog.ui.MenuButton.prototype.hideMenu = function() {
  this.setOpen(false);
***REMOVED***


***REMOVED***
***REMOVED*** Opens or closes the attached popup menu.
***REMOVED*** @param {boolean} open Whether to open or close the menu.
***REMOVED*** @param {goog.events.Event=} opt_e Mousedown event that caused the menu to
***REMOVED***     be opened.
***REMOVED*** @override
***REMOVED***
goog.ui.MenuButton.prototype.setOpen = function(open, opt_e) {
  goog.ui.MenuButton.superClass_.setOpen.call(this, open);
  if (this.menu_ && this.hasState(goog.ui.Component.State.OPENED) == open) {
    if (open) {
      if (!this.menu_.isInDocument()) {
        if (this.renderMenuAsSibling_) {
          this.menu_.render(***REMOVED*** @type {Element}***REMOVED*** (
              this.getElement().parentNode));
        } else {
          this.menu_.render();
        }
      }
      this.viewportBox_ =
          goog.style.getVisibleRectForElement(this.getElement());
      this.buttonRect_ = goog.style.getBounds(this.getElement());
      this.positionMenu();
      this.menu_.setHighlightedIndex(-1);
    } else {
      this.setActive(false);
      this.menu_.setMouseButtonPressed(false);

      var element = this.getElement();
      // Clear any remaining a11y state.
      if (element) {
        goog.a11y.aria.setState(element,
            goog.a11y.aria.State.ACTIVEDESCENDANT,
            '');
      }

      // Clear any sizes that might have been stored.
      if (goog.isDefAndNotNull(this.originalSize_)) {
        this.originalSize_ = undefined;
        var elem = this.menu_.getElement();
        if (elem) {
          goog.style.setSize(elem, '', '');
        }
      }
    }
    this.menu_.setVisible(open, false, opt_e);
    // In Pivot Tables the menu button somehow gets disposed of during the
    // setVisible call, causing attachPopupListeners_ to fail.
    // TODO(user): Debug what happens.
    if (!this.isDisposed()) {
      this.attachPopupListeners_(open);
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** Resets the MenuButton's size.  This is useful for cases where items are added
***REMOVED*** or removed from the menu and scrollOnOverflow is on.  In those cases the
***REMOVED*** menu will not behave correctly and resize itself unless this is called
***REMOVED*** (usually followed by positionMenu()).
***REMOVED***
goog.ui.MenuButton.prototype.invalidateMenuSize = function() {
  this.originalSize_ = undefined;
***REMOVED***


***REMOVED***
***REMOVED*** Positions the menu under the button.  May be called directly in cases when
***REMOVED*** the menu size is known to change.
***REMOVED***
goog.ui.MenuButton.prototype.positionMenu = function() {
  if (!this.menu_.isInDocument()) {
    return;
  }

  var positionElement = this.positionElement_ || this.getElement();
  var position = this.menuPosition_;
  this.menuPosition_.element = positionElement;

  var elem = this.menu_.getElement();
  if (!this.menu_.isVisible()) {
    elem.style.visibility = 'hidden';
    goog.style.showElement(elem, true);
  }

  if (!this.originalSize_ && this.isScrollOnOverflow()) {
    this.originalSize_ = goog.style.getSize(elem);
  }
  var popupCorner = goog.positioning.flipCornerVertical(position.corner);
  position.reposition(elem, popupCorner, this.menuMargin_, this.originalSize_);

  if (!this.menu_.isVisible()) {
    goog.style.showElement(elem, false);
    elem.style.visibility = 'visible';
  }
***REMOVED***


***REMOVED***
***REMOVED*** Periodically repositions the menu while it is visible.
***REMOVED***
***REMOVED*** @param {goog.events.Event} e An event object.
***REMOVED*** @private
***REMOVED***
goog.ui.MenuButton.prototype.onTick_ = function(e) {
  // Call positionMenu() only if the button position or size was
  // changed, or if the window's viewport was changed.
  var currentButtonRect = goog.style.getBounds(this.getElement());
  var currentViewport = goog.style.getVisibleRectForElement(this.getElement());
  if (!goog.math.Rect.equals(this.buttonRect_, currentButtonRect) ||
      !goog.math.Box.equals(this.viewportBox_, currentViewport)) {
    this.buttonRect_ = currentButtonRect;
    this.viewportBox_ = currentViewport;
    this.positionMenu();
  }
***REMOVED***


***REMOVED***
***REMOVED*** Attaches or detaches menu event listeners to/from the given menu.
***REMOVED*** Called each time a menu is attached to or detached from the button.
***REMOVED*** @param {goog.ui.Menu} menu Menu on which to listen for events.
***REMOVED*** @param {boolean} attach Whether to attach or detach event listeners.
***REMOVED*** @private
***REMOVED***
goog.ui.MenuButton.prototype.attachMenuEventListeners_ = function(menu,
    attach) {
  var handler = this.getHandler();
  var method = attach ? handler.listen : handler.unlisten;

  // Handle events dispatched by menu items.
  method.call(handler, menu, goog.ui.Component.EventType.ACTION,
      this.handleMenuAction);
  method.call(handler, menu, goog.ui.Component.EventType.HIGHLIGHT,
      this.handleHighlightItem);
  method.call(handler, menu, goog.ui.Component.EventType.UNHIGHLIGHT,
      this.handleUnHighlightItem);
***REMOVED***


***REMOVED***
***REMOVED*** Handles {@code HIGHLIGHT} events dispatched by the attached menu.
***REMOVED*** @param {goog.events.Event} e Highlight event to handle.
***REMOVED***
goog.ui.MenuButton.prototype.handleHighlightItem = function(e) {
  var element = this.getElement();
  goog.asserts.assert(element, 'The menu button DOM element cannot be null.');
  if (e.target.getElement() != null) {
    goog.a11y.aria.setState(element,
        goog.a11y.aria.State.ACTIVEDESCENDANT,
        e.target.getElement().id);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Handles UNHIGHLIGHT events dispatched by the associated menu.
***REMOVED*** @param {goog.events.Event} e Unhighlight event to handle.
***REMOVED***
goog.ui.MenuButton.prototype.handleUnHighlightItem = function(e) {
  if (!this.menu_.getHighlighted()) {
    var element = this.getElement();
    goog.asserts.assert(element, 'The menu button DOM element cannot be null.');
    goog.a11y.aria.setState(element,
        goog.a11y.aria.State.ACTIVEDESCENDANT,
        '');
  }
***REMOVED***


***REMOVED***
***REMOVED*** Attaches or detaches event listeners depending on whether the popup menu
***REMOVED*** is being shown or hidden.  Starts listening for document mousedown events
***REMOVED*** and for menu blur events when the menu is shown, and stops listening for
***REMOVED*** these events when it is hidden.  Called from {@link #setOpen}.
***REMOVED*** @param {boolean} attach Whether to attach or detach event listeners.
***REMOVED*** @private
***REMOVED***
goog.ui.MenuButton.prototype.attachPopupListeners_ = function(attach) {
  var handler = this.getHandler();
  var method = attach ? handler.listen : handler.unlisten;

  // Listen for document mousedown events in the capture phase, because
  // the target may stop propagation of the event in the bubble phase.
  method.call(handler, this.getDomHelper().getDocument(),
      goog.events.EventType.MOUSEDOWN, this.handleDocumentMouseDown, true);

  // Only listen for blur events dispatched by the menu if it is focusable.
  if (this.isFocusablePopupMenu()) {
    method.call(handler,***REMOVED*****REMOVED*** @type {goog.events.EventTarget}***REMOVED*** (this.menu_),
        goog.ui.Component.EventType.BLUR, this.handleMenuBlur);
  }

  method.call(handler, this.timer_, goog.Timer.TICK, this.onTick_);
  if (attach) {
    this.timer_.start();
  } else {
    this.timer_.stop();
  }
***REMOVED***


// Register a decorator factory function for goog.ui.MenuButtons.
goog.ui.registry.setDecoratorByClassName(goog.ui.MenuButtonRenderer.CSS_CLASS,
    function() {
      // MenuButton defaults to using MenuButtonRenderer.
      return new goog.ui.MenuButton(null);
    });
