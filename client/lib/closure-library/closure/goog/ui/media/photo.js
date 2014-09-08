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
***REMOVED*** @fileoverview provides a reusable photo UI component that renders photos that
***REMOVED*** contains metadata (such as captions, description, thumbnail/high resolution
***REMOVED*** versions, etc).
***REMOVED***
***REMOVED*** goog.ui.media.Photo is actually a {@link goog.ui.ControlRenderer},
***REMOVED*** a stateless class - that could/should be used as a Singleton with the static
***REMOVED*** method {@code goog.ui.media.Photo.getInstance} -, that knows how to render
***REMOVED*** Photos. It is designed to be used with a {@link goog.ui.Control}, which will
***REMOVED*** actually control the media renderer and provide the {@link goog.ui.Component}
***REMOVED*** base. This design guarantees that all different types of medias will behave
***REMOVED*** alike but will look different.
***REMOVED***
***REMOVED*** goog.ui.media.Photo expects {@code goog.ui.media.MediaModel} on
***REMOVED*** {@code goog.ui.Control.getModel} as data models.
***REMOVED***
***REMOVED*** Example of usage:
***REMOVED***
***REMOVED*** <pre>
***REMOVED***   var photo = goog.ui.media.Photo.newControl(
***REMOVED***       new goog.ui.media.MediaModel('http://hostname/file.jpg'));
***REMOVED***   photo.render(goog.dom.getElement('parent'));
***REMOVED*** </pre>
***REMOVED***
***REMOVED*** Photo medias currently support the following states:
***REMOVED***
***REMOVED*** <ul>
***REMOVED***   <li> {@link goog.ui.Component.State.HOVER}: mouse cursor is over the photo.
***REMOVED***   <li> {@link goog.ui.Component.State.SELECTED}: photo is being displayed.
***REMOVED*** </ul>
***REMOVED***
***REMOVED*** Which can be accessed by
***REMOVED***
***REMOVED*** <pre>
***REMOVED***   photo.setHighlighted(true);
***REMOVED***   photo.setSelected(true);
***REMOVED*** </pre>
***REMOVED***
***REMOVED***

goog.provide('goog.ui.media.Photo');

goog.require('goog.ui.media.Media');
goog.require('goog.ui.media.MediaRenderer');



***REMOVED***
***REMOVED*** Subclasses a goog.ui.media.MediaRenderer to provide a Photo specific media
***REMOVED*** renderer. Provides a base class for any other renderer that wants to display
***REMOVED*** photos.
***REMOVED***
***REMOVED*** This class is meant to be used as a singleton static stateless class, that
***REMOVED*** takes {@code goog.ui.media.Media} instances and renders it.
***REMOVED***
***REMOVED*** This design is patterned after
***REMOVED*** http://go/closure_control_subclassing
***REMOVED***
***REMOVED***
***REMOVED*** @extends {goog.ui.media.MediaRenderer}
***REMOVED*** @final
***REMOVED***
goog.ui.media.Photo = function() {
  goog.ui.media.MediaRenderer.call(this);
***REMOVED***
goog.inherits(goog.ui.media.Photo, goog.ui.media.MediaRenderer);
goog.addSingletonGetter(goog.ui.media.Photo);


***REMOVED***
***REMOVED*** Default CSS class to be applied to the root element of components rendered
***REMOVED*** by this renderer.
***REMOVED***
***REMOVED*** @type {string}
***REMOVED***
goog.ui.media.Photo.CSS_CLASS = goog.getCssName('goog-ui-media-photo');


***REMOVED***
***REMOVED*** A static convenient method to construct a goog.ui.media.Media control out of
***REMOVED*** a photo {@code goog.ui.media.MediaModel}. It sets it as the data model
***REMOVED*** goog.ui.media.Photo renderer uses, sets the states supported by the renderer,
***REMOVED*** and returns a Control that binds everything together. This is what you
***REMOVED*** should be using for constructing Photos, except if you need finer control
***REMOVED*** over the configuration.
***REMOVED***
***REMOVED*** @param {goog.ui.media.MediaModel} dataModel The photo data model.
***REMOVED*** @return {!goog.ui.media.Media} A goog.ui.Control subclass with the photo
***REMOVED***     renderer.
***REMOVED***
goog.ui.media.Photo.newControl = function(dataModel) {
  var control = new goog.ui.media.Media(
      dataModel,
      goog.ui.media.Photo.getInstance());
  return control;
***REMOVED***


***REMOVED***
***REMOVED*** Creates the initial DOM structure of a photo.
***REMOVED***
***REMOVED*** @param {goog.ui.Control} c The media control.
***REMOVED*** @return {!Element} A DOM structure that represents the control.
***REMOVED*** @override
***REMOVED***
goog.ui.media.Photo.prototype.createDom = function(c) {
  var control =***REMOVED*****REMOVED*** @type {goog.ui.media.Media}***REMOVED*** (c);
  var div = goog.ui.media.Photo.superClass_.createDom.call(this, control);

  var img = control.getDomHelper().createDom('img', {
    src: control.getDataModel().getPlayer().getUrl(),
    className: goog.getCssName(this.getCssClass(), 'image')
  });

  div.appendChild(img);

  return div;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the CSS class to be applied to the root element of components
***REMOVED*** rendered using this renderer.
***REMOVED*** @return {string} Renderer-specific CSS class.
***REMOVED*** @override
***REMOVED***
goog.ui.media.Photo.prototype.getCssClass = function() {
  return goog.ui.media.Photo.CSS_CLASS;
***REMOVED***
