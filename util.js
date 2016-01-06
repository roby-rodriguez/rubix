/**
 * Created by johndoe on 29.12.2015.
 */
var Constants = require('./constants');

var Util = {
    /**
     * Returns the least significant part of this number (@see Constants encoding size/limit)
     *
     * @param number
     * @returns {number}
     */
    strip : function(number) {
        return number & Constants.ENCODING_SIZE_LIMIT;
    },
    /**
     * Returns the bit-wise reversed value of this face
     *
     * @param face
     * @returns {number}
     */
    reverse: function(face) {
        var value, original = face.value, area = face.size * face.size;
        for (var i = area - 1; i >= 0; i--) {
            value |= (original & Constants.ENCODING_SIZE_LIMIT);
            if (i) { value <<= Constants.ENCODING_SIZE; original >>= Constants.ENCODING_SIZE; }
        }
        return value;
    },
    /**
     * Given a starting letter (@see Constants) it returns its normal (ie. 'abcdef') code
     *
     * @param letter
     * @returns {number}
     */
    encode: function (letter) {
        return (letter.charCodeAt(0) - Constants.START_LETTER.charCodeAt(0)) & Constants.ENCODING_SIZE_LIMIT;
    },
    /**
     * Given the code code it returns the corresponding normal (ie. 'abcdef') letter
     *
     * @param number
     * @returns {string}
     */
    decode : function(number) {
        return String.fromCharCode(Constants.START_LETTER.charCodeAt(0) + number);
    },
    /**
     * Given an alternate codification (newLabelling)
     *
     * @param number
     * @param newLabelling
     * @returns {number}
     */
    transcode: function(number, newLabelling) {
        return Util.encode(newLabelling[number]);
    }
};

module.exports = Util;