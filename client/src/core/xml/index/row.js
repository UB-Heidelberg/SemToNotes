***REMOVED***
***REMOVED*** @fileoverview A class representing a binary encoded row
***REMOVED*** of a XML instance. 
***REMOVED***

goog.provide('xrx.index.row');
goog.provide('xrx.index.row.format');
goog.provide('xrx.index.row.mask');




goog.require('xrx.index');
goog.require('goog.math.Long');



xrx.index.row = function() {

  this.low_ = new goog.math.Long();
  this.high_ = new goog.math.Long();
***REMOVED***



xrx.index.row.format_ = '128Bit';



xrx.index.row.format = {***REMOVED***



xrx.index.row.format['128Bit'] = {

  TYPE: { bits: 'low_', shft: 59, size: 4 },
  POSITION: { bits: 'low_', shft: 41, size: 18 },
  PARENT: { bits: 'low_', shft: 24, size: 17 },
  OFFSET: { bits: 'low_', shft: 0, size: 24 },
  LENGTH1: { bits: 'high_', shft: 43, size: 20 },
  LENGTH2: { bits: 'high_', shft: 23, size: 20 }
***REMOVED***



xrx.index.row.mask = {***REMOVED***



xrx.index.row.mask.fromFormat = function(format, itm) {
  var item = xrx.index.row.format[format][itm];
  var shft = item.shft;
  var int = Math.pow(2, item.size) - 1;

  return goog.math.Long.fromInt(int).shiftLeft(shft);
***REMOVED***



xrx.index.row.mask['128Bit'] = {

  TYPE: xrx.index.row.mask.fromFormat('128Bit', 'TYPE'),
  POSITION: xrx.index.row.mask.fromFormat('128Bit', 'POSITION'),
  PARENT: xrx.index.row.mask.fromFormat('128Bit', 'PARENT'),
  OFFSET: xrx.index.row.mask.fromFormat('128Bit', 'OFFSET'),
  LENGTH1: xrx.index.row.mask.fromFormat('128Bit', 'LENGTH1'),
  LENGTH2: xrx.index.row.mask.fromFormat('128Bit', 'LENGTH2')
***REMOVED***



***REMOVED***
***REMOVED*** Shared function for all getter functions.
***REMOVED*** @private
***REMOVED***
xrx.index.row.prototype.get = function(item) {
  var i = xrx.index.row.format[xrx.index.row.format_][item];
  var mask = xrx.index.row.mask[xrx.index.row.format_][item];

  return this[i.bits].and(mask).shiftRight(i.shft).toInt();
***REMOVED***



***REMOVED***
***REMOVED*** Shared function for all setter functions.
***REMOVED*** @private
***REMOVED***
xrx.index.row.prototype.set = function(int, format) {
  var long = goog.math.Long.fromInt(int);

  long = long.shiftLeft(format.shft);
  this[format.bits] = this[format.bits].or(long);
***REMOVED***



***REMOVED***
***REMOVED*** Shared function for all update functions.
***REMOVED*** @private
***REMOVED***
xrx.index.row.prototype.update = function(diff, format) {
  var long = goog.math.Long.fromInt(diff);

  long = long.shiftLeft(format.shft);
  this[format.bits] = this[format.bits].add(long);
***REMOVED***



***REMOVED***
***REMOVED*** Decodes the type descriptor of the row from binary to
***REMOVED*** integer and returns the type as integer.
***REMOVED*** @return {!integer} The token type.
***REMOVED***
xrx.index.row.prototype.getType = function() {
  return this.get('TYPE');
***REMOVED***



***REMOVED***
***REMOVED*** 
***REMOVED***
xrx.index.row.prototype.setType = function(type) {
  this.set(type, xrx.index.row.format[xrx.index.row.format_].TYPE);
***REMOVED***



***REMOVED***
***REMOVED*** 
***REMOVED***
xrx.index.row.prototype.updateType = function(type) {
  this.update(type, xrx.index.row.format[xrx.index.row.format_].TYPE);
***REMOVED***



***REMOVED***
***REMOVED*** Decodes the position descriptor of the row from binary to
***REMOVED*** integer and returns the position as integer.
***REMOVED*** @return {!integer} The label position.
***REMOVED***
xrx.index.row.prototype.getPosition = function() {
  return this.get('POSITION');
***REMOVED***



***REMOVED***
***REMOVED*** 
***REMOVED***
xrx.index.row.prototype.setPosition = function(position) {
  this.set(position, xrx.index.row.format[xrx.index.row.format_].POSITION); 
***REMOVED***



***REMOVED***
***REMOVED*** 
***REMOVED***
xrx.index.row.prototype.updatePosition = function(position) {
  this.update(position, xrx.index.row.format[xrx.index.row.format_].POSITION); 
***REMOVED***



***REMOVED***
***REMOVED*** Decodes the parent descriptor of the row from binary to
***REMOVED*** integer and returns the parent as integer.
***REMOVED*** @return {!integer} The label parent.
***REMOVED***
xrx.index.row.prototype.getParent = function() {
  return this.get('PARENT');
***REMOVED***



***REMOVED***
***REMOVED*** 
***REMOVED***
xrx.index.row.prototype.setParent = function(parent) {
  this.set(parent, xrx.index.row.format[xrx.index.row.format_].PARENT); 
***REMOVED***



***REMOVED***
***REMOVED*** 
***REMOVED***
xrx.index.row.prototype.updateParent = function(parent) {
  this.update(parent, xrx.index.row.format[xrx.index.row.format_].PARENT); 
***REMOVED***



***REMOVED***
***REMOVED*** Decodes the position descriptor of the row from binary to
***REMOVED*** integer and returns the position as integer.
***REMOVED*** @return {!integer} The token offset.
***REMOVED***
xrx.index.row.prototype.getOffset = function() {
  return this.get('OFFSET');
***REMOVED***



***REMOVED***
***REMOVED*** 
***REMOVED***
xrx.index.row.prototype.setOffset = function(offset) {
  this.set(offset, xrx.index.row.format[xrx.index.row.format_].OFFSET); 
***REMOVED***



***REMOVED***
***REMOVED*** 
***REMOVED***
xrx.index.row.prototype.updateOffset = function(offset) {
  this.update(offset, xrx.index.row.format[xrx.index.row.format_].OFFSET); 
***REMOVED***



***REMOVED***
***REMOVED*** Decodes the length1 descriptor of the row from binary to
***REMOVED*** integer and returns the length1 as integer.
***REMOVED*** @return {!integer} Length1 of the token.
***REMOVED***
xrx.index.row.prototype.getLength1 = function() {
  return this.get('LENGTH1');
***REMOVED***



***REMOVED***
***REMOVED*** 
***REMOVED***
xrx.index.row.prototype.setLength1 = function(length) {
  this.set(length, xrx.index.row.format[xrx.index.row.format_].LENGTH1);
***REMOVED***



***REMOVED***
***REMOVED*** 
***REMOVED***
xrx.index.row.prototype.updateLength1 = function(length) {
  this.update(length, xrx.index.row.format[xrx.index.row.format_].LENGTH1);
***REMOVED***



***REMOVED***
***REMOVED*** Decodes the length2 descriptor of the row from binary to
***REMOVED*** integer and returns the length2 as integer.
***REMOVED*** @return {!integer} Length2 of the token.
***REMOVED***
xrx.index.row.prototype.getLength2 = function() {
  return this.get('LENGTH2');
***REMOVED***



***REMOVED***
***REMOVED*** 
***REMOVED***
xrx.index.row.prototype.setLength2 = function(length) {
  this.set(length, xrx.index.row.format[xrx.index.row.format_].LENGTH2);
***REMOVED***



***REMOVED***
***REMOVED*** 
***REMOVED***
xrx.index.row.prototype.updateLength2 = function(length) {
  this.update(length, xrx.index.row.format[xrx.index.row.format_].LENGTH2);
***REMOVED***



***REMOVED***
***REMOVED*** 
***REMOVED***
xrx.index.row.prototype.toString = function() {

  var formatNumber = function(number) {
    var str = "" + number.toString(2);
    while (str.length < 64) {
      str = "0" + str;
    }
    return str;
 ***REMOVED*****REMOVED***

  return formatNumber(this.low_) + '|' + formatNumber(this.high_);
***REMOVED***

