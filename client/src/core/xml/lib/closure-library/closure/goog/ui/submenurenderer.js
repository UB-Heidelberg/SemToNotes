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
***REMOVED*** @fileoverview Renderer for {@link goog.ui.SubMenu}s.
***REMOVED***
***REMOVED***

goog.provide('goog.ui.SubMenuRenderer');

goog.require('goog.a11y.aria');
goog.require('goog.a11y.aria.State');
goog.require('goog.asserts');
goog.require('goog.dom');
goog.require('goog.dom.classes');
goog.require('goog.style');
goog.require('goog.ui.Menu');
goog.require('goog.ui.MenuItemRenderer');



***REMOVED***
***REMOVED*** Default renderer for {@link goog.ui.SubMenu}s.  Each item has the following
***REMOVED*** structure:
***REMOVED***    <div class="goog-submenu">
***REMOVED***      ...(menuitem content)...
***REMOVED***      <div class="goog-menu">
***REMOVED***        ... (submenu content) ...
***REMOVED***      </div>
***REMOVED***    </div>
***REMOVED***
***REMOVED*** @extends {goog.ui.MenuItemRenderer}
***REMOVED***
goog.ui.SubMenuRenderer = function() {
  goog.ui.MenuItemRenderer.call(this);
***REMOVED***
goog.inherits(goog.ui.SubMenuRenderer, goog.ui.MenuItemRenderer);
goog.addSingletonGetter(goog.ui.SubMenuRenderer);


***REMOVED***
***REMOVED*** Default CSS class to be applied to the root element of components rendered
***REMOVED*** by this renderer.
***REMOVED*** @type {string}
***REMOVED***
goog.ui.SubMenuRenderer.CSS_CLASS = goog.getCssName('goog-submenu');


***REMOVED***
***REMOVED*** The CSS class for submenus that displays the submenu arrow.
***REMOVED*** @type {string}
***REMOVED*** @private
***REMOVED***
goog.ui.SubMenuRenderer.CSS_CLASS_SUBMENU_ =
    goog.getCssName('goog-submenu-arrow');


***REMOVED***
***REMOVED*** Overrides {@link goog.ui.MenuItemRenderer#createDom} by adding
***REMOVED*** the additional class 'goog-submenu' to the created element,
***REMOVED*** and passes the element to {@link goog.ui.SubMenuItemRenderer#addArrow_}
***REMOVED*** to add an child element that can be styled to show an arrow.
***REMOVED*** @param {goog.ui.Control} control goog.ui.SubMenu to render.
***REMOVED*** @return {Element} Root element for the item.
***REMOVED*** @override
***REMOVED***
goog.ui.SubMenuRenderer.prototype.createDom = function(control) {
  var subMenu =***REMOVED*****REMOVED*** @type {goog.ui.SubMenu}***REMOVED*** (control);
  var element = goog.ui.SubMenuRenderer.superClass_.createDom.call(this,
                                                                   subMenu);
  goog.dom.classes.add(element, goog.ui.SubMenuRenderer.CSS_CLASS);
  this.addArrow_(subMenu, element);
  return element;
***REMOVED***


***REMOVED***
***REMOVED*** Overrides {@link goog.ui.MenuItemRenderer#decorate} by adding
***REMOVED*** the additional class 'goog-submenu' to the decorated element,
***REMOVED*** and passing the element to {@link goog.ui.SubMenuItemRenderer#addArrow_}
***REMOVED*** to add a child element that can be styled to show an arrow.
***REMOVED*** Also searches the element for a child with the class goog-menu. If a
***REMOVED*** matching child element is found, creates a goog.ui.Menu, uses it to
***REMOVED*** decorate the child element, and passes that menu to subMenu.setMenu.
***REMOVED*** @param {goog.ui.Control} control goog.ui.SubMenu to render.
***REMOVED*** @param {Element} element Element to decorate.
***REMOVED*** @return {Element} Root element for the item.
***REMOVED*** @override
***REMOVED***
goog.ui.SubMenuRenderer.prototype.decorate = function(control, element) {
  var subMenu =***REMOVED*****REMOVED*** @type {goog.ui.SubMenu}***REMOVED*** (control);
  element = goog.ui.SubMenuRenderer.superClass_.decorate.call(
      this, subMenu, element);
  goog.dom.classes.add(element, goog.ui.SubMenuRenderer.CSS_CLASS);
  this.addArrow_(subMenu, element);

  // Search for a child menu and decorate it.
  var childMenuEls = goog.dom.getElementsByTagNameAndClass(
      'div', goog.getCssName('goog-menu'), element);
  if (childMenuEls.length) {
    var childMenu = new goog.ui.Menu(subMenu.getDomHelper());
    var childMenuEl = childMenuEls[0];
    // Hide the menu element before attaching it to the document body; see
    // bug 1089244.
    goog.style.showElement(childMenuEl, false);
    subMenu.getDomHelper().getDocument().body.appendChild(childMenuEl);
    childMenu.decorate(childMenuEl);
    subMenu.setMenu(childMenu, true);
  }
  return element;
***REMOVED***


***REMOVED***
***REMOVED*** Takes a menu item's root element, and sets its content to the given text
***REMOVED*** caption or DOM structure.  Overrides the superclass immplementation by
***REMOVED*** making sure that the submenu arrow structure is preserved.
***REMOVED*** @param {Element} element The item's root element.
***REMOVED*** @param {goog.ui.ControlContent} content Text caption or DOM structure to be
***REMOVED***     set as the item's content.
***REMOVED*** @override
***REMOVED***
goog.ui.SubMenuRenderer.prototype.setContent = function(element, content) {
  // Save the submenu arrow element, if present.
  var contentElement = this.getContentElement(element);
  var arrowElement = contentElement && contentElement.lastChild;
  goog.ui.SubMenuRenderer.superClass_.setContent.call(this, element, content);
  // If the arrowElement was there, is no longer there, and really was an arrow,
  // reappend it.
  if (arrowElement &&
      contentElement.lastChild != arrowElement &&
      goog.dom.classes.has(arrowElement,
          goog.ui.SubMenuRenderer.CSS_CLASS_SUBMENU_)) {
    contentElement.appendChild(arrowElement);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Overrides {@link goog.ui.MenuItemRenderer#initializeDom} to tweak
***REMOVED*** the DOM structure for the span.goog-submenu-arrow element
***REMOVED*** depending on the text direction (LTR or RTL). When the SubMenu is RTL
***REMOVED*** the arrow will be given the additional class of goog-submenu-arrow-rtl,
***REMOVED*** and the arrow will be moved up to be the first child in the SubMenu's
***REMOVED*** element. Otherwise the arrow will have the class goog-submenu-arrow-ltr,
***REMOVED*** and be kept as the last child of the SubMenu's element.
***REMOVED*** @param {goog.ui.Control} control goog.ui.SubMenu whose DOM is to be
***REMOVED***     initialized as it enters the document.
***REMOVED*** @override
***REMOVED***
goog.ui.SubMenuRenderer.prototype.initializeDom = function(control) {
  var subMenu =***REMOVED*****REMOVED*** @type {goog.ui.SubMenu}***REMOVED*** (control);
  goog.ui.SubMenuRenderer.superClass_.initializeDom.call(this, subMenu);
  var element = subMenu.getContentElement();
  var arrow = subMenu.getDomHelper().getElementsByTagNameAndClass(
      'span', goog.ui.SubMenuRenderer.CSS_CLASS_SUBMENU_, element)[0];
  goog.ui.SubMenuRenderer.setArrowTextContent_(subMenu, arrow);
  if (arrow != element.lastChild) {
    element.appendChild(arrow);
  }
  var subMenuElement = subMenu.getElement();
  goog.asserts.assert(subMenuElement,
      'The sub menu DOM element cannot be null.');
  goog.a11y.aria.setState(subMenuElement,
      goog.a11y.aria.State.HASPOPUP,
      'true');
***REMOVED***


***REMOVED***
***REMOVED*** Appends a child node with the class goog.getCssName('goog-submenu-arrow') or
***REMOVED*** 'goog-submenu-arrow-rtl' which can be styled to show an arrow.
***REMOVED*** @param {goog.ui.SubMenu} subMenu SubMenu to render.
***REMOVED*** @param {Element} element Element to decorate.
***REMOVED*** @private
***REMOVED***
goog.ui.SubMenuRenderer.prototype.addArrow_ = function(subMenu, element) {
  var arrow = subMenu.getDomHelper().createDom('span');
  arrow.className = goog.ui.SubMenuRenderer.CSS_CLASS_SUBMENU_;
  goog.ui.SubMenuRenderer.setArrowTextContent_(subMenu, arrow);
  this.getContentElement(element).appendChild(arrow);
***REMOVED***


***REMOVED***
***REMOVED*** The unicode char for a left arrow.
***REMOVED*** @type {string}
***REMOVED*** @private
***REMOVED***
goog.ui.SubMenuRenderer.LEFT_ARROW_ = '\u25C4';


***REMOVED***
***REMOVED*** The unicode char for a right arrow.
***REMOVED*** @type {string}
***REMOVED*** @private
***REMOVED***
goog.ui.SubMenuRenderer.RIGHT_ARROW_ = '\u25BA';


***REMOVED***
***REMOVED*** Set the text content of an arrow.
***REMOVED*** @param {goog.ui.SubMenu} subMenu The sub menu that owns the arrow.
***REMOVED*** @param {Element} arrow The arrow element.
***REMOVED*** @private
***REMOVED***
goog.ui.SubMenuRenderer.setArrowTextContent_ = function(subMenu, arrow) {
  // Fix arrow rtl
  var leftArrow = goog.ui.SubMenuRenderer.LEFT_ARROW_;
  var rightArrow = goog.ui.SubMenuRenderer.RIGHT_ARROW_;
  if (subMenu.isRightToLeft()) {
    goog.dom.classes.add(arrow, goog.getCssName('goog-submenu-arrow-rtl'));
    // Unicode character - Black left-pointing pointer iff aligned to end.
    goog.dom.setTextContent(arrow, subMenu.isAlignedToEnd() ?
        leftArrow : rightArrow);
  } else {
    goog.dom.classes.remove(arrow, goog.getCssName('goog-submenu-arrow-rtl'));
    // Unicode character - Black right-pointing pointer iff aligned to end.
    goog.dom.setTextContent(arrow, subMenu.isAlignedToEnd() ?
        rightArrow : leftArrow);
  }
***REMOVED***
