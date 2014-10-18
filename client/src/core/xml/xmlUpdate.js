/**
 * @fileoverview A static class implementing update operations 
 *     on XML tokens.
 */

goog.provide('xrx.xml.Update');



goog.require('xrx.xml.Serialize');
goog.require('xrx.xml.Stream');
goog.require('xrx.token');



/**
 * A static class implementing update operations 
 * on XML tokens.
 */
xrx.xml.Update = function() {};



/**
 * Shared function for all replace operations.
 * @private
 */
xrx.xml.Update.replace_ = function(instance, token, xml) {
  var diff = xml.length - token.length();
  instance.update(token.offset(), token.length(), xml);
  token.length(xml.length);
  return diff;
};



/**
 * Shared function for all insert operations.
 * @private
 */
xrx.xml.Update.insert_ = function(instance, offset, xml) {
  instance.update(offset, 0, xml);
  return xml.length;
};



/**
 * Shared function for all remove operations.
 * @private
 */
xrx.xml.Update.remove_ = function(instance, offset, length) {
  instance.update(offset, length, '');
  return -length;
};



/**
 * Replaces a not-tag token with another not-tag token.
 * 
 * @param {!xrx.mvc.Instance} instance The instance to be updated.
 * @param {!xrx.token.NotTag} target The token to be replaced.
 * @param {!string} string The new not-tag string. 
 */
xrx.xml.Update.replaceNotTag = function(instance, target, string) {
  return xrx.xml.Update.replace_(instance, target, string);
};



xrx.xml.Update.replaceTagName = function(instance, token, localName, opt_namespaceUri) {
  //TODO: implement this
};



/**
 * Replaces the value of an attribute with another value.
 * 
 * @param {!xrx.mvc.Instance} instance The instance to be updated.
 * @param {!xrx.token.AttrValue} target The token to be replaced.
 * @param {!string} token The new value. 
 */
xrx.xml.Update.replaceAttrValue = function(instance, target, value) {
  return xrx.xml.Update.replace_(instance, target, value);
};



/**
 * Inserts a not-tag token into another not-tag token at an offset.
 * 
 * @param {!xrx.mvc.Instance} instance The instance to be updated.
 * @param {!xrx.token.NotTag} target The token to be replaced.
 * @param {!integer} target The offset relative to the not-tag token.
 * @param {!string} string The new not-tag string. 
 */
xrx.xml.Update.insertNotTag = function(instance, target, offset, string) {
  return xrx.xml.Update.insert_(instance, target.offset() + offset, string);
};



/**
 * Inserts a new empty tag into a not-tag token.
 * 
 * @param {!xrx.mvc.Instance} instance The instance to be updated.
 * @param {!xrx.token.NotTag} target The not-tag token where the empty tag is inserted.
 * @param {!integer} offset The offset relative to the not-tag token.
 * @param {!string} localName The local name of the new token.
 * @param {!string} opt_namespaceUri The namespace URI of the new token.
 */
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
};



/**
 * Wraps a piece of XML with a start-tag token and an end-tag token.
 * 
 * @param {!xrx.mvc.Instance} instance The instance to be updated.
 * @param {!xrx.token.NotTag} target1 The left not-tag token where the new
 * start-tag shall be inserted.
 * @param {!xrx.token.NotTag} target2 The right not-tag token where the
 * new end-tag shall be inserted.
 * @param {!integer} offset1 The offset relative to the left not-tag token.
 * @param {!integer} offset2 The offset relative to the right not-tag token.
 * @param {!string} localName The local name of the new token.
 * @param {!string} opt_namespaceUri The namespace URI of the new token.
 */
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
};



xrx.xml.Update.insertFragment = function(instance, target, offset, localName,
    opt_namespaceUri) {
  //TODO: implement this
};



xrx.xml.Update.insertMixed = function(instance, target, offset, localName,
    opt_namespaceUri) {
  //TODO: implement this
};



/**
 * Inserts a new attribute into a start-tag or a empty tag token.
 * 
 * @param {!xrx.mvc.Instance} instance The instance to be updated.
 * @param {!(xrx.token.StartTag|xrx.token.EmptyTag)} target The tag where the attribute 
 * shall be inserted.
 * @param {!string} qName The qualified name of the new attribute.
 * @param {!string} opt_namespaceUri The namespace URI of the new attribute.
 */
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
};



/**
 * Removes characters from a not-tag token.
 * 
 * @param {!xrx.mvc.Instance} instance The instance to be updated.
 * @param {!xrx.token.NotTag} target The token to be replaced.
 * @param {!integer} target The offset relative to the not-tag token.
 * @param {!integer} string The number of characters to be removed. 
 */
xrx.xml.Update.reduceNotTag = function(instance, target, offset, length) {
  return xrx.xml.Update.remove_(instance, target.offset() + offset, length);
};



/**
 * Removes an empty tag.
 * 
 * @param {!xrx.mvc.Instance} instance The instance to be updated.
 * @param {!xrx.token.EmptyTag} target The tag to be removed.
 */
xrx.xml.Update.removeEmptyTag = function(instance, token) {
  var diff = xrx.xml.Update.remove_(instance, token.offset(), token.length());

  //TODO: remove namespace declaration from index

  return diff;
};



/**
 * Removes a start-tag and a end-tag at once but keeping the content
 * between the two tags. 
 * 
 * @param {!xrx.mvc.Instance} instance The instance to be updated.
 * @param {!xrx.token.StartTag} token1 The start-tag to be removed.
 * @param {!xrx.token.EndTag} token2 The end-tag to be removed.
 */
xrx.xml.Update.removeStartEndTag = function(instance, token1, token2) {
  var diff2 = xrx.xml.Update.remove_(instance, token2.offset(), token2.length());
  var diff1 = xrx.xml.Update.remove_(instance, token1.offset(), token1.length());

  //TODO: remove namespace declaration from index

  return [diff1, diff2];
};



/**
 * Removes a start-tag token, a end-tag token and the content between
 * the two tag tokens. 
 * 
 * @param {!xrx.mvc.Instance} instance The instance to be updated.
 * @param {!xrx.token.Fragment} token The tag to be removed.
 */
xrx.xml.Update.removeFragment = function(instance, token) {
  //TODO: implement this
};



/**
 * Removes a mixed sequence of tokens. 
 * 
 * @param {!xrx.mvc.Instance} instance The instance to be updated.
 * @param {!xrx.token.Mixed} token The token to be removed.
 */
xrx.xml.Update.removeMixed = function(instance, token) {
  //TODO: implement this
};



/**
 * Removes an attribute token.
 * 
 * @param {!xrx.mvc.Instance} instance The instance to be updated.
 * @param {!xrx.token.Attribute} token The token to be removed.
 */
xrx.xml.Update.removeAttribute = function(instance, token) {
  var diff = xrx.xml.Update.remove_(instance, token.offset() - 1, token.length() + 1);

  return diff;
};
