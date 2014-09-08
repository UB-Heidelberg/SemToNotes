// Copyright 2012 The Closure Library Authors. All Rights Reserved.
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
***REMOVED*** @fileoverview Renderer for {@link goog.ui.menuBar}.
***REMOVED***
***REMOVED***

goog.provide('goog.ui.MenuBarRenderer');

goog.require('goog.a11y.aria.Role');
goog.require('goog.ui.Container');
goog.require('goog.ui.ContainerRenderer');



***REMOVED***
***REMOVED*** Default renderer for {@link goog.ui.menuBar}s, based on {@link
***REMOVED*** goog.ui.ContainerRenderer}.
***REMOVED***
***REMOVED*** @extends {goog.ui.ContainerRenderer}
***REMOVED*** @final
***REMOVED***
goog.ui.MenuBarRenderer = function() {
  goog.ui.MenuBarRenderer.base(this, 'constructor',
      goog.a11y.aria.Role.MENUBAR);
***REMOVED***
goog.inherits(goog.ui.MenuBarRenderer, goog.ui.ContainerRenderer);
goog.addSingletonGetter(goog.ui.MenuBarRenderer);


***REMOVED***
***REMOVED*** Default CSS class to be applied to the root element of elements rendered
***REMOVED*** by this renderer.
***REMOVED*** @type {string}
***REMOVED***
goog.ui.MenuBarRenderer.CSS_CLASS = goog.getCssName('goog-menubar');


***REMOVED***
***REMOVED*** @override
***REMOVED***
goog.ui.MenuBarRenderer.prototype.getCssClass = function() {
  return goog.ui.MenuBarRenderer.CSS_CLASS;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the default orientation of containers rendered or decorated by this
***REMOVED*** renderer.  This implementation returns {@code HORIZONTAL}.
***REMOVED*** @return {goog.ui.Container.Orientation} Default orientation for containers
***REMOVED***     created or decorated by this renderer.
***REMOVED*** @override
***REMOVED***
goog.ui.MenuBarRenderer.prototype.getDefaultOrientation = function() {
  return goog.ui.Container.Orientation.HORIZONTAL;
***REMOVED***
