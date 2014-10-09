/**
 * @fileoverview Constants and static functions for the node
 *     classes.
 */

goog.provide('xrx.node');



// numbers are important to compute document order!
/** @const */ xrx.node.DOCUMENT = 0;
/** @const */ xrx.node.ELEMENT = 4;
/** @const */ xrx.node.ATTRIBUTE = 3;
/** @const */ xrx.node.NAMESPACE = 2;
/** @const */ xrx.node.PI = 1;
/** @const */ xrx.node.COMMENT = 5;
/** @const */ xrx.node.TEXT = 6;



/**
 * return {!string}
 */
xrx.node.getNameLocal = function(name) {
  return goog.string.contains(name, ':') ? 
      name.substr(name.indexOf(':') + 1) : name;
};



/**
 * return {!string}
 */
xrx.node.getNamePrefix = function(name) {
  return goog.string.contains(name, ':') ? 
      'xmlns:' + name.substr(0, name.indexOf(':')) : 'xmlns';
};



/**
 * return {!string}
 */
xrx.node.getNameExpanded = function(namespace, localName) {
  return namespace + '#' + localName;
};
