import {Coordinator} from "./Coordinator";
import {CypherCharacterJoiner} from "./transform/CypherCharacterJoiner";
import {CypherCharacterReader} from "./transform/CypherCharacterReader";
import {CypherCharacterRenderer} from "./transform/CypherCharacterRenderer";
import {CypherMachineRenderer} from "./transform/CypherMachineRenderer";
import {DND5ECharacterJoiner} from "./transform/DND5ECharacterJoiner";
import {DND5ECharacterReader} from "./transform/DND5ECharacterReader";
import {DND5ECharacterRenderer} from "./transform/DND5ECharacterRenderer";
import {DND5EMachineRenderer} from "./transform/DND5EMachineRenderer";
import {FileListFromDirectory} from "./transform/FileListFromDirectory";
import {FilesFromDirectory} from "./transform/FilesFromDirectory";
import {FileTextToBookData} from "./transform/FileTextToBookData";
import {FileTextToMachineData} from "./transform/FileTextToMachineData";
import {FileTextToMarkdown} from "./transform/FileTextToMarkdown";
import {FileTextToPlantUml} from "./transform/FileTextToPlantUml";
import {MachineTemplateBlockLoader} from "./transform/MachineTemplateBlockLoader";
import {MarkdownFilesAggregator} from "./transform/MarkdownFilesAggregator";
import {PlantUmlJoiner} from "./transform/PlantUmlJoiner";
import {PlantUmlTemplateRenderer} from "./transform/PlantUmlTemplateRenderer";
import {PrintBlockJoiner} from "./transform/PrintBlockJoiner";
import {PrintTemplateRenderer} from "./transform/PrintTemplateRenderer";
import {RenderedTemplateSaver} from "./transform/RenderedTemplateSaver";
import {SourceDirectoryProvider} from "./transform/SourceDirectoryProvider";
import {SourceDirectoryWatcher} from "./transform/SourceDirectoryWatcher";
import {SourceFileOperationToFileText} from "./transform/SourceFileOperationToFileText";
import {StoryGraphJoiner} from "./transform/StoryGraphJoiner";
import {StoryGraphRenderer} from "./transform/StoryGraphRenderer";
import {SubtypeIdentifier} from "./transform/SubtypeIdentifier";
import {TableOfContentsJoiner} from "./transform/TableOfContentsJoiner";
import {TableOfContentsReader} from "./transform/TableOfContentsReader";
import {TableOfContentsRenderer} from "./transform/TableOfContentsRenderer";
import {TemplateBlockReader} from "./transform/TemplateBlockReader";
import {CypherCharacterTemplateBlockType, DND5ECharacterTemplateBlockType} from "./type/BookData";
import {
	CypherMachineDataTemplateBlockType,
	CypherMachineTemplateBlockType,
	DND5EMachineDataTemplateBlockType,
	DND5EMachineTemplateBlockType
} from "./type/MachineTemplateBlock";
import {PlantUmlTemplateBlockType} from "./type/PlantUmlFile";
import {PrintTemplateBlockType} from "./type/PrintTemplateBlock";
import {StoryGraphTemplateBlockType} from "./type/StoryGraph";
import {TemplateBlockType} from "./type/TemplateBlock";

new Coordinator()
	.add(new SourceDirectoryProvider(
		"adapter",
		"adapter/2d20",
		"adapter/cypher",
		"adapter/dnd5e",
		"adapter/fate",
		"adapter/l5r",
		"adapter/year-zero",
		"assets/puml",
		"assets/scss",
		"data",
		"data/machine",
		"data/schema",
		"guide",
		"guide/adventurer",
		"guide/narrator",
		"guide/setting",
		"notes",
		"notes/scratch",
		"story",
		"story/connection",
		"story/iaso",
	))
	// .add(new BookCharacterDataLoader())
	.buildAndAdd(CypherCharacterJoiner)
	.buildAndAdd(CypherCharacterReader)
	.buildAndAdd(CypherMachineRenderer)
	.buildAndAdd(CypherCharacterRenderer)
	.buildAndAdd(DND5ECharacterJoiner)
	.buildAndAdd(DND5ECharacterReader)
	.buildAndAdd(DND5ECharacterRenderer)
	.buildAndAdd(DND5EMachineRenderer)
	.buildAndAdd(FileListFromDirectory)
	.buildAndAdd(FilesFromDirectory)
	.buildAndAdd(FileTextToBookData)
	.buildAndAdd(FileTextToMachineData)
	.buildAndAdd(FileTextToMarkdown)
	.buildAndAdd(FileTextToPlantUml)
	.buildAndAdd(MarkdownFilesAggregator)
	.buildAndAdd(PlantUmlJoiner)
	.buildAndAdd(PlantUmlTemplateRenderer)
	.buildAndAdd(PrintBlockJoiner)
	.buildAndAdd(PrintTemplateRenderer)
	.buildAndAdd(RenderedTemplateSaver)
	.buildAndAdd(SourceDirectoryWatcher)
	.buildAndAdd(SourceFileOperationToFileText)
	.buildAndAdd(StoryGraphJoiner)
	.buildAndAdd(StoryGraphRenderer)
	.buildAndAdd(TableOfContentsJoiner)
	.buildAndAdd(TableOfContentsReader)
	.buildAndAdd(TableOfContentsRenderer)
	.buildAndAdd(TemplateBlockReader)

	.configureAndAdd(config => new SubtypeIdentifier(TemplateBlockType, CypherCharacterTemplateBlockType, config))
	.configureAndAdd(config => new SubtypeIdentifier(TemplateBlockType, CypherMachineTemplateBlockType, config))
	.configureAndAdd(config => new SubtypeIdentifier(TemplateBlockType, DND5ECharacterTemplateBlockType, config))
	.configureAndAdd(config => new SubtypeIdentifier(TemplateBlockType, DND5EMachineTemplateBlockType, config))
	.configureAndAdd(config => new SubtypeIdentifier(TemplateBlockType, PrintTemplateBlockType, config))
	.configureAndAdd(config => new SubtypeIdentifier(TemplateBlockType, PlantUmlTemplateBlockType, config))
	.configureAndAdd(config => new SubtypeIdentifier(TemplateBlockType, StoryGraphTemplateBlockType, config))
	.configureAndAdd(config => new MachineTemplateBlockLoader(CypherMachineTemplateBlockType, CypherMachineDataTemplateBlockType, config))
	.configureAndAdd(config => new MachineTemplateBlockLoader(DND5EMachineTemplateBlockType, DND5EMachineDataTemplateBlockType, config))

	.start();
