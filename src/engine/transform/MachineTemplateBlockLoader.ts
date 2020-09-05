import {EngineConfig} from "../EngineConfig";
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
		config: Partial<EngineConfig> = {},
	) {
		super(MachineDataType, inRightType, outType, config);
	}

	protected matchLeftRight(machineData: MachineData, templateBlock: T): boolean {
		return templateBlock.dataName === machineData.fileText.file.baseName;
	}

	onInputRight(templateBlock: T): void {
		if (this.inRightType.isInstance(templateBlock)) {
			super.onInputRight(templateBlock);
		} else {
			this.logger.warn(`Not a ${this.inRightType}: ${JSON.stringify(templateBlock, null, 2)}`);
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
