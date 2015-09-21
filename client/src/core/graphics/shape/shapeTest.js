



function getCanvasDrawing(id) {
  var element = goog.dom.getElement(id);
  var drawing = new xrx.drawing.Drawing(element, xrx.engine.CANVAS);
  drawing.setBackgroundImage('./shape_test2.png');
  return drawing;
};



function getSvgDrawing(id) {
  var element = goog.dom.getElement(id);
  var drawing = new xrx.drawing.Drawing(element, xrx.engine.SVG);
  drawing.setBackgroundImage('./shape_test2.png');
  return drawing;
};



function getVmlDrawing(id) {
  var element = goog.dom.getElement(id);
  var drawing = new xrx.drawing.Drawing(element, xrx.engine.VML, true);
  drawing.setBackgroundImage('./shape_test2.png');
  return drawing;
};