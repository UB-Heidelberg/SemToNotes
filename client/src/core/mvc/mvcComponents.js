/**
 * @fileoverview 
 */

goog.provide('xrx.mvc.Components');



goog.require('xrx.mvc.Action');
goog.require('xrx.mvc.Bind');
goog.require('xrx.mvc.Insert');
goog.require('xrx.mvc.Instance');
goog.require('xrx.mvc.Namespace');
goog.require('xrx.mvc.Repeat');
goog.require('xrx.mvc.Update');



xrx.mvc.Components = {};



xrx.mvc.Components['xrx-mvc-namespace'] = xrx.mvc.Namespace;



xrx.mvc.Components['xrx-mvc-bind'] = xrx.mvc.Bind;



xrx.mvc.Components['xrx-mvc-repeat'] = xrx.mvc.Repeat;



xrx.mvc.Components['xrx-mvc-action'] = xrx.mvc.Action;



xrx.mvc.Components['xrx-mvc-insert'] = xrx.mvc.Insert;



xrx.mvc.Components['xrx-mvc-update'] = xrx.mvc.Update;
