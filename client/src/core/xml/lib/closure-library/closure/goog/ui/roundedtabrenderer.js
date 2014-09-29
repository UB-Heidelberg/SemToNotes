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
***REMOVED*** @fileoverview Rounded corner tab renderer for {@link goog.ui.Tab}s.
***REMOVED***
***REMOVED*** @author attila@google.com (Attila Bodis)
***REMOVED***

goog.provide('goog.ui.RoundedTabRenderer');

goog.require('goog.dom');
goog.require('goog.ui.Tab');
goog.require('goog.ui.TabBar.Location');
goog.require('goog.ui.TabRenderer');
goog.require('goog.ui.registry');



***REMOVED***
***REMOVED*** Rounded corner tab renderer for {@link goog.ui.Tab}s.
***REMOVED***
***REMOVED*** @extends {goog.ui.TabRenderer}
***REMOVED***
goog.ui.RoundedTabRenderer = function() {
  goog.ui.TabRenderer.call(this);
***REMOVED***
goog.inherits(goog.ui.RoundedTabRenderer, goog.ui.TabRenderer);
goog.addSingletonGetter(goog.ui.RoundedTabRenderer);


***REMOVED***
***REMOVED*** Default CSS class to be applied to the root element of components rendered
***REMOVED*** by this renderer.
***REMOVED*** @type {string}
***REMOVED***
goog.ui.RoundedTabRenderer.CSS_CLASS = goog.getCssName('goog-rounded-tab');


***REMOVED***
***REMOVED*** Returns the CSS class name to be applied to the root element of all tabs
***REMOVED*** rendered or decorated using this renderer.
***REMOVED*** @return {string} Renderer-specific CSS class name.
***REMOVED*** @override
***REMOVED***
goog.ui.RoundedTabRenderer.prototype.getCssClass = function() {
  return goog.ui.RoundedTabRenderer.CSS_CLASS;
***REMOVED***


***REMOVED***
***REMOVED*** Creates the tab's DOM structure, based on the containing tab bar's location
***REMOVED*** relative to tab contents.  For example, the DOM for a tab in a tab bar
***REMOVED*** located above tab contents would look like this:
***REMOVED*** <pre>
***REMOVED***   <div class="goog-rounded-tab" title="...">
***REMOVED***     <table class="goog-rounded-tab-table">
***REMOVED***       <tbody>
***REMOVED***         <tr>
***REMOVED***           <td nowrap>
***REMOVED***             <div class="goog-rounded-tab-outer-edge"></div>
***REMOVED***             <div class="goog-rounded-tab-inner-edge"></div>
***REMOVED***           </td>
***REMOVED***         </tr>
***REMOVED***         <tr>
***REMOVED***           <td nowrap>
***REMOVED***             <div class="goog-rounded-tab-caption">Hello, world</div>
***REMOVED***           </td>
***REMOVED***         </tr>
***REMOVED***       </tbody>
***REMOVED***     </table>
***REMOVED***   </div>
***REMOVED*** </pre>
***REMOVED*** @param {goog.ui.Control} tab Tab to render.
***REMOVED*** @return {Element} Root element for the tab.
***REMOVED*** @override
***REMOVED***
goog.ui.RoundedTabRenderer.prototype.createDom = function(tab) {
  return this.decorate(tab,
      goog.ui.RoundedTabRenderer.superClass_.createDom.call(this, tab));
***REMOVED***


***REMOVED***
***REMOVED*** Decorates the element with the tab.  Overrides the superclass implementation
***REMOVED*** by wrapping the tab's content in a table that implements rounded corners.
***REMOVED*** @param {goog.ui.Control} tab Tab to decorate the element.
***REMOVED*** @param {Element} element Element to decorate.
***REMOVED*** @return {Element} Decorated element.
***REMOVED*** @override
***REMOVED***
goog.ui.RoundedTabRenderer.prototype.decorate = function(tab, element) {
  var tabBar = tab.getParent();

  if (!this.getContentElement(element)) {
    // The element to be decorated doesn't appear to have the full tab DOM,
    // so we have to create it.
    element.appendChild(this.createTab(tab.getDomHelper(), element.childNodes,
        tabBar.getLocation()));
  }

  return goog.ui.RoundedTabRenderer.superClass_.decorate.call(this, tab,
      element);
***REMOVED***


***REMOVED***
***REMOVED*** Creates a table implementing a rounded corner tab.
***REMOVED*** @param {goog.dom.DomHelper} dom DOM helper to use for element construction.
***REMOVED*** @param {goog.ui.ControlContent} caption Text caption or DOM structure
***REMOVED***     to display as the tab's caption.
***REMOVED*** @param {goog.ui.TabBar.Location} location Tab bar location relative to the
***REMOVED***     tab contents.
***REMOVED*** @return {Element} Table implementing a rounded corner tab.
***REMOVED*** @protected
***REMOVED***
goog.ui.RoundedTabRenderer.prototype.createTab = function(dom, caption,
    location) {
  var rows = [];

  if (location != goog.ui.TabBar.Location.BOTTOM) {
    // This is a left, right, or top tab, so it needs a rounded top edge.
    rows.push(this.createEdge(dom, /* isTopEdge***REMOVED*** true));
  }
  rows.push(this.createCaption(dom, caption));
  if (location != goog.ui.TabBar.Location.TOP) {
    // This is a left, right, or bottom tab, so it needs a rounded bottom edge.
    rows.push(this.createEdge(dom, /* isTopEdge***REMOVED*** false));
  }

  return dom.createDom('table', {
    'cellPadding': 0,
    'cellSpacing': 0,
    'className': goog.getCssName(this.getStructuralCssClass(), 'table')
  }, dom.createDom('tbody', null, rows));
***REMOVED***


***REMOVED***
***REMOVED*** Creates a table row implementing the tab caption.
***REMOVED*** @param {goog.dom.DomHelper} dom DOM helper to use for element construction.
***REMOVED*** @param {goog.ui.ControlContent} caption Text caption or DOM structure
***REMOVED***     to display as the tab's caption.
***REMOVED*** @return {Element} Tab caption table row.
***REMOVED*** @protected
***REMOVED***
goog.ui.RoundedTabRenderer.prototype.createCaption = function(dom, caption) {
  var baseClass = this.getStructuralCssClass();
  return dom.createDom('tr', null,
      dom.createDom('td', {'noWrap': true},
          dom.createDom('div', goog.getCssName(baseClass, 'caption'),
              caption)));
***REMOVED***


***REMOVED***
***REMOVED*** Creates a table row implementing a rounded tab edge.
***REMOVED*** @param {goog.dom.DomHelper} dom DOM helper to use for element construction.
***REMOVED*** @param {boolean} isTopEdge Whether to create a top or bottom edge.
***REMOVED*** @return {Element} Rounded tab edge table row.
***REMOVED*** @protected
***REMOVED***
goog.ui.RoundedTabRenderer.prototype.createEdge = function(dom, isTopEdge) {
  var baseClass = this.getStructuralCssClass();
  var inner = dom.createDom('div', goog.getCssName(baseClass, 'inner-edge'));
  var outer = dom.createDom('div', goog.getCssName(baseClass, 'outer-edge'));
  return dom.createDom('tr', null,
      dom.createDom('td', {'noWrap': true},
          isTopEdge ? [outer, inner] : [inner, outer]));
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.ui.RoundedTabRenderer.prototype.getContentElement = function(element) {
  var baseClass = this.getStructuralCssClass();
  return element && goog.dom.getElementsByTagNameAndClass(
      'div', goog.getCssName(baseClass, 'caption'), element)[0];
***REMOVED***


// Register a decorator factory function for goog.ui.Tabs using the rounded
// tab renderer.
goog.ui.registry.setDecoratorByClassName(goog.ui.RoundedTabRenderer.CSS_CLASS,
    function() {
      return new goog.ui.Tab(null, goog.ui.RoundedTabRenderer.getInstance());
    });
