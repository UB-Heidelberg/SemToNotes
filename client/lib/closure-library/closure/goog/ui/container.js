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
***REMOVED*** @fileoverview Base class for containers that host {@link goog.ui.Control}s,
***REMOVED*** such as menus and toolbars.  Provides default keyboard and mouse event
***REMOVED*** handling and child management, based on a generalized version of
***REMOVED*** {@link goog.ui.Menu}.
***REMOVED***
***REMOVED*** @author attila@google.com (Attila Bodis)
***REMOVED*** @see ../demos/container.html
***REMOVED***
// TODO(attila):  Fix code/logic duplication between this and goog.ui.Control.
// TODO(attila):  Maybe pull common stuff all the way up into Component...?

goog.provide('goog.ui.Container');
goog.provide('goog.ui.Container.EventType');
goog.provide('goog.ui.Container.Orientation');

goog.require('goog.a11y.aria');
goog.require('goog.a11y.aria.State');
goog.require('goog.asserts');
goog.require('goog.dom');
***REMOVED***
goog.require('goog.events.KeyCodes');
goog.require('goog.events.KeyHandler');
goog.require('goog.object');
goog.require('goog.style');
goog.require('goog.ui.Component');
goog.require('goog.ui.ContainerRenderer');
goog.require('goog.ui.Control');



***REMOVED***
***REMOVED*** Base class for containers.  Extends {@link goog.ui.Component} by adding
***REMOVED*** the following:
***REMOVED***  <ul>
***REMOVED***    <li>a {@link goog.events.KeyHandler}, to simplify keyboard handling,
***REMOVED***    <li>a pluggable <em>renderer</em> framework, to simplify the creation of
***REMOVED***        containers without the need to subclass this class,
***REMOVED***    <li>methods to manage child controls hosted in the container,
***REMOVED***    <li>default mouse and keyboard event handling methods.
***REMOVED***  </ul>
***REMOVED*** @param {?goog.ui.Container.Orientation=} opt_orientation Container
***REMOVED***     orientation; defaults to {@code VERTICAL}.
***REMOVED*** @param {goog.ui.ContainerRenderer=} opt_renderer Renderer used to render or
***REMOVED***     decorate the container; defaults to {@link goog.ui.ContainerRenderer}.
***REMOVED*** @param {goog.dom.DomHelper=} opt_domHelper DOM helper, used for document
***REMOVED***     interaction.
***REMOVED*** @extends {goog.ui.Component}
***REMOVED***
***REMOVED***
goog.ui.Container = function(opt_orientation, opt_renderer, opt_domHelper) {
  goog.ui.Component.call(this, opt_domHelper);
  this.renderer_ = opt_renderer || goog.ui.ContainerRenderer.getInstance();
  this.orientation_ = opt_orientation || this.renderer_.getDefaultOrientation();
***REMOVED***
goog.inherits(goog.ui.Container, goog.ui.Component);


***REMOVED***
***REMOVED*** Container-specific events.
***REMOVED*** @enum {string}
***REMOVED***
goog.ui.Container.EventType = {
 ***REMOVED*****REMOVED***
  ***REMOVED*** Dispatched after a goog.ui.Container becomes visible. Non-cancellable.
  ***REMOVED*** NOTE(user): This event really shouldn't exist, because the
  ***REMOVED*** goog.ui.Component.EventType.SHOW event should behave like this one. But the
  ***REMOVED*** SHOW event for containers has been behaving as other components'
  ***REMOVED*** BEFORE_SHOW event for a long time, and too much code relies on that old
  ***REMOVED*** behavior to fix it now.
 ***REMOVED*****REMOVED***
  AFTER_SHOW: 'aftershow',

 ***REMOVED*****REMOVED***
  ***REMOVED*** Dispatched after a goog.ui.Container becomes invisible. Non-cancellable.
 ***REMOVED*****REMOVED***
  AFTER_HIDE: 'afterhide'
***REMOVED***


***REMOVED***
***REMOVED*** Container orientation constants.
***REMOVED*** @enum {string}
***REMOVED***
goog.ui.Container.Orientation = {
  HORIZONTAL: 'horizontal',
  VERTICAL: 'vertical'
***REMOVED***


***REMOVED***
***REMOVED*** Allows an alternative element to be set to receive key events, otherwise
***REMOVED*** defers to the renderer's element choice.
***REMOVED*** @type {Element|undefined}
***REMOVED*** @private
***REMOVED***
goog.ui.Container.prototype.keyEventTarget_ = null;


***REMOVED***
***REMOVED*** Keyboard event handler.
***REMOVED*** @type {goog.events.KeyHandler?}
***REMOVED*** @private
***REMOVED***
goog.ui.Container.prototype.keyHandler_ = null;


***REMOVED***
***REMOVED*** Renderer for the container.  Defaults to {@link goog.ui.ContainerRenderer}.
***REMOVED*** @type {goog.ui.ContainerRenderer?}
***REMOVED*** @private
***REMOVED***
goog.ui.Container.prototype.renderer_ = null;


***REMOVED***
***REMOVED*** Container orientation; determines layout and default keyboard navigation.
***REMOVED*** @type {?goog.ui.Container.Orientation}
***REMOVED*** @private
***REMOVED***
goog.ui.Container.prototype.orientation_ = null;


***REMOVED***
***REMOVED*** Whether the container is set to be visible.  Defaults to true.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.ui.Container.prototype.visible_ = true;


***REMOVED***
***REMOVED*** Whether the container is enabled and reacting to keyboard and mouse events.
***REMOVED*** Defaults to true.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.ui.Container.prototype.enabled_ = true;


***REMOVED***
***REMOVED*** Whether the container supports keyboard focus.  Defaults to true.  Focusable
***REMOVED*** containers have a {@code tabIndex} and can be navigated to via the keyboard.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.ui.Container.prototype.focusable_ = true;


***REMOVED***
***REMOVED*** The 0-based index of the currently highlighted control in the container
***REMOVED*** (-1 if none).
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.ui.Container.prototype.highlightedIndex_ = -1;


***REMOVED***
***REMOVED*** The currently open (expanded) control in the container (null if none).
***REMOVED*** @type {goog.ui.Control?}
***REMOVED*** @private
***REMOVED***
goog.ui.Container.prototype.openItem_ = null;


***REMOVED***
***REMOVED*** Whether the mouse button is held down.  Defaults to false.  This flag is set
***REMOVED*** when the user mouses down over the container, and remains set until they
***REMOVED*** release the mouse button.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.ui.Container.prototype.mouseButtonPressed_ = false;


***REMOVED***
***REMOVED*** Whether focus of child components should be allowed.  Only effective if
***REMOVED*** focusable_ is set to false.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.ui.Container.prototype.allowFocusableChildren_ = false;


***REMOVED***
***REMOVED*** Whether highlighting a child component should also open it.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.ui.Container.prototype.openFollowsHighlight_ = true;


***REMOVED***
***REMOVED*** Map of DOM IDs to child controls.  Each key is the DOM ID of a child
***REMOVED*** control's root element; each value is a reference to the child control
***REMOVED*** itself.  Used for looking up the child control corresponding to a DOM
***REMOVED*** node in O(1) time.
***REMOVED*** @type {Object}
***REMOVED*** @private
***REMOVED***
goog.ui.Container.prototype.childElementIdMap_ = null;


// Event handler and renderer management.


***REMOVED***
***REMOVED*** Returns the DOM element on which the container is listening for keyboard
***REMOVED*** events (null if none).
***REMOVED*** @return {Element} Element on which the container is listening for key
***REMOVED***     events.
***REMOVED***
goog.ui.Container.prototype.getKeyEventTarget = function() {
  // Delegate to renderer, unless we've set an explicit target.
  return this.keyEventTarget_ || this.renderer_.getKeyEventTarget(this);
***REMOVED***


***REMOVED***
***REMOVED*** Attaches an element on which to listen for key events.
***REMOVED*** @param {Element|undefined} element The element to attach, or null/undefined
***REMOVED***     to attach to the default element.
***REMOVED***
goog.ui.Container.prototype.setKeyEventTarget = function(element) {
  if (this.focusable_) {
    var oldTarget = this.getKeyEventTarget();
    var inDocument = this.isInDocument();

    this.keyEventTarget_ = element;
    var newTarget = this.getKeyEventTarget();

    if (inDocument) {
      // Unlisten for events on the old key target.  Requires us to reset
      // key target state temporarily.
      this.keyEventTarget_ = oldTarget;
      this.enableFocusHandling_(false);
      this.keyEventTarget_ = element;

      // Listen for events on the new key target.
      this.getKeyHandler().attach(newTarget);
      this.enableFocusHandling_(true);
    }
  } else {
    throw Error('Can\'t set key event target for container ' +
        'that doesn\'t support keyboard focus!');
  }
***REMOVED***


***REMOVED***
***REMOVED*** Returns the keyboard event handler for this container, lazily created the
***REMOVED*** first time this method is called.  The keyboard event handler listens for
***REMOVED*** keyboard events on the container's key event target, as determined by its
***REMOVED*** renderer.
***REMOVED*** @return {!goog.events.KeyHandler} Keyboard event handler for this container.
***REMOVED***
goog.ui.Container.prototype.getKeyHandler = function() {
  return this.keyHandler_ ||
      (this.keyHandler_ = new goog.events.KeyHandler(this.getKeyEventTarget()));
***REMOVED***


***REMOVED***
***REMOVED*** Returns the renderer used by this container to render itself or to decorate
***REMOVED*** an existing element.
***REMOVED*** @return {goog.ui.ContainerRenderer} Renderer used by the container.
***REMOVED***
goog.ui.Container.prototype.getRenderer = function() {
  return this.renderer_;
***REMOVED***


***REMOVED***
***REMOVED*** Registers the given renderer with the container.  Changing renderers after
***REMOVED*** the container has already been rendered or decorated is an error.
***REMOVED*** @param {goog.ui.ContainerRenderer} renderer Renderer used by the container.
***REMOVED***
goog.ui.Container.prototype.setRenderer = function(renderer) {
  if (this.getElement()) {
    // Too late.
    throw Error(goog.ui.Component.Error.ALREADY_RENDERED);
  }

  this.renderer_ = renderer;
***REMOVED***


// Standard goog.ui.Component implementation.


***REMOVED***
***REMOVED*** Creates the container's DOM.
***REMOVED*** @override
***REMOVED***
goog.ui.Container.prototype.createDom = function() {
  // Delegate to renderer.
  this.setElementInternal(this.renderer_.createDom(this));
***REMOVED***


***REMOVED***
***REMOVED*** Returns the DOM element into which child components are to be rendered,
***REMOVED*** or null if the container itself hasn't been rendered yet.  Overrides
***REMOVED*** {@link goog.ui.Component#getContentElement} by delegating to the renderer.
***REMOVED*** @return {Element} Element to contain child elements (null if none).
***REMOVED*** @override
***REMOVED***
goog.ui.Container.prototype.getContentElement = function() {
  // Delegate to renderer.
  return this.renderer_.getContentElement(this.getElement());
***REMOVED***


***REMOVED***
***REMOVED*** Returns true if the given element can be decorated by this container.
***REMOVED*** Overrides {@link goog.ui.Component#canDecorate}.
***REMOVED*** @param {Element} element Element to decorate.
***REMOVED*** @return {boolean} True iff the element can be decorated.
***REMOVED*** @override
***REMOVED***
goog.ui.Container.prototype.canDecorate = function(element) {
  // Delegate to renderer.
  return this.renderer_.canDecorate(element);
***REMOVED***


***REMOVED***
***REMOVED*** Decorates the given element with this container. Overrides {@link
***REMOVED*** goog.ui.Component#decorateInternal}.  Considered protected.
***REMOVED*** @param {Element} element Element to decorate.
***REMOVED*** @override
***REMOVED***
goog.ui.Container.prototype.decorateInternal = function(element) {
  // Delegate to renderer.
  this.setElementInternal(this.renderer_.decorate(this, element));
  // Check whether the decorated element is explicitly styled to be invisible.
  if (element.style.display == 'none') {
    this.visible_ = false;
  }
***REMOVED***


***REMOVED***
***REMOVED*** Configures the container after its DOM has been rendered, and sets up event
***REMOVED*** handling.  Overrides {@link goog.ui.Component#enterDocument}.
***REMOVED*** @override
***REMOVED***
goog.ui.Container.prototype.enterDocument = function() {
  goog.ui.Container.superClass_.enterDocument.call(this);

  this.forEachChild(function(child) {
    if (child.isInDocument()) {
      this.registerChildId_(child);
    }
  }, this);

  var elem = this.getElement();

  // Call the renderer's initializeDom method to initialize the container's DOM.
  this.renderer_.initializeDom(this);

  // Initialize visibility (opt_force = true, so we don't dispatch events).
  this.setVisible(this.visible_, true);

  // Handle events dispatched by child controls.
  this.getHandler().
      listen(this, goog.ui.Component.EventType.ENTER,
          this.handleEnterItem).
      listen(this, goog.ui.Component.EventType.HIGHLIGHT,
          this.handleHighlightItem).
      listen(this, goog.ui.Component.EventType.UNHIGHLIGHT,
          this.handleUnHighlightItem).
      listen(this, goog.ui.Component.EventType.OPEN, this.handleOpenItem).
      listen(this, goog.ui.Component.EventType.CLOSE, this.handleCloseItem).

      // Handle mouse events.
      listen(elem, goog.events.EventType.MOUSEDOWN, this.handleMouseDown).
      listen(goog.dom.getOwnerDocument(elem), goog.events.EventType.MOUSEUP,
          this.handleDocumentMouseUp).

      // Handle mouse events on behalf of controls in the container.
      listen(elem, [
        goog.events.EventType.MOUSEDOWN,
        goog.events.EventType.MOUSEUP,
        goog.events.EventType.MOUSEOVER,
        goog.events.EventType.MOUSEOUT,
        goog.events.EventType.CONTEXTMENU
      ], this.handleChildMouseEvents);

  // If the container is focusable, set up keyboard event handling.
  if (this.isFocusable()) {
    this.enableFocusHandling_(true);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Sets up listening for events applicable to focusable containers.
***REMOVED*** @param {boolean} enable Whether to enable or disable focus handling.
***REMOVED*** @private
***REMOVED***
goog.ui.Container.prototype.enableFocusHandling_ = function(enable) {
  var handler = this.getHandler();
  var keyTarget = this.getKeyEventTarget();
  if (enable) {
    handler.
        listen(keyTarget, goog.events.EventType.FOCUS, this.handleFocus).
        listen(keyTarget, goog.events.EventType.BLUR, this.handleBlur).
        listen(this.getKeyHandler(), goog.events.KeyHandler.EventType.KEY,
            this.handleKeyEvent);
  } else {
    handler.
        unlisten(keyTarget, goog.events.EventType.FOCUS, this.handleFocus).
        unlisten(keyTarget, goog.events.EventType.BLUR, this.handleBlur).
        unlisten(this.getKeyHandler(), goog.events.KeyHandler.EventType.KEY,
            this.handleKeyEvent);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Cleans up the container before its DOM is removed from the document, and
***REMOVED*** removes event handlers.  Overrides {@link goog.ui.Component#exitDocument}.
***REMOVED*** @override
***REMOVED***
goog.ui.Container.prototype.exitDocument = function() {
  // {@link #setHighlightedIndex} has to be called before
  // {@link goog.ui.Component#exitDocument}, otherwise it has no effect.
  this.setHighlightedIndex(-1);

  if (this.openItem_) {
    this.openItem_.setOpen(false);
  }

  this.mouseButtonPressed_ = false;

  goog.ui.Container.superClass_.exitDocument.call(this);
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.ui.Container.prototype.disposeInternal = function() {
  goog.ui.Container.superClass_.disposeInternal.call(this);

  if (this.keyHandler_) {
    this.keyHandler_.dispose();
    this.keyHandler_ = null;
  }

  this.keyEventTarget_ = null;
  this.childElementIdMap_ = null;
  this.openItem_ = null;
  this.renderer_ = null;
***REMOVED***


// Default event handlers.


***REMOVED***
***REMOVED*** Handles ENTER events raised by child controls when they are navigated to.
***REMOVED*** @param {goog.events.Event} e ENTER event to handle.
***REMOVED*** @return {boolean} Whether to prevent handleMouseOver from handling
***REMOVED***    the event.
***REMOVED***
goog.ui.Container.prototype.handleEnterItem = function(e) {
  // Allow the Control to highlight itself.
  return true;
***REMOVED***


***REMOVED***
***REMOVED*** Handles HIGHLIGHT events dispatched by items in the container when
***REMOVED*** they are highlighted.
***REMOVED*** @param {goog.events.Event} e Highlight event to handle.
***REMOVED***
goog.ui.Container.prototype.handleHighlightItem = function(e) {
  var index = this.indexOfChild(***REMOVED*** @type {goog.ui.Control}***REMOVED*** (e.target));
  if (index > -1 && index != this.highlightedIndex_) {
    var item = this.getHighlighted();
    if (item) {
      // Un-highlight previously highlighted item.
      item.setHighlighted(false);
    }

    this.highlightedIndex_ = index;
    item = this.getHighlighted();

    if (this.isMouseButtonPressed()) {
      // Activate item when mouse button is pressed, to allow MacOS-style
      // dragging to choose menu items.  Although this should only truly
      // happen if the highlight is due to mouse movements, there is little
      // harm in doing it for keyboard or programmatic highlights.
      item.setActive(true);
    }

    // Update open item if open item needs follow highlight.
    if (this.openFollowsHighlight_ &&
        this.openItem_ && item != this.openItem_) {
      if (item.isSupportedState(goog.ui.Component.State.OPENED)) {
        item.setOpen(true);
      } else {
        this.openItem_.setOpen(false);
      }
    }
  }

  var element = this.getElement();
  goog.asserts.assert(element,
      'The DOM element for the container cannot be null.');
  if (e.target.getElement() != null) {
    goog.a11y.aria.setState(element,
        goog.a11y.aria.State.ACTIVEDESCENDANT,
        e.target.getElement().id);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Handles UNHIGHLIGHT events dispatched by items in the container when
***REMOVED*** they are unhighlighted.
***REMOVED*** @param {goog.events.Event} e Unhighlight event to handle.
***REMOVED***
goog.ui.Container.prototype.handleUnHighlightItem = function(e) {
  if (e.target == this.getHighlighted()) {
    this.highlightedIndex_ = -1;
  }
  var element = this.getElement();
  goog.asserts.assert(element,
      'The DOM element for the container cannot be null.');
  // Setting certain ARIA attributes to empty strings is problematic.
  // Just remove the attribute instead.
  goog.a11y.aria.removeState(element, goog.a11y.aria.State.ACTIVEDESCENDANT);
***REMOVED***


***REMOVED***
***REMOVED*** Handles OPEN events dispatched by items in the container when they are
***REMOVED*** opened.
***REMOVED*** @param {goog.events.Event} e Open event to handle.
***REMOVED***
goog.ui.Container.prototype.handleOpenItem = function(e) {
  var item =***REMOVED*****REMOVED*** @type {goog.ui.Control}***REMOVED*** (e.target);
  if (item && item != this.openItem_ && item.getParent() == this) {
    if (this.openItem_) {
      this.openItem_.setOpen(false);
    }
    this.openItem_ = item;
  }
***REMOVED***


***REMOVED***
***REMOVED*** Handles CLOSE events dispatched by items in the container when they are
***REMOVED*** closed.
***REMOVED*** @param {goog.events.Event} e Close event to handle.
***REMOVED***
goog.ui.Container.prototype.handleCloseItem = function(e) {
  if (e.target == this.openItem_) {
    this.openItem_ = null;
  }
***REMOVED***


***REMOVED***
***REMOVED*** Handles mousedown events over the container.  The default implementation
***REMOVED*** sets the "mouse button pressed" flag and, if the container is focusable,
***REMOVED*** grabs keyboard focus.
***REMOVED*** @param {goog.events.BrowserEvent} e Mousedown event to handle.
***REMOVED***
goog.ui.Container.prototype.handleMouseDown = function(e) {
  if (this.enabled_) {
    this.setMouseButtonPressed(true);
  }

  var keyTarget = this.getKeyEventTarget();
  if (keyTarget && goog.dom.isFocusableTabIndex(keyTarget)) {
    // The container is configured to receive keyboard focus.
    keyTarget.focus();
  } else {
    // The control isn't configured to receive keyboard focus; prevent it
    // from stealing focus or destroying the selection.
    e.preventDefault();
  }
***REMOVED***


***REMOVED***
***REMOVED*** Handles mouseup events over the document.  The default implementation
***REMOVED*** clears the "mouse button pressed" flag.
***REMOVED*** @param {goog.events.BrowserEvent} e Mouseup event to handle.
***REMOVED***
goog.ui.Container.prototype.handleDocumentMouseUp = function(e) {
  this.setMouseButtonPressed(false);
***REMOVED***


***REMOVED***
***REMOVED*** Handles mouse events originating from nodes belonging to the controls hosted
***REMOVED*** in the container.  Locates the child control based on the DOM node that
***REMOVED*** dispatched the event, and forwards the event to the control for handling.
***REMOVED*** @param {goog.events.BrowserEvent} e Mouse event to handle.
***REMOVED***
goog.ui.Container.prototype.handleChildMouseEvents = function(e) {
  var control = this.getOwnerControl(***REMOVED*** @type {Node}***REMOVED*** (e.target));
  if (control) {
    // Child control identified; forward the event.
    switch (e.type) {
      case goog.events.EventType.MOUSEDOWN:
        control.handleMouseDown(e);
        break;
      case goog.events.EventType.MOUSEUP:
        control.handleMouseUp(e);
        break;
      case goog.events.EventType.MOUSEOVER:
        control.handleMouseOver(e);
        break;
      case goog.events.EventType.MOUSEOUT:
        control.handleMouseOut(e);
        break;
      case goog.events.EventType.CONTEXTMENU:
        control.handleContextMenu(e);
        break;
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** Returns the child control that owns the given DOM node, or null if no such
***REMOVED*** control is found.
***REMOVED*** @param {Node} node DOM node whose owner is to be returned.
***REMOVED*** @return {goog.ui.Control?} Control hosted in the container to which the node
***REMOVED***     belongs (if found).
***REMOVED*** @protected
***REMOVED***
goog.ui.Container.prototype.getOwnerControl = function(node) {
  // Ensure that this container actually has child controls before
  // looking up the owner.
  if (this.childElementIdMap_) {
    var elem = this.getElement();
    // See http://b/2964418 . IE9 appears to evaluate '!=' incorrectly, so
    // using '!==' instead.
    // TODO(user): Possibly revert this change if/when IE9 fixes the issue.
    while (node && node !== elem) {
      var id = node.id;
      if (id in this.childElementIdMap_) {
        return this.childElementIdMap_[id];
      }
      node = node.parentNode;
    }
  }
  return null;
***REMOVED***


***REMOVED***
***REMOVED*** Handles focus events raised when the container's key event target receives
***REMOVED*** keyboard focus.
***REMOVED*** @param {goog.events.BrowserEvent} e Focus event to handle.
***REMOVED***
goog.ui.Container.prototype.handleFocus = function(e) {
  // No-op in the base class.
***REMOVED***


***REMOVED***
***REMOVED*** Handles blur events raised when the container's key event target loses
***REMOVED*** keyboard focus.  The default implementation clears the highlight index.
***REMOVED*** @param {goog.events.BrowserEvent} e Blur event to handle.
***REMOVED***
goog.ui.Container.prototype.handleBlur = function(e) {
  this.setHighlightedIndex(-1);
  this.setMouseButtonPressed(false);
  // If the container loses focus, and one of its children is open, close it.
  if (this.openItem_) {
    this.openItem_.setOpen(false);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Attempts to handle a keyboard event, if the control is enabled, by calling
***REMOVED*** {@link handleKeyEventInternal}.  Considered protected; should only be used
***REMOVED*** within this package and by subclasses.
***REMOVED*** @param {goog.events.KeyEvent} e Key event to handle.
***REMOVED*** @return {boolean} Whether the key event was handled.
***REMOVED***
goog.ui.Container.prototype.handleKeyEvent = function(e) {
  if (this.isEnabled() && this.isVisible() &&
      (this.getChildCount() != 0 || this.keyEventTarget_) &&
      this.handleKeyEventInternal(e)) {
    e.preventDefault();
    e.stopPropagation();
    return true;
  }
  return false;
***REMOVED***


***REMOVED***
***REMOVED*** Attempts to handle a keyboard event; returns true if the event was handled,
***REMOVED*** false otherwise.  If the container is enabled, and a child is highlighted,
***REMOVED*** calls the child control's {@code handleKeyEvent} method to give the control
***REMOVED*** a chance to handle the event first.
***REMOVED*** @param {goog.events.KeyEvent} e Key event to handle.
***REMOVED*** @return {boolean} Whether the event was handled by the container (or one of
***REMOVED***     its children).
***REMOVED***
goog.ui.Container.prototype.handleKeyEventInternal = function(e) {
  // Give the highlighted control the chance to handle the key event.
  var highlighted = this.getHighlighted();
  if (highlighted && typeof highlighted.handleKeyEvent == 'function' &&
      highlighted.handleKeyEvent(e)) {
    return true;
  }

  // Give the open control the chance to handle the key event.
  if (this.openItem_ && this.openItem_ != highlighted &&
      typeof this.openItem_.handleKeyEvent == 'function' &&
      this.openItem_.handleKeyEvent(e)) {
    return true;
  }

  // Do not handle the key event if any modifier key is pressed.
  if (e.shiftKey || e.ctrlKey || e.metaKey || e.altKey) {
    return false;
  }

  // Either nothing is highlighted, or the highlighted control didn't handle
  // the key event, so attempt to handle it here.
  switch (e.keyCode) {
    case goog.events.KeyCodes.ESC:
      if (this.isFocusable()) {
        this.getKeyEventTarget().blur();
      } else {
        return false;
      }
      break;

    case goog.events.KeyCodes.HOME:
      this.highlightFirst();
      break;

    case goog.events.KeyCodes.END:
      this.highlightLast();
      break;

    case goog.events.KeyCodes.UP:
      if (this.orientation_ == goog.ui.Container.Orientation.VERTICAL) {
        this.highlightPrevious();
      } else {
        return false;
      }
      break;

    case goog.events.KeyCodes.LEFT:
      if (this.orientation_ == goog.ui.Container.Orientation.HORIZONTAL) {
        if (this.isRightToLeft()) {
          this.highlightNext();
        } else {
          this.highlightPrevious();
        }
      } else {
        return false;
      }
      break;

    case goog.events.KeyCodes.DOWN:
      if (this.orientation_ == goog.ui.Container.Orientation.VERTICAL) {
        this.highlightNext();
      } else {
        return false;
      }
      break;

    case goog.events.KeyCodes.RIGHT:
      if (this.orientation_ == goog.ui.Container.Orientation.HORIZONTAL) {
        if (this.isRightToLeft()) {
          this.highlightPrevious();
        } else {
          this.highlightNext();
        }
      } else {
        return false;
      }
      break;

    default:
      return false;
  }

  return true;
***REMOVED***


// Child component management.


***REMOVED***
***REMOVED*** Creates a DOM ID for the child control and registers it to an internal
***REMOVED*** hash table to be able to find it fast by id.
***REMOVED*** @param {goog.ui.Component} child The child control. Its root element has
***REMOVED***     to be created yet.
***REMOVED*** @private
***REMOVED***
goog.ui.Container.prototype.registerChildId_ = function(child) {
  // Map the DOM ID of the control's root element to the control itself.
  var childElem = child.getElement();

  // If the control's root element doesn't have a DOM ID assign one.
  var id = childElem.id || (childElem.id = child.getId());

  // Lazily create the child element ID map on first use.
  if (!this.childElementIdMap_) {
    this.childElementIdMap_ = {***REMOVED***
  }
  this.childElementIdMap_[id] = child;
***REMOVED***


***REMOVED***
***REMOVED*** Adds the specified control as the last child of this container.  See
***REMOVED*** {@link goog.ui.Container#addChildAt} for detailed semantics.
***REMOVED*** @param {goog.ui.Component} child The new child control.
***REMOVED*** @param {boolean=} opt_render Whether the new child should be rendered
***REMOVED***     immediately after being added (defaults to false).
***REMOVED*** @override
***REMOVED***
goog.ui.Container.prototype.addChild = function(child, opt_render) {
  goog.asserts.assertInstanceof(child, goog.ui.Control,
      'The child of a container must be a control');
  goog.ui.Container.superClass_.addChild.call(this, child, opt_render);
***REMOVED***


***REMOVED***
***REMOVED*** Overrides {@link goog.ui.Container#getChild} to make it clear that it
***REMOVED*** only returns {@link goog.ui.Control}s.
***REMOVED*** @param {string} id Child component ID.
***REMOVED*** @return {goog.ui.Control} The child with the given ID; null if none.
***REMOVED*** @override
***REMOVED***
goog.ui.Container.prototype.getChild;


***REMOVED***
***REMOVED*** Overrides {@link goog.ui.Container#getChildAt} to make it clear that it
***REMOVED*** only returns {@link goog.ui.Control}s.
***REMOVED*** @param {number} index 0-based index.
***REMOVED*** @return {goog.ui.Control} The child with the given ID; null if none.
***REMOVED*** @override
***REMOVED***
goog.ui.Container.prototype.getChildAt;


***REMOVED***
***REMOVED*** Adds the control as a child of this container at the given 0-based index.
***REMOVED*** Overrides {@link goog.ui.Component#addChildAt} by also updating the
***REMOVED*** container's highlight index.  Since {@link goog.ui.Component#addChild} uses
***REMOVED*** {@link #addChildAt} internally, we only need to override this method.
***REMOVED*** @param {goog.ui.Component} control New child.
***REMOVED*** @param {number} index Index at which the new child is to be added.
***REMOVED*** @param {boolean=} opt_render Whether the new child should be rendered
***REMOVED***     immediately after being added (defaults to false).
***REMOVED*** @override
***REMOVED***
goog.ui.Container.prototype.addChildAt = function(control, index, opt_render) {
  // Make sure the child control dispatches HIGHLIGHT, UNHIGHLIGHT, OPEN, and
  // CLOSE events, and that it doesn't steal keyboard focus.
  control.setDispatchTransitionEvents(goog.ui.Component.State.HOVER, true);
  control.setDispatchTransitionEvents(goog.ui.Component.State.OPENED, true);
  if (this.isFocusable() || !this.isFocusableChildrenAllowed()) {
    control.setSupportedState(goog.ui.Component.State.FOCUSED, false);
  }

  // Disable mouse event handling by child controls.
  control.setHandleMouseEvents(false);

  // Let the superclass implementation do the work.
  goog.ui.Container.superClass_.addChildAt.call(this, control, index,
      opt_render);

  if (control.isInDocument() && this.isInDocument()) {
    this.registerChildId_(control);
  }

  // Update the highlight index, if needed.
  if (index <= this.highlightedIndex_) {
    this.highlightedIndex_++;
  }
***REMOVED***


***REMOVED***
***REMOVED*** Removes a child control.  Overrides {@link goog.ui.Component#removeChild} by
***REMOVED*** updating the highlight index.  Since {@link goog.ui.Component#removeChildAt}
***REMOVED*** uses {@link #removeChild} internally, we only need to override this method.
***REMOVED*** @param {string|goog.ui.Component} control The ID of the child to remove, or
***REMOVED***     the control itself.
***REMOVED*** @param {boolean=} opt_unrender Whether to call {@code exitDocument} on the
***REMOVED***     removed control, and detach its DOM from the document (defaults to
***REMOVED***     false).
***REMOVED*** @return {goog.ui.Control} The removed control, if any.
***REMOVED*** @override
***REMOVED***
goog.ui.Container.prototype.removeChild = function(control, opt_unrender) {
  control = goog.isString(control) ? this.getChild(control) : control;

  if (control) {
    var index = this.indexOfChild(control);
    if (index != -1) {
      if (index == this.highlightedIndex_) {
        control.setHighlighted(false);
        this.highlightedIndex_ = -1;
      } else if (index < this.highlightedIndex_) {
        this.highlightedIndex_--;
      }
    }

    // Remove the mapping from the child element ID map.
    var childElem = control.getElement();
    if (childElem && childElem.id && this.childElementIdMap_) {
      goog.object.remove(this.childElementIdMap_, childElem.id);
    }
  }

  control =***REMOVED*****REMOVED*** @type {goog.ui.Control}***REMOVED*** (
      goog.ui.Container.superClass_.removeChild.call(this, control,
          opt_unrender));

  // Re-enable mouse event handling (in case the control is reused elsewhere).
  control.setHandleMouseEvents(true);

  return control;
***REMOVED***


// Container state management.


***REMOVED***
***REMOVED*** Returns the container's orientation.
***REMOVED*** @return {?goog.ui.Container.Orientation} Container orientation.
***REMOVED***
goog.ui.Container.prototype.getOrientation = function() {
  return this.orientation_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the container's orientation.
***REMOVED*** @param {goog.ui.Container.Orientation} orientation Container orientation.
***REMOVED***
// TODO(attila): Do we need to support containers with dynamic orientation?
goog.ui.Container.prototype.setOrientation = function(orientation) {
  if (this.getElement()) {
    // Too late.
    throw Error(goog.ui.Component.Error.ALREADY_RENDERED);
  }

  this.orientation_ = orientation;
***REMOVED***


***REMOVED***
***REMOVED*** Returns true if the container's visibility is set to visible, false if
***REMOVED*** it is set to hidden.  A container that is set to hidden is guaranteed
***REMOVED*** to be hidden from the user, but the reverse isn't necessarily true.
***REMOVED*** A container may be set to visible but can otherwise be obscured by another
***REMOVED*** element, rendered off-screen, or hidden using direct CSS manipulation.
***REMOVED*** @return {boolean} Whether the container is set to be visible.
***REMOVED***
goog.ui.Container.prototype.isVisible = function() {
  return this.visible_;
***REMOVED***


***REMOVED***
***REMOVED*** Shows or hides the container.  Does nothing if the container already has
***REMOVED*** the requested visibility.  Otherwise, dispatches a SHOW or HIDE event as
***REMOVED*** appropriate, giving listeners a chance to prevent the visibility change.
***REMOVED*** @param {boolean} visible Whether to show or hide the container.
***REMOVED*** @param {boolean=} opt_force If true, doesn't check whether the container
***REMOVED***     already has the requested visibility, and doesn't dispatch any events.
***REMOVED*** @return {boolean} Whether the visibility was changed.
***REMOVED***
goog.ui.Container.prototype.setVisible = function(visible, opt_force) {
  if (opt_force || (this.visible_ != visible && this.dispatchEvent(visible ?
      goog.ui.Component.EventType.SHOW : goog.ui.Component.EventType.HIDE))) {
    this.visible_ = visible;

    var elem = this.getElement();
    if (elem) {
      goog.style.setElementShown(elem, visible);
      if (this.isFocusable()) {
        // Enable keyboard access only for enabled & visible containers.
        this.renderer_.enableTabIndex(this.getKeyEventTarget(),
            this.enabled_ && this.visible_);
      }
      if (!opt_force) {
        this.dispatchEvent(this.visible_ ?
            goog.ui.Container.EventType.AFTER_SHOW :
            goog.ui.Container.EventType.AFTER_HIDE);
      }
    }

    return true;
  }

  return false;
***REMOVED***


***REMOVED***
***REMOVED*** Returns true if the container is enabled, false otherwise.
***REMOVED*** @return {boolean} Whether the container is enabled.
***REMOVED***
goog.ui.Container.prototype.isEnabled = function() {
  return this.enabled_;
***REMOVED***


***REMOVED***
***REMOVED*** Enables/disables the container based on the {@code enable} argument.
***REMOVED*** Dispatches an {@code ENABLED} or {@code DISABLED} event prior to changing
***REMOVED*** the container's state, which may be caught and canceled to prevent the
***REMOVED*** container from changing state.  Also enables/disables child controls.
***REMOVED*** @param {boolean} enable Whether to enable or disable the container.
***REMOVED***
goog.ui.Container.prototype.setEnabled = function(enable) {
  if (this.enabled_ != enable && this.dispatchEvent(enable ?
      goog.ui.Component.EventType.ENABLE :
      goog.ui.Component.EventType.DISABLE)) {
    if (enable) {
      // Flag the container as enabled first, then update children.  This is
      // because controls can't be enabled if their parent is disabled.
      this.enabled_ = true;
      this.forEachChild(function(child) {
        // Enable child control unless it is flagged.
        if (child.wasDisabled) {
          delete child.wasDisabled;
        } else {
          child.setEnabled(true);
        }
      });
    } else {
      // Disable children first, then flag the container as disabled.  This is
      // because controls can't be disabled if their parent is already disabled.
      this.forEachChild(function(child) {
        // Disable child control, or flag it if it's already disabled.
        if (child.isEnabled()) {
          child.setEnabled(false);
        } else {
          child.wasDisabled = true;
        }
      });
      this.enabled_ = false;
      this.setMouseButtonPressed(false);
    }

    if (this.isFocusable()) {
      // Enable keyboard access only for enabled & visible components.
      this.renderer_.enableTabIndex(this.getKeyEventTarget(),
          enable && this.visible_);
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** Returns true if the container is focusable, false otherwise.  The default
***REMOVED*** is true.  Focusable containers always have a tab index and allocate a key
***REMOVED*** handler to handle keyboard events while focused.
***REMOVED*** @return {boolean} Whether the component is focusable.
***REMOVED***
goog.ui.Container.prototype.isFocusable = function() {
  return this.focusable_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets whether the container is focusable.  The default is true.  Focusable
***REMOVED*** containers always have a tab index and allocate a key handler to handle
***REMOVED*** keyboard events while focused.
***REMOVED*** @param {boolean} focusable Whether the component is to be focusable.
***REMOVED***
goog.ui.Container.prototype.setFocusable = function(focusable) {
  if (focusable != this.focusable_ && this.isInDocument()) {
    this.enableFocusHandling_(focusable);
  }
  this.focusable_ = focusable;
  if (this.enabled_ && this.visible_) {
    this.renderer_.enableTabIndex(this.getKeyEventTarget(), focusable);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Returns true if the container allows children to be focusable, false
***REMOVED*** otherwise.  Only effective if the container is not focusable.
***REMOVED*** @return {boolean} Whether children should be focusable.
***REMOVED***
goog.ui.Container.prototype.isFocusableChildrenAllowed = function() {
  return this.allowFocusableChildren_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets whether the container allows children to be focusable, false
***REMOVED*** otherwise.  Only effective if the container is not focusable.
***REMOVED*** @param {boolean} focusable Whether the children should be focusable.
***REMOVED***
goog.ui.Container.prototype.setFocusableChildrenAllowed = function(focusable) {
  this.allowFocusableChildren_ = focusable;
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} Whether highlighting a child component should also open it.
***REMOVED***
goog.ui.Container.prototype.isOpenFollowsHighlight = function() {
  return this.openFollowsHighlight_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets whether highlighting a child component should also open it.
***REMOVED*** @param {boolean} follow Whether highlighting a child component also opens it.
***REMOVED***
goog.ui.Container.prototype.setOpenFollowsHighlight = function(follow) {
  this.openFollowsHighlight_ = follow;
***REMOVED***


// Highlight management.


***REMOVED***
***REMOVED*** Returns the index of the currently highlighted item (-1 if none).
***REMOVED*** @return {number} Index of the currently highlighted item.
***REMOVED***
goog.ui.Container.prototype.getHighlightedIndex = function() {
  return this.highlightedIndex_;
***REMOVED***


***REMOVED***
***REMOVED*** Highlights the item at the given 0-based index (if any).  If another item
***REMOVED*** was previously highlighted, it is un-highlighted.
***REMOVED*** @param {number} index Index of item to highlight (-1 removes the current
***REMOVED***     highlight).
***REMOVED***
goog.ui.Container.prototype.setHighlightedIndex = function(index) {
  var child = this.getChildAt(index);
  if (child) {
    child.setHighlighted(true);
  } else if (this.highlightedIndex_ > -1) {
    this.getHighlighted().setHighlighted(false);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Highlights the given item if it exists and is a child of the container;
***REMOVED*** otherwise un-highlights the currently highlighted item.
***REMOVED*** @param {goog.ui.Control} item Item to highlight.
***REMOVED***
goog.ui.Container.prototype.setHighlighted = function(item) {
  this.setHighlightedIndex(this.indexOfChild(item));
***REMOVED***


***REMOVED***
***REMOVED*** Returns the currently highlighted item (if any).
***REMOVED*** @return {goog.ui.Control?} Highlighted item (null if none).
***REMOVED***
goog.ui.Container.prototype.getHighlighted = function() {
  return this.getChildAt(this.highlightedIndex_);
***REMOVED***


***REMOVED***
***REMOVED*** Highlights the first highlightable item in the container
***REMOVED***
goog.ui.Container.prototype.highlightFirst = function() {
  this.highlightHelper(function(index, max) {
    return (index + 1) % max;
  }, this.getChildCount() - 1);
***REMOVED***


***REMOVED***
***REMOVED*** Highlights the last highlightable item in the container.
***REMOVED***
goog.ui.Container.prototype.highlightLast = function() {
  this.highlightHelper(function(index, max) {
    index--;
    return index < 0 ? max - 1 : index;
  }, 0);
***REMOVED***


***REMOVED***
***REMOVED*** Highlights the next highlightable item (or the first if nothing is currently
***REMOVED*** highlighted).
***REMOVED***
goog.ui.Container.prototype.highlightNext = function() {
  this.highlightHelper(function(index, max) {
    return (index + 1) % max;
  }, this.highlightedIndex_);
***REMOVED***


***REMOVED***
***REMOVED*** Highlights the previous highlightable item (or the last if nothing is
***REMOVED*** currently highlighted).
***REMOVED***
goog.ui.Container.prototype.highlightPrevious = function() {
  this.highlightHelper(function(index, max) {
    index--;
    return index < 0 ? max - 1 : index;
  }, this.highlightedIndex_);
***REMOVED***


***REMOVED***
***REMOVED*** Helper function that manages the details of moving the highlight among
***REMOVED*** child controls in response to keyboard events.
***REMOVED*** @param {function(number, number) : number} fn Function that accepts the
***REMOVED***     current and maximum indices, and returns the next index to check.
***REMOVED*** @param {number} startIndex Start index.
***REMOVED*** @return {boolean} Whether the highlight has changed.
***REMOVED*** @protected
***REMOVED***
goog.ui.Container.prototype.highlightHelper = function(fn, startIndex) {
  // If the start index is -1 (meaning there's nothing currently highlighted),
  // try starting from the currently open item, if any.
  var curIndex = startIndex < 0 ?
      this.indexOfChild(this.openItem_) : startIndex;
  var numItems = this.getChildCount();

  curIndex = fn.call(this, curIndex, numItems);
  var visited = 0;
  while (visited <= numItems) {
    var control = this.getChildAt(curIndex);
    if (control && this.canHighlightItem(control)) {
      this.setHighlightedIndexFromKeyEvent(curIndex);
      return true;
    }
    visited++;
    curIndex = fn.call(this, curIndex, numItems);
  }
  return false;
***REMOVED***


***REMOVED***
***REMOVED*** Returns whether the given item can be highlighted.
***REMOVED*** @param {goog.ui.Control} item The item to check.
***REMOVED*** @return {boolean} Whether the item can be highlighted.
***REMOVED*** @protected
***REMOVED***
goog.ui.Container.prototype.canHighlightItem = function(item) {
  return item.isVisible() && item.isEnabled() &&
      item.isSupportedState(goog.ui.Component.State.HOVER);
***REMOVED***


***REMOVED***
***REMOVED*** Helper method that sets the highlighted index to the given index in response
***REMOVED*** to a keyboard event.  The base class implementation simply calls the
***REMOVED*** {@link #setHighlightedIndex} method, but subclasses can override this
***REMOVED*** behavior as needed.
***REMOVED*** @param {number} index Index of item to highlight.
***REMOVED*** @protected
***REMOVED***
goog.ui.Container.prototype.setHighlightedIndexFromKeyEvent = function(index) {
  this.setHighlightedIndex(index);
***REMOVED***


***REMOVED***
***REMOVED*** Returns the currently open (expanded) control in the container (null if
***REMOVED*** none).
***REMOVED*** @return {goog.ui.Control?} The currently open control.
***REMOVED***
goog.ui.Container.prototype.getOpenItem = function() {
  return this.openItem_;
***REMOVED***


***REMOVED***
***REMOVED*** Returns true if the mouse button is pressed, false otherwise.
***REMOVED*** @return {boolean} Whether the mouse button is pressed.
***REMOVED***
goog.ui.Container.prototype.isMouseButtonPressed = function() {
  return this.mouseButtonPressed_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets or clears the "mouse button pressed" flag.
***REMOVED*** @param {boolean} pressed Whether the mouse button is presed.
***REMOVED***
goog.ui.Container.prototype.setMouseButtonPressed = function(pressed) {
  this.mouseButtonPressed_ = pressed;
***REMOVED***
