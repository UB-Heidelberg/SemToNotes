/**
 * @fileoverview A class offering a tool-bar for a drawing canvas.
 */

goog.provide('xrx.drawing.Toolbar');
goog.provide('xrx.drawing.ToolbarButton');
goog.provide('xrx.drawing.ToolbarOption');


goog.require('goog.dom.DomHelper');
goog.require('goog.dom.classes');
goog.require('goog.events');
goog.require('goog.events.EventType');
goog.require('goog.style');
goog.require('xrx.drawing');
goog.require('xrx.drawing.EventTarget');
goog.require('xrx.mvc');



/**
 * A class offering a tool-bar for a drawing canvas.
 * @param {DOMElement} element The element used to install the tool-bar.
 * @param {xrx.drawing.Drawing} drawing The parent drawing object.
 * @constructor
 */
xrx.drawing.Toolbar = function(element, drawing) {

  this.element_ = element;

  this.drawing_ = drawing;

  this.create_();
};



xrx.drawing.Toolbar.prototype.setSelectedDefault = function() {
  var span = goog.dom.getFirstElementChild(this.element_);
  var img = goog.dom.getFirstElementChild(span);
  xrx.drawing.ToolbarToggle.setSelected(img);
};



xrx.drawing.Toolbar.prototype.handleClick = function(e) {
  var img;
  var span;
  var isSelected;
  var numSelected = 0;
  var childs = goog.dom.getChildren(this.element_);

  if (goog.dom.classes.has(e.target.parentNode, xrx.drawing.ToolbarToggle.className)) {
    for (var i = 0, len = childs.length; i < len; i++) {
      img = goog.dom.getFirstElementChild(childs[i]);
      if (img !== e.target) xrx.drawing.ToolbarToggle.setSelected(img, false);
    }

    isSelected = goog.dom.classes.has(e.target, 'xrx-ui-state-selected');
    if (!isSelected) {
      xrx.drawing.ToolbarToggle.setSelected(e.target);
      numSelected += 1;
    } else {
      xrx.drawing.ToolbarToggle.setSelected(e.target, false);
    }

    if (numSelected === 0) this.setSelectedDefault();
  }
};



/**
 * @private
 */
xrx.drawing.Toolbar.prototype.create_ = function() {
  var self = this;
  var tool = self.drawing_.getLayerTool();
  var viewbox = self.drawing_.getViewbox();

  goog.style.setStyle(this.element_, 'position', 'absolute');
  goog.style.setStyle(this.element_, 'z-index', '999');

  var registerButtonClick = function(button, handler, handle) {
    goog.events.listen(button, goog.events.EventType.CLICK, function(e) {
      e.preventDefault();
      e.stopPropagation();
      handler[handle]();
      self.drawing_.draw();
    }, false, handler);
  };

  var registerToggleClick = function(button, handler, handle, arg) {
    goog.events.listen(button, goog.events.EventType.CLICK, function(e) {
      e.preventDefault();
      e.stopPropagation();
      var isSelected = goog.dom.classes.has(e.target, 'xrx-ui-state-selected');
      !isSelected ? handler[handle]() : handler[handle](arg);
    }, false, handler);
  };

  // register events
  goog.events.listen(this.element_, goog.events.EventType.CLICK, function(e) {
      self.handleClick(e);
  }, true);

  // viewer buttons
  var buttonPanImage = xrx.drawing.ToolbarToggle.create('../res/openhand.png',
      'Zoom, Pan or Rotate the Canvas.');
  registerButtonClick(buttonPanImage, self.drawing_, 'setModeView');
  var buttonZoomIn = xrx.drawing.ToolbarButton.create('../res/zoomIn.png',
      'Zoom In.');
  registerButtonClick(buttonZoomIn, viewbox, 'zoomIn');
  var buttonZoomOut = xrx.drawing.ToolbarButton.create('../res/zoomOut.png',
      'Zoom Out.');
  registerButtonClick(buttonZoomOut, viewbox, 'zoomOut');
  var buttonRotateLeft = xrx.drawing.ToolbarButton.create('../res/rotateLeft.png',
      'Rotate Left.');
  registerButtonClick(buttonRotateLeft, viewbox, 'rotateLeft');
  var buttonRotateRight = xrx.drawing.ToolbarButton.create('../res/rotateRight.png',
      'Rotate Right.');
  registerButtonClick(buttonRotateRight, viewbox, 'rotateRight');
  var buttonMagnifier = xrx.drawing.ToolbarToggle.create('../res/magnifier.png',
      'Magnifier.');
  registerToggleClick(buttonMagnifier, tool, 'toggleMagnifier');

  // shape create buttons
  var buttonShapeRect = xrx.drawing.ToolbarToggle.create('../res/shapeRect.png',
      'Draw a Rect.');
  registerToggleClick(buttonShapeRect, self.drawing_, 'setModeCreate', 'RectCreate');
  var buttonShapePolygon = xrx.drawing.ToolbarToggle.create('../res/shapePolygon.png',
      'Draw a Polygon.');
  registerToggleClick(buttonShapePolygon, self.drawing_, 'setModeCreate', 'PolygonCreate');

  // shape modify buttons
  var buttonShapeModify = xrx.drawing.ToolbarToggle.create('../res/move.png',
      'Move or Modify a Shape.');
  registerToggleClick(buttonShapeModify, self.drawing_, 'setModeModify');
  var buttonShapeDelete = xrx.drawing.ToolbarToggle.create('../res/delete.png',
      'Delete a Shape.');
  registerToggleClick(buttonShapeDelete, self.drawing_, 'setModeDelete');

  goog.dom.append(this.element_, buttonPanImage);
  goog.dom.append(this.element_, buttonZoomIn);
  goog.dom.append(this.element_, buttonZoomOut);
  goog.dom.append(this.element_, buttonRotateLeft);
  goog.dom.append(this.element_, buttonRotateRight);
  //goog.dom.append(this.element_, buttonMagnifier);
  goog.dom.append(this.element_, buttonShapeRect);
  goog.dom.append(this.element_, buttonShapePolygon);
  goog.dom.append(this.element_, buttonShapeModify);
  goog.dom.append(this.element_, buttonShapeDelete);

  // set the first button as default selection
  this.setSelectedDefault();

  return this.element_;
};



xrx.drawing.ToolbarButton = function() {};



xrx.drawing.ToolbarButton.className = 'xrx-canvas-toolbar-button';



xrx.drawing.ToolbarButton.handleMouseOver = function(e) {
  goog.dom.classes.addRemove(e.target, 'xrx-ui-state-mouseout',
      'xrx-ui-state-mouseover');
};



xrx.drawing.ToolbarButton.handleMouseOut = function(e) {
  goog.dom.classes.addRemove(e.target, 'xrx-ui-state-mouseover',
      'xrx-ui-state-mouseout');
};



xrx.drawing.ToolbarButton.create = function(imageUrl, tooltip) {
  var wrapper = goog.dom.createElement('span');
  goog.dom.classes.set(wrapper, xrx.drawing.ToolbarButton.className);

  var img = goog.dom.createElement('img');
  img.setAttribute('src', imageUrl);
  img.setAttribute('title', tooltip);
  goog.dom.classes.set(img, 'xrx-ui-state-mouseout');

  goog.dom.append(wrapper, img);

  goog.events.listen(wrapper, goog.events.EventType.MOUSEOVER,
      function(e) {
        xrx.drawing.ToolbarButton.handleMouseOver(e);
  });
  goog.events.listen(wrapper, goog.events.EventType.MOUSEOUT,
      function(e) {
        xrx.drawing.ToolbarButton.handleMouseOut(e);
  });

  return wrapper;
};



xrx.drawing.ToolbarToggle = function() {};



xrx.drawing.ToolbarToggle.className = 'xrx-canvas-toolbar-toggle';



xrx.drawing.ToolbarToggle.setSelected = function(element, opt_flag) {
  if (opt_flag === false) {
    goog.dom.classes.remove(element, 'xrx-ui-state-selected');
  } else {
    goog.dom.classes.add(element, 'xrx-ui-state-selected');
  }
};



xrx.drawing.ToolbarToggle.handleMouseOver = xrx.drawing.ToolbarButton.handleMouseOver;



xrx.drawing.ToolbarToggle.handleMouseOut = xrx.drawing.ToolbarButton.handleMouseOut;



xrx.drawing.ToolbarToggle.create = function(imageUrl, tooltip) {
  var wrapper = goog.dom.createElement('span');
  goog.dom.classes.set(wrapper, xrx.drawing.ToolbarToggle.className);

  var img = goog.dom.createElement('img');
  img.setAttribute('src', imageUrl);
  img.setAttribute('title', tooltip);
  goog.dom.classes.set(img, 'xrx-ui-state-mouseout');

  goog.dom.append(wrapper, img);

  goog.events.listen(wrapper, goog.events.EventType.MOUSEOVER,
      function(e) {
        e.preventDefault();
        e.stopPropagation();
        xrx.drawing.ToolbarToggle.handleMouseOver(e);
  });
  goog.events.listen(wrapper, goog.events.EventType.MOUSEOUT,
      function(e) {
        e.preventDefault();
        e.stopPropagation();
        xrx.drawing.ToolbarToggle.handleMouseOut(e);
  });

  return wrapper;
};
