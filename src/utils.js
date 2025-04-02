const fs = require("fs");
const micromatch = require("micromatch");
const mime = require("mime-types");

// when mime.lookup(filePath) return false, will use this to check if file is text file
const extTextFiles = ["vue"];

/**
 * Filter the list of file paths based on glob patterns or specific file names (include, exclude).
 *
 * @param {string[]} filePaths - Array of file paths to be filtered.
 * @param {Object} filters - Object containing patterns: { include: [], exclude: [] }.
 * @param {string[]} filters.include - Array of glob patterns or specific file names to be included.
 * @param {string[]} filters.exclude - Array of glob patterns or specific file names to be excluded.
 * @returns {string[]} - Array of valid files.
 */
function filterFiles(filePaths, filters) {
  const { include = [], exclude = [] } = filters;

  // use micromatch
  return filePaths.filter((filePath) => {
    // Check if the filePath matches include (if any)
    const isIncluded =
      include.length === 0 ||
      include.some(
        (pattern) =>
          micromatch(filePath, pattern).length || filePath.endsWith(pattern)
      );

    // Check if the filePath matches exclude (if any)
    const isExcluded = exclude.some(
      (pattern) =>
        micromatch(filePath, pattern).length || filePath.endsWith(pattern)
    );

    // Check if the filePath should be included and not excluded
    return isIncluded && !isExcluded;
  });
}

function readFileContent(filePath) {
  try {
    return fs.readFileSync(filePath, "utf8");
  } catch (error) {
    return `Error reading file: ${error.message}`;
  }
}

function removeCommonPath(paths) {
  const commonPath = paths.reduce((acc, path) => {
    const parts = path.split(/[\\/]/);
    if (!acc) {
      return parts;
    }

    return acc.filter((part, index) => part === parts[index]);
  }, null);

  return paths.map((path) => {
    const parts = path.split(/[\\/]/);
    // Giữ lại phần cuối cùng của thư mục chung
    const commonLength = commonPath.length;
    const remainingParts = parts.slice(commonLength - 1); // Chỉ lấy phần sau thư mục chung cuối cùng
    return remainingParts.join("/");
  });
}

/**
 * Create a tree-like string representation of the file structure.
 *
 * This function generates a string representation of the directory structure, formatted
 * as a tree with appropriate indentation for nested directories and files.
 *
 * @param {Object} query - The parsed query object containing information about the repository and query parameters.
 * @param {Object} node - The current directory or file node being processed.
 * @param {string} prefix - A string used for indentation and formatting of the tree structure, by default "".
 * @param {boolean} isLast - A flag indicating whether the current node is the last in its directory, by default true.
 *
 * @returns {string} - A string representing the directory structure formatted as a tree.
 */
function createTreeStructure(query, node, prefix = "", isLast = true) {
  let tree = "";

  if (!node.name) {
    node.name = query.slug;
  }

  if (node.name) {
    const currentPrefix = isLast ? "└── " : "├── ";
    const name = node.type === "directory" ? node.name + "/" : node.name;
    tree += prefix + currentPrefix + name + "\n";
  }

  if (node.type === "directory") {
    // Adjust prefix only if we added a node name
    const newPrefix = node.name ? prefix + (isLast ? "    " : "│   ") : prefix;
    const children = node.children;
    for (let i = 0; i < children.length; i++) {
      tree += createTreeStructure(
        query,
        children[i],
        newPrefix,
        i === children.length - 1
      );
    }
  }

  return tree;
}

function createTreeStructureString(tree) {
  const query = {
    slug: "Directory Structure"
  };
  let treeStructure = createTreeStructure(query, tree);
  let parts = treeStructure.split("\n");
  parts.shift();
  parts = parts.map((part) => part.replace("    ", ""));
  treeStructure = parts.join("\n");

  return treeStructure;
}

function createFileTree(paths) {
  const root = { name: "", type: "directory", children: [] };

  paths.forEach((path) => {
    // split by \ or /
    const parts = path.split(/[\\/]/);
    let currentNode = root;

    parts.forEach((part, index) => {
      // Check if the node already exists
      let child = currentNode.children.find((child) => child.name === part);

      // If the node does not exist, create a new one
      if (!child) {
        child = {
          name: part,
          type: index === parts.length - 1 ? "file" : "directory", // If it is the last part, it is a file
          children: []
        };
        currentNode.children.push(child);
      }

      // Move to the child node to continue building the tree
      currentNode = child;
    });
  });

  return root;
}

function isTextFile(filePath = "") {
  try {
    const type = mime.lookup(filePath) || "";
    return (
      type.startsWith("text/") ||
      type.startsWith("application") ||
      extTextFiles.includes(filePath.split(".").pop())
    );
  } catch (err) {
    return false;
  }
}

module.exports = {
  filterFiles,
  removeCommonPath,
  readFileContent,
  createTreeStructure,
  createTreeStructureString,
  createFileTree,
  isTextFile
};
