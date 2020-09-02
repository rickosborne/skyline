import {
	MachineData,
	MachineDataTemplateBlock,
	MachineDataType,
	MachineTemplateBlock
} from "../type/MachineTemplateBlock";
import {Type} from "../type/Type";
import {BiTransformer} from "./Transformer";

export class MachineTemplateBlockLoader<T extends MachineTemplateBlock, M extends MachineDataTemplateBlock<T>> extends BiTransformer<MachineData, T, M> {
	constructor(
		public readonly inRightType: Type<T>,
		public readonly outType: Type<M>,
	) {
		super(MachineDataType, inRightType, outType);
	}

	protected matchLeftRight(machineData: MachineData, templateBlock: T): boolean {
		return templateBlock.dataName === machineData.fileText.file.baseName;
	}

	onInputRight(templateBlock: T): void {
		if (this.inRightType.isInstance(templateBlock)) {
			super.onInputRight(templateBlock);
		} else {
			console.warn(`[${this}] Not a ${this.inRightType}: ${JSON.stringify(templateBlock, null, 2)}`);
		}
	}

	protected onInputs(machineData: MachineData, templateBlock: T): void {
		this.notify({
			machineData,
			templateBlock
		} as M);
	}

	toString(): string {
		return this.inRightType.name + "Loader";
	}
}
