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
***REMOVED*** @fileoverview Abstract Base Class for Drag and Drop.
***REMOVED***
***REMOVED*** Provides functionality for implementing drag and drop classes. Also provides
***REMOVED*** support classes and events.
***REMOVED***
***REMOVED*** @author eae@google.com (Emil A Eklund)
***REMOVED***

goog.provide('goog.fx.AbstractDragDrop');
goog.provide('goog.fx.AbstractDragDrop.EventType');
goog.provide('goog.fx.DragDropEvent');
goog.provide('goog.fx.DragDropItem');

goog.require('goog.dom');
goog.require('goog.dom.classes');
***REMOVED***
goog.require('goog.events.Event');
goog.require('goog.events.EventHandler');
goog.require('goog.events.EventTarget');
***REMOVED***
goog.require('goog.fx.Dragger');
goog.require('goog.fx.Dragger.EventType');
goog.require('goog.math.Box');
goog.require('goog.math.Coordinate');
goog.require('goog.style');



***REMOVED***
***REMOVED*** Abstract class that provides reusable functionality for implementing drag
***REMOVED*** and drop functionality.
***REMOVED***
***REMOVED*** This class also allows clients to define their own subtargeting function
***REMOVED*** so that drop areas can have finer granularity then a singe element. This is
***REMOVED*** accomplished by using a client provided function to map from element and
***REMOVED*** coordinates to a subregion id.
***REMOVED***
***REMOVED*** This class can also be made aware of scrollable containers that contain
***REMOVED*** drop targets by calling addScrollableContainer. This will cause dnd to
***REMOVED*** take changing scroll positions into account while a drag is occuring.
***REMOVED***
***REMOVED*** @extends {goog.events.EventTarget}
***REMOVED***
***REMOVED***
goog.fx.AbstractDragDrop = function() {
  goog.base(this);

 ***REMOVED*****REMOVED***
  ***REMOVED*** List of items that makes up the drag source or drop target.
  ***REMOVED*** @type {Array.<goog.fx.DragDropItem>}
  ***REMOVED*** @protected
  ***REMOVED*** @suppress {underscore}
 ***REMOVED*****REMOVED***
  this.items_ = [];

 ***REMOVED*****REMOVED***
  ***REMOVED*** List of associated drop targets.
  ***REMOVED*** @type {Array.<goog.fx.AbstractDragDrop>}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.targets_ = [];

 ***REMOVED*****REMOVED***
  ***REMOVED*** Scrollable containers to account for during drag
  ***REMOVED*** @type {Array.<goog.fx.ScrollableContainer_>}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.scrollableContainers_ = [];

***REMOVED***
goog.inherits(goog.fx.AbstractDragDrop, goog.events.EventTarget);


***REMOVED***
***REMOVED*** Minimum size (in pixels) for a dummy target. If the box for the target is
***REMOVED*** less than the specified size it's not created.
***REMOVED*** @type {number}
***REMOVED*** @private
***REMOVED***
goog.fx.AbstractDragDrop.DUMMY_TARGET_MIN_SIZE_ = 10;


***REMOVED***
***REMOVED*** Flag indicating if it's a drag source, set by addTarget.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.fx.AbstractDragDrop.prototype.isSource_ = false;


***REMOVED***
***REMOVED*** Flag indicating if it's a drop target, set when added as target to another
***REMOVED*** DragDrop object.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.fx.AbstractDragDrop.prototype.isTarget_ = false;


***REMOVED***
***REMOVED*** Subtargeting function accepting args:
***REMOVED*** (Element, goog.math.Box, number, number)
***REMOVED*** @type {Function}
***REMOVED*** @private
***REMOVED***
goog.fx.AbstractDragDrop.prototype.subtargetFunction_;


***REMOVED***
***REMOVED*** Last active subtarget.
***REMOVED*** @type {Object}
***REMOVED*** @private
***REMOVED***
goog.fx.AbstractDragDrop.prototype.activeSubtarget_;


***REMOVED***
***REMOVED*** Class name to add to source elements being dragged. Set by setDragClass.
***REMOVED*** @type {?string}
***REMOVED*** @private
***REMOVED***
goog.fx.AbstractDragDrop.prototype.dragClass_;


***REMOVED***
***REMOVED*** Class name to add to source elements. Set by setSourceClass.
***REMOVED*** @type {?string}
***REMOVED*** @private
***REMOVED***
goog.fx.AbstractDragDrop.prototype.sourceClass_;


***REMOVED***
***REMOVED*** Class name to add to target elements. Set by setTargetClass.
***REMOVED*** @type {?string}
***REMOVED*** @private
***REMOVED***
goog.fx.AbstractDragDrop.prototype.targetClass_;


***REMOVED***
***REMOVED*** The SCROLL event target used to make drag element follow scrolling.
***REMOVED*** @type {EventTarget}
***REMOVED*** @private
***REMOVED***
goog.fx.AbstractDragDrop.prototype.scrollTarget_;


***REMOVED***
***REMOVED*** Dummy target, {@see maybeCreateDummyTargetForPosition_}.
***REMOVED*** @type {goog.fx.ActiveDropTarget_}
***REMOVED*** @private
***REMOVED***
goog.fx.AbstractDragDrop.prototype.dummyTarget_;


***REMOVED***
***REMOVED*** Whether the object has been initialized.
***REMOVED*** @type {boolean}
***REMOVED*** @private
***REMOVED***
goog.fx.AbstractDragDrop.prototype.initialized_ = false;


***REMOVED***
***REMOVED*** Constants for event names
***REMOVED*** @type {Object}
***REMOVED***
goog.fx.AbstractDragDrop.EventType = {
  DRAGOVER: 'dragover',
  DRAGOUT: 'dragout',
  DRAG: 'drag',
  DROP: 'drop',
  DRAGSTART: 'dragstart',
  DRAGEND: 'dragend'
***REMOVED***


***REMOVED***
***REMOVED*** Constant for distance threshold, in pixels, an element has to be moved to
***REMOVED*** initiate a drag operation.
***REMOVED*** @type {number}
***REMOVED***
goog.fx.AbstractDragDrop.initDragDistanceThreshold = 5;


***REMOVED***
***REMOVED*** Set class to add to source elements being dragged.
***REMOVED***
***REMOVED*** @param {string} className Class to be added.
***REMOVED***
goog.fx.AbstractDragDrop.prototype.setDragClass = function(className) {
  this.dragClass_ = className;
***REMOVED***


***REMOVED***
***REMOVED*** Set class to add to source elements.
***REMOVED***
***REMOVED*** @param {string} className Class to be added.
***REMOVED***
goog.fx.AbstractDragDrop.prototype.setSourceClass = function(className) {
  this.sourceClass_ = className;
***REMOVED***


***REMOVED***
***REMOVED*** Set class to add to target elements.
***REMOVED***
***REMOVED*** @param {string} className Class to be added.
***REMOVED***
goog.fx.AbstractDragDrop.prototype.setTargetClass = function(className) {
  this.targetClass_ = className;
***REMOVED***


***REMOVED***
***REMOVED*** Whether the control has been initialized.
***REMOVED***
***REMOVED*** @return {boolean} True if it's been initialized.
***REMOVED***
goog.fx.AbstractDragDrop.prototype.isInitialized = function() {
  return this.initialized_;
***REMOVED***


***REMOVED***
***REMOVED*** Add item to drag object.
***REMOVED***
***REMOVED*** @param {Element|string} element Dom Node, or string representation of node
***REMOVED***     id, to be used as drag source/drop target.
***REMOVED*** @throws Error Thrown if called on instance of abstract class
***REMOVED***
goog.fx.AbstractDragDrop.prototype.addItem = goog.abstractMethod;


***REMOVED***
***REMOVED*** Associate drop target with drag element.
***REMOVED***
***REMOVED*** @param {goog.fx.AbstractDragDrop} target Target to add.
***REMOVED***
goog.fx.AbstractDragDrop.prototype.addTarget = function(target) {
  this.targets_.push(target);
  target.isTarget_ = true;
  this.isSource_ = true;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the SCROLL event target to make drag element follow scrolling.
***REMOVED***
***REMOVED*** @param {EventTarget} scrollTarget The element that dispatches SCROLL events.
***REMOVED***
goog.fx.AbstractDragDrop.prototype.setScrollTarget = function(scrollTarget) {
  this.scrollTarget_ = scrollTarget;
***REMOVED***


***REMOVED***
***REMOVED*** Initialize drag and drop functionality for sources/targets already added.
***REMOVED*** Sources/targets added after init has been called will initialize themselves
***REMOVED*** one by one.
***REMOVED***
goog.fx.AbstractDragDrop.prototype.init = function() {
  if (this.initialized_) {
    return;
  }
  for (var item, i = 0; item = this.items_[i]; i++) {
    this.initItem(item);
  }

  this.initialized_ = true;
***REMOVED***


***REMOVED***
***REMOVED*** Initializes a single item.
***REMOVED***
***REMOVED*** @param {goog.fx.DragDropItem} item Item to initialize.
***REMOVED*** @protected
***REMOVED***
goog.fx.AbstractDragDrop.prototype.initItem = function(item) {
  if (this.isSource_) {
  ***REMOVED***item.element, goog.events.EventType.MOUSEDOWN,
                       item.mouseDown_, false, item);
    if (this.sourceClass_) {
      goog.dom.classes.add(item.element, this.sourceClass_);
    }
  }

  if (this.isTarget_ && this.targetClass_) {
    goog.dom.classes.add(item.element, this.targetClass_);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Called when removing an item. Removes event listeners and classes.
***REMOVED***
***REMOVED*** @param {goog.fx.DragDropItem} item Item to dispose.
***REMOVED*** @protected
***REMOVED***
goog.fx.AbstractDragDrop.prototype.disposeItem = function(item) {
  if (this.isSource_) {
    goog.events.unlisten(item.element, goog.events.EventType.MOUSEDOWN,
                         item.mouseDown_, false, item);
    if (this.sourceClass_) {
      goog.dom.classes.remove(item.element, this.sourceClass_);
    }
  }
  if (this.isTarget_ && this.targetClass_) {
    goog.dom.classes.remove(item.element, this.targetClass_);
  }
  item.dispose();
***REMOVED***


***REMOVED***
***REMOVED*** Removes all items.
***REMOVED***
goog.fx.AbstractDragDrop.prototype.removeItems = function() {
  for (var item, i = 0; item = this.items_[i]; i++) {
    this.disposeItem(item);
  }
  this.items_.length = 0;
***REMOVED***


***REMOVED***
***REMOVED*** Starts a drag event for an item if the mouse button stays pressed and the
***REMOVED*** cursor moves a few pixels. Allows dragging of items without first having to
***REMOVED*** register them with addItem.
***REMOVED***
***REMOVED*** @param {goog.events.BrowserEvent} event Mouse down event.
***REMOVED*** @param {goog.fx.DragDropItem} item Item that's being dragged.
***REMOVED***
goog.fx.AbstractDragDrop.prototype.maybeStartDrag = function(event, item) {
  item.maybeStartDrag_(event, item.element);
***REMOVED***


***REMOVED***
***REMOVED*** Event handler that's used to start drag.
***REMOVED***
***REMOVED*** @param {goog.events.BrowserEvent} event Mouse move event.
***REMOVED*** @param {goog.fx.DragDropItem} item Item that's being dragged.
***REMOVED***
goog.fx.AbstractDragDrop.prototype.startDrag = function(event, item) {

  // Prevent a new drag operation from being started if another one is already
  // in progress (could happen if the mouse was released outside of the
  // document).
  if (this.dragItem_) {
    return;
  }

  this.dragItem_ = item;

  // Dispatch DRAGSTART event
  var dragStartEvent = new goog.fx.DragDropEvent(
      goog.fx.AbstractDragDrop.EventType.DRAGSTART, this, this.dragItem_);
  if (this.dispatchEvent(dragStartEvent) == false) {
    this.dragItem_ = null;
    return;
  }

  // Get the source element and create a drag element for it.
  var el = item.getCurrentDragElement();
  this.dragEl_ = this.createDragElement(el);
  var doc = goog.dom.getOwnerDocument(el);
  doc.body.appendChild(this.dragEl_);

  this.dragger_ = this.createDraggerFor(el, this.dragEl_, event);
  this.dragger_.setScrollTarget(this.scrollTarget_);

***REMOVED***this.dragger_, goog.fx.Dragger.EventType.DRAG,
                     this.moveDrag_, false, this);

***REMOVED***this.dragger_, goog.fx.Dragger.EventType.END,
                     this.endDrag, false, this);

  // IE may issue a 'selectstart' event when dragging over an iframe even when
  // default mousemove behavior is suppressed. If the default selectstart
  // behavior is not suppressed, elements dragged over will show as selected.
***REMOVED***doc.body, goog.events.EventType.SELECTSTART,
                     this.suppressSelect_);

  this.recalculateDragTargets();
  this.recalculateScrollableContainers();
  this.activeTarget_ = null;
  this.initScrollableContainerListeners_();
  this.dragger_.startDrag(event);

  event.preventDefault();
***REMOVED***


***REMOVED***
***REMOVED*** Recalculates the geometry of this source's drag targets.  Call this
***REMOVED*** if the position or visibility of a drag target has changed during
***REMOVED*** a drag, or if targets are added or removed.
***REMOVED***
***REMOVED*** TODO(user): this is an expensive operation;  more efficient APIs
***REMOVED*** may be necessary.
***REMOVED***
goog.fx.AbstractDragDrop.prototype.recalculateDragTargets = function() {
  this.targetList_ = [];
  for (var target, i = 0; target = this.targets_[i]; i++) {
    for (var itm, j = 0; itm = target.items_[j]; j++) {
      this.addDragTarget_(target, itm);
    }
  }
  if (!this.targetBox_) {
    this.targetBox_ = new goog.math.Box(0, 0, 0, 0);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Recalculates the current scroll positions of scrollable containers and
***REMOVED*** allocates targets. Call this if the position of a container changed or if
***REMOVED*** targets are added or removed.
***REMOVED***
goog.fx.AbstractDragDrop.prototype.recalculateScrollableContainers =
    function() {
  var container, i, j, target;
  for (i = 0; container = this.scrollableContainers_[i]; i++) {
    container.containedTargets_ = [];
    container.savedScrollLeft_ = container.element_.scrollLeft;
    container.savedScrollTop_ = container.element_.scrollTop;
    var pos = goog.style.getPageOffset(container.element_);
    var size = goog.style.getSize(container.element_);
    container.box_ = new goog.math.Box(pos.y, pos.x + size.width,
                                       pos.y + size.height, pos.x);
  }

  for (i = 0; target = this.targetList_[i]; i++) {
    for (j = 0; container = this.scrollableContainers_[j]; j++) {
      if (goog.dom.contains(container.element_, target.element_)) {
        container.containedTargets_.push(target);
        target.scrollableContainer_ = container;
      }
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** Creates the Dragger for the drag element.
***REMOVED*** @param {Element} sourceEl Drag source element.
***REMOVED*** @param {Element} el the element created by createDragElement().
***REMOVED*** @param {goog.events.BrowserEvent} event Mouse down event for start of drag.
***REMOVED*** @return {goog.fx.Dragger} The new Dragger.
***REMOVED*** @protected
***REMOVED***
goog.fx.AbstractDragDrop.prototype.createDraggerFor =
    function(sourceEl, el, event) {
  // Position the drag element.
  var pos = this.getDragElementPosition(sourceEl, el, event);
  el.style.position = 'absolute';
  el.style.left = pos.x + 'px';
  el.style.top = pos.y + 'px';
  return new goog.fx.Dragger(el);
***REMOVED***


***REMOVED***
***REMOVED*** Event handler that's used to stop drag. Fires a drop event if over a valid
***REMOVED*** target.
***REMOVED***
***REMOVED*** @param {goog.fx.DragEvent} event Drag event.
***REMOVED***
goog.fx.AbstractDragDrop.prototype.endDrag = function(event) {
  var activeTarget = event.dragCanceled ? null : this.activeTarget_;
  if (activeTarget && activeTarget.target_) {
    var clientX = event.clientX;
    var clientY = event.clientY;
    var scroll = this.getScrollPos();
    var x = clientX + scroll.x;
    var y = clientY + scroll.y;

    var subtarget;
    // If a subtargeting function is enabled get the current subtarget
    if (this.subtargetFunction_) {
      subtarget = this.subtargetFunction_(activeTarget.item_,
          activeTarget.box_, x, y);
    }

    var dragEvent = new goog.fx.DragDropEvent(
        goog.fx.AbstractDragDrop.EventType.DRAG, this, this.dragItem_,
        activeTarget.target_, activeTarget.item_, activeTarget.element_,
        clientX, clientY, x, y);
    this.dispatchEvent(dragEvent);

    var dropEvent = new goog.fx.DragDropEvent(
        goog.fx.AbstractDragDrop.EventType.DROP, this, this.dragItem_,
        activeTarget.target_, activeTarget.item_, activeTarget.element_,
        clientX, clientY, x, y, subtarget);
    activeTarget.target_.dispatchEvent(dropEvent);
  }

  var dragEndEvent = new goog.fx.DragDropEvent(
      goog.fx.AbstractDragDrop.EventType.DRAGEND, this, this.dragItem_);
  this.dispatchEvent(dragEndEvent);

  goog.events.unlisten(this.dragger_, goog.fx.Dragger.EventType.DRAG,
                       this.moveDrag_, false, this);
  goog.events.unlisten(this.dragger_, goog.fx.Dragger.EventType.END,
                       this.endDrag, false, this);
  var doc = goog.dom.getOwnerDocument(this.dragItem_.getCurrentDragElement());
  goog.events.unlisten(doc.body, goog.events.EventType.SELECTSTART,
                       this.suppressSelect_);


  this.afterEndDrag(this.activeTarget_ ? this.activeTarget_.item_ : null);
***REMOVED***


***REMOVED***
***REMOVED*** Called after a drag operation has finished.
***REMOVED***
***REMOVED*** @param {goog.fx.DragDropItem=} opt_dropTarget Target for successful drop.
***REMOVED*** @protected
***REMOVED***
goog.fx.AbstractDragDrop.prototype.afterEndDrag = function(opt_dropTarget) {
  this.disposeDrag();
***REMOVED***


***REMOVED***
***REMOVED*** Called once a drag operation has finished. Removes event listeners and
***REMOVED*** elements.
***REMOVED***
***REMOVED*** @protected
***REMOVED***
goog.fx.AbstractDragDrop.prototype.disposeDrag = function() {
  this.disposeScrollableContainerListeners_();
  this.dragger_.dispose();

  goog.dom.removeNode(this.dragEl_);
  delete this.dragItem_;
  delete this.dragEl_;
  delete this.dragger_;
  delete this.targetList_;
  delete this.activeTarget_;
***REMOVED***


***REMOVED***
***REMOVED*** Event handler for drag events. Determines the active drop target, if any, and
***REMOVED*** fires dragover and dragout events appropriately.
***REMOVED***
***REMOVED*** @param {goog.fx.DragEvent} event Drag event.
***REMOVED*** @private
***REMOVED***
goog.fx.AbstractDragDrop.prototype.moveDrag_ = function(event) {
  var position = this.getEventPosition(event);
  var x = position.x;
  var y = position.y;

  // Check if we're still inside the bounds of the active target, if not fire
  // a dragout event and proceed to find a new target.
  var activeTarget = this.activeTarget_;

  var subtarget;
  if (activeTarget) {
    // If a subtargeting function is enabled get the current subtarget
    if (this.subtargetFunction_ && activeTarget.target_) {
      subtarget = this.subtargetFunction_(activeTarget.item_,
          activeTarget.box_, x, y);
    }

    if (activeTarget.box_.contains(position) &&
        subtarget == this.activeSubtarget_) {
      return;
    }

    if (activeTarget.target_) {
      var sourceDragOutEvent = new goog.fx.DragDropEvent(
          goog.fx.AbstractDragDrop.EventType.DRAGOUT, this, this.dragItem_,
          activeTarget.target_, activeTarget.item_, activeTarget.element_);
      this.dispatchEvent(sourceDragOutEvent);

      // The event should be dispatched the by target DragDrop so that the
      // target DragDrop can manage these events without having to know what
      // sources this is a target for.
      var targetDragOutEvent = new goog.fx.DragDropEvent(
          goog.fx.AbstractDragDrop.EventType.DRAGOUT,
          this,
          this.dragItem_,
          activeTarget.target_,
          activeTarget.item_,
          activeTarget.element_,
          undefined,
          undefined,
          undefined,
          undefined,
          this.activeSubtarget_);
      activeTarget.target_.dispatchEvent(targetDragOutEvent);
    }
    this.activeSubtarget_ = subtarget;
    this.activeTarget_ = null;
  }

  // Check if inside target box
  if (this.targetBox_.contains(position)) {
    // Search for target and fire a dragover event if found
    activeTarget = this.activeTarget_ = this.getTargetFromPosition_(position);
    if (activeTarget && activeTarget.target_) {
      // If a subtargeting function is enabled get the current subtarget
      if (this.subtargetFunction_) {
        subtarget = this.subtargetFunction_(activeTarget.item_,
            activeTarget.box_, x, y);
      }
      var sourceDragOverEvent = new goog.fx.DragDropEvent(
          goog.fx.AbstractDragDrop.EventType.DRAGOVER, this, this.dragItem_,
          activeTarget.target_, activeTarget.item_, activeTarget.element_);
      sourceDragOverEvent.subtarget = subtarget;
      this.dispatchEvent(sourceDragOverEvent);

      // The event should be dispatched by the target DragDrop so that the
      // target DragDrop can manage these events without having to know what
      // sources this is a target for.
      var targetDragOverEvent = new goog.fx.DragDropEvent(
          goog.fx.AbstractDragDrop.EventType.DRAGOVER, this, this.dragItem_,
          activeTarget.target_, activeTarget.item_, activeTarget.element_,
          event.clientX, event.clientY, undefined, undefined, subtarget);
      activeTarget.target_.dispatchEvent(targetDragOverEvent);

    } else if (!activeTarget) {
      // If no target was found create a dummy one so we won't have to iterate
      // over all possible targets for every move event.
      this.activeTarget_ = this.maybeCreateDummyTargetForPosition_(x, y);
    }
  }
***REMOVED***


***REMOVED***
***REMOVED*** Event handler for suppressing selectstart events. Selecting should be
***REMOVED*** disabled while dragging.
***REMOVED***
***REMOVED*** @param {goog.events.Event} event The selectstart event to suppress.
***REMOVED*** @return {boolean} Whether to perform default behavior.
***REMOVED*** @private
***REMOVED***
goog.fx.AbstractDragDrop.prototype.suppressSelect_ = function(event) {
  return false;
***REMOVED***


***REMOVED***
***REMOVED*** Sets up listeners for the scrollable containers that keep track of their
***REMOVED*** scroll positions.
***REMOVED*** @private
***REMOVED***
goog.fx.AbstractDragDrop.prototype.initScrollableContainerListeners_ =
    function() {
  var container, i;
  for (i = 0; container = this.scrollableContainers_[i]; i++) {
  ***REMOVED***container.element_, goog.events.EventType.SCROLL,
        this.containerScrollHandler_, false, this);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Cleans up the scrollable container listeners.
***REMOVED*** @private
***REMOVED***
goog.fx.AbstractDragDrop.prototype.disposeScrollableContainerListeners_ =
    function() {
  for (var i = 0, container; container = this.scrollableContainers_[i]; i++) {
    goog.events.unlisten(container.element_, 'scroll',
        this.containerScrollHandler_, false, this);
    container.containedTargets_ = [];
  }
***REMOVED***


***REMOVED***
***REMOVED*** Makes drag and drop aware of a target container that could scroll mid drag.
***REMOVED*** @param {Element} element The scroll container.
***REMOVED***
goog.fx.AbstractDragDrop.prototype.addScrollableContainer = function(element) {
  this.scrollableContainers_.push(new goog.fx.ScrollableContainer_(element));
***REMOVED***


***REMOVED***
***REMOVED*** Removes all scrollable containers.
***REMOVED***
goog.fx.AbstractDragDrop.prototype.removeAllScrollableContainers = function() {
  this.disposeScrollableContainerListeners_();
  this.scrollableContainers_ = [];
***REMOVED***


***REMOVED***
***REMOVED*** Event handler for containers scrolling.
***REMOVED*** @param {goog.events.Event} e The event.
***REMOVED*** @private
***REMOVED***
goog.fx.AbstractDragDrop.prototype.containerScrollHandler_ = function(e) {
  for (var i = 0, container; container = this.scrollableContainers_[i]; i++) {
    if (e.target == container.element_) {
      var deltaTop = container.savedScrollTop_ - container.element_.scrollTop;
      var deltaLeft =
          container.savedScrollLeft_ - container.element_.scrollLeft;
      container.savedScrollTop_ = container.element_.scrollTop;
      container.savedScrollLeft_ = container.element_.scrollLeft;

      // When the container scrolls, it's possible that one of the targets will
      // move to the region contained by the dummy target. Since we don't know
      // which sides (if any) of the dummy target are defined by targets
      // contained by this container, we are conservative and just shrink it.
      if (this.dummyTarget_ && this.activeTarget_ == this.dummyTarget_) {
        if (deltaTop > 0) {
          this.dummyTarget_.box_.top += deltaTop;
        } else {
          this.dummyTarget_.box_.bottom += deltaTop;
        }
        if (deltaLeft > 0) {
          this.dummyTarget_.box_.left += deltaLeft;
        } else {
          this.dummyTarget_.box_.right += deltaLeft;
        }
      }
      for (var j = 0, target; target = container.containedTargets_[j]; j++) {
        var box = target.box_;
        box.top += deltaTop;
        box.left += deltaLeft;
        box.bottom += deltaTop;
        box.right += deltaLeft;

        this.calculateTargetBox_(box);
      }
    }
  }
  this.dragger_.onScroll_(e);
***REMOVED***


***REMOVED***
***REMOVED*** Set a function that provides subtargets. A subtargeting function
***REMOVED*** returns an arbitrary identifier for each subtarget of an element.
***REMOVED*** DnD code will generate additional drag over / out events when
***REMOVED*** switching from subtarget to subtarget. This is useful for instance
***REMOVED*** if you are interested if you are on the top half or the bottom half
***REMOVED*** of the element.
***REMOVED*** The provided function will be given the DragDropItem, box, x, y
***REMOVED*** box is the current window coordinates occupied by element
***REMOVED*** x, y is the mouse position in window coordinates
***REMOVED***
***REMOVED*** @param {Function} f The new subtarget function.
***REMOVED***
goog.fx.AbstractDragDrop.prototype.setSubtargetFunction = function(f) {
  this.subtargetFunction_ = f;
***REMOVED***


***REMOVED***
***REMOVED*** Creates an element for the item being dragged.
***REMOVED***
***REMOVED*** @param {Element} sourceEl Drag source element.
***REMOVED*** @return {Element} The new drag element.
***REMOVED***
goog.fx.AbstractDragDrop.prototype.createDragElement = function(sourceEl) {
  var dragEl = this.cloneNode_(sourceEl);
  if (this.dragClass_) {
    goog.dom.classes.add(dragEl, this.dragClass_);
  }

  return dragEl;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the position for the drag element.
***REMOVED***
***REMOVED*** @param {Element} el Drag source element.
***REMOVED*** @param {Element} dragEl The dragged element created by createDragElement().
***REMOVED*** @param {goog.events.BrowserEvent} event Mouse down event for start of drag.
***REMOVED*** @return {goog.math.Coordinate} The position for the drag element.
***REMOVED***
goog.fx.AbstractDragDrop.prototype.getDragElementPosition =
    function(el, dragEl, event) {
  var pos = goog.style.getPageOffset(el);

  // Subtract margin from drag element position twice, once to adjust the
  // position given by the original node and once for the drag node.
  var marginBox = goog.style.getMarginBox(el);
  pos.x -= (marginBox.left || 0)***REMOVED*** 2;
  pos.y -= (marginBox.top || 0)***REMOVED*** 2;

  return pos;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the dragger object.
***REMOVED***
***REMOVED*** @return {goog.fx.Dragger} The dragger object used by this drag and drop
***REMOVED***     instance.
***REMOVED***
goog.fx.AbstractDragDrop.prototype.getDragger = function() {
  return this.dragger_;
***REMOVED***


***REMOVED***
***REMOVED*** Creates copy of node being dragged.
***REMOVED***
***REMOVED*** @param {Element} sourceEl Element to copy.
***REMOVED*** @return {Element} The clone of {@code sourceEl}.
***REMOVED*** @private
***REMOVED***
goog.fx.AbstractDragDrop.prototype.cloneNode_ = function(sourceEl) {
  var clonedEl =***REMOVED*****REMOVED*** @type {Element}***REMOVED*** (sourceEl.cloneNode(true));
  switch (sourceEl.tagName.toLowerCase()) {
    case 'tr':
      return goog.dom.createDom(
          'table', null, goog.dom.createDom('tbody', null, clonedEl));
    case 'td':
    case 'th':
      return goog.dom.createDom(
          'table', null, goog.dom.createDom('tbody', null, goog.dom.createDom(
          'tr', null, clonedEl)));
    default:
      return clonedEl;
  }
***REMOVED***


***REMOVED***
***REMOVED*** Add possible drop target for current drag operation.
***REMOVED***
***REMOVED*** @param {goog.fx.AbstractDragDrop} target Drag handler.
***REMOVED*** @param {goog.fx.DragDropItem} item Item that's being dragged.
***REMOVED*** @private
***REMOVED***
goog.fx.AbstractDragDrop.prototype.addDragTarget_ = function(target, item) {

  // Get all the draggable elements and add each one.
  var draggableElements = item.getDraggableElements();
  var targetList = this.targetList_;
  for (var i = 0; i < draggableElements.length; i++) {
    var draggableElement = draggableElements[i];

    // Determine target position and dimension
    var pos = goog.style.getPageOffset(draggableElement);
    var size = goog.style.getSize(draggableElement);

    var box = new goog.math.Box(pos.y, pos.x + size.width,
                                pos.y + size.height, pos.x);

    targetList.push(
        new goog.fx.ActiveDropTarget_(box, target, item, draggableElement));

    this.calculateTargetBox_(box);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Calculate the outer bounds (the region all targets are inside).
***REMOVED***
***REMOVED*** @param {goog.math.Box} box Box describing the position and dimension
***REMOVED***     of a drag target.
***REMOVED*** @private
***REMOVED***
goog.fx.AbstractDragDrop.prototype.calculateTargetBox_ = function(box) {
  if (this.targetList_.length == 1) {
    this.targetBox_ = new goog.math.Box(box.top, box.right,
                                        box.bottom, box.left);
  } else {
    var tb = this.targetBox_;
    tb.left = Math.min(box.left, tb.left);
    tb.right = Math.max(box.right, tb.right);
    tb.top = Math.min(box.top, tb.top);
    tb.bottom = Math.max(box.bottom, tb.bottom);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Creates a dummy target for the given cursor position. The assumption is to
***REMOVED*** create as big dummy target box as possible, the only constraints are:
***REMOVED*** - The dummy target box cannot overlap any of real target boxes.
***REMOVED*** - The dummy target has to contain a point with current mouse coordinates.
***REMOVED***
***REMOVED*** NOTE: For performance reasons the box construction algorithm is kept simple
***REMOVED*** and it is not optimal (see example below). Currently it is O(n) in regard to
***REMOVED*** the number of real drop target boxes, but its result depends on the order
***REMOVED*** of those boxes being processed (the order in which they're added to the
***REMOVED*** targetList_ collection).
***REMOVED***
***REMOVED*** The algorithm.
***REMOVED*** a) Assumptions
***REMOVED*** - Mouse pointer is in the bounding box of real target boxes.
***REMOVED*** - None of the boxes have negative coordinate values.
***REMOVED*** - Mouse pointer is not contained by any of "real target" boxes.
***REMOVED*** - For targets inside a scrollable container, the box used is the
***REMOVED***   intersection of the scrollable container's box and the target's box.
***REMOVED***   This is because the part of the target that extends outside the scrollable
***REMOVED***   container should not be used in the clipping calculations.
***REMOVED***
***REMOVED*** b) Outline
***REMOVED*** - Initialize the fake target to the bounding box of real targets.
***REMOVED*** - For each real target box - clip the fake target box so it does not contain
***REMOVED***   that target box, but does contain the mouse pointer.
***REMOVED***   -- Project the real target box, mouse pointer and fake target box onto
***REMOVED***      both axes and calculate the clipping coordinates.
***REMOVED***   -- Only one coordinate is used to clip the fake target box to keep the
***REMOVED***      fake target as big as possible.
***REMOVED***   -- If the projection of the real target box contains the mouse pointer,
***REMOVED***      clipping for a given axis is not possible.
***REMOVED***   -- If both clippings are possible, the clipping more distant from the
***REMOVED***      mouse pointer is selected to keep bigger fake target area.
***REMOVED*** - Save the created fake target only if it has a big enough area.
***REMOVED***
***REMOVED***
***REMOVED*** c) Example
***REMOVED*** <pre>
***REMOVED***        Input:           Algorithm created box:        Maximum box:
***REMOVED*** +---------------------+ +---------------------+ +---------------------+
***REMOVED*** | B1      |        B2 | | B1               B2 | | B1               B2 |
***REMOVED*** |         |           | |   +-------------+   | |+-------------------+|
***REMOVED*** |---------x-----------| |   |             |   | ||                   ||
***REMOVED*** |         |           | |   |             |   | ||                   ||
***REMOVED*** |         |           | |   |             |   | ||                   ||
***REMOVED*** |         |           | |   |             |   | ||                   ||
***REMOVED*** |         |           | |   |             |   | ||                   ||
***REMOVED*** |         |           | |   +-------------+   | |+-------------------+|
***REMOVED*** | B4      |        B3 | | B4               B3 | | B4               B3 |
***REMOVED*** +---------------------+ +---------------------+ +---------------------+
***REMOVED*** </pre>
***REMOVED***
***REMOVED*** @param {number} x Cursor position on the x-axis.
***REMOVED*** @param {number} y Cursor position on the y-axis.
***REMOVED*** @return {goog.fx.ActiveDropTarget_} Dummy drop target.
***REMOVED*** @private
***REMOVED***
goog.fx.AbstractDragDrop.prototype.maybeCreateDummyTargetForPosition_ =
    function(x, y) {
  if (!this.dummyTarget_) {
    this.dummyTarget_ = new goog.fx.ActiveDropTarget_(this.targetBox_.clone());
  }
  var fakeTargetBox = this.dummyTarget_.box_;

  // Initialize the fake target box to the bounding box of DnD targets.
  fakeTargetBox.top = this.targetBox_.top;
  fakeTargetBox.right = this.targetBox_.right;
  fakeTargetBox.bottom = this.targetBox_.bottom;
  fakeTargetBox.left = this.targetBox_.left;

  // Clip the fake target based on mouse position and DnD target boxes.
  for (var i = 0, target; target = this.targetList_[i]; i++) {
    var box = target.box_;

    if (target.scrollableContainer_) {
      // If the target has a scrollable container, use the intersection of that
      // container's box and the target's box.
      var scrollBox = target.scrollableContainer_.box_;

      box = new goog.math.Box(
          Math.max(box.top, scrollBox.top),
          Math.min(box.right, scrollBox.right),
          Math.min(box.bottom, scrollBox.bottom),
          Math.max(box.left, scrollBox.left));
    }

    // Calculate clipping coordinates for horizontal and vertical axis.
    // The clipping coordinate is calculated by projecting fake target box,
    // the mouse pointer and DnD target box onto an axis and checking how
    // box projections overlap and if the projected DnD target box contains
    // mouse pointer. The clipping coordinate cannot be computed and is set to
    // a negative value if the projected DnD target contains the mouse pointer.

    var horizontalClip = null; // Assume mouse is above or below the DnD box.
    if (x >= box.right) { // Mouse is to the right of the DnD box.
      // Clip the fake box only if the DnD box overlaps it.
      horizontalClip = box.right > fakeTargetBox.left ?
          box.right : fakeTargetBox.left;
    } else if (x < box.left) { // Mouse is to the left of the DnD box.
      // Clip the fake box only if the DnD box overlaps it.
      horizontalClip = box.left < fakeTargetBox.right ?
          box.left : fakeTargetBox.right;
    }
    var verticalClip = null;
    if (y >= box.bottom) {
      verticalClip = box.bottom > fakeTargetBox.top ?
          box.bottom : fakeTargetBox.top;
    } else if (y < box.top) {
      verticalClip = box.top < fakeTargetBox.bottom ?
          box.top : fakeTargetBox.bottom;
    }

    // If both clippings are possible, choose one that gives us larger distance
    // to mouse pointer (mark the shorter clipping as impossible, by setting it
    // to null).
    if (!goog.isNull(horizontalClip) && !goog.isNull(verticalClip)) {
      if (Math.abs(horizontalClip - x) > Math.abs(verticalClip - y)) {
        verticalClip = null;
      } else {
        horizontalClip = null;
      }
    }

    // Clip none or one of fake target box sides (at most one clipping
    // coordinate can be active).
    if (!goog.isNull(horizontalClip)) {
      if (horizontalClip <= x) {
        fakeTargetBox.left = horizontalClip;
      } else {
        fakeTargetBox.right = horizontalClip;
      }
    } else if (!goog.isNull(verticalClip)) {
      if (verticalClip <= y) {
        fakeTargetBox.top = verticalClip;
      } else {
        fakeTargetBox.bottom = verticalClip;
      }
    }
  }

  // Only return the new fake target if it is big enough.
  return (fakeTargetBox.right - fakeTargetBox.left)***REMOVED***
         (fakeTargetBox.bottom - fakeTargetBox.top) >=
         goog.fx.AbstractDragDrop.DUMMY_TARGET_MIN_SIZE_ ?
      this.dummyTarget_ : null;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the target for a given cursor position.
***REMOVED***
***REMOVED*** @param {goog.math.Coordinate} position Cursor position.
***REMOVED*** @return {Object} Target for position or null if no target was defined
***REMOVED***     for the given position.
***REMOVED*** @private
***REMOVED***
goog.fx.AbstractDragDrop.prototype.getTargetFromPosition_ = function(position) {
  for (var target, i = 0; target = this.targetList_[i]; i++) {
    if (target.box_.contains(position)) {
      if (target.scrollableContainer_) {
        // If we have a scrollable container we will need to make sure
        // we account for clipping of the scroll area
        var box = target.scrollableContainer_.box_;
        if (box.contains(position)) {
          return target;
        }
      } else {
        return target;
      }
    }
  }

  return null;
***REMOVED***


***REMOVED***
***REMOVED*** Checks whatever a given point is inside a given box.
***REMOVED***
***REMOVED*** @param {number} x Cursor position on the x-axis.
***REMOVED*** @param {number} y Cursor position on the y-axis.
***REMOVED*** @param {goog.math.Box} box Box to check position against.
***REMOVED*** @return {boolean} Whether the given point is inside {@code box}.
***REMOVED*** @protected
***REMOVED*** @deprecated Use goog.math.Box.contains.
***REMOVED***
goog.fx.AbstractDragDrop.prototype.isInside = function(x, y, box) {
  return x >= box.left &&
         x < box.right &&
         y >= box.top &&
         y < box.bottom;
***REMOVED***


***REMOVED***
***REMOVED*** Gets the scroll distance as a coordinate object, using
***REMOVED*** the window of the current drag element's dom.
***REMOVED*** @return {goog.math.Coordinate} Object with scroll offsets 'x' and 'y'.
***REMOVED*** @protected
***REMOVED***
goog.fx.AbstractDragDrop.prototype.getScrollPos = function() {
  return goog.dom.getDomHelper(this.dragEl_).getDocumentScroll();
***REMOVED***


***REMOVED***
***REMOVED*** Get the position of a drag event.
***REMOVED*** @param {goog.fx.DragEvent} event Drag event.
***REMOVED*** @return {goog.math.Coordinate} Position of the event.
***REMOVED*** @protected
***REMOVED***
goog.fx.AbstractDragDrop.prototype.getEventPosition = function(event) {
  var scroll = this.getScrollPos();
  return new goog.math.Coordinate(event.clientX + scroll.x,
                                  event.clientY + scroll.y);
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.fx.AbstractDragDrop.prototype.disposeInternal = function() {
  goog.base(this, 'disposeInternal');
  this.removeItems();
***REMOVED***



***REMOVED***
***REMOVED*** Object representing a drag and drop event.
***REMOVED***
***REMOVED*** @param {string} type Event type.
***REMOVED*** @param {goog.fx.AbstractDragDrop} source Source drag drop object.
***REMOVED*** @param {goog.fx.DragDropItem} sourceItem Source item.
***REMOVED*** @param {goog.fx.AbstractDragDrop=} opt_target Target drag drop object.
***REMOVED*** @param {goog.fx.DragDropItem=} opt_targetItem Target item.
***REMOVED*** @param {Element=} opt_targetElement Target element.
***REMOVED*** @param {number=} opt_clientX X-Position relative to the screen.
***REMOVED*** @param {number=} opt_clientY Y-Position relative to the screen.
***REMOVED*** @param {number=} opt_x X-Position relative to the viewport.
***REMOVED*** @param {number=} opt_y Y-Position relative to the viewport.
***REMOVED*** @param {Object=} opt_subtarget The currently active subtarget.
***REMOVED*** @extends {goog.events.Event}
***REMOVED***
***REMOVED***
goog.fx.DragDropEvent = function(type, source, sourceItem,
                                 opt_target, opt_targetItem, opt_targetElement,
                                 opt_clientX, opt_clientY, opt_x, opt_y,
                                 opt_subtarget) {
  // TODO(eae): Get rid of all the optional parameters and have the caller set
  // the fields directly instead.
  goog.base(this, type);

 ***REMOVED*****REMOVED***
  ***REMOVED*** Reference to the source goog.fx.AbstractDragDrop object.
  ***REMOVED*** @type {goog.fx.AbstractDragDrop}
 ***REMOVED*****REMOVED***
  this.dragSource = source;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Reference to the source goog.fx.DragDropItem object.
  ***REMOVED*** @type {goog.fx.DragDropItem}
 ***REMOVED*****REMOVED***
  this.dragSourceItem = sourceItem;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Reference to the target goog.fx.AbstractDragDrop object.
  ***REMOVED*** @type {goog.fx.AbstractDragDrop|undefined}
 ***REMOVED*****REMOVED***
  this.dropTarget = opt_target;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Reference to the target goog.fx.DragDropItem object.
  ***REMOVED*** @type {goog.fx.DragDropItem|undefined}
 ***REMOVED*****REMOVED***
  this.dropTargetItem = opt_targetItem;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The actual element of the drop target that is the target for this event.
  ***REMOVED*** @type {Element|undefined}
 ***REMOVED*****REMOVED***
  this.dropTargetElement = opt_targetElement;

 ***REMOVED*****REMOVED***
  ***REMOVED*** X-Position relative to the screen.
  ***REMOVED*** @type {number|undefined}
 ***REMOVED*****REMOVED***
  this.clientX = opt_clientX;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Y-Position relative to the screen.
  ***REMOVED*** @type {number|undefined}
 ***REMOVED*****REMOVED***
  this.clientY = opt_clientY;

 ***REMOVED*****REMOVED***
  ***REMOVED*** X-Position relative to the viewport.
  ***REMOVED*** @type {number|undefined}
 ***REMOVED*****REMOVED***
  this.viewportX = opt_x;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Y-Position relative to the viewport.
  ***REMOVED*** @type {number|undefined}
 ***REMOVED*****REMOVED***
  this.viewportY = opt_y;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The subtarget that is currently active if a subtargeting function
  ***REMOVED*** is supplied.
  ***REMOVED*** @type {Object|undefined}
 ***REMOVED*****REMOVED***
  this.subtarget = opt_subtarget;
***REMOVED***
goog.inherits(goog.fx.DragDropEvent, goog.events.Event);


***REMOVED*** @override***REMOVED***
goog.fx.DragDropEvent.prototype.disposeInternal = function() {
***REMOVED***



***REMOVED***
***REMOVED*** Class representing a source or target element for drag and drop operations.
***REMOVED***
***REMOVED*** @param {Element|string} element Dom Node, or string representation of node
***REMOVED***     id, to be used as drag source/drop target.
***REMOVED*** @param {Object=} opt_data Data associated with the source/target.
***REMOVED*** @throws Error If no element argument is provided or if the type is invalid
***REMOVED*** @extends {goog.events.EventTarget}
***REMOVED***
***REMOVED***
goog.fx.DragDropItem = function(element, opt_data) {
  goog.base(this);

 ***REMOVED*****REMOVED***
  ***REMOVED*** Reference to drag source/target element
  ***REMOVED*** @type {Element}
 ***REMOVED*****REMOVED***
  this.element = goog.dom.getElement(element);

 ***REMOVED*****REMOVED***
  ***REMOVED*** Data associated with element.
  ***REMOVED*** @type {Object|undefined}
 ***REMOVED*****REMOVED***
  this.data = opt_data;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Drag object the item belongs to.
  ***REMOVED*** @type {goog.fx.AbstractDragDrop?}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.parent_ = null;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Event handler for listeners on events that can initiate a drag.
  ***REMOVED*** @type {!goog.events.EventHandler}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.eventHandler_ = new goog.events.EventHandler(this);
  this.registerDisposable(this.eventHandler_);

  if (!this.element) {
    throw Error('Invalid argument');
  }
***REMOVED***
goog.inherits(goog.fx.DragDropItem, goog.events.EventTarget);


***REMOVED***
***REMOVED*** The current element being dragged. This is needed because a DragDropItem can
***REMOVED*** have multiple elements that can be dragged.
***REMOVED*** @type {Element}
***REMOVED*** @private
***REMOVED***
goog.fx.DragDropItem.prototype.currentDragElement_ = null;


***REMOVED***
***REMOVED*** Get the data associated with the source/target.
***REMOVED*** @return {Object|null|undefined} Data associated with the source/target.
***REMOVED***
goog.fx.DragDropItem.prototype.getData = function() {
  return this.data;
***REMOVED***


***REMOVED***
***REMOVED*** Gets the element that is actually draggable given that the given target was
***REMOVED*** attempted to be dragged. This should be overriden when the element that was
***REMOVED*** given actually contains many items that can be dragged. From the target, you
***REMOVED*** can determine what element should actually be dragged.
***REMOVED***
***REMOVED*** @param {Element} target The target that was attempted to be dragged.
***REMOVED*** @return {Element} The element that is draggable given the target. If
***REMOVED***     none are draggable, this will return null.
***REMOVED***
goog.fx.DragDropItem.prototype.getDraggableElement = function(target) {
  return target;
***REMOVED***


***REMOVED***
***REMOVED*** Gets the element that is currently being dragged.
***REMOVED***
***REMOVED*** @return {Element} The element that is currently being dragged.
***REMOVED***
goog.fx.DragDropItem.prototype.getCurrentDragElement = function() {
  return this.currentDragElement_;
***REMOVED***


***REMOVED***
***REMOVED*** Gets all the elements of this item that are potentially draggable/
***REMOVED***
***REMOVED*** @return {Array.<Element>} The draggable elements.
***REMOVED***
goog.fx.DragDropItem.prototype.getDraggableElements = function() {
  return [this.element];
***REMOVED***


***REMOVED***
***REMOVED*** Event handler for mouse down.
***REMOVED***
***REMOVED*** @param {goog.events.BrowserEvent} event Mouse down event.
***REMOVED*** @private
***REMOVED***
goog.fx.DragDropItem.prototype.mouseDown_ = function(event) {
  if (!event.isMouseActionButton()) {
    return;
  }

  // Get the draggable element for the target.
  var element = this.getDraggableElement(***REMOVED*** @type {Element}***REMOVED*** (event.target));
  if (element) {
    this.maybeStartDrag_(event, element);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Sets the dragdrop to which this item belongs.
***REMOVED*** @param {goog.fx.AbstractDragDrop} parent The parent dragdrop.
***REMOVED***
goog.fx.DragDropItem.prototype.setParent = function(parent) {
  this.parent_ = parent;
***REMOVED***


***REMOVED***
***REMOVED*** Adds mouse move, mouse out and mouse up handlers.
***REMOVED***
***REMOVED*** @param {goog.events.BrowserEvent} event Mouse down event.
***REMOVED*** @param {Element} element Element.
***REMOVED*** @private
***REMOVED***
goog.fx.DragDropItem.prototype.maybeStartDrag_ = function(event, element) {
  var eventType = goog.events.EventType;
  this.eventHandler_.
      listen(element, eventType.MOUSEMOVE, this.mouseMove_, false).
      listen(element, eventType.MOUSEOUT, this.mouseMove_, false);

  // Capture the MOUSEUP on the document to ensure that we cancel the start
  // drag handlers even if the mouse up occurs on some other element. This can
  // happen for instance when the mouse down changes the geometry of the element
  // clicked on (e.g. through changes in activation styling) such that the mouse
  // up occurs outside the original element.
  var doc = goog.dom.getOwnerDocument(element);
  this.eventHandler_.listen(doc, eventType.MOUSEUP, this.mouseUp_, true);

  this.currentDragElement_ = element;

  this.startPosition_ = new goog.math.Coordinate(
      event.clientX, event.clientY);

  event.preventDefault();
***REMOVED***


***REMOVED***
***REMOVED*** Event handler for mouse move. Starts drag operation if moved more than the
***REMOVED*** threshold value.
***REMOVED***
***REMOVED*** @param {goog.events.BrowserEvent} event Mouse move or mouse out event.
***REMOVED*** @private
***REMOVED***
goog.fx.DragDropItem.prototype.mouseMove_ = function(event) {
  var distance = Math.abs(event.clientX - this.startPosition_.x) +
      Math.abs(event.clientY - this.startPosition_.y);
  // Fire dragStart event if the drag distance exceeds the threshold or if the
  // mouse leave the dragged element.
  // TODO(user): Consider using the goog.fx.Dragger to track the distance
  // even after the mouse leaves the dragged element.
  var currentDragElement = this.currentDragElement_;
  var distanceAboveThreshold =
      distance > goog.fx.AbstractDragDrop.initDragDistanceThreshold;
  var mouseOutOnDragElement = event.type == goog.events.EventType.MOUSEOUT &&
      event.target == currentDragElement;
  if (distanceAboveThreshold || mouseOutOnDragElement) {
    this.eventHandler_.removeAll();
    this.parent_.startDrag(event, this);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Event handler for mouse up. Removes mouse move, mouse out and mouse up event
***REMOVED*** handlers.
***REMOVED***
***REMOVED*** @param {goog.events.BrowserEvent} event Mouse up event.
***REMOVED*** @private
***REMOVED***
goog.fx.DragDropItem.prototype.mouseUp_ = function(event) {
  this.eventHandler_.removeAll();
  delete this.startPosition_;
  this.currentDragElement_ = null;
***REMOVED***



***REMOVED***
***REMOVED*** Class representing an active drop target
***REMOVED***
***REMOVED*** @param {goog.math.Box} box Box describing the position and dimension of the
***REMOVED***     target item.
***REMOVED*** @param {goog.fx.AbstractDragDrop=} opt_target Target that contains the item
       associated with position.
***REMOVED*** @param {goog.fx.DragDropItem=} opt_item Item associated with position.
***REMOVED*** @param {Element=} opt_element Element of item associated with position.
***REMOVED***
***REMOVED*** @private
***REMOVED***
goog.fx.ActiveDropTarget_ = function(box, opt_target, opt_item, opt_element) {

 ***REMOVED*****REMOVED***
  ***REMOVED*** Box describing the position and dimension of the target item
  ***REMOVED*** @type {goog.math.Box}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.box_ = box;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Target that contains the item associated with position
  ***REMOVED*** @type {goog.fx.AbstractDragDrop|undefined}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.target_ = opt_target;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Item associated with position
  ***REMOVED*** @type {goog.fx.DragDropItem|undefined}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.item_ = opt_item;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The draggable element of the item associated with position.
  ***REMOVED*** @type {Element|undefined}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.element_ = opt_element;
***REMOVED***


***REMOVED***
***REMOVED*** If this target is in a scrollable container this is it.
***REMOVED*** @type {goog.fx.ScrollableContainer_}
***REMOVED*** @private
***REMOVED***
goog.fx.ActiveDropTarget_.prototype.scrollableContainer_ = null;



***REMOVED***
***REMOVED*** Class for representing a scrollable container
***REMOVED*** @param {Element} element the scrollable element.
***REMOVED***
***REMOVED*** @private
***REMOVED***
goog.fx.ScrollableContainer_ = function(element) {

 ***REMOVED*****REMOVED***
  ***REMOVED*** The targets that lie within this container.
  ***REMOVED*** @type {Array.<goog.fx.ActiveDropTarget_>}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.containedTargets_ = [];

 ***REMOVED*****REMOVED***
  ***REMOVED*** The element that is this container
  ***REMOVED*** @type {Element}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.element_ = element;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The saved scroll left location for calculating deltas.
  ***REMOVED*** @type {number}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.savedScrollLeft_ = 0;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The saved scroll top location for calculating deltas.
  ***REMOVED*** @type {number}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.savedScrollTop_ = 0;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The space occupied by the container.
  ***REMOVED*** @type {goog.math.Box}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.box_ = null;
***REMOVED***
