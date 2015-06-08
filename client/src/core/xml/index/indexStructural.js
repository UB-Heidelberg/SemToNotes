/**
 * @fileoverview  
 */

goog.provide('xrx.index.Structural');


goog.require('goog.array');
goog.require('goog.structs.Map');
goog.require('xrx.xml.Label');



xrx.index.Structural = function() {

  goog.base(this);

  this.pos_ = 0;
};
goog.inherits(xrx.index.Structural, goog.structs.Map);



xrx.index.Structural.prototype.createKey = function(type, label) {
  return xrx.index.Structural.createKey(type, label);
};



xrx.index.Structural.createKey = function(type, label) {
  var arr = goog.array.clone(label.getArray());
  arr.unshift(type);
  return arr.join('.');
};



xrx.index.Structural.prototype.add = function(type, label, offset, length1,
    length2) {
  var key = this.createKey(type, label);
  this.set(key, [offset, length1, length2]);
};



xrx.index.Structural.prototype.at = function(key) {
  var index = goog.array.indexOf(this.keys_, key);
  this.pos_ = index;
  return index === -1 ? false : true;
};



xrx.index.Structural.prototype.first = function() {
  this.pos_ = 0;
};



xrx.index.Structural.prototype.next = function() {
  if (this.pos_ <= this.count_ - 2) {
    this.pos_++;
    return true;
  }
  return false;
};



xrx.index.Structural.prototype.previous = function() {
  if (this.pos_ > 0) {
    this.pos_--;
    return true;
  }
  return false;
};



xrx.index.Structural.prototype.last = function() {
  this.pos_ = this.count_ - 1;
};



xrx.index.Structural.prototype.getType = function(opt_key) {
  var key = opt_key || this.keys_[this.pos_];
  return parseInt(key.split('.')[0]);
};



xrx.index.Structural.prototype.getKey = function() {
  return this.keys_[this.pos_];
};



xrx.index.Structural.prototype.getLabel = function(opt_key) {
  var key = opt_key || this.keys_[this.pos_];
  var arr = key.split('.').slice(1);
  for (var i = 0, len = arr.length; i < len; i++) {
    arr[i] = parseInt(arr[i]);
  };
  return new xrx.xml.Label(arr);
};



/**
 *
 */
xrx.index.Structural.prototype.getOffset = function(opt_key) {
  var key = opt_key || this.keys_[this.pos_];
  return this.map_[key][0];
};



/**
 * 
 */
xrx.index.Structural.prototype.setOffset = function(offset) {
};



/**
 * 
 */
xrx.index.Structural.prototype.getLength1 = function(opt_key) {
  var key = opt_key || this.keys_[this.pos_];
  return this.map_[key][1];
};



/**
 * 
 */
xrx.index.Structural.prototype.setLength1 = function(length) {
};



/**
 *
 */
xrx.index.Structural.prototype.getLength2 = function(opt_key) {
  var key = opt_key || this.keys_[this.pos_];
  return this.map_[key][2];
};



/**
 * 
 */
xrx.index.Structural.prototype.setLength2 = function(length) {
};
