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
***REMOVED*** @fileoverview Renderer for {@link goog.ui.Menu}s.
***REMOVED***
***REMOVED*** @author robbyw@google.com (Robby Walker)
***REMOVED*** @author pupius@google.com (Daniel Pupius)
***REMOVED***

goog.provide('goog.ui.MenuRenderer');

goog.require('goog.a11y.aria');
goog.require('goog.a11y.aria.Role');
goog.require('goog.a11y.aria.State');
goog.require('goog.asserts');
goog.require('goog.dom');
goog.require('goog.ui.ContainerRenderer');
goog.require('goog.ui.Separator');



***REMOVED***
***REMOVED*** Default renderer for {@link goog.ui.Menu}s, based on {@link
***REMOVED*** goog.ui.ContainerRenderer}.
***REMOVED***
***REMOVED*** @extends {goog.ui.ContainerRenderer}
***REMOVED***
goog.ui.MenuRenderer = function() {
  goog.ui.ContainerRenderer.call(this);
***REMOVED***
goog.inherits(goog.ui.MenuRenderer, goog.ui.ContainerRenderer);
goog.addSingletonGetter(goog.ui.MenuRenderer);


***REMOVED***
***REMOVED*** Default CSS class to be applied to the root element of toolbars rendered
***REMOVED*** by this renderer.
***REMOVED*** @type {string}
***REMOVED***
goog.ui.MenuRenderer.CSS_CLASS = goog.getCssName('goog-menu');


***REMOVED***
***REMOVED*** Returns the ARIA role to be applied to menus.
***REMOVED*** @return {string} ARIA role.
***REMOVED*** @override
***REMOVED***
goog.ui.MenuRenderer.prototype.getAriaRole = function() {
  return goog.a11y.aria.Role.MENU;
***REMOVED***


***REMOVED***
***REMOVED*** Returns whether the element is a UL or acceptable to our superclass.
***REMOVED*** @param {Element} element Element to decorate.
***REMOVED*** @return {boolean} Whether the renderer can decorate the element.
***REMOVED*** @override
***REMOVED***
goog.ui.MenuRenderer.prototype.canDecorate = function(element) {
  return element.tagName == 'UL' ||
      goog.ui.MenuRenderer.superClass_.canDecorate.call(this, element);
***REMOVED***


***REMOVED***
***REMOVED*** Inspects the element, and creates an instance of {@link goog.ui.Control} or
***REMOVED*** an appropriate subclass best suited to decorate it.  Overrides the superclass
***REMOVED*** implementation by recognizing HR elements as separators.
***REMOVED*** @param {Element} element Element to decorate.
***REMOVED*** @return {goog.ui.Control?} A new control suitable to decorate the element
***REMOVED***     (null if none).
***REMOVED*** @override
***REMOVED***
goog.ui.MenuRenderer.prototype.getDecoratorForChild = function(element) {
  return element.tagName == 'HR' ?
      new goog.ui.Separator() :
      goog.ui.MenuRenderer.superClass_.getDecoratorForChild.call(this,
          element);
***REMOVED***


***REMOVED***
***REMOVED*** Returns whether the given element is contained in the menu's DOM.
***REMOVED*** @param {goog.ui.Menu} menu The menu to test.
***REMOVED*** @param {Element} element The element to test.
***REMOVED*** @return {boolean} Whether the given element is contained in the menu.
***REMOVED***
goog.ui.MenuRenderer.prototype.containsElement = function(menu, element) {
  return goog.dom.contains(menu.getElement(), element);
***REMOVED***


***REMOVED***
***REMOVED*** Returns the CSS class to be applied to the root element of containers
***REMOVED*** rendered using this renderer.
***REMOVED*** @return {string} Renderer-specific CSS class.
***REMOVED*** @override
***REMOVED***
goog.ui.MenuRenderer.prototype.getCssClass = function() {
  return goog.ui.MenuRenderer.CSS_CLASS;
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.ui.MenuRenderer.prototype.initializeDom = function(container) {
  goog.ui.MenuRenderer.superClass_.initializeDom.call(this, container);

  var element = container.getElement();
  goog.asserts.assert(element, 'The menu DOM element cannot be null.');
  goog.a11y.aria.setState(element, goog.a11y.aria.State.HASPOPUP, 'true');
***REMOVED***
