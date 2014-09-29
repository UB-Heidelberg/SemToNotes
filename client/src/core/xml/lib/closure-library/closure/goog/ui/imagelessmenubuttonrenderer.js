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
***REMOVED*** @author dalewis@google.com (Darren Lewis)
***REMOVED*** @see ../demos/imagelessmenubutton.html
***REMOVED***

goog.provide('goog.ui.ImagelessMenuButtonRenderer');

goog.require('goog.dom');
goog.require('goog.dom.TagName');
goog.require('goog.dom.classes');
goog.require('goog.ui.ControlContent');
goog.require('goog.ui.INLINE_BLOCK_CLASSNAME');
goog.require('goog.ui.MenuButton');
goog.require('goog.ui.MenuButtonRenderer');
goog.require('goog.ui.registry');



***REMOVED***
***REMOVED*** Custom renderer for {@link goog.ui.MenuButton}s. Imageless buttons can
***REMOVED*** contain almost arbitrary HTML content, will flow like inline elements, but
***REMOVED*** can be styled like block-level elements.
***REMOVED***
***REMOVED***
***REMOVED*** @extends {goog.ui.MenuButtonRenderer}
***REMOVED***
goog.ui.ImagelessMenuButtonRenderer = function() {
  goog.ui.MenuButtonRenderer.call(this);
***REMOVED***
goog.inherits(goog.ui.ImagelessMenuButtonRenderer, goog.ui.MenuButtonRenderer);


***REMOVED***
***REMOVED*** The singleton instance of this renderer class.
***REMOVED*** @type {goog.ui.ImagelessMenuButtonRenderer?}
***REMOVED*** @private
***REMOVED***
goog.ui.ImagelessMenuButtonRenderer.instance_ = null;
goog.addSingletonGetter(goog.ui.ImagelessMenuButtonRenderer);


***REMOVED***
***REMOVED*** Default CSS class to be applied to the root element of components rendered
***REMOVED*** by this renderer.
***REMOVED*** @type {string}
***REMOVED***
goog.ui.ImagelessMenuButtonRenderer.CSS_CLASS =
    goog.getCssName('goog-imageless-button');


***REMOVED*** @override***REMOVED***
goog.ui.ImagelessMenuButtonRenderer.prototype.getContentElement = function(
    element) {
  if (element) {
    var captionElem = goog.dom.getElementsByTagNameAndClass(
        '*', goog.getCssName(this.getCssClass(), 'caption'), element)[0];
    return captionElem;
  }
  return null;
***REMOVED***


***REMOVED***
***REMOVED*** Returns true if this renderer can decorate the element.  Overrides
***REMOVED*** {@link goog.ui.MenuButtonRenderer#canDecorate} by returning true if the
***REMOVED*** element is a DIV, false otherwise.
***REMOVED*** @param {Element} element Element to decorate.
***REMOVED*** @return {boolean} Whether the renderer can decorate the element.
***REMOVED*** @override
***REMOVED***
goog.ui.ImagelessMenuButtonRenderer.prototype.canDecorate = function(element) {
  return element.tagName == goog.dom.TagName.DIV;
***REMOVED***


***REMOVED***
***REMOVED*** Takes a text caption or existing DOM structure, and returns the content
***REMOVED*** wrapped in a pseudo-rounded-corner box.  Creates the following DOM structure:
***REMOVED***  <div class="goog-inline-block goog-imageless-button">
***REMOVED***    <div class="goog-inline-block goog-imageless-button-outer-box">
***REMOVED***      <div class="goog-imageless-button-inner-box">
***REMOVED***        <div class="goog-imageless-button-pos-box">
***REMOVED***          <div class="goog-imageless-button-top-shadow">&nbsp;</div>
***REMOVED***          <div class="goog-imageless-button-content
***REMOVED***                      goog-imageless-menubutton-caption">Contents...
***REMOVED***          </div>
***REMOVED***          <div class="goog-imageless-menubutton-dropdown"></div>
***REMOVED***        </div>
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
goog.ui.ImagelessMenuButtonRenderer.prototype.createButton = function(content,
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
              dom.createDom('div', [goog.getCssName(baseClass, 'content'),
                                    goog.getCssName(baseClass, 'caption'),
                                    goog.getCssName('goog-inline-block')],
                            content),
              dom.createDom('div', [goog.getCssName(baseClass, 'dropdown'),
                                    goog.getCssName('goog-inline-block')]))));
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
goog.ui.ImagelessMenuButtonRenderer.prototype.hasBoxStructure = function(
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
goog.ui.ImagelessMenuButtonRenderer.prototype.getCssClass = function() {
  return goog.ui.ImagelessMenuButtonRenderer.CSS_CLASS;
***REMOVED***


// Register a decorator factory function for
// goog.ui.ImagelessMenuButtonRenderer. Since we're using goog-imageless-button
// as the base class in order to get the same styling as
// goog.ui.ImagelessButtonRenderer, we need to be explicit about giving
// goog-imageless-menu-button here.
goog.ui.registry.setDecoratorByClassName(
    goog.getCssName('goog-imageless-menu-button'),
    function() {
      return new goog.ui.MenuButton(null, null,
          goog.ui.ImagelessMenuButtonRenderer.getInstance());
    });
