



function createTable(shapeName, $, mode) {
  return $.createDom('div', undefined,
    // mode view
    $.htmlToDocumentFragment('<h1>' + shapeName + ' Tests</h1>'),
    $.htmlToDocumentFragment('<h2>Mode ' + mode + '</h2>'),
    $.htmlToDocumentFragment('<div>Make sure that line width is constant.</div>'),
    $.htmlToDocumentFragment('<div>Test with mobile devices.</div>'),
    $.createDom('table', undefined,
      $.createDom('tr', undefined,
        $.createDom('td', undefined, 
          $.htmlToDocumentFragment('<span>Canvas</span>')
        ),
        $.createDom('td', undefined, 
          $.htmlToDocumentFragment('<span>SVG</span>')
        ),
        $.createDom('td', undefined, 
          $.htmlToDocumentFragment('<span>VML</span>')
        )
      ),
      $.createDom('tr', undefined,
        $.createDom('td', {'class': 'canvas', 'id': 'canvas' + shapeName + mode}),
        $.createDom('td', {'class': 'canvas', 'id': 'svg' + shapeName + mode}),
        $.createDom('td', {'class': 'canvas', 'id': 'vml' + shapeName + mode})
      )
    )
  )
};



function createTables(shapeName, $) {

  var div = $.createDom('div', undefined,
    // mode view
    createTable(shapeName, $, 'View'),
    // mode hover
    createTable(shapeName, $, 'Hover'),
    // mode select
    createTable(shapeName, $, 'Select'),
    // mode modify
    createTable(shapeName, $, 'Modify'),
    // mode create
    createTable(shapeName, $, 'Create')
  )
  $.insertChildAt($.getDocument().body, div, 1);
};



function getCanvasDrawing(id) {
  if (!xrx.engine.isOldIE()) {
    var element = goog.dom.getElement(id);
    var drawing = new xrx.drawing.Drawing(element, xrx.engine.CANVAS);
    drawing.setBackgroundImage('./shape_test2.png');
    return drawing;
  }
};



function getSvgDrawing(id) {
  if (!xrx.engine.isOldIE()) {
    var element = goog.dom.getElement(id);
    var drawing = new xrx.drawing.Drawing(element, xrx.engine.SVG);
    drawing.setBackgroundImage('./shape_test2.png');
    return drawing;
  }
};



function getVmlDrawing(id) {
  var element = goog.dom.getElement(id);
  var drawing = new xrx.drawing.Drawing(element, xrx.engine.VML, true);
  drawing.setBackgroundImage('./shape_test2.png');
  return drawing;
};



function modeMode(shapeName, mode) {
  if (!xrx.engine.isOldIE()) {
    var canvasDrawing = getCanvasDrawing('canvas' + shapeName + mode);
    canvasDrawing['setMode' + mode]();
    canvasDrawing.getLayerShape().addShapes(this['get' + shapeName + 's'](canvasDrawing));
    var svgDrawing = getSvgDrawing('svg' + shapeName + mode);
    svgDrawing['setMode' + mode]();
    svgDrawing.getLayerShape().addShapes(this['get' + shapeName + 's'](svgDrawing));
  }
  /*
  var vmlDrawing = getVmlDrawing('vml' + shapeName + mode);
  vmlDrawing['setMode' + mode]();
  vmlDrawing.getLayerShape().addShapes(this['get' + shapeName + 's'](vmlDrawing));
  */
};



function modeView(shapeName) {
  modeMode(shapeName, 'View');
};



function modeHover(shapeName) {
  modeMode(shapeName, 'Hover');
};



function modeSelect(shapeName) {
  modeMode(shapeName, 'Select');
};



function modeModify(shapeName) {
  modeMode(shapeName, 'Modify');
};



function modeCreate(shapeName) {
  if (!xrx.engine.isOldIE()) {
    var canvasDrawing = getCanvasDrawing('canvas' + shapeName + 'Create');
    var canvasShape = xrx.shape[shapeName].create(canvasDrawing);
    canvasShape.setStrokeWidth(1);
    canvasShape.setStrokeColor('blue');
    var canvasCreatable = canvasShape.getCreatable();
    canvasCreatable.setStrokeColor('blue');
    canvasCreatable.setStrokeWidth(5);
    if (shapeName !== 'Polyline') {
      canvasCreatable.setFillColor('blue');
      canvasCreatable.setFillOpacity(.2);
    }
    canvasDrawing.setModeCreate(canvasCreatable);
    var svgDrawing = getSvgDrawing('svg' + shapeName + 'Create');
    var svgShape = xrx.shape[shapeName].create(svgDrawing);
    svgShape.setStrokeWidth(1);
    svgShape.setStrokeColor('green');
    var svgCreatable = svgShape.getCreatable();
    svgCreatable.setStrokeColor('green');
    svgCreatable.setStrokeWidth(5);
    if (shapeName !== 'Polyline') {
      svgCreatable.setFillColor('green');
      svgCreatable.setFillOpacity(.2);
    }
    svgDrawing.setModeCreate(svgCreatable);
  }
  /*
  var vmlDrawing = getVmlDrawing('vml' + shapeName + 'Create');
  var vmlShape = xrx.shape[shapeName].create(vmlDrawing);
  vmlShape.setStrokeWidth(1);
  vmlShape.setStrokeColor('red');
  var vmlCreatable = vmlShape.getCreatable();
  vmlCreatable.setStrokeColor('red');
  vmlCreatable.setStrokeWidth(5);
  if (shapeName !== 'Polyline') {
    vmlCreatable.setFillColor('red');
    vmlCreatable.setFillOpacity(.2);
  }
  vmlDrawing.setModeCreate(vmlCreatable);
  */
};
