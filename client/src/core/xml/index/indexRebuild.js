***REMOVED***
***REMOVED*** @fileoverview A static class rebuild operations on binary encodings. 
***REMOVED***

goog.provide('xrx.index.Rebuild');



goog.require('goog.object');
goog.require('xrx.token');
goog.require('xrx.token.StartEmptyTag');



***REMOVED***
***REMOVED***
***REMOVED***
xrx.index.Rebuild = function() {***REMOVED***



***REMOVED***
***REMOVED*** Shared function to recalculate index offsets after a update
***REMOVED*** operation that requires no relabeling.
***REMOVED*** @param {!xrx.index} index The index.
***REMOVED*** @param {!integer} diff The offset difference.
***REMOVED***
xrx.index.Rebuild.offset = function(index, diff) {
  var row = index.iterGetRow();

  do {
    row.updateOffset(diff);
  } while (row = index.iterNext());
***REMOVED***



***REMOVED***
***REMOVED*** Shared function to recalculate index offsets and labels after a update
***REMOVED*** operation that requires relabeling.
***REMOVED*** @param {!xrx.index} index The index.
***REMOVED*** @param {!integer} diff The offset difference.
***REMOVED*** @param {!integer} parentKey The index key of the parent token which was
***REMOVED*** updated.
***REMOVED*** @param {!intger} numParent Number of subsequent rows that were removed or
***REMOVED*** inserted. Positive integer, if rows were inserted and negative integer if
***REMOVED*** rows were removed.
***REMOVED*** @param {!intger} numPosition Number of positions decremented or incremented
***REMOVED*** during remove or insert. Positive integer for insertions, negative for deletions.
***REMOVED***
xrx.index.Rebuild.relabel = function(index, diff, parentKey, numParent, numPosition) {
  var row = index.iterGetRow();
  var key;
  var sibling = -3;
  var last = index.getLastKey();

  do {
    key = index.iterGetKey();

    if (row.getParent() === parentKey && row.getType() !== xrx.token.END_TAG) {
      row.updatePosition(numPosition);
      sibling = key;
    }
    if (row.getParent() === parentKey && row.getType() === xrx.token.END_TAG) {
      if (key !== last) row.updatePosition(numPosition);
      sibling = -3;
    }
    if (row.getParent() === sibling - numParent) {
      row.updateParent(numParent);
    }

    row.updateOffset(diff);
  } while (row = index.iterNext());
***REMOVED***



***REMOVED***
***REMOVED*** Rebuilds an index after a XML instance has been updated by
***REMOVED*** a insertAttribute update operation.
***REMOVED*** 
***REMOVED*** @param {!xrx.index} index The index.
***REMOVED*** @param {!(xrx.token.StartTag|xrx.token.EmptyTag)} parent The tag token into which the
***REMOVED*** attribute was inserted.
***REMOVED*** @param {!integer} diff The length difference of the updated parent token.
***REMOVED***
xrx.index.Rebuild.insertAttribute = function(index, parent, diff) {
  var key = index.getKeyByTag(parent);
  var row = index.getRowByKey(key);

  row.updateLength1(diff);
  row.updateLength2(diff);

  index.iterSetKey(key);
  index.iterNext();

  xrx.index.Rebuild.offset(index, diff);  
***REMOVED***




***REMOVED***
***REMOVED*** Rebuilds an index after a XML instance has been updated by
***REMOVED*** a insertEmptyTag update operation.
***REMOVED*** 
***REMOVED*** @param {!xrx.index} index The index.
***REMOVED*** @param {!xrx.token.NotTag} token The not-tag token into which the empty tag
***REMOVED***   was inserted.
***REMOVED*** @param {!integer} token The offset relative to the not-tag token where the
***REMOVED***   empty tag was inserted.
***REMOVED*** @param {!integer} diff The length difference of the updated token.
***REMOVED***
xrx.index.Rebuild.insertEmptyTag = function(index, token, offset, diff) {
  var key = index.getKeyByNotTag(token);
  var row = index.getRowByKey(key);
  var length1 = row.getLength1();
  var length2 = row.getLength2();
  var rest = length2 - length1 - offset;
  
  // rebuild updated row
  row.updateLength2(length1 + offset - length2);

  // insert new row
  var newRow = new xrx.index.Row();
  var newLabel = token.label().clone();
  newLabel.nextSibling();
  var newParentLabel = newLabel.clone();
  newParentLabel.parent();
  var newParentToken = new xrx.token.StartEmptyTag(newParentLabel);
  var newParentKey = index.getKeyByTag(newParentToken);

  newRow.setType(xrx.token.EMPTY_TAG);
  newRow.setPosition(newLabel.last());
  newRow.setParent(newParentKey);
  newRow.setOffset(row.getOffset() + row.getLength2());
  newRow.setLength1(diff);
  newRow.setLength2(diff + rest);
  index.insertRowAfter(key, newRow);

  // rebuild all following rows
  index.iterSetKey(key);
  index.iterNext();
  index.iterNext();

  xrx.index.Rebuild.relabel(index, diff, newParentKey, 1, 1);
***REMOVED***



***REMOVED***
***REMOVED*** 
***REMOVED***
xrx.index.Rebuild.insertFragment = function(index, xml) {
  index.rebuild(xml);
***REMOVED***



***REMOVED***
***REMOVED*** 
***REMOVED***
xrx.index.Rebuild.insertMixed = function(index, token, offset, diff) {
  //TODO: implement this
***REMOVED***



***REMOVED***
***REMOVED*** Rebuilds an index after an XML instance has been updated by
***REMOVED*** an insertNotTag update operation.
***REMOVED*** 
***REMOVED*** @param {!xrx.index} index The index.
***REMOVED*** @param {!xrx.token.NotTag} token The not-tag token which was updated.
***REMOVED*** @param {!integer} diff The length difference of the updated token.
***REMOVED***
xrx.index.Rebuild.insertNotTag = function(index, token, diff) {
  var key = index.getKeyByNotTag(token);
  var row = index.getRowByKey(key);

  row.updateLength2(diff);

  index.iterSetKey(key);
  index.iterNext();

  xrx.index.Rebuild.offset(index, diff);
***REMOVED***



***REMOVED***
***REMOVED*** 
***REMOVED***
xrx.index.Rebuild.insertStartEndTag = function(index, token1, token2, offset1, offset2,
    diff1, diff2) {
  // TODO: iimplement this
***REMOVED***



***REMOVED***
***REMOVED*** Rebuilds an index after a XML instance has been updated by
***REMOVED*** a removeAttribute update operation.
***REMOVED*** TODO: handle namespace declaration
***REMOVED*** 
***REMOVED*** @param {!xrx.index} index The index.
***REMOVED*** @param {!xrx.token.Attribute} token The attribute token which was removed.
***REMOVED*** @param {!integer} diff The length difference of the updated parent token.
***REMOVED***
xrx.index.Rebuild.removeAttribute = function(index, token, diff) {
  var parentLabel = token.label().clone();
  parentLabel.parent();
  var parentToken = new xrx.token.StartEmptyTag(parentLabel);
  var key = index.getKeyByTag(parentToken);
  var row = index.getRowByKey(key);

  row.updateLength1(diff);
  row.updateLength2(diff);

  index.iterSetKey(key);
  index.iterNext();

  xrx.index.Rebuild.offset(index, diff);  
***REMOVED***



***REMOVED***
***REMOVED*** Rebuilds an index after a XML instance has been updated by
***REMOVED*** a removeEmptyTag update operation.
***REMOVED*** 
***REMOVED*** @param {!xrx.index} index The index.
***REMOVED*** @param {!xrx.token.EmptyTag} token The empty tag which was removed.
***REMOVED*** @param {!integer} diff The length difference of the updated empty tag token.
***REMOVED***
xrx.index.Rebuild.removeEmptyTag = function(index, token, diff) {
  var key = index.getKeyByNotTag(token);
  var row = index.getRowByKey(key);
  var length1 = row.getLength1();
  var length2 = row.getLength2();
  var notTagLength = length2 - length1;

  // rebuild row before
  index.iterSetKey(key);
  index.iterPrevious();
  var rowBefore = index.iterGetRow();
  rowBefore.updateLength2(notTagLength);
  
  // remove updated row
  index.removeRow(key);

  // rebuild all following rows
  var parentLabel = token.label().clone();
  parentLabel.parent();
  var parentToken = new xrx.token.StartEmptyTag(parentLabel);
  var parentKey = index.getKeyByTag(parentToken);

  index.iterSetKey(key);

  xrx.index.Rebuild.relabel(index, diff, parentKey, -1, -1);
***REMOVED***



***REMOVED***
***REMOVED***
***REMOVED***
xrx.index.Rebuild.removeFragment = function() {
***REMOVED***



***REMOVED***
***REMOVED***
***REMOVED***
xrx.index.Rebuild.removeMixed = function() {
***REMOVED***



***REMOVED***
***REMOVED*** Rebuilds an index after a XML instance has been updated by
***REMOVED*** a removeStartEndTag update operation.
***REMOVED*** TODO: handle namespace declaration
***REMOVED*** 
***REMOVED*** @param {!xrx.index} index The index.
***REMOVED*** @param {!xrx.token.EmptyTag} token The empty tag which was removed.
***REMOVED*** @param {!integer} diff The length difference of the updated empty tag token.
***REMOVED***
xrx.index.Rebuild.removeStartEndTag = function(index, token1, token2, diff1, diff2) {
  // get token1
  var key1 = index.getKeyByTag(token1);
  var row1 = index.getRowByKey(key1);
  var offset1 = row1.getOffset();
  var length11 = row1.getLength1();
  var length12 = row1.getLength2();
  var notTagLength1 = length12 - length11;
  // get token2
  var key2 = index.getKeyByTag(token2);
  var row2 = index.getRowByKey(key2);
  var offset2 = row2.getOffset();
  var length21 = row2.getLength1();
  var length22 = row2.getLength2();
  var notTagLength2 = length22 - length21;

  // end-tag row directly after start-tag row
  if (key1 === key2 - 1) {

    // rebuild row before token1
    index.iterSetKey(key1);
    index.iterPrevious();
    var rowBefore = index.iterGetRow();
    rowBefore.updateLength2(notTagLength1 + notTagLength2);

    // remove both rows
    index.removeRow(key1, 2);

    var parentLabel = token1.label().clone();
    parentLabel.parent();
    var parentToken = new xrx.token.StartEmptyTag(parentLabel);
    var parentKey = index.getKeyByTag(parentToken);

    index.iterSetKey(key1);

    xrx.index.Rebuild.relabel(index, diff1 + diff2, parentKey, -2, -1);

  } else {

    //TODO: implement this
  }

***REMOVED***



***REMOVED***
***REMOVED*** Rebuilds an index after a XML instance has been updated by
***REMOVED*** a replaceAttrValue update operation.
***REMOVED*** 
***REMOVED*** @param {!xrx.index} index The index.
***REMOVED*** @param {!xrx.token.AttrValue} token The attribute value token which was updated.
***REMOVED*** @param {!integer} diff The length difference of the updated token.
***REMOVED***
xrx.index.Rebuild.replaceAttrValue = function(index, token, diff) {
  var label = token.label().clone();
  label.parent();
  var tag = new xrx.token.StartEmptyTag(label);
  var key = index.getKeyByTag(tag);
  var row = index.getRowByKey(key);

  row.updateLength1(diff);
  row.updateLength2(diff);

  index.iterSetKey(key);
  index.iterNext();

  xrx.index.Rebuild.offset(index, diff);
***REMOVED***



***REMOVED***
***REMOVED*** Rebuilds an index after a XML instance has been updated by
***REMOVED*** a replaceNotTag update operation.
***REMOVED*** 
***REMOVED*** @param {!xrx.index} index The index.
***REMOVED*** @param {!xrx.token.NotTag} token The not-tag token which was updated.
***REMOVED*** @param {!integer} diff The length difference of the updated token.
***REMOVED***
xrx.index.Rebuild.replaceNotTag = function(index, token, diff) {
  var key = index.getKeyByNotTag(token);
  var row = index.getRowByKey(key);

  row.updateLength2(diff);

  index.iterSetKey(key);
  index.iterNext();

  xrx.index.Rebuild.offset(index, diff);
***REMOVED***



***REMOVED***
***REMOVED*** 
***REMOVED***
xrx.index.Rebuild.replaceTagName = function(instance, token, localName, opt_namespaceUri) {
  //TODO: implement this
***REMOVED***
