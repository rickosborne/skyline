import * as path from "path";
import {SourceDirectory} from "../type/SourceDirectory";
import {SourceFile} from "../type/SourceFile";

export function fileInDirectory(fileName: string, dir: SourceDirectory): SourceFile {
  return {
  	directory: dir,
    fullPath: path.join(dir.fullPath, fileName),
    pathFromRoot: path.join(dir.pathFromRoot, fileName),
    fileName,
    baseName: path.basename(fileName).replace(/^([^.]+).*$/, "$1"),
    extension: path.extname(fileName),
  };
}
