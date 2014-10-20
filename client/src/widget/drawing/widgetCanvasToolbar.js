***REMOVED***
***REMOVED*** @fileoverview A class offering a tool-bar for a drawing canvas.
***REMOVED***

goog.provide('xrx.widget.CanvasToolbar');



goog.require('goog.dom.classes');
goog.require('xrx.mvc');
goog.require('xrx.mvc.ComponentView');
goog.require('xrx.widget.Canvas');



***REMOVED***
***REMOVED***
***REMOVED***
xrx.widget.CanvasToolbar = function(element) {

  this.selected_;

***REMOVED***
***REMOVED***
goog.inherits(xrx.widget.CanvasToolbar, xrx.mvc.ComponentView);
xrx.mvc.registerComponent('xrx-widget-canvas-toolbar', xrx.widget.CanvasToolbar);



xrx.widget.CanvasToolbar.prototype.getCanvas = function() {
  var canvasDiv = goog.dom.getAncestorByClass(this.element_, 'xrx-widget-canvas');
  var canvasComponent = xrx.mvc.getComponent(canvasDiv.id);
  return canvasComponent ? canvasComponent : new xrx.widget.Canvas(canvasDiv);
***REMOVED***



xrx.widget.CanvasToolbar.prototype.setSelected = function(toolbarItem) {
  if (this.selected_) goog.dom.classes.remove(this.selected_.getElement(),
      'xrx-ui-state-selected');
  this.selected_ = toolbarItem;
  goog.dom.classes.add(toolbarItem.getElement(), 'xrx-ui-state-selected');
***REMOVED***



xrx.widget.CanvasToolbar.prototype.getNode = function() {
  return undefined;
***REMOVED***



xrx.widget.CanvasToolbar.prototype.mvcRefresh = function() {
***REMOVED***



xrx.widget.CanvasToolbar.prototype.createDom = function() {
***REMOVED***
