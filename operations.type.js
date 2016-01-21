/**
 * Created by johndoe on 18.01.2016.
 */
var Promise = require('promise');
var Q = require('q');
var Store = require('./store');

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

var AbstractOperationType = function () {
};

var MemoryOperation = function () {
    AbstractOperationType.apply(this, arguments);
};

MemoryOperation.prototype = Object.create(AbstractOperationType.prototype);
MemoryOperation.prototype.constructor = MemoryOperation;

MemoryOperation.prototype.checkPermutations = function (q) {
    return check(labelPermutations.length - 1, cubePermutations.length - 1);

    function check(j, i) {
        if (i == 0) {
            if (j == 0)
                return Promise.resolve();
            else {
                --j;
                i = cubePermutations.length - 1;
            }
        }
        var permutationString = q.permutation(cubePermutations[i]).toString(labelPermutations[j]);
        return Store.getState(permutationString).then(function (permuted) {
            if (permuted)
                return Promise.resolve(permuted);
            else
                return check(j, i - 1);
        });
    }
};

var DatabaseOperation = function () {
    AbstractOperationType.apply(this, arguments);
};

DatabaseOperation.prototype = Object.create(AbstractOperationType.prototype);
DatabaseOperation.prototype.constructor = DatabaseOperation;

DatabaseOperation.prototype.checkPermutations = function (q) {
    var searches = [];
    // todo this whole thing could be parallelized with external C-style threads
    for (var j = 0; j < labelPermutations.length; j++) {
        for (var i = 0; i < cubePermutations.length; i++) {
            var permutationString = q.permutation(cubePermutations[i]).toString(labelPermutations[j]);
            searches.push(rejectWrapper(Store.getState(permutationString)));
        }
    }
    return Q.any(searches);

    function rejectWrapper(promise) {
        return promise.then(function (result) {
            if (result)
                return Promise.resolve(result);
            else
                return Promise.reject();
        })
    }
};

module.exports = {
    MemoryOperation: MemoryOperation,
    DatabaseOperation: DatabaseOperation
};