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
***REMOVED*** @fileoverview This file contains classes to handle IPv4 and IPv6 addresses.
***REMOVED*** This implementation is mostly based on Google's project:
***REMOVED*** http://code.google.com/p/ipaddr-py/.
***REMOVED***
***REMOVED***

goog.provide('goog.net.IpAddress');
goog.provide('goog.net.Ipv4Address');
goog.provide('goog.net.Ipv6Address');

goog.require('goog.array');
goog.require('goog.math.Integer');
goog.require('goog.object');
goog.require('goog.string');



***REMOVED***
***REMOVED*** Abstract class defining an IP Address.
***REMOVED***
***REMOVED*** Please use goog.net.IpAddress static methods or
***REMOVED*** goog.net.Ipv4Address/Ipv6Address classes.
***REMOVED***
***REMOVED*** @param {!goog.math.Integer} address The Ip Address.
***REMOVED*** @param {number} version The version number (4, 6).
***REMOVED***
***REMOVED***
goog.net.IpAddress = function(address, version) {
 ***REMOVED*****REMOVED***
  ***REMOVED*** The IP Address.
  ***REMOVED*** @type {!goog.math.Integer}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.ip_ = address;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The IP Address version.
  ***REMOVED*** @type {number}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.version_ = version;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The IPAddress, as string.
  ***REMOVED*** @type {string}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.ipStr_ = '';
***REMOVED***


***REMOVED***
***REMOVED*** @return {number} The IP Address version.
***REMOVED***
goog.net.IpAddress.prototype.getVersion = function() {
  return this.version_;
***REMOVED***


***REMOVED***
***REMOVED*** @param {!goog.net.IpAddress} other The other IP Address.
***REMOVED*** @return {boolean} true if the IP Addresses are equal.
***REMOVED***
goog.net.IpAddress.prototype.equals = function(other) {
  return (this.version_ == other.getVersion() &&
          this.ip_.equals(other.toInteger()));
***REMOVED***


***REMOVED***
***REMOVED*** @return {goog.math.Integer} The IP Address, as an Integer.
***REMOVED***
goog.net.IpAddress.prototype.toInteger = function() {
  return***REMOVED*****REMOVED*** @type {goog.math.Integer}***REMOVED*** (goog.object.clone(this.ip_));
***REMOVED***


***REMOVED***
***REMOVED*** @return {string} The IP Address, as an URI string following RFC 3986.
***REMOVED***
goog.net.IpAddress.prototype.toUriString = goog.abstractMethod;


***REMOVED***
***REMOVED*** @return {string} The IP Address, as a string.
***REMOVED*** @override
***REMOVED***
goog.net.IpAddress.prototype.toString = goog.abstractMethod;


***REMOVED***
***REMOVED*** Parses an IP Address in a string.
***REMOVED*** If the string is malformed, the function will simply return null
***REMOVED*** instead of raising an exception.
***REMOVED***
***REMOVED*** @param {string} address The IP Address.
***REMOVED*** @see {goog.net.Ipv4Address}
***REMOVED*** @see {goog.net.Ipv6Address}
***REMOVED*** @return {goog.net.IpAddress} The IP Address or null.
***REMOVED***
goog.net.IpAddress.fromString = function(address) {
  try {
    if (address.indexOf(':') != -1) {
      return new goog.net.Ipv6Address(address);
    }

    return new goog.net.Ipv4Address(address);
  } catch (e) {
    // Both constructors raise exception if the address is malformed (ie.
    // invalid). The user of this function should not care about catching
    // the exception, espcially if it's used to validate an user input.
    return null;
  }
***REMOVED***


***REMOVED***
***REMOVED*** Tries to parse a string represented as a host portion of an URI.
***REMOVED*** See RFC 3986 for more details on IPv6 addresses inside URI.
***REMOVED*** If the string is malformed, the function will simply return null
***REMOVED*** instead of raising an exception.
***REMOVED***
***REMOVED*** @param {string} address A RFC 3986 encoded IP address.
***REMOVED*** @see {goog.net.Ipv4Address}
***REMOVED*** @see {goog.net.Ipv6Address}
***REMOVED*** @return {goog.net.IpAddress} The IP Address.
***REMOVED***
goog.net.IpAddress.fromUriString = function(address) {
  try {
    if (goog.string.startsWith(address, '[') &&
        goog.string.endsWith(address, ']')) {
      return new goog.net.Ipv6Address(
          address.substring(1, address.length - 1));
    }

    return new goog.net.Ipv4Address(address);
  } catch (e) {
    // Both constructors raise exception if the address is malformed (ie.
    // invalid). The user of this function should not care about catching
    // the exception, espcially if it's used to validate an user input.
    return null;
  }
***REMOVED***



***REMOVED***
***REMOVED*** Takes a string or a number and returns a IPv4 Address.
***REMOVED***
***REMOVED*** This constructor accepts strings and instance of goog.math.Integer.
***REMOVED*** If you pass a goog.math.Integer, make sure that its sign is set to positive.
***REMOVED*** @param {(string|!goog.math.Integer)} address The address to store.
***REMOVED*** @extends {goog.net.IpAddress}
***REMOVED***
***REMOVED***
goog.net.Ipv4Address = function(address) {
  var ip = goog.math.Integer.ZERO;
  if (address instanceof goog.math.Integer) {
    if (address.getSign() != 0 ||
        address.lessThan(goog.math.Integer.ZERO) ||
        address.greaterThan(goog.net.Ipv4Address.MAX_ADDRESS_)) {
      throw Error('The address does not look like an IPv4.');
    } else {
      ip = goog.object.clone(address);
    }
  } else {
    if (!goog.net.Ipv4Address.REGEX_.test(address)) {
      throw Error(address + ' does not look like an IPv4 address.');
    }

    var octets = address.split('.');
    if (octets.length != 4) {
      throw Error(address + ' does not look like an IPv4 address.');
    }

    for (var i = 0; i < octets.length; i++) {
      var parsedOctet = goog.string.toNumber(octets[i]);
      if (isNaN(parsedOctet) ||
          parsedOctet < 0 || parsedOctet > 255 ||
          (octets[i].length != 1 && goog.string.startsWith(octets[i], '0'))) {
        throw Error('In ' + address + ', octet ' + i + ' is not valid');
      }
      var intOctet = goog.math.Integer.fromNumber(parsedOctet);
      ip = ip.shiftLeft(8).or(intOctet);
    }
  }
  goog.base(this,***REMOVED*****REMOVED*** @type {!goog.math.Integer}***REMOVED*** (ip), 4);
***REMOVED***
goog.inherits(goog.net.Ipv4Address, goog.net.IpAddress);


***REMOVED***
***REMOVED*** Regular expression matching all the allowed chars for IPv4.
***REMOVED*** @type {RegExp}
***REMOVED*** @private
***REMOVED*** @const
***REMOVED***
goog.net.Ipv4Address.REGEX_ = /^[0-9.]*$/;


***REMOVED***
***REMOVED*** The Maximum length for a netmask (aka, the number of bits for IPv4).
***REMOVED*** @type {number}
***REMOVED*** @const
***REMOVED***
goog.net.Ipv4Address.MAX_NETMASK_LENGTH = 32;


***REMOVED***
***REMOVED*** The Maximum address possible for IPv4.
***REMOVED*** @type {goog.math.Integer}
***REMOVED*** @private
***REMOVED*** @const
***REMOVED***
goog.net.Ipv4Address.MAX_ADDRESS_ = goog.math.Integer.ONE.shiftLeft(
    goog.net.Ipv4Address.MAX_NETMASK_LENGTH).subtract(goog.math.Integer.ONE);


***REMOVED***
***REMOVED*** @override
***REMOVED***
goog.net.Ipv4Address.prototype.toString = function() {
  if (this.ipStr_) {
    return this.ipStr_;
  }

  var ip = this.ip_.getBitsUnsigned(0);
  var octets = [];
  for (var i = 3; i >= 0; i--) {
    octets[i] = String((ip & 0xff));
    ip = ip >>> 8;
  }

  this.ipStr_ = octets.join('.');

  return this.ipStr_;
***REMOVED***


***REMOVED***
***REMOVED*** @override
***REMOVED***
goog.net.Ipv4Address.prototype.toUriString = function() {
  return this.toString();
***REMOVED***



***REMOVED***
***REMOVED*** Takes a string or a number and returns an IPv6 Address.
***REMOVED***
***REMOVED*** This constructor accepts strings and instance of goog.math.Integer.
***REMOVED*** If you pass a goog.math.Integer, make sure that its sign is set to positive.
***REMOVED*** @param {(string|!goog.math.Integer)} address The address to store.
***REMOVED***
***REMOVED*** @extends {goog.net.IpAddress}
***REMOVED***
goog.net.Ipv6Address = function(address) {
  var ip = goog.math.Integer.ZERO;
  if (address instanceof goog.math.Integer) {
    if (address.getSign() != 0 ||
        address.lessThan(goog.math.Integer.ZERO) ||
        address.greaterThan(goog.net.Ipv6Address.MAX_ADDRESS_)) {
      throw Error('The address does not look like a valid IPv6.');
    } else {
      ip = goog.object.clone(address);
    }
  } else {
    if (!goog.net.Ipv6Address.REGEX_.test(address)) {
      throw Error(address + ' is not a valid IPv6 address.');
    }

    var splitColon = address.split(':');
    if (splitColon[splitColon.length - 1].indexOf('.') != -1) {
      var newHextets = goog.net.Ipv6Address.dottedQuadtoHextets_(
          splitColon[splitColon.length - 1]);
      goog.array.removeAt(splitColon, splitColon.length - 1);
      goog.array.extend(splitColon, newHextets);
      address = splitColon.join(':');
    }

    var splitDoubleColon = address.split('::');
    if (splitDoubleColon.length > 2 ||
        (splitDoubleColon.length == 1 && splitColon.length != 8)) {
      throw Error(address + ' is not a valid IPv6 address.');
    }

    var ipArr;
    if (splitDoubleColon.length > 1) {
      ipArr = goog.net.Ipv6Address.explode_(splitDoubleColon);
    } else {
      ipArr = splitColon;
    }

    if (ipArr.length != 8) {
      throw Error(address + ' is not a valid IPv6 address');
    }

    for (var i = 0; i < ipArr.length; i++) {
      var parsedHextet = goog.math.Integer.fromString(ipArr[i], 16);
      if (parsedHextet.lessThan(goog.math.Integer.ZERO) ||
          parsedHextet.greaterThan(goog.net.Ipv6Address.MAX_HEXTET_VALUE_)) {
        throw Error(ipArr[i] + ' in ' + address + ' is not a valid hextet.');
      }
      ip = ip.shiftLeft(16).or(parsedHextet);
    }
  }
  goog.base(this,***REMOVED*****REMOVED*** @type {!goog.math.Integer}***REMOVED*** (ip), 6);
***REMOVED***
goog.inherits(goog.net.Ipv6Address, goog.net.IpAddress);


***REMOVED***
***REMOVED*** Regular expression matching all allowed chars for an IPv6.
***REMOVED*** @type {RegExp}
***REMOVED*** @private
***REMOVED*** @const
***REMOVED***
goog.net.Ipv6Address.REGEX_ = /^([a-fA-F0-9]*:){2}[a-fA-F0-9:.]*$/;


***REMOVED***
***REMOVED*** The Maximum length for a netmask (aka, the number of bits for IPv6).
***REMOVED*** @type {number}
***REMOVED*** @const
***REMOVED***
goog.net.Ipv6Address.MAX_NETMASK_LENGTH = 128;


***REMOVED***
***REMOVED*** The maximum value of a hextet.
***REMOVED*** @type {goog.math.Integer}
***REMOVED*** @private
***REMOVED*** @const
***REMOVED***
goog.net.Ipv6Address.MAX_HEXTET_VALUE_ = goog.math.Integer.fromInt(65535);


***REMOVED***
***REMOVED*** The Maximum address possible for IPv6.
***REMOVED*** @type {goog.math.Integer}
***REMOVED*** @private
***REMOVED*** @const
***REMOVED***
goog.net.Ipv6Address.MAX_ADDRESS_ = goog.math.Integer.ONE.shiftLeft(
    goog.net.Ipv6Address.MAX_NETMASK_LENGTH).subtract(goog.math.Integer.ONE);


***REMOVED***
***REMOVED*** @override
***REMOVED***
goog.net.Ipv6Address.prototype.toString = function() {
  if (this.ipStr_) {
    return this.ipStr_;
  }

  var outputArr = [];
  for (var i = 3; i >= 0; i--) {
    var bits = this.ip_.getBitsUnsigned(i);
    var firstHextet = bits >>> 16;
    var secondHextet = bits & 0xffff;
    outputArr.push(firstHextet.toString(16));
    outputArr.push(secondHextet.toString(16));
  }

  outputArr = goog.net.Ipv6Address.compress_(outputArr);
  this.ipStr_ = outputArr.join(':');
  return this.ipStr_;
***REMOVED***


***REMOVED***
***REMOVED*** @override
***REMOVED***
goog.net.Ipv6Address.prototype.toUriString = function() {
  return '[' + this.toString() + ']';
***REMOVED***


***REMOVED***
***REMOVED*** This method is in charge of expanding/exploding an IPv6 string from its
***REMOVED*** compressed form.
***REMOVED*** @private
***REMOVED*** @param {!Array.<string>} address An IPv6 address split around '::'.
***REMOVED*** @return {Array.<string>} The expanded version of the IPv6.
***REMOVED***
goog.net.Ipv6Address.explode_ = function(address) {
  var basePart = address[0].split(':');
  var secondPart = address[1].split(':');

  if (basePart.length == 1 && basePart[0] == '') {
    basePart = [];
  }
  if (secondPart.length == 1 && secondPart[0] == '') {
    secondPart = [];
  }

  // Now we fill the gap with 0.
  var gap = 8 - (basePart.length + secondPart.length);

  if (gap < 1) {
    return [];
  }

  goog.array.extend(basePart, goog.array.repeat('0', gap));

  // Now we merge the basePart + gap + secondPart
  goog.array.extend(basePart, secondPart);

  return basePart;
***REMOVED***


***REMOVED***
***REMOVED*** This method is in charge of compressing an expanded IPv6 array of hextets.
***REMOVED*** @private
***REMOVED*** @param {!Array.<string>} hextets The array of hextet.
***REMOVED*** @return {Array.<string>} The compressed version of this array.
***REMOVED***
goog.net.Ipv6Address.compress_ = function(hextets) {
  var bestStart = -1;
  var start = -1;
  var bestSize = 0;
  var size = 0;
  for (var i = 0; i < hextets.length; i++) {
    if (hextets[i] == '0') {
      size++;
      if (start == -1) {
        start = i;
      }
      if (size > bestSize) {
        bestSize = size;
        bestStart = start;
      }
    } else {
      start = -1;
      size = 0;
    }
  }

  if (bestSize > 0) {
    if ((bestStart + bestSize) == hextets.length) {
      hextets.push('');
    }
    hextets.splice(bestStart, bestSize, '');

    if (bestStart == 0) {
      hextets = [''].concat(hextets);
    }
  }
  return hextets;
***REMOVED***


***REMOVED***
***REMOVED*** This method will convert an IPv4 to a list of 2 hextets.
***REMOVED***
***REMOVED*** For instance, 1.2.3.4 will be converted to ['0102', '0304'].
***REMOVED*** @private
***REMOVED*** @param {string} quads An IPv4 as a string.
***REMOVED*** @return {Array.<string>} A list of 2 hextets.
***REMOVED***
goog.net.Ipv6Address.dottedQuadtoHextets_ = function(quads) {
  var ip4 = new goog.net.Ipv4Address(quads).toInteger();
  var bits = ip4.getBitsUnsigned(0);
  var hextets = [];

  hextets.push(((bits >>> 16) & 0xffff).toString(16));
  hextets.push((bits & 0xffff).toString(16));

  return hextets;
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} true if the IPv6 contains a mapped IPv4.
***REMOVED***
goog.net.Ipv6Address.prototype.isMappedIpv4Address = function() {
  return (this.ip_.getBitsUnsigned(3) == 0 &&
          this.ip_.getBitsUnsigned(2) == 0 &&
          this.ip_.getBitsUnsigned(1) == 0xffff);
***REMOVED***


***REMOVED***
***REMOVED*** Will return the mapped IPv4 address in this IPv6 address.
***REMOVED*** @return {goog.net.Ipv4Address} an IPv4 or null.
***REMOVED***
goog.net.Ipv6Address.prototype.getMappedIpv4Address = function() {
  if (!this.isMappedIpv4Address()) {
    return null;
  }

  var newIpv4 = new goog.math.Integer([this.ip_.getBitsUnsigned(0)], 0);
  return new goog.net.Ipv4Address(newIpv4);
***REMOVED***
