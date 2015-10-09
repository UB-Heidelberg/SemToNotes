/**
 * @fileoverview VML class representing a group.
 */

goog.provide('xrx.vml.Group');



goog.require('goog.dom.DomHelper');
goog.require('xrx.vml');
goog.require('xrx.vml.Container');



/**
 * VML class representing a group.
 * @param {HTMLElement} The HTML element.
 * @constructor
 * @extends xrx.vml.Element
 * @private
 */
xrx.vml.Group = function(element) {

  goog.base(this, element);
};
goog.inherits(xrx.vml.Group, xrx.vml.Container);



/**
 * Creates a new group.
 * @param {xrx.vml.Canvas} canvas The parent canvas of the group.
 */
xrx.vml.Group.create = function(canvas) {
  var element = goog.dom.htmlToDocumentFragment('<group' +
      '  xmlns="urn:schemas-microsoft.com:vml" class="xrx-vml">' +
      '</group>');
  element.style['position'] = 'absolute';
  element.style['left'] = '0px';
  element.style['top'] = '0px';
  element.style['width'] = '100px';
  element.style['height'] = '100px';
  return new xrx.vml.Group(element);
};
