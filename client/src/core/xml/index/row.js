/**
 * @fileoverview A class representing a binary encoded row
 * of a XML instance. 
 */

goog.provide('xrx.index.row');
goog.provide('xrx.index.row.format');
goog.provide('xrx.index.row.mask');



goog.require('goog.math.Long');
goog.require('xrx.index');



xrx.index.row = function() {

  this.low_ = new goog.math.Long();
  this.high_ = new goog.math.Long();
};



xrx.index.row.format_ = '128Bit';



xrx.index.row.format = {};



xrx.index.row.format['128Bit'] = {

  TYPE: { bits: 'low_', shift: 59, size: 4 },
  POSITION: { bits: 'low_', shift: 41, size: 18 },
  PARENT: { bits: 'low_', shift: 24, size: 17 },
  OFFSET: { bits: 'low_', shift: 0, size: 24 },
  LENGTH1: { bits: 'high_', shift: 43, size: 20 },
  LENGTH2: { bits: 'high_', shift: 23, size: 20 }
};



xrx.index.row.mask = {};



xrx.index.row.mask.fromFormat = function(format, item) {
  var item = xrx.index.row.format[format][item];
  var shift = item.shift;
  var integer = Math.pow(2, item.size) - 1;

  return goog.math.Long.fromInt(integer).shiftLeft(shift);
};



xrx.index.row.mask['128Bit'] = {

  TYPE: xrx.index.row.mask.fromFormat('128Bit', 'TYPE'),
  POSITION: xrx.index.row.mask.fromFormat('128Bit', 'POSITION'),
  PARENT: xrx.index.row.mask.fromFormat('128Bit', 'PARENT'),
  OFFSET: xrx.index.row.mask.fromFormat('128Bit', 'OFFSET'),
  LENGTH1: xrx.index.row.mask.fromFormat('128Bit', 'LENGTH1'),
  LENGTH2: xrx.index.row.mask.fromFormat('128Bit', 'LENGTH2')
};



/**
 * Shared function for all getter functions.
 * @private
 */
xrx.index.row.prototype.get = function(item) {
  var i = xrx.index.row.format[xrx.index.row.format_][item];
  var mask = xrx.index.row.mask[xrx.index.row.format_][item];

  return this[i.bits].and(mask).shiftRight(i.shift).toInt();
};



/**
 * Shared function for all setter functions.
 * @private
 */
xrx.index.row.prototype.set = function(integer, format) {
  var long = goog.math.Long.fromInt(integer);

  long = long.shiftLeft(format.shift);
  this[format.bits] = this[format.bits].or(long);
};



/**
 * Shared function for all update functions.
 * @private
 */
xrx.index.row.prototype.update = function(diff, format) {
  var long = goog.math.Long.fromInt(diff);

  long = long.shiftLeft(format.shift);
  this[format.bits] = this[format.bits].add(long);
};



/**
 * Decodes the type descriptor of the row from binary to
 * integer and returns the type as integer.
 * @return {!integer} The token type.
 */
xrx.index.row.prototype.getType = function() {
  return this.get('TYPE');
};



/**
 * 
 */
xrx.index.row.prototype.setType = function(type) {
  this.set(type, xrx.index.row.format[xrx.index.row.format_].TYPE);
};



/**
 * 
 */
xrx.index.row.prototype.updateType = function(type) {
  this.update(type, xrx.index.row.format[xrx.index.row.format_].TYPE);
};



/**
 * Decodes the position descriptor of the row from binary to
 * integer and returns the position as integer.
 * @return {!integer} The label position.
 */
xrx.index.row.prototype.getPosition = function() {
  return this.get('POSITION');
};



/**
 * 
 */
xrx.index.row.prototype.setPosition = function(position) {
  this.set(position, xrx.index.row.format[xrx.index.row.format_].POSITION); 
};



/**
 * 
 */
xrx.index.row.prototype.updatePosition = function(position) {
  this.update(position, xrx.index.row.format[xrx.index.row.format_].POSITION); 
};



/**
 * Decodes the parent descriptor of the row from binary to
 * integer and returns the parent as integer.
 * @return {!integer} The label parent.
 */
xrx.index.row.prototype.getParent = function() {
  return this.get('PARENT');
};



/**
 * 
 */
xrx.index.row.prototype.setParent = function(parent) {
  this.set(parent, xrx.index.row.format[xrx.index.row.format_].PARENT); 
};



/**
 * 
 */
xrx.index.row.prototype.updateParent = function(parent) {
  this.update(parent, xrx.index.row.format[xrx.index.row.format_].PARENT); 
};



/**
 * Decodes the position descriptor of the row from binary to
 * integer and returns the position as integer.
 * @return {!integer} The token offset.
 */
xrx.index.row.prototype.getOffset = function() {
  return this.get('OFFSET');
};



/**
 * 
 */
xrx.index.row.prototype.setOffset = function(offset) {
  this.set(offset, xrx.index.row.format[xrx.index.row.format_].OFFSET); 
};



/**
 * 
 */
xrx.index.row.prototype.updateOffset = function(offset) {
  this.update(offset, xrx.index.row.format[xrx.index.row.format_].OFFSET); 
};



/**
 * Decodes the length1 descriptor of the row from binary to
 * integer and returns the length1 as integer.
 * @return {!integer} Length1 of the token.
 */
xrx.index.row.prototype.getLength1 = function() {
  return this.get('LENGTH1');
};



/**
 * 
 */
xrx.index.row.prototype.setLength1 = function(length) {
  this.set(length, xrx.index.row.format[xrx.index.row.format_].LENGTH1);
};



/**
 * 
 */
xrx.index.row.prototype.updateLength1 = function(length) {
  this.update(length, xrx.index.row.format[xrx.index.row.format_].LENGTH1);
};



/**
 * Decodes the length2 descriptor of the row from binary to
 * integer and returns the length2 as integer.
 * @return {!integer} Length2 of the token.
 */
xrx.index.row.prototype.getLength2 = function() {
  return this.get('LENGTH2');
};



/**
 * 
 */
xrx.index.row.prototype.setLength2 = function(length) {
  this.set(length, xrx.index.row.format[xrx.index.row.format_].LENGTH2);
};



/**
 * 
 */
xrx.index.row.prototype.updateLength2 = function(length) {
  this.update(length, xrx.index.row.format[xrx.index.row.format_].LENGTH2);
};



/**
 * 
 */
xrx.index.row.prototype.toString = function() {

  var formatNumber = function(number) {
    var str = "" + number.toString(2);
    while (str.length < 64) {
      str = "0" + str;
    }
    return str;
  };

  return formatNumber(this.low_) + '|' + formatNumber(this.high_);
};

