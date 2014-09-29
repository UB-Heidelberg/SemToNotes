***REMOVED***
***REMOVED*** @fileoverview A tag-name UI component used by xrx.wysiwym.richxml.
***REMOVED***
goog.provide('xrx.richxml.tagname');



goog.require('goog.dom');
goog.require('goog.style');
goog.require('xrx.i18n');
goog.require('xrx.wysiwym.richxml');



***REMOVED***
***REMOVED*** Constructs a tag-name UI component.
***REMOVED*** The tag-name is shown when the cursor moves near to a 
***REMOVED*** tag in a xrx.wysiwym.richxml component.
***REMOVED***
***REMOVED***
xrx.richxml.tagname = function(element)  {



  this.element_ = element;



  this.createDom();
***REMOVED***



***REMOVED***
***REMOVED*** Lazy creation. We first search for a element with
***REMOVED*** id 'xrx-tagname'. If not found, we create a DIV and
***REMOVED*** append it to HTML BODY.
***REMOVED***
xrx.richxml.tagname.prototype.createDom = function() {

  if (!this.element_) {
    this.element_ = goog.dom.getElement('xrx-tagname');
  }
  if (!this.element_) {
    this.element_ = goog.dom.createElement('div');
    goog.dom.append(goog.dom.getElementsByTagNameAndClass('body')[0],
        this.element_);
  }
***REMOVED***



***REMOVED***
***REMOVED*** Shows the tag-name control.
***REMOVED*** @param {!xrx.node.Element}
***REMOVED***
xrx.richxml.tagname.prototype.show = function(node) {
  var span = goog.dom.createElement('span');
  var text = xrx.i18n.translate(node);
  goog.dom.setTextContent(span, text);

  this.hide();
  goog.dom.append(this.element_, span);
***REMOVED***



***REMOVED***
***REMOVED*** Hides the tag-name control.
***REMOVED***
xrx.richxml.tagname.prototype.hide = function() {
  goog.dom.removeChildren(this.element_);
***REMOVED***
