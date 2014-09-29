// Copyright 2011 The Closure Library Authors. All Rights Reserved.
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
***REMOVED*** @fileoverview provides a reusable GoogleVideo UI component given a public
***REMOVED*** GoogleVideo video URL.
***REMOVED***
***REMOVED*** goog.ui.media.GoogleVideo is actually a {@link goog.ui.ControlRenderer}, a
***REMOVED*** stateless class - that could/should be used as a Singleton with the static
***REMOVED*** method {@code goog.ui.media.GoogleVideo.getInstance} -, that knows how to
***REMOVED*** render GoogleVideo videos. It is designed to be used with a
***REMOVED*** {@link goog.ui.Control}, which will actually control the media renderer and
***REMOVED*** provide the {@link goog.ui.Component} base. This design guarantees that all
***REMOVED*** different types of medias will behave alike but will look different.
***REMOVED***
***REMOVED*** goog.ui.media.GoogleVideo expects {@code goog.ui.media.GoogleVideoModel} on
***REMOVED*** {@code goog.ui.Control.getModel} as data models, and renders a flash object
***REMOVED*** that will show the contents of that video.
***REMOVED***
***REMOVED*** Example of usage:
***REMOVED***
***REMOVED*** <pre>
***REMOVED***   var video = goog.ui.media.GoogleVideoModel.newInstance(
***REMOVED***       'http://video.google.com/videoplay?docid=6698933542780842398');
***REMOVED***   goog.ui.media.GoogleVideo.newControl(video).render();
***REMOVED*** </pre>
***REMOVED***
***REMOVED*** GoogleVideo medias currently support the following states:
***REMOVED***
***REMOVED*** <ul>
***REMOVED***   <li> {@link goog.ui.Component.State.DISABLED}: shows 'flash not available'
***REMOVED***   <li> {@link goog.ui.Component.State.HOVER}: mouse cursor is over the video
***REMOVED***   <li> {@link goog.ui.Component.State.SELECTED}: flash video is shown
***REMOVED*** </ul>
***REMOVED***
***REMOVED*** Which can be accessed by
***REMOVED*** <pre>
***REMOVED***   video.setEnabled(true);
***REMOVED***   video.setHighlighted(true);
***REMOVED***   video.setSelected(true);
***REMOVED*** </pre>
***REMOVED***
***REMOVED***
***REMOVED*** @supported IE6+, FF2+, Chrome, Safari. Requires flash to actually work.
***REMOVED***


goog.provide('goog.ui.media.GoogleVideo');
goog.provide('goog.ui.media.GoogleVideoModel');

goog.require('goog.string');
goog.require('goog.ui.media.FlashObject');
goog.require('goog.ui.media.Media');
goog.require('goog.ui.media.MediaModel');
goog.require('goog.ui.media.MediaModel.Player');
goog.require('goog.ui.media.MediaRenderer');



***REMOVED***
***REMOVED*** Subclasses a goog.ui.media.MediaRenderer to provide a GoogleVideo specific
***REMOVED*** media renderer.
***REMOVED***
***REMOVED*** This class knows how to parse GoogleVideo URLs, and render the DOM structure
***REMOVED*** of GoogleVideo video players. This class is meant to be used as a singleton
***REMOVED*** static stateless class, that takes {@code goog.ui.media.Media} instances and
***REMOVED*** renders it. It expects {@code goog.ui.media.Media.getModel} to return a well
***REMOVED*** formed, previously constructed, GoogleVideo video id, which is the data model
***REMOVED*** this renderer will use to construct the DOM structure.
***REMOVED*** {@see goog.ui.media.GoogleVideo.newControl} for a example of constructing a
***REMOVED*** control with this renderer.
***REMOVED***
***REMOVED*** This design is patterned after http://go/closure_control_subclassing
***REMOVED***
***REMOVED*** It uses {@link goog.ui.media.FlashObject} to embed the flash object.
***REMOVED***
***REMOVED***
***REMOVED*** @extends {goog.ui.media.MediaRenderer}
***REMOVED***
goog.ui.media.GoogleVideo = function() {
  goog.ui.media.MediaRenderer.call(this);
***REMOVED***
goog.inherits(goog.ui.media.GoogleVideo, goog.ui.media.MediaRenderer);
goog.addSingletonGetter(goog.ui.media.GoogleVideo);


***REMOVED***
***REMOVED*** A static convenient method to construct a goog.ui.media.Media control out of
***REMOVED*** a GoogleVideo model. It sets it as the data model goog.ui.media.GoogleVideo
***REMOVED*** renderer uses, sets the states supported by the renderer, and returns a
***REMOVED*** Control that binds everything together. This is what you should be using for
***REMOVED*** constructing GoogleVideo videos, except if you need finer control over the
***REMOVED*** configuration.
***REMOVED***
***REMOVED*** @param {goog.ui.media.GoogleVideoModel} dataModel The GoogleVideo data model.
***REMOVED*** @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper, used for
***REMOVED***     document interaction.
***REMOVED*** @return {goog.ui.media.Media} A Control binded to the GoogleVideo renderer.
***REMOVED***
goog.ui.media.GoogleVideo.newControl = function(dataModel, opt_domHelper) {
  var control = new goog.ui.media.Media(
      dataModel,
      goog.ui.media.GoogleVideo.getInstance(),
      opt_domHelper);
  // GoogleVideo videos don't have any thumbnail for now, so we show the
  // "selected" version of the UI at the start, which is the flash player.
  control.setSelected(true);
  return control;
***REMOVED***


***REMOVED***
***REMOVED*** Default CSS class to be applied to the root element of components rendered
***REMOVED*** by this renderer.
***REMOVED***
***REMOVED*** @type {string}
***REMOVED***
goog.ui.media.GoogleVideo.CSS_CLASS =
    goog.getCssName('goog-ui-media-googlevideo');


***REMOVED***
***REMOVED*** Creates the initial DOM structure of the GoogleVideo video, which is
***REMOVED*** basically a the flash object pointing to a GoogleVideo video player.
***REMOVED***
***REMOVED*** @param {goog.ui.Control} c The media control.
***REMOVED*** @return {Element} The DOM structure that represents this control.
***REMOVED*** @override
***REMOVED***
goog.ui.media.GoogleVideo.prototype.createDom = function(c) {
  var control =***REMOVED*****REMOVED*** @type {goog.ui.media.Media}***REMOVED*** (c);
  var div = goog.base(this, 'createDom', control);

  var dataModel =
     ***REMOVED*****REMOVED*** @type {goog.ui.media.GoogleVideoModel}***REMOVED*** (control.getDataModel());

  var flash = new goog.ui.media.FlashObject(
      dataModel.getPlayer().getUrl() || '',
      control.getDomHelper());
  flash.render(div);

  return div;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the CSS class to be applied to the root element of components
***REMOVED*** rendered using this renderer.
***REMOVED***
***REMOVED*** @return {string} Renderer-specific CSS class.
***REMOVED*** @override
***REMOVED***
goog.ui.media.GoogleVideo.prototype.getCssClass = function() {
  return goog.ui.media.GoogleVideo.CSS_CLASS;
***REMOVED***



***REMOVED***
***REMOVED*** The {@code goog.ui.media.GoogleVideo} media data model. It stores a required
***REMOVED*** {@code videoId} field, sets the GoogleVideo URL, and allows a few optional
***REMOVED*** parameters.
***REMOVED***
***REMOVED*** @param {string} videoId The GoogleVideo video id.
***REMOVED*** @param {string=} opt_caption An optional caption of the GoogleVideo video.
***REMOVED*** @param {string=} opt_description An optional description of the GoogleVideo
***REMOVED***     video.
***REMOVED*** @param {boolean=} opt_autoplay Whether to autoplay video.
***REMOVED***
***REMOVED*** @extends {goog.ui.media.MediaModel}
***REMOVED***
goog.ui.media.GoogleVideoModel = function(videoId, opt_caption, opt_description,
                                          opt_autoplay) {
  goog.ui.media.MediaModel.call(
      this,
      goog.ui.media.GoogleVideoModel.buildUrl(videoId),
      opt_caption,
      opt_description,
      goog.ui.media.MediaModel.MimeType.FLASH);

 ***REMOVED*****REMOVED***
  ***REMOVED*** The GoogleVideo video id.
  ***REMOVED*** @type {string}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.videoId_ = videoId;

  this.setPlayer(new goog.ui.media.MediaModel.Player(
      goog.ui.media.GoogleVideoModel.buildFlashUrl(videoId, opt_autoplay)));
***REMOVED***
goog.inherits(goog.ui.media.GoogleVideoModel, goog.ui.media.MediaModel);


***REMOVED***
***REMOVED*** Regular expression used to extract the GoogleVideo video id (docid) out of
***REMOVED*** GoogleVideo URLs.
***REMOVED***
***REMOVED*** @type {RegExp}
***REMOVED*** @private
***REMOVED*** @const
***REMOVED***
goog.ui.media.GoogleVideoModel.MATCHER_ =
    /^http:\/\/(?:www\.)?video\.google\.com\/videoplay.*[\?#]docid=(-?[0-9]+)#?$/i;


***REMOVED***
***REMOVED*** A auxiliary static method that parses a GoogleVideo URL, extracting the ID of
***REMOVED*** the video, and builds a GoogleVideoModel.
***REMOVED***
***REMOVED*** @param {string} googleVideoUrl A GoogleVideo video URL.
***REMOVED*** @param {string=} opt_caption An optional caption of the GoogleVideo video.
***REMOVED*** @param {string=} opt_description An optional description of the GoogleVideo
***REMOVED***     video.
***REMOVED*** @param {boolean=} opt_autoplay Whether to autoplay video.
***REMOVED*** @return {goog.ui.media.GoogleVideoModel} The data model that represents the
***REMOVED***     GoogleVideo URL.
***REMOVED*** @see goog.ui.media.GoogleVideoModel.getVideoId()
***REMOVED*** @throws Error in case the parsing fails.
***REMOVED***
goog.ui.media.GoogleVideoModel.newInstance = function(googleVideoUrl,
                                                      opt_caption,
                                                      opt_description,
                                                      opt_autoplay) {
  if (goog.ui.media.GoogleVideoModel.MATCHER_.test(googleVideoUrl)) {
    var data = goog.ui.media.GoogleVideoModel.MATCHER_.exec(googleVideoUrl);
    return new goog.ui.media.GoogleVideoModel(
        data[1], opt_caption, opt_description, opt_autoplay);
  }

  throw Error('failed to parse video id from GoogleVideo url: ' +
      googleVideoUrl);
***REMOVED***


***REMOVED***
***REMOVED*** The opposite of {@code goog.ui.media.GoogleVideo.newInstance}: it takes a
***REMOVED*** videoId and returns a GoogleVideo URL.
***REMOVED***
***REMOVED*** @param {string} videoId The GoogleVideo video ID.
***REMOVED*** @return {string} The GoogleVideo URL.
***REMOVED***
goog.ui.media.GoogleVideoModel.buildUrl = function(videoId) {
  return 'http://video.google.com/videoplay?docid=' +
      goog.string.urlEncode(videoId);
***REMOVED***


***REMOVED***
***REMOVED*** An auxiliary method that builds URL of the flash movie to be embedded,
***REMOVED*** out of the GoogleVideo video id.
***REMOVED***
***REMOVED*** @param {string} videoId The GoogleVideo video ID.
***REMOVED*** @param {boolean=} opt_autoplay Whether the flash movie should start playing
***REMOVED***     as soon as it is shown, or if it should show a 'play' button.
***REMOVED*** @return {string} The flash URL to be embedded on the page.
***REMOVED***
goog.ui.media.GoogleVideoModel.buildFlashUrl = function(videoId, opt_autoplay) {
  var autoplay = opt_autoplay ? '&autoplay=1' : '';
  return 'http://video.google.com/googleplayer.swf?docid=' +
      goog.string.urlEncode(videoId) +
      '&hl=en&fs=true' + autoplay;
***REMOVED***


***REMOVED***
***REMOVED*** Gets the GoogleVideo video id.
***REMOVED*** @return {string} The GoogleVideo video id.
***REMOVED***
goog.ui.media.GoogleVideoModel.prototype.getVideoId = function() {
  return this.videoId_;
***REMOVED***
