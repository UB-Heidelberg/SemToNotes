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
***REMOVED*** @fileoverview Similiar functionality of {@link goog.ui.MenuButtonRenderer},
***REMOVED*** but inherits from {@link goog.ui.FlatButtonRenderer} instead of
***REMOVED*** {@link goog.ui.CustomButtonRenderer}. This creates a simpler menu button
***REMOVED*** that will look more like a traditional <select> menu.
***REMOVED***
***REMOVED***

goog.provide('goog.ui.FlatMenuButtonRenderer');

goog.require('goog.style');
goog.require('goog.ui.ControlContent');
goog.require('goog.ui.FlatButtonRenderer');
goog.require('goog.ui.INLINE_BLOCK_CLASSNAME');
goog.require('goog.ui.Menu');
goog.require('goog.ui.MenuButton');
goog.require('goog.ui.MenuRenderer');
goog.require('goog.ui.registry');



***REMOVED***
***REMOVED*** Flat Menu Button renderer. Creates a simpler version of
***REMOVED*** {@link goog.ui.MenuButton} that doesn't look like a button and
***REMOVED*** doesn't have rounded corners. Uses just a <div> and looks more like
***REMOVED*** a traditional <select> element.
***REMOVED***
***REMOVED*** @extends {goog.ui.FlatButtonRenderer}
***REMOVED***
goog.ui.FlatMenuButtonRenderer = function() {
  goog.ui.FlatButtonRenderer.call(this);
***REMOVED***
goog.inherits(goog.ui.FlatMenuButtonRenderer, goog.ui.FlatButtonRenderer);
goog.addSingletonGetter(goog.ui.FlatMenuButtonRenderer);


***REMOVED***
***REMOVED*** Default CSS class to be applied to the root element of components rendered
***REMOVED*** by this renderer.
***REMOVED*** @type {string}
***REMOVED***
goog.ui.FlatMenuButtonRenderer.CSS_CLASS =
    goog.getCssName('goog-flat-menu-button');


***REMOVED***
***REMOVED*** Returns the button's contents wrapped in the following DOM structure:
***REMOVED***    <div class="goog-inline-block goog-flat-menu-button">
***REMOVED***        <div class="goog-inline-block goog-flat-menu-button-caption">
***REMOVED***          Contents...
***REMOVED***        </div>
***REMOVED***        <div class="goog-inline-block goog-flat-menu-button-dropdown">
***REMOVED***          &nbsp;
***REMOVED***        </div>
***REMOVED***    </div>
***REMOVED*** Overrides {@link goog.ui.FlatButtonRenderer#createDom}.
***REMOVED*** @param {goog.ui.Control} control Button to render.
***REMOVED*** @return {Element} Root element for the button.
***REMOVED*** @override
***REMOVED***
goog.ui.FlatMenuButtonRenderer.prototype.createDom = function(control) {
  var button =***REMOVED*****REMOVED*** @type {goog.ui.Button}***REMOVED*** (control);
  var classNames = this.getClassNames(button);
  var attributes = {
    'class': goog.ui.INLINE_BLOCK_CLASSNAME + ' ' + classNames.join(' '),
    'title': button.getTooltip() || ''
 ***REMOVED*****REMOVED***
  return button.getDomHelper().createDom('div', attributes,
      [this.createCaption(button.getContent(), button.getDomHelper()),
       this.createDropdown(button.getDomHelper())]);
***REMOVED***


***REMOVED***
***REMOVED*** Takes the button's root element and returns the parent element of the
***REMOVED*** button's contents.
***REMOVED*** @param {Element} element Root element of the button whose content
***REMOVED*** element is to be returned.
***REMOVED*** @return {Element} The button's content element (if any).
***REMOVED*** @override
***REMOVED***
goog.ui.FlatMenuButtonRenderer.prototype.getContentElement = function(element) {
  return element &&***REMOVED*****REMOVED*** @type {Element}***REMOVED*** (element.firstChild);
***REMOVED***


***REMOVED***
***REMOVED*** Takes an element, decorates it with the menu button control, and returns
***REMOVED*** the element.  Overrides {@link goog.ui.CustomButtonRenderer#decorate} by
***REMOVED*** looking for a child element that can be decorated by a menu, and if it
***REMOVED*** finds one, decorates it and attaches it to the menu button.
***REMOVED*** @param {goog.ui.Control} button Menu button to decorate the element.
***REMOVED*** @param {Element} element Element to decorate.
***REMOVED*** @return {Element} Decorated element.
***REMOVED*** @override
***REMOVED***
goog.ui.FlatMenuButtonRenderer.prototype.decorate = function(button, element) {
  // TODO(user): MenuButtonRenderer uses the exact same code.
  // Refactor this block to its own module where both can use it.
  var menuElem = goog.dom.getElementsByTagNameAndClass(
      '*', goog.ui.MenuRenderer.CSS_CLASS, element)[0];
  if (menuElem) {
    // Move the menu element directly under the body, but hide it first; see
    // bug 1089244.
    goog.style.showElement(menuElem, false);
    button.getDomHelper().getDocument().body.appendChild(menuElem);

    // Decorate the menu and attach it to the button.
    var menu = new goog.ui.Menu();
    menu.decorate(menuElem);
    button.setMenu(menu);
  }

  // Add the caption if it's not already there.
  var captionElem = goog.dom.getElementsByTagNameAndClass(
      '*', goog.getCssName(this.getCssClass(), 'caption'), element)[0];
  if (!captionElem) {
    element.appendChild(
        this.createCaption(element.childNodes, button.getDomHelper()));
  }

  // Add the dropdown icon if it's not already there.
  var dropdownElem = goog.dom.getElementsByTagNameAndClass(
      '*', goog.getCssName(this.getCssClass(), 'dropdown'), element)[0];
  if (!dropdownElem) {
    element.appendChild(this.createDropdown(button.getDomHelper()));
  }

  // Let the superclass do the rest.
  return goog.ui.FlatMenuButtonRenderer.superClass_.decorate.call(this, button,
      element);
***REMOVED***


***REMOVED***
***REMOVED*** Takes a text caption or existing DOM structure, and returns it wrapped in
***REMOVED*** an appropriately-styled DIV.  Creates the following DOM structure:
***REMOVED***    <div class="goog-inline-block goog-flat-menu-button-caption">
***REMOVED***      Contents...
***REMOVED***    </div>
***REMOVED*** @param {goog.ui.ControlContent} content Text caption or DOM structure to wrap
***REMOVED***     in a box.
***REMOVED*** @param {goog.dom.DomHelper} dom DOM helper, used for document interaction.
***REMOVED*** @return {Element} Caption element.
***REMOVED***
goog.ui.FlatMenuButtonRenderer.prototype.createCaption = function(content,
                                                                  dom) {
  return dom.createDom('div',
      goog.ui.INLINE_BLOCK_CLASSNAME + ' ' +
      goog.getCssName(this.getCssClass(), 'caption'), content);
***REMOVED***


***REMOVED***
***REMOVED*** Returns an appropriately-styled DIV containing a dropdown arrow element.
***REMOVED*** Creates the following DOM structure:
***REMOVED***    <div class="goog-inline-block goog-flat-menu-button-dropdown">
***REMOVED***      &nbsp;
***REMOVED***    </div>
***REMOVED*** @param {goog.dom.DomHelper} dom DOM helper, used for document interaction.
***REMOVED*** @return {Element} Dropdown element.
***REMOVED***
goog.ui.FlatMenuButtonRenderer.prototype.createDropdown = function(dom) {
  // 00A0 is &nbsp;
  return dom.createDom('div',
      goog.ui.INLINE_BLOCK_CLASSNAME + ' ' +
      goog.getCssName(this.getCssClass(), 'dropdown'), '\u00A0');
***REMOVED***


***REMOVED***
***REMOVED*** Returns the CSS class to be applied to the root element of components
***REMOVED*** rendered using this renderer.
***REMOVED*** @return {string} Renderer-specific CSS class.
***REMOVED*** @override
***REMOVED***
goog.ui.FlatMenuButtonRenderer.prototype.getCssClass = function() {
  return goog.ui.FlatMenuButtonRenderer.CSS_CLASS;
***REMOVED***


// Register a decorator factory function for Flat Menu Buttons.
goog.ui.registry.setDecoratorByClassName(
    goog.ui.FlatMenuButtonRenderer.CSS_CLASS,
    function() {
      // Uses goog.ui.MenuButton, but with FlatMenuButtonRenderer.
      return new goog.ui.MenuButton(null, null,
          goog.ui.FlatMenuButtonRenderer.getInstance());
    });

