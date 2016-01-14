/**
 * Database operations
 *
 * Created by johndoe on 12.01.2016.
 */
var MongoClient = require('mongodb').MongoClient;
var DatabaseUrl = require('./config').DATABASE_URL;
var Q = require('q');

var db;

function connect () {
    var deferred = Q.defer();
    if (!db) {
        MongoClient.connect(DatabaseUrl, deferred.makeNodeResolver());
    } else {
        deferred.resolve(db);
    }
    return deferred.promise;
}

var Database = {
    add: function (state, size) {
        return connect()
            .then(function (database) {
                database.collection('cube' + size)
                    .insertOne(state);
            });
    },
    update: function (state, size) {
        return connect()
            .then(function (database) {
                database.collection('cube' + size)
                    .updateOne(
                    {
                        key : state.key
                    },
                    {
                        $set : {
                            step : state.step,
                            parent: state.parent
                        }
                    }
                );
            });
    },
    find: function (key, size) {
        return connect()
            .then(function (database) {
                return database.collection('cube' + size)
                    .find({ key : key })
                    .limit(1)
                    .next();
            });
    },
    remove: function (key, size) {
        return connect()
            .then(function (database) {
                database.collection('cube' + size)
                    .deleteOne({ key : key });
            });
    }
};

module.exports = Database;