/**
 * @fileoverview Class implements different data instance components for 
 *     the model-view-controller.
 */

goog.provide('xrx.mvc.Instance');
goog.provide('xrx.mvc.InstanceGithub');
goog.provide('xrx.mvc.InstanceRest');


goog.require('goog.dom.DomHelper');
goog.require('goog.events');
goog.require('goog.events.EventType');
goog.require('goog.net.XhrIo');
goog.require('goog.Uri');
goog.require('xrx.index.Index');
goog.require('xrx.mvc.ComponentModel');
goog.require('xrx.mvc.Uidl');
goog.require('xrx.node.Nodes');
goog.require('xrx.xml.Parser');
goog.require('xrx.xml.Stream');
goog.require('xrx.xml.Pilot');
goog.require('xrx.xml.Indent');



/**
 * @constructor
 */
xrx.mvc.Instance = function(element) { 

  this.xml_;

  this.stream_;

  this.pilot_;

  goog.base(this, element, new xrx.mvc.Uidl('span',
    'xrx-instance',
    [['dataset', 'src'], ['dataset', 'xrxSrc'], ['text', true]]
  ));

  this.document_ = new xrx.node.DocumentB(this.getId());
};
goog.inherits(xrx.mvc.Instance, xrx.mvc.ComponentModel);



/**
 *
 */
xrx.mvc.Instance.prototype.suidl = {
  'tagName': 'span',
  'className': 'xrx-instance',
  'dataset': {'src': undefined, 'xrxSrc': undefined},
  'text': true,
  'choice': [[['dataset']['src']], [['dataset']['xrxSrc']],
      [['text']]]
};



/**
 * 
 */
xrx.mvc.Instance.prototype.update = function(offset, length, xml) {
  var tmp = this.xml_.substr(0, offset) + xml + this.xml_.substr(
      offset + length);
  this.xml_ = undefined;
  this.xml_ = tmp;
  this.stream_ = undefined;
  this.stream_ = new xrx.xml.Stream(this.xml_);
  this.pilot_ = undefined;
  this.pilot_ = new xrx.xml.Pilot(this.xml_);
};



/**
 * 
 */
xrx.mvc.Instance.prototype.getDataInline = function() {
  var parse = new xrx.xml.Parser();

  this.xml_ = parse.normalize(goog.dom.getRawTextContent(this.getElement()));
  this.stream_ = new xrx.xml.Stream(this.xml_);
  this.pilot_ = new xrx.xml.Pilot(this.xml_);
};



/**
 * 
 */
xrx.mvc.Instance.prototype.getDataRemote = function(xml) {
  var parse = new xrx.xml.Parser();
  this.xml_ = parse.normalize(xml);
  this.stream_ = new xrx.xml.Stream(this.xml_);
  this.pilot_ = new xrx.xml.Pilot(this.xml_);
};



xrx.mvc.Instance.prototype.mvcRecalculate = function() {};



/**
 * @override
 */
xrx.mvc.Instance.prototype.setData = function(xml) {
  this.getSrcUri() ? this.getDataRemote(xml) : this.getDataInline();
};



/**
 * @return {!string} The XML instance as string.
 */
xrx.mvc.Instance.prototype.xml = function(xml) {
  if (xml) this.xml_ = xml;
  if (!this.xml_) this.setData();
  return this.xml_;
};



/**
 * @return {xrx.xml.Stream} The stream.
 */
xrx.mvc.Instance.prototype.getStream = function() {
  return this.stream_;
};



/**
 * @return {xrx.xml.Pilot} The pilot.
 */
xrx.mvc.Instance.prototype.getPilot = function() {
  return this.pilot_;
};



/**
 * @return {!xrx.node.Document} The XML instance as node.
 */
xrx.mvc.Instance.prototype.getDocument = function(id) {
  return this.document_;
};



/**
 * @return {!xrx.index}
 */
xrx.mvc.Instance.prototype.getIndex = function() {
  if (!this.xml_) this.setData();
  if (this.index_ === undefined) this.index_ = new xrx.index.Index(this.xml_);
  return this.index_;
};



/**
 * Creates a new instance using a REST client.
 * @constructor
 */
xrx.mvc.InstanceRest = function(element) {

  goog.base(this, element);
};
goog.inherits(xrx.mvc.InstanceRest, xrx.mvc.Instance);



/**
 * Creates a new instance using a GitHub client.
 * @constructor
 */
xrx.mvc.InstanceGithub = function(element) {

  this.sha_;

  goog.base(this, element);
};
goog.inherits(xrx.mvc.InstanceGithub, xrx.mvc.Instance);



xrx.mvc.InstanceGithub.prototype.setSha = function(sha) {
  this.sha_ = sha;
};



xrx.mvc.InstanceGithub.prototype.save = function() {
  var self = this;
  var srcUri = this.getSrcUri()
  var xhr = new goog.net.XhrIo();
<<<<<<< HEAD
  var creds = goog.crypt.base64.encodeString('');
=======
  var creds = goog.crypt.base64.encodeString('JochenGraf:0JGraf00');
>>>>>>> 2455e948c7fe406cef844e8e893f770d94bd612a
  xhr.headers.set('Authorization', 'Basic ' + creds);

  var successHandler = function(e) {
    self.sha_ = e.target.getResponseJson().content.sha;
    console.log(self.sha_);
  };

  goog.events.listen(
    xhr,
    goog.net.EventType.SUCCESS,
    successHandler
  );

  var responseBody = {
    'path': srcUri,
    'message': 'SKOS test data updated.',
    'content': goog.crypt.base64.encodeString(xrx.xml.Indent.forward(self.xml_, 2)),
    'sha': self.sha_,
    'branch': 'master'
  };

  xhr.send(srcUri, 'PUT', goog.json.serialize(responseBody));
};
