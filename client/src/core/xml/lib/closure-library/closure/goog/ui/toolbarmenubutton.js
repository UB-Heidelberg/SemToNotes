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
***REMOVED*** @fileoverview A toolbar menu button control.
***REMOVED***
***REMOVED*** @author attila@google.com (Attila Bodis)
***REMOVED*** @author ssaviano@google.com (Steven Saviano)
***REMOVED***

goog.provide('goog.ui.ToolbarMenuButton');

goog.require('goog.ui.ControlContent');
goog.require('goog.ui.MenuButton');
goog.require('goog.ui.ToolbarMenuButtonRenderer');
goog.require('goog.ui.registry');



***REMOVED***
***REMOVED*** A menu button control for a toolbar.
***REMOVED***
***REMOVED*** @param {goog.ui.ControlContent} content Text caption or existing DOM
***REMOVED***     structure to display as the button's caption.
***REMOVED*** @param {goog.ui.Menu=} opt_menu Menu to render under the button when clicked.
***REMOVED*** @param {goog.ui.ButtonRenderer=} opt_renderer Optional renderer used to
***REMOVED***     render or decorate the button; defaults to
***REMOVED***     {@link goog.ui.ToolbarMenuButtonRenderer}.
***REMOVED*** @param {goog.dom.DomHelper=} opt_domHelper Optional DOM hepler, used for
***REMOVED***     document interaction.
***REMOVED***
***REMOVED*** @extends {goog.ui.MenuButton}
***REMOVED***
goog.ui.ToolbarMenuButton = function(
    content, opt_menu, opt_renderer, opt_domHelper) {
  goog.ui.MenuButton.call(this, content, opt_menu, opt_renderer ||
      goog.ui.ToolbarMenuButtonRenderer.getInstance(), opt_domHelper);
***REMOVED***
goog.inherits(goog.ui.ToolbarMenuButton, goog.ui.MenuButton);


// Registers a decorator factory function for toolbar menu buttons.
goog.ui.registry.setDecoratorByClassName(
    goog.ui.ToolbarMenuButtonRenderer.CSS_CLASS,
    function() {
      return new goog.ui.ToolbarMenuButton(null);
    });
