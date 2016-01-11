/**
 * Tests generation of label permutations
 *
 * Created by johndoe on 05.01.2016.
 */
var base = require('../constants').ENCODING_BASIC;
var Permutations = require('../generator');

var expect = require("chai").expect;

describe("Test label permutations generation", function () {
    it("distinct letters", function () {
        Permutations.forEach(function (label) {
            for (var i = 0; i < label.length; i++) {
                for (var j = i + 1; j < label.length; j++)
                    expect(label.charAt(i)).to.not.equal(label.charAt(j));
            }
        });
    });
    it("distinct index", function () {
        Permutations.forEach(function (label) {
            for (var i = 0; i < base.length; i++)
                expect(label.charAt(i)).to.not.equal(base.charAt(i));
        });
    });
});