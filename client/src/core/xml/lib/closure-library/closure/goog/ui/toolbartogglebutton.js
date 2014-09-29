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
***REMOVED*** @fileoverview A toolbar toggle button control.
***REMOVED***
***REMOVED*** @author attila@google.com (Attila Bodis)
***REMOVED*** @author ssaviano@google.com (Steven Saviano)
***REMOVED***

goog.provide('goog.ui.ToolbarToggleButton');

goog.require('goog.ui.ControlContent');
goog.require('goog.ui.ToggleButton');
goog.require('goog.ui.ToolbarButtonRenderer');
goog.require('goog.ui.registry');



***REMOVED***
***REMOVED*** A toggle button control for a toolbar.
***REMOVED***
***REMOVED*** @param {goog.ui.ControlContent} content Text caption or existing DOM
***REMOVED***     structure to display as the button's caption.
***REMOVED*** @param {goog.ui.ToolbarButtonRenderer=} opt_renderer Optional renderer used
***REMOVED***     to render or decorate the button; defaults to
***REMOVED***     {@link goog.ui.ToolbarButtonRenderer}.
***REMOVED*** @param {goog.dom.DomHelper=} opt_domHelper Optional DOM hepler, used for
***REMOVED***     document interaction.
***REMOVED***
***REMOVED*** @extends {goog.ui.ToggleButton}
***REMOVED***
goog.ui.ToolbarToggleButton = function(content, opt_renderer, opt_domHelper) {
  goog.ui.ToggleButton.call(this, content, opt_renderer ||
      goog.ui.ToolbarButtonRenderer.getInstance(), opt_domHelper);
***REMOVED***
goog.inherits(goog.ui.ToolbarToggleButton, goog.ui.ToggleButton);


// Registers a decorator factory function for toggle buttons in toolbars.
goog.ui.registry.setDecoratorByClassName(
    goog.getCssName('goog-toolbar-toggle-button'), function() {
      return new goog.ui.ToolbarToggleButton(null);
    });
