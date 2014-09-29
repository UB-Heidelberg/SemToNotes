***REMOVED***
***REMOVED*** @fileoverview Engine base class.
***REMOVED***

goog.provide('xrx.engine');



goog.require('goog.userAgent');
goog.require('xrx');



***REMOVED***
***REMOVED*** Engine base class.
***REMOVED***
***REMOVED***
xrx.engine = function() {***REMOVED***



***REMOVED***
***REMOVED*** <a href="http://www.w3.org/TR/2014/CR-2dcontext-20140821/">The 2D Canvas rendering engine.</a>
***REMOVED*** @enum {string}
***REMOVED***
xrx.engine.CANVAS = 'canvas';



***REMOVED***
***REMOVED*** <a href="http://www.w3.org/TR/SVG/">The SVG rendering engine.</a>
***REMOVED*** @enum {string}
***REMOVED***
xrx.engine.SVG = 'svg';



***REMOVED***
***REMOVED*** <a href="http://www.w3.org/TR/NOTE-VML">The VML rendering engine.</a>
***REMOVED*** @enum {string}
***REMOVED***
xrx.engine.VML = 'vml';



***REMOVED***
***REMOVED*** Returns whether the current agent is an old Internet Explorer,
***REMOVED*** that is IE 7 or IE 8
***REMOVED***
xrx.engine.isOldIE = function() {
  return goog.userAgent.IE && !goog.userAgent.isVersionOrHigher(9)
***REMOVED***
