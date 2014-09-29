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
***REMOVED*** @fileoverview Provides a convenient API for data persistence with key and
***REMOVED*** object encryption. Without a valid secret, the existence of a particular
***REMOVED*** key can't be verified and values can't be decrypted. The value encryption
***REMOVED*** is salted, so subsequent writes of the same cleartext result in different
***REMOVED*** ciphertext. The ciphertext is***REMOVED***not* authenticated, so there is no protection
***REMOVED*** against data manipulation.
***REMOVED***
***REMOVED*** The metadata is***REMOVED***not* encrypted, so expired keys can be cleaned up without
***REMOVED*** decrypting them. If sensitive metadata is added in subclasses, it is up
***REMOVED*** to the subclass to protect this information, perhaps by embedding it in
***REMOVED*** the object.
***REMOVED***
***REMOVED***

goog.provide('goog.storage.EncryptedStorage');

goog.require('goog.crypt');
goog.require('goog.crypt.Arc4');
goog.require('goog.crypt.Sha1');
goog.require('goog.crypt.base64');
goog.require('goog.json');
goog.require('goog.json.Serializer');
goog.require('goog.storage.CollectableStorage');
goog.require('goog.storage.ErrorCode');
goog.require('goog.storage.RichStorage');
goog.require('goog.storage.RichStorage.Wrapper');
goog.require('goog.storage.mechanism.IterableMechanism');



***REMOVED***
***REMOVED*** Provides an encrypted storage. The keys are hashed with a secret, so
***REMOVED*** their existence cannot be verified without the knowledge of the secret.
***REMOVED*** The values are encrypted using the key, a salt, and the secret, so
***REMOVED*** stream cipher initialization varies for each stored value.
***REMOVED***
***REMOVED*** @param {!goog.storage.mechanism.IterableMechanism} mechanism The underlying
***REMOVED***     storage mechanism.
***REMOVED*** @param {string} secret The secret key used to encrypt the storage.
***REMOVED***
***REMOVED*** @extends {goog.storage.CollectableStorage}
***REMOVED***
goog.storage.EncryptedStorage = function(mechanism, secret) {
  goog.base(this, mechanism);
  this.secret_ = goog.crypt.stringToByteArray(secret);
  this.cleartextSerializer_ = new goog.json.Serializer();
***REMOVED***
goog.inherits(goog.storage.EncryptedStorage, goog.storage.CollectableStorage);


***REMOVED***
***REMOVED*** Metadata key under which the salt is stored.
***REMOVED***
***REMOVED*** @type {string}
***REMOVED*** @protected
***REMOVED***
goog.storage.EncryptedStorage.SALT_KEY = 'salt';


***REMOVED***
***REMOVED*** The secret used to encrypt the storage.
***REMOVED***
***REMOVED*** @type {Array.<number>}
***REMOVED*** @private
***REMOVED***
goog.storage.EncryptedStorage.prototype.secret_ = null;


***REMOVED***
***REMOVED*** The JSON serializer used to serialize values before encryption. This can
***REMOVED*** be potentially different from serializing for the storage mechanism (see
***REMOVED*** goog.storage.Storage), so a separate serializer is kept here.
***REMOVED***
***REMOVED*** @type {goog.json.Serializer}
***REMOVED*** @private
***REMOVED***
goog.storage.EncryptedStorage.prototype.cleartextSerializer_ = null;


***REMOVED***
***REMOVED*** Hashes a key using the secret.
***REMOVED***
***REMOVED*** @param {string} key The key.
***REMOVED*** @return {string} The hash.
***REMOVED*** @private
***REMOVED***
goog.storage.EncryptedStorage.prototype.hashKeyWithSecret_ = function(key) {
  var sha1 = new goog.crypt.Sha1();
  sha1.update(goog.crypt.stringToByteArray(key));
  sha1.update(this.secret_);
  return goog.crypt.base64.encodeByteArray(sha1.digest(), true);
***REMOVED***


***REMOVED***
***REMOVED*** Encrypts a value using a key, a salt, and the secret.
***REMOVED***
***REMOVED*** @param {!Array.<number>} salt The salt.
***REMOVED*** @param {string} key The key.
***REMOVED*** @param {string} value The cleartext value.
***REMOVED*** @return {string} The encrypted value.
***REMOVED*** @private
***REMOVED***
goog.storage.EncryptedStorage.prototype.encryptValue_ = function(
    salt, key, value) {
  if (!(salt.length > 0)) {
    throw Error('Non-empty salt must be provided');
  }
  var sha1 = new goog.crypt.Sha1();
  sha1.update(goog.crypt.stringToByteArray(key));
  sha1.update(salt);
  sha1.update(this.secret_);
  var arc4 = new goog.crypt.Arc4();
  arc4.setKey(sha1.digest());
  // Warm up the streamcypher state, see goog.crypt.Arc4 for details.
  arc4.discard(1536);
  var bytes = goog.crypt.stringToByteArray(value);
  arc4.crypt(bytes);
  return goog.crypt.byteArrayToString(bytes);
***REMOVED***


***REMOVED***
***REMOVED*** Decrypts a value using a key, a salt, and the secret.
***REMOVED***
***REMOVED*** @param {!Array.<number>} salt The salt.
***REMOVED*** @param {string} key The key.
***REMOVED*** @param {string} value The encrypted value.
***REMOVED*** @return {string} The decrypted value.
***REMOVED*** @private
***REMOVED***
goog.storage.EncryptedStorage.prototype.decryptValue_ = function(
    salt, key, value) {
  // ARC4 is symmetric.
  return this.encryptValue_(salt, key, value);
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.storage.EncryptedStorage.prototype.set = function(
    key, value, opt_expiration) {
  if (!goog.isDef(value)) {
    goog.storage.EncryptedStorage.prototype.remove.call(this, key);
    return;
  }
  var salt = [];
  // 64-bit random salt.
  for (var i = 0; i < 8; ++i) {
    salt[i] = Math.floor(Math.random()***REMOVED*** 0x100);
  }
  var wrapper = new goog.storage.RichStorage.Wrapper(
      this.encryptValue_(salt, key,
                         this.cleartextSerializer_.serialize(value)));
  wrapper[goog.storage.EncryptedStorage.SALT_KEY] = salt;
  goog.base(this, 'set', this.hashKeyWithSecret_(key), wrapper, opt_expiration);
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.storage.EncryptedStorage.prototype.getWrapper = function(
    key, opt_expired) {
  var wrapper = goog.base(this, 'getWrapper',
                          this.hashKeyWithSecret_(key), opt_expired);
  if (!wrapper) {
    return undefined;
  }
  var value = goog.storage.RichStorage.Wrapper.unwrap(wrapper);
  var salt = wrapper[goog.storage.EncryptedStorage.SALT_KEY];
  if (!goog.isString(value) || !goog.isArray(salt) || !salt.length) {
    throw goog.storage.ErrorCode.INVALID_VALUE;
  }
  var json = this.decryptValue_(salt, key, value);
 ***REMOVED*****REMOVED*** @preserveTry***REMOVED***
  try {
    wrapper[goog.storage.RichStorage.DATA_KEY] = goog.json.parse(json);
  } catch (e) {
    throw goog.storage.ErrorCode.DECRYPTION_ERROR;
  }
  return wrapper;
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.storage.EncryptedStorage.prototype.remove = function(key) {
  goog.base(this, 'remove', this.hashKeyWithSecret_(key));
***REMOVED***
