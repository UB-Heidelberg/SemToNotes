***REMOVED***
***REMOVED*** @fileoverview A class interface for XML events.
***REMOVED***

goog.provide('xrx.xml.Event');



***REMOVED***
***REMOVED*** A class interface for XML events.
***REMOVED***
xrx.xml.Event = function() {

 ***REMOVED*****REMOVED***
  ***REMOVED*** Feature flags
  ***REMOVED*** @type {Object}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.features_ = {  
    'ATTRIBUTE': false,
    'ATTR_NAME': false,
    'ATTR_VALUE': false,
    'NAMESPACE': false,
    'NS_PREFIX': false,
    'NS_URI': false,
    'TAG_NAME': false,
    'XML_DECL': false
  }

 ***REMOVED*****REMOVED***
  ***REMOVED*** Whether at least one feature is on.
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.oneFeatureOn_ = false;
***REMOVED***



***REMOVED***
***REMOVED*** Function to turn events on and off.
***REMOVED*** @param {!string} feature The name of the feature.
***REMOVED*** @param {!boolean} opt_flag On or off.
***REMOVED***
xrx.xml.Event.prototype.setFeature = function(feature, opt_flag) {
  if (this.features_[feature] === undefined) throw Error('Unknown feature.');
  var on = false;
  this.features_[feature] = opt_flag || true;
  for(var f in this.features_) {
    if (this.features_[f] === true) on = true;
 ***REMOVED*****REMOVED***
  this.oneFeatureOn_ = on;
***REMOVED***



***REMOVED***
***REMOVED*** Convenience function to turn all events on or off.
***REMOVED*** @param {!boolean} flag On or off.
***REMOVED***
xrx.xml.Event.prototype.setFeatures = function(flag) {
  
  for(var f in this.features_) {
    this.features_[f] = flag;
  }
  flag === true ? this.oneFeatureOn_ = true :
    this.oneFeatureOn_ = false;
***REMOVED***



***REMOVED***
***REMOVED*** Whether a specific feature is turned on or off.
***REMOVED*** @param {!string} feature The feature to test.
***REMOVED*** @return {!boolean} True when on otherwise false.
***REMOVED***
xrx.xml.Event.prototype.hasFeature = function(feature) {
  return this.features_[feature] === true;
***REMOVED***




***REMOVED***
***REMOVED*** Event, thrown whenever a start-tag row is found.
***REMOVED***
xrx.xml.Event.prototype.rowStartTag = goog.abstractMethod;



***REMOVED***
***REMOVED*** Event, thrown whenever an end-tag row is found.
***REMOVED***
xrx.xml.Event.prototype.rowEndTag = goog.abstractMethod;



***REMOVED***
***REMOVED*** Event, thrown whenever an empty-tag row is found.
***REMOVED***
xrx.xml.Event.prototype.rowEmptyTag = goog.abstractMethod;



***REMOVED***
***REMOVED*** Event, thrown whenever a comment row is found.
***REMOVED***
xrx.xml.Event.prototype.rowComment = goog.abstractMethod;



***REMOVED***
***REMOVED*** Event, thrown whenever a processing instruction row is found.
***REMOVED***
xrx.xml.Event.prototype.rowPI = goog.abstractMethod;



***REMOVED***
***REMOVED*** Event, thrown whenever a CDATA row is found.
***REMOVED***
xrx.xml.Event.prototype.rowCDATA = goog.abstractMethod;



***REMOVED***
***REMOVED*** Event, thrown whenever a tag-name is found.
***REMOVED***
xrx.xml.Event.prototype.eventTagName = goog.abstractMethod;



***REMOVED***
***REMOVED*** Event, thrown whenever a attribute token is found.
***REMOVED***
xrx.xml.Event.prototype.eventAttribute = goog.abstractMethod;



***REMOVED***
***REMOVED*** Event, thrown whenever a attribute name is found.
***REMOVED***
xrx.xml.Event.prototype.eventAttrName = goog.abstractMethod;



***REMOVED***
***REMOVED*** Event, thrown whenever a attribute value is found.
***REMOVED***
xrx.xml.Event.prototype.eventAttrValue = goog.abstractMethod;



***REMOVED***
***REMOVED*** Event, thrown whenever a namespace token is found.
***REMOVED***
xrx.xml.Event.prototype.eventNamespace = goog.abstractMethod;



***REMOVED***
***REMOVED*** Event, thrown whenever a namespace prefix is found.
***REMOVED***
xrx.xml.Event.prototype.eventNsPrefix = goog.abstractMethod;



***REMOVED***
***REMOVED*** Event, thrown whenever a namespace URI is found.
***REMOVED***
xrx.xml.Event.prototype.eventNsUri = goog.abstractMethod;



***REMOVED***
***REMOVED*** Event, thrown when an XML declaration is found.
***REMOVED***
xrx.xml.Event.prototype.eventXmlDecl = goog.abstractMethod;
