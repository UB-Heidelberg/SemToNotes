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
***REMOVED*** @fileoverview Similiar functionality of {@link goog.ui.ButtonRenderer},
***REMOVED*** but uses a <div> element instead of a <button> or <input> element.
***REMOVED***
***REMOVED***

goog.provide('goog.ui.FlatButtonRenderer');

goog.require('goog.a11y.aria');
goog.require('goog.a11y.aria.Role');
goog.require('goog.dom.classes');
goog.require('goog.ui.Button');
goog.require('goog.ui.ButtonRenderer');
goog.require('goog.ui.INLINE_BLOCK_CLASSNAME');
goog.require('goog.ui.registry');



***REMOVED***
***REMOVED*** Flat renderer for {@link goog.ui.Button}s.  Flat buttons can contain
***REMOVED*** almost arbitrary HTML content, will flow like inline elements, but can be
***REMOVED*** styled like block-level elements.
***REMOVED***
***REMOVED*** @extends {goog.ui.ButtonRenderer}
***REMOVED***
goog.ui.FlatButtonRenderer = function() {
  goog.ui.ButtonRenderer.call(this);
***REMOVED***
goog.inherits(goog.ui.FlatButtonRenderer, goog.ui.ButtonRenderer);
goog.addSingletonGetter(goog.ui.FlatButtonRenderer);


***REMOVED***
***REMOVED*** Default CSS class to be applied to the root element of components rendered
***REMOVED*** by this renderer.
***REMOVED*** @type {string}
***REMOVED***
goog.ui.FlatButtonRenderer.CSS_CLASS = goog.getCssName('goog-flat-button');


***REMOVED***
***REMOVED*** Returns the control's contents wrapped in a div element, with
***REMOVED*** the renderer's own CSS class and additional state-specific classes applied
***REMOVED*** to it, and the button's disabled attribute set or cleared as needed.
***REMOVED*** Overrides {@link goog.ui.ButtonRenderer#createDom}.
***REMOVED*** @param {goog.ui.Control} button Button to render.
***REMOVED*** @return {Element} Root element for the button.
***REMOVED*** @override
***REMOVED***
goog.ui.FlatButtonRenderer.prototype.createDom = function(button) {
  var classNames = this.getClassNames(button);
  var attributes = {
    'class': goog.ui.INLINE_BLOCK_CLASSNAME + ' ' + classNames.join(' '),
    'title': button.getTooltip() || ''
 ***REMOVED*****REMOVED***
  return button.getDomHelper().createDom(
      'div', attributes, button.getContent());
***REMOVED***


***REMOVED***
***REMOVED*** Returns the ARIA role to be applied to flat buttons.
***REMOVED*** @return {goog.a11y.aria.Role|undefined} ARIA role.
***REMOVED*** @override
***REMOVED***
goog.ui.FlatButtonRenderer.prototype.getAriaRole = function() {
  return goog.a11y.aria.Role.BUTTON;
***REMOVED***


***REMOVED***
***REMOVED*** Returns true if this renderer can decorate the element.  Overrides
***REMOVED*** {@link goog.ui.ButtonRenderer#canDecorate} by returning true if the
***REMOVED*** element is a DIV, false otherwise.
***REMOVED*** @param {Element} element Element to decorate.
***REMOVED*** @return {boolean} Whether the renderer can decorate the element.
***REMOVED*** @override
***REMOVED***
goog.ui.FlatButtonRenderer.prototype.canDecorate = function(element) {
  return element.tagName == 'DIV';
***REMOVED***


***REMOVED***
***REMOVED*** Takes an existing element and decorates it with the flat button control.
***REMOVED*** Initializes the control's ID, content, tooltip, value, and state based
***REMOVED*** on the ID of the element, its child nodes, and its CSS classes, respectively.
***REMOVED*** Returns the element.  Overrides {@link goog.ui.ButtonRenderer#decorate}.
***REMOVED*** @param {goog.ui.Control} button Button instance to decorate the element.
***REMOVED*** @param {Element} element Element to decorate.
***REMOVED*** @return {Element} Decorated element.
***REMOVED*** @override
***REMOVED***
goog.ui.FlatButtonRenderer.prototype.decorate = function(button, element) {
  goog.dom.classes.add(element, goog.ui.INLINE_BLOCK_CLASSNAME);
  return goog.ui.FlatButtonRenderer.superClass_.decorate.call(this, button,
      element);
***REMOVED***


***REMOVED***
***REMOVED*** Flat buttons can't use the value attribute since they are div elements.
***REMOVED*** Overrides {@link goog.ui.ButtonRenderer#getValue} to prevent trying to
***REMOVED*** access the element's value.
***REMOVED*** @param {Element} element The button control's root element.
***REMOVED*** @return {string} Value not valid for flat buttons.
***REMOVED*** @override
***REMOVED***
goog.ui.FlatButtonRenderer.prototype.getValue = function(element) {
  // Flat buttons don't store their value in the DOM.
  return '';
***REMOVED***


***REMOVED***
***REMOVED*** Returns the CSS class to be applied to the root element of components
***REMOVED*** rendered using this renderer.
***REMOVED*** @return {string} Renderer-specific CSS class.
***REMOVED*** @override
***REMOVED***
goog.ui.FlatButtonRenderer.prototype.getCssClass = function() {
  return goog.ui.FlatButtonRenderer.CSS_CLASS;
***REMOVED***


// Register a decorator factory function for Flat Buttons.
goog.ui.registry.setDecoratorByClassName(goog.ui.FlatButtonRenderer.CSS_CLASS,
    function() {
      // Uses goog.ui.Button, but with FlatButtonRenderer.
      return new goog.ui.Button(null, goog.ui.FlatButtonRenderer.getInstance());
    });
