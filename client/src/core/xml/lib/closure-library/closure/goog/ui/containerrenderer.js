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
***REMOVED*** @fileoverview Base class for container renderers.
***REMOVED***
***REMOVED*** @author attila@google.com (Attila Bodis)
***REMOVED***

goog.provide('goog.ui.ContainerRenderer');

goog.require('goog.a11y.aria');
goog.require('goog.asserts');
goog.require('goog.array');
goog.require('goog.dom');
goog.require('goog.dom.classes');
goog.require('goog.string');
goog.require('goog.style');
goog.require('goog.ui.Separator');
goog.require('goog.ui.registry');
goog.require('goog.userAgent');



***REMOVED***
***REMOVED*** Default renderer for {@link goog.ui.Container}.  Can be used as-is, but
***REMOVED*** subclasses of Container will probably want to use renderers specifically
***REMOVED*** tailored for them by extending this class.
***REMOVED***
***REMOVED***
goog.ui.ContainerRenderer = function() {
***REMOVED***
goog.addSingletonGetter(goog.ui.ContainerRenderer);


***REMOVED***
***REMOVED*** Constructs a new renderer and sets the CSS class that the renderer will use
***REMOVED*** as the base CSS class to apply to all elements rendered by that renderer.
***REMOVED*** An example to use this function using a menu is:
***REMOVED***
***REMOVED*** <pre>
***REMOVED*** var myCustomRenderer = goog.ui.ContainerRenderer.getCustomRenderer(
***REMOVED***     goog.ui.MenuRenderer, 'my-special-menu');
***REMOVED*** var newMenu = new goog.ui.Menu(opt_domHelper, myCustomRenderer);
***REMOVED*** </pre>
***REMOVED***
***REMOVED*** Your styles for the menu can now be:
***REMOVED*** <pre>
***REMOVED*** .my-special-menu { }
***REMOVED*** </pre>
***REMOVED***
***REMOVED*** <em>instead</em> of
***REMOVED*** <pre>
***REMOVED*** .CSS_MY_SPECIAL_MENU .goog-menu { }
***REMOVED*** </pre>
***REMOVED***
***REMOVED*** You would want to use this functionality when you want an instance of a
***REMOVED*** component to have specific styles different than the other components of the
***REMOVED*** same type in your application.  This avoids using descendant selectors to
***REMOVED*** apply the specific styles to this component.
***REMOVED***
***REMOVED*** @param {Function} ctor The constructor of the renderer you want to create.
***REMOVED*** @param {string} cssClassName The name of the CSS class for this renderer.
***REMOVED*** @return {goog.ui.ContainerRenderer} An instance of the desired renderer with
***REMOVED***     its getCssClass() method overridden to return the supplied custom CSS
***REMOVED***     class name.
***REMOVED***
goog.ui.ContainerRenderer.getCustomRenderer = function(ctor, cssClassName) {
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
***REMOVED*** Default CSS class to be applied to the root element of containers rendered
***REMOVED*** by this renderer.
***REMOVED*** @type {string}
***REMOVED***
goog.ui.ContainerRenderer.CSS_CLASS = goog.getCssName('goog-container');


***REMOVED***
***REMOVED*** Returns the ARIA role to be applied to the container.
***REMOVED*** See http://wiki/Main/ARIA for more info.
***REMOVED*** @return {undefined|string} ARIA role.
***REMOVED***
goog.ui.ContainerRenderer.prototype.getAriaRole = function() {
  // By default, the ARIA role is unspecified.
  return undefined;
***REMOVED***


***REMOVED***
***REMOVED*** Enables or disables the tab index of the element.  Only elements with a
***REMOVED*** valid tab index can receive focus.
***REMOVED*** @param {Element} element Element whose tab index is to be changed.
***REMOVED*** @param {boolean} enable Whether to add or remove the element's tab index.
***REMOVED***
goog.ui.ContainerRenderer.prototype.enableTabIndex = function(element, enable) {
  if (element) {
    element.tabIndex = enable ? 0 : -1;
  }
***REMOVED***


***REMOVED***
***REMOVED*** Creates and returns the container's root element.  The default
***REMOVED*** simply creates a DIV and applies the renderer's own CSS class name to it.
***REMOVED*** To be overridden in subclasses.
***REMOVED*** @param {goog.ui.Container} container Container to render.
***REMOVED*** @return {Element} Root element for the container.
***REMOVED***
goog.ui.ContainerRenderer.prototype.createDom = function(container) {
  return container.getDomHelper().createDom('div',
      this.getClassNames(container).join(' '));
***REMOVED***


***REMOVED***
***REMOVED*** Returns the DOM element into which child components are to be rendered,
***REMOVED*** or null if the container hasn't been rendered yet.
***REMOVED*** @param {Element} element Root element of the container whose content element
***REMOVED***     is to be returned.
***REMOVED*** @return {Element} Element to contain child elements (null if none).
***REMOVED***
goog.ui.ContainerRenderer.prototype.getContentElement = function(element) {
  return element;
***REMOVED***


***REMOVED***
***REMOVED*** Default implementation of {@code canDecorate***REMOVED*** returns true if the element
***REMOVED*** is a DIV, false otherwise.
***REMOVED*** @param {Element} element Element to decorate.
***REMOVED*** @return {boolean} Whether the renderer can decorate the element.
***REMOVED***
goog.ui.ContainerRenderer.prototype.canDecorate = function(element) {
  return element.tagName == 'DIV';
***REMOVED***


***REMOVED***
***REMOVED*** Default implementation of {@code decorate} for {@link goog.ui.Container}s.
***REMOVED*** Decorates the element with the container, and attempts to decorate its child
***REMOVED*** elements.  Returns the decorated element.
***REMOVED*** @param {goog.ui.Container} container Container to decorate the element.
***REMOVED*** @param {Element} element Element to decorate.
***REMOVED*** @return {Element} Decorated element.
***REMOVED***
goog.ui.ContainerRenderer.prototype.decorate = function(container, element) {
  // Set the container's ID to the decorated element's DOM ID, if any.
  if (element.id) {
    container.setId(element.id);
  }

  // Configure the container's state based on the CSS class names it has.
  var baseClass = this.getCssClass();
  var hasBaseClass = false;
  var classNames = goog.dom.classes.get(element);
  if (classNames) {
    goog.array.forEach(classNames, function(className) {
      if (className == baseClass) {
        hasBaseClass = true;
      } else if (className) {
        this.setStateFromClassName(container, className, baseClass);
      }
    }, this);
  }

  if (!hasBaseClass) {
    // Make sure the container's root element has the renderer's own CSS class.
    goog.dom.classes.add(element, baseClass);
  }

  // Decorate the element's children, if applicable.  This should happen after
  // the container's own state has been initialized, since how children are
  // decorated may depend on the state of the container.
  this.decorateChildren(container, this.getContentElement(element));

  return element;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the container's state based on the given CSS class name, encountered
***REMOVED*** during decoration.  CSS class names that don't represent container states
***REMOVED*** are ignored.  Considered protected; subclasses should override this method
***REMOVED*** to support more states and CSS class names.
***REMOVED*** @param {goog.ui.Container} container Container to update.
***REMOVED*** @param {string} className CSS class name.
***REMOVED*** @param {string} baseClass Base class name used as the root of state-specific
***REMOVED***     class names (typically the renderer's own class name).
***REMOVED*** @protected
***REMOVED***
goog.ui.ContainerRenderer.prototype.setStateFromClassName = function(container,
    className, baseClass) {
  if (className == goog.getCssName(baseClass, 'disabled')) {
    container.setEnabled(false);
  } else if (className == goog.getCssName(baseClass, 'horizontal')) {
    container.setOrientation(goog.ui.Container.Orientation.HORIZONTAL);
  } else if (className == goog.getCssName(baseClass, 'vertical')) {
    container.setOrientation(goog.ui.Container.Orientation.VERTICAL);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Takes a container and an element that may contain child elements, decorates
***REMOVED*** the child elements, and adds the corresponding components to the container
***REMOVED*** as child components.  Any non-element child nodes (e.g. empty text nodes
***REMOVED*** introduced by line breaks in the HTML source) are removed from the element.
***REMOVED*** @param {goog.ui.Container} container Container whose children are to be
***REMOVED***     discovered.
***REMOVED*** @param {Element} element Element whose children are to be decorated.
***REMOVED*** @param {Element=} opt_firstChild the first child to be decorated.
***REMOVED*** @suppress {visibility} setElementInternal
***REMOVED***
goog.ui.ContainerRenderer.prototype.decorateChildren = function(container,
    element, opt_firstChild) {
  if (element) {
    var node = opt_firstChild || element.firstChild, next;
    // Tag soup HTML may result in a DOM where siblings have different parents.
    while (node && node.parentNode == element) {
      // Get the next sibling here, since the node may be replaced or removed.
      next = node.nextSibling;
      if (node.nodeType == goog.dom.NodeType.ELEMENT) {
        // Decorate element node.
        var child = this.getDecoratorForChild(***REMOVED*** @type {Element}***REMOVED***(node));
        if (child) {
          // addChild() may need to look at the element.
          child.setElementInternal(***REMOVED*** @type {Element}***REMOVED***(node));
          // If the container is disabled, mark the child disabled too.  See
          // bug 1263729.  Note that this must precede the call to addChild().
          if (!container.isEnabled()) {
            child.setEnabled(false);
          }
          container.addChild(child);
          child.decorate(***REMOVED*** @type {Element}***REMOVED***(node));
        }
      } else if (!node.nodeValue || goog.string.trim(node.nodeValue) == '') {
        // Remove empty text node, otherwise madness ensues (e.g. controls that
        // use goog-inline-block will flicker and shift on hover on Gecko).
        element.removeChild(node);
      }
      node = next;
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** Inspects the element, and creates an instance of {@link goog.ui.Control} or
***REMOVED*** an appropriate subclass best suited to decorate it.  Returns the control (or
***REMOVED*** null if no suitable class was found).  This default implementation uses the
***REMOVED*** element's CSS class to find the appropriate control class to instantiate.
***REMOVED*** May be overridden in subclasses.
***REMOVED*** @param {Element} element Element to decorate.
***REMOVED*** @return {goog.ui.Control?} A new control suitable to decorate the element
***REMOVED***     (null if none).
***REMOVED***
goog.ui.ContainerRenderer.prototype.getDecoratorForChild = function(element) {
  return***REMOVED*****REMOVED*** @type {goog.ui.Control}***REMOVED*** (
      goog.ui.registry.getDecorator(element));
***REMOVED***


***REMOVED***
***REMOVED*** Initializes the container's DOM when the container enters the document.
***REMOVED*** Called from {@link goog.ui.Container#enterDocument}.
***REMOVED*** @param {goog.ui.Container} container Container whose DOM is to be initialized
***REMOVED***     as it enters the document.
***REMOVED***
goog.ui.ContainerRenderer.prototype.initializeDom = function(container) {
  var elem = container.getElement();
  goog.asserts.assert(elem, 'The container DOM element cannot be null.');
  // Make sure the container's element isn't selectable.  On Gecko, recursively
  // marking each child element unselectable is expensive and unnecessary, so
  // only mark the root element unselectable.
  goog.style.setUnselectable(elem, true, goog.userAgent.GECKO);

  // IE doesn't support outline:none, so we have to use the hideFocus property.
  if (goog.userAgent.IE) {
    elem.hideFocus = true;
  }

  // Set the ARIA role.
  var ariaRole = this.getAriaRole();
  if (ariaRole) {
    goog.a11y.aria.setRole(elem, ariaRole);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Returns the element within the container's DOM that should receive keyboard
***REMOVED*** focus (null if none).  The default implementation returns the container's
***REMOVED*** root element.
***REMOVED*** @param {goog.ui.Container} container Container whose key event target is
***REMOVED***     to be returned.
***REMOVED*** @return {Element} Key event target (null if none).
***REMOVED***
goog.ui.ContainerRenderer.prototype.getKeyEventTarget = function(container) {
  return container.getElement();
***REMOVED***


***REMOVED***
***REMOVED*** Returns the CSS class to be applied to the root element of containers
***REMOVED*** rendered using this renderer.
***REMOVED*** @return {string} Renderer-specific CSS class.
***REMOVED***
goog.ui.ContainerRenderer.prototype.getCssClass = function() {
  return goog.ui.ContainerRenderer.CSS_CLASS;
***REMOVED***


***REMOVED***
***REMOVED*** Returns all CSS class names applicable to the given container, based on its
***REMOVED*** state.  The array of class names returned includes the renderer's own CSS
***REMOVED*** class, followed by a CSS class indicating the container's orientation,
***REMOVED*** followed by any state-specific CSS classes.
***REMOVED*** @param {goog.ui.Container} container Container whose CSS classes are to be
***REMOVED***     returned.
***REMOVED*** @return {Array.<string>} Array of CSS class names applicable to the
***REMOVED***     container.
***REMOVED***
goog.ui.ContainerRenderer.prototype.getClassNames = function(container) {
  var baseClass = this.getCssClass();
  var isHorizontal =
      container.getOrientation() == goog.ui.Container.Orientation.HORIZONTAL;
  var classNames = [
    baseClass,
    (isHorizontal ?
        goog.getCssName(baseClass, 'horizontal') :
        goog.getCssName(baseClass, 'vertical'))
  ];
  if (!container.isEnabled()) {
    classNames.push(goog.getCssName(baseClass, 'disabled'));
  }
  return classNames;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the default orientation of containers rendered or decorated by this
***REMOVED*** renderer.  The base class implementation returns {@code VERTICAL}.
***REMOVED*** @return {goog.ui.Container.Orientation} Default orientation for containers
***REMOVED***     created or decorated by this renderer.
***REMOVED***
goog.ui.ContainerRenderer.prototype.getDefaultOrientation = function() {
  return goog.ui.Container.Orientation.VERTICAL;
***REMOVED***
