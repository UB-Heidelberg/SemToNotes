// Copyright 2006 The Closure Library Authors. All Rights Reserved.
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
***REMOVED*** @fileoverview Definition of goog.gears.BaseStore which
***REMOVED*** is a base class for the various database stores. It provides
***REMOVED*** the basic structure for creating, updating and removing the store, as well
***REMOVED*** as versioning. It also provides ways to interconnect stores.
***REMOVED***
***REMOVED***

goog.provide('goog.gears.BaseStore');
goog.provide('goog.gears.BaseStore.SchemaType');

goog.require('goog.Disposable');



***REMOVED***
***REMOVED*** This class implements the common store functionality
***REMOVED***
***REMOVED*** @param {goog.gears.Database} database The data base to store the data in.
***REMOVED***
***REMOVED*** @extends {goog.Disposable}
***REMOVED***
goog.gears.BaseStore = function(database) {
  goog.Disposable.call(this);

 ***REMOVED*****REMOVED***
  ***REMOVED*** The underlying database that holds the message store.
  ***REMOVED*** @private
  ***REMOVED*** @type {goog.gears.Database}
 ***REMOVED*****REMOVED***
  this.database_ = database;
***REMOVED***
goog.inherits(goog.gears.BaseStore, goog.Disposable);


***REMOVED***
***REMOVED*** Schema definition types
***REMOVED*** @enum {number}
***REMOVED***
goog.gears.BaseStore.SchemaType = {
  TABLE: 1,
  VIRTUAL_TABLE: 2,
  INDEX: 3,
  BEFORE_INSERT_TRIGGER: 4,
  AFTER_INSERT_TRIGGER: 5,
  BEFORE_UPDATE_TRIGGER: 6,
  AFTER_UPDATE_TRIGGER: 7,
  BEFORE_DELETE_TRIGGER: 8,
  AFTER_DELETE_TRIGGER: 9
***REMOVED***


***REMOVED***
***REMOVED*** The name of the store. Subclasses should override and choose their own
***REMOVED*** name. That name is used for the maintaining the version string
***REMOVED*** @protected
***REMOVED*** @type {string}
***REMOVED***
goog.gears.BaseStore.prototype.name = 'Base';


***REMOVED***
***REMOVED*** The version number of the database schema. It is used to determine whether
***REMOVED*** the store's portion of the database needs to be updated. Subclassses should
***REMOVED*** override this value.
***REMOVED*** @protected
***REMOVED*** @type {number}
***REMOVED***
goog.gears.BaseStore.prototype.version = 1;


***REMOVED***
***REMOVED*** The database schema for the store. This is an array of objects, where each
***REMOVED*** object describes a database object (table, index, trigger). Documentation
***REMOVED*** about the object's fields can be found in the #createSchema documentation.
***REMOVED*** This is in the prototype so that it can be overriden by the subclass. This
***REMOVED*** field is read only.
***REMOVED*** @protected
***REMOVED*** @type {Array.<Object>}
***REMOVED***
goog.gears.BaseStore.prototype.schema = [];


***REMOVED***
***REMOVED*** Gets the underlying database.
***REMOVED*** @return {goog.gears.Database}
***REMOVED*** @protected
***REMOVED***
goog.gears.BaseStore.prototype.getDatabaseInternal = function() {
  return this.database_;
***REMOVED***


***REMOVED***
***REMOVED*** Updates the tables for the message store in the case where
***REMOVED*** they are out of date.
***REMOVED***
***REMOVED*** @protected
***REMOVED*** @param {number} persistedVersion the current version of the tables in the
***REMOVED*** database.
***REMOVED***
goog.gears.BaseStore.prototype.updateStore = function(persistedVersion) {
  // TODO(user): Need to figure out how to handle updates
  // where to store the version number and is it globale or per unit.
***REMOVED***


***REMOVED***
***REMOVED*** Preloads any applicable data into the tables.
***REMOVED***
***REMOVED*** @protected
***REMOVED***
goog.gears.BaseStore.prototype.loadData = function() {
***REMOVED***


***REMOVED***
***REMOVED*** Creates in memory cache of data that is stored in the tables.
***REMOVED***
***REMOVED*** @protected
***REMOVED***
goog.gears.BaseStore.prototype.getCachedData = function() {
***REMOVED***


***REMOVED***
***REMOVED*** Informs other stores that this store exists .
***REMOVED***
***REMOVED*** @protected
***REMOVED***
goog.gears.BaseStore.prototype.informOtherStores = function() {
***REMOVED***


***REMOVED***
***REMOVED*** Makes sure that tables needed for the store exist and are up to date.
***REMOVED***
goog.gears.BaseStore.prototype.ensureStoreExists = function() {
  var persistedVersion = this.getStoreVersion();

  if (persistedVersion) {
    if (persistedVersion != this.version) {
      // update
      this.database_.begin();
      try {
        this.updateStore(persistedVersion);
        this.setStoreVersion_(this.version);
        this.database_.commit();
      } catch (ex) {
        this.database_.rollback(ex);
        throw Error('Could not update the ' + this.name + ' schema ' +
            ' from version ' + persistedVersion + ' to ' + this.version +
            ': ' + (ex.message || 'unknown exception'));
      }
    }
  } else {
    // create
    this.database_.begin();
    try {
      // This is rarely necessary, but it's possible if we rolled back a
      // release and dropped the schema on version n-1 before installing
      // again on version n.
      this.dropSchema(this.schema);

      this.createSchema(this.schema);

      // Ensure that the version info schema exists.
      this.createSchema([{
        type: goog.gears.BaseStore.SchemaType.TABLE,
        name: 'StoreVersionInfo',
        columns: [
          'StoreName TEXT NOT NULL PRIMARY KEY',
          'Version INTEGER NOT NULL'
        ]}], true);
      this.loadData();
      this.setStoreVersion_(this.version);
      this.database_.commit();
    } catch (ex) {
      this.database_.rollback(ex);
      throw Error('Could not create the ' + this.name + ' schema' +
          ': ' + (ex.message || 'unknown exception'));
    }
  }
  this.getCachedData();
  this.informOtherStores();
***REMOVED***


***REMOVED***
***REMOVED*** Removes the tables for the MessageStore
***REMOVED***
goog.gears.BaseStore.prototype.removeStore = function() {
  this.database_.begin();
  try {
    this.removeStoreVersion();
    this.dropSchema(this.schema);
    this.database_.commit();
  } catch (ex) {
    this.database_.rollback(ex);
    throw Error('Could not remove the ' + this.name + ' schema' +
            ': ' + (ex.message || 'unknown exception'));
  }
***REMOVED***


***REMOVED***
***REMOVED*** Returns the name of the store.
***REMOVED***
***REMOVED*** @return {string} The name of the store.
***REMOVED***
goog.gears.BaseStore.prototype.getName = function() {
  return this.name;
***REMOVED***


***REMOVED***
***REMOVED*** Returns the version number for the specified store
***REMOVED***
***REMOVED*** @return {number} The version number of the store. Returns 0 if the
***REMOVED***     store does not exist.
***REMOVED***
goog.gears.BaseStore.prototype.getStoreVersion = function() {
  try {
    return***REMOVED*****REMOVED*** @type {number}***REMOVED*** (this.database_.queryValue(
        'SELECT Version FROM StoreVersionInfo WHERE StoreName=?',
        this.name)) || 0;
  } catch (ex) {
    return 0;
  }
***REMOVED***


***REMOVED***
***REMOVED*** Sets the version number for the specified store
***REMOVED***
***REMOVED*** @param {number} version The version number for the store.
***REMOVED*** @private
***REMOVED***
goog.gears.BaseStore.prototype.setStoreVersion_ = function(version) {
  // TODO(user): Need to determine if we should enforce the fact
  // that store versions are monotonically increasing.
  this.database_.execute(
      'INSERT OR REPLACE INTO StoreVersionInfo ' +
      '(StoreName, Version) VALUES(?,?)',
      this.name,
      version);
***REMOVED***


***REMOVED***
***REMOVED*** Removes the version number for the specified store
***REMOVED***
goog.gears.BaseStore.prototype.removeStoreVersion = function() {
  try {
    this.database_.execute(
        'DELETE FROM StoreVersionInfo WHERE StoreName=?',
        this.name);
  } catch (ex) {
    // Ignore error - part of bootstrap process.
  }
***REMOVED***


***REMOVED***
***REMOVED*** Generates an SQLITE CREATE TRIGGER statement from a definition array.
***REMOVED*** @param {string} onStr the type of trigger to create.
***REMOVED*** @param {Object} def  a schema statement definition.
***REMOVED*** @param {string} notExistsStr string to be included in the create
***REMOVED***     indicating what to do.
***REMOVED*** @return {string} the statement.
***REMOVED*** @private
***REMOVED***
goog.gears.BaseStore.prototype.getCreateTriggerStatement_ =
    function(onStr, def, notExistsStr) {
  return 'CREATE TRIGGER ' + notExistsStr + def.name + ' ' +
         onStr + ' ON ' + def.tableName +
         (def.when ? (' WHEN ' + def.when) : '') +
         ' BEGIN ' + def.actions.join('; ') + '; END';
***REMOVED***


***REMOVED***
***REMOVED*** Generates an SQLITE CREATE statement from a definition object.
***REMOVED*** @param {Object} def  a schema statement definition.
***REMOVED*** @param {boolean=} opt_ifNotExists true if the table or index should be
***REMOVED***     created only if it does not exist. Otherwise trying to create a table
***REMOVED***     or index that already exists will result in an exception being thrown.
***REMOVED*** @return {string} the statement.
***REMOVED*** @private
***REMOVED***
goog.gears.BaseStore.prototype.getCreateStatement_ =
    function(def, opt_ifNotExists) {
  var notExists = opt_ifNotExists ? 'IF NOT EXISTS ' : '';
  switch (def.type) {
    case goog.gears.BaseStore.SchemaType.TABLE:
      return 'CREATE TABLE ' + notExists + def.name + ' (\n' +
             def.columns.join(',\n  ') +
             ')';
    case goog.gears.BaseStore.SchemaType.VIRTUAL_TABLE:
      return 'CREATE VIRTUAL TABLE ' + notExists + def.name +
             ' USING FTS2 (\n' + def.columns.join(',\n  ') + ')';
    case goog.gears.BaseStore.SchemaType.INDEX:
      return 'CREATE' + (def.isUnique ? ' UNIQUE' : '') +
             ' INDEX ' + notExists + def.name + ' ON ' +
             def.tableName + ' (\n' + def.columns.join(',\n  ') + ')';
    case goog.gears.BaseStore.SchemaType.BEFORE_INSERT_TRIGGER:
      return this.getCreateTriggerStatement_('BEFORE INSERT', def, notExists);
    case goog.gears.BaseStore.SchemaType.AFTER_INSERT_TRIGGER:
      return this.getCreateTriggerStatement_('AFTER INSERT', def, notExists);
    case goog.gears.BaseStore.SchemaType.BEFORE_UPDATE_TRIGGER:
      return this.getCreateTriggerStatement_('BEFORE UPDATE', def, notExists);
    case goog.gears.BaseStore.SchemaType.AFTER_UPDATE_TRIGGER:
      return this.getCreateTriggerStatement_('AFTER UPDATE', def, notExists);
    case goog.gears.BaseStore.SchemaType.BEFORE_DELETE_TRIGGER:
      return this.getCreateTriggerStatement_('BEFORE DELETE', def, notExists);
    case goog.gears.BaseStore.SchemaType.AFTER_DELETE_TRIGGER:
      return this.getCreateTriggerStatement_('AFTER DELETE', def, notExists);
  }
  return '';
***REMOVED***


***REMOVED***
***REMOVED*** Generates an SQLITE DROP statement from a definition array.
***REMOVED*** @param {Object} def  a schema statement definition.
***REMOVED*** @return {string} the statement.
***REMOVED*** @private
***REMOVED***
goog.gears.BaseStore.prototype.getDropStatement_ = function(def) {
  switch (def.type) {
    case goog.gears.BaseStore.SchemaType.TABLE:
    case goog.gears.BaseStore.SchemaType.VIRTUAL_TABLE:
      return 'DROP TABLE IF EXISTS ' + def.name;
    case goog.gears.BaseStore.SchemaType.INDEX:
      return 'DROP INDEX IF EXISTS ' + def.name;
    case goog.gears.BaseStore.SchemaType.BEFORE_INSERT_TRIGGER:
    case goog.gears.BaseStore.SchemaType.AFTER_INSERT_TRIGGER:
    case goog.gears.BaseStore.SchemaType.BEFORE_UPDATE_TRIGGER:
    case goog.gears.BaseStore.SchemaType.AFTER_UPDATE_TRIGGER:
    case goog.gears.BaseStore.SchemaType.BEFORE_DELETE_TRIGGER:
    case goog.gears.BaseStore.SchemaType.AFTER_DELETE_TRIGGER:
      return 'DROP TRIGGER IF EXISTS ' + def.name;
  }
  return '';
***REMOVED***


***REMOVED***
***REMOVED*** Creates tables and indicies in the target database.
***REMOVED***
***REMOVED*** @param {Array} defs  definition arrays. This is an array of objects
***REMOVED***    where each object describes a database object to create and drop.
***REMOVED***    each object contains a 'type' field which of type
***REMOVED***    goog.gears.BaseStore.SchemaType. Each object also contains a
***REMOVED***    'name' which contains the name of the object to create.
***REMOVED***    A table object contains a 'columns' field which is an array
***REMOVED***       that contains the column definitions for the table.
***REMOVED***    A virtual table object contains c 'columns' field which contains
***REMOVED***       the name of the columns. They are assumed to be of type text.
***REMOVED***    An index object contains a 'tableName' field which is the name
***REMOVED***       of the table that the index is on. It contains an 'isUnique'
***REMOVED***       field which is a boolean indicating whether the index is
***REMOVED***       unqiue or not. It also contains a 'columns' field which is
***REMOVED***       an array that contains the columns names (possibly along with the
***REMOVED***       ordering) that form the index.
***REMOVED***    The trigger objects contain a 'tableName' field indicating the
***REMOVED***       table the trigger is on. The type indicates the type of trigger.
***REMOVED***       The trigger object may include a 'when' field which contains
***REMOVED***       the when clause for the trigger. The trigger object also contains
***REMOVED***       an 'actions' field which is an array of strings containing
***REMOVED***       the actions for this trigger.
***REMOVED*** @param {boolean=} opt_ifNotExists true if the table or index should be
***REMOVED***     created only if it does not exist. Otherwise trying to create a table
***REMOVED***     or index that already exists will result in an exception being thrown.
***REMOVED***
goog.gears.BaseStore.prototype.createSchema = function(defs, opt_ifNotExists) {
  this.database_.begin();
  try {
    for (var i = 0; i < defs.length; ++i) {
      var sql = this.getCreateStatement_(defs[i], opt_ifNotExists);
      this.database_.execute(sql);
    }
    this.database_.commit();
  } catch (ex) {
    this.database_.rollback(ex);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Drops tables and indicies in a target database.
***REMOVED***
***REMOVED*** @param {Array} defs Definition arrays.
***REMOVED***
goog.gears.BaseStore.prototype.dropSchema = function(defs) {
  this.database_.begin();
  try {
    for (var i = defs.length - 1; i >= 0; --i) {
      this.database_.execute(this.getDropStatement_(defs[i]));
    }
    this.database_.commit();
  } catch (ex) {
    this.database_.rollback(ex);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Creates triggers specified in definitions. Will first attempt
***REMOVED*** to drop the trigger with this name first.
***REMOVED***
***REMOVED*** @param {Array} defs Definition arrays.
***REMOVED***
goog.gears.BaseStore.prototype.createTriggers = function(defs) {
  this.database_.begin();
  try {
    for (var i = 0; i < defs.length; i++) {
      var def = defs[i];
      switch (def.type) {
        case goog.gears.BaseStore.SchemaType.BEFORE_INSERT_TRIGGER:
        case goog.gears.BaseStore.SchemaType.AFTER_INSERT_TRIGGER:
        case goog.gears.BaseStore.SchemaType.BEFORE_UPDATE_TRIGGER:
        case goog.gears.BaseStore.SchemaType.AFTER_UPDATE_TRIGGER:
        case goog.gears.BaseStore.SchemaType.BEFORE_DELETE_TRIGGER:
        case goog.gears.BaseStore.SchemaType.AFTER_DELETE_TRIGGER:
          this.database_.execute('DROP TRIGGER IF EXISTS ' + def.name);
          this.database_.execute(this.getCreateStatement_(def));
          break;
      }
    }
    this.database_.commit();
  } catch (ex) {
    this.database_.rollback(ex);
  }
***REMOVED***


***REMOVED***
***REMOVED*** Returns true if the table exists in the database
***REMOVED***
***REMOVED*** @param {string} name The table name.
***REMOVED*** @return {boolean} Whether the table exists in the database.
***REMOVED***
goog.gears.BaseStore.prototype.hasTable = function(name) {
  return this.hasInSchema_('table', name);
***REMOVED***


***REMOVED***
***REMOVED*** Returns true if the index exists in the database
***REMOVED***
***REMOVED*** @param {string} name The index name.
***REMOVED*** @return {boolean} Whether the index exists in the database.
***REMOVED***
goog.gears.BaseStore.prototype.hasIndex = function(name) {
  return this.hasInSchema_('index', name);
***REMOVED***


***REMOVED***
***REMOVED*** @param {string} name The name of the trigger.
***REMOVED*** @return {boolean} Whether the schema contains a trigger with the given name.
***REMOVED***
goog.gears.BaseStore.prototype.hasTrigger = function(name) {
  return this.hasInSchema_('trigger', name);
***REMOVED***


***REMOVED***
***REMOVED*** Returns true if the database contains the index or table
***REMOVED***
***REMOVED*** @private
***REMOVED*** @param {string} type The type of object to test for, 'table' or 'index'.
***REMOVED*** @param {string} name The table or index name.
***REMOVED*** @return {boolean} Whether the database contains the index or table.
***REMOVED***
goog.gears.BaseStore.prototype.hasInSchema_ = function(type, name) {
  return this.database_.queryValue('SELECT 1 FROM SQLITE_MASTER ' +
      'WHERE TYPE=? AND NAME=?',
      type,
      name) != null;
***REMOVED***


***REMOVED*** @override***REMOVED***
goog.gears.BaseStore.prototype.disposeInternal = function() {
  goog.gears.BaseStore.superClass_.disposeInternal.call(this);
  this.database_ = null;
***REMOVED***


***REMOVED***
***REMOVED*** HACK(arv): The JSCompiler check for undefined properties sees that these
***REMOVED*** fields are never set and raises warnings.
***REMOVED*** @type {Array.<Object>}
***REMOVED*** @private
***REMOVED***
goog.gears.schemaDefDummy_ = [
  {
    type: '',
    name: '',
    when: '',
    tableName: '',
    actions: [],
    isUnique: false
  }
];
