
goog.provide('xrx.demo');
goog.provide('xrx.demo.Demo');



goog.require('goog.dom.classes');
goog.require('goog.dom.dataset');
goog.require('goog.dom.DomHelper');
goog.require('goog.events');
goog.require('goog.events.EventHandler');
goog.require('goog.events.EventType');
goog.require('goog.net.XhrIo');
goog.require('goog.string');
goog.require('goog.style');
goog.require('xrx.graphic');



xrx.demo = function() {};



xrx.demo.Demo = function() {

  this.activeNavbarLink_;

  this.handler_ =  new goog.events.EventHandler(this);

  this.example_;

  this.status_ = true;

  this.init_();
};



xrx.demo.Demo.prototype.getExampleId = function() {
  return goog.dom.getWindow().location.hash.split('!')[1];
};



xrx.demo.Demo.prototype.isPageExamples = function(hash) {
  var tok = hash.split('\!');
  return hash === 'examples' || tok[0] === 'examples';
};



xrx.demo.Demo.prototype.isPageExample = function(hash) {
  var tok = hash.split('\!');
  return tok[0] === 'example';
};



xrx.demo.Demo.prototype.isPageTutorials = function(hash) {
  return hash === 'tutorials';
};



xrx.demo.Demo.prototype.isPageApi = function(hash) {
  return hash === 'api';
};



xrx.demo.Demo.prototype.reset_ = function() {
  this.handler_.removeAll();
};



xrx.demo.Demo.prototype.loadPage_ = function(title, url, navbarLink,
      opt_callback) {
  this.reset_();
  var self = this;
  var contentElement = goog.dom.getElement('content');
  var titleElement = goog.dom.getElementsByTagNameAndClass('title')[0];
  var fallback = goog.dom.htmlToDocumentFragment(
      '<div id="content" class="container alert alert-danger"></div>');
  goog.dom.setTextContent(titleElement, title);
  goog.net.XhrIo.send(url, function(e) {
    var text = e.target.getResponseText();
    var html = goog.dom.htmlToDocumentFragment(text);
    if (e.target.getStatus() === 200) {
      goog.dom.replaceNode(html, contentElement);
      self.status_ = true;
    } else {
      goog.dom.setTextContent(fallback, e.target.getStatusText());
      goog.dom.replaceNode(fallback, contentElement);
      self.status_ = false;
    }
    if (self.activeNavbarLink_) goog.dom.classes.remove(self.activeNavbarLink_,
        'active');
    if (navbarLink) goog.dom.classes.add(navbarLink, 'active');
    if (navbarLink) self.activeNavbarLink_ = navbarLink;
    if (opt_callback !== undefined) opt_callback(self);
  }, undefined, { cache: false });
};



xrx.demo.Demo.prototype.loadPageHome_ = function() {
  this.loadPage_('SemToNotes', 'client/demo/home.html',
      goog.dom.getElement('homeLink'));
};



xrx.demo.Demo.prototype.loadPageExamples_ = function() {
  var init = function(demo) {
    var href;
    var b = goog.dom.getElementsByTagNameAndClass('body')[0];
    var contentElement = goog.dom.getElement('content');
    var links = goog.dom.getElementsByTagNameAndClass('a');
    for(var i = 0, len = links.length; i < len; i++) {
      href = links[i].href;
      if (goog.string.contains(href, 'example!')) {
        demo.handler_.listen(links[i], goog.events.EventType.CLICK, function(e) {
          demo.loadPageExample_(e.target.href.split('\!')[1]);
        });
      }
    }
  }
  this.loadPage_('Examples | SemToNotes', 'client/demo/examples.html',
      goog.dom.getElement('examplesLink'), init);
};



xrx.demo.Demo.prototype.installExampleBacklink_ = function(exampleId) {
  var self = this;
  var content = goog.dom.getElement('content');
  var backlink = goog.dom.htmlToDocumentFragment(
      '<a class="glyphicon glyphicon-arrow-left" href="#examples!' +
      exampleId + '"><strong> back</strong></a>');
  this.handler_.listen(backlink, goog.events.EventType.CLICK, function(e) {
    self.loadPageExamples_();
  });
  goog.dom.insertChildAt(content, backlink, 0);
};



xrx.demo.Demo.prototype.installExampleSource_ = function(src, exampleId) {
  var content = goog.dom.getElement('content');
  var type = goog.dom.dataset.get(content, 'type') || 'js';
  var wrapper = goog.dom.createElement('div');
  var heading = type === 'js' ? goog.dom.htmlToDocumentFragment('<h3>Usage</h3>') :
      goog.dom.htmlToDocumentFragment('<h3>Source</h3>');
  var pre = goog.dom.createElement('pre');
  var href = type === 'js' ? 'client/demo/example/' + exampleId + '.js' :
      'client/demo/example/' + exampleId + '.htm.html';
  var label = type === 'js' ? 'View Source &raquo;' : 'Try it yourself &raquo;'
  var viewSource = goog.dom.htmlToDocumentFragment(
      '<a href="' + href + '">' + label + '</a>');
  goog.dom.append(wrapper, [heading, pre, viewSource]);
  goog.dom.append(content, wrapper);
  goog.dom.setTextContent(pre, src);
  goog.dom.classes.add(pre, 'lang-' + type);
  goog.dom.classes.add(pre, 'prettyprint');
  PR.prettyPrint();
};



xrx.demo.Demo.prototype.installExample_ = function(src, exampleId) {
  var content = goog.dom.getElement('content');
  var type = goog.dom.dataset.get(content, 'type') || 'js';
  this.installExampleBacklink_(exampleId);
  this.installExampleSource_(src, exampleId);
  type === 'js' ? this.example_ = eval(src) : this.example_ = null;
};



xrx.demo.Demo.prototype.loadPageExample_ = function(exampleId) {
  var self = this;
  var loadScript = function(demo) {
    var content = goog.dom.getElement('content');
    var type = goog.dom.dataset.get(content, 'type') || 'js';
    var url = type === 'js' ? 'client/demo/example/' + exampleId + '.' + type :
        'client/demo/example/' + exampleId + '.htm.' + type
    goog.net.XhrIo.send(url, function(e) {
      var src = e.target.getResponseText();
      if (self.status_ === true) demo.installExample_(src, exampleId);
    });
  };
  this.loadPage_('Example | SemToNotes', 'client/demo/example/' + 
      exampleId + '.html', undefined, loadScript);
};



xrx.demo.Demo.prototype.loadPageTutorials_ = function() {
  this.loadPage_('Tutorials | SemToNotes', 'client/demo/tutorials.html',
      goog.dom.getElement('tutorialsLink'));
};



xrx.demo.Demo.prototype.loadPageApi_ = function() {
  this.loadPage_('API | SemToNotes', 'client/demo/api.html',
      goog.dom.getElement('apiLink'));
};



xrx.demo.Demo.prototype.installNavbar_ = function() {
  var self = this;
  var linkHome = goog.dom.getElement('homeLink');
  var linkExamples = goog.dom.getElement('examplesLink');
  var linkTutorials = goog.dom.getElement('tutorialsLink');
  var linkApi = goog.dom.getElement('apiLink');
  goog.events.listen(linkHome, goog.events.EventType.CLICK, function(e) {
    self.loadPageHome_();
  });
  goog.events.listen(linkExamples, goog.events.EventType.CLICK, function(e) {
    self.loadPageExamples_();
  });
  goog.events.listen(linkTutorials, goog.events.EventType.CLICK, function(e) {
    self.loadPageTutorials_();
  });
  goog.events.listen(linkApi, goog.events.EventType.CLICK, function(e) {
    self.loadPageApi_();
  });
};



xrx.demo.Demo.prototype.init_ = function() {
  var hash = goog.dom.getWindow().location.hash.split('#')[1] ||
      'home';
  if (this.isPageExamples(hash)) {
    this.loadPageExamples_();
  } else if (this.isPageExample(hash)) {
    this.loadPageExample_(hash.split('\!')[1]);
  } else if (this.isPageTutorials(hash)) {
    this.loadPageTutorials_();
  } else if (this.isPageApi(hash)) {
    this.loadPageApi_();
  } else {
    this.loadPageHome_();
  } 
  this.installNavbar_();
};



xrx.demo.install = function() {
  return new xrx.demo.Demo();
};