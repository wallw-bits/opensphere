/**
 * @fileoverview Abstract interface for asynchonously storing and retrieving data using some persistence mechanism.
 */

goog.provide('os.storage.AsyncStorage');
goog.require('goog.Disposable');
goog.require('os.storage.IAsyncStorage');



/**
 * Basic interface for all asynchronous storage mechanisms.
 * @implements {os.storage.IAsyncStorage}
 * @extends {goog.Disposable}
 * @constructor
 * @template T
 */
os.storage.AsyncStorage = function() {
  os.storage.AsyncStorage.base(this, 'constructor');
};
goog.inherits(os.storage.AsyncStorage, goog.Disposable);


/**
 * @inheritDoc
 * @see {os.storage.IAsyncStorage}
 */
os.storage.AsyncStorage.prototype.init = goog.abstractMethod;


/**
 * @inheritDoc
 * @see {os.storage.IAsyncStorage}
 */
os.storage.AsyncStorage.prototype.get = goog.abstractMethod;


/**
 * Get all values from storage.
 *
 * @return {!goog.async.Deferred<!Array<T>>} A deferred that resolves with all values in storage.
 *
 * @template T
 */
os.storage.AsyncStorage.prototype.getAll = goog.abstractMethod;


/**
 * Set a value for a key.
 *
 * @param {string} key The key to set.
 * @param {T} value The string to save.
 * @param {boolean=} opt_replace If an existing item should be replaced
 * @return {!goog.async.Deferred} A deferred that resolves when the value has been stored.
 *
 * @template T
 */
os.storage.AsyncStorage.prototype.set = goog.abstractMethod;


/**
 * @inheritDoc
 * @see {os.storage.IAsyncStorage}
 */
os.storage.AsyncStorage.prototype.remove = goog.abstractMethod;


/**
 * @inheritDoc
 * @see {os.storage.IAsyncStorage}
 */
os.storage.AsyncStorage.prototype.clear = goog.abstractMethod;
