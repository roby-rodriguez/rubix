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
var Store = require('./store');
var CUBE_WIDTH = require('./config').CUBE_WIDTH;

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
 * @param step current step
 * @param lastDir last twist direction
 */
function checkExists(q, step, lastDir) {
    var currentState = q.toString(), normal = Store.getState(currentState);
    if (normal)
        return {
            existing: normal
        };
    for (var j = 0; j < labelPermutations.length; j++) {
        for (var i = 0; i < cubePermutations.length; i++) {
            var permutationString = q.permutation(cubePermutations[i]).toString(labelPermutations[j]);
            var permuted = Store.getState(permutationString);
            if (permuted)
                return {
                    existing: permuted
                };
        }
    }
    return {
        current : {
            key: currentState,
            value: step,
            parent: lastDir
        }
    }
}

/**
 * Checks whether the reached state exists and updates it if necessary,
 * otherwise it creates it an continues with the iteration
 *
 * @param state object containing the existing (found) state and current state
 * @param activity callback
 */
function checkAndUpdate(state, activity) {
    if (state.existing) {
        // if found state is weaker than the currently reached state, then replace it
        if (state.current.step < state.existing.step)
            // todo see what is to do here update existing or delete it and add only current
            console.log('existing=' + state.existing.key + ' current=' + state.current.key);
            // Store.setState(existing.key, step, lastDir)
            Store.setState(state.current);
    } else {
        //set state to current
        //Store.setState(existing.key, step, lastDir);
        // found a completely new state, store it
        Store.setState(state.current);
        activity();
    }
}

function iterateConstructRec(q, step, lastDir) {
    var shifted, state = checkExists(q, step, lastDir);
    checkAndUpdate(state, function () {
            for (var i = 0; i < Constants.DIRECTIONS[q.size()].length; i++) {
                var curDir = Constants.DIRECTIONS[q.size()][i];
                shifted = q.shift(curDir);
                iterateConstructRec(shifted, step + 1, Util.reverseString(curDir));
            }
        }
    );
}

function iterateConstruct() {
    var pending = [ { q: new Cube(CUBE_WIDTH), step : -1 } ];
    var q, qObj, step, lastDir;

    while (pending.length) {
        qObj = pending.pop(); q = qObj.q; lastDir = qObj.dir; step = qObj.step;
        var shifted, state = checkExists(q, ++step, lastDir);

        checkAndUpdate(state, function () {
                for (var i = 0; i < Constants.DIRECTIONS[q.size()].length; i++) {
                    var curDir = Constants.DIRECTIONS[q.size()][i];
                    shifted = q.shift(curDir);
                    pending.push({
                        q: shifted,
                        dir: Util.reverseString(curDir),
                        step: step
                    });
                }
            }
        );
    }
}

function iterateSearch(q) {
    var state = checkExists(q), qparent;
    if (state) {
        if (state.existing.value) {
            console.log(state.existing.key + ' ' + state.existing.parent);
            qparent = q.shift(state.existing.parent);
            iterateSearch(qparent);
        } else
            console.log(state.existing.key);
    } else
        console.error('Missing state: ' + state.current.key);
}

module.exports = {
    getStates : function () {
        // todo this should be figured out from config directly
        if (!Object.keys(states).length)
            //iterateConstructRec(new Cube(CUBE_WIDTH), 0);
            iterateConstruct();
        return states;
    },
    solve: function (state) {
        iterateSearch(new Cube(state));
    },
    shuffle: function (times) {
        var q = new Cube(CUBE_WIDTH), dir;
        for (var i = 0; i < times; i++) {
            dir = Math.floor(Math.random() * Constants.DIRECTIONS[q.size()].length);
            q = q.shift(Constants.DIRECTIONS[q.size()][dir]);
        }
        return q.toString();
    }
};