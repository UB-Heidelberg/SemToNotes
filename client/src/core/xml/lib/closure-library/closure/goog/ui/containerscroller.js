// Copyright 2008 The Closure Library Authors. All Rights Reserved.
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
***REMOVED*** @fileoverview Scroll behavior that can be added onto a container.
***REMOVED*** @author gboyer@google.com (Garry Boyer)
***REMOVED***

goog.provide('goog.ui.ContainerScroller');

goog.require('goog.Timer');
goog.require('goog.events.EventHandler');
goog.require('goog.style');
goog.require('goog.ui.Component');
goog.require('goog.ui.Component.EventType');
goog.require('goog.ui.Container.EventType');



***REMOVED***
***REMOVED*** Plug-on scrolling behavior for a container.
***REMOVED***
***REMOVED*** Use this to style containers, such as pop-up menus, to be scrolling, and
***REMOVED*** automatically keep the highlighted element visible.
***REMOVED***
***REMOVED*** To use this, first style your container with the desired overflow
***REMOVED*** properties and height to achieve vertical scrolling.  Also, the scrolling
***REMOVED*** div should have no vertical padding, for two reasons: it is difficult to
***REMOVED*** compensate for, and is generally not what you want due to the strange way
***REMOVED*** CSS handles padding on the scrolling dimension.
***REMOVED***
***REMOVED*** The container must already be rendered before this may be constructed.
***REMOVED***
***REMOVED*** @param {!goog.ui.Container} container The container to attach behavior to.
***REMOVED***
***REMOVED*** @extends {goog.Disposable}
***REMOVED***
goog.ui.ContainerScroller = function(container) {
  goog.Disposable.call(this);

 ***REMOVED*****REMOVED***
  ***REMOVED*** The container that we are bestowing scroll behavior on.
  ***REMOVED*** @type {!goog.ui.Container}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.container_ = container;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Event handler for this object.
  ***REMOVED*** @type {!goog.events.EventHandler}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.eventHandler_ = new goog.events.EventHandler(this);

  this.eventHandler_.listen(container, goog.ui.Component.EventType.HIGHLIGHT,
      this.onHighlight_);
  this.eventHandler_.listen(container, goog.ui.Component.EventType.ENTER,
      this.onEnter_);
  this.eventHandler_.listen(container, goog.ui.Container.EventType.AFTER_SHOW,
      this.onAfterShow_);
  this.eventHandler_.listen(container, goog.ui.Component.EventType.HIDE,
      this.onHide_);

  // TODO(gboyer): Allow a ContainerScroller to be attached with a Container
  // before the container is rendered.

  this.doScrolling_(true);
***REMOVED***
goog.inherits(goog.ui.ContainerScroller, goog.Disposable);


***REMOVED***
***REMOVED*** The last target the user hovered over.
***REMOVED***
***REMOVED*** @see #onEnter_
***REMOVED*** @type {goog.ui.Component}
***REMOVED*** @private
***REMOVED***
goog.ui.ContainerScroller.prototype.lastEnterTarget_ = null;


***REMOVED***
***REMOVED*** The scrollTop of the container before it was hidden.
***REMOVED*** Used to restore the scroll position when the container is shown again.
***REMOVED*** @type {?number}
***REMOVED*** @private
***REMOVED***
goog.ui.ContainerScroller.prototype.scrollTopBeforeHide_ = null;


***REMOVED***
***REMOVED*** Whether we are disabling the default handler for hovering.
***REMOVED***
***REMOVED*** @see #onEnter_
***REMOVED*** @see #temporarilyDisableHover_
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.ui.ContainerScroller.prototype.disableHover_ = false;


***REMOVED***
***REMOVED*** Handles hover events on the container's children.
***REMOVED***
***REMOVED*** Helps enforce two constraints: scrolling should not cause mouse highlights,
***REMOVED*** and mouse highlights should not cause scrolling.
***REMOVED***
***REMOVED*** @param {goog.events.Event} e The container's ENTER event.
***REMOVED*** @private
***REMOVED***
goog.ui.ContainerScroller.prototype.onEnter_ = function(e) {
  if (this.disableHover_) {
    // The container was scrolled recently.  Since the mouse may be over the
    // container, stop the default action of the ENTER event from causing
    // highlights.
    e.preventDefault();
  } else {
    // The mouse is moving and causing hover events.  Stop the resulting
    // highlight (if it happens) from causing a scroll.
    this.lastEnterTarget_ =***REMOVED*****REMOVED*** @type {goog.ui.Component}***REMOVED*** (e.target);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Handles highlight events on the container's children.
***REMOVED*** @param {goog.events.Event} e The container's highlight event.
***REMOVED*** @private
***REMOVED***
goog.ui.ContainerScroller.prototype.onHighlight_ = function(e) {
  this.doScrolling_();
***REMOVED***


***REMOVED***
***REMOVED*** Handles AFTER_SHOW events on the container. Makes the container
***REMOVED*** scroll to the previously scrolled position (if there was one),
***REMOVED*** then adjust it to make the highlighted element be in view (if there is one).
***REMOVED*** If there was no previous scroll position, then center the highlighted
***REMOVED*** element (if there is one).
***REMOVED*** @param {goog.events.Event} e The container's AFTER_SHOW event.
***REMOVED*** @private
***REMOVED***
goog.ui.ContainerScroller.prototype.onAfterShow_ = function(e) {
  if (this.scrollTopBeforeHide_ != null) {
    this.container_.getElement().scrollTop = this.scrollTopBeforeHide_;
    // Make sure the highlighted item is still visible, in case the list
    // or its hilighted item has changed.
    this.doScrolling_(false);
  } else {
    this.doScrolling_(true);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Handles hide events on the container. Clears out the last enter target,
***REMOVED*** since it is no longer applicable, and remembers the scroll position of
***REMOVED*** the menu so that it can be restored when the menu is reopened.
***REMOVED*** @param {goog.events.Event} e The container's hide event.
***REMOVED*** @private
***REMOVED***
goog.ui.ContainerScroller.prototype.onHide_ = function(e) {
  if (e.target == this.container_) {
    this.lastEnterTarget_ = null;
    this.scrollTopBeforeHide_ = this.container_.getElement().scrollTop;
  }
***REMOVED***


***REMOVED***
***REMOVED*** Centers the currently highlighted item, if this is scrollable.
***REMOVED*** @param {boolean=} opt_center Whether to center the highlighted element
***REMOVED***     rather than simply ensure it is in view.  Useful for the first
***REMOVED***     render.
***REMOVED*** @private
***REMOVED***
goog.ui.ContainerScroller.prototype.doScrolling_ = function(opt_center) {
  var highlighted = this.container_.getHighlighted();

  // Only scroll if we're visible and there is a highlighted item.
  if (this.container_.isVisible() && highlighted &&
      highlighted != this.lastEnterTarget_) {
    var element = this.container_.getElement();
    goog.style.scrollIntoContainerView(highlighted.getElement(), element,
        opt_center);
    this.temporarilyDisableHover_();
    this.lastEnterTarget_ = null;
  }
***REMOVED***


***REMOVED***
***REMOVED*** Temporarily disables hover events from changing highlight.
***REMOVED*** @see #onEnter_
***REMOVED*** @private
***REMOVED***
goog.ui.ContainerScroller.prototype.temporarilyDisableHover_ = function() {
  this.disableHover_ = true;
  goog.Timer.callOnce(function() {
    this.disableHover_ = false;
  }, 0, this);
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.ui.ContainerScroller.prototype.disposeInternal = function() {
  goog.ui.ContainerScroller.superClass_.disposeInternal.call(this);
  this.eventHandler_.dispose();
  this.lastEnterTarget_ = null;
***REMOVED***
