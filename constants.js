/**
 * Modifying one of these constants most likely requires modifying others too
 * todo could use some refactoring
 *
 * Created by johndoe on 29.12.2015.
 */
var Constants = {
    ENCODING_SIZE : 3,
    ENCODING_SIZE_LIMIT : 0x00000007,
    ENCODING_BASIC: 'abcdef',
    START_LETTER : 'a',
    NR_OF_CUBE_FACES : 6,

    WIDTH : {
        4 : 2, // sqrt
        9 : 3
    },
    WORDS : {
        4 : [ 0x00000FC0, 0x0000003F ],
        9 : [ 0x07FC0000, 0x0003FE00, 0x000001FF ]
    },
    WORD_LIMIT : {
        4 : 0x00000FFF,
        9 : 0x07FFFFFF
    },
    DIRECTIONS : {
        4 : [ '12', '21', '34', '43', '13', '31', '24', '42' ],
        9 : [ '12', '21', '34', '43', '13', '31', '24', '42', '57', '75', '68', '86' ]
    }
};

module.exports = Constants;