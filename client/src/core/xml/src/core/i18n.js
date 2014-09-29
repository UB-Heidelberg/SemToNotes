/**
 * @fileoverview 
 */
goog.provide('xrx.i18n');



goog.require('xrx.node');



xrx.i18n = function() {};



xrx.i18n.translate = function(item) {

  if (item instanceof xrx.node) {
    return ''; //item.getNameExpanded();
  } else {
    throw Error('Item can not be translated. Unknown type.');
  }
}
