***REMOVED***
***REMOVED*** @fileoverview A static class implementing update operations 
***REMOVED***     on XML tokens.
***REMOVED***

goog.provide('xrx.xml.Update');



goog.require('xrx.xml.Serialize');
***REMOVED***
goog.require('xrx.token');



***REMOVED***
***REMOVED*** A static class implementing update operations 
***REMOVED*** on XML tokens.
***REMOVED***
xrx.xml.Update = function() {***REMOVED***



***REMOVED***
***REMOVED*** Shared function for all replace operations.
***REMOVED*** @private
***REMOVED***
xrx.xml.Update.replace_ = function(instance, token, xml) {
  var diff = xml.length - token.length();
  instance.update(token.offset(), token.length(), xml);
  token.length(xml.length);
  return diff;
***REMOVED***



***REMOVED***
***REMOVED*** Shared function for all insert operations.
***REMOVED*** @private
***REMOVED***
xrx.xml.Update.insert_ = function(instance, offset, xml) {
  instance.update(offset, 0, xml);
  return xml.length;
***REMOVED***



***REMOVED***
***REMOVED*** Shared function for all remove operations.
***REMOVED*** @private
***REMOVED***
xrx.xml.Update.remove_ = function(instance, offset, length) {
  instance.update(offset, length, '');
  return -length;
***REMOVED***



***REMOVED***
***REMOVED*** Replaces a not-tag token with another not-tag token.
***REMOVED*** 
***REMOVED*** @param {!xrx.mvc.Instance} instance The instance to be updated.
***REMOVED*** @param {!xrx.token.NotTag} target The token to be replaced.
***REMOVED*** @param {!string} string The new not-tag string. 
***REMOVED***
xrx.xml.Update.replaceNotTag = function(instance, target, string) {
  return xrx.xml.Update.replace_(instance, target, string);
***REMOVED***



xrx.xml.Update.replaceTagName = function(instance, token, localName, opt_namespaceUri) {
  //TODO: implement this
***REMOVED***



***REMOVED***
***REMOVED*** Replaces the value of an attribute with another value.
***REMOVED*** 
***REMOVED*** @param {!xrx.mvc.Instance} instance The instance to be updated.
***REMOVED*** @param {!xrx.token.AttrValue} target The token to be replaced.
***REMOVED*** @param {!string} token The new value. 
***REMOVED***
xrx.xml.Update.replaceAttrValue = function(instance, target, value) {
  return xrx.xml.Update.replace_(instance, target, value);
***REMOVED***



***REMOVED***
***REMOVED*** Inserts a not-tag token into another not-tag token at an offset.
***REMOVED*** 
***REMOVED*** @param {!xrx.mvc.Instance} instance The instance to be updated.
***REMOVED*** @param {!xrx.token.NotTag} target The token to be replaced.
***REMOVED*** @param {!integer} target The offset relative to the not-tag token.
***REMOVED*** @param {!string} string The new not-tag string. 
***REMOVED***
xrx.xml.Update.insertNotTag = function(instance, target, offset, string) {
  return xrx.xml.Update.insert_(instance, target.offset() + offset, string);
***REMOVED***



***REMOVED***
***REMOVED*** Inserts a new empty tag into a not-tag token.
***REMOVED*** 
***REMOVED*** @param {!xrx.mvc.Instance} instance The instance to be updated.
***REMOVED*** @param {!xrx.token.NotTag} target The not-tag token where the empty tag is inserted.
***REMOVED*** @param {!integer} offset The offset relative to the not-tag token.
***REMOVED*** @param {!string} localName The local name of the new token.
***REMOVED*** @param {!string} opt_namespaceUri The namespace URI of the new token.
***REMOVED***
xrx.xml.Update.insertEmptyTag = function(instance, target, offset, localName,
    opt_namespaceUri) {
  var diff;

  if (!opt_namespaceUri) {
    diff = xrx.xml.Update.insert_(instance, target.offset() + offset,
        xrx.xml.Serialize.emptyTag(localName));
  } else {
    var nsPrefix = instance.getIndex().getNamespacePrefix(target, opt_namespaceUri);

    diff = xrx.xml.Update.insert_(instance, target.offset() + offset,
        xrx.xml.Serialize.emptyTagNs(nsPrefix, localName, opt_namespaceUri));

    //TODO: add namespace declaration to index
  }

  return diff;
***REMOVED***



***REMOVED***
***REMOVED*** Wraps a piece of XML with a start-tag token and an end-tag token.
***REMOVED*** 
***REMOVED*** @param {!xrx.mvc.Instance} instance The instance to be updated.
***REMOVED*** @param {!xrx.token.NotTag} target1 The left not-tag token where the new
***REMOVED*** start-tag shall be inserted.
***REMOVED*** @param {!xrx.token.NotTag} target2 The right not-tag token where the
***REMOVED*** new end-tag shall be inserted.
***REMOVED*** @param {!integer} offset1 The offset relative to the left not-tag token.
***REMOVED*** @param {!integer} offset2 The offset relative to the right not-tag token.
***REMOVED*** @param {!string} localName The local name of the new token.
***REMOVED*** @param {!string} opt_namespaceUri The namespace URI of the new token.
***REMOVED***
xrx.xml.Update.insertStartEndTag = function(instance, target1, target2, offset1, offset2,
    localName, opt_namespaceUri) {
  var diffs;
  var diff2;

  if (!opt_namespaceUri) {

    diff1 = xrx.xml.Update.insert_(instance, target2.offset() + offset2,
        xrx.xml.Serialize.endTag(localName));
    diff2 = xrx.xml.Update.insert_(instance, target1.offset() + offset1,
        xrx.xml.Serialize.startTag(localName));
  } else {
    var nsPrefix = instance.getIndex().getNamespacePrefix(target1, opt_namespaceUri);

    diff1 = xrx.xml.Update.insert_(instance, target2.offset() + offset2,
        xrx.xml.Serialize.endTagNs(nsPrefix, localName, opt_namespaceUri));

    diff2 = xrx.xml.Update.insert_(instance, target1.offset() + offset1,
        xrx.xml.Serialize.startTagNs(nsPrefix, localName, opt_namespaceUri));

    //TODO: add namespace declaration to index
  }

  return [diff1, diff2];
***REMOVED***



xrx.xml.Update.insertFragment = function(instance, target, offset, localName,
    opt_namespaceUri) {
  //TODO: implement this
***REMOVED***



xrx.xml.Update.insertMixed = function(instance, target, offset, localName,
    opt_namespaceUri) {
  //TODO: implement this
***REMOVED***



***REMOVED***
***REMOVED*** Inserts a new attribute into a start-tag or a empty tag token.
***REMOVED*** 
***REMOVED*** @param {!xrx.mvc.Instance} instance The instance to be updated.
***REMOVED*** @param {!(xrx.token.StartTag|xrx.token.EmptyTag)} target The tag where the attribute 
***REMOVED*** shall be inserted.
***REMOVED*** @param {!string} qName The qualified name of the new attribute.
***REMOVED*** @param {!string} opt_namespaceUri The namespace URI of the new attribute.
***REMOVED***
xrx.xml.Update.insertAttribute = function(instance, parent, qName,
    opt_namespaceUri) {
  var diff;
  var loc = instance.getStream().tagName(parent.xml(instance.xml()));

  if (!opt_namespaceUri) {
    diff = xrx.xml.Update.insert_(instance, parent.offset() + loc.offset +
        loc.length, xrx.xml.Serialize.attribute(qName, ''));
  } else {
    var nsPrefix1 = instance.getIndex().getNamespacePrefix(parent, opt_namespaceUri);
    var nsPrefix2 = qName.split(':')[0];
    if (nsPrefix1 !== 'xmlns:' + nsPrefix2 && nsPrefix1 !== undefined &&
        nsPrefix1 !== 'xmlns') throw Error('Prefix ' + nsPrefix2 +
        ' is not bound to namespace ' + opt_namespaceUri + '.');

    diff = xrx.xml.Update.insert_(instance, parent.offset() + loc.offset +
        loc.length, xrx.xml.Serialize.attributeNs(nsPrefix1, qName, opt_namespaceUri));

    //TODO: add namespace declaration to index
  }

  return diff;
***REMOVED***



***REMOVED***
***REMOVED*** Removes characters from a not-tag token.
***REMOVED*** 
***REMOVED*** @param {!xrx.mvc.Instance} instance The instance to be updated.
***REMOVED*** @param {!xrx.token.NotTag} target The token to be replaced.
***REMOVED*** @param {!integer} target The offset relative to the not-tag token.
***REMOVED*** @param {!integer} string The number of characters to be removed. 
***REMOVED***
xrx.xml.Update.reduceNotTag = function(instance, target, offset, length) {
  return xrx.xml.Update.remove_(instance, target.offset() + offset, length);
***REMOVED***



***REMOVED***
***REMOVED*** Removes an empty tag.
***REMOVED*** 
***REMOVED*** @param {!xrx.mvc.Instance} instance The instance to be updated.
***REMOVED*** @param {!xrx.token.EmptyTag} target The tag to be removed.
***REMOVED***
xrx.xml.Update.removeEmptyTag = function(instance, token) {
  var diff = xrx.xml.Update.remove_(instance, token.offset(), token.length());

  //TODO: remove namespace declaration from index

  return diff;
***REMOVED***



***REMOVED***
***REMOVED*** Removes a start-tag and a end-tag at once but keeping the content
***REMOVED*** between the two tags. 
***REMOVED*** 
***REMOVED*** @param {!xrx.mvc.Instance} instance The instance to be updated.
***REMOVED*** @param {!xrx.token.StartTag} token1 The start-tag to be removed.
***REMOVED*** @param {!xrx.token.EndTag} token2 The end-tag to be removed.
***REMOVED***
xrx.xml.Update.removeStartEndTag = function(instance, token1, token2) {
  var diff2 = xrx.xml.Update.remove_(instance, token2.offset(), token2.length());
  var diff1 = xrx.xml.Update.remove_(instance, token1.offset(), token1.length());

  //TODO: remove namespace declaration from index

  return [diff1, diff2];
***REMOVED***



***REMOVED***
***REMOVED*** Removes a start-tag token, a end-tag token and the content between
***REMOVED*** the two tag tokens. 
***REMOVED*** 
***REMOVED*** @param {!xrx.mvc.Instance} instance The instance to be updated.
***REMOVED*** @param {!xrx.token.Fragment} token The tag to be removed.
***REMOVED***
xrx.xml.Update.removeFragment = function(instance, token) {
  //TODO: implement this
***REMOVED***



***REMOVED***
***REMOVED*** Removes a mixed sequence of tokens. 
***REMOVED*** 
***REMOVED*** @param {!xrx.mvc.Instance} instance The instance to be updated.
***REMOVED*** @param {!xrx.token.Mixed} token The token to be removed.
***REMOVED***
xrx.xml.Update.removeMixed = function(instance, token) {
  //TODO: implement this
***REMOVED***



***REMOVED***
***REMOVED*** Removes an attribute token.
***REMOVED*** 
***REMOVED*** @param {!xrx.mvc.Instance} instance The instance to be updated.
***REMOVED*** @param {!xrx.token.Attribute} token The token to be removed.
***REMOVED***
xrx.xml.Update.removeAttribute = function(instance, token) {
  var diff = xrx.xml.Update.remove_(instance, token.offset() - 1, token.length() + 1);

  return diff;
***REMOVED***
