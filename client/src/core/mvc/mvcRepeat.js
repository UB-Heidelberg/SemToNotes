***REMOVED***
***REMOVED*** @fileoverview Class implements a repeat control.
***REMOVED***

goog.provide('xrx.mvc.Repeat');



***REMOVED***
goog.require('goog.dom.classes');
goog.require('xrx.mvc.ComponentView');



***REMOVED***
***REMOVED***
***REMOVED***
xrx.mvc.Repeat = function(element) {

  this.firstChild_;

  this.nextChilds_ = [];

***REMOVED***
***REMOVED***
goog.inherits(xrx.mvc.Repeat, xrx.mvc.ComponentView);



xrx.mvc.Repeat.prototype.createDom = function() {
  this.firstChild_ = goog.dom.getFirstElementChild(this.element_);
  if (!this.firstChild_) throw Error('');
  this.refresh();
***REMOVED***



***REMOVED***
***REMOVED*** @private
***REMOVED***
xrx.mvc.Repeat.prototype.removeNextChilds_ = function() {
  for(var n = 0, len = this.nextChilds_.length; n < len; n++) {
    goog.dom.removeNode(this.nextChilds_[n]);
  }
  this.nextChilds_ = [];
***REMOVED***



xrx.mvc.Repeat.prototype.refresh = function() {
  var n = 0;
  var node;
  var child;
  this.removeNextChilds_();
  while(node = this.getNode(n)) {
    if (n === 0) {
      goog.dom.setProperties(this.firstChild_, {'data-xrx-repeat-index': n});
      goog.dom.classes.add(this.firstChild_, 'xrx-repeat-item');
    } else {
      child = this.firstChild_.cloneNode(true);
      this.nextChilds_.push(child);
      goog.dom.setProperties(child, {'data-xrx-repeat-index': n});
      goog.dom.classes.add(child, 'xrx-repeat-item');
      goog.dom.appendChild(this.element_, child);
    }
    n++;
  }
***REMOVED***
