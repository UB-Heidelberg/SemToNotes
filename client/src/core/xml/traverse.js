***REMOVED***
***REMOVED*** @fileoverview A class to stream over a labeled XML
***REMOVED*** instance.
***REMOVED***

goog.provide('xrx.traverse');


goog.require('xrx.label');
goog.require('xrx.stream');
goog.require('xrx.token');



***REMOVED***
***REMOVED*** A class to stream over a labeled XML instance.
***REMOVED***
xrx.traverse = function(xml) {



  this.stream_ = new xrx.stream(xml);
***REMOVED***



***REMOVED***
***REMOVED*** 
***REMOVED***
xrx.traverse.prototype.stream = function() {
***REMOVED***
***REMOVED***



***REMOVED***
***REMOVED*** 
***REMOVED***
xrx.traverse.prototype.xml = function() {
  return this.stream_.xml();
***REMOVED***



***REMOVED***
***REMOVED*** 
***REMOVED***
xrx.traverse.prototype.stop = function() {
  this.stream_.stop();
***REMOVED***



***REMOVED***
***REMOVED*** Event, thrown whenever a start-tag row is found.
***REMOVED***
xrx.traverse.prototype.rowStartTag = goog.abstractMethod;



***REMOVED***
***REMOVED*** Event, thrown whenever a empty-tag row is found.
***REMOVED***
xrx.traverse.prototype.rowEmptyTag = goog.abstractMethod;



***REMOVED***
***REMOVED*** Event, thrown whenever a end-tag row is found.
***REMOVED***
xrx.traverse.prototype.rowEndTag = goog.abstractMethod;



***REMOVED***
***REMOVED*** Event, thrown whenever a tag-name is found.
***REMOVED***
xrx.traverse.prototype.eventTagName = goog.abstractMethod;



***REMOVED***
***REMOVED*** Event, thrown whenever a attribute token is found.
***REMOVED***
xrx.traverse.prototype.eventAttribute = goog.abstractMethod;



***REMOVED***
***REMOVED*** Event, thrown whenever a attribute name is found.
***REMOVED***
xrx.traverse.prototype.eventAttrName = goog.abstractMethod;



***REMOVED***
***REMOVED*** Event, thrown whenever a attribute value is found.
***REMOVED***
xrx.traverse.prototype.eventAttrValue = goog.abstractMethod;



***REMOVED***
***REMOVED*** Event, thrown whenever a namespace token is found.
***REMOVED***
xrx.traverse.prototype.eventNamespace = goog.abstractMethod;



***REMOVED***
***REMOVED*** Event, thrown whenever a namespace prefix is found.
***REMOVED***
xrx.traverse.prototype.eventNsPrefix = goog.abstractMethod;



***REMOVED***
***REMOVED*** Event, thrown whenever a namespace URI is found.
***REMOVED***
xrx.traverse.prototype.eventNsUri = goog.abstractMethod;




***REMOVED***
***REMOVED*** Function to turn events on and off.
***REMOVED*** 
***REMOVED*** @param {!string} feature The name of the feature.
***REMOVED*** @param {!boolean} flag On or off.
***REMOVED***
xrx.traverse.prototype.setFeature = function(feature, flag) {
  this.stream_.setFeature(feature, flag);
***REMOVED***


***REMOVED***
***REMOVED*** Whether a specific feature is turned on or off.
***REMOVED*** 
***REMOVED*** @param {!string} feature The feature to test.
***REMOVED*** @return {!boolean} True when on otherwise false.
***REMOVED***
xrx.traverse.prototype.hasFeature = function(feature) {
  return this.stream_.hasFeature(feature);
***REMOVED***



***REMOVED***
***REMOVED*** Convenience function to turn all events on or off.
***REMOVED*** 
***REMOVED*** @param {!boolean} flag On or off.
***REMOVED***
xrx.traverse.prototype.setFeatures = function(flag) {
  this.stream_.setFeatures(flag);
***REMOVED***



***REMOVED***
***REMOVED*** @private
***REMOVED***
xrx.traverse.prototype.secondaryLabel = function(label, primaryLabel) {

  if (label.isRoot()) {
    label = primaryLabel.clone();
    label.child();
  } else {
    label.nextSibling();
  }
  return label;
***REMOVED***



***REMOVED***
***REMOVED*** Stream over the labels of a XML instance in forward or 
***REMOVED*** backward direction.
***REMOVED*** @private
***REMOVED***
xrx.traverse.prototype.traverse = function(opt_token, forward) {
  var traverse = this;
  var label = opt_token ? opt_token.label().clone() : new xrx.label();
  var start = opt_token ? opt_token.offset() : undefined;
  var lastTag = opt_token ? opt_token.type() : xrx.token.UNDEFINED;
  var attrLabel = new xrx.label();
  var nsLabel = new xrx.label();
  var firstTag = opt_token ? true : false;

  this.stream_.rowStartTag = function(offset, length1, length2) {
    if (forward) {
      if (firstTag) {
        firstTag = false;
      } else {
        lastTag === xrx.token.START_TAG || lastTag === xrx.token.UNDEFINED ? 
            label.child() : label.nextSibling();
      }
    } else {
      if (lastTag !== xrx.token.END_TAG) label.parent();
    }
    traverse.rowStartTag(label.clone(), offset, length1, length2);

    lastTag = xrx.token.START_TAG;
    attrLabel = new xrx.label();
    nsLabel = new xrx.label();
 ***REMOVED*****REMOVED***

  this.stream_.rowEmptyTag = function(offset, length1, length2) {
    if (forward) {
      if (firstTag) {
        firstTag = false;
      } else {
        lastTag === xrx.token.START_TAG || lastTag === xrx.token.UNDEFINED ? 
            label.child() : label.nextSibling();
      }
    } else {
      // note: this is valid for the preceding-sibling and the ancestor axis but
      // not for the preceding axis
      lastTag === xrx.token.END_TAG || lastTag === xrx.token.UNDEFINED ? 
          label.child() : label.precedingSibling();
    }

    traverse.rowEmptyTag(label.clone(), offset, length1, length2);

    forward ? lastTag = xrx.token.END_TAG : lastTag = xrx.token.START_TAG;
    attrLabel = new xrx.label();
    nsLabel = new xrx.label();
 ***REMOVED*****REMOVED***

  this.stream_.rowEndTag = function(offset, length1, length2) {
    if (forward) {
      if (firstTag) {
        firstTag = false;
      } else {
        if (lastTag !== xrx.token.START_TAG) label.parent();
      }
    } else {
      lastTag === xrx.token.END_TAG || lastTag === xrx.token.UNDEFINED ? 
          label.child() : label.precedingSibling();
    }

    traverse.rowEndTag(label.clone(), offset, length1, length2);

    lastTag = xrx.token.END_TAG;
 ***REMOVED*****REMOVED***

  this.stream_.eventTagName = function(offset, length) {
    traverse.eventTagName(label.clone(), offset, length);
 ***REMOVED*****REMOVED***

  this.stream_.eventAttribute = function(offset, length) {
    attrLabel = traverse.secondaryLabel(attrLabel, label);
    traverse.eventAttribute(attrLabel, offset, length);
 ***REMOVED*****REMOVED***

  this.stream_.eventAttrName = function(offset, length) {
    if (!traverse.hasFeature('ATTRIBUTE')) attrLabel = traverse.secondaryLabel(attrLabel, label);
    traverse.eventAttrName(attrLabel, offset, length);
 ***REMOVED*****REMOVED***

  this.stream_.eventAttrValue = function(offset, length) {
    if (!traverse.hasFeature('ATTRIBUTE') && !traverse.hasFeature('ATTR_NAME')) 
        attrLabel = traverse.secondaryLabel(attrLabel, label);
    traverse.eventAttrValue(attrLabel, offset, length);
 ***REMOVED*****REMOVED***
  
  this.stream_.eventNamespace = function(offset, length) {
    nsLabel = traverse.secondaryLabel(nsLabel, label);
    traverse.eventNamespace(nsLabel, offset, length);
 ***REMOVED*****REMOVED***
  
  this.stream_.eventNsPrefix = function(offset, length) {
    if (!traverse.hasFeature('NAMESPACE')) nsLabel = traverse.secondaryLabel(nsLabel, label);
    traverse.eventNsPrefix(nsLabel, offset, length);
 ***REMOVED*****REMOVED***
  
  this.stream_.eventNsUri = function(offset, length) {
    if (!traverse.hasFeature('NAMESPACE') && !traverse.hasFeature('NS_PREFIX')) 
      nsLabel = traverse.secondaryLabel(nsLabel, label);
    traverse.eventNsUri(nsLabel, offset, length);
 ***REMOVED*****REMOVED***
  
  forward ? this.stream_.forward(start) : this.stream_.backward(start);
***REMOVED***



***REMOVED***
***REMOVED*** Stream over the labels of a XML instance in forward direction.
***REMOVED***
xrx.traverse.prototype.forward = function(opt_token) {
  this.traverse(opt_token, true);
***REMOVED***



***REMOVED***
***REMOVED*** Stream over the labels of a XML instance in backward direction.
***REMOVED***
xrx.traverse.prototype.backward = function(opt_token) {
  this.traverse(opt_token, false);
***REMOVED***


