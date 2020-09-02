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
	.add(new CypherCharacterReader())
	.add(new CypherMachineRenderer())
	.add(new CypherCharacterRenderer())
	.add(new DND5ECharacterReader())
	.add(new DND5ECharacterRenderer())
	.add(new DND5EMachineRenderer())
	.add(new FileListFromDirectory())
	.add(new FilesFromDirectory())
	.add(new FileTextToBookData())
	.add(new FileTextToMachineData())
	.add(new FileTextToMarkdown())
	.add(new FileTextToPlantUml())
	.add(new PlantUmlTemplateRenderer())
	.add(new PrintTemplateRenderer())
	.add(new RenderedTemplateSaver())
	.add(new SourceDirectoryWatcher())
	.add(new SourceFileOperationToFileText())
	.add(new StoryGraphRenderer())
	.add(new TableOfContentsReader())
	.add(new TableOfContentsRenderer())
	.add(new TemplateBlockReader())

	.add(new SubtypeIdentifier(TemplateBlockType, CypherCharacterTemplateBlockType))
	.add(new SubtypeIdentifier(TemplateBlockType, CypherMachineTemplateBlockType))
	.add(new SubtypeIdentifier(TemplateBlockType, DND5ECharacterTemplateBlockType))
	.add(new SubtypeIdentifier(TemplateBlockType, DND5EMachineTemplateBlockType))
	.add(new SubtypeIdentifier(TemplateBlockType, PrintTemplateBlockType))
	.add(new SubtypeIdentifier(TemplateBlockType, PlantUmlTemplateBlockType))
	.add(new SubtypeIdentifier(TemplateBlockType, StoryGraphTemplateBlockType))

	.addBi(new CypherCharacterJoiner())
	.addBi(new DND5ECharacterJoiner())
	.addBi(new MachineTemplateBlockLoader(CypherMachineTemplateBlockType, CypherMachineDataTemplateBlockType))
	.addBi(new MachineTemplateBlockLoader(DND5EMachineTemplateBlockType, DND5EMachineDataTemplateBlockType))
	.addBi(new MarkdownFilesAggregator())
	.addBi(new PlantUmlJoiner())
	.addBi(new PrintBlockJoiner())
	.addBi(new StoryGraphJoiner())
	.addBi(new TableOfContentsJoiner())
	.start();
