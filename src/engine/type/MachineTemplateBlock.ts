import {Machine} from "../../schema/machine";
import {FileText, FileTextType} from "./FileText";
import {
	HasTemplateBlock,
	hasTemplateBlockSubtype,
	renderedTemplateBlockSubtype,
	TemplateBlock,
	TemplateBlockType
} from "./TemplateBlock";
import {Type} from "./Type";

export const MACHINE_DATA_TYPE: "machine" = "machine";
export const DND5E_MACHINE_TEMPLATE_ID: "dnd5e-npc-stats" = "dnd5e-npc-stats";
export const CYPHER_MACHINE_TEMPLATE_ID: "cypher-creature" = "cypher-creature";

export interface MachineData {
	fileText: FileText;
	machine: Machine;
}

export const MachineDataType = Type.novel<MachineData>()
	.withTypedField("fileText", FileTextType)
	.withScalarField("machine")
	.withStringify(item => FileTextType.stringify(item.fileText))
	.withName("MachineData");

export interface MachineTemplateBlock extends TemplateBlock {
	dataType: typeof MACHINE_DATA_TYPE;
}

export const MachineTemplateBlockType = TemplateBlockType.toBuilder<MachineTemplateBlock>()
	.withFixed("dataType", MACHINE_DATA_TYPE)
	.withName("MachineTemplateBlock");

export interface CypherMachineTemplateBlock extends MachineTemplateBlock {
	templateId: typeof CYPHER_MACHINE_TEMPLATE_ID;
}

export const CypherMachineTemplateBlockType = MachineTemplateBlockType.toBuilder<CypherMachineTemplateBlock>()
	.withFixed("templateId", CYPHER_MACHINE_TEMPLATE_ID)
	.withParent(MachineTemplateBlockType)
	.withName("CypherMachineTemplateBlock");

export interface MachineDataTemplateBlock<T extends MachineTemplateBlock> extends HasTemplateBlock<T> {
	machineData: MachineData;
}

export const machineDataTemplateBlockSubtype: <M extends MachineTemplateBlock>(type: Type<M>, name: string) => Type<MachineDataTemplateBlock<M>> = <M extends MachineTemplateBlock, T extends MachineDataTemplateBlock<M>>(type: Type<M>, name: string): Type<T> => hasTemplateBlockSubtype<M, T>(type)
	.withTypedField("machineData", MachineDataType)
	.withTypedField("templateBlock", type)
	.withName(name);

export interface CypherMachineDataTemplateBlock extends MachineDataTemplateBlock<CypherMachineTemplateBlock> {
	machineData: MachineData;
}

export const CypherMachineDataTemplateBlockType: Type<CypherMachineDataTemplateBlock> = machineDataTemplateBlockSubtype(CypherMachineTemplateBlockType, "CypherMachineDataTemplateBlock");

export const RenderedCypherMachineDataTemplateBlockType = renderedTemplateBlockSubtype(CypherMachineDataTemplateBlockType).withName("RenderedCypherMachine");

export interface DND5EMachineTemplateBlock extends MachineTemplateBlock {
	templateId: typeof DND5E_MACHINE_TEMPLATE_ID;
}

export const DND5EMachineTemplateBlockType = MachineTemplateBlockType.toBuilder<DND5EMachineTemplateBlock>()
	.withFixed("templateId", DND5E_MACHINE_TEMPLATE_ID)
	.withName("DND5EMachineTemplateBlock");

export interface DND5EMachineDataTemplateBlock extends MachineDataTemplateBlock<DND5EMachineTemplateBlock> {
	machineData: MachineData;
}

export const DND5EMachineDataTemplateBlockType: Type<DND5EMachineDataTemplateBlock> = machineDataTemplateBlockSubtype(DND5EMachineTemplateBlockType, "DND5EMachineDataTemplateBlock");

export const RenderedDND5EMachineDataTemplateBlockType = renderedTemplateBlockSubtype(DND5EMachineDataTemplateBlockType).withName("RenderedDND5EMachine");
