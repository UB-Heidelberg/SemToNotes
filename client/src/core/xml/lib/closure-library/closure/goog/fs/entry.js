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
***REMOVED*** @fileoverview Wrappers for HTML5 Entry objects. These are all in the same
***REMOVED*** file to avoid circular dependency issues.
***REMOVED***
***REMOVED*** When adding or modifying functionality in this namespace, be sure to update
***REMOVED*** the mock counterparts in goog.testing.fs.
***REMOVED***
***REMOVED***

goog.provide('goog.fs.DirectoryEntry');
goog.provide('goog.fs.DirectoryEntry.Behavior');
goog.provide('goog.fs.Entry');
goog.provide('goog.fs.FileEntry');

goog.require('goog.array');
goog.require('goog.async.Deferred');
goog.require('goog.fs.Error');
goog.require('goog.fs.FileWriter');
goog.require('goog.functions');
goog.require('goog.string');



***REMOVED***
***REMOVED*** The abstract class for entries in the filesystem.
***REMOVED***
***REMOVED*** @param {!goog.fs.FileSystem} fs The wrapped filesystem.
***REMOVED*** @param {!Entry} entry The underlying Entry object.
***REMOVED***
***REMOVED***
goog.fs.Entry = function(fs, entry) {
 ***REMOVED*****REMOVED***
  ***REMOVED*** The wrapped filesystem.
  ***REMOVED***
  ***REMOVED*** @type {!goog.fs.FileSystem}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.fs_ = fs;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The underlying Entry object.
  ***REMOVED***
  ***REMOVED*** @type {!Entry}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.entry_ = entry;
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} Whether or not this entry is a file.
***REMOVED***
goog.fs.Entry.prototype.isFile = function() {
  return this.entry_.isFile;
***REMOVED***


***REMOVED***
***REMOVED*** @return {boolean} Whether or not this entry is a directory.
***REMOVED***
goog.fs.Entry.prototype.isDirectory = function() {
  return this.entry_.isDirectory;
***REMOVED***


***REMOVED***
***REMOVED*** @return {string} The name of this entry.
***REMOVED***
goog.fs.Entry.prototype.getName = function() {
  return this.entry_.name;
***REMOVED***


***REMOVED***
***REMOVED*** @return {string} The full path to this entry.
***REMOVED***
goog.fs.Entry.prototype.getFullPath = function() {
  return this.entry_.fullPath;
***REMOVED***


***REMOVED***
***REMOVED*** @return {!goog.fs.FileSystem} The filesystem backing this entry.
***REMOVED***
goog.fs.Entry.prototype.getFileSystem = function() {
  return this.fs_;
***REMOVED***


***REMOVED***
***REMOVED*** Retrieves the last modified date for this entry.
***REMOVED***
***REMOVED*** @return {!goog.async.Deferred} The deferred Date for this entry. If an error
***REMOVED***     occurs, the errback is called with a {@link goog.fs.Error}.
***REMOVED***
goog.fs.Entry.prototype.getLastModified = function() {
  return this.getMetadata().addCallback(function(metadata) {
    return metadata.modificationTime;
  });
***REMOVED***


***REMOVED***
***REMOVED*** Retrieves the metadata for this entry.
***REMOVED***
***REMOVED*** @return {!goog.async.Deferred} The deferred Metadata for this entry. If an
***REMOVED***     error occurs, the errback is called with a {@link goog.fs.Error}.
***REMOVED***
goog.fs.Entry.prototype.getMetadata = function() {
  var d = new goog.async.Deferred();

  this.entry_.getMetadata(
      function(metadata) { d.callback(metadata); },
      goog.bind(function(err) {
        var msg = 'retrieving metadata for ' + this.getFullPath();
        d.errback(new goog.fs.Error(err.code, msg));
      }, this));
  return d;
***REMOVED***


***REMOVED***
***REMOVED*** Move this entry to a new location.
***REMOVED***
***REMOVED*** @param {!goog.fs.DirectoryEntry} parent The new parent directory.
***REMOVED*** @param {string=} opt_newName The new name of the entry. If omitted, the entry
***REMOVED***     retains its original name.
***REMOVED*** @return {!goog.async.Deferred} The deferred {@link goog.fs.FileEntry} or
***REMOVED***     {@link goog.fs.DirectoryEntry} for the new entry. If an error occurs, the
***REMOVED***     errback is called with a {@link goog.fs.Error}.
***REMOVED***
goog.fs.Entry.prototype.moveTo = function(parent, opt_newName) {
  var d = new goog.async.Deferred();
  this.entry_.moveTo(
      parent.dir_, opt_newName,
      goog.bind(function(entry) { d.callback(this.wrapEntry(entry)); }, this),
      goog.bind(function(err) {
        var msg = 'moving ' + this.getFullPath() + ' into ' +
            parent.getFullPath() +
            (opt_newName ? ', renaming to ' + opt_newName : '');
        d.errback(new goog.fs.Error(err.code, msg));
      }, this));
  return d;
***REMOVED***


***REMOVED***
***REMOVED*** Copy this entry to a new location.
***REMOVED***
***REMOVED*** @param {!goog.fs.DirectoryEntry} parent The new parent directory.
***REMOVED*** @param {string=} opt_newName The name of the new entry. If omitted, the new
***REMOVED***     entry has the same name as the original.
***REMOVED*** @return {!goog.async.Deferred} The deferred {@link goog.fs.FileEntry} or
***REMOVED***     {@link goog.fs.DirectoryEntry} for the new entry. If an error occurs, the
***REMOVED***     errback is called with a {@link goog.fs.Error}.
***REMOVED***
goog.fs.Entry.prototype.copyTo = function(parent, opt_newName) {
  var d = new goog.async.Deferred();
  this.entry_.copyTo(
      parent.dir_, opt_newName,
      goog.bind(function(entry) { d.callback(this.wrapEntry(entry)); }, this),
      goog.bind(function(err) {
        var msg = 'copying ' + this.getFullPath() + ' into ' +
            parent.getFullPath() +
            (opt_newName ? ', renaming to ' + opt_newName : '');
        d.errback(new goog.fs.Error(err.code, msg));
      }, this));
  return d;
***REMOVED***


***REMOVED***
***REMOVED*** Wrap an HTML5 entry object in an appropriate subclass instance.
***REMOVED***
***REMOVED*** @param {!Entry} entry The underlying Entry object.
***REMOVED*** @return {!goog.fs.Entry} The appropriate subclass wrapper.
***REMOVED*** @protected
***REMOVED***
goog.fs.Entry.prototype.wrapEntry = function(entry) {
  return entry.isFile ?
      new goog.fs.FileEntry(this.fs_,***REMOVED*****REMOVED*** @type {!FileEntry}***REMOVED*** (entry)) :
      new goog.fs.DirectoryEntry(
          this.fs_,***REMOVED*****REMOVED*** @type {!DirectoryEntry}***REMOVED*** (entry));
***REMOVED***


***REMOVED***
***REMOVED*** Get the URL for this file.
***REMOVED***
***REMOVED*** @param {string=} opt_mimeType The MIME type that will be served for the URL.
***REMOVED*** @return {string} The URL.
***REMOVED***
goog.fs.Entry.prototype.toUrl = function(opt_mimeType) {
  return this.entry_.toURL(opt_mimeType);
***REMOVED***


***REMOVED***
***REMOVED*** Get the URI for this file.
***REMOVED***
***REMOVED*** @deprecated Use {@link #toUrl} instead.
***REMOVED*** @param {string=} opt_mimeType The MIME type that will be served for the URI.
***REMOVED*** @return {string} The URI.
***REMOVED***
goog.fs.Entry.prototype.toUri = goog.fs.Entry.prototype.toUrl;


***REMOVED***
***REMOVED*** Remove this entry.
***REMOVED***
***REMOVED*** @return {!goog.async.Deferred} A deferred object. If the removal succeeds,
***REMOVED***     the callback is called with true. If an error occurs, the errback is
***REMOVED***     called a {@link goog.fs.Error}.
***REMOVED***
goog.fs.Entry.prototype.remove = function() {
  var d = new goog.async.Deferred();
  this.entry_.remove(
      goog.bind(d.callback, d, true /* result***REMOVED***),
      goog.bind(function(err) {
        var msg = 'removing ' + this.getFullPath();
        d.errback(new goog.fs.Error(err.code, msg));
      }, this));
  return d;
***REMOVED***


***REMOVED***
***REMOVED*** Gets the parent directory.
***REMOVED***
***REMOVED*** @return {!goog.async.Deferred} The deferred {@link goog.fs.DirectoryEntry}.
***REMOVED***     If an error occurs, the errback is called with a {@link goog.fs.Error}.
***REMOVED***
goog.fs.Entry.prototype.getParent = function() {
  var d = new goog.async.Deferred();
  this.entry_.getParent(
      goog.bind(function(parent) {
        d.callback(new goog.fs.DirectoryEntry(this.fs_, parent));
      }, this),
      goog.bind(function(err) {
        var msg = 'getting parent of ' + this.getFullPath();
        d.errback(new goog.fs.Error(err.code, msg));
      }, this));
  return d;
***REMOVED***



***REMOVED***
***REMOVED*** A directory in a local FileSystem.
***REMOVED***
***REMOVED*** This should not be instantiated directly. Instead, it should be accessed via
***REMOVED*** {@link goog.fs.FileSystem#getRoot} or
***REMOVED*** {@link goog.fs.DirectoryEntry#getDirectoryEntry}.
***REMOVED***
***REMOVED*** @param {!goog.fs.FileSystem} fs The wrapped filesystem.
***REMOVED*** @param {!DirectoryEntry} dir The underlying DirectoryEntry object.
***REMOVED***
***REMOVED*** @extends {goog.fs.Entry}
***REMOVED***
goog.fs.DirectoryEntry = function(fs, dir) {
  goog.base(this, fs, dir);

 ***REMOVED*****REMOVED***
  ***REMOVED*** The underlying DirectoryEntry object.
  ***REMOVED***
  ***REMOVED*** @type {!DirectoryEntry}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.dir_ = dir;
***REMOVED***
goog.inherits(goog.fs.DirectoryEntry, goog.fs.Entry);


***REMOVED***
***REMOVED*** Behaviors for getting files and directories.
***REMOVED*** @enum {number}
***REMOVED***
goog.fs.DirectoryEntry.Behavior = {
 ***REMOVED*****REMOVED***
  ***REMOVED*** Get the file if it exists, error out if it doesn't.
 ***REMOVED*****REMOVED***
  DEFAULT: 1,
 ***REMOVED*****REMOVED***
  ***REMOVED*** Get the file if it exists, create it if it doesn't.
 ***REMOVED*****REMOVED***
  CREATE: 2,
 ***REMOVED*****REMOVED***
  ***REMOVED*** Error out if the file exists, create it if it doesn't.
 ***REMOVED*****REMOVED***
  CREATE_EXCLUSIVE: 3
***REMOVED***


***REMOVED***
***REMOVED*** Get a file in the directory.
***REMOVED***
***REMOVED*** @param {string} path The path to the file, relative to this directory.
***REMOVED*** @param {goog.fs.DirectoryEntry.Behavior=} opt_behavior The behavior for
***REMOVED***     handling an existing file, or the lack thereof.
***REMOVED*** @return {!goog.async.Deferred} The deferred {@link goog.fs.FileEntry}. If an
***REMOVED***     error occurs, the errback is called with a {@link goog.fs.Error}.
***REMOVED***
goog.fs.DirectoryEntry.prototype.getFile = function(path, opt_behavior) {
  var d = new goog.async.Deferred();
  this.dir_.getFile(
      path, this.getOptions_(opt_behavior),
      goog.bind(function(entry) {
        d.callback(new goog.fs.FileEntry(this.fs_, entry));
      }, this),
      goog.bind(function(err) {
        var msg = 'loading file ' + path + ' from ' + this.getFullPath();
        d.errback(new goog.fs.Error(err.code, msg));
      }, this));
  return d;
***REMOVED***


***REMOVED***
***REMOVED*** Get a directory within this directory.
***REMOVED***
***REMOVED*** @param {string} path The path to the directory, relative to this directory.
***REMOVED*** @param {goog.fs.DirectoryEntry.Behavior=} opt_behavior The behavior for
***REMOVED***     handling an existing directory, or the lack thereof.
***REMOVED*** @return {!goog.async.Deferred} The deferred {@link goog.fs.DirectoryEntry}.
***REMOVED***     If an error occurs, the errback is called a {@link goog.fs.Error}.
***REMOVED***
goog.fs.DirectoryEntry.prototype.getDirectory = function(path, opt_behavior) {
  var d = new goog.async.Deferred();
  this.dir_.getDirectory(
      path, this.getOptions_(opt_behavior),
      goog.bind(function(entry) {
        d.callback(new goog.fs.DirectoryEntry(this.fs_, entry));
      }, this),
      goog.bind(function(err) {
        var msg = 'loading directory ' + path + ' from ' + this.getFullPath();
        d.errback(new goog.fs.Error(err.code, msg));
      }, this));
  return d;
***REMOVED***


***REMOVED***
***REMOVED*** Opens the directory for the specified path, creating the directory and any
***REMOVED*** intermediate directories as necessary.
***REMOVED***
***REMOVED*** @param {string} path The directory path to create. May be absolute or
***REMOVED***     relative to the current directory. The parent directory ".." and current
***REMOVED***     directory "." are supported.
***REMOVED*** @return {!goog.async.Deferred} A deferred {@link goog.fs.DirectoryEntry} for
***REMOVED***     the requested path. If an error occurs, the errback is called with a
***REMOVED***     {@link goog.fs.Error}.
***REMOVED***
goog.fs.DirectoryEntry.prototype.createPath = function(path) {
  // If the path begins at the root, reinvoke createPath on the root directory.
  if (goog.string.startsWith(path, '/')) {
    var root = this.getFileSystem().getRoot();
    if (this.getFullPath() != root.getFullPath()) {
      return root.createPath(path);
    }
  }

  // Filter out any empty path components caused by '//' or a leading slash.
  var parts = goog.array.filter(path.split('/'), goog.functions.identity);
  var existed = [];

  function getNextDirectory(dir) {
    if (!parts.length) {
      return goog.async.Deferred.succeed(dir);
    }

    var def;
    var nextDir = parts.shift();

    if (nextDir == '..') {
      def = dir.getParent();
    } else if (nextDir == '.') {
      def = goog.async.Deferred.succeed(dir);
    } else {
      def = dir.getDirectory(nextDir, goog.fs.DirectoryEntry.Behavior.CREATE);
    }
    return def.addCallback(getNextDirectory);
  }

  return getNextDirectory(this);
***REMOVED***


***REMOVED***
***REMOVED*** Gets a list of all entries in this directory.
***REMOVED***
***REMOVED*** @return {!goog.async.Deferred} The deferred list of {@link goog.fs.Entry}
***REMOVED***     results. If an error occurs, the errback is called with a
***REMOVED***     {@link goog.fs.Error}.
***REMOVED***
goog.fs.DirectoryEntry.prototype.listDirectory = function() {
  var d = new goog.async.Deferred();
  var reader = this.dir_.createReader();
  var results = [];

  var errorCallback = goog.bind(function(err) {
    var msg = 'listing directory ' + this.getFullPath();
    d.errback(new goog.fs.Error(err.code, msg));
  }, this);

  var successCallback = goog.bind(function(entries) {
    if (entries.length) {
      for (var i = 0, entry; entry = entries[i]; i++) {
        results.push(this.wrapEntry(entry));
      }
      reader.readEntries(successCallback, errorCallback);
    } else {
      d.callback(results);
    }
  }, this);

  reader.readEntries(successCallback, errorCallback);
  return d;
***REMOVED***


***REMOVED***
***REMOVED*** Removes this directory and all its contents.
***REMOVED***
***REMOVED*** @return {!goog.async.Deferred} A deferred object. If the removal succeeds,
***REMOVED***     the callback is called with true. If an error occurs, the errback is
***REMOVED***     called a {@link goog.fs.Error}.
***REMOVED***
goog.fs.DirectoryEntry.prototype.removeRecursively = function() {
  var d = new goog.async.Deferred();
  this.dir_.removeRecursively(
      goog.bind(d.callback, d, true /* result***REMOVED***),
      goog.bind(function(err) {
        var msg = 'removing ' + this.getFullPath() + ' recursively';
        d.errback(new goog.fs.Error(err.code, msg));
      }, this));
  return d;
***REMOVED***


***REMOVED***
***REMOVED*** Converts a value in the Behavior enum into an options object expected by the
***REMOVED*** File API.
***REMOVED***
***REMOVED*** @param {goog.fs.DirectoryEntry.Behavior=} opt_behavior The behavior for
***REMOVED***     existing files.
***REMOVED*** @return {Object.<boolean>} The options object expected by the File API.
***REMOVED*** @private
***REMOVED***
goog.fs.DirectoryEntry.prototype.getOptions_ = function(opt_behavior) {
  if (opt_behavior == goog.fs.DirectoryEntry.Behavior.CREATE) {
    return {'create': true***REMOVED***
  } else if (opt_behavior == goog.fs.DirectoryEntry.Behavior.CREATE_EXCLUSIVE) {
    return {'create': true, 'exclusive': true***REMOVED***
  } else {
    return {***REMOVED***
  }
***REMOVED***



***REMOVED***
***REMOVED*** A file in a local filesystem.
***REMOVED***
***REMOVED*** This should not be instantiated directly. Instead, it should be accessed via
***REMOVED*** {@link goog.fs.DirectoryEntry#getDirectoryEntry}.
***REMOVED***
***REMOVED*** @param {!goog.fs.FileSystem} fs The wrapped filesystem.
***REMOVED*** @param {!FileEntry} file The underlying FileEntry object.
***REMOVED***
***REMOVED*** @extends {goog.fs.Entry}
***REMOVED***
goog.fs.FileEntry = function(fs, file) {
  goog.base(this, fs, file);

 ***REMOVED*****REMOVED***
  ***REMOVED*** The underlying FileEntry object.
  ***REMOVED***
  ***REMOVED*** @type {!FileEntry}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.file_ = file;
***REMOVED***
goog.inherits(goog.fs.FileEntry, goog.fs.Entry);


***REMOVED***
***REMOVED*** Create a writer for writing to the file.
***REMOVED***
***REMOVED*** @return {!goog.async.Deferred} The deferred {@link goog.fs.FileWriter}. If an
***REMOVED***     error occurs, the errback is called with a {@link goog.fs.Error}.
***REMOVED***
goog.fs.FileEntry.prototype.createWriter = function() {
  var d = new goog.async.Deferred();
  this.file_.createWriter(
      function(w) { d.callback(new goog.fs.FileWriter(w)); },
      goog.bind(function(err) {
        var msg = 'creating writer for ' + this.getFullPath();
        d.errback(new goog.fs.Error(err.code, msg));
      }, this));
  return d;
***REMOVED***


***REMOVED***
***REMOVED*** Get the file contents as a File blob.
***REMOVED***
***REMOVED*** @return {!goog.async.Deferred} The deferred File. If an error occurs, the
***REMOVED***     errback is called with a {@link goog.fs.Error}.
***REMOVED***
goog.fs.FileEntry.prototype.file = function() {
  var d = new goog.async.Deferred();
  this.file_.file(
      function(f) { d.callback(f); },
      goog.bind(function(err) {
        var msg = 'getting file for ' + this.getFullPath();
        d.errback(new goog.fs.Error(err.code, msg));
      }, this));
  return d;
***REMOVED***
