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

MemoryStore.prototype.set = function (key, step, parentDir) {
    if (!this.states[key])
        this.states[key] = {};
    this.states[key].step = step;
    this.states[key].parent = parentDir;
};

function DatabaseStore() {
    AbstractStore.call(this);
}

module.exports = {
    getState: function (key) {
        currentStore.get(key);
    },
    setState: function (key, step, parentDir) {
        currentStore.set(key, step, parentDir);
    }
};