***REMOVED***
***REMOVED*** @fileoverview A class representing a graphics rendering engine.
***REMOVED***

goog.provide('xrx.engine.Engine');



goog.require('xrx.canvas');
goog.require('xrx.engine');
goog.require('xrx.svg');
goog.require('xrx.vml');



***REMOVED***
***REMOVED*** A class representing a graphics rendering engine.
***REMOVED*** @param {string} opt_engine The rendering engine to be used. If no
***REMOVED***     parameter is overloaded, the engine class searches for the
***REMOVED***     best rendering engine available.
***REMOVED***
***REMOVED***
xrx.engine.Engine = function(opt_engine) {

  this.engine_ = opt_engine;

  this.renderer_;

  this.available_ = false;

  this.init_();
***REMOVED***



***REMOVED***
***REMOVED*** Returns the installed graphics renderer.
***REMOVED*** @return {(xrx.canvas|xrx.svg|xrx.vml)} The renderer.
***REMOVED***
xrx.engine.Engine.prototype.getRenderer = function() {
  return this.renderer_;
***REMOVED***



***REMOVED***
***REMOVED*** Test whether the overloaded renderer name is the currently installed.
***REMOVED*** @param {(xrx.engine.CANVAS|xrx.engine.SVG|xrx.engine.VML)} name The
***REMOVED***     renderer name.
***REMOVED*** @return {boolean} Whether the renderer matches.
***REMOVED***
xrx.engine.Engine.prototype.hasRenderer = function(name) {
  return this.engine_ === name;
***REMOVED*** 



***REMOVED***
***REMOVED*** Whether the rendering engine could be initialized successfully.
***REMOVED*** @return {boolean} Whether the engine is available for use.
***REMOVED***
xrx.engine.Engine.prototype.isAvailable = function() {
  return this.available_;
***REMOVED***



***REMOVED***
***REMOVED*** @private
***REMOVED***
xrx.engine.Engine.prototype.findOptimalRenderer_ = function() {
  if (xrx.canvas.isSupported()) {
    this.renderer_ = xrx.canvas;
    this.available_ = true;
  } else if (xrx.svg.isSupported()) {
    this.renderer_ = xrx.svg;
    this.available_ = true;
  } else if (xrx.vml.isSupported()) {
    this.renderer_ = xrx.vml;
    this.available_ = true;
  } else {
    throw Error('There is no graphics rendering engine available.');
  }
***REMOVED***



***REMOVED***
***REMOVED*** @private
***REMOVED***
xrx.engine.Engine.prototype.forceRenderer_ = function() {
  console.log(this.engine_);
  if (this.engine_ === xrx.engine.CANVAS) {
    this.renderer_ = xrx.canvas;
    this.available_ = xrx.canvas.isSupported();
  } else if (this.engine_ === xrx.engine.SVG) {
    this.renderer_ = xrx.svg;
    this.available_ = xrx.svg.isSupported();
  } else if (this.engine_ === xrx.engine.VML) {
    this.renderer_ = xrx.vml;
    this.available_ = xrx.vml.isSupported();
  } else {
    this.available_ = false;
    throw Error('Unknown graphics rendering engine.');
  }
***REMOVED***



***REMOVED***
***REMOVED*** @private
***REMOVED***
xrx.engine.Engine.prototype.init_ = function() {
  if (this.engine_) {
    this.forceRenderer_();
  } else {
    this.findOptimalRenderer_();
  }
***REMOVED***
