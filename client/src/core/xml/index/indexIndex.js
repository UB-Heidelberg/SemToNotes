/**
 * @fileoverview A class to create long-lived binary
 * encodings for XML instances. 
 */


goog.provide('xrx.index.Index');
goog.provide('xrx.index.Namespace');



goog.require('goog.array');
goog.require('xrx.index.Row');
goog.require('xrx.xml.Label');
goog.require('xrx.token');
goog.require('xrx.token.Tokens');
goog.require('xrx.xml.Traverse');



/**
 * A class to create long-lived binary encodings for XML instances.
 * 
 * @param {string} The XML string to be indexed.
 * @constructor
 */
xrx.index.Index = function(xml) {

  /**
   * The indexed XML rows.
   * @type {Array.<xrx.index.Row>}
   */
  this.rows_ = [];

  /**
   * Current position of row iteration.
   * @type {integer}
   */
  this.iterKey_ = 0;

  /**
   * Indexed namespace table.
   * @type {Array.<xrx.index.Namespace>}
   */
  this.tNamespace_ = [];



  this.build(xml);
};



/**
 * Rebuilds the index
 */
xrx.index.Index.prototype.rebuild = function(xml) {
  this.rows_ = [];
  this.iterKey_ = 0;
  this.tNamespace = [];
  this.build(xml);
};



/**
 * Returns the number of rows of the index.
 * @return {integer}
 */
xrx.index.Index.prototype.getLength = function() {
  return this.rows_.length;
};



/**
 * Returns the last key of the index.
 * @return {integer}
 */
xrx.index.Index.prototype.getLastKey = function() {
  return this.getLength() - 1;
};



/**
 * Searches a index key by overloading a tag token.
 * 
 * @param {xrx.token} token The tag token.
 * @param {integer} opt_start The index key where to start.
 * @param {boolean} opt_reverse False to search in forward or true to search in 
 * backward direction.
 * @return {integer} The key.
 */
xrx.index.Index.prototype.getKeyByTag = function(token, opt_start) {
  var row;
  var key;

  opt_start ? this.iterSetKey(opt_start) : this.iterAtFirst();

  do {
    row = this.iterGetRow();
    key = this.iterGetKey();

    if (token.typeOf(row.getType()) && 
        this.getLabel(key).sameAs(token.label())) break;

  } while (row = this.iterNext());

  return key;
};



/**
 * Searches a index key by overloading a not-tag token.
 * @param {xrx.token} token The not-tag token.
 * @return {integer} The key.
 */
xrx.index.Index.prototype.getKeyByNotTag = function(token, opt_start) {
  var row;
  var key;
  var isStartTagRow = token.label().last() === 0 ? true : false;

  opt_start ? this.iterSetKey(opt_start) : this.iterAtFirst();

  if (isStartTagRow) {
    var searchLabel = token.label().clone();
    searchLabel.parent();

    do {
      row = this.iterGetRow();
      key = this.iterGetKey();
  
      if (row.getType() === xrx.token.START_TAG && 
          this.getLabel(key).sameAs(searchLabel)) break;
  
    } while (row = this.iterNext());
    
  } else {
    var searchLabel = token.label().clone();

    do {
      row = this.iterGetRow();
      key = this.iterGetKey();
  
      if ((row.getType() === xrx.token.EMPTY_TAG || row.getType() === xrx.token.END_TAG) && 
          this.getLabel(key).sameAs(searchLabel)) break;
  
    } while (row = this.iterNext());
  }

  return key;
};



/**
 * Returns a index row by overloading a key.
 * @param {!integer} key The key.
 * @return {xrx.index.Row} The row.
 */
xrx.index.Index.prototype.getRowByKey = function(key) {
  return this.rows_[key];
};



/**
 * Searches a index row by overloading a tag token.
 * @param {xrx.token} token The token.
 * @return {xrx.index.Row} The row.
 */
xrx.index.Index.prototype.getRowByTag = function(token, opt_start) {

  return this.getRowByKey(this.getKeyByTag(token, opt_start));
};



/**
 * Searches a index row by overloading a not-tag token.
 * @param {xrx.token} token The token.
 * @return {xrx.index.Row} The row.
 */
xrx.index.Index.prototype.getRowByTag = function(token, opt_start) {

  return this.getRowByKey(this.getKeyByNotTag(token, opt_start));
};



/**
 * Returns a row label by overloading a index key.
 * @return {xrx.xml.Label} The label.
 */
xrx.index.Index.prototype.getLabel = function(key) {
  var row = this.rows_[key];
  var next;
  var last;
  var label = [];

  label.unshift(row.getPosition());
  if (key === 0 || key === this.getLastKey()) return new xrx.xml.Label(label);

  for(;;) {
    next = row.getParent();
    row = this.rows_[next];
    label.unshift(row.getPosition());
    if (next === 0 || next === last) break;
    last = next; // to avoid endless loop
  }

  return new xrx.xml.Label(label);
};



/**
 * Returns a tag token by overloading a row.
 * @return {xrx.token.StartTag|xrx.token.EmptyTag|xrx.token.EndTag} The tag. 
 */
xrx.index.Index.prototype.getTag = function(row) {
  var r = this.rows_[row];
  var tag = new xrx.token.Token(r.getType(), this.getLabel(row),
      r.getOffset(), r.getLength1());
  
  return xrx.token.Tokens.getNative(tag);
};



/**
 * Sets the iterator key at a position.
 * @param {integer} key The key.
 */
xrx.index.Index.prototype.iterSetKey = function(key) {

  this.iterKey_ = key || 0;
};



/**
 * Sets the iterator key at the first position.
 */
xrx.index.Index.prototype.iterAtFirst = function() {

  this.iterKey_ = 0;
};



/**
 * Sets the iterator key at the last position.
 */
xrx.index.Index.prototype.iterAtLast = function() {

  this.iterKey_ = this.getLastKey();
};



/**
 * Returns the current iterator key.
 * @return {integer} The key.
 */
xrx.index.Index.prototype.iterGetKey = function() {

  return this.iterKey_;
};



/**
 * Returns the current row at which the iterator is placed.
 * @return {xrx.index.Row} The row.
 */
xrx.index.Index.prototype.iterGetRow = function() {
  return this.getRowByKey(this.iterKey_);
};



/**
 * Iterates to the next row and returns the row.
 * @return {xrx.index.Row} The row.
 */
xrx.index.Index.prototype.iterNext = function() {

  return this.getRowByKey(++this.iterKey_);
};



/**
 * Iterates to the previous row and returns the row.
 * @return {xrx.index.Row} The row.
 */
xrx.index.Index.prototype.iterPrevious = function() {

  return this.getRowByKey(--this.iterKey_);
};



/**
 * A namespace object. Namespace tokens as the only XML tokens
 * are statically extracted during index building.
 *
 * @param {xrx.xml.Label} opt_label The label of the namespace token.
 * @param {string} opt_prefix The namespace prefix.
 * @param {string} opt_uri The namespace URI.
 */
xrx.index.Namespace = function(opt_label, opt_prefix, opt_uri) {



  this.label = opt_label;



  this.parentLabel;



  this.prefix = opt_prefix;



  this.uri = opt_uri;
};



/**
 * @return {xrx.index.Namespace|undefined}
 */
xrx.index.Index.prototype.getNamespace = function(token, prefix) {

  return goog.array.findRight(this.tNamespace_, function(ns, ind, arr) {
    return ns.prefix === prefix && (token.label().sameAs(ns.parentLabel) ||
        token.label().isDescendantOf(ns.parentLabel));
  });
};



/**
 * @return {string|undefined}
 */
xrx.index.Index.prototype.getNamespaceUri = function(token, prefix) {

  var namespace = goog.array.findRight(this.tNamespace_, function(ns, ind, arr) {
    return ns.prefix === prefix && (token.label().sameAs(ns.parentLabel) ||
        token.label().isDescendantOf(ns.parentLabel));
  });
  
  return namespace ? namespace.uri : undefined;
};



/**
 * @return {string|undefined}
 */
xrx.index.Index.prototype.getNamespacePrefix = function(token, uri) {

  var namespace = goog.array.findRight(this.tNamespace_, function(ns, ind, arr) {
    return ns.uri === uri && (token.label().sameAs(ns.parentLabel) ||
        token.label().isDescendantOf(ns.parentLabel));
  });

  return namespace ? namespace.prefix : undefined;
};



/**
 * Adds a new row to the end of the index and returns the new row.
 * @return {xrx.index.Row} The new row.
 */
xrx.index.Index.prototype.head = function() {
  var row = new xrx.index.Row();
  this.rows_.push(row);

  return this.rows_[this.rows_.length - 1];
};



/**
 * Builds an index from scratch.
 * @param {!string} The XML string.
 */
xrx.index.Index.prototype.build = function(xml) {
  var traverse = new xrx.xml.Traverse(xml);
  var row;
  var index = this;
  var parent;
  var labelBuffer = {};

  traverse.setFeature('NS_PREFIX', true);
  traverse.setFeature('NS_URI', true);
  
  var update = function(row, type, label, offset, length1, length2) {
    parent = label.clone();
    parent.parent();

    row.setType(type);
    row.setPosition(label.last());
    row.setParent(labelBuffer[parent.toString()]);
    row.setOffset(offset);
    row.setLength1(length1);
    row.setLength2(length2);
  };

  traverse.rowStartTag = function(label, offset, length1, length2) {

    update(index.head(), xrx.token.START_TAG, label, offset, length1, length2);
    labelBuffer[label.toString()] = index.getLastKey();
  };

  traverse.rowEmptyTag = function(label, offset, length1, length2) {

    update(index.head(), xrx.token.EMPTY_TAG, label, offset, length1, length2);
  };

  traverse.rowEndTag = function(label, offset, length1, length2) {

    update(index.head(), xrx.token.END_TAG, label, offset, length1, length2);
    delete labelBuffer[label.toString()];
  };

  traverse.eventNsPrefix = function(label, offset, length) {
    var ns = new xrx.index.Namespace(label.clone(), xml.substr(offset, length));
    var parent = label.clone();
    parent.parent();
    ns.parentLabel = parent;
    index.tNamespace_.push(ns);
  };

  traverse.eventNsUri = function(label, offset, length) {
    index.tNamespace_[index.tNamespace_.length - 1].uri = xml.substr(offset, length);
  };

  traverse.forward();
};



/**
 * Inserts a row after a key position.
 * @param {!integer} key The key.
 * @param {!row} row The row.
 */
xrx.index.Index.prototype.insertRowAfter = function(key, row) {
  this.rows_.splice(++key, 0, row);
};



/**
 * Removes a row indicated by a key.
 * @param {!integer} key The key.
 * @param {!integer} opt_num The number of rows to be removed.
 * @param {!row} row The row.
 */
xrx.index.Index.prototype.removeRow = function(key, opt_num) {
  var num = opt_num || 1;

  this.rows_.splice(key, num);
};

