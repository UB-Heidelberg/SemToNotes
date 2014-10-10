***REMOVED***
***REMOVED*** @fileoverview A class to create long-lived binary
***REMOVED*** encodings for XML instances. 
***REMOVED***


goog.provide('xrx.index');
goog.provide('xrx.index.Namespace');



goog.require('goog.array');
goog.require('xrx.index.row');
goog.require('xrx.xml.Label');
goog.require('xrx.token');
goog.require('xrx.token.Tokens');
goog.require('xrx.xml.Traverse');



***REMOVED***
***REMOVED*** A class to create long-lived binary encodings for XML instances.
***REMOVED*** 
***REMOVED*** @param {string} The XML string to be indexed.
***REMOVED***
***REMOVED***
xrx.index = function(xml) {

 ***REMOVED*****REMOVED***
  ***REMOVED*** The indexed XML rows.
  ***REMOVED*** @type {Array.<xrx.index.row>}
 ***REMOVED*****REMOVED***
  this.rows_ = [];

 ***REMOVED*****REMOVED***
  ***REMOVED*** Current position of row iteration.
  ***REMOVED*** @type {integer}
 ***REMOVED*****REMOVED***
  this.iterKey_ = 0;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Indexed namespace table.
  ***REMOVED*** @type {Array.<xrx.index.Namespace>}
 ***REMOVED*****REMOVED***
  this.tNamespace_ = [];



  this.build(xml);
***REMOVED***



***REMOVED***
***REMOVED*** Returns the number of rows of the index.
***REMOVED*** @return {integer}
***REMOVED***
xrx.index.prototype.getLength = function() {
  return this.rows_.length;
***REMOVED***



***REMOVED***
***REMOVED*** Returns the last key of the index.
***REMOVED*** @return {integer}
***REMOVED***
xrx.index.prototype.getLastKey = function() {
  return this.getLength() - 1;
***REMOVED***



***REMOVED***
***REMOVED*** Searches a index key by overloading a tag token.
***REMOVED*** 
***REMOVED*** @param {xrx.token} token The tag token.
***REMOVED*** @param {integer} opt_start The index key where to start.
***REMOVED*** @param {boolean} opt_reverse False to search in forward or true to search in 
***REMOVED*** backward direction.
***REMOVED*** @return {integer} The key.
***REMOVED***
xrx.index.prototype.getKeyByTag = function(token, opt_start) {
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
***REMOVED***



***REMOVED***
***REMOVED*** Searches a index key by overloading a not-tag token.
***REMOVED*** @param {xrx.token} token The not-tag token.
***REMOVED*** @return {integer} The key.
***REMOVED***
xrx.index.prototype.getKeyByNotTag = function(token, opt_start) {
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
***REMOVED***



***REMOVED***
***REMOVED*** Returns a index row by overloading a key.
***REMOVED*** @param {!integer} key The key.
***REMOVED*** @return {xrx.index.row} The row.
***REMOVED***
xrx.index.prototype.getRowByKey = function(key) {
  return this.rows_[key];
***REMOVED***



***REMOVED***
***REMOVED*** Searches a index row by overloading a tag token.
***REMOVED*** @param {xrx.token} token The token.
***REMOVED*** @return {xrx.index.row} The row.
***REMOVED***
xrx.index.prototype.getRowByTag = function(token, opt_start) {

  return this.getRowByKey(this.getKeyByTag(token, opt_start));
***REMOVED***



***REMOVED***
***REMOVED*** Searches a index row by overloading a not-tag token.
***REMOVED*** @param {xrx.token} token The token.
***REMOVED*** @return {xrx.index.row} The row.
***REMOVED***
xrx.index.prototype.getRowByTag = function(token, opt_start) {

  return this.getRowByKey(this.getKeyByNotTag(token, opt_start));
***REMOVED***



***REMOVED***
***REMOVED*** Returns a row label by overloading a index key.
***REMOVED*** @return {xrx.xml.Label} The label.
***REMOVED***
xrx.index.prototype.getLabel = function(key) {
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
***REMOVED***



***REMOVED***
***REMOVED*** Returns a tag token by overloading a row.
***REMOVED*** @return {xrx.token.StartTag|xrx.token.EmptyTag|xrx.token.EndTag} The tag. 
***REMOVED***
xrx.index.prototype.getTag = function(row) {
  var r = this.rows_[row];
  var tag = new xrx.token.Abstract(r.getType(), this.getLabel(row),
      r.getOffset(), r.getLength1());
  
  return xrx.token.Tokens.getNative(tag);
***REMOVED***



***REMOVED***
***REMOVED*** Sets the iterator key at a position.
***REMOVED*** @param {integer} key The key.
***REMOVED***
xrx.index.prototype.iterSetKey = function(key) {

  this.iterKey_ = key || 0;
***REMOVED***



***REMOVED***
***REMOVED*** Sets the iterator key at the first position.
***REMOVED***
xrx.index.prototype.iterAtFirst = function() {

  this.iterKey_ = 0;
***REMOVED***



***REMOVED***
***REMOVED*** Sets the iterator key at the last position.
***REMOVED***
xrx.index.prototype.iterAtLast = function() {

  this.iterKey_ = this.getLastKey();
***REMOVED***



***REMOVED***
***REMOVED*** Returns the current iterator key.
***REMOVED*** @return {integer} The key.
***REMOVED***
xrx.index.prototype.iterGetKey = function() {

  return this.iterKey_;
***REMOVED***



***REMOVED***
***REMOVED*** Returns the current row at which the iterator is placed.
***REMOVED*** @return {xrx.index.row} The row.
***REMOVED***
xrx.index.prototype.iterGetRow = function() {
  return this.getRowByKey(this.iterKey_);
***REMOVED***



***REMOVED***
***REMOVED*** Iterates to the next row and returns the row.
***REMOVED*** @return {xrx.index.row} The row.
***REMOVED***
xrx.index.prototype.iterNext = function() {

  return this.getRowByKey(++this.iterKey_);
***REMOVED***



***REMOVED***
***REMOVED*** Iterates to the previous row and returns the row.
***REMOVED*** @return {xrx.index.row} The row.
***REMOVED***
xrx.index.prototype.iterPrevious = function() {

  return this.getRowByKey(--this.iterKey_);
***REMOVED***



***REMOVED***
***REMOVED*** A namespace object. Namespace tokens as the only XML tokens
***REMOVED*** are statically extracted during index building.
***REMOVED***
***REMOVED*** @param {xrx.xml.Label} opt_label The label of the namespace token.
***REMOVED*** @param {string} opt_prefix The namespace prefix.
***REMOVED*** @param {string} opt_uri The namespace URI.
***REMOVED***
xrx.index.Namespace = function(opt_label, opt_prefix, opt_uri) {



  this.label = opt_label;



  this.parentLabel;



  this.prefix = opt_prefix;



  this.uri = opt_uri;
***REMOVED***



***REMOVED***
***REMOVED*** @return {xrx.index.Namespace|undefined}
***REMOVED***
xrx.index.prototype.getNamespace = function(token, prefix) {

  return goog.array.findRight(this.tNamespace_, function(ns, ind, arr) {
    return ns.prefix === prefix && (token.label().sameAs(ns.parentLabel) ||
        token.label().isDescendantOf(ns.parentLabel));
  });
***REMOVED***



***REMOVED***
***REMOVED*** @return {string|undefined}
***REMOVED***
xrx.index.prototype.getNamespaceUri = function(token, prefix) {

  var namespace = goog.array.findRight(this.tNamespace_, function(ns, ind, arr) {
    return ns.prefix === prefix && (token.label().sameAs(ns.parentLabel) ||
        token.label().isDescendantOf(ns.parentLabel));
  });
  
  return namespace ? namespace.uri : undefined;
***REMOVED***



***REMOVED***
***REMOVED*** @return {string|undefined}
***REMOVED***
xrx.index.prototype.getNamespacePrefix = function(token, uri) {

  var namespace = goog.array.findRight(this.tNamespace_, function(ns, ind, arr) {
    return ns.uri === uri && (token.label().sameAs(ns.parentLabel) ||
        token.label().isDescendantOf(ns.parentLabel));
  });

  return namespace ? namespace.prefix : undefined;
***REMOVED***



***REMOVED***
***REMOVED*** Adds a new row to the end of the index and returns the new row.
***REMOVED*** @return {xrx.index.row} The new row.
***REMOVED***
xrx.index.prototype.head = function() {
  var row = new xrx.index.row();
  this.rows_.push(row);

  return this.rows_[this.rows_.length - 1];
***REMOVED***



***REMOVED***
***REMOVED*** Builds an index from scratch.
***REMOVED*** @param {!string} The XML string.
***REMOVED***
xrx.index.prototype.build = function(xml) {
  var traverse = new xrx.xml.Traverse(xml);
  var row;
  var index = this;
  var parent;
  var labelBuffer = {***REMOVED***

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
 ***REMOVED*****REMOVED***

  traverse.rowStartTag = function(label, offset, length1, length2) {

    update(index.head(), xrx.token.START_TAG, label, offset, length1, length2);
    labelBuffer[label.toString()] = index.getLastKey();
 ***REMOVED*****REMOVED***

  traverse.rowEmptyTag = function(label, offset, length1, length2) {

    update(index.head(), xrx.token.EMPTY_TAG, label, offset, length1, length2);
 ***REMOVED*****REMOVED***

  traverse.rowEndTag = function(label, offset, length1, length2) {

    update(index.head(), xrx.token.END_TAG, label, offset, length1, length2);
    delete labelBuffer[label.toString()];
 ***REMOVED*****REMOVED***

  traverse.eventNsPrefix = function(label, offset, length) {
    var ns = new xrx.index.Namespace(label.clone(), xml.substr(offset, length));
    var parent = label.clone();
    parent.parent();
    ns.parentLabel = parent;
    index.tNamespace_.push(ns);
 ***REMOVED*****REMOVED***

  traverse.eventNsUri = function(label, offset, length) {
    index.tNamespace_[index.tNamespace_.length - 1].uri = xml.substr(offset, length);
 ***REMOVED*****REMOVED***

  traverse.forward();
***REMOVED***



***REMOVED***
***REMOVED*** Inserts a row after a key position.
***REMOVED*** @param {!integer} key The key.
***REMOVED*** @param {!row} row The row.
***REMOVED***
xrx.index.prototype.insertRowAfter = function(key, row) {
  this.rows_.splice(++key, 0, row);
***REMOVED***



***REMOVED***
***REMOVED*** Removes a row indicated by a key.
***REMOVED*** @param {!integer} key The key.
***REMOVED*** @param {!integer} opt_num The number of rows to be removed.
***REMOVED*** @param {!row} row The row.
***REMOVED***
xrx.index.prototype.removeRow = function(key, opt_num) {
  var num = opt_num || 1;

  this.rows_.splice(key, num);
***REMOVED***

