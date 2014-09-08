// Copyright 2005 The Closure Library Authors. All Rights Reserved.
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
***REMOVED*** @fileoverview Base class for bubble plugins.
***REMOVED***

goog.provide('goog.editor.plugins.AbstractBubblePlugin');

goog.require('goog.dom');
goog.require('goog.dom.NodeType');
goog.require('goog.dom.Range');
goog.require('goog.dom.TagName');
goog.require('goog.editor.Plugin');
goog.require('goog.editor.style');
***REMOVED***
goog.require('goog.events.EventHandler');
***REMOVED***
goog.require('goog.events.KeyCodes');
goog.require('goog.events.actionEventWrapper');
goog.require('goog.functions');
goog.require('goog.string.Unicode');
goog.require('goog.ui.Component');
goog.require('goog.ui.editor.Bubble');
goog.require('goog.userAgent');



***REMOVED***
***REMOVED*** Base class for bubble plugins. This is used for to connect user behavior
***REMOVED*** in the editor to a goog.ui.editor.Bubble UI element that allows
***REMOVED*** the user to modify the properties of an element on their page (e.g. the alt
***REMOVED*** text of an image tag).
***REMOVED***
***REMOVED*** Subclasses should override the abstract method getBubbleTargetFromSelection()
***REMOVED*** with code to determine if the current selection should activate the bubble
***REMOVED*** type. The other abstract method createBubbleContents() should be overriden
***REMOVED*** with code to create the inside markup of the bubble.  The base class creates
***REMOVED*** the rest of the bubble.
***REMOVED***
***REMOVED***
***REMOVED*** @extends {goog.editor.Plugin}
***REMOVED***
goog.editor.plugins.AbstractBubblePlugin = function() {
  goog.editor.plugins.AbstractBubblePlugin.base(this, 'constructor');

 ***REMOVED*****REMOVED***
  ***REMOVED*** Place to register events the plugin listens to.
  ***REMOVED*** @type {goog.events.EventHandler.<
  ***REMOVED***     !goog.editor.plugins.AbstractBubblePlugin>}
  ***REMOVED*** @protected
 ***REMOVED*****REMOVED***
  this.eventRegister = new goog.events.EventHandler(this);

 ***REMOVED*****REMOVED***
  ***REMOVED*** Instance factory function that creates a bubble UI component.  If set to a
  ***REMOVED*** non-null value, this function will be used to create a bubble instead of
  ***REMOVED*** the global factory function.  It takes as parameters the bubble parent
  ***REMOVED*** element and the z index to draw the bubble at.
  ***REMOVED*** @type {?function(!Element, number): !goog.ui.editor.Bubble}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.bubbleFactory_ = null;
***REMOVED***
goog.inherits(goog.editor.plugins.AbstractBubblePlugin, goog.editor.Plugin);


***REMOVED***
***REMOVED*** The css class name of option link elements.
***REMOVED*** @type {string}
***REMOVED*** @private
***REMOVED***
goog.editor.plugins.AbstractBubblePlugin.OPTION_LINK_CLASSNAME_ =
    goog.getCssName('tr_option-link');


***REMOVED***
***REMOVED*** The css class name of link elements.
***REMOVED*** @type {string}
***REMOVED*** @private
***REMOVED***
goog.editor.plugins.AbstractBubblePlugin.LINK_CLASSNAME_ =
    goog.getCssName('tr_bubble_link');


***REMOVED***
***REMOVED*** The constant string used to separate option links.
***REMOVED*** @type {string}
***REMOVED*** @protected
***REMOVED***
goog.editor.plugins.AbstractBubblePlugin.DASH_NBSP_STRING =
    goog.string.Unicode.NBSP + '-' + goog.string.Unicode.NBSP;


***REMOVED***
***REMOVED*** Default factory function for creating a bubble UI component.
***REMOVED*** @param {!Element} parent The parent element for the bubble.
***REMOVED*** @param {number} zIndex The z index to draw the bubble at.
***REMOVED*** @return {!goog.ui.editor.Bubble} The new bubble component.
***REMOVED*** @private
***REMOVED***
goog.editor.plugins.AbstractBubblePlugin.defaultBubbleFactory_ = function(
    parent, zIndex) {
  return new goog.ui.editor.Bubble(parent, zIndex);
***REMOVED***


***REMOVED***
***REMOVED*** Global factory function that creates a bubble UI component. It takes as
***REMOVED*** parameters the bubble parent element and the z index to draw the bubble at.
***REMOVED*** @type {function(!Element, number): !goog.ui.editor.Bubble}
***REMOVED*** @private
***REMOVED***
goog.editor.plugins.AbstractBubblePlugin.globalBubbleFactory_ =
    goog.editor.plugins.AbstractBubblePlugin.defaultBubbleFactory_;


***REMOVED***
***REMOVED*** Sets the global bubble factory function.
***REMOVED*** @param {function(!Element, number): !goog.ui.editor.Bubble}
***REMOVED***     bubbleFactory Function that creates a bubble for the given bubble parent
***REMOVED***     element and z index.
***REMOVED***
goog.editor.plugins.AbstractBubblePlugin.setBubbleFactory = function(
    bubbleFactory) {
  goog.editor.plugins.AbstractBubblePlugin.globalBubbleFactory_ = bubbleFactory;
***REMOVED***


***REMOVED***
***REMOVED*** Map from field id to shared bubble object.
***REMOVED*** @type {!Object.<goog.ui.editor.Bubble>}
***REMOVED*** @private
***REMOVED***
goog.editor.plugins.AbstractBubblePlugin.bubbleMap_ = {***REMOVED***


***REMOVED***
***REMOVED*** The optional parent of the bubble.  If null or not set, we will use the
***REMOVED*** application document. This is useful when you have an editor embedded in
***REMOVED*** a scrolling DIV.
***REMOVED*** @type {Element|undefined}
***REMOVED*** @private
***REMOVED***
goog.editor.plugins.AbstractBubblePlugin.prototype.bubbleParent_;


***REMOVED***
***REMOVED*** The id of the panel this plugin added to the shared bubble.  Null when
***REMOVED*** this plugin doesn't currently have a panel in a bubble.
***REMOVED*** @type {string?}
***REMOVED*** @private
***REMOVED***
goog.editor.plugins.AbstractBubblePlugin.prototype.panelId_ = null;


***REMOVED***
***REMOVED*** Whether this bubble should support tabbing through the link elements. False
***REMOVED*** by default.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.editor.plugins.AbstractBubblePlugin.prototype.keyboardNavigationEnabled_ =
    false;


***REMOVED***
***REMOVED*** Sets the instance bubble factory function.  If set to a non-null value, this
***REMOVED*** function will be used to create a bubble instead of the global factory
***REMOVED*** function.
***REMOVED*** @param {?function(!Element, number): !goog.ui.editor.Bubble} bubbleFactory
***REMOVED***     Function that creates a bubble for the given bubble parent element and z
***REMOVED***     index.  Null to reset the factory function.
***REMOVED***
goog.editor.plugins.AbstractBubblePlugin.prototype.setBubbleFactory = function(
    bubbleFactory) {
  this.bubbleFactory_ = bubbleFactory;
***REMOVED***


***REMOVED***
***REMOVED*** Sets whether the bubble should support tabbing through the link elements.
***REMOVED*** @param {boolean} keyboardNavigationEnabled Whether the bubble should support
***REMOVED***     tabbing through the link elements.
***REMOVED***
goog.editor.plugins.AbstractBubblePlugin.prototype.enableKeyboardNavigation =
    function(keyboardNavigationEnabled) {
  this.keyboardNavigationEnabled_ = keyboardNavigationEnabled;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the bubble parent.
***REMOVED*** @param {Element} bubbleParent An element where the bubble will be
***REMOVED***     anchored. If null, we will use the application document. This
***REMOVED***     is useful when you have an editor embedded in a scrolling div.
***REMOVED***
goog.editor.plugins.AbstractBubblePlugin.prototype.setBubbleParent = function(
    bubbleParent) {
  this.bubbleParent_ = bubbleParent;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the bubble map.  Subclasses may override to use a separate map.
***REMOVED*** @return {!Object.<goog.ui.editor.Bubble>}
***REMOVED*** @protected
***REMOVED***
goog.editor.plugins.AbstractBubblePlugin.prototype.getBubbleMap = function() {
  return goog.editor.plugins.AbstractBubblePlugin.bubbleMap_;
***REMOVED***


***REMOVED***
***REMOVED*** @return {goog.dom.DomHelper} The dom helper for the bubble window.
***REMOVED***
goog.editor.plugins.AbstractBubblePlugin.prototype.getBubbleDom = function() {
  return this.dom_;
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.editor.plugins.AbstractBubblePlugin.prototype.getTrogClassId =
    goog.functions.constant('AbstractBubblePlugin');


***REMOVED***
***REMOVED*** Returns the element whose properties the bubble manipulates.
***REMOVED*** @return {Element} The target element.
***REMOVED***
goog.editor.plugins.AbstractBubblePlugin.prototype.getTargetElement =
    function() {
  return this.targetElement_;
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.editor.plugins.AbstractBubblePlugin.prototype.handleKeyUp = function(e) {
  // For example, when an image is selected, pressing any key overwrites
  // the image and the panel should be hidden.
  // Therefore we need to track key presses when the bubble is showing.
  if (this.isVisible()) {
    this.handleSelectionChange();
  }
  return false;
***REMOVED***


***REMOVED***
***REMOVED*** Pops up a property bubble for the given selection if appropriate and closes
***REMOVED*** open property bubbles if no longer needed.  This should not be overridden.
***REMOVED*** @override
***REMOVED***
goog.editor.plugins.AbstractBubblePlugin.prototype.handleSelectionChange =
    function(opt_e, opt_target) {
  var selectedElement;
  if (opt_e) {
    selectedElement =***REMOVED*****REMOVED*** @type {Element}***REMOVED*** (opt_e.target);
  } else if (opt_target) {
    selectedElement =***REMOVED*****REMOVED*** @type {Element}***REMOVED*** (opt_target);
  } else {
    var range = this.getFieldObject().getRange();
    if (range) {
      var startNode = range.getStartNode();
      var endNode = range.getEndNode();
      var startOffset = range.getStartOffset();
      var endOffset = range.getEndOffset();
      // Sometimes in IE, the range will be collapsed, but think the end node
      // and start node are different (although in the same visible position).
      // In this case, favor the position IE thinks is the start node.
      if (goog.userAgent.IE && range.isCollapsed() && startNode != endNode) {
        range = goog.dom.Range.createCaret(startNode, startOffset);
      }
      if (startNode.nodeType == goog.dom.NodeType.ELEMENT &&
          startNode == endNode && startOffset == endOffset - 1) {
        var element = startNode.childNodes[startOffset];
        if (element.nodeType == goog.dom.NodeType.ELEMENT) {
          selectedElement = element;
        }
      }
    }
    selectedElement = selectedElement || range && range.getContainerElement();
  }
  return this.handleSelectionChangeInternal(selectedElement);
***REMOVED***


***REMOVED***
***REMOVED*** Pops up a property bubble for the given selection if appropriate and closes
***REMOVED*** open property bubbles if no longer needed.
***REMOVED*** @param {Element?} selectedElement The selected element.
***REMOVED*** @return {boolean} Always false, allowing every bubble plugin to handle the
***REMOVED***     event.
***REMOVED*** @protected
***REMOVED***
goog.editor.plugins.AbstractBubblePlugin.prototype.
    handleSelectionChangeInternal = function(selectedElement) {
  if (selectedElement) {
    var bubbleTarget = this.getBubbleTargetFromSelection(selectedElement);
    if (bubbleTarget) {
      if (bubbleTarget != this.targetElement_ || !this.panelId_) {
        // Make sure any existing panel of the same type is closed before
        // creating a new one.
        if (this.panelId_) {
          this.closeBubble();
        }
        this.createBubble(bubbleTarget);
      }
      return false;
    }
  }

  if (this.panelId_) {
    this.closeBubble();
  }

  return false;
***REMOVED***


***REMOVED***
***REMOVED*** Should be overriden by subclasses to return the bubble target element or
***REMOVED*** null if an element of their required type isn't found.
***REMOVED*** @param {Element} selectedElement The target of the selection change event or
***REMOVED***     the parent container of the current entire selection.
***REMOVED*** @return {Element?} The HTML bubble target element or null if no element of
***REMOVED***     the required type is not found.
***REMOVED***
goog.editor.plugins.AbstractBubblePlugin.prototype.
    getBubbleTargetFromSelection = goog.abstractMethod;


***REMOVED*** @override***REMOVED***
goog.editor.plugins.AbstractBubblePlugin.prototype.disable = function(field) {
  // When the field is made uneditable, dispose of the bubble.  We do this
  // because the next time the field is made editable again it may be in
  // a different document / iframe.
  if (field.isUneditable()) {
    var bubbleMap = this.getBubbleMap();
    var bubble = bubbleMap[field.id];
    if (bubble) {
      bubble.dispose();
      delete bubbleMap[field.id];
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** @return {!goog.ui.editor.Bubble} The shared bubble object for the field this
***REMOVED***     plugin is registered on.  Creates it if necessary.
***REMOVED*** @private
***REMOVED***
goog.editor.plugins.AbstractBubblePlugin.prototype.getSharedBubble_ =
    function() {
  var bubbleParent =***REMOVED*****REMOVED*** @type {!Element}***REMOVED*** (this.bubbleParent_ ||
      this.getFieldObject().getAppWindow().document.body);
  this.dom_ = goog.dom.getDomHelper(bubbleParent);

  var bubbleMap = this.getBubbleMap();
  var bubble = bubbleMap[this.getFieldObject().id];
  if (!bubble) {
    var factory = this.bubbleFactory_ ||
        goog.editor.plugins.AbstractBubblePlugin.globalBubbleFactory_;
    bubble = factory.call(null, bubbleParent,
        this.getFieldObject().getBaseZindex());
    bubbleMap[this.getFieldObject().id] = bubble;
  }
  return bubble;
***REMOVED***


***REMOVED***
***REMOVED*** Creates and shows the property bubble.
***REMOVED*** @param {Element} targetElement The target element of the bubble.
***REMOVED***
goog.editor.plugins.AbstractBubblePlugin.prototype.createBubble = function(
    targetElement) {
  var bubble = this.getSharedBubble_();
  if (!bubble.hasPanelOfType(this.getBubbleType())) {
    this.targetElement_ = targetElement;

    this.panelId_ = bubble.addPanel(this.getBubbleType(), this.getBubbleTitle(),
        targetElement,
        goog.bind(this.createBubbleContents, this),
        this.shouldPreferBubbleAboveElement());
    this.eventRegister.listen(bubble, goog.ui.Component.EventType.HIDE,
        this.handlePanelClosed_);

    this.onShow();

    if (this.keyboardNavigationEnabled_) {
      this.eventRegister.listen(bubble.getContentElement(),
          goog.events.EventType.KEYDOWN, this.onBubbleKey_);
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** @return {string} The type of bubble shown by this plugin.  Usually the tag
***REMOVED***     name of the element this bubble targets.
***REMOVED*** @protected
***REMOVED***
goog.editor.plugins.AbstractBubblePlugin.prototype.getBubbleType = function() {
  return '';
***REMOVED***


***REMOVED***
***REMOVED*** @return {string} The title for bubble shown by this plugin.  Defaults to no
***REMOVED***     title.  Should be overridden by subclasses.
***REMOVED*** @protected
***REMOVED***
goog.editor.plugins.AbstractBubblePlugin.prototype.getBubbleTitle = function() {
  return '';
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} Whether the bubble should prefer placement above the
***REMOVED***     target element.
***REMOVED*** @protected
***REMOVED***
goog.editor.plugins.AbstractBubblePlugin.prototype.
    shouldPreferBubbleAboveElement = goog.functions.FALSE;


***REMOVED***
***REMOVED*** Should be overriden by subclasses to add the type specific contents to the
***REMOVED***     bubble.
***REMOVED*** @param {Element} bubbleContainer The container element of the bubble to
***REMOVED***     which the contents should be added.
***REMOVED*** @protected
***REMOVED***
goog.editor.plugins.AbstractBubblePlugin.prototype.createBubbleContents =
    goog.abstractMethod;


***REMOVED***
***REMOVED*** Register the handler for the target's CLICK event.
***REMOVED*** @param {Element} target The event source element.
***REMOVED*** @param {Function} handler The event handler.
***REMOVED*** @protected
***REMOVED*** @deprecated Use goog.editor.plugins.AbstractBubblePlugin.
***REMOVED***     registerActionHandler to register click and enter events.
***REMOVED***
goog.editor.plugins.AbstractBubblePlugin.prototype.registerClickHandler =
    function(target, handler) {
  this.registerActionHandler(target, handler);
***REMOVED***


***REMOVED***
***REMOVED*** Register the handler for the target's CLICK and ENTER key events.
***REMOVED*** @param {Element} target The event source element.
***REMOVED*** @param {Function} handler The event handler.
***REMOVED*** @protected
***REMOVED***
goog.editor.plugins.AbstractBubblePlugin.prototype.registerActionHandler =
    function(target, handler) {
  this.eventRegister.listenWithWrapper(target, goog.events.actionEventWrapper,
      handler);
***REMOVED***


***REMOVED***
***REMOVED*** Closes the bubble.
***REMOVED***
goog.editor.plugins.AbstractBubblePlugin.prototype.closeBubble = function() {
  if (this.panelId_) {
    this.getSharedBubble_().removePanel(this.panelId_);
    this.handlePanelClosed_();
  }
***REMOVED***


***REMOVED***
***REMOVED*** Called after the bubble is shown. The default implementation does nothing.
***REMOVED*** Override it to provide your own one.
***REMOVED*** @protected
***REMOVED***
goog.editor.plugins.AbstractBubblePlugin.prototype.onShow = goog.nullFunction;


***REMOVED***
***REMOVED*** Called when the bubble is closed or hidden. The default implementation does
***REMOVED*** nothing.
***REMOVED*** @protected
***REMOVED***
goog.editor.plugins.AbstractBubblePlugin.prototype.cleanOnBubbleClose =
    goog.nullFunction;


***REMOVED***
***REMOVED*** Handles when the bubble panel is closed.  Invoked when the entire bubble is
***REMOVED*** hidden and also directly when the panel is closed manually.
***REMOVED*** @private
***REMOVED***
goog.editor.plugins.AbstractBubblePlugin.prototype.handlePanelClosed_ =
    function() {
  this.targetElement_ = null;
  this.panelId_ = null;
  this.eventRegister.removeAll();
  this.cleanOnBubbleClose();
***REMOVED***


***REMOVED***
***REMOVED*** In case the keyboard navigation is enabled, this will focus to the first link
***REMOVED*** element in the bubble when TAB is clicked. The user could still go through
***REMOVED*** the rest of tabbable UI elements using shift + TAB.
***REMOVED*** @override
***REMOVED***
goog.editor.plugins.AbstractBubblePlugin.prototype.handleKeyDown = function(e) {
  if (this.keyboardNavigationEnabled_ &&
      this.isVisible() &&
      e.keyCode == goog.events.KeyCodes.TAB && !e.shiftKey) {
    var bubbleEl = this.getSharedBubble_().getContentElement();
    var linkEl = goog.dom.getElementByClass(
        goog.editor.plugins.AbstractBubblePlugin.LINK_CLASSNAME_, bubbleEl);
    if (linkEl) {
      linkEl.focus();
      e.preventDefault();
      return true;
    }
  }
  return false;
***REMOVED***


***REMOVED***
***REMOVED*** Handles a key event on the bubble. This ensures that the focus loops through
***REMOVED*** the link elements found in the bubble and then the focus is got by the field
***REMOVED*** element.
***REMOVED*** @param {goog.events.BrowserEvent} e The event.
***REMOVED*** @private
***REMOVED***
goog.editor.plugins.AbstractBubblePlugin.prototype.onBubbleKey_ = function(e) {
  if (this.isVisible() &&
      e.keyCode == goog.events.KeyCodes.TAB) {
    var bubbleEl = this.getSharedBubble_().getContentElement();
    var links = goog.dom.getElementsByClass(
        goog.editor.plugins.AbstractBubblePlugin.LINK_CLASSNAME_, bubbleEl);
    var tabbingOutOfBubble = e.shiftKey ?
        links[0] == e.target :
        links.length && links[links.length - 1] == e.target;
    if (tabbingOutOfBubble) {
      this.getFieldObject().focus();
      e.preventDefault();
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} Whether the bubble is visible.
***REMOVED***
goog.editor.plugins.AbstractBubblePlugin.prototype.isVisible = function() {
  return !!this.panelId_;
***REMOVED***


***REMOVED***
***REMOVED*** Reposition the property bubble.
***REMOVED***
goog.editor.plugins.AbstractBubblePlugin.prototype.reposition = function() {
  var bubble = this.getSharedBubble_();
  if (bubble) {
    bubble.reposition();
  }
***REMOVED***


***REMOVED***
***REMOVED*** Helper method that creates option links (such as edit, test, remove)
***REMOVED*** @param {string} id String id for the span id.
***REMOVED*** @return {Element} The option link element.
***REMOVED*** @protected
***REMOVED***
goog.editor.plugins.AbstractBubblePlugin.prototype.createLinkOption = function(
    id) {
  // Dash plus link are together in a span so we can hide/show them easily
  return this.dom_.createDom(goog.dom.TagName.SPAN,
      {
        id: id,
        className:
            goog.editor.plugins.AbstractBubblePlugin.OPTION_LINK_CLASSNAME_
      },
      this.dom_.createTextNode(
          goog.editor.plugins.AbstractBubblePlugin.DASH_NBSP_STRING));
***REMOVED***


***REMOVED***
***REMOVED*** Helper method that creates a link with text set to linkText and optionaly
***REMOVED*** wires up a listener for the CLICK event or the link.
***REMOVED*** @param {string} linkId The id of the link.
***REMOVED*** @param {string} linkText Text of the link.
***REMOVED*** @param {Function=} opt_onClick Optional function to call when the link is
***REMOVED***     clicked.
***REMOVED*** @param {Element=} opt_container If specified, location to insert link. If no
***REMOVED***     container is specified, the old link is removed and replaced.
***REMOVED*** @return {Element} The link element.
***REMOVED*** @protected
***REMOVED***
goog.editor.plugins.AbstractBubblePlugin.prototype.createLink = function(
    linkId, linkText, opt_onClick, opt_container) {
  var link = this.createLinkHelper(linkId, linkText, false, opt_container);
  if (opt_onClick) {
    this.registerActionHandler(link, opt_onClick);
  }
  return link;
***REMOVED***


***REMOVED***
***REMOVED*** Helper method to create a link to insert into the bubble.
***REMOVED*** @param {string} linkId The id of the link.
***REMOVED*** @param {string} linkText Text of the link.
***REMOVED*** @param {boolean} isAnchor Set to true to create an actual anchor tag
***REMOVED***     instead of a span.  Actual links are right clickable (e.g. to open in
***REMOVED***     a new window) and also update window status on hover.
***REMOVED*** @param {Element=} opt_container If specified, location to insert link. If no
***REMOVED***     container is specified, the old link is removed and replaced.
***REMOVED*** @return {Element} The link element.
***REMOVED*** @protected
***REMOVED***
goog.editor.plugins.AbstractBubblePlugin.prototype.createLinkHelper = function(
    linkId, linkText, isAnchor, opt_container) {
  var link = this.dom_.createDom(
      isAnchor ? goog.dom.TagName.A : goog.dom.TagName.SPAN,
      {className: goog.editor.plugins.AbstractBubblePlugin.LINK_CLASSNAME_},
      linkText);
  if (this.keyboardNavigationEnabled_) {
    link.setAttribute('tabindex', 0);
  }
  link.setAttribute('role', 'link');
  this.setupLink(link, linkId, opt_container);
  goog.editor.style.makeUnselectable(link, this.eventRegister);
  return link;
***REMOVED***


***REMOVED***
***REMOVED*** Inserts a link in the given container if it is specified or removes
***REMOVED*** the old link with this id and replaces it with the new link
***REMOVED*** @param {Element} link Html element to insert.
***REMOVED*** @param {string} linkId Id of the link.
***REMOVED*** @param {Element=} opt_container If specified, location to insert link.
***REMOVED*** @protected
***REMOVED***
goog.editor.plugins.AbstractBubblePlugin.prototype.setupLink = function(
    link, linkId, opt_container) {
  if (opt_container) {
    opt_container.appendChild(link);
  } else {
    var oldLink = this.dom_.getElement(linkId);
    if (oldLink) {
      goog.dom.replaceNode(link, oldLink);
    }
  }

  link.id = linkId;
***REMOVED***
