/**
 * Database operations
 *
 * Created by johndoe on 12.01.2016.
 */
var MongoClient = require('mongodb').MongoClient;
var Config = require('./config');
var Q = require('q');
var Promise = require('promise');

var db;

function connect () {
    var deferred = Q.defer();
    if (!db) {
        MongoClient.connect(Config.DATABASE_URL, deferred.makeNodeResolver());
    } else {
        deferred.resolve(db);
    }
    return deferred.promise;
}

var Database = {
    update: function (state) {
        return connect()
            .then(function (database) {
                database.collection('cube' + Config.CUBE_WIDTH)
                    .updateOne(
                    {
                        key : state.key
                    },
                    {
                        $set : {
                            step : state.step,
                            parent: state.parent
                        }
                    },
                    {
                        upsert: true
                    }
                );
            });
    },
    find: function (key) {
        return connect()
            .then(function (database) {
                return database.collection('cube' + Config.CUBE_WIDTH)
                    .find({ key : key })
                    .limit(1)
                    .next();
            });
    },
    findAll: function () {
        return connect()
            .then(function (database) {
                return database.collection('cube' + Config.CUBE_WIDTH)
                    .find();
            });
    },
    isEmpty: function () {
        return connect()
            .then(function (database) {
                return database.collection('cube' + Config.CUBE_WIDTH)
                    .find()
                    .count().then(function (count) {
                        return Promise.resolve(!count);
                    });
            });
    },
    remove: function (key) {
        return connect()
            .then(function (database) {
                database.collection('cube' + Config.CUBE_WIDTH)
                    .deleteOne({ key : key });
            });
    }
};

module.exports = Database;