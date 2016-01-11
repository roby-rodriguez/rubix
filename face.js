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

/**
 * Creates a face (normal encoding) given the decoded string
 * ex. edbb -> 100 011 001 001
 *
 * @param decodedString
 * @param size
 * @returns {Face}
 */
Face.getByCode = function (decodedString, size) {
    var face = Object.create(Face.prototype), i;
    for (face.size = size, i = decodedString.length - 1; i >= 0; i--) {
        face.value |= Util.encode(decodedString.charAt(decodedString.length - 1 - i));
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
    var face = Object.create(Face.prototype), value, i;
    for (face.size = original.size, face.value = 0, i = original.size * original.size - 1; i >= 0; i--) {
        value = Util.strip(original.value >> i * Constants.ENCODING_SIZE);
        face.value |= Util.transcode(value, newLabelling);
        if (i)
            face.value <<= Constants.ENCODING_SIZE;
    }
    return face;
};

/**
 * Operation resulting from a horizontal twist of the cube
 * The value remains the same except for the displacement which takes its value from
 * the same region in 'replacement'
 *
 * @param replacement face used replace this row
 * @param index row to replace
 */
Face.prototype.horizontal = function (replacement, index) {
    this.value = (this.value & (Constants.WORD_LIMIT[this.size] ^ Constants.WORDS[this.size][index])) |
        (replacement.value & Constants.WORDS[this.size][index]);
};

/**
 * Operation resulting from a vertical twist of the cube
 *
 * @param replacement face used replace this column
 * @param index column to replace
 */
Face.prototype.vertical = function (replacement, index) {
    var mask = 0, antimask;
    for (var i = 0; i < this.size; i++)
        mask |= Constants.ENCODING_SIZE_LIMIT << i * this.size * Constants.ENCODING_SIZE + (this.size - index - 1) * Constants.ENCODING_SIZE;
    antimask = Constants.WORD_LIMIT[this.size] ^ mask;
    this.value = (this.value & antimask) | (replacement.value & mask);
};

/**
 * String representation of this face. If a codification is given it will be used, having
 * the effect of repainting this facet.
 *
 * @param codification allows specifying an alternate codification
 * @returns {string}
 */
Face.prototype.toString = function (codification) {
    var str = '', count = this.size * this.size, value;
    for (var i = count - 1; i >= 0; i--) {
        value = Util.strip(this.value >> i * Constants.ENCODING_SIZE);
        str += Util.decode(codification? Util.transcode(value, codification) : value);
    }
    return str;
};

module.exports = Face;