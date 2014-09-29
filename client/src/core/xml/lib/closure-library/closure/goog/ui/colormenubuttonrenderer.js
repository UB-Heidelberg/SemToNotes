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
***REMOVED*** @fileoverview Renderer for {@link goog.ui.ColorMenuButton}s.
***REMOVED***
***REMOVED*** @author robbyw@google.com (Robby Walker)
***REMOVED*** @author attila@google.com (Attila Bodis)
***REMOVED***

goog.provide('goog.ui.ColorMenuButtonRenderer');

goog.require('goog.color');
goog.require('goog.dom.classes');
goog.require('goog.ui.ControlContent');
goog.require('goog.ui.MenuButtonRenderer');
goog.require('goog.userAgent');



***REMOVED***
***REMOVED*** Renderer for {@link goog.ui.ColorMenuButton}s.
***REMOVED***
***REMOVED*** @extends {goog.ui.MenuButtonRenderer}
***REMOVED***
goog.ui.ColorMenuButtonRenderer = function() {
  goog.ui.MenuButtonRenderer.call(this);
***REMOVED***
goog.inherits(goog.ui.ColorMenuButtonRenderer, goog.ui.MenuButtonRenderer);
goog.addSingletonGetter(goog.ui.ColorMenuButtonRenderer);


***REMOVED***
***REMOVED*** Default CSS class to be applied to the root element of components rendered
***REMOVED*** by this renderer.
***REMOVED*** @type {string}
***REMOVED***
goog.ui.ColorMenuButtonRenderer.CSS_CLASS =
    goog.getCssName('goog-color-menu-button');


***REMOVED***
***REMOVED*** Overrides the superclass implementation by wrapping the caption text or DOM
***REMOVED*** structure in a color indicator element.  Creates the following DOM structure:
***REMOVED***   <div class="goog-inline-block goog-menu-button-caption">
***REMOVED***     <div class="goog-color-menu-button-indicator">
***REMOVED***       Contents...
***REMOVED***     </div>
***REMOVED***   </div>
***REMOVED*** The 'goog-color-menu-button-indicator' style should be defined to have a
***REMOVED*** bottom border of nonzero width and a default color that blends into its
***REMOVED*** background.
***REMOVED*** @param {goog.ui.ControlContent} content Text caption or DOM structure.
***REMOVED*** @param {goog.dom.DomHelper} dom DOM helper, used for document interaction.
***REMOVED*** @return {Element} Caption element.
***REMOVED*** @override
***REMOVED***
goog.ui.ColorMenuButtonRenderer.prototype.createCaption = function(content,
    dom) {
  return goog.ui.ColorMenuButtonRenderer.superClass_.createCaption.call(this,
      goog.ui.ColorMenuButtonRenderer.wrapCaption(content, dom), dom);
***REMOVED***


***REMOVED***
***REMOVED*** Wrap a caption in a div with the color-menu-button-indicator CSS class.
***REMOVED*** @param {goog.ui.ControlContent} content Text caption or DOM structure.
***REMOVED*** @param {goog.dom.DomHelper} dom DOM helper, used for document interaction.
***REMOVED*** @return {Element} Caption element.
***REMOVED***
goog.ui.ColorMenuButtonRenderer.wrapCaption = function(content, dom) {
  return dom.createDom('div',
      goog.getCssName(goog.ui.ColorMenuButtonRenderer.CSS_CLASS, 'indicator'),
      content);
***REMOVED***


***REMOVED***
***REMOVED*** Takes a color menu button control's root element and a value object
***REMOVED*** (which is assumed to be a color), and updates the button's DOM to reflect
***REMOVED*** the new color.  Overrides {@link goog.ui.ButtonRenderer#setValue}.
***REMOVED*** @param {Element} element The button control's root element (if rendered).
***REMOVED*** @param {*} value New value; assumed to be a color spec string.
***REMOVED*** @override
***REMOVED***
goog.ui.ColorMenuButtonRenderer.prototype.setValue = function(element, value) {
  if (element) {
    goog.ui.ColorMenuButtonRenderer.setCaptionValue(
        this.getContentElement(element), value);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Takes a control's content element and a value object (which is assumed
***REMOVED*** to be a color), and updates its DOM to reflect the new color.
***REMOVED*** @param {Element} caption A content element of a control.
***REMOVED*** @param {*} value New value; assumed to be a color spec string.
***REMOVED***
goog.ui.ColorMenuButtonRenderer.setCaptionValue = function(caption, value) {
  // Assume that the caption's first child is the indicator.
  if (caption && caption.firstChild) {
    // Normalize the value to a hex color spec or null (otherwise setting
    // borderBottomColor will cause a JS error on IE).
    var hexColor;

    var strValue =***REMOVED*****REMOVED*** @type {string}***REMOVED*** (value);
    hexColor = strValue && goog.color.isValidColor(strValue) ?
        goog.color.parse(strValue).hex :
        null;

    // Stupid IE6/7 doesn't do transparent borders.
    // TODO(attila): Add user-agent version check when IE8 comes out...
    caption.firstChild.style.borderBottomColor = hexColor ||
        (goog.userAgent.IE ? '' : 'transparent');
  }
***REMOVED***


***REMOVED***
***REMOVED*** Initializes the button's DOM when it enters the document.  Overrides the
***REMOVED*** superclass implementation by making sure the button's color indicator is
***REMOVED*** initialized.
***REMOVED*** @param {goog.ui.Control} button goog.ui.ColorMenuButton whose DOM is to be
***REMOVED***     initialized as it enters the document.
***REMOVED*** @override
***REMOVED***
goog.ui.ColorMenuButtonRenderer.prototype.initializeDom = function(button) {
  this.setValue(button.getElement(), button.getValue());
  goog.dom.classes.add(button.getElement(),
      goog.ui.ColorMenuButtonRenderer.CSS_CLASS);
  goog.ui.ColorMenuButtonRenderer.superClass_.initializeDom.call(this,
      button);
***REMOVED***
