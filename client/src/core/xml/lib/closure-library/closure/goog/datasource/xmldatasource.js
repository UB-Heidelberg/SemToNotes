// Copyright 2006 The Closure Library Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

***REMOVED***
***REMOVED*** @fileoverview
***REMOVED*** Implementations of DataNode for wrapping XML data.
***REMOVED***
***REMOVED***

goog.provide('goog.ds.XmlDataSource');
goog.provide('goog.ds.XmlHttpDataSource');

***REMOVED***
goog.require('goog.dom.NodeType');
goog.require('goog.dom.xml');
goog.require('goog.ds.BasicNodeList');
goog.require('goog.ds.DataManager');
goog.require('goog.ds.LoadState');
goog.require('goog.ds.logger');
***REMOVED***
goog.require('goog.string');


***REMOVED***
***REMOVED*** Data source whose backing is an xml node
***REMOVED***
***REMOVED*** @param {Node} node The XML node. Can be null.
***REMOVED*** @param {goog.ds.XmlDataSource} parent Parent of XML element. Can be null.
***REMOVED*** @param {string=} opt_name The name of this node relative to the parent node.
***REMOVED***
***REMOVED*** @extends {goog.ds.DataNode}
***REMOVED***
***REMOVED***
// TODO(arv): Use interfaces when available.
goog.ds.XmlDataSource = function(node, parent, opt_name) {
  this.parent_ = parent;
  this.dataName_ = opt_name || (node ? node.nodeName : '');
  this.setNode_(node);
***REMOVED***


***REMOVED***
***REMOVED*** Constant to select XML attributes for getChildNodes
***REMOVED*** @type {string}
***REMOVED*** @private
***REMOVED***
goog.ds.XmlDataSource.ATTRIBUTE_SELECTOR_ = '@*';


***REMOVED***
***REMOVED*** Set the current root nodeof the data source.
***REMOVED*** Can be an attribute node, text node, or element node
***REMOVED*** @param {Node} node The node. Can be null.
***REMOVED***
***REMOVED*** @private
***REMOVED***
goog.ds.XmlDataSource.prototype.setNode_ = function(node) {
  this.node_ = node;
  if (node != null) {
    switch (node.nodeType) {
      case goog.dom.NodeType.ATTRIBUTE:
      case goog.dom.NodeType.TEXT:
        this.value_ = node.nodeValue;
        break;
      case goog.dom.NodeType.ELEMENT:
        if (node.childNodes.length == 1 &&
            node.firstChild.nodeType == goog.dom.NodeType.TEXT) {
          this.value_ = node.firstChild.nodeValue;
        }
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** Creates the DataNodeList with the child nodes for this element.
***REMOVED*** Allows for only building list as needed.
***REMOVED***
***REMOVED*** @private
***REMOVED***
goog.ds.XmlDataSource.prototype.createChildNodes_ = function() {
  if (this.childNodeList_) {
    return;
  }
  var childNodeList = new goog.ds.BasicNodeList();
  if (this.node_ != null) {
    var childNodes = this.node_.childNodes;
    for (var i = 0, childNode; childNode = childNodes[i]; i++) {
      if (childNode.nodeType != goog.dom.NodeType.TEXT ||
          !goog.ds.XmlDataSource.isEmptyTextNodeValue_(childNode.nodeValue)) {
        var newNode = new goog.ds.XmlDataSource(childNode,
            this, childNode.nodeName);
        childNodeList.add(newNode);
      }
    }
  }
  this.childNodeList_ = childNodeList;
***REMOVED***


***REMOVED***
***REMOVED*** Creates the DataNodeList with the attributes for the element
***REMOVED*** Allows for only building list as needed.
***REMOVED***
***REMOVED*** @private
***REMOVED***
goog.ds.XmlDataSource.prototype.createAttributes_ = function() {
  if (this.attributes_) {
    return;
  }
  var attributes = new goog.ds.BasicNodeList();
  if (this.node_ != null && this.node_.attributes != null) {
    var atts = this.node_.attributes;
    for (var i = 0, att; att = atts[i]; i++) {
      var newNode = new goog.ds.XmlDataSource(att, this, att.nodeName);
      attributes.add(newNode);
    }
  }
  this.attributes_ = attributes;
***REMOVED***


***REMOVED***
***REMOVED*** Get the value of the node
***REMOVED*** @return {Object} The value of the node, or null if no value.
***REMOVED*** @override
***REMOVED***
goog.ds.XmlDataSource.prototype.get = function() {
  this.createChildNodes_();
  return this.value_;
***REMOVED***


***REMOVED***
***REMOVED*** Set the value of the node
***REMOVED*** @param {*} value The new value of the node.
***REMOVED*** @override
***REMOVED***
goog.ds.XmlDataSource.prototype.set = function(value) {
  throw Error('Can\'t set on XmlDataSource yet');
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.ds.XmlDataSource.prototype.getChildNodes = function(opt_selector) {
  if (opt_selector && opt_selector ==
      goog.ds.XmlDataSource.ATTRIBUTE_SELECTOR_) {
    this.createAttributes_();
    return this.attributes_;
  } else if (opt_selector == null ||
      opt_selector == goog.ds.STR_ALL_CHILDREN_SELECTOR) {
    this.createChildNodes_();
    return this.childNodeList_;
  } else {
    throw Error('Unsupported selector');
  }

***REMOVED***


***REMOVED***
***REMOVED*** Gets a named child node of the current node
***REMOVED*** @param {string} name The node name.
***REMOVED*** @return {goog.ds.DataNode} The child node, or null if
***REMOVED***   no node of this name exists.
***REMOVED*** @override
***REMOVED***
goog.ds.XmlDataSource.prototype.getChildNode = function(name) {
  if (goog.string.startsWith(name, goog.ds.STR_ATTRIBUTE_START)) {
    var att = this.node_.getAttributeNode(name.substring(1));
    return att ? new goog.ds.XmlDataSource(att, this) : null;
  } else {
    return***REMOVED*****REMOVED*** @type {goog.ds.DataNode}***REMOVED*** (this.getChildNodes().get(name));
  }
***REMOVED***


***REMOVED***
***REMOVED*** Gets the value of a child node
***REMOVED*** @param {string} name The node name.
***REMOVED*** @return {*} The value of the node, or null if no value or the child node
***REMOVED***    doesn't exist.
***REMOVED*** @override
***REMOVED***
goog.ds.XmlDataSource.prototype.getChildNodeValue = function(name) {
  if (goog.string.startsWith(name, goog.ds.STR_ATTRIBUTE_START)) {
    var node = this.node_.getAttributeNode(name.substring(1));
    return node ? node.nodeValue : null;
  } else {
    var node = this.getChildNode(name);
    return node ? node.get() : null;
  }
***REMOVED***


***REMOVED***
***REMOVED*** Get the name of the node relative to the parent node
***REMOVED*** @return {string} The name of the node.
***REMOVED*** @override
***REMOVED***
goog.ds.XmlDataSource.prototype.getDataName = function() {
  return this.dataName_;
***REMOVED***


***REMOVED***
***REMOVED*** Setthe name of the node relative to the parent node
***REMOVED*** @param {string} name The name of the node.
***REMOVED*** @override
***REMOVED***
goog.ds.XmlDataSource.prototype.setDataName = function(name) {
  this.dataName_ = name;
***REMOVED***


***REMOVED***
***REMOVED*** Gets the a qualified data path to this node
***REMOVED*** @return {string} The data path.
***REMOVED*** @override
***REMOVED***
goog.ds.XmlDataSource.prototype.getDataPath = function() {
  var parentPath = '';
  if (this.parent_) {
    parentPath = this.parent_.getDataPath() +
        (this.dataName_.indexOf(goog.ds.STR_ARRAY_START) != -1 ? '' :
        goog.ds.STR_PATH_SEPARATOR);
  }

  return parentPath + this.dataName_;
***REMOVED***


***REMOVED***
***REMOVED*** Load or reload the backing data for this node
***REMOVED*** @override
***REMOVED***
goog.ds.XmlDataSource.prototype.load = function() {
  // Nothing to do
***REMOVED***


***REMOVED***
***REMOVED*** Gets the state of the backing data for this node
***REMOVED*** @return {goog.ds.LoadState} The state.
***REMOVED*** @override
***REMOVED***
goog.ds.XmlDataSource.prototype.getLoadState = function() {
  return this.node_ ? goog.ds.LoadState.LOADED : goog.ds.LoadState.NOT_LOADED;
***REMOVED***


***REMOVED***
***REMOVED*** Check whether a node is an empty text node. Nodes consisting of only white
***REMOVED*** space (#x20, #xD, #xA, #x9) can generally be collapsed to a zero length
***REMOVED*** text string.
***REMOVED*** @param {string} str String to match.
***REMOVED*** @return {boolean} True if string equates to empty text node.
***REMOVED*** @private
***REMOVED***
goog.ds.XmlDataSource.isEmptyTextNodeValue_ = function(str) {
  return /^[\r\n\t ]*$/.test(str);
***REMOVED***


***REMOVED***
***REMOVED*** Creates an XML document with one empty node.
***REMOVED*** Useful for places where you need a node that
***REMOVED*** can be queried against.
***REMOVED***
***REMOVED*** @return {Document} Document with one empty node.
***REMOVED*** @private
***REMOVED***
goog.ds.XmlDataSource.createChildlessDocument_ = function() {
  return goog.dom.xml.createDocument('nothing');
***REMOVED***



***REMOVED***
***REMOVED*** Data source whose backing is an XMLHttpRequest,
***REMOVED***
***REMOVED*** A URI of an empty string will mean that no request is made
***REMOVED*** and the data source will be a single, empty node.
***REMOVED***
***REMOVED*** @param {(string,goog.Uri)} uri URL of the XMLHttpRequest.
***REMOVED*** @param {string} name Name of the datasource.
***REMOVED***
***REMOVED*** implements goog.ds.XmlHttpDataSource.
***REMOVED***
***REMOVED*** @extends {goog.ds.XmlDataSource}
***REMOVED***
goog.ds.XmlHttpDataSource = function(uri, name) {
  goog.ds.XmlDataSource.call(this, null, null, name);
  if (uri) {
    this.uri_ = new goog.Uri(uri);
  } else {
    this.uri_ = null;
  }
***REMOVED***
goog.inherits(goog.ds.XmlHttpDataSource, goog.ds.XmlDataSource);


***REMOVED***
***REMOVED*** Default load state is NOT_LOADED
***REMOVED*** @private
***REMOVED***
goog.ds.XmlHttpDataSource.prototype.loadState_ = goog.ds.LoadState.NOT_LOADED;


***REMOVED***
***REMOVED*** Load or reload the backing data for this node.
***REMOVED*** Fires the XMLHttpRequest
***REMOVED*** @override
***REMOVED***
goog.ds.XmlHttpDataSource.prototype.load = function() {
  if (this.uri_) {
    goog.ds.logger.info('Sending XML request for DataSource ' +
        this.getDataName() + ' to ' + this.uri_);
    this.loadState_ = goog.ds.LoadState.LOADING;

    goog.net.XhrIo.send(this.uri_, goog.bind(this.complete_, this));
  } else {
    this.node_ = goog.ds.XmlDataSource.createChildlessDocument_();
    this.loadState_ = goog.ds.LoadState.NOT_LOADED;
  }
***REMOVED***


***REMOVED***
***REMOVED*** Gets the state of the backing data for this node
***REMOVED*** @return {goog.ds.LoadState} The state.
***REMOVED*** @override
***REMOVED***
goog.ds.XmlHttpDataSource.prototype.getLoadState = function() {
  return this.loadState_;
***REMOVED***


***REMOVED***
***REMOVED*** Handles the completion of an XhrIo request. Dispatches to success or load
***REMOVED*** based on the result.
***REMOVED*** @param {!goog.events.Event} e The XhrIo event object.
***REMOVED*** @private
***REMOVED***
goog.ds.XmlHttpDataSource.prototype.complete_ = function(e) {
  var xhr =***REMOVED*****REMOVED*** @type {goog.net.XhrIo}***REMOVED*** (e.target);
  if (xhr && xhr.isSuccess()) {
    this.success_(xhr);
  } else {
    this.failure_();
  }
***REMOVED***


***REMOVED***
***REMOVED*** Success result. Checks whether valid XML was returned
***REMOVED*** and sets the XML and loadstate.
***REMOVED***
***REMOVED*** @param {!goog.net.XhrIo} xhr The successful XhrIo object.
***REMOVED*** @private
***REMOVED***
goog.ds.XmlHttpDataSource.prototype.success_ = function(xhr) {
  goog.ds.logger.info('Got data for DataSource ' + this.getDataName());
  var xml = xhr.getResponseXml();

  // Fix for case where IE returns valid XML as text but
  // doesn't parse by default
  if (xml && !xml.hasChildNodes() &&
      goog.isObject(xhr.getResponseText())) {
    xml = goog.dom.xml.loadXml(xhr.getResponseText());
  }
  // Failure result
  if (!xml || !xml.hasChildNodes()) {
    this.loadState_ = goog.ds.LoadState.FAILED;
    this.node_ = goog.ds.XmlDataSource.createChildlessDocument_();
  } else {
    this.loadState_ = goog.ds.LoadState.LOADED;
    this.node_ = xml.documentElement;
  }

  if (this.getDataName()) {
    goog.ds.DataManager.getInstance().fireDataChange(this.getDataName());
  }
***REMOVED***


***REMOVED***
***REMOVED*** Failure result
***REMOVED***
***REMOVED*** @private
***REMOVED***
goog.ds.XmlHttpDataSource.prototype.failure_ = function() {
  goog.ds.logger.info('Data retrieve failed for DataSource ' +
      this.getDataName());

  this.loadState_ = goog.ds.LoadState.FAILED;
  this.node_ = goog.ds.XmlDataSource.createChildlessDocument_();

  if (this.getDataName()) {
    goog.ds.DataManager.getInstance().fireDataChange(this.getDataName());
  }
***REMOVED***
