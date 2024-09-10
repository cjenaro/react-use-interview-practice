// Import the necessary modules
import { readdirSync, unlinkSync } from "fs";
import { join } from "path";

// Paths to the src and tests folders
const srcFolder = join(import.meta.dirname, "src");
const testsFolder = join(import.meta.dirname, "docs");

// Get all hook files from the src folder
const hooks = readdirSync(srcFolder).filter(
  (file) => file.startsWith("use") && file.endsWith(".ts")
);

// Map hook names to easily check existence
const hookNames = new Set(hooks.map((hook) => hook.replace(".ts", "")));

// Get all test files from the tests folder
const testFiles = readdirSync(testsFolder).filter((file) =>
  file.endsWith(".md")
);

// Loop over each test file and check if it has a corresponding hook
testFiles.forEach((testFile) => {
  const testName = testFile.replace(".md", "");

  // If the corresponding hook doesn't exist, remove the test file
  if (!hookNames.has(testName)) {
    const testFilePath = join(testsFolder, testFile);
    unlinkSync(testFilePath);
    console.log(`Removed: ${testFile}`);
  }
});

console.log("Cleanup complete.");
