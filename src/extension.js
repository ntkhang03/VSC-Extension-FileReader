const vscode = require("vscode");
const { handleReadMultipleFiles } = require("./handlers");
const { getFilters } = require("./settings");

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "fileReader.readFilesInFolder",
      handleReadMultipleFiles
    ),
    vscode.commands.registerCommand(
      "fileReader.readSelectedFiles",
      handleReadMultipleFiles
    ),
    vscode.workspace.onDidChangeConfiguration(() => {
      getFilters(true); // Refresh filters cache
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("fileReader.openFilterSettings", () => {
      vscode.commands.executeCommand(
        "workbench.action.openSettings",
        "extension.readFiles.filters"
      );
    })
  );
}

function deactivate() {}

module.exports = {
  activate,
  deactivate
};
