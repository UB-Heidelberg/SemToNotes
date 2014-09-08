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
***REMOVED*** @fileoverview A combo box control that allows user input with
***REMOVED*** auto-suggestion from a limited set of options.
***REMOVED***
***REMOVED*** @see ../demos/combobox.html
***REMOVED***

goog.provide('goog.ui.ComboBox');
goog.provide('goog.ui.ComboBoxItem');

goog.require('goog.Timer');
goog.require('goog.asserts');
goog.require('goog.dom');
goog.require('goog.dom.classlist');
***REMOVED***
goog.require('goog.events.InputHandler');
goog.require('goog.events.KeyCodes');
goog.require('goog.events.KeyHandler');
goog.require('goog.log');
goog.require('goog.positioning.Corner');
goog.require('goog.positioning.MenuAnchoredPosition');
goog.require('goog.string');
goog.require('goog.style');
goog.require('goog.ui.Component');
goog.require('goog.ui.ItemEvent');
goog.require('goog.ui.LabelInput');
goog.require('goog.ui.Menu');
goog.require('goog.ui.MenuItem');
goog.require('goog.ui.MenuSeparator');
goog.require('goog.ui.registry');
goog.require('goog.userAgent');



***REMOVED***
***REMOVED*** A ComboBox control.
***REMOVED*** @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper.
***REMOVED*** @param {goog.ui.Menu=} opt_menu Optional menu component.
***REMOVED***     This menu is disposed of by this control.
***REMOVED*** @param {goog.ui.LabelInput=} opt_labelInput Optional label input.
***REMOVED***     This label input is disposed of by this control.
***REMOVED*** @extends {goog.ui.Component}
***REMOVED***
***REMOVED***
goog.ui.ComboBox = function(opt_domHelper, opt_menu, opt_labelInput) {
  goog.ui.Component.call(this, opt_domHelper);

  this.labelInput_ = opt_labelInput || new goog.ui.LabelInput();
  this.enabled_ = true;

  // TODO(user): Allow lazy creation of menus/menu items
  this.menu_ = opt_menu || new goog.ui.Menu(this.getDomHelper());
  this.setupMenu_();
***REMOVED***
goog.inherits(goog.ui.ComboBox, goog.ui.Component);


***REMOVED***
***REMOVED*** Number of milliseconds to wait before dismissing combobox after blur.
***REMOVED*** @type {number}
***REMOVED***
goog.ui.ComboBox.BLUR_DISMISS_TIMER_MS = 250;


***REMOVED***
***REMOVED*** A logger to help debugging of combo box behavior.
***REMOVED*** @type {goog.log.Logger}
***REMOVED*** @private
***REMOVED***
goog.ui.ComboBox.prototype.logger_ =
    goog.log.getLogger('goog.ui.ComboBox');


***REMOVED***
***REMOVED*** Whether the combo box is enabled.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.ui.ComboBox.prototype.enabled_;


***REMOVED***
***REMOVED*** Keyboard event handler to manage key events dispatched by the input element.
***REMOVED*** @type {goog.events.KeyHandler}
***REMOVED*** @private
***REMOVED***
goog.ui.ComboBox.prototype.keyHandler_;


***REMOVED***
***REMOVED*** Input handler to take care of firing events when the user inputs text in
***REMOVED*** the input.
***REMOVED*** @type {goog.events.InputHandler?}
***REMOVED*** @private
***REMOVED***
goog.ui.ComboBox.prototype.inputHandler_ = null;


***REMOVED***
***REMOVED*** The last input token.
***REMOVED*** @type {?string}
***REMOVED*** @private
***REMOVED***
goog.ui.ComboBox.prototype.lastToken_ = null;


***REMOVED***
***REMOVED*** A LabelInput control that manages the focus/blur state of the input box.
***REMOVED*** @type {goog.ui.LabelInput?}
***REMOVED*** @private
***REMOVED***
goog.ui.ComboBox.prototype.labelInput_ = null;


***REMOVED***
***REMOVED*** Drop down menu for the combo box.  Will be created at construction time.
***REMOVED*** @type {goog.ui.Menu?}
***REMOVED*** @private
***REMOVED***
goog.ui.ComboBox.prototype.menu_ = null;


***REMOVED***
***REMOVED*** The cached visible count.
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.ui.ComboBox.prototype.visibleCount_ = -1;


***REMOVED***
***REMOVED*** The input element.
***REMOVED*** @type {Element}
***REMOVED*** @private
***REMOVED***
goog.ui.ComboBox.prototype.input_ = null;


***REMOVED***
***REMOVED*** The match function.  The first argument for the match function will be
***REMOVED*** a MenuItem's caption and the second will be the token to evaluate.
***REMOVED*** @type {Function}
***REMOVED*** @private
***REMOVED***
goog.ui.ComboBox.prototype.matchFunction_ = goog.string.startsWith;


***REMOVED***
***REMOVED*** Element used as the combo boxes button.
***REMOVED*** @type {Element}
***REMOVED*** @private
***REMOVED***
goog.ui.ComboBox.prototype.button_ = null;


***REMOVED***
***REMOVED*** Default text content for the input box when it is unchanged and unfocussed.
***REMOVED*** @type {string}
***REMOVED*** @private
***REMOVED***
goog.ui.ComboBox.prototype.defaultText_ = '';


***REMOVED***
***REMOVED*** Name for the input box created
***REMOVED*** @type {string}
***REMOVED*** @private
***REMOVED***
goog.ui.ComboBox.prototype.fieldName_ = '';


***REMOVED***
***REMOVED*** Timer identifier for delaying the dismissal of the combo menu.
***REMOVED*** @type {?number}
***REMOVED*** @private
***REMOVED***
goog.ui.ComboBox.prototype.dismissTimer_ = null;


***REMOVED***
***REMOVED*** True if the unicode inverted triangle should be displayed in the dropdown
***REMOVED*** button. Defaults to false.
***REMOVED*** @type {boolean} useDropdownArrow
***REMOVED*** @private
***REMOVED***
goog.ui.ComboBox.prototype.useDropdownArrow_ = false;


***REMOVED***
***REMOVED*** Create the DOM objects needed for the combo box.  A span and text input.
***REMOVED*** @override
***REMOVED***
goog.ui.ComboBox.prototype.createDom = function() {
  this.input_ = this.getDomHelper().createDom(
      'input', {name: this.fieldName_, type: 'text', autocomplete: 'off'});
  this.button_ = this.getDomHelper().createDom('span',
      goog.getCssName('goog-combobox-button'));
  this.setElementInternal(this.getDomHelper().createDom('span',
      goog.getCssName('goog-combobox'), this.input_, this.button_));
  if (this.useDropdownArrow_) {
    goog.dom.setTextContent(this.button_, '\u25BC');
    goog.style.setUnselectable(this.button_, true /* unselectable***REMOVED***);
  }
  this.input_.setAttribute('label', this.defaultText_);
  this.labelInput_.decorate(this.input_);
  this.menu_.setFocusable(false);
  if (!this.menu_.isInDocument()) {
    this.addChild(this.menu_, true);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Enables/Disables the combo box.
***REMOVED*** @param {boolean} enabled Whether to enable (true) or disable (false) the
***REMOVED***     combo box.
***REMOVED***
goog.ui.ComboBox.prototype.setEnabled = function(enabled) {
  this.enabled_ = enabled;
  this.labelInput_.setEnabled(enabled);
  goog.dom.classlist.enable(
      goog.asserts.assert(this.getElement()),
      goog.getCssName('goog-combobox-disabled'), !enabled);
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} Whether the menu item is enabled.
***REMOVED***
goog.ui.ComboBox.prototype.isEnabled = function() {
  return this.enabled_;
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.ui.ComboBox.prototype.enterDocument = function() {
  goog.ui.ComboBox.superClass_.enterDocument.call(this);

  var handler = this.getHandler();
  handler.listen(this.getElement(),
      goog.events.EventType.MOUSEDOWN, this.onComboMouseDown_);
  handler.listen(this.getDomHelper().getDocument(),
      goog.events.EventType.MOUSEDOWN, this.onDocClicked_);

  handler.listen(this.input_,
      goog.events.EventType.BLUR, this.onInputBlur_);

  this.keyHandler_ = new goog.events.KeyHandler(this.input_);
  handler.listen(this.keyHandler_,
      goog.events.KeyHandler.EventType.KEY, this.handleKeyEvent);

  this.inputHandler_ = new goog.events.InputHandler(this.input_);
  handler.listen(this.inputHandler_,
      goog.events.InputHandler.EventType.INPUT, this.onInputEvent_);

  handler.listen(this.menu_,
      goog.ui.Component.EventType.ACTION, this.onMenuSelected_);
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.ui.ComboBox.prototype.exitDocument = function() {
  this.keyHandler_.dispose();
  delete this.keyHandler_;
  this.inputHandler_.dispose();
  this.inputHandler_ = null;
  goog.ui.ComboBox.superClass_.exitDocument.call(this);
***REMOVED***


***REMOVED***
***REMOVED*** Combo box currently can't decorate elements.
***REMOVED*** @return {boolean} The value false.
***REMOVED*** @override
***REMOVED***
goog.ui.ComboBox.prototype.canDecorate = function() {
  return false;
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.ui.ComboBox.prototype.disposeInternal = function() {
  goog.ui.ComboBox.superClass_.disposeInternal.call(this);

  this.clearDismissTimer_();

  this.labelInput_.dispose();
  this.menu_.dispose();

  this.labelInput_ = null;
  this.menu_ = null;
  this.input_ = null;
  this.button_ = null;
***REMOVED***


***REMOVED***
***REMOVED*** Dismisses the menu and resets the value of the edit field.
***REMOVED***
goog.ui.ComboBox.prototype.dismiss = function() {
  this.clearDismissTimer_();
  this.hideMenu_();
  this.menu_.setHighlightedIndex(-1);
***REMOVED***


***REMOVED***
***REMOVED*** Adds a new menu item at the end of the menu.
***REMOVED*** @param {goog.ui.MenuItem} item Menu item to add to the menu.
***REMOVED***
goog.ui.ComboBox.prototype.addItem = function(item) {
  this.menu_.addChild(item, true);
  this.visibleCount_ = -1;
***REMOVED***


***REMOVED***
***REMOVED*** Adds a new menu item at a specific index in the menu.
***REMOVED*** @param {goog.ui.MenuItem} item Menu item to add to the menu.
***REMOVED*** @param {number} n Index at which to insert the menu item.
***REMOVED***
goog.ui.ComboBox.prototype.addItemAt = function(item, n) {
  this.menu_.addChildAt(item, n, true);
  this.visibleCount_ = -1;
***REMOVED***


***REMOVED***
***REMOVED*** Removes an item from the menu and disposes it.
***REMOVED*** @param {goog.ui.MenuItem} item The menu item to remove.
***REMOVED***
goog.ui.ComboBox.prototype.removeItem = function(item) {
  var child = this.menu_.removeChild(item, true);
  if (child) {
    child.dispose();
    this.visibleCount_ = -1;
  }
***REMOVED***


***REMOVED***
***REMOVED*** Remove all of the items from the ComboBox menu
***REMOVED***
goog.ui.ComboBox.prototype.removeAllItems = function() {
  for (var i = this.getItemCount() - 1; i >= 0; --i) {
    this.removeItem(this.getItemAt(i));
  }
***REMOVED***


***REMOVED***
***REMOVED*** Removes a menu item at a given index in the menu.
***REMOVED*** @param {number} n Index of item.
***REMOVED***
goog.ui.ComboBox.prototype.removeItemAt = function(n) {
  var child = this.menu_.removeChildAt(n, true);
  if (child) {
    child.dispose();
    this.visibleCount_ = -1;
  }
***REMOVED***


***REMOVED***
***REMOVED*** Returns a reference to the menu item at a given index.
***REMOVED*** @param {number} n Index of menu item.
***REMOVED*** @return {goog.ui.MenuItem?} Reference to the menu item.
***REMOVED***
goog.ui.ComboBox.prototype.getItemAt = function(n) {
  return***REMOVED*****REMOVED*** @type {goog.ui.MenuItem?}***REMOVED***(this.menu_.getChildAt(n));
***REMOVED***


***REMOVED***
***REMOVED*** Returns the number of items in the list, including non-visible items,
***REMOVED*** such as separators.
***REMOVED*** @return {number} Number of items in the menu for this combobox.
***REMOVED***
goog.ui.ComboBox.prototype.getItemCount = function() {
  return this.menu_.getChildCount();
***REMOVED***


***REMOVED***
***REMOVED*** @return {goog.ui.Menu} The menu that pops up.
***REMOVED***
goog.ui.ComboBox.prototype.getMenu = function() {
  return this.menu_;
***REMOVED***


***REMOVED***
***REMOVED*** @return {Element} The input element.
***REMOVED***
goog.ui.ComboBox.prototype.getInputElement = function() {
  return this.input_;
***REMOVED***


***REMOVED***
***REMOVED*** @return {goog.ui.LabelInput} A LabelInput control that manages the
***REMOVED***     focus/blur state of the input box.
***REMOVED***
goog.ui.ComboBox.prototype.getLabelInput = function() {
  return this.labelInput_;
***REMOVED***


***REMOVED***
***REMOVED*** @return {number} The number of visible items in the menu.
***REMOVED*** @private
***REMOVED***
goog.ui.ComboBox.prototype.getNumberOfVisibleItems_ = function() {
  if (this.visibleCount_ == -1) {
    var count = 0;
    for (var i = 0, n = this.menu_.getChildCount(); i < n; i++) {
      var item = this.menu_.getChildAt(i);
      if (!(item instanceof goog.ui.MenuSeparator) && item.isVisible()) {
        count++;
      }
    }
    this.visibleCount_ = count;
  }

  goog.log.info(this.logger_,
      'getNumberOfVisibleItems() - ' + this.visibleCount_);
  return this.visibleCount_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the match function to be used when filtering the combo box menu.
***REMOVED*** @param {Function} matchFunction The match function to be used when filtering
***REMOVED***     the combo box menu.
***REMOVED***
goog.ui.ComboBox.prototype.setMatchFunction = function(matchFunction) {
  this.matchFunction_ = matchFunction;
***REMOVED***


***REMOVED***
***REMOVED*** @return {Function} The match function for the combox box.
***REMOVED***
goog.ui.ComboBox.prototype.getMatchFunction = function() {
  return this.matchFunction_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the default text for the combo box.
***REMOVED*** @param {string} text The default text for the combo box.
***REMOVED***
goog.ui.ComboBox.prototype.setDefaultText = function(text) {
  this.defaultText_ = text;
  if (this.labelInput_) {
    this.labelInput_.setLabel(this.defaultText_);
  }
***REMOVED***


***REMOVED***
***REMOVED*** @return {string} text The default text for the combox box.
***REMOVED***
goog.ui.ComboBox.prototype.getDefaultText = function() {
  return this.defaultText_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the field name for the combo box.
***REMOVED*** @param {string} fieldName The field name for the combo box.
***REMOVED***
goog.ui.ComboBox.prototype.setFieldName = function(fieldName) {
  this.fieldName_ = fieldName;
***REMOVED***


***REMOVED***
***REMOVED*** @return {string} The field name for the combo box.
***REMOVED***
goog.ui.ComboBox.prototype.getFieldName = function() {
  return this.fieldName_;
***REMOVED***


***REMOVED***
***REMOVED*** Set to true if a unicode inverted triangle should be displayed in the
***REMOVED*** dropdown button.
***REMOVED*** This option defaults to false for backwards compatibility.
***REMOVED*** @param {boolean} useDropdownArrow True to use the dropdown arrow.
***REMOVED***
goog.ui.ComboBox.prototype.setUseDropdownArrow = function(useDropdownArrow) {
  this.useDropdownArrow_ = !!useDropdownArrow;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the current value of the combo box.
***REMOVED*** @param {string} value The new value.
***REMOVED***
goog.ui.ComboBox.prototype.setValue = function(value) {
  goog.log.info(this.logger_, 'setValue() - ' + value);
  if (this.labelInput_.getValue() != value) {
    this.labelInput_.setValue(value);
    this.handleInputChange_();
  }
***REMOVED***


***REMOVED***
***REMOVED*** @return {string} The current value of the combo box.
***REMOVED***
goog.ui.ComboBox.prototype.getValue = function() {
  return this.labelInput_.getValue();
***REMOVED***


***REMOVED***
***REMOVED*** @return {string} HTML escaped token.
***REMOVED***
goog.ui.ComboBox.prototype.getToken = function() {
  // TODO(user): Remove HTML escaping and fix the existing calls.
  return goog.string.htmlEscape(this.getTokenText_());
***REMOVED***


***REMOVED***
***REMOVED*** @return {string} The token for the current cursor position in the
***REMOVED***     input box, when multi-input is disabled it will be the full input value.
***REMOVED*** @private
***REMOVED***
goog.ui.ComboBox.prototype.getTokenText_ = function() {
  // TODO(user): Implement multi-input such that getToken returns a substring
  // of the whole input delimited by commas.
  return goog.string.trim(this.labelInput_.getValue().toLowerCase());
***REMOVED***


***REMOVED***
***REMOVED*** @private
***REMOVED***
goog.ui.ComboBox.prototype.setupMenu_ = function() {
  var sm = this.menu_;
  sm.setVisible(false);
  sm.setAllowAutoFocus(false);
  sm.setAllowHighlightDisabled(true);
***REMOVED***


***REMOVED***
***REMOVED*** Shows the menu if it isn't already showing.  Also positions the menu
***REMOVED*** correctly, resets the menu item visibilities and highlights the relevent
***REMOVED*** item.
***REMOVED*** @param {boolean} showAll Whether to show all items, with the first matching
***REMOVED***     item highlighted.
***REMOVED*** @private
***REMOVED***
goog.ui.ComboBox.prototype.maybeShowMenu_ = function(showAll) {
  var isVisible = this.menu_.isVisible();
  var numVisibleItems = this.getNumberOfVisibleItems_();

  if (isVisible && numVisibleItems == 0) {
    goog.log.fine(this.logger_, 'no matching items, hiding');
    this.hideMenu_();

  } else if (!isVisible && numVisibleItems > 0) {
    if (showAll) {
      goog.log.fine(this.logger_, 'showing menu');
      this.setItemVisibilityFromToken_('');
      this.setItemHighlightFromToken_(this.getTokenText_());
    }
    // In Safari 2.0, when clicking on the combox box, the blur event is
    // received after the click event that invokes this function. Since we want
    // to cancel the dismissal after the blur event is processed, we have to
    // wait for all event processing to happen.
    goog.Timer.callOnce(this.clearDismissTimer_, 1, this);

    this.showMenu_();
  }

  this.positionMenu();
***REMOVED***


***REMOVED***
***REMOVED*** Positions the menu.
***REMOVED*** @protected
***REMOVED***
goog.ui.ComboBox.prototype.positionMenu = function() {
  if (this.menu_ && this.menu_.isVisible()) {
    var position = new goog.positioning.MenuAnchoredPosition(this.getElement(),
        goog.positioning.Corner.BOTTOM_START, true);
    position.reposition(this.menu_.getElement(),
        goog.positioning.Corner.TOP_START);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Show the menu and add an active class to the combo box's element.
***REMOVED*** @private
***REMOVED***
goog.ui.ComboBox.prototype.showMenu_ = function() {
  this.menu_.setVisible(true);
  goog.dom.classlist.add(
      goog.asserts.assert(this.getElement()),
      goog.getCssName('goog-combobox-active'));
***REMOVED***


***REMOVED***
***REMOVED*** Hide the menu and remove the active class from the combo box's element.
***REMOVED*** @private
***REMOVED***
goog.ui.ComboBox.prototype.hideMenu_ = function() {
  this.menu_.setVisible(false);
  goog.dom.classlist.remove(
      goog.asserts.assert(this.getElement()),
      goog.getCssName('goog-combobox-active'));
***REMOVED***


***REMOVED***
***REMOVED*** Clears the dismiss timer if it's active.
***REMOVED*** @private
***REMOVED***
goog.ui.ComboBox.prototype.clearDismissTimer_ = function() {
  if (this.dismissTimer_) {
    goog.Timer.clear(this.dismissTimer_);
    this.dismissTimer_ = null;
  }
***REMOVED***


***REMOVED***
***REMOVED*** Event handler for when the combo box area has been clicked.
***REMOVED*** @param {goog.events.BrowserEvent} e The browser event.
***REMOVED*** @private
***REMOVED***
goog.ui.ComboBox.prototype.onComboMouseDown_ = function(e) {
  // We only want this event on the element itself or the input or the button.
  if (this.enabled_ &&
      (e.target == this.getElement() || e.target == this.input_ ||
       goog.dom.contains(this.button_,***REMOVED*****REMOVED*** @type {Node}***REMOVED*** (e.target)))) {
    if (this.menu_.isVisible()) {
      goog.log.fine(this.logger_, 'Menu is visible, dismissing');
      this.dismiss();
    } else {
      goog.log.fine(this.logger_, 'Opening dropdown');
      this.maybeShowMenu_(true);
      if (goog.userAgent.OPERA) {
        // select() doesn't focus <input> elements in Opera.
        this.input_.focus();
      }
      this.input_.select();
      this.menu_.setMouseButtonPressed(true);
      // Stop the click event from stealing focus
      e.preventDefault();
    }
  }
  // Stop the event from propagating outside of the combo box
  e.stopPropagation();
***REMOVED***


***REMOVED***
***REMOVED*** Event handler for when the document is clicked.
***REMOVED*** @param {goog.events.BrowserEvent} e The browser event.
***REMOVED*** @private
***REMOVED***
goog.ui.ComboBox.prototype.onDocClicked_ = function(e) {
  if (!goog.dom.contains(
      this.menu_.getElement(),***REMOVED*****REMOVED*** @type {Node}***REMOVED*** (e.target))) {
    goog.log.info(this.logger_, 'onDocClicked_() - dismissing immediately');
    this.dismiss();
  }
***REMOVED***


***REMOVED***
***REMOVED*** Handle the menu's select event.
***REMOVED*** @param {goog.events.Event} e The event.
***REMOVED*** @private
***REMOVED***
goog.ui.ComboBox.prototype.onMenuSelected_ = function(e) {
  goog.log.info(this.logger_, 'onMenuSelected_()');
  var item =***REMOVED*****REMOVED*** @type {!goog.ui.MenuItem}***REMOVED*** (e.target);
  // Stop propagation of the original event and redispatch to allow the menu
  // select to be cancelled at this level. i.e. if a menu item should cause
  // some behavior such as a user prompt instead of assigning the caption as
  // the value.
  if (this.dispatchEvent(new goog.ui.ItemEvent(
      goog.ui.Component.EventType.ACTION, this, item))) {
    var caption = item.getCaption();
    goog.log.fine(this.logger_,
        'Menu selection: ' + caption + '. Dismissing menu');
    if (this.labelInput_.getValue() != caption) {
      this.labelInput_.setValue(caption);
      this.dispatchEvent(goog.ui.Component.EventType.CHANGE);
    }
    this.dismiss();
  }
  e.stopPropagation();
***REMOVED***


***REMOVED***
***REMOVED*** Event handler for when the input box looses focus -- hide the menu
***REMOVED*** @param {goog.events.BrowserEvent} e The browser event.
***REMOVED*** @private
***REMOVED***
goog.ui.ComboBox.prototype.onInputBlur_ = function(e) {
  goog.log.info(this.logger_, 'onInputBlur_() - delayed dismiss');
  this.clearDismissTimer_();
  this.dismissTimer_ = goog.Timer.callOnce(
      this.dismiss, goog.ui.ComboBox.BLUR_DISMISS_TIMER_MS, this);
***REMOVED***


***REMOVED***
***REMOVED*** Handles keyboard events from the input box.  Returns true if the combo box
***REMOVED*** was able to handle the event, false otherwise.
***REMOVED*** @param {goog.events.KeyEvent} e Key event to handle.
***REMOVED*** @return {boolean} Whether the event was handled by the combo box.
***REMOVED*** @protected
***REMOVED*** @suppress {visibility} performActionInternal
***REMOVED***
goog.ui.ComboBox.prototype.handleKeyEvent = function(e) {
  var isMenuVisible = this.menu_.isVisible();

  // Give the menu a chance to handle the event.
  if (isMenuVisible && this.menu_.handleKeyEvent(e)) {
    return true;
  }

  // The menu is either hidden or didn't handle the event.
  var handled = false;
  switch (e.keyCode) {
    case goog.events.KeyCodes.ESC:
      // If the menu is visible and the user hit Esc, dismiss the menu.
      if (isMenuVisible) {
        goog.log.fine(this.logger_,
            'Dismiss on Esc: ' + this.labelInput_.getValue());
        this.dismiss();
        handled = true;
      }
      break;
    case goog.events.KeyCodes.TAB:
      // If the menu is open and an option is highlighted, activate it.
      if (isMenuVisible) {
        var highlighted = this.menu_.getHighlighted();
        if (highlighted) {
          goog.log.fine(this.logger_,
              'Select on Tab: ' + this.labelInput_.getValue());
          highlighted.performActionInternal(e);
          handled = true;
        }
      }
      break;
    case goog.events.KeyCodes.UP:
    case goog.events.KeyCodes.DOWN:
      // If the menu is hidden and the user hit the up/down arrow, show it.
      if (!isMenuVisible) {
        goog.log.fine(this.logger_, 'Up/Down - maybe show menu');
        this.maybeShowMenu_(true);
        handled = true;
      }
      break;
  }

  if (handled) {
    e.preventDefault();
  }

  return handled;
***REMOVED***


***REMOVED***
***REMOVED*** Handles the content of the input box changing.
***REMOVED*** @param {goog.events.Event} e The INPUT event to handle.
***REMOVED*** @private
***REMOVED***
goog.ui.ComboBox.prototype.onInputEvent_ = function(e) {
  // If the key event is text-modifying, update the menu.
  goog.log.fine(this.logger_,
      'Key is modifying: ' + this.labelInput_.getValue());
  this.handleInputChange_();
***REMOVED***


***REMOVED***
***REMOVED*** Handles the content of the input box changing, either because of user
***REMOVED*** interaction or programmatic changes.
***REMOVED*** @private
***REMOVED***
goog.ui.ComboBox.prototype.handleInputChange_ = function() {
  var token = this.getTokenText_();
  this.setItemVisibilityFromToken_(token);
  if (goog.dom.getActiveElement(this.getDomHelper().getDocument()) ==
      this.input_) {
    // Do not alter menu visibility unless the user focus is currently on the
    // combobox (otherwise programmatic changes may cause the menu to become
    // visible).
    this.maybeShowMenu_(false);
  }
  var highlighted = this.menu_.getHighlighted();
  if (token == '' || !highlighted || !highlighted.isVisible()) {
    this.setItemHighlightFromToken_(token);
  }
  this.lastToken_ = token;
  this.dispatchEvent(goog.ui.Component.EventType.CHANGE);
***REMOVED***


***REMOVED***
***REMOVED*** Loops through all menu items setting their visibility according to a token.
***REMOVED*** @param {string} token The token.
***REMOVED*** @private
***REMOVED***
goog.ui.ComboBox.prototype.setItemVisibilityFromToken_ = function(token) {
  goog.log.info(this.logger_, 'setItemVisibilityFromToken_() - ' + token);
  var isVisibleItem = false;
  var count = 0;
  var recheckHidden = !this.matchFunction_(token, this.lastToken_);

  for (var i = 0, n = this.menu_.getChildCount(); i < n; i++) {
    var item = this.menu_.getChildAt(i);
    if (item instanceof goog.ui.MenuSeparator) {
      // Ensure that separators are only shown if there is at least one visible
      // item before them.
      item.setVisible(isVisibleItem);
      isVisibleItem = false;
    } else if (item instanceof goog.ui.MenuItem) {
      if (!item.isVisible() && !recheckHidden) continue;

      var caption = item.getCaption();
      var visible = this.isItemSticky_(item) ||
          caption && this.matchFunction_(caption.toLowerCase(), token);
      if (typeof item.setFormatFromToken == 'function') {
        item.setFormatFromToken(token);
      }
      item.setVisible(!!visible);
      isVisibleItem = visible || isVisibleItem;

    } else {
      // Assume all other items are correctly using their visibility.
      isVisibleItem = item.isVisible() || isVisibleItem;
    }

    if (!(item instanceof goog.ui.MenuSeparator) && item.isVisible()) {
      count++;
    }
  }

  this.visibleCount_ = count;
***REMOVED***


***REMOVED***
***REMOVED*** Highlights the first token that matches the given token.
***REMOVED*** @param {string} token The token.
***REMOVED*** @private
***REMOVED***
goog.ui.ComboBox.prototype.setItemHighlightFromToken_ = function(token) {
  goog.log.info(this.logger_, 'setItemHighlightFromToken_() - ' + token);

  if (token == '') {
    this.menu_.setHighlightedIndex(-1);
    return;
  }

  for (var i = 0, n = this.menu_.getChildCount(); i < n; i++) {
    var item = this.menu_.getChildAt(i);
    var caption = item.getCaption();
    if (caption && this.matchFunction_(caption.toLowerCase(), token)) {
      this.menu_.setHighlightedIndex(i);
      if (item.setFormatFromToken) {
        item.setFormatFromToken(token);
      }
      return;
    }
  }
  this.menu_.setHighlightedIndex(-1);
***REMOVED***


***REMOVED***
***REMOVED*** Returns true if the item has an isSticky method and the method returns true.
***REMOVED*** @param {goog.ui.MenuItem} item The item.
***REMOVED*** @return {boolean} Whether the item has an isSticky method and the method
***REMOVED***     returns true.
***REMOVED*** @private
***REMOVED***
goog.ui.ComboBox.prototype.isItemSticky_ = function(item) {
  return typeof item.isSticky == 'function' && item.isSticky();
***REMOVED***



***REMOVED***
***REMOVED*** Class for combo box items.
***REMOVED*** @param {goog.ui.ControlContent} content Text caption or DOM structure to
***REMOVED***     display as the content of the item (use to add icons or styling to
***REMOVED***     menus).
***REMOVED*** @param {Object=} opt_data Identifying data for the menu item.
***REMOVED*** @param {goog.dom.DomHelper=} opt_domHelper Optional dom helper used for dom
***REMOVED***     interactions.
***REMOVED*** @param {goog.ui.MenuItemRenderer=} opt_renderer Optional renderer.
***REMOVED***
***REMOVED*** @extends {goog.ui.MenuItem}
***REMOVED***
goog.ui.ComboBoxItem = function(content, opt_data, opt_domHelper,
    opt_renderer) {
  goog.ui.MenuItem.call(this, content, opt_data, opt_domHelper, opt_renderer);
***REMOVED***
goog.inherits(goog.ui.ComboBoxItem, goog.ui.MenuItem);


// Register a decorator factory function for goog.ui.ComboBoxItems.
goog.ui.registry.setDecoratorByClassName(goog.getCssName('goog-combobox-item'),
    function() {
      // ComboBoxItem defaults to using MenuItemRenderer.
      return new goog.ui.ComboBoxItem(null);
    });


***REMOVED***
***REMOVED*** Whether the menu item is sticky, non-sticky items will be hidden as the
***REMOVED*** user types.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.ui.ComboBoxItem.prototype.isSticky_ = false;


***REMOVED***
***REMOVED*** Sets the menu item to be sticky or not sticky.
***REMOVED*** @param {boolean} sticky Whether the menu item should be sticky.
***REMOVED***
goog.ui.ComboBoxItem.prototype.setSticky = function(sticky) {
  this.isSticky_ = sticky;
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} Whether the menu item is sticky.
***REMOVED***
goog.ui.ComboBoxItem.prototype.isSticky = function() {
  return this.isSticky_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the format for a menu item based on a token, bolding the token.
***REMOVED*** @param {string} token The token.
***REMOVED***
goog.ui.ComboBoxItem.prototype.setFormatFromToken = function(token) {
  if (this.isEnabled()) {
    var caption = this.getCaption();
    var index = caption.toLowerCase().indexOf(token);
    if (index >= 0) {
      var domHelper = this.getDomHelper();
      this.setContent([
        domHelper.createTextNode(caption.substr(0, index)),
        domHelper.createDom('b', null, caption.substr(index, token.length)),
        domHelper.createTextNode(caption.substr(index + token.length))
      ]);
    }
  }
***REMOVED***
