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
***REMOVED*** @fileoverview A class for downloading remote files and storing them
***REMOVED*** locally using the HTML5 FileSystem API.
***REMOVED***
***REMOVED*** The directory structure is of the form /HASH/URL/BASENAME:
***REMOVED***
***REMOVED*** The HASH portion is a three-character slice of the hash of the URL. Since the
***REMOVED*** filesystem has a limit of about 5000 files per directory, this should divide
***REMOVED*** the downloads roughly evenly among about 5000 directories, thus allowing for
***REMOVED*** at most 5000^2 downloads.
***REMOVED***
***REMOVED*** The URL portion is the (sanitized) full URL used for downloading the file.
***REMOVED*** This is used to ensure that each file ends up in a different location, even
***REMOVED*** if the HASH and BASENAME are the same.
***REMOVED***
***REMOVED*** The BASENAME portion is the basename of the URL. It's used for the filename
***REMOVED*** proper so that the local filesystem: URL will be downloaded to a file with a
***REMOVED*** recognizable name.
***REMOVED***
***REMOVED***

goog.provide('goog.net.FileDownloader');
goog.provide('goog.net.FileDownloader.Error');

goog.require('goog.Disposable');
goog.require('goog.asserts');
goog.require('goog.async.Deferred');
goog.require('goog.crypt.hash32');
goog.require('goog.debug.Error');
goog.require('goog.events.EventHandler');
goog.require('goog.fs');
goog.require('goog.fs.DirectoryEntry.Behavior');
goog.require('goog.fs.Error.ErrorCode');
goog.require('goog.fs.FileSaver.EventType');
goog.require('goog.net.EventType');
goog.require('goog.net.XhrIo.ResponseType');
goog.require('goog.net.XhrIoPool');



***REMOVED***
***REMOVED*** A class for downloading remote files and storing them locally using the
***REMOVED*** HTML5 filesystem API.
***REMOVED***
***REMOVED*** @param {!goog.fs.DirectoryEntry} dir The directory in which the downloaded
***REMOVED***     files are stored. This directory should be solely managed by
***REMOVED***     FileDownloader.
***REMOVED*** @param {goog.net.XhrIoPool=} opt_pool The pool of XhrIo objects to use for
***REMOVED***     downloading files.
***REMOVED***
***REMOVED*** @extends {goog.Disposable}
***REMOVED***
goog.net.FileDownloader = function(dir, opt_pool) {
  goog.base(this);

 ***REMOVED*****REMOVED***
  ***REMOVED*** The directory in which the downloaded files are stored.
  ***REMOVED*** @type {!goog.fs.DirectoryEntry}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.dir_ = dir;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The pool of XHRs to use for capturing.
  ***REMOVED*** @type {!goog.net.XhrIoPool}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.pool_ = opt_pool || new goog.net.XhrIoPool();

 ***REMOVED*****REMOVED***
  ***REMOVED*** A map from URLs to active downloads running for those URLs.
  ***REMOVED*** @type {!Object.<!goog.net.FileDownloader.Download_>}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.downloads_ = {***REMOVED***

 ***REMOVED*****REMOVED***
  ***REMOVED*** The handler for URL capturing events.
  ***REMOVED*** @type {!goog.events.EventHandler}
  ***REMOVED*** @private
 ***REMOVED*****REMOVED***
  this.eventHandler_ = new goog.events.EventHandler(this);
***REMOVED***
goog.inherits(goog.net.FileDownloader, goog.Disposable);


***REMOVED***
***REMOVED*** Download a remote file and save its contents to the filesystem. A given file
***REMOVED*** is uniquely identified by its URL string; this means that the relative and
***REMOVED*** absolute URLs for a single file are considered different for the purposes of
***REMOVED*** the FileDownloader.
***REMOVED***
***REMOVED*** Returns a Deferred that will contain the downloaded blob. If there's an error
***REMOVED*** while downloading the URL, this Deferred will be passed the
***REMOVED*** {@link goog.net.FileDownloader.Error} object as an errback.
***REMOVED***
***REMOVED*** If a download is already in progress for the given URL, this will return the
***REMOVED*** deferred blob for that download. If the URL has already been downloaded, this
***REMOVED*** will fail once it tries to save the downloaded blob.
***REMOVED***
***REMOVED*** When a download is in progress, all Deferreds returned for that download will
***REMOVED*** be branches of a single parent. If all such branches are cancelled, or if one
***REMOVED*** is cancelled with opt_deepCancel set, then the download will be cancelled as
***REMOVED*** well.
***REMOVED***
***REMOVED*** @param {string} url The URL of the file to download.
***REMOVED*** @return {!goog.async.Deferred} The deferred result blob.
***REMOVED***
goog.net.FileDownloader.prototype.download = function(url) {
  if (this.isDownloading(url)) {
    return this.downloads_[url].deferred.branch(true /* opt_propagateCancel***REMOVED***);
  }

  var download = new goog.net.FileDownloader.Download_(url, this);
  this.downloads_[url] = download;
  this.pool_.getObject(goog.bind(this.gotXhr_, this, download));
  return download.deferred.branch(true /* opt_propagateCancel***REMOVED***);
***REMOVED***


***REMOVED***
***REMOVED*** Return a Deferred that will fire once no download is active for a given URL.
***REMOVED*** If there's no download active for that URL when this is called, the deferred
***REMOVED*** will fire immediately; otherwise, it will fire once the download is complete,
***REMOVED*** whether or not it succeeds.
***REMOVED***
***REMOVED*** @param {string} url The URL of the download to wait for.
***REMOVED*** @return {!goog.async.Deferred} The Deferred that will fire when the download
***REMOVED***     is complete.
***REMOVED***
goog.net.FileDownloader.prototype.waitForDownload = function(url) {
  var deferred = new goog.async.Deferred();
  if (this.isDownloading(url)) {
    this.downloads_[url].deferred.addBoth(function() {
      deferred.callback(null);
    }, this);
  } else {
    deferred.callback(null);
  }
  return deferred;
***REMOVED***


***REMOVED***
***REMOVED*** Returns whether or not there is an active download for a given URL.
***REMOVED***
***REMOVED*** @param {string} url The URL of the download to check.
***REMOVED*** @return {boolean} Whether or not there is an active download for the URL.
***REMOVED***
goog.net.FileDownloader.prototype.isDownloading = function(url) {
  return url in this.downloads_;
***REMOVED***


***REMOVED***
***REMOVED*** Load a downloaded blob from the filesystem. Will fire a deferred error if the
***REMOVED*** given URL has not yet been downloaded.
***REMOVED***
***REMOVED*** @param {string} url The URL of the blob to load.
***REMOVED*** @return {!goog.async.Deferred} The deferred Blob object. The callback will be
***REMOVED***     passed the blob. If a file API error occurs while loading the blob, that
***REMOVED***     error will be passed to the errback.
***REMOVED***
goog.net.FileDownloader.prototype.getDownloadedBlob = function(url) {
  return this.getFile_(url).
      addCallback(function(fileEntry) { return fileEntry.file(); });
***REMOVED***


***REMOVED***
***REMOVED*** Get the local filesystem: URL for a downloaded file. This is different from
***REMOVED*** the blob: URL that's available from getDownloadedBlob(). If the end user
***REMOVED*** accesses the filesystem: URL, the resulting file's name will be determined by
***REMOVED*** the download filename as opposed to an arbitrary GUID. In addition, the
***REMOVED*** filesystem: URL is connected to a filesystem location, so if the download is
***REMOVED*** removed then that URL will become invalid.
***REMOVED***
***REMOVED*** Warning: in Chrome 12, some filesystem: URLs are opened inline. This means
***REMOVED*** that e.g. HTML pages given to the user via filesystem: URLs will be opened
***REMOVED*** and processed by the browser.
***REMOVED***
***REMOVED*** @param {string} url The URL of the file to get the URL of.
***REMOVED*** @return {!goog.async.Deferred} The deferred filesystem: URL. The callback
***REMOVED***     will be passed the URL. If a file API error occurs while loading the
***REMOVED***     blob, that error will be passed to the errback.
***REMOVED***
goog.net.FileDownloader.prototype.getLocalUrl = function(url) {
  return this.getFile_(url).
      addCallback(function(fileEntry) { return fileEntry.toUrl(); });
***REMOVED***


***REMOVED***
***REMOVED*** Return (deferred) whether or not a URL has been downloaded. Will fire a
***REMOVED*** deferred error if something goes wrong when determining this.
***REMOVED***
***REMOVED*** @param {string} url The URL to check.
***REMOVED*** @return {!goog.async.Deferred} The deferred boolean. The callback will be
***REMOVED***     passed the boolean. If a file API error occurs while checking the
***REMOVED***     existence of the downloaded URL, that error will be passed to the
***REMOVED***     errback.
***REMOVED***
goog.net.FileDownloader.prototype.isDownloaded = function(url) {
  var deferred = new goog.async.Deferred();
  var blobDeferred = this.getDownloadedBlob(url);
  blobDeferred.addCallback(function() {
    deferred.callback(true);
  });
  blobDeferred.addErrback(function(err) {
    if (err.code == goog.fs.Error.ErrorCode.NOT_FOUND) {
      deferred.callback(false);
    } else {
      deferred.errback(err);
    }
  });
  return deferred;
***REMOVED***


***REMOVED***
***REMOVED*** Remove a URL from the FileDownloader.
***REMOVED***
***REMOVED*** This returns a Deferred. If the removal is completed successfully, its
***REMOVED*** callback will be called without any value. If the removal fails, its errback
***REMOVED*** will be called with the {@link goog.fs.Error}.
***REMOVED***
***REMOVED*** @param {string} url The URL to remove.
***REMOVED*** @return {!goog.async.Deferred} The deferred used for registering callbacks on
***REMOVED***     success or on error.
***REMOVED***
goog.net.FileDownloader.prototype.remove = function(url) {
  return this.getDir_(url, goog.fs.DirectoryEntry.Behavior.DEFAULT).
      addCallback(function(dir) { return dir.removeRecursively(); });
***REMOVED***


***REMOVED***
***REMOVED*** Save a blob for a given URL. This works just as through the blob were
***REMOVED*** downloaded form that URL, except you specify the blob and no HTTP request is
***REMOVED*** made.
***REMOVED***
***REMOVED*** If the URL is currently being downloaded, it's indeterminate whether the blob
***REMOVED*** being set or the blob being downloaded will end up in the filesystem.
***REMOVED*** Whichever one doesn't get saved will have an error. To ensure that one or the
***REMOVED*** other takes precedence, use {@link #waitForDownload} to allow the download to
***REMOVED*** complete before setting the blob.
***REMOVED***
***REMOVED*** @param {string} url The URL at which to set the blob.
***REMOVED*** @param {!Blob} blob The blob to set.
***REMOVED*** @param {string=} opt_name The name of the file. If this isn't given, it's
***REMOVED***     determined from the URL.
***REMOVED*** @return {!goog.async.Deferred} The deferred used for registering callbacks on
***REMOVED***     success or on error. This can be cancelled just like a {@link #download}
***REMOVED***     Deferred. The objects passed to the errback will be
***REMOVED***     {@link goog.net.FileDownloader.Error}s.
***REMOVED***
goog.net.FileDownloader.prototype.setBlob = function(url, blob, opt_name) {
  var name = this.sanitize_(opt_name || this.urlToName_(url));
  var download = new goog.net.FileDownloader.Download_(url, this);
  this.downloads_[url] = download;
  download.blob = blob;
  this.getDir_(download.url, goog.fs.DirectoryEntry.Behavior.CREATE_EXCLUSIVE).
      addCallback(function(dir) {
        return dir.getFile(
            name, goog.fs.DirectoryEntry.Behavior.CREATE_EXCLUSIVE);
      }).
      addCallback(goog.bind(this.fileSuccess_, this, download)).
      addErrback(goog.bind(this.error_, this, download));
  return download.deferred.branch(true /* opt_propagateCancel***REMOVED***);
***REMOVED***


***REMOVED***
***REMOVED*** The callback called when an XHR becomes available from the XHR pool.
***REMOVED***
***REMOVED*** @param {!goog.net.FileDownloader.Download_} download The download object for
***REMOVED***     this download.
***REMOVED*** @param {!goog.net.XhrIo} xhr The XhrIo object for downloading the page.
***REMOVED*** @private
***REMOVED***
goog.net.FileDownloader.prototype.gotXhr_ = function(download, xhr) {
  if (download.cancelled) {
    this.freeXhr_(xhr);
    return;
  }

  this.eventHandler_.listen(
  ***REMOVED*** goog.net.EventType.SUCCESS,
      goog.bind(this.xhrSuccess_, this, download));
  this.eventHandler_.listen(
  ***REMOVED*** [goog.net.EventType.ERROR, goog.net.EventType.ABORT],
      goog.bind(this.error_, this, download));
  this.eventHandler_.listen(
  ***REMOVED*** goog.net.EventType.READY,
      goog.bind(this.freeXhr_, this, xhr));

  download.xhr = xhr;
  xhr.setResponseType(goog.net.XhrIo.ResponseType.ARRAY_BUFFER);
  xhr.send(download.url);
***REMOVED***


***REMOVED***
***REMOVED*** The callback called when an XHR succeeds in downloading a remote file.
***REMOVED***
***REMOVED*** @param {!goog.net.FileDownloader.Download_} download The download object for
***REMOVED***     this download.
***REMOVED*** @private
***REMOVED***
goog.net.FileDownloader.prototype.xhrSuccess_ = function(download) {
  if (download.cancelled) {
    return;
  }

  var name = this.sanitize_(this.getName_(
     ***REMOVED*****REMOVED*** @type {!goog.net.XhrIo}***REMOVED*** (download.xhr)));
  var resp =***REMOVED*****REMOVED*** @type {ArrayBuffer}***REMOVED*** (download.xhr.getResponse());
  if (!resp) {
    // This should never happen - it indicates the XHR hasn't completed, has
    // failed or has been cleaned up.  If it does happen (eg. due to a bug
    // somewhere) we don't want to pass null to getBlob - it's not valid and
    // triggers a bug in some versions of WebKit causing it to crash.
    this.error_(download);
    return;
  }

  download.blob = goog.fs.getBlob(resp);
  delete download.xhr;

  this.getDir_(download.url, goog.fs.DirectoryEntry.Behavior.CREATE_EXCLUSIVE).
      addCallback(function(dir) {
        return dir.getFile(
            name, goog.fs.DirectoryEntry.Behavior.CREATE_EXCLUSIVE);
      }).
      addCallback(goog.bind(this.fileSuccess_, this, download)).
      addErrback(goog.bind(this.error_, this, download));
***REMOVED***


***REMOVED***
***REMOVED*** The callback called when a file that will be used for saving a file is
***REMOVED*** successfully opened.
***REMOVED***
***REMOVED*** @param {!goog.net.FileDownloader.Download_} download The download object for
***REMOVED***     this download.
***REMOVED*** @param {!goog.fs.FileEntry} file The newly-opened file object.
***REMOVED*** @private
***REMOVED***
goog.net.FileDownloader.prototype.fileSuccess_ = function(download, file) {
  if (download.cancelled) {
    file.remove();
    return;
  }

  download.file = file;
  file.createWriter().
      addCallback(goog.bind(this.fileWriterSuccess_, this, download)).
      addErrback(goog.bind(this.error_, this, download));
***REMOVED***


***REMOVED***
***REMOVED*** The callback called when a file writer is succesfully created for writing a
***REMOVED*** file to the filesystem.
***REMOVED***
***REMOVED*** @param {!goog.net.FileDownloader.Download_} download The download object for
***REMOVED***     this download.
***REMOVED*** @param {!goog.fs.FileWriter} writer The newly-created file writer object.
***REMOVED*** @private
***REMOVED***
goog.net.FileDownloader.prototype.fileWriterSuccess_ = function(
    download, writer) {
  if (download.cancelled) {
    download.file.remove();
    return;
  }

  download.writer = writer;
  writer.write(***REMOVED*** @type {!Blob}***REMOVED*** (download.blob));
  this.eventHandler_.listenOnce(
      writer,
      goog.fs.FileSaver.EventType.WRITE_END,
      goog.bind(this.writeEnd_, this, download));
***REMOVED***


***REMOVED***
***REMOVED*** The callback called when file writing ends, whether or not it's successful.
***REMOVED***
***REMOVED*** @param {!goog.net.FileDownloader.Download_} download The download object for
***REMOVED***     this download.
***REMOVED*** @private
***REMOVED***
goog.net.FileDownloader.prototype.writeEnd_ = function(download) {
  if (download.cancelled || download.writer.getError()) {
    this.error_(download, download.writer.getError());
    return;
  }

  delete this.downloads_[download.url];
  download.deferred.callback(download.blob);
***REMOVED***


***REMOVED***
***REMOVED*** The error callback for all asynchronous operations. Ensures that all stages
***REMOVED*** of a given download are cleaned up, and emits the error event.
***REMOVED***
***REMOVED*** @param {!goog.net.FileDownloader.Download_} download The download object for
***REMOVED***     this download.
***REMOVED*** @param {goog.fs.Error=} opt_err The file error object. Only defined if the
***REMOVED***     error was raised by the file API.
***REMOVED*** @private
***REMOVED***
goog.net.FileDownloader.prototype.error_ = function(download, opt_err) {
  if (download.file) {
    download.file.remove();
  }

  if (download.cancelled) {
    return;
  }

  delete this.downloads_[download.url];
  download.deferred.errback(
      new goog.net.FileDownloader.Error(download, opt_err));
***REMOVED***


***REMOVED***
***REMOVED*** Abort the download of the given URL.
***REMOVED***
***REMOVED*** @param {!goog.net.FileDownloader.Download_} download The download to abort.
***REMOVED*** @private
***REMOVED***
goog.net.FileDownloader.prototype.cancel_ = function(download) {
  goog.dispose(download);
  delete this.downloads_[download.url];
***REMOVED***


***REMOVED***
***REMOVED*** Get the directory for a given URL. If the directory already exists when this
***REMOVED*** is called, it will contain exactly one file: the downloaded file.
***REMOVED***
***REMOVED*** This not only calls the FileSystem API's getFile method, but attempts to
***REMOVED*** distribute the files so that they don't overload the filesystem. The spec
***REMOVED*** says directories can't contain more than 5000 files
***REMOVED*** (http://www.w3.org/TR/file-system-api/#directories), so this ensures that
***REMOVED*** each file is put into a subdirectory based on its SHA1 hash.
***REMOVED***
***REMOVED*** All parameters are the same as in the FileSystem API's Entry#getFile method.
***REMOVED***
***REMOVED*** @param {string} url The URL corresponding to the directory to get.
***REMOVED*** @param {goog.fs.DirectoryEntry.Behavior} behavior The behavior to pass to the
***REMOVED***     underlying method.
***REMOVED*** @return {!goog.async.Deferred} The deferred DirectoryEntry object.
***REMOVED*** @private
***REMOVED***
goog.net.FileDownloader.prototype.getDir_ = function(url, behavior) {
  // 3 hex digits provide 16**3 = 4096 different possible dirnames, which is
  // less than the maximum of 5000 entries. Downloaded files should be
  // distributed roughly evenly throughout the directories due to the hash
  // function, allowing many more than 5000 files to be downloaded.
  //
  // The leading ` ensures that no illegal dirnames are accidentally used. % was
  // previously used, but Chrome has a bug (as of 12.0.725.0 dev) where
  // filenames are URL-decoded before checking their validity, so filenames
  // containing e.g. '%3f' (the URL-encoding of :, an invalid character) are
  // rejected.
  var dirname = '`' + Math.abs(goog.crypt.hash32.encodeString(url)).
      toString(16).substring(0, 3);

  return this.dir_.
      getDirectory(dirname, goog.fs.DirectoryEntry.Behavior.CREATE).
      addCallback(function(dir) {
        return dir.getDirectory(this.sanitize_(url), behavior);
      }, this);
***REMOVED***


***REMOVED***
***REMOVED*** Get the file for a given URL. This will only retrieve files that have already
***REMOVED*** been saved; it shouldn't be used for creating the file in the first place.
***REMOVED*** This is because the filename isn't necessarily determined by the URL, but by
***REMOVED*** the headers of the XHR response.
***REMOVED***
***REMOVED*** @param {string} url The URL corresponding to the file to get.
***REMOVED*** @return {!goog.async.Deferred} The deferred FileEntry object.
***REMOVED*** @private
***REMOVED***
goog.net.FileDownloader.prototype.getFile_ = function(url) {
  return this.getDir_(url, goog.fs.DirectoryEntry.Behavior.DEFAULT).
      addCallback(function(dir) {
        return dir.listDirectory().addCallback(function(files) {
          goog.asserts.assert(files.length == 1);
          // If the filesystem somehow gets corrupted and we end up with an
          // empty directory here, it makes sense to just return the normal
          // file-not-found error.
          return files[0] || dir.getFile('file');
        });
      });
***REMOVED***


***REMOVED***
***REMOVED*** Sanitize a string so it can be safely used as a file or directory name for
***REMOVED*** the FileSystem API.
***REMOVED***
***REMOVED*** @param {string} str The string to sanitize.
***REMOVED*** @return {string} The sanitized string.
***REMOVED*** @private
***REMOVED***
goog.net.FileDownloader.prototype.sanitize_ = function(str) {
  // Add a prefix, since certain prefixes are disallowed for paths. None of the
  // disallowed prefixes start with '`'. We use ` rather than % for escaping the
  // filename due to a Chrome bug (as of 12.0.725.0 dev) where filenames are
  // URL-decoded before checking their validity, so filenames containing e.g.
  // '%3f' (the URL-encoding of :, an invalid character) are rejected.
  return '`' + str.replace(/[\/\\<>:?*"|%`]/g, encodeURIComponent).
      replace(/%/g, '`');
***REMOVED***


***REMOVED***
***REMOVED*** Gets the filename specified by the XHR. This first attempts to parse the
***REMOVED*** Content-Disposition header for a filename and, failing that, falls back on
***REMOVED*** deriving the filename from the URL.
***REMOVED***
***REMOVED*** @param {!goog.net.XhrIo} xhr The XHR containing the response headers.
***REMOVED*** @return {string} The filename.
***REMOVED*** @private
***REMOVED***
goog.net.FileDownloader.prototype.getName_ = function(xhr) {
  var disposition = xhr.getResponseHeader('Content-Disposition');
  var match = disposition &&
      disposition.match(/^attachment***REMOVED***;***REMOVED***filename="(.*)"$/i);
  if (match) {
    // The Content-Disposition header allows for arbitrary backslash-escaped
    // characters (usually " and \). We want to unescape them before using them
    // in the filename.
    return match[1].replace(/\\(.)/g, '$1');
  }

  return this.urlToName_(xhr.getLastUri());
***REMOVED***


***REMOVED***
***REMOVED*** Extracts the basename from a URL.
***REMOVED***
***REMOVED*** @param {string} url The URL.
***REMOVED*** @return {string} The basename.
***REMOVED*** @private
***REMOVED***
goog.net.FileDownloader.prototype.urlToName_ = function(url) {
  var segments = url.split('/');
  return segments[segments.length - 1];
***REMOVED***


***REMOVED***
***REMOVED*** Remove all event listeners for an XHR and release it back into the pool.
***REMOVED***
***REMOVED*** @param {!goog.net.XhrIo} xhr The XHR to free.
***REMOVED*** @private
***REMOVED***
goog.net.FileDownloader.prototype.freeXhr_ = function(xhr) {
  goog.events.removeAll(xhr);
  this.pool_.addFreeObject(xhr);
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.net.FileDownloader.prototype.disposeInternal = function() {
  delete this.dir_;
  goog.dispose(this.eventHandler_);
  delete this.eventHandler_;
  goog.object.forEach(this.downloads_, function(download) {
    download.deferred.cancel();
  }, this);
  delete this.downloads_;
  goog.dispose(this.pool_);
  delete this.pool_;

  goog.base(this, 'disposeInternal');
***REMOVED***



***REMOVED***
***REMOVED*** The error object for FileDownloader download errors.
***REMOVED***
***REMOVED*** @param {!goog.net.FileDownloader.Download_} download The download object for
***REMOVED***     the download in question.
***REMOVED*** @param {goog.fs.Error=} opt_fsErr The file error object, if this was a file
***REMOVED***     error.
***REMOVED***
***REMOVED***
***REMOVED*** @extends {goog.debug.Error}
***REMOVED***
goog.net.FileDownloader.Error = function(download, opt_fsErr) {
  goog.base(this, 'Error capturing URL ' + download.url);

 ***REMOVED*****REMOVED***
  ***REMOVED*** The URL the event relates to.
  ***REMOVED*** @type {string}
 ***REMOVED*****REMOVED***
  this.url = download.url;

  if (download.xhr) {
    this.xhrStatus = download.xhr.getStatus();
    this.xhrErrorCode = download.xhr.getLastErrorCode();
    this.message += ': XHR failed with status ' + this.xhrStatus +
        ' (error code ' + this.xhrErrorCode + ')';
  } else if (opt_fsErr) {
    this.fileError = opt_fsErr;
    this.message += ': file API failed (' + opt_fsErr.message + ')';
  }
***REMOVED***
goog.inherits(goog.net.FileDownloader.Error, goog.debug.Error);


***REMOVED***
***REMOVED*** The status of the XHR. Only set if the error was caused by an XHR failure.
***REMOVED*** @type {number|undefined}
***REMOVED***
goog.net.FileDownloader.Error.prototype.xhrStatus;


***REMOVED***
***REMOVED*** The error code of the XHR. Only set if the error was caused by an XHR
***REMOVED*** failure.
***REMOVED*** @type {goog.net.ErrorCode|undefined}
***REMOVED***
goog.net.FileDownloader.Error.prototype.xhrErrorCode;


***REMOVED***
***REMOVED*** The file API error. Only set if the error was caused by the file API.
***REMOVED*** @type {goog.fs.Error|undefined}
***REMOVED***
goog.net.FileDownloader.Error.prototype.fileError;



***REMOVED***
***REMOVED*** A struct containing the data for a single download.
***REMOVED***
***REMOVED*** @param {string} url The URL for the file being downloaded.
***REMOVED*** @param {!goog.net.FileDownloader} downloader The parent FileDownloader.
***REMOVED*** @extends {goog.Disposable}
***REMOVED***
***REMOVED*** @private
***REMOVED***
goog.net.FileDownloader.Download_ = function(url, downloader) {
  goog.base(this);

 ***REMOVED*****REMOVED***
  ***REMOVED*** The URL for the file being downloaded.
  ***REMOVED*** @type {string}
 ***REMOVED*****REMOVED***
  this.url = url;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The Deferred that will be fired when the download is complete.
  ***REMOVED*** @type {!goog.async.Deferred}
 ***REMOVED*****REMOVED***
  this.deferred = new goog.async.Deferred(
      goog.bind(downloader.cancel_, downloader, this));

 ***REMOVED*****REMOVED***
  ***REMOVED*** Whether this download has been cancelled by the user.
  ***REMOVED*** @type {boolean}
 ***REMOVED*****REMOVED***
  this.cancelled = false;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The XhrIo object for downloading the file. Only set once it's been
  ***REMOVED*** retrieved from the pool.
  ***REMOVED*** @type {goog.net.XhrIo}
 ***REMOVED*****REMOVED***
  this.xhr = null;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The name of the blob being downloaded. Only sey once the XHR has completed,
  ***REMOVED*** if it completed successfully.
  ***REMOVED*** @type {?string}
 ***REMOVED*****REMOVED***
  this.name = null;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The downloaded blob. Only set once the XHR has completed, if it completed
  ***REMOVED*** successfully.
  ***REMOVED*** @type {Blob}
 ***REMOVED*****REMOVED***
  this.blob = null;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The file entry where the blob is to be stored. Only set once it's been
  ***REMOVED*** loaded from the filesystem.
  ***REMOVED*** @type {goog.fs.FileEntry}
 ***REMOVED*****REMOVED***
  this.file = null;

 ***REMOVED*****REMOVED***
  ***REMOVED*** The file writer for writing the blob to the filesystem. Only set once it's
  ***REMOVED*** been loaded from the filesystem.
  ***REMOVED*** @type {goog.fs.FileWriter}
 ***REMOVED*****REMOVED***
  this.writer = null;
***REMOVED***
goog.inherits(goog.net.FileDownloader.Download_, goog.Disposable);


***REMOVED*** @override***REMOVED***
goog.net.FileDownloader.Download_.prototype.disposeInternal = function() {
  this.cancelled = true;
  if (this.xhr) {
    this.xhr.abort();
  } else if (this.writer && this.writer.getReadyState() ==
             goog.fs.FileSaver.ReadyState.WRITING) {
    this.writer.abort();
  }

  goog.base(this, 'disposeInternal');
***REMOVED***
