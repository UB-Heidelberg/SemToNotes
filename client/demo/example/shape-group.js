(function() {

  /**
   * Reusable function that creates two groups and
   * renders them on the drawing canvas.
   */
  var createShapeGroup = function(drawing) {
    // styles, used by both shape groups 
    var hoverableStyle = new xrx.shape.Style();
    hoverableStyle.setFillColor('green');
    hoverableStyle.setFillOpacity(.2);
    hoverableStyle.setStrokeColor('green');
    hoverableStyle.setStrokeWidth(2);
    var selectableStyle = new xrx.shape.Style();
    selectableStyle.setFillColor('grey');
    selectableStyle.setFillOpacity(.2);
    selectableStyle.setStrokeColor('yellow');
    selectableStyle.setStrokeWidth(2);
    var modifiableStyle = selectableStyle;

    // create and style first shape group
    var style1 = new xrx.shape.Style();
    style1.setFillColor('purple');
    style1.setFillOpacity(.4);
    style1.setStrokeColor('purple');
    style1.setStrokeWidth(2);
    var group1 = new xrx.shape.ShapeGroup(drawing);
    group1.setStyle(style1);
    group1.getHoverable().setStyle(hoverableStyle);
    group1.getModifiable().setStyle(modifiableStyle);
    group1.getSelectable().setStyle(selectableStyle);
    var circle1 = new xrx.shape.Circle(drawing);
    circle1.setCenter(100, 110);
    circle1.setRadius(40);
    var rect1 = new xrx.shape.Rect(drawing);
    rect1.setX(20);
    rect1.setY(20);
    rect1.setWidth(100);
    rect1.setHeight(100);
    var line1 = new xrx.shape.Line(drawing);
    line1.setX1(40);
    line1.setY1(50);
    line1.setX2(150);
    line1.setY2(140);
    group1.addChildren([circle1, rect1, line1]);

    // create second shape group
    var group2 = new xrx.shape.ShapeGroup(drawing);

    // render groups on the canvas
    drawing.addShapes(group1);
  };


  // initialize a drawing canvas for mode view
  var element1 = document.getElementById('drawing1');
  element1.style['height'] = '400px';
  element1.style['width'] = '50%';
  var drawing1 = new xrx.drawing.Drawing(element1);
  drawing1.setModeView();
  createShapeGroup(drawing1);
  // initialize a drawing canvas for mode hover
  var element2 = document.getElementById('drawing2');
  var drawing2 = new xrx.drawing.Drawing(element2);
  drawing2.setModeHover();
  // initialize a drawing canvas for mode select
  var element3 = document.getElementById('drawing3');
  var drawing3 = new xrx.drawing.Drawing(element3);
  drawing3.setModeSelect();
  // initialize a drawing canvas for mode modify
  var element4 = document.getElementById('drawing4');
  var drawing4 = new xrx.drawing.Drawing(element4);
  drawing4.setModeModify();
  

  return [drawing1, drawing2, drawing3, drawing4];

})();