/**
 * Cube
 *
 * Created by johndoe on 29.12.2015.
 */
var Face = require('./face');
var Util = require('./util');

var Cube = function(size, stringRepresentation) {
    // todo refactor this with factory/template or something
    if (stringRepresentation) {
        var faces = stringRepresentation.split('|');
        Util.forEachLabel.call(this, function (label, index) {
            this[label] = Face.getByCode(faces[index], size);
        });
    } else {
        Util.forEachLabel.call(this, function (label, index) {
            this[label] = new Face(index, size);
        });
    }
};

Cube.prototype.shift = function (direction) {
    var q = new Cube(this.size());

    switch(direction) {
        case '12':
            q.a.horizontal(this.d, 0);
            q.b.horizontal(this.a, 0);
            q.c.horizontal(this.b, 0);
            q.d.horizontal(this.c, 0);
            q.e = this.e;
            q.f = this.f;
            break;
        case '21':
            q.a.horizontal(this.b, 0);
            q.b.horizontal(this.c, 0);
            q.c.horizontal(this.d, 0);
            q.d.horizontal(this.a, 0);
            q.e = this.e;
            q.f = this.f;
            break;
        case '34':
            q.a.horizontal(this.d, 1);
            q.b.horizontal(this.a, 1);
            q.c.horizontal(this.b, 1);
            q.d.horizontal(this.c, 1);
            q.e = this.e;
            q.f = this.f;
            break;
        case '43':
            q.a.horizontal(this.b, 1);
            q.b.horizontal(this.c, 1);
            q.c.horizontal(this.d, 1);
            q.d.horizontal(this.a, 1);
            q.e = this.e;
            q.f = this.f;
            break;
        case '68':
            q.a.horizontal(this.d, 2);
            q.b.horizontal(this.a, 2);
            q.c.horizontal(this.b, 2);
            q.d.horizontal(this.c, 2);
            q.e = this.e;
            q.f = this.f;
            break;
        case '86':
            q.a.horizontal(this.b, 2);
            q.b.horizontal(this.c, 2);
            q.c.horizontal(this.d, 2);
            q.d.horizontal(this.a, 2);
            q.e = this.e;
            q.f = this.f;
            break;
        case '13':
            q.a.vertical(this.f, 0);
            q.b = this.b;
            q.c.vertical(this.e, 0);
            q.d = this.d;
            q.e.vertical(this.a, 0);
            q.f.vertical(this.c, 0);
            break;
        case '31':
            q.a.vertical(this.e, 0);
            q.b = this.b;
            q.c.vertical(this.f, 0);
            q.d = this.d;
            q.e.vertical(this.c, 0);
            q.f.vertical(this.a, 0);
            break;
        case '24':
            q.a.vertical(this.f, 1);
            q.b = this.b;
            q.c.vertical(this.e, 1);
            q.d = this.d;
            q.e.vertical(this.a, 1);
            q.f.vertical(this.c, 1);
            break;
        case '42':
            q.a.vertical(this.e, 1);
            q.b = this.b;
            q.c.vertical(this.f, 1);
            q.d = this.d;
            q.e.vertical(this.c, 1);
            q.f.vertical(this.a, 1);
            break;
        case '57':
            q.a.vertical(this.f, 2);
            q.b = this.b;
            q.c.vertical(this.e, 2);
            q.d = this.d;
            q.e.vertical(this.a, 2);
            q.f.vertical(this.c, 2);
            break;
        case '75':
            q.a.vertical(this.e, 2);
            q.b = this.b;
            q.c.vertical(this.f, 2);
            q.d = this.d;
            q.e.vertical(this.c, 2);
            q.f.vertical(this.a, 2);
            break;
        default:
            break;
    }
    return q;
};

/**
 * Given an encoded permutation as a string (e.g. 'bcdaef') the original state (i.e. 'abcdef')
 * is permuted and returned
 *
 * @param permutationEncodedString permutation encoded as a string
 */
Cube.prototype.permutation = function (permutationEncodedString) {
    var permutedCube = new Cube(this.size()), label;
    for (var i = 0; i < permutationEncodedString.length; i++) {
        label = Util.decode(i);
        permutedCube[label] = this[permutationEncodedString.charAt(i)];
    }
    return permutedCube;
};

/**
 * Given the original labelling 'abcdef', the cube is given a new labelling
 * Ex.  original            -> edbb|bacc|fbdd|dcaa|ceee|afff
 *      repaint('badcfe')   ->
 *
 * @param newLabelling new labelling
 */
Cube.prototype.repaint = function (newLabelling) {
    var repaintedCube = new Cube(this.size);
    Util.forEachLabel.call(this, function (label) {
        repaintedCube[label] = Face.repaint(this[label], newLabelling);
    });
    return repaintedCube;
};

/**
 * Size of this cube (ex. 2, 3)
 */
Cube.prototype.size = function () {
    return this[Util.decode(0)].size;
};

/**
 * String representation of this cube. If a codification is given it will be used, having
 * the effect of repainting the cube.
 *
 * @param codification allows specifying an alternate codification
 * @returns {string}
 */
Cube.prototype.toString = function (codification) {
    var str = '';
    Util.forEachLabel.call(this, function (label, index) {
        str += index ? '|' + this[label].toString(codification) : this[label].toString(codification);
    });
    return str;
};

module.exports = Cube;