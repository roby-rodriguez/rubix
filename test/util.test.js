/**
 * Tests utilities
 *
 * Created by johndoe on 05.01.2016.
 */
var Util = require('../util');
var Constants = require('../constants');
var Face = require('../face');

var expect = require("chai").expect;

function createFace(value, size) {
    var face = Object.create(Face.prototype);
    face.value = value;
    face.size  = size;
    return face;
}

describe("Test utilities", function () {
    it("decode - encode", function () {
        Constants.ENCODING_BASIC.split('').forEach(function (label, index) {
            expect(Util.decode(index)).to.equal(label);
            expect(Util.encode(label)).to.equal(index);
        });
    });
    it("encode - decode", function () {
        var startLetter = Constants.START_LETTER;
        expect(Util.decode(Util.encode(startLetter))).to.equal(startLetter);
    });
    it("reverse face 1", function () {
        // 001 000 010 010 = 530
        // 010 010 000 001 = 1153
        var face = createFace(530, 4);
        expect(Util.reverse(face)).to.equal(1153);
    });
    it("reverse face 2", function () {
        // 100 011 001 001 = 2249
        // 001 001 011 100 = 604
        var face = createFace(2249, 4);
        expect(Util.reverse(face)).to.equal(604);
    });
});