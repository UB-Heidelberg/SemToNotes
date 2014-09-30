/**
 * @fileoverview A class to stream over a labeled XML
 * instance.
 */

goog.provide('xrx.traverse');


goog.require('xrx.label');
goog.require('xrx.stream');
goog.require('xrx.token');



/**
 * A class to stream over a labeled XML instance.
 */
xrx.traverse = function(xml) {



  this.stream_ = new xrx.stream(xml);
};



/**
 * 
 */
xrx.traverse.prototype.stream = function() {
  return this.stream_;
};



/**
 * 
 */
xrx.traverse.prototype.xml = function() {
  return this.stream_.xml();
};



/**
 * 
 */
xrx.traverse.prototype.stop = function() {
  this.stream_.stop();
};



/**
 * Event, thrown whenever a start-tag row is found.
 */
xrx.traverse.prototype.rowStartTag = goog.abstractMethod;



/**
 * Event, thrown whenever a empty-tag row is found.
 */
xrx.traverse.prototype.rowEmptyTag = goog.abstractMethod;



/**
 * Event, thrown whenever a end-tag row is found.
 */
xrx.traverse.prototype.rowEndTag = goog.abstractMethod;



/**
 * Event, thrown whenever a tag-name is found.
 */
xrx.traverse.prototype.eventTagName = goog.abstractMethod;



/**
 * Event, thrown whenever a attribute token is found.
 */
xrx.traverse.prototype.eventAttribute = goog.abstractMethod;



/**
 * Event, thrown whenever a attribute name is found.
 */
xrx.traverse.prototype.eventAttrName = goog.abstractMethod;



/**
 * Event, thrown whenever a attribute value is found.
 */
xrx.traverse.prototype.eventAttrValue = goog.abstractMethod;



/**
 * Event, thrown whenever a namespace token is found.
 */
xrx.traverse.prototype.eventNamespace = goog.abstractMethod;



/**
 * Event, thrown whenever a namespace prefix is found.
 */
xrx.traverse.prototype.eventNsPrefix = goog.abstractMethod;



/**
 * Event, thrown whenever a namespace URI is found.
 */
xrx.traverse.prototype.eventNsUri = goog.abstractMethod;




/**
 * Function to turn events on and off.
 * 
 * @param {!string} feature The name of the feature.
 * @param {!boolean} flag On or off.
 */
xrx.traverse.prototype.setFeature = function(feature, flag) {
  this.stream_.setFeature(feature, flag);
};


/**
 * Whether a specific feature is turned on or off.
 * 
 * @param {!string} feature The feature to test.
 * @return {!boolean} True when on otherwise false.
 */
xrx.traverse.prototype.hasFeature = function(feature) {
  return this.stream_.hasFeature(feature);
};



/**
 * Convenience function to turn all events on or off.
 * 
 * @param {!boolean} flag On or off.
 */
xrx.traverse.prototype.setFeatures = function(flag) {
  this.stream_.setFeatures(flag);
};



/**
 * @private
 */
xrx.traverse.prototype.secondaryLabel = function(label, primaryLabel) {

  if (label.isRoot()) {
    label = primaryLabel.clone();
    label.child();
  } else {
    label.nextSibling();
  }
  return label;
};



/**
 * Stream over the labels of a XML instance in forward or 
 * backward direction.
 * @private
 */
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
  };

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
  };

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
  };

  this.stream_.eventTagName = function(offset, length) {
    traverse.eventTagName(label.clone(), offset, length);
  };

  this.stream_.eventAttribute = function(offset, length) {
    attrLabel = traverse.secondaryLabel(attrLabel, label);
    traverse.eventAttribute(attrLabel, offset, length);
  };

  this.stream_.eventAttrName = function(offset, length) {
    if (!traverse.hasFeature('ATTRIBUTE')) attrLabel = traverse.secondaryLabel(attrLabel, label);
    traverse.eventAttrName(attrLabel, offset, length);
  };

  this.stream_.eventAttrValue = function(offset, length) {
    if (!traverse.hasFeature('ATTRIBUTE') && !traverse.hasFeature('ATTR_NAME')) 
        attrLabel = traverse.secondaryLabel(attrLabel, label);
    traverse.eventAttrValue(attrLabel, offset, length);
  };
  
  this.stream_.eventNamespace = function(offset, length) {
    nsLabel = traverse.secondaryLabel(nsLabel, label);
    traverse.eventNamespace(nsLabel, offset, length);
  };
  
  this.stream_.eventNsPrefix = function(offset, length) {
    if (!traverse.hasFeature('NAMESPACE')) nsLabel = traverse.secondaryLabel(nsLabel, label);
    traverse.eventNsPrefix(nsLabel, offset, length);
  };
  
  this.stream_.eventNsUri = function(offset, length) {
    if (!traverse.hasFeature('NAMESPACE') && !traverse.hasFeature('NS_PREFIX')) 
      nsLabel = traverse.secondaryLabel(nsLabel, label);
    traverse.eventNsUri(nsLabel, offset, length);
  };
  
  forward ? this.stream_.forward(start) : this.stream_.backward(start);
};



/**
 * Stream over the labels of a XML instance in forward direction.
 */
xrx.traverse.prototype.forward = function(opt_token) {
  this.traverse(opt_token, true);
};



/**
 * Stream over the labels of a XML instance in backward direction.
 */
xrx.traverse.prototype.backward = function(opt_token) {
  this.traverse(opt_token, false);
};


