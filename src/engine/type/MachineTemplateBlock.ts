import {Machine} from "../../schema/machine";
import {FileText, FileTextType} from "./FileText";
import {HasTemplateBlock, TemplateBlockType} from "./TemplateBlock";
import {Type} from "./Type";
import equal = require("fast-deep-equal");

export const MACHINE_DATA_TYPE = "machine";
export const DND5E_MACHINE_TEMPLATE_ID = 'dnd5e-npc-stats';
export const CYPHER_MACHINE_TEMPLATE_ID = 'cypher-creature';

export interface MachineData {
	fileText: FileText;
	machine: Machine;
}

export const MachineDataType = Type.from("MachineData", (item: any): item is MachineData => item != null &&
	FileTextType.isInstance(item.fileText) &&
	typeof item.machine != null,
	(a, b) => FileTextType.equals(a.fileText, b.fileText),
	(a, b) => FileTextType.hasChanged(a.fileText, b.fileText) || !equal(a.machine, b.machine),
	item => item.machine.title,
);

export interface MachineTemplateBlock extends HasTemplateBlock {
	machineData: MachineData;
}

export const MachineTemplateBlockType = Type.from("MachineTemplateBlock", (item: any): item is MachineTemplateBlock => item != null &&
	TemplateBlockType.isInstance(item.templateBlock) &&
	MachineDataType.isInstance(item.machineData),
	(a, b) => MachineDataType.equals(a.machineData, b.machineData),
	(a, b) => MachineDataType.hasChanged(a.machineData, b.machineData),
	item => MachineDataType.stringify(item.machineData),
);
