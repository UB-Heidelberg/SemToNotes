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
***REMOVED*** @fileoverview Generic factory functions for creating the building blocks for
***REMOVED*** an editor toolbar.
***REMOVED***
***REMOVED*** @author attila@google.com (Attila Bodis)
***REMOVED*** @author jparent@google.com (Julie Parent)
***REMOVED***

goog.provide('goog.ui.editor.ToolbarFactory');

goog.require('goog.array');
goog.require('goog.dom');
goog.require('goog.string');
goog.require('goog.string.Unicode');
goog.require('goog.style');
goog.require('goog.ui.Component.State');
goog.require('goog.ui.Container.Orientation');
goog.require('goog.ui.ControlContent');
goog.require('goog.ui.Option');
goog.require('goog.ui.Toolbar');
goog.require('goog.ui.ToolbarButton');
goog.require('goog.ui.ToolbarColorMenuButton');
goog.require('goog.ui.ToolbarMenuButton');
goog.require('goog.ui.ToolbarRenderer');
goog.require('goog.ui.ToolbarSelect');
goog.require('goog.userAgent');


***REMOVED***
***REMOVED*** Takes a font spec (e.g. "Arial, Helvetica, sans-serif") and returns the
***REMOVED*** primary font name, normalized to lowercase (e.g. "arial").
***REMOVED*** @param {string} fontSpec Font specification.
***REMOVED*** @return {string} The primary font name, in lowercase.
***REMOVED***
goog.ui.editor.ToolbarFactory.getPrimaryFont = function(fontSpec) {
  var i = fontSpec.indexOf(',');
  var fontName = (i != -1 ? fontSpec.substring(0, i) : fontSpec).toLowerCase();
  // Strip leading/trailing quotes from the font name (bug 1050118).
  return goog.string.stripQuotes(fontName, '"\'');
***REMOVED***


***REMOVED***
***REMOVED*** Bulk-adds fonts to the given font menu button.  The argument must be an
***REMOVED*** array of font descriptor objects, each of which must have the following
***REMOVED*** attributes:
***REMOVED*** <ul>
***REMOVED***   <li>{@code caption} - Caption to show in the font menu (e.g. 'Tahoma')
***REMOVED***   <li>{@code value} - Value for the corresponding 'font-family' CSS style
***REMOVED***       (e.g. 'Tahoma, Arial, sans-serif')
***REMOVED*** </ul>
***REMOVED*** @param {!goog.ui.Select} button Font menu button.
***REMOVED*** @param {!Array.<{caption: string, value: string}>} fonts Array of
***REMOVED***     font descriptors.
***REMOVED***
goog.ui.editor.ToolbarFactory.addFonts = function(button, fonts) {
  goog.array.forEach(fonts, function(font) {
    goog.ui.editor.ToolbarFactory.addFont(button, font.caption, font.value);
  });
***REMOVED***


***REMOVED***
***REMOVED*** Adds a menu item to the given font menu button.  The first font listed in
***REMOVED*** the {@code value} argument is considered the font ID, so adding two items
***REMOVED*** whose CSS style starts with the same font may lead to unpredictable results.
***REMOVED*** @param {!goog.ui.Select} button Font menu button.
***REMOVED*** @param {string} caption Caption to show for the font menu.
***REMOVED*** @param {string} value Value for the corresponding 'font-family' CSS style.
***REMOVED***
goog.ui.editor.ToolbarFactory.addFont = function(button, caption, value) {
  // The font ID is the first font listed in the CSS style, normalized to
  // lowercase.
  var id = goog.ui.editor.ToolbarFactory.getPrimaryFont(value);

  // Construct the option, and add it to the button.
  var option = new goog.ui.Option(caption, value, button.getDomHelper());
  option.setId(id);
  button.addItem(option);

  // Captions are shown in their own font.
  option.getContentElement().style.fontFamily = value;
***REMOVED***


***REMOVED***
***REMOVED*** Bulk-adds font sizes to the given font size menu button.  The argument must
***REMOVED*** be an array of font size descriptor objects, each of which must have the
***REMOVED*** following attributes:
***REMOVED*** <ul>
***REMOVED***   <li>{@code caption} - Caption to show in the font size menu (e.g. 'Huge')
***REMOVED***   <li>{@code value} - Value for the corresponding HTML font size (e.g. 6)
***REMOVED*** </ul>
***REMOVED*** @param {!goog.ui.Select} button Font size menu button.
***REMOVED*** @param {!Array.<{caption: string, value:number}>} sizes Array of font
***REMOVED***     size descriptors.
***REMOVED***
goog.ui.editor.ToolbarFactory.addFontSizes = function(button, sizes) {
  goog.array.forEach(sizes, function(size) {
    goog.ui.editor.ToolbarFactory.addFontSize(button, size.caption, size.value);
  });
***REMOVED***


***REMOVED***
***REMOVED*** Adds a menu item to the given font size menu button.  The {@code value}
***REMOVED*** argument must be a legacy HTML font size in the 0-7 range.
***REMOVED*** @param {!goog.ui.Select} button Font size menu button.
***REMOVED*** @param {string} caption Caption to show in the font size menu.
***REMOVED*** @param {number} value Value for the corresponding HTML font size.
***REMOVED***
goog.ui.editor.ToolbarFactory.addFontSize = function(button, caption, value) {
  // Construct the option, and add it to the button.
  var option = new goog.ui.Option(caption, value, button.getDomHelper());
  button.addItem(option);

  // Adjust the font size of the menu item and the height of the checkbox
  // element after they've been rendered by addItem().  Captions are shown in
  // the corresponding font size, and lining up the checkbox is tricky.
  var content = option.getContentElement();
  content.style.fontSize =
      goog.ui.editor.ToolbarFactory.getPxFromLegacySize(value) + 'px';
  content.firstChild.style.height = '1.1em';
***REMOVED***


***REMOVED***
***REMOVED*** Converts a legacy font size specification into an equivalent pixel size.
***REMOVED*** For example, {@code &lt;font size="6"&gt;} is {@code font-size: 32px;}, etc.
***REMOVED*** @param {number} fontSize Legacy font size spec in the 0-7 range.
***REMOVED*** @return {number} Equivalent pixel size.
***REMOVED***
goog.ui.editor.ToolbarFactory.getPxFromLegacySize = function(fontSize) {
  return goog.ui.editor.ToolbarFactory.LEGACY_SIZE_TO_PX_MAP_[fontSize] || 10;
***REMOVED***


***REMOVED***
***REMOVED*** Converts a pixel font size specification into an equivalent legacy size.
***REMOVED*** For example, {@code font-size: 32px;} is {@code &lt;font size="6"&gt;}, etc.
***REMOVED*** If the given pixel size doesn't exactly match one of the legacy sizes, -1 is
***REMOVED*** returned.
***REMOVED*** @param {number} px Pixel font size.
***REMOVED*** @return {number} Equivalent legacy size spec in the 0-7 range, or -1 if none
***REMOVED***     exists.
***REMOVED***
goog.ui.editor.ToolbarFactory.getLegacySizeFromPx = function(px) {
  // Use lastIndexOf to get the largest legacy size matching the pixel size
  // (most notably returning 1 instead of 0 for 10px).
  return goog.array.lastIndexOf(
      goog.ui.editor.ToolbarFactory.LEGACY_SIZE_TO_PX_MAP_, px);
***REMOVED***


***REMOVED***
***REMOVED*** Map of legacy font sizes (0-7) to equivalent pixel sizes.
***REMOVED*** @type {Array.<number>}
***REMOVED*** @private
***REMOVED***
goog.ui.editor.ToolbarFactory.LEGACY_SIZE_TO_PX_MAP_ =
    [10, 10, 13, 16, 18, 24, 32, 48];


***REMOVED***
***REMOVED*** Bulk-adds format options to the given "Format block" menu button.  The
***REMOVED*** argument must be an array of format option descriptor objects, each of
***REMOVED*** which must have the following attributes:
***REMOVED*** <ul>
***REMOVED***   <li>{@code caption} - Caption to show in the menu (e.g. 'Minor heading')
***REMOVED***   <li>{@code command} - Corresponding {@link goog.dom.TagName} (e.g.
***REMOVED***       'H4')
***REMOVED*** </ul>
***REMOVED*** @param {!goog.ui.Select} button "Format block" menu button.
***REMOVED*** @param {!Array.<{caption: string, command: goog.dom.TagName}>} formats Array
***REMOVED***     of format option descriptors.
***REMOVED***
goog.ui.editor.ToolbarFactory.addFormatOptions = function(button, formats) {
  goog.array.forEach(formats, function(format) {
    goog.ui.editor.ToolbarFactory.addFormatOption(button, format.caption,
        format.command);
  });
***REMOVED***


***REMOVED***
***REMOVED*** Adds a menu item to the given "Format block" menu button.
***REMOVED*** @param {!goog.ui.Select} button "Format block" menu button.
***REMOVED*** @param {string} caption Caption to show in the menu.
***REMOVED*** @param {goog.dom.TagName} tag Corresponding block format tag.
***REMOVED***
goog.ui.editor.ToolbarFactory.addFormatOption = function(button, caption, tag) {
  // Construct the option, and add it to the button.
  // TODO(attila): Create boring but functional menu item for now...
  var buttonDom = button.getDomHelper();
  var option = new goog.ui.Option(buttonDom.createDom(goog.dom.TagName.DIV,
      null, caption), tag, buttonDom);
  option.setId(tag);
  button.addItem(option);
***REMOVED***


***REMOVED***
***REMOVED*** Creates a {@link goog.ui.Toolbar} containing the specified set of
***REMOVED*** toolbar buttons, and renders it into the given parent element.  Each
***REMOVED*** item in the {@code items} array must a {@link goog.ui.Control}.
***REMOVED*** @param {!Array.<goog.ui.Control>} items Toolbar items; each must
***REMOVED***     be a {@link goog.ui.Control}.
***REMOVED*** @param {!Element} elem Toolbar parent element.
***REMOVED*** @param {boolean=} opt_isRightToLeft Whether the editor chrome is
***REMOVED***     right-to-left; defaults to the directionality of the toolbar parent
***REMOVED***     element.
***REMOVED*** @return {!goog.ui.Toolbar} Editor toolbar, rendered into the given parent
***REMOVED***     element.
***REMOVED***
goog.ui.editor.ToolbarFactory.makeToolbar = function(items, elem,
    opt_isRightToLeft) {
  var domHelper = goog.dom.getDomHelper(elem);

  // Create an empty horizontal toolbar using the default renderer.
  var toolbar = new goog.ui.Toolbar(goog.ui.ToolbarRenderer.getInstance(),
      goog.ui.Container.Orientation.HORIZONTAL, domHelper);

  // Optimization:  Explicitly test for the directionality of the parent
  // element here, so we can set it for both the toolbar and its children,
  // saving a lot of expensive calls to goog.style.isRightToLeft() during
  // rendering.
  var isRightToLeft = opt_isRightToLeft || goog.style.isRightToLeft(elem);
  toolbar.setRightToLeft(isRightToLeft);

  // Optimization:  Set the toolbar to non-focusable before it is rendered,
  // to avoid creating unnecessary keyboard event handler objects.
  toolbar.setFocusable(false);

  for (var i = 0, button; button = items[i]; i++) {
    // Optimization:  Set the button to non-focusable before it is rendered,
    // to avoid creating unnecessary keyboard event handler objects.  Also set
    // the directionality of the button explicitly, to avoid expensive calls
    // to goog.style.isRightToLeft() during rendering.
    button.setSupportedState(goog.ui.Component.State.FOCUSED, false);
    button.setRightToLeft(isRightToLeft);
    toolbar.addChild(button, true);
  }

  toolbar.render(elem);
  return toolbar;
***REMOVED***


***REMOVED***
***REMOVED*** Creates a toolbar button with the given ID, tooltip, and caption.  Applies
***REMOVED*** any custom CSS class names to the button's caption element.
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
***REMOVED***
goog.ui.editor.ToolbarFactory.makeButton = function(id, tooltip, caption,
    opt_classNames, opt_renderer, opt_domHelper) {
  var button = new goog.ui.ToolbarButton(
      goog.ui.editor.ToolbarFactory.createContent_(caption, opt_classNames,
          opt_domHelper),
      opt_renderer,
      opt_domHelper);
  button.setId(id);
  button.setTooltip(tooltip);
  return button;
***REMOVED***


***REMOVED***
***REMOVED*** Creates a toggle button with the given ID, tooltip, and caption. Applies
***REMOVED*** any custom CSS class names to the button's caption element. The button
***REMOVED*** returned has checkbox-like toggle semantics.
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
***REMOVED*** @return {!goog.ui.Button} A toggle button.
***REMOVED***
goog.ui.editor.ToolbarFactory.makeToggleButton = function(id, tooltip, caption,
    opt_classNames, opt_renderer, opt_domHelper) {
  var button = goog.ui.editor.ToolbarFactory.makeButton(id, tooltip, caption,
      opt_classNames, opt_renderer, opt_domHelper);
  button.setSupportedState(goog.ui.Component.State.CHECKED, true);
  return button;
***REMOVED***


***REMOVED***
***REMOVED*** Creates a menu button with the given ID, tooltip, and caption. Applies
***REMOVED*** any custom CSS class names to the button's caption element.  The button
***REMOVED*** returned doesn't have an actual menu attached; use {@link
***REMOVED*** goog.ui.MenuButton#setMenu} to attach a {@link goog.ui.Menu} to the
***REMOVED*** button.
***REMOVED*** @param {string} id Button ID; must equal a {@link goog.editor.Command} for
***REMOVED***     built-in buttons, anything else for custom buttons.
***REMOVED*** @param {string} tooltip Tooltip to be shown on hover.
***REMOVED*** @param {goog.ui.ControlContent} caption Button caption.
***REMOVED*** @param {string=} opt_classNames CSS class name(s) to apply to the caption
***REMOVED***     element.
***REMOVED*** @param {goog.ui.ButtonRenderer=} opt_renderer Button renderer; defaults to
***REMOVED***     {@link goog.ui.ToolbarMenuButtonRenderer} if unspecified.
***REMOVED*** @param {goog.dom.DomHelper=} opt_domHelper DOM helper, used for DOM
***REMOVED***     creation; defaults to the current document if unspecified.
***REMOVED*** @return {!goog.ui.MenuButton} A menu button.
***REMOVED***
goog.ui.editor.ToolbarFactory.makeMenuButton = function(id, tooltip, caption,
    opt_classNames, opt_renderer, opt_domHelper) {
  var button = new goog.ui.ToolbarMenuButton(
      goog.ui.editor.ToolbarFactory.createContent_(caption, opt_classNames,
          opt_domHelper),
      null,
      opt_renderer,
      opt_domHelper);
  button.setId(id);
  button.setTooltip(tooltip);
  return button;
***REMOVED***


***REMOVED***
***REMOVED*** Creates a select button with the given ID, tooltip, and caption. Applies
***REMOVED*** any custom CSS class names to the button's root element.  The button
***REMOVED*** returned doesn't have an actual menu attached; use {@link
***REMOVED*** goog.ui.Select#setMenu} to attach a {@link goog.ui.Menu} containing
***REMOVED*** {@link goog.ui.Option}s to the select button.
***REMOVED*** @param {string} id Button ID; must equal a {@link goog.editor.Command} for
***REMOVED***     built-in buttons, anything else for custom buttons.
***REMOVED*** @param {string} tooltip Tooltip to be shown on hover.
***REMOVED*** @param {goog.ui.ControlContent} caption Button caption; used as the
***REMOVED***     default caption when nothing is selected.
***REMOVED*** @param {string=} opt_classNames CSS class name(s) to apply to the button's
***REMOVED***     root element.
***REMOVED*** @param {goog.ui.MenuButtonRenderer=} opt_renderer Button renderer;
***REMOVED***     defaults to {@link goog.ui.ToolbarMenuButtonRenderer} if unspecified.
***REMOVED*** @param {goog.dom.DomHelper=} opt_domHelper DOM helper, used for DOM
***REMOVED***     creation; defaults to the current document if unspecified.
***REMOVED*** @return {!goog.ui.Select} A select button.
***REMOVED***
goog.ui.editor.ToolbarFactory.makeSelectButton = function(id, tooltip, caption,
    opt_classNames, opt_renderer, opt_domHelper) {
  var button = new goog.ui.ToolbarSelect(null, null,
      opt_renderer,
      opt_domHelper);
  if (opt_classNames) {
    // Unlike the other button types, for goog.ui.Select buttons we apply the
    // extra class names to the root element, because for select buttons the
    // caption isn't stable (as it changes each time the selection changes).
    goog.array.forEach(opt_classNames.split(/\s+/), button.addClassName,
        button);
  }
  button.addClassName(goog.getCssName('goog-toolbar-select'));
  button.setDefaultCaption(caption);
  button.setId(id);
  button.setTooltip(tooltip);
  return button;
***REMOVED***


***REMOVED***
***REMOVED*** Creates a color menu button with the given ID, tooltip, and caption.
***REMOVED*** Applies any custom CSS class names to the button's caption element.  The
***REMOVED*** button is created with a default color menu containing standard color
***REMOVED*** palettes.
***REMOVED*** @param {string} id Button ID; must equal a {@link goog.editor.Command} for
***REMOVED***     built-in toolbar buttons, but can be anything else for custom buttons.
***REMOVED*** @param {string} tooltip Tooltip to be shown on hover.
***REMOVED*** @param {goog.ui.ControlContent} caption Button caption.
***REMOVED*** @param {string=} opt_classNames CSS class name(s) to apply to the caption
***REMOVED***     element.
***REMOVED*** @param {goog.ui.ColorMenuButtonRenderer=} opt_renderer Button renderer;
***REMOVED***     defaults to {@link goog.ui.ToolbarColorMenuButtonRenderer}
***REMOVED***     if unspecified.
***REMOVED*** @param {goog.dom.DomHelper=} opt_domHelper DOM helper, used for DOM
***REMOVED***     creation; defaults to the current document if unspecified.
***REMOVED*** @return {!goog.ui.ColorMenuButton} A color menu button.
***REMOVED***
goog.ui.editor.ToolbarFactory.makeColorMenuButton = function(id, tooltip,
    caption, opt_classNames, opt_renderer, opt_domHelper) {
  var button = new goog.ui.ToolbarColorMenuButton(
      goog.ui.editor.ToolbarFactory.createContent_(caption, opt_classNames,
          opt_domHelper),
      null,
      opt_renderer,
      opt_domHelper);
  button.setId(id);
  button.setTooltip(tooltip);
  return button;
***REMOVED***


***REMOVED***
***REMOVED*** Creates a new DIV that wraps a button caption, optionally applying CSS
***REMOVED*** class names to it.  Used as a helper function in button factory methods.
***REMOVED*** @param {goog.ui.ControlContent} caption Button caption.
***REMOVED*** @param {string=} opt_classNames CSS class name(s) to apply to the DIV that
***REMOVED***     wraps the caption (if any).
***REMOVED*** @param {goog.dom.DomHelper=} opt_domHelper DOM helper, used for DOM
***REMOVED***     creation; defaults to the current document if unspecified.
***REMOVED*** @return {!Element} DIV that wraps the caption.
***REMOVED*** @private
***REMOVED***
goog.ui.editor.ToolbarFactory.createContent_ = function(caption, opt_classNames,
    opt_domHelper) {
  // FF2 doesn't like empty DIVs, especially when rendered right-to-left.
  if ((!caption || caption == '') && goog.userAgent.GECKO &&
      !goog.userAgent.isVersion('1.9a')) {
    caption = goog.string.Unicode.NBSP;
  }
  return (opt_domHelper || goog.dom.getDomHelper()).createDom(
      goog.dom.TagName.DIV,
      opt_classNames ? {'class' : opt_classNames} : null, caption);
***REMOVED***
