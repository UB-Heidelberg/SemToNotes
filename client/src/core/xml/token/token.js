***REMOVED***
***REMOVED*** @fileoverview A static class providing constants for
***REMOVED***   the token classes.
***REMOVED***

goog.provide('xrx.token');



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
***REMOVED*** @const***REMOVED*** xrx.token.COMMENT = 9;
***REMOVED*** @const***REMOVED*** xrx.token.PI = 10;
***REMOVED*** @const***REMOVED*** xrx.token.END_TAG = 11;
***REMOVED*** @const***REMOVED*** xrx.token.NOT_TAG = 13;



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
***REMOVED*** @const***REMOVED*** xrx.token.START_EMPTY_TAG = 12;

// either xrx.token.END_TAG or xrx.token.START_EMPTY_TAG
***REMOVED*** @const***REMOVED*** xrx.token.TAG = 14;



***REMOVED***
***REMOVED*** Complex tokens
***REMOVED***
// A selection of sequenced tokens of 
// different type forming a peace of 
// well-formed XML. Corresponds to what 
// a DOM element is.
***REMOVED*** @const***REMOVED*** xrx.token.FRAGMENT = 15;

// xrx.token.START_TAG plus xrx.token.END_TAG
***REMOVED*** @const***REMOVED*** xrx.token.START_END = 16;

// same as xrx.token.FRAGMENT, but may 
// start and end with xrx.token.NOT_TAG 
// or even may end or start with a part 
// of xrx.token.NOT_TAG
***REMOVED*** @const***REMOVED*** xrx.token.MIXED = 17;

// numbering of tokens is important to 
// compute document order!
