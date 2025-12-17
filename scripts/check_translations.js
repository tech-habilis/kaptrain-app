/**
 * This script will check for any missing translation in the .json resource files
 * Usage: node scripts/check_translations.js -p utilities/i18n/locales
 */

const fs = require("fs");
const path = require("path");

// Parse command line arguments
const args = process.argv.slice(2);
let resourcePath = "./locales";

for (let i = 0; i < args.length; i++) {
  if (args[i] === "-p" && args[i + 1]) {
    resourcePath = args[i + 1];
  }
}

// Validate path exists
if (!fs.existsSync(resourcePath)) {
  console.error(`Error: Path "${resourcePath}" does not exist`);
  process.exit(1);
}

// Read all JSON files from the resource folder
const files = fs
  .readdirSync(resourcePath)
  .filter((file) => file.endsWith(".json"))
  .map((file) => ({
    name: file,
    path: path.join(resourcePath, file),
  }));

if (files.length === 0) {
  console.log("No JSON files found in the specified path");
  process.exit(0);
}

// Parse all JSON files
const translations = {};

try {
  for (const file of files) {
    const content = fs.readFileSync(file.path, "utf8");
    translations[file.name] = JSON.parse(content);
  }
} catch (err) {
  console.error(`Error reading/parsing JSON files: ${err.message}`);
  process.exit(1);
}

// Get all unique keys recursively
function getAllKeys(obj, prefix = "") {
  const keys = new Set();

  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;

    if (value !== null && typeof value === "object" && !Array.isArray(value)) {
      // Recursively get keys from nested objects
      getAllKeys(value, fullKey).forEach((k) => keys.add(k));
    } else {
      keys.add(fullKey);
    }
  }

  return keys;
}

// Get all keys from all translation files
const allKeys = new Set();
for (const fileContent of Object.values(translations)) {
  getAllKeys(fileContent).forEach((key) => allKeys.add(key));
}

// Check for missing translations in each file
function hasKey(obj, keyPath) {
  const keys = keyPath.split(".");
  let current = obj;

  for (const key of keys) {
    if (current === null || typeof current !== "object" || !(key in current)) {
      return false;
    }
    current = current[key];
  }

  return true;
}

// Generate summary
console.log("-- Summary --");
const results = [];

for (const [filename, content] of Object.entries(translations)) {
  let missingCount = 0;
  const missing = [];

  for (const key of allKeys) {
    if (!hasKey(content, key)) {
      missingCount++;
      missing.push(key);
    }
  }

  if (missingCount === 0) {
    console.log(`${filename}: all translations present ✓`);
    results.push({ filename, missingCount, status: "complete" });
  } else {
    console.log(
      `${filename}: missing ${missingCount} translation${missingCount !== 1 ? "s" : ""}: ${missing.join(", ")}`,
    );
    results.push({ filename, missingCount, status: "incomplete" });
  }
}

// Exit with appropriate code
const hasIssues = results.some((r) => r.missingCount > 0);
process.exit(hasIssues ? 1 : 0);
