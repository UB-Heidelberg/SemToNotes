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
***REMOVED*** @fileoverview provides a reusable mp3 UI component given a mp3 URL.
***REMOVED***
***REMOVED*** goog.ui.media.Mp3 is actually a {@link goog.ui.ControlRenderer}, a stateless
***REMOVED*** class - that could/should be used as a Singleton with the static method
***REMOVED*** {@code goog.ui.media.Mp3.getInstance} -, that knows how to render Mp3s. It is
***REMOVED*** designed to be used with a {@link goog.ui.Control}, which will actually
***REMOVED*** control the media renderer and provide the {@link goog.ui.Component} base.
***REMOVED*** This design guarantees that all different types of medias will behave alike
***REMOVED*** but will look different.
***REMOVED***
***REMOVED*** goog.ui.media.Mp3 expects mp3 urls on {@code goog.ui.Control.getModel} as
***REMOVED*** data models, and render a flash object that will play that URL.
***REMOVED***
***REMOVED*** Example of usage:
***REMOVED***
***REMOVED*** <pre>
***REMOVED***   goog.ui.media.Mp3.newControl('http://hostname/file.mp3').render();
***REMOVED*** </pre>
***REMOVED***
***REMOVED*** Mp3 medias currently support the following states:
***REMOVED***
***REMOVED*** <ul>
***REMOVED***   <li> {@link goog.ui.Component.State.DISABLED}: shows 'flash not available'
***REMOVED***   <li> {@link goog.ui.Component.State.HOVER}: mouse cursor is over the mp3
***REMOVED***   <li> {@link goog.ui.Component.State.SELECTED}: mp3 is playing
***REMOVED*** </ul>
***REMOVED***
***REMOVED*** Which can be accessed by
***REMOVED***
***REMOVED*** <pre>
***REMOVED***   mp3.setEnabled(true);
***REMOVED***   mp3.setHighlighted(true);
***REMOVED***   mp3.setSelected(true);
***REMOVED*** </pre>
***REMOVED***
***REMOVED***
***REMOVED*** @supported IE6, FF2+, Safari. Requires flash to actually work.
***REMOVED***
***REMOVED*** TODO(user): test on other browsers
***REMOVED***

goog.provide('goog.ui.media.Mp3');

goog.require('goog.string');
goog.require('goog.ui.media.FlashObject');
goog.require('goog.ui.media.Media');
goog.require('goog.ui.media.MediaRenderer');



***REMOVED***
***REMOVED*** Subclasses a goog.ui.media.MediaRenderer to provide a Mp3 specific media
***REMOVED*** renderer.
***REMOVED***
***REMOVED*** This class knows how to parse mp3 URLs, and render the DOM structure
***REMOVED*** of mp3 flash players. This class is meant to be used as a singleton static
***REMOVED*** stateless class, that takes {@code goog.ui.media.Media} instances and renders
***REMOVED*** it. It expects {@code goog.ui.media.Media.getModel} to return a well formed,
***REMOVED*** previously checked, mp3 URL {@see goog.ui.media.PicasaAlbum.parseUrl},
***REMOVED*** which is the data model this renderer will use to construct the DOM
***REMOVED*** structure. {@see goog.ui.media.PicasaAlbum.newControl} for an example of
***REMOVED*** constructing a control with this renderer.
***REMOVED***
***REMOVED*** This design is patterned after http://go/closure_control_subclassing
***REMOVED***
***REMOVED*** It uses {@link goog.ui.media.FlashObject} to embed the flash object.
***REMOVED***
***REMOVED***
***REMOVED*** @extends {goog.ui.media.MediaRenderer}
***REMOVED*** @final
***REMOVED***
goog.ui.media.Mp3 = function() {
  goog.ui.media.MediaRenderer.call(this);
***REMOVED***
goog.inherits(goog.ui.media.Mp3, goog.ui.media.MediaRenderer);
goog.addSingletonGetter(goog.ui.media.Mp3);


***REMOVED***
***REMOVED*** Flash player arguments. We expect that {@code flashUrl_} will contain a flash
***REMOVED*** movie that takes an audioUrl parameter on its URL, containing the URL of the
***REMOVED*** mp3 to be played.
***REMOVED***
***REMOVED*** @type {string}
***REMOVED*** @private
***REMOVED***
goog.ui.media.Mp3.PLAYER_ARGUMENTS_ = 'audioUrl=%s';


***REMOVED***
***REMOVED*** Default CSS class to be applied to the root element of components rendered
***REMOVED*** by this renderer.
***REMOVED***
***REMOVED*** @type {string}
***REMOVED***
goog.ui.media.Mp3.CSS_CLASS = goog.getCssName('goog-ui-media-mp3');


***REMOVED***
***REMOVED*** Flash player URL. Uses Google Reader's mp3 flash player by default.
***REMOVED***
***REMOVED*** @type {string}
***REMOVED*** @private
***REMOVED***
goog.ui.media.Mp3.flashUrl_ =
    'http://www.google.com/reader/ui/3523697345-audio-player.swf';


***REMOVED***
***REMOVED*** Regular expression to check if a given URL is a valid mp3 URL.
***REMOVED***
***REMOVED*** Copied from http://go/markdownlite.js.

***REMOVED***
***REMOVED*** NOTE(user): although it would be easier to use goog.string.endsWith('.mp3'),
***REMOVED*** in the future, we want to provide media inlining, which is basically getting
***REMOVED*** a text and replacing all mp3 references with an mp3 player, so it makes sense
***REMOVED*** to share the same regular expression to match everything.
***REMOVED***
***REMOVED*** @type {RegExp}
***REMOVED***
goog.ui.media.Mp3.MATCHER =
    /(https?:\/\/[\w-%&\/.=:#\+~\(\)]+\.(mp3)+(\?[\w-%&\/.=:#\+~\(\)]+)?)/i;


***REMOVED***
***REMOVED*** A static convenient method to construct a goog.ui.media.Media control out of
***REMOVED*** a mp3 URL. It checks the mp3 URL, sets it as the data model
***REMOVED*** goog.ui.media.Mp3 renderer uses, sets the states supported by the renderer,
***REMOVED*** and returns a Control that binds everything together. This is what you
***REMOVED*** should be using for constructing Mp3 videos, except if you need more fine
***REMOVED*** control over the configuration.
***REMOVED***
***REMOVED*** @param {goog.ui.media.MediaModel} dataModel A media model that must contain
***REMOVED***     an mp3 url on {@code dataModel.getUrl}.
***REMOVED*** @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper, used for
***REMOVED***     document interaction.
***REMOVED*** @return {!goog.ui.media.Media} A goog.ui.Control subclass with the mp3
***REMOVED***     renderer.
***REMOVED***
goog.ui.media.Mp3.newControl = function(dataModel, opt_domHelper) {
  var control = new goog.ui.media.Media(
      dataModel,
      goog.ui.media.Mp3.getInstance(),
      opt_domHelper);
  // mp3 ui doesn't have a non selected view: it shows the mp3 player by
  // default.
  control.setSelected(true);
  return control;
***REMOVED***


***REMOVED***
***REMOVED*** A static method that sets which flash URL this class should use. Use this if
***REMOVED*** you want to host your own flash mp3 player.
***REMOVED***
***REMOVED*** @param {string} flashUrl The URL of the flash mp3 player.
***REMOVED***
goog.ui.media.Mp3.setFlashUrl = function(flashUrl) {
  goog.ui.media.Mp3.flashUrl_ = flashUrl;
***REMOVED***


***REMOVED***
***REMOVED*** A static method that builds a URL that will contain the flash player that
***REMOVED*** will play the {@code mp3Url}.
***REMOVED***
***REMOVED*** @param {string} mp3Url The URL of the mp3 music.
***REMOVED*** @return {string} An URL of a flash player that will know how to play the
***REMOVED***     given {@code mp3Url}.
***REMOVED***
goog.ui.media.Mp3.buildFlashUrl = function(mp3Url) {
  var flashUrl = goog.ui.media.Mp3.flashUrl_ + '?' + goog.string.subs(
      goog.ui.media.Mp3.PLAYER_ARGUMENTS_,
      goog.string.urlEncode(mp3Url));
  return flashUrl;
***REMOVED***


***REMOVED***
***REMOVED*** Creates the initial DOM structure of a mp3 video, which is basically a
***REMOVED*** the flash object pointing to a flash mp3 player.
***REMOVED***
***REMOVED*** @param {goog.ui.Control} c The media control.
***REMOVED*** @return {!Element} A DOM structure that represents the control.
***REMOVED*** @override
***REMOVED***
goog.ui.media.Mp3.prototype.createDom = function(c) {
  var control =***REMOVED*****REMOVED*** @type {goog.ui.media.Media}***REMOVED*** (c);
  var div = goog.ui.media.Mp3.superClass_.createDom.call(this, control);

  var dataModel =
     ***REMOVED*****REMOVED*** @type {goog.ui.media.MediaModel}***REMOVED*** (control.getDataModel());
  var flashUrl = goog.ui.media.Mp3.flashUrl_ + '?' + goog.string.subs(
      goog.ui.media.Mp3.PLAYER_ARGUMENTS_,
      goog.string.urlEncode(dataModel.getUrl()));
  var flash = new goog.ui.media.FlashObject(
      dataModel.getPlayer().getUrl(), control.getDomHelper());
  flash.setFlashVar('playerMode', 'embedded');
  flash.render(div);

  return div;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the CSS class to be applied to the root element of components
***REMOVED*** rendered using this renderer.
***REMOVED*** @return {string} Renderer-specific CSS class.
***REMOVED*** @override
***REMOVED***
goog.ui.media.Mp3.prototype.getCssClass = function() {
  return goog.ui.media.Mp3.CSS_CLASS;
***REMOVED***
