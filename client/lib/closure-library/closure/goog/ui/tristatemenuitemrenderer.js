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
***REMOVED*** @fileoverview Renderer for {@link goog.ui.TriStateMenuItem}s.
***REMOVED***
***REMOVED*** @author eae@google.com (Emil A Eklund)
***REMOVED***

goog.provide('goog.ui.TriStateMenuItemRenderer');

goog.require('goog.asserts');
goog.require('goog.dom.classlist');
goog.require('goog.ui.MenuItemRenderer');



***REMOVED***
***REMOVED*** Default renderer for {@link goog.ui.TriStateMenuItemRenderer}s. Each item has
***REMOVED*** the following structure:
***REMOVED***    <div class="goog-tristatemenuitem">
***REMOVED***        <div class="goog-tristatemenuitem-checkbox"></div>
***REMOVED***        <div>...(content)...</div>
***REMOVED***    </div>
***REMOVED***
***REMOVED*** @extends {goog.ui.MenuItemRenderer}
***REMOVED*** @final
***REMOVED***
goog.ui.TriStateMenuItemRenderer = function() {
  goog.ui.MenuItemRenderer.call(this);
***REMOVED***
goog.inherits(goog.ui.TriStateMenuItemRenderer, goog.ui.MenuItemRenderer);
goog.addSingletonGetter(goog.ui.TriStateMenuItemRenderer);


***REMOVED***
***REMOVED*** CSS class name the renderer applies to menu item elements.
***REMOVED*** @type {string}
***REMOVED***
goog.ui.TriStateMenuItemRenderer.CSS_CLASS =
    goog.getCssName('goog-tristatemenuitem');


***REMOVED***
***REMOVED*** Overrides {@link goog.ui.ControlRenderer#decorate} by initializing the
***REMOVED*** menu item to checkable based on whether the element to be decorated has
***REMOVED*** extra styling indicating that it should be.
***REMOVED*** @param {goog.ui.Control} item goog.ui.MenuItem to decorate the element.
***REMOVED*** @param {Element} element Element to decorate.
***REMOVED*** @return {!Element} Decorated element.
***REMOVED*** @override
***REMOVED***
goog.ui.TriStateMenuItemRenderer.prototype.decorate = function(item, element) {
  element = goog.ui.TriStateMenuItemRenderer.superClass_.decorate.call(this,
      item, element);
  this.setCheckable(item, element, true);

  goog.asserts.assert(element);

  if (goog.dom.classlist.contains(element,
      goog.getCssName(this.getCssClass(), 'fully-checked'))) {
    item.setCheckedState(***REMOVED*** @suppress {missingRequire}***REMOVED***
        goog.ui.TriStateMenuItem.State.FULLY_CHECKED);
  } else if (goog.dom.classlist.contains(element,
      goog.getCssName(this.getCssClass(), 'partially-checked'))) {
    item.setCheckedState(***REMOVED*** @suppress {missingRequire}***REMOVED***
        goog.ui.TriStateMenuItem.State.PARTIALLY_CHECKED);
  } else {
    item.setCheckedState(***REMOVED*** @suppress {missingRequire}***REMOVED***
        goog.ui.TriStateMenuItem.State.NOT_CHECKED);
  }

  return element;
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.ui.TriStateMenuItemRenderer.prototype.getCssClass = function() {
  return goog.ui.TriStateMenuItemRenderer.CSS_CLASS;
***REMOVED***
