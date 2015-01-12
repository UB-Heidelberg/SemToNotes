/**
 * @fileoverview 
 */

goog.provide('xrx.mvc.Submission');



goog.require('goog.net.EventType');
goog.require('goog.net.XhrIo');
goog.require('xrx.mvc.Auth');
goog.require('xrx.mvc.Component');



xrx.mvc.Submission = function(element) {

  goog.base(this, element);

  this.xhr_;
};
goog.inherits(xrx.mvc.Submission, xrx.mvc.Component);



xrx.mvc.Submission.prototype.createDom = function() {
  this.xhr_ = new goog.net.XhrIo();
  goog.events.listen(this.xhr_, goog.net.EventType.ERROR,
    function(e) {
      console.log(e.target.getStatus());
      console.log(this.getNode().getXml());
  }, false, this);
  goog.events.listen(this.xhr_, goog.net.EventType.SUCCESS,
    function(e) {
      console.log(e.target.getStatus());
  }, false, this);
};



xrx.mvc.Submission.prototype.send = function() {
  var resource = this.getDataset('xrxResource');
  var method = this.getDataset('xrxMethod');
  this.xhr_.headers.set('Authorization', xrx.mvc.Auth.getCredentials());
  this.xhr_.send(resource, method, 'test');
};
