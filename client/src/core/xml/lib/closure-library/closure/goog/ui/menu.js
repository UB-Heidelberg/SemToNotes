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
***REMOVED*** @fileoverview A base menu class that supports key and mouse events. The menu
***REMOVED*** can be bound to an existing HTML structure or can generate its own DOM.
***REMOVED***
***REMOVED*** To decorate, the menu should be bound to an element containing children
***REMOVED*** with the classname 'goog-menuitem'.  HRs will be classed as separators.
***REMOVED***
***REMOVED*** Decorate Example:
***REMOVED*** <div id="menu" class="goog-menu" tabIndex="0">
***REMOVED***   <div class="goog-menuitem">Google</div>
***REMOVED***   <div class="goog-menuitem">Yahoo</div>
***REMOVED***   <div class="goog-menuitem">MSN</div>
***REMOVED***   <hr>
***REMOVED***   <div class="goog-menuitem">New...</div>
***REMOVED*** </div>
***REMOVED*** <script>
***REMOVED***
***REMOVED*** var menu = new goog.ui.Menu();
***REMOVED*** menu.decorate(goog.dom.getElement('menu'));
***REMOVED***
***REMOVED*** TESTED=FireFox 2.0, IE6, Opera 9, Chrome.
***REMOVED*** TODO(user): Key handling is flaky in Opera and Chrome
***REMOVED*** TODO(user): Rename all references of "item" to child since menu is
***REMOVED*** essentially very generic and could, in theory, host a date or color picker.
***REMOVED***
***REMOVED*** @see ../demos/menu.html
***REMOVED*** @see ../demos/menus.html
***REMOVED***

goog.provide('goog.ui.Menu');
goog.provide('goog.ui.Menu.EventType');

goog.require('goog.math.Coordinate');
goog.require('goog.string');
goog.require('goog.style');
goog.require('goog.ui.Component.EventType');
goog.require('goog.ui.Component.State');
goog.require('goog.ui.Container');
goog.require('goog.ui.Container.Orientation');
goog.require('goog.ui.MenuHeader');
goog.require('goog.ui.MenuItem');
goog.require('goog.ui.MenuRenderer');
goog.require('goog.ui.MenuSeparator');

// The dependencies MenuHeader, MenuItem, and MenuSeparator are implicit.
// There are no references in the code, but we need to load these
// classes before goog.ui.Menu.



// TODO(robbyw): Reverse constructor argument order for consistency.
***REMOVED***
***REMOVED*** A basic menu class.
***REMOVED*** @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper.
***REMOVED*** @param {goog.ui.MenuRenderer=} opt_renderer Renderer used to render or
***REMOVED***     decorate the container; defaults to {@link goog.ui.MenuRenderer}.
***REMOVED***
***REMOVED*** @extends {goog.ui.Container}
***REMOVED***
goog.ui.Menu = function(opt_domHelper, opt_renderer) {
  goog.ui.Container.call(this, goog.ui.Container.Orientation.VERTICAL,
      opt_renderer || goog.ui.MenuRenderer.getInstance(), opt_domHelper);

  // Unlike Containers, Menus aren't keyboard-accessible by default.  This line
  // preserves backwards compatibility with code that depends on menus not
  // receiving focus - e.g. {@code goog.ui.MenuButton}.
  this.setFocusable(false);
***REMOVED***
goog.inherits(goog.ui.Menu, goog.ui.Container);


// TODO(robbyw): Remove this and all references to it.
// Please ensure that BEFORE_SHOW behavior is not disrupted as a result.
***REMOVED***
***REMOVED*** Event types dispatched by the menu.
***REMOVED*** @enum {string}
***REMOVED*** @deprecated Use goog.ui.Component.EventType.
***REMOVED***
goog.ui.Menu.EventType = {
 ***REMOVED*****REMOVED*** Dispatched before the menu becomes visible***REMOVED***
  BEFORE_SHOW: goog.ui.Component.EventType.BEFORE_SHOW,

 ***REMOVED*****REMOVED*** Dispatched when the menu is shown***REMOVED***
  SHOW: goog.ui.Component.EventType.SHOW,

 ***REMOVED*****REMOVED*** Dispatched before the menu becomes hidden***REMOVED***
  BEFORE_HIDE: goog.ui.Component.EventType.HIDE,

 ***REMOVED*****REMOVED*** Dispatched when the menu is hidden***REMOVED***
  HIDE: goog.ui.Component.EventType.HIDE
***REMOVED***


// TODO(robbyw): Remove this and all references to it.
***REMOVED***
***REMOVED*** CSS class for menus.
***REMOVED*** @type {string}
***REMOVED*** @deprecated Use goog.ui.MenuRenderer.CSS_CLASS.
***REMOVED***
goog.ui.Menu.CSS_CLASS = goog.ui.MenuRenderer.CSS_CLASS;


***REMOVED***
***REMOVED*** Coordinates of the mousedown event that caused this menu to be made visible.
***REMOVED*** Used to prevent the consequent mouseup event due to a simple click from
***REMOVED*** activating a menu item immediately. Considered protected; should only be used
***REMOVED*** within this package or by subclasses.
***REMOVED*** @type {goog.math.Coordinate|undefined}
***REMOVED***
goog.ui.Menu.prototype.openingCoords;


***REMOVED***
***REMOVED*** Whether the menu can move the focus to it's key event target when it is
***REMOVED*** shown.  Default = true
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.ui.Menu.prototype.allowAutoFocus_ = true;


***REMOVED***
***REMOVED*** Whether the menu should use windows syle behavior and allow disabled menu
***REMOVED*** items to be highlighted (though not selectable).  Defaults to false
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.ui.Menu.prototype.allowHighlightDisabled_ = false;


***REMOVED***
***REMOVED*** Returns the CSS class applied to menu elements, also used as the prefix for
***REMOVED*** derived styles, if any.  Subclasses should override this method as needed.
***REMOVED*** Considered protected.
***REMOVED*** @return {string} The CSS class applied to menu elements.
***REMOVED*** @protected
***REMOVED*** @deprecated Use getRenderer().getCssClass().
***REMOVED***
goog.ui.Menu.prototype.getCssClass = function() {
  return this.getRenderer().getCssClass();
***REMOVED***


***REMOVED***
***REMOVED*** Returns whether the provided element is to be considered inside the menu for
***REMOVED*** purposes such as dismissing the menu on an event.  This is so submenus can
***REMOVED*** make use of elements outside their own DOM.
***REMOVED*** @param {Element} element The element to test for.
***REMOVED*** @return {boolean} Whether the provided element is to be considered inside
***REMOVED***     the menu.
***REMOVED***
goog.ui.Menu.prototype.containsElement = function(element) {
  if (this.getRenderer().containsElement(this, element)) {
    return true;
  }

  for (var i = 0, count = this.getChildCount(); i < count; i++) {
    var child = this.getChildAt(i);
    if (typeof child.containsElement == 'function' &&
        child.containsElement(element)) {
      return true;
    }
  }

  return false;
***REMOVED***


***REMOVED***
***REMOVED*** Adds a new menu item at the end of the menu.
***REMOVED*** @param {goog.ui.MenuHeader|goog.ui.MenuItem|goog.ui.MenuSeparator} item Menu
***REMOVED***     item to add to the menu.
***REMOVED*** @deprecated Use {@link #addChild} instead, with true for the second argument.
***REMOVED***
goog.ui.Menu.prototype.addItem = function(item) {
  this.addChild(item, true);
***REMOVED***


***REMOVED***
***REMOVED*** Adds a new menu item at a specific index in the menu.
***REMOVED*** @param {goog.ui.MenuHeader|goog.ui.MenuItem|goog.ui.MenuSeparator} item Menu
***REMOVED***     item to add to the menu.
***REMOVED*** @param {number} n Index at which to insert the menu item.
***REMOVED*** @deprecated Use {@link #addChildAt} instead, with true for the third
***REMOVED***     argument.
***REMOVED***
goog.ui.Menu.prototype.addItemAt = function(item, n) {
  this.addChildAt(item, n, true);
***REMOVED***


***REMOVED***
***REMOVED*** Removes an item from the menu and disposes of it.
***REMOVED*** @param {goog.ui.MenuHeader|goog.ui.MenuItem|goog.ui.MenuSeparator} item The
***REMOVED***     menu item to remove.
***REMOVED*** @deprecated Use {@link #removeChild} instead.
***REMOVED***
goog.ui.Menu.prototype.removeItem = function(item) {
  var removedChild = this.removeChild(item, true);
  if (removedChild) {
    removedChild.dispose();
  }
***REMOVED***


***REMOVED***
***REMOVED*** Removes a menu item at a given index in the menu and disposes of it.
***REMOVED*** @param {number} n Index of item.
***REMOVED*** @deprecated Use {@link #removeChildAt} instead.
***REMOVED***
goog.ui.Menu.prototype.removeItemAt = function(n) {
  var removedChild = this.removeChildAt(n, true);
  if (removedChild) {
    removedChild.dispose();
  }
***REMOVED***


***REMOVED***
***REMOVED*** Returns a reference to the menu item at a given index.
***REMOVED*** @param {number} n Index of menu item.
***REMOVED*** @return {goog.ui.MenuHeader|goog.ui.MenuItem|goog.ui.MenuSeparator|null}
***REMOVED***     Reference to the menu item.
***REMOVED*** @deprecated Use {@link #getChildAt} instead.
***REMOVED***
goog.ui.Menu.prototype.getItemAt = function(n) {
  return***REMOVED*****REMOVED*** @type {goog.ui.MenuItem?}***REMOVED***(this.getChildAt(n));
***REMOVED***


***REMOVED***
***REMOVED*** Returns the number of items in the menu (including separators).
***REMOVED*** @return {number} The number of items in the menu.
***REMOVED*** @deprecated Use {@link #getChildCount} instead.
***REMOVED***
goog.ui.Menu.prototype.getItemCount = function() {
  return this.getChildCount();
***REMOVED***


***REMOVED***
***REMOVED*** Returns an array containing the menu items contained in the menu.
***REMOVED*** @return {Array.<goog.ui.MenuItem>} An array of menu items.
***REMOVED*** @deprecated Use getChildAt, forEachChild, and getChildCount.
***REMOVED***
goog.ui.Menu.prototype.getItems = function() {
  // TODO(user): Remove reference to getItems and instead use getChildAt,
  // forEachChild, and getChildCount
  var children = [];
  this.forEachChild(function(child) {
    children.push(child);
  });
  return children;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the position of the menu relative to the view port.
***REMOVED*** @param {number|goog.math.Coordinate} x Left position or coordinate obj.
***REMOVED*** @param {number=} opt_y Top position.
***REMOVED***
goog.ui.Menu.prototype.setPosition = function(x, opt_y) {
  // NOTE(user): It is necessary to temporarily set the display from none, so
  // that the position gets set correctly.
  var visible = this.isVisible();
  if (!visible) {
    goog.style.showElement(this.getElement(), true);
  }
  goog.style.setPageOffset(this.getElement(), x, opt_y);
  if (!visible) {
    goog.style.showElement(this.getElement(), false);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Gets the page offset of the menu, or null if the menu isn't visible
***REMOVED*** @return {goog.math.Coordinate?} Object holding the x-y coordinates of the
***REMOVED***     menu or null if the menu is not visible.
***REMOVED***
goog.ui.Menu.prototype.getPosition = function() {
  return this.isVisible() ? goog.style.getPageOffset(this.getElement()) : null;
***REMOVED***


***REMOVED***
***REMOVED*** Sets whether the menu can automatically move focus to its key event target
***REMOVED*** when it is set to visible.
***REMOVED*** @param {boolean} allow Whether the menu can automatically move focus to its
***REMOVED***     key event target when it is set to visible.
***REMOVED***
goog.ui.Menu.prototype.setAllowAutoFocus = function(allow) {
  this.allowAutoFocus_ = allow;
  if (allow) {
    this.setFocusable(true);
  }
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} Whether the menu can automatically move focus to its key
***REMOVED***     event target when it is set to visible.
***REMOVED***
goog.ui.Menu.prototype.getAllowAutoFocus = function() {
  return this.allowAutoFocus_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets whether the menu will highlight disabled menu items or skip to the next
***REMOVED*** active item.
***REMOVED*** @param {boolean} allow Whether the menu will highlight disabled menu items or
***REMOVED***     skip to the next active item.
***REMOVED***
goog.ui.Menu.prototype.setAllowHighlightDisabled = function(allow) {
  this.allowHighlightDisabled_ = allow;
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} Whether the menu will highlight disabled menu items or skip
***REMOVED***     to the next active item.
***REMOVED***
goog.ui.Menu.prototype.getAllowHighlightDisabled = function() {
  return this.allowHighlightDisabled_;
***REMOVED***


***REMOVED***
***REMOVED*** @override
***REMOVED*** @param {goog.events.Event=} opt_e Mousedown event that caused this menu to
***REMOVED***     be made visible (ignored if show is false).
***REMOVED***
goog.ui.Menu.prototype.setVisible = function(show, opt_force, opt_e) {
  var visibilityChanged = goog.ui.Menu.superClass_.setVisible.call(this, show,
      opt_force);
  if (visibilityChanged && show && this.isInDocument() &&
      this.allowAutoFocus_) {
    this.getKeyEventTarget().focus();
  }
  if (show && opt_e && goog.isNumber(opt_e.clientX)) {
    this.openingCoords = new goog.math.Coordinate(opt_e.clientX, opt_e.clientY);
  } else {
    this.openingCoords = null;
  }
  return visibilityChanged;
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.ui.Menu.prototype.handleEnterItem = function(e) {
  if (this.allowAutoFocus_) {
    this.getKeyEventTarget().focus();
  }

  return goog.ui.Menu.superClass_.handleEnterItem.call(this, e);
***REMOVED***


***REMOVED***
***REMOVED*** Highlights the next item that begins with the specified string.  If no
***REMOVED*** (other) item begins with the given string, the selection is unchanged.
***REMOVED*** @param {string} charStr The prefix to match.
***REMOVED*** @return {boolean} Whether a matching prefix was found.
***REMOVED***
goog.ui.Menu.prototype.highlightNextPrefix = function(charStr) {
  var re = new RegExp('^' + goog.string.regExpEscape(charStr), 'i');
  return this.highlightHelper(function(index, max) {
    // Index is >= -1 because it is set to -1 when nothing is selected.
    var start = index < 0 ? 0 : index;
    var wrapped = false;

    // We always start looking from one after the current, because we
    // keep the current selection only as a last resort. This makes the
    // loop a little awkward in the case where there is no current
    // selection, as we need to stop somewhere but can't just stop
    // when index == start, which is why we need the 'wrapped' flag.
    do {
      ++index;
      if (index == max) {
        index = 0;
        wrapped = true;
      }
      var name = this.getChildAt(index).getCaption();
      if (name && name.match(re)) {
        return index;
      }
    } while (!wrapped || index != start);
    return this.getHighlightedIndex();
  }, this.getHighlightedIndex());
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.ui.Menu.prototype.canHighlightItem = function(item) {
  return (this.allowHighlightDisabled_ || item.isEnabled()) &&
      item.isVisible() && item.isSupportedState(goog.ui.Component.State.HOVER);
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.ui.Menu.prototype.decorateInternal = function(element) {
  this.decorateContent(element);
  goog.ui.Menu.superClass_.decorateInternal.call(this, element);
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.ui.Menu.prototype.handleKeyEventInternal = function(e) {
  var handled = goog.base(this, 'handleKeyEventInternal', e);
  if (!handled) {
    // Loop through all child components, and for each menu item call its
    // key event handler so that keyboard mnemonics can be handled.
    this.forEachChild(function(menuItem) {
      if (!handled && menuItem.getMnemonic &&
          menuItem.getMnemonic() == e.keyCode) {
        if (this.isEnabled()) {
          this.setHighlighted(menuItem);
        }
        // We still delegate to handleKeyEvent, so that it can handle
        // enabled/disabled state.
        handled = menuItem.handleKeyEvent(e);
      }
    }, this);
  }
  return handled;
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.ui.Menu.prototype.setHighlightedIndex = function(index) {
  goog.base(this, 'setHighlightedIndex', index);

  // Bring the highlighted item into view. This has no effect if the menu is not
  // scrollable.
  var child = this.getChildAt(index);
  if (child) {
    goog.style.scrollIntoContainerView(child.getElement(), this.getElement());
  }
***REMOVED***


***REMOVED***
***REMOVED*** Decorate menu items located in any descendent node which as been explicitly
***REMOVED*** marked as a 'content' node.
***REMOVED*** @param {Element} element Element to decorate.
***REMOVED*** @protected
***REMOVED***
goog.ui.Menu.prototype.decorateContent = function(element) {
  var renderer = this.getRenderer();
  var contentElements = this.getDomHelper().getElementsByTagNameAndClass('div',
      goog.getCssName(renderer.getCssClass(), 'content'), element);

  // Some versions of IE do not like it when you access this nodeList
  // with invalid indices. See
  // http://code.google.com/p/closure-library/issues/detail?id=373
  var length = contentElements.length;
  for (var i = 0; i < length; i++) {
    renderer.decorateChildren(this, contentElements[i]);
  }
***REMOVED***
