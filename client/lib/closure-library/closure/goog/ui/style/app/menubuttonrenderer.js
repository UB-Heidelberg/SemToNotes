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
***REMOVED*** @fileoverview Renderer for {@link goog.ui.style.app.MenuButton}s and
***REMOVED*** subclasses.
***REMOVED***
***REMOVED*** @author attila@google.com (Attila Bodis)
***REMOVED*** @author gveen@google.com (Greg Veen)
***REMOVED***

goog.provide('goog.ui.style.app.MenuButtonRenderer');

goog.require('goog.a11y.aria.Role');
goog.require('goog.array');
goog.require('goog.dom');
goog.require('goog.style');
goog.require('goog.ui.Menu');
goog.require('goog.ui.MenuRenderer');
goog.require('goog.ui.style.app.ButtonRenderer');



***REMOVED***
***REMOVED*** Renderer for {@link goog.ui.style.app.MenuButton}s.  This implementation
***REMOVED*** overrides {@link goog.ui.style.app.ButtonRenderer#createButton} to insert a
***REMOVED*** dropdown element into the content element after the specified content.
***REMOVED***
***REMOVED*** @extends {goog.ui.style.app.ButtonRenderer}
***REMOVED*** @final
***REMOVED***
goog.ui.style.app.MenuButtonRenderer = function() {
  goog.ui.style.app.ButtonRenderer.call(this);
***REMOVED***
goog.inherits(goog.ui.style.app.MenuButtonRenderer,
    goog.ui.style.app.ButtonRenderer);
goog.addSingletonGetter(goog.ui.style.app.MenuButtonRenderer);


***REMOVED***
***REMOVED*** Default CSS class to be applied to the root element of components rendered
***REMOVED*** by this renderer.
***REMOVED*** @type {string}
***REMOVED***
goog.ui.style.app.MenuButtonRenderer.CSS_CLASS =
    goog.getCssName('goog-menu-button');


***REMOVED***
***REMOVED*** Array of arrays of CSS classes that we want composite classes added and
***REMOVED*** removed for in IE6 and lower as a workaround for lack of multi-class CSS
***REMOVED*** selector support.
***REMOVED*** @type {Array.<Array.<string>>}
***REMOVED***
goog.ui.style.app.MenuButtonRenderer.IE6_CLASS_COMBINATIONS = [
  [goog.getCssName('goog-button-base-rtl'),
   goog.getCssName('goog-menu-button')],

  [goog.getCssName('goog-button-base-hover'),
   goog.getCssName('goog-menu-button')],

  [goog.getCssName('goog-button-base-focused'),
   goog.getCssName('goog-menu-button')],

  [goog.getCssName('goog-button-base-disabled'),
   goog.getCssName('goog-menu-button')],

  [goog.getCssName('goog-button-base-active'),
   goog.getCssName('goog-menu-button')],

  [goog.getCssName('goog-button-base-open'),
   goog.getCssName('goog-menu-button')],

  [goog.getCssName('goog-button-base-active'),
   goog.getCssName('goog-button-base-open'),
   goog.getCssName('goog-menu-button')]
];


***REMOVED***
***REMOVED*** Returns the ARIA role to be applied to menu buttons, which
***REMOVED*** have a menu attached to them.
***REMOVED*** @return {goog.a11y.aria.Role} ARIA role.
***REMOVED*** @override
***REMOVED***
goog.ui.style.app.MenuButtonRenderer.prototype.getAriaRole = function() {
  // If we apply the 'button' ARIA role to the menu button, the
  // screen reader keeps referring to menus as buttons, which
  // might be misleading for the users. Hence the ARIA role
  // 'menu' is assigned.
  return goog.a11y.aria.Role.MENU;
***REMOVED***


***REMOVED***
***REMOVED*** Takes the button's root element and returns the parent element of the
***REMOVED*** button's contents.  Overrides the superclass implementation by taking
***REMOVED*** the nested DIV structure of menu buttons into account.
***REMOVED*** @param {Element} element Root element of the button whose content element
***REMOVED***     is to be returned.
***REMOVED*** @return {Element} The button's content element.
***REMOVED*** @override
***REMOVED***
goog.ui.style.app.MenuButtonRenderer.prototype.getContentElement =
    function(element) {
  return goog.ui.style.app.MenuButtonRenderer.superClass_.getContentElement
      .call(this, element);
***REMOVED***


***REMOVED***
***REMOVED*** Takes an element, decorates it with the menu button control, and returns
***REMOVED*** the element.  Overrides {@link goog.ui.style.app.ButtonRenderer#decorate} by
***REMOVED*** looking for a child element that can be decorated by a menu, and if it
***REMOVED*** finds one, decorates it and attaches it to the menu button.
***REMOVED*** @param {goog.ui.Control} control goog.ui.MenuButton to decorate the element.
***REMOVED*** @param {Element} element Element to decorate.
***REMOVED*** @return {Element} Decorated element.
***REMOVED*** @override
***REMOVED***
goog.ui.style.app.MenuButtonRenderer.prototype.decorate =
    function(control, element) {
  var button =***REMOVED*****REMOVED*** @type {goog.ui.MenuButton}***REMOVED*** (control);
  // TODO(attila):  Add more robust support for subclasses of goog.ui.Menu.
  var menuElem = goog.dom.getElementsByTagNameAndClass(
      '*', goog.ui.MenuRenderer.CSS_CLASS, element)[0];
  if (menuElem) {
    // Move the menu element directly under the body (but hide it first to
    // prevent flicker; see bug 1089244).
    goog.style.setElementShown(menuElem, false);
    goog.dom.appendChild(goog.dom.getOwnerDocument(menuElem).body, menuElem);

    // Decorate the menu and attach it to the button.
    var menu = new goog.ui.Menu();
    menu.decorate(menuElem);
    button.setMenu(menu);
  }

  // Let the superclass do the rest.
  return goog.ui.style.app.MenuButtonRenderer.superClass_.decorate.call(this,
      button, element);
***REMOVED***


***REMOVED***
***REMOVED*** Takes a text caption or existing DOM structure, and returns the content and
***REMOVED*** a dropdown arrow element wrapped in a pseudo-rounded-corner box.  Creates
***REMOVED*** the following DOM structure:
***REMOVED***  <div class="goog-inline-block goog-button-outer-box">
***REMOVED***    <div class="goog-inline-block goog-button-inner-box">
***REMOVED***      <div class="goog-button-pos">
***REMOVED***        <div class="goog-button-top-shadow">&nbsp;</div>
***REMOVED***        <div class="goog-button-content">
***REMOVED***          Contents...
***REMOVED***          <div class="goog-menu-button-dropdown"> </div>
***REMOVED***        </div>
***REMOVED***      </div>
***REMOVED***    </div>
***REMOVED***  </div>
***REMOVED*** @param {goog.ui.ControlContent} content Text caption or DOM structure to wrap
***REMOVED***     in a box.
***REMOVED*** @param {goog.dom.DomHelper} dom DOM helper, used for document interaction.
***REMOVED*** @return {Element} Pseudo-rounded-corner box containing the content.
***REMOVED*** @override
***REMOVED***
goog.ui.style.app.MenuButtonRenderer.prototype.createButton = function(content,
    dom) {
  var contentWithDropdown = this.createContentWithDropdown(content, dom);
  return goog.ui.style.app.MenuButtonRenderer.superClass_.createButton.call(
      this, contentWithDropdown, dom);
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.ui.style.app.MenuButtonRenderer.prototype.setContent = function(element,
    content) {
  var dom = goog.dom.getDomHelper(this.getContentElement(element));
  goog.ui.style.app.MenuButtonRenderer.superClass_.setContent.call(
      this, element, this.createContentWithDropdown(content, dom));
***REMOVED***


***REMOVED***
***REMOVED*** Inserts dropdown element as last child of existing content.
***REMOVED*** @param {goog.ui.ControlContent} content Text caption or DOM structure.
***REMOVED*** @param {goog.dom.DomHelper} dom DOM helper, used for document ineraction.
***REMOVED*** @return {Array.<Node>} DOM structure to be set as the button's content.
***REMOVED***
goog.ui.style.app.MenuButtonRenderer.prototype.createContentWithDropdown =
    function(content, dom) {
  var caption = dom.createDom('div', null, content, this.createDropdown(dom));
  return goog.array.toArray(caption.childNodes);
***REMOVED***


***REMOVED***
***REMOVED*** Returns an appropriately-styled DIV containing a dropdown arrow.
***REMOVED*** Creates the following DOM structure:
***REMOVED***    <div class="goog-menu-button-dropdown"> </div>
***REMOVED*** @param {goog.dom.DomHelper} dom DOM helper, used for document interaction.
***REMOVED*** @return {Element} Dropdown element.
***REMOVED***
goog.ui.style.app.MenuButtonRenderer.prototype.createDropdown = function(dom) {
  return dom.createDom('div', goog.getCssName(this.getCssClass(), 'dropdown'));
***REMOVED***


***REMOVED***
***REMOVED*** Returns the CSS class to be applied to the root element of components
***REMOVED*** rendered using this renderer.
***REMOVED*** @return {string} Renderer-specific CSS class.
***REMOVED*** @override
***REMOVED***
goog.ui.style.app.MenuButtonRenderer.prototype.getCssClass = function() {
  return goog.ui.style.app.MenuButtonRenderer.CSS_CLASS;
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.ui.style.app.MenuButtonRenderer.prototype.getIe6ClassCombinations =
    function() {
  return goog.ui.style.app.MenuButtonRenderer.IE6_CLASS_COMBINATIONS;
***REMOVED***
