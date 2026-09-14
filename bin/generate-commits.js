let types = ["feat", "doc", "test", "fix", "style", "refactor"];
let temperature = 0.4;
let count = process.argv[2] || 20;

let childProcess = require('child_process');

console.log(`Generating ${count} commit messages with temperature ${temperature} from types: ${types}`);

function generateWord() {
    let word = "";
    for (let i = 0; i < 4; i++) {
        word += String.fromCharCode(Math.floor(Math.random() * 26) + 97);
    }
    return word;
}

function runShellCommand(command) {
    return new Promise((resolve, reject) => {
        childProcess.exec(command, (error, stdout, stderr) => {
            if(error) {
                console.error(`exec error: ${error}`);
                reject(error);
            }
            resolve({stdout, stderr});
        });
    });
}

for (let i = 1; i <= parseInt(count); i++) {
    let message = "";
    if (Math.random() < temperature) {
        let randomTypeIndex = Math.floor(Math.random() * types.length);
        message += `${types[randomTypeIndex]}`;
        if (Math.random() < temperature) {
            message += `(${generateWord()})`;
        }
        message += ": ";
    }
    for (let j = 1; j <= 6; j++) {
        message += generateWord() + " ";
    }
    runShellCommand("git add .").then((result) => {
        console.log(`stdout: ${result.stdout}`);
        console.log(`stderr: ${result.stderr}`);

        return runShellCommand(`git commit -am "${message}"`);
    }).then((result) => {
        console.log(`stdout: ${result.stdout}`);
        console.log(`stderr: ${result.stderr}`);
    }).catch((error) => {
        console.error(error);
    });
}

