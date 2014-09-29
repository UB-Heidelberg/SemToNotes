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
***REMOVED*** @fileoverview A class for representing menu separators.
***REMOVED*** @see goog.ui.Menu
***REMOVED***
***REMOVED***

goog.provide('goog.ui.MenuSeparator');

goog.require('goog.ui.MenuSeparatorRenderer');
goog.require('goog.ui.Separator');
goog.require('goog.ui.registry');



***REMOVED***
***REMOVED*** Class representing a menu separator.  A menu separator extends {@link
***REMOVED*** goog.ui.Separator} by always setting its renderer to {@link
***REMOVED*** goog.ui.MenuSeparatorRenderer}.
***REMOVED*** @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper used for
***REMOVED***     document interactions.
***REMOVED***
***REMOVED*** @extends {goog.ui.Separator}
***REMOVED***
goog.ui.MenuSeparator = function(opt_domHelper) {
  goog.ui.Separator.call(this, goog.ui.MenuSeparatorRenderer.getInstance(),
      opt_domHelper);
***REMOVED***
goog.inherits(goog.ui.MenuSeparator, goog.ui.Separator);


// Register a decorator factory function for goog.ui.MenuSeparators.
goog.ui.registry.setDecoratorByClassName(
    goog.ui.MenuSeparatorRenderer.CSS_CLASS,
    function() {
      // Separator defaults to using MenuSeparatorRenderer.
      return new goog.ui.Separator();
    });
