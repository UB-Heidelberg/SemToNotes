(function() {

  // initialize a drawing canvas for mode view
  var element1 = document.getElementById('drawing1');
  var drawing1 = new xrx.drawing.Drawing(element1);
  // initialize a drawing canvas for mode hover
  var element2 = document.getElementById('drawing2');
  var drawing2 = new xrx.drawing.Drawing(element2);
  // initialize a drawing canvas for mode modify
  var element3 = document.getElementById('drawing3');
  var drawing3 = new xrx.drawing.Drawing(element3);
  // initialize a drawing canvas for mode select
  var element4 = document.getElementById('drawing4');
  var drawing4 = new xrx.drawing.Drawing(element4);

  

  return drawing;

})();