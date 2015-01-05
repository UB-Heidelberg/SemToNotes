/**
 * @fileoverview 
 */

goog.provide('xrx.html5.Textarea');



goog.require('xrx.html5.Input');



xrx.html5.Textarea = function(element) {

  goog.base(this, element);
};
goog.inherits(xrx.html5.Textarea, xrx.html5.Input);
xrx.mvc.registerComponent('xrx-textarea', xrx.html5.Textarea);
