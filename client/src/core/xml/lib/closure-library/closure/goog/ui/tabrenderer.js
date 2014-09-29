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
***REMOVED*** @fileoverview Default renderer for {@link goog.ui.Tab}s.  Based on the
***REMOVED*** original {@code TabPane} code.
***REMOVED***
***REMOVED*** @author attila@google.com (Attila Bodis)
***REMOVED***

goog.provide('goog.ui.TabRenderer');

goog.require('goog.a11y.aria.Role');
goog.require('goog.ui.Component.State');
goog.require('goog.ui.ControlRenderer');



***REMOVED***
***REMOVED*** Default renderer for {@link goog.ui.Tab}s, based on the {@code TabPane} code.
***REMOVED***
***REMOVED*** @extends {goog.ui.ControlRenderer}
***REMOVED***
goog.ui.TabRenderer = function() {
  goog.ui.ControlRenderer.call(this);
***REMOVED***
goog.inherits(goog.ui.TabRenderer, goog.ui.ControlRenderer);
goog.addSingletonGetter(goog.ui.TabRenderer);


***REMOVED***
***REMOVED*** Default CSS class to be applied to the root element of components rendered
***REMOVED*** by this renderer.
***REMOVED*** @type {string}
***REMOVED***
goog.ui.TabRenderer.CSS_CLASS = goog.getCssName('goog-tab');


***REMOVED***
***REMOVED*** Returns the CSS class name to be applied to the root element of all tabs
***REMOVED*** rendered or decorated using this renderer.
***REMOVED*** @return {string} Renderer-specific CSS class name.
***REMOVED*** @override
***REMOVED***
goog.ui.TabRenderer.prototype.getCssClass = function() {
  return goog.ui.TabRenderer.CSS_CLASS;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the ARIA role to be applied to the tab element.
***REMOVED*** See http://wiki/Main/ARIA for more info.
***REMOVED*** @return {goog.a11y.aria.Role} ARIA role.
***REMOVED*** @override
***REMOVED***
goog.ui.TabRenderer.prototype.getAriaRole = function() {
  return goog.a11y.aria.Role.TAB;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the tab's contents wrapped in a DIV, with the renderer's own CSS
***REMOVED*** class and additional state-specific classes applied to it.  Creates the
***REMOVED*** following DOM structure:
***REMOVED*** <pre>
***REMOVED***   <div class="goog-tab" title="Title">Content</div>
***REMOVED*** </pre>
***REMOVED*** @param {goog.ui.Control} tab Tab to render.
***REMOVED*** @return {Element} Root element for the tab.
***REMOVED*** @override
***REMOVED***
goog.ui.TabRenderer.prototype.createDom = function(tab) {
  var element = goog.ui.TabRenderer.superClass_.createDom.call(this, tab);

  var tooltip = tab.getTooltip();
  if (tooltip) {
    // Only update the element if the tab has a tooltip.
    this.setTooltip(element, tooltip);
  }

  return element;
***REMOVED***


***REMOVED***
***REMOVED*** Decorates the element with the tab.  Initializes the tab's ID, content,
***REMOVED*** tooltip, and state based on the ID of the element, its title, child nodes,
***REMOVED*** and CSS classes, respectively.  Returns the element.
***REMOVED*** @param {goog.ui.Control} tab Tab to decorate the element.
***REMOVED*** @param {Element} element Element to decorate.
***REMOVED*** @return {Element} Decorated element.
***REMOVED*** @override
***REMOVED***
goog.ui.TabRenderer.prototype.decorate = function(tab, element) {
  element = goog.ui.TabRenderer.superClass_.decorate.call(this, tab, element);

  var tooltip = this.getTooltip(element);
  if (tooltip) {
    // Only update the tab if the element has a tooltip.
    tab.setTooltipInternal(tooltip);
  }

  // If the tab is selected and hosted in a tab bar, update the tab bar's
  // selection model.
  if (tab.isSelected()) {
    var tabBar = tab.getParent();
    if (tabBar && goog.isFunction(tabBar.setSelectedTab)) {
      // We need to temporarily deselect the tab, so the tab bar can re-select
      // it and thereby correctly initialize its state.  We use the protected
      // setState() method to avoid dispatching useless events.
      tab.setState(goog.ui.Component.State.SELECTED, false);
      tabBar.setSelectedTab(tab);
    }
  }

  return element;
***REMOVED***


***REMOVED***
***REMOVED*** Takes a tab's root element, and returns its tooltip text, or the empty
***REMOVED*** string if the element has no tooltip.
***REMOVED*** @param {Element} element The tab's root element.
***REMOVED*** @return {string} The tooltip text (empty string if none).
***REMOVED***
goog.ui.TabRenderer.prototype.getTooltip = function(element) {
  return element.title || '';
***REMOVED***


***REMOVED***
***REMOVED*** Takes a tab's root element and a tooltip string, and updates the element
***REMOVED*** with the new tooltip.  If the new tooltip is null or undefined, sets the
***REMOVED*** element's title to the empty string.
***REMOVED*** @param {Element} element The tab's root element.
***REMOVED*** @param {string|null|undefined} tooltip New tooltip text (if any).
***REMOVED***
goog.ui.TabRenderer.prototype.setTooltip = function(element, tooltip) {
  if (element) {
    element.title = tooltip || '';
  }
***REMOVED***
