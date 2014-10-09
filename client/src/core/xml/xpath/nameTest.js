***REMOVED***
***REMOVED*** @fileoverview A class implementing the XPath NameTest construct.
***REMOVED***

goog.provide('xrx.xpath.NameTest');



goog.require('xrx.node');



***REMOVED***
***REMOVED*** Constructs a NameTest based on the XPath grammar.
***REMOVED*** http://www.w3.org/TR/xpath/#NT-NameTest
***REMOVED***
***REMOVED*** @param {string} name Name to be tested.
***REMOVED*** @param {string=} opt_namespaceUri Namespace URI.
***REMOVED***
***REMOVED*** @implements {xrx.xpath.NodeTest}
***REMOVED***
xrx.xpath.NameTest = function(name, opt_namespaceUri) {

 ***REMOVED*****REMOVED***
  ***REMOVED*** @type {string}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.name_ = name;

 ***REMOVED*****REMOVED***
  ***REMOVED*** @type {string}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.namespaceUri_ = opt_namespaceUri || '';

 ***REMOVED*****REMOVED***
  ***REMOVED*** @type {string}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.nameExpanded_ = xrx.node.getNameExpanded(this.namespaceUri_,
      this.name_);
***REMOVED***



***REMOVED***
***REMOVED*** @override
***REMOVED***
xrx.xpath.NameTest.prototype.matches = function(node) {
  var type = node.getType();
  if (type !== xrx.node.ELEMENT &&
      type !== xrx.node.ATTRIBUTE) {
    return false;
  }
  if (this.name_ === '*') {
    return true;
  } else if (this.namespaceUri_ === '') {
    return this.name_ === node.getName();
  } else {
    var name = node.getName();
    var localName = xrx.node.getNameLocal(name);
    var nsUri = node.getNamespaceUri(xrx.node.getNamePrefix(name));
    var expandedName = xrx.node.getNameExpanded(nsUri, localName);
    return this.nameExpanded_ === expandedName;
  }
***REMOVED***


***REMOVED***
***REMOVED*** @override
***REMOVED***
xrx.xpath.NameTest.prototype.getName = function() {
  return this.name_;
***REMOVED***


***REMOVED***
***REMOVED*** @override
***REMOVED***
xrx.xpath.NameTest.prototype.getNameExpanded = function() {
  return this.nameExpanded_;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the namespace URI to be matched.
***REMOVED***
***REMOVED*** @return {string} Namespace URI.
***REMOVED***
xrx.xpath.NameTest.prototype.getNamespaceUri = function() {
  return this.namespaceUri_;
***REMOVED***


***REMOVED***
***REMOVED*** @override
***REMOVED***
xrx.xpath.NameTest.prototype.toString = function() {
  var prefix = this.namespaceUri_ + ':';
  return 'Name Test: ' + prefix + this.name_;
***REMOVED***


***REMOVED***
***REMOVED*** Returns whether the test needs text nodes to match.
***REMOVED*** @return {boolean}
***REMOVED***
xrx.xpath.NameTest.prototype.needsTextNode = function() {
  return false;
***REMOVED***
