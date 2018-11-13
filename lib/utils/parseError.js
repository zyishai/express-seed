// TODO(me|p=4|#core) - test this module and check that is support wide range 
// of errors(regular "throw" errs, streams errs, cluster errs, DBs errors, promise errs etc).
// FIXME(me|p=4|#core) - return object with all neccessary data (stack, time, meta, file and location).
function parseError(err) {
    if (!err.stack || typeof err === 'string') {
        console.log('Error is not an object type:');
        console.log(`Error is: ${err}`);
        return;
    }

    let keys = Object.getOwnPropertyNames(err);
    console.log(keys);

    keys.filter(key => key !== 'stack').forEach(key => console.log(key + ': ' + err[key]));

    err.stack
        .split('\n') // split string to stack levels
        .filter(line => line.trim().startsWith('at')) // filter out the message
        .forEach(line => { // trim each line and print it (with surrounding |)
            let trimmed = line.trim();
            let fileReg = /(?<=\().*(?=\))/;
            let fileNameReg = /(.*?(?=:))/;
            let fileLocationReg = /(?!:)\d+/g;

            let result = fileReg.exec(trimmed);
            let fileName = fileNameReg.exec(result);
            let lineNumber = fileLocationReg.exec(result);
            let columnNumber = fileLocationReg.exec(result);

            if (fileName && lineNumber && columnNumber) {
                console.log(`${fileName[0]} at line ${lineNumber}, column ${columnNumber}`);
            } else {
                console.log('Regex did not succeed');
            }
        })
}

module.exports = parseError;
