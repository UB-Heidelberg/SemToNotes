/**
 * @fileoverview A class representing a pilot to reach the 
 * tokens of a XML tree.
 */

goog.provide('xrx.pilot');



goog.require('xrx.label');
goog.require('xrx.stream');
goog.require('xrx.token');
goog.require('xrx.traverse');



/**
 * Constructs a new XML pilot.
 * 
 * @param {!string} xml A XML string. 
 * @constructor
 */
xrx.pilot = function(xml) {

  /**
   * Traverse object.
   * @type {xrx.traverse}
   * @private
   */
  this.traverse_ = new xrx.traverse(xml);

  /**
   * Stream object.
   * @type {xrx.stream}
   * @private
   */
  this.stream_ = this.traverse_.stream();

  /**
   * Path lastly used to traverse the XML instance 
   * (for debugging only).
   * @type {string}
   * @private
   */
  this.currentPath_;
};


/**
 * Returns the path lastly used to traverse the XML instance 
 * (for debugging only).
 * @return {?}
 */
xrx.pilot.prototype.currentPath = function() {
  return this.currentPath_;
};



/**
 * Returns a token string or the content of the XML stream.
 * @return {!string}
 */
xrx.pilot.prototype.xml = function(token) {
  return token ? this.traverse_.xml() : 
    this.traverse_.xml().substr(token.offset(), token.length());
};



/**
 * Stops the XML stream.
 * @private
 */
xrx.pilot.prototype.stop = function() {
  this.traverse_.stop();
};



/**
 * Forward piloting.
 * 
 * @param context The context token.
 * @param target The target token.
 */
xrx.pilot.prototype.forward = function(context, target) {
  var tok;
  var pilot = this;

  pilot.traverse_.rowStartTag = function(label, offset, length1, length2) {
    var tmp;

    if (target.type() === xrx.token.NOT_TAG) {
      tmp = label.clone();
      tmp.push0();
    }

    if (target.compare(xrx.token.START_TAG, label)) {
      tok = new xrx.token.StartTag(label.clone());
      tok.offset(offset);
      tok.length(length1);
      pilot.stop();
    } else if (target.compare(xrx.token.NOT_TAG, tmp)) {
      tok = new xrx.token.NotTag(tmp);
      tok.offset(offset + length1);
      tok.length(length2 - length1);
      pilot.stop();
    } else {}
  };
  
  pilot.traverse_.rowEndTag = function(label, offset, length1, length2) {

    if (target.compare(xrx.token.END_TAG, label)) {
      tok = new xrx.token.EndTag(label.clone());
      tok.offset(offset);
      tok.length(length1);
      pilot.stop();
    } else if (target.compare(xrx.token.NOT_TAG, label)) {
      tok = new xrx.token.NotTag(label);
      tok.offset(offset + length1);
      tok.length(length2 - length1);
      pilot.stop();
    } else {}
  };
  
  pilot.traverse_.rowEmptyTag = function(label, offset, length1, length2) {
 
    if (target.compare(xrx.token.EMPTY_TAG, label)) {
      tok = new xrx.token.EmptyTag(label.clone());
      tok.offset(offset);
      tok.length(length1);
      pilot.stop();
    } else if (target.compare(xrx.token.NOT_TAG, label)) {
      tok = new xrx.token.NotTag(label);
      tok.offset(offset + length1);
      tok.length(length2 - length1);
      pilot.stop();
    } else {}
  };
  
  pilot.traverse_.forward(context);

  return tok;
};



/**
 * Backward piloting.
 * 
 * @param context The context token.
 * @param target The target token.
 */
xrx.pilot.prototype.backward = function(context, target) {
  var tok;
  var pilot = this;
  
  pilot.traverse_.rowStartTag = function(label, offset, length1, length2) {

    if (target.compare(xrx.token.START_TAG, label)) {
      tok = new xrx.token.StartTag(label.clone());
      tok.offset(offset);
      tok.length(length1);
      pilot.stop();
    }
  };
  
  pilot.traverse_.rowEndTag = function(label, offset, length1, length2) {

    if (target.compare(xrx.token.END_TAG, label)) {
      tok = new xrx.token.EndTag(label.clone());
      tok.offset(offset);
      tok.length(length1);
      pilot.stop();
    }
  };
  
  pilot.traverse_.rowEmptyTag = function(label, offset, length1, length2) {

    if (target.compare(xrx.token.EMPTY_TAG, label)) {
      tok = new xrx.token.EmptyTag(label.clone());
      tok.offset(offset);
      tok.length(length1);
      pilot.stop();
    }
  };

  pilot.traverse_.backward(context);

  return tok;
};



/**
 * Returns the joint parent of two tags.
 * 
 * @private
 * @param {!xrx.token.StartEmptyTag} tag The overloaded tag.
 * @return {!xrx.token.StartEmptyTag}
 */
xrx.pilot.prototype.jointParent = function(context, tag) {
  var label = context.label().jointParent(tag.label());

  return new xrx.token.StartEmptyTag(label);
};



/**
 * Helper function for xrx.pilot.prototype.path.
 * 
 * @private
 * @param {!xrx.token.StartEmptyTag} tag The target tag.
 * @return {!xrx.token.StartEmptyTag}
 */
xrx.pilot.prototype.onLocation = function(tag) {
  return tag;
};


/**
 * Helper function for xrx.pilot.prototype.path.
 * 
 * @private
 * @param {!xrx.token.StartEmptyTag} tag The target tag.
 * @return {!xrx.token.StartEmptyTag}
 */
xrx.pilot.prototype.zigzag = function(context, tag) {

  // we first traverse to the joint parent tag
  var jointParent = this.backward(context, this.jointParent(context, tag));
  
  // then we've (a) already found the target tag or (b) we 
  // stream forward. We can use xrx.pilot.path short hand for 
  // (a) and (b).
  return this.path(jointParent, tag);
};


/**
 * 
 */
xrx.pilot.prototype.path = function(context, tag) {

  if (context === null) {
    return this.forward(context, tag);
  } else if (context.sameAs(tag)) {
    // context is already at the right place?
    // => return tag
    this.currentPath_ = 'xrx.pilot.prototype.onLocation';
    return this.onLocation(tag);
  } else if (context.isBefore(tag)) {
    // context is placed before the target tag?
    // => stream forward
    this.currentPath_ = 'xrx.pilot.prototype.forward';
    return this.forward(context, tag);
  } else {
    // context is placed after the target tag?
    // => zigzag course
    var zigzag = this.zigzag(context, tag);
    this.currentPath_ = 'xrx.pilot.prototype.zigzag';
    return zigzag;
  }
};



/**
 * Returns the location of a token.
 * @return {?}
 */
xrx.pilot.prototype.location = function(opt_context, target) {
  return this.update(opt_context, target);
};



/**
 * Updates a token and returns its location.
 */
xrx.pilot.prototype.update = function(context, target, update) {
  var token;
  
  switch(target.type()) {
  // primary tokens
  case xrx.token.START_TAG:
    token = this.startTag(context, target, update);
    break;
  case xrx.token.END_TAG:
    token = this.endTag(context, target, update);
    break;
  case xrx.token.EMPTY_TAG:
    token = this.emptyTag(context, target, update);
    break;
  case xrx.token.NOT_TAG:
    token = this.notTag(context, target, update);
    break;
  // secondary tokens
  case xrx.token.TAG_NAME:
    throw Error('Not supported. Use function xrx.pilot.tagName instead.');
    break;
  case xrx.token.ATTRIBUTE:
    token = this.attribute(context, target, update);
    break;
  case xrx.token.ATTR_NAME:
    token = this.attrName(context, target, update);
    break;
  case xrx.token.ATTR_VALUE:
    token = this.attrValue(context, target, update);
    break;
  // generic tokens
  case xrx.token.START_EMPTY_TAG:
    token = this.startEmptyTag(context, target, update);
    break;
  // TODO: complex tokens 
  default:
    throw Error('Unknown type.');
    break;
  }
  return token;
};



/**
 * 
 */
xrx.pilot.prototype.startTag = function(context, target, opt_update) {
  var startTag = this.path(context, target);

  return startTag;
};



/**
 * 
 */
xrx.pilot.prototype.endTag = function(context, target, opt_update) {
  var endTag = this.path(context, target);

  return endTag;
};



/**
 * 
 */
xrx.pilot.prototype.emptyTag = function(context, target, opt_update) {
  var emptyTag = this.path(context, target);

  return emptyTag;
};



/**
 * Get the location of a tag-name token.
 * 
 * @param {(!xrx.token.StartTag|!xrx.token.EndTag|!xrx.token.EmptyTag
 * |!xrx.token.StartEmptyTag)} context The context token at which to 
 * start piloting.
 * @param {(!xrx.token.StartTag|!xrx.token.EndTag|!xrx.token.EmptyTag
 * |!xrx.token.StartEmptyTag|!xrx.token.Tag)} target The tag to which 
 * the tag-name belongs. 
 * @return {xrx.token.TagName} The tag-name token with offset and length
 * information.
 */
xrx.pilot.prototype.tagName = function(context, target) {
  var pos = this.stream_.pos();
  var tag = this.path(context, target);
  var xml = this.stream_.xml().substr(tag.offset(), tag.length());
  var location = this.stream_.tagName(xml);
  var tagName = new xrx.token.TagName(tag.label().clone(), 
      location.offset + tag.offset(), location.length);
  
  // reset the stream reader position, important!
  this.stream_.pos(pos);

  return tagName;
};



/**
 * Get the location of a attribute token.
 * 
 * @param {(!xrx.token.StartTag|!xrx.token.EndTag|!xrx.token.EmptyTag
 * |!xrx.token.StartEmptyTag)} context The context token at which to 
 * start piloting.
 * @param {!xrx.token.Attribute} target The attribute token without
 * offset and length information.
 * @return {xrx.token.Attribute} The attribute token with offset and
 * length information.
 */
xrx.pilot.prototype.attribute = function(context, target) {
  var pos = this.stream_.pos();
  var tag = this.path(context, target.tag());
  var xml = this.stream_.xml().substr(tag.offset(), tag.length());
  var location = this.stream_.attribute(xml, target.label().last());
  var attribute = new xrx.token.Attribute(target.label().clone(), 
      location.offset + tag.offset(), location.length);
  
  // reset the stream reader position, important!
  this.stream_.pos(pos);
  
  return attribute;
};



/**
 * Get the location of a attribute name token.
 * 
 * @param {(!xrx.token.StartTag|!xrx.token.EndTag|!xrx.token.EmptyTag
 * |!xrx.token.StartEmptyTag)} context The context token at which to 
 * start piloting.
 * @param {!xrx.token.AttrName} target The attribute-name token without
 * offset and length information.
 * @return {xrx.token.AttrName} the attribute-name token with offset and
 * length information.
 */
xrx.pilot.prototype.attrName = function(context, target) {
  var pos = this.stream_.pos();
  var tag = this.path(context, target.tag());
  var xml = this.stream_.xml().substr(tag.offset(), tag.length());
  var location = this.stream_.attrName(xml, target.label().last());
  var attrName = new xrx.token.AttrName(target.label().clone(), 
      location.offset + tag.offset(), location.length);
  
  // reset the stream reader position, important!
  this.stream_.pos(pos);

  return attrName;  
};



/**
 * Get the location and optionally update a xrx.token.AttrValue.
 * 
 * @param {?} context
 * @param {!xrx.token.AttrValue} target The attribute-value token.
 * @param {?string} opt_update The new attribute-value.
 * @return {!xrx.token.AttrValue}
 */
xrx.pilot.prototype.attrValue = function(context, target, opt_update) {
  var pos = this.stream_.pos();
  var tag = this.path(context, target.tag());
  var xml = this.stream_.xml().substr(tag.offset(), tag.length());
  var location = this.stream_.attrValue(xml, target.label().last());
  var attrValue = new xrx.token.AttrValue(target.label().clone(), 
      location.offset + tag.offset(), location.length);
  
  // reset the stream reader position, important!
  this.stream_.pos(pos);  

  return opt_update === undefined ? attrValue :
      xrx.update.attrValue(this.stream_, attrValue, opt_update);
};



/**
 * Get the location and optionally update a xrx.token.NotTag.
 * 
 * @param {?} context
 * @param {!xrx.token.NotTag} target The not-tag token.
 * @param {?string} opt_update The new not-tag.
 * @return {!xrx.token.NotTag}
 */
xrx.pilot.prototype.notTag = function(context, target, opt_update) {
  var notTag = this.path(context, target);

  return opt_update === undefined ? notTag :
      xrx.update.notTag(this.stream_, notTag, opt_update);
};



xrx.pilot.prototype.startEmptyTag = function(context, target, opt_update) {
  var startEmptyTag = this.path(context, target);

  return opt_update === undefined ? startEmptyTag :
      xrx.update.startEmptyTag(this.stream_, startEmptyTag, opt_update);
};



xrx.pilot.prototype.tag = function(context, target, opt_update) {
  
};


/**
 * Get or update an array of xrx.token.Attribute.
 * 
 * @param {?} context
 * @param {!xrx.token.StartEmptyTag} target The start-empty tag.
 * @param {?Array.<xrx.token.Attribute>} opt_update Array of new attribute tokens.
 * @return {!Array.<xrx.token.Attribute>}
 */
xrx.pilot.prototype.attributes = function(context, target, opt_update) {
  var pos = this.stream_.pos();
  var tag = this.path(context, target);
  var xml = this.stream_.xml().substr(tag.offset(), tag.length());
  var locations = this.stream_.attributes(xml);
  var attributes = [];
  var label = target.label().clone();
  label.child();
  for (var pos in locations) {
    var location = locations[pos];
    attributes.push(new xrx.token.Attribute(label.clone(),
        location.offset + tag.offset(), location.length));
    label.nextSibling();
  }
  
  // reset the stream reader position, important!
  this.stream_.pos(pos); 

  return opt_update === undefined ? attributes : 
      xrx.update.attributes(this.stream_, attributes, opt_update);
};
