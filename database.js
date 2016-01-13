/**
 * Database operations
 *
 * Created by johndoe on 12.01.2016.
 */
var MongoClient = require('mongodb').MongoClient;
var Q = require('q');

var db;

function connect () {
    var deferred = Q.defer();
    if (!db) {
        MongoClient.connect("mongodb://localhost:27017/rubix", function (err, database) {
            if (err) deferred.reject(new Error(err));
            else deferred.resolve(database);
        });
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
    find: function (state, size) {
        return connect()
            .then(function (database) {
                return database.collection('cube' + size)
                    .find({ key : state.key })
                    .limit(1)
                    .next();
            });
    },
    remove: function (state, size) {
        return connect()
            .then(function (database) {
                database.collection('cube' + size)
                    .deleteOne({ key : state.key });
            });
    }
};

module.exports = Database;