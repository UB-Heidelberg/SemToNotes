***REMOVED***
***REMOVED*** @fileoverview A class offering tool-bar items for a drawing canvas.
***REMOVED***

goog.provide('xrx.widget.CanvasToolbarItem');
goog.provide('xrx.widget.CanvasToolbarItemView');
goog.provide('xrx.widget.CanvasToolbarItemZoomIn');
goog.provide('xrx.widget.CanvasToolbarItemZoomOut');
goog.provide('xrx.widget.CanvasToolbarItemRotateLeft');
goog.provide('xrx.widget.CanvasToolbarItemRotateRight');
goog.provide('xrx.widget.CanvasToolbarItemCreate');
goog.provide('xrx.widget.CanvasToolbarItemModify');
goog.provide('xrx.widget.CanvasToolbarItemDelete');



***REMOVED***
goog.require('goog.dom.classes');
goog.require('goog.dom.dataset');
goog.require('xrx.mvc');
goog.require('xrx.mvc.ComponentView');
goog.require('xrx.widget.CanvasToolbar');



xrx.widget.CanvasToolbarItem = function(element) {

***REMOVED***

  this.registerEvents_();
***REMOVED***
goog.inherits(xrx.widget.CanvasToolbarItem, xrx.mvc.ComponentView);



xrx.widget.CanvasToolbarItem.prototype.getToolbar = function() {
  var toolbarDiv = goog.dom.getAncestorByClass(this.element_, 'xrx-widget-canvas-toolbar');
  var toolbarComponent = xrx.mvc.getComponent(toolbarDiv.id);
  return toolbarComponent ? toolbarComponent : new xrx.widget.CanvasToolbar(toolbarDiv);
***REMOVED***



xrx.widget.CanvasToolbarItem.prototype.getNode = function() {
  return undefined;
***REMOVED***



xrx.widget.CanvasToolbarItem.prototype.mvcRefresh = function() {
***REMOVED***



xrx.widget.CanvasToolbarItem.prototype.handleMouseOver = function() {
  goog.dom.classes.add(this.element_, 'xrx-ui-state-mouseover');
***REMOVED***



xrx.widget.CanvasToolbarItem.prototype.handleMouseOut = function() {
  goog.dom.classes.remove(this.element_, 'xrx-ui-state-mouseover');
***REMOVED***



xrx.widget.CanvasToolbarItem.prototype.registerEvents_ = function() {
***REMOVED***this.element_, goog.events.EventType.MOUSEOVER,
      function(e) {
        e.preventDefault();
        this.handleMouseOver(e);
  }, false, this);
***REMOVED***this.element_, goog.events.EventType.MOUSEOUT,
      function(e) {
        e.preventDefault();
        this.handleMouseOut(e);
  }, false, this);
***REMOVED***



***REMOVED***
***REMOVED***
***REMOVED***
xrx.widget.CanvasToolbarClickItem = function(element) {

***REMOVED***

  this.registerClickEvents_();
***REMOVED***
goog.inherits(xrx.widget.CanvasToolbarClickItem, xrx.widget.CanvasToolbarItem);



xrx.widget.CanvasToolbarClickItem.prototype.registerClickEvents_ = function() {
***REMOVED***this.element_, goog.events.EventType.MOUSEDOWN, function(e) {
    e.preventDefault();
    this.handleClick();
  }, false, this);
***REMOVED***



***REMOVED***
***REMOVED***
***REMOVED***
xrx.widget.CanvasToolbarToggleItem = function(element) {

***REMOVED***

  this.registerToggleEvents_();
***REMOVED***
goog.inherits(xrx.widget.CanvasToolbarToggleItem, xrx.widget.CanvasToolbarItem);



xrx.widget.CanvasToolbarToggleItem.prototype.handleToggle_ = function() {
  this.getToolbar().setSelected(this);
***REMOVED***



xrx.widget.CanvasToolbarToggleItem.prototype.registerToggleEvents_ = function() {
***REMOVED***this.element_, goog.events.EventType.MOUSEDOWN, function(e) {
    e.preventDefault();
    this.handleToggle_();
    this.handleToggle();
  }, false, this);
***REMOVED***



***REMOVED***
***REMOVED***
***REMOVED***
xrx.widget.CanvasToolbarItemView = function(element) {

***REMOVED***
***REMOVED***
goog.inherits(xrx.widget.CanvasToolbarItemView, xrx.widget.CanvasToolbarToggleItem);
xrx.mvc.registerComponent('xrx-widget-canvas-toolbar-item-view', xrx.widget.CanvasToolbarItemView);



xrx.widget.CanvasToolbarItem.prototype.handleToggle = function() {
  var drawing = this.getToolbar().getCanvas().getDrawing();
  drawing.setModeView();  
***REMOVED***



xrx.widget.CanvasToolbarItem.prototype.createDom = function() {
  if (!this.element_.hasAttribute('title'))
      this.element_.setAttribute('title', 'Zoom, Pan or Rotate the Canvas.');
  this.handleToggle_();
  this.handleToggle();
***REMOVED***



***REMOVED***
***REMOVED***
***REMOVED***
xrx.widget.CanvasToolbarItemZoomIn = function(element) {

***REMOVED***
***REMOVED***
goog.inherits(xrx.widget.CanvasToolbarItemZoomIn, xrx.widget.CanvasToolbarClickItem);
xrx.mvc.registerComponent('xrx-widget-canvas-toolbar-item-zoom-in', xrx.widget.CanvasToolbarItemZoomIn);



xrx.widget.CanvasToolbarItemZoomIn.prototype.handleClick = function() {
  var drawing = this.getToolbar().getCanvas().getDrawing();
  drawing.getViewbox().zoomIn();
  drawing.draw();
***REMOVED***



xrx.widget.CanvasToolbarItemZoomIn.prototype.createDom = function() {
  if (!this.element_.hasAttribute('title'))
      this.element_.setAttribute('title', 'Zoom In.'); 
***REMOVED***



***REMOVED***
***REMOVED***
***REMOVED***
xrx.widget.CanvasToolbarItemZoomOut = function(element) {

***REMOVED***
***REMOVED***
goog.inherits(xrx.widget.CanvasToolbarItemZoomOut, xrx.widget.CanvasToolbarClickItem);
xrx.mvc.registerComponent('xrx-widget-canvas-toolbar-item-zoom-out', xrx.widget.CanvasToolbarItemZoomOut);



xrx.widget.CanvasToolbarItemZoomOut.prototype.handleClick = function() {
  var drawing = this.getToolbar().getCanvas().getDrawing();
  drawing.getViewbox().zoomOut();
  drawing.draw();
***REMOVED***



xrx.widget.CanvasToolbarItemZoomOut.prototype.createDom = function() {
  if (!this.element_.hasAttribute('title'))
      this.element_.setAttribute('title', 'Zoom Out.');
***REMOVED***



***REMOVED***
***REMOVED***
***REMOVED***
xrx.widget.CanvasToolbarItemRotateLeft = function(element) {

***REMOVED***
***REMOVED***
goog.inherits(xrx.widget.CanvasToolbarItemRotateLeft, xrx.widget.CanvasToolbarClickItem);
xrx.mvc.registerComponent('xrx-widget-canvas-toolbar-item-rotate-left', xrx.widget.CanvasToolbarItemRotateLeft);



xrx.widget.CanvasToolbarItemRotateLeft.prototype.handleClick = function() {
  var drawing = this.getToolbar().getCanvas().getDrawing();
  drawing.getViewbox().rotateLeft();
  drawing.draw();
***REMOVED***



xrx.widget.CanvasToolbarItemRotateLeft.prototype.createDom = function() {
  if (!this.element_.hasAttribute('title'))
      this.element_.setAttribute('title', 'Rotate left.');
***REMOVED***



***REMOVED***
***REMOVED***
***REMOVED***
xrx.widget.CanvasToolbarItemRotateRight = function(element) {

***REMOVED***
***REMOVED***
goog.inherits(xrx.widget.CanvasToolbarItemRotateRight, xrx.widget.CanvasToolbarClickItem);
xrx.mvc.registerComponent('xrx-widget-canvas-toolbar-item-rotate-right', xrx.widget.CanvasToolbarItemRotateRight);



xrx.widget.CanvasToolbarItemRotateRight.prototype.handleClick = function() {
  var drawing = this.getToolbar().getCanvas().getDrawing();
  drawing.getViewbox().rotateRight();
  drawing.draw();
***REMOVED***



xrx.widget.CanvasToolbarItemRotateRight.prototype.createDom = function() {
  if (!this.element_.hasAttribute('title'))
      this.element_.setAttribute('title', 'Rotate right.');
***REMOVED***



***REMOVED***
***REMOVED***
***REMOVED***
xrx.widget.CanvasToolbarItemCreate = function(element) {

***REMOVED***

  this.graphicsName_;
***REMOVED***
goog.inherits(xrx.widget.CanvasToolbarItemCreate, xrx.widget.CanvasToolbarToggleItem);
xrx.mvc.registerComponent('xrx-widget-canvas-toolbar-item-create', xrx.widget.CanvasToolbarItemCreate);



xrx.widget.CanvasToolbarItemCreate.prototype.handleToggle = function() {
  var canvas = this.getToolbar().getCanvas();
  canvas.setNameShapeCreate(this.graphicsName_);
  canvas.getDrawing().setModeCreate(canvas.getWidgetShapeCreate().getShape());
***REMOVED***



xrx.widget.CanvasToolbarItemCreate.prototype.createDom = function() {
  if (!this.element_.hasAttribute('title'))
      this.element_.setAttribute('title', 'Draw.');
  this.graphicsName_ = goog.dom.dataset.get(this.element_, 'xrxGraphicsName');
***REMOVED***



***REMOVED***
***REMOVED***
***REMOVED***
xrx.widget.CanvasToolbarItemModify = function(element) {

***REMOVED***
***REMOVED***
goog.inherits(xrx.widget.CanvasToolbarItemModify, xrx.widget.CanvasToolbarToggleItem);
xrx.mvc.registerComponent('xrx-widget-canvas-toolbar-item-modify', xrx.widget.CanvasToolbarItemModify);



xrx.widget.CanvasToolbarItemModify.prototype.handleToggle = function() {
  var drawing = this.getToolbar().getCanvas().getDrawing();
  drawing.setModeModify();
***REMOVED***



xrx.widget.CanvasToolbarItemModify.prototype.createDom = function() {
  if (!this.element_.hasAttribute('title'))
      this.element_.setAttribute('title', 'Move or Modify a Shape.');
***REMOVED***



***REMOVED***
***REMOVED***
***REMOVED***
xrx.widget.CanvasToolbarItemDelete = function(element) {

***REMOVED***
***REMOVED***
goog.inherits(xrx.widget.CanvasToolbarItemDelete, xrx.widget.CanvasToolbarToggleItem);
xrx.mvc.registerComponent('xrx-widget-canvas-toolbar-item-delete', xrx.widget.CanvasToolbarItemDelete);



xrx.widget.CanvasToolbarItemDelete.prototype.handleToggle = function() {
  var drawing = this.getToolbar().getCanvas().getDrawing();
  drawing.setModeDelete();
***REMOVED***



xrx.widget.CanvasToolbarItemDelete.prototype.createDom = function() {
  if (!this.element_.hasAttribute('title'))
      this.element_.setAttribute('title', 'Delete a Shape.');
***REMOVED***
