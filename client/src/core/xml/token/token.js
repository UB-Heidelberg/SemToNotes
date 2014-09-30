***REMOVED***
***REMOVED*** @fileoverview A static token class providing functions and
***REMOVED*** constants.
***REMOVED***

goog.provide('xrx.token');



goog.require('xrx.label');
goog.require('xrx.token.Attribute');
goog.require('xrx.token.AttrName');
goog.require('xrx.token.AttrValue');
goog.require('xrx.token.EmptyTag');
goog.require('xrx.token.EndTag');
goog.require('xrx.token.Namespace');
goog.require('xrx.token.NotTag');
goog.require('xrx.token.NsPrefix');
goog.require('xrx.token.NsUri');
goog.require('xrx.token.Root');
goog.require('xrx.token.StartEmptyTag');
goog.require('xrx.token.StartTag');
goog.require('xrx.token.Tag');
goog.require('xrx.token.TagName');



***REMOVED***
***REMOVED*** Static token class. If included, all available tokens are
***REMOVED*** included at once.
***REMOVED***
xrx.token = function() {***REMOVED***



***REMOVED***
***REMOVED*** Primary tokens
***REMOVED***
***REMOVED*** @const***REMOVED*** xrx.token.START_TAG = 7;
***REMOVED*** @const***REMOVED*** xrx.token.EMPTY_TAG = 8;
***REMOVED*** @const***REMOVED*** xrx.token.END_TAG = 9;
***REMOVED*** @const***REMOVED*** xrx.token.NOT_TAG = 11;



***REMOVED***
***REMOVED*** Secondary tokens (part of a tag)
***REMOVED***
***REMOVED*** @const***REMOVED*** xrx.token.TAG_NAME = 5;
***REMOVED*** @const***REMOVED*** xrx.token.ATTRIBUTE = 1;
***REMOVED*** @const***REMOVED*** xrx.token.ATTR_NAME = 2;
***REMOVED*** @const***REMOVED*** xrx.token.ATTR_VALUE = 3;
***REMOVED*** @const***REMOVED*** xrx.token.NAMESPACE = 4;
***REMOVED*** @const***REMOVED*** xrx.token.NS_PREFIX = 5;
***REMOVED*** @const***REMOVED*** xrx.token.NS_URI = 6;



***REMOVED***
***REMOVED*** Generic tokens
***REMOVED***
***REMOVED*** @const***REMOVED*** xrx.token.UNDEFINED = -1;

// either xrx.token.START_TAG or xrx.token.EMPTY_TAG
***REMOVED*** @const***REMOVED*** xrx.token.START_EMPTY_TAG = 10;

// either xrx.token.END_TAG or xrx.token.START_EMPTY_TAG
***REMOVED*** @const***REMOVED*** xrx.token.TAG = 12;



***REMOVED***
***REMOVED*** Complex tokens
***REMOVED***
// A selection of sequenced tokens of 
// different type forming a peace of 
// well-formed XML. Corresponds to what 
// a DOM element is.
***REMOVED*** @const***REMOVED*** xrx.token.FRAGMENT = 13;

// xrx.token.START_TAG plus xrx.token.END_TAG
***REMOVED*** @const***REMOVED*** xrx.token.START_END = 14;

// same as xrx.token.FRAGMENT, but may 
// start and end with xrx.token.NOT_TAG 
// or even may end or start with a part 
// of xrx.token.NOT_TAG
***REMOVED*** @const***REMOVED*** xrx.token.MIXED = 15;

// numbering of tokens is important to 
// compute document order!



***REMOVED***
***REMOVED*** Converts a generic token into its native form.
***REMOVED***
***REMOVED*** @param {!xrx.token} token The token to convert.
***REMOVED*** @return {?}
***REMOVED***
xrx.token.native = function(token) {
  var newToken;
  var label = token.label().clone();
  var offset = token.offset();
  var length = token.length();
  
  var convert = function(constr) {
    var tmp = new constr();
    tmp.label(label);
    tmp.offset(offset);
    tmp.length(length);
    return tmp;
 ***REMOVED*****REMOVED***
  
  switch(token.type()) {
  case xrx.token.START_TAG:
    newToken = convert(xrx.token.StartTag);
    break;
  case xrx.token.END_TAG:
    newToken = convert(xrx.token.EndTag);
    break;
  case xrx.token.EMPTY_TAG:
    newToken = convert(xrx.token.EmptyTag);
    break;
  case xrx.token.NOT_TAG:
    newToken = convert(xrx.token.NotTag);
    break;
  case xrx.token.TAG_NAME:
    newToken = convert(xrx.token.TagName);
    break;
  case xrx.token.ATTRIBUE:
    newToken = convert(xrx.token.Attribute);
    break;
  case xrx.token.ATTR_NAME:
    newToken = convert(xrx.token.AttrName);
    break;
  case xrx.token.ATTR_VALUE:
    newToken = convert(xrx.token.AttrValue);
    break;
  default:
    throw Error('Token is generic or unknown.');
    break;  
 ***REMOVED*****REMOVED***
  
  return newToken;
***REMOVED***

