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
***REMOVED*** @fileoverview Renderer for toolbar buttons.
***REMOVED***
***REMOVED*** @author attila@google.com (Attila Bodis)
***REMOVED***

goog.provide('goog.ui.ToolbarButtonRenderer');

goog.require('goog.ui.CustomButtonRenderer');



***REMOVED***
***REMOVED*** Toolbar-specific renderer for {@link goog.ui.Button}s, based on {@link
***REMOVED*** goog.ui.CustomButtonRenderer}.
***REMOVED***
***REMOVED*** @extends {goog.ui.CustomButtonRenderer}
***REMOVED***
goog.ui.ToolbarButtonRenderer = function() {
  goog.ui.CustomButtonRenderer.call(this);
***REMOVED***
goog.inherits(goog.ui.ToolbarButtonRenderer, goog.ui.CustomButtonRenderer);
goog.addSingletonGetter(goog.ui.ToolbarButtonRenderer);


***REMOVED***
***REMOVED*** Default CSS class to be applied to the root element of buttons rendered
***REMOVED*** by this renderer.
***REMOVED*** @type {string}
***REMOVED***
goog.ui.ToolbarButtonRenderer.CSS_CLASS =
    goog.getCssName('goog-toolbar-button');


***REMOVED***
***REMOVED*** Returns the CSS class to be applied to the root element of buttons rendered
***REMOVED*** using this renderer.
***REMOVED*** @return {string} Renderer-specific CSS class.
***REMOVED*** @override
***REMOVED***
goog.ui.ToolbarButtonRenderer.prototype.getCssClass = function() {
  return goog.ui.ToolbarButtonRenderer.CSS_CLASS;
***REMOVED***
