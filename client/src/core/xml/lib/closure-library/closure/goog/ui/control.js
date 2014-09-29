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
***REMOVED*** @fileoverview Base class for UI controls such as buttons, menus, menu items,
***REMOVED*** toolbar buttons, etc.  The implementation is based on a generalized version
***REMOVED*** of {@link goog.ui.MenuItem}.
***REMOVED*** TODO(attila):  If the renderer framework works well, pull it into Component.
***REMOVED***
***REMOVED*** @author attila@google.com (Attila Bodis)
***REMOVED*** @see ../demos/control.html
***REMOVED*** @see http://code.google.com/p/closure-library/wiki/IntroToControls
***REMOVED***

goog.provide('goog.ui.Control');

goog.require('goog.array');
goog.require('goog.dom');
goog.require('goog.events.BrowserEvent.MouseButton');
goog.require('goog.events.Event');
***REMOVED***
goog.require('goog.events.KeyCodes');
goog.require('goog.events.KeyHandler');
goog.require('goog.events.KeyHandler.EventType');
goog.require('goog.string');
goog.require('goog.ui.Component');
goog.require('goog.ui.Component.Error');
goog.require('goog.ui.Component.EventType');
goog.require('goog.ui.Component.State');
goog.require('goog.ui.ControlContent');
goog.require('goog.ui.ControlRenderer');
goog.require('goog.ui.decorate');
goog.require('goog.ui.registry');
goog.require('goog.userAgent');



***REMOVED***
***REMOVED*** Base class for UI controls.  Extends {@link goog.ui.Component} by adding
***REMOVED*** the following:
***REMOVED***  <ul>
***REMOVED***    <li>a {@link goog.events.KeyHandler}, to simplify keyboard handling,
***REMOVED***    <li>a pluggable <em>renderer</em> framework, to simplify the creation of
***REMOVED***        simple controls without the need to subclass this class,
***REMOVED***    <li>the notion of component <em>content</em>, like a text caption or DOM
***REMOVED***        structure displayed in the component (e.g. a button label),
***REMOVED***    <li>getter and setter for component content, as well as a getter and
***REMOVED***        setter specifically for caption text (for convenience),
***REMOVED***    <li>support for hiding/showing the component,
      <li>fine-grained control over supported states and state transition
          events, and
***REMOVED***    <li>default mouse and keyboard event handling.
***REMOVED***  </ul>
***REMOVED*** This class has sufficient built-in functionality for most simple UI controls.
***REMOVED*** All controls dispatch SHOW, HIDE, ENTER, LEAVE, and ACTION events on show,
***REMOVED*** hide, mouseover, mouseout, and user action, respectively.  Additional states
***REMOVED*** are also supported.  See closure/demos/control.html
***REMOVED*** for example usage.
***REMOVED*** @param {goog.ui.ControlContent} content Text caption or DOM structure
***REMOVED***     to display as the content of the component (if any).
***REMOVED*** @param {goog.ui.ControlRenderer=} opt_renderer Renderer used to render or
***REMOVED***     decorate the component; defaults to {@link goog.ui.ControlRenderer}.
***REMOVED*** @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper, used for
***REMOVED***     document interaction.
***REMOVED***
***REMOVED*** @extends {goog.ui.Component}
***REMOVED***
goog.ui.Control = function(content, opt_renderer, opt_domHelper) {
  goog.ui.Component.call(this, opt_domHelper);
  this.renderer_ = opt_renderer ||
      goog.ui.registry.getDefaultRenderer(this.constructor);
  this.setContentInternal(content);
***REMOVED***
goog.inherits(goog.ui.Control, goog.ui.Component);


// Renderer registry.
// TODO(attila): Refactor existing usages inside Google in a follow-up CL.


***REMOVED***
***REMOVED*** Maps a CSS class name to a function that returns a new instance of
***REMOVED*** {@link goog.ui.Control} or a subclass thereof, suitable to decorate
***REMOVED*** an element that has the specified CSS class.  UI components that extend
***REMOVED*** {@link goog.ui.Control} and want {@link goog.ui.Container}s to be able
***REMOVED*** to discover and decorate elements using them should register a factory
***REMOVED*** function via this API.
***REMOVED*** @param {string} className CSS class name.
***REMOVED*** @param {Function} decoratorFunction Function that takes no arguments and
***REMOVED***     returns a new instance of a control to decorate an element with the
***REMOVED***     given class.
***REMOVED*** @deprecated Use {@link goog.ui.registry.setDecoratorByClassName} instead.
***REMOVED***
goog.ui.Control.registerDecorator = goog.ui.registry.setDecoratorByClassName;


***REMOVED***
***REMOVED*** Takes an element and returns a new instance of {@link goog.ui.Control}
***REMOVED*** or a subclass, suitable to decorate it (based on the element's CSS class).
***REMOVED*** @param {Element} element Element to decorate.
***REMOVED*** @return {goog.ui.Control?} New control instance to decorate the element
***REMOVED***     (null if none).
***REMOVED*** @deprecated Use {@link goog.ui.registry.getDecorator} instead.
***REMOVED***
goog.ui.Control.getDecorator =
   ***REMOVED*****REMOVED*** @type {function(Element): goog.ui.Control}***REMOVED*** (
        goog.ui.registry.getDecorator);


***REMOVED***
***REMOVED*** Takes an element, and decorates it with a {@link goog.ui.Control} instance
***REMOVED*** if a suitable decorator is found.
***REMOVED*** @param {Element} element Element to decorate.
***REMOVED*** @return {goog.ui.Control?} New control instance that decorates the element
***REMOVED***     (null if none).
***REMOVED*** @deprecated Use {@link goog.ui.decorate} instead.
***REMOVED***
goog.ui.Control.decorate =***REMOVED*****REMOVED*** @type {function(Element): goog.ui.Control}***REMOVED*** (
    goog.ui.decorate);


***REMOVED***
***REMOVED*** Renderer associated with the component.
***REMOVED*** @type {goog.ui.ControlRenderer|undefined}
***REMOVED*** @private
***REMOVED***
goog.ui.Control.prototype.renderer_;


***REMOVED***
***REMOVED*** Text caption or DOM structure displayed in the component.
***REMOVED*** @type {goog.ui.ControlContent}
***REMOVED*** @private
***REMOVED***
goog.ui.Control.prototype.content_ = null;


***REMOVED***
***REMOVED*** Current component state; a bit mask of {@link goog.ui.Component.State}s.
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.ui.Control.prototype.state_ = 0x00;


***REMOVED***
***REMOVED*** A bit mask of {@link goog.ui.Component.State}s this component supports.
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.ui.Control.prototype.supportedStates_ =
    goog.ui.Component.State.DISABLED |
    goog.ui.Component.State.HOVER |
    goog.ui.Component.State.ACTIVE |
    goog.ui.Component.State.FOCUSED;


***REMOVED***
***REMOVED*** A bit mask of {@link goog.ui.Component.State}s for which this component
***REMOVED*** provides default event handling.  For example, a component that handles
***REMOVED*** the HOVER state automatically will highlight itself on mouseover, whereas
***REMOVED*** a component that doesn't handle HOVER automatically will only dispatch
***REMOVED*** ENTER and LEAVE events but not call {@link setHighlighted} on itself.
***REMOVED*** By default, components provide default event handling for all states.
***REMOVED*** Controls hosted in containers (e.g. menu items in a menu, or buttons in a
***REMOVED*** toolbar) will typically want to have their container manage their highlight
***REMOVED*** state.  Selectable controls managed by a selection model will also typically
***REMOVED*** want their selection state to be managed by the model.
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.ui.Control.prototype.autoStates_ = goog.ui.Component.State.ALL;


***REMOVED***
***REMOVED*** A bit mask of {@link goog.ui.Component.State}s for which this component
***REMOVED*** dispatches state transition events.  Because events are expensive, the
***REMOVED*** default behavior is to not dispatch any state transition events at all.
***REMOVED*** Use the {@link #setDispatchTransitionEvents} API to request transition
***REMOVED*** events  as needed.  Subclasses may enable transition events by default.
***REMOVED*** Controls hosted in containers or managed by a selection model will typically
***REMOVED*** want to dispatch transition events.
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.ui.Control.prototype.statesWithTransitionEvents_ = 0x00;


***REMOVED***
***REMOVED*** Component visibility.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.ui.Control.prototype.visible_ = true;


***REMOVED***
***REMOVED*** Keyboard event handler.
***REMOVED*** @type {goog.events.KeyHandler}
***REMOVED*** @private
***REMOVED***
goog.ui.Control.prototype.keyHandler_;


***REMOVED***
***REMOVED*** Additional class name(s) to apply to the control's root element, if any.
***REMOVED*** @type {Array.<string>?}
***REMOVED*** @private
***REMOVED***
goog.ui.Control.prototype.extraClassNames_ = null;


***REMOVED***
***REMOVED*** Whether the control should listen for and handle mouse events; defaults to
***REMOVED*** true.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.ui.Control.prototype.handleMouseEvents_ = true;


***REMOVED***
***REMOVED*** Whether the control allows text selection within its DOM.  Defaults to false.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.ui.Control.prototype.allowTextSelection_ = false;


***REMOVED***
***REMOVED*** The control's preferred ARIA role.
***REMOVED*** @type {?goog.a11y.aria.Role}
***REMOVED*** @private
***REMOVED***
goog.ui.Control.prototype.preferredAriaRole_ = null;


// Event handler and renderer management.


***REMOVED***
***REMOVED*** Returns true if the control is configured to handle its own mouse events,
***REMOVED*** false otherwise.  Controls not hosted in {@link goog.ui.Container}s have
***REMOVED*** to handle their own mouse events, but controls hosted in containers may
***REMOVED*** allow their parent to handle mouse events on their behalf.  Considered
***REMOVED*** protected; should only be used within this package and by subclasses.
***REMOVED*** @return {boolean} Whether the control handles its own mouse events.
***REMOVED***
goog.ui.Control.prototype.isHandleMouseEvents = function() {
  return this.handleMouseEvents_;
***REMOVED***


***REMOVED***
***REMOVED*** Enables or disables mouse event handling for the control.  Containers may
***REMOVED*** use this method to disable mouse event handling in their child controls.
***REMOVED*** Considered protected; should only be used within this package and by
***REMOVED*** subclasses.
***REMOVED*** @param {boolean} enable Whether to enable or disable mouse event handling.
***REMOVED***
goog.ui.Control.prototype.setHandleMouseEvents = function(enable) {
  if (this.isInDocument() && enable != this.handleMouseEvents_) {
    // Already in the document; need to update event handler.
    this.enableMouseEventHandling_(enable);
  }
  this.handleMouseEvents_ = enable;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the DOM element on which the control is listening for keyboard
***REMOVED*** events (null if none).
***REMOVED*** @return {Element} Element on which the control is listening for key
***REMOVED***     events.
***REMOVED***
goog.ui.Control.prototype.getKeyEventTarget = function() {
  // Delegate to renderer.
  return this.renderer_.getKeyEventTarget(this);
***REMOVED***


***REMOVED***
***REMOVED*** Returns the keyboard event handler for this component, lazily created the
***REMOVED*** first time this method is called.  Considered protected; should only be
***REMOVED*** used within this package and by subclasses.
***REMOVED*** @return {goog.events.KeyHandler} Keyboard event handler for this component.
***REMOVED*** @protected
***REMOVED***
goog.ui.Control.prototype.getKeyHandler = function() {
  return this.keyHandler_ || (this.keyHandler_ = new goog.events.KeyHandler());
***REMOVED***


***REMOVED***
***REMOVED*** Returns the renderer used by this component to render itself or to decorate
***REMOVED*** an existing element.
***REMOVED*** @return {goog.ui.ControlRenderer|undefined} Renderer used by the component
***REMOVED***     (undefined if none).
***REMOVED***
goog.ui.Control.prototype.getRenderer = function() {
  return this.renderer_;
***REMOVED***


***REMOVED***
***REMOVED*** Registers the given renderer with the component.  Changing renderers after
***REMOVED*** the component has entered the document is an error.
***REMOVED*** @param {goog.ui.ControlRenderer} renderer Renderer used by the component.
***REMOVED*** @throws {Error} If the control is already in the document.
***REMOVED***
goog.ui.Control.prototype.setRenderer = function(renderer) {
  if (this.isInDocument()) {
    // Too late.
    throw Error(goog.ui.Component.Error.ALREADY_RENDERED);
  }

  if (this.getElement()) {
    // The component has already been rendered, but isn't yet in the document.
    // Replace the renderer and delete the current DOM, so it can be re-rendered
    // using the new renderer the next time someone calls render().
    this.setElementInternal(null);
  }

  this.renderer_ = renderer;
***REMOVED***


// Support for additional styling.


***REMOVED***
***REMOVED*** Returns any additional class name(s) to be applied to the component's
***REMOVED*** root element, or null if no extra class names are needed.
***REMOVED*** @return {Array.<string>?} Additional class names to be applied to
***REMOVED***     the component's root element (null if none).
***REMOVED***
goog.ui.Control.prototype.getExtraClassNames = function() {
  return this.extraClassNames_;
***REMOVED***


***REMOVED***
***REMOVED*** Adds the given class name to the list of classes to be applied to the
***REMOVED*** component's root element.
***REMOVED*** @param {string} className Additional class name to be applied to the
***REMOVED***     component's root element.
***REMOVED***
goog.ui.Control.prototype.addClassName = function(className) {
  if (className) {
    if (this.extraClassNames_) {
      if (!goog.array.contains(this.extraClassNames_, className)) {
        this.extraClassNames_.push(className);
      }
    } else {
      this.extraClassNames_ = [className];
    }
    this.renderer_.enableExtraClassName(this, className, true);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Removes the given class name from the list of classes to be applied to
***REMOVED*** the component's root element.
***REMOVED*** @param {string} className Class name to be removed from the component's root
***REMOVED***     element.
***REMOVED***
goog.ui.Control.prototype.removeClassName = function(className) {
  if (className && this.extraClassNames_) {
    goog.array.remove(this.extraClassNames_, className);
    if (this.extraClassNames_.length == 0) {
      this.extraClassNames_ = null;
    }
    this.renderer_.enableExtraClassName(this, className, false);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Adds or removes the given class name to/from the list of classes to be
***REMOVED*** applied to the component's root element.
***REMOVED*** @param {string} className CSS class name to add or remove.
***REMOVED*** @param {boolean} enable Whether to add or remove the class name.
***REMOVED***
goog.ui.Control.prototype.enableClassName = function(className, enable) {
  if (enable) {
    this.addClassName(className);
  } else {
    this.removeClassName(className);
  }
***REMOVED***


// Standard goog.ui.Component implementation.


***REMOVED***
***REMOVED*** Creates the control's DOM.  Overrides {@link goog.ui.Component#createDom} by
***REMOVED*** delegating DOM manipulation to the control's renderer.
***REMOVED*** @override
***REMOVED***
goog.ui.Control.prototype.createDom = function() {
  var element = this.renderer_.createDom(this);
  this.setElementInternal(element);

  // Initialize ARIA role.
  this.renderer_.setAriaRole(element, this.getPreferredAriaRole());

  // Initialize text selection.
  if (!this.isAllowTextSelection()) {
    // The renderer is assumed to create selectable elements.  Since making
    // elements unselectable is expensive, only do it if needed (bug 1037090).
    this.renderer_.setAllowTextSelection(element, false);
  }

  // Initialize visibility.
  if (!this.isVisible()) {
    // The renderer is assumed to create visible elements. Since hiding
    // elements can be expensive, only do it if needed (bug 1037105).
    this.renderer_.setVisible(element, false);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Returns the control's preferred ARIA role. This can be used by a control to
***REMOVED*** override the role that would be assigned by the renderer.  This is useful in
***REMOVED*** cases where a different ARIA role is appropriate for a control because of the
***REMOVED*** context in which it's used.  E.g., a {@link goog.ui.MenuButton} added to a
***REMOVED*** {@link goog.ui.Select} should have an ARIA role of LISTBOX and not MENUITEM.
***REMOVED*** @return {?goog.a11y.aria.Role} This control's preferred ARIA role or null if
***REMOVED***     no preferred ARIA role is set.
***REMOVED***
goog.ui.Control.prototype.getPreferredAriaRole = function() {
  return this.preferredAriaRole_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the control's preferred ARIA role. This can be used to override the role
***REMOVED*** that would be assigned by the renderer.  This is useful in cases where a
***REMOVED*** different ARIA role is appropriate for a control because of the
***REMOVED*** context in which it's used.  E.g., a {@link goog.ui.MenuButton} added to a
***REMOVED*** {@link goog.ui.Select} should have an ARIA role of LISTBOX and not MENUITEM.
***REMOVED*** @param {goog.a11y.aria.Role} role This control's preferred ARIA role.
***REMOVED***
goog.ui.Control.prototype.setPreferredAriaRole = function(role) {
  this.preferredAriaRole_ = role;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the DOM element into which child components are to be rendered,
***REMOVED*** or null if the control itself hasn't been rendered yet.  Overrides
***REMOVED*** {@link goog.ui.Component#getContentElement} by delegating to the renderer.
***REMOVED*** @return {Element} Element to contain child elements (null if none).
***REMOVED*** @override
***REMOVED***
goog.ui.Control.prototype.getContentElement = function() {
  // Delegate to renderer.
  return this.renderer_.getContentElement(this.getElement());
***REMOVED***


***REMOVED***
***REMOVED*** Returns true if the given element can be decorated by this component.
***REMOVED*** Overrides {@link goog.ui.Component#canDecorate}.
***REMOVED*** @param {Element} element Element to decorate.
***REMOVED*** @return {boolean} Whether the element can be decorated by this component.
***REMOVED*** @override
***REMOVED***
goog.ui.Control.prototype.canDecorate = function(element) {
  // Controls support pluggable renderers; delegate to the renderer.
  return this.renderer_.canDecorate(element);
***REMOVED***


***REMOVED***
***REMOVED*** Decorates the given element with this component. Overrides {@link
***REMOVED*** goog.ui.Component#decorateInternal} by delegating DOM manipulation
***REMOVED*** to the control's renderer.
***REMOVED*** @param {Element} element Element to decorate.
***REMOVED*** @protected
***REMOVED*** @override
***REMOVED***
goog.ui.Control.prototype.decorateInternal = function(element) {
  element = this.renderer_.decorate(this, element);
  this.setElementInternal(element);

  // Initialize ARIA role.
  this.renderer_.setAriaRole(element, this.getPreferredAriaRole());

  // Initialize text selection.
  if (!this.isAllowTextSelection()) {
    // Decorated elements are assumed to be selectable.  Since making elements
    // unselectable is expensive, only do it if needed (bug 1037090).
    this.renderer_.setAllowTextSelection(element, false);
  }

  // Initialize visibility based on the decorated element's styling.
  this.visible_ = element.style.display != 'none';
***REMOVED***


***REMOVED***
***REMOVED*** Configures the component after its DOM has been rendered, and sets up event
***REMOVED*** handling.  Overrides {@link goog.ui.Component#enterDocument}.
***REMOVED*** @override
***REMOVED***
goog.ui.Control.prototype.enterDocument = function() {
  goog.ui.Control.superClass_.enterDocument.call(this);

  // Call the renderer's initializeDom method to configure properties of the
  // control's DOM that can only be done once it's in the document.
  this.renderer_.initializeDom(this);

  // Initialize event handling if at least one state other than DISABLED is
  // supported.
  if (this.supportedStates_ & ~goog.ui.Component.State.DISABLED) {
    // Initialize mouse event handling if the control is configured to handle
    // its own mouse events.  (Controls hosted in containers don't need to
    // handle their own mouse events.)
    if (this.isHandleMouseEvents()) {
      this.enableMouseEventHandling_(true);
    }

    // Initialize keyboard event handling if the control is focusable and has
    // a key event target.  (Controls hosted in containers typically aren't
    // focusable, allowing their container to handle keyboard events for them.)
    if (this.isSupportedState(goog.ui.Component.State.FOCUSED)) {
      var keyTarget = this.getKeyEventTarget();
      if (keyTarget) {
        var keyHandler = this.getKeyHandler();
        keyHandler.attach(keyTarget);
        this.getHandler().
            listen(keyHandler, goog.events.KeyHandler.EventType.KEY,
                this.handleKeyEvent).
            listen(keyTarget, goog.events.EventType.FOCUS,
                this.handleFocus).
            listen(keyTarget, goog.events.EventType.BLUR,
                this.handleBlur);
      }
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** Enables or disables mouse event handling on the control.
***REMOVED*** @param {boolean} enable Whether to enable mouse event handling.
***REMOVED*** @private
***REMOVED***
goog.ui.Control.prototype.enableMouseEventHandling_ = function(enable) {
  var handler = this.getHandler();
  var element = this.getElement();
  if (enable) {
    handler.
        listen(element, goog.events.EventType.MOUSEOVER, this.handleMouseOver).
        listen(element, goog.events.EventType.MOUSEDOWN, this.handleMouseDown).
        listen(element, goog.events.EventType.MOUSEUP, this.handleMouseUp).
        listen(element, goog.events.EventType.MOUSEOUT, this.handleMouseOut);
    if (this.handleContextMenu != goog.nullFunction) {
      handler.listen(element, goog.events.EventType.CONTEXTMENU,
          this.handleContextMenu);
    }
    if (goog.userAgent.IE) {
      handler.listen(element, goog.events.EventType.DBLCLICK,
          this.handleDblClick);
    }
  } else {
    handler.
        unlisten(element, goog.events.EventType.MOUSEOVER,
            this.handleMouseOver).
        unlisten(element, goog.events.EventType.MOUSEDOWN,
            this.handleMouseDown).
        unlisten(element, goog.events.EventType.MOUSEUP, this.handleMouseUp).
        unlisten(element, goog.events.EventType.MOUSEOUT, this.handleMouseOut);
    if (this.handleContextMenu != goog.nullFunction) {
      handler.unlisten(element, goog.events.EventType.CONTEXTMENU,
          this.handleContextMenu);
    }
    if (goog.userAgent.IE) {
      handler.unlisten(element, goog.events.EventType.DBLCLICK,
          this.handleDblClick);
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** Cleans up the component before its DOM is removed from the document, and
***REMOVED*** removes event handlers.  Overrides {@link goog.ui.Component#exitDocument}
***REMOVED*** by making sure that components that are removed from the document aren't
***REMOVED*** focusable (i.e. have no tab index).
***REMOVED*** @override
***REMOVED***
goog.ui.Control.prototype.exitDocument = function() {
  goog.ui.Control.superClass_.exitDocument.call(this);
  if (this.keyHandler_) {
    this.keyHandler_.detach();
  }
  if (this.isVisible() && this.isEnabled()) {
    this.renderer_.setFocusable(this, false);
  }
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.ui.Control.prototype.disposeInternal = function() {
  goog.ui.Control.superClass_.disposeInternal.call(this);
  if (this.keyHandler_) {
    this.keyHandler_.dispose();
    delete this.keyHandler_;
  }
  delete this.renderer_;
  this.content_ = null;
  this.extraClassNames_ = null;
***REMOVED***


// Component content management.


***REMOVED***
***REMOVED*** Returns the text caption or DOM structure displayed in the component.
***REMOVED*** @return {goog.ui.ControlContent} Text caption or DOM structure
***REMOVED***     comprising the component's contents.
***REMOVED***
goog.ui.Control.prototype.getContent = function() {
  return this.content_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the component's content to the given text caption, element, or array of
***REMOVED*** nodes.  (If the argument is an array of nodes, it must be an actual array,
***REMOVED*** not an array-like object.)
***REMOVED*** @param {goog.ui.ControlContent} content Text caption or DOM
***REMOVED***     structure to set as the component's contents.
***REMOVED***
goog.ui.Control.prototype.setContent = function(content) {
  // Controls support pluggable renderers; delegate to the renderer.
  this.renderer_.setContent(this.getElement(), content);

  // setContentInternal needs to be after the renderer, since the implementation
  // may depend on the content being in the DOM.
  this.setContentInternal(content);
***REMOVED***


***REMOVED***
***REMOVED*** Sets the component's content to the given text caption, element, or array
***REMOVED*** of nodes.  Unlike {@link #setContent}, doesn't modify the component's DOM.
***REMOVED*** Called by renderers during element decoration.  Considered protected; should
***REMOVED*** only be used within this package and by subclasses.
***REMOVED*** @param {goog.ui.ControlContent} content Text caption or DOM structure
***REMOVED***     to set as the component's contents.
***REMOVED*** @protected
***REMOVED***
goog.ui.Control.prototype.setContentInternal = function(content) {
  this.content_ = content;
***REMOVED***


***REMOVED***
***REMOVED*** @return {string} Text caption of the control or empty string if none.
***REMOVED***
goog.ui.Control.prototype.getCaption = function() {
  var content = this.getContent();
  if (!content) {
    return '';
  }
  var caption =
      goog.isString(content) ? content :
      goog.isArray(content) ? goog.array.map(content,
          goog.dom.getRawTextContent).join('') :
      goog.dom.getTextContent(***REMOVED*** @type {!Node}***REMOVED*** (content));
  return goog.string.collapseBreakingSpaces(caption);
***REMOVED***


***REMOVED***
***REMOVED*** Sets the text caption of the component.
***REMOVED*** @param {string} caption Text caption of the component.
***REMOVED***
goog.ui.Control.prototype.setCaption = function(caption) {
  this.setContent(caption);
***REMOVED***


// Component state management.


***REMOVED*** @override***REMOVED***
goog.ui.Control.prototype.setRightToLeft = function(rightToLeft) {
  // The superclass implementation ensures the control isn't in the document.
  goog.ui.Control.superClass_.setRightToLeft.call(this, rightToLeft);

  var element = this.getElement();
  if (element) {
    this.renderer_.setRightToLeft(element, rightToLeft);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Returns true if the control allows text selection within its DOM, false
***REMOVED*** otherwise.  Controls that disallow text selection have the appropriate
***REMOVED*** unselectable styling applied to their elements.  Note that controls hosted
***REMOVED*** in containers will report that they allow text selection even if their
***REMOVED*** container disallows text selection.
***REMOVED*** @return {boolean} Whether the control allows text selection.
***REMOVED***
goog.ui.Control.prototype.isAllowTextSelection = function() {
  return this.allowTextSelection_;
***REMOVED***


***REMOVED***
***REMOVED*** Allows or disallows text selection within the control's DOM.
***REMOVED*** @param {boolean} allow Whether the control should allow text selection.
***REMOVED***
goog.ui.Control.prototype.setAllowTextSelection = function(allow) {
  this.allowTextSelection_ = allow;

  var element = this.getElement();
  if (element) {
    this.renderer_.setAllowTextSelection(element, allow);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Returns true if the component's visibility is set to visible, false if
***REMOVED*** it is set to hidden.  A component that is set to hidden is guaranteed
***REMOVED*** to be hidden from the user, but the reverse isn't necessarily true.
***REMOVED*** A component may be set to visible but can otherwise be obscured by another
***REMOVED*** element, rendered off-screen, or hidden using direct CSS manipulation.
***REMOVED*** @return {boolean} Whether the component is visible.
***REMOVED***
goog.ui.Control.prototype.isVisible = function() {
  return this.visible_;
***REMOVED***


***REMOVED***
***REMOVED*** Shows or hides the component.  Does nothing if the component already has
***REMOVED*** the requested visibility.  Otherwise, dispatches a SHOW or HIDE event as
***REMOVED*** appropriate, giving listeners a chance to prevent the visibility change.
***REMOVED*** When showing a component that is both enabled and focusable, ensures that
***REMOVED*** its key target has a tab index.  When hiding a component that is enabled
***REMOVED*** and focusable, blurs its key target and removes its tab index.
***REMOVED*** @param {boolean} visible Whether to show or hide the component.
***REMOVED*** @param {boolean=} opt_force If true, doesn't check whether the component
***REMOVED***     already has the requested visibility, and doesn't dispatch any events.
***REMOVED*** @return {boolean} Whether the visibility was changed.
***REMOVED***
goog.ui.Control.prototype.setVisible = function(visible, opt_force) {
  if (opt_force || (this.visible_ != visible && this.dispatchEvent(visible ?
      goog.ui.Component.EventType.SHOW : goog.ui.Component.EventType.HIDE))) {
    var element = this.getElement();
    if (element) {
      this.renderer_.setVisible(element, visible);
    }
    if (this.isEnabled()) {
      this.renderer_.setFocusable(this, visible);
    }
    this.visible_ = visible;
    return true;
  }
  return false;
***REMOVED***


***REMOVED***
***REMOVED*** Returns true if the component is enabled, false otherwise.
***REMOVED*** @return {boolean} Whether the component is enabled.
***REMOVED***
goog.ui.Control.prototype.isEnabled = function() {
  return !this.hasState(goog.ui.Component.State.DISABLED);
***REMOVED***


***REMOVED***
***REMOVED*** Returns true if the control has a parent that is itself disabled, false
***REMOVED*** otherwise.
***REMOVED*** @return {boolean} Whether the component is hosted in a disabled container.
***REMOVED*** @private
***REMOVED***
goog.ui.Control.prototype.isParentDisabled_ = function() {
  var parent = this.getParent();
  return !!parent && typeof parent.isEnabled == 'function' &&
      !parent.isEnabled();
***REMOVED***


***REMOVED***
***REMOVED*** Enables or disables the component.  Does nothing if this state transition
***REMOVED*** is disallowed.  If the component is both visible and focusable, updates its
***REMOVED*** focused state and tab index as needed.  If the component is being disabled,
***REMOVED*** ensures that it is also deactivated and un-highlighted first.  Note that the
***REMOVED*** component's enabled/disabled state is "locked" as long as it is hosted in a
***REMOVED*** {@link goog.ui.Container} that is itself disabled; this is to prevent clients
***REMOVED*** from accidentally re-enabling a control that is in a disabled container.
***REMOVED*** @param {boolean} enable Whether to enable or disable the component.
***REMOVED*** @see #isTransitionAllowed
***REMOVED***
goog.ui.Control.prototype.setEnabled = function(enable) {
  if (!this.isParentDisabled_() &&
      this.isTransitionAllowed(goog.ui.Component.State.DISABLED, !enable)) {
    if (!enable) {
      this.setActive(false);
      this.setHighlighted(false);
    }
    if (this.isVisible()) {
      this.renderer_.setFocusable(this, enable);
    }
    this.setState(goog.ui.Component.State.DISABLED, !enable);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Returns true if the component is currently highlighted, false otherwise.
***REMOVED*** @return {boolean} Whether the component is highlighted.
***REMOVED***
goog.ui.Control.prototype.isHighlighted = function() {
  return this.hasState(goog.ui.Component.State.HOVER);
***REMOVED***


***REMOVED***
***REMOVED*** Highlights or unhighlights the component.  Does nothing if this state
***REMOVED*** transition is disallowed.
***REMOVED*** @param {boolean} highlight Whether to highlight or unhighlight the component.
***REMOVED*** @see #isTransitionAllowed
***REMOVED***
goog.ui.Control.prototype.setHighlighted = function(highlight) {
  if (this.isTransitionAllowed(goog.ui.Component.State.HOVER, highlight)) {
    this.setState(goog.ui.Component.State.HOVER, highlight);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Returns true if the component is active (pressed), false otherwise.
***REMOVED*** @return {boolean} Whether the component is active.
***REMOVED***
goog.ui.Control.prototype.isActive = function() {
  return this.hasState(goog.ui.Component.State.ACTIVE);
***REMOVED***


***REMOVED***
***REMOVED*** Activates or deactivates the component.  Does nothing if this state
***REMOVED*** transition is disallowed.
***REMOVED*** @param {boolean} active Whether to activate or deactivate the component.
***REMOVED*** @see #isTransitionAllowed
***REMOVED***
goog.ui.Control.prototype.setActive = function(active) {
  if (this.isTransitionAllowed(goog.ui.Component.State.ACTIVE, active)) {
    this.setState(goog.ui.Component.State.ACTIVE, active);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Returns true if the component is selected, false otherwise.
***REMOVED*** @return {boolean} Whether the component is selected.
***REMOVED***
goog.ui.Control.prototype.isSelected = function() {
  return this.hasState(goog.ui.Component.State.SELECTED);
***REMOVED***


***REMOVED***
***REMOVED*** Selects or unselects the component.  Does nothing if this state transition
***REMOVED*** is disallowed.
***REMOVED*** @param {boolean} select Whether to select or unselect the component.
***REMOVED*** @see #isTransitionAllowed
***REMOVED***
goog.ui.Control.prototype.setSelected = function(select) {
  if (this.isTransitionAllowed(goog.ui.Component.State.SELECTED, select)) {
    this.setState(goog.ui.Component.State.SELECTED, select);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Returns true if the component is checked, false otherwise.
***REMOVED*** @return {boolean} Whether the component is checked.
***REMOVED***
goog.ui.Control.prototype.isChecked = function() {
  return this.hasState(goog.ui.Component.State.CHECKED);
***REMOVED***


***REMOVED***
***REMOVED*** Checks or unchecks the component.  Does nothing if this state transition
***REMOVED*** is disallowed.
***REMOVED*** @param {boolean} check Whether to check or uncheck the component.
***REMOVED*** @see #isTransitionAllowed
***REMOVED***
goog.ui.Control.prototype.setChecked = function(check) {
  if (this.isTransitionAllowed(goog.ui.Component.State.CHECKED, check)) {
    this.setState(goog.ui.Component.State.CHECKED, check);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Returns true if the component is styled to indicate that it has keyboard
***REMOVED*** focus, false otherwise.  Note that {@code isFocused()} returning true
***REMOVED*** doesn't guarantee that the component's key event target has keyborad focus,
***REMOVED*** only that it is styled as such.
***REMOVED*** @return {boolean} Whether the component is styled to indicate as having
***REMOVED***     keyboard focus.
***REMOVED***
goog.ui.Control.prototype.isFocused = function() {
  return this.hasState(goog.ui.Component.State.FOCUSED);
***REMOVED***


***REMOVED***
***REMOVED*** Applies or removes styling indicating that the component has keyboard focus.
***REMOVED*** Note that unlike the other "set" methods, this method is called as a result
***REMOVED*** of the component's element having received or lost keyboard focus, not the
***REMOVED*** other way around, so calling {@code setFocused(true)} doesn't guarantee that
***REMOVED*** the component's key event target has keyboard focus, only that it is styled
***REMOVED*** as such.
***REMOVED*** @param {boolean} focused Whether to apply or remove styling to indicate that
***REMOVED***     the component's element has keyboard focus.
***REMOVED***
goog.ui.Control.prototype.setFocused = function(focused) {
  if (this.isTransitionAllowed(goog.ui.Component.State.FOCUSED, focused)) {
    this.setState(goog.ui.Component.State.FOCUSED, focused);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Returns true if the component is open (expanded), false otherwise.
***REMOVED*** @return {boolean} Whether the component is open.
***REMOVED***
goog.ui.Control.prototype.isOpen = function() {
  return this.hasState(goog.ui.Component.State.OPENED);
***REMOVED***


***REMOVED***
***REMOVED*** Opens (expands) or closes (collapses) the component.  Does nothing if this
***REMOVED*** state transition is disallowed.
***REMOVED*** @param {boolean} open Whether to open or close the component.
***REMOVED*** @see #isTransitionAllowed
***REMOVED***
goog.ui.Control.prototype.setOpen = function(open) {
  if (this.isTransitionAllowed(goog.ui.Component.State.OPENED, open)) {
    this.setState(goog.ui.Component.State.OPENED, open);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Returns the component's state as a bit mask of {@link
***REMOVED*** goog.ui.Component.State}s.
***REMOVED*** @return {number} Bit mask representing component state.
***REMOVED***
goog.ui.Control.prototype.getState = function() {
  return this.state_;
***REMOVED***


***REMOVED***
***REMOVED*** Returns true if the component is in the specified state, false otherwise.
***REMOVED*** @param {goog.ui.Component.State} state State to check.
***REMOVED*** @return {boolean} Whether the component is in the given state.
***REMOVED***
goog.ui.Control.prototype.hasState = function(state) {
  return !!(this.state_ & state);
***REMOVED***


***REMOVED***
***REMOVED*** Sets or clears the given state on the component, and updates its styling
***REMOVED*** accordingly.  Does nothing if the component is already in the correct state
***REMOVED*** or if it doesn't support the specified state.  Doesn't dispatch any state
***REMOVED*** transition events; use advisedly.
***REMOVED*** @param {goog.ui.Component.State} state State to set or clear.
***REMOVED*** @param {boolean} enable Whether to set or clear the state (if supported).
***REMOVED***
goog.ui.Control.prototype.setState = function(state, enable) {
  if (this.isSupportedState(state) && enable != this.hasState(state)) {
    // Delegate actual styling to the renderer, since it is DOM-specific.
    this.renderer_.setState(this, state, enable);
    this.state_ = enable ? this.state_ | state : this.state_ & ~state;
  }
***REMOVED***


***REMOVED***
***REMOVED*** Sets the component's state to the state represented by a bit mask of
***REMOVED*** {@link goog.ui.Component.State}s.  Unlike {@link #setState}, doesn't
***REMOVED*** update the component's styling, and doesn't reject unsupported states.
***REMOVED*** Called by renderers during element decoration.  Considered protected;
***REMOVED*** should only be used within this package and by subclasses.
***REMOVED*** @param {number} state Bit mask representing component state.
***REMOVED*** @protected
***REMOVED***
goog.ui.Control.prototype.setStateInternal = function(state) {
  this.state_ = state;
***REMOVED***


***REMOVED***
***REMOVED*** Returns true if the component supports the specified state, false otherwise.
***REMOVED*** @param {goog.ui.Component.State} state State to check.
***REMOVED*** @return {boolean} Whether the component supports the given state.
***REMOVED***
goog.ui.Control.prototype.isSupportedState = function(state) {
  return !!(this.supportedStates_ & state);
***REMOVED***


***REMOVED***
***REMOVED*** Enables or disables support for the given state. Disabling support
***REMOVED*** for a state while the component is in that state is an error.
***REMOVED*** @param {goog.ui.Component.State} state State to support or de-support.
***REMOVED*** @param {boolean} support Whether the component should support the state.
***REMOVED*** @throws {Error} If disabling support for a state the control is currently in.
***REMOVED***
goog.ui.Control.prototype.setSupportedState = function(state, support) {
  if (this.isInDocument() && this.hasState(state) && !support) {
    // Since we hook up event handlers in enterDocument(), this is an error.
    throw Error(goog.ui.Component.Error.ALREADY_RENDERED);
  }

  if (!support && this.hasState(state)) {
    // We are removing support for a state that the component is currently in.
    this.setState(state, false);
  }

  this.supportedStates_ = support ?
      this.supportedStates_ | state : this.supportedStates_ & ~state;
***REMOVED***


***REMOVED***
***REMOVED*** Returns true if the component provides default event handling for the state,
***REMOVED*** false otherwise.
***REMOVED*** @param {goog.ui.Component.State} state State to check.
***REMOVED*** @return {boolean} Whether the component provides default event handling for
***REMOVED***     the state.
***REMOVED***
goog.ui.Control.prototype.isAutoState = function(state) {
  return !!(this.autoStates_ & state) && this.isSupportedState(state);
***REMOVED***


***REMOVED***
***REMOVED*** Enables or disables automatic event handling for the given state(s).
***REMOVED*** @param {number} states Bit mask of {@link goog.ui.Component.State}s for which
***REMOVED***     default event handling is to be enabled or disabled.
***REMOVED*** @param {boolean} enable Whether the component should provide default event
***REMOVED***     handling for the state(s).
***REMOVED***
goog.ui.Control.prototype.setAutoStates = function(states, enable) {
  this.autoStates_ = enable ?
      this.autoStates_ | states : this.autoStates_ & ~states;
***REMOVED***


***REMOVED***
***REMOVED*** Returns true if the component is set to dispatch transition events for the
***REMOVED*** given state, false otherwise.
***REMOVED*** @param {goog.ui.Component.State} state State to check.
***REMOVED*** @return {boolean} Whether the component dispatches transition events for
***REMOVED***     the state.
***REMOVED***
goog.ui.Control.prototype.isDispatchTransitionEvents = function(state) {
  return !!(this.statesWithTransitionEvents_ & state) &&
      this.isSupportedState(state);
***REMOVED***


***REMOVED***
***REMOVED*** Enables or disables transition events for the given state(s).  Controls
***REMOVED*** handle state transitions internally by default, and only dispatch state
***REMOVED*** transition events if explicitly requested to do so by calling this method.
***REMOVED*** @param {number} states Bit mask of {@link goog.ui.Component.State}s for
***REMOVED***     which transition events should be enabled or disabled.
***REMOVED*** @param {boolean} enable Whether transition events should be enabled.
***REMOVED***
goog.ui.Control.prototype.setDispatchTransitionEvents = function(states,
    enable) {
  this.statesWithTransitionEvents_ = enable ?
      this.statesWithTransitionEvents_ | states :
      this.statesWithTransitionEvents_ & ~states;
***REMOVED***


***REMOVED***
***REMOVED*** Returns true if the transition into or out of the given state is allowed to
***REMOVED*** proceed, false otherwise.  A state transition is allowed under the following
***REMOVED*** conditions:
***REMOVED*** <ul>
***REMOVED***   <li>the component supports the state,
***REMOVED***   <li>the component isn't already in the target state,
***REMOVED***   <li>either the component is configured not to dispatch events for this
***REMOVED***       state transition, or a transition event was dispatched and wasn't
***REMOVED***       canceled by any event listener, and
***REMOVED***   <li>the component hasn't been disposed of
***REMOVED*** </ul>
***REMOVED*** Considered protected; should only be used within this package and by
***REMOVED*** subclasses.
***REMOVED*** @param {goog.ui.Component.State} state State to/from which the control is
***REMOVED***     transitioning.
***REMOVED*** @param {boolean} enable Whether the control is entering or leaving the state.
***REMOVED*** @return {boolean} Whether the state transition is allowed to proceed.
***REMOVED*** @protected
***REMOVED***
goog.ui.Control.prototype.isTransitionAllowed = function(state, enable) {
  return this.isSupportedState(state) &&
      this.hasState(state) != enable &&
      (!(this.statesWithTransitionEvents_ & state) || this.dispatchEvent(
          goog.ui.Component.getStateTransitionEvent(state, enable))) &&
      !this.isDisposed();
***REMOVED***


// Default event handlers, to be overridden in subclasses.


***REMOVED***
***REMOVED*** Handles mouseover events.  Dispatches an ENTER event; if the event isn't
***REMOVED*** canceled, the component is enabled, and it supports auto-highlighting,
***REMOVED*** highlights the component.  Considered protected; should only be used
***REMOVED*** within this package and by subclasses.
***REMOVED*** @param {goog.events.BrowserEvent} e Mouse event to handle.
***REMOVED***
goog.ui.Control.prototype.handleMouseOver = function(e) {
  // Ignore mouse moves between descendants.
  if (!goog.ui.Control.isMouseEventWithinElement_(e, this.getElement()) &&
      this.dispatchEvent(goog.ui.Component.EventType.ENTER) &&
      this.isEnabled() &&
      this.isAutoState(goog.ui.Component.State.HOVER)) {
    this.setHighlighted(true);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Handles mouseout events.  Dispatches a LEAVE event; if the event isn't
***REMOVED*** canceled, and the component supports auto-highlighting, deactivates and
***REMOVED*** un-highlights the component.  Considered protected; should only be used
***REMOVED*** within this package and by subclasses.
***REMOVED*** @param {goog.events.BrowserEvent} e Mouse event to handle.
***REMOVED***
goog.ui.Control.prototype.handleMouseOut = function(e) {
  if (!goog.ui.Control.isMouseEventWithinElement_(e, this.getElement()) &&
      this.dispatchEvent(goog.ui.Component.EventType.LEAVE)) {
    if (this.isAutoState(goog.ui.Component.State.ACTIVE)) {
      // Deactivate on mouseout; otherwise we lose track of the mouse button.
      this.setActive(false);
    }
    if (this.isAutoState(goog.ui.Component.State.HOVER)) {
      this.setHighlighted(false);
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** Handles contextmenu events.
***REMOVED*** @param {goog.events.BrowserEvent} e Event to handle.
***REMOVED***
goog.ui.Control.prototype.handleContextMenu = goog.nullFunction;


***REMOVED***
***REMOVED*** Checks if a mouse event (mouseover or mouseout) occured below an element.
***REMOVED*** @param {goog.events.BrowserEvent} e Mouse event (should be mouseover or
***REMOVED***     mouseout).
***REMOVED*** @param {Element} elem The ancestor element.
***REMOVED*** @return {boolean} Whether the event has a relatedTarget (the element the
***REMOVED***     mouse is coming from) and it's a descendent of elem.
***REMOVED*** @private
***REMOVED***
goog.ui.Control.isMouseEventWithinElement_ = function(e, elem) {
  // If relatedTarget is null, it means there was no previous element (e.g.
  // the mouse moved out of the window).  Assume this means that the mouse
  // event was not within the element.
  return !!e.relatedTarget && goog.dom.contains(elem, e.relatedTarget);
***REMOVED***


***REMOVED***
***REMOVED*** Handles mousedown events.  If the component is enabled, highlights and
***REMOVED*** activates it.  If the component isn't configured for keyboard access,
***REMOVED*** prevents it from receiving keyboard focus.  Considered protected; should
***REMOVED*** only be used within this package andy by subclasses.
***REMOVED*** @param {goog.events.Event} e Mouse event to handle.
***REMOVED***
goog.ui.Control.prototype.handleMouseDown = function(e) {
  if (this.isEnabled()) {
    // Highlight enabled control on mousedown, regardless of the mouse button.
    if (this.isAutoState(goog.ui.Component.State.HOVER)) {
      this.setHighlighted(true);
    }

    // For the left button only, activate the control, and focus its key event
    // target (if supported).
    if (e.isMouseActionButton()) {
      if (this.isAutoState(goog.ui.Component.State.ACTIVE)) {
        this.setActive(true);
      }
      if (this.renderer_.isFocusable(this)) {
        this.getKeyEventTarget().focus();
      }
    }
  }

  // Cancel the default action unless the control allows text selection.
  if (!this.isAllowTextSelection() && e.isMouseActionButton()) {
    e.preventDefault();
  }
***REMOVED***


***REMOVED***
***REMOVED*** Handles mouseup events.  If the component is enabled, highlights it.  If
***REMOVED*** the component has previously been activated, performs its associated action
***REMOVED*** by calling {@link performActionInternal}, then deactivates it.  Considered
***REMOVED*** protected; should only be used within this package and by subclasses.
***REMOVED*** @param {goog.events.Event} e Mouse event to handle.
***REMOVED***
goog.ui.Control.prototype.handleMouseUp = function(e) {
  if (this.isEnabled()) {
    if (this.isAutoState(goog.ui.Component.State.HOVER)) {
      this.setHighlighted(true);
    }
    if (this.isActive() &&
        this.performActionInternal(e) &&
        this.isAutoState(goog.ui.Component.State.ACTIVE)) {
      this.setActive(false);
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** Handles dblclick events.  Should only be registered if the user agent is
***REMOVED*** IE.  If the component is enabled, performs its associated action by calling
***REMOVED*** {@link performActionInternal}.  This is used to allow more performant
***REMOVED*** buttons in IE.  In IE, no mousedown event is fired when that mousedown will
***REMOVED*** trigger a dblclick event.  Because of this, a user clicking quickly will
***REMOVED*** only cause ACTION events to fire on every other click.  This is a workaround
***REMOVED*** to generate ACTION events for every click.  Unfortunately, this workaround
***REMOVED*** won't ever trigger the ACTIVE state.  This is roughly the same behaviour as
***REMOVED*** if this were a 'button' element with a listener on mouseup.  Considered
***REMOVED*** protected; should only be used within this package and by subclasses.
***REMOVED*** @param {goog.events.Event} e Mouse event to handle.
***REMOVED***
goog.ui.Control.prototype.handleDblClick = function(e) {
  if (this.isEnabled()) {
    this.performActionInternal(e);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Performs the appropriate action when the control is activated by the user.
***REMOVED*** The default implementation first updates the checked and selected state of
***REMOVED*** controls that support them, then dispatches an ACTION event.  Considered
***REMOVED*** protected; should only be used within this package and by subclasses.
***REMOVED*** @param {goog.events.Event} e Event that triggered the action.
***REMOVED*** @return {boolean} Whether the action is allowed to proceed.
***REMOVED*** @protected
***REMOVED***
goog.ui.Control.prototype.performActionInternal = function(e) {
  if (this.isAutoState(goog.ui.Component.State.CHECKED)) {
    this.setChecked(!this.isChecked());
  }
  if (this.isAutoState(goog.ui.Component.State.SELECTED)) {
    this.setSelected(true);
  }
  if (this.isAutoState(goog.ui.Component.State.OPENED)) {
    this.setOpen(!this.isOpen());
  }

  var actionEvent = new goog.events.Event(goog.ui.Component.EventType.ACTION,
      this);
  if (e) {
    actionEvent.altKey = e.altKey;
    actionEvent.ctrlKey = e.ctrlKey;
    actionEvent.metaKey = e.metaKey;
    actionEvent.shiftKey = e.shiftKey;
    actionEvent.platformModifierKey = e.platformModifierKey;
  }
  return this.dispatchEvent(actionEvent);
***REMOVED***


***REMOVED***
***REMOVED*** Handles focus events on the component's key event target element.  If the
***REMOVED*** component is focusable, updates its state and styling to indicate that it
***REMOVED*** now has keyboard focus.  Considered protected; should only be used within
***REMOVED*** this package and by subclasses.  <b>Warning:</b> IE dispatches focus and
***REMOVED*** blur events asynchronously!
***REMOVED*** @param {goog.events.Event} e Focus event to handle.
***REMOVED***
goog.ui.Control.prototype.handleFocus = function(e) {
  if (this.isAutoState(goog.ui.Component.State.FOCUSED)) {
    this.setFocused(true);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Handles blur events on the component's key event target element.  Always
***REMOVED*** deactivates the component.  In addition, if the component is focusable,
***REMOVED*** updates its state and styling to indicate that it no longer has keyboard
***REMOVED*** focus.  Considered protected; should only be used within this package and
***REMOVED*** by subclasses.  <b>Warning:</b> IE dispatches focus and blur events
***REMOVED*** asynchronously!
***REMOVED*** @param {goog.events.Event} e Blur event to handle.
***REMOVED***
goog.ui.Control.prototype.handleBlur = function(e) {
  if (this.isAutoState(goog.ui.Component.State.ACTIVE)) {
    this.setActive(false);
  }
  if (this.isAutoState(goog.ui.Component.State.FOCUSED)) {
    this.setFocused(false);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Attempts to handle a keyboard event, if the component is enabled and visible,
***REMOVED*** by calling {@link handleKeyEventInternal}.  Considered protected; should only
***REMOVED*** be used within this package and by subclasses.
***REMOVED*** @param {goog.events.KeyEvent} e Key event to handle.
***REMOVED*** @return {boolean} Whether the key event was handled.
***REMOVED***
goog.ui.Control.prototype.handleKeyEvent = function(e) {
  if (this.isVisible() && this.isEnabled() &&
      this.handleKeyEventInternal(e)) {
    e.preventDefault();
    e.stopPropagation();
    return true;
  }
  return false;
***REMOVED***


***REMOVED***
***REMOVED*** Attempts to handle a keyboard event; returns true if the event was handled,
***REMOVED*** false otherwise.  Considered protected; should only be used within this
***REMOVED*** package and by subclasses.
***REMOVED*** @param {goog.events.KeyEvent} e Key event to handle.
***REMOVED*** @return {boolean} Whether the key event was handled.
***REMOVED*** @protected
***REMOVED***
goog.ui.Control.prototype.handleKeyEventInternal = function(e) {
  return e.keyCode == goog.events.KeyCodes.ENTER &&
      this.performActionInternal(e);
***REMOVED***


// Register the default renderer for goog.ui.Controls.
goog.ui.registry.setDefaultRenderer(goog.ui.Control, goog.ui.ControlRenderer);


// Register a decorator factory function for goog.ui.Controls.
goog.ui.registry.setDecoratorByClassName(goog.ui.ControlRenderer.CSS_CLASS,
    function() {
      return new goog.ui.Control(null);
    });
