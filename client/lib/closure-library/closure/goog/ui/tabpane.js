// Copyright 2006 The Closure Library Authors. All Rights Reserved.
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
***REMOVED*** @fileoverview TabPane widget implementation.
***REMOVED***
***REMOVED*** @author eae@google.com (Emil A Eklund)
***REMOVED***

goog.provide('goog.ui.TabPane');
goog.provide('goog.ui.TabPane.Events');
goog.provide('goog.ui.TabPane.TabLocation');
goog.provide('goog.ui.TabPane.TabPage');
goog.provide('goog.ui.TabPaneEvent');

goog.require('goog.asserts');
goog.require('goog.dom');
goog.require('goog.dom.classlist');
***REMOVED***
goog.require('goog.events.Event');
goog.require('goog.events.EventTarget');
***REMOVED***
goog.require('goog.events.KeyCodes');
goog.require('goog.style');



***REMOVED***
***REMOVED*** TabPane widget. All children already inside the tab pane container element
***REMOVED*** will be be converted to tabs. Each tab is represented by a goog.ui.TabPane.
***REMOVED*** TabPage object. Further pages can be constructed either from an existing
***REMOVED*** container or created from scratch.
***REMOVED***
***REMOVED*** @param {Element} el Container element to create the tab pane out of.
***REMOVED*** @param {goog.ui.TabPane.TabLocation=} opt_tabLocation Location of the tabs
***REMOVED***     in relation to the content container. Default is top.
***REMOVED*** @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper.
***REMOVED*** @param {boolean=} opt_useMouseDown Whether to use MOUSEDOWN instead of CLICK
***REMOVED***     for tab changes.
***REMOVED*** @extends {goog.events.EventTarget}
***REMOVED***
***REMOVED*** @see ../demos/tabpane.html
***REMOVED*** @deprecated Use goog.ui.TabBar instead.
***REMOVED***
goog.ui.TabPane = function(el, opt_tabLocation, opt_domHelper,
                           opt_useMouseDown) {
  goog.events.EventTarget.call(this);

 ***REMOVED*****REMOVED***
  ***REMOVED*** DomHelper used to interact with the document, allowing components to be
  ***REMOVED*** created in a different window.  This property is considered protected;
  ***REMOVED*** subclasses of Component may refer to it directly.
  ***REMOVED*** @type {goog.dom.DomHelper}
  ***REMOVED*** @protected
  ***REMOVED*** @suppress {underscore|visibility}
 ***REMOVED*****REMOVED***
  this.dom_ = opt_domHelper || goog.dom.getDomHelper();

 ***REMOVED*****REMOVED***
  ***REMOVED*** Tab pane element.
  ***REMOVED*** @type {Element}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.el_ = el;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Collection of tab panes.
  ***REMOVED*** @type {Array.<goog.ui.TabPane.TabPage>}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.pages_ = [];

 ***REMOVED*****REMOVED***
  ***REMOVED*** Location of the tabs with respect to the content box.
  ***REMOVED*** @type {goog.ui.TabPane.TabLocation}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.tabLocation_ =
      opt_tabLocation ? opt_tabLocation : goog.ui.TabPane.TabLocation.TOP;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Whether to use MOUSEDOWN instead of CLICK for tab change events. This
  ***REMOVED*** fixes some focus problems on Safari/Chrome.
  ***REMOVED*** @type {boolean}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.useMouseDown_ = !!opt_useMouseDown;

  this.create_();
***REMOVED***
goog.inherits(goog.ui.TabPane, goog.events.EventTarget);


***REMOVED***
***REMOVED*** Element containing the tab buttons.
***REMOVED*** @type {Element}
***REMOVED*** @private
***REMOVED***
goog.ui.TabPane.prototype.elButtonBar_;


***REMOVED***
***REMOVED*** Element containing the tab pages.
***REMOVED*** @type {Element}
***REMOVED*** @private
***REMOVED***
goog.ui.TabPane.prototype.elContent_;


***REMOVED***
***REMOVED*** Selected page.
***REMOVED*** @type {goog.ui.TabPane.TabPage?}
***REMOVED*** @private
***REMOVED***
goog.ui.TabPane.prototype.selected_;


***REMOVED***
***REMOVED*** Constants for event names
***REMOVED***
***REMOVED*** @type {Object}
***REMOVED***
goog.ui.TabPane.Events = {
  CHANGE: 'change'
***REMOVED***


***REMOVED***
***REMOVED*** Enum for representing the location of the tabs in relation to the content.
***REMOVED***
***REMOVED*** @enum {number}
***REMOVED***
goog.ui.TabPane.TabLocation = {
  TOP: 0,
  BOTTOM: 1,
  LEFT: 2,
  RIGHT: 3
***REMOVED***


***REMOVED***
***REMOVED*** Creates HTML nodes for tab pane.
***REMOVED***
***REMOVED*** @private
***REMOVED***
goog.ui.TabPane.prototype.create_ = function() {
  this.el_.className = goog.getCssName('goog-tabpane');

  var nodes = this.getChildNodes_();

  // Create tab strip
  this.elButtonBar_ = this.dom_.createDom('ul',
      {'className': goog.getCssName('goog-tabpane-tabs'), 'tabIndex': '0'});

  // Create content area
  this.elContent_ =
      this.dom_.createDom('div', goog.getCssName('goog-tabpane-cont'));
  this.el_.appendChild(this.elContent_);

  var element = goog.asserts.assertElement(this.el_);

  switch (this.tabLocation_) {
    case goog.ui.TabPane.TabLocation.TOP:
      element.insertBefore(this.elButtonBar_, this.elContent_);
      element.insertBefore(this.createClear_(), this.elContent_);
      goog.dom.classlist.add(element, goog.getCssName('goog-tabpane-top'));
      break;
    case goog.ui.TabPane.TabLocation.BOTTOM:
      element.appendChild(this.elButtonBar_);
      element.appendChild(this.createClear_());
      goog.dom.classlist.add(element, goog.getCssName('goog-tabpane-bottom'));
      break;
    case goog.ui.TabPane.TabLocation.LEFT:
      element.insertBefore(this.elButtonBar_, this.elContent_);
      goog.dom.classlist.add(element, goog.getCssName('goog-tabpane-left'));
      break;
    case goog.ui.TabPane.TabLocation.RIGHT:
      element.insertBefore(this.elButtonBar_, this.elContent_);
      goog.dom.classlist.add(element, goog.getCssName('goog-tabpane-right'));
      break;
    default:
      throw Error('Invalid tab location');
  }

  // Listen for click and keydown events on header
  this.elButtonBar_.tabIndex = 0;
***REMOVED***this.elButtonBar_,
      this.useMouseDown_ ?
      goog.events.EventType.MOUSEDOWN :
      goog.events.EventType.CLICK,
      this.onHeaderClick_, false, this);
***REMOVED***this.elButtonBar_, goog.events.EventType.KEYDOWN,
      this.onHeaderKeyDown_, false, this);

  this.createPages_(nodes);
***REMOVED***


***REMOVED***
***REMOVED*** Creates the HTML node for the clearing div, and associated style in
***REMOVED*** the <HEAD>.
***REMOVED***
***REMOVED*** @return {!Element} Reference to a DOM div node.
***REMOVED*** @private
***REMOVED***
goog.ui.TabPane.prototype.createClear_ = function() {
  var clearFloatStyle = '.' + goog.getCssName('goog-tabpane-clear') +
      ' { clear: both; height: 0px; overflow: hidden }';
  goog.style.installStyles(clearFloatStyle);
  return this.dom_.createDom('div', goog.getCssName('goog-tabpane-clear'));
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.ui.TabPane.prototype.disposeInternal = function() {
  goog.ui.TabPane.superClass_.disposeInternal.call(this);
  goog.events.unlisten(this.elButtonBar_,
      this.useMouseDown_ ?
      goog.events.EventType.MOUSEDOWN :
      goog.events.EventType.CLICK,
      this.onHeaderClick_, false, this);
  goog.events.unlisten(this.elButtonBar_, goog.events.EventType.KEYDOWN,
      this.onHeaderKeyDown_, false, this);
  delete this.el_;
  this.elButtonBar_ = null;
  this.elContent_ = null;
***REMOVED***


***REMOVED***
***REMOVED*** @return {!Array.<Element>} The element child nodes of tab pane container.
***REMOVED*** @private
***REMOVED***
goog.ui.TabPane.prototype.getChildNodes_ = function() {
  var nodes = [];

  var child = goog.dom.getFirstElementChild(this.el_);
  while (child) {
    nodes.push(child);
    child = goog.dom.getNextElementSibling(child);
  }

  return nodes;
***REMOVED***


***REMOVED***
***REMOVED*** Creates pages out of a collection of elements.
***REMOVED***
***REMOVED*** @param {Array.<Element>} nodes Array of elements to create pages out of.
***REMOVED*** @private
***REMOVED***
goog.ui.TabPane.prototype.createPages_ = function(nodes) {
  for (var node, i = 0; node = nodes[i]; i++) {
    this.addPage(new goog.ui.TabPane.TabPage(node));
  }
***REMOVED***


***REMOVED***
***REMOVED*** Adds a page to the tab pane.
***REMOVED***
***REMOVED*** @param {goog.ui.TabPane.TabPage} page Tab page to add.
***REMOVED*** @param {number=} opt_index Zero based index to insert tab at. Inserted at the
***REMOVED***                           end if not specified.
***REMOVED***
goog.ui.TabPane.prototype.addPage = function(page, opt_index) {
  // If page is already in another tab pane it's removed from that one before it
  // can be added to this one.
  if (page.parent_ && page.parent_ != this &&
      page.parent_ instanceof goog.ui.TabPane) {
    page.parent_.removePage(page);
  }

  // Insert page at specified position
  var index = this.pages_.length;
  if (goog.isDef(opt_index) && opt_index != index) {
    index = opt_index;
    this.pages_.splice(index, 0, page);
    this.elButtonBar_.insertBefore(page.elTitle_,
                                   this.elButtonBar_.childNodes[index]);
  }

  // Append page to end
  else {
    this.pages_.push(page);
    this.elButtonBar_.appendChild(page.elTitle_);
  }

  page.setParent_(this, index);

  // Select first page and fire change event
  if (!this.selected_) {
    this.selected_ = page;
    this.dispatchEvent(new goog.ui.TabPaneEvent(goog.ui.TabPane.Events.CHANGE,
                                                this, this.selected_));
  }

  // Move page content to the tab pane and update visibility.
  this.elContent_.appendChild(page.elContent_);
  page.setVisible_(page == this.selected_);

  // Update index for following pages
  for (var pg, i = index + 1; pg = this.pages_[i]; i++) {
    pg.index_ = i;
  }
***REMOVED***


***REMOVED***
***REMOVED*** Removes the specified page from the tab pane.
***REMOVED***
***REMOVED*** @param {goog.ui.TabPane.TabPage|number} page Reference to tab page or zero
***REMOVED***     based index.
***REMOVED***
goog.ui.TabPane.prototype.removePage = function(page) {
  if (goog.isNumber(page)) {
    page = this.pages_[page];
  }
  this.pages_.splice(page.index_, 1);
  page.setParent_(null);

  goog.dom.removeNode(page.elTitle_);
  goog.dom.removeNode(page.elContent_);

  for (var pg, i = 0; pg = this.pages_[i]; i++) {
    pg.setParent_(this, i);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Gets the tab page by zero based index.
***REMOVED***
***REMOVED*** @param {number} index Index of page to return.
***REMOVED*** @return {goog.ui.TabPane.TabPage?} page The tab page.
***REMOVED***
goog.ui.TabPane.prototype.getPage = function(index) {
  return this.pages_[index];
***REMOVED***


***REMOVED***
***REMOVED*** Sets the selected tab page by object reference.
***REMOVED***
***REMOVED*** @param {goog.ui.TabPane.TabPage} page Tab page to select.
***REMOVED***
goog.ui.TabPane.prototype.setSelectedPage = function(page) {
  if (page.isEnabled() &&
      (!this.selected_ || page != this.selected_)) {
    this.selected_.setVisible_(false);
    page.setVisible_(true);
    this.selected_ = page;

    // Fire changed event
    this.dispatchEvent(new goog.ui.TabPaneEvent(goog.ui.TabPane.Events.CHANGE,
                                                this, this.selected_));
  }
***REMOVED***


***REMOVED***
***REMOVED*** Sets the selected tab page by zero based index.
***REMOVED***
***REMOVED*** @param {number} index Index of page to select.
***REMOVED***
goog.ui.TabPane.prototype.setSelectedIndex = function(index) {
  if (index >= 0 && index < this.pages_.length) {
    this.setSelectedPage(this.pages_[index]);
  }
***REMOVED***


***REMOVED***
***REMOVED*** @return {number} The index for the selected tab page or -1 if no page is
***REMOVED***     selected.
***REMOVED***
goog.ui.TabPane.prototype.getSelectedIndex = function() {
  return this.selected_ ?***REMOVED*****REMOVED*** @type {number}***REMOVED*** (this.selected_.index_) : -1;
***REMOVED***


***REMOVED***
***REMOVED*** @return {goog.ui.TabPane.TabPage?} The selected tab page.
***REMOVED***
goog.ui.TabPane.prototype.getSelectedPage = function() {
  return this.selected_ || null;
***REMOVED***


***REMOVED***
***REMOVED*** @return {Element} The element that contains the tab pages.
***REMOVED***
goog.ui.TabPane.prototype.getContentElement = function() {
  return this.elContent_ || null;
***REMOVED***


***REMOVED***
***REMOVED*** @return {Element} The main element for the tabpane.
***REMOVED***
goog.ui.TabPane.prototype.getElement = function() {
  return this.el_ || null;
***REMOVED***


***REMOVED***
***REMOVED*** Click event handler for header element, handles clicks on tabs.
***REMOVED***
***REMOVED*** @param {goog.events.BrowserEvent} event Click event.
***REMOVED*** @private
***REMOVED***
goog.ui.TabPane.prototype.onHeaderClick_ = function(event) {
  var el = event.target;

  // Determine index if a tab (li element) was clicked.
  while (el != this.elButtonBar_) {
    if (el.tagName == 'LI') {
      var i;
      // {} prevents compiler warning
      for (i = 0; el = el.previousSibling; i++) {}
      this.setSelectedIndex(i);
      break;
    }
    el = el.parentNode;
  }
  event.preventDefault();
***REMOVED***


***REMOVED***
***REMOVED*** KeyDown event handler for header element. Arrow keys moves between pages.
***REMOVED*** Home and end selects the first/last page.
***REMOVED***
***REMOVED*** @param {goog.events.BrowserEvent} event KeyDown event.
***REMOVED*** @private
***REMOVED***
goog.ui.TabPane.prototype.onHeaderKeyDown_ = function(event) {
  if (event.altKey || event.metaKey || event.ctrlKey) {
    return;
  }

  switch (event.keyCode) {
    case goog.events.KeyCodes.LEFT:
      var index = this.selected_.getIndex() - 1;
      this.setSelectedIndex(index < 0 ? this.pages_.length - 1 : index);
      break;
    case goog.events.KeyCodes.RIGHT:
      var index = this.selected_.getIndex() + 1;
      this.setSelectedIndex(index >= this.pages_.length ? 0 : index);
      break;
    case goog.events.KeyCodes.HOME:
      this.setSelectedIndex(0);
      break;
    case goog.events.KeyCodes.END:
      this.setSelectedIndex(this.pages_.length - 1);
      break;
  }
***REMOVED***



***REMOVED***
***REMOVED*** Object representing an individual tab pane.
***REMOVED***
***REMOVED*** @param {Element=} opt_el Container element to create the pane out of.
***REMOVED*** @param {(Element|string)=} opt_title Pane title or element to use as the
***REMOVED***     title. If not specified the first element in the container is used as
***REMOVED***     the title.
***REMOVED*** @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper
***REMOVED*** The first parameter can be omitted.
***REMOVED***
***REMOVED***
goog.ui.TabPane.TabPage = function(opt_el, opt_title, opt_domHelper) {
  var title, el;
  if (goog.isString(opt_el) && !goog.isDef(opt_title)) {
    title = opt_el;
  } else if (opt_title) {
    title = opt_title;
    el = opt_el;
  } else if (opt_el) {
    var child = goog.dom.getFirstElementChild(opt_el);
    if (child) {
      title = goog.dom.getTextContent(child);
      child.parentNode.removeChild(child);
    }
    el = opt_el;
  }

 ***REMOVED*****REMOVED***
  ***REMOVED*** DomHelper used to interact with the document, allowing components to be
  ***REMOVED*** created in a different window.  This property is considered protected;
  ***REMOVED*** subclasses of Component may refer to it directly.
  ***REMOVED*** @type {goog.dom.DomHelper}
  ***REMOVED*** @protected
  ***REMOVED*** @suppress {underscore|visibility}
 ***REMOVED*****REMOVED***
  this.dom_ = opt_domHelper || goog.dom.getDomHelper();

 ***REMOVED*****REMOVED***
  ***REMOVED*** Content element
  ***REMOVED*** @type {Element}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.elContent_ = el || this.dom_.createDom('div');

 ***REMOVED*****REMOVED***
  ***REMOVED*** Title element
  ***REMOVED*** @type {Element}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.elTitle_ = this.dom_.createDom('li', null, title);

 ***REMOVED*****REMOVED***
  ***REMOVED*** Parent TabPane reference.
  ***REMOVED*** @type {goog.ui.TabPane?}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.parent_ = null;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Index for page in tab pane.
  ***REMOVED*** @type {?number}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.index_ = null;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Flags if this page is enabled and can be selected.
  ***REMOVED*** @type {boolean}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.enabled_ = true;
***REMOVED***


***REMOVED***
***REMOVED*** @return {string} The title for tab page.
***REMOVED***
goog.ui.TabPane.TabPage.prototype.getTitle = function() {
  return goog.dom.getTextContent(this.elTitle_);
***REMOVED***


***REMOVED***
***REMOVED*** Sets title for tab page.
***REMOVED***
***REMOVED*** @param {string} title Title for tab page.
***REMOVED***
goog.ui.TabPane.TabPage.prototype.setTitle = function(title) {
  goog.dom.setTextContent(this.elTitle_, title);
***REMOVED***


***REMOVED***
***REMOVED*** @return {Element} The title element.
***REMOVED***
goog.ui.TabPane.TabPage.prototype.getTitleElement = function() {
  return this.elTitle_;
***REMOVED***


***REMOVED***
***REMOVED*** @return {Element} The content element.
***REMOVED***
goog.ui.TabPane.TabPage.prototype.getContentElement = function() {
  return this.elContent_;
***REMOVED***


***REMOVED***
***REMOVED*** @return {?number} The index of page in tab pane.
***REMOVED***
goog.ui.TabPane.TabPage.prototype.getIndex = function() {
***REMOVED***
***REMOVED***


***REMOVED***
***REMOVED*** @return {goog.ui.TabPane?} The parent tab pane for page.
***REMOVED***
goog.ui.TabPane.TabPage.prototype.getParent = function() {
  return this.parent_;
***REMOVED***


***REMOVED***
***REMOVED*** Selects page in the associated tab pane.
***REMOVED***
goog.ui.TabPane.TabPage.prototype.select = function() {
  if (this.parent_) {
    this.parent_.setSelectedPage(this);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Sets the enabled state.
***REMOVED***
***REMOVED*** @param {boolean} enabled Enabled state.
***REMOVED***
goog.ui.TabPane.TabPage.prototype.setEnabled = function(enabled) {
  this.enabled_ = enabled;
  this.elTitle_.className = enabled ?
      goog.getCssName('goog-tabpane-tab') :
      goog.getCssName('goog-tabpane-tab-disabled');
***REMOVED***


***REMOVED***
***REMOVED*** Returns if the page is enabled.
***REMOVED*** @return {boolean} Whether the page is enabled or not.
***REMOVED***
goog.ui.TabPane.TabPage.prototype.isEnabled = function() {
  return this.enabled_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets visible state for page content and updates style of tab.
***REMOVED***
***REMOVED*** @param {boolean} visible Visible state.
***REMOVED*** @private
***REMOVED***
goog.ui.TabPane.TabPage.prototype.setVisible_ = function(visible) {
  if (this.isEnabled()) {
    this.elContent_.style.display = visible ? '' : 'none';
    this.elTitle_.className = visible ?
        goog.getCssName('goog-tabpane-tab-selected') :
        goog.getCssName('goog-tabpane-tab');
  }
***REMOVED***


***REMOVED***
***REMOVED*** Sets parent tab pane for tab page.
***REMOVED***
***REMOVED*** @param {goog.ui.TabPane?} tabPane Tab strip object.
***REMOVED*** @param {number=} opt_index Index of page in pane.
***REMOVED*** @private
***REMOVED***
goog.ui.TabPane.TabPage.prototype.setParent_ = function(tabPane, opt_index) {
  this.parent_ = tabPane;
  this.index_ = goog.isDef(opt_index) ? opt_index : null;
***REMOVED***



***REMOVED***
***REMOVED*** Object representing a tab pane page changed event.
***REMOVED***
***REMOVED*** @param {string} type Event type.
***REMOVED*** @param {goog.ui.TabPane} target Tab widget initiating event.
***REMOVED*** @param {goog.ui.TabPane.TabPage} page Selected page in tab pane.
***REMOVED*** @extends {goog.events.Event}
***REMOVED***
***REMOVED*** @final
***REMOVED***
goog.ui.TabPaneEvent = function(type, target, page) {
  goog.events.Event.call(this, type, target);

 ***REMOVED*****REMOVED***
  ***REMOVED*** The selected page.
  ***REMOVED*** @type {goog.ui.TabPane.TabPage}
 ***REMOVED*****REMOVED***
  this.page = page;
***REMOVED***
goog.inherits(goog.ui.TabPaneEvent, goog.events.Event);
