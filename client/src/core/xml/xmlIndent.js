***REMOVED***
***REMOVED*** @fileoverview A static class providing functions for XML indentation.
***REMOVED***

goog.provide('xrx.xml.Indent');



***REMOVED***
***REMOVED*** A static class providing functions for XML indentation.
***REMOVED***
xrx.xml.Indent = function() {***REMOVED***



***REMOVED***
***REMOVED*** Serialize a XML fragment with indentation in forward direction.
***REMOVED*** @return {string} The indented XML fragment.
***REMOVED***
xrx.xml.Indent.forward = function(xml, indent, opt_start, opt_maxLines) {
  var traverse = new xrx.xml.Traverse(xml);
  var lastToken = opt_start ? opt_start.type() : xrx.token.UNDEFINED;
  var output = '';
  var lines = 0;

  var line = function(label, offset, length1, length2) {

    output += traverse.xml().substr(offset, length1);

    if (length1 !== length2) {
      output += traverse.xml().substr(offset + length1, length2 - length1);
    }
 ***REMOVED*****REMOVED***
  
  var newLine = function(label, offset, length1, length2) {
    var level = label.length() - 1;

    output += '\n';

    for(var i = 0, ind = level***REMOVED*** indent; i < ind; i++) {
      output += ' ';
    }
    line(label, offset, length1, length2);
    if (opt_maxLines && (++lines >= opt_maxLines)) traverse.stop();
 ***REMOVED*****REMOVED***

  var inLine = function(label, offset, length1, length2) {

    line(label, offset, length1, length2);
 ***REMOVED*****REMOVED***
  
  traverse.rowStartTag = function(label, offset, length1, length2) {

    if (lastToken === xrx.token.START_TAG || lastToken === xrx.token.END_TAG) {
      newLine(label, offset, length1, length2);
    } else {
      inLine(label, offset, length1, length2);
   ***REMOVED*****REMOVED***

    length1 !== length2 ? lastToken = xrx.token.NOT_TAG : 
        lastToken = xrx.token.START_TAG;
 ***REMOVED*****REMOVED***
  
  traverse.rowEmptyTag = function(label, offset, length1, length2) {

    if (lastToken === xrx.token.START_TAG || lastToken === xrx.token.END_TAG) {
      newLine(label, offset, length1, length2);
    } else {
      inLine(label, offset, length1, length2);
   ***REMOVED*****REMOVED***

    length1 !== length2 ? lastToken = xrx.token.NOT_TAG : 
      lastToken = xrx.token.END_TAG;
 ***REMOVED*****REMOVED***
  
  traverse.rowEndTag = function(label, offset, length1, length2) {

    if (lastToken === xrx.token.NOT_TAG || lastToken === xrx.token.START_TAG) {
      inLine(label, offset, length1, length2);
    } else {
      newLine(label, offset, length1, length2);
    }

    length1 !== length2 ? lastToken = xrx.token.NOT_TAG : 
      lastToken = xrx.token.END_TAG;
 ***REMOVED*****REMOVED***
  
  traverse.forward(opt_start);
  
  return output;
***REMOVED***



***REMOVED***
***REMOVED*** Serialize a XML fragment with indentation in backward direction.
***REMOVED*** @return {string} The indented XML fragment.
***REMOVED***
xrx.xml.Indent.backward = function(xml, indent, opt_start, opt_maxLines) {
  var traverse = new xrx.xml.Traverse(xml);
  var lastToken = opt_start ? opt_start.type() : xrx.token.UNDEFINED;
  var output = '';
  var lines = 0;

  var line = function(label, offset, length1, length2) {

    if (length1 !== length2) {
      output = traverse.xml().substr(offset + length1, length2 - length1) + output;
    }

    output = traverse.xml().substr(offset, length1) + output;
 ***REMOVED*****REMOVED***
  
  var newLine = function(label, offset, length1, length2) {
    var level = label.length() - 1;

    for(var i = 0, ind = level***REMOVED*** indent; i < ind; i++) {
      output = ' ' + output;
    }

    output = '\n' + output;

    line(label, offset, length1, length2);

    if (opt_maxLines && (++lines >= opt_maxLines)) traverse.stop();
 ***REMOVED*****REMOVED***

  var inLine = function(label, offset, length1, length2) {

    line(label, offset, length1, length2);
 ***REMOVED*****REMOVED***
  
  traverse.rowStartTag = function(label, offset, length1, length2) {

    if (lastToken === xrx.token.START_TAG) {
      label.push(0);
      newLine(label, offset, length1, length2);
    } else {
      inLine(label, offset, length1, length2);
    }

    lastToken = xrx.token.START_TAG;
 ***REMOVED*****REMOVED***
  
  traverse.rowEmptyTag = function(label, offset, length1, length2) {

    if (lastToken === xrx.token.END_TAG) {
      label.parent();
      newLine(label, offset, length1, length2);
    } else {
      newLine(label, offset, length1, length2);
    }

    lastToken = xrx.token.START_TAG;
 ***REMOVED*****REMOVED***
  
  traverse.rowEndTag = function(label, offset, length1, length2) {

    if (lastToken === xrx.token.UNDEFINED) {
      inLine(label, offset, length1, length2);
    } else if (lastToken === xrx.token.END_TAG) {
      label.parent();
      newLine(label, offset, length1, length2);
    } else {
      newLine(label, offset, length1, length2);
    }

    lastToken = xrx.token.END_TAG;
 ***REMOVED*****REMOVED***
  
  traverse.backward(opt_start);
  
  return output;
***REMOVED***
