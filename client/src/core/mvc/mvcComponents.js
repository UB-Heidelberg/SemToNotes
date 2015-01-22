/**
 * @fileoverview 
 */

goog.provide('xrx.mvc.Components');



goog.require('xrx.mvc.Action');
goog.require('xrx.mvc.Auth');
goog.require('xrx.mvc.Bind');
goog.require('xrx.mvc.Calculate');
goog.require('xrx.mvc.ClassesAdd');
goog.require('xrx.mvc.ClassesRemove');
goog.require('xrx.mvc.Dispatch');
goog.require('xrx.mvc.Insert');
goog.require('xrx.mvc.Instance');
goog.require('xrx.mvc.InstanceGithub');
goog.require('xrx.mvc.InstanceRest');
goog.require('xrx.mvc.Namespace');
goog.require('xrx.mvc.Optgroup');
goog.require('xrx.mvc.Password');
goog.require('xrx.mvc.Remove');
goog.require('xrx.mvc.Repeat');
goog.require('xrx.mvc.Script');
goog.require('xrx.mvc.Send');
goog.require('xrx.mvc.Signin');
goog.require('xrx.mvc.Signout');
goog.require('xrx.mvc.Submission');
goog.require('xrx.mvc.Update');
goog.require('xrx.mvc.User');
goog.require('xrx.mvc.Update');



xrx.mvc.Components = {};



/**
 * core components
 */
xrx.mvc.Components['xrx-namespace'] = xrx.mvc.Namespace;
xrx.mvc.Components['xrx-bind'] = xrx.mvc.Bind;
xrx.mvc.Components['xrx-optgroup'] = xrx.mvc.Optgroup;
xrx.mvc.Components['xrx-submission'] = xrx.mvc.Submission;
xrx.mvc.Components['xrx-repeat'] = xrx.mvc.Repeat;



/**
 * action components
 */
xrx.mvc.Components['xrx-action'] = xrx.mvc.Action;
xrx.mvc.Components['xrx-calculate'] = xrx.mvc.Calculate;
xrx.mvc.Components['xrx-classes-add'] = xrx.mvc.ClassesAdd;
xrx.mvc.Components['xrx-classes-remove'] = xrx.mvc.ClassesRemove;
xrx.mvc.Components['xrx-dispatch'] = xrx.mvc.Dispatch;
xrx.mvc.Components['xrx-insert'] = xrx.mvc.Insert;
xrx.mvc.Components['xrx-remove'] = xrx.mvc.Remove;
xrx.mvc.Components['xrx-send'] = xrx.mvc.Send;
xrx.mvc.Components['xrx-script'] = xrx.mvc.Script;
xrx.mvc.Components['xrx-update'] = xrx.mvc.Update;



/**
 * authentication components
 */
xrx.mvc.Components['xrx-auth'] = xrx.mvc.Auth;
xrx.mvc.Components['xrx-user'] = xrx.mvc.User;
xrx.mvc.Components['xrx-password'] = xrx.mvc.Password;
xrx.mvc.Components['xrx-signin'] = xrx.mvc.Signin;
xrx.mvc.Components['xrx-signout'] = xrx.mvc.Signout;
