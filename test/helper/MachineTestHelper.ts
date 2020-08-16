import * as fs from "fs";
import "mocha";
import * as path from "path";
import * as yaml from "yaml";
import {Machine} from "../../src/schema/machine";

const dataMachinePath = path.join(__dirname, "..", "..", "data", "machine");

export function eachMachine(eachMachineCallback: (machine: Machine, fileName: string) => void) {
	const machineYamlFileNames = fs.readdirSync(dataMachinePath, {withFileTypes: true, encoding: "utf8"})
		.filter(entry => entry.isFile() && entry.name.endsWith(".machine.yaml"))
		.map(entry => entry.name);

	for (let machineYamlFileName of machineYamlFileNames) {
		const machineYaml = fs.readFileSync(path.join(dataMachinePath, machineYamlFileName), {encoding: "utf8"});
		const machine = yaml.parse(machineYaml) as Machine;
		eachMachineCallback(machine, machineYamlFileName);
	}
}

