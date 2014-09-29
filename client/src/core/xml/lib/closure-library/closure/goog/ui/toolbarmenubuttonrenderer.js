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
***REMOVED*** @fileoverview A toolbar menu button renderer.
***REMOVED***
***REMOVED*** @author attila@google.com (Attila Bodis)
***REMOVED***

goog.provide('goog.ui.ToolbarMenuButtonRenderer');

goog.require('goog.ui.MenuButtonRenderer');



***REMOVED***
***REMOVED*** Toolbar-specific renderer for {@link goog.ui.MenuButton}s, based on {@link
***REMOVED*** goog.ui.MenuButtonRenderer}.
***REMOVED***
***REMOVED*** @extends {goog.ui.MenuButtonRenderer}
***REMOVED***
goog.ui.ToolbarMenuButtonRenderer = function() {
  goog.ui.MenuButtonRenderer.call(this);
***REMOVED***
goog.inherits(goog.ui.ToolbarMenuButtonRenderer, goog.ui.MenuButtonRenderer);
goog.addSingletonGetter(goog.ui.ToolbarMenuButtonRenderer);


***REMOVED***
***REMOVED*** Default CSS class to be applied to the root element of menu buttons rendered
***REMOVED*** by this renderer.
***REMOVED*** @type {string}
***REMOVED***
goog.ui.ToolbarMenuButtonRenderer.CSS_CLASS =
    goog.getCssName('goog-toolbar-menu-button');


***REMOVED***
***REMOVED*** Returns the CSS class to be applied to the root element of menu buttons
***REMOVED*** rendered using this renderer.
***REMOVED*** @return {string} Renderer-specific CSS class.
***REMOVED*** @override
***REMOVED***
goog.ui.ToolbarMenuButtonRenderer.prototype.getCssClass = function() {
  return goog.ui.ToolbarMenuButtonRenderer.CSS_CLASS;
***REMOVED***
