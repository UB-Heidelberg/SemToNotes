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
***REMOVED*** @fileoverview Base class for control renderers.
***REMOVED*** TODO(attila):  If the renderer framework works well, pull it into Component.
***REMOVED***
***REMOVED*** @author attila@google.com (Attila Bodis)
***REMOVED***

goog.provide('goog.ui.ControlRenderer');

goog.require('goog.a11y.aria');
goog.require('goog.a11y.aria.State');
goog.require('goog.array');
goog.require('goog.asserts');
goog.require('goog.dom');
goog.require('goog.dom.classes');
goog.require('goog.object');
goog.require('goog.style');
goog.require('goog.ui.Component');
goog.require('goog.userAgent');



***REMOVED***
***REMOVED*** Default renderer for {@link goog.ui.Control}s.  Can be used as-is, but
***REMOVED*** subclasses of Control will probably want to use renderers specifically
***REMOVED*** tailored for them by extending this class.  Controls that use renderers
***REMOVED*** delegate one or more of the following API methods to the renderer:
***REMOVED*** <ul>
***REMOVED***    <li>{@code createDom} - renders the DOM for the component
***REMOVED***    <li>{@code canDecorate} - determines whether an element can be decorated
***REMOVED***        by the component
***REMOVED***    <li>{@code decorate} - decorates an existing element with the component
***REMOVED***    <li>{@code setState} - updates the appearance of the component based on
***REMOVED***        its state
***REMOVED***    <li>{@code getContent} - returns the component's content
***REMOVED***    <li>{@code setContent} - sets the component's content
***REMOVED*** </ul>
***REMOVED*** Controls are stateful; renderers, on the other hand, should be stateless and
***REMOVED*** reusable.
***REMOVED***
***REMOVED***
goog.ui.ControlRenderer = function() {
***REMOVED***
goog.addSingletonGetter(goog.ui.ControlRenderer);


***REMOVED***
***REMOVED*** Constructs a new renderer and sets the CSS class that the renderer will use
***REMOVED*** as the base CSS class to apply to all elements rendered by that renderer.
***REMOVED*** An example to use this function using a color palette:
***REMOVED***
***REMOVED*** <pre>
***REMOVED*** var myCustomRenderer = goog.ui.ControlRenderer.getCustomRenderer(
***REMOVED***     goog.ui.PaletteRenderer, 'my-special-palette');
***REMOVED*** var newColorPalette = new goog.ui.ColorPalette(
***REMOVED***     colors, myCustomRenderer, opt_domHelper);
***REMOVED*** </pre>
***REMOVED***
***REMOVED*** Your CSS can look like this now:
***REMOVED*** <pre>
***REMOVED*** .my-special-palette { }
***REMOVED*** .my-special-palette-table { }
***REMOVED*** .my-special-palette-cell { }
***REMOVED*** etc.
***REMOVED*** </pre>
***REMOVED***
***REMOVED*** <em>instead</em> of
***REMOVED*** <pre>
***REMOVED*** .CSS_MY_SPECIAL_PALETTE .goog-palette { }
***REMOVED*** .CSS_MY_SPECIAL_PALETTE .goog-palette-table { }
***REMOVED*** .CSS_MY_SPECIAL_PALETTE .goog-palette-cell { }
***REMOVED*** etc.
***REMOVED*** </pre>
***REMOVED***
***REMOVED*** You would want to use this functionality when you want an instance of a
***REMOVED*** component to have specific styles different than the other components of the
***REMOVED*** same type in your application.  This avoids using descendant selectors to
***REMOVED*** apply the specific styles to this component.
***REMOVED***
***REMOVED*** @param {Function} ctor The constructor of the renderer you are trying to
***REMOVED***     create.
***REMOVED*** @param {string} cssClassName The name of the CSS class for this renderer.
***REMOVED*** @return {goog.ui.ControlRenderer} An instance of the desired renderer with
***REMOVED***     its getCssClass() method overridden to return the supplied custom CSS
***REMOVED***     class name.
***REMOVED***
goog.ui.ControlRenderer.getCustomRenderer = function(ctor, cssClassName) {
  var renderer = new ctor();

 ***REMOVED*****REMOVED***
  ***REMOVED*** Returns the CSS class to be applied to the root element of components
  ***REMOVED*** rendered using this renderer.
  ***REMOVED*** @return {string} Renderer-specific CSS class.
 ***REMOVED*****REMOVED***
  renderer.getCssClass = function() {
    return cssClassName;
 ***REMOVED*****REMOVED***

  return renderer;
***REMOVED***


***REMOVED***
***REMOVED*** Default CSS class to be applied to the root element of components rendered
***REMOVED*** by this renderer.
***REMOVED*** @type {string}
***REMOVED***
goog.ui.ControlRenderer.CSS_CLASS = goog.getCssName('goog-control');


***REMOVED***
***REMOVED*** Array of arrays of CSS classes that we want composite classes added and
***REMOVED*** removed for in IE6 and lower as a workaround for lack of multi-class CSS
***REMOVED*** selector support.
***REMOVED***
***REMOVED*** Subclasses that have accompanying CSS requiring this workaround should define
***REMOVED*** their own static IE6_CLASS_COMBINATIONS constant and override
***REMOVED*** getIe6ClassCombinations to return it.
***REMOVED***
***REMOVED*** For example, if your stylesheet uses the selector .button.collapse-left
***REMOVED*** (and is compiled to .button_collapse-left for the IE6 version of the
***REMOVED*** stylesheet,) you should include ['button', 'collapse-left'] in this array
***REMOVED*** and the class button_collapse-left will be applied to the root element
***REMOVED*** whenever both button and collapse-left are applied individually.
***REMOVED***
***REMOVED*** Members of each class name combination will be joined with underscores in the
***REMOVED*** order that they're defined in the array. You should alphabetize them (for
***REMOVED*** compatibility with the CSS compiler) unless you are doing something special.
***REMOVED*** @type {Array.<Array.<string>>}
***REMOVED***
goog.ui.ControlRenderer.IE6_CLASS_COMBINATIONS = [];


***REMOVED***
***REMOVED*** Map of component states to corresponding ARIA states.  Since the mapping of
***REMOVED*** component states to ARIA states is neither component- nor renderer-specific,
***REMOVED*** this is a static property of the renderer class, and is initialized on first
***REMOVED*** use.
***REMOVED*** @type {Object}
***REMOVED*** @private
***REMOVED***
goog.ui.ControlRenderer.ARIA_STATE_MAP_;


***REMOVED***
***REMOVED*** Returns the ARIA role to be applied to the control.
***REMOVED*** See http://wiki/Main/ARIA for more info.
***REMOVED*** @return {goog.a11y.aria.Role|undefined} ARIA role.
***REMOVED***
goog.ui.ControlRenderer.prototype.getAriaRole = function() {
  // By default, the ARIA role is unspecified.
  return undefined;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the control's contents wrapped in a DIV, with the renderer's own
***REMOVED*** CSS class and additional state-specific classes applied to it.
***REMOVED*** @param {goog.ui.Control} control Control to render.
***REMOVED*** @return {Element} Root element for the control.
***REMOVED***
goog.ui.ControlRenderer.prototype.createDom = function(control) {
  // Create and return DIV wrapping contents.
  var element = control.getDomHelper().createDom(
      'div', this.getClassNames(control).join(' '), control.getContent());

  this.setAriaStates(control, element);
  return element;
***REMOVED***


***REMOVED***
***REMOVED*** Takes the control's root element and returns the parent element of the
***REMOVED*** control's contents.  Since by default controls are rendered as a single
***REMOVED*** DIV, the default implementation returns the element itself.  Subclasses
***REMOVED*** with more complex DOM structures must override this method as needed.
***REMOVED*** @param {Element} element Root element of the control whose content element
***REMOVED***     is to be returned.
***REMOVED*** @return {Element} The control's content element.
***REMOVED***
goog.ui.ControlRenderer.prototype.getContentElement = function(element) {
  return element;
***REMOVED***


***REMOVED***
***REMOVED*** Updates the control's DOM by adding or removing the specified class name
***REMOVED*** to/from its root element. May add additional combined classes as needed in
***REMOVED*** IE6 and lower. Because of this, subclasses should use this method when
***REMOVED*** modifying class names on the control's root element.
***REMOVED*** @param {goog.ui.Control|Element} control Control instance (or root element)
***REMOVED***     to be updated.
***REMOVED*** @param {string} className CSS class name to add or remove.
***REMOVED*** @param {boolean} enable Whether to add or remove the class name.
***REMOVED***
goog.ui.ControlRenderer.prototype.enableClassName = function(control,
    className, enable) {
  var element =***REMOVED*****REMOVED*** @type {Element}***REMOVED*** (
      control.getElement ? control.getElement() : control);
  if (element) {
    // For IE6, we need to enable any combined classes involving this class
    // as well.
    if (goog.userAgent.IE && !goog.userAgent.isVersion('7')) {
      var combinedClasses = this.getAppliedCombinedClassNames_(
          goog.dom.classes.get(element), className);
      combinedClasses.push(className);
      var f = enable ? goog.dom.classes.add : goog.dom.classes.remove;
      goog.partial(f, element).apply(null, combinedClasses);
    } else {
      goog.dom.classes.enable(element, className, enable);
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** Updates the control's DOM by adding or removing the specified extra class
***REMOVED*** name to/from its element.
***REMOVED*** @param {goog.ui.Control} control Control to be updated.
***REMOVED*** @param {string} className CSS class name to add or remove.
***REMOVED*** @param {boolean} enable Whether to add or remove the class name.
***REMOVED***
goog.ui.ControlRenderer.prototype.enableExtraClassName = function(control,
    className, enable) {
  // The base class implementation is trivial; subclasses should override as
  // needed.
  this.enableClassName(control, className, enable);
***REMOVED***


***REMOVED***
***REMOVED*** Returns true if this renderer can decorate the element, false otherwise.
***REMOVED*** The default implementation always returns true.
***REMOVED*** @param {Element} element Element to decorate.
***REMOVED*** @return {boolean} Whether the renderer can decorate the element.
***REMOVED***
goog.ui.ControlRenderer.prototype.canDecorate = function(element) {
  return true;
***REMOVED***


***REMOVED***
***REMOVED*** Default implementation of {@code decorate} for {@link goog.ui.Control}s.
***REMOVED*** Initializes the control's ID, content, and state based on the ID of the
***REMOVED*** element, its child nodes, and its CSS classes, respectively.  Returns the
***REMOVED*** element.
***REMOVED*** @param {goog.ui.Control} control Control instance to decorate the element.
***REMOVED*** @param {Element} element Element to decorate.
***REMOVED*** @return {Element} Decorated element.
***REMOVED*** @suppress {visibility} setContentInternal and setStateInternal
***REMOVED***
goog.ui.ControlRenderer.prototype.decorate = function(control, element) {
  // Set the control's ID to the decorated element's DOM ID, if any.
  if (element.id) {
    control.setId(element.id);
  }

  // Set the control's content to the decorated element's content.
  var contentElem = this.getContentElement(element);
  if (contentElem && contentElem.firstChild) {
    control.setContentInternal(contentElem.firstChild.nextSibling ?
        goog.array.clone(contentElem.childNodes) : contentElem.firstChild);
  } else {
    control.setContentInternal(null);
  }

  // Initialize the control's state based on the decorated element's CSS class.
  // This implementation is optimized to minimize object allocations, string
  // comparisons, and DOM access.
  var state = 0x00;
  var rendererClassName = this.getCssClass();
  var structuralClassName = this.getStructuralCssClass();
  var hasRendererClassName = false;
  var hasStructuralClassName = false;
  var hasCombinedClassName = false;
  var classNames = goog.dom.classes.get(element);
  goog.array.forEach(classNames, function(className) {
    if (!hasRendererClassName && className == rendererClassName) {
      hasRendererClassName = true;
      if (structuralClassName == rendererClassName) {
        hasStructuralClassName = true;
      }
    } else if (!hasStructuralClassName && className == structuralClassName) {
      hasStructuralClassName = true;
    } else {
      state |= this.getStateFromClass(className);
    }
  }, this);
  control.setStateInternal(state);

  // Make sure the element has the renderer's CSS classes applied, as well as
  // any extra class names set on the control.
  if (!hasRendererClassName) {
    classNames.push(rendererClassName);
    if (structuralClassName == rendererClassName) {
      hasStructuralClassName = true;
    }
  }
  if (!hasStructuralClassName) {
    classNames.push(structuralClassName);
  }
  var extraClassNames = control.getExtraClassNames();
  if (extraClassNames) {
    classNames.push.apply(classNames, extraClassNames);
  }

  // For IE6, rewrite all classes on the decorated element if any combined
  // classes apply.
  if (goog.userAgent.IE && !goog.userAgent.isVersion('7')) {
    var combinedClasses = this.getAppliedCombinedClassNames_(
        classNames);
    if (combinedClasses.length > 0) {
      classNames.push.apply(classNames, combinedClasses);
      hasCombinedClassName = true;
    }
  }

  // Only write to the DOM if new class names had to be added to the element.
  if (!hasRendererClassName || !hasStructuralClassName ||
      extraClassNames || hasCombinedClassName) {
    goog.dom.classes.set(element, classNames.join(' '));
  }

  this.setAriaStates(control, element);
  return element;
***REMOVED***


***REMOVED***
***REMOVED*** Initializes the control's DOM by configuring properties that can only be set
***REMOVED*** after the DOM has entered the document.  This implementation sets up BiDi
***REMOVED*** and keyboard focus.  Called from {@link goog.ui.Control#enterDocument}.
***REMOVED*** @param {goog.ui.Control} control Control whose DOM is to be initialized
***REMOVED***     as it enters the document.
***REMOVED***
goog.ui.ControlRenderer.prototype.initializeDom = function(control) {
  // Initialize render direction (BiDi).  We optimize the left-to-right render
  // direction by assuming that elements are left-to-right by default, and only
  // updating their styling if they are explicitly set to right-to-left.
  if (control.isRightToLeft()) {
    this.setRightToLeft(control.getElement(), true);
  }

  // Initialize keyboard focusability (tab index).  We assume that components
  // aren't focusable by default (i.e have no tab index), and only touch the
  // DOM if the component is focusable, enabled, and visible, and therefore
  // needs a tab index.
  if (control.isEnabled()) {
    this.setFocusable(control, control.isVisible());
  }
***REMOVED***


***REMOVED***
***REMOVED*** Sets the element's ARIA role.
***REMOVED*** @param {Element} element Element to update.
***REMOVED*** @param {?goog.a11y.aria.Role=} opt_preferredRole The preferred ARIA role.
***REMOVED***
goog.ui.ControlRenderer.prototype.setAriaRole = function(element,
    opt_preferredRole) {
  var ariaRole = opt_preferredRole || this.getAriaRole();
  if (ariaRole) {
    goog.asserts.assert(element,
        'The element passed as a first parameter cannot be null.');
    goog.a11y.aria.setRole(element, ariaRole);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Sets the element's ARIA states. An element does not need an ARIA role in
***REMOVED*** order to have an ARIA state. Only states which are initialized to be true
***REMOVED*** will be set.
***REMOVED*** @param {!goog.ui.Control} control Control whose ARIA state will be updated.
***REMOVED*** @param {!Element} element Element whose ARIA state is to be updated.
***REMOVED***
goog.ui.ControlRenderer.prototype.setAriaStates = function(control, element) {
  goog.asserts.assert(control);
  goog.asserts.assert(element);

  if (!control.isVisible()) {
    goog.a11y.aria.setState(
        element, goog.a11y.aria.State.HIDDEN, !control.isVisible());
  }
  if (!control.isEnabled()) {
    this.updateAriaState(
        element, goog.ui.Component.State.DISABLED, !control.isEnabled());
  }
  if (control.isSupportedState(goog.ui.Component.State.SELECTED)) {
    this.updateAriaState(
        element, goog.ui.Component.State.SELECTED, control.isSelected());
  }
  if (control.isSupportedState(goog.ui.Component.State.CHECKED)) {
    this.updateAriaState(
        element, goog.ui.Component.State.CHECKED, control.isChecked());
  }
  if (control.isSupportedState(goog.ui.Component.State.OPENED)) {
    this.updateAriaState(
        element, goog.ui.Component.State.OPENED, control.isOpen());
  }
***REMOVED***


***REMOVED***
***REMOVED*** Allows or disallows text selection within the control's DOM.
***REMOVED*** @param {Element} element The control's root element.
***REMOVED*** @param {boolean} allow Whether the element should allow text selection.
***REMOVED***
goog.ui.ControlRenderer.prototype.setAllowTextSelection = function(element,
    allow) {
  // On all browsers other than IE and Opera, it isn't necessary to recursively
  // apply unselectable styling to the element's children.
  goog.style.setUnselectable(element, !allow,
      !goog.userAgent.IE && !goog.userAgent.OPERA);
***REMOVED***


***REMOVED***
***REMOVED*** Applies special styling to/from the control's element if it is rendered
***REMOVED*** right-to-left, and removes it if it is rendered left-to-right.
***REMOVED*** @param {Element} element The control's root element.
***REMOVED*** @param {boolean} rightToLeft Whether the component is rendered
***REMOVED***     right-to-left.
***REMOVED***
goog.ui.ControlRenderer.prototype.setRightToLeft = function(element,
    rightToLeft) {
  this.enableClassName(element,
      goog.getCssName(this.getStructuralCssClass(), 'rtl'), rightToLeft);
***REMOVED***


***REMOVED***
***REMOVED*** Returns true if the control's key event target supports keyboard focus
***REMOVED*** (based on its {@code tabIndex} attribute), false otherwise.
***REMOVED*** @param {goog.ui.Control} control Control whose key event target is to be
***REMOVED***     checked.
***REMOVED*** @return {boolean} Whether the control's key event target is focusable.
***REMOVED***
goog.ui.ControlRenderer.prototype.isFocusable = function(control) {
  var keyTarget;
  if (control.isSupportedState(goog.ui.Component.State.FOCUSED) &&
      (keyTarget = control.getKeyEventTarget())) {
    return goog.dom.isFocusableTabIndex(keyTarget);
  }
  return false;
***REMOVED***


***REMOVED***
***REMOVED*** Updates the control's key event target to make it focusable or non-focusable
***REMOVED*** via its {@code tabIndex} attribute.  Does nothing if the control doesn't
***REMOVED*** support the {@code FOCUSED} state, or if it has no key event target.
***REMOVED*** @param {goog.ui.Control} control Control whose key event target is to be
***REMOVED***     updated.
***REMOVED*** @param {boolean} focusable Whether to enable keyboard focus support on the
***REMOVED***     control's key event target.
***REMOVED***
goog.ui.ControlRenderer.prototype.setFocusable = function(control, focusable) {
  var keyTarget;
  if (control.isSupportedState(goog.ui.Component.State.FOCUSED) &&
      (keyTarget = control.getKeyEventTarget())) {
    if (!focusable && control.isFocused()) {
      // Blur before hiding.  Note that IE calls onblur handlers asynchronously.
      try {
        keyTarget.blur();
      } catch (e) {
        // TODO(user|user):  Find out why this fails on IE.
      }
      // The blur event dispatched by the key event target element when blur()
      // was called on it should have been handled by the control's handleBlur()
      // method, so at this point the control should no longer be focused.
      // However, blur events are unreliable on IE and FF3, so if at this point
      // the control is still focused, we trigger its handleBlur() method
      // programmatically.
      if (control.isFocused()) {
        control.handleBlur(null);
      }
    }
    // Don't overwrite existing tab index values unless needed.
    if (goog.dom.isFocusableTabIndex(keyTarget) != focusable) {
      goog.dom.setFocusableTabIndex(keyTarget, focusable);
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** Shows or hides the element.
***REMOVED*** @param {Element} element Element to update.
***REMOVED*** @param {boolean} visible Whether to show the element.
***REMOVED***
goog.ui.ControlRenderer.prototype.setVisible = function(element, visible) {
  // The base class implementation is trivial; subclasses should override as
  // needed.  It should be possible to do animated reveals, for example.
  goog.style.showElement(element, visible);
  if (element) {
    goog.a11y.aria.setState(element, goog.a11y.aria.State.HIDDEN, !visible);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Updates the appearance of the control in response to a state change.
***REMOVED*** @param {goog.ui.Control} control Control instance to update.
***REMOVED*** @param {goog.ui.Component.State} state State to enable or disable.
***REMOVED*** @param {boolean} enable Whether the control is entering or exiting the state.
***REMOVED***
goog.ui.ControlRenderer.prototype.setState = function(control, state, enable) {
  var element = control.getElement();
  if (element) {
    var className = this.getClassForState(state);
    if (className) {
      this.enableClassName(control, className, enable);
    }
    this.updateAriaState(element, state, enable);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Updates the element's ARIA (accessibility) state.
***REMOVED*** @param {Element} element Element whose ARIA state is to be updated.
***REMOVED*** @param {goog.ui.Component.State} state Component state being enabled or
***REMOVED***     disabled.
***REMOVED*** @param {boolean} enable Whether the state is being enabled or disabled.
***REMOVED*** @protected
***REMOVED***
goog.ui.ControlRenderer.prototype.updateAriaState = function(element, state,
    enable) {
  // Ensure the ARIA state map exists.
  if (!goog.ui.ControlRenderer.ARIA_STATE_MAP_) {
    goog.ui.ControlRenderer.ARIA_STATE_MAP_ = goog.object.create(
        goog.ui.Component.State.DISABLED, goog.a11y.aria.State.DISABLED,
        goog.ui.Component.State.SELECTED, goog.a11y.aria.State.SELECTED,
        goog.ui.Component.State.CHECKED, goog.a11y.aria.State.CHECKED,
        goog.ui.Component.State.OPENED, goog.a11y.aria.State.EXPANDED);
  }
  var ariaState = goog.ui.ControlRenderer.ARIA_STATE_MAP_[state];
  if (ariaState) {
    goog.asserts.assert(element,
        'The element passed as a first parameter cannot be null.');
    goog.a11y.aria.setState(element, ariaState, enable);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Takes a control's root element, and sets its content to the given text
***REMOVED*** caption or DOM structure.  The default implementation replaces the children
***REMOVED*** of the given element.  Renderers that create more complex DOM structures
***REMOVED*** must override this method accordingly.
***REMOVED*** @param {Element} element The control's root element.
***REMOVED*** @param {goog.ui.ControlContent} content Text caption or DOM structure to be
***REMOVED***     set as the control's content. The DOM nodes will not be cloned, they
***REMOVED***     will only moved under the content element of the control.
***REMOVED***
goog.ui.ControlRenderer.prototype.setContent = function(element, content) {
  var contentElem = this.getContentElement(element);
  if (contentElem) {
    goog.dom.removeChildren(contentElem);
    if (content) {
      if (goog.isString(content)) {
        goog.dom.setTextContent(contentElem, content);
      } else {
        var childHandler = function(child) {
          if (child) {
            var doc = goog.dom.getOwnerDocument(contentElem);
            contentElem.appendChild(goog.isString(child) ?
                doc.createTextNode(child) : child);
          }
       ***REMOVED*****REMOVED***
        if (goog.isArray(content)) {
          // Array of nodes.
          goog.array.forEach(content, childHandler);
        } else if (goog.isArrayLike(content) && !('nodeType' in content)) {
          // NodeList. The second condition filters out TextNode which also has
          // length attribute but is not array like. The nodes have to be cloned
          // because childHandler removes them from the list during iteration.
          goog.array.forEach(goog.array.clone(***REMOVED*** @type {NodeList}***REMOVED***(content)),
              childHandler);
        } else {
          // Node or string.
          childHandler(content);
        }
      }
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** Returns the element within the component's DOM that should receive keyboard
***REMOVED*** focus (null if none).  The default implementation returns the control's root
***REMOVED*** element.
***REMOVED*** @param {goog.ui.Control} control Control whose key event target is to be
***REMOVED***     returned.
***REMOVED*** @return {Element} The key event target.
***REMOVED***
goog.ui.ControlRenderer.prototype.getKeyEventTarget = function(control) {
  return control.getElement();
***REMOVED***


// CSS class name management.


***REMOVED***
***REMOVED*** Returns the CSS class name to be applied to the root element of all
***REMOVED*** components rendered or decorated using this renderer.  The class name
***REMOVED*** is expected to uniquely identify the renderer class, i.e. no two
***REMOVED*** renderer classes are expected to share the same CSS class name.
***REMOVED*** @return {string} Renderer-specific CSS class name.
***REMOVED***
goog.ui.ControlRenderer.prototype.getCssClass = function() {
  return goog.ui.ControlRenderer.CSS_CLASS;
***REMOVED***


***REMOVED***
***REMOVED*** Returns an array of combinations of classes to apply combined class names for
***REMOVED*** in IE6 and below. See {@link IE6_CLASS_COMBINATIONS} for more detail. This
***REMOVED*** method doesn't reference {@link IE6_CLASS_COMBINATIONS} so that it can be
***REMOVED*** compiled out, but subclasses should return their IE6_CLASS_COMBINATIONS
***REMOVED*** static constant instead.
***REMOVED*** @return {Array.<Array.<string>>} Array of class name combinations.
***REMOVED***
goog.ui.ControlRenderer.prototype.getIe6ClassCombinations = function() {
  return [];
***REMOVED***


***REMOVED***
***REMOVED*** Returns the name of a DOM structure-specific CSS class to be applied to the
***REMOVED*** root element of all components rendered or decorated using this renderer.
***REMOVED*** Unlike the class name returned by {@link #getCssClass}, the structural class
***REMOVED*** name may be shared among different renderers that generate similar DOM
***REMOVED*** structures.  The structural class name also serves as the basis of derived
***REMOVED*** class names used to identify and style structural elements of the control's
***REMOVED*** DOM, as well as the basis for state-specific class names.  The default
***REMOVED*** implementation returns the same class name as {@link #getCssClass}, but
***REMOVED*** subclasses are expected to override this method as needed.
***REMOVED*** @return {string} DOM structure-specific CSS class name (same as the renderer-
***REMOVED***     specific CSS class name by default).
***REMOVED***
goog.ui.ControlRenderer.prototype.getStructuralCssClass = function() {
  return this.getCssClass();
***REMOVED***


***REMOVED***
***REMOVED*** Returns all CSS class names applicable to the given control, based on its
***REMOVED*** state.  The return value is an array of strings containing
***REMOVED*** <ol>
***REMOVED***   <li>the renderer-specific CSS class returned by {@link #getCssClass},
***REMOVED***       followed by
***REMOVED***   <li>the structural CSS class returned by {@link getStructuralCssClass} (if
***REMOVED***       different from the renderer-specific CSS class), followed by
***REMOVED***   <li>any state-specific classes returned by {@link #getClassNamesForState},
***REMOVED***       followed by
***REMOVED***   <li>any extra classes returned by the control's {@code getExtraClassNames}
***REMOVED***       method and
***REMOVED***   <li>for IE6 and lower, additional combined classes from
***REMOVED***       {@link getAppliedCombinedClassNames_}.
***REMOVED*** </ol>
***REMOVED*** Since all controls have at least one renderer-specific CSS class name, this
***REMOVED*** method is guaranteed to return an array of at least one element.
***REMOVED*** @param {goog.ui.Control} control Control whose CSS classes are to be
***REMOVED***     returned.
***REMOVED*** @return {Array.<string>} Array of CSS class names applicable to the control.
***REMOVED*** @protected
***REMOVED***
goog.ui.ControlRenderer.prototype.getClassNames = function(control) {
  var cssClass = this.getCssClass();

  // Start with the renderer-specific class name.
  var classNames = [cssClass];

  // Add structural class name, if different.
  var structuralCssClass = this.getStructuralCssClass();
  if (structuralCssClass != cssClass) {
    classNames.push(structuralCssClass);
  }

  // Add state-specific class names, if any.
  var classNamesForState = this.getClassNamesForState(control.getState());
  classNames.push.apply(classNames, classNamesForState);

  // Add extra class names, if any.
  var extraClassNames = control.getExtraClassNames();
  if (extraClassNames) {
    classNames.push.apply(classNames, extraClassNames);
  }

  // Add composite classes for IE6 support
  if (goog.userAgent.IE && !goog.userAgent.isVersion('7')) {
    classNames.push.apply(classNames,
        this.getAppliedCombinedClassNames_(classNames));
  }

  return classNames;
***REMOVED***


***REMOVED***
***REMOVED*** Returns an array of all the combined class names that should be applied based
***REMOVED*** on the given list of classes. Checks the result of
***REMOVED*** {@link getIe6ClassCombinations} for any combinations that have all
***REMOVED*** members contained in classes. If a combination matches, the members are
***REMOVED*** joined with an underscore (in order), and added to the return array.
***REMOVED***
***REMOVED*** If opt_includedClass is provided, return only the combined classes that have
***REMOVED*** all members contained in classes AND include opt_includedClass as well.
***REMOVED*** opt_includedClass is added to classes as well.
***REMOVED*** @param {Array.<string>} classes Array of classes to return matching combined
***REMOVED***     classes for.
***REMOVED*** @param {?string=} opt_includedClass If provided, get only the combined
***REMOVED***     classes that include this one.
***REMOVED*** @return {Array.<string>} Array of combined class names that should be
***REMOVED***     applied.
***REMOVED*** @private
***REMOVED***
goog.ui.ControlRenderer.prototype.getAppliedCombinedClassNames_ = function(
    classes, opt_includedClass) {
  var toAdd = [];
  if (opt_includedClass) {
    classes = classes.concat([opt_includedClass]);
  }
  goog.array.forEach(this.getIe6ClassCombinations(), function(combo) {
    if (goog.array.every(combo, goog.partial(goog.array.contains, classes)) &&
        (!opt_includedClass || goog.array.contains(combo, opt_includedClass))) {
      toAdd.push(combo.join('_'));
    }
  });
  return toAdd;
***REMOVED***


***REMOVED***
***REMOVED*** Takes a bit mask of {@link goog.ui.Component.State}s, and returns an array
***REMOVED*** of the appropriate class names representing the given state, suitable to be
***REMOVED*** applied to the root element of a component rendered using this renderer, or
***REMOVED*** null if no state-specific classes need to be applied.  This default
***REMOVED*** implementation uses the renderer's {@link getClassForState} method to
***REMOVED*** generate each state-specific class.
***REMOVED*** @param {number} state Bit mask of component states.
***REMOVED*** @return {!Array.<string>} Array of CSS class names representing the given
***REMOVED***     state.
***REMOVED*** @protected
***REMOVED***
goog.ui.ControlRenderer.prototype.getClassNamesForState = function(state) {
  var classNames = [];
  while (state) {
    // For each enabled state, push the corresponding CSS class name onto
    // the classNames array.
    var mask = state & -state;  // Least significant bit
    classNames.push(this.getClassForState(
       ***REMOVED*****REMOVED*** @type {goog.ui.Component.State}***REMOVED*** (mask)));
    state &= ~mask;
  }
  return classNames;
***REMOVED***


***REMOVED***
***REMOVED*** Takes a single {@link goog.ui.Component.State}, and returns the
***REMOVED*** corresponding CSS class name (null if none).
***REMOVED*** @param {goog.ui.Component.State} state Component state.
***REMOVED*** @return {string|undefined} CSS class representing the given state (undefined
***REMOVED***     if none).
***REMOVED*** @protected
***REMOVED***
goog.ui.ControlRenderer.prototype.getClassForState = function(state) {
  if (!this.classByState_) {
    this.createClassByStateMap_();
  }
  return this.classByState_[state];
***REMOVED***


***REMOVED***
***REMOVED*** Takes a single CSS class name which may represent a component state, and
***REMOVED*** returns the corresponding component state (0x00 if none).
***REMOVED*** @param {string} className CSS class name, possibly representing a component
***REMOVED***     state.
***REMOVED*** @return {goog.ui.Component.State} state Component state corresponding
***REMOVED***     to the given CSS class (0x00 if none).
***REMOVED*** @protected
***REMOVED***
goog.ui.ControlRenderer.prototype.getStateFromClass = function(className) {
  if (!this.stateByClass_) {
    this.createStateByClassMap_();
  }
  var state = parseInt(this.stateByClass_[className], 10);
  return***REMOVED*****REMOVED*** @type {goog.ui.Component.State}***REMOVED*** (isNaN(state) ? 0x00 : state);
***REMOVED***


***REMOVED***
***REMOVED*** Creates the lookup table of states to classes, used during state changes.
***REMOVED*** @private
***REMOVED***
goog.ui.ControlRenderer.prototype.createClassByStateMap_ = function() {
  var baseClass = this.getStructuralCssClass();

 ***REMOVED*****REMOVED***
  ***REMOVED*** Map of component states to state-specific structural class names,
  ***REMOVED*** used when changing the DOM in response to a state change.  Precomputed
  ***REMOVED*** and cached on first use to minimize object allocations and string
  ***REMOVED*** concatenation.
  ***REMOVED*** @type {Object}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.classByState_ = goog.object.create(
      goog.ui.Component.State.DISABLED, goog.getCssName(baseClass, 'disabled'),
      goog.ui.Component.State.HOVER, goog.getCssName(baseClass, 'hover'),
      goog.ui.Component.State.ACTIVE, goog.getCssName(baseClass, 'active'),
      goog.ui.Component.State.SELECTED, goog.getCssName(baseClass, 'selected'),
      goog.ui.Component.State.CHECKED, goog.getCssName(baseClass, 'checked'),
      goog.ui.Component.State.FOCUSED, goog.getCssName(baseClass, 'focused'),
      goog.ui.Component.State.OPENED, goog.getCssName(baseClass, 'open'));
***REMOVED***


***REMOVED***
***REMOVED*** Creates the lookup table of classes to states, used during decoration.
***REMOVED*** @private
***REMOVED***
goog.ui.ControlRenderer.prototype.createStateByClassMap_ = function() {
  // We need the classByState_ map so we can transpose it.
  if (!this.classByState_) {
    this.createClassByStateMap_();
  }

 ***REMOVED*****REMOVED***
  ***REMOVED*** Map of state-specific structural class names to component states,
  ***REMOVED*** used during element decoration.  Precomputed and cached on first use
  ***REMOVED*** to minimize object allocations and string concatenation.
  ***REMOVED*** @type {Object}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.stateByClass_ = goog.object.transpose(this.classByState_);
***REMOVED***
