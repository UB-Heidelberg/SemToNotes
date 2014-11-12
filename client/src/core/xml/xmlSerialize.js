***REMOVED***
***REMOVED*** @fileoverview A static class providing functions for XML token
***REMOVED***     serialization.
***REMOVED***

goog.provide('xrx.xml.Serialize');



goog.require('xrx.token');
goog.require('xrx.xml.Traverse');



***REMOVED***
***REMOVED*** A static class providing functions for XML token
***REMOVED*** serialization.
***REMOVED***
xrx.xml.Serialize = function() {***REMOVED***



***REMOVED***
***REMOVED*** Serialize an attribute token.
***REMOVED*** @return {string} The attribute token string.
***REMOVED***
xrx.xml.Serialize.attribute = function(qName, value) {
  return ' ' + qName + '="' + value.replace(/\"/g, "'") + '"';
***REMOVED***



***REMOVED***
***REMOVED*** Serialize an attribute token with namespace.
***REMOVED*** @return {string} The attribute token string.
***REMOVED***
xrx.xml.Serialize.attributeNs = function(nsPrefix, qName, namespaceUri) {
  if (nsPrefix === undefined || nsPrefix === "xmlns") {
    return xrx.xml.Serialize.namespace('xmlns:' + qName.split(':')[0], namespaceUri) +
        xrx.xml.Serialize.attribute(qName, '');
  } else {
    return xrx.xml.Serialize.attribute(qName, '');
  }
***REMOVED***



***REMOVED***
***REMOVED*** Serialize a comment token.
***REMOVED*** @return {string} The comment token string.
***REMOVED***
xrx.xml.Serialize.comment = function(ch) {
  return '<!--' + ch + '-->';
***REMOVED***



***REMOVED***
***REMOVED*** Serialize an empty-tag token.
***REMOVED*** @return {string} The empty-tag token string.
***REMOVED***
xrx.xml.Serialize.emptyTag = function(qName, opt_namespaces, opt_attributes) {
  var namespaces = opt_namespaces || '';
  var attributes = opt_attributes || '';
  return '<' + qName + namespaces + attributes + '/>';
***REMOVED***



***REMOVED***
***REMOVED*** Serialize an empty-tag token with namespace.
***REMOVED*** @return {string} The empty-tag token string.
***REMOVED***
xrx.xml.Serialize.emptyTagNs = function(nsPrefix, localName, namespaceUri) {
  return xrx.xml.Serialize.tagNs_(xrx.xml.Serialize.emptyTag, nsPrefix, localName,
      namespaceUri);
***REMOVED***



***REMOVED***
***REMOVED*** Serialize an end-tag token.
***REMOVED*** @return {string} The end-tag token string.
***REMOVED***
xrx.xml.Serialize.endTag = function(qName) {
  return '</' + qName + '>';
***REMOVED***



***REMOVED***
***REMOVED*** Serialize an end-tag token with namespace.
***REMOVED*** @return {string} The end-tag token string.
***REMOVED***
xrx.xml.Serialize.endTagNs = function(nsPrefix, localName, namespaceUri) {
  if (nsPrefix === undefined || nsPrefix === 'xmlns') {
    return xrx.xml.Serialize.endTag(localName);
  } else {
    var colonIndex = nsPrefix.indexOf(':');
    return xrx.xml.Serialize.endTag(nsPrefix.substr(colonIndex + 1) + ':' + localName);
  }
***REMOVED***



***REMOVED***
***REMOVED*** Serialize a namespace token.
***REMOVED*** @return {string} The namespace token string.
***REMOVED***
xrx.xml.Serialize.namespace = function(prefix, uri) {
  return ' ' + prefix + '="' + uri + '"';
***REMOVED***



***REMOVED***
***REMOVED*** Serialize a processing instruction token.
***REMOVED*** @return {string} The processing instruction token as string.
***REMOVED***
xrx.xml.Serialize.processingInstruction = function(target, data) {
  return '<?' + target + ' ' + data + '?>';
***REMOVED***



***REMOVED***
***REMOVED*** Serialize a start-empty-tag token.
***REMOVED*** @return {string} The start-empty-tag token string.
***REMOVED***
xrx.xml.Serialize.startEmptyTag = function(qName, opt_namespaces, opt_attributes) {
  var namespaces = opt_namespaces || '';
  var attributes = opt_attributes || '';
  return '<' + qName + namespaces + attributes;
***REMOVED***



***REMOVED***
***REMOVED*** Serialize a start-empty-tag token with namespace.
***REMOVED*** @return {string} The start-empty-tag token string.
***REMOVED***
xrx.xml.Serialize.startEmptyTagNs = function(nsPrefix, localName, namespaceUri) {
  return xrx.xml.Serialize.tagNs_(xrx.xml.Serialize.startEmptyTag, nsPrefix, localName,
      namespaceUri);
***REMOVED***




***REMOVED***
***REMOVED*** Serialize a start-tag token.
***REMOVED*** @return {string} The start-tag token string.
***REMOVED***
xrx.xml.Serialize.startTag = function(qName, opt_namespaces, opt_attributes) {
  var namespaces = opt_namespaces || '';
  var attributes = opt_attributes || '';
  return '<' + qName + namespaces + attributes + '>';
***REMOVED***



***REMOVED***
***REMOVED*** Serialize a start-tag token with namespace.
***REMOVED*** @return {string} The start-tag token string.
***REMOVED***
xrx.xml.Serialize.startTagNs = function(nsPrefix, localName, namespaceUri) {
  return xrx.xml.Serialize.tagNs_(xrx.xml.Serialize.startTag, nsPrefix, localName,
      namespaceUri);
***REMOVED***



***REMOVED***
***REMOVED*** Shared function for tag serialization.
***REMOVED*** @private
***REMOVED*** @return {string} The tag string.
***REMOVED***
xrx.xml.Serialize.tagNs_ = function(func, nsPrefix, localName, namespaceUri) {
  if (nsPrefix === undefined) {
    return func(localName, xrx.xml.Serialize.namespace('xmlns',
        namespaceUri));
  } else if (nsPrefix === 'xmlns') {
    return func(localName);
  } else {
    var colonIndex = nsPrefix.indexOf(':');
    return func(nsPrefix.substr(colonIndex + 1) + ':' + localName);
  }
***REMOVED***
