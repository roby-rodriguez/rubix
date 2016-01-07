/**
 * The idea behind this is to reconstruct as many states as possible beginning from an unscrambled state.
 * We apply twists in all legal directions and then check if the obtained state has(n't) somehow already been
 * reached so far. In this sense, two types of equivalences are checked: cube and label permutations.
 *
 * Created by johndoe on 29.12.2015.
 */
var Cube = require('./cube');
var cube = new Cube(2);
var directions = [01, 10, 23, 32, 02, 20, 13, 31];
//todo isn't there a more elegant way?
var reverseDirections = { 01 : 10, 10 : 01, 23 : 32, 32 : 23, 02 : 20, 20 : 02, 13 : 31, 31 : 13};
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
 *      'efcabd' -> not ok, since index=2 has the same assignment
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
                return permutationString;
        }
    }
}

function iterateConstruct(q, step, lastDir) {
    var shifted, currentState = q.toString(), existing, existingState;

    // todo refactor this bullshit if it stays
    if (states[currentState] !== undefined) {
        if (step < states[currentState].value) {
            states[currentState].value = step;
            console.log("MUIE 1");
            states[currentState].parent = lastDir;
        }
    } else if ((existing = states[existingState = checkExists(q)]) !== undefined ) {
        //states[currentState] = {};
        //states[currentState].value = existing.value > step ? step : existing.value;
        //states[currentState].parent = existing.parent;
        if (step < states[existingState].value) {
            //states[existingState].value = step;
            //states[existingState].parent = lastDir;
            console.log("MUIE 2");
            delete states[existingState];
            states[currentState] = {};
            states[currentState].value = step;
            states[currentState].parent = lastDir; // not sure about this one
        }
    } else {
        states[currentState] = {};
        states[currentState].value = step;
        states[currentState].parent = lastDir;
        for (var i = 0; i < directions.length; i++) {
            // not 100% sure about this
            lastDir = reverseDirections[directions[i]];
            //states[currentState].parent = lastDir = directions[i];
            shifted = q.shift(directions[i]);
            iterateConstruct(shifted, step + 1, lastDir);
        }
    }
}
iterateConstruct(cube, 0);

function iterateSearch(q) {
    var existing, existingState, qparent, state = q.toString();
    if ( (existing = states[state] || states[existingState = checkExists(q)] ) !== undefined) {
        if (existing.value) {
            console.log(state + ' ' + existing.parent);
            if (existingState) // we found a matching alternate state
                q = new Cube(2, existingState);
            qparent = q.shift(existing.parent);
            iterateSearch(qparent);
        } else
            console.log(state);
    } else
        console.error('Missing state: ' + state);
}

module.exports = {
    getStates : function () {
        return states;
    },
    solve: function (state) {
        iterateSearch(new Cube(2, state));
    }
};