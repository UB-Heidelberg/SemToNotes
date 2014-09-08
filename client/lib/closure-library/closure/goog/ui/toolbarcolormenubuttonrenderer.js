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
***REMOVED*** @fileoverview A toolbar-style renderer for {@link goog.ui.ColorMenuButton}.
***REMOVED***
***REMOVED*** @author attila@google.com (Attila Bodis)
***REMOVED***

goog.provide('goog.ui.ToolbarColorMenuButtonRenderer');

goog.require('goog.asserts');
goog.require('goog.dom.classlist');
goog.require('goog.ui.ColorMenuButtonRenderer');
goog.require('goog.ui.MenuButtonRenderer');
goog.require('goog.ui.ToolbarMenuButtonRenderer');



***REMOVED***
***REMOVED*** Toolbar-style renderer for {@link goog.ui.ColorMenuButton}s.
***REMOVED***
***REMOVED*** @extends {goog.ui.ToolbarMenuButtonRenderer}
***REMOVED*** @final
***REMOVED***
goog.ui.ToolbarColorMenuButtonRenderer = function() {
  goog.ui.ToolbarMenuButtonRenderer.call(this);
***REMOVED***
goog.inherits(goog.ui.ToolbarColorMenuButtonRenderer,
              goog.ui.ToolbarMenuButtonRenderer);
goog.addSingletonGetter(goog.ui.ToolbarColorMenuButtonRenderer);


***REMOVED***
***REMOVED*** Overrides the superclass implementation by wrapping the caption text or DOM
***REMOVED*** structure in a color indicator element.  Creates the following DOM structure:
***REMOVED***   <div class="goog-inline-block goog-toolbar-menu-button-caption">
***REMOVED***     <div class="goog-color-menu-button-indicator">
***REMOVED***       Contents...
***REMOVED***     </div>
***REMOVED***   </div>
***REMOVED*** @param {goog.ui.ControlContent} content Text caption or DOM structure.
***REMOVED*** @param {goog.dom.DomHelper} dom DOM helper, used for document interaction.
***REMOVED*** @return {!Element} Caption element.
***REMOVED*** @see goog.ui.ToolbarColorMenuButtonRenderer#createColorIndicator
***REMOVED*** @override
***REMOVED***
goog.ui.ToolbarColorMenuButtonRenderer.prototype.createCaption = function(
    content, dom) {
  return goog.ui.MenuButtonRenderer.wrapCaption(
      goog.ui.ColorMenuButtonRenderer.wrapCaption(content, dom),
      this.getCssClass(),
      dom);
***REMOVED***


***REMOVED***
***REMOVED*** Takes a color menu button control's root element and a value object
***REMOVED*** (which is assumed to be a color), and updates the button's DOM to reflect
***REMOVED*** the new color.  Overrides {@link goog.ui.ButtonRenderer#setValue}.
***REMOVED*** @param {Element} element The button control's root element (if rendered).
***REMOVED*** @param {*} value New value; assumed to be a color spec string.
***REMOVED*** @override
***REMOVED***
goog.ui.ToolbarColorMenuButtonRenderer.prototype.setValue = function(element,
    value) {
  if (element) {
    goog.ui.ColorMenuButtonRenderer.setCaptionValue(
        this.getContentElement(element), value);
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
goog.ui.ToolbarColorMenuButtonRenderer.prototype.initializeDom = function(
    button) {
  this.setValue(button.getElement(), button.getValue());
  goog.dom.classlist.add(
      goog.asserts.assert(button.getElement()),
      goog.getCssName('goog-toolbar-color-menu-button'));
  goog.ui.ToolbarColorMenuButtonRenderer.superClass_.initializeDom.call(this,
      button);
***REMOVED***
