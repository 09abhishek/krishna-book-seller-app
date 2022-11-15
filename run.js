// Option #1

const shell = require("shelljs");

shell.exec("echo =========================================");
shell.exec("echo Executing npm run start Command");
shell.exec("echo =========================================");

shell.exec("npm run start");

// Option #2
/*
const { execSync } = require("child_process");

execSync("npm run start");

 */
