// Copyright 2010 The Closure Library Authors. All Rights Reserved.

// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

***REMOVED***
***REMOVED*** @fileoverview Native browser textarea renderer for {@link goog.ui.Textarea}s.
***REMOVED***

goog.provide('goog.ui.TextareaRenderer');

goog.require('goog.ui.Component.State');
goog.require('goog.ui.ControlRenderer');



***REMOVED***
***REMOVED*** Renderer for {@link goog.ui.Textarea}s.  Renders and decorates native HTML
***REMOVED*** textarea elements.  Since native HTML textareas have built-in support for
***REMOVED*** many features, overrides many expensive (and redundant) superclass methods to
***REMOVED*** be no-ops.
***REMOVED***
***REMOVED*** @extends {goog.ui.ControlRenderer}
***REMOVED***
goog.ui.TextareaRenderer = function() {
  goog.ui.ControlRenderer.call(this);
***REMOVED***
goog.inherits(goog.ui.TextareaRenderer, goog.ui.ControlRenderer);
goog.addSingletonGetter(goog.ui.TextareaRenderer);


***REMOVED***
***REMOVED*** Default CSS class to be applied to the root element of components rendered
***REMOVED*** by this renderer.
***REMOVED*** @type {string}
***REMOVED***
goog.ui.TextareaRenderer.CSS_CLASS = goog.getCssName('goog-textarea');


***REMOVED*** @override***REMOVED***
goog.ui.TextareaRenderer.prototype.getAriaRole = function() {
  // textareas don't need ARIA roles to be recognized by screen readers.
  return undefined;
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.ui.TextareaRenderer.prototype.decorate = function(control, element) {
  this.setUpTextarea_(control);
  goog.ui.TextareaRenderer.superClass_.decorate.call(this, control,
      element);
  control.setContent(element.value);
  return element;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the textarea's contents wrapped in an HTML textarea element.  Sets
***REMOVED*** the textarea's disabled attribute as needed.
***REMOVED*** @param {goog.ui.Control} textarea Textarea to render.
***REMOVED*** @return {Element} Root element for the Textarea control (an HTML textarea
***REMOVED***     element).
***REMOVED*** @override
***REMOVED***
goog.ui.TextareaRenderer.prototype.createDom = function(textarea) {
  this.setUpTextarea_(textarea);
  var element = textarea.getDomHelper().createDom('textarea', {
    'class': this.getClassNames(textarea).join(' '),
    'disabled': !textarea.isEnabled()
  }, textarea.getContent() || '');
  return element;
***REMOVED***


***REMOVED***
***REMOVED*** Overrides {@link goog.ui.TextareaRenderer#canDecorate} by returning true only
***REMOVED*** if the element is an HTML textarea.
***REMOVED*** @param {Element} element Element to decorate.
***REMOVED*** @return {boolean} Whether the renderer can decorate the element.
***REMOVED*** @override
***REMOVED***
goog.ui.TextareaRenderer.prototype.canDecorate = function(element) {
  return element.tagName == goog.dom.TagName.TEXTAREA;
***REMOVED***


***REMOVED***
***REMOVED*** Textareas natively support right-to-left rendering.
***REMOVED*** @override
***REMOVED***
goog.ui.TextareaRenderer.prototype.setRightToLeft = goog.nullFunction;


***REMOVED***
***REMOVED*** Textareas are always focusable as long as they are enabled.
***REMOVED*** @override
***REMOVED***
goog.ui.TextareaRenderer.prototype.isFocusable = function(textarea) {
  return textarea.isEnabled();
***REMOVED***


***REMOVED***
***REMOVED*** Textareas natively support keyboard focus.
***REMOVED*** @override
***REMOVED***
goog.ui.TextareaRenderer.prototype.setFocusable = goog.nullFunction;


***REMOVED***
***REMOVED*** Textareas also expose the DISABLED state in the HTML textarea's
***REMOVED*** {@code disabled} attribute.
***REMOVED*** @override
***REMOVED***
goog.ui.TextareaRenderer.prototype.setState = function(textarea, state,
    enable) {
  goog.ui.TextareaRenderer.superClass_.setState.call(this, textarea, state,
      enable);
  var element = textarea.getElement();
  if (element && state == goog.ui.Component.State.DISABLED) {
    element.disabled = enable;
  }
***REMOVED***


***REMOVED***
***REMOVED*** Textareas don't need ARIA states to support accessibility, so this is
***REMOVED*** a no-op.
***REMOVED*** @override
***REMOVED***
goog.ui.TextareaRenderer.prototype.updateAriaState = goog.nullFunction;


***REMOVED***
***REMOVED*** Sets up the textarea control such that it doesn't waste time adding
***REMOVED*** functionality that is already natively supported by browser
***REMOVED*** textareas.
***REMOVED*** @param {goog.ui.Control} textarea Textarea control to configure.
***REMOVED*** @private
***REMOVED***
goog.ui.TextareaRenderer.prototype.setUpTextarea_ = function(textarea) {
  textarea.setHandleMouseEvents(false);
  textarea.setAutoStates(goog.ui.Component.State.ALL, false);
  textarea.setSupportedState(goog.ui.Component.State.FOCUSED, false);
***REMOVED***


***REMOVED*** @override***REMOVED****/
goog.ui.TextareaRenderer.prototype.setContent = function(element, value) {
  if (element) {
    element.value = value;
  }
***REMOVED***


***REMOVED*** @override***REMOVED****/
goog.ui.TextareaRenderer.prototype.getCssClass = function() {
  return goog.ui.TextareaRenderer.CSS_CLASS;
***REMOVED***
