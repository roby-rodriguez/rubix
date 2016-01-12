/**
 * Tests cube
 *
 * Created by johndoe on 03.01.2016.
 */
var Cube = require('../cube');

var expect = require("chai").expect;

describe("Test cube", function () {
    it("constructor with encoding 2 x 2", function () {
        var decoded = 'edbb|bacc|fbdd|dcaa|ceee|afff';
        var cube = new Cube(decoded);
        expect(cube.toString()).to.equal(decoded);
    });
    it("repainting == toString(encoding) 2 x 2", function () {
        var newLabelling = 'badcfe';
        var decoded = 'edbb|bacc|fbdd|dcaa|ceee|afff';
        var cube = new Cube(decoded);
        var repainted = cube.repaint(newLabelling);
        expect(repainted.toString()).to.equal(cube.toString(newLabelling));
    });
    it("twist horizontally 2 x 2", function () {
        var cube, shifted, shiftedBack;
        cube = new Cube(4); // 'aaaa|bbbb|cccc|dddd|eeee|ffff'

        shifted = cube.shift('12');
        expect(shifted.toString()).to.equal('ddaa|aabb|bbcc|ccdd|eeee|ffff');
        shiftedBack = shifted.shift('21');
        expect(shiftedBack.toString()).to.equal(cube.toString());

        shifted = cube.shift('34');
        expect(shifted.toString()).to.equal('aadd|bbaa|ccbb|ddcc|eeee|ffff');
        shiftedBack = shifted.shift('43');
        expect(shiftedBack.toString()).to.equal(cube.toString());
    });
    it("twist vertically 2 x 2", function () {
        var cube, shifted, shiftedBack;
        cube = new Cube(4); // 'aaaa|bbbb|cccc|dddd|eeee|ffff'

        shifted = cube.shift('13');
        expect(shifted.toString()).to.equal('fafa|bbbb|ecec|dddd|aeae|cfcf');
        shiftedBack = shifted.shift('31');
        expect(shiftedBack.toString()).to.equal(cube.toString());

        shifted = cube.shift('24');
        expect(shifted.toString()).to.equal('afaf|bbbb|cece|dddd|eaea|fcfc');
        shiftedBack = shifted.shift('42');
        expect(shiftedBack.toString()).to.equal(cube.toString());
    });
    it("twist horizontally 3 x 3", function () {
        var cube, shifted, shiftedBack;
        cube = new Cube(9); // 'aaaaaaaaa|bbbbbbbbb|ccccccccc|ddddddddd|eeeeeeeee|fffffffff'

        shifted = cube.shift('12');
        expect(shifted.toString()).to.equal('dddaaaaaa|aaabbbbbb|bbbcccccc|cccdddddd|eeeeeeeee|fffffffff');
        shiftedBack = shifted.shift('21');
        expect(shiftedBack.toString()).to.equal(cube.toString());

        shifted = cube.shift('34');
        expect(shifted.toString()).to.equal('aaadddaaa|bbbaaabbb|cccbbbccc|dddcccddd|eeeeeeeee|fffffffff');
        shiftedBack = shifted.shift('43');
        expect(shiftedBack.toString()).to.equal(cube.toString());

        shifted = cube.shift('68');
        expect(shifted.toString()).to.equal('aaaaaaddd|bbbbbbaaa|ccccccbbb|ddddddccc|eeeeeeeee|fffffffff');
        shiftedBack = shifted.shift('86');
        expect(shiftedBack.toString()).to.equal(cube.toString());
    });
    it("twist vertically 3 x 3", function () {
        var cube, shifted, shiftedBack;
        cube = new Cube(9); // 'aaaaaaaaa|bbbbbbbbb|ccccccccc|ddddddddd|eeeeeeeee|fffffffff'

        shifted = cube.shift('13');
        expect(shifted.toString()).to.equal('faafaafaa|bbbbbbbbb|ecceccecc|ddddddddd|aeeaeeaee|cffcffcff');
        shiftedBack = shifted.shift('31');
        expect(shiftedBack.toString()).to.equal(cube.toString());

        shifted = cube.shift('24');
        expect(shifted.toString()).to.equal('afaafaafa|bbbbbbbbb|cecceccec|ddddddddd|eaeeaeeae|fcffcffcf');
        shiftedBack = shifted.shift('42');
        expect(shiftedBack.toString()).to.equal(cube.toString());

        shifted = cube.shift('57');
        expect(shifted.toString()).to.equal('aafaafaaf|bbbbbbbbb|cceccecce|ddddddddd|eeaeeaeea|ffcffcffc');
        shiftedBack = shifted.shift('75');
        expect(shiftedBack.toString()).to.equal(cube.toString());
    });
});