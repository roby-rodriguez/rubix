/**
 * Created by johndoe on 03.01.2016.
 */
var Cube = require('../cube');

var decoded = 'edbb|bacc|fbdd|dcaa|ceee|afff';
var cube = new Cube(2, decoded);
// assert cube.toString == decoded
console.log(decoded);
console.log(cube.toString());

var newLabelling = 'badcfe';
console.log(cube.repaint(newLabelling).toString());
console.log(cube.toString(newLabelling));