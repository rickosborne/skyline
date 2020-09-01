import {Coordinator} from "./Coordinator";
import {BookDataLoader} from "./transform/BookDataLoader";
import {BookTemplateBlockLoader} from "./transform/BookTemplateBlockLoader";
import {CypherCharacterFromBook} from "./transform/CypherCharacterFromBook";
import {CypherMachineRenderer} from "./transform/CypherMachineRenderer";
import {CypherPcRenderer} from "./transform/CypherPcRenderer";
import {DND5ECharacterFromBook} from "./transform/DND5ECharacterFromBookCharacter";
import {DND5EMachineRenderer} from "./transform/DND5EMachineRenderer";
import {DND5EPcRenderer} from "./transform/DND5EPcRenderer";
import {FileReader} from "./transform/FileReader";
import {MachineDataLoader} from "./transform/MachineDataLoader";
import {MachineTemplateBlockLoader} from "./transform/MachineTemplateBlockLoader";
import {MarkdownFileReader} from "./transform/MarkdownFileReader";
import {MarkdownFilesFromDirectory} from "./transform/MarkdownFilesFromDirectory";
import {PlantUmlFileReader} from "./transform/PlantUmlFileReader";
import {PlantUmlTemplateRenderer} from "./transform/PlantUmlTemplateRenderer";
import {PrintTemplateRenderer} from "./transform/PrintTemplateRenderer";
import {RenderedTemplateSaver} from "./transform/RenderedTemplateSaver";
import {SourceDirectoryProvider} from "./transform/SourceDirectoryProvider";
import {SourceDirectoryWatcher} from "./transform/SourceDirectoryWatcher";
import {SourceFileFromDirectory} from "./transform/SourceFileFromDirectory";
import {SourceFileListFromDirectory} from "./transform/SourceFileListFromDirectory";
import {StoryGraphFromDirectory} from "./transform/StoryGraphFromDirectory";
import {TableOfContentsItemsCollector} from "./transform/TableOfContentsItemsCollector";
import {TableOfContentsRenderer} from "./transform/TableOfContentsRenderer";
import {TemplateBlockExtractor} from "./transform/TemplateBlockExtractor";

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
	.add(new BookDataLoader())
	.add(new CypherCharacterFromBook())
	.add(new CypherMachineRenderer())
	.add(new DND5ECharacterFromBook())
	.add(new DND5EMachineRenderer())
	.add(new FileReader())
	.add(new MachineDataLoader())
	.add(new MarkdownFileReader())
	.add(new PlantUmlFileReader())
	.add(new RenderedTemplateSaver())
	.add(new SourceDirectoryWatcher())
	.add(new SourceFileFromDirectory())
	.add(new SourceFileListFromDirectory())
	.add(new TableOfContentsItemsCollector())
	.add(new TemplateBlockExtractor())
	.addBi(new BookTemplateBlockLoader())
	.addBi(new CypherPcRenderer())
	.addBi(new DND5EPcRenderer())
	.addBi(new MachineTemplateBlockLoader())
	.addBi(new MarkdownFilesFromDirectory())
	.addBi(new PlantUmlTemplateRenderer())
	.addBi(new PrintTemplateRenderer())
	.addBi(new StoryGraphFromDirectory())
	.addBi(new TableOfContentsRenderer())
	.start();
