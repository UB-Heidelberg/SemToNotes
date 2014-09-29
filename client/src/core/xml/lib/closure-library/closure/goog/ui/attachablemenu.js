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
***REMOVED*** @fileoverview Definition of the AttachableMenu class.
***REMOVED***
***REMOVED***

goog.provide('goog.ui.AttachableMenu');

goog.require('goog.a11y.aria');
goog.require('goog.a11y.aria.State');
goog.require('goog.asserts');
goog.require('goog.events.KeyCodes');
goog.require('goog.ui.ItemEvent');
goog.require('goog.ui.MenuBase');



***REMOVED***
***REMOVED*** An implementation of a menu that can attach itself to DOM element that
***REMOVED*** are annotated appropriately.
***REMOVED***
***REMOVED*** The following attributes are used by the AttachableMenu
***REMOVED***
***REMOVED*** menu-item - Should be set on DOM elements that function as items in the
***REMOVED*** menu that can be selected.
***REMOVED*** classNameSelected - A class that will be added to the element's class names
***REMOVED*** when the item is selected via keyboard or mouse.
***REMOVED***
***REMOVED*** @param {Element=} opt_element A DOM element for the popup.
***REMOVED***
***REMOVED*** @extends {goog.ui.MenuBase}
***REMOVED*** @deprecated Use goog.ui.PopupMenu.
***REMOVED***
goog.ui.AttachableMenu = function(opt_element) {
  goog.ui.MenuBase.call(this, opt_element);
***REMOVED***
goog.inherits(goog.ui.AttachableMenu, goog.ui.MenuBase);


***REMOVED***
***REMOVED*** The currently selected element (mouse was moved over it or keyboard arrows)
***REMOVED*** @type {Element}
***REMOVED*** @private
***REMOVED***
goog.ui.AttachableMenu.prototype.selectedElement_ = null;


***REMOVED***
***REMOVED*** Class name to append to a menu item's class when it's selected
***REMOVED*** @type {string}
***REMOVED*** @private
***REMOVED***
goog.ui.AttachableMenu.prototype.itemClassName_ = 'menu-item';


***REMOVED***
***REMOVED*** Class name to append to a menu item's class when it's selected
***REMOVED*** @type {string}
***REMOVED*** @private
***REMOVED***
goog.ui.AttachableMenu.prototype.selectedItemClassName_ = 'menu-item-selected';


***REMOVED***
***REMOVED*** Keep track of when the last key was pressed so that a keydown-scroll doesn't
***REMOVED*** trigger a mouseover event
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.ui.AttachableMenu.prototype.lastKeyDown_ = goog.now();


***REMOVED*** @override***REMOVED***
goog.ui.AttachableMenu.prototype.disposeInternal = function() {
  goog.ui.AttachableMenu.superClass_.disposeInternal.call(this);
  this.selectedElement_ = null;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the class name to use for menu items
***REMOVED***
***REMOVED*** @return {string} The class name to use for items.
***REMOVED***
goog.ui.AttachableMenu.prototype.getItemClassName = function() {
  return this.itemClassName_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the class name to use for menu items
***REMOVED***
***REMOVED*** @param {string} name The class name to use for items.
***REMOVED***
goog.ui.AttachableMenu.prototype.setItemClassName = function(name) {
  this.itemClassName_ = name;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the class name to use for selected menu items
***REMOVED*** todo(user) - reevaluate if we can simulate pseudo classes in IE
***REMOVED***
***REMOVED*** @return {string} The class name to use for selected items.
***REMOVED***
goog.ui.AttachableMenu.prototype.getSelectedItemClassName = function() {
  return this.selectedItemClassName_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the class name to use for selected menu items
***REMOVED*** todo(user) - reevaluate if we can simulate pseudo classes in IE
***REMOVED***
***REMOVED*** @param {string} name The class name to use for selected items.
***REMOVED***
goog.ui.AttachableMenu.prototype.setSelectedItemClassName = function(name) {
  this.selectedItemClassName_ = name;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the selected item
***REMOVED***
***REMOVED*** @return {Element} The item selected or null if no item is selected.
***REMOVED*** @override
***REMOVED***
goog.ui.AttachableMenu.prototype.getSelectedItem = function() {
  return this.selectedElement_;
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.ui.AttachableMenu.prototype.setSelectedItem = function(obj) {
  var elt =***REMOVED*****REMOVED*** @type {Element}***REMOVED*** (obj);
  if (this.selectedElement_) {
    goog.dom.classes.remove(this.selectedElement_, this.selectedItemClassName_);
  }

  this.selectedElement_ = elt;

  var el = this.getElement();
  goog.asserts.assert(el, 'The attachable menu DOM element cannot be null.');
  if (this.selectedElement_) {
    goog.dom.classes.add(this.selectedElement_, this.selectedItemClassName_);

    if (elt.id) {
      // Update activedescendant to reflect the new selection. ARIA roles for
      // menu and menuitem can be set statically (thru Soy templates, for
      // example) whereas this needs to be updated as the selection changes.
      goog.a11y.aria.setState(el, goog.a11y.aria.State.ACTIVEDESCENDANT,
          elt.id);
    }

    var top = this.selectedElement_.offsetTop;
    var height = this.selectedElement_.offsetHeight;
    var scrollTop = el.scrollTop;
    var scrollHeight = el.offsetHeight;

    // If the menu is scrollable this scrolls the selected item into view
    // (this has no effect when the menu doesn't scroll)
    if (top < scrollTop) {
      el.scrollTop = top;
    } else if (top + height > scrollTop + scrollHeight) {
      el.scrollTop = top + height - scrollHeight;
    }
  } else {
    // Clear off activedescendant to reflect no selection.
    goog.a11y.aria.setState(el, goog.a11y.aria.State.ACTIVEDESCENDANT, '');
  }
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.ui.AttachableMenu.prototype.showPopupElement = function() {
  // The scroll position cannot be set for hidden (display: none) elements in
  // gecko browsers.
  var el =***REMOVED*****REMOVED*** @type {Element}***REMOVED*** (this.getElement());
  goog.style.showElement(el, true);
  el.scrollTop = 0;
  el.style.visibility = 'visible';
***REMOVED***


***REMOVED***
***REMOVED*** Called after the menu is shown.
***REMOVED*** @protected
***REMOVED*** @suppress {underscore}
***REMOVED*** @override
***REMOVED***
goog.ui.AttachableMenu.prototype.onShow_ = function() {
  goog.ui.AttachableMenu.superClass_.onShow_.call(this);

  // In IE, focusing the menu causes weird scrolling to happen. Focusing the
  // first child makes the scroll behavior better, and the key handling still
  // works. In FF, focusing the first child causes us to lose key events, so we
  // still focus the menu.
  var el = this.getElement();
  goog.userAgent.IE ? el.firstChild.focus() :
      el.focus();
***REMOVED***


***REMOVED***
***REMOVED*** Returns the next or previous item. Used for up/down arrows.
***REMOVED***
***REMOVED*** @param {boolean} prev True to go to the previous element instead of next.
***REMOVED*** @return {Element} The next or previous element.
***REMOVED*** @protected
***REMOVED***
goog.ui.AttachableMenu.prototype.getNextPrevItem = function(prev) {
  // first find the index of the next element
  var elements = this.getElement().getElementsByTagName('*');
  var elementCount = elements.length;
  var index;
  // if there is a selected element, find its index and then inc/dec by one
  if (this.selectedElement_) {
    for (var i = 0; i < elementCount; i++) {
      if (elements[i] == this.selectedElement_) {
        index = prev ? i - 1 : i + 1;
        break;
      }
    }
  }

  // if no selected element, start from beginning or end
  if (!goog.isDef(index)) {
    index = prev ? elementCount - 1 : 0;
  }

  // iterate forward or backwards through the elements finding the next
  // menu item
  for (var i = 0; i < elementCount; i++) {
    var multiplier = prev ? -1 : 1;
    var nextIndex = index + (multiplier***REMOVED*** i) % elementCount;

    // if overflowed/underflowed, wrap around
    if (nextIndex < 0) {
      nextIndex += elementCount;
    } else if (nextIndex >= elementCount) {
      nextIndex -= elementCount;
    }

    if (this.isMenuItem_(elements[nextIndex])) {
      return elements[nextIndex];
    }
  }
  return null;
***REMOVED***


***REMOVED***
***REMOVED*** Mouse over handler for the menu.
***REMOVED*** @param {goog.events.Event} e The event object.
***REMOVED*** @protected
***REMOVED*** @override
***REMOVED***
goog.ui.AttachableMenu.prototype.onMouseOver = function(e) {
  var eltItem = this.getAncestorMenuItem_(***REMOVED*** @type {Element}***REMOVED*** (e.target));
  if (eltItem == null) {
    return;
  }

  // Stop the keydown triggering a mouseover in FF.
  if (goog.now() - this.lastKeyDown_ > goog.ui.PopupBase.DEBOUNCE_DELAY_MS) {
    this.setSelectedItem(eltItem);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Mouse out handler for the menu.
***REMOVED*** @param {goog.events.Event} e The event object.
***REMOVED*** @protected
***REMOVED*** @override
***REMOVED***
goog.ui.AttachableMenu.prototype.onMouseOut = function(e) {
  var eltItem = this.getAncestorMenuItem_(***REMOVED*** @type {Element}***REMOVED*** (e.target));
  if (eltItem == null) {
    return;
  }

  // Stop the keydown triggering a mouseout in FF.
  if (goog.now() - this.lastKeyDown_ > goog.ui.PopupBase.DEBOUNCE_DELAY_MS) {
    this.setSelectedItem(null);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Mouse down handler for the menu. Prevents default to avoid text selection.
***REMOVED*** @param {!goog.events.Event} e The event object.
***REMOVED*** @protected
***REMOVED*** @override
***REMOVED***
goog.ui.AttachableMenu.prototype.onMouseDown = goog.events.Event.preventDefault;


***REMOVED***
***REMOVED*** Mouse up handler for the menu.
***REMOVED*** @param {goog.events.Event} e The event object.
***REMOVED*** @protected
***REMOVED*** @override
***REMOVED***
goog.ui.AttachableMenu.prototype.onMouseUp = function(e) {
  var eltItem = this.getAncestorMenuItem_(***REMOVED*** @type {Element}***REMOVED*** (e.target));
  if (eltItem == null) {
    return;
  }
  this.setVisible(false);
  this.onItemSelected_(eltItem);
***REMOVED***


***REMOVED***
***REMOVED*** Key down handler for the menu.
***REMOVED*** @param {goog.events.KeyEvent} e The event object.
***REMOVED*** @protected
***REMOVED*** @override
***REMOVED***
goog.ui.AttachableMenu.prototype.onKeyDown = function(e) {
  switch (e.keyCode) {
    case goog.events.KeyCodes.DOWN:
      this.setSelectedItem(this.getNextPrevItem(false));
      this.lastKeyDown_ = goog.now();
      break;
    case goog.events.KeyCodes.UP:
      this.setSelectedItem(this.getNextPrevItem(true));
      this.lastKeyDown_ = goog.now();
      break;
    case goog.events.KeyCodes.ENTER:
      if (this.selectedElement_) {
        this.onItemSelected_();
        this.setVisible(false);
      }
      break;
    case goog.events.KeyCodes.ESC:
      this.setVisible(false);
      break;
    default:
      if (e.charCode) {
        var charStr = String.fromCharCode(e.charCode);
        this.selectByName_(charStr, 1, true);
      }
      break;
  }
  // Prevent the browser's default keydown behaviour when the menu is open,
  // e.g. keyboard scrolling.
  e.preventDefault();

  // Stop propagation to prevent application level keyboard shortcuts from
  // firing.
  e.stopPropagation();

  this.dispatchEvent(e);
***REMOVED***


***REMOVED***
***REMOVED*** Find an item that has the given prefix and select it.
***REMOVED***
***REMOVED*** @param {string} prefix The entered prefix, so far.
***REMOVED*** @param {number=} opt_direction 1 to search forward from the selection
***REMOVED***     (default), -1 to search backward (e.g. to go to the previous match).
***REMOVED*** @param {boolean=} opt_skip True if should skip the current selection,
***REMOVED***     unless no other item has the given prefix.
***REMOVED*** @private
***REMOVED***
goog.ui.AttachableMenu.prototype.selectByName_ =
    function(prefix, opt_direction, opt_skip) {
  var elements = this.getElement().getElementsByTagName('*');
  var elementCount = elements.length;
  var index;

  if (elementCount == 0) {
    return;
  }

  if (!this.selectedElement_ ||
      (index = goog.array.indexOf(elements, this.selectedElement_)) == -1) {
    // no selection or selection isn't known => start at the beginning
    index = 0;
  }

  var start = index;
  var re = new RegExp('^' + goog.string.regExpEscape(prefix), 'i');
  var skip = opt_skip && this.selectedElement_;
  var dir = opt_direction || 1;

  do {
    if (elements[index] != skip && this.isMenuItem_(elements[index])) {
      var name = goog.dom.getTextContent(elements[index]);
      if (name.match(re)) {
        break;
      }
    }
    index += dir;
    if (index == elementCount) {
      index = 0;
    } else if (index < 0) {
      index = elementCount - 1;
    }
  } while (index != start);

  if (this.selectedElement_ != elements[index]) {
    this.setSelectedItem(elements[index]);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Dispatch an ITEM_ACTION event when an item is selected
***REMOVED*** @param {Object=} opt_item Item selected.
***REMOVED*** @private
***REMOVED***
goog.ui.AttachableMenu.prototype.onItemSelected_ = function(opt_item) {
  this.dispatchEvent(new goog.ui.ItemEvent(goog.ui.MenuBase.Events.ITEM_ACTION,
      this, opt_item || this.selectedElement_));
***REMOVED***


***REMOVED***
***REMOVED*** Returns whether the specified element is a menu item.
***REMOVED*** @param {Element|undefined} elt The element to find a menu item ancestor of.
***REMOVED*** @return {boolean} Whether the specified element is a menu item.
***REMOVED*** @private
***REMOVED***
goog.ui.AttachableMenu.prototype.isMenuItem_ = function(elt) {
  return !!elt && goog.dom.classes.has(elt, this.itemClassName_);
***REMOVED***


***REMOVED***
***REMOVED*** Returns the menu-item scoping the specified element, or null if there is
***REMOVED*** none.
***REMOVED*** @param {Element|undefined} elt The element to find a menu item ancestor of.
***REMOVED*** @return {Element} The menu-item scoping the specified element, or null if
***REMOVED***     there is none.
***REMOVED*** @private
***REMOVED***
goog.ui.AttachableMenu.prototype.getAncestorMenuItem_ = function(elt) {
  if (elt) {
    var ownerDocumentBody = goog.dom.getOwnerDocument(elt).body;
    while (elt != null && elt != ownerDocumentBody) {
      if (this.isMenuItem_(elt)) {
        return elt;
      }
      elt =***REMOVED*****REMOVED*** @type {Element}***REMOVED*** (elt.parentNode);
    }
  }
  return null;
***REMOVED***
