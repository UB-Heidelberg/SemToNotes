***REMOVED***
***REMOVED*** @fileoverview An interface for the NodeTest construct.
***REMOVED***

goog.provide('xrx.xpath.NodeTest');



***REMOVED***
***REMOVED*** The NodeTest interface to represent the NodeTest production
***REMOVED*** in the xpath grammar:
***REMOVED*** http://www.w3.org/TR/xpath-30/#prod-xpath30-NodeTest
***REMOVED***
***REMOVED*** @interface
***REMOVED***
xrx.xpath.NodeTest = function() {***REMOVED***


***REMOVED***
***REMOVED*** Tests if a node matches the stored characteristics.
***REMOVED***
***REMOVED*** @param {xrx.xpath..Node} node The node to be tested.
***REMOVED*** @return {boolean} Whether the node passes the test.
***REMOVED***
xrx.xpath.NodeTest.prototype.matches = goog.abstractMethod;


***REMOVED***
***REMOVED*** Returns the name of the test.
***REMOVED***
***REMOVED*** @return {string} The name, either nodename or type name.
***REMOVED***
xrx.xpath.NodeTest.prototype.getName = goog.abstractMethod;


***REMOVED***
***REMOVED*** @override
***REMOVED***
xrx.xpath.NodeTest.prototype.toString = goog.abstractMethod;
