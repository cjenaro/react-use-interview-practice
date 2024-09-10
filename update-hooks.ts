import { readdirSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";

// Paths to the src and docs folders
const srcFolder = join(import.meta.dirname, "src");
const docsFolder = join(import.meta.dirname, "docs");

// Function to convert a docs file content to a comment
function mdToComment(mdContent) {
  return mdContent
    .split("\n")
    .map((line) => `// ${line}`)
    .join("\n");
}

// Get all docs files
const docsFiles = readdirSync(docsFolder).filter((file) =>
  file.endsWith(".md")
);

// Process each docs file
docsFiles.forEach((docFile) => {
  const hookName = docFile.replace(".md", ".ts");
  const hookPath = join(srcFolder, hookName);
  const docPath = join(docsFolder, docFile);

  // Check if the corresponding hook file exists
  if (readdirSync(srcFolder).includes(hookName)) {
    // Read the hook file
    const hookContent = readFileSync(hookPath, "utf-8");

    // Read the docs file and convert it to a comment
    const docContent = readFileSync(docPath, "utf-8");
    const commentContent = mdToComment(docContent);

    // Find the import section in the hook file
    const importEndIndex =
      hookContent.indexOf("\n", hookContent.indexOf("import")) + 1;

    // Insert the comment after the imports
    const updatedHookContent = `${hookContent.slice(
      0,
      importEndIndex
    )}\n${commentContent}\n${hookContent.slice(importEndIndex)}`;

    // Write the updated content back to the hook file
    writeFileSync(hookPath, updatedHookContent, "utf-8");

    console.log(`Updated: ${hookPath}`);
  }
});

console.log("Process complete.");
