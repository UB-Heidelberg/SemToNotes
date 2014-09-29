/**
 * @fileoverview A function module for XML token and XML
 * document serialization.
 */

goog.provide('xrx.serialize');



goog.require('xrx.stream');
goog.require('xrx.token');
goog.require('xrx.traverse');



/**
 * Function module for XML serializazion.
 */
xrx.serialize = function() {};



/**
 * Serialize a attribute token.
 * @return {string} The attribute token string.
 */
xrx.serialize.attribute = function(qName, value) {
  return ' ' + qName + '="' + value.replace(/\"/g, "'") + '"';
};



/**
 * Serialize a attribute token with namespace.
 * @return {string} The attribute token string.
 */
xrx.serialize.attributeNs = function(nsPrefix, qName, namespaceUri) {

  if (nsPrefix === undefined || nsPrefix === "xmlns") {

    return xrx.serialize.namespace('xmlns:' + qName.split(':')[0], namespaceUri) +
        xrx.serialize.attribute(qName, '');
  } else {

    return xrx.serialize.attribute(qName, '');
  }
};



/**
 * Shared function for tag serialization.
 * @private
 * @return {string} The tag string.
 */
xrx.serialize.tagNs_ = function(func, nsPrefix, localName, namespaceUri) {

  if (nsPrefix === undefined) {

    return func(localName, xrx.serialize.namespace('xmlns',
        namespaceUri));
  } else if (nsPrefix === 'xmlns') {

    return func(localName);
  } else {
    var colonIndex = nsPrefix.indexOf(':');

    return func(nsPrefix.substr(colonIndex + 1) + ':' + localName);
  }
};



/**
 * Serialize a start-tag token.
 * @return {string} The start-tag token string.
 */
xrx.serialize.startTag = function(qName, opt_namespaces, opt_attributes) {
  var namespaces = opt_namespaces || '';
  var attributes = opt_attributes || '';

  return '<' + qName + namespaces + attributes + '>';
};



/**
 * Serialize a start-tag token with namespace.
 * @return {string} The start-tag token string.
 */
xrx.serialize.startTagNs = function(nsPrefix, localName, namespaceUri) {
  return xrx.serialize.tagNs_(xrx.serialize.startTag, nsPrefix, localName,
      namespaceUri);
};



/**
 * Serialize a end-tag token.
 * @return {string} The end-tag token string.
 */
xrx.serialize.endTag = function(qName) {
  return '</' + qName + '>';
};



/**
 * Serialize a end-tag token with namespace.
 * @return {string} The end-tag token string.
 */
xrx.serialize.endTagNs = function(nsPrefix, localName, namespaceUri) {

  if (nsPrefix === undefined || nsPrefix === 'xmlns') {

    return xrx.serialize.endTag(localName);
  } else {
    var colonIndex = nsPrefix.indexOf(':');

    return xrx.serialize.endTag(nsPrefix.substr(colonIndex + 1) + ':' + localName);
  }
};



/**
 * Serialize a start-empty-tag token.
 * @return {string} The start-empty-tag token string.
 */
xrx.serialize.startEmptyTag = function(qName, opt_namespaces, opt_attributes) {
  var namespaces = opt_namespaces || '';
  var attributes = opt_attributes || '';

  return '<' + qName + namespaces + attributes;
};



/**
 * Serialize a empty-tag token.
 * @return {string} The empty-tag token string.
 */
xrx.serialize.emptyTag = function(qName, opt_namespaces, opt_attributes) {
  var namespaces = opt_namespaces || '';
  var attributes = opt_attributes || '';

  return '<' + qName + namespaces + attributes + '/>';
};



/**
 * Serialize a empty-tag token with namespace.
 * @return {string} The empty-tag token string.
 */
xrx.serialize.emptyTagNs = function(nsPrefix, localName, namespaceUri) {
  return xrx.serialize.tagNs_(xrx.serialize.emptyTag, nsPrefix, localName,
      namespaceUri);
};



/**
 * Serialize a namespace token.
 * @return {string} The namespace token string.
 */
xrx.serialize.namespace = function(prefix, uri) {
  return ' ' + prefix + '="' + uri + '"';
};



/**
 *
 */
xrx.serialize.indent = {};



/**
 * Serialize a XML document with indentation in forward direction.
 * @return {string} The indented XML document.
 */
xrx.serialize.indent.forward = function(xml, indent, opt_start, opt_maxLines) {
  var traverse = new xrx.traverse(xml);
  var lastToken = opt_start ? opt_start.type() : xrx.token.UNDEFINED;
  var output = '';
  var lines = 0;

  var line = function(label, offset, length1, length2) {

    output += traverse.xml().substr(offset, length1);

    if (length1 !== length2) {
      output += traverse.xml().substr(offset + length1, length2 - length1);
    }
  };
  
  var newLine = function(label, offset, length1, length2) {
    var level = label.length() - 1;

    output += '\n';

    for(var i = 0, ind = level * indent; i < ind; i++) {
      output += ' ';
    }
    line(label, offset, length1, length2);
    if (opt_maxLines && (++lines >= opt_maxLines)) traverse.stop();
  };

  var inLine = function(label, offset, length1, length2) {

    line(label, offset, length1, length2);
  };
  
  traverse.rowStartTag = function(label, offset, length1, length2) {

    if (lastToken === xrx.token.START_TAG || lastToken === xrx.token.END_TAG) {
      newLine(label, offset, length1, length2);
    } else {
      inLine(label, offset, length1, length2);
    };

    length1 !== length2 ? lastToken = xrx.token.NOT_TAG : 
        lastToken = xrx.token.START_TAG;
  };
  
  traverse.rowEmptyTag = function(label, offset, length1, length2) {

    if (lastToken === xrx.token.START_TAG || lastToken === xrx.token.END_TAG) {
      newLine(label, offset, length1, length2);
    } else {
      inLine(label, offset, length1, length2);
    };

    length1 !== length2 ? lastToken = xrx.token.NOT_TAG : 
      lastToken = xrx.token.END_TAG;
  };
  
  traverse.rowEndTag = function(label, offset, length1, length2) {

    if (lastToken === xrx.token.NOT_TAG || lastToken === xrx.token.START_TAG) {
      inLine(label, offset, length1, length2);
    } else {
      newLine(label, offset, length1, length2);
    }

    length1 !== length2 ? lastToken = xrx.token.NOT_TAG : 
      lastToken = xrx.token.END_TAG;
  };
  
  traverse.forward(opt_start);
  
  return output;
};



/**
 * Serialize a XML document with indentation in backward direction.
 * @return {string} The indented XML document.
 */
xrx.serialize.indent.backward = function(xml, indent, opt_start, opt_maxLines) {
  var traverse = new xrx.traverse(xml);
  var lastToken = opt_start ? opt_start.type() : xrx.token.UNDEFINED;
  var output = '';
  var lines = 0;

  var line = function(label, offset, length1, length2) {

    if (length1 !== length2) {
      output = traverse.xml().substr(offset + length1, length2 - length1) + output;
    }

    output = traverse.xml().substr(offset, length1) + output;
  };
  
  var newLine = function(label, offset, length1, length2) {
    var level = label.length() - 1;

    for(var i = 0, ind = level * indent; i < ind; i++) {
      output = ' ' + output;
    }

    output = '\n' + output;

    line(label, offset, length1, length2);

    if (opt_maxLines && (++lines >= opt_maxLines)) traverse.stop();
  };

  var inLine = function(label, offset, length1, length2) {

    line(label, offset, length1, length2);
  };
  
  traverse.rowStartTag = function(label, offset, length1, length2) {

    if (lastToken === xrx.token.START_TAG) {
      label.push(0);
      newLine(label, offset, length1, length2);
    } else {
      inLine(label, offset, length1, length2);
    }

    lastToken = xrx.token.START_TAG;
  };
  
  traverse.rowEmptyTag = function(label, offset, length1, length2) {

    if (lastToken === xrx.token.END_TAG) {
      label.parent();
      newLine(label, offset, length1, length2);
    } else {
      newLine(label, offset, length1, length2);
    }

    lastToken = xrx.token.START_TAG;
  };
  
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
  };
  
  traverse.backward(opt_start);
  
  return output;
};

