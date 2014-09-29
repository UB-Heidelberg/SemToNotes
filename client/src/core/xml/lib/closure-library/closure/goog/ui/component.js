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
***REMOVED*** @fileoverview Abstract class for all UI components. This defines the standard
***REMOVED*** design pattern that all UI components should follow.
***REMOVED***
***REMOVED*** @see ../demos/samplecomponent.html
***REMOVED*** @see http://code.google.com/p/closure-library/wiki/IntroToComponents
***REMOVED***

goog.provide('goog.ui.Component');
goog.provide('goog.ui.Component.Error');
goog.provide('goog.ui.Component.EventType');
goog.provide('goog.ui.Component.State');

goog.require('goog.array');
goog.require('goog.array.ArrayLike');
goog.require('goog.dom');
goog.require('goog.events.EventHandler');
goog.require('goog.events.EventTarget');
goog.require('goog.object');
goog.require('goog.style');
goog.require('goog.ui.IdGenerator');



***REMOVED***
***REMOVED*** Default implementation of UI component.
***REMOVED***
***REMOVED*** @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper.
***REMOVED***
***REMOVED*** @extends {goog.events.EventTarget}
***REMOVED***
goog.ui.Component = function(opt_domHelper) {
  goog.events.EventTarget.call(this);
  this.dom_ = opt_domHelper || goog.dom.getDomHelper();

  // Set the defalt right to left value.
  this.rightToLeft_ = goog.ui.Component.defaultRightToLeft_;
***REMOVED***
goog.inherits(goog.ui.Component, goog.events.EventTarget);


***REMOVED***
***REMOVED*** Generator for unique IDs.
***REMOVED*** @type {goog.ui.IdGenerator}
***REMOVED*** @private
***REMOVED***
goog.ui.Component.prototype.idGenerator_ = goog.ui.IdGenerator.getInstance();


***REMOVED***
***REMOVED*** The default right to left value.
***REMOVED*** @type {?boolean}
***REMOVED*** @private
***REMOVED***
goog.ui.Component.defaultRightToLeft_ = null;


***REMOVED***
***REMOVED*** Common events fired by components so that event propagation is useful.  Not
***REMOVED*** all components are expected to dispatch or listen for all event types.
***REMOVED*** Events dispatched before a state transition should be cancelable to prevent
***REMOVED*** the corresponding state change.
***REMOVED*** @enum {string}
***REMOVED***
goog.ui.Component.EventType = {
 ***REMOVED*****REMOVED*** Dispatched before the component becomes visible.***REMOVED***
  BEFORE_SHOW: 'beforeshow',

 ***REMOVED*****REMOVED***
  ***REMOVED*** Dispatched after the component becomes visible.
  ***REMOVED*** NOTE(user): For goog.ui.Container, this actually fires before containers
  ***REMOVED*** are shown.  Use goog.ui.Container.EventType.AFTER_SHOW if you want an event
  ***REMOVED*** that fires after a goog.ui.Container is shown.
 ***REMOVED*****REMOVED***
  SHOW: 'show',

 ***REMOVED*****REMOVED*** Dispatched before the component becomes hidden.***REMOVED***
  HIDE: 'hide',

 ***REMOVED*****REMOVED*** Dispatched before the component becomes disabled.***REMOVED***
  DISABLE: 'disable',

 ***REMOVED*****REMOVED*** Dispatched before the component becomes enabled.***REMOVED***
  ENABLE: 'enable',

 ***REMOVED*****REMOVED*** Dispatched before the component becomes highlighted.***REMOVED***
  HIGHLIGHT: 'highlight',

 ***REMOVED*****REMOVED*** Dispatched before the component becomes un-highlighted.***REMOVED***
  UNHIGHLIGHT: 'unhighlight',

 ***REMOVED*****REMOVED*** Dispatched before the component becomes activated.***REMOVED***
  ACTIVATE: 'activate',

 ***REMOVED*****REMOVED*** Dispatched before the component becomes deactivated.***REMOVED***
  DEACTIVATE: 'deactivate',

 ***REMOVED*****REMOVED*** Dispatched before the component becomes selected.***REMOVED***
  SELECT: 'select',

 ***REMOVED*****REMOVED*** Dispatched before the component becomes un-selected.***REMOVED***
  UNSELECT: 'unselect',

 ***REMOVED*****REMOVED*** Dispatched before a component becomes checked.***REMOVED***
  CHECK: 'check',

 ***REMOVED*****REMOVED*** Dispatched before a component becomes un-checked.***REMOVED***
  UNCHECK: 'uncheck',

 ***REMOVED*****REMOVED*** Dispatched before a component becomes focused.***REMOVED***
  FOCUS: 'focus',

 ***REMOVED*****REMOVED*** Dispatched before a component becomes blurred.***REMOVED***
  BLUR: 'blur',

 ***REMOVED*****REMOVED*** Dispatched before a component is opened (expanded).***REMOVED***
  OPEN: 'open',

 ***REMOVED*****REMOVED*** Dispatched before a component is closed (collapsed).***REMOVED***
  CLOSE: 'close',

 ***REMOVED*****REMOVED*** Dispatched after a component is moused over.***REMOVED***
  ENTER: 'enter',

 ***REMOVED*****REMOVED*** Dispatched after a component is moused out of.***REMOVED***
  LEAVE: 'leave',

 ***REMOVED*****REMOVED*** Dispatched after the user activates the component.***REMOVED***
  ACTION: 'action',

 ***REMOVED*****REMOVED*** Dispatched after the external-facing state of a component is changed.***REMOVED***
  CHANGE: 'change'
***REMOVED***


***REMOVED***
***REMOVED*** Errors thrown by the component.
***REMOVED*** @enum {string}
***REMOVED***
goog.ui.Component.Error = {
 ***REMOVED*****REMOVED***
  ***REMOVED*** Error when a method is not supported.
 ***REMOVED*****REMOVED***
  NOT_SUPPORTED: 'Method not supported',

 ***REMOVED*****REMOVED***
  ***REMOVED*** Error when the given element can not be decorated.
 ***REMOVED*****REMOVED***
  DECORATE_INVALID: 'Invalid element to decorate',

 ***REMOVED*****REMOVED***
  ***REMOVED*** Error when the component is already rendered and another render attempt is
  ***REMOVED*** made.
 ***REMOVED*****REMOVED***
  ALREADY_RENDERED: 'Component already rendered',

 ***REMOVED*****REMOVED***
  ***REMOVED*** Error when an attempt is made to set the parent of a component in a way
  ***REMOVED*** that would result in an inconsistent object graph.
 ***REMOVED*****REMOVED***
  PARENT_UNABLE_TO_BE_SET: 'Unable to set parent component',

 ***REMOVED*****REMOVED***
  ***REMOVED*** Error when an attempt is made to add a child component at an out-of-bounds
  ***REMOVED*** index.  We don't support sparse child arrays.
 ***REMOVED*****REMOVED***
  CHILD_INDEX_OUT_OF_BOUNDS: 'Child component index out of bounds',

 ***REMOVED*****REMOVED***
  ***REMOVED*** Error when an attempt is made to remove a child component from a component
  ***REMOVED*** other than its parent.
 ***REMOVED*****REMOVED***
  NOT_OUR_CHILD: 'Child is not in parent component',

 ***REMOVED*****REMOVED***
  ***REMOVED*** Error when an operation requiring DOM interaction is made when the
  ***REMOVED*** component is not in the document
 ***REMOVED*****REMOVED***
  NOT_IN_DOCUMENT: 'Operation not supported while component is not in document',

 ***REMOVED*****REMOVED***
  ***REMOVED*** Error when an invalid component state is encountered.
 ***REMOVED*****REMOVED***
  STATE_INVALID: 'Invalid component state'
***REMOVED***


***REMOVED***
***REMOVED*** Common component states.  Components may have distinct appearance depending
***REMOVED*** on what state(s) apply to them.  Not all components are expected to support
***REMOVED*** all states.
***REMOVED*** @enum {number}
***REMOVED***
goog.ui.Component.State = {
 ***REMOVED*****REMOVED***
  ***REMOVED*** Union of all supported component states.
 ***REMOVED*****REMOVED***
  ALL: 0xFF,

 ***REMOVED*****REMOVED***
  ***REMOVED*** Component is disabled.
  ***REMOVED*** @see goog.ui.Component.EventType.DISABLE
  ***REMOVED*** @see goog.ui.Component.EventType.ENABLE
 ***REMOVED*****REMOVED***
  DISABLED: 0x01,

 ***REMOVED*****REMOVED***
  ***REMOVED*** Component is highlighted.
  ***REMOVED*** @see goog.ui.Component.EventType.HIGHLIGHT
  ***REMOVED*** @see goog.ui.Component.EventType.UNHIGHLIGHT
 ***REMOVED*****REMOVED***
  HOVER: 0x02,

 ***REMOVED*****REMOVED***
  ***REMOVED*** Component is active (or "pressed").
  ***REMOVED*** @see goog.ui.Component.EventType.ACTIVATE
  ***REMOVED*** @see goog.ui.Component.EventType.DEACTIVATE
 ***REMOVED*****REMOVED***
  ACTIVE: 0x04,

 ***REMOVED*****REMOVED***
  ***REMOVED*** Component is selected.
  ***REMOVED*** @see goog.ui.Component.EventType.SELECT
  ***REMOVED*** @see goog.ui.Component.EventType.UNSELECT
 ***REMOVED*****REMOVED***
  SELECTED: 0x08,

 ***REMOVED*****REMOVED***
  ***REMOVED*** Component is checked.
  ***REMOVED*** @see goog.ui.Component.EventType.CHECK
  ***REMOVED*** @see goog.ui.Component.EventType.UNCHECK
 ***REMOVED*****REMOVED***
  CHECKED: 0x10,

 ***REMOVED*****REMOVED***
  ***REMOVED*** Component has focus.
  ***REMOVED*** @see goog.ui.Component.EventType.FOCUS
  ***REMOVED*** @see goog.ui.Component.EventType.BLUR
 ***REMOVED*****REMOVED***
  FOCUSED: 0x20,

 ***REMOVED*****REMOVED***
  ***REMOVED*** Component is opened (expanded).  Applies to tree nodes, menu buttons,
  ***REMOVED*** submenus, zippys (zippies?), etc.
  ***REMOVED*** @see goog.ui.Component.EventType.OPEN
  ***REMOVED*** @see goog.ui.Component.EventType.CLOSE
 ***REMOVED*****REMOVED***
  OPENED: 0x40
***REMOVED***


***REMOVED***
***REMOVED*** Static helper method; returns the type of event components are expected to
***REMOVED*** dispatch when transitioning to or from the given state.
***REMOVED*** @param {goog.ui.Component.State} state State to/from which the component
***REMOVED***     is transitioning.
***REMOVED*** @param {boolean} isEntering Whether the component is entering or leaving the
***REMOVED***     state.
***REMOVED*** @return {goog.ui.Component.EventType} Event type to dispatch.
***REMOVED***
goog.ui.Component.getStateTransitionEvent = function(state, isEntering) {
  switch (state) {
    case goog.ui.Component.State.DISABLED:
      return isEntering ? goog.ui.Component.EventType.DISABLE :
          goog.ui.Component.EventType.ENABLE;
    case goog.ui.Component.State.HOVER:
      return isEntering ? goog.ui.Component.EventType.HIGHLIGHT :
          goog.ui.Component.EventType.UNHIGHLIGHT;
    case goog.ui.Component.State.ACTIVE:
      return isEntering ? goog.ui.Component.EventType.ACTIVATE :
          goog.ui.Component.EventType.DEACTIVATE;
    case goog.ui.Component.State.SELECTED:
      return isEntering ? goog.ui.Component.EventType.SELECT :
          goog.ui.Component.EventType.UNSELECT;
    case goog.ui.Component.State.CHECKED:
      return isEntering ? goog.ui.Component.EventType.CHECK :
          goog.ui.Component.EventType.UNCHECK;
    case goog.ui.Component.State.FOCUSED:
      return isEntering ? goog.ui.Component.EventType.FOCUS :
          goog.ui.Component.EventType.BLUR;
    case goog.ui.Component.State.OPENED:
      return isEntering ? goog.ui.Component.EventType.OPEN :
          goog.ui.Component.EventType.CLOSE;
    default:
      // Fall through.
  }

  // Invalid state.
  throw Error(goog.ui.Component.Error.STATE_INVALID);
***REMOVED***


***REMOVED***
***REMOVED*** Set the default right-to-left value. This causes all component's created from
***REMOVED*** this point foward to have the given value. This is useful for cases where
***REMOVED*** a given page is always in one directionality, avoiding unnecessary
***REMOVED*** right to left determinations.
***REMOVED*** @param {?boolean} rightToLeft Whether the components should be rendered
***REMOVED***     right-to-left. Null iff components should determine their directionality.
***REMOVED***
goog.ui.Component.setDefaultRightToLeft = function(rightToLeft) {
  goog.ui.Component.defaultRightToLeft_ = rightToLeft;
***REMOVED***


***REMOVED***
***REMOVED*** Unique ID of the component, lazily initialized in {@link
***REMOVED*** goog.ui.Component#getId} if needed.  This property is strictly private and
***REMOVED*** must not be accessed directly outside of this class!
***REMOVED*** @type {?string}
***REMOVED*** @private
***REMOVED***
goog.ui.Component.prototype.id_ = null;


***REMOVED***
***REMOVED*** DomHelper used to interact with the document, allowing components to be
***REMOVED*** created in a different window.
***REMOVED*** @type {!goog.dom.DomHelper}
***REMOVED*** @protected
***REMOVED*** @suppress {underscore}
***REMOVED***
goog.ui.Component.prototype.dom_;


***REMOVED***
***REMOVED*** Whether the component is in the document.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.ui.Component.prototype.inDocument_ = false;


// TODO(attila): Stop referring to this private field in subclasses.
***REMOVED***
***REMOVED*** The DOM element for the component.
***REMOVED*** @type {Element}
***REMOVED*** @private
***REMOVED***
goog.ui.Component.prototype.element_ = null;


***REMOVED***
***REMOVED*** Event handler.
***REMOVED*** TODO(user): rename it to handler_ after all component subclasses in
***REMOVED*** inside Google have been cleaned up.
***REMOVED*** Code search: http://go/component_code_search
***REMOVED*** @type {goog.events.EventHandler}
***REMOVED*** @private
***REMOVED***
goog.ui.Component.prototype.googUiComponentHandler_;


***REMOVED***
***REMOVED*** Whether the component is rendered right-to-left.  Right-to-left is set
***REMOVED*** lazily when {@link #isRightToLeft} is called the first time, unless it has
***REMOVED*** been set by calling {@link #setRightToLeft} explicitly.
***REMOVED*** @type {?boolean}
***REMOVED*** @private
***REMOVED***
goog.ui.Component.prototype.rightToLeft_ = null;


***REMOVED***
***REMOVED*** Arbitrary data object associated with the component.  Such as meta-data.
***REMOVED*** @type {*}
***REMOVED*** @private
***REMOVED***
goog.ui.Component.prototype.model_ = null;


***REMOVED***
***REMOVED*** Parent component to which events will be propagated.  This property is
***REMOVED*** strictly private and must not be accessed directly outside of this class!
***REMOVED*** @type {goog.ui.Component?}
***REMOVED*** @private
***REMOVED***
goog.ui.Component.prototype.parent_ = null;


***REMOVED***
***REMOVED*** Array of child components.  Lazily initialized on first use.  Must be kept in
***REMOVED*** sync with {@code childIndex_}.  This property is strictly private and must
***REMOVED*** not be accessed directly outside of this class!
***REMOVED*** @type {Array.<goog.ui.Component>?}
***REMOVED*** @private
***REMOVED***
goog.ui.Component.prototype.children_ = null;


***REMOVED***
***REMOVED*** Map of child component IDs to child components.  Used for constant-time
***REMOVED*** random access to child components by ID.  Lazily initialized on first use.
***REMOVED*** Must be kept in sync with {@code children_}.  This property is strictly
***REMOVED*** private and must not be accessed directly outside of this class!
***REMOVED***
***REMOVED*** We use a plain Object, not a {@link goog.structs.Map}, for simplicity.
***REMOVED*** This means components can't have children with IDs such as 'constructor' or
***REMOVED*** 'valueOf', but this shouldn't really be an issue in practice, and if it is,
***REMOVED*** we can always fix it later without changing the API.
***REMOVED***
***REMOVED*** @type {Object}
***REMOVED*** @private
***REMOVED***
goog.ui.Component.prototype.childIndex_ = null;


***REMOVED***
***REMOVED*** Flag used to keep track of whether a component decorated an already existing
***REMOVED*** element or whether it created the DOM itself.
***REMOVED***
***REMOVED*** If an element is decorated, dispose will leave the node in the document.
***REMOVED*** It is up to the app to remove the node.
***REMOVED***
***REMOVED*** If an element was rendered, dispose will remove the node automatically.
***REMOVED***
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.ui.Component.prototype.wasDecorated_ = false;


***REMOVED***
***REMOVED*** Gets the unique ID for the instance of this component.  If the instance
***REMOVED*** doesn't already have an ID, generates one on the fly.
***REMOVED*** @return {string} Unique component ID.
***REMOVED***
goog.ui.Component.prototype.getId = function() {
  return this.id_ || (this.id_ = this.idGenerator_.getNextUniqueId());
***REMOVED***


***REMOVED***
***REMOVED*** Assigns an ID to this component instance.  It is the caller's responsibility
***REMOVED*** to guarantee that the ID is unique.  If the component is a child of a parent
***REMOVED*** component, then the parent component's child index is updated to reflect the
***REMOVED*** new ID; this may throw an error if the parent already has a child with an ID
***REMOVED*** that conflicts with the new ID.
***REMOVED*** @param {string} id Unique component ID.
***REMOVED***
goog.ui.Component.prototype.setId = function(id) {
  if (this.parent_ && this.parent_.childIndex_) {
    // Update the parent's child index.
    goog.object.remove(this.parent_.childIndex_, this.id_);
    goog.object.add(this.parent_.childIndex_, id, this);
  }

  // Update the component ID.
  this.id_ = id;
***REMOVED***


***REMOVED***
***REMOVED*** Gets the component's element.
***REMOVED*** @return {Element} The element for the component.
***REMOVED***
goog.ui.Component.prototype.getElement = function() {
  return this.element_;
***REMOVED***


***REMOVED***
***REMOVED*** Gets the component's element. This differs from getElement in that
***REMOVED*** it assumes that the element exists (i.e. the component has been
***REMOVED*** rendered/decorated) and will cause an assertion error otherwise (if
***REMOVED*** assertion is enabled).
***REMOVED*** @return {!Element} The element for the component.
***REMOVED***
goog.ui.Component.prototype.getElementStrict = function() {
  var el = this.element_;
  goog.asserts.assert(
      el, 'Can not call getElementStrict before rendering/decorating.');
  return el;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the component's root element to the given element.  Considered
***REMOVED*** protected and final.
***REMOVED***
***REMOVED*** This should generally only be called during createDom. Setting the element
***REMOVED*** does not actually change which element is rendered, only the element that is
***REMOVED*** associated with this UI component.
***REMOVED***
***REMOVED*** @param {Element} element Root element for the component.
***REMOVED*** @protected
***REMOVED***
goog.ui.Component.prototype.setElementInternal = function(element) {
  this.element_ = element;
***REMOVED***


***REMOVED***
***REMOVED*** Returns an array of all the elements in this component's DOM with the
***REMOVED*** provided className.
***REMOVED*** @param {string} className The name of the class to look for.
***REMOVED*** @return {!goog.array.ArrayLike} The items found with the class name provided.
***REMOVED***
goog.ui.Component.prototype.getElementsByClass = function(className) {
  return this.element_ ?
      this.dom_.getElementsByClass(className, this.element_) : [];
***REMOVED***


***REMOVED***
***REMOVED*** Returns the first element in this component's DOM with the provided
***REMOVED*** className.
***REMOVED*** @param {string} className The name of the class to look for.
***REMOVED*** @return {Element} The first item with the class name provided.
***REMOVED***
goog.ui.Component.prototype.getElementByClass = function(className) {
  return this.element_ ?
      this.dom_.getElementByClass(className, this.element_) : null;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the event handler for this component, lazily created the first time
***REMOVED*** this method is called.
***REMOVED*** @return {!goog.events.EventHandler} Event handler for this component.
***REMOVED*** @protected
***REMOVED***
goog.ui.Component.prototype.getHandler = function() {
  return this.googUiComponentHandler_ ||
         (this.googUiComponentHandler_ = new goog.events.EventHandler(this));
***REMOVED***


***REMOVED***
***REMOVED*** Sets the parent of this component to use for event bubbling.  Throws an error
***REMOVED*** if the component already has a parent or if an attempt is made to add a
***REMOVED*** component to itself as a child.  Callers must use {@code removeChild}
***REMOVED*** or {@code removeChildAt} to remove components from their containers before
***REMOVED*** calling this method.
***REMOVED*** @see goog.ui.Component#removeChild
***REMOVED*** @see goog.ui.Component#removeChildAt
***REMOVED*** @param {goog.ui.Component} parent The parent component.
***REMOVED***
goog.ui.Component.prototype.setParent = function(parent) {
  if (this == parent) {
    // Attempting to add a child to itself is an error.
    throw Error(goog.ui.Component.Error.PARENT_UNABLE_TO_BE_SET);
  }

  if (parent && this.parent_ && this.id_ && this.parent_.getChild(this.id_) &&
      this.parent_ != parent) {
    // This component is already the child of some parent, so it should be
    // removed using removeChild/removeChildAt first.
    throw Error(goog.ui.Component.Error.PARENT_UNABLE_TO_BE_SET);
  }

  this.parent_ = parent;
  goog.ui.Component.superClass_.setParentEventTarget.call(this, parent);
***REMOVED***


***REMOVED***
***REMOVED*** Returns the component's parent, if any.
***REMOVED*** @return {goog.ui.Component?} The parent component.
***REMOVED***
goog.ui.Component.prototype.getParent = function() {
  return this.parent_;
***REMOVED***


***REMOVED***
***REMOVED*** Overrides {@link goog.events.EventTarget#setParentEventTarget} to throw an
***REMOVED*** error if the parent component is set, and the argument is not the parent.
***REMOVED*** @override
***REMOVED***
goog.ui.Component.prototype.setParentEventTarget = function(parent) {
  if (this.parent_ && this.parent_ != parent) {
    throw Error(goog.ui.Component.Error.NOT_SUPPORTED);
  }
  goog.ui.Component.superClass_.setParentEventTarget.call(this, parent);
***REMOVED***


***REMOVED***
***REMOVED*** Returns the dom helper that is being used on this component.
***REMOVED*** @return {!goog.dom.DomHelper} The dom helper used on this component.
***REMOVED***
goog.ui.Component.prototype.getDomHelper = function() {
  return this.dom_;
***REMOVED***


***REMOVED***
***REMOVED*** Determines whether the component has been added to the document.
***REMOVED*** @return {boolean} TRUE if rendered. Otherwise, FALSE.
***REMOVED***
goog.ui.Component.prototype.isInDocument = function() {
  return this.inDocument_;
***REMOVED***


***REMOVED***
***REMOVED*** Creates the initial DOM representation for the component.  The default
***REMOVED*** implementation is to set this.element_ = div.
***REMOVED***
goog.ui.Component.prototype.createDom = function() {
  this.element_ = this.dom_.createElement('div');
***REMOVED***


***REMOVED***
***REMOVED*** Renders the component.  If a parent element is supplied, the component's
***REMOVED*** element will be appended to it.  If there is no optional parent element and
***REMOVED*** the element doesn't have a parentNode then it will be appended to the
***REMOVED*** document body.
***REMOVED***
***REMOVED*** If this component has a parent component, and the parent component is
***REMOVED*** not in the document already, then this will not call {@code enterDocument}
***REMOVED*** on this component.
***REMOVED***
***REMOVED*** Throws an Error if the component is already rendered.
***REMOVED***
***REMOVED*** @param {Element=} opt_parentElement Optional parent element to render the
***REMOVED***    component into.
***REMOVED***
goog.ui.Component.prototype.render = function(opt_parentElement) {
  this.render_(opt_parentElement);
***REMOVED***


***REMOVED***
***REMOVED*** Renders the component before another element. The other element should be in
***REMOVED*** the document already.
***REMOVED***
***REMOVED*** Throws an Error if the component is already rendered.
***REMOVED***
***REMOVED*** @param {Node} sibling Node to render the component before.
***REMOVED***
goog.ui.Component.prototype.renderBefore = function(sibling) {
  this.render_(***REMOVED*** @type {Element}***REMOVED*** (sibling.parentNode),
               sibling);
***REMOVED***


***REMOVED***
***REMOVED*** Renders the component.  If a parent element is supplied, the component's
***REMOVED*** element will be appended to it.  If there is no optional parent element and
***REMOVED*** the element doesn't have a parentNode then it will be appended to the
***REMOVED*** document body.
***REMOVED***
***REMOVED*** If this component has a parent component, and the parent component is
***REMOVED*** not in the document already, then this will not call {@code enterDocument}
***REMOVED*** on this component.
***REMOVED***
***REMOVED*** Throws an Error if the component is already rendered.
***REMOVED***
***REMOVED*** @param {Element=} opt_parentElement Optional parent element to render the
***REMOVED***    component into.
***REMOVED*** @param {Node=} opt_beforeNode Node before which the component is to
***REMOVED***    be rendered.  If left out the node is appended to the parent element.
***REMOVED*** @private
***REMOVED***
goog.ui.Component.prototype.render_ = function(opt_parentElement,
                                               opt_beforeNode) {
  if (this.inDocument_) {
    throw Error(goog.ui.Component.Error.ALREADY_RENDERED);
  }

  if (!this.element_) {
    this.createDom();
  }

  if (opt_parentElement) {
    opt_parentElement.insertBefore(this.element_, opt_beforeNode || null);
  } else {
    this.dom_.getDocument().body.appendChild(this.element_);
  }

  // If this component has a parent component that isn't in the document yet,
  // we don't call enterDocument() here.  Instead, when the parent component
  // enters the document, the enterDocument() call will propagate to its
  // children, including this one.  If the component doesn't have a parent
  // or if the parent is already in the document, we call enterDocument().
  if (!this.parent_ || this.parent_.isInDocument()) {
    this.enterDocument();
  }
***REMOVED***


***REMOVED***
***REMOVED*** Decorates the element for the UI component.
***REMOVED*** @param {Element} element Element to decorate.
***REMOVED***
goog.ui.Component.prototype.decorate = function(element) {
  if (this.inDocument_) {
    throw Error(goog.ui.Component.Error.ALREADY_RENDERED);
  } else if (element && this.canDecorate(element)) {
    this.wasDecorated_ = true;

    // Set the DOM helper of the component to match the decorated element.
    if (!this.dom_ ||
        this.dom_.getDocument() != goog.dom.getOwnerDocument(element)) {
      this.dom_ = goog.dom.getDomHelper(element);
    }

    // Call specific component decorate logic.
    this.decorateInternal(element);
    this.enterDocument();
  } else {
    throw Error(goog.ui.Component.Error.DECORATE_INVALID);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Determines if a given element can be decorated by this type of component.
***REMOVED*** This method should be overridden by inheriting objects.
***REMOVED*** @param {Element} element Element to decorate.
***REMOVED*** @return {boolean} True if the element can be decorated, false otherwise.
***REMOVED***
goog.ui.Component.prototype.canDecorate = function(element) {
  return true;
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} Whether the component was decorated.
***REMOVED***
goog.ui.Component.prototype.wasDecorated = function() {
  return this.wasDecorated_;
***REMOVED***


***REMOVED***
***REMOVED*** Actually decorates the element. Should be overridden by inheriting objects.
***REMOVED*** This method can assume there are checks to ensure the component has not
***REMOVED*** already been rendered have occurred and that enter document will be called
***REMOVED*** afterwards. This method is considered protected.
***REMOVED*** @param {Element} element Element to decorate.
***REMOVED*** @protected
***REMOVED***
goog.ui.Component.prototype.decorateInternal = function(element) {
  this.element_ = element;
***REMOVED***


***REMOVED***
***REMOVED*** Called when the component's element is known to be in the document. Anything
***REMOVED*** using document.getElementById etc. should be done at this stage.
***REMOVED***
***REMOVED*** If the component contains child components, this call is propagated to its
***REMOVED*** children.
***REMOVED***
goog.ui.Component.prototype.enterDocument = function() {
  this.inDocument_ = true;

  // Propagate enterDocument to child components that have a DOM, if any.
  this.forEachChild(function(child) {
    if (!child.isInDocument() && child.getElement()) {
      child.enterDocument();
    }
  });
***REMOVED***


***REMOVED***
***REMOVED*** Called by dispose to clean up the elements and listeners created by a
***REMOVED*** component, or by a parent component/application who has removed the
***REMOVED*** component from the document but wants to reuse it later.
***REMOVED***
***REMOVED*** If the component contains child components, this call is propagated to its
***REMOVED*** children.
***REMOVED***
***REMOVED*** It should be possible for the component to be rendered again once this method
***REMOVED*** has been called.
***REMOVED***
goog.ui.Component.prototype.exitDocument = function() {
  // Propagate exitDocument to child components that have been rendered, if any.
  this.forEachChild(function(child) {
    if (child.isInDocument()) {
      child.exitDocument();
    }
  });

  if (this.googUiComponentHandler_) {
    this.googUiComponentHandler_.removeAll();
  }

  this.inDocument_ = false;
***REMOVED***


***REMOVED***
***REMOVED*** Disposes of the component.  Calls {@code exitDocument}, which is expected to
***REMOVED*** remove event handlers and clean up the component.  Propagates the call to
***REMOVED*** the component's children, if any. Removes the component's DOM from the
***REMOVED*** document unless it was decorated.
***REMOVED*** @override
***REMOVED*** @protected
***REMOVED***
goog.ui.Component.prototype.disposeInternal = function() {
  if (this.inDocument_) {
    this.exitDocument();
  }

  if (this.googUiComponentHandler_) {
    this.googUiComponentHandler_.dispose();
    delete this.googUiComponentHandler_;
  }

  // Disposes of the component's children, if any.
  this.forEachChild(function(child) {
    child.dispose();
  });

  // Detach the component's element from the DOM, unless it was decorated.
  if (!this.wasDecorated_ && this.element_) {
    goog.dom.removeNode(this.element_);
  }

  this.children_ = null;
  this.childIndex_ = null;
  this.element_ = null;
  this.model_ = null;
  this.parent_ = null;

  goog.ui.Component.superClass_.disposeInternal.call(this);
***REMOVED***


***REMOVED***
***REMOVED*** Helper function for subclasses that gets a unique id for a given fragment,
***REMOVED*** this can be used by components to generate unique string ids for DOM
***REMOVED*** elements.
***REMOVED*** @param {string} idFragment A partial id.
***REMOVED*** @return {string} Unique element id.
***REMOVED***
goog.ui.Component.prototype.makeId = function(idFragment) {
  return this.getId() + '.' + idFragment;
***REMOVED***


***REMOVED***
***REMOVED*** Makes a collection of ids.  This is a convenience method for makeId.  The
***REMOVED*** object's values are the id fragments and the new values are the generated
***REMOVED*** ids.  The key will remain the same.
***REMOVED*** @param {Object} object The object that will be used to create the ids.
***REMOVED*** @return {Object} An object of id keys to generated ids.
***REMOVED***
goog.ui.Component.prototype.makeIds = function(object) {
  var ids = {***REMOVED***
  for (var key in object) {
    ids[key] = this.makeId(object[key]);
  }
  return ids;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the model associated with the UI component.
***REMOVED*** @return {*} The model.
***REMOVED***
goog.ui.Component.prototype.getModel = function() {
  return this.model_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the model associated with the UI component.
***REMOVED*** @param {*} obj The model.
***REMOVED***
goog.ui.Component.prototype.setModel = function(obj) {
  this.model_ = obj;
***REMOVED***


***REMOVED***
***REMOVED*** Helper function for returning the fragment portion of an id generated using
***REMOVED*** makeId().
***REMOVED*** @param {string} id Id generated with makeId().
***REMOVED*** @return {string} Fragment.
***REMOVED***
goog.ui.Component.prototype.getFragmentFromId = function(id) {
  return id.substring(this.getId().length + 1);
***REMOVED***


***REMOVED***
***REMOVED*** Helper function for returning an element in the document with a unique id
***REMOVED*** generated using makeId().
***REMOVED*** @param {string} idFragment The partial id.
***REMOVED*** @return {Element} The element with the unique id, or null if it cannot be
***REMOVED***     found.
***REMOVED***
goog.ui.Component.prototype.getElementByFragment = function(idFragment) {
  if (!this.inDocument_) {
    throw Error(goog.ui.Component.Error.NOT_IN_DOCUMENT);
  }
  return this.dom_.getElement(this.makeId(idFragment));
***REMOVED***


***REMOVED***
***REMOVED*** Adds the specified component as the last child of this component.  See
***REMOVED*** {@link goog.ui.Component#addChildAt} for detailed semantics.
***REMOVED***
***REMOVED*** @see goog.ui.Component#addChildAt
***REMOVED*** @param {goog.ui.Component} child The new child component.
***REMOVED*** @param {boolean=} opt_render If true, the child component will be rendered
***REMOVED***    into the parent.
***REMOVED***
goog.ui.Component.prototype.addChild = function(child, opt_render) {
  // TODO(gboyer): addChildAt(child, this.getChildCount(), false) will
  // reposition any already-rendered child to the end.  Instead, perhaps
  // addChild(child, false) should never reposition the child; instead, clients
  // that need the repositioning will use addChildAt explicitly.  Right now,
  // clients can get around this by calling addChild first.
  this.addChildAt(child, this.getChildCount(), opt_render);
***REMOVED***


***REMOVED***
***REMOVED*** Adds the specified component as a child of this component at the given
***REMOVED*** 0-based index.
***REMOVED***
***REMOVED*** Both {@code addChild} and {@code addChildAt} assume the following contract
***REMOVED*** between parent and child components:
***REMOVED***  <ul>
***REMOVED***    <li>the child component's element must be a descendant of the parent
***REMOVED***        component's element, and
***REMOVED***    <li>the DOM state of the child component must be consistent with the DOM
***REMOVED***        state of the parent component (see {@code isInDocument}) in the
***REMOVED***        steady state -- the exception is to addChildAt(child, i, false) and
***REMOVED***        then immediately decorate/render the child.
***REMOVED***  </ul>
***REMOVED***
***REMOVED*** In particular, {@code parent.addChild(child)} will throw an error if the
***REMOVED*** child component is already in the document, but the parent isn't.
***REMOVED***
***REMOVED*** Clients of this API may call {@code addChild} and {@code addChildAt} with
***REMOVED*** {@code opt_render} set to true.  If {@code opt_render} is true, calling these
***REMOVED*** methods will automatically render the child component's element into the
***REMOVED*** parent component's element.  However, {@code parent.addChild(child, true)}
***REMOVED*** will throw an error if:
***REMOVED***  <ul>
***REMOVED***    <li>the parent component has no DOM (i.e. {@code parent.getElement()} is
***REMOVED***        null), or
***REMOVED***    <li>the child component is already in the document, regardless of the
***REMOVED***        parent's DOM state.
***REMOVED***  </ul>
***REMOVED***
***REMOVED*** If {@code opt_render} is true and the parent component is not already
***REMOVED*** in the document, {@code enterDocument} will not be called on this component
***REMOVED*** at this point.
***REMOVED***
***REMOVED*** Finally, this method also throws an error if the new child already has a
***REMOVED*** different parent, or the given index is out of bounds.
***REMOVED***
***REMOVED*** @see goog.ui.Component#addChild
***REMOVED*** @param {goog.ui.Component} child The new child component.
***REMOVED*** @param {number} index 0-based index at which the new child component is to be
***REMOVED***    added; must be between 0 and the current child count (inclusive).
***REMOVED*** @param {boolean=} opt_render If true, the child component will be rendered
***REMOVED***    into the parent.
***REMOVED*** @return {void} Nada.
***REMOVED***
goog.ui.Component.prototype.addChildAt = function(child, index, opt_render) {
  if (child.inDocument_ && (opt_render || !this.inDocument_)) {
    // Adding a child that's already in the document is an error, except if the
    // parent is also in the document and opt_render is false (e.g. decorate()).
    throw Error(goog.ui.Component.Error.ALREADY_RENDERED);
  }

  if (index < 0 || index > this.getChildCount()) {
    // Allowing sparse child arrays would lead to strange behavior, so we don't.
    throw Error(goog.ui.Component.Error.CHILD_INDEX_OUT_OF_BOUNDS);
  }

  // Create the index and the child array on first use.
  if (!this.childIndex_ || !this.children_) {
    this.childIndex_ = {***REMOVED***
    this.children_ = [];
  }

  // Moving child within component, remove old reference.
  if (child.getParent() == this) {
    goog.object.set(this.childIndex_, child.getId(), child);
    goog.array.remove(this.children_, child);

  // Add the child to this component.  goog.object.add() throws an error if
  // a child with the same ID already exists.
  } else {
    goog.object.add(this.childIndex_, child.getId(), child);
  }

  // Set the parent of the child to this component.  This throws an error if
  // the child is already contained by another component.
  child.setParent(this);
  goog.array.insertAt(this.children_, child, index);

  if (child.inDocument_ && this.inDocument_ && child.getParent() == this) {
    // Changing the position of an existing child, move the DOM node.
    var contentElement = this.getContentElement();
    contentElement.insertBefore(child.getElement(),
        (contentElement.childNodes[index] || null));

  } else if (opt_render) {
    // If this (parent) component doesn't have a DOM yet, call createDom now
    // to make sure we render the child component's element into the correct
    // parent element (otherwise render_ with a null first argument would
    // render the child into the document body, which is almost certainly not
    // what we want).
    if (!this.element_) {
      this.createDom();
    }
    // Render the child into the parent at the appropriate location.  Note that
    // getChildAt(index + 1) returns undefined if inserting at the end.
    // TODO(attila): We should have a renderer with a renderChildAt API.
    var sibling = this.getChildAt(index + 1);
    // render_() calls enterDocument() if the parent is already in the document.
    child.render_(this.getContentElement(), sibling ? sibling.element_ : null);
  } else if (this.inDocument_ && !child.inDocument_ && child.element_ &&
      child.element_.parentNode &&
      // Under some circumstances, IE8 implicitly creates a Document Fragment
      // for detached nodes, so ensure the parent is an Element as it should be.
      child.element_.parentNode.nodeType == goog.dom.NodeType.ELEMENT) {
    // We don't touch the DOM, but if the parent is in the document, and the
    // child element is in the document but not marked as such, then we call
    // enterDocument on the child.
    // TODO(gboyer): It would be nice to move this condition entirely, but
    // there's a large risk of breaking existing applications that manually
    // append the child to the DOM and then call addChild.
    child.enterDocument();
  }
***REMOVED***


***REMOVED***
***REMOVED*** Returns the DOM element into which child components are to be rendered,
***REMOVED*** or null if the component itself hasn't been rendered yet.  This default
***REMOVED*** implementation returns the component's root element.  Subclasses with
***REMOVED*** complex DOM structures must override this method.
***REMOVED*** @return {Element} Element to contain child elements (null if none).
***REMOVED***
goog.ui.Component.prototype.getContentElement = function() {
  return this.element_;
***REMOVED***


***REMOVED***
***REMOVED*** Returns true if the component is rendered right-to-left, false otherwise.
***REMOVED*** The first time this function is invoked, the right-to-left rendering property
***REMOVED*** is set if it has not been already.
***REMOVED*** @return {boolean} Whether the control is rendered right-to-left.
***REMOVED***
goog.ui.Component.prototype.isRightToLeft = function() {
  if (this.rightToLeft_ == null) {
    this.rightToLeft_ = goog.style.isRightToLeft(this.inDocument_ ?
        this.element_ : this.dom_.getDocument().body);
  }
  return***REMOVED*****REMOVED*** @type {boolean}***REMOVED***(this.rightToLeft_);
***REMOVED***


***REMOVED***
***REMOVED*** Set is right-to-left. This function should be used if the component needs
***REMOVED*** to know the rendering direction during dom creation (i.e. before
***REMOVED*** {@link #enterDocument} is called and is right-to-left is set).
***REMOVED*** @param {boolean} rightToLeft Whether the component is rendered
***REMOVED***     right-to-left.
***REMOVED***
goog.ui.Component.prototype.setRightToLeft = function(rightToLeft) {
  if (this.inDocument_) {
    throw Error(goog.ui.Component.Error.ALREADY_RENDERED);
  }
  this.rightToLeft_ = rightToLeft;
***REMOVED***


***REMOVED***
***REMOVED*** Returns true if the component has children.
***REMOVED*** @return {boolean} True if the component has children.
***REMOVED***
goog.ui.Component.prototype.hasChildren = function() {
  return !!this.children_ && this.children_.length != 0;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the number of children of this component.
***REMOVED*** @return {number} The number of children.
***REMOVED***
goog.ui.Component.prototype.getChildCount = function() {
  return this.children_ ? this.children_.length : 0;
***REMOVED***


***REMOVED***
***REMOVED*** Returns an array containing the IDs of the children of this component, or an
***REMOVED*** empty array if the component has no children.
***REMOVED*** @return {Array.<string>} Child component IDs.
***REMOVED***
goog.ui.Component.prototype.getChildIds = function() {
  var ids = [];

  // We don't use goog.object.getKeys(this.childIndex_) because we want to
  // return the IDs in the correct order as determined by this.children_.
  this.forEachChild(function(child) {
    // addChild()/addChildAt() guarantee that the child array isn't sparse.
    ids.push(child.getId());
  });

  return ids;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the child with the given ID, or null if no such child exists.
***REMOVED*** @param {string} id Child component ID.
***REMOVED*** @return {goog.ui.Component?} The child with the given ID; null if none.
***REMOVED***
goog.ui.Component.prototype.getChild = function(id) {
  // Use childIndex_ for O(1) access by ID.
  return (this.childIndex_ && id) ?***REMOVED*****REMOVED*** @type {goog.ui.Component}***REMOVED*** (
      goog.object.get(this.childIndex_, id)) || null : null;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the child at the given index, or null if the index is out of bounds.
***REMOVED*** @param {number} index 0-based index.
***REMOVED*** @return {goog.ui.Component?} The child at the given index; null if none.
***REMOVED***
goog.ui.Component.prototype.getChildAt = function(index) {
  // Use children_ for access by index.
  return this.children_ ? this.children_[index] || null : null;
***REMOVED***


***REMOVED***
***REMOVED*** Calls the given function on each of this component's children in order.  If
***REMOVED*** {@code opt_obj} is provided, it will be used as the 'this' object in the
***REMOVED*** function when called.  The function should take two arguments:  the child
***REMOVED*** component and its 0-based index.  The return value is ignored.
***REMOVED*** @param {function(this:T,?,number):?} f The function to call for every
***REMOVED*** child component; should take 2 arguments (the child and its index).
***REMOVED*** @param {T=} opt_obj Used as the 'this' object in f when called.
***REMOVED*** @template T
***REMOVED***
goog.ui.Component.prototype.forEachChild = function(f, opt_obj) {
  if (this.children_) {
    goog.array.forEach(this.children_, f, opt_obj);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Returns the 0-based index of the given child component, or -1 if no such
***REMOVED*** child is found.
***REMOVED*** @param {goog.ui.Component?} child The child component.
***REMOVED*** @return {number} 0-based index of the child component; -1 if not found.
***REMOVED***
goog.ui.Component.prototype.indexOfChild = function(child) {
  return (this.children_ && child) ? goog.array.indexOf(this.children_, child) :
      -1;
***REMOVED***


***REMOVED***
***REMOVED*** Removes the given child from this component, and returns it.  Throws an error
***REMOVED*** if the argument is invalid or if the specified child isn't found in the
***REMOVED*** parent component.  The argument can either be a string (interpreted as the
***REMOVED*** ID of the child component to remove) or the child component itself.
***REMOVED***
***REMOVED*** If {@code opt_unrender} is true, calls {@link goog.ui.component#exitDocument}
***REMOVED*** on the removed child, and subsequently detaches the child's DOM from the
***REMOVED*** document.  Otherwise it is the caller's responsibility to clean up the child
***REMOVED*** component's DOM.
***REMOVED***
***REMOVED*** @see goog.ui.Component#removeChildAt
***REMOVED*** @param {string|goog.ui.Component|null} child The ID of the child to remove,
***REMOVED***    or the child component itself.
***REMOVED*** @param {boolean=} opt_unrender If true, calls {@code exitDocument} on the
***REMOVED***    removed child component, and detaches its DOM from the document.
***REMOVED*** @return {goog.ui.Component} The removed component, if any.
***REMOVED***
goog.ui.Component.prototype.removeChild = function(child, opt_unrender) {
  if (child) {
    // Normalize child to be the object and id to be the ID string.  This also
    // ensures that the child is really ours.
    var id = goog.isString(child) ? child : child.getId();
    child = this.getChild(id);

    if (id && child) {
      goog.object.remove(this.childIndex_, id);
      goog.array.remove(this.children_, child);

      if (opt_unrender) {
        // Remove the child component's DOM from the document.  We have to call
        // exitDocument first (see documentation).
        child.exitDocument();
        if (child.element_) {
          goog.dom.removeNode(child.element_);
        }
      }

      // Child's parent must be set to null after exitDocument is called
      // so that the child can unlisten to its parent if required.
      child.setParent(null);
    }
  }

  if (!child) {
    throw Error(goog.ui.Component.Error.NOT_OUR_CHILD);
  }

  return***REMOVED*****REMOVED*** @type {goog.ui.Component}***REMOVED***(child);
***REMOVED***


***REMOVED***
***REMOVED*** Removes the child at the given index from this component, and returns it.
***REMOVED*** Throws an error if the argument is out of bounds, or if the specified child
***REMOVED*** isn't found in the parent.  See {@link goog.ui.Component#removeChild} for
***REMOVED*** detailed semantics.
***REMOVED***
***REMOVED*** @see goog.ui.Component#removeChild
***REMOVED*** @param {number} index 0-based index of the child to remove.
***REMOVED*** @param {boolean=} opt_unrender If true, calls {@code exitDocument} on the
***REMOVED***    removed child component, and detaches its DOM from the document.
***REMOVED*** @return {goog.ui.Component} The removed component, if any.
***REMOVED***
goog.ui.Component.prototype.removeChildAt = function(index, opt_unrender) {
  // removeChild(null) will throw error.
  return this.removeChild(this.getChildAt(index), opt_unrender);
***REMOVED***


***REMOVED***
***REMOVED*** Removes every child component attached to this one and returns them.
***REMOVED***
***REMOVED*** @see goog.ui.Component#removeChild
***REMOVED*** @param {boolean=} opt_unrender If true, calls {@link #exitDocument} on the
***REMOVED***    removed child components, and detaches their DOM from the document.
***REMOVED*** @return {!Array.<goog.ui.Component>} The removed components if any.
***REMOVED***
goog.ui.Component.prototype.removeChildren = function(opt_unrender) {
  var removedChildren = [];
  while (this.hasChildren()) {
    removedChildren.push(this.removeChildAt(0, opt_unrender));
  }
  return removedChildren;
***REMOVED***
