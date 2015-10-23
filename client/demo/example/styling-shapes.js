(function() {

  // initialize the drawing canvas
  var element = document.getElementById('drawing');
  var drawing = new xrx.drawing.Drawing(element);

  // create a styled circle shape
  var circle = xrx.shape.Circle.create(drawing);
  circle.setCenter(100, 100);
  circle.setRadius(50);
  circle.setFillColor('rgb(153, 0, 153)');
  // create a styled ellipse shape
  var ellipse = xrx.shape.Ellipse.create(drawing);
  ellipse.setCenter(200, 100);
  ellipse.setRadiusX(30);
  ellipse.setRadiusY(70);
  ellipse.setFillColor('green');
  ellipse.setFillOpacity(.2);
  // create a styled line shape
  var line = xrx.shape.Line.create(drawing);
  line.setX1(300);
  line.setY1(40);
  line.setX2(320);
  line.setY2(140);
  line.setStrokeWidth(5);
  line.setStrokeColor('red');
  // create a styled polygon shape
  var polygon = xrx.shape.Polygon.create(drawing);
  polygon.setCoords([[50, 200], [170, 210], [160, 300], [155, 280]]);
  polygon.setStrokeColor('#805C6E');
  polygon.setStrokeWidth('3');
  polygon.setFillColor('#805C6E');
  polygon.setFillOpacity(.2);
  // create a styled poly-line shape
  var polyline = xrx.shape.Polyline.create(drawing);
  polyline.setCoords([[200, 200], [320, 210], [310, 300], [305, 280]]);
  polyline.setStrokeColor('#24246B');
  polyline.setStrokeWidth(4);
  // create a styled rectangle shape
  var rect = xrx.shape.Rect.create(drawing);
  rect.setX(100);
  rect.setY(330);
  rect.setWidth(150);
  rect.setHeight(100);
  rect.setStrokeWidth(0); // set the stroke width to 0 to make it invisible
  rect.setFillColor('#FFA319');
  rect.setFillOpacity(1);

  // add the shapes to the drawing canvas
  drawing.addShapes(circle, ellipse, line, polygon, polyline, rect);

  return drawing;

})();