// Copyright 2007 The Closure Library Authors. All Rights Reserved.
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
***REMOVED*** @fileoverview Renderer for toolbar separators.
***REMOVED***
***REMOVED*** @author attila@google.com (Attila Bodis)
***REMOVED***

goog.provide('goog.ui.ToolbarSeparatorRenderer');

goog.require('goog.asserts');
goog.require('goog.dom.classlist');
goog.require('goog.ui.INLINE_BLOCK_CLASSNAME');
goog.require('goog.ui.MenuSeparatorRenderer');



***REMOVED***
***REMOVED*** Renderer for toolbar separators.
***REMOVED***
***REMOVED*** @extends {goog.ui.MenuSeparatorRenderer}
***REMOVED***
goog.ui.ToolbarSeparatorRenderer = function() {
  goog.ui.MenuSeparatorRenderer.call(this);
***REMOVED***
goog.inherits(goog.ui.ToolbarSeparatorRenderer, goog.ui.MenuSeparatorRenderer);
goog.addSingletonGetter(goog.ui.ToolbarSeparatorRenderer);


***REMOVED***
***REMOVED*** Default CSS class to be applied to the root element of components rendered
***REMOVED*** by this renderer.
***REMOVED*** @type {string}
***REMOVED***
goog.ui.ToolbarSeparatorRenderer.CSS_CLASS =
    goog.getCssName('goog-toolbar-separator');


***REMOVED***
***REMOVED*** Returns a styled toolbar separator implemented by the following DOM:
***REMOVED*** <div class="goog-toolbar-separator goog-inline-block">&nbsp;</div>
***REMOVED*** Overrides {@link goog.ui.MenuSeparatorRenderer#createDom}.
***REMOVED*** @param {goog.ui.Control} separator goog.ui.Separator to render.
***REMOVED*** @return {!Element} Root element for the separator.
***REMOVED*** @override
***REMOVED***
goog.ui.ToolbarSeparatorRenderer.prototype.createDom = function(separator) {
  // 00A0 is &nbsp;
  return separator.getDomHelper().createDom('div',
      this.getCssClass() + ' ' + goog.ui.INLINE_BLOCK_CLASSNAME,
      '\u00A0');
***REMOVED***


***REMOVED***
***REMOVED*** Takes an existing element, and decorates it with the separator.  Overrides
***REMOVED*** {@link goog.ui.MenuSeparatorRenderer#decorate}.
***REMOVED*** @param {goog.ui.Control} separator goog.ui.Separator to decorate the element.
***REMOVED*** @param {Element} element Element to decorate.
***REMOVED*** @return {!Element} Decorated element.
***REMOVED*** @override
***REMOVED***
goog.ui.ToolbarSeparatorRenderer.prototype.decorate = function(separator,
                                                               element) {
  element = goog.ui.ToolbarSeparatorRenderer.superClass_.decorate.call(this,
      separator, element);
  goog.asserts.assert(element);
  goog.dom.classlist.add(element, goog.ui.INLINE_BLOCK_CLASSNAME);
  return element;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the CSS class to be applied to the root element of components
***REMOVED*** rendered using this renderer.
***REMOVED*** @return {string} Renderer-specific CSS class.
***REMOVED*** @override
***REMOVED***
goog.ui.ToolbarSeparatorRenderer.prototype.getCssClass = function() {
  return goog.ui.ToolbarSeparatorRenderer.CSS_CLASS;
***REMOVED***
