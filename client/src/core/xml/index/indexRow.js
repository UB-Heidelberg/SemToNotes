/**
 * @fileoverview A class representing a binary encoded row
 * of a XML instance. 
 */

goog.provide('xrx.index.Row');
goog.provide('xrx.index.Row.format');
goog.provide('xrx.index.Row.mask');




goog.require('goog.math.Long');



xrx.index.Row = function() {

  this.low_ = new goog.math.Long();
  this.high_ = new goog.math.Long();
};



xrx.index.Row.format_ = '128Bit';



xrx.index.Row.format = {};



xrx.index.Row.format['128Bit'] = {

  TYPE: { bits: 'low_', shft: 59, size: 4 },
  POSITION: { bits: 'low_', shft: 41, size: 18 },
  PARENT: { bits: 'low_', shft: 24, size: 17 },
  OFFSET: { bits: 'low_', shft: 0, size: 24 },
  LENGTH1: { bits: 'high_', shft: 43, size: 20 },
  LENGTH2: { bits: 'high_', shft: 23, size: 20 }
};



xrx.index.Row.mask = {};



xrx.index.Row.mask.fromFormat = function(format, itm) {
  var item = xrx.index.Row.format[format][itm];
  var shft = item.shft;
  var integ = Math.pow(2, item.size) - 1;

  return goog.math.Long.fromInt(integ).shiftLeft(shft);
};



xrx.index.Row.mask['128Bit'] = {

  TYPE: xrx.index.Row.mask.fromFormat('128Bit', 'TYPE'),
  POSITION: xrx.index.Row.mask.fromFormat('128Bit', 'POSITION'),
  PARENT: xrx.index.Row.mask.fromFormat('128Bit', 'PARENT'),
  OFFSET: xrx.index.Row.mask.fromFormat('128Bit', 'OFFSET'),
  LENGTH1: xrx.index.Row.mask.fromFormat('128Bit', 'LENGTH1'),
  LENGTH2: xrx.index.Row.mask.fromFormat('128Bit', 'LENGTH2')
};



/**
 * Shared function for all getter functions.
 * @private
 */
xrx.index.Row.prototype.get = function(item) {
  var i = xrx.index.Row.format[xrx.index.Row.format_][item];
  var mask = xrx.index.Row.mask[xrx.index.Row.format_][item];

  return this[i.bits].and(mask).shiftRight(i.shft).toInt();
};



/**
 * Shared function for all setter functions.
 * @private
 */
xrx.index.Row.prototype.set = function(integ, format) {
  var lng = goog.math.Long.fromInt(integ);

  lng = lng.shiftLeft(format.shft);
  this[format.bits] = this[format.bits].or(lng);
};



/**
 * Shared function for all update functions.
 * @private
 */
xrx.index.Row.prototype.update = function(diff, format) {
  var lng = goog.math.Long.fromInt(diff);

  lng = lng.shiftLeft(format.shft);
  this[format.bits] = this[format.bits].add(lng);
};



/**
 * Decodes the type descriptor of the row from binary to
 * integer and returns the type as integer.
 * @return {!integer} The token type.
 */
xrx.index.Row.prototype.getType = function() {
  return this.get('TYPE');
};



/**
 * 
 */
xrx.index.Row.prototype.setType = function(type) {
  this.set(type, xrx.index.Row.format[xrx.index.Row.format_].TYPE);
};



/**
 * 
 */
xrx.index.Row.prototype.updateType = function(type) {
  this.update(type, xrx.index.Row.format[xrx.index.Row.format_].TYPE);
};



/**
 * Decodes the position descriptor of the row from binary to
 * integer and returns the position as integer.
 * @return {!integer} The label position.
 */
xrx.index.Row.prototype.getPosition = function() {
  return this.get('POSITION');
};



/**
 * 
 */
xrx.index.Row.prototype.setPosition = function(position) {
  this.set(position, xrx.index.Row.format[xrx.index.Row.format_].POSITION); 
};



/**
 * 
 */
xrx.index.Row.prototype.updatePosition = function(position) {
  this.update(position, xrx.index.Row.format[xrx.index.Row.format_].POSITION); 
};



/**
 * Decodes the parent descriptor of the row from binary to
 * integer and returns the parent as integer.
 * @return {!integer} The label parent.
 */
xrx.index.Row.prototype.getParent = function() {
  return this.get('PARENT');
};



/**
 * 
 */
xrx.index.Row.prototype.setParent = function(parent) {
  this.set(parent, xrx.index.Row.format[xrx.index.Row.format_].PARENT); 
};



/**
 * 
 */
xrx.index.Row.prototype.updateParent = function(parent) {
  this.update(parent, xrx.index.Row.format[xrx.index.Row.format_].PARENT); 
};



/**
 * Decodes the position descriptor of the row from binary to
 * integer and returns the position as integer.
 * @return {!integer} The token offset.
 */
xrx.index.Row.prototype.getOffset = function() {
  return this.get('OFFSET');
};



/**
 * 
 */
xrx.index.Row.prototype.setOffset = function(offset) {
  this.set(offset, xrx.index.Row.format[xrx.index.Row.format_].OFFSET); 
};



/**
 * 
 */
xrx.index.Row.prototype.updateOffset = function(offset) {
  this.update(offset, xrx.index.Row.format[xrx.index.Row.format_].OFFSET); 
};



/**
 * Decodes the length1 descriptor of the row from binary to
 * integer and returns the length1 as integer.
 * @return {!integer} Length1 of the token.
 */
xrx.index.Row.prototype.getLength1 = function() {
  return this.get('LENGTH1');
};



/**
 * 
 */
xrx.index.Row.prototype.setLength1 = function(length) {
  this.set(length, xrx.index.Row.format[xrx.index.Row.format_].LENGTH1);
};



/**
 * 
 */
xrx.index.Row.prototype.updateLength1 = function(length) {
  this.update(length, xrx.index.Row.format[xrx.index.Row.format_].LENGTH1);
};



/**
 * Decodes the length2 descriptor of the row from binary to
 * integer and returns the length2 as integer.
 * @return {!integer} Length2 of the token.
 */
xrx.index.Row.prototype.getLength2 = function() {
  return this.get('LENGTH2');
};



/**
 * 
 */
xrx.index.Row.prototype.setLength2 = function(length) {
  this.set(length, xrx.index.Row.format[xrx.index.Row.format_].LENGTH2);
};



/**
 * 
 */
xrx.index.Row.prototype.updateLength2 = function(length) {
  this.update(length, xrx.index.Row.format[xrx.index.Row.format_].LENGTH2);
};



/**
 * 
 */
xrx.index.Row.prototype.toString = function() {

  var formatNumber = function(number) {
    var str = "" + number.toString(2);
    while (str.length < 64) {
      str = "0" + str;
    }
    return str;
  };

  return formatNumber(this.low_) + '|' + formatNumber(this.high_);
};

