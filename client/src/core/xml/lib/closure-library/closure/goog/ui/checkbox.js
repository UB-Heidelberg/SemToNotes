// Copyright 2009 The Closure Library Authors. All Rights Reserved.
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
***REMOVED*** @fileoverview Tristate checkbox widget.
***REMOVED***
***REMOVED*** @see ../demos/checkbox.html
***REMOVED***

goog.provide('goog.ui.Checkbox');
goog.provide('goog.ui.Checkbox.State');

goog.require('goog.a11y.aria');
goog.require('goog.a11y.aria.State');
goog.require('goog.asserts');
***REMOVED***
goog.require('goog.events.KeyCodes');
goog.require('goog.ui.CheckboxRenderer');
goog.require('goog.ui.Component.EventType');
goog.require('goog.ui.Component.State');
goog.require('goog.ui.Control');
goog.require('goog.ui.registry');



***REMOVED***
***REMOVED*** 3-state checkbox widget. Fires CHECK or UNCHECK events before toggled and
***REMOVED*** CHANGE event after toggled by user.
***REMOVED*** The checkbox can also be enabled/disabled and get focused and highlighted.
***REMOVED***
***REMOVED*** @param {goog.ui.Checkbox.State=} opt_checked Checked state to set.
***REMOVED*** @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper, used for
***REMOVED***     document interaction.
***REMOVED*** @param {goog.ui.CheckboxRenderer=} opt_renderer Renderer used to render or
***REMOVED***     decorate the checkbox; defaults to {@link goog.ui.CheckboxRenderer}.
***REMOVED***
***REMOVED*** @extends {goog.ui.Control}
***REMOVED***
goog.ui.Checkbox = function(opt_checked, opt_domHelper, opt_renderer) {
  var renderer = opt_renderer || goog.ui.CheckboxRenderer.getInstance();
  goog.ui.Control.call(this, null, renderer, opt_domHelper);
  // The checkbox maintains its own tri-state CHECKED state.
  // The control class maintains DISABLED, ACTIVE, and FOCUSED (which enable tab
  // navigation, and keyHandling with SPACE).

 ***REMOVED*****REMOVED***
  ***REMOVED*** Checked state of the checkbox.
  ***REMOVED*** @type {goog.ui.Checkbox.State}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.checked_ = goog.isDef(opt_checked) ?
      opt_checked : goog.ui.Checkbox.State.UNCHECKED;
***REMOVED***
goog.inherits(goog.ui.Checkbox, goog.ui.Control);


***REMOVED***
***REMOVED*** Possible checkbox states.
***REMOVED*** @enum {?boolean}
***REMOVED***
goog.ui.Checkbox.State = {
  CHECKED: true,
  UNCHECKED: false,
  UNDETERMINED: null
***REMOVED***


***REMOVED***
***REMOVED*** Label element bound to the checkbox.
***REMOVED*** @type {Element}
***REMOVED*** @private
***REMOVED***
goog.ui.Checkbox.prototype.label_ = null;


***REMOVED***
***REMOVED*** @return {goog.ui.Checkbox.State} Checked state of the checkbox.
***REMOVED***
goog.ui.Checkbox.prototype.getChecked = function() {
  return this.checked_;
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} Whether the checkbox is checked.
***REMOVED*** @override
***REMOVED***
goog.ui.Checkbox.prototype.isChecked = function() {
  return this.checked_ == goog.ui.Checkbox.State.CHECKED;
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} Whether the checkbox is not checked.
***REMOVED***
goog.ui.Checkbox.prototype.isUnchecked = function() {
  return this.checked_ == goog.ui.Checkbox.State.UNCHECKED;
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} Whether the checkbox is in partially checked state.
***REMOVED***
goog.ui.Checkbox.prototype.isUndetermined = function() {
  return this.checked_ == goog.ui.Checkbox.State.UNDETERMINED;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the checked state of the checkbox.
***REMOVED*** @param {?boolean} checked The checked state to set.
***REMOVED*** @override
***REMOVED***
goog.ui.Checkbox.prototype.setChecked = function(checked) {
  if (checked != this.checked_) {
    this.checked_ =***REMOVED*****REMOVED*** @type {goog.ui.Checkbox.State}***REMOVED*** (checked);
    this.getRenderer().setCheckboxState(this.getElement(), this.checked_);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Sets the checked state for the checkbox.  Unlike {@link #setChecked},
***REMOVED*** doesn't update the checkbox's DOM.  Considered protected; to be called
***REMOVED*** only by renderer code during element decoration.
***REMOVED*** @param {goog.ui.Checkbox.State} checked New checkbox state.
***REMOVED***
goog.ui.Checkbox.prototype.setCheckedInternal = function(checked) {
  this.checked_ = checked;
***REMOVED***


***REMOVED***
***REMOVED*** Binds an HTML element to the checkbox which if clicked toggles the checkbox.
***REMOVED*** Behaves the same way as the 'label' HTML tag. The label element has to be the
***REMOVED*** direct or non-direct ancestor of the checkbox element because it will get the
***REMOVED*** focus when keyboard support is implemented.
***REMOVED***
***REMOVED*** @param {Element} label The label control to set. If null, only the checkbox
***REMOVED***     reacts to clicks.
***REMOVED***
goog.ui.Checkbox.prototype.setLabel = function(label) {
  if (this.isInDocument()) {
    this.exitDocument();
    this.label_ = label;
    this.enterDocument();
  } else {
    this.label_ = label;
  }
***REMOVED***


***REMOVED***
***REMOVED*** Toggles the checkbox. State transitions:
***REMOVED*** <ul>
***REMOVED***   <li>unchecked -> checked
***REMOVED***   <li>undetermined -> checked
***REMOVED***   <li>checked -> unchecked
***REMOVED*** </ul>
***REMOVED***
goog.ui.Checkbox.prototype.toggle = function() {
  this.setChecked(this.checked_ ? goog.ui.Checkbox.State.UNCHECKED :
      goog.ui.Checkbox.State.CHECKED);
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.ui.Checkbox.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');
  if (this.isHandleMouseEvents()) {
    var handler = this.getHandler();
    // Listen to the label, if it was set.
    if (this.label_) {
      // Any mouse events that happen to the associated label should have the
      // same effect on the checkbox as if they were happening to the checkbox
      // itself.
      handler.
          listen(this.label_, goog.events.EventType.CLICK,
              this.handleClickOrSpace_).
          listen(this.label_, goog.events.EventType.MOUSEOVER,
              this.handleMouseOver).
          listen(this.label_, goog.events.EventType.MOUSEOUT,
              this.handleMouseOut).
          listen(this.label_, goog.events.EventType.MOUSEDOWN,
              this.handleMouseDown).
          listen(this.label_, goog.events.EventType.MOUSEUP,
              this.handleMouseUp);
    }
    // Checkbox needs to explicitly listen for click event.
    handler.listen(this.getElement(),
        goog.events.EventType.CLICK, this.handleClickOrSpace_);
  }

  // Set aria label.
  if (this.label_) {
    if (!this.label_.id) {
      this.label_.id = this.makeId('lbl');
    }
    var checkboxElement = this.getElement();
    goog.asserts.assert(checkboxElement,
        'The checkbox DOM element cannot be null.');
    goog.a11y.aria.setState(checkboxElement,
        goog.a11y.aria.State.LABELLEDBY,
        this.label_.id);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Fix for tabindex not being updated so that disabled checkbox is not
***REMOVED*** focusable. In particular this fails in Chrome.
***REMOVED*** Note: in general tabIndex=-1 will prevent from keyboard focus but enables
***REMOVED*** mouse focus, however in this case the control class prevents mouse focus.
***REMOVED*** @override
***REMOVED***
goog.ui.Checkbox.prototype.setEnabled = function(enabled) {
  goog.base(this, 'setEnabled', enabled);
  var el = this.getElement();
  if (el) {
    el.tabIndex = this.isEnabled() ? 0 : -1;
  }
***REMOVED***


***REMOVED***
***REMOVED*** Handles the click event.
***REMOVED*** @param {!goog.events.BrowserEvent} e The event.
***REMOVED*** @private
***REMOVED***
goog.ui.Checkbox.prototype.handleClickOrSpace_ = function(e) {
  e.stopPropagation();
  var eventType = this.checked_ ? goog.ui.Component.EventType.UNCHECK :
      goog.ui.Component.EventType.CHECK;
  if (this.isEnabled() && this.dispatchEvent(eventType)) {
    e.preventDefault();  // Prevent scrolling in Chrome if SPACE is pressed.
    this.toggle();
    this.dispatchEvent(goog.ui.Component.EventType.CHANGE);
  }
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.ui.Checkbox.prototype.handleKeyEventInternal = function(e) {
  if (e.keyCode == goog.events.KeyCodes.SPACE) {
    this.handleClickOrSpace_(e);
  }
  return false;
***REMOVED***


***REMOVED***
***REMOVED*** Register this control so it can be created from markup.
***REMOVED***
goog.ui.registry.setDecoratorByClassName(
    goog.ui.CheckboxRenderer.CSS_CLASS,
    function() {
      return new goog.ui.Checkbox();
    });
