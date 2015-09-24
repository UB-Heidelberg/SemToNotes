/**
 * @fileoverview VML base class providing enumerations and static functions
 *     for the VML sub-classes.
 */

goog.provide('xrx.vml');



goog.require('goog.dom.DomHelper');



/**
 * VML base class providing enumerations and static functions
 * for the VML sub-classes.
 * @constructor
 */
xrx.vml = function() {};



/**
 * Returns whether VML rendering is supported by the current user agent.
 * @return {boolean} Whether VML rendering is supported.
 */
xrx.vml.isSupported = function() {
  return !!document.namespaces;
};



xrx.vml.createVml = function(tagName) {
  return goog.dom.htmlToDocumentFragment('<rect xmlns="urn:schemas-microsoft.com:vml" class="xrx-vml"></rect>');
};
