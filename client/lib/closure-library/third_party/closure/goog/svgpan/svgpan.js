***REMOVED***
***REMOVED***  SVGPan library 1.2.2
***REMOVED*** ======================
***REMOVED***
***REMOVED*** Given an unique existing element with a given id (or by default, the first
***REMOVED*** g-element), including the library into any SVG adds the following
***REMOVED*** capabilities:
***REMOVED***
***REMOVED***  - Mouse panning
***REMOVED***  - Mouse zooming (using the wheel)
***REMOVED***  - Object dragging
***REMOVED***
***REMOVED*** You can configure the behaviour of the pan/zoom/drag via setOptions().
***REMOVED***
***REMOVED*** Known issues:
***REMOVED***
***REMOVED***  - Zooming (while panning) on Safari has still some issues
***REMOVED***
***REMOVED*** Releases:
***REMOVED***
***REMOVED*** 1.2.2, Tue Aug 30 17:21:56 CEST 2011, Andrea Leofreddi
***REMOVED***  - Fixed viewBox on root tag (#7)
***REMOVED***  - Improved zoom speed (#2)
***REMOVED***
***REMOVED*** 1.2.1, Mon Jul  4 00:33:18 CEST 2011, Andrea Leofreddi
***REMOVED***  - Fixed a regression with mouse wheel (now working on Firefox 5)
***REMOVED***  - Working with viewBox attribute (#4)
***REMOVED***  - Added "use strict;" and fixed resulting warnings (#5)
***REMOVED***  - Added configuration variables, dragging is disabled by default (#3)
***REMOVED***
***REMOVED*** 1.2, Sat Mar 20 08:42:50 GMT 2010, Zeng Xiaohui
***REMOVED***  Fixed a bug with browser mouse handler interaction
***REMOVED***
***REMOVED*** 1.1, Wed Feb  3 17:39:33 GMT 2010, Zeng Xiaohui
***REMOVED***  Updated the zoom code to support the mouse wheel on Safari/Chrome
***REMOVED***
***REMOVED*** 1.0, Andrea Leofreddi
***REMOVED***  First release
***REMOVED***

***REMOVED***
***REMOVED*** @license
***REMOVED*** This code is licensed under the following BSD license:
***REMOVED*** Copyright 2009-2010 Andrea Leofreddi <a.leofreddi@itcharm.com>. All rights
***REMOVED*** reserved.
***REMOVED***
***REMOVED*** Redistribution and use in source and binary forms, with or without
***REMOVED*** modification, are permitted provided that the following conditions are met:
***REMOVED***
***REMOVED***    1. Redistributions of source code must retain the above copyright notice,
***REMOVED***       this list of conditions and the following disclaimer.
***REMOVED***
***REMOVED***    2. Redistributions in binary form must reproduce the above copyright
***REMOVED***       notice, this list of conditions and the following disclaimer in the
***REMOVED***       documentation and/or other materials provided with the distribution.
***REMOVED***
***REMOVED*** THIS SOFTWARE IS PROVIDED BY Andrea Leofreddi ``AS IS'' AND ANY EXPRESS OR
***REMOVED*** IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
***REMOVED*** MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO
***REMOVED*** EVENT SHALL Andrea Leofreddi OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT,
***REMOVED*** INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
***REMOVED*** (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
***REMOVED*** LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
***REMOVED*** ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
***REMOVED*** (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
***REMOVED*** THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
***REMOVED***
***REMOVED*** The views and conclusions contained in the software and documentation are
***REMOVED*** those of the authors and should not be interpreted as representing official
***REMOVED*** policies, either expressed or implied, of Andrea Leofreddi.
***REMOVED***
***REMOVED***

goog.provide('svgpan.SvgPan');

goog.require('goog.Disposable');
***REMOVED***
***REMOVED***
goog.require('goog.events.MouseWheelHandler');



***REMOVED***
***REMOVED*** Instantiates an SvgPan object.
***REMOVED*** @param {string=} opt_graphElementId The id of the graph element.
***REMOVED*** @param {Element=} opt_root An optional document root.
***REMOVED***
***REMOVED*** @extends {goog.Disposable}
***REMOVED***
svgpan.SvgPan = function(opt_graphElementId, opt_root) {
  goog.base(this);

 ***REMOVED*****REMOVED*** @private {Element}***REMOVED***
  this.root_ = opt_root || document.documentElement;

 ***REMOVED*****REMOVED*** @private {?string}***REMOVED***
  this.graphElementId_ = opt_graphElementId || null;

 ***REMOVED*****REMOVED*** @private {boolean}***REMOVED***
  this.cancelNextClick_ = false;

 ***REMOVED*****REMOVED*** @private {boolean}***REMOVED***
  this.enablePan_ = true;

 ***REMOVED*****REMOVED*** @private {boolean}***REMOVED***
  this.enableZoom_ = true;

 ***REMOVED*****REMOVED*** @private {boolean}***REMOVED***
  this.enableDrag_ = false;

 ***REMOVED*****REMOVED*** @private {number}***REMOVED***
  this.zoomScale_ = 0.4;

 ***REMOVED*****REMOVED*** @private {svgpan.SvgPan.State}***REMOVED***
  this.state_ = svgpan.SvgPan.State.NONE;

 ***REMOVED*****REMOVED*** @private {Element}***REMOVED***
  this.svgRoot_ = null;

 ***REMOVED*****REMOVED*** @private {Element}***REMOVED***
  this.stateTarget_ = null;

 ***REMOVED*****REMOVED*** @private {Element}***REMOVED***
  this.stateOrigin_ = null;

 ***REMOVED*****REMOVED*** @private {SVGMatrix}***REMOVED***
  this.stateTf_ = null;

 ***REMOVED*****REMOVED*** @private {goog.events.MouseWheelHandler}***REMOVED***
  this.mouseWheelHandler_ = null;

  this.setupHandlers_();
***REMOVED***
goog.inherits(svgpan.SvgPan, goog.Disposable);


***REMOVED*** @override***REMOVED***
svgpan.SvgPan.prototype.disposeInternal = function() {
  goog.base(this, 'disposeInternal');
  goog.events.removeAll(this.root_);
  this.mouseWheelHandler_.dispose();
***REMOVED***


***REMOVED***
***REMOVED*** @enum {string}
***REMOVED***
svgpan.SvgPan.State = {
  NONE: 'none',
  PAN: 'pan',
  DRAG: 'drag'
***REMOVED***


***REMOVED***
***REMOVED*** Enables/disables panning the entire SVG (default = true).
***REMOVED*** @param {boolean} enabled Whether or not to allow panning.
***REMOVED***
svgpan.SvgPan.prototype.setPanEnabled = function(enabled) {
  this.enablePan_ = enabled;
***REMOVED***


***REMOVED***
***REMOVED*** Enables/disables zooming (default = true).
***REMOVED*** @param {boolean} enabled Whether or not to allow zooming (default = true).
***REMOVED***
svgpan.SvgPan.prototype.setZoomEnabled = function(enabled) {
  this.enableZoom_ = enabled;
***REMOVED***


***REMOVED***
***REMOVED*** Enables/disables dragging individual SVG objects (default = false).
***REMOVED*** @param {boolean} enabled Whether or not to allow dragging of objects.
***REMOVED***
svgpan.SvgPan.prototype.setDragEnabled = function(enabled) {
  this.enableDrag_ = enabled;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the sensitivity of mousewheel zooming (default = 0.4).
***REMOVED*** @param {number} scale The new zoom scale.
***REMOVED***
svgpan.SvgPan.prototype.setZoomScale = function(scale) {
  this.zoomScale_ = scale;
***REMOVED***


***REMOVED***
***REMOVED*** Registers mouse event handlers.
***REMOVED*** @private
***REMOVED***
svgpan.SvgPan.prototype.setupHandlers_ = function() {
***REMOVED***this.root_, goog.events.EventType.CLICK,
      goog.bind(this.handleMouseClick_, this));
***REMOVED***this.root_, goog.events.EventType.MOUSEUP,
      goog.bind(this.handleMouseUp_, this));
***REMOVED***this.root_, goog.events.EventType.MOUSEDOWN,
      goog.bind(this.handleMouseDown_, this));
***REMOVED***this.root_, goog.events.EventType.MOUSEMOVE,
      goog.bind(this.handleMouseMove_, this));
  this.mouseWheelHandler_ = new goog.events.MouseWheelHandler(this.root_);
***REMOVED***this.mouseWheelHandler_,
      goog.events.MouseWheelHandler.EventType.MOUSEWHEEL,
      goog.bind(this.handleMouseWheel_, this));
***REMOVED***


***REMOVED***
***REMOVED*** Retrieves the root element for SVG manipulation. The element is then cached.
***REMOVED*** @param {Document} svgDoc The document.
***REMOVED*** @return {Element} The svg root.
***REMOVED*** @private
***REMOVED***
svgpan.SvgPan.prototype.getRoot_ = function(svgDoc) {
  if (!this.svgRoot_) {
    var r = this.graphElementId_ ?
        svgDoc.getElementById(this.graphElementId_) : svgDoc.documentElement;
    var t = r;
    while (t != svgDoc) {
      if (t.getAttribute('viewBox')) {
        this.setCtm_(r, r.getCTM());
        t.removeAttribute('viewBox');
      }
      t = t.parentNode;
    }
    this.svgRoot_ = r;
  }
  return this.svgRoot_;
***REMOVED***


***REMOVED***
***REMOVED*** Instantiates an SVGPoint object with given event coordinates.
***REMOVED*** @param {!goog.events.Event} evt The event with coordinates.
***REMOVED*** @return {SVGPoint} The created point.
***REMOVED*** @private
***REMOVED***
svgpan.SvgPan.prototype.getEventPoint_ = function(evt) {
  return this.newPoint_(evt.clientX, evt.clientY);
***REMOVED***


***REMOVED***
***REMOVED*** Instantiates an SVGPoint object with given coordinates.
***REMOVED*** @param {number} x The x coordinate.
***REMOVED*** @param {number} y The y coordinate.
***REMOVED*** @return {SVGPoint} The created point.
***REMOVED*** @private
***REMOVED***
svgpan.SvgPan.prototype.newPoint_ = function(x, y) {
  var p = this.root_.createSVGPoint();
  p.x = x;
  p.y = y;
  return p;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the current transform matrix of an element.
***REMOVED*** @param {Element} element The element.
***REMOVED*** @param {SVGMatrix} matrix The transform matrix.
***REMOVED*** @private
***REMOVED***
svgpan.SvgPan.prototype.setCtm_ = function(element, matrix) {
  var s = 'matrix(' + matrix.a + ',' + matrix.b + ',' + matrix.c + ',' +
      matrix.d + ',' + matrix.e + ',' + matrix.f + ')';
  element.setAttribute('transform', s);
***REMOVED***


***REMOVED***
***REMOVED*** Handle mouse wheel event.
***REMOVED*** @param {!goog.events.Event} evt The event.
***REMOVED*** @private
***REMOVED***
svgpan.SvgPan.prototype.handleMouseWheel_ = function(evt) {
  if (!this.enableZoom_)
    return;

  // Prevents scrolling.
  evt.preventDefault();

  var svgDoc = evt.target.ownerDocument;

  var delta = evt.deltaY / -9;
  var z = Math.pow(1 + this.zoomScale_, delta);
  var g = this.getRoot_(svgDoc);
  var p = this.getEventPoint_(evt);
  p = p.matrixTransform(g.getCTM().inverse());

  // Compute new scale matrix in current mouse position
  var k = this.root_.createSVGMatrix().translate(
      p.x, p.y).scale(z).translate(-p.x, -p.y);
  this.setCtm_(g, g.getCTM().multiply(k));

  if (typeof(this.stateTf_) == 'undefined') {
    this.stateTf_ = g.getCTM().inverse();
  }
  this.stateTf_ =
      this.stateTf_ ? this.stateTf_.multiply(k.inverse()) : this.stateTf_;
***REMOVED***


***REMOVED***
***REMOVED*** Handle mouse move event.
***REMOVED*** @param {!goog.events.Event} evt The event.
***REMOVED*** @private
***REMOVED***
svgpan.SvgPan.prototype.handleMouseMove_ = function(evt) {
  if (evt.button != 0) {
    return;
  }
  this.handleMove(evt.clientX, evt.clientY, evt.target.ownerDocument);
***REMOVED***


***REMOVED***
***REMOVED*** Handles mouse motion for the given coordinates.
***REMOVED*** @param {number} x The x coordinate.
***REMOVED*** @param {number} y The y coordinate.
***REMOVED*** @param {Element} svgDoc The svg document.
***REMOVED***
svgpan.SvgPan.prototype.handleMove = function(x, y, svgDoc) {
  var g = this.getRoot_(svgDoc);
  if (this.state_ == svgpan.SvgPan.State.PAN && this.enablePan_) {
    // Pan mode
    var p = this.newPoint_(x, y).matrixTransform(this.stateTf_);
    this.setCtm_(g, this.stateTf_.inverse().translate(
        p.x - this.stateOrigin_.x, p.y - this.stateOrigin_.y));
    this.cancelNextClick_ = true;
  } else if (this.state_ == svgpan.SvgPan.State.DRAG && this.enableDrag_) {
    // Drag mode
    var p = this.newPoint_(x, y).matrixTransform(g.getCTM().inverse());
    this.setCtm_(this.stateTarget_, this.root_.createSVGMatrix().translate(
        p.x - this.stateOrigin_.x, p.y - this.stateOrigin_.y).multiply(
        g.getCTM().inverse()).multiply(this.stateTarget_.getCTM()));
    this.stateOrigin_ = p;
  }
***REMOVED***


***REMOVED***
***REMOVED*** Handle click event.
***REMOVED*** @param {!goog.events.Event} evt The event.
***REMOVED*** @private
***REMOVED***
svgpan.SvgPan.prototype.handleMouseDown_ = function(evt) {
  if (evt.button != 0) {
    return;
  }
  // Prevent selection while dragging.
  evt.preventDefault();
  var svgDoc = evt.target.ownerDocument;

  var g = this.getRoot_(svgDoc);

  if (evt.target.tagName == 'svg' || !this.enableDrag_) {
    // Pan mode
    this.state_ = svgpan.SvgPan.State.PAN;
    this.stateTf_ = g.getCTM().inverse();
    this.stateOrigin_ = this.getEventPoint_(evt).matrixTransform(this.stateTf_);
  } else {
    // Drag mode
    this.state_ = svgpan.SvgPan.State.DRAG;
    this.stateTarget_ = evt.target;
    this.stateTf_ = g.getCTM().inverse();
    this.stateOrigin_ = this.getEventPoint_(evt).matrixTransform(this.stateTf_);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Handle mouse button release event.
***REMOVED*** @param {!goog.events.Event} evt The event.
***REMOVED*** @private
***REMOVED***
svgpan.SvgPan.prototype.handleMouseUp_ = function(evt) {
  if (this.state_ != svgpan.SvgPan.State.NONE) {
    this.endPanOrDrag();
  }
***REMOVED***


***REMOVED***
***REMOVED*** Ends pan/drag mode.
***REMOVED***
svgpan.SvgPan.prototype.endPanOrDrag = function() {
  if (this.state_ != svgpan.SvgPan.State.NONE) {
    this.state_ = svgpan.SvgPan.State.NONE;
  }
***REMOVED***


***REMOVED***
***REMOVED*** Handle mouse clicks.
***REMOVED*** @param {!goog.events.Event} evt The event.
***REMOVED*** @private
***REMOVED***
svgpan.SvgPan.prototype.handleMouseClick_ = function(evt) {
  // We only set cancelNextClick_ after panning occurred, and use it to prevent
  // the default action that would otherwise take place when clicking on the
  // element (for instance, navigation on clickable links, but also any click
  // handler that may be set on an SVG element, in the case of active SVG
  // content)
  if (this.cancelNextClick_) {
    // Cancel potential click handler on active SVG content.
    evt.stopPropagation();
    // Cancel navigation when panning on clickable links.
    evt.preventDefault();
  }
  this.cancelNextClick_ = false;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the current state.
***REMOVED*** @return {!svgpan.SvgPan.State}
***REMOVED***
svgpan.SvgPan.prototype.getState = function() {
  return this.state_;
***REMOVED***
