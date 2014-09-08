***REMOVED***
***REMOVED*** @fileoverview A class providing enumerations and static functions for
***REMOVED*** the canvas classes.
***REMOVED***

goog.provide('xrx.canvas');
goog.provide('xrx.canvas.Mode');
goog.provide('xrx.canvas.State');



***REMOVED***
***REMOVED*** A static class providing enumerations for the canvas classes.
***REMOVED*** @class
***REMOVED***
xrx.canvas = function() {***REMOVED***



***REMOVED***
***REMOVED*** Enumeration for canvas states.
***REMOVED*** @enum {string}
***REMOVED***
xrx.canvas.State = {
  DRAG: 'drag',
  NONE: 'none'
***REMOVED***



***REMOVED***
***REMOVED*** Enumeration for canvas modes.
***REMOVED*** @enum {string}
***REMOVED***
xrx.canvas.Mode = {
  PAN: 'pan',
  DRAW: 'draw',
  MODIFY: 'modify',
  DELETE: 'delete'
***REMOVED***
