import {
	MACHINE_DATA_TYPE,
	MachineData,
	MachineDataType,
	MachineTemplateBlock,
	MachineTemplateBlockType
} from "../type/MachineTemplateBlock";
import {TemplateBlock, TemplateBlockType} from "../type/TemplateBlock";
import {BiTransformer} from "./Transformer";

export class MachineTemplateBlockLoader extends BiTransformer<MachineData, TemplateBlock, MachineTemplateBlock> {
	constructor() {
		super(
			MachineDataType,
			TemplateBlockType,
			MachineTemplateBlockType,
		);
	}

	protected matchLeftRight(machineData: MachineData, templateBlock: TemplateBlock): boolean {
		// console.debug(`${this} matchLeftRight ${MachineDataType.stringify(machineData)} <=> ${TemplateBlockType.stringify(templateBlock)}`);
		return templateBlock.dataType === MACHINE_DATA_TYPE && templateBlock.dataName === machineData.fileText.file.baseName;
	}

	onInputRight(templateBlock: TemplateBlock): void {
		if (templateBlock.dataType === MACHINE_DATA_TYPE) {
			super.onInputRight(templateBlock);
		}
	}

	protected onInputs(machineData: MachineData, templateBlock: TemplateBlock): void {
		this.notify({
			machineData,
			templateBlock
		});
	}
}
