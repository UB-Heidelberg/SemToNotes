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
***REMOVED*** @fileoverview Renderer for {@link goog.ui.MenuButton}s and subclasses.
***REMOVED***
***REMOVED*** @author attila@google.com (Attila Bodis)
***REMOVED***

goog.provide('goog.ui.MenuButtonRenderer');

goog.require('goog.dom');
goog.require('goog.style');
goog.require('goog.ui.CustomButtonRenderer');
goog.require('goog.ui.INLINE_BLOCK_CLASSNAME');
goog.require('goog.ui.Menu');
goog.require('goog.ui.MenuRenderer');
goog.require('goog.userAgent');



***REMOVED***
***REMOVED*** Renderer for {@link goog.ui.MenuButton}s.  This implementation overrides
***REMOVED*** {@link goog.ui.CustomButtonRenderer#createButton} to create a separate
***REMOVED*** caption and dropdown element.
***REMOVED***
***REMOVED*** @extends {goog.ui.CustomButtonRenderer}
***REMOVED***
goog.ui.MenuButtonRenderer = function() {
  goog.ui.CustomButtonRenderer.call(this);
***REMOVED***
goog.inherits(goog.ui.MenuButtonRenderer, goog.ui.CustomButtonRenderer);
goog.addSingletonGetter(goog.ui.MenuButtonRenderer);


***REMOVED***
***REMOVED*** Default CSS class to be applied to the root element of components rendered
***REMOVED*** by this renderer.
***REMOVED*** @type {string}
***REMOVED***
goog.ui.MenuButtonRenderer.CSS_CLASS = goog.getCssName('goog-menu-button');


***REMOVED***
***REMOVED*** A property to denote content elements that have been wrapped in an extra
***REMOVED*** div to work around FF2/RTL bugs.
***REMOVED*** @type {string}
***REMOVED*** @private
***REMOVED***
goog.ui.MenuButtonRenderer.WRAPPER_PROP_ = '__goog_wrapper_div';


if (goog.userAgent.GECKO) {
 ***REMOVED*****REMOVED***
  ***REMOVED*** Takes the menubutton's root element, and sets its content to the given
  ***REMOVED*** text caption or DOM structure. Because the DOM structure of this button is
  ***REMOVED*** conditional based on whether we need to work around FF2/RTL bugs, we
  ***REMOVED*** override the default implementation to take this into account.
  ***REMOVED*** @param {Element} element The control's root element.
  ***REMOVED*** @param {goog.ui.ControlContent} content Text caption or DOM
  ***REMOVED***     structure to be set as the control's content.
  ***REMOVED*** @override
 ***REMOVED*****REMOVED***
  goog.ui.MenuButtonRenderer.prototype.setContent = function(element,
      content) {
    var caption =
        goog.ui.MenuButtonRenderer.superClass_.getContentElement.call(this,
           ***REMOVED*****REMOVED*** @type {Element}***REMOVED*** (element && element.firstChild));
    if (caption) {
      goog.dom.replaceNode(
          this.createCaption(content, goog.dom.getDomHelper(element)),
          caption);
    }
 ***REMOVED*****REMOVED***
} // end goog.userAgent.GECKO


***REMOVED***
***REMOVED*** Takes the button's root element and returns the parent element of the
***REMOVED*** button's contents.  Overrides the superclass implementation by taking
***REMOVED*** the nested DIV structure of menu buttons into account.
***REMOVED*** @param {Element} element Root element of the button whose content element
***REMOVED***     is to be returned.
***REMOVED*** @return {Element} The button's content element.
***REMOVED*** @override
***REMOVED***
goog.ui.MenuButtonRenderer.prototype.getContentElement = function(element) {
  var content =
      goog.ui.MenuButtonRenderer.superClass_.getContentElement.call(this,
         ***REMOVED*****REMOVED*** @type {Element}***REMOVED*** (element && element.firstChild));
  if (goog.userAgent.GECKO && content &&
      content[goog.ui.MenuButtonRenderer.WRAPPER_PROP_]) {
    content =***REMOVED*****REMOVED*** @type {Element}***REMOVED*** (content.firstChild);
  }
  return content;
***REMOVED***


***REMOVED***
***REMOVED*** Takes an element, decorates it with the menu button control, and returns
***REMOVED*** the element.  Overrides {@link goog.ui.CustomButtonRenderer#decorate} by
***REMOVED*** looking for a child element that can be decorated by a menu, and if it
***REMOVED*** finds one, decorates it and attaches it to the menu button.
***REMOVED*** @param {goog.ui.Control} control goog.ui.MenuButton to decorate the element.
***REMOVED*** @param {Element} element Element to decorate.
***REMOVED*** @return {Element} Decorated element.
***REMOVED*** @override
***REMOVED***
goog.ui.MenuButtonRenderer.prototype.decorate = function(control, element) {
  var button =***REMOVED*****REMOVED*** @type {goog.ui.MenuButton}***REMOVED*** (control);
  // TODO(attila):  Add more robust support for subclasses of goog.ui.Menu.
  var menuElem = goog.dom.getElementsByTagNameAndClass(
      '*', goog.ui.MenuRenderer.CSS_CLASS, element)[0];
  if (menuElem) {
    // Move the menu element directly under the body (but hide it first to
    // prevent flicker; see bug 1089244).
    goog.style.showElement(menuElem, false);
    goog.dom.appendChild(goog.dom.getOwnerDocument(menuElem).body, menuElem);

    // Decorate the menu and attach it to the button.
    var menu = new goog.ui.Menu();
    menu.decorate(menuElem);
    button.setMenu(menu);
  }

  // Let the superclass do the rest.
  return goog.ui.MenuButtonRenderer.superClass_.decorate.call(this, button,
      element);
***REMOVED***


***REMOVED***
***REMOVED*** Takes a text caption or existing DOM structure, and returns the content and
***REMOVED*** a dropdown arrow element wrapped in a pseudo-rounded-corner box.  Creates
***REMOVED*** the following DOM structure:
***REMOVED***    <div class="goog-inline-block goog-menu-button-outer-box">
***REMOVED***      <div class="goog-inline-block goog-menu-button-inner-box">
***REMOVED***        <div class="goog-inline-block goog-menu-button-caption">
***REMOVED***          Contents...
***REMOVED***        </div>
***REMOVED***        <div class="goog-inline-block goog-menu-button-dropdown">
***REMOVED***          &nbsp;
***REMOVED***        </div>
***REMOVED***      </div>
***REMOVED***    </div>
***REMOVED*** @param {goog.ui.ControlContent} content Text caption or DOM structure
***REMOVED***     to wrap in a box.
***REMOVED*** @param {goog.dom.DomHelper} dom DOM helper, used for document interaction.
***REMOVED*** @return {Element} Pseudo-rounded-corner box containing the content.
***REMOVED*** @override
***REMOVED***
goog.ui.MenuButtonRenderer.prototype.createButton = function(content, dom) {
  return goog.ui.MenuButtonRenderer.superClass_.createButton.call(this,
      [this.createCaption(content, dom), this.createDropdown(dom)], dom);
***REMOVED***


***REMOVED***
***REMOVED*** Takes a text caption or existing DOM structure, and returns it wrapped in
***REMOVED*** an appropriately-styled DIV.  Creates the following DOM structure:
***REMOVED***    <div class="goog-inline-block goog-menu-button-caption">
***REMOVED***      Contents...
***REMOVED***    </div>
***REMOVED*** @param {goog.ui.ControlContent} content Text caption or DOM structure
***REMOVED***     to wrap in a box.
***REMOVED*** @param {goog.dom.DomHelper} dom DOM helper, used for document interaction.
***REMOVED*** @return {Element} Caption element.
***REMOVED***
goog.ui.MenuButtonRenderer.prototype.createCaption = function(content, dom) {
  return goog.ui.MenuButtonRenderer.wrapCaption(
      content, this.getCssClass(), dom);
***REMOVED***


***REMOVED***
***REMOVED*** Takes a text caption or existing DOM structure, and returns it wrapped in
***REMOVED*** an appropriately-styled DIV.  Creates the following DOM structure:
***REMOVED***    <div class="goog-inline-block goog-menu-button-caption">
***REMOVED***      Contents...
***REMOVED***    </div>
***REMOVED*** @param {goog.ui.ControlContent} content Text caption or DOM structure
***REMOVED***     to wrap in a box.
***REMOVED*** @param {string} cssClass The CSS class for the renderer.
***REMOVED*** @param {goog.dom.DomHelper} dom DOM helper, used for document interaction.
***REMOVED*** @return {Element} Caption element.
***REMOVED***
goog.ui.MenuButtonRenderer.wrapCaption = function(content, cssClass, dom) {
  return dom.createDom(
      'div',
      goog.ui.INLINE_BLOCK_CLASSNAME + ' ' +
          goog.getCssName(cssClass, 'caption'),
      content);
***REMOVED***


***REMOVED***
***REMOVED*** Returns an appropriately-styled DIV containing a dropdown arrow element.
***REMOVED*** Creates the following DOM structure:
***REMOVED***    <div class="goog-inline-block goog-menu-button-dropdown">
***REMOVED***      &nbsp;
***REMOVED***    </div>
***REMOVED*** @param {goog.dom.DomHelper} dom DOM helper, used for document interaction.
***REMOVED*** @return {Element} Dropdown element.
***REMOVED***
goog.ui.MenuButtonRenderer.prototype.createDropdown = function(dom) {
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
goog.ui.MenuButtonRenderer.prototype.getCssClass = function() {
  return goog.ui.MenuButtonRenderer.CSS_CLASS;
***REMOVED***
