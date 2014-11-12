/**
 * @fileoverview A function module for XML token and XML
 *   document serialization.
 */

goog.provide('xrx.xml.Serialize');



goog.require('xrx.xml.Stream');
goog.require('xrx.token');
goog.require('xrx.xml.Traverse');



/**
 * Function module for XML serializazion.
 */
xrx.xml.Serialize = function() {};



/**
 * Serialize a attribute token.
 * @return {string} The attribute token string.
 */
xrx.xml.Serialize.attribute = function(qName, value) {
  return ' ' + qName + '="' + value.replace(/\"/g, "'") + '"';
};



/**
 * Serialize a attribute token with namespace.
 * @return {string} The attribute token string.
 */
xrx.xml.Serialize.attributeNs = function(nsPrefix, qName, namespaceUri) {

  if (nsPrefix === undefined || nsPrefix === "xmlns") {

    return xrx.xml.Serialize.namespace('xmlns:' + qName.split(':')[0], namespaceUri) +
        xrx.xml.Serialize.attribute(qName, '');
  } else {

    return xrx.xml.Serialize.attribute(qName, '');
  }
};



/**
 * Serialize a comment token.
 * @return {string} The comment token string.
 */
xrx.xml.Serialize.comment = function(ch) {
  return '<!--' + ch + '-->';
};



/**
 * Serialize a processing instruction token.
 * @return {string} The processing instruction token as string.
 */
xrx.xml.Serialize.processingInstruction = function(target, data) {
  return '<?' + target + ' ' + data + '?>';
};



/**
 * Shared function for tag serialization.
 * @private
 * @return {string} The tag string.
 */
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
};



/**
 * Serialize a start-tag token.
 * @return {string} The start-tag token string.
 */
xrx.xml.Serialize.startTag = function(qName, opt_namespaces, opt_attributes) {
  var namespaces = opt_namespaces || '';
  var attributes = opt_attributes || '';

  return '<' + qName + namespaces + attributes + '>';
};



/**
 * Serialize a start-tag token with namespace.
 * @return {string} The start-tag token string.
 */
xrx.xml.Serialize.startTagNs = function(nsPrefix, localName, namespaceUri) {
  return xrx.xml.Serialize.tagNs_(xrx.xml.Serialize.startTag, nsPrefix, localName,
      namespaceUri);
};



/**
 * Serialize a end-tag token.
 * @return {string} The end-tag token string.
 */
xrx.xml.Serialize.endTag = function(qName) {
  return '</' + qName + '>';
};



/**
 * Serialize a end-tag token with namespace.
 * @return {string} The end-tag token string.
 */
xrx.xml.Serialize.endTagNs = function(nsPrefix, localName, namespaceUri) {

  if (nsPrefix === undefined || nsPrefix === 'xmlns') {

    return xrx.xml.Serialize.endTag(localName);
  } else {
    var colonIndex = nsPrefix.indexOf(':');

    return xrx.xml.Serialize.endTag(nsPrefix.substr(colonIndex + 1) + ':' + localName);
  }
};



/**
 * Serialize a start-empty-tag token.
 * @return {string} The start-empty-tag token string.
 */
xrx.xml.Serialize.startEmptyTag = function(qName, opt_namespaces, opt_attributes) {
  var namespaces = opt_namespaces || '';
  var attributes = opt_attributes || '';

  return '<' + qName + namespaces + attributes;
};



/**
 * Serialize a empty-tag token.
 * @return {string} The empty-tag token string.
 */
xrx.xml.Serialize.emptyTag = function(qName, opt_namespaces, opt_attributes) {
  var namespaces = opt_namespaces || '';
  var attributes = opt_attributes || '';

  return '<' + qName + namespaces + attributes + '/>';
};



/**
 * Serialize a empty-tag token with namespace.
 * @return {string} The empty-tag token string.
 */
xrx.xml.Serialize.emptyTagNs = function(nsPrefix, localName, namespaceUri) {
  return xrx.xml.Serialize.tagNs_(xrx.xml.Serialize.emptyTag, nsPrefix, localName,
      namespaceUri);
};



/**
 * Serialize a namespace token.
 * @return {string} The namespace token string.
 */
xrx.xml.Serialize.namespace = function(prefix, uri) {
  return ' ' + prefix + '="' + uri + '"';
};



/**
 *
 */
xrx.xml.Serialize.indent = {};



/**
 * Serialize a XML document with indentation in forward direction.
 * @return {string} The indented XML document.
 */
xrx.xml.Serialize.indent.forward = function(xml, indent, opt_start, opt_maxLines) {
  var traverse = new xrx.xml.Traverse(xml);
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
xrx.xml.Serialize.indent.backward = function(xml, indent, opt_start, opt_maxLines) {
  var traverse = new xrx.xml.Traverse(xml);
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

