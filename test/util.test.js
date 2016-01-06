/**
 * Created by johndoe on 05.01.2016.
 */
var Util = require('../util');
var Face = require('../face');

var face = Object.create(Face.prototype);
face.value = 530; // 001 000 010 010 = 530
face.size  = 2;
console.log(Util.reverse(face)); // 010 010 000 001 = 1153

face.value = 2249; // 100 011 001 001 = 2249
console.log(Util.reverse(face)); // 001 001 011 100 = 604