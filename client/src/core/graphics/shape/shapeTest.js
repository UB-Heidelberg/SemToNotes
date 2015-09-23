



function createTables(shapeName, $) {

  var div = $.createDom('div', undefined,
    // mode view
    $.htmlToDocumentFragment('<h1>' + shapeName + ' Tests</h1>'),
    $.htmlToDocumentFragment('<h2>Mode View</h2>'),
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
        $.createDom('td', {'class': 'canvas', 'id': 'canvas' + shapeName}),
        $.createDom('td', {'class': 'canvas', 'id': 'svg' + shapeName}),
        $.createDom('td', {'class': 'canvas', 'id': 'vml' + shapeName})
      )
    ),
    // mode modify
    $.htmlToDocumentFragment('<h2>Mode Modify</h2>'),
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
        $.createDom('td', {'class': 'canvas', 'id': 'canvas' + shapeName + 'Modify'}),
        $.createDom('td', {'class': 'canvas', 'id': 'svg' + shapeName + 'Modify'}),
        $.createDom('td', {'class': 'canvas', 'id': 'vml' + shapeName + 'Modify'})
      )
    ),
    // mode create
    $.htmlToDocumentFragment('<h2>Mode Create</h2>'),
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
        $.createDom('td', {'class': 'canvas', 'id': 'canvas' + shapeName + 'Create'}),
        $.createDom('td', {'class': 'canvas', 'id': 'svg' + shapeName + 'Create'}),
        $.createDom('td', {'class': 'canvas', 'id': 'vml' + shapeName + 'Create'})
      )
    )
  )
  $.insertChildAt($.getDocument().body, div, 1);
};



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



function modeView(shapeName) {
  var canvasDrawing = getCanvasDrawing('canvas' + shapeName);
  canvasDrawing.setModeView();
  canvasDrawing.getLayerShape().addShapes(this['get' + shapeName + 's'](canvasDrawing));
  var svgDrawing = getSvgDrawing('svg' + shapeName);
  svgDrawing.setModeView();
  svgDrawing.getLayerShape().addShapes(this['get' + shapeName + 's'](svgDrawing));
  var vmlDrawing = getVmlDrawing('vml' + shapeName);
  vmlDrawing.setModeView();
  vmlDrawing.getLayerShape().addShapes(this['get' + shapeName + 's'](vmlDrawing));
};



function modeModify(shapeName) {
  var canvasDrawing = getCanvasDrawing('canvas' + shapeName + 'Modify');
  canvasDrawing.setModeModify();
  canvasDrawing.getLayerShape().addShapes(this['get' + shapeName + 's'](canvasDrawing));
  var svgDrawing = getSvgDrawing('svg' + shapeName + 'Modify');
  svgDrawing.setModeModify();
  svgDrawing.getLayerShape().addShapes(this['get' + shapeName + 's'](svgDrawing));
  var vmlDrawing = getVmlDrawing('vml' + shapeName + 'Modify');
  vmlDrawing.setModeModify();
  vmlDrawing.getLayerShape().addShapes(this['get' + shapeName + 's'](vmlDrawing));
};



function modeCreate(shapeName) {
  var canvasDrawing = getCanvasDrawing('canvas' + shapeName + 'Create');
  var canvasShape = xrx.shape[shapeName].create(canvasDrawing.getCanvas());
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
  var svgShape = xrx.shape[shapeName].create(svgDrawing.getCanvas());
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
  var vmlDrawing = getVmlDrawing('vml' + shapeName + 'Create');
  var vmlShape = xrx.shape[shapeName].create(vmlDrawing.getCanvas());
  vmlShape.setStrokeWidth(1);
  vmlShape.setStrokeColor('red');
  var vmlCreatable = vmlShape.getCreatable();
  vmlShape.setStrokeColor('red');
  vmlCreatable.setStrokeWidth(5);
  if (shapeName !== 'Polyline') {
    vmlCreatable.setFillColor('red');
    vmlCreatable.setFillOpacity(.2);
  }
  vmlDrawing.setModeCreate(vmlCreatable);
};
