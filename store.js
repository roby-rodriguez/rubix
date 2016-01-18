/**
 * App data storage
 *
 * Created by johndoe on 14.01.2016.
 */
var Util = require('./util');
var Database = require('./database');
var Promise = require('promise');
var currentStore;

function AbstractStore() {
}

function MemoryStore() {
    AbstractStore.call(this);
}

MemoryStore.prototype = Object.create(AbstractStore.prototype);
MemoryStore.prototype.constructor = MemoryStore;
// add states object directly to proto
MemoryStore.prototype.states = {};

MemoryStore.prototype.get = function (key) {
    //todo should we also place check method here ? maybe?
    var result;
    if (this.states[key])
        result = {
            key: key,
            step: this.states[key].step,
            parent: this.states[key].parent
        };
    return Promise.resolve(result);
};

MemoryStore.prototype.set = function (state) {
    if (!this.states[state.key])
        this.states[state.key] = {};
    this.states[state.key].step = state.step;
    this.states[state.key].parent = state.parent;
    return Promise.resolve();
};

MemoryStore.prototype.delete = function (key) {
    delete this.states[key];
    return Promise.resolve();
};

MemoryStore.prototype.getAll = function () {
    return Promise.resolve(this.states);
};

MemoryStore.prototype.isEmpty = function () {
    return Promise.resolve(Util.empty(this.states));
};

function DatabaseStore() {
    AbstractStore.call(this);
}

DatabaseStore.prototype = Object.create(AbstractStore.prototype);
DatabaseStore.prototype.constructor = DatabaseStore;

DatabaseStore.prototype.get = function (key) {
    return Database.find(key);
};

DatabaseStore.prototype.set = function (state) {
    return Database.update(state);
};

DatabaseStore.prototype.delete = function (key) {
    return Database.remove(key)
};

DatabaseStore.prototype.getAll = function () {
    return Database.findAll();
};

DatabaseStore.prototype.isEmpty = function () {
    return Database.isEmpty();
};

function init(useDatabase) {
    currentStore = useDatabase? new DatabaseStore() : new MemoryStore();
}

module.exports = {
    getAllStates: function () {
        return currentStore.getAll();
    },
    getState: function (key) {
        return currentStore.get(key);
    },
    setState: function (state) {
        currentStore.set(state);
    },
    deleteState: function (key) {
        currentStore.delete(key);
    },
    isEmpty: function () {
        return currentStore.isEmpty();
    },
    useDatabase: init
};