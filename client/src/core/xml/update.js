***REMOVED***
***REMOVED*** @fileoverview A class implementing low-level update operations 
***REMOVED*** on XML tokens.
***REMOVED***

goog.provide('xrx.update');



goog.require('xrx.serialize');
goog.require('xrx.stream');
goog.require('xrx.token');



***REMOVED***
***REMOVED*** Shared function for all update operations.
***REMOVED*** @private
***REMOVED***
xrx.update = function() {***REMOVED***



***REMOVED***
***REMOVED*** Shared function for all replace operations.
***REMOVED*** @private
***REMOVED***
xrx.update.replace_ = function(instance, token, xml) {
  var diff = xml.length - token.length();

  instance.update(token.offset(), token.length(), xml);

  token.length(xml.length);

  return diff;
***REMOVED***



***REMOVED***
***REMOVED*** Shared function for all insert operations.
***REMOVED*** @private
***REMOVED***
xrx.update.insert_ = function(instance, offset, xml) {

  instance.update(offset, 0, xml);

  return xml.length;
***REMOVED***



***REMOVED***
***REMOVED*** Shared function for all remove operations.
***REMOVED*** @private
***REMOVED***
xrx.update.remove_ = function(instance, offset, length) {

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
xrx.update.replaceNotTag = function(instance, target, string) {
  return xrx.update.replace_(instance, target, string);
***REMOVED***



xrx.update.replaceTagName = function(instance, token, localName, opt_namespaceUri) {
  //TODO: implement this
***REMOVED***



***REMOVED***
***REMOVED*** Replaces the value of an attribute with another value.
***REMOVED*** 
***REMOVED*** @param {!xrx.mvc.Instance} instance The instance to be updated.
***REMOVED*** @param {!xrx.token.AttrValue} target The token to be replaced.
***REMOVED*** @param {!string} token The new value. 
***REMOVED***
xrx.update.replaceAttrValue = function(instance, target, value) {
  return xrx.update.replace_(instance, target, value);
***REMOVED***



***REMOVED***
***REMOVED*** Inserts a not-tag token into another not-tag token at an offset.
***REMOVED*** 
***REMOVED*** @param {!xrx.mvc.Instance} instance The instance to be updated.
***REMOVED*** @param {!xrx.token.NotTag} target The token to be replaced.
***REMOVED*** @param {!integer} target The offset relative to the not-tag token.
***REMOVED*** @param {!string} string The new not-tag string. 
***REMOVED***
xrx.update.insertNotTag = function(instance, target, offset, string) {
  return xrx.update.insert_(instance, target.offset() + offset, string);
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
xrx.update.insertEmptyTag = function(instance, target, offset, localName,
    opt_namespaceUri) {
  var diff;

  if (!opt_namespaceUri) {
    diff = xrx.update.insert_(instance, target.offset() + offset,
        xrx.serialize.emptyTag(localName));
  } else {
    var nsPrefix = instance.getIndex().getNamespacePrefix(target, opt_namespaceUri);

    diff = xrx.update.insert_(instance, target.offset() + offset,
        xrx.serialize.emptyTagNs(nsPrefix, localName, opt_namespaceUri));

    //TODO: add namespace declaration to index
  }

  return diff;
***REMOVED***



***REMOVED***
***REMOVED*** Wrap a piece of XML with a start-tag and a end-tag.
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
xrx.update.insertStartEndTag = function(instance, target1, target2, offset1, offset2,
    localName, opt_namespaceUri) {
  var diffs;
  var diff2;

  if (!opt_namespaceUri) {

    diff1 = xrx.update.insert_(instance, target2.offset() + offset2,
        xrx.serialize.endTag(localName));
    diff2 = xrx.update.insert_(instance, target1.offset() + offset1,
        xrx.serialize.startTag(localName));
  } else {
    var nsPrefix = instance.getIndex().getNamespacePrefix(target1, opt_namespaceUri);

    diff1 = xrx.update.insert_(instance, target2.offset() + offset2,
        xrx.serialize.endTagNs(nsPrefix, localName, opt_namespaceUri));

    diff2 = xrx.update.insert_(instance, target1.offset() + offset1,
        xrx.serialize.startTagNs(nsPrefix, localName, opt_namespaceUri));

    //TODO: add namespace declaration to index
  }

  return [diff1, diff2];
***REMOVED***



xrx.update.insertFragment = function(instance, target, offset, localName,
    opt_namespaceUri) {
  //TODO: implement this
***REMOVED***



xrx.update.insertMixed = function(instance, target, offset, localName,
    opt_namespaceUri) {
  //TODO: implement this
***REMOVED***



***REMOVED***
***REMOVED*** Inserts a new attribute into a start-tag or a empty tag.
***REMOVED*** 
***REMOVED*** @param {!xrx.mvc.Instance} instance The instance to be updated.
***REMOVED*** @param {!(xrx.token.StartTag|xrx.token.EmptyTag)} target The tag where the attribute 
***REMOVED*** shall be inserted.
***REMOVED*** @param {!string} qName The qualified name of the new attribute.
***REMOVED*** @param {!string} opt_namespaceUri The namespace URI of the new attribute.
***REMOVED***
xrx.update.insertAttribute = function(instance, parent, qName,
    opt_namespaceUri) {
  var diff;
  var loc = instance.getStream().tagName(parent.xml(instance.xml()));

  if (!opt_namespaceUri) {
    diff = xrx.update.insert_(instance, parent.offset() + loc.offset +
        loc.length, xrx.serialize.attribute(qName, ''));
  } else {
    var nsPrefix1 = instance.getIndex().getNamespacePrefix(parent, opt_namespaceUri);
    var nsPrefix2 = qName.split(':')[0];
    if (nsPrefix1 !== 'xmlns:' + nsPrefix2 && nsPrefix1 !== undefined &&
        nsPrefix1 !== 'xmlns') throw Error('Prefix ' + nsPrefix2 +
        ' is not bound to namespace ' + opt_namespaceUri + '.');

    diff = xrx.update.insert_(instance, parent.offset() + loc.offset +
        loc.length, xrx.serialize.attributeNs(nsPrefix1, qName, opt_namespaceUri));

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
xrx.update.reduceNotTag = function(instance, target, offset, length) {
  return xrx.update.remove_(instance, target.offset() + offset, length);
***REMOVED***



***REMOVED***
***REMOVED*** Removes a empty tag.
***REMOVED*** 
***REMOVED*** @param {!xrx.mvc.Instance} instance The instance to be updated.
***REMOVED*** @param {!xrx.token.EmptyTag} target The tag to be removed.
***REMOVED***
xrx.update.removeEmptyTag = function(instance, token) {
  var diff = xrx.update.remove_(instance, token.offset(), token.length());

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
xrx.update.removeStartEndTag = function(instance, token1, token2) {
  var diff2 = xrx.update.remove_(instance, token2.offset(), token2.length());
  var diff1 = xrx.update.remove_(instance, token1.offset(), token1.length());

  //TODO: remove namespace declaration from index

  return [diff1, diff2];
***REMOVED***



***REMOVED***
***REMOVED*** Removes a start-tag, a end-tag and the content between the two
***REMOVED*** tags. 
***REMOVED*** 
***REMOVED*** @param {!xrx.mvc.Instance} instance The instance to be updated.
***REMOVED*** @param {!xrx.token.Fragment} token The tag to be removed.
***REMOVED***
xrx.update.removeFragment = function(instance, token) {
  //TODO: implement this
***REMOVED***



***REMOVED***
***REMOVED*** Removes a mixed set of nodes. 
***REMOVED*** 
***REMOVED*** @param {!xrx.mvc.Instance} instance The instance to be updated.
***REMOVED*** @param {!xrx.token.Mixed} token The token to be removed.
***REMOVED***
xrx.update.removeMixed = function(instance, token) {
  //TODO: implement this
***REMOVED***



***REMOVED***
***REMOVED*** Removes a attribute token.
***REMOVED*** 
***REMOVED*** @param {!xrx.mvc.Instance} instance The instance to be updated.
***REMOVED*** @param {!xrx.token.Attribute} token The token to be removed.
***REMOVED***
xrx.update.removeAttribute = function(instance, token) {
  var diff = xrx.update.remove_(instance, token.offset() - 1, token.length() + 1);

  return diff;
***REMOVED***
