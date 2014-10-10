***REMOVED***
***REMOVED*** @fileoverview Context information about nodes in their nodeset.
***REMOVED***

goog.provide('xrx.xpath.Context');



***REMOVED***
***REMOVED*** Provides information for where something is in the XML tree.
***REMOVED***
***REMOVED*** @param {!xrx.node} node A node in the XML tree.
***REMOVED*** @param {number=} opt_position The position of this node in its nodeset,
***REMOVED***     defaults to 1.
***REMOVED*** @param {number=} opt_last Index of the last node in this nodeset,
***REMOVED***     defaults to 1.
***REMOVED***
***REMOVED***
xrx.xpath.Context = function(node, opt_position, opt_last) {

 ***REMOVED*****REMOVED***
   ***REMOVED*** @private
   ***REMOVED*** @type {!xrx.node}
  ***REMOVED*****REMOVED***
  this.node_ = node;

 ***REMOVED*****REMOVED***
  ***REMOVED*** @private
  ***REMOVED*** @type {number}
 ***REMOVED*****REMOVED***
  this.position_ = opt_position || 1;

 ***REMOVED*****REMOVED***
  ***REMOVED*** @private
  ***REMOVED*** @type {number} opt_last
 ***REMOVED*****REMOVED***
  this.last_ = opt_last || 1;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the node for this context object.
***REMOVED***
***REMOVED*** @return {!xrx.node} The node for this context object.
***REMOVED***
xrx.xpath.Context.prototype.getNode = function() {
  return this.node_;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the position for this context object.
***REMOVED***
***REMOVED*** @return {number} The position for this context object.
***REMOVED***
xrx.xpath.Context.prototype.getPosition = function() {
  return this.position_;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the last field for this context object.
***REMOVED***
***REMOVED*** @return {number} The last field for this context object.
***REMOVED***
xrx.xpath.Context.prototype.getLast = function() {
  return this.last_;
***REMOVED***
