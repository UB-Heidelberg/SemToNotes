/**
 * @fileoverview A class implementing low-level update operations 
 * on XML tokens.
 */

goog.provide('xrx.update');



goog.require('xrx.serialize');
goog.require('xrx.stream');
goog.require('xrx.token');



/**
 * Shared function for all update operations.
 * @private
 */
xrx.update = function() {};



/**
 * Shared function for all replace operations.
 * @private
 */
xrx.update.replace_ = function(instance, token, xml) {
  var diff = xml.length - token.length();

  instance.update(token.offset(), token.length(), xml);

  token.length(xml.length);

  return diff;
};



/**
 * Shared function for all insert operations.
 * @private
 */
xrx.update.insert_ = function(instance, offset, xml) {

  instance.update(offset, 0, xml);

  return xml.length;
};



/**
 * Shared function for all remove operations.
 * @private
 */
xrx.update.remove_ = function(instance, offset, length) {

  instance.update(offset, length, '');

  return -length;
};



/**
 * Replaces a not-tag token with another not-tag token.
 * 
 * @param {!xrx.instance} instance The instance to be updated.
 * @param {!xrx.token.NotTag} target The token to be replaced.
 * @param {!string} string The new not-tag string. 
 */
xrx.update.replaceNotTag = function(instance, target, string) {
  return xrx.update.replace_(instance, target, string);
};



xrx.update.replaceTagName = function(instance, token, localName, opt_namespaceUri) {
  //TODO: implement this
};



/**
 * Replaces the value of an attribute with another value.
 * 
 * @param {!xrx.instance} instance The instance to be updated.
 * @param {!xrx.token.AttrValue} target The token to be replaced.
 * @param {!string} token The new value. 
 */
xrx.update.replaceAttrValue = function(instance, target, value) {
  return xrx.update.replace_(instance, target, value);
};



/**
 * Inserts a not-tag token into another not-tag token at an offset.
 * 
 * @param {!xrx.instance} instance The instance to be updated.
 * @param {!xrx.token.NotTag} target The token to be replaced.
 * @param {!integer} target The offset relative to the not-tag token.
 * @param {!string} string The new not-tag string. 
 */
xrx.update.insertNotTag = function(instance, target, offset, string) {
  return xrx.update.insert_(instance, target.offset() + offset, string);
};



/**
 * Inserts a new empty tag into a not-tag token.
 * 
 * @param {!xrx.instance} instance The instance to be updated.
 * @param {!xrx.token.NotTag} target The not-tag token where the empty tag is inserted.
 * @param {!integer} offset The offset relative to the not-tag token.
 * @param {!string} localName The local name of the new token.
 * @param {!string} opt_namespaceUri The namespace URI of the new token.
 */
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
};



/**
 * Wrap a piece of XML with a start-tag and a end-tag.
 * 
 * @param {!xrx.instance} instance The instance to be updated.
 * @param {!xrx.token.NotTag} target1 The left not-tag token where the new
 * start-tag shall be inserted.
 * @param {!xrx.token.NotTag} target2 The right not-tag token where the
 * new end-tag shall be inserted.
 * @param {!integer} offset1 The offset relative to the left not-tag token.
 * @param {!integer} offset2 The offset relative to the right not-tag token.
 * @param {!string} localName The local name of the new token.
 * @param {!string} opt_namespaceUri The namespace URI of the new token.
 */
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
};



xrx.update.insertFragment = function(instance, target, offset, localName,
    opt_namespaceUri) {
  //TODO: implement this
};



xrx.update.insertMixed = function(instance, target, offset, localName,
    opt_namespaceUri) {
  //TODO: implement this
};



/**
 * Inserts a new attribute into a start-tag or a empty tag.
 * 
 * @param {!xrx.instance} instance The instance to be updated.
 * @param {!(xrx.token.StartTag|xrx.token.EmptyTag)} target The tag where the attribute 
 * shall be inserted.
 * @param {!string} qName The qualified name of the new attribute.
 * @param {!string} opt_namespaceUri The namespace URI of the new attribute.
 */
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
};



/**
 * Removes characters from a not-tag token.
 * 
 * @param {!xrx.instance} instance The instance to be updated.
 * @param {!xrx.token.NotTag} target The token to be replaced.
 * @param {!integer} target The offset relative to the not-tag token.
 * @param {!integer} string The number of characters to be removed. 
 */
xrx.update.reduceNotTag = function(instance, target, offset, length) {
  return xrx.update.remove_(instance, target.offset() + offset, length);
};



/**
 * Removes a empty tag.
 * 
 * @param {!xrx.instance} instance The instance to be updated.
 * @param {!xrx.token.EmptyTag} target The tag to be removed.
 */
xrx.update.removeEmptyTag = function(instance, token) {
  var diff = xrx.update.remove_(instance, token.offset(), token.length());

  //TODO: remove namespace declaration from index

  return diff;
};



/**
 * Removes a start-tag and a end-tag at once but keeping the content
 * between the two tags. 
 * 
 * @param {!xrx.instance} instance The instance to be updated.
 * @param {!xrx.token.StartTag} token1 The start-tag to be removed.
 * @param {!xrx.token.EndTag} token2 The end-tag to be removed.
 */
xrx.update.removeStartEndTag = function(instance, token1, token2) {
  var diff2 = xrx.update.remove_(instance, token2.offset(), token2.length());
  var diff1 = xrx.update.remove_(instance, token1.offset(), token1.length());

  //TODO: remove namespace declaration from index

  return [diff1, diff2];
};



/**
 * Removes a start-tag, a end-tag and the content between the two
 * tags. 
 * 
 * @param {!xrx.instance} instance The instance to be updated.
 * @param {!xrx.token.Fragment} token The tag to be removed.
 */
xrx.update.removeFragment = function(instance, token) {
  //TODO: implement this
};



/**
 * Removes a mixed set of nodes. 
 * 
 * @param {!xrx.instance} instance The instance to be updated.
 * @param {!xrx.token.Mixed} token The token to be removed.
 */
xrx.update.removeMixed = function(instance, token) {
  //TODO: implement this
};



/**
 * Removes a attribute token.
 * 
 * @param {!xrx.instance} instance The instance to be updated.
 * @param {!xrx.token.Attribute} token The token to be removed.
 */
xrx.update.removeAttribute = function(instance, token) {
  var diff = xrx.update.remove_(instance, token.offset() - 1, token.length() + 1);

  return diff;
};
