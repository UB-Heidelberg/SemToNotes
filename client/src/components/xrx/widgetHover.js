/**
 * @fileoverview 
 */

goog.provide('xrx.widget.AbstractHover');
goog.provide('xrx.widget.Hover');
goog.provide('xrx.widget.HoverEnd');
goog.provide('xrx.widget.HoverInner');
goog.provide('xrx.widget.HoverMultiple');
goog.provide('xrx.widget.HoverStart');



goog.require('goog.dom.NodeIterator');
goog.require('goog.events');
goog.require('goog.events.EventType');
goog.require('goog.iter');
goog.require('xrx.mvc.Component');



/**
 * @constructor
 */
xrx.widget.AbstractHover = function(element) {

  goog.base(this, element);

  this.last_;
};
goog.inherits(xrx.widget.AbstractHover, xrx.mvc.Component);



xrx.widget.AbstractHover.prototype.highlight_ = goog.abstractMethod;



xrx.widget.AbstractHover.prototype.unhighlight_ = goog.abstractMethod;



xrx.widget.AbstractHover.prototype.hoverIn = function() {
  this.handleOver_();
};



xrx.widget.AbstractHover.prototype.hoverOut = function() {
  this.handleOut_();
};



/**
 * @private
 */
xrx.widget.AbstractHover.prototype.handleOut_ = function(e) {
  this.unhighlight_();
  this.last_ = null;
};



/**
 * @private
 */
xrx.widget.AbstractHover.prototype.handleOver_ = function(e) {
  if (this.last_ === e.target) return;
  this.unhighlight_();
  this.highlight_(e.target);
  this.last_ = e.target;
};



xrx.widget.AbstractHover.prototype.createDom = function() {
  goog.events.listen(this.element_, goog.events.EventType.MOUSEOVER, function(e) {
    this.handleOver_(e);
  }, false, this);
  goog.events.listen(this.element_, goog.events.EventType.MOUSEOUT, function(e) {
    this.handleOut_(e);
  }, false, this);
};




/**
 * @constructor
 */
xrx.widget.Hover = function(element) {

  goog.base(this, element);
};
goog.inherits(xrx.widget.Hover, xrx.widget.AbstractHover);
xrx.mvc.registerComponent('xrx-hover', xrx.widget.Hover);



xrx.widget.Hover.prototype.highlight_ = function(target) {
  this.highlighted_ = target;
  goog.dom.classes.enable(target, 'xrx-class-hover', true);
};



xrx.widget.Hover.prototype.unhighlight_ = function() {
  if (this.highlighted_) goog.dom.classes.enable(this.highlighted_,
      'xrx-class-hover', false);
  this.highlighted_ = null;
};



/**
 * @constructor
 */
xrx.widget.HoverMultiple = function(element) {

  goog.base(this, element);

  this.num_ = 0;

  this.highlighted_ = [];
};
goog.inherits(xrx.widget.HoverMultiple, xrx.widget.AbstractHover);



/**
 * @private
 */
xrx.widget.HoverMultiple.prototype.collect_ = goog.abstractMethod;



/**
 * @private
 */
xrx.widget.HoverMultiple.prototype.save_ = function(node) {
  this.num_ > this.highlighted_.length - 1 ? this.highlighted_.push(node) :
      this.highlighted_[this.num_] = node;
  this.num_++;
};



/**
 * @private
 */
xrx.widget.HoverMultiple.prototype.collectForward_ = function(iter) {
  var node;
  var reached = false;
  while((node = goog.iter.nextOrValue(iter, false)) && !reached) {
    if (node instanceof HTMLElement) {
      if (goog.dom.classes.has(node, 'xrx-hover-inner')) this.save_(node);
      if (goog.dom.classes.has(node, 'xrx-hover-end')) {
        this.save_(node);
        reached = true;
      };
      if (goog.dom.classes.has(node, 'xrx-hover-start')) {
        this.save_(node);
      };
    };
  };
};



/**
 * @private
 */
xrx.widget.HoverMultiple.prototype.collectBackward_ = function(iter) {
  var node;
  var reached = false;
  iter.reversed = true;
  while((node = goog.iter.nextOrValue(iter, false)) && !reached) {
    if (node instanceof HTMLElement) {
      if (goog.dom.classes.has(node, 'xrx-hover-inner')) this.save_(node);
      if (goog.dom.classes.has(node, 'xrx-hover-start')) {
        this.save_(node);
        reached = true;
      };
      if (goog.dom.classes.has(node, 'xrx-hover-end')) {
        this.save_(node);
      };
    };
  };
};



/**
 * @private
 */
xrx.widget.HoverMultiple.prototype.highlight_ = function(target) {
  this.collect_(target);
  for (var i = 0; i < this.num_; i++) {
    if (this.highlighted_[i]) goog.dom.classes.enable(this.highlighted_[i],
        'xrx-class-hover', true);
  };
};



/**
 * @private
 */
xrx.widget.HoverMultiple.prototype.unhighlight_ = function() {
  for (var i = 0; i < this.num_; i++) {
    if (this.highlighted_[i]) goog.dom.classes.enable(this.highlighted_[i],
        'xrx-class-hover', false);
  };
  this.num_ = 0;
};



/**
 * @constructor
 */
xrx.widget.HoverStart = function(element) {

  goog.base(this, element);
};
goog.inherits(xrx.widget.HoverStart, xrx.widget.HoverMultiple);
xrx.mvc.registerComponent('xrx-hover-start', xrx.widget.HoverStart);



xrx.widget.HoverStart.prototype.collect_ = function(target) {
  var iter = new goog.dom.NodeIterator(this.element_, false, true);
  this.num_ = 0;
  iter.setPosition(this.element_);
  this.collectForward_(iter);
};



/**
 * @constructor
 */
xrx.widget.HoverEnd = function(element) {

  goog.base(this, element);
};
goog.inherits(xrx.widget.HoverEnd, xrx.widget.HoverMultiple);
xrx.mvc.registerComponent('xrx-hover-end', xrx.widget.HoverEnd);



xrx.widget.HoverEnd.prototype.collect_ = function(target) {
  var iter = new goog.dom.NodeIterator(this.element_, false, true);
  this.num_ = 0;
  iter.setPosition(this.element_);
  this.collectBackward_(iter);
};



/**
 * @constructor
 */
xrx.widget.HoverInner = function(element) {

  goog.base(this, element);
};
goog.inherits(xrx.widget.HoverInner, xrx.widget.HoverMultiple);
xrx.mvc.registerComponent('xrx-hover-inner', xrx.widget.HoverInner);



/**
 * @private
 */
xrx.widget.HoverInner.prototype.collect_ = function(target) {
  var iter = new goog.dom.NodeIterator(this.element_, false, true);
  this.num_ = 0;
  iter.setPosition(this.element_);
  this.collectForward_(iter);
  iter.setPosition(this.element_);
  this.collectBackward_(iter);
};
