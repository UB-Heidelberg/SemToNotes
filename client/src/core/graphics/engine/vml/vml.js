/**
 * @fileoverview VML base class providing enumerations and static functions
 *     for the VML sub-classes.
 */

goog.provide('xrx.vml');



goog.require('goog.dom.DomHelper');
goog.require('goog.style');



/**
 * VML base class providing enumerations and static functions
 * for the VML sub-classes.
 * @constructor
 */
xrx.vml = function() {};



/**
 * Whether the browser already has VML rendering enabled.
 * @type {boolean}
 */
xrx.vml.browserEnabled = false;



/**
 * Initialize the browser for VML rendering.
 */
xrx.vml.initVmlRendering = function() {
  if (xrx.vml.browserEnabled) return;
  goog.style.installStyles('.xrx-vml{behavior:url(#default#VML);' +
      'display:inline-block}');
  xrx.vml.browserEnabled = true;
};



/**
 * Returns whether VML rendering is supported by the current user agent.
 * @return {boolean} Whether VML rendering is supported.
 */
xrx.vml.isSupported = function() {
  return !!document.namespaces;
};



/**
 * Creates a new VML element including fill, stroke and skew.
 * @param {string} tagName The tag name of the HTML element.
 * @return {HTMLElement} The HTML element.
 */
xrx.vml.createElement = function(tagName) {
  var fill = '<fill xmlns="urn:schemas-microsoft.com:vml" ' +
      'class="xrx-vml"></fill>';
  var stroke = '<stroke xmlns="urn:schemas-microsoft.com:vml" ' +
      'class="xrx-vml"></stroke>';
  var skew = '<skew xmlns="urn:schemas-microsoft.com:vml" ' +
      'class="xrx-vml"></skew>';
  return goog.dom.htmlToDocumentFragment('<' + tagName +
      '  xmlns="urn:schemas-microsoft.com:vml" class="xrx-vml">' +
      fill + stroke + skew + '</' + tagName + '>');
};



xrx.vml.setPath = function(element, coords, close) {
  var str = 'm ';
  for (var i = 0, len = coords.length; i < len; i++) {
    str += coords[i][0] + ',' + coords[i][1];
    if (i !== 0 && i !== len - 1) str += ', '
    if (i === 0) str += ' l ';
  }
  if (close) str += ' x '; 
  str += ' e';
  element['path'] = str;
};
