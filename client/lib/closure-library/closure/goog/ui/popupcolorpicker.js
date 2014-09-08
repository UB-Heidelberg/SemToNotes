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
***REMOVED*** @fileoverview Popup Color Picker implementation.  This is intended to be
***REMOVED*** less general than goog.ui.ColorPicker and presents a default set of colors
***REMOVED*** that CCC apps currently use in their color pickers.
***REMOVED***
***REMOVED*** @see ../demos/popupcolorpicker.html
***REMOVED***

goog.provide('goog.ui.PopupColorPicker');

goog.require('goog.asserts');
goog.require('goog.dom.classlist');
***REMOVED***
goog.require('goog.positioning.AnchoredPosition');
goog.require('goog.positioning.Corner');
goog.require('goog.ui.ColorPicker');
goog.require('goog.ui.Component');
goog.require('goog.ui.Popup');



***REMOVED***
***REMOVED*** Popup color picker widget.
***REMOVED***
***REMOVED*** @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper.
***REMOVED*** @param {goog.ui.ColorPicker=} opt_colorPicker Optional color picker to use
***REMOVED***     for this popup.
***REMOVED*** @extends {goog.ui.Component}
***REMOVED***
***REMOVED***
goog.ui.PopupColorPicker = function(opt_domHelper, opt_colorPicker) {
  goog.ui.Component.call(this, opt_domHelper);

  if (opt_colorPicker) {
    this.colorPicker_ = opt_colorPicker;
  }
***REMOVED***
goog.inherits(goog.ui.PopupColorPicker, goog.ui.Component);


***REMOVED***
***REMOVED*** Whether the color picker is initialized.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.ui.PopupColorPicker.prototype.initialized_ = false;


***REMOVED***
***REMOVED*** Instance of a color picker control.
***REMOVED*** @type {goog.ui.ColorPicker}
***REMOVED*** @private
***REMOVED***
goog.ui.PopupColorPicker.prototype.colorPicker_ = null;


***REMOVED***
***REMOVED*** Instance of goog.ui.Popup used to manage the behavior of the color picker.
***REMOVED*** @type {goog.ui.Popup}
***REMOVED*** @private
***REMOVED***
goog.ui.PopupColorPicker.prototype.popup_ = null;


***REMOVED***
***REMOVED*** Corner of the popup which is pinned to the attaching element.
***REMOVED*** @type {goog.positioning.Corner}
***REMOVED*** @private
***REMOVED***
goog.ui.PopupColorPicker.prototype.pinnedCorner_ =
    goog.positioning.Corner.TOP_START;


***REMOVED***
***REMOVED*** Corner of the attaching element where the popup shows.
***REMOVED*** @type {goog.positioning.Corner}
***REMOVED*** @private
***REMOVED***
goog.ui.PopupColorPicker.prototype.popupCorner_ =
    goog.positioning.Corner.BOTTOM_START;


***REMOVED***
***REMOVED*** Reference to the element that triggered the last popup.
***REMOVED*** @type {Element}
***REMOVED*** @private
***REMOVED***
goog.ui.PopupColorPicker.prototype.lastTarget_ = null;


***REMOVED***
***REMOVED*** Whether the color picker can move the focus to its key event target when it
***REMOVED*** is shown.  The default is true.  Setting to false can break keyboard
***REMOVED*** navigation, but this is needed for certain scenarios, for example the
***REMOVED*** toolbar menu in trogedit which can't have the selection changed.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.ui.PopupColorPicker.prototype.allowAutoFocus_ = true;


***REMOVED***
***REMOVED*** Whether the color picker can accept focus.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.ui.PopupColorPicker.prototype.focusable_ = true;


***REMOVED***
***REMOVED*** If true, then the colorpicker will toggle off if it is already visible.
***REMOVED***
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.ui.PopupColorPicker.prototype.toggleMode_ = true;


***REMOVED***
***REMOVED*** If true, the colorpicker will appear on hover.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.ui.PopupColorPicker.prototype.showOnHover_ = false;


***REMOVED*** @override***REMOVED***
goog.ui.PopupColorPicker.prototype.createDom = function() {
  goog.ui.PopupColorPicker.superClass_.createDom.call(this);
  this.popup_ = new goog.ui.Popup(this.getElement());
  this.popup_.setPinnedCorner(this.pinnedCorner_);
  goog.dom.classlist.set(
      goog.asserts.assert(this.getElement()),
      goog.getCssName('goog-popupcolorpicker'));
  this.getElement().unselectable = 'on';
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.ui.PopupColorPicker.prototype.disposeInternal = function() {
  goog.ui.PopupColorPicker.superClass_.disposeInternal.call(this);
  this.colorPicker_ = null;
  this.lastTarget_ = null;
  this.initialized_ = false;
  if (this.popup_) {
    this.popup_.dispose();
    this.popup_ = null;
  }
***REMOVED***


***REMOVED***
***REMOVED*** ColorPickers cannot be used to decorate pre-existing html, since the
***REMOVED*** structure they build is fairly complicated.
***REMOVED*** @param {Element} element Element to decorate.
***REMOVED*** @return {boolean} Returns always false.
***REMOVED*** @override
***REMOVED***
goog.ui.PopupColorPicker.prototype.canDecorate = function(element) {
  return false;
***REMOVED***


***REMOVED***
***REMOVED*** @return {goog.ui.ColorPicker} The color picker instance.
***REMOVED***
goog.ui.PopupColorPicker.prototype.getColorPicker = function() {
  return this.colorPicker_;
***REMOVED***


***REMOVED***
***REMOVED*** Returns whether the Popup dismisses itself when the user clicks outside of
***REMOVED*** it.
***REMOVED*** @return {boolean} Whether the Popup autohides on an external click.
***REMOVED***
goog.ui.PopupColorPicker.prototype.getAutoHide = function() {
  return !!this.popup_ && this.popup_.getAutoHide();
***REMOVED***


***REMOVED***
***REMOVED*** Sets whether the Popup dismisses itself when the user clicks outside of it -
***REMOVED*** must be called after the Popup has been created (in createDom()),
***REMOVED*** otherwise it does nothing.
***REMOVED***
***REMOVED*** @param {boolean} autoHide Whether to autohide on an external click.
***REMOVED***
goog.ui.PopupColorPicker.prototype.setAutoHide = function(autoHide) {
  if (this.popup_) {
    this.popup_.setAutoHide(autoHide);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Returns the region inside which the Popup dismisses itself when the user
***REMOVED*** clicks, or null if it was not set. Null indicates the entire document is
***REMOVED*** the autohide region.
***REMOVED*** @return {Element} The DOM element for autohide, or null if it hasn't been
***REMOVED***     set.
***REMOVED***
goog.ui.PopupColorPicker.prototype.getAutoHideRegion = function() {
  return this.popup_ && this.popup_.getAutoHideRegion();
***REMOVED***


***REMOVED***
***REMOVED*** Sets the region inside which the Popup dismisses itself when the user
***REMOVED*** clicks - must be called after the Popup has been created (in createDom()),
***REMOVED*** otherwise it does nothing.
***REMOVED***
***REMOVED*** @param {Element} element The DOM element for autohide.
***REMOVED***
goog.ui.PopupColorPicker.prototype.setAutoHideRegion = function(element) {
  if (this.popup_) {
    this.popup_.setAutoHideRegion(element);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Returns the {@link goog.ui.PopupBase} from this picker. Returns null if the
***REMOVED*** popup has not yet been created.
***REMOVED***
***REMOVED*** NOTE: This should***REMOVED***ONLY* be called from tests. If called before createDom(),
***REMOVED*** this should return null.
***REMOVED***
***REMOVED*** @return {goog.ui.PopupBase?} The popup or null if it hasn't been created.
***REMOVED***
goog.ui.PopupColorPicker.prototype.getPopup = function() {
  return this.popup_;
***REMOVED***


***REMOVED***
***REMOVED*** @return {Element} The last element that triggered the popup.
***REMOVED***
goog.ui.PopupColorPicker.prototype.getLastTarget = function() {
  return this.lastTarget_;
***REMOVED***


***REMOVED***
***REMOVED*** Attaches the popup color picker to an element.
***REMOVED*** @param {Element} element The element to attach to.
***REMOVED***
goog.ui.PopupColorPicker.prototype.attach = function(element) {
  if (this.showOnHover_) {
    this.getHandler().listen(element, goog.events.EventType.MOUSEOVER,
                             this.show_);
  } else {
    this.getHandler().listen(element, goog.events.EventType.MOUSEDOWN,
                             this.show_);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Detatches the popup color picker from an element.
***REMOVED*** @param {Element} element The element to detach from.
***REMOVED***
goog.ui.PopupColorPicker.prototype.detach = function(element) {
  if (this.showOnHover_) {
    this.getHandler().unlisten(element, goog.events.EventType.MOUSEOVER,
                               this.show_);
  } else {
    this.getHandler().unlisten(element, goog.events.EventType.MOUSEOVER,
                               this.show_);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Gets the color that is currently selected in this color picker.
***REMOVED*** @return {?string} The hex string of the color selected, or null if no
***REMOVED***     color is selected.
***REMOVED***
goog.ui.PopupColorPicker.prototype.getSelectedColor = function() {
  return this.colorPicker_.getSelectedColor();
***REMOVED***


***REMOVED***
***REMOVED*** Sets whether the color picker can accept focus.
***REMOVED*** @param {boolean} focusable True iff the color picker can accept focus.
***REMOVED***
goog.ui.PopupColorPicker.prototype.setFocusable = function(focusable) {
  this.focusable_ = focusable;
  if (this.colorPicker_) {
    // TODO(user): In next revision sort the behavior of passing state to
    // children correctly
    this.colorPicker_.setFocusable(focusable);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Sets whether the color picker can automatically move focus to its key event
***REMOVED*** target when it is set to visible.
***REMOVED*** @param {boolean} allow Whether to allow auto focus.
***REMOVED***
goog.ui.PopupColorPicker.prototype.setAllowAutoFocus = function(allow) {
  this.allowAutoFocus_ = allow;
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} Whether the color picker can automatically move focus to
***REMOVED***     its key event target when it is set to visible.
***REMOVED***
goog.ui.PopupColorPicker.prototype.getAllowAutoFocus = function() {
  return this.allowAutoFocus_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets whether the color picker should toggle off if it is already open.
***REMOVED*** @param {boolean} toggle The new toggle mode.
***REMOVED***
goog.ui.PopupColorPicker.prototype.setToggleMode = function(toggle) {
  this.toggleMode_ = toggle;
***REMOVED***


***REMOVED***
***REMOVED*** Gets whether the colorpicker is in toggle mode
***REMOVED*** @return {boolean} toggle.
***REMOVED***
goog.ui.PopupColorPicker.prototype.getToggleMode = function() {
  return this.toggleMode_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets whether the picker remembers the last selected color between popups.
***REMOVED***
***REMOVED*** @param {boolean} remember Whether to remember the selection.
***REMOVED***
goog.ui.PopupColorPicker.prototype.setRememberSelection = function(remember) {
  this.rememberSelection_ = remember;
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} Whether the picker remembers the last selected color
***REMOVED***     between popups.
***REMOVED***
goog.ui.PopupColorPicker.prototype.getRememberSelection = function() {
  return this.rememberSelection_;
***REMOVED***


***REMOVED***
***REMOVED*** Add an array of colors to the colors displayed by the color picker.
***REMOVED*** Does not add duplicated colors.
***REMOVED*** @param {Array.<string>} colors The array of colors to be added.
***REMOVED***
goog.ui.PopupColorPicker.prototype.addColors = function(colors) {

***REMOVED***


***REMOVED***
***REMOVED*** Clear the colors displayed by the color picker.
***REMOVED***
goog.ui.PopupColorPicker.prototype.clearColors = function() {

***REMOVED***


***REMOVED***
***REMOVED*** Set the pinned corner of the popup.
***REMOVED*** @param {goog.positioning.Corner} corner The corner of the popup which is
***REMOVED***     pinned to the attaching element.
***REMOVED***
goog.ui.PopupColorPicker.prototype.setPinnedCorner = function(corner) {
  this.pinnedCorner_ = corner;
  if (this.popup_) {
    this.popup_.setPinnedCorner(this.pinnedCorner_);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Sets which corner of the attaching element this popup shows up.
***REMOVED*** @param {goog.positioning.Corner} corner The corner of the attaching element
***REMOVED***     where to show the popup.
***REMOVED***
goog.ui.PopupColorPicker.prototype.setPopupCorner = function(corner) {
  this.popupCorner_ = corner;
***REMOVED***


***REMOVED***
***REMOVED*** Sets whether the popup shows up on hover. By default, appears on click.
***REMOVED*** @param {boolean} showOnHover True if popup should appear on hover.
***REMOVED***
goog.ui.PopupColorPicker.prototype.setShowOnHover = function(showOnHover) {
  this.showOnHover_ = showOnHover;
***REMOVED***


***REMOVED***
***REMOVED*** Handles click events on the targets and shows the color picker.
***REMOVED*** @param {goog.events.BrowserEvent} e The browser event.
***REMOVED*** @private
***REMOVED***
goog.ui.PopupColorPicker.prototype.show_ = function(e) {
  if (!this.initialized_) {
    this.colorPicker_ = this.colorPicker_ ||
        goog.ui.ColorPicker.createSimpleColorGrid(this.getDomHelper());
    this.colorPicker_.setFocusable(this.focusable_);
    this.addChild(this.colorPicker_, true);
    this.getHandler().listen(this.colorPicker_,
        goog.ui.ColorPicker.EventType.CHANGE, this.onColorPicked_);
    this.initialized_ = true;
  }

  if (this.popup_.isOrWasRecentlyVisible() && this.toggleMode_ &&
      this.lastTarget_ == e.currentTarget) {
    this.popup_.setVisible(false);
    return;
  }

  this.lastTarget_ =***REMOVED*****REMOVED*** @type {Element}***REMOVED*** (e.currentTarget);
  this.popup_.setPosition(new goog.positioning.AnchoredPosition(
      this.lastTarget_, this.popupCorner_));
  if (!this.rememberSelection_) {
    this.colorPicker_.setSelectedIndex(-1);
  }
  this.popup_.setVisible(true);
  if (this.allowAutoFocus_) {
    this.colorPicker_.focus();
  }
***REMOVED***


***REMOVED***
***REMOVED*** Handles the color change event.
***REMOVED*** @param {goog.events.Event} e The event.
***REMOVED*** @private
***REMOVED***
goog.ui.PopupColorPicker.prototype.onColorPicked_ = function(e) {
  // When we show the color picker we reset the color, which triggers an event.
  // Here we block that event so that it doesn't dismiss the popup
  // TODO(user): Update the colorpicker to allow selection to be cleared
  if (this.colorPicker_.getSelectedIndex() == -1) {
    e.stopPropagation();
    return;
  }
  this.popup_.setVisible(false);
  if (this.allowAutoFocus_) {
    this.lastTarget_.focus();
  }
***REMOVED***
