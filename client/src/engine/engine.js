***REMOVED***
***REMOVED*** @fileoverview Engine base class providing enumerations for the engine sub-classes.
***REMOVED***

goog.provide('xrx.engine');
goog.provide('xrx.engine.Engine');



***REMOVED***
***REMOVED*** Engine base class providing enumerations for the engine sub-classes.
***REMOVED***
***REMOVED***
xrx.engine = function() {***REMOVED***



***REMOVED***
***REMOVED*** Enumeration of the rendering engines.
***REMOVED*** @enum {string}
***REMOVED***
xrx.engine.Engine = {

 ***REMOVED*****REMOVED***
  ***REMOVED*** <a href="http://www.w3.org/TR/SVG/">SVG rendering engine</a>
 ***REMOVED*****REMOVED***
  SVG: 'svg',

 ***REMOVED*****REMOVED***
  ***REMOVED*** <a href="http://www.w3.org/TR/NOTE-VML">VML rendering engine</a>
 ***REMOVED*****REMOVED***
  VML: 'vml',

 ***REMOVED*****REMOVED***
  ***REMOVED*** <a href="http://www.w3.org/TR/2014/CR-2dcontext-20140821/">2D Canvas rendering engine</a>
 ***REMOVED*****REMOVED***
  CANVAS: 'canvas'
***REMOVED***
