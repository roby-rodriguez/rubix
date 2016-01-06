/**
 * The idea behind this is to reconstruct as many states as possible beginning from an unscrambled state.
 * We apply twists in all legal directions and then check if the obtained state has(n't) somehow already been
 * reached so far. In this sense, two types of equivalences are checked: cube and label permutations.
 *
 * Created by johndoe on 29.12.2015.
 */
var Cube = require('./cube');
var directions = [01, 10, 23, 32, 02, 20, 13, 31];
var cube = new Cube(2);
var states = {};

/**
 * Given original state 'a|b|c|d|e|f' (representing the cube), the following permutations are equivalent:
 * (ie. these correspond to viewing the cube from all possible angles)
 */
var cubePermutations = ['bcdaef', 'cdabef', 'dabcef',
    'badcfe', 'adcbfe', 'dcbafe', 'cbadfe',

    'fceabd', 'ceafbd', 'eafcbd', 'afcebd',
    'faecdb', 'aecfdb', 'ecfadb', 'cfaedb',

    'fbedac', 'bedfac', 'edfbac', 'dfbeac',
    'fdebca', 'debfca', 'ebfdca', 'bfdeca'
];
/**
 * Given the original labelling 'abcdef', the following array contains unique permutations.
 * Ex.  'abcdef'
 *      'badcfe' -> ok, since every letter/color receives a position different from the original
 *      'efcabd' -> not ok, since
 */
var labelPermutations = require('./generator');

/**
 * Checks if any equivalent state has been previously reached
 *
 * @param q current state
 */
function checkExists(q) {
    for (var j = 0; j < labelPermutations.length; j++) {
        for (var i = 0; i < cubePermutations.length; i++) {
            var permutationString = q.permutation(cubePermutations[i]).toString(labelPermutations[j]);
            if (states.hasOwnProperty(permutationString))
                return states[permutationString];
        }
    }
}

var lastDir;

function iterate(q, step) {
    var shifted, currentState = q.toString(), existing = checkExists(q);

    // todo refactor this bullshit if it stays
    if (states[currentState] !== undefined) {
        if (step < states[currentState].value) {
            states[currentState].value = step;
        }
        states[currentState].parent = lastDir;
    } else if ((existing = checkExists(q)) !== undefined ) {
        states[currentState] = {};
        states[currentState].value = existing.value > step ? step : existing.value;
        states[currentState].parent = lastDir;
    } else {
        states[currentState] = {};
        states[currentState].value = step;
        for (var i = 0; i < directions.length; i++) {
            states[currentState].parent = lastDir = directions[i];
            shifted = q.shift(lastDir);
            iterate(shifted, step + 1);
        }
    }
}

iterate(cube, 0);
/*
for (var i in states) {
    console.log(i + ' step ' + states[i].value);
}
*/

for (var i in states) {
    console.log(i + ' step ' + states[i].value + ' parent dir ' + states[i].parent);
    var q = new Cube(2, i);
    var shiftedQ = q.shift(states[i].parent);
    var existsShiftedQ = checkExists(shiftedQ);
    for (var j = 0; j < directions.length; j++) {
        if (states[i].parent != directions[j]) {
            var shifted = q.shift(directions[j]);
            var existsShifted = checkExists(shifted);
            if (existsShifted === undefined)
                console.error('Not found 1: ' + shifted.toString());
            else if (existsShiftedQ === undefined)
                console.error('Not found 2: ' + shiftedQ.toString());
            else if (existsShifted.value < existsShiftedQ.value)
                console.log('MUIE: base=' + existsShifted.value + ' dif=' + (existsShiftedQ.value - existsShifted.value));
        }
    }
}
