***REMOVED***
***REMOVED*** @fileoverview An abstract class representing a XML node.
***REMOVED***

goog.provide('xrx.node');



// numbers are important to compute document order!
***REMOVED*** @const***REMOVED*** xrx.node.DOCUMENT = 0;
***REMOVED*** @const***REMOVED*** xrx.node.ELEMENT = 4;
***REMOVED*** @const***REMOVED*** xrx.node.ATTRIBUTE = 3;
***REMOVED*** @const***REMOVED*** xrx.node.NAMESPACE = 2;
***REMOVED*** @const***REMOVED*** xrx.node.PI = 1;
***REMOVED*** @const***REMOVED*** xrx.node.COMMENT = 5;
***REMOVED*** @const***REMOVED*** xrx.node.TEXT = 6;



***REMOVED***
***REMOVED*** return {!string}
***REMOVED***
xrx.node.getNameLocal = function(name) {
  return goog.string.contains(name, ':') ? 
      name.substr(name.indexOf(':') + 1) : name;
***REMOVED***



***REMOVED***
***REMOVED*** return {!string}
***REMOVED***
xrx.node.getNamePrefix = function(name) {
  return goog.string.contains(name, ':') ? 
      'xmlns:' + name.substr(0, name.indexOf(':')) : 'xmlns';
***REMOVED***



***REMOVED***
***REMOVED*** return {!string}
***REMOVED***
xrx.node.getNameExpanded = function(namespace, localName) {
  return namespace + '#' + localName;
***REMOVED***
