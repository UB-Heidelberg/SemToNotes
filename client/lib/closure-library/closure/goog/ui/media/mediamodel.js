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
***REMOVED*** @fileoverview Provides the base media model consistent with the Yahoo Media
***REMOVED*** RSS specification {@link http://search.yahoo.com/mrss/}.
***REMOVED***

goog.provide('goog.ui.media.MediaModel');
goog.provide('goog.ui.media.MediaModel.Category');
goog.provide('goog.ui.media.MediaModel.Credit');
goog.provide('goog.ui.media.MediaModel.Credit.Role');
goog.provide('goog.ui.media.MediaModel.Credit.Scheme');
goog.provide('goog.ui.media.MediaModel.Medium');
goog.provide('goog.ui.media.MediaModel.MimeType');
goog.provide('goog.ui.media.MediaModel.Player');
goog.provide('goog.ui.media.MediaModel.SubTitle');
goog.provide('goog.ui.media.MediaModel.Thumbnail');

goog.require('goog.array');



***REMOVED***
***REMOVED*** An base data value class for all media data models.
***REMOVED***
***REMOVED*** MediaModels are exact matches to the fields defined in the Yahoo RSS media
***REMOVED*** specification {@link http://search.yahoo.com/mrss/}.
***REMOVED***
***REMOVED*** The current common data shared by medias is to have URLs, mime types,
***REMOVED*** captions, descriptions, thumbnails and players. Some of these may not be
***REMOVED*** available, or applications may not want to render them, so {@code null}
***REMOVED*** values are allowed. {@code goog.ui.media.MediaRenderer} checks whether the
***REMOVED*** values are available before creating DOMs for them.
***REMOVED***
***REMOVED*** TODO(user): support asynchronous data models by subclassing
***REMOVED*** {@link goog.events.EventTarget} or {@link goog.ds.DataNode}. Understand why
***REMOVED*** {@link http://goto/datanode} is not available in closure. Add setters to
***REMOVED*** MediaModel once this is supported.
***REMOVED***
***REMOVED*** @param {string=} opt_url An optional URL of the media.
***REMOVED*** @param {string=} opt_caption An optional caption of the media.
***REMOVED*** @param {string=} opt_description An optional description of the media.
***REMOVED*** @param {goog.ui.media.MediaModel.MimeType=} opt_type The type of the media.
***REMOVED*** @param {goog.ui.media.MediaModel.Medium=} opt_medium The medium of the media.
***REMOVED*** @param {number=} opt_duration The duration of the media in seconds.
***REMOVED*** @param {number=} opt_width The width of the media in pixels.
***REMOVED*** @param {number=} opt_height The height of the media in pixels.
***REMOVED***
***REMOVED***
goog.ui.media.MediaModel = function(opt_url,
                                    opt_caption,
                                    opt_description,
                                    opt_type,
                                    opt_medium,
                                    opt_duration,
                                    opt_width,
                                    opt_height) {
 ***REMOVED*****REMOVED***
  ***REMOVED*** The URL of the media.
  ***REMOVED*** @type {string|undefined}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.url_ = opt_url;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The caption of the media.
  ***REMOVED*** @type {string|undefined}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.caption_ = opt_caption;

 ***REMOVED*****REMOVED***
  ***REMOVED*** A description of the media, typically user generated comments about it.
  ***REMOVED*** @type {string|undefined}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.description_ = opt_description;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The mime type of the media.
  ***REMOVED*** @type {goog.ui.media.MediaModel.MimeType|undefined}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.type_ = opt_type;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The medium of the media.
  ***REMOVED*** @type {goog.ui.media.MediaModel.Medium|undefined}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.medium_ = opt_medium;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The duration of the media in seconds.
  ***REMOVED*** @type {number|undefined}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.duration_ = opt_duration;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The width of the media in pixels.
  ***REMOVED*** @type {number|undefined}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.width_ = opt_width;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The height of the media in pixels.
  ***REMOVED*** @type {number|undefined}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.height_ = opt_height;

 ***REMOVED*****REMOVED***
  ***REMOVED*** A list of thumbnails representations of the media (eg different sizes of
  ***REMOVED*** the same photo, etc).
  ***REMOVED*** @type {Array.<goog.ui.media.MediaModel.Thumbnail>}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.thumbnails_ = [];

 ***REMOVED*****REMOVED***
  ***REMOVED*** The list of categories that are applied to this media.
  ***REMOVED*** @type {Array.<goog.ui.media.MediaModel.Category>}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.categories_ = [];

 ***REMOVED*****REMOVED***
  ***REMOVED*** The list of credits that pertain to this media object.
  ***REMOVED*** @type {!Array.<goog.ui.media.MediaModel.Credit>}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.credits_ = [];

 ***REMOVED*****REMOVED***
  ***REMOVED*** The list of subtitles for the media object.
  ***REMOVED*** @type {Array.<goog.ui.media.MediaModel.SubTitle>}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.subTitles_ = [];
***REMOVED***


***REMOVED***
***REMOVED*** The supported media mime types, a subset of the media types found here:
***REMOVED*** {@link http://www.iana.org/assignments/media-types/} and here
***REMOVED*** {@link http://en.wikipedia.org/wiki/Internet_media_type}
***REMOVED*** @enum {string}
***REMOVED***
goog.ui.media.MediaModel.MimeType = {
  HTML: 'text/html',
  PLAIN: 'text/plain',
  FLASH: 'application/x-shockwave-flash',
  JPEG: 'image/jpeg',
  GIF: 'image/gif',
  PNG: 'image/png'
***REMOVED***


***REMOVED***
***REMOVED*** Supported mediums, found here:
***REMOVED*** {@link http://video.search.yahoo.com/mrss}
***REMOVED*** @enum {string}
***REMOVED***
goog.ui.media.MediaModel.Medium = {
  IMAGE: 'image',
  AUDIO: 'audio',
  VIDEO: 'video',
  DOCUMENT: 'document',
  EXECUTABLE: 'executable'
***REMOVED***


***REMOVED***
***REMOVED*** The media player.
***REMOVED*** @type {goog.ui.media.MediaModel.Player}
***REMOVED*** @private
***REMOVED***
goog.ui.media.MediaModel.prototype.player_;


***REMOVED***
***REMOVED*** Gets the URL of this media.
***REMOVED*** @return {string|undefined} The URL of the media.
***REMOVED***
goog.ui.media.MediaModel.prototype.getUrl = function() {
  return this.url_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the URL of this media.
***REMOVED*** @param {string} url The URL of the media.
***REMOVED*** @return {!goog.ui.media.MediaModel} The object itself, used for chaining.
***REMOVED***
goog.ui.media.MediaModel.prototype.setUrl = function(url) {
  this.url_ = url;
  return this;
***REMOVED***


***REMOVED***
***REMOVED*** Gets the caption of this media.
***REMOVED*** @return {string|undefined} The caption of the media.
***REMOVED***
goog.ui.media.MediaModel.prototype.getCaption = function() {
  return this.caption_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the caption of this media.
***REMOVED*** @param {string} caption The caption of the media.
***REMOVED*** @return {!goog.ui.media.MediaModel} The object itself, used for chaining.
***REMOVED***
goog.ui.media.MediaModel.prototype.setCaption = function(caption) {
  this.caption_ = caption;
  return this;
***REMOVED***


***REMOVED***
***REMOVED*** Gets the media mime type.
***REMOVED*** @return {goog.ui.media.MediaModel.MimeType|undefined} The media mime type.
***REMOVED***
goog.ui.media.MediaModel.prototype.getType = function() {
  return this.type_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the media mime type.
***REMOVED*** @param {goog.ui.media.MediaModel.MimeType} type The media mime type.
***REMOVED*** @return {!goog.ui.media.MediaModel} The object itself, used for chaining.
***REMOVED***
goog.ui.media.MediaModel.prototype.setType = function(type) {
  this.type_ = type;
  return this;
***REMOVED***


***REMOVED***
***REMOVED*** Gets the media medium.
***REMOVED*** @return {goog.ui.media.MediaModel.Medium|undefined} The media medium.
***REMOVED***
goog.ui.media.MediaModel.prototype.getMedium = function() {
  return this.medium_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the media medium.
***REMOVED*** @param {goog.ui.media.MediaModel.Medium} medium The media medium.
***REMOVED*** @return {!goog.ui.media.MediaModel} The object itself, used for chaining.
***REMOVED***
goog.ui.media.MediaModel.prototype.setMedium = function(medium) {
  this.medium_ = medium;
  return this;
***REMOVED***


***REMOVED***
***REMOVED*** Gets the description of this media.
***REMOVED*** @return {string|undefined} The description of the media.
***REMOVED***
goog.ui.media.MediaModel.prototype.getDescription = function() {
  return this.description_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the description of this media.
***REMOVED*** @param {string} description The description of the media.
***REMOVED*** @return {!goog.ui.media.MediaModel} The object itself, used for chaining.
***REMOVED***
goog.ui.media.MediaModel.prototype.setDescription = function(description) {
  this.description_ = description;
  return this;
***REMOVED***


***REMOVED***
***REMOVED*** Gets the thumbnail urls.
***REMOVED*** @return {Array.<goog.ui.media.MediaModel.Thumbnail>} The list of thumbnails.
***REMOVED***
goog.ui.media.MediaModel.prototype.getThumbnails = function() {
  return this.thumbnails_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the thumbnail list.
***REMOVED*** @param {Array.<goog.ui.media.MediaModel.Thumbnail>} thumbnails The list of
***REMOVED***     thumbnail.
***REMOVED*** @return {!goog.ui.media.MediaModel} The object itself, used for chaining.
***REMOVED***
goog.ui.media.MediaModel.prototype.setThumbnails = function(thumbnails) {
  this.thumbnails_ = thumbnails;
  return this;
***REMOVED***


***REMOVED***
***REMOVED*** Gets the duration of the media.
***REMOVED*** @return {number|undefined} The duration in seconds.
***REMOVED***
goog.ui.media.MediaModel.prototype.getDuration = function() {
  return this.duration_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets duration of the media.
***REMOVED*** @param {number} duration The duration of the media, in seconds.
***REMOVED*** @return {!goog.ui.media.MediaModel} The object itself, used for chaining.
***REMOVED***
goog.ui.media.MediaModel.prototype.setDuration = function(duration) {
  this.duration_ = duration;
  return this;
***REMOVED***


***REMOVED***
***REMOVED*** Gets the width of the media in pixels.
***REMOVED*** @return {number|undefined} The width in pixels.
***REMOVED***
goog.ui.media.MediaModel.prototype.getWidth = function() {
  return this.width_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the width of the media.
***REMOVED*** @param {number} width The width of the media, in pixels.
***REMOVED*** @return {!goog.ui.media.MediaModel} The object itself, used for chaining.
***REMOVED***
goog.ui.media.MediaModel.prototype.setWidth = function(width) {
  this.width_ = width;
  return this;
***REMOVED***


***REMOVED***
***REMOVED*** Gets the height of the media in pixels.
***REMOVED*** @return {number|undefined} The height in pixels.
***REMOVED***
goog.ui.media.MediaModel.prototype.getHeight = function() {
  return this.height_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the height of the media.
***REMOVED*** @param {number} height The height of the media, in pixels.
***REMOVED*** @return {!goog.ui.media.MediaModel} The object itself, used for chaining.
***REMOVED***
goog.ui.media.MediaModel.prototype.setHeight = function(height) {
  this.height_ = height;
  return this;
***REMOVED***


***REMOVED***
***REMOVED*** Gets the player data.
***REMOVED*** @return {goog.ui.media.MediaModel.Player|undefined} The media player data.
***REMOVED***
goog.ui.media.MediaModel.prototype.getPlayer = function() {
  return this.player_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the player data.
***REMOVED*** @param {goog.ui.media.MediaModel.Player} player The media player data.
***REMOVED*** @return {!goog.ui.media.MediaModel} The object itself, used for chaining.
***REMOVED***
goog.ui.media.MediaModel.prototype.setPlayer = function(player) {
  this.player_ = player;
  return this;
***REMOVED***


***REMOVED***
***REMOVED*** Gets the categories of the media.
***REMOVED*** @return {Array.<goog.ui.media.MediaModel.Category>} The categories of the
***REMOVED***     media.
***REMOVED***
goog.ui.media.MediaModel.prototype.getCategories = function() {
  return this.categories_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the categories of the media
***REMOVED*** @param {Array.<goog.ui.media.MediaModel.Category>} categories The categories
***REMOVED***     of the media.
***REMOVED*** @return {!goog.ui.media.MediaModel} The object itself, used for chaining.
***REMOVED***
goog.ui.media.MediaModel.prototype.setCategories = function(categories) {
  this.categories_ = categories;
  return this;
***REMOVED***


***REMOVED***
***REMOVED*** Finds the first category with the given scheme.
***REMOVED*** @param {string} scheme The scheme to search for.
***REMOVED*** @return {goog.ui.media.MediaModel.Category} The category that has the
***REMOVED***     given scheme. May be null.
***REMOVED***
goog.ui.media.MediaModel.prototype.findCategoryWithScheme = function(scheme) {
  if (!this.categories_) {
    return null;
  }
  var category = goog.array.find(this.categories_, function(category) {
    return category ? (scheme == category.getScheme()) : false;
  });
  return***REMOVED*****REMOVED*** @type {goog.ui.media.MediaModel.Category}***REMOVED*** (category);
***REMOVED***


***REMOVED***
***REMOVED*** Gets the credits of the media.
***REMOVED*** @return {!Array.<goog.ui.media.MediaModel.Credit>} The credits of the media.
***REMOVED***
goog.ui.media.MediaModel.prototype.getCredits = function() {
  return this.credits_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the credits of the media
***REMOVED*** @param {!Array.<goog.ui.media.MediaModel.Credit>} credits The credits of the
***REMOVED***     media.
***REMOVED*** @return {!goog.ui.media.MediaModel} The object itself, used for chaining.
***REMOVED***
goog.ui.media.MediaModel.prototype.setCredits = function(credits) {
  this.credits_ = credits;
  return this;
***REMOVED***


***REMOVED***
***REMOVED*** Finds all credits with the given role.
***REMOVED*** @param {string} role The role to search for.
***REMOVED*** @return {!Array.<!goog.ui.media.MediaModel.Credit>} An array of credits
***REMOVED***     with the given role. May be empty.
***REMOVED***
goog.ui.media.MediaModel.prototype.findCreditsWithRole = function(role) {
  var credits = goog.array.filter(this.credits_, function(credit) {
    return role == credit.getRole();
  });
  return***REMOVED*****REMOVED*** @type {!Array.<!goog.ui.media.MediaModel.Credit>}***REMOVED*** (credits);
***REMOVED***


***REMOVED***
***REMOVED*** Gets the subtitles for the media.
***REMOVED*** @return {Array.<goog.ui.media.MediaModel.SubTitle>} The subtitles.
***REMOVED***
goog.ui.media.MediaModel.prototype.getSubTitles = function() {
  return this.subTitles_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the subtitles for the media
***REMOVED*** @param {Array.<goog.ui.media.MediaModel.SubTitle>} subtitles The subtitles.
***REMOVED*** @return {!goog.ui.media.MediaModel} The object itself.
***REMOVED***
goog.ui.media.MediaModel.prototype.setSubTitles = function(subtitles) {
  this.subTitles_ = subtitles;
  return this;
***REMOVED***



***REMOVED***
***REMOVED*** Constructs a thumbnail containing details of the thumbnail's image URL and
***REMOVED*** optionally its size.
***REMOVED*** @param {string} url The URL of the thumbnail's image.
***REMOVED*** @param {goog.math.Size=} opt_size The size of the thumbnail's image if known.
***REMOVED***
***REMOVED*** @final
***REMOVED***
goog.ui.media.MediaModel.Thumbnail = function(url, opt_size) {
 ***REMOVED*****REMOVED***
  ***REMOVED*** The thumbnail's image URL.
  ***REMOVED*** @type {string}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.url_ = url;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The size of the thumbnail's image if known.
  ***REMOVED*** @type {goog.math.Size}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.size_ = opt_size || null;
***REMOVED***


***REMOVED***
***REMOVED*** Gets the thumbnail URL.
***REMOVED*** @return {string} The thumbnail's image URL.
***REMOVED***
goog.ui.media.MediaModel.Thumbnail.prototype.getUrl = function() {
  return this.url_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the thumbnail URL.
***REMOVED*** @param {string} url The thumbnail's image URL.
***REMOVED*** @return {!goog.ui.media.MediaModel.Thumbnail} The object itself, used for
***REMOVED***     chaining.
***REMOVED***
goog.ui.media.MediaModel.Thumbnail.prototype.setUrl = function(url) {
  this.url_ = url;
  return this;
***REMOVED***


***REMOVED***
***REMOVED*** Gets the thumbnail size.
***REMOVED*** @return {goog.math.Size} The size of the thumbnail's image if known.
***REMOVED***
goog.ui.media.MediaModel.Thumbnail.prototype.getSize = function() {
  return this.size_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the thumbnail size.
***REMOVED*** @param {goog.math.Size} size The size of the thumbnail's image.
***REMOVED*** @return {!goog.ui.media.MediaModel.Thumbnail} The object itself, used for
***REMOVED***     chaining.
***REMOVED***
goog.ui.media.MediaModel.Thumbnail.prototype.setSize = function(size) {
  this.size_ = size;
  return this;
***REMOVED***



***REMOVED***
***REMOVED*** Constructs a player containing details of the player's URL and
***REMOVED*** optionally its size.
***REMOVED*** @param {string} url The URL of the player.
***REMOVED*** @param {Object=} opt_vars Optional map of arguments to the player.
***REMOVED*** @param {goog.math.Size=} opt_size The size of the player if known.
***REMOVED***
***REMOVED*** @final
***REMOVED***
goog.ui.media.MediaModel.Player = function(url, opt_vars, opt_size) {
 ***REMOVED*****REMOVED***
  ***REMOVED*** The player's URL.
  ***REMOVED*** @type {string}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.url_ = url;

 ***REMOVED*****REMOVED***
  ***REMOVED*** Player arguments, typically flash arguments.
  ***REMOVED*** @type {Object}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.vars_ = opt_vars || null;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The size of the player if known.
  ***REMOVED*** @type {goog.math.Size}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.size_ = opt_size || null;
***REMOVED***


***REMOVED***
***REMOVED*** Gets the player url.
***REMOVED*** @return {string} The thumbnail's image URL.
***REMOVED***
goog.ui.media.MediaModel.Player.prototype.getUrl = function() {
  return this.url_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the player url.
***REMOVED*** @param {string} url The thumbnail's image URL.
***REMOVED*** @return {!goog.ui.media.MediaModel.Player} The object itself, used for
***REMOVED***     chaining.
***REMOVED***
goog.ui.media.MediaModel.Player.prototype.setUrl = function(url) {
  this.url_ = url;
  return this;
***REMOVED***


***REMOVED***
***REMOVED*** Gets the player arguments.
***REMOVED*** @return {Object} The media player arguments.
***REMOVED***
goog.ui.media.MediaModel.Player.prototype.getVars = function() {
  return this.vars_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the player arguments.
***REMOVED*** @param {Object} vars The media player arguments.
***REMOVED*** @return {!goog.ui.media.MediaModel.Player} The object itself, used for
***REMOVED***     chaining.
***REMOVED***
goog.ui.media.MediaModel.Player.prototype.setVars = function(vars) {
  this.vars_ = vars;
  return this;
***REMOVED***


***REMOVED***
***REMOVED*** Gets the size of the player.
***REMOVED*** @return {goog.math.Size} The size of the player if known.
***REMOVED***
goog.ui.media.MediaModel.Player.prototype.getSize = function() {
  return this.size_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the size of the player.
***REMOVED*** @param {goog.math.Size} size The size of the player.
***REMOVED*** @return {!goog.ui.media.MediaModel.Player} The object itself, used for
***REMOVED***     chaining.
***REMOVED***
goog.ui.media.MediaModel.Player.prototype.setSize = function(size) {
  this.size_ = size;
  return this;
***REMOVED***



***REMOVED***
***REMOVED*** A taxonomy to be set that gives an indication of the type of media content,
***REMOVED*** and its particular contents.
***REMOVED*** @param {string} scheme The URI that identifies the categorization scheme.
***REMOVED*** @param {string} value The value of the category.
***REMOVED*** @param {string=} opt_label The human readable label that can be displayed in
***REMOVED***     end user applications.
***REMOVED***
***REMOVED*** @final
***REMOVED***
goog.ui.media.MediaModel.Category = function(scheme, value, opt_label) {
 ***REMOVED*****REMOVED***
  ***REMOVED*** The URI that identifies the categorization scheme.
  ***REMOVED*** @type {string}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.scheme_ = scheme;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The value of the category.
  ***REMOVED*** @type {string}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.value_ = value;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The human readable label that can be displayed in end user applications.
  ***REMOVED*** @type {string}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.label_ = opt_label || '';
***REMOVED***


***REMOVED***
***REMOVED*** Gets the category scheme.
***REMOVED*** @return {string} The category scheme URI.
***REMOVED***
goog.ui.media.MediaModel.Category.prototype.getScheme = function() {
  return this.scheme_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the category scheme.
***REMOVED*** @param {string} scheme The category's scheme.
***REMOVED*** @return {!goog.ui.media.MediaModel.Category} The object itself, used for
***REMOVED***     chaining.
***REMOVED***
goog.ui.media.MediaModel.Category.prototype.setScheme = function(scheme) {
  this.scheme_ = scheme;
  return this;
***REMOVED***


***REMOVED***
***REMOVED*** Gets the categor's value.
***REMOVED*** @return {string} The category's value.
***REMOVED***
goog.ui.media.MediaModel.Category.prototype.getValue = function() {
  return this.value_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the category value.
***REMOVED*** @param {string} value The category value to be set.
***REMOVED*** @return {!goog.ui.media.MediaModel.Category} The object itself, used for
***REMOVED***     chaining.
***REMOVED***
goog.ui.media.MediaModel.Category.prototype.setValue = function(value) {
  this.value_ = value;
  return this;
***REMOVED***


***REMOVED***
***REMOVED*** Gets the label of the category.
***REMOVED*** @return {string} The label of the category.
***REMOVED***
goog.ui.media.MediaModel.Category.prototype.getLabel = function() {
  return this.label_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the label of the category.
***REMOVED*** @param {string} label The label of the category.
***REMOVED*** @return {!goog.ui.media.MediaModel.Category} The object itself, used for
***REMOVED***     chaining.
***REMOVED***
goog.ui.media.MediaModel.Category.prototype.setLabel = function(label) {
  this.label_ = label;
  return this;
***REMOVED***



***REMOVED***
***REMOVED*** Indicates an entity that has contributed to a media object. Based on
***REMOVED*** 'media.credit' in the rss spec.
***REMOVED*** @param {string} value The name of the entity being credited.
***REMOVED*** @param {goog.ui.media.MediaModel.Credit.Role=} opt_role The role the entity
***REMOVED***     played.
***REMOVED*** @param {goog.ui.media.MediaModel.Credit.Scheme=} opt_scheme The URI that
***REMOVED***     identifies the role scheme.
***REMOVED***
***REMOVED*** @final
***REMOVED***
goog.ui.media.MediaModel.Credit = function(value, opt_role, opt_scheme) {
 ***REMOVED*****REMOVED***
  ***REMOVED*** The name of entity being credited.
  ***REMOVED*** @type {string}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.value_ = value;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The role the entity played.
  ***REMOVED*** @type {goog.ui.media.MediaModel.Credit.Role|undefined}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.role_ = opt_role;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The URI that identifies the role scheme
  ***REMOVED*** @type {goog.ui.media.MediaModel.Credit.Scheme|undefined}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.scheme_ = opt_scheme;
***REMOVED***


***REMOVED***
***REMOVED*** The types of known roles.
***REMOVED*** @enum {string}
***REMOVED***
goog.ui.media.MediaModel.Credit.Role = {
  UPLOADER: 'uploader',
  OWNER: 'owner'
***REMOVED***


***REMOVED***
***REMOVED*** The types of known schemes.
***REMOVED*** @enum {string}
***REMOVED***
goog.ui.media.MediaModel.Credit.Scheme = {
  EUROPEAN_BROADCASTING: 'urn:ebu',
  YAHOO: 'urn:yvs',
  YOUTUBE: 'urn:youtube'
***REMOVED***


***REMOVED***
***REMOVED*** Gets the name of the entity being credited.
***REMOVED*** @return {string} The name of the entity.
***REMOVED***
goog.ui.media.MediaModel.Credit.prototype.getValue = function() {
  return this.value_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the value of the credit object.
***REMOVED*** @param {string} value The value.
***REMOVED*** @return {!goog.ui.media.MediaModel.Credit} The object itself.
***REMOVED***
goog.ui.media.MediaModel.Credit.prototype.setValue = function(value) {
  this.value_ = value;
  return this;
***REMOVED***


***REMOVED***
***REMOVED*** Gets the role of the entity being credited.
***REMOVED*** @return {goog.ui.media.MediaModel.Credit.Role|undefined} The role of the
***REMOVED***     entity.
***REMOVED***
goog.ui.media.MediaModel.Credit.prototype.getRole = function() {
  return this.role_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the role of the credit object.
***REMOVED*** @param {goog.ui.media.MediaModel.Credit.Role} role The role.
***REMOVED*** @return {!goog.ui.media.MediaModel.Credit} The object itself.
***REMOVED***
goog.ui.media.MediaModel.Credit.prototype.setRole = function(role) {
  this.role_ = role;
  return this;
***REMOVED***


***REMOVED***
***REMOVED*** Gets the scheme of the credit object.
***REMOVED*** @return {goog.ui.media.MediaModel.Credit.Scheme|undefined} The URI that
***REMOVED***     identifies the role scheme.
***REMOVED***
goog.ui.media.MediaModel.Credit.prototype.getScheme = function() {
  return this.scheme_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the scheme of the credit object.
***REMOVED*** @param {goog.ui.media.MediaModel.Credit.Scheme} scheme The scheme.
***REMOVED*** @return {!goog.ui.media.MediaModel.Credit} The object itself.
***REMOVED***
goog.ui.media.MediaModel.Credit.prototype.setScheme = function(scheme) {
  this.scheme_ = scheme;
  return this;
***REMOVED***



***REMOVED***
***REMOVED*** A reference to the subtitle URI for a media object.
***REMOVED*** Implements the 'media.subTitle' in the rss spec.
***REMOVED***
***REMOVED*** @param {string} href The subtitle's URI.
***REMOVED***     to fetch the subtitle file.
***REMOVED*** @param {string} lang An RFC 3066 language.
***REMOVED*** @param {string} type The MIME type of the URI.
***REMOVED***
***REMOVED*** @final
***REMOVED***
goog.ui.media.MediaModel.SubTitle = function(href, lang, type) {
 ***REMOVED*****REMOVED***
  ***REMOVED*** The subtitle href.
  ***REMOVED*** @type {string}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.href_ = href;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The RFC 3066 language.
  ***REMOVED*** @type {string}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.lang_ = lang;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The MIME type of the resource.
  ***REMOVED*** @type {string}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.type_ = type;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the href for the subtitle object.
***REMOVED*** @param {string} href The subtitle's URI.
***REMOVED*** @return {!goog.ui.media.MediaModel.SubTitle} The object itself.
***REMOVED***
goog.ui.media.MediaModel.SubTitle.prototype.setHref = function(href) {
  this.href_ = href;
  return this;
***REMOVED***


***REMOVED***
***REMOVED*** Get the href for the subtitle object.
***REMOVED*** @return {string} href The subtitle's URI.
***REMOVED***
goog.ui.media.MediaModel.SubTitle.prototype.getHref = function() {
  return this.href_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the language for the subtitle object.
***REMOVED*** @param {string} lang The RFC 3066 language.
***REMOVED*** @return {!goog.ui.media.MediaModel.SubTitle} The object itself.
***REMOVED***
goog.ui.media.MediaModel.SubTitle.prototype.setLang = function(lang) {
  this.lang_ = lang;
  return this;
***REMOVED***


***REMOVED***
***REMOVED*** Get the lang for the subtitle object.
***REMOVED*** @return {string} lang The RFC 3066 language.
***REMOVED***
goog.ui.media.MediaModel.SubTitle.prototype.getLang = function() {
  return this.lang_;
***REMOVED***


***REMOVED***
***REMOVED*** Sets the type for the subtitle object.
***REMOVED*** @param {string} type The MIME type.
***REMOVED*** @return {!goog.ui.media.MediaModel.SubTitle} The object itself.
***REMOVED***
goog.ui.media.MediaModel.SubTitle.prototype.setType = function(type) {
  this.type_ = type;
  return this;
***REMOVED***


***REMOVED***
***REMOVED*** Get the type for the subtitle object.
***REMOVED*** @return {string} type The MIME type.
***REMOVED***
goog.ui.media.MediaModel.SubTitle.prototype.getType = function() {
  return this.type_;
***REMOVED***
