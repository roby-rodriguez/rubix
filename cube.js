/**
 * Check out these JS links:
 * http://stackoverflow.com/questions/1595611/how-to-properly-create-a-custom-object-in-javascript#1598077
 *
 * Puzzling problem to solve here:
 * - figure out inheritance such that Object.getOwnPropertyNames(Cube) returns properties a to f only
 *
 * Created by johndoe on 29.12.2015.
 */
var Face = require('./face');
var Constants = require('./constants');
var Util = require('./util');

//todo make use of size to allow solving 4x4, 9x9 cubes
var AbstractCube = function(size) {
    this.size = size;
};

var Cube = function(size, stringRepresentation) {
    AbstractCube.call(this, size);
    // todo refactor this with factory/template or something
    if (stringRepresentation) {
        var faces = stringRepresentation.split('|');
        for (var i = 0; i < Constants.NR_OF_CUBE_FACES; i++) {
            var label = Util.decode(i);
            this[label] = Face.getByCode(faces[i], size);
        }
    } else {
        for (var i = 0; i < Constants.NR_OF_CUBE_FACES; i++) {
            var label = Util.decode(i);
            this[label] = new Face(i, size);
        }
    }
};

function inherits(superType) {
    var tempConstructor = function () {};
    tempConstructor.prototype = superType.prototype;
    return new tempConstructor();
}
//Cube.prototype = Object.create(AbstractCube.prototype);
Cube.prototype = inherits(AbstractCube);
Cube.prototype.constructor = AbstractCube;

Cube.prototype.shift = function (direction) {
    // todo do we really need to keep size in cube??
    var q = new Cube(this.size);

    switch(direction) {
        case 01:
            q.a.horizontal(this.d, this.a);
            q.b.horizontal(this.a, this.b);
            q.c.horizontal(this.b, this.c);
            q.d.horizontal(this.c, this.d);
            q.e = this.e;
            q.f = this.f;
            break;
        case 10:
            q.a.horizontal(this.b, this.a);
            q.b.horizontal(this.c, this.b);
            q.c.horizontal(this.d, this.c);
            q.d.horizontal(this.a, this.d);
            q.e = this.e;
            q.f = this.f;
            break;
        case 23:
            q.a.horizontal(this.a, this.d);
            q.b.horizontal(this.b, this.a);
            q.c.horizontal(this.c, this.b);
            q.d.horizontal(this.d, this.c);
            q.e = this.e;
            q.f = this.f;
            break;
        case 32:
            q.a.horizontal(this.a, this.b);
            q.b.horizontal(this.b, this.c);
            q.c.horizontal(this.c, this.d);
            q.d.horizontal(this.d, this.a);
            q.e = this.e;
            q.f = this.f;
            break;
        case 02:
            q.a.vertical(this.f, this.a);
            q.b = this.b;
            q.c.vertical(this.e, this.c);
            q.d = this.d;
            q.e.vertical(this.a, this.e);
            q.f.vertical(this.c, this.f);
            break;
        case 20:
            q.a.vertical(this.e, this.a);
            q.b = this.b;
            q.c.vertical(this.f, this.c);
            q.d = this.d;
            q.e.vertical(this.c, this.e);
            q.f.vertical(this.a, this.f);
            break;
        case 13:
            q.a.vertical(this.a, this.f);
            q.b = this.b;
            q.c.vertical(this.c, this.e);
            q.d = this.d;
            q.e.vertical(this.e, this.a);
            q.f.vertical(this.f, this.c);
            break;
        case 31:
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
    var permutedCube = new Cube(this.size), label;
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
    //todo extract this to Util and apply a foreach on resulting array
    for (var i = 0; i < Constants.NR_OF_CUBE_FACES; i++) {
        var label = Util.decode(i);
        repaintedCube[label] = Face.repaint(this[label], newLabelling);
    }
    return repaintedCube;
};

// todo if you remove size/and-or abstract cube then comment the following two methods
Cube.prototype.hasOwnProperty = function(propertyName) {
    var a = Object.prototype.hasOwnProperty.call(this, propertyName);
    var b = Object.prototype.hasOwnProperty.call(new AbstractCube(), propertyName);
    return a && !b;
};

Cube.prototype.getOwnPropertyNames = function () {
    return Object.getOwnPropertyNames(this).filter(Cube.prototype.hasOwnProperty.bind(this));
};

/*
Cube.prototype.hash = function () {
    var weights = { a : 17, b : 2, c : 7, d : 13, e : 29, f : 41 };
    var sum = 0, partial, self = this;

    this.getOwnPropertyNames().forEach(function (val, idx, array) {
        partial = 0;
        for (var i = 0; i < self[val].length; i++)
            partial += weights[self[val][i]] - weights[self[val][0]];
        sum += weights[val] * partial;
    });

    return sum;
};
 */
/**
 * String representation of this cube. If a codification is given it will be used, having
 * the effect of repainting the cube.
 *
 * @param codification allows specifying an alternate codification
 * @returns {string}
 */
Cube.prototype.toString = function (codification) {
    var str = '', self = this;
    //todo this can be replaced by for with label decode -> see constructor
    this.getOwnPropertyNames().forEach(function (val, idx, array) {
        str += idx ? '|' + self[val].toString(codification) : self[val].toString(codification);
    });
    return str;
};

module.exports = Cube;