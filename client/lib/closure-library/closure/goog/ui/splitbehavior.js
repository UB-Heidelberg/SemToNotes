// Copyright 2010 The Closure Library Authors. All Rights Reserved
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

***REMOVED***
***REMOVED*** @fileoverview Behavior for combining two controls.
***REMOVED***
***REMOVED*** @see ../demos/split.html
***REMOVED***

goog.provide('goog.ui.SplitBehavior');
goog.provide('goog.ui.SplitBehavior.DefaultHandlers');

goog.require('goog.Disposable');
goog.require('goog.asserts');
goog.require('goog.dispose');
goog.require('goog.dom');
goog.require('goog.dom.NodeType');
goog.require('goog.dom.classlist');
goog.require('goog.events.EventHandler');
goog.require('goog.ui.ButtonSide');
goog.require('goog.ui.Component');
goog.require('goog.ui.decorate');
goog.require('goog.ui.registry');



***REMOVED***
***REMOVED*** Creates a behavior for combining two controls. The behavior is triggered
***REMOVED*** by a given event type which applies the behavior handler.
***REMOVED*** Can be used to also render or decorate  the controls.
***REMOVED*** For a usage example see {@link goog.ui.ColorSplitBehavior}
***REMOVED***
***REMOVED*** @param {goog.ui.Control} first A ui control.
***REMOVED*** @param {goog.ui.Control} second A ui control.
***REMOVED*** @param {function(goog.ui.Control,Event)=} opt_behaviorHandler A handler
***REMOVED***     to apply for the behavior.
***REMOVED*** @param {string=} opt_eventType The event type triggering the
***REMOVED***     handler.
***REMOVED*** @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper, used for
***REMOVED***     document interaction.
***REMOVED***
***REMOVED*** @extends {goog.Disposable}
***REMOVED***
goog.ui.SplitBehavior = function(first, second, opt_behaviorHandler,
    opt_eventType, opt_domHelper) {
  goog.Disposable.call(this);

 ***REMOVED*****REMOVED***
  ***REMOVED*** @type {goog.ui.Control}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.first_ = first;

 ***REMOVED*****REMOVED***
  ***REMOVED*** @type {goog.ui.Control}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.second_ = second;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Handler for this behavior.
  ***REMOVED*** @type {function(goog.ui.Control,Event)}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.behaviorHandler_ = opt_behaviorHandler ||
                          goog.ui.SplitBehavior.DefaultHandlers.CAPTION;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Event type triggering the behavior.
  ***REMOVED*** @type {string}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.eventType_ = opt_eventType || goog.ui.Component.EventType.ACTION;

 ***REMOVED*****REMOVED***
  ***REMOVED*** @type {goog.dom.DomHelper}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.dom_ = opt_domHelper || goog.dom.getDomHelper();

 ***REMOVED*****REMOVED***
  ***REMOVED*** True iff the behavior is active.
  ***REMOVED*** @type {boolean}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.isActive_ = false;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Event handler.
  ***REMOVED*** @type {goog.events.EventHandler}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.eventHandler_ = new goog.events.EventHandler();

 ***REMOVED*****REMOVED***
  ***REMOVED*** Whether to dispose the first control when dispose is called.
  ***REMOVED*** @type {boolean}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.disposeFirst_ = true;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Whether to dispose the second control when dispose is called.
  ***REMOVED*** @type {boolean}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.disposeSecond_ = true;
***REMOVED***
goog.inherits(goog.ui.SplitBehavior, goog.Disposable);


***REMOVED***
***REMOVED*** Css class for elements rendered by this behavior.
***REMOVED*** @type {string}
***REMOVED***
goog.ui.SplitBehavior.CSS_CLASS = goog.getCssName('goog-split-behavior');


***REMOVED***
***REMOVED*** An emum of split behavior handlers.
***REMOVED*** @enum {function(goog.ui.Control,Event)}
***REMOVED***
goog.ui.SplitBehavior.DefaultHandlers = {
  NONE: goog.nullFunction,
  CAPTION: function(targetControl, e) {
    var item =***REMOVED*****REMOVED*** @type {goog.ui.MenuItem}***REMOVED*** (e.target);
    var value = (***REMOVED*** @type {string}***REMOVED***((item && item.getValue()) || ''));
    var button =***REMOVED*****REMOVED*** @type {goog.ui.Button}***REMOVED*** (targetControl);
    button.setCaption && button.setCaption(value);
    button.setValue && button.setValue(value);
  },
  VALUE: function(targetControl, e) {
    var item =***REMOVED*****REMOVED*** @type {goog.ui.MenuItem}***REMOVED*** (e.target);
    var value = (***REMOVED*** @type {string}***REMOVED***(item && item.getValue()) || '');
    var button =***REMOVED*****REMOVED*** @type {goog.ui.Button}***REMOVED*** (targetControl);
    button.setValue && button.setValue(value);
  }
***REMOVED***


***REMOVED***
***REMOVED*** The element containing the controls.
***REMOVED*** @type {Element}
***REMOVED*** @private
***REMOVED***
goog.ui.SplitBehavior.prototype.element_ = null;


***REMOVED***
***REMOVED*** @return {Element} The element containing the controls.
***REMOVED***
goog.ui.SplitBehavior.prototype.getElement = function() {
  return this.element_;
***REMOVED***


***REMOVED***
***REMOVED*** @return {function(goog.ui.Control,Event)} The behavior handler.
***REMOVED***
goog.ui.SplitBehavior.prototype.getBehaviorHandler = function() {
  return this.behaviorHandler_;
***REMOVED***


***REMOVED***
***REMOVED*** @return {string} The behavior event type.
***REMOVED***
goog.ui.SplitBehavior.prototype.getEventType = function() {
  return this.eventType_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the disposeControls flags.
***REMOVED*** @param {boolean} disposeFirst Whether to dispose the first control
***REMOVED***     when dispose is called.
***REMOVED*** @param {boolean} disposeSecond Whether to dispose the second control
***REMOVED***     when dispose is called.
***REMOVED***
goog.ui.SplitBehavior.prototype.setDisposeControls = function(disposeFirst,
    disposeSecond) {
  this.disposeFirst_ = !!disposeFirst;
  this.disposeSecond_ = !!disposeSecond;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the behavior handler.
***REMOVED*** @param {function(goog.ui.Control,Event)} behaviorHandler The behavior
***REMOVED***     handler.
***REMOVED***
goog.ui.SplitBehavior.prototype.setHandler = function(behaviorHandler) {
  this.behaviorHandler_ = behaviorHandler;
  if (this.isActive_) {
    this.setActive(false);
    this.setActive(true);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Sets the behavior event type.
***REMOVED*** @param {string} eventType The behavior event type.
***REMOVED***
goog.ui.SplitBehavior.prototype.setEventType = function(eventType) {
  this.eventType_ = eventType;
  if (this.isActive_) {
    this.setActive(false);
    this.setActive(true);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Decorates an element and returns the behavior.
***REMOVED*** @param {Element} element An element to decorate.
***REMOVED*** @param {boolean=} opt_activate Whether to activate the behavior
***REMOVED***     (default=true).
***REMOVED*** @return {!goog.ui.SplitBehavior} A split behavior.
***REMOVED***
goog.ui.SplitBehavior.prototype.decorate = function(element, opt_activate) {
  if (this.first_ || this.second_) {
    throw Error('Cannot decorate controls are already set');
  }
  this.decorateChildren_(element);
  var activate = goog.isDefAndNotNull(opt_activate) ? !!opt_activate : true;
  this.element_ = element;
  this.setActive(activate);
  return this;
***REMOVED***


***REMOVED***
***REMOVED*** Renders an element and returns the behavior.
***REMOVED*** @param {Element} element An element to decorate.
***REMOVED*** @param {boolean=} opt_activate Whether to activate the behavior
***REMOVED***     (default=true).
***REMOVED*** @return {!goog.ui.SplitBehavior} A split behavior.
***REMOVED***
goog.ui.SplitBehavior.prototype.render = function(element, opt_activate) {
  goog.asserts.assert(element);
  goog.dom.classlist.add(element, goog.ui.SplitBehavior.CSS_CLASS);
  this.first_.render(element);
  this.second_.render(element);
  this.collapseSides_(this.first_, this.second_);
  var activate = goog.isDefAndNotNull(opt_activate) ? !!opt_activate : true;
  this.element_ = element;
  this.setActive(activate);
  return this;
***REMOVED***


***REMOVED***
***REMOVED*** Activate or deactivate the behavior.
***REMOVED*** @param {boolean} activate Whether to activate or deactivate the behavior.
***REMOVED***
goog.ui.SplitBehavior.prototype.setActive = function(activate) {
  if (this.isActive_ == activate) {
    return;
  }
  this.isActive_ = activate;
  if (activate) {
    this.eventHandler_.listen(this.second_, this.eventType_,
        goog.bind(this.behaviorHandler_, this, this.first_));
    // TODO(user): should we call the handler here to sync between
    // first_ and second_.
  } else {
    this.eventHandler_.removeAll();
  }
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.ui.SplitBehavior.prototype.disposeInternal = function() {
  this.setActive(false);
  goog.dispose(this.eventHandler_);
  if (this.disposeFirst_) {
    goog.dispose(this.first_);
  }
  if (this.disposeSecond_) {
    goog.dispose(this.second_);
  }
  goog.ui.SplitBehavior.superClass_.disposeInternal.call(this);
***REMOVED***


***REMOVED***
***REMOVED*** Decorates two child nodes of the given element.
***REMOVED*** @param {Element} element An element to render two of it's child nodes.
***REMOVED*** @private
***REMOVED***
goog.ui.SplitBehavior.prototype.decorateChildren_ = function(
    element) {
  var childNodes = element.childNodes;
  var len = childNodes.length;
  var finished = false;
  for (var i = 0; i < len && !finished; i++) {
    var child = childNodes[i];
    if (child.nodeType == goog.dom.NodeType.ELEMENT) {
      if (!this.first_) {
        this.first_ =***REMOVED*****REMOVED*** @type {goog.ui.Control}***REMOVED*** (goog.ui.decorate(child));
      } else if (!this.second_) {
        this.second_ =***REMOVED*****REMOVED*** @type {goog.ui.Control}***REMOVED*** (goog.ui.decorate(child));
        finished = true;
      }
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** Collapse the the controls together.
***REMOVED*** @param {goog.ui.Control} first The first element.
***REMOVED*** @param {goog.ui.Control} second The second element.
***REMOVED*** @private
***REMOVED***
goog.ui.SplitBehavior.prototype.collapseSides_ = function(first, second) {
  if (goog.isFunction(first.setCollapsed) &&
      goog.isFunction(second.setCollapsed)) {
    first.setCollapsed(goog.ui.ButtonSide.END);
    second.setCollapsed(goog.ui.ButtonSide.START);
  }
***REMOVED***


// Register a decorator factory function for goog.ui.Buttons.
goog.ui.registry.setDecoratorByClassName(goog.ui.SplitBehavior.CSS_CLASS,
    function() {
      return new goog.ui.SplitBehavior(null, null);
    });

