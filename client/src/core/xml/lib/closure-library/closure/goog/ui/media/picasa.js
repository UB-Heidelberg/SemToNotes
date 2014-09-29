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
***REMOVED*** @fileoverview provides a reusable picasa album UI component given a public
***REMOVED*** picasa album URL.
***REMOVED***
***REMOVED*** TODO(user): implement the javascript viewer, for users without flash. Get it
***REMOVED*** from the Gmail Picasa gadget.
***REMOVED***
***REMOVED*** goog.ui.media.PicasaAlbum is actually a {@link goog.ui.ControlRenderer}, a
***REMOVED*** stateless class - that could/should be used as a Singleton with the static
***REMOVED*** method {@code goog.ui.media.PicasaAlbum.getInstance} -, that knows how to
***REMOVED*** render picasa albums. It is designed to be used with a
***REMOVED*** {@link goog.ui.Control}, which will actually control the media renderer and
***REMOVED*** provide the {@link goog.ui.Component} base. This design guarantees that all
***REMOVED*** different types of medias will behave alike but will look different.
***REMOVED***
***REMOVED*** goog.ui.media.PicasaAlbum expects {@code goog.ui.media.PicasaAlbumModel}s on
***REMOVED*** {@code goog.ui.Control.getModel} as data models, and render a flash object
***REMOVED*** that will show a slideshow with the contents of that album URL.
***REMOVED***
***REMOVED*** Example of usage:
***REMOVED***
***REMOVED*** <pre>
***REMOVED***   var album = goog.ui.media.PicasaAlbumModel.newInstance(
***REMOVED***       'http://picasaweb.google.com/username/SanFranciscoCalifornia');
***REMOVED***   goog.ui.media.PicasaAlbum.newControl(album).render();
***REMOVED*** </pre>
***REMOVED***
***REMOVED*** picasa medias currently support the following states:
***REMOVED***
***REMOVED*** <ul>
***REMOVED***   <li> {@link goog.ui.Component.State.DISABLED}: shows 'flash not available'
***REMOVED***   <li> {@link goog.ui.Component.State.HOVER}: mouse cursor is over the album
***REMOVED***   <li> {@link goog.ui.Component.State.SELECTED}: flash album is shown
***REMOVED*** </ul>
***REMOVED***
***REMOVED*** Which can be accessed by
***REMOVED***
***REMOVED*** <pre>
***REMOVED***   picasa.setEnabled(true);
***REMOVED***   picasa.setHighlighted(true);
***REMOVED***   picasa.setSelected(true);
***REMOVED*** </pre>
***REMOVED***
***REMOVED***
***REMOVED*** @supported IE6, FF2+, Safari. Requires flash to actually work.
***REMOVED***
***REMOVED*** TODO(user): test on other browsers
***REMOVED***

goog.provide('goog.ui.media.PicasaAlbum');
goog.provide('goog.ui.media.PicasaAlbumModel');

goog.require('goog.object');
goog.require('goog.ui.media.FlashObject');
goog.require('goog.ui.media.Media');
goog.require('goog.ui.media.MediaModel');
goog.require('goog.ui.media.MediaModel.Player');
goog.require('goog.ui.media.MediaRenderer');



***REMOVED***
***REMOVED*** Subclasses a goog.ui.media.MediaRenderer to provide a Picasa specific media
***REMOVED*** renderer.
***REMOVED***
***REMOVED*** This class knows how to parse picasa URLs, and render the DOM structure
***REMOVED*** of picasa album players and previews. This class is meant to be used as a
***REMOVED*** singleton static stateless class, that takes {@code goog.ui.media.Media}
***REMOVED*** instances and renders it. It expects {@code goog.ui.media.Media.getModel} to
***REMOVED*** return a well formed, previously constructed, object with a user and album
***REMOVED*** fields {@see goog.ui.media.PicasaAlbum.parseUrl}, which is the data model
***REMOVED*** this renderer will use to construct the DOM structure.
***REMOVED*** {@see goog.ui.media.PicasaAlbum.newControl} for a example of constructing a
***REMOVED*** control with this renderer.
***REMOVED***
***REMOVED*** goog.ui.media.PicasaAlbum currently displays a picasa-made flash slideshow
***REMOVED*** with the photos, but could possibly display a handwritten js photo viewer,
***REMOVED*** in case flash is not available.
***REMOVED***
***REMOVED*** This design is patterned after http://go/closure_control_subclassing
***REMOVED***
***REMOVED*** It uses {@link goog.ui.media.FlashObject} to embed the flash object.
***REMOVED***
***REMOVED***
***REMOVED*** @extends {goog.ui.media.MediaRenderer}
***REMOVED***
goog.ui.media.PicasaAlbum = function() {
  goog.ui.media.MediaRenderer.call(this);
***REMOVED***
goog.inherits(goog.ui.media.PicasaAlbum, goog.ui.media.MediaRenderer);
goog.addSingletonGetter(goog.ui.media.PicasaAlbum);


***REMOVED***
***REMOVED*** Default CSS class to be applied to the root element of components rendered
***REMOVED*** by this renderer.
***REMOVED***
***REMOVED*** @type {string}
***REMOVED***
goog.ui.media.PicasaAlbum.CSS_CLASS = goog.getCssName('goog-ui-media-picasa');


***REMOVED***
***REMOVED*** A static convenient method to construct a goog.ui.media.Media control out of
***REMOVED*** a picasa data model. It sets it as the data model goog.ui.media.PicasaAlbum
***REMOVED*** renderer uses, sets the states supported by the renderer, and returns a
***REMOVED*** Control that binds everything together. This is what you should be using for
***REMOVED*** constructing Picasa albums, except if you need finer control over the
***REMOVED*** configuration.
***REMOVED***
***REMOVED*** @param {goog.ui.media.PicasaAlbumModel} dataModel A picasa album data model.
***REMOVED*** @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper, used for
***REMOVED***     document interaction.
***REMOVED*** @return {goog.ui.media.Media} A Control instance binded to the Picasa
***REMOVED***     renderer.
***REMOVED***
goog.ui.media.PicasaAlbum.newControl = function(dataModel, opt_domHelper) {
  var control = new goog.ui.media.Media(
      dataModel,
      goog.ui.media.PicasaAlbum.getInstance(),
      opt_domHelper);
  control.setSelected(true);
  return control;
***REMOVED***


***REMOVED***
***REMOVED*** Creates the initial DOM structure of the picasa album, which is basically a
***REMOVED*** the flash object pointing to a flash picasa album player.
***REMOVED***
***REMOVED*** @param {goog.ui.Control} c The media control.
***REMOVED*** @return {Element} The DOM structure that represents the control.
***REMOVED*** @override
***REMOVED***
goog.ui.media.PicasaAlbum.prototype.createDom = function(c) {
  var control =***REMOVED*****REMOVED*** @type {goog.ui.media.Media}***REMOVED*** (c);
  var div = goog.ui.media.PicasaAlbum.superClass_.createDom.call(this, control);

  var picasaAlbum =
     ***REMOVED*****REMOVED*** @type {goog.ui.media.PicasaAlbumModel}***REMOVED*** (control.getDataModel());
  var authParam =
      picasaAlbum.getAuthKey() ? ('&authkey=' + picasaAlbum.getAuthKey()) : '';
  var flash = new goog.ui.media.FlashObject(
      picasaAlbum.getPlayer().getUrl() || '',
      control.getDomHelper());
  flash.addFlashVars(picasaAlbum.getPlayer().getVars());
  flash.render(div);

  return div;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the CSS class to be applied to the root element of components
***REMOVED*** rendered using this renderer.
***REMOVED*** @return {string} Renderer-specific CSS class.
***REMOVED*** @override
***REMOVED***
goog.ui.media.PicasaAlbum.prototype.getCssClass = function() {
  return goog.ui.media.PicasaAlbum.CSS_CLASS;
***REMOVED***



***REMOVED***
***REMOVED*** The {@code goog.ui.media.PicasaAlbum} media data model. It stores a required
***REMOVED*** {@code userId} and {@code albumId} fields, sets the picasa album URL, and
***REMOVED*** allows a few optional parameters.
***REMOVED***
***REMOVED*** @param {string} userId The picasa userId associated with this album.
***REMOVED*** @param {string} albumId The picasa albumId associated with this album.
***REMOVED*** @param {string=} opt_authKey An optional authentication key, used on private
***REMOVED***     albums.
***REMOVED*** @param {string=} opt_caption An optional caption of the picasa album.
***REMOVED*** @param {string=} opt_description An optional description of the picasa album.
***REMOVED*** @param {boolean=} opt_autoplay Whether to autoplay the slideshow.
***REMOVED***
***REMOVED*** @extends {goog.ui.media.MediaModel}
***REMOVED***
goog.ui.media.PicasaAlbumModel = function(userId,
                                          albumId,
                                          opt_authKey,
                                          opt_caption,
                                          opt_description,
                                          opt_autoplay) {
  goog.ui.media.MediaModel.call(
      this,
      goog.ui.media.PicasaAlbumModel.buildUrl(userId, albumId),
      opt_caption,
      opt_description,
      goog.ui.media.MediaModel.MimeType.FLASH);

 ***REMOVED*****REMOVED***
  ***REMOVED*** The Picasa user id.
  ***REMOVED*** @type {string}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.userId_ = userId;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The Picasa album id.
  ***REMOVED*** @type {string}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.albumId_ = albumId;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The Picasa authentication key, used on private albums.
  ***REMOVED*** @type {?string}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.authKey_ = opt_authKey || null;

  var authParam = opt_authKey ? ('&authkey=' + opt_authKey) : '';

  var flashVars = {
    'host': 'picasaweb.google.com',
    'RGB': '0x000000',
    'feed': 'http://picasaweb.google.com/data/feed/api/user/' +
        userId + '/album/' + albumId + '?kind=photo&alt=rss' + authParam
 ***REMOVED*****REMOVED***
  flashVars[opt_autoplay ? 'autoplay' : 'noautoplay'] = '1';

  var player = new goog.ui.media.MediaModel.Player(
      'http://picasaweb.google.com/s/c/bin/slideshow.swf', flashVars);

  this.setPlayer(player);
***REMOVED***
goog.inherits(goog.ui.media.PicasaAlbumModel, goog.ui.media.MediaModel);


***REMOVED***
***REMOVED*** Regular expression used to extract the picasa username and albumid out of
***REMOVED*** picasa URLs.
***REMOVED***
***REMOVED*** Copied from http://go/markdownlite.js,
***REMOVED*** and {@link PicasaWebExtractor.xml}.
***REMOVED***
***REMOVED*** @type {RegExp}
***REMOVED*** @private
***REMOVED*** @const
***REMOVED***
goog.ui.media.PicasaAlbumModel.MATCHER_ =
    /https?:\/\/(?:www\.)?picasaweb\.(?:google\.)?com\/([\d\w\.]+)\/([\d\w_\-\.]+)(?:\?[\w\d\-_=&amp;;\.]*&?authKey=([\w\d\-_=;\.]+))?(?:#([\d]+)?)?/im;


***REMOVED***
***REMOVED*** Gets a {@code picasaUrl} and extracts the user and album id.
***REMOVED***
***REMOVED*** @param {string} picasaUrl A picasa album URL.
***REMOVED*** @param {string=} opt_caption An optional caption of the picasa album.
***REMOVED*** @param {string=} opt_description An optional description of the picasa album.
***REMOVED*** @param {boolean=} opt_autoplay Whether to autoplay the slideshow.
***REMOVED*** @return {goog.ui.media.PicasaAlbumModel} The picasa album data model that
***REMOVED***     represents the picasa URL.
***REMOVED*** @throws exception in case the parsing fails
***REMOVED***
goog.ui.media.PicasaAlbumModel.newInstance = function(picasaUrl,
                                                      opt_caption,
                                                      opt_description,
                                                      opt_autoplay) {
  if (goog.ui.media.PicasaAlbumModel.MATCHER_.test(picasaUrl)) {
    var data = goog.ui.media.PicasaAlbumModel.MATCHER_.exec(picasaUrl);
    return new goog.ui.media.PicasaAlbumModel(
        data[1], data[2], data[3], opt_caption, opt_description, opt_autoplay);
  }
  throw Error('failed to parse user and album from picasa url: ' + picasaUrl);
***REMOVED***


***REMOVED***
***REMOVED*** The opposite of {@code newInstance}: takes an {@code userId} and an
***REMOVED*** {@code albumId} and builds a URL.
***REMOVED***
***REMOVED*** @param {string} userId The user that owns the album.
***REMOVED*** @param {string} albumId The album id.
***REMOVED*** @return {string} The URL of the album.
***REMOVED***
goog.ui.media.PicasaAlbumModel.buildUrl = function(userId, albumId) {
  return 'http://picasaweb.google.com/' + userId + '/' + albumId;
***REMOVED***


***REMOVED***
***REMOVED*** Gets the Picasa user id.
***REMOVED*** @return {string} The Picasa user id.
***REMOVED***
goog.ui.media.PicasaAlbumModel.prototype.getUserId = function() {
  return this.userId_;
***REMOVED***


***REMOVED***
***REMOVED*** Gets the Picasa album id.
***REMOVED*** @return {string} The Picasa album id.
***REMOVED***
goog.ui.media.PicasaAlbumModel.prototype.getAlbumId = function() {
  return this.albumId_;
***REMOVED***


***REMOVED***
***REMOVED*** Gets the Picasa album authentication key.
***REMOVED*** @return {?string} The Picasa album authentication key.
***REMOVED***
goog.ui.media.PicasaAlbumModel.prototype.getAuthKey = function() {
  return this.authKey_;
***REMOVED***
