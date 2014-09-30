***REMOVED***
***REMOVED*** @fileoverview Class implements data instance component for 
***REMOVED*** the model-view-controller.
***REMOVED***

goog.provide('xrx.instance');



goog.require('goog.dom');
***REMOVED***
***REMOVED***
goog.require('xrx.index');
goog.require('xrx.model');
goog.require('xrx.node');
goog.require('xrx.node.DocumentB');
goog.require('xrx.parse');
goog.require('xrx.stream');
goog.require('xrx.pilot');



***REMOVED***
***REMOVED***
***REMOVED***
xrx.instance = function(element) {
***REMOVED***



***REMOVED***



***REMOVED***



***REMOVED***
***REMOVED***
goog.inherits(xrx.instance, xrx.model);



***REMOVED***
***REMOVED*** 
***REMOVED***
xrx.instance.prototype.update = function(offset, length, xml) {

***REMOVED***
***REMOVED***

***REMOVED***
***REMOVED***
***REMOVED***
  this.stream_ = new xrx.stream(this.xml_);
***REMOVED***
  this.pilot_ = new xrx.pilot(this.xml_);
***REMOVED***



***REMOVED***
***REMOVED*** 
***REMOVED***
xrx.instance.prototype.getDataInline = function() {
  var parse = new xrx.parse();

***REMOVED***
  this.stream_ = new xrx.stream(this.xml_);
  this.pilot_ = new xrx.pilot(this.xml_);
***REMOVED***



***REMOVED***
***REMOVED*** 
***REMOVED***
xrx.instance.prototype.getDataRemote = function(xml) {
  var parse = new xrx.parse();

***REMOVED***
  this.stream_ = new xrx.stream(this.xml_);
  this.pilot_ = new xrx.pilot(this.xml_);
***REMOVED***




***REMOVED***
***REMOVED*** @override
***REMOVED***
xrx.instance.prototype.recalculate = function(xml) {
***REMOVED***
***REMOVED***



***REMOVED***
***REMOVED*** @return {!string} The XML instance as string.
***REMOVED***
xrx.instance.prototype.xml = function(xml) {
***REMOVED***
  if (!this.xml_) this.recalculate();
***REMOVED***
***REMOVED***



***REMOVED***
***REMOVED*** @return {xrx.stream} The stream.
***REMOVED***
xrx.instance.prototype.getStream = function() {
***REMOVED***
***REMOVED***



***REMOVED***
***REMOVED*** @return {xrx.pilot} The pilot.
***REMOVED***
xrx.instance.prototype.getPilot = function() {
***REMOVED***
***REMOVED***



***REMOVED***
***REMOVED*** @return {!xrx.node.Document} The XML instance as node.
***REMOVED***
xrx.instance.prototype.getDocument = function(id) {
  return new xrx.node.DocumentB(this);
***REMOVED***



***REMOVED***
***REMOVED*** @return {!xrx.index}
***REMOVED***
xrx.instance.prototype.getIndex = function() {
  if (!this.xml_) this.recalculate();
  if (this.index_ === undefined) this.index_ = new xrx.index(this.xml_);

***REMOVED***
***REMOVED***
