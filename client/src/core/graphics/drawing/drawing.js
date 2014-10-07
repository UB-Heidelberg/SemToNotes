***REMOVED***
***REMOVED*** @fileoverview A class providing enumerations and static functions for
***REMOVED*** the drawing classes.
***REMOVED***

goog.provide('xrx.drawing');
goog.provide('xrx.drawing.Mode');
goog.provide('xrx.drawing.State');



***REMOVED***
***REMOVED*** A static class providing enumerations for the drawing classes.
***REMOVED***
xrx.drawing = function() {***REMOVED***



***REMOVED***
***REMOVED*** Enumeration for drawing states.
***REMOVED*** @enum (number)
***REMOVED***
xrx.drawing.State = {
  DRAG: 1,
  NONE: 2
***REMOVED***



***REMOVED***
***REMOVED*** Enumeration for drawing modes.
***REMOVED*** @enum {number}
***REMOVED***
xrx.drawing.Mode = {
  VIEW: 1,
  MODIFY: 2,
  DELETE: 3,
  CREATE: 4,
  DISABLED: 5
***REMOVED***
