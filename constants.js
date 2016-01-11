/**
 * Modifying one of these constants most likely requires modifying others too
 *
 * Created by johndoe on 29.12.2015.
 */
var Constants = {
    ENCODING_SIZE : 3,
    ENCODING_SIZE_LIMIT : 0x00000007,
    ENCODING_BASIC: 'abcdef',
    START_LETTER : 'a',
    NR_OF_CUBE_FACES : 6,

    WORDS : {
        2 : [ 0x00000FC0, 0x0000003F ],
        3 : [ 0x07FC0000, 0x0003FE00, 0x000001FF ]
    },
    WORD_LIMIT : {
        2 : 0x00000FFF,
        3 : 0x07FFFFFF
    },
    DIRECTIONS : {
        2 : [ '12', '21', '34', '43', '13', '31', '24', '42' ],
        3 : [ '12', '21', '34', '43', '13', '31', '24', '42', '57', '75', '68', '86' ]
    }
};

module.exports = Constants;