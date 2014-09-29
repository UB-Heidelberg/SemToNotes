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
***REMOVED*** @fileoverview An alternative custom button renderer that uses even more CSS
***REMOVED*** voodoo than the default implementation to render custom buttons with fake
***REMOVED*** rounded corners and dimensionality (via a subtle flat shadow on the bottom
***REMOVED*** half of the button) without the use of images.
***REMOVED***
***REMOVED*** Based on the Custom Buttons 3.1 visual specification, see
***REMOVED*** http://go/custombuttons
***REMOVED***
***REMOVED*** @author eae@google.com (Emil A Eklund)
***REMOVED*** @see ../demos/imagelessbutton.html
***REMOVED***

goog.provide('goog.ui.ImagelessButtonRenderer');

goog.require('goog.dom.classes');
goog.require('goog.ui.Button');
goog.require('goog.ui.ControlContent');
goog.require('goog.ui.CustomButtonRenderer');
goog.require('goog.ui.INLINE_BLOCK_CLASSNAME');
goog.require('goog.ui.registry');



***REMOVED***
***REMOVED*** Custom renderer for {@link goog.ui.Button}s. Imageless buttons can contain
***REMOVED*** almost arbitrary HTML content, will flow like inline elements, but can be
***REMOVED*** styled like block-level elements.
***REMOVED***
***REMOVED***
***REMOVED*** @extends {goog.ui.CustomButtonRenderer}
***REMOVED***
goog.ui.ImagelessButtonRenderer = function() {
  goog.ui.CustomButtonRenderer.call(this);
***REMOVED***
goog.inherits(goog.ui.ImagelessButtonRenderer, goog.ui.CustomButtonRenderer);


***REMOVED***
***REMOVED*** The singleton instance of this renderer class.
***REMOVED*** @type {goog.ui.ImagelessButtonRenderer?}
***REMOVED*** @private
***REMOVED***
goog.ui.ImagelessButtonRenderer.instance_ = null;
goog.addSingletonGetter(goog.ui.ImagelessButtonRenderer);


***REMOVED***
***REMOVED*** Default CSS class to be applied to the root element of components rendered
***REMOVED*** by this renderer.
***REMOVED*** @type {string}
***REMOVED***
goog.ui.ImagelessButtonRenderer.CSS_CLASS =
    goog.getCssName('goog-imageless-button');


***REMOVED***
***REMOVED*** Returns the button's contents wrapped in the following DOM structure:
***REMOVED***    <div class="goog-inline-block goog-imageless-button">
***REMOVED***      <div class="goog-inline-block goog-imageless-button-outer-box">
***REMOVED***        <div class="goog-imageless-button-inner-box">
***REMOVED***          <div class="goog-imageless-button-pos-box">
***REMOVED***            <div class="goog-imageless-button-top-shadow">&nbsp;</div>
***REMOVED***            <div class="goog-imageless-button-content">Contents...</div>
***REMOVED***          </div>
***REMOVED***        </div>
***REMOVED***      </div>
***REMOVED***    </div>
***REMOVED*** @override
***REMOVED***
goog.ui.ImagelessButtonRenderer.prototype.createDom;


***REMOVED*** @override***REMOVED***
goog.ui.ImagelessButtonRenderer.prototype.getContentElement = function(
    element) {
  return***REMOVED*****REMOVED*** @type {Element}***REMOVED*** (element && element.firstChild &&
      element.firstChild.firstChild &&
      element.firstChild.firstChild.firstChild.lastChild);
***REMOVED***


***REMOVED***
***REMOVED*** Takes a text caption or existing DOM structure, and returns the content
***REMOVED*** wrapped in a pseudo-rounded-corner box.  Creates the following DOM structure:
***REMOVED***  <div class="goog-inline-block goog-imageless-button-outer-box">
***REMOVED***    <div class="goog-inline-block goog-imageless-button-inner-box">
***REMOVED***      <div class="goog-imageless-button-pos">
***REMOVED***        <div class="goog-imageless-button-top-shadow">&nbsp;</div>
***REMOVED***        <div class="goog-imageless-button-content">Contents...</div>
***REMOVED***      </div>
***REMOVED***    </div>
***REMOVED***  </div>
***REMOVED*** Used by both {@link #createDom} and {@link #decorate}.  To be overridden
***REMOVED*** by subclasses.
***REMOVED*** @param {goog.ui.ControlContent} content Text caption or DOM structure to wrap
***REMOVED***     in a box.
***REMOVED*** @param {goog.dom.DomHelper} dom DOM helper, used for document interaction.
***REMOVED*** @return {Element} Pseudo-rounded-corner box containing the content.
***REMOVED*** @override
***REMOVED***
goog.ui.ImagelessButtonRenderer.prototype.createButton = function(content,
                                                                  dom) {
  var baseClass = this.getCssClass();
  var inlineBlock = goog.ui.INLINE_BLOCK_CLASSNAME + ' ';
  return dom.createDom('div',
      inlineBlock + goog.getCssName(baseClass, 'outer-box'),
      dom.createDom('div',
          inlineBlock + goog.getCssName(baseClass, 'inner-box'),
          dom.createDom('div', goog.getCssName(baseClass, 'pos'),
              dom.createDom('div', goog.getCssName(baseClass, 'top-shadow'),
                  '\u00A0'),
              dom.createDom('div', goog.getCssName(baseClass, 'content'),
                  content))));
***REMOVED***


***REMOVED***
***REMOVED*** Check if the button's element has a box structure.
***REMOVED*** @param {goog.ui.Button} button Button instance whose structure is being
***REMOVED***     checked.
***REMOVED*** @param {Element} element Element of the button.
***REMOVED*** @return {boolean} Whether the element has a box structure.
***REMOVED*** @protected
***REMOVED*** @override
***REMOVED***
goog.ui.ImagelessButtonRenderer.prototype.hasBoxStructure = function(
    button, element) {
  var outer = button.getDomHelper().getFirstElementChild(element);
  var outerClassName = goog.getCssName(this.getCssClass(), 'outer-box');
  if (outer && goog.dom.classes.has(outer, outerClassName)) {

    var inner = button.getDomHelper().getFirstElementChild(outer);
    var innerClassName = goog.getCssName(this.getCssClass(), 'inner-box');
    if (inner && goog.dom.classes.has(inner, innerClassName)) {

      var pos = button.getDomHelper().getFirstElementChild(inner);
      var posClassName = goog.getCssName(this.getCssClass(), 'pos');
      if (pos && goog.dom.classes.has(pos, posClassName)) {

        var shadow = button.getDomHelper().getFirstElementChild(pos);
        var shadowClassName = goog.getCssName(
            this.getCssClass(), 'top-shadow');
        if (shadow && goog.dom.classes.has(shadow, shadowClassName)) {

          var content = button.getDomHelper().getNextElementSibling(shadow);
          var contentClassName = goog.getCssName(
              this.getCssClass(), 'content');
          if (content && goog.dom.classes.has(content, contentClassName)) {
            // We have a proper box structure.
            return true;
          }
        }
      }
    }
  }
  return false;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the CSS class to be applied to the root element of components
***REMOVED*** rendered using this renderer.
***REMOVED*** @return {string} Renderer-specific CSS class.
***REMOVED*** @override
***REMOVED***
goog.ui.ImagelessButtonRenderer.prototype.getCssClass = function() {
  return goog.ui.ImagelessButtonRenderer.CSS_CLASS;
***REMOVED***


// Register a decorator factory function for goog.ui.ImagelessButtonRenderer.
goog.ui.registry.setDecoratorByClassName(
    goog.ui.ImagelessButtonRenderer.CSS_CLASS,
    function() {
      return new goog.ui.Button(null,
          goog.ui.ImagelessButtonRenderer.getInstance());
    });


// Register a decorator factory function for toggle buttons using the
// goog.ui.ImagelessButtonRenderer.
goog.ui.registry.setDecoratorByClassName(
    goog.getCssName('goog-imageless-toggle-button'),
    function() {
      var button = new goog.ui.Button(null,
          goog.ui.ImagelessButtonRenderer.getInstance());
      button.setSupportedState(goog.ui.Component.State.CHECKED, true);
      return button;
    });
