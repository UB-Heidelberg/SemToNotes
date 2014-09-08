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
***REMOVED*** @fileoverview Default renderer for {@link goog.ui.TabBar}s.  Based on the
***REMOVED*** original {@code TabPane} code.
***REMOVED***
***REMOVED*** @author attila@google.com (Attila Bodis)
***REMOVED*** @author eae@google.com (Emil A. Eklund)
***REMOVED***

goog.provide('goog.ui.TabBarRenderer');

goog.require('goog.a11y.aria.Role');
goog.require('goog.object');
goog.require('goog.ui.ContainerRenderer');



***REMOVED***
***REMOVED*** Default renderer for {@link goog.ui.TabBar}s, based on the {@code TabPane}
***REMOVED*** code.  The tab bar's DOM structure is determined by its orientation and
***REMOVED*** location relative to tab contents.  For example, a horizontal tab bar
***REMOVED*** located above tab contents looks like this:
***REMOVED*** <pre>
***REMOVED***   <div class="goog-tab-bar goog-tab-bar-horizontal goog-tab-bar-top">
***REMOVED***     ...(tabs here)...
***REMOVED***   </div>
***REMOVED*** </pre>
***REMOVED***
***REMOVED*** @extends {goog.ui.ContainerRenderer}
***REMOVED***
goog.ui.TabBarRenderer = function() {
  goog.ui.ContainerRenderer.call(this, goog.a11y.aria.Role.TAB_LIST);
***REMOVED***
goog.inherits(goog.ui.TabBarRenderer, goog.ui.ContainerRenderer);
goog.addSingletonGetter(goog.ui.TabBarRenderer);


***REMOVED***
***REMOVED*** Default CSS class to be applied to the root element of components rendered
***REMOVED*** by this renderer.
***REMOVED*** @type {string}
***REMOVED***
goog.ui.TabBarRenderer.CSS_CLASS = goog.getCssName('goog-tab-bar');


***REMOVED***
***REMOVED*** Returns the CSS class name to be applied to the root element of all tab bars
***REMOVED*** rendered or decorated using this renderer.
***REMOVED*** @return {string} Renderer-specific CSS class name.
***REMOVED*** @override
***REMOVED***
goog.ui.TabBarRenderer.prototype.getCssClass = function() {
  return goog.ui.TabBarRenderer.CSS_CLASS;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the tab bar's state based on the given CSS class name, encountered
***REMOVED*** during decoration.  Overrides the superclass implementation by recognizing
***REMOVED*** class names representing tab bar orientation and location.
***REMOVED*** @param {goog.ui.Container} tabBar Tab bar to configure.
***REMOVED*** @param {string} className CSS class name.
***REMOVED*** @param {string} baseClass Base class name used as the root of state-specific
***REMOVED***     class names (typically the renderer's own class name).
***REMOVED*** @protected
***REMOVED*** @override
***REMOVED***
goog.ui.TabBarRenderer.prototype.setStateFromClassName = function(tabBar,
    className, baseClass) {
  // Create the class-to-location lookup table on first access.
  if (!this.locationByClass_) {
    this.createLocationByClassMap_();
  }

  // If the class name corresponds to a location, update the tab bar's location;
  // otherwise let the superclass handle it.
  var location = this.locationByClass_[className];
  if (location) {
    tabBar.setLocation(location);
  } else {
    goog.ui.TabBarRenderer.superClass_.setStateFromClassName.call(this, tabBar,
        className, baseClass);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Returns all CSS class names applicable to the tab bar, based on its state.
***REMOVED*** Overrides the superclass implementation by appending the location-specific
***REMOVED*** class name to the list.
***REMOVED*** @param {goog.ui.Container} tabBar Tab bar whose CSS classes are to be
***REMOVED***     returned.
***REMOVED*** @return {!Array.<string>} Array of CSS class names applicable to the tab bar.
***REMOVED*** @override
***REMOVED***
goog.ui.TabBarRenderer.prototype.getClassNames = function(tabBar) {
  var classNames = goog.ui.TabBarRenderer.superClass_.getClassNames.call(this,
      tabBar);

  // Create the location-to-class lookup table on first access.
  if (!this.classByLocation_) {
    this.createClassByLocationMap_();
  }

  // Apped the class name corresponding to the tab bar's location to the list.
  classNames.push(this.classByLocation_[tabBar.getLocation()]);
  return classNames;
***REMOVED***


***REMOVED***
***REMOVED*** Creates the location-to-class lookup table.
***REMOVED*** @private
***REMOVED***
goog.ui.TabBarRenderer.prototype.createClassByLocationMap_ = function() {
  var baseClass = this.getCssClass();

 ***REMOVED*****REMOVED***
  ***REMOVED*** Map of locations to location-specific structural class names,
  ***REMOVED*** precomputed and cached on first use to minimize object allocations
  ***REMOVED*** and string concatenation.
  ***REMOVED*** @type {Object}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.classByLocation_ = goog.object.create(
      goog.ui.TabBar.Location.TOP, goog.getCssName(baseClass, 'top'),
      goog.ui.TabBar.Location.BOTTOM, goog.getCssName(baseClass, 'bottom'),
      goog.ui.TabBar.Location.START, goog.getCssName(baseClass, 'start'),
      goog.ui.TabBar.Location.END, goog.getCssName(baseClass, 'end'));
***REMOVED***


***REMOVED***
***REMOVED*** Creates the class-to-location lookup table, used during decoration.
***REMOVED*** @private
***REMOVED***
goog.ui.TabBarRenderer.prototype.createLocationByClassMap_ = function() {
  // We need the classByLocation_ map so we can transpose it.
  if (!this.classByLocation_) {
    this.createClassByLocationMap_();
  }

 ***REMOVED*****REMOVED***
  ***REMOVED*** Map of location-specific structural class names to locations, used during
  ***REMOVED*** element decoration.  Precomputed and cached on first use to minimize object
  ***REMOVED*** allocations and string concatenation.
  ***REMOVED*** @type {Object}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.locationByClass_ = goog.object.transpose(this.classByLocation_);
***REMOVED***
