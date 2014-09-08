/**
 * @fileoverview The SemToNotes main class.
 */

goog.provide('SemToNotes');



goog.require('goog.dom.DomHelper');
goog.require('xrx.graphics.Engine');
goog.require('xrx.drawing.Drawing');
goog.require('xrx.drawing.Toolbar');
goog.require('xrx.drawing.Mode');
goog.require('xrx.shape.Shape');



SemToNotes = function() {};



SemToNotes.install = function() {
  var url = '../data/SachsenspiegelHeidelberg/Bilder-34572-28186-1600.jpg';

  // install a drawing canvas with SVG rendering
  var canvasSVG = goog.dom.getElement('canvasSVG');
  var toolbarSVG = goog.dom.getElement('toolbarSVG');
  var drawingSVG = new xrx.drawing.Drawing(canvasSVG, xrx.graphics.Engine.SVG);
  new xrx.drawing.Toolbar(toolbarSVG, drawingSVG);
  drawingSVG.setBackgroundImage(url, function() { drawingSVG.setModeView(); });
  var rectSVG = xrx.shape.Rect.create(drawingSVG);
  rectSVG.setCoords([[10,10],[10,30],[30,30],[30,10]]);
  drawingSVG.getLayerShape().addShapes(rectSVG);
  drawingSVG.draw();

  // install a drawing canvas with HTML5 Canvas rendering
  var canvasCanvas = goog.dom.getElement('canvasCanvas');
  var toolbarCanvas = goog.dom.getElement('toolbarCanvas');
  var drawingCanvas = new xrx.drawing.Drawing(canvasCanvas, xrx.graphics.Engine.CANVAS);
  new xrx.drawing.Toolbar(toolbarCanvas, drawingCanvas);
  drawingCanvas.setBackgroundImage(url, function() { drawingCanvas.setModeView(); });
  var rectCanvas = xrx.shape.Rect.create(drawingCanvas);
  rectCanvas.setCoords([[10,10],[10,30],[30,30],[30,10]]);
  drawingCanvas.getLayerShape().addShapes(rectCanvas);
  drawingCanvas.draw();

  // install a drawing canvas with VML rendering
  var canvasVML = goog.dom.getElement('canvasVML');
  var toolbarVML = goog.dom.getElement('toolbarVML');
  var drawingVML = new xrx.drawing.Drawing(canvasVML, xrx.graphics.Engine.VML);
  new xrx.drawing.Toolbar(toolbarVML, drawingVML);
  drawingVML.setBackgroundImage(url, function() { drawingVML.setModeView(); });
  var rectVML = xrx.shape.Rect.create(drawingVML);
  rectVML.setCoords([[10,10],[10,30],[30,30],[30,10]]);
  drawingVML.getLayerShape().addShapes(rectVML);
  drawingVML.draw();

  return true;
};



goog.exportSymbol('SemToNotes.install', SemToNotes.install);
 