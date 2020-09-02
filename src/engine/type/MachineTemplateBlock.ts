import {Machine} from "../../schema/machine";
import {FileText, FileTextType} from "./FileText";
import {HasTemplateBlock, HasTemplateBlockType, TemplateBlock, TemplateBlockType} from "./TemplateBlock";
import {Type} from "./Type";
import equal = require("fast-deep-equal");

export const MACHINE_DATA_TYPE: "machine" = "machine";
export const DND5E_MACHINE_TEMPLATE_ID: "dnd5e-npc-stats" = "dnd5e-npc-stats";
export const CYPHER_MACHINE_TEMPLATE_ID: "cypher-creature" = "cypher-creature";

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

export interface MachineTemplateBlock extends TemplateBlock {
	dataType: typeof MACHINE_DATA_TYPE;
}

export const MachineTemplateBlockType = TemplateBlockType.subtype("MachineTemplateBlock",
	(item: any): item is MachineTemplateBlock => item != null && item.dataType === MACHINE_DATA_TYPE && TemplateBlockType.isInstance(item),
	(a, b) => a.dataType === b.dataType,
	(a, b) => a.dataType !== b.dataType,
	item => TemplateBlockType.stringify(item),
);

export interface CypherMachineTemplateBlock extends MachineTemplateBlock {
	templateId: typeof CYPHER_MACHINE_TEMPLATE_ID;
}

export const CypherMachineTemplateBlockType = MachineTemplateBlockType.subtype("CypherMachineTemplateBlock",
	(item: any): item is CypherMachineTemplateBlock => item != null &&
		item.templateId === CYPHER_MACHINE_TEMPLATE_ID,
	(a, b) => a.templateId === b.templateId,
	(a, b) => a.templateId !== b.templateId,
	item => MachineTemplateBlockType.stringify(item),
);

export interface MachineDataTemplateBlock<T extends MachineTemplateBlock> extends HasTemplateBlock<T> {
	machineData: MachineData;
}

export const MachineDataTemplateBlockSubtype: <M extends MachineTemplateBlock>(type: Type<M>, name: string) => Type<MachineDataTemplateBlock<M>> = <M extends MachineTemplateBlock>(type: Type<M>, name: string) => HasTemplateBlockType.subtype(name,
	(item: any): item is MachineDataTemplateBlock<M> => item != null &&
	type.isInstance(item.templateBlock) &&
	MachineDataType.isInstance(item.machineData),
	(a, b) => type.equals(a.templateBlock, b.templateBlock) && MachineDataType.equals(a.machineData, b.machineData),
	(a, b) => type.hasChanged(a.templateBlock, b.templateBlock) || MachineDataType.hasChanged(a.machineData, b.machineData),
	item => MachineDataType.stringify(item.machineData) + " " + type.stringify(item.templateBlock),
);

export interface CypherMachineDataTemplateBlock extends MachineDataTemplateBlock<CypherMachineTemplateBlock> {
	machineData: MachineData;
}

export const CypherMachineDataTemplateBlockType = MachineDataTemplateBlockSubtype(CypherMachineTemplateBlockType,"CypherMachineDataTemplateBlock");

export interface DND5EMachineTemplateBlock extends MachineTemplateBlock {
	templateId: typeof DND5E_MACHINE_TEMPLATE_ID;
}

export const DND5EMachineTemplateBlockType = MachineTemplateBlockType.subtype("DND5EMachineTemplateBlock",
	(item: any): item is DND5EMachineTemplateBlock => item != null &&
		item.templateId === DND5E_MACHINE_TEMPLATE_ID,
	(a, b) => a.templateId === b.templateId,
	(a, b) => a.templateId !== b.templateId,
	item => MachineTemplateBlockType.stringify(item),
);

export interface DND5EMachineDataTemplateBlock extends MachineDataTemplateBlock<DND5EMachineTemplateBlock> {
	machineData: MachineData;
}

export const DND5EMachineDataTemplateBlockType = MachineDataTemplateBlockSubtype(DND5EMachineTemplateBlockType,"DND5EMachineDataTemplateBlock");
