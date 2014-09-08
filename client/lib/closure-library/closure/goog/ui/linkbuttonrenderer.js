// Copyright 2010 The Closure Library Authors. All Rights Reserved.
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
***REMOVED*** @fileoverview Similiar to {@link goog.ui.FlatButtonRenderer},
***REMOVED*** but underlines text instead of adds borders.
***REMOVED***
***REMOVED*** For accessibility reasons, it is best to use this with a goog.ui.Button
***REMOVED*** instead of an A element for links that perform actions in the page.  Links
***REMOVED*** that have an href and open a new page can and should remain as A elements.
***REMOVED***
***REMOVED*** @author robbyw@google.com (Robby Walker)
***REMOVED***

goog.provide('goog.ui.LinkButtonRenderer');

goog.require('goog.ui.Button');
goog.require('goog.ui.FlatButtonRenderer');
goog.require('goog.ui.registry');



***REMOVED***
***REMOVED*** Link renderer for {@link goog.ui.Button}s.  Link buttons can contain
***REMOVED*** almost arbitrary HTML content, will flow like inline elements, but can be
***REMOVED*** styled like block-level elements.
***REMOVED***
***REMOVED*** @extends {goog.ui.FlatButtonRenderer}
***REMOVED***
goog.ui.LinkButtonRenderer = function() {
  goog.ui.FlatButtonRenderer.call(this);
***REMOVED***
goog.inherits(goog.ui.LinkButtonRenderer, goog.ui.FlatButtonRenderer);
goog.addSingletonGetter(goog.ui.LinkButtonRenderer);


***REMOVED***
***REMOVED*** Default CSS class to be applied to the root element of components rendered
***REMOVED*** by this renderer.
***REMOVED*** @type {string}
***REMOVED***
goog.ui.LinkButtonRenderer.CSS_CLASS = goog.getCssName('goog-link-button');


***REMOVED*** @override***REMOVED***
goog.ui.LinkButtonRenderer.prototype.getCssClass = function() {
  return goog.ui.LinkButtonRenderer.CSS_CLASS;
***REMOVED***


// Register a decorator factory function for Link Buttons.
goog.ui.registry.setDecoratorByClassName(goog.ui.LinkButtonRenderer.CSS_CLASS,
    function() {
      // Uses goog.ui.Button, but with LinkButtonRenderer.
      return new goog.ui.Button(null, goog.ui.LinkButtonRenderer.getInstance());
    });
