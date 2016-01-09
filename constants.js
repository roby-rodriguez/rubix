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

    UPPER_WORD : {
        2 : 0x00000FC0,
        3 : 0x00000000, // todo see how this should work
    },
    LOWER_WORD : {
        2 : 0x0000003F,
        3 : 0x00000000, // todo see how this should work
    },
    DIRECTIONS : {
        2 : [ '12', '21', '34', '43', '13', '31', '24', '42' ],
        3 : [  ]
    }
};

module.exports = Constants;