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
***REMOVED*** @fileoverview Native browser button renderer for {@link goog.ui.Button}s.
***REMOVED***
***REMOVED*** @author attila@google.com (Attila Bodis)
***REMOVED***

goog.provide('goog.ui.NativeButtonRenderer');

goog.require('goog.dom.classes');
***REMOVED***
goog.require('goog.ui.ButtonRenderer');
goog.require('goog.ui.Component.State');



***REMOVED***
***REMOVED*** Renderer for {@link goog.ui.Button}s.  Renders and decorates native HTML
***REMOVED*** button elements.  Since native HTML buttons have built-in support for many
***REMOVED*** features, overrides many expensive (and redundant) superclass methods to
***REMOVED*** be no-ops.
***REMOVED***
***REMOVED*** @extends {goog.ui.ButtonRenderer}
***REMOVED***
goog.ui.NativeButtonRenderer = function() {
  goog.ui.ButtonRenderer.call(this);
***REMOVED***
goog.inherits(goog.ui.NativeButtonRenderer, goog.ui.ButtonRenderer);
goog.addSingletonGetter(goog.ui.NativeButtonRenderer);


***REMOVED*** @override***REMOVED***
goog.ui.NativeButtonRenderer.prototype.getAriaRole = function() {
  // Native buttons don't need ARIA roles to be recognized by screen readers.
  return undefined;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the button's contents wrapped in a native HTML button element.  Sets
***REMOVED*** the button's disabled attribute as needed.
***REMOVED*** @param {goog.ui.Control} button Button to render.
***REMOVED*** @return {Element} Root element for the button (a native HTML button element).
***REMOVED*** @override
***REMOVED***
goog.ui.NativeButtonRenderer.prototype.createDom = function(button) {
  this.setUpNativeButton_(button);
  return button.getDomHelper().createDom('button', {
    'class': this.getClassNames(button).join(' '),
    'disabled': !button.isEnabled(),
    'title': button.getTooltip() || '',
    'value': button.getValue() || ''
  }, button.getCaption() || '');
***REMOVED***


***REMOVED***
***REMOVED*** Overrides {@link goog.ui.ButtonRenderer#canDecorate} by returning true only
***REMOVED*** if the element is an HTML button.
***REMOVED*** @param {Element} element Element to decorate.
***REMOVED*** @return {boolean} Whether the renderer can decorate the element.
***REMOVED*** @override
***REMOVED***
goog.ui.NativeButtonRenderer.prototype.canDecorate = function(element) {
  return element.tagName == 'BUTTON' ||
      (element.tagName == 'INPUT' && (element.type == 'button' ||
          element.type == 'submit' || element.type == 'reset'));
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.ui.NativeButtonRenderer.prototype.decorate = function(button, element) {
  this.setUpNativeButton_(button);
  if (element.disabled) {
    // Add the marker class for the DISABLED state before letting the superclass
    // implementation decorate the element, so its state will be correct.
    goog.dom.classes.add(element,
        this.getClassForState(goog.ui.Component.State.DISABLED));
  }
  return goog.ui.NativeButtonRenderer.superClass_.decorate.call(this, button,
      element);
***REMOVED***


***REMOVED***
***REMOVED*** Native buttons natively support BiDi and keyboard focus.
***REMOVED*** @suppress {visibility} getHandler and performActionInternal
***REMOVED*** @override
***REMOVED***
goog.ui.NativeButtonRenderer.prototype.initializeDom = function(button) {
  // WARNING:  This is a hack, and it is only applicable to native buttons,
  // which are special because they do natively what most goog.ui.Controls
  // do programmatically.  Do not use your renderer's initializeDom method
  // to hook up event handlers!
  button.getHandler().listen(button.getElement(), goog.events.EventType.CLICK,
      button.performActionInternal);
***REMOVED***


***REMOVED***
***REMOVED*** @override
***REMOVED*** Native buttons don't support text selection.
***REMOVED***
goog.ui.NativeButtonRenderer.prototype.setAllowTextSelection =
    goog.nullFunction;


***REMOVED***
***REMOVED*** @override
***REMOVED*** Native buttons natively support right-to-left rendering.
***REMOVED***
goog.ui.NativeButtonRenderer.prototype.setRightToLeft = goog.nullFunction;


***REMOVED***
***REMOVED*** @override
***REMOVED*** Native buttons are always focusable as long as they are enabled.
***REMOVED***
goog.ui.NativeButtonRenderer.prototype.isFocusable = function(button) {
  return button.isEnabled();
***REMOVED***


***REMOVED***
***REMOVED*** @override
***REMOVED*** Native buttons natively support keyboard focus.
***REMOVED***
goog.ui.NativeButtonRenderer.prototype.setFocusable = goog.nullFunction;


***REMOVED***
***REMOVED*** @override
***REMOVED*** Native buttons also expose the DISABLED state in the HTML button's
***REMOVED*** {@code disabled} attribute.
***REMOVED***
goog.ui.NativeButtonRenderer.prototype.setState = function(button, state,
    enable) {
  goog.ui.NativeButtonRenderer.superClass_.setState.call(this, button, state,
      enable);
  var element = button.getElement();
  if (element && state == goog.ui.Component.State.DISABLED) {
    element.disabled = enable;
  }
***REMOVED***


***REMOVED***
***REMOVED*** @override
***REMOVED*** Native buttons store their value in the HTML button's {@code value}
***REMOVED*** attribute.
***REMOVED***
goog.ui.NativeButtonRenderer.prototype.getValue = function(element) {
  // TODO(attila): Make this work on IE!  This never worked...
  // See http://www.fourmilab.ch/fourmilog/archives/2007-03/000824.html
  // for a description of the problem.
  return element.value;
***REMOVED***


***REMOVED***
***REMOVED*** @override
***REMOVED*** Native buttons also expose their value in the HTML button's {@code value}
***REMOVED*** attribute.
***REMOVED***
goog.ui.NativeButtonRenderer.prototype.setValue = function(element, value) {
  if (element) {
    // TODO(attila): Make this work on IE!  This never worked...
    // See http://www.fourmilab.ch/fourmilog/archives/2007-03/000824.html
    // for a description of the problem.
    element.value = value;
  }
***REMOVED***


***REMOVED***
***REMOVED*** @override
***REMOVED*** Native buttons don't need ARIA states to support accessibility, so this is
***REMOVED*** a no-op.
***REMOVED***
goog.ui.NativeButtonRenderer.prototype.updateAriaState = goog.nullFunction;


***REMOVED***
***REMOVED*** Sets up the button control such that it doesn't waste time adding
***REMOVED*** functionality that is already natively supported by native browser
***REMOVED*** buttons.
***REMOVED*** @param {goog.ui.Control} button Button control to configure.
***REMOVED*** @private
***REMOVED***
goog.ui.NativeButtonRenderer.prototype.setUpNativeButton_ = function(button) {
  button.setHandleMouseEvents(false);
  button.setAutoStates(goog.ui.Component.State.ALL, false);
  button.setSupportedState(goog.ui.Component.State.FOCUSED, false);
***REMOVED***
