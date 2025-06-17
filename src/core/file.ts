import fs from "node:fs/promises";
import path from "node:path";

/**
 * Creates a file with the specified content, name, and directory.
 *
 * @param content - The content to write into the file.
 * @param fileName - The name of the file to create.
 * @param outputDir - The directory where the file will be created.
 * @param targetFolder - The target folder inside the output directory. Defaults to the current directory.
 * @returns The path of the created file.
 */
export async function createFile(content: string, fileName: string, outputDir: string, targetFolder = ".") {
  const targetPath = path.resolve(outputDir, targetFolder);
  await fs.mkdir(targetPath, { recursive: true });
  const filePath = path.resolve(targetPath, fileName);
  await fs.writeFile(filePath, content);
  return filePath;
}
