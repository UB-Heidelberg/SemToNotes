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
***REMOVED*** @fileoverview Factory functions for creating a default editing toolbar.
***REMOVED***
***REMOVED*** @author attila@google.com (Attila Bodis)
***REMOVED*** @author jparent@google.com (Julie Parent)
***REMOVED*** @see ../../demos/editor/editor.html
***REMOVED***

goog.provide('goog.ui.editor.DefaultToolbar');

goog.require('goog.dom');
goog.require('goog.dom.TagName');
goog.require('goog.dom.classes');
goog.require('goog.editor.Command');
goog.require('goog.style');
goog.require('goog.ui.ControlContent');
goog.require('goog.ui.editor.ToolbarFactory');
goog.require('goog.ui.editor.messages');

// Font menu creation.


***REMOVED*** @desc Font menu item caption for the default sans-serif font.***REMOVED***
goog.ui.editor.DefaultToolbar.MSG_FONT_NORMAL = goog.getMsg('Normal');


***REMOVED*** @desc Font menu item caption for the default serif font.***REMOVED***
goog.ui.editor.DefaultToolbar.MSG_FONT_NORMAL_SERIF =
    goog.getMsg('Normal / serif');


***REMOVED***
***REMOVED*** Common font descriptors for all locales.  Each descriptor has the following
***REMOVED*** attributes:
***REMOVED*** <ul>
***REMOVED***   <li>{@code caption} - Caption to show in the font menu (e.g. 'Tahoma')
***REMOVED***   <li>{@code value} - Value for the corresponding 'font-family' CSS style
***REMOVED***       (e.g. 'Tahoma, Arial, sans-serif')
***REMOVED*** </ul>
***REMOVED*** @type {!Array.<{caption:string, value:string}>}
***REMOVED*** @private
***REMOVED***
goog.ui.editor.DefaultToolbar.FONTS_ = [
  {
    caption: goog.ui.editor.DefaultToolbar.MSG_FONT_NORMAL,
    value: 'arial,sans-serif'
  },
  {
    caption: goog.ui.editor.DefaultToolbar.MSG_FONT_NORMAL_SERIF,
    value: 'times new roman,serif'
  },
  {caption: 'Courier New', value: 'courier new,monospace'},
  {caption: 'Georgia', value: 'georgia,serif'},
  {caption: 'Trebuchet', value: 'trebuchet ms,sans-serif'},
  {caption: 'Verdana', value: 'verdana,sans-serif'}
];


***REMOVED***
***REMOVED*** Locale-specific font descriptors.  The object is a map of locale strings to
***REMOVED*** arrays of font descriptors.
***REMOVED*** @type {!Object.<!Array.<{caption:string, value:string}>>}
***REMOVED*** @private
***REMOVED***
goog.ui.editor.DefaultToolbar.I18N_FONTS_ = {
  'ja': [{
    caption: '\uff2d\uff33 \uff30\u30b4\u30b7\u30c3\u30af',
    value: 'ms pgothic,sans-serif'
  }, {
    caption: '\uff2d\uff33 \uff30\u660e\u671d',
    value: 'ms pmincho,serif'
  }, {
    caption: '\uff2d\uff33 \u30b4\u30b7\u30c3\u30af',
    value: 'ms gothic,monospace'
  }],
  'ko': [{
    caption: '\uad74\ub9bc',
    value: 'gulim,sans-serif'
  }, {
    caption: '\ubc14\ud0d5',
    value: 'batang,serif'
  }, {
    caption: '\uad74\ub9bc\uccb4',
    value: 'gulimche,monospace'
  }],
  'zh-tw': [{
    caption: '\u65b0\u7d30\u660e\u9ad4',
    value: 'pmingliu,serif'
  }, {
    caption: '\u7d30\u660e\u9ad4',
    value: 'mingliu,serif'
  }],
  'zh-cn': [{
    caption: '\u5b8b\u4f53',
    value: 'simsun,serif'
  }, {
    caption: '\u9ed1\u4f53',
    value: 'simhei,sans-serif'
  }, {
    caption: 'MS Song',
    value: 'ms song,monospace'
  }]
***REMOVED***


***REMOVED***
***REMOVED*** Default locale for font names.
***REMOVED*** @type {string}
***REMOVED*** @private
***REMOVED***
goog.ui.editor.DefaultToolbar.locale_ = 'en-us';


***REMOVED***
***REMOVED*** Sets the locale for the font names.  If not set, defaults to 'en-us'.
***REMOVED*** Used only for default creation of font names name.  Must be set
***REMOVED*** before font name menu is created.
***REMOVED*** @param {string} locale Locale to use for the toolbar font names.
***REMOVED***
goog.ui.editor.DefaultToolbar.setLocale = function(locale) {
  goog.ui.editor.DefaultToolbar.locale_ = locale;
***REMOVED***


***REMOVED***
***REMOVED*** Initializes the given font menu button by adding default fonts to the menu.
***REMOVED*** If goog.ui.editor.DefaultToolbar.setLocale was called to specify a locale
***REMOVED*** for which locale-specific default fonts exist, those are added before
***REMOVED*** common fonts.
***REMOVED*** @param {!goog.ui.Select} button Font menu button.
***REMOVED***
goog.ui.editor.DefaultToolbar.addDefaultFonts = function(button) {
  // Normalize locale to lowercase, with a hyphen (see bug 1036165).
  var locale =
      goog.ui.editor.DefaultToolbar.locale_.replace(/_/, '-').toLowerCase();
  // Add locale-specific default fonts, if any.
  var fontlist = [];

  if (locale in goog.ui.editor.DefaultToolbar.I18N_FONTS_) {
     fontlist = goog.ui.editor.DefaultToolbar.I18N_FONTS_[locale];
  }
  if (fontlist.length) {
    goog.ui.editor.ToolbarFactory.addFonts(button, fontlist);
  }
  // Add locale-independent default fonts.
  goog.ui.editor.ToolbarFactory.addFonts(button,
      goog.ui.editor.DefaultToolbar.FONTS_);
***REMOVED***


// Font size menu creation.


***REMOVED*** @desc Font size menu item caption for the 'Small' size.***REMOVED***
goog.ui.editor.DefaultToolbar.MSG_FONT_SIZE_SMALL = goog.getMsg('Small');


***REMOVED*** @desc Font size menu item caption for the 'Normal' size.***REMOVED***
goog.ui.editor.DefaultToolbar.MSG_FONT_SIZE_NORMAL = goog.getMsg('Normal');


***REMOVED*** @desc Font size menu item caption for the 'Large' size.***REMOVED***
goog.ui.editor.DefaultToolbar.MSG_FONT_SIZE_LARGE = goog.getMsg('Large');


***REMOVED*** @desc Font size menu item caption for the 'Huge' size.***REMOVED***
goog.ui.editor.DefaultToolbar.MSG_FONT_SIZE_HUGE = goog.getMsg('Huge');


***REMOVED***
***REMOVED*** Font size descriptors, each with the following attributes:
***REMOVED*** <ul>
***REMOVED***   <li>{@code caption} - Caption to show in the font size menu (e.g. 'Huge')
***REMOVED***   <li>{@code value} - Value for the corresponding HTML font size (e.g. 6)
***REMOVED*** </ul>
***REMOVED*** @type {!Array.<{caption:string, value:number}>}
***REMOVED*** @private
***REMOVED***
goog.ui.editor.DefaultToolbar.FONT_SIZES_ = [
  {caption: goog.ui.editor.DefaultToolbar.MSG_FONT_SIZE_SMALL, value: 1},
  {caption: goog.ui.editor.DefaultToolbar.MSG_FONT_SIZE_NORMAL, value: 2},
  {caption: goog.ui.editor.DefaultToolbar.MSG_FONT_SIZE_LARGE, value: 4},
  {caption: goog.ui.editor.DefaultToolbar.MSG_FONT_SIZE_HUGE, value: 6}
];


***REMOVED***
***REMOVED*** Initializes the given font size menu button by adding default font sizes to
***REMOVED*** it.
***REMOVED*** @param {!goog.ui.Select} button Font size menu button.
***REMOVED***
goog.ui.editor.DefaultToolbar.addDefaultFontSizes = function(button) {
  goog.ui.editor.ToolbarFactory.addFontSizes(button,
      goog.ui.editor.DefaultToolbar.FONT_SIZES_);
***REMOVED***


// Header format menu creation.


***REMOVED*** @desc Caption for "Heading" block format option.***REMOVED***
goog.ui.editor.DefaultToolbar.MSG_FORMAT_HEADING = goog.getMsg('Heading');


***REMOVED*** @desc Caption for "Subheading" block format option.***REMOVED***
goog.ui.editor.DefaultToolbar.MSG_FORMAT_SUBHEADING = goog.getMsg('Subheading');


***REMOVED*** @desc Caption for "Minor heading" block format option.***REMOVED***
goog.ui.editor.DefaultToolbar.MSG_FORMAT_MINOR_HEADING =
    goog.getMsg('Minor heading');


***REMOVED*** @desc Caption for "Normal" block format option.***REMOVED***
goog.ui.editor.DefaultToolbar.MSG_FORMAT_NORMAL = goog.getMsg('Normal');


***REMOVED***
***REMOVED*** Format option descriptors, each with the following attributes:
***REMOVED*** <ul>
***REMOVED***   <li>{@code caption} - Caption to show in the menu (e.g. 'Minor heading')
***REMOVED***   <li>{@code command} - Corresponding {@link goog.dom.TagName} (e.g.
***REMOVED***       'H4')
***REMOVED*** </ul>
***REMOVED*** @type {!Array.<{caption: string, command: !goog.dom.TagName}>}
***REMOVED*** @private
***REMOVED***
goog.ui.editor.DefaultToolbar.FORMAT_OPTIONS_ = [
  {
    caption: goog.ui.editor.DefaultToolbar.MSG_FORMAT_HEADING,
    command: goog.dom.TagName.H2
  },
  {
    caption: goog.ui.editor.DefaultToolbar.MSG_FORMAT_SUBHEADING,
    command: goog.dom.TagName.H3
  },
  {
    caption: goog.ui.editor.DefaultToolbar.MSG_FORMAT_MINOR_HEADING,
    command: goog.dom.TagName.H4
  },
  {
    caption: goog.ui.editor.DefaultToolbar.MSG_FORMAT_NORMAL,
    command: goog.dom.TagName.P
  }
];


***REMOVED***
***REMOVED*** Initializes the given "Format block" menu button by adding default format
***REMOVED*** options to the menu.
***REMOVED*** @param {!goog.ui.Select} button "Format block" menu button.
***REMOVED***
goog.ui.editor.DefaultToolbar.addDefaultFormatOptions = function(button) {
  goog.ui.editor.ToolbarFactory.addFormatOptions(button,
      goog.ui.editor.DefaultToolbar.FORMAT_OPTIONS_);
***REMOVED***


***REMOVED***
***REMOVED*** Creates a {@link goog.ui.Toolbar} containing a default set of editor
***REMOVED*** toolbar buttons, and renders it into the given parent element.
***REMOVED*** @param {!Element} elem Toolbar parent element.
***REMOVED*** @param {boolean=} opt_isRightToLeft Whether the editor chrome is
***REMOVED***     right-to-left; defaults to the directionality of the toolbar parent
***REMOVED***     element.
***REMOVED*** @return {!goog.ui.Toolbar} Default editor toolbar, rendered into the given
***REMOVED***     parent element.
***REMOVED*** @see goog.ui.editor.DefaultToolbar.DEFAULT_BUTTONS
***REMOVED***
goog.ui.editor.DefaultToolbar.makeDefaultToolbar = function(elem,
    opt_isRightToLeft) {
  var isRightToLeft = opt_isRightToLeft || goog.style.isRightToLeft(elem);
  var buttons = isRightToLeft ?
      goog.ui.editor.DefaultToolbar.DEFAULT_BUTTONS_RTL :
      goog.ui.editor.DefaultToolbar.DEFAULT_BUTTONS;
  return goog.ui.editor.DefaultToolbar.makeToolbar(buttons, elem,
      opt_isRightToLeft);
***REMOVED***


***REMOVED***
***REMOVED*** Creates a {@link goog.ui.Toolbar} containing the specified set of
***REMOVED*** toolbar buttons, and renders it into the given parent element.  Each
***REMOVED*** item in the {@code items} array must either be a
***REMOVED*** {@link goog.editor.Command} (to create a built-in button) or a subclass
***REMOVED*** of {@link goog.ui.Control} (to create a custom control).
***REMOVED*** @param {!Array.<string|goog.ui.Control>} items Toolbar items; each must
***REMOVED***     be a {@link goog.editor.Command} or a {@link goog.ui.Control}.
***REMOVED*** @param {!Element} elem Toolbar parent element.
***REMOVED*** @param {boolean=} opt_isRightToLeft Whether the editor chrome is
***REMOVED***     right-to-left; defaults to the directionality of the toolbar parent
***REMOVED***     element.
***REMOVED*** @return {!goog.ui.Toolbar} Editor toolbar, rendered into the given parent
***REMOVED***     element.
***REMOVED***
goog.ui.editor.DefaultToolbar.makeToolbar = function(items, elem,
    opt_isRightToLeft) {
  var domHelper = goog.dom.getDomHelper(elem);
  var controls = [];

  for (var i = 0, button; button = items[i]; i++) {
    if (goog.isString(button)) {
      button = goog.ui.editor.DefaultToolbar.makeBuiltInToolbarButton(button,
          domHelper);
    }
    if (button) {
      controls.push(button);
    }
  }

  return goog.ui.editor.ToolbarFactory.makeToolbar(controls, elem,
      opt_isRightToLeft);
***REMOVED***


***REMOVED***
***REMOVED*** Creates an instance of a subclass of {@link goog.ui.Button} for the given
***REMOVED*** {@link goog.editor.Command}, or null if no built-in button exists for the
***REMOVED*** command.  Note that this function is only intended to create built-in
***REMOVED*** buttons; please don't try to hack it!
***REMOVED*** @param {string} command Editor command ID.
***REMOVED*** @param {goog.dom.DomHelper=} opt_domHelper DOM helper, used for DOM
***REMOVED***     creation; defaults to the current document if unspecified.
***REMOVED*** @return {goog.ui.Button} Toolbar button (null if no built-in button exists
***REMOVED***     for the command).
***REMOVED***
goog.ui.editor.DefaultToolbar.makeBuiltInToolbarButton = function(command,
    opt_domHelper) {
  var button;
  var descriptor = goog.ui.editor.DefaultToolbar.buttons_[command];
  if (descriptor) {
    // Default the factory method to makeToggleButton, since most built-in
    // toolbar buttons are toggle buttons. See also
    // goog.ui.editor.DefaultToolbar.BUTTONS_.
    var factory = descriptor.factory ||
        goog.ui.editor.ToolbarFactory.makeToggleButton;
    var id = descriptor.command;
    var tooltip = descriptor.tooltip;
    var caption = descriptor.caption;
    var classNames = descriptor.classes;
    // Default the DOM helper to the one for the current document.
    var domHelper = opt_domHelper || goog.dom.getDomHelper();
    // Instantiate the button based on the descriptor.
    button = factory(id, tooltip, caption, classNames, null, domHelper);
    // If this button's state should be queried when updating the toolbar,
    // set the button object's queryable property to true.
    if (descriptor.queryable) {
      button.queryable = true;
    }
  }
  return button;
***REMOVED***


***REMOVED***
***REMOVED*** A set of built-in buttons to display in the default editor toolbar.
***REMOVED*** @type {!Array.<string>}
***REMOVED***
goog.ui.editor.DefaultToolbar.DEFAULT_BUTTONS = [
  goog.editor.Command.IMAGE,
  goog.editor.Command.LINK,
  goog.editor.Command.BOLD,
  goog.editor.Command.ITALIC,
  goog.editor.Command.UNORDERED_LIST,
  goog.editor.Command.FONT_COLOR,
  goog.editor.Command.FONT_FACE,
  goog.editor.Command.FONT_SIZE,
  goog.editor.Command.JUSTIFY_LEFT,
  goog.editor.Command.JUSTIFY_CENTER,
  goog.editor.Command.JUSTIFY_RIGHT,
  goog.editor.Command.EDIT_HTML
];


***REMOVED***
***REMOVED*** A set of built-in buttons to display in the default editor toolbar when
***REMOVED*** the editor chrome is right-to-left (BiDi mode only).
***REMOVED*** @type {!Array.<string>}
***REMOVED***
goog.ui.editor.DefaultToolbar.DEFAULT_BUTTONS_RTL = [
  goog.editor.Command.IMAGE,
  goog.editor.Command.LINK,
  goog.editor.Command.BOLD,
  goog.editor.Command.ITALIC,
  goog.editor.Command.UNORDERED_LIST,
  goog.editor.Command.FONT_COLOR,
  goog.editor.Command.FONT_FACE,
  goog.editor.Command.FONT_SIZE,
  goog.editor.Command.JUSTIFY_RIGHT,
  goog.editor.Command.JUSTIFY_CENTER,
  goog.editor.Command.JUSTIFY_LEFT,
  goog.editor.Command.DIR_RTL,
  goog.editor.Command.DIR_LTR,
  goog.editor.Command.EDIT_HTML
];


***REMOVED***
***REMOVED*** Creates a toolbar button with the given ID, tooltip, and caption.  Applies
***REMOVED*** any custom CSS class names to the button's caption element.  This button
***REMOVED*** is designed to be used as the RTL button.
***REMOVED*** @param {string} id Button ID; must equal a {@link goog.editor.Command} for
***REMOVED***     built-in buttons, anything else for custom buttons.
***REMOVED*** @param {string} tooltip Tooltip to be shown on hover.
***REMOVED*** @param {goog.ui.ControlContent} caption Button caption.
***REMOVED*** @param {string=} opt_classNames CSS class name(s) to apply to the caption
***REMOVED***     element.
***REMOVED*** @param {goog.ui.ButtonRenderer=} opt_renderer Button renderer; defaults to
***REMOVED***     {@link goog.ui.ToolbarButtonRenderer} if unspecified.
***REMOVED*** @param {goog.dom.DomHelper=} opt_domHelper DOM helper, used for DOM
***REMOVED***     creation; defaults to the current document if unspecified.
***REMOVED*** @return {!goog.ui.Button} A toolbar button.
***REMOVED*** @private
***REMOVED***
goog.ui.editor.DefaultToolbar.rtlButtonFactory_ = function(id, tooltip,
    caption, opt_classNames, opt_renderer, opt_domHelper) {
  var button = goog.ui.editor.ToolbarFactory.makeToggleButton(id, tooltip,
      caption, opt_classNames, opt_renderer, opt_domHelper);
  button.updateFromValue = function(value) {
    // Enable/disable right-to-left text editing mode in the toolbar.
    var isRtl = !!value;
    // Enable/disable a marker class on the toolbar's root element; the rest is
    // done using CSS scoping in editortoolbar.css.  This changes
    // direction-senitive toolbar icons (like indent/outdent)
    goog.dom.classes.enable(
        button.getParent().getElement(), goog.getCssName('tr-rtl-mode'), isRtl);
    button.setChecked(isRtl);
  }
  return button;
***REMOVED***


***REMOVED***
***REMOVED*** Creates a toolbar button with the given ID, tooltip, and caption.  Applies
***REMOVED*** any custom CSS class names to the button's caption element.  Designed to
***REMOVED*** be used to create undo and redo buttons.
***REMOVED*** @param {string} id Button ID; must equal a {@link goog.editor.Command} for
***REMOVED***     built-in buttons, anything else for custom buttons.
***REMOVED*** @param {string} tooltip Tooltip to be shown on hover.
***REMOVED*** @param {goog.ui.ControlContent} caption Button caption.
***REMOVED*** @param {string=} opt_classNames CSS class name(s) to apply to the caption
***REMOVED***     element.
***REMOVED*** @param {goog.ui.ButtonRenderer=} opt_renderer Button renderer; defaults to
***REMOVED***     {@link goog.ui.ToolbarButtonRenderer} if unspecified.
***REMOVED*** @param {goog.dom.DomHelper=} opt_domHelper DOM helper, used for DOM
***REMOVED***     creation; defaults to the current document if unspecified.
***REMOVED*** @return {!goog.ui.Button} A toolbar button.
***REMOVED*** @private
***REMOVED***
goog.ui.editor.DefaultToolbar.undoRedoButtonFactory_ = function(id, tooltip,
    caption, opt_classNames, opt_renderer, opt_domHelper) {
  var button = goog.ui.editor.ToolbarFactory.makeButton(id, tooltip,
      caption, opt_classNames, opt_renderer, opt_domHelper);
  button.updateFromValue = function(value) {
    button.setEnabled(value);
  }
  return button;
***REMOVED***


***REMOVED***
***REMOVED*** Creates a toolbar button with the given ID, tooltip, and caption.  Applies
***REMOVED*** any custom CSS class names to the button's caption element.  Used to create
***REMOVED*** a font face button, filled with default fonts.
***REMOVED*** @param {string} id Button ID; must equal a {@link goog.editor.Command} for
***REMOVED***     built-in buttons, anything else for custom buttons.
***REMOVED*** @param {string} tooltip Tooltip to be shown on hover.
***REMOVED*** @param {goog.ui.ControlContent} caption Button caption.
***REMOVED*** @param {string=} opt_classNames CSS class name(s) to apply to the caption
***REMOVED***     element.
***REMOVED*** @param {goog.ui.MenuButtonRenderer=} opt_renderer Button renderer; defaults
***REMOVED***     to {@link goog.ui.ToolbarMenuButtonRenderer} if unspecified.
***REMOVED*** @param {goog.dom.DomHelper=} opt_domHelper DOM helper, used for DOM
***REMOVED***     creation; defaults to the current document if unspecified.
***REMOVED*** @return {!goog.ui.Button} A toolbar button.
***REMOVED*** @private
***REMOVED***
goog.ui.editor.DefaultToolbar.fontFaceFactory_ = function(id, tooltip,
    caption, opt_classNames, opt_renderer, opt_domHelper) {
  var button = goog.ui.editor.ToolbarFactory.makeSelectButton(id, tooltip,
      caption, opt_classNames, opt_renderer, opt_domHelper);
  goog.ui.editor.DefaultToolbar.addDefaultFonts(button);
  button.setDefaultCaption(goog.ui.editor.DefaultToolbar.MSG_FONT_NORMAL);
  // Font options don't have keyboard accelerators.
  goog.dom.classes.add(button.getMenu().getContentElement(),
      goog.getCssName('goog-menu-noaccel'));

  // How to update this button's state.
  button.updateFromValue = function(value) {
    // Normalize value to null or a non-empty string (sometimes we get
    // the empty string, sometimes we get false...), extract the substring
    // up to the first comma to get the primary font name, and normalize
    // to lowercase.  This allows us to map a font spec like "Arial,
    // Helvetica, sans-serif" to a font menu item.
    // TODO (attila): Try to make this more robust.
    var item = null;
    if (value && value.length > 0) {
      item =***REMOVED*****REMOVED*** @type {goog.ui.MenuItem}***REMOVED*** (button.getMenu().getChild(
          goog.ui.editor.ToolbarFactory.getPrimaryFont(value)));
    }
    var selectedItem = button.getSelectedItem();
    if (item != selectedItem) {
      button.setSelectedItem(item);
    }
  }
  return button;
***REMOVED***


***REMOVED***
***REMOVED*** Creates a toolbar button with the given ID, tooltip, and caption.  Applies
***REMOVED*** any custom CSS class names to the button's caption element. Use to create a
***REMOVED*** font size button, filled with default font sizes.
***REMOVED*** @param {string} id Button ID; must equal a {@link goog.editor.Command} for
***REMOVED***     built-in buttons, anything else for custom buttons.
***REMOVED*** @param {string} tooltip Tooltip to be shown on hover.
***REMOVED*** @param {goog.ui.ControlContent} caption Button caption.
***REMOVED*** @param {string=} opt_classNames CSS class name(s) to apply to the caption
***REMOVED***     element.
***REMOVED*** @param {goog.ui.MenuButtonRenderer=} opt_renderer Button renderer; defaults
***REMOVED***     to {@link goog.ui.ToolbarMebuButtonRenderer} if unspecified.
***REMOVED*** @param {goog.dom.DomHelper=} opt_domHelper DOM helper, used for DOM
***REMOVED***     creation; defaults to the current document if unspecified.
***REMOVED*** @return {!goog.ui.Button} A toolbar button.
***REMOVED*** @private
***REMOVED***
goog.ui.editor.DefaultToolbar.fontSizeFactory_ = function(id, tooltip,
    caption, opt_classNames, opt_renderer, opt_domHelper) {
  var button = goog.ui.editor.ToolbarFactory.makeSelectButton(id, tooltip,
      caption, opt_classNames, opt_renderer, opt_domHelper);
  goog.ui.editor.DefaultToolbar.addDefaultFontSizes(button);
  button.setDefaultCaption(goog.ui.editor.DefaultToolbar.MSG_FONT_SIZE_NORMAL);
  // Font size options don't have keyboard accelerators.
  goog.dom.classes.add(button.getMenu().getContentElement(),
      goog.getCssName('goog-menu-noaccel'));
  // How to update this button's state.
  button.updateFromValue = function(value) {
    // Webkit pre-534.7 returns a string like '32px' instead of the equivalent
    // integer, so normalize that first.
    // NOTE(user): Gecko returns "6" so can't just normalize all
    // strings, only ones ending in "px".
    if (goog.isString(value) &&
        goog.style.getLengthUnits(value) == 'px') {
      value = goog.ui.editor.ToolbarFactory.getLegacySizeFromPx(
          parseInt(value, 10));
    }
    // Normalize value to null or a positive integer (sometimes we get
    // the empty string, sometimes we get false, or -1 if the above
    // normalization didn't match to a particular 0-7 size)
    value = value > 0 ? value : null;
    if (value != button.getValue()) {
      button.setValue(value);
    }
  }
  return button;
***REMOVED***


***REMOVED***
***REMOVED*** Function to update the state of a color menu button.
***REMOVED*** @param {goog.ui.ToolbarColorMenuButton} button The button to which the
***REMOVED***     color menu is attached.
***REMOVED*** @param {number} color Color value to update to.
***REMOVED*** @private
***REMOVED***
goog.ui.editor.DefaultToolbar.colorUpdateFromValue_ = function(button, color) {
  var value = color;
 ***REMOVED*****REMOVED*** @preserveTry***REMOVED***
  try {
    if (goog.userAgent.IE) {
      // IE returns a number that, converted to hex, is a BGR color.
      // Convert from decimal to BGR to RGB.
      var hex = '000000' + value.toString(16);
      var bgr = hex.substr(hex.length - 6, 6);
      value = '#' + bgr.substring(4, 6) + bgr.substring(2, 4) +
          bgr.substring(0, 2);
    }
    if (value != button.getValue()) {
      button.setValue(***REMOVED*** @type {string}***REMOVED*** (value));
    }
  } catch (ex) {
    // TODO(attila): Find out when/why this happens.
  }
***REMOVED***


***REMOVED***
***REMOVED*** Creates a toolbar button with the given ID, tooltip, and caption.  Applies
***REMOVED*** any custom CSS class names to the button's caption element. Use to create
***REMOVED*** a font color button.
***REMOVED*** @param {string} id Button ID; must equal a {@link goog.editor.Command} for
***REMOVED***     built-in buttons, anything else for custom buttons.
***REMOVED*** @param {string} tooltip Tooltip to be shown on hover.
***REMOVED*** @param {goog.ui.ControlContent} caption Button caption.
***REMOVED*** @param {string=} opt_classNames CSS class name(s) to apply to the caption
***REMOVED***     element.
***REMOVED*** @param {goog.ui.ColorMenuButtonRenderer=} opt_renderer Button renderer;
***REMOVED***     defaults to {@link goog.ui.ToolbarColorMenuButtonRenderer} if
***REMOVED***     unspecified.
***REMOVED*** @param {goog.dom.DomHelper=} opt_domHelper DOM helper, used for DOM
***REMOVED***     creation; defaults to the current document if unspecified.
***REMOVED*** @return {!goog.ui.Button} A toolbar button.
***REMOVED*** @private
***REMOVED***
goog.ui.editor.DefaultToolbar.fontColorFactory_ = function(id, tooltip,
    caption, opt_classNames, opt_renderer, opt_domHelper) {
  var button = goog.ui.editor.ToolbarFactory.makeColorMenuButton(id, tooltip,
      caption, opt_classNames, opt_renderer, opt_domHelper);
  // Initialize default foreground color.
  button.setSelectedColor('#000');
  button.updateFromValue = goog.partial(
      goog.ui.editor.DefaultToolbar.colorUpdateFromValue_, button);
  return button;
***REMOVED***


***REMOVED***
***REMOVED*** Creates a toolbar button with the given ID, tooltip, and caption.  Applies
***REMOVED*** any custom CSS class names to the button's caption element. Use to create
***REMOVED*** a font background color button.
***REMOVED*** @param {string} id Button ID; must equal a {@link goog.editor.Command} for
***REMOVED***     built-in buttons, anything else for custom buttons.
***REMOVED*** @param {string} tooltip Tooltip to be shown on hover.
***REMOVED*** @param {goog.ui.ControlContent} caption Button caption.
***REMOVED*** @param {string=} opt_classNames CSS class name(s) to apply to the caption
***REMOVED***     element.
***REMOVED*** @param {goog.ui.ColorMenuButtonRenderer=} opt_renderer Button renderer;
***REMOVED***     defaults to {@link goog.ui.ToolbarColorMenuButtonRenderer} if
***REMOVED***     unspecified.
***REMOVED*** @param {goog.dom.DomHelper=} opt_domHelper DOM helper, used for DOM
***REMOVED***     creation; defaults to the current document if unspecified.
***REMOVED*** @return {!goog.ui.Button} A toolbar button.
***REMOVED*** @private
***REMOVED***
goog.ui.editor.DefaultToolbar.backgroundColorFactory_ = function(id, tooltip,
    caption, opt_classNames, opt_renderer, opt_domHelper) {
  var button = goog.ui.editor.ToolbarFactory.makeColorMenuButton(id,
      tooltip, caption, opt_classNames, opt_renderer, opt_domHelper);
  // Initialize default background color.
  button.setSelectedColor('#FFF');
  button.updateFromValue = goog.partial(
      goog.ui.editor.DefaultToolbar.colorUpdateFromValue_, button);
  return button;
***REMOVED***


***REMOVED***
***REMOVED*** Creates a toolbar button with the given ID, tooltip, and caption.  Applies
***REMOVED*** any custom CSS class names to the button's caption element. Use to create
***REMOVED*** the format menu, prefilled with default formats.
***REMOVED*** @param {string} id Button ID; must equal a {@link goog.editor.Command} for
***REMOVED***     built-in buttons, anything else for custom buttons.
***REMOVED*** @param {string} tooltip Tooltip to be shown on hover.
***REMOVED*** @param {goog.ui.ControlContent} caption Button caption.
***REMOVED*** @param {string=} opt_classNames CSS class name(s) to apply to the caption
***REMOVED***     element.
***REMOVED*** @param {goog.ui.MenuButtonRenderer=} opt_renderer Button renderer;
***REMOVED***     defaults to
***REMOVED***     {@link goog.ui.ToolbarMenuButtonRenderer} if unspecified.
***REMOVED*** @param {goog.dom.DomHelper=} opt_domHelper DOM helper, used for DOM
***REMOVED***     creation; defaults to the current document if unspecified.
***REMOVED*** @return {!goog.ui.Button} A toolbar button.
***REMOVED*** @private
***REMOVED***
goog.ui.editor.DefaultToolbar.formatBlockFactory_ = function(id, tooltip,
    caption, opt_classNames, opt_renderer, opt_domHelper) {
  var button = goog.ui.editor.ToolbarFactory.makeSelectButton(id, tooltip,
      caption, opt_classNames, opt_renderer, opt_domHelper);
  goog.ui.editor.DefaultToolbar.addDefaultFormatOptions(button);
  button.setDefaultCaption(goog.ui.editor.DefaultToolbar.MSG_FORMAT_NORMAL);
  // Format options don't have keyboard accelerators.
  goog.dom.classes.add(button.getMenu().getContentElement(),
      goog.getCssName('goog-menu-noaccel'));
  // How to update this button.
  button.updateFromValue = function(value) {
    // Normalize value to null or a nonempty string (sometimes we get
    // the empty string, sometimes we get false...)
    value = value && value.length > 0 ? value : null;
    if (value != button.getValue()) {
      button.setValue(value);
     }
  }
  return button;
***REMOVED***


// Messages used for tooltips and captions.


***REMOVED*** @desc Format menu tooltip.***REMOVED***
goog.ui.editor.DefaultToolbar.MSG_FORMAT_BLOCK_TITLE = goog.getMsg('Format');


***REMOVED*** @desc Format menu caption.***REMOVED***
goog.ui.editor.DefaultToolbar.MSG_FORMAT_BLOCK_CAPTION = goog.getMsg('Format');


***REMOVED*** @desc Undo button tooltip.***REMOVED***
goog.ui.editor.DefaultToolbar.MSG_UNDO_TITLE = goog.getMsg('Undo');


***REMOVED*** @desc Redo button tooltip.***REMOVED***
goog.ui.editor.DefaultToolbar.MSG_REDO_TITLE = goog.getMsg('Redo');


***REMOVED*** @desc Font menu tooltip.***REMOVED***
goog.ui.editor.DefaultToolbar.MSG_FONT_FACE_TITLE = goog.getMsg('Font');


***REMOVED*** @desc Font size menu tooltip.***REMOVED***
goog.ui.editor.DefaultToolbar.MSG_FONT_SIZE_TITLE = goog.getMsg('Font size');


***REMOVED*** @desc Text foreground color menu tooltip.***REMOVED***
goog.ui.editor.DefaultToolbar.MSG_FONT_COLOR_TITLE = goog.getMsg('Text color');


***REMOVED*** @desc Bold button tooltip.***REMOVED***
goog.ui.editor.DefaultToolbar.MSG_BOLD_TITLE = goog.getMsg('Bold');


***REMOVED*** @desc Italic button tooltip.***REMOVED***
goog.ui.editor.DefaultToolbar.MSG_ITALIC_TITLE = goog.getMsg('Italic');


***REMOVED*** @desc Underline button tooltip.***REMOVED***
goog.ui.editor.DefaultToolbar.MSG_UNDERLINE_TITLE = goog.getMsg('Underline');


***REMOVED*** @desc Text background color menu tooltip.***REMOVED***
goog.ui.editor.DefaultToolbar.MSG_BACKGROUND_COLOR_TITLE =
    goog.getMsg('Text background color');


***REMOVED*** @desc Link button tooltip.***REMOVED***
goog.ui.editor.DefaultToolbar.MSG_LINK_TITLE =
    goog.getMsg('Add or remove link');


***REMOVED*** @desc Numbered list button tooltip.***REMOVED***
goog.ui.editor.DefaultToolbar.MSG_ORDERED_LIST_TITLE =
    goog.getMsg('Numbered list');


***REMOVED*** @desc Bullet list button tooltip.***REMOVED***
goog.ui.editor.DefaultToolbar.MSG_UNORDERED_LIST_TITLE =
    goog.getMsg('Bullet list');


***REMOVED*** @desc Outdent button tooltip.***REMOVED***
goog.ui.editor.DefaultToolbar.MSG_OUTDENT_TITLE =
    goog.getMsg('Decrease indent');


***REMOVED*** @desc Indent button tooltip.***REMOVED***
goog.ui.editor.DefaultToolbar.MSG_INDENT_TITLE = goog.getMsg('Increase indent');


***REMOVED*** @desc Align left button tooltip.***REMOVED***
goog.ui.editor.DefaultToolbar.MSG_ALIGN_LEFT_TITLE = goog.getMsg('Align left');


***REMOVED*** @desc Align center button tooltip.***REMOVED***
goog.ui.editor.DefaultToolbar.MSG_ALIGN_CENTER_TITLE =
    goog.getMsg('Align center');


***REMOVED*** @desc Align right button tooltip.***REMOVED***
goog.ui.editor.DefaultToolbar.MSG_ALIGN_RIGHT_TITLE =
    goog.getMsg('Align right');


***REMOVED*** @desc Justify button tooltip.***REMOVED***
goog.ui.editor.DefaultToolbar.MSG_JUSTIFY_TITLE = goog.getMsg('Justify');


***REMOVED*** @desc Remove formatting button tooltip.***REMOVED***
goog.ui.editor.DefaultToolbar.MSG_REMOVE_FORMAT_TITLE =
    goog.getMsg('Remove formatting');


***REMOVED*** @desc Insert image button tooltip.***REMOVED***
goog.ui.editor.DefaultToolbar.MSG_IMAGE_TITLE = goog.getMsg('Insert image');


***REMOVED*** @desc Strike through button tooltip.***REMOVED***
goog.ui.editor.DefaultToolbar.MSG_STRIKE_THROUGH_TITLE =
    goog.getMsg('Strikethrough');


***REMOVED*** @desc Left-to-right button tooltip.***REMOVED***
goog.ui.editor.DefaultToolbar.MSG_DIR_LTR_TITLE = goog.getMsg('Left-to-right');


***REMOVED*** @desc Right-to-left button tooltip.***REMOVED***
goog.ui.editor.DefaultToolbar.MSG_DIR_RTL_TITLE = goog.getMsg('Right-to-left');


***REMOVED*** @desc Blockquote button tooltip.***REMOVED***
goog.ui.editor.DefaultToolbar.MSG_BLOCKQUOTE_TITLE = goog.getMsg('Quote');


***REMOVED*** @desc Edit HTML button tooltip.***REMOVED***
goog.ui.editor.DefaultToolbar.MSG_EDIT_HTML_TITLE =
    goog.getMsg('Edit HTML source');


***REMOVED*** @desc Subscript button tooltip.***REMOVED***
goog.ui.editor.DefaultToolbar.MSG_SUBSCRIPT = goog.getMsg('Subscript');


***REMOVED*** @desc Superscript button tooltip.***REMOVED***
goog.ui.editor.DefaultToolbar.MSG_SUPERSCRIPT = goog.getMsg('Superscript');


***REMOVED*** @desc Edit HTML button caption.***REMOVED***
goog.ui.editor.DefaultToolbar.MSG_EDIT_HTML_CAPTION = goog.getMsg('Edit HTML');


***REMOVED***
***REMOVED*** Map of {@code goog.editor.Command}s to toolbar button descriptor objects,
***REMOVED*** each of which has the following attributes:
***REMOVED*** <ul>
***REMOVED***   <li>{@code command} - The command corresponding to the
***REMOVED***       button (mandatory)
***REMOVED***   <li>{@code tooltip} - Tooltip text (optional); if unspecified, the button
***REMOVED***       has no hover text
***REMOVED***   <li>{@code caption} - Caption to display on the button (optional); if
***REMOVED***       unspecified, the button has no text caption
***REMOVED***   <li>{@code classes} - CSS class name(s) to be applied to the button's
***REMOVED***       element when rendered (optional); if unspecified, defaults to
***REMOVED***       'tr-icon'
***REMOVED***       plus 'tr-' followed by the command ID, but without any leading '+'
***REMOVED***       character (e.g. if the command ID is '+undo', then {@code classes}
***REMOVED***       defaults to 'tr-icon tr-undo')
***REMOVED***   <li>{@code factory} - factory function used to create the button, which
***REMOVED***       must accept {@code id}, {@code tooltip}, {@code caption}, and
***REMOVED***       {@code classes} as arguments, and must return an instance of
***REMOVED***       {@link goog.ui.Button} or an appropriate subclass (optional); if
***REMOVED***       unspecified, defaults to
***REMOVED***       {@link goog.ui.editor.DefaultToolbar.makeToggleButton},
***REMOVED***       since most built-in toolbar buttons are toggle buttons
***REMOVED***   <li>(@code queryable} - Whether the button's state should be queried
***REMOVED***       when updating the toolbar (optional).
***REMOVED*** </ul>
***REMOVED*** Note that this object is only used for creating toolbar buttons for
***REMOVED*** built-in editor commands; custom buttons aren't listed here.  Please don't
***REMOVED*** try to hack this!
***REMOVED*** @type {Object.<!goog.ui.editor.ButtonDescriptor>}.
***REMOVED*** @private
***REMOVED***
goog.ui.editor.DefaultToolbar.buttons_ = {***REMOVED***


***REMOVED***
***REMOVED*** @typedef {{command: string, tooltip: ?string,
***REMOVED***   caption: ?goog.ui.ControlContent, classes: ?string,
***REMOVED***   factory: ?function(string, string, goog.ui.ControlContent, ?string,
***REMOVED***       goog.ui.ButtonRenderer, goog.dom.DomHelper):goog.ui.Button,
***REMOVED***   queryable:?boolean}}
***REMOVED***
goog.ui.editor.ButtonDescriptor;


***REMOVED***
***REMOVED*** Built-in toolbar button descriptors.  See
***REMOVED*** {@link goog.ui.editor.DefaultToolbar.buttons_} for details on button
***REMOVED*** descriptor objects.  This array is processed at JS parse time; each item is
***REMOVED*** inserted into {@link goog.ui.editor.DefaultToolbar.buttons_}, and the array
***REMOVED*** itself is deleted and (hopefully) garbage-collected.
***REMOVED*** @type {Array.<!goog.ui.editor.ButtonDescriptor>}.
***REMOVED*** @private
***REMOVED***
goog.ui.editor.DefaultToolbar.BUTTONS_ = [{
  command: goog.editor.Command.UNDO,
  tooltip: goog.ui.editor.DefaultToolbar.MSG_UNDO_TITLE,
  classes: goog.getCssName('tr-icon') + ' ' + goog.getCssName('tr-undo'),
  factory: goog.ui.editor.DefaultToolbar.undoRedoButtonFactory_,
  queryable: true
}, {
  command: goog.editor.Command.REDO,
  tooltip: goog.ui.editor.DefaultToolbar.MSG_REDO_TITLE,
  classes: goog.getCssName('tr-icon') + ' ' + goog.getCssName('tr-redo'),
  factory: goog.ui.editor.DefaultToolbar.undoRedoButtonFactory_,
  queryable: true
}, {
  command: goog.editor.Command.FONT_FACE,
  tooltip: goog.ui.editor.DefaultToolbar.MSG_FONT_FACE_TITLE,
  classes: goog.getCssName('tr-fontName'),
  factory: goog.ui.editor.DefaultToolbar.fontFaceFactory_,
  queryable: true
}, {
  command: goog.editor.Command.FONT_SIZE,
  tooltip: goog.ui.editor.DefaultToolbar.MSG_FONT_SIZE_TITLE,
  classes: goog.getCssName('tr-fontSize'),
  factory: goog.ui.editor.DefaultToolbar.fontSizeFactory_,
  queryable: true
}, {
  command: goog.editor.Command.BOLD,
  tooltip: goog.ui.editor.DefaultToolbar.MSG_BOLD_TITLE,
  classes: goog.getCssName('tr-icon') + ' ' + goog.getCssName('tr-bold'),
  queryable: true
}, {
  command: goog.editor.Command.ITALIC,
  tooltip: goog.ui.editor.DefaultToolbar.MSG_ITALIC_TITLE,
  classes: goog.getCssName('tr-icon') + ' ' + goog.getCssName('tr-italic'),
  queryable: true
}, {
  command: goog.editor.Command.UNDERLINE,
  tooltip: goog.ui.editor.DefaultToolbar.MSG_UNDERLINE_TITLE,
  classes: goog.getCssName('tr-icon') + ' ' + goog.getCssName('tr-underline'),
  queryable: true
}, {
  command: goog.editor.Command.FONT_COLOR,
  tooltip: goog.ui.editor.DefaultToolbar.MSG_FONT_COLOR_TITLE,
  classes: goog.getCssName('tr-icon') + ' ' + goog.getCssName('tr-foreColor'),
  factory: goog.ui.editor.DefaultToolbar.fontColorFactory_,
  queryable: true
}, {
  command: goog.editor.Command.BACKGROUND_COLOR,
  tooltip: goog.ui.editor.DefaultToolbar.MSG_BACKGROUND_COLOR_TITLE,
  classes: goog.getCssName('tr-icon') + ' ' + goog.getCssName('tr-backColor'),
  factory: goog.ui.editor.DefaultToolbar.backgroundColorFactory_,
  queryable: true
}, {
  command: goog.editor.Command.LINK,
  tooltip: goog.ui.editor.DefaultToolbar.MSG_LINK_TITLE,
  caption: goog.ui.editor.messages.MSG_LINK_CAPTION,
  classes: goog.getCssName('tr-link'),
  queryable: true
}, {
  command: goog.editor.Command.ORDERED_LIST,
  tooltip: goog.ui.editor.DefaultToolbar.MSG_ORDERED_LIST_TITLE,
  classes: goog.getCssName('tr-icon') + ' ' +
      goog.getCssName('tr-insertOrderedList'),
  queryable: true
}, {
  command: goog.editor.Command.UNORDERED_LIST,
  tooltip: goog.ui.editor.DefaultToolbar.MSG_UNORDERED_LIST_TITLE,
  classes: goog.getCssName('tr-icon') + ' ' +
      goog.getCssName('tr-insertUnorderedList'),
  queryable: true
}, {
  command: goog.editor.Command.OUTDENT,
  tooltip: goog.ui.editor.DefaultToolbar.MSG_OUTDENT_TITLE,
  classes: goog.getCssName('tr-icon') + ' ' + goog.getCssName('tr-outdent'),
  factory: goog.ui.editor.ToolbarFactory.makeButton
}, {
  command: goog.editor.Command.INDENT,
  tooltip: goog.ui.editor.DefaultToolbar.MSG_INDENT_TITLE,
  classes: goog.getCssName('tr-icon') + ' ' + goog.getCssName('tr-indent'),
  factory: goog.ui.editor.ToolbarFactory.makeButton
}, {
  command: goog.editor.Command.JUSTIFY_LEFT,
  tooltip: goog.ui.editor.DefaultToolbar.MSG_ALIGN_LEFT_TITLE,
  classes: goog.getCssName('tr-icon') + ' ' +
      goog.getCssName('tr-justifyLeft'),
  queryable: true
}, {
  command: goog.editor.Command.JUSTIFY_CENTER,
  tooltip: goog.ui.editor.DefaultToolbar.MSG_ALIGN_CENTER_TITLE,
  classes: goog.getCssName('tr-icon') + ' ' +
      goog.getCssName('tr-justifyCenter'),
  queryable: true
}, {
  command: goog.editor.Command.JUSTIFY_RIGHT,
  tooltip: goog.ui.editor.DefaultToolbar.MSG_ALIGN_RIGHT_TITLE,
  classes: goog.getCssName('tr-icon') + ' ' +
      goog.getCssName('tr-justifyRight'),
  queryable: true
}, {
  command: goog.editor.Command.JUSTIFY_FULL,
  tooltip: goog.ui.editor.DefaultToolbar.MSG_JUSTIFY_TITLE,
  classes: goog.getCssName('tr-icon') + ' ' +
      goog.getCssName('tr-justifyFull'),
  queryable: true
}, {
  command: goog.editor.Command.REMOVE_FORMAT,
  tooltip: goog.ui.editor.DefaultToolbar.MSG_REMOVE_FORMAT_TITLE,
  classes: goog.getCssName('tr-icon') + ' ' +
      goog.getCssName('tr-removeFormat'),
  factory: goog.ui.editor.ToolbarFactory.makeButton
}, {
  command: goog.editor.Command.IMAGE,
  tooltip: goog.ui.editor.DefaultToolbar.MSG_IMAGE_TITLE,
  classes: goog.getCssName('tr-icon') + ' ' + goog.getCssName('tr-image'),
  factory: goog.ui.editor.ToolbarFactory.makeButton
}, {
  command: goog.editor.Command.STRIKE_THROUGH,
  tooltip: goog.ui.editor.DefaultToolbar.MSG_STRIKE_THROUGH_TITLE,
  classes: goog.getCssName('tr-icon') + ' ' +
      goog.getCssName('tr-strikeThrough'),
  queryable: true
}, {
  command: goog.editor.Command.SUBSCRIPT,
  tooltip: goog.ui.editor.DefaultToolbar.MSG_SUBSCRIPT,
  classes: goog.getCssName('tr-icon') + ' ' + goog.getCssName('tr-subscript'),
  queryable: true
} , {
  command: goog.editor.Command.SUPERSCRIPT,
  tooltip: goog.ui.editor.DefaultToolbar.MSG_SUPERSCRIPT,
  classes: goog.getCssName('tr-icon') + ' ' +
       goog.getCssName('tr-superscript'),
  queryable: true
}, {
  command: goog.editor.Command.DIR_LTR,
  tooltip: goog.ui.editor.DefaultToolbar.MSG_DIR_LTR_TITLE,
  classes: goog.getCssName('tr-icon') + ' ' + goog.getCssName('tr-ltr'),
  queryable: true
}, {
  command: goog.editor.Command.DIR_RTL,
  tooltip: goog.ui.editor.DefaultToolbar.MSG_DIR_RTL_TITLE,
  classes: goog.getCssName('tr-icon') + ' ' + goog.getCssName('tr-rtl'),
  factory: goog.ui.editor.DefaultToolbar.rtlButtonFactory_,
  queryable: true
}, {
  command: goog.editor.Command.BLOCKQUOTE,
  tooltip: goog.ui.editor.DefaultToolbar.MSG_BLOCKQUOTE_TITLE,
  classes: goog.getCssName('tr-icon') + ' ' +
      goog.getCssName('tr-BLOCKQUOTE'),
  queryable: true
}, {
  command: goog.editor.Command.FORMAT_BLOCK,
  tooltip: goog.ui.editor.DefaultToolbar.MSG_FORMAT_BLOCK_TITLE,
  caption: goog.ui.editor.DefaultToolbar.MSG_FORMAT_BLOCK_CAPTION,
  classes: goog.getCssName('tr-formatBlock'),
  factory: goog.ui.editor.DefaultToolbar.formatBlockFactory_,
  queryable: true
}, {
  command: goog.editor.Command.EDIT_HTML,
  tooltip: goog.ui.editor.DefaultToolbar.MSG_EDIT_HTML_TITLE,
  caption: goog.ui.editor.DefaultToolbar.MSG_EDIT_HTML_CAPTION,
  classes: goog.getCssName('tr-editHtml'),
  factory: goog.ui.editor.ToolbarFactory.makeButton
}];


(function() {
// Create the goog.ui.editor.DefaultToolbar.buttons_ map from
// goog.ui.editor.DefaultToolbar.BUTTONS_.
for (var i = 0, button;
    button = goog.ui.editor.DefaultToolbar.BUTTONS_[i]; i++) {
  goog.ui.editor.DefaultToolbar.buttons_[button.command] = button;
}

// goog.ui.editor.DefaultToolbar.BUTTONS_ is no longer needed
// once the map is ready.
delete goog.ui.editor.DefaultToolbar.BUTTONS_;

})();
