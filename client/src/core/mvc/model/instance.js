/**
 * @fileoverview Class implements data instance component for 
 * the model-view-controller.
 */

goog.provide('xrx.instance');



goog.require('goog.dom');
goog.require('goog.events');
goog.require('goog.net.XhrIo');
goog.require('xrx.index');
goog.require('xrx.model');
goog.require('xrx.node');
goog.require('xrx.node.DocumentB');
goog.require('xrx.parse');
goog.require('xrx.stream');
goog.require('xrx.pilot');



/**
 * @constructor
 */
xrx.instance = function(element) {
  goog.base(this, element);



  this.xml_;



  this.stream_;



  this.pilot_;
};
goog.inherits(xrx.instance, xrx.model);



/**
 * 
 */
xrx.instance.prototype.update = function(offset, length, xml) {

  var tmp = this.xml_.substr(0, offset) + xml + this.xml_.substr(
      offset + length);

  this.xml_ = undefined;
  this.xml_ = tmp;
  this.stream_ = undefined;
  this.stream_ = new xrx.stream(this.xml_);
  this.pilot_ = undefined;
  this.pilot_ = new xrx.pilot(this.xml_);
};



/**
 * 
 */
xrx.instance.prototype.getDataInline = function() {
  var parse = new xrx.parse();

  this.xml_ = parse.normalize(goog.dom.getRawTextContent(this.getElement()));
  this.stream_ = new xrx.stream(this.xml_);
  this.pilot_ = new xrx.pilot(this.xml_);
};



/**
 * 
 */
xrx.instance.prototype.getDataRemote = function(xml) {
  var parse = new xrx.parse();

  this.xml_ = parse.normalize(xml);
  this.stream_ = new xrx.stream(this.xml_);
  this.pilot_ = new xrx.pilot(this.xml_);
};




/**
 * @override
 */
xrx.instance.prototype.recalculate = function(xml) {
  this.getSrcUri() ? this.getDataRemote(xml) : this.getDataInline();
};



/**
 * @return {!string} The XML instance as string.
 */
xrx.instance.prototype.xml = function(xml) {
  if (xml) this.xml_ = xml;
  if (!this.xml_) this.recalculate();
  return this.xml_;
};



/**
 * @return {xrx.stream} The stream.
 */
xrx.instance.prototype.getStream = function() {
  return this.stream_;
};



/**
 * @return {xrx.pilot} The pilot.
 */
xrx.instance.prototype.getPilot = function() {
  return this.pilot_;
};



/**
 * @return {!xrx.node.Document} The XML instance as node.
 */
xrx.instance.prototype.getDocument = function(id) {
  return new xrx.node.DocumentB(this);
};



/**
 * @return {!xrx.index}
 */
xrx.instance.prototype.getIndex = function() {
  if (!this.xml_) this.recalculate();
  if (this.index_ === undefined) this.index_ = new xrx.index(this.xml_);

  return this.index_;
};
