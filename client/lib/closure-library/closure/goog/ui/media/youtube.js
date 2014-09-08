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
***REMOVED*** @fileoverview provides a reusable youtube UI component given a youtube data
***REMOVED*** model.
***REMOVED***
***REMOVED*** goog.ui.media.Youtube is actually a {@link goog.ui.ControlRenderer}, a
***REMOVED*** stateless class - that could/should be used as a Singleton with the static
***REMOVED*** method {@code goog.ui.media.Youtube.getInstance} -, that knows how to render
***REMOVED*** youtube videos. It is designed to be used with a {@link goog.ui.Control},
***REMOVED*** which will actually control the media renderer and provide the
***REMOVED*** {@link goog.ui.Component} base. This design guarantees that all different
***REMOVED*** types of medias will behave alike but will look different.
***REMOVED***
***REMOVED*** goog.ui.media.Youtube expects {@code goog.ui.media.YoutubeModel} on
***REMOVED*** {@code goog.ui.Control.getModel} as data models, and render a flash object
***REMOVED*** that will play that URL.
***REMOVED***
***REMOVED*** Example of usage:
***REMOVED***
***REMOVED*** <pre>
***REMOVED***   var video = goog.ui.media.YoutubeModel.newInstance(
***REMOVED***       'http://www.youtube.com/watch?v=ddl5f44spwQ');
***REMOVED***   goog.ui.media.Youtube.newControl(video).render();
***REMOVED*** </pre>
***REMOVED***
***REMOVED*** youtube medias currently support the following states:
***REMOVED***
***REMOVED*** <ul>
***REMOVED***   <li> {@link goog.ui.Component.State.DISABLED}: shows 'flash not available'
***REMOVED***   <li> {@link goog.ui.Component.State.HOVER}: mouse cursor is over the video
***REMOVED***   <li> {@link !goog.ui.Component.State.SELECTED}: a static thumbnail is shown
***REMOVED***   <li> {@link goog.ui.Component.State.SELECTED}: video is playing
***REMOVED*** </ul>
***REMOVED***
***REMOVED*** Which can be accessed by
***REMOVED*** <pre>
***REMOVED***   youtube.setEnabled(true);
***REMOVED***   youtube.setHighlighted(true);
***REMOVED***   youtube.setSelected(true);
***REMOVED*** </pre>
***REMOVED***
***REMOVED*** This package also provides a few static auxiliary methods, such as:
***REMOVED***
***REMOVED*** <pre>
***REMOVED*** var videoId = goog.ui.media.Youtube.parseUrl(
***REMOVED***     'http://www.youtube.com/watch?v=ddl5f44spwQ');
***REMOVED*** </pre>
***REMOVED***
***REMOVED***
***REMOVED*** @supported IE6, FF2+, Safari. Requires flash to actually work.
***REMOVED***
***REMOVED*** TODO(user): test on other browsers
***REMOVED***


goog.provide('goog.ui.media.Youtube');
goog.provide('goog.ui.media.YoutubeModel');

goog.require('goog.string');
goog.require('goog.ui.Component');
goog.require('goog.ui.media.FlashObject');
goog.require('goog.ui.media.Media');
goog.require('goog.ui.media.MediaModel');
goog.require('goog.ui.media.MediaRenderer');



***REMOVED***
***REMOVED*** Subclasses a goog.ui.media.MediaRenderer to provide a Youtube specific media
***REMOVED*** renderer.
***REMOVED***
***REMOVED*** This class knows how to parse youtube urls, and render the DOM structure
***REMOVED*** of youtube video players and previews. This class is meant to be used as a
***REMOVED*** singleton static stateless class, that takes {@code goog.ui.media.Media}
***REMOVED*** instances and renders it. It expects {@code goog.ui.media.Media.getModel} to
***REMOVED*** return a well formed, previously constructed, youtube video id, which is the
***REMOVED*** data model this renderer will use to construct the DOM structure.
***REMOVED*** {@see goog.ui.media.Youtube.newControl} for a example of constructing a
***REMOVED*** control with this renderer.
***REMOVED***
***REMOVED*** goog.ui.media.Youtube currently supports all {@link goog.ui.Component.State}.
***REMOVED*** It will change its DOM structure between SELECTED and !SELECTED, and rely on
***REMOVED*** CSS definitions on the others. On !SELECTED, the renderer will render a
***REMOVED*** youtube static <img>, with a thumbnail of the video. On SELECTED, the
***REMOVED*** renderer will append to the DOM a flash object, that contains the youtube
***REMOVED*** video.
***REMOVED***
***REMOVED*** This design is patterned after http://go/closure_control_subclassing
***REMOVED***
***REMOVED*** It uses {@link goog.ui.media.FlashObject} to embed the flash object.
***REMOVED***
***REMOVED***
***REMOVED*** @extends {goog.ui.media.MediaRenderer}
***REMOVED*** @final
***REMOVED***
goog.ui.media.Youtube = function() {
  goog.ui.media.MediaRenderer.call(this);
***REMOVED***
goog.inherits(goog.ui.media.Youtube, goog.ui.media.MediaRenderer);
goog.addSingletonGetter(goog.ui.media.Youtube);


***REMOVED***
***REMOVED*** A static convenient method to construct a goog.ui.media.Media control out of
***REMOVED*** a youtube model. It sets it as the data model goog.ui.media.Youtube renderer
***REMOVED*** uses, sets the states supported by the renderer, and returns a Control that
***REMOVED*** binds everything together. This is what you should be using for constructing
***REMOVED*** Youtube videos, except if you need finer control over the configuration.
***REMOVED***
***REMOVED*** @param {goog.ui.media.YoutubeModel} youtubeModel The youtube data model.
***REMOVED*** @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper, used for
***REMOVED***     document interaction.
***REMOVED*** @return {!goog.ui.media.Media} A Control binded to the youtube renderer.
***REMOVED***
goog.ui.media.Youtube.newControl = function(youtubeModel, opt_domHelper) {
  var control = new goog.ui.media.Media(
      youtubeModel,
      goog.ui.media.Youtube.getInstance(),
      opt_domHelper);
  control.setStateInternal(goog.ui.Component.State.ACTIVE);
  return control;
***REMOVED***


***REMOVED***
***REMOVED*** Default CSS class to be applied to the root element of components rendered
***REMOVED*** by this renderer.
***REMOVED*** @type {string}
***REMOVED***
goog.ui.media.Youtube.CSS_CLASS = goog.getCssName('goog-ui-media-youtube');


***REMOVED***
***REMOVED*** Changes the state of a {@code control}. Currently only changes the DOM
***REMOVED*** structure when the youtube movie is SELECTED (by default fired by a MOUSEUP
***REMOVED*** on the thumbnail), which means we have to embed the youtube flash video and
***REMOVED*** play it.
***REMOVED***
***REMOVED*** @param {goog.ui.Control} c The media control.
***REMOVED*** @param {goog.ui.Component.State} state The state to be set or cleared.
***REMOVED*** @param {boolean} enable Whether the state is enabled or disabled.
***REMOVED*** @override
***REMOVED***
goog.ui.media.Youtube.prototype.setState = function(c, state, enable) {
  var control =***REMOVED*****REMOVED*** @type {goog.ui.media.Media}***REMOVED*** (c);
  goog.ui.media.Youtube.superClass_.setState.call(this, control, state, enable);

  // control.createDom has to be called before any state is set.
  // Use control.setStateInternal if you need to set states
  if (!control.getElement()) {
    throw Error(goog.ui.Component.Error.STATE_INVALID);
  }

  var domHelper = control.getDomHelper();
  var dataModel =
     ***REMOVED*****REMOVED*** @type {goog.ui.media.YoutubeModel}***REMOVED*** (control.getDataModel());

  if (!!(state & goog.ui.Component.State.SELECTED) && enable) {
    var flashEls = domHelper.getElementsByTagNameAndClass(
        'div',
        goog.ui.media.FlashObject.CSS_CLASS,
        control.getElement());
    if (flashEls.length > 0) {
      return;
    }
    var youtubeFlash = new goog.ui.media.FlashObject(
        dataModel.getPlayer().getUrl() || '',
        domHelper);
    control.addChild(youtubeFlash, true);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Returns the CSS class to be applied to the root element of components
***REMOVED*** rendered using this renderer.
***REMOVED***
***REMOVED*** @return {string} Renderer-specific CSS class.
***REMOVED*** @override
***REMOVED***
goog.ui.media.Youtube.prototype.getCssClass = function() {
  return goog.ui.media.Youtube.CSS_CLASS;
***REMOVED***



***REMOVED***
***REMOVED*** The {@code goog.ui.media.Youtube} media data model. It stores a required
***REMOVED*** {@code videoId} field, sets the youtube URL, and allows a few optional
***REMOVED*** parameters.
***REMOVED***
***REMOVED*** @param {string} videoId The youtube video id.
***REMOVED*** @param {string=} opt_caption An optional caption of the youtube video.
***REMOVED*** @param {string=} opt_description An optional description of the youtube
***REMOVED***     video.
***REMOVED***
***REMOVED*** @extends {goog.ui.media.MediaModel}
***REMOVED*** @final
***REMOVED***
goog.ui.media.YoutubeModel = function(videoId, opt_caption, opt_description) {
  goog.ui.media.MediaModel.call(
      this,
      goog.ui.media.YoutubeModel.buildUrl(videoId),
      opt_caption,
      opt_description,
      goog.ui.media.MediaModel.MimeType.FLASH);

 ***REMOVED*****REMOVED***
  ***REMOVED*** The Youtube video id.
  ***REMOVED*** @type {string}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.videoId_ = videoId;

  this.setThumbnails([new goog.ui.media.MediaModel.Thumbnail(
      goog.ui.media.YoutubeModel.getThumbnailUrl(videoId))]);

  this.setPlayer(new goog.ui.media.MediaModel.Player(
      goog.ui.media.YoutubeModel.getFlashUrl(videoId, true)));
***REMOVED***
goog.inherits(goog.ui.media.YoutubeModel, goog.ui.media.MediaModel);


***REMOVED***
***REMOVED*** A youtube regular expression matcher. It matches the VIDEOID of URLs like
***REMOVED*** http://www.youtube.com/watch?v=VIDEOID. Based on:
***REMOVED*** googledata/contentonebox/opencob/specs/common/YTPublicExtractorCard.xml
***REMOVED*** @type {RegExp}
***REMOVED*** @private
***REMOVED*** @const
***REMOVED***
// Be careful about the placement of the dashes in the character classes. Eg,
// use "[\\w=-]" instead of "[\\w-=]" if you mean to include the dash as a
// character and not create a character range like "[a-f]".
goog.ui.media.YoutubeModel.MATCHER_ = new RegExp(
    // Lead in.
    'https?://(?:[a-zA-Z]{1,3}\\.)?' +
    // Watch URL prefix.  This should handle new URLs of the form:
    // http://www.youtube.com/watch#!v=jqxENMKaeCU&feature=related
    // where the parameters appear after "#!" instead of "?".
    '(?:youtube\\.com/watch|youtu\\.be/watch)' +
    // Get the video id:
    // The video ID is a parameter v=[videoid] either right after the "?"
    // or after some other parameters.
    '(?:\\?(?:[\\w=-]+&(?:amp;)?)*v=([\\w-]+)' +
    '(?:&(?:amp;)?[\\w=-]+)*)?' +
    // Get any extra arguments in the URL's hash part.
    '(?:#[!]?(?:' +
    // Video ID from the v=[videoid] parameter, optionally surrounded by other
    // & separated parameters.
    '(?:(?:[\\w=-]+&(?:amp;)?)*(?:v=([\\w-]+))' +
    '(?:&(?:amp;)?[\\w=-]+)*)' +
    '|' +
    // Continue supporting "?" for the video ID
    // and "#" for other hash parameters.
    '(?:[\\w=&-]+)' +
    '))?' +
    // Should terminate with a non-word, non-dash (-) character.
    '[^\\w-]?', 'i');


***REMOVED***
***REMOVED*** A auxiliary static method that parses a youtube URL, extracting the ID of the
***REMOVED*** video, and builds a YoutubeModel.
***REMOVED***
***REMOVED*** @param {string} youtubeUrl A youtube URL.
***REMOVED*** @param {string=} opt_caption An optional caption of the youtube video.
***REMOVED*** @param {string=} opt_description An optional description of the youtube
***REMOVED***     video.
***REMOVED*** @return {!goog.ui.media.YoutubeModel} The data model that represents the
***REMOVED***     youtube URL.
***REMOVED*** @see goog.ui.media.YoutubeModel.getVideoId()
***REMOVED*** @throws Error in case the parsing fails.
***REMOVED***
goog.ui.media.YoutubeModel.newInstance = function(youtubeUrl,
                                                  opt_caption,
                                                  opt_description) {
  var extract = goog.ui.media.YoutubeModel.MATCHER_.exec(youtubeUrl);
  if (extract) {
    var videoId = extract[1] || extract[2];
    return new goog.ui.media.YoutubeModel(
        videoId, opt_caption, opt_description);
  }

  throw Error('failed to parse video id from youtube url: ' + youtubeUrl);
***REMOVED***


***REMOVED***
***REMOVED*** The opposite of {@code goog.ui.media.Youtube.newInstance}: it takes a videoId
***REMOVED*** and returns a youtube URL.
***REMOVED***
***REMOVED*** @param {string} videoId The youtube video ID.
***REMOVED*** @return {string} The youtube URL.
***REMOVED***
goog.ui.media.YoutubeModel.buildUrl = function(videoId) {
  return 'http://www.youtube.com/watch?v=' + goog.string.urlEncode(videoId);
***REMOVED***


***REMOVED***
***REMOVED*** A static auxiliary method that builds a static image URL with a preview of
***REMOVED*** the youtube video.
***REMOVED***
***REMOVED*** NOTE(user): patterned after Gmail's gadgets/youtube,
***REMOVED***
***REMOVED*** TODO(user): how do I specify the width/height of the resulting image on the
***REMOVED*** url ? is there an official API for http://ytimg.com ?
***REMOVED***
***REMOVED*** @param {string} youtubeId The youtube video ID.
***REMOVED*** @return {string} An URL that contains an image with a preview of the youtube
***REMOVED***     movie.
***REMOVED***
goog.ui.media.YoutubeModel.getThumbnailUrl = function(youtubeId) {
  return 'http://i.ytimg.com/vi/' + youtubeId + '/default.jpg';
***REMOVED***


***REMOVED***
***REMOVED*** A static auxiliary method that builds URL of the flash movie to be embedded,
***REMOVED*** out of the youtube video id.
***REMOVED***
***REMOVED*** @param {string} videoId The youtube video ID.
***REMOVED*** @param {boolean=} opt_autoplay Whether the flash movie should start playing
***REMOVED***     as soon as it is shown, or if it should show a 'play' button.
***REMOVED*** @return {string} The flash URL to be embedded on the page.
***REMOVED***
goog.ui.media.YoutubeModel.getFlashUrl = function(videoId, opt_autoplay) {
  var autoplay = opt_autoplay ? '&autoplay=1' : '';
  // YouTube video ids are extracted from youtube URLs, which are user
  // generated input. the video id is later used to embed a flash object,
  // which is generated through HTML construction. We goog.string.urlEncode
  // the video id to make sure the URL is safe to be embedded.
  return 'http://www.youtube.com/v/' + goog.string.urlEncode(videoId) +
      '&hl=en&fs=1' + autoplay;
***REMOVED***


***REMOVED***
***REMOVED*** Gets the Youtube video id.
***REMOVED*** @return {string} The Youtube video id.
***REMOVED***
goog.ui.media.YoutubeModel.prototype.getVideoId = function() {
  return this.videoId_;
***REMOVED***
