/**
 * Tests database (state) operations
 *
 * Created by johndoe on 12.01.2016.
 */
var Database = require('../database');

var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
var should = chai.should();

var size = 4;
var state = {
    key: 'edbb|bacc|fbdd|dcaa|ceee|afff (test)',
    step: 3,
    parent: '21'
};

describe("Test database operations", function () {
    it("add", function () {
        return Database.find(state, size).should.eventually.equal(null)
            .then(function () {
                return Database.add(state, size);
            })
            .then(function () {
                return Database.find(state, size);
            }).should.eventually.have.property('key').that.equals(state.key);
    });
    it("update", function () {
        var newState = {};
        newState.key = state.key;
        newState.step = 2;
        newState.parent = '12';

        return Database.find(state, size)
            .then(function () {
                return Database.update(newState, size);
            })
            .then(function () {
                return Database.find(state, size);
            })
            .then(function (doc) {
                chai.expect(doc).to.not.equal(null);
                chai.expect(doc).to.have.property('step').that.equals(2);
                chai.expect(doc).to.have.property('parent').that.equals('12');
            });
    });
    it("remove", function () {
        return Database.find(state, size).should.eventually.not.equal(null)
            .then(function () {
                return Database.remove(state, size);
            })
            .then(function () {
                return Database.find(state, size);
            }).should.eventually.equal(null);
    });
});