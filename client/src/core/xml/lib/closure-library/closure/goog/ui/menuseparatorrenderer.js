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
***REMOVED*** @fileoverview Renderer for {@link goog.ui.MenuSeparator}s.
***REMOVED***
***REMOVED*** @author attila@google.com (Attila Bodis)
***REMOVED***

goog.provide('goog.ui.MenuSeparatorRenderer');

goog.require('goog.dom');
goog.require('goog.dom.classes');
goog.require('goog.ui.ControlContent');
goog.require('goog.ui.ControlRenderer');



***REMOVED***
***REMOVED*** Renderer for menu separators.
***REMOVED***
***REMOVED*** @extends {goog.ui.ControlRenderer}
***REMOVED***
goog.ui.MenuSeparatorRenderer = function() {
  goog.ui.ControlRenderer.call(this);
***REMOVED***
goog.inherits(goog.ui.MenuSeparatorRenderer, goog.ui.ControlRenderer);
goog.addSingletonGetter(goog.ui.MenuSeparatorRenderer);


***REMOVED***
***REMOVED*** Default CSS class to be applied to the root element of components rendered
***REMOVED*** by this renderer.
***REMOVED*** @type {string}
***REMOVED***
goog.ui.MenuSeparatorRenderer.CSS_CLASS = goog.getCssName('goog-menuseparator');


***REMOVED***
***REMOVED*** Returns an empty, styled menu separator DIV.  Overrides {@link
***REMOVED*** goog.ui.ControlRenderer#createDom}.
***REMOVED*** @param {goog.ui.Control} separator goog.ui.Separator to render.
***REMOVED*** @return {Element} Root element for the separator.
***REMOVED*** @override
***REMOVED***
goog.ui.MenuSeparatorRenderer.prototype.createDom = function(separator) {
  return separator.getDomHelper().createDom('div', this.getCssClass());
***REMOVED***


***REMOVED***
***REMOVED*** Takes an existing element, and decorates it with the separator.  Overrides
***REMOVED*** {@link goog.ui.ControlRenderer#decorate}.
***REMOVED*** @param {goog.ui.Control} separator goog.ui.MenuSeparator to decorate the
***REMOVED***     element.
***REMOVED*** @param {Element} element Element to decorate.
***REMOVED*** @return {Element} Decorated element.
***REMOVED*** @override
***REMOVED***
goog.ui.MenuSeparatorRenderer.prototype.decorate = function(separator,
                                                            element) {
  // Normally handled in the superclass. But we don't call the superclass.
  if (element.id) {
    separator.setId(element.id);
  }

  if (element.tagName == 'HR') {
    // Replace HR with separator.
    var hr = element;
    element = this.createDom(separator);
    goog.dom.insertSiblingBefore(element, hr);
    goog.dom.removeNode(hr);
  } else {
    goog.dom.classes.add(element, this.getCssClass());
  }
  return element;
***REMOVED***


***REMOVED***
***REMOVED*** Overrides {@link goog.ui.ControlRenderer#setContent} to do nothing, since
***REMOVED*** separators are empty.
***REMOVED*** @param {Element} separator The separator's root element.
***REMOVED*** @param {goog.ui.ControlContent} content Text caption or DOM structure to be
***REMOVED***    set as the separators's content (ignored).
***REMOVED*** @override
***REMOVED***
goog.ui.MenuSeparatorRenderer.prototype.setContent = function(separator,
                                                              content) {
  // Do nothing.  Separators are empty.
***REMOVED***


***REMOVED***
***REMOVED*** Returns the CSS class to be applied to the root element of components
***REMOVED*** rendered using this renderer.
***REMOVED*** @return {string} Renderer-specific CSS class.
***REMOVED*** @override
***REMOVED***
goog.ui.MenuSeparatorRenderer.prototype.getCssClass = function() {
  return goog.ui.MenuSeparatorRenderer.CSS_CLASS;
***REMOVED***
