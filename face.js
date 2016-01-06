/**
 * A face is given by a combination of the letters a-f (3 bit encoding):
 * - a = 000  c = 010  e = 100
 * - b = 001  d = 011  f = 101
 *
 * Given size = 4, such examples would be:
 * - aaaa = 000 000 000 000b = 0x000
 * - abab = 000 001 000 001b = 0x041
 * - fbde = 101 001 011 100b = 0xA5C
 *
 * Created by johndoe on 29.12.2015.
 */
var Constants = require('./constants');
var Util = require('./util');

var Face = function (seed, size) {
    this.size = size;
    seed = Util.strip(seed);
    var area = size * size;
    while (area) {
        this.value |= seed;
        if (--area)
            this.value <<= Constants.ENCODING_SIZE;
    }
};

Face.getByCode = function (decodedString, size) {
    var face = Object.create(Face.prototype);
    face.size = size;
    for (var i = decodedString.length - 1; i >= 0; i--) {
        face.value |= Util.encode(decodedString.charAt(i));
        if (i)
            face.value <<= Constants.ENCODING_SIZE;
    }
    return face;
};

/**
 * Repaint this original face (in normal encoding - 'abcdef') given an alternate
 * encoding and return the obtained face - used in cube construction, alternatively
 * use toString with param which is faster for most purposes
 *
 * @param original
 * @param newLabelling
 * @returns {Face}
 */
Face.repaint = function (original, newLabelling) {
    var face = Object.create(Face.prototype);
    face.size = original.size;
    var originalValue = Util.reverse(original), i;
    for (face.value = 0, i = original.size * original.size - 1; i >= 0; i--) {
        face.value |= Util.transcode(originalValue & Constants.ENCODING_SIZE_LIMIT, newLabelling);
        originalValue >>= Constants.ENCODING_SIZE;
        if (i)
            face.value <<= Constants.ENCODING_SIZE;
    }
    return face;
};

/**
 * Operation resulting from a horizontal twist of the cube. Equates to:
 * cube[this] = cube[up](0, 2) + cube[down](2, 4)
 *
 * @param up upper side
 * @param down lower side
 */
Face.prototype.horizontal = function (up, down) {
    this.value = (up.value & Constants.LOWER_WORD[this.size]) |
        (down.value & Constants.UPPER_WORD[this.size]);
    //this.value &= (Constants.UPPER_WORD[this.size] | Constants.LOWER_WORD[this.size]);
};

/**
 * Operation resulting from a vertical twist of the cube. Equates to:
 * cube[this] = cube[left](0) + cube[right](1) + cube[left](2) + cube[right](3)
 *
 * @param left left-hand side
 * @param right right-hand side
 */
Face.prototype.vertical = function (left, right) {
    this.value = (left.value & Constants.ENCODING_SIZE_LIMIT) | // left(0)
        (right.value & (Constants.ENCODING_SIZE_LIMIT << Constants.ENCODING_SIZE)) | // left(1)
        (left.value & (Constants.ENCODING_SIZE_LIMIT << (2 * Constants.ENCODING_SIZE))) | // left(2)
        (right.value & (Constants.ENCODING_SIZE_LIMIT << (3 * Constants.ENCODING_SIZE))); // left(3)
    //this.value &= (Constants.UPPER_WORD[this.size] | Constants.LOWER_WORD[this.size]);
};

/**
 * String representation of this face. If a codification is given it will be used, having
 * the effect of repainting this facet.
 *
 * @param codification allows specifying an alternate codification
 * @returns {string}
 */
Face.prototype.toString = function (codification) {
    var str = '', count = this.size * this.size, value = this.value;
    while (count--) {
        str += Util.decode(codification? Util.transcode(Util.strip(value), codification) : Util.strip(value));
        value >>= Constants.ENCODING_SIZE;
    }
    return str;
};

module.exports = Face;