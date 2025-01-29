const vscode = require("vscode");
const fs = require("fs");
const path = require("path");

const {
  filterFiles,
  readFileContent,
  createFileTree,
  createTreeStructureString,
  isTextFile
} = require("./utils");
const { getFilters } = require("./settings");

function readFilesRecursively(dirPath, filter) {
  let filePaths = [];

  const items = fs.readdirSync(dirPath);

  items.forEach((item) => {
    const fullPath = path.join(dirPath, item);
    if (filterFiles([fullPath], filter).length === 0) {
      return;
    }

    const stats = fs.statSync(fullPath);
    if (stats.isDirectory()) {
      filePaths = filePaths.concat(readFilesRecursively(fullPath, filter));
    } else if (stats.isFile()) {
      filePaths.push(fullPath);
    }
  });

  return filePaths;
}

async function handleReadFiles(uri, uris = null) {
  try {
    if (!uris) {
      uris = [uri];
    }

    console.log(uris);

    const filters = getFilters();
    const selectedFilter = await vscode.window.showQuickPick(
      filters.map((f) => f.name).concat("Without filter"),
      { placeHolder: "Select a filter or press Enter to skip." }
    );
    if (!selectedFilter) {
      return;
    }
    const filter = filters.find((f) => f.name === selectedFilter) || {
      include: ["**"]
    };

    const items = uris.map((uri) => uri.fsPath);

    let filePaths = [];
    items.forEach((item) => {
      if (fs.statSync(item).isFile()) {
        filePaths.push(item);
      } else {
        filePaths.push(...readFilesRecursively(item, filter));
      }
    });

    // remove duplicates
    filePaths = [...new Set(filePaths)].filter((filePath) => {
      return isTextFile(filePath);
    });

    // loading notification
    const process = vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Notification,
        title: "Reading files...",
        cancellable: true
      },
      async (progress) => {
        progress.report({ increment: 0 });
      }
    );

    // when click cancel
    let isCanceled = false;
    process.then((value) => {
      try {
        value.onCancellationRequested(() => {
          isCanceled = true;
        });
      } catch (error) {}
    });

    const filteredFilePaths = filePaths.filter((item) =>
      fs.statSync(item).isFile()
    );
    const arr = [];

    for (const filePath of filteredFilePaths) {
      if (isCanceled) {
        return;
      }

      // change progress content
      process.then((value) => {
        try {
          value.report({ message: `Reading ${filePath}` });
        } catch (error) {}
      });

      arr.push(
        `================================================\n` +
          `File: ${filePath}\n` +
          `================================================\n` +
          `${readFileContent(filePath)}\n`
      );
    }

    const output = arr.join("\n");
    const treeFolder = createFileTree(filePaths);

    vscode.workspace
      .openTextDocument({
        content: `Directory Structure:\n${createTreeStructureString(treeFolder)}\n\n${output}`
      })
      .then((doc) => vscode.window.showTextDocument(doc));
  } catch (error) {
    console.log(error);
  }
}

async function handleReadMultipleFiles(_, uris) {
  await handleReadFiles(null, uris);
}

module.exports = { handleReadMultipleFiles };
