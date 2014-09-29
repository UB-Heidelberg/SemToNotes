***REMOVED***
***REMOVED*** @fileoverview XPath Data Model 3.0 interface (XDM).
***REMOVED***

goog.provide('xrx.xdm');



***REMOVED*** 
***REMOVED*** An interface representing the XPath Data Model 3.0 (XDM).
***REMOVED*** http://www.w3.org/TR/xpath-datamodel-30/
***REMOVED*** 
***REMOVED*** @interface 
***REMOVED***
xrx.xdm = function() {***REMOVED***



***REMOVED***
***REMOVED*** http://www.w3.org/TR/xpath-datamodel-30/#dm-attributes
***REMOVED***
xrx.xdm.prototype.accAttributes = goog.abstractMethod;



***REMOVED***
***REMOVED*** http://www.w3.org/TR/xpath-datamodel-30/#dm-base-uri
***REMOVED***
xrx.xdm.prototype.accBaseUri = goog.abstractMethod;



***REMOVED***
***REMOVED*** http://www.w3.org/TR/xpath-datamodel-30/#dm-children
***REMOVED***
xrx.xdm.prototype.accChildren = goog.abstractMethod;



***REMOVED***
***REMOVED*** http://www.w3.org/TR/xpath-datamodel-30/#dm-document-uri
***REMOVED***
xrx.xdm.prototype.accDocumentUri = goog.abstractMethod;



***REMOVED***
***REMOVED*** http://www.w3.org/TR/xpath-datamodel-30/#dm-is-id
***REMOVED***
xrx.xdm.prototype.accIsId = goog.abstractMethod;



***REMOVED***
***REMOVED*** http://www.w3.org/TR/xpath-datamodel-30/#dm-is-idrefs
***REMOVED***
xrx.xdm.prototype.accIsIdrefs = goog.abstractMethod;



***REMOVED***
***REMOVED*** http://www.w3.org/TR/xpath-datamodel-30/#dm-namespace-nodes
***REMOVED***
xrx.xdm.prototype.accNamespaceNodes = goog.abstractMethod;



***REMOVED***
***REMOVED*** http://www.w3.org/TR/xpath-datamodel-30/#dm-nilled
***REMOVED***
xrx.xdm.prototype.accNilled = goog.abstractMethod;



***REMOVED***
***REMOVED*** http://www.w3.org/TR/xpath-datamodel-30/#dm-node-kind
***REMOVED***
xrx.xdm.prototype.accNodeKind = goog.abstractMethod;



***REMOVED***
***REMOVED*** http://www.w3.org/TR/xpath-datamodel-30/#dm-node-name
***REMOVED***
xrx.xdm.prototype.accNodeName = goog.abstractMethod;



***REMOVED***
***REMOVED*** http://www.w3.org/TR/xpath-datamodel-30/#dm-parent
***REMOVED***
xrx.xdm.prototype.accParent = goog.abstractMethod;



***REMOVED***
***REMOVED*** http://www.w3.org/TR/xpath-datamodel-30/#dm-string-value
***REMOVED***
xrx.xdm.prototype.accStringValue = goog.abstractMethod;



***REMOVED***
***REMOVED*** http://www.w3.org/TR/xpath-datamodel-30/#dm-type-name
***REMOVED***
xrx.xdm.prototype.accTypeName = goog.abstractMethod;



***REMOVED***
***REMOVED*** http://www.w3.org/TR/xpath-datamodel-30/#dm-typed-value
***REMOVED***
xrx.xdm.prototype.accTypedValue = goog.abstractMethod;



***REMOVED***
***REMOVED*** http://www.w3.org/TR/xpath-datamodel-30/#dm-unparsed-entity-public-id
***REMOVED***
xrx.xdm.prototype.accUnparsedEntityPublicId = goog.abstractMethod;



***REMOVED***
***REMOVED*** http://www.w3.org/TR/xpath-datamodel-30/#dm-unparsed-entity-system-id
***REMOVED***
xrx.xdm.prototype.accUnparsedEntitySystemId = goog.abstractMethod;