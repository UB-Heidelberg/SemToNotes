/**
 * @fileoverview 
 */

goog.provide('xrx.graphic.Action');
goog.provide('xrx.graphic.StylableSet');



goog.require('goog.array');
goog.require('xrx.mvc');
goog.require('xrx.mvc.AbstractAction');



xrx.graphic.Action = function(element) {

  goog.base(this, element);
};
goog.inherits(xrx.graphic.Action, xrx.mvc.AbstractAction);



xrx.graphic.StylableSet = function(element) {

  goog.base(this, element);
};
goog.inherits(xrx.graphic.StylableSet, xrx.graphic.Action);
xrx.mvc.registerComponent('xrx-canvas-stylable-set', xrx.graphic.StylableSet);



xrx.graphic.StylableSet.prototype.execute_ = function(opt_params) {
  var c;
  var drawing;
  var strokeWidth = this.getDatasetParam('xrxStrokeWidth', opt_params);
  var strokeColor = this.getDatasetParam('xrxStrokeColor', opt_params);
  var fillColor = this.getDatasetParam('xrxFillColor', opt_params);
  var fillOpacity = this.getDatasetParam('xrxFillOpacity', opt_params);
  var elements = this.getElementsBySelectAndScope(opt_params) || [];
  goog.array.forEach(elements, function(e, i, a) {
    c = xrx.mvc.getComponent(e.id);
    c.setStrokeWidth(strokeWidth);
    c.setStrokeColor(strokeColor);
    c.setFillColor(fillColor);
    c.setFillOpacity(fillOpacity);
    drawing = c.getCanvas().getDrawing(); //TODO: more than one drawing
  }, this);
  if (drawing) drawing.draw();
}; 
