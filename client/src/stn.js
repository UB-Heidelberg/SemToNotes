/**
 * @fileoverview The SemToNotes main class.
 */

goog.provide('xrx.stn');



goog.require('goog.dom.DomHelper');
goog.require('xrx');
goog.require('xrx.graphics.Engine');
goog.require('xrx.drawing.Drawing');
goog.require('xrx.drawing.Toolbar');
goog.require('xrx.drawing.Mode');
goog.require('xrx.shape.Shape');



xrx.stn.install = function() {
  var url = '../data/SachsenspiegelHeidelberg/Bilder-34572-28186-1600.jpg';

  // install a drawing canvas with SVG rendering
  var canvasSVG = goog.dom.getElement('canvasSVG');
  var toolbarSVG = goog.dom.getElement('toolbarSVG');
  var drawingSVG = new xrx.drawing.Drawing(canvasSVG, xrx.graphics.Engine.SVG);
  new xrx.drawing.Toolbar(toolbarSVG, drawingSVG);
  drawingSVG.setBackgroundImage(url, function() { drawingSVG.setModePan(); });
  var rect = xrx.shape.Rect.create(drawingSVG);
  rect.setCoords([[10,10],[10,30],[30,30],[30,10]]);
  drawingSVG.getLayerShape().addShapes(rect);
  drawingSVG.draw();

  // install a drawing canvas with HTML5 Canvas rendering
  var canvasCanvas = goog.dom.getElement('canvasCanvas');
  var toolbarCanvas = goog.dom.getElement('toolbarCanvas');
  var drawingCanvas = new xrx.drawing.Drawing(canvasCanvas, xrx.graphics.Engine.CANVAS);
  new xrx.drawing.Toolbar(toolbarCanvas, drawingCanvas);
  drawingCanvas.setBackgroundImage(url, function() { drawingCanvas.setModePan(); });

  return true;
};



goog.exportSymbol('xrx.stn.install', xrx.stn.install);
 