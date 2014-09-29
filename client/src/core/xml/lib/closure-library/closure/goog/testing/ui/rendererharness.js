// Copyright 2009 The Closure Library Authors. All Rights Reserved.
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
// All Rights Reserved

***REMOVED***
***REMOVED*** @fileoverview A driver for testing renderers.
***REMOVED***
***REMOVED*** @author nicksantos@google.com (Nick Santos)
***REMOVED***

goog.provide('goog.testing.ui.RendererHarness');

goog.require('goog.Disposable');
goog.require('goog.dom.NodeType');
goog.require('goog.testing.asserts');
goog.require('goog.testing.dom');



***REMOVED***
***REMOVED*** A driver for testing renderers.
***REMOVED***
***REMOVED*** @param {goog.ui.ControlRenderer} renderer A renderer to test.
***REMOVED*** @param {Element} renderParent The parent of the element where controls will
***REMOVED***     be rendered.
***REMOVED*** @param {Element} decorateParent The parent of the element where controls will
***REMOVED***     be decorated.
***REMOVED***
***REMOVED*** @extends {goog.Disposable}
***REMOVED***
goog.testing.ui.RendererHarness = function(renderer, renderParent,
    decorateParent) {
  goog.Disposable.call(this);

 ***REMOVED*****REMOVED***
  ***REMOVED*** The renderer under test.
  ***REMOVED*** @type {goog.ui.ControlRenderer}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.renderer_ = renderer;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The parent of the element where controls will be rendered.
  ***REMOVED*** @type {Element}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.renderParent_ = renderParent;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The original HTML of the render element.
  ***REMOVED*** @type {string}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.renderHtml_ = renderParent.innerHTML;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Teh parent of the element where controls will be decorated.
  ***REMOVED*** @type {Element}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.decorateParent_ = decorateParent;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The original HTML of the decorated element.
  ***REMOVED*** @type {string}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.decorateHtml_ = decorateParent.innerHTML;
***REMOVED***
goog.inherits(goog.testing.ui.RendererHarness, goog.Disposable);


***REMOVED***
***REMOVED*** A control to create by decoration.
***REMOVED*** @type {goog.ui.Control}
***REMOVED*** @private
***REMOVED***
goog.testing.ui.RendererHarness.prototype.decorateControl_;


***REMOVED***
***REMOVED*** A control to create by rendering.
***REMOVED*** @type {goog.ui.Control}
***REMOVED*** @private
***REMOVED***
goog.testing.ui.RendererHarness.prototype.renderControl_;


***REMOVED***
***REMOVED*** Whether all the necessary assert methods have been called.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.testing.ui.RendererHarness.prototype.verified_ = false;


***REMOVED***
***REMOVED*** Attach a control and render its DOM.
***REMOVED*** @param {goog.ui.Control} control A control.
***REMOVED*** @return {Element} The element created.
***REMOVED***
goog.testing.ui.RendererHarness.prototype.attachControlAndRender =
    function(control) {
  this.renderControl_ = control;

  control.setRenderer(this.renderer_);
  control.render(this.renderParent_);
  return control.getElement();
***REMOVED***


***REMOVED***
***REMOVED*** Attach a control and decorate the element given in the constructor.
***REMOVED*** @param {goog.ui.Control} control A control.
***REMOVED*** @return {Element} The element created.
***REMOVED***
goog.testing.ui.RendererHarness.prototype.attachControlAndDecorate =
    function(control) {
  this.decorateControl_ = control;

  control.setRenderer(this.renderer_);

  var child = this.decorateParent_.firstChild;
  assertEquals('The decorated node must be an element',
               goog.dom.NodeType.ELEMENT, child.nodeType);
  control.decorate(***REMOVED*** @type {Element}***REMOVED*** (child));
  return control.getElement();
***REMOVED***


***REMOVED***
***REMOVED*** Assert that the rendered element and the decorated element match.
***REMOVED***
goog.testing.ui.RendererHarness.prototype.assertDomMatches = function() {
  assert('Both elements were not generated',
         !!(this.renderControl_ && this.decorateControl_));
  goog.testing.dom.assertHtmlMatches(
      this.renderControl_.getElement().innerHTML,
      this.decorateControl_.getElement().innerHTML);
  this.verified_ = true;
***REMOVED***


***REMOVED***
***REMOVED*** Destroy the harness, verifying that all assertions had been checked.
***REMOVED*** @override
***REMOVED*** @protected
***REMOVED***
goog.testing.ui.RendererHarness.prototype.disposeInternal = function() {
  // If the harness was not verified appropriately, throw an exception.
  assert('Expected assertDomMatches to be called',
         this.verified_ || !this.renderControl_ || !this.decorateControl_);

  if (this.decorateControl_) {
    this.decorateControl_.dispose();
  }
  if (this.renderControl_) {
    this.renderControl_.dispose();
  }

  this.renderParent_.innerHTML = this.renderHtml_;
  this.decorateParent_.innerHTML = this.decorateHtml_;

  goog.testing.ui.RendererHarness.superClass_.disposeInternal.call(this);
***REMOVED***
