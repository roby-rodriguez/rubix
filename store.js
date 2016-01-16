/**
 * App data storage
 *
 * Created by johndoe on 14.01.2016.
 */
var Util = require('./util');
var Database = require('./database');
var Config = require('./config');
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
    if (this.states[key])
        return {
            key: key,
            step: this.states[key].step,
            parent: this.states[key].parent
        };
};

MemoryStore.prototype.set = function (state) {
    if (!this.states[state.key])
        this.states[state.key] = {};
    this.states[state.key].step = state.step;
    this.states[state.key].parent = state.parent;
};

MemoryStore.prototype.delete = function (key) {
    delete this.states[key];
};

MemoryStore.prototype.getAll = function () {
    return this.states;
};

MemoryStore.prototype.isEmpty = function () {
    return Util.empty(this.states);
};

function DatabaseStore() {
    AbstractStore.call(this);
}

function init(useDatabase) {
    Config.USE_DATABASE = useDatabase;
    currentStore = useDatabase? new DatabaseStore() : new MemoryStore();
}
init(Config.USE_DATABASE);

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
    toggle: init
};