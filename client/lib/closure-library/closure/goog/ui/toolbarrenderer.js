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
***REMOVED*** @fileoverview Renderer for {@link goog.ui.Toolbar}s.
***REMOVED***
***REMOVED*** @author attila@google.com (Attila Bodis)
***REMOVED***

goog.provide('goog.ui.ToolbarRenderer');

goog.require('goog.a11y.aria.Role');
goog.require('goog.ui.Container');
goog.require('goog.ui.ContainerRenderer');
goog.require('goog.ui.Separator');
goog.require('goog.ui.ToolbarSeparatorRenderer');



***REMOVED***
***REMOVED*** Default renderer for {@link goog.ui.Toolbar}s, based on {@link
***REMOVED*** goog.ui.ContainerRenderer}.
***REMOVED***
***REMOVED*** @extends {goog.ui.ContainerRenderer}
***REMOVED***
goog.ui.ToolbarRenderer = function() {
  goog.ui.ContainerRenderer.call(this, goog.a11y.aria.Role.TOOLBAR);
***REMOVED***
goog.inherits(goog.ui.ToolbarRenderer, goog.ui.ContainerRenderer);
goog.addSingletonGetter(goog.ui.ToolbarRenderer);


***REMOVED***
***REMOVED*** Default CSS class to be applied to the root element of toolbars rendered
***REMOVED*** by this renderer.
***REMOVED*** @type {string}
***REMOVED***
goog.ui.ToolbarRenderer.CSS_CLASS = goog.getCssName('goog-toolbar');


***REMOVED***
***REMOVED*** Inspects the element, and creates an instance of {@link goog.ui.Control} or
***REMOVED*** an appropriate subclass best suited to decorate it.  Overrides the superclass
***REMOVED*** implementation by recognizing HR elements as separators.
***REMOVED*** @param {Element} element Element to decorate.
***REMOVED*** @return {goog.ui.Control?} A new control suitable to decorate the element
***REMOVED***     (null if none).
***REMOVED*** @override
***REMOVED***
goog.ui.ToolbarRenderer.prototype.getDecoratorForChild = function(element) {
  return element.tagName == 'HR' ?
      new goog.ui.Separator(goog.ui.ToolbarSeparatorRenderer.getInstance()) :
      goog.ui.ToolbarRenderer.superClass_.getDecoratorForChild.call(this,
          element);
***REMOVED***


***REMOVED***
***REMOVED*** Returns the CSS class to be applied to the root element of containers
***REMOVED*** rendered using this renderer.
***REMOVED*** @return {string} Renderer-specific CSS class.
***REMOVED*** @override
***REMOVED***
goog.ui.ToolbarRenderer.prototype.getCssClass = function() {
  return goog.ui.ToolbarRenderer.CSS_CLASS;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the default orientation of containers rendered or decorated by this
***REMOVED*** renderer.  This implementation returns {@code HORIZONTAL}.
***REMOVED*** @return {goog.ui.Container.Orientation} Default orientation for containers
***REMOVED***     created or decorated by this renderer.
***REMOVED*** @override
***REMOVED***
goog.ui.ToolbarRenderer.prototype.getDefaultOrientation = function() {
  return goog.ui.Container.Orientation.HORIZONTAL;
***REMOVED***
