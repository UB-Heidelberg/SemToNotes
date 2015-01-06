/**
 * @fileoverview
 */

goog.provide('xrx.mvc.Auth');
goog.provide('xrx.mvc.Password');
goog.provide('xrx.mvc.Signin');
goog.provide('xrx.mvc.Signout');
goog.provide('xrx.mvc.User');



goog.require('goog.crypt.base64');
goog.require('goog.dom.DomHelper');
goog.require('goog.dom.dataset');
goog.require('goog.dom.forms');
goog.require('goog.events');
goog.require('goog.events.EventType');
goog.require('goog.net.Cookies');
goog.require('goog.net.XhrIo');
goog.require('xrx.mvc.Component');



/**
 * @constructor
 */
xrx.mvc.Auth = function() {
};



xrx.mvc.Auth.KEY_ = 'xrxAuth';



xrx.mvc.Auth.TYPE_ = 'Basic ';



xrx.mvc.Auth.USER_ = '';



xrx.mvc.Auth.PSWD_ = '';



xrx.mvc.Auth.Cookies_ = new goog.net.Cookies(goog.dom.getDocument());



xrx.mvc.Auth.setUser = function(user) {
  xrx.mvc.Auth.USER_ = user;
};



xrx.mvc.Auth.setPassword = function(password) {
  xrx.mvc.Auth.PSWD_ = password;
};



xrx.mvc.Auth.isAuth = function() {
  return !!xrx.mvc.Auth.Cookies_.get(xrx.mvc.Auth.KEY_);
};



xrx.mvc.Auth.signin = function() {
  var xhr = new goog.net.XhrIo();
  var authorization = 'Basic ' + goog.crypt.base64.encodeString(
      xrx.mvc.Auth.USER_ + ':' + xrx.mvc.Auth.PSWD_);
  xhr.headers.set('Authorization', authorization);
  xrx.mvc.Auth.Cookies_.remove(xrx.mvc.Auth.KEY_);

  var responseSuccess = function(e) {
    xrx.mvc.Auth.Cookies_.set(xrx.mvc.Auth.KEY_, authorization, -1);
    location.reload();
  };

  var responseError = function(e) {
  };

  goog.events.listen(xhr, goog.net.EventType.SUCCESS, responseSuccess);
  goog.events.listen(xhr, goog.net.EventType.ERROR, responseError);

  xhr.send('https://api.github.com/user', 'GET');
};



xrx.mvc.Auth.signout = function() {
  xrx.mvc.Auth.Cookies_.remove(xrx.mvc.Auth.KEY_);
  location.reload();
};



/**
 * @constructor
 */
xrx.mvc.User = function(element) {

  goog.base(this, element);

  this.init_();
};
goog.inherits(xrx.mvc.User, xrx.mvc.Component);



xrx.mvc.User.prototype.handleInput_ = function() {
  var input = goog.dom.forms.getValue(this.element_);
  xrx.mvc.Auth.setUser(input);
};



xrx.mvc.User.prototype.init_ = function() {
  goog.style.setElementShown(this.element_, !xrx.mvc.Auth.isAuth());
  goog.events.listen(this.element_, goog.events.EventType.INPUT, function(e) {
    this.handleInput_();
  }, false, this);
};



/**
 * @constructor
 */
xrx.mvc.Password = function(element) {

  goog.base(this, element);
};
goog.inherits(xrx.mvc.Password, xrx.mvc.User);



xrx.mvc.Password.prototype.handleInput_ = function() {
  var input = goog.dom.forms.getValue(this.element_);
  xrx.mvc.Auth.setPassword(input);
};



/**
 * @constructor
 */
xrx.mvc.Signin = function(element) {

  goog.base(this, element);

  this.init_();
};
goog.inherits(xrx.mvc.Signin, xrx.mvc.Component);



xrx.mvc.Signin.prototype.init_ = function() {
  goog.style.setElementShown(this.element_, !xrx.mvc.Auth.isAuth());
  goog.events.listen(this.element_, goog.events.EventType.CLICK, function(e) {
    e.preventDefault();
    xrx.mvc.Auth.signin();
  }, false, this);
};



/**
 * @constructor
 */
xrx.mvc.Signout = function(element) {

  goog.base(this, element);

  this.init_();
};
goog.inherits(xrx.mvc.Signout, xrx.mvc.Component);



xrx.mvc.Signout.prototype.init_ = function() {
  goog.style.setElementShown(this.element_, xrx.mvc.Auth.isAuth());
  goog.events.listen(this.element_, goog.events.EventType.CLICK, function(e) {
    e.preventDefault();
    xrx.mvc.Auth.signout();
  }, false, this);
};
