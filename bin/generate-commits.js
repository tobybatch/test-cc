let types = ["feat", "doc", "test", "fix", "style", "refactor"];
let temperature = 0.4;
let count = process.argv[2] || 20;

const childProcess = require('child_process');
const fs = require('fs');

console.log(`Generating ${count} commit messages with temperature ${temperature}...`);

function generateWord() {
    let word = "";
    for (let i = 0; i < 4; i++) {
        word += String.fromCharCode(Math.floor(Math.random() * 26) + 97);
    }
    return word;
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

    // 1. Write synchronously
    fs.appendFileSync('dummy-changes', message + "\n");

    // 2. Add and commit synchronously
    childProcess.execSync("git add dummy-changes");
    childProcess.execSync(`git commit -m "${message}"`);

    console.log(`Generated commit ${i}: ${message}`);
}

// 3. Output git log after all commits finish
const log = childProcess.execSync("git log --oneline").toString();
console.log("\nRecent Commits:\n" + log);