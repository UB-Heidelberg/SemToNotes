/**
 * @fileoverview 
 */

goog.provide('xrx.widget.AbstractHighlight');
goog.provide('xrx.widget.Highlight');
goog.provide('xrx.widget.HighlightInner');



goog.require('goog.dom.NodeIterator');
goog.require('goog.events');
goog.require('goog.events.EventType');
goog.require('goog.iter');
goog.require('xrx.mvc.Component');



/**
 * @constructor
 */
xrx.widget.AbstractHighlight = function(element) {

  goog.base(this, element);

  this.last_;
};
goog.inherits(xrx.widget.AbstractHighlight, xrx.mvc.Component);



xrx.widget.AbstractHighlight.prototype.highlight_ = goog.abstractMethod;



xrx.widget.AbstractHighlight.prototype.unhighlight_ = goog.abstractMethod;



/**
 * @private
 */
xrx.widget.AbstractHighlight.prototype.handleOut_ = function(e) {
  this.unhighlight_();
  this.last_ = null;
};



/**
 * @private
 */
xrx.widget.AbstractHighlight.prototype.handleOver_ = function(e) {
  if (this.last_ === e.target) return;
  this.unhighlight_();
  this.highlight_(e.target);
  this.last_ = e.target;
};



xrx.widget.AbstractHighlight.prototype.createDom = function() {
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
xrx.widget.Highlight = function(element) {

  goog.base(this, element);
};
goog.inherits(xrx.widget.Highlight, xrx.widget.AbstractHighlight);
xrx.mvc.registerComponent('xrx-highlight', xrx.widget.Highlight);



xrx.widget.Highlight.prototype.highlight_ = function(target) {
  this.highlighted_ = target;
  goog.dom.classes.add(target, 'xrx-class-highlighted');
};



xrx.widget.Highlight.prototype.unhighlight_ = function() {
  if (this.highlighted_) goog.dom.classes.toggle(this.highlighted_, 'xrx-class-highlighted');
  this.highlighted_ = null;
};



/**
 * @constructor
 */
xrx.widget.HighlightInner = function(element) {

  goog.base(this, element);

  this.num_ = 0;

  this.highlighted_ = [];
};
goog.inherits(xrx.widget.HighlightInner, xrx.widget.AbstractHighlight);
xrx.mvc.registerComponent('xrx-highlight-inner', xrx.widget.HighlightInner);



/**
 * @private
 */
xrx.widget.HighlightInner.prototype.collect_ = function(target) {
  var self = this;
  var iter = new goog.dom.NodeIterator(this.element_, false, true);
  var node;
  var reached = false;
  iter.setPosition(this.element_);
  this.num_ = 0;

  var highlight = function(n) {
    self.num_ > self.highlighted_.length - 1 ? self.highlighted_.push(n) :
        self.highlighted_[self.num_] = n;
    self.num_++;
  };

  // walk forward
  while((node = goog.iter.nextOrValue(iter, false)) && !reached) {
    if (node instanceof HTMLElement) {
      if (goog.dom.classes.has(node, 'xrx-highlight-inner')) highlight(node);
      if (goog.dom.classes.has(node, 'xrx-highlight-end')) reached = true;
    };
  };

  // walk backward
  reached = false;
  iter.setPosition(this.element_);
  iter.reversed = true;
  while((node = goog.iter.nextOrValue(iter, false)) && !reached) {
    if (node instanceof HTMLElement) {
      if (goog.dom.classes.has(node, 'xrx-highlight-inner')) highlight(node);
      if (goog.dom.classes.has(node, 'xrx-highlight-start')) reached = true;
    };
  };
};



/**
 * @private
 */
xrx.widget.HighlightInner.prototype.highlight_ = function(target) {
  this.collect_(target);
  for (var i = 0; i < this.num_; i++) {
    if (this.highlighted_[i]) goog.dom.classes.enable(this.highlighted_[i],
        'xrx-class-highlighted', true);
  };
};



/**
 * @private
 */
xrx.widget.HighlightInner.prototype.unhighlight_ = function() {
  for (var i = 0; i < this.num_; i++) {
    if (this.highlighted_[i]) goog.dom.classes.enable(this.highlighted_[i],
        'xrx-class-highlighted', false);
  };
  this.num_ = 0;
};
