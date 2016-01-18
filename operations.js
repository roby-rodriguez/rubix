/**
 * The idea behind this is to reconstruct as many states as possible beginning from an unscrambled state.
 * We apply twists in all legal directions and then check if the obtained state has(n't) somehow already been
 * reached so far. In this sense, two types of equivalences are checked: cube and label permutations.
 * TODO wouldn't it be a good idea to delegate bit operations to C-style threads and gather results in a callback fashion?
 *
 * Created by johndoe on 29.12.2015.
 */
var Constants = require('./constants');
var Util = require('./util');
var Cube = require('./cube');
var Store = require('./store');
var Config = require('./config');
var DatabaseOperation = require('./operations.type.js').DatabaseOperation;
var MemoryOperation = require('./operations.type.js').MemoryOperation;
// iterative or recursive
var operationStrategy;
// memory or database
var operationType;

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
    var currentState = q.toString(), normal = Store.getState(currentState),
        current = {
            key: currentState,
            step: step,
            parent: lastDir
        };

    if (normal)
        return {
            current: current,
            existing: normal
        };
    for (var j = 0; j < labelPermutations.length; j++) {
        for (var i = 0; i < cubePermutations.length; i++) {
            var permutationString = q.permutation(cubePermutations[i]).toString(labelPermutations[j]);
            var permuted = Store.getState(permutationString);
            if (permuted)
                return {
                    current: current,
                    existing: permuted
                };
        }
    }
    return {
        current: current
    }
}

function checkExistsNew(q, step, lastDir) {
    var currentState = q.toString(),
        current = {
            key: currentState,
            step: step,
            parent: lastDir
        };
    return Store.getState(currentState).then(function (normal) {
        if (normal)
            return {
                current: current,
                existing: normal
            };
        operationType.checkPermutations().then(function (permuted) {
            if (permuted)
                return {
                    current: current,
                    existing: permuted
                };
            return {
                current: current
            }
        })
    });
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
        // if the found state is weaker than the currently reached state, then replace it
        if (state.current.step < state.existing.step) {
            // alternately could delete existing and set current
            Store.setState({
                key: state.existing.key,
                step: state.current.step,
                parent: state.current.parent
            });
        }
    } else {
        // found a completely new state, store it
        Store.setState(state.current);
        activity();
    }
}

//todo make construction and search methods polymorphic
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
    var pending = [ { q: new Cube(Config.CUBE_WIDTH), step : -1 } ];
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
    if (state.existing) {
        if (state.existing.step) {
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
        Store.isEmpty().then(function (result) {
            if (result) {
                //iterateConstructRec(new Cube(CUBE_WIDTH), 0);
                iterateConstruct();
            }
            return Store.getAllStates();
        });
    },
    solve: function (state) {
        iterateSearch(new Cube(state));
    },
    shuffle: function (times) {
        var q = new Cube(Config.CUBE_WIDTH), dir;
        for (var i = 0; i < times; i++) {
            dir = Math.floor(Math.random() * Constants.DIRECTIONS[q.size()].length);
            q = q.shift(Constants.DIRECTIONS[q.size()][dir]);
        }
        return q.toString();
    },
    useDatabase: function(useDatabase) {
        Config.USE_DATABASE = useDatabase;
        // currentStore = useDatabase? new DatabaseStore() : new MemoryStore();
        operationType = useDatabase? new DatabaseOperation() : new MemoryOperation();
        Store.useDatabase(useDatabase);
    },
    useRecursion: function (useRecursion) {
        Config.USE_DATABASE = useRecursion;
    }
};