***REMOVED***
***REMOVED*** @fileoverview
***REMOVED***



xrx.mvc.Cursor = {***REMOVED***



xrx.mvc.Cursor.node_ = [];



xrx.mvc.Cursor.setNodes = function(nodes) {
  var n = xrx.mvc.Cursor.node_;
  n.splice(0, n.length);

  for (var i = 0, len = nodes.length; i < len; i++) {
    n[i] = nodes[i];
  }
***REMOVED***



xrx.mvc.Cursor.getNode = function(pos) {
  return xrx.mvc.Cursor.node_[pos];
***REMOVED***
