// Copyright 2007 The Closure Library Authors. All Rights Reserved.
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
***REMOVED*** @fileoverview Provides the namesspace for client-side communication
***REMOVED*** between pages originating from different domains (it works also
***REMOVED*** with pages from the same domain, but doing that is kinda
***REMOVED*** pointless).
***REMOVED***
***REMOVED*** The only publicly visible class is goog.net.xpc.CrossPageChannel.
***REMOVED***
***REMOVED*** Note: The preferred name for the main class would have been
***REMOVED*** CrossDomainChannel.  But as there already is a class named like
***REMOVED*** that (which serves a different purpose) in the maps codebase,
***REMOVED*** CrossPageChannel was chosen to avoid confusion.
***REMOVED***
***REMOVED*** CrossPageChannel abstracts the underlying transport mechanism to
***REMOVED*** provide a common interface in all browsers.
***REMOVED***
***REMOVED***

/*
TODO(user)
- resolve fastback issues in Safari (IframeRelayTransport)
***REMOVED***


***REMOVED***
***REMOVED*** Namespace for CrossPageChannel
***REMOVED***
goog.provide('goog.net.xpc');
goog.provide('goog.net.xpc.CfgFields');
goog.provide('goog.net.xpc.ChannelStates');
goog.provide('goog.net.xpc.TransportNames');
goog.provide('goog.net.xpc.TransportTypes');
goog.provide('goog.net.xpc.UriCfgFields');

goog.require('goog.log');


***REMOVED***
***REMOVED*** Enum used to identify transport types.
***REMOVED*** @enum {number}
***REMOVED***
goog.net.xpc.TransportTypes = {
  NATIVE_MESSAGING: 1,
  FRAME_ELEMENT_METHOD: 2,
  IFRAME_RELAY: 3,
  IFRAME_POLLING: 4,
  FLASH: 5,
  NIX: 6,
  DIRECT: 7
***REMOVED***


***REMOVED***
***REMOVED*** Enum containing transport names. These need to correspond to the
***REMOVED*** transport class names for createTransport_() to work.
***REMOVED*** @type {Object}
***REMOVED***
goog.net.xpc.TransportNames = {
  '1': 'NativeMessagingTransport',
  '2': 'FrameElementMethodTransport',
  '3': 'IframeRelayTransport',
  '4': 'IframePollingTransport',
  '5': 'FlashTransport',
  '6': 'NixTransport',
  '7': 'DirectTransport'
***REMOVED***


// TODO(user): Add auth token support to other methods.


***REMOVED***
***REMOVED*** Field names used on configuration object.
***REMOVED*** @type {Object}
***REMOVED***
goog.net.xpc.CfgFields = {
 ***REMOVED*****REMOVED***
  ***REMOVED*** Channel name identifier.
  ***REMOVED*** Both peers have to be initialized with
  ***REMOVED*** the same channel name.  If not present, a channel name is
  ***REMOVED*** generated (which then has to transferred to the peer somehow).
 ***REMOVED*****REMOVED***
  CHANNEL_NAME: 'cn',
 ***REMOVED*****REMOVED***
  ***REMOVED*** Authorization token. If set, NIX will use this authorization token
  ***REMOVED*** to validate the setup.
 ***REMOVED*****REMOVED***
  AUTH_TOKEN: 'at',
 ***REMOVED*****REMOVED***
  ***REMOVED*** Remote party's authorization token. If set, NIX will validate this
  ***REMOVED*** authorization token against that sent by the other party.
 ***REMOVED*****REMOVED***
  REMOTE_AUTH_TOKEN: 'rat',
 ***REMOVED*****REMOVED***
  ***REMOVED*** The URI of the peer page.
 ***REMOVED*****REMOVED***
  PEER_URI: 'pu',
 ***REMOVED*****REMOVED***
  ***REMOVED*** Ifame-ID identifier.
  ***REMOVED*** The id of the iframe element the peer-document lives in.
 ***REMOVED*****REMOVED***
  IFRAME_ID: 'ifrid',
 ***REMOVED*****REMOVED***
  ***REMOVED*** Transport type identifier.
  ***REMOVED*** The transport type to use. Possible values are entries from
  ***REMOVED*** goog.net.xpc.TransportTypes. If not present, the transport is
  ***REMOVED*** determined automatically based on the useragent's capabilities.
 ***REMOVED*****REMOVED***
  TRANSPORT: 'tp',
 ***REMOVED*****REMOVED***
  ***REMOVED*** Local relay URI identifier (IframeRelayTransport-specific).
  ***REMOVED*** The URI (can't contain a fragment identifier) used by the peer to
  ***REMOVED*** relay data through.
 ***REMOVED*****REMOVED***
  LOCAL_RELAY_URI: 'lru',
 ***REMOVED*****REMOVED***
  ***REMOVED*** Peer relay URI identifier (IframeRelayTransport-specific).
  ***REMOVED*** The URI (can't contain a fragment identifier) used to relay data
  ***REMOVED*** to the peer.
 ***REMOVED*****REMOVED***
  PEER_RELAY_URI: 'pru',
 ***REMOVED*****REMOVED***
  ***REMOVED*** Local poll URI identifier (IframePollingTransport-specific).
  ***REMOVED*** The URI  (can't contain a fragment identifier)which is polled
  ***REMOVED*** to receive data from the peer.
 ***REMOVED*****REMOVED***
  LOCAL_POLL_URI: 'lpu',
 ***REMOVED*****REMOVED***
  ***REMOVED*** Local poll URI identifier (IframePollingTransport-specific).
  ***REMOVED*** The URI (can't contain a fragment identifier) used to send data
  ***REMOVED*** to the peer.
 ***REMOVED*****REMOVED***
  PEER_POLL_URI: 'ppu',
 ***REMOVED*****REMOVED***
  ***REMOVED*** The hostname of the peer window, including protocol, domain, and port
  ***REMOVED*** (if specified). Used for security sensitive applications that make
  ***REMOVED*** use of NativeMessagingTransport (i.e. most applications).
 ***REMOVED*****REMOVED***
  PEER_HOSTNAME: 'ph',
 ***REMOVED*****REMOVED***
  ***REMOVED*** Usually both frames using a connection initially send a SETUP message to
  ***REMOVED*** each other, and each responds with a SETUP_ACK.  A frame marks itself
  ***REMOVED*** connected when it receives that SETUP_ACK.  If this parameter is true
  ***REMOVED*** however, the channel it is passed to will not send a SETUP, but rather will
  ***REMOVED*** wait for one from its peer and mark itself connected when that arrives.
  ***REMOVED*** Peer iframes created using such a channel will send SETUP however, and will
  ***REMOVED*** wait for SETUP_ACK before marking themselves connected.  The goal is to
  ***REMOVED*** cope with a situation where the availability of the URL for the peer frame
  ***REMOVED*** cannot be relied on, eg when the application is offline.  Without this
  ***REMOVED*** setting, the primary frame will attempt to send its SETUP message every
  ***REMOVED*** 100ms, forever.  This floods the javascript console with uncatchable
  ***REMOVED*** security warnings, and fruitlessly burns CPU.  There is one scenario this
  ***REMOVED*** mode will not support, and that is reconnection by the outer frame, ie the
  ***REMOVED*** creation of a new channel object to connect to a peer iframe which was
  ***REMOVED*** already communicating with a previous channel object of the same name.  If
  ***REMOVED*** that behavior is needed, this mode should not be used.  Reconnection by
  ***REMOVED*** inner frames is supported in this mode however.
 ***REMOVED*****REMOVED***
  ONE_SIDED_HANDSHAKE: 'osh',
 ***REMOVED*****REMOVED***
  ***REMOVED*** The frame role (inner or outer). Used to explicitly indicate the role for
  ***REMOVED*** each peer whenever the role cannot be reliably determined (e.g. the two
  ***REMOVED*** peer windows are not parent/child frames). If unspecified, the role will
  ***REMOVED*** be dynamically determined, assuming a parent/child frame setup.
 ***REMOVED*****REMOVED***
  ROLE: 'role',
 ***REMOVED*****REMOVED***
  ***REMOVED*** Which version of the native transport startup protocol should be used, the
  ***REMOVED*** default being '2'.  Version 1 had various timing vulnerabilities, which
  ***REMOVED*** had to be compensated for by introducing delays, and is deprecated.  V1
  ***REMOVED*** and V2 are broadly compatible, although the more robust timing and lack
  ***REMOVED*** of delays is not gained unless both sides are using V2.  The only
  ***REMOVED*** unsupported case of cross-protocol interoperation is where a connection
  ***REMOVED*** starts out with V2 at both ends, and one of the ends reconnects as a V1.
  ***REMOVED*** All other initial startup and reconnection scenarios are supported.
 ***REMOVED*****REMOVED***
  NATIVE_TRANSPORT_PROTOCOL_VERSION: 'nativeProtocolVersion',
 ***REMOVED*****REMOVED***
  ***REMOVED*** Whether the direct transport runs in synchronous mode. The default is to
  ***REMOVED*** emulate the other transports and run asyncronously but there are some
  ***REMOVED*** circumstances where syncronous calls are required. If this property is
  ***REMOVED*** set to true, the transport will send the messages synchronously.
 ***REMOVED*****REMOVED***
  DIRECT_TRANSPORT_SYNC_MODE: 'directSyncMode'
***REMOVED***


***REMOVED***
***REMOVED*** Config properties that need to be URL sanitized.
***REMOVED*** @type {Array}.<string>
***REMOVED***
goog.net.xpc.UriCfgFields = [
  goog.net.xpc.CfgFields.PEER_URI,
  goog.net.xpc.CfgFields.LOCAL_RELAY_URI,
  goog.net.xpc.CfgFields.PEER_RELAY_URI,
  goog.net.xpc.CfgFields.LOCAL_POLL_URI,
  goog.net.xpc.CfgFields.PEER_POLL_URI
];


***REMOVED***
***REMOVED*** @enum {number}
***REMOVED***
goog.net.xpc.ChannelStates = {
  NOT_CONNECTED: 1,
  CONNECTED: 2,
  CLOSED: 3
***REMOVED***


***REMOVED***
***REMOVED*** The name of the transport service (used for internal signalling).
***REMOVED*** @type {string}
***REMOVED*** @suppress {underscore|visibility}
***REMOVED***
goog.net.xpc.TRANSPORT_SERVICE_ = 'tp';


***REMOVED***
***REMOVED*** Transport signaling message: setup.
***REMOVED*** @type {string}
***REMOVED***
goog.net.xpc.SETUP = 'SETUP';


***REMOVED***
***REMOVED*** Transport signaling message: setup for native transport protocol v2.
***REMOVED*** @type {string}
***REMOVED***
goog.net.xpc.SETUP_NTPV2 = 'SETUP_NTPV2';


***REMOVED***
***REMOVED*** Transport signaling message: setup acknowledgement.
***REMOVED*** @type {string}
***REMOVED*** @suppress {underscore|visibility}
***REMOVED***
goog.net.xpc.SETUP_ACK_ = 'SETUP_ACK';


***REMOVED***
***REMOVED*** Transport signaling message: setup acknowledgement.
***REMOVED*** @type {string}
***REMOVED***
goog.net.xpc.SETUP_ACK_NTPV2 = 'SETUP_ACK_NTPV2';


***REMOVED***
***REMOVED*** Object holding active channels.
***REMOVED*** Package private. Do not call from outside goog.net.xpc.
***REMOVED***
***REMOVED*** @type {Object.<string, goog.net.xpc.CrossPageChannel>}
***REMOVED***
goog.net.xpc.channels = {***REMOVED***


***REMOVED***
***REMOVED*** Returns a random string.
***REMOVED*** @param {number} length How many characters the string shall contain.
***REMOVED*** @param {string=} opt_characters The characters used.
***REMOVED*** @return {string} The random string.
***REMOVED***
goog.net.xpc.getRandomString = function(length, opt_characters) {
  var chars = opt_characters || goog.net.xpc.randomStringCharacters_;
  var charsLength = chars.length;
  var s = '';
  while (length-- > 0) {
    s += chars.charAt(Math.floor(Math.random()***REMOVED*** charsLength));
  }
  return s;
***REMOVED***


***REMOVED***
***REMOVED*** The default characters used for random string generation.
***REMOVED*** @type {string}
***REMOVED*** @private
***REMOVED***
goog.net.xpc.randomStringCharacters_ =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';


***REMOVED***
***REMOVED*** The logger.
***REMOVED*** @type {goog.log.Logger}
***REMOVED***
goog.net.xpc.logger = goog.log.getLogger('goog.net.xpc');
