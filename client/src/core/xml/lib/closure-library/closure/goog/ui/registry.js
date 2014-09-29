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
***REMOVED*** @fileoverview Global renderer and decorator registry.
***REMOVED*** @author attila@google.com (Attila Bodis)
***REMOVED***

goog.provide('goog.ui.registry');

goog.require('goog.dom.classes');


***REMOVED***
***REMOVED*** Given a {@link goog.ui.Component} constructor, returns an instance of its
***REMOVED*** default renderer.  If the default renderer is a singleton, returns the
***REMOVED*** singleton instance; otherwise returns a new instance of the renderer class.
***REMOVED*** @param {Function} componentCtor Component constructor function (for example
***REMOVED***     {@code goog.ui.Button}).
***REMOVED*** @return {goog.ui.ControlRenderer?} Renderer instance (for example the
***REMOVED***     singleton instance of {@code goog.ui.ButtonRenderer}), or null if
***REMOVED***     no default renderer was found.
***REMOVED***
goog.ui.registry.getDefaultRenderer = function(componentCtor) {
  // Locate the default renderer based on the constructor's unique ID.  If no
  // renderer is registered for this class, walk up the superClass_ chain.
  var key;
 ***REMOVED*****REMOVED*** @type {Function|undefined}***REMOVED*** var rendererCtor;
  while (componentCtor) {
    key = goog.getUid(componentCtor);
    if ((rendererCtor = goog.ui.registry.defaultRenderers_[key])) {
      break;
    }
    componentCtor = componentCtor.superClass_ ?
        componentCtor.superClass_.constructor : null;
  }

  // If the renderer has a static getInstance method, return the singleton
  // instance; otherwise create and return a new instance.
  if (rendererCtor) {
    return goog.isFunction(rendererCtor.getInstance) ?
        rendererCtor.getInstance() : new rendererCtor();
  }

  return null;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the default renderer for the given {@link goog.ui.Component}
***REMOVED*** constructor.
***REMOVED*** @param {Function} componentCtor Component constructor function (for example
***REMOVED***     {@code goog.ui.Button}).
***REMOVED*** @param {Function} rendererCtor Renderer constructor function (for example
***REMOVED***     {@code goog.ui.ButtonRenderer}).
***REMOVED*** @throws {Error} If the arguments aren't functions.
***REMOVED***
goog.ui.registry.setDefaultRenderer = function(componentCtor, rendererCtor) {
  // In this case, explicit validation has negligible overhead (since each
  // renderer is only registered once), and helps catch subtle bugs.
  if (!goog.isFunction(componentCtor)) {
    throw Error('Invalid component class ' + componentCtor);
  }
  if (!goog.isFunction(rendererCtor)) {
    throw Error('Invalid renderer class ' + rendererCtor);
  }

  // Map the component constructor's unique ID to the renderer constructor.
  var key = goog.getUid(componentCtor);
  goog.ui.registry.defaultRenderers_[key] = rendererCtor;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the {@link goog.ui.Component} instance created by the decorator
***REMOVED*** factory function registered for the given CSS class name, or null if no
***REMOVED*** decorator factory function was found.
***REMOVED*** @param {string} className CSS class name.
***REMOVED*** @return {goog.ui.Component?} Component instance.
***REMOVED***
goog.ui.registry.getDecoratorByClassName = function(className) {
  return className in goog.ui.registry.decoratorFunctions_ ?
      goog.ui.registry.decoratorFunctions_[className]() : null;
***REMOVED***


***REMOVED***
***REMOVED*** Maps a CSS class name to a function that returns a new instance of
***REMOVED*** {@link goog.ui.Component} or a subclass, suitable to decorate an element
***REMOVED*** that has the specified CSS class.
***REMOVED*** @param {string} className CSS class name.
***REMOVED*** @param {Function} decoratorFn No-argument function that returns a new
***REMOVED***     instance of a {@link goog.ui.Component} to decorate an element.
***REMOVED*** @throws {Error} If the class name or the decorator function is invalid.
***REMOVED***
goog.ui.registry.setDecoratorByClassName = function(className, decoratorFn) {
  // In this case, explicit validation has negligible overhead (since each
  // decorator  is only registered once), and helps catch subtle bugs.
  if (!className) {
    throw Error('Invalid class name ' + className);
  }
  if (!goog.isFunction(decoratorFn)) {
    throw Error('Invalid decorator function ' + decoratorFn);
  }

  goog.ui.registry.decoratorFunctions_[className] = decoratorFn;
***REMOVED***


***REMOVED***
***REMOVED*** Returns an instance of {@link goog.ui.Component} or a subclass suitable to
***REMOVED*** decorate the given element, based on its CSS class.
***REMOVED*** @param {Element} element Element to decorate.
***REMOVED*** @return {goog.ui.Component?} Component to decorate the element (null if
***REMOVED***     none).
***REMOVED***
goog.ui.registry.getDecorator = function(element) {
  var decorator;
  var classNames = goog.dom.classes.get(element);
  for (var i = 0, len = classNames.length; i < len; i++) {
    if ((decorator = goog.ui.registry.getDecoratorByClassName(classNames[i]))) {
      return decorator;
    }
  }
  return null;
***REMOVED***


***REMOVED***
***REMOVED*** Resets the global renderer and decorator registry.
***REMOVED***
goog.ui.registry.reset = function() {
  goog.ui.registry.defaultRenderers_ = {***REMOVED***
  goog.ui.registry.decoratorFunctions_ = {***REMOVED***
***REMOVED***


***REMOVED***
***REMOVED*** Map of {@link goog.ui.Component} constructor unique IDs to the constructors
***REMOVED*** of their default {@link goog.ui.Renderer}s.
***REMOVED*** @type {Object}
***REMOVED*** @private
***REMOVED***
goog.ui.registry.defaultRenderers_ = {***REMOVED***


***REMOVED***
***REMOVED*** Map of CSS class names to registry factory functions.  The keys are
***REMOVED*** class names.  The values are function objects that return new instances
***REMOVED*** of {@link goog.ui.registry} or one of its subclasses, suitable to
***REMOVED*** decorate elements marked with the corresponding CSS class.  Used by
***REMOVED*** containers while decorating their children.
***REMOVED*** @type {Object}
***REMOVED*** @private
***REMOVED***
goog.ui.registry.decoratorFunctions_ = {***REMOVED***
