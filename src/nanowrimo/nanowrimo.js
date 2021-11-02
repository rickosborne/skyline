const process = require('process');
const fs = require('fs');
const path = require('path');
const childProcess = require('child_process');
const root = path.join(__dirname, '..', '..');
const nanoConfigFileName = 'nanowrimo.json';
const nanoConfigFile = path.join(root, nanoConfigFileName);
const nanoText = fs.readFileSync(nanoConfigFile, {encoding: 'utf8', flag: 'r'});
const nano = JSON.parse(nanoText);
const keyName = process.argv[2] || "2020";
const startOfYear = 54525;
const config = nano[keyName];
if (config == null) {
	throw new Error(`No such key in ${nanoConfigFileName}: ${keyName}`);
}
const command = config['countCommand'];
if (typeof command !== 'string') {
	throw new Error(`Malformed 'countCommand' value: ${JSON.stringify(command)}`);
}
const initial = config['initialWordCount'] || 0;
const wcOutput = childProcess.execSync(command, {cwd: root, encoding: "utf8"});
const totalMatch = wcOutput.match(/(\d+)\s+total\s+/s);
if (totalMatch == null) {
	throw new Error(`Could not find wc total:\n${wcOutput}`);
}
const count = parseInt(totalMatch[1], 10);
const fromInitial = count - initial;
const ts = new Date().toISOString();
const log = config['log'] || {};
const lastTimestamp = Object.keys(log).sort().pop();
const lastWords = lastTimestamp == null ? 0 : log[lastTimestamp];
console.log(`[${ts}] From initial: ${count} (current) - ${initial} (initial) = ${fromInitial} (total)`);
if (lastWords !== fromInitial) {
	log[ts] = fromInitial;
	config['log'] = log;
	const jsonOut = JSON.stringify(nano, null, '\t') + "\n";
	fs.writeFileSync(nanoConfigFile, jsonOut);
	const fromPrevious = fromInitial - lastWords;
	const fromStartOfYear = fromInitial - startOfYear;
	console.log(`[${ts}] From previous: ${fromInitial} (total) - ${lastWords} (previous) = ${fromPrevious} (session) ; ${fromStartOfYear} (this year)`);
} else {
	console.log('Did not add a new log entry — it has not changed.');
}
