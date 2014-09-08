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
***REMOVED*** @fileoverview Renderer for {@link goog.ui.MenuItem}s.
***REMOVED***
***REMOVED*** @author attila@google.com (Attila Bodis)
***REMOVED***

goog.provide('goog.ui.MenuItemRenderer');

goog.require('goog.a11y.aria');
goog.require('goog.a11y.aria.Role');
goog.require('goog.asserts');
goog.require('goog.dom');
goog.require('goog.dom.classlist');
goog.require('goog.ui.Component');
goog.require('goog.ui.ControlRenderer');



***REMOVED***
***REMOVED*** Default renderer for {@link goog.ui.MenuItem}s.  Each item has the following
***REMOVED*** structure:
***REMOVED*** <pre>
***REMOVED***   <div class="goog-menuitem">
***REMOVED***     <div class="goog-menuitem-content">
***REMOVED***       ...(menu item contents)...
***REMOVED***     </div>
***REMOVED***   </div>
***REMOVED*** </pre>
***REMOVED***
***REMOVED*** @extends {goog.ui.ControlRenderer}
***REMOVED***
goog.ui.MenuItemRenderer = function() {
  goog.ui.ControlRenderer.call(this);

 ***REMOVED*****REMOVED***
  ***REMOVED*** Commonly used CSS class names, cached here for convenience (and to avoid
  ***REMOVED*** unnecessary string concatenation).
  ***REMOVED*** @type {!Array.<string>}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.classNameCache_ = [];
***REMOVED***
goog.inherits(goog.ui.MenuItemRenderer, goog.ui.ControlRenderer);
goog.addSingletonGetter(goog.ui.MenuItemRenderer);


***REMOVED***
***REMOVED*** CSS class name the renderer applies to menu item elements.
***REMOVED*** @type {string}
***REMOVED***
goog.ui.MenuItemRenderer.CSS_CLASS = goog.getCssName('goog-menuitem');


***REMOVED***
***REMOVED*** Constants for referencing composite CSS classes.
***REMOVED*** @enum {number}
***REMOVED*** @private
***REMOVED***
goog.ui.MenuItemRenderer.CompositeCssClassIndex_ = {
  HOVER: 0,
  CHECKBOX: 1,
  CONTENT: 2
***REMOVED***


***REMOVED***
***REMOVED*** Returns the composite CSS class by using the cached value or by constructing
***REMOVED*** the value from the base CSS class and the passed index.
***REMOVED*** @param {goog.ui.MenuItemRenderer.CompositeCssClassIndex_} index Index for the
***REMOVED***     CSS class - could be highlight, checkbox or content in usual cases.
***REMOVED*** @return {string} The composite CSS class.
***REMOVED*** @private
***REMOVED***
goog.ui.MenuItemRenderer.prototype.getCompositeCssClass_ = function(index) {
  var result = this.classNameCache_[index];
  if (!result) {
    switch (index) {
      case goog.ui.MenuItemRenderer.CompositeCssClassIndex_.HOVER:
        result = goog.getCssName(this.getStructuralCssClass(), 'highlight');
        break;
      case goog.ui.MenuItemRenderer.CompositeCssClassIndex_.CHECKBOX:
        result = goog.getCssName(this.getStructuralCssClass(), 'checkbox');
        break;
      case goog.ui.MenuItemRenderer.CompositeCssClassIndex_.CONTENT:
        result = goog.getCssName(this.getStructuralCssClass(), 'content');
        break;
    }
    this.classNameCache_[index] = result;
  }

  return result;
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.ui.MenuItemRenderer.prototype.getAriaRole = function() {
  return goog.a11y.aria.Role.MENU_ITEM;
***REMOVED***


***REMOVED***
***REMOVED*** Overrides {@link goog.ui.ControlRenderer#createDom} by adding extra markup
***REMOVED*** and stying to the menu item's element if it is selectable or checkable.
***REMOVED*** @param {goog.ui.Control} item Menu item to render.
***REMOVED*** @return {Element} Root element for the item.
***REMOVED*** @override
***REMOVED***
goog.ui.MenuItemRenderer.prototype.createDom = function(item) {
  var element = item.getDomHelper().createDom(
      'div', this.getClassNames(item).join(' '),
      this.createContent(item.getContent(), item.getDomHelper()));
  this.setEnableCheckBoxStructure(item, element,
      item.isSupportedState(goog.ui.Component.State.SELECTED) ||
      item.isSupportedState(goog.ui.Component.State.CHECKED));
  this.setAriaStates(item, element);
  this.correctAriaRole(item, element);
  return element;
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.ui.MenuItemRenderer.prototype.getContentElement = function(element) {
  return***REMOVED*****REMOVED*** @type {Element}***REMOVED*** (element && element.firstChild);
***REMOVED***


***REMOVED***
***REMOVED*** Overrides {@link goog.ui.ControlRenderer#decorate} by initializing the
***REMOVED*** menu item to checkable based on whether the element to be decorated has
***REMOVED*** extra stying indicating that it should be.
***REMOVED*** @param {goog.ui.Control} item Menu item instance to decorate the element.
***REMOVED*** @param {Element} element Element to decorate.
***REMOVED*** @return {Element} Decorated element.
***REMOVED*** @override
***REMOVED***
goog.ui.MenuItemRenderer.prototype.decorate = function(item, element) {
  goog.asserts.assert(element);
  if (!this.hasContentStructure(element)) {
    element.appendChild(
        this.createContent(element.childNodes, item.getDomHelper()));
  }
  if (goog.dom.classlist.contains(element, goog.getCssName('goog-option'))) {
    (***REMOVED*** @type {goog.ui.MenuItem}***REMOVED*** (item)).setCheckable(true);
    this.setCheckable(item, element, true);
  }
  return goog.ui.MenuItemRenderer.superClass_.decorate.call(this, item,
      element);
***REMOVED***


***REMOVED***
***REMOVED*** Takes a menu item's root element, and sets its content to the given text
***REMOVED*** caption or DOM structure.  Overrides the superclass immplementation by
***REMOVED*** making sure that the checkbox structure (for selectable/checkable menu
***REMOVED*** items) is preserved.
***REMOVED*** @param {Element} element The item's root element.
***REMOVED*** @param {goog.ui.ControlContent} content Text caption or DOM structure to be
***REMOVED***     set as the item's content.
***REMOVED*** @override
***REMOVED***
goog.ui.MenuItemRenderer.prototype.setContent = function(element, content) {
  // Save the checkbox element, if present.
  var contentElement = this.getContentElement(element);
  var checkBoxElement = this.hasCheckBoxStructure(element) ?
      contentElement.firstChild : null;
  goog.ui.MenuItemRenderer.superClass_.setContent.call(this, element, content);
  if (checkBoxElement && !this.hasCheckBoxStructure(element)) {
    // The call to setContent() blew away the checkbox element; reattach it.
    contentElement.insertBefore(checkBoxElement,
        contentElement.firstChild || null);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Returns true if the element appears to have a proper menu item structure by
***REMOVED*** checking whether its first child has the appropriate structural class name.
***REMOVED*** @param {Element} element Element to check.
***REMOVED*** @return {boolean} Whether the element appears to have a proper menu item DOM.
***REMOVED*** @protected
***REMOVED***
goog.ui.MenuItemRenderer.prototype.hasContentStructure = function(element) {
  var child = goog.dom.getFirstElementChild(element);
  var contentClassName = this.getCompositeCssClass_(
      goog.ui.MenuItemRenderer.CompositeCssClassIndex_.CONTENT);
  return !!child && goog.dom.classlist.contains(child, contentClassName);
***REMOVED***


***REMOVED***
***REMOVED*** Wraps the given text caption or existing DOM node(s) in a structural element
***REMOVED*** containing the menu item's contents.
***REMOVED*** @param {goog.ui.ControlContent} content Menu item contents.
***REMOVED*** @param {goog.dom.DomHelper} dom DOM helper for document interaction.
***REMOVED*** @return {Element} Menu item content element.
***REMOVED*** @protected
***REMOVED***
goog.ui.MenuItemRenderer.prototype.createContent = function(content, dom) {
  var contentClassName = this.getCompositeCssClass_(
      goog.ui.MenuItemRenderer.CompositeCssClassIndex_.CONTENT);
  return dom.createDom('div', contentClassName, content);
***REMOVED***


***REMOVED***
***REMOVED*** Enables/disables radio button semantics on the menu item.
***REMOVED*** @param {goog.ui.Control} item Menu item to update.
***REMOVED*** @param {Element} element Menu item element to update (may be null if the
***REMOVED***     item hasn't been rendered yet).
***REMOVED*** @param {boolean} selectable Whether the item should be selectable.
***REMOVED***
goog.ui.MenuItemRenderer.prototype.setSelectable = function(item, element,
    selectable) {
  if (element) {
    goog.a11y.aria.setRole(element,
        selectable ?
        goog.a11y.aria.Role.MENU_ITEM_RADIO :
       ***REMOVED*****REMOVED*** @type {string}***REMOVED*** (this.getAriaRole()));
    this.setEnableCheckBoxStructure(item, element, selectable);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Enables/disables checkbox semantics on the menu item.
***REMOVED*** @param {goog.ui.Control} item Menu item to update.
***REMOVED*** @param {Element} element Menu item element to update (may be null if the
***REMOVED***     item hasn't been rendered yet).
***REMOVED*** @param {boolean} checkable Whether the item should be checkable.
***REMOVED***
goog.ui.MenuItemRenderer.prototype.setCheckable = function(item, element,
    checkable) {
  if (element) {
    goog.a11y.aria.setRole(element,
        checkable ?
        goog.a11y.aria.Role.MENU_ITEM_CHECKBOX :
       ***REMOVED*****REMOVED*** @type {string}***REMOVED*** (this.getAriaRole()));
    this.setEnableCheckBoxStructure(item, element, checkable);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Determines whether the item contains a checkbox element.
***REMOVED*** @param {Element} element Menu item root element.
***REMOVED*** @return {boolean} Whether the element contains a checkbox element.
***REMOVED*** @protected
***REMOVED***
goog.ui.MenuItemRenderer.prototype.hasCheckBoxStructure = function(element) {
  var contentElement = this.getContentElement(element);
  if (contentElement) {
    var child = contentElement.firstChild;
    var checkboxClassName = this.getCompositeCssClass_(
        goog.ui.MenuItemRenderer.CompositeCssClassIndex_.CHECKBOX);
    return !!child && goog.dom.isElement(child) &&
        goog.dom.classlist.contains(***REMOVED*** @type {!Element}***REMOVED*** (child),
            checkboxClassName);
  }
  return false;
***REMOVED***


***REMOVED***
***REMOVED*** Adds or removes extra markup and CSS styling to the menu item to make it
***REMOVED*** selectable or non-selectable, depending on the value of the
***REMOVED*** {@code selectable} argument.
***REMOVED*** @param {goog.ui.Control} item Menu item to update.
***REMOVED*** @param {Element} element Menu item element to update.
***REMOVED*** @param {boolean} enable Whether to add or remove the checkbox structure.
***REMOVED*** @protected
***REMOVED***
goog.ui.MenuItemRenderer.prototype.setEnableCheckBoxStructure = function(item,
    element, enable) {
  goog.asserts.assert(element);
  if (enable != this.hasCheckBoxStructure(element)) {
    goog.dom.classlist.enable(element, goog.getCssName('goog-option'), enable);
    var contentElement = this.getContentElement(element);
    if (enable) {
      // Insert checkbox structure.
      var checkboxClassName = this.getCompositeCssClass_(
          goog.ui.MenuItemRenderer.CompositeCssClassIndex_.CHECKBOX);
      contentElement.insertBefore(
          item.getDomHelper().createDom('div', checkboxClassName),
          contentElement.firstChild || null);
    } else {
      // Remove checkbox structure.
      contentElement.removeChild(contentElement.firstChild);
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** Takes a single {@link goog.ui.Component.State}, and returns the
***REMOVED*** corresponding CSS class name (null if none).  Overrides the superclass
***REMOVED*** implementation by using 'highlight' as opposed to 'hover' as the CSS
***REMOVED*** class name suffix for the HOVER state, for backwards compatibility.
***REMOVED*** @param {goog.ui.Component.State} state Component state.
***REMOVED*** @return {string|undefined} CSS class representing the given state
***REMOVED***     (undefined if none).
***REMOVED*** @override
***REMOVED***
goog.ui.MenuItemRenderer.prototype.getClassForState = function(state) {
  switch (state) {
    case goog.ui.Component.State.HOVER:
      // We use 'highlight' as the suffix, for backwards compatibility.
      return this.getCompositeCssClass_(
          goog.ui.MenuItemRenderer.CompositeCssClassIndex_.HOVER);
    case goog.ui.Component.State.CHECKED:
    case goog.ui.Component.State.SELECTED:
      // We use 'goog-option-selected' as the class, for backwards
      // compatibility.
      return goog.getCssName('goog-option-selected');
    default:
      return goog.ui.MenuItemRenderer.superClass_.getClassForState.call(this,
          state);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Takes a single CSS class name which may represent a component state, and
***REMOVED*** returns the corresponding component state (0x00 if none).  Overrides the
***REMOVED*** superclass implementation by treating 'goog-option-selected' as special,
***REMOVED*** for backwards compatibility.
***REMOVED*** @param {string} className CSS class name, possibly representing a component
***REMOVED***     state.
***REMOVED*** @return {goog.ui.Component.State} state Component state corresponding
***REMOVED***     to the given CSS class (0x00 if none).
***REMOVED*** @override
***REMOVED***
goog.ui.MenuItemRenderer.prototype.getStateFromClass = function(className) {
  var hoverClassName = this.getCompositeCssClass_(
      goog.ui.MenuItemRenderer.CompositeCssClassIndex_.HOVER);
  switch (className) {
    case goog.getCssName('goog-option-selected'):
      return goog.ui.Component.State.CHECKED;
    case hoverClassName:
      return goog.ui.Component.State.HOVER;
    default:
      return goog.ui.MenuItemRenderer.superClass_.getStateFromClass.call(this,
          className);
  }
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.ui.MenuItemRenderer.prototype.getCssClass = function() {
  return goog.ui.MenuItemRenderer.CSS_CLASS;
***REMOVED***


***REMOVED***
***REMOVED*** Corrects the ARIA role based on checkable and selectable.
***REMOVED*** @param {goog.ui.Control} item The owner menu item.
***REMOVED*** @param {Element} element The element.
***REMOVED***
goog.ui.MenuItemRenderer.prototype.correctAriaRole = function(item, element) {
  if (item.isSupportedState(goog.ui.Component.State.SELECTED) ||
      item.isSupportedState(goog.ui.Component.State.CHECKED)) {
    this.setAriaRole(element,
        item.isSupportedState(goog.ui.Component.State.CHECKED) ?
        goog.a11y.aria.Role.MENU_ITEM_CHECKBOX :
        goog.a11y.aria.Role.MENU_ITEM_RADIO);
  }
***REMOVED***
