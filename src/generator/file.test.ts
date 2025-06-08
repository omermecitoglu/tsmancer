import fs from "node:fs/promises";
import path from "node:path";
import { afterEach, describe, expect, it, jest } from "@jest/globals";
import createFile from "./file";

describe("createFile", () => {
  const mockMkdir = jest.spyOn(fs, "mkdir").mockResolvedValue(undefined);
  const mockWriteFile = jest.spyOn(fs, "writeFile").mockResolvedValue(undefined);

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should create the target directory and write the file with given content", async () => {
    const content = "test content";
    const fileName = "test.txt";
    const outputDir = "/output";
    const targetFolder = "subfolder";

    const expectedPath = path.resolve(outputDir, targetFolder);
    const expectedFilePath = path.resolve(expectedPath, fileName);

    await createFile(content, fileName, outputDir, targetFolder);

    expect(mockMkdir).toHaveBeenCalledWith(expectedPath, { recursive: true });
    expect(mockWriteFile).toHaveBeenCalledWith(expectedFilePath, content);
  });

  it("should create the file in the default target folder when not specified", async () => {
    const content = "default folder content";
    const fileName = "default.txt";
    const outputDir = "/output";

    const expectedFilePath = path.resolve(outputDir, fileName);

    await createFile(content, fileName, outputDir);

    expect(mockMkdir).toHaveBeenCalledWith(path.resolve(outputDir, "."), { recursive: true });
    expect(mockWriteFile).toHaveBeenCalledWith(expectedFilePath, content);
  });
});
