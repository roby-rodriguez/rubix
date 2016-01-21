/**
 * Main app entry point
 *
 * Created by johndoe on 29.12.2015.
 */
var Operations = require('./operations');
Operations.useDatabase(false);
Operations.useRecursion(false);

Operations.getStates().then(function (states) {
    for (var i in states) {
        console.log(i + ' step ' + states[i].step + ' parent ' + states[i].parent);
    }

    console.log('Solver: ');
    //Operations.solve('bbdd|fcfa|ddbb|eaec|ceae|afcf');// check this one
    ///Operations.solve('cbaa|fcbb|adcc|eadd|deee|bfff');
    //Operations.solve('edea|cabb|fbfc|acdd|dece|bfaf');

    //Operations.solve('fbfa|ccbb|edec|aadd|beae|dfcf');
    //Operations.solve(Operations.shuffle(2));
    //Operations.solve('aecf|bbdd|cfae|ddbb|ecec|fafa');

    //Operations.solve('aedd|bbae|cfbb|ddcf|ecec|fafa');
});