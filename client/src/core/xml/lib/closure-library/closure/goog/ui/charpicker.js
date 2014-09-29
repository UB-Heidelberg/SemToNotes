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
***REMOVED*** @fileoverview Character Picker widget for picking any Unicode character.
***REMOVED***
***REMOVED*** @see ../demos/charpicker.html
***REMOVED***

goog.provide('goog.ui.CharPicker');

goog.require('goog.a11y.aria');
goog.require('goog.array');
goog.require('goog.asserts');
goog.require('goog.dom');
***REMOVED***
goog.require('goog.events.EventHandler');
***REMOVED***
goog.require('goog.events.InputHandler');
goog.require('goog.events.KeyHandler');
goog.require('goog.i18n.CharListDecompressor');
goog.require('goog.i18n.uChar');
goog.require('goog.i18n.uChar.NameFetcher');
goog.require('goog.structs.Set');
goog.require('goog.style');
goog.require('goog.ui.Button');
goog.require('goog.ui.Component');
goog.require('goog.ui.ContainerScroller');
goog.require('goog.ui.FlatButtonRenderer');
goog.require('goog.ui.HoverCard');
goog.require('goog.ui.LabelInput');
goog.require('goog.ui.Menu');
goog.require('goog.ui.MenuButton');
goog.require('goog.ui.MenuItem');
goog.require('goog.ui.Tooltip.ElementTooltipPosition');



***REMOVED***
***REMOVED*** Character Picker Class. This widget can be used to pick any Unicode
***REMOVED*** character by traversing a category-subcategory structure or by inputing its
***REMOVED*** hex value.
***REMOVED***
***REMOVED*** See charpicker.html demo for example usage.
***REMOVED*** @param {goog.i18n.CharPickerData} charPickerData Category names and charlist.
***REMOVED*** @param {!goog.i18n.uChar.NameFetcher} charNameFetcher Object which fetches
***REMOVED***     the names of the characters that are shown in the widget. These names
***REMOVED***     may be stored locally or come from an external source.
***REMOVED*** @param {Array.<string>=} opt_recents List of characters to be displayed in
***REMOVED***     resently selected characters area.
***REMOVED*** @param {number=} opt_initCategory Sequence number of initial category.
***REMOVED*** @param {number=} opt_initSubcategory Sequence number of initial subcategory.
***REMOVED*** @param {number=} opt_rowCount Number of rows in the grid.
***REMOVED*** @param {number=} opt_columnCount Number of columns in the grid.
***REMOVED*** @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper.
***REMOVED***
***REMOVED*** @extends {goog.ui.Component}
***REMOVED***
goog.ui.CharPicker = function(charPickerData, charNameFetcher, opt_recents,
                              opt_initCategory, opt_initSubcategory,
                              opt_rowCount, opt_columnCount, opt_domHelper) {
  goog.ui.Component.call(this, opt_domHelper);

 ***REMOVED*****REMOVED***
  ***REMOVED*** Object used to retrieve character names.
  ***REMOVED*** @type {!goog.i18n.uChar.NameFetcher}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.charNameFetcher_ = charNameFetcher;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Object containing character lists and category names.
  ***REMOVED*** @type {goog.i18n.CharPickerData}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.data_ = charPickerData;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The category number to be used on widget init.
  ***REMOVED*** @type {number}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.initCategory_ = opt_initCategory || 0;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The subcategory number to be used on widget init.
  ***REMOVED*** @type {number}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.initSubcategory_ = opt_initSubcategory || 0;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Number of columns in the grid.
  ***REMOVED*** @type {number}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.columnCount_ = opt_columnCount || 10;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Number of entries to be added to the grid.
  ***REMOVED*** @type {number}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.gridsize_ = (opt_rowCount || 10)***REMOVED*** this.columnCount_;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Number of the recently selected characters displayed.
  ***REMOVED*** @type {number}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.recentwidth_ = this.columnCount_ + 1;

 ***REMOVED*****REMOVED***
  ***REMOVED*** List of recently used characters.
  ***REMOVED*** @type {Array.<string>}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.recents_ = opt_recents || [];

 ***REMOVED*****REMOVED***
  ***REMOVED*** Handler for events.
  ***REMOVED*** @type {goog.events.EventHandler}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.eventHandler_ = new goog.events.EventHandler(this);

 ***REMOVED*****REMOVED***
  ***REMOVED*** Decompressor used to get the list of characters from a base88 encoded
  ***REMOVED*** character list.
  ***REMOVED*** @type {Object}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.decompressor_ = new goog.i18n.CharListDecompressor();
***REMOVED***
goog.inherits(goog.ui.CharPicker, goog.ui.Component);


***REMOVED***
***REMOVED*** The last selected character.
***REMOVED*** @type {?string}
***REMOVED*** @private
***REMOVED***
goog.ui.CharPicker.prototype.selectedChar_ = null;


***REMOVED***
***REMOVED*** Set of formatting characters whose display need to be swapped with nbsp
***REMOVED*** to prevent layout issues.
***REMOVED*** @type {goog.structs.Set}
***REMOVED*** @private
***REMOVED***
goog.ui.CharPicker.prototype.layoutAlteringChars_ = null;


***REMOVED***
***REMOVED*** The top category menu.
***REMOVED*** @type {goog.ui.Menu}
***REMOVED*** @private
***REMOVED***
goog.ui.CharPicker.prototype.menu_ = null;


***REMOVED***
***REMOVED*** The top category menu button.
***REMOVED*** @type {goog.ui.MenuButton}
***REMOVED*** @private
***REMOVED***
goog.ui.CharPicker.prototype.menubutton_ = null;


***REMOVED***
***REMOVED*** The subcategory menu.
***REMOVED*** @type {goog.ui.Menu}
***REMOVED*** @private
***REMOVED***
goog.ui.CharPicker.prototype.submenu_ = null;


***REMOVED***
***REMOVED*** The subcategory menu button.
***REMOVED*** @type {goog.ui.MenuButton}
***REMOVED*** @private
***REMOVED***
goog.ui.CharPicker.prototype.submenubutton_ = null;


***REMOVED***
***REMOVED*** The element representing the number of rows visible in the grid.
***REMOVED*** This along with goog.ui.CharPicker.stick_ would help to create a scrollbar
***REMOVED*** of right size.
***REMOVED*** @type {Element}
***REMOVED*** @private
***REMOVED***
goog.ui.CharPicker.prototype.stickwrap_ = null;


***REMOVED***
***REMOVED*** The component containing all the buttons for each character in display.
***REMOVED*** @type {goog.ui.Component}
***REMOVED*** @private
***REMOVED***
goog.ui.CharPicker.prototype.grid_ = null;


***REMOVED***
***REMOVED*** The component used for extra information about the character set displayed.
***REMOVED*** @type {goog.ui.Component}
***REMOVED*** @private
***REMOVED***
goog.ui.CharPicker.prototype.notice_ = null;


***REMOVED***
***REMOVED*** Grid displaying recently selected characters.
***REMOVED*** @type {goog.ui.Component}
***REMOVED*** @private
***REMOVED***
goog.ui.CharPicker.prototype.recentgrid_ = null;


***REMOVED***
***REMOVED*** Input field for entering the hex value of the character.
***REMOVED*** @type {goog.ui.Component}
***REMOVED*** @private
***REMOVED***
goog.ui.CharPicker.prototype.input_ = null;


***REMOVED***
***REMOVED*** OK button for entering hex value of the character.
***REMOVED*** @type {goog.ui.Component}
***REMOVED*** @private
***REMOVED***
goog.ui.CharPicker.prototype.okbutton_ = null;


***REMOVED***
***REMOVED*** Element displaying character name in preview.
***REMOVED*** @type {Element}
***REMOVED*** @private
***REMOVED***
goog.ui.CharPicker.prototype.charNameEl_ = null;


***REMOVED***
***REMOVED*** Element displaying character in preview.
***REMOVED*** @type {Element}
***REMOVED*** @private
***REMOVED***
goog.ui.CharPicker.prototype.zoomEl_ = null;


***REMOVED***
***REMOVED*** Element displaying character number (codepoint) in preview.
***REMOVED*** @type {Element}
***REMOVED*** @private
***REMOVED***
goog.ui.CharPicker.prototype.unicodeEl_ = null;


***REMOVED***
***REMOVED*** Hover card for displaying the preview of a character.
***REMOVED*** Preview would contain character in large size and its U+ notation. It would
***REMOVED*** also display the name, if available.
***REMOVED*** @type {goog.ui.HoverCard}
***REMOVED*** @private
***REMOVED***
goog.ui.CharPicker.prototype.hc_ = null;


***REMOVED***
***REMOVED*** Gets the last selected character.
***REMOVED*** @return {?string} The last selected character.
***REMOVED***
goog.ui.CharPicker.prototype.getSelectedChar = function() {
  return this.selectedChar_;
***REMOVED***


***REMOVED***
***REMOVED*** Gets the list of characters user selected recently.
***REMOVED*** @return {Array.<string>} The recent character list.
***REMOVED***
goog.ui.CharPicker.prototype.getRecentChars = function() {
  return this.recents_;
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.ui.CharPicker.prototype.createDom = function() {
  goog.ui.CharPicker.superClass_.createDom.call(this);

  this.decorateInternal(this.getDomHelper().createElement('div'));
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.ui.CharPicker.prototype.disposeInternal = function() {
  goog.dispose(this.hc_);
  this.hc_ = null;
  goog.dispose(this.eventHandler_);
  this.eventHandler_ = null;
  goog.ui.CharPicker.superClass_.disposeInternal.call(this);
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.ui.CharPicker.prototype.decorateInternal = function(element) {
  goog.ui.CharPicker.superClass_.decorateInternal.call(this, element);

  // The chars below cause layout disruption or too narrow to hover:
  // \u0020, \u00AD, \u2000 - \u200f, \u2028 - \u202f, \u3000, \ufeff
  var chrs = this.decompressor_.toCharList(':2%C^O80V1H2s2G40Q%s0');
  this.layoutAlteringChars_ = new goog.structs.Set(chrs);

  this.menu_ = new goog.ui.Menu();

  var categories = this.data_.categories;
  for (var i = 0; i < this.data_.categories.length; i++) {
    this.menu_.addChild(this.createMenuItem_(i, categories[i]), true);
  }

  this.menubutton_ = new goog.ui.MenuButton('Category Menu', this.menu_);
  this.addChild(this.menubutton_, true);

  this.submenu_ = new goog.ui.Menu();

  this.submenubutton_ = new goog.ui.MenuButton('Subcategory Menu',
      this.submenu_);
  this.addChild(this.submenubutton_, true);

  // The containing component for grid component and the scroller.
  var gridcontainer = new goog.ui.Component();
  this.addChild(gridcontainer, true);

  var stickwrap = new goog.ui.Component();
  gridcontainer.addChild(stickwrap, true);
  this.stickwrap_ = stickwrap.getElement();

  var stick = new goog.ui.Component();
  stickwrap.addChild(stick, true);
  this.stick_ = stick.getElement();

  this.grid_ = new goog.ui.Component();
  gridcontainer.addChild(this.grid_, true);

  this.notice_ = new goog.ui.Component();
  this.notice_.setElementInternal(goog.dom.createDom('div'));
  this.addChild(this.notice_, true);

  // The component used for displaying 'Recent Selections' label.
 ***REMOVED*****REMOVED***
  ***REMOVED*** @desc The text label above the list of recently selected characters.
 ***REMOVED*****REMOVED***
  var MSG_CHAR_PICKER_RECENT_SELECTIONS = goog.getMsg('Recent Selections:');
  var recenttext = new goog.ui.Component();
  recenttext.setElementInternal(goog.dom.createDom('span', null,
      MSG_CHAR_PICKER_RECENT_SELECTIONS));
  this.addChild(recenttext, true);

  this.recentgrid_ = new goog.ui.Component();
  this.addChild(this.recentgrid_, true);

  // The component used for displaying 'U+'.
  var uplus = new goog.ui.Component();
  uplus.setElementInternal(goog.dom.createDom('span', null, 'U+'));
  this.addChild(uplus, true);

 ***REMOVED*****REMOVED***
  ***REMOVED*** @desc The text inside the input box to specify the hex code of a character.
 ***REMOVED*****REMOVED***
  var MSG_CHAR_PICKER_HEX_INPUT = goog.getMsg('Hex Input');
  this.input_ = new goog.ui.LabelInput(MSG_CHAR_PICKER_HEX_INPUT);
  this.addChild(this.input_, true);

  this.okbutton_ = new goog.ui.Button('OK');
  this.addChild(this.okbutton_, true);
  this.okbutton_.setEnabled(false);

  this.zoomEl_ = goog.dom.createDom('div',
      {id: 'zoom', className: goog.getCssName('goog-char-picker-char-zoom')});

  this.charNameEl_ = goog.dom.createDom('div',
      {id: 'charName', className: goog.getCssName('goog-char-picker-name')});

  this.unicodeEl_ = goog.dom.createDom('div',
      {id: 'unicode', className: goog.getCssName('goog-char-picker-unicode')});

  var card = goog.dom.createDom('div', {'id': 'preview'}, this.zoomEl_,
      this.charNameEl_, this.unicodeEl_);
  goog.style.showElement(card, false);
  this.hc_ = new goog.ui.HoverCard({'DIV': 'char'});
  this.hc_.setElement(card);
***REMOVED***

 ***REMOVED*****REMOVED***
  ***REMOVED*** Function called by hover card just before it is visible to collect data.
 ***REMOVED*****REMOVED***
  function onBeforeShow() {
    var trigger = self.hc_.getAnchorElement();
    var ch = self.getChar_(trigger);
    if (ch) {
      self.zoomEl_.innerHTML = self.displayChar_(ch);
      self.unicodeEl_.innerHTML = goog.i18n.uChar.toHexString(ch);
      // Clear the character name since we don't want to show old data because
      // it is retrieved asynchronously and the DOM object is re-used
      self.charNameEl_.innerHTML = '';
      self.charNameFetcher_.getName(ch, function(charName) {
        if (charName) {
          self.charNameEl_.innerHTML = charName;
        }
      });
    }
  }

***REMOVED***this.hc_, goog.ui.HoverCard.EventType.BEFORE_SHOW,
                     onBeforeShow);

  goog.dom.classes.add(element, goog.getCssName('goog-char-picker'));
  goog.dom.classes.add(this.stick_, goog.getCssName('goog-stick'));
  goog.dom.classes.add(this.stickwrap_, goog.getCssName('goog-stickwrap'));
  goog.dom.classes.add(gridcontainer.getElement(),
      goog.getCssName('goog-char-picker-grid-container'));
  goog.dom.classes.add(this.grid_.getElement(),
      goog.getCssName('goog-char-picker-grid'));
  goog.dom.classes.add(this.recentgrid_.getElement(),
      goog.getCssName('goog-char-picker-grid'));
  goog.dom.classes.add(this.recentgrid_.getElement(),
      goog.getCssName('goog-char-picker-recents'));

  goog.dom.classes.add(this.notice_.getElement(),
      goog.getCssName('goog-char-picker-notice'));
  goog.dom.classes.add(uplus.getElement(),
      goog.getCssName('goog-char-picker-uplus'));
  goog.dom.classes.add(this.input_.getElement(),
      goog.getCssName('goog-char-picker-input-box'));
  goog.dom.classes.add(this.okbutton_.getElement(),
      goog.getCssName('goog-char-picker-okbutton'));
  goog.dom.classes.add(card, goog.getCssName('goog-char-picker-hovercard'));
  this.hc_.className = goog.getCssName('goog-char-picker-hovercard');

  this.grid_.buttoncount = this.gridsize_;
  this.recentgrid_.buttoncount = this.recentwidth_;
  this.populateGridWithButtons_(this.grid_);
  this.populateGridWithButtons_(this.recentgrid_);

  this.updateGrid_(this.recentgrid_, this.recents_);
  this.setSelectedCategory_(this.initCategory_, this.initSubcategory_);
  new goog.ui.ContainerScroller(this.menu_);
  new goog.ui.ContainerScroller(this.submenu_);

  goog.dom.classes.add(this.menu_.getElement(),
      goog.getCssName('goog-char-picker-menu'));
  goog.dom.classes.add(this.submenu_.getElement(),
      goog.getCssName('goog-char-picker-menu'));
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.ui.CharPicker.prototype.enterDocument = function() {
  goog.ui.CharPicker.superClass_.enterDocument.call(this);
  var inputkh = new goog.events.InputHandler(this.input_.getElement());
  this.keyHandler_ = new goog.events.KeyHandler(this.input_.getElement());

  // Stop the propagation of ACTION events at menu and submenu buttons.
  // If stopped at capture phase, the button will not be set to normal state.
  // If not stopped, the user widget will receive the event, which is
  // undesired. User widget should receive an event only on the character
  // click.
  this.eventHandler_.
      listen(
          this.menubutton_,
          goog.ui.Component.EventType.ACTION,
          goog.events.Event.stopPropagation).
      listen(
          this.submenubutton_,
          goog.ui.Component.EventType.ACTION,
          goog.events.Event.stopPropagation).
      listen(
          this,
          goog.ui.Component.EventType.ACTION,
          this.handleSelectedItem_,
          true).
      listen(
          inputkh,
          goog.events.InputHandler.EventType.INPUT,
          this.handleInput_).
      listen(
          this.keyHandler_,
          goog.events.KeyHandler.EventType.KEY,
          this.handleEnter_).
      listen(
          this.recentgrid_,
          goog.ui.Component.EventType.FOCUS,
          this.handleFocus_).
      listen(
          this.grid_,
          goog.ui.Component.EventType.FOCUS,
          this.handleFocus_);

***REMOVED***this.okbutton_.getElement(),
      goog.events.EventType.MOUSEDOWN, this.handleOkClick_, true, this);

***REMOVED***this.stickwrap_, goog.events.EventType.SCROLL,
      this.handleScroll_, true, this);
***REMOVED***


***REMOVED***
***REMOVED*** Handles the button focus by updating the aria label with the character name
***REMOVED*** so it becomes possible to get spoken feedback while tabbing through the
***REMOVED*** visible symbols.
***REMOVED*** @param {goog.events.Event} e The focus event.
***REMOVED*** @private
***REMOVED***
goog.ui.CharPicker.prototype.handleFocus_ = function(e) {
  var button = e.target;
  var element = button.getElement();
  var ch = this.getChar_(element);

  // Clear the aria label to avoid speaking the old value in case the button
  // element has no char attribute or the character name cannot be retrieved.
  goog.a11y.aria.setState(element, goog.a11y.aria.State.LABEL, '');

  if (ch) {
    // This is working with screen readers because the call to getName is
    // synchronous once the values have been prefetched by the RemoteNameFetcher
    // and because it is always synchronous when using the LocalNameFetcher.
    // Also, the special character itself is not used as the label because some
    // screen readers, notably ChromeVox, are not able to speak them.
    // TODO(user): Consider changing the NameFetcher API to provide a
    // method that lets the caller retrieve multiple character names at once
    // so that this asynchronous gymnastic can be avoided.
    this.charNameFetcher_.getName(ch, function(charName) {
      if (charName) {
        goog.a11y.aria.setState(
            element, goog.a11y.aria.State.LABEL, charName);
      }
    });
  }
***REMOVED***


***REMOVED***
***REMOVED*** On scroll, updates the grid with characters correct to the scroll position.
***REMOVED*** @param {goog.events.Event} e Scroll event to handle.
***REMOVED*** @private
***REMOVED***
goog.ui.CharPicker.prototype.handleScroll_ = function(e) {
  var height = e.target.scrollHeight;
  var top = e.target.scrollTop;
  var itempos = Math.ceil(top***REMOVED*** this.items.length / (this.columnCount_***REMOVED***
      height))***REMOVED*** this.columnCount_;
  if (this.itempos != itempos) {
    this.itempos = itempos;
    this.modifyGridWithItems_(this.grid_, this.items, itempos);
  }
  e.stopPropagation();
***REMOVED***


***REMOVED***
***REMOVED*** On a menu click, sets correct character set in the grid; on a grid click
***REMOVED*** accept the character as the selected one and adds to recent selection, if not
***REMOVED*** already present.
***REMOVED*** @param {goog.events.Event} e Event for the click on menus or grid.
***REMOVED*** @private
***REMOVED***
goog.ui.CharPicker.prototype.handleSelectedItem_ = function(e) {
  if (e.target.getParent() == this.menu_) {
    this.menu_.setVisible(false);
    this.setSelectedCategory_(e.target.getValue());
  } else if (e.target.getParent() == this.submenu_) {
    this.submenu_.setVisible(false);
    this.setSelectedSubcategory_(e.target.getValue());
  } else if (e.target.getParent() == this.grid_) {
    var button = e.target.getElement();
    this.selectedChar_ = this.getChar_(button);
    this.updateRecents_(this.selectedChar_);
  } else if (e.target.getParent() == this.recentgrid_) {
    this.selectedChar_ = this.getChar_(e.target.getElement());
  }
***REMOVED***


***REMOVED***
***REMOVED*** When user types the characters displays the preview. Enables the OK button,
***REMOVED*** if the character is valid.
***REMOVED*** @param {goog.events.Event} e Event for typing in input field.
***REMOVED*** @private
***REMOVED***
goog.ui.CharPicker.prototype.handleInput_ = function(e) {
  var ch = this.getInputChar();
  if (ch) {
    var unicode = goog.i18n.uChar.toHexString(ch);
    this.zoomEl_.innerHTML = ch;
    this.unicodeEl_.innerHTML = unicode;
    this.charNameEl_.innerHTML = '';
    var coord =
        new goog.ui.Tooltip.ElementTooltipPosition(this.input_.getElement());
    this.hc_.setPosition(coord);
    this.hc_.triggerForElement(this.input_.getElement());
    this.okbutton_.setEnabled(true);
  } else {
    this.hc_.cancelTrigger();
    this.hc_.setVisible(false);
    this.okbutton_.setEnabled(false);
  }
***REMOVED***


***REMOVED***
***REMOVED*** On OK click accepts the character and updates the recent char list.
***REMOVED*** @param {goog.events.Event=} opt_event Event for click on OK button.
***REMOVED*** @return {boolean} Indicates whether to propagate event.
***REMOVED*** @private
***REMOVED***
goog.ui.CharPicker.prototype.handleOkClick_ = function(opt_event) {
  var ch = this.getInputChar();
  if (ch && ch.charCodeAt(0)) {
    this.selectedChar_ = ch;
    this.updateRecents_(ch);
    return true;
  }
  return false;
***REMOVED***


***REMOVED***
***REMOVED*** Behaves exactly like the OK button on Enter key.
***REMOVED*** @param {goog.events.KeyEvent} e Event for enter on the input field.
***REMOVED*** @return {boolean} Indicates whether to propagate event.
***REMOVED*** @private
***REMOVED***
goog.ui.CharPicker.prototype.handleEnter_ = function(e) {
  if (e.keyCode == goog.events.KeyCodes.ENTER) {
    return this.handleOkClick_() ?
        this.dispatchEvent(goog.ui.Component.EventType.ACTION) : false;
  }
  return false;
***REMOVED***


***REMOVED***
***REMOVED*** Gets the character from the event target.
***REMOVED*** @param {Element} e Event target containing the 'char' attribute.
***REMOVED*** @return {string} The character specified in the event.
***REMOVED*** @private
***REMOVED***
goog.ui.CharPicker.prototype.getChar_ = function(e) {
  return e.getAttribute('char');
***REMOVED***


***REMOVED***
***REMOVED*** Creates a menu entry for either the category listing or subcategory listing.
***REMOVED*** @param {number} id Id to be used for the entry.
***REMOVED*** @param {string} caption Text displayed for the menu item.
***REMOVED*** @return {goog.ui.MenuItem} Menu item to be added to the menu listing.
***REMOVED*** @private
***REMOVED***
goog.ui.CharPicker.prototype.createMenuItem_ = function(id, caption) {
  var item = new goog.ui.MenuItem(caption);
  item.setValue(id);
  item.setVisible(true);
  return item;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the category and updates the submenu items and grid accordingly.
***REMOVED*** @param {number} category Category index used to index the data tables.
***REMOVED*** @param {number=} opt_subcategory Subcategory index used with category index.
***REMOVED*** @private
***REMOVED***
goog.ui.CharPicker.prototype.setSelectedCategory_ = function(category,
                                                             opt_subcategory) {
  this.category = category;
  this.menubutton_.setCaption(this.data_.categories[category]);
  while (this.submenu_.hasChildren()) {
    this.submenu_.removeChildAt(0, true).dispose();
  }

  var subcategories = this.data_.subcategories[category];
  var charList = this.data_.charList[category];
  for (var i = 0; i < subcategories.length; i++) {
    var subtitle = charList[i].length == 0;
    var item = this.createMenuItem_(i, subcategories[i]);
    this.submenu_.addChild(item, true);
  }
  this.setSelectedSubcategory_(opt_subcategory || 0);
***REMOVED***


***REMOVED***
***REMOVED*** Sets the subcategory and updates the grid accordingly.
***REMOVED*** @param {number} subcategory Sub-category index used to index the data tables.
***REMOVED*** @private
***REMOVED***
goog.ui.CharPicker.prototype.setSelectedSubcategory_ = function(subcategory) {
  var subcategories = this.data_.subcategories;
  var name = subcategories[this.category][subcategory];
  this.submenubutton_.setCaption(name);
  this.setSelectedGrid_(this.category, subcategory);
***REMOVED***


***REMOVED***
***REMOVED*** Updates the grid according to a given category and subcategory.
***REMOVED*** @param {number} category Index to the category table.
***REMOVED*** @param {number} subcategory Index to the subcategory table.
***REMOVED*** @private
***REMOVED***
goog.ui.CharPicker.prototype.setSelectedGrid_ = function(category,
    subcategory) {
  var charLists = this.data_.charList;
  var charListStr = charLists[category][subcategory];
  var content = this.decompressor_.toCharList(charListStr);
  this.charNameFetcher_.prefetch(charListStr);
  this.updateGrid_(this.grid_, content);
***REMOVED***


***REMOVED***
***REMOVED*** Updates the grid with new character list.
***REMOVED*** @param {goog.ui.Component} grid The grid which is updated with a new set of
***REMOVED***     characters.
***REMOVED*** @param {Array.<string>} items Characters to be added to the grid.
***REMOVED*** @private
***REMOVED***
goog.ui.CharPicker.prototype.updateGrid_ = function(grid, items) {
  if (grid == this.grid_) {
   ***REMOVED*****REMOVED***
    ***REMOVED*** @desc The message used when there are invisible characters like space
    ***REMOVED***     or format control characters.
   ***REMOVED*****REMOVED***
    var MSG_PLEASE_HOVER =
        goog.getMsg('Please hover over each cell for the character name.');

    this.notice_.getElement().innerHTML =
        this.charNameFetcher_.isNameAvailable(items[0]) ? MSG_PLEASE_HOVER : '';
    this.items = items;
    if (this.stickwrap_.offsetHeight > 0) {
      this.stick_.style.height =
          this.stickwrap_.offsetHeight***REMOVED*** items.length / this.gridsize_ + 'px';
    } else {
      // This is the last ditch effort if height is not avaialble.
      // Maximum of 3em is assumed to the the cell height. Extra space after
      // last character in the grid is OK.
      this.stick_.style.height = 3***REMOVED*** this.columnCount_***REMOVED*** items.length /
          this.gridsize_ + 'em';
    }
    this.stickwrap_.scrollTop = 0;
  }

  this.modifyGridWithItems_(grid, items, 0);
***REMOVED***


***REMOVED***
***REMOVED*** Updates the grid with new character list for a given starting point.
***REMOVED*** @param {goog.ui.Component} grid The grid which is updated with a new set of
***REMOVED***     characters.
***REMOVED*** @param {Array.<string>} items Characters to be added to the grid.
***REMOVED*** @param {number} start The index from which the characters should be
***REMOVED***     displayed.
***REMOVED*** @private
***REMOVED***
goog.ui.CharPicker.prototype.modifyGridWithItems_ = function(grid, items,
    start) {
  for (var buttonpos = 0, itempos = start;
       buttonpos < grid.buttoncount && itempos < items.length;
       buttonpos++, itempos++) {
    this.modifyCharNode_(grid.getChildAt(buttonpos), items[itempos]);
  }

  for (; buttonpos < grid.buttoncount; buttonpos++) {
    grid.getChildAt(buttonpos).setVisible(false);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Creates the grid for characters to displayed for selection.
***REMOVED*** @param {goog.ui.Component} grid The grid which is updated with a new set of
***REMOVED***     characters.
***REMOVED*** @private
***REMOVED***
goog.ui.CharPicker.prototype.populateGridWithButtons_ = function(grid) {
  for (var i = 0; i < grid.buttoncount; i++) {
    var button = new goog.ui.Button(' ',
                                    goog.ui.FlatButtonRenderer.getInstance());

    // Dispatch the focus event so we can update the aria description while
    // the user tabs through the cells.
    button.setDispatchTransitionEvents(goog.ui.Component.State.FOCUSED, true);

    grid.addChild(button, true);
    button.setVisible(false);

    var buttonEl = button.getElement();
    goog.asserts.assert(buttonEl, 'The button DOM element cannot be null.');

    // Override the button role so the user doesn't hear "button" each time he
    // tabs through the cells.
    goog.a11y.aria.setRole(buttonEl, '');
  }
***REMOVED***


***REMOVED***
***REMOVED*** Updates the grid cell with new character.
***REMOVED*** @param {goog.ui.Component} button This button is proped up for new character.
***REMOVED*** @param {string} ch Character to be displayed by the button.
***REMOVED*** @private
***REMOVED***
goog.ui.CharPicker.prototype.modifyCharNode_ = function(button, ch) {
  var text = this.displayChar_(ch);
  var buttonEl = button.getElement();
  buttonEl.innerHTML = text;
  buttonEl.setAttribute('char', ch);
  button.setVisible(true);
***REMOVED***


***REMOVED***
***REMOVED*** Adds a given character to the recent character list.
***REMOVED*** @param {string} character Character to be added to the recent list.
***REMOVED*** @private
***REMOVED***
goog.ui.CharPicker.prototype.updateRecents_ = function(character) {
  if (character && character.charCodeAt(0) &&
      !goog.array.contains(this.recents_, character)) {
    this.recents_.unshift(character);
    if (this.recents_.length > this.recentwidth_) {
      this.recents_.pop();
    }
    this.updateGrid_(this.recentgrid_, this.recents_);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Gets the user inputed unicode character.
***REMOVED*** @return {string} Unicode character inputed by user.
***REMOVED***
goog.ui.CharPicker.prototype.getInputChar = function() {
  var text = this.input_.getValue();
  var code = parseInt(text, 16);
  return***REMOVED*****REMOVED*** @type {string}***REMOVED*** (goog.i18n.uChar.fromCharCode(code));
***REMOVED***


***REMOVED***
***REMOVED*** Gets the display character for the given character.
***REMOVED*** @param {string} ch Character whose display is fetched.
***REMOVED*** @return {string} The display of the given character.
***REMOVED*** @private
***REMOVED***
goog.ui.CharPicker.prototype.displayChar_ = function(ch) {
  return this.layoutAlteringChars_.contains(ch) ? '\u00A0' : ch;
***REMOVED***
