/**
 * Main app entry point
 *
 * Created by johndoe on 29.12.2015.
 */
var Operations = require('./operations');

var states = Operations.getStates();
for (var i in states) {
    console.log(i + ' step ' + states[i].value + ' parent ' + states[i].parent);
}

console.log('Solver: ');
//Operations.solve('bbdd|fcfa|ddbb|eaec|ceae|afcf');// check this one
///Operations.solve('cbaa|fcbb|adcc|eadd|deee|bfff');
//Operations.solve('edea|cabb|fbfc|acdd|dece|bfaf');

//Operations.solve('fbfa|ccbb|edec|aadd|beae|dfcf');
Operations.solve(Operations.shuffle(2));
//Operations.solve('aecf|bbdd|cfae|ddbb|ecec|fafa');