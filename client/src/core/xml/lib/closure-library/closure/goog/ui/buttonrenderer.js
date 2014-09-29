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
***REMOVED*** @fileoverview Default renderer for {@link goog.ui.Button}s.
***REMOVED***
***REMOVED*** @author attila@google.com (Attila Bodis)
***REMOVED***

goog.provide('goog.ui.ButtonRenderer');

goog.require('goog.a11y.aria');
goog.require('goog.a11y.aria.Role');
goog.require('goog.a11y.aria.State');
goog.require('goog.asserts');
goog.require('goog.ui.ButtonSide');
goog.require('goog.ui.Component.State');
goog.require('goog.ui.ControlRenderer');



***REMOVED***
***REMOVED*** Default renderer for {@link goog.ui.Button}s.  Extends the superclass with
***REMOVED*** the following button-specific API methods:
***REMOVED*** <ul>
***REMOVED***   <li>{@code getValue} - returns the button element's value
***REMOVED***   <li>{@code setValue} - updates the button element to reflect its new value
***REMOVED***   <li>{@code getTooltip} - returns the button element's tooltip text
***REMOVED***   <li>{@code setTooltip} - updates the button element's tooltip text
***REMOVED***   <li>{@code setCollapsed} - removes one or both of the button element's
***REMOVED***       borders
***REMOVED*** </ul>
***REMOVED*** For alternate renderers, see {@link goog.ui.NativeButtonRenderer},
***REMOVED*** {@link goog.ui.CustomButtonRenderer}, and {@link goog.ui.FlatButtonRenderer}.
***REMOVED***
***REMOVED*** @extends {goog.ui.ControlRenderer}
***REMOVED***
goog.ui.ButtonRenderer = function() {
  goog.ui.ControlRenderer.call(this);
***REMOVED***
goog.inherits(goog.ui.ButtonRenderer, goog.ui.ControlRenderer);
goog.addSingletonGetter(goog.ui.ButtonRenderer);


***REMOVED***
***REMOVED*** Default CSS class to be applied to the root element of components rendered
***REMOVED*** by this renderer.
***REMOVED*** @type {string}
***REMOVED***
goog.ui.ButtonRenderer.CSS_CLASS = goog.getCssName('goog-button');


***REMOVED***
***REMOVED*** Returns the ARIA role to be applied to buttons.
***REMOVED*** @return {goog.a11y.aria.Role|undefined} ARIA role.
***REMOVED*** @override
***REMOVED***
goog.ui.ButtonRenderer.prototype.getAriaRole = function() {
  return goog.a11y.aria.Role.BUTTON;
***REMOVED***


***REMOVED***
***REMOVED*** Updates the button's ARIA (accessibility) state if the button is being
***REMOVED*** treated as a checkbox.
***REMOVED*** @param {Element} element Element whose ARIA state is to be updated.
***REMOVED*** @param {goog.ui.Component.State} state Component state being enabled or
***REMOVED***     disabled.
***REMOVED*** @param {boolean} enable Whether the state is being enabled or disabled.
***REMOVED*** @protected
***REMOVED*** @override
***REMOVED***
goog.ui.ButtonRenderer.prototype.updateAriaState = function(element, state,
    enable) {
  // If button has CHECKED state, assign ARIA atrribute aria-pressed
  if (state == goog.ui.Component.State.CHECKED) {
    goog.asserts.assert(element,
        'The button DOM element cannot be null.');
    goog.a11y.aria.setState(element, goog.a11y.aria.State.PRESSED, enable);
  } else {
    goog.ui.ButtonRenderer.superClass_.updateAriaState.call(this, element,
        state, enable);
  }
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.ui.ButtonRenderer.prototype.createDom = function(button) {
  var element = goog.ui.ButtonRenderer.superClass_.createDom.call(this, button);

  var tooltip = button.getTooltip();
  if (tooltip) {
    this.setTooltip(element, tooltip);
  }

  var value = button.getValue();
  if (value) {
    this.setValue(element, value);
  }

  // If this is a toggle button, set ARIA state
  if (button.isSupportedState(goog.ui.Component.State.CHECKED)) {
    this.updateAriaState(element, goog.ui.Component.State.CHECKED,
                         button.isChecked());
  }

  return element;
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.ui.ButtonRenderer.prototype.decorate = function(button, element) {
  // The superclass implementation takes care of common attributes; we only
  // need to set the value and the tooltip.
  element = goog.ui.ButtonRenderer.superClass_.decorate.call(this, button,
      element);

  button.setValueInternal(this.getValue(element));
  button.setTooltipInternal(this.getTooltip(element));

  // If this is a toggle button, set ARIA state
  if (button.isSupportedState(goog.ui.Component.State.CHECKED)) {
    this.updateAriaState(element, goog.ui.Component.State.CHECKED,
                         button.isChecked());
  }

  return element;
***REMOVED***


***REMOVED***
***REMOVED*** Takes a button's root element, and returns the value associated with it.
***REMOVED*** No-op in the base class.
***REMOVED*** @param {Element} element The button's root element.
***REMOVED*** @return {string|undefined} The button's value (undefined if none).
***REMOVED***
goog.ui.ButtonRenderer.prototype.getValue = goog.nullFunction;


***REMOVED***
***REMOVED*** Takes a button's root element and a value, and updates the element to reflect
***REMOVED*** the new value.  No-op in the base class.
***REMOVED*** @param {Element} element The button's root element.
***REMOVED*** @param {string} value New value.
***REMOVED***
goog.ui.ButtonRenderer.prototype.setValue = goog.nullFunction;


***REMOVED***
***REMOVED*** Takes a button's root element, and returns its tooltip text.
***REMOVED*** @param {Element} element The button's root element.
***REMOVED*** @return {string|undefined} The tooltip text.
***REMOVED***
goog.ui.ButtonRenderer.prototype.getTooltip = function(element) {
  return element.title;
***REMOVED***


***REMOVED***
***REMOVED*** Takes a button's root element and a tooltip string, and updates the element
***REMOVED*** with the new tooltip.
***REMOVED*** @param {Element} element The button's root element.
***REMOVED*** @param {string} tooltip New tooltip text.
***REMOVED*** @protected
***REMOVED***
goog.ui.ButtonRenderer.prototype.setTooltip = function(element, tooltip) {
  if (element) {
    element.title = tooltip || '';
  }
***REMOVED***


***REMOVED***
***REMOVED*** Collapses the border on one or both sides of the button, allowing it to be
***REMOVED*** combined with the adjacent button(s), forming a single UI componenet with
***REMOVED*** multiple targets.
***REMOVED*** @param {goog.ui.Button} button Button to update.
***REMOVED*** @param {number} sides Bitmap of one or more {@link goog.ui.ButtonSide}s for
***REMOVED***     which borders should be collapsed.
***REMOVED*** @protected
***REMOVED***
goog.ui.ButtonRenderer.prototype.setCollapsed = function(button, sides) {
  var isRtl = button.isRightToLeft();
  var collapseLeftClassName =
      goog.getCssName(this.getStructuralCssClass(), 'collapse-left');
  var collapseRightClassName =
      goog.getCssName(this.getStructuralCssClass(), 'collapse-right');

  button.enableClassName(isRtl ? collapseRightClassName : collapseLeftClassName,
      !!(sides & goog.ui.ButtonSide.START));
  button.enableClassName(isRtl ? collapseLeftClassName : collapseRightClassName,
      !!(sides & goog.ui.ButtonSide.END));
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.ui.ButtonRenderer.prototype.getCssClass = function() {
  return goog.ui.ButtonRenderer.CSS_CLASS;
***REMOVED***
