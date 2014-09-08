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
***REMOVED*** @fileoverview Zippy widget implementation.
***REMOVED***
***REMOVED*** @author eae@google.com (Emil A Eklund)
***REMOVED*** @see ../demos/zippy.html
***REMOVED***

goog.provide('goog.ui.Zippy');
goog.provide('goog.ui.Zippy.Events');
goog.provide('goog.ui.ZippyEvent');

goog.require('goog.a11y.aria');
goog.require('goog.a11y.aria.Role');
goog.require('goog.a11y.aria.State');
goog.require('goog.dom');
goog.require('goog.dom.classlist');
goog.require('goog.events.Event');
goog.require('goog.events.EventHandler');
goog.require('goog.events.EventTarget');
***REMOVED***
goog.require('goog.events.KeyCodes');
goog.require('goog.style');



***REMOVED***
***REMOVED*** Zippy widget. Expandable/collapsible container, clicking the header toggles
***REMOVED*** the visibility of the content.
***REMOVED***
***REMOVED*** @extends {goog.events.EventTarget}
***REMOVED*** @param {Element|string|null} header Header element, either element
***REMOVED***     reference, string id or null if no header exists.
***REMOVED*** @param {Element|string|function():Element=} opt_content Content element
***REMOVED***     (if any), either element reference or string id.  If skipped, the caller
***REMOVED***     should handle the TOGGLE event in its own way. If a function is passed,
***REMOVED***     then if will be called to create the content element the first time the
***REMOVED***     zippy is expanded.
***REMOVED*** @param {boolean=} opt_expanded Initial expanded/visibility state. Defaults to
***REMOVED***     false.
***REMOVED*** @param {Element|string=} opt_expandedHeader Element to use as the header when
***REMOVED***     the zippy is expanded.
***REMOVED*** @param {goog.dom.DomHelper=} opt_domHelper An optional DOM helper.
***REMOVED***
***REMOVED***
goog.ui.Zippy = function(header, opt_content, opt_expanded,
    opt_expandedHeader, opt_domHelper) {
  goog.ui.Zippy.base(this, 'constructor');

 ***REMOVED*****REMOVED***
  ***REMOVED*** DomHelper used to interact with the document, allowing components to be
  ***REMOVED*** created in a different window.
  ***REMOVED*** @type {!goog.dom.DomHelper}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.dom_ = opt_domHelper || goog.dom.getDomHelper();

 ***REMOVED*****REMOVED***
  ***REMOVED*** Header element or null if no header exists.
  ***REMOVED*** @type {Element}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.elHeader_ = this.dom_.getElement(header) || null;

 ***REMOVED*****REMOVED***
  ***REMOVED*** When present, the header to use when the zippy is expanded.
  ***REMOVED*** @type {Element}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.elExpandedHeader_ = this.dom_.getElement(opt_expandedHeader || null);

 ***REMOVED*****REMOVED***
  ***REMOVED*** Function that will create the content element, or false if there is no such
  ***REMOVED*** function.
  ***REMOVED*** @type {?function():Element}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.lazyCreateFunc_ = goog.isFunction(opt_content) ? opt_content : null;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Content element.
  ***REMOVED*** @type {Element}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.elContent_ = this.lazyCreateFunc_ || !opt_content ? null :
      this.dom_.getElement(***REMOVED*** @type {Element}***REMOVED*** (opt_content));

 ***REMOVED*****REMOVED***
  ***REMOVED*** Expanded state.
  ***REMOVED*** @type {boolean}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.expanded_ = opt_expanded == true;

 ***REMOVED*****REMOVED***
  ***REMOVED*** A keyboard events handler. If there are two headers it is shared for both.
  ***REMOVED*** @type {goog.events.EventHandler.<!goog.ui.Zippy>}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.keyboardEventHandler_ = new goog.events.EventHandler(this);

 ***REMOVED*****REMOVED***
  ***REMOVED*** A mouse events handler. If there are two headers it is shared for both.
  ***REMOVED*** @type {goog.events.EventHandler.<!goog.ui.Zippy>}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.mouseEventHandler_ = new goog.events.EventHandler(this);

***REMOVED***
  function addHeaderEvents(el) {
    if (el) {
      el.tabIndex = 0;
      goog.a11y.aria.setRole(el, self.getAriaRole());
      goog.dom.classlist.add(el, goog.getCssName('goog-zippy-header'));
      self.enableMouseEventsHandling_(el);
      self.enableKeyboardEventsHandling_(el);
    }
  }
  addHeaderEvents(this.elHeader_);
  addHeaderEvents(this.elExpandedHeader_);

  // initialize based on expanded state
  this.setExpanded(this.expanded_);
***REMOVED***
goog.inherits(goog.ui.Zippy, goog.events.EventTarget);


***REMOVED***
***REMOVED*** Constants for event names
***REMOVED***
***REMOVED*** @type {Object}
***REMOVED***
goog.ui.Zippy.Events = {
  // Zippy will dispatch an ACTION event for user interaction. Mimics
  // {@code goog.ui.Controls#performActionInternal} by first changing
  // the toggle state and then dispatching an ACTION event.
  ACTION: 'action',
  // Zippy state is toggled from collapsed to expanded or vice versa.
  TOGGLE: 'toggle'
***REMOVED***


***REMOVED***
***REMOVED*** Whether to listen for and handle mouse events; defaults to true.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.ui.Zippy.prototype.handleMouseEvents_ = true;


***REMOVED***
***REMOVED*** Whether to listen for and handle key events; defaults to true.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.ui.Zippy.prototype.handleKeyEvents_ = true;


***REMOVED*** @override***REMOVED***
goog.ui.Zippy.prototype.disposeInternal = function() {
  goog.ui.Zippy.base(this, 'disposeInternal');
  goog.dispose(this.keyboardEventHandler_);
  goog.dispose(this.mouseEventHandler_);
***REMOVED***


***REMOVED***
***REMOVED*** @return {goog.a11y.aria.Role} The ARIA role to be applied to Zippy element.
***REMOVED***
goog.ui.Zippy.prototype.getAriaRole = function() {
  return goog.a11y.aria.Role.TAB;
***REMOVED***


***REMOVED***
***REMOVED*** @return {Element} The content element.
***REMOVED***
goog.ui.Zippy.prototype.getContentElement = function() {
  return this.elContent_;
***REMOVED***


***REMOVED***
***REMOVED*** @return {Element} The visible header element.
***REMOVED***
goog.ui.Zippy.prototype.getVisibleHeaderElement = function() {
  var expandedHeader = this.elExpandedHeader_;
  return expandedHeader && goog.style.isElementShown(expandedHeader) ?
      expandedHeader : this.elHeader_;
***REMOVED***


***REMOVED***
***REMOVED*** Expands content pane.
***REMOVED***
goog.ui.Zippy.prototype.expand = function() {
  this.setExpanded(true);
***REMOVED***


***REMOVED***
***REMOVED*** Collapses content pane.
***REMOVED***
goog.ui.Zippy.prototype.collapse = function() {
  this.setExpanded(false);
***REMOVED***


***REMOVED***
***REMOVED*** Toggles expanded state.
***REMOVED***
goog.ui.Zippy.prototype.toggle = function() {
  this.setExpanded(!this.expanded_);
***REMOVED***


***REMOVED***
***REMOVED*** Sets expanded state.
***REMOVED***
***REMOVED*** @param {boolean} expanded Expanded/visibility state.
***REMOVED***
goog.ui.Zippy.prototype.setExpanded = function(expanded) {
  if (this.elContent_) {
    // Hide the element, if one is provided.
    goog.style.setElementShown(this.elContent_, expanded);
  } else if (expanded && this.lazyCreateFunc_) {
    // Assume that when the element is not hidden upon creation.
    this.elContent_ = this.lazyCreateFunc_();
  }
  if (this.elContent_) {
    goog.dom.classlist.add(this.elContent_,
        goog.getCssName('goog-zippy-content'));
  }

  if (this.elExpandedHeader_) {
    // Hide the show header and show the hide one.
    goog.style.setElementShown(this.elHeader_, !expanded);
    goog.style.setElementShown(this.elExpandedHeader_, expanded);
  } else {
    // Update header image, if any.
    this.updateHeaderClassName(expanded);
  }

  this.setExpandedInternal(expanded);

  // Fire toggle event
  this.dispatchEvent(new goog.ui.ZippyEvent(goog.ui.Zippy.Events.TOGGLE,
                                            this, this.expanded_));
***REMOVED***


***REMOVED***
***REMOVED*** Sets expanded internal state.
***REMOVED***
***REMOVED*** @param {boolean} expanded Expanded/visibility state.
***REMOVED*** @protected
***REMOVED***
goog.ui.Zippy.prototype.setExpandedInternal = function(expanded) {
  this.expanded_ = expanded;
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} Whether the zippy is expanded.
***REMOVED***
goog.ui.Zippy.prototype.isExpanded = function() {
  return this.expanded_;
***REMOVED***


***REMOVED***
***REMOVED*** Updates the header element's className and ARIA (accessibility) EXPANDED
***REMOVED*** state.
***REMOVED***
***REMOVED*** @param {boolean} expanded Expanded/visibility state.
***REMOVED*** @protected
***REMOVED***
goog.ui.Zippy.prototype.updateHeaderClassName = function(expanded) {
  if (this.elHeader_) {
    goog.dom.classlist.enable(this.elHeader_,
        goog.getCssName('goog-zippy-expanded'), expanded);
    goog.dom.classlist.enable(this.elHeader_,
        goog.getCssName('goog-zippy-collapsed'), !expanded);
    goog.a11y.aria.setState(this.elHeader_,
        goog.a11y.aria.State.EXPANDED,
        expanded);
  }
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} Whether the Zippy handles its own key events.
***REMOVED***
goog.ui.Zippy.prototype.isHandleKeyEvents = function() {
  return this.handleKeyEvents_;
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} Whether the Zippy handles its own mouse events.
***REMOVED***
goog.ui.Zippy.prototype.isHandleMouseEvents = function() {
  return this.handleMouseEvents_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets whether the Zippy handles it's own keyboard events.
***REMOVED*** @param {boolean} enable Whether the Zippy handles keyboard events.
***REMOVED***
goog.ui.Zippy.prototype.setHandleKeyboardEvents = function(enable) {
  if (this.handleKeyEvents_ != enable) {
    this.handleKeyEvents_ = enable;
    if (enable) {
      this.enableKeyboardEventsHandling_(this.elHeader_);
      this.enableKeyboardEventsHandling_(this.elExpandedHeader_);
    } else {
      this.keyboardEventHandler_.removeAll();
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** Sets whether the Zippy handles it's own mouse events.
***REMOVED*** @param {boolean} enable Whether the Zippy handles mouse events.
***REMOVED***
goog.ui.Zippy.prototype.setHandleMouseEvents = function(enable) {
  if (this.handleMouseEvents_ != enable) {
    this.handleMouseEvents_ = enable;
    if (enable) {
      this.enableMouseEventsHandling_(this.elHeader_);
      this.enableMouseEventsHandling_(this.elExpandedHeader_);
    } else {
      this.mouseEventHandler_.removeAll();
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** Enables keyboard events handling for the passed header element.
***REMOVED*** @param {Element} header The header element.
***REMOVED*** @private
***REMOVED***
goog.ui.Zippy.prototype.enableKeyboardEventsHandling_ = function(header) {
  if (header) {
    this.keyboardEventHandler_.listen(header, goog.events.EventType.KEYDOWN,
        this.onHeaderKeyDown_);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Enables mouse events handling for the passed header element.
***REMOVED*** @param {Element} header The header element.
***REMOVED*** @private
***REMOVED***
goog.ui.Zippy.prototype.enableMouseEventsHandling_ = function(header) {
  if (header) {
    this.mouseEventHandler_.listen(header, goog.events.EventType.CLICK,
        this.onHeaderClick_);
  }
***REMOVED***


***REMOVED***
***REMOVED*** KeyDown event handler for header element. Enter and space toggles expanded
***REMOVED*** state.
***REMOVED***
***REMOVED*** @param {goog.events.BrowserEvent} event KeyDown event.
***REMOVED*** @private
***REMOVED***
goog.ui.Zippy.prototype.onHeaderKeyDown_ = function(event) {
  if (event.keyCode == goog.events.KeyCodes.ENTER ||
      event.keyCode == goog.events.KeyCodes.SPACE) {

    this.toggle();
    this.dispatchActionEvent_();

    // Prevent enter key from submitting form.
    event.preventDefault();

    event.stopPropagation();
  }
***REMOVED***


***REMOVED***
***REMOVED*** Click event handler for header element.
***REMOVED***
***REMOVED*** @param {goog.events.BrowserEvent} event Click event.
***REMOVED*** @private
***REMOVED***
goog.ui.Zippy.prototype.onHeaderClick_ = function(event) {
  this.toggle();
  this.dispatchActionEvent_();
***REMOVED***


***REMOVED***
***REMOVED*** Dispatch an ACTION event whenever there is user interaction with the header.
***REMOVED*** Please note that after the zippy state change is completed a TOGGLE event
***REMOVED*** will be dispatched. However, the TOGGLE event is dispatch on every toggle,
***REMOVED*** including programmatic call to {@code #toggle}.
***REMOVED*** @private
***REMOVED***
goog.ui.Zippy.prototype.dispatchActionEvent_ = function() {
  this.dispatchEvent(new goog.events.Event(goog.ui.Zippy.Events.ACTION, this));
***REMOVED***



***REMOVED***
***REMOVED*** Object representing a zippy toggle event.
***REMOVED***
***REMOVED*** @param {string} type Event type.
***REMOVED*** @param {goog.ui.Zippy} target Zippy widget initiating event.
***REMOVED*** @param {boolean} expanded Expanded state.
***REMOVED*** @extends {goog.events.Event}
***REMOVED***
***REMOVED*** @final
***REMOVED***
goog.ui.ZippyEvent = function(type, target, expanded) {
  goog.ui.ZippyEvent.base(this, 'constructor', type, target);

 ***REMOVED*****REMOVED***
  ***REMOVED*** The expanded state.
  ***REMOVED*** @type {boolean}
 ***REMOVED*****REMOVED***
  this.expanded = expanded;
***REMOVED***
goog.inherits(goog.ui.ZippyEvent, goog.events.Event);
