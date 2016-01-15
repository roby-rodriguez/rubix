/**
 * App data storage
 *
 * Created by johndoe on 14.01.2016.
 */
var Database = require('./database');
var useDatabase = require('./config').USE_DATABASE;
var currentStore;
//var states = {};

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
    this.states[key].step = state.step;
    this.states[key].parent = state.parent;
};

function DatabaseStore() {
    AbstractStore.call(this);
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
    }
};