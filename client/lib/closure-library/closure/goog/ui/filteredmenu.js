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
***REMOVED*** @fileoverview Menu where items can be filtered based on user keyboard input.
***REMOVED*** If a filter is specified only the items matching it will be displayed.
***REMOVED***
***REMOVED*** @author eae@google.com (Emil A Eklund)
***REMOVED*** @see ../demos/filteredmenu.html
***REMOVED***


goog.provide('goog.ui.FilteredMenu');

goog.require('goog.a11y.aria');
goog.require('goog.a11y.aria.AutoCompleteValues');
goog.require('goog.a11y.aria.State');
goog.require('goog.dom');
***REMOVED***
***REMOVED***
goog.require('goog.events.InputHandler');
goog.require('goog.events.KeyCodes');
goog.require('goog.object');
goog.require('goog.string');
goog.require('goog.style');
goog.require('goog.ui.Component');
goog.require('goog.ui.FilterObservingMenuItem');
goog.require('goog.ui.Menu');
goog.require('goog.ui.MenuItem');
goog.require('goog.userAgent');



***REMOVED***
***REMOVED*** Filtered menu class.
***REMOVED*** @param {goog.ui.MenuRenderer=} opt_renderer Renderer used to render filtered
***REMOVED***     menu; defaults to {@link goog.ui.MenuRenderer}.
***REMOVED*** @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper.
***REMOVED***
***REMOVED*** @extends {goog.ui.Menu}
***REMOVED***
goog.ui.FilteredMenu = function(opt_renderer, opt_domHelper) {
  goog.ui.Menu.call(this, opt_domHelper, opt_renderer);
***REMOVED***
goog.inherits(goog.ui.FilteredMenu, goog.ui.Menu);


***REMOVED***
***REMOVED*** Events fired by component.
***REMOVED*** @enum {string}
***REMOVED***
goog.ui.FilteredMenu.EventType = {
 ***REMOVED*****REMOVED*** Dispatched after the component filter criteria has been changed.***REMOVED***
  FILTER_CHANGED: 'filterchange'
***REMOVED***


***REMOVED***
***REMOVED*** Filter menu element ids.
***REMOVED*** @enum {string}
***REMOVED*** @private
***REMOVED***
goog.ui.FilteredMenu.Id_ = {
  CONTENT_ELEMENT: 'content-el'
***REMOVED***


***REMOVED***
***REMOVED*** Filter input element.
***REMOVED*** @type {Element|undefined}
***REMOVED*** @private
***REMOVED***
goog.ui.FilteredMenu.prototype.filterInput_;


***REMOVED***
***REMOVED*** The input handler that provides the input event.
***REMOVED*** @type {goog.events.InputHandler|undefined}
***REMOVED*** @private
***REMOVED***
goog.ui.FilteredMenu.prototype.inputHandler_;


***REMOVED***
***REMOVED*** Maximum number of characters for filter input.
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.ui.FilteredMenu.prototype.maxLength_ = 0;


***REMOVED***
***REMOVED*** Label displayed in the filter input when no text has been entered.
***REMOVED*** @type {string}
***REMOVED*** @private
***REMOVED***
goog.ui.FilteredMenu.prototype.label_ = '';


***REMOVED***
***REMOVED*** Label element.
***REMOVED*** @type {Element|undefined}
***REMOVED*** @private
***REMOVED***
goog.ui.FilteredMenu.prototype.labelEl_;


***REMOVED***
***REMOVED*** Whether multiple items can be entered comma separated.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.ui.FilteredMenu.prototype.allowMultiple_ = false;


***REMOVED***
***REMOVED*** List of items entered in the search box if multiple entries are allowed.
***REMOVED*** @type {Array.<string>|undefined}
***REMOVED*** @private
***REMOVED***
goog.ui.FilteredMenu.prototype.enteredItems_;


***REMOVED***
***REMOVED*** Index of first item that should be affected by the filter. Menu items with
***REMOVED*** a lower index will not be affected by the filter.
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.ui.FilteredMenu.prototype.filterFromIndex_ = 0;


***REMOVED***
***REMOVED*** Filter applied to the menu.
***REMOVED*** @type {string|undefined|null}
***REMOVED*** @private
***REMOVED***
goog.ui.FilteredMenu.prototype.filterStr_;


***REMOVED***
***REMOVED*** Map of child nodes that shouldn't be affected by filtering.
***REMOVED*** @type {Object|undefined}
***REMOVED*** @private
***REMOVED***
goog.ui.FilteredMenu.prototype.persistentChildren_;


***REMOVED*** @override***REMOVED***
goog.ui.FilteredMenu.prototype.createDom = function() {
  goog.ui.FilteredMenu.superClass_.createDom.call(this);

  var dom = this.getDomHelper();
  var el = dom.createDom('div',
      goog.getCssName(this.getRenderer().getCssClass(), 'filter'),
      this.labelEl_ = dom.createDom('div', null, this.label_),
      this.filterInput_ = dom.createDom('input', {'type': 'text'}));
  var element = this.getElement();
  dom.appendChild(element, el);
  var contentElementId = this.makeId(goog.ui.FilteredMenu.Id_.CONTENT_ELEMENT);
  this.contentElement_ = dom.createDom('div', goog.object.create(
      'class', goog.getCssName(this.getRenderer().getCssClass(), 'content'),
      'id', contentElementId));
  dom.appendChild(element, this.contentElement_);

  this.initFilterInput_();

  goog.a11y.aria.setState(this.filterInput_, goog.a11y.aria.State.AUTOCOMPLETE,
      goog.a11y.aria.AutoCompleteValues.LIST);
  goog.a11y.aria.setState(this.filterInput_, goog.a11y.aria.State.OWNS,
      contentElementId);
  goog.a11y.aria.setState(this.filterInput_, goog.a11y.aria.State.EXPANDED,
      true);
***REMOVED***


***REMOVED***
***REMOVED*** Helper method that initializes the filter input element.
***REMOVED*** @private
***REMOVED***
goog.ui.FilteredMenu.prototype.initFilterInput_ = function() {
  this.setFocusable(true);
  this.setKeyEventTarget(this.filterInput_);

  // Workaround for mozilla bug #236791.
  if (goog.userAgent.GECKO) {
    this.filterInput_.setAttribute('autocomplete', 'off');
  }

  if (this.maxLength_) {
    this.filterInput_.maxLength = this.maxLength_;
  }
***REMOVED***


***REMOVED***
***REMOVED*** Sets up listeners and prepares the filter functionality.
***REMOVED*** @private
***REMOVED***
goog.ui.FilteredMenu.prototype.setUpFilterListeners_ = function() {
  if (!this.inputHandler_ && this.filterInput_) {
    this.inputHandler_ = new goog.events.InputHandler(
       ***REMOVED*****REMOVED*** @type {Element}***REMOVED*** (this.filterInput_));
    goog.style.setUnselectable(this.filterInput_, false);
  ***REMOVED***this.inputHandler_,
                       goog.events.InputHandler.EventType.INPUT,
                       this.handleFilterEvent, false, this);
  ***REMOVED***this.filterInput_.parentNode,
                       goog.events.EventType.CLICK,
                       this.onFilterLabelClick_, false, this);
    if (this.allowMultiple_) {
      this.enteredItems_ = [];
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** Tears down listeners and resets the filter functionality.
***REMOVED*** @private
***REMOVED***
goog.ui.FilteredMenu.prototype.tearDownFilterListeners_ = function() {
  if (this.inputHandler_) {
    goog.events.unlisten(this.inputHandler_,
                         goog.events.InputHandler.EventType.INPUT,
                         this.handleFilterEvent, false, this);
    goog.events.unlisten(this.filterInput_.parentNode,
                         goog.events.EventType.CLICK,
                         this.onFilterLabelClick_, false, this);

    this.inputHandler_.dispose();
    this.inputHandler_ = undefined;
    this.enteredItems_ = undefined;
  }
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.ui.FilteredMenu.prototype.setVisible = function(show, opt_force, opt_e) {
  var visibilityChanged = goog.ui.FilteredMenu.superClass_.setVisible.call(this,
      show, opt_force, opt_e);
  if (visibilityChanged && show && this.isInDocument()) {
    this.setFilter('');
    this.setUpFilterListeners_();
  } else if (visibilityChanged && !show) {
    this.tearDownFilterListeners_();
  }

  return visibilityChanged;
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.ui.FilteredMenu.prototype.disposeInternal = function() {
  this.tearDownFilterListeners_();
  this.filterInput_ = undefined;
  this.labelEl_ = undefined;
  goog.ui.FilteredMenu.superClass_.disposeInternal.call(this);
***REMOVED***


***REMOVED***
***REMOVED*** Sets the filter label (the label displayed in the filter input element if no
***REMOVED*** text has been entered).
***REMOVED*** @param {?string} label Label text.
***REMOVED***
goog.ui.FilteredMenu.prototype.setFilterLabel = function(label) {
  this.label_ = label || '';
  if (this.labelEl_) {
    goog.dom.setTextContent(this.labelEl_, this.label_);
  }
***REMOVED***


***REMOVED***
***REMOVED*** @return {string} The filter label.
***REMOVED***
goog.ui.FilteredMenu.prototype.getFilterLabel = function() {
  return this.label_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the filter string.
***REMOVED*** @param {?string} str Filter string.
***REMOVED***
goog.ui.FilteredMenu.prototype.setFilter = function(str) {
  if (this.filterInput_) {
    this.filterInput_.value = str;
    this.filterItems_(str);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Returns the filter string.
***REMOVED*** @return {string} Current filter or an an empty string.
***REMOVED***
goog.ui.FilteredMenu.prototype.getFilter = function() {
  return this.filterInput_ && goog.isString(this.filterInput_.value) ?
      this.filterInput_.value : '';
***REMOVED***


***REMOVED***
***REMOVED*** Sets the index of first item that should be affected by the filter. Menu
***REMOVED*** items with a lower index will not be affected by the filter.
***REMOVED*** @param {number} index Index of first item that should be affected by filter.
***REMOVED***
goog.ui.FilteredMenu.prototype.setFilterFromIndex = function(index) {
  this.filterFromIndex_ = index;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the index of first item that is affected by the filter.
***REMOVED*** @return {number} Index of first item that is affected by filter.
***REMOVED***
goog.ui.FilteredMenu.prototype.getFilterFromIndex = function() {
  return this.filterFromIndex_;
***REMOVED***


***REMOVED***
***REMOVED*** Gets a list of items entered in the search box.
***REMOVED*** @return {!Array.<string>} The entered items.
***REMOVED***
goog.ui.FilteredMenu.prototype.getEnteredItems = function() {
  return this.enteredItems_ || [];
***REMOVED***


***REMOVED***
***REMOVED*** Sets whether multiple items can be entered comma separated.
***REMOVED*** @param {boolean} b Whether multiple items can be entered.
***REMOVED***
goog.ui.FilteredMenu.prototype.setAllowMultiple = function(b) {
  this.allowMultiple_ = b;
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} Whether multiple items can be entered comma separated.
***REMOVED***
goog.ui.FilteredMenu.prototype.getAllowMultiple = function() {
  return this.allowMultiple_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets whether the specified child should be affected (shown/hidden) by the
***REMOVED*** filter criteria.
***REMOVED*** @param {goog.ui.Component} child Child to change.
***REMOVED*** @param {boolean} persistent Whether the child should be persistent.
***REMOVED***
goog.ui.FilteredMenu.prototype.setPersistentVisibility = function(child,
                                                                  persistent) {
  if (!this.persistentChildren_) {
    this.persistentChildren_ = {***REMOVED***
  }
  this.persistentChildren_[child.getId()] = persistent;
***REMOVED***


***REMOVED***
***REMOVED*** Returns whether the specified child should be affected (shown/hidden) by the
***REMOVED*** filter criteria.
***REMOVED*** @param {goog.ui.Component} child Menu item to check.
***REMOVED*** @return {boolean} Whether the menu item is persistent.
***REMOVED***
goog.ui.FilteredMenu.prototype.hasPersistentVisibility = function(child) {
  return !!(this.persistentChildren_ &&
            this.persistentChildren_[child.getId()]);
***REMOVED***


***REMOVED***
***REMOVED*** Handles filter input events.
***REMOVED*** @param {goog.events.BrowserEvent} e The event object.
***REMOVED***
goog.ui.FilteredMenu.prototype.handleFilterEvent = function(e) {
  this.filterItems_(this.filterInput_.value);

  // Highlight the first visible item unless there's already a highlighted item.
  var highlighted = this.getHighlighted();
  if (!highlighted || !highlighted.isVisible()) {
    this.highlightFirst();
  }
  this.dispatchEvent(goog.ui.FilteredMenu.EventType.FILTER_CHANGED);
***REMOVED***


***REMOVED***
***REMOVED*** Shows/hides elements based on the supplied filter.
***REMOVED*** @param {?string} str Filter string.
***REMOVED*** @private
***REMOVED***
goog.ui.FilteredMenu.prototype.filterItems_ = function(str) {
  // Do nothing unless the filter string has changed.
  if (this.filterStr_ == str) {
    return;
  }

  if (this.labelEl_) {
    this.labelEl_.style.visibility = str == '' ? 'visible' : 'hidden';
  }

  if (this.allowMultiple_ && this.enteredItems_) {
    // Matches all non space characters after the last comma.
    var lastWordRegExp = /^(.+),[ ]*([^,]*)$/;
    var matches = str.match(lastWordRegExp);
    // matches[1] is the string up to, but not including, the last comma and
    // matches[2] the part after the last comma. If there are no non-space
    // characters after the last comma matches[2] is undefined.
    var items = matches && matches[1] ? matches[1].split(',') : [];

    // If the number of comma separated items has changes recreate the
    // entered items array and fire a change event.
    if (str.substr(str.length - 1, 1) == ',' ||
        items.length != this.enteredItems_.length) {
      var lastItem = items[items.length - 1] || '';

      // Auto complete text in input box based on the highlighted item.
      if (this.getHighlighted() && lastItem != '') {
        var caption = this.getHighlighted().getCaption();
        if (caption.toLowerCase().indexOf(lastItem.toLowerCase()) == 0) {
          items[items.length - 1] = caption;
          this.filterInput_.value = items.join(',') + ',';
        }
      }
      this.enteredItems_ = items;
      this.dispatchEvent(goog.ui.Component.EventType.CHANGE);
      this.setHighlightedIndex(-1);
    }

    if (matches) {
      str = matches.length > 2 ? goog.string.trim(matches[2]) : '';
    }
  }

  var matcher = new RegExp('(^|[- ,_/.:])' +
      goog.string.regExpEscape(str), 'i');
  for (var child, i = this.filterFromIndex_; child = this.getChildAt(i); i++) {
    if (child instanceof goog.ui.FilterObservingMenuItem) {
      child.callObserver(str);
    } else if (!this.hasPersistentVisibility(child)) {
      // Only show items matching the filter and highlight the part of the
      // caption that matches.
      var caption = child.getCaption();
      if (caption) {
        var matchArray = caption.match(matcher);
        if (str == '' || matchArray) {
          child.setVisible(true);
          var pos = caption.indexOf(matchArray[0]);

          // If position is non zero increase by one to skip the separator.
          if (pos) {
            pos++;
          }
          this.boldContent_(child, pos, str.length);
        } else {
          child.setVisible(false);
        }
      } else {

        // Hide separators and other items without a caption if a filter string
        // has been entered.
        child.setVisible(str == '');
      }
    }
  }
  this.filterStr_ = str;
***REMOVED***


***REMOVED***
***REMOVED*** Updates the content of the given menu item, bolding the part of its caption
***REMOVED*** from start and through the next len characters.
***REMOVED*** @param {!goog.ui.Control} child The control to bold content on.
***REMOVED*** @param {number} start The index at which to start bolding.
***REMOVED*** @param {number} len How many characters to bold.
***REMOVED*** @private
***REMOVED***
goog.ui.FilteredMenu.prototype.boldContent_ = function(child, start, len) {
  var caption = child.getCaption();
  var boldedCaption;
  if (len == 0) {
    boldedCaption = this.getDomHelper().createTextNode(caption);
  } else {
    var preMatch = caption.substr(0, start);
    var match = caption.substr(start, len);
    var postMatch = caption.substr(start + len);
    boldedCaption = this.getDomHelper().createDom(
        'span',
        null,
        preMatch,
        this.getDomHelper().createDom('b', null, match),
        postMatch);
  }
  var accelerator = child.getAccelerator && child.getAccelerator();
  if (accelerator) {
    child.setContent([boldedCaption, this.getDomHelper().createDom('span',
        goog.ui.MenuItem.ACCELERATOR_CLASS, accelerator)]);
  } else {
    child.setContent(boldedCaption);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Handles the menu's behavior for a key event. The highlighted menu item will
***REMOVED*** be given the opportunity to handle the key behavior.
***REMOVED*** @param {goog.events.KeyEvent} e A browser event.
***REMOVED*** @return {boolean} Whether the event was handled.
***REMOVED*** @override
***REMOVED***
goog.ui.FilteredMenu.prototype.handleKeyEventInternal = function(e) {
  // Home, end and the arrow keys are normally used to change the selected menu
  // item. Return false here to prevent the menu from preventing the default
  // behavior for HOME, END and any key press with a modifier.
  if (e.shiftKey || e.ctrlKey || e.altKey ||
      e.keyCode == goog.events.KeyCodes.HOME ||
      e.keyCode == goog.events.KeyCodes.END) {
    return false;
  }

  if (e.keyCode == goog.events.KeyCodes.ESC) {
    this.dispatchEvent(goog.ui.Component.EventType.BLUR);
    return true;
  }

  return goog.ui.FilteredMenu.superClass_.handleKeyEventInternal.call(this, e);
***REMOVED***


***REMOVED***
***REMOVED*** Sets the highlighted index, unless the HIGHLIGHT event is intercepted and
***REMOVED*** cancelled.  -1 = no highlight. Also scrolls the menu item into view.
***REMOVED*** @param {number} index Index of menu item to highlight.
***REMOVED*** @override
***REMOVED***
goog.ui.FilteredMenu.prototype.setHighlightedIndex = function(index) {
  goog.ui.FilteredMenu.superClass_.setHighlightedIndex.call(this, index);
  var contentEl = this.getContentElement();
  var el = this.getHighlighted() ? this.getHighlighted().getElement() : null;
  if (this.filterInput_) {
    goog.a11y.aria.setActiveDescendant(this.filterInput_, el);
  }

  if (el && goog.dom.contains(contentEl, el)) {
    var contentTop = goog.userAgent.IE && !goog.userAgent.isVersionOrHigher(8) ?
        0 : contentEl.offsetTop;

    // IE (tested on IE8) sometime does not scroll enough by about
    // 1px. So we add 1px to the scroll amount. This still looks ok in
    // other browser except for the most degenerate case (menu height <=
    // item height).

    // Scroll down if the highlighted item is below the bottom edge.
    var diff = (el.offsetTop + el.offsetHeight - contentTop) -
        (contentEl.clientHeight + contentEl.scrollTop) + 1;
    contentEl.scrollTop += Math.max(diff, 0);

    // Scroll up if the highlighted item is above the top edge.
    diff = contentEl.scrollTop - (el.offsetTop - contentTop) + 1;
    contentEl.scrollTop -= Math.max(diff, 0);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Handles clicks on the filter label. Focuses the input element.
***REMOVED*** @param {goog.events.BrowserEvent} e A browser event.
***REMOVED*** @private
***REMOVED***
goog.ui.FilteredMenu.prototype.onFilterLabelClick_ = function(e) {
  this.filterInput_.focus();
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.ui.FilteredMenu.prototype.getContentElement = function() {
  return this.contentElement_ || this.getElement();
***REMOVED***


***REMOVED***
***REMOVED*** Returns the filter input element.
***REMOVED*** @return {Element} Input element.
***REMOVED***
goog.ui.FilteredMenu.prototype.getFilterInputElement = function() {
  return this.filterInput_ || null;
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.ui.FilteredMenu.prototype.decorateInternal = function(element) {
  this.setElementInternal(element);

  // Decorate the menu content.
  this.decorateContent(element);

  // Locate internally managed elements.
  var el = this.getDomHelper().getElementsByTagNameAndClass('div',
      goog.getCssName(this.getRenderer().getCssClass(), 'filter'), element)[0];
  this.labelEl_ = goog.dom.getFirstElementChild(el);
  this.filterInput_ = goog.dom.getNextElementSibling(this.labelEl_);
  this.contentElement_ = goog.dom.getNextElementSibling(el);

  // Decorate additional menu items (like 'apply').
  this.getRenderer().decorateChildren(this, el.parentNode,
      this.contentElement_);

  this.initFilterInput_();
***REMOVED***
