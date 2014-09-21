***REMOVED***
***REMOVED*** @fileoverview A class representing a drawing layer where tools can be
***REMOVED***     plugged in.
***REMOVED***

goog.provide('xrx.drawing.LayerTool');



goog.require('xrx.drawing.Layer');
goog.require('xrx.drawing.tool.Magnifier');



***REMOVED***
***REMOVED*** A class representing a drawing layer where tools can be plugged in.
***REMOVED*** @param {xrx.drawing.Drawing} drawing The parent drawing object.
***REMOVED***
***REMOVED*** @extends {xrx.drawing.Layer}
***REMOVED***
xrx.drawing.LayerTool = function(drawing) {

  goog.base(this, drawing);

  this.magnifier_;
***REMOVED***
goog.inherits(xrx.drawing.LayerTool, xrx.drawing.Layer);



***REMOVED***
***REMOVED*** Activates or deactivates the magnifier tool.
***REMOVED***
xrx.drawing.LayerTool.prototype.toggleMagnifier = function() {
  if (!this.magnifier_) this.magnifier_ = xrx.drawing.tool.Magnifier.create(
      this.drawing_);
  if (this.magnifier_.isActive()) {
    this.magnifier_.hide();
  } else {
    this.magnifier_.show();
  }
***REMOVED***
