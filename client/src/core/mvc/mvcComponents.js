/**
 * @fileoverview 
 */

goog.provide('xrx.mvc.Components');



goog.require('xrx.mvc.Action');
goog.require('xrx.mvc.Auth');
goog.require('xrx.mvc.Bind');
goog.require('xrx.mvc.Insert');
goog.require('xrx.mvc.Instance');
goog.require('xrx.mvc.InstanceGithub');
goog.require('xrx.mvc.InstanceRest');
goog.require('xrx.mvc.Namespace');
goog.require('xrx.mvc.Password');
goog.require('xrx.mvc.Signin');
goog.require('xrx.mvc.Signout');
goog.require('xrx.mvc.Repeat');
goog.require('xrx.mvc.Update');
goog.require('xrx.mvc.User');
goog.require('xrx.mvc.Repeat');
goog.require('xrx.mvc.Update');



xrx.mvc.Components = {};



xrx.mvc.Components['xrx-mvc-namespace'] = xrx.mvc.Namespace;
xrx.mvc.Components['xrx-namespace'] = xrx.mvc.Namespace;



xrx.mvc.Components['xrx-mvc-bind'] = xrx.mvc.Bind;
xrx.mvc.Components['xrx-bind'] = xrx.mvc.Bind;



xrx.mvc.Components['xrx-mvc-repeat'] = xrx.mvc.Repeat;
xrx.mvc.Components['xrx-repeat'] = xrx.mvc.Repeat;



xrx.mvc.Components['xrx-mvc-action'] = xrx.mvc.Action;
xrx.mvc.Components['xrx-action'] = xrx.mvc.Action;



xrx.mvc.Components['xrx-mvc-insert'] = xrx.mvc.Insert;
xrx.mvc.Components['xrx-insert'] = xrx.mvc.Insert;



xrx.mvc.Components['xrx-mvc-update'] = xrx.mvc.Update;
xrx.mvc.Components['xrx-update'] = xrx.mvc.Update;



xrx.mvc.Components['xrx-user'] = xrx.mvc.User;



xrx.mvc.Components['xrx-password'] = xrx.mvc.Password;



xrx.mvc.Components['xrx-signin'] = xrx.mvc.Signin;



xrx.mvc.Components['xrx-signout'] = xrx.mvc.Signout;
