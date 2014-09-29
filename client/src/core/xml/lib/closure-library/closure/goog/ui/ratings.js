// Copyright 2006 The Closure Library Authors. All Rights Reserved.
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
***REMOVED*** @fileoverview A base ratings widget that allows the user to select a rating,
***REMOVED*** like "star video" in Google Video. This fires a "change" event when the user
***REMOVED*** selects a rating.
***REMOVED***
***REMOVED*** Keyboard:
***REMOVED*** ESC = Clear (if supported)
***REMOVED*** Home = 1 star
***REMOVED*** End = Full rating
***REMOVED*** Left arrow = Decrease rating
***REMOVED*** Right arrow = Increase rating
***REMOVED*** 0 = Clear (if supported)
***REMOVED*** 1 - 9 = nth star
***REMOVED***
***REMOVED*** @see ../demos/ratings.html
***REMOVED***

goog.provide('goog.ui.Ratings');
goog.provide('goog.ui.Ratings.EventType');

goog.require('goog.a11y.aria');
goog.require('goog.a11y.aria.Role');
goog.require('goog.a11y.aria.State');
goog.require('goog.asserts');
goog.require('goog.dom.classes');
***REMOVED***
goog.require('goog.ui.Component');



***REMOVED***
***REMOVED*** A UI Control used for rating things, i.e. videos on Google Video.
***REMOVED*** @param {Array.<string>=} opt_ratings Ratings. Default: [1,2,3,4,5].
***REMOVED*** @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper.
***REMOVED***
***REMOVED*** @extends {goog.ui.Component}
***REMOVED***
goog.ui.Ratings = function(opt_ratings, opt_domHelper) {
  goog.ui.Component.call(this, opt_domHelper);

 ***REMOVED*****REMOVED***
  ***REMOVED*** Ordered ratings that can be picked, Default: [1,2,3,4,5]
  ***REMOVED*** @type {Array.<string>}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.ratings_ = opt_ratings || ['1', '2', '3', '4', '5'];

 ***REMOVED*****REMOVED***
  ***REMOVED*** Array containing references to the star elements
  ***REMOVED*** @type {Array.<Element>}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.stars_ = [];
***REMOVED***
goog.inherits(goog.ui.Ratings, goog.ui.Component);


***REMOVED***
***REMOVED*** Default CSS class to be applied to the root element of components rendered
***REMOVED*** by this renderer.
***REMOVED*** @type {string}
***REMOVED***
goog.ui.Ratings.CSS_CLASS = goog.getCssName('goog-ratings');


***REMOVED***
***REMOVED*** The last index to be highlighted
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.ui.Ratings.prototype.highlightedIndex_ = -1;


***REMOVED***
***REMOVED*** The currently selected index
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.ui.Ratings.prototype.selectedIndex_ = -1;


***REMOVED***
***REMOVED*** An attached form field to set the value to
***REMOVED*** @type {HTMLInputElement|HTMLSelectElement|null}
***REMOVED*** @private
***REMOVED***
goog.ui.Ratings.prototype.attachedFormField_ = null;


***REMOVED***
***REMOVED*** Enums for Ratings event type.
***REMOVED*** @enum {string}
***REMOVED***
goog.ui.Ratings.EventType = {
  CHANGE: 'change',
  HIGHLIGHT_CHANGE: 'highlightchange',
  HIGHLIGHT: 'highlight',
  UNHIGHLIGHT: 'unhighlight'
***REMOVED***


***REMOVED***
***REMOVED*** Decorate a HTML structure already in the document.  Expects the structure:
***REMOVED*** <pre>
***REMOVED*** - div
***REMOVED***   - select
***REMOVED***       - option 1 #text = 1 star
***REMOVED***       - option 2 #text = 2 stars
***REMOVED***       - option 3 #text = 3 stars
***REMOVED***       - option N (where N is max number of ratings)
***REMOVED*** </pre>
***REMOVED***
***REMOVED*** The div can contain other elements for graceful degredation, but they will be
***REMOVED*** hidden when the decoration occurs.
***REMOVED***
***REMOVED*** @param {Element} el Div element to decorate.
***REMOVED*** @override
***REMOVED***
goog.ui.Ratings.prototype.decorateInternal = function(el) {
  var select = el.getElementsByTagName('select')[0];
  if (!select) {
    throw Error('Can not decorate ' + el + ', with Ratings. Must ' +
                'contain select box');
  }
  this.ratings_.length = 0;
  for (var i = 0, n = select.options.length; i < n; i++) {
    var option = select.options[i];
    this.ratings_.push(option.text);
  }
  this.setSelectedIndex(select.selectedIndex);
  select.style.display = 'none';
  this.attachedFormField_ = select;
  this.createDom();
  el.insertBefore(this.getElement(), select);
***REMOVED***


***REMOVED***
***REMOVED*** Render the rating widget inside the provided element. This will override the
***REMOVED*** current content of the element.
***REMOVED*** @override
***REMOVED***
goog.ui.Ratings.prototype.enterDocument = function() {
  var el = this.getElement();
  goog.asserts.assert(el, 'The DOM element for ratings cannot be null.');
  el.tabIndex = 0;
  goog.dom.classes.add(el, this.getCssClass());
  goog.a11y.aria.setRole(el, goog.a11y.aria.Role.SLIDER);
  goog.a11y.aria.setState(el, goog.a11y.aria.State.VALUEMIN, 0);
  var max = this.ratings_.length - 1;
  goog.a11y.aria.setState(el, goog.a11y.aria.State.VALUEMAX, max);
  var handler = this.getHandler();
  handler.listen(el, 'keydown', this.onKeyDown_);

  // Create the elements for the stars
  for (var i = 0; i < this.ratings_.length; i++) {
    var star = this.getDomHelper().createDom('span', {
        'title': this.ratings_[i],
        'class': this.getClassName_(i, false),
        'index': i});
    this.stars_.push(star);
    el.appendChild(star);
  }

  handler.listen(el, goog.events.EventType.CLICK, this.onClick_);
  handler.listen(el, goog.events.EventType.MOUSEOUT, this.onMouseOut_);
  handler.listen(el, goog.events.EventType.MOUSEOVER, this.onMouseOver_);

  this.highlightIndex_(this.selectedIndex_);
***REMOVED***


***REMOVED***
***REMOVED*** Should be called when the widget is removed from the document but may be
***REMOVED*** reused.  This removes all the listeners the widget has attached and destroys
***REMOVED*** the DOM nodes it uses.
***REMOVED*** @override
***REMOVED***
goog.ui.Ratings.prototype.exitDocument = function() {
  goog.ui.Ratings.superClass_.exitDocument.call(this);
  for (var i = 0; i < this.stars_.length; i++) {
    this.getDomHelper().removeNode(this.stars_[i]);
  }
  this.stars_.length = 0;
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.ui.Ratings.prototype.disposeInternal = function() {
  goog.ui.Ratings.superClass_.disposeInternal.call(this);
  this.ratings_.length = 0;
  this.rendered_ = false;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the base CSS class used by subcomponents of this component.
***REMOVED*** @return {string} Component-specific CSS class.
***REMOVED***
goog.ui.Ratings.prototype.getCssClass = function() {
  return goog.ui.Ratings.CSS_CLASS;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the selected index. If the provided index is greater than the number of
***REMOVED*** ratings then the max is set.  0 is the first item, -1 is no selection.
***REMOVED*** @param {number} index The index of the rating to select.
***REMOVED***
goog.ui.Ratings.prototype.setSelectedIndex = function(index) {
  index = Math.max(-1, Math.min(index, this.ratings_.length - 1));
  if (index != this.selectedIndex_) {
    this.selectedIndex_ = index;
    this.highlightIndex_(this.selectedIndex_);
    if (this.attachedFormField_) {
      if (this.attachedFormField_.tagName == 'SELECT') {
        this.attachedFormField_.selectedIndex = index;
      } else {
        this.attachedFormField_.value =
           ***REMOVED*****REMOVED*** @type {string}***REMOVED*** (this.getValue());
      }
      var ratingsElement = this.getElement();
      goog.asserts.assert(ratingsElement,
          'The DOM ratings element cannot be null.');
      goog.a11y.aria.setState(ratingsElement,
          goog.a11y.aria.State.VALUENOW,
          this.ratings_[index]);
    }
    this.dispatchEvent(goog.ui.Ratings.EventType.CHANGE);
  }
***REMOVED***


***REMOVED***
***REMOVED*** @return {number} The index of the currently selected rating.
***REMOVED***
goog.ui.Ratings.prototype.getSelectedIndex = function() {
  return this.selectedIndex_;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the rating value of the currently selected rating
***REMOVED*** @return {?string} The value of the currently selected rating (or null).
***REMOVED***
goog.ui.Ratings.prototype.getValue = function() {
  return this.selectedIndex_ == -1 ? null : this.ratings_[this.selectedIndex_];
***REMOVED***


***REMOVED***
***REMOVED*** Returns the index of the currently highlighted rating, -1 if the mouse isn't
***REMOVED*** currently over the widget
***REMOVED*** @return {number} The index of the currently highlighted rating.
***REMOVED***
goog.ui.Ratings.prototype.getHighlightedIndex = function() {
  return this.highlightedIndex_;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the value of the currently highlighted rating, null if the mouse
***REMOVED*** isn't currently over the widget
***REMOVED*** @return {?string} The value of the currently highlighted rating, or null.
***REMOVED***
goog.ui.Ratings.prototype.getHighlightedValue = function() {
  return this.highlightedIndex_ == -1 ? null :
      this.ratings_[this.highlightedIndex_];
***REMOVED***


***REMOVED***
***REMOVED*** Sets the array of ratings that the comonent
***REMOVED*** @param {Array.<string>} ratings Array of value to use as ratings.
***REMOVED***
goog.ui.Ratings.prototype.setRatings = function(ratings) {
  this.ratings_ = ratings;
  // TODO(user): If rendered update stars
***REMOVED***


***REMOVED***
***REMOVED*** Gets the array of ratings that the component
***REMOVED*** @return {Array.<string>} Array of ratings.
***REMOVED***
goog.ui.Ratings.prototype.getRatings = function() {
  return this.ratings_;
***REMOVED***


***REMOVED***
***REMOVED*** Attaches an input or select element to the ratings widget. The value or
***REMOVED*** index of the field will be updated along with the ratings widget.
***REMOVED*** @param {HTMLSelectElement|HTMLInputElement} field The field to attach to.
***REMOVED***
goog.ui.Ratings.prototype.setAttachedFormField = function(field) {
  this.attachedFormField_ = field;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the attached input or select element to the ratings widget.
***REMOVED*** @return {HTMLSelectElement|HTMLInputElement|null} The attached form field.
***REMOVED***
goog.ui.Ratings.prototype.getAttachedFormField = function() {
  return this.attachedFormField_;
***REMOVED***


***REMOVED***
***REMOVED*** Handle the mouse moving over a star.
***REMOVED*** @param {goog.events.BrowserEvent} e The browser event.
***REMOVED*** @private
***REMOVED***
goog.ui.Ratings.prototype.onMouseOver_ = function(e) {
  if (goog.isDef(e.target.index)) {
    var n = e.target.index;
    if (this.highlightedIndex_ != n) {
      this.highlightIndex_(n);
      this.highlightedIndex_ = n;
      this.dispatchEvent(goog.ui.Ratings.EventType.HIGHLIGHT_CHANGE);
      this.dispatchEvent(goog.ui.Ratings.EventType.HIGHLIGHT);
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** Handle the mouse moving over a star.
***REMOVED*** @param {goog.events.BrowserEvent} e The browser event.
***REMOVED*** @private
***REMOVED***
goog.ui.Ratings.prototype.onMouseOut_ = function(e) {
  // Only remove the highlight if the mouse is not moving to another star
  if (e.relatedTarget && !goog.isDef(e.relatedTarget.index)) {
    this.highlightIndex_(this.selectedIndex_);
    this.highlightedIndex_ = -1;
    this.dispatchEvent(goog.ui.Ratings.EventType.HIGHLIGHT_CHANGE);
    this.dispatchEvent(goog.ui.Ratings.EventType.UNHIGHLIGHT);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Handle the mouse moving over a star.
***REMOVED*** @param {goog.events.BrowserEvent} e The browser event.
***REMOVED*** @private
***REMOVED***
goog.ui.Ratings.prototype.onClick_ = function(e) {
  if (goog.isDef(e.target.index)) {
    this.setSelectedIndex(e.target.index);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Handle the key down event. 0 = unselected in this case, 1 = the first rating
***REMOVED*** @param {goog.events.BrowserEvent} e The browser event.
***REMOVED*** @private
***REMOVED***
goog.ui.Ratings.prototype.onKeyDown_ = function(e) {
  switch (e.keyCode) {
    case 27: // esc
      this.setSelectedIndex(-1);
      break;
    case 36: // home
      this.setSelectedIndex(0);
      break;
    case 35: // end
      this.setSelectedIndex(this.ratings_.length);
      break;
    case 37: // left arrow
      this.setSelectedIndex(this.getSelectedIndex() - 1);
      break;
    case 39: // right arrow
      this.setSelectedIndex(this.getSelectedIndex() + 1);
      break;
    default:
      // Detected a numeric key stroke, such as 0 - 9.  0 clears, 1 is first
      // star, 9 is 9th star or last if there are less than 9 stars.
      var num = parseInt(String.fromCharCode(e.keyCode), 10);
      if (!isNaN(num)) {
        this.setSelectedIndex(num - 1);
      }
  }
***REMOVED***


***REMOVED***
***REMOVED*** Highlights the ratings up to the selected index
***REMOVED*** @param {number} n Index to highlight.
***REMOVED*** @private
***REMOVED***
goog.ui.Ratings.prototype.highlightIndex_ = function(n) {
  for (var i = 0, star; star = this.stars_[i]; i++) {
    goog.dom.classes.set(star, this.getClassName_(i, i <= n));
  }
***REMOVED***


***REMOVED***
***REMOVED*** Get the class name for a given rating.  All stars have the class:
***REMOVED*** goog-ratings-star.
***REMOVED*** Other possible classnames dependent on position and state are:
***REMOVED*** goog-ratings-firststar-on
***REMOVED*** goog-ratings-firststar-off
***REMOVED*** goog-ratings-midstar-on
***REMOVED*** goog-ratings-midstar-off
***REMOVED*** goog-ratings-laststar-on
***REMOVED*** goog-ratings-laststar-off
***REMOVED*** @param {number} i Index to get class name for.
***REMOVED*** @param {boolean} on Whether it should be on.
***REMOVED*** @return {string} The class name.
***REMOVED*** @private
***REMOVED***
goog.ui.Ratings.prototype.getClassName_ = function(i, on) {
  var className;
  var baseClass = this.getCssClass();

  if (i === 0) {
    className = goog.getCssName(baseClass, 'firststar');
  } else if (i == this.ratings_.length - 1) {
    className = goog.getCssName(baseClass, 'laststar');
  } else {
    className = goog.getCssName(baseClass, 'midstar');
  }

  if (on) {
    className = goog.getCssName(className, 'on');
  } else {
    className = goog.getCssName(className, 'off');
  }

  return goog.getCssName(baseClass, 'star') + ' ' + className;
***REMOVED***


