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
***REMOVED*** @fileoverview Menu item observing the filter text in a
***REMOVED*** {@link goog.ui.FilteredMenu}. The observer method is called when the filter
***REMOVED*** text changes and allows the menu item to update its content and state based
***REMOVED*** on the filter.
***REMOVED***
***REMOVED*** @author eae@google.com (Emil A Eklund)
***REMOVED***

goog.provide('goog.ui.FilterObservingMenuItemRenderer');

goog.require('goog.ui.MenuItemRenderer');



***REMOVED***
***REMOVED*** Default renderer for {@link goog.ui.FilterObservingMenuItem}s. Each item has
***REMOVED*** the following structure:
***REMOVED***    <div class="goog-filterobsmenuitem"><div>...(content)...</div></div>
***REMOVED***
***REMOVED***
***REMOVED*** @extends {goog.ui.MenuItemRenderer}
***REMOVED*** @final
***REMOVED***
goog.ui.FilterObservingMenuItemRenderer = function() {
  goog.ui.MenuItemRenderer.call(this);
***REMOVED***
goog.inherits(goog.ui.FilterObservingMenuItemRenderer,
              goog.ui.MenuItemRenderer);
goog.addSingletonGetter(goog.ui.FilterObservingMenuItemRenderer);


***REMOVED***
***REMOVED*** CSS class name the renderer applies to menu item elements.
***REMOVED*** @type {string}
***REMOVED***
goog.ui.FilterObservingMenuItemRenderer.CSS_CLASS =
    goog.getCssName('goog-filterobsmenuitem');


***REMOVED***
***REMOVED*** Returns the CSS class to be applied to menu items rendered using this
***REMOVED*** renderer.
***REMOVED*** @return {string} Renderer-specific CSS class.
***REMOVED*** @override
***REMOVED***
goog.ui.FilterObservingMenuItemRenderer.prototype.getCssClass = function() {
  return goog.ui.FilterObservingMenuItemRenderer.CSS_CLASS;
***REMOVED***
