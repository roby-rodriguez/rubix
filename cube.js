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
            q.a.horizontal(this.d, this.a);
            q.b.horizontal(this.a, this.b);
            q.c.horizontal(this.b, this.c);
            q.d.horizontal(this.c, this.d);
            q.e = this.e;
            q.f = this.f;
            break;
        case '21':
            q.a.horizontal(this.b, this.a);
            q.b.horizontal(this.c, this.b);
            q.c.horizontal(this.d, this.c);
            q.d.horizontal(this.a, this.d);
            q.e = this.e;
            q.f = this.f;
            break;
        case '34':
            q.a.horizontal(this.a, this.d);
            q.b.horizontal(this.b, this.a);
            q.c.horizontal(this.c, this.b);
            q.d.horizontal(this.d, this.c);
            q.e = this.e;
            q.f = this.f;
            break;
        case '43':
            q.a.horizontal(this.a, this.b);
            q.b.horizontal(this.b, this.c);
            q.c.horizontal(this.c, this.d);
            q.d.horizontal(this.d, this.a);
            q.e = this.e;
            q.f = this.f;
            break;
        case '13':
            q.a.vertical(this.f, this.a);
            q.b = this.b;
            q.c.vertical(this.e, this.c);
            q.d = this.d;
            q.e.vertical(this.a, this.e);
            q.f.vertical(this.c, this.f);
            break;
        case '31':
            q.a.vertical(this.e, this.a);
            q.b = this.b;
            q.c.vertical(this.f, this.c);
            q.d = this.d;
            q.e.vertical(this.c, this.e);
            q.f.vertical(this.a, this.f);
            break;
        case '24':
            q.a.vertical(this.a, this.f);
            q.b = this.b;
            q.c.vertical(this.c, this.e);
            q.d = this.d;
            q.e.vertical(this.e, this.a);
            q.f.vertical(this.f, this.c);
            break;
        case '42':
            q.a.vertical(this.a, this.e);
            q.b = this.b;
            q.c.vertical(this.c, this.f);
            q.d = this.d;
            q.e.vertical(this.e, this.c);
            q.f.vertical(this.f, this.a);
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