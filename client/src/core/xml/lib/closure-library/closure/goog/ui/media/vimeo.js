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
***REMOVED*** @fileoverview provides a reusable Vimeo video UI component given a public
***REMOVED*** Vimeo video URL.
***REMOVED***
***REMOVED*** goog.ui.media.Vimeo is actually a {@link goog.ui.ControlRenderer}, a
***REMOVED*** stateless class - that could/should be used as a Singleton with the static
***REMOVED*** method {@code goog.ui.media.Vimeo.getInstance} -, that knows how to render
***REMOVED*** video videos. It is designed to be used with a {@link goog.ui.Control},
***REMOVED*** which will actually control the media renderer and provide the
***REMOVED*** {@link goog.ui.Component} base. This design guarantees that all different
***REMOVED*** types of medias will behave alike but will look different.
***REMOVED***
***REMOVED*** goog.ui.media.Vimeo expects vimeo video IDs on
***REMOVED*** {@code goog.ui.Control.getModel} as data models, and renders a flash object
***REMOVED*** that will show the contents of that video.
***REMOVED***
***REMOVED*** Example of usage:
***REMOVED***
***REMOVED*** <pre>
***REMOVED***   var video = goog.ui.media.VimeoModel.newInstance('http://vimeo.com/30012');
***REMOVED***   goog.ui.media.Vimeo.newControl(video).render();
***REMOVED*** </pre>
***REMOVED***
***REMOVED*** Vimeo medias currently support the following states:
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
***REMOVED*** @supported IE6, FF2+, Safari. Requires flash to actually work.
***REMOVED***
***REMOVED*** TODO(user): test on other browsers
***REMOVED***

goog.provide('goog.ui.media.Vimeo');
goog.provide('goog.ui.media.VimeoModel');

goog.require('goog.string');
goog.require('goog.ui.media.FlashObject');
goog.require('goog.ui.media.Media');
goog.require('goog.ui.media.MediaModel');
goog.require('goog.ui.media.MediaModel.Player');
goog.require('goog.ui.media.MediaRenderer');



***REMOVED***
***REMOVED*** Subclasses a goog.ui.media.MediaRenderer to provide a Vimeo specific media
***REMOVED*** renderer.
***REMOVED***
***REMOVED*** This class knows how to parse Vimeo URLs, and render the DOM structure
***REMOVED*** of vimeo video players. This class is meant to be used as a singleton static
***REMOVED*** stateless class, that takes {@code goog.ui.media.Media} instances and renders
***REMOVED*** it. It expects {@code goog.ui.media.Media.getModel} to return a well formed,
***REMOVED*** previously constructed, vimeoId {@see goog.ui.media.Vimeo.parseUrl}, which is
***REMOVED*** the data model this renderer will use to construct the DOM structure.
***REMOVED*** {@see goog.ui.media.Vimeo.newControl} for a example of constructing a control
***REMOVED*** with this renderer.
***REMOVED***
***REMOVED*** This design is patterned after http://go/closure_control_subclassing
***REMOVED***
***REMOVED*** It uses {@link goog.ui.media.FlashObject} to embed the flash object.
***REMOVED***
***REMOVED***
***REMOVED*** @extends {goog.ui.media.MediaRenderer}
***REMOVED***
goog.ui.media.Vimeo = function() {
  goog.ui.media.MediaRenderer.call(this);
***REMOVED***
goog.inherits(goog.ui.media.Vimeo, goog.ui.media.MediaRenderer);
goog.addSingletonGetter(goog.ui.media.Vimeo);


***REMOVED***
***REMOVED*** Default CSS class to be applied to the root element of components rendered
***REMOVED*** by this renderer.
***REMOVED***
***REMOVED*** @type {string}
***REMOVED***
goog.ui.media.Vimeo.CSS_CLASS = goog.getCssName('goog-ui-media-vimeo');


***REMOVED***
***REMOVED*** A static convenient method to construct a goog.ui.media.Media control out of
***REMOVED*** a Vimeo URL. It extracts the videoId information on the URL, sets it
***REMOVED*** as the data model goog.ui.media.Vimeo renderer uses, sets the states
***REMOVED*** supported by the renderer, and returns a Control that binds everything
***REMOVED*** together. This is what you should be using for constructing Vimeo videos,
***REMOVED*** except if you need more fine control over the configuration.
***REMOVED***
***REMOVED*** @param {goog.ui.media.VimeoModel} dataModel A vimeo video URL.
***REMOVED*** @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper, used for
***REMOVED***     document interaction.
***REMOVED*** @return {goog.ui.media.Media} A Control binded to the Vimeo renderer.
***REMOVED***
goog.ui.media.Vimeo.newControl = function(dataModel, opt_domHelper) {
  var control = new goog.ui.media.Media(
      dataModel, goog.ui.media.Vimeo.getInstance(), opt_domHelper);
  // vimeo videos don't have any thumbnail for now, so we show the
  // "selected" version of the UI at the start, which is the
  // flash player.
  control.setSelected(true);
  return control;
***REMOVED***


***REMOVED***
***REMOVED*** Creates the initial DOM structure of the vimeo video, which is basically a
***REMOVED*** the flash object pointing to a vimeo video player.
***REMOVED***
***REMOVED*** @param {goog.ui.Control} c The media control.
***REMOVED*** @return {Element} The DOM structure that represents this control.
***REMOVED*** @override
***REMOVED***
goog.ui.media.Vimeo.prototype.createDom = function(c) {
  var control =***REMOVED*****REMOVED*** @type {goog.ui.media.Media}***REMOVED*** (c);
  var div = goog.ui.media.Vimeo.superClass_.createDom.call(this, control);

  var dataModel =
     ***REMOVED*****REMOVED*** @type {goog.ui.media.VimeoModel}***REMOVED*** (control.getDataModel());

  var flash = new goog.ui.media.FlashObject(
      dataModel.getPlayer().getUrl() || '',
      control.getDomHelper());
  flash.render(div);

  return div;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the CSS class to be applied to the root element of components
***REMOVED*** rendered using this renderer.
***REMOVED*** @return {string} Renderer-specific CSS class.
***REMOVED*** @override
***REMOVED***
goog.ui.media.Vimeo.prototype.getCssClass = function() {
  return goog.ui.media.Vimeo.CSS_CLASS;
***REMOVED***



***REMOVED***
***REMOVED*** The {@code goog.ui.media.Vimeo} media data model. It stores a required
***REMOVED*** {@code videoId} field, sets the vimeo URL, and allows a few optional
***REMOVED*** parameters.
***REMOVED***
***REMOVED*** @param {string} videoId The vimeo video id.
***REMOVED*** @param {string=} opt_caption An optional caption of the vimeo video.
***REMOVED*** @param {string=} opt_description An optional description of the vimeo video.
***REMOVED*** @param {boolean=} opt_autoplay Whether to autoplay video.
***REMOVED***
***REMOVED*** @extends {goog.ui.media.MediaModel}
***REMOVED***
goog.ui.media.VimeoModel = function(videoId, opt_caption, opt_description,
                                    opt_autoplay) {
  goog.ui.media.MediaModel.call(
      this,
      goog.ui.media.VimeoModel.buildUrl(videoId),
      opt_caption,
      opt_description,
      goog.ui.media.MediaModel.MimeType.FLASH);

 ***REMOVED*****REMOVED***
  ***REMOVED*** The Vimeo video id.
  ***REMOVED*** @type {string}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.videoId_ = videoId;

  this.setPlayer(new goog.ui.media.MediaModel.Player(
      goog.ui.media.VimeoModel.buildFlashUrl(videoId, opt_autoplay)));
***REMOVED***
goog.inherits(goog.ui.media.VimeoModel, goog.ui.media.MediaModel);


***REMOVED***
***REMOVED*** Regular expression used to extract the vimeo video id out of vimeo URLs.
***REMOVED***
***REMOVED*** Copied from http://go/markdownlite.js
***REMOVED***
***REMOVED*** TODO(user): add support to https.
***REMOVED***
***REMOVED*** @type {RegExp}
***REMOVED*** @private
***REMOVED*** @const
***REMOVED***
goog.ui.media.VimeoModel.MATCHER_ =
    /https?:\/\/(?:www\.)?vimeo\.com\/(?:hd#)?([0-9]+)/i;


***REMOVED***
***REMOVED*** Takes a {@code vimeoUrl} and extracts the video id.
***REMOVED***
***REMOVED*** @param {string} vimeoUrl A vimeo video URL.
***REMOVED*** @param {string=} opt_caption An optional caption of the vimeo video.
***REMOVED*** @param {string=} opt_description An optional description of the vimeo video.
***REMOVED*** @param {boolean=} opt_autoplay Whether to autoplay video.
***REMOVED*** @return {goog.ui.media.VimeoModel} The vimeo data model that represents this
***REMOVED***     URL.
***REMOVED*** @throws exception in case the parsing fails
***REMOVED***
goog.ui.media.VimeoModel.newInstance = function(vimeoUrl,
                                                opt_caption,
                                                opt_description,
                                                opt_autoplay) {
  if (goog.ui.media.VimeoModel.MATCHER_.test(vimeoUrl)) {
    var data = goog.ui.media.VimeoModel.MATCHER_.exec(vimeoUrl);
    return new goog.ui.media.VimeoModel(
        data[1], opt_caption, opt_description, opt_autoplay);
  }
  throw Error('failed to parse vimeo url: ' + vimeoUrl);
***REMOVED***


***REMOVED***
***REMOVED*** The opposite of {@code goog.ui.media.Vimeo.parseUrl}: it takes a videoId
***REMOVED*** and returns a vimeo URL.
***REMOVED***
***REMOVED*** @param {string} videoId The vimeo video ID.
***REMOVED*** @return {string} The vimeo URL.
***REMOVED***
goog.ui.media.VimeoModel.buildUrl = function(videoId) {
  return 'http://vimeo.com/' + goog.string.urlEncode(videoId);
***REMOVED***


***REMOVED***
***REMOVED*** Builds a flash url from the vimeo {@code videoId}.
***REMOVED***
***REMOVED*** @param {string} videoId The vimeo video ID.
***REMOVED*** @param {boolean=} opt_autoplay Whether the flash movie should start playing
***REMOVED***     as soon as it is shown, or if it should show a 'play' button.
***REMOVED*** @return {string} The vimeo flash URL.
***REMOVED***
goog.ui.media.VimeoModel.buildFlashUrl = function(videoId, opt_autoplay) {
  var autoplay = opt_autoplay ? '&autoplay=1' : '';
  return 'http://vimeo.com/moogaloop.swf?clip_id=' +
      goog.string.urlEncode(videoId) +
      '&server=vimeo.com&show_title=1&show_byline=1&show_portrait=0color=&' +
      'fullscreen=1' + autoplay;
***REMOVED***


***REMOVED***
***REMOVED*** Gets the Vimeo video id.
***REMOVED*** @return {string} The Vimeo video id.
***REMOVED***
goog.ui.media.VimeoModel.prototype.getVideoId = function() {
  return this.videoId_;
***REMOVED***

