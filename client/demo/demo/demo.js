/**
 * @fileoverview Demo applications.
 */

goog.provide('demo');
goog.provide('demo.renderingCanvas');
goog.provide('demo.renderingSVG');
goog.provide('demo.renderingVML');



goog.require('goog.dom.DomHelper');
goog.require('xrx');
goog.require('xrx.drawing.Drawing');
goog.require('xrx.drawing.Toolbar');



demo.rendering = function(engine) {
  var url = './data/SachsenspiegelHeidelberg/Bilder-34572-28186-1600.jpg';
  var canvas = goog.dom.getElement('canvas');
  var toolbar = goog.dom.getElement('toolbar');
  var drawing = new xrx.drawing.Drawing(canvas, engine);
  if (drawing.getEngine().isAvailable()) { 
    new xrx.drawing.Toolbar(toolbar, drawing);
    drawing.setBackgroundImage(url, function() {
      drawing.setModeView();
    });
  }
};



demo.renderingCanvas.install = function() {
  demo.rendering(xrx.engine.CANVAS);
  return true;
};



demo.renderingSVG.install = function() {
  demo.rendering(xrx.engine.SVG);
  return true;
};



demo.renderingVML.install = function() {
  demo.rendering(xrx.engine.VML);
  return true;
};



goog.exportSymbol('demo.renderingCanvas.install', demo.renderingCanvas.install);
goog.exportSymbol('demo.renderingSVG.install', demo.renderingSVG.install);
goog.exportSymbol('demo.renderingVML.install', demo.renderingVML.install);
 