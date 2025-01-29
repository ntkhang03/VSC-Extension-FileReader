const fs = require("fs");
const micromatch = require("micromatch");
const mime = require("mime-types");

/**
 * Lọc danh sách file path theo các glob patterns hoặc tên file cụ thể (include, exclude).
 *
 * @param {string[]} filePaths - Mảng các file path cần kiểm tra.
 * @param {Object} filters - Object chứa các patterns: { include: [], exclude: [] }.
 * @param {string[]} filters.include - Danh sách glob patterns hoặc tên file cụ thể cần bao gồm.
 * @param {string[]} filters.exclude - Danh sách glob patterns hoặc tên file cụ thể cần loại trừ.
 * @returns {string[]} - Danh sách các file hợp lệ.
 */
function filterFiles(filePaths, filters) {
  const { include = [], exclude = [] } = filters;

  // use micromatch
  return filePaths.filter((filePath) => {
    // Kiểm tra nếu filePath khớp include (nếu có)
    const isIncluded =
      include.length === 0 ||
      include.some(
        (pattern) =>
          micromatch(filePath, pattern).length || filePath.endsWith(pattern)
      );

    // Kiểm tra nếu filePath khớp exclude
    const isExcluded = exclude.some(
      (pattern) =>
        micromatch(filePath, pattern).length || filePath.endsWith(pattern)
    );

    // Chỉ giữ filePath nếu nó được include và không bị exclude
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
    const parts = path.split("\\"); // Tách đường dẫn thành các phần
    let currentNode = root;

    parts.forEach((part, index) => {
      // Kiểm tra xem node này đã tồn tại chưa
      let child = currentNode.children.find((child) => child.name === part);

      // Nếu node chưa tồn tại, tạo mới
      if (!child) {
        child = {
          name: part,
          type: index === parts.length - 1 ? "file" : "directory", // Nếu là phần cuối, là file
          children: []
        };
        currentNode.children.push(child);
      }

      // Chuyển đến node con để tiếp tục xây dựng cây
      currentNode = child;
    });
  });

  return root;
}

function isTextFile(filePath) {
  try {
    const type = mime.lookup(filePath);
    return type.startsWith("text/") || type.startsWith("application");
  } catch (err) {
    return false;
  }
}

module.exports = {
  filterFiles,
  readFileContent,
  createTreeStructure,
  createTreeStructureString,
  createFileTree,
  isTextFile
};
