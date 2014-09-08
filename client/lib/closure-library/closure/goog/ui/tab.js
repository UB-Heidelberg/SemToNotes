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
***REMOVED*** @fileoverview A tab control, designed to be used in {@link goog.ui.TabBar}s.
***REMOVED***
***REMOVED*** @author attila@google.com (Attila Bodis)
***REMOVED*** @see ../demos/tabbar.html
***REMOVED***

goog.provide('goog.ui.Tab');

goog.require('goog.ui.Component');
goog.require('goog.ui.Control');
goog.require('goog.ui.TabRenderer');
goog.require('goog.ui.registry');



***REMOVED***
***REMOVED*** Tab control, designed to be hosted in a {@link goog.ui.TabBar}.  The tab's
***REMOVED*** DOM may be different based on the configuration of the containing tab bar,
***REMOVED*** so tabs should only be rendered or decorated as children of a tab bar.
***REMOVED*** @param {goog.ui.ControlContent} content Text caption or DOM structure to
***REMOVED***     display as the tab's caption (if any).
***REMOVED*** @param {goog.ui.TabRenderer=} opt_renderer Optional renderer used to render
***REMOVED***     or decorate the tab.
***REMOVED*** @param {goog.dom.DomHelper=} opt_domHelper Optional DOM hepler, used for
***REMOVED***     document interaction.
***REMOVED***
***REMOVED*** @extends {goog.ui.Control}
***REMOVED***
goog.ui.Tab = function(content, opt_renderer, opt_domHelper) {
  goog.ui.Control.call(this, content,
      opt_renderer || goog.ui.TabRenderer.getInstance(), opt_domHelper);

  // Tabs support the SELECTED state.
  this.setSupportedState(goog.ui.Component.State.SELECTED, true);

  // Tabs must dispatch state transition events for the DISABLED and SELECTED
  // states in order for the tab bar to function properly.
  this.setDispatchTransitionEvents(
      goog.ui.Component.State.DISABLED | goog.ui.Component.State.SELECTED,
      true);
***REMOVED***
goog.inherits(goog.ui.Tab, goog.ui.Control);


***REMOVED***
***REMOVED*** Tooltip text for the tab, displayed on hover (if any).
***REMOVED*** @type {string|undefined}
***REMOVED*** @private
***REMOVED***
goog.ui.Tab.prototype.tooltip_;


***REMOVED***
***REMOVED*** @return {string|undefined} Tab tooltip text (if any).
***REMOVED***
goog.ui.Tab.prototype.getTooltip = function() {
  return this.tooltip_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the tab tooltip text.  If the tab has already been rendered, updates
***REMOVED*** its tooltip.
***REMOVED*** @param {string} tooltip New tooltip text.
***REMOVED***
goog.ui.Tab.prototype.setTooltip = function(tooltip) {
  this.getRenderer().setTooltip(this.getElement(), tooltip);
  this.setTooltipInternal(tooltip);
***REMOVED***


***REMOVED***
***REMOVED*** Sets the tab tooltip text.  Considered protected; to be called only by the
***REMOVED*** renderer during element decoration.
***REMOVED*** @param {string} tooltip New tooltip text.
***REMOVED*** @protected
***REMOVED***
goog.ui.Tab.prototype.setTooltipInternal = function(tooltip) {
  this.tooltip_ = tooltip;
***REMOVED***


// Register a decorator factory function for goog.ui.Tabs.
goog.ui.registry.setDecoratorByClassName(goog.ui.TabRenderer.CSS_CLASS,
    function() {
      return new goog.ui.Tab(null);
    });
