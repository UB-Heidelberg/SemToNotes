/**
 * @fileoverview A class offering tool-bar items for a drawing canvas.
 */

goog.provide('xrx.widget.CanvasToolbarItem');
goog.provide('xrx.widget.CanvasToolbarItemView');
goog.provide('xrx.widget.CanvasToolbarItemZoomIn');
goog.provide('xrx.widget.CanvasToolbarItemZoomOut');
goog.provide('xrx.widget.CanvasToolbarItemRotateLeft');
goog.provide('xrx.widget.CanvasToolbarItemRotateRight');
goog.provide('xrx.widget.CanvasToolbarItemCreate');
goog.provide('xrx.widget.CanvasToolbarItemModify');
goog.provide('xrx.widget.CanvasToolbarItemDelete');



goog.require('goog.dom.DomHelper');
goog.require('goog.dom.classes');
goog.require('goog.dom.dataset');
goog.require('xrx.mvc');
goog.require('xrx.mvc.ComponentView');
goog.require('xrx.widget.CanvasToolbar');



xrx.widget.CanvasToolbarItem = function(element) {

  goog.base(this, element);

  this.registerEvents_();
};
goog.inherits(xrx.widget.CanvasToolbarItem, xrx.mvc.ComponentView);



xrx.widget.CanvasToolbarItem.prototype.getToolbar = function() {
  var toolbarDiv = goog.dom.getAncestorByClass(this.element_, 'xrx-widget-canvas-toolbar');
  var toolbarComponent = xrx.mvc.getComponent(toolbarDiv.id);
  return toolbarComponent ? toolbarComponent : new xrx.widget.CanvasToolbar(toolbarDiv);
};



xrx.widget.CanvasToolbarItem.prototype.getNode = function() {
  return undefined;
};



xrx.widget.CanvasToolbarItem.prototype.mvcRefresh = function() {
};



xrx.widget.CanvasToolbarItem.prototype.handleMouseOver = function() {
  goog.dom.classes.add(this.element_, 'xrx-ui-state-mouseover');
};



xrx.widget.CanvasToolbarItem.prototype.handleMouseOut = function() {
  goog.dom.classes.remove(this.element_, 'xrx-ui-state-mouseover');
};



xrx.widget.CanvasToolbarItem.prototype.registerEvents_ = function() {
  goog.events.listen(this.element_, goog.events.EventType.MOUSEOVER,
      function(e) {
        e.preventDefault();
        this.handleMouseOver(e);
  }, false, this);
  goog.events.listen(this.element_, goog.events.EventType.MOUSEOUT,
      function(e) {
        e.preventDefault();
        this.handleMouseOut(e);
  }, false, this);
};



/**
 * @constructor
 */
xrx.widget.CanvasToolbarClickItem = function(element) {

  goog.base(this, element);

  this.registerClickEvents_();
};
goog.inherits(xrx.widget.CanvasToolbarClickItem, xrx.widget.CanvasToolbarItem);



xrx.widget.CanvasToolbarClickItem.prototype.registerClickEvents_ = function() {
  goog.events.listen(this.element_, goog.events.EventType.MOUSEDOWN, function(e) {
    e.preventDefault();
    this.handleClick();
  }, false, this);
};



/**
 * @constructor
 */
xrx.widget.CanvasToolbarToggleItem = function(element) {

  goog.base(this, element);

  this.registerToggleEvents_();
};
goog.inherits(xrx.widget.CanvasToolbarToggleItem, xrx.widget.CanvasToolbarItem);



xrx.widget.CanvasToolbarToggleItem.prototype.handleToggle_ = function() {
  this.getToolbar().setSelected(this);
};



xrx.widget.CanvasToolbarToggleItem.prototype.registerToggleEvents_ = function() {
  goog.events.listen(this.element_, goog.events.EventType.MOUSEDOWN, function(e) {
    e.preventDefault();
    this.handleToggle_();
    this.handleToggle();
  }, false, this);
};



/**
 * @constructor
 */
xrx.widget.CanvasToolbarItemView = function(element) {

  goog.base(this, element);
};
goog.inherits(xrx.widget.CanvasToolbarItemView, xrx.widget.CanvasToolbarToggleItem);
xrx.mvc.registerComponent('xrx-widget-canvas-toolbar-item-view', xrx.widget.CanvasToolbarItemView);



xrx.widget.CanvasToolbarItem.prototype.handleToggle = function() {
  var drawing = this.getToolbar().getCanvas().getDrawing();
  drawing.setModeView();  
};



xrx.widget.CanvasToolbarItem.prototype.createDom = function() {
  if (!this.element_.hasAttribute('title'))
      this.element_.setAttribute('title', 'Zoom, Pan or Rotate the Canvas.');
  this.handleToggle_();
  this.handleToggle();
};



/**
 * @constructor
 */
xrx.widget.CanvasToolbarItemZoomIn = function(element) {

  goog.base(this, element);
};
goog.inherits(xrx.widget.CanvasToolbarItemZoomIn, xrx.widget.CanvasToolbarClickItem);
xrx.mvc.registerComponent('xrx-widget-canvas-toolbar-item-zoom-in', xrx.widget.CanvasToolbarItemZoomIn);



xrx.widget.CanvasToolbarItemZoomIn.prototype.handleClick = function() {
  var drawing = this.getToolbar().getCanvas().getDrawing();
  drawing.getViewbox().zoomIn();
  drawing.draw();
};



xrx.widget.CanvasToolbarItemZoomIn.prototype.createDom = function() {
  if (!this.element_.hasAttribute('title'))
      this.element_.setAttribute('title', 'Zoom In.'); 
};



/**
 * @constructor
 */
xrx.widget.CanvasToolbarItemZoomOut = function(element) {

  goog.base(this, element);
};
goog.inherits(xrx.widget.CanvasToolbarItemZoomOut, xrx.widget.CanvasToolbarClickItem);
xrx.mvc.registerComponent('xrx-widget-canvas-toolbar-item-zoom-out', xrx.widget.CanvasToolbarItemZoomOut);



xrx.widget.CanvasToolbarItemZoomOut.prototype.handleClick = function() {
  var drawing = this.getToolbar().getCanvas().getDrawing();
  drawing.getViewbox().zoomOut();
  drawing.draw();
};



xrx.widget.CanvasToolbarItemZoomOut.prototype.createDom = function() {
  if (!this.element_.hasAttribute('title'))
      this.element_.setAttribute('title', 'Zoom Out.');
};



/**
 * @constructor
 */
xrx.widget.CanvasToolbarItemRotateLeft = function(element) {

  goog.base(this, element);
};
goog.inherits(xrx.widget.CanvasToolbarItemRotateLeft, xrx.widget.CanvasToolbarClickItem);
xrx.mvc.registerComponent('xrx-widget-canvas-toolbar-item-rotate-left', xrx.widget.CanvasToolbarItemRotateLeft);



xrx.widget.CanvasToolbarItemRotateLeft.prototype.handleClick = function() {
  var drawing = this.getToolbar().getCanvas().getDrawing();
  drawing.getViewbox().rotateLeft();
  drawing.draw();
};



xrx.widget.CanvasToolbarItemRotateLeft.prototype.createDom = function() {
  if (!this.element_.hasAttribute('title'))
      this.element_.setAttribute('title', 'Rotate left.');
};



/**
 * @constructor
 */
xrx.widget.CanvasToolbarItemRotateRight = function(element) {

  goog.base(this, element);
};
goog.inherits(xrx.widget.CanvasToolbarItemRotateRight, xrx.widget.CanvasToolbarClickItem);
xrx.mvc.registerComponent('xrx-widget-canvas-toolbar-item-rotate-right', xrx.widget.CanvasToolbarItemRotateRight);



xrx.widget.CanvasToolbarItemRotateRight.prototype.handleClick = function() {
  var drawing = this.getToolbar().getCanvas().getDrawing();
  drawing.getViewbox().rotateRight();
  drawing.draw();
};



xrx.widget.CanvasToolbarItemRotateRight.prototype.createDom = function() {
  if (!this.element_.hasAttribute('title'))
      this.element_.setAttribute('title', 'Rotate right.');
};



/**
 * @constructor
 */
xrx.widget.CanvasToolbarItemCreate = function(element) {

  goog.base(this, element);

  this.graphicsName_;
};
goog.inherits(xrx.widget.CanvasToolbarItemCreate, xrx.widget.CanvasToolbarToggleItem);
xrx.mvc.registerComponent('xrx-widget-canvas-toolbar-item-create', xrx.widget.CanvasToolbarItemCreate);



xrx.widget.CanvasToolbarItemCreate.prototype.handleToggle = function() {
  var canvas = this.getToolbar().getCanvas();
  canvas.setNameShapeCreate(this.graphicsName_);
  canvas.getDrawing().setModeCreate(canvas.getActiveGroup().getShapeCreate().getShape());
};



xrx.widget.CanvasToolbarItemCreate.prototype.createDom = function() {
  if (!this.element_.hasAttribute('title'))
      this.element_.setAttribute('title', 'Draw.');
  this.graphicsName_ = goog.dom.dataset.get(this.element_, 'xrxGraphicsName');
};



/**
 * @constructor
 */
xrx.widget.CanvasToolbarItemModify = function(element) {

  goog.base(this, element);
};
goog.inherits(xrx.widget.CanvasToolbarItemModify, xrx.widget.CanvasToolbarToggleItem);
xrx.mvc.registerComponent('xrx-widget-canvas-toolbar-item-modify', xrx.widget.CanvasToolbarItemModify);



xrx.widget.CanvasToolbarItemModify.prototype.handleToggle = function() {
  var drawing = this.getToolbar().getCanvas().getDrawing();
  drawing.setModeModify();
};



xrx.widget.CanvasToolbarItemModify.prototype.createDom = function() {
  if (!this.element_.hasAttribute('title'))
      this.element_.setAttribute('title', 'Move or Modify a Shape.');
};



/**
 * @constructor
 */
xrx.widget.CanvasToolbarItemDelete = function(element) {

  goog.base(this, element);
};
goog.inherits(xrx.widget.CanvasToolbarItemDelete, xrx.widget.CanvasToolbarToggleItem);
xrx.mvc.registerComponent('xrx-widget-canvas-toolbar-item-delete', xrx.widget.CanvasToolbarItemDelete);



xrx.widget.CanvasToolbarItemDelete.prototype.handleToggle = function() {
  var drawing = this.getToolbar().getCanvas().getDrawing();
  drawing.setModeDelete();
};



xrx.widget.CanvasToolbarItemDelete.prototype.createDom = function() {
  if (!this.element_.hasAttribute('title'))
      this.element_.setAttribute('title', 'Delete a Shape.');
};
