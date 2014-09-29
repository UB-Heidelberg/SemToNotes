// Copyright 2010 The Closure Library Authors. All Rights Reserved.
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
***REMOVED*** @fileoverview An alternative imageless button renderer that uses CSS3 rather
***REMOVED*** than voodoo to render custom buttons with rounded corners and dimensionality
***REMOVED*** (via a subtle flat shadow on the bottom half of the button) without the use
***REMOVED*** of images.
***REMOVED***
***REMOVED*** Based on the Custom Buttons 3.1 visual specification, see
***REMOVED*** http://go/custombuttons
***REMOVED***
***REMOVED*** Tested and verified to work in Gecko 1.9.2+ and WebKit 528+.
***REMOVED***
***REMOVED*** @author eae@google.com (Emil A Eklund)
***REMOVED*** @author slightlyoff@google.com (Alex Russell)
***REMOVED*** @see ../demos/css3button.html
***REMOVED***

goog.provide('goog.ui.Css3ButtonRenderer');

goog.require('goog.dom');
goog.require('goog.dom.TagName');
goog.require('goog.dom.classes');
goog.require('goog.ui.Button');
goog.require('goog.ui.ButtonRenderer');
goog.require('goog.ui.ControlContent');
goog.require('goog.ui.INLINE_BLOCK_CLASSNAME');
goog.require('goog.ui.registry');



***REMOVED***
***REMOVED*** Custom renderer for {@link goog.ui.Button}s. Css3 buttons can contain
***REMOVED*** almost arbitrary HTML content, will flow like inline elements, but can be
***REMOVED*** styled like block-level elements.
***REMOVED***
***REMOVED***
***REMOVED*** @extends {goog.ui.ButtonRenderer}
***REMOVED***
goog.ui.Css3ButtonRenderer = function() {
  goog.ui.ButtonRenderer.call(this);
***REMOVED***
goog.inherits(goog.ui.Css3ButtonRenderer, goog.ui.ButtonRenderer);


***REMOVED***
***REMOVED*** The singleton instance of this renderer class.
***REMOVED*** @type {goog.ui.Css3ButtonRenderer?}
***REMOVED*** @private
***REMOVED***
goog.ui.Css3ButtonRenderer.instance_ = null;
goog.addSingletonGetter(goog.ui.Css3ButtonRenderer);


***REMOVED***
***REMOVED*** Default CSS class to be applied to the root element of components rendered
***REMOVED*** by this renderer.
***REMOVED*** @type {string}
***REMOVED***
goog.ui.Css3ButtonRenderer.CSS_CLASS = goog.getCssName('goog-css3-button');


***REMOVED*** @override***REMOVED***
goog.ui.Css3ButtonRenderer.prototype.getContentElement = function(element) {
  return***REMOVED*****REMOVED*** @type {Element}***REMOVED*** (element);
***REMOVED***


***REMOVED***
***REMOVED*** Returns the button's contents wrapped in the following DOM structure:
***REMOVED***    <div class="goog-inline-block goog-css3-button">
***REMOVED***      Contents...
***REMOVED***    </div>
***REMOVED*** Overrides {@link goog.ui.ButtonRenderer#createDom}.
***REMOVED*** @param {goog.ui.Control} control goog.ui.Button to render.
***REMOVED*** @return {Element} Root element for the button.
***REMOVED*** @override
***REMOVED***
goog.ui.Css3ButtonRenderer.prototype.createDom = function(control) {
  var button =***REMOVED*****REMOVED*** @type {goog.ui.Button}***REMOVED*** (control);
  var classNames = this.getClassNames(button);
  var attr = {
    'class': goog.ui.INLINE_BLOCK_CLASSNAME + ' ' + classNames.join(' '),
    'title': button.getTooltip() || ''
 ***REMOVED*****REMOVED***
  return button.getDomHelper().createDom('div', attr, button.getContent());
***REMOVED***


***REMOVED***
***REMOVED*** Returns true if this renderer can decorate the element.  Overrides
***REMOVED*** {@link goog.ui.ButtonRenderer#canDecorate} by returning true if the
***REMOVED*** element is a DIV, false otherwise.
***REMOVED*** @param {Element} element Element to decorate.
***REMOVED*** @return {boolean} Whether the renderer can decorate the element.
***REMOVED*** @override
***REMOVED***
goog.ui.Css3ButtonRenderer.prototype.canDecorate = function(element) {
  return element.tagName == goog.dom.TagName.DIV;
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.ui.Css3ButtonRenderer.prototype.decorate = function(button, element) {
  goog.dom.classes.add(element, goog.ui.INLINE_BLOCK_CLASSNAME,
      this.getCssClass());
  return goog.ui.Css3ButtonRenderer.superClass_.decorate.call(this, button,
      element);
***REMOVED***


***REMOVED***
***REMOVED*** Returns the CSS class to be applied to the root element of components
***REMOVED*** rendered using this renderer.
***REMOVED*** @return {string} Renderer-specific CSS class.
***REMOVED*** @override
***REMOVED***
goog.ui.Css3ButtonRenderer.prototype.getCssClass = function() {
  return goog.ui.Css3ButtonRenderer.CSS_CLASS;
***REMOVED***


// Register a decorator factory function for goog.ui.Css3ButtonRenderer.
goog.ui.registry.setDecoratorByClassName(
    goog.ui.Css3ButtonRenderer.CSS_CLASS,
    function() {
      return new goog.ui.Button(null,
          goog.ui.Css3ButtonRenderer.getInstance());
    });


// Register a decorator factory function for toggle buttons using the
// goog.ui.Css3ButtonRenderer.
goog.ui.registry.setDecoratorByClassName(
    goog.getCssName('goog-css3-toggle-button'),
    function() {
      var button = new goog.ui.Button(null,
          goog.ui.Css3ButtonRenderer.getInstance());
      button.setSupportedState(goog.ui.Component.State.CHECKED, true);
      return button;
    });
