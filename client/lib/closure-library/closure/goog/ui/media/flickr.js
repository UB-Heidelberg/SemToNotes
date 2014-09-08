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
***REMOVED*** @fileoverview provides a reusable FlickrSet photo UI component given a public
***REMOVED*** FlickrSetModel.
***REMOVED***
***REMOVED*** goog.ui.media.FlickrSet is actually a {@link goog.ui.ControlRenderer}, a
***REMOVED*** stateless class - that could/should be used as a Singleton with the static
***REMOVED*** method {@code goog.ui.media.FlickrSet.getInstance} -, that knows how to
***REMOVED*** render Flickr sets. It is designed to be used with a {@link goog.ui.Control},
***REMOVED*** which will actually control the media renderer and provide the
***REMOVED*** {@link goog.ui.Component} base. This design guarantees that all different
***REMOVED*** types of medias will behave alike but will look different.
***REMOVED***
***REMOVED*** goog.ui.media.FlickrSet expects a {@code goog.ui.media.FlickrSetModel} on
***REMOVED*** {@code goog.ui.Control.getModel} as data models, and renders a flash object
***REMOVED*** that will show the contents of that set.
***REMOVED***
***REMOVED*** Example of usage:
***REMOVED***
***REMOVED*** <pre>
***REMOVED***   var flickrSet = goog.ui.media.FlickrSetModel.newInstance(flickrSetUrl);
***REMOVED***   goog.ui.media.FlickrSet.newControl(flickrSet).render();
***REMOVED*** </pre>
***REMOVED***
***REMOVED*** FlickrSet medias currently support the following states:
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
***REMOVED*** TODO(user): Support non flash users. Maybe show a link to the Flick set,
***REMOVED*** or fetch the data and rendering it using javascript (instead of a broken
***REMOVED*** 'You need to install flash' message).
***REMOVED***

goog.provide('goog.ui.media.FlickrSet');
goog.provide('goog.ui.media.FlickrSetModel');

goog.require('goog.ui.media.FlashObject');
goog.require('goog.ui.media.Media');
goog.require('goog.ui.media.MediaModel');
goog.require('goog.ui.media.MediaRenderer');



***REMOVED***
***REMOVED*** Subclasses a goog.ui.media.MediaRenderer to provide a FlickrSet specific
***REMOVED*** media renderer.
***REMOVED***
***REMOVED*** This class knows how to parse FlickrSet URLs, and render the DOM structure
***REMOVED*** of flickr set players. This class is meant to be used as a singleton static
***REMOVED*** stateless class, that takes {@code goog.ui.media.Media} instances and renders
***REMOVED*** it. It expects {@code goog.ui.media.Media.getModel} to return a well formed,
***REMOVED*** previously constructed, set id {@see goog.ui.media.FlickrSet.parseUrl},
***REMOVED*** which is the data model this renderer will use to construct the DOM
***REMOVED*** structure. {@see goog.ui.media.FlickrSet.newControl} for a example of
***REMOVED*** constructing a control with this renderer.
***REMOVED***
***REMOVED*** This design is patterned after
***REMOVED*** http://go/closure_control_subclassing
***REMOVED***
***REMOVED*** It uses {@link goog.ui.media.FlashObject} to embed the flash object.
***REMOVED***
***REMOVED***
***REMOVED*** @extends {goog.ui.media.MediaRenderer}
***REMOVED*** @final
***REMOVED***
goog.ui.media.FlickrSet = function() {
  goog.ui.media.MediaRenderer.call(this);
***REMOVED***
goog.inherits(goog.ui.media.FlickrSet, goog.ui.media.MediaRenderer);
goog.addSingletonGetter(goog.ui.media.FlickrSet);


***REMOVED***
***REMOVED*** Default CSS class to be applied to the root element of components rendered
***REMOVED*** by this renderer.
***REMOVED***
***REMOVED*** @type {string}
***REMOVED***
goog.ui.media.FlickrSet.CSS_CLASS = goog.getCssName('goog-ui-media-flickrset');


***REMOVED***
***REMOVED*** Flash player URL. Uses Flickr's flash player by default.
***REMOVED***
***REMOVED*** @type {string}
***REMOVED*** @private
***REMOVED***
goog.ui.media.FlickrSet.flashUrl_ =
    'http://www.flickr.com/apps/slideshow/show.swf?v=63961';


***REMOVED***
***REMOVED*** A static convenient method to construct a goog.ui.media.Media control out of
***REMOVED*** a FlickrSet URL. It extracts the set id information on the URL, sets it
***REMOVED*** as the data model goog.ui.media.FlickrSet renderer uses, sets the states
***REMOVED*** supported by the renderer, and returns a Control that binds everything
***REMOVED*** together. This is what you should be using for constructing FlickrSet videos,
***REMOVED*** except if you need more fine control over the configuration.
***REMOVED***
***REMOVED*** @param {goog.ui.media.FlickrSetModel} dataModel The Flickr Set data model.
***REMOVED*** @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper, used for
***REMOVED***     document interaction.
***REMOVED*** @return {!goog.ui.media.Media} A Control binded to the FlickrSet renderer.
***REMOVED*** @throws exception in case {@code flickrSetUrl} is an invalid flickr set URL.
***REMOVED*** TODO(user): use {@link goog.ui.media.MediaModel} once it is checked in.
***REMOVED***
goog.ui.media.FlickrSet.newControl = function(dataModel, opt_domHelper) {
  var control = new goog.ui.media.Media(
      dataModel, goog.ui.media.FlickrSet.getInstance(), opt_domHelper);
  control.setSelected(true);
  return control;
***REMOVED***


***REMOVED***
***REMOVED*** A static method that sets which flash URL this class should use. Use this if
***REMOVED*** you want to host your own flash flickr player.
***REMOVED***
***REMOVED*** @param {string} flashUrl The URL of the flash flickr player.
***REMOVED***
goog.ui.media.FlickrSet.setFlashUrl = function(flashUrl) {
  goog.ui.media.FlickrSet.flashUrl_ = flashUrl;
***REMOVED***


***REMOVED***
***REMOVED*** Creates the initial DOM structure of the flickr set, which is basically a
***REMOVED*** the flash object pointing to a flickr set player.
***REMOVED***
***REMOVED*** @param {goog.ui.Control} c The media control.
***REMOVED*** @return {!Element} The DOM structure that represents this control.
***REMOVED*** @override
***REMOVED***
goog.ui.media.FlickrSet.prototype.createDom = function(c) {
  var control =***REMOVED*****REMOVED*** @type {goog.ui.media.Media}***REMOVED*** (c);
  var div = goog.ui.media.FlickrSet.superClass_.createDom.call(this, control);

  var model =
     ***REMOVED*****REMOVED*** @type {goog.ui.media.FlickrSetModel}***REMOVED*** (control.getDataModel());

  // TODO(user): find out what is the policy about hosting this SWF. figure out
  // if it works over https.
  var flash = new goog.ui.media.FlashObject(
      model.getPlayer().getUrl() || '',
      control.getDomHelper());
  flash.addFlashVars(model.getPlayer().getVars());
  flash.render(div);

  return div;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the CSS class to be applied to the root element of components
***REMOVED*** rendered using this renderer.
***REMOVED*** @return {string} Renderer-specific CSS class.
***REMOVED*** @override
***REMOVED***
goog.ui.media.FlickrSet.prototype.getCssClass = function() {
  return goog.ui.media.FlickrSet.CSS_CLASS;
***REMOVED***



***REMOVED***
***REMOVED*** The {@code goog.ui.media.FlickrAlbum} media data model. It stores a required
***REMOVED*** {@code userId} and {@code setId} fields, sets the flickr Set URL, and
***REMOVED*** allows a few optional parameters.
***REMOVED***
***REMOVED*** @param {string} userId The flickr userId associated with this set.
***REMOVED*** @param {string} setId The flickr setId associated with this set.
***REMOVED*** @param {string=} opt_caption An optional caption of the flickr set.
***REMOVED*** @param {string=} opt_description An optional description of the flickr set.
***REMOVED***
***REMOVED*** @extends {goog.ui.media.MediaModel}
***REMOVED*** @final
***REMOVED***
goog.ui.media.FlickrSetModel = function(userId,
                                        setId,
                                        opt_caption,
                                        opt_description) {
  goog.ui.media.MediaModel.call(
      this,
      goog.ui.media.FlickrSetModel.buildUrl(userId, setId),
      opt_caption,
      opt_description,
      goog.ui.media.MediaModel.MimeType.FLASH);

 ***REMOVED*****REMOVED***
  ***REMOVED*** The Flickr user id.
  ***REMOVED*** @type {string}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.userId_ = userId;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The Flickr set id.
  ***REMOVED*** @type {string}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.setId_ = setId;

  var flashVars = {
    'offsite': 'true',
    'lang': 'en',
    'page_show_url': '/photos/' + userId + '/sets/' + setId + '/show/',
    'page_show_back_url': '/photos/' + userId + '/sets/' + setId,
    'set_id': setId
 ***REMOVED*****REMOVED***

  var player = new goog.ui.media.MediaModel.Player(
      goog.ui.media.FlickrSet.flashUrl_, flashVars);

  this.setPlayer(player);
***REMOVED***
goog.inherits(goog.ui.media.FlickrSetModel, goog.ui.media.MediaModel);


***REMOVED***
***REMOVED*** Regular expression used to extract the username and set id out of the flickr
***REMOVED*** URLs.
***REMOVED***
***REMOVED*** Copied from http://go/markdownlite.js and {@link FlickrExtractor.xml}.
***REMOVED***
***REMOVED*** @type {RegExp}
***REMOVED*** @private
***REMOVED*** @const
***REMOVED***
goog.ui.media.FlickrSetModel.MATCHER_ =
    /(?:http:\/\/)?(?:www\.)?flickr\.com\/(?:photos\/([\d\w@\-]+)\/sets\/(\d+))\/?/i;


***REMOVED***
***REMOVED*** Takes a {@code flickrSetUrl} and extracts the flickr username and set id.
***REMOVED***
***REMOVED*** @param {string} flickrSetUrl A Flickr set URL.
***REMOVED*** @param {string=} opt_caption An optional caption of the flickr set.
***REMOVED*** @param {string=} opt_description An optional description of the flickr set.
***REMOVED*** @return {!goog.ui.media.FlickrSetModel} The data model that represents the
***REMOVED***     Flickr set.
***REMOVED*** @throws exception in case the parsing fails
***REMOVED***
goog.ui.media.FlickrSetModel.newInstance = function(flickrSetUrl,
                                                    opt_caption,
                                                    opt_description) {
  if (goog.ui.media.FlickrSetModel.MATCHER_.test(flickrSetUrl)) {
    var data = goog.ui.media.FlickrSetModel.MATCHER_.exec(flickrSetUrl);
    return new goog.ui.media.FlickrSetModel(
        data[1], data[2], opt_caption, opt_description);
  }
  throw Error('failed to parse flickr url: ' + flickrSetUrl);
***REMOVED***


***REMOVED***
***REMOVED*** Takes a flickr username and set id and returns an URL.
***REMOVED***
***REMOVED*** @param {string} userId The owner of the set.
***REMOVED*** @param {string} setId The set id.
***REMOVED*** @return {string} The URL of the set.
***REMOVED***
goog.ui.media.FlickrSetModel.buildUrl = function(userId, setId) {
  return 'http://flickr.com/photos/' + userId + '/sets/' + setId;
***REMOVED***


***REMOVED***
***REMOVED*** Gets the Flickr user id.
***REMOVED*** @return {string} The Flickr user id.
***REMOVED***
goog.ui.media.FlickrSetModel.prototype.getUserId = function() {
  return this.userId_;
***REMOVED***


***REMOVED***
***REMOVED*** Gets the Flickr set id.
***REMOVED*** @return {string} The Flickr set id.
***REMOVED***
goog.ui.media.FlickrSetModel.prototype.getSetId = function() {
  return this.setId_;
***REMOVED***
