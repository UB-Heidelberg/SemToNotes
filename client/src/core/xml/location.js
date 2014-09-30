***REMOVED***
***REMOVED*** @fileoverview A class which represents the location of a token 
***REMOVED*** in a XML stream.
***REMOVED***

goog.provide('xrx.location');



***REMOVED***
***REMOVED*** A class representing the location of a token in a XML 
***REMOVED*** stream.
***REMOVED*** 
***REMOVED*** @param {!number} offset The offset.
***REMOVED*** @param {!number} length The number of characters occupied.
***REMOVED***
***REMOVED***
xrx.location = function(offset, length) {



  this.offset = offset;



  this.length = length;
***REMOVED***



***REMOVED***
***REMOVED*** Returns the XML string of the location in a
***REMOVED*** XML stream.
***REMOVED*** 
***REMOVED*** @param {!string} stream The XML stream.
***REMOVED*** @return {!string} The XML string occupied by the location
***REMOVED***
xrx.location.prototype.xml = function(stream) {
  return stream.substr(this.offset, this.length);
***REMOVED***