***REMOVED***
***REMOVED*** @fileoverview A class offering a tool-bar for a canvas.
***REMOVED***

goog.provide('xrx.canvas.Toolbar');
goog.provide('xrx.canvas.ToolbarButton');
goog.provide('xrx.canvas.ToolbarOption');


***REMOVED***
goog.require('goog.dom.classes');
***REMOVED***
***REMOVED***
goog.require('xrx.canvas');
goog.require('xrx.canvas.Handler');



***REMOVED***
***REMOVED*** A class offering a tool-bar for a canvas.
***REMOVED*** @param {DOMElement} element The element used to install the tool-bar.
***REMOVED*** @param {xrx.canvas.Canvas} canvas The canvas.
***REMOVED***
***REMOVED***
xrx.canvas.Toolbar = function(element, canvas) {

  this.element_ = element;

  this.canvas_ = canvas;

  this.create_();
***REMOVED***



xrx.canvas.Toolbar.prototype.setSelectedDefault = function() {
  var span = goog.dom.getFirstElementChild(this.element_);
  var img = goog.dom.getFirstElementChild(span);
  xrx.canvas.ToolbarToggle.setSelected(img);
***REMOVED***



xrx.canvas.Toolbar.prototype.handleClick = function(e) {
  var img;
  var span;
  var isSelected;
  var numSelected = 0;
  var childs = goog.dom.getChildren(this.element_);

  if (goog.dom.classes.has(e.target.parentNode, xrx.canvas.ToolbarToggle.className)) {
    for (var i = 0, len = childs.length; i < len; i++) {
      img = goog.dom.getFirstElementChild(childs[i]);
      if (img !== e.target) xrx.canvas.ToolbarToggle.setSelected(img, false);
    }

    isSelected = goog.dom.classes.has(e.target, 'xrx-ui-state-selected');
    if (!isSelected) {
      xrx.canvas.ToolbarToggle.setSelected(e.target);
      numSelected += 1;
    } else {
      xrx.canvas.ToolbarToggle.setSelected(e.target, false);
    }

    if (numSelected === 0) this.setSelectedDefault();
  }
***REMOVED***



***REMOVED***
***REMOVED*** @private
***REMOVED***
xrx.canvas.Toolbar.prototype.create_ = function() {
***REMOVED***

  var registerButtonClick = function(button, handler) {
  ***REMOVED***button, goog.events.EventType.CLICK, function(e) {
      handler(self.canvas_);
    });
 ***REMOVED*****REMOVED***

  var registerToggleClick = function(button, handler, arg) {
  ***REMOVED***button, goog.events.EventType.CLICK, function(e) {
      var isSelected = goog.dom.classes.has(e.target, 'xrx-ui-state-selected');
      !isSelected ? handler(false, self.canvas_, arg) : handler(true, self.canvas_, arg);
    });
 ***REMOVED*****REMOVED***

  // register events
***REMOVED***this.element_, goog.events.EventType.CLICK, function(e) {
      self.handleClick(e);
  }, true);

  // viewer buttons
  var buttonPanImage = xrx.canvas.ToolbarToggle.create('./res/openhand.png',
      'Zoom, Pan or Rotate the Canvas.');
  registerButtonClick(buttonPanImage, xrx.canvas.Handler.setModeBackground);
  var buttonZoomIn = xrx.canvas.ToolbarButton.create('./res/zoomIn.png',
      'Zoom In.');
  registerButtonClick(buttonZoomIn, xrx.canvas.Handler.zoomIn);
  var buttonZoomOut = xrx.canvas.ToolbarButton.create('./res/zoomOut.png',
      'Zoom Out.');
  registerButtonClick(buttonZoomOut, xrx.canvas.Handler.zoomOut);
  var buttonRotateLeft = xrx.canvas.ToolbarButton.create('./res/rotateLeft.png',
      'Rotate Left.');
  registerButtonClick(buttonRotateLeft, xrx.canvas.Handler.rotateLeft);
  var buttonRotateRight = xrx.canvas.ToolbarButton.create('./res/rotateRight.png',
      'Rotate Right.');
  registerButtonClick(buttonRotateRight, xrx.canvas.Handler.rotateRight);

  // shape create buttons
  var buttonShapeRect = xrx.canvas.ToolbarToggle.create('./res/shapeRect.png',
      'Draw a Rect.');
  registerToggleClick(buttonShapeRect, xrx.canvas.Handler.setModeCreate, 'RectCreate');
  var buttonShapePolygon = xrx.canvas.ToolbarToggle.create('./res/shapePolygon.png',
      'Draw a Polygon.');
  registerToggleClick(buttonShapePolygon, xrx.canvas.Handler.setModeCreate, 'PolygonCreate');

  // shape modify buttons
  var buttonShapeModify = xrx.canvas.ToolbarToggle.create('./res/move.png',
      'Move or Modify a Shape.');
  registerToggleClick(buttonShapeModify, xrx.canvas.Handler.setModeModify);
  var buttonShapeDelete = xrx.canvas.ToolbarToggle.create('./res/delete.png',
      'Delete a Shape.');
  registerToggleClick(buttonShapeDelete, xrx.canvas.Handler.setModeDelete);

  goog.dom.append(this.element_, buttonPanImage);
  goog.dom.append(this.element_, buttonZoomIn);
  goog.dom.append(this.element_, buttonZoomOut);
  goog.dom.append(this.element_, buttonRotateLeft);
  goog.dom.append(this.element_, buttonRotateRight);
  goog.dom.append(this.element_, buttonShapeRect);
  goog.dom.append(this.element_, buttonShapePolygon);
  goog.dom.append(this.element_, buttonShapeModify);
  goog.dom.append(this.element_, buttonShapeDelete);

  // set the first button as default selection
  this.setSelectedDefault();

  return this.element_;
***REMOVED***



xrx.canvas.ToolbarButton = function() {***REMOVED***



xrx.canvas.ToolbarButton.className = 'xrx-canvas-toolbar-button';



xrx.canvas.ToolbarButton.handleMouseOver = function(e) {
  goog.dom.classes.addRemove(e.target, 'xrx-ui-state-mouseout',
      'xrx-ui-state-mouseover');
***REMOVED***



xrx.canvas.ToolbarButton.handleMouseOut = function(e) {
  goog.dom.classes.addRemove(e.target, 'xrx-ui-state-mouseover',
      'xrx-ui-state-mouseout');
***REMOVED***



xrx.canvas.ToolbarButton.create = function(imageUrl, tooltip) {
  var wrapper = goog.dom.createElement('span');
  goog.dom.classes.set(wrapper, xrx.canvas.ToolbarButton.className);

  var img = goog.dom.createElement('img');
  img.setAttribute('src', imageUrl);
  img.setAttribute('title', tooltip);
  goog.dom.classes.set(img, 'xrx-ui-state-mouseout');

  goog.dom.append(wrapper, img);

***REMOVED***wrapper, goog.events.EventType.MOUSEOVER,
      function(e) {
        xrx.canvas.ToolbarButton.handleMouseOver(e);
  });
***REMOVED***wrapper, goog.events.EventType.MOUSEOUT,
      function(e) {
        xrx.canvas.ToolbarButton.handleMouseOut(e);
  });

  return wrapper;
***REMOVED***



xrx.canvas.ToolbarToggle = function() {***REMOVED***



xrx.canvas.ToolbarToggle.className = 'xrx-canvas-toolbar-toggle';



xrx.canvas.ToolbarToggle.setSelected = function(element, opt_flag) {
  if (opt_flag === false) {
    goog.dom.classes.remove(element, 'xrx-ui-state-selected');
  } else {
    goog.dom.classes.add(element, 'xrx-ui-state-selected');
  }
***REMOVED***



xrx.canvas.ToolbarToggle.handleMouseOver = xrx.canvas.ToolbarButton.handleMouseOver;



xrx.canvas.ToolbarToggle.handleMouseOut = xrx.canvas.ToolbarButton.handleMouseOut;



xrx.canvas.ToolbarToggle.create = function(imageUrl, tooltip) {
  var wrapper = goog.dom.createElement('span');
  goog.dom.classes.set(wrapper, xrx.canvas.ToolbarToggle.className);

  var img = goog.dom.createElement('img');
  img.setAttribute('src', imageUrl);
  img.setAttribute('title', tooltip);
  goog.dom.classes.set(img, 'xrx-ui-state-mouseout');

  goog.dom.append(wrapper, img);

***REMOVED***wrapper, goog.events.EventType.MOUSEOVER,
      function(e) {
        xrx.canvas.ToolbarToggle.handleMouseOver(e);
  });
***REMOVED***wrapper, goog.events.EventType.MOUSEOUT,
      function(e) {
        xrx.canvas.ToolbarToggle.handleMouseOut(e);
  });

  return wrapper;
***REMOVED***
