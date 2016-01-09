/**
 * Created by johndoe on 04.01.2016.
 */
var base = require('./constants').ENCODING_BASIC;

function correct(permutation) {
    var dups = {};
    for (var i = 0; i < permutation.length; i++) {
        if (base.charAt(i) == permutation.charAt(i))
            return false;

        dups[permutation[i]] ? ++dups[permutation[i]] : (dups[permutation[i]] = 1);
    }
    for (var i in dups)
        if (dups[i] > 1)
            return false;
    return true;
}

function permutation(str, arr) {
    if (str.length == 6)
        arr.push(str);
    for (var i = 0; i < base.length; i++) {
        var newStr = str + base.charAt(i);
        if (correct(newStr))
            permutation(newStr, arr);
    }
}

function generate() {
    var arr = [''];
    permutation('', arr);
    return arr;
}

module.exports = generate();