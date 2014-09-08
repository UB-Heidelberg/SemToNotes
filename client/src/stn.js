***REMOVED***
***REMOVED*** @fileoverview The SemToNotes main class.
***REMOVED***

goog.provide('xrx.stn');



***REMOVED***
goog.require('xrx');
goog.require('xrx.canvas.Canvas');
goog.require('xrx.canvas.Toolbar');



xrx.stn.install = function() {
  var stn = goog.dom.getElement('stn');
  var toolbar = goog.dom.getElement('toolbar');
  var canvas = new xrx.canvas.Canvas(stn);

  new xrx.canvas.Toolbar(toolbar, canvas);

  return true;
***REMOVED***



goog.exportSymbol('xrx.stn.install', xrx.stn.install);
