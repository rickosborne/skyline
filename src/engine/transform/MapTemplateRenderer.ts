import {MapRenderer} from "../../template/MapRenderer";
import {resolveAndDo} from "../../template/util";
import {EngineConfig} from "../EngineConfig";
import {MapDataBlock, MapTemplateBlock, MapTemplateBlockType, RenderedMapDataBlockType} from "../type/Map";
import {RenderedTemplateBlock} from "../type/TemplateBlock";
import {Transformer} from "./Transformer";

export class MapTemplateRenderer extends Transformer<MapTemplateBlock, RenderedTemplateBlock<MapDataBlock>> {
	private readonly renderer: MapRenderer = new MapRenderer();

	constructor(config: Partial<EngineConfig> = {}) {
		super(MapTemplateBlockType, RenderedMapDataBlockType, config);
	}

	onInput(source: MapTemplateBlock): void {
		if (!this.hasChanged(source) && !this.config.cacheBust) {
			return;
		}
		const mapData = this.renderer.getData(source.dataType, source.dataName, source.keyValue, source.body);
		if (mapData == null) {
			this.logger.error(`No map found in map template block: ${MapTemplateBlockType.identify(source)}`);
			return;
		}
		const renderedText = this.renderer.render(mapData, source.keyValue, source.body);
		resolveAndDo(renderedText, (rt: any): rt is string => typeof rt === "string", rt => {
			if (rt.trim() !== source.body.trim()) {
				this.logger.info(`Updated ${MapTemplateBlockType.identify(source)}`);
				this.notify({
					renderedText: rt,
					source: {
						templateBlock: source,
					},
				});
			}
		});
	}
}
