/**
 * The idea behind this is to reconstruct as many states as possible beginning from an unscrambled state.
 * We apply twists in all legal directions and then check if the obtained state has(n't) somehow already been
 * reached so far. In this sense, two types of equivalences are checked: cube and label permutations.
 *
 * Created by johndoe on 29.12.2015.
 */
var Constants = require('./constants');
var Util = require('./util');
var Cube = require('./cube');
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
    var shifted, currentState = q.toString(), existingState;

    // todo refactor this bullshit if it stays
    if (states[currentState] !== undefined) {
        if (step < states[currentState].value) {
            states[currentState].value = step;
            states[currentState].parent = lastDir;
        }
    } else if (states[existingState = checkExists(q)] !== undefined ) {
        if (step < states[existingState].value) {
            delete states[existingState];
            states[currentState] = {};
            states[currentState].value = step;
            states[currentState].parent = lastDir; // not sure about this one
        }
    } else {
        states[currentState] = {};
        states[currentState].value = step;
        states[currentState].parent = lastDir;
        for (var i = 0; i < Constants.DIRECTIONS[q.size()].length; i++) {
            var curDir = Constants.DIRECTIONS[q.size()][i];
            shifted = q.shift(curDir);
            iterateConstruct(shifted, step + 1, Util.reverseDirection(curDir));
        }
    }
}
//iterateConstruct(new Cube(3), 0);
iterateConstruct(new Cube(2), 0);

function iterateSearch(q) {
    var existing, existingState, qparent, state = q.toString();
    if ( (existing = states[state] || states[existingState = checkExists(q)] ) !== undefined) {
        if (existing.value) {
            console.log(state + ' ' + existing.parent + (existingState ? ' alternate' : ''));
            if (existingState) // we found a matching alternate state
                q = new Cube(q.size(), existingState);
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
    },
    shuffle: function (times) {
        var q = new Cube(2), dir;
        for (var i = 0; i < times; i++) {
            dir = Math.floor(Math.random() * Constants.DIRECTIONS[q.size()].length);
            q = q.shift(Constants.DIRECTIONS[q.size()][dir]);
        }
        return q.toString();
    }
};