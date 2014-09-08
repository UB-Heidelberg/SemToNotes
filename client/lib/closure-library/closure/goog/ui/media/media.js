// Copyright 2009 The Closure Library Authors. All Rights Reserved.
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
***REMOVED*** @fileoverview Provides the base goog.ui.Control and goog.ui.ControlRenderer
***REMOVED*** for media types, as well as a media model consistent with the Yahoo Media RSS
***REMOVED*** specification {@link http://search.yahoo.com/mrss/}.
***REMOVED***
***REMOVED*** The goog.ui.media.* package is basically a set of goog.ui.ControlRenderers
***REMOVED*** subclasses (such as goog.ui.media.Youtube, goog.ui.media.Picasa, etc) that
***REMOVED*** should all work with the same goog.ui.Control (goog.ui.media.Media) logic.
***REMOVED***
***REMOVED*** This design guarantees that all different types of medias will behave alike
***REMOVED*** (in a base level) but will look different.
***REMOVED***
***REMOVED*** In MVC terms, {@link goog.ui.media.Media} is the Controller,
***REMOVED*** {@link goog.ui.media.MediaRenderer} + CSS definitions are the View and
***REMOVED*** {@code goog.ui.media.MediaModel} is the data Model. Typically,
***REMOVED*** MediaRenderer will be subclassed to provide media specific renderers.
***REMOVED*** MediaRenderer subclasses are also responsible for defining the data model.
***REMOVED***
***REMOVED*** This design is strongly patterned after:
***REMOVED*** http://go/closure_control_subclassing
***REMOVED***
***REMOVED*** goog.ui.media.MediaRenderer handles the basic common ways to display media,
***REMOVED*** such as displaying tooltips, frames, minimize/maximize buttons, play buttons,
***REMOVED*** etc. Its subclasses are responsible for rendering media specific DOM
***REMOVED*** structures, like youtube flash players, picasa albums, etc.
***REMOVED***
***REMOVED*** goog.ui.media.Media handles the Control of Medias, by listening to events
***REMOVED*** and firing the appropriate actions. It knows about the existence of captions,
***REMOVED*** minimize/maximize buttons, and takes all the actions needed to change states,
***REMOVED*** including delegating the UI actions to MediaRenderers.
***REMOVED***
***REMOVED*** Although MediaRenderer is a base class designed to be subclassed, it can
***REMOVED*** be used by itself:
***REMOVED***
***REMOVED*** <pre>
***REMOVED***   var renderer = new goog.ui.media.MediaRenderer();
***REMOVED***   var control = new goog.ui.media.Media('hello world', renderer);
***REMOVED***   var control.render(goog.dom.getElement('mediaHolder'));
***REMOVED*** </pre>
***REMOVED***
***REMOVED*** It requires a few CSS rules to be defined, which you should use to control
***REMOVED*** how the component is displayed. {@link goog.ui.ControlRenderer}s is very CSS
***REMOVED*** intensive, which separates the UI structure (the HTML DOM elements, which is
***REMOVED*** created by the {@code goog.ui.media.MediaRenderer}) from the UI view (which
***REMOVED*** nodes are visible, which aren't, where they are positioned. These are defined
***REMOVED*** on the CSS rules for each state). A few examples of CSS selectors that needs
***REMOVED*** to be defined are:
***REMOVED***
***REMOVED*** <ul>
***REMOVED***   <li>.goog-ui-media
***REMOVED***   <li>.goog-ui-media-hover
***REMOVED***   <li>.goog-ui-media-selected
***REMOVED*** </ul>
***REMOVED***
***REMOVED*** If you want to have different custom renderers CSS namespaces (eg. you may
***REMOVED*** want to show a small thumbnail, or you may want to hide the caption, etc),
***REMOVED*** you can do so by using:
***REMOVED***
***REMOVED*** <pre>
***REMOVED***   var renderer = goog.ui.ControlRenderer.getCustomRenderer(
***REMOVED***       goog.ui.media.MediaRenderer, 'my-custom-namespace');
***REMOVED***   var media = new goog.ui.media.Media('', renderer);
***REMOVED***   media.render(goog.dom.getElement('parent'));
***REMOVED*** </pre>
***REMOVED***
***REMOVED*** Which will allow you to set your own .my-custom-namespace-hover,
***REMOVED*** .my-custom-namespace-selected CSS selectors.
***REMOVED***
***REMOVED*** NOTE(user): it seems like an overkill to subclass goog.ui.Control instead of
***REMOVED*** using a factory, but we wanted to make sure we had more control over the
***REMOVED*** events for future media implementations. Since we intent to use it in many
***REMOVED*** different places, it makes sense to have a more flexible design that lets us
***REMOVED*** control the inner workings of goog.ui.Control.
***REMOVED***
***REMOVED*** TODO(user): implement, as needed, the Media specific state changes UI, such
***REMOVED*** as minimize/maximize buttons, expand/close buttons, etc.
***REMOVED***
***REMOVED***

goog.provide('goog.ui.media.Media');
goog.provide('goog.ui.media.MediaRenderer');

goog.require('goog.style');
goog.require('goog.ui.Component');
goog.require('goog.ui.Control');
goog.require('goog.ui.ControlRenderer');



***REMOVED***
***REMOVED*** Provides the control mechanism of media types.
***REMOVED***
***REMOVED*** @param {goog.ui.media.MediaModel} dataModel The data model to be used by the
***REMOVED***     renderer.
***REMOVED*** @param {goog.ui.ControlRenderer=} opt_renderer Renderer used to render or
***REMOVED***     decorate the component; defaults to {@link goog.ui.ControlRenderer}.
***REMOVED*** @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper, used for
***REMOVED***     document interaction.
***REMOVED***
***REMOVED*** @extends {goog.ui.Control}
***REMOVED*** @final
***REMOVED***
goog.ui.media.Media = function(dataModel, opt_renderer, opt_domHelper) {
  goog.ui.Control.call(this, null, opt_renderer, opt_domHelper);

  // Sets up the data model.
  this.setDataModel(dataModel);
  this.setSupportedState(goog.ui.Component.State.OPENED, true);
  this.setSupportedState(goog.ui.Component.State.SELECTED, true);
  // TODO(user): had to do this to for mouseDownHandler not to
  // e.preventDefault(), because it was not allowing the event to reach the
  // flash player. figure out a better way to not e.preventDefault().
  this.setAllowTextSelection(true);

  // Media items don't use RTL styles, so avoid accessing computed styles to
  // figure out if the control is RTL.
  this.setRightToLeft(false);
***REMOVED***
goog.inherits(goog.ui.media.Media, goog.ui.Control);


***REMOVED***
***REMOVED*** The media data model used on the renderer.
***REMOVED***
***REMOVED*** @type {goog.ui.media.MediaModel}
***REMOVED*** @private
***REMOVED***
goog.ui.media.Media.prototype.dataModel_;


***REMOVED***
***REMOVED*** Sets the media model to be used on the renderer.
***REMOVED*** @param {goog.ui.media.MediaModel} dataModel The media model the renderer
***REMOVED***     should use.
***REMOVED***
goog.ui.media.Media.prototype.setDataModel = function(dataModel) {
  this.dataModel_ = dataModel;
***REMOVED***


***REMOVED***
***REMOVED*** Gets the media model renderer is using.
***REMOVED*** @return {goog.ui.media.MediaModel} The media model being used.
***REMOVED***
goog.ui.media.Media.prototype.getDataModel = function() {
  return this.dataModel_;
***REMOVED***



***REMOVED***
***REMOVED*** Base class of all media renderers. Provides the common renderer functionality
***REMOVED*** of medias.
***REMOVED***
***REMOVED*** The current common functionality shared by Medias is to have an outer frame
***REMOVED*** that gets highlighted on mouse hover.
***REMOVED***
***REMOVED*** TODO(user): implement more common UI behavior, as needed.
***REMOVED***
***REMOVED*** NOTE(user): I am not enjoying how the subclasses are changing their state
***REMOVED*** through setState() ... maybe provide abstract methods like
***REMOVED*** goog.ui.media.MediaRenderer.prototype.preview = goog.abstractMethod;
***REMOVED*** goog.ui.media.MediaRenderer.prototype.play = goog.abstractMethod;
***REMOVED*** goog.ui.media.MediaRenderer.prototype.minimize = goog.abstractMethod;
***REMOVED*** goog.ui.media.MediaRenderer.prototype.maximize = goog.abstractMethod;
***REMOVED*** and call them on this parent class setState ?
***REMOVED***
***REMOVED***
***REMOVED*** @extends {goog.ui.ControlRenderer}
***REMOVED***
goog.ui.media.MediaRenderer = function() {
  goog.ui.ControlRenderer.call(this);
***REMOVED***
goog.inherits(goog.ui.media.MediaRenderer, goog.ui.ControlRenderer);


***REMOVED***
***REMOVED*** Builds the common DOM structure of medias. Builds an outer div, and appends
***REMOVED*** a child div with the {@code goog.ui.Control.getContent} content. Marks the
***REMOVED*** caption with a {@code this.getClassClass()} + '-caption' css flag, so that
***REMOVED*** specific renderers can hide/show the caption as desired.
***REMOVED***
***REMOVED*** @param {goog.ui.Control} control The control instance.
***REMOVED*** @return {!Element} The DOM structure that represents control.
***REMOVED*** @override
***REMOVED***
goog.ui.media.MediaRenderer.prototype.createDom = function(control) {
  var domHelper = control.getDomHelper();
  var div = domHelper.createElement('div');
  div.className = this.getClassNames(control).join(' ');

  var dataModel = control.getDataModel();

  // Only creates DOMs if the data is available.
  if (dataModel.getCaption()) {
    var caption = domHelper.createElement('div');
    caption.className = goog.getCssName(this.getCssClass(), 'caption');
    caption.appendChild(domHelper.createDom(
        'p', goog.getCssName(this.getCssClass(), 'caption-text'),
        dataModel.getCaption()));
    domHelper.appendChild(div, caption);
  }

  if (dataModel.getDescription()) {
    var description = domHelper.createElement('div');
    description.className = goog.getCssName(this.getCssClass(), 'description');
    description.appendChild(domHelper.createDom(
        'p', goog.getCssName(this.getCssClass(), 'description-text'),
        dataModel.getDescription()));
    domHelper.appendChild(div, description);
  }

  // Creates thumbnails of the media.
  var thumbnails = dataModel.getThumbnails() || [];
  for (var index = 0; index < thumbnails.length; index++) {
    var thumbnail = thumbnails[index];
    var thumbnailElement = domHelper.createElement('img');
    thumbnailElement.src = thumbnail.getUrl();
    thumbnailElement.className = this.getThumbnailCssName(index);

    // Check that the size is defined and that the size's height and width
    // are defined. Undefined height and width is deprecated but still
    // seems to exist in some cases.
    var size = thumbnail.getSize();

    if (size && goog.isDefAndNotNull(size.height) &&
        goog.isDefAndNotNull(size.width)) {
      goog.style.setSize(thumbnailElement, size);
    }
    domHelper.appendChild(div, thumbnailElement);
  }

  if (dataModel.getPlayer()) {
    // if medias have players, allow UI for a play button.
    var playButton = domHelper.createElement('div');
    playButton.className = goog.getCssName(this.getCssClass(), 'playbutton');
    domHelper.appendChild(div, playButton);
  }

  control.setElementInternal(div);

  this.setState(
      control,
     ***REMOVED*****REMOVED*** @type {goog.ui.Component.State}***REMOVED*** (control.getState()),
      true);

  return div;
***REMOVED***


***REMOVED***
***REMOVED*** Returns a renamable CSS class name for a numbered thumbnail. The default
***REMOVED*** implementation generates the class names goog-ui-media-thumbnail0,
***REMOVED*** goog-ui-media-thumbnail1, and the generic goog-ui-media-thumbnailn.
***REMOVED*** Subclasses can override this method when their media requires additional
***REMOVED*** specific class names (Applications are supposed to know how many thumbnails
***REMOVED*** media will have).
***REMOVED***
***REMOVED*** @param {number} index The thumbnail index.
***REMOVED*** @return {string} CSS class name.
***REMOVED*** @protected
***REMOVED***
goog.ui.media.MediaRenderer.prototype.getThumbnailCssName = function(index) {
  switch (index) {
    case 0: return goog.getCssName(this.getCssClass(), 'thumbnail0');
    case 1: return goog.getCssName(this.getCssClass(), 'thumbnail1');
    case 2: return goog.getCssName(this.getCssClass(), 'thumbnail2');
    case 3: return goog.getCssName(this.getCssClass(), 'thumbnail3');
    case 4: return goog.getCssName(this.getCssClass(), 'thumbnail4');
    default: return goog.getCssName(this.getCssClass(), 'thumbnailn');
  }
***REMOVED***
