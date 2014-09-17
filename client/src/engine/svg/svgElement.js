***REMOVED***
***REMOVED*** @fileoverview SVG super class.
***REMOVED***

goog.provide('xrx.svg.Element');



***REMOVED***
***REMOVED*** SVG super class.
***REMOVED*** @param {Element} element A SVG element.
***REMOVED***
***REMOVED***
xrx.svg.Element = function(element) {

 ***REMOVED*****REMOVED***
  ***REMOVED*** The SVG element.
  ***REMOVED*** @type {Element}
 ***REMOVED*****REMOVED***
  this.element_ = element;
***REMOVED***



***REMOVED***
***REMOVED*** Returns the SVG element.
***REMOVED*** @return {Element} The SVG element.
***REMOVED***
xrx.svg.Element.prototype.getElement = function() {
  return this.element_;
***REMOVED***
